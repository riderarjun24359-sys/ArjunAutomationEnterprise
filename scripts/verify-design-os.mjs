/**
 * Design OS verification: tsc, lint, tokens, css, motion, components,
 * dashboard, guidelines, integration, rules, and regression checks.
 * Run: node scripts/verify-design-os.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const dosRoot = join(root, "src", "design-os");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const tokenFiles = ["colors", "typography", "spacing", "grid", "radii", "elevation", "motion", "blur", "glass", "breakpoints", "semantic", "index"];
for (const f of tokenFiles) {
    pass(`tokens:${f}`, existsSync(join(dosRoot, "tokens", `${f}.ts`)));
}

const css = readSafe(join(dosRoot, "css", "design-os.css"));
pass("css:design_os_exists", existsSync(join(dosRoot, "css", "design-os.css")));
pass("css:dark_light_vars", css.includes(":root") && css.includes(".dark"));

pass("motion:variants", existsSync(join(dosRoot, "motion", "variants.ts")));
pass("motion:transitions", existsSync(join(dosRoot, "motion", "transitions.ts")));
pass("motion:hooks", existsSync(join(dosRoot, "motion", "hooks", "useReducedMotion.ts")));
pass("motion:components", existsSync(join(dosRoot, "motion", "components", "PageTransition.tsx")));

const components = ["Button", "Input", "Textarea", "Select", "Card", "Dialog", "Table", "ChartContainer", "Form", "Dropdown", "Tabs", "Badge", "Notification", "LoadingState", "EmptyState", "ErrorState", "AnimatedLink", "ThemeToggle"];
for (const c of components) {
    pass(`component:${c}`, existsSync(join(dosRoot, "components", `${c}.tsx`)));
}

const dashboard = ["DashboardShell", "PremiumSidebar", "CommandPalette", "DockNav", "KpiCard", "GlassWidget", "ActivityFeed", "NotificationCenter", "AiAssistantPanel", "SmartSearch", "KeyboardShortcuts", "DashboardToolbar"];
for (const d of dashboard) {
    pass(`dashboard:${d}`, existsSync(join(dosRoot, "dashboard", `${d}.tsx`)));
}

const guidelines = ["philosophy", "typography", "spacing", "motion", "components", "dashboard", "website", "accessibility", "illustration"];
for (const g of guidelines) {
    pass(`guideline:${g}`, existsSync(join(dosRoot, "guidelines", `${g}.md`)));
}

const appShell = readSafe(join(root, "src", "components", "layout", "AppShell.tsx"));
pass("integration:AppShell_uses_DashboardShell", appShell.includes("DashboardShell") || appShell.includes("design-os"));

const globals = readSafe(join(root, "app", "globals.css"));
pass("integration:globals_imports_design_os", globals.includes("design-os.css"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:designOs", routes.includes('designOs: "/design-os"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Design_OS", nav.includes("Design OS"));
pass("nav:Layers_or_Palette", nav.includes("Layers") || nav.includes("Palette"));
pass("nav:designOs_route", nav.includes("ROUTES.designOs"));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:designOs_protected", middleware.includes("ROUTES.designOs"));

const rules = readSafe(join(dosRoot, "rules.ts"));
pass("rules:MANDATORY_RULES", rules.includes("MANDATORY_RULES"));

pass("module:DesignOsPage", existsSync(join(root, "src", "modules", "design-os", "components", "DesignOsPage.tsx")));
pass("route:page_exists", existsSync(join(root, "app", "(shell)", "design-os", "page.tsx")));

pass("package:design_os_verify", readSafe(join(root, "package.json")).includes('"design-os:verify"'));

const premiumVerify = spawnSync("node", ["scripts/verify-premium-website.mjs"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:premium_website", premiumVerify.status === 0, premiumVerify.status !== 0 ? "premium-website verify failed" : "");

const clkVerify = spawnSync("node", ["scripts/verify-company-launch-kit.mjs"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:company_launch_kit", clkVerify.status === 0, clkVerify.status !== 0 ? "company-launch-kit verify failed" : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nDesign OS Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) process.exit(1);
