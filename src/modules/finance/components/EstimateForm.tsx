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
            <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Estimate Form</h3>
            <p className="text-sm text-[var(--dos-text-secondary)] mb-6">Create estimates linked to clients and projects</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Estimate Number</label>
                        <Input {...register("number")} error={!!errors.number} />
                        {errors.number ? <p className="mt-1 text-xs text-red-500">{errors.number.message}</p> : null}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                        <select {...register("status")} className="w-full h-10 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-base)] px-3 text-sm">
                            {ESTIMATE_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* ... other fields ... */}
                <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
            </form>
        </Card>
    );
}
