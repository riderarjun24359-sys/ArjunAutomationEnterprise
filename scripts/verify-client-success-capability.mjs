/**
 * Client Success Capability verification: tsc, lint, route, nav, middleware,
 * 10 panels, mission-core, gci, bridges, service methods, design-os, gci selector,
 * ai-delivery-model regression, design-os structural checks.
 * Run: node scripts/verify-client-success-capability.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "client-success-capability");
const missionRoot = join(root, "src", "modules", "mission-core");
const gciRoot = join(root, "src", "modules", "gci");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 300) : "");

const routePath = join(root, "app", "(shell)", "client-success", "page.tsx");
const routeSource = readSafe(routePath);
pass("route:page_exists", existsSync(routePath));
pass("route:exports_ClientSuccessCapabilityPage", routeSource.includes("ClientSuccessCapabilityPage"));

const routesSource = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:routes_ts_clientSuccess", routesSource.includes('clientSuccess: "/client-success"'));

const navSource = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Client_Success_label", navSource.includes("Client Success"));
pass("nav:HeartHandshake_icon", navSource.includes("HeartHandshake"));
pass("nav:clientSuccess_route", navSource.includes("ROUTES.clientSuccess"));
pass("nav:primary_section", /Client Success[\s\S]*section:\s*"primary"/.test(navSource));

const middlewareSource = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:clientSuccess_protected", middlewareSource.includes("ROUTES.clientSuccess"));

const panels = [
    "AiOnboardingPanel",
    "ProjectWorkspacePanel",
    "ClientPortalPanel",
    "CommunicationCenterPanel",
    "ApprovalCenterPanel",
    "ChangeRequestCenterPanel",
    "DeliveryCenterPanel",
    "CustomerHealthPanel",
    "RenewalGrowthPanel",
    "AiSuccessManagerPanel",
];

for (const panel of panels) {
    pass(`panel:${panel}`, existsSync(join(modRoot, "components", "panels", `${panel}.tsx`)));
}

pass("mission-core:types", existsSync(join(missionRoot, "types", "index.ts")));
pass("mission-core:constants", existsSync(join(missionRoot, "constants", "index.ts")));
pass("mission-core:service", existsSync(join(missionRoot, "services", "mission-core.service.ts")));
pass("mission-core:sdk", existsSync(join(missionRoot, "sdk", "index.ts")));

const missionService = readSafe(join(missionRoot, "services", "mission-core.service.ts"));
pass("mission-core:registerCapability", missionService.includes("registerCapability"));
pass("mission-core:executeWorkflow", missionService.includes("executeWorkflow"));
pass("mission-core:getCapabilityStatus", missionService.includes("getCapabilityStatus"));

const missionSdk = readSafe(join(missionRoot, "sdk", "index.ts"));
pass("mission-core:createMissionCoreClient", missionSdk.includes("createMissionCoreClient"));

pass("gci:types", existsSync(join(gciRoot, "types", "index.ts")));
pass("gci:localization", existsSync(join(gciRoot, "lib", "localization.ts")));
pass("gci:service", existsSync(join(gciRoot, "services", "gci.service.ts")));
pass("gci:sdk", existsSync(join(gciRoot, "sdk", "index.ts")));

const gciLoc = readSafe(join(gciRoot, "lib", "localization.ts"));
pass("gci:translateContent", gciLoc.includes("translateContent"));
pass("gci:resolveLocale", gciLoc.includes("resolveLocale"));
pass("gci:SUPPORTED_LANGUAGES", gciLoc.includes("SUPPORTED_LANGUAGES"));

for (const lang of ["en", "hi", "es", "fr", "de", "ar", "ja", "pt"]) {
    pass(`gci:lang:${lang}`, gciLoc.includes(`"${lang}"`));
}

const gciSdk = readSafe(join(gciRoot, "sdk", "index.ts"));
pass("gci:createGciClient", gciSdk.includes("createGciClient"));

const bridges = [
    "mission-core-bridge",
    "gci-bridge",
    "crm-bridge",
    "business-assets-bridge",
    "ai-brain-bridge",
    "notification-bridge",
    "audit-bridge",
    "projects-bridge",
];

for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

const serviceSource = readSafe(join(modRoot, "services", "client-success-capability.service.ts"));
const serviceMethods = [
    "runAiOnboarding",
    "provisionProjectWorkspace",
    "getClientPortalData",
    "getCommunicationCenter",
    "getApprovalCenter",
    "submitChangeRequest",
    "getDeliveryCenter",
    "getCustomerHealth",
    "getRenewalGrowth",
    "getAiSuccessManagerInsights",
];

for (const method of serviceMethods) {
    pass(`service:${method}`, serviceSource.includes(method));
}

pass("hook:useClientSuccessCapability", existsSync(join(modRoot, "hooks", "useClientSuccessCapability.ts")));
pass("schemas:index", existsSync(join(modRoot, "schemas", "index.ts")));
pass("sdk:index", existsSync(join(modRoot, "sdk", "index.ts")));

const pageSource = readSafe(join(modRoot, "components", "ClientSuccessCapabilityPage.tsx"));
pass("ui:design_os_Card", pageSource.includes("@/src/design-os/components/Card"));
pass("ui:design_os_Button", pageSource.includes("design-os") || pageSource.includes("@/src/design-os"));
pass("ui:PageTransition", pageSource.includes("PageTransition"));
pass("ui:StaggerReveal", pageSource.includes("StaggerReveal"));
pass("ui:Tabs", pageSource.includes("Tabs"));
pass("ui:gci_language_selector", pageSource.includes("gci-language") && pageSource.includes("SUPPORTED_LANGUAGES"));
pass("ui:client_selector", pageSource.includes("client-select"));

const aiDeliveryTsc = runTsc(root);
pass("regression:ai_delivery_model_tsc", aiDeliveryTsc.status === 0);

const aiDeliveryVerify = spawnVerify(root, "scripts/verify-ai-delivery-model.mjs");
const aiDeliveryOut = aiDeliveryVerify.stdout || "";
const aiDeliveryPassCount = (aiDeliveryOut.match(/PASS/g) || []).length;
pass("regression:ai_delivery_model_verify", aiDeliveryVerify.status === 0, aiDeliveryVerify.status !== 0 ? aiDeliveryOut.slice(-200) : `${aiDeliveryPassCount} checks`);

const designOsSource = readSafe(join(root, "scripts", "verify-design-os.mjs"));
pass("regression:design_os_script_exists", existsSync(join(root, "scripts", "verify-design-os.mjs")));
pass("regression:design_os_tokens", designOsSource.includes("tokens:"));
pass("regression:design_os_components", designOsSource.includes("component:"));

const pkg = readSafe(join(root, "package.json"));
pass("package:client_success_verify_script", pkg.includes('"client-success-capability:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\n=== Client Success Capability Verification ===\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} passed\n`);

if (failed.length > 0) process.exit(1);
