import { z } from "zod";

export const intelligenceHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type intelligenceHubsFormValues = z.infer<typeof intelligenceHubsFormSchema>;

export const kpiRegistryFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiStatus: z.string().min(1).optional(),
});

export type kpiRegistryFormValues = z.infer<typeof kpiRegistryFormSchema>;

export const kpiAggregationsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    aggregationKey: z.string().min(1).optional(),
    aggregationName: z.string().min(1).optional(),
    aggregationType: z.string().min(1).optional(),
});

export type kpiAggregationsFormValues = z.infer<typeof kpiAggregationsFormSchema>;

export const kpiCategoriesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    categoryKey: z.string().min(1).optional(),
    categoryName: z.string().min(1).optional(),
    categoryStatus: z.string().min(1).optional(),
});

export type kpiCategoriesFormValues = z.infer<typeof kpiCategoriesFormSchema>;

export const kpiTargetsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    targetKey: z.string().min(1).optional(),
    targetName: z.string().min(1).optional(),
    targetValue: z.number().optional(),
});

export type kpiTargetsFormValues = z.infer<typeof kpiTargetsFormSchema>;

export const kpiThresholdsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    thresholdKey: z.string().min(1).optional(),
    thresholdName: z.string().min(1).optional(),
    thresholdValue: z.number().optional(),
});

export type kpiThresholdsFormValues = z.infer<typeof kpiThresholdsFormSchema>;

export const kpiSnapshotsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    snapshotKey: z.string().min(1).optional(),
    snapshotName: z.string().min(1).optional(),
    snapshotValue: z.number().optional(),
});

export type kpiSnapshotsFormValues = z.infer<typeof kpiSnapshotsFormSchema>;

export const executiveDashboardsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardStatus: z.string().min(1).optional(),
});

export type executiveDashboardsFormValues = z.infer<typeof executiveDashboardsFormSchema>;

export const crossModuleInsightsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    insightKey: z.string().min(1).optional(),
    insightTitle: z.string().min(1).optional(),
    insightType: z.string().min(1).optional(),
});

export type crossModuleInsightsFormValues = z.infer<typeof crossModuleInsightsFormSchema>;

export const businessHealthScoresFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    scoreKey: z.string().min(1).optional(),
    scoreName: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type businessHealthScoresFormValues = z.infer<typeof businessHealthScoresFormSchema>;

export const operationalEfficiencyScoresFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    scoreKey: z.string().min(1).optional(),
    scoreName: z.string().min(1).optional(),
    efficiencyScore: z.number().optional(),
});

export type operationalEfficiencyScoresFormValues = z.infer<typeof operationalEfficiencyScoresFormSchema>;

export const growthScoresFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    scoreKey: z.string().min(1).optional(),
    scoreName: z.string().min(1).optional(),
    growthScore: z.number().optional(),
});

export type growthScoresFormValues = z.infer<typeof growthScoresFormSchema>;

export const strategicInsightsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    insightKey: z.string().min(1).optional(),
    insightTitle: z.string().min(1).optional(),
    insightPriority: z.string().min(1).optional(),
});

export type strategicInsightsFormValues = z.infer<typeof strategicInsightsFormSchema>;

export const revenueForecastsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    forecastKey: z.string().min(1).optional(),
    forecastName: z.string().min(1).optional(),
    forecastTotal: z.number().optional(),
});

export type revenueForecastsFormValues = z.infer<typeof revenueForecastsFormSchema>;

export const customerGrowthForecastsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    forecastKey: z.string().min(1).optional(),
    forecastName: z.string().min(1).optional(),
    growthTotal: z.number().optional(),
});

export type customerGrowthForecastsFormValues = z.infer<typeof customerGrowthForecastsFormSchema>;

export const renewalForecastsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    forecastKey: z.string().min(1).optional(),
    forecastName: z.string().min(1).optional(),
    renewalRate: z.number().optional(),
});

