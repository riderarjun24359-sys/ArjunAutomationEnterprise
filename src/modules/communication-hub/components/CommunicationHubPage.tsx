"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    CommunicationHubOverviewPanel,
    CommunicationHubsPanel,
    NotificationChannelsPanel,
    NotificationQueuePanel,
    RetryPoliciesPanel,
    MessageTemplatesPanel,
    TemplateVariablesPanel,
    TemplateLocalizationsPanel,
    TemplateApprovalsPanel,
    AutomationRulesPanel,
    AutomationTriggersPanel,
    AutomationSchedulesPanel,
    AutomationExecutionsPanel,
    PreferenceProfilesPanel,
    ChannelPreferencesPanel,
    OptInRecordsPanel,
    OptOutRecordsPanel,
    AnnouncementsPanel,
    AnnouncementSchedulesPanel,
    PinnedAnnouncementsPanel,
    AnnouncementAcknowledgementsPanel,
    CampaignsPanel,
    AudienceSegmentsPanel,
    CampaignDeliveriesPanel,
    CampaignMetricsPanel,
    DeliveryAnalyticsPanel,
    EngagementMetricsPanel,
    BounceRecordsPanel,
    ChannelPerformancePanel,
    CommunicationMetricsPanel,
    SystemHealthPanel,
    DeliveryFailuresPanel,
    AuditLogsPanel,
    CommunicationHubSdkPanel,
} from "@/src/modules/communication-hub/components/CommunicationHubPanels";
import { CommunicationHubStats } from "@/src/modules/communication-hub/components/CommunicationHubStats";
import { CNH_TABS } from "@/src/modules/communication-hub/constants";
import { useCommunicationHub } from "@/src/modules/communication-hub/hooks/useCommunicationHub";

const tabs = [
    { id: CNH_TABS.overview, label: "Overview" },
    { id: CNH_TABS.communicationHubs, label: "Communication Hubs" },
    { id: CNH_TABS.notificationChannels, label: "Notification Channels" },
    { id: CNH_TABS.notificationQueue, label: "Notification Queue" },
    { id: CNH_TABS.retryPolicies, label: "Retry Policies" },
    { id: CNH_TABS.messageTemplates, label: "Message Templates" },
    { id: CNH_TABS.templateVariables, label: "Template Variables" },
    { id: CNH_TABS.templateLocalizations, label: "Template Localizations" },
    { id: CNH_TABS.templateApprovals, label: "Template Approvals" },
    { id: CNH_TABS.automationRules, label: "Automation Rules" },
    { id: CNH_TABS.automationTriggers, label: "Automation Triggers" },
    { id: CNH_TABS.automationSchedules, label: "Automation Schedules" },
    { id: CNH_TABS.automationExecutions, label: "Automation Executions" },
    { id: CNH_TABS.preferenceProfiles, label: "Preference Profiles" },
    { id: CNH_TABS.channelPreferences, label: "Channel Preferences" },
    { id: CNH_TABS.optInRecords, label: "Opt-In Records" },
    { id: CNH_TABS.optOutRecords, label: "Opt-Out Records" },
    { id: CNH_TABS.announcements, label: "Announcements" },
    { id: CNH_TABS.announcementSchedules, label: "Announcement Schedules" },
    { id: CNH_TABS.pinnedAnnouncements, label: "Pinned Announcements" },
    { id: CNH_TABS.announcementAcknowledgements, label: "Announcement Acknowledgements" },
    { id: CNH_TABS.campaigns, label: "Campaigns" },
    { id: CNH_TABS.audienceSegments, label: "Audience Segments" },
    { id: CNH_TABS.campaignDeliveries, label: "Campaign Deliveries" },
    { id: CNH_TABS.campaignMetrics, label: "Campaign Metrics" },
    { id: CNH_TABS.deliveryAnalytics, label: "Delivery Analytics" },
    { id: CNH_TABS.engagementMetrics, label: "Engagement Metrics" },
    { id: CNH_TABS.bounceRecords, label: "Bounce Records" },
    { id: CNH_TABS.channelPerformance, label: "Channel Performance" },
    { id: CNH_TABS.communicationMetrics, label: "Communication Metrics" },
    { id: CNH_TABS.systemHealth, label: "System Health" },
    { id: CNH_TABS.deliveryFailures, label: "Delivery Failures" },
    { id: CNH_TABS.auditLogs, label: "Audit Logs" },
    { id: CNH_TABS.api, label: "SDK" },
] as const;

export function CommunicationHubPage() {
    const communicationHub = useCommunicationHub();
    const [activeTab, setActiveTab] = useState<(typeof CNH_TABS)[keyof typeof CNH_TABS]>(CNH_TABS.overview);

    if (communicationHub.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Communication Hub" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">V2 Program A Sprint 5</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Customer Communication & Notification Hub</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Communication layer for the entire SaaS platform: notification engine, message templates, automation, customer preferences, announcements, campaigns, delivery analytics, and communication operations dashboard with security-first audit and the shared Communication Hub SDK.
                </p>
            </motion.header>
            <CommunicationHubStats stats={communicationHub.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-rose-600 text-white" : "border border-slate-200 text-slate-600 hover:border-rose-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === CNH_TABS.overview ? <CommunicationHubOverviewPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.communicationHubs ? <CommunicationHubsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.notificationChannels ? <NotificationChannelsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.notificationQueue ? <NotificationQueuePanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.retryPolicies ? <RetryPoliciesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.messageTemplates ? <MessageTemplatesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.templateVariables ? <TemplateVariablesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.templateLocalizations ? <TemplateLocalizationsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.templateApprovals ? <TemplateApprovalsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.automationRules ? <AutomationRulesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.automationTriggers ? <AutomationTriggersPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.automationSchedules ? <AutomationSchedulesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.automationExecutions ? <AutomationExecutionsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.preferenceProfiles ? <PreferenceProfilesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.channelPreferences ? <ChannelPreferencesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.optInRecords ? <OptInRecordsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.optOutRecords ? <OptOutRecordsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.announcements ? <AnnouncementsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.announcementSchedules ? <AnnouncementSchedulesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.pinnedAnnouncements ? <PinnedAnnouncementsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.announcementAcknowledgements ? <AnnouncementAcknowledgementsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.campaigns ? <CampaignsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.audienceSegments ? <AudienceSegmentsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.campaignDeliveries ? <CampaignDeliveriesPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.campaignMetrics ? <CampaignMetricsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.deliveryAnalytics ? <DeliveryAnalyticsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.engagementMetrics ? <EngagementMetricsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.bounceRecords ? <BounceRecordsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.channelPerformance ? <ChannelPerformancePanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.communicationMetrics ? <CommunicationMetricsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.systemHealth ? <SystemHealthPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.deliveryFailures ? <DeliveryFailuresPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.auditLogs ? <AuditLogsPanel data={communicationHub} /> : null}
            {activeTab === CNH_TABS.api ? <CommunicationHubSdkPanel data={communicationHub} /> : null}
        </div>
    );
}
