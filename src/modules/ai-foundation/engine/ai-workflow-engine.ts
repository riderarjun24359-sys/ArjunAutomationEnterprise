import type { AiWorkflow, AiWorkflowStep } from "../types";

const WORKFLOWS: AiWorkflow[] = [
    {
        id: "wf-onboard",
        name: "Client Onboarding AI Chain",
        mode: "sequential",
        steps: [
            { id: "s1", agentId: "agent-ba", action: "analyze-requirements", requiresApproval: false },
            { id: "s2", agentId: "agent-sa", action: "design-solution", requiresApproval: true },
            { id: "s3", agentId: "agent-dev", action: "generate-code", requiresApproval: false },
        ],
        status: "idle",
        orchestratedBy: "missionCore",
    },
    {
        id: "wf-review",
        name: "Parallel Code Review",
        mode: "parallel",
        steps: [
            { id: "s1", agentId: "agent-qa", action: "run-tests", requiresApproval: false },
            { id: "s2", agentId: "agent-dev", action: "review-code", requiresApproval: false },
        ],
        status: "idle",
        orchestratedBy: "missionCore",
    },
];

export function getWorkflows(): AiWorkflow[] {
    return WORKFLOWS;
}

export function executeWorkflow(id: string, mode?: "sequential" | "parallel" | "conditional"): AiWorkflow | null {
    const wf = WORKFLOWS.find((w) => w.id === id);
    if (!wf) return null;
    wf.status = "running";
    wf.mode = mode ?? wf.mode;
    return wf;
}

export function routeConditionally(step: AiWorkflowStep, context: Record<string, unknown>): boolean {
    if (!step.condition) return true;
    return Boolean(context[step.condition]);
}

export function requiresHumanApproval(step: AiWorkflowStep): boolean {
    return step.requiresApproval;
}

export function completeWorkflow(id: string): AiWorkflow | null {
    const wf = WORKFLOWS.find((w) => w.id === id);
    if (!wf) return null;
    wf.status = "completed";
    return wf;
}
