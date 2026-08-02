import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { AnalyticsDashboard } from "@/src/modules/analytics/types";

interface DashboardTableProps {
    dashboards: AnalyticsDashboard[];
}

export function DashboardTable({ dashboards }: DashboardTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Saved dashboards" description="Configured analytics views for your organization" />
            <div className="mt-6 space-y-3">
                {dashboards.length === 0 ? (
                    <EmptyState title="No dashboards" description="Dashboards will appear once analytics views are configured." />
                ) : (
                    dashboards.map((dashboard) => (
                        <div key={dashboard.id} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium">{dashboard.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{dashboard.description}</p>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span>{dashboard.widgets.length} widgets</span>
                                    {dashboard.isDefault ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Default</span> : null}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
