"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/src/design-os/components/Badge";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { EXECUTIVE_COMMAND_CENTER_THEME } from "../constants";
import { useExecutiveCommandCenter } from "../hooks/useExecutiveCommandCenter";
import { getEnterprisePulse } from "./EnterprisePulse";
import { ExecutiveBriefCard } from "./ExecutiveBriefCard";
import { ExecutiveChartsPanel } from "./ExecutiveChartsPanel";
import { ExecutiveFeed } from "./ExecutiveFeed";
import { IntelligenceEnginesPanel } from "./IntelligenceEnginesPanel";
import { IntelligenceModuleGrid } from "./IntelligenceModuleGrid";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { RecentNotificationsPanel } from "./RecentNotificationsPanel";
import { UnifiedKpiStrip, UnifiedKpiStripSkeleton } from "./UnifiedKpiStrip";

const AiExecutiveInsightsPanel = dynamic(() => import("./AiExecutiveInsightsPanel").then((m) => m.AiExecutiveInsightsPanel), { ssr: false });
const RecentActivityTimeline = dynamic(() => import("./RecentActivityTimeline").then((m) => m.RecentActivityTimeline), { ssr: false });
const CustomerSuccessExecutiveWidgetsPanel = dynamic(
    () => import("./CustomerSuccessExecutiveWidgetsPanel").then((m) => m.CustomerSuccessExecutiveWidgetsPanel),
    { ssr: false },
);
const FinanceExecutiveWidgetsPanel = dynamic(
    () => import("./FinanceExecutiveWidgetsPanel").then((m) => m.FinanceExecutiveWidgetsPanel),
    { ssr: false },
);
const ExecutiveHrWidgetsPanel = dynamic(() => import("./ExecutiveHrWidgetsPanel").then((m) => m.ExecutiveHrWidgetsPanel), { ssr: false });
const ExecutiveSecurityWidgetsPanel = dynamic(() => import("./ExecutiveSecurityWidgetsPanel").then((m) => m.ExecutiveSecurityWidgetsPanel), { ssr: false });

function ExecutiveCommandCenterSkeleton() {
    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <div className="space-y-4">
                <SkeletonLoader className="h-6 w-40" />
                <SkeletonLoader className="h-12 w-96" />
                <SkeletonLoader className="h-5 w-full max-w-2xl" />
            </div>
            <UnifiedKpiStripSkeleton />
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
            <PageTransition className="mx-auto max-w-[85rem]">
                <div className="os-panel p-12 text-center">
                    <h2 className="dos-text-h2 text-[var(--dos-error)]">Unable to load command center</h2>
                    <p className="mt-2 text-[var(--dos-text-secondary)]">{error}</p>
                </div>
            </PageTransition>
        );
    }

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-[85rem]">
                <div className="os-panel p-12 text-center">
                    <h2 className="dos-text-h2">Sign in required</h2>
                    <p className="mt-2 text-[var(--dos-text-secondary)]">Please sign in to access your command center.</p>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--dos-border-subtle)] pb-6">
                    <div>
                        <Badge variant="info" className="w-fit mb-2">{EXECUTIVE_COMMAND_CENTER_THEME.badge}</Badge>
                        <h1 className="dos-text-h1 tracking-tighter">
                            {EXECUTIVE_COMMAND_CENTER_THEME.title}
                        </h1>
                    </div>
                    {/* Enterprise Pulse HUD */}
                    <div className="flex gap-2">
                        {getEnterprisePulse(snapshot).map((item) => (
                            <IntelligentContainer 
                                key={item.label}
                                material="active"
                                agentType={item.status === "healthy" ? "success" : item.status === "active" ? "processing" : item.status === "warning" ? "warning" : "critical"}
                                className="flex items-center gap-3 px-4 py-2 border border-[var(--dos-border-subtle)]"
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="dos-text-caption">{item.label}</span>
                                <span className="font-semibold">{item.value}</span>
                            </IntelligentContainer>
                        ))}
                    </div>
                </div>
            </header>

            <UnifiedKpiStrip kpis={snapshot.kpis} />
            
            <section className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ExecutiveBriefCard brief={snapshot.brief} />
                </div>
                <QuickActionsPanel actions={snapshot.widgets.quickActions} />
            </section>

            <ExecutiveChartsPanel charts={snapshot.widgets.charts} />
            
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CustomerSuccessExecutiveWidgetsPanel widgets={snapshot.widgets.customerSuccess} />
                <FinanceExecutiveWidgetsPanel widgets={snapshot.widgets.finance} />
                <ExecutiveHrWidgetsPanel widgets={snapshot.widgets.hrms} />
                <ExecutiveSecurityWidgetsPanel widgets={snapshot.widgets.security} />
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
                <AiExecutiveInsightsPanel insights={snapshot.widgets.insights} />
                <RecentActivityTimeline items={snapshot.widgets.activityTimeline} />
            </div>

            <section>
                <h2 className="mb-6 dos-text-h2">
                    Executive AI Modules
                </h2>
                <IntelligenceModuleGrid modules={snapshot.modules} />
            </section>

            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                <IntelligenceEnginesPanel
                    attention={snapshot.attentionToday}
                    risks={snapshot.risks}
                    opportunities={snapshot.opportunities}
                    recommendations={snapshot.recommendations}
                />
                <div className="space-y-8">
                    <RecentNotificationsPanel notifications={snapshot.notifications} />
                    <ExecutiveFeed items={snapshot.feed} />
                </div>
            </div>
        </PageTransition>
    );
}
