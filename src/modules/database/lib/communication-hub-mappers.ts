import type {
    DbCnhCommunicationHub,
    DbCnhNotificationChannel,
    DbCnhNotificationQueue,
    DbCnhRetryPolicy,
    DbCnhMessageTemplate,
    DbCnhTemplateVariable,
    DbCnhTemplateLocalization,
    DbCnhTemplateApproval,
    DbCnhAutomationRule,
    DbCnhAutomationTrigger,
    DbCnhAutomationSchedule,
    DbCnhAutomationExecution,
    DbCnhPreferenceProfile,
    DbCnhChannelPreference,
    DbCnhOptInRecord,
    DbCnhOptOutRecord,
    DbCnhAnnouncement,
    DbCnhAnnouncementSchedule,
    DbCnhPinnedAnnouncement,
    DbCnhAnnouncementAcknowledgement,
    DbCnhCampaign,
    DbCnhAudienceSegment,
    DbCnhCampaignDelivery,
    DbCnhCampaignMetric,
    DbCnhDeliveryAnalytics,
    DbCnhEngagementMetric,
    DbCnhBounceRecord,
    DbCnhChannelPerformance,
    DbCnhCommunicationMetric,
    DbCnhSystemHealth,
    DbCnhDeliveryFailure,
    DbCnhAuditLog,
} from "@/src/modules/database/types/platform";
import type {
    CreateCommunicationHubInput,
    CommunicationHubSummary,
    CreateNotificationChannelInput,
    NotificationChannelSummary,
    CreateNotificationQueueInput,
    NotificationQueueSummary,
    CreateRetryPolicyInput,
    RetryPolicySummary,
    CreateMessageTemplateInput,
    MessageTemplateSummary,
    CreateTemplateVariableInput,
    TemplateVariableSummary,
    CreateTemplateLocalizationInput,
    TemplateLocalizationSummary,
    CreateTemplateApprovalInput,
    TemplateApprovalSummary,
    CreateAutomationRuleInput,
    AutomationRuleSummary,
    CreateAutomationTriggerInput,
    AutomationTriggerSummary,
    CreateAutomationScheduleInput,
    AutomationScheduleSummary,
    CreateAutomationExecutionInput,
    AutomationExecutionSummary,
    CreatePreferenceProfileInput,
    PreferenceProfileSummary,
    CreateChannelPreferenceInput,
    ChannelPreferenceSummary,
    CreateOptInRecordInput,
    OptInRecordSummary,
    CreateOptOutRecordInput,
    OptOutRecordSummary,
    CreateAnnouncementInput,
    AnnouncementSummary,
    CreateAnnouncementScheduleInput,
    AnnouncementScheduleSummary,
    CreatePinnedAnnouncementInput,
    PinnedAnnouncementSummary,
    CreateAnnouncementAcknowledgementInput,
    AnnouncementAcknowledgementSummary,
    CreateCampaignInput,
    CampaignSummary,
    CreateAudienceSegmentInput,
    AudienceSegmentSummary,
    CreateCampaignDeliveryInput,
    CampaignDeliverySummary,
    CreateCampaignMetricInput,
    CampaignMetricSummary,
    CreateDeliveryAnalyticsInput,
    DeliveryAnalyticsSummary,
    CreateEngagementMetricInput,
    EngagementMetricSummary,
    CreateBounceRecordInput,
    BounceRecordSummary,
    CreateChannelPerformanceInput,
    ChannelPerformanceSummary,
    CreateCommunicationMetricInput,
    CommunicationMetricSummary,
    CreateSystemHealthInput,
    SystemHealthSummary,
    CreateDeliveryFailureInput,
    DeliveryFailureSummary,
    CnhDashboardStats,
    CnhPipelineInfo,
    AuditEntry,
} from "@/src/modules/communication-hub/types";

type LookupMaps = { communicationHubs: Map<string, DbCnhCommunicationHub> };

export const buildCommunicationHubLookupMaps = (communicationHubs: DbCnhCommunicationHub[]): LookupMaps => ({
    communicationHubs: new Map(communicationHubs.map((item) => [item.id, item])),
});

const hubName = (maps: LookupMaps, id?: string | null) => (id ? maps.communicationHubs.get(id)?.hub_name ?? null : null);

export const mapAuditEntry = (record: DbCnhAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    securityLevel: record.security_level,
    createdAt: record.created_at,
});

export const buildCnhAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string, securityLevel = "standard") => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    security_level: securityLevel,
});

