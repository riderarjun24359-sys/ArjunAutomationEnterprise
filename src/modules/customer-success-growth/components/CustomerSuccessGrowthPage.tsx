"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { CSG_TAB_LIST, CSG_TABS, CSG_THEME, type CsgTab } from "../constants";
import { useCustomerSuccessGrowth } from "../hooks/useCustomerSuccessGrowth";
import {
    CustomerEducationPanel,
    FounderDailyBriefPanel,
    ReferralEnginePanel,
    SuccessMonitoringPanel,
    TestimonialCenterPanel,
} from "./CustomerSuccessGrowthPanels";

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

export function CustomerSuccessGrowthPage() {
    const { snapshot, loading, error } = useCustomerSuccessGrowth();
    const [tab, setTab] = useState<CsgTab>(CSG_TABS.monitoring);

    if (loading) return <Skeleton />;

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="Customer Success Growth unavailable"
                    description={error ?? "Unable to load customer acquisition and success data."}
                />
            </PageTransition>
        );
    }

    if (!snapshot.accessGranted) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="Founder / Admin access required"
                    description={snapshot.accessDeniedReason ?? "This console is restricted to Founder and Admin roles."}
                />
            </PageTransition>
        );
    }

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">
                        Growth Sprint
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{CSG_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{CSG_THEME.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Live Supabase</Badge>
                    <Badge variant="info">{snapshot.brief.newOrganizationsToday} new orgs</Badge>
                    <span className="text-xs text-[var(--dos-text-tertiary)]">Fetched {snapshot.fetchedAt}</span>
                </div>
            </div>

            {error ? (
                <Card>
                    <p className="text-sm text-[var(--dos-warning)]">{error}</p>
                </Card>
            ) : null}

            {snapshot.accessDeniedReason && snapshot.organizationId ? (
                <Card>
                    <p className="text-sm text-[var(--dos-text-secondary)]">{snapshot.accessDeniedReason}</p>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {CSG_TAB_LIST.map((item) => (
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

            {tab === CSG_TABS.monitoring ? <SuccessMonitoringPanel monitoring={snapshot.monitoring} /> : null}
            {tab === CSG_TABS.referrals ? <ReferralEnginePanel referrals={snapshot.referrals} /> : null}
            {tab === CSG_TABS.testimonials ? <TestimonialCenterPanel testimonials={snapshot.testimonials} /> : null}
            {tab === CSG_TABS.education ? <CustomerEducationPanel education={snapshot.education} /> : null}
            {tab === CSG_TABS.brief ? <FounderDailyBriefPanel brief={snapshot.brief} /> : null}
        </PageTransition>
    );
}
