"use client";

import { Card } from "@/src/design-os/components/primitives/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { RevenueDashboardMetrics } from "../../types/os";

export function RevenueDashboardPanel({ revenue }: { revenue: RevenueDashboardMetrics }) {
    if (revenue.invoiceCount === 0 && revenue.activeSubscriptions === 0) {
        return <EmptyState title="No billing activity" description="Activity metrics appear when invoices, subscriptions, and payments are recorded." />;
    }

    return (
        <div className="space-y-6">
            <Card variant="base">
                <p className="text-sm font-semibold text-[var(--dos-text-primary)]">Revenue activity</p>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">Monetary totals are hidden until every source is normalized to INR. This view shows operational counts only.</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div><p className="text-xs uppercase text-[var(--dos-text-tertiary)]">Total invoices</p><p className="mt-1 text-2xl font-bold">{revenue.invoiceCount}</p></div>
                    <div><p className="text-xs uppercase text-[var(--dos-text-tertiary)]">Paid invoices</p><p className="mt-1 text-2xl font-bold text-[var(--dos-tint-success)]">{revenue.paidInvoiceCount}</p></div>
                    <div><p className="text-xs uppercase text-[var(--dos-text-tertiary)]">Failed payments</p><p className="mt-1 text-2xl font-bold text-[var(--dos-tint-critical)]">{revenue.failedPaymentCount}</p></div>
                    <div><p className="text-xs uppercase text-[var(--dos-text-tertiary)]">Open collection cases</p><p className="mt-1 text-2xl font-bold text-[var(--dos-tint-warning)]">{revenue.collectionCasesOpen}</p></div>
                </div>
            </Card>
            <Card variant="base">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dos-text-tertiary)]">Accounts with billing activity</p>
                <ul className="mt-4 space-y-3">
                    {revenue.topAccounts.slice(0, 8).map((account) => <li key={account.name} className="border-b border-[var(--dos-border-subtle)] pb-2 text-sm text-[var(--dos-text-secondary)] last:border-0">{account.name}</li>)}
                </ul>
            </Card>
        </div>
    );
}
