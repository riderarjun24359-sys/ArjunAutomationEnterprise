export const AFBE_THEME = {
    title: "AI Finance & Billing Engine",
    subtitle:
        "Enterprise finance and billing: executive dashboard, invoices, payments, expenses, subscriptions, revenue analytics, tax/GST, AI insights, reports, automation, and founder intelligence — live multi-tenant Founder/Admin operations.",
} as const;

export const AFBE_TABS = {
    dashboard: "dashboard",
    invoices: "invoices",
    payments: "payments",
    expenses: "expenses",
    subscriptions: "subscriptions",
    revenue: "revenue",
    tax: "tax",
    insights: "insights",
    reports: "reports",
    automation: "automation",
    executive: "executive",
} as const;

export type AfbeTab = (typeof AFBE_TABS)[keyof typeof AFBE_TABS];

export const AFBE_TAB_LIST: Array<{ id: AfbeTab; label: string }> = [
    { id: AFBE_TABS.dashboard, label: "Executive Finance Dashboard" },
    { id: AFBE_TABS.invoices, label: "Invoice Center" },
    { id: AFBE_TABS.payments, label: "Payment Center" },
    { id: AFBE_TABS.expenses, label: "Expense Manager" },
    { id: AFBE_TABS.subscriptions, label: "Subscription Billing" },
    { id: AFBE_TABS.revenue, label: "Revenue Analytics" },
    { id: AFBE_TABS.tax, label: "Tax & GST" },
    { id: AFBE_TABS.insights, label: "AI Financial Insights" },
    { id: AFBE_TABS.reports, label: "Financial Reports" },
    { id: AFBE_TABS.automation, label: "Automation Center" },
    { id: AFBE_TABS.executive, label: "Executive Intelligence" },
];

export const AFBE_INVOICE_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"] as const;
export type AfbeInvoiceStatus = (typeof AFBE_INVOICE_STATUSES)[number];

export const AFBE_PAYMENT_METHODS = ["stripe", "razorpay", "bank_transfer", "upi", "other"] as const;
export type AfbePaymentMethod = (typeof AFBE_PAYMENT_METHODS)[number];

export const AFBE_SUBSCRIPTION_BUCKETS = [
    "plans",
    "active",
    "trial",
    "renewals",
    "upgrades",
    "downgrades",
    "cancellations",
] as const;
export type AfbeSubscriptionBucket = (typeof AFBE_SUBSCRIPTION_BUCKETS)[number];

export const AFBE_AUTOMATION_KINDS = [
    "recurring_invoice",
    "payment_reminder",
    "overdue_notice",
    "subscription_renewal",
    "finance_notification",
] as const;
export type AfbeAutomationKind = (typeof AFBE_AUTOMATION_KINDS)[number];
