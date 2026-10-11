import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: vi.fn(async () => ({ profileId: "p1", organizationId: "org-1" })),
}));

const mocks = vi.hoisted(() => ({
    listInvoices: vi.fn(),
    listLineItems: vi.fn(async () => []),
    createInvoice: vi.fn(),
    updateInvoice: vi.fn(),
    getInvoiceById: vi.fn(),
    createPayment: vi.fn(),
    listPayments: vi.fn(async () => []),
    listTaxRates: vi.fn(async () => []),
    createActivity: vi.fn(async () => ({})),
    listClients: vi.fn(async () => []),
    listProjects: vi.fn(async () => []),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        invoices: {
            listByOrganization: mocks.listInvoices,
            listLineItems: mocks.listLineItems,
            create: mocks.createInvoice,
            update: mocks.updateInvoice,
            getById: mocks.getInvoiceById,
        },
        payments: { create: mocks.createPayment, listByOrganization: mocks.listPayments },
        taxRates: { listByOrganization: mocks.listTaxRates },
        activityLogs: { create: mocks.createActivity },
        clients: { listActiveClients: mocks.listClients },
        projects: { listByOrganization: mocks.listProjects },
    },
}));

import { financeService } from "./finance.service";

const invoiceInput = {
    number: "INV-100",
    status: "draft" as const,
    issueDate: "2026-10-01",
    lineItems: [{ description: "Milestone 1", quantity: 1, unitPrice: 10000 }],
};

describe("finance service guards", () => {
    beforeEach(() => vi.clearAllMocks());

    it("rejects duplicate invoice numbers in the same organization", async () => {
        mocks.listInvoices.mockResolvedValue([{ id: "i0", number: "inv-100" }]);
        await expect(financeService.createInvoice("u", "e", invoiceInput)).rejects.toThrow(/already exists/);
        expect(mocks.createInvoice).not.toHaveBeenCalled();
    });

    it("rejects payments that exceed the outstanding balance", async () => {
        mocks.getInvoiceById.mockResolvedValue({ id: "i1", client_id: null, total: 1000, amount_paid: 200, status: "sent" });
        await expect(
            financeService.createPayment("u", "e", { invoiceId: "i1", amount: 900, paymentDate: "2026-10-10", method: "ach" as const }),
        ).rejects.toThrow(/exceeds outstanding balance/);
        expect(mocks.createPayment).not.toHaveBeenCalled();
    });

    it("rejects zero payments and payments against void invoices", async () => {
        mocks.getInvoiceById.mockResolvedValue({ id: "i1", client_id: null, total: 1000, amount_paid: 0, status: "sent" });
        await expect(
            financeService.createPayment("u", "e", { invoiceId: "i1", amount: 0, paymentDate: "2026-10-10", method: "ach" as const }),
        ).rejects.toThrow(/greater than zero/);
        mocks.getInvoiceById.mockResolvedValue({ id: "i1", client_id: null, total: 1000, amount_paid: 0, status: "void" });
        await expect(
            financeService.createPayment("u", "e", { invoiceId: "i1", amount: 100, paymentDate: "2026-10-10", method: "ach" as const }),
        ).rejects.toThrow(/void invoice/);
    });
});
