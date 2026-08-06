/**
 * Generate docs/FINAL_LAUNCH_READINESS_REPORT.md
 * Run: npm run generate:final-launch-readiness-report
 */
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadProjectEnv } from "./_load-env.mjs";

const root = process.cwd();
loadProjectEnv(root);
const env = process.env;

function ok(rel) {
    return existsSync(join(root, rel));
}
function read(rel) {
    try {
        return readFileSync(join(root, rel), "utf8");
    } catch {
        return "";
    }
}
function present(key) {
    return Boolean(env[key]?.trim());
}

const journey = [
    ["Sign up", "app/auth/sign-up/page.tsx", "/auth/sign-up"],
    ["Email verification", "app/auth/verify-email/page.tsx", "/auth/verify-email"],
    ["Organization creation", "app/(shell)/onboarding/page.tsx", "/onboarding"],
    ["Workspace setup", "src/modules/soft-launch/components/OnboardingWizard.tsx", "/onboarding"],
    ["Team invitation", "src/modules/early-access/components/EarlyAccessPanels.tsx", "/early-access"],
    ["First login", "app/auth/sign-in/page.tsx", "/auth/sign-in"],
    ["First AI interaction", "app/(shell)/ai/page.tsx", "/ai"],
    ["First client", "app/(shell)/clients/page.tsx", "/clients"],
    ["First project", "app/(shell)/projects/page.tsx", "/projects"],
    ["First task", "app/(shell)/tasks/page.tsx", "/tasks"],
    ["First invoice", "app/(shell)/finance/page.tsx", "/finance"],
    ["Logout/Login", "src/modules/auth/components/AuthStatus.tsx", "/auth/sign-in"],
].map(([step, file, path]) => ({ step, path, present: ok(file) }));

const critical = [];
const high = [];
const medium = [];
const nice = [];

for (const step of journey) {
    if (!step.present) {
        critical.push(`Missing journey step: ${step.step} (${step.path})`);
    }
}

const ux = [
    ["EmptyState", "src/design-os/components/EmptyState.tsx"],
    ["LoadingState", "src/design-os/components/LoadingState.tsx"],
    ["ErrorState", "src/design-os/components/ErrorState.tsx"],
    ["SkeletonLoader", "src/design-os/motion/components/SkeletonLoader.tsx"],
    ["useReducedMotion", "src/design-os/motion/hooks/useReducedMotion.ts"],
];
for (const [name, file] of ux) {
    if (!ok(file)) critical.push(`UX primitive missing: ${name}`);
}

const header = read("src/modules/company-launch-kit/components/premium/PremiumHeader.tsx");
if (!(header.includes("Mobile navigation") || header.includes("mobileOpen"))) {
    high.push("Mobile navigation signals weak in PremiumHeader");
}
if (!header.includes("aria-label")) {
    medium.push("Header accessibility aria-labels incomplete");
}

const footer = read("src/modules/company-launch-kit/components/premium/PremiumFooter.tsx").toLowerCase();
for (const [name, file] of [
    ["privacy", "app/(marketing)/privacy/page.tsx"],
    ["terms", "app/(marketing)/terms/page.tsx"],
    ["cookies", "app/(marketing)/cookies/page.tsx"],
    ["refund", "app/(marketing)/refund/page.tsx"],
]) {
    if (!ok(file)) critical.push(`Missing legal page: ${name}`);
    else if (!footer.includes(name)) high.push(`Footer may not link ${name}`);
}

const home = read("src/modules/company-launch-kit/data/home-content.ts");
const pricing = read("src/modules/company-launch-kit/data/pricing.ts");
if (!/row-level security|tenant isolation|encrypted|audit/i.test(home)) {
    medium.push("Strengthen security messaging on marketing content");
}
if (!/milestone-based billing|billing|pricing/i.test(home + pricing)) {
    medium.push("Strengthen billing messaging on pricing surfaces");
}

const layout = read("app/layout.tsx");
if (!(layout.includes("openGraph") && layout.includes("SOFT_LAUNCH_BRANDING"))) {
    medium.push("Branding/OG consistency incomplete in root layout");
}

if (!ok("app/manifest.ts")) {
    nice.push("Confirm PWA manifest for installability");
}

