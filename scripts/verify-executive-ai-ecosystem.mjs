/**
 * Executive AI Ecosystem v1.0 verification (backward-compatible alias)
 * Canonical module: src/modules/executive-ai — use executive-ai:verify
 * Run: node scripts/verify-executive-ai-ecosystem.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "executive-ai");
const legacyRoot = join(root, "src", "modules", "executive-ai-ecosystem");
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

pass("route:page", existsSync(join(root, "app", "(shell)", "executive-ai-ecosystem", "page.tsx")));
pass("route:canonical", existsSync(join(root, "app", "(shell)", "executive-ai", "page.tsx")));
pass("migration:legacy", existsSync(join(root, "supabase", "migrations", "202608060004_executive_ai_ecosystem_v1.sql")));
pass("migration:canonical", existsSync(join(root, "supabase", "migrations", "202608060005_executive_ai.sql")));

const agents = ["ceo-ai", "cto-ai", "coo-ai", "cfo-ai", "cmo-ai", "cso-ai", "customer-success-ai", "security-ai", "analytics-ai"];
for (const agent of agents) {
    pass(`agent:${agent}`, existsSync(join(modRoot, "executive-registry", "agents", `${agent}.ts`)));
}

pass("component:ExecutiveAiEcosystemPage", existsSync(join(legacyRoot, "components", "ExecutiveAiEcosystemPage.tsx")));
pass("component:ExecutiveAiDashboard", existsSync(join(legacyRoot, "components", "ExecutiveAiDashboard.tsx")));
pass("service:executive-ai-ecosystem", existsSync(join(legacyRoot, "services", "executive-ai-ecosystem.service.ts")));
pass("service:ai-orchestrator", existsSync(join(legacyRoot, "services", "ai-orchestrator.service.ts")));
pass("service:shared-knowledge", existsSync(join(legacyRoot, "services", "shared-knowledge.service.ts")));
pass("registry:executive-agents", existsSync(join(legacyRoot, "services", "agents", "executive-agents.registry.ts")));
pass("hook:useExecutiveAiEcosystem", existsSync(join(legacyRoot, "hooks", "useExecutiveAiEcosystem.ts")));

const migration = readSafe(join(root, "supabase", "migrations", "202608060004_executive_ai_ecosystem_v1.sql"));
pass("db:agent_tasks", migration.includes("eae_agent_tasks"));
pass("db:recommendations", migration.includes("eae_recommendations"));
pass("db:collaboration", migration.includes("eae_collaboration_events"));
pass("db:approval_requests", migration.includes("eae_approval_requests"));

const registry = readSafe(join(modRoot, "executive-registry", "executive-registry.service.ts"));
pass("orchestrator:route_tasks", registry.includes("routeTaskToAgents"));
pass("orchestrator:conflict_resolution", readSafe(join(modRoot, "recommendation-engine", "recommendation-engine.service.ts")).includes("resolveConflicts"));
pass("orchestrator:unified_response", readSafe(join(modRoot, "orchestrator", "orchestrator.service.ts")).includes("buildUnifiedResponse"));
pass("approval:critical_keywords", readSafe(join(modRoot, "constants", "index.ts")).includes("CRITICAL_ACTION_KEYWORDS"));
pass("shared:5_sources", readSafe(join(modRoot, "constants", "index.ts")).includes("business-platform") && readSafe(join(modRoot, "constants", "index.ts")).includes("production-readiness"));

const bridges = ["business-platform-bridge", "executive-intelligence-bridge", "delivery-engine-bridge", "production-readiness-bridge"];
for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("routes:executiveAi", routes.includes('executiveAi: "/executive-ai"'));
pass("routes:executiveAiEcosystem", routes.includes('executiveAiEcosystem: "/executive-ai-ecosystem"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Executive_AI", nav.includes("Executive AI"));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:protected", middleware.includes("ROUTES.executiveAi"));

const missionConstants = readSafe(join(root, "src", "modules", "mission-core", "constants", "index.ts"));
pass("mission-core:capability", missionConstants.includes('"executiveAi"'));

const executor = readSafe(join(root, "src", "modules", "mission-core", "engine", "capability-executor.ts"));
pass("executor:orchestrate", executor.includes("executiveAi:orchestrate"));
pass("executor:approve", executor.includes("executiveAi:approve-recommendation"));

const dashboard = readSafe(join(modRoot, "dashboard", "ExecutiveAiDashboard.tsx"));
pass("dashboard:agents", dashboard.includes("Recommendations"));
pass("dashboard:collaboration", dashboard.includes("Collaboration timeline"));

pass("package:script", readSafe(join(root, "package.json")).includes('"executive-ai-ecosystem:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nExecutive AI Ecosystem v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);

const chain = spawnVerify(root, "scripts/verify-executive-ai.mjs");
if (chain.status !== 0) process.exit(chain.status ?? 1);
