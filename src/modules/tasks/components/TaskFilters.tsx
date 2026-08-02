import { Search } from "lucide-react";
import { TASK_FILTERS, TASK_STATUS_OPTIONS } from "@/src/modules/tasks/constants";
import type { TaskFilter, TaskStatus } from "@/src/modules/tasks/types";

interface TaskFiltersProps {
    activeFilter: TaskFilter;
    searchQuery: string;
    statusFilter: TaskStatus | "all";
    onFilterChange: (filter: TaskFilter) => void;
    onSearchChange: (query: string) => void;
    onStatusChange: (status: TaskStatus | "all") => void;
}

const filterOptions = [
    { id: TASK_FILTERS.all, label: "All Tasks" },
    { id: TASK_FILTERS.myTasks, label: "My Tasks" },
    { id: TASK_FILTERS.overdue, label: "Overdue" },
    { id: TASK_FILTERS.dueThisWeek, label: "Due This Week" },
    { id: TASK_FILTERS.highPriority, label: "High Priority" },
    { id: TASK_FILTERS.unassigned, label: "Unassigned" },
] as const;

export function TaskFilters({ activeFilter, searchQuery, statusFilter, onFilterChange, onSearchChange, onStatusChange }: TaskFiltersProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange(option.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeFilter === option.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search tasks, projects, or assignees..."
                        className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) => onStatusChange(event.target.value as TaskStatus | "all")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700"
                >
                    <option value="all">All Statuses</option>
                    {TASK_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
