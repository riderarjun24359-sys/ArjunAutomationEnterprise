import { KANBAN_COLUMNS } from "@/src/modules/tasks/constants";
import { TaskCard } from "@/src/modules/tasks/components/TaskCard";
import type { Task } from "@/src/modules/tasks/types";

interface TaskKanbanProps {
    tasks: Task[];
    onSelectTask?: (id: string) => void;
}

export function TaskKanban({ tasks, onSelectTask }: TaskKanbanProps) {
    if (tasks.length === 0) {
        return <div className="p-8 text-center rounded-[var(--dos-radius-lg)] border border-dashed border-[var(--dos-border)] text-[var(--dos-text-secondary)]">No tasks in this view.</div>;
    }

    return (
        <div className="grid gap-6 overflow-x-auto lg:grid-cols-5 pb-4">
            {KANBAN_COLUMNS.map((column) => {
                const columnTasks = tasks.filter((task) => task.status === column.status);

                return (
                    <div key={column.status} className="min-w-[280px] rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-secondary)]/50 p-4">
                        <div className="mb-4 flex items-center justify-between px-1">
                            <h3 className="dos-text-h3">{column.label}</h3>
                            <span className="rounded-full bg-[var(--dos-surface-tertiary)] px-3 py-1 text-xs font-semibold text-[var(--dos-text-secondary)]">
                                {columnTasks.length}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {columnTasks.length === 0 ? (
                                <p className="px-1 py-8 text-center dos-text-body-sm text-[var(--dos-text-tertiary)]">No tasks</p>
                            ) : (
                                columnTasks.map((task) => <TaskCard key={task.id} task={task} onSelect={onSelectTask} />)
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
