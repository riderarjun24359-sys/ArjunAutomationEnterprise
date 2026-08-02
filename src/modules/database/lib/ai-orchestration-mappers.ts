import type {
    DbAiAgent,
    DbAiCostRecord,
    DbAiModelRoute,
    DbAiOrchestrationAgent,
    DbAiOrchestrationAnalytics,
    DbAiOrchestrationAuditLog,
    DbAiPermissionGrant,
    DbAiPromptTemplate,
    DbAiProvider,
    DbAiProviderHealthCheck,
    DbAiRateLimit,
    DbAiRetryPolicy,
    DbAiSession,
    DbAiTaskExecution,
    DbAiUsageRecord,
    DbEmployee,
} from "@/src/modules/database/types/platform";
import type {
    AgentSummary,
    AiAnalyticsSummary,
    AiAuditEntry,
    AiOrchestrationDashboardStats,
    AiOrchestrationReport,
    CostRecordSummary,
    CreateAgentInput,
    CreateModelRouteInput,
    CreatePermissionGrantInput,
    CreatePromptTemplateInput,
    CreateProviderInput,
    CreateRateLimitInput,
    CreateRetryPolicyInput,
    CreateSessionInput,
    CreateTaskExecutionInput,
    CrossModuleLinks,
    HealthCheckSummary,
    ModelRouteSummary,
    PermissionGrantSummary,
    PromptTemplateSummary,
    ProviderSummary,
    RateLimitSummary,
    RetryPolicySummary,
    SessionSummary,
    TaskExecutionSummary,
    UpdateTaskStatusInput,
    UsageRecordSummary,
} from "@/src/modules/ai-orchestration/types";

type LookupMaps = {
    providers: Map<string, DbAiProvider>;
    routes: Map<string, DbAiModelRoute>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
    workflowAgents: Map<string, DbAiAgent>;
    employees: Map<string, DbEmployee>;
};

