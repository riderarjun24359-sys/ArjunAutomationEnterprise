import { describe, it, expect } from "vitest";
import {
    isDuplicateInvoiceNumber,
    isInvoiceTransitionAllowed,
    isOpportunityTransitionAllowed,
    isQuoteTransitionAllowed,
    validateManualPayment,
} from "./transaction-guards";

describe("transaction-guards", () => {
    it("enforces the invoice lifecycle state machine", () => {
        expect(isInvoiceTransitionAllowed("draft", "sent")).toBe(true);
        expect(isInvoiceTransitionAllowed("sent", "paid")).toBe(true);
        expect(isInvoiceTransitionAllowed("sent", "overdue")).toBe(true);
        expect(isInvoiceTransitionAllowed("overdue", "paid")).toBe(true);
        expect(isInvoiceTransitionAllowed("draft", "paid")).toBe(false);
        expect(isInvoiceTransitionAllowed("paid", "void")).toBe(false);
        expect(isInvoiceTransitionAllowed("void", "draft")).toBe(false);
        expect(isInvoiceTransitionAllowed("bogus", "paid")).toBe(false);
    });

    it("enforces quote and opportunity transitions", () => {
        expect(isQuoteTransitionAllowed("draft", "sent")).toBe(true);
        expect(isQuoteTransitionAllowed("sent", "accepted")).toBe(true);
        expect(isQuoteTransitionAllowed("accepted", "sent")).toBe(false);
        expect(isQuoteTransitionAllowed("declined", "sent")).toBe(true);
        expect(isOpportunityTransitionAllowed("open", "qualified")).toBe(true);
        expect(isOpportunityTransitionAllowed("negotiation", "won")).toBe(true);
        expect(isOpportunityTransitionAllowed("open", "won")).toBe(false);
        expect(isOpportunityTransitionAllowed("won", "open")).toBe(false);
        expect(isOpportunityTransitionAllowed("lost", "open")).toBe(true);
    });

    it("validates manual payments against the outstanding balance", () => {
        expect(validateManualPayment({ amount: 100, invoiceTotal: 1000, invoiceAmountPaid: 200, invoiceStatus: "sent" })).toEqual({ ok: true });
        expect(validateManualPayment({ amount: 0, invoiceTotal: 1000, invoiceAmountPaid: 0, invoiceStatus: "sent" }).ok).toBe(false);
        expect(validateManualPayment({ amount: 900, invoiceTotal: 1000, invoiceAmountPaid: 200, invoiceStatus: "sent" }).ok).toBe(false);
        expect(validateManualPayment({ amount: 50, invoiceTotal: 1000, invoiceAmountPaid: 0, invoiceStatus: "void" }).ok).toBe(false);
        expect(validateManualPayment({ amount: 50, invoiceTotal: 1000, invoiceAmountPaid: 1000, invoiceStatus: "paid" }).ok).toBe(false);
    });

    it("detects duplicate invoice numbers case-insensitively", () => {
        expect(isDuplicateInvoiceNumber(["INV-001", "inv-002"], " inv-001 ")).toBe(true);
        expect(isDuplicateInvoiceNumber(["INV-001"], "INV-003")).toBe(false);
    });
});
