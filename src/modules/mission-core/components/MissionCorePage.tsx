"use client";

import { useState } from "react";
import { Tabs } from "@/src/design-os/components/Tabs";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { MISSION_CORE_TABS, MISSION_CORE_TAB_LIST } from "../constants";
import { useMissionCore } from "../hooks/useMissionCore";
import { CapabilityRegistryPanel } from "./panels/CapabilityRegistryPanel";
import { WorkflowEnginePanel } from "./panels/WorkflowEnginePanel";
import { EventBusPanel } from "./panels/EventBusPanel";
import { AiDecisionEnginePanel } from "./panels/AiDecisionEnginePanel";
import { SharedServiceRegistryPanel } from "./panels/SharedServiceRegistryPanel";
import { HealthDashboardPanel } from "./panels/HealthDashboardPanel";
import { WorkflowMonitorPanel } from "./panels/WorkflowMonitorPanel";
import { DeveloperConsolePanel } from "./panels/DeveloperConsolePanel";

export function MissionCorePage() {
    const [activeTab, setActiveTab] = useState<string>(MISSION_CORE_TABS.capabilities);
    const { capabilities, services, events, workflows, health, loading } = useMissionCore();

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">V7 Mission Core</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">
                    Mission Core — Central Orchestration Layer
                </h1>
                <p className="mt-2 max-w-3xl text-[var(--dos-text-secondary)]">
                    Central orchestration for the Arjun Automation Platform. All capability communication routes through Mission Core — no direct capability-to-capability calls.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-4">
                <StaggerRevealItem>
                    <KpiCard title="Capabilities" value={capabilities.length} trend="up" trendLabel="Registered" />
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <KpiCard title="Shared Services" value={services.length} trend="up" trendLabel="Available" />
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <KpiCard title="Events" value={events.length} trend="up" trendLabel="Logged" />
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <KpiCard title="Workflows" value={workflows.length} trend="up" trendLabel={health?.overall ?? "—"} />
                </StaggerRevealItem>
            </StaggerReveal>

            {!loading && health && (
                <Card>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[var(--dos-text-secondary)]">Platform Health</span>
                        <Badge variant={health.overall === "healthy" ? "success" : health.overall === "degraded" ? "warning" : "error"}>
                            {health.overall}
                        </Badge>
                    </div>
                </Card>
            )}

            <Tabs
                tabs={MISSION_CORE_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))}
                active={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6">
                {activeTab === MISSION_CORE_TABS.capabilities && <CapabilityRegistryPanel />}
                {activeTab === MISSION_CORE_TABS.workflows && <WorkflowEnginePanel />}
                {activeTab === MISSION_CORE_TABS.events && <EventBusPanel />}
                {activeTab === MISSION_CORE_TABS.aiDecisions && <AiDecisionEnginePanel />}
                {activeTab === MISSION_CORE_TABS.sharedServices && <SharedServiceRegistryPanel />}
                {activeTab === MISSION_CORE_TABS.health && <HealthDashboardPanel />}
                {activeTab === MISSION_CORE_TABS.monitor && <WorkflowMonitorPanel />}
                {activeTab === MISSION_CORE_TABS.developer && <DeveloperConsolePanel />}
            </div>
        </PageTransition>
    );
}
