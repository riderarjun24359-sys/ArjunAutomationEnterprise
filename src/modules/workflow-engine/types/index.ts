export interface DweDashboardStats {
    totalWorkflowHubs: number;
    activeWorkflowHubs: number;
    workflowNodeCount: number;
    escalationRuleCount: number;
    workflowExecutionCount: number;
    openFailedExecutionCount: number;
    openFailureCount: number;
    overallWorkflowScore: number;
    executionCountScore: number;
    successRateScore: number;
    failureRateScore: number;
    bottleneckScoreMetric: number;
    averageDurationScore: number;
    auditCount: number;
}

export interface DwePipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface DweSdkRegisterWorkflowInput { workflowHubId: string; workflowKey?: string; workflowName?: string; }
export interface DweSdkRegisterWorkflowResult { workflowId: string; workflowKey: string; status: string; }
export interface DweSdkConfigureAutomationInput { workflowHubId: string; ruleKey?: string; ruleName?: string; }
export interface DweSdkConfigureAutomationResult { ruleId: string; ruleKey: string; status: string; }
export interface DweSdkRunWorkflowExecutionInput { workflowHubId: string; executionKey?: string; executionName?: string; }
export interface DweSdkRunWorkflowExecutionResult { executionId: string; executionKey: string; status: string; }

export interface WorkflowHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateWorkflowHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface WorkflowDefinitionSummary {
    id: string;
    hubName?: string;
        workflowKey: string;
    workflowName: string;
    workflowType: string;
    status: string;
}

export interface CreateWorkflowDefinitionInput {
        workflowHubId: string;
        workflowKey?: string;
    workflowName?: string;
    workflowType?: string;
}

export interface WorkflowCategorySummary {
    id: string;
    hubName?: string;
        categoryKey: string;
    categoryName: string;
    categoryType: string;
    status: string;
}

export interface CreateWorkflowCategoryInput {
        workflowHubId: string;
        categoryKey?: string;
    categoryName?: string;
    categoryType?: string;
}

export interface WorkflowTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateType: string;
    status: string;
}

export interface CreateWorkflowTemplateInput {
        workflowHubId: string;
        templateKey?: string;
    templateName?: string;
    templateType?: string;
}

export interface WorkflowVersionSummary {
    id: string;
    hubName?: string;
        versionKey: string;
    versionNumber: string;
    releaseChannel: string;
    status: string;
}

export interface CreateWorkflowVersionInput {
        workflowHubId: string;
        versionKey?: string;
    versionNumber?: string;
    releaseChannel?: string;
}

export interface WorkflowNodeSummary {
    id: string;
    hubName?: string;
        nodeKey: string;
    nodeName: string;
    nodeType: string;
    status: string;
}

export interface CreateWorkflowNodeInput {
        workflowHubId: string;
        nodeKey?: string;
    nodeName?: string;
    nodeType?: string;
}

export interface WorkflowTransitionSummary {
    id: string;
    hubName?: string;
        transitionKey: string;
    transitionName: string;
    sourceNodeRef: string;
    status: string;
}

export interface CreateWorkflowTransitionInput {
        workflowHubId: string;
        transitionKey?: string;
    transitionName?: string;
    sourceNodeRef?: string;
}

export interface DecisionNodeSummary {
    id: string;
    hubName?: string;
        decisionKey: string;
    decisionName: string;
    decisionExpression: string;
    status: string;
}

export interface CreateDecisionNodeInput {
        workflowHubId: string;
        decisionKey?: string;
    decisionName?: string;
    decisionExpression?: string;
}

export interface ReusableSubflowSummary {
    id: string;
    hubName?: string;
        subflowKey: string;
    subflowName: string;
    subflowType: string;
    status: string;
}

export interface CreateReusableSubflowInput {
        workflowHubId: string;
        subflowKey?: string;
    subflowName?: string;
    subflowType?: string;
}

export interface WorkflowExecutionSummary {
    id: string;
    hubName?: string;
        executionKey: string;
    executionName: string;
    executionStatus: string;
    status: string;
}

export interface CreateWorkflowExecutionInput {
        workflowHubId: string;
        executionKey?: string;
    executionName?: string;
    executionStatus?: string;
}

export interface ExecutionHistorySummary {
    id: string;
    hubName?: string;
        historyKey: string;
    historyType: string;
    historySummary: string;
    status: string;
}

export interface CreateExecutionHistoryInput {
        workflowHubId: string;
        historyKey?: string;
    historyType?: string;
    historySummary?: string;
}

export interface ExecutionRetrySummary {
    id: string;
    hubName?: string;
        retryKey: string;
    retryCount: number;
    retryStatus: string;
    status: string;
}

export interface CreateExecutionRetryInput {
        workflowHubId: string;
        retryKey?: string;
    retryCount?: number;
    retryStatus?: string;
}

export interface ExecutionRollbackSummary {
    id: string;
    hubName?: string;
        rollbackKey: string;
    rollbackReason: string;
    rollbackStatus: string;
    status: string;
}

