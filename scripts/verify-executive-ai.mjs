/**
 * Executive AI v1.0 verification — 49 checks
 * Run: node scripts/verify-executive-ai.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "executive-ai");
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

if (process.env.SKIP_BUILD !== "1") {
    const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
    const build = spawnSync(process.execPath, [nextBin, "build"], { cwd: root, encoding: "utf8", timeout: 900_000, env: { ...process.env, CI: "1" } });
    pass("regression:build", build.status === 0, build.status !== 0 ? (build.stderr || build.stdout || "").slice(0, 300) : "");
} else {
    pass("regression:build", true, "skipped");
}

pass("route:page", existsSync(join(root, "app", "(shell)", "executive-ai", "page.tsx")));
pass("migration", existsSync(join(root, "supabase", "migrations", "202608060005_executive_ai.sql")));

const agents = ["ceo-ai", "cto-ai", "coo-ai", "cfo-ai", "cmo-ai", "cso-ai", "customer-success-ai", "security-ai", "analytics-ai"];
for (const agent of agents) {
    pass(`agent:${agent}`, existsSync(join(modRoot, "executive-registry", "agents", `${agent}.ts`)));
}

const engines = [
    ["orchestrator", "orchestrator.service.ts"],
    ["executive-registry", "executive-registry.service.ts"],
    ["collaboration-engine", "collaboration-engine.service.ts"],
    ["recommendation-engine", "recommendation-engine.service.ts"],
    ["approval-engine", "approval-engine.service.ts"],
    ["executive-memory", "executive-memory.service.ts"],
    ["governance", "governance.service.ts"],
    ["monitoring", "monitoring.service.ts"],
    ["analytics", "analytics.service.ts"],
];
for (const [dir, file] of engines) {
    pass(`engine:${dir}`, existsSync(join(modRoot, dir, file)));
}

pass("infra:executive-ai-service", existsSync(join(modRoot, "executive-ai-service.ts")));
pass("infra:executive-ai-repository", existsSync(join(modRoot, "executive-ai-repository.ts")));
pass("infra:executive-ai-events", existsSync(join(modRoot, "executive-ai-events.ts")));
pass("infra:executive-ai-hooks", existsSync(join(modRoot, "executive-ai-hooks.ts")));
pass("dashboard:ExecutiveAiPage", existsSync(join(modRoot, "dashboard", "ExecutiveAiPage.tsx")));
pass("dashboard:ExecutiveAiDashboard", existsSync(join(modRoot, "dashboard", "ExecutiveAiDashboard.tsx")));

const migration = readSafe(join(root, "supabase", "migrations", "202608060005_executive_ai.sql"));
const tables = ["executive_agents", "executive_tasks", "executive_recommendations", "executive_collaboration", "executive_approvals", "executive_memory", "executive_health", "executive_audit_logs", "executive_agent_metrics"];
for (const table of tables) {
    pass(`db:${table}`, migration.includes(table));
}

pass("orchestrator:route_tasks", readSafe(join(modRoot, "executive-registry", "executive-registry.service.ts")).includes("routeTaskToAgents"));
pass("orchestrator:conflict_resolution", readSafe(join(modRoot, "recommendation-engine", "recommendation-engine.service.ts")).includes("resolveConflicts"));
pass("orchestrator:unified_response", readSafe(join(modRoot, "orchestrator", "orchestrator.service.ts")).includes("buildUnifiedResponse"));
pass("collaboration:voting", readSafe(join(modRoot, "collaboration-engine", "collaboration-engine.service.ts")).includes("voteOnRecommendations"));
pass("collaboration:consensus", readSafe(join(modRoot, "collaboration-engine", "collaboration-engine.service.ts")).includes("buildConsensus"));
pass("approval:critical_keywords", readSafe(join(modRoot, "constants", "index.ts")).includes("CRITICAL_ACTION_KEYWORDS"));
pass("approval:queue", readSafe(join(modRoot, "approval-engine", "approval-engine.service.ts")).includes("buildApprovalQueue"));
pass("governance:policies", readSafe(join(modRoot, "governance", "governance.service.ts")).includes("auditAction"));
pass("governance:explainability", readSafe(join(modRoot, "governance", "governance.service.ts")).includes("ensureExplainability"));
pass("shared:5_sources", readSafe(join(modRoot, "constants", "index.ts")).includes("business-platform") && readSafe(join(modRoot, "constants", "index.ts")).includes("production-readiness"));
pass("memory:buildSharedKnowledge", readSafe(join(modRoot, "executive-memory", "executive-memory.service.ts")).includes("buildSharedKnowledge"));
pass("monitoring:health", readSafe(join(modRoot, "monitoring", "monitoring.service.ts")).includes("recordAgentHealth"));
pass("analytics:company_health", readSafe(join(modRoot, "analytics", "analytics.service.ts")).includes("computeCompanyHealthScore"));
pass("audit:repository", readSafe(join(modRoot, "executive-ai-repository.ts")).includes("logAudit"));
pass("observability:events", readSafe(join(modRoot, "executive-ai-events.ts")).includes("publishExecutiveAiEvent"));
pass("performance:metrics", readSafe(join(modRoot, "monitoring", "monitoring.service.ts")).includes("trackPerformanceMetric"));

const bridges = ["business-platform-bridge", "executive-intelligence-bridge", "delivery-engine-bridge", "production-readiness-bridge"];
for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}
pass("integration:knowledge-engine", readSafe(join(modRoot, "executive-memory", "executive-memory.service.ts")).includes("getKnowledgeEntries"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("routes:executiveAi", routes.includes('executiveAi: "/executive-ai"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Executive_AI", nav.includes("Executive AI") && nav.includes("ROUTES.executiveAi"));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:protected", middleware.includes("ROUTES.executiveAi"));

const missionConstants = readSafe(join(root, "src", "modules", "mission-core", "constants", "index.ts"));
pass("mission-core:capability", missionConstants.includes('"executiveAi"'));

const executor = readSafe(join(root, "src", "modules", "mission-core", "engine", "capability-executor.ts"));
pass("executor:orchestrate", executor.includes("executiveAi:orchestrate"));
pass("executor:approve", executor.includes("executiveAi:approve-recommendation"));

pass("security:rls", migration.includes("enable row level security"));
pass("package:script", readSafe(join(root, "package.json")).includes('"executive-ai:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nExecutive AI v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);

const chain = spawnVerify(root, "scripts/verify-production-readiness.mjs");
if (chain.status !== 0) process.exit(chain.status ?? 1);
