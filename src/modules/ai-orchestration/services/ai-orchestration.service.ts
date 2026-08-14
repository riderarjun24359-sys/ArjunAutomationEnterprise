import {
    buildAgentPayload,
    buildAiAuditPayload,
    buildAiDashboardStats,
    buildAiReport,
    buildCrossModuleLinks,
    buildLookupMaps,
    buildModelRoutePayload,
    buildPermissionGrantPayload,
    buildPromptTemplatePayload,
    buildProviderPayload,
    buildRateLimitPayload,
    buildRetryPolicyPayload,
    buildSessionPayload,
    buildTaskExecutionPayload,
    buildUpdateTaskStatusPayload,
    mapAgentSummary,
    mapAnalyticsSummary,
    mapAuditEntry,
    mapCostRecordSummary,
    mapHealthCheckSummary,
    mapModelRouteSummary,
    mapPermissionGrantSummary,
    mapPromptTemplateSummary,
    mapProviderSummary,
    mapRateLimitSummary,
    mapRetryPolicySummary,
    mapSessionSummary,
    mapTaskExecutionSummary,
    mapUsageRecordSummary,
    resolveModelRoute,
    resolveRetryFallback,
} from "@/src/modules/database/lib/ai-orchestration-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    AgentSummary,
    AiAnalyticsSummary,
    AiAuditEntry,
    AiOrchestrationDashboardStats,
    AiOrchestrationReport,
    AiSdkExecuteInput,
    AiSdkExecuteResult,
    AiSdkRouteResult,
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

