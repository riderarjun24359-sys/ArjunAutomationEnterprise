"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    OperationsCenterOverviewPanel,
    OperationsCentersPanel,
    OverallHealthsPanel,
    ModuleHealthsPanel,
    DatabaseHealthsPanel,
    JobSchedulersPanel,
    RecurringJobsPanel,
    JobRetryQueuesPanel,
    JobDeadLettersPanel,
    PlatformEventsPanel,
    BusinessEventsPanel,
    EventSubscriptionsPanel,
    EventReplaysPanel,
    AlertsPanel,
    EscalationRulesPanel,
    AlertAcknowledgementsPanel,
    MaintenanceWindowsPanel,
    GlobalFlagsPanel,
    TenantFlagsPanel,
    BetaFeaturesPanel,
    RolloutConfigsPanel,
    PlatformConfigsPanel,
    TenantConfigsPanel,
    SecretsMetadatasPanel,
    ConfigVersionsPanel,
    PlatformLogsPanel,
    PlatformMetricsPanel,
    TraceSummarysPanel,
    ServiceRegistrysPanel,
    OperationsMetricsPanel,
    OperationsHealthsPanel,
    OperationsFailuresPanel,
    OperationsCenterAuditLogsPanel,
    OperationsCenterSdkPanel,
} from "@/src/modules/operations-center/components/OperationsCenterPanels";
import { OperationsCenterStats } from "@/src/modules/operations-center/components/OperationsCenterStats";
import { OperationsPulse } from "@/src/modules/operations/components/OperationsPulse";
import { OperationsExceptionField } from "@/src/modules/operations/components/OperationsExceptionField";
import { OperationsWorkQueue } from "@/src/modules/operations/components/OperationsWorkQueue";
import { useOperationsSnapshot } from "@/src/modules/operations/hooks/useOperationsSnapshot";
import { EOC_TABS } from "@/src/modules/operations-center/constants";
import { useOperationsCenter } from "@/src/modules/operations-center/hooks/useOperationsCenter";

const tabs = [
    { id: EOC_TABS.overview, label: "Overview" },
    { id: EOC_TABS.operationsCenters, label: "Operations Centers" },
    { id: EOC_TABS.overallHealth, label: "Overall Health" },
    { id: EOC_TABS.moduleHealth, label: "Module Health" },
    { id: EOC_TABS.databaseHealth, label: "Database Health" },
    { id: EOC_TABS.jobSchedulers, label: "Job Schedulers" },
    { id: EOC_TABS.recurringJobs, label: "Recurring Jobs" },
    { id: EOC_TABS.jobRetryQueue, label: "Job Retry Queue" },
    { id: EOC_TABS.jobDeadLetter, label: "Job Dead Letter" },
    { id: EOC_TABS.platformEvents, label: "Platform Events" },
    { id: EOC_TABS.businessEvents, label: "Business Events" },
    { id: EOC_TABS.eventSubscriptions, label: "Event Subscriptions" },
    { id: EOC_TABS.eventReplays, label: "Event Replays" },
    { id: EOC_TABS.alerts, label: "Alerts" },
    { id: EOC_TABS.escalationRules, label: "Escalation Rules" },
    { id: EOC_TABS.alertAcknowledgements, label: "Alert Acknowledgements" },
    { id: EOC_TABS.maintenanceWindows, label: "Maintenance Windows" },
    { id: EOC_TABS.globalFlags, label: "Global Flags" },
    { id: EOC_TABS.tenantFlags, label: "Tenant Flags" },
    { id: EOC_TABS.betaFeatures, label: "Beta Features" },
    { id: EOC_TABS.rolloutConfigs, label: "Rollout Configs" },
    { id: EOC_TABS.platformConfigs, label: "Platform Configs" },
    { id: EOC_TABS.tenantConfigs, label: "Tenant Configs" },
    { id: EOC_TABS.secretsMetadata, label: "Secrets Metadata" },
    { id: EOC_TABS.configVersions, label: "Config Versions" },
    { id: EOC_TABS.platformLogs, label: "Platform Logs" },
    { id: EOC_TABS.platformMetrics, label: "Platform Metrics" },
    { id: EOC_TABS.traceSummaries, label: "Trace Summaries" },
    { id: EOC_TABS.serviceRegistry, label: "Service Registry" },
    { id: EOC_TABS.operationsMetrics, label: "Operations Metrics" },
    { id: EOC_TABS.operationsHealth, label: "Operations Health" },
    { id: EOC_TABS.operationsFailures, label: "Operations Failures" },
    { id: EOC_TABS.auditLogs, label: "Audit Logs" },
    { id: EOC_TABS.api, label: "SDK" },
] as const;

export function OperationsCenterPage() {
    const operationsCenter = useOperationsCenter();
    const { snapshot, loading: snapshotLoading } = useOperationsSnapshot();
    const [activeTab, setActiveTab] = useState<(typeof EOC_TABS)[keyof typeof EOC_TABS]>(EOC_TABS.overview);

    if (operationsCenter.loading || snapshotLoading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Operations Center" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">V2 Program A Sprint 7</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Operations Center</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: connected services, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and operations center dashboard with security-first audit and the shared Operations Center SDK.
                </p>
            </motion.header>
            
            {snapshot && <OperationsPulse snapshot={snapshot} />}
            
            {snapshot && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <OperationsExceptionField exceptions={snapshot.exceptions} />
                    <OperationsWorkQueue workQueue={snapshot.workQueue} />
                </div>
            )}

            <OperationsCenterStats stats={operationsCenter.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === EOC_TABS.overview ? <OperationsCenterOverviewPanel data={operationsCenter} /> : null}
...
            {activeTab === EOC_TABS.operationsCenters ? <OperationsCentersPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.overallHealth ? <OverallHealthsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.moduleHealth ? <ModuleHealthsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.databaseHealth ? <DatabaseHealthsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.jobSchedulers ? <JobSchedulersPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.recurringJobs ? <RecurringJobsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.jobRetryQueue ? <JobRetryQueuesPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.jobDeadLetter ? <JobDeadLettersPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.platformEvents ? <PlatformEventsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.businessEvents ? <BusinessEventsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.eventSubscriptions ? <EventSubscriptionsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.eventReplays ? <EventReplaysPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.alerts ? <AlertsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.escalationRules ? <EscalationRulesPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.alertAcknowledgements ? <AlertAcknowledgementsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.maintenanceWindows ? <MaintenanceWindowsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.globalFlags ? <GlobalFlagsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.tenantFlags ? <TenantFlagsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.betaFeatures ? <BetaFeaturesPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.rolloutConfigs ? <RolloutConfigsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.platformConfigs ? <PlatformConfigsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.tenantConfigs ? <TenantConfigsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.secretsMetadata ? <SecretsMetadatasPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.configVersions ? <ConfigVersionsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.platformLogs ? <PlatformLogsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.platformMetrics ? <PlatformMetricsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.traceSummaries ? <TraceSummarysPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.serviceRegistry ? <ServiceRegistrysPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.operationsMetrics ? <OperationsMetricsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.operationsHealth ? <OperationsHealthsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.operationsFailures ? <OperationsFailuresPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.auditLogs ? <OperationsCenterAuditLogsPanel data={operationsCenter} /> : null}
            {activeTab === EOC_TABS.api ? <OperationsCenterSdkPanel data={operationsCenter} /> : null}
        </div>
    );
}
