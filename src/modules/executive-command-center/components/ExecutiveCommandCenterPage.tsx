"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { EXECUTIVE_COMMAND_CENTER_THEME } from "../constants";
import { useExecutiveCommandCenter } from "../hooks/useExecutiveCommandCenter";
import { ExecutiveBriefCard } from "./ExecutiveBriefCard";
import { ExecutiveFeed } from "./ExecutiveFeed";
import { IntelligenceEnginesPanel } from "./IntelligenceEnginesPanel";
import { IntelligenceModuleGrid } from "./IntelligenceModuleGrid";
import { UnifiedKpiStrip } from "./UnifiedKpiStrip";

export function ExecutiveCommandCenterPage() {
    const { snapshot, loading } = useExecutiveCommandCenter();

    if (loading) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Loading executive intelligence...</p></Card>
            </PageTransition>
        );
    }

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Sign in to access the Executive Command Center.</p></Card>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
                <div>
                    <Badge variant="info">{EXECUTIVE_COMMAND_CENTER_THEME.badge}</Badge>
                    <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{EXECUTIVE_COMMAND_CENTER_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{EXECUTIVE_COMMAND_CENTER_THEME.subtitle}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--dos-text-tertiary)]">
                        <span>{snapshot.organizationName}</span>
                        <span>·</span>
                        <span>Data: {snapshot.source}</span>
                        <span>·</span>
                        <span>Unified score {snapshot.unifiedScore}%</span>
                    </div>
                </div>

                <UnifiedKpiStrip kpis={snapshot.kpis} />
                <ExecutiveBriefCard brief={snapshot.brief} />

                <section>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Executive AI modules</h2>
                    <IntelligenceModuleGrid modules={snapshot.modules} />
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <IntelligenceEnginesPanel
                        attention={snapshot.attentionToday}
                        risks={snapshot.risks}
                        opportunities={snapshot.opportunities}
                        recommendations={snapshot.recommendations}
                    />
                    <ExecutiveFeed items={snapshot.feed} />
                </div>
        </PageTransition>
    );
}
