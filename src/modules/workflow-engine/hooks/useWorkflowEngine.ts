"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { workflowEngineService } from "@/src/modules/workflow-engine/services/workflow-engine.service";
import type {
    WorkflowHubSummary,
    CreateWorkflowHubInput,
    WorkflowDefinitionSummary,
    CreateWorkflowDefinitionInput,
    WorkflowCategorySummary,
    CreateWorkflowCategoryInput,
    WorkflowTemplateSummary,
    CreateWorkflowTemplateInput,
    WorkflowVersionSummary,
    CreateWorkflowVersionInput,
    WorkflowNodeSummary,
    CreateWorkflowNodeInput,
    WorkflowTransitionSummary,
    CreateWorkflowTransitionInput,
    DecisionNodeSummary,
    CreateDecisionNodeInput,
    ReusableSubflowSummary,
    CreateReusableSubflowInput,
    WorkflowExecutionSummary,
    CreateWorkflowExecutionInput,
    ExecutionHistorySummary,
    CreateExecutionHistoryInput,
    ExecutionRetrySummary,
    CreateExecutionRetryInput,
    ExecutionRollbackSummary,
    CreateExecutionRollbackInput,
    TimeTriggerSummary,
    CreateTimeTriggerInput,
    BusinessEventTriggerSummary,
    CreateBusinessEventTriggerInput,
    WebhookTriggerSummary,
    CreateWebhookTriggerInput,
    ScheduledTriggerSummary,
    CreateScheduledTriggerInput,
    ManualReviewSummary,
    CreateManualReviewInput,
    ApprovalTaskSummary,
    CreateApprovalTaskInput,
    EscalationRuleSummary,
    CreateEscalationRuleInput,
    SlaTrackingSummary,
    CreateSlaTrackingInput,
    AutomationNotificationSummary,
    CreateAutomationNotificationInput,
    AutomationApiCallSummary,
    CreateAutomationApiCallInput,
    AutomationIntegrationSummary,
    CreateAutomationIntegrationInput,
    ExecutionAnalyticsSummary,
    CreateExecutionAnalyticsInput,
    BottleneckReportSummary,
    CreateBottleneckReportInput,
    SlaComplianceMetricSummary,
    CreateSlaComplianceMetricInput,
    WorkflowMetricSummary,
    CreateWorkflowMetricInput,
    WorkflowHealthSummary,
    CreateWorkflowHealthInput,
    FailedExecutionSummary,
    CreateFailedExecutionInput,
    WorkflowFailureSummary,
    CreateWorkflowFailureInput,
    AuditEntry,
    DweDashboardStats,
    DwePipelineInfo,
} from "@/src/modules/workflow-engine/types";

