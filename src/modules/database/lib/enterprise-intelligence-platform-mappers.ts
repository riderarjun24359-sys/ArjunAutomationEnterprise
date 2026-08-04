import type { DbEipIntelligenceHub,
    DbEipKpiRegistry,
    DbEipKpiAggregation,
    DbEipKpiCategory,
    DbEipKpiTarget,
    DbEipKpiThreshold,
    DbEipKpiSnapshot,
    DbEipExecutiveDashboard,
    DbEipCrossModuleInsight,
    DbEipBusinessHealthScore,
    DbEipOperationalEfficiencyScore,
    DbEipGrowthScore,
    DbEipStrategicInsight,
    DbEipRevenueForecast,
    DbEipCustomerGrowthForecast,
    DbEipRenewalForecast,
    DbEipCapacityPlanning,
    DbEipOperationalTrend,
    DbEipRiskForecast,
    DbEipDailyExecutiveBrief,
    DbEipWeeklyBusinessSummary,
    DbEipMonthlyPerformanceReport,
    DbEipQuarterlyExecutiveReview,
    DbEipAnnualBusinessReport,
    DbEipKpiServiceConfig,
    DbEipIntelligenceServiceConfig,
    DbEipForecastServiceConfig,
    DbEipIntelligenceMetric,
    DbEipIntelligenceHealth,
    DbEipMissionProgress,
    DbEipIntelligenceFailure,
    DbEipAuditLog } from "@/src/modules/database/types/platform";
import type { CreateIntelligenceHubInput,
    IntelligenceHubSummary,
    CreateKpiRegistryInput,
    KpiRegistrySummary,
    CreateKpiAggregationInput,
    KpiAggregationSummary,
    CreateKpiCategoryInput,
    KpiCategorySummary,
    CreateKpiTargetInput,
    KpiTargetSummary,
    CreateKpiThresholdInput,
    KpiThresholdSummary,
    CreateKpiSnapshotInput,
    KpiSnapshotSummary,
    CreateExecutiveDashboardInput,
    ExecutiveDashboardSummary,
    CreateCrossModuleInsightInput,
    CrossModuleInsightSummary,
    CreateBusinessHealthScoreInput,
    BusinessHealthScoreSummary,
    CreateOperationalEfficiencyScoreInput,
    OperationalEfficiencyScoreSummary,
    CreateGrowthScoreInput,
    GrowthScoreSummary,
    CreateStrategicInsightInput,
    StrategicInsightSummary,
    CreateRevenueForecastInput,
    RevenueForecastSummary,
    CreateCustomerGrowthForecastInput,
    CustomerGrowthForecastSummary,
    CreateRenewalForecastInput,
    RenewalForecastSummary,
    CreateCapacityPlanningInput,
    CapacityPlanningSummary,
    CreateOperationalTrendInput,
    OperationalTrendSummary,
    CreateRiskForecastInput,
    RiskForecastSummary,
    CreateDailyExecutiveBriefInput,
    DailyExecutiveBriefSummary,
    CreateWeeklyBusinessSummaryInput,
    WeeklyBusinessSummarySummary,
    CreateMonthlyPerformanceReportInput,
    MonthlyPerformanceReportSummary,
    CreateQuarterlyExecutiveReviewInput,
    QuarterlyExecutiveReviewSummary,
    CreateAnnualBusinessReportInput,
    AnnualBusinessReportSummary,
    CreateKpiServiceConfigInput,
    KpiServiceConfigSummary,
    CreateIntelligenceServiceConfigInput,
    IntelligenceServiceConfigSummary,
    CreateForecastServiceConfigInput,
    ForecastServiceConfigSummary,
    CreateIntelligenceMetricInput,
    IntelligenceMetricSummary,
    CreateIntelligenceHealthInput,
    IntelligenceHealthSummary,
    CreateMissionProgressInput,
    MissionProgressSummary,
    CreateIntelligenceFailureInput,
    IntelligenceFailureSummary,
    EipDashboardStats,
    EipPipelineInfo,
    AuditEntry } from "@/src/modules/enterprise-intelligence-platform/types";