export const buildCnhDashboardStats = (input: {
    communicationHubs: CommunicationHubSummary[];
    notificationQueue: Array<{ deliveryStatus: string; status?: string }>;
    campaigns: Array<{ status: string }>;
    deliveryAnalytics?: Array<{ deliveryRate?: number }>;
    communicationMetrics?: Array<{ deliveryRate?: number }>;
    deliveryFailures: Array<{ status: string }>;
    auditLogs: unknown[];
}): CnhDashboardStats => {
    const deliveryRates = input.deliveryAnalytics?.length
        ? input.deliveryAnalytics.map((d) => d.deliveryRate ?? 0)
        : input.communicationMetrics?.map((m) => m.deliveryRate ?? 0) ?? [];
    return {
        totalCommunicationHubs: input.communicationHubs.length,
        activeCommunicationHubs: input.communicationHubs.filter((h) => h.status === "active").length,
        pendingNotificationCount: input.notificationQueue.filter((n) => n.deliveryStatus === "pending" || n.deliveryStatus === "queued").length,
        deliveredNotificationCount: input.notificationQueue.filter((n) => n.deliveryStatus === "delivered").length,
        failedNotificationCount: input.notificationQueue.filter((n) => n.deliveryStatus === "failed").length,
        activeCampaignCount: input.campaigns.filter((c) => c.status === "active").length,
        avgDeliveryRate: deliveryRates.length ? deliveryRates.reduce((s, r) => s + r, 0) / deliveryRates.length : 0,
        openFailureCount: input.deliveryFailures.filter((f) => f.status === "open").length,
        auditCount: input.auditLogs.length,
    };
};

export const buildCnhPipelineInfo = (): CnhPipelineInfo => ({
    stages: [
        { key: "queued", label: "Queued" },
        { key: "processing", label: "Processing" },
        { key: "delivered", label: "Delivered" },
        { key: "failed", label: "Failed" },
        { key: "retried", label: "Retried" },
        { key: "completed", label: "Completed" },
    ],
    currentStage: "processing",
    nextStage: "delivered",
    previousStage: "queued",
});

export const mapCommunicationHubSummary = (record: DbCnhCommunicationHub): CommunicationHubSummary => ({
    id: record.id,
    hubKey: record.hub_key,
    hubName: record.hub_name,
    defaultLocale: record.default_locale,
    status: record.status,
});

export const mapNotificationChannelSummary = (record: DbCnhNotificationChannel, maps: LookupMaps): NotificationChannelSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    channelKey: record.channel_key,
    channelName: record.channel_name,
    channelType: record.channel_type,
    status: record.status,
});

export const mapNotificationQueueSummary = (record: DbCnhNotificationQueue, maps: LookupMaps): NotificationQueueSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    queueKey: record.queue_key,
    deliveryStatus: record.delivery_status,
    status: record.status,
});

export const mapRetryPolicySummary = (record: DbCnhRetryPolicy, maps: LookupMaps): RetryPolicySummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    policyKey: record.policy_key,
    policyName: record.policy_name,
    status: record.status,
});

export const mapMessageTemplateSummary = (record: DbCnhMessageTemplate, maps: LookupMaps): MessageTemplateSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    templateKey: record.template_key,
    templateName: record.template_name,
    status: record.status,
});

export const mapTemplateVariableSummary = (record: DbCnhTemplateVariable, maps: LookupMaps): TemplateVariableSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    variableKey: record.variable_key,
    variableName: record.variable_name,
    status: record.status,
});

export const mapTemplateLocalizationSummary = (record: DbCnhTemplateLocalization, maps: LookupMaps): TemplateLocalizationSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    locale: record.locale,
    status: record.status,
});

export const mapTemplateApprovalSummary = (record: DbCnhTemplateApproval, maps: LookupMaps): TemplateApprovalSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    approvalKey: record.approval_key,
    approvalStatus: record.approval_status,
    status: record.status,
});

export const mapAutomationRuleSummary = (record: DbCnhAutomationRule, maps: LookupMaps): AutomationRuleSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    ruleKey: record.rule_key,
    ruleName: record.rule_name,
    status: record.status,
});

export const mapAutomationTriggerSummary = (record: DbCnhAutomationTrigger, maps: LookupMaps): AutomationTriggerSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    triggerKey: record.trigger_key,
    triggerEvent: record.trigger_event,
    status: record.status,
});

export const mapAutomationScheduleSummary = (record: DbCnhAutomationSchedule, maps: LookupMaps): AutomationScheduleSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    scheduleKey: record.schedule_key,
    status: record.status,
});

export const mapAutomationExecutionSummary = (record: DbCnhAutomationExecution, maps: LookupMaps): AutomationExecutionSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    executionKey: record.execution_key,
    executionStatus: record.execution_status,
    status: record.status,
});

