import type { DbBpfProcessHub,
    DbBpfBusinessProcess,
    DbBpfProcessCategory,
    DbBpfProcessVersion,
    DbBpfProcessDependency,
    DbBpfProcessModel,
    DbBpfProcessStep,
    DbBpfDecisionPoint,
    DbBpfReusableBlock,
    DbBpfApprovalRule,
    DbBpfSequentialApproval,
    DbBpfParallelApproval,
    DbBpfEscalationRule,
    DbBpfTaskAssignment,
    DbBpfTaskTemplate,
    DbBpfRecurringTask,
    DbBpfTaskSlaPolicy,
    DbBpfRuleCondition,
    DbBpfRuleValidation,
    DbBpfRuleCalculation,
    DbBpfReusableRule,
    DbBpfProcessExecution,
    DbBpfExecutionHistory,
    DbBpfExecutionRetry,
    DbBpfExecutionAnalytics,
    DbBpfBottleneckReport,
    DbBpfSlaPerformanceMetric,
    DbBpfProcessMetric,
    DbBpfProcessHealth,
    DbBpfFailedProcessRecord,
    DbBpfProcessFailure,
    DbBpfAuditLog } from "@/src/modules/database/types/platform";
import type { CreateProcessHubInput,
    ProcessHubSummary,
    CreateBusinessProcessInput,
    BusinessProcessSummary,
    CreateProcessCategoryInput,
    ProcessCategorySummary,
    CreateProcessVersionInput,
    ProcessVersionSummary,
    CreateProcessDependencyInput,
    ProcessDependencySummary,
    CreateProcessModelInput,
    ProcessModelSummary,
    CreateProcessStepInput,
    ProcessStepSummary,
    CreateDecisionPointInput,
    DecisionPointSummary,
    CreateReusableBlockInput,
    ReusableBlockSummary,
    CreateApprovalRuleInput,
    ApprovalRuleSummary,
    CreateSequentialApprovalInput,
    SequentialApprovalSummary,
    CreateParallelApprovalInput,
    ParallelApprovalSummary,
    CreateEscalationRuleInput,
    EscalationRuleSummary,
    CreateTaskAssignmentInput,
    TaskAssignmentSummary,
    CreateTaskTemplateInput,
    TaskTemplateSummary,
    CreateRecurringTaskInput,
    RecurringTaskSummary,
    CreateTaskSlaPolicyInput,
    TaskSlaPolicySummary,
    CreateRuleConditionInput,
    RuleConditionSummary,
    CreateRuleValidationInput,
    RuleValidationSummary,
    CreateRuleCalculationInput,
    RuleCalculationSummary,
    CreateReusableRuleInput,
    ReusableRuleSummary,
    CreateProcessExecutionInput,
    ProcessExecutionSummary,
    CreateExecutionHistoryInput,
    ExecutionHistorySummary,
    CreateExecutionRetryInput,
    ExecutionRetrySummary,
    CreateExecutionAnalyticsInput,
    ExecutionAnalyticsSummary,
    CreateBottleneckReportInput,
    BottleneckReportSummary,
    CreateSlaPerformanceMetricInput,
    SlaPerformanceMetricSummary,
    CreateProcessMetricInput,
    ProcessMetricSummary,
    CreateProcessHealthInput,
    ProcessHealthSummary,
    CreateFailedProcessRecordInput,
    FailedProcessRecordSummary,
    CreateProcessFailureInput,
    ProcessFailureSummary,
    BpfDashboardStats,
    BpfPipelineInfo,
    AuditEntry } from "@/src/modules/business-process/types";

export function buildProcessHubLookupMaps(hubs: DbBpfProcessHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildBpfPipelineInfo(): BpfPipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "design", label: "Design" },
        { key: "approve", label: "Approve" },
        { key: "execute", label: "Execute" },
    ];
    return { stages, currentStage: "approve", nextStage: "execute", previousStage: "design" };
}

export function buildBpfAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbBpfAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapProcessHubSummary(record: DbBpfProcessHub): ProcessHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildProcessHubPayload(organizationId: string, input: CreateProcessHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapBusinessProcessSummary(record: DbBpfBusinessProcess, maps?: { hubNameById: Map<string, string> }): BusinessProcessSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        processKey: record.process_key as string,
        processName: record.process_name as string,
        processType: record.process_type as string,
        status: record.status,
    };
}

