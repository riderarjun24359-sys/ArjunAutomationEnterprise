export interface BpfDashboardStats {
    totalProcessHubs: number;
    activeProcessHubs: number;
    taskTemplateCount: number;
    approvalRuleCount: number;
    processExecutionCount: number;
    openFailedRecordCount: number;
    openFailureCount: number;
    overallProcessScore: number;
    executionCountScore: number;
    successRateScore: number;
    slaPerformanceScore: number;
    bottleneckScoreMetric: number;
    averageDurationScore: number;
    auditCount: number;
}

export interface BpfPipelineInfo {
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

export interface BpfSdkRegisterProcessInput { processHubId: string; processKey?: string; processName?: string; }
export interface BpfSdkRegisterProcessResult { processId: string; processKey: string; status: string; }
export interface BpfSdkConfigureApprovalInput { processHubId: string; ruleKey?: string; ruleName?: string; }
export interface BpfSdkConfigureApprovalResult { ruleId: string; ruleKey: string; status: string; }
export interface BpfSdkRunProcessExecutionInput { processHubId: string; executionKey?: string; executionName?: string; }
export interface BpfSdkRunProcessExecutionResult { executionId: string; executionKey: string; status: string; }

export interface ProcessHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateProcessHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface BusinessProcessSummary {
    id: string;
    hubName?: string;
        processKey: string;
    processName: string;
    processType: string;
    status: string;
}

export interface CreateBusinessProcessInput {
        processHubId: string;
        processKey?: string;
    processName?: string;
    processType?: string;
}

export interface ProcessCategorySummary {
    id: string;
    hubName?: string;
        categoryKey: string;
    categoryName: string;
    categoryType: string;
    status: string;
}

export interface CreateProcessCategoryInput {
        processHubId: string;
        categoryKey?: string;
    categoryName?: string;
    categoryType?: string;
}

export interface ProcessVersionSummary {
    id: string;
    hubName?: string;
        versionKey: string;
    versionNumber: string;
    releaseChannel: string;
    status: string;
}

export interface CreateProcessVersionInput {
        processHubId: string;
        versionKey?: string;
    versionNumber?: string;
    releaseChannel?: string;
}

export interface ProcessDependencySummary {
    id: string;
    hubName?: string;
        dependencyKey: string;
    dependencyType: string;
    dependencyRef: string;
    status: string;
}

export interface CreateProcessDependencyInput {
        processHubId: string;
        dependencyKey?: string;
    dependencyType?: string;
    dependencyRef?: string;
}

export interface ProcessModelSummary {
    id: string;
    hubName?: string;
        modelKey: string;
    modelName: string;
    modelType: string;
    status: string;
}

export interface CreateProcessModelInput {
        processHubId: string;
        modelKey?: string;
    modelName?: string;
    modelType?: string;
}

export interface ProcessStepSummary {
    id: string;
    hubName?: string;
        stepKey: string;
    stepName: string;
    stepOrder: number;
    status: string;
}

export interface CreateProcessStepInput {
        processHubId: string;
        stepKey?: string;
    stepName?: string;
    stepOrder?: number;
}

export interface DecisionPointSummary {
    id: string;
    hubName?: string;
        decisionKey: string;
    decisionName: string;
    decisionType: string;
    status: string;
}

export interface CreateDecisionPointInput {
        processHubId: string;
        decisionKey?: string;
    decisionName?: string;
    decisionType?: string;
}

export interface ReusableBlockSummary {
    id: string;
    hubName?: string;
        blockKey: string;
    blockName: string;
    blockType: string;
    status: string;
}

export interface CreateReusableBlockInput {
        processHubId: string;
        blockKey?: string;
    blockName?: string;
    blockType?: string;
}

export interface ApprovalRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    ruleType: string;
    status: string;
}

export interface CreateApprovalRuleInput {
        processHubId: string;
        ruleKey?: string;
    ruleName?: string;
    ruleType?: string;
}

export interface SequentialApprovalSummary {
    id: string;
    hubName?: string;
        approvalKey: string;
    approvalName: string;
    approvalOrder: number;
    status: string;
}

export interface CreateSequentialApprovalInput {
        processHubId: string;
        approvalKey?: string;
    approvalName?: string;
    approvalOrder?: number;
}

export interface ParallelApprovalSummary {
    id: string;
    hubName?: string;
        approvalKey: string;
    approvalName: string;
    approverCount: number;
    status: string;
}

