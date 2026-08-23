import { Estimate, Expense } from "@/src/modules/finance/types";

export type BillingFinanceOsTab =
    | "subscriptions"
    | "invoices"
    | "payments"
    | "revenue"
    | "assistant";

export interface SubscriptionManagementItem {
    id: string;
    billingAccountId: string;
    accountName: string;
    planName: string;
    billingCycle: string;
    amountUsd: number;
    mrrUsd: number;
    arrUsd: number;
    quantity: number;
    status: string;
    paymentStatus: string;
    startsAt: string;
    renewsAt: string | null;
    daysToRenewal: number | null;
}

export interface InvoiceCenterItem {
    id: string;
    source: "brv" | "finance";
    number: string;
    accountOrClient: string;
    clientId: string | null;
    totalUsd: number;
    amountDueUsd: number;
    amountPaidUsd: number;
    status: string;
    paymentStatus: string;
    invoiceDate: string;
    dueDate: string | null;
    daysOverdue: number | null;
    projectId: string | null;
    projectName: string | null;
}

export interface PaymentCenterItem {
    id: string;
    source: "brv" | "finance";
    accountOrClient: string;
    amountUsd: number;
    currency: string;
    status: string;
    method: string;
    reference: string;
    attemptedAt: string;
    failureReason: string | null;
}

export interface RevenueDashboardMetrics {
    mrrUsd: number;
    arrUsd: number;
    collectedUsd: number;
    outstandingUsd: number;
    invoiceCount: number;
    paidInvoiceCount: number;
    failedPaymentCount: number;
    activeSubscriptions: number;
    collectionCasesOpen: number;
    mrrTrend: "up" | "down" | "flat";
    revenueByMonth: Array<{ month: string; collectedUsd: number; invoicedUsd: number }>;
    topAccounts: Array<{ name: string; mrrUsd: number; outstandingUsd: number }>;
}

export interface FinanceExecutiveWidgets {
    mrrUsd: number;
    arrUsd: number;
    outstandingUsd: number;
    collectionRate: number;
    renewalsNext30Days: number;
    failedPayments: Array<{ account: string; amountUsd: number; reason: string }>;
    revenueTrend: Array<{ month: string; collectedUsd: number }>;
    openCollectionCases: number;
}

export interface AiFinanceAssistant {
    dailySummary: string;
    accountsNeedingAttention: string[];
    collectionRecommendations: string[];
    subscriptionInsights: string[];
    revenueInsights: string[];
    executiveSummary: string;
    generatedAt: string;
}

export interface BillingFinanceOsStats {
    activeSubscriptions: number;
    mrrUsd: number;
    arrUsd: number;
    outstandingUsd: number;
    collectedUsd: number;
    openInvoices: number;
    failedPayments: number;
}

export interface BillingFinanceSnapshot {
    organizationId: string | null;
    source: "supabase" | "fallback";
    fetchedAt: string;
    stats: BillingFinanceOsStats;
    subscriptions: SubscriptionManagementItem[];
    invoices: InvoiceCenterItem[];
    payments: PaymentCenterItem[];
    estimates: Estimate[];
    expenses: Expense[];
    revenue: RevenueDashboardMetrics;
    executiveWidgets: FinanceExecutiveWidgets;
    assistant: AiFinanceAssistant;
}
