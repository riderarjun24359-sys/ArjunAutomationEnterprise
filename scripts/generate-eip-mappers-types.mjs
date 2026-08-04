#!/usr/bin/env node
/**
 * Generates enterprise-intelligence-platform-mappers.ts and types/index.ts.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "IntelligenceHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "KpiRegistry", key: "kpi_key", title: "kpi_name", sub: "kpi_status", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiStatus"] },
    { pascal: "KpiAggregation", key: "aggregation_key", title: "aggregation_name", sub: "aggregation_type", hub: true, orgOnly: false, createFields: ["aggregationKey", "aggregationName", "aggregationType"] },
    { pascal: "KpiCategory", key: "category_key", title: "category_name", sub: "category_status", hub: true, orgOnly: false, createFields: ["categoryKey", "categoryName", "categoryStatus"] },
    { pascal: "KpiTarget", key: "target_key", title: "target_name", sub: "target_value", hub: true, orgOnly: false, createFields: ["targetKey", "targetName", "targetValue"] },
    { pascal: "KpiThreshold", key: "threshold_key", title: "threshold_name", sub: "threshold_value", hub: true, orgOnly: false, createFields: ["thresholdKey", "thresholdName", "thresholdValue"] },
    { pascal: "KpiSnapshot", key: "snapshot_key", title: "snapshot_name", sub: "snapshot_value", hub: true, orgOnly: false, createFields: ["snapshotKey", "snapshotName", "snapshotValue"] },
    { pascal: "ExecutiveDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_status", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardStatus"] },
    { pascal: "CrossModuleInsight", key: "insight_key", title: "insight_title", sub: "insight_type", hub: true, orgOnly: false, createFields: ["insightKey", "insightTitle", "insightType"] },
    { pascal: "BusinessHealthScore", key: "score_key", title: "score_name", sub: "health_score", hub: true, orgOnly: false, createFields: ["scoreKey", "scoreName", "healthScore"] },
    { pascal: "OperationalEfficiencyScore", key: "score_key", title: "score_name", sub: "efficiency_score", hub: true, orgOnly: false, createFields: ["scoreKey", "scoreName", "efficiencyScore"] },
    { pascal: "GrowthScore", key: "score_key", title: "score_name", sub: "growth_score", hub: true, orgOnly: false, createFields: ["scoreKey", "scoreName", "growthScore"] },
    { pascal: "StrategicInsight", key: "insight_key", title: "insight_title", sub: "insight_priority", hub: true, orgOnly: false, createFields: ["insightKey", "insightTitle", "insightPriority"] },
    { pascal: "RevenueForecast", key: "forecast_key", title: "forecast_name", sub: "forecast_total", hub: true, orgOnly: false, createFields: ["forecastKey", "forecastName", "forecastTotal"] },
    { pascal: "CustomerGrowthForecast", key: "forecast_key", title: "forecast_name", sub: "growth_total", hub: true, orgOnly: false, createFields: ["forecastKey", "forecastName", "growthTotal"] },
    { pascal: "RenewalForecast", key: "forecast_key", title: "forecast_name", sub: "renewal_rate", hub: true, orgOnly: false, createFields: ["forecastKey", "forecastName", "renewalRate"] },
    { pascal: "CapacityPlanning", key: "plan_key", title: "plan_name", sub: "capacity_units", hub: true, orgOnly: false, createFields: ["planKey", "planName", "capacityUnits"] },
    { pascal: "OperationalTrend", key: "trend_key", title: "trend_name", sub: "trend_direction", hub: true, orgOnly: false, createFields: ["trendKey", "trendName", "trendDirection"] },
    { pascal: "RiskForecast", key: "forecast_key", title: "forecast_name", sub: "risk_score", hub: true, orgOnly: false, createFields: ["forecastKey", "forecastName", "riskScore"] },
    { pascal: "DailyExecutiveBrief", key: "brief_key", title: "brief_title", sub: "brief_date", hub: true, orgOnly: false, createFields: ["briefKey", "briefTitle", "briefDate"] },
    { pascal: "WeeklyBusinessSummary", key: "summary_key", title: "summary_title", sub: "summary_week", hub: true, orgOnly: false, createFields: ["summaryKey", "summaryTitle", "summaryWeek"] },
    { pascal: "MonthlyPerformanceReport", key: "report_key", title: "report_title", sub: "report_month", hub: true, orgOnly: false, createFields: ["reportKey", "reportTitle", "reportMonth"] },
    { pascal: "QuarterlyExecutiveReview", key: "review_key", title: "review_title", sub: "review_quarter", hub: true, orgOnly: false, createFields: ["reviewKey", "reviewTitle", "reviewQuarter"] },
    { pascal: "AnnualBusinessReport", key: "report_key", title: "report_title", sub: "report_year", hub: true, orgOnly: false, createFields: ["reportKey", "reportTitle", "reportYear"] },
    { pascal: "KpiServiceConfig", key: "config_key", title: "config_name", sub: "config_status", hub: true, orgOnly: false, createFields: ["configKey", "configName", "configStatus"] },
    { pascal: "IntelligenceServiceConfig", key: "config_key", title: "config_name", sub: "config_status", hub: true, orgOnly: false, createFields: ["configKey", "configName", "configStatus"] },
    { pascal: "ForecastServiceConfig", key: "config_key", title: "config_name", sub: "config_status", hub: true, orgOnly: false, createFields: ["configKey", "configName", "configStatus"] },
    { pascal: "IntelligenceMetric", key: "metrics_key", title: "metrics_key", sub: "overall_intelligence_score", hub: false, orgOnly: true, createFields: ["metricsKey", "unifiedKpiScore", "overallIntelligenceScore"] },
    { pascal: "IntelligenceHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "MissionProgress", key: "progress_key", title: "progress_name", sub: "progress_percent", hub: true, orgOnly: false, createFields: ["progressKey", "progressName", "progressPercent"] },
    { pascal: "IntelligenceFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "targetValue", "thresholdValue", "snapshotValue", "healthScore", "efficiencyScore", "growthScore",
    "forecastTotal", "growthTotal", "renewalRate", "capacityUnits", "riskScore", "progressPercent",
    "unifiedKpiScore", "overallIntelligenceScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface EipDashboardStats {
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

`;
    for (const e of entities) {
        const isHub = e.pascal === "IntelligenceHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    intelligenceHubId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "hubName?: string;\n    "}${summaryFields}
    status: string;
}

export interface Create${e.pascal}Input {
    ${createExtra}${fields}
}

`;
    }
    return t;
}

function buildMappers() {
    const dbImports = entities.map((e) => `DbEip${e.pascal}`).concat(["DbEipAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["EipDashboardStats", "EipPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/enterprise-intelligence-platform/types";

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

`;

    for (const e of entities) {
        const isHub = e.pascal === "IntelligenceHub";
        const mapFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const cast = boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string";
            return `        ${f}: record.${snake} as ${cast},`;
        }).join("\n");
        const payloadFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const def = boolFields.has(f) ? "false" : numFields.has(f) ? "0" : "''";
            return `        ${snake}: input.${f} ?? ${def},`;
        }).join("\n");
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.intelligenceHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbEip${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
    return {
        id: record.id,
${hubNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${hubLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapKpiRegistryForStats(r: DbEipKpiRegistry) { return { kpi_status: r.kpi_status, status: r.status }; }
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
`;

    return m;
}

mkdirSync(join(root, "src/modules/enterprise-intelligence-platform/types"), { recursive: true });
writeFileSync(join(root, "src/modules/enterprise-intelligence-platform/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/enterprise-intelligence-platform-mappers.ts"), buildMappers(), "utf8");
console.log("Generated EIP types and mappers");
