"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    GrowthOverviewPanel,
    OperationsHubsPanel,
    BrandKnowledgeBasesPanel,
    BrandRulebooksPanel,
    MessagingLibrarysPanel,
    ServiceLibrarysPanel,
    IndustryLibrarysPanel,
    FaqLibrarysPanel,
    BrandApprovalRulesPanel,
    VideoProjectsPanel,
    ThumbnailManagersPanel,
    VoiceoverManagersPanel,
    CreativeAssetGeneratorsPanel,
    CampaignAssetBuildersPanel,
    CreativeWorkflowsPanel,
    DistributionContentQueuesPanel,
    DistributionPublishingQueuesPanel,
    ChannelManagersPanel,
    ApprovalCentersPanel,
    PublishingHistorysPanel,
    DistributionAnalyticssPanel,
    CampaignDashboardsPanel,
    ContentPerformancesPanel,
    LeadAttributionsPanel,
    GrowthKpisPanel,
    RoiDashboardsPanel,
    RecommendationEnginesPanel,
    CommandCenterMetricsPanel,
    CommandCenterHealthsPanel,
    MissionStatussPanel,
    ExecutiveSummarysPanel,
    OperationalFailuresPanel,
    GrowthAuditLogsPanel,
    GrowthSdkPanel,
} from "@/src/modules/growth-engine/components/GrowthEnginePanels";
import { GrowthEngineStats } from "@/src/modules/growth-engine/components/GrowthEngineStats";
import { AAGE_TABS } from "@/src/modules/growth-engine/constants";
import { useGrowthEngine } from "@/src/modules/growth-engine/hooks/useGrowthEngine";

const tabs = [
    { id: AAGE_TABS.overview, label: "Overview" },
    { id: AAGE_TABS.operationsHubs, label: "Operations Hubs" },
    { id: AAGE_TABS.brandKnowledgeBase, label: "Brand Knowledge Base" },
    { id: AAGE_TABS.brandRulebook, label: "Brand Rulebook" },
    { id: AAGE_TABS.messagingLibrary, label: "Messaging Library" },
    { id: AAGE_TABS.serviceLibrary, label: "Service Library" },
    { id: AAGE_TABS.industryLibrary, label: "Industry Library" },
    { id: AAGE_TABS.faqLibrary, label: "Faq Library" },
    { id: AAGE_TABS.brandApprovalRules, label: "Brand Approval Rules" },
    { id: AAGE_TABS.videoProjects, label: "Video Projects" },
    { id: AAGE_TABS.thumbnailManager, label: "Thumbnail Manager" },
    { id: AAGE_TABS.voiceoverManager, label: "Voiceover Manager" },
    { id: AAGE_TABS.creativeAssetGenerator, label: "Creative Asset Generator" },
    { id: AAGE_TABS.campaignAssetBuilder, label: "Campaign Asset Builder" },
    { id: AAGE_TABS.creativeWorkflows, label: "Creative Workflows" },
    { id: AAGE_TABS.distributionContentQueue, label: "Distribution Content Queue" },
    { id: AAGE_TABS.distributionPublishingQueue, label: "Distribution Publishing Queue" },
    { id: AAGE_TABS.channelManager, label: "Channel Manager" },
    { id: AAGE_TABS.approvalCenter, label: "Approval Center" },
    { id: AAGE_TABS.publishingHistory, label: "Publishing History" },
    { id: AAGE_TABS.distributionAnalytics, label: "Distribution Analytics" },
    { id: AAGE_TABS.campaignDashboard, label: "Campaign Dashboard" },
    { id: AAGE_TABS.contentPerformance, label: "Content Performance" },
    { id: AAGE_TABS.leadAttribution, label: "Lead Attribution" },
    { id: AAGE_TABS.growthKpis, label: "Growth Kpis" },
    { id: AAGE_TABS.roiDashboard, label: "Roi Dashboard" },
    { id: AAGE_TABS.recommendationEngine, label: "Recommendation Engine" },
    { id: AAGE_TABS.commandCenterMetrics, label: "Command Center Metrics" },
    { id: AAGE_TABS.commandCenterHealth, label: "Command Center Health" },
    { id: AAGE_TABS.missionStatus, label: "Mission Status" },
    { id: AAGE_TABS.executiveSummaries, label: "Executive Summaries" },
    { id: AAGE_TABS.operationalFailures, label: "Operational Failures" },
    { id: AAGE_TABS.auditLogs, label: "Audit Logs" },
    { id: AAGE_TABS.api, label: "SDK" },
] as const;

export function GrowthEnginePage() {
    const retail = useGrowthEngine();
    const [activeTab, setActiveTab] = useState<(typeof AAGE_TABS)[keyof typeof AAGE_TABS]>(AAGE_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Operational Growth Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-pink-900 dark:text-pink-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-pink-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-pink-600">V2 Program A Operational Growth Engine</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Operational Growth Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-pink-500 dark:text-pink-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Operational Growth Engine SDK.
                </p>
            </motion.header>
            <GrowthEngineStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-pink-600 text-white" : "border border-slate-200 text-pink-600 hover:border-pink-300 dark:border-slate-800 dark:text-pink-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === AAGE_TABS.overview ? <GrowthOverviewPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.operationsHubs ? <OperationsHubsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.brandKnowledgeBase ? <BrandKnowledgeBasesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.brandRulebook ? <BrandRulebooksPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.messagingLibrary ? <MessagingLibrarysPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.serviceLibrary ? <ServiceLibrarysPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.industryLibrary ? <IndustryLibrarysPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.faqLibrary ? <FaqLibrarysPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.brandApprovalRules ? <BrandApprovalRulesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.videoProjects ? <VideoProjectsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.thumbnailManager ? <ThumbnailManagersPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.voiceoverManager ? <VoiceoverManagersPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.creativeAssetGenerator ? <CreativeAssetGeneratorsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.campaignAssetBuilder ? <CampaignAssetBuildersPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.creativeWorkflows ? <CreativeWorkflowsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.distributionContentQueue ? <DistributionContentQueuesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.distributionPublishingQueue ? <DistributionPublishingQueuesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.channelManager ? <ChannelManagersPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.approvalCenter ? <ApprovalCentersPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.publishingHistory ? <PublishingHistorysPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.distributionAnalytics ? <DistributionAnalyticssPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.campaignDashboard ? <CampaignDashboardsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.contentPerformance ? <ContentPerformancesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.leadAttribution ? <LeadAttributionsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.growthKpis ? <GrowthKpisPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.roiDashboard ? <RoiDashboardsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.recommendationEngine ? <RecommendationEnginesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.commandCenterMetrics ? <CommandCenterMetricsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.commandCenterHealth ? <CommandCenterHealthsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.missionStatus ? <MissionStatussPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.executiveSummaries ? <ExecutiveSummarysPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.operationalFailures ? <OperationalFailuresPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.auditLogs ? <GrowthAuditLogsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.api ? <GrowthSdkPanel data={retail} /> : null}
        </div>
    );
}
