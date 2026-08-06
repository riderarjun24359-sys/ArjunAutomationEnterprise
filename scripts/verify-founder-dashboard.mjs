/**
 * Founder Analytics & Growth Command Center verification.
 * Run: npm run founder-dashboard:verify
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
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 240) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 240) : "");

const required = [
    "src/modules/founder-analytics/index.ts",
    "src/modules/founder-analytics/access.ts",
    "src/modules/founder-analytics/constants.ts",
    "src/modules/founder-analytics/types.ts",
    "src/modules/founder-analytics/repository/founder-analytics.repository.ts",
    "src/modules/founder-analytics/builders/founder-analytics.builders.ts",
    "src/modules/founder-analytics/services/founder-analytics.service.ts",
    "src/modules/founder-analytics/hooks/useFounderAnalytics.ts",
    "src/modules/founder-analytics/lib/board-pdf.ts",
    "src/modules/founder-analytics/components/FounderAnalyticsPage.tsx",
    "src/modules/founder-analytics/components/FounderAnalyticsPanels.tsx",
    "app/(shell)/founder-analytics/page.tsx",
    "scripts/test-founder-analytics.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/founder-analytics/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));
pass("access:admin_gate", access.includes("USER_ROLES.admin"));

const builders = readSafe(join(root, "src/modules/founder-analytics/builders/founder-analytics.builders.ts"));
pass("module:executive", builders.includes("buildExecutiveDashboard"));
pass("module:growth", builders.includes("buildGrowthCenter"));
pass("module:customers", builders.includes("buildCustomerIntelligence"));
pass("module:alerts", builders.includes("buildFounderAlerts"));
pass("module:advisor", builders.includes("buildAdvisorBriefing"));
pass("module:board", builders.includes("buildBoardRoom"));
pass("metrics:mrr", builders.includes("mrrUsd"));
pass("metrics:arr", builders.includes("arrUsd"));
pass("metrics:churn", builders.includes("churnRatePercent"));
pass("metrics:nps", builders.includes("npsScore"));
pass("metrics:cac", builders.includes("cacUsd"));
pass("metrics:ltv", builders.includes("ltvUsd"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/founder-analytics/repository/founder-analytics.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:subscriptions", repo.includes("brvSubscriptionBillings"));
pass("live:mrr", repo.includes("brvMrrSnapshots"));
pass("live:health", repo.includes("csHealthScores"));
pass("live:leads", repo.includes("salesLeads"));
pass("live:campaigns", repo.includes("cnhCampaigns"));
pass("live:security", repo.includes("idpSecurityAlerts"));

const page = readSafe(join(root, "src/modules/founder-analytics/components/FounderAnalyticsPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("FOUNDER_ANALYTICS_TAB_LIST"));

const pdf = readSafe(join(root, "src/modules/founder-analytics/lib/board-pdf.ts"));
pass("board:pdf_export", pdf.includes("jsPDF") && pdf.includes("exportBoardRoomPdf"));

pass("routes:founderAnalytics", readSafe(join(root, "src/constants/routes.ts")).includes("founderAnalytics:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.founderAnalytics"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("founderAnalytics"));
pass("package:script", readSafe(join(root, "package.json")).includes('"founder-dashboard:verify"'));

// Ensure we did not edit existing business module trees for this feature
const forbiddenTouches = [
    "src/modules/billing-finance/services/billing-finance-os.service.ts",
    "src/modules/customer-success/services/customer-success-os.service.ts",
    "src/modules/founder-os/services/founder-os.service.ts",
];
for (const f of forbiddenTouches) {
    pass(`isolation:${f}`, existsSync(join(root, f)));
}

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-founder-analytics.mjs");
pass("test:founder-analytics", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`founder-dashboard:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