export interface CreateExecutionRollbackInput {
        workflowHubId: string;
        rollbackKey?: string;
    rollbackReason?: string;
    rollbackStatus?: string;
}

export interface TimeTriggerSummary {
    id: string;
    hubName?: string;
        triggerKey: string;
    triggerName: string;
    cronExpression: string;
    status: string;
}

export interface CreateTimeTriggerInput {
        workflowHubId: string;
        triggerKey?: string;
    triggerName?: string;
    cronExpression?: string;
}

export interface BusinessEventTriggerSummary {
    id: string;
    hubName?: string;
        triggerKey: string;
    triggerName: string;
    eventType: string;
    status: string;
}

export interface CreateBusinessEventTriggerInput {
        workflowHubId: string;
        triggerKey?: string;
    triggerName?: string;
    eventType?: string;
}

export interface WebhookTriggerSummary {
    id: string;
    hubName?: string;
        triggerKey: string;
    triggerName: string;
    webhookUrl: string;
    status: string;
}

export interface CreateWebhookTriggerInput {
        workflowHubId: string;
        triggerKey?: string;
    triggerName?: string;
    webhookUrl?: string;
}

export interface ScheduledTriggerSummary {
    id: string;
    hubName?: string;
        triggerKey: string;
    triggerName: string;
    scheduleType: string;
    status: string;
}

export interface CreateScheduledTriggerInput {
        workflowHubId: string;
        triggerKey?: string;
    triggerName?: string;
    scheduleType?: string;
}

export interface ManualReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    reviewName: string;
    reviewStatus: string;
    status: string;
}

export interface CreateManualReviewInput {
        workflowHubId: string;
        reviewKey?: string;
    reviewName?: string;
    reviewStatus?: string;
}

export interface ApprovalTaskSummary {
    id: string;
    hubName?: string;
        taskKey: string;
    taskName: string;
    taskStatus: string;
    status: string;
}

export interface CreateApprovalTaskInput {
        workflowHubId: string;
        taskKey?: string;
    taskName?: string;
    taskStatus?: string;
}

export interface EscalationRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    escalationLevel: number;
    status: string;
}

export interface CreateEscalationRuleInput {
        workflowHubId: string;
        ruleKey?: string;
    ruleName?: string;
    escalationLevel?: number;
}

export interface SlaTrackingSummary {
    id: string;
    hubName?: string;
        slaKey: string;
    slaName: string;
    targetMinutes: number;
    status: string;
}

export interface CreateSlaTrackingInput {
        workflowHubId: string;
        slaKey?: string;
    slaName?: string;
    targetMinutes?: number;
}

export interface AutomationNotificationSummary {
    id: string;
    hubName?: string;
        notificationKey: string;
    notificationName: string;
    channel: string;
    status: string;
}

export interface CreateAutomationNotificationInput {
        workflowHubId: string;
        notificationKey?: string;
    notificationName?: string;
    channel?: string;
}

export interface AutomationApiCallSummary {
    id: string;
    hubName?: string;
        apiKey: string;
    apiName: string;
    endpointUrl: string;
    status: string;
}

export interface CreateAutomationApiCallInput {
        workflowHubId: string;
        apiKey?: string;
    apiName?: string;
    endpointUrl?: string;
}

export interface AutomationIntegrationSummary {
    id: string;
    hubName?: string;
        integrationKey: string;
    integrationName: string;
    integrationType: string;
    status: string;
}

export interface CreateAutomationIntegrationInput {
        workflowHubId: string;
        integrationKey?: string;
    integrationName?: string;
    integrationType?: string;
}

export interface ExecutionAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateExecutionAnalyticsInput {
        workflowHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface BottleneckReportSummary {
    id: string;
    hubName?: string;
        reportKey: string;
    reportName: string;
    bottleneckScore: number;
    status: string;
}

export interface CreateBottleneckReportInput {
        workflowHubId: string;
        reportKey?: string;
    reportName?: string;
    bottleneckScore?: number;
}

export interface SlaComplianceMetricSummary {
    id: string;
    hubName?: string;
        metricKey: string;
    metricName: string;
    complianceRate: number;
    status: string;
}

export interface CreateSlaComplianceMetricInput {
        workflowHubId: string;
        metricKey?: string;
    metricName?: string;
    complianceRate?: number;
}

export interface WorkflowMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    executionCount: number;
    overallWorkflowScore: number;
    status: string;
}

export interface CreateWorkflowMetricInput {
        metricsKey?: string;
    executionCount?: number;
    overallWorkflowScore?: number;
}

export interface WorkflowHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateWorkflowHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface FailedExecutionSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    executionRef: string;
    failureType: string;
    status: string;
}

export interface CreateFailedExecutionInput {
        workflowHubId: string;
        failureKey?: string;
    executionRef?: string;
    failureType?: string;
}

export interface WorkflowFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateWorkflowFailureInput {
        workflowHubId: string;
        failureKey?: string;
    failureType?: string;
}

