import { z } from "zod";

export const processHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type processHubsFormValues = z.infer<typeof processHubsFormSchema>;

export const businessProcessesFormSchema = z.object({
    processHubId: z.string().min(1),
    processKey: z.string().min(1).optional(),
    processName: z.string().min(1).optional(),
    processType: z.string().min(1).optional(),
});

export type businessProcessesFormValues = z.infer<typeof businessProcessesFormSchema>;

export const processCategoriesFormSchema = z.object({
    processHubId: z.string().min(1),
    categoryKey: z.string().min(1).optional(),
    categoryName: z.string().min(1).optional(),
    categoryType: z.string().min(1).optional(),
});

export type processCategoriesFormValues = z.infer<typeof processCategoriesFormSchema>;

export const processVersionsFormSchema = z.object({
    processHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
    releaseChannel: z.string().min(1).optional(),
});

export type processVersionsFormValues = z.infer<typeof processVersionsFormSchema>;

export const processDependenciesFormSchema = z.object({
    processHubId: z.string().min(1),
    dependencyKey: z.string().min(1).optional(),
    dependencyType: z.string().min(1).optional(),
    dependencyRef: z.string().min(1).optional(),
});

export type processDependenciesFormValues = z.infer<typeof processDependenciesFormSchema>;

export const processModelsFormSchema = z.object({
    processHubId: z.string().min(1),
    modelKey: z.string().min(1).optional(),
    modelName: z.string().min(1).optional(),
    modelType: z.string().min(1).optional(),
});

export type processModelsFormValues = z.infer<typeof processModelsFormSchema>;

export const processStepsFormSchema = z.object({
    processHubId: z.string().min(1),
    stepKey: z.string().min(1).optional(),
    stepName: z.string().min(1).optional(),
    stepOrder: z.number().optional(),
});

export type processStepsFormValues = z.infer<typeof processStepsFormSchema>;

export const decisionPointsFormSchema = z.object({
    processHubId: z.string().min(1),
    decisionKey: z.string().min(1).optional(),
    decisionName: z.string().min(1).optional(),
    decisionType: z.string().min(1).optional(),
});

export type decisionPointsFormValues = z.infer<typeof decisionPointsFormSchema>;

export const reusableBlocksFormSchema = z.object({
    processHubId: z.string().min(1),
    blockKey: z.string().min(1).optional(),
    blockName: z.string().min(1).optional(),
    blockType: z.string().min(1).optional(),
});

export type reusableBlocksFormValues = z.infer<typeof reusableBlocksFormSchema>;

export const approvalRulesFormSchema = z.object({
    processHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    ruleType: z.string().min(1).optional(),
});

export type approvalRulesFormValues = z.infer<typeof approvalRulesFormSchema>;

export const sequentialApprovalsFormSchema = z.object({
    processHubId: z.string().min(1),
    approvalKey: z.string().min(1).optional(),
    approvalName: z.string().min(1).optional(),
    approvalOrder: z.number().optional(),
});

export type sequentialApprovalsFormValues = z.infer<typeof sequentialApprovalsFormSchema>;

export const parallelApprovalsFormSchema = z.object({
    processHubId: z.string().min(1),
    approvalKey: z.string().min(1).optional(),
    approvalName: z.string().min(1).optional(),
    approverCount: z.number().optional(),
});

export type parallelApprovalsFormValues = z.infer<typeof parallelApprovalsFormSchema>;

export const escalationRulesFormSchema = z.object({
    processHubId: z.string().min(1),
    escalationKey: z.string().min(1).optional(),
    escalationName: z.string().min(1).optional(),
    escalationLevel: z.number().optional(),
});

export type escalationRulesFormValues = z.infer<typeof escalationRulesFormSchema>;

export const taskAssignmentsFormSchema = z.object({
    processHubId: z.string().min(1),
    assignmentKey: z.string().min(1).optional(),
    assignmentName: z.string().min(1).optional(),
    assigneeRef: z.string().min(1).optional(),
});

export type taskAssignmentsFormValues = z.infer<typeof taskAssignmentsFormSchema>;

