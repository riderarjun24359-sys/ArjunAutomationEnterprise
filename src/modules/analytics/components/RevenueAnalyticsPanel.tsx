import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { RevenueAnalytics } from "@/src/modules/analytics/types";

interface RevenueAnalyticsPanelProps {
    revenue: RevenueAnalytics | null;
}

export function RevenueAnalyticsPanel({ revenue }: RevenueAnalyticsPanelProps) {
    if (!revenue) {
        return (
            <Card hover>
                <SectionHeader title="Revenue analytics" description="Invoice, payment, and expense performance" />
                <div className="mt-6">
                    <EmptyState title="No revenue data" description="Finance records will populate revenue analytics." />
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Revenue summary" description="Paid, outstanding, and expense totals" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                        { label: "Paid revenue", value: `$${revenue.paidTotal.toLocaleString()}` },
                        { label: "Outstanding", value: `$${revenue.outstanding.toLocaleString()}` },
                        { label: "Payments received", value: `$${revenue.paymentTotal.toLocaleString()}` },
                        { label: "Total expenses", value: `$${revenue.expenseTotal.toLocaleString()}` },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                            <p className="text-sm text-slate-500">{item.label}</p>
                            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Invoice trend" description="Invoice totals by document" />
                <div className="mt-6 space-y-3">
                    {revenue.revenueTrend.length === 0 ? (
                        <EmptyState title="No invoices" description="Create invoices to see revenue trends." />
                    ) : (
                        revenue.revenueTrend.map((point) => (
                            <div key={point.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span>{point.label}</span>
                                <span className="font-medium">${point.value.toLocaleString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card hover className="xl:col-span-2">
                <SectionHeader title="Expense breakdown" description="Spend by category" />
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {revenue.expenseBreakdown.length === 0 ? (
                        <EmptyState title="No expenses" description="Expense records will appear here." />
                    ) : (
                        revenue.expenseBreakdown.map((point) => (
                            <div key={point.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span className="capitalize">{point.label}</span>
                                <span className="font-medium">${point.value.toLocaleString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
