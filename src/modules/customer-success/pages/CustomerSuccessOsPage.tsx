"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { CUSTOMER_SUCCESS_OS_TABS, CUSTOMER_SUCCESS_OS_THEME } from "@/src/modules/customer-success/constants/os";
import { useCustomerSuccessOs } from "@/src/modules/customer-success/hooks/useCustomerSuccessOs";
import { listCustomerSuccessIntegrations } from "@/src/modules/customer-success/integrations/platform-bridges";
import type { CsOsTab } from "@/src/modules/customer-success/types/os";
import { AiCustomerSuccessAssistantPanel } from "@/src/modules/customer-success/components/os/AiCustomerSuccessAssistantPanel";
import { ChurnPreventionPanel } from "@/src/modules/customer-success/components/os/ChurnPreventionPanel";
import { CustomerHealthCenterPanel } from "@/src/modules/customer-success/components/os/CustomerHealthCenterPanel";
import { CustomerTimelinePanel } from "@/src/modules/customer-success/components/os/CustomerTimelinePanel";
import { ExpansionCenterPanel } from "@/src/modules/customer-success/components/os/ExpansionCenterPanel";
import { RenewalCenterPanel } from "@/src/modules/customer-success/components/os/RenewalCenterPanel";
import { SuccessPlansPanel } from "@/src/modules/customer-success/components/os/SuccessPlansPanel";

const TABS: Array<{ id: CsOsTab; label: string }> = [
    { id: CUSTOMER_SUCCESS_OS_TABS.health, label: "Health Center" },
    { id: CUSTOMER_SUCCESS_OS_TABS.plans, label: "Success Plans" },
    { id: CUSTOMER_SUCCESS_OS_TABS.renewals, label: "Renewal Center" },
    { id: CUSTOMER_SUCCESS_OS_TABS.churn, label: "Churn Prevention" },
    { id: CUSTOMER_SUCCESS_OS_TABS.expansion, label: "Expansion Center" },
    { id: CUSTOMER_SUCCESS_OS_TABS.timeline, label: "Customer Timeline" },
    { id: CUSTOMER_SUCCESS_OS_TABS.assistant, label: "AI Assistant" },
];

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-72" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}><SkeletonLoader className="h-16 w-full" /></Card>
                ))}
            </div>
            <Card><SkeletonLoader className="h-64 w-full" /></Card>
        </PageTransition>
    );
}

export function CustomerSuccessOsPage() {
    const { snapshot, loading, error } = useCustomerSuccessOs();
    const [tab, setTab] = useState<CsOsTab>(CUSTOMER_SUCCESS_OS_TABS.health);
    const integrations = listCustomerSuccessIntegrations();

    if (loading) return <Skeleton />;
    if (error) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Unable to load Customer Success OS" description={error} />
            </PageTransition>
        );
    }
    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Sign in required" description="Sign in to access Customer Success OS." />
            </PageTransition>
        );
    }

    const stats = [
        { label: "Customers", value: String(snapshot.stats.customersTracked) },
        { label: "Avg Health", value: String(snapshot.stats.averageHealth) },
        { label: "Renewals 30d", value: String(snapshot.stats.renewalsNext30Days) },
        { label: "High Churn", value: String(snapshot.stats.highChurnRisk) },
        { label: "Expansion $", value: `$${Math.round(snapshot.stats.expansionPipelineUsd).toLocaleString()}` },
        { label: "NRR", value: String(snapshot.stats.netRevenueRetention) },
    ];

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <Badge variant="info">{CUSTOMER_SUCCESS_OS_THEME.badge}</Badge>
                <h1 className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)] sm:text-3xl">{CUSTOMER_SUCCESS_OS_THEME.title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{CUSTOMER_SUCCESS_OS_THEME.subtitle}</p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Data: {snapshot.source} · Org {snapshot.organizationId ?? "—"}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{s.label}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{s.value}</p>
                    </Card>
                ))}
            </div>

            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Integrations</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {integrations.map((item) => (
                        <Link key={item.id} href={item.href} className="rounded-full border border-[var(--dos-border)] px-3 py-1 text-xs text-[var(--dos-text-secondary)] hover:border-[var(--dos-brand-primary)]">
                            {item.label}
                        </Link>
                    ))}
                </div>
            </Card>

            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                            tab === t.id
                                ? "bg-[var(--dos-brand-primary)] text-white"
                                : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === CUSTOMER_SUCCESS_OS_TABS.health ? <CustomerHealthCenterPanel items={snapshot.healthCenter} /> : null}
            {tab === CUSTOMER_SUCCESS_OS_TABS.plans ? <SuccessPlansPanel items={snapshot.successPlans} /> : null}
            {tab === CUSTOMER_SUCCESS_OS_TABS.renewals ? <RenewalCenterPanel items={snapshot.renewals} /> : null}
            {tab === CUSTOMER_SUCCESS_OS_TABS.churn ? <ChurnPreventionPanel items={snapshot.churnPrevention} /> : null}
            {tab === CUSTOMER_SUCCESS_OS_TABS.expansion ? <ExpansionCenterPanel items={snapshot.expansion} /> : null}
            {tab === CUSTOMER_SUCCESS_OS_TABS.timeline ? <CustomerTimelinePanel items={snapshot.timeline} /> : null}
            {tab === CUSTOMER_SUCCESS_OS_TABS.assistant ? <AiCustomerSuccessAssistantPanel assistant={snapshot.assistant} /> : null}
        </PageTransition>
    );
}
