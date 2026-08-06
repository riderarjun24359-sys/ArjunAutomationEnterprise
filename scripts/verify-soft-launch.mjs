/**
 * Soft Launch Preparation verification.
 * Run: npm run soft-launch:verify
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

const marketingPages = [
    "app/(marketing)/page.tsx",
    "app/(marketing)/features/page.tsx",
    "app/(marketing)/solutions/page.tsx",
    "app/(marketing)/pricing/page.tsx",
    "app/(marketing)/pricing/upgrade/page.tsx",
    "app/(marketing)/about/page.tsx",
    "app/(marketing)/contact/page.tsx",
    "app/(marketing)/privacy/page.tsx",
    "app/(marketing)/terms/page.tsx",
    "app/(marketing)/cookies/page.tsx",
    "app/(marketing)/refund/page.tsx",
    "app/(marketing)/help/page.tsx",
    "app/(marketing)/faq/page.tsx",
    "app/(marketing)/feedback/page.tsx",
];
for (const page of marketingPages) pass(`marketing:${page}`, existsSync(join(root, page)));

const authPages = [
    "app/auth/sign-up/page.tsx",
    "app/auth/sign-in/page.tsx",
    "app/auth/forgot-password/page.tsx",
    "app/auth/verify-email/page.tsx",
    "app/auth/welcome/page.tsx",
];
for (const page of authPages) pass(`auth:${page}`, existsSync(join(root, page)));

pass("onboarding:page", existsSync(join(root, "app/(shell)/onboarding/page.tsx")));
pass("onboarding:wizard", existsSync(join(root, "src/modules/soft-launch/components/OnboardingWizard.tsx")));
pass("pricing:plans", readSafe(join(root, "src/modules/soft-launch/data/launch-assets.ts")).includes("free_trial"));
pass("pricing:starter", readSafe(join(root, "src/modules/soft-launch/data/launch-assets.ts")).includes('"starter"'));
pass("pricing:professional", readSafe(join(root, "src/modules/soft-launch/data/launch-assets.ts")).includes('"professional"'));
pass("pricing:enterprise", readSafe(join(root, "src/modules/soft-launch/data/launch-assets.ts")).includes('"enterprise"'));
pass("pricing:upgrade_flow", existsSync(join(root, "src/modules/soft-launch/components/UpgradeFlowPanel.tsx")));
pass("pricing:page_plans", readSafe(join(root, "app/(marketing)/pricing/page.tsx")).includes("SOFT_LAUNCH_PLANS"));
pass("support:feedback_form", existsSync(join(root, "src/modules/soft-launch/components/FeedbackForm.tsx")));

pass("routes:features", readSafe(join(root, "src/modules/company-launch-kit/config/routes.ts")).includes("features:"));
pass("routes:refund", readSafe(join(root, "src/modules/company-launch-kit/config/routes.ts")).includes("refund:"));
pass("routes:help", readSafe(join(root, "src/modules/company-launch-kit/config/routes.ts")).includes("help:"));
pass("routes:onboarding", readSafe(join(root, "src/constants/routes.ts")).includes("onboarding:"));
pass("routes:verifyEmail", readSafe(join(root, "src/constants/routes.ts")).includes("verifyEmail:"));
pass("routes:welcome", readSafe(join(root, "src/constants/routes.ts")).includes("welcome:"));

pass("middleware:features_public", readSafe(join(root, "src/middleware/auth.ts")).includes("MARKETING_ROUTES.features"));
pass("middleware:refund_public", readSafe(join(root, "src/middleware/auth.ts")).includes("MARKETING_ROUTES.refund"));
pass("middleware:onboarding_protected", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.onboarding"));

pass("seo:sitemap", existsSync(join(root, "app/sitemap.ts")) && readSafe(join(root, "app/sitemap.ts")).includes("MARKETING_ROUTES.features"));
pass("seo:robots", existsSync(join(root, "app/robots.ts")));
pass("seo:buildMetadata", readSafe(join(root, "src/lib/seo.ts")).includes("openGraph"));
pass("seo:root_og", readSafe(join(root, "app/layout.tsx")).includes("openGraph"));
pass("pwa:manifest", existsSync(join(root, "app/manifest.ts")));
pass("branding:favicon_meta", readSafe(join(root, "app/layout.tsx")).includes("favicon"));
pass("branding:assets", existsSync(join(root, "public/brand/favicon.svg")));
pass("emails:welcome", existsSync(join(root, "src/modules/soft-launch/content/emails/welcome.md")));
pass("emails:verify", existsSync(join(root, "src/modules/soft-launch/content/emails/verify-email.md")));
pass("emails:invite", existsSync(join(root, "src/modules/soft-launch/content/emails/invite-teammate.md")));
pass("docs:domain_readiness", existsSync(join(root, "docs/SOFT_LAUNCH_DOMAIN_READINESS.md")));
pass("package:soft_launch_verify", readSafe(join(root, "package.json")).includes('"soft-launch:verify"'));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const publicSite = spawnVerify(root, "scripts/verify-public-website.mjs");
pass("regression:public-website", publicSite.status === 0, publicSite.status !== 0 ? "public-website verify failed" : "");

const ops = spawnVerify(root, "scripts/test-operations.mjs");
pass("regression:operations", ops.status === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log("\nSoft Launch Preparation Verification\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);
if (failed.length > 0) process.exit(1);
