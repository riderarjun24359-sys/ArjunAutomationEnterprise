"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
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
    { id: CRM_ENTERPRISE_TABS.leads, label: "Lead Pipeline" },
    { id: CRM_ENTERPRISE_TABS.profile, label: "Client Profile" },
    { id: CRM_ENTERPRISE_TABS.ai, label: "AI Agent" },
    { id: CRM_ENTERPRISE_TABS.communications, label: "Communications" },
    { id: CRM_ENTERPRISE_TABS.analytics, label: "Analytics" },
];

function CrmSkeleton() {
    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <div className="space-y-4">
                <SkeletonLoader className="h-6 w-40" />
                <SkeletonLoader className="h-12 w-96" />
                <SkeletonLoader className="h-5 w-full max-w-2xl" />
            </div>
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
            <PageTransition className="mx-auto max-w-[85rem]">
                <div className="os-panel p-12 text-center">
                    <h2 className="dos-text-h2 text-[var(--dos-error)]">Unable to load CRM</h2>
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
                    <p className="mt-2 text-[var(--dos-text-secondary)]">Please sign in to access the enterprise CRM platform.</p>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">{CRM_THEME.badge}</Badge>
                <div>
                    <h1 className="dos-text-display">
                        {CRM_THEME.title}
                    </h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        {CRM_THEME.subtitle}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 dos-text-caption text-[var(--dos-text-tertiary)]">
                    <span>{snapshot.stats.totalClients} Clients</span>
                    <span>•</span>
                    <span>{snapshot.stats.totalLeads} Leads</span>
                    <span>•</span>
                    <span>Conversion Rate: <span className="text-[var(--dos-brand-primary)]">{snapshot.stats.conversionRate}%</span></span>
                </div>
            </header>

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                            tab === t.id
                                ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]"
                                : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
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
                    <p className="text-center dos-text-secondary">Pick a client from the Directory to load their profile workspace.</p>
                ) : null}
            </section>
        </PageTransition>
    );
}
