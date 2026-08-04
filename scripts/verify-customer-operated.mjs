/**
 * Customer Operated Platform verification: regression, security, tenant isolation, performance,
 * onboarding, production, observability, operations, beta, dashboard, framework SDK compatibility,
 * and founder-os phase3 integration.
 * Run: node scripts/verify-customer-operated.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020045_customer_operated_platform.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(cop_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:cop_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["cop_operated_metrics", "cop_operated_health", "cop_audit_logs"]);
const childTables = tables.filter((t) => t !== "cop_operated_hubs" && !orgOnlyTables.has(t));
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

pass("onboarding:signup_flows_table", tables.includes("cop_signup_flows"));
pass("onboarding:org_provisioning_table", tables.includes("cop_org_provisioning"));
pass("onboarding:domain_onboarding_table", tables.includes("cop_domain_onboarding"));
pass("onboarding:email_verifications_table", tables.includes("cop_email_verifications"));
pass("onboarding:onboarding_wizards_table", tables.includes("cop_onboarding_wizards"));
pass("onboarding:flow_status_column", /cop_signup_flows[\s\S]*?flow_status text/i.test(migrationSql));
pass("onboarding:provision_status_column", /cop_org_provisioning[\s\S]*?provision_status text/i.test(migrationSql));

pass("production:production_profiles_table", tables.includes("cop_production_profiles"));
pass("production:deployment_jobs_table", tables.includes("cop_deployment_jobs"));
pass("production:health_validations_table", tables.includes("cop_health_validations"));
pass("production:rollback_automations_table", tables.includes("cop_rollback_automations"));
pass("production:deployment_audits_table", tables.includes("cop_deployment_audits"));
pass("production:job_status_column", /cop_deployment_jobs[\s\S]*?job_status text/i.test(migrationSql));
pass("production:profile_status_column", /cop_production_profiles[\s\S]*?profile_status text/i.test(migrationSql));

pass("observability:central_logs_table", tables.includes("cop_central_logs"));
pass("observability:metrics_collectors_table", tables.includes("cop_metrics_collectors"));
pass("observability:distributed_traces_table", tables.includes("cop_distributed_traces"));
pass("observability:alert_rules_table", tables.includes("cop_alert_rules"));
pass("observability:incident_timelines_table", tables.includes("cop_incident_timelines"));
pass("observability:log_level_column", /cop_central_logs[\s\S]*?log_level text/i.test(migrationSql));
pass("observability:incident_status_column", /cop_incident_timelines[\s\S]*?incident_status text/i.test(migrationSql));

pass("operations:backup_schedulers_table", tables.includes("cop_backup_schedulers"));
pass("operations:restore_validations_table", tables.includes("cop_restore_validations"));
pass("operations:maintenance_modes_table", tables.includes("cop_maintenance_modes"));
pass("operations:feature_flag_ops_table", tables.includes("cop_feature_flag_ops"));
pass("operations:platform_diagnostics_table", tables.includes("cop_platform_diagnostics"));
pass("operations:maintenance_status_column", /cop_maintenance_modes[\s\S]*?maintenance_status text/i.test(migrationSql));
pass("operations:flag_status_column", /cop_feature_flag_ops[\s\S]*?flag_status text/i.test(migrationSql));

pass("beta:beta_organizations_table", tables.includes("cop_beta_organizations"));
pass("beta:beta_invitations_table", tables.includes("cop_beta_invitations"));
pass("beta:feedback_collection_table", tables.includes("cop_feedback_collection"));
pass("beta:feature_requests_table", tables.includes("cop_feature_requests"));
pass("beta:bug_reports_table", tables.includes("cop_bug_reports"));
pass("beta:release_channels_table", tables.includes("cop_release_channels"));
pass("beta:beta_status_column", /cop_beta_organizations[\s\S]*?beta_status text/i.test(migrationSql));
pass("beta:bug_status_column", /cop_bug_reports[\s\S]*?bug_status text/i.test(migrationSql));

pass("dashboard:operated_metrics_table", tables.includes("cop_operated_metrics"));
pass("dashboard:operated_health_table", tables.includes("cop_operated_health"));
pass("dashboard:executive_briefings_table", tables.includes("cop_executive_briefings"));
pass("dashboard:platform_failures_table", tables.includes("cop_platform_failures"));
pass("dashboard:briefing_type_column", /cop_executive_briefings[\s\S]*?briefing_type text/i.test(migrationSql));

pass("operated_metrics:production_status_score", /cop_operated_metrics[\s\S]*?production_status_score numeric/i.test(migrationSql));
pass("operated_metrics:onboarding_completion_rate", /cop_operated_metrics[\s\S]*?onboarding_completion_rate numeric/i.test(migrationSql));
pass("operated_metrics:revenue_today", /cop_operated_metrics[\s\S]*?revenue_today numeric/i.test(migrationSql));
pass("operated_metrics:active_incident_count", /cop_operated_metrics[\s\S]*?active_incident_count integer/i.test(migrationSql));
pass("operated_metrics:pending_approval_count", /cop_operated_metrics[\s\S]*?pending_approval_count integer/i.test(migrationSql));
pass("operated_metrics:platform_availability_score", /cop_operated_metrics[\s\S]*?platform_availability_score numeric/i.test(migrationSql));
pass("operated_metrics:customer_satisfaction_score", /cop_operated_metrics[\s\S]*?customer_satisfaction_score numeric/i.test(migrationSql));
pass("operated_metrics:overall_operated_score", /cop_operated_metrics[\s\S]*?overall_operated_score numeric/i.test(migrationSql));

pass("operated_health:disaster_recovery_mode", /cop_operated_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("operated_health:production_status", /cop_operated_health[\s\S]*?production_status text/i.test(migrationSql));
pass("operated_health:onboarding_status", /cop_operated_health[\s\S]*?onboarding_status text/i.test(migrationSql));
pass("operated_health:observability_status", /cop_operated_health[\s\S]*?observability_status text/i.test(migrationSql));
pass("operated_health:security_status", /cop_operated_health[\s\S]*?security_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "045_customer_operated_platform_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:operated_health_recovery", seedSql.includes("cop_operated_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:signup_flows", seedSql.includes("cop_signup_flows") && seedSql.includes("signup-flow-0905"));
pass("seed:deployment_jobs", seedSql.includes("cop_deployment_jobs") && seedSql.includes("deploy-job-0905"));
pass("seed:central_logs", seedSql.includes("cop_central_logs") && seedSql.includes("log-central-0905"));
pass("seed:backup_schedulers", seedSql.includes("cop_backup_schedulers") && seedSql.includes("backup-sched-0905"));
pass("seed:beta_organizations", seedSql.includes("cop_beta_organizations") && seedSql.includes("beta-org-0905"));
pass("seed:operated_metrics", seedSql.includes("cop_operated_metrics") && seedSql.includes("overall_operated_score"));
pass("seed:operated_hub", seedSql.includes("cop_operated_hubs") && seedSql.includes("northstar-customer-operated"));
pass("seed:agent_type", seedSql.includes("customer_operated_platform"));

const mappersPath = join(root, "src/modules/database/lib/customer-operated-platform-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildCopDashboardStats_exported", mappersSource.includes("export const buildCopDashboardStats") || mappersSource.includes("export function buildCopDashboardStats"));
pass("mappers:buildOperatedHubLookupMaps", mappersSource.includes("buildOperatedHubLookupMaps"));
pass("mappers:buildCopPipelineInfo", mappersSource.includes("buildCopPipelineInfo"));
if (mappersSource.includes("buildCopDashboardStats")) {
    pass("mappers:buildCopDashboardStats_production_score", /productionStatusScore|production_status_score/.test(mappersSource));
    pass("mappers:buildCopDashboardStats_revenue", /revenueToday|revenue_today/.test(mappersSource));
    pass("mappers:buildCopDashboardStats_operated_score", /overallOperatedScore|overall_operated_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/customer-operated-platform/services/customer-operated-platform.service.ts");
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

const requiredFiles = [
    "src/modules/customer-operated-platform/constants/index.ts",
    "src/modules/customer-operated-platform/schemas/index.ts",
    "src/modules/customer-operated-platform/services/customer-operated-platform.service.ts",
    "src/modules/customer-operated-platform/hooks/useCustomerOperatedPlatform.ts",
    "src/modules/customer-operated-platform/components/CustomerOperatedPlatformPage.tsx",
    "src/modules/customer-operated-platform/components/CustomerOperatedPlatformStats.tsx",
    "src/modules/customer-operated-platform/components/CustomerOperatedPlatformPanels.tsx",
    "src/modules/customer-operated-platform/sdk/index.ts",
    "src/modules/customer-operated-platform/index.ts",
    "src/modules/customer-operated-platform/types/index.ts",
    "src/modules/database/lib/customer-operated-platform-mappers.ts",
    "app/(shell)/customer-operated-platform/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/customer-operated-platform/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const COP_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:COP_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:COP_THEME violet-600", constants.includes('primary: "violet-600"'));
    pass("ui:COP_PERMISSIONS", constants.includes('"cop.view"') && constants.includes('"cop.admin"'));
    pass("ui:FLOW_STATUS_OPTIONS", constants.includes('"active"') && constants.includes('"completed"'));
    pass("ui:JOB_STATUS_OPTIONS", constants.includes('"pending"') && constants.includes('"failed"'));
    pass("ui:BETA_STATUS_OPTIONS", constants.includes('"invited"') && constants.includes('"active"'));
} else {
    pass("ui:COP_TABS count", false, "constants missing");
    pass("ui:COP_THEME violet-600", false);
    pass("ui:COP_PERMISSIONS", false);
    pass("ui:FLOW_STATUS_OPTIONS", false);
    pass("ui:JOB_STATUS_OPTIONS", false);
    pass("ui:BETA_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/customer-operated-platform/hooks/useCustomerOperatedPlatform.ts");
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

const panelsPath = join(root, "src/modules/customer-operated-platform/components/CustomerOperatedPlatformPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:OperatedHubSelect form.register spread", panels.includes("OperatedHubSelect") && panels.includes('{...form.register("operatedHubId")}'));
} else {
    pass("ui:OperatedHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:customerOperatedPlatform", routes.includes('customerOperatedPlatform: "/customer-operated-platform"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Customer Operated", nav.includes('"Customer Operated"'));
pass("nav:ServerCog icon", nav.includes("ServerCog"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:customerOperatedPlatform", middleware.includes("ROUTES.customerOperatedPlatform"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:customer-operated:verify", pkg.includes('"customer-operated:verify"'));

const founderOsTypesPath = join(root, "src/modules/founder-os/types/index.ts");
const founderOsTypesSource = existsSync(founderOsTypesPath) ? readFileSync(founderOsTypesPath, "utf8") : "";
pass("founder_os_phase3:FoPhase3Stats type", founderOsTypesSource.includes("export interface FoPhase3Stats"));

const founderOsServicePath = join(root, "src/modules/founder-os/services/founder-os.service.ts");
const founderOsServiceSource = existsSync(founderOsServicePath) ? readFileSync(founderOsServicePath, "utf8") : "";
pass("founder_os_phase3:createCustomerOperatedPlatformClient", founderOsServiceSource.includes("createCustomerOperatedPlatformClient"));
pass("founder_os_phase3:getPhase3Stats", founderOsServiceSource.includes("getPhase3Stats"));

const founderOsPanelsPath = join(root, "src/modules/founder-os/components/FounderOsPanels.tsx");
const founderOsPanelsSource = existsSync(founderOsPanelsPath) ? readFileSync(founderOsPanelsPath, "utf8") : "";
pass("founder_os_phase3:FounderOsPhase3Panel", founderOsPanelsSource.includes("export function FounderOsPhase3Panel"));

const founderOsPagePath = join(root, "src/modules/founder-os/components/FounderOsPage.tsx");
const founderOsPageSource = existsSync(founderOsPagePath) ? readFileSync(founderOsPagePath, "utf8") : "";
pass("founder_os_phase3:phase3 tab", founderOsPageSource.includes("FOUNDER_OS_TABS.phase3") || founderOsPageSource.includes('"phase3"'));

const founderOsHookPath = join(root, "src/modules/founder-os/hooks/useFounderOs.ts");
const founderOsHookSource = existsSync(founderOsHookPath) ? readFileSync(founderOsHookPath, "utf8") : "";
pass("founder_os_phase3:phase3Stats", founderOsHookSource.includes("phase3Stats"));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nCustomer Operated Platform verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`COP_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Customer Operated Platform verification checks passed.");
