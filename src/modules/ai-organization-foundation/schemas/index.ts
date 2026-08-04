import { z } from "zod";

export const organizationHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type organizationHubsFormValues = z.infer<typeof organizationHubsFormSchema>;

export const growthOrchestratorsFormSchema = z.object({
    organizationHubId: z.string().min(1),
    orchestratorKey: z.string().min(1).optional(),
    orchestratorName: z.string().min(1).optional(),
    orchestratorStatus: z.string().min(1).optional(),
});

export type growthOrchestratorsFormValues = z.infer<typeof growthOrchestratorsFormSchema>;

export const campaignIntelligenceFormSchema = z.object({
    organizationHubId: z.string().min(1),
    campaignKey: z.string().min(1).optional(),
    campaignName: z.string().min(1).optional(),
    campaignStatus: z.string().min(1).optional(),
});

export type campaignIntelligenceFormValues = z.infer<typeof campaignIntelligenceFormSchema>;

export const leadPrioritizationFormSchema = z.object({
    organizationHubId: z.string().min(1),
    leadKey: z.string().min(1).optional(),
    leadName: z.string().min(1).optional(),
    priorityScore: z.number().optional(),
});

export type leadPrioritizationFormValues = z.infer<typeof leadPrioritizationFormSchema>;

export const opportunityRecommendationsFormSchema = z.object({
    organizationHubId: z.string().min(1),
    recommendationKey: z.string().min(1).optional(),
    recommendationTitle: z.string().min(1).optional(),
    recommendationType: z.string().min(1).optional(),
});

export type opportunityRecommendationsFormValues = z.infer<typeof opportunityRecommendationsFormSchema>;

