import { describe, it, expect } from "vitest";
import {
    dedupePayments,
    paymentKey,
    reconcileSettlements,
    recordRevenue,
    transitionInvoice,
    type InvoiceRecord,
} from "./commercial-ledger";

const INVOICE: InvoiceRecord = { invoiceId: "inv_1", customerRef: "cust_1", amount: 50000, currency: "INR", status: "sent" };
const EVIDENCE = { provider: "stripe", eventId: "evt_123", amount: 50000, currency: "INR" };

describe("transitionInvoice", () => {
    it("moves sent -> paid only with matching provider evidence", () => {
        expect(transitionInvoice(INVOICE, "paid", EVIDENCE).status).toBe("paid");
    });

    it("rejects client-supplied paid flags without evidence", () => {
        expect(() => transitionInvoice(INVOICE, "paid")).toThrow(/provider evidence/);
        expect(() => transitionInvoice(INVOICE, "paid", { provider: "", eventId: "", amount: 1, currency: "INR" })).toThrow();
    });

    it("rejects amount/currency mismatches (forged or wrong-invoice evidence)", () => {
        expect(() => transitionInvoice(INVOICE, "paid", { ...EVIDENCE, amount: 1 })).toThrow(/match/);
        expect(() => transitionInvoice(INVOICE, "paid", { ...EVIDENCE, currency: "USD" })).toThrow(/match/);
    });

    it("rejects illegal transitions (paid is terminal except refund)", () => {
        const paid = transitionInvoice(INVOICE, "paid", EVIDENCE);
        expect(() => transitionInvoice(paid, "sent")).toThrow(/not an allowed transition/);
        expect(transitionInvoice(paid, "refunded").status).toBe("refunded");
        expect(() => transitionInvoice({ ...INVOICE, status: "draft" }, "paid", EVIDENCE)).toThrow();
    });
});

describe("paymentKey + dedupePayments", () => {
    it("derives stable keys and collapses replays", () => {
        expect(paymentKey("Stripe", "evt_1")).toBe(paymentKey("stripe", "evt_1"));
        const a = { paymentId: "p1", invoiceId: "inv_1", amount: 100, currency: "INR", provider: "stripe", providerEventId: "evt_1", status: "verified" as const, fee: 2 };
        const dup = { ...a, paymentId: "p2" };
        expect(dedupePayments([a, dup])).toHaveLength(1);
    });

    it("requires provider and event id", () => {
        expect(() => paymentKey("", "evt_1")).toThrow();
    });
});

describe("recordRevenue", () => {
    it("counts only verified payments, subtracts refunds, separates currencies", () => {
        const report = recordRevenue([
            { paymentId: "p1", invoiceId: "i1", amount: 50000, currency: "INR", provider: "stripe", providerEventId: "e1", status: "verified", fee: 1000 },
            { paymentId: "p1b", invoiceId: "i1", amount: 50000, currency: "INR", provider: "stripe", providerEventId: "e1", status: "verified", fee: 1000 },
            { paymentId: "p2", invoiceId: "i2", amount: 20000, currency: "INR", provider: "stripe", providerEventId: "e2", status: "refunded", fee: 0 },
            { paymentId: "p3", invoiceId: "i3", amount: 999, currency: "USD", provider: "stripe", providerEventId: "e3", status: "failed", fee: 0 },
        ]);
        expect(report.byCurrency["INR"]).toEqual({ gross: 30000, fees: 1000, net: 29000, payments: 1, refunds: 1 });
        expect(report.byCurrency["USD"]).toBeUndefined();
        expect(report.paymentCount).toBe(1);
        expect(report.disclaimer).toMatch(/MISSING/);
    });

    it("reports empty ledgers honestly", () => {
        const report = recordRevenue([]);
        expect(report.byCurrency).toEqual({});
        expect(report.paymentCount).toBe(0);
    });
});

describe("reconcileSettlements", () => {
    const LEDGER = [
        { paymentId: "p1", invoiceId: "inv_1", amount: 500, currency: "INR", provider: "stripe", providerEventId: "e1", status: "verified" as const, fee: 10 },
        { paymentId: "p2", invoiceId: "inv_2", amount: 200, currency: "INR", provider: "stripe", providerEventId: "e2", status: "verified" as const, fee: 4 },
        { paymentId: "p3", invoiceId: "inv_3", amount: 99, currency: "USD", provider: "stripe", providerEventId: "e3", status: "failed" as const, fee: 0 },
    ];

    it("matches by invoice reference with unit conversion, flags the rest", () => {
        const r = reconcileSettlements(LEDGER, [
            { reference: "inv_1", amountMinor: 50000, currency: "inr" },
            { reference: "inv_2", amountMinor: 19900, currency: "INR" },
            { reference: "inv_9", amountMinor: 1000, currency: "INR" },
            { reference: null, amountMinor: null, currency: null },
        ]);
        expect(r.matched).toEqual(["p1"]);
        expect(r.mismatched.map((m) => m.paymentId)).toEqual(["p2"]);
        expect(r.providerOnly).toEqual(["inv_9"]);
        expect(r.ledgerOnly).toEqual([]);
    });

    it("lists ledger payments missing from provider records", () => {
        const r = reconcileSettlements(LEDGER, []);
        expect(r.ledgerOnly).toEqual(["p1", "p2"]);
        expect(r.matched).toEqual([]);
    });
});
