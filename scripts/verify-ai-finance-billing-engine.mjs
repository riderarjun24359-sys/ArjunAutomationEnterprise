/**
 * Sprint 12 — AI Finance & Billing Engine verification.
 * Run: npm run ai-finance-billing-engine:verify
 * Target: 70+/70 PASS
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
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
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 400) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 400) : "");

const required = [
    "src/modules/ai-finance-billing-engine/index.ts",
    "src/modules/ai-finance-billing-engine/access.ts",
    "src/modules/ai-finance-billing-engine/constants.ts",
    "src/modules/ai-finance-billing-engine/types.ts",
    "src/modules/ai-finance-billing-engine/repository/ai-finance-billing-engine.repository.ts",
    "src/modules/ai-finance-billing-engine/builders/ai-finance-billing-engine.builders.ts",
    "src/modules/ai-finance-billing-engine/services/ai-finance-billing-engine.service.ts",
    "src/modules/ai-finance-billing-engine/hooks/useAiFinanceBillingEngine.ts",
    "src/modules/ai-finance-billing-engine/components/AiFinanceBillingEnginePage.tsx",
    "src/modules/ai-finance-billing-engine/components/AiFinanceBillingEnginePanels.tsx",
    "app/(shell)/ai-finance-billing-engine/page.tsx",
    "scripts/test-ai-finance-billing-engine.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/ai-finance-billing-engine/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/ai-finance-billing-engine/builders/ai-finance-billing-engine.builders.ts"));
pass("module:dashboard", builders.includes("buildExecutiveFinanceDashboard"));
pass("module:invoices", builders.includes("buildInvoiceCenter"));
pass("module:payments", builders.includes("buildPaymentCenter"));
pass("module:expenses", builders.includes("buildExpenseManager"));
pass("module:subscriptions", builders.includes("buildSubscriptionBilling"));
pass("module:revenue", builders.includes("buildRevenueAnalytics"));
pass("module:tax", builders.includes("buildTaxGstDashboard"));
pass("module:insights", builders.includes("buildAiFinancialInsights"));
pass("module:reports", builders.includes("buildFinancialReports"));
pass("module:automation", builders.includes("buildFinanceAutomationCenter"));
pass("module:executive", builders.includes("buildExecutiveIntelligence"));
pass("feature:invoice_statuses", builders.includes("draft") && builders.includes("overdue") && builders.includes("cancelled"));
pass("feature:payment_methods", builders.includes("stripe") && builders.includes("razorpay") && builders.includes("bank_transfer") && builders.includes("upi"));
pass("feature:subscription_buckets", builders.includes("trial") && builders.includes("upgrades") && builders.includes("downgrades") && builders.includes("cancellations"));
pass("feature:kpi_runway", builders.includes("runwayMonths") && builders.includes("burnRate"));
pass("feature:arr_mrr", builders.includes("arr") && builders.includes("mrr"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/ai-finance-billing-engine/repository/ai-finance-billing-engine.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:invoices", repo.includes("invoices.listByOrganization"));
pass("live:payments", repo.includes("payments.listByOrganization"));
pass("live:expenses", repo.includes("expenses.listByOrganization"));
pass("live:taxRates", repo.includes("taxRates.listByOrganization"));
pass("live:recurring", repo.includes("recurringInvoices.listByOrganization"));
pass("live:brv_invoices", repo.includes("brvInvoices"));
pass("live:brv_subscriptions", repo.includes("brvSubscriptionBillings"));
pass("live:brv_methods", repo.includes("brvPaymentMethods"));
pass("live:brv_attempts", repo.includes("brvPaymentAttempts"));
pass("live:brv_refunds", repo.includes("brvRefunds"));
pass("live:brv_mrr", repo.includes("brvMrrSnapshots"));
pass("live:brv_arr", repo.includes("brvArrSnapshots"));
pass("live:brv_cash", repo.includes("brvCashFlowRecords"));
pass("live:brv_tax", repo.includes("brvTaxConfigs"));
pass("live:brv_outstanding", repo.includes("brvOutstandingBalances"));
pass("live:brv_reminders", repo.includes("brvPaymentReminders"));
pass("live:brv_metrics", repo.includes("brvFinanceMetrics"));
pass("live:brv_health", repo.includes("brvFinancialHealth"));
pass("live:create_invoice", repo.includes("createInvoice") && repo.includes("invoices.create"));

const page = readSafe(join(root, "src/modules/ai-finance-billing-engine/components/AiFinanceBillingEnginePage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("AFBE_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/ai-finance-billing-engine/components/AiFinanceBillingEnginePanels.tsx"));
pass("ui:dashboard", panels.includes("ExecutiveFinanceDashboardPanel") && panels.includes("Runway"));
pass("ui:invoices", panels.includes("Invoice Center") && panels.includes("Create Invoice") && panels.includes("PDF Preview") && panels.includes("Search invoices"));
pass("ui:payments", panels.includes("Payment Center") && panels.includes("Stripe") && panels.includes("Razorpay") && panels.includes("Payment Timeline"));
pass("ui:expenses", panels.includes("Expense Manager") && panels.includes("Recurring Expenses") && panels.includes("Receipts"));
pass("ui:subscriptions", panels.includes("Subscription Billing") && panels.includes("Upgrades") && panels.includes("Cancellations"));
pass("ui:revenue", panels.includes("Revenue Analytics") && panels.includes("Revenue by Client") && panels.includes("Forecast"));
pass("ui:tax", panels.includes("Tax & GST") && panels.includes("Filing Preparation") && panels.includes("Export"));
pass("ui:insights", panels.includes("AI Financial Insights") && panels.includes("Revenue Risk") && panels.includes("Cash Flow Prediction"));
pass("ui:reports", panels.includes("Financial Reports") && panels.includes("Profit & Loss") && panels.includes("Balance Sheet") && panels.includes("Executive Summary"));
pass("ui:automation", panels.includes("Automation Center") && panels.includes("Recurring Invoices") && panels.includes("Payment Reminders"));
pass("ui:executive", panels.includes("Executive Intelligence") && panels.includes("Business Health Score") && panels.includes("Top Customers"));

pass(
    "routes:aiFinanceBillingEngine",
    readSafe(join(root, "src/constants/routes.ts")).includes("aiFinanceBillingEngine:"),
);
pass(
    "middleware:protected",
    readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.aiFinanceBillingEngine"),
);
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("aiFinanceBillingEngine"));
pass(
    "package:script",
    readSafe(join(root, "package.json")).includes('"ai-finance-billing-engine:verify"'),
);

pass(
    "isolation:no_schema_migration",
    !existsSync(join(root, "supabase/migrations/ai-finance-billing-engine.sql")),
);
pass(
    "isolation:customer_success_sprint11_intact",
    existsSync(join(root, "src/modules/ai-customer-success-engine/services/ai-customer-success-engine.service.ts")),
);
pass(
    "isolation:sales_sprint10_intact",
    existsSync(join(root, "src/modules/ai-sales-lead-engine/services/ai-sales-lead-engine.service.ts")),
);
pass(
    "isolation:marketing_sprint9_intact",
    existsSync(join(root, "src/modules/ai-marketing-growth-engine/services/ai-marketing-growth-engine.service.ts")),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-ai-finance-billing-engine.mjs");
pass(
    "test:ai-finance-billing-engine",
    unit.status === 0,
    unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "",
);

const failed = results.filter((r) => !r.pass);
console.log(`ai-finance-billing-engine:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
