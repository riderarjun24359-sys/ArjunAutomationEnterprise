/**
 * Growth OS Sprint 3 — AI Creative Studio verification.
 * Run: npm run growth-os-creative:verify
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
    "src/modules/growth-os-creative/index.ts",
    "src/modules/growth-os-creative/access.ts",
    "src/modules/growth-os-creative/constants.ts",
    "src/modules/growth-os-creative/types.ts",
    "src/modules/growth-os-creative/repository/growth-os-creative.repository.ts",
    "src/modules/growth-os-creative/builders/growth-os-creative.builders.ts",
    "src/modules/growth-os-creative/services/growth-os-creative.service.ts",
    "src/modules/growth-os-creative/hooks/useGrowthOsCreative.ts",
    "src/modules/growth-os-creative/components/GrowthOsCreativePage.tsx",
    "src/modules/growth-os-creative/components/GrowthOsCreativePanels.tsx",
    "app/(shell)/growth-os-creative/page.tsx",
    "scripts/test-growth-os-creative.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/growth-os-creative/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/growth-os-creative/builders/growth-os-creative.builders.ts"));
pass("module:brand_images", builders.includes("buildBrandImageStudio"));
pass("module:social", builders.includes("buildSocialCreativeEngine"));
pass("module:campaign", builders.includes("buildCampaignDesigner"));
pass("module:thumbnails", builders.includes("buildThumbnailFactory"));
pass("module:quality", builders.includes("buildCreativeQualityEngine"));
pass("module:library", builders.includes("buildCreativeAssetLibrary"));
pass("feature:color_validation", builders.includes("isValidHex"));
pass("feature:duplicate", builders.includes("titleSimilarity"));
pass("feature:layout_score", builders.includes("layoutScoreFromSteps"));
pass("feature:tags", builders.includes("extractTags"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/growth-os-creative/repository/growth-os-creative.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:images", repo.includes("aageImageAssets"));
pass("live:thumbnails", repo.includes("aageThumbnailTemplates") && repo.includes("aagoThumbnailManager"));
pass("live:social", repo.includes("aageSocialTemplates"));
pass("live:campaign", repo.includes("aagoCampaignAssetBuilder"));
pass("live:creative", repo.includes("aagoCreativeAssetGenerator"));
pass("live:colors", repo.includes("aageColorSystems"));
pass("live:approvals", repo.includes("aageApprovalQueue") && repo.includes("aagoApprovalCenter"));
pass("live:library", repo.includes("cmpBrandAssets") && repo.includes("aageLogoLibrary"));

const page = readSafe(join(root, "src/modules/growth-os-creative/components/GrowthOsCreativePage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("GCR_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/growth-os-creative/components/GrowthOsCreativePanels.tsx"));
pass("ui:brand", panels.includes("BrandImageStudioPanel"));
pass("ui:social", panels.includes("SocialCreativeEnginePanel"));
pass("ui:campaign", panels.includes("CampaignDesignerPanel"));
pass("ui:thumbnails", panels.includes("ThumbnailFactoryPanel"));
pass("ui:quality", panels.includes("CreativeQualityEnginePanel"));
pass("ui:library", panels.includes("CreativeAssetLibraryPanel"));
pass("ui:approval_workflow", panels.includes("Founder / Admin approval workflow"));

pass("routes:growthOsCreative", readSafe(join(root, "src/constants/routes.ts")).includes("growthOsCreative:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.growthOsCreative"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("growthOsCreative"));
pass("package:script", readSafe(join(root, "package.json")).includes('"growth-os-creative:verify"'));

pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/growth-os-creative.sql")));
pass(
    "isolation:content_intact",
    existsSync(join(root, "src/modules/growth-os-content/services/growth-os-content.service.ts")),
);
pass(
    "isolation:foundation_intact",
    existsSync(join(root, "src/modules/growth-os-foundation/services/growth-os-foundation.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-growth-os-creative.mjs");
pass("test:growth-os-creative", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`growth-os-creative:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
