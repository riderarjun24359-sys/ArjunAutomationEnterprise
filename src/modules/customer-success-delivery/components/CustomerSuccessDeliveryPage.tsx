"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    DeliveryHubsPanel,
    CustomerHealthScoresPanel,
    AdoptionAnalyticsPanel,
    SuccessPlansPanel,
    CustomerTimelinesPanel,
    RenewalForecastsPanel,
    SupportTicketsPanel,
    LiveChatSessionsPanel,
    KnowledgeBaseArticlesPanel,
    SlaPolicysPanel,
    EscalationRulesPanel,
    DeploymentAutomationsPanel,
    EnvironmentManagementsPanel,
    DeploymentTrackingsPanel,
    UpgradeManagementsPanel,
    ReleaseTrackingsPanel,
    TrainingPortalsPanel,
    VideoLibrarysPanel,
    ProductToursPanel,
    CertificationsPanel,
    ProgressTrackingsPanel,
    LearningAnalyticsPanel,
    DeliveryWorkflowsPanel,
    OnboardingAutomationsPanel,
    ImplementationTrackingsPanel,
    ResourceAssignmentsPanel,
    MilestoneTrackingsPanel,
    OperationsMetricsPanel,
    OperationsHealthsPanel,
    ExecutiveKpisPanel,
    DeliveryFailuresPanel,
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/customer-success-delivery/components/CustomerSuccessDeliveryPanels";
import { CustomerSuccessDeliveryStats } from "@/src/modules/customer-success-delivery/components/CustomerSuccessDeliveryStats";
import { CSD_TABS } from "@/src/modules/customer-success-delivery/constants";
import { useCustomerSuccessDelivery } from "@/src/modules/customer-success-delivery/hooks/useCustomerSuccessDelivery";

const tabs = [
    { id: CSD_TABS.overview, label: "Overview" },
    { id: CSD_TABS.deliveryHubs, label: "Delivery Hubs" },
    { id: CSD_TABS.customerHealthScores, label: "Customer Health Scores" },
    { id: CSD_TABS.adoptionAnalytics, label: "Adoption Analytics" },
    { id: CSD_TABS.successPlans, label: "Success Plans" },
    { id: CSD_TABS.customerTimelines, label: "Customer Timelines" },
    { id: CSD_TABS.renewalForecasts, label: "Renewal Forecasts" },
    { id: CSD_TABS.supportTickets, label: "Support Tickets" },
    { id: CSD_TABS.liveChatSessions, label: "Live Chat Sessions" },
    { id: CSD_TABS.knowledgeBaseArticles, label: "Knowledge Base Articles" },
    { id: CSD_TABS.slaPolicies, label: "Sla Policies" },
    { id: CSD_TABS.escalationRules, label: "Escalation Rules" },
    { id: CSD_TABS.deploymentAutomations, label: "Deployment Automations" },
    { id: CSD_TABS.environmentManagement, label: "Environment Management" },
    { id: CSD_TABS.deploymentTracking, label: "Deployment Tracking" },
    { id: CSD_TABS.upgradeManagement, label: "Upgrade Management" },
    { id: CSD_TABS.releaseTracking, label: "Release Tracking" },
    { id: CSD_TABS.trainingPortals, label: "Training Portals" },
    { id: CSD_TABS.videoLibrary, label: "Video Library" },
    { id: CSD_TABS.productTours, label: "Product Tours" },
    { id: CSD_TABS.certifications, label: "Certifications" },
    { id: CSD_TABS.progressTracking, label: "Progress Tracking" },
    { id: CSD_TABS.learningAnalytics, label: "Learning Analytics" },
    { id: CSD_TABS.deliveryWorkflows, label: "Delivery Workflows" },
    { id: CSD_TABS.onboardingAutomation, label: "Onboarding Automation" },
    { id: CSD_TABS.implementationTracking, label: "Implementation Tracking" },
    { id: CSD_TABS.resourceAssignments, label: "Resource Assignments" },
    { id: CSD_TABS.milestoneTracking, label: "Milestone Tracking" },
    { id: CSD_TABS.operationsMetrics, label: "Operations Metrics" },
    { id: CSD_TABS.operationsHealth, label: "Operations Health" },
    { id: CSD_TABS.executiveKpis, label: "Executive Kpis" },
    { id: CSD_TABS.deliveryFailures, label: "Delivery Failures" },
    { id: CSD_TABS.auditLogs, label: "Audit Logs" },
    { id: CSD_TABS.api, label: "SDK" },
] as const;

