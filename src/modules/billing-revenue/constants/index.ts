export const BRV_TABS = {
    overview: "overview",
    billingAccounts: "billingAccounts",
    billingCycles: "billingCycles",
    subscriptionBillings: "subscriptionBillings",
    prorationRecords: "prorationRecords",
    paymentMethods: "paymentMethods",
    paymentAttempts: "paymentAttempts",
    refunds: "refunds",
    walletBalances: "walletBalances",
    mrrSnapshots: "mrrSnapshots",
    arrSnapshots: "arrSnapshots",
    deferredRevenue: "deferredRevenue",
    revenueRecognition: "revenueRecognition",
    invoices: "invoices",
    creditNotes: "creditNotes",
    debitNotes: "debitNotes",
    taxConfigs: "taxConfigs",
    outstandingBalances: "outstandingBalances",
    paymentReminders: "paymentReminders",
    collectionCases: "collectionCases",
    writeOffs: "writeOffs",
    analyticsSnapshots: "analyticsSnapshots",
    revenueGrowthMetrics: "revenueGrowthMetrics",
    cashFlowRecords: "cashFlowRecords",
    subscriptionTrends: "subscriptionTrends",
    renewalForecasts: "renewalForecasts",
    mrrForecasts: "mrrForecasts",
    arrForecasts: "arrForecasts",
    revenueProjections: "revenueProjections",
    financeMetrics: "financeMetrics",
    financialHealth: "financialHealth",
    expansionContraction: "expansionContraction",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const BILLING_CYCLE_OPTIONS = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annual", label: "Annual" },
    { value: "custom", label: "Custom" },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "succeeded", label: "Succeeded" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
    { value: "partial", label: "Partial" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const BRV_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "open", label: "Open" },
    { value: "overdue", label: "Overdue" },
    { value: "paid", label: "Paid" },
    { value: "closed", label: "Closed" },
] as const;

export const BRV_PERMISSIONS = ["brv.view", "brv.manage", "brv.approve", "brv.admin"] as const;

export const BRV_THEME = {
    primary: "amber-600",
    primaryHover: "amber-500",
    ring: "amber-500/20",
    text: "text-amber-600",
    textDark: "dark:text-amber-400",
    bg: "bg-amber-600",
    bgHover: "hover:bg-amber-500",
} as const;
