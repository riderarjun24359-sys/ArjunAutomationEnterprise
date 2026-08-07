/**
 * Growth OS Sprint 5 — Publishing & Distribution verification.
 * Run: npm run growth-os-publishing:verify
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
    "src/modules/growth-os-publishing/index.ts",
    "src/modules/growth-os-publishing/access.ts",
    "src/modules/growth-os-publishing/constants.ts",
    "src/modules/growth-os-publishing/types.ts",
    "src/modules/growth-os-publishing/repository/growth-os-publishing.repository.ts",
    "src/modules/growth-os-publishing/builders/growth-os-publishing.builders.ts",
    "src/modules/growth-os-publishing/services/growth-os-publishing.service.ts",
    "src/modules/growth-os-publishing/hooks/useGrowthOsPublishing.ts",
    "src/modules/growth-os-publishing/components/GrowthOsPublishingPage.tsx",
    "src/modules/growth-os-publishing/components/GrowthOsPublishingPanels.tsx",
    "app/(shell)/growth-os-publishing/page.tsx",
    "scripts/test-growth-os-publishing.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/growth-os-publishing/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const constants = readSafe(join(root, "src/modules/growth-os-publishing/constants.ts"));
pass("arch:connector_slots", constants.includes("GOP_CONNECTOR_SLOTS"));
pass("arch:provider_agnostic", constants.includes("Provider-agnostic") || constants.includes("official"));

const builders = readSafe(join(root, "src/modules/growth-os-publishing/builders/growth-os-publishing.builders.ts"));
pass("module:campaigns", builders.includes("buildCampaignOrchestrator"));
pass("module:scheduler", builders.includes("buildPublishingScheduler"));
pass("module:website", builders.includes("buildWebsitePublisher"));
pass("module:social", builders.includes("buildSocialDistribution"));
pass("module:releases", builders.includes("buildReleaseManager"));
pass("module:analytics", builders.includes("buildDistributionAnalytics"));
pass("feature:utm", builders.includes("slugToUtm"));
pass("feature:best_time", builders.includes("bestTimeScore"));
pass("feature:retry", builders.includes("isRetryEligible"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/growth-os-publishing/repository/growth-os-publishing.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:campaigns", repo.includes("cnhCampaigns"));
pass("live:scheduler", repo.includes("aagePublishingQueue") && repo.includes("aagoDistributionPublishingQueue"));
pass("live:channels", repo.includes("aagoChannelManager"));
pass("live:history", repo.includes("aagoPublishingHistory"));
pass("live:website", repo.includes("cmpWebsitePages") && repo.includes("aageBlogTemplates"));
pass("live:analytics", repo.includes("aagoDistributionAnalytics") && repo.includes("aagoLeadAttribution"));
pass("live:approvals", repo.includes("aageApprovalQueue") && repo.includes("aagoApprovalCenter"));
pass("live:audit", repo.includes("aageAuditLogs") && repo.includes("aagoAuditLogs"));

const page = readSafe(join(root, "src/modules/growth-os-publishing/components/GrowthOsPublishingPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("GOP_TAB_LIST"));
pass("ui:provider_badge", page.includes("Provider-agnostic"));

const panels = readSafe(join(root, "src/modules/growth-os-publishing/components/GrowthOsPublishingPanels.tsx"));
pass("ui:campaigns", panels.includes("CampaignOrchestratorPanel"));
pass("ui:scheduler", panels.includes("PublishingSchedulerPanel"));
pass("ui:website", panels.includes("WebsitePublisherPanel"));
pass("ui:social", panels.includes("SocialDistributionPanel"));
pass("ui:releases", panels.includes("ReleaseManagerPanel"));
pass("ui:analytics", panels.includes("DistributionAnalyticsPanel"));
pass("ui:approval_workflow", panels.includes("Founder / Admin approval workflow"));

pass("routes:growthOsPublishing", readSafe(join(root, "src/constants/routes.ts")).includes("growthOsPublishing:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.growthOsPublishing"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("growthOsPublishing"));
pass("package:script", readSafe(join(root, "package.json")).includes('"growth-os-publishing:verify"'));

pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/growth-os-publishing.sql")));
pass(
    "isolation:video_intact",
    existsSync(join(root, "src/modules/growth-os-video/services/growth-os-video.service.ts")),
);
pass(
    "isolation:creative_intact",
    existsSync(join(root, "src/modules/growth-os-creative/services/growth-os-creative.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-growth-os-publishing.mjs");
pass("test:growth-os-publishing", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`growth-os-publishing:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
