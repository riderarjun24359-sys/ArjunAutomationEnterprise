"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/design-os/components/primitives/Card";
import { Input } from "@/src/design-os/components/primitives/Input";
import { Button } from "@/src/design-os/components/primitives/Button";
import { ESTIMATE_STATUS_OPTIONS } from "@/src/modules/finance/constants";
import { estimateFormSchema, type EstimateFormValues } from "@/src/modules/finance/schemas";
import type { FinanceClientOption, FinanceProjectOption } from "@/src/modules/finance/types";

interface EstimateFormProps {
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    onSubmit: (values: EstimateFormValues) => void | Promise<void>;
    submitLabel?: string;
}

const fieldClass = "w-full h-10 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-base)] px-3 text-sm";

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
        <Card variant="base">
            <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Estimate form</h3>
            <p className="mb-6 text-sm text-[var(--dos-text-secondary)]">Create a priced proposal linked to a client and project.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="estimate-number" className="mb-1.5 block text-sm font-medium">Estimate number</label>
                        <Input id="estimate-number" {...register("number")} error={!!errors.number} />
                        {errors.number && <p className="mt-1 text-xs text-red-500">{errors.number.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="estimate-status" className="mb-1.5 block text-sm font-medium">Status</label>
                        <select id="estimate-status" {...register("status")} className={fieldClass}>
                            {ESTIMATE_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="estimate-client" className="mb-1.5 block text-sm font-medium">Client</label>
                        <select id="estimate-client" {...register("clientId")} className={fieldClass}>
                            <option value="">Select client (optional)</option>
                            {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                        </select>
                        {errors.clientId && <p className="mt-1 text-xs text-red-500">{errors.clientId.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="estimate-project" className="mb-1.5 block text-sm font-medium">Project</label>
                        <select id="estimate-project" {...register("projectId")} className={fieldClass}>
                            <option value="">Select project (optional)</option>
                            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="estimate-issue-date" className="mb-1.5 block text-sm font-medium">Issue date</label>
                        <Input id="estimate-issue-date" type="date" {...register("issueDate")} error={!!errors.issueDate} />
                        {errors.issueDate && <p className="mt-1 text-xs text-red-500">{errors.issueDate.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="estimate-valid-until" className="mb-1.5 block text-sm font-medium">Valid until</label>
                        <Input id="estimate-valid-until" type="date" {...register("validUntil")} error={!!errors.validUntil} />
                        {errors.validUntil && <p className="mt-1 text-xs text-red-500">{errors.validUntil.message}</p>}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                        <label htmlFor="estimate-line-description" className="mb-1.5 block text-sm font-medium">Line item description</label>
                        <Input id="estimate-line-description" {...register("lineItems.0.description")} error={!!errors.lineItems?.[0]?.description} />
                        {errors.lineItems?.[0]?.description && <p className="mt-1 text-xs text-red-500">{errors.lineItems[0].description.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="estimate-unit-price" className="mb-1.5 block text-sm font-medium">Unit price (₹)</label>
                        <Input id="estimate-unit-price" type="number" step="0.01" {...register("lineItems.0.unitPrice", { valueAsNumber: true })} error={!!errors.lineItems?.[0]?.unitPrice} />
                        {errors.lineItems?.[0]?.unitPrice && <p className="mt-1 text-xs text-red-500">{errors.lineItems[0].unitPrice.message}</p>}
                    </div>
                </div>
                <input type="hidden" {...register("lineItems.0.quantity", { valueAsNumber: true })} value={1} />

                <div>
                    <label htmlFor="estimate-notes" className="mb-1.5 block text-sm font-medium">Notes</label>
                    <textarea id="estimate-notes" {...register("notes")} rows={3} className={`${fieldClass} h-auto py-2`} />
                    {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
                </div>

                <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
            </form>
        </Card>
    );
}
