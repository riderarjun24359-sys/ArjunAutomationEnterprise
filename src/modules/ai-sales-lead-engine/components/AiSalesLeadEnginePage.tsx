"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { ASLE_TAB_LIST, ASLE_TABS, ASLE_THEME, type AsleTab } from "../constants";
import { useAiSalesLeadEngine } from "../hooks/useAiSalesLeadEngine";
import {
    AnalyticsPanel,
    AutomationIntegrationsPanel,
    DocumentsPanel,
    LeadCaptureInboxPanel,
    PipelineDealsPanel,
    QualificationScoringPanel,
    WorkspacePanel,
} from "./AiSalesLeadEnginePanels";

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

export function AiSalesLeadEnginePage() {
    const { snapshot, loading, error } = useAiSalesLeadEngine();
    const [tab, setTab] = useState<AsleTab>(ASLE_TABS.capture);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="AI Sales & Lead Generation Engine unavailable"
                    description={error ?? "Unable to load AI Sales & Lead Generation Engine."}
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
                        Sprint 10 · AI Sales
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{ASLE_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{ASLE_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">{snapshot.capture.totalLeads} leads</Badge>
                    <Badge variant="info">{snapshot.pipeline.openDealCount} deals</Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {ASLE_TAB_LIST.map((item) => (
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

            {tab === ASLE_TABS.capture ? <LeadCaptureInboxPanel capture={snapshot.capture} /> : null}
            {tab === ASLE_TABS.qualify ? <QualificationScoringPanel qualify={snapshot.qualify} /> : null}
            {tab === ASLE_TABS.pipeline ? <PipelineDealsPanel pipeline={snapshot.pipeline} /> : null}
            {tab === ASLE_TABS.documents ? <DocumentsPanel documents={snapshot.documents} /> : null}
            {tab === ASLE_TABS.automation ? <AutomationIntegrationsPanel automation={snapshot.automation} /> : null}
            {tab === ASLE_TABS.analytics ? <AnalyticsPanel analytics={snapshot.analytics} /> : null}
            {tab === ASLE_TABS.workspace ? <WorkspacePanel workspace={snapshot.workspace} /> : null}
        </PageTransition>
    );
}
