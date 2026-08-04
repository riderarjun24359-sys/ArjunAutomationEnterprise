import { z } from "zod";

export const operationsHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type operationsHubsFormValues = z.infer<typeof operationsHubsFormSchema>;

export const brandKnowledgeBaseFormSchema = z.object({
    operationsHubId: z.string().min(1),
    knowledgeKey: z.string().min(1).optional(),
    knowledgeTitle: z.string().min(1).optional(),
    knowledgeStatus: z.string().min(1).optional(),
});

export type brandKnowledgeBaseFormValues = z.infer<typeof brandKnowledgeBaseFormSchema>;

export const brandRulebookFormSchema = z.object({
    operationsHubId: z.string().min(1),
    rulebookKey: z.string().min(1).optional(),
    rulebookName: z.string().min(1).optional(),
    rulebookStatus: z.string().min(1).optional(),
});

export type brandRulebookFormValues = z.infer<typeof brandRulebookFormSchema>;

export const messagingLibraryFormSchema = z.object({
    operationsHubId: z.string().min(1),
    messageKey: z.string().min(1).optional(),
    messageTitle: z.string().min(1).optional(),
    messageStatus: z.string().min(1).optional(),
});

export type messagingLibraryFormValues = z.infer<typeof messagingLibraryFormSchema>;

export const serviceLibraryFormSchema = z.object({
    operationsHubId: z.string().min(1),
    serviceKey: z.string().min(1).optional(),
    serviceName: z.string().min(1).optional(),
    serviceStatus: z.string().min(1).optional(),
});

export type serviceLibraryFormValues = z.infer<typeof serviceLibraryFormSchema>;

export const industryLibraryFormSchema = z.object({
    operationsHubId: z.string().min(1),
    industryKey: z.string().min(1).optional(),
    industryName: z.string().min(1).optional(),
    industryStatus: z.string().min(1).optional(),
});

export type industryLibraryFormValues = z.infer<typeof industryLibraryFormSchema>;

export const faqLibraryFormSchema = z.object({
    operationsHubId: z.string().min(1),
    faqKey: z.string().min(1).optional(),
    faqQuestion: z.string().min(1).optional(),
    faqStatus: z.string().min(1).optional(),
});

export type faqLibraryFormValues = z.infer<typeof faqLibraryFormSchema>;

export const brandApprovalRulesFormSchema = z.object({
    operationsHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    ruleStatus: z.string().min(1).optional(),
});

export type brandApprovalRulesFormValues = z.infer<typeof brandApprovalRulesFormSchema>;

export const videoProjectsFormSchema = z.object({
    operationsHubId: z.string().min(1),
    projectKey: z.string().min(1).optional(),
    projectName: z.string().min(1).optional(),
    projectStatus: z.string().min(1).optional(),
});

export type videoProjectsFormValues = z.infer<typeof videoProjectsFormSchema>;

export const thumbnailManagerFormSchema = z.object({
    operationsHubId: z.string().min(1),
    thumbnailKey: z.string().min(1).optional(),
    thumbnailName: z.string().min(1).optional(),
    thumbnailStatus: z.string().min(1).optional(),
});

export type thumbnailManagerFormValues = z.infer<typeof thumbnailManagerFormSchema>;

export const voiceoverManagerFormSchema = z.object({
    operationsHubId: z.string().min(1),
    voiceoverKey: z.string().min(1).optional(),
    voiceoverName: z.string().min(1).optional(),
    voiceoverStatus: z.string().min(1).optional(),
});

export type voiceoverManagerFormValues = z.infer<typeof voiceoverManagerFormSchema>;

export const creativeAssetGeneratorFormSchema = z.object({
    operationsHubId: z.string().min(1),
    generatorKey: z.string().min(1).optional(),
    generatorName: z.string().min(1).optional(),
    generatorStatus: z.string().min(1).optional(),
});

export type creativeAssetGeneratorFormValues = z.infer<typeof creativeAssetGeneratorFormSchema>;

export const campaignAssetBuilderFormSchema = z.object({
    operationsHubId: z.string().min(1),
    builderKey: z.string().min(1).optional(),
    builderName: z.string().min(1).optional(),
    builderStatus: z.string().min(1).optional(),
});

export type campaignAssetBuilderFormValues = z.infer<typeof campaignAssetBuilderFormSchema>;

export const creativeWorkflowsFormSchema = z.object({
    operationsHubId: z.string().min(1),
    workflowKey: z.string().min(1).optional(),
    workflowName: z.string().min(1).optional(),
    workflowStatus: z.string().min(1).optional(),
});

export type creativeWorkflowsFormValues = z.infer<typeof creativeWorkflowsFormSchema>;

