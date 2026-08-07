/**
 * Growth OS Sprint 6 — Growth Intelligence verification.
 * Run: npm run growth-os-intelligence:verify
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
    "src/modules/growth-os-intelligence/index.ts",
    "src/modules/growth-os-intelligence/access.ts",
    "src/modules/growth-os-intelligence/constants.ts",
    "src/modules/growth-os-intelligence/types.ts",
    "src/modules/growth-os-intelligence/repository/growth-os-intelligence.repository.ts",
    "src/modules/growth-os-intelligence/builders/growth-os-intelligence.builders.ts",
    "src/modules/growth-os-intelligence/services/growth-os-intelligence.service.ts",
    "src/modules/growth-os-intelligence/hooks/useGrowthOsIntelligence.ts",
    "src/modules/growth-os-intelligence/components/GrowthOsIntelligencePage.tsx",
    "src/modules/growth-os-intelligence/components/GrowthOsIntelligencePanels.tsx",
    "app/(shell)/growth-os-intelligence/page.tsx",
    "scripts/test-growth-os-intelligence.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/growth-os-intelligence/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/growth-os-intelligence/builders/growth-os-intelligence.builders.ts"));
pass("module:founder", builders.includes("buildFounderExecutiveIntelligence"));
pass("module:marketing", builders.includes("buildMarketingIntelligence"));
pass("module:revenue", builders.includes("buildRevenueIntelligence"));
pass("module:forecasting", builders.includes("buildGrowthForecasting"));
pass("module:recommendations", builders.includes("buildAiRecommendationEngine"));
pass("module:dashboard", builders.includes("buildUnifiedIntelligenceDashboard"));
pass("metrics:cac", builders.includes("cacUsd"));
pass("metrics:ltv", builders.includes("ltvUsd"));
pass("metrics:mrr", builders.includes("mrrUsd"));
pass("metrics:arr", builders.includes("arrUsd"));
pass("feature:scenarios", builders.includes("scenarios"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/growth-os-intelligence/repository/growth-os-intelligence.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:kpis", repo.includes("aagoGrowthKpis"));
pass("live:seo", repo.includes("aageSeoAssistants"));
pass("live:content", repo.includes("aagoContentPerformance"));
pass("live:mrr", repo.includes("brvMrrSnapshots") && repo.includes("brvMrrForecasts"));
pass("live:arr", repo.includes("brvArrSnapshots") && repo.includes("brvArrForecasts"));
pass("live:churn", repo.includes("csChurnPredictions"));
pass("live:recommendations", repo.includes("aagoRecommendationEngine"));
pass("live:leads", repo.includes("salesLeads"));
pass("live:subscriptions", repo.includes("brvSubscriptionBillings"));

const page = readSafe(join(root, "src/modules/growth-os-intelligence/components/GrowthOsIntelligencePage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("GOI_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/growth-os-intelligence/components/GrowthOsIntelligencePanels.tsx"));
pass("ui:founder", panels.includes("FounderExecutiveIntelligencePanel"));
pass("ui:marketing", panels.includes("MarketingIntelligencePanel"));
pass("ui:revenue", panels.includes("RevenueIntelligencePanel"));
pass("ui:forecasting", panels.includes("GrowthForecastingPanel"));
pass("ui:recommendations", panels.includes("AiRecommendationEnginePanel"));
pass("ui:dashboard", panels.includes("UnifiedIntelligenceDashboardPanel"));

pass("routes:growthOsIntelligence", readSafe(join(root, "src/constants/routes.ts")).includes("growthOsIntelligence:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.growthOsIntelligence"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("growthOsIntelligence"));
pass("package:script", readSafe(join(root, "package.json")).includes('"growth-os-intelligence:verify"'));

pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/growth-os-intelligence.sql")));
pass(
    "isolation:publishing_intact",
    existsSync(join(root, "src/modules/growth-os-publishing/services/growth-os-publishing.service.ts")),
);
pass(
    "isolation:growth_engine_v1_intact",
    existsSync(join(root, "src/modules/growth-engine-v1/services/growth-engine-v1.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-growth-os-intelligence.mjs");
pass("test:growth-os-intelligence", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`growth-os-intelligence:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