export function CustomerSuccessDeliveryPage() {
    const retail = useCustomerSuccessDelivery();
    const [activeTab, setActiveTab] = useState<(typeof CSD_TABS)[keyof typeof CSD_TABS]>(CSD_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Customer Success & Delivery" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sky-900 dark:text-sky-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-sky-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">V2 Program A Program F Wave 3</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Customer Success & Delivery</h1>
                <p className="mt-3 max-w-2xl text-sm text-sky-500 dark:text-sky-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Customer Success & Delivery SDK.
                </p>
            </motion.header>
            <CustomerSuccessDeliveryStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-sky-600 text-white" : "border border-slate-200 text-sky-600 hover:border-sky-300 dark:border-slate-800 dark:text-sky-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === CSD_TABS.overview ? <RetailOverviewPanel data={retail} /> : null}
            {activeTab === CSD_TABS.deliveryHubs ? <DeliveryHubsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.customerHealthScores ? <CustomerHealthScoresPanel data={retail} /> : null}
            {activeTab === CSD_TABS.adoptionAnalytics ? <AdoptionAnalyticsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.successPlans ? <SuccessPlansPanel data={retail} /> : null}
            {activeTab === CSD_TABS.customerTimelines ? <CustomerTimelinesPanel data={retail} /> : null}
            {activeTab === CSD_TABS.renewalForecasts ? <RenewalForecastsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.supportTickets ? <SupportTicketsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.liveChatSessions ? <LiveChatSessionsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.knowledgeBaseArticles ? <KnowledgeBaseArticlesPanel data={retail} /> : null}
            {activeTab === CSD_TABS.slaPolicies ? <SlaPolicysPanel data={retail} /> : null}
            {activeTab === CSD_TABS.escalationRules ? <EscalationRulesPanel data={retail} /> : null}
            {activeTab === CSD_TABS.deploymentAutomations ? <DeploymentAutomationsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.environmentManagement ? <EnvironmentManagementsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.deploymentTracking ? <DeploymentTrackingsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.upgradeManagement ? <UpgradeManagementsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.releaseTracking ? <ReleaseTrackingsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.trainingPortals ? <TrainingPortalsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.videoLibrary ? <VideoLibrarysPanel data={retail} /> : null}
            {activeTab === CSD_TABS.productTours ? <ProductToursPanel data={retail} /> : null}
            {activeTab === CSD_TABS.certifications ? <CertificationsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.progressTracking ? <ProgressTrackingsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.learningAnalytics ? <LearningAnalyticsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.deliveryWorkflows ? <DeliveryWorkflowsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.onboardingAutomation ? <OnboardingAutomationsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.implementationTracking ? <ImplementationTrackingsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.resourceAssignments ? <ResourceAssignmentsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.milestoneTracking ? <MilestoneTrackingsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.operationsMetrics ? <OperationsMetricsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.operationsHealth ? <OperationsHealthsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.executiveKpis ? <ExecutiveKpisPanel data={retail} /> : null}
            {activeTab === CSD_TABS.deliveryFailures ? <DeliveryFailuresPanel data={retail} /> : null}
            {activeTab === CSD_TABS.auditLogs ? <RetailAuditLogsPanel data={retail} /> : null}
            {activeTab === CSD_TABS.api ? <RetailSdkPanel data={retail} /> : null}
        </div>
    );
}
