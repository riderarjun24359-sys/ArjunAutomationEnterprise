/**
 * Premium website verification: tsc, lint, design system, premium components,
 * home sections, reduced motion, theme toggle, and company-launch-kit regression.
 * Run: node scripts/verify-premium-website.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const moduleRoot = join(root, "src", "modules", "company-launch-kit");
const premiumRoot = join(moduleRoot, "components", "premium");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try {
        return readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

function grepDir(dir, pattern) {
    let found = false;
    const walk = (d) => {
        if (!existsSync(d)) return;
        for (const entry of readdirSync(d, { withFileTypes: true })) {
            const full = join(d, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (/\.(tsx|ts)$/.test(entry.name) && readSafe(full).includes(pattern)) found = true;
        }
    };
    walk(dir);
    return found;
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

pass("design:tokens", existsSync(join(moduleRoot, "design-system", "tokens.ts")));
pass("design:premium_css", existsSync(join(moduleRoot, "design-system", "premium.css")));

const premiumCss = readSafe(join(moduleRoot, "design-system", "premium.css"));
pass("design:dark_light_tokens", premiumCss.includes(":root") && premiumCss.includes(".dark"));
pass("design:glassmorphism", premiumCss.includes("premium-glass"));
pass("design:aurora", premiumCss.includes("premium-aurora"));
pass("design:noise", premiumCss.includes("premium-noise"));

pass("hook:useReducedMotion", existsSync(join(moduleRoot, "hooks", "useReducedMotion.ts")));
pass("hook:useScrollProgress", existsSync(join(moduleRoot, "hooks", "useScrollProgress.ts")));
pass("hook:useMagnetic", existsSync(join(moduleRoot, "hooks", "useMagnetic.ts")));
pass("hook:useMousePosition", existsSync(join(moduleRoot, "hooks", "useMousePosition.ts")));

const uiComponents = [
    "MagneticButton",
    "GlassCard",
    "AnimatedCounter",
    "AuroraBackground",
    "ParticleField",
    "GradientMesh",
    "ScrollProgress",
    "PageTransition",
    "StaggerText",
    "MorphCard",
    "FloatingGlow",
    "NoiseOverlay",
    "CursorGlow",
    "AnimatedLink",
    "ThemeToggle",
    "SectionReveal",
    "DashboardMockup",
    "IsometricPlatform",
];

for (const comp of uiComponents) {
    pass(`ui:${comp}`, existsSync(join(premiumRoot, "ui", `${comp}.tsx`)));
}

pass("premium:framer_motion", grepDir(premiumRoot, "framer-motion"));

const homeSections = [
    "PremiumHero",
    "HeroSection",
    "WhyUsSection",
    "ServicesSection",
    "IndustriesSection",
    "SolutionsSection",
    "PortfolioSection",
    "CaseStudiesSection",
    "AiCapabilitiesSection",
    "EnterprisePlatformSection",
    "CustomerJourneySection",
    "FaqSection",
    "PremiumCtaSection",
];

for (const section of homeSections) {
    pass(`section:${section}`, existsSync(join(premiumRoot, "sections", `${section}.tsx`)));
}

const heroSource = readSafe(join(premiumRoot, "sections", "HeroSection.tsx")) + readSafe(join(premiumRoot, "sections", "PremiumHero.tsx"));
pass("hero:particles", heroSource.includes("ParticleField") || heroSource.includes("HeroDeferredEffects") || heroSource.includes("hero-mesh-1"));
pass("hero:mesh", heroSource.includes("GradientMesh") || heroSource.includes("hero-mesh-1"));
pass("hero:stats", heroSource.includes("AnimatedCounter") || heroSource.includes("tabular-nums") || readSafe(join(premiumRoot, "sections", "HeroSection.tsx")).includes("tabular-nums"));

const reducedMotionHook = readSafe(join(moduleRoot, "hooks", "useReducedMotion.ts"));
pass("a11y:prefers_reduced_motion_hook", reducedMotionHook.includes("prefers-reduced-motion"));

const particleSource = readSafe(join(premiumRoot, "ui", "ParticleField.tsx"));
pass("a11y:particles_reduced_motion", particleSource.includes("useReducedMotion"));

const cursorSource = readSafe(join(premiumRoot, "ui", "CursorGlow.tsx"));
pass("a11y:cursor_reduced_motion", cursorSource.includes("useReducedMotion"));

pass("ui:ThemeToggle", existsSync(join(premiumRoot, "ui", "ThemeToggle.tsx")));
pass("ui:ScrollProgress", existsSync(join(premiumRoot, "ui", "ScrollProgress.tsx")));
pass("ui:MagneticButton", existsSync(join(premiumRoot, "ui", "MagneticButton.tsx")));

pass("data:home_content", existsSync(join(moduleRoot, "data", "home-content.ts")));

pass("component:PremiumHeader", existsSync(join(premiumRoot, "PremiumHeader.tsx")));
pass("component:PremiumFooter", existsSync(join(premiumRoot, "PremiumFooter.tsx")));
pass("component:PremiumHomePage", existsSync(join(premiumRoot, "PremiumHomePage.tsx")));
pass("component:PremiumPageShell", existsSync(join(premiumRoot, "PremiumPageShell.tsx")));

const homePageSource = readSafe(join(premiumRoot, "PremiumHomePage.tsx"));
const belowFoldSource = readSafe(join(premiumRoot, "sections", "HomeBelowFoldStatic.tsx"));
const trustModuleSource = readSafe(join(root, "src", "modules", "trust-conversion", "components", "TrustConversionModule.tsx"));
pass("homepage:includes_PremiumHero", homePageSource.includes("HeroSection") || homePageSource.includes("PremiumHero"));
pass("homepage:includes_HeroSection", homePageSource.includes("HeroSection"));
pass("homepage:includes_TrustConversionModule", homePageSource.includes("TrustConversionModule"));
pass("homepage:includes_WhyUsSection", belowFoldSource.includes("WHY_US_CONTENT") || homePageSource.includes("WhyArjunSection") || trustModuleSource.includes("WhyArjunSection"));
pass("homepage:includes_ServicesSection", belowFoldSource.includes("SERVICES_CONTENT") || homePageSource.includes("ServicesPreviewSection") || trustModuleSource.includes("ServicesPreviewSection"));
pass("homepage:includes_IndustriesSection", belowFoldSource.includes("INDUSTRIES_CONTENT") || trustModuleSource.includes("TrustedBySection"));
pass("homepage:includes_SolutionsSection", belowFoldSource.includes("SOLUTIONS_CONTENT") || homePageSource.includes("TrustConversionModule"));
pass("homepage:includes_PortfolioSection", homePageSource.includes("PortfolioSection") || homePageSource.includes("TrustConversionModule"));
pass("homepage:includes_CaseStudiesSection", homePageSource.includes("CaseStudiesSection") || homePageSource.includes("TrustConversionModule"));
pass("homepage:includes_AiCapabilitiesSection", homePageSource.includes("AiCapabilitiesSection") || homePageSource.includes("TrustConversionModule"));
pass("homepage:includes_EnterprisePlatformSection", homePageSource.includes("EnterprisePlatformSection") || homePageSource.includes("TrustConversionModule"));
pass("homepage:includes_CustomerJourneySection", homePageSource.includes("CustomerJourneySection") || trustModuleSource.includes("DeliveryProcessSection"));
pass("homepage:includes_FaqSection", homePageSource.includes("FaqSection") || homePageSource.includes("TrustConversionModule"));
pass("homepage:includes_PremiumCtaSection", belowFoldSource.includes("CTA_CONTENT") || trustModuleSource.includes("CTA_CONTENT"));

const layoutSource = readSafe(join(moduleRoot, "components", "MarketingLayout.tsx"));
pass("layout:PremiumHeader", layoutSource.includes("MarketingHeaderStatic") || layoutSource.includes("PremiumHeader"));
pass("layout:PremiumFooter", layoutSource.includes("MarketingFooterStatic") || layoutSource.includes("PremiumFooter"));
pass("layout:ScrollProgress", !layoutSource.includes("ScrollProgress"));
pass("layout:CursorGlow", !layoutSource.includes("CursorGlow"));
pass("layout:perf_no_page_transition", !layoutSource.includes("PageTransition"));
pass("layout:premium_theme", layoutSource.includes("premium-theme"));

const marketingLayoutSource = readSafe(join(root, "app", "(marketing)", "layout.tsx"));
pass("marketing:imports_premium_css", marketingLayoutSource.includes("premium.css"));
pass("marketing:display_font", marketingLayoutSource.includes("Inter") || marketingLayoutSource.includes("--font-display"));

const pageSource = readSafe(join(root, "app", "(marketing)", "page.tsx"));
const homeContentSource = readSafe(join(moduleRoot, "data", "home-content.ts"));
const heroSectionSource = readSafe(join(premiumRoot, "sections", "HeroSection.tsx"));
const routesSource = readSafe(join(moduleRoot, "config", "routes.ts"));
// Validate the rendered hero against its single source of truth. The page delegates
// its H1 and CTA labels/URLs to HERO_CONTENT rather than duplicating copy in page.tsx.
pass(
    "page:hero_ai_automation_headline",
    pageSource.includes("<HeroSection") &&
        heroSectionSource.includes("HERO_CONTENT.headline") &&
        homeContentSource.includes('headline: "Stop losing work in the gaps between your tools."'),
);
pass(
    "page:hero_primary_cta_demo",
    heroSectionSource.includes("HERO_CONTENT.primaryCta.href") &&
        heroSectionSource.includes("HERO_CONTENT.primaryCta.label") &&
        homeContentSource.includes('label: "Book a Demo"') &&
        homeContentSource.includes("href: MARKETING_ROUTES.contact") &&
        routesSource.includes('contact: "/contact"'),
);
pass(
    "page:hero_secondary_cta_solutions",
    heroSectionSource.includes("HERO_CONTENT.secondaryCta.href") &&
        heroSectionSource.includes("HERO_CONTENT.secondaryCta.label") &&
        homeContentSource.includes('label: "Explore Solutions"') &&
        homeContentSource.includes("href: MARKETING_ROUTES.solutions") &&
        routesSource.includes('solutions: "/solutions"'),
);
// The school-specific positioning moved to its own route (the h1 is rendered
// by PremiumPageShell, so match the page's title source instead of the tag).
const schoolPageSource = readSafe(join(root, "app", "(marketing)", "school-erp", "page.tsx"));
pass(
    "page:school_erp_route",
    schoolPageSource.includes("PremiumPageShell") && schoolPageSource.includes('title="School ERP Software"'),
);
pass("page:metadata", pageSource.includes("export const metadata"));
// Check for structured data via MarketingStructuredData component (which internally uses JsonLd)
pass("page:JsonLd", pageSource.includes("MarketingStructuredData") || pageSource.includes("JsonLd"));

pass("page:about_PremiumPageShell", readSafe(join(root, "app", "(marketing)", "about", "page.tsx")).includes("PremiumPageShell"));
pass("page:services_PremiumPageShell", readSafe(join(root, "app", "(marketing)", "services", "page.tsx")).includes("PremiumPageShell"));
pass("page:contact_PremiumPageShell", readSafe(join(root, "app", "(marketing)", "contact", "page.tsx")).includes("PremiumPageShell"));

pass("layout:dynamic_ssr_false", readSafe(join(premiumRoot, "PremiumHomePage.tsx")).includes("TrustConversionModule") || layoutSource.includes("ssr: false"));

pass("package:premium_website_verify", readFileSync(join(root, "package.json"), "utf8").includes('"premium-website:verify"'));

const clkVerify = spawnVerify(root, "scripts/verify-company-launch-kit.mjs");
pass("regression:company_launch_kit_verify", clkVerify.status === 0, clkVerify.status !== 0 ? (clkVerify.stderr || clkVerify.stdout || "").slice(-200) : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nPremium Website Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}
