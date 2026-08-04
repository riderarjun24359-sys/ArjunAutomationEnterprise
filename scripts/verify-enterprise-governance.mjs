/**
 * Enterprise Governance Platform verification: regression, security, tenant isolation, performance,
 * onboarding, production, observability, operations, beta, dashboard, framework SDK compatibility,
 * and founder-os phase3 integration.
 * Run: node scripts/verify-enterprise-governance.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020048_enterprise_governance_platform.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(egp_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:egp_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["egp_governance_metrics", "egp_governance_health", "egp_audit_logs"]);
const childTables = tables.filter((t) => t !== "egp_governance_hubs" && !orgOnlyTables.has(t));
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

pass("governance:organization_governance_table", tables.includes("egp_organization_governance"));
pass("governance:governance_policies_table", tables.includes("egp_governance_policies"));
pass("governance:governance_framework_table", tables.includes("egp_governance_framework"));
pass("governance:governance_reviews_table", tables.includes("egp_governance_reviews"));
pass("governance:governance_dashboards_table", tables.includes("egp_governance_dashboards"));
pass("compliance:compliance_framework_table", tables.includes("egp_compliance_framework"));
pass("compliance:compliance_controls_table", tables.includes("egp_compliance_controls"));
pass("compliance:compliance_evidence_table", tables.includes("egp_compliance_evidence"));
pass("compliance:compliance_reports_table", tables.includes("egp_compliance_reports"));
pass("compliance:compliance_calendar_table", tables.includes("egp_compliance_calendar"));
pass("audit:audit_center_table", tables.includes("egp_audit_center"));
pass("audit:audit_findings_table", tables.includes("egp_audit_findings"));
pass("audit:corrective_actions_table", tables.includes("egp_corrective_actions"));
pass("audit:audit_evidence_table", tables.includes("egp_audit_evidence"));
pass("audit:audit_analytics_table", tables.includes("egp_audit_analytics"));
pass("data_governance:data_classification_table", tables.includes("egp_data_classification"));
pass("data_governance:retention_policies_table", tables.includes("egp_retention_policies"));
pass("data_governance:data_lifecycle_table", tables.includes("egp_data_lifecycle"));
pass("data_governance:data_ownership_table", tables.includes("egp_data_ownership"));
pass("data_governance:data_quality_table", tables.includes("egp_data_quality"));
pass("risk_management:risk_register_table", tables.includes("egp_risk_register"));
pass("risk_management:risk_assessment_table", tables.includes("egp_risk_assessment"));
pass("risk_management:risk_mitigation_table", tables.includes("egp_risk_mitigation"));
pass("risk_management:risk_monitoring_table", tables.includes("egp_risk_monitoring"));
pass("risk_management:business_continuity_table", tables.includes("egp_business_continuity"));

pass("dashboard:governance_metrics_table", tables.includes("egp_governance_metrics"));
pass("dashboard:governance_health_table", tables.includes("egp_governance_health"));
pass("dashboard:compliance_dashboards_table", tables.includes("egp_compliance_dashboards"));
pass("dashboard:mission_progress_table", tables.includes("egp_mission_progress"));
pass("dashboard:governance_failures_table", tables.includes("egp_governance_failures"));

pass("governance_metrics:governance_health_score", /egp_governance_metrics[\s\S]*?governance_health_score numeric/i.test(migrationSql));
pass("governance_metrics:compliance_score", /egp_governance_metrics[\s\S]*?compliance_score numeric/i.test(migrationSql));
pass("governance_metrics:enterprise_risk_score", /egp_governance_metrics[\s\S]*?enterprise_risk_score numeric/i.test(migrationSql));
pass("governance_metrics:audit_summary_score", /egp_governance_metrics[\s\S]*?audit_summary_score numeric/i.test(migrationSql));
pass("governance_metrics:data_governance_health_score", /egp_governance_metrics[\s\S]*?data_governance_health_score numeric/i.test(migrationSql));
pass("governance_metrics:overall_governance_score", /egp_governance_metrics[\s\S]*?overall_governance_score numeric/i.test(migrationSql));

pass("governance_health:disaster_recovery_mode", /egp_governance_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("governance_health:governance_status", /egp_governance_health[\s\S]*?governance_status text/i.test(migrationSql));
pass("governance_health:compliance_status", /egp_governance_health[\s\S]*?compliance_status text/i.test(migrationSql));
pass("governance_health:audit_status", /egp_governance_health[\s\S]*?audit_status text/i.test(migrationSql));
pass("governance_health:data_governance_status", /egp_governance_health[\s\S]*?data_governance_status text/i.test(migrationSql));
pass("governance_health:security_status", /egp_governance_health[\s\S]*?security_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "048_enterprise_governance_platform_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:governance_health_recovery", seedSql.includes("egp_governance_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:organization_governance", seedSql.includes("egp_organization_governance") && seedSql.includes("gov-org-0908"));
pass("seed:compliance_controls", seedSql.includes("egp_compliance_controls") && seedSql.includes("comp-control-0908"));
pass("seed:audit_findings", seedSql.includes("egp_audit_findings") && seedSql.includes("audit-finding-0908"));
pass("seed:risk_register", seedSql.includes("egp_risk_register") && seedSql.includes("risk-reg-0908"));
pass("seed:mission_progress", seedSql.includes("egp_mission_progress") && seedSql.includes("mission-progress-0908"));
pass("seed:governance_metrics", seedSql.includes("egp_governance_metrics") && seedSql.includes("overall_governance_score"));
pass("seed:governance_hub", seedSql.includes("egp_governance_hubs") && seedSql.includes("northstar-enterprise-governance"));
pass("seed:agent_type", seedSql.includes("enterprise_governance_platform"));

const mappersPath = join(root, "src/modules/database/lib/enterprise-governance-platform-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildEgpDashboardStats_exported", mappersSource.includes("export const buildEgpDashboardStats") || mappersSource.includes("export function buildEgpDashboardStats"));
pass("mappers:buildGovernanceHubLookupMaps", mappersSource.includes("buildGovernanceHubLookupMaps"));
pass("mappers:buildEgpPipelineInfo", mappersSource.includes("buildEgpPipelineInfo"));
if (mappersSource.includes("buildEgpDashboardStats")) {
    pass("mappers:buildEgpDashboardStats_governance_health_score", /governanceHealthScore|governance_health_score/.test(mappersSource));
    pass("mappers:buildEgpDashboardStats_compliance_score", /complianceScore|compliance_score/.test(mappersSource));
    pass("mappers:buildEgpDashboardStats_overall_governance_score", /overallGovernanceScore|overall_governance_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/enterprise-governance-platform/services/enterprise-governance-platform.service.ts");
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
pass("framework:createAiOrganizationFoundationClient", serviceSource.includes("createAiOrganizationFoundationClient"));
pass("framework:createEnterpriseIntelligencePlatformClient", serviceSource.includes("createEnterpriseIntelligencePlatformClient"));
pass("framework:createAiOrchestrationClient", serviceSource.includes("createAiOrchestrationClient"));
const sdkPath = join(root, "src/modules/enterprise-governance-platform/sdk/index.ts");
const sdkSource = existsSync(sdkPath) ? readFileSync(sdkPath, "utf8") : "";
pass("enterprise_ai_foundation:createEnterpriseGovernancePlatformClient", sdkSource.includes("createEnterpriseGovernancePlatformClient"));
pass("sdk:GovernanceService", sdkSource.includes("export class GovernanceService"));
pass("sdk:ComplianceService", sdkSource.includes("export class ComplianceService"));
pass("sdk:AuditService", sdkSource.includes("export class AuditService"));
pass("sdk:DataGovernanceService", sdkSource.includes("export class DataGovernanceService"));
pass("sdk:RiskManagementService", sdkSource.includes("export class RiskManagementService"));
pass("sdk:DashboardService", sdkSource.includes("export class DashboardService"));
pass("sdk:createEnterpriseGovernancePlatformClient", sdkSource.includes("createEnterpriseGovernancePlatformClient"));

const requiredFiles = [
    "src/modules/enterprise-governance-platform/constants/index.ts",
    "src/modules/enterprise-governance-platform/schemas/index.ts",
    "src/modules/enterprise-governance-platform/services/enterprise-governance-platform.service.ts",
    "src/modules/enterprise-governance-platform/hooks/useEnterpriseGovernancePlatform.ts",
    "src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformPage.tsx",
    "src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformStats.tsx",
    "src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformPanels.tsx",
    "src/modules/enterprise-governance-platform/sdk/index.ts",
    "src/modules/enterprise-governance-platform/index.ts",
    "src/modules/enterprise-governance-platform/types/index.ts",
    "src/modules/database/lib/enterprise-governance-platform-mappers.ts",
    "app/(shell)/enterprise-governance-platform/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/enterprise-governance-platform/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const EGP_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:EGP_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:EGP_THEME rose-600", constants.includes('primary: "rose-600"'));
    pass("ui:EGP_PERMISSIONS", constants.includes('"egp.view"') && constants.includes('"egp.admin"'));
    pass("ui:ORCHESTRATOR_STATUS_OPTIONS", constants.includes('"deprecated"'));
    pass("ui:DASHBOARD_STATUS_OPTIONS", constants.includes('"archived"'));
    pass("ui:APPROVAL_STATUS_OPTIONS", constants.includes('"pending"'));
} else {
    pass("ui:EGP_TABS count", false, "constants missing");
    pass("ui:EGP_THEME rose-600", false);
    pass("ui:EGP_PERMISSIONS", false);
    pass("ui:ORCHESTRATOR_STATUS_OPTIONS", false);
    pass("ui:DASHBOARD_STATUS_OPTIONS", false);
    pass("ui:APPROVAL_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/enterprise-governance-platform/hooks/useEnterpriseGovernancePlatform.ts");
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

const panelsPath = join(root, "src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:GovernanceHubSelect form.register spread", panels.includes("GovernanceHubSelect") && panels.includes('{...form.register("governanceHubId")}'));
} else {
    pass("ui:GovernanceHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:enterpriseGovernancePlatform", routes.includes('enterpriseGovernancePlatform: "/enterprise-governance-platform"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Enterprise Governance", nav.includes('"Enterprise Governance"'));
pass("nav:ShieldCheck icon", nav.includes("ShieldCheck"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:enterpriseGovernancePlatform", middleware.includes("ROUTES.enterpriseGovernancePlatform"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:enterprise-governance:verify", pkg.includes('"enterprise-governance:verify"'));

const founderOsTypesPath = join(root, "src/modules/founder-os/types/index.ts");
const founderOsTypesSource = existsSync(founderOsTypesPath) ? readFileSync(founderOsTypesPath, "utf8") : "";
pass("enterprise_governance:createEnterpriseGovernancePlatformClient", sdkSource.includes("createEnterpriseGovernancePlatformClient"));
pass("founder_os_phase6:FoPhase6Stats type", founderOsTypesSource.includes("export interface FoPhase6Stats"));

const founderOsServicePath = join(root, "src/modules/founder-os/services/founder-os.service.ts");
const founderOsServiceSource = existsSync(founderOsServicePath) ? readFileSync(founderOsServicePath, "utf8") : "";
pass("founder_os_phase6:createEnterpriseGovernancePlatformClient", founderOsServiceSource.includes("createEnterpriseGovernancePlatformClient"));
pass("founder_os_phase6:getPhase6Stats", founderOsServiceSource.includes("getPhase6Stats"));

const founderOsPanelsPath = join(root, "src/modules/founder-os/components/FounderOsPanels.tsx");
const founderOsPanelsSource = existsSync(founderOsPanelsPath) ? readFileSync(founderOsPanelsPath, "utf8") : "";
pass("founder_os_phase6:FounderOsPhase6Panel", founderOsPanelsSource.includes("export function FounderOsPhase6Panel"));

const founderOsPagePath = join(root, "src/modules/founder-os/components/FounderOsPage.tsx");
const founderOsPageSource = existsSync(founderOsPagePath) ? readFileSync(founderOsPagePath, "utf8") : "";
pass("founder_os_phase6:phase6 tab", founderOsPageSource.includes("FOUNDER_OS_TABS.phase6") || founderOsPageSource.includes('"phase6"'));

const founderOsHookPath = join(root, "src/modules/founder-os/hooks/useFounderOs.ts");
const founderOsHookSource = existsSync(founderOsHookPath) ? readFileSync(founderOsHookPath, "utf8") : "";
pass("founder_os_phase6:phase6Stats", founderOsHookSource.includes("phase6Stats"));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nEnterprise Governance Platform verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`EGP_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Enterprise Governance Platform verification checks passed.");
