"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { AAE_TAB_LIST, AAE_TABS, AAE_THEME, type AaeTab } from "../constants";
import { useAiAutomationEngine } from "../hooks/useAiAutomationEngine";
import {
    ActionsLibraryPanel,
    AiWorkflowGeneratorPanel,
    ApprovalCenterPanel,
    ExecutionCenterPanel,
    ExecutiveAutomationPanel,
    IntegrationHubPanel,
    MonitoringDashboardPanel,
    TemplateMarketplacePanel,
    TriggerCenterPanel,
    WorkflowBuilderPanel,
} from "./AiAutomationEnginePanels";

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

export function AiAutomationEnginePage() {
    const { snapshot, loading, error } = useAiAutomationEngine();
    const [tab, setTab] = useState<AaeTab>(AAE_TABS.builder);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="AI Automation & Workflow Engine unavailable"
                    description={error ?? "Unable to load AI Automation & Workflow Engine."}
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
                        Sprint 14 · Automation & Workflows
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{AAE_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{AAE_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">{snapshot.builder.workflows.length} workflows</Badge>
                    <Badge variant="info">{snapshot.monitoring.activeWorkflows} active</Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {AAE_TAB_LIST.map((item) => (
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

            {tab === AAE_TABS.builder ? <WorkflowBuilderPanel builder={snapshot.builder} /> : null}
            {tab === AAE_TABS.triggers ? <TriggerCenterPanel triggers={snapshot.triggers} /> : null}
            {tab === AAE_TABS.actions ? <ActionsLibraryPanel actions={snapshot.actions} /> : null}
            {tab === AAE_TABS.generator ? <AiWorkflowGeneratorPanel generator={snapshot.generator} /> : null}
            {tab === AAE_TABS.execution ? <ExecutionCenterPanel execution={snapshot.execution} /> : null}
            {tab === AAE_TABS.approvals ? <ApprovalCenterPanel approvals={snapshot.approvals} /> : null}
            {tab === AAE_TABS.monitoring ? <MonitoringDashboardPanel monitoring={snapshot.monitoring} /> : null}
            {tab === AAE_TABS.templates ? <TemplateMarketplacePanel templates={snapshot.templates} /> : null}
            {tab === AAE_TABS.integrations ? <IntegrationHubPanel integrations={snapshot.integrations} /> : null}
            {tab === AAE_TABS.executive ? <ExecutiveAutomationPanel executive={snapshot.executive} /> : null}
        </PageTransition>
    );
}
