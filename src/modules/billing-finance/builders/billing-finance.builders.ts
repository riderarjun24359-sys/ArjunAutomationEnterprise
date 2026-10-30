import type { BillingFinanceRawData } from "../types/raw";
import type {
    BillingFinanceSnapshot,
    FinanceExecutiveWidgets,
    InvoiceCenterItem,
    PaymentCenterItem,
    RevenueDashboardMetrics,
    SubscriptionManagementItem,
} from "../types/os";
import { clampScore, daysOverdue, daysUntil, money, monthKey, trendFromValues } from "../utils/formatters";

function accountName(data: BillingFinanceRawData, accountId?: string | null): string {
    if (!accountId) return "Unknown account";
    return data.billingAccounts.find((a) => a.id === accountId)?.account_name ?? "Unknown account";
}

function clientName(data: BillingFinanceRawData, clientId?: string | null): string {
    if (!clientId) return "Unknown client";
    return data.clients.find((c) => c.id === clientId)?.name ?? "Unknown client";
}

function projectName(data: BillingFinanceRawData, projectId?: string | null): string | null {
    if (!projectId) return null;
    return data.projects.find((p) => p.id === projectId)?.name ?? null;
}

function isOpenInvoiceStatus(status: string): boolean {
    const s = status.toLowerCase();
    return !["paid", "void", "cancelled", "canceled", "written_off"].includes(s);
}

function isFailedPayment(status: string): boolean {
    const s = status.toLowerCase();
    return ["failed", "declined", "error", "cancelled", "canceled"].includes(s);
}

function isPaidPayment(status: string): boolean {
    const s = status.toLowerCase();
    return ["paid", "succeeded", "success", "completed", "captured"].includes(s);
}

export function buildSubscriptions(data: BillingFinanceRawData): SubscriptionManagementItem[] {
    return data.subscriptions
        .map((sub) => ({
            id: sub.id,
            billingAccountId: sub.billing_account_id,
            accountName: accountName(data, sub.billing_account_id),
            planName: sub.plan_name,
            billingCycle: sub.billing_cycle,
            amountUsd: money(Number(sub.amount_usd ?? 0)),
            mrrUsd: money(Number(sub.mrr_usd ?? 0)),
            arrUsd: money(Number(sub.arr_usd ?? 0)),
            quantity: Number(sub.quantity ?? 1),
            status: sub.status,
            paymentStatus: sub.payment_status,
            startsAt: sub.starts_at,
            renewsAt: sub.renews_at ?? null,
            daysToRenewal: daysUntil(sub.renews_at),
        }))
        .sort((a, b) => (a.daysToRenewal ?? 9999) - (b.daysToRenewal ?? 9999));
}

