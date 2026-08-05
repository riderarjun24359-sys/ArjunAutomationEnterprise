/**
 * Public Website v1.0 verification — all production pages, SEO, services, case studies.
 * Run: node scripts/verify-public-website.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

const publicPages = [
    "app/(marketing)/page.tsx",
    "app/(marketing)/about/page.tsx",
    "app/(marketing)/services/page.tsx",
    "app/(marketing)/services/[slug]/page.tsx",
    "app/(marketing)/industries/page.tsx",
    "app/(marketing)/case-studies/page.tsx",
    "app/(marketing)/case-studies/[slug]/page.tsx",
    "app/(marketing)/portfolio/page.tsx",
    "app/(marketing)/portfolio/[slug]/page.tsx",
    "app/(marketing)/pricing/page.tsx",
    "app/(marketing)/faq/page.tsx",
    "app/(marketing)/resources/page.tsx",
    "app/(marketing)/contact/page.tsx",
    "app/(marketing)/privacy/page.tsx",
    "app/(marketing)/terms/page.tsx",
    "app/(marketing)/search/page.tsx",
    "app/(marketing)/sitemap/page.tsx",
    "app/not-found.tsx",
];

for (const page of publicPages) {
    pass(`page:${page.replace(/[()/[\]]/g, "_")}`, existsSync(join(root, page)));
}

const servicesSource = readFileSync(join(root, "src/modules/company-launch-kit/data/services.ts"), "utf8");
const requiredServiceSlugs = [
    "platform-implementation",
    "industry-pack-deployment",
    "ai-worker-integration",
    "enterprise-consulting",
    "managed-support",
];

for (const slug of requiredServiceSlugs) {
    pass(`service:slug:${slug}`, servicesSource.includes(`slug: "${slug}"`));
    pass(
        `service:complete:${slug}`,
        servicesSource.includes(`slug: "${slug}"`) &&
            servicesSource.includes("problems:") &&
            servicesSource.includes("process:") &&
            servicesSource.includes("technologies:") &&
            servicesSource.includes("faqs:"),
    );
}

const caseStudiesSource = readFileSync(join(root, "src/modules/company-launch-kit/data/case-studies.ts"), "utf8");
pass("case-studies:data", caseStudiesSource.includes("implementation:") && caseStudiesSource.includes("businessImpact:"));

const pricingSource = readFileSync(join(root, "src/modules/company-launch-kit/data/pricing.ts"), "utf8");
pass("pricing:tiers", pricingSource.includes("IMPLEMENTATION_TIERS") && pricingSource.includes("ENTERPRISE_ENGAGEMENT"));

const seoSource = readFileSync(join(root, "src/lib/seo.ts"), "utf8");
pass("seo:breadcrumbs", seoSource.includes("buildBreadcrumbJsonLd"));
pass("seo:faq", seoSource.includes("buildFaqJsonLd"));
pass("seo:service", seoSource.includes("buildServiceJsonLd"));

const routesSource = readFileSync(join(root, "src/modules/company-launch-kit/config/routes.ts"), "utf8");
for (const route of ["pricing", "faq", "resources", "search", "sitemap", "serviceItem", "caseStudyItem"]) {
    pass(`routes:${route}`, routesSource.includes(route));
}

const navSource = readFileSync(join(root, "src/modules/company-launch-kit/data/home-content.ts"), "utf8");
pass("nav:pricing", navSource.includes("MARKETING_ROUTES.pricing"));
pass("nav:resources", navSource.includes("MARKETING_ROUTES.resources"));

const sitemapSource = readFileSync(join(root, "app/sitemap.ts"), "utf8");
pass("sitemap:pricing", sitemapSource.includes("MARKETING_ROUTES.pricing"));
pass("sitemap:services", sitemapSource.includes("SERVICE_ITEMS"));

pass("component:breadcrumbs", existsSync(join(root, "src/modules/company-launch-kit/components/MarketingBreadcrumbs.tsx")));
pass("component:structured-data", existsSync(join(root, "src/modules/company-launch-kit/components/MarketingStructuredData.tsx")));
pass("component:faq-static", existsSync(join(root, "src/modules/company-launch-kit/components/FaqAccordionStatic.tsx")));
pass("data:search-index", existsSync(join(root, "src/modules/company-launch-kit/data/search-index.ts")));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nPublic Website v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) {
    process.exit(1);
}

const chain = spawnVerify(root, "scripts/verify-premium-website.mjs");
if (chain.status !== 0) {
    console.error("\nChained premium-website verify failed.");
    if (chain.stderr) console.error(chain.stderr.slice(-500));
}
process.exit(chain.status ?? 1);
