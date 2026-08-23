"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/design-os/components/primitives/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { EntityRow } from "@/src/design-os/components/primitives/EntityRow";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type { CrmEnterpriseSnapshot } from "@/src/modules/crm/types/enterprise";

export default function CustomerOsPage() {
    const [snapshot, setSnapshot] = useState<CrmEnterpriseSnapshot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with authenticated context
        crmService.getEnterpriseSnapshot("system", "system@arjun.dev")
            .then(setSnapshot)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!snapshot) return <div className="p-6">Error loading snapshot.</div>;

    const { stats, leads, insights } = snapshot;

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8 p-6">
            <header>
                <h1 className="text-3xl font-bold text-[var(--dos-text-primary)]">Customer OS</h1>
                <p className="text-[var(--dos-text-secondary)]">Enterprise relationship operating environment</p>
            </header>

            {/* Customer Pulse */}
            <section aria-labelledby="pulse-heading">
                <h2 id="pulse-heading" className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Customer Pulse</h2>
                <div className="grid gap-4 sm:grid-cols-4">
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="active-customers-label">Active Customers</p>
                        <p className="mt-1 text-2xl font-bold" aria-labelledby="active-customers-label">{stats.totalClients}</p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="pipeline-value-label">Pipeline Value</p>
                        <p className="mt-1 text-2xl font-bold" aria-labelledby="pipeline-value-label">
                            {/* Assuming value represents raw amount, needs proper formatting if available in stats */}
                            {stats.collectedRevenueLabel}
                        </p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="active-cases-label">Active Cases</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-tint-processing)]" aria-labelledby="active-cases-label">{stats.totalLeads}</p>
                    </Card>
                    <Card variant="insight">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="pending-tasks-label">Pending Insights</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-tint-warning)]" aria-labelledby="pending-tasks-label">{insights.length}</p>
                    </Card>
                </div>
            </section>

            {/* Relationship / Pipeline Signal */}
            <section aria-labelledby="relationship-heading">
                <h2 id="relationship-heading" className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Relationship Signal</h2>
                <div className="space-y-3">
                    {leads.slice(0, 5).map(lead => (
                        <EntityRow key={lead.id}>
                            <div className="flex flex-col">
                                <p className="font-semibold text-[var(--dos-text-primary)]">{lead.name} • {lead.company}</p>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Opportunity • Stage: {lead.stage}</p>
                            </div>
                            <p className="text-lg font-bold text-[var(--dos-text-primary)]">{lead.valueLabel}</p>
                        </EntityRow>
                    ))}
                    {leads.length === 0 && <p className="text-[var(--dos-text-secondary)]">No active relationships.</p>}
                </div>
            </section>

            {/* Attention Field */}
            {insights.length > 0 && (
                <section aria-labelledby="attention-heading">
                    <h2 id="attention-heading" className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Needs Attention</h2>
                    <div className="space-y-3">
                        {insights.slice(0, 3).map(insight => (
                            <EntityRow key={insight.id}>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{insight.title}</p>
                                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{insight.detail}</p>
                                </div>
                                <p className="text-sm font-medium text-[var(--dos-tint-critical)]">{insight.priority}</p>
                            </EntityRow>
                        ))}
                    </div>
                </section>
            )}
        </PageTransition>
    );
}
