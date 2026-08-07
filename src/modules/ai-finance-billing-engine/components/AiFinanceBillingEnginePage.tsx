"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { AFBE_TAB_LIST, AFBE_TABS, AFBE_THEME, type AfbeTab } from "../constants";
import { useAiFinanceBillingEngine } from "../hooks/useAiFinanceBillingEngine";
import {
    AiFinancialInsightsPanel,
    ExecutiveFinanceDashboardPanel,
    ExecutiveIntelligencePanel,
    ExpenseManagerPanel,
    FinanceAutomationPanel,
    FinancialReportsPanel,
    InvoiceCenterPanel,
    PaymentCenterPanel,
    RevenueAnalyticsPanel,
    SubscriptionBillingPanel,
    TaxGstPanel,
} from "./AiFinanceBillingEnginePanels";

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-96" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <SkeletonLoader className="h-16 w-full" />
                    </Card>
                ))}
            </div>
        </PageTransition>
    );
}

export function AiFinanceBillingEnginePage() {
    const { snapshot, loading, error, creating, createInvoice } = useAiFinanceBillingEngine();
    const [tab, setTab] = useState<AfbeTab>(AFBE_TABS.dashboard);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="AI Finance & Billing Engine unavailable"
                    description={error ?? "Unable to load AI Finance & Billing Engine."}
                />
            </PageTransition>
        );
    }

    if (!snapshot.accessGranted) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="Founder / Admin access required"
                    description={
                        snapshot.accessDeniedReason ?? "This console is restricted to Founder and Admin roles."
                    }
                />
            </PageTransition>
        );
    }

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">
                        Sprint 12 · Finance & Billing
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{AFBE_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{AFBE_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">{snapshot.invoices.rows.length} invoices</Badge>
                    <Badge variant="info">MRR {snapshot.dashboard.kpis.mrr}</Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {AFBE_TAB_LIST.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setTab(item.id)}
                        className={`rounded-[var(--dos-radius-full)] px-4 py-2 text-sm font-medium transition ${
                            tab === item.id
                                ? "bg-[var(--dos-accent)] text-[var(--dos-accent-contrast,white)]"
                                : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {tab === AFBE_TABS.dashboard ? (
                <ExecutiveFinanceDashboardPanel dashboard={snapshot.dashboard} />
            ) : null}
            {tab === AFBE_TABS.invoices ? (
                <InvoiceCenterPanel invoices={snapshot.invoices} creating={creating} onCreate={createInvoice} />
            ) : null}
            {tab === AFBE_TABS.payments ? <PaymentCenterPanel payments={snapshot.payments} /> : null}
            {tab === AFBE_TABS.expenses ? <ExpenseManagerPanel expenses={snapshot.expenses} /> : null}
            {tab === AFBE_TABS.subscriptions ? (
                <SubscriptionBillingPanel subscriptions={snapshot.subscriptions} />
            ) : null}
            {tab === AFBE_TABS.revenue ? <RevenueAnalyticsPanel revenue={snapshot.revenue} /> : null}
            {tab === AFBE_TABS.tax ? <TaxGstPanel tax={snapshot.tax} /> : null}
            {tab === AFBE_TABS.insights ? <AiFinancialInsightsPanel insights={snapshot.insights} /> : null}
            {tab === AFBE_TABS.reports ? <FinancialReportsPanel reports={snapshot.reports} /> : null}
            {tab === AFBE_TABS.automation ? <FinanceAutomationPanel automation={snapshot.automation} /> : null}
            {tab === AFBE_TABS.executive ? <ExecutiveIntelligencePanel executive={snapshot.executive} /> : null}
        </PageTransition>
    );
}
