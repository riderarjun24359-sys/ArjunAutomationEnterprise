import { z } from "zod";

export const intelligenceHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type intelligenceHubsFormValues = z.infer<typeof intelligenceHubsFormSchema>;

export const dailyExecutiveBriefsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    briefKey: z.string().min(1).optional(),
    briefDate: z.string().min(1).optional(),
    aiConfidenceScore: z.number().optional(),
});

export type dailyExecutiveBriefsFormValues = z.infer<typeof dailyExecutiveBriefsFormSchema>;

export const weeklyBusinessReviewsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    weekStart: z.string().min(1).optional(),
    aiConfidenceScore: z.number().optional(),
});

export type weeklyBusinessReviewsFormValues = z.infer<typeof weeklyBusinessReviewsFormSchema>;

export const monthlyExecutiveSummariesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    summaryKey: z.string().min(1).optional(),
    monthStart: z.string().min(1).optional(),
    aiConfidenceScore: z.number().optional(),
});

export type monthlyExecutiveSummariesFormValues = z.infer<typeof monthlyExecutiveSummariesFormSchema>;

export const trialConversionScoresFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    scoreKey: z.string().min(1).optional(),
    conversionRate: z.number().optional(),
    aiConfidenceScore: z.number().optional(),
});

export type trialConversionScoresFormValues = z.infer<typeof trialConversionScoresFormSchema>;

export const renewalProbabilitiesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    probabilityKey: z.string().min(1).optional(),
    renewalProbability: z.number().optional(),
    aiConfidenceScore: z.number().optional(),
});

export type renewalProbabilitiesFormValues = z.infer<typeof renewalProbabilitiesFormSchema>;

export const churnRisksFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    riskKey: z.string().min(1).optional(),
    churnScore: z.number().optional(),
    riskLevel: z.string().min(1).optional(),
});

export type churnRisksFormValues = z.infer<typeof churnRisksFormSchema>;

export const expansionOpportunitiesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    opportunityKey: z.string().min(1).optional(),
    expansionScore: z.number().optional(),
    aiConfidenceScore: z.number().optional(),
});

export type expansionOpportunitiesFormValues = z.infer<typeof expansionOpportunitiesFormSchema>;

export const mrrTrendsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    trendKey: z.string().min(1).optional(),
    mrrAmount: z.number().optional(),
    trendDirection: z.string().min(1).optional(),
});

export type mrrTrendsFormValues = z.infer<typeof mrrTrendsFormSchema>;

export const arrTrendsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    trendKey: z.string().min(1).optional(),
    arrAmount: z.number().optional(),
    trendDirection: z.string().min(1).optional(),
});

export type arrTrendsFormValues = z.infer<typeof arrTrendsFormSchema>;

export const revenueGrowthMetricsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    metricsKey: z.string().min(1).optional(),
    growthRate: z.number().optional(),
    aiConfidenceScore: z.number().optional(),
});

export type revenueGrowthMetricsFormValues = z.infer<typeof revenueGrowthMetricsFormSchema>;

export const revenueRisksFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    riskKey: z.string().min(1).optional(),
    riskAmount: z.number().optional(),
    riskLevel: z.string().min(1).optional(),
});

export type revenueRisksFormValues = z.infer<typeof revenueRisksFormSchema>;

export const platformHealthIntelFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    intelKey: z.string().min(1).optional(),
    healthScore: z.number().optional(),
    aiConfidenceScore: z.number().optional(),
});

export type platformHealthIntelFormValues = z.infer<typeof platformHealthIntelFormSchema>;

export const queueHealthIntelFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    intelKey: z.string().min(1).optional(),
    queueDepth: z.number().optional(),
    healthScore: z.number().optional(),
});

export type queueHealthIntelFormValues = z.infer<typeof queueHealthIntelFormSchema>;

export const integrationHealthIntelFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    intelKey: z.string().min(1).optional(),
    integrationName: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type integrationHealthIntelFormValues = z.infer<typeof integrationHealthIntelFormSchema>;

