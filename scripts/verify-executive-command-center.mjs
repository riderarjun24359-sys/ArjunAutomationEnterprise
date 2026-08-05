/**
 * Executive Command Center (EIP v1.0) verification
 * Run: node scripts/verify-executive-command-center.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "executive-command-center");
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

pass("route:dashboard", readSafe(join(root, "app", "(shell)", "dashboard", "page.tsx")).includes("ExecutiveCommandCenterPage"));

const modules = ["cto", "operations", "business", "customer", "project"];
pass("component:ExecutiveCommandCenterPage", existsSync(join(modRoot, "components", "ExecutiveCommandCenterPage.tsx")));
pass("component:IntelligenceModuleGrid", existsSync(join(modRoot, "components", "IntelligenceModuleGrid.tsx")));
pass("component:ExecutiveCopilot", existsSync(join(modRoot, "components", "ExecutiveCopilot.tsx")));
pass("component:UnifiedKpiStrip", existsSync(join(modRoot, "components", "UnifiedKpiStrip.tsx")));
pass("component:IntelligenceEnginesPanel", existsSync(join(modRoot, "components", "IntelligenceEnginesPanel.tsx")));

const engines = ["priority-engine", "risk-engine", "recommendation-engine", "opportunity-engine", "feed-engine"];
for (const engine of engines) {
    pass(`engine:${engine}`, existsSync(join(modRoot, "services", "engines", `${engine}.ts`)));
}

for (const mod of modules) {
    pass(`module:${mod}`, readSafe(join(modRoot, "constants", "index.ts")).includes(mod));
}

pass("service:executive-command-center", existsSync(join(modRoot, "services", "executive-command-center.service.ts")));
pass("service:smart-search", existsSync(join(modRoot, "services", "smart-search.service.ts")));
pass("service:command-registry", existsSync(join(modRoot, "services", "command-registry.ts")));
pass("hook:useExecutiveCommandCenter", existsSync(join(modRoot, "hooks", "useExecutiveCommandCenter.ts")));
pass("hook:useExecutiveCopilot", existsSync(join(modRoot, "hooks", "useExecutiveCopilot.ts")));
pass("store:executive", existsSync(join(root, "src", "store", "executive.store.ts")));

const bridges = ["eip-bridge", "aix-bridge", "business-platform-bridge", "dashboard-bridge"];
for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

pass("bridge:business-platform-eip", existsSync(join(root, "src", "modules", "business-platform", "integrations", "eip-bridge.ts")));

const commandPalette = readSafe(join(root, "src", "design-os", "dashboard", "CommandPalette.tsx"));
pass("command-palette:natural-language", commandPalette.includes("parseNaturalLanguageCommand"));
pass("command-palette:smart-search", commandPalette.includes("searchEverything"));

const smartSearch = readSafe(join(root, "src", "design-os", "dashboard", "SmartSearch.tsx"));
pass("smart-search:wired", smartSearch.includes("setCommandPaletteOpen"));

const toolbar = readSafe(join(root, "src", "design-os", "dashboard", "DashboardToolbar.tsx"));
pass("toolbar:copilot", toolbar.includes("toggleCopilot"));
pass("toolbar:notifications", toolbar.includes("snapshot?.notifications"));

const shellNav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:executive-command-center", shellNav.includes("Executive Command Center"));

const commands = readSafe(join(modRoot, "services", "command-registry.ts"));
pass("commands:create-proposal", commands.includes("create proposal"));
pass("commands:delayed-projects", commands.includes("delayed projects"));
pass("commands:overdue-invoices", commands.includes("overdue invoices"));

pass("package:script", readSafe(join(root, "package.json")).includes('"executive-command-center:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nExecutive Command Center v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);

const chain = spawnVerify(root, "scripts/verify-business-platform.mjs");
if (chain.status !== 0) process.exit(chain.status ?? 1);
