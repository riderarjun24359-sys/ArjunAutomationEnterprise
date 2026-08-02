import { CLIENT_STATUS_FILTERS } from "@/src/modules/clients/constants";
import type { ClientStatusFilter } from "@/src/modules/clients/types";

interface ClientFiltersProps {
    searchQuery: string;
    statusFilter: ClientStatusFilter;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: ClientStatusFilter) => void;
}

const statusOptions = [
    { value: CLIENT_STATUS_FILTERS.all, label: "All Statuses" },
    { value: CLIENT_STATUS_FILTERS.active, label: "Active" },
    { value: CLIENT_STATUS_FILTERS.at_risk, label: "At Risk" },
    { value: CLIENT_STATUS_FILTERS.inactive, label: "Inactive" },
] as const;

export function ClientFilters({ searchQuery, statusFilter, onSearchChange, onStatusChange }: ClientFiltersProps) {
    return (
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:flex-row lg:items-center lg:justify-between">
            <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search clients, managers, or industries..."
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700 lg:max-w-md"
            />
            <select
                value={statusFilter}
                onChange={(event) => onStatusChange(event.target.value as ClientStatusFilter)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-emerald-700 lg:w-48"
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
