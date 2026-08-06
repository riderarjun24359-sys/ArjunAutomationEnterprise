/**
 * Customer Acquisition & Success Growth verification.
 * Run: npm run customer-success-growth:verify
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
    "src/modules/customer-success-growth/index.ts",
    "src/modules/customer-success-growth/access.ts",
    "src/modules/customer-success-growth/constants.ts",
    "src/modules/customer-success-growth/types.ts",
    "src/modules/customer-success-growth/repository/customer-success-growth.repository.ts",
    "src/modules/customer-success-growth/builders/customer-success-growth.builders.ts",
    "src/modules/customer-success-growth/services/customer-success-growth.service.ts",
    "src/modules/customer-success-growth/hooks/useCustomerSuccessGrowth.ts",
    "src/modules/customer-success-growth/components/CustomerSuccessGrowthPage.tsx",
    "src/modules/customer-success-growth/components/CustomerSuccessGrowthPanels.tsx",
    "app/(shell)/customer-success-growth/page.tsx",
    "scripts/test-customer-success-growth.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/customer-success-growth/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/customer-success-growth/builders/customer-success-growth.builders.ts"));
pass("module:monitoring", builders.includes("buildSuccessMonitoring"));
pass("module:referrals", builders.includes("buildReferralEngine"));
pass("module:testimonials", builders.includes("buildTestimonialCenter"));
pass("module:education", builders.includes("buildCustomerEducation"));
pass("module:brief", builders.includes("buildFounderDailyBrief"));
pass("metrics:funnel", builders.includes("Activation") || builders.includes("funnel"));
pass("metrics:ttv", builders.includes("timeToValue") || builders.includes("daysToValue"));
pass("metrics:adoption", builders.includes("featureAdoption"));
pass("metrics:referral", builders.includes("isReferral"));
pass("metrics:nps", builders.includes("npsFromRatings"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/customer-success-growth/repository/customer-success-growth.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:onboarding", repo.includes("csOnboardingWorkflows") && repo.includes("csdOnboardingAutomation"));
pass("live:adoption", repo.includes("csAdoptionTracking") && repo.includes("csdAdoptionAnalytics"));
pass("live:referrals", repo.includes("salesLeads") && repo.includes("salesCommissions"));
pass("live:rewards", repo.includes("rtlRewardPoints"));
pass("live:testimonials", repo.includes("copFeedbackCollection") && repo.includes("aageCaseStudyTemplates"));
pass("live:education", repo.includes("csdProductTours") && repo.includes("csdKnowledgeBaseArticles"));
pass("live:brief", repo.includes("copExecutiveBriefings") && repo.includes("brvMrrSnapshots"));
pass("live:support", repo.includes("csdSupportTickets"));
pass("live:risks", repo.includes("csRiskAnalyses") && repo.includes("foRiskRegister"));

const page = readSafe(join(root, "src/modules/customer-success-growth/components/CustomerSuccessGrowthPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("CSG_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/customer-success-growth/components/CustomerSuccessGrowthPanels.tsx"));
pass("ui:monitoring", panels.includes("SuccessMonitoringPanel"));
pass("ui:referrals", panels.includes("ReferralEnginePanel"));
pass("ui:testimonials", panels.includes("TestimonialCenterPanel"));
pass("ui:education", panels.includes("CustomerEducationPanel"));
pass("ui:brief", panels.includes("FounderDailyBriefPanel"));

pass("routes:customerSuccessGrowth", readSafe(join(root, "src/constants/routes.ts")).includes("customerSuccessGrowth:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.customerSuccessGrowth"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("customerSuccessGrowth"));
pass("package:script", readSafe(join(root, "package.json")).includes('"customer-success-growth:verify"'));

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
const unit = spawnVerify(root, "scripts/test-customer-success-growth.mjs");
pass("test:customer-success-growth", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`customer-success-growth:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