export type renewalForecastsFormValues = z.infer<typeof renewalForecastsFormSchema>;

export const capacityPlanningFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    planKey: z.string().min(1).optional(),
    planName: z.string().min(1).optional(),
    capacityUnits: z.number().optional(),
});

export type capacityPlanningFormValues = z.infer<typeof capacityPlanningFormSchema>;

export const operationalTrendsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    trendKey: z.string().min(1).optional(),
    trendName: z.string().min(1).optional(),
    trendDirection: z.string().min(1).optional(),
});

export type operationalTrendsFormValues = z.infer<typeof operationalTrendsFormSchema>;

export const riskForecastsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    forecastKey: z.string().min(1).optional(),
    forecastName: z.string().min(1).optional(),
    riskScore: z.number().optional(),
});

export type riskForecastsFormValues = z.infer<typeof riskForecastsFormSchema>;

export const dailyExecutiveBriefsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    briefKey: z.string().min(1).optional(),
    briefTitle: z.string().min(1).optional(),
    briefDate: z.string().min(1).optional(),
});

export type dailyExecutiveBriefsFormValues = z.infer<typeof dailyExecutiveBriefsFormSchema>;

export const weeklyBusinessSummariesFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    summaryKey: z.string().min(1).optional(),
    summaryTitle: z.string().min(1).optional(),
    summaryWeek: z.string().min(1).optional(),
});

export type weeklyBusinessSummariesFormValues = z.infer<typeof weeklyBusinessSummariesFormSchema>;

export const monthlyPerformanceReportsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    reportKey: z.string().min(1).optional(),
    reportTitle: z.string().min(1).optional(),
    reportMonth: z.string().min(1).optional(),
});

export type monthlyPerformanceReportsFormValues = z.infer<typeof monthlyPerformanceReportsFormSchema>;

export const quarterlyExecutiveReviewsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    reviewTitle: z.string().min(1).optional(),
    reviewQuarter: z.string().min(1).optional(),
});

export type quarterlyExecutiveReviewsFormValues = z.infer<typeof quarterlyExecutiveReviewsFormSchema>;

export const annualBusinessReportsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    reportKey: z.string().min(1).optional(),
    reportTitle: z.string().min(1).optional(),
    reportYear: z.string().min(1).optional(),
});

export type annualBusinessReportsFormValues = z.infer<typeof annualBusinessReportsFormSchema>;

export const kpiServiceConfigsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configName: z.string().min(1).optional(),
    configStatus: z.string().min(1).optional(),
});

export type kpiServiceConfigsFormValues = z.infer<typeof kpiServiceConfigsFormSchema>;

export const intelligenceServiceConfigsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configName: z.string().min(1).optional(),
    configStatus: z.string().min(1).optional(),
});

export type intelligenceServiceConfigsFormValues = z.infer<typeof intelligenceServiceConfigsFormSchema>;

export const forecastServiceConfigsFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configName: z.string().min(1).optional(),
    configStatus: z.string().min(1).optional(),
});

export type forecastServiceConfigsFormValues = z.infer<typeof forecastServiceConfigsFormSchema>;

export const intelligenceMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    unifiedKpiScore: z.number().optional(),
    overallIntelligenceScore: z.number().optional(),
});

export type intelligenceMetricsFormValues = z.infer<typeof intelligenceMetricsFormSchema>;

export const intelligenceHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type intelligenceHealthFormValues = z.infer<typeof intelligenceHealthFormSchema>;

export const missionProgressFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    progressKey: z.string().min(1).optional(),
    progressName: z.string().min(1).optional(),
    progressPercent: z.number().optional(),
});

export type missionProgressFormValues = z.infer<typeof missionProgressFormSchema>;

export const intelligenceFailuresFormSchema = z.object({
    intelligenceHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type intelligenceFailuresFormValues = z.infer<typeof intelligenceFailuresFormSchema>;
