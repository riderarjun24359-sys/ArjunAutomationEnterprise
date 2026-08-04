#!/usr/bin/env node
/**
 * Generates V2 Enterprise Intelligence Platform artifacts.
 * Run: node scripts/generate-enterprise-intelligence-platform.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "eip";
const Pascal = "Eip";
const camel = "eip";
const permResource = "enterprise_intelligence_platform";

const hubTable = `${PREFIX}_intelligence_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_intelligence_metrics`, `${PREFIX}_intelligence_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "intelligenceHubs", plural: "intelligenceHubs", singular: "IntelligenceHub", pascal: "IntelligenceHub", db: `${camel}IntelligenceHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  intelligence_tier text not null default 'enterprise'" },
    { tab: "kpiRegistry", plural: "kpiRegistry", singular: "KpiRegistry", pascal: "KpiRegistry", db: `${camel}KpiRegistry`, table: `${PREFIX}_kpi_registry`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiStatus", type: "select", options: "KPI_STATUS_OPTIONS" }], display: { title: "kpiName", sub: "kpiStatus" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_status text not null default 'active',\n  kpi_category text not null default 'general',\n  kpi_type text not null default 'counter'" },
    { tab: "kpiAggregations", plural: "kpiAggregations", singular: "KpiAggregation", pascal: "KpiAggregation", db: `${camel}KpiAggregations`, table: `${PREFIX}_kpi_aggregations`, fields: [{ name: "aggregationKey", type: "string" }, { name: "aggregationName", type: "string" }, { name: "aggregationType", type: "string" }], display: { title: "aggregationName", sub: "aggregationType" }, sqlExtra: "aggregation_key text not null,\n  aggregation_name text not null default '',\n  aggregation_type text not null default 'sum',\n  window_size text not null default 'daily',\n  computed_at timestamptz not null default now()" },
    { tab: "kpiCategories", plural: "kpiCategories", singular: "KpiCategory", pascal: "KpiCategory", db: `${camel}KpiCategories`, table: `${PREFIX}_kpi_categories`, fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryStatus", type: "select", options: "CATEGORY_STATUS_OPTIONS" }], display: { title: "categoryName", sub: "categoryStatus" }, sqlExtra: "category_key text not null,\n  category_name text not null default '',\n  category_status text not null default 'active',\n  parent_category text not null default '',\n  sort_order integer not null default 0" },
    { tab: "kpiTargets", plural: "kpiTargets", singular: "KpiTarget", pascal: "KpiTarget", db: `${camel}KpiTargets`, table: `${PREFIX}_kpi_targets`, fields: [{ name: "targetKey", type: "string" }, { name: "targetName", type: "string" }, { name: "targetValue", type: "number" }], display: { title: "targetName", sub: "targetValue" }, sqlExtra: "target_key text not null,\n  target_name text not null default '',\n  target_value numeric(12, 2) not null default 0,\n  target_period text not null default 'monthly',\n  kpi_ref text not null default ''" },
    { tab: "kpiThresholds", plural: "kpiThresholds", singular: "KpiThreshold", pascal: "KpiThreshold", db: `${camel}KpiThresholds`, table: `${PREFIX}_kpi_thresholds`, fields: [{ name: "thresholdKey", type: "string" }, { name: "thresholdName", type: "string" }, { name: "thresholdValue", type: "number" }], display: { title: "thresholdName", sub: "thresholdValue" }, sqlExtra: "threshold_key text not null,\n  threshold_name text not null default '',\n  threshold_value numeric(12, 2) not null default 0,\n  threshold_type text not null default 'warning',\n  kpi_ref text not null default ''" },
    { tab: "kpiSnapshots", plural: "kpiSnapshots", singular: "KpiSnapshot", pascal: "KpiSnapshot", db: `${camel}KpiSnapshots`, table: `${PREFIX}_kpi_snapshots`, fields: [{ name: "snapshotKey", type: "string" }, { name: "snapshotName", type: "string" }, { name: "snapshotValue", type: "number" }], display: { title: "snapshotName", sub: "snapshotValue" }, sqlExtra: "snapshot_key text not null,\n  snapshot_name text not null default '',\n  snapshot_value numeric(12, 2) not null default 0,\n  snapshot_date date not null default current_date,\n  kpi_ref text not null default ''" },
    { tab: "executiveDashboards", plural: "executiveDashboards", singular: "ExecutiveDashboard", pascal: "ExecutiveDashboard", db: `${camel}ExecutiveDashboards`, table: `${PREFIX}_executive_dashboards`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_status text not null default 'active',\n  widget_count integer not null default 0,\n  refresh_cadence text not null default 'daily'" },
    { tab: "crossModuleInsights", plural: "crossModuleInsights", singular: "CrossModuleInsight", pascal: "CrossModuleInsight", db: `${camel}CrossModuleInsights`, table: `${PREFIX}_cross_module_insights`, fields: [{ name: "insightKey", type: "string" }, { name: "insightTitle", type: "string" }, { name: "insightType", type: "string" }], display: { title: "insightTitle", sub: "insightType" }, sqlExtra: "insight_key text not null,\n  insight_title text not null default '',\n  insight_type text not null default 'cross_module',\n  source_modules jsonb not null default '[]'::jsonb,\n  confidence_score numeric(5, 2) not null default 0" },
    { tab: "businessHealthScores", plural: "businessHealthScores", singular: "BusinessHealthScore", pascal: "BusinessHealthScore", db: `${camel}BusinessHealthScores`, table: `${PREFIX}_business_health_scores`, fields: [{ name: "scoreKey", type: "string" }, { name: "scoreName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "scoreName", sub: "healthScore" }, sqlExtra: "score_key text not null,\n  score_name text not null default '',\n  health_score numeric(5, 2) not null default 100,\n  score_date date not null default current_date,\n  dimension text not null default 'overall'" },
    { tab: "operationalEfficiencyScores", plural: "operationalEfficiencyScores", singular: "OperationalEfficiencyScore", pascal: "OperationalEfficiencyScore", db: `${camel}OperationalEfficiencyScores`, table: `${PREFIX}_operational_efficiency_scores`, fields: [{ name: "scoreKey", type: "string" }, { name: "scoreName", type: "string" }, { name: "efficiencyScore", type: "number" }], display: { title: "scoreName", sub: "efficiencyScore" }, sqlExtra: "score_key text not null,\n  score_name text not null default '',\n  efficiency_score numeric(5, 2) not null default 100,\n  score_date date not null default current_date,\n  process_area text not null default 'operations'" },
    { tab: "growthScores", plural: "growthScores", singular: "GrowthScore", pascal: "GrowthScore", db: `${camel}GrowthScores`, table: `${PREFIX}_growth_scores`, fields: [{ name: "scoreKey", type: "string" }, { name: "scoreName", type: "string" }, { name: "growthScore", type: "number" }], display: { title: "scoreName", sub: "growthScore" }, sqlExtra: "score_key text not null,\n  score_name text not null default '',\n  growth_score numeric(5, 2) not null default 100,\n  score_date date not null default current_date,\n  growth_dimension text not null default 'revenue'" },
    { tab: "strategicInsights", plural: "strategicInsights", singular: "StrategicInsight", pascal: "StrategicInsight", db: `${camel}StrategicInsights`, table: `${PREFIX}_strategic_insights`, fields: [{ name: "insightKey", type: "string" }, { name: "insightTitle", type: "string" }, { name: "insightPriority", type: "string" }], display: { title: "insightTitle", sub: "insightPriority" }, sqlExtra: "insight_key text not null,\n  insight_title text not null default '',\n  insight_priority text not null default 'medium',\n  insight_type text not null default 'strategic',\n  summary text not null default ''" },
    { tab: "revenueForecasts", plural: "revenueForecasts", singular: "RevenueForecast", pascal: "RevenueForecast", db: `${camel}RevenueForecasts`, table: `${PREFIX}_revenue_forecasts`, fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "forecastTotal", type: "number" }], display: { title: "forecastName", sub: "forecastTotal" }, sqlExtra: "forecast_key text not null,\n  forecast_name text not null default '',\n  forecast_total numeric(14, 2) not null default 0,\n  forecast_horizon text not null default 'quarterly',\n  confidence_level numeric(5, 2) not null default 80" },
    { tab: "customerGrowthForecasts", plural: "customerGrowthForecasts", singular: "CustomerGrowthForecast", pascal: "CustomerGrowthForecast", db: `${camel}CustomerGrowthForecasts`, table: `${PREFIX}_customer_growth_forecasts`, fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "growthTotal", type: "number" }], display: { title: "forecastName", sub: "growthTotal" }, sqlExtra: "forecast_key text not null,\n  forecast_name text not null default '',\n  growth_total numeric(12, 2) not null default 0,\n  forecast_horizon text not null default 'quarterly',\n  segment text not null default 'all'" },
    { tab: "renewalForecasts", plural: "renewalForecasts", singular: "RenewalForecast", pascal: "RenewalForecast", db: `${camel}RenewalForecasts`, table: `${PREFIX}_renewal_forecasts`, fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "renewalRate", type: "number" }], display: { title: "forecastName", sub: "renewalRate" }, sqlExtra: "forecast_key text not null,\n  forecast_name text not null default '',\n  renewal_rate numeric(5, 2) not null default 0,\n  forecast_horizon text not null default 'annual',\n  cohort_ref text not null default ''" },
    { tab: "capacityPlanning", plural: "capacityPlanning", singular: "CapacityPlanning", pascal: "CapacityPlanning", db: `${camel}CapacityPlanning`, table: `${PREFIX}_capacity_planning`, fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "capacityUnits", type: "number" }], display: { title: "planName", sub: "capacityUnits" }, sqlExtra: "plan_key text not null,\n  plan_name text not null default '',\n  capacity_units numeric(12, 2) not null default 0,\n  plan_horizon text not null default 'quarterly',\n  resource_type text not null default 'compute'" },
    { tab: "operationalTrends", plural: "operationalTrends", singular: "OperationalTrend", pascal: "OperationalTrend", db: `${camel}OperationalTrends`, table: `${PREFIX}_operational_trends`, fields: [{ name: "trendKey", type: "string" }, { name: "trendName", type: "string" }, { name: "trendDirection", type: "string" }], display: { title: "trendName", sub: "trendDirection" }, sqlExtra: "trend_key text not null,\n  trend_name text not null default '',\n  trend_direction text not null default 'stable',\n  trend_value numeric(12, 2) not null default 0,\n  measured_at timestamptz not null default now()" },
    { tab: "riskForecasts", plural: "riskForecasts", singular: "RiskForecast", pascal: "RiskForecast", db: `${camel}RiskForecasts`, table: `${PREFIX}_risk_forecasts`, fields: [{ name: "forecastKey", type: "string" }, { name: "forecastName", type: "string" }, { name: "riskScore", type: "number" }], display: { title: "forecastName", sub: "riskScore" }, sqlExtra: "forecast_key text not null,\n  forecast_name text not null default '',\n  risk_score numeric(5, 2) not null default 0,\n  risk_category text not null default 'operational',\n  forecast_horizon text not null default 'quarterly'" },
    { tab: "dailyExecutiveBriefs", plural: "dailyExecutiveBriefs", singular: "DailyExecutiveBrief", pascal: "DailyExecutiveBrief", db: `${camel}DailyExecutiveBriefs`, table: `${PREFIX}_daily_executive_briefs`, fields: [{ name: "briefKey", type: "string" }, { name: "briefTitle", type: "string" }, { name: "briefDate", type: "string" }], display: { title: "briefTitle", sub: "briefDate" }, sqlExtra: "brief_key text not null,\n  brief_title text not null default '',\n  brief_date date not null default current_date,\n  summary text not null default '',\n  priority_items jsonb not null default '[]'::jsonb" },
    { tab: "weeklyBusinessSummaries", plural: "weeklyBusinessSummaries", singular: "WeeklyBusinessSummary", pascal: "WeeklyBusinessSummary", db: `${camel}WeeklyBusinessSummaries`, table: `${PREFIX}_weekly_business_summaries`, fields: [{ name: "summaryKey", type: "string" }, { name: "summaryTitle", type: "string" }, { name: "summaryWeek", type: "string" }], display: { title: "summaryTitle", sub: "summaryWeek" }, sqlExtra: "summary_key text not null,\n  summary_title text not null default '',\n  summary_week text not null default '',\n  highlights text not null default '',\n  kpi_summary jsonb not null default '{}'::jsonb" },
    { tab: "monthlyPerformanceReports", plural: "monthlyPerformanceReports", singular: "MonthlyPerformanceReport", pascal: "MonthlyPerformanceReport", db: `${camel}MonthlyPerformanceReports`, table: `${PREFIX}_monthly_performance_reports`, fields: [{ name: "reportKey", type: "string" }, { name: "reportTitle", type: "string" }, { name: "reportMonth", type: "string" }], display: { title: "reportTitle", sub: "reportMonth" }, sqlExtra: "report_key text not null,\n  report_title text not null default '',\n  report_month text not null default '',\n  executive_summary text not null default '',\n  performance_score numeric(5, 2) not null default 0" },
    { tab: "quarterlyExecutiveReviews", plural: "quarterlyExecutiveReviews", singular: "QuarterlyExecutiveReview", pascal: "QuarterlyExecutiveReview", db: `${camel}QuarterlyExecutiveReviews`, table: `${PREFIX}_quarterly_executive_reviews`, fields: [{ name: "reviewKey", type: "string" }, { name: "reviewTitle", type: "string" }, { name: "reviewQuarter", type: "string" }], display: { title: "reviewTitle", sub: "reviewQuarter" }, sqlExtra: "review_key text not null,\n  review_title text not null default '',\n  review_quarter text not null default '',\n  strategic_summary text not null default '',\n  board_ready boolean not null default false" },
    { tab: "annualBusinessReports", plural: "annualBusinessReports", singular: "AnnualBusinessReport", pascal: "AnnualBusinessReport", db: `${camel}AnnualBusinessReports`, table: `${PREFIX}_annual_business_reports`, fields: [{ name: "reportKey", type: "string" }, { name: "reportTitle", type: "string" }, { name: "reportYear", type: "string" }], display: { title: "reportTitle", sub: "reportYear" }, sqlExtra: "report_key text not null,\n  report_title text not null default '',\n  report_year text not null default '',\n  annual_summary text not null default '',\n  published_at timestamptz" },
    { tab: "kpiServiceConfigs", plural: "kpiServiceConfigs", singular: "KpiServiceConfig", pascal: "KpiServiceConfig", db: `${camel}KpiServiceConfigs`, table: `${PREFIX}_kpi_service_configs`, fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "configStatus", type: "select", options: "CONFIG_STATUS_OPTIONS" }], display: { title: "configName", sub: "configStatus" }, sqlExtra: "config_key text not null,\n  config_name text not null default '',\n  config_status text not null default 'active',\n  service_endpoint text not null default '',\n  refresh_interval text not null default 'hourly'" },
    { tab: "intelligenceServiceConfigs", plural: "intelligenceServiceConfigs", singular: "IntelligenceServiceConfig", pascal: "IntelligenceServiceConfig", db: `${camel}IntelligenceServiceConfigs`, table: `${PREFIX}_intelligence_service_configs`, fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "configStatus", type: "select", options: "CONFIG_STATUS_OPTIONS" }], display: { title: "configName", sub: "configStatus" }, sqlExtra: "config_key text not null,\n  config_name text not null default '',\n  config_status text not null default 'active',\n  service_endpoint text not null default '',\n  insight_types jsonb not null default '[]'::jsonb" },
    { tab: "forecastServiceConfigs", plural: "forecastServiceConfigs", singular: "ForecastServiceConfig", pascal: "ForecastServiceConfig", db: `${camel}ForecastServiceConfigs`, table: `${PREFIX}_forecast_service_configs`, fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "configStatus", type: "select", options: "CONFIG_STATUS_OPTIONS" }], display: { title: "configName", sub: "configStatus" }, sqlExtra: "config_key text not null,\n  config_name text not null default '',\n  config_status text not null default 'active',\n  service_endpoint text not null default '',\n  forecast_models jsonb not null default '[]'::jsonb" },
    { tab: "intelligenceMetrics", plural: "intelligenceMetrics", singular: "IntelligenceMetric", pascal: "IntelligenceMetric", db: `${camel}IntelligenceMetrics`, table: `${PREFIX}_intelligence_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "unifiedKpiScore", type: "number" }, { name: "overallIntelligenceScore", type: "number" }], display: { title: "metricsKey", sub: "overallIntelligenceScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  unified_kpi_score numeric(5, 2) not null default 100,\n  business_health_score numeric(5, 2) not null default 100,\n  operational_efficiency_score numeric(5, 2) not null default 100,\n  growth_score numeric(5, 2) not null default 100,\n  revenue_forecast_total numeric(14, 2) not null default 0,\n  customer_forecast_total numeric(12, 2) not null default 0,\n  risk_score numeric(5, 2) not null default 0,\n  overall_intelligence_score numeric(5, 2) not null default 100" },
    { tab: "intelligenceHealth", plural: "intelligenceHealth", singular: "IntelligenceHealth", pascal: "IntelligenceHealth", db: `${camel}IntelligenceHealth`, table: `${PREFIX}_intelligence_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  kpi_status text not null default 'healthy',\n  intelligence_status text not null default 'healthy',\n  forecast_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "missionProgress", plural: "missionProgress", singular: "MissionProgress", pascal: "MissionProgress", db: `${camel}MissionProgress`, table: `${PREFIX}_mission_progress`, fields: [{ name: "progressKey", type: "string" }, { name: "progressName", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressName", sub: "progressPercent" }, sqlExtra: "progress_key text not null,\n  progress_name text not null default '',\n  progress_percent numeric(5, 2) not null default 0,\n  mission_ref text not null default '',\n  target_date date" },
    { tab: "intelligenceFailures", plural: "intelligenceFailures", singular: "IntelligenceFailure", pascal: "IntelligenceFailure", db: `${camel}IntelligenceFailures`, table: `${PREFIX}_intelligence_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'kpi',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Enterprise Intelligence Platform\n\n";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        const hubCol = isHub || isOrgOnly ? "" : `  ${hubFk} uuid not null references public.${hubTable}(id) on delete cascade,\n`;
        const uniqueClause = isHub
            ? "unique (organization_id, hub_key)"
            : isOrgOnly
              ? `unique (organization_id, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`
              : `unique (organization_id, ${hubFk}, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`;
        sql += `-- ${e.pascal}\n`;
        sql += `create table if not exists public.${e.table} (\n`;
        sql += `  id uuid primary key default uuid_generate_v4(),\n`;
        sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
        sql += hubCol;
        sql += `  ${e.sqlExtra},\n`;
        sql += `  status text not null default 'active',\n`;
        sql += `  created_at timestamptz not null default now(),\n`;
        sql += `  updated_at timestamptz not null default now(),\n`;
        sql += `  ${uniqueClause}\n`;
        sql += `);\n\n`;
    }
    sql += `-- Audit Logs\n`;
    sql += `create table if not exists public.${PREFIX}_audit_logs (\n`;
    sql += `  id uuid primary key default uuid_generate_v4(),\n`;
    sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
    sql += `  entity_type text not null default '',\n`;
    sql += `  entity_id uuid,\n`;
    sql += `  action text not null default '',\n`;
    sql += `  summary text not null default '',\n`;
    sql += `  metadata jsonb not null default '{}'::jsonb,\n`;
    sql += `  performed_by uuid,\n`;
    sql += `  security_level text not null default 'standard',\n`;
    sql += `  created_at timestamptz not null default now()\n`;
    sql += `);\n\n`;

    for (const t of allTables) {
        sql += `create index if not exists idx_${t}_org on public.${t}(organization_id);\n`;
        if (!orgOnlyTables.has(t) && t !== hubTable) {
            sql += `create index if not exists idx_${t}_hub on public.${t}(${hubFk});\n`;
        }
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${tablesForTriggers.join("','")}'\n  ]\n  loop\n    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);\n    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    for (const t of allTables) {
        sql += `alter table public.${t} enable row level security;\n`;
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${allTables.join("','")}'\n  ]\n  loop\n    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);\n    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);\n    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);\n    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);\n    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    sql += `insert into public.permissions (key, description, resource)\nvalues\n`;
    sql += `  ('${PREFIX}.view', 'View enterprise intelligence platform data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage KPI engine, executive intelligence, predictive analytics, reporting, SDK, and dashboard outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve enterprise intelligence platform gates and actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise intelligence platform governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00760076-0076-0076-0076-007600760101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a346', '${org}', 'Enterprise Intelligence Platform Orchestrator', 'enterprise_intelligence_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["kpi","executive","predictive","reporting","sdk","dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a546', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a346', 'northstar-enterprise-intelligence-001', 'enterprise_intelligence_platform', 'intelligence_hub', '${hubId}', '{"objective":"Unified enterprise intelligence platform KPI, executive, predictive, and reporting orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- G0 Intelligence Hub\n`;
    sql += `insert into public.eip_intelligence_hubs (id, organization_id, hub_key, hub_name, environment, intelligence_tier, status)\nvalues ('${hubId}', '${org}', 'northstar-enterprise-intelligence', 'Northstar Enterprise Intelligence Hub', 'production', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G1 KPI Engine\n`;
    sql += `insert into public.eip_kpi_registry (id, organization_id, hub_id, kpi_key, kpi_name, kpi_status, status)\nvalues ('04700100-0470-0470-0470-047001000101', '${org}', '${hubId}', 'kpi-revenue-0906', 'Revenue KPI', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_kpi_aggregations (id, organization_id, hub_id, aggregation_key, aggregation_name, aggregation_type, status)\nvalues ('04710101-0471-0471-0471-047101010201', '${org}', '${hubId}', 'agg-daily-0906', 'Daily Revenue Aggregation', 'sum', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_kpi_categories (id, organization_id, hub_id, category_key, category_name, category_status, status)\nvalues ('04720102-0472-0472-0472-047201020301', '${org}', '${hubId}', 'cat-revenue-0906', 'Revenue Category', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_kpi_targets (id, organization_id, hub_id, target_key, target_name, target_value, status)\nvalues ('04730103-0473-0473-0473-047301030401', '${org}', '${hubId}', 'target-revenue-0906', 'Q3 Revenue Target', 500000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_kpi_thresholds (id, organization_id, hub_id, threshold_key, threshold_name, threshold_value, status)\nvalues ('04740104-0474-0474-0474-047401040501', '${org}', '${hubId}', 'threshold-revenue-0906', 'Revenue Warning Threshold', 400000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_kpi_snapshots (id, organization_id, hub_id, snapshot_key, snapshot_name, snapshot_value, status)\nvalues ('04750105-0475-0475-0475-047501050601', '${org}', '${hubId}', 'snapshot-revenue-0906', 'Revenue Snapshot', 425000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G2 Executive Intelligence\n`;
    sql += `insert into public.eip_executive_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)\nvalues ('04760106-0476-0476-0476-047601060701', '${org}', '${hubId}', 'dash-exec-0906', 'Executive Command Center', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_cross_module_insights (id, organization_id, hub_id, insight_key, insight_title, insight_type, status)\nvalues ('04770107-0477-0477-0477-047701070801', '${org}', '${hubId}', 'insight-cross-0906', 'Cross-Module Revenue Insight', 'cross_module', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_business_health_scores (id, organization_id, hub_id, score_key, score_name, health_score, status)\nvalues ('04780108-0478-0478-0478-047801080901', '${org}', '${hubId}', 'health-biz-0906', 'Business Health Score', 92.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_operational_efficiency_scores (id, organization_id, hub_id, score_key, score_name, efficiency_score, status)\nvalues ('04790109-0479-0479-0479-047901090a01', '${org}', '${hubId}', 'efficiency-ops-0906', 'Operational Efficiency Score', 88.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_growth_scores (id, organization_id, hub_id, score_key, score_name, growth_score, status)\nvalues ('047a010a-047a-047a-047a-047a010a0b01', '${org}', '${hubId}', 'growth-score-0906', 'Growth Score', 85.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_strategic_insights (id, organization_id, hub_id, insight_key, insight_title, insight_priority, status)\nvalues ('047b010b-047b-047b-047b-047b010b0c01', '${org}', '${hubId}', 'insight-strat-0906', 'Strategic Market Expansion', 'high', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G3 Predictive Analytics\n`;
    sql += `insert into public.eip_revenue_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, forecast_total, status)\nvalues ('047c010c-047c-047c-047c-047c010c0d01', '${org}', '${hubId}', 'forecast-revenue-0906', 'Q4 Revenue Forecast', 650000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_customer_growth_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, growth_total, status)\nvalues ('047d010d-047d-047d-047d-047d010d0e01', '${org}', '${hubId}', 'forecast-customer-0906', 'Customer Growth Forecast', 1250.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_renewal_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, renewal_rate, status)\nvalues ('047e010e-047e-047e-047e-047e010e0f01', '${org}', '${hubId}', 'forecast-renewal-0906', 'Annual Renewal Forecast', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_capacity_planning (id, organization_id, hub_id, plan_key, plan_name, capacity_units, status)\nvalues ('047f010f-047f-047f-047f-047f010f1001', '${org}', '${hubId}', 'plan-capacity-0906', 'Q4 Capacity Plan', 500.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_operational_trends (id, organization_id, hub_id, trend_key, trend_name, trend_direction, status)\nvalues ('04800110-0480-0480-0480-048001101101', '${org}', '${hubId}', 'trend-ops-0906', 'Operational Throughput Trend', 'up', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_risk_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, risk_score, status)\nvalues ('04810111-0481-0481-0481-048101111201', '${org}', '${hubId}', 'forecast-risk-0906', 'Enterprise Risk Forecast', 18.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G4 Enterprise Reporting\n`;
    sql += `insert into public.eip_daily_executive_briefs (id, organization_id, hub_id, brief_key, brief_title, brief_date, status)\nvalues ('04820112-0482-0482-0482-048201121301', '${org}', '${hubId}', 'brief-daily-0906', 'Daily Executive Brief', current_date, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_weekly_business_summaries (id, organization_id, hub_id, summary_key, summary_title, summary_week, status)\nvalues ('04830113-0483-0483-0483-048301131401', '${org}', '${hubId}', 'summary-weekly-0906', 'Weekly Business Summary', '2026-W32', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_monthly_performance_reports (id, organization_id, hub_id, report_key, report_title, report_month, status)\nvalues ('04840114-0484-0484-0484-048401141501', '${org}', '${hubId}', 'report-monthly-0906', 'August Performance Report', '2026-08', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_quarterly_executive_reviews (id, organization_id, hub_id, review_key, review_title, review_quarter, status)\nvalues ('04850115-0485-0485-0485-048501151601', '${org}', '${hubId}', 'review-quarterly-0906', 'Q3 Executive Review', '2026-Q3', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_annual_business_reports (id, organization_id, hub_id, report_key, report_title, report_year, status)\nvalues ('04860116-0486-0486-0486-048601161701', '${org}', '${hubId}', 'report-annual-0906', '2026 Annual Business Report', '2026', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G5 Intelligence SDK\n`;
    sql += `insert into public.eip_kpi_service_configs (id, organization_id, hub_id, config_key, config_name, config_status, status)\nvalues ('04870117-0487-0487-0487-048701171801', '${org}', '${hubId}', 'config-kpi-0906', 'KPI Service Config', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_intelligence_service_configs (id, organization_id, hub_id, config_key, config_name, config_status, status)\nvalues ('04880118-0488-0488-0488-048801181901', '${org}', '${hubId}', 'config-intel-0906', 'Intelligence Service Config', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_forecast_service_configs (id, organization_id, hub_id, config_key, config_name, config_status, status)\nvalues ('04890119-0489-0489-0489-048901191a01', '${org}', '${hubId}', 'config-forecast-0906', 'Forecast Service Config', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G6 Dashboard\n`;
    sql += `insert into public.eip_intelligence_metrics (id, organization_id, metrics_key, unified_kpi_score, business_health_score, operational_efficiency_score, growth_score, revenue_forecast_total, customer_forecast_total, risk_score, overall_intelligence_score, status)\nvalues ('048a011a-048a-048a-048a-048a011a1b01', '${org}', 'eip-metrics-0906', 94.00, 92.50, 88.00, 85.50, 650000.00, 1250.00, 18.50, 91.25, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_intelligence_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, kpi_status, intelligence_status, forecast_status, security_status, summary, status)\nvalues ('048b011b-048b-048b-048b-048b011b1c01', '${org}', 'eip-health-0906', 91.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Enterprise intelligence platform operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_mission_progress (id, organization_id, hub_id, progress_key, progress_name, progress_percent, status)\nvalues ('048c011c-048c-048c-048c-048c011c1d01', '${org}', '${hubId}', 'mission-progress-0906', 'Enterprise Intelligence Mission', 78.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_intelligence_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('048d011d-048d-048d-048d-048d011d1e01', '${org}', '${hubId}', 'fail-kpi-0906', 'kpi', 'KPI_SYNC_FAIL', 'KPI aggregation sync failed', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eip_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('048e011e-048e-048e-048e-048e011e1f01', '${org}', 'intelligence_hub', 'seed', 'Enterprise intelligence platform seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgEipRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgEipRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgEipRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
    return sql;
}

function buildDbTypes() {
    let types = "";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        types += `export interface Db${Pascal}${e.pascal} {\n    id: string;\n    organization_id: string;\n`;
        if (!isHub && !isOrgOnly) types += `    ${hubFk}: string;\n`;
        const cols = e.sqlExtra.split("\n").map((l) => l.trim().replace(/,$/, ""));
        for (const col of cols) {
            const [name, ...rest] = col.split(" ");
            const sqlType = rest.join(" ");
            let tsType = "string";
            if (sqlType.includes("integer") || sqlType.includes("numeric")) tsType = "number";
            if (sqlType.includes("boolean")) tsType = "boolean";
            if (sqlType.includes("jsonb")) tsType = "Record<string, unknown>";
            if (sqlType.includes("timestamptz") || sqlType.includes(" date")) tsType = "string";
            const opt = sqlType.includes("not null") ? "" : "?";
            types += `    ${name}${opt}: ${tsType};\n`;
        }
        types += `    status: string;\n`;
        if (e.table !== `${PREFIX}_audit_logs`) {
            types += `    created_at: string;\n    updated_at: string;\n`;
        }
        types += `}\n\n`;
    }
    types += `export interface Db${Pascal}AuditLog {\n    id: string;\n    organization_id: string;\n    entity_type: string;\n    entity_id?: string | null;\n    action: string;\n    summary: string;\n    metadata: Record<string, unknown>;\n    performed_by?: string | null;\n    security_level: string;\n    created_at: string;\n}\n`;
    return types;
}

const migrationPath = join(root, "supabase/migrations/202608020046_enterprise_intelligence_platform.sql");
const seedPath = join(root, "supabase/seed/046_enterprise_intelligence_platform_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/enterprise-intelligence-platform-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbEipIntelligenceHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Intelligence Platform artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbEip* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-enterprise-intelligence-platform-ui.mjs");