export interface CreateParallelApprovalInput {
        processHubId: string;
        approvalKey?: string;
    approvalName?: string;
    approverCount?: number;
}

export interface EscalationRuleSummary {
    id: string;
    hubName?: string;
        escalationKey: string;
    escalationName: string;
    escalationLevel: number;
    status: string;
}

export interface CreateEscalationRuleInput {
        processHubId: string;
        escalationKey?: string;
    escalationName?: string;
    escalationLevel?: number;
}

export interface TaskAssignmentSummary {
    id: string;
    hubName?: string;
        assignmentKey: string;
    assignmentName: string;
    assigneeRef: string;
    status: string;
}

export interface CreateTaskAssignmentInput {
        processHubId: string;
        assignmentKey?: string;
    assignmentName?: string;
    assigneeRef?: string;
}

export interface TaskTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateType: string;
    status: string;
}

export interface CreateTaskTemplateInput {
        processHubId: string;
        templateKey?: string;
    templateName?: string;
    templateType?: string;
}

export interface RecurringTaskSummary {
    id: string;
    hubName?: string;
        taskKey: string;
    taskName: string;
    recurrencePattern: string;
    status: string;
}

export interface CreateRecurringTaskInput {
        processHubId: string;
        taskKey?: string;
    taskName?: string;
    recurrencePattern?: string;
}

export interface TaskSlaPolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    slaHours: number;
    status: string;
}

export interface CreateTaskSlaPolicyInput {
        processHubId: string;
        policyKey?: string;
    policyName?: string;
    slaHours?: number;
}

export interface RuleConditionSummary {
    id: string;
    hubName?: string;
        conditionKey: string;
    conditionName: string;
    conditionType: string;
    status: string;
}

export interface CreateRuleConditionInput {
        processHubId: string;
        conditionKey?: string;
    conditionName?: string;
    conditionType?: string;
}

export interface RuleValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    validationName: string;
    validationScore: number;
    status: string;
}

export interface CreateRuleValidationInput {
        processHubId: string;
        validationKey?: string;
    validationName?: string;
    validationScore?: number;
}

export interface RuleCalculationSummary {
    id: string;
    hubName?: string;
        calculationKey: string;
    calculationName: string;
    calculationType: string;
    status: string;
}

export interface CreateRuleCalculationInput {
        processHubId: string;
        calculationKey?: string;
    calculationName?: string;
    calculationType?: string;
}

export interface ReusableRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    ruleType: string;
    status: string;
}

export interface CreateReusableRuleInput {
        processHubId: string;
        ruleKey?: string;
    ruleName?: string;
    ruleType?: string;
}

export interface ProcessExecutionSummary {
    id: string;
    hubName?: string;
        executionKey: string;
    executionName: string;
    executionStatus: string;
    status: string;
}

export interface CreateProcessExecutionInput {
        processHubId: string;
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
        processHubId: string;
        historyKey?: string;
    historyType?: string;
    historySummary?: string;
}

export interface ExecutionRetrySummary {
    id: string;
    hubName?: string;
        retryKey: string;
    retryCount: number;
    retryReason: string;
    status: string;
}

export interface CreateExecutionRetryInput {
        processHubId: string;
        retryKey?: string;
    retryCount?: number;
    retryReason?: string;
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
        processHubId: string;
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
        processHubId: string;
        reportKey?: string;
    reportName?: string;
    bottleneckScore?: number;
}

export interface SlaPerformanceMetricSummary {
    id: string;
    hubName?: string;
        metricKey: string;
    metricName: string;
    slaScore: number;
    status: string;
}

export interface CreateSlaPerformanceMetricInput {
        processHubId: string;
        metricKey?: string;
    metricName?: string;
    slaScore?: number;
}

export interface ProcessMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    executionCount: number;
    overallProcessScore: number;
    status: string;
}

export interface CreateProcessMetricInput {
        metricsKey?: string;
    executionCount?: number;
    overallProcessScore?: number;
}

export interface ProcessHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateProcessHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface FailedProcessRecordSummary {
    id: string;
    hubName?: string;
        recordKey: string;
    recordName: string;
    failureType: string;
    status: string;
}

export interface CreateFailedProcessRecordInput {
        processHubId: string;
        recordKey?: string;
    recordName?: string;
    failureType?: string;
}

export interface ProcessFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateProcessFailureInput {
        processHubId: string;
        failureKey?: string;
    failureType?: string;
}

