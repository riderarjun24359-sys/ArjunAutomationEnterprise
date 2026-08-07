/**
 * Sprint 11 — AI Customer Success & Support Engine verification.
 * Run: npm run ai-customer-success-engine:verify
 * Target: 60+/60 PASS
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
    "src/modules/ai-customer-success-engine/index.ts",
    "src/modules/ai-customer-success-engine/access.ts",
    "src/modules/ai-customer-success-engine/constants.ts",
    "src/modules/ai-customer-success-engine/types.ts",
    "src/modules/ai-customer-success-engine/repository/ai-customer-success-engine.repository.ts",
    "src/modules/ai-customer-success-engine/builders/ai-customer-success-engine.builders.ts",
    "src/modules/ai-customer-success-engine/services/ai-customer-success-engine.service.ts",
    "src/modules/ai-customer-success-engine/hooks/useAiCustomerSuccessEngine.ts",
    "src/modules/ai-customer-success-engine/components/AiCustomerSuccessEnginePage.tsx",
    "src/modules/ai-customer-success-engine/components/AiCustomerSuccessEnginePanels.tsx",
    "app/(shell)/ai-customer-success-engine/page.tsx",
    "scripts/test-ai-customer-success-engine.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/ai-customer-success-engine/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/ai-customer-success-engine/builders/ai-customer-success-engine.builders.ts"));
pass("module:inbox", builders.includes("buildAiSupportInbox"));
pass("module:tickets", builders.includes("buildTicketManagement"));
pass("module:health", builders.includes("buildCustomerHealthBoard"));
pass("module:renewals", builders.includes("buildRenewalCenter"));
pass("module:knowledge", builders.includes("buildAiKnowledgeBase"));
pass("module:replies", builders.includes("buildAiReplyGenerator"));
pass("module:sla", builders.includes("buildSlaDashboard"));
pass("module:success", builders.includes("buildCustomerSuccessDashboard"));
pass("module:automation", builders.includes("buildAutomationCenter"));
pass("module:executive", builders.includes("buildExecutiveIntelligence"));
pass("feature:ticket_statuses", builders.includes("waiting_customer") && builders.includes("escalated"));
pass("feature:channels", builders.includes("whatsapp") && builders.includes("live_chat") && builders.includes("contact_form"));
pass("feature:reply_tones", builders.includes("friendly") && builders.includes("professional") && builders.includes("technical"));
pass("feature:renewal_buckets", builders.includes("payment_followup") && builders.includes("reminder"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/ai-customer-success-engine/repository/ai-customer-success-engine.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:tickets", repo.includes("supportTickets"));
pass("live:priorities", repo.includes("supportPriorities"));
pass("live:queues", repo.includes("supportQueues"));
pass("live:slas", repo.includes("supportSlas"));
pass("live:knowledge", repo.includes("supportKnowledgeArticles") && repo.includes("knowledgeEntries"));
pass("live:canned", repo.includes("supportCannedResponses"));
pass("live:escalation", repo.includes("supportEscalationRules"));
pass("live:satisfaction", repo.includes("supportSatisfactionRatings"));
pass("live:health", repo.includes("csHealthScores"));
pass("live:adoption", repo.includes("csAdoptionTracking"));
pass("live:churn", repo.includes("csChurnPredictions"));
pass("live:expansion", repo.includes("csExpansionOpportunities"));
pass("live:renewals", repo.includes("csRenewalPlans"));
pass("live:cs_sla", repo.includes("csSlaMonitoring"));
pass("live:kpi", repo.includes("csSuccessKpiDashboards"));
pass("live:executive", repo.includes("csExecutiveSummaries"));
pass("live:faqs", repo.includes("aagoFaqLibrary"));

const page = readSafe(join(root, "src/modules/ai-customer-success-engine/components/AiCustomerSuccessEnginePage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("ACSE_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/ai-customer-success-engine/components/AiCustomerSuccessEnginePanels.tsx"));
pass("ui:inbox", panels.includes("SupportInboxPanel") && panels.includes("Search inbox"));
pass("ui:tickets", panels.includes("TicketManagementPanel"));
pass("ui:health", panels.includes("CustomerHealthPanel"));
pass("ui:renewals", panels.includes("RenewalCenterPanel"));
pass("ui:knowledge", panels.includes("KnowledgeBasePanel") && panels.includes("AI search"));
pass("ui:replies", panels.includes("ReplyGeneratorPanel"));
pass("ui:sla", panels.includes("SlaDashboardPanel") && panels.includes("Team Performance"));
pass("ui:success", panels.includes("SuccessDashboardPanel") && panels.includes("CSAT"));
pass("ui:automation", panels.includes("AutomationCenterPanel"));
pass("ui:executive", panels.includes("ExecutiveIntelligencePanel"));

pass(
    "routes:aiCustomerSuccessEngine",
    readSafe(join(root, "src/constants/routes.ts")).includes("aiCustomerSuccessEngine:"),
);
pass(
    "middleware:protected",
    readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.aiCustomerSuccessEngine"),
);
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("aiCustomerSuccessEngine"));
pass(
    "package:script",
    readSafe(join(root, "package.json")).includes('"ai-customer-success-engine:verify"'),
);

pass(
    "isolation:no_schema_migration",
    !existsSync(join(root, "supabase/migrations/ai-customer-success-engine.sql")),
);
pass("isolation:support_intact", existsSync(join(root, "src/modules/support")) || existsSync(join(root, "app/(shell)/support")));
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
const unit = spawnVerify(root, "scripts/test-ai-customer-success-engine.mjs");
pass(
    "test:ai-customer-success-engine",
    unit.status === 0,
    unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "",
);

const failed = results.filter((r) => !r.pass);
console.log(`ai-customer-success-engine:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
