import { describe, expect, it } from "vitest";
import { summarizeWebhookReconciliation } from "./webhook-response";

describe("summarizeWebhookReconciliation", () => {
    it("keeps only the public matched outcome", () => {
        expect(summarizeWebhookReconciliation({
            attempted: true,
            outcome: {
                kind: "matched",
                invoiceId: "private-invoice-id",
                invoiceNumber: "INV-PRIVATE",
                organizationId: "private-tenant-id",
            },
        })).toEqual({ attempted: true, outcome: "matched" });
    });

    it("does not disclose discrepancy details or invoice references", () => {
        expect(summarizeWebhookReconciliation({
            attempted: true,
            outcome: { kind: "discrepancy", reason: "no open invoice matches INV-PRIVATE" },
        })).toEqual({ attempted: true, outcome: "discrepancy" });
    });

    it("normalizes missing and failed reconciliation to not attempted", () => {
        expect(summarizeWebhookReconciliation(null)).toEqual({ attempted: false });
        expect(summarizeWebhookReconciliation({ attempted: false, reason: "private error" }))
            .toEqual({ attempted: false });
    });
});
