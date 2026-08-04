"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    OperatedHubsPanel,
    SignupFlowsPanel,
    OrgProvisioningsPanel,
    DomainOnboardingsPanel,
    EmailVerificationsPanel,
    OnboardingWizardsPanel,
    ProductionProfilesPanel,
    DeploymentJobsPanel,
    HealthValidationsPanel,
    RollbackAutomationsPanel,
    DeploymentAuditsPanel,
    CentralLogsPanel,
    MetricsCollectorsPanel,
    DistributedTracesPanel,
    AlertRulesPanel,
    IncidentTimelinesPanel,
    BackupSchedulersPanel,
    RestoreValidationsPanel,
    MaintenanceModesPanel,
    FeatureFlagOpsPanel,
    PlatformDiagnosticsPanel,
    BetaOrganizationsPanel,
    BetaInvitationsPanel,
    FeedbackCollectionsPanel,
    FeatureRequestsPanel,
    BugReportsPanel,
    ReleaseChannelsPanel,
    OperatedMetricsPanel,
    OperatedHealthsPanel,
    ExecutiveBriefingsPanel,
    PlatformFailuresPanel,
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/customer-operated-platform/components/CustomerOperatedPlatformPanels";
import { CustomerOperatedPlatformStats } from "@/src/modules/customer-operated-platform/components/CustomerOperatedPlatformStats";
import { COP_TABS } from "@/src/modules/customer-operated-platform/constants";
import { useCustomerOperatedPlatform } from "@/src/modules/customer-operated-platform/hooks/useCustomerOperatedPlatform";

const tabs = [
    { id: COP_TABS.overview, label: "Overview" },
    { id: COP_TABS.operatedHubs, label: "Operated Hubs" },
    { id: COP_TABS.signupFlows, label: "Signup Flows" },
    { id: COP_TABS.orgProvisioning, label: "Org Provisioning" },
    { id: COP_TABS.domainOnboarding, label: "Domain Onboarding" },
    { id: COP_TABS.emailVerifications, label: "Email Verifications" },
    { id: COP_TABS.onboardingWizards, label: "Onboarding Wizards" },
    { id: COP_TABS.productionProfiles, label: "Production Profiles" },
    { id: COP_TABS.deploymentJobs, label: "Deployment Jobs" },
    { id: COP_TABS.healthValidations, label: "Health Validations" },
    { id: COP_TABS.rollbackAutomations, label: "Rollback Automations" },
    { id: COP_TABS.deploymentAudits, label: "Deployment Audits" },
    { id: COP_TABS.centralLogs, label: "Central Logs" },
    { id: COP_TABS.metricsCollectors, label: "Metrics Collectors" },
    { id: COP_TABS.distributedTraces, label: "Distributed Traces" },
    { id: COP_TABS.alertRules, label: "Alert Rules" },
    { id: COP_TABS.incidentTimelines, label: "Incident Timelines" },
    { id: COP_TABS.backupSchedulers, label: "Backup Schedulers" },
    { id: COP_TABS.restoreValidations, label: "Restore Validations" },
    { id: COP_TABS.maintenanceModes, label: "Maintenance Modes" },
    { id: COP_TABS.featureFlagOps, label: "Feature Flag Ops" },
    { id: COP_TABS.platformDiagnostics, label: "Platform Diagnostics" },
    { id: COP_TABS.betaOrganizations, label: "Beta Organizations" },
    { id: COP_TABS.betaInvitations, label: "Beta Invitations" },
    { id: COP_TABS.feedbackCollection, label: "Feedback Collection" },
    { id: COP_TABS.featureRequests, label: "Feature Requests" },
    { id: COP_TABS.bugReports, label: "Bug Reports" },
    { id: COP_TABS.releaseChannels, label: "Release Channels" },
    { id: COP_TABS.operatedMetrics, label: "Operated Metrics" },
    { id: COP_TABS.operatedHealth, label: "Operated Health" },
    { id: COP_TABS.executiveBriefings, label: "Executive Briefings" },
    { id: COP_TABS.platformFailures, label: "Platform Failures" },
    { id: COP_TABS.auditLogs, label: "Audit Logs" },
    { id: COP_TABS.api, label: "SDK" },
] as const;