const missingSecrets = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "PLATFORM_LEAD_API_KEY",
    "PLATFORM_ORGANIZATION_ID",
].filter((k) => !present(k));
if (missingSecrets.length) {
    critical.push(`Production secrets incomplete: ${missingSecrets.join(", ")}`);
}
const emailOk = present("RESEND_API_KEY") || (present("SMTP_HOST") && present("SMTP_USER"));
if (!emailOk) critical.push("Email provider not configured (verify-email/invites will fail)");

const checksPass =
    journey.every((j) => j.present) &&
    ux.every(([, file]) => ok(file)) &&
    ["privacy", "terms", "cookies", "refund"].every((n) => ok(`app/(marketing)/${n}/page.tsx`));

const scoreBase = 100;
const score = Math.max(
    0,
    Math.min(
        100,
        scoreBase - critical.length * 12 - high.length * 6 - medium.length * 3 - Math.max(0, nice.filter(Boolean).length - 1) * 1,
    ),
);

const decision = critical.length === 0 && checksPass && score >= 75 ? "GO" : "HOLD";
const niceClean = nice.filter(Boolean);

const md = `# Final Launch Readiness Report

**Version:** 1.0.0-final-launch-readiness  
**Generated:** ${new Date().toISOString()}  
**Final score:** ${score}/100  
**Decision: ${decision}**  

## Executive summary

Customer-experience audit of Arjun Automation before first invitation.
Journey surfaces ${journey.filter((j) => j.present).length}/${journey.length}.
Issues: ${critical.length} critical · ${high.length} high · ${medium.length} medium · ${niceClean.length} nice-to-have.
Recommendation: **${decision}**.

## Customer journey audit

| Step | Path | Present |
|---|---|---|
${journey.map((j) => `| ${j.step} | ${j.path} | ${j.present ? "yes" : "NO"} |`).join("\n")}

## UX audit

- Empty / Loading / Error / Skeleton / reduced-motion primitives: ${ux.every(([, f]) => ok(f)) ? "PASS" : "FAIL"}
- Mobile navigation: ${header.includes("mobileOpen") || header.includes("Mobile navigation") ? "PASS" : "REVIEW"}
- Accessibility (header aria-label): ${header.includes("aria-label") ? "PASS" : "REVIEW"}
- Motion consistency: ${read("src/design-os/components/EmptyState.tsx").includes("useReducedMotion") ? "PASS" : "REVIEW"}
- Performance deferral helpers: ${ok("src/modules/company-launch-kit/components/premium/LazyOnView.tsx") || ok("src/modules/company-launch-kit/components/premium/DeferredHomeSections.tsx") ? "PASS" : "REVIEW"}

## Trust audit

- Privacy / Terms / Cookies / Refund pages: ${["privacy", "terms", "cookies", "refund"].every((n) => ok(`app/(marketing)/${n}/page.tsx`)) ? "PASS" : "FAIL"}
- Footer legal links: ${["privacy", "terms", "cookies", "refund"].every((n) => footer.includes(n)) ? "PASS" : "REVIEW"}
- Security messaging: ${/row-level security|tenant isolation|encrypted|audit/i.test(home) ? "PASS" : "REVIEW"}
- Billing messaging: ${/milestone-based billing|billing|pricing/i.test(home + pricing) ? "PASS" : "REVIEW"}
- Branding / OG: ${layout.includes("openGraph") && layout.includes("SOFT_LAUNCH_BRANDING") ? "PASS" : "REVIEW"}

## Critical issues

${critical.length ? critical.map((i) => `- ${i}`).join("\n") : "- None"}

## High priority issues

${high.length ? high.map((i) => `- ${i}`).join("\n") : "- None"}

## Medium priority issues

${medium.length ? medium.map((i) => `- ${i}`).join("\n") : "- None"}

## Nice-to-have improvements

${niceClean.length ? niceClean.map((i) => `- ${i}`).join("\n") : "- None"}

## Recommendation

**${decision}**

${
    decision === "GO"
        ? "Safe to send the first Early Access invitation after operator sign-off."
        : "Do not send invitations until critical blockers are cleared; re-run npm run final-launch-readiness:verify."
}

See \`docs/FINAL_LAUNCH_READINESS.md\`, \`docs/LAUNCH_EXECUTION.md\`, \`docs/EARLY_ACCESS_COHORT_RUNBOOK.md\`.
`;

writeFileSync(join(root, "docs/FINAL_LAUNCH_READINESS_REPORT.md"), md, "utf8");
console.log(`Wrote docs/FINAL_LAUNCH_READINESS_REPORT.md (score=${score}, decision=${decision})`);
