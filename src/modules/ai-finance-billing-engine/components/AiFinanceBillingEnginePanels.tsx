"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiFinancialInsights,
    ExecutiveFinanceDashboard,
    ExecutiveIntelligenceBoard,
    ExpenseManager,
    FinanceAutomationCenter,
    FinancialReports,
    InvoiceCenter,
    PaymentCenter,
    RevenueAnalytics,
    SubscriptionBilling,
    TaxGstDashboard,
    CreateInvoiceInput,
} from "../types";

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

function Table({ headers, rows, empty }: { headers: string[]; rows: string[][]; empty: string }) {
    if (!rows.length) {
        return <EmptyState title={empty} description="Live tenant data will appear when records exist in Supabase." />;
    }
    return (
        <div className="overflow-x-auto rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)]">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-tertiary)]">
                    <tr>
                        {headers.map((h) => (
                            <th key={h} className="px-3 py-2 font-medium">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-[var(--dos-border)]">
                            {row.map((cell, j) => (
                                <td key={j} className="px-3 py-2 text-[var(--dos-text-secondary)]">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function moneyLabel(n: number, currency = "INR") {
    return `${currency} ${n.toLocaleString()}`;
}

export function ExecutiveFinanceDashboardPanel({ dashboard }: { dashboard: ExecutiveFinanceDashboard }) {
    const k = dashboard.kpis;
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="ARR" value={moneyLabel(k.arr)} />
                <Metric label="MRR" value={moneyLabel(k.mrr)} />
                <Metric label="Revenue" value={moneyLabel(k.revenue)} />
                <Metric label="Profit" value={moneyLabel(k.profit)} />
                <Metric label="Expenses" value={moneyLabel(k.expenses)} />
                <Metric label="Cash Flow" value={moneyLabel(k.cashFlow)} />
                <Metric label="Burn Rate" value={moneyLabel(k.burnRate)} />
                <Metric label="Runway" value={k.runwayMonths == null ? "—" : `${k.runwayMonths} mo`} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive Finance Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    ARR · MRR · Revenue · Profit · Expenses · Cash Flow · Burn Rate · Runway
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">MRR trend</p>
                        <Table
                            headers={["Date", "MRR"]}
                            rows={dashboard.mrrTrend.map((r) => [r.date, moneyLabel(r.mrr)])}
                            empty="No MRR snapshots"
                        />
                    </div>
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">Cash flow trend</p>
                        <Table
                            headers={["Date", "Net"]}
                            rows={dashboard.cashFlowTrend.map((r) => [r.date, moneyLabel(r.net)])}
                            empty="No cash flow records"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}

export function InvoiceCenterPanel({
    invoices,
    creating,
    onCreate,
}: {
    invoices: InvoiceCenter;
    creating?: boolean;
    onCreate?: (input: CreateInvoiceInput) => Promise<{ ok: boolean; error?: string }>;
}) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [previewId, setPreviewId] = useState<string | null>(null);
    const [number, setNumber] = useState("");
    const [total, setTotal] = useState("");
    const [tax, setTax] = useState("0");
    const [message, setMessage] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return invoices.rows.filter((r) => {
            if (status !== "all" && r.status !== status) return false;
            if (!q) return true;
            return `${r.number} ${r.clientLabel} ${r.status} ${r.notes}`.toLowerCase().includes(q);
        });
    }, [invoices.rows, query, status]);

    const preview = invoices.rows.find((r) => r.id === previewId) ?? filtered[0] ?? null;

    async function handleCreate() {
        if (!onCreate) return;
        const t = Number(total);
        const tx = Number(tax);
        if (!number.trim() || !Number.isFinite(t)) {
            setMessage("Enter invoice number and total.");
            return;
        }
        const result = await onCreate({
            number: number.trim(),
            issueDate: new Date().toISOString().slice(0, 10),
            dueDate: new Date(Date.now() + 86_400_000 * 14).toISOString().slice(0, 10),
            subtotal: Math.max(0, t - (Number.isFinite(tx) ? tx : 0)),
            taxAmount: Number.isFinite(tx) ? tx : 0,
            total: t,
            status: "draft",
            notes: "Created from AI Finance & Billing Engine",
        });
        setMessage(result.ok ? "Invoice created as draft." : result.error ?? "Create failed");
        if (result.ok) {
            setNumber("");
            setTotal("");
            setTax("0");
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {invoices.byStatus.map((b) => (
                    <Metric key={b.status} label={b.status} value={b.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Invoice Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Create Invoice · Draft · Sent · Paid · Overdue · Cancelled · PDF Preview · Search · Filters
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-4">
                    <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Invoice number"
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <input
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        placeholder="Total"
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <input
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        placeholder="Tax"
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <button
                        type="button"
                        disabled={creating || !onCreate}
                        onClick={() => void handleCreate()}
                        className="rounded-[var(--dos-radius-md)] bg-[var(--dos-accent)] px-3 py-2 text-sm font-medium text-[var(--dos-accent-contrast,white)] disabled:opacity-50"
                    >
                        Create Invoice
                    </button>
                </div>
                {message ? <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{message}</p> : null}
                <div className="mt-3 flex flex-wrap gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search invoices…"
                        className="min-w-[220px] flex-1 rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    >
                        <option value="all">All statuses</option>
                        {invoices.byStatus.map((b) => (
                            <option key={b.status} value={b.status}>
                                {b.status}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Number", "Client", "Status", "Total", "Due", "PDF"]}
                        rows={filtered.map((r) => [
                            r.number,
                            r.clientLabel,
                            r.status,
                            moneyLabel(r.total, r.currency),
                            r.dueDate || "—",
                            "Preview",
                        ])}
                        empty="No invoices"
                    />
                    <Card>
                        <h4 className="font-semibold text-[var(--dos-text-primary)]">PDF Preview</h4>
                        {preview ? (
                            <div className="mt-3 space-y-2 rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] p-4 text-sm text-[var(--dos-text-secondary)]">
                                <p className="text-base font-semibold text-[var(--dos-text-primary)]">Invoice {preview.number}</p>
                                <p>Client: {preview.clientLabel}</p>
                                <p>Status: {preview.status}</p>
                                <p>Issue: {preview.issueDate}</p>
                                <p>Due: {preview.dueDate || "—"}</p>
                                <p>Tax: {moneyLabel(preview.taxAmount, preview.currency)}</p>
                                <p>Total: {moneyLabel(preview.total, preview.currency)}</p>
                                <p>Paid: {moneyLabel(preview.amountPaid, preview.currency)}</p>
                                <p>Notes: {preview.notes || "—"}</p>
                                <button
                                    type="button"
                                    className="mt-2 text-xs text-[var(--dos-accent)]"
                                    onClick={() => setPreviewId(preview.id)}
                                >
                                    Select for PDF preview
                                </button>
                            </div>
                        ) : (
                            <EmptyState title="No PDF preview" description="Select an invoice to preview." />
                        )}
                    </Card>
                </div>
            </Card>
        </div>
    );
}

export function PaymentCenterPanel({ payments }: { payments: PaymentCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Stripe" value={payments.byMethod.find((m) => m.method === "stripe")?.count ?? 0} />
                <Metric label="Razorpay" value={payments.byMethod.find((m) => m.method === "razorpay")?.count ?? 0} />
                <Metric label="Bank Transfer" value={payments.byMethod.find((m) => m.method === "bank_transfer")?.count ?? 0} />
                <Metric label="UPI" value={payments.byMethod.find((m) => m.method === "upi")?.count ?? 0} />
                <Metric label="Refunds" value={payments.refunds} />
                <Metric label="Failed Payments" value={payments.failed} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Payment Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Stripe architecture · Razorpay architecture · Bank Transfer · UPI · Refunds · Failed Payments · Payment Timeline
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {payments.byMethod.map((m) => (
                        <Badge key={m.method} variant="info">
                            {m.method}: {m.count}
                        </Badge>
                    ))}
                </div>
                <div className="mt-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">Payment Timeline</p>
                    <Table
                        headers={["Date", "Kind", "Method", "Amount", "Status", "Reference"]}
                        rows={payments.timeline.map((r) => [
                            r.paymentDate,
                            r.kind,
                            r.method,
                            moneyLabel(r.amount),
                            r.status,
                            r.reference || r.failureReason || "—",
                        ])}
                        empty="No payment timeline"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ExpenseManagerPanel({ expenses }: { expenses: ExpenseManager }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Expenses" value={expenses.rows.length} />
                <Metric label="Categories" value={expenses.categories.length} />
                <Metric label="Vendors" value={expenses.vendors.length} />
                <Metric label="Recurring Expenses" value={expenses.recurringCount} />
                <Metric label="Approvals" value={expenses.pendingApprovals} />
                <Metric label="Monthly Reports" value={moneyLabel(expenses.monthlyTotal)} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Expense Manager</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Categories · Vendors · Recurring Expenses · Receipts · Approvals · Monthly Reports
                </p>
                <div className="mt-4">
                    <Table
                        headers={["Date", "Category", "Vendor", "Amount", "Status", "Receipt", "Recurring"]}
                        rows={expenses.rows.map((r) => [
                            r.expenseDate,
                            r.category,
                            r.vendor,
                            moneyLabel(r.amount),
                            r.status,
                            r.receipt,
                            r.recurring ? "yes" : "no",
                        ])}
                        empty="No expenses"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SubscriptionBillingPanel({ subscriptions }: { subscriptions: SubscriptionBilling }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {subscriptions.byBucket.map((b) => (
                    <Metric key={b.bucket} label={b.bucket} value={b.count} />
                ))}
                <Metric label="Active MRR" value={moneyLabel(subscriptions.activeMrr)} />
                <Metric label="Plans" value={subscriptions.planCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Subscription Billing</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Plans · Active Subscriptions · Trial · Renewals · Upgrades · Downgrades · Cancellations
                </p>
                <Table
                    headers={["Plan", "Bucket", "Cycle", "Amount", "MRR", "Status", "Renews"]}
                    rows={subscriptions.rows.map((r) => [
                        r.planName,
                        r.bucket,
                        r.billingCycle,
                        moneyLabel(r.amountUsd),
                        moneyLabel(r.mrrUsd),
                        r.status,
                        r.renewsAt || "—",
                    ])}
                    empty="No subscriptions"
                />
            </Card>
        </div>
    );
}

export function RevenueAnalyticsPanel({ revenue }: { revenue: RevenueAnalytics }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Monthly Revenue" value={moneyLabel(revenue.monthlyRevenue)} />
                <Metric label="Annual Revenue" value={moneyLabel(revenue.annualRevenue)} />
                <Metric label="Forecast" value={moneyLabel(revenue.forecast)} />
                <Metric label="Growth" value={revenue.growthPercent == null ? "—" : `${revenue.growthPercent}%`} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Revenue Analytics</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Monthly Revenue · Annual Revenue · Revenue by Client · Revenue by Service · Forecast · Growth
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Client", "Revenue"]}
                        rows={revenue.byClient.map((r) => [r.client, moneyLabel(r.revenue)])}
                        empty="No client revenue"
                    />
                    <Table
                        headers={["Service", "Revenue"]}
                        rows={revenue.byService.map((r) => [r.service, moneyLabel(r.revenue)])}
                        empty="No service revenue"
                    />
                </div>
            </Card>
        </div>
    );
}

export function TaxGstPanel({ tax }: { tax: TaxGstDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="GST Dashboard" value={tax.taxConfigs.length} />
                <Metric label="Tax Reports" value={tax.taxRates.length} />
                <Metric label="Invoice Tax Summary" value={moneyLabel(tax.invoiceTaxTotal)} />
                <Metric label="Filing Preparation" value={tax.filingReady ? "Ready" : "Pending"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Tax & GST</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    GST Dashboard · Tax Reports · Export · Filing Preparation · Invoice Tax Summary
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {tax.exportRows.map((r) => (
                        <Badge key={r.label} variant="info">
                            Export · {r.label}: {r.value}
                        </Badge>
                    ))}
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Tax", "GST %", "Type", "Jurisdiction"]}
                        rows={tax.taxConfigs.map((t) => [t.name, String(t.gstRate), t.taxType, t.jurisdiction])}
                        empty="No GST configs"
                    />
                    <Table
                        headers={["Rate", "Percent", "Default"]}
                        rows={tax.taxRates.map((t) => [t.name, String(t.ratePercent), t.isDefault ? "yes" : "no"])}
                        empty="No tax rates"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiFinancialInsightsPanel({ insights }: { insights: AiFinancialInsights }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Insights" value={insights.insights.length} />
                <Metric label="High Severity" value={insights.highSeverity} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Financial Insights</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Revenue Risk · Spending Analysis · Cost Optimization · Cash Flow Prediction · Profit Suggestions
                </p>
                <Table
                    headers={["Category", "Title", "Detail", "Severity"]}
                    rows={insights.insights.map((i) => [i.category, i.title, i.detail, i.severity])}
                    empty="No insights"
                />
            </Card>
        </div>
    );
}

export function FinancialReportsPanel({ reports }: { reports: FinancialReports }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Profit & Loss" value={moneyLabel(reports.profitAndLoss.profit)} />
                <Metric label="Balance Sheet Equity" value={moneyLabel(reports.balanceSheet.equity)} />
                <Metric label="Cash Flow Statement" value={moneyLabel(reports.cashFlowStatement.net)} />
                <Metric label="Revenue Reports" value={moneyLabel(reports.revenueReportTotal)} />
                <Metric label="Expense Reports" value={moneyLabel(reports.expenseReportTotal)} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Financial Reports</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Profit & Loss · Balance Sheet · Cash Flow Statement · Revenue Reports · Expense Reports · Executive Summary
                </p>
                <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{reports.executiveSummary || "—"}</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <Table
                        headers={["P&L", "Amount"]}
                        rows={[
                            ["Revenue", moneyLabel(reports.profitAndLoss.revenue)],
                            ["Expenses", moneyLabel(reports.profitAndLoss.expenses)],
                            ["Profit", moneyLabel(reports.profitAndLoss.profit)],
                        ]}
                        empty="No P&L"
                    />
                    <Table
                        headers={["Balance Sheet", "Amount"]}
                        rows={[
                            ["Assets", moneyLabel(reports.balanceSheet.assets)],
                            ["Liabilities", moneyLabel(reports.balanceSheet.liabilities)],
                            ["Equity", moneyLabel(reports.balanceSheet.equity)],
                        ]}
                        empty="No balance sheet"
                    />
                    <Table
                        headers={["Cash Flow", "Amount"]}
                        rows={[
                            ["Inflow", moneyLabel(reports.cashFlowStatement.inflow)],
                            ["Outflow", moneyLabel(reports.cashFlowStatement.outflow)],
                            ["Net", moneyLabel(reports.cashFlowStatement.net)],
                        ]}
                        empty="No cash flow"
                    />
                </div>
            </Card>
        </div>
    );
}

export function FinanceAutomationPanel({ automation }: { automation: FinanceAutomationCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Rules" value={automation.rules.length} />
                <Metric label="Active" value={automation.activeRules} />
                {automation.byKind.map((k) => (
                    <Metric key={k.kind} label={k.kind} value={k.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Automation Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Recurring Invoices · Payment Reminders · Overdue Notices · Subscription Renewals · Finance Notifications
                </p>
                <Table
                    headers={["Name", "Kind", "Schedule", "Status", "Active"]}
                    rows={automation.rules.map((r) => [
                        r.name,
                        r.kind,
                        r.schedule,
                        r.status,
                        r.active ? "yes" : "no",
                    ])}
                    empty="No automation rules"
                />
            </Card>
        </div>
    );
}

export function ExecutiveIntelligencePanel({ executive }: { executive: ExecutiveIntelligenceBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Financial Health" value={executive.financialHealthScore ?? "—"} />
                <Metric label="Cash Position" value={moneyLabel(executive.cashPosition)} />
                <Metric
                    label="Revenue Growth"
                    value={executive.revenueGrowthPercent == null ? "—" : `${executive.revenueGrowthPercent}%`}
                />
                <Metric label="Burn Rate" value={moneyLabel(executive.burnRate)} />
                <Metric label="Outstanding Payments" value={moneyLabel(executive.outstandingPayments)} />
                <Metric label="Forecast" value={moneyLabel(executive.forecast)} />
                <Metric label="Business Health Score" value={executive.businessHealthScore ?? "—"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive Intelligence</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Financial Health · Cash Position · Revenue Growth · Burn Rate · Top Customers · Outstanding Payments ·
                    Forecast · Business Health Score
                </p>
                <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{executive.summary}</p>
                <div className="mt-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">Top Customers</p>
                    <Table
                        headers={["Customer", "Revenue"]}
                        rows={executive.topCustomers.map((c) => [c.name, moneyLabel(c.revenue)])}
                        empty="No top customers"
                    />
                </div>
            </Card>
        </div>
    );
}
