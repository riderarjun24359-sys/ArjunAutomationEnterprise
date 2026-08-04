export interface EipDashboardStats {
    totalIntelligenceHubs: number;
    activeIntelligenceHubs: number;
    kpiRegistryCount: number;
    executiveDashboardCount: number;
    revenueForecastCount: number;
    crossModuleInsightCount: number;
    strategicInsightCount: number;
    openIntelligenceFailureCount: number;
    overallIntelligenceScore: number;
    unifiedKpiScore: number;
    businessHealthScore: number;
    operationalEfficiencyScore: number;
    growthScore: number;
    revenueForecastTotal: number;
    customerForecastTotal: number;
    riskScore: number;
    auditCount: number;
}

export interface EipPipelineInfo {
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

export interface EipSdkRunKpiServiceInput { intelligenceHubId: string; kpiKey?: string; kpiName?: string; }
export interface EipSdkRunKpiServiceResult { kpiId: string; kpiKey: string; status: string; }
export interface EipSdkRunIntelligenceServiceInput { intelligenceHubId: string; dashboardKey?: string; dashboardName?: string; }
export interface EipSdkRunIntelligenceServiceResult { dashboardId: string; dashboardKey: string; status: string; }
export interface EipSdkRunForecastServiceInput { intelligenceHubId: string; insightKey?: string; insightTitle?: string; }
export interface EipSdkRunForecastServiceResult { insightId: string; insightKey: string; status: string; }
export interface EipSdkRunReportingServiceInput { intelligenceHubId: string; briefKey?: string; briefTitle?: string; }
export interface EipSdkRunReportingServiceResult { briefId: string; briefKey: string; status: string; }
export interface EipSdkRunExecutiveInsightServiceInput { intelligenceHubId: string; insightKey?: string; insightTitle?: string; }
export interface EipSdkRunExecutiveInsightServiceResult { insightId: string; insightKey: string; status: string; }

export interface IntelligenceHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateIntelligenceHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface KpiRegistrySummary {
    id: string;
    hubName?: string;
        kpiKey: string;
    kpiName: string;
    kpiStatus: string;
    status: string;
}

export interface CreateKpiRegistryInput {
        intelligenceHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiStatus?: string;
}

export interface KpiAggregationSummary {
    id: string;
    hubName?: string;
        aggregationKey: string;
    aggregationName: string;
    aggregationType: string;
    status: string;
}

export interface CreateKpiAggregationInput {
        intelligenceHubId: string;
        aggregationKey?: string;
    aggregationName?: string;
    aggregationType?: string;
}

export interface KpiCategorySummary {
    id: string;
    hubName?: string;
        categoryKey: string;
    categoryName: string;
    categoryStatus: string;
    status: string;
}

export interface CreateKpiCategoryInput {
        intelligenceHubId: string;
        categoryKey?: string;
    categoryName?: string;
    categoryStatus?: string;
}

export interface KpiTargetSummary {
    id: string;
    hubName?: string;
        targetKey: string;
    targetName: string;
    targetValue: number;
    status: string;
}

export interface CreateKpiTargetInput {
        intelligenceHubId: string;
        targetKey?: string;
    targetName?: string;
    targetValue?: number;
}

export interface KpiThresholdSummary {
    id: string;
    hubName?: string;
        thresholdKey: string;
    thresholdName: string;
    thresholdValue: number;
    status: string;
}

export interface CreateKpiThresholdInput {
        intelligenceHubId: string;
        thresholdKey?: string;
    thresholdName?: string;
    thresholdValue?: number;
}

export interface KpiSnapshotSummary {
    id: string;
    hubName?: string;
        snapshotKey: string;
    snapshotName: string;
    snapshotValue: number;
    status: string;
}

export interface CreateKpiSnapshotInput {
        intelligenceHubId: string;
        snapshotKey?: string;
    snapshotName?: string;
    snapshotValue?: number;
}

export interface ExecutiveDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardStatus: string;
    status: string;
}

export interface CreateExecutiveDashboardInput {
        intelligenceHubId: string;
        dashboardKey?: string;
    dashboardName?: string;
    dashboardStatus?: string;
}

export interface CrossModuleInsightSummary {
    id: string;
    hubName?: string;
        insightKey: string;
    insightTitle: string;
    insightType: string;
    status: string;
}

export interface CreateCrossModuleInsightInput {
        intelligenceHubId: string;
        insightKey?: string;
    insightTitle?: string;
    insightType?: string;
}

export interface BusinessHealthScoreSummary {
    id: string;
    hubName?: string;
        scoreKey: string;
    scoreName: string;
    healthScore: number;
    status: string;
}

export interface CreateBusinessHealthScoreInput {
        intelligenceHubId: string;
        scoreKey?: string;
    scoreName?: string;
    healthScore?: number;
}

export interface OperationalEfficiencyScoreSummary {
    id: string;
    hubName?: string;
        scoreKey: string;
    scoreName: string;
    efficiencyScore: number;
    status: string;
}

export interface CreateOperationalEfficiencyScoreInput {
        intelligenceHubId: string;
        scoreKey?: string;
    scoreName?: string;
    efficiencyScore?: number;
}

export interface GrowthScoreSummary {
    id: string;
    hubName?: string;
        scoreKey: string;
    scoreName: string;
    growthScore: number;
    status: string;
}

export interface CreateGrowthScoreInput {
        intelligenceHubId: string;
        scoreKey?: string;
    scoreName?: string;
    growthScore?: number;
}

export interface StrategicInsightSummary {
    id: string;
    hubName?: string;
        insightKey: string;
    insightTitle: string;
    insightPriority: string;
    status: string;
}

