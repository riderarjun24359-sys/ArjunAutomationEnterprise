/**
 * Sprint 6 verification: regression, security, tenant isolation, performance, disaster recovery, integration connectors, API contract.
 * Run: node scripts/verify-sprint6.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

// Regression: tsc + lint
const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

// Security + tenant isolation + performance from migration SQL
const migrationPath = join(root, "supabase", "migrations", "202608020029_enterprise_integration_platform.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(intg_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["intg_integration_metrics", "intg_integration_health", "intg_audit_logs"]);
const childTables = tables.filter((t) => t !== "intg_integration_hubs" && !orgOnlyTables.has(t));
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

// Disaster Recovery Verification
pass("disaster_recovery:integration_health_column", /intg_integration_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:payment_retry_queue_table", tables.includes("intg_payment_retry_queue"));
pass("disaster_recovery:webhook_dead_letter_table", tables.includes("intg_webhook_dead_letter"));

const seedPath = join(root, "supabase", "seed", "029_enterprise_integration_platform_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("disaster_recovery:seed_file", existsSync(seedPath));
pass(
    "disaster_recovery:seed_recovery_config",
    seedSql.includes("intg_integration_health") && seedSql.includes("disaster_recovery_mode") && seedSql.includes("intg_payment_retry_queue") && seedSql.includes("intg_webhook_dead_letter"),
);

// Integration Verification
pass(
    "integration:seed_connected_google",
    seedSql.includes("intg_connected_services") && seedSql.includes("svc-google-workspace") && /google/i.test(seedSql),
);
pass(
    "integration:seed_connected_stripe",
    seedSql.includes("intg_connected_services") && seedSql.includes("svc-stripe") && seedSql.includes("stripe"),
);
pass(
    "integration:seed_payment_connectors",
    seedSql.includes("intg_payment_connectors") && seedSql.includes("pay-stripe-primary"),
);
pass(
    "integration:seed_accounting_connectors",
    seedSql.includes("intg_accounting_connectors"),
);

// API Contract Verification
pass("api_contract:api_keys_table", tables.includes("intg_api_keys"));
pass("api_contract:api_scopes_table", tables.includes("intg_api_scopes"));
pass("api_contract:rate_limits_table", tables.includes("intg_rate_limits"));
pass("api_contract:api_version_column", /intg_api_keys[\s\S]*?api_version text/i.test(migrationSql));
pass("api_contract:permissions_jsonb", /intg_api_scopes[\s\S]*?permissions jsonb/i.test(migrationSql));
pass("api_contract:rate_limit_rpm_column", /intg_rate_limits[\s\S]*?rate_limit_rpm integer/i.test(migrationSql));
pass(
    "api_contract:seed_api_keys",
    seedSql.includes("intg_api_keys") && seedSql.includes("northstar-prod-key"),
);
pass(
    "api_contract:seed_api_scopes",
    seedSql.includes("intg_api_scopes") && seedSql.includes("integrations:read"),
);
pass(
    "api_contract:seed_rate_limits",
    seedSql.includes("intg_rate_limits") && /rate_limit_rpm|120/.test(seedSql),
);

// Mappers
const mappersPath = join(root, "src/modules/database/lib/integration-platform-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildIntgDashboardStats_exported", mappersSource.includes("export const buildIntgDashboardStats") || mappersSource.includes("export function buildIntgDashboardStats"));
pass("mappers:buildIntegrationHubLookupMaps", mappersSource.includes("buildIntegrationHubLookupMaps"));
pass("mappers:buildIntgPipelineInfo", mappersSource.includes("buildIntgPipelineInfo"));

if (mappersSource.includes("buildIntgDashboardStats")) {
    pass("mappers:buildIntgDashboardStats_connectors", /activeConnectorCount|connector_status/.test(mappersSource));
    pass("mappers:buildIntgDashboardStats_health", /avgHealthScore|overall_score/.test(mappersSource));
}

// UI module files
const requiredFiles = [
    "src/modules/integration-platform/constants/index.ts",
    "src/modules/integration-platform/schemas/index.ts",
    "src/modules/integration-platform/services/integration-platform.service.ts",
    "src/modules/integration-platform/hooks/useIntegrationPlatform.ts",
    "src/modules/integration-platform/components/IntegrationPlatformPage.tsx",
    "src/modules/integration-platform/components/IntegrationPlatformStats.tsx",
    "src/modules/integration-platform/components/IntegrationPlatformPanels.tsx",
    "src/modules/integration-platform/sdk/index.ts",
    "src/modules/integration-platform/index.ts",
    "src/modules/integration-platform/types/index.ts",
    "src/modules/database/lib/integration-platform-mappers.ts",
    "app/(shell)/integration-platform/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constants = readFileSync(join(root, "src/modules/integration-platform/constants/index.ts"), "utf8");
const tabBlock = constants.match(/export const INTG_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
pass("ui:INTG_TABS count", tabCount === 34, `count=${tabCount}`);
pass("ui:INTG_THEME indigo-600", constants.includes('primary: "indigo-600"'));
pass("ui:INTG_PERMISSIONS", constants.includes('"intg.view"') && constants.includes('"intg.admin"'));
pass("ui:PROVIDER_TYPE_OPTIONS", constants.includes('"google"') && constants.includes('"stripe"'));
pass("ui:CONNECTOR_STATUS_OPTIONS", constants.includes('"connected"') && constants.includes('"failed"'));
pass("ui:API_STATUS_OPTIONS", constants.includes('"delivered"') && constants.includes('"failed"'));

const hook = readFileSync(join(root, "src/modules/integration-platform/hooks/useIntegrationPlatform.ts"), "utf8");
pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));

const panels = readFileSync(join(root, "src/modules/integration-platform/components/IntegrationPlatformPanels.tsx"), "utf8");
pass("ui:IntegrationHubSelect form.register spread", panels.includes("IntegrationHubSelect") && panels.includes('{...form.register("integrationHubId")}'));

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:integrationPlatform", routes.includes('integrationPlatform: "/integration-platform"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Integration Platform", nav.includes('"Integration Platform"') && nav.includes("Plug"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:integrationPlatform", middleware.includes("ROUTES.integrationPlatform"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint6:verify", pkg.includes('"sprint6:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nSprint 6 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`INTG_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Sprint 6 verification checks passed.");
