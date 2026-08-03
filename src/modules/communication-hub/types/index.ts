export interface CnhDashboardStats {
    totalCommunicationHubs: number;
    activeCommunicationHubs: number;
    pendingNotificationCount: number;
    deliveredNotificationCount: number;
    failedNotificationCount: number;
    activeCampaignCount: number;
    avgDeliveryRate: number;
    openFailureCount: number;
    auditCount: number;
}

export interface CnhPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface CommunicationHubSummary {
    id: string;
    hubKey: string;
    hubName: string;
    defaultLocale: string;
    status: string;
}

export interface CreateCommunicationHubInput {
    hubKey?: string;
    hubName?: string;
    defaultLocale?: string;
}

export interface NotificationChannelSummary {
    id: string;
    hubName: string;
    channelKey: string;
    channelName: string;
    channelType: string;
    status: string;
}

export interface CreateNotificationChannelInput {
    communicationHubId: string;
    channelKey?: string;
    channelName?: string;
    channelType?: string;
    priorityLevel?: string;
}

export interface NotificationQueueSummary {
    id: string;
    hubName: string;
    queueKey: string;
    deliveryStatus: string;
    status: string;
}

export interface CreateNotificationQueueInput {
    communicationHubId: string;
    queueKey?: string;
    recipient?: string;
    channelType?: string;
    subject?: string;
    priorityLevel?: string;
    deliveryStatus?: string;
}

export interface RetryPolicySummary {
    id: string;
    hubName: string;
    policyKey: string;
    policyName: string;
    status: string;
}

export interface CreateRetryPolicyInput {
    communicationHubId: string;
    policyKey?: string;
    policyName?: string;
    channelType?: string;
    maxRetries?: number;
}

export interface MessageTemplateSummary {
    id: string;
    hubName: string;
    templateKey: string;
    templateName: string;
    status: string;
}

export interface CreateMessageTemplateInput {
    communicationHubId: string;
    templateKey?: string;
    templateName?: string;
    channelType?: string;
}

export interface TemplateVariableSummary {
    id: string;
    hubName: string;
    variableKey: string;
    variableName: string;
    status: string;
}

export interface CreateTemplateVariableInput {
    communicationHubId: string;
    templateId?: string;
    variableKey?: string;
    variableName?: string;
}

export interface TemplateLocalizationSummary {
    id: string;
    hubName: string;
    locale: string;
    status: string;
}

export interface CreateTemplateLocalizationInput {
    communicationHubId: string;
    templateId?: string;
    locale?: string;
}

export interface TemplateApprovalSummary {
    id: string;
    hubName: string;
    approvalKey: string;
    approvalStatus: string;
    status: string;
}

export interface CreateTemplateApprovalInput {
    communicationHubId: string;
    templateId?: string;
    approvalKey?: string;
}

export interface AutomationRuleSummary {
    id: string;
    hubName: string;
    ruleKey: string;
    ruleName: string;
    status: string;
}

export interface CreateAutomationRuleInput {
    communicationHubId: string;
    ruleKey?: string;
    ruleName?: string;
    triggerType?: string;
    actionType?: string;
    priorityLevel?: string;
}

export interface AutomationTriggerSummary {
    id: string;
    hubName: string;
    triggerKey: string;
    triggerEvent: string;
    status: string;
}

export interface CreateAutomationTriggerInput {
    communicationHubId: string;
    ruleId?: string;
    triggerKey?: string;
    triggerEvent?: string;
}

export interface AutomationScheduleSummary {
    id: string;
    hubName: string;
    scheduleKey: string;
    status: string;
}

export interface CreateAutomationScheduleInput {
    communicationHubId: string;
    ruleId?: string;
    scheduleKey?: string;
    cronExpression?: string;
}

export interface AutomationExecutionSummary {
    id: string;
    hubName: string;
    executionKey: string;
    executionStatus: string;
    status: string;
}

export interface CreateAutomationExecutionInput {
    communicationHubId: string;
    ruleId?: string;
    executionKey?: string;
}

export interface PreferenceProfileSummary {
    id: string;
    hubName: string;
    profileKey: string;
    customerEmail: string;
    status: string;
}

export interface CreatePreferenceProfileInput {
    communicationHubId: string;
    profileKey?: string;
    customerEmail?: string;
    preferredLocale?: string;
}

export interface ChannelPreferenceSummary {
    id: string;
    hubName: string;
    channelType: string;
    status: string;
}

export interface CreateChannelPreferenceInput {
    communicationHubId: string;
    preferenceProfileId?: string;
    channelType?: string;
    frequency?: string;
    isEnabled?: boolean;
}

export interface OptInRecordSummary {
    id: string;
    hubName: string;
    optInKey: string;
    channelType: string;
    status: string;
}

export interface CreateOptInRecordInput {
    communicationHubId: string;
    preferenceProfileId?: string;
    optInKey?: string;
    channelType?: string;
    source?: string;
}

export interface OptOutRecordSummary {
    id: string;
    hubName: string;
    optOutKey: string;
    channelType: string;
    status: string;
}

export interface CreateOptOutRecordInput {
    communicationHubId: string;
    preferenceProfileId?: string;
    optOutKey?: string;
    channelType?: string;
    reason?: string;
}