export function buildIntelligenceHubLookupMaps(hubs: DbEipIntelligenceHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildEipPipelineInfo(): EipPipelineInfo {
    const stages = [
        { key: "kpi_engine", label: "KPI Engine" },
        { key: "executive_intelligence", label: "Executive Intelligence" },
        { key: "predictive_analytics", label: "Predictive Analytics" },
        { key: "enterprise_reporting", label: "Enterprise Reporting" },
        { key: "intelligence_sdk", label: "Intelligence SDK" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "executive_intelligence", nextStage: "predictive_analytics", previousStage: "kpi_engine" };
}

export function buildEipAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbEipAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapIntelligenceHubSummary(record: DbEipIntelligenceHub): IntelligenceHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildIntelligenceHubPayload(organizationId: string, input: CreateIntelligenceHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapKpiRegistrySummary(record: DbEipKpiRegistry, maps?: { hubNameById: Map<string, string> }): KpiRegistrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        kpiKey: record.kpi_key as string,
        kpiName: record.kpi_name as string,
        kpiStatus: record.kpi_status as string,
        status: record.status,
    };
}

export function buildKpiRegistryPayload(organizationId: string, input: CreateKpiRegistryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_status: input.kpiStatus ?? '',
        status: "active",
    };
}

export function mapKpiAggregationSummary(record: DbEipKpiAggregation, maps?: { hubNameById: Map<string, string> }): KpiAggregationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        aggregationKey: record.aggregation_key as string,
        aggregationName: record.aggregation_name as string,
        aggregationType: record.aggregation_type as string,
        status: record.status,
    };
}

export function buildKpiAggregationPayload(organizationId: string, input: CreateKpiAggregationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        aggregation_key: input.aggregationKey ?? '',
        aggregation_name: input.aggregationName ?? '',
        aggregation_type: input.aggregationType ?? '',
        status: "active",
    };
}

export function mapKpiCategorySummary(record: DbEipKpiCategory, maps?: { hubNameById: Map<string, string> }): KpiCategorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        categoryKey: record.category_key as string,
        categoryName: record.category_name as string,
        categoryStatus: record.category_status as string,
        status: record.status,
    };
}

export function buildKpiCategoryPayload(organizationId: string, input: CreateKpiCategoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        category_key: input.categoryKey ?? '',
        category_name: input.categoryName ?? '',
        category_status: input.categoryStatus ?? '',
        status: "active",
    };
}

export function mapKpiTargetSummary(record: DbEipKpiTarget, maps?: { hubNameById: Map<string, string> }): KpiTargetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        targetKey: record.target_key as string,
        targetName: record.target_name as string,
        targetValue: record.target_value as number,
        status: record.status,
    };
}

export function buildKpiTargetPayload(organizationId: string, input: CreateKpiTargetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        target_key: input.targetKey ?? '',
        target_name: input.targetName ?? '',
        target_value: input.targetValue ?? 0,
        status: "active",
    };
}

export function mapKpiThresholdSummary(record: DbEipKpiThreshold, maps?: { hubNameById: Map<string, string> }): KpiThresholdSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        thresholdKey: record.threshold_key as string,
        thresholdName: record.threshold_name as string,
        thresholdValue: record.threshold_value as number,
        status: record.status,
    };
}

export function buildKpiThresholdPayload(organizationId: string, input: CreateKpiThresholdInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        threshold_key: input.thresholdKey ?? '',
        threshold_name: input.thresholdName ?? '',
        threshold_value: input.thresholdValue ?? 0,
        status: "active",
    };
}

export function mapKpiSnapshotSummary(record: DbEipKpiSnapshot, maps?: { hubNameById: Map<string, string> }): KpiSnapshotSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        snapshotKey: record.snapshot_key as string,
        snapshotName: record.snapshot_name as string,
        snapshotValue: record.snapshot_value as number,
        status: record.status,
    };
}

export function buildKpiSnapshotPayload(organizationId: string, input: CreateKpiSnapshotInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        snapshot_key: input.snapshotKey ?? '',
        snapshot_name: input.snapshotName ?? '',
        snapshot_value: input.snapshotValue ?? 0,
        status: "active",
    };
}

