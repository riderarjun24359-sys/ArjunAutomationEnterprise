import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { verifyStripeWebhookSignature } from "@/src/lib/production-payments";
import { verifyRazorpayWebhookSignature } from "@/src/lib/razorpay-payments";
import { opsLog, enqueueAlert } from "@/src/lib/ops-monitoring";
import {
    createSupabaseIdempotencyStore,
    extractRazorpaySettlementRef,
    extractStripeSettlementRef,
    parseRazorpayWebhookEvent,
    parseWebhookEvent,
    resolveWebhookDedupe,
    selectWebhookProvider,
    type WebhookEventRef,
} from "@/src/lib/webhook-idempotency";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { attemptReconciliation } from "@/src/modules/finance/lib/reconciliation";
import { summarizeWebhookReconciliation } from "@/src/lib/webhook-response";

/**
 * Unified payment webhook receiver — verifies the provider signature,
 * deduplicates deliveries, acknowledges.
 *
 * Two provider paths share the pipeline below; the `provider` field in every
 * response names the path that decided:
 * - Stripe: `stripe-signature` header (`t=…,v1=…`), HMAC-SHA256 with
 *   `STRIPE_WEBHOOK_SECRET`.
 * - Razorpay: `x-razorpay-signature` header, HMAC-SHA256 of the raw payload
 *   with `RAZORPAY_WEBHOOK_SECRET`.
 * Stripe takes precedence when both headers are present.
 *
 * Honesty contract (no paid-provider claims beyond what is proven):
 * - Signature verification is mandatory; failures are 400 + alerted. When no
 *   provider secret is configured at all, the reason stays
 *   `webhook_secret_missing` (the endpoint's long-standing fail-closed
 *   contract); a configured secret with a bad/absent signature reports the
 *   signature reason instead.
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
    const rate = await checkRateLimit(`payments-webhook:${ip}`, 120, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const payload = await request.text();
    const stripeSignature = request.headers.get("stripe-signature");
    const razorpaySignature = request.headers.get("x-razorpay-signature");
    const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
    const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? "";

    // No provider secret configured at all: fail closed with the endpoint's
    // long-standing `webhook_secret_missing` contract (never probe further).
    if (!stripeSecret && !razorpaySecret) {
        opsLog("warn", "Payment webhook rejected", "api/payments/webhook", { reason: "webhook_secret_missing" });
        enqueueAlert("warning", "Payment webhook rejected", "webhook_secret_missing", "payments-webhook");
        return NextResponse.json({ error: "Invalid webhook signature", reason: "webhook_secret_missing" }, { status: 400 });
    }

    const provider = selectWebhookProvider({ stripeSignature, razorpaySignature });

    let event: WebhookEventRef | null = null;
    let verifiedOk = false;
    let verifiedReason: string | undefined;
    if (provider === "stripe") {
        const verified = verifyStripeWebhookSignature({ payload, signatureHeader: stripeSignature, secret: stripeSecret });
        verifiedOk = verified.ok;
        verifiedReason = verified.reason;
        if (verified.ok) event = parseWebhookEvent(payload, "stripe");
    } else if (provider === "razorpay") {
        if (!razorpaySecret) {
            verifiedReason = "webhook_secret_missing";
        } else {
            const ok = verifyRazorpayWebhookSignature(payload, razorpaySignature, razorpaySecret);
            verifiedOk = ok;
            verifiedReason = ok ? undefined : "signature_mismatch";
            if (ok) event = parseRazorpayWebhookEvent(payload);
        }
    } else {
        verifiedReason = "signature_header_missing";
    }

    if (!verifiedOk) {
        opsLog("warn", "Payment webhook rejected", "api/payments/webhook", { reason: verifiedReason, provider: provider ?? "none" });
        enqueueAlert("warning", "Payment webhook rejected", verifiedReason ?? "invalid signature", "payments-webhook");
        return NextResponse.json({ error: "Invalid webhook signature", reason: verifiedReason }, { status: 400 });
    }

    if (!event) {
        opsLog("error", "Payment webhook payload parse error", "api/payments/webhook", { provider });
        return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // Verified above, so the provider is decided here; the guard below only
    // narrows the type for the compiler (unreachable in practice).
    if (!provider) {
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
        return NextResponse.json({ received: true, provider, status: "duplicate", dedupe, fulfillment: "manual-reconciliation" }, { status: 200 });
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
            const ref = provider === "razorpay" ? extractRazorpaySettlementRef(raw) : extractStripeSettlementRef(raw);
            reconciliation = await attemptReconciliation(
                { provider, eventId: event.eventId, eventType: event.eventType, reference: ref.reference, amountMinor: ref.amountMinor, currency: ref.currency },
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
        { received: true, provider, type: event.eventType, dedupe, fulfillment: "manual-reconciliation", reconciliation: summarizeWebhookReconciliation(reconciliation) },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
