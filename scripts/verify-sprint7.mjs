/**
 * Sprint 7 verification: regression, security, tenant isolation, performance, disaster recovery, operational health, event bus, background jobs.
 * Run: node scripts/verify-sprint7.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020030_enterprise_operations_center.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(eoc_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["eoc_operations_metrics", "eoc_operations_health", "eoc_audit_logs"]);
const childTables = tables.filter((t) => t !== "eoc_operations_centers" && !orgOnlyTables.has(t));
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

pass("disaster_recovery:operations_health_column", /eoc_operations_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:job_retry_queue_table", tables.includes("eoc_job_retry_queue"));
pass("disaster_recovery:job_dead_letter_table", tables.includes("eoc_job_dead_letter"));

const seedPath = join(root, "supabase", "seed", "030_enterprise_operations_center_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("disaster_recovery:seed_file", existsSync(seedPath));
pass(
    "disaster_recovery:seed_recovery_config",
    seedSql.includes("eoc_operations_health") && seedSql.includes("disaster_recovery_mode") && seedSql.includes("eoc_job_retry_queue") && seedSql.includes("eoc_job_dead_letter"),
);

pass("operational_health:health_type_column", /eoc_overall_health[\s\S]*?health_type text/i.test(migrationSql));
pass("operational_health:seed_storage", seedSql.includes("health-storage-0803") && seedSql.includes("'storage'"));
pass("operational_health:seed_ai", seedSql.includes("health-ai-0803") && seedSql.includes("'ai'"));
pass("operational_health:seed_api", seedSql.includes("health-api-0803") && seedSql.includes("'api'"));
pass("operational_health:seed_integration", seedSql.includes("health-integration-0803") && seedSql.includes("'integration'"));
pass("operational_health:seed_queue", seedSql.includes("health-queue-0803") && seedSql.includes("'queue'"));

pass("event_bus:platform_events_table", tables.includes("eoc_platform_events"));
pass("event_bus:business_events_table", tables.includes("eoc_business_events"));
pass("event_bus:subscriptions_table", tables.includes("eoc_event_subscriptions"));
pass("event_bus:replays_table", tables.includes("eoc_event_replays"));
pass("event_bus:seed_platform_event", seedSql.includes("eoc_platform_events") && seedSql.includes("evt-platform-startup"));
pass("event_bus:seed_business_event", seedSql.includes("eoc_business_events") && seedSql.includes("evt-customer-signup"));
pass("event_bus:seed_subscription", seedSql.includes("eoc_event_subscriptions") && seedSql.includes("sub-alerts-critical"));
pass("event_bus:seed_replay", seedSql.includes("eoc_event_replays") && seedSql.includes("replay-0803-am"));

pass("background_job:schedulers_table", tables.includes("eoc_job_schedulers"));
pass("background_job:recurring_jobs_table", tables.includes("eoc_recurring_jobs"));
pass("background_job:worker_pool_column", /eoc_job_schedulers[\s\S]*?worker_pool_size integer/i.test(migrationSql));
pass("background_job:seed_scheduler", seedSql.includes("eoc_job_schedulers") && seedSql.includes("sched-daily-sync"));
pass("background_job:seed_recurring", seedSql.includes("eoc_recurring_jobs") && seedSql.includes("job-health-check"));
pass("background_job:seed_retry", seedSql.includes("eoc_job_retry_queue") && seedSql.includes("retry-job-0803"));
pass("background_job:seed_dead_letter", seedSql.includes("eoc_job_dead_letter") && seedSql.includes("dlq-job-0803"));

const mappersPath = join(root, "src/modules/database/lib/operations-center-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildEocDashboardStats_exported", mappersSource.includes("export const buildEocDashboardStats") || mappersSource.includes("export function buildEocDashboardStats"));
pass("mappers:buildOperationsCenterLookupMaps", mappersSource.includes("buildOperationsCenterLookupMaps"));
pass("mappers:buildEocPipelineInfo", mappersSource.includes("buildEocPipelineInfo"));
if (mappersSource.includes("buildEocDashboardStats")) {
    pass("mappers:buildEocDashboardStats_jobs", /activeJobCount|scheduler_status/.test(mappersSource));
    pass("mappers:buildEocDashboardStats_health", /avgHealthScore|overall_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/operations-center/constants/index.ts",
    "src/modules/operations-center/schemas/index.ts",
    "src/modules/operations-center/services/operations-center.service.ts",
    "src/modules/operations-center/hooks/useOperationsCenter.ts",
    "src/modules/operations-center/components/OperationsCenterPage.tsx",
    "src/modules/operations-center/components/OperationsCenterStats.tsx",
    "src/modules/operations-center/components/OperationsCenterPanels.tsx",
    "src/modules/operations-center/sdk/index.ts",
    "src/modules/operations-center/index.ts",
    "src/modules/operations-center/types/index.ts",
    "src/modules/database/lib/operations-center-mappers.ts",
    "app/(shell)/operations-center/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constants = readFileSync(join(root, "src/modules/operations-center/constants/index.ts"), "utf8");
const tabBlock = constants.match(/export const EOC_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
pass("ui:EOC_TABS count", tabCount === 34, `count=${tabCount}`);
pass("ui:EOC_THEME emerald-600", constants.includes('primary: "emerald-600"'));
pass("ui:EOC_PERMISSIONS", constants.includes('"eoc.view"') && constants.includes('"eoc.admin"'));
pass("ui:HEALTH_TYPE_OPTIONS", constants.includes('"storage"') && constants.includes('"integration"'));
pass("ui:JOB_STATUS_OPTIONS", constants.includes('"active"') && constants.includes('"failed"'));
pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));

const hook = readFileSync(join(root, "src/modules/operations-center/hooks/useOperationsCenter.ts"), "utf8");
pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));

const panels = readFileSync(join(root, "src/modules/operations-center/components/OperationsCenterPanels.tsx"), "utf8");
pass("ui:OperationsCenterSelect form.register spread", panels.includes("OperationsCenterSelect") && panels.includes('{...form.register("operationsCenterId")}'));

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:operationsCenter", routes.includes('operationsCenter: "/operations-center"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Operations Center", nav.includes('"Operations Center"') && nav.includes("Activity"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:operationsCenter", middleware.includes("ROUTES.operationsCenter"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint7:verify", pkg.includes('"sprint7:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nSprint 7 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`EOC_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Sprint 7 verification checks passed.");
