/**
 * Business Assets OS verification: tsc, lint, route, nav, middleware,
 * panels, company profile, service catalog, exports, schemas, design-os,
 * brand-os bridge, document library, signature pad, API routes, regression.
 * Run: node scripts/verify-business-assets.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "business-assets");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 300) : "");

const routePath = join(root, "app", "(shell)", "business-assets", "page.tsx");
const routeSource = readSafe(routePath);
pass("route:page_exists", existsSync(routePath));
pass("route:exports_BusinessAssetsPage", routeSource.includes("BusinessAssetsPage"));

const routesSource = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:routes_ts_businessAssets", routesSource.includes('businessAssets: "/business-assets"'));

const navSource = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Business_Assets_label", navSource.includes("Business Assets"));
pass("nav:Briefcase_icon", navSource.includes("Briefcase"));
pass("nav:businessAssets_route", navSource.includes("ROUTES.businessAssets"));

const middlewareSource = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:businessAssets_protected", middlewareSource.includes("ROUTES.businessAssets"));

const panels = [
    "CompanyProfilePanel",
    "ServiceCatalogPanel",
    "ProposalGeneratorPanel",
    "QuotationGeneratorPanel",
    "InvoiceGeneratorPanel",
    "SowGeneratorPanel",
    "NdaGeneratorPanel",
    "ClientAgreementPanel",
    "MaintenanceAgreementPanel",
    "DocumentLibraryPanel",
];

for (const panel of panels) {
    pass(`panel:${panel}`, existsSync(join(modRoot, "components", "panels", `${panel}.tsx`)));
}

const profileSource = readSafe(join(modRoot, "data", "company-profile.ts"));
const profileSections = [
    "company-overview",
    "mission",
    "vision",
    "core-values",
    "founder-message",
    "why-us",
    "industries",
    "services",
    "technology-stack",
    "methodology",
    "delivery-process",
    "support-model",
    "contact-information",
];

for (const section of profileSections) {
    pass(`company_profile:section:${section}`, profileSource.includes(`id: "${section}"`));
}

const catalogSource = readSafe(join(modRoot, "data", "services-catalog.ts"));
const serviceIds = [
    "platform-implementation",
    "industry-pack-deployment",
    "ai-worker-integration",
    "enterprise-consulting",
    "managed-support",
];
const serviceFields = ["overview", "benefits", "deliverables", "timeline", "pricingPlaceholder", "industries", "technology", "faq"];

for (const id of serviceIds) {
    pass(`catalog:service:${id}`, catalogSource.includes(`id: "${id}"`));
}
for (const field of serviceFields) {
    pass(`catalog:field:${field}`, catalogSource.includes(field));
}

pass("lib:export_pdf", existsSync(join(modRoot, "lib", "export-pdf.ts")));
pass("lib:export_docx", existsSync(join(modRoot, "lib", "export-docx.ts")));
pass("lib:document_library", existsSync(join(modRoot, "lib", "document-library.ts")));
pass("lib:brand_os_bridge", existsSync(join(modRoot, "lib", "brand-os-bridge.ts")));
pass("lib:validation", existsSync(join(modRoot, "lib", "validation.ts")));
pass("schemas:index", existsSync(join(modRoot, "schemas", "index.ts")));

const pageSource = readSafe(join(modRoot, "components", "BusinessAssetsPage.tsx"));
pass("ui:design_os_Card", pageSource.includes("@/src/design-os/components/Card"));
pass("ui:design_os_Button", pageSource.includes("@/src/design-os") || pageSource.includes("design-os"));
pass("ui:PageTransition", pageSource.includes("PageTransition"));
pass("ui:StaggerReveal", pageSource.includes("StaggerReveal"));
pass("ui:Tabs", pageSource.includes("Tabs"));

const bridgeSource = readSafe(join(modRoot, "lib", "brand-os-bridge.ts"));
pass("bridge:readBrandOsContent", bridgeSource.includes("readBrandOsContent"));
pass("bridge:BRAND_OS_CONTENT_PATHS", bridgeSource.includes("BRAND_OS_CONTENT_PATHS"));

pass("shared:SignaturePad", existsSync(join(modRoot, "components", "shared", "SignaturePad.tsx")));
pass("shared:ExportActions", existsSync(join(modRoot, "components", "shared", "ExportActions.tsx")));
pass("shared:LineItemsEditor", existsSync(join(modRoot, "components", "shared", "LineItemsEditor.tsx")));

pass("hook:useBusinessAssets", existsSync(join(modRoot, "hooks", "useBusinessAssets.ts")));
pass("service:business_assets_service", existsSync(join(modRoot, "services", "business-assets.service.ts")));
pass("sdk:createBusinessAssetsClient", readSafe(join(modRoot, "sdk", "index.ts")).includes("createBusinessAssetsClient"));

pass("api:pdf_route", existsSync(join(root, "app", "api", "business-assets", "export", "pdf", "route.ts")));
pass("api:docx_route", existsSync(join(root, "app", "api", "business-assets", "export", "docx", "route.ts")));

pass("package:business_assets_verify", readSafe(join(root, "package.json")).includes('"business-assets:verify"'));

const brandOsVerify = spawnSync("npm", ["run", "brand-os:verify"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:brand_os_verify", brandOsVerify.status === 0, brandOsVerify.status !== 0 ? "brand-os verify failed" : "");

const designOsVerify = spawnSync("npm", ["run", "design-os:verify"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:design_os_verify", designOsVerify.status === 0, designOsVerify.status !== 0 ? "design-os verify failed" : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nBusiness Assets OS Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}
