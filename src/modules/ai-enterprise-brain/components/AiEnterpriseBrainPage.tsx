"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { AEB_TAB_LIST, AEB_TABS, AEB_THEME, type AebTab } from "../constants";
import { useAiEnterpriseBrain } from "../hooks/useAiEnterpriseBrain";
import {
    AiDecisionEnginePanel,
    CrossModuleOrchestratorPanel,
    EnterpriseMemoryPanel,
    ExceptionCenterPanel,
    ExecutiveMissionDashboardPanel,
    FounderApprovalCenterPanel,
    MissionControlPanel,
    MultiAgentCoordinatorPanel,
    TaskPlannerPanel,
} from "./AiEnterpriseBrainPanels";

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

export function AiEnterpriseBrainPage() {
    const { snapshot, loading, error } = useAiEnterpriseBrain();
    const [tab, setTab] = useState<AebTab>(AEB_TABS.missionControl);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="AI Enterprise Brain unavailable"
                    description={error ?? "Unable to load AI Enterprise Brain."}
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
                        Sprint 17 · AI Enterprise Brain
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{AEB_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{AEB_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">{snapshot.missionControl.activeMissionCount} missions</Badge>
                    <Badge variant="info">{snapshot.approvals.pendingCount} pending</Badge>
                    <Badge variant="info">
                        Health{" "}
                        {snapshot.executive.companyHealthScore == null
                            ? "—"
                            : snapshot.executive.companyHealthScore}
                    </Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            {snapshot.accessDeniedReason && snapshot.organizationId == null ? (
                <Card>
                    <p className="text-sm text-[var(--dos-text-secondary)]">{snapshot.accessDeniedReason}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {AEB_TAB_LIST.map((item) => (
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

            {tab === AEB_TABS.missionControl ? (
                <MissionControlPanel missionControl={snapshot.missionControl} />
            ) : null}
            {tab === AEB_TABS.multiAgent ? <MultiAgentCoordinatorPanel multiAgent={snapshot.multiAgent} /> : null}
            {tab === AEB_TABS.decisionEngine ? (
                <AiDecisionEnginePanel decisionEngine={snapshot.decisionEngine} />
            ) : null}
            {tab === AEB_TABS.taskPlanner ? <TaskPlannerPanel taskPlanner={snapshot.taskPlanner} /> : null}
            {tab === AEB_TABS.orchestrator ? (
                <CrossModuleOrchestratorPanel orchestrator={snapshot.orchestrator} />
            ) : null}
            {tab === AEB_TABS.memory ? <EnterpriseMemoryPanel memory={snapshot.memory} /> : null}
            {tab === AEB_TABS.exceptions ? <ExceptionCenterPanel exceptions={snapshot.exceptions} /> : null}
            {tab === AEB_TABS.approvals ? (
                <FounderApprovalCenterPanel approvals={snapshot.approvals} />
            ) : null}
            {tab === AEB_TABS.executive ? (
                <ExecutiveMissionDashboardPanel executive={snapshot.executive} />
            ) : null}
        </PageTransition>
    );
}
