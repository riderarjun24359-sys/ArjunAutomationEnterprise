"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { GOP_TAB_LIST, GOP_TABS, GOP_THEME, type GopTab } from "../constants";
import { useGrowthOsPublishing } from "../hooks/useGrowthOsPublishing";
import {
    CampaignOrchestratorPanel,
    DistributionAnalyticsPanel,
    PublishingSchedulerPanel,
    ReleaseManagerPanel,
    SocialDistributionPanel,
    WebsitePublisherPanel,
} from "./GrowthOsPublishingPanels";

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

export function GrowthOsPublishingPage() {
    const { snapshot, loading, error } = useGrowthOsPublishing();
    const [tab, setTab] = useState<GopTab>(GOP_TABS.campaigns);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="Publishing & Distribution unavailable"
                    description={error ?? "Unable to load Growth OS publishing console."}
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
                        Growth OS · Sprint 5
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{GOP_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{GOP_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">Provider-agnostic</Badge>
                    <Badge variant="info">{snapshot.campaigns.pendingApprovals} approvals</Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {GOP_TAB_LIST.map((item) => (
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

            {tab === GOP_TABS.campaigns ? <CampaignOrchestratorPanel campaigns={snapshot.campaigns} /> : null}
            {tab === GOP_TABS.scheduler ? <PublishingSchedulerPanel scheduler={snapshot.scheduler} /> : null}
            {tab === GOP_TABS.website ? <WebsitePublisherPanel website={snapshot.website} /> : null}
            {tab === GOP_TABS.social ? <SocialDistributionPanel social={snapshot.social} /> : null}
            {tab === GOP_TABS.releases ? <ReleaseManagerPanel releases={snapshot.releases} /> : null}
            {tab === GOP_TABS.analytics ? <DistributionAnalyticsPanel analytics={snapshot.analytics} /> : null}
        </PageTransition>
    );
}
