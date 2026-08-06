/**
 * Production payments cutover — gateway + webhook security contracts.
 * Does not modify Billing Finance business modules.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const PAYMENT_WEBHOOK_PATH = "/api/payments/webhook";

export function isPaymentGatewayConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    return Boolean(env.STRIPE_SECRET_KEY?.trim() && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim());
}

export function isStripeWebhookSecretConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    return Boolean(env.STRIPE_WEBHOOK_SECRET?.trim());
}

export function isLiveStripeKey(env: NodeJS.ProcessEnv = process.env): boolean {
    return Boolean(env.STRIPE_SECRET_KEY?.trim().startsWith("sk_live_"));
}

/**
 * Verify Stripe-compatible webhook signature (t=timestamp,v1=signature).
 * Uses STRIPE_WEBHOOK_SECRET; rejects when secret missing or signature invalid.
 */
export function verifyStripeWebhookSignature(input: {
    payload: string;
    signatureHeader: string | null;
    secret: string;
    toleranceSeconds?: number;
    nowMs?: number;
}): { ok: boolean; reason?: string } {
    if (!input.secret) return { ok: false, reason: "webhook_secret_missing" };
    if (!input.signatureHeader) return { ok: false, reason: "signature_header_missing" };

    const parts = Object.fromEntries(
        input.signatureHeader.split(",").map((piece) => {
            const [k, ...rest] = piece.trim().split("=");
            return [k, rest.join("=")];
        }),
    ) as Record<string, string>;

    const timestamp = parts.t;
    const signature = parts.v1;
    if (!timestamp || !signature) return { ok: false, reason: "signature_malformed" };

    const tolerance = input.toleranceSeconds ?? 300;
    const nowMs = input.nowMs ?? Date.now();
    const tsMs = Number(timestamp) * 1000;
    if (!Number.isFinite(tsMs) || Math.abs(nowMs - tsMs) > tolerance * 1000) {
        return { ok: false, reason: "timestamp_out_of_tolerance" };
    }

    const signedPayload = `${timestamp}.${input.payload}`;
    const expected = createHmac("sha256", input.secret).update(signedPayload, "utf8").digest("hex");

    try {
        const a = Buffer.from(expected, "utf8");
        const b = Buffer.from(signature, "utf8");
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return { ok: false, reason: "signature_mismatch" };
        }
    } catch {
        return { ok: false, reason: "signature_compare_failed" };
    }

    return { ok: true };
}

export interface PaymentCutoverStatus {
    gatewayConfigured: boolean;
    webhookSecretConfigured: boolean;
    liveMode: boolean;
    webhookPath: string;
    subscriptionLifecycleSurface: boolean;
    invoiceFlowSurface: boolean;
}

export function buildPaymentCutoverStatus(env: NodeJS.ProcessEnv = process.env): PaymentCutoverStatus {
    return {
        gatewayConfigured: isPaymentGatewayConfigured(env),
        webhookSecretConfigured: isStripeWebhookSecretConfigured(env),
        liveMode: isLiveStripeKey(env),
        webhookPath: PAYMENT_WEBHOOK_PATH,
        subscriptionLifecycleSurface: true,
        invoiceFlowSurface: true,
    };
}
