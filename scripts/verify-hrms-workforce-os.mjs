/**
 * HRMS & Workforce OS verification (Sprint 6)
 * Run: node scripts/verify-hrms-workforce-os.mjs
 * npm run hrms:verify
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const mod = join(root, "src", "modules", "hrms-workforce");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
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

pass("route:hrms", readSafe(join(root, "app", "(shell)", "hrms", "page.tsx")).includes("HrmsWorkforcePage"));
pass("protected-route:shell", existsSync(join(root, "app", "(shell)", "hrms", "page.tsx")));
pass("protected-route:middleware", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.hrms") || readSafe(join(root, "src/middleware/auth.ts")).includes("hrms"));

const files = [
    "repository/hrms-workforce.repository.ts",
    "builders/hrms-workforce.builders.ts",
    "services/hrms-workforce-os.service.ts",
    "ai/ai-hr-assistant.ts",
    "analytics/hrms-workforce.analytics.ts",
    "hooks/useHrmsWorkforceOs.ts",
    "pages/HrmsWorkforceOsPage.tsx",
    "types/os.ts",
    "utils/audit.ts",
];
for (const f of files) pass(`module:${f}`, existsSync(join(mod, f)));

pass("multi-tenant:resolveOrganizationContext", readSafe(join(mod, "repository/hrms-workforce.repository.ts")).includes("resolveOrganizationContext"));
pass("supabase:live-loader", readSafe(join(mod, "repository/hrms-workforce.repository.ts")).includes("databaseService"));
pass("audit:helper", existsSync(join(mod, "utils/audit.ts")));
pass("ai:assistant", existsSync(join(mod, "ai/ai-hr-assistant.ts")));
pass("dashboard:ecc-widgets", existsSync(join(root, "src/modules/executive-command-center/components/ExecutiveHrWidgetsPanel.tsx")));
pass(
    "dashboard:wired",
    readSafe(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx")).includes("ExecutiveHrWidgetsPanel"),
);

const unit = spawnVerify(root, "scripts/test-hrms-workforce-os.mjs");
pass("test:hrms-workforce-os", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 400) : "");

const live = spawnVerify(root, "scripts/test-executive-live-stats.mjs");
pass("regression:sprint1-live-stats", live.status === 0);

const widgets = spawnVerify(root, "scripts/test-executive-widgets.mjs");
pass("regression:sprint1-widgets", widgets.status === 0);

const crm = spawnVerify(root, "scripts/test-crm-enterprise.mjs");
pass("regression:sprint2-crm", crm.status === 0);

const cs = spawnVerify(root, "scripts/test-customer-success-os.mjs");
pass("regression:sprint4-customer-success", cs.status === 0);

const bf = spawnVerify(root, "scripts/test-billing-finance-os.mjs");
pass("regression:sprint5-billing-finance", bf.status === 0);

pass("package:script", readSafe(join(root, "package.json")).includes('"hrms:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nHRMS & Workforce OS: ${passed}/${results.length} checks passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
