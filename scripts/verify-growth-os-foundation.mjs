/**
 * Growth OS Foundation (Sprint 1) verification.
 * Run: npm run growth-os-foundation:verify
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
    "src/modules/growth-os-foundation/index.ts",
    "src/modules/growth-os-foundation/access.ts",
    "src/modules/growth-os-foundation/constants.ts",
    "src/modules/growth-os-foundation/types.ts",
    "src/modules/growth-os-foundation/repository/growth-os-foundation.repository.ts",
    "src/modules/growth-os-foundation/builders/growth-os-foundation.builders.ts",
    "src/modules/growth-os-foundation/services/growth-os-foundation.service.ts",
    "src/modules/growth-os-foundation/hooks/useGrowthOsFoundation.ts",
    "src/modules/growth-os-foundation/components/GrowthOsFoundationPage.tsx",
    "src/modules/growth-os-foundation/components/GrowthOsFoundationPanels.tsx",
    "app/(shell)/growth-os-foundation/page.tsx",
    "scripts/test-growth-os-foundation.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/growth-os-foundation/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/growth-os-foundation/builders/growth-os-foundation.builders.ts"));
pass("module:brand_asset_manager", builders.includes("buildBrandAssetManager"));
pass("module:content_workspace", builders.includes("buildContentWorkspace"));
pass("module:ai_research", builders.includes("buildAiResearchEngine"));
pass("module:workflow", builders.includes("buildWorkflowEngine"));
pass("module:analytics", builders.includes("buildAnalyticsFoundation"));
pass("workflow:stages", builders.includes("mapWorkflowStage"));
pass("workflow:roles", builders.includes("roleForStage"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/growth-os-foundation/repository/growth-os-foundation.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:logos", repo.includes("aageLogoLibrary"));
pass("live:colors", repo.includes("aageColorSystems"));
pass("live:calendar", repo.includes("aageContentCalendar"));
pass("live:drafts", repo.includes("aageDraftQueue"));
pass("live:approvals", repo.includes("aageApprovalQueue"));
pass("live:seo", repo.includes("aageSeoAssistants"));
pass("live:industry", repo.includes("aagoIndustryLibrary"));
pass("live:campaigns", repo.includes("cnhCampaigns"));
pass("live:metrics", repo.includes("cnhCampaignMetrics"));
pass("live:performance", repo.includes("aagoContentPerformance"));
pass("live:audit", repo.includes("aageAuditLogs") && repo.includes("aagoAuditLogs"));

const page = readSafe(join(root, "src/modules/growth-os-foundation/components/GrowthOsFoundationPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("GOF_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/growth-os-foundation/components/GrowthOsFoundationPanels.tsx"));
pass("ui:brand", panels.includes("BrandAssetManagerPanel"));
pass("ui:content", panels.includes("ContentWorkspacePanel"));
pass("ui:research", panels.includes("AiResearchEnginePanel"));
pass("ui:workflow", panels.includes("WorkflowEnginePanel"));
pass("ui:analytics", panels.includes("AnalyticsFoundationPanel"));
pass("ui:lifecycle_label", panels.includes("Draft → Review → Approved → Scheduled → Published"));

pass("routes:growthOsFoundation", readSafe(join(root, "src/constants/routes.ts")).includes("growthOsFoundation:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.growthOsFoundation"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("growthOsFoundation"));
pass("package:script", readSafe(join(root, "package.json")).includes('"growth-os-foundation:verify"'));

pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/growth-os-foundation.sql")));
pass(
    "isolation:growth_engine_v1_intact",
    existsSync(join(root, "src/modules/growth-engine-v1/services/growth-engine-v1.service.ts")),
);
pass(
    "isolation:aage_intact",
    existsSync(join(root, "src/modules/growth-engine/services/growth-engine.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-growth-os-foundation.mjs");
pass("test:growth-os-foundation", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`growth-os-foundation:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
