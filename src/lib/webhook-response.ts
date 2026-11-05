/**
 * Webhook responses are visible to the payment provider and must not disclose
 * tenant identifiers, invoice IDs/numbers, or internal reconciliation reasons.
 * Detailed outcomes remain in server-side operational logs.
 */
export function summarizeWebhookReconciliation(value: unknown):
    | { attempted: false }
    | { attempted: true; outcome: "matched" | "discrepancy" } {
    if (!value || typeof value !== "object") return { attempted: false };
    const result = value as { attempted?: unknown; outcome?: { kind?: unknown } };
    if (result.attempted !== true) return { attempted: false };
    return {
        attempted: true,
        outcome: result.outcome?.kind === "matched" ? "matched" : "discrepancy",
    };
}
