import { describe, it, expect } from "vitest";
import { attemptReconciliation, authorizeRefund, reconcileProviderEvent } from "./reconciliation";

const INVOICES = [
    { id: "i1", number: "INV-100", total: 1180, amountPaid: 0, currency: "INR", status: "sent" },
    { id: "i2", number: "INV-101", total: 500, amountPaid: 200, currency: "INR", status: "sent" },
    { id: "i3", number: "INV-102", total: 500, amountPaid: 500, currency: "INR", status: "paid" },
];

describe("reconcileProviderEvent", () => {
    it("matches exact reference + outstanding amount", () => {
        expect(
            reconcileProviderEvent(
                { provider: "stripe", eventId: "evt_1", eventType: "payment.succeeded", reference: " inv-100 ", amountMinor: 118000, currency: "inr" },
                INVOICES,
            ),
        ).toEqual({ kind: "matched", invoiceId: "i1", invoiceNumber: "INV-100" });
    });

    it("matches partial balances against the remainder", () => {
        const out = reconcileProviderEvent(
            { provider: "razorpay", eventId: "pay_1", eventType: "payment.captured", reference: "INV-101", amountMinor: 30000 },
            INVOICES,
        );
        expect(out).toEqual({ kind: "matched", invoiceId: "i2", invoiceNumber: "INV-101" });
    });

    it("reports discrepancies instead of receiving money", () => {
        expect(reconcileProviderEvent({ provider: "stripe", eventId: "e", eventType: "t" }, INVOICES).kind).toBe("discrepancy");
        expect(
            reconcileProviderEvent({ provider: "stripe", eventId: "e", eventType: "t", reference: "INV-999", amountMinor: 1 }, INVOICES).kind,
        ).toBe("discrepancy");
        expect(
            reconcileProviderEvent({ provider: "stripe", eventId: "e", eventType: "t", reference: "INV-102", amountMinor: 50000 }, INVOICES).kind,
        ).toBe("discrepancy");
        expect(
            reconcileProviderEvent({ provider: "stripe", eventId: "e", eventType: "t", reference: "INV-100", amountMinor: 1 }, INVOICES).kind,
        ).toBe("discrepancy");
        expect(
            reconcileProviderEvent({ provider: "stripe", eventId: "e", eventType: "t", reference: "INV-100", amountMinor: 118000, currency: "USD" }, INVOICES).kind,
        ).toBe("discrepancy");
    });
});

describe("attemptReconciliation", () => {
    const invoices = async () => INVOICES;
    it("matches settlement events against fetched invoices", async () => {
        const out = await attemptReconciliation(
            { provider: "stripe", eventId: "e", eventType: "payment_intent.succeeded", reference: "INV-100", amountMinor: 118000, currency: "INR" },
            invoices,
        );
        expect(out).toEqual({ attempted: true, outcome: { kind: "matched", invoiceId: "i1", invoiceNumber: "INV-100" } });
    });

    it("skips non-settlement events and reports lookup failures", async () => {
        expect((await attemptReconciliation({ provider: "stripe", eventId: "e", eventType: "customer.created" }, invoices)).attempted).toBe(false);
        const failing = await attemptReconciliation(
            { provider: "stripe", eventId: "e", eventType: "charge.succeeded", reference: "INV-100" },
            async () => { throw new Error("db down"); },
        );
        expect(failing).toEqual({ attempted: false, reason: "invoice lookup failed: db down" });
    });
});
describe("authorizeRefund", () => {
    it("requires approval, reason, and paid cover", () => {
        expect(authorizeRefund({ invoiceTotalPaid: 500, amount: 100, reason: "Duplicate", humanApprovalId: "appr-1" })).toEqual({ ok: true });
        expect(authorizeRefund({ invoiceTotalPaid: 500, amount: 100, humanApprovalId: "appr-1" }).ok).toBe(false);
        expect(authorizeRefund({ invoiceTotalPaid: 500, amount: 100, reason: "R" }).ok).toBe(false);
        expect(authorizeRefund({ invoiceTotalPaid: 500, amount: 600, reason: "R", humanApprovalId: "a" }).ok).toBe(false);
        expect(authorizeRefund({ invoiceTotalPaid: 500, amount: 0, reason: "R", humanApprovalId: "a" }).ok).toBe(false);
    });
});
