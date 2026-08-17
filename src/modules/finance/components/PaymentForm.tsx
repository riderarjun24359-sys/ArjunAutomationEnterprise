"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { PAYMENT_METHOD_OPTIONS } from "@/src/modules/finance/constants";
import { paymentFormSchema, type PaymentFormValues } from "@/src/modules/finance/schemas";
import type { Invoice } from "@/src/modules/finance/types";

interface PaymentFormProps {
    invoices: Invoice[];
    onSubmit: (values: PaymentFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function PaymentForm({ invoices, onSubmit, submitLabel = "Record Payment" }: PaymentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            paymentDate: new Date().toISOString().slice(0, 10),
            method: "wire",
            reference: "",
        },
    });

    const openInvoices = invoices.filter((invoice) => invoice.balanceDue > 0);

    return (
        <Card hover>
            <SectionHeader title="Payment form" description="Record payments against open invoices" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Invoice</label>
                    <select {...register("invoiceId")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                        <option value="">Select invoice</option>
                        {openInvoices.map((invoice) => (
                            <option key={invoice.id} value={invoice.id}>
                                {invoice.number} — {invoice.clientName} (${invoice.balanceDue.toFixed(2)} due)
                            </option>
                        ))}
                    </select>
                    {errors.invoiceId ? <p className="mt-1 text-xs text-rose-600">{errors.invoiceId.message}</p> : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Amount</label>
                        <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        {errors.amount ? <p className="mt-1 text-xs text-rose-600">{errors.amount.message}</p> : null}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Payment Date</label>
                        <input type="date" {...register("paymentDate")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Method</label>
                        <select {...register("method")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {PAYMENT_METHOD_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Reference</label>
                        <input {...register("reference")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
