export type CapabilityStatus = "registered" | "active" | "idle" | "error" | "completed" | "planned" | "healthy" | "degraded" | "offline";

export type WorkflowStatus = "draft" | "pending" | "running" | "completed" | "failed" | "retrying" | "cancelled";

export interface CapabilityDefinition {
    id: string;
    name: string;
    route: string;
    version: string;
    status: CapabilityStatus;
    health: CapabilityHealth;
    dependencies: string[];
    apis: string[];
    events: string[];
}

export interface WorkflowStep {
    id: string;
    name: string;
    capabilityId: string;
    action: string;
    config?: Record<string, unknown>;
}

export interface WorkflowDefinition {
    id: string;
    name: string;
    description?: string;
    steps: WorkflowStep[];
    createdAt: string;
}

export interface WorkflowInstance {
    id: string;
    definitionId: string;
    name: string;
    status: WorkflowStatus;
    currentStepIndex: number;
    steps: WorkflowStep[];
    startedAt: string;
    completedAt?: string;
    input: Record<string, unknown>;
    output?: Record<string, unknown>;
    error?: string;
}

export interface PlatformEvent {
    id: string;
    type: string;
    source: string;
    target?: string;
    payload: Record<string, unknown>;
    timestamp: string;
}

export interface AiDecision {
    capabilityId: string;
    agentId: string;
    priority: "low" | "medium" | "high" | "critical";
    escalation: boolean;
    routing: string;
    reason: string;
}

export interface SharedService {
    id: string;
    name: string;
    module: string;
    status: "available" | "degraded" | "offline";
}

export interface QueueStatus {
    name: string;
    pending: number;
    processing: number;
    failed: number;
}

export interface CapabilityHealth {
    capabilityId: string;
    status: "healthy" | "degraded" | "offline";
    uptime: number;
    lastCheck: string;
    message?: string;
}

export interface PlatformHealth {
    overall: "healthy" | "degraded" | "critical";
    capabilities: CapabilityHealth[];
    queues: QueueStatus[];
    checkedAt: string;
}

export interface OrchestrationRule {
    id: string;
    name: string;
    description: string;
    enforced: boolean;
}

/** @deprecated Use CapabilityDefinition — kept for client-success bridge compatibility */
export interface CapabilityRegistration {
    id: string;
    name: string;
    module: string;
    status: CapabilityStatus;
    registeredAt: string;
    config: Record<string, unknown>;
}

/** @deprecated Use WorkflowInstance — kept for client-success bridge compatibility */
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

export interface PublishEventInput {
    type: string;
    source: string;
    target?: string;
    payload?: Record<string, unknown>;
}

export interface SubscribeInput {
    capabilityId: string;
    eventTypes: string[];
}

export interface CreateWorkflowInput {
    name: string;
    steps?: WorkflowStep[];
    input?: Record<string, unknown>;
}

export interface AiDecisionContext {
    eventType?: string;
    sourceCapability?: string;
    payload?: Record<string, unknown>;
}

export interface DeveloperConsoleData {
    capabilities: CapabilityDefinition[];
    recentEvents: PlatformEvent[];
    activeWorkflows: WorkflowInstance[];
    services: SharedService[];
    rules: OrchestrationRule[];
}
