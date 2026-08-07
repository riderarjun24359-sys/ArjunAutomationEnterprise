/**
 * Growth Engine v1 — acquisition & revenue verification.
 * Run: npm run growth-engine:verify
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
    "src/modules/growth-engine-v1/index.ts",
    "src/modules/growth-engine-v1/access.ts",
    "src/modules/growth-engine-v1/constants.ts",
    "src/modules/growth-engine-v1/types.ts",
    "src/modules/growth-engine-v1/repository/growth-engine-v1.repository.ts",
    "src/modules/growth-engine-v1/builders/growth-engine-v1.builders.ts",
    "src/modules/growth-engine-v1/services/growth-engine-v1.service.ts",
    "src/modules/growth-engine-v1/hooks/useGrowthEngineV1.ts",
    "src/modules/growth-engine-v1/components/GrowthEngineV1Page.tsx",
    "src/modules/growth-engine-v1/components/GrowthEngineV1Panels.tsx",
    "app/(shell)/growth-engine-v1/page.tsx",
    "scripts/test-growth-engine-v1.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/growth-engine-v1/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/growth-engine-v1/builders/growth-engine-v1.builders.ts"));
pass("module:marketing", builders.includes("buildMarketingCrm"));
pass("module:sales", builders.includes("buildSalesPipeline"));
pass("module:lifecycle", builders.includes("buildCustomerLifecycle"));
pass("module:analytics", builders.includes("buildGrowthAnalytics"));
pass("module:founder", builders.includes("buildFounderGrowthDashboard"));
pass("metrics:cac", builders.includes("cacUsd"));
pass("metrics:ltv", builders.includes("ltvUsd"));
pass("metrics:mrr", builders.includes("mrrUsd"));
pass("metrics:arr", builders.includes("arrUsd"));
pass("metrics:activation", builders.includes("activationRatePercent"));
pass("metrics:retention", builders.includes("retentionRatePercent"));
pass("metrics:referral", builders.includes("referralRatePercent"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/growth-engine-v1/repository/growth-engine-v1.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:leads", repo.includes("salesLeads"));
pass("live:campaigns", repo.includes("cnhCampaigns"));
pass("live:attribution", repo.includes("aagoLeadAttribution"));
pass("live:opportunities", repo.includes("salesOpportunities"));
pass("live:quotes", repo.includes("salesQuotes"));
pass("live:winloss", repo.includes("salesWinLossRecords"));
pass("live:subscriptions", repo.includes("brvSubscriptionBillings"));
pass("live:churn", repo.includes("csChurnPredictions"));
pass("live:renewals", repo.includes("csRenewalPlans"));
pass("live:expansions", repo.includes("csExpansionOpportunities"));
pass("live:mrr", repo.includes("brvMrrSnapshots"));
pass("live:arr", repo.includes("brvArrSnapshots"));

const page = readSafe(join(root, "src/modules/growth-engine-v1/components/GrowthEngineV1Page.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("GEV1_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/growth-engine-v1/components/GrowthEngineV1Panels.tsx"));
pass("ui:marketing", panels.includes("MarketingCrmPanel"));
pass("ui:sales", panels.includes("SalesPipelinePanel"));
pass("ui:lifecycle", panels.includes("CustomerLifecyclePanel"));
pass("ui:analytics", panels.includes("GrowthAnalyticsPanel"));
pass("ui:founder", panels.includes("FounderGrowthPanel"));

pass("routes:growthEngineV1", readSafe(join(root, "src/constants/routes.ts")).includes("growthEngineV1:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.growthEngineV1"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("growthEngineV1"));
pass("package:script", readSafe(join(root, "package.json")).includes('"growth-engine:verify"'));

// Do not modify AAGE core growth-engine business module for this feature
pass(
    "isolation:aage_service_intact",
    existsSync(join(root, "src/modules/growth-engine/services/growth-engine.service.ts")),
);
pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/growth-engine-v1.sql")));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-growth-engine-v1.mjs");
pass("test:growth-engine-v1", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`growth-engine:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
