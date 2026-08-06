/**
 * Billing & Finance OS verification (Sprint 5)
 * Run: node scripts/verify-billing-finance-os.mjs
 * npm run billing-finance:verify
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const mod = join(root, "src", "modules", "billing-finance");
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

pass("route:billing-finance", readSafe(join(root, "app", "(shell)", "billing-finance", "page.tsx")).includes("BillingFinancePage"));
pass("protected-route:shell", existsSync(join(root, "app", "(shell)", "billing-finance", "page.tsx")));
pass("protected-route:middleware", readSafe(join(root, "src/middleware/auth.ts")).includes("billingFinance"));

const files = [
    "repository/billing-finance.repository.ts",
    "builders/billing-finance.builders.ts",
    "services/billing-finance-os.service.ts",
    "ai/ai-finance-assistant.ts",
    "analytics/billing-finance.analytics.ts",
    "hooks/useBillingFinanceOs.ts",
    "pages/BillingFinanceOsPage.tsx",
    "types/os.ts",
];
for (const f of files) pass(`module:${f}`, existsSync(join(mod, f)));

pass("multi-tenant:resolveOrganizationContext", readSafe(join(mod, "repository/billing-finance.repository.ts")).includes("resolveOrganizationContext"));
pass("supabase:live-loader", readSafe(join(mod, "repository/billing-finance.repository.ts")).includes("databaseService"));
pass("ai:assistant", existsSync(join(mod, "ai/ai-finance-assistant.ts")));
pass("dashboard:ecc-widgets", existsSync(join(root, "src/modules/executive-command-center/components/FinanceExecutiveWidgetsPanel.tsx")));
pass(
    "dashboard:wired",
    readSafe(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx")).includes(
        "FinanceExecutiveWidgetsPanel",
    ),
);

const unit = spawnVerify(root, "scripts/test-billing-finance-os.mjs");
pass("test:billing-finance-os", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 400) : "");

const live = spawnVerify(root, "scripts/test-executive-live-stats.mjs");
pass("regression:sprint1-live-stats", live.status === 0);

const widgets = spawnVerify(root, "scripts/test-executive-widgets.mjs");
pass("regression:sprint1-widgets", widgets.status === 0);

const crm = spawnVerify(root, "scripts/test-crm-enterprise.mjs");
pass("regression:sprint2-crm", crm.status === 0);

const cs = spawnVerify(root, "scripts/test-customer-success-os.mjs");
pass("regression:sprint4-customer-success", cs.status === 0);

pass("package:script", readSafe(join(root, "package.json")).includes('"billing-finance:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nBilling & Finance OS: ${passed}/${results.length} checks passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