export interface CreateStrategicInsightInput {
        intelligenceHubId: string;
        insightKey?: string;
    insightTitle?: string;
    insightPriority?: string;
}

export interface RevenueForecastSummary {
    id: string;
    hubName?: string;
        forecastKey: string;
    forecastName: string;
    forecastTotal: number;
    status: string;
}

export interface CreateRevenueForecastInput {
        intelligenceHubId: string;
        forecastKey?: string;
    forecastName?: string;
    forecastTotal?: number;
}

export interface CustomerGrowthForecastSummary {
    id: string;
    hubName?: string;
        forecastKey: string;
    forecastName: string;
    growthTotal: number;
    status: string;
}

export interface CreateCustomerGrowthForecastInput {
        intelligenceHubId: string;
        forecastKey?: string;
    forecastName?: string;
    growthTotal?: number;
}

export interface RenewalForecastSummary {
    id: string;
    hubName?: string;
        forecastKey: string;
    forecastName: string;
    renewalRate: number;
    status: string;
}

export interface CreateRenewalForecastInput {
        intelligenceHubId: string;
        forecastKey?: string;
    forecastName?: string;
    renewalRate?: number;
}

export interface CapacityPlanningSummary {
    id: string;
    hubName?: string;
        planKey: string;
    planName: string;
    capacityUnits: number;
    status: string;
}

export interface CreateCapacityPlanningInput {
        intelligenceHubId: string;
        planKey?: string;
    planName?: string;
    capacityUnits?: number;
}

export interface OperationalTrendSummary {
    id: string;
    hubName?: string;
        trendKey: string;
    trendName: string;
    trendDirection: string;
    status: string;
}

export interface CreateOperationalTrendInput {
        intelligenceHubId: string;
        trendKey?: string;
    trendName?: string;
    trendDirection?: string;
}

export interface RiskForecastSummary {
    id: string;
    hubName?: string;
        forecastKey: string;
    forecastName: string;
    riskScore: number;
    status: string;
}

export interface CreateRiskForecastInput {
        intelligenceHubId: string;
        forecastKey?: string;
    forecastName?: string;
    riskScore?: number;
}

export interface DailyExecutiveBriefSummary {
    id: string;
    hubName?: string;
        briefKey: string;
    briefTitle: string;
    briefDate: string;
    status: string;
}

export interface CreateDailyExecutiveBriefInput {
        intelligenceHubId: string;
        briefKey?: string;
    briefTitle?: string;
    briefDate?: string;
}

export interface WeeklyBusinessSummarySummary {
    id: string;
    hubName?: string;
        summaryKey: string;
    summaryTitle: string;
    summaryWeek: string;
    status: string;
}

export interface CreateWeeklyBusinessSummaryInput {
        intelligenceHubId: string;
        summaryKey?: string;
    summaryTitle?: string;
    summaryWeek?: string;
}

export interface MonthlyPerformanceReportSummary {
    id: string;
    hubName?: string;
        reportKey: string;
    reportTitle: string;
    reportMonth: string;
    status: string;
}

export interface CreateMonthlyPerformanceReportInput {
        intelligenceHubId: string;
        reportKey?: string;
    reportTitle?: string;
    reportMonth?: string;
}

export interface QuarterlyExecutiveReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    reviewTitle: string;
    reviewQuarter: string;
    status: string;
}

export interface CreateQuarterlyExecutiveReviewInput {
        intelligenceHubId: string;
        reviewKey?: string;
    reviewTitle?: string;
    reviewQuarter?: string;
}

export interface AnnualBusinessReportSummary {
    id: string;
    hubName?: string;
        reportKey: string;
    reportTitle: string;
    reportYear: string;
    status: string;
}

export interface CreateAnnualBusinessReportInput {
        intelligenceHubId: string;
        reportKey?: string;
    reportTitle?: string;
    reportYear?: string;
}

export interface KpiServiceConfigSummary {
    id: string;
    hubName?: string;
        configKey: string;
    configName: string;
    configStatus: string;
    status: string;
}

export interface CreateKpiServiceConfigInput {
        intelligenceHubId: string;
        configKey?: string;
    configName?: string;
    configStatus?: string;
}

export interface IntelligenceServiceConfigSummary {
    id: string;
    hubName?: string;
        configKey: string;
    configName: string;
    configStatus: string;
    status: string;
}

export interface CreateIntelligenceServiceConfigInput {
        intelligenceHubId: string;
        configKey?: string;
    configName?: string;
    configStatus?: string;
}

export interface ForecastServiceConfigSummary {
    id: string;
    hubName?: string;
        configKey: string;
    configName: string;
    configStatus: string;
    status: string;
}

export interface CreateForecastServiceConfigInput {
        intelligenceHubId: string;
        configKey?: string;
    configName?: string;
    configStatus?: string;
}

export interface IntelligenceMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    unifiedKpiScore: number;
    overallIntelligenceScore: number;
    status: string;
}

export interface CreateIntelligenceMetricInput {
        metricsKey?: string;
    unifiedKpiScore?: number;
    overallIntelligenceScore?: number;
}

export interface IntelligenceHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateIntelligenceHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface MissionProgressSummary {
    id: string;
    hubName?: string;
        progressKey: string;
    progressName: string;
    progressPercent: number;
    status: string;
}

export interface CreateMissionProgressInput {
        intelligenceHubId: string;
        progressKey?: string;
    progressName?: string;
    progressPercent?: number;
}

export interface IntelligenceFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateIntelligenceFailureInput {
        intelligenceHubId: string;
        failureKey?: string;
    failureType?: string;
}

