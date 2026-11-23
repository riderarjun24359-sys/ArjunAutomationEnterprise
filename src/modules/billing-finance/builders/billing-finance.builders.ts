import type { BillingFinanceRawData } from "../types/raw";
import type {
    BillingFinanceSnapshot,
    FinanceExecutiveWidgets,
    InvoiceCenterItem,
    PaymentCenterItem,
    RevenueDashboardMetrics,
    SubscriptionManagementItem,
} from "../types/os";
import { clampScore, daysOverdue, daysUntil, money } from "../utils/formatters";

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

export function buildRevenueDashboard(
    data: BillingFinanceRawData,
    subscriptions: SubscriptionManagementItem[],
    invoices: InvoiceCenterItem[],
    payments: PaymentCenterItem[],
): RevenueDashboardMetrics {
    // Legacy BRV USD snapshots/amounts and unlinked finance records are not verified INR settlements.
    // Keep operational counts, but fail closed for all revenue values until exact invoice/deal reconciliation exists.
    const failedPaymentCount = payments.filter((p) => isFailedPayment(p.status)).length;
    const collectionCasesOpen = data.collectionCases.filter((c) => !["closed", "resolved", "won"].includes(c.status.toLowerCase())).length;

    return {
        revenueVerified: false,
        mrrUsd: 0,
        arrUsd: 0,
        collectedUsd: 0,
        outstandingUsd: 0,
        invoiceCount: invoices.length,
        paidInvoiceCount: 0,
        failedPaymentCount,
        activeSubscriptions: subscriptions.filter((s) => s.status.toLowerCase() === "active").length,
        collectionCasesOpen,
        mrrTrend: "flat",
        revenueByMonth: [],
        topAccounts: [],
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
    const collectionRate = input.revenue.revenueVerified && billed > 0 ? clampScore((paid / billed) * 100) : 0;

    return {
        revenueVerified: input.revenue.revenueVerified,
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
            revenueVerified: false,
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
            revenueVerified: false,
            mrrUsd: 0,
            arrUsd: 0,
            outstandingUsd: 0,
            collectionRate: 0,
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
