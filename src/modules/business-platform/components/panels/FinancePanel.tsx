"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

const StatItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="rounded-xl bg-[var(--dos-surface-tertiary)] p-4 border border-[var(--dos-border-subtle)]">
        <p className="dos-text-caption text-[var(--dos-text-tertiary)] tracking-wide">{label}</p>
        <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-[var(--dos-text-primary)]">{value}</p>
    </div>
);

export function FinancePanel({ data }: { data: BusinessPlatformData }) {
    const stats = data.analytics?.financeStats;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card className="os-panel" hover={false}>
                <h2 className="dos-text-h2">Finance overview</h2>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <StatItem label="Outstanding" value={stats?.outstandingReceivables ?? "₹0"} />
                    <StatItem label="Collected" value={stats?.paidRevenue ?? "₹0"} />
                    <StatItem label="Overdue" value={stats?.overdueInvoices ?? 0} />
                    <StatItem label="Expenses" value={stats?.totalExpenses ?? "₹0"} />
                </div>
            </Card>
            <Card className="os-panel" hover={false}>
                <h2 className="dos-text-h3">Invoices</h2>
                <div className="mt-6 space-y-3">
                    {data.invoices.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[var(--dos-border-strong)] p-8 text-center">
                            <p className="text-[var(--dos-text-secondary)]">No invoices found</p>
                        </div>
                    ) : (
                        data.invoices.slice(0, 8).map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between rounded-lg border border-[var(--dos-border-subtle)] bg-[var(--dos-surface)] px-4 py-3 text-sm">
                                <span className="font-mono text-[var(--dos-text-secondary)]">{inv.number}</span>
                                <div className="flex items-center gap-3">
                                    <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                                    <span className="font-semibold text-[var(--dos-text-primary)]">${inv.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
