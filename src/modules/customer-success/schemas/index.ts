import { z } from "zod";

export const engagementFormSchema = z.object({
    title: z.string().min(2),
    engagementKey: z.string().min(2),
    baEngagementId: z.string().optional(),
    saEngagementId: z.string().optional(),
    dfEngagementId: z.string().optional(),
    qaEngagementId: z.string().optional(),
    ddEngagementId: z.string().optional(),
    solutionArchitectureId: z.string().optional(),
    workPackageId: z.string().optional(),
    qaReleaseReadinessId: z.string().optional(),
    ddReleaseVersionId: z.string().optional(),
    brdId: z.string().optional(),
    frsId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    contactId: z.string().optional(),
    agentId: z.string().optional(),
    sessionId: z.string().optional(),
    summary: z.string().optional(),
});

export const onboardingWorkflowFormSchema = z.object({
    engagementId: z.string().min(1),
    workflowKey: z.string().min(2),
    name: z.string().min(2),
});

export const adoptionTrackingFormSchema = z.object({
    engagementId: z.string().min(1),
    trackingKey: z.string().min(2),
    name: z.string().min(2),
    adoptionPercent: z.number().min(0).max(100).optional(),
});

export const healthScoreFormSchema = z.object({
    engagementId: z.string().min(1),
    scoreKey: z.string().min(2),
    name: z.string().min(2),
    overallScore: z.number().min(0).max(100).optional(),
});

export const renewalPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    renewalValueUsd: z.number().min(0).optional(),
});

export const expansionOpportunityFormSchema = z.object({
    engagementId: z.string().min(1),
    opportunityKey: z.string().min(2),
    name: z.string().min(2),
    opportunityType: z.string().optional(),
    estimatedValueUsd: z.number().min(0).optional(),
});

export const riskAnalysisFormSchema = z.object({
    engagementId: z.string().min(1),
    analysisKey: z.string().min(2),
    name: z.string().min(2),
    riskLevel: z.string().optional(),
    mitigationPlan: z.string().optional(),
});

export const supportTrendAnalysisFormSchema = z.object({
    engagementId: z.string().min(1),
    analysisKey: z.string().min(2),
    name: z.string().min(2),
    insights: z.string().optional(),
});

export const successPlaybookFormSchema = z.object({
    engagementId: z.string().min(1),
    playbookKey: z.string().min(2),
    name: z.string().min(2),
    playbookType: z.string().optional(),
});

export const qbrReportFormSchema = z.object({
    engagementId: z.string().min(1),
    reportKey: z.string().min(2),
    title: z.string().min(2),
    quarter: z.string().optional(),
});

export const communicationPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    cadence: z.string().optional(),
});

export const trainingRecommendationFormSchema = z.object({
    engagementId: z.string().min(1),
    recommendationKey: z.string().min(2),
    name: z.string().min(2),
    priority: z.string().optional(),
});

export const feedbackAnalysisFormSchema = z.object({
    engagementId: z.string().min(1),
    analysisKey: z.string().min(2),
    name: z.string().min(2),
    sentimentScore: z.number().min(0).max(100).optional(),
    recommendations: z.string().optional(),
});

export const slaMonitoringFormSchema = z.object({
    engagementId: z.string().min(1),
    monitoringKey: z.string().min(2),
    name: z.string().min(2),
    compliancePercent: z.number().min(0).max(100).optional(),
});

export const successKpiDashboardFormSchema = z.object({
    engagementId: z.string().min(1),
    dashboardKey: z.string().min(2),
    name: z.string().min(2),
    refreshCadence: z.string().optional(),
});

export const churnPredictionFormSchema = z.object({
    engagementId: z.string().min(1),
    predictionKey: z.string().min(2),
    name: z.string().min(2),
    churnProbability: z.number().min(0).max(100).optional(),
});

export const lifecycleManagementFormSchema = z.object({
    engagementId: z.string().min(1),
    lifecycleKey: z.string().min(2),
    name: z.string().min(2),
    currentStage: z.string().optional(),
});

export const executiveSummaryFormSchema = z.object({
    engagementId: z.string().min(1),
    summaryKey: z.string().min(2),
    title: z.string().min(2),
    summaryContent: z.string().optional(),
});

export type EngagementFormValues = z.infer<typeof engagementFormSchema>;
export type OnboardingWorkflowFormValues = z.infer<typeof onboardingWorkflowFormSchema>;
export type AdoptionTrackingFormValues = z.infer<typeof adoptionTrackingFormSchema>;
export type HealthScoreFormValues = z.infer<typeof healthScoreFormSchema>;
export type RenewalPlanFormValues = z.infer<typeof renewalPlanFormSchema>;
export type ExpansionOpportunityFormValues = z.infer<typeof expansionOpportunityFormSchema>;
export type RiskAnalysisFormValues = z.infer<typeof riskAnalysisFormSchema>;
export type SupportTrendAnalysisFormValues = z.infer<typeof supportTrendAnalysisFormSchema>;
export type SuccessPlaybookFormValues = z.infer<typeof successPlaybookFormSchema>;
export type QbrReportFormValues = z.infer<typeof qbrReportFormSchema>;
export type CommunicationPlanFormValues = z.infer<typeof communicationPlanFormSchema>;
export type TrainingRecommendationFormValues = z.infer<typeof trainingRecommendationFormSchema>;
export type FeedbackAnalysisFormValues = z.infer<typeof feedbackAnalysisFormSchema>;
export type SlaMonitoringFormValues = z.infer<typeof slaMonitoringFormSchema>;
export type SuccessKpiDashboardFormValues = z.infer<typeof successKpiDashboardFormSchema>;
export type ChurnPredictionFormValues = z.infer<typeof churnPredictionFormSchema>;
export type LifecycleManagementFormValues = z.infer<typeof lifecycleManagementFormSchema>;
export type ExecutiveSummaryFormValues = z.infer<typeof executiveSummaryFormSchema>;
