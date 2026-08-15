import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { verifyStripeWebhookSignature } from "@/src/lib/production-payments";
import { opsLog, enqueueAlert } from "@/src/lib/ops-monitoring";
import { getRepositoryClient } from "@/src/modules/database/lib/repository-client";

/**
 * Stripe webhook receiver — verifies signature; acknowledges event.
 * Idempotent processing ensures events are not processed twice via a dedicated idempotency table.
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

    let eventId = "unknown";
    let eventType = "unknown";
    try {
        const parsed = JSON.parse(payload) as { type?: string; id?: string };
        eventId = parsed.id ?? "unknown";
        eventType = parsed.type ?? "unknown";

        // Atomic Idempotency Check
        const client = getRepositoryClient();
        if (client) {
            const { error } = await client
                .from("webhook_idempotency")
                .insert({ event_id: eventId, provider: "stripe" });

            if (error) {
                // Assuming 23505 is unique_violation (Postgres code)
                if (error.code === "23505") {
                    opsLog("info", "Payment webhook skipped (duplicate)", "api/payments/webhook", { eventId, type: eventType });
                    return NextResponse.json({ received: true, status: "duplicate" }, { status: 200 });
                }
                opsLog("error", "Database error checking webhook idempotency", "api/payments/webhook", { error: error.message });
            }
        }

        opsLog("info", "Payment webhook accepted", "api/payments/webhook", {
            type: eventType,
            id: eventId,
        });
    } catch (e) {
        opsLog("error", "Payment webhook payload parse error", "api/payments/webhook", { error: String(e) });
        return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    return NextResponse.json({ received: true, type: eventType }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
