/**
 * Deterministic local workflow worker (automation, real execution path).
 *
 * Executes the SAFE action subset with injected ports (no direct imports, so
 * unit tests run side-effect-free):
 * - `create_task` → creates a real task through the injected creator.
 * - `notify` → persists an automation-log record through the injected logger
 *   (in-app record only; never an external send).
 *
 * Everything else (`email`, `webhook`, `ai_task`, `update_record`, `delay`)
 * is refused with an explicit reason: those need providers, broad write
 * access, or scheduling that does not exist here. Conditions are evaluated
 * first (AND semantics, dot-path fields); unmet conditions cancel (not
 * fail) the run. Steps run sequentially by step_order, fail-fast, each with
 * a stable idempotency key `${executionId}:${stepOrder}` recorded in the
 * result envelope. Retries are PLANNED (pure `planStepRetries`), not
 * executed in-request — there is no scheduler, and pretending otherwise
 * would fabricate execution.
 */

export const EXECUTABLE_ACTIONS = ["create_task", "notify"] as const;

export interface WorkerStepInput {
    stepOrder: number;
    actionType: string;
    config: Record<string, unknown>;
}

export interface WorkerConditionInput {
    field: string;
    operator: string;
    value: string;
}

export interface WorkerPorts {
    createTask: (input: { title: string; description: string; dueDate: string }) => Promise<{ id: string }>;
    recordLog: (message: string, level: "info" | "warn" | "error") => Promise<void>;
    now: () => number;
}

export type WorkerStepStatus = "completed" | "failed" | "skipped";

export interface WorkerStepResult {
    stepOrder: number;
    actionType: string;
    status: WorkerStepStatus;
    attempts: number;
    idempotencyKey: string;
    taskId?: string;
    error?: string;
}

export interface WorkerResult {
    status: "completed" | "failed" | "cancelled";
    steps: WorkerStepResult[];
    startedAt: string;
    completedAt: string;
    durationMs: number;
    error?: string;
}

export function getField(payload: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce<unknown>((current, key) => {
        if (current && typeof current === "object") return (current as Record<string, unknown>)[key];
        return undefined;
    }, payload);
}

function compare(operator: string, actual: unknown, expected: string): boolean {
    switch (operator) {
        case "equals": return String(actual ?? "") === expected;
        case "not_equals": return String(actual ?? "") !== expected;
        case "contains": return String(actual ?? "").includes(expected);
        case "greater_than": return Number(actual) > Number(expected);
        case "less_than": return Number(actual) < Number(expected);
        default: return false;
    }
}

export function evaluateConditions(
    conditions: WorkerConditionInput[],
    triggerPayload: Record<string, unknown>,
): { pass: boolean; failedOn?: string } {
    for (const condition of conditions) {
        if (!compare(condition.operator, getField(triggerPayload, condition.field), condition.value)) {
            return { pass: false, failedOn: `${condition.field} ${condition.operator} ${condition.value}` };
        }
    }
    return { pass: true };
}

function stringField(config: Record<string, unknown>, key: string): string {
    const value = config[key];
    return typeof value === "string" ? value.trim() : "";
}

export async function runLocalWorkflow(input: {
    executionId: string;
    actions: WorkerStepInput[];
    conditions: WorkerConditionInput[];
    triggerPayload?: Record<string, unknown>;
    ports: WorkerPorts;
}): Promise<WorkerResult> {
    const startedAt = new Date(input.ports.now()).toISOString();
    const finish = (result: Omit<WorkerResult, "startedAt" | "completedAt" | "durationMs">): WorkerResult => {
        const completedAt = new Date(input.ports.now()).toISOString();
        return { ...result, startedAt, completedAt, durationMs: Math.max(0, Date.parse(completedAt) - Date.parse(startedAt)) };
    };

    const gate = evaluateConditions(input.conditions, input.triggerPayload ?? {});
    if (!gate.pass) {
        return finish({ status: "cancelled", steps: [], error: `Conditions not met: ${gate.failedOn}` });
    }

    const ordered = [...input.actions].sort((a, b) => a.stepOrder - b.stepOrder);
    const steps: WorkerStepResult[] = [];
    for (const action of ordered) {
        const idempotencyKey = `${input.executionId}:${action.stepOrder}`;
        if (action.actionType === "create_task") {
            const title = stringField(action.config, "title");
            if (!title) {
                steps.push({ stepOrder: action.stepOrder, actionType: action.actionType, status: "failed", attempts: 1, idempotencyKey, error: "create_task needs config.title" });
                return finish({ status: "failed", steps, error: "create_task needs config.title" });
            }
            try {
                const dueDate = new Date(input.ports.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                const created = await input.ports.createTask({ title, description: stringField(action.config, "description"), dueDate });
                steps.push({ stepOrder: action.stepOrder, actionType: action.actionType, status: "completed", attempts: 1, idempotencyKey, taskId: created.id });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                steps.push({ stepOrder: action.stepOrder, actionType: action.actionType, status: "failed", attempts: 1, idempotencyKey, error: message });
                return finish({ status: "failed", steps, error: message });
            }
        } else if (action.actionType === "notify") {
            const message = stringField(action.config, "message");
            if (!message) {
                steps.push({ stepOrder: action.stepOrder, actionType: action.actionType, status: "failed", attempts: 1, idempotencyKey, error: "notify needs config.message" });
                return finish({ status: "failed", steps, error: "notify needs config.message" });
            }
            await input.ports.recordLog(message, "info");
            steps.push({ stepOrder: action.stepOrder, actionType: action.actionType, status: "completed", attempts: 1, idempotencyKey });
        } else {
            const reason = `Unsupported action '${action.actionType}': only ${EXECUTABLE_ACTIONS.join(", ")} execute locally (email/webhook/ai_task need providers; update_record/delay need privileges/scheduling)`;
            steps.push({ stepOrder: action.stepOrder, actionType: action.actionType, status: "failed", attempts: 0, idempotencyKey, error: reason });
            return finish({ status: "failed", steps, error: reason });
        }
    }
    return finish({ status: "completed", steps });
}

export interface RetryPlan {
    stepOrder: number;
    attemptsUsed: number;
    maxAttempts: number;
    retryable: boolean;
    nextRetryAt: string | null;
}

/** Pure retry planning for failed steps (scheduling itself needs a scheduler/owner decision). */
export function planStepRetries(
    steps: WorkerStepResult[],
    maxAttempts: number,
    backoffSeconds: number,
    now: number = Date.now(),
): RetryPlan[] {
    return steps
        .filter((step) => step.status === "failed")
        .map((step) => {
            const retryable = step.attempts < Math.max(1, Math.floor(maxAttempts));
            return {
                stepOrder: step.stepOrder,
                attemptsUsed: step.attempts,
                maxAttempts: Math.max(1, Math.floor(maxAttempts)),
                retryable,
                nextRetryAt: retryable ? new Date(now + Math.max(0, backoffSeconds) * 1000).toISOString() : null,
            };
        });
}
