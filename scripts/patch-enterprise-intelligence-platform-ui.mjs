#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-customer-operated-platform-ui.mjs");
const outPath = join(root, "scripts/generate-enterprise-intelligence-platform-ui.mjs");
let s = readFileSync(genPath, "utf8");

s = s.replace(/const mod = join\(root, "src\/modules\/customer-operated-platform"\);/, 'const mod = join(root, "src/modules/enterprise-intelligence-platform");');

const eipEntitiesBlock = `const entities = [
    { tab: "intelligenceHubs", plural: "intelligenceHubs", singular: "IntelligenceHub", pascal: "IntelligenceHub", db: "eipIntelligenceHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "kpiRegistry", plural: "kpiRegistry", singular: "KpiRegistry", pascal: "KpiRegistry", db: "eipKpiRegistry", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiStatus", type: "select", options: "KPI_STATUS_OPTIONS" }], display: { title: "kpiName", sub: "kpiStatus" } },
    { tab: "kpiAggregations", plural: "kpiAggregations", singular: "KpiAggregation", pascal: "KpiAggregation", db: "eipKpiAggregations", fields: [{ name: "aggregationKey", type: "string" }, { name: "aggregationName", type: "string" }, { name: "aggregationType", type: "string" }], display: { title: "aggregationName", sub: "aggregationType" } },
    { tab: "kpiCategories", plural: "kpiCategories", singular: "KpiCategory", pascal: "KpiCategory", db: "eipKpiCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryStatus", type: "select", options: "CATEGORY_STATUS_OPTIONS" }], display: { title: "categoryName", sub: "categoryStatus" } },
    { tab: "kpiTargets", plural: "kpiTargets", singular: "KpiTarget", pascal: "KpiTarget", db: "eipKpiTargets", fields: [{ name: "targetKey", type: "string" }, { name: "targetName", type: "string" }, { name: "targetValue", type: "number" }], display: { title: "targetName", sub: "targetValue" } },
    { tab: "kpiThresholds", plural: "kpiThresholds", singular: "KpiThreshold", pascal: "KpiThreshold", db: "eipKpiThresholds", fields: [{ name: "thresholdKey", type: "string" }, { name: "thresholdName", type: "string" }, { name: "thresholdValue", type: "number" }], display: { title: "thresholdName", sub: "thresholdValue" } },
    { tab: "kpiSnapshots", plural: "kpiSnapshots", singular: "KpiSnapshot", pascal: "KpiSnapshot", db: "eipKpiSnapshots", fields: [{ name: "snapshotKey", type: "string" }, { name: "snapshotName", type: "string" }, { name: "snapshotValue", type: "number" }], display: { title: "snapshotName", sub: "snapshotValue" } },
    { tab: "executiveDashboards", plural: "executiveDashboards", singular: "ExecutiveDashboard", pascal: "ExecutiveDashboard", db: "eipExecutiveDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "crossModuleInsights", plural: "crossModuleInsights", singular: "CrossModuleInsight", pascal: "CrossModuleInsight", db: "eipCrossModuleInsights", fields: [{ name: "insightKey", type: "string" }, { name: "insightTitle", type: "string" }, { name: "insightType", type: "string" }], display: { title: "insightTitle", sub: "insightType" } },
    { tab: "businessHealthScores", plural: "businessHealthScores", singular: "BusinessHealthScore", pascal: "BusinessHealthScore", db: "eipBusinessHealthScores", fields: [{ name: "scoreKey", type: "string" }, { name: "scoreName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "scoreName", sub: "healthScore" } },
    { tab: "operationalEfficiencyScores", plural: "operationalEfficiencyScores", singular: "OperationalEfficiencyScore", pascal: "OperationalEfficiencyScore", db: "eipOperationalEfficiencyScores", fields: [{ name: "scoreKey", type: "string" }, { name: "scoreName", type: "string" }, { name: "efficiencyScore", type: "number" }], display: { title: "scoreName", sub: "efficiencyScore" } },
    { tab: "growthScores", plural: "growthScores", singular: "GrowthScore", pascal: "GrowthScore", db: "eipGrowthScores", fields: [{ name: "scoreKey", type: "string" }, { name: "scoreName", type: "string" }, { name: "growthScore", type: "number" }], display: { title: "scoreName", sub: "growthScore" } },
    { tab: "strategicInsights", plural: "strategicInsights", singular: "StrategicInsight", pascal: "StrategicInsight", db: "eipStrategicInsights", fields: [{ name: "insightKey", type: "string" }, { name: "insightTitle", type: "string" }, { name: "insightPriority", type: "string" }], display: { title: "insightTitle", sub: "insightPriority" } },
    { tab: "revenueForecasts", plural: "revenueForecasts", singular: "RevenueForecast", pascal: "RevenueForecast", db: "eipRevenueForecasts", fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "forecastTotal", type: "number" }], display: { title: "forecastName", sub: "forecastTotal" } },
    { tab: "customerGrowthForecasts", plural: "customerGrowthForecasts", singular: "CustomerGrowthForecast", pascal: "CustomerGrowthForecast", db: "eipCustomerGrowthForecasts", fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "growthTotal", type: "number" }], display: { title: "forecastName", sub: "growthTotal" } },
    { tab: "renewalForecasts", plural: "renewalForecasts", singular: "RenewalForecast", pascal: "RenewalForecast", db: "eipRenewalForecasts", fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "renewalRate", type: "number" }], display: { title: "forecastName", sub: "renewalRate" } },
    { tab: "capacityPlanning", plural: "capacityPlanning", singular: "CapacityPlanning", pascal: "CapacityPlanning", db: "eipCapacityPlanning", fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "capacityUnits", type: "number" }], display: { title: "planName", sub: "capacityUnits" } },
    { tab: "operationalTrends", plural: "operationalTrends", singular: "OperationalTrend", pascal: "OperationalTrend", db: "eipOperationalTrends", fields: [{ name: "trendKey", type: "string" }, { name: "trendName", type: "string" }, { name: "trendDirection", type: "string" }], display: { title: "trendName", sub: "trendDirection" } },
    { tab: "riskForecasts", plural: "riskForecasts", singular: "RiskForecast", pascal: "RiskForecast", db: "eipRiskForecasts", fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "riskScore", type: "number" }], display: { title: "forecastName", sub: "riskScore" } },
    { tab: "dailyExecutiveBriefs", plural: "dailyExecutiveBriefs", singular: "DailyExecutiveBrief", pascal: "DailyExecutiveBrief", db: "eipDailyExecutiveBriefs", fields: [{ name: "briefKey", type: "string" }, { name: "briefTitle", type: "string" }, { name: "briefDate", type: "string" }], display: { title: "briefTitle", sub: "briefDate" } },
    { tab: "weeklyBusinessSummaries", plural: "weeklyBusinessSummaries", singular: "WeeklyBusinessSummary", pascal: "WeeklyBusinessSummary", db: "eipWeeklyBusinessSummaries", fields: [{ name: "summaryKey", type: "string" }, { name: "summaryTitle", type: "string" }, { name: "summaryWeek", type: "string" }], display: { title: "summaryTitle", sub: "summaryWeek" } },
    { tab: "monthlyPerformanceReports", plural: "monthlyPerformanceReports", singular: "MonthlyPerformanceReport", pascal: "MonthlyPerformanceReport", db: "eipMonthlyPerformanceReports", fields: [{ name: "reportKey", type: "string" }, { name: "reportTitle", type: "string" }, { name: "reportMonth", type: "string" }], display: { title: "reportTitle", sub: "reportMonth" } },
    { tab: "quarterlyExecutiveReviews", plural: "quarterlyExecutiveReviews", singular: "QuarterlyExecutiveReview", pascal: "QuarterlyExecutiveReview", db: "eipQuarterlyExecutiveReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "reviewTitle", type: "string" }, { name: "reviewQuarter", type: "string" }], display: { title: "reviewTitle", sub: "reviewQuarter" } },
    { tab: "annualBusinessReports", plural: "annualBusinessReports", singular: "AnnualBusinessReport", pascal: "AnnualBusinessReport", db: "eipAnnualBusinessReports", fields: [{ name: "reportKey", type: "string" }, { name: "reportTitle", type: "string" }, { name: "reportYear", type: "string" }], display: { title: "reportTitle", sub: "reportYear" } },
    { tab: "kpiServiceConfigs", plural: "kpiServiceConfigs", singular: "KpiServiceConfig", pascal: "KpiServiceConfig", db: "eipKpiServiceConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "configStatus", type: "select", options: "CONFIG_STATUS_OPTIONS" }], display: { title: "configName", sub: "configStatus" } },
    { tab: "intelligenceServiceConfigs", plural: "intelligenceServiceConfigs", singular: "IntelligenceServiceConfig", pascal: "IntelligenceServiceConfig", db: "eipIntelligenceServiceConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "configStatus", type: "select", options: "CONFIG_STATUS_OPTIONS" }], display: { title: "configName", sub: "configStatus" } },
    { tab: "forecastServiceConfigs", plural: "forecastServiceConfigs", singular: "ForecastServiceConfig", pascal: "ForecastServiceConfig", db: "eipForecastServiceConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "configStatus", type: "select", options: "CONFIG_STATUS_OPTIONS" }], display: { title: "configName", sub: "configStatus" } },
    { tab: "intelligenceMetrics", plural: "intelligenceMetrics", singular: "IntelligenceMetric", pascal: "IntelligenceMetric", db: "eipIntelligenceMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "unifiedKpiScore", type: "number" }, { name: "overallIntelligenceScore", type: "number" }], display: { title: "metricsKey", sub: "overallIntelligenceScore" } },
    { tab: "intelligenceHealth", plural: "intelligenceHealth", singular: "IntelligenceHealth", pascal: "IntelligenceHealth", db: "eipIntelligenceHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "missionProgress", plural: "missionProgress", singular: "MissionProgress", pascal: "MissionProgress", db: "eipMissionProgress", fields: [{ name: "progressKey", type: "string" }, { name: "progressName", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressName", sub: "progressPercent" } },
    { tab: "intelligenceFailures", plural: "intelligenceFailures", singular: "IntelligenceFailure", pascal: "IntelligenceFailure", db: "eipIntelligenceFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const entities = \[[\s\S]*?\];/, eipEntitiesBlock);

const reps = [
    [/operatedHubs/g, "intelligenceHubs"],
    [/operatedHubOptions/g, "intelligenceHubOptions"],
    [/getOperatedHubs/g, "getIntelligenceHubs"],
    [/getOperatedHubOptions/g, "getIntelligenceHubOptions"],
    [/OperatedHubSelect/g, "IntelligenceHubSelect"],
    [/buildOperatedHubLookupMaps/g, "buildIntelligenceHubLookupMaps"],
    [/operatedHubId/g, "intelligenceHubId"],
    [/Operated Hubs/g, "Intelligence Hubs"],
    [/Customer Operated Platform/g, "Enterprise Intelligence Platform"],
    [/operated hub/g, "intelligence hub"],
    [/OperatedHub/g, "IntelligenceHub"],
    [/OperatedMetric/g, "IntelligenceMetric"],
    [/OperatedHealth/g, "IntelligenceHealth"],
    [/PlatformFailure/g, "IntelligenceFailure"],
    [/CustomerOperatedPlatformPage/g, "EnterpriseIntelligencePlatformPage"],
    [/CustomerOperatedPlatformStats/g, "EnterpriseIntelligencePlatformStats"],
    [/CustomerOperatedPlatformPanels/g, "EnterpriseIntelligencePlatformPanels"],
    [/CustomerOperatedPlatformService/g, "EnterpriseIntelligencePlatformService"],
    [/CustomerOperatedPlatformClient/g, "EnterpriseIntelligencePlatformClient"],
    [/buildCop/g, "buildEip"],
    [/mapCop/g, "mapEip"],
    [/CopDashboardStats/g, "EipDashboardStats"],
    [/CopPipelineInfo/g, "EipPipelineInfo"],
    [/CopSdk/g, "EipSdk"],
    [/COP_TABS/g, "EIP_TABS"],
    [/COP_THEME/g, "EIP_THEME"],
    [/COP_PERMISSIONS/g, "EIP_PERMISSIONS"],
    [/COP_STATUS_OPTIONS/g, "EIP_STATUS_OPTIONS"],
    [/Launch Ready to Customer Operated/g, "Enterprise Intelligence Platform"],
    [/violet-600/g, "fuchsia-600"],
    [/violet-500/g, "fuchsia-500"],
    [/violet-400/g, "fuchsia-400"],
    [/violet-300/g, "fuchsia-300"],
    [/ring-violet/g, "ring-fuchsia"],
    [/bg-violet/g, "bg-fuchsia"],
    [/text-violet/g, "text-fuchsia"],
    [/hover:bg-violet/g, "hover:bg-fuchsia"],
    [/hover:border-violet/g, "hover:border-fuchsia"],
    [/mapSignupFlowForStats/g, "mapKpiRegistryForStats"],
    [/mapDeploymentJobForStats/g, "mapExecutiveDashboardForStats"],
    [/mapOperatedMetricForStats/g, "mapIntelligenceMetricForStats"],
    [/mapProductionProfileForStats/g, "mapRevenueForecastForStats"],
    [/mapCentralLogForStats/g, "mapCrossModuleInsightForStats"],
    [/mapOperatedHealthForStats/g, "mapIntelligenceHealthForStats"],
    [/mapPlatformFailureForStats/g, "mapIntelligenceFailureForStats"],
    [/signupFlows/g, "kpiRegistry"],
    [/deploymentJobs/g, "executiveDashboards"],
    [/productionProfiles/g, "revenueForecasts"],
    [/centralLogs/g, "crossModuleInsights"],
    [/onboardingWizards/g, "strategicInsights"],
    [/operatedMetrics/g, "intelligenceMetrics"],
    [/operatedHealth/g, "intelligenceHealth"],
    [/platformFailures/g, "intelligenceFailures"],
    [/totalOperatedHubs/g, "totalIntelligenceHubs"],
    [/activeOperatedHubs/g, "activeIntelligenceHubs"],
    [/signupFlowCount/g, "kpiRegistryCount"],
    [/deploymentJobCount/g, "executiveDashboardCount"],
    [/productionProfileCount/g, "revenueForecastCount"],
    [/centralLogCount/g, "crossModuleInsightCount"],
    [/onboardingWizardCount/g, "strategicInsightCount"],
    [/openPlatformFailureCount/g, "openIntelligenceFailureCount"],
    [/overallOperatedScore/g, "overallIntelligenceScore"],
    [/onboardingCompletionRate/g, "unifiedKpiScore"],
    [/activeIncidentCount/g, "businessHealthScore"],
    [/pendingApprovalCount/g, "operationalEfficiencyScore"],
    [/platformAvailabilityScore/g, "growthScore"],
    [/productionStatusScore/g, "riskScore"],
    [/customerSatisfactionScore/g, "revenueForecastTotal"],
    [/revenueToday/g, "customerForecastTotal"],
    [/sdkLaunchOnboarding/g, "sdkRunKpiService"],
    [/sdkDeployProduction/g, "sdkRunIntelligenceService"],
    [/sdkMonitorPlatform/g, "sdkRunForecastService"],
    [/launchOnboarding/g, "runKpiService"],
    [/deployProduction/g, "runIntelligenceService"],
    [/monitorPlatform/g, "runForecastService"],
    [/createSignupFlow/g, "createKpiRegistry"],
    [/createDeploymentJob/g, "createExecutiveDashboard"],
    [/createOnboardingWizard/g, "createStrategicInsight"],
    [/Launch onboarding flow/g, "Run KPI service"],
    [/Deploy production job/g, "Run intelligence service"],
    [/Monitor platform health/g, "Run forecast service"],
    [/customer_operated_platform/g, "enterprise_intelligence_platform"],
    [/launch_onboarding/g, "run_kpi_service"],
    [/monitor_platform/g, "run_forecast_service"],
    [/"cop\.view"/g, '"eip.view"'],
    [/"cop\.manage"/g, '"eip.manage"'],
    [/"cop\.approve"/g, '"eip.approve"'],
    [/"cop\.admin"/g, '"eip.admin"'],
    [/copOperatedHubs/g, "eipIntelligenceHubs"],
    [/getPlatformFailures/g, "getIntelligenceFailures"],
    [/customer-operated-platform-mappers/g, "enterprise-intelligence-platform-mappers"],
    [/buildOperatedHubPayload/g, "buildIntelligenceHubPayload"],
    [/mapOperatedHubSummary/g, "mapIntelligenceHubSummary"],
    [/buildCopAuditPayload/g, "buildEipAuditPayload"],
    [/createCustomerOperatedPlatformClient/g, "createEnterpriseIntelligencePlatformClient"],
    [/databaseService\.cop/g, "databaseService.eip"],
    [/useCustomerOperatedPlatform/g, "useEnterpriseIntelligencePlatform"],
    [/customerOperatedPlatformService/g, "enterpriseIntelligencePlatformService"],
    [/customer-operated-platform\.service/g, "enterprise-intelligence-platform.service"],
    [/@\/src\/modules\/customer-operated-platform\//g, "@/src/modules/enterprise-intelligence-platform/"],
    [/\/customer-operated-platform\/page/g, "/enterprise-intelligence-platform/page"],
    [/app\/\(shell\)\/customer-operated-platform/g, "app/(shell)/enterprise-intelligence-platform"],
    [/CopSdkLaunchOnboardingInput/g, "EipSdkRunKpiServiceInput"],
    [/CopSdkLaunchOnboardingResult/g, "EipSdkRunKpiServiceResult"],
    [/CopSdkDeployProductionInput/g, "EipSdkRunIntelligenceServiceInput"],
    [/CopSdkDeployProductionResult/g, "EipSdkRunIntelligenceServiceResult"],
    [/CopSdkMonitorPlatformInput/g, "EipSdkRunForecastServiceInput"],
    [/CopSdkMonitorPlatformResult/g, "EipSdkRunForecastServiceResult"],
    [/customer-operated-platform/g, "enterprise-intelligence-platform"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(
    /import { createCompanyFoundationClient } from "@\/src\/modules\/company-foundation\/sdk";\r?\nimport { createCustomerSuccessDeliveryClient } from "@\/src\/modules\/customer-success-delivery\/sdk";\r?\nimport { crmService } from "@\/src\/modules\/crm\/services\/crm\.service";/,
    `import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";`,
);

