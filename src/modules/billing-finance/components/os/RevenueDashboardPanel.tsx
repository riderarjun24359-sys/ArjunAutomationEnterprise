"use client";

import { Card } from "@/src/design-os/components/primitives/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { RevenueDashboardMetrics } from "../../types/os";

export function RevenueDashboardPanel({ revenue }: { revenue: RevenueDashboardMetrics }) {
    if (revenue.invoiceCount === 0 && revenue.activeSubscriptions === 0 && revenue.mrrUsd === 0) {
        return (
            <EmptyState
                title="No revenue signals"
                description="Revenue dashboard builds from MRR/ARR snapshots, invoices, and payments."
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <Card variant="base">
                    <p className="text-xs font-semibold text-[var(--dos-text-tertiary)] uppercase tracking-wide">Revenue trend (Last 6mo)</p>
                    <ul className="mt-4 space-y-3">
                        {revenue.revenueByMonth.map((row) => (
                            <li key={row.month} className="flex justify-between items-center text-sm border-b border-[var(--dos-border-subtle)] pb-2 last:border-0 last:pb-0">
                                <span className="font-medium text-[var(--dos-text-secondary)]">{row.month}</span>
                                <span className="text-[var(--dos-text-primary)] tabular-nums">
                                    <span className="text-[var(--dos-text-tertiary)] text-xs">Inv:</span> ${row.invoicedUsd.toLocaleString()} 
                                    <span className="mx-2 text-[var(--dos-border)]">|</span>
                                    <span className="text-[var(--dos-text-tertiary)] text-xs">Coll:</span> ${row.collectedUsd.toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card variant="base">
                    <p className="text-xs font-semibold text-[var(--dos-text-tertiary)] uppercase tracking-wide">Top accounts (MRR)</p>
                    <ul className="mt-4 space-y-3">
                        {revenue.topAccounts.slice(0, 8).map((a) => (
                            <li key={a.name} className="flex justify-between items-center border-b border-[var(--dos-border-subtle)] pb-2 last:border-0 last:pb-0">
                                <span className="truncate text-sm text-[var(--dos-text-secondary)]">{a.name}</span>
                                <span className="font-semibold text-[var(--dos-text-primary)] tabular-nums">${Math.round(a.mrrUsd).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <Card variant="base" className="grid gap-6 text-sm text-[var(--dos-text-secondary)] sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--dos-text-tertiary)] uppercase text-xs">Total Invoices</span>
                    <span className="text-2xl font-bold text-[var(--dos-text-primary)] tabular-nums">{revenue.invoiceCount}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--dos-text-tertiary)] uppercase text-xs">Paid</span>
                    <span className="text-2xl font-bold text-[var(--dos-tint-success)] tabular-nums">{revenue.paidInvoiceCount}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--dos-text-tertiary)] uppercase text-xs">Failed Payments</span>
                    <span className="text-2xl font-bold text-[var(--dos-tint-critical)] tabular-nums">{revenue.failedPaymentCount}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--dos-text-tertiary)] uppercase text-xs">Collection Cases</span>
                    <span className="text-2xl font-bold text-[var(--dos-tint-warning)] tabular-nums">{revenue.collectionCasesOpen}</span>
                </div>
            </Card>
        </div>
    );
}