export function useWorkflowEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DweDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DwePipelineInfo | null>(null);
    const [workflowHubs, setWorkflowHubs] = useState<WorkflowHubSummary[]>([]);
    const [workflowDefinitions, setWorkflowDefinitions] = useState<WorkflowDefinitionSummary[]>([]);
    const [workflowCategories, setWorkflowCategorys] = useState<WorkflowCategorySummary[]>([]);
    const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplateSummary[]>([]);
    const [workflowVersions, setWorkflowVersions] = useState<WorkflowVersionSummary[]>([]);
    const [workflowNodes, setWorkflowNodes] = useState<WorkflowNodeSummary[]>([]);
    const [workflowTransitions, setWorkflowTransitions] = useState<WorkflowTransitionSummary[]>([]);
    const [decisionNodes, setDecisionNodes] = useState<DecisionNodeSummary[]>([]);
    const [reusableSubflows, setReusableSubflows] = useState<ReusableSubflowSummary[]>([]);
    const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecutionSummary[]>([]);
    const [executionHistory, setExecutionHistorys] = useState<ExecutionHistorySummary[]>([]);
    const [executionRetries, setExecutionRetrys] = useState<ExecutionRetrySummary[]>([]);
    const [executionRollbacks, setExecutionRollbacks] = useState<ExecutionRollbackSummary[]>([]);
    const [timeTriggers, setTimeTriggers] = useState<TimeTriggerSummary[]>([]);
    const [businessEventTriggers, setBusinessEventTriggers] = useState<BusinessEventTriggerSummary[]>([]);
    const [webhookTriggers, setWebhookTriggers] = useState<WebhookTriggerSummary[]>([]);
    const [scheduledTriggers, setScheduledTriggers] = useState<ScheduledTriggerSummary[]>([]);
    const [manualReviews, setManualReviews] = useState<ManualReviewSummary[]>([]);
    const [approvalTasks, setApprovalTasks] = useState<ApprovalTaskSummary[]>([]);
    const [escalationRules, setEscalationRules] = useState<EscalationRuleSummary[]>([]);
    const [slaTrackings, setSlaTrackings] = useState<SlaTrackingSummary[]>([]);
    const [automationNotifications, setAutomationNotifications] = useState<AutomationNotificationSummary[]>([]);
    const [automationApiCalls, setAutomationApiCalls] = useState<AutomationApiCallSummary[]>([]);
    const [automationIntegrations, setAutomationIntegrations] = useState<AutomationIntegrationSummary[]>([]);
    const [executionAnalytics, setExecutionAnalyticss] = useState<ExecutionAnalyticsSummary[]>([]);
    const [bottleneckReports, setBottleneckReports] = useState<BottleneckReportSummary[]>([]);
    const [slaComplianceMetrics, setSlaComplianceMetrics] = useState<SlaComplianceMetricSummary[]>([]);
    const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetricSummary[]>([]);
    const [workflowHealth, setWorkflowHealths] = useState<WorkflowHealthSummary[]>([]);
    const [failedExecutions, setFailedExecutions] = useState<FailedExecutionSummary[]>([]);
    const [workflowFailures, setWorkflowFailures] = useState<WorkflowFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [workflowHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
workflowHubsList,
            workflowDefinitionsList,
            workflowCategoriesList,
            workflowTemplatesList,
            workflowVersionsList,
            workflowNodesList,
            workflowTransitionsList,
            decisionNodesList,
            reusableSubflowsList,
            workflowExecutionsList,
            executionHistoryList,
            executionRetriesList,
            executionRollbacksList,
            timeTriggersList,
            businessEventTriggersList,
            webhookTriggersList,
            scheduledTriggersList,
            manualReviewsList,
            approvalTasksList,
            escalationRulesList,
            slaTrackingsList,
            automationNotificationsList,
            automationApiCallsList,
            automationIntegrationsList,
            executionAnalyticsList,
            bottleneckReportsList,
            slaComplianceMetricsList,
            workflowMetricsList,
            workflowHealthList,
            failedExecutionsList,
            workflowFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            workflowEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(workflowEngineService.getPipelineInfo()),
            workflowEngineService.getWorkflowHubs(authUserId, email, fullName),
            workflowEngineService.getWorkflowDefinitions(authUserId, email, fullName),
            workflowEngineService.getWorkflowCategorys(authUserId, email, fullName),
            workflowEngineService.getWorkflowTemplates(authUserId, email, fullName),
            workflowEngineService.getWorkflowVersions(authUserId, email, fullName),
            workflowEngineService.getWorkflowNodes(authUserId, email, fullName),
            workflowEngineService.getWorkflowTransitions(authUserId, email, fullName),
            workflowEngineService.getDecisionNodes(authUserId, email, fullName),
            workflowEngineService.getReusableSubflows(authUserId, email, fullName),
            workflowEngineService.getWorkflowExecutions(authUserId, email, fullName),
            workflowEngineService.getExecutionHistorys(authUserId, email, fullName),
            workflowEngineService.getExecutionRetrys(authUserId, email, fullName),
            workflowEngineService.getExecutionRollbacks(authUserId, email, fullName),
            workflowEngineService.getTimeTriggers(authUserId, email, fullName),
            workflowEngineService.getBusinessEventTriggers(authUserId, email, fullName),
            workflowEngineService.getWebhookTriggers(authUserId, email, fullName),
            workflowEngineService.getScheduledTriggers(authUserId, email, fullName),
            workflowEngineService.getManualReviews(authUserId, email, fullName),
            workflowEngineService.getApprovalTasks(authUserId, email, fullName),
            workflowEngineService.getEscalationRules(authUserId, email, fullName),
            workflowEngineService.getSlaTrackings(authUserId, email, fullName),
            workflowEngineService.getAutomationNotifications(authUserId, email, fullName),
            workflowEngineService.getAutomationApiCalls(authUserId, email, fullName),
            workflowEngineService.getAutomationIntegrations(authUserId, email, fullName),
            workflowEngineService.getExecutionAnalyticss(authUserId, email, fullName),
            workflowEngineService.getBottleneckReports(authUserId, email, fullName),
            workflowEngineService.getSlaComplianceMetrics(authUserId, email, fullName),
            workflowEngineService.getWorkflowMetrics(authUserId, email, fullName),
            workflowEngineService.getWorkflowHealths(authUserId, email, fullName),
            workflowEngineService.getFailedExecutions(authUserId, email, fullName),
            workflowEngineService.getWorkflowFailures(authUserId, email, fullName),
            workflowEngineService.getAuditLogs(authUserId, email, fullName),
            workflowEngineService.getWorkflowHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
workflowHubsList,
            workflowDefinitionsList,
            workflowCategoriesList,
            workflowTemplatesList,
            workflowVersionsList,
            workflowNodesList,
            workflowTransitionsList,
            decisionNodesList,
            reusableSubflowsList,
            workflowExecutionsList,
            executionHistoryList,
            executionRetriesList,
            executionRollbacksList,
            timeTriggersList,
            businessEventTriggersList,
            webhookTriggersList,
            scheduledTriggersList,
            manualReviewsList,
            approvalTasksList,
            escalationRulesList,
            slaTrackingsList,
            automationNotificationsList,
            automationApiCallsList,
            automationIntegrationsList,
            executionAnalyticsList,
            bottleneckReportsList,
            slaComplianceMetricsList,
            workflowMetricsList,
            workflowHealthList,
            failedExecutionsList,
            workflowFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setWorkflowHubs(result.workflowHubsList);
        setWorkflowDefinitions(result.workflowDefinitionsList);
        setWorkflowCategorys(result.workflowCategoriesList);
        setWorkflowTemplates(result.workflowTemplatesList);
        setWorkflowVersions(result.workflowVersionsList);
        setWorkflowNodes(result.workflowNodesList);
        setWorkflowTransitions(result.workflowTransitionsList);
        setDecisionNodes(result.decisionNodesList);
        setReusableSubflows(result.reusableSubflowsList);
        setWorkflowExecutions(result.workflowExecutionsList);
        setExecutionHistorys(result.executionHistoryList);
        setExecutionRetrys(result.executionRetriesList);
        setExecutionRollbacks(result.executionRollbacksList);
        setTimeTriggers(result.timeTriggersList);
        setBusinessEventTriggers(result.businessEventTriggersList);
        setWebhookTriggers(result.webhookTriggersList);
        setScheduledTriggers(result.scheduledTriggersList);
        setManualReviews(result.manualReviewsList);
        setApprovalTasks(result.approvalTasksList);
        setEscalationRules(result.escalationRulesList);
        setSlaTrackings(result.slaTrackingsList);
        setAutomationNotifications(result.automationNotificationsList);
        setAutomationApiCalls(result.automationApiCallsList);
        setAutomationIntegrations(result.automationIntegrationsList);
        setExecutionAnalyticss(result.executionAnalyticsList);
        setBottleneckReports(result.bottleneckReportsList);
        setSlaComplianceMetrics(result.slaComplianceMetricsList);
        setWorkflowMetrics(result.workflowMetricsList);
        setWorkflowHealths(result.workflowHealthList);
        setFailedExecutions(result.failedExecutionsList);
        setWorkflowFailures(result.workflowFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createWorkflowHub = useCallback(async (input: CreateWorkflowHubInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowDefinition = useCallback(async (input: CreateWorkflowDefinitionInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowDefinition(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowCategory = useCallback(async (input: CreateWorkflowCategoryInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowCategory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowTemplate = useCallback(async (input: CreateWorkflowTemplateInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowVersion = useCallback(async (input: CreateWorkflowVersionInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowNode = useCallback(async (input: CreateWorkflowNodeInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowNode(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowTransition = useCallback(async (input: CreateWorkflowTransitionInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowTransition(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDecisionNode = useCallback(async (input: CreateDecisionNodeInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createDecisionNode(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReusableSubflow = useCallback(async (input: CreateReusableSubflowInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createReusableSubflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowExecution = useCallback(async (input: CreateWorkflowExecutionInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowExecution(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionHistory = useCallback(async (input: CreateExecutionHistoryInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createExecutionHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionRetry = useCallback(async (input: CreateExecutionRetryInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createExecutionRetry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionRollback = useCallback(async (input: CreateExecutionRollbackInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createExecutionRollback(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTimeTrigger = useCallback(async (input: CreateTimeTriggerInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createTimeTrigger(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessEventTrigger = useCallback(async (input: CreateBusinessEventTriggerInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createBusinessEventTrigger(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebhookTrigger = useCallback(async (input: CreateWebhookTriggerInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWebhookTrigger(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createScheduledTrigger = useCallback(async (input: CreateScheduledTriggerInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createScheduledTrigger(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createManualReview = useCallback(async (input: CreateManualReviewInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createManualReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApprovalTask = useCallback(async (input: CreateApprovalTaskInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createApprovalTask(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEscalationRule = useCallback(async (input: CreateEscalationRuleInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createEscalationRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSlaTracking = useCallback(async (input: CreateSlaTrackingInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createSlaTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomationNotification = useCallback(async (input: CreateAutomationNotificationInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createAutomationNotification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomationApiCall = useCallback(async (input: CreateAutomationApiCallInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createAutomationApiCall(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomationIntegration = useCallback(async (input: CreateAutomationIntegrationInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createAutomationIntegration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionAnalytics = useCallback(async (input: CreateExecutionAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createExecutionAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBottleneckReport = useCallback(async (input: CreateBottleneckReportInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createBottleneckReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSlaComplianceMetric = useCallback(async (input: CreateSlaComplianceMetricInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createSlaComplianceMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowMetric = useCallback(async (input: CreateWorkflowMetricInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowHealth = useCallback(async (input: CreateWorkflowHealthInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFailedExecution = useCallback(async (input: CreateFailedExecutionInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createFailedExecution(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowFailure = useCallback(async (input: CreateWorkflowFailureInput) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.createWorkflowFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        workflowHubs,
        createWorkflowHub,
        workflowDefinitions,
        createWorkflowDefinition,
        workflowCategories,
        createWorkflowCategory,
        workflowTemplates,
        createWorkflowTemplate,
        workflowVersions,
        createWorkflowVersion,
        workflowNodes,
        createWorkflowNode,
        workflowTransitions,
        createWorkflowTransition,
        decisionNodes,
        createDecisionNode,
        reusableSubflows,
        createReusableSubflow,
        workflowExecutions,
        createWorkflowExecution,
        executionHistory,
        createExecutionHistory,
        executionRetries,
        createExecutionRetry,
        executionRollbacks,
        createExecutionRollback,
        timeTriggers,
        createTimeTrigger,
        businessEventTriggers,
        createBusinessEventTrigger,
        webhookTriggers,
        createWebhookTrigger,
        scheduledTriggers,
        createScheduledTrigger,
        manualReviews,
        createManualReview,
        approvalTasks,
        createApprovalTask,
        escalationRules,
        createEscalationRule,
        slaTrackings,
        createSlaTracking,
        automationNotifications,
        createAutomationNotification,
        automationApiCalls,
        createAutomationApiCall,
        automationIntegrations,
        createAutomationIntegration,
        executionAnalytics,
        createExecutionAnalytics,
        bottleneckReports,
        createBottleneckReport,
        slaComplianceMetrics,
        createSlaComplianceMetric,
        workflowMetrics,
        createWorkflowMetric,
        workflowHealth,
        createWorkflowHealth,
        failedExecutions,
        createFailedExecution,
        workflowFailures,
        createWorkflowFailure,
        auditLogs,
        workflowHubOptions,
        refresh,
    };
}
