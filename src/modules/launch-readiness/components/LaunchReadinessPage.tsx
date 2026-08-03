"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    LaunchReadinessOverviewPanel,
    ReadinessHubsPanel,
    EnvironmentValidationsPanel,
    ConfigurationValidationsPanel,
    SecretsValidationsPanel,
    DeploymentPlansPanel,
    RollbackPlansPanel,
    VersionRegistrysPanel,
    ReleaseNotesPanel,
    BackupPolicysPanel,
    BackupVerificationsPanel,
    RestoreVerificationsPanel,
    RecoveryDrillsPanel,
    ObservabilityLogsPanel,
    ObservabilityMetricsPanel,
    TraceRecordsPanel,
    SlaMonitorsPanel,
    SecurityChecklistsPanel,
    VulnerabilityReviewsPanel,
    PermissionAuditsPanel,
    ComplianceReviewsPanel,
    AdminGuidesPanel,
    UserGuidesPanel,
    DeploymentGuidesPanel,
    LaunchScoreMetricsPanel,
    ReadinessValidationsPanel,
    LaunchBlockersPanel,
    ScoreSnapshotsPanel,
    LaunchHealthsPanel,
    CriticalIssuesPanel,
    ReadinessWarningsPanel,
    LaunchFailuresPanel,
    LaunchReadinessAuditLogsPanel,
    LaunchReadinessSdkPanel,
} from "@/src/modules/launch-readiness/components/LaunchReadinessPanels";
import { LaunchReadinessStats } from "@/src/modules/launch-readiness/components/LaunchReadinessStats";
import { ELR_TABS } from "@/src/modules/launch-readiness/constants";
import { useLaunchReadiness } from "@/src/modules/launch-readiness/hooks/useLaunchReadiness";

const tabs = [
    { id: ELR_TABS.overview, label: "Overview" },
    { id: ELR_TABS.readinessHubs, label: "Readiness Hubs" },
    { id: ELR_TABS.environmentValidations, label: "Environment Validations" },
    { id: ELR_TABS.configurationValidations, label: "Configuration Validations" },
    { id: ELR_TABS.secretsValidations, label: "Secrets Validations" },
    { id: ELR_TABS.deploymentPlans, label: "Deployment Plans" },
    { id: ELR_TABS.rollbackPlans, label: "Rollback Plans" },
    { id: ELR_TABS.versionRegistry, label: "Version Registry" },
    { id: ELR_TABS.releaseNotes, label: "Release Notes" },
    { id: ELR_TABS.backupPolicies, label: "Backup Policies" },
    { id: ELR_TABS.backupVerifications, label: "Backup Verifications" },
    { id: ELR_TABS.restoreVerifications, label: "Restore Verifications" },
    { id: ELR_TABS.recoveryDrills, label: "Recovery Drills" },
    { id: ELR_TABS.observabilityLogs, label: "Observability Logs" },
    { id: ELR_TABS.observabilityMetrics, label: "Observability Metrics" },
    { id: ELR_TABS.traceRecords, label: "Trace Records" },
    { id: ELR_TABS.slaMonitors, label: "Sla Monitors" },
    { id: ELR_TABS.securityChecklists, label: "Security Checklists" },
    { id: ELR_TABS.vulnerabilityReviews, label: "Vulnerability Reviews" },
    { id: ELR_TABS.permissionAudits, label: "Permission Audits" },
    { id: ELR_TABS.complianceReviews, label: "Compliance Reviews" },
    { id: ELR_TABS.adminGuides, label: "Admin Guides" },
    { id: ELR_TABS.userGuides, label: "User Guides" },
    { id: ELR_TABS.deploymentGuides, label: "Deployment Guides" },
    { id: ELR_TABS.launchScoreMetrics, label: "Launch Score Metrics" },
    { id: ELR_TABS.readinessValidations, label: "Readiness Validations" },
    { id: ELR_TABS.launchBlockers, label: "Launch Blockers" },
    { id: ELR_TABS.scoreSnapshots, label: "Score Snapshots" },
    { id: ELR_TABS.launchHealth, label: "Launch Health" },
    { id: ELR_TABS.criticalIssues, label: "Critical Issues" },
    { id: ELR_TABS.readinessWarnings, label: "Readiness Warnings" },
    { id: ELR_TABS.launchFailures, label: "Launch Failures" },
    { id: ELR_TABS.auditLogs, label: "Audit Logs" },
    { id: ELR_TABS.api, label: "SDK" },
] as const;

export function LaunchReadinessPage() {
    const launchReadiness = useLaunchReadiness();
    const [activeTab, setActiveTab] = useState<(typeof ELR_TABS)[keyof typeof ELR_TABS]>(ELR_TABS.overview);

    if (launchReadiness.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Launch Readiness" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">V2 Program A Sprint 9</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Launch Readiness</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: deployment plans, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and launch readiness dashboard with security-first audit and the shared Launch Readiness SDK.
                </p>
            </motion.header>
            <LaunchReadinessStats stats={launchReadiness.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-rose-600 text-white" : "border border-slate-200 text-slate-600 hover:border-rose-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === ELR_TABS.overview ? <LaunchReadinessOverviewPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.readinessHubs ? <ReadinessHubsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.environmentValidations ? <EnvironmentValidationsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.configurationValidations ? <ConfigurationValidationsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.secretsValidations ? <SecretsValidationsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.deploymentPlans ? <DeploymentPlansPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.rollbackPlans ? <RollbackPlansPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.versionRegistry ? <VersionRegistrysPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.releaseNotes ? <ReleaseNotesPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.backupPolicies ? <BackupPolicysPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.backupVerifications ? <BackupVerificationsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.restoreVerifications ? <RestoreVerificationsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.recoveryDrills ? <RecoveryDrillsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.observabilityLogs ? <ObservabilityLogsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.observabilityMetrics ? <ObservabilityMetricsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.traceRecords ? <TraceRecordsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.slaMonitors ? <SlaMonitorsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.securityChecklists ? <SecurityChecklistsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.vulnerabilityReviews ? <VulnerabilityReviewsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.permissionAudits ? <PermissionAuditsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.complianceReviews ? <ComplianceReviewsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.adminGuides ? <AdminGuidesPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.userGuides ? <UserGuidesPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.deploymentGuides ? <DeploymentGuidesPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.launchScoreMetrics ? <LaunchScoreMetricsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.readinessValidations ? <ReadinessValidationsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.launchBlockers ? <LaunchBlockersPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.scoreSnapshots ? <ScoreSnapshotsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.launchHealth ? <LaunchHealthsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.criticalIssues ? <CriticalIssuesPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.readinessWarnings ? <ReadinessWarningsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.launchFailures ? <LaunchFailuresPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.auditLogs ? <LaunchReadinessAuditLogsPanel data={launchReadiness} /> : null}
            {activeTab === ELR_TABS.api ? <LaunchReadinessSdkPanel data={launchReadiness} /> : null}
        </div>
    );
}
