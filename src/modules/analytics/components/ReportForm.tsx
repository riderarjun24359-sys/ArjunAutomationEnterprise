"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { REPORT_STATUS_OPTIONS, REPORT_TYPE_OPTIONS } from "@/src/modules/analytics/constants";
import { reportFormSchema, type ReportFormValues } from "@/src/modules/analytics/schemas";

interface ReportFormProps {
    onSubmit: (values: ReportFormValues) => Promise<void>;
    onCancel: () => void;
}

export function ReportForm({ onSubmit, onCancel }: ReportFormProps) {
    const [defaultValues] = useState<ReportFormValues>(() => ({
        name: "",
        reportType: "summary",
        status: "draft",
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ReportFormValues>({
        resolver: zodResolver(reportFormSchema),
        defaultValues,
    });

    return (
        <Card hover>
            <SectionHeader title="Create analytics report" description="Save a report configuration for your organization" />
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <label className="block space-y-2">
                    <span className="text-sm font-medium">Report name</span>
                    <input
                        {...register("name")}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950"
                        placeholder="Q3 Executive Summary"
                    />
                    {errors.name ? <span className="text-sm text-red-500">{errors.name.message}</span> : null}
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium">Report type</span>
                    <select {...register("reportType")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                        {REPORT_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium">Status</span>
                    <select {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                        {REPORT_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
                    >
                        {isSubmitting ? "Saving..." : "Create report"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Card>
    );
}
