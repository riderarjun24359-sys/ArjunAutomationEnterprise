import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: vi.fn(async () => ({ profileId: "p1", organizationId: "org-1" })),
}));

const NOW = new Date("2026-10-11T12:00:00Z").toISOString();

const mocks = vi.hoisted(() => ({
    getWorkflowById: vi.fn(async () => ({ id: "w1", name: "Nightly sync" })),
    listWorkflows: vi.fn(async () => [{ id: "w1", name: "Nightly sync" }]),
    listExecutions: vi.fn(async () => [] as Array<Record<string, unknown>>),
    createExecution: vi.fn(async (input: Record<string, unknown>) => ({ id: "e1", created_at: NOW, ...input })),
    updateExecution: vi.fn(async (id: string, patch: Record<string, unknown>) => ({ id, workflow_id: "w1", ...patch })),
    createLog: vi.fn(async () => ({})),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        workflows: { getById: mocks.getWorkflowById, listByOrganization: mocks.listWorkflows },
        workflowActions: { listByWorkflow: vi.fn(async () => []) },
        workflowConditions: { listByWorkflow: vi.fn(async () => []) },
        workflowExecutions: {
            listByOrganization: mocks.listExecutions,
            create: mocks.createExecution,
            update: mocks.updateExecution,
        },
        automationLogs: { create: mocks.createLog },
    },
}));

import { automationService } from "./automation.service";

describe("automation runWorkflow honesty", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.listExecutions.mockImplementation(async () => [
            { id: "e1", workflow_id: "w1", status: "failed", trigger_type: "manual", started_at: NOW, completed_at: NOW, duration_ms: 0, result: {}, error_message: "Workflow has no actions defined" },
        ]);
        mocks.listWorkflows.mockResolvedValue([{ id: "w1", name: "Nightly sync" }]);
    });

    it("records failed-with-reason instead of fake completion", async () => {
        const out = await automationService.runWorkflow("u", "e", "w1");
        expect(out.status).toBe("failed");
        expect(String(out.errorMessage)).toMatch(/no actions defined/i);
        expect(mocks.createExecution).toHaveBeenCalledOnce();
    });

    it("dedupes a manual run already in flight", async () => {
        mocks.listExecutions.mockResolvedValue([
            { id: "e-running", workflow_id: "w1", status: "running", trigger_type: "manual", started_at: new Date(Date.now() - 30_000).toISOString(), completed_at: null, duration_ms: 0, result: {}, error_message: "" },
        ]);
        mocks.listWorkflows.mockResolvedValue([{ id: "w1", name: "Nightly sync" }]);
        const out = await automationService.runWorkflow("u", "e", "w1");
        expect(out.id).toBe("e-running");
        expect(mocks.createExecution).not.toHaveBeenCalled();
    });
});