export const taskTemplatesFormSchema = z.object({
    processHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateType: z.string().min(1).optional(),
});

export type taskTemplatesFormValues = z.infer<typeof taskTemplatesFormSchema>;

export const recurringTasksFormSchema = z.object({
    processHubId: z.string().min(1),
    taskKey: z.string().min(1).optional(),
    taskName: z.string().min(1).optional(),
    recurrencePattern: z.string().min(1).optional(),
});

export type recurringTasksFormValues = z.infer<typeof recurringTasksFormSchema>;

export const taskSlaPoliciesFormSchema = z.object({
    processHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    slaHours: z.number().optional(),
});

export type taskSlaPoliciesFormValues = z.infer<typeof taskSlaPoliciesFormSchema>;

export const ruleConditionsFormSchema = z.object({
    processHubId: z.string().min(1),
    conditionKey: z.string().min(1).optional(),
    conditionName: z.string().min(1).optional(),
    conditionType: z.string().min(1).optional(),
});

export type ruleConditionsFormValues = z.infer<typeof ruleConditionsFormSchema>;

export const ruleValidationsFormSchema = z.object({
    processHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    validationName: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type ruleValidationsFormValues = z.infer<typeof ruleValidationsFormSchema>;

export const ruleCalculationsFormSchema = z.object({
    processHubId: z.string().min(1),
    calculationKey: z.string().min(1).optional(),
    calculationName: z.string().min(1).optional(),
    calculationType: z.string().min(1).optional(),
});

export type ruleCalculationsFormValues = z.infer<typeof ruleCalculationsFormSchema>;

export const reusableRulesFormSchema = z.object({
    processHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    ruleType: z.string().min(1).optional(),
});

export type reusableRulesFormValues = z.infer<typeof reusableRulesFormSchema>;

export const processExecutionsFormSchema = z.object({
    processHubId: z.string().min(1),
    executionKey: z.string().min(1).optional(),
    executionName: z.string().min(1).optional(),
    executionStatus: z.string().min(1).optional(),
});

export type processExecutionsFormValues = z.infer<typeof processExecutionsFormSchema>;

export const executionHistoryFormSchema = z.object({
    processHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyType: z.string().min(1).optional(),
    historySummary: z.string().min(1).optional(),
});

export type executionHistoryFormValues = z.infer<typeof executionHistoryFormSchema>;

export const executionRetriesFormSchema = z.object({
    processHubId: z.string().min(1),
    retryKey: z.string().min(1).optional(),
    retryCount: z.number().optional(),
    retryReason: z.string().min(1).optional(),
});

export type executionRetriesFormValues = z.infer<typeof executionRetriesFormSchema>;

export const executionAnalyticsFormSchema = z.object({
    processHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type executionAnalyticsFormValues = z.infer<typeof executionAnalyticsFormSchema>;

export const bottleneckReportsFormSchema = z.object({
    processHubId: z.string().min(1),
    reportKey: z.string().min(1).optional(),
    reportName: z.string().min(1).optional(),
    bottleneckScore: z.number().optional(),
});

export type bottleneckReportsFormValues = z.infer<typeof bottleneckReportsFormSchema>;

export const slaPerformanceMetricsFormSchema = z.object({
    processHubId: z.string().min(1),
    metricKey: z.string().min(1).optional(),
    metricName: z.string().min(1).optional(),
    slaScore: z.number().optional(),
});

export type slaPerformanceMetricsFormValues = z.infer<typeof slaPerformanceMetricsFormSchema>;

export const processMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    executionCount: z.number().optional(),
    overallProcessScore: z.number().optional(),
});

export type processMetricsFormValues = z.infer<typeof processMetricsFormSchema>;

export const processHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type processHealthFormValues = z.infer<typeof processHealthFormSchema>;

export const failedProcessRecordsFormSchema = z.object({
    processHubId: z.string().min(1),
    recordKey: z.string().min(1).optional(),
    recordName: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type failedProcessRecordsFormValues = z.infer<typeof failedProcessRecordsFormSchema>;

export const processFailuresFormSchema = z.object({
    processHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type processFailuresFormValues = z.infer<typeof processFailuresFormSchema>;
