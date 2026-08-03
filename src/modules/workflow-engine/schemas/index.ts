import { z } from "zod";

export const workflowHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type workflowHubsFormValues = z.infer<typeof workflowHubsFormSchema>;

export const workflowDefinitionsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    workflowKey: z.string().min(1).optional(),
    workflowName: z.string().min(1).optional(),
    workflowType: z.string().min(1).optional(),
});

export type workflowDefinitionsFormValues = z.infer<typeof workflowDefinitionsFormSchema>;

export const workflowCategoriesFormSchema = z.object({
    workflowHubId: z.string().min(1),
    categoryKey: z.string().min(1).optional(),
    categoryName: z.string().min(1).optional(),
    categoryType: z.string().min(1).optional(),
});

export type workflowCategoriesFormValues = z.infer<typeof workflowCategoriesFormSchema>;

export const workflowTemplatesFormSchema = z.object({
    workflowHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateType: z.string().min(1).optional(),
});

export type workflowTemplatesFormValues = z.infer<typeof workflowTemplatesFormSchema>;

export const workflowVersionsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
    releaseChannel: z.string().min(1).optional(),
});

export type workflowVersionsFormValues = z.infer<typeof workflowVersionsFormSchema>;

export const workflowNodesFormSchema = z.object({
    workflowHubId: z.string().min(1),
    nodeKey: z.string().min(1).optional(),
    nodeName: z.string().min(1).optional(),
    nodeType: z.string().min(1).optional(),
});

export type workflowNodesFormValues = z.infer<typeof workflowNodesFormSchema>;

export const workflowTransitionsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    transitionKey: z.string().min(1).optional(),
    transitionName: z.string().min(1).optional(),
    sourceNodeRef: z.string().min(1).optional(),
});

export type workflowTransitionsFormValues = z.infer<typeof workflowTransitionsFormSchema>;

export const decisionNodesFormSchema = z.object({
    workflowHubId: z.string().min(1),
    decisionKey: z.string().min(1).optional(),
    decisionName: z.string().min(1).optional(),
    decisionExpression: z.string().min(1).optional(),
});

export type decisionNodesFormValues = z.infer<typeof decisionNodesFormSchema>;

export const reusableSubflowsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    subflowKey: z.string().min(1).optional(),
    subflowName: z.string().min(1).optional(),
    subflowType: z.string().min(1).optional(),
});

export type reusableSubflowsFormValues = z.infer<typeof reusableSubflowsFormSchema>;

export const workflowExecutionsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    executionKey: z.string().min(1).optional(),
    executionName: z.string().min(1).optional(),
    executionStatus: z.string().min(1).optional(),
});

export type workflowExecutionsFormValues = z.infer<typeof workflowExecutionsFormSchema>;

export const executionHistoryFormSchema = z.object({
    workflowHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyType: z.string().min(1).optional(),
    historySummary: z.string().min(1).optional(),
});

export type executionHistoryFormValues = z.infer<typeof executionHistoryFormSchema>;

export const executionRetriesFormSchema = z.object({
    workflowHubId: z.string().min(1),
    retryKey: z.string().min(1).optional(),
    retryCount: z.number().optional(),
    retryStatus: z.string().min(1).optional(),
});

export type executionRetriesFormValues = z.infer<typeof executionRetriesFormSchema>;

export const executionRollbacksFormSchema = z.object({
    workflowHubId: z.string().min(1),
    rollbackKey: z.string().min(1).optional(),
    rollbackReason: z.string().min(1).optional(),
    rollbackStatus: z.string().min(1).optional(),
});

export type executionRollbacksFormValues = z.infer<typeof executionRollbacksFormSchema>;

export const timeTriggersFormSchema = z.object({
    workflowHubId: z.string().min(1),
    triggerKey: z.string().min(1).optional(),
    triggerName: z.string().min(1).optional(),
    cronExpression: z.string().min(1).optional(),
});

export type timeTriggersFormValues = z.infer<typeof timeTriggersFormSchema>;

