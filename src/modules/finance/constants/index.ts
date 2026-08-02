export const FINANCE_TABS = {
    overview: "overview",
    invoices: "invoices",
    estimates: "estimates",
    payments: "payments",
    expenses: "expenses",
    recurring: "recurring",
    taxes: "taxes",
    reports: "reports",
} as const;

export const INVOICE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "void", label: "Void" },
] as const;

export const ESTIMATE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
    { value: "expired", label: "Expired" },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
    { value: "wire", label: "Wire" },
    { value: "ach", label: "ACH" },
    { value: "card", label: "Card" },
    { value: "check", label: "Check" },
] as const;

export const EXPENSE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "reimbursed", label: "Reimbursed" },
] as const;

export const RECURRING_FREQUENCY_OPTIONS = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annual", label: "Annual" },
] as const;

export const EXPENSE_CATEGORY_OPTIONS = [
    { value: "travel", label: "Travel" },
    { value: "software", label: "Software" },
    { value: "contractor", label: "Contractor" },
    { value: "general", label: "General" },
] as const;

export const INVOICE_STATUS_FILTERS = {
    all: "all",
    draft: "draft",
    sent: "sent",
    paid: "paid",
    overdue: "overdue",
} as const;
