"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";
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

export function useAiOrchestration() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AiOrchestrationDashboardStats | null>(null);
    const [providers, setProviders] = useState<ProviderSummary[]>([]);
    const [modelRoutes, setModelRoutes] = useState<ModelRouteSummary[]>([]);
    const [agents, setAgents] = useState<AgentSummary[]>([]);
    const [promptTemplates, setPromptTemplates] = useState<PromptTemplateSummary[]>([]);
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [taskExecutions, setTaskExecutions] = useState<TaskExecutionSummary[]>([]);
    const [usageRecords, setUsageRecords] = useState<UsageRecordSummary[]>([]);
    const [costRecords, setCostRecords] = useState<CostRecordSummary[]>([]);
    const [rateLimits, setRateLimits] = useState<RateLimitSummary[]>([]);
    const [permissionGrants, setPermissionGrants] = useState<PermissionGrantSummary[]>([]);
    const [healthChecks, setHealthChecks] = useState<HealthCheckSummary[]>([]);
    const [retryPolicies, setRetryPolicies] = useState<RetryPolicySummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AiAuditEntry[]>([]);
    const [analytics, setAnalytics] = useState<AiAnalyticsSummary[]>([]);
    const [report, setReport] = useState<AiOrchestrationReport | null>(null);
    const [crossModuleLinks, setCrossModuleLinks] = useState<CrossModuleLinks | null>(null);
    const [providerOptions, setProviderOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [routeOptions, setRouteOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [workflowAgentOptions, setWorkflowAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [employeeOptions, setEmployeeOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [dashboardStats, providerList, routeList, agentList, templateList, sessionList, taskList, usageList, costList, limitList, grantList, healthList, retryList, auditList, analyticsList, aiReport, crossLinks, providers, agents, routes, sessions, workflowAgents, employees] = await Promise.all([
            aiOrchestrationService.getDashboardStats(user.id, user.email, user.fullName),
            aiOrchestrationService.getProviders(user.id, user.email, user.fullName),
            aiOrchestrationService.getModelRoutes(user.id, user.email, user.fullName),
            aiOrchestrationService.getAgents(user.id, user.email, user.fullName),
            aiOrchestrationService.getPromptTemplates(user.id, user.email, user.fullName),
            aiOrchestrationService.getSessions(user.id, user.email, user.fullName),
            aiOrchestrationService.getTaskExecutions(user.id, user.email, user.fullName),
            aiOrchestrationService.getUsageRecords(user.id, user.email, user.fullName),
            aiOrchestrationService.getCostRecords(user.id, user.email, user.fullName),
            aiOrchestrationService.getRateLimits(user.id, user.email, user.fullName),
            aiOrchestrationService.getPermissionGrants(user.id, user.email, user.fullName),
            aiOrchestrationService.getHealthChecks(user.id, user.email, user.fullName),
            aiOrchestrationService.getRetryPolicies(user.id, user.email, user.fullName),
            aiOrchestrationService.getAuditLogs(user.id, user.email, user.fullName),
            aiOrchestrationService.getAnalytics(user.id, user.email, user.fullName),
            aiOrchestrationService.getReport(user.id, user.email, user.fullName),
            aiOrchestrationService.getCrossModuleLinks(user.id, user.email, user.fullName),
            aiOrchestrationService.getProviderOptions(user.id, user.email, user.fullName),
            aiOrchestrationService.getAgentOptions(user.id, user.email, user.fullName),
            aiOrchestrationService.getRouteOptions(user.id, user.email, user.fullName),
            aiOrchestrationService.getSessionOptions(user.id, user.email, user.fullName),
            aiOrchestrationService.getWorkflowAgentOptions(user.id, user.email, user.fullName),
            aiOrchestrationService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);
        return { empty: false as const, dashboardStats, providerList, routeList, agentList, templateList, sessionList, taskList, usageList, costList, limitList, grantList, healthList, retryList, auditList, analyticsList, aiReport, crossLinks, providers, agents, routes, sessions, workflowAgents, employees };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setStats(data.dashboardStats);
        setProviders(data.providerList);
        setModelRoutes(data.routeList);
        setAgents(data.agentList);
        setPromptTemplates(data.templateList);
        setSessions(data.sessionList);
        setTaskExecutions(data.taskList);
        setUsageRecords(data.usageList);
        setCostRecords(data.costList);
        setRateLimits(data.limitList);
        setPermissionGrants(data.grantList);
        setHealthChecks(data.healthList);
        setRetryPolicies(data.retryList);
        setAuditLogs(data.auditList);
        setAnalytics(data.analyticsList);
        setReport(data.aiReport);
        setCrossModuleLinks(data.crossLinks);
        setProviderOptions(data.providers);
        setAgentOptions(data.agents);
        setRouteOptions(data.routes);
        setSessionOptions(data.sessions);
        setWorkflowAgentOptions(data.workflowAgents);
        setEmployeeOptions(data.employees);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createProvider = useCallback(async (input: CreateProviderInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createProvider(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModelRoute = useCallback(async (input: CreateModelRouteInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createModelRoute(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAgent = useCallback(async (input: CreateAgentInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createAgent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPromptTemplate = useCallback(async (input: CreatePromptTemplateInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createPromptTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSession = useCallback(async (input: CreateSessionInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createSession(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTaskExecution = useCallback(async (input: CreateTaskExecutionInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createTaskExecution(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const updateTaskStatus = useCallback(async (taskId: string, input: UpdateTaskStatusInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.updateTaskStatus(user.id, user.email, taskId, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRateLimit = useCallback(async (input: CreateRateLimitInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createRateLimit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPermissionGrant = useCallback(async (input: CreatePermissionGrantInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createPermissionGrant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetryPolicy = useCallback(async (input: CreateRetryPolicyInput) => { if (!user) throw new Error("Authentication required"); await aiOrchestrationService.createRetryPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading, stats, providers, modelRoutes, agents, promptTemplates, sessions, taskExecutions, usageRecords, costRecords, rateLimits, permissionGrants, healthChecks, retryPolicies, auditLogs, analytics, report, crossModuleLinks, providerOptions, agentOptions, routeOptions, sessionOptions, workflowAgentOptions, employeeOptions,
        createProvider, createModelRoute, createAgent, createPromptTemplate, createSession, createTaskExecution, updateTaskStatus, createRateLimit, createPermissionGrant, createRetryPolicy, refresh,
    };
}
