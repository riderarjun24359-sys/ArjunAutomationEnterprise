/**
 * Integration Hub & Public API OS verification (Sprint 7)
 * Run: node scripts/verify-integration-hub-os.mjs
 * npm run integrations:verify
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const mod = join(root, "src", "modules", "integration-hub");
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

pass("route:integration-hub", readSafe(join(root, "app", "(shell)", "integration-hub", "page.tsx")).includes("IntegrationHubPage"));
pass("protected-route:shell", existsSync(join(root, "app", "(shell)", "integration-hub", "page.tsx")));
pass("protected-route:middleware", readSafe(join(root, "src/middleware/auth.ts")).includes("integrationHub"));

const files = [
    "repository/integration-hub.repository.ts",
    "builders/integration-hub.builders.ts",
    "services/integration-hub-os.service.ts",
    "ai/ai-integration-assistant.ts",
    "analytics/integration-hub.analytics.ts",
    "hooks/useIntegrationHubOs.ts",
    "pages/IntegrationHubOsPage.tsx",
    "types/os.ts",
    "utils/audit.ts",
];
for (const f of files) pass(`module:${f}`, existsSync(join(mod, f)));

pass("multi-tenant:resolveOrganizationContext", readSafe(join(mod, "repository/integration-hub.repository.ts")).includes("resolveOrganizationContext"));
pass("supabase:live-loader", readSafe(join(mod, "repository/integration-hub.repository.ts")).includes("databaseService"));
pass("audit:helper", existsSync(join(mod, "utils/audit.ts")));
pass("ai:assistant", existsSync(join(mod, "ai/ai-integration-assistant.ts")));
pass("dashboard:ecc-widgets", existsSync(join(root, "src/modules/executive-command-center/components/ExecutiveIntegrationWidgetsPanel.tsx")));
pass(
    "dashboard:wired",
    readSafe(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx")).includes(
        "ExecutiveIntegrationWidgetsPanel",
    ),
);

const unit = spawnVerify(root, "scripts/test-integration-hub-os.mjs");
pass("test:integration-hub-os", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 400) : "");

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

const hrms = spawnVerify(root, "scripts/test-hrms-workforce-os.mjs");
pass("regression:sprint6-hrms", hrms.status === 0);

pass("package:script", readSafe(join(root, "package.json")).includes('"integrations:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nIntegration Hub OS: ${passed}/${results.length} checks passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