export const distributionContentQueueFormSchema = z.object({
    operationsHubId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    queueTitle: z.string().min(1).optional(),
    queueStatus: z.string().min(1).optional(),
});

export type distributionContentQueueFormValues = z.infer<typeof distributionContentQueueFormSchema>;

export const distributionPublishingQueueFormSchema = z.object({
    operationsHubId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    queueTitle: z.string().min(1).optional(),
    queueStatus: z.string().min(1).optional(),
});

export type distributionPublishingQueueFormValues = z.infer<typeof distributionPublishingQueueFormSchema>;

export const channelManagerFormSchema = z.object({
    operationsHubId: z.string().min(1),
    channelKey: z.string().min(1).optional(),
    channelName: z.string().min(1).optional(),
    channelStatus: z.string().min(1).optional(),
});

export type channelManagerFormValues = z.infer<typeof channelManagerFormSchema>;

export const approvalCenterFormSchema = z.object({
    operationsHubId: z.string().min(1),
    approvalKey: z.string().min(1).optional(),
    approvalTitle: z.string().min(1).optional(),
    approvalStatus: z.string().min(1).optional(),
});

export type approvalCenterFormValues = z.infer<typeof approvalCenterFormSchema>;

export const publishingHistoryFormSchema = z.object({
    operationsHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyTitle: z.string().min(1).optional(),
    historyStatus: z.string().min(1).optional(),
});

export type publishingHistoryFormValues = z.infer<typeof publishingHistoryFormSchema>;

export const distributionAnalyticsFormSchema = z.object({
    operationsHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsName: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type distributionAnalyticsFormValues = z.infer<typeof distributionAnalyticsFormSchema>;

export const campaignDashboardFormSchema = z.object({
    operationsHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardStatus: z.string().min(1).optional(),
});

export type campaignDashboardFormValues = z.infer<typeof campaignDashboardFormSchema>;

export const contentPerformanceFormSchema = z.object({
    operationsHubId: z.string().min(1),
    performanceKey: z.string().min(1).optional(),
    performanceTitle: z.string().min(1).optional(),
    performanceScore: z.number().optional(),
});

export type contentPerformanceFormValues = z.infer<typeof contentPerformanceFormSchema>;

export const leadAttributionFormSchema = z.object({
    operationsHubId: z.string().min(1),
    attributionKey: z.string().min(1).optional(),
    attributionTitle: z.string().min(1).optional(),
    attributionStatus: z.string().min(1).optional(),
});

export type leadAttributionFormValues = z.infer<typeof leadAttributionFormSchema>;

export const growthKpisFormSchema = z.object({
    operationsHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiValue: z.number().optional(),
});

export type growthKpisFormValues = z.infer<typeof growthKpisFormSchema>;

export const roiDashboardFormSchema = z.object({
    operationsHubId: z.string().min(1),
    roiKey: z.string().min(1).optional(),
    roiName: z.string().min(1).optional(),
    roiScore: z.number().optional(),
});

export type roiDashboardFormValues = z.infer<typeof roiDashboardFormSchema>;

export const recommendationEngineFormSchema = z.object({
    operationsHubId: z.string().min(1),
    recommendationKey: z.string().min(1).optional(),
    recommendationTitle: z.string().min(1).optional(),
    recommendationStatus: z.string().min(1).optional(),
});

export type recommendationEngineFormValues = z.infer<typeof recommendationEngineFormSchema>;

export const commandCenterMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    overallOperationsScore: z.number().optional(),
    missionStatusScore: z.number().optional(),
});

export type commandCenterMetricsFormValues = z.infer<typeof commandCenterMetricsFormSchema>;

export const commandCenterHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    brandOsStatus: z.string().min(1).optional(),
});

export type commandCenterHealthFormValues = z.infer<typeof commandCenterHealthFormSchema>;

export const missionStatusFormSchema = z.object({
    operationsHubId: z.string().min(1),
    missionKey: z.string().min(1).optional(),
    missionName: z.string().min(1).optional(),
    missionStatus: z.string().min(1).optional(),
});

export type missionStatusFormValues = z.infer<typeof missionStatusFormSchema>;

export const executiveSummariesFormSchema = z.object({
    operationsHubId: z.string().min(1),
    summaryKey: z.string().min(1).optional(),
    summaryTitle: z.string().min(1).optional(),
    summaryStatus: z.string().min(1).optional(),
});

export type executiveSummariesFormValues = z.infer<typeof executiveSummariesFormSchema>;

export const operationalFailuresFormSchema = z.object({
    operationsHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type operationalFailuresFormValues = z.infer<typeof operationalFailuresFormSchema>;
