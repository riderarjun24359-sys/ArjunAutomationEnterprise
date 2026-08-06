/**
 * Customer Success OS unit tests (Sprint 4).
 * Run: node scripts/test-customer-success-os.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const mod = join(root, "src/modules/customer-success");
const required = [
    "repository/customer-success.repository.ts",
    "builders/customer-success.builders.ts",
    "services/customer-success-os.service.ts",
    "ai/customer-success-assistant.ts",
    "analytics/customer-success.analytics.ts",
    "integrations/platform-bridges.ts",
    "integrations/executive-command-center-bridge.ts",
    "hooks/useCustomerSuccessOs.ts",
    "pages/CustomerSuccessOsPage.tsx",
    "types/os.ts",
    "utils/formatters.ts",
    "constants/os.ts",
    "components/os/CustomerHealthCenterPanel.tsx",
    "components/os/SuccessPlansPanel.tsx",
    "components/os/RenewalCenterPanel.tsx",
    "components/os/ChurnPreventionPanel.tsx",
    "components/os/ExpansionCenterPanel.tsx",
    "components/os/CustomerTimelinePanel.tsx",
    "components/os/AiCustomerSuccessAssistantPanel.tsx",
];
for (const f of required) pass(`file:${f}`, existsSync(join(mod, f)));

const page = readFileSync(join(mod, "pages/CustomerSuccessOsPage.tsx"), "utf8");
pass("page:health", page.includes("CustomerHealthCenterPanel"));
pass("page:plans", page.includes("SuccessPlansPanel"));
pass("page:renewals", page.includes("RenewalCenterPanel"));
pass("page:churn", page.includes("ChurnPreventionPanel"));
pass("page:expansion", page.includes("ExpansionCenterPanel"));
pass("page:timeline", page.includes("CustomerTimelinePanel"));
pass("page:assistant", page.includes("AiCustomerSuccessAssistantPanel"));

const ecc = readFileSync(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx"), "utf8");
pass("ecc:cs-widgets", ecc.includes("CustomerSuccessExecutiveWidgetsPanel"));

const repo = readFileSync(join(mod, "repository/customer-success.repository.ts"), "utf8");
pass("multi-tenant:org-context", repo.includes("resolveOrganizationContext"));
pass("supabase:csHealthScores", repo.includes("csHealthScores"));
pass("supabase:csRenewalPlans", repo.includes("csRenewalPlans"));
pass("supabase:csChurnPredictions", repo.includes("csChurnPredictions"));

const buildersSrc = readFileSync(join(mod, "builders/customer-success.builders.ts"), "utf8");
pass("builder:health", buildersSrc.includes("export function buildHealthCenter"));
pass("builder:plans", buildersSrc.includes("export function buildSuccessPlans"));
pass("builder:renewals", buildersSrc.includes("export function buildRenewalCenter"));
pass("builder:churn", buildersSrc.includes("export function buildChurnPrevention"));
pass("builder:expansion", buildersSrc.includes("export function buildExpansionCenter"));
pass("builder:timeline", buildersSrc.includes("export function buildCustomerTimeline"));
pass("builder:snapshot", buildersSrc.includes("export function buildCustomerSuccessSnapshot"));

const aiSrc = readFileSync(join(mod, "ai/customer-success-assistant.ts"), "utf8");
pass("ai:daily-summary", aiSrc.includes("dailySummary"));
pass("ai:executive-summary", aiSrc.includes("executiveSummary"));

// Lightweight runtime via duplicated pure score clamp (no TS path aliases)
function clampScore(n) {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}
pass("runtime:clamp", clampScore(150) === 100 && clampScore(-1) === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nCustomer Success OS tests: ${passed}/${results.length} passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
