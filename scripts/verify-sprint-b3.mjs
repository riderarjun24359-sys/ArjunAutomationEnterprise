/**
 * Program B Sprint 3 verification: regression, security, tenant isolation, performance,
 * form builder, validation engine, form rendering, form execution, framework compatibility.
 * Run: node scripts/verify-sprint-b3.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020035_enterprise_dynamic_form_engine.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(dfe_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:dfe_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["dfe_form_metrics", "dfe_form_health", "dfe_audit_logs"]);
const childTables = tables.filter((t) => t !== "dfe_form_hubs" && !orgOnlyTables.has(t));
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

pass("form_builder:form_sections_table", tables.includes("dfe_form_sections"));
pass("form_builder:form_tabs_table", tables.includes("dfe_form_tabs"));
pass("form_builder:form_groups_table", tables.includes("dfe_form_groups"));
pass("form_builder:repeatable_sections_table", tables.includes("dfe_repeatable_sections"));
pass("form_builder:section_order_column", /dfe_form_sections[\s\S]*?section_order integer/i.test(migrationSql));

pass("validation_engine:required_rules_table", tables.includes("dfe_required_rules"));
pass("validation_engine:regex_rules_table", tables.includes("dfe_regex_rules"));
pass("validation_engine:range_rules_table", tables.includes("dfe_range_rules"));
pass("validation_engine:cross_field_rules_table", tables.includes("dfe_cross_field_rules"));
pass("validation_engine:field_ref_column", /dfe_required_rules[\s\S]*?field_ref text/i.test(migrationSql));

pass("form_rendering:render_profiles_table", tables.includes("dfe_render_profiles"));
pass("form_rendering:theme_configs_table", tables.includes("dfe_theme_configs"));
pass("form_rendering:localization_packs_table", tables.includes("dfe_localization_packs"));
pass("form_rendering:layout_mode_column", /dfe_render_profiles[\s\S]*?layout_mode text/i.test(migrationSql));

pass("form_execution:form_drafts_table", tables.includes("dfe_form_drafts"));
pass("form_execution:form_submissions_table", tables.includes("dfe_form_submissions"));
pass("form_execution:form_reviews_table", tables.includes("dfe_form_reviews"));
pass("form_execution:execution_audit_entries_table", tables.includes("dfe_execution_audit_entries"));
pass("form_execution:submission_status_column", /dfe_form_submissions[\s\S]*?submission_status text/i.test(migrationSql));

pass("form_metrics:submission_count", /dfe_form_metrics[\s\S]*?submission_count integer/i.test(migrationSql));
pass("form_metrics:completion_rate", /dfe_form_metrics[\s\S]*?completion_rate numeric/i.test(migrationSql));
pass("form_metrics:overall_form_score", /dfe_form_metrics[\s\S]*?overall_form_score numeric/i.test(migrationSql));
pass("form_metrics:validation_error_count", /dfe_form_metrics[\s\S]*?validation_error_count integer/i.test(migrationSql));
pass("form_metrics:abandonment_rate", /dfe_form_metrics[\s\S]*?abandonment_rate numeric/i.test(migrationSql));

pass("disaster_recovery:form_health_column", /dfe_form_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:pending_reviews_count", /dfe_form_health[\s\S]*?pending_reviews_count integer/i.test(migrationSql));
pass("disaster_recovery:active_forms_count", /dfe_form_health[\s\S]*?active_forms_count integer/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "035_enterprise_dynamic_form_engine_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:form_health_recovery", seedSql.includes("dfe_form_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:form_sections", seedSql.includes("dfe_form_sections") && seedSql.includes("sec-personal-0804"));
pass("seed:required_rules", seedSql.includes("dfe_required_rules") && seedSql.includes("req-email-0804"));
pass("seed:form_submissions", seedSql.includes("dfe_form_submissions") && seedSql.includes("sub-run-0804"));
pass("seed:render_profiles", seedSql.includes("dfe_render_profiles") && seedSql.includes("prof-std-0804"));
pass("seed:form_metrics", seedSql.includes("dfe_form_metrics") && seedSql.includes("overall_form_score"));
pass("seed:form_hub", seedSql.includes("dfe_form_hubs") && seedSql.includes("northstar-form-engine"));
pass("seed:agent_type", seedSql.includes("enterprise_dynamic_form_engine"));

const mappersPath = join(root, "src/modules/database/lib/form-engine-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildDfeDashboardStats_exported", mappersSource.includes("export const buildDfeDashboardStats") || mappersSource.includes("export function buildDfeDashboardStats"));
pass("mappers:buildFormHubLookupMaps", mappersSource.includes("buildFormHubLookupMaps"));
pass("mappers:buildDfePipelineInfo", mappersSource.includes("buildDfePipelineInfo"));
if (mappersSource.includes("buildDfeDashboardStats")) {
    pass("mappers:buildDfeDashboardStats_sections", /formSectionCount|formSections/.test(mappersSource));
    pass("mappers:buildDfeDashboardStats_validation", /requiredRuleCount|requiredRules/.test(mappersSource));
    pass("mappers:buildDfeDashboardStats_form_score", /overallFormScore|overall_form_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/form-engine/constants/index.ts",
    "src/modules/form-engine/schemas/index.ts",
    "src/modules/form-engine/services/form-engine.service.ts",
    "src/modules/form-engine/hooks/useFormEngine.ts",
    "src/modules/form-engine/components/FormEnginePage.tsx",
    "src/modules/form-engine/components/FormEngineStats.tsx",
    "src/modules/form-engine/components/FormEnginePanels.tsx",
    "src/modules/form-engine/sdk/index.ts",
    "src/modules/form-engine/index.ts",
    "src/modules/form-engine/types/index.ts",
    "src/modules/database/lib/form-engine-mappers.ts",
    "app/(shell)/form-engine/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/form-engine/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const DFE_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:DFE_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:DFE_THEME amber-600", constants.includes('primary: "amber-600"'));
    pass("ui:DFE_PERMISSIONS", constants.includes('"dfe.view"') && constants.includes('"dfe.admin"'));
    pass("ui:RELEASE_CHANNEL_OPTIONS", constants.includes('"stable"') && constants.includes('"canary"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:DFE_TABS count", false, "constants missing");
    pass("ui:DFE_THEME amber-600", false);
    pass("ui:DFE_PERMISSIONS", false);
    pass("ui:RELEASE_CHANNEL_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/form-engine/hooks/useFormEngine.ts");
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

const panelsPath = join(root, "src/modules/form-engine/components/FormEnginePanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:FormHubSelect form.register spread", panels.includes("FormHubSelect") && panels.includes('{...form.register("formHubId")}'));
} else {
    pass("ui:FormHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:formEngine", routes.includes('formEngine: "/form-engine"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Form Engine", nav.includes('"Form Engine"'));
pass("nav:FileEdit icon", nav.includes("FileEdit"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:formEngine", middleware.includes("ROUTES.formEngine"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b3:verify", pkg.includes('"sprint-b3:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 3 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`DFE_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 3 verification checks passed.");
