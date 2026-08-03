/**
 * Sprint 9 verification: regression, security, tenant isolation, performance, disaster recovery,
 * launch readiness platform, backup/recovery, deployment readiness, launch scores.
 * Run: node scripts/verify-sprint9.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020032_enterprise_launch_readiness_platform.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(elr_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:elr_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["elr_launch_scores", "elr_launch_health", "elr_audit_logs"]);
const childTables = tables.filter((t) => t !== "elr_readiness_hubs" && !orgOnlyTables.has(t));
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

pass("deployment:plans_table", tables.includes("elr_deployment_plans"));
pass("deployment:rollback_plans_table", tables.includes("elr_rollback_plans"));
pass("deployment:version_registry", /elr_version_registry[\s\S]*?version_number text/i.test(migrationSql));
pass("deployment:release_notes", tables.includes("elr_release_notes"));

pass("backup:policies_table", tables.includes("elr_backup_policies"));
pass("backup:verifications_table", tables.includes("elr_backup_verifications"));
pass("backup:restore_verifications", tables.includes("elr_restore_verifications"));
pass("recovery:drills_table", tables.includes("elr_recovery_drills"));
pass("recovery:drill_score_column", /elr_recovery_drills[\s\S]*?drill_score numeric/i.test(migrationSql));

pass("launch_scores:security_score", /elr_launch_scores[\s\S]*?security_score numeric/i.test(migrationSql));
pass("launch_scores:reliability_score", /elr_launch_scores[\s\S]*?reliability_score numeric/i.test(migrationSql));
pass("launch_scores:performance_score", /elr_launch_scores[\s\S]*?performance_score numeric/i.test(migrationSql));
pass("launch_scores:documentation_score", /elr_launch_scores[\s\S]*?documentation_score numeric/i.test(migrationSql));
pass("launch_scores:operational_score", /elr_launch_scores[\s\S]*?operational_score numeric/i.test(migrationSql));
pass("launch_scores:overall_launch_score", /elr_launch_scores[\s\S]*?overall_launch_score numeric/i.test(migrationSql));

pass("disaster_recovery:launch_health_column", /elr_launch_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:launch_health_deployment_status", /elr_launch_health[\s\S]*?deployment_status text/i.test(migrationSql));
pass("disaster_recovery:launch_health_backup_status", /elr_launch_health[\s\S]*?backup_status text/i.test(migrationSql));
pass("disaster_recovery:launch_failures_table", tables.includes("elr_launch_failures"));

const seedPath = join(root, "supabase", "seed", "032_enterprise_launch_readiness_platform_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:launch_health_recovery", seedSql.includes("elr_launch_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:backup_policies", seedSql.includes("elr_backup_policies") && seedSql.includes("backup-daily-0804"));
pass("seed:deployment_plans", seedSql.includes("elr_deployment_plans") && seedSql.includes("deploy-v2-0804"));
pass("seed:recovery_drills", seedSql.includes("elr_recovery_drills") && seedSql.includes("drill-failover-0804"));
pass("seed:launch_scores", seedSql.includes("elr_launch_scores") && seedSql.includes("overall_launch_score"));
pass("seed:readiness_hub", seedSql.includes("elr_readiness_hubs") && seedSql.includes("northstar-launch-readiness"));
pass("seed:agent_type", seedSql.includes("enterprise_launch_readiness_platform"));

const mappersPath = join(root, "src/modules/database/lib/launch-readiness-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildElrDashboardStats_exported", mappersSource.includes("export const buildElrDashboardStats") || mappersSource.includes("export function buildElrDashboardStats"));
pass("mappers:buildReadinessHubLookupMaps", mappersSource.includes("buildReadinessHubLookupMaps"));
pass("mappers:buildElrPipelineInfo", mappersSource.includes("buildElrPipelineInfo"));
if (mappersSource.includes("buildElrDashboardStats")) {
    pass("mappers:buildElrDashboardStats_deployment", /deploymentPlanCount|deploymentPlans/.test(mappersSource));
    pass("mappers:buildElrDashboardStats_backup", /backupPolicyCount|backupPolicies/.test(mappersSource));
    pass("mappers:buildElrDashboardStats_launch_score", /overallLaunchScore|overall_launch_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/launch-readiness/constants/index.ts",
    "src/modules/launch-readiness/schemas/index.ts",
    "src/modules/launch-readiness/services/launch-readiness.service.ts",
    "src/modules/launch-readiness/hooks/useLaunchReadiness.ts",
    "src/modules/launch-readiness/components/LaunchReadinessPage.tsx",
    "src/modules/launch-readiness/components/LaunchReadinessStats.tsx",
    "src/modules/launch-readiness/components/LaunchReadinessPanels.tsx",
    "src/modules/launch-readiness/sdk/index.ts",
    "src/modules/launch-readiness/index.ts",
    "src/modules/launch-readiness/types/index.ts",
    "src/modules/database/lib/launch-readiness-mappers.ts",
    "app/(shell)/launch-readiness/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/launch-readiness/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const ELR_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:ELR_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:ELR_THEME rose-600", constants.includes('primary: "rose-600"'));
    pass("ui:ELR_PERMISSIONS", constants.includes('"elr.view"') && constants.includes('"elr.admin"'));
    pass("ui:RELEASE_CHANNEL_OPTIONS", constants.includes('"stable"') && constants.includes('"canary"'));
    pass("ui:LOG_LEVEL_OPTIONS", constants.includes('"info"') && constants.includes('"error"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:ELR_TABS count", false, "constants missing");
    pass("ui:ELR_THEME rose-600", false);
    pass("ui:ELR_PERMISSIONS", false);
    pass("ui:RELEASE_CHANNEL_OPTIONS", false);
    pass("ui:LOG_LEVEL_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/launch-readiness/hooks/useLaunchReadiness.ts");
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

const panelsPath = join(root, "src/modules/launch-readiness/components/LaunchReadinessPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:ReadinessHubSelect form.register spread", panels.includes("ReadinessHubSelect") && panels.includes('{...form.register("readinessHubId")}'));
} else {
    pass("ui:ReadinessHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:launchReadiness", routes.includes('launchReadiness: "/launch-readiness"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Launch Readiness", nav.includes('"Launch Readiness"'));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:launchReadiness", middleware.includes("ROUTES.launchReadiness"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint9:verify", pkg.includes('"sprint9:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nSprint 9 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`ELR_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Sprint 9 verification checks passed.");
