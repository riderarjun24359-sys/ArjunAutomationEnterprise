import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EmptyState } from "@/src/modules/tasks/components/EmptyState";
import type { Task } from "@/src/modules/tasks/types";

interface TaskTableProps {
    tasks: Task[];
    onSelectTask?: (id: string) => void;
}

const statusStyles: Record<Task["status"], string> = {
    todo: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    review: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    blocked: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    cancelled: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

export function TaskTable({ tasks, onSelectTask }: TaskTableProps) {
    if (tasks.length === 0) {
        return <EmptyState title="No tasks match your filters" description="Try clearing filters or creating a new task." />;
    }

    return (
        <Card hover>
            <SectionHeader title="Task list" description="Enterprise task registry with status and ownership" />
            <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <th className="pb-3 pr-4 font-medium">Task</th>
                            <th className="pb-3 pr-4 font-medium">Status</th>
                            <th className="pb-3 pr-4 font-medium">Priority</th>
                            <th className="pb-3 pr-4 font-medium">Assignee</th>
                            <th className="pb-3 pr-4 font-medium">Project</th>
                            <th className="pb-3 font-medium">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr
                                key={task.id}
                                onClick={() => onSelectTask?.(task.id)}
                                className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-950/40"
                            >
                                <td className="py-4 pr-4">
                                    <p className="font-medium">{task.title}</p>
                                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
                                </td>
                                <td className="py-4 pr-4">
                                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[task.status]}`}>
                                        {task.status.replace("_", " ")}
                                    </span>
                                </td>
                                <td className="py-4 pr-4 capitalize">{task.priority}</td>
                                <td className="py-4 pr-4">{task.assignee?.name ?? "—"}</td>
                                <td className="py-4 pr-4">{task.projectName ?? "—"}</td>
                                <td className="py-4">{task.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
