"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { RECURRING_FREQUENCY_OPTIONS } from "@/src/modules/finance/constants";
import { recurringInvoiceFormSchema, type RecurringInvoiceFormValues } from "@/src/modules/finance/schemas";
import type { FinanceClientOption, FinanceProjectOption } from "@/src/modules/finance/types";

interface RecurringFormProps {
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    onSubmit: (values: RecurringInvoiceFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function RecurringForm({ clients, projects, onSubmit, submitLabel = "Create Recurring Invoice" }: RecurringFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RecurringInvoiceFormValues>({
        resolver: zodResolver(recurringInvoiceFormSchema),
        defaultValues: {
            title: "",
            frequency: "monthly",
            nextRunDate: new Date().toISOString().slice(0, 10),
            subtotal: 1000,
            taxAmount: 85,
            total: 1085,
            isActive: true,
            notes: "",
        },
    });

    return (
        <Card hover>
            <SectionHeader title="Recurring invoice form" description="Automate recurring billing schedules" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Title</label>
                    <input {...register("title")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p> : null}
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
                        {errors.clientId ? <p className="mt-1 text-xs text-rose-600">{errors.clientId.message}</p> : null}
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
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Frequency</label>
                        <select {...register("frequency")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {RECURRING_FREQUENCY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Next Run</label>
                        <input type="date" {...register("nextRunDate")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">End Date</label>
                        <input type="date" {...register("endDate")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Subtotal</label>
                        <input type="number" step="0.01" {...register("subtotal", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Tax</label>
                        <input type="number" step="0.01" {...register("taxAmount", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Total</label>
                        <input type="number" step="0.01" {...register("total", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register("isActive")} className="rounded border-slate-300" />
                    Active schedule
                </label>
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