export class AiOrchestrationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [providers, routes, agents, sessions, workflowAgents, employees] = await Promise.all([
            databaseService.aiProviders.listByOrganization(organizationId),
            databaseService.aiModelRoutes.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
            databaseService.aiAgents.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(providers, routes, agents, sessions, workflowAgents, employees);
    }

    async getProviders(authUserId: string, email: string, fullName?: string | null): Promise<ProviderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [providers, routes] = await Promise.all([
            databaseService.aiProviders.listByOrganization(context.organizationId),
            databaseService.aiModelRoutes.listByOrganization(context.organizationId),
        ]);
        return providers.map((provider) => mapProviderSummary(provider, routes.filter((route) => route.provider_id === provider.id).length));
    }

    async createProvider(authUserId: string, email: string, input: CreateProviderInput, fullName?: string | null): Promise<ProviderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiProviders.create(buildProviderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create provider");
        await databaseService.aiOrchestrationAuditLogs.create(buildAiAuditPayload(context.organizationId, "provider", "create", `Provider ${created.name} registered`, created.id));
        return mapProviderSummary(created, 0);
    }

    async getModelRoutes(authUserId: string, email: string, fullName?: string | null): Promise<ModelRouteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const [routes, agents] = await Promise.all([
            databaseService.aiModelRoutes.listByOrganization(context.organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId),
        ]);
        return routes.map((route) => mapModelRouteSummary(route, maps, agents.filter((agent) => agent.model_route_id === route.id).length));
    }

    async createModelRoute(authUserId: string, email: string, input: CreateModelRouteInput, fullName?: string | null): Promise<ModelRouteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiModelRoutes.create(buildModelRoutePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create model route");
        const maps = await this.getMaps(context.organizationId);
        return mapModelRouteSummary(created, maps, 0);
    }

    async getAgents(authUserId: string, email: string, fullName?: string | null): Promise<AgentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const [agents, tasks] = await Promise.all([
            databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId),
            databaseService.aiTaskExecutions.listByOrganization(context.organizationId),
        ]);
        return agents.map((agent) => mapAgentSummary(agent, maps, tasks.filter((task) => task.agent_id === agent.id).length));
    }

    async createAgent(authUserId: string, email: string, input: CreateAgentInput, fullName?: string | null): Promise<AgentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiOrchestrationAgents.create(buildAgentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create agent");
        const maps = await this.getMaps(context.organizationId);
        return mapAgentSummary(created, maps, 0);
    }

    async getPromptTemplates(authUserId: string, email: string, fullName?: string | null): Promise<PromptTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiPromptTemplates.listByOrganization(context.organizationId)).map(mapPromptTemplateSummary);
    }

    async createPromptTemplate(authUserId: string, email: string, input: CreatePromptTemplateInput, fullName?: string | null): Promise<PromptTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiPromptTemplates.create(buildPromptTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create prompt template");
        return mapPromptTemplateSummary(created);
    }

    async getSessions(authUserId: string, email: string, fullName?: string | null): Promise<SessionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiSessions.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((session) => mapSessionSummary(session, maps));
    }

    async createSession(authUserId: string, email: string, input: CreateSessionInput, fullName?: string | null): Promise<SessionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiSessions.create(buildSessionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create session");
        const maps = await this.getMaps(context.organizationId);
        return mapSessionSummary(created, maps);
    }

    async getTaskExecutions(authUserId: string, email: string, fullName?: string | null): Promise<TaskExecutionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiTaskExecutions.listByOrganization(context.organizationId, { orderBy: "started_at", orderDirection: "desc" })).map((task) => mapTaskExecutionSummary(task, maps));
    }

    async createTaskExecution(authUserId: string, email: string, input: CreateTaskExecutionInput, fullName?: string | null): Promise<TaskExecutionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiTaskExecutions.create(buildTaskExecutionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create task execution");
        await databaseService.aiOrchestrationAuditLogs.create(buildAiAuditPayload(context.organizationId, "task", "execute", `Task ${created.task_type} queued`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTaskExecutionSummary(created, maps);
    }

    async updateTaskStatus(authUserId: string, email: string, taskId: string, input: UpdateTaskStatusInput, fullName?: string | null): Promise<TaskExecutionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.aiTaskExecutions.update(taskId, buildUpdateTaskStatusPayload(input));
        if (!updated) throw new Error("Failed to update task");
        const maps = await this.getMaps(context.organizationId);
        return mapTaskExecutionSummary(updated, maps);
    }

    async getUsageRecords(authUserId: string, email: string, fullName?: string | null): Promise<UsageRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiUsageRecords.listByOrganization(context.organizationId, { orderBy: "recorded_at", orderDirection: "desc" })).map((record) => mapUsageRecordSummary(record, maps));
    }

    async getCostRecords(authUserId: string, email: string, fullName?: string | null): Promise<CostRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiCostRecords.listByOrganization(context.organizationId, { orderBy: "recorded_at", orderDirection: "desc" })).map((record) => mapCostRecordSummary(record, maps));
    }

    async getRateLimits(authUserId: string, email: string, fullName?: string | null): Promise<RateLimitSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiRateLimits.listByOrganization(context.organizationId)).map((limit) => mapRateLimitSummary(limit, maps));
    }

    async createRateLimit(authUserId: string, email: string, input: CreateRateLimitInput, fullName?: string | null): Promise<RateLimitSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiRateLimits.create(buildRateLimitPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rate limit");
        const maps = await this.getMaps(context.organizationId);
        return mapRateLimitSummary(created, maps);
    }

    async getPermissionGrants(authUserId: string, email: string, fullName?: string | null): Promise<PermissionGrantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiPermissionGrants.listByOrganization(context.organizationId)).map((grant) => mapPermissionGrantSummary(grant, maps));
    }

    async createPermissionGrant(authUserId: string, email: string, input: CreatePermissionGrantInput, fullName?: string | null): Promise<PermissionGrantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiPermissionGrants.create(buildPermissionGrantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create permission grant");
        const maps = await this.getMaps(context.organizationId);
        return mapPermissionGrantSummary(created, maps);
    }

    async getHealthChecks(authUserId: string, email: string, fullName?: string | null): Promise<HealthCheckSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiProviderHealthChecks.listByOrganization(context.organizationId, { orderBy: "last_checked_at", orderDirection: "desc" })).map((check) => mapHealthCheckSummary(check, maps));
    }

    async getRetryPolicies(authUserId: string, email: string, fullName?: string | null): Promise<RetryPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aiRetryPolicies.listByOrganization(context.organizationId)).map((policy) => mapRetryPolicySummary(policy, maps));
    }

    async createRetryPolicy(authUserId: string, email: string, input: CreateRetryPolicyInput, fullName?: string | null): Promise<RetryPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aiRetryPolicies.create(buildRetryPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retry policy");
        const maps = await this.getMaps(context.organizationId);
        return mapRetryPolicySummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AiAuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<AiAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAnalytics.listByOrganization(context.organizationId, { orderBy: "computed_at", orderDirection: "desc" })).map(mapAnalyticsSummary);
    }

    async getReport(authUserId: string, email: string, fullName?: string | null): Promise<AiOrchestrationReport> {
        const [tasks, usage, analytics] = await Promise.all([
            this.getTaskExecutions(authUserId, email, fullName),
            this.getUsageRecords(authUserId, email, fullName),
            this.getAnalytics(authUserId, email, fullName),
        ]);
        return buildAiReport({ tasks, usage, analytics });
    }

    async getCrossModuleLinks(authUserId: string, email: string, fullName?: string | null): Promise<CrossModuleLinks> {
        const sessions = await this.getSessions(authUserId, email, fullName);
        return buildCrossModuleLinks({ sessions });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AiOrchestrationDashboardStats> {
        const [providers, agents, tasks, usage, costs, healthChecks, sessions] = await Promise.all([
            this.getProviders(authUserId, email, fullName),
            this.getAgents(authUserId, email, fullName),
            this.getTaskExecutions(authUserId, email, fullName),
            this.getUsageRecords(authUserId, email, fullName),
            this.getCostRecords(authUserId, email, fullName),
            this.getHealthChecks(authUserId, email, fullName),
            this.getSessions(authUserId, email, fullName),
        ]);
        return buildAiDashboardStats({ providers, agents, tasks, usage, costs, healthChecks, sessions });
    }

    async resolveRoute(authUserId: string, email: string, strategy?: string, fullName?: string | null): Promise<AiSdkRouteResult | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const maps = await this.getMaps(context.organizationId);
        const routes = await databaseService.aiModelRoutes.listByOrganization(context.organizationId);
        const policies = await databaseService.aiRetryPolicies.listByOrganization(context.organizationId);
        const route = resolveModelRoute(routes, strategy) ?? resolveRetryFallback(policies, routes);
        if (!route) return null;
        const fallback = resolveRetryFallback(policies, routes);
        return {
            routeId: route.id,
            routeName: route.name,
            providerId: route.provider_id,
            providerName: maps.providers.get(route.provider_id)?.name ?? "Unknown",
            modelId: route.model_id,
            fallbackRouteName: fallback && fallback.id !== route.id ? fallback.name : null,
        };
    }

    async executeTask(authUserId: string, email: string, input: AiSdkExecuteInput, fullName?: string | null): Promise<AiSdkExecuteResult> {
        const route = await this.resolveRoute(authUserId, email, "priority", fullName);
        const task = await this.createTaskExecution(authUserId, email, {
            taskType: input.taskType,
            agentId: input.agentId,
            sessionId: input.sessionId,
            providerId: route?.providerId,
            inputPayload: { ...input.inputPayload, moduleSource: input.moduleSource },
        }, fullName);
        return { taskId: task.id ?? "", status: task.status, routeName: route?.routeName ?? null, providerName: route?.providerName ?? task.providerName ?? null, modelUsed: route?.modelId };
    }

    async executeTaskSystemWide(input: CreateTaskExecutionInput & { organizationId: string }): Promise<TaskExecutionSummary> {
        const created = await databaseService.aiTaskExecutions.create(buildTaskExecutionPayload(input.organizationId, input));
        if (!created) throw new Error("Failed to create task execution");
        await databaseService.aiOrchestrationAuditLogs.create(buildAiAuditPayload(input.organizationId, "task", "execute", `Task ${created.task_type} queued`, created.id));
        const maps = await this.getMaps(input.organizationId);
        return mapTaskExecutionSummary(created, maps);
    }

    async getProviderOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiProviders.listByOrganization(context.organizationId)).map((p) => ({ id: p.id, name: p.name }));
    }

    async getAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getRouteOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiModelRoutes.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.name }));
    }

    async getSessionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiSessions.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: s.session_key }));
    }

    async getWorkflowAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getEmployeeOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.employees.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}` }));
    }
}

export const aiOrchestrationService = new AiOrchestrationService();
