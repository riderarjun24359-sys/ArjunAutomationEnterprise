"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { EXECUTIVE_COMMAND_CENTER_THEME } from "../constants";
import { useExecutiveCommandCenter } from "../hooks/useExecutiveCommandCenter";
import { AiExecutiveInsightsPanel } from "./AiExecutiveInsightsPanel";
import { ExecutiveBriefCard } from "./ExecutiveBriefCard";
import { ExecutiveChartsPanel } from "./ExecutiveChartsPanel";
import { ExecutiveFeed } from "./ExecutiveFeed";
import { IntelligenceEnginesPanel } from "./IntelligenceEnginesPanel";
import { IntelligenceModuleGrid } from "./IntelligenceModuleGrid";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { RecentActivityTimeline } from "./RecentActivityTimeline";
import { RecentNotificationsPanel, RecentNotificationsSkeleton } from "./RecentNotificationsPanel";
import { UnifiedKpiStrip, UnifiedKpiStripSkeleton } from "./UnifiedKpiStrip";
import { CustomerSuccessExecutiveWidgetsPanel } from "./CustomerSuccessExecutiveWidgetsPanel";
import { FinanceExecutiveWidgetsPanel } from "./FinanceExecutiveWidgetsPanel";
import { ExecutiveHrWidgetsPanel } from "./ExecutiveHrWidgetsPanel";
import { ExecutiveIntegrationWidgetsPanel } from "./ExecutiveIntegrationWidgetsPanel";

function ExecutiveCommandCenterSkeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6 md:space-y-8">
            <div>
                <SkeletonLoader className="h-5 w-40" />
                <SkeletonLoader className="mt-3 h-9 w-80 max-w-full" />
                <SkeletonLoader className="mt-2 h-4 w-full max-w-xl" />
            </div>
            <UnifiedKpiStripSkeleton />
            <Card>
                <SkeletonLoader className="h-4 w-32" />
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonLoader key={i} className="h-24 w-full" />
                    ))}
                </div>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <SkeletonLoader className="h-4 w-40" />
                        <SkeletonLoader className="mt-4 h-56 w-full" />
                    </Card>
                ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <SkeletonLoader className="h-4 w-48" />
                    <SkeletonLoader className="mt-4 h-64 w-full" />
                </Card>
                <RecentNotificationsSkeleton />
            </div>
        </PageTransition>
    );
}

export function ExecutiveCommandCenterPage() {
    const { snapshot, loading, error } = useExecutiveCommandCenter();

    if (loading) {
        return <ExecutiveCommandCenterSkeleton />;
    }

    if (error) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Unable to load executive dashboard" description={error} />
            </PageTransition>
        );
    }

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState
                    title="Sign in required"
                    description="Sign in to access the Executive Command Center and live organization statistics."
                />
            </PageTransition>
        );
    }

    const statsEmpty =
        snapshot.liveStats.totalClients === 0 &&
        snapshot.liveStats.activeProjects === 0 &&
        snapshot.liveStats.openTasks === 0 &&
        snapshot.liveStats.crmLeads === 0 &&
        snapshot.liveStats.revenue.collected === 0 &&
        snapshot.liveStats.revenue.invoiceCount === 0 &&
        snapshot.liveStats.source === "fallback";

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6 md:space-y-8">
            <div>
                <Badge variant="info">{EXECUTIVE_COMMAND_CENTER_THEME.badge}</Badge>
                <h1 className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)] sm:text-3xl">
                    {EXECUTIVE_COMMAND_CENTER_THEME.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">
                    {EXECUTIVE_COMMAND_CENTER_THEME.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--dos-text-tertiary)]">
                    <span>{snapshot.organizationName}</span>
                    <span>·</span>
                    <span>Data: {snapshot.liveStats.source}</span>
                    <span>·</span>
                    <span>Unified score {snapshot.unifiedScore}%</span>
                </div>
            </div>

            <UnifiedKpiStrip kpis={snapshot.kpis} empty={statsEmpty} />
            <QuickActionsPanel actions={snapshot.widgets.quickActions} />
            <ExecutiveBriefCard brief={snapshot.brief} />
            <ExecutiveChartsPanel charts={snapshot.widgets.charts} />
            <CustomerSuccessExecutiveWidgetsPanel widgets={snapshot.widgets.customerSuccess} />
            <FinanceExecutiveWidgetsPanel widgets={snapshot.widgets.finance} />
            <ExecutiveHrWidgetsPanel widgets={snapshot.widgets.hrms} />
            <ExecutiveIntegrationWidgetsPanel widgets={snapshot.widgets.integrations} />

            <div className="grid gap-6 lg:grid-cols-2">
                <AiExecutiveInsightsPanel insights={snapshot.widgets.insights} />
                <RecentActivityTimeline items={snapshot.widgets.activityTimeline} />
            </div>

            <section>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                    Executive AI modules
                </h2>
                <IntelligenceModuleGrid modules={snapshot.modules} />
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <IntelligenceEnginesPanel
                    attention={snapshot.attentionToday}
                    risks={snapshot.risks}
                    opportunities={snapshot.opportunities}
                    recommendations={snapshot.recommendations}
                />
                <div className="space-y-6">
                    <RecentNotificationsPanel notifications={snapshot.notifications} />
                    <ExecutiveFeed items={snapshot.feed} />
                </div>
            </div>
        </PageTransition>
    );
}
