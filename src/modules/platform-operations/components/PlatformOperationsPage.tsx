"use client";

import { useState } from "react";
import { Tabs } from "@/src/design-os/components/Tabs";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import {
    PLATFORM_OPERATIONS_TABS,
    PLATFORM_OPERATIONS_TAB_LIST,
    PLATFORM_OPERATIONS_THEME,
} from "../constants";
import { PlatformHealthCenterPanel } from "./panels/PlatformHealthCenterPanel";
import { ObservabilityCenterPanel } from "./panels/ObservabilityCenterPanel";
import { ErrorManagementPanel } from "./panels/ErrorManagementPanel";
import { QueueJobEnginePanel } from "./panels/QueueJobEnginePanel";
import { RetryEnginePanel } from "./panels/RetryEnginePanel";
import { BackupCenterPanel } from "./panels/BackupCenterPanel";
import { DisasterRecoveryPanel } from "./panels/DisasterRecoveryPanel";
import { PerformanceCenterPanel } from "./panels/PerformanceCenterPanel";
import { ServiceStatusPanel } from "./panels/ServiceStatusPanel";
import { OperationsDashboardPanel } from "./panels/OperationsDashboardPanel";
import { usePlatformOperations } from "../hooks/usePlatformOperations";

export function PlatformOperationsPage() {
    const [activeTab, setActiveTab] = useState<string>(PLATFORM_OPERATIONS_TABS.dashboard);
    const { state, loading } = usePlatformOperations();

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">V9 Platform Reliability & Operations</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">
                    Platform Operations
                </h1>
                <p className="mt-2 max-w-3xl text-[var(--dos-text-secondary)]">
                    Self-monitoring production platform integrated through Mission Core — health, observability, errors, queues, retries, backups, disaster recovery, performance, and service status.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-3">
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Reliability</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                            {loading ? "—" : `${state.dashboard.reliabilityScore}%`}
                        </p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Health</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                            {loading ? "—" : `${state.healthScore.score}%`}
                        </p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Panels</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">10</p>
                    </Card>
                </StaggerRevealItem>
            </StaggerReveal>

            <Tabs
                tabs={PLATFORM_OPERATIONS_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === PLATFORM_OPERATIONS_TABS.health && <PlatformHealthCenterPanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.observability && <ObservabilityCenterPanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.errors && <ErrorManagementPanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.queues && <QueueJobEnginePanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.retry && <RetryEnginePanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.backup && <BackupCenterPanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.disasterRecovery && <DisasterRecoveryPanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.performance && <PerformanceCenterPanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.serviceStatus && <ServiceStatusPanel />}
            {activeTab === PLATFORM_OPERATIONS_TABS.dashboard && <OperationsDashboardPanel />}
        </PageTransition>
    );
}
