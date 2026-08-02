export type AgentStatus = "active" | "inactive" | "draft";
export type WorkflowStatus = "draft" | "active" | "paused" | "archived";
export type TriggerType = "event" | "schedule" | "webhook" | "manual";
export type ActionType = "notify" | "email" | "webhook" | "ai_task" | "create_task" | "update_record" | "delay";
export type ConditionOperator = "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
export type ExecutionStatus = "pending" | "running" | "completed" | "failed" | "cancelled";
export type LogLevel = "info" | "warn" | "error" | "debug";

export interface AiAgent {
    id: string;
    name: string;
    description: string;
    model: string;
    systemPrompt: string;
    status: AgentStatus;
    temperature: number;
    maxTokens: number;
    config: Record<string, unknown>;
    updatedAt: string;
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    definition: Record<string, unknown>;
    isPublic: boolean;
    updatedAt: string;
}

export interface WorkflowTrigger {
    id: string;
    workflowId: string;
    triggerType: TriggerType;
    eventName: string;
    config: Record<string, unknown>;
    isActive: boolean;
}

export interface WorkflowAction {
    id: string;
    workflowId: string;
    stepOrder: number;
    actionType: ActionType;
    config: Record<string, unknown>;
    agentId: string | null;
    agentName: string | null;
}

export interface WorkflowCondition {
    id: string;
    workflowId: string;
    stepOrder: number;
    field: string;
    operator: ConditionOperator;
    value: string;
    logicGroup: string;
}

export interface WorkflowSchedule {
    id: string;
    workflowId: string;
    cronExpression: string;
    timezone: string;
    nextRunAt: string | null;
    lastRunAt: string | null;
    isActive: boolean;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    status: WorkflowStatus;
    version: number;
    templateId: string | null;
    templateName: string | null;
    agentId: string | null;
    agentName: string | null;
    triggers: WorkflowTrigger[];
    actions: WorkflowAction[];
    conditions: WorkflowCondition[];
    schedules: WorkflowSchedule[];
    updatedAt: string;
}

export interface WorkflowExecution {
    id: string;
    workflowId: string;
    workflowName: string;
    status: ExecutionStatus;
    triggerType: TriggerType;
    startedAt: string;
    completedAt: string | null;
    durationMs: number;
    result: Record<string, unknown>;
    errorMessage: string;
}

export interface AutomationLog {
    id: string;
    workflowId: string | null;
    workflowName: string | null;
    executionId: string | null;
    level: LogLevel;
    message: string;
    metadata: Record<string, unknown>;
    timestamp: string;
}

export interface AutomationDashboardStats {
    activeWorkflows: string;
    pausedWorkflows: string;
    activeAgents: string;
    completedExecutions: string;
    failedExecutions: string;
    runningExecutions: string;
    errorLogs: string;
    successRate: string;
}

export interface AutomationAnalytics {
    executionsByStatus: Array<{ status: string; count: number }>;
    topWorkflows: Array<{ workflow: string; runs: number }>;
    logsByLevel: Array<{ level: string; count: number }>;
    averageDurationMs: number;
}

export interface CreateAiAgentInput {
    name: string;
    description?: string;
    model: string;
    systemPrompt?: string;
    status?: AgentStatus;
    temperature?: number;
    maxTokens?: number;
    config?: Record<string, unknown>;
}

export interface WorkflowTriggerInput {
    triggerType: TriggerType;
    eventName?: string;
    config?: Record<string, unknown>;
    isActive?: boolean;
}

export interface WorkflowActionInput {
    stepOrder?: number;
    actionType: ActionType;
    config?: Record<string, unknown>;
    agentId?: string | null;
}

export interface WorkflowConditionInput {
    stepOrder?: number;
    field: string;
    operator: ConditionOperator;
    value: string;
    logicGroup?: string;
}

export interface WorkflowScheduleInput {
    cronExpression: string;
    timezone?: string;
    nextRunAt?: string | null;
    isActive?: boolean;
}

export interface CreateWorkflowInput {
    name: string;
    description?: string;
    status?: WorkflowStatus;
    templateId?: string | null;
    agentId?: string | null;
    triggers?: WorkflowTriggerInput[];
    actions?: WorkflowActionInput[];
    conditions?: WorkflowConditionInput[];
    schedules?: WorkflowScheduleInput[];
}

export type WorkflowStatusFilter = "all" | WorkflowStatus;
