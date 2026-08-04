import type {
    DbEipIntelligenceHub,
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
    DbEipAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgEipRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class EipIntelligenceHubRepository extends OrgEipRepository<DbEipIntelligenceHub> { protected table = "eip_intelligence_hubs"; }
export class EipKpiRegistryRepository extends OrgEipRepository<DbEipKpiRegistry> { protected table = "eip_kpi_registry"; }
export class EipKpiAggregationRepository extends OrgEipRepository<DbEipKpiAggregation> { protected table = "eip_kpi_aggregations"; }
export class EipKpiCategoryRepository extends OrgEipRepository<DbEipKpiCategory> { protected table = "eip_kpi_categories"; }
export class EipKpiTargetRepository extends OrgEipRepository<DbEipKpiTarget> { protected table = "eip_kpi_targets"; }
export class EipKpiThresholdRepository extends OrgEipRepository<DbEipKpiThreshold> { protected table = "eip_kpi_thresholds"; }
export class EipKpiSnapshotRepository extends OrgEipRepository<DbEipKpiSnapshot> { protected table = "eip_kpi_snapshots"; }
export class EipExecutiveDashboardRepository extends OrgEipRepository<DbEipExecutiveDashboard> { protected table = "eip_executive_dashboards"; }
export class EipCrossModuleInsightRepository extends OrgEipRepository<DbEipCrossModuleInsight> { protected table = "eip_cross_module_insights"; }
export class EipBusinessHealthScoreRepository extends OrgEipRepository<DbEipBusinessHealthScore> { protected table = "eip_business_health_scores"; }
export class EipOperationalEfficiencyScoreRepository extends OrgEipRepository<DbEipOperationalEfficiencyScore> { protected table = "eip_operational_efficiency_scores"; }
export class EipGrowthScoreRepository extends OrgEipRepository<DbEipGrowthScore> { protected table = "eip_growth_scores"; }
export class EipStrategicInsightRepository extends OrgEipRepository<DbEipStrategicInsight> { protected table = "eip_strategic_insights"; }
export class EipRevenueForecastRepository extends OrgEipRepository<DbEipRevenueForecast> { protected table = "eip_revenue_forecasts"; }
export class EipCustomerGrowthForecastRepository extends OrgEipRepository<DbEipCustomerGrowthForecast> { protected table = "eip_customer_growth_forecasts"; }
export class EipRenewalForecastRepository extends OrgEipRepository<DbEipRenewalForecast> { protected table = "eip_renewal_forecasts"; }
export class EipCapacityPlanningRepository extends OrgEipRepository<DbEipCapacityPlanning> { protected table = "eip_capacity_planning"; }
export class EipOperationalTrendRepository extends OrgEipRepository<DbEipOperationalTrend> { protected table = "eip_operational_trends"; }
export class EipRiskForecastRepository extends OrgEipRepository<DbEipRiskForecast> { protected table = "eip_risk_forecasts"; }
export class EipDailyExecutiveBriefRepository extends OrgEipRepository<DbEipDailyExecutiveBrief> { protected table = "eip_daily_executive_briefs"; }
export class EipWeeklyBusinessSummaryRepository extends OrgEipRepository<DbEipWeeklyBusinessSummary> { protected table = "eip_weekly_business_summaries"; }
export class EipMonthlyPerformanceReportRepository extends OrgEipRepository<DbEipMonthlyPerformanceReport> { protected table = "eip_monthly_performance_reports"; }
export class EipQuarterlyExecutiveReviewRepository extends OrgEipRepository<DbEipQuarterlyExecutiveReview> { protected table = "eip_quarterly_executive_reviews"; }
export class EipAnnualBusinessReportRepository extends OrgEipRepository<DbEipAnnualBusinessReport> { protected table = "eip_annual_business_reports"; }
export class EipKpiServiceConfigRepository extends OrgEipRepository<DbEipKpiServiceConfig> { protected table = "eip_kpi_service_configs"; }
export class EipIntelligenceServiceConfigRepository extends OrgEipRepository<DbEipIntelligenceServiceConfig> { protected table = "eip_intelligence_service_configs"; }
export class EipForecastServiceConfigRepository extends OrgEipRepository<DbEipForecastServiceConfig> { protected table = "eip_forecast_service_configs"; }
export class EipIntelligenceMetricRepository extends OrgEipRepository<DbEipIntelligenceMetric> { protected table = "eip_intelligence_metrics"; }
export class EipIntelligenceHealthRepository extends OrgEipRepository<DbEipIntelligenceHealth> { protected table = "eip_intelligence_health"; }
export class EipMissionProgressRepository extends OrgEipRepository<DbEipMissionProgress> { protected table = "eip_mission_progress"; }
export class EipIntelligenceFailureRepository extends OrgEipRepository<DbEipIntelligenceFailure> { protected table = "eip_intelligence_failures"; }
export class EipAuditLogRepository extends OrgEipRepository<DbEipAuditLog> { protected table = "eip_audit_logs"; }
