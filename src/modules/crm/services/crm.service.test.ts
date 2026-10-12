import { describe, it, expect, vi, beforeEach } from "vitest";

const orgContext = vi.hoisted(() => ({ current: { profileId: "p1", organizationId: "org-1" } as { profileId: string; organizationId: string } | null }));
vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: vi.fn(async () => orgContext.current),
}));

const mocks = vi.hoisted(() => ({
    clientsGetById: vi.fn(),
    clientsUpdate: vi.fn(),
    salesLeadsGetById: vi.fn(),
    salesLeadsUpdate: vi.fn(),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        clients: { getById: mocks.clientsGetById, update: mocks.clientsUpdate },
        salesLeads: { getById: mocks.salesLeadsGetById, update: mocks.salesLeadsUpdate },
    },
}));

import { crmService } from "./crm.service";

const clientRow = (org: string) => ({
    id: "client-1",
    organization_id: org,
    name: "Acme",
    contact_email: "ops@acme.test",
    lifecycle_stage: "client",
    lead_score: 10,
    deal_value: "$0",
    assigned_to: null,
    phone: "",
    website: "",
    address: "",
    description: "",
});

const leadRow = (org: string) => ({ id: "lead-1", organization_id: org, status: "new" });

describe("crm service tenant guards", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        orgContext.current = { profileId: "p1", organizationId: "org-1" };
    });

    it("returns a client that belongs to the caller's organization", async () => {
        mocks.clientsGetById.mockResolvedValue(clientRow("org-1"));
        const result = await crmService.getClient("u1", "u1@test.dev", "client-1");
        expect(result?.id).toBe("client-1");
    });

    it("refuses a client that belongs to another organization", async () => {
        mocks.clientsGetById.mockResolvedValue(clientRow("org-2"));
        await expect(crmService.getClient("u1", "u1@test.dev", "client-1")).resolves.toBeUndefined();
    });

    it("returns undefined without a context or record", async () => {
        mocks.clientsGetById.mockResolvedValue(clientRow("org-1"));
        orgContext.current = null;
        await expect(crmService.getClient("u1", "u1@test.dev", "client-1")).resolves.toBeUndefined();
        orgContext.current = { profileId: "p1", organizationId: "org-1" };
        mocks.clientsGetById.mockResolvedValue(null);
        await expect(crmService.getClient("u1", "u1@test.dev", "missing")).resolves.toBeUndefined();
    });

    it("moves a sales lead inside the caller's organization", async () => {
        mocks.salesLeadsGetById.mockResolvedValue(leadRow("org-1"));
        mocks.salesLeadsUpdate.mockResolvedValue({ ...leadRow("org-1"), status: "qualified" });
        await expect(crmService.moveLeadStage("u1", "u1@test.dev", "lead-1", "qualified", "sales_lead")).resolves.toBe(true);
        expect(mocks.salesLeadsUpdate).toHaveBeenCalledTimes(1);
    });

    it("refuses to move a sales lead from another organization without writing", async () => {
        mocks.salesLeadsGetById.mockResolvedValue(leadRow("org-2"));
        await expect(crmService.moveLeadStage("u1", "u1@test.dev", "lead-1", "qualified", "sales_lead")).resolves.toBe(false);
        expect(mocks.salesLeadsUpdate).not.toHaveBeenCalled();
    });

    it("refuses to move a client-lead from another organization without writing", async () => {
        mocks.clientsGetById.mockResolvedValue(clientRow("org-2"));
        await expect(crmService.moveLeadStage("u1", "u1@test.dev", "client-1", "won", "crm_lead")).resolves.toBe(false);
        expect(mocks.clientsUpdate).not.toHaveBeenCalled();
    });
});
