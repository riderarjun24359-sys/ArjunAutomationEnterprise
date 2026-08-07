"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { GOV_TAB_LIST, GOV_TABS, GOV_THEME, type GovTab } from "../constants";
import { useGrowthOsVideo } from "../hooks/useGrowthOsVideo";
import {
    AiScriptStudioPanel,
    QualityAssuranceEnginePanel,
    StoryboardEnginePanel,
    VideoCompositionEnginePanel,
    VideoProjectManagerPanel,
    VoiceAudioStudioPanel,
} from "./GrowthOsVideoPanels";

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

export function GrowthOsVideoPage() {
    const { snapshot, loading, error } = useGrowthOsVideo();
    const [tab, setTab] = useState<GovTab>(GOV_TABS.scripts);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="AI Video Factory unavailable"
                    description={error ?? "Unable to load Growth OS video factory."}
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
                        Growth OS · Sprint 4
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{GOV_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{GOV_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">Provider-agnostic</Badge>
                    <Badge variant="info">{snapshot.qa.pendingApprovals} approvals</Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {GOV_TAB_LIST.map((item) => (
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

            {tab === GOV_TABS.scripts ? <AiScriptStudioPanel scripts={snapshot.scripts} /> : null}
            {tab === GOV_TABS.storyboard ? <StoryboardEnginePanel storyboard={snapshot.storyboard} /> : null}
            {tab === GOV_TABS.audio ? <VoiceAudioStudioPanel audio={snapshot.audio} /> : null}
            {tab === GOV_TABS.composition ? <VideoCompositionEnginePanel composition={snapshot.composition} /> : null}
            {tab === GOV_TABS.projects ? <VideoProjectManagerPanel projects={snapshot.projects} /> : null}
            {tab === GOV_TABS.qa ? <QualityAssuranceEnginePanel qa={snapshot.qa} /> : null}
        </PageTransition>
    );
}
