import { z } from "zod";

export const deliveryHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type deliveryHubsFormValues = z.infer<typeof deliveryHubsFormSchema>;

export const customerHealthScoresFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    scoreKey: z.string().min(1).optional(),
    customerRef: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type customerHealthScoresFormValues = z.infer<typeof customerHealthScoresFormSchema>;

export const adoptionAnalyticsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    featureName: z.string().min(1).optional(),
    adoptionRate: z.number().optional(),
});

export type adoptionAnalyticsFormValues = z.infer<typeof adoptionAnalyticsFormSchema>;

export const successPlansFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    planKey: z.string().min(1).optional(),
    planName: z.string().min(1).optional(),
    planStatus: z.string().min(1).optional(),
});

export type successPlansFormValues = z.infer<typeof successPlansFormSchema>;

export const customerTimelinesFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    timelineKey: z.string().min(1).optional(),
    timelineName: z.string().min(1).optional(),
    timelineType: z.string().min(1).optional(),
});

export type customerTimelinesFormValues = z.infer<typeof customerTimelinesFormSchema>;

export const renewalForecastsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    forecastKey: z.string().min(1).optional(),
    customerRef: z.string().min(1).optional(),
    forecastStatus: z.string().min(1).optional(),
});

export type renewalForecastsFormValues = z.infer<typeof renewalForecastsFormSchema>;

export const supportTicketsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    ticketKey: z.string().min(1).optional(),
    ticketTitle: z.string().min(1).optional(),
    ticketStatus: z.string().min(1).optional(),
});

export type supportTicketsFormValues = z.infer<typeof supportTicketsFormSchema>;

export const liveChatSessionsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    sessionKey: z.string().min(1).optional(),
    sessionTitle: z.string().min(1).optional(),
    sessionStatus: z.string().min(1).optional(),
});

export type liveChatSessionsFormValues = z.infer<typeof liveChatSessionsFormSchema>;

export const knowledgeBaseArticlesFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    articleKey: z.string().min(1).optional(),
    articleTitle: z.string().min(1).optional(),
    articleCategory: z.string().min(1).optional(),
});

export type knowledgeBaseArticlesFormValues = z.infer<typeof knowledgeBaseArticlesFormSchema>;

export const slaPoliciesFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    policyType: z.string().min(1).optional(),
});

export type slaPoliciesFormValues = z.infer<typeof slaPoliciesFormSchema>;

export const escalationRulesFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    ruleType: z.string().min(1).optional(),
});

export type escalationRulesFormValues = z.infer<typeof escalationRulesFormSchema>;

export const deploymentAutomationsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    automationKey: z.string().min(1).optional(),
    automationName: z.string().min(1).optional(),
    automationStatus: z.string().min(1).optional(),
});

export type deploymentAutomationsFormValues = z.infer<typeof deploymentAutomationsFormSchema>;

export const environmentManagementFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    environmentKey: z.string().min(1).optional(),
    environmentName: z.string().min(1).optional(),
    environmentType: z.string().min(1).optional(),
});

export type environmentManagementFormValues = z.infer<typeof environmentManagementFormSchema>;

export const deploymentTrackingFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    trackingKey: z.string().min(1).optional(),
    deploymentName: z.string().min(1).optional(),
    deploymentStatus: z.string().min(1).optional(),
});

export type deploymentTrackingFormValues = z.infer<typeof deploymentTrackingFormSchema>;

export const upgradeManagementFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    upgradeKey: z.string().min(1).optional(),
    upgradeName: z.string().min(1).optional(),
    upgradeStatus: z.string().min(1).optional(),
});

export type upgradeManagementFormValues = z.infer<typeof upgradeManagementFormSchema>;

export const releaseTrackingFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    releaseKey: z.string().min(1).optional(),
    releaseName: z.string().min(1).optional(),
    releaseStatus: z.string().min(1).optional(),
});

export type releaseTrackingFormValues = z.infer<typeof releaseTrackingFormSchema>;

export const trainingPortalsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    portalKey: z.string().min(1).optional(),
    portalName: z.string().min(1).optional(),
    portalType: z.string().min(1).optional(),
});

export type trainingPortalsFormValues = z.infer<typeof trainingPortalsFormSchema>;

export const videoLibraryFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    videoKey: z.string().min(1).optional(),
    videoTitle: z.string().min(1).optional(),
    videoCategory: z.string().min(1).optional(),
});

export type videoLibraryFormValues = z.infer<typeof videoLibraryFormSchema>;

export const productToursFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    tourKey: z.string().min(1).optional(),
    tourName: z.string().min(1).optional(),
    tourType: z.string().min(1).optional(),
});

export type productToursFormValues = z.infer<typeof productToursFormSchema>;

export const certificationsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    certificationKey: z.string().min(1).optional(),
    certificationName: z.string().min(1).optional(),
    certificationType: z.string().min(1).optional(),
});

export type certificationsFormValues = z.infer<typeof certificationsFormSchema>;

export const progressTrackingFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    progressKey: z.string().min(1).optional(),
    learnerRef: z.string().min(1).optional(),
    progressPercent: z.number().optional(),
});

export type progressTrackingFormValues = z.infer<typeof progressTrackingFormSchema>;

export const learningAnalyticsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    metricName: z.string().min(1).optional(),
    completionRate: z.number().optional(),
});

export type learningAnalyticsFormValues = z.infer<typeof learningAnalyticsFormSchema>;

export const deliveryWorkflowsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    workflowKey: z.string().min(1).optional(),
    workflowName: z.string().min(1).optional(),
    workflowStatus: z.string().min(1).optional(),
});

export type deliveryWorkflowsFormValues = z.infer<typeof deliveryWorkflowsFormSchema>;

export const onboardingAutomationFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    automationKey: z.string().min(1).optional(),
    automationName: z.string().min(1).optional(),
    automationStatus: z.string().min(1).optional(),
});

export type onboardingAutomationFormValues = z.infer<typeof onboardingAutomationFormSchema>;

export const implementationTrackingFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    trackingKey: z.string().min(1).optional(),
    implementationName: z.string().min(1).optional(),
    implementationStatus: z.string().min(1).optional(),
});

export type implementationTrackingFormValues = z.infer<typeof implementationTrackingFormSchema>;

export const resourceAssignmentsFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    assignmentKey: z.string().min(1).optional(),
    resourceName: z.string().min(1).optional(),
    resourceType: z.string().min(1).optional(),
});

export type resourceAssignmentsFormValues = z.infer<typeof resourceAssignmentsFormSchema>;

export const milestoneTrackingFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    milestoneKey: z.string().min(1).optional(),
    milestoneName: z.string().min(1).optional(),
    milestoneStatus: z.string().min(1).optional(),
});

export type milestoneTrackingFormValues = z.infer<typeof milestoneTrackingFormSchema>;

export const operationsMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    customerHealthScore: z.number().optional(),
    overallDeliveryScore: z.number().optional(),
});

export type operationsMetricsFormValues = z.infer<typeof operationsMetricsFormSchema>;

export const operationsHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type operationsHealthFormValues = z.infer<typeof operationsHealthFormSchema>;

export const executiveKpisFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiScore: z.number().optional(),
});

export type executiveKpisFormValues = z.infer<typeof executiveKpisFormSchema>;

export const deliveryFailuresFormSchema = z.object({
    deliveryHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type deliveryFailuresFormValues = z.infer<typeof deliveryFailuresFormSchema>;
