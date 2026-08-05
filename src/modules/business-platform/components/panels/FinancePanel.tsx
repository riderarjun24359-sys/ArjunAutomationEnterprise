"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function FinancePanel({ data }: { data: BusinessPlatformData }) {
    const stats = data.analytics?.financeStats;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card>
                <h2 className="text-lg font-semibold">Finance overview</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div><p className="text-sm text-[var(--dos-text-secondary)]">Outstanding</p><p className="text-xl font-bold">{stats?.outstandingReceivables ?? "$0"}</p></div>
                    <div><p className="text-sm text-[var(--dos-text-secondary)]">Collected</p><p className="text-xl font-bold">{stats?.paidRevenue ?? "$0"}</p></div>
                    <div><p className="text-sm text-[var(--dos-text-secondary)]">Overdue</p><p className="text-xl font-bold">{stats?.overdueInvoices ?? 0}</p></div>
                    <div><p className="text-sm text-[var(--dos-text-secondary)]">Expenses</p><p className="text-xl font-bold">{stats?.totalExpenses ?? "$0"}</p></div>
                </div>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold">Invoices</h2>
                <div className="mt-4 space-y-2">
                    {data.invoices.length === 0 ? (
                        <EmptyState title="No invoices" description="Invoices are generated from accepted proposals." />
                    ) : (
                        data.invoices.slice(0, 8).map((inv) => (
                            <div key={inv.id} className="flex justify-between rounded-lg border border-[var(--dos-border)] px-3 py-2 text-sm">
                                <span>{inv.number}</span>
                                <span className="flex items-center gap-2"><Badge variant="default">{inv.status}</Badge>${inv.total.toLocaleString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
