import {
    buildWorkflowHubLookupMaps,
    buildDweAuditPayload,
    buildDweDashboardStats,
    buildDwePipelineInfo,
    mapAuditEntry,
    buildWorkflowHubPayload,
    mapWorkflowHubSummary,
    buildWorkflowDefinitionPayload,
    mapWorkflowDefinitionSummary,
    buildWorkflowCategoryPayload,
    mapWorkflowCategorySummary,
    buildWorkflowTemplatePayload,
    mapWorkflowTemplateSummary,
    buildWorkflowVersionPayload,
    mapWorkflowVersionSummary,
    buildWorkflowNodePayload,
    mapWorkflowNodeSummary,
    buildWorkflowTransitionPayload,
    mapWorkflowTransitionSummary,
    buildDecisionNodePayload,
    mapDecisionNodeSummary,
    buildReusableSubflowPayload,
    mapReusableSubflowSummary,
    buildWorkflowExecutionPayload,
    mapWorkflowExecutionSummary,
    buildExecutionHistoryPayload,
    mapExecutionHistorySummary,
    buildExecutionRetryPayload,
    mapExecutionRetrySummary,
    buildExecutionRollbackPayload,
    mapExecutionRollbackSummary,
    buildTimeTriggerPayload,
    mapTimeTriggerSummary,
    buildBusinessEventTriggerPayload,
    mapBusinessEventTriggerSummary,
    buildWebhookTriggerPayload,
    mapWebhookTriggerSummary,
    buildScheduledTriggerPayload,
    mapScheduledTriggerSummary,
    buildManualReviewPayload,
    mapManualReviewSummary,
    buildApprovalTaskPayload,
    mapApprovalTaskSummary,
    buildEscalationRulePayload,
    mapEscalationRuleSummary,
    buildSlaTrackingPayload,
    mapSlaTrackingSummary,
    buildAutomationNotificationPayload,
    mapAutomationNotificationSummary,
    buildAutomationApiCallPayload,
    mapAutomationApiCallSummary,
    buildAutomationIntegrationPayload,
    mapAutomationIntegrationSummary,
    buildExecutionAnalyticsPayload,
    mapExecutionAnalyticsSummary,
    buildBottleneckReportPayload,
    mapBottleneckReportSummary,
    buildSlaComplianceMetricPayload,
    mapSlaComplianceMetricSummary,
    buildWorkflowMetricPayload,
    mapWorkflowMetricSummary,
    buildWorkflowHealthPayload,
    mapWorkflowHealthSummary,
    buildFailedExecutionPayload,
    mapFailedExecutionSummary,
    buildWorkflowFailurePayload,
    mapWorkflowFailureSummary,
    mapWorkflowNodeForStats,
    mapEscalationRuleForStats,
    mapWorkflowMetricForStats,
    mapWorkflowExecutionForStats,
    mapFailedExecutionForStats,
    mapApprovalTaskForStats,
    mapWorkflowHealthForStats,
    mapWorkflowFailureForStats,
} from "@/src/modules/database/lib/workflow-engine-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
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
    DweSdkRegisterWorkflowInput,
    DweSdkRegisterWorkflowResult,
    DweSdkConfigureAutomationInput,
    DweSdkConfigureAutomationResult,
    DweSdkRunWorkflowExecutionInput,
    DweSdkRunWorkflowExecutionResult,
} from "@/src/modules/workflow-engine/types";

