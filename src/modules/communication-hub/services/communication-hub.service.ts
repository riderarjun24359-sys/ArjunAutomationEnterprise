import { isBlockedByOptOut } from "@/src/modules/communication-hub/lib/consent-gate";
import {
    buildCommunicationHubLookupMaps,
    buildCnhAuditPayload,
    buildCnhDashboardStats,
    buildCnhPipelineInfo,
    buildCommunicationHubPayload,
    mapCommunicationHubSummary,
    buildNotificationChannelPayload,
    mapNotificationChannelSummary,
    buildNotificationQueuePayload,
    mapNotificationQueueSummary,
    buildRetryPolicyPayload,
    mapRetryPolicySummary,
    buildMessageTemplatePayload,
    mapMessageTemplateSummary,
    buildTemplateVariablePayload,
    mapTemplateVariableSummary,
    buildTemplateLocalizationPayload,
    mapTemplateLocalizationSummary,
    buildTemplateApprovalPayload,
    mapTemplateApprovalSummary,
    buildAutomationRulePayload,
    mapAutomationRuleSummary,
    buildAutomationTriggerPayload,
    mapAutomationTriggerSummary,
    buildAutomationSchedulePayload,
    mapAutomationScheduleSummary,
    buildAutomationExecutionPayload,
    mapAutomationExecutionSummary,
    buildPreferenceProfilePayload,
    mapPreferenceProfileSummary,
    buildChannelPreferencePayload,
    mapChannelPreferenceSummary,
    buildOptInRecordPayload,
    mapOptInRecordSummary,
    buildOptOutRecordPayload,
    mapOptOutRecordSummary,
    buildAnnouncementPayload,
    mapAnnouncementSummary,
    buildAnnouncementSchedulePayload,
    mapAnnouncementScheduleSummary,
    buildPinnedAnnouncementPayload,
    mapPinnedAnnouncementSummary,
    buildAnnouncementAcknowledgementPayload,
    mapAnnouncementAcknowledgementSummary,
    buildCampaignPayload,
    mapCampaignSummary,
    buildAudienceSegmentPayload,
    mapAudienceSegmentSummary,
    buildCampaignDeliveryPayload,
    mapCampaignDeliverySummary,
    buildCampaignMetricPayload,
    mapCampaignMetricSummary,
    buildDeliveryAnalyticsPayload,
    mapDeliveryAnalyticsSummary,
    buildEngagementMetricPayload,
    mapEngagementMetricSummary,
    buildBounceRecordPayload,
    mapBounceRecordSummary,
    buildChannelPerformancePayload,
    mapChannelPerformanceSummary,
    buildCommunicationMetricPayload,
    mapCommunicationMetricSummary,
    buildSystemHealthPayload,
    mapSystemHealthSummary,
    buildDeliveryFailurePayload,
    mapDeliveryFailureSummary,
    mapNotificationQueueForStats,
    mapDeliveryAnalyticsForStats,
    mapCampaignForStats,
    mapDeliveryFailureForStats,
    mapAuditEntry,
} from "@/src/modules/database/lib/communication-hub-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AuditEntry,
    CnhDashboardStats,
    CnhPipelineInfo,
    CnhSdkLaunchCampaignInput,
    CnhSdkLaunchCampaignResult,
    CnhSdkSendNotificationInput,
    CnhSdkSendNotificationResult,
    CnhSdkUpdatePreferencesInput,
    CnhSdkUpdatePreferencesResult,
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
} from "@/src/modules/communication-hub/types";