export function mapExecutiveDashboardSummary(record: DbEipExecutiveDashboard, maps?: { hubNameById: Map<string, string> }): ExecutiveDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardStatus: record.dashboard_status as string,
        status: record.status,
    };
}

export function buildExecutiveDashboardPayload(organizationId: string, input: CreateExecutiveDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_status: input.dashboardStatus ?? '',
        status: "active",
    };
}

export function mapCrossModuleInsightSummary(record: DbEipCrossModuleInsight, maps?: { hubNameById: Map<string, string> }): CrossModuleInsightSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        insightKey: record.insight_key as string,
        insightTitle: record.insight_title as string,
        insightType: record.insight_type as string,
        status: record.status,
    };
}

export function buildCrossModuleInsightPayload(organizationId: string, input: CreateCrossModuleInsightInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        insight_key: input.insightKey ?? '',
        insight_title: input.insightTitle ?? '',
        insight_type: input.insightType ?? '',
        status: "active",
    };
}

export function mapBusinessHealthScoreSummary(record: DbEipBusinessHealthScore, maps?: { hubNameById: Map<string, string> }): BusinessHealthScoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scoreKey: record.score_key as string,
        scoreName: record.score_name as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildBusinessHealthScorePayload(organizationId: string, input: CreateBusinessHealthScoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        score_key: input.scoreKey ?? '',
        score_name: input.scoreName ?? '',
        health_score: input.healthScore ?? 0,
        status: "active",
    };
}

export function mapOperationalEfficiencyScoreSummary(record: DbEipOperationalEfficiencyScore, maps?: { hubNameById: Map<string, string> }): OperationalEfficiencyScoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scoreKey: record.score_key as string,
        scoreName: record.score_name as string,
        efficiencyScore: record.efficiency_score as number,
        status: record.status,
    };
}

export function buildOperationalEfficiencyScorePayload(organizationId: string, input: CreateOperationalEfficiencyScoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        score_key: input.scoreKey ?? '',
        score_name: input.scoreName ?? '',
        efficiency_score: input.efficiencyScore ?? 0,
        status: "active",
    };
}

export function mapGrowthScoreSummary(record: DbEipGrowthScore, maps?: { hubNameById: Map<string, string> }): GrowthScoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scoreKey: record.score_key as string,
        scoreName: record.score_name as string,
        growthScore: record.growth_score as number,
        status: record.status,
    };
}

export function buildGrowthScorePayload(organizationId: string, input: CreateGrowthScoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        score_key: input.scoreKey ?? '',
        score_name: input.scoreName ?? '',
        growth_score: input.growthScore ?? 0,
        status: "active",
    };
}

export function mapStrategicInsightSummary(record: DbEipStrategicInsight, maps?: { hubNameById: Map<string, string> }): StrategicInsightSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        insightKey: record.insight_key as string,
        insightTitle: record.insight_title as string,
        insightPriority: record.insight_priority as string,
        status: record.status,
    };
}

export function buildStrategicInsightPayload(organizationId: string, input: CreateStrategicInsightInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        insight_key: input.insightKey ?? '',
        insight_title: input.insightTitle ?? '',
        insight_priority: input.insightPriority ?? '',
        status: "active",
    };
}

export function mapRevenueForecastSummary(record: DbEipRevenueForecast, maps?: { hubNameById: Map<string, string> }): RevenueForecastSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        forecastKey: record.forecast_key as string,
        forecastName: record.forecast_name as string,
        forecastTotal: record.forecast_total as number,
        status: record.status,
    };
}

export function buildRevenueForecastPayload(organizationId: string, input: CreateRevenueForecastInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        forecast_key: input.forecastKey ?? '',
        forecast_name: input.forecastName ?? '',
        forecast_total: input.forecastTotal ?? 0,
        status: "active",
    };
}

export function mapCustomerGrowthForecastSummary(record: DbEipCustomerGrowthForecast, maps?: { hubNameById: Map<string, string> }): CustomerGrowthForecastSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        forecastKey: record.forecast_key as string,
        forecastName: record.forecast_name as string,
        growthTotal: record.growth_total as number,
        status: record.status,
    };
}

