"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Tabs } from "@/src/design-os/components/Tabs";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import {
    BUSINESS_PLATFORM_TABS,
    BUSINESS_PLATFORM_TAB_LIST,
    BUSINESS_PLATFORM_THEME,
} from "../constants";
import { useBusinessPlatform } from "../hooks/useBusinessPlatform";
import { LifecyclePipeline } from "./LifecyclePipeline";
import { LeadManagementPanel } from "./panels/LeadManagementPanel";
import { ConsultationPanel } from "./panels/ConsultationPanel";
import { ProposalsPanel } from "./panels/ProposalsPanel";
import { ClientPortalPanel } from "./panels/ClientPortalPanel";
import { ProjectManagementPanel } from "./panels/ProjectManagementPanel";
import { TeamPanel } from "./panels/TeamPanel";
import { FinancePanel } from "./panels/FinancePanel";
import { AnalyticsPanel } from "./panels/AnalyticsPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { AiOpsPanel } from "./panels/AiOpsPanel";

export function BusinessPlatformPage() {
    const [activeTab, setActiveTab] = useState<string>(BUSINESS_PLATFORM_TABS.leads);
    const data = useBusinessPlatform();

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">{BUSINESS_PLATFORM_THEME.badge}</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">
                    Business Operating Platform
                </h1>
                <p className={`mt-2 max-w-3xl ${BUSINESS_PLATFORM_THEME.text}`}>
                    One unified platform managing the entire client lifecycle — from lead capture through delivery, support, renewal, and referral.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">Leads</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.leadsCount ?? 0}</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">Consultations</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.consultationsScheduled ?? 0}</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">Active clients</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.activeClients ?? 0}</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">AI recommendations</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.pendingAiRecommendations ?? 0}</p>
                    </Card>
                </StaggerRevealItem>
            </StaggerReveal>

            <Card>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-600">Client lifecycle</h2>
                <div className="mt-4">
                    <LifecyclePipeline dashboard={data.dashboard} />
                </div>
            </Card>

            <Tabs
                tabs={BUSINESS_PLATFORM_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))}
                active={activeTab}
                onChange={setActiveTab}
            />

            {data.loading ? (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Loading business platform...</p></Card>
            ) : (
                <>
                    {activeTab === BUSINESS_PLATFORM_TABS.leads && <LeadManagementPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.consultation && <ConsultationPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.proposals && <ProposalsPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.clientPortal && <ClientPortalPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.projects && <ProjectManagementPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.team && <TeamPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.finance && <FinancePanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.analytics && <AnalyticsPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.settings && <SettingsPanel data={data} />}
                    {activeTab === BUSINESS_PLATFORM_TABS.aiOps && <AiOpsPanel data={data} />}
                </>
            )}
        </PageTransition>
    );
}
