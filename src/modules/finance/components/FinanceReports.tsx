import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { FinanceReportSummary } from "@/src/modules/finance/types";

interface FinanceReportsProps {
    reports: FinanceReportSummary | null;
}

export function FinanceReports({ reports }: FinanceReportsProps) {
    if (!reports) {
        return (
            <Card hover>
                <SectionHeader title="Financial reports" description="Revenue, expenses, and aging analysis" />
                <div className="mt-6">
                    <EmptyState title="No report data" description="Financial reports will populate once invoices and expenses exist." />
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Profit summary" description="Revenue, collections, and margin" />
                <div className="mt-6 space-y-3">
                    <div className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <span>Total Revenue</span>
                        <span className="font-medium">{reports.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <span>Total Collected</span>
                        <span className="font-medium">{reports.totalCollected}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <span>Total Expenses</span>
                        <span className="font-medium">{reports.totalExpenses}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                        <span>Gross Margin</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-300">{reports.grossMargin}</span>
                    </div>
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Revenue by client" description="Top client contribution" />
                <div className="mt-6 space-y-3">
                    {reports.revenueByClient.length === 0 ? (
                        <EmptyState title="No client revenue" description="Invoice data will populate this report." />
                    ) : (
                        reports.revenueByClient.map((entry) => (
                            <div key={entry.client} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span>{entry.client}</span>
                                <span className="font-medium">{entry.amount}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Expenses by category" description="Cost breakdown" />
                <div className="mt-6 space-y-3">
                    {reports.expensesByCategory.length === 0 ? (
                        <EmptyState title="No expense data" description="Expense records will populate this report." />
                    ) : (
                        reports.expensesByCategory.map((entry) => (
                            <div key={entry.category} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span className="capitalize">{entry.category}</span>
                                <span className="font-medium">{entry.amount}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="AR aging" description="Outstanding receivables by bucket" />
                <div className="mt-6 space-y-3">
                    {reports.agingBuckets.map((entry) => (
                        <div key={entry.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <span>{entry.label}</span>
                            <span className="font-medium">{entry.amount}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