export const performanceTrendsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    trendKey: z.string().min(1).optional(),
    performanceScore: z.number().optional(),
    trendDirection: z.string().min(1).optional(),
});

export type performanceTrendsFormValues = z.infer<typeof performanceTrendsFormSchema>;

export const unusualLoginActivityFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    activityKey: z.string().min(1).optional(),
    loginCount: z.number().optional(),
    riskLevel: z.string().min(1).optional(),
});

export type unusualLoginActivityFormValues = z.infer<typeof unusualLoginActivityFormSchema>;

export const permissionRisksFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    riskKey: z.string().min(1).optional(),
    riskType: z.string().min(1).optional(),
    riskLevel: z.string().min(1).optional(),
});

export type permissionRisksFormValues = z.infer<typeof permissionRisksFormSchema>;

export const tenantSecurityTrendsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    trendKey: z.string().min(1).optional(),
    securityScore: z.number().optional(),
    trendDirection: z.string().min(1).optional(),
});

export type tenantSecurityTrendsFormValues = z.infer<typeof tenantSecurityTrendsFormSchema>;

export const complianceWarningsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    warningKey: z.string().min(1).optional(),
    complianceType: z.string().min(1).optional(),
    severity: z.string().min(1).optional(),
});

export type complianceWarningsFormValues = z.infer<typeof complianceWarningsFormSchema>;

export const todayPrioritiesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    priorityKey: z.string().min(1).optional(),
    priorityTitle: z.string().min(1).optional(),
    priorityRank: z.number().optional(),
});

export type todayPrioritiesFormValues = z.infer<typeof todayPrioritiesFormSchema>;

export const recommendedActionsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    actionKey: z.string().min(1).optional(),
    actionTitle: z.string().min(1).optional(),
    actionType: z.string().min(1).optional(),
});

export type recommendedActionsFormValues = z.infer<typeof recommendedActionsFormSchema>;

export const businessRisksFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    riskKey: z.string().min(1).optional(),
    riskTitle: z.string().min(1).optional(),
    riskLevel: z.string().min(1).optional(),
});

export type businessRisksFormValues = z.infer<typeof businessRisksFormSchema>;

export const growthOpportunitiesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    opportunityKey: z.string().min(1).optional(),
    opportunityTitle: z.string().min(1).optional(),
    growthScore: z.number().optional(),
});

export type growthOpportunitiesFormValues = z.infer<typeof growthOpportunitiesFormSchema>;

export const knowledgeReasoningSessionsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    sessionKey: z.string().min(1).optional(),
    reasoningType: z.string().min(1).optional(),
    aiConfidenceScore: z.number().optional(),
});

export type knowledgeReasoningSessionsFormValues = z.infer<typeof knowledgeReasoningSessionsFormSchema>;

export const evidenceTracesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    traceKey: z.string().min(1).optional(),
    sourceModule: z.string().min(1).optional(),
    traceSummary: z.string().min(1).optional(),
});

export type evidenceTracesFormValues = z.infer<typeof evidenceTracesFormSchema>;

export const orchestrationLinksFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    linkKey: z.string().min(1).optional(),
    linkType: z.string().min(1).optional(),
    targetRef: z.string().min(1).optional(),
});

export type orchestrationLinksFormValues = z.infer<typeof orchestrationLinksFormSchema>;

export const recommendationOutputsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    outputKey: z.string().min(1).optional(),
    recommendationText: z.string().min(1).optional(),
    aiConfidenceScore: z.number().optional(),
});

export type recommendationOutputsFormValues = z.infer<typeof recommendationOutputsFormSchema>;

export const executiveMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    businessScore: z.number().optional(),
    growthScore: z.number().optional(),
});

export type executiveMetricsFormValues = z.infer<typeof executiveMetricsFormSchema>;

export const executiveHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type executiveHealthFormValues = z.infer<typeof executiveHealthFormSchema>;

export const executiveFailuresFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type executiveFailuresFormValues = z.infer<typeof executiveFailuresFormSchema>;
