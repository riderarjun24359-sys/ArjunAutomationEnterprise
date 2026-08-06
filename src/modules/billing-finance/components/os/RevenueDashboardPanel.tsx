"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { RevenueDashboardMetrics } from "../../types/os";

export function RevenueDashboardPanel({ revenue }: { revenue: RevenueDashboardMetrics }) {
    if (revenue.invoiceCount === 0 && revenue.activeSubscriptions === 0 && revenue.mrrUsd === 0) {
        return (
            <EmptyState
                title="No revenue signals"
                description="Revenue dashboard builds from MRR/ARR snapshots, invoices, and payments in Supabase."
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">MRR</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">${revenue.mrrUsd.toLocaleString()}</p>
                    <Badge className="mt-2" variant={revenue.mrrTrend === "up" ? "success" : revenue.mrrTrend === "down" ? "error" : "info"}>
                        Trend {revenue.mrrTrend}
                    </Badge>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">ARR</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">${revenue.arrUsd.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Collected</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">${revenue.collectedUsd.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Outstanding</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">${revenue.outstandingUsd.toLocaleString()}</p>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Revenue by month</p>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                        {revenue.revenueByMonth.length === 0 ? (
                            <li>No monthly revenue rows yet</li>
                        ) : (
                            revenue.revenueByMonth.map((row) => (
                                <li key={row.month} className="flex justify-between gap-2">
                                    <span>{row.month}</span>
                                    <span>
                                        Inv ${row.invoicedUsd.toLocaleString()} · Coll ${row.collectedUsd.toLocaleString()}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Top accounts</p>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                        {revenue.topAccounts.length === 0 ? (
                            <li>No account revenue yet</li>
                        ) : (
                            revenue.topAccounts.map((a) => (
                                <li key={a.name} className="flex justify-between gap-2">
                                    <span>{a.name}</span>
                                    <span>
                                        MRR ${a.mrrUsd.toLocaleString()} · Due ${a.outstandingUsd.toLocaleString()}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
            </div>

            <Card>
                <div className="grid gap-2 text-sm text-[var(--dos-text-secondary)] sm:grid-cols-2 lg:grid-cols-4">
                    <span>Invoices {revenue.invoiceCount}</span>
                    <span>Paid invoices {revenue.paidInvoiceCount}</span>
                    <span>Failed payments {revenue.failedPaymentCount}</span>
                    <span>Collection cases {revenue.collectionCasesOpen}</span>
                </div>
            </Card>
        </div>
    );
}