export const mapPreferenceProfileSummary = (record: DbCnhPreferenceProfile, maps: LookupMaps): PreferenceProfileSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    profileKey: record.profile_key,
    customerEmail: record.customer_email,
    status: record.status,
});

export const mapChannelPreferenceSummary = (record: DbCnhChannelPreference, maps: LookupMaps): ChannelPreferenceSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    channelType: record.channel_type,
    status: record.status,
});

export const mapOptInRecordSummary = (record: DbCnhOptInRecord, maps: LookupMaps): OptInRecordSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    optInKey: record.opt_in_key,
    channelType: record.channel_type,
    status: record.status,
});

export const mapOptOutRecordSummary = (record: DbCnhOptOutRecord, maps: LookupMaps): OptOutRecordSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    optOutKey: record.opt_out_key,
    channelType: record.channel_type,
    status: record.status,
});

export const mapAnnouncementSummary = (record: DbCnhAnnouncement, maps: LookupMaps): AnnouncementSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    announcementKey: record.announcement_key,
    title: record.title,
    status: record.status,
});

export const mapAnnouncementScheduleSummary = (record: DbCnhAnnouncementSchedule, maps: LookupMaps): AnnouncementScheduleSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    scheduleKey: record.schedule_key,
    status: record.status,
});

export const mapPinnedAnnouncementSummary = (record: DbCnhPinnedAnnouncement, maps: LookupMaps): PinnedAnnouncementSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    pinKey: record.pin_key,
    status: record.status,
});

export const mapAnnouncementAcknowledgementSummary = (record: DbCnhAnnouncementAcknowledgement, maps: LookupMaps): AnnouncementAcknowledgementSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    acknowledgementKey: record.acknowledgement_key,
    status: record.status,
});

export const mapCampaignSummary = (record: DbCnhCampaign, maps: LookupMaps): CampaignSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    campaignKey: record.campaign_key,
    campaignName: record.campaign_name,
    status: record.status,
});

export const mapAudienceSegmentSummary = (record: DbCnhAudienceSegment, maps: LookupMaps): AudienceSegmentSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    segmentKey: record.segment_key,
    segmentName: record.segment_name,
    status: record.status,
});

export const mapCampaignDeliverySummary = (record: DbCnhCampaignDelivery, maps: LookupMaps): CampaignDeliverySummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    deliveryKey: record.delivery_key,
    deliveryStatus: record.delivery_status,
    status: record.status,
});

export const mapCampaignMetricSummary = (record: DbCnhCampaignMetric, maps: LookupMaps): CampaignMetricSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    metricsKey: record.metrics_key,
    openRate: record.open_rate,
    clickRate: record.click_rate,
    status: record.status,
});

export const mapDeliveryAnalyticsSummary = (record: DbCnhDeliveryAnalytics, maps: LookupMaps): DeliveryAnalyticsSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    analyticsKey: record.analytics_key,
    deliveryRate: record.delivery_rate,
    status: record.status,
});

export const mapEngagementMetricSummary = (record: DbCnhEngagementMetric, maps: LookupMaps): EngagementMetricSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    metricsKey: record.metrics_key,
    engagementScore: record.engagement_score,
    status: record.status,
});

export const mapBounceRecordSummary = (record: DbCnhBounceRecord, maps: LookupMaps): BounceRecordSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    bounceKey: record.bounce_key,
    bounceType: record.bounce_type,
    status: record.status,
});

export const mapChannelPerformanceSummary = (record: DbCnhChannelPerformance, maps: LookupMaps): ChannelPerformanceSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    performanceKey: record.performance_key,
    deliveryRate: record.delivery_rate,
    status: record.status,
});

export const mapCommunicationMetricSummary = (record: DbCnhCommunicationMetric): CommunicationMetricSummary => ({
    id: record.id,
    metricsKey: record.metrics_key,
    deliveryRate: record.delivery_rate,
    status: record.status,
});

export const mapSystemHealthSummary = (record: DbCnhSystemHealth): SystemHealthSummary => ({
    id: record.id,
    healthKey: record.health_key,
    overallScore: record.overall_score,
    disasterRecoveryMode: record.disaster_recovery_mode,
    status: record.status,
});

export const mapDeliveryFailureSummary = (record: DbCnhDeliveryFailure, maps: LookupMaps): DeliveryFailureSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    failureKey: record.failure_key,
    channelType: record.channel_type,
    status: record.status,
});