export class WorkflowEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const workflowHubs = await databaseService.dweWorkflowHubs.listByOrganization(organizationId);
        return buildWorkflowHubLookupMaps(workflowHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DweDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildDweDashboardStats({ workflowHubs: [], workflowNodes: [], escalationRules: [], workflowMetrics: [], workflowExecutions: [], failedExecutions: [], approvalTasks: [], workflowHealth: [], workflowFailures: [], auditLogs: [] });
        const [workflowHubs, workflowNodesRaw, escalationRulesRaw, workflowMetricsRaw, workflowExecutionsRaw, failedExecutionsRaw, approvalTasksRaw, workflowHealthRaw, workflowFailures, auditLogs] = await Promise.all([
            this.getWorkflowHubs(authUserId, email, fullName),
            databaseService.dweWorkflowNodes.listByOrganization(context.organizationId),
            databaseService.dweEscalationRules.listByOrganization(context.organizationId),
            databaseService.dweWorkflowMetrics.listByOrganization(context.organizationId),
            databaseService.dweWorkflowExecutions.listByOrganization(context.organizationId),
            databaseService.dweFailedExecutions.listByOrganization(context.organizationId),
            databaseService.dweApprovalTasks.listByOrganization(context.organizationId),
            databaseService.dweWorkflowHealth.listByOrganization(context.organizationId),
            this.getWorkflowFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildDweDashboardStats({
            workflowHubs,
            workflowNodes: workflowNodesRaw.map(mapWorkflowNodeForStats),
            escalationRules: escalationRulesRaw.map(mapEscalationRuleForStats),
            workflowMetrics: workflowMetricsRaw.map(mapWorkflowMetricForStats),
            workflowExecutions: workflowExecutionsRaw.map(mapWorkflowExecutionForStats),
            failedExecutions: failedExecutionsRaw.map(mapFailedExecutionForStats),
            approvalTasks: approvalTasksRaw.map(mapApprovalTaskForStats),
            workflowHealth: workflowHealthRaw.map(mapWorkflowHealthForStats),
            workflowFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): DwePipelineInfo {
        return buildDwePipelineInfo();
    }

    async getWorkflowHubs(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dweWorkflowHubs.listByOrganization(context.organizationId)).map((r) => mapWorkflowHubSummary(r));
    }

    async createWorkflowHub(authUserId: string, email: string, input: CreateWorkflowHubInput, fullName?: string | null): Promise<WorkflowHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowHubs.create(buildWorkflowHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowHubs");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_hubs", "create", `WorkflowHub created`, created.id));
        return mapWorkflowHubSummary(created);
    }

    async getWorkflowDefinitions(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowDefinitionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowDefinitions.listByOrganization(context.organizationId)).map((r) => mapWorkflowDefinitionSummary(r, maps));
    }

    async createWorkflowDefinition(authUserId: string, email: string, input: CreateWorkflowDefinitionInput, fullName?: string | null): Promise<WorkflowDefinitionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowDefinitions.create(buildWorkflowDefinitionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowDefinitions");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_definitions", "create", `WorkflowDefinition created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowDefinitionSummary(created, maps);
    }

    async getWorkflowCategorys(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowCategories.listByOrganization(context.organizationId)).map((r) => mapWorkflowCategorySummary(r, maps));
    }

    async createWorkflowCategory(authUserId: string, email: string, input: CreateWorkflowCategoryInput, fullName?: string | null): Promise<WorkflowCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowCategories.create(buildWorkflowCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowCategories");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_categories", "create", `WorkflowCategory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowCategorySummary(created, maps);
    }

    async getWorkflowTemplates(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowTemplates.listByOrganization(context.organizationId)).map((r) => mapWorkflowTemplateSummary(r, maps));
    }

    async createWorkflowTemplate(authUserId: string, email: string, input: CreateWorkflowTemplateInput, fullName?: string | null): Promise<WorkflowTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowTemplates.create(buildWorkflowTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowTemplates");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_templates", "create", `WorkflowTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowTemplateSummary(created, maps);
    }

    async getWorkflowVersions(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowVersions.listByOrganization(context.organizationId)).map((r) => mapWorkflowVersionSummary(r, maps));
    }

    async createWorkflowVersion(authUserId: string, email: string, input: CreateWorkflowVersionInput, fullName?: string | null): Promise<WorkflowVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowVersions.create(buildWorkflowVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowVersions");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_versions", "create", `WorkflowVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowVersionSummary(created, maps);
    }

    async getWorkflowNodes(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowNodeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowNodes.listByOrganization(context.organizationId)).map((r) => mapWorkflowNodeSummary(r, maps));
    }

    async createWorkflowNode(authUserId: string, email: string, input: CreateWorkflowNodeInput, fullName?: string | null): Promise<WorkflowNodeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowNodes.create(buildWorkflowNodePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowNodes");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_nodes", "create", `WorkflowNode created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowNodeSummary(created, maps);
    }

    async getWorkflowTransitions(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowTransitionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowTransitions.listByOrganization(context.organizationId)).map((r) => mapWorkflowTransitionSummary(r, maps));
    }

    async createWorkflowTransition(authUserId: string, email: string, input: CreateWorkflowTransitionInput, fullName?: string | null): Promise<WorkflowTransitionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowTransitions.create(buildWorkflowTransitionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowTransitions");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_transitions", "create", `WorkflowTransition created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowTransitionSummary(created, maps);
    }

    async getDecisionNodes(authUserId: string, email: string, fullName?: string | null): Promise<DecisionNodeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweDecisionNodes.listByOrganization(context.organizationId)).map((r) => mapDecisionNodeSummary(r, maps));
    }

    async createDecisionNode(authUserId: string, email: string, input: CreateDecisionNodeInput, fullName?: string | null): Promise<DecisionNodeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweDecisionNodes.create(buildDecisionNodePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create decisionNodes");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "decision_nodes", "create", `DecisionNode created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDecisionNodeSummary(created, maps);
    }

    async getReusableSubflows(authUserId: string, email: string, fullName?: string | null): Promise<ReusableSubflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweReusableSubflows.listByOrganization(context.organizationId)).map((r) => mapReusableSubflowSummary(r, maps));
    }

    async createReusableSubflow(authUserId: string, email: string, input: CreateReusableSubflowInput, fullName?: string | null): Promise<ReusableSubflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweReusableSubflows.create(buildReusableSubflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reusableSubflows");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "reusable_subflows", "create", `ReusableSubflow created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReusableSubflowSummary(created, maps);
    }

    async getWorkflowExecutions(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowExecutionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowExecutions.listByOrganization(context.organizationId)).map((r) => mapWorkflowExecutionSummary(r, maps));
    }

    async createWorkflowExecution(authUserId: string, email: string, input: CreateWorkflowExecutionInput, fullName?: string | null): Promise<WorkflowExecutionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowExecutions.create(buildWorkflowExecutionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowExecutions");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_executions", "create", `WorkflowExecution created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowExecutionSummary(created, maps);
    }

    async getExecutionHistorys(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweExecutionHistory.listByOrganization(context.organizationId)).map((r) => mapExecutionHistorySummary(r, maps));
    }

    async createExecutionHistory(authUserId: string, email: string, input: CreateExecutionHistoryInput, fullName?: string | null): Promise<ExecutionHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweExecutionHistory.create(buildExecutionHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionHistory");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "execution_history", "create", `ExecutionHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionHistorySummary(created, maps);
    }

    async getExecutionRetrys(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionRetrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweExecutionRetries.listByOrganization(context.organizationId)).map((r) => mapExecutionRetrySummary(r, maps));
    }

    async createExecutionRetry(authUserId: string, email: string, input: CreateExecutionRetryInput, fullName?: string | null): Promise<ExecutionRetrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweExecutionRetries.create(buildExecutionRetryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionRetries");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "execution_retries", "create", `ExecutionRetry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionRetrySummary(created, maps);
    }

    async getExecutionRollbacks(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionRollbackSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweExecutionRollbacks.listByOrganization(context.organizationId)).map((r) => mapExecutionRollbackSummary(r, maps));
    }

    async createExecutionRollback(authUserId: string, email: string, input: CreateExecutionRollbackInput, fullName?: string | null): Promise<ExecutionRollbackSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweExecutionRollbacks.create(buildExecutionRollbackPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionRollbacks");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "execution_rollbacks", "create", `ExecutionRollback created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionRollbackSummary(created, maps);
    }

    async getTimeTriggers(authUserId: string, email: string, fullName?: string | null): Promise<TimeTriggerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweTimeTriggers.listByOrganization(context.organizationId)).map((r) => mapTimeTriggerSummary(r, maps));
    }

    async createTimeTrigger(authUserId: string, email: string, input: CreateTimeTriggerInput, fullName?: string | null): Promise<TimeTriggerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweTimeTriggers.create(buildTimeTriggerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create timeTriggers");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "time_triggers", "create", `TimeTrigger created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTimeTriggerSummary(created, maps);
    }

    async getBusinessEventTriggers(authUserId: string, email: string, fullName?: string | null): Promise<BusinessEventTriggerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweBusinessEventTriggers.listByOrganization(context.organizationId)).map((r) => mapBusinessEventTriggerSummary(r, maps));
    }

    async createBusinessEventTrigger(authUserId: string, email: string, input: CreateBusinessEventTriggerInput, fullName?: string | null): Promise<BusinessEventTriggerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweBusinessEventTriggers.create(buildBusinessEventTriggerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessEventTriggers");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "business_event_triggers", "create", `BusinessEventTrigger created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessEventTriggerSummary(created, maps);
    }

    async getWebhookTriggers(authUserId: string, email: string, fullName?: string | null): Promise<WebhookTriggerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWebhookTriggers.listByOrganization(context.organizationId)).map((r) => mapWebhookTriggerSummary(r, maps));
    }

    async createWebhookTrigger(authUserId: string, email: string, input: CreateWebhookTriggerInput, fullName?: string | null): Promise<WebhookTriggerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWebhookTriggers.create(buildWebhookTriggerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create webhookTriggers");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "webhook_triggers", "create", `WebhookTrigger created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebhookTriggerSummary(created, maps);
    }

    async getScheduledTriggers(authUserId: string, email: string, fullName?: string | null): Promise<ScheduledTriggerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweScheduledTriggers.listByOrganization(context.organizationId)).map((r) => mapScheduledTriggerSummary(r, maps));
    }

    async createScheduledTrigger(authUserId: string, email: string, input: CreateScheduledTriggerInput, fullName?: string | null): Promise<ScheduledTriggerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweScheduledTriggers.create(buildScheduledTriggerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create scheduledTriggers");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "scheduled_triggers", "create", `ScheduledTrigger created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapScheduledTriggerSummary(created, maps);
    }

    async getManualReviews(authUserId: string, email: string, fullName?: string | null): Promise<ManualReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweManualReviews.listByOrganization(context.organizationId)).map((r) => mapManualReviewSummary(r, maps));
    }

    async createManualReview(authUserId: string, email: string, input: CreateManualReviewInput, fullName?: string | null): Promise<ManualReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweManualReviews.create(buildManualReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create manualReviews");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "manual_reviews", "create", `ManualReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapManualReviewSummary(created, maps);
    }

    async getApprovalTasks(authUserId: string, email: string, fullName?: string | null): Promise<ApprovalTaskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweApprovalTasks.listByOrganization(context.organizationId)).map((r) => mapApprovalTaskSummary(r, maps));
    }

    async createApprovalTask(authUserId: string, email: string, input: CreateApprovalTaskInput, fullName?: string | null): Promise<ApprovalTaskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweApprovalTasks.create(buildApprovalTaskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create approvalTasks");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "approval_tasks", "create", `ApprovalTask created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalTaskSummary(created, maps);
    }

    async getEscalationRules(authUserId: string, email: string, fullName?: string | null): Promise<EscalationRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweEscalationRules.listByOrganization(context.organizationId)).map((r) => mapEscalationRuleSummary(r, maps));
    }

    async createEscalationRule(authUserId: string, email: string, input: CreateEscalationRuleInput, fullName?: string | null): Promise<EscalationRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweEscalationRules.create(buildEscalationRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create escalationRules");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "escalation_rules", "create", `EscalationRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEscalationRuleSummary(created, maps);
    }

    async getSlaTrackings(authUserId: string, email: string, fullName?: string | null): Promise<SlaTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweSlaTrackings.listByOrganization(context.organizationId)).map((r) => mapSlaTrackingSummary(r, maps));
    }

    async createSlaTracking(authUserId: string, email: string, input: CreateSlaTrackingInput, fullName?: string | null): Promise<SlaTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweSlaTrackings.create(buildSlaTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create slaTrackings");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "sla_trackings", "create", `SlaTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSlaTrackingSummary(created, maps);
    }

    async getAutomationNotifications(authUserId: string, email: string, fullName?: string | null): Promise<AutomationNotificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweAutomationNotifications.listByOrganization(context.organizationId)).map((r) => mapAutomationNotificationSummary(r, maps));
    }

    async createAutomationNotification(authUserId: string, email: string, input: CreateAutomationNotificationInput, fullName?: string | null): Promise<AutomationNotificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweAutomationNotifications.create(buildAutomationNotificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automationNotifications");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "automation_notifications", "create", `AutomationNotification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationNotificationSummary(created, maps);
    }

    async getAutomationApiCalls(authUserId: string, email: string, fullName?: string | null): Promise<AutomationApiCallSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweAutomationApiCalls.listByOrganization(context.organizationId)).map((r) => mapAutomationApiCallSummary(r, maps));
    }

    async createAutomationApiCall(authUserId: string, email: string, input: CreateAutomationApiCallInput, fullName?: string | null): Promise<AutomationApiCallSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweAutomationApiCalls.create(buildAutomationApiCallPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automationApiCalls");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "automation_api_calls", "create", `AutomationApiCall created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationApiCallSummary(created, maps);
    }

    async getAutomationIntegrations(authUserId: string, email: string, fullName?: string | null): Promise<AutomationIntegrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweAutomationIntegrations.listByOrganization(context.organizationId)).map((r) => mapAutomationIntegrationSummary(r, maps));
    }

    async createAutomationIntegration(authUserId: string, email: string, input: CreateAutomationIntegrationInput, fullName?: string | null): Promise<AutomationIntegrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweAutomationIntegrations.create(buildAutomationIntegrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automationIntegrations");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "automation_integrations", "create", `AutomationIntegration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationIntegrationSummary(created, maps);
    }

    async getExecutionAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweExecutionAnalytics.listByOrganization(context.organizationId)).map((r) => mapExecutionAnalyticsSummary(r, maps));
    }

    async createExecutionAnalytics(authUserId: string, email: string, input: CreateExecutionAnalyticsInput, fullName?: string | null): Promise<ExecutionAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweExecutionAnalytics.create(buildExecutionAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionAnalytics");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "execution_analytics", "create", `ExecutionAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionAnalyticsSummary(created, maps);
    }

    async getBottleneckReports(authUserId: string, email: string, fullName?: string | null): Promise<BottleneckReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweBottleneckReports.listByOrganization(context.organizationId)).map((r) => mapBottleneckReportSummary(r, maps));
    }

    async createBottleneckReport(authUserId: string, email: string, input: CreateBottleneckReportInput, fullName?: string | null): Promise<BottleneckReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweBottleneckReports.create(buildBottleneckReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create bottleneckReports");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "bottleneck_reports", "create", `BottleneckReport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBottleneckReportSummary(created, maps);
    }

    async getSlaComplianceMetrics(authUserId: string, email: string, fullName?: string | null): Promise<SlaComplianceMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweSlaComplianceMetrics.listByOrganization(context.organizationId)).map((r) => mapSlaComplianceMetricSummary(r, maps));
    }

    async createSlaComplianceMetric(authUserId: string, email: string, input: CreateSlaComplianceMetricInput, fullName?: string | null): Promise<SlaComplianceMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweSlaComplianceMetrics.create(buildSlaComplianceMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create slaComplianceMetrics");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "sla_compliance_metrics", "create", `SlaComplianceMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSlaComplianceMetricSummary(created, maps);
    }

    async getWorkflowMetrics(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dweWorkflowMetrics.listByOrganization(context.organizationId)).map(mapWorkflowMetricSummary);
    }

    async createWorkflowMetric(authUserId: string, email: string, input: CreateWorkflowMetricInput, fullName?: string | null): Promise<WorkflowMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowMetrics.create(buildWorkflowMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowMetrics");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_metrics", "create", `WorkflowMetric created`, created.id));
        return mapWorkflowMetricSummary(created);
    }

    async getWorkflowHealths(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dweWorkflowHealth.listByOrganization(context.organizationId)).map(mapWorkflowHealthSummary);
    }

    async createWorkflowHealth(authUserId: string, email: string, input: CreateWorkflowHealthInput, fullName?: string | null): Promise<WorkflowHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowHealth.create(buildWorkflowHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowHealth");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_health", "create", `WorkflowHealth created`, created.id));
        return mapWorkflowHealthSummary(created);
    }

    async getFailedExecutions(authUserId: string, email: string, fullName?: string | null): Promise<FailedExecutionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweFailedExecutions.listByOrganization(context.organizationId)).map((r) => mapFailedExecutionSummary(r, maps));
    }

    async createFailedExecution(authUserId: string, email: string, input: CreateFailedExecutionInput, fullName?: string | null): Promise<FailedExecutionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweFailedExecutions.create(buildFailedExecutionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create failedExecutions");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "failed_executions", "create", `FailedExecution created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFailedExecutionSummary(created, maps);
    }

    async getWorkflowFailures(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dweWorkflowFailures.listByOrganization(context.organizationId)).map((r) => mapWorkflowFailureSummary(r, maps));
    }

    async createWorkflowFailure(authUserId: string, email: string, input: CreateWorkflowFailureInput, fullName?: string | null): Promise<WorkflowFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dweWorkflowFailures.create(buildWorkflowFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowFailures");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "workflow_failures", "create", `WorkflowFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dweAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getWorkflowHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dweWorkflowHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterWorkflow(authUserId: string, email: string, input: DweSdkRegisterWorkflowInput, fullName?: string | null): Promise<DweSdkRegisterWorkflowResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_workflow", moduleSource: "dynamic_workflow_engine", inputPayload: { ...input } });
        const created = await this.createWorkflowDefinition(authUserId, email, { workflowHubId: input.workflowHubId, workflowKey: input.workflowKey, workflowName: input.workflowName }, fullName);
        return { workflowId: created.id, workflowKey: created.workflowKey, status: created.status };
    }

    async sdkConfigureAutomation(authUserId: string, email: string, input: DweSdkConfigureAutomationInput, fullName?: string | null): Promise<DweSdkConfigureAutomationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "automation", limit: 3 });
        const created = await this.createEscalationRule(authUserId, email, { workflowHubId: input.workflowHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunWorkflowExecution(authUserId: string, email: string, input: DweSdkRunWorkflowExecutionInput, fullName?: string | null): Promise<DweSdkRunWorkflowExecutionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_workflow_execution", moduleSource: "dynamic_workflow_engine", inputPayload: { ...input } });
        const created = await this.createWorkflowExecution(authUserId, email, { workflowHubId: input.workflowHubId, executionKey: input.executionKey, executionName: input.executionName }, fullName);
        return { executionId: created.id, executionKey: created.executionKey, status: created.status };
    }
}

export const workflowEngineService = new WorkflowEngineService();
