/**
 * Business Platform v1.0 verification
 * Run: node scripts/verify-business-platform.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "business-platform");
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

pass("route:page", existsSync(join(root, "app", "(shell)", "business-platform", "page.tsx")));
pass("migration", existsSync(join(root, "supabase", "migrations", "202608060001_business_platform_v1.sql")));
pass("repository", existsSync(join(root, "src", "modules", "database", "repositories", "business-platform-repository.ts")));

const modules = [
    "LeadManagementPanel",
    "ConsultationPanel",
    "ProposalsPanel",
    "ClientPortalPanel",
    "ProjectManagementPanel",
    "TeamPanel",
    "FinancePanel",
    "AnalyticsPanel",
    "SettingsPanel",
    "AiOpsPanel",
];

for (const panel of modules) {
    pass(`panel:${panel}`, existsSync(join(modRoot, "components", "panels", `${panel}.tsx`)));
}

pass("component:BusinessPlatformPage", existsSync(join(modRoot, "components", "BusinessPlatformPage.tsx")));
pass("component:LifecyclePipeline", existsSync(join(modRoot, "components", "LifecyclePipeline.tsx")));
pass("service:business-platform", existsSync(join(modRoot, "services", "business-platform.service.ts")));
pass("hook:useBusinessPlatform", existsSync(join(modRoot, "hooks", "useBusinessPlatform.ts")));

const migration = readSafe(join(root, "supabase", "migrations", "202608060001_business_platform_v1.sql"));
pass("db:consultations", migration.includes("business_consultations"));
pass("db:proposals", migration.includes("business_proposals"));
pass("db:lifecycle_events", migration.includes("business_lifecycle_events"));
pass("db:ai_recommendations", migration.includes("business_ai_recommendations"));

const constants = readSafe(join(modRoot, "constants", "index.ts"));
pass("tabs:9_modules", constants.includes("leads") && constants.includes("aiOps"));
pass("lifecycle:stages", constants.includes("referral"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("routes:businessPlatform", routes.includes('businessPlatform: "/business-platform"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Business_Platform", nav.includes("Business Platform"));
pass("nav:primary", /Business Platform[\s\S]*section:\s*"primary"/.test(nav));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:protected", middleware.includes("ROUTES.businessPlatform"));

const missionConstants = readSafe(join(root, "src", "modules", "mission-core", "constants", "index.ts"));
pass("mission-core:capability", missionConstants.includes('"businessPlatform"'));

const executor = readSafe(join(root, "src", "modules", "mission-core", "engine", "capability-executor.ts"));
pass("executor:schedule-consultation", executor.includes("businessPlatform:schedule-consultation"));
pass("executor:generate-proposal", executor.includes("businessPlatform:generate-proposal"));

const bridges = ["sales-bridge", "projects-bridge", "finance-bridge", "data-bridge", "mission-core-bridge"];
for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

pass("package:script", readSafe(join(root, "package.json")).includes('"business-platform:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nBusiness Platform v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);

const chain = spawnVerify(root, "scripts/verify-public-website.mjs");
if (chain.status !== 0) process.exit(chain.status ?? 1);