export const buildLookupMaps = (
    providers: DbAiProvider[],
    routes: DbAiModelRoute[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
    workflowAgents: DbAiAgent[],
    employees: DbEmployee[],
): LookupMaps => ({
    providers: new Map(providers.map((item) => [item.id, item])),
    routes: new Map(routes.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
    workflowAgents: new Map(workflowAgents.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
});

const employeeName = (maps: LookupMaps, id?: string | null) => {
    if (!id) return null;
    const employee = maps.employees.get(id);
    return employee ? `${employee.first_name} ${employee.last_name}` : null;
};

export const mapProviderSummary = (record: DbAiProvider, routeCount: number): ProviderSummary => ({
    id: record.id, name: record.name, providerKey: record.provider_key, apiBaseUrl: record.api_base_url, status: record.status, isDefault: record.is_default, routeCount,
});

export const mapModelRouteSummary = (record: DbAiModelRoute, maps: LookupMaps, agentCount: number): ModelRouteSummary => ({
    id: record.id, name: record.name, providerName: maps.providers.get(record.provider_id)?.name ?? "Unknown", modelId: record.model_id, priority: record.priority, routingStrategy: record.routing_strategy, fallbackProviderName: record.fallback_provider_id ? maps.providers.get(record.fallback_provider_id)?.name ?? null : null, isActive: record.is_active, agentCount,
});

export const mapAgentSummary = (record: DbAiOrchestrationAgent, maps: LookupMaps, taskCount: number): AgentSummary => ({
    id: record.id, name: record.name, agentType: record.agent_type, providerName: record.provider_id ? maps.providers.get(record.provider_id)?.name ?? null : null, routeName: record.model_route_id ? maps.routes.get(record.model_route_id)?.name ?? null : null, workflowAgentName: record.workflow_agent_id ? maps.workflowAgents.get(record.workflow_agent_id)?.name ?? null : null, capabilities: Array.isArray(record.capabilities) ? record.capabilities.map(String) : [], status: record.status, taskCount,
});

export const mapPromptTemplateSummary = (record: DbAiPromptTemplate): PromptTemplateSummary => ({
    id: record.id, name: record.name, templateKey: record.template_key, category: record.category, contentPreview: record.content.slice(0, 120), version: record.version, status: record.status,
});

export const mapSessionSummary = (record: DbAiSession, maps: LookupMaps): SessionSummary => ({
    id: record.id, sessionKey: record.session_key, agentName: record.agent_id ? maps.agents.get(record.agent_id)?.name ?? null : null, moduleSource: record.module_source, entityType: record.entity_type, status: record.status, expiresAt: record.expires_at ?? null, createdAt: record.created_at,
});

export const mapTaskExecutionSummary = (record: DbAiTaskExecution, maps: LookupMaps): TaskExecutionSummary => ({
    id: record.id, agentName: record.agent_id ? maps.agents.get(record.agent_id)?.name ?? null : null, sessionKey: record.session_id ? maps.sessions.get(record.session_id)?.session_key ?? null : null, providerName: record.provider_id ? maps.providers.get(record.provider_id)?.name ?? null : null, taskType: record.task_type, status: record.status, modelUsed: record.model_used, tokensUsed: record.tokens_used, durationMs: record.duration_ms, errorMessage: record.error_message, startedAt: record.started_at, completedAt: record.completed_at ?? null,
});

export const mapUsageRecordSummary = (record: DbAiUsageRecord, maps: LookupMaps): UsageRecordSummary => ({
    id: record.id, providerName: record.provider_id ? maps.providers.get(record.provider_id)?.name ?? null : null, agentName: record.agent_id ? maps.agents.get(record.agent_id)?.name ?? null : null, tokensInput: record.tokens_input, tokensOutput: record.tokens_output, requestCount: record.request_count, recordedAt: record.recorded_at,
});

export const mapCostRecordSummary = (record: DbAiCostRecord, maps: LookupMaps): CostRecordSummary => ({
    id: record.id, providerName: record.provider_id ? maps.providers.get(record.provider_id)?.name ?? null : null, costUsd: Number(record.cost_usd), pricingModel: record.pricing_model, recordedAt: record.recorded_at,
});

export const mapRateLimitSummary = (record: DbAiRateLimit, maps: LookupMaps): RateLimitSummary => ({
    id: record.id, scopeType: record.scope_type, scopeName: record.scope_id ? maps.agents.get(record.scope_id)?.name ?? record.scope_id : "Organization", requestsPerMinute: record.requests_per_minute, tokensPerDay: record.tokens_per_day, isActive: record.is_active,
});

export const mapPermissionGrantSummary = (record: DbAiPermissionGrant, maps: LookupMaps): PermissionGrantSummary => ({
    id: record.id, granteeType: record.grantee_type, granteeName: employeeName(maps, record.grantee_id), permissionKey: record.permission_key, resourceType: record.resource_type, isActive: record.is_active,
});

export const mapHealthCheckSummary = (record: DbAiProviderHealthCheck, maps: LookupMaps): HealthCheckSummary => ({
    id: record.id, providerName: maps.providers.get(record.provider_id)?.name ?? "Unknown", status: record.status, latencyMs: record.latency_ms, errorMessage: record.error_message, lastCheckedAt: record.last_checked_at,
});

export const mapRetryPolicySummary = (record: DbAiRetryPolicy, maps: LookupMaps): RetryPolicySummary => ({
    id: record.id, name: record.name, maxRetries: record.max_retries, backoffStrategy: record.backoff_strategy, fallbackRouteName: record.fallback_route_id ? maps.routes.get(record.fallback_route_id)?.name ?? null : null, isActive: record.is_active,
});

export const mapAuditEntry = (record: DbAiOrchestrationAuditLog): AiAuditEntry => ({
    id: record.id, entityType: record.entity_type, entityId: record.entity_id ?? null, action: record.action, summary: record.summary, createdAt: record.created_at,
});

export const mapAnalyticsSummary = (record: DbAiOrchestrationAnalytics): AiAnalyticsSummary => ({
    id: record.id, metricKey: record.metric_key, metricValue: Number(record.metric_value), dimensions: record.dimensions, periodStart: record.period_start, periodEnd: record.period_end, computedAt: record.computed_at,
});

export const buildProviderPayload = (organizationId: string, input: CreateProviderInput) => ({
    organization_id: organizationId, name: input.name, provider_key: input.providerKey, api_base_url: input.apiBaseUrl, status: "active", is_default: input.isDefault ?? false, config: {},
});

export const buildModelRoutePayload = (organizationId: string, input: CreateModelRouteInput) => ({
    organization_id: organizationId, name: input.name, provider_id: input.providerId, model_id: input.modelId, priority: input.priority, routing_strategy: input.routingStrategy, fallback_provider_id: input.fallbackProviderId || null, is_active: true,
});

export const buildAgentPayload = (organizationId: string, input: CreateAgentInput) => ({
    organization_id: organizationId, name: input.name, agent_type: input.agentType, provider_id: input.providerId || null, model_route_id: input.modelRouteId || null, workflow_agent_id: input.workflowAgentId || null, capabilities: input.capabilities ?? [], status: "active",
});

export const buildPromptTemplatePayload = (organizationId: string, input: CreatePromptTemplateInput) => ({
    organization_id: organizationId, name: input.name, template_key: input.templateKey, category: input.category, content: input.content, variables: input.variables ?? [], version: 1, status: "active",
});

export const buildSessionPayload = (organizationId: string, input: CreateSessionInput) => ({
    organization_id: organizationId, agent_id: input.agentId || null, session_key: input.sessionKey, module_source: input.moduleSource, entity_type: input.entityType, entity_id: input.entityId || null, context: input.context ?? {}, status: "active", expires_at: input.expiresAt || null,
});

export const buildTaskExecutionPayload = (organizationId: string, input: CreateTaskExecutionInput) => ({
    organization_id: organizationId, agent_id: input.agentId || null, session_id: input.sessionId || null, provider_id: input.providerId || null, task_type: input.taskType, input_payload: input.inputPayload ?? {}, output_payload: {}, status: "pending", model_used: "", tokens_used: 0, duration_ms: 0, error_message: "",
});

export const buildRateLimitPayload = (organizationId: string, input: CreateRateLimitInput) => ({
    organization_id: organizationId, scope_type: input.scopeType, scope_id: input.scopeId || null, requests_per_minute: input.requestsPerMinute, tokens_per_day: input.tokensPerDay, is_active: true,
});

export const buildPermissionGrantPayload = (organizationId: string, input: CreatePermissionGrantInput) => ({
    organization_id: organizationId, grantee_type: input.granteeType, grantee_id: input.granteeId || null, permission_key: input.permissionKey, resource_type: input.resourceType, resource_id: input.resourceId || null, is_active: true,
});

export const buildRetryPolicyPayload = (organizationId: string, input: CreateRetryPolicyInput) => ({
    organization_id: organizationId, name: input.name, max_retries: input.maxRetries, backoff_strategy: input.backoffStrategy, fallback_route_id: input.fallbackRouteId || null, is_active: true,
});

export const buildAiAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId, entity_type: entityType, entity_id: entityId ?? null, action, summary, metadata: {},
});

export const buildUpdateTaskStatusPayload = (input: UpdateTaskStatusInput) => ({
    status: input.status, output_payload: input.outputPayload ?? {}, error_message: input.errorMessage ?? "", completed_at: input.status === "completed" || input.status === "failed" ? new Date().toISOString() : null, tokens_used: input.tokensUsed ?? 0, duration_ms: input.durationMs ?? 0, model_used: input.modelUsed ?? "",
});

export const buildAiDashboardStats = (input: {
    providers: ProviderSummary[];
    agents: AgentSummary[];
    tasks: TaskExecutionSummary[];
    usage: UsageRecordSummary[];
    costs: CostRecordSummary[];
    healthChecks: HealthCheckSummary[];
    sessions: SessionSummary[];
}): AiOrchestrationDashboardStats => {
    const completedTasks = input.tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = input.tasks.filter((t) => t.status === "pending").length;
    const totalTokens = input.usage.reduce((sum, u) => sum + u.tokensInput + u.tokensOutput, 0);
    const totalCost = input.costs.reduce((sum, c) => sum + c.costUsd, 0);
    const healthyProviders = input.healthChecks.filter((h) => h.status === "healthy").length;
    return {
        totalProviders: input.providers.length,
        activeAgents: input.agents.filter((a) => a.status === "active").length,
        completedTasks,
        pendingTasks,
        activeSessions: input.sessions.filter((s) => s.status === "active").length,
        totalTokens,
        totalCostUsd: totalCost,
        healthyProviders,
    };
};

export const buildAiReport = (input: { tasks: TaskExecutionSummary[]; usage: UsageRecordSummary[]; analytics: AiAnalyticsSummary[] }): AiOrchestrationReport => {
    const statusMap = new Map<string, number>();
    for (const task of input.tasks) statusMap.set(task.status, (statusMap.get(task.status) ?? 0) + 1);
    const moduleMap = new Map<string, number>();
    for (const metric of input.analytics) {
        const moduleName = String(metric.dimensions.module ?? "general");
        moduleMap.set(moduleName, (moduleMap.get(moduleName) ?? 0) + metric.metricValue);
    }
    return {
        tasksByStatus: Array.from(statusMap.entries()).map(([label, count]) => ({ label, count })),
        metricsByModule: Array.from(moduleMap.entries()).map(([label, value]) => ({ label, value })),
        totalTasks: input.tasks.length,
        totalTokens: input.usage.reduce((sum, u) => sum + u.tokensInput + u.tokensOutput, 0),
    };
};

export const buildCrossModuleLinks = (input: { sessions: SessionSummary[] }): CrossModuleLinks => {
    const modules = ["crm", "projects", "finance", "hr", "inventory", "support", "sales", "documents", "automation", "analytics", "settings"];
    const counts = Object.fromEntries(modules.map((m) => [m, input.sessions.filter((s) => s.moduleSource === m).length])) as Record<string, number>;
    return {
        crmSessions: counts.crm ?? 0,
        projectSessions: counts.projects ?? 0,
        financeSessions: counts.finance ?? 0,
        hrSessions: counts.hr ?? 0,
        inventorySessions: counts.inventory ?? 0,
        supportSessions: counts.support ?? 0,
        salesSessions: counts.sales ?? 0,
        documentsSessions: counts.documents ?? 0,
        automationSessions: counts.automation ?? 0,
        analyticsSessions: counts.analytics ?? 0,
        settingsSessions: counts.settings ?? 0,
    };
};

export const resolveModelRoute = (routes: DbAiModelRoute[], strategy = "priority"): DbAiModelRoute | null => {
    const active = routes.filter((route) => route.is_active);
    if (active.length === 0) return null;
    if (strategy === "fallback") return active.sort((a, b) => a.priority - b.priority)[0] ?? null;
    return active.sort((a, b) => a.priority - b.priority)[0] ?? null;
};

export const resolveRetryFallback = (policies: DbAiRetryPolicy[], routes: DbAiModelRoute[]): DbAiModelRoute | null => {
    const policy = policies.find((item) => item.is_active);
    if (!policy?.fallback_route_id) return null;
    return routes.find((route) => route.id === policy.fallback_route_id) ?? null;
};
