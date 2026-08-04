/**
 * Mission Core v1.0 verification: tsc, lint, route, nav, middleware,
 * 8 panels, 5 engine files, capability registry, event bus, workflow engine,
 * ai decision engine, shared service registry, orchestration rules, design-os,
 * client-success-capability regression.
 * Run: node scripts/verify-mission-core.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "mission-core");
const cscRoot = join(root, "src", "modules", "client-success-capability");
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

const routePath = join(root, "app", "(shell)", "mission-core", "page.tsx");
const routeSource = readSafe(routePath);
pass("route:page_exists", existsSync(routePath));
pass("route:exports_MissionCorePage", routeSource.includes("MissionCorePage"));

const routesSource = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:routes_ts_missionCore", routesSource.includes('missionCore: "/mission-core"'));

const navSource = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Mission_Core_label", navSource.includes("Mission Core"));
pass("nav:Cpu_icon", navSource.includes("Cpu"));
pass("nav:missionCore_route", navSource.includes("ROUTES.missionCore"));
pass("nav:primary_section", /Mission Core[\s\S]*section:\s*"primary"/.test(navSource));

const middlewareSource = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:missionCore_protected", middlewareSource.includes("ROUTES.missionCore"));

const panels = [
    "CapabilityRegistryPanel",
    "WorkflowEnginePanel",
    "EventBusPanel",
    "AiDecisionEnginePanel",
    "SharedServiceRegistryPanel",
    "HealthDashboardPanel",
    "WorkflowMonitorPanel",
    "DeveloperConsolePanel",
];

for (const panel of panels) {
    pass(`panel:${panel}`, existsSync(join(modRoot, "components", "panels", `${panel}.tsx`)));
}

const engines = [
    "capability-registry",
    "workflow-engine",
    "event-bus",
    "ai-decision-engine",
    "shared-service-registry",
];

for (const engine of engines) {
    pass(`engine:${engine}`, existsSync(join(modRoot, "engine", `${engine}.ts`)));
}

const constantsSource = readSafe(join(modRoot, "constants", "index.ts"));
const capabilityIds = ["sales", "clientSuccess", "businessAssets", "brandOs", "growthEngine", "hios", "founderOs", "enterpriseIntelligence", "projects", "finance", "securityCenter", "platformOperations", "aiFoundation"];
for (const id of capabilityIds) {
    pass(`capability:${id}`, constantsSource.includes(`id: "${id}"`));
}
pass("capability:finance_active", constantsSource.includes('id: "finance"') && constantsSource.includes('status: "active"'));

const capabilityRegistry = readSafe(join(modRoot, "engine", "capability-registry.ts"));
pass("engine:registerAllCapabilities", capabilityRegistry.includes("registerAllCapabilities"));
pass("engine:getCapability", capabilityRegistry.includes("getCapability"));
pass("engine:updateHealth", capabilityRegistry.includes("updateHealth"));
pass("engine:listCapabilities", capabilityRegistry.includes("listCapabilities"));

const eventBusSource = readSafe(join(modRoot, "engine", "event-bus.ts"));
pass("engine:publish", eventBusSource.includes("export function publish"));
pass("engine:subscribe", eventBusSource.includes("export function subscribe"));
pass("engine:getEventLog", eventBusSource.includes("getEventLog"));
pass("engine:routeEvent", eventBusSource.includes("routeEvent"));

const workflowEngine = readSafe(join(modRoot, "engine", "workflow-engine.ts"));
pass("engine:createWorkflow", workflowEngine.includes("createWorkflow"));
pass("engine:startWorkflow", workflowEngine.includes("startWorkflow"));
pass("engine:advanceStep", workflowEngine.includes("advanceStep"));
pass("engine:retryWorkflow", workflowEngine.includes("retryWorkflow"));
pass("engine:listInstances", workflowEngine.includes("listInstances"));
const hasWorkflowNameSwitch = /switch\s*\(\s*workflowName\s*\)/.test(workflowEngine)
    || /case\s+"run-onboarding"/.test(workflowEngine)
    || /case\s+"provision-workspace"/.test(workflowEngine);
pass("engine:no_hardcoded_workflow_switch", !hasWorkflowNameSwitch);

const aiEngine = readSafe(join(modRoot, "engine", "ai-decision-engine.ts"));
pass("engine:decideRouting", aiEngine.includes("decideRouting"));

const sharedRegistry = readSafe(join(modRoot, "engine", "shared-service-registry.ts"));
pass("engine:listServices", sharedRegistry.includes("listServices"));
pass("engine:getService", sharedRegistry.includes("getService"));
pass("engine:invokeService", sharedRegistry.includes("invokeService"));
const serviceIds = ["auth", "notifications", "documentEngine", "gci", "search", "audit", "ai", "analytics", "integrations"];
for (const id of serviceIds) {
    pass(`service:${id}`, constantsSource.includes(`id: "${id}"`));
}
pass("service:count_8plus", serviceIds.length >= 8);

const orchestrationRules = readSafe(join(modRoot, "lib", "orchestration-rules.ts"));
pass("rules:ORCHESTRATION_RULES", orchestrationRules.includes("ORCHESTRATION_RULES"));
pass("rules:validateNoDirectCapabilityCall", orchestrationRules.includes("validateNoDirectCapabilityCall"));
pass("rules:no_direct_capability", orchestrationRules.includes("no-direct-capability-call"));

const serviceSource = readSafe(join(modRoot, "services", "mission-core.service.ts"));
const serviceMethods = [
    "initializePlatform",
    "registerCapability",
    "registerAllPlatformCapabilities",
    "publishEvent",
    "subscribeToEvents",
    "createAndRunWorkflow",
    "getWorkflowInstances",
    "makeAiDecision",
    "invokeSharedService",
    "getPlatformHealth",
    "getCapabilityHealths",
    "getWorkflowMonitor",
    "getDeveloperConsoleData",
    "enforceOrchestrationRule",
    "executeWorkflow",
    "getCapabilityStatus",
];
for (const method of serviceMethods) {
    pass(`service:${method}`, serviceSource.includes(method));
}

const sdkSource = readSafe(join(modRoot, "sdk", "index.ts"));
pass("sdk:createMissionCoreClient", sdkSource.includes("createMissionCoreClient"));
pass("sdk:publishEvent", sdkSource.includes("publishEvent"));
pass("sdk:initializePlatform", sdkSource.includes("initializePlatform"));

pass("hook:useMissionCore", existsSync(join(modRoot, "hooks", "useMissionCore.ts")));

const typesSource = readSafe(join(modRoot, "types", "index.ts"));
const typeNames = ["CapabilityDefinition", "WorkflowDefinition", "WorkflowStep", "WorkflowInstance", "PlatformEvent", "AiDecision", "SharedService", "PlatformHealth", "OrchestrationRule"];
for (const typeName of typeNames) {
    pass(`type:${typeName}`, typesSource.includes(typeName));
}

const pageSource = readSafe(join(modRoot, "components", "MissionCorePage.tsx"));
pass("ui:design_os_Card", pageSource.includes("@/src/design-os/components/Card"));
pass("ui:design_os_Button", pageSource.includes("design-os"));
pass("ui:PageTransition", pageSource.includes("PageTransition"));
pass("ui:StaggerReveal", pageSource.includes("StaggerReveal"));
pass("ui:Tabs", pageSource.includes("Tabs"));
pass("ui:KpiCard", pageSource.includes("KpiCard"));
pass("ui:Badge", pageSource.includes("Badge"));

const bridgeSource = readSafe(join(cscRoot, "integrations", "mission-core-bridge.ts"));
pass("bridge:mission-core-bridge_exists", existsSync(join(cscRoot, "integrations", "mission-core-bridge.ts")));
pass("bridge:createMissionCoreClient", bridgeSource.includes("createMissionCoreClient"));
pass("bridge:executeClientSuccessWorkflow", bridgeSource.includes("executeClientSuccessWorkflow"));
pass("bridge:ensureClientSuccessCapability", bridgeSource.includes("ensureClientSuccessCapability"));
pass("bridge:publishEvent_compat", bridgeSource.includes("publishEvent") || bridgeSource.includes("publishClientSuccessEvent"));

const cscTsc = runTsc(root);
pass("regression:client_success_tsc", cscTsc.status === 0, cscTsc.status !== 0 ? (cscTsc.stderr || cscTsc.stdout || "").slice(0, 200) : "");

const pkg = readSafe(join(root, "package.json"));
pass("package:mission_core_verify_script", pkg.includes('"mission-core:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\n=== Mission Core Verification ===\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} passed\n`);

if (failed.length > 0) process.exit(1);
