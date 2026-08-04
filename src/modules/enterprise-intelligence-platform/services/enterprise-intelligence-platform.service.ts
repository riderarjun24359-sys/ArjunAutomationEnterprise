import {
    buildIntelligenceHubLookupMaps,
    buildEipAuditPayload,
    buildEipDashboardStats,
    buildEipPipelineInfo,
    mapAuditEntry,
    buildIntelligenceHubPayload,
    mapIntelligenceHubSummary,
    buildKpiRegistryPayload,
    mapKpiRegistrySummary,
    buildKpiAggregationPayload,
    mapKpiAggregationSummary,
    buildKpiCategoryPayload,
    mapKpiCategorySummary,
    buildKpiTargetPayload,
    mapKpiTargetSummary,
    buildKpiThresholdPayload,
    mapKpiThresholdSummary,
    buildKpiSnapshotPayload,
    mapKpiSnapshotSummary,
    buildExecutiveDashboardPayload,
    mapExecutiveDashboardSummary,
    buildCrossModuleInsightPayload,
    mapCrossModuleInsightSummary,
    buildBusinessHealthScorePayload,
    mapBusinessHealthScoreSummary,
    buildOperationalEfficiencyScorePayload,
    mapOperationalEfficiencyScoreSummary,
    buildGrowthScorePayload,
    mapGrowthScoreSummary,
    buildStrategicInsightPayload,
    mapStrategicInsightSummary,
    buildRevenueForecastPayload,
    mapRevenueForecastSummary,
    buildCustomerGrowthForecastPayload,
    mapCustomerGrowthForecastSummary,
    buildRenewalForecastPayload,
    mapRenewalForecastSummary,
    buildCapacityPlanningPayload,
    mapCapacityPlanningSummary,
    buildOperationalTrendPayload,
    mapOperationalTrendSummary,
    buildRiskForecastPayload,
    mapRiskForecastSummary,
    buildDailyExecutiveBriefPayload,
    mapDailyExecutiveBriefSummary,
    buildWeeklyBusinessSummaryPayload,
    mapWeeklyBusinessSummarySummary,
    buildMonthlyPerformanceReportPayload,
    mapMonthlyPerformanceReportSummary,
    buildQuarterlyExecutiveReviewPayload,
    mapQuarterlyExecutiveReviewSummary,
    buildAnnualBusinessReportPayload,
    mapAnnualBusinessReportSummary,
    buildKpiServiceConfigPayload,
    mapKpiServiceConfigSummary,
    buildIntelligenceServiceConfigPayload,
    mapIntelligenceServiceConfigSummary,
    buildForecastServiceConfigPayload,
    mapForecastServiceConfigSummary,
    buildIntelligenceMetricPayload,
    mapIntelligenceMetricSummary,
    buildIntelligenceHealthPayload,
    mapIntelligenceHealthSummary,
    buildMissionProgressPayload,
    mapMissionProgressSummary,
    buildIntelligenceFailurePayload,
    mapIntelligenceFailureSummary,
    mapKpiRegistryForStats,
    mapExecutiveDashboardForStats,
    mapIntelligenceMetricForStats,
    mapRevenueForecastForStats,
    mapCrossModuleInsightForStats,
    mapIntelligenceHealthForStats,
    mapIntelligenceFailureForStats,
} from "@/src/modules/database/lib/enterprise-intelligence-platform-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
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
    EipSdkRunKpiServiceInput,
    EipSdkRunKpiServiceResult,
    EipSdkRunIntelligenceServiceInput,
    EipSdkRunIntelligenceServiceResult,
    EipSdkRunForecastServiceInput,
    EipSdkRunForecastServiceResult,
    EipSdkRunReportingServiceInput,
    EipSdkRunReportingServiceResult,
    EipSdkRunExecutiveInsightServiceInput,
    EipSdkRunExecutiveInsightServiceResult,
} from "@/src/modules/enterprise-intelligence-platform/types";

