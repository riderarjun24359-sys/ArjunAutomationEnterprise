/**
 * Sprint 9 — AI Marketing & Growth Engine verification.
 * Run: npm run ai-marketing-growth-engine:verify
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
    "src/modules/ai-marketing-growth-engine/index.ts",
    "src/modules/ai-marketing-growth-engine/access.ts",
    "src/modules/ai-marketing-growth-engine/constants.ts",
    "src/modules/ai-marketing-growth-engine/types.ts",
    "src/modules/ai-marketing-growth-engine/repository/ai-marketing-growth-engine.repository.ts",
    "src/modules/ai-marketing-growth-engine/builders/ai-marketing-growth-engine.builders.ts",
    "src/modules/ai-marketing-growth-engine/services/ai-marketing-growth-engine.service.ts",
    "src/modules/ai-marketing-growth-engine/hooks/useAiMarketingGrowthEngine.ts",
    "src/modules/ai-marketing-growth-engine/components/AiMarketingGrowthEnginePage.tsx",
    "src/modules/ai-marketing-growth-engine/components/AiMarketingGrowthEnginePanels.tsx",
    "app/(shell)/ai-marketing-growth-engine/page.tsx",
    "scripts/test-ai-marketing-growth-engine.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/ai-marketing-growth-engine/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/ai-marketing-growth-engine/builders/ai-marketing-growth-engine.builders.ts"));
pass("module:content", builders.includes("buildAiContentGenerator"));
pass("module:campaigns", builders.includes("buildAiCampaignPlanner"));
pass("module:brand_voice", builders.includes("buildAiBrandVoiceManager"));
pass("module:prompts", builders.includes("buildAiPromptLibrary"));
pass("module:calendar", builders.includes("buildAiContentCalendar"));
pass("feature:channels", builders.includes("linkedin") && builders.includes("instagram") && builders.includes("facebook"));
pass("feature:campaign_phases", builders.includes("classifyCampaignPhase"));
pass("feature:week_bucket", builders.includes("weekBucket"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/ai-marketing-growth-engine/repository/ai-marketing-growth-engine.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:blog", repo.includes("aageBlogTemplates") && repo.includes("aageBlogGenerators"));
pass("live:email", repo.includes("aageEmailCampaignTemplates"));
pass("live:social", repo.includes("aageSocialTemplates") && repo.includes("aageCaptionGenerators"));
pass("live:campaigns", repo.includes("aagoCampaignAssetBuilder") && repo.includes("aagoCampaignDashboard"));
pass("live:voice", repo.includes("aageBrandVoice"));
pass("live:prompts", repo.includes("aageIdeaGenerators") && repo.includes("aageScriptGenerators"));
pass("live:calendar", repo.includes("aageContentCalendar"));

const page = readSafe(join(root, "src/modules/ai-marketing-growth-engine/components/AiMarketingGrowthEnginePage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("AMGE_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/ai-marketing-growth-engine/components/AiMarketingGrowthEnginePanels.tsx"));
pass("ui:content", panels.includes("AiContentGeneratorPanel"));
pass("ui:campaigns", panels.includes("AiCampaignPlannerPanel"));
pass("ui:brand_voice", panels.includes("AiBrandVoiceManagerPanel"));
pass("ui:prompts", panels.includes("AiPromptLibraryPanel"));
pass("ui:calendar", panels.includes("AiContentCalendarPanel"));

pass(
    "routes:aiMarketingGrowthEngine",
    readSafe(join(root, "src/constants/routes.ts")).includes("aiMarketingGrowthEngine:"),
);
pass(
    "middleware:protected",
    readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.aiMarketingGrowthEngine"),
);
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("aiMarketingGrowthEngine"));
pass(
    "package:script",
    readSafe(join(root, "package.json")).includes('"ai-marketing-growth-engine:verify"'),
);

pass(
    "isolation:no_schema_migration",
    !existsSync(join(root, "supabase/migrations/ai-marketing-growth-engine.sql")),
);
pass(
    "isolation:growth_os_content_intact",
    existsSync(join(root, "src/modules/growth-os-content/services/growth-os-content.service.ts")),
);
pass(
    "isolation:aage_intact",
    existsSync(join(root, "src/modules/growth-engine/services/growth-engine.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-ai-marketing-growth-engine.mjs");
pass(
    "test:ai-marketing-growth-engine",
    unit.status === 0,
    unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "",
);

const failed = results.filter((r) => !r.pass);
console.log(`ai-marketing-growth-engine:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
