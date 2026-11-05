/**
 * Production Readiness v1.0 verification
 * Run: node scripts/verify-production-readiness.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "production-readiness");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 300) : "");

pass("route:page", existsSync(join(root, "app", "(shell)", "production-readiness", "page.tsx")));
pass("api:health", existsSync(join(root, "app", "api", "production-readiness", "health", "route.ts")));
pass("api:health_rate_limited", readSafe(join(root, "app/api/production-readiness/health/route.ts")).includes("checkRateLimit"));
pass("migration", existsSync(join(root, "supabase", "migrations", "202608060003_production_readiness_v1.sql")));

pass("lib:production-logger", existsSync(join(root, "src", "lib", "production-logger.ts")));
pass("lib:resilience", existsSync(join(root, "src", "lib", "resilience.ts")));
pass("lib:production-health", existsSync(join(root, "src", "lib", "production-health.ts")));

const panels = [
    "CtoAuditDashboardPanel",
    "ObservabilityPanel",
    "ResiliencePanel",
    "BackupRecoveryPanel",
    "SecurityHardeningPanel",
    "ScalabilityPanel",
    "OperationsPlaybookPanel",
    "ProductionQualityPanel",
];
const panelFile = readSafe(join(modRoot, "components", "panels", "ProductionReadinessPanels.tsx"));
for (const panel of panels) {
    pass(`panel:${panel}`, panelFile.includes(`function ${panel}`));
}

pass("service:production-readiness", existsSync(join(modRoot, "services", "production-readiness.service.ts")));
pass("hook:useProductionReadiness", existsSync(join(modRoot, "hooks", "useProductionReadiness.ts")));

const migration = readSafe(join(root, "supabase", "migrations", "202608060003_production_readiness_v1.sql"));
pass("db:readiness_snapshots", migration.includes("pr_readiness_snapshots"));
pass("db:system_alerts", migration.includes("pr_system_alerts"));

const constants = readSafe(join(modRoot, "constants", "index.ts"));
pass("playbook:6_sections", constants.includes("deployment") && constants.includes("emergency"));
pass("quality:9_dimensions", constants.includes("Maintainability") && constants.includes("Accessibility"));
pass("security:headers", constants.includes("X-Frame-Options"));

pass("next:security_headers", readSafe(join(root, "next.config.ts")).includes("X-Frame-Options"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("routes:productionReadiness", routes.includes('productionReadiness: "/production-readiness"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Production_Readiness", nav.includes("Production Readiness"));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:protected", middleware.includes("ROUTES.productionReadiness"));

const missionConstants = readSafe(join(root, "src", "modules", "mission-core", "constants", "index.ts"));
pass("mission-core:capability", missionConstants.includes('"productionReadiness"'));

const executor = readSafe(join(root, "src", "modules", "mission-core", "engine", "capability-executor.ts"));
pass("executor:health-check", executor.includes("productionReadiness:health-check"));
pass("executor:quality-gate", executor.includes("productionReadiness:quality-gate"));

const bridges = ["platform-operations-bridge", "security-bridge", "delivery-engine-bridge", "executive-bridge"];
for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

pass("docs:operations_runbook", existsSync(join(root, "docs", "OPERATIONS_RUNBOOK.md")));
pass("docs:disaster_recovery", existsSync(join(root, "docs", "DISASTER_RECOVERY.md")));

pass("package:script", readSafe(join(root, "package.json")).includes('"production-readiness:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nProduction Readiness v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);

const chain = spawnVerify(root, "scripts/verify-delivery-engine.mjs");
if (chain.status !== 0) {
    const output = [chain.stdout, chain.stderr].filter(Boolean).join("\n").trim();
    if (output) console.error(output.slice(-7000));
    process.exit(chain.status ?? 1);
}