export function buildInvoiceCenter(data: BillingFinanceRawData): InvoiceCenterItem[] {
    const fromBrv: InvoiceCenterItem[] = data.brvInvoices.map((inv) => {
        const total = money(Number(inv.total_usd ?? 0));
        const due = money(Number(inv.amount_due_usd ?? 0));
        return {
            id: inv.id,
            source: "brv",
            number: inv.invoice_number || inv.invoice_key,
            accountOrClient: accountName(data, inv.billing_account_id),
            clientId: null,
            totalUsd: total,
            amountDueUsd: due,
            amountPaidUsd: money(total - due),
            status: inv.status,
            paymentStatus: inv.payment_status,
            invoiceDate: inv.invoice_date,
            dueDate: inv.due_date ?? null,
            daysOverdue: daysOverdue(inv.due_date),
            projectId: null,
            projectName: null,
        };
    });

    const fromFinance: InvoiceCenterItem[] = data.financeInvoices.map((inv) => {
        const total = money(Number(inv.total ?? 0));
        const paid = money(Number(inv.amount_paid ?? 0));
        return {
            id: inv.id,
            source: "finance",
            number: inv.number,
            accountOrClient: clientName(data, inv.client_id),
            clientId: inv.client_id ?? null,
            totalUsd: total,
            amountDueUsd: money(Math.max(0, total - paid)),
            amountPaidUsd: paid,
            status: inv.status,
            paymentStatus: paid >= total && total > 0 ? "paid" : paid > 0 ? "partial" : "unpaid",
            invoiceDate: inv.issue_date,
            dueDate: inv.due_date ?? null,
            daysOverdue: daysOverdue(inv.due_date),
            projectId: inv.project_id ?? null,
            projectName: projectName(data, inv.project_id),
        };
    });

    return [...fromBrv, ...fromFinance].sort(
        (a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime(),
    );
}

export function buildPaymentCenter(data: BillingFinanceRawData): PaymentCenterItem[] {
    const fromBrv: PaymentCenterItem[] = data.paymentAttempts.map((p) => ({
        id: p.id,
        source: "brv",
        accountOrClient: accountName(data, p.billing_account_id),
        amountUsd: money(Number(p.amount_usd ?? 0)),
        currency: p.currency_code || "INR",
        status: p.payment_status || p.status,
        method: "gateway",
        reference: p.gateway_reference || p.attempt_key,
        attemptedAt: p.attempted_at || p.created_at,
        failureReason: p.failure_reason ? p.failure_reason : null,
    }));

    const fromFinance: PaymentCenterItem[] = data.financePayments.map((p) => ({
        id: p.id,
        source: "finance",
        accountOrClient: clientName(data, p.client_id),
        amountUsd: money(Number(p.amount ?? 0)),
        currency: "INR",
        status: p.status,
        method: p.method || "unknown",
        reference: p.reference || p.id.slice(0, 8),
        attemptedAt: p.payment_date || p.created_at,
        failureReason: isFailedPayment(p.status) ? p.status : null,
    }));

    return [...fromBrv, ...fromFinance].sort(
        (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime(),
    );
}

export function buildRevenueDashboard(
    data: BillingFinanceRawData,
    subscriptions: SubscriptionManagementItem[],
    invoices: InvoiceCenterItem[],
    payments: PaymentCenterItem[],
): RevenueDashboardMetrics {
    const activeSubscriptions = subscriptions.filter((s) => s.status.toLowerCase() === "active").length;
    const mrrFromSubs = money(subscriptions.filter((s) => s.status.toLowerCase() === "active").reduce((sum, s) => sum + s.mrrUsd, 0));
    const latestMrr = data.mrrSnapshots[0];
    const previousMrr = data.mrrSnapshots[1];
    const mrrUsd = money(Number(latestMrr?.mrr_usd ?? mrrFromSubs));
    const arrFromSnap = money(Number(data.arrSnapshots[0]?.arr_usd ?? mrrUsd * 12));
    const outstandingFromBrv = money(data.outstandingBalances.reduce((s, b) => s + Number(b.total_outstanding_usd ?? 0), 0));
    const outstandingFromInvoices = money(invoices.reduce((s, i) => s + i.amountDueUsd, 0));
    const outstandingUsd = outstandingFromBrv > 0 ? outstandingFromBrv : outstandingFromInvoices;
    const collectedUsd = money(payments.filter((p) => isPaidPayment(p.status)).reduce((s, p) => s + p.amountUsd, 0));
    const failedPaymentCount = payments.filter((p) => isFailedPayment(p.status)).length;
    const collectionCasesOpen = data.collectionCases.filter((c) => !["closed", "resolved", "won"].includes(c.status.toLowerCase())).length;

    const months = new Map<string, { collectedUsd: number; invoicedUsd: number }>();
    for (const inv of invoices) {
        const key = monthKey(inv.invoiceDate);
        const row = months.get(key) ?? { collectedUsd: 0, invoicedUsd: 0 };
        row.invoicedUsd += inv.totalUsd;
        row.collectedUsd += inv.amountPaidUsd;
        months.set(key, row);
    }
    for (const pay of payments.filter((p) => isPaidPayment(p.status))) {
        const key = monthKey(pay.attemptedAt);
        const row = months.get(key) ?? { collectedUsd: 0, invoicedUsd: 0 };
        row.collectedUsd += pay.amountUsd;
        months.set(key, row);
    }

    const revenueByMonth = [...months.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, values]) => ({
            month,
            collectedUsd: money(values.collectedUsd),
            invoicedUsd: money(values.invoicedUsd),
        }));

    const outstandingByAccount = new Map<string, number>();
    for (const inv of invoices) {
        outstandingByAccount.set(inv.accountOrClient, money((outstandingByAccount.get(inv.accountOrClient) ?? 0) + inv.amountDueUsd));
    }
    const mrrByAccount = new Map<string, number>();
    for (const sub of subscriptions) {
        mrrByAccount.set(sub.accountName, money((mrrByAccount.get(sub.accountName) ?? 0) + sub.mrrUsd));
    }
    const names = new Set([...mrrByAccount.keys(), ...outstandingByAccount.keys()]);
    const topAccounts = [...names]
        .map((name) => ({
            name,
            mrrUsd: mrrByAccount.get(name) ?? 0,
            outstandingUsd: outstandingByAccount.get(name) ?? 0,
        }))
        .sort((a, b) => b.mrrUsd + b.outstandingUsd - (a.mrrUsd + a.outstandingUsd))
        .slice(0, 8);

    return {
        mrrUsd,
        arrUsd: arrFromSnap,
        collectedUsd: money(collectedUsd),
        outstandingUsd,
        invoiceCount: invoices.length,
        paidInvoiceCount: invoices.filter((i) => i.amountDueUsd <= 0 || i.paymentStatus.toLowerCase() === "paid").length,
        failedPaymentCount,
        activeSubscriptions,
        collectionCasesOpen,
        mrrTrend: trendFromValues(mrrUsd, Number(previousMrr?.mrr_usd ?? mrrUsd)),
        revenueByMonth,
        topAccounts,
    };
}

