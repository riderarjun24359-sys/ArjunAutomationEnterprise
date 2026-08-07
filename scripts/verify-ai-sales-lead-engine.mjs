/**
 * Sprint 10 — AI Sales & Lead Generation Engine verification.
 * Run: npm run ai-sales-lead-engine:verify
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
    "src/modules/ai-sales-lead-engine/index.ts",
    "src/modules/ai-sales-lead-engine/access.ts",
    "src/modules/ai-sales-lead-engine/constants.ts",
    "src/modules/ai-sales-lead-engine/types.ts",
    "src/modules/ai-sales-lead-engine/repository/ai-sales-lead-engine.repository.ts",
    "src/modules/ai-sales-lead-engine/builders/ai-sales-lead-engine.builders.ts",
    "src/modules/ai-sales-lead-engine/services/ai-sales-lead-engine.service.ts",
    "src/modules/ai-sales-lead-engine/hooks/useAiSalesLeadEngine.ts",
    "src/modules/ai-sales-lead-engine/components/AiSalesLeadEnginePage.tsx",
    "src/modules/ai-sales-lead-engine/components/AiSalesLeadEnginePanels.tsx",
    "app/(shell)/ai-sales-lead-engine/page.tsx",
    "scripts/test-ai-sales-lead-engine.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/ai-sales-lead-engine/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/ai-sales-lead-engine/builders/ai-sales-lead-engine.builders.ts"));
pass("module:capture", builders.includes("buildLeadCaptureCenter"));
pass("module:qualify", builders.includes("buildLeadQualificationBoard"));
pass("module:pipeline", builders.includes("buildSalesPipelineBoard"));
pass("module:documents", builders.includes("buildDocumentGenerators"));
pass("module:automation", builders.includes("buildAutomationHub"));
pass("module:analytics", builders.includes("buildSalesAnalytics"));
pass("module:workspace", builders.includes("buildWorkspaceTools"));
pass("feature:score_bands", builders.includes('return "hot"') && builders.includes('return "warm"') && builders.includes('return "cold"'));
pass("feature:funnel", builders.includes("Conversion") || builders.includes("funnel"));
pass("feature:integrations", builders.includes("email") && builders.includes("whatsapp") && builders.includes("calendar"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/ai-sales-lead-engine/repository/ai-sales-lead-engine.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:leads", repo.includes("salesLeads"));
pass("live:opportunities", repo.includes("salesOpportunities"));
pass("live:pipeline", repo.includes("salesPipelines") && repo.includes("salesPipelineStages"));
pass("live:quotes", repo.includes("salesQuotes"));
pass("live:forecasts", repo.includes("salesForecasts"));
pass("live:activities", repo.includes("salesActivities"));
pass("live:meetings", repo.includes("salesMeetings"));
pass("live:email", repo.includes("salesEmailTracking"));
pass("live:winloss", repo.includes("salesWinLossRecords"));
pass("live:proposals", repo.includes("cmpProposals") && repo.includes("baProposals"));
pass("live:contracts", repo.includes("cmpProposalContracts"));

const page = readSafe(join(root, "src/modules/ai-sales-lead-engine/components/AiSalesLeadEnginePage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("ASLE_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/ai-sales-lead-engine/components/AiSalesLeadEnginePanels.tsx"));
pass("ui:capture", panels.includes("LeadCaptureInboxPanel"));
pass("ui:qualify", panels.includes("QualificationScoringPanel"));
pass("ui:pipeline", panels.includes("PipelineDealsPanel") && panels.includes("Kanban"));
pass("ui:documents", panels.includes("DocumentsPanel") && panels.includes("Proposal Generator"));
pass("ui:automation", panels.includes("AutomationIntegrationsPanel") && panels.includes("AI Sales Assistant"));
pass("ui:analytics", panels.includes("AnalyticsPanel") && panels.includes("Conversion Funnel"));
pass("ui:workspace", panels.includes("WorkspacePanel") && panels.includes("Export CSV"));
pass("ui:search_filters", panels.includes("Search") && panels.includes("filter"));

pass("routes:aiSalesLeadEngine", readSafe(join(root, "src/constants/routes.ts")).includes("aiSalesLeadEngine:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.aiSalesLeadEngine"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("aiSalesLeadEngine"));
pass("package:script", readSafe(join(root, "package.json")).includes('"ai-sales-lead-engine:verify"'));

pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/ai-sales-lead-engine.sql")));
pass(
    "isolation:sales_intact",
    existsSync(join(root, "src/modules/sales/services/sales.service.ts")),
);
pass(
    "isolation:crm_intact",
    existsSync(join(root, "src/modules/crm/services/crm.service.ts")),
);
pass(
    "isolation:amge_intact",
    existsSync(join(root, "src/modules/ai-marketing-growth-engine/services/ai-marketing-growth-engine.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-ai-sales-lead-engine.mjs");
pass(
    "test:ai-sales-lead-engine",
    unit.status === 0,
    unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "",
);

const failed = results.filter((r) => !r.pass);
console.log(`ai-sales-lead-engine:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
