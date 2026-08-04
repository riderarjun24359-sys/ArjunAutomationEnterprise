#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("EipIntelligenceHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/customer-operated-platform-repositories";';
    const copImportEnd = da.indexOf(anchor) + anchor.length;
    const eipImport = `
import {
    EipIntelligenceHubRepository,
    EipKpiRegistryRepository,
    EipKpiAggregationRepository,
    EipKpiCategoryRepository,
    EipKpiTargetRepository,
    EipKpiThresholdRepository,
    EipKpiSnapshotRepository,
    EipExecutiveDashboardRepository,
    EipCrossModuleInsightRepository,
    EipBusinessHealthScoreRepository,
    EipOperationalEfficiencyScoreRepository,
    EipGrowthScoreRepository,
    EipStrategicInsightRepository,
    EipRevenueForecastRepository,
    EipCustomerGrowthForecastRepository,
    EipRenewalForecastRepository,
    EipCapacityPlanningRepository,
    EipOperationalTrendRepository,
    EipRiskForecastRepository,
    EipDailyExecutiveBriefRepository,
    EipWeeklyBusinessSummaryRepository,
    EipMonthlyPerformanceReportRepository,
    EipQuarterlyExecutiveReviewRepository,
    EipAnnualBusinessReportRepository,
    EipKpiServiceConfigRepository,
    EipIntelligenceServiceConfigRepository,
    EipForecastServiceConfigRepository,
    EipIntelligenceMetricRepository,
    EipIntelligenceHealthRepository,
    EipMissionProgressRepository,
    EipIntelligenceFailureRepository,
    EipAuditLogRepository,
} from "@/src/modules/database/repositories/enterprise-intelligence-platform-repositories";
`;
    da = da.slice(0, copImportEnd) + eipImport + da.slice(copImportEnd);

    const copProp = "    readonly copAuditLogs: CopAuditLogRepository;";
    const eipProps = `    readonly eipIntelligenceHubs: EipIntelligenceHubRepository;
    readonly eipKpiRegistry: EipKpiRegistryRepository;
    readonly eipKpiAggregations: EipKpiAggregationRepository;
    readonly eipKpiCategories: EipKpiCategoryRepository;
    readonly eipKpiTargets: EipKpiTargetRepository;
    readonly eipKpiThresholds: EipKpiThresholdRepository;
    readonly eipKpiSnapshots: EipKpiSnapshotRepository;
    readonly eipExecutiveDashboards: EipExecutiveDashboardRepository;
    readonly eipCrossModuleInsights: EipCrossModuleInsightRepository;
    readonly eipBusinessHealthScores: EipBusinessHealthScoreRepository;
    readonly eipOperationalEfficiencyScores: EipOperationalEfficiencyScoreRepository;
    readonly eipGrowthScores: EipGrowthScoreRepository;
    readonly eipStrategicInsights: EipStrategicInsightRepository;
    readonly eipRevenueForecasts: EipRevenueForecastRepository;
    readonly eipCustomerGrowthForecasts: EipCustomerGrowthForecastRepository;
    readonly eipRenewalForecasts: EipRenewalForecastRepository;
    readonly eipCapacityPlanning: EipCapacityPlanningRepository;
    readonly eipOperationalTrends: EipOperationalTrendRepository;
    readonly eipRiskForecasts: EipRiskForecastRepository;
    readonly eipDailyExecutiveBriefs: EipDailyExecutiveBriefRepository;
    readonly eipWeeklyBusinessSummaries: EipWeeklyBusinessSummaryRepository;
    readonly eipMonthlyPerformanceReports: EipMonthlyPerformanceReportRepository;
    readonly eipQuarterlyExecutiveReviews: EipQuarterlyExecutiveReviewRepository;
    readonly eipAnnualBusinessReports: EipAnnualBusinessReportRepository;
    readonly eipKpiServiceConfigs: EipKpiServiceConfigRepository;
    readonly eipIntelligenceServiceConfigs: EipIntelligenceServiceConfigRepository;
    readonly eipForecastServiceConfigs: EipForecastServiceConfigRepository;
    readonly eipIntelligenceMetrics: EipIntelligenceMetricRepository;
    readonly eipIntelligenceHealth: EipIntelligenceHealthRepository;
    readonly eipMissionProgress: EipMissionProgressRepository;
    readonly eipIntelligenceFailures: EipIntelligenceFailureRepository;
    readonly eipAuditLogs: EipAuditLogRepository;`;
    da = da.replace(copProp, copProp + "\n" + eipProps);

    const copCtor = "        this.copAuditLogs = new CopAuditLogRepository();";
    const eipCtor = `        this.eipIntelligenceHubs = new EipIntelligenceHubRepository();
        this.eipKpiRegistry = new EipKpiRegistryRepository();
        this.eipKpiAggregations = new EipKpiAggregationRepository();
        this.eipKpiCategories = new EipKpiCategoryRepository();
        this.eipKpiTargets = new EipKpiTargetRepository();
        this.eipKpiThresholds = new EipKpiThresholdRepository();
        this.eipKpiSnapshots = new EipKpiSnapshotRepository();
        this.eipExecutiveDashboards = new EipExecutiveDashboardRepository();
        this.eipCrossModuleInsights = new EipCrossModuleInsightRepository();
        this.eipBusinessHealthScores = new EipBusinessHealthScoreRepository();
        this.eipOperationalEfficiencyScores = new EipOperationalEfficiencyScoreRepository();
        this.eipGrowthScores = new EipGrowthScoreRepository();
        this.eipStrategicInsights = new EipStrategicInsightRepository();
        this.eipRevenueForecasts = new EipRevenueForecastRepository();
        this.eipCustomerGrowthForecasts = new EipCustomerGrowthForecastRepository();
        this.eipRenewalForecasts = new EipRenewalForecastRepository();
        this.eipCapacityPlanning = new EipCapacityPlanningRepository();
        this.eipOperationalTrends = new EipOperationalTrendRepository();
        this.eipRiskForecasts = new EipRiskForecastRepository();
        this.eipDailyExecutiveBriefs = new EipDailyExecutiveBriefRepository();
        this.eipWeeklyBusinessSummaries = new EipWeeklyBusinessSummaryRepository();
        this.eipMonthlyPerformanceReports = new EipMonthlyPerformanceReportRepository();
        this.eipQuarterlyExecutiveReviews = new EipQuarterlyExecutiveReviewRepository();
        this.eipAnnualBusinessReports = new EipAnnualBusinessReportRepository();
        this.eipKpiServiceConfigs = new EipKpiServiceConfigRepository();
        this.eipIntelligenceServiceConfigs = new EipIntelligenceServiceConfigRepository();
        this.eipForecastServiceConfigs = new EipForecastServiceConfigRepository();
        this.eipIntelligenceMetrics = new EipIntelligenceMetricRepository();
        this.eipIntelligenceHealth = new EipIntelligenceHealthRepository();
        this.eipMissionProgress = new EipMissionProgressRepository();
        this.eipIntelligenceFailures = new EipIntelligenceFailureRepository();
        this.eipAuditLogs = new EipAuditLogRepository();`;
    da = da.replace(copCtor, copCtor + "\n" + eipCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("eipIntelligenceHubs")) {
    ds = ds.replace(
        "    copAuditLogs: databaseAccess.copAuditLogs,",
        `    copAuditLogs: databaseAccess.copAuditLogs,
    eipIntelligenceHubs: databaseAccess.eipIntelligenceHubs,
    eipKpiRegistry: databaseAccess.eipKpiRegistry,
    eipKpiAggregations: databaseAccess.eipKpiAggregations,
    eipKpiCategories: databaseAccess.eipKpiCategories,
    eipKpiTargets: databaseAccess.eipKpiTargets,
    eipKpiThresholds: databaseAccess.eipKpiThresholds,
    eipKpiSnapshots: databaseAccess.eipKpiSnapshots,
    eipExecutiveDashboards: databaseAccess.eipExecutiveDashboards,
    eipCrossModuleInsights: databaseAccess.eipCrossModuleInsights,
    eipBusinessHealthScores: databaseAccess.eipBusinessHealthScores,
    eipOperationalEfficiencyScores: databaseAccess.eipOperationalEfficiencyScores,
    eipGrowthScores: databaseAccess.eipGrowthScores,
    eipStrategicInsights: databaseAccess.eipStrategicInsights,
    eipRevenueForecasts: databaseAccess.eipRevenueForecasts,
    eipCustomerGrowthForecasts: databaseAccess.eipCustomerGrowthForecasts,
    eipRenewalForecasts: databaseAccess.eipRenewalForecasts,
    eipCapacityPlanning: databaseAccess.eipCapacityPlanning,
    eipOperationalTrends: databaseAccess.eipOperationalTrends,
    eipRiskForecasts: databaseAccess.eipRiskForecasts,
    eipDailyExecutiveBriefs: databaseAccess.eipDailyExecutiveBriefs,
    eipWeeklyBusinessSummaries: databaseAccess.eipWeeklyBusinessSummaries,
    eipMonthlyPerformanceReports: databaseAccess.eipMonthlyPerformanceReports,
    eipQuarterlyExecutiveReviews: databaseAccess.eipQuarterlyExecutiveReviews,
    eipAnnualBusinessReports: databaseAccess.eipAnnualBusinessReports,
    eipKpiServiceConfigs: databaseAccess.eipKpiServiceConfigs,
    eipIntelligenceServiceConfigs: databaseAccess.eipIntelligenceServiceConfigs,
    eipForecastServiceConfigs: databaseAccess.eipForecastServiceConfigs,
    eipIntelligenceMetrics: databaseAccess.eipIntelligenceMetrics,
    eipIntelligenceHealth: databaseAccess.eipIntelligenceHealth,
    eipMissionProgress: databaseAccess.eipMissionProgress,
    eipIntelligenceFailures: databaseAccess.eipIntelligenceFailures,
    eipAuditLogs: databaseAccess.eipAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for EIP");
