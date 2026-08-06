/**
 * CRM Enterprise Platform verification
 * Run: node scripts/verify-crm-enterprise.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "crm");
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
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 400) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 400) : "");

pass("route:crm", readSafe(join(root, "app", "(shell)", "crm", "page.tsx")).includes("CrmPage"));

const components = [
    "CrmPage",
    "ClientDirectoryPanel",
    "LeadKanbanBoard",
    "ClientProfileWorkspace",
    "AiCrmAssistantPanel",
    "CommunicationCenterPanel",
    "CrmAnalyticsPanel",
];
for (const c of components) {
    pass(`component:${c}`, existsSync(join(modRoot, "components", `${c}.tsx`)));
}

pass("service:platform-data", existsSync(join(modRoot, "services", "crm-platform-data.service.ts")));
pass("service:builders", existsSync(join(modRoot, "services", "crm-enterprise-builders.ts")));
pass("service:crm", existsSync(join(modRoot, "services", "crm.service.ts")));
pass("hook:useCrmPlatform", existsSync(join(modRoot, "hooks", "useCrmPlatform.ts")));

const page = readSafe(join(modRoot, "components", "CrmPage.tsx"));
pass("ui:tabs-directory", page.includes("Client Directory"));
pass("ui:tabs-leads", page.includes("Lead Management"));
pass("ui:tabs-ai", page.includes("AI Assistant"));
pass("ui:tabs-analytics", page.includes("Analytics"));

const dash = readSafe(join(root, "src", "modules", "executive-command-center", "components", "ExecutiveCommandCenterPage.tsx"));
pass("sprint1:dashboard", dash.includes("UnifiedKpiStrip") && dash.includes("liveStats"));

const mapper = readSafe(join(root, "src", "modules", "database", "lib", "crm-mappers.ts"));
pass("no-mock:$312k", !mapper.includes("$312k"));

const unit = spawnVerify(root, "scripts/test-crm-enterprise.mjs");
pass("test:crm-enterprise", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 400) : "");

const live = spawnVerify(root, "scripts/test-executive-live-stats.mjs");
pass("regression:sprint1-live-stats", live.status === 0, live.status !== 0 ? (live.stderr || live.stdout || "").slice(0, 300) : "");

const widgets = spawnVerify(root, "scripts/test-executive-widgets.mjs");
pass("regression:sprint1-widgets", widgets.status === 0, widgets.status !== 0 ? (widgets.stderr || widgets.stdout || "").slice(0, 300) : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nCRM Enterprise Platform: ${passed}/${results.length} checks passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
