import type { DbDweWorkflowHub,
    DbDweWorkflowDefinition,
    DbDweWorkflowCategory,
    DbDweWorkflowTemplate,
    DbDweWorkflowVersion,
    DbDweWorkflowNode,
    DbDweWorkflowTransition,
    DbDweDecisionNode,
    DbDweReusableSubflow,
    DbDweWorkflowExecution,
    DbDweExecutionHistory,
    DbDweExecutionRetry,
    DbDweExecutionRollback,
    DbDweTimeTrigger,
    DbDweBusinessEventTrigger,
    DbDweWebhookTrigger,
    DbDweScheduledTrigger,
    DbDweManualReview,
    DbDweApprovalTask,
    DbDweEscalationRule,
    DbDweSlaTracking,
    DbDweAutomationNotification,
    DbDweAutomationApiCall,
    DbDweAutomationIntegration,
    DbDweExecutionAnalytics,
    DbDweBottleneckReport,
    DbDweSlaComplianceMetric,
    DbDweWorkflowMetric,
    DbDweWorkflowHealth,
    DbDweFailedExecution,
    DbDweWorkflowFailure,
    DbDweAuditLog } from "@/src/modules/database/types/platform";
import type { CreateWorkflowHubInput,
    WorkflowHubSummary,
    CreateWorkflowDefinitionInput,
    WorkflowDefinitionSummary,
    CreateWorkflowCategoryInput,
    WorkflowCategorySummary,
    CreateWorkflowTemplateInput,
    WorkflowTemplateSummary,
    CreateWorkflowVersionInput,
    WorkflowVersionSummary,
    CreateWorkflowNodeInput,
    WorkflowNodeSummary,
    CreateWorkflowTransitionInput,
    WorkflowTransitionSummary,
    CreateDecisionNodeInput,
    DecisionNodeSummary,
    CreateReusableSubflowInput,
    ReusableSubflowSummary,
    CreateWorkflowExecutionInput,
    WorkflowExecutionSummary,
    CreateExecutionHistoryInput,
    ExecutionHistorySummary,
    CreateExecutionRetryInput,
    ExecutionRetrySummary,
    CreateExecutionRollbackInput,
    ExecutionRollbackSummary,
    CreateTimeTriggerInput,
    TimeTriggerSummary,
    CreateBusinessEventTriggerInput,
    BusinessEventTriggerSummary,
    CreateWebhookTriggerInput,
    WebhookTriggerSummary,
    CreateScheduledTriggerInput,
    ScheduledTriggerSummary,
    CreateManualReviewInput,
    ManualReviewSummary,
    CreateApprovalTaskInput,
    ApprovalTaskSummary,
    CreateEscalationRuleInput,
    EscalationRuleSummary,
    CreateSlaTrackingInput,
    SlaTrackingSummary,
    CreateAutomationNotificationInput,
    AutomationNotificationSummary,
    CreateAutomationApiCallInput,
    AutomationApiCallSummary,
    CreateAutomationIntegrationInput,
    AutomationIntegrationSummary,
    CreateExecutionAnalyticsInput,
    ExecutionAnalyticsSummary,
    CreateBottleneckReportInput,
    BottleneckReportSummary,
    CreateSlaComplianceMetricInput,
    SlaComplianceMetricSummary,
    CreateWorkflowMetricInput,
    WorkflowMetricSummary,
    CreateWorkflowHealthInput,
    WorkflowHealthSummary,
    CreateFailedExecutionInput,
    FailedExecutionSummary,
    CreateWorkflowFailureInput,
    WorkflowFailureSummary,
    DweDashboardStats,
    DwePipelineInfo,
    AuditEntry } from "@/src/modules/workflow-engine/types";

export function buildWorkflowHubLookupMaps(hubs: DbDweWorkflowHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildDwePipelineInfo(): DwePipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "design", label: "Design" },
        { key: "trigger", label: "Trigger" },
        { key: "execute", label: "Execute" },
        { key: "automate", label: "Automate" },
    ];
    return { stages, currentStage: "execute", nextStage: "automate", previousStage: "trigger" };
}

export function buildDweAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbDweAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapWorkflowHubSummary(record: DbDweWorkflowHub): WorkflowHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildWorkflowHubPayload(organizationId: string, input: CreateWorkflowHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapWorkflowDefinitionSummary(record: DbDweWorkflowDefinition, maps?: { hubNameById: Map<string, string> }): WorkflowDefinitionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        workflowKey: record.workflow_key as string,
        workflowName: record.workflow_name as string,
        workflowType: record.workflow_type as string,
        status: record.status,
    };
}

