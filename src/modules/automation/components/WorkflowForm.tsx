"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ACTION_TYPE_OPTIONS, TRIGGER_TYPE_OPTIONS, WORKFLOW_STATUS_OPTIONS } from "@/src/modules/automation/constants";
import { workflowFormSchema, type WorkflowFormValues } from "@/src/modules/automation/schemas";
import type { AiAgent, WorkflowTemplate } from "@/src/modules/automation/types";

interface WorkflowFormProps {
    agents: AiAgent[];
    templates: WorkflowTemplate[];
    onSubmit: (values: WorkflowFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export function WorkflowForm({ agents, templates, onSubmit, submitLabel = "Create Workflow" }: WorkflowFormProps) {
    const [actionType, setActionType] = useState<WorkflowFormValues["actionType"]>("notify");
    const [defaultValues] = useState<WorkflowFormValues>(() => ({
        name: "",
        description: "",
        status: "draft",
        triggerType: "event",
        eventName: "",
        actionType: "notify",
        actionMessage: "",
        actionUrl: "",
        actionEvent: "",
        webhookName: "",
        conditionField: "",
        conditionOperator: "equals",
        conditionValue: "",
        cronExpression: "0 9 * * 1",
        timezone: "UTC",
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WorkflowFormValues>({
        resolver: zodResolver(workflowFormSchema),
        defaultValues,
    });
    const selectedActionType = actionType;

    return (
        <Card hover>
            <SectionHeader title="Workflow builder" description="Define triggers, actions, conditions, and scheduling" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Workflow Name</label>
                        <input {...register("name")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                        <select {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {WORKFLOW_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Description</label>
                    <textarea {...register("description")} rows={2} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Template</label>
                        <select {...register("templateId")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            <option value="">No template</option>
                            {templates.map((template) => (
                                <option key={template.id} value={template.id}>{template.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">AI Agent</label>
                        <select {...register("agentId")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            <option value="">No agent</option>
                            {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Trigger Type</label>
                        <select {...register("triggerType")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            {TRIGGER_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Event Name</label>
                        <input {...register("eventName")} placeholder="client.created" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium">Action Type</label>
                    <select {...register("actionType", { onChange: (e) => setActionType(e.target.value as WorkflowFormValues["actionType"]) })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                        {ACTION_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                {(selectedActionType === "notify" || selectedActionType === "create_task") && (
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            {selectedActionType === "notify" ? "Notification message" : "Task title"}
                        </label>
                        <input {...register("actionMessage")} placeholder={selectedActionType === "notify" ? "Deployment finished" : "Follow up with the client"} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        {errors.actionMessage ? <p className="mt-1 text-xs text-red-600">{errors.actionMessage.message}</p> : null}
                    </div>
                )}
                {selectedActionType === "webhook" && (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Target URL (https)</label>
                            <input {...register("actionUrl")} placeholder="https://hooks.example.com/events" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                            {errors.actionUrl ? <p className="mt-1 text-xs text-red-600">{errors.actionUrl.message}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Named webhook (optional)</label>
                            <input {...register("webhookName")} placeholder="crm" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Event name</label>
                            <input {...register("actionEvent")} placeholder="automation.event" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                        </div>
                    </div>
                )}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Condition Field</label>
                        <input {...register("conditionField")} placeholder="client.status" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Operator</label>
                        <select {...register("conditionOperator")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
                            <option value="equals">Equals</option>
                            <option value="not_equals">Not Equals</option>
                            <option value="greater_than">Greater Than</option>
                            <option value="less_than">Less Than</option>
                            <option value="contains">Contains</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Value</label>
                        <input {...register("conditionValue")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Cron Expression</label>
                        <input {...register("cronExpression")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Timezone</label>
                        <input {...register("timezone")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
