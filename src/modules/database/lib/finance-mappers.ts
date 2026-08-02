import { formatRelativeTimestamp } from "@/src/modules/database/lib/formatters";
import type {
    DbEstimate,
    DbEstimateLineItem,
    DbExpense,
    DbInvoice,
    DbInvoiceLineItem,
    DbPayment,
    DbRecurringInvoice,
    DbTaxRate,
} from "@/src/modules/database/types/platform";
import type {
    Estimate,
    EstimateLineItem,
    Expense,
    FinanceDashboardStats,
    FinanceReportSummary,
    Invoice,
    InvoiceLineItem,
    LineItemInput,
    Payment,
    RecurringInvoice,
    TaxRate,
} from "@/src/modules/finance/types";

export const formatMoney = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const computeLineTotals = (items: LineItemInput[], defaultTaxRate = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = items.reduce((sum, item) => {
        const lineSubtotal = item.quantity * item.unitPrice;
        const rate = item.taxRatePercent ?? defaultTaxRate;
        return sum + lineSubtotal * (rate / 100);
    }, 0);

    return {
        subtotal: Number(subtotal.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        total: Number((subtotal + taxAmount).toFixed(2)),
    };
};

export const mapTaxRate = (record: DbTaxRate): TaxRate => ({
    id: record.id,
    name: record.name,
    ratePercent: Number(record.rate_percent),
    isDefault: record.is_default,
});

export const mapInvoiceLineItem = (record: DbInvoiceLineItem): InvoiceLineItem => ({
    id: record.id,
    description: record.description,
    quantity: Number(record.quantity),
    unitPrice: Number(record.unit_price),
    taxRateId: record.tax_rate_id ?? null,
    amount: Number(record.amount),
    sortOrder: record.sort_order,
});

export const mapEstimateLineItem = (record: DbEstimateLineItem): EstimateLineItem => ({
    id: record.id,
    description: record.description,
    quantity: Number(record.quantity),
    unitPrice: Number(record.unit_price),
    taxRateId: record.tax_rate_id ?? null,
    amount: Number(record.amount),
    sortOrder: record.sort_order,
});

export const mapInvoice = (
    record: DbInvoice,
    lineItems: InvoiceLineItem[] = [],
    clientName?: string | null,
    projectName?: string | null,
): Invoice => ({
    id: record.id,
    number: record.number,
    status: record.status as Invoice["status"],
    clientId: record.client_id ?? null,
    clientName: clientName ?? "Unassigned",
    projectId: record.project_id ?? null,
    projectName: projectName ?? null,
    estimateId: record.estimate_id ?? null,
    issueDate: record.issue_date,
    dueDate: record.due_date ?? "",
    paidAt: record.paid_at ?? null,
    subtotal: Number(record.subtotal),
    taxAmount: Number(record.tax_amount),
    total: Number(record.total),
    amountPaid: Number(record.amount_paid),
    balanceDue: Number(record.total) - Number(record.amount_paid),
    currency: record.currency,
    notes: record.notes,
    lineItems,
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const mapEstimate = (
    record: DbEstimate,
    lineItems: EstimateLineItem[] = [],
    clientName?: string | null,
    projectName?: string | null,
): Estimate => ({
    id: record.id,
    number: record.number,
    status: record.status as Estimate["status"],
    clientId: record.client_id ?? null,
    clientName: clientName ?? "Unassigned",
    projectId: record.project_id ?? null,
    projectName: projectName ?? null,
    issueDate: record.issue_date,
    validUntil: record.valid_until ?? "",
    subtotal: Number(record.subtotal),
    taxAmount: Number(record.tax_amount),
    total: Number(record.total),
    currency: record.currency,
    notes: record.notes,
    lineItems,
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const mapPayment = (record: DbPayment, invoiceNumber?: string, clientName?: string | null): Payment => ({
    id: record.id,
    invoiceId: record.invoice_id,
    invoiceNumber: invoiceNumber ?? "—",
    clientId: record.client_id ?? null,
    clientName: clientName ?? "Unassigned",
    amount: Number(record.amount),
    paymentDate: record.payment_date,
    method: record.method as Payment["method"],
    reference: record.reference,
    status: record.status as Payment["status"],
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const mapExpense = (record: DbExpense, projectName?: string | null, clientName?: string | null): Expense => ({
    id: record.id,
    category: record.category,
    description: record.description,
    amount: Number(record.amount),
    expenseDate: record.expense_date,
    status: record.status as Expense["status"],
    submittedBy: record.submitted_by,
    projectId: record.project_id ?? null,
    projectName: projectName ?? null,
    clientId: record.client_id ?? null,
    clientName: clientName ?? null,
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const mapRecurringInvoice = (
    record: DbRecurringInvoice,
    clientName?: string | null,
    projectName?: string | null,
): RecurringInvoice => ({
    id: record.id,
    title: record.title,
    clientId: record.client_id,
    clientName: clientName ?? "Unassigned",
    projectId: record.project_id ?? null,
    projectName: projectName ?? null,
    frequency: record.frequency as RecurringInvoice["frequency"],
    nextRunDate: record.next_run_date,
    endDate: record.end_date ?? null,
    subtotal: Number(record.subtotal),
    taxAmount: Number(record.tax_amount),
    total: Number(record.total),
    currency: record.currency,
    isActive: record.is_active,
    notes: record.notes,
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const buildFinanceDashboardStats = (input: {
    invoices: Invoice[];
    payments: Payment[];
    expenses: Expense[];
    estimates: Estimate[];
    recurringInvoices: RecurringInvoice[];
}): FinanceDashboardStats => {
    const paidRevenue = input.invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.total, 0);
    const outstanding = input.invoices
        .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
        .reduce((sum, invoice) => sum + invoice.balanceDue, 0);
    const overdueCount = input.invoices.filter((invoice) => invoice.status === "overdue" || (invoice.status === "sent" && invoice.dueDate && new Date(invoice.dueDate) < new Date())).length;
    const expenseTotal = input.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const approvedExpenses = input.expenses.filter((expense) => expense.status === "approved" || expense.status === "reimbursed").reduce((sum, expense) => sum + expense.amount, 0);

    return {
        paidRevenue: formatMoney(paidRevenue),
        outstandingReceivables: formatMoney(outstanding),
        overdueInvoices: overdueCount,
        totalExpenses: formatMoney(expenseTotal),
        approvedExpenses: formatMoney(approvedExpenses),
        netPosition: formatMoney(paidRevenue - approvedExpenses),
        openEstimates: input.estimates.filter((estimate) => estimate.status === "sent" || estimate.status === "draft").length,
        activeRecurring: input.recurringInvoices.filter((item) => item.isActive).length,
        paymentCount: input.payments.length,
    };
};

export const buildFinanceReportSummary = (input: {
    invoices: Invoice[];
    payments: Payment[];
    expenses: Expense[];
}): FinanceReportSummary => {
    const revenueByClient = input.invoices.reduce<Record<string, number>>((map, invoice) => {
        map[invoice.clientName] = (map[invoice.clientName] ?? 0) + invoice.total;
        return map;
    }, {});

    const expensesByCategory = input.expenses.reduce<Record<string, number>>((map, expense) => {
        map[expense.category] = (map[expense.category] ?? 0) + expense.amount;
        return map;
    }, {});

    const totalRevenue = input.invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalCollected = input.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalExpenses = input.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
        totalRevenue: formatMoney(totalRevenue),
        totalCollected: formatMoney(totalCollected),
        totalExpenses: formatMoney(totalExpenses),
        grossMargin: formatMoney(totalCollected - totalExpenses),
        revenueByClient: Object.entries(revenueByClient)
            .map(([client, amount]) => ({ client, amount: formatMoney(amount) }))
            .sort((a, b) => b.amount.localeCompare(a.amount)),
        expensesByCategory: Object.entries(expensesByCategory)
            .map(([category, amount]) => ({ category, amount: formatMoney(amount) }))
            .sort((a, b) => b.amount.localeCompare(a.amount)),
        agingBuckets: [
            { label: "Current", amount: formatMoney(input.invoices.filter((invoice) => invoice.status === "sent").reduce((sum, invoice) => sum + invoice.balanceDue, 0)) },
            { label: "Paid", amount: formatMoney(input.invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.total, 0)) },
            { label: "Draft", amount: formatMoney(input.invoices.filter((invoice) => invoice.status === "draft").reduce((sum, invoice) => sum + invoice.total, 0)) },
        ],
    };
};

export const buildInvoicePayload = (organizationId: string, input: {
    number: string;
    status: string;
    clientId?: string | null;
    projectId?: string | null;
    estimateId?: string | null;
    issueDate: string;
    dueDate?: string;
    currency?: string;
    notes?: string;
    lineItems: LineItemInput[];
    defaultTaxRate?: number;
}) => {
    const totals = computeLineTotals(input.lineItems, input.defaultTaxRate ?? 0);
    return {
        organization_id: organizationId,
        client_id: input.clientId || null,
        project_id: input.projectId || null,
        estimate_id: input.estimateId || null,
        number: input.number,
        status: input.status,
        issue_date: input.issueDate,
        due_date: input.dueDate || null,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total: totals.total,
        amount_paid: 0,
        currency: input.currency ?? "USD",
        notes: input.notes ?? "",
    };
};

export const buildEstimatePayload = (organizationId: string, input: {
    number: string;
    status: string;
    clientId?: string | null;
    projectId?: string | null;
    issueDate: string;
    validUntil?: string;
    currency?: string;
    notes?: string;
    lineItems: LineItemInput[];
    defaultTaxRate?: number;
}) => {
    const totals = computeLineTotals(input.lineItems, input.defaultTaxRate ?? 0);
    return {
        organization_id: organizationId,
        client_id: input.clientId || null,
        project_id: input.projectId || null,
        number: input.number,
        status: input.status,
        issue_date: input.issueDate,
        valid_until: input.validUntil || null,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total: totals.total,
        currency: input.currency ?? "USD",
        notes: input.notes ?? "",
    };
};

export const buildLineItemRecords = (parentId: string, parentKey: "invoice_id" | "estimate_id", items: LineItemInput[]) =>
    items.map((item, index) => ({
        [parentKey]: parentId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        tax_rate_id: item.taxRateId || null,
        amount: Number((item.quantity * item.unitPrice).toFixed(2)),
        sort_order: index + 1,
    }));

export const buildPaymentPayload = (organizationId: string, input: {
    invoiceId: string;
    clientId?: string | null;
    amount: number;
    paymentDate: string;
    method: string;
    reference?: string;
    status?: string;
}) => ({
    organization_id: organizationId,
    invoice_id: input.invoiceId,
    client_id: input.clientId || null,
    amount: input.amount,
    payment_date: input.paymentDate,
    method: input.method,
    reference: input.reference ?? "",
    status: input.status ?? "completed",
});

export const buildExpensePayload = (organizationId: string, input: {
    category: string;
    description: string;
    amount: number;
    expenseDate: string;
    status?: string;
    submittedBy?: string;
    projectId?: string | null;
    clientId?: string | null;
}) => ({
    organization_id: organizationId,
    category: input.category,
    description: input.description,
    amount: input.amount,
    expense_date: input.expenseDate,
    status: input.status ?? "pending",
    submitted_by: input.submittedBy ?? "",
    project_id: input.projectId || null,
    client_id: input.clientId || null,
});

export const buildRecurringInvoicePayload = (organizationId: string, input: {
    title: string;
    clientId: string;
    projectId?: string | null;
    frequency: string;
    nextRunDate: string;
    endDate?: string | null;
    subtotal: number;
    taxAmount: number;
    total: number;
    currency?: string;
    isActive?: boolean;
    notes?: string;
}) => ({
    organization_id: organizationId,
    client_id: input.clientId,
    project_id: input.projectId || null,
    title: input.title,
    frequency: input.frequency,
    next_run_date: input.nextRunDate,
    end_date: input.endDate || null,
    subtotal: input.subtotal,
    tax_amount: input.taxAmount,
    total: input.total,
    currency: input.currency ?? "USD",
    is_active: input.isActive ?? true,
    notes: input.notes ?? "",
});

export const buildTaxRatePayload = (organizationId: string, input: { name: string; ratePercent: number; isDefault?: boolean }) => ({
    organization_id: organizationId,
    name: input.name,
    rate_percent: input.ratePercent,
    is_default: input.isDefault ?? false,
});

export const buildFinanceActivityPayload = (organizationId: string, entityType: string, entityId: string, action: string, title: string, detail: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    title,
    detail,
    metadata: {},
});
