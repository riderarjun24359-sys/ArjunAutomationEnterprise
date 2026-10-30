import {
    AFBE_AUTOMATION_KINDS,
    AFBE_INVOICE_STATUSES,
    AFBE_PAYMENT_METHODS,
    AFBE_SUBSCRIPTION_BUCKETS,
    type AfbeAutomationKind,
    type AfbeInvoiceStatus,
    type AfbePaymentMethod,
    type AfbeSubscriptionBucket,
} from "../constants";
import type {
    AiFinanceBillingEngineRawData,
    AiFinanceBillingEngineSnapshot,
    AiFinancialInsights,
    ExecutiveFinanceDashboard,
    ExecutiveIntelligenceBoard,
    ExpenseManager,
    FinanceAutomationCenter,
    FinancialReports,
    InvoiceCenter,
    InvoiceRow,
    PaymentCenter,
    PaymentRow,
    RevenueAnalytics,
    SubscriptionBilling,
    TaxGstDashboard,
} from "../types";

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export function normalizeInvoiceStatus(status: string, dueDate?: string | null, amountPaid = 0, total = 0): AfbeInvoiceStatus {
    const s = status.toLowerCase().trim();
    if (s.includes("cancel") || s.includes("void")) return "cancelled";
    if (s.includes("paid") || (total > 0 && amountPaid >= total)) return "paid";
    if (s.includes("overdue") || s.includes("past_due")) return "overdue";
    if (s.includes("sent") || s.includes("issued") || s.includes("open") || s.includes("unpaid")) {
        if (dueDate) {
            const t = new Date(dueDate).getTime();
            if (Number.isFinite(t) && t < Date.now() && amountPaid < total) return "overdue";
        }
        return "sent";
    }
    if (s.includes("draft")) return "draft";
    if (dueDate) {
        const t = new Date(dueDate).getTime();
        if (Number.isFinite(t) && t < Date.now() && amountPaid < total) return "overdue";
    }
    return "draft";
}

export function inferPaymentMethod(method: string, brand = "", reference = ""): AfbePaymentMethod {
    const s = `${method} ${brand} ${reference}`.toLowerCase();
    if (s.includes("stripe")) return "stripe";
    if (s.includes("razorpay") || s.includes("razor")) return "razorpay";
    if (s.includes("upi") || s.includes("gpay") || s.includes("phonepe") || s.includes("paytm")) return "upi";
    if (s.includes("bank") || s.includes("wire") || s.includes("ach") || s.includes("neft") || s.includes("rtgs")) {
        return "bank_transfer";
    }
    return "other";
}

export function classifySubscriptionBucket(
    status: string,
    prorationType = "",
    renewsAt: string | null = null,
): AfbeSubscriptionBucket {
    const s = `${status} ${prorationType}`.toLowerCase();
    if (s.includes("cancel") || s.includes("churn")) return "cancellations";
    if (s.includes("upgrade") || s.includes("expand")) return "upgrades";
    if (s.includes("downgrade") || s.includes("contract")) return "downgrades";
    if (s.includes("trial")) return "trial";
    if (s.includes("plan") && !s.includes("active")) return "plans";
    if (renewsAt) {
        const t = new Date(renewsAt).getTime();
        if (Number.isFinite(t) && t - Date.now() <= 86_400_000 * 30) return "renewals";
    }
    if (s.includes("renew")) return "renewals";
    if (s.includes("active") || s.includes("current")) return "active";
    return "plans";
}

export function classifyAutomationKind(type: string, channel = ""): AfbeAutomationKind {
    const s = `${type} ${channel}`.toLowerCase();
    if (s.includes("recurring") || s.includes("invoice schedule")) return "recurring_invoice";
    if (s.includes("overdue")) return "overdue_notice";
    if (s.includes("renew")) return "subscription_renewal";
    if (s.includes("remind") || s.includes("payment")) return "payment_reminder";
    return "finance_notification";
}

export const afbePure = {
    money,
    avg,
    normalizeInvoiceStatus,
    inferPaymentMethod,
    classifySubscriptionBucket,
    classifyAutomationKind,
};

function clientName(data: AiFinanceBillingEngineRawData, clientId: string | null): string {
    if (!clientId) return "—";
    return data.clients.find((c) => c.id === clientId)?.name ?? "Client";
}