export function buildCustomerGrowthForecastPayload(organizationId: string, input: CreateCustomerGrowthForecastInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        forecast_key: input.forecastKey ?? '',
        forecast_name: input.forecastName ?? '',
        growth_total: input.growthTotal ?? 0,
        status: "active",
    };
}

export function mapRenewalForecastSummary(record: DbEipRenewalForecast, maps?: { hubNameById: Map<string, string> }): RenewalForecastSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        forecastKey: record.forecast_key as string,
        forecastName: record.forecast_name as string,
        renewalRate: record.renewal_rate as number,
        status: record.status,
    };
}

export function buildRenewalForecastPayload(organizationId: string, input: CreateRenewalForecastInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        forecast_key: input.forecastKey ?? '',
        forecast_name: input.forecastName ?? '',
        renewal_rate: input.renewalRate ?? 0,
        status: "active",
    };
}

export function mapCapacityPlanningSummary(record: DbEipCapacityPlanning, maps?: { hubNameById: Map<string, string> }): CapacityPlanningSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        planKey: record.plan_key as string,
        planName: record.plan_name as string,
        capacityUnits: record.capacity_units as number,
        status: record.status,
    };
}

export function buildCapacityPlanningPayload(organizationId: string, input: CreateCapacityPlanningInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        plan_key: input.planKey ?? '',
        plan_name: input.planName ?? '',
        capacity_units: input.capacityUnits ?? 0,
        status: "active",
    };
}

export function mapOperationalTrendSummary(record: DbEipOperationalTrend, maps?: { hubNameById: Map<string, string> }): OperationalTrendSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trendKey: record.trend_key as string,
        trendName: record.trend_name as string,
        trendDirection: record.trend_direction as string,
        status: record.status,
    };
}

export function buildOperationalTrendPayload(organizationId: string, input: CreateOperationalTrendInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        trend_key: input.trendKey ?? '',
        trend_name: input.trendName ?? '',
        trend_direction: input.trendDirection ?? '',
        status: "active",
    };
}

export function mapRiskForecastSummary(record: DbEipRiskForecast, maps?: { hubNameById: Map<string, string> }): RiskForecastSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        forecastKey: record.forecast_key as string,
        forecastName: record.forecast_name as string,
        riskScore: record.risk_score as number,
        status: record.status,
    };
}

export function buildRiskForecastPayload(organizationId: string, input: CreateRiskForecastInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        forecast_key: input.forecastKey ?? '',
        forecast_name: input.forecastName ?? '',
        risk_score: input.riskScore ?? 0,
        status: "active",
    };
}

export function mapDailyExecutiveBriefSummary(record: DbEipDailyExecutiveBrief, maps?: { hubNameById: Map<string, string> }): DailyExecutiveBriefSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        briefKey: record.brief_key as string,
        briefTitle: record.brief_title as string,
        briefDate: record.brief_date as string,
        status: record.status,
    };
}

export function buildDailyExecutiveBriefPayload(organizationId: string, input: CreateDailyExecutiveBriefInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        brief_key: input.briefKey ?? '',
        brief_title: input.briefTitle ?? '',
        brief_date: input.briefDate ?? '',
        status: "active",
    };
}

export function mapWeeklyBusinessSummarySummary(record: DbEipWeeklyBusinessSummary, maps?: { hubNameById: Map<string, string> }): WeeklyBusinessSummarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        summaryKey: record.summary_key as string,
        summaryTitle: record.summary_title as string,
        summaryWeek: record.summary_week as string,
        status: record.status,
    };
}

export function buildWeeklyBusinessSummaryPayload(organizationId: string, input: CreateWeeklyBusinessSummaryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        summary_key: input.summaryKey ?? '',
        summary_title: input.summaryTitle ?? '',
        summary_week: input.summaryWeek ?? '',
        status: "active",
    };
}

