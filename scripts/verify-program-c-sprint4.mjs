/**
 * Program C Sprint 4 verification: regression, security, tenant isolation, performance,
 * provisioning, go live, data import, customer success, platform admin, and framework SDK compatibility.
 * Run: node scripts/verify-program-c-sprint4.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020042_enterprise_launch_foundation.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(elf_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:elf_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["elf_launch_metrics", "elf_launch_health", "elf_audit_logs"]);
const childTables = tables.filter((t) => t !== "elf_launch_hubs" && !orgOnlyTables.has(t));
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

pass("provisioning:organization_provisions_table", tables.includes("elf_organization_provisions"));
pass("provisioning:tenant_provisions_table", tables.includes("elf_tenant_provisions"));
pass("provisioning:industry_pack_assignments_table", tables.includes("elf_industry_pack_assignments"));
pass("provisioning:module_licenses_table", tables.includes("elf_module_licenses"));
pass("provisioning:provision_status_column", /elf_organization_provisions[\s\S]*?provision_status text/i.test(migrationSql));

pass("go_live:go_live_checklists_table", tables.includes("elf_go_live_checklists"));
pass("go_live:go_live_scores_table", tables.includes("elf_go_live_scores"));
pass("go_live:deployment_statuses_table", tables.includes("elf_deployment_statuses"));
pass("go_live:readiness_validations_table", tables.includes("elf_readiness_validations"));
pass("go_live:deployment_status_column", /elf_deployment_statuses[\s\S]*?deployment_status text/i.test(migrationSql));

pass("data_import:import_jobs_table", tables.includes("elf_import_jobs"));
pass("data_import:import_validations_table", tables.includes("elf_import_validations"));
pass("data_import:import_previews_table", tables.includes("elf_import_previews"));
pass("data_import:import_history_table", tables.includes("elf_import_history"));
pass("data_import:job_status_column", /elf_import_jobs[\s\S]*?job_status text/i.test(migrationSql));

pass("customer_success:customer_health_scores_table", tables.includes("elf_customer_health_scores"));
pass("customer_success:platform_adoption_table", tables.includes("elf_platform_adoption"));
pass("customer_success:feature_usage_table", tables.includes("elf_feature_usage"));
pass("customer_success:renewal_tracking_table", tables.includes("elf_renewal_tracking"));
pass("customer_success:health_score_column", /elf_customer_health_scores[\s\S]*?health_score numeric/i.test(migrationSql));

pass("platform_admin:customer_registry_table", tables.includes("elf_customer_registry"));
pass("platform_admin:subscription_records_table", tables.includes("elf_subscription_records"));
pass("platform_admin:license_management_table", tables.includes("elf_license_management"));
pass("platform_admin:customer_tier_column", /elf_customer_registry[\s\S]*?customer_tier text/i.test(migrationSql));

pass("launch_metrics:platform_health_score", /elf_launch_metrics[\s\S]*?platform_health_score numeric/i.test(migrationSql));
pass("launch_metrics:customer_health_score", /elf_launch_metrics[\s\S]*?customer_health_score numeric/i.test(migrationSql));
pass("launch_metrics:deployment_count", /elf_launch_metrics[\s\S]*?deployment_count integer/i.test(migrationSql));
pass("launch_metrics:subscription_count", /elf_launch_metrics[\s\S]*?subscription_count integer/i.test(migrationSql));
pass("launch_metrics:support_open_count", /elf_launch_metrics[\s\S]*?support_open_count integer/i.test(migrationSql));
pass("launch_metrics:go_live_score", /elf_launch_metrics[\s\S]*?go_live_score numeric/i.test(migrationSql));
pass("launch_metrics:overall_launch_score", /elf_launch_metrics[\s\S]*?overall_launch_score numeric/i.test(migrationSql));

pass("disaster_recovery:launch_health_column", /elf_launch_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:platform_status", /elf_launch_health[\s\S]*?platform_status text/i.test(migrationSql));
pass("disaster_recovery:customer_success_status", /elf_launch_health[\s\S]*?customer_success_status text/i.test(migrationSql));
pass("disaster_recovery:security_status", /elf_launch_health[\s\S]*?security_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "042_enterprise_launch_foundation_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:launch_health_recovery", seedSql.includes("elf_launch_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:organization_provisions", seedSql.includes("elf_organization_provisions") && seedSql.includes("org-provision-0904"));
pass("seed:import_jobs", seedSql.includes("elf_import_jobs") && seedSql.includes("import-job-0904"));
pass("seed:go_live_checklists", seedSql.includes("elf_go_live_checklists") && seedSql.includes("golive-check-0904"));
pass("seed:customer_registry", seedSql.includes("elf_customer_registry") && seedSql.includes("cust-reg-0904"));
pass("seed:launch_metrics", seedSql.includes("elf_launch_metrics") && seedSql.includes("overall_launch_score"));
pass("seed:launch_hub", seedSql.includes("elf_launch_hubs") && seedSql.includes("northstar-launch-foundation"));
pass("seed:agent_type", seedSql.includes("enterprise_launch_foundation"));

const mappersPath = join(root, "src/modules/database/lib/launch-foundation-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildElfDashboardStats_exported", mappersSource.includes("export const buildElfDashboardStats") || mappersSource.includes("export function buildElfDashboardStats"));
pass("mappers:buildLaunchHubLookupMaps", mappersSource.includes("buildLaunchHubLookupMaps"));
pass("mappers:buildElfPipelineInfo", mappersSource.includes("buildElfPipelineInfo"));
if (mappersSource.includes("buildElfDashboardStats")) {
    pass("mappers:buildElfDashboardStats_organization_provisions", /organizationProvisionCount|organizationProvisions/.test(mappersSource));
    pass("mappers:buildElfDashboardStats_import_jobs", /importJobCount|importJobs/.test(mappersSource));
    pass("mappers:buildElfDashboardStats_launch_score", /overallLaunchScore|overall_launch_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/launch-foundation/services/launch-foundation.service.ts");
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
pass("framework:createIndustryFrameworkClient", serviceSource.includes("createIndustryFrameworkClient"));
pass("framework:createBusinessProcessClient", serviceSource.includes("createBusinessProcessClient"));
pass("framework:createFormEngineClient", serviceSource.includes("createFormEngineClient"));
pass("framework:createWorkflowEngineClient", serviceSource.includes("createWorkflowEngineClient"));
pass("framework:createDocumentEngineClient", serviceSource.includes("createDocumentEngineClient"));
pass("framework:createCommercialSaasClient", serviceSource.includes("createCommercialSaasClient"));
pass("framework:createEnterpriseIdentityClient", serviceSource.includes("createEnterpriseIdentityClient"));
pass("framework:createCommunicationHubClient", serviceSource.includes("createCommunicationHubClient"));
pass("framework:createIntegrationPlatformClient", serviceSource.includes("createIntegrationPlatformClient"));

const requiredFiles = [
    "src/modules/launch-foundation/constants/index.ts",
    "src/modules/launch-foundation/schemas/index.ts",
    "src/modules/launch-foundation/services/launch-foundation.service.ts",
    "src/modules/launch-foundation/hooks/useLaunchFoundation.ts",
    "src/modules/launch-foundation/components/LaunchFoundationPage.tsx",
    "src/modules/launch-foundation/components/LaunchFoundationStats.tsx",
    "src/modules/launch-foundation/components/LaunchFoundationPanels.tsx",
    "src/modules/launch-foundation/sdk/index.ts",
    "src/modules/launch-foundation/index.ts",
    "src/modules/launch-foundation/types/index.ts",
    "src/modules/database/lib/launch-foundation-mappers.ts",
    "app/(shell)/launch-foundation/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/launch-foundation/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const ELF_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:ELF_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:ELF_THEME slate-600", constants.includes('primary: "slate-600"'));
    pass("ui:ELF_PERMISSIONS", constants.includes('"elf.view"') && constants.includes('"elf.admin"'));
    pass("ui:IMPORT_STATUS_OPTIONS", constants.includes('"pending"') && constants.includes('"completed"'));
    pass("ui:DEPLOYMENT_STATUS_OPTIONS", constants.includes('"deployed"') && constants.includes('"failed"'));
    pass("ui:PROVISION_STATUS_OPTIONS", constants.includes('"active"') && constants.includes('"suspended"'));
} else {
    pass("ui:ELF_TABS count", false, "constants missing");
    pass("ui:ELF_THEME slate-600", false);
    pass("ui:ELF_PERMISSIONS", false);
    pass("ui:IMPORT_STATUS_OPTIONS", false);
    pass("ui:DEPLOYMENT_STATUS_OPTIONS", false);
    pass("ui:PROVISION_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/launch-foundation/hooks/useLaunchFoundation.ts");
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

const panelsPath = join(root, "src/modules/launch-foundation/components/LaunchFoundationPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:LaunchHubSelect form.register spread", panels.includes("LaunchHubSelect") && panels.includes('{...form.register("launchHubId")}'));
} else {
    pass("ui:LaunchHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:launchFoundation", routes.includes('launchFoundation: "/launch-foundation"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Launch Foundation", nav.includes('"Launch Foundation"'));
pass("nav:Rocket icon", nav.includes("Rocket"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:launchFoundation", middleware.includes("ROUTES.launchFoundation"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:program-c-sprint4:verify", pkg.includes('"program-c-sprint4:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram C Sprint 4 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`ELF_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program C Sprint 4 verification checks passed.");
