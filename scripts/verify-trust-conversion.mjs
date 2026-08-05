/**
 * Trust & Conversion module verification.
 * Run: npm run verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const moduleRoot = join(root, "src", "modules", "trust-conversion");
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

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const dataSource = readSafe(join(moduleRoot, "data", "trust-conversion-content.ts"));
pass("data:trusted_by", dataSource.includes("TRUSTED_BY_CONTENT"));
pass("data:why_arjun", dataSource.includes("WHY_ARJUN_CONTENT"));
pass("data:delivery_process", dataSource.includes("DELIVERY_PROCESS_CONTENT"));
pass("data:services_preview", dataSource.includes("SERVICES_PREVIEW_CONTENT"));
pass("data:trust_metrics", dataSource.includes("TRUST_METRICS_CONTENT"));

pass("data:8_value_cards", (dataSource.match(/WHY_ARJUN_CONTENT[\s\S]*?cards: \[/) || []).length === 1 && dataSource.includes("Dedicated Support"));
pass("data:9_process_steps", dataSource.includes('title: "Support"') && dataSource.includes("step: 9"));
pass("data:9_services", dataSource.includes("AI Automation") && dataSource.includes("Maintenance"));
pass("data:6_trust_metrics", dataSource.includes("Transparent Communication"));

const sections = [
    "TrustedBySection",
    "WhyArjunSection",
    "DeliveryProcessSection",
    "ServicesPreviewSection",
    "TrustMetricsSection",
];

for (const section of sections) {
    pass(`section:${section}`, existsSync(join(moduleRoot, "components", "sections", `${section}.tsx`)));
}

pass("component:TrustConversionModule", existsSync(join(moduleRoot, "components", "TrustConversionModule.tsx")));
pass("component:TrustCounter", existsSync(join(moduleRoot, "components", "ui", "TrustCounter.tsx")));
pass("styles:trust_conversion_css", existsSync(join(moduleRoot, "styles", "trust-conversion.css")));

const cssSource = readSafe(join(moduleRoot, "styles", "trust-conversion.css"));
pass("a11y:reduced_motion", cssSource.includes("prefers-reduced-motion"));
pass("perf:css_hover", cssSource.includes(".tc-card:hover"));
pass("perf:css_reveal", cssSource.includes(".tc-reveal"));

const moduleSource = readSafe(join(moduleRoot, "components", "TrustConversionModule.tsx"));
for (const section of sections) {
    pass(`module:includes_${section}`, moduleSource.includes(section));
}

const homeSource = readSafe(join(root, "src", "modules", "company-launch-kit", "components", "premium", "PremiumHomePage.tsx"));
pass("homepage:TrustConversionModule", homeSource.includes("TrustConversionModule"));

const trustedBySource = readSafe(join(moduleRoot, "components", "sections", "TrustedBySection.tsx"));
pass("trusted_by:logo_wall", trustedBySource.includes("clientLogos"));
pass("trusted_by:industries", trustedBySource.includes("industries"));
pass("trusted_by:technologies", trustedBySource.includes("technologies"));
pass("trusted_by:badges", trustedBySource.includes("badges"));
pass("trusted_by:counters", trustedBySource.includes("counters.map"));

const whySource = readSafe(join(moduleRoot, "components", "sections", "WhyArjunSection.tsx"));
pass("why_arjun:8_cards", (whySource.match(/<li key=/g) || []).length >= 1);

const deliverySource = readSafe(join(moduleRoot, "components", "sections", "DeliveryProcessSection.tsx"));
pass("delivery:desktop_timeline", deliverySource.includes("lg:grid-cols-9"));
pass("delivery:mobile_cards", deliverySource.includes("lg:hidden"));

const servicesSource = readSafe(join(moduleRoot, "components", "sections", "ServicesPreviewSection.tsx"));
pass("services:cta_links", servicesSource.includes("service.cta.href"));
pass("services:benefits", servicesSource.includes("service.benefits"));

const counterSource = readSafe(join(moduleRoot, "components", "ui", "TrustCounter.tsx"));
pass("counter:no_framer_motion", !counterSource.includes('from "framer-motion"'));

const premiumVerify = spawnVerify(root, "scripts/verify-premium-website.mjs");
pass("regression:premium_website", premiumVerify.status === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nTrust & Conversion Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}
