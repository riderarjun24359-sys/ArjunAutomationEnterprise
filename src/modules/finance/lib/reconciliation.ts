/**
 * Provider event → invoice reconciliation (G, local slice).
 *
 * Pure matching between signed provider events (already verified upstream)
 * and persisted invoices. Outcomes:
 * - `matched`: exactly one open invoice agrees on reference + amount (+
 *   currency when both sides state it). Safe for a human to confirm paid.
 * - `discrepancy`: anything else, with a machine-readable reason. NEVER
 *   auto-marks money received — confirmation stays a human action in the
 *   finance module (manual payment path) until a configured provider mapping
 *   with live reconciliation tests exists.
 *
 * separately, `authorizeRefund` encodes the charge/refund boundary: refunds
 * require an explicit human approval id + reason and can never exceed the
 * recorded paid amount. No provider call happens here.
 */

export interface ProviderPaymentEvent {
    provider: "stripe" | "razorpay" | string;
    eventId: string;
    eventType: string;
    reference?: string | null;
    amountMinor?: number | null;
    currency?: string | null;
}

export interface OpenInvoice {
    id: string;
    number: string;
    total: number;
    amountPaid: number;
    currency?: string | null;
    status: string;
    organizationId?: string | null;
}

export type ReconciliationOutcome =
    | { kind: "matched"; invoiceId: string; invoiceNumber: string; organizationId?: string | null }
    | { kind: "discrepancy"; reason: string };

export type ReconciliationAttempt =
    | { attempted: false; reason: string }
    | { attempted: true; outcome: ReconciliationOutcome };

const SETTLEMENT_EVENT_HINTS = ["payment.succeeded", "payment.captured", "paymentintent.succeeded", "charge.succeeded"];

/**
 * Read-only reconciliation attempt for a verified webhook event.
 * Fetches open invoices via the injected fetcher (service-role scoped in
 * the route), matches with `reconcileProviderEvent`, and reports — never
 * mutates invoice or payment state. Non-settlement events are skipped with
 * an explicit reason.
 */
export async function attemptReconciliation(
    event: ProviderPaymentEvent,
    fetchOpenInvoices: () => Promise<OpenInvoice[]>,
): Promise<ReconciliationAttempt> {
    const normalizedType = (event.eventType ?? "").toLowerCase().replace(/_/g, "");
    const looksLikeSettlement = SETTLEMENT_EVENT_HINTS.some((hint) => normalizedType.includes(hint.replace(/_/g, "")));
    if (!looksLikeSettlement) return { attempted: false, reason: `non-settlement event ${event.eventType}` };
    try {
        const invoices = await fetchOpenInvoices();
        return { attempted: true, outcome: reconcileProviderEvent(event, invoices) };
    } catch (error) {
        return { attempted: false, reason: `invoice lookup failed: ${error instanceof Error ? error.message : String(error)}` };
    }
}

const normalizeRef = (value: string | null | undefined): string => (value ?? "").trim().toLowerCase();

export function reconcileProviderEvent(
    event: ProviderPaymentEvent,
    invoices: OpenInvoice[],
): ReconciliationOutcome {
    const ref = normalizeRef(event.reference);
    if (!ref) return { kind: "discrepancy", reason: "event carries no invoice reference" };
    const candidates = invoices.filter(
        (inv) => inv.status !== "void" && inv.status !== "paid" && normalizeRef(inv.number) === ref,
    );
    if (candidates.length === 0) return { kind: "discrepancy", reason: `no open invoice matches reference ${ref}` };
    if (candidates.length > 1) return { kind: "discrepancy", reason: `ambiguous reference ${ref}: ${candidates.length} open invoices` };
    const invoice = candidates[0];
    if (event.amountMinor != null) {
        const expectedMinor = Math.round((invoice.total - invoice.amountPaid) * 100);
        if (event.amountMinor !== expectedMinor) {
            return {
                kind: "discrepancy",
                reason: `amount mismatch for ${invoice.number}: event ${event.amountMinor} vs outstanding ${expectedMinor} (minor units)`,
            };
        }
    }
    if (event.currency && invoice.currency && event.currency.trim().toLowerCase() !== invoice.currency.trim().toLowerCase()) {
        return { kind: "discrepancy", reason: `currency mismatch for ${invoice.number}` };
    }
    return { kind: "matched", invoiceId: invoice.id, invoiceNumber: invoice.number, organizationId: invoice.organizationId ?? undefined };
}

export interface RefundRequest {
    invoiceTotalPaid: number;
    amount: number;
    reason?: string | null;
    humanApprovalId?: string | null;
}

export function authorizeRefund(input: RefundRequest): { ok: true } | { ok: false; reason: string } {
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return { ok: false, reason: "Refund amount must be greater than zero" };
    }
    if (!input.humanApprovalId?.trim()) {
        return { ok: false, reason: "Refunds require an explicit human approval id" };
    }
    if (!input.reason?.trim()) {
        return { ok: false, reason: "Refunds require a recorded reason" };
    }
    if (input.amount - input.invoiceTotalPaid > 1e-6) {
        return { ok: false, reason: "Refund cannot exceed the recorded paid amount" };
    }
    return { ok: true };
}
