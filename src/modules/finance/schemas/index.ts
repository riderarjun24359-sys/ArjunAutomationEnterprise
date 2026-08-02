import { z } from "zod";

export const lineItemSchema = z.object({
    description: z.string().min(2, "Description is required"),
    quantity: z.number().min(0.01, "Quantity must be greater than zero"),
    unitPrice: z.number().min(0, "Unit price must be zero or greater"),
});

export const invoiceFormSchema = z.object({
    number: z.string().min(2, "Invoice number is required"),
    status: z.enum(["draft", "sent", "paid", "overdue", "void"]),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    issueDate: z.string().min(1, "Issue date is required"),
    dueDate: z.string().optional(),
    notes: z.string().optional(),
    lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const estimateFormSchema = z.object({
    number: z.string().min(2, "Estimate number is required"),
    status: z.enum(["draft", "sent", "accepted", "declined", "expired"]),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    issueDate: z.string().min(1, "Issue date is required"),
    validUntil: z.string().optional(),
    notes: z.string().optional(),
    lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const paymentFormSchema = z.object({
    invoiceId: z.string().min(1, "Invoice is required"),
    amount: z.number().min(0.01, "Amount must be greater than zero"),
    paymentDate: z.string().min(1, "Payment date is required"),
    method: z.enum(["card", "ach", "check", "wire"]),
    reference: z.string().optional(),
});

export const expenseFormSchema = z.object({
    category: z.string().min(2, "Category is required"),
    description: z.string().min(2, "Description is required"),
    amount: z.number().min(0.01, "Amount must be greater than zero"),
    expenseDate: z.string().min(1, "Expense date is required"),
    status: z.enum(["pending", "approved", "reimbursed"]).optional(),
    submittedBy: z.string().optional(),
    projectId: z.string().optional(),
    clientId: z.string().optional(),
});

export const recurringInvoiceFormSchema = z.object({
    title: z.string().min(2, "Title is required"),
    clientId: z.string().min(1, "Client is required"),
    projectId: z.string().optional(),
    frequency: z.enum(["weekly", "monthly", "quarterly", "annual"]),
    nextRunDate: z.string().min(1, "Next run date is required"),
    endDate: z.string().optional(),
    subtotal: z.number().min(0),
    taxAmount: z.number().min(0),
    total: z.number().min(0),
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const taxRateFormSchema = z.object({
    name: z.string().min(2, "Tax name is required"),
    ratePercent: z.number().min(0).max(100),
    isDefault: z.boolean().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type EstimateFormValues = z.infer<typeof estimateFormSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
export type RecurringInvoiceFormValues = z.infer<typeof recurringInvoiceFormSchema>;
export type TaxRateFormValues = z.infer<typeof taxRateFormSchema>;
