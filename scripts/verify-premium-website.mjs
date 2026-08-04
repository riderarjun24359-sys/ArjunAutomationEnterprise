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

const heroSource = readSafe(join(premiumRoot, "sections", "PremiumHero.tsx"));
pass("hero:particles", heroSource.includes("ParticleField"));
pass("hero:mesh", heroSource.includes("GradientMesh"));
pass("hero:stats", heroSource.includes("AnimatedCounter"));

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
for (const section of homeSections) {
    pass(`homepage:includes_${section}`, homePageSource.includes(section));
}

const layoutSource = readSafe(join(moduleRoot, "components", "MarketingLayout.tsx"));
pass("layout:PremiumHeader", layoutSource.includes("PremiumHeader"));
pass("layout:PremiumFooter", layoutSource.includes("PremiumFooter"));
pass("layout:ScrollProgress", layoutSource.includes("ScrollProgress"));
pass("layout:CursorGlow", layoutSource.includes("CursorGlow"));
pass("layout:PageTransition", layoutSource.includes("PageTransition"));
pass("layout:premium_theme", layoutSource.includes("premium-theme"));

const marketingLayoutSource = readSafe(join(root, "app", "(marketing)", "layout.tsx"));
pass("marketing:imports_premium_css", marketingLayoutSource.includes("premium.css"));
pass("marketing:display_font", marketingLayoutSource.includes("Syne") || marketingLayoutSource.includes("--font-syne"));

const pageSource = readSafe(join(root, "app", "(marketing)", "page.tsx"));
pass("page:PremiumHomePage", pageSource.includes("PremiumHomePage"));
pass("page:metadata", pageSource.includes("export const metadata"));
pass("page:JsonLd", pageSource.includes("JsonLd"));

pass("page:about_PremiumPageShell", readSafe(join(root, "app", "(marketing)", "about", "page.tsx")).includes("PremiumPageShell"));
pass("page:services_PremiumPageShell", readSafe(join(root, "app", "(marketing)", "services", "page.tsx")).includes("PremiumPageShell"));
pass("page:contact_PremiumPageShell", readSafe(join(root, "app", "(marketing)", "contact", "page.tsx")).includes("PremiumPageShell"));

pass("layout:dynamic_ssr_false", layoutSource.includes("ssr: false"));

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
