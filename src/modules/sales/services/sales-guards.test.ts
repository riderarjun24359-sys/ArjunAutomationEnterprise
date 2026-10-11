import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: vi.fn(async () => ({ profileId: "p1", organizationId: "org-1" })),
}));

const mocks = vi.hoisted(() => ({
    getById: vi.fn(),
    update: vi.fn(),
    listActivities: vi.fn(),
    listPipelines: vi.fn(async () => []),
    listStages: vi.fn(async () => []),
    listOpps: vi.fn(async () => []),
    listLeads: vi.fn(async () => []),
    listClients: vi.fn(async () => []),
    listProjects: vi.fn(async () => []),
    listEmployees: vi.fn(async () => []),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        salesOpportunities: { getById: mocks.getById, update: mocks.update, listByOrganization: mocks.listOpps },
        salesActivities: { listByOrganization: mocks.listActivities },
        salesPipelines: { listByOrganization: mocks.listPipelines },
        salesPipelineStages: { listByOrganization: mocks.listStages },
        salesLeads: { listByOrganization: mocks.listLeads },
        clients: { listByOrganization: mocks.listClients },
        projects: { listByOrganization: mocks.listProjects },
        employees: { listByOrganization: mocks.listEmployees },
    },
}));

import { salesService } from "./sales.service";

describe("sales service guards", () => {
    beforeEach(() => vi.clearAllMocks());

    it("rejects illegal opportunity jumps (open -> won)", async () => {
        mocks.getById.mockResolvedValue({ id: "o1", status: "open" });
        await expect(salesService.updateOpportunityStatus("u", "e", "o1", { status: "won" })).rejects.toThrow(/not allowed/);
        expect(mocks.update).not.toHaveBeenCalled();
    });

    it("allows legal transitions (negotiation -> won) and stamps won_at", async () => {
        mocks.getById.mockResolvedValue({ id: "o1", status: "negotiation" });
        mocks.update.mockImplementation(async (_id: string, patch: Record<string, unknown>) => ({
            id: "o1",
            opportunity_number: "OP-1",
            name: "Deal",
            description: "",
            pipeline_id: null,
            stage_id: null,
            client_id: null,
            contact_id: null,
            project_id: null,
            assigned_to: null,
            amount: 0,
            probability: 0,
            expected_close_date: null,
            status: "won",
            won_at: patch.won_at,
            lost_at: null,
            lost_reason: "",
            estimate_id: null,
        }));
        const out = await salesService.updateOpportunityStatus("u", "e", "o1", { status: "won" });
        expect(mocks.update).toHaveBeenCalledOnce();
        expect(out.status).toBe("won");
    });

    it("returns only due follow-ups from persisted activities", async () => {
        mocks.listActivities.mockResolvedValue([
            { id: "a1", activity_type: "call", subject: "Call Priya", description: "", opportunity_id: null, lead_id: null, assigned_to: null, due_at: "2026-10-01T00:00:00Z", completed_at: null },
            { id: "a2", activity_type: "email", subject: "Send proposal", description: "", opportunity_id: null, lead_id: null, assigned_to: null, due_at: "2027-01-01T00:00:00Z", completed_at: null },
            { id: "a3", activity_type: "call", subject: "Done", description: "", opportunity_id: null, lead_id: null, assigned_to: null, due_at: "2026-10-01T00:00:00Z", completed_at: "2026-10-02T00:00:00Z" },
        ]);
        const out = await salesService.getDueFollowUps("u", "e", 30);
        expect(out.map((a) => a.id)).toEqual(["a1"]);
    });
});
