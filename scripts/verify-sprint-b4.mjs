/**
 * Program B Sprint 4 verification: regression, security, tenant isolation, performance,
 * workflow registry, visual designer, execution engine, automation, and framework compatibility.
 * Run: node scripts/verify-sprint-b4.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020036_enterprise_dynamic_workflow_engine.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(dwe_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:dwe_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["dwe_workflow_metrics", "dwe_workflow_health", "dwe_audit_logs"]);
const childTables = tables.filter((t) => t !== "dwe_workflow_hubs" && !orgOnlyTables.has(t));
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

pass("workflow:workflow_definitions_table", tables.includes("dwe_workflow_definitions"));
pass("workflow:workflow_categories_table", tables.includes("dwe_workflow_categories"));
pass("workflow:workflow_templates_table", tables.includes("dwe_workflow_templates"));
pass("workflow:workflow_versions_table", tables.includes("dwe_workflow_versions"));
pass("workflow:workflow_key_column", /dwe_workflow_definitions[\s\S]*?workflow_key text/i.test(migrationSql));

pass("visual_designer:workflow_nodes_table", tables.includes("dwe_workflow_nodes"));
pass("visual_designer:workflow_transitions_table", tables.includes("dwe_workflow_transitions"));
pass("visual_designer:decision_nodes_table", tables.includes("dwe_decision_nodes"));
pass("visual_designer:reusable_subflows_table", tables.includes("dwe_reusable_subflows"));
pass("visual_designer:node_order_column", /dwe_workflow_nodes[\s\S]*?node_order integer/i.test(migrationSql));

pass("execution:workflow_executions_table", tables.includes("dwe_workflow_executions"));
pass("execution:execution_history_table", tables.includes("dwe_execution_history"));
pass("execution:execution_retries_table", tables.includes("dwe_execution_retries"));
pass("execution:execution_rollbacks_table", tables.includes("dwe_execution_rollbacks"));
pass("execution:execution_status_column", /dwe_workflow_executions[\s\S]*?execution_status text/i.test(migrationSql));

pass("automation:automation_notifications_table", tables.includes("dwe_automation_notifications"));
pass("automation:automation_api_calls_table", tables.includes("dwe_automation_api_calls"));
pass("automation:automation_integrations_table", tables.includes("dwe_automation_integrations"));
pass("automation:channel_column", /dwe_automation_notifications[\s\S]*?channel text/i.test(migrationSql));

pass("workflow_metrics:execution_count", /dwe_workflow_metrics[\s\S]*?execution_count integer/i.test(migrationSql));
pass("workflow_metrics:failure_rate", /dwe_workflow_metrics[\s\S]*?failure_rate numeric/i.test(migrationSql));
pass("workflow_metrics:overall_workflow_score", /dwe_workflow_metrics[\s\S]*?overall_workflow_score numeric/i.test(migrationSql));
pass("workflow_metrics:success_rate", /dwe_workflow_metrics[\s\S]*?success_rate numeric/i.test(migrationSql));
pass("workflow_metrics:bottleneck_score", /dwe_workflow_metrics[\s\S]*?bottleneck_score numeric/i.test(migrationSql));

pass("disaster_recovery:workflow_health_column", /dwe_workflow_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:running_workflows_count", /dwe_workflow_health[\s\S]*?running_workflows_count integer/i.test(migrationSql));
pass("disaster_recovery:pending_tasks_count", /dwe_workflow_health[\s\S]*?pending_tasks_count integer/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "036_enterprise_dynamic_workflow_engine_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:workflow_health_recovery", seedSql.includes("dwe_workflow_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:workflow_nodes", seedSql.includes("dwe_workflow_nodes") && seedSql.includes("node-start-0804"));
pass("seed:escalation_rules", seedSql.includes("dwe_escalation_rules") && seedSql.includes("esc-l1-0804"));
pass("seed:workflow_executions", seedSql.includes("dwe_workflow_executions") && seedSql.includes("exec-run-0804"));
pass("seed:automation_notifications", seedSql.includes("dwe_automation_notifications") && seedSql.includes("ntf-email-0804"));
pass("seed:workflow_metrics", seedSql.includes("dwe_workflow_metrics") && seedSql.includes("overall_workflow_score"));
pass("seed:workflow_hub", seedSql.includes("dwe_workflow_hubs") && seedSql.includes("northstar-workflow-engine"));
pass("seed:agent_type", seedSql.includes("enterprise_dynamic_workflow_engine"));

const mappersPath = join(root, "src/modules/database/lib/workflow-engine-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildDweDashboardStats_exported", mappersSource.includes("export const buildDweDashboardStats") || mappersSource.includes("export function buildDweDashboardStats"));
pass("mappers:buildWorkflowHubLookupMaps", mappersSource.includes("buildWorkflowHubLookupMaps"));
pass("mappers:buildDwePipelineInfo", mappersSource.includes("buildDwePipelineInfo"));
if (mappersSource.includes("buildDweDashboardStats")) {
    pass("mappers:buildDweDashboardStats_nodes", /workflowNodeCount|workflowNodes/.test(mappersSource));
    pass("mappers:buildDweDashboardStats_automation", /escalationRuleCount|escalationRules/.test(mappersSource));
    pass("mappers:buildDweDashboardStats_workflow_score", /overallWorkflowScore|overall_workflow_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/workflow-engine/constants/index.ts",
    "src/modules/workflow-engine/schemas/index.ts",
    "src/modules/workflow-engine/services/workflow-engine.service.ts",
    "src/modules/workflow-engine/hooks/useWorkflowEngine.ts",
    "src/modules/workflow-engine/components/WorkflowEnginePage.tsx",
    "src/modules/workflow-engine/components/WorkflowEngineStats.tsx",
    "src/modules/workflow-engine/components/WorkflowEnginePanels.tsx",
    "src/modules/workflow-engine/sdk/index.ts",
    "src/modules/workflow-engine/index.ts",
    "src/modules/workflow-engine/types/index.ts",
    "src/modules/database/lib/workflow-engine-mappers.ts",
    "app/(shell)/workflow-engine/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/workflow-engine/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const DWE_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:DWE_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:DWE_THEME indigo-600", constants.includes('primary: "indigo-600"'));
    pass("ui:DWE_PERMISSIONS", constants.includes('"dwe.view"') && constants.includes('"dwe.admin"'));
    pass("ui:RELEASE_CHANNEL_OPTIONS", constants.includes('"stable"') && constants.includes('"canary"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:DWE_TABS count", false, "constants missing");
    pass("ui:DWE_THEME indigo-600", false);
    pass("ui:DWE_PERMISSIONS", false);
    pass("ui:RELEASE_CHANNEL_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/workflow-engine/hooks/useWorkflowEngine.ts");
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

const panelsPath = join(root, "src/modules/workflow-engine/components/WorkflowEnginePanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:WorkflowHubSelect form.register spread", panels.includes("WorkflowHubSelect") && panels.includes('{...form.register("workflowHubId")}'));
} else {
    pass("ui:WorkflowHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:workflowEngine", routes.includes('workflowEngine: "/workflow-engine"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Workflow Engine", nav.includes('"Workflow Engine"'));
pass("nav:Workflow icon", nav.includes("Workflow"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:workflowEngine", middleware.includes("ROUTES.workflowEngine"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b4:verify", pkg.includes('"sprint-b4:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 4 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`DWE_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 4 verification checks passed.");
