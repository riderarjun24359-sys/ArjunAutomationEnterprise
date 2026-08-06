/**
 * AI Command Center v1.0 verification
 * Run: node scripts/verify-ai-command-center.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "ai-command-center");
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

pass("route:page", existsSync(join(root, "app", "(shell)", "ai-command-center", "page.tsx")));
pass("migration", existsSync(join(root, "supabase", "migrations", "202608060007_ai_command_center.sql")));

const engines = [
    "system-monitor.engine.ts",
    "ai-decision.engine.ts",
    "recommendation.engine.ts",
    "automation.engine.ts",
    "executive-analytics.engine.ts",
    "health-monitoring.engine.ts",
];
for (const engine of engines) {
    pass(`engine:${engine}`, existsSync(join(modRoot, "engines", engine)));
}

const engineKeys = ["systemMonitor", "aiDecision", "recommendation", "automation", "executiveAnalytics", "healthMonitoring"];
const constants = readSafe(join(modRoot, "constants", "index.ts"));
for (const key of engineKeys) {
    pass(`engineKey:${key}`, constants.includes(key));
}

pass("component:AiCommandCenterPage", existsSync(join(modRoot, "components", "AiCommandCenterPage.tsx")));
pass("component:AiCommandCenterDashboard", existsSync(join(modRoot, "components", "AiCommandCenterDashboard.tsx")));
pass("service", existsSync(join(modRoot, "services", "ai-command-center.service.ts")));
pass("repository", existsSync(join(modRoot, "repository", "ai-command-center-repository.ts")));
pass("hook", existsSync(join(modRoot, "hooks", "useAiCommandCenter.ts")));

const migration = readSafe(join(root, "supabase", "migrations", "202608060007_ai_command_center.sql"));
const tables = ["acc_alerts", "acc_recommendations", "acc_decisions", "acc_automations", "acc_health_snapshots", "acc_audit_logs"];
for (const table of tables) {
    pass(`db:${table}`, migration.includes(table));
}
pass("security:rls", migration.includes("enable row level security"));

pass("bridge:platform", existsSync(join(modRoot, "integrations", "platform-bridges.ts")));
pass("bridge:mission-core", existsSync(join(modRoot, "integrations", "mission-core-bridge.ts")));

const bridges = readSafe(join(modRoot, "integrations", "platform-bridges.ts"));
pass("integration:business-platform", bridges.includes("businessPlatformService"));
pass("integration:global-operations", bridges.includes("customerSuccessGlobalOpsService"));
pass("integration:support", bridges.includes("supportService"));
pass("integration:delivery-engine", bridges.includes("deliveryEngineService"));

const dashboard = readSafe(join(modRoot, "components", "AiCommandCenterDashboard.tsx"));
pass("dashboard:System_Health", dashboard.includes("System Health"));
pass("dashboard:Client_Health", dashboard.includes("Client health") || dashboard.includes("clientHealth"));
pass("dashboard:Revenue", dashboard.includes("Revenue Summary"));
pass("dashboard:Support_SLA", dashboard.includes("Support SLA"));
pass("dashboard:Delivery", dashboard.includes("Delivery Status"));
pass("dashboard:AI_Agents", dashboard.includes("AI Agent Status"));
pass("dashboard:Alerts", dashboard.includes("Active Alerts"));
pass("dashboard:Recommendations", dashboard.includes("AI Recommendations"));

pass("audit:repository", readSafe(join(modRoot, "repository", "ai-command-center-repository.ts")).includes("logAudit"));
pass("service:getDashboard", readSafe(join(modRoot, "services", "ai-command-center.service.ts")).includes("getDashboard"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("routes:aiCommandCenter", routes.includes('aiCommandCenter: "/ai-command-center"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:AI_Command_Center", nav.includes("AI Command Center") && nav.includes("ROUTES.aiCommandCenter"));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:protected", middleware.includes("ROUTES.aiCommandCenter"));

const missionConstants = readSafe(join(root, "src", "modules", "mission-core", "constants", "index.ts"));
pass("mission-core:capability", missionConstants.includes('"aiCommandCenter"'));

const executor = readSafe(join(root, "src", "modules", "mission-core", "engine", "capability-executor.ts"));
pass("executor:dashboard", executor.includes("aiCommandCenter:dashboard"));
pass("executor:accept", executor.includes("aiCommandCenter:accept-recommendation"));
pass("executor:dismiss", executor.includes("aiCommandCenter:dismiss-recommendation"));

pass("package:script", readSafe(join(root, "package.json")).includes('"ai-command-center:verify"'));
pass("integration:global-ops-module", existsSync(join(root, "src", "modules", "customer-success-global-ops", "index.ts")));
pass("integration:mission-core-module", existsSync(join(root, "src", "modules", "mission-core", "index.ts")));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nAI Command Center v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);
