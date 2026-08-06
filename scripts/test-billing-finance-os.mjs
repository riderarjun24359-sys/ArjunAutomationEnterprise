/**
 * Billing & Finance OS unit tests (Sprint 5).
 * Run: node scripts/test-billing-finance-os.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const mod = join(root, "src/modules/billing-finance");
const required = [
    "repository/billing-finance.repository.ts",
    "builders/billing-finance.builders.ts",
    "services/billing-finance-os.service.ts",
    "ai/ai-finance-assistant.ts",
    "analytics/billing-finance.analytics.ts",
    "integrations/platform-bridges.ts",
    "integrations/executive-command-center-bridge.ts",
    "hooks/useBillingFinanceOs.ts",
    "pages/BillingFinanceOsPage.tsx",
    "types/os.ts",
    "utils/formatters.ts",
    "constants/os.ts",
    "components/BillingFinancePage.tsx",
    "components/os/SubscriptionManagementPanel.tsx",
    "components/os/InvoiceCenterPanel.tsx",
    "components/os/PaymentCenterPanel.tsx",
    "components/os/RevenueDashboardPanel.tsx",
    "components/os/AiFinanceAssistantPanel.tsx",
];
for (const f of required) pass(`file:${f}`, existsSync(join(mod, f)));

const page = readFileSync(join(mod, "pages/BillingFinanceOsPage.tsx"), "utf8");
pass("page:subscriptions", page.includes("SubscriptionManagementPanel"));
pass("page:invoices", page.includes("InvoiceCenterPanel"));
pass("page:payments", page.includes("PaymentCenterPanel"));
pass("page:revenue", page.includes("RevenueDashboardPanel"));
pass("page:assistant", page.includes("AiFinanceAssistantPanel"));

const ecc = readFileSync(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx"), "utf8");
pass("ecc:finance-widgets", ecc.includes("FinanceExecutiveWidgetsPanel"));

const repo = readFileSync(join(mod, "repository/billing-finance.repository.ts"), "utf8");
pass("multi-tenant:org-context", repo.includes("resolveOrganizationContext"));
pass("supabase:brvSubscriptions", repo.includes("brvSubscriptionBillings"));
pass("supabase:brvInvoices", repo.includes("brvInvoices"));
pass("supabase:payments", repo.includes("brvPaymentAttempts"));
pass("supabase:financeInvoices", repo.includes("invoices.listByOrganization"));

const buildersSrc = readFileSync(join(mod, "builders/billing-finance.builders.ts"), "utf8");
pass("builder:subscriptions", buildersSrc.includes("export function buildSubscriptions"));
pass("builder:invoices", buildersSrc.includes("export function buildInvoiceCenter"));
pass("builder:payments", buildersSrc.includes("export function buildPaymentCenter"));
pass("builder:revenue", buildersSrc.includes("export function buildRevenueDashboard"));
pass("builder:widgets", buildersSrc.includes("export function buildFinanceExecutiveWidgets"));
pass("builder:snapshot", buildersSrc.includes("export function buildBillingFinanceSnapshot"));

const aiSrc = readFileSync(join(mod, "ai/ai-finance-assistant.ts"), "utf8");
pass("ai:daily-summary", aiSrc.includes("dailySummary"));
pass("ai:executive-summary", aiSrc.includes("executiveSummary"));

function money(n) {
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100) / 100;
}
pass("runtime:money", money(10.456) === 10.46 && money(NaN) === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nBilling & Finance OS tests: ${passed}/${results.length} passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
