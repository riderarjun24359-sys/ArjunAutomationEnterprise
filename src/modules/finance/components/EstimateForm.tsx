"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ESTIMATE_STATUS_OPTIONS } from "@/src/modules/finance/constants";
import { estimateFormSchema, type EstimateFormValues } from "@/src/modules/finance/schemas";
import type { FinanceClientOption, FinanceProjectOption } from "@/src/modules/finance/types";

interface EstimateFormProps {
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    onSubmit: (values: EstimateFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function EstimateForm({ clients, projects, onSubmit, submitLabel = "Create Estimate" }: EstimateFormProps) {
    const [defaultValues] = useState<EstimateFormValues>(() => ({
        number: `EST-${Date.now().toString().slice(-4)}`,
        status: "draft",
        issueDate: new Date().toISOString().slice(0, 10),
        validUntil: "",
        notes: "",
        lineItems: [{ description: "Discovery and planning", quantity: 1, unitPrice: 2500 }],
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EstimateFormValues>({
        resolver: zodResolver(estimateFormSchema),
        defaultValues,
    });

    return (
        <Card hover>
            <SectionHeader title="Estimate form" description="Create estimates linked to clients and projects" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Estimate Number</label>
                        <input {...register("number")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        {errors.number ? <p className="mt-1 text-xs text-rose-600">{errors.number.message}</p> : null}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                        <select {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {ESTIMATE_STATUS_OPTIONS.map((option) => (
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
                        <label className="mb-1.5 block text-sm font-medium">Valid Until</label>
                        <input type="date" {...register("validUntil")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
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
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