export function mapMonthlyPerformanceReportSummary(record: DbEipMonthlyPerformanceReport, maps?: { hubNameById: Map<string, string> }): MonthlyPerformanceReportSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reportKey: record.report_key as string,
        reportTitle: record.report_title as string,
        reportMonth: record.report_month as string,
        status: record.status,
    };
}

export function buildMonthlyPerformanceReportPayload(organizationId: string, input: CreateMonthlyPerformanceReportInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        report_key: input.reportKey ?? '',
        report_title: input.reportTitle ?? '',
        report_month: input.reportMonth ?? '',
        status: "active",
    };
}

export function mapQuarterlyExecutiveReviewSummary(record: DbEipQuarterlyExecutiveReview, maps?: { hubNameById: Map<string, string> }): QuarterlyExecutiveReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        reviewTitle: record.review_title as string,
        reviewQuarter: record.review_quarter as string,
        status: record.status,
    };
}

export function buildQuarterlyExecutiveReviewPayload(organizationId: string, input: CreateQuarterlyExecutiveReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        review_key: input.reviewKey ?? '',
        review_title: input.reviewTitle ?? '',
        review_quarter: input.reviewQuarter ?? '',
        status: "active",
    };
}

export function mapAnnualBusinessReportSummary(record: DbEipAnnualBusinessReport, maps?: { hubNameById: Map<string, string> }): AnnualBusinessReportSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reportKey: record.report_key as string,
        reportTitle: record.report_title as string,
        reportYear: record.report_year as string,
        status: record.status,
    };
}

export function buildAnnualBusinessReportPayload(organizationId: string, input: CreateAnnualBusinessReportInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        report_key: input.reportKey ?? '',
        report_title: input.reportTitle ?? '',
        report_year: input.reportYear ?? '',
        status: "active",
    };
}

export function mapKpiServiceConfigSummary(record: DbEipKpiServiceConfig, maps?: { hubNameById: Map<string, string> }): KpiServiceConfigSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        configKey: record.config_key as string,
        configName: record.config_name as string,
        configStatus: record.config_status as string,
        status: record.status,
    };
}

export function buildKpiServiceConfigPayload(organizationId: string, input: CreateKpiServiceConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        config_key: input.configKey ?? '',
        config_name: input.configName ?? '',
        config_status: input.configStatus ?? '',
        status: "active",
    };
}

export function mapIntelligenceServiceConfigSummary(record: DbEipIntelligenceServiceConfig, maps?: { hubNameById: Map<string, string> }): IntelligenceServiceConfigSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        configKey: record.config_key as string,
        configName: record.config_name as string,
        configStatus: record.config_status as string,
        status: record.status,
    };
}

export function buildIntelligenceServiceConfigPayload(organizationId: string, input: CreateIntelligenceServiceConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        config_key: input.configKey ?? '',
        config_name: input.configName ?? '',
        config_status: input.configStatus ?? '',
        status: "active",
    };
}

export function mapForecastServiceConfigSummary(record: DbEipForecastServiceConfig, maps?: { hubNameById: Map<string, string> }): ForecastServiceConfigSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        configKey: record.config_key as string,
        configName: record.config_name as string,
        configStatus: record.config_status as string,
        status: record.status,
    };
}

export function buildForecastServiceConfigPayload(organizationId: string, input: CreateForecastServiceConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        config_key: input.configKey ?? '',
        config_name: input.configName ?? '',
        config_status: input.configStatus ?? '',
        status: "active",
    };
}

export function mapIntelligenceMetricSummary(record: DbEipIntelligenceMetric): IntelligenceMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        unifiedKpiScore: record.unified_kpi_score as number,
        overallIntelligenceScore: record.overall_intelligence_score as number,
        status: record.status,
    };
}

export function buildIntelligenceMetricPayload(organizationId: string, input: CreateIntelligenceMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        unified_kpi_score: input.unifiedKpiScore ?? 0,
        overall_intelligence_score: input.overallIntelligenceScore ?? 0,
        status: "active",
    };
}

