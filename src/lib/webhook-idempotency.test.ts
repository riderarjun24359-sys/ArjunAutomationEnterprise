import { describe, it, expect } from "vitest";
import {
    checkMemoryDuplicate,
    clearMemoryIdempotencyForTests,
    createSupabaseIdempotencyStore,
    extractRazorpaySettlementRef,
    extractStripeSettlementRef,
    parseRazorpayWebhookEvent,
    parseWebhookEvent,
    resolveWebhookDedupe,
    selectWebhookProvider,
} from "./webhook-idempotency";
import { verifyRazorpayWebhookSignature } from "./razorpay-payments";
import { createHmac } from "node:crypto";

describe("webhook-idempotency", () => {
    it("parses provider event id and type", () => {
        expect(parseWebhookEvent(JSON.stringify({ id: "evt_1", type: "payment.succeeded" }), "stripe")).toEqual({
            provider: "stripe",
            eventId: "evt_1",
            eventType: "payment.succeeded",
        });
        expect(parseWebhookEvent("not-json", "stripe")).toBeNull();
        expect(parseWebhookEvent(JSON.stringify({ type: "x" }), "stripe")).toBeNull();
    });

    it("treats replays as duplicates within TTL in memory fallback", () => {
        clearMemoryIdempotencyForTests();
        const ref = { provider: "stripe", eventId: "evt_9", eventType: "t" };
        expect(checkMemoryDuplicate(ref, 1000)).toBe("new");
        expect(checkMemoryDuplicate(ref, 2000)).toBe("duplicate");
        expect(checkMemoryDuplicate(ref, 1000 + 25 * 60 * 60 * 1000)).toBe("new");
        clearMemoryIdempotencyForTests();
    });

    it("maps unique-violation to duplicate and surfaces other db errors", async () => {
        const dupStore = createSupabaseIdempotencyStore(async () => ({ code: "23505" }));
        await expect(dupStore.checkDuplicate({ provider: "s", eventId: "e", eventType: "t" })).resolves.toBe(true);
        const newStore = createSupabaseIdempotencyStore(async () => null);
        await expect(newStore.checkDuplicate({ provider: "s", eventId: "e", eventType: "t" })).resolves.toBe(false);
        const badStore = createSupabaseIdempotencyStore(async () => ({ code: "500" }));
        await expect(badStore.checkDuplicate({ provider: "s", eventId: "e", eventType: "t" })).rejects.toThrow();
    });

    it("reports the durable store when it decides", async () => {
        clearMemoryIdempotencyForTests();
        const ref = { provider: "stripe", eventId: "evt_dur", eventType: "t" };
        const newStore = createSupabaseIdempotencyStore(async () => null);
        await expect(resolveWebhookDedupe(ref, newStore)).resolves.toEqual({ decision: "new", store: "database", degraded: false });
        const dupStore = createSupabaseIdempotencyStore(async () => ({ code: "23505" }));
        await expect(resolveWebhookDedupe(ref, dupStore)).resolves.toEqual({ decision: "duplicate", store: "database", degraded: false });
    });

    it("falls back to memory and reports degraded when the durable store fails", async () => {
        clearMemoryIdempotencyForTests();
        const ref = { provider: "stripe", eventId: "evt_fail", eventType: "t" };
        const badStore = createSupabaseIdempotencyStore(async () => ({ code: "500" }));
        const first = await resolveWebhookDedupe(ref, badStore);
        expect(first).toEqual({ decision: "new", store: "memory", degraded: true });
        const second = await resolveWebhookDedupe(ref, badStore);
        expect(second).toEqual({ decision: "duplicate", store: "memory", degraded: true });
    });

    it("uses memory (not degraded) when no durable store is configured", async () => {
        clearMemoryIdempotencyForTests();
        const ref = { provider: "stripe", eventId: "evt_mem", eventType: "t" };
        await expect(resolveWebhookDedupe(ref, null)).resolves.toEqual({ decision: "new", store: "memory", degraded: false });
    });

    it("extracts settlement references from Stripe payloads without throwing", () => {
        expect(
            extractStripeSettlementRef({ data: { object: { metadata: { invoice_number: "INV-7" }, amount_received: 5000, currency: "inr" } } }),
        ).toEqual({ reference: "INV-7", amountMinor: 5000, currency: "inr" });
        expect(
            extractStripeSettlementRef({ data: { object: { description: "INV-8", amount: 100 } } }),
        ).toEqual({ reference: "INV-8", amountMinor: 100, currency: null });
        expect(extractStripeSettlementRef({ nope: true })).toEqual({ reference: null, amountMinor: null, currency: null });
        expect(extractStripeSettlementRef(null)).toEqual({ reference: null, amountMinor: null, currency: null });
    });

    it("selects the webhook provider deterministically from signature headers", () => {
        expect(selectWebhookProvider({ stripeSignature: "t=1,v1=abc", razorpaySignature: null })).toBe("stripe");
        expect(selectWebhookProvider({ stripeSignature: null, razorpaySignature: "sig" })).toBe("razorpay");
        // Stripe wins when both are present so the route never branches ambiguously.
        expect(selectWebhookProvider({ stripeSignature: "t=1,v1=abc", razorpaySignature: "sig" })).toBe("stripe");
        expect(selectWebhookProvider({ stripeSignature: null, razorpaySignature: null })).toBeNull();
        expect(selectWebhookProvider({ stripeSignature: "", razorpaySignature: "" })).toBeNull();
    });

    it("parses Razorpay deliveries into provider-namespaced idempotency refs", () => {
        const captured = JSON.stringify({
            event: "payment.captured",
            payload: { payment: { entity: { id: "pay_N1", amount: 50000, currency: "INR" } } },
        });
        expect(parseRazorpayWebhookEvent(captured)).toEqual({
            provider: "razorpay",
            eventId: "payment.captured:pay_N1",
            eventType: "payment.captured",
        });
        const authorized = JSON.stringify({
            event: "payment.authorized",
            payload: { payment: { entity: { id: "pay_N1", amount: 50000, currency: "INR" } } },
        });
        // Same entity, different event: must not collide for idempotency.
        expect(parseRazorpayWebhookEvent(authorized)?.eventId).not.toBe(
            parseRazorpayWebhookEvent(captured)?.eventId,
        );
        expect(parseRazorpayWebhookEvent("not-json")).toBeNull();
        expect(parseRazorpayWebhookEvent(JSON.stringify({ event: "payment.captured", payload: {} }))).toBeNull();
        expect(parseRazorpayWebhookEvent(JSON.stringify({ payload: { payment: { entity: { id: "pay_N1" } } } }))).toBeNull();
    });

    it("extracts settlement references from Razorpay payloads without throwing", () => {
        expect(
            extractRazorpaySettlementRef({
                event: "payment.captured",
                payload: { payment: { entity: { id: "pay_N1", amount: 50000, currency: "INR", notes: { invoice_number: "INV-9" } } } },
            }),
        ).toEqual({ reference: "INV-9", amountMinor: 50000, currency: "INR" });
        expect(
            extractRazorpaySettlementRef({
                event: "order.paid",
                payload: { order: { entity: { id: "order_N2", amount: 100, description: "INV-10" } } },
            }),
        ).toEqual({ reference: "INV-10", amountMinor: 100, currency: null });
        expect(extractRazorpaySettlementRef({ event: "payment.captured", payload: {} })).toEqual({
            reference: null,
            amountMinor: null,
            currency: null,
        });
        expect(extractRazorpaySettlementRef({ nope: true })).toEqual({ reference: null, amountMinor: null, currency: null });
        expect(extractRazorpaySettlementRef(null)).toEqual({ reference: null, amountMinor: null, currency: null });
    });

    it("verifies Razorpay webhook signatures with real HMAC vectors", () => {
        const secret = "rzp_test_secret";
        const payload = JSON.stringify({ event: "payment.captured", payload: {} });
        const good = createHmac("sha256", secret).update(payload, "utf8").digest("hex");
        expect(verifyRazorpayWebhookSignature(payload, good, secret)).toBe(true);
        expect(verifyRazorpayWebhookSignature(payload, "deadbeef", secret)).toBe(false);
        expect(verifyRazorpayWebhookSignature(payload, good, "")).toBe(false);
        expect(verifyRazorpayWebhookSignature(payload, null, secret)).toBe(false);
    });
});
