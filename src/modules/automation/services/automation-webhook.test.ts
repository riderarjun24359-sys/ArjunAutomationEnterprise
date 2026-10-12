import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: vi.fn(async () => ({ profileId: "p1", organizationId: "org-1" })),
}));

const mocks = vi.hoisted(() => ({
    workflowsGetById: vi.fn(async () => ({ id: "w1", name: "Sync" })),
    workflowsList: vi.fn(async () => [{ id: "w1", name: "Sync" }]),
    actionsList: vi.fn(async () => [] as Array<Record<string, unknown>>),
    conditionsList: vi.fn(async () => [] as Array<Record<string, unknown>>),
    executionCreate: vi.fn(async (input: Record<string, unknown>) => ({ id: "e1", workflow_id: "w1", status: "running", ...input })),
    executionUpdate: vi.fn(async (id: string, patch: Record<string, unknown>) => ({ id, workflow_id: "w1", status: "completed", ...patch })),
    executionsList: vi.fn(async () => [{ id: "e1", workflow_id: "w1", status: "completed", trigger_type: "manual", started_at: "", completed_at: "", duration_ms: 1, result: {}, error_message: "" }]),
    createLog: vi.fn(async () => ({})),
    webhooksList: vi.fn(async () => [] as Array<Record<string, unknown>>),
    webhookCreate: vi.fn(async (_orgId: string, input: Record<string, unknown>) => ({ id: "wh1", organization_id: _orgId, created_at: "", ...input })),
    webhookUpdate: vi.fn(async () => null),
    deliveryCreate: vi.fn(async (_orgId: string, input: Record<string, unknown>) => ({ id: "d1", organization_id: _orgId, created_at: "", ...input })),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        workflows: { getById: mocks.workflowsGetById, listByOrganization: mocks.workflowsList },
        workflowActions: { listByWorkflow: mocks.actionsList },
        workflowConditions: { listByWorkflow: mocks.conditionsList },
        workflowExecutions: {
            create: mocks.executionCreate,
            update: mocks.executionUpdate,
            listByOrganization: mocks.executionsList,
        },
        automationLogs: { create: mocks.createLog },
        integrationWebhooks: {
            listByOrganization: mocks.webhooksList,
            createForOrganization: mocks.webhookCreate,
            updateForOrganization: mocks.webhookUpdate,
        },
        integrationDeliveries: { createForOrganization: mocks.deliveryCreate },
        aiAgents: { listByOrganization: vi.fn(async () => []) },
        workflowTemplates: { listByOrganization: vi.fn(async () => []) },
    },
}));

vi.mock("@/src/modules/tasks/services/task.service", () => ({
    taskService: { createTaskSystemWide: vi.fn(async () => ({ id: "t1" })) },
}));

import { automationService } from "./automation.service";

const hookRow = {
    id: "wh1",
    organization_id: "org-1",
    name: "crm",
    url: "https://hooks.example.com/events",
    secret: "super-secret-16-chars!!",
    allowed_hosts: ["hooks.example.com"],
    is_active: true,
    created_at: "",
    updated_at: "",
};

describe("automation webhooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.actionsList.mockResolvedValue([]);
        mocks.webhooksList.mockResolvedValue([]);
        mocks.webhookUpdate.mockResolvedValue(null);
        vi.stubGlobal("fetch", vi.fn(async () => ({ status: 200 })));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("createWebhook validates secret length and target, and defaults the allowlist", async () => {
        await expect(automationService.createWebhook("u", "e", { name: "x", url: "https://hooks.example.com/e", secret: "short" })).rejects.toThrow(/16 characters/);
        await expect(automationService.createWebhook("u", "e", { name: "x", url: "http://hooks.example.com/e", secret: "long-enough-secret!!" })).rejects.toThrow(/https/);
        await expect(automationService.createWebhook("u", "e", { name: "x", url: "https://169.254.169.254/x", secret: "long-enough-secret!!" })).rejects.toThrow();

        const created = await automationService.createWebhook("u", "e", { name: "crm", url: "https://hooks.example.com/events", secret: "super-secret-16-chars!!" });
        expect(created).toMatchObject({ id: "wh1", name: "crm" });
        expect(mocks.webhookCreate).toHaveBeenCalledWith("org-1", expect.objectContaining({ allowed_hosts: ["hooks.example.com"] }));
    });

    it("getWebhooks never exposes the signing secret", async () => {
        mocks.webhooksList.mockResolvedValue([hookRow]);
        const rows = await automationService.getWebhooks("u", "e");
        expect(rows).toHaveLength(1);
        expect(rows[0]).not.toHaveProperty("secret");
        expect(rows[0]).toMatchObject({ name: "crm", hasSecret: true });
    });

    it("setWebhookActive fails closed for other organizations", async () => {
        await expect(automationService.setWebhookActive("u", "e", "wh-x", false)).rejects.toThrow(/not found in your organization/);
    });

    it("runWorkflow delivers a named webhook and persists the delivery row", async () => {
        mocks.webhooksList.mockResolvedValue([hookRow]);
        mocks.actionsList.mockResolvedValue([{ id: "a1", step_order: 1, action_type: "webhook", config: { webhookName: "crm", event: "lead.created", payload: { id: 7 } } }]);

        await automationService.runWorkflow("u", "e", "w1");
        // runWorkflow returns the re-read execution row (mock-static), so the
        // worker outcome is asserted on the persisted update instead.
        expect(mocks.executionUpdate).toHaveBeenCalledWith("e1", expect.objectContaining({ status: "completed" }));

        const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { headers: Record<string, string>; body: string; signal: unknown }];
        expect(url).toBe("https://hooks.example.com/events");
        expect(init.headers["x-aaos-signature"]).toMatch(/^t=\d+,v1=[0-9a-f]{64}$/);
        expect(init.headers["x-idempotency-key"]).toBe("e1:1");
        expect(JSON.parse(init.body)).toMatchObject({ event: "lead.created", payload: { id: 7 } });

        expect(mocks.deliveryCreate).toHaveBeenCalledWith(
            "org-1",
            expect.objectContaining({ event: "lead.created", target_host: "hooks.example.com", status: "delivered", attempts: 1, response_status: 200, idempotency_key: "e1:1" }),
        );
    });

    it("runWorkflow fails clearly for unknown webhook names", async () => {
        mocks.webhooksList.mockResolvedValue([]);
        mocks.actionsList.mockResolvedValue([{ id: "a1", step_order: 1, action_type: "webhook", config: { webhookName: "ghost" } }]);

        await automationService.runWorkflow("u", "e", "w1");
        expect(mocks.executionUpdate).toHaveBeenCalledWith("e1", expect.objectContaining({ status: "failed" }));
        expect(mocks.deliveryCreate).not.toHaveBeenCalled();
        const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
