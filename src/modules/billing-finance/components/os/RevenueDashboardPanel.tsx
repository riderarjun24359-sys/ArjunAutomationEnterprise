"use client";

import { Card } from "@/src/design-os/components/primitives/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { RevenueDashboardMetrics } from "../../types/os";

export function RevenueDashboardPanel({ revenue }: { revenue: RevenueDashboardMetrics }) {
    if (!revenue.revenueVerified) {
        return (
            <EmptyState
                title="Revenue not verified"
                description="MRR, ARR and collected revenue are unavailable until Razorpay settlements are reconciled to exact INR invoices and deals. Legacy USD snapshots and CRM estimates are excluded."
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
                                <span className="text-[var(--dos-text-primary)] tabular-nums">Inv: ₹{row.invoicedUsd.toLocaleString()} | Coll: ₹{row.collectedUsd.toLocaleString()}</span>
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
                                <span className="font-semibold text-[var(--dos-text-primary)] tabular-nums">₹{Math.round(a.mrrUsd).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
            <Card variant="base" className="grid gap-6 text-sm text-[var(--dos-text-secondary)] sm:grid-cols-2 lg:grid-cols-4">
                <div>Total Invoices <strong>{revenue.invoiceCount}</strong></div>
                <div>Paid <strong>{revenue.paidInvoiceCount}</strong></div>
                <div>Failed Payments <strong>{revenue.failedPaymentCount}</strong></div>
                <div>Collection Cases <strong>{revenue.collectionCasesOpen}</strong></div>
            </Card>
        </div>
    );
}