export function buildFinanceExecutiveWidgets(input: {
    subscriptions: SubscriptionManagementItem[];
    invoices: InvoiceCenterItem[];
    payments: PaymentCenterItem[];
    revenue: RevenueDashboardMetrics;
}): FinanceExecutiveWidgets {
    const billed = input.invoices.reduce((s, i) => s + i.totalUsd, 0);
    const paid = input.invoices.reduce((s, i) => s + i.amountPaidUsd, 0);
    const collectionRate = billed <= 0 ? 100 : clampScore((paid / billed) * 100);

    return {
        mrrUsd: input.revenue.mrrUsd,
        arrUsd: input.revenue.arrUsd,
        outstandingUsd: input.revenue.outstandingUsd,
        collectionRate,
        renewalsNext30Days: input.subscriptions.filter(
            (s) => s.daysToRenewal !== null && s.daysToRenewal >= 0 && s.daysToRenewal <= 30,
        ).length,
        failedPayments: input.payments
            .filter((p) => isFailedPayment(p.status))
            .slice(0, 8)
            .map((p) => ({
                account: p.accountOrClient,
                amountUsd: p.amountUsd,
                reason: p.failureReason || p.status,
            })),
        revenueTrend: input.revenue.revenueByMonth.map((r) => ({
            month: r.month,
            collectedUsd: r.collectedUsd,
        })),
        openCollectionCases: input.revenue.collectionCasesOpen,
    };
}

export function createEmptyBillingFinanceSnapshot(): BillingFinanceSnapshot {
    return {
        organizationId: null,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        stats: {
            activeSubscriptions: 0,
            mrrUsd: 0,
            arrUsd: 0,
            outstandingUsd: 0,
            collectedUsd: 0,
            openInvoices: 0,
            failedPayments: 0,
        },
        subscriptions: [],
        invoices: [],
        payments: [],
        estimates: [],
        expenses: [],
        revenue: {
            mrrUsd: 0,
            arrUsd: 0,
            collectedUsd: 0,
            outstandingUsd: 0,
            invoiceCount: 0,
            paidInvoiceCount: 0,
            failedPaymentCount: 0,
            activeSubscriptions: 0,
            collectionCasesOpen: 0,
            mrrTrend: "flat",
            revenueByMonth: [],
            topAccounts: [],
        },
        executiveWidgets: {
            mrrUsd: 0,
            arrUsd: 0,
            outstandingUsd: 0,
            collectionRate: 100,
            renewalsNext30Days: 0,
            failedPayments: [],
            revenueTrend: [],
            openCollectionCases: 0,
        },
        assistant: {
            dailySummary: "No organization context loaded.",
            accountsNeedingAttention: [],
            collectionRecommendations: [],
            subscriptionInsights: [],
            revenueInsights: [],
            executiveSummary: "Sign in to load Billing & Finance OS.",
            generatedAt: new Date().toISOString(),
        },
    };
}

export function buildBillingFinanceSnapshot(data: BillingFinanceRawData): BillingFinanceSnapshot {
    const subscriptions = buildSubscriptions(data);
    const invoices = buildInvoiceCenter(data);
    const payments = buildPaymentCenter(data);
    const revenue = buildRevenueDashboard(data, subscriptions, invoices, payments);
    const executiveWidgets = buildFinanceExecutiveWidgets({ subscriptions, invoices, payments, revenue });

    return {
        organizationId: data.organizationId,
        source: "supabase",
        fetchedAt: data.fetchedAt,
        stats: {
            activeSubscriptions: revenue.activeSubscriptions,
            mrrUsd: revenue.mrrUsd,
            arrUsd: revenue.arrUsd,
            outstandingUsd: revenue.outstandingUsd,
            collectedUsd: revenue.collectedUsd,
            openInvoices: invoices.filter((i) => isOpenInvoiceStatus(i.status) && i.amountDueUsd > 0).length,
            failedPayments: revenue.failedPaymentCount,
        },
        subscriptions,
        invoices,
        payments,
        estimates: [],
        expenses: [],
        revenue,
        executiveWidgets,
        assistant: {
            dailySummary: "",
            accountsNeedingAttention: [],
            collectionRecommendations: [],
            subscriptionInsights: [],
            revenueInsights: [],
            executiveSummary: "",
            generatedAt: data.fetchedAt,
        },
    };
}
