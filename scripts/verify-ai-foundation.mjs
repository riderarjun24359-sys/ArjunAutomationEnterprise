/**
 * AI Foundation verification: tsc, lint, route, nav, middleware,
 * 10 panels, 10 engines, 4 bridges, constants, service methods,
 * mission-core integration, GCI, Design OS, SDK, governance,
 * no duplicate AI logic, regression mission-core + platform-operations.
 * Run: node scripts/verify-ai-foundation.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "ai-foundation");
const mcRoot = join(root, "src", "modules", "mission-core");
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

const routePath = join(root, "app", "(shell)", "ai-foundation", "page.tsx");
const routeSource = readSafe(routePath);
pass("route:page_exists", existsSync(routePath));
pass("route:exports_AiFoundationPage", routeSource.includes("AiFoundationPage"));

const routesSource = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:routes_ts_aiFoundation", routesSource.includes('aiFoundation: "/ai-foundation"'));

const navSource = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:AI_Foundation_label", navSource.includes("AI Foundation"));
pass("nav:Brain_icon", navSource.includes("Brain"));
pass("nav:aiFoundation_route", navSource.includes("ROUTES.aiFoundation"));
pass("nav:primary_section", /AI Foundation[\s\S]*section:\s*"primary"/.test(navSource));

const middlewareSource = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:aiFoundation_protected", middlewareSource.includes("ROUTES.aiFoundation"));

const panels = [
    "AiMemoryEnginePanel",
    "KnowledgeGraphPanel",
    "PromptManagementPanel",
    "AgentRegistryPanel",
    "AiWorkflowEnginePanel",
    "EvaluationCenterPanel",
    "AiGovernancePanel",
    "CostUsageCenterPanel",
    "LearningPipelinePanel",
    "ExecutiveDashboardPanel",
];

for (const panel of panels) {
    pass(`panel:${panel}`, existsSync(join(modRoot, "components", "panels", `${panel}.tsx`)));
}

const engines = [
    "ai-memory-engine",
    "knowledge-graph-engine",
    "prompt-management-engine",
    "agent-registry-engine",
    "ai-workflow-engine",
    "evaluation-center-engine",
    "ai-governance-engine",
    "cost-usage-engine",
    "learning-pipeline-engine",
    "executive-dashboard-engine",
];

for (const engine of engines) {
    pass(`engine:${engine}`, existsSync(join(modRoot, "engine", `${engine}.ts`)));
}

const bridges = [
    "mission-core-bridge",
    "ai-orchestration-bridge",
    "gci-bridge",
    "audit-bridge",
];

for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

const constantsSource = readSafe(join(modRoot, "constants", "index.ts"));
const memoryTypes = ["persistent", "conversation", "project", "customer", "business", "workflow"];
for (const type of memoryTypes) {
    pass(`constant:MEMORY_TYPE:${type}`, constantsSource.includes(`"${type}"`));
}

const nodeTypes = ["customer", "project", "capability", "document", "aiAgent", "workflow", "businessAsset", "missionCore"];
for (const type of nodeTypes) {
    pass(`constant:KNOWLEDGE_NODE:${type}`, constantsSource.includes(`"${type}"`));
}

const policyTypes = ["model", "pii", "prompt_safety", "output_validation", "risk"];
for (const type of policyTypes) {
    pass(`constant:GOVERNANCE_POLICY:${type}`, constantsSource.includes(`"${type}"`));
}

const evalCategories = ["accuracy", "quality", "consistency", "latency", "failures", "hallucination"];
for (const cat of evalCategories) {
    pass(`constant:EVAL_CATEGORY:${cat}`, constantsSource.includes(`"${cat}"`));
}

const serviceSource = readSafe(join(modRoot, "services", "ai-foundation.service.ts"));
const serviceMethods = [
    "getMemories",
    "storeMemory",
    "searchMemories",
    "getKnowledgeNodes",
    "getKnowledgeEdges",
    "getRelatedNodes",
    "getPrompts",
    "testPrompt",
    "approvePrompt",
    "rollbackPrompt",
    "trackPromptUsage",
    "getAgents",
    "registerAgent",
    "selectAgent",
    "routeAiRequest",
    "getWorkflows",
    "executeWorkflow",
    "getEvaluationMetrics",
    "getOverallQualityScore",
    "getGovernancePolicies",
    "enforcePolicy",
    "getApprovedModels",
    "getCostUsageRecords",
    "getOptimizationRecommendations",
    "getFeedbackQueue",
    "captureFeedback",
    "getHumanReviewQueue",
    "getExecutiveDashboard",
    "getFullState",
];
for (const method of serviceMethods) {
    pass(`service:${method}`, serviceSource.includes(method));
}

const mcConstants = readSafe(join(mcRoot, "constants", "index.ts"));
pass("mission-core:aiFoundation_capability", mcConstants.includes('id: "aiFoundation"'));
pass("mission-core:AiRoutingEvent", mcConstants.includes("AiRoutingEvent"));
pass("mission-core:AgentSelectedEvent", mcConstants.includes("AgentSelectedEvent"));
pass("mission-core:AiWorkflowExecutedEvent", mcConstants.includes("AiWorkflowExecutedEvent"));
pass("mission-core:MemoryAccessEvent", mcConstants.includes("MemoryAccessEvent"));
pass("mission-core:KnowledgeAccessEvent", mcConstants.includes("KnowledgeAccessEvent"));
pass("mission-core:PolicyEnforcedEvent", mcConstants.includes("PolicyEnforcedEvent"));

const mcService = readSafe(join(mcRoot, "services", "mission-core.service.ts"));
pass("mission-core:publishAiRoutingEvent", mcService.includes("publishAiRoutingEvent"));
pass("mission-core:publishAgentSelectedEvent", mcService.includes("publishAgentSelectedEvent"));
pass("mission-core:publishAiWorkflowExecutedEvent", mcService.includes("publishAiWorkflowExecutedEvent"));
pass("mission-core:publishMemoryAccessEvent", mcService.includes("publishMemoryAccessEvent"));
pass("mission-core:publishKnowledgeAccessEvent", mcService.includes("publishKnowledgeAccessEvent"));
pass("mission-core:publishPolicyEnforcedEvent", mcService.includes("publishPolicyEnforcedEvent"));

const mcSdk = readSafe(join(mcRoot, "sdk", "index.ts"));
pass("mission-core:sdk_publishAiRoutingEvent", mcSdk.includes("publishAiRoutingEvent"));
pass("mission-core:sdk_publishPolicyEnforcedEvent", mcSdk.includes("publishPolicyEnforcedEvent"));

const mcBridge = readSafe(join(modRoot, "integrations", "mission-core-bridge.ts"));
pass("bridge:publishAiRoutingEvent", mcBridge.includes("publishAiRoutingEvent"));
pass("bridge:publishAgentSelectedEvent", mcBridge.includes("publishAgentSelectedEvent"));
pass("bridge:routeAiDecision", mcBridge.includes("routeAiDecision"));

const aiBridge = readSafe(join(modRoot, "integrations", "ai-orchestration-bridge.ts"));
pass("bridge:delegates_ai_orchestration", aiBridge.includes("aiOrchestrationService") && aiBridge.includes("no duplicate"));

const gciBridge = readSafe(join(modRoot, "integrations", "gci-bridge.ts"));
pass("gci:uses_gci_client", gciBridge.includes("createGciClient"));
pass("gci:businessIntent", gciBridge.includes("GCI_PRESERVATION_RULES") || readSafe(join(modRoot, "constants", "index.ts")).includes("businessIntent"));

const promptEngine = readSafe(join(modRoot, "engine", "prompt-management-engine.ts"));
pass("prompt:versioning", promptEngine.includes("version"));
pass("prompt:approval", promptEngine.includes("approvePrompt"));
pass("prompt:rollback", promptEngine.includes("rollbackPrompt"));
pass("prompt:usage_tracking", promptEngine.includes("trackPromptUsage"));

const kgEngine = readSafe(join(modRoot, "engine", "knowledge-graph-engine.ts"));
pass("knowledge:relationships", kgEngine.includes("relationship"));

const govEngine = readSafe(join(modRoot, "engine", "ai-governance-engine.ts"));
pass("governance:enforcePolicy", govEngine.includes("enforcePolicy"));
pass("governance:pii", govEngine.includes("checkPiiProtection"));
pass("governance:prompt_safety", govEngine.includes("checkPromptSafety"));
pass("governance:risk_scoring", govEngine.includes("riskScore"));

const pageSource = readSafe(join(modRoot, "components", "AiFoundationPage.tsx"));
pass("ui:design_os_Card", pageSource.includes("@/src/design-os/components/Card"));
pass("ui:PageTransition", pageSource.includes("PageTransition"));
pass("ui:StaggerReveal", pageSource.includes("StaggerReveal"));
pass("ui:Tabs", pageSource.includes("Tabs"));

const sdkSource = readSafe(join(modRoot, "sdk", "index.ts"));
pass("sdk:createAiFoundationClient", sdkSource.includes("createAiFoundationClient"));

pass("package:ai_foundation_verify", readSafe(join(root, "package.json")).includes('"ai-foundation:verify"'));

const mcVerify = spawnVerify(root, "scripts/verify-mission-core.mjs");
pass("regression:mission_core_verify", mcVerify.status === 0, mcVerify.status !== 0 ? "mission-core verify failed" : "");

const poVerify = spawnVerify(root, "scripts/verify-platform-operations.mjs");
pass("regression:platform_operations_verify", poVerify.status === 0, poVerify.status !== 0 ? "platform-operations verify failed" : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nAI Foundation Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}
