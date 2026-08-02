"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AGENT_MODEL_OPTIONS, AGENT_STATUS_OPTIONS } from "@/src/modules/automation/constants";
import { aiAgentFormSchema, type AiAgentFormValues } from "@/src/modules/automation/schemas";

interface AgentFormProps {
    onSubmit: (values: AiAgentFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function AgentForm({ onSubmit, submitLabel = "Create Agent" }: AgentFormProps) {
    const [defaultValues] = useState<AiAgentFormValues>(() => ({
        name: "",
        description: "",
        model: "gpt-4o",
        systemPrompt: "",
        status: "active",
        temperature: 0.7,
        maxTokens: 4096,
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AiAgentFormValues>({
        resolver: zodResolver(aiAgentFormSchema),
        defaultValues,
    });

    return (
        <Card hover>
            <SectionHeader title="AI agent form" description="Configure enterprise AI agents for workflow automation" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Agent Name</label>
                        <input {...register("name")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                        <select {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {AGENT_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Description</label>
                    <textarea {...register("description")} rows={2} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Model</label>
                        <select {...register("model")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {AGENT_MODEL_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Temperature</label>
                        <input type="number" step="0.1" {...register("temperature", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Max Tokens</label>
                        <input type="number" {...register("maxTokens", { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium">System Prompt</label>
                    <textarea {...register("systemPrompt")} rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                </div>
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
