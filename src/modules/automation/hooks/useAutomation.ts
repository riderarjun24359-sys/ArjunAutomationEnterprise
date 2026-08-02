"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { WORKFLOW_STATUS_FILTERS } from "@/src/modules/automation/constants";
import { automationService } from "@/src/modules/automation/services/automation.service";
import type {
    AiAgent,
    AutomationAnalytics,
    AutomationDashboardStats,
    AutomationLog,
    CreateAiAgentInput,
    CreateWorkflowInput,
    Workflow,
    WorkflowExecution,
    WorkflowStatusFilter,
    WorkflowTemplate,
} from "@/src/modules/automation/types";

export function useAutomation() {
    const user = useAuthStore((state) => state.user);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [agents, setAgents] = useState<AiAgent[]>([]);
    const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
    const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
    const [logs, setLogs] = useState<AutomationLog[]>([]);
    const [stats, setStats] = useState<AutomationDashboardStats | null>(null);
    const [analytics, setAnalytics] = useState<AutomationAnalytics | null>(null);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<WorkflowStatusFilter>(WORKFLOW_STATUS_FILTERS.all);

    const fetchAutomationData = useCallback(async () => {
        if (!user) {
            return {
                workflowList: [],
                agentList: [],
                templateList: [],
                executionList: [],
                logList: [],
                dashboardStats: null,
                analyticsSummary: null,
            };
        }

        const [workflowList, agentList, templateList, executionList, logList, dashboardStats, analyticsSummary] = await Promise.all([
            automationService.getWorkflows(user.id, user.email, user.fullName),
            automationService.getAgents(user.id, user.email, user.fullName),
            automationService.getTemplates(user.id, user.email, user.fullName),
            automationService.getExecutions(user.id, user.email, user.fullName),
            automationService.getLogs(user.id, user.email, user.fullName),
            automationService.getDashboardStats(user.id, user.email, user.fullName),
            automationService.getAnalytics(user.id, user.email, user.fullName),
        ]);

        return { workflowList, agentList, templateList, executionList, logList, dashboardStats, analyticsSummary };
    }, [user]);

    const loadData = useCallback(async () => {
        const data = await fetchAutomationData();
        setWorkflows(data.workflowList);
        setAgents(data.agentList);
        setTemplates(data.templateList);
        setExecutions(data.executionList);
        setLogs(data.logList);
        setStats(data.dashboardStats);
        setAnalytics(data.analyticsSummary);
        setLoading(false);
    }, [fetchAutomationData]);

    useEffect(() => {
        let cancelled = false;

        void fetchAutomationData().then((data) => {
            if (cancelled) return;
            setWorkflows(data.workflowList);
            setAgents(data.agentList);
            setTemplates(data.templateList);
            setExecutions(data.executionList);
            setLogs(data.logList);
            setStats(data.dashboardStats);
            setAnalytics(data.analyticsSummary);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [fetchAutomationData]);

    const selectWorkflow = useCallback((id: string) => {
        setSelectedWorkflowId(id);
    }, []);

    const selectedWorkflow = useMemo(() => {
        if (!selectedWorkflowId) return null;
        return workflows.find((workflow) => workflow.id === selectedWorkflowId) ?? null;
    }, [workflows, selectedWorkflowId]);

    const createAgent = useCallback(async (input: CreateAiAgentInput) => {
        if (!user) throw new Error("Authentication required");
        await automationService.createAgent(user.id, user.email, input, user.fullName);
        await loadData();
    }, [user, loadData]);

    const createWorkflow = useCallback(async (input: CreateWorkflowInput) => {
        if (!user) throw new Error("Authentication required");
        const workflow = await automationService.createWorkflow(user.id, user.email, input, user.fullName);
        await loadData();
        setSelectedWorkflowId(workflow.id);
        return workflow;
    }, [user, loadData]);

    const updateWorkflowStatus = useCallback(async (workflowId: string, status: Workflow["status"]) => {
        if (!user) throw new Error("Authentication required");
        await automationService.updateWorkflowStatus(user.id, user.email, workflowId, status, user.fullName);
        await loadData();
    }, [user, loadData]);

    const runWorkflow = useCallback(async (workflowId: string) => {
        if (!user) throw new Error("Authentication required");
        await automationService.runWorkflow(user.id, user.email, workflowId, user.fullName);
        await loadData();
    }, [user, loadData]);

    const filteredWorkflows = useMemo(() => {
        return workflows.filter((workflow) => {
            if (statusFilter !== WORKFLOW_STATUS_FILTERS.all && workflow.status !== statusFilter) return false;
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                workflow.name.toLowerCase().includes(query) ||
                workflow.description.toLowerCase().includes(query) ||
                (workflow.agentName ?? "").toLowerCase().includes(query)
            );
        });
    }, [workflows, statusFilter, searchQuery]);

    return {
        workflows: filteredWorkflows,
        allWorkflows: workflows,
        agents,
        templates,
        executions,
        logs,
        stats,
        analytics,
        selectedWorkflow,
        loading,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        selectWorkflow,
        createAgent,
        createWorkflow,
        updateWorkflowStatus,
        runWorkflow,
        refresh: loadData,
    };
}