s = s.replace(
    /async getDashboardStats\(authUserId: string, email: string, fullName\?: string \| null\): Promise<EipDashboardStats> \{[\s\S]*?getPipelineInfo\(\): EipPipelineInfo/,
    `async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<EipDashboardStats> {
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

    getPipelineInfo(): EipPipelineInfo`,
);

s = s.replace(
    /async sdkRunKpiService\(authUserId: string, email: string, input: EipSdk[\s\S]*?return \{ flowId: created\.id, flowKey: created\.flowKey, status: created\.status \};\r?\n    \}/,
    `async sdkRunKpiService(authUserId: string, email: string, input: EipSdkRunKpiServiceInput, fullName?: string | null): Promise<EipSdkRunKpiServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createKpiRegistry(authUserId, email, { intelligenceHubId: input.intelligenceHubId, kpiKey: input.kpiKey, kpiName: input.kpiName }, fullName);
        return { kpiId: created.id, kpiKey: created.kpiKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunIntelligenceService\(authUserId: string, email: string, input: EipSdk[\s\S]*?return \{ jobId: created\.id, jobKey: created\.jobKey, status: created\.status \};\r?\n    \}/,
    `async sdkRunIntelligenceService(authUserId: string, email: string, input: EipSdkRunIntelligenceServiceInput, fullName?: string | null): Promise<EipSdkRunIntelligenceServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createExecutiveDashboard(authUserId, email, { intelligenceHubId: input.intelligenceHubId, dashboardKey: input.dashboardKey, dashboardName: input.dashboardName }, fullName);
        return { dashboardId: created.id, dashboardKey: created.dashboardKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunForecastService\(authUserId: string, email: string, input: EipSdk[\s\S]*?return \{ wizardId: created\.id, wizardKey: created\.wizardKey, status: created\.status \};\r?\n    \}/,
    `async sdkRunForecastService(authUserId: string, email: string, input: EipSdkRunForecastServiceInput, fullName?: string | null): Promise<EipSdkRunForecastServiceResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
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
    }`,
);

const eipOptionsBlock = `export const KPI_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const CATEGORY_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const CONFIG_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "failed", label: "Failed" },
] as const;

export const EIP_PERMISSIONS = ["eip.view", "eip.manage", "eip.approve", "eip.admin"] as const;

export const EIP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const EIP_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const EIP_THEME)/,
    `$1${eipOptionsBlock}$2`,
);

s = s.replace(
    /\/\/ --- sdk ---[\s\S]*?export \{ enterpriseIntelligencePlatformService \};\r?\n`\);/,
    `// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), \`import { enterpriseIntelligencePlatformService } from "@/src/modules/enterprise-intelligence-platform/services/enterprise-intelligence-platform.service";
import type { EipSdkRunKpiServiceInput, EipSdkRunIntelligenceServiceInput, EipSdkRunForecastServiceInput, EipSdkRunReportingServiceInput, EipSdkRunExecutiveInsightServiceInput } from "@/src/modules/enterprise-intelligence-platform/types";

export class KpiService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunKpiServiceInput) { return this.client.runKpiService(input); }
}

export class IntelligenceService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunIntelligenceServiceInput) { return this.client.runIntelligenceService(input); }
}

export class ForecastService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunForecastServiceInput) { return this.client.runForecastService(input); }
}

export class ReportingService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunReportingServiceInput) { return this.client.runReportingService(input); }
}

export class ExecutiveInsightService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunExecutiveInsightServiceInput) { return this.client.runExecutiveInsightService(input); }
}

export class EnterpriseIntelligencePlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly kpiService = new KpiService(this);
    readonly intelligenceService = new IntelligenceService(this);
    readonly forecastService = new ForecastService(this);
    readonly reportingService = new ReportingService(this);
    readonly executiveInsightService = new ExecutiveInsightService(this);

    async runKpiService(input: EipSdkRunKpiServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunKpiService(this.authUserId, this.email, input, this.fullName);
    }

    async runIntelligenceService(input: EipSdkRunIntelligenceServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunIntelligenceService(this.authUserId, this.email, input, this.fullName);
    }

    async runForecastService(input: EipSdkRunForecastServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunForecastService(this.authUserId, this.email, input, this.fullName);
    }

    async runReportingService(input: EipSdkRunReportingServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunReportingService(this.authUserId, this.email, input, this.fullName);
    }

    async runExecutiveInsightService(input: EipSdkRunExecutiveInsightServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunExecutiveInsightService(this.authUserId, this.email, input, this.fullName);
    }

    async getIntelligenceHubs() {
        return enterpriseIntelligencePlatformService.getIntelligenceHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return enterpriseIntelligencePlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return enterpriseIntelligencePlatformService.getPipelineInfo();
    }
}

export function createEnterpriseIntelligencePlatformClient(authUserId: string, email: string, fullName?: string | null): EnterpriseIntelligencePlatformClient {
    return new EnterpriseIntelligencePlatformClient(authUserId, email, fullName);
}

export { enterpriseIntelligencePlatformService };
\`);`,
);

s = s.replace(/Select operated hub/g, "Select intelligence hub");
s = s.replace(/FLOW_STATUS_OPTIONS/g, "KPI_STATUS_OPTIONS");
s = s.replace(/PROVISION_STATUS_OPTIONS/g, "CATEGORY_STATUS_OPTIONS");
s = s.replace(/WIZARD_STATUS_OPTIONS/g, "DASHBOARD_STATUS_OPTIONS");
s = s.replace(/VALIDATION_STATUS_OPTIONS/g, "CONFIG_STATUS_OPTIONS");
s = s.replace(/ROLLBACK_STATUS_OPTIONS/g, "CONFIG_STATUS_OPTIONS");
s = s.replace(/INCIDENT_STATUS_OPTIONS/g, "CONFIG_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-enterprise-intelligence-platform-ui.mjs");