export function buildWorkflowDefinitionPayload(organizationId: string, input: CreateWorkflowDefinitionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        workflow_key: input.workflowKey ?? '',
        workflow_name: input.workflowName ?? '',
        workflow_type: input.workflowType ?? '',
        status: "active",
    };
}

export function mapWorkflowCategorySummary(record: DbDweWorkflowCategory, maps?: { hubNameById: Map<string, string> }): WorkflowCategorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        categoryKey: record.category_key as string,
        categoryName: record.category_name as string,
        categoryType: record.category_type as string,
        status: record.status,
    };
}

export function buildWorkflowCategoryPayload(organizationId: string, input: CreateWorkflowCategoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        category_key: input.categoryKey ?? '',
        category_name: input.categoryName ?? '',
        category_type: input.categoryType ?? '',
        status: "active",
    };
}

export function mapWorkflowTemplateSummary(record: DbDweWorkflowTemplate, maps?: { hubNameById: Map<string, string> }): WorkflowTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateType: record.template_type as string,
        status: record.status,
    };
}

export function buildWorkflowTemplatePayload(organizationId: string, input: CreateWorkflowTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_type: input.templateType ?? '',
        status: "active",
    };
}

export function mapWorkflowVersionSummary(record: DbDweWorkflowVersion, maps?: { hubNameById: Map<string, string> }): WorkflowVersionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionNumber: record.version_number as string,
        releaseChannel: record.release_channel as string,
        status: record.status,
    };
}

export function buildWorkflowVersionPayload(organizationId: string, input: CreateWorkflowVersionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        version_key: input.versionKey ?? '',
        version_number: input.versionNumber ?? '',
        release_channel: input.releaseChannel ?? '',
        status: "active",
    };
}

export function mapWorkflowNodeSummary(record: DbDweWorkflowNode, maps?: { hubNameById: Map<string, string> }): WorkflowNodeSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        nodeKey: record.node_key as string,
        nodeName: record.node_name as string,
        nodeType: record.node_type as string,
        status: record.status,
    };
}

export function buildWorkflowNodePayload(organizationId: string, input: CreateWorkflowNodeInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        node_key: input.nodeKey ?? '',
        node_name: input.nodeName ?? '',
        node_type: input.nodeType ?? '',
        status: "active",
    };
}

export function mapWorkflowTransitionSummary(record: DbDweWorkflowTransition, maps?: { hubNameById: Map<string, string> }): WorkflowTransitionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        transitionKey: record.transition_key as string,
        transitionName: record.transition_name as string,
        sourceNodeRef: record.source_node_ref as string,
        status: record.status,
    };
}

export function buildWorkflowTransitionPayload(organizationId: string, input: CreateWorkflowTransitionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        transition_key: input.transitionKey ?? '',
        transition_name: input.transitionName ?? '',
        source_node_ref: input.sourceNodeRef ?? '',
        status: "active",
    };
}

export function mapDecisionNodeSummary(record: DbDweDecisionNode, maps?: { hubNameById: Map<string, string> }): DecisionNodeSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        decisionKey: record.decision_key as string,
        decisionName: record.decision_name as string,
        decisionExpression: record.decision_expression as string,
        status: record.status,
    };
}

export function buildDecisionNodePayload(organizationId: string, input: CreateDecisionNodeInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        decision_key: input.decisionKey ?? '',
        decision_name: input.decisionName ?? '',
        decision_expression: input.decisionExpression ?? '',
        status: "active",
    };
}

export function mapReusableSubflowSummary(record: DbDweReusableSubflow, maps?: { hubNameById: Map<string, string> }): ReusableSubflowSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        subflowKey: record.subflow_key as string,
        subflowName: record.subflow_name as string,
        subflowType: record.subflow_type as string,
        status: record.status,
    };
}

export function buildReusableSubflowPayload(organizationId: string, input: CreateReusableSubflowInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        subflow_key: input.subflowKey ?? '',
        subflow_name: input.subflowName ?? '',
        subflow_type: input.subflowType ?? '',
        status: "active",
    };
}

export function mapWorkflowExecutionSummary(record: DbDweWorkflowExecution, maps?: { hubNameById: Map<string, string> }): WorkflowExecutionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        executionKey: record.execution_key as string,
        executionName: record.execution_name as string,
        executionStatus: record.execution_status as string,
        status: record.status,
    };
}

