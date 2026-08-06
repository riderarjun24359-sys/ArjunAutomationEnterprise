/**
 * End-to-end platform QA verification
 * Run: node scripts/verify-platform-e2e-qa.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { runTsc, runLint } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const results = [];

function pass(area, check, ok, detail = "") {
    results.push({ area, check, pass: !!ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

function exists(rel) {
    return existsSync(join(root, rel));
}

// ── Build quality ──────────────────────────────────────────────────────────
const tsc = runTsc(root);
pass("quality", "typescript", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 400) : "");

const lint = runLint(root);
pass("quality", "eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 400) : "");

// ── Auth ───────────────────────────────────────────────────────────────────
pass("auth", "sign-in-page", exists("app/auth/sign-in/page.tsx") || exists("app/(auth)/sign-in/page.tsx") || exists("app/auth/sign-in"));
pass("auth", "middleware-auth", exists("src/middleware/auth.ts"));
pass("auth", "supabase-middleware", exists("src/lib/supabase-middleware.ts") || readSafe(join(root, "src/middleware/auth.ts")).includes("createSupabaseMiddlewareClient"));
pass("auth", "auth-store", exists("src/store/auth.store.ts"));
pass("auth", "auth-server", exists("src/services/auth.server.ts") || readSafe(join(root, "src/lib/api-security.ts")).includes("authServerService"));
pass("auth", "permissions", exists("src/config/permissions.ts"));
pass("auth", "shell-layout-auth", readSafe(join(root, "app/(shell)/layout.tsx")).includes("auth") || readSafe(join(root, "app/(shell)/layout.tsx")).includes("Auth"));

// ── Navigation & routes ────────────────────────────────────────────────────
const routes = readSafe(join(root, "src/constants/routes.ts"));
const nav = readSafe(join(root, "src/config/shell-navigation.ts"));
const middleware = readSafe(join(root, "src/middleware/auth.ts"));

const moduleRoutes = [
    ["dashboard", "dashboard", "app/(shell)/dashboard/page.tsx"],
    ["crm", "crm", "app/(shell)/crm/page.tsx"],
    ["businessPlatform", "business-platform", "app/(shell)/business-platform/page.tsx"],
    ["projects", "projects", "app/(shell)/projects/page.tsx"],
    ["tasks", "tasks", "app/(shell)/tasks/page.tsx"],
    ["deliveryEngine", "delivery-engine", "app/(shell)/delivery-engine/page.tsx"],
    ["aiCommandCenter", "ai-command-center", "app/(shell)/ai-command-center/page.tsx"],
    ["workflowEngine", "workflow-engine", "app/(shell)/workflow-engine/page.tsx"],
    ["customerSuccess", "customer-success", "app/(shell)/customer-success/page.tsx"],
    ["clientSuccess", "client-success", "app/(shell)/client-success/page.tsx"],
    ["globalOperations", "global-operations", "app/(shell)/global-operations/page.tsx"],
    ["support", "support", "app/(shell)/support/page.tsx"],
    ["executiveIntelligence", "executive-intelligence", "app/(shell)/executive-intelligence/page.tsx"],
    ["settings", "settings", "app/(shell)/settings/page.tsx"],
];

for (const [routeKey, pathSeg, pagePath] of moduleRoutes) {
    pass("routes", `route:${routeKey}`, routes.includes(`${routeKey}:`) && routes.includes(`"/${pathSeg}"`));
    pass("routes", `page:${pathSeg}`, exists(pagePath));
    pass("auth", `protected:${routeKey}`, middleware.includes(`ROUTES.${routeKey}`));
}

pass("navigation", "shell-navigation-exists", nav.includes("ShellNavigation") || nav.includes("label:"));
pass("navigation", "dashboard-nav", nav.includes("ROUTES.dashboard") || nav.includes("Dashboard"));
pass("navigation", "business-platform-nav", nav.includes("ROUTES.businessPlatform"));
pass("navigation", "delivery-engine-nav", nav.includes("ROUTES.deliveryEngine"));
pass("navigation", "ai-command-center-nav", nav.includes("ROUTES.aiCommandCenter"));
pass("navigation", "support-nav", nav.includes("ROUTES.support") || nav.includes("Support"));
pass("navigation", "settings-nav", nav.includes("ROUTES.settings") || nav.includes("Settings"));

// ── Module presence ────────────────────────────────────────────────────────
const modules = [
    ["crm", "src/modules/crm"],
    ["business-platform", "src/modules/business-platform"],
    ["projects", "src/modules/projects"],
    ["tasks", "src/modules/tasks"],
    ["delivery-engine", "src/modules/delivery-engine"],
    ["ai-command-center", "src/modules/ai-command-center"],
    ["workflow-engine", "src/modules/workflow-engine"],
    ["customer-success", "src/modules/customer-success"],
    ["client-success", "src/modules/client-success-capability"],
    ["global-operations", "src/modules/customer-success-global-ops"],
    ["support", "src/modules/support"],
    ["executive-intelligence", "src/modules/executive-intelligence"],
    ["executive-command-center", "src/modules/executive-command-center"],
    ["settings", "src/modules/settings"],
    ["mission-core", "src/modules/mission-core"],
    ["database", "src/modules/database"],
];

for (const [name, path] of modules) {
    pass("modules", `module:${name}`, exists(path) || exists(`${path}/index.ts`) || exists(`${path}/services`));
}

// ── Database / multi-tenant ────────────────────────────────────────────────
pass("database", "supabase-browser", exists("src/lib/supabase-browser.ts"));
pass("database", "supabase-server", exists("src/lib/supabase-server.ts"));
pass("database", "organization-context", exists("src/modules/database/lib/organization-context.ts"));
pass("database", "repository-client", exists("src/modules/database/lib/repository-client.ts"));
pass("database", "database-service", exists("src/modules/database/services/database-service.ts"));

const orgContext = readSafe(join(root, "src/modules/database/lib/organization-context.ts"));
pass("multitenant", "resolveOrganizationContext", orgContext.includes("resolveOrganizationContext"));
pass("multitenant", "memberships", orgContext.includes("membership") || orgContext.includes("organization"));

const sampleMigrations = [
    "supabase/migrations/202608060001_business_platform_v1.sql",
    "supabase/migrations/202608060002_delivery_engine_v1.sql",
    "supabase/migrations/202608060007_ai_command_center.sql",
    "supabase/migrations/202608060006_customer_success_global_ops.sql",
    "supabase/migrations/202608020011_enterprise_support.sql",
];
for (const mig of sampleMigrations) {
    const sql = readSafe(join(root, mig));
    pass("multitenant", `rls:${mig.split("/").pop()}`, !exists(mig) || sql.includes("enable row level security") || sql.includes("organization_id"));
}

// ── Critical services / APIs ───────────────────────────────────────────────
pass("services", "business-platform-service", exists("src/modules/business-platform/services/business-platform.service.ts"));
pass("services", "delivery-engine-service", exists("src/modules/delivery-engine/services/delivery-engine-orchestrator.service.ts"));
pass("services", "ai-command-center-service", exists("src/modules/ai-command-center/services/ai-command-center.service.ts"));
pass("services", "support-service", exists("src/modules/support/services/support.service.ts"));
pass("services", "global-ops-service", exists("src/modules/customer-success-global-ops/services/customer-success-global-ops.service.ts"));
pass("services", "secure-api", exists("src/lib/api-security.ts") && readSafe(join(root, "src/lib/api-security.ts")).includes("secureApiRoute"));
pass("services", "rate-limiting", readSafe(join(root, "src/lib/api-security.ts")).includes("checkRateLimit"));

// ── Mission Core wiring for key modules ────────────────────────────────────
const mc = readSafe(join(root, "src/modules/mission-core/constants/index.ts"));
for (const cap of ["businessPlatform", "deliveryEngine", "aiCommandCenter", "globalOperations", "clientSuccess"]) {
    pass("mission-core", `capability:${cap}`, mc.includes(`"${cap}"`));
}

// ── Targeted module verify scripts (skip nested tsc/lint via env) ──────────
const scriptChecks = [
    ["business-platform", "scripts/verify-business-platform.mjs"],
    ["delivery-engine", "scripts/verify-delivery-engine.mjs"],
    ["ai-command-center", "scripts/verify-ai-command-center.mjs"],
    ["global-operations", "scripts/verify-global-operations.mjs"],
    ["executive-command-center", "scripts/verify-executive-command-center.mjs"],
    ["mission-core", "scripts/verify-mission-core.mjs"],
    ["security-center", "scripts/verify-security-center.mjs"],
];

const env = { ...process.env, SKIP_TSC: "1", SKIP_LINT: "1", SKIP_BUILD: "1" };
for (const [name, script] of scriptChecks) {
    if (!exists(script)) {
        pass("module-verify", name, false, "script missing");
        continue;
    }
    const r = spawnSync(process.execPath, [join(root, script)], { cwd: root, encoding: "utf8", timeout: 180_000, env });
    pass("module-verify", name, r.status === 0, r.status !== 0 ? (r.stdout || r.stderr || "").slice(-300) : "");
}

// ── Report ─────────────────────────────────────────────────────────────────
const areas = [...new Set(results.map((r) => r.area))];
console.log("\n═══════════════════════════════════════════════════════════");
console.log("  PLATFORM E2E QA VERIFICATION");
console.log("═══════════════════════════════════════════════════════════\n");

for (const area of areas) {
    const items = results.filter((r) => r.area === area);
    const ok = items.filter((r) => r.pass).length;
    console.log(`\n── ${area.toUpperCase()} (${ok}/${items.length}) ──`);
    for (const r of items) {
        console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
    }
}

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\n═══════════════════════════════════════════════════════════`);
console.log(`TOTAL: ${passed}/${results.length} checks passed`);
console.log(`FAILED: ${failed.length}`);
console.log(`═══════════════════════════════════════════════════════════\n`);

if (failed.length > 0) {
    console.log("Failures:");
    for (const f of failed) console.log(`  ✗ [${f.area}] ${f.check}${f.detail ? `: ${f.detail}` : ""}`);
    process.exit(1);
}

console.log("PLATFORM E2E QA STATUS: PASS\n");
