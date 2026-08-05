"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Tabs } from "@/src/design-os/components/Tabs";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { PRODUCTION_READINESS_TABS, PRODUCTION_READINESS_TAB_LIST, PRODUCTION_READINESS_THEME } from "../constants";
import { useProductionReadiness } from "../hooks/useProductionReadiness";
import {
    BackupRecoveryPanel,
    CtoAuditDashboardPanel,
    ObservabilityPanel,
    OperationsPlaybookPanel,
    ProductionQualityPanel,
    ResiliencePanel,
    ScalabilityPanel,
    SecurityHardeningPanel,
} from "./panels/ProductionReadinessPanels";

export function ProductionReadinessPage() {
    const [activeTab, setActiveTab] = useState<string>(PRODUCTION_READINESS_TABS.ctoAudit);
    const data = useProductionReadiness();
    const audit = data.snapshot?.ctoAudit;

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">{PRODUCTION_READINESS_THEME.badge}</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">Production Readiness</h1>
                <p className={`mt-2 max-w-3xl ${PRODUCTION_READINESS_THEME.text}`}>
                    Enterprise-grade reliability, resilience, security, observability, and operational excellence. No new business features — production hardening only.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Overall readiness</p><p className="mt-1 text-2xl font-bold">{audit?.overallScore ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Risk score</p><p className="mt-1 text-2xl font-bold">{audit?.riskScore ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">System alerts</p><p className="mt-1 text-2xl font-bold">{audit?.systemAlerts.length ?? 0}</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Status</p><p className="mt-1 text-2xl font-bold capitalize">{audit?.status ?? "—"}</p></Card></StaggerRevealItem>
            </StaggerReveal>

            <Tabs tabs={PRODUCTION_READINESS_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))} active={activeTab} onChange={setActiveTab} />

            {data.loading ? (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Loading production readiness...</p></Card>
            ) : (
                <>
                    {activeTab === PRODUCTION_READINESS_TABS.ctoAudit && <CtoAuditDashboardPanel data={data} />}
                    {activeTab === PRODUCTION_READINESS_TABS.observability && <ObservabilityPanel data={data} />}
                    {activeTab === PRODUCTION_READINESS_TABS.resilience && <ResiliencePanel data={data} />}
                    {activeTab === PRODUCTION_READINESS_TABS.backupRecovery && <BackupRecoveryPanel data={data} />}
                    {activeTab === PRODUCTION_READINESS_TABS.security && <SecurityHardeningPanel data={data} />}
                    {activeTab === PRODUCTION_READINESS_TABS.scalability && <ScalabilityPanel data={data} />}
                    {activeTab === PRODUCTION_READINESS_TABS.operationsPlaybook && <OperationsPlaybookPanel />}
                    {activeTab === PRODUCTION_READINESS_TABS.productionQuality && <ProductionQualityPanel data={data} />}
                </>
            )}
        </PageTransition>
    );
}
