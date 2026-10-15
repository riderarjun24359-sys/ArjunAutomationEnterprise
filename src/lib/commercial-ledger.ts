/**
 * Commercial lifecycle state machine (pure, deterministic, no I/O).
 *
 * Covers the locally testable part of the revenue workflow:
 * quote → invoice → payment-requested → payment-verified → revenue-recorded.
 *
 * Hard rules (mirroring the no-fabrication policy):
 * - An invoice is NEVER revenue. A payment link is NEVER a payment.
 * - `paid` requires verified provider evidence (provider + event id +
 *   matching amount/currency). A client-supplied "paid" flag is rejected.
 * - Revenue sums ONLY verified payments; refunds subtract; fees tracked.
 * - Currencies are never mixed. Missing data is reported, never estimated.
 * - Idempotency keys are deterministic: replays collapse, never double-count.
 *
 * Provider webhook signature verification and merchant setup live outside
 * this module (STRIPE_WEBHOOK_SECRET etc.) — see webhook-idempotency.ts and
 * the owner checklist. This module assumes evidence already passed signature
 * checks and validates business linkage only.
 */

export type InvoiceStatus = "draft" | "sent" | "paid" | "failed" | "refunded";
export type PaymentStatus = "verified" | "failed" | "refunded";

export interface ProviderEvidence {
    provider: string;
    eventId: string;
    amount: number;
    currency: string;
}

export interface InvoiceRecord {
    invoiceId: string;
    customerRef: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
}

export interface PaymentRecord {
    paymentId: string;
    invoiceId: string;
    amount: number;
    currency: string;
    provider: string;
    providerEventId: string;
    status: PaymentStatus;
    fee: number;
}

const INVOICE_TRANSITIONS: Record<InvoiceStatus, readonly InvoiceStatus[]> = {
    draft: ["sent"],
    sent: ["paid", "failed"],
    paid: ["refunded"],
    failed: ["sent"],
    refunded: [],
};

function fail(message: string): never {
    throw new Error(message);
}

function checkAmount(amount: number, field: string): void {
    if (!Number.isFinite(amount) || amount < 0) fail(`${field} must be a finite non-negative number`);
}

export function transitionInvoice(
    invoice: InvoiceRecord,
    to: InvoiceStatus,
    evidence?: ProviderEvidence,
): InvoiceRecord {
    if (!INVOICE_TRANSITIONS[invoice.status].includes(to)) {
        fail(`invoice ${invoice.invoiceId}: ${invoice.status} -> ${to} is not an allowed transition`);
    }
    if (to === "paid") {
        if (!evidence || typeof evidence !== "object") fail("paid status requires verified provider evidence (client claims rejected)");
        if (!evidence.provider.trim() || !evidence.eventId.trim()) fail("provider evidence must identify provider and event");
        if (evidence.amount !== invoice.amount || evidence.currency !== invoice.currency) {
            fail("provider evidence amount/currency must match the invoice exactly");
        }
    }
    return { ...invoice, status: to };
}

export function paymentKey(provider: string, eventId: string): string {
    const p = provider.trim().toLowerCase();
    const e = eventId.trim();
    if (!p || !e) fail("payment idempotency requires provider and event id");
    return `${p}:${e}`;
}

/** Collapse replays by idempotency key, keeping the first verified record. */
export function dedupePayments(payments: PaymentRecord[]): PaymentRecord[] {
    const seen = new Map<string, PaymentRecord>();
    for (const p of payments) {
        const key = paymentKey(p.provider, p.providerEventId);
        const existing = seen.get(key);
        if (!existing) {
            seen.set(key, p);
        } else if (existing.status !== "verified" && p.status === "verified") {
            seen.set(key, p);
        }
    }
    return [...seen.values()];
}

export interface RevenueReport {
    byCurrency: Record<string, { gross: number; fees: number; net: number; payments: number; refunds: number }>;
    paymentCount: number;
    disclaimer: string;
}export function recordRevenue(payments: PaymentRecord[]): RevenueReport {
    const unique = dedupePayments(payments);
    const byCurrency: RevenueReport["byCurrency"] = {};
    let paymentCount = 0;
    for (const p of unique) {
        checkAmount(p.amount, "payment amount");
        checkAmount(p.fee, "payment fee");
        if (p.status === "failed") continue;
        const bucket = (byCurrency[p.currency] ??= { gross: 0, fees: 0, net: 0, payments: 0, refunds: 0 });
        if (p.status === "verified") {
            bucket.gross += p.amount;
            bucket.fees += p.fee;
            bucket.payments += 1;
            paymentCount += 1;
        } else if (p.status === "refunded") {
            bucket.gross -= p.amount;
            bucket.refunds += 1;
        }
    }
    for (const bucket of Object.values(byCurrency)) {
        bucket.net = bucket.gross - bucket.fees;
    }
    return {
        byCurrency,
        paymentCount,
        disclaimer: "Verified provider records only. No provider configured locally: all figures MISSING until setup.",
    };
}

export interface ProviderSettlement {
    /** Invoice linkage per reference convention (metadata invoice number or description). */
    reference: string | null;
    amountMinor: number | null;
    currency: string | null;
}

export interface Reconciliation {
    matched: string[];
    ledgerOnly: string[];
    providerOnly: string[];
    mismatched: Array<{ paymentId: string; reason: string }>;
}

/**
 * Reconcile ledger payments against provider settlement refs.
 * Match key: provider reference === ledger invoiceId, with amount converted
 * from minor units (divisor 100) and case-insensitive currency compared.
 * Unparseable provider refs and unmatched entries are reported as
 * discrepancies — never silently dropped, never auto-created.
 */
export function reconcileSettlements(
    ledger: PaymentRecord[],
    providerRefs: ProviderSettlement[],
    minorUnitDivisor = 100,
): Reconciliation {
    const matched: string[] = [];
    const ledgerOnly: string[] = [];
    const providerOnly: string[] = [];
    const mismatched: Array<{ paymentId: string; reason: string }> = [];
    const used = new Set<number>();
    for (const p of dedupePayments(ledger)) {
        if (p.status !== "verified") continue;
        let found = -1;
        for (let i = 0; i < providerRefs.length; i++) {
            if (used.has(i)) continue;
            const r = providerRefs[i];
            if (!r || r.reference === null || r.reference.trim() !== p.invoiceId) continue;
            found = i;
            break;
        }
        if (found === -1) {
            ledgerOnly.push(p.paymentId);
            continue;
        }
        used.add(found);
        const ref = providerRefs[found];
        if (ref === undefined || ref.amountMinor === null || ref.currency === null) {
            mismatched.push({ paymentId: p.paymentId, reason: "provider ref unparseable (amount/currency missing)" });
            continue;
        }
        const okAmount = Math.abs(ref.amountMinor / minorUnitDivisor - p.amount) < 0.005;
        const okCurrency = ref.currency.trim().toUpperCase() === p.currency.trim().toUpperCase();
        if (!okAmount || !okCurrency) {
            mismatched.push({ paymentId: p.paymentId, reason: `provider ${ref.amountMinor}/${ref.currency} vs ledger ${p.amount}/${p.currency}` });
            continue;
        }
        matched.push(p.paymentId);
    }
    providerRefs.forEach((r, i) => {
        if (!used.has(i) && r && r.reference !== null) providerOnly.push(r.reference);
    });
    return { matched, ledgerOnly, providerOnly, mismatched };
}
