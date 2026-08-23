import { Card } from "@/src/design-os/components/primitives/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { RecurringInvoice } from "@/src/modules/finance/types";
import { FinanceRow } from "@/src/design-os/components/primitives/FinanceRow";

interface RecurringTableProps {
    recurringInvoices: RecurringInvoice[];
}

export function RecurringTable({ recurringInvoices }: RecurringTableProps) {
    return (
        <Card variant="base">
            <SectionHeader title="Recurring invoices" description="Automated billing schedules" />
            {recurringInvoices.length === 0 ? (
                <div className="mt-6">
                    <p className="text-center text-sm text-[var(--dos-text-secondary)]">No recurring schedules.</p>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {recurringInvoices.map((recurring) => (
                        <FinanceRow key={recurring.id}>
                            <div>
                                <p className="font-medium text-[var(--dos-text-primary)]">{recurring.title}</p>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                                    {recurring.clientName}
                                    {recurring.projectName ? ` • ${recurring.projectName}` : ""}
                                    • {recurring.frequency}
                                </p>
                            </div>
                            <div className="text-right text-sm text-[var(--dos-text-secondary)]">
                                <p>{recurring.isActive ? "Active" : "Paused"}</p>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{formatMoney(recurring.total)}</p>
                                <p className="text-xs text-[var(--dos-text-tertiary)]">Next: {recurring.nextRunDate}</p>
                            </div>
                        </FinanceRow>
                    ))}
                </div>
            )}
        </Card>
    );
}
