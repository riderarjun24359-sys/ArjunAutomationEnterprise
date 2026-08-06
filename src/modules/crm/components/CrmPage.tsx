"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { CRM_ENTERPRISE_TABS, CRM_THEME } from "../constants";
import { useCrmPlatform } from "../hooks/useCrmPlatform";
import type { CrmEnterpriseTab, LeadPipelineStage, PipelineLead } from "../types/enterprise";
import { AiCrmAssistantPanel } from "./AiCrmAssistantPanel";
import { ClientDirectoryPanel } from "./ClientDirectoryPanel";
import { ClientProfileWorkspace } from "./ClientProfileWorkspace";
import { CommunicationCenterPanel } from "./CommunicationCenterPanel";
import { CrmAnalyticsPanel } from "./CrmAnalyticsPanel";
import { LeadKanbanBoard } from "./LeadKanbanBoard";

const TABS: Array<{ id: CrmEnterpriseTab; label: string }> = [
    { id: CRM_ENTERPRISE_TABS.directory, label: "Client Directory" },
    { id: CRM_ENTERPRISE_TABS.leads, label: "Lead Management" },
    { id: CRM_ENTERPRISE_TABS.profile, label: "Client Profile" },
    { id: CRM_ENTERPRISE_TABS.ai, label: "AI Assistant" },
    { id: CRM_ENTERPRISE_TABS.communications, label: "Communications" },
    { id: CRM_ENTERPRISE_TABS.analytics, label: "Analytics" },
];

function CrmSkeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-64" />
            <SkeletonLoader className="h-4 w-full max-w-xl" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}><SkeletonLoader className="h-16 w-full" /></Card>
                ))}
            </div>
            <Card><SkeletonLoader className="h-64 w-full" /></Card>
        </PageTransition>
    );
}

export function CrmPage() {
    const {
        snapshot,
        profile,
        directory,
        directoryQuery,
        loading,
        error,
        movingLeadId,
        selectClient,
        moveLead,
        updateDirectoryQuery,
    } = useCrmPlatform();
    const [tab, setTab] = useState<CrmEnterpriseTab>(CRM_ENTERPRISE_TABS.directory);

    const openProfile = async (clientId: string) => {
        await selectClient(clientId);
        setTab(CRM_ENTERPRISE_TABS.profile);
    };

    const handleMoveLead = (lead: PipelineLead, stage: LeadPipelineStage) => {
        void moveLead(lead.id, stage, lead.origin);
    };

    if (loading) return <CrmSkeleton />;

    if (error) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Unable to load CRM" description={error} />
            </PageTransition>
        );
    }

    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Sign in required" description="Sign in to access the enterprise CRM platform." />
            </PageTransition>
        );
    }

    const stats = [
        { label: "Clients", value: String(snapshot.stats.totalClients) },
        { label: "Leads", value: String(snapshot.stats.totalLeads) },
        { label: "Opportunities", value: String(snapshot.stats.openOpportunities) },
        { label: "Revenue", value: snapshot.stats.collectedRevenueLabel },
    ];

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <Badge variant="info">{CRM_THEME.badge}</Badge>
                <h1 className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)] sm:text-3xl">{CRM_THEME.title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{CRM_THEME.subtitle}</p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                    Data: {snapshot.source} · Conversion {snapshot.stats.conversionRate}% · Avg health {snapshot.stats.averageHealthScore || "—"}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{s.label}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{s.value}</p>
                    </Card>
                ))}
            </div>

            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                            tab === t.id
                                ? "bg-[var(--dos-brand-primary)] text-white"
                                : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-secondary)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === CRM_ENTERPRISE_TABS.directory ? (
                <ClientDirectoryPanel
                    directory={directory}
                    query={directoryQuery}
                    onQueryChange={updateDirectoryQuery}
                    onSelect={(id) => void openProfile(id)}
                />
            ) : null}

            {tab === CRM_ENTERPRISE_TABS.leads ? (
                <LeadKanbanBoard columns={snapshot.kanban} movingLeadId={movingLeadId} onMove={handleMoveLead} />
            ) : null}

            {tab === CRM_ENTERPRISE_TABS.profile ? (
                <ClientProfileWorkspace profile={profile} />
            ) : null}

            {tab === CRM_ENTERPRISE_TABS.ai ? (
                <AiCrmAssistantPanel
                    insights={snapshot.insights}
                    onOpenClient={(id) => {
                        void openProfile(id);
                    }}
                />
            ) : null}

            {tab === CRM_ENTERPRISE_TABS.communications ? (
                <CommunicationCenterPanel items={snapshot.communications} />
            ) : null}

            {tab === CRM_ENTERPRISE_TABS.analytics ? (
                <CrmAnalyticsPanel analytics={snapshot.analytics} />
            ) : null}

            {tab === CRM_ENTERPRISE_TABS.profile && !profile ? (
                <p className="text-xs text-[var(--dos-text-tertiary)]">Tip: pick a client from Directory or AI Assistant to load the profile workspace.</p>
            ) : null}
        </PageTransition>
    );
}
