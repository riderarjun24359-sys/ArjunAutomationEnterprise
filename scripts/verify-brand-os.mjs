/**
 * Arjun Automation Brand OS verification: regression, route, nav, middleware,
 * content completeness, brand book sections, asset folders, service library, and sales kit.
 * Run: node scripts/verify-brand-os.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const moduleRoot = join(root, "src", "modules", "brand-os");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const routePath = join(root, "app", "(shell)", "brand-os", "page.tsx");
const routeSource = existsSync(routePath) ? readFileSync(routePath, "utf8") : "";
pass("route:page_exists", existsSync(routePath));
pass("route:exports_BrandOsPage", routeSource.includes("BrandOsPage"));

const routesPath = join(root, "src", "constants", "routes.ts");
const routesSource = existsSync(routesPath) ? readFileSync(routesPath, "utf8") : "";
pass("route:routes_ts_brandOs", routesSource.includes('brandOs: "/brand-os"'));

const navPath = join(root, "src", "config", "shell-navigation.ts");
const navSource = existsSync(navPath) ? readFileSync(navPath, "utf8") : "";
pass("nav:Brand_OS_label", navSource.includes('"Brand OS"') || navSource.includes("'Brand OS'") || navSource.includes("Brand OS"));
pass("nav:Palette_icon", navSource.includes("Palette"));
pass("nav:brandOs_route", navSource.includes("ROUTES.brandOs"));

const middlewarePath = join(root, "src", "middleware", "auth.ts");
const middlewareSource = existsSync(middlewarePath) ? readFileSync(middlewarePath, "utf8") : "";
pass("middleware:brandOs_protected", middlewareSource.includes("ROUTES.brandOs"));

const contentFiles = [
    "content/brand-book.md",
    "content/visual-identity.md",
    "content/company-profile.md",
    "content/services/index.md",
    "content/services/platform-implementation.md",
    "content/services/industry-pack-deployment.md",
    "content/services/ai-worker-integration.md",
    "content/services/enterprise-consulting.md",
    "content/services/managed-support.md",
    "content/sales-kit/proposal-template.md",
    "content/sales-kit/quotation-template.md",
    "content/sales-kit/statement-of-work.md",
    "content/sales-kit/client-onboarding-checklist.md",
    "content/sales-kit/discovery-questionnaire.md",
    "content/sales-kit/faq.md",
    "content/sales-kit/email-templates.md",
];

for (const file of contentFiles) {
    pass(`content:${file.replace(/\//g, "_")}`, existsSync(join(moduleRoot, file)));
}

const brandBookPath = join(moduleRoot, "content", "brand-book.md");
const brandBookContent = existsSync(brandBookPath) ? readFileSync(brandBookPath, "utf8") : "";

const requiredSections = [
    "Company Story",
    "Mission",
    "Vision",
    "Core Values",
    "Brand Promise",
    "Positioning Statement",
    "UVP",
    "Target Audience",
    "Industries Served",
    "Customer Personas",
    "Brand Personality",
    "Tone of Voice",
    "Writing Guidelines",
    "Messaging Framework",
    "Elevator Pitch",
    "Tagline Options",
    "Brand Do's",
    "Brand Don'ts",
];

for (const section of requiredSections) {
    const pattern = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im");
    pass(`brand_book:section:${section.replace(/[^a-zA-Z0-9]+/g, "_")}`, pattern.test(brandBookContent));
}

const serviceFields = ["Description", "Problems Solved", "Deliverables", "Benefits", "Timeline", "Ideal Customer", "Pricing Structure"];
const serviceFiles = [
    "platform-implementation.md",
    "industry-pack-deployment.md",
    "ai-worker-integration.md",
    "enterprise-consulting.md",
    "managed-support.md",
];

for (const file of serviceFiles) {
    const serviceContent = readFileSync(join(moduleRoot, "content", "services", file), "utf8");
    for (const field of serviceFields) {
        const pattern = new RegExp(`^##\\s+${field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im");
        pass(`service:${file.replace(".md", "")}:${field.replace(/[^a-zA-Z0-9]+/g, "_")}`, pattern.test(serviceContent));
    }
}

const salesKitFiles = [
    "proposal-template.md",
    "quotation-template.md",
    "statement-of-work.md",
    "client-onboarding-checklist.md",
    "discovery-questionnaire.md",
    "faq.md",
    "email-templates.md",
];

for (const file of salesKitFiles) {
    pass(`sales_kit:${file.replace(".md", "")}`, existsSync(join(moduleRoot, "content", "sales-kit", file)));
}

const assetFolders = ["logos", "icons", "fonts", "social", "templates", "presentations", "proposals", "backgrounds", "illustrations"];
for (const folder of assetFolders) {
    const folderPath = join(moduleRoot, "brand-assets", folder);
    pass(`assets:folder:${folder}`, existsSync(folderPath));
    pass(`assets:readme:${folder}`, existsSync(join(folderPath, "README.md")));
}

const moduleFiles = [
    "index.ts",
    "constants/index.ts",
    "types/index.ts",
    "lib/documents.ts",
    "lib/completeness.ts",
    "components/BrandOsPage.tsx",
    "components/BrandOsOverview.tsx",
    "components/BrandOsDocPanel.tsx",
    "sdk/index.ts",
];

for (const file of moduleFiles) {
    pass(`module:${file.replace(/\//g, "_")}`, existsSync(join(moduleRoot, file)));
}

const constantsSource = readFileSync(join(moduleRoot, "constants", "index.ts"), "utf8");
pass("module:BRAND_OS_TABS", constantsSource.includes("BRAND_OS_TABS"));
// Brand theme moved from indigo to orange in e3e366d (unify colour system).
pass("module:BRAND_OS_THEME_orange", constantsSource.includes("orange-500") && constantsSource.includes("orange-600"));
pass("module:BRAND_OS_PERMISSIONS", constantsSource.includes("BRAND_OS_PERMISSIONS"));
pass("module:document_registry", constantsSource.includes("BRAND_OS_DOCUMENT_REGISTRY") || constantsSource.includes("BRAND_DOCUMENTS"));

const sdkSource = readFileSync(join(moduleRoot, "sdk", "index.ts"), "utf8");
pass("sdk:createBrandOsClient", sdkSource.includes("createBrandOsClient"));
pass("sdk:getDocuments", sdkSource.includes("getDocuments"));
pass("sdk:verifyBrandBookCompleteness", sdkSource.includes("verifyBrandBookCompleteness"));

const completenessSource = readFileSync(join(moduleRoot, "lib", "completeness.ts"), "utf8");
pass("lib:BRAND_BOOK_REQUIRED_SECTIONS", completenessSource.includes("BRAND_BOOK_REQUIRED_SECTIONS"));
pass("lib:verifyBrandBookCompleteness", completenessSource.includes("verifyBrandBookCompleteness"));

const docPanelSource = readFileSync(join(moduleRoot, "components", "BrandOsDocPanel.tsx"), "utf8");
pass("ui:markdown_viewer", docPanelSource.includes("renderMarkdown"));
pass("ui:print_pdf_hint", docPanelSource.includes("Print") && docPanelSource.includes("PDF"));

const apiRoutePath = join(root, "app", "api", "brand-os", "documents", "[slug]", "route.ts");
pass("api:document_route", existsSync(apiRoutePath));

pass("package:brand_os_verify_script", readFileSync(join(root, "package.json"), "utf8").includes('"brand-os:verify"'));

const identityDocs = [
    "content/enterprise-brand-book-v1.md",
    "content/logo-system.md",
    "content/brand-applications.md",
    "content/digital-design-language.md",
];
for (const file of identityDocs) {
    pass(`identity:${file.replace(/\//g, "_")}`, existsSync(join(moduleRoot, file)));
}

const logoFiles = [
    "primary-horizontal.svg",
    "secondary-horizontal.svg",
    "primary-vertical.svg",
    "symbol-only.svg",
    "monogram.svg",
    "monochrome-white.svg",
    "monochrome-indigo.svg",
    "app-icon.svg",
    "favicon.svg",
];
for (const file of logoFiles) {
    pass(`logo:${file.replace(".svg", "")}`, existsSync(join(moduleRoot, "brand-assets", "logos", file)));
}

pass("public:brand_logos", existsSync(join(root, "public", "brand", "logos", "symbol-only.svg")));
pass("public:favicon", existsSync(join(root, "app", "icon.svg")));
pass("component:BrandLogo", existsSync(join(moduleRoot, "components", "BrandLogo.tsx")));
pass("identity:tokens", existsSync(join(moduleRoot, "identity", "tokens.ts")));

const brandLogoSource = readSafe(join(moduleRoot, "components", "BrandLogo.tsx"));
pass("brand_logo:BrandSymbol", brandLogoSource.includes("BrandSymbol"));
pass("brand_logo:variants", brandLogoSource.includes("secondary"));

const headerSource = readSafe(join(root, "src", "modules", "company-launch-kit", "components", "MarketingHeaderStatic.tsx"));
pass("marketing:uses_BrandLogo", headerSource.includes("BrandLogo"));
pass("marketing:no_AA_placeholder", !headerSource.includes(">AA<"));

const enterpriseBook = readSafe(join(moduleRoot, "content", "enterprise-brand-book-v1.md"));
pass("identity:vertex_arc_mark", enterpriseBook.includes("Vertex Arc Mark"));
pass("identity:phase_strategy", enterpriseBook.includes("Brand Strategy"));
pass("identity:phase_logo", enterpriseBook.includes("Logo System"));
pass("identity:phase_visual", enterpriseBook.includes("Visual Language"));
pass("identity:phase_applications", enterpriseBook.includes("Brand Applications"));
pass("identity:phase_digital", enterpriseBook.includes("Digital Design Language"));

const templates = ["business-card.svg", "letterhead.svg", "proposal-cover.svg", "invoice-header.svg"];
for (const file of templates) {
    pass(`template:${file.replace(".svg", "")}`, existsSync(join(moduleRoot, "brand-assets", "templates", file)));
}

pass("social:linkedin_banner", existsSync(join(moduleRoot, "brand-assets", "social", "linkedin-banner.svg")));
pass("social:avatar", existsSync(join(moduleRoot, "brand-assets", "social", "social-avatar.svg")));
pass("public:og_default", existsSync(join(root, "public", "launch-kit", "og-default.svg")));

function readSafe(path) {
    try {
        return readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nBrand OS Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}
