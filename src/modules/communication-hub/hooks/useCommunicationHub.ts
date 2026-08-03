"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { communicationHubService } from "@/src/modules/communication-hub/services/communication-hub.service";
import type {
    CommunicationHubSummary,
    CreateCommunicationHubInput,
    NotificationChannelSummary,
    CreateNotificationChannelInput,
    NotificationQueueSummary,
    CreateNotificationQueueInput,
    RetryPolicySummary,
    CreateRetryPolicyInput,
    MessageTemplateSummary,
    CreateMessageTemplateInput,
    TemplateVariableSummary,
    CreateTemplateVariableInput,
    TemplateLocalizationSummary,
    CreateTemplateLocalizationInput,
    TemplateApprovalSummary,
    CreateTemplateApprovalInput,
    AutomationRuleSummary,
    CreateAutomationRuleInput,
    AutomationTriggerSummary,
    CreateAutomationTriggerInput,
    AutomationScheduleSummary,
    CreateAutomationScheduleInput,
    AutomationExecutionSummary,
    CreateAutomationExecutionInput,
    PreferenceProfileSummary,
    CreatePreferenceProfileInput,
    ChannelPreferenceSummary,
    CreateChannelPreferenceInput,
    OptInRecordSummary,
    CreateOptInRecordInput,
    OptOutRecordSummary,
    CreateOptOutRecordInput,
    AnnouncementSummary,
    CreateAnnouncementInput,
    AnnouncementScheduleSummary,
    CreateAnnouncementScheduleInput,
    PinnedAnnouncementSummary,
    CreatePinnedAnnouncementInput,
    AnnouncementAcknowledgementSummary,
    CreateAnnouncementAcknowledgementInput,
    CampaignSummary,
    CreateCampaignInput,
    AudienceSegmentSummary,
    CreateAudienceSegmentInput,
    CampaignDeliverySummary,
    CreateCampaignDeliveryInput,
    CampaignMetricSummary,
    CreateCampaignMetricInput,
    DeliveryAnalyticsSummary,
    CreateDeliveryAnalyticsInput,
    EngagementMetricSummary,
    CreateEngagementMetricInput,
    BounceRecordSummary,
    CreateBounceRecordInput,
    ChannelPerformanceSummary,
    CreateChannelPerformanceInput,
    CommunicationMetricSummary,
    CreateCommunicationMetricInput,
    SystemHealthSummary,
    CreateSystemHealthInput,
    DeliveryFailureSummary,
    CreateDeliveryFailureInput,
    AuditEntry,
    CnhDashboardStats,
    CnhPipelineInfo,
} from "@/src/modules/communication-hub/types";

