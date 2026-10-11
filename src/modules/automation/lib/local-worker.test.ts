import { describe, it, expect } from "vitest";
import {
    evaluateConditions,
    planStepRetries,
    runLocalWorkflow,
    type WorkerPorts,
} from "./local-worker";

const NOW = new Date("2026-10-11T12:00:00Z").getTime();
const ports = (overrides?: Partial<WorkerPorts>): WorkerPorts => ({
    createTask: async (input) => ({ id: `task-${input.title.length}` }),
    recordLog: async () => undefined,
    now: () => NOW,
    ...overrides,
});

describe("local-worker", () => {
    it("evaluates conditions with AND semantics and dot paths", () => {
        expect(evaluateConditions([], {}).pass).toBe(true);
        expect(evaluateConditions([{ field: "lead.score", operator: "greater_than", value: "50" }], { lead: { score: 80 } }).pass).toBe(true);
        expect(evaluateConditions([{ field: "lead.score", operator: "greater_than", value: "50" }], { lead: { score: 10 } }).pass).toBe(false);
        expect(evaluateConditions([{ field: "a", operator: "bogus", value: "x" }], { a: "x" }).pass).toBe(false);
        expect(evaluateConditions([{ field: "s", operator: "contains", value: "vip" }], { s: "vip-lead" }).pass).toBe(true);
    });

    it("executes create_task and notify with idempotency keys", async () => {
        const logged: string[] = [];
        const result = await runLocalWorkflow({
            executionId: "e1",
            actions: [
                { stepOrder: 2, actionType: "notify", config: { message: "hello" } },
                { stepOrder: 1, actionType: "create_task", config: { title: "Follow up" } },
            ],
            conditions: [],
            triggerPayload: {},
            ports: ports({ recordLog: async (m) => { logged.push(m); } }),
        });
        expect(result.status).toBe("completed");
        expect(result.steps.map((s) => s.stepOrder)).toEqual([1, 2]);
        expect(result.steps[0].idempotencyKey).toBe("e1:1");
        expect(result.steps[0].taskId).toBe("task-9");
        expect(logged).toEqual(["hello"]);
    });

    it("cancels on unmet conditions and fails fast on unsupported actions", async () => {
        const cancelled = await runLocalWorkflow({
            executionId: "e2",
            actions: [{ stepOrder: 1, actionType: "create_task", config: { title: "T" } }],
            conditions: [{ field: "x", operator: "equals", value: "y" }],
            triggerPayload: {},
            ports: ports(),
        });
        expect(cancelled.status).toBe("cancelled");

        const failed = await runLocalWorkflow({
            executionId: "e3",
            actions: [
                { stepOrder: 1, actionType: "create_task", config: { title: "T" } },
                { stepOrder: 2, actionType: "email", config: {} },
            ],
            conditions: [],
            triggerPayload: {},
            ports: ports(),
        });
        expect(failed.status).toBe("failed");
        expect(failed.steps.map((s) => s.status)).toEqual(["completed", "failed"]);
        expect(String(failed.error)).toMatch(/email/);
    });

    it("plans retries for failed steps without executing them", () => {
        const plans = planStepRetries(
            [{ stepOrder: 2, actionType: "email", status: "failed", attempts: 1, idempotencyKey: "e:2" }],
            3, 60, NOW,
        );
        expect(plans).toEqual([{ stepOrder: 2, attemptsUsed: 1, maxAttempts: 3, retryable: true, nextRetryAt: new Date(NOW + 60_000).toISOString() }]);
        expect(planStepRetries([{ stepOrder: 1, actionType: "x", status: "completed", attempts: 1, idempotencyKey: "e:1" }], 3, 60, NOW)).toEqual([]);
    });
});
