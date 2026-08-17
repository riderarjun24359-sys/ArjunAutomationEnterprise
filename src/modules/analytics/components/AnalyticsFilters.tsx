import { Card } from "@/src/components/ui/card";
import { METRIC_CATEGORY_FILTERS } from "@/src/modules/analytics/constants";
import type { AnalyticsCategoryFilter } from "@/src/modules/analytics/types";

interface AnalyticsFiltersProps {
    searchQuery: string;
    categoryFilter: AnalyticsCategoryFilter;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: AnalyticsCategoryFilter) => void;
}

const categories = [
    { id: METRIC_CATEGORY_FILTERS.all, label: "All" },
    { id: METRIC_CATEGORY_FILTERS.finance, label: "Finance" },
    { id: METRIC_CATEGORY_FILTERS.clients, label: "Clients" },
    { id: METRIC_CATEGORY_FILTERS.delivery, label: "Delivery" },
    { id: METRIC_CATEGORY_FILTERS.automation, label: "Automation" },
] as const;

export function AnalyticsFilters({ searchQuery, categoryFilter, onSearchChange, onCategoryChange }: AnalyticsFiltersProps) {
    return (
        <Card hover className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search metrics and reports..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950 lg:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onCategoryChange(category.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            categoryFilter === category.id
                                ? "bg-emerald-600 text-white"
                                : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"
                        }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </Card>
    );
}
