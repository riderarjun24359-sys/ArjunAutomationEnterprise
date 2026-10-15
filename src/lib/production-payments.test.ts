import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import {
    buildPaymentCutoverStatus,
    isLiveStripeKey,
    isStripeWebhookSecretConfigured,
    verifyStripeWebhookSignature,
} from "./production-payments";

/** Fixture-only secret. Never a real credential; used to build HMAC vectors locally. */
const FIXTURE_SECRET = "whsec_test_fixture_only_not_a_real_secret";
const PAYLOAD = JSON.stringify({ id: "evt_fixture", type: "payment_intent.succeeded" });
const NOW = 1760280000000;

function sign(payload: string, secret: string, atMs: number): string {
    const t = Math.floor(atMs / 1000);
    const v1 = createHmac("sha256", secret).update(`${t}.${payload}`, "utf8").digest("hex");
    return `t=${t},v1=${v1}`;
}

describe("verifyStripeWebhookSignature (real HMAC vectors, fixture secret)", () => {
    it("accepts a correctly signed fresh event", () => {
        const r = verifyStripeWebhookSignature({ payload: PAYLOAD, signatureHeader: sign(PAYLOAD, FIXTURE_SECRET, NOW), secret: FIXTURE_SECRET, nowMs: NOW });
        expect(r).toEqual({ ok: true });
    });

    it("rejects wrong-secret signatures with constant-time compare", () => {
        const r = verifyStripeWebhookSignature({ payload: PAYLOAD, signatureHeader: sign(PAYLOAD, "whsec_other_fixture", NOW), secret: FIXTURE_SECRET, nowMs: NOW });
        expect(r).toEqual({ ok: false, reason: "signature_mismatch" });
    });

    it("rejects tampered payloads", () => {
        const header = sign(PAYLOAD, FIXTURE_SECRET, NOW);
        const r = verifyStripeWebhookSignature({ payload: `${PAYLOAD} `, signatureHeader: header, secret: FIXTURE_SECRET, nowMs: NOW });
        expect(r.ok).toBe(false);
    });

    it("fails closed without secret or header", () => {
        expect(verifyStripeWebhookSignature({ payload: PAYLOAD, signatureHeader: sign(PAYLOAD, FIXTURE_SECRET, NOW), secret: "" })).toEqual({
            ok: false,
            reason: "webhook_secret_missing",
        });
        expect(verifyStripeWebhookSignature({ payload: PAYLOAD, signatureHeader: null, secret: FIXTURE_SECRET, nowMs: NOW })).toEqual({
            ok: false,
            reason: "signature_header_missing",
        });
    });

    it("rejects malformed headers and stale timestamps", () => {
        expect(verifyStripeWebhookSignature({ payload: PAYLOAD, signatureHeader: "nope", secret: FIXTURE_SECRET, nowMs: NOW }).reason).toBe(
            "signature_malformed",
        );
        const stale = sign(PAYLOAD, FIXTURE_SECRET, NOW - 10 * 60 * 1000);
        expect(
            verifyStripeWebhookSignature({ payload: PAYLOAD, signatureHeader: stale, secret: FIXTURE_SECRET, nowMs: NOW }).reason,
        ).toBe("timestamp_out_of_tolerance");
    });

    it("never throws on hostile input", () => {
        expect(() =>
            verifyStripeWebhookSignature({ payload: PAYLOAD, signatureHeader: "t=abc,v1=zzz", secret: FIXTURE_SECRET, nowMs: NOW }),
        ).not.toThrow();
    });
});

const envOf = (partial: Record<string, string>): NodeJS.ProcessEnv => partial as unknown as NodeJS.ProcessEnv;

describe("payment configuration presence (names only, never values)", () => {
    it("reports unconfigured honestly with empty env", () => {
        expect(isStripeWebhookSecretConfigured(envOf({}))).toBe(false);
        expect(isLiveStripeKey(envOf({}))).toBe(false);
        const status = buildPaymentCutoverStatus(envOf({}));
        expect(status.gatewayConfigured).toBe(false);
        expect(status.webhookSecretConfigured).toBe(false);
        expect(status.liveMode).toBe(false);
    });

    it("detects live keys without exposing them", () => {
        expect(isLiveStripeKey(envOf({ STRIPE_SECRET_KEY: "sk_live_fixture" }))).toBe(true);
        expect(isLiveStripeKey(envOf({ STRIPE_SECRET_KEY: "sk_test_fixture" }))).toBe(false);
    });
});