export const businessEventTriggersFormSchema = z.object({
    workflowHubId: z.string().min(1),
    triggerKey: z.string().min(1).optional(),
    triggerName: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
});

export type businessEventTriggersFormValues = z.infer<typeof businessEventTriggersFormSchema>;

export const webhookTriggersFormSchema = z.object({
    workflowHubId: z.string().min(1),
    triggerKey: z.string().min(1).optional(),
    triggerName: z.string().min(1).optional(),
    webhookUrl: z.string().min(1).optional(),
});

export type webhookTriggersFormValues = z.infer<typeof webhookTriggersFormSchema>;

export const scheduledTriggersFormSchema = z.object({
    workflowHubId: z.string().min(1),
    triggerKey: z.string().min(1).optional(),
    triggerName: z.string().min(1).optional(),
    scheduleType: z.string().min(1).optional(),
});

export type scheduledTriggersFormValues = z.infer<typeof scheduledTriggersFormSchema>;

export const manualReviewsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    reviewName: z.string().min(1).optional(),
    reviewStatus: z.string().min(1).optional(),
});

export type manualReviewsFormValues = z.infer<typeof manualReviewsFormSchema>;

export const approvalTasksFormSchema = z.object({
    workflowHubId: z.string().min(1),
    taskKey: z.string().min(1).optional(),
    taskName: z.string().min(1).optional(),
    taskStatus: z.string().min(1).optional(),
});

export type approvalTasksFormValues = z.infer<typeof approvalTasksFormSchema>;

export const escalationRulesFormSchema = z.object({
    workflowHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    escalationLevel: z.number().optional(),
});

export type escalationRulesFormValues = z.infer<typeof escalationRulesFormSchema>;

export const slaTrackingsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    slaKey: z.string().min(1).optional(),
    slaName: z.string().min(1).optional(),
    targetMinutes: z.number().optional(),
});

export type slaTrackingsFormValues = z.infer<typeof slaTrackingsFormSchema>;

export const automationNotificationsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    notificationKey: z.string().min(1).optional(),
    notificationName: z.string().min(1).optional(),
    channel: z.string().min(1).optional(),
});

export type automationNotificationsFormValues = z.infer<typeof automationNotificationsFormSchema>;

export const automationApiCallsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    apiKey: z.string().min(1).optional(),
    apiName: z.string().min(1).optional(),
    endpointUrl: z.string().min(1).optional(),
});

export type automationApiCallsFormValues = z.infer<typeof automationApiCallsFormSchema>;

export const automationIntegrationsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    integrationKey: z.string().min(1).optional(),
    integrationName: z.string().min(1).optional(),
    integrationType: z.string().min(1).optional(),
});

export type automationIntegrationsFormValues = z.infer<typeof automationIntegrationsFormSchema>;

export const executionAnalyticsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type executionAnalyticsFormValues = z.infer<typeof executionAnalyticsFormSchema>;

export const bottleneckReportsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    reportKey: z.string().min(1).optional(),
    reportName: z.string().min(1).optional(),
    bottleneckScore: z.number().optional(),
});

export type bottleneckReportsFormValues = z.infer<typeof bottleneckReportsFormSchema>;

export const slaComplianceMetricsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    metricKey: z.string().min(1).optional(),
    metricName: z.string().min(1).optional(),
    complianceRate: z.number().optional(),
});

export type slaComplianceMetricsFormValues = z.infer<typeof slaComplianceMetricsFormSchema>;

export const workflowMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    executionCount: z.number().optional(),
    overallWorkflowScore: z.number().optional(),
});

export type workflowMetricsFormValues = z.infer<typeof workflowMetricsFormSchema>;

export const workflowHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type workflowHealthFormValues = z.infer<typeof workflowHealthFormSchema>;

export const failedExecutionsFormSchema = z.object({
    workflowHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    executionRef: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type failedExecutionsFormValues = z.infer<typeof failedExecutionsFormSchema>;

export const workflowFailuresFormSchema = z.object({
    workflowHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type workflowFailuresFormValues = z.infer<typeof workflowFailuresFormSchema>;