export const buildCommunicationHubPayload = (organizationId: string, input: CreateCommunicationHubInput) => ({
    organization_id: organizationId,
    hub_key: input.hubKey ?? "",
    hub_name: input.hubName ?? "",
    default_locale: input.defaultLocale ?? "en-US",
});

export const buildNotificationChannelPayload = (organizationId: string, input: CreateNotificationChannelInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    channel_key: input.channelKey ?? "",
    channel_name: input.channelName ?? "",
    channel_type: input.channelType ?? "email",
    priority_level: input.priorityLevel ?? "normal",
});

export const buildNotificationQueuePayload = (organizationId: string, input: CreateNotificationQueueInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    queue_key: input.queueKey ?? "",
    channel_type: input.channelType ?? "email",
    recipient: input.recipient ?? "",
    subject: input.subject ?? "",
    priority_level: input.priorityLevel ?? "normal",
    delivery_status: input.deliveryStatus ?? "pending",
});

export const buildRetryPolicyPayload = (organizationId: string, input: CreateRetryPolicyInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    policy_key: input.policyKey ?? "",
    policy_name: input.policyName ?? "",
    channel_type: input.channelType ?? "email",
    max_retries: input.maxRetries ?? 3,
});

export const buildMessageTemplatePayload = (organizationId: string, input: CreateMessageTemplateInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    template_key: input.templateKey ?? "",
    template_name: input.templateName ?? "",
    channel_type: input.channelType ?? "email",
});

export const buildTemplateVariablePayload = (organizationId: string, input: CreateTemplateVariableInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    template_id: input.templateId,
    variable_key: input.variableKey ?? "",
    variable_name: input.variableName ?? "",
});

export const buildTemplateLocalizationPayload = (organizationId: string, input: CreateTemplateLocalizationInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    template_id: input.templateId,
    locale: input.locale ?? "en-US",
});

export const buildTemplateApprovalPayload = (organizationId: string, input: CreateTemplateApprovalInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    template_id: input.templateId,
    approval_key: input.approvalKey ?? "",
});

export const buildAutomationRulePayload = (organizationId: string, input: CreateAutomationRuleInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    rule_key: input.ruleKey ?? "",
    rule_name: input.ruleName ?? "",
    trigger_type: input.triggerType ?? "event",
    action_type: input.actionType ?? "send_notification",
});

export const buildAutomationTriggerPayload = (organizationId: string, input: CreateAutomationTriggerInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    rule_id: input.ruleId,
    trigger_key: input.triggerKey ?? "",
    trigger_event: input.triggerEvent ?? "",
});

export const buildAutomationSchedulePayload = (organizationId: string, input: CreateAutomationScheduleInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    rule_id: input.ruleId,
    schedule_key: input.scheduleKey ?? "",
    cron_expression: input.cronExpression ?? "0 9 * * *",
});

export const buildAutomationExecutionPayload = (organizationId: string, input: CreateAutomationExecutionInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    rule_id: input.ruleId ?? null,
    execution_key: input.executionKey ?? "",
});

export const buildPreferenceProfilePayload = (organizationId: string, input: CreatePreferenceProfileInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    profile_key: input.profileKey ?? "",
    customer_email: input.customerEmail ?? "",
    preferred_locale: input.preferredLocale ?? "en-US",
});

export const buildChannelPreferencePayload = (organizationId: string, input: CreateChannelPreferenceInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    preference_profile_id: input.preferenceProfileId,
    channel_type: input.channelType ?? "email",
    frequency: input.frequency ?? "immediate",
});

export const buildOptInRecordPayload = (organizationId: string, input: CreateOptInRecordInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    preference_profile_id: input.preferenceProfileId ?? null,
    opt_in_key: input.optInKey ?? "",
    channel_type: input.channelType ?? "email",
    source: input.source ?? "signup",
});

export const buildOptOutRecordPayload = (organizationId: string, input: CreateOptOutRecordInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    preference_profile_id: input.preferenceProfileId ?? null,
    opt_out_key: input.optOutKey ?? "",
    channel_type: input.channelType ?? "email",
    reason: input.reason ?? "",
});

export const buildAnnouncementPayload = (organizationId: string, input: CreateAnnouncementInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    announcement_key: input.announcementKey ?? "",
    title: input.title ?? "",
    content: input.content ?? "",
    channel_type: input.channelType ?? "in_app",
    priority_level: input.priorityLevel ?? "normal",
});

export const buildAnnouncementSchedulePayload = (organizationId: string, input: CreateAnnouncementScheduleInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    announcement_id: input.announcementId,
    schedule_key: input.scheduleKey ?? "",
});

