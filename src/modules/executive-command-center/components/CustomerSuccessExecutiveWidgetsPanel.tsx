"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { CustomerSuccessExecutiveWidgets } from "@/src/modules/customer-success/types/os";

export function CustomerSuccessExecutiveWidgetsPanel({ widgets }: { widgets: CustomerSuccessExecutiveWidgets | null }) {
    if (!widgets) {
        return (
            <EmptyState
                title="Customer Success widgets unavailable"
                description="Widgets load from the Customer Success OS snapshot."
            />
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                Customer Success Widgets
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Health Distribution</p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.healthDistribution.map((b) => (
                            <li key={b.bucket} className="flex justify-between gap-2">
                                <span>{b.bucket}</span>
                                <span className="font-semibold text-[var(--dos-text-primary)]">{b.count}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Renewals Due</p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.renewalsDue.length === 0 ? (
                            <li>No renewals in window</li>
                        ) : (
                            widgets.renewalsDue.map((r) => (
                                <li key={`${r.clientName}-${r.daysRemaining}`} className="flex justify-between gap-2">
                                    <span>{r.clientName}</span>
                                    <span>{r.daysRemaining}d · ${r.forecastUsd.toLocaleString()}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Churn Risk</p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.churnRisk.length === 0 ? (
                            <li>No elevated churn</li>
                        ) : (
                            widgets.churnRisk.map((c) => (
                                <li key={`${c.clientName}-${c.riskScore}`} className="flex justify-between gap-2">
                                    <span>{c.clientName}</span>
                                    <span>{c.riskScore} · {c.escalationLevel}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Expansion Pipeline</p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.expansionPipeline.length === 0 ? (
                            <li>No expansion pipeline</li>
                        ) : (
                            widgets.expansionPipeline.map((e) => (
                                <li key={e.title} className="flex justify-between gap-2">
                                    <span>{e.title}</span>
                                    <span>${e.valueUsd.toLocaleString()}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Net Revenue Retention</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.netRevenueRetention}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">CS Activity</p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.activityFeed.length === 0 ? (
                            <li>No recent activity</li>
                        ) : (
                            widgets.activityFeed.map((a) => (
                                <li key={`${a.title}-${a.relativeTime}`}>
                                    {a.title} · {a.relativeTime} · {a.source}
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
            </div>
        </section>
    );
}
