/**
 * Growth OS Sprint 2 — AI Content Engine verification.
 * Run: npm run growth-os-content:verify
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
    "src/modules/growth-os-content/index.ts",
    "src/modules/growth-os-content/access.ts",
    "src/modules/growth-os-content/constants.ts",
    "src/modules/growth-os-content/types.ts",
    "src/modules/growth-os-content/repository/growth-os-content.repository.ts",
    "src/modules/growth-os-content/builders/growth-os-content.builders.ts",
    "src/modules/growth-os-content/services/growth-os-content.service.ts",
    "src/modules/growth-os-content/hooks/useGrowthOsContent.ts",
    "src/modules/growth-os-content/components/GrowthOsContentPage.tsx",
    "src/modules/growth-os-content/components/GrowthOsContentPanels.tsx",
    "app/(shell)/growth-os-content/page.tsx",
    "scripts/test-growth-os-content.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/growth-os-content/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/growth-os-content/builders/growth-os-content.builders.ts"));
pass("module:blog_studio", builders.includes("buildAiBlogStudio"));
pass("module:landing", builders.includes("buildLandingPageGenerator"));
pass("module:social", builders.includes("buildSocialContentEngine"));
pass("module:email", builders.includes("buildEmailContent"));
pass("module:compliance", builders.includes("buildBrandCompliance"));
pass("module:seo", builders.includes("buildSeoIntelligence"));
pass("feature:internal_links", builders.includes("internalLinks"));
pass("feature:meta", builders.includes("buildMetaTitle") && builders.includes("buildMetaDescription"));
pass("feature:schema", builders.includes("schemaType"));
pass("feature:duplicate", builders.includes("titleSimilarity"));
pass("feature:quality_score", builders.includes("qualityScore"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/growth-os-content/repository/growth-os-content.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:blog", repo.includes("aageBlogTemplates") && repo.includes("aageBlogGenerators"));
pass("live:seo", repo.includes("aageSeoAssistants"));
pass("live:faq", repo.includes("aagoFaqLibrary"));
pass("live:social", repo.includes("aageSocialTemplates") && repo.includes("aageCaptionGenerators"));
pass("live:email", repo.includes("aageEmailCampaignTemplates"));
pass("live:voice", repo.includes("aageBrandVoice"));
pass("live:approvals", repo.includes("aageApprovalQueue") && repo.includes("aagoApprovalCenter"));
pass("live:cta", repo.includes("aageCtaGenerators"));
pass("live:case_study", repo.includes("aageCaseStudyTemplates"));

const page = readSafe(join(root, "src/modules/growth-os-content/components/GrowthOsContentPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("GOC_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/growth-os-content/components/GrowthOsContentPanels.tsx"));
pass("ui:blog", panels.includes("AiBlogStudioPanel"));
pass("ui:landing", panels.includes("LandingPageGeneratorPanel"));
pass("ui:social", panels.includes("SocialContentEnginePanel"));
pass("ui:email", panels.includes("EmailContentPanel"));
pass("ui:compliance", panels.includes("BrandCompliancePanel"));
pass("ui:seo", panels.includes("SeoIntelligencePanel"));
pass("ui:approval_workflow", panels.includes("Founder / Admin approval workflow"));

pass("routes:growthOsContent", readSafe(join(root, "src/constants/routes.ts")).includes("growthOsContent:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.growthOsContent"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("growthOsContent"));
pass("package:script", readSafe(join(root, "package.json")).includes('"growth-os-content:verify"'));

pass("isolation:no_schema_migration", !existsSync(join(root, "supabase/migrations/growth-os-content.sql")));
pass(
    "isolation:foundation_intact",
    existsSync(join(root, "src/modules/growth-os-foundation/services/growth-os-foundation.service.ts")),
);
pass(
    "isolation:aage_intact",
    existsSync(join(root, "src/modules/growth-engine/services/growth-engine.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-growth-os-content.mjs");
pass("test:growth-os-content", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`growth-os-content:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
