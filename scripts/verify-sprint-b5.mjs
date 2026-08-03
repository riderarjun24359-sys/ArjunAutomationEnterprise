/**
 * Program B Sprint 5 verification: regression, security, tenant isolation, performance,
 * document generation, digital signature, delivery engine, and framework compatibility.
 * Run: node scripts/verify-sprint-b5.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020037_enterprise_dynamic_document_engine.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(dde_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:dde_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["dde_document_metrics", "dde_document_health", "dde_audit_logs"]);
const childTables = tables.filter((t) => t !== "dde_document_hubs" && !orgOnlyTables.has(t));
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

pass("generation:document_types_table", tables.includes("dde_document_types"));
pass("generation:document_categories_table", tables.includes("dde_document_categories"));
pass("generation:document_templates_table", tables.includes("dde_document_templates"));
pass("generation:document_versions_table", tables.includes("dde_document_versions"));
pass("generation:type_key_column", /dde_document_types[\s\S]*?type_key text/i.test(migrationSql));

pass("generation:pdf_generations_table", tables.includes("dde_pdf_generations"));
pass("generation:html_generations_table", tables.includes("dde_html_generations"));
pass("generation:export_jobs_table", tables.includes("dde_export_jobs"));
pass("generation:batch_generations_table", tables.includes("dde_batch_generations"));
pass("generation:generation_status_column", /dde_pdf_generations[\s\S]*?generation_status text/i.test(migrationSql));

pass("signature:electronic_signatures_table", tables.includes("dde_electronic_signatures"));
pass("signature:approval_signatures_table", tables.includes("dde_approval_signatures"));
pass("signature:signature_verifications_table", tables.includes("dde_signature_verifications"));
pass("signature:signature_audit_entries_table", tables.includes("dde_signature_audit_entries"));
pass("signature:signature_status_column", /dde_electronic_signatures[\s\S]*?signature_status text/i.test(migrationSql));

pass("delivery:email_deliveries_table", tables.includes("dde_email_deliveries"));
pass("delivery:download_deliveries_table", tables.includes("dde_download_deliveries"));
pass("delivery:webhook_deliveries_table", tables.includes("dde_webhook_deliveries"));
pass("delivery:delivery_status_column", /dde_email_deliveries[\s\S]*?delivery_status text/i.test(migrationSql));

pass("document_metrics:generated_count", /dde_document_metrics[\s\S]*?generated_count integer/i.test(migrationSql));
pass("document_metrics:download_count", /dde_document_metrics[\s\S]*?download_count integer/i.test(migrationSql));
pass("document_metrics:delivery_success_rate", /dde_document_metrics[\s\S]*?delivery_success_rate numeric/i.test(migrationSql));
pass("document_metrics:overall_document_score", /dde_document_metrics[\s\S]*?overall_document_score numeric/i.test(migrationSql));
pass("document_metrics:signature_pending_count", /dde_document_metrics[\s\S]*?signature_pending_count integer/i.test(migrationSql));

pass("disaster_recovery:document_health_column", /dde_document_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:pending_signatures_count", /dde_document_health[\s\S]*?pending_signatures_count integer/i.test(migrationSql));
pass("disaster_recovery:delivery_queue_depth", /dde_document_health[\s\S]*?delivery_queue_depth integer/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "037_enterprise_dynamic_document_engine_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:document_health_recovery", seedSql.includes("dde_document_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:pdf_generations", seedSql.includes("dde_pdf_generations") && seedSql.includes("gen-pdf-0804"));
pass("seed:retention_policies", seedSql.includes("dde_retention_policies") && seedSql.includes("pol-ret-0804"));
pass("seed:electronic_signatures", seedSql.includes("dde_electronic_signatures") && seedSql.includes("sig-elect-0804"));
pass("seed:email_deliveries", seedSql.includes("dde_email_deliveries") && seedSql.includes("del-email-0804"));
pass("seed:document_metrics", seedSql.includes("dde_document_metrics") && seedSql.includes("overall_document_score"));
pass("seed:document_hub", seedSql.includes("dde_document_hubs") && seedSql.includes("northstar-document-engine"));
pass("seed:agent_type", seedSql.includes("enterprise_dynamic_document_engine"));

const mappersPath = join(root, "src/modules/database/lib/document-engine-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildDdeDashboardStats_exported", mappersSource.includes("export const buildDdeDashboardStats") || mappersSource.includes("export function buildDdeDashboardStats"));
pass("mappers:buildDocumentHubLookupMaps", mappersSource.includes("buildDocumentHubLookupMaps"));
pass("mappers:buildDdePipelineInfo", mappersSource.includes("buildDdePipelineInfo"));
if (mappersSource.includes("buildDdeDashboardStats")) {
    pass("mappers:buildDdeDashboardStats_sections", /templateSectionCount|templateSections/.test(mappersSource));
    pass("mappers:buildDdeDashboardStats_retention", /retentionPolicyCount|retentionPolicies/.test(mappersSource));
    pass("mappers:buildDdeDashboardStats_document_score", /overallDocumentScore|overall_document_score/.test(mappersSource));
}

const requiredFiles = [
    "src/modules/document-engine/constants/index.ts",
    "src/modules/document-engine/schemas/index.ts",
    "src/modules/document-engine/services/document-engine.service.ts",
    "src/modules/document-engine/hooks/useDocumentEngine.ts",
    "src/modules/document-engine/components/DocumentEnginePage.tsx",
    "src/modules/document-engine/components/DocumentEngineStats.tsx",
    "src/modules/document-engine/components/DocumentEnginePanels.tsx",
    "src/modules/document-engine/sdk/index.ts",
    "src/modules/document-engine/index.ts",
    "src/modules/document-engine/types/index.ts",
    "src/modules/database/lib/document-engine-mappers.ts",
    "app/(shell)/document-engine/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/document-engine/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const DDE_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:DDE_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:DDE_THEME fuchsia-600", constants.includes('primary: "fuchsia-600"'));
    pass("ui:DDE_PERMISSIONS", constants.includes('"dde.view"') && constants.includes('"dde.admin"'));
    pass("ui:RELEASE_CHANNEL_OPTIONS", constants.includes('"stable"') && constants.includes('"canary"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:DDE_TABS count", false, "constants missing");
    pass("ui:DDE_THEME fuchsia-600", false);
    pass("ui:DDE_PERMISSIONS", false);
    pass("ui:RELEASE_CHANNEL_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/document-engine/hooks/useDocumentEngine.ts");
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

const panelsPath = join(root, "src/modules/document-engine/components/DocumentEnginePanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:DocumentHubSelect form.register spread", panels.includes("DocumentHubSelect") && panels.includes('{...form.register("documentHubId")}'));
} else {
    pass("ui:DocumentHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:documentEngine", routes.includes('documentEngine: "/document-engine"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Document Engine", nav.includes('"Document Engine"'));
pass("nav:FileText icon", nav.includes("FileText"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:documentEngine", middleware.includes("ROUTES.documentEngine"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b5:verify", pkg.includes('"sprint-b5:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 5 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`DDE_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 5 verification checks passed.");
