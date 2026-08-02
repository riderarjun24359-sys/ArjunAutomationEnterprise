import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { KANBAN_COLUMNS } from "@/src/modules/tasks/constants";
import { TaskCard } from "@/src/modules/tasks/components/TaskCard";
import { EmptyState } from "@/src/modules/tasks/components/EmptyState";
import type { Task } from "@/src/modules/tasks/types";

interface TaskKanbanProps {
    tasks: Task[];
    onSelectTask?: (id: string) => void;
}

export function TaskKanban({ tasks, onSelectTask }: TaskKanbanProps) {
    if (tasks.length === 0) {
        return <EmptyState title="No tasks in this view" description="Adjust filters or create a new task to populate the kanban board." />;
    }

    return (
        <Card hover>
            <SectionHeader title="Kanban board" description="Drag-and-drop ready task columns by status" />
            <div className="mt-6 grid gap-4 overflow-x-auto lg:grid-cols-5">
                {KANBAN_COLUMNS.map((column) => {
                    const columnTasks = tasks.filter((task) => task.status === column.status);

                    return (
                        <div key={column.status} className="min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                            <div className="mb-3 flex items-center justify-between px-1">
                                <p className="text-sm font-semibold">{column.label}</p>
                                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {columnTasks.length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {columnTasks.length === 0 ? (
                                    <p className="px-1 py-4 text-center text-xs text-slate-400">No tasks</p>
                                ) : (
                                    columnTasks.map((task) => <TaskCard key={task.id} task={task} onSelect={onSelectTask} compact />)
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
