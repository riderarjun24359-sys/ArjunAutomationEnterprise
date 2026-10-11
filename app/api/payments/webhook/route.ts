import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { verifyStripeWebhookSignature } from "@/src/lib/production-payments";
import { opsLog, enqueueAlert } from "@/src/lib/ops-monitoring";
import {
    createSupabaseIdempotencyStore,
    extractStripeSettlementRef,
    parseWebhookEvent,
    resolveWebhookDedupe,
} from "@/src/lib/webhook-idempotency";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { attemptReconciliation } from "@/src/modules/finance/lib/reconciliation";

/**
 * Stripe webhook receiver — verifies signature, deduplicates deliveries, acknowledges.
 *
 * Honesty contract (no paid-provider claims beyond what is proven):
 * - Signature verification is mandatory; failures are 400 + alerted.
 * - Duplicates are answered 200 `duplicate` and never processed twice. The
 *   `dedupe` field reports which store decided: `database` (durable, when
 *   secure storage is configured) or `memory` (single-instance fallback — also
 *   used, with a degraded alert, if the durable store errors).
 * - `fulfillment` is always `manual-reconciliation`: this route records
 *   receipt only. Marking invoices paid happens through the finance module's
 *   manual payment-confirmation path until a provider-to-invoice mapping with
 *   reconciliation tests is implemented and configured. Never trust a browser
 *   redirect — only signed provider events reach this handler.
 * - `reconciliation` reports a read-only match attempt against open invoices
 *   (matched candidate vs discrepancy). A match is input for human
 *   confirmation, never settlement proof.
 */
export async function POST(request: Request) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`payments-webhook:${ip}`, 120, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
    const payload = await request.text();
    const signatureHeader = request.headers.get("stripe-signature");
    const verified = verifyStripeWebhookSignature({ payload, signatureHeader, secret });

    if (!verified.ok) {
        opsLog("warn", "Payment webhook rejected", "api/payments/webhook", { reason: verified.reason });
        enqueueAlert("warning", "Payment webhook rejected", verified.reason ?? "invalid signature", "payments-webhook");
        return NextResponse.json({ error: "Invalid webhook signature", reason: verified.reason }, { status: 400 });
    }

    const event = parseWebhookEvent(payload, "stripe");
    if (!event) {
        opsLog("error", "Payment webhook payload parse error", "api/payments/webhook", {});
        return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    const serviceClient = getServiceRoleClient();
    const store = serviceClient
        ? createSupabaseIdempotencyStore(async (row) => {
              const { error } = await serviceClient.from("webhook_idempotency").insert(row);
              return error ? { code: error.code } : null;
          })
        : null;

    // `dedupe` always names the store that decided. A durable-store failure falls
    // back to the bounded in-memory guard and is reported as `memory` (degraded),
    // never silently misreported as a durable `database` dedupe.
    const dedupeOutcome = await resolveWebhookDedupe(event, store);
    const dedupe = dedupeOutcome.store;
    if (dedupeOutcome.degraded) {
        opsLog("error", "Durable idempotency store failed; deduped in memory", "api/payments/webhook", { eventId: event.eventId });
        enqueueAlert("warning", "Webhook dedupe degraded to memory", "Durable idempotency store failed; see logs", "payments-webhook");
    } else if (!serviceClient) {
        opsLog("warn", "Payment webhook deduped in memory only; secure storage unconfigured", "api/payments/webhook", { eventId: event.eventId });
    }

    if (dedupeOutcome.decision === "duplicate") {
        opsLog("info", "Payment webhook skipped (duplicate)", "api/payments/webhook", { eventId: event.eventId, type: event.eventType, dedupe });
        return NextResponse.json({ received: true, status: "duplicate", dedupe, fulfillment: "manual-reconciliation" }, { status: 200 });
    }

    opsLog("info", "Payment webhook accepted", "api/payments/webhook", {
        type: event.eventType,
        id: event.eventId,
    });

    // Read-only reconciliation attempt: match the settlement against open
    // invoices and report the outcome. State never changes here — a `matched`
    // outcome is a candidate for HUMAN confirmation in the finance module,
    // never proof of settlement on its own.
    let reconciliation: unknown = { attempted: false, reason: "secure storage unconfigured" };
    if (serviceClient) {
        try {
            const raw = JSON.parse(payload) as unknown;
            const ref = extractStripeSettlementRef(raw);
            reconciliation = await attemptReconciliation(
                { provider: "stripe", eventId: event.eventId, eventType: event.eventType, reference: ref.reference, amountMinor: ref.amountMinor, currency: ref.currency },
                async () => {
                    const { data, error } = await serviceClient
                        .from("invoices")
                        .select("id,number,total,amount_paid,currency,status,organization_id")
                        .limit(500);
                    if (error) throw new Error(error.message);
                    return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
                        id: String(row.id),
                        number: String(row.number ?? ""),
                        total: Number(row.total ?? 0),
                        amountPaid: Number(row.amount_paid ?? 0),
                        currency: typeof row.currency === "string" ? row.currency : null,
                        status: String(row.status ?? ""),
                        organizationId: typeof row.organization_id === "string" ? row.organization_id : null,
                    }));
                },
            );
            opsLog("info", "Payment webhook reconciliation attempted", "api/payments/webhook", { eventId: event.eventId, reconciliation });
        } catch (e) {
            reconciliation = { attempted: false, reason: e instanceof Error ? e.message : String(e) };
            opsLog("error", "Payment webhook reconciliation failed", "api/payments/webhook", { error: e instanceof Error ? e.message : String(e) });
        }
    }

    return NextResponse.json(
        { received: true, type: event.eventType, dedupe, fulfillment: "manual-reconciliation", reconciliation },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
