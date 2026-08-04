export type CapabilityStatus = "registered" | "active" | "idle" | "error" | "completed";

export interface CapabilityRegistration {
    id: string;
    name: string;
    module: string;
    status: CapabilityStatus;
    registeredAt: string;
    config: Record<string, unknown>;
}

export interface WorkflowExecution {
    id: string;
    capabilityId: string;
    workflowName: string;
    status: "pending" | "running" | "completed" | "failed";
    startedAt: string;
    completedAt?: string;
    input: Record<string, unknown>;
    output?: Record<string, unknown>;
    error?: string;
}

export interface CapabilityStatusReport {
    capabilityId: string;
    name: string;
    status: CapabilityStatus;
    activeWorkflows: number;
    completedWorkflows: number;
    lastExecutedAt?: string;
}

export interface RegisterCapabilityInput {
    name: string;
    module: string;
    config?: Record<string, unknown>;
}

export interface ExecuteWorkflowInput {
    capabilityId: string;
    workflowName: string;
    payload?: Record<string, unknown>;
}