function accountName(data: AiFinanceBillingEngineRawData, accountId: string): string {
    return data.brvAccounts.find((a) => a.id === accountId)?.account_name ?? "Account";
}

export function buildInvoiceCenter(data: AiFinanceBillingEngineRawData): InvoiceCenter {
    const financeRows: InvoiceRow[] = data.invoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        status: normalizeInvoiceStatus(inv.status, inv.due_date, inv.amount_paid, inv.total),
        issueDate: inv.issue_date,
        dueDate: inv.due_date ?? "",
        total: money(inv.total),
        taxAmount: money(inv.tax_amount),
        amountPaid: money(inv.amount_paid),
        currency: inv.currency || "INR",
        clientLabel: clientName(data, inv.client_id),
        notes: inv.notes,
        source: "finance",
    }));

    const brvRows: InvoiceRow[] = data.brvInvoices.map((inv) => {
        const paid = inv.total_usd - inv.amount_due_usd;
        return {
            id: inv.id,
            number: inv.invoice_number,
            status: normalizeInvoiceStatus(inv.payment_status || inv.status, inv.due_date, paid, inv.total_usd),
            issueDate: inv.invoice_date,
            dueDate: inv.due_date ?? "",
            total: money(inv.total_usd),
            taxAmount: money(inv.tax_amount),
            amountPaid: money(Math.max(0, paid)),
            currency: "INR",
            clientLabel: accountName(data, inv.billing_account_id),
            notes: "",
            source: "brv",
        };
    });

    const rows = [...financeRows, ...brvRows];
    const byStatus = AFBE_INVOICE_STATUSES.map((status) => {
        const matched = rows.filter((r) => r.status === status);
        return { status, count: matched.length, total: money(matched.reduce((s, r) => s + r.total, 0)) };
    });

    return {
        rows,
        byStatus,
        draftCount: byStatus.find((b) => b.status === "draft")?.count ?? 0,
        overdueCount: byStatus.find((b) => b.status === "overdue")?.count ?? 0,
        paidCount: byStatus.find((b) => b.status === "paid")?.count ?? 0,
    };
}

export function buildPaymentCenter(data: AiFinanceBillingEngineRawData): PaymentCenter {
    const paymentRows: PaymentRow[] = data.payments.map((p) => ({
        id: p.id,
        amount: money(p.amount),
        method: inferPaymentMethod(p.method, "", p.reference),
        status: p.status,
        reference: p.reference,
        paymentDate: p.payment_date,
        kind: "payment",
        failureReason: "",
    }));

    const attemptRows: PaymentRow[] = data.brvPaymentAttempts.map((a) => ({
        id: a.id,
        amount: money(a.amount_usd),
        method: inferPaymentMethod(a.gateway_reference, "", a.failure_reason),
        status: a.payment_status || a.status,
        reference: a.gateway_reference,
        paymentDate: a.attempted_at,
        kind: "attempt",
        failureReason: a.failure_reason,
    }));

    const refundRows: PaymentRow[] = data.brvRefunds.map((r) => ({
        id: r.id,
        amount: money(r.amount_usd),
        method: "other" as AfbePaymentMethod,
        status: r.refund_status || r.status,
        reference: r.refund_reason,
        paymentDate: r.processed_at ?? "",
        kind: "refund",
        failureReason: "",
    }));

    // Surface configured gateway architecture even when no attempts yet
    for (const m of data.brvPaymentMethods) {
        const method = inferPaymentMethod(m.method_type, m.brand, m.last_four);
        if (!paymentRows.some((p) => p.method === method) && !attemptRows.some((p) => p.method === method)) {
            paymentRows.push({
                id: m.id,
                amount: 0,
                method,
                status: m.status,
                reference: m.is_default ? `default ···${m.last_four}` : `···${m.last_four}`,
                paymentDate: "",
                kind: "payment",
                failureReason: "",
            });
        }
    }

    const rows = [...paymentRows, ...attemptRows, ...refundRows];
    const byMethod = AFBE_PAYMENT_METHODS.map((method) => {
        const matched = rows.filter((r) => r.method === method && r.kind !== "refund");
        return {
            method,
            count: matched.length,
            amount: money(matched.reduce((s, r) => s + r.amount, 0)),
        };
    });

    const timeline = [...rows]
        .filter((r) => r.paymentDate)
        .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
        .slice(0, 40);

    return {
        rows,
        byMethod,
        refunds: refundRows.length,
        failed: rows.filter((r) => /fail|error|declin/i.test(r.status) || Boolean(r.failureReason)).length,
        timeline,
    };
}

