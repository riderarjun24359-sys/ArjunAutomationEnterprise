"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { FinanceExecutiveWidgets } from "@/src/modules/billing-finance/types/os";

export function FinanceExecutiveWidgetsPanel({ widgets }: { widgets: FinanceExecutiveWidgets | null }) {
    if (!widgets) {
        return (
            <EmptyState
                title="Finance widgets unavailable"
                description="Widgets load from the Billing & Finance OS snapshot."
            />
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                Finance Executive Widgets
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">MRR</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">${widgets.mrrUsd.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">ARR</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">${widgets.arrUsd.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Outstanding</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">${widgets.outstandingUsd.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Collection Rate</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.collectionRate}%</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Renewals (30d)</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.renewalsNext30Days}</p>
                    <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Open collection cases {widgets.openCollectionCases}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Failed Payments</p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.failedPayments.length === 0 ? (
                            <li>No failed payments</li>
                        ) : (
                            widgets.failedPayments.map((p) => (
                                <li key={`${p.account}-${p.amountUsd}`} className="flex justify-between gap-2">
                                    <span>{p.account}</span>
                                    <span>${p.amountUsd.toLocaleString()}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
                <Card className="md:col-span-2 xl:col-span-3">
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Revenue Trend</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.revenueTrend.length === 0 ? (
                            <li>No revenue trend yet</li>
                        ) : (
                            widgets.revenueTrend.map((r) => (
                                <li key={r.month} className="flex justify-between gap-2">
                                    <span>{r.month}</span>
                                    <span>${r.collectedUsd.toLocaleString()}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
            </div>
        </section>
    );
}
