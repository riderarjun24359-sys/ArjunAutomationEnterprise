import { Card } from "@/src/components/ui/card";
import { INVOICE_STATUS_OPTIONS } from "@/src/modules/finance/constants";
import type { InvoiceStatusFilter } from "@/src/modules/finance/types";

interface FinanceFiltersProps {
    searchQuery: string;
    statusFilter: InvoiceStatusFilter;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: InvoiceStatusFilter) => void;
}

export function FinanceFilters({ searchQuery, statusFilter, onSearchChange, onStatusChange }: FinanceFiltersProps) {
    return (
        <Card hover>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search invoices by number, client, or project"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900"
                />
                <select
                    value={statusFilter}
                    onChange={(event) => onStatusChange(event.target.value as InvoiceStatusFilter)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900"
                >
                    <option value="all">All statuses</option>
                    {INVOICE_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </Card>
    );
}