export function useCommunicationHub() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CnhDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CnhPipelineInfo | null>(null);
    const [communicationHubs, setCommunicationHubs] = useState<CommunicationHubSummary[]>([]);
    const [notificationChannels, setNotificationChannels] = useState<NotificationChannelSummary[]>([]);
    const [notificationQueue, setNotificationQueue] = useState<NotificationQueueSummary[]>([]);
    const [retryPolicies, setRetryPolicies] = useState<RetryPolicySummary[]>([]);
    const [messageTemplates, setMessageTemplates] = useState<MessageTemplateSummary[]>([]);
    const [templateVariables, setTemplateVariables] = useState<TemplateVariableSummary[]>([]);
    const [templateLocalizations, setTemplateLocalizations] = useState<TemplateLocalizationSummary[]>([]);
    const [templateApprovals, setTemplateApprovals] = useState<TemplateApprovalSummary[]>([]);
    const [automationRules, setAutomationRules] = useState<AutomationRuleSummary[]>([]);
    const [automationTriggers, setAutomationTriggers] = useState<AutomationTriggerSummary[]>([]);
    const [automationSchedules, setAutomationSchedules] = useState<AutomationScheduleSummary[]>([]);
    const [automationExecutions, setAutomationExecutions] = useState<AutomationExecutionSummary[]>([]);
    const [preferenceProfiles, setPreferenceProfiles] = useState<PreferenceProfileSummary[]>([]);
    const [channelPreferences, setChannelPreferences] = useState<ChannelPreferenceSummary[]>([]);
    const [optInRecords, setOptInRecords] = useState<OptInRecordSummary[]>([]);
    const [optOutRecords, setOptOutRecords] = useState<OptOutRecordSummary[]>([]);
    const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([]);
    const [announcementSchedules, setAnnouncementSchedules] = useState<AnnouncementScheduleSummary[]>([]);
    const [pinnedAnnouncements, setPinnedAnnouncements] = useState<PinnedAnnouncementSummary[]>([]);
    const [announcementAcknowledgements, setAnnouncementAcknowledgements] = useState<AnnouncementAcknowledgementSummary[]>([]);
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
    const [audienceSegments, setAudienceSegments] = useState<AudienceSegmentSummary[]>([]);
    const [campaignDeliveries, setCampaignDeliveries] = useState<CampaignDeliverySummary[]>([]);
    const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetricSummary[]>([]);
    const [deliveryAnalytics, setDeliveryAnalytics] = useState<DeliveryAnalyticsSummary[]>([]);
    const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetricSummary[]>([]);
    const [bounceRecords, setBounceRecords] = useState<BounceRecordSummary[]>([]);
    const [channelPerformance, setChannelPerformance] = useState<ChannelPerformanceSummary[]>([]);
    const [communicationMetrics, setCommunicationMetrics] = useState<CommunicationMetricSummary[]>([]);
    const [systemHealth, setSystemHealth] = useState<SystemHealthSummary[]>([]);
    const [deliveryFailures, setDeliveryFailures] = useState<DeliveryFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [communicationHubOptions, setCommunicationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
            communicationHubsList,
            notificationChannelsList,
            notificationQueueList,
            retryPoliciesList,
            messageTemplatesList,
            templateVariablesList,
            templateLocalizationsList,
            templateApprovalsList,
            automationRulesList,
            automationTriggersList,
            automationSchedulesList,
            automationExecutionsList,
            preferenceProfilesList,
            channelPreferencesList,
            optInRecordsList,
            optOutRecordsList,
            announcementsList,
            announcementSchedulesList,
            pinnedAnnouncementsList,
            announcementAcknowledgementsList,
            campaignsList,
            audienceSegmentsList,
            campaignDeliveriesList,
            campaignMetricsList,
            deliveryAnalyticsList,
            engagementMetricsList,
            bounceRecordsList,
            channelPerformanceList,
            communicationMetricsList,
            systemHealthList,
            deliveryFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            communicationHubService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(communicationHubService.getPipelineInfo()),
            communicationHubService.getCommunicationHubs(authUserId, email, fullName),
            communicationHubService.getNotificationChannels(authUserId, email, fullName),
            communicationHubService.getNotificationQueue(authUserId, email, fullName),
            communicationHubService.getRetryPolicies(authUserId, email, fullName),
            communicationHubService.getMessageTemplates(authUserId, email, fullName),
            communicationHubService.getTemplateVariables(authUserId, email, fullName),
            communicationHubService.getTemplateLocalizations(authUserId, email, fullName),
            communicationHubService.getTemplateApprovals(authUserId, email, fullName),
            communicationHubService.getAutomationRules(authUserId, email, fullName),
            communicationHubService.getAutomationTriggers(authUserId, email, fullName),
            communicationHubService.getAutomationSchedules(authUserId, email, fullName),
            communicationHubService.getAutomationExecutions(authUserId, email, fullName),
            communicationHubService.getPreferenceProfiles(authUserId, email, fullName),
            communicationHubService.getChannelPreferences(authUserId, email, fullName),
            communicationHubService.getOptInRecords(authUserId, email, fullName),
            communicationHubService.getOptOutRecords(authUserId, email, fullName),
            communicationHubService.getAnnouncements(authUserId, email, fullName),
            communicationHubService.getAnnouncementSchedules(authUserId, email, fullName),
            communicationHubService.getPinnedAnnouncements(authUserId, email, fullName),
            communicationHubService.getAnnouncementAcknowledgements(authUserId, email, fullName),
            communicationHubService.getCampaigns(authUserId, email, fullName),
            communicationHubService.getAudienceSegments(authUserId, email, fullName),
            communicationHubService.getCampaignDeliveries(authUserId, email, fullName),
            communicationHubService.getCampaignMetrics(authUserId, email, fullName),
            communicationHubService.getDeliveryAnalytics(authUserId, email, fullName),
            communicationHubService.getEngagementMetrics(authUserId, email, fullName),
            communicationHubService.getBounceRecords(authUserId, email, fullName),
            communicationHubService.getChannelPerformance(authUserId, email, fullName),
            communicationHubService.getCommunicationMetrics(authUserId, email, fullName),
            communicationHubService.getSystemHealth(authUserId, email, fullName),
            communicationHubService.getDeliveryFailures(authUserId, email, fullName),
            communicationHubService.getAuditLogs(authUserId, email, fullName),
            communicationHubService.getCommunicationHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
            communicationHubsList,
            notificationChannelsList,
            notificationQueueList,
            retryPoliciesList,
            messageTemplatesList,
            templateVariablesList,
            templateLocalizationsList,
            templateApprovalsList,
            automationRulesList,
            automationTriggersList,
            automationSchedulesList,
            automationExecutionsList,
            preferenceProfilesList,
            channelPreferencesList,
            optInRecordsList,
            optOutRecordsList,
            announcementsList,
            announcementSchedulesList,
            pinnedAnnouncementsList,
            announcementAcknowledgementsList,
            campaignsList,
            audienceSegmentsList,
            campaignDeliveriesList,
            campaignMetricsList,
            deliveryAnalyticsList,
            engagementMetricsList,
            bounceRecordsList,
            channelPerformanceList,
            communicationMetricsList,
            systemHealthList,
            deliveryFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setCommunicationHubs(result.communicationHubsList);
        setNotificationChannels(result.notificationChannelsList);
        setNotificationQueue(result.notificationQueueList);
        setRetryPolicies(result.retryPoliciesList);
        setMessageTemplates(result.messageTemplatesList);
        setTemplateVariables(result.templateVariablesList);
        setTemplateLocalizations(result.templateLocalizationsList);
        setTemplateApprovals(result.templateApprovalsList);
        setAutomationRules(result.automationRulesList);
        setAutomationTriggers(result.automationTriggersList);
        setAutomationSchedules(result.automationSchedulesList);
        setAutomationExecutions(result.automationExecutionsList);
        setPreferenceProfiles(result.preferenceProfilesList);
        setChannelPreferences(result.channelPreferencesList);
        setOptInRecords(result.optInRecordsList);
        setOptOutRecords(result.optOutRecordsList);
        setAnnouncements(result.announcementsList);
        setAnnouncementSchedules(result.announcementSchedulesList);
        setPinnedAnnouncements(result.pinnedAnnouncementsList);
        setAnnouncementAcknowledgements(result.announcementAcknowledgementsList);
        setCampaigns(result.campaignsList);
        setAudienceSegments(result.audienceSegmentsList);
        setCampaignDeliveries(result.campaignDeliveriesList);
        setCampaignMetrics(result.campaignMetricsList);
        setDeliveryAnalytics(result.deliveryAnalyticsList);
        setEngagementMetrics(result.engagementMetricsList);
        setBounceRecords(result.bounceRecordsList);
        setChannelPerformance(result.channelPerformanceList);
        setCommunicationMetrics(result.communicationMetricsList);
        setSystemHealth(result.systemHealthList);
        setDeliveryFailures(result.deliveryFailuresList);
        setAuditLogs(result.auditLogsList);
        setCommunicationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createCommunicationHub = useCallback(async (input: CreateCommunicationHubInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createCommunicationHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createNotificationChannel = useCallback(async (input: CreateNotificationChannelInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createNotificationChannel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createNotificationQueue = useCallback(async (input: CreateNotificationQueueInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createNotificationQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetryPolicy = useCallback(async (input: CreateRetryPolicyInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createRetryPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMessageTemplate = useCallback(async (input: CreateMessageTemplateInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createMessageTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplateVariable = useCallback(async (input: CreateTemplateVariableInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createTemplateVariable(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplateLocalization = useCallback(async (input: CreateTemplateLocalizationInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createTemplateLocalization(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplateApproval = useCallback(async (input: CreateTemplateApprovalInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createTemplateApproval(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomationRule = useCallback(async (input: CreateAutomationRuleInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAutomationRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomationTrigger = useCallback(async (input: CreateAutomationTriggerInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAutomationTrigger(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomationSchedule = useCallback(async (input: CreateAutomationScheduleInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAutomationSchedule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomationExecution = useCallback(async (input: CreateAutomationExecutionInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAutomationExecution(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPreferenceProfile = useCallback(async (input: CreatePreferenceProfileInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createPreferenceProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createChannelPreference = useCallback(async (input: CreateChannelPreferenceInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createChannelPreference(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOptInRecord = useCallback(async (input: CreateOptInRecordInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createOptInRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOptOutRecord = useCallback(async (input: CreateOptOutRecordInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createOptOutRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAnnouncement = useCallback(async (input: CreateAnnouncementInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAnnouncement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAnnouncementSchedule = useCallback(async (input: CreateAnnouncementScheduleInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAnnouncementSchedule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPinnedAnnouncement = useCallback(async (input: CreatePinnedAnnouncementInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createPinnedAnnouncement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAnnouncementAcknowledgement = useCallback(async (input: CreateAnnouncementAcknowledgementInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAnnouncementAcknowledgement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampaign = useCallback(async (input: CreateCampaignInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createCampaign(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAudienceSegment = useCallback(async (input: CreateAudienceSegmentInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createAudienceSegment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampaignDelivery = useCallback(async (input: CreateCampaignDeliveryInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createCampaignDelivery(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampaignMetric = useCallback(async (input: CreateCampaignMetricInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createCampaignMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeliveryAnalytics = useCallback(async (input: CreateDeliveryAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createDeliveryAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEngagementMetric = useCallback(async (input: CreateEngagementMetricInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createEngagementMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBounceRecord = useCallback(async (input: CreateBounceRecordInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createBounceRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createChannelPerformance = useCallback(async (input: CreateChannelPerformanceInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createChannelPerformance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommunicationMetric = useCallback(async (input: CreateCommunicationMetricInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createCommunicationMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSystemHealth = useCallback(async (input: CreateSystemHealthInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createSystemHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeliveryFailure = useCallback(async (input: CreateDeliveryFailureInput) => { if (!user) throw new Error("Authentication required"); await communicationHubService.createDeliveryFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        communicationHubs,
        notificationChannels,
        notificationQueue,
        retryPolicies,
        messageTemplates,
        templateVariables,
        templateLocalizations,
        templateApprovals,
        automationRules,
        automationTriggers,
        automationSchedules,
        automationExecutions,
        preferenceProfiles,
        channelPreferences,
        optInRecords,
        optOutRecords,
        announcements,
        announcementSchedules,
        pinnedAnnouncements,
        announcementAcknowledgements,
        campaigns,
        audienceSegments,
        campaignDeliveries,
        campaignMetrics,
        deliveryAnalytics,
        engagementMetrics,
        bounceRecords,
        channelPerformance,
        communicationMetrics,
        systemHealth,
        deliveryFailures,
        auditLogs,
        communicationHubOptions,
        refresh,
        createCommunicationHub,
        createNotificationChannel,
        createNotificationQueue,
        createRetryPolicy,
        createMessageTemplate,
        createTemplateVariable,
        createTemplateLocalization,
        createTemplateApproval,
        createAutomationRule,
        createAutomationTrigger,
        createAutomationSchedule,
        createAutomationExecution,
        createPreferenceProfile,
        createChannelPreference,
        createOptInRecord,
        createOptOutRecord,
        createAnnouncement,
        createAnnouncementSchedule,
        createPinnedAnnouncement,
        createAnnouncementAcknowledgement,
        createCampaign,
        createAudienceSegment,
        createCampaignDelivery,
        createCampaignMetric,
        createDeliveryAnalytics,
        createEngagementMetric,
        createBounceRecord,
        createChannelPerformance,
        createCommunicationMetric,
        createSystemHealth,
        createDeliveryFailure,
    };
}
