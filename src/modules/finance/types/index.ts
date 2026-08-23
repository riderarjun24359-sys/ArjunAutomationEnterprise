export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";
export type EstimateStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
export type PaymentMethod = "card" | "ach" | "check" | "wire";
export type PaymentStatus = "completed" | "pending" | "failed";
export type ExpenseStatus = "pending" | "approved" | "reimbursed";
export type RecurringFrequency = "weekly" | "monthly" | "quarterly" | "annual";

export interface LineItemInput {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRateId?: string | null;
    taxRatePercent?: number;
}

export interface InvoiceLineItem extends LineItemInput {
    id: string;
    amount: number;
    sortOrder: number;
}

export interface EstimateLineItem extends LineItemInput {
    id: string;
    amount: number;
    sortOrder: number;
}

export interface TaxRate {
    id: string;
    name: string;
    ratePercent: number;
    isDefault: boolean;
}

export interface Invoice {
    id: string;
    number: string;
    status: InvoiceStatus;
    clientId: string | null;
    clientName: string;
    projectId: string | null;
    projectName: string | null;
    estimateId: string | null;
    issueDate: string;
    dueDate: string;
    paidAt: string | null;
    subtotal: number;
    taxAmount: number;
    total: number;
    amountPaid: number;
    balanceDue: number;
    currency: string;
    notes: string;
    lineItems: InvoiceLineItem[];
    updatedAt: string;
}

export interface Estimate {
    id: string;
    number: string;
    status: EstimateStatus;
    clientId: string | null;
    clientName: string;
    projectId: string | null;
    projectName: string | null;
    issueDate: string;
    validUntil: string;
    subtotal: number;
    taxAmount: number;
    total: number;
    currency: string;
    notes: string;
    lineItems: EstimateLineItem[];
    updatedAt: string;
}

export interface Payment {
    id: string;
    invoiceId: string;
    invoiceNumber: string;
    clientId: string | null;
    clientName: string;
    amount: number;
    paymentDate: string;
    method: PaymentMethod;
    reference: string;
    status: PaymentStatus;
    updatedAt: string;
}

export interface Expense {
    id: string;
    category: string;
    description: string;
    amount: number;
    expenseDate: string;
    status: ExpenseStatus;
    submittedBy: string;
    projectId: string | null;
    projectName: string | null;
    clientId: string | null;
    clientName: string | null;
    updatedAt: string;
}

export interface RecurringInvoice {
    id: string;
    title: string;
    clientId: string;
    clientName: string;
    projectId: string | null;
    projectName: string | null;
    frequency: RecurringFrequency;
    nextRunDate: string;
    endDate: string | null;
    subtotal: number;
    taxAmount: number;
    total: number;
    currency: string;
    isActive: boolean;
    notes: string;
    updatedAt: string;
}

export interface FinanceDashboardStats {
    paidRevenue: string;
    outstandingReceivables: string;
    overdueInvoices: number;
    totalExpenses: string;
    approvedExpenses: string;
    netPosition: string;
    openEstimates: number;
    activeRecurring: number;
    paymentCount: number;
}

export interface FinanceReportSummary {
    totalRevenue: string;
    totalCollected: string;
    totalExpenses: string;
    grossMargin: string;
    revenueByClient: Array<{ client: string; amount: string }>;
    expensesByCategory: Array<{ category: string; amount: string }>;
    agingBuckets: Array<{ label: string; amount: string }>;
}

export interface FinanceClientOption {
    id: string;
    name: string;
}

export interface FinanceProjectOption {
    id: string;
    name: string;
    clientId: string | null;
}

export interface CreateInvoiceInput {
    number: string;
    status: InvoiceStatus;
    clientId?: string | null;
    projectId?: string | null;
    issueDate: string;
    dueDate?: string;
    notes?: string;
    lineItems: LineItemInput[];
}

export interface CreateEstimateInput {
    number: string;
    status: EstimateStatus;
    clientId?: string | null;
    projectId?: string | null;
    issueDate: string;
    validUntil?: string;
    notes?: string;
    lineItems: LineItemInput[];
}

export interface CreatePaymentInput {
    invoiceId: string;
    amount: number;
    paymentDate: string;
    method: PaymentMethod;
    reference?: string;
}

export interface CreateExpenseInput {
    category: string;
    description: string;
    amount: number;
    expenseDate: string;
    status?: ExpenseStatus;
    submittedBy?: string;
    projectId?: string | null;
    clientId?: string | null;
}

export interface CreateRecurringInvoiceInput {
    title: string;
    clientId: string;
    projectId?: string | null;
    frequency: RecurringFrequency;
    nextRunDate: string;
    endDate?: string | null;
    subtotal: number;
    taxAmount: number;
    total: number;
    notes?: string;
    isActive?: boolean;
}

export interface CreateTaxRateInput {
    name: string;
    ratePercent: number;
    isDefault?: boolean;
}

export type InvoiceStatusFilter = "all" | InvoiceStatus;

export type EstimateFormValues = Omit<CreateEstimateInput, 'status'>;
export type ExpenseFormValues = Omit<CreateExpenseInput, 'status'>;
export type TaxRateFormValues = Omit<CreateTaxRateInput, 'isDefault'>;