export function buildBusinessProcessPayload(organizationId: string, input: CreateBusinessProcessInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        process_key: input.processKey ?? '',
        process_name: input.processName ?? '',
        process_type: input.processType ?? '',
        status: "active",
    };
}

export function mapProcessCategorySummary(record: DbBpfProcessCategory, maps?: { hubNameById: Map<string, string> }): ProcessCategorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        categoryKey: record.category_key as string,
        categoryName: record.category_name as string,
        categoryType: record.category_type as string,
        status: record.status,
    };
}

export function buildProcessCategoryPayload(organizationId: string, input: CreateProcessCategoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        category_key: input.categoryKey ?? '',
        category_name: input.categoryName ?? '',
        category_type: input.categoryType ?? '',
        status: "active",
    };
}

export function mapProcessVersionSummary(record: DbBpfProcessVersion, maps?: { hubNameById: Map<string, string> }): ProcessVersionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionNumber: record.version_number as string,
        releaseChannel: record.release_channel as string,
        status: record.status,
    };
}

export function buildProcessVersionPayload(organizationId: string, input: CreateProcessVersionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        version_key: input.versionKey ?? '',
        version_number: input.versionNumber ?? '',
        release_channel: input.releaseChannel ?? '',
        status: "active",
    };
}

export function mapProcessDependencySummary(record: DbBpfProcessDependency, maps?: { hubNameById: Map<string, string> }): ProcessDependencySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dependencyKey: record.dependency_key as string,
        dependencyType: record.dependency_type as string,
        dependencyRef: record.dependency_ref as string,
        status: record.status,
    };
}

export function buildProcessDependencyPayload(organizationId: string, input: CreateProcessDependencyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        dependency_key: input.dependencyKey ?? '',
        dependency_type: input.dependencyType ?? '',
        dependency_ref: input.dependencyRef ?? '',
        status: "active",
    };
}

export function mapProcessModelSummary(record: DbBpfProcessModel, maps?: { hubNameById: Map<string, string> }): ProcessModelSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        modelKey: record.model_key as string,
        modelName: record.model_name as string,
        modelType: record.model_type as string,
        status: record.status,
    };
}

export function buildProcessModelPayload(organizationId: string, input: CreateProcessModelInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        model_key: input.modelKey ?? '',
        model_name: input.modelName ?? '',
        model_type: input.modelType ?? '',
        status: "active",
    };
}

export function mapProcessStepSummary(record: DbBpfProcessStep, maps?: { hubNameById: Map<string, string> }): ProcessStepSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        stepKey: record.step_key as string,
        stepName: record.step_name as string,
        stepOrder: record.step_order as number,
        status: record.status,
    };
}

export function buildProcessStepPayload(organizationId: string, input: CreateProcessStepInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        step_key: input.stepKey ?? '',
        step_name: input.stepName ?? '',
        step_order: input.stepOrder ?? 0,
        status: "active",
    };
}

export function mapDecisionPointSummary(record: DbBpfDecisionPoint, maps?: { hubNameById: Map<string, string> }): DecisionPointSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        decisionKey: record.decision_key as string,
        decisionName: record.decision_name as string,
        decisionType: record.decision_type as string,
        status: record.status,
    };
}

export function buildDecisionPointPayload(organizationId: string, input: CreateDecisionPointInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        decision_key: input.decisionKey ?? '',
        decision_name: input.decisionName ?? '',
        decision_type: input.decisionType ?? '',
        status: "active",
    };
}

export function mapReusableBlockSummary(record: DbBpfReusableBlock, maps?: { hubNameById: Map<string, string> }): ReusableBlockSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        blockKey: record.block_key as string,
        blockName: record.block_name as string,
        blockType: record.block_type as string,
        status: record.status,
    };
}

export function buildReusableBlockPayload(organizationId: string, input: CreateReusableBlockInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        block_key: input.blockKey ?? '',
        block_name: input.blockName ?? '',
        block_type: input.blockType ?? '',
        status: "active",
    };
}

