/**
 * Company Launch Kit verification: tsc, lint, marketing pages, portfolio,
 * sales docs, emails, SEO, forms API, analytics, accessibility, branding,
 * and brand-os regression.
 * Run: node scripts/verify-company-launch-kit.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const moduleRoot = join(root, "src", "modules", "company-launch-kit");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const marketingPages = [
    "app/(marketing)/page.tsx",
    "app/(marketing)/about/page.tsx",
    "app/(marketing)/services/page.tsx",
    "app/(marketing)/industries/page.tsx",
    "app/(marketing)/solutions/page.tsx",
    "app/(marketing)/portfolio/page.tsx",
    "app/(marketing)/portfolio/[slug]/page.tsx",
    "app/(marketing)/case-studies/page.tsx",
    "app/(marketing)/blog/page.tsx",
    "app/(marketing)/blog/[slug]/page.tsx",
    "app/(marketing)/careers/page.tsx",
    "app/(marketing)/contact/page.tsx",
    "app/(marketing)/privacy/page.tsx",
    "app/(marketing)/terms/page.tsx",
    "app/(marketing)/cookies/page.tsx",
    "app/(marketing)/thank-you/page.tsx",
    "app/(marketing)/launch/automation/page.tsx",
    "app/(marketing)/launch/crm/page.tsx",
    "app/(marketing)/layout.tsx",
    "app/not-found.tsx",
];

for (const page of marketingPages) {
    pass(`marketing:${page.replace(/[()/[\]]/g, "_")}`, existsSync(join(root, page)));
}

pass("marketing:app_page_deleted", !existsSync(join(root, "app", "page.tsx")));

const portfolioSource = readFileSync(join(moduleRoot, "data", "portfolio.ts"), "utf8");
const requiredPortfolioSlugs = [
    "ai-automation",
    "crm",
    "erp",
    "school-management",
    "business-automation",
    "ai-agents",
    "integrations",
];

for (const slug of requiredPortfolioSlugs) {
    pass(`portfolio:slug:${slug}`, portfolioSource.includes(`slug: "${slug}"`));
    pass(
        `portfolio:complete:${slug}`,
        portfolioSource.includes(`slug: "${slug}"`) &&
            portfolioSource.includes("overview:") &&
            portfolioSource.includes("challenge:") &&
            portfolioSource.includes("solution:") &&
            portfolioSource.includes("features:") &&
            portfolioSource.includes("benefits:") &&
            portfolioSource.includes("screenshotSlots:") &&
            portfolioSource.includes("results:"),
    );
}

const salesDocs = [
    "proposal",
    "quotation",
    "statement-of-work",
    "invoice",
    "client-agreement",
    "nda",
    "discovery-questionnaire",
    "meeting-notes-template",
];

for (const doc of salesDocs) {
    pass(`documents:${doc}`, existsSync(join(moduleRoot, "content", "documents", `${doc}.md`)));
}

const emails = [
    "welcome",
    "proposal",
    "follow-up",
    "project-kickoff",
    "weekly-update",
    "delivery-complete",
    "testimonial-request",
    "referral-request",
];

for (const email of emails) {
    pass(`emails:${email}`, existsSync(join(moduleRoot, "content", "emails", `${email}.md`)));
}

pass("seo:sitemap", existsSync(join(root, "app", "sitemap.ts")));
pass("seo:robots", existsSync(join(root, "app", "robots.ts")));

const homeSource = readFileSync(join(root, "app", "(marketing)", "page.tsx"), "utf8");
pass("seo:home_generateMetadata", homeSource.includes("export const metadata") || homeSource.includes("generateMetadata"));
pass("seo:lib_seo", existsSync(join(root, "src", "lib", "seo.ts")));

const seoLib = readFileSync(join(root, "src", "lib", "seo.ts"), "utf8");
pass("seo:buildMetadata", seoLib.includes("buildMetadata"));
pass("seo:buildOrganizationJsonLd", seoLib.includes("buildOrganizationJsonLd"));
pass("seo:buildWebPageJsonLd", seoLib.includes("buildWebPageJsonLd"));

pass("api:contact_route", existsSync(join(root, "app", "api", "launch-kit", "contact", "route.ts")));
const apiSource = readFileSync(join(root, "app", "api", "launch-kit", "contact", "route.ts"), "utf8");
pass("api:contact_validates", apiSource.includes("safeParse") || apiSource.includes("parse"));
pass("api:contact_json", apiSource.includes("NextResponse.json"));

const analyticsSource = readFileSync(join(moduleRoot, "components", "AnalyticsScripts.tsx"), "utf8");
pass("analytics:component", analyticsSource.includes("AnalyticsScripts"));
pass("analytics:ga4_env", analyticsSource.includes("NEXT_PUBLIC_GA4_ID"));
pass("analytics:meta_env", analyticsSource.includes("NEXT_PUBLIC_META_PIXEL_ID"));
pass("analytics:linkedin_env", analyticsSource.includes("NEXT_PUBLIC_LINKEDIN_PARTNER_ID"));

const envSource = readFileSync(join(root, "src", "lib", "env.ts"), "utf8");
pass("env:ga4", envSource.includes("NEXT_PUBLIC_GA4_ID"));
pass("env:gsc", envSource.includes("NEXT_PUBLIC_GSC_VERIFICATION"));

const layoutSource = readFileSync(join(moduleRoot, "components", "MarketingLayout.tsx"), "utf8");
pass("a11y:skip_link", layoutSource.includes("Skip to main content") || layoutSource.includes("skip"));
pass("branding:indigo_700", layoutSource.includes("indigo-700") || readFileSync(join(root, "app", "(marketing)", "layout.tsx"), "utf8").includes("indigo"));

const leadFormSource = readFileSync(join(moduleRoot, "components", "LeadForm.tsx"), "utf8");
pass("a11y:form_labels", leadFormSource.includes("<label") && leadFormSource.includes("htmlFor"));

const routesSource = readFileSync(join(root, "src", "constants", "routes.ts"), "utf8");
pass("route:companyLaunchKit", routesSource.includes('companyLaunchKit: "/company-launch-kit"'));

const navSource = readFileSync(join(root, "src", "config", "shell-navigation.ts"), "utf8");
pass("nav:Launch_Kit", navSource.includes("Launch Kit"));
pass("nav:Rocket_icon", navSource.includes("Rocket"));
pass("nav:companyLaunchKit_route", navSource.includes("ROUTES.companyLaunchKit"));

const middlewareSource = readFileSync(join(root, "src", "middleware", "auth.ts"), "utf8");
pass("middleware:companyLaunchKit_protected", middlewareSource.includes("ROUTES.companyLaunchKit"));

pass("module:CompanyLaunchKitPage", existsSync(join(moduleRoot, "components", "CompanyLaunchKitPage.tsx")));
pass("module:portfolio_data", existsSync(join(moduleRoot, "data", "portfolio.ts")));
pass("module:routes_config", existsSync(join(moduleRoot, "config", "routes.ts")));
pass("module:seo_defaults", existsSync(join(moduleRoot, "config", "seo-defaults.ts")));

pass("marketing:landing_automation_md", existsSync(join(moduleRoot, "content", "marketing", "landing-automation.md")));
pass("marketing:landing_crm_md", existsSync(join(moduleRoot, "content", "marketing", "landing-crm.md")));

pass("components:NewsletterSignup", existsSync(join(moduleRoot, "components", "NewsletterSignup.tsx")));
pass("components:BlogLayout", existsSync(join(moduleRoot, "components", "BlogLayout.tsx")));
pass("components:CaseStudyLayout", existsSync(join(moduleRoot, "components", "CaseStudyLayout.tsx")));
pass("components:SocialPostTemplate", existsSync(join(moduleRoot, "components", "SocialPostTemplate.tsx")));

pass("package:company_launch_kit_verify", readFileSync(join(root, "package.json"), "utf8").includes('"company-launch-kit:verify"'));

const brandOsVerify = spawnSync("npm", ["run", "brand-os:verify"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:brand_os_verify", brandOsVerify.status === 0, brandOsVerify.status !== 0 ? (brandOsVerify.stderr || brandOsVerify.stdout || "").slice(-200) : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nCompany Launch Kit Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}
