import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Authenticated customer-journey integration (mocked persistence).
 *
 * Walks lead → opportunity → quote → invoice → payment → acceptance →
 * reconciliation through the REAL services and guards with an in-memory
 * stand-in for `databaseService`. Proves the lifecycle composes: legal
 * transitions pass, guards reject overpayment, and a provider event
 * reconciles to the created invoice. Browser/RLS behavior is covered by
 * the PGlite isolation suites; this covers service composition.
 */

vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: vi.fn(async () => ({ profileId: "p1", organizationId: "org-1" })),
}));

interface Row { id: string; [key: string]: unknown }

const store: Record<string, Row[]> = {};
const mocks = vi.hoisted(() => {
    const table = (name: string) => ({
        listByOrganization: vi.fn(async () => store[name] ?? []),
        getById: vi.fn(async (id: string) => (store[name] ?? []).find((r) => r.id === id) ?? null),
        create: vi.fn(async (input: Record<string, unknown>) => {
            const row = { id: `${name}-${(store[name] ?? []).length + 1}`, created_at: new Date().toISOString(), ...input } as Row;
            (store[name] ??= []).push(row);
            return row;
        }),
        update: vi.fn(async (id: string, patch: Record<string, unknown>) => {
            const row = (store[name] ?? []).find((r) => r.id === id);
            if (!row) return null;
            Object.assign(row, patch);
            return row;
        }),
    });
    return {
        salesLeads: table("sales_leads"),
        salesOpportunities: table("sales_opportunities"),
        salesQuotes: { ...table("sales_quotes") },
        salesQuoteItems: { listByQuote: vi.fn(async () => []) },
        salesPipelines: { listByOrganization: vi.fn(async () => []) },
        salesPipelineStages: { listByOrganization: vi.fn(async () => []) },
        salesActivities: { listByOrganization: vi.fn(async () => []) },
        salesMeetings: { listByOrganization: vi.fn(async () => []) },
        salesCallLogs: { listByOrganization: vi.fn(async () => []) },
        salesEmailTracking: { listByOrganization: vi.fn(async () => []) },
        salesTargets: { listByOrganization: vi.fn(async () => []) },
        salesCommissions: { listByOrganization: vi.fn(async () => []) },
        salesWinLossRecords: { listByOrganization: vi.fn(async () => []) },
        salesAuditLogs: { create: vi.fn(async () => ({})) },
        invoices: {
            ...table("invoices"),
            listLineItems: vi.fn(async () => []),
            replaceLineItems: vi.fn(async () => undefined),
        },
        payments: table("payments"),
        taxRates: { listByOrganization: vi.fn(async () => []) },
        activityLogs: { create: vi.fn(async () => ({})) },
        clients: { listByOrganization: vi.fn(async () => []), listActiveClients: vi.fn(async () => []) },
        projects: { listByOrganization: vi.fn(async () => []) },
        employees: { listByOrganization: vi.fn(async () => []) },
    };
});

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: mocks,
}));

import { salesService } from "@/src/modules/sales/services/sales.service";
import { financeService } from "@/src/modules/finance/services/finance.service";
import { buildAcceptanceApprovalInput } from "@/src/modules/delivery-engine/services/delivery-acceptance";
import { reconcileProviderEvent } from "@/src/modules/finance/lib/reconciliation";

describe("authenticated customer journey", () => {
    beforeEach(() => {
        for (const key of Object.keys(store)) delete store[key];
        vi.clearAllMocks();
    });

    it("walks lead → won → quote → invoice → paid → acceptance → reconciliation", async () => {
        const lead = await salesService.createLead("u", "e@x.com", {
            leadName: "Priya", companyName: "Acme", email: "priya@acme.com", phone: "", source: "inbound-website",
        });
        expect(lead.id).toBeTruthy();

        const oppId = "sales_opportunities-1";
        (store.sales_opportunities ??= []).push({
            id: oppId, opportunity_number: "OP-1", name: "Acme rollout", description: "",
            pipeline_id: null, stage_id: null, client_id: null, contact_id: null, project_id: null,
            assigned_to: null, amount: 1180, probability: 80, expected_close_date: null,
            status: "negotiation", won_at: null, lost_at: null, lost_reason: "", estimate_id: null,
        });
        const won = await salesService.updateOpportunityStatus("u", "e@x.com", oppId, { status: "won" });
        expect(won.status).toBe("won");

        const quote = await salesService.createQuote("u", "e@x.com", {
            quoteNumber: "Q-1", title: "Acme rollout", totalAmount: 1180,
        });
        expect(quote.quoteNumber).toBe("Q-1");

        const invoice = await financeService.createInvoice("u", "e@x.com", {
            number: "INV-500", status: "sent", issueDate: "2026-10-11",
            lineItems: [{ description: "Milestone 1", quantity: 1, unitPrice: 1000 }],
        });
        expect(invoice.number).toBe("INV-500");

        await expect(
            financeService.createPayment("u", "e@x.com", { invoiceId: invoice.id, amount: 999999, paymentDate: "2026-10-11", method: "wire" }),
        ).rejects.toThrow(/exceeds outstanding balance/);

        const payment = await financeService.createPayment("u", "e@x.com", {
            invoiceId: invoice.id, amount: Number(invoice.total), paymentDate: "2026-10-11", method: "wire", reference: "PAY-1",
        });
        expect(payment.id).toBeTruthy();

        const acceptance = buildAcceptanceApprovalInput("eng-1", { reviewerId: "rev-1" });
        expect(acceptance.approvalStatus).toBe("pending");

        const outcome = reconcileProviderEvent(
            { provider: "stripe", eventId: "evt_1", eventType: "payment.succeeded", reference: "INV-500", amountMinor: Math.round(Number(invoice.total) * 100), currency: "USD" },
            [{ id: invoice.id, number: invoice.number, total: Number(invoice.total), amountPaid: 0, currency: "USD", status: "sent" }],
        );
        expect(outcome).toEqual({ kind: "matched", invoiceId: invoice.id, invoiceNumber: "INV-500", organizationId: undefined });
    });
});