export interface AnnouncementSummary {
    id: string;
    hubName: string;
    announcementKey: string;
    title: string;
    status: string;
}

export interface CreateAnnouncementInput {
    communicationHubId: string;
    announcementKey?: string;
    title?: string;
    content?: string;
    channelType?: string;
    priorityLevel?: string;
    scope?: string;
}

export interface AnnouncementScheduleSummary {
    id: string;
    hubName: string;
    scheduleKey: string;
    status: string;
}

export interface CreateAnnouncementScheduleInput {
    communicationHubId: string;
    announcementId?: string;
    scheduleKey?: string;
}

export interface PinnedAnnouncementSummary {
    id: string;
    hubName: string;
    pinKey: string;
    status: string;
}

export interface CreatePinnedAnnouncementInput {
    communicationHubId: string;
    announcementId?: string;
    pinKey?: string;
    pinOrder?: number;
}

export interface AnnouncementAcknowledgementSummary {
    id: string;
    hubName: string;
    acknowledgementKey: string;
    status: string;
}

export interface CreateAnnouncementAcknowledgementInput {
    communicationHubId: string;
    announcementId?: string;
    acknowledgementKey?: string;
}

export interface CampaignSummary {
    id: string;
    hubName: string;
    campaignKey: string;
    campaignName: string;
    status: string;
}

export interface CreateCampaignInput {
    communicationHubId: string;
    campaignKey?: string;
    campaignName?: string;
    channelType?: string;
    templateId?: string;
}

export interface AudienceSegmentSummary {
    id: string;
    hubName: string;
    segmentKey: string;
    segmentName: string;
    status: string;
}

export interface CreateAudienceSegmentInput {
    communicationHubId: string;
    campaignId?: string;
    segmentKey?: string;
    segmentName?: string;
}

export interface CampaignDeliverySummary {
    id: string;
    hubName: string;
    deliveryKey: string;
    deliveryStatus: string;
    status: string;
}

export interface CreateCampaignDeliveryInput {
    communicationHubId: string;
    campaignId?: string;
    deliveryKey?: string;
    recipient?: string;
    channelType?: string;
    deliveryStatus?: string;
}

export interface CampaignMetricSummary {
    id: string;
    hubName: string;
    metricsKey: string;
    openRate: number;
    clickRate: number;
    status: string;
}

export interface CreateCampaignMetricInput {
    communicationHubId: string;
    campaignId?: string;
    metricsKey?: string;
    sentCount?: number;
    deliveredCount?: number;
    openRate?: number;
    clickRate?: number;
}

export interface DeliveryAnalyticsSummary {
    id: string;
    hubName: string;
    analyticsKey: string;
    deliveryRate: number;
    status: string;
}

export interface CreateDeliveryAnalyticsInput {
    communicationHubId: string;
    analyticsKey?: string;
    channelType?: string;
    totalSent?: number;
    totalDelivered?: number;
    deliveryRate?: number;
}

export interface EngagementMetricSummary {
    id: string;
    hubName: string;
    metricsKey: string;
    engagementScore: number;
    status: string;
}

export interface CreateEngagementMetricInput {
    communicationHubId: string;
    metricsKey?: string;
    channelType?: string;
    openRate?: number;
    clickRate?: number;
    engagementScore?: number;
}

export interface BounceRecordSummary {
    id: string;
    hubName: string;
    bounceKey: string;
    bounceType: string;
    status: string;
}

export interface CreateBounceRecordInput {
    communicationHubId: string;
    bounceKey?: string;
    channelType?: string;
    recipient?: string;
    bounceType?: string;
}

export interface ChannelPerformanceSummary {
    id: string;
    hubName: string;
    performanceKey: string;
    deliveryRate: number;
    status: string;
}

export interface CreateChannelPerformanceInput {
    communicationHubId: string;
    performanceKey?: string;
    channelType?: string;
    deliveryRate?: number;
}

export interface CommunicationMetricSummary {
    id: string;
    metricsKey: string;
    deliveryRate: number;
    status: string;
}

export interface CreateCommunicationMetricInput {
    metricsKey?: string;
    totalSent?: number;
    totalDelivered?: number;
    totalFailed?: number;
    deliveryRate?: number;
}

export interface SystemHealthSummary {
    id: string;
    healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateSystemHealthInput {
    healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
    summary?: string;
}

export interface DeliveryFailureSummary {
    id: string;
    hubName: string;
    failureKey: string;
    channelType: string;
    status: string;
}

export interface CreateDeliveryFailureInput {
    communicationHubId: string;
    failureKey?: string;
    channelType?: string;
    recipient?: string;
    errorCode?: string;
    errorMessage?: string;
}

export interface CnhSdkSendNotificationInput { communicationHubId: string; queueKey: string; recipient: string; channelType?: string; priorityLevel?: string; }
export interface CnhSdkSendNotificationResult { queueId: string; queueKey: string; deliveryStatus: string; }
export interface CnhSdkLaunchCampaignInput { communicationHubId: string; campaignKey: string; campaignName: string; }
export interface CnhSdkLaunchCampaignResult { campaignId: string; campaignKey: string; status: string; }
export interface CnhSdkUpdatePreferencesInput { communicationHubId: string; profileKey: string; customerEmail: string; }
export interface CnhSdkUpdatePreferencesResult { profileId: string; profileKey: string; status: string; }