export function mapApprovalRuleSummary(record: DbBpfApprovalRule, maps?: { hubNameById: Map<string, string> }): ApprovalRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        ruleType: record.rule_type as string,
        status: record.status,
    };
}

export function buildApprovalRulePayload(organizationId: string, input: CreateApprovalRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        rule_type: input.ruleType ?? '',
        status: "active",
    };
}

export function mapSequentialApprovalSummary(record: DbBpfSequentialApproval, maps?: { hubNameById: Map<string, string> }): SequentialApprovalSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        approvalKey: record.approval_key as string,
        approvalName: record.approval_name as string,
        approvalOrder: record.approval_order as number,
        status: record.status,
    };
}

export function buildSequentialApprovalPayload(organizationId: string, input: CreateSequentialApprovalInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        approval_key: input.approvalKey ?? '',
        approval_name: input.approvalName ?? '',
        approval_order: input.approvalOrder ?? 0,
        status: "active",
    };
}

export function mapParallelApprovalSummary(record: DbBpfParallelApproval, maps?: { hubNameById: Map<string, string> }): ParallelApprovalSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        approvalKey: record.approval_key as string,
        approvalName: record.approval_name as string,
        approverCount: record.approver_count as number,
        status: record.status,
    };
}

export function buildParallelApprovalPayload(organizationId: string, input: CreateParallelApprovalInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        approval_key: input.approvalKey ?? '',
        approval_name: input.approvalName ?? '',
        approver_count: input.approverCount ?? 0,
        status: "active",
    };
}

export function mapEscalationRuleSummary(record: DbBpfEscalationRule, maps?: { hubNameById: Map<string, string> }): EscalationRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        escalationKey: record.escalation_key as string,
        escalationName: record.escalation_name as string,
        escalationLevel: record.escalation_level as number,
        status: record.status,
    };
}

export function buildEscalationRulePayload(organizationId: string, input: CreateEscalationRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        escalation_key: input.escalationKey ?? '',
        escalation_name: input.escalationName ?? '',
        escalation_level: input.escalationLevel ?? 0,
        status: "active",
    };
}

export function mapTaskAssignmentSummary(record: DbBpfTaskAssignment, maps?: { hubNameById: Map<string, string> }): TaskAssignmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assignmentKey: record.assignment_key as string,
        assignmentName: record.assignment_name as string,
        assigneeRef: record.assignee_ref as string,
        status: record.status,
    };
}

export function buildTaskAssignmentPayload(organizationId: string, input: CreateTaskAssignmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        assignment_key: input.assignmentKey ?? '',
        assignment_name: input.assignmentName ?? '',
        assignee_ref: input.assigneeRef ?? '',
        status: "active",
    };
}

export function mapTaskTemplateSummary(record: DbBpfTaskTemplate, maps?: { hubNameById: Map<string, string> }): TaskTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateType: record.template_type as string,
        status: record.status,
    };
}

export function buildTaskTemplatePayload(organizationId: string, input: CreateTaskTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_type: input.templateType ?? '',
        status: "active",
    };
}

export function mapRecurringTaskSummary(record: DbBpfRecurringTask, maps?: { hubNameById: Map<string, string> }): RecurringTaskSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        taskKey: record.task_key as string,
        taskName: record.task_name as string,
        recurrencePattern: record.recurrence_pattern as string,
        status: record.status,
    };
}

export function buildRecurringTaskPayload(organizationId: string, input: CreateRecurringTaskInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        task_key: input.taskKey ?? '',
        task_name: input.taskName ?? '',
        recurrence_pattern: input.recurrencePattern ?? '',
        status: "active",
    };
}

export function mapTaskSlaPolicySummary(record: DbBpfTaskSlaPolicy, maps?: { hubNameById: Map<string, string> }): TaskSlaPolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        slaHours: record.sla_hours as number,
        status: record.status,
    };
}

export function buildTaskSlaPolicyPayload(organizationId: string, input: CreateTaskSlaPolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        sla_hours: input.slaHours ?? 0,
        status: "active",
    };
}

export function mapRuleConditionSummary(record: DbBpfRuleCondition, maps?: { hubNameById: Map<string, string> }): RuleConditionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        conditionKey: record.condition_key as string,
        conditionName: record.condition_name as string,
        conditionType: record.condition_type as string,
        status: record.status,
    };
}

