"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CLIENT_INDUSTRY_OPTIONS, CLIENT_STATUS_OPTIONS } from "@/src/modules/clients/constants";
import { clientFormSchema, type ClientFormValues } from "@/src/modules/clients/schemas";

interface ClientFormProps {
    onSubmit: (values: ClientFormValues) => void | Promise<void>;
    defaultValues?: Partial<ClientFormValues>;
    submitLabel?: string;
    onCancel?: () => void;
}

export function ClientForm({ onSubmit, defaultValues, submitLabel = "Save Client", onCancel }: ClientFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            name: "",
            status: "active",
            industry: "saas",
            contactEmail: "",
            manager: "",
            revenue: "$0",
            phone: "",
            website: "",
            address: "",
            description: "",
            ...defaultValues,
        },
    });

    return (
        <Card hover>
            <SectionHeader title="Client profile" description="Create or update enterprise client records" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                            Client Name
                        </label>
                        <input
                            id="name"
                            {...register("name")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="Northstar Labs"
                        />
                        {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="manager" className="mb-1.5 block text-sm font-medium">
                            Account Manager
                        </label>
                        <input
                            id="manager"
                            {...register("manager")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="Mina Park"
                        />
                        {errors.manager ? <p className="mt-1 text-xs text-rose-600">{errors.manager.message}</p> : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
                            Status
                        </label>
                        <select
                            id="status"
                            {...register("status")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        >
                            {CLIENT_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="industry" className="mb-1.5 block text-sm font-medium">
                            Industry
                        </label>
                        <select
                            id="industry"
                            {...register("industry")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        >
                            {CLIENT_INDUSTRY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="revenue" className="mb-1.5 block text-sm font-medium">
                            Revenue
                        </label>
                        <input
                            id="revenue"
                            {...register("revenue")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="$248k"
                        />
                        {errors.revenue ? <p className="mt-1 text-xs text-rose-600">{errors.revenue.message}</p> : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="contactEmail" className="mb-1.5 block text-sm font-medium">
                            Contact Email
                        </label>
                        <input
                            id="contactEmail"
                            type="email"
                            {...register("contactEmail")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="ops@northstarlabs.com"
                        />
                        {errors.contactEmail ? <p className="mt-1 text-xs text-rose-600">{errors.contactEmail.message}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                            Phone
                        </label>
                        <input
                            id="phone"
                            {...register("phone")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="+1 415 555 0148"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="website" className="mb-1.5 block text-sm font-medium">
                            Website
                        </label>
                        <input
                            id="website"
                            {...register("website")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="https://northstarlabs.com"
                        />
                        {errors.website ? <p className="mt-1 text-xs text-rose-600">{errors.website.message}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
                            Address
                        </label>
                        <input
                            id="address"
                            {...register("address")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="450 Market Street, San Francisco, CA"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register("description")}
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        placeholder="Client engagement summary"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        {isSubmitting ? "Saving..." : submitLabel}
                    </button>
                    {onCancel ? (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                    ) : null}
                </div>
            </form>
        </Card>
    );
}
