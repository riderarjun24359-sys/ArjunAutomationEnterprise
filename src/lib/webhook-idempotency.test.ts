import { describe, it, expect } from "vitest";
import {
    checkMemoryDuplicate,
    clearMemoryIdempotencyForTests,
    createSupabaseIdempotencyStore,
    extractStripeSettlementRef,
    parseWebhookEvent,
    resolveWebhookDedupe,
} from "./webhook-idempotency";

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
});
