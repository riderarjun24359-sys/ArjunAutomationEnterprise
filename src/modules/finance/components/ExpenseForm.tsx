"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EXPENSE_CATEGORY_OPTIONS, EXPENSE_STATUS_OPTIONS } from "@/src/modules/finance/constants";
import { expenseFormSchema, type ExpenseFormValues } from "@/src/modules/finance/schemas";
import type { FinanceClientOption, FinanceProjectOption } from "@/src/modules/finance/types";

interface ExpenseFormProps {
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    onSubmit: (values: ExpenseFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function ExpenseForm({ clients, projects, onSubmit, submitLabel = "Create Expense" }: ExpenseFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            category: "general",
            description: "",
            amount: 0,
            expenseDate: new Date().toISOString().slice(0, 10),
            status: "pending",
            submittedBy: "",
        },
    });

    return (
        <Card hover>
            <SectionHeader title="Expense form" description="Track costs linked to projects and clients" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Category</label>
                        <select {...register("category")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                        <select {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {EXPENSE_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Description</label>
                    <input {...register("description")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    {errors.description ? <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p> : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Amount</label>
                        <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        {errors.amount ? <p className="mt-1 text-xs text-rose-600">{errors.amount.message}</p> : null}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Expense Date</label>
                        <input type="date" {...register("expenseDate")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
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
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
