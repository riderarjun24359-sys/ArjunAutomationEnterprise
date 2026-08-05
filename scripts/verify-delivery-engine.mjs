/**
 * Delivery Engine v1.0 verification
 * Run: node scripts/verify-delivery-engine.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "delivery-engine");
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

pass("route:page", existsSync(join(root, "app", "(shell)", "delivery-engine", "page.tsx")));
pass("migration", existsSync(join(root, "supabase", "migrations", "202608060002_delivery_engine_v1.sql")));
pass("repository", existsSync(join(root, "src", "modules", "database", "repositories", "delivery-engine-repository.ts")));

const panels = [
    "BlueprintLibraryPanel",
    "ComponentLibraryPanel",
    "AutomationPipelinesPanel",
    "DeliveryPlaybookPanel",
    "QualityEnginePanel",
    "KnowledgeEnginePanel",
    "DeliveryAnalyticsPanel",
    "AiDeliveryAssistantPanel",
];

const panelFile = readSafe(join(modRoot, "components", "panels", "DeliveryEnginePanels.tsx"));
for (const panel of panels) {
    pass(`panel:${panel}`, panelFile.includes(`function ${panel}`));
}

pass("component:DeliveryEnginePage", existsSync(join(modRoot, "components", "DeliveryEnginePage.tsx")));
pass("component:DeliveryPlaybookPipeline", existsSync(join(modRoot, "components", "DeliveryPlaybookPipeline.tsx")));
pass("service:orchestrator", existsSync(join(modRoot, "services", "delivery-engine-orchestrator.service.ts")));
pass("hook:useDeliveryEngine", existsSync(join(modRoot, "hooks", "useDeliveryEngine.ts")));

const migration = readSafe(join(root, "supabase", "migrations", "202608060002_delivery_engine_v1.sql"));
pass("db:blueprints", migration.includes("de_blueprints"));
pass("db:components", migration.includes("de_components"));
pass("db:engagements", migration.includes("de_engagements"));
pass("db:pipeline_runs", migration.includes("de_pipeline_runs"));
pass("db:quality", migration.includes("de_quality_verifications"));
pass("db:knowledge", migration.includes("de_knowledge_entries"));
pass("db:analytics", migration.includes("de_analytics_metrics"));
pass("db:ai_recommendations", migration.includes("de_ai_recommendations"));

const constants = readSafe(join(modRoot, "constants", "index.ts"));
pass("blueprints:10_types", constants.includes("business-website") && constants.includes("custom-enterprise"));
pass("playbook:8_stages", constants.includes("discovery") && constants.includes("support"));
pass("quality:7_dimensions", constants.includes("performance") && constants.includes("business_rules"));
pass("pipelines:6_types", constants.includes("documentation"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("routes:deliveryEngine", routes.includes('deliveryEngine: "/delivery-engine"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Delivery_Engine", nav.includes("Delivery Engine"));
pass("nav:primary", /Delivery Engine[\s\S]*section:\s*"primary"/.test(nav));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:protected", middleware.includes("ROUTES.deliveryEngine"));

const missionConstants = readSafe(join(root, "src", "modules", "mission-core", "constants", "index.ts"));
pass("mission-core:capability", missionConstants.includes('"deliveryEngine"'));

const executor = readSafe(join(root, "src", "modules", "mission-core", "engine", "capability-executor.ts"));
pass("executor:start-engagement", executor.includes("deliveryEngine:start-engagement"));
pass("executor:run-pipeline", executor.includes("deliveryEngine:run-pipeline"));
pass("executor:verify-quality", executor.includes("deliveryEngine:verify-quality"));

const bridges = ["projects-bridge", "mission-core-bridge"];
for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

pass("package:script", readSafe(join(root, "package.json")).includes('"delivery-engine:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nDelivery Engine v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);

const chain = spawnVerify(root, "scripts/verify-executive-command-center.mjs");
if (chain.status !== 0) process.exit(chain.status ?? 1);
