"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { taxRateFormSchema, type TaxRateFormValues } from "@/src/modules/finance/schemas";

interface TaxRateFormProps {
    onSubmit: (values: TaxRateFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function TaxRateForm({ onSubmit, submitLabel = "Create Tax Rate" }: TaxRateFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TaxRateFormValues>({
        resolver: zodResolver(taxRateFormSchema),
        defaultValues: {
            name: "",
            ratePercent: 8.5,
            isDefault: false,
        },
    });

    return (
        <Card hover>
            <SectionHeader title="Tax rate form" description="Configure organization tax rates" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Name</label>
                    <input {...register("name")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Rate (%)</label>
                    <input type="number" step="0.01" {...register("ratePercent", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    {errors.ratePercent ? <p className="mt-1 text-xs text-rose-600">{errors.ratePercent.message}</p> : null}
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register("isDefault")} className="rounded border-slate-300" />
                    Set as default tax rate
                </label>
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
