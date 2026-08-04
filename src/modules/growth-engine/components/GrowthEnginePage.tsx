"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    GrowthOverviewPanel,
    GrowthHubsPanel,
    BrandProfilesPanel,
    BrandVoicesPanel,
    CoreMessagingsPanel,
    BrandGuidelinesPanel,
    LogoLibrarysPanel,
    ColorSystemsPanel,
    YoutubeTemplatesPanel,
    SocialTemplatesPanel,
    BlogTemplatesPanel,
    WebsiteArticleTemplatesPanel,
    EmailCampaignTemplatesPanel,
    CaseStudyTemplatesPanel,
    ImageAssetsPanel,
    VideoAssetsPanel,
    IconAssetsPanel,
    VoiceProfilesPanel,
    MusicAssetsPanel,
    ThumbnailTemplatesPanel,
    IdeaGeneratorsPanel,
    ScriptGeneratorsPanel,
    CaptionGeneratorsPanel,
    BlogGeneratorsPanel,
    SeoAssistantsPanel,
    CtaGeneratorsPanel,
    GrowthMetricsPanel,
    GrowthHealthsPanel,
    ContentCalendarsPanel,
    DraftQueuesPanel,
    ApprovalQueuesPanel,
    PublishingQueuesPanel,
    GrowthAuditLogsPanel,
    GrowthSdkPanel,
} from "@/src/modules/growth-engine/components/GrowthEnginePanels";
import { GrowthEngineStats } from "@/src/modules/growth-engine/components/GrowthEngineStats";
import { AAGE_TABS } from "@/src/modules/growth-engine/constants";
import { useGrowthEngine } from "@/src/modules/growth-engine/hooks/useGrowthEngine";

const tabs = [
    { id: AAGE_TABS.overview, label: "Overview" },
    { id: AAGE_TABS.growthHubs, label: "Growth Hubs" },
    { id: AAGE_TABS.brandProfiles, label: "Brand Profiles" },
    { id: AAGE_TABS.brandVoice, label: "Brand Voice" },
    { id: AAGE_TABS.coreMessaging, label: "Core Messaging" },
    { id: AAGE_TABS.brandGuidelines, label: "Brand Guidelines" },
    { id: AAGE_TABS.logoLibrary, label: "Logo Library" },
    { id: AAGE_TABS.colorSystems, label: "Color Systems" },
    { id: AAGE_TABS.youtubeTemplates, label: "Youtube Templates" },
    { id: AAGE_TABS.socialTemplates, label: "Social Templates" },
    { id: AAGE_TABS.blogTemplates, label: "Blog Templates" },
    { id: AAGE_TABS.websiteArticleTemplates, label: "Website Article Templates" },
    { id: AAGE_TABS.emailCampaignTemplates, label: "Email Campaign Templates" },
    { id: AAGE_TABS.caseStudyTemplates, label: "Case Study Templates" },
    { id: AAGE_TABS.imageAssets, label: "Image Assets" },
    { id: AAGE_TABS.videoAssets, label: "Video Assets" },
    { id: AAGE_TABS.iconAssets, label: "Icon Assets" },
    { id: AAGE_TABS.voiceProfiles, label: "Voice Profiles" },
    { id: AAGE_TABS.musicAssets, label: "Music Assets" },
    { id: AAGE_TABS.thumbnailTemplates, label: "Thumbnail Templates" },
    { id: AAGE_TABS.ideaGenerators, label: "Idea Generators" },
    { id: AAGE_TABS.scriptGenerators, label: "Script Generators" },
    { id: AAGE_TABS.captionGenerators, label: "Caption Generators" },
    { id: AAGE_TABS.blogGenerators, label: "Blog Generators" },
    { id: AAGE_TABS.seoAssistants, label: "Seo Assistants" },
    { id: AAGE_TABS.ctaGenerators, label: "Cta Generators" },
    { id: AAGE_TABS.growthMetrics, label: "Growth Metrics" },
    { id: AAGE_TABS.growthHealth, label: "Growth Health" },
    { id: AAGE_TABS.contentCalendar, label: "Content Calendar" },
    { id: AAGE_TABS.draftQueue, label: "Draft Queue" },
    { id: AAGE_TABS.approvalQueue, label: "Approval Queue" },
    { id: AAGE_TABS.publishingQueue, label: "Publishing Queue" },
    { id: AAGE_TABS.auditLogs, label: "Audit Logs" },
    { id: AAGE_TABS.api, label: "SDK" },
] as const;

export function GrowthEnginePage() {
    const retail = useGrowthEngine();
    const [activeTab, setActiveTab] = useState<(typeof AAGE_TABS)[keyof typeof AAGE_TABS]>(AAGE_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Growth Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-pink-900 dark:text-pink-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-pink-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-pink-600">V2 Program A Growth Engine</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Growth Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-pink-500 dark:text-pink-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Growth Engine SDK.
                </p>
            </motion.header>
            <GrowthEngineStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-pink-600 text-white" : "border border-slate-200 text-pink-600 hover:border-pink-300 dark:border-slate-800 dark:text-pink-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === AAGE_TABS.overview ? <GrowthOverviewPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.growthHubs ? <GrowthHubsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.brandProfiles ? <BrandProfilesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.brandVoice ? <BrandVoicesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.coreMessaging ? <CoreMessagingsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.brandGuidelines ? <BrandGuidelinesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.logoLibrary ? <LogoLibrarysPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.colorSystems ? <ColorSystemsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.youtubeTemplates ? <YoutubeTemplatesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.socialTemplates ? <SocialTemplatesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.blogTemplates ? <BlogTemplatesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.websiteArticleTemplates ? <WebsiteArticleTemplatesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.emailCampaignTemplates ? <EmailCampaignTemplatesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.caseStudyTemplates ? <CaseStudyTemplatesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.imageAssets ? <ImageAssetsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.videoAssets ? <VideoAssetsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.iconAssets ? <IconAssetsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.voiceProfiles ? <VoiceProfilesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.musicAssets ? <MusicAssetsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.thumbnailTemplates ? <ThumbnailTemplatesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.ideaGenerators ? <IdeaGeneratorsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.scriptGenerators ? <ScriptGeneratorsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.captionGenerators ? <CaptionGeneratorsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.blogGenerators ? <BlogGeneratorsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.seoAssistants ? <SeoAssistantsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.ctaGenerators ? <CtaGeneratorsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.growthMetrics ? <GrowthMetricsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.growthHealth ? <GrowthHealthsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.contentCalendar ? <ContentCalendarsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.draftQueue ? <DraftQueuesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.approvalQueue ? <ApprovalQueuesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.publishingQueue ? <PublishingQueuesPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.auditLogs ? <GrowthAuditLogsPanel data={retail} /> : null}
            {activeTab === AAGE_TABS.api ? <GrowthSdkPanel data={retail} /> : null}
        </div>
    );
}