export function buildWorkflowExecutionPayload(organizationId: string, input: CreateWorkflowExecutionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        execution_key: input.executionKey ?? '',
        execution_name: input.executionName ?? '',
        execution_status: input.executionStatus ?? '',
        status: "active",
    };
}

export function mapExecutionHistorySummary(record: DbDweExecutionHistory, maps?: { hubNameById: Map<string, string> }): ExecutionHistorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        historyKey: record.history_key as string,
        historyType: record.history_type as string,
        historySummary: record.history_summary as string,
        status: record.status,
    };
}

export function buildExecutionHistoryPayload(organizationId: string, input: CreateExecutionHistoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        history_key: input.historyKey ?? '',
        history_type: input.historyType ?? '',
        history_summary: input.historySummary ?? '',
        status: "active",
    };
}

export function mapExecutionRetrySummary(record: DbDweExecutionRetry, maps?: { hubNameById: Map<string, string> }): ExecutionRetrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        retryKey: record.retry_key as string,
        retryCount: record.retry_count as number,
        retryStatus: record.retry_status as string,
        status: record.status,
    };
}

export function buildExecutionRetryPayload(organizationId: string, input: CreateExecutionRetryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        retry_key: input.retryKey ?? '',
        retry_count: input.retryCount ?? 0,
        retry_status: input.retryStatus ?? '',
        status: "active",
    };
}

export function mapExecutionRollbackSummary(record: DbDweExecutionRollback, maps?: { hubNameById: Map<string, string> }): ExecutionRollbackSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        rollbackKey: record.rollback_key as string,
        rollbackReason: record.rollback_reason as string,
        rollbackStatus: record.rollback_status as string,
        status: record.status,
    };
}

export function buildExecutionRollbackPayload(organizationId: string, input: CreateExecutionRollbackInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        rollback_key: input.rollbackKey ?? '',
        rollback_reason: input.rollbackReason ?? '',
        rollback_status: input.rollbackStatus ?? '',
        status: "active",
    };
}

export function mapTimeTriggerSummary(record: DbDweTimeTrigger, maps?: { hubNameById: Map<string, string> }): TimeTriggerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        triggerKey: record.trigger_key as string,
        triggerName: record.trigger_name as string,
        cronExpression: record.cron_expression as string,
        status: record.status,
    };
}

export function buildTimeTriggerPayload(organizationId: string, input: CreateTimeTriggerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        trigger_key: input.triggerKey ?? '',
        trigger_name: input.triggerName ?? '',
        cron_expression: input.cronExpression ?? '',
        status: "active",
    };
}

export function mapBusinessEventTriggerSummary(record: DbDweBusinessEventTrigger, maps?: { hubNameById: Map<string, string> }): BusinessEventTriggerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        triggerKey: record.trigger_key as string,
        triggerName: record.trigger_name as string,
        eventType: record.event_type as string,
        status: record.status,
    };
}

export function buildBusinessEventTriggerPayload(organizationId: string, input: CreateBusinessEventTriggerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        trigger_key: input.triggerKey ?? '',
        trigger_name: input.triggerName ?? '',
        event_type: input.eventType ?? '',
        status: "active",
    };
}

export function mapWebhookTriggerSummary(record: DbDweWebhookTrigger, maps?: { hubNameById: Map<string, string> }): WebhookTriggerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        triggerKey: record.trigger_key as string,
        triggerName: record.trigger_name as string,
        webhookUrl: record.webhook_url as string,
        status: record.status,
    };
}

export function buildWebhookTriggerPayload(organizationId: string, input: CreateWebhookTriggerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        trigger_key: input.triggerKey ?? '',
        trigger_name: input.triggerName ?? '',
        webhook_url: input.webhookUrl ?? '',
        status: "active",
    };
}

export function mapScheduledTriggerSummary(record: DbDweScheduledTrigger, maps?: { hubNameById: Map<string, string> }): ScheduledTriggerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        triggerKey: record.trigger_key as string,
        triggerName: record.trigger_name as string,
        scheduleType: record.schedule_type as string,
        status: record.status,
    };
}

export function buildScheduledTriggerPayload(organizationId: string, input: CreateScheduledTriggerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        trigger_key: input.triggerKey ?? '',
        trigger_name: input.triggerName ?? '',
        schedule_type: input.scheduleType ?? '',
        status: "active",
    };
}

export function mapManualReviewSummary(record: DbDweManualReview, maps?: { hubNameById: Map<string, string> }): ManualReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        reviewName: record.review_name as string,
        reviewStatus: record.review_status as string,
        status: record.status,
    };
}

