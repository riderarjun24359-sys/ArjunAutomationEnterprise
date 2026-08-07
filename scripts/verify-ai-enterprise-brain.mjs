/**
 * Sprint 17 — AI Enterprise Brain verification.
 * Run: npm run ai-enterprise-brain:verify
 * Target: 90+/90 PASS
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

function readSafe(path) {
    try {
        return readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

const tsc = runTsc(root);
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 400) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 400) : "");

const unit = spawnVerify(root, "scripts/test-ai-enterprise-brain.mjs");
pass("runtime:unit_tests", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 400) : "");

const required = [
    "src/modules/ai-enterprise-brain/index.ts",
    "src/modules/ai-enterprise-brain/access.ts",
    "src/modules/ai-enterprise-brain/constants.ts",
    "src/modules/ai-enterprise-brain/types.ts",
    "src/modules/ai-enterprise-brain/repository/ai-enterprise-brain.repository.ts",
    "src/modules/ai-enterprise-brain/builders/ai-enterprise-brain.builders.ts",
    "src/modules/ai-enterprise-brain/services/ai-enterprise-brain.service.ts",
    "src/modules/ai-enterprise-brain/hooks/useAiEnterpriseBrain.ts",
    "src/modules/ai-enterprise-brain/components/AiEnterpriseBrainPage.tsx",
    "src/modules/ai-enterprise-brain/components/AiEnterpriseBrainPanels.tsx",
    "app/(shell)/ai-enterprise-brain/page.tsx",
    "scripts/test-ai-enterprise-brain.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/ai-enterprise-brain/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/ai-enterprise-brain/builders/ai-enterprise-brain.builders.ts"));
pass("module:mission_control", builders.includes("buildMissionControl"));
pass("module:multi_agent", builders.includes("buildMultiAgentCoordinator"));
pass("module:decision_engine", builders.includes("buildAiDecisionEngine"));
pass("module:task_planner", builders.includes("buildTaskPlanner"));
pass("module:orchestrator", builders.includes("buildCrossModuleOrchestrator"));
pass("module:memory", builders.includes("buildEnterpriseMemory"));
pass("module:exceptions", builders.includes("buildExceptionCenter"));
pass("module:approvals", builders.includes("buildFounderApprovalCenter"));
pass("module:executive", builders.includes("buildExecutiveMissionDashboard"));
pass("feature:classify_agent", builders.includes("classifyAgentRole"));
pass("feature:marketing_agent", builders.includes("marketing"));
pass("feature:sales_agent", builders.includes("sales"));
pass("feature:cs_agent", builders.includes("customer_success"));
pass("feature:finance_agent", builders.includes("finance"));
pass("feature:automation_agent", builders.includes("automation"));
pass("feature:operations_agent", builders.includes("operations"));
pass("feature:recommendation_ranking", builders.includes("rank") && builders.includes("confidence"));
pass("feature:rollback", builders.includes("executionRollbacks") || builders.includes("rollbacks"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/ai-enterprise-brain/repository/ai-enterprise-brain.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:multi_tenant", repo.includes("resolveOrganizationContext") && repo.includes("organizationId"));
pass("live:fo_okrs", repo.includes("foStrategicOkrs"));
pass("live:ac_contexts", repo.includes("acCompanyContexts"));
pass("live:fo_priorities", repo.includes("foPriorities"));
pass("live:milestones", repo.includes("foCompanyMilestones"));
pass("live:aix_priorities", repo.includes("aixTodayPriorities"));
pass("live:orch_agents", repo.includes("aiOrchestrationAgents"));
pass("live:ai_agents", repo.includes("aiAgents"));
pass("live:task_executions", repo.includes("aiTaskExecutions"));
pass("live:recommended_actions", repo.includes("aixRecommendedActions"));
pass("live:business_risks", repo.includes("aixBusinessRisks"));
pass("live:growth_opps", repo.includes("aixGrowthOpportunities"));
pass("live:predictive", repo.includes("acPredictiveRecommendations"));
pass("live:roadmaps", repo.includes("foProductRoadmaps"));
pass("live:resources", repo.includes("foResourceAllocations"));
pass("live:approval_tasks", repo.includes("dweApprovalTasks"));
pass("live:time_triggers", repo.includes("dweTimeTriggers"));
pass("live:orch_links", repo.includes("aixOrchestrationLinks"));
pass("live:ac_orchestrations", repo.includes("acWorkflowOrchestrations"));
pass("live:cross_module", repo.includes("acCrossModuleAutomations"));
pass("live:workflow_executions", repo.includes("dweWorkflowExecutions"));
pass("live:failed_executions", repo.includes("dweFailedExecutions"));
pass("live:rollbacks", repo.includes("dweExecutionRollbacks"));
pass("live:knowledge", repo.includes("knowledgeEntries"));
pass("live:ai_contexts", repo.includes("knowledgeAiContexts"));
pass("live:adrs", repo.includes("knowledgeAdrs"));
pass("live:decision_log", repo.includes("foDecisionLog"));
pass("live:timeline", repo.includes("acCompanyTimeline"));
pass("live:activity", repo.includes("acActivityFeed"));
pass("live:revenue_risks", repo.includes("aixRevenueRisks"));
pass("live:churn_risks", repo.includes("aixChurnRisks"));
pass("live:permission_risks", repo.includes("aixPermissionRisks"));
pass("live:emergency", repo.includes("acEmergencyWorkflows"));
pass("live:approvals", repo.includes("acApprovalWorkflows"));
pass("live:manual_reviews", repo.includes("dweManualReviews"));
pass("live:kpis", repo.includes("acBusinessKpis"));
pass("live:ops_health", repo.includes("acOperationalHealth"));
pass("live:exec_metrics", repo.includes("aixExecutiveMetrics"));
pass("live:audit_fo", repo.includes("foAuditLogs"));
pass("live:audit_ac", repo.includes("acAuditLogs"));
pass("live:audit_aix", repo.includes("aixAuditLogs"));

const page = readSafe(join(root, "src/modules/ai-enterprise-brain/components/AiEnterpriseBrainPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("AEB_TAB_LIST"));
pass("ui:sprint17", page.includes("Sprint 17"));

const panels = readSafe(join(root, "src/modules/ai-enterprise-brain/components/AiEnterpriseBrainPanels.tsx"));
pass("ui:mission", panels.includes("Mission Control") && panels.includes("Company objectives") && panels.includes("Progress tracking"));
pass("ui:multi_agent", panels.includes("Multi-Agent Coordinator") && panels.includes("Marketing Agent") && panels.includes("Operations Agent"));
pass("ui:decision", panels.includes("AI Decision Engine") && panels.includes("Goal evaluation") && panels.includes("Recommendation ranking"));
pass("ui:planner", panels.includes("Task Planner") && panels.includes("Long-running plans") && panels.includes("Resource allocation"));
pass("ui:orchestrator", panels.includes("Cross-Module Orchestrator") && panels.includes("Rollback on failures") && panels.includes("Execute workflows"));
pass("ui:memory", panels.includes("Enterprise Memory") && panels.includes("Shared business context") && panels.includes("AI notes"));
pass("ui:exceptions", panels.includes("Exception Center") && panels.includes("Revenue risks") && panels.includes("Security risks"));
pass("ui:approvals", panels.includes("Founder Approval Center") && panels.includes("Pending approvals") && panels.includes("Audit trail"));
pass("ui:executive", panels.includes("Executive Mission Dashboard") && panels.includes("Company health") && panels.includes("KPI overview"));

pass(
    "routes:aiEnterpriseBrain",
    readSafe(join(root, "src/constants/routes.ts")).includes("aiEnterpriseBrain:"),
);
pass(
    "middleware:protected",
    readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.aiEnterpriseBrain"),
);
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("aiEnterpriseBrain"));
pass(
    "package:script",
    readSafe(join(root, "package.json")).includes('"ai-enterprise-brain:verify"'),
);

pass(
    "isolation:no_schema_migration",
    !existsSync(join(root, "supabase/migrations/ai-enterprise-brain.sql")),
);
pass(
    "isolation:sprint16_intact",
    existsSync(join(root, "src/modules/enterprise-integrations/services/enterprise-integrations.service.ts")),
);
pass(
    "isolation:sprint15_intact",
    existsSync(join(root, "src/modules/ai-operations-center/services/ai-operations-center.service.ts")),
);
pass(
    "isolation:sprint14_intact",
    existsSync(join(root, "src/modules/ai-automation-engine/services/ai-automation-engine.service.ts")),
);
pass(
    "isolation:sprint12_intact",
    existsSync(join(root, "src/modules/ai-finance-billing-engine/services/ai-finance-billing-engine.service.ts")),
);
pass(
    "isolation:sprint11_intact",
    existsSync(join(root, "src/modules/ai-customer-success-engine/services/ai-customer-success-engine.service.ts")),
);
pass(
    "architecture:reuse_not_duplicate_schema",
    repo.includes("databaseService") && !repo.includes("createTable") && !builders.includes("CREATE TABLE"),
);

const failed = results.filter((r) => !r.pass);
const passed = results.filter((r) => r.pass);

console.log(`\nAI Enterprise Brain verify: ${passed.length}/${results.length} PASS`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length || passed.length < 90) {
    process.exitCode = 1;
    console.error(`\nTarget 90+/90 not met (${passed.length}/${results.length}).`);
} else {
    console.log("\nTarget 90+/90 met.");
}
