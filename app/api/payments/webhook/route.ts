import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { verifyStripeWebhookSignature } from "@/src/lib/production-payments";
import { opsLog, enqueueAlert } from "@/src/lib/ops-monitoring";

/**
 * Stripe webhook receiver — verifies signature; acknowledges event.
 * Does not mutate Billing Finance domain tables (lifecycle handled by existing OS).
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

    let eventType = "unknown";
    try {
        const parsed = JSON.parse(payload) as { type?: string; id?: string };
        eventType = parsed.type ?? "unknown";
        opsLog("info", "Payment webhook accepted", "api/payments/webhook", {
            type: eventType,
            id: parsed.id,
        });
    } catch {
        opsLog("info", "Payment webhook accepted (non-JSON body)", "api/payments/webhook");
    }

    return NextResponse.json({ received: true, type: eventType }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
