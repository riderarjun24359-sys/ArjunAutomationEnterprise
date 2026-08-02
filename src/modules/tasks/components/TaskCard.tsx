import { CalendarDays, UserRound } from "lucide-react";
import type { Task } from "@/src/modules/tasks/types";

interface TaskCardProps {
    task: Task;
    onSelect?: (id: string) => void;
    compact?: boolean;
}

const priorityStyles: Record<Task["priority"], string> = {
    low: "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300",
    medium: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    high: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    critical: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
    urgent: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300",
};

const labelColorStyles: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
};

export function TaskCard({ task, onSelect, compact = false }: TaskCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect?.(task.id)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">{task.title}</p>
                    {!compact ? <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p> : null}
                </div>
                <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize ${priorityStyles[task.priority]}`}>
                    {task.priority}
                </span>
            </div>

            {!compact && task.labels.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {task.labels.map((label) => (
                        <span key={label.id} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${labelColorStyles[label.color] ?? labelColorStyles.emerald}`}>
                            {label.name}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5 text-slate-400" />
                    {task.assignee?.name ?? "Unassigned"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {task.dueDate}
                </span>
            </div>

            {!compact && task.projectName ? (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{task.projectName}</p>
            ) : null}
        </button>
    );
}
