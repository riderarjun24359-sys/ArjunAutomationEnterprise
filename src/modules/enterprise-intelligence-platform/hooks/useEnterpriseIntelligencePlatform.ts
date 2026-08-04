"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { enterpriseIntelligencePlatformService } from "@/src/modules/enterprise-intelligence-platform/services/enterprise-intelligence-platform.service";
import type {
    IntelligenceHubSummary,
    CreateIntelligenceHubInput,
    KpiRegistrySummary,
    CreateKpiRegistryInput,
    KpiAggregationSummary,
    CreateKpiAggregationInput,
    KpiCategorySummary,
    CreateKpiCategoryInput,
    KpiTargetSummary,
    CreateKpiTargetInput,
    KpiThresholdSummary,
    CreateKpiThresholdInput,
    KpiSnapshotSummary,
    CreateKpiSnapshotInput,
    ExecutiveDashboardSummary,
    CreateExecutiveDashboardInput,
    CrossModuleInsightSummary,
    CreateCrossModuleInsightInput,
    BusinessHealthScoreSummary,
    CreateBusinessHealthScoreInput,
    OperationalEfficiencyScoreSummary,
    CreateOperationalEfficiencyScoreInput,
    GrowthScoreSummary,
    CreateGrowthScoreInput,
    StrategicInsightSummary,
    CreateStrategicInsightInput,
    RevenueForecastSummary,
    CreateRevenueForecastInput,
    CustomerGrowthForecastSummary,
    CreateCustomerGrowthForecastInput,
    RenewalForecastSummary,
    CreateRenewalForecastInput,
    CapacityPlanningSummary,
    CreateCapacityPlanningInput,
    OperationalTrendSummary,
    CreateOperationalTrendInput,
    RiskForecastSummary,
    CreateRiskForecastInput,
    DailyExecutiveBriefSummary,
    CreateDailyExecutiveBriefInput,
    WeeklyBusinessSummarySummary,
    CreateWeeklyBusinessSummaryInput,
    MonthlyPerformanceReportSummary,
    CreateMonthlyPerformanceReportInput,
    QuarterlyExecutiveReviewSummary,
    CreateQuarterlyExecutiveReviewInput,
    AnnualBusinessReportSummary,
    CreateAnnualBusinessReportInput,
    KpiServiceConfigSummary,
    CreateKpiServiceConfigInput,
    IntelligenceServiceConfigSummary,
    CreateIntelligenceServiceConfigInput,
    ForecastServiceConfigSummary,
    CreateForecastServiceConfigInput,
    IntelligenceMetricSummary,
    CreateIntelligenceMetricInput,
    IntelligenceHealthSummary,
    CreateIntelligenceHealthInput,
    MissionProgressSummary,
    CreateMissionProgressInput,
    IntelligenceFailureSummary,
    CreateIntelligenceFailureInput,
    AuditEntry,
    EipDashboardStats,
    EipPipelineInfo,
} from "@/src/modules/enterprise-intelligence-platform/types";

