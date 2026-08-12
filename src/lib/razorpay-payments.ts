import { createHmac, timingSafeEqual } from "node:crypto";

export const RAZORPAY_CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
export const RAZORPAY_WEBHOOK_PATH = "/api/payments/webhook";
export const RAZORPAY_CURRENCY = process.env.RAZORPAY_CURRENCY?.trim().toUpperCase() || "INR";

export type PaidPlanId = "starter" | "professional";

const PLAN_ENV_KEYS: Record<PaidPlanId, string> = {
    starter: "RAZORPAY_STARTER_AMOUNT_MINOR",
    professional: "RAZORPAY_PROFESSIONAL_AMOUNT_MINOR",
};

export interface RazorpayPlanConfig {
    planId: PaidPlanId;
    amountMinor: number;
    currency: string;
}

export function getRazorpayKeyId(env: NodeJS.ProcessEnv = process.env): string {
    return env.RAZORPAY_KEY_ID?.trim() ?? "";
}

export function getRazorpayKeySecret(env: NodeJS.ProcessEnv = process.env): string {
    return env.RAZORPAY_KEY_SECRET?.trim() ?? "";
}

export function getRazorpayWebhookSecret(env: NodeJS.ProcessEnv = process.env): string {
    return env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? "";
}

export function isRazorpayConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    return Boolean(getRazorpayKeyId(env) && getRazorpayKeySecret(env));
}

export function isRazorpayWebhookConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    return Boolean(getRazorpayWebhookSecret(env));
}

export function getRazorpayPlanConfig(planId: string, env: NodeJS.ProcessEnv = process.env): RazorpayPlanConfig | null {
    if (planId !== "starter" && planId !== "professional") return null;
    const raw = env[PLAN_ENV_KEYS[planId]]?.trim() ?? "";
    const amountMinor = Number(raw);
    if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) return null;
    return { planId, amountMinor, currency: (env.RAZORPAY_CURRENCY?.trim().toUpperCase() || "INR") };
}

export function verifyRazorpayPaymentSignature(input: {
    orderId: string;
    paymentId: string;
    signature: string;
    secret: string;
}): boolean {
    if (!input.orderId || !input.paymentId || !input.signature || !input.secret) return false;
    const expected = createHmac("sha256", input.secret)
        .update(`${input.orderId}|${input.paymentId}`, "utf8")
        .digest("hex");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(input.signature, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyRazorpayWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
    if (!signature || !secret) return false;
    const expected = createHmac("sha256", secret).update(payload, "utf8").digest("hex");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
}

export function razorpayAuthHeader(keyId = getRazorpayKeyId(), keySecret = getRazorpayKeySecret()): string {
    return `Basic ${Buffer.from(`${keyId}:${keySecret}`, "utf8").toString("base64")}`;
}

export async function razorpayRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://api.razorpay.com/v1${path}`, {
        ...init,
        headers: {
            Authorization: razorpayAuthHeader(),
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
        },
        signal: init.signal ?? AbortSignal.timeout(15_000),
        cache: "no-store",
    });

    const text = await response.text();
    let data: unknown = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { error: { description: text || "Razorpay returned an invalid response" } };
    }

    if (!response.ok) {
        const description =
            typeof data === "object" && data && "error" in data && typeof data.error === "object" && data.error && "description" in data.error
                ? String(data.error.description)
                : `Razorpay request failed with HTTP ${response.status}`;
        throw new Error(description);
    }

    return data as T;
}