export function buildManualReviewPayload(organizationId: string, input: CreateManualReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        review_key: input.reviewKey ?? '',
        review_name: input.reviewName ?? '',
        review_status: input.reviewStatus ?? '',
        status: "active",
    };
}

export function mapApprovalTaskSummary(record: DbDweApprovalTask, maps?: { hubNameById: Map<string, string> }): ApprovalTaskSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        taskKey: record.task_key as string,
        taskName: record.task_name as string,
        taskStatus: record.task_status as string,
        status: record.status,
    };
}

export function buildApprovalTaskPayload(organizationId: string, input: CreateApprovalTaskInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        task_key: input.taskKey ?? '',
        task_name: input.taskName ?? '',
        task_status: input.taskStatus ?? '',
        status: "active",
    };
}

export function mapEscalationRuleSummary(record: DbDweEscalationRule, maps?: { hubNameById: Map<string, string> }): EscalationRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        escalationLevel: record.escalation_level as number,
        status: record.status,
    };
}

export function buildEscalationRulePayload(organizationId: string, input: CreateEscalationRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        escalation_level: input.escalationLevel ?? 0,
        status: "active",
    };
}

export function mapSlaTrackingSummary(record: DbDweSlaTracking, maps?: { hubNameById: Map<string, string> }): SlaTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        slaKey: record.sla_key as string,
        slaName: record.sla_name as string,
        targetMinutes: record.target_minutes as number,
        status: record.status,
    };
}

export function buildSlaTrackingPayload(organizationId: string, input: CreateSlaTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        sla_key: input.slaKey ?? '',
        sla_name: input.slaName ?? '',
        target_minutes: input.targetMinutes ?? 0,
        status: "active",
    };
}

export function mapAutomationNotificationSummary(record: DbDweAutomationNotification, maps?: { hubNameById: Map<string, string> }): AutomationNotificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        notificationKey: record.notification_key as string,
        notificationName: record.notification_name as string,
        channel: record.channel as string,
        status: record.status,
    };
}

export function buildAutomationNotificationPayload(organizationId: string, input: CreateAutomationNotificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        notification_key: input.notificationKey ?? '',
        notification_name: input.notificationName ?? '',
        channel: input.channel ?? '',
        status: "active",
    };
}

export function mapAutomationApiCallSummary(record: DbDweAutomationApiCall, maps?: { hubNameById: Map<string, string> }): AutomationApiCallSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        apiKey: record.api_key as string,
        apiName: record.api_name as string,
        endpointUrl: record.endpoint_url as string,
        status: record.status,
    };
}

export function buildAutomationApiCallPayload(organizationId: string, input: CreateAutomationApiCallInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        api_key: input.apiKey ?? '',
        api_name: input.apiName ?? '',
        endpoint_url: input.endpointUrl ?? '',
        status: "active",
    };
}

export function mapAutomationIntegrationSummary(record: DbDweAutomationIntegration, maps?: { hubNameById: Map<string, string> }): AutomationIntegrationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        integrationKey: record.integration_key as string,
        integrationName: record.integration_name as string,
        integrationType: record.integration_type as string,
        status: record.status,
    };
}

export function buildAutomationIntegrationPayload(organizationId: string, input: CreateAutomationIntegrationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        integration_key: input.integrationKey ?? '',
        integration_name: input.integrationName ?? '',
        integration_type: input.integrationType ?? '',
        status: "active",
    };
}

export function mapExecutionAnalyticsSummary(record: DbDweExecutionAnalytics, maps?: { hubNameById: Map<string, string> }): ExecutionAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildExecutionAnalyticsPayload(organizationId: string, input: CreateExecutionAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapBottleneckReportSummary(record: DbDweBottleneckReport, maps?: { hubNameById: Map<string, string> }): BottleneckReportSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reportKey: record.report_key as string,
        reportName: record.report_name as string,
        bottleneckScore: record.bottleneck_score as number,
        status: record.status,
    };
}

export function buildBottleneckReportPayload(organizationId: string, input: CreateBottleneckReportInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        report_key: input.reportKey ?? '',
        report_name: input.reportName ?? '',
        bottleneck_score: input.bottleneckScore ?? 0,
        status: "active",
    };
}

export function mapSlaComplianceMetricSummary(record: DbDweSlaComplianceMetric, maps?: { hubNameById: Map<string, string> }): SlaComplianceMetricSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        metricKey: record.metric_key as string,
        metricName: record.metric_name as string,
        complianceRate: record.compliance_rate as number,
        status: record.status,
    };
}

