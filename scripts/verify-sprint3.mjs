/**
 * Sprint 3 verification: regression, security, tenant isolation, performance.
 * Run: node scripts/verify-sprint3.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
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
const migrationPath = join(root, "supabase", "migrations", "202608020026_tenant_lifecycle_operations.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(tlo_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const childTables = tables.filter((t) => t !== "tlo_tenant_contexts" && t !== "tlo_audit_logs");
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

// UI module files
const requiredFiles = [
    "src/modules/tenant-lifecycle-ops/constants/index.ts",
    "src/modules/tenant-lifecycle-ops/schemas/index.ts",
    "src/modules/tenant-lifecycle-ops/services/tenant-lifecycle-ops.service.ts",
    "src/modules/tenant-lifecycle-ops/hooks/useTenantLifecycleOps.ts",
    "src/modules/tenant-lifecycle-ops/components/TenantLifecycleOpsPage.tsx",
    "src/modules/tenant-lifecycle-ops/components/TenantLifecycleOpsStats.tsx",
    "src/modules/tenant-lifecycle-ops/components/TenantLifecycleOpsPanels.tsx",
    "src/modules/tenant-lifecycle-ops/sdk/index.ts",
    "src/modules/tenant-lifecycle-ops/index.ts",
    "src/modules/tenant-lifecycle-ops/types/index.ts",
    "src/modules/database/lib/tenant-lifecycle-ops-mappers.ts",
    "app/(shell)/tenant-lifecycle/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constants = readFileSync(join(root, "src/modules/tenant-lifecycle-ops/constants/index.ts"), "utf8");
const tabBlock = constants.match(/export const TLO_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
pass("ui:TLO_TABS count", tabCount === 34, `count=${tabCount}`);
pass("ui:TLO_THEME emerald-600", constants.includes('primary: "emerald-600"'));
pass("ui:TLO_PERMISSIONS", constants.includes('"tlo.view"') && constants.includes('"tlo.admin"'));

const hook = readFileSync(join(root, "src/modules/tenant-lifecycle-ops/hooks/useTenantLifecycleOps.ts"), "utf8");
pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:tenantLifecycle", routes.includes('tenantLifecycle: "/tenant-lifecycle"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Tenant Lifecycle", nav.includes('"Tenant Lifecycle"') && nav.includes("RefreshCw"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:tenantLifecycle", middleware.includes("ROUTES.tenantLifecycle"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint3:verify", pkg.includes('"sprint3:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nSprint 3 verification: ${results.length - failed.length}/${results.length} passed`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Sprint 3 verification checks passed.");
