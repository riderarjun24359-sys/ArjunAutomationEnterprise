"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    LaunchHubsPanel,
    OrganizationProvisionsPanel,
    TenantProvisionsPanel,
    IndustryPackAssignmentsPanel,
    ModuleLicensesPanel,
    WizardProfilesPanel,
    WizardBrandingsPanel,
    WizardDepartmentsPanel,
    WizardSettingsPanel,
    ImportJobsPanel,
    ImportValidationsPanel,
    ImportPreviewsPanel,
    ImportHistorysPanel,
    GoLiveChecklistsPanel,
    GoLiveScoresPanel,
    DeploymentStatussPanel,
    ReadinessValidationsPanel,
    CustomerHealthScoresPanel,
    PlatformAdoptionsPanel,
    FeatureUsagesPanel,
    RenewalTrackingsPanel,
    SupportTicketsPanel,
    KnowledgeBaseArticlesPanel,
    IncidentTrackingsPanel,
    CustomerRegistrysPanel,
    SubscriptionRecordsPanel,
    LicenseManagementsPanel,
    LaunchMetricsPanel,
    LaunchHealthsPanel,
    MissionControlKpisPanel,
    LaunchFailuresPanel,
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/launch-foundation/components/LaunchFoundationPanels";
import { LaunchFoundationStats } from "@/src/modules/launch-foundation/components/LaunchFoundationStats";
import { ELF_TABS } from "@/src/modules/launch-foundation/constants";
import { useLaunchFoundation } from "@/src/modules/launch-foundation/hooks/useLaunchFoundation";

const tabs = [
    { id: ELF_TABS.overview, label: "Overview" },
    { id: ELF_TABS.launchHubs, label: "Launch Hubs" },
    { id: ELF_TABS.organizationProvisions, label: "Organization Provisions" },
    { id: ELF_TABS.tenantProvisions, label: "Tenant Provisions" },
    { id: ELF_TABS.industryPackAssignments, label: "Industry Pack Assignments" },
    { id: ELF_TABS.moduleLicenses, label: "Module Licenses" },
    { id: ELF_TABS.wizardProfiles, label: "Wizard Profiles" },
    { id: ELF_TABS.wizardBranding, label: "Wizard Branding" },
    { id: ELF_TABS.wizardDepartments, label: "Wizard Departments" },
    { id: ELF_TABS.wizardSettings, label: "Wizard Settings" },
    { id: ELF_TABS.importJobs, label: "Import Jobs" },
    { id: ELF_TABS.importValidations, label: "Import Validations" },
    { id: ELF_TABS.importPreviews, label: "Import Previews" },
    { id: ELF_TABS.importHistory, label: "Import History" },
    { id: ELF_TABS.goLiveChecklists, label: "Go Live Checklists" },
    { id: ELF_TABS.goLiveScores, label: "Go Live Scores" },
    { id: ELF_TABS.deploymentStatuses, label: "Deployment Statuses" },
    { id: ELF_TABS.readinessValidations, label: "Readiness Validations" },
    { id: ELF_TABS.customerHealthScores, label: "Customer Health Scores" },
    { id: ELF_TABS.platformAdoption, label: "Platform Adoption" },
    { id: ELF_TABS.featureUsage, label: "Feature Usage" },
    { id: ELF_TABS.renewalTracking, label: "Renewal Tracking" },
    { id: ELF_TABS.supportTickets, label: "Support Tickets" },
    { id: ELF_TABS.knowledgeBaseArticles, label: "Knowledge Base Articles" },
    { id: ELF_TABS.incidentTracking, label: "Incident Tracking" },
    { id: ELF_TABS.customerRegistry, label: "Customer Registry" },
    { id: ELF_TABS.subscriptionRecords, label: "Subscription Records" },
    { id: ELF_TABS.licenseManagement, label: "License Management" },
    { id: ELF_TABS.launchMetrics, label: "Launch Metrics" },
    { id: ELF_TABS.launchHealth, label: "Launch Health" },
    { id: ELF_TABS.missionControlKpis, label: "Mission Control Kpis" },
    { id: ELF_TABS.launchFailures, label: "Launch Failures" },
    { id: ELF_TABS.auditLogs, label: "Audit Logs" },
    { id: ELF_TABS.api, label: "SDK" },
] as const;

export function LaunchFoundationPage() {
    const retail = useLaunchFoundation();
    const [activeTab, setActiveTab] = useState<(typeof ELF_TABS)[keyof typeof ELF_TABS]>(ELF_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Launch Foundation" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-600">V2 Program A Program C Sprint 4</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Launch Foundation</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Launch Foundation SDK.
                </p>
            </motion.header>
            <LaunchFoundationStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-600 text-white" : "border border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === ELF_TABS.overview ? <RetailOverviewPanel data={retail} /> : null}
            {activeTab === ELF_TABS.launchHubs ? <LaunchHubsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.organizationProvisions ? <OrganizationProvisionsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.tenantProvisions ? <TenantProvisionsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.industryPackAssignments ? <IndustryPackAssignmentsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.moduleLicenses ? <ModuleLicensesPanel data={retail} /> : null}
            {activeTab === ELF_TABS.wizardProfiles ? <WizardProfilesPanel data={retail} /> : null}
            {activeTab === ELF_TABS.wizardBranding ? <WizardBrandingsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.wizardDepartments ? <WizardDepartmentsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.wizardSettings ? <WizardSettingsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.importJobs ? <ImportJobsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.importValidations ? <ImportValidationsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.importPreviews ? <ImportPreviewsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.importHistory ? <ImportHistorysPanel data={retail} /> : null}
            {activeTab === ELF_TABS.goLiveChecklists ? <GoLiveChecklistsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.goLiveScores ? <GoLiveScoresPanel data={retail} /> : null}
            {activeTab === ELF_TABS.deploymentStatuses ? <DeploymentStatussPanel data={retail} /> : null}
            {activeTab === ELF_TABS.readinessValidations ? <ReadinessValidationsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.customerHealthScores ? <CustomerHealthScoresPanel data={retail} /> : null}
            {activeTab === ELF_TABS.platformAdoption ? <PlatformAdoptionsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.featureUsage ? <FeatureUsagesPanel data={retail} /> : null}
            {activeTab === ELF_TABS.renewalTracking ? <RenewalTrackingsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.supportTickets ? <SupportTicketsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.knowledgeBaseArticles ? <KnowledgeBaseArticlesPanel data={retail} /> : null}
            {activeTab === ELF_TABS.incidentTracking ? <IncidentTrackingsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.customerRegistry ? <CustomerRegistrysPanel data={retail} /> : null}
            {activeTab === ELF_TABS.subscriptionRecords ? <SubscriptionRecordsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.licenseManagement ? <LicenseManagementsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.launchMetrics ? <LaunchMetricsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.launchHealth ? <LaunchHealthsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.missionControlKpis ? <MissionControlKpisPanel data={retail} /> : null}
            {activeTab === ELF_TABS.launchFailures ? <LaunchFailuresPanel data={retail} /> : null}
            {activeTab === ELF_TABS.auditLogs ? <RetailAuditLogsPanel data={retail} /> : null}
            {activeTab === ELF_TABS.api ? <RetailSdkPanel data={retail} /> : null}
        </div>
    );
}
