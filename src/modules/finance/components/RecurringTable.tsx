import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { RecurringInvoice } from "@/src/modules/finance/types";

interface RecurringTableProps {
    recurringInvoices: RecurringInvoice[];
}

export function RecurringTable({ recurringInvoices }: RecurringTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Recurring invoices" description="Automated billing schedules" />
            {recurringInvoices.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No recurring schedules" description="Create a recurring invoice to automate billing." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {recurringInvoices.map((recurring) => (
                        <div key={recurring.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{recurring.title}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {recurring.clientName}
                                    {recurring.projectName ? ` • ${recurring.projectName}` : ""}
                                    • {recurring.frequency}
                                </p>
                            </div>
                            <div className="text-right text-sm">
                                <p>{recurring.isActive ? "Active" : "Paused"}</p>
                                <p className="font-medium">{formatMoney(recurring.total)}</p>
                                <p className="text-xs text-slate-500">Next: {recurring.nextRunDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
