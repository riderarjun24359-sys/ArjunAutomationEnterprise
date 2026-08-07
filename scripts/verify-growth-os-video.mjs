/**
 * Growth OS Sprint 4 — AI Video Factory verification.
 * Run: npm run growth-os-video:verify
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
    "src/modules/growth-os-video/index.ts",
    "src/modules/growth-os-video/access.ts",
    "src/modules/growth-os-video/constants.ts",
    "src/modules/growth-os-video/types.ts",
    "src/modules/growth-os-video/repository/growth-os-video.repository.ts",
    "src/modules/growth-os-video/builders/growth-os-video.builders.ts",
    "src/modules/growth-os-video/services/growth-os-video.service.ts",
    "src/modules/growth-os-video/hooks/useGrowthOsVideo.ts",
    "src/modules/growth-os-video/components/GrowthOsVideoPage.tsx",
    "src/modules/growth-os-video/components/GrowthOsVideoPanels.tsx",
    "app/(shell)/growth-os-video/page.tsx",
    "scripts/test-growth-os-video.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/growth-os-video/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const constants = readSafe(join(root, "src/modules/growth-os-video/constants.ts"));
pass("arch:provider_agnostic", constants.includes("GOV_PROVIDER_SLOTS"));
pass("arch:aspect_ratios", constants.includes("16:9") && constants.includes("9:16") && constants.includes("4:5"));

const builders = readSafe(join(root, "src/modules/growth-os-video/builders/growth-os-video.builders.ts"));
pass("module:scripts", builders.includes("buildAiScriptStudio"));
pass("module:storyboard", builders.includes("buildStoryboardEngine"));
pass("module:audio", builders.includes("buildVoiceAudioStudio"));
pass("module:composition", builders.includes("buildVideoCompositionEngine"));
pass("module:projects", builders.includes("buildVideoProjectManager"));
pass("module:qa", builders.includes("buildQualityAssuranceEngine"));
pass("feature:provider_slots", builders.includes("providerSlots"));
pass("feature:brand_voice", builders.includes("brandVoiceAligned"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/growth-os-video/repository/growth-os-video.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:scripts", repo.includes("aageScriptGenerators"));
pass("live:captions", repo.includes("aageCaptionGenerators"));
pass("live:voice", repo.includes("aageVoiceProfiles") && repo.includes("aagoVoiceoverManager"));
pass("live:music", repo.includes("aageMusicAssets"));
pass("live:projects", repo.includes("aagoVideoProjects"));
pass("live:youtube", repo.includes("aageYoutubeTemplates"));
pass("live:approvals", repo.includes("aageApprovalQueue") && repo.includes("aagoApprovalCenter"));
pass("live:publish", repo.includes("aagePublishingQueue"));

const page = readSafe(join(root, "src/modules/growth-os-video/components/GrowthOsVideoPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("GOV_TAB_LIST"));
pass("ui:provider_badge", page.includes("Provider-agnostic"));

const panels = readSafe(join(root, "src/modules/growth-os-video/components/GrowthOsVideoPanels.tsx"));
pass("ui:scripts", panels.includes("AiScriptStudioPanel"));
pass("ui:storyboard", panels.includes("StoryboardEnginePanel"));
pass("ui:audio", panels.includes("VoiceAudioStudioPanel"));
pass("ui:composition", panels.includes("VideoCompositionEnginePanel"));
pass("ui:projects", panels.includes("VideoProjectManagerPanel"));
pass("ui:qa", panels.includes("QualityAssuranceEnginePanel"));
pass("ui:approval_workflow", panels.includes("Founder / Admin approval"));

pass("routes:growthOsVideo", readSafe(join(root, "src/constants/routes.ts")).includes("growthOsVideo:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.growthOsVideo"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("growthOsVideo"));
pass("package:script", readSafe(join(root, "package.json")).includes('"growth-os-video:verify"'));

pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/growth-os-video.sql")));
pass(
    "isolation:creative_intact",
    existsSync(join(root, "src/modules/growth-os-creative/services/growth-os-creative.service.ts")),
);
pass(
    "isolation:content_intact",
    existsSync(join(root, "src/modules/growth-os-content/services/growth-os-content.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-growth-os-video.mjs");
pass("test:growth-os-video", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`growth-os-video:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
