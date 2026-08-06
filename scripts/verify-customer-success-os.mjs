/**
 * Customer Success OS verification (Sprint 4)
 * Run: node scripts/verify-customer-success-os.mjs
 * npm run customer-success:verify
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const mod = join(root, "src", "modules", "customer-success");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}
function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 400) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 400) : "");

pass("route:customer-success", readSafe(join(root, "app", "(shell)", "customer-success", "page.tsx")).includes("CustomerSuccessPage"));
pass("protected-route:shell", existsSync(join(root, "app", "(shell)", "customer-success", "page.tsx")));

const files = [
    "repository/customer-success.repository.ts",
    "builders/customer-success.builders.ts",
    "services/customer-success-os.service.ts",
    "ai/customer-success-assistant.ts",
    "analytics/customer-success.analytics.ts",
    "hooks/useCustomerSuccessOs.ts",
    "pages/CustomerSuccessOsPage.tsx",
    "types/os.ts",
];
for (const f of files) pass(`module:${f}`, existsSync(join(mod, f)));

pass("multi-tenant:resolveOrganizationContext", readSafe(join(mod, "repository/customer-success.repository.ts")).includes("resolveOrganizationContext"));
pass("supabase:live-loader", readSafe(join(mod, "repository/customer-success.repository.ts")).includes("databaseService"));
pass("ai:assistant", existsSync(join(mod, "ai/customer-success-assistant.ts")));
pass("dashboard:ecc-widgets", existsSync(join(root, "src/modules/executive-command-center/components/CustomerSuccessExecutiveWidgetsPanel.tsx")));
pass("dashboard:wired", readSafe(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx")).includes("CustomerSuccessExecutiveWidgetsPanel"));

const unit = spawnVerify(root, "scripts/test-customer-success-os.mjs");
pass("test:customer-success-os", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 400) : "");

const live = spawnVerify(root, "scripts/test-executive-live-stats.mjs");
pass("regression:sprint1-live-stats", live.status === 0);

const widgets = spawnVerify(root, "scripts/test-executive-widgets.mjs");
pass("regression:sprint1-widgets", widgets.status === 0);

const crm = spawnVerify(root, "scripts/test-crm-enterprise.mjs");
pass("regression:sprint2-crm", crm.status === 0);

pass("package:script", readSafe(join(root, "package.json")).includes('"customer-success:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nCustomer Success OS: ${passed}/${results.length} checks passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
