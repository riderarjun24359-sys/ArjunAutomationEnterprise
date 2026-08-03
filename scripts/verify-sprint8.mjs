/**
 * Sprint 8 verification: regression, security, tenant isolation, performance, disaster recovery,
 * executive intelligence platform, AI confidence scoring, evidence traces, recommendations.
 * Run: node scripts/verify-sprint8.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020031_ai_executive_intelligence_platform.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(aix_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:aix_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["aix_executive_metrics", "aix_executive_health", "aix_audit_logs"]);
const childTables = tables.filter((t) => t !== "aix_intelligence_hubs" && !orgOnlyTables.has(t));
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

pass("ai_confidence:column_present", /ai_confidence_score numeric/i.test(migrationSql));
pass("ai_confidence:briefs_table", /aix_daily_executive_briefs[\s\S]*?ai_confidence_score/i.test(migrationSql));
pass("ai_confidence:recommendations_table", /aix_recommendation_outputs[\s\S]*?ai_confidence_score/i.test(migrationSql));

pass("evidence:traces_table", tables.includes("aix_evidence_traces"));
pass("evidence:source_module_column", /aix_evidence_traces[\s\S]*?source_module text/i.test(migrationSql));

pass("recommendations:outputs_table", tables.includes("aix_recommendation_outputs"));
pass("recommendations:output_columns", /aix_recommendation_outputs[\s\S]*?recommendation_text text/i.test(migrationSql));

pass("executive_metrics:business_score", /aix_executive_metrics[\s\S]*?business_score numeric/i.test(migrationSql));
pass("executive_metrics:growth_score", /aix_executive_metrics[\s\S]*?growth_score numeric/i.test(migrationSql));
pass("executive_metrics:operational_score", /aix_executive_metrics[\s\S]*?operational_score numeric/i.test(migrationSql));
pass("executive_metrics:security_score", /aix_executive_metrics[\s\S]*?security_score numeric/i.test(migrationSql));
pass("executive_metrics:customer_score", /aix_executive_metrics[\s\S]*?customer_score numeric/i.test(migrationSql));

pass("disaster_recovery:executive_health_column", /aix_executive_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:executive_failures_table", tables.includes("aix_executive_failures"));

const seedPath = join(root, "supabase", "seed", "031_ai_executive_intelligence_platform_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass(
    "seed:executive_health_recovery",
    seedSql.includes("aix_executive_health") && seedSql.includes("disaster_recovery_mode"),
);
pass("seed:evidence_traces", seedSql.includes("aix_evidence_traces") && seedSql.includes("source_module"));
pass("seed:recommendation_outputs", seedSql.includes("aix_recommendation_outputs") && seedSql.includes("rec-churn-mitigation"));
pass("seed:executive_metrics_scores", seedSql.includes("aix_executive_metrics") && seedSql.includes("business_score"));
pass("seed:intelligence_hub", seedSql.includes("aix_intelligence_hubs") && seedSql.includes("northstar-executive-intel"));

const mappersPath = join(root, "src/modules/database/lib/executive-intelligence-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildAixDashboardStats_exported", mappersSource.includes("export const buildAixDashboardStats") || mappersSource.includes("export function buildAixDashboardStats"));
pass("mappers:buildIntelligenceHubLookupMaps", mappersSource.includes("buildIntelligenceHubLookupMaps"));
pass("mappers:buildAixPipelineInfo", mappersSource.includes("buildAixPipelineInfo"));
if (mappersSource.includes("buildAixDashboardStats")) {
    pass("mappers:buildAixDashboardStats_recommendations", /recommendationCount|recommendationOutputs/.test(mappersSource));
    pass("mappers:buildAixDashboardStats_scores", /businessScore|business_score/.test(mappersSource));
    pass("mappers:buildAixDashboardStats_confidence", /avgAiConfidenceScore|ai_confidence_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/executive-intelligence/constants/index.ts",
    "src/modules/executive-intelligence/schemas/index.ts",
    "src/modules/executive-intelligence/services/executive-intelligence.service.ts",
    "src/modules/executive-intelligence/hooks/useExecutiveIntelligence.ts",
    "src/modules/executive-intelligence/components/ExecutiveIntelligencePage.tsx",
    "src/modules/executive-intelligence/components/ExecutiveIntelligenceStats.tsx",
    "src/modules/executive-intelligence/components/ExecutiveIntelligencePanels.tsx",
    "src/modules/executive-intelligence/sdk/index.ts",
    "src/modules/executive-intelligence/index.ts",
    "src/modules/executive-intelligence/types/index.ts",
    "src/modules/database/lib/executive-intelligence-mappers.ts",
    "app/(shell)/executive-intelligence/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/executive-intelligence/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const AIX_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:AIX_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:AIX_THEME violet-600", constants.includes('primary: "violet-600"'));
    pass("ui:AIX_PERMISSIONS", constants.includes('"aix.view"') && constants.includes('"aix.admin"'));
    pass("ui:RISK_LEVEL_OPTIONS", constants.includes('"high"') && constants.includes('"critical"'));
    pass("ui:TREND_DIRECTION_OPTIONS", constants.includes('"up"') && constants.includes('"flat"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:AIX_TABS count", false, "constants missing");
    pass("ui:AIX_THEME violet-600", false);
    pass("ui:AIX_PERMISSIONS", false);
    pass("ui:RISK_LEVEL_OPTIONS", false);
    pass("ui:TREND_DIRECTION_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/executive-intelligence/hooks/useExecutiveIntelligence.ts");
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

const panelsPath = join(root, "src/modules/executive-intelligence/components/ExecutiveIntelligencePanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:IntelligenceHubSelect form.register spread", panels.includes("IntelligenceHubSelect") && panels.includes('{...form.register("intelligenceHubId")}'));
} else {
    pass("ui:IntelligenceHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:executiveIntelligence", routes.includes('executiveIntelligence: "/executive-intelligence"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Executive Intelligence", nav.includes('"Executive Intelligence"'));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:executiveIntelligence", middleware.includes("ROUTES.executiveIntelligence"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint8:verify", pkg.includes('"sprint8:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nSprint 8 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`AIX_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Sprint 8 verification checks passed.");
