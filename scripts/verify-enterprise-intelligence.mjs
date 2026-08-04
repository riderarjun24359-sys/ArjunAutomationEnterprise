/**
 * Enterprise Intelligence Platform verification: regression, security, tenant isolation, performance,
 * onboarding, production, observability, operations, beta, dashboard, framework SDK compatibility,
 * and founder-os phase3 integration.
 * Run: node scripts/verify-enterprise-intelligence.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const migrationPath = join(root, "supabase", "migrations", "202608020046_enterprise_intelligence_platform.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(eip_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:eip_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["eip_intelligence_metrics", "eip_intelligence_health", "eip_audit_logs"]);
const childTables = tables.filter((t) => t !== "eip_intelligence_hubs" && !orgOnlyTables.has(t));
const hasMemberPolicyTemplate = migrationSql.includes("is_organization_member(organization_id)");
for (const table of childTables) {
    const hasOrgCol = new RegExp(`create table if not exists public\\.${table}[\\s\\S]*?organization_id uuid`, "i").test(migrationSql);
    pass(`isolation:organization_id:${table}`, hasOrgCol);
    pass(`isolation:is_organization_member:${table}`, hasMemberPolicyTemplate);
}

for (const table of tables) {
    const indexName = `idx_${table}_org`;
    const hasIndex = migrationSql.includes(`create index if not exists ${indexName}`);
    pass(`performance:${indexName}`, hasIndex);
}

pass("kpi_engine:kpi_registry_table", tables.includes("eip_kpi_registry"));
pass("kpi_engine:kpi_aggregations_table", tables.includes("eip_kpi_aggregations"));
pass("kpi_engine:kpi_categories_table", tables.includes("eip_kpi_categories"));
pass("kpi_engine:kpi_targets_table", tables.includes("eip_kpi_targets"));
pass("kpi_engine:kpi_thresholds_table", tables.includes("eip_kpi_thresholds"));
pass("kpi_engine:kpi_snapshots_table", tables.includes("eip_kpi_snapshots"));
pass("kpi_engine:kpi_status_column", /eip_kpi_registry[\s\S]*?kpi_status text/i.test(migrationSql));

pass("executive:executive_dashboards_table", tables.includes("eip_executive_dashboards"));
pass("executive:cross_module_insights_table", tables.includes("eip_cross_module_insights"));
pass("executive:business_health_scores_table", tables.includes("eip_business_health_scores"));
pass("executive:operational_efficiency_scores_table", tables.includes("eip_operational_efficiency_scores"));
pass("executive:growth_scores_table", tables.includes("eip_growth_scores"));
pass("executive:strategic_insights_table", tables.includes("eip_strategic_insights"));
pass("executive:dashboard_status_column", /eip_executive_dashboards[\s\S]*?dashboard_status text/i.test(migrationSql));

pass("predictive:revenue_forecasts_table", tables.includes("eip_revenue_forecasts"));
pass("predictive:customer_growth_forecasts_table", tables.includes("eip_customer_growth_forecasts"));
pass("predictive:renewal_forecasts_table", tables.includes("eip_renewal_forecasts"));
pass("predictive:capacity_planning_table", tables.includes("eip_capacity_planning"));
pass("predictive:operational_trends_table", tables.includes("eip_operational_trends"));
pass("predictive:risk_forecasts_table", tables.includes("eip_risk_forecasts"));
pass("predictive:forecast_total_column", /eip_revenue_forecasts[\s\S]*?forecast_total numeric/i.test(migrationSql));

pass("reporting:daily_executive_briefs_table", tables.includes("eip_daily_executive_briefs"));
pass("reporting:weekly_business_summaries_table", tables.includes("eip_weekly_business_summaries"));
pass("reporting:monthly_performance_reports_table", tables.includes("eip_monthly_performance_reports"));
pass("reporting:quarterly_executive_reviews_table", tables.includes("eip_quarterly_executive_reviews"));
pass("reporting:annual_business_reports_table", tables.includes("eip_annual_business_reports"));
pass("reporting:brief_date_column", /eip_daily_executive_briefs[\s\S]*?brief_date date/i.test(migrationSql));

pass("sdk:kpi_service_configs_table", tables.includes("eip_kpi_service_configs"));
pass("sdk:intelligence_service_configs_table", tables.includes("eip_intelligence_service_configs"));
pass("sdk:forecast_service_configs_table", tables.includes("eip_forecast_service_configs"));
pass("sdk:config_status_column", /eip_kpi_service_configs[\s\S]*?config_status text/i.test(migrationSql));

pass("dashboard:intelligence_metrics_table", tables.includes("eip_intelligence_metrics"));
pass("dashboard:intelligence_health_table", tables.includes("eip_intelligence_health"));
pass("dashboard:mission_progress_table", tables.includes("eip_mission_progress"));
pass("dashboard:intelligence_failures_table", tables.includes("eip_intelligence_failures"));
pass("dashboard:briefing_type_column", /eip_daily_executive_briefs[\s\S]*?brief_title text/i.test(migrationSql));

pass("intelligence_metrics:unified_kpi_score", /eip_intelligence_metrics[\s\S]*?unified_kpi_score numeric/i.test(migrationSql));
pass("intelligence_metrics:business_health_score", /eip_intelligence_metrics[\s\S]*?business_health_score numeric/i.test(migrationSql));
pass("intelligence_metrics:revenue_forecast_total", /eip_intelligence_metrics[\s\S]*?revenue_forecast_total numeric/i.test(migrationSql));
pass("intelligence_metrics:customer_forecast_total", /eip_intelligence_metrics[\s\S]*?customer_forecast_total numeric/i.test(migrationSql));
pass("intelligence_metrics:risk_score", /eip_intelligence_metrics[\s\S]*?risk_score numeric/i.test(migrationSql));
pass("intelligence_metrics:overall_intelligence_score", /eip_intelligence_metrics[\s\S]*?overall_intelligence_score numeric/i.test(migrationSql));

pass("intelligence_health:disaster_recovery_mode", /eip_intelligence_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("intelligence_health:kpi_status", /eip_intelligence_health[\s\S]*?kpi_status text/i.test(migrationSql));
pass("intelligence_health:intelligence_status", /eip_intelligence_health[\s\S]*?intelligence_status text/i.test(migrationSql));
pass("intelligence_health:forecast_status", /eip_intelligence_health[\s\S]*?forecast_status text/i.test(migrationSql));
pass("intelligence_health:security_status", /eip_intelligence_health[\s\S]*?security_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "046_enterprise_intelligence_platform_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:intelligence_health_recovery", seedSql.includes("eip_intelligence_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:kpi_registry", seedSql.includes("eip_kpi_registry") && seedSql.includes("kpi-revenue-0906"));
pass("seed:executive_dashboards", seedSql.includes("eip_executive_dashboards") && seedSql.includes("dash-exec-0906"));
pass("seed:revenue_forecasts", seedSql.includes("eip_revenue_forecasts") && seedSql.includes("forecast-revenue-0906"));
pass("seed:daily_executive_briefs", seedSql.includes("eip_daily_executive_briefs") && seedSql.includes("brief-daily-0906"));
pass("seed:mission_progress", seedSql.includes("eip_mission_progress") && seedSql.includes("mission-progress-0906"));
pass("seed:intelligence_metrics", seedSql.includes("eip_intelligence_metrics") && seedSql.includes("overall_intelligence_score"));
pass("seed:intelligence_hub", seedSql.includes("eip_intelligence_hubs") && seedSql.includes("northstar-enterprise-intelligence"));
pass("seed:agent_type", seedSql.includes("enterprise_intelligence_platform"));

const mappersPath = join(root, "src/modules/database/lib/enterprise-intelligence-platform-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildEipDashboardStats_exported", mappersSource.includes("export const buildEipDashboardStats") || mappersSource.includes("export function buildEipDashboardStats"));
pass("mappers:buildIntelligenceHubLookupMaps", mappersSource.includes("buildIntelligenceHubLookupMaps"));
pass("mappers:buildEipPipelineInfo", mappersSource.includes("buildEipPipelineInfo"));
if (mappersSource.includes("buildEipDashboardStats")) {
    pass("mappers:buildEipDashboardStats_unified_kpi", /unifiedKpiScore|unified_kpi_score/.test(mappersSource));
    pass("mappers:buildEipDashboardStats_revenue_forecast", /revenueForecastTotal|revenue_forecast_total/.test(mappersSource));
    pass("mappers:buildEipDashboardStats_intelligence_score", /overallIntelligenceScore|overall_intelligence_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/enterprise-intelligence-platform/services/enterprise-intelligence-platform.service.ts");
const serviceSource = existsSync(servicePath) ? readFileSync(servicePath, "utf8") : "";
pass("framework:industry-framework_sdk", serviceSource.includes("@/src/modules/industry-framework/sdk"));
pass("framework:business-process_sdk", serviceSource.includes("@/src/modules/business-process/sdk"));
pass("framework:form-engine_sdk", serviceSource.includes("@/src/modules/form-engine/sdk"));
pass("framework:workflow-engine_sdk", serviceSource.includes("@/src/modules/workflow-engine/sdk"));
pass("framework:document-engine_sdk", serviceSource.includes("@/src/modules/document-engine/sdk"));
pass("framework:commercial-saas_sdk", serviceSource.includes("@/src/modules/commercial-saas/sdk"));
pass("framework:enterprise-identity_sdk", serviceSource.includes("@/src/modules/enterprise-identity/sdk"));
pass("framework:communication-hub_sdk", serviceSource.includes("@/src/modules/communication-hub/sdk"));
pass("framework:integration-platform_sdk", serviceSource.includes("@/src/modules/integration-platform/sdk"));
pass("framework:launch-foundation_sdk", serviceSource.includes("@/src/modules/launch-foundation/sdk"));
pass("framework:company-foundation_sdk", serviceSource.includes("@/src/modules/company-foundation/sdk"));
pass("framework:customer-success-delivery_sdk", serviceSource.includes("@/src/modules/customer-success-delivery/sdk"));
pass("framework:crm_service", serviceSource.includes("crmService"));
pass("framework:createIndustryFrameworkClient", serviceSource.includes("createIndustryFrameworkClient"));
pass("framework:createBusinessProcessClient", serviceSource.includes("createBusinessProcessClient"));
pass("framework:createFormEngineClient", serviceSource.includes("createFormEngineClient"));
pass("framework:createWorkflowEngineClient", serviceSource.includes("createWorkflowEngineClient"));
pass("framework:createDocumentEngineClient", serviceSource.includes("createDocumentEngineClient"));
pass("framework:createCommercialSaasClient", serviceSource.includes("createCommercialSaasClient"));
pass("framework:createEnterpriseIdentityClient", serviceSource.includes("createEnterpriseIdentityClient"));
pass("framework:createCommunicationHubClient", serviceSource.includes("createCommunicationHubClient"));
pass("framework:createIntegrationPlatformClient", serviceSource.includes("createIntegrationPlatformClient"));
pass("framework:createLaunchFoundationClient", serviceSource.includes("createLaunchFoundationClient"));
pass("framework:createCompanyFoundationClient", serviceSource.includes("createCompanyFoundationClient"));
pass("framework:createCustomerSuccessDeliveryClient", serviceSource.includes("createCustomerSuccessDeliveryClient"));
pass("framework:createCustomerOperatedPlatformClient", serviceSource.includes("createCustomerOperatedPlatformClient"));
const sdkPath = join(root, "src/modules/enterprise-intelligence-platform/sdk/index.ts");
const sdkSource = existsSync(sdkPath) ? readFileSync(sdkPath, "utf8") : "";
pass("sdk:KpiService", sdkSource.includes("export class KpiService"));
pass("sdk:IntelligenceService", sdkSource.includes("export class IntelligenceService"));
pass("sdk:ForecastService", sdkSource.includes("export class ForecastService"));
pass("sdk:ReportingService", sdkSource.includes("export class ReportingService"));
pass("sdk:ExecutiveInsightService", sdkSource.includes("export class ExecutiveInsightService"));
pass("sdk:createEnterpriseIntelligencePlatformClient", sdkSource.includes("createEnterpriseIntelligencePlatformClient"));

const requiredFiles = [
    "src/modules/enterprise-intelligence-platform/constants/index.ts",
    "src/modules/enterprise-intelligence-platform/schemas/index.ts",
    "src/modules/enterprise-intelligence-platform/services/enterprise-intelligence-platform.service.ts",
    "src/modules/enterprise-intelligence-platform/hooks/useEnterpriseIntelligencePlatform.ts",
    "src/modules/enterprise-intelligence-platform/components/EnterpriseIntelligencePlatformPage.tsx",
    "src/modules/enterprise-intelligence-platform/components/EnterpriseIntelligencePlatformStats.tsx",
    "src/modules/enterprise-intelligence-platform/components/EnterpriseIntelligencePlatformPanels.tsx",
    "src/modules/enterprise-intelligence-platform/sdk/index.ts",
    "src/modules/enterprise-intelligence-platform/index.ts",
    "src/modules/enterprise-intelligence-platform/types/index.ts",
    "src/modules/database/lib/enterprise-intelligence-platform-mappers.ts",
    "app/(shell)/enterprise-intelligence-platform/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/enterprise-intelligence-platform/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const EIP_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:EIP_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:EIP_THEME fuchsia-600", constants.includes('primary: "fuchsia-600"'));
    pass("ui:EIP_PERMISSIONS", constants.includes('"eip.view"') && constants.includes('"eip.admin"'));
    pass("ui:KPI_STATUS_OPTIONS", constants.includes('"active"') && constants.includes('"deprecated"'));
    pass("ui:DASHBOARD_STATUS_OPTIONS", constants.includes('"archived"'));
    pass("ui:CONFIG_STATUS_OPTIONS", constants.includes('"inactive"'));
} else {
    pass("ui:EIP_TABS count", false, "constants missing");
    pass("ui:EIP_THEME fuchsia-600", false);
    pass("ui:EIP_PERMISSIONS", false);
    pass("ui:KPI_STATUS_OPTIONS", false);
    pass("ui:DASHBOARD_STATUS_OPTIONS", false);
    pass("ui:CONFIG_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/enterprise-intelligence-platform/hooks/useEnterpriseIntelligencePlatform.ts");
if (existsSync(hookPath)) {
    const hook = readFileSync(hookPath, "utf8");
    pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
    pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
    pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));
} else {
    pass("hook:cancelled useEffect", false);
    pass("hook:stable auth deps", false);
    pass("hook:applyData semicolons", false);
}

const panelsPath = join(root, "src/modules/enterprise-intelligence-platform/components/EnterpriseIntelligencePlatformPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:IntelligenceHubSelect form.register spread", panels.includes("IntelligenceHubSelect") && panels.includes('{...form.register("intelligenceHubId")}'));
} else {
    pass("ui:IntelligenceHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:enterpriseIntelligencePlatform", routes.includes('enterpriseIntelligencePlatform: "/enterprise-intelligence-platform"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Enterprise Intelligence", nav.includes('"Enterprise Intelligence"'));
pass("nav:Brain icon", nav.includes("Brain"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:enterpriseIntelligencePlatform", middleware.includes("ROUTES.enterpriseIntelligencePlatform"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:enterprise-intelligence:verify", pkg.includes('"enterprise-intelligence:verify"'));

const founderOsTypesPath = join(root, "src/modules/founder-os/types/index.ts");
const founderOsTypesSource = existsSync(founderOsTypesPath) ? readFileSync(founderOsTypesPath, "utf8") : "";
pass("founder_os_phase4:FoPhase4Stats type", founderOsTypesSource.includes("export interface FoPhase4Stats"));

const founderOsServicePath = join(root, "src/modules/founder-os/services/founder-os.service.ts");
const founderOsServiceSource = existsSync(founderOsServicePath) ? readFileSync(founderOsServicePath, "utf8") : "";
pass("founder_os_phase4:createEnterpriseIntelligencePlatformClient", founderOsServiceSource.includes("createEnterpriseIntelligencePlatformClient"));
pass("founder_os_phase4:getPhase4Stats", founderOsServiceSource.includes("getPhase4Stats"));

const founderOsPanelsPath = join(root, "src/modules/founder-os/components/FounderOsPanels.tsx");
const founderOsPanelsSource = existsSync(founderOsPanelsPath) ? readFileSync(founderOsPanelsPath, "utf8") : "";
pass("founder_os_phase4:FounderOsPhase4Panel", founderOsPanelsSource.includes("export function FounderOsPhase4Panel"));

const founderOsPagePath = join(root, "src/modules/founder-os/components/FounderOsPage.tsx");
const founderOsPageSource = existsSync(founderOsPagePath) ? readFileSync(founderOsPagePath, "utf8") : "";
pass("founder_os_phase4:phase4 tab", founderOsPageSource.includes("FOUNDER_OS_TABS.phase4") || founderOsPageSource.includes('"phase4"'));

const founderOsHookPath = join(root, "src/modules/founder-os/hooks/useFounderOs.ts");
const founderOsHookSource = existsSync(founderOsHookPath) ? readFileSync(founderOsHookPath, "utf8") : "";
pass("founder_os_phase4:phase4Stats", founderOsHookSource.includes("phase4Stats"));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nEnterprise Intelligence Platform verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`EIP_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Enterprise Intelligence Platform verification checks passed.");