export function buildExpenseManager(data: AiFinanceBillingEngineRawData): ExpenseManager {
    const rows = data.expenses.map((e) => {
        const desc = e.description || "";
        const recurring = /recurring|monthly|subscription|retain/i.test(`${e.category} ${desc}`);
        const vendorMatch = desc.match(/(?:vendor|to|from)\s*[:\-]?\s*([A-Za-z0-9 &._-]{2,40})/i);
        return {
            id: e.id,
            category: e.category || "General",
            vendor: vendorMatch?.[1]?.trim() || clientName(data, e.client_id) || "Vendor",
            description: desc,
            amount: money(e.amount),
            expenseDate: e.expense_date,
            status: e.status,
            recurring,
            receipt: /receipt|attached|proof/i.test(desc) ? "on file" : "pending",
        };
    });

    const categoryMap = new Map<string, { count: number; amount: number }>();
    const vendorMap = new Map<string, { count: number; amount: number }>();
    for (const r of rows) {
        const c = categoryMap.get(r.category) ?? { count: 0, amount: 0 };
        c.count += 1;
        c.amount = money(c.amount + r.amount);
        categoryMap.set(r.category, c);
        const v = vendorMap.get(r.vendor) ?? { count: 0, amount: 0 };
        v.count += 1;
        v.amount = money(v.amount + r.amount);
        vendorMap.set(r.vendor, v);
    }

    const now = new Date();
    const monthlyTotal = money(
        rows
            .filter((r) => {
                const d = new Date(r.expenseDate);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((s, r) => s + r.amount, 0),
    );

    return {
        rows,
        categories: [...categoryMap.entries()].map(([category, v]) => ({ category, ...v })),
        vendors: [...vendorMap.entries()].map(([vendor, v]) => ({ vendor, ...v })),
        recurringCount: rows.filter((r) => r.recurring).length,
        pendingApprovals: rows.filter((r) => /pending|submitted|review/i.test(r.status)).length,
        monthlyTotal,
    };
}

export function buildSubscriptionBilling(data: AiFinanceBillingEngineRawData): SubscriptionBilling {
    const prorationBySub = data.brvProrations;
    const rows = data.brvSubscriptions.map((s) => {
        const related = prorationBySub.find((p) =>
            p.reason.toLowerCase().includes(s.plan_name.toLowerCase().slice(0, 12)),
        );
        const bucket = classifySubscriptionBucket(s.status, related?.proration_type ?? "", s.renews_at);
        return {
            id: s.id,
            planName: s.plan_name,
            bucket,
            billingCycle: s.billing_cycle,
            amountUsd: money(s.amount_usd),
            mrrUsd: money(s.mrr_usd),
            status: s.status,
            renewsAt: s.renews_at ?? "",
        };
    });

    // Distinct plans as plan catalog entries when subscriptions exist
    const planNames = [...new Set(rows.map((r) => r.planName))];
    for (const name of planNames) {
        if (!rows.some((r) => r.planName === name && r.bucket === "plans")) {
            const sample = rows.find((r) => r.planName === name);
            if (sample) {
                rows.push({
                    ...sample,
                    id: `plan-${sample.id}`,
                    bucket: "plans",
                    status: "plan",
                });
            }
        }
    }

    return {
        rows,
        byBucket: AFBE_SUBSCRIPTION_BUCKETS.map((bucket) => ({
            bucket,
            count: rows.filter((r) => r.bucket === bucket).length,
        })),
        activeMrr: money(rows.filter((r) => r.bucket === "active").reduce((s, r) => s + r.mrrUsd, 0)),
        planCount: planNames.length,
    };
}

export function buildExecutiveFinanceDashboard(data: AiFinanceBillingEngineRawData): ExecutiveFinanceDashboard {
    const latestMetric = data.brvFinanceMetrics[0];
    const latestMrr = data.brvMrrSnapshots[0];
    const latestArr = data.brvArrSnapshots[0];
    const latestAnalytics = data.brvAnalytics[0];

    const invoiceRevenue = money(
        buildInvoiceCenter(data)
            .rows.filter((r) => r.status === "paid")
            .reduce((s, r) => s + r.total, 0),
    );
    const expenseTotal = money(data.expenses.reduce((s, e) => s + e.amount, 0));
    const cashIn = money(data.brvCashFlow.reduce((s, c) => s + c.inflow_usd, 0) || data.payments.reduce((s, p) => s + p.amount, 0));
    const cashOut = money(data.brvCashFlow.reduce((s, c) => s + c.outflow_usd, 0) || expenseTotal);
    const cashFlow = money(
        data.brvCashFlow.length
            ? data.brvCashFlow.reduce((s, c) => s + c.net_cash_usd, 0)
            : cashIn - cashOut,
    );

    const mrr = money(
        latestMetric?.total_mrr_usd
            ?? latestMrr?.mrr_usd
            ?? latestAnalytics?.mrr_usd
            ?? data.brvSubscriptions.reduce((s, x) => s + x.mrr_usd, 0),
    );
    const arr = money(
        latestMetric?.total_arr_usd
            ?? latestArr?.arr_usd
            ?? latestAnalytics?.arr_usd
            ?? mrr * 12,
    );
    const revenue = money(latestMetric?.total_revenue_usd ?? latestAnalytics?.total_revenue_usd ?? invoiceRevenue);
    const profit = money(revenue - expenseTotal);

    const recentOutflows = data.brvCashFlow.slice(0, 3).map((c) => c.outflow_usd);
    const burnRate = money(
        recentOutflows.length
            ? recentOutflows.reduce((a, b) => a + b, 0) / recentOutflows.length
            : expenseTotal / Math.max(1, new Set(data.expenses.map((e) => e.expense_date.slice(0, 7))).size),
    );
    const cashPosition = money(cashIn - cashOut + data.brvOutstanding.reduce((s, o) => s + o.current_usd, 0));
    const runwayMonths = burnRate > 0 ? Math.round((Math.max(cashPosition, 0) / burnRate) * 10) / 10 : null;

    return {
        kpis: { arr, mrr, revenue, profit, expenses: expenseTotal, cashFlow, burnRate, runwayMonths },
        mrrTrend: data.brvMrrSnapshots
            .slice()
            .reverse()
            .slice(-12)
            .map((s) => ({ date: s.snapshot_date, mrr: money(s.mrr_usd) })),
        cashFlowTrend: data.brvCashFlow
            .slice()
            .reverse()
            .slice(-12)
            .map((c) => ({ date: c.record_date, net: money(c.net_cash_usd) })),
    };
}

export function buildRevenueAnalytics(data: AiFinanceBillingEngineRawData): RevenueAnalytics {
    const invoices = buildInvoiceCenter(data).rows.filter((r) => r.status === "paid" || r.status === "sent");
    const byClientMap = new Map<string, number>();
    for (const inv of invoices) {
        byClientMap.set(inv.clientLabel, money((byClientMap.get(inv.clientLabel) ?? 0) + inv.total));
    }
    for (const sub of data.brvSubscriptions) {
        const name = accountName(data, sub.billing_account_id);
        byClientMap.set(name, money((byClientMap.get(name) ?? 0) + sub.amount_usd));
    }

    const byServiceMap = new Map<string, number>();
    for (const sub of data.brvSubscriptions) {
        byServiceMap.set(sub.plan_name, money((byServiceMap.get(sub.plan_name) ?? 0) + sub.amount_usd));
    }
    if (!byServiceMap.size) {
        for (const inv of invoices) {
            byServiceMap.set("Services", money((byServiceMap.get("Services") ?? 0) + inv.total));
        }
    }

    const monthMap = new Map<string, number>();
    for (const inv of invoices) {
        const m = (inv.issueDate || "").slice(0, 7) || "unknown";
        monthMap.set(m, money((monthMap.get(m) ?? 0) + inv.total));
    }
    for (const a of data.brvAnalytics) {
        const m = a.snapshot_date.slice(0, 7);
        monthMap.set(m, money(Math.max(monthMap.get(m) ?? 0, a.total_revenue_usd)));
    }

    const monthlySeries = [...monthMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([month, revenue]) => ({ month, revenue }));

    const monthlyRevenue = money(monthlySeries.at(-1)?.revenue ?? data.brvFinanceMetrics[0]?.total_mrr_usd ?? 0);
    const annualRevenue = money(
        data.brvFinanceMetrics[0]?.total_revenue_usd
            ?? data.brvAnalytics[0]?.arr_usd
            ?? monthlySeries.reduce((s, m) => s + m.revenue, 0),
    );
    const growth = data.brvGrowth[0]?.growth_rate_percent ?? null;
    const forecast = money(
        data.brvProjections[0]?.projected_revenue_usd
            ?? data.brvRenewalForecasts.reduce((s, f) => s + f.renewal_amount_usd * (f.renewal_probability || 1), 0)
            ?? annualRevenue * 1.1,
    );

    return {
        monthlyRevenue,
        annualRevenue,
        byClient: [...byClientMap.entries()]
            .map(([client, revenue]) => ({ client, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 20),
        byService: [...byServiceMap.entries()]
            .map(([service, revenue]) => ({ service, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 20),
        forecast,
        growthPercent: growth,
        monthlySeries,
    };
}

export function buildTaxGstDashboard(data: AiFinanceBillingEngineRawData): TaxGstDashboard {
    const invoices = buildInvoiceCenter(data).rows;
    const invoiceTaxTotal = money(invoices.reduce((s, i) => s + i.taxAmount, 0));
    return {
        taxConfigs: data.brvTaxConfigs.map((t) => ({
            id: t.id,
            name: t.tax_name,
            gstRate: t.gst_rate,
            taxType: t.tax_type,
            jurisdiction: t.jurisdiction,
        })),
        taxRates: data.taxRates.map((t) => ({
            id: t.id,
            name: t.name,
            ratePercent: t.rate_percent,
            isDefault: t.is_default,
        })),
        invoiceTaxTotal,
        taxableInvoices: invoices.filter((i) => i.taxAmount > 0).length,
        filingReady: data.brvTaxConfigs.length > 0 || data.taxRates.length > 0,
        exportRows: [
            { label: "Taxable invoices", value: String(invoices.filter((i) => i.taxAmount > 0).length) },
            { label: "Invoice tax total", value: String(invoiceTaxTotal) },
            { label: "GST configs", value: String(data.brvTaxConfigs.length) },
            { label: "Tax rates", value: String(data.taxRates.length) },
        ],
    };
}

export function buildAiFinancialInsights(data: AiFinanceBillingEngineRawData): AiFinancialInsights {
    const dash = buildExecutiveFinanceDashboard(data);
    const outstanding = money(data.brvOutstanding.reduce((s, o) => s + o.total_outstanding_usd, 0));
    const overdueInv = buildInvoiceCenter(data).overdueCount;
    const insights = [];

    if (outstanding > 0 || overdueInv > 0) {
        insights.push({
            id: "revenue-risk",
            category: "revenue_risk" as const,
            title: "Revenue risk from outstanding balances",
            detail: `${overdueInv} overdue invoices; outstanding ${outstanding}.`,
            severity: outstanding > dash.kpis.revenue * 0.2 || overdueInv > 3 ? ("high" as const) : ("medium" as const),
        });
    }

    const topCategory = buildExpenseManager(data).categories.sort((a, b) => b.amount - a.amount)[0];
    if (topCategory) {
        insights.push({
            id: "spending",
            category: "spending" as const,
            title: "Spending concentration",
            detail: `${topCategory.category} is ${topCategory.amount} across ${topCategory.count} expenses.`,
            severity: topCategory.amount > dash.kpis.expenses * 0.4 ? ("high" as const) : ("medium" as const),
        });
    }

    if (dash.kpis.burnRate > 0) {
        insights.push({
            id: "cost-opt",
            category: "cost_optimization" as const,
            title: "Cost optimization opportunity",
            detail: `Burn rate ${dash.kpis.burnRate}/period. Review recurring expenses and unused subscriptions.`,
            severity: dash.kpis.runwayMonths !== null && dash.kpis.runwayMonths < 6 ? ("high" as const) : ("low" as const),
        });
    }

    insights.push({
        id: "cash-pred",
        category: "cash_flow" as const,
        title: "Cash flow prediction",
        detail: `Projected net cash position trend: ${dash.kpis.cashFlow}. Forecast horizon uses live cash flow + renewals.`,
        severity: dash.kpis.cashFlow < 0 ? ("high" as const) : ("low" as const),
    });

    insights.push({
        id: "profit",
        category: "profit" as const,
        title: "Profit suggestion",
        detail:
            dash.kpis.profit >= 0
                ? `Profit ${dash.kpis.profit}. Protect margin by accelerating collections and right-sizing spend.`
                : `Loss ${dash.kpis.profit}. Prioritize paid invoices and reduce non-critical burn.`,
        severity: dash.kpis.profit < 0 ? ("high" as const) : ("medium" as const),
    });

    return {
        insights,
        highSeverity: insights.filter((i) => i.severity === "high").length,
    };
}

export function buildFinancialReports(data: AiFinanceBillingEngineRawData): FinancialReports {
    const dash = buildExecutiveFinanceDashboard(data);
    const revenue = dash.kpis.revenue;
    const expenses = dash.kpis.expenses;
    const profit = dash.kpis.profit;
    const inflow = money(data.brvCashFlow.reduce((s, c) => s + c.inflow_usd, 0) || data.payments.reduce((s, p) => s + p.amount, 0));
    const outflow = money(data.brvCashFlow.reduce((s, c) => s + c.outflow_usd, 0) || expenses);
    const outstanding = money(data.brvOutstanding.reduce((s, o) => s + o.total_outstanding_usd, 0));
    const assets = money(inflow + outstanding);
    const liabilities = money(outflow * 0.2);
    const equity = money(assets - liabilities);

    return {
        profitAndLoss: { revenue, expenses, profit },
        balanceSheet: { assets, liabilities, equity },
        cashFlowStatement: { inflow, outflow, net: money(inflow - outflow) },
        revenueReportTotal: revenue,
        expenseReportTotal: expenses,
        executiveSummary: `Revenue ${revenue}, expenses ${expenses}, profit ${profit}. Cash net ${money(inflow - outflow)}. Outstanding ${outstanding}.`,
    };
}

export function buildFinanceAutomationCenter(data: AiFinanceBillingEngineRawData): FinanceAutomationCenter {
    const rules = [
        ...data.recurringInvoices.map((r) => ({
            id: r.id,
            name: r.title,
            kind: "recurring_invoice" as AfbeAutomationKind,
            status: r.is_active ? "active" : "paused",
            schedule: `${r.frequency} · next ${r.next_run_date}`,
            active: r.is_active,
        })),
        ...data.brvReminders.map((r) => ({
            id: r.id,
            name: r.reminder_type || "Payment reminder",
            kind: classifyAutomationKind(r.reminder_type, r.channel),
            status: r.status,
            schedule: r.next_reminder_at || r.sent_at || r.channel,
            active: !/paused|disabled|inactive/i.test(r.status),
        })),
        ...data.brvRenewalForecasts.map((r) => ({
            id: r.id,
            name: `Renewal forecast ${r.forecast_date}`,
            kind: "subscription_renewal" as AfbeAutomationKind,
            status: r.status,
            schedule: r.forecast_date,
            active: !/inactive|closed/i.test(r.status),
        })),
    ];

    return {
        rules,
        activeRules: rules.filter((r) => r.active).length,
        byKind: AFBE_AUTOMATION_KINDS.map((kind) => ({
            kind,
            count: rules.filter((r) => r.kind === kind).length,
        })),
    };
}

export function buildExecutiveIntelligence(data: AiFinanceBillingEngineRawData): ExecutiveIntelligenceBoard {
    const dash = buildExecutiveFinanceDashboard(data);
    const revenue = buildRevenueAnalytics(data);
    const health = data.brvFinancialHealth[0];
    const outstanding = money(data.brvOutstanding.reduce((s, o) => s + o.total_outstanding_usd, 0));
    const healthScore = health?.overall_score ?? null;
    const businessHealth =
        healthScore
        ?? avg([
            Math.min(100, Math.max(0, 50 + dash.kpis.profit / Math.max(1, dash.kpis.revenue) * 50)),
            Math.min(100, Math.max(0, 100 - outstanding / Math.max(1, dash.kpis.revenue) * 100)),
            Math.min(100, Math.max(0, (dash.kpis.runwayMonths ?? 12) * 8)),
        ]);

    return {
        financialHealthScore: healthScore,
        cashPosition: dash.kpis.cashFlow,
        revenueGrowthPercent: revenue.growthPercent,
        burnRate: dash.kpis.burnRate,
        topCustomers: revenue.byClient.slice(0, 5).map((c) => ({ name: c.client, revenue: c.revenue })),
        outstandingPayments: outstanding,
        forecast: revenue.forecast,
        businessHealthScore: businessHealth,
        summary: health?.summary || `Business health ${businessHealth ?? "—"}. ARR ${dash.kpis.arr}, MRR ${dash.kpis.mrr}.`,
    };
}

export function createEmptyAiFinanceBillingEngineSnapshot(
    accessGranted: boolean,
    reason?: string,
): AiFinanceBillingEngineSnapshot {
    const emptyDash: ExecutiveFinanceDashboard = {
        kpis: { arr: 0, mrr: 0, revenue: 0, profit: 0, expenses: 0, cashFlow: 0, burnRate: 0, runwayMonths: null },
        mrrTrend: [],
        cashFlowTrend: [],
    };
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason,
        fetchedAt: new Date().toISOString(),
        dashboard: emptyDash,
        invoices: { rows: [], byStatus: AFBE_INVOICE_STATUSES.map((status) => ({ status, count: 0, total: 0 })), draftCount: 0, overdueCount: 0, paidCount: 0 },
        payments: {
            rows: [],
            byMethod: AFBE_PAYMENT_METHODS.map((method) => ({ method, count: 0, amount: 0 })),
            refunds: 0,
            failed: 0,
            timeline: [],
        },
        expenses: { rows: [], categories: [], vendors: [], recurringCount: 0, pendingApprovals: 0, monthlyTotal: 0 },
        subscriptions: {
            rows: [],
            byBucket: AFBE_SUBSCRIPTION_BUCKETS.map((bucket) => ({ bucket, count: 0 })),
            activeMrr: 0,
            planCount: 0,
        },
        revenue: {
            monthlyRevenue: 0,
            annualRevenue: 0,
            byClient: [],
            byService: [],
            forecast: 0,
            growthPercent: null,
            monthlySeries: [],
        },
        tax: {
            taxConfigs: [],
            taxRates: [],
            invoiceTaxTotal: 0,
            taxableInvoices: 0,
            filingReady: false,
            exportRows: [],
        },
        insights: { insights: [], highSeverity: 0 },
        reports: {
            profitAndLoss: { revenue: 0, expenses: 0, profit: 0 },
            balanceSheet: { assets: 0, liabilities: 0, equity: 0 },
            cashFlowStatement: { inflow: 0, outflow: 0, net: 0 },
            revenueReportTotal: 0,
            expenseReportTotal: 0,
            executiveSummary: "",
        },
        automation: {
            rules: [],
            activeRules: 0,
            byKind: AFBE_AUTOMATION_KINDS.map((kind) => ({ kind, count: 0 })),
        },
        executive: {
            financialHealthScore: null,
            cashPosition: 0,
            revenueGrowthPercent: null,
            burnRate: 0,
            topCustomers: [],
            outstandingPayments: 0,
            forecast: 0,
            businessHealthScore: null,
            summary: "",
        },
    };
}

export function buildAiFinanceBillingEngineSnapshot(
    data: AiFinanceBillingEngineRawData,
): AiFinanceBillingEngineSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        dashboard: buildExecutiveFinanceDashboard(data),
        invoices: buildInvoiceCenter(data),
        payments: buildPaymentCenter(data),
        expenses: buildExpenseManager(data),
        subscriptions: buildSubscriptionBilling(data),
        revenue: buildRevenueAnalytics(data),
        tax: buildTaxGstDashboard(data),
        insights: buildAiFinancialInsights(data),
        reports: buildFinancialReports(data),
        automation: buildFinanceAutomationCenter(data),
        executive: buildExecutiveIntelligence(data),
    };
}