export const buildPinnedAnnouncementPayload = (organizationId: string, input: CreatePinnedAnnouncementInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    announcement_id: input.announcementId,
    pin_key: input.pinKey ?? "",
    pin_order: input.pinOrder ?? 0,
});

export const buildAnnouncementAcknowledgementPayload = (organizationId: string, input: CreateAnnouncementAcknowledgementInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    announcement_id: input.announcementId,
    acknowledgement_key: input.acknowledgementKey ?? "",
});

export const buildCampaignPayload = (organizationId: string, input: CreateCampaignInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    campaign_key: input.campaignKey ?? "",
    campaign_name: input.campaignName ?? "",
    channel_type: input.channelType ?? "email",
    template_id: input.templateId ?? null,
});

export const buildAudienceSegmentPayload = (organizationId: string, input: CreateAudienceSegmentInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    campaign_id: input.campaignId ?? null,
    segment_key: input.segmentKey ?? "",
    segment_name: input.segmentName ?? "",
});

export const buildCampaignDeliveryPayload = (organizationId: string, input: CreateCampaignDeliveryInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    campaign_id: input.campaignId,
    delivery_key: input.deliveryKey ?? "",
    recipient: input.recipient ?? "",
    channel_type: input.channelType ?? "email",
    delivery_status: input.deliveryStatus ?? "pending",
});

export const buildCampaignMetricPayload = (organizationId: string, input: CreateCampaignMetricInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    campaign_id: input.campaignId,
    metrics_key: input.metricsKey ?? "",
    sent_count: input.sentCount ?? 0,
    delivered_count: input.deliveredCount ?? 0,
});

export const buildDeliveryAnalyticsPayload = (organizationId: string, input: CreateDeliveryAnalyticsInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    analytics_key: input.analyticsKey ?? "",
    channel_type: input.channelType ?? "email",
    total_sent: input.totalSent ?? 0,
    total_delivered: input.totalDelivered ?? 0,
});

export const buildEngagementMetricPayload = (organizationId: string, input: CreateEngagementMetricInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    metrics_key: input.metricsKey ?? "",
    channel_type: input.channelType ?? "email",
    open_rate: input.openRate ?? 0,
    click_rate: input.clickRate ?? 0,
});

export const buildBounceRecordPayload = (organizationId: string, input: CreateBounceRecordInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    bounce_key: input.bounceKey ?? "",
    channel_type: input.channelType ?? "email",
    recipient: input.recipient ?? "",
    bounce_type: input.bounceType ?? "hard",
});

export const buildChannelPerformancePayload = (organizationId: string, input: CreateChannelPerformanceInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    performance_key: input.performanceKey ?? "",
    channel_type: input.channelType ?? "email",
    delivery_rate: input.deliveryRate ?? 0,
});

export const buildCommunicationMetricPayload = (organizationId: string, input: CreateCommunicationMetricInput) => ({
    organization_id: organizationId,
    metrics_key: input.metricsKey ?? "",
    total_sent: input.totalSent ?? 0,
    total_delivered: input.totalDelivered ?? 0,
    delivery_rate: input.deliveryRate ?? 0,
});

export const buildSystemHealthPayload = (organizationId: string, input: CreateSystemHealthInput) => ({
    organization_id: organizationId,
    health_key: input.healthKey ?? "",
    overall_score: input.overallScore ?? 0,
    disaster_recovery_mode: input.disasterRecoveryMode ?? false,
    summary: input.summary ?? "",
});

export const buildDeliveryFailurePayload = (organizationId: string, input: CreateDeliveryFailureInput) => ({
    organization_id: organizationId,
    hub_id: input.communicationHubId,
    failure_key: input.failureKey ?? "",
    channel_type: input.channelType ?? "email",
    recipient: input.recipient ?? "",
    error_code: input.errorCode ?? "",
    error_message: input.errorMessage ?? "",
});

export const mapNotificationQueueForStats = (record: DbCnhNotificationQueue) => ({
    deliveryStatus: record.delivery_status,
    status: record.status,
});

export const mapDeliveryAnalyticsForStats = (record: DbCnhDeliveryAnalytics) => ({
    deliveryRate: record.delivery_rate,
});

export const mapCommunicationMetricForStats = (record: DbCnhCommunicationMetric) => ({
    deliveryRate: record.delivery_rate,
});

export const mapCampaignForStats = (record: DbCnhCampaign) => ({
    status: record.status,
});

export const mapDeliveryFailureForStats = (record: DbCnhDeliveryFailure) => ({
    status: record.status,
});
