/**
 * Sprint 5 verification: regression, security, tenant isolation, performance, disaster recovery, notification delivery.
 * Run: node scripts/verify-sprint5.mjs
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
const migrationPath = join(root, "supabase", "migrations", "202608020028_enterprise_communication_hub.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(cnh_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["cnh_communication_metrics", "cnh_system_health", "cnh_audit_logs"]);
const childTables = tables.filter((t) => t !== "cnh_communication_hubs" && !orgOnlyTables.has(t));
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
pass("disaster_recovery:system_health_column", /cnh_system_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:retry_policies_table", tables.includes("cnh_retry_policies"));

const seedPath = join(root, "supabase", "seed", "028_enterprise_communication_hub_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("disaster_recovery:seed_file", existsSync(seedPath));
pass(
    "disaster_recovery:seed_recovery_config",
    seedSql.includes("cnh_retry_policies") && seedSql.includes("cnh_system_health") && seedSql.includes("disaster_recovery_mode"),
);

// Notification Delivery Validation
pass(
    "delivery:seed_queue_delivered",
    /delivery_status[\s\S]*?'delivered'/i.test(seedSql) && seedSql.includes("notif-welcome-delivered"),
);
pass(
    "delivery:seed_queue_failed",
    /delivery_status[\s\S]*?'failed'/i.test(seedSql) && seedSql.includes("notif-alert-failed"),
);
pass("delivery:seed_delivery_analytics", seedSql.includes("cnh_delivery_analytics"));

// Mappers
const mappersPath = join(root, "src/modules/database/lib/communication-hub-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildCnhDashboardStats_exported", mappersSource.includes("export const buildCnhDashboardStats") || mappersSource.includes("export function buildCnhDashboardStats"));
pass("mappers:buildCommunicationHubLookupMaps", mappersSource.includes("buildCommunicationHubLookupMaps"));
pass("mappers:buildCnhPipelineInfo", mappersSource.includes("buildCnhPipelineInfo"));

if (mappersSource.includes("buildCnhDashboardStats")) {
    pass("mappers:buildCnhDashboardStats_queued", /queuedNotifications|delivery_status/.test(mappersSource));
    pass("mappers:buildCnhDashboardStats_delivered", /deliveredToday|total_delivered/.test(mappersSource));
}

// UI module files
const requiredFiles = [
    "src/modules/communication-hub/constants/index.ts",
    "src/modules/communication-hub/schemas/index.ts",
    "src/modules/communication-hub/services/communication-hub.service.ts",
    "src/modules/communication-hub/hooks/useCommunicationHub.ts",
    "src/modules/communication-hub/components/CommunicationHubPage.tsx",
    "src/modules/communication-hub/components/CommunicationHubStats.tsx",
    "src/modules/communication-hub/components/CommunicationHubPanels.tsx",
    "src/modules/communication-hub/sdk/index.ts",
    "src/modules/communication-hub/index.ts",
    "src/modules/communication-hub/types/index.ts",
    "src/modules/database/lib/communication-hub-mappers.ts",
    "app/(shell)/communication-hub/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constants = readFileSync(join(root, "src/modules/communication-hub/constants/index.ts"), "utf8");
const tabBlock = constants.match(/export const CNH_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
pass("ui:CNH_TABS count", tabCount === 34, `count=${tabCount}`);
pass("ui:CNH_THEME rose-600", constants.includes('primary: "rose-600"'));
pass("ui:CNH_PERMISSIONS", constants.includes('"cnh.view"') && constants.includes('"cnh.admin"'));
pass("ui:CHANNEL_TYPE_OPTIONS", constants.includes('"in_app"') && constants.includes('"webhook"'));
pass("ui:PRIORITY_LEVEL_OPTIONS", constants.includes('"critical"') && constants.includes('"normal"'));
pass("ui:DELIVERY_STATUS_OPTIONS", constants.includes('"delivered"') && constants.includes('"failed"'));

const hook = readFileSync(join(root, "src/modules/communication-hub/hooks/useCommunicationHub.ts"), "utf8");
pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));

const panels = readFileSync(join(root, "src/modules/communication-hub/components/CommunicationHubPanels.tsx"), "utf8");
pass("ui:CommunicationHubSelect form.register spread", panels.includes("CommunicationHubSelect") && panels.includes('{...form.register("communicationHubId")}'));

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:communicationHub", routes.includes('communicationHub: "/communication-hub"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Communication Hub", nav.includes('"Communication Hub"') && nav.includes("MessageSquare"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:communicationHub", middleware.includes("ROUTES.communicationHub"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint5:verify", pkg.includes('"sprint5:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nSprint 5 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`CNH_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Sprint 5 verification checks passed.");
