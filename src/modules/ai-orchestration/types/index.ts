export type AiOrchestrationTab =
    | "overview"
    | "providers"
    | "routing"
    | "agents"
    | "prompts"
    | "tasks"
    | "sessions"
    | "usage"
    | "costs"
    | "rateLimits"
    | "permissions"
    | "health"
    | "retry"
    | "audit"
    | "analytics"
    | "sdk";

export interface AiOrchestrationDashboardStats {
    totalProviders: number;
    activeAgents: number;
    completedTasks: number;
    pendingTasks: number;
    activeSessions: number;
    totalTokens: number;
    totalCostUsd: number;
    healthyProviders: number;
}

export interface ProviderSummary {
    id: string;
    name: string;
    providerKey: string;
    apiBaseUrl: string;
    status: string;
    isDefault: boolean;
    routeCount: number;
}

export interface ModelRouteSummary {
    id: string;
    name: string;
    providerName: string;
    modelId: string;
    priority: number;
    routingStrategy: string;
    fallbackProviderName?: string | null;
    isActive: boolean;
    agentCount: number;
}

export interface AgentSummary {
    id: string;
    name: string;
    agentType: string;
    providerName?: string | null;
    routeName?: string | null;
    workflowAgentName?: string | null;
    capabilities: string[];
    status: string;
    taskCount: number;
}

export interface PromptTemplateSummary {
    id: string;
    name: string;
    templateKey: string;
    category: string;
    contentPreview: string;
    version: number;
    status: string;
}

export interface SessionSummary {
    id: string;
    sessionKey: string;
    agentName?: string | null;
    moduleSource: string;
    entityType: string;
    status: string;
    expiresAt?: string | null;
    createdAt: string;
}

export interface TaskExecutionSummary {
    id: string;
    agentName?: string | null;
    sessionKey?: string | null;
    providerName?: string | null;
    taskType: string;
    status: string;
    modelUsed: string;
    tokensUsed: number;
    durationMs: number;
    errorMessage: string;
    startedAt: string;
    completedAt?: string | null;
}

export interface UsageRecordSummary {
    id: string;
    providerName?: string | null;
    agentName?: string | null;
    tokensInput: number;
    tokensOutput: number;
    requestCount: number;
    recordedAt: string;
}

export interface CostRecordSummary {
    id: string;
    providerName?: string | null;
    costUsd: number;
    pricingModel: string;
    recordedAt: string;
}

export interface RateLimitSummary {
    id: string;
    scopeType: string;
    scopeName: string;
    requestsPerMinute: number;
    tokensPerDay: number;
    isActive: boolean;
}

export interface PermissionGrantSummary {
    id: string;
    granteeType: string;
    granteeName?: string | null;
    permissionKey: string;
    resourceType: string;
    isActive: boolean;
}

export interface HealthCheckSummary {
    id: string;
    providerName: string;
    status: string;
    latencyMs: number;
    errorMessage: string;
    lastCheckedAt: string;
}

export interface RetryPolicySummary {
    id: string;
    name: string;
    maxRetries: number;
    backoffStrategy: string;
    fallbackRouteName?: string | null;
    isActive: boolean;
}

export interface AiAuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    createdAt: string;
}

export interface AiAnalyticsSummary {
    id: string;
    metricKey: string;
    metricValue: number;
    dimensions: Record<string, unknown>;
    periodStart: string;
    periodEnd: string;
    computedAt: string;
}

export interface AiOrchestrationReport {
    tasksByStatus: Array<{ label: string; count: number }>;
    metricsByModule: Array<{ label: string; value: number }>;
    totalTasks: number;
    totalTokens: number;
}

export interface CrossModuleLinks {
    crmSessions: number;
    projectSessions: number;
    financeSessions: number;
    hrSessions: number;
    inventorySessions: number;
    supportSessions: number;
    salesSessions: number;
    documentsSessions: number;
    automationSessions: number;
    analyticsSessions: number;
    settingsSessions: number;
}

export interface CreateProviderInput { name: string; providerKey: string; apiBaseUrl: string; isDefault?: boolean; }
export interface CreateModelRouteInput { name: string; providerId: string; modelId: string; priority: number; routingStrategy: string; fallbackProviderId?: string; }
export interface CreateAgentInput { name: string; agentType: string; providerId?: string; modelRouteId?: string; workflowAgentId?: string; capabilities?: string[]; }
export interface CreatePromptTemplateInput { name: string; templateKey: string; category: string; content: string; variables?: string[]; }
export interface CreateSessionInput { sessionKey: string; agentId?: string; moduleSource: string; entityType: string; entityId?: string; context?: Record<string, unknown>; expiresAt?: string; }
export interface CreateTaskExecutionInput { taskType: string; agentId?: string; sessionId?: string; providerId?: string; inputPayload?: Record<string, unknown>; }
export interface CreateRateLimitInput { scopeType: string; scopeId?: string; requestsPerMinute: number; tokensPerDay: number; }
export interface CreatePermissionGrantInput { granteeType: string; granteeId?: string; permissionKey: string; resourceType: string; resourceId?: string; }
export interface CreateRetryPolicyInput { name: string; maxRetries: number; backoffStrategy: string; fallbackRouteId?: string; }
export interface UpdateTaskStatusInput { status: string; outputPayload?: Record<string, unknown>; errorMessage?: string; tokensUsed?: number; durationMs?: number; modelUsed?: string; }

export interface AiSdkExecuteInput {
    taskType: string;
    agentId?: string;
    sessionId?: string;
    moduleSource: string;
    inputPayload: Record<string, unknown>;
}

export interface AiSdkExecuteResult {
    taskId: string;
    status: string;
    routeName?: string | null;
    providerName?: string | null;
    modelUsed?: string;
}

export interface AiSdkRouteResult {
    routeId: string;
    routeName: string;
    providerId: string;
    providerName: string;
    modelId: string;
    fallbackRouteName?: string | null;
}
