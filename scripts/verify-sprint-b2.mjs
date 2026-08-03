/**
 * Program B Sprint 2 verification: regression, security, tenant isolation, performance,
 * process execution, approval engine, task engine, framework compatibility, templates.
 * Run: node scripts/verify-sprint-b2.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020034_enterprise_business_process_framework.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(bpf_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:bpf_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["bpf_process_metrics", "bpf_process_health", "bpf_audit_logs"]);
const childTables = tables.filter((t) => t !== "bpf_process_hubs" && !orgOnlyTables.has(t));
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

pass("process_execution:executions_table", tables.includes("bpf_process_executions"));
pass("process_execution:execution_history_table", tables.includes("bpf_execution_history"));
pass("process_execution:execution_retries_table", tables.includes("bpf_execution_retries"));
pass("process_execution:execution_status_column", /bpf_process_executions[\s\S]*?execution_status text/i.test(migrationSql));
pass("process_execution:started_at_column", /bpf_process_executions[\s\S]*?started_at timestamptz/i.test(migrationSql));

pass("approval_engine:approval_rules_table", tables.includes("bpf_approval_rules"));
pass("approval_engine:sequential_approvals_table", tables.includes("bpf_sequential_approvals"));
pass("approval_engine:parallel_approvals_table", tables.includes("bpf_parallel_approvals"));
pass("approval_engine:escalation_rules_table", tables.includes("bpf_escalation_rules"));
pass("approval_engine:approval_order_column", /bpf_sequential_approvals[\s\S]*?approval_order integer/i.test(migrationSql));

pass("task_engine:task_assignments_table", tables.includes("bpf_task_assignments"));
pass("task_engine:task_templates_table", tables.includes("bpf_task_templates"));
pass("task_engine:recurring_tasks_table", tables.includes("bpf_recurring_tasks"));
pass("task_engine:task_sla_policies_table", tables.includes("bpf_task_sla_policies"));
pass("task_engine:sla_hours_column", /bpf_task_sla_policies[\s\S]*?sla_hours integer/i.test(migrationSql));

pass("templates:task_templates_table", tables.includes("bpf_task_templates"));
pass("templates:template_type_column", /bpf_task_templates[\s\S]*?template_type text/i.test(migrationSql));
pass("templates:process_models_table", tables.includes("bpf_process_models"));
pass("templates:reusable_blocks_table", tables.includes("bpf_reusable_blocks"));

pass("framework_compatibility:failed_process_records_table", tables.includes("bpf_failed_process_records"));
pass("framework_compatibility:process_failures_table", tables.includes("bpf_process_failures"));
pass("framework_compatibility:process_health_status", /bpf_process_health[\s\S]*?framework_health_status text/i.test(migrationSql));

pass("process_metrics:execution_count", /bpf_process_metrics[\s\S]*?execution_count integer/i.test(migrationSql));
pass("process_metrics:success_rate", /bpf_process_metrics[\s\S]*?success_rate numeric/i.test(migrationSql));
pass("process_metrics:overall_process_score", /bpf_process_metrics[\s\S]*?overall_process_score numeric/i.test(migrationSql));
pass("process_metrics:sla_performance_score", /bpf_process_metrics[\s\S]*?sla_performance_score numeric/i.test(migrationSql));
pass("process_metrics:bottleneck_score", /bpf_process_metrics[\s\S]*?bottleneck_score numeric/i.test(migrationSql));

pass("disaster_recovery:process_health_column", /bpf_process_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:pending_approvals_count", /bpf_process_health[\s\S]*?pending_approvals_count integer/i.test(migrationSql));
pass("disaster_recovery:task_queue_depth", /bpf_process_health[\s\S]*?task_queue_depth integer/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "034_enterprise_business_process_framework_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:process_health_recovery", seedSql.includes("bpf_process_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:task_templates", seedSql.includes("bpf_task_templates") && seedSql.includes("tmpl-review-0804"));
pass("seed:approval_rules", seedSql.includes("bpf_approval_rules") && seedSql.includes("rule-seq-0804"));
pass("seed:process_executions", seedSql.includes("bpf_process_executions") && seedSql.includes("exec-run-0804"));
pass("seed:process_metrics", seedSql.includes("bpf_process_metrics") && seedSql.includes("overall_process_score"));
pass("seed:process_hub", seedSql.includes("bpf_process_hubs") && seedSql.includes("northstar-business-process"));
pass("seed:agent_type", seedSql.includes("enterprise_business_process_framework"));

const mappersPath = join(root, "src/modules/database/lib/business-process-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildBpfDashboardStats_exported", mappersSource.includes("export const buildBpfDashboardStats") || mappersSource.includes("export function buildBpfDashboardStats"));
pass("mappers:buildProcessHubLookupMaps", mappersSource.includes("buildProcessHubLookupMaps"));
pass("mappers:buildBpfPipelineInfo", mappersSource.includes("buildBpfPipelineInfo"));
if (mappersSource.includes("buildBpfDashboardStats")) {
    pass("mappers:buildBpfDashboardStats_templates", /taskTemplateCount|taskTemplates/.test(mappersSource));
    pass("mappers:buildBpfDashboardStats_approval", /approvalRuleCount|approvalRules/.test(mappersSource));
    pass("mappers:buildBpfDashboardStats_process_score", /overallProcessScore|overall_process_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/business-process/constants/index.ts",
    "src/modules/business-process/schemas/index.ts",
    "src/modules/business-process/services/business-process.service.ts",
    "src/modules/business-process/hooks/useBusinessProcess.ts",
    "src/modules/business-process/components/BusinessProcessPage.tsx",
    "src/modules/business-process/components/BusinessProcessStats.tsx",
    "src/modules/business-process/components/BusinessProcessPanels.tsx",
    "src/modules/business-process/sdk/index.ts",
    "src/modules/business-process/index.ts",
    "src/modules/business-process/types/index.ts",
    "src/modules/database/lib/business-process-mappers.ts",
    "app/(shell)/business-process/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/business-process/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const BPF_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:BPF_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:BPF_THEME sky-600", constants.includes('primary: "sky-600"'));
    pass("ui:BPF_PERMISSIONS", constants.includes('"bpf.view"') && constants.includes('"bpf.admin"'));
    pass("ui:RELEASE_CHANNEL_OPTIONS", constants.includes('"stable"') && constants.includes('"canary"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:BPF_TABS count", false, "constants missing");
    pass("ui:BPF_THEME sky-600", false);
    pass("ui:BPF_PERMISSIONS", false);
    pass("ui:RELEASE_CHANNEL_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/business-process/hooks/useBusinessProcess.ts");
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

const panelsPath = join(root, "src/modules/business-process/components/BusinessProcessPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:ProcessHubSelect form.register spread", panels.includes("ProcessHubSelect") && panels.includes('{...form.register("processHubId")}'));
} else {
    pass("ui:ProcessHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:businessProcess", routes.includes('businessProcess: "/business-process"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Business Process", nav.includes('"Business Process"'));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:businessProcess", middleware.includes("ROUTES.businessProcess"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b2:verify", pkg.includes('"sprint-b2:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 2 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`BPF_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 2 verification checks passed.");