export class EnterpriseIntelligencePlatformService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const intelligenceHubs = await databaseService.eipIntelligenceHubs.listByOrganization(organizationId);
        return buildIntelligenceHubLookupMaps(intelligenceHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<EipDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildEipDashboardStats({ intelligenceHubs: [], kpiRegistry: [], executiveDashboards: [], revenueForecasts: [], crossModuleInsights: [], intelligenceMetrics: [], intelligenceHealth: [], intelligenceFailures: [], auditLogs: [] });
        const [intelligenceHubs, kpiRegistryRaw, executiveDashboardsRaw, revenueForecastsRaw, crossModuleInsightsRaw, intelligenceMetricsRaw, intelligenceHealthRaw, intelligenceFailures, auditLogs] = await Promise.all([
            this.getIntelligenceHubs(authUserId, email, fullName),
            databaseService.eipKpiRegistry.listByOrganization(context.organizationId),
            databaseService.eipExecutiveDashboards.listByOrganization(context.organizationId),
            databaseService.eipRevenueForecasts.listByOrganization(context.organizationId),
            databaseService.eipCrossModuleInsights.listByOrganization(context.organizationId),
            databaseService.eipIntelligenceMetrics.listByOrganization(context.organizationId),
            databaseService.eipIntelligenceHealth.listByOrganization(context.organizationId),
            this.getIntelligenceFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildEipDashboardStats({
            intelligenceHubs,
            kpiRegistry: kpiRegistryRaw.map(mapKpiRegistryForStats),
            executiveDashboards: executiveDashboardsRaw.map(mapExecutiveDashboardForStats),
            revenueForecasts: revenueForecastsRaw.map(mapRevenueForecastForStats),
            crossModuleInsights: crossModuleInsightsRaw.map(mapCrossModuleInsightForStats),
            intelligenceMetrics: intelligenceMetricsRaw.map(mapIntelligenceMetricForStats),
            intelligenceHealth: intelligenceHealthRaw.map(mapIntelligenceHealthForStats),
            intelligenceFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): EipPipelineInfo {
        return buildEipPipelineInfo();
    }

    async getIntelligenceHubs(authUserId: string, email: string, fullName?: string | null): Promise<IntelligenceHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipIntelligenceHubs.listByOrganization(context.organizationId)).map((r) => mapIntelligenceHubSummary(r));
    }

    async createIntelligenceHub(authUserId: string, email: string, input: CreateIntelligenceHubInput, fullName?: string | null): Promise<IntelligenceHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipIntelligenceHubs.create(buildIntelligenceHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create intelligenceHubs");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "intelligence_hubs", "create", `IntelligenceHub created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIntelligenceHubSummary(created);
    }

    async getKpiRegistrys(authUserId: string, email: string, fullName?: string | null): Promise<KpiRegistrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipKpiRegistry.listByOrganization(context.organizationId)).map((r) => mapKpiRegistrySummary(r, maps));
    }

    async createKpiRegistry(authUserId: string, email: string, input: CreateKpiRegistryInput, fullName?: string | null): Promise<KpiRegistrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipKpiRegistry.create(buildKpiRegistryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kpiRegistry");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "kpi_registry", "create", `KpiRegistry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKpiRegistrySummary(created, maps);
    }

    async getKpiAggregations(authUserId: string, email: string, fullName?: string | null): Promise<KpiAggregationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipKpiAggregations.listByOrganization(context.organizationId)).map((r) => mapKpiAggregationSummary(r, maps));
    }

    async createKpiAggregation(authUserId: string, email: string, input: CreateKpiAggregationInput, fullName?: string | null): Promise<KpiAggregationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipKpiAggregations.create(buildKpiAggregationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kpiAggregations");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "kpi_aggregations", "create", `KpiAggregation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKpiAggregationSummary(created, maps);
    }

    async getKpiCategorys(authUserId: string, email: string, fullName?: string | null): Promise<KpiCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipKpiCategories.listByOrganization(context.organizationId)).map((r) => mapKpiCategorySummary(r, maps));
    }

    async createKpiCategory(authUserId: string, email: string, input: CreateKpiCategoryInput, fullName?: string | null): Promise<KpiCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipKpiCategories.create(buildKpiCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kpiCategories");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "kpi_categories", "create", `KpiCategory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKpiCategorySummary(created, maps);
    }

    async getKpiTargets(authUserId: string, email: string, fullName?: string | null): Promise<KpiTargetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipKpiTargets.listByOrganization(context.organizationId)).map((r) => mapKpiTargetSummary(r, maps));
    }

    async createKpiTarget(authUserId: string, email: string, input: CreateKpiTargetInput, fullName?: string | null): Promise<KpiTargetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipKpiTargets.create(buildKpiTargetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kpiTargets");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "kpi_targets", "create", `KpiTarget created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKpiTargetSummary(created, maps);
    }

    async getKpiThresholds(authUserId: string, email: string, fullName?: string | null): Promise<KpiThresholdSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipKpiThresholds.listByOrganization(context.organizationId)).map((r) => mapKpiThresholdSummary(r, maps));
    }

    async createKpiThreshold(authUserId: string, email: string, input: CreateKpiThresholdInput, fullName?: string | null): Promise<KpiThresholdSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipKpiThresholds.create(buildKpiThresholdPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kpiThresholds");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "kpi_thresholds", "create", `KpiThreshold created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKpiThresholdSummary(created, maps);
    }

    async getKpiSnapshots(authUserId: string, email: string, fullName?: string | null): Promise<KpiSnapshotSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipKpiSnapshots.listByOrganization(context.organizationId)).map((r) => mapKpiSnapshotSummary(r, maps));
    }

    async createKpiSnapshot(authUserId: string, email: string, input: CreateKpiSnapshotInput, fullName?: string | null): Promise<KpiSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipKpiSnapshots.create(buildKpiSnapshotPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kpiSnapshots");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "kpi_snapshots", "create", `KpiSnapshot created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKpiSnapshotSummary(created, maps);
    }

    async getExecutiveDashboards(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipExecutiveDashboards.listByOrganization(context.organizationId)).map((r) => mapExecutiveDashboardSummary(r, maps));
    }

    async createExecutiveDashboard(authUserId: string, email: string, input: CreateExecutiveDashboardInput, fullName?: string | null): Promise<ExecutiveDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipExecutiveDashboards.create(buildExecutiveDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveDashboards");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "executive_dashboards", "create", `ExecutiveDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveDashboardSummary(created, maps);
    }

    async getCrossModuleInsights(authUserId: string, email: string, fullName?: string | null): Promise<CrossModuleInsightSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipCrossModuleInsights.listByOrganization(context.organizationId)).map((r) => mapCrossModuleInsightSummary(r, maps));
    }

    async createCrossModuleInsight(authUserId: string, email: string, input: CreateCrossModuleInsightInput, fullName?: string | null): Promise<CrossModuleInsightSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipCrossModuleInsights.create(buildCrossModuleInsightPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create crossModuleInsights");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "cross_module_insights", "create", `CrossModuleInsight created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCrossModuleInsightSummary(created, maps);
    }

    async getBusinessHealthScores(authUserId: string, email: string, fullName?: string | null): Promise<BusinessHealthScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipBusinessHealthScores.listByOrganization(context.organizationId)).map((r) => mapBusinessHealthScoreSummary(r, maps));
    }

    async createBusinessHealthScore(authUserId: string, email: string, input: CreateBusinessHealthScoreInput, fullName?: string | null): Promise<BusinessHealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipBusinessHealthScores.create(buildBusinessHealthScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessHealthScores");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "business_health_scores", "create", `BusinessHealthScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessHealthScoreSummary(created, maps);
    }

    async getOperationalEfficiencyScores(authUserId: string, email: string, fullName?: string | null): Promise<OperationalEfficiencyScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipOperationalEfficiencyScores.listByOrganization(context.organizationId)).map((r) => mapOperationalEfficiencyScoreSummary(r, maps));
    }

    async createOperationalEfficiencyScore(authUserId: string, email: string, input: CreateOperationalEfficiencyScoreInput, fullName?: string | null): Promise<OperationalEfficiencyScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipOperationalEfficiencyScores.create(buildOperationalEfficiencyScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationalEfficiencyScores");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "operational_efficiency_scores", "create", `OperationalEfficiencyScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperationalEfficiencyScoreSummary(created, maps);
    }

    async getGrowthScores(authUserId: string, email: string, fullName?: string | null): Promise<GrowthScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipGrowthScores.listByOrganization(context.organizationId)).map((r) => mapGrowthScoreSummary(r, maps));
    }

    async createGrowthScore(authUserId: string, email: string, input: CreateGrowthScoreInput, fullName?: string | null): Promise<GrowthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipGrowthScores.create(buildGrowthScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthScores");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "growth_scores", "create", `GrowthScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGrowthScoreSummary(created, maps);
    }

    async getStrategicInsights(authUserId: string, email: string, fullName?: string | null): Promise<StrategicInsightSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipStrategicInsights.listByOrganization(context.organizationId)).map((r) => mapStrategicInsightSummary(r, maps));
    }

    async createStrategicInsight(authUserId: string, email: string, input: CreateStrategicInsightInput, fullName?: string | null): Promise<StrategicInsightSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipStrategicInsights.create(buildStrategicInsightPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create strategicInsights");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "strategic_insights", "create", `StrategicInsight created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStrategicInsightSummary(created, maps);
    }

    async getRevenueForecasts(authUserId: string, email: string, fullName?: string | null): Promise<RevenueForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipRevenueForecasts.listByOrganization(context.organizationId)).map((r) => mapRevenueForecastSummary(r, maps));
    }

    async createRevenueForecast(authUserId: string, email: string, input: CreateRevenueForecastInput, fullName?: string | null): Promise<RevenueForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipRevenueForecasts.create(buildRevenueForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueForecasts");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "revenue_forecasts", "create", `RevenueForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueForecastSummary(created, maps);
    }

    async getCustomerGrowthForecasts(authUserId: string, email: string, fullName?: string | null): Promise<CustomerGrowthForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipCustomerGrowthForecasts.listByOrganization(context.organizationId)).map((r) => mapCustomerGrowthForecastSummary(r, maps));
    }

    async createCustomerGrowthForecast(authUserId: string, email: string, input: CreateCustomerGrowthForecastInput, fullName?: string | null): Promise<CustomerGrowthForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipCustomerGrowthForecasts.create(buildCustomerGrowthForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerGrowthForecasts");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "customer_growth_forecasts", "create", `CustomerGrowthForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerGrowthForecastSummary(created, maps);
    }

    async getRenewalForecasts(authUserId: string, email: string, fullName?: string | null): Promise<RenewalForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipRenewalForecasts.listByOrganization(context.organizationId)).map((r) => mapRenewalForecastSummary(r, maps));
    }

    async createRenewalForecast(authUserId: string, email: string, input: CreateRenewalForecastInput, fullName?: string | null): Promise<RenewalForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipRenewalForecasts.create(buildRenewalForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewalForecasts");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "renewal_forecasts", "create", `RenewalForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalForecastSummary(created, maps);
    }

    async getCapacityPlannings(authUserId: string, email: string, fullName?: string | null): Promise<CapacityPlanningSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipCapacityPlanning.listByOrganization(context.organizationId)).map((r) => mapCapacityPlanningSummary(r, maps));
    }

    async createCapacityPlanning(authUserId: string, email: string, input: CreateCapacityPlanningInput, fullName?: string | null): Promise<CapacityPlanningSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipCapacityPlanning.create(buildCapacityPlanningPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create capacityPlanning");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "capacity_planning", "create", `CapacityPlanning created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCapacityPlanningSummary(created, maps);
    }

    async getOperationalTrends(authUserId: string, email: string, fullName?: string | null): Promise<OperationalTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipOperationalTrends.listByOrganization(context.organizationId)).map((r) => mapOperationalTrendSummary(r, maps));
    }

    async createOperationalTrend(authUserId: string, email: string, input: CreateOperationalTrendInput, fullName?: string | null): Promise<OperationalTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipOperationalTrends.create(buildOperationalTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationalTrends");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "operational_trends", "create", `OperationalTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperationalTrendSummary(created, maps);
    }

    async getRiskForecasts(authUserId: string, email: string, fullName?: string | null): Promise<RiskForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipRiskForecasts.listByOrganization(context.organizationId)).map((r) => mapRiskForecastSummary(r, maps));
    }

    async createRiskForecast(authUserId: string, email: string, input: CreateRiskForecastInput, fullName?: string | null): Promise<RiskForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipRiskForecasts.create(buildRiskForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create riskForecasts");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "risk_forecasts", "create", `RiskForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskForecastSummary(created, maps);
    }

    async getDailyExecutiveBriefs(authUserId: string, email: string, fullName?: string | null): Promise<DailyExecutiveBriefSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipDailyExecutiveBriefs.listByOrganization(context.organizationId)).map((r) => mapDailyExecutiveBriefSummary(r, maps));
    }

    async createDailyExecutiveBrief(authUserId: string, email: string, input: CreateDailyExecutiveBriefInput, fullName?: string | null): Promise<DailyExecutiveBriefSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipDailyExecutiveBriefs.create(buildDailyExecutiveBriefPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dailyExecutiveBriefs");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "daily_executive_briefs", "create", `DailyExecutiveBrief created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDailyExecutiveBriefSummary(created, maps);
    }

    async getWeeklyBusinessSummarys(authUserId: string, email: string, fullName?: string | null): Promise<WeeklyBusinessSummarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipWeeklyBusinessSummaries.listByOrganization(context.organizationId)).map((r) => mapWeeklyBusinessSummarySummary(r, maps));
    }

    async createWeeklyBusinessSummary(authUserId: string, email: string, input: CreateWeeklyBusinessSummaryInput, fullName?: string | null): Promise<WeeklyBusinessSummarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipWeeklyBusinessSummaries.create(buildWeeklyBusinessSummaryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create weeklyBusinessSummaries");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "weekly_business_summaries", "create", `WeeklyBusinessSummary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWeeklyBusinessSummarySummary(created, maps);
    }

    async getMonthlyPerformanceReports(authUserId: string, email: string, fullName?: string | null): Promise<MonthlyPerformanceReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipMonthlyPerformanceReports.listByOrganization(context.organizationId)).map((r) => mapMonthlyPerformanceReportSummary(r, maps));
    }

    async createMonthlyPerformanceReport(authUserId: string, email: string, input: CreateMonthlyPerformanceReportInput, fullName?: string | null): Promise<MonthlyPerformanceReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipMonthlyPerformanceReports.create(buildMonthlyPerformanceReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create monthlyPerformanceReports");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "monthly_performance_reports", "create", `MonthlyPerformanceReport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMonthlyPerformanceReportSummary(created, maps);
    }

    async getQuarterlyExecutiveReviews(authUserId: string, email: string, fullName?: string | null): Promise<QuarterlyExecutiveReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipQuarterlyExecutiveReviews.listByOrganization(context.organizationId)).map((r) => mapQuarterlyExecutiveReviewSummary(r, maps));
    }

    async createQuarterlyExecutiveReview(authUserId: string, email: string, input: CreateQuarterlyExecutiveReviewInput, fullName?: string | null): Promise<QuarterlyExecutiveReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipQuarterlyExecutiveReviews.create(buildQuarterlyExecutiveReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create quarterlyExecutiveReviews");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "quarterly_executive_reviews", "create", `QuarterlyExecutiveReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapQuarterlyExecutiveReviewSummary(created, maps);
    }

    async getAnnualBusinessReports(authUserId: string, email: string, fullName?: string | null): Promise<AnnualBusinessReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipAnnualBusinessReports.listByOrganization(context.organizationId)).map((r) => mapAnnualBusinessReportSummary(r, maps));
    }

    async createAnnualBusinessReport(authUserId: string, email: string, input: CreateAnnualBusinessReportInput, fullName?: string | null): Promise<AnnualBusinessReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipAnnualBusinessReports.create(buildAnnualBusinessReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create annualBusinessReports");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "annual_business_reports", "create", `AnnualBusinessReport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAnnualBusinessReportSummary(created, maps);
    }

    async getKpiServiceConfigs(authUserId: string, email: string, fullName?: string | null): Promise<KpiServiceConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipKpiServiceConfigs.listByOrganization(context.organizationId)).map((r) => mapKpiServiceConfigSummary(r, maps));
    }

    async createKpiServiceConfig(authUserId: string, email: string, input: CreateKpiServiceConfigInput, fullName?: string | null): Promise<KpiServiceConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipKpiServiceConfigs.create(buildKpiServiceConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kpiServiceConfigs");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "kpi_service_configs", "create", `KpiServiceConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKpiServiceConfigSummary(created, maps);
    }

    async getIntelligenceServiceConfigs(authUserId: string, email: string, fullName?: string | null): Promise<IntelligenceServiceConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipIntelligenceServiceConfigs.listByOrganization(context.organizationId)).map((r) => mapIntelligenceServiceConfigSummary(r, maps));
    }

    async createIntelligenceServiceConfig(authUserId: string, email: string, input: CreateIntelligenceServiceConfigInput, fullName?: string | null): Promise<IntelligenceServiceConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipIntelligenceServiceConfigs.create(buildIntelligenceServiceConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create intelligenceServiceConfigs");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "intelligence_service_configs", "create", `IntelligenceServiceConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIntelligenceServiceConfigSummary(created, maps);
    }

    async getForecastServiceConfigs(authUserId: string, email: string, fullName?: string | null): Promise<ForecastServiceConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipForecastServiceConfigs.listByOrganization(context.organizationId)).map((r) => mapForecastServiceConfigSummary(r, maps));
    }

    async createForecastServiceConfig(authUserId: string, email: string, input: CreateForecastServiceConfigInput, fullName?: string | null): Promise<ForecastServiceConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipForecastServiceConfigs.create(buildForecastServiceConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create forecastServiceConfigs");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "forecast_service_configs", "create", `ForecastServiceConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapForecastServiceConfigSummary(created, maps);
    }

    async getIntelligenceMetrics(authUserId: string, email: string, fullName?: string | null): Promise<IntelligenceMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eipIntelligenceMetrics.listByOrganization(context.organizationId)).map(mapIntelligenceMetricSummary);
    }

    async createIntelligenceMetric(authUserId: string, email: string, input: CreateIntelligenceMetricInput, fullName?: string | null): Promise<IntelligenceMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipIntelligenceMetrics.create(buildIntelligenceMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create intelligenceMetrics");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "intelligence_metrics", "create", `IntelligenceMetric created`, created.id));
        return mapIntelligenceMetricSummary(created);
    }

    async getIntelligenceHealths(authUserId: string, email: string, fullName?: string | null): Promise<IntelligenceHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eipIntelligenceHealth.listByOrganization(context.organizationId)).map(mapIntelligenceHealthSummary);
    }

    async createIntelligenceHealth(authUserId: string, email: string, input: CreateIntelligenceHealthInput, fullName?: string | null): Promise<IntelligenceHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipIntelligenceHealth.create(buildIntelligenceHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create intelligenceHealth");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "intelligence_health", "create", `IntelligenceHealth created`, created.id));
        return mapIntelligenceHealthSummary(created);
    }

    async getMissionProgresss(authUserId: string, email: string, fullName?: string | null): Promise<MissionProgressSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipMissionProgress.listByOrganization(context.organizationId)).map((r) => mapMissionProgressSummary(r, maps));
    }

    async createMissionProgress(authUserId: string, email: string, input: CreateMissionProgressInput, fullName?: string | null): Promise<MissionProgressSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipMissionProgress.create(buildMissionProgressPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create missionProgress");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "mission_progress", "create", `MissionProgress created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMissionProgressSummary(created, maps);
    }

    async getIntelligenceFailures(authUserId: string, email: string, fullName?: string | null): Promise<IntelligenceFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eipIntelligenceFailures.listByOrganization(context.organizationId)).map((r) => mapIntelligenceFailureSummary(r, maps));
    }

    async createIntelligenceFailure(authUserId: string, email: string, input: CreateIntelligenceFailureInput, fullName?: string | null): Promise<IntelligenceFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eipIntelligenceFailures.create(buildIntelligenceFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create intelligenceFailures");
        await databaseService.eipAuditLogs.create(buildEipAuditPayload(context.organizationId, "intelligence_failures", "create", `IntelligenceFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIntelligenceFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eipAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getIntelligenceHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eipIntelligenceHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunKpiService(authUserId: string, email: string, input: EipSdkRunKpiServiceInput, fullName?: string | null): Promise<EipSdkRunKpiServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createKpiRegistry(authUserId, email, { intelligenceHubId: input.intelligenceHubId, kpiKey: input.kpiKey, kpiName: input.kpiName }, fullName);
        return { kpiId: created.id, kpiKey: created.kpiKey, status: created.status };
    }

    async sdkRunIntelligenceService(authUserId: string, email: string, input: EipSdkRunIntelligenceServiceInput, fullName?: string | null): Promise<EipSdkRunIntelligenceServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createExecutiveDashboard(authUserId, email, { intelligenceHubId: input.intelligenceHubId, dashboardKey: input.dashboardKey, dashboardName: input.dashboardName }, fullName);
        return { dashboardId: created.id, dashboardKey: created.dashboardKey, status: created.status };
    }

    async sdkRunForecastService(authUserId: string, email: string, input: EipSdkRunForecastServiceInput, fullName?: string | null): Promise<EipSdkRunForecastServiceResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const launch = createLaunchFoundationClient(authUserId, email, fullName);
        await launch.getLaunchHubs();
        const company = createCompanyFoundationClient(authUserId, email, fullName);
        await company.getCompanyHubs();
        const csd = createCustomerSuccessDeliveryClient(authUserId, email, fullName);
        await csd.getDeliveryHubs();
        const cop = createCustomerOperatedPlatformClient(authUserId, email, fullName);
        await cop.getOperatedHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createStrategicInsight(authUserId, email, { intelligenceHubId: input.intelligenceHubId, insightKey: input.insightKey, insightTitle: input.insightTitle }, fullName);
        return { insightId: created.id, insightKey: created.insightKey, status: created.status };
    }

    async sdkRunReportingService(authUserId: string, email: string, input: EipSdkRunReportingServiceInput, fullName?: string | null): Promise<EipSdkRunReportingServiceResult> {
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createDailyExecutiveBrief(authUserId, email, { intelligenceHubId: input.intelligenceHubId, briefKey: input.briefKey, briefTitle: input.briefTitle }, fullName);
        return { briefId: created.id, briefKey: created.briefKey, status: created.status };
    }

    async sdkRunExecutiveInsightService(authUserId: string, email: string, input: EipSdkRunExecutiveInsightServiceInput, fullName?: string | null): Promise<EipSdkRunExecutiveInsightServiceResult> {
        const cop = createCustomerOperatedPlatformClient(authUserId, email, fullName);
        await cop.getDashboardStats();
        const created = await this.createCrossModuleInsight(authUserId, email, { intelligenceHubId: input.intelligenceHubId, insightKey: input.insightKey, insightTitle: input.insightTitle }, fullName);
        return { insightId: created.id, insightKey: created.insightKey, status: created.status };
    }
}

export const enterpriseIntelligencePlatformService = new EnterpriseIntelligencePlatformService();
