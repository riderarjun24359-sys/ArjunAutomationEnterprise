/**
 * Early Access Launch Sprint verification.
 * Run: npm run early-access:verify
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
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
    "src/modules/early-access/index.ts",
    "src/modules/early-access/access.ts",
    "src/modules/early-access/constants.ts",
    "src/modules/early-access/types.ts",
    "src/modules/early-access/repository/early-access.repository.ts",
    "src/modules/early-access/builders/early-access.builders.ts",
    "src/modules/early-access/services/early-access.service.ts",
    "src/modules/early-access/hooks/useEarlyAccess.ts",
    "src/modules/early-access/components/EarlyAccessPage.tsx",
    "src/modules/early-access/components/EarlyAccessPanels.tsx",
    "app/(shell)/early-access/page.tsx",
    "scripts/test-early-access.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/early-access/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/early-access/builders/early-access.builders.ts"));
pass("module:management", builders.includes("buildEarlyAccessManagement"));
pass("module:success", builders.includes("buildCustomerSuccessConsole"));
pass("module:feedback", builders.includes("buildFeedbackSystem"));
pass("module:monitoring", builders.includes("buildFounderMonitoring"));
pass("module:releases", builders.includes("buildReleaseManagement"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/early-access/repository/early-access.repository.ts"));
pass("live:cop_invites", repo.includes("copBetaInvitations"));
pass("live:waitlist_leads", repo.includes("salesLeads"));
pass("live:beta_orgs", repo.includes("copBetaOrganizations"));
pass("live:founder_notes", repo.includes("foFounderInsights"));
pass("live:onboarding", repo.includes("csOnboardingWorkflows"));
pass("live:adoption", repo.includes("csAdoptionTracking"));
pass("live:feedback", repo.includes("copFeedbackCollection"));
pass("live:bugs", repo.includes("copBugReports"));
pass("live:features", repo.includes("copFeatureRequests"));
pass("live:activity", repo.includes("activityLogs"));
pass("live:release_notes", repo.includes("elrReleaseNotes"));
pass("live:deployments", repo.includes("elrDeploymentPlans"));
pass("live:incidents", repo.includes("elrCriticalIssues"));
pass(
    "no_new_ea_migration",
    !existsSync(join(root, "supabase/migrations")) ||
        !readdirSync(join(root, "supabase/migrations")).some((f) => String(f).includes("early_access_launch")),
);

const page = readSafe(join(root, "src/modules/early-access/components/EarlyAccessPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("EARLY_ACCESS_TAB_LIST"));

pass("routes:earlyAccess", readSafe(join(root, "src/constants/routes.ts")).includes("earlyAccess:"));
pass("middleware:protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.earlyAccess"));
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("earlyAccess"));
pass("package:script", readSafe(join(root, "package.json")).includes('"early-access:verify"'));

// Ensure business modules untouched by this sprint (files still exist; we didn't rewrite them)
pass("isolation:billing", existsSync(join(root, "src/modules/billing-finance/services/billing-finance-os.service.ts")));
pass("isolation:customer_success", existsSync(join(root, "src/modules/customer-success/services/customer-success-os.service.ts")));
pass("isolation:soft_launch_wizard", existsSync(join(root, "src/modules/soft-launch/components/OnboardingWizard.tsx")));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-early-access.mjs");
pass("test:early-access", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`early-access:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
