/**
 * Sprint 14 — AI Automation & Workflow Engine verification.
 * Run: npm run ai-automation-engine:verify
 * Target: 75+/75 PASS
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

const required = [
    "src/modules/ai-automation-engine/index.ts",
    "src/modules/ai-automation-engine/access.ts",
    "src/modules/ai-automation-engine/constants.ts",
    "src/modules/ai-automation-engine/types.ts",
    "src/modules/ai-automation-engine/repository/ai-automation-engine.repository.ts",
    "src/modules/ai-automation-engine/builders/ai-automation-engine.builders.ts",
    "src/modules/ai-automation-engine/services/ai-automation-engine.service.ts",
    "src/modules/ai-automation-engine/hooks/useAiAutomationEngine.ts",
    "src/modules/ai-automation-engine/components/AiAutomationEnginePage.tsx",
    "src/modules/ai-automation-engine/components/AiAutomationEnginePanels.tsx",
    "app/(shell)/ai-automation-engine/page.tsx",
    "scripts/test-ai-automation-engine.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/ai-automation-engine/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/ai-automation-engine/builders/ai-automation-engine.builders.ts"));
pass("module:builder", builders.includes("buildWorkflowBuilder"));
pass("module:triggers", builders.includes("buildTriggerCenter"));
pass("module:actions", builders.includes("buildActionsLibrary"));
pass("module:generator", builders.includes("buildAiWorkflowGenerator"));
pass("module:execution", builders.includes("buildExecutionCenter"));
pass("module:approvals", builders.includes("buildApprovalCenter"));
pass("module:monitoring", builders.includes("buildMonitoringDashboard"));
pass("module:templates", builders.includes("buildTemplateMarketplace"));
pass("module:integrations", builders.includes("buildIntegrationHub"));
pass("module:executive", builders.includes("buildExecutiveDashboard"));
pass("feature:triggers", builders.includes("form_submitted") && builders.includes("deal_won") && builders.includes("webhook"));
pass("feature:actions", builders.includes("send_whatsapp") && builders.includes("ai_video_generation") && builders.includes("custom_http_request"));
pass("feature:nodes", builders.includes("condition") && builders.includes("branch") && builders.includes("delay") && builders.includes("loop"));
pass("feature:templates", builders.includes("marketing") && builders.includes("customer_success") && builders.includes("finance"));
pass("feature:integrations", builders.includes("slack") && builders.includes("stripe") && builders.includes("razorpay") && builders.includes("google_drive"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/ai-automation-engine/repository/ai-automation-engine.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:workflows", repo.includes("workflows.listByOrganization"));
pass("live:templates", repo.includes("workflowTemplates"));
pass("live:executions", repo.includes("workflowExecutions"));
pass("live:logs", repo.includes("automationLogs"));
pass("live:agents", repo.includes("aiAgents"));
pass("live:triggers_child", repo.includes("workflowTriggers.listByWorkflow"));
pass("live:actions_child", repo.includes("workflowActions.listByWorkflow"));
pass("live:conditions_child", repo.includes("workflowConditions.listByWorkflow"));
pass("live:dwe_definitions", repo.includes("dweWorkflowDefinitions"));
pass("live:dwe_nodes", repo.includes("dweWorkflowNodes"));
pass("live:dwe_decisions", repo.includes("dweDecisionNodes"));
pass("live:dwe_executions", repo.includes("dweWorkflowExecutions"));
pass("live:dwe_retries", repo.includes("dweExecutionRetries"));
pass("live:dwe_webhooks", repo.includes("dweWebhookTriggers"));
pass("live:dwe_approvals", repo.includes("dweApprovalTasks"));
pass("live:dwe_integrations", repo.includes("dweAutomationIntegrations"));
pass("live:dwe_metrics", repo.includes("dweWorkflowMetrics"));
pass("live:dwe_health", repo.includes("dweWorkflowHealth"));
pass("live:dwe_audit", repo.includes("dweAuditLogs"));
pass("live:dwe_business_triggers", repo.includes("dweBusinessEventTriggers"));
pass("live:dwe_templates", repo.includes("dweWorkflowTemplates"));

const page = readSafe(join(root, "src/modules/ai-automation-engine/components/AiAutomationEnginePage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("AAE_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/ai-automation-engine/components/AiAutomationEnginePanels.tsx"));
pass("ui:builder", panels.includes("Workflow Builder") && panels.includes("Drag & Drop"));
pass("ui:triggers", panels.includes("Trigger Center") && panels.includes("Webhook trigger"));
pass("ui:actions", panels.includes("Actions Library") && panels.includes("Send WhatsApp") && panels.includes("Custom HTTP Request"));
pass("ui:generator", panels.includes("AI Workflow Generator") && panels.includes("natural language") && panels.includes("Suggested improvements"));
pass("ui:execution", panels.includes("Execution Center") && panels.includes("Retry queue") && panels.includes("Execution logs"));
pass("ui:approvals", panels.includes("Approval Center") && panels.includes("Founder approvals") && panels.includes("Audit trail"));
pass("ui:monitoring", panels.includes("Monitoring Dashboard") && panels.includes("Success rate") && panels.includes("Automation savings"));
pass("ui:templates", panels.includes("Template Marketplace") && panels.includes("Customer Success") && panels.includes("Operations"));
pass("ui:integrations", panels.includes("Integration Hub") && panels.includes("Slack") && panels.includes("Razorpay") && panels.includes("Google Drive"));
pass("ui:executive", panels.includes("Executive Dashboard") && panels.includes("Automation ROI") && panels.includes("Top automations") && panels.includes("AI recommendations"));

pass(
    "routes:aiAutomationEngine",
    readSafe(join(root, "src/constants/routes.ts")).includes("aiAutomationEngine:"),
);
pass(
    "middleware:protected",
    readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.aiAutomationEngine"),
);
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("aiAutomationEngine"));
pass(
    "package:script",
    readSafe(join(root, "package.json")).includes('"ai-automation-engine:verify"'),
);

pass(
    "isolation:no_schema_migration",
    !existsSync(join(root, "supabase/migrations/ai-automation-engine.sql")),
);
pass(
    "isolation:finance_sprint12_intact",
    existsSync(join(root, "src/modules/ai-finance-billing-engine/services/ai-finance-billing-engine.service.ts")),
);
pass(
    "isolation:customer_success_sprint11_intact",
    existsSync(join(root, "src/modules/ai-customer-success-engine/services/ai-customer-success-engine.service.ts")),
);
pass(
    "isolation:sales_sprint10_intact",
    existsSync(join(root, "src/modules/ai-sales-lead-engine/services/ai-sales-lead-engine.service.ts")),
);
pass(
    "isolation:marketing_sprint9_intact",
    existsSync(join(root, "src/modules/ai-marketing-growth-engine/services/ai-marketing-growth-engine.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-ai-automation-engine.mjs");
pass(
    "test:ai-automation-engine",
    unit.status === 0,
    unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "",
);

const failed = results.filter((r) => !r.pass);
console.log(`ai-automation-engine:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