export function useEnterpriseIntelligencePlatform() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<EipDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<EipPipelineInfo | null>(null);
    const [intelligenceHubs, setIntelligenceHubs] = useState<IntelligenceHubSummary[]>([]);
    const [kpiRegistry, setKpiRegistrys] = useState<KpiRegistrySummary[]>([]);
    const [kpiAggregations, setKpiAggregations] = useState<KpiAggregationSummary[]>([]);
    const [kpiCategories, setKpiCategorys] = useState<KpiCategorySummary[]>([]);
    const [kpiTargets, setKpiTargets] = useState<KpiTargetSummary[]>([]);
    const [kpiThresholds, setKpiThresholds] = useState<KpiThresholdSummary[]>([]);
    const [kpiSnapshots, setKpiSnapshots] = useState<KpiSnapshotSummary[]>([]);
    const [executiveDashboards, setExecutiveDashboards] = useState<ExecutiveDashboardSummary[]>([]);
    const [crossModuleInsights, setCrossModuleInsights] = useState<CrossModuleInsightSummary[]>([]);
    const [businessHealthScores, setBusinessHealthScores] = useState<BusinessHealthScoreSummary[]>([]);
    const [operationalEfficiencyScores, setOperationalEfficiencyScores] = useState<OperationalEfficiencyScoreSummary[]>([]);
    const [growthScores, setGrowthScores] = useState<GrowthScoreSummary[]>([]);
    const [strategicInsights, setStrategicInsights] = useState<StrategicInsightSummary[]>([]);
    const [revenueForecasts, setRevenueForecasts] = useState<RevenueForecastSummary[]>([]);
    const [customerGrowthForecasts, setCustomerGrowthForecasts] = useState<CustomerGrowthForecastSummary[]>([]);
    const [renewalForecasts, setRenewalForecasts] = useState<RenewalForecastSummary[]>([]);
    const [capacityPlanning, setCapacityPlannings] = useState<CapacityPlanningSummary[]>([]);
    const [operationalTrends, setOperationalTrends] = useState<OperationalTrendSummary[]>([]);
    const [riskForecasts, setRiskForecasts] = useState<RiskForecastSummary[]>([]);
    const [dailyExecutiveBriefs, setDailyExecutiveBriefs] = useState<DailyExecutiveBriefSummary[]>([]);
    const [weeklyBusinessSummaries, setWeeklyBusinessSummarys] = useState<WeeklyBusinessSummarySummary[]>([]);
    const [monthlyPerformanceReports, setMonthlyPerformanceReports] = useState<MonthlyPerformanceReportSummary[]>([]);
    const [quarterlyExecutiveReviews, setQuarterlyExecutiveReviews] = useState<QuarterlyExecutiveReviewSummary[]>([]);
    const [annualBusinessReports, setAnnualBusinessReports] = useState<AnnualBusinessReportSummary[]>([]);
    const [kpiServiceConfigs, setKpiServiceConfigs] = useState<KpiServiceConfigSummary[]>([]);
    const [intelligenceServiceConfigs, setIntelligenceServiceConfigs] = useState<IntelligenceServiceConfigSummary[]>([]);
    const [forecastServiceConfigs, setForecastServiceConfigs] = useState<ForecastServiceConfigSummary[]>([]);
    const [intelligenceMetrics, setIntelligenceMetrics] = useState<IntelligenceMetricSummary[]>([]);
    const [intelligenceHealth, setIntelligenceHealths] = useState<IntelligenceHealthSummary[]>([]);
    const [missionProgress, setMissionProgresss] = useState<MissionProgressSummary[]>([]);
    const [intelligenceFailures, setIntelligenceFailures] = useState<IntelligenceFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [intelligenceHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
intelligenceHubsList,
            kpiRegistryList,
            kpiAggregationsList,
            kpiCategoriesList,
            kpiTargetsList,
            kpiThresholdsList,
            kpiSnapshotsList,
            executiveDashboardsList,
            crossModuleInsightsList,
            businessHealthScoresList,
            operationalEfficiencyScoresList,
            growthScoresList,
            strategicInsightsList,
            revenueForecastsList,
            customerGrowthForecastsList,
            renewalForecastsList,
            capacityPlanningList,
            operationalTrendsList,
            riskForecastsList,
            dailyExecutiveBriefsList,
            weeklyBusinessSummariesList,
            monthlyPerformanceReportsList,
            quarterlyExecutiveReviewsList,
            annualBusinessReportsList,
            kpiServiceConfigsList,
            intelligenceServiceConfigsList,
            forecastServiceConfigsList,
            intelligenceMetricsList,
            intelligenceHealthList,
            missionProgressList,
            intelligenceFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            enterpriseIntelligencePlatformService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(enterpriseIntelligencePlatformService.getPipelineInfo()),
            enterpriseIntelligencePlatformService.getIntelligenceHubs(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getKpiRegistrys(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getKpiAggregations(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getKpiCategorys(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getKpiTargets(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getKpiThresholds(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getKpiSnapshots(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getExecutiveDashboards(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getCrossModuleInsights(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getBusinessHealthScores(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getOperationalEfficiencyScores(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getGrowthScores(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getStrategicInsights(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getRevenueForecasts(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getCustomerGrowthForecasts(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getRenewalForecasts(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getCapacityPlannings(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getOperationalTrends(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getRiskForecasts(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getDailyExecutiveBriefs(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getWeeklyBusinessSummarys(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getMonthlyPerformanceReports(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getQuarterlyExecutiveReviews(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getAnnualBusinessReports(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getKpiServiceConfigs(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getIntelligenceServiceConfigs(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getForecastServiceConfigs(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getIntelligenceMetrics(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getIntelligenceHealths(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getMissionProgresss(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getIntelligenceFailures(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getAuditLogs(authUserId, email, fullName),
            enterpriseIntelligencePlatformService.getIntelligenceHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
intelligenceHubsList,
            kpiRegistryList,
            kpiAggregationsList,
            kpiCategoriesList,
            kpiTargetsList,
            kpiThresholdsList,
            kpiSnapshotsList,
            executiveDashboardsList,
            crossModuleInsightsList,
            businessHealthScoresList,
            operationalEfficiencyScoresList,
            growthScoresList,
            strategicInsightsList,
            revenueForecastsList,
            customerGrowthForecastsList,
            renewalForecastsList,
            capacityPlanningList,
            operationalTrendsList,
            riskForecastsList,
            dailyExecutiveBriefsList,
            weeklyBusinessSummariesList,
            monthlyPerformanceReportsList,
            quarterlyExecutiveReviewsList,
            annualBusinessReportsList,
            kpiServiceConfigsList,
            intelligenceServiceConfigsList,
            forecastServiceConfigsList,
            intelligenceMetricsList,
            intelligenceHealthList,
            missionProgressList,
            intelligenceFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setIntelligenceHubs(result.intelligenceHubsList);
        setKpiRegistrys(result.kpiRegistryList);
        setKpiAggregations(result.kpiAggregationsList);
        setKpiCategorys(result.kpiCategoriesList);
        setKpiTargets(result.kpiTargetsList);
        setKpiThresholds(result.kpiThresholdsList);
        setKpiSnapshots(result.kpiSnapshotsList);
        setExecutiveDashboards(result.executiveDashboardsList);
        setCrossModuleInsights(result.crossModuleInsightsList);
        setBusinessHealthScores(result.businessHealthScoresList);
        setOperationalEfficiencyScores(result.operationalEfficiencyScoresList);
        setGrowthScores(result.growthScoresList);
        setStrategicInsights(result.strategicInsightsList);
        setRevenueForecasts(result.revenueForecastsList);
        setCustomerGrowthForecasts(result.customerGrowthForecastsList);
        setRenewalForecasts(result.renewalForecastsList);
        setCapacityPlannings(result.capacityPlanningList);
        setOperationalTrends(result.operationalTrendsList);
        setRiskForecasts(result.riskForecastsList);
        setDailyExecutiveBriefs(result.dailyExecutiveBriefsList);
        setWeeklyBusinessSummarys(result.weeklyBusinessSummariesList);
        setMonthlyPerformanceReports(result.monthlyPerformanceReportsList);
        setQuarterlyExecutiveReviews(result.quarterlyExecutiveReviewsList);
        setAnnualBusinessReports(result.annualBusinessReportsList);
        setKpiServiceConfigs(result.kpiServiceConfigsList);
        setIntelligenceServiceConfigs(result.intelligenceServiceConfigsList);
        setForecastServiceConfigs(result.forecastServiceConfigsList);
        setIntelligenceMetrics(result.intelligenceMetricsList);
        setIntelligenceHealths(result.intelligenceHealthList);
        setMissionProgresss(result.missionProgressList);
        setIntelligenceFailures(result.intelligenceFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createIntelligenceHub = useCallback(async (input: CreateIntelligenceHubInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createIntelligenceHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKpiRegistry = useCallback(async (input: CreateKpiRegistryInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createKpiRegistry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKpiAggregation = useCallback(async (input: CreateKpiAggregationInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createKpiAggregation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKpiCategory = useCallback(async (input: CreateKpiCategoryInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createKpiCategory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKpiTarget = useCallback(async (input: CreateKpiTargetInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createKpiTarget(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKpiThreshold = useCallback(async (input: CreateKpiThresholdInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createKpiThreshold(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKpiSnapshot = useCallback(async (input: CreateKpiSnapshotInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createKpiSnapshot(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveDashboard = useCallback(async (input: CreateExecutiveDashboardInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createExecutiveDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCrossModuleInsight = useCallback(async (input: CreateCrossModuleInsightInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createCrossModuleInsight(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessHealthScore = useCallback(async (input: CreateBusinessHealthScoreInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createBusinessHealthScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationalEfficiencyScore = useCallback(async (input: CreateOperationalEfficiencyScoreInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createOperationalEfficiencyScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGrowthScore = useCallback(async (input: CreateGrowthScoreInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createGrowthScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStrategicInsight = useCallback(async (input: CreateStrategicInsightInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createStrategicInsight(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueForecast = useCallback(async (input: CreateRevenueForecastInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createRevenueForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerGrowthForecast = useCallback(async (input: CreateCustomerGrowthForecastInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createCustomerGrowthForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalForecast = useCallback(async (input: CreateRenewalForecastInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createRenewalForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCapacityPlanning = useCallback(async (input: CreateCapacityPlanningInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createCapacityPlanning(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationalTrend = useCallback(async (input: CreateOperationalTrendInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createOperationalTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskForecast = useCallback(async (input: CreateRiskForecastInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createRiskForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDailyExecutiveBrief = useCallback(async (input: CreateDailyExecutiveBriefInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createDailyExecutiveBrief(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWeeklyBusinessSummary = useCallback(async (input: CreateWeeklyBusinessSummaryInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createWeeklyBusinessSummary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMonthlyPerformanceReport = useCallback(async (input: CreateMonthlyPerformanceReportInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createMonthlyPerformanceReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createQuarterlyExecutiveReview = useCallback(async (input: CreateQuarterlyExecutiveReviewInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createQuarterlyExecutiveReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAnnualBusinessReport = useCallback(async (input: CreateAnnualBusinessReportInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createAnnualBusinessReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKpiServiceConfig = useCallback(async (input: CreateKpiServiceConfigInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createKpiServiceConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntelligenceServiceConfig = useCallback(async (input: CreateIntelligenceServiceConfigInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createIntelligenceServiceConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createForecastServiceConfig = useCallback(async (input: CreateForecastServiceConfigInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createForecastServiceConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntelligenceMetric = useCallback(async (input: CreateIntelligenceMetricInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createIntelligenceMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntelligenceHealth = useCallback(async (input: CreateIntelligenceHealthInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createIntelligenceHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMissionProgress = useCallback(async (input: CreateMissionProgressInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createMissionProgress(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntelligenceFailure = useCallback(async (input: CreateIntelligenceFailureInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIntelligencePlatformService.createIntelligenceFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        intelligenceHubs,
        createIntelligenceHub,
        kpiRegistry,
        createKpiRegistry,
        kpiAggregations,
        createKpiAggregation,
        kpiCategories,
        createKpiCategory,
        kpiTargets,
        createKpiTarget,
        kpiThresholds,
        createKpiThreshold,
        kpiSnapshots,
        createKpiSnapshot,
        executiveDashboards,
        createExecutiveDashboard,
        crossModuleInsights,
        createCrossModuleInsight,
        businessHealthScores,
        createBusinessHealthScore,
        operationalEfficiencyScores,
        createOperationalEfficiencyScore,
        growthScores,
        createGrowthScore,
        strategicInsights,
        createStrategicInsight,
        revenueForecasts,
        createRevenueForecast,
        customerGrowthForecasts,
        createCustomerGrowthForecast,
        renewalForecasts,
        createRenewalForecast,
        capacityPlanning,
        createCapacityPlanning,
        operationalTrends,
        createOperationalTrend,
        riskForecasts,
        createRiskForecast,
        dailyExecutiveBriefs,
        createDailyExecutiveBrief,
        weeklyBusinessSummaries,
        createWeeklyBusinessSummary,
        monthlyPerformanceReports,
        createMonthlyPerformanceReport,
        quarterlyExecutiveReviews,
        createQuarterlyExecutiveReview,
        annualBusinessReports,
        createAnnualBusinessReport,
        kpiServiceConfigs,
        createKpiServiceConfig,
        intelligenceServiceConfigs,
        createIntelligenceServiceConfig,
        forecastServiceConfigs,
        createForecastServiceConfig,
        intelligenceMetrics,
        createIntelligenceMetric,
        intelligenceHealth,
        createIntelligenceHealth,
        missionProgress,
        createMissionProgress,
        intelligenceFailures,
        createIntelligenceFailure,
        auditLogs,
        intelligenceHubOptions,
        refresh,
    };
}