export function buildRuleConditionPayload(organizationId: string, input: CreateRuleConditionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        condition_key: input.conditionKey ?? '',
        condition_name: input.conditionName ?? '',
        condition_type: input.conditionType ?? '',
        status: "active",
    };
}

export function mapRuleValidationSummary(record: DbBpfRuleValidation, maps?: { hubNameById: Map<string, string> }): RuleValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        validationName: record.validation_name as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildRuleValidationPayload(organizationId: string, input: CreateRuleValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        validation_key: input.validationKey ?? '',
        validation_name: input.validationName ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapRuleCalculationSummary(record: DbBpfRuleCalculation, maps?: { hubNameById: Map<string, string> }): RuleCalculationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        calculationKey: record.calculation_key as string,
        calculationName: record.calculation_name as string,
        calculationType: record.calculation_type as string,
        status: record.status,
    };
}

export function buildRuleCalculationPayload(organizationId: string, input: CreateRuleCalculationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        calculation_key: input.calculationKey ?? '',
        calculation_name: input.calculationName ?? '',
        calculation_type: input.calculationType ?? '',
        status: "active",
    };
}

export function mapReusableRuleSummary(record: DbBpfReusableRule, maps?: { hubNameById: Map<string, string> }): ReusableRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        ruleType: record.rule_type as string,
        status: record.status,
    };
}

export function buildReusableRulePayload(organizationId: string, input: CreateReusableRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        rule_type: input.ruleType ?? '',
        status: "active",
    };
}

export function mapProcessExecutionSummary(record: DbBpfProcessExecution, maps?: { hubNameById: Map<string, string> }): ProcessExecutionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        executionKey: record.execution_key as string,
        executionName: record.execution_name as string,
        executionStatus: record.execution_status as string,
        status: record.status,
    };
}

export function buildProcessExecutionPayload(organizationId: string, input: CreateProcessExecutionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        execution_key: input.executionKey ?? '',
        execution_name: input.executionName ?? '',
        execution_status: input.executionStatus ?? '',
        status: "active",
    };
}

export function mapExecutionHistorySummary(record: DbBpfExecutionHistory, maps?: { hubNameById: Map<string, string> }): ExecutionHistorySummary {
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
        hub_id: input.processHubId,
        history_key: input.historyKey ?? '',
        history_type: input.historyType ?? '',
        history_summary: input.historySummary ?? '',
        status: "active",
    };
}

export function mapExecutionRetrySummary(record: DbBpfExecutionRetry, maps?: { hubNameById: Map<string, string> }): ExecutionRetrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        retryKey: record.retry_key as string,
        retryCount: record.retry_count as number,
        retryReason: record.retry_reason as string,
        status: record.status,
    };
}

export function buildExecutionRetryPayload(organizationId: string, input: CreateExecutionRetryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        retry_key: input.retryKey ?? '',
        retry_count: input.retryCount ?? 0,
        retry_reason: input.retryReason ?? '',
        status: "active",
    };
}

export function mapExecutionAnalyticsSummary(record: DbBpfExecutionAnalytics, maps?: { hubNameById: Map<string, string> }): ExecutionAnalyticsSummary {
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
        hub_id: input.processHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapBottleneckReportSummary(record: DbBpfBottleneckReport, maps?: { hubNameById: Map<string, string> }): BottleneckReportSummary {
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
        hub_id: input.processHubId,
        report_key: input.reportKey ?? '',
        report_name: input.reportName ?? '',
        bottleneck_score: input.bottleneckScore ?? 0,
        status: "active",
    };
}

export function mapSlaPerformanceMetricSummary(record: DbBpfSlaPerformanceMetric, maps?: { hubNameById: Map<string, string> }): SlaPerformanceMetricSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        metricKey: record.metric_key as string,
        metricName: record.metric_name as string,
        slaScore: record.sla_score as number,
        status: record.status,
    };
}

export function buildSlaPerformanceMetricPayload(organizationId: string, input: CreateSlaPerformanceMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        metric_key: input.metricKey ?? '',
        metric_name: input.metricName ?? '',
        sla_score: input.slaScore ?? 0,
        status: "active",
    };
}