export function CustomerOperatedPlatformPage() {
    const retail = useCustomerOperatedPlatform();
    const [activeTab, setActiveTab] = useState<(typeof COP_TABS)[keyof typeof COP_TABS]>(COP_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Customer Operated Platform" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-violet-900 dark:text-violet-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-violet-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">V2 Program A Launch Ready to Customer Operated</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Customer Operated Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-violet-500 dark:text-violet-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Customer Operated Platform SDK.
                </p>
            </motion.header>
            <CustomerOperatedPlatformStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-violet-600 hover:border-violet-300 dark:border-slate-800 dark:text-violet-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === COP_TABS.overview ? <RetailOverviewPanel data={retail} /> : null}
            {activeTab === COP_TABS.operatedHubs ? <OperatedHubsPanel data={retail} /> : null}
            {activeTab === COP_TABS.signupFlows ? <SignupFlowsPanel data={retail} /> : null}
            {activeTab === COP_TABS.orgProvisioning ? <OrgProvisioningsPanel data={retail} /> : null}
            {activeTab === COP_TABS.domainOnboarding ? <DomainOnboardingsPanel data={retail} /> : null}
            {activeTab === COP_TABS.emailVerifications ? <EmailVerificationsPanel data={retail} /> : null}
            {activeTab === COP_TABS.onboardingWizards ? <OnboardingWizardsPanel data={retail} /> : null}
            {activeTab === COP_TABS.productionProfiles ? <ProductionProfilesPanel data={retail} /> : null}
            {activeTab === COP_TABS.deploymentJobs ? <DeploymentJobsPanel data={retail} /> : null}
            {activeTab === COP_TABS.healthValidations ? <HealthValidationsPanel data={retail} /> : null}
            {activeTab === COP_TABS.rollbackAutomations ? <RollbackAutomationsPanel data={retail} /> : null}
            {activeTab === COP_TABS.deploymentAudits ? <DeploymentAuditsPanel data={retail} /> : null}
            {activeTab === COP_TABS.centralLogs ? <CentralLogsPanel data={retail} /> : null}
            {activeTab === COP_TABS.metricsCollectors ? <MetricsCollectorsPanel data={retail} /> : null}
            {activeTab === COP_TABS.distributedTraces ? <DistributedTracesPanel data={retail} /> : null}
            {activeTab === COP_TABS.alertRules ? <AlertRulesPanel data={retail} /> : null}
            {activeTab === COP_TABS.incidentTimelines ? <IncidentTimelinesPanel data={retail} /> : null}
            {activeTab === COP_TABS.backupSchedulers ? <BackupSchedulersPanel data={retail} /> : null}
            {activeTab === COP_TABS.restoreValidations ? <RestoreValidationsPanel data={retail} /> : null}
            {activeTab === COP_TABS.maintenanceModes ? <MaintenanceModesPanel data={retail} /> : null}
            {activeTab === COP_TABS.featureFlagOps ? <FeatureFlagOpsPanel data={retail} /> : null}
            {activeTab === COP_TABS.platformDiagnostics ? <PlatformDiagnosticsPanel data={retail} /> : null}
            {activeTab === COP_TABS.betaOrganizations ? <BetaOrganizationsPanel data={retail} /> : null}
            {activeTab === COP_TABS.betaInvitations ? <BetaInvitationsPanel data={retail} /> : null}
            {activeTab === COP_TABS.feedbackCollection ? <FeedbackCollectionsPanel data={retail} /> : null}
            {activeTab === COP_TABS.featureRequests ? <FeatureRequestsPanel data={retail} /> : null}
            {activeTab === COP_TABS.bugReports ? <BugReportsPanel data={retail} /> : null}
            {activeTab === COP_TABS.releaseChannels ? <ReleaseChannelsPanel data={retail} /> : null}
            {activeTab === COP_TABS.operatedMetrics ? <OperatedMetricsPanel data={retail} /> : null}
            {activeTab === COP_TABS.operatedHealth ? <OperatedHealthsPanel data={retail} /> : null}
            {activeTab === COP_TABS.executiveBriefings ? <ExecutiveBriefingsPanel data={retail} /> : null}
            {activeTab === COP_TABS.platformFailures ? <PlatformFailuresPanel data={retail} /> : null}
            {activeTab === COP_TABS.auditLogs ? <RetailAuditLogsPanel data={retail} /> : null}
            {activeTab === COP_TABS.api ? <RetailSdkPanel data={retail} /> : null}
        </div>
    );
}
