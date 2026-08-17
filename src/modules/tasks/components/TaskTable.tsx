import type { Task } from "@/src/modules/tasks/types";

interface TaskTableProps {
    tasks: Task[];
    onSelectTask?: (id: string) => void;
}

export function TaskTable({ tasks, onSelectTask }: TaskTableProps) {
    if (tasks.length === 0) {
        return <div className="p-8 text-center rounded-[var(--dos-radius-lg)] border border-dashed border-[var(--dos-border)] text-[var(--dos-text-secondary)]">No tasks match your filters.</div>;
    }

    return (
        <div className="os-panel overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]">
                    <tr>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Task</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Assignee</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Project</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Due Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--dos-border-subtle)]">
                    {tasks.map((task) => (
                        <tr key={task.id} onClick={() => onSelectTask?.(task.id)} className="hover:bg-[var(--dos-surface-secondary)] cursor-pointer transition">
                            <td className="px-6 py-4">
                                <p className="font-semibold text-[var(--dos-text-primary)]">{task.title}</p>
                                <p className="mt-1 dos-text-body-sm text-[var(--dos-text-secondary)] line-clamp-1">{task.description}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-block rounded-full bg-[var(--dos-surface-tertiary)] px-3 py-1 text-xs font-medium capitalize text-[var(--dos-text-secondary)]">
                                    {task.status.replace("_", " ")}
                                </span>
                            </td>
                            <td className="px-6 py-4 capitalize text-[var(--dos-text-secondary)]">{task.priority}</td>
                            <td className="px-6 py-4 text-[var(--dos-text-secondary)]">{task.assignee?.name ?? "—"}</td>
                            <td className="px-6 py-4 text-[var(--dos-text-secondary)]">{task.projectName ?? "—"}</td>
                            <td className="px-6 py-4 text-[var(--dos-text-secondary)]">{task.dueDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
