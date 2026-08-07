"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { AOC_TAB_LIST, AOC_TABS, AOC_THEME, type AocTab } from "../constants";
import { useAiOperationsCenter } from "../hooks/useAiOperationsCenter";
import {
    AiAgentMonitorPanel,
    AlertCenterPanel,
    BackupRecoveryPanel,
    ExecutiveOperationsPanel,
    InfrastructurePanel,
    LogsAndAuditPanel,
    PerformanceAnalyticsPanel,
    SecurityCenterPanel,
    SystemHealthPanel,
} from "./AiOperationsCenterPanels";

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

export function AiOperationsCenterPage() {
    const { snapshot, loading, error } = useAiOperationsCenter();
    const [tab, setTab] = useState<AocTab>(AOC_TABS.health);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="AI Operations & Monitoring Center unavailable"
                    description={error ?? "Unable to load AI Operations & Monitoring Center."}
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
                        Sprint 15 · Operations & Monitoring
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{AOC_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{AOC_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">Health {snapshot.health.overallScore ?? "—"}</Badge>
                    <Badge variant="info">{snapshot.alerts.critical} critical</Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {AOC_TAB_LIST.map((item) => (
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

            {tab === AOC_TABS.health ? <SystemHealthPanel health={snapshot.health} /> : null}
            {tab === AOC_TABS.agents ? <AiAgentMonitorPanel agents={snapshot.agents} /> : null}
            {tab === AOC_TABS.infrastructure ? (
                <InfrastructurePanel infrastructure={snapshot.infrastructure} />
            ) : null}
            {tab === AOC_TABS.security ? <SecurityCenterPanel security={snapshot.security} /> : null}
            {tab === AOC_TABS.logs ? <LogsAndAuditPanel logs={snapshot.logs} /> : null}
            {tab === AOC_TABS.alerts ? <AlertCenterPanel alerts={snapshot.alerts} /> : null}
            {tab === AOC_TABS.backup ? <BackupRecoveryPanel backup={snapshot.backup} /> : null}
            {tab === AOC_TABS.performance ? (
                <PerformanceAnalyticsPanel performance={snapshot.performance} />
            ) : null}
            {tab === AOC_TABS.executive ? <ExecutiveOperationsPanel executive={snapshot.executive} /> : null}
        </PageTransition>
    );
}
