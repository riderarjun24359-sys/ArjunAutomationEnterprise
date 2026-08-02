"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { taskSchema, type TaskFormValues } from "@/src/modules/tasks/schemas";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/src/modules/tasks/constants";
import type { TaskAssignee, TaskLabel } from "@/src/modules/tasks/types";

interface TaskFormProps {
    assignees: TaskAssignee[];
    labels: TaskLabel[];
    onSubmit: (values: TaskFormValues) => void | Promise<void>;
    defaultValues?: Partial<TaskFormValues>;
    submitLabel?: string;
}

export function TaskForm({ assignees, labels, onSubmit, defaultValues, submitLabel = "Create Task" }: TaskFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "todo",
            priority: "medium",
            dueDate: "",
            projectName: "",
            estimatedHours: 0,
            ...defaultValues,
        },
    });

    return (
        <Card hover>
            <SectionHeader title="Task form" description="Create or update enterprise tasks" />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        {...register("title")}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        placeholder="Enter task title"
                    />
                    {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p> : null}
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
                        placeholder="Describe the task requirements"
                    />
                    {errors.description ? <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p> : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
                            Status
                        </label>
                        <select
                            id="status"
                            {...register("status")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        >
                            {TASK_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="priority" className="mb-1.5 block text-sm font-medium">
                            Priority
                        </label>
                        <select
                            id="priority"
                            {...register("priority")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        >
                            {TASK_PRIORITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="assigneeId" className="mb-1.5 block text-sm font-medium">
                            Assignee
                        </label>
                        <select
                            id="assigneeId"
                            {...register("assigneeId")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        >
                            <option value="">Unassigned</option>
                            {assignees.map((assignee) => (
                                <option key={assignee.id} value={assignee.id}>
                                    {assignee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium">
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            {...register("dueDate")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        />
                        {errors.dueDate ? <p className="mt-1 text-xs text-rose-600">{errors.dueDate.message}</p> : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="projectName" className="mb-1.5 block text-sm font-medium">
                            Project
                        </label>
                        <input
                            id="projectName"
                            {...register("projectName")}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                            placeholder="Associated project"
                        />
                    </div>

                    <div>
                        <label htmlFor="estimatedHours" className="mb-1.5 block text-sm font-medium">
                            Estimated Hours
                        </label>
                        <input
                            id="estimatedHours"
                            type="number"
                            min={0}
                            {...register("estimatedHours", { valueAsNumber: true })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                        />
                    </div>
                </div>

                {labels.length > 0 ? (
                    <div>
                        <p className="mb-2 text-sm font-medium">Available Labels</p>
                        <div className="flex flex-wrap gap-2">
                            {labels.map((label) => (
                                <span key={label.id} className="rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700">
                                    {label.name}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </Card>
    );
}