export function mapIntelligenceHealthSummary(record: DbEipIntelligenceHealth): IntelligenceHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildIntelligenceHealthPayload(organizationId: string, input: CreateIntelligenceHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapMissionProgressSummary(record: DbEipMissionProgress, maps?: { hubNameById: Map<string, string> }): MissionProgressSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        progressKey: record.progress_key as string,
        progressName: record.progress_name as string,
        progressPercent: record.progress_percent as number,
        status: record.status,
    };
}

export function buildMissionProgressPayload(organizationId: string, input: CreateMissionProgressInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        progress_key: input.progressKey ?? '',
        progress_name: input.progressName ?? '',
        progress_percent: input.progressPercent ?? 0,
        status: "active",
    };
}

export function mapIntelligenceFailureSummary(record: DbEipIntelligenceFailure, maps?: { hubNameById: Map<string, string> }): IntelligenceFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildIntelligenceFailurePayload(organizationId: string, input: CreateIntelligenceFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapKpiRegistryForStats(r: DbEipKpiRegistry) { return { kpi_status: r.kpi_status, status: r.status }; }
export function mapExecutiveDashboardForStats(r: DbEipExecutiveDashboard) { return { dashboard_status: r.dashboard_status, status: r.status }; }
export function mapRevenueForecastForStats(r: DbEipRevenueForecast) { return { forecast_total: r.forecast_total, status: r.status }; }
export function mapCrossModuleInsightForStats(r: DbEipCrossModuleInsight) { return { insight_type: r.insight_type, status: r.status }; }
export function mapIntelligenceMetricForStats(r: DbEipIntelligenceMetric) {
    return {
        unified_kpi_score: r.unified_kpi_score,
        business_health_score: r.business_health_score,
        operational_efficiency_score: r.operational_efficiency_score,
        growth_score: r.growth_score,
        revenue_forecast_total: r.revenue_forecast_total,
        customer_forecast_total: r.customer_forecast_total,
        risk_score: r.risk_score,
        overall_intelligence_score: r.overall_intelligence_score,
        status: r.status,
    };
}
export function mapIntelligenceHealthForStats(r: DbEipIntelligenceHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapIntelligenceFailureForStats(r: DbEipIntelligenceFailure) { return { status: r.status }; }

export function buildEipDashboardStats(input: {
    intelligenceHubs: IntelligenceHubSummary[];
    kpiRegistry: ReturnType<typeof mapKpiRegistryForStats>[];
    executiveDashboards: ReturnType<typeof mapExecutiveDashboardForStats>[];
    revenueForecasts: ReturnType<typeof mapRevenueForecastForStats>[];
    crossModuleInsights: ReturnType<typeof mapCrossModuleInsightForStats>[];
    intelligenceMetrics: ReturnType<typeof mapIntelligenceMetricForStats>[];
    intelligenceHealth: ReturnType<typeof mapIntelligenceHealthForStats>[];
    intelligenceFailures: IntelligenceFailureSummary[];
    auditLogs: AuditEntry[];
}): EipDashboardStats {
    const activeHubs = input.intelligenceHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.intelligenceMetrics[0];
    const latestHealth = input.intelligenceHealth[0];
    return {
        totalIntelligenceHubs: input.intelligenceHubs.length,
        activeIntelligenceHubs: activeHubs,
        kpiRegistryCount: input.kpiRegistry.length,
        executiveDashboardCount: input.executiveDashboards.length,
        revenueForecastCount: input.revenueForecasts.length,
        crossModuleInsightCount: input.crossModuleInsights.length,
        strategicInsightCount: 0,
        openIntelligenceFailureCount: input.intelligenceFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallIntelligenceScore: latestMetrics?.overall_intelligence_score ?? latestHealth?.overall_score ?? 0,
        unifiedKpiScore: latestMetrics?.unified_kpi_score ?? 0,
        businessHealthScore: latestMetrics?.business_health_score ?? 0,
        operationalEfficiencyScore: latestMetrics?.operational_efficiency_score ?? 0,
        growthScore: latestMetrics?.growth_score ?? 0,
        revenueForecastTotal: latestMetrics?.revenue_forecast_total ?? 0,
        customerForecastTotal: latestMetrics?.customer_forecast_total ?? 0,
        riskScore: latestMetrics?.risk_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