export function buildSlaComplianceMetricPayload(organizationId: string, input: CreateSlaComplianceMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        metric_key: input.metricKey ?? '',
        metric_name: input.metricName ?? '',
        compliance_rate: input.complianceRate ?? 0,
        status: "active",
    };
}

export function mapWorkflowMetricSummary(record: DbDweWorkflowMetric): WorkflowMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        executionCount: record.execution_count as number,
        overallWorkflowScore: record.overall_workflow_score as number,
        status: record.status,
    };
}

export function buildWorkflowMetricPayload(organizationId: string, input: CreateWorkflowMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        execution_count: input.executionCount ?? 0,
        overall_workflow_score: input.overallWorkflowScore ?? 0,
        status: "active",
    };
}

export function mapWorkflowHealthSummary(record: DbDweWorkflowHealth): WorkflowHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildWorkflowHealthPayload(organizationId: string, input: CreateWorkflowHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapFailedExecutionSummary(record: DbDweFailedExecution, maps?: { hubNameById: Map<string, string> }): FailedExecutionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        executionRef: record.execution_ref as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildFailedExecutionPayload(organizationId: string, input: CreateFailedExecutionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        failure_key: input.failureKey ?? '',
        execution_ref: input.executionRef ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapWorkflowFailureSummary(record: DbDweWorkflowFailure, maps?: { hubNameById: Map<string, string> }): WorkflowFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildWorkflowFailurePayload(organizationId: string, input: CreateWorkflowFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.workflowHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapWorkflowNodeForStats(r: DbDweWorkflowNode) { return { status: r.status }; }
export function mapEscalationRuleForStats(r: DbDweEscalationRule) { return { status: r.status }; }
export function mapWorkflowMetricForStats(r: DbDweWorkflowMetric) {
    return {
        execution_count: r.execution_count,
        average_duration_ms: r.average_duration_ms,
        failure_rate: r.failure_rate,
        success_rate: r.success_rate,
        bottleneck_score: r.bottleneck_score,
        sla_compliance_score: r.sla_compliance_score,
        overall_workflow_score: r.overall_workflow_score,
        status: r.status,
    };
}
export function mapWorkflowExecutionForStats(r: DbDweWorkflowExecution) { return { execution_status: r.execution_status, status: r.status }; }
export function mapFailedExecutionForStats(r: DbDweFailedExecution) { return { status: r.status }; }
export function mapApprovalTaskForStats(r: DbDweApprovalTask) { return { status: r.status }; }
export function mapWorkflowHealthForStats(r: DbDweWorkflowHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapWorkflowFailureForStats(r: DbDweWorkflowFailure) { return { status: r.status }; }

export function buildDweDashboardStats(input: {
    workflowHubs: WorkflowHubSummary[];
    workflowNodes: ReturnType<typeof mapWorkflowNodeForStats>[];
    escalationRules: ReturnType<typeof mapEscalationRuleForStats>[];
    workflowMetrics: ReturnType<typeof mapWorkflowMetricForStats>[];
    workflowExecutions: ReturnType<typeof mapWorkflowExecutionForStats>[];
    failedExecutions: ReturnType<typeof mapFailedExecutionForStats>[];
    approvalTasks: ReturnType<typeof mapApprovalTaskForStats>[];
    workflowHealth: ReturnType<typeof mapWorkflowHealthForStats>[];
    workflowFailures: WorkflowFailureSummary[];
    auditLogs: AuditEntry[];
}): DweDashboardStats {
    const activeHubs = input.workflowHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.workflowMetrics[0];
    const latestHealth = input.workflowHealth[0];
    return {
        totalWorkflowHubs: input.workflowHubs.length,
        activeWorkflowHubs: activeHubs,
        workflowNodeCount: input.workflowNodes.length,
        escalationRuleCount: input.escalationRules.length,
        workflowExecutionCount: input.workflowExecutions.length,
        openFailedExecutionCount: input.failedExecutions.filter((r) => r.status === "open").length,
        openFailureCount: input.workflowFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallWorkflowScore: latestMetrics?.overall_workflow_score ?? latestHealth?.overall_score ?? 0,
        executionCountScore: latestMetrics?.execution_count ?? 0,
        successRateScore: latestMetrics?.success_rate ?? 0,
        failureRateScore: latestMetrics?.failure_rate ?? 0,
        bottleneckScoreMetric: latestMetrics?.bottleneck_score ?? 0,
        averageDurationScore: latestMetrics?.average_duration_ms ?? 0,
        auditCount: input.auditLogs.length,
    };
}