export function mapProcessMetricSummary(record: DbBpfProcessMetric): ProcessMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        executionCount: record.execution_count as number,
        overallProcessScore: record.overall_process_score as number,
        status: record.status,
    };
}

export function buildProcessMetricPayload(organizationId: string, input: CreateProcessMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        execution_count: input.executionCount ?? 0,
        overall_process_score: input.overallProcessScore ?? 0,
        status: "active",
    };
}

export function mapProcessHealthSummary(record: DbBpfProcessHealth): ProcessHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildProcessHealthPayload(organizationId: string, input: CreateProcessHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapFailedProcessRecordSummary(record: DbBpfFailedProcessRecord, maps?: { hubNameById: Map<string, string> }): FailedProcessRecordSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        recordKey: record.record_key as string,
        recordName: record.record_name as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildFailedProcessRecordPayload(organizationId: string, input: CreateFailedProcessRecordInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        record_key: input.recordKey ?? '',
        record_name: input.recordName ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapProcessFailureSummary(record: DbBpfProcessFailure, maps?: { hubNameById: Map<string, string> }): ProcessFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildProcessFailurePayload(organizationId: string, input: CreateProcessFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.processHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapTaskTemplateForStats(r: DbBpfTaskTemplate) { return { status: r.status }; }
export function mapApprovalRuleForStats(r: DbBpfApprovalRule) { return { status: r.status }; }
export function mapProcessMetricForStats(r: DbBpfProcessMetric) {
    return {
        execution_count: r.execution_count,
        average_duration_ms: r.average_duration_ms,
        success_rate: r.success_rate,
        failure_count: r.failure_count,
        bottleneck_score: r.bottleneck_score,
        sla_performance_score: r.sla_performance_score,
        overall_process_score: r.overall_process_score,
        status: r.status,
    };
}
export function mapProcessExecutionForStats(r: DbBpfProcessExecution) { return { execution_status: r.execution_status, status: r.status }; }
export function mapFailedProcessRecordForStats(r: DbBpfFailedProcessRecord) { return { status: r.status }; }
export function mapRuleValidationForStats(r: DbBpfRuleValidation) { return { validation_score: r.validation_score, status: r.status }; }
export function mapProcessHealthForStats(r: DbBpfProcessHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapProcessFailureForStats(r: DbBpfProcessFailure) { return { status: r.status }; }

export function buildBpfDashboardStats(input: {
    processHubs: ProcessHubSummary[];
    taskTemplates: ReturnType<typeof mapTaskTemplateForStats>[];
    approvalRules: ReturnType<typeof mapApprovalRuleForStats>[];
    processMetrics: ReturnType<typeof mapProcessMetricForStats>[];
    processExecutions: ReturnType<typeof mapProcessExecutionForStats>[];
    failedProcessRecords: ReturnType<typeof mapFailedProcessRecordForStats>[];
    ruleValidations: ReturnType<typeof mapRuleValidationForStats>[];
    processHealth: ReturnType<typeof mapProcessHealthForStats>[];
    processFailures: ProcessFailureSummary[];
    auditLogs: AuditEntry[];
}): BpfDashboardStats {
    const activeHubs = input.processHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.processMetrics[0];
    const latestHealth = input.processHealth[0];
    return {
        totalProcessHubs: input.processHubs.length,
        activeProcessHubs: activeHubs,
        taskTemplateCount: input.taskTemplates.length,
        approvalRuleCount: input.approvalRules.length,
        processExecutionCount: input.processExecutions.length,
        openFailedRecordCount: input.failedProcessRecords.filter((r) => r.status === "open").length,
        openFailureCount: input.processFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallProcessScore: latestMetrics?.overall_process_score ?? latestHealth?.overall_score ?? 0,
        executionCountScore: latestMetrics?.execution_count ?? 0,
        successRateScore: latestMetrics?.success_rate ?? 0,
        slaPerformanceScore: latestMetrics?.sla_performance_score ?? 0,
        bottleneckScoreMetric: latestMetrics?.bottleneck_score ?? 0,
        averageDurationScore: latestMetrics?.average_duration_ms ?? 0,
        auditCount: input.auditLogs.length,
    };
}