export const pipelineHealthFormSchema = z.object({
    organizationHubId: z.string().min(1),
    healthKey: z.string().min(1).optional(),
    healthName: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type pipelineHealthFormValues = z.infer<typeof pipelineHealthFormSchema>;

export const growthAnalyticsFormSchema = z.object({
    organizationHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsName: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
});

export type growthAnalyticsFormValues = z.infer<typeof growthAnalyticsFormSchema>;

export const executiveGrowthDashboardsFormSchema = z.object({
    organizationHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardStatus: z.string().min(1).optional(),
});

export type executiveGrowthDashboardsFormValues = z.infer<typeof executiveGrowthDashboardsFormSchema>;

export const deliveryOrchestratorsFormSchema = z.object({
    organizationHubId: z.string().min(1),
    orchestratorKey: z.string().min(1).optional(),
    orchestratorName: z.string().min(1).optional(),
    orchestratorStatus: z.string().min(1).optional(),
});

export type deliveryOrchestratorsFormValues = z.infer<typeof deliveryOrchestratorsFormSchema>;

export const resourcePlannersFormSchema = z.object({
    organizationHubId: z.string().min(1),
    plannerKey: z.string().min(1).optional(),
    plannerName: z.string().min(1).optional(),
    plannerStatus: z.string().min(1).optional(),
});

export type resourcePlannersFormValues = z.infer<typeof resourcePlannersFormSchema>;

export const implementationSchedulersFormSchema = z.object({
    organizationHubId: z.string().min(1),
    schedulerKey: z.string().min(1).optional(),
    schedulerName: z.string().min(1).optional(),
    schedulerStatus: z.string().min(1).optional(),
});

export type implementationSchedulersFormValues = z.infer<typeof implementationSchedulersFormSchema>;

export const deploymentCoordinationFormSchema = z.object({
    organizationHubId: z.string().min(1),
    coordinationKey: z.string().min(1).optional(),
    coordinationName: z.string().min(1).optional(),
    coordinationStatus: z.string().min(1).optional(),
});

export type deploymentCoordinationFormValues = z.infer<typeof deploymentCoordinationFormSchema>;

export const deliveryIntelligenceFormSchema = z.object({
    organizationHubId: z.string().min(1),
    intelligenceKey: z.string().min(1).optional(),
    intelligenceTitle: z.string().min(1).optional(),
    intelligenceType: z.string().min(1).optional(),
});

export type deliveryIntelligenceFormValues = z.infer<typeof deliveryIntelligenceFormSchema>;

export const customerSuccessAutomationFormSchema = z.object({
    organizationHubId: z.string().min(1),
    automationKey: z.string().min(1).optional(),
    automationName: z.string().min(1).optional(),
    automationStatus: z.string().min(1).optional(),
});

export type customerSuccessAutomationFormValues = z.infer<typeof customerSuccessAutomationFormSchema>;

export const executiveDeliveryDashboardsFormSchema = z.object({
    organizationHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardStatus: z.string().min(1).optional(),
});

export type executiveDeliveryDashboardsFormValues = z.infer<typeof executiveDeliveryDashboardsFormSchema>;

export const ideaRegistryFormSchema = z.object({
    organizationHubId: z.string().min(1),
    ideaKey: z.string().min(1).optional(),
    ideaTitle: z.string().min(1).optional(),
    ideaStatus: z.string().min(1).optional(),
});

export type ideaRegistryFormValues = z.infer<typeof ideaRegistryFormSchema>;

export const innovationPipelineFormSchema = z.object({
    organizationHubId: z.string().min(1),
    pipelineKey: z.string().min(1).optional(),
    pipelineName: z.string().min(1).optional(),
    pipelineStatus: z.string().min(1).optional(),
});

export type innovationPipelineFormValues = z.infer<typeof innovationPipelineFormSchema>;

export const experimentTrackerFormSchema = z.object({
    organizationHubId: z.string().min(1),
    experimentKey: z.string().min(1).optional(),
    experimentName: z.string().min(1).optional(),
    experimentStatus: z.string().min(1).optional(),
});

export type experimentTrackerFormValues = z.infer<typeof experimentTrackerFormSchema>;

export const validationWorkflowFormSchema = z.object({
    organizationHubId: z.string().min(1),
    workflowKey: z.string().min(1).optional(),
    workflowName: z.string().min(1).optional(),
    workflowStatus: z.string().min(1).optional(),
});

export type validationWorkflowFormValues = z.infer<typeof validationWorkflowFormSchema>;

export const outcomeEvaluationFormSchema = z.object({
    organizationHubId: z.string().min(1),
    evaluationKey: z.string().min(1).optional(),
    evaluationTitle: z.string().min(1).optional(),
    evaluationScore: z.number().optional(),
});

export type outcomeEvaluationFormValues = z.infer<typeof outcomeEvaluationFormSchema>;

export const knowledgeRepositoryFormSchema = z.object({
    organizationHubId: z.string().min(1),
    repositoryKey: z.string().min(1).optional(),
    repositoryName: z.string().min(1).optional(),
    repositoryStatus: z.string().min(1).optional(),
});

export type knowledgeRepositoryFormValues = z.infer<typeof knowledgeRepositoryFormSchema>;

export const aiTaskRoutersFormSchema = z.object({
    organizationHubId: z.string().min(1),
    routerKey: z.string().min(1).optional(),
    routerName: z.string().min(1).optional(),
    routerStatus: z.string().min(1).optional(),
});

export type aiTaskRoutersFormValues = z.infer<typeof aiTaskRoutersFormSchema>;

export const humanApprovalEngineFormSchema = z.object({
    organizationHubId: z.string().min(1),
    approvalKey: z.string().min(1).optional(),
    approvalName: z.string().min(1).optional(),
    approvalStatus: z.string().min(1).optional(),
});

export type humanApprovalEngineFormValues = z.infer<typeof humanApprovalEngineFormSchema>;

export const policyEngineFormSchema = z.object({
    organizationHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    policyStatus: z.string().min(1).optional(),
});

export type policyEngineFormValues = z.infer<typeof policyEngineFormSchema>;

export const executionHistoryFormSchema = z.object({
    organizationHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyTitle: z.string().min(1).optional(),
    executionStatus: z.string().min(1).optional(),
});

export type executionHistoryFormValues = z.infer<typeof executionHistoryFormSchema>;

export const aiGovernanceRulesFormSchema = z.object({
    organizationHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    ruleStatus: z.string().min(1).optional(),
});

export type aiGovernanceRulesFormValues = z.infer<typeof aiGovernanceRulesFormSchema>;

export const organizationMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    growthScore: z.number().optional(),
    overallOrganizationScore: z.number().optional(),
});

export type organizationMetricsFormValues = z.infer<typeof organizationMetricsFormSchema>;

export const organizationHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type organizationHealthFormValues = z.infer<typeof organizationHealthFormSchema>;

export const innovationDashboardsFormSchema = z.object({
    organizationHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardStatus: z.string().min(1).optional(),
});

export type innovationDashboardsFormValues = z.infer<typeof innovationDashboardsFormSchema>;

export const missionProgressFormSchema = z.object({
    organizationHubId: z.string().min(1),
    progressKey: z.string().min(1).optional(),
    progressName: z.string().min(1).optional(),
    progressPercent: z.number().optional(),
});

export type missionProgressFormValues = z.infer<typeof missionProgressFormSchema>;

export const organizationFailuresFormSchema = z.object({
    organizationHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type organizationFailuresFormValues = z.infer<typeof organizationFailuresFormSchema>;
