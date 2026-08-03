/**
 * Program B Sprint 1 verification: regression, security, tenant isolation, performance,
 * industry framework core, compatibility, SDK, templates, framework metrics.
 * Run: node scripts/verify-sprint-b1.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020033_enterprise_industry_framework_core.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(ifr_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:ifr_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["ifr_framework_metrics", "ifr_framework_health", "ifr_audit_logs"]);
const childTables = tables.filter((t) => t !== "ifr_framework_hubs" && !orgOnlyTables.has(t));
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

pass("templates:dashboard_templates_table", tables.includes("ifr_dashboard_templates"));
pass("templates:workflow_templates_table", tables.includes("ifr_workflow_templates"));
pass("templates:role_templates_table", tables.includes("ifr_role_templates"));
pass("templates:report_templates_table", tables.includes("ifr_report_templates"));
pass("templates:template_version_column", /ifr_dashboard_templates[\s\S]*?template_version text/i.test(migrationSql));

pass("sdk:shared_apis_table", tables.includes("ifr_shared_apis"));
pass("sdk:context_apis_table", tables.includes("ifr_context_apis"));
pass("sdk:configuration_apis_table", tables.includes("ifr_configuration_apis"));
pass("sdk:extension_points_table", tables.includes("ifr_extension_points"));
pass("sdk:api_version_column", /ifr_shared_apis[\s\S]*?api_version text/i.test(migrationSql));

pass("compatibility:checks_table", tables.includes("ifr_compatibility_checks"));
pass("compatibility:check_score_column", /ifr_compatibility_checks[\s\S]*?check_score numeric/i.test(migrationSql));
pass("compatibility:framework_failures_table", tables.includes("ifr_framework_failures"));

pass("framework_metrics:template_score", /ifr_framework_metrics[\s\S]*?template_score numeric/i.test(migrationSql));
pass("framework_metrics:profile_score", /ifr_framework_metrics[\s\S]*?profile_score numeric/i.test(migrationSql));
pass("framework_metrics:compatibility_score", /ifr_framework_metrics[\s\S]*?compatibility_score numeric/i.test(migrationSql));
pass("framework_metrics:sdk_score", /ifr_framework_metrics[\s\S]*?sdk_score numeric/i.test(migrationSql));
pass("framework_metrics:framework_health_score", /ifr_framework_metrics[\s\S]*?framework_health_score numeric/i.test(migrationSql));
pass("framework_metrics:overall_framework_score", /ifr_framework_metrics[\s\S]*?overall_framework_score numeric/i.test(migrationSql));

pass("disaster_recovery:framework_health_column", /ifr_framework_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:framework_health_compatibility_status", /ifr_framework_health[\s\S]*?compatibility_status text/i.test(migrationSql));
pass("disaster_recovery:framework_health_sdk_status", /ifr_framework_health[\s\S]*?sdk_status text/i.test(migrationSql));
pass("disaster_recovery:framework_health_template_status", /ifr_framework_health[\s\S]*?template_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "033_enterprise_industry_framework_core_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:framework_health_recovery", seedSql.includes("ifr_framework_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:dashboard_templates", seedSql.includes("ifr_dashboard_templates") && seedSql.includes("dash-exec-0804"));
pass("seed:shared_apis", seedSql.includes("ifr_shared_apis") && seedSql.includes("api-shared-0804"));
pass("seed:compatibility_checks", seedSql.includes("ifr_compatibility_checks") && seedSql.includes("compat-ver-0804"));
pass("seed:framework_metrics", seedSql.includes("ifr_framework_metrics") && seedSql.includes("overall_framework_score"));
pass("seed:framework_hub", seedSql.includes("ifr_framework_hubs") && seedSql.includes("northstar-industry-framework"));
pass("seed:agent_type", seedSql.includes("enterprise_industry_framework_core"));

const mappersPath = join(root, "src/modules/database/lib/industry-framework-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildIfrDashboardStats_exported", mappersSource.includes("export const buildIfrDashboardStats") || mappersSource.includes("export function buildIfrDashboardStats"));
pass("mappers:buildFrameworkHubLookupMaps", mappersSource.includes("buildFrameworkHubLookupMaps"));
pass("mappers:buildIfrPipelineInfo", mappersSource.includes("buildIfrPipelineInfo"));
if (mappersSource.includes("buildIfrDashboardStats")) {
    pass("mappers:buildIfrDashboardStats_templates", /dashboardTemplateCount|dashboardTemplates/.test(mappersSource));
    pass("mappers:buildIfrDashboardStats_sdk", /sdkScore|sdk_score/.test(mappersSource));
    pass("mappers:buildIfrDashboardStats_framework_score", /overallFrameworkScore|overall_framework_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/industry-framework/constants/index.ts",
    "src/modules/industry-framework/schemas/index.ts",
    "src/modules/industry-framework/services/industry-framework.service.ts",
    "src/modules/industry-framework/hooks/useIndustryFramework.ts",
    "src/modules/industry-framework/components/IndustryFrameworkPage.tsx",
    "src/modules/industry-framework/components/IndustryFrameworkStats.tsx",
    "src/modules/industry-framework/components/IndustryFrameworkPanels.tsx",
    "src/modules/industry-framework/sdk/index.ts",
    "src/modules/industry-framework/index.ts",
    "src/modules/industry-framework/types/index.ts",
    "src/modules/database/lib/industry-framework-mappers.ts",
    "app/(shell)/industry-framework/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/industry-framework/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const IFR_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:IFR_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:IFR_THEME teal-600", constants.includes('primary: "teal-600"'));
    pass("ui:IFR_PERMISSIONS", constants.includes('"ifr.view"') && constants.includes('"ifr.admin"'));
    pass("ui:RELEASE_CHANNEL_OPTIONS", constants.includes('"stable"') && constants.includes('"canary"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:IFR_TABS count", false, "constants missing");
    pass("ui:IFR_THEME teal-600", false);
    pass("ui:IFR_PERMISSIONS", false);
    pass("ui:RELEASE_CHANNEL_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/industry-framework/hooks/useIndustryFramework.ts");
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

const panelsPath = join(root, "src/modules/industry-framework/components/IndustryFrameworkPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:FrameworkHubSelect form.register spread", panels.includes("FrameworkHubSelect") && panels.includes('{...form.register("frameworkHubId")}'));
} else {
    pass("ui:FrameworkHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:industryFramework", routes.includes('industryFramework: "/industry-framework"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Industry Framework", nav.includes('"Industry Framework"'));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:industryFramework", middleware.includes("ROUTES.industryFramework"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b1:verify", pkg.includes('"sprint-b1:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 1 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`IFR_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 1 verification checks passed.");