export class CommunicationHubService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const hubs = await databaseService.cnhCommunicationHubs.listByOrganization(organizationId);
        return buildCommunicationHubLookupMaps(hubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CnhDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCnhDashboardStats({ communicationHubs: [], notificationQueue: [], campaigns: [], deliveryAnalytics: [], deliveryFailures: [], auditLogs: [] });
        const [communicationHubs, notificationQueueRaw, campaignsRaw, deliveryAnalyticsRaw, deliveryFailuresRaw, auditLogs] = await Promise.all([
            this.getCommunicationHubs(authUserId, email, fullName),
            databaseService.cnhNotificationQueue.listByOrganization(context.organizationId),
            databaseService.cnhCampaigns.listByOrganization(context.organizationId),
            databaseService.cnhDeliveryAnalytics.listByOrganization(context.organizationId),
            databaseService.cnhDeliveryFailures.listByOrganization(context.organizationId),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCnhDashboardStats({
            communicationHubs,
            notificationQueue: notificationQueueRaw.map(mapNotificationQueueForStats),
            campaigns: campaignsRaw.map(mapCampaignForStats),
            deliveryAnalytics: deliveryAnalyticsRaw.map(mapDeliveryAnalyticsForStats),
            deliveryFailures: deliveryFailuresRaw.map(mapDeliveryFailureForStats),
            auditLogs,
        });
    }

    getPipelineInfo(): CnhPipelineInfo {
        return buildCnhPipelineInfo();
    }

    async getCommunicationHubs(authUserId: string, email: string, fullName?: string | null): Promise<CommunicationHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cnhCommunicationHubs.listByOrganization(context.organizationId)).map(mapCommunicationHubSummary); 
    }

    async createCommunicationHub(authUserId: string, email: string, input: CreateCommunicationHubInput, fullName?: string | null): Promise<CommunicationHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhCommunicationHubs.create(buildCommunicationHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create communicationHubs");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "communication_hub", "create", `CommunicationHub created`, created.id));
        return mapCommunicationHubSummary(created); 
    }

    async getNotificationChannels(authUserId: string, email: string, fullName?: string | null): Promise<NotificationChannelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhNotificationChannels.listByOrganization(context.organizationId)).map((r) => mapNotificationChannelSummary(r, maps)); 
    }

    async createNotificationChannel(authUserId: string, email: string, input: CreateNotificationChannelInput, fullName?: string | null): Promise<NotificationChannelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhNotificationChannels.create(buildNotificationChannelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create notificationChannels");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "notification_channel", "create", `NotificationChannel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapNotificationChannelSummary(created, maps); 
    }

    async getNotificationQueue(authUserId: string, email: string, fullName?: string | null): Promise<NotificationQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhNotificationQueue.listByOrganization(context.organizationId)).map((r) => mapNotificationQueueSummary(r, maps)); 
    }

    async createNotificationQueue(authUserId: string, email: string, input: CreateNotificationQueueInput, fullName?: string | null): Promise<NotificationQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhNotificationQueue.create(buildNotificationQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create notificationQueue");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "notification_queue", "create", `NotificationQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapNotificationQueueSummary(created, maps); 
    }

    async getRetryPolicies(authUserId: string, email: string, fullName?: string | null): Promise<RetryPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhRetryPolicies.listByOrganization(context.organizationId)).map((r) => mapRetryPolicySummary(r, maps)); 
    }

    async createRetryPolicy(authUserId: string, email: string, input: CreateRetryPolicyInput, fullName?: string | null): Promise<RetryPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhRetryPolicies.create(buildRetryPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retryPolicies");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "retry_policy", "create", `RetryPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRetryPolicySummary(created, maps); 
    }

    async getMessageTemplates(authUserId: string, email: string, fullName?: string | null): Promise<MessageTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhMessageTemplates.listByOrganization(context.organizationId)).map((r) => mapMessageTemplateSummary(r, maps)); 
    }

    async createMessageTemplate(authUserId: string, email: string, input: CreateMessageTemplateInput, fullName?: string | null): Promise<MessageTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhMessageTemplates.create(buildMessageTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create messageTemplates");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "message_template", "create", `MessageTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMessageTemplateSummary(created, maps); 
    }

    async getTemplateVariables(authUserId: string, email: string, fullName?: string | null): Promise<TemplateVariableSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhTemplateVariables.listByOrganization(context.organizationId)).map((r) => mapTemplateVariableSummary(r, maps)); 
    }

    async createTemplateVariable(authUserId: string, email: string, input: CreateTemplateVariableInput, fullName?: string | null): Promise<TemplateVariableSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhTemplateVariables.create(buildTemplateVariablePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create templateVariables");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "template_variable", "create", `TemplateVariable created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemplateVariableSummary(created, maps); 
    }

    async getTemplateLocalizations(authUserId: string, email: string, fullName?: string | null): Promise<TemplateLocalizationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhTemplateLocalizations.listByOrganization(context.organizationId)).map((r) => mapTemplateLocalizationSummary(r, maps)); 
    }

    async createTemplateLocalization(authUserId: string, email: string, input: CreateTemplateLocalizationInput, fullName?: string | null): Promise<TemplateLocalizationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhTemplateLocalizations.create(buildTemplateLocalizationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create templateLocalizations");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "template_localization", "create", `TemplateLocalization created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemplateLocalizationSummary(created, maps); 
    }

    async getTemplateApprovals(authUserId: string, email: string, fullName?: string | null): Promise<TemplateApprovalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhTemplateApprovals.listByOrganization(context.organizationId)).map((r) => mapTemplateApprovalSummary(r, maps)); 
    }

    async createTemplateApproval(authUserId: string, email: string, input: CreateTemplateApprovalInput, fullName?: string | null): Promise<TemplateApprovalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhTemplateApprovals.create(buildTemplateApprovalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create templateApprovals");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "template_approval", "create", `TemplateApproval created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemplateApprovalSummary(created, maps); 
    }

    async getAutomationRules(authUserId: string, email: string, fullName?: string | null): Promise<AutomationRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAutomationRules.listByOrganization(context.organizationId)).map((r) => mapAutomationRuleSummary(r, maps)); 
    }

    async createAutomationRule(authUserId: string, email: string, input: CreateAutomationRuleInput, fullName?: string | null): Promise<AutomationRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAutomationRules.create(buildAutomationRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automationRules");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "automation_rule", "create", `AutomationRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationRuleSummary(created, maps); 
    }

    async getAutomationTriggers(authUserId: string, email: string, fullName?: string | null): Promise<AutomationTriggerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAutomationTriggers.listByOrganization(context.organizationId)).map((r) => mapAutomationTriggerSummary(r, maps)); 
    }

    async createAutomationTrigger(authUserId: string, email: string, input: CreateAutomationTriggerInput, fullName?: string | null): Promise<AutomationTriggerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAutomationTriggers.create(buildAutomationTriggerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automationTriggers");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "automation_trigger", "create", `AutomationTrigger created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationTriggerSummary(created, maps); 
    }

    async getAutomationSchedules(authUserId: string, email: string, fullName?: string | null): Promise<AutomationScheduleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAutomationSchedules.listByOrganization(context.organizationId)).map((r) => mapAutomationScheduleSummary(r, maps)); 
    }

    async createAutomationSchedule(authUserId: string, email: string, input: CreateAutomationScheduleInput, fullName?: string | null): Promise<AutomationScheduleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAutomationSchedules.create(buildAutomationSchedulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automationSchedules");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "automation_schedule", "create", `AutomationSchedule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationScheduleSummary(created, maps); 
    }

    async getAutomationExecutions(authUserId: string, email: string, fullName?: string | null): Promise<AutomationExecutionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAutomationExecutions.listByOrganization(context.organizationId)).map((r) => mapAutomationExecutionSummary(r, maps)); 
    }

    async createAutomationExecution(authUserId: string, email: string, input: CreateAutomationExecutionInput, fullName?: string | null): Promise<AutomationExecutionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAutomationExecutions.create(buildAutomationExecutionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automationExecutions");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "automation_execution", "create", `AutomationExecution created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationExecutionSummary(created, maps); 
    }

    async getPreferenceProfiles(authUserId: string, email: string, fullName?: string | null): Promise<PreferenceProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhPreferenceProfiles.listByOrganization(context.organizationId)).map((r) => mapPreferenceProfileSummary(r, maps)); 
    }

    async createPreferenceProfile(authUserId: string, email: string, input: CreatePreferenceProfileInput, fullName?: string | null): Promise<PreferenceProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhPreferenceProfiles.create(buildPreferenceProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create preferenceProfiles");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "preference_profile", "create", `PreferenceProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPreferenceProfileSummary(created, maps); 
    }

    async getChannelPreferences(authUserId: string, email: string, fullName?: string | null): Promise<ChannelPreferenceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhChannelPreferences.listByOrganization(context.organizationId)).map((r) => mapChannelPreferenceSummary(r, maps)); 
    }

    async createChannelPreference(authUserId: string, email: string, input: CreateChannelPreferenceInput, fullName?: string | null): Promise<ChannelPreferenceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhChannelPreferences.create(buildChannelPreferencePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create channelPreferences");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "channel_preference", "create", `ChannelPreference created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapChannelPreferenceSummary(created, maps); 
    }

    async getOptInRecords(authUserId: string, email: string, fullName?: string | null): Promise<OptInRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhOptInRecords.listByOrganization(context.organizationId)).map((r) => mapOptInRecordSummary(r, maps)); 
    }

    async createOptInRecord(authUserId: string, email: string, input: CreateOptInRecordInput, fullName?: string | null): Promise<OptInRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhOptInRecords.create(buildOptInRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create optInRecords");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "opt_in_record", "create", `OptInRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOptInRecordSummary(created, maps); 
    }

    async getOptOutRecords(authUserId: string, email: string, fullName?: string | null): Promise<OptOutRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhOptOutRecords.listByOrganization(context.organizationId)).map((r) => mapOptOutRecordSummary(r, maps)); 
    }

    async createOptOutRecord(authUserId: string, email: string, input: CreateOptOutRecordInput, fullName?: string | null): Promise<OptOutRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhOptOutRecords.create(buildOptOutRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create optOutRecords");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "opt_out_record", "create", `OptOutRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOptOutRecordSummary(created, maps); 
    }

    async getAnnouncements(authUserId: string, email: string, fullName?: string | null): Promise<AnnouncementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAnnouncements.listByOrganization(context.organizationId)).map((r) => mapAnnouncementSummary(r, maps)); 
    }

    async createAnnouncement(authUserId: string, email: string, input: CreateAnnouncementInput, fullName?: string | null): Promise<AnnouncementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAnnouncements.create(buildAnnouncementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create announcements");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "announcement", "create", `Announcement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAnnouncementSummary(created, maps); 
    }

    async getAnnouncementSchedules(authUserId: string, email: string, fullName?: string | null): Promise<AnnouncementScheduleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAnnouncementSchedules.listByOrganization(context.organizationId)).map((r) => mapAnnouncementScheduleSummary(r, maps)); 
    }

    async createAnnouncementSchedule(authUserId: string, email: string, input: CreateAnnouncementScheduleInput, fullName?: string | null): Promise<AnnouncementScheduleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAnnouncementSchedules.create(buildAnnouncementSchedulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create announcementSchedules");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "announcement_schedule", "create", `AnnouncementSchedule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAnnouncementScheduleSummary(created, maps); 
    }

    async getPinnedAnnouncements(authUserId: string, email: string, fullName?: string | null): Promise<PinnedAnnouncementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhPinnedAnnouncements.listByOrganization(context.organizationId)).map((r) => mapPinnedAnnouncementSummary(r, maps)); 
    }

    async createPinnedAnnouncement(authUserId: string, email: string, input: CreatePinnedAnnouncementInput, fullName?: string | null): Promise<PinnedAnnouncementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhPinnedAnnouncements.create(buildPinnedAnnouncementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pinnedAnnouncements");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "pinned_announcement", "create", `PinnedAnnouncement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPinnedAnnouncementSummary(created, maps); 
    }

    async getAnnouncementAcknowledgements(authUserId: string, email: string, fullName?: string | null): Promise<AnnouncementAcknowledgementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAnnouncementAcknowledgements.listByOrganization(context.organizationId)).map((r) => mapAnnouncementAcknowledgementSummary(r, maps)); 
    }

    async createAnnouncementAcknowledgement(authUserId: string, email: string, input: CreateAnnouncementAcknowledgementInput, fullName?: string | null): Promise<AnnouncementAcknowledgementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAnnouncementAcknowledgements.create(buildAnnouncementAcknowledgementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create announcementAcknowledgements");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "announcement_acknowledgement", "create", `AnnouncementAcknowledgement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAnnouncementAcknowledgementSummary(created, maps); 
    }

    async getCampaigns(authUserId: string, email: string, fullName?: string | null): Promise<CampaignSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhCampaigns.listByOrganization(context.organizationId)).map((r) => mapCampaignSummary(r, maps)); 
    }

    async createCampaign(authUserId: string, email: string, input: CreateCampaignInput, fullName?: string | null): Promise<CampaignSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhCampaigns.create(buildCampaignPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campaigns");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "campaign", "create", `Campaign created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampaignSummary(created, maps); 
    }

    async getAudienceSegments(authUserId: string, email: string, fullName?: string | null): Promise<AudienceSegmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhAudienceSegments.listByOrganization(context.organizationId)).map((r) => mapAudienceSegmentSummary(r, maps)); 
    }

    async createAudienceSegment(authUserId: string, email: string, input: CreateAudienceSegmentInput, fullName?: string | null): Promise<AudienceSegmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhAudienceSegments.create(buildAudienceSegmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create audienceSegments");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "audience_segment", "create", `AudienceSegment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAudienceSegmentSummary(created, maps); 
    }

    async getCampaignDeliveries(authUserId: string, email: string, fullName?: string | null): Promise<CampaignDeliverySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhCampaignDeliveries.listByOrganization(context.organizationId)).map((r) => mapCampaignDeliverySummary(r, maps)); 
    }

    async createCampaignDelivery(authUserId: string, email: string, input: CreateCampaignDeliveryInput, fullName?: string | null): Promise<CampaignDeliverySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhCampaignDeliveries.create(buildCampaignDeliveryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campaignDeliveries");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "campaign_delivery", "create", `CampaignDelivery created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampaignDeliverySummary(created, maps); 
    }

    async getCampaignMetrics(authUserId: string, email: string, fullName?: string | null): Promise<CampaignMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhCampaignMetrics.listByOrganization(context.organizationId)).map((r) => mapCampaignMetricSummary(r, maps)); 
    }

    async createCampaignMetric(authUserId: string, email: string, input: CreateCampaignMetricInput, fullName?: string | null): Promise<CampaignMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhCampaignMetrics.create(buildCampaignMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campaignMetrics");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "campaign_metric", "create", `CampaignMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampaignMetricSummary(created, maps); 
    }

    async getDeliveryAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhDeliveryAnalytics.listByOrganization(context.organizationId)).map((r) => mapDeliveryAnalyticsSummary(r, maps)); 
    }

    async createDeliveryAnalytics(authUserId: string, email: string, input: CreateDeliveryAnalyticsInput, fullName?: string | null): Promise<DeliveryAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhDeliveryAnalytics.create(buildDeliveryAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryAnalytics");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "delivery_analytic", "create", `DeliveryAnalytic created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeliveryAnalyticsSummary(created, maps); 
    }

    async getEngagementMetrics(authUserId: string, email: string, fullName?: string | null): Promise<EngagementMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhEngagementMetrics.listByOrganization(context.organizationId)).map((r) => mapEngagementMetricSummary(r, maps)); 
    }

    async createEngagementMetric(authUserId: string, email: string, input: CreateEngagementMetricInput, fullName?: string | null): Promise<EngagementMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhEngagementMetrics.create(buildEngagementMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create engagementMetrics");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "engagement_metric", "create", `EngagementMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEngagementMetricSummary(created, maps); 
    }

    async getBounceRecords(authUserId: string, email: string, fullName?: string | null): Promise<BounceRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhBounceRecords.listByOrganization(context.organizationId)).map((r) => mapBounceRecordSummary(r, maps)); 
    }

    async createBounceRecord(authUserId: string, email: string, input: CreateBounceRecordInput, fullName?: string | null): Promise<BounceRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhBounceRecords.create(buildBounceRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create bounceRecords");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "bounce_record", "create", `BounceRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBounceRecordSummary(created, maps); 
    }

    async getChannelPerformance(authUserId: string, email: string, fullName?: string | null): Promise<ChannelPerformanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhChannelPerformance.listByOrganization(context.organizationId)).map((r) => mapChannelPerformanceSummary(r, maps)); 
    }

    async createChannelPerformance(authUserId: string, email: string, input: CreateChannelPerformanceInput, fullName?: string | null): Promise<ChannelPerformanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhChannelPerformance.create(buildChannelPerformancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create channelPerformance");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "channel_performance", "create", `ChannelPerformance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapChannelPerformanceSummary(created, maps); 
    }

    async getCommunicationMetrics(authUserId: string, email: string, fullName?: string | null): Promise<CommunicationMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cnhCommunicationMetrics.listByOrganization(context.organizationId)).map(mapCommunicationMetricSummary); 
    }

    async createCommunicationMetric(authUserId: string, email: string, input: CreateCommunicationMetricInput, fullName?: string | null): Promise<CommunicationMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhCommunicationMetrics.create(buildCommunicationMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create communicationMetrics");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "communication_metric", "create", `CommunicationMetric created`, created.id));
        return mapCommunicationMetricSummary(created); 
    }

    async getSystemHealth(authUserId: string, email: string, fullName?: string | null): Promise<SystemHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cnhSystemHealth.listByOrganization(context.organizationId)).map(mapSystemHealthSummary); 
    }

    async createSystemHealth(authUserId: string, email: string, input: CreateSystemHealthInput, fullName?: string | null): Promise<SystemHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhSystemHealth.create(buildSystemHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create systemHealth");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "system_health", "create", `SystemHealth created`, created.id));
        return mapSystemHealthSummary(created); 
    }

    async getDeliveryFailures(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cnhDeliveryFailures.listByOrganization(context.organizationId)).map((r) => mapDeliveryFailureSummary(r, maps)); 
    }

    async createDeliveryFailure(authUserId: string, email: string, input: CreateDeliveryFailureInput, fullName?: string | null): Promise<DeliveryFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cnhDeliveryFailures.create(buildDeliveryFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryFailures");
        await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "delivery_failure", "create", `DeliveryFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeliveryFailureSummary(created, maps); 
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cnhAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getCommunicationHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cnhCommunicationHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkSendNotification(authUserId: string, email: string, input: CnhSdkSendNotificationInput, fullName?: string | null): Promise<CnhSdkSendNotificationResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "send_notification", moduleSource: "communication_hub", inputPayload: { ...input } });
        const optOuts = await this.getOptOutRecords(authUserId, email, fullName);
        const channelType = input.channelType ?? "email";
        if (isBlockedByOptOut(optOuts, input.recipient, channelType)) {
            const blocked = await this.createNotificationQueue(authUserId, email, { communicationHubId: input.communicationHubId, queueKey: input.queueKey, recipient: input.recipient, channelType, deliveryStatus: "blocked-opt-out" }, fullName);
            const context = await this.getContext(authUserId, email, fullName);
            if (context) {
                await databaseService.cnhAuditLogs.create(buildCnhAuditPayload(context.organizationId, "notification_queue", "block", `Notification to ${input.recipient} blocked by active opt-out`, blocked.id));
            }
            return { queueId: blocked.id, queueKey: blocked.queueKey, deliveryStatus: blocked.deliveryStatus };
        }
        const created = await this.createNotificationQueue(authUserId, email, { communicationHubId: input.communicationHubId, queueKey: input.queueKey, recipient: input.recipient, deliveryStatus: "queued" }, fullName);
        return { queueId: created.id, queueKey: created.queueKey, deliveryStatus: created.status };
    }

    async sdkLaunchCampaign(authUserId: string, email: string, input: CnhSdkLaunchCampaignInput, fullName?: string | null): Promise<CnhSdkLaunchCampaignResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.campaignName, limit: 3 });
        const created = await this.createCampaign(authUserId, email, { communicationHubId: input.communicationHubId, campaignKey: input.campaignKey, campaignName: input.campaignName }, fullName);
        return { campaignId: created.id, campaignKey: created.campaignKey, status: created.status };
    }

    async sdkUpdatePreferences(authUserId: string, email: string, input: CnhSdkUpdatePreferencesInput, fullName?: string | null): Promise<CnhSdkUpdatePreferencesResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "update_preferences", moduleSource: "communication_hub", inputPayload: { ...input } });
        const created = await this.createPreferenceProfile(authUserId, email, { communicationHubId: input.communicationHubId, profileKey: input.profileKey, customerEmail: input.customerEmail }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }
}

export const communicationHubService = new CommunicationHubService();
