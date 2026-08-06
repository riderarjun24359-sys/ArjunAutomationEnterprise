"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { BILLING_FINANCE_OS_TABS, BILLING_FINANCE_OS_THEME } from "@/src/modules/billing-finance/constants/os";
import { useBillingFinanceOs } from "@/src/modules/billing-finance/hooks/useBillingFinanceOs";
import { listBillingFinanceIntegrations } from "@/src/modules/billing-finance/integrations/platform-bridges";
import type { BillingFinanceOsTab } from "@/src/modules/billing-finance/types/os";
import { AiFinanceAssistantPanel } from "@/src/modules/billing-finance/components/os/AiFinanceAssistantPanel";
import { InvoiceCenterPanel } from "@/src/modules/billing-finance/components/os/InvoiceCenterPanel";
import { PaymentCenterPanel } from "@/src/modules/billing-finance/components/os/PaymentCenterPanel";
import { RevenueDashboardPanel } from "@/src/modules/billing-finance/components/os/RevenueDashboardPanel";
import { SubscriptionManagementPanel } from "@/src/modules/billing-finance/components/os/SubscriptionManagementPanel";

const TABS: Array<{ id: BillingFinanceOsTab; label: string }> = [
    { id: BILLING_FINANCE_OS_TABS.subscriptions, label: "Subscriptions" },
    { id: BILLING_FINANCE_OS_TABS.invoices, label: "Invoice Center" },
    { id: BILLING_FINANCE_OS_TABS.payments, label: "Payment Center" },
    { id: BILLING_FINANCE_OS_TABS.revenue, label: "Revenue Dashboard" },
    { id: BILLING_FINANCE_OS_TABS.assistant, label: "AI Finance Assistant" },
];

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-72" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <SkeletonLoader className="h-16 w-full" />
                    </Card>
                ))}
            </div>
            <Card>
                <SkeletonLoader className="h-64 w-full" />
            </Card>
        </PageTransition>
    );
}

export function BillingFinanceOsPage() {
    const { snapshot, loading, error } = useBillingFinanceOs();
    const [tab, setTab] = useState<BillingFinanceOsTab>(BILLING_FINANCE_OS_TABS.subscriptions);
    const integrations = listBillingFinanceIntegrations();

    if (loading) return <Skeleton />;
    if (error) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Unable to load Billing & Finance OS" description={error} />
            </PageTransition>
        );
    }
    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Sign in required" description="Sign in to access Billing & Finance OS." />
            </PageTransition>
        );
    }

    const stats = [
        { label: "Active Subs", value: String(snapshot.stats.activeSubscriptions) },
        { label: "MRR", value: `$${Math.round(snapshot.stats.mrrUsd).toLocaleString()}` },
        { label: "ARR", value: `$${Math.round(snapshot.stats.arrUsd).toLocaleString()}` },
        { label: "Outstanding", value: `$${Math.round(snapshot.stats.outstandingUsd).toLocaleString()}` },
        { label: "Collected", value: `$${Math.round(snapshot.stats.collectedUsd).toLocaleString()}` },
        { label: "Open Invoices", value: String(snapshot.stats.openInvoices) },
    ];

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <Badge variant="info">{BILLING_FINANCE_OS_THEME.badge}</Badge>
                <h1 className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)] sm:text-3xl">{BILLING_FINANCE_OS_THEME.title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{BILLING_FINANCE_OS_THEME.subtitle}</p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                    Data: {snapshot.source} · Org {snapshot.organizationId ?? "—"}
                </p>
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
                        <Link
                            key={item.id}
                            href={item.href}
                            className="rounded-full border border-[var(--dos-border)] px-3 py-1 text-xs text-[var(--dos-text-secondary)] hover:border-[var(--dos-brand-primary)]"
                        >
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

            {tab === BILLING_FINANCE_OS_TABS.subscriptions ? <SubscriptionManagementPanel items={snapshot.subscriptions} /> : null}
            {tab === BILLING_FINANCE_OS_TABS.invoices ? <InvoiceCenterPanel items={snapshot.invoices} /> : null}
            {tab === BILLING_FINANCE_OS_TABS.payments ? <PaymentCenterPanel items={snapshot.payments} /> : null}
            {tab === BILLING_FINANCE_OS_TABS.revenue ? <RevenueDashboardPanel revenue={snapshot.revenue} /> : null}
            {tab === BILLING_FINANCE_OS_TABS.assistant ? <AiFinanceAssistantPanel assistant={snapshot.assistant} /> : null}
        </PageTransition>
    );
}
