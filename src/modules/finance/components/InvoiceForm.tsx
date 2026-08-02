"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { INVOICE_STATUS_OPTIONS } from "@/src/modules/finance/constants";
import { invoiceFormSchema, type InvoiceFormValues } from "@/src/modules/finance/schemas";
import type { FinanceClientOption, FinanceProjectOption } from "@/src/modules/finance/types";

interface InvoiceFormProps {
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    onSubmit: (values: InvoiceFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function InvoiceForm({ clients, projects, onSubmit, submitLabel = "Create Invoice" }: InvoiceFormProps) {
    const [defaultValues] = useState<InvoiceFormValues>(() => ({
        number: `INV-${Date.now().toString().slice(-4)}`,
        status: "draft",
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: "",
        notes: "",
        lineItems: [{ description: "Professional services", quantity: 1, unitPrice: 1000 }],
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues,
    });

    return (
        <Card hover>
            <SectionHeader title="Invoice form" description="Create invoices linked to clients and projects" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Invoice Number</label>
                        <input {...register("number")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        {errors.number ? <p className="mt-1 text-xs text-rose-600">{errors.number.message}</p> : null}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                        <select {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {INVOICE_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Client</label>
                        <select {...register("clientId")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            <option value="">Select client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Project</label>
                        <select {...register("projectId")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            <option value="">Select project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Issue Date</label>
                        <input type="date" {...register("issueDate")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Due Date</label>
                        <input type="date" {...register("dueDate")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium">Line Item Description</label>
                        <input {...register("lineItems.0.description")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Unit Price</label>
                        <input type="number" step="0.01" {...register("lineItems.0.unitPrice", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <input type="hidden" {...register("lineItems.0.quantity", { valueAsNumber: true })} value={1} />
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Notes</label>
                    <textarea {...register("notes")} rows={2} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                </div>
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
