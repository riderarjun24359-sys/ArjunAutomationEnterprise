import { Card } from "@/src/components/ui/Card";
import { WORKFLOW_STATUS_OPTIONS } from "@/src/modules/automation/constants";
import type { WorkflowStatusFilter } from "@/src/modules/automation/types";

interface AutomationFiltersProps {
    searchQuery: string;
    statusFilter: WorkflowStatusFilter;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: WorkflowStatusFilter) => void;
}

export function AutomationFilters({ searchQuery, statusFilter, onSearchChange, onStatusChange }: AutomationFiltersProps) {
    return (
        <Card hover>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search workflows by name, description, or agent"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900"
                />
                <select
                    value={statusFilter}
                    onChange={(event) => onStatusChange(event.target.value as WorkflowStatusFilter)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900"
                >
                    <option value="all">All statuses</option>
                    {WORKFLOW_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </Card>
    );
}
