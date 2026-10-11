/**
 * Transaction guards for the lead → invoice → payment lifecycle.
 *
 * Pure, side-effect-free transition and amount rules shared by services and
 * API routes. Services enforce these BEFORE any database write so invalid
 * state can never be persisted, regardless of which client performed the call.
 * Database-level CHECK/UNIQUE constraints (prepared migrations, not applied
 * here) are the second line of defense, not a substitute.
 */

export const INVOICE_STATUSES = ["draft", "sent", "paid", "overdue", "void"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

/** Allowed next statuses per current status. `paid` is terminal except via reversal (unsupported => no exits). */
const INVOICE_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
    draft: ["sent", "void"],
    sent: ["paid", "overdue", "void"],
    overdue: ["paid", "void"],
    paid: [],
    void: [],
};

export function isInvoiceTransitionAllowed(from: string, to: string): boolean {
    if (!(INVOICE_STATUSES as readonly string[]).includes(from)) return false;
    if (!(INVOICE_STATUSES as readonly string[]).includes(to)) return false;
    return INVOICE_TRANSITIONS[from as InvoiceStatus].includes(to as InvoiceStatus);
}

export const QUOTE_STATUSES = ["draft", "sent", "accepted", "declined", "expired"] as const;

const QUOTE_TRANSITIONS: Record<string, string[]> = {
    draft: ["sent", "expired"],
    sent: ["accepted", "declined", "expired"],
    accepted: [],
    declined: ["sent"],
    expired: [],
};

export function isQuoteTransitionAllowed(from: string, to: string): boolean {
    if (!(QUOTE_STATUSES as readonly string[]).includes(from)) return false;
    if (!(QUOTE_STATUSES as readonly string[]).includes(to)) return false;
    return (QUOTE_TRANSITIONS[from] ?? []).includes(to);
}

export const OPPORTUNITY_STATUSES = ["open", "qualified", "proposal", "negotiation", "won", "lost"] as const;

const OPPORTUNITY_TRANSITIONS: Record<string, string[]> = {
    open: ["qualified", "lost"],
    qualified: ["proposal", "lost"],
    proposal: ["negotiation", "lost"],
    negotiation: ["won", "lost"],
    won: [],
    lost: ["open"],
};

export function isOpportunityTransitionAllowed(from: string, to: string): boolean {
    if (!(OPPORTUNITY_STATUSES as readonly string[]).includes(from)) return false;
    if (!(OPPORTUNITY_STATUSES as readonly string[]).includes(to)) return false;
    return (OPPORTUNITY_TRANSITIONS[from] ?? []).includes(to);
}

export interface PaymentValidationInput {
    amount: number;
    invoiceTotal: number;
    invoiceAmountPaid: number;
    invoiceStatus: string;
}

export function validateManualPayment(input: PaymentValidationInput): { ok: true } | { ok: false; reason: string } {
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return { ok: false, reason: "Payment amount must be greater than zero" };
    }
    if (input.invoiceStatus === "void") {
        return { ok: false, reason: "Cannot record payment against a void invoice" };
    }
    if (input.invoiceStatus === "paid") {
        return { ok: false, reason: "Invoice is already paid in full" };
    }
    const balance = input.invoiceTotal - input.invoiceAmountPaid;
    if (input.amount - balance > 1e-6) {
        return { ok: false, reason: `Payment exceeds outstanding balance of ${balance.toFixed(2)}` };
    }
    return { ok: true };
}

export function isDuplicateInvoiceNumber(existingNumbers: string[], candidate: string): boolean {
    const target = candidate.trim().toLowerCase();
    return existingNumbers.some((n) => n.trim().toLowerCase() === target);
}
