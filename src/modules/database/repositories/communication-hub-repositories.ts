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
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgCnhRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class CnhCommunicationHubRepository extends OrgCnhRepository<DbCnhCommunicationHub> { protected table = "cnh_communication_hubs"; }
export class CnhNotificationChannelRepository extends OrgCnhRepository<DbCnhNotificationChannel> { protected table = "cnh_notification_channels"; }
export class CnhNotificationQueueRepository extends OrgCnhRepository<DbCnhNotificationQueue> { protected table = "cnh_notification_queue"; }
export class CnhRetryPolicyRepository extends OrgCnhRepository<DbCnhRetryPolicy> { protected table = "cnh_retry_policies"; }
export class CnhMessageTemplateRepository extends OrgCnhRepository<DbCnhMessageTemplate> { protected table = "cnh_message_templates"; }
export class CnhTemplateVariableRepository extends OrgCnhRepository<DbCnhTemplateVariable> { protected table = "cnh_template_variables"; }
export class CnhTemplateLocalizationRepository extends OrgCnhRepository<DbCnhTemplateLocalization> { protected table = "cnh_template_localizations"; }
export class CnhTemplateApprovalRepository extends OrgCnhRepository<DbCnhTemplateApproval> { protected table = "cnh_template_approvals"; }
export class CnhAutomationRuleRepository extends OrgCnhRepository<DbCnhAutomationRule> { protected table = "cnh_automation_rules"; }
export class CnhAutomationTriggerRepository extends OrgCnhRepository<DbCnhAutomationTrigger> { protected table = "cnh_automation_triggers"; }
export class CnhAutomationScheduleRepository extends OrgCnhRepository<DbCnhAutomationSchedule> { protected table = "cnh_automation_schedules"; }
export class CnhAutomationExecutionRepository extends OrgCnhRepository<DbCnhAutomationExecution> { protected table = "cnh_automation_executions"; }
export class CnhPreferenceProfileRepository extends OrgCnhRepository<DbCnhPreferenceProfile> { protected table = "cnh_preference_profiles"; }
export class CnhChannelPreferenceRepository extends OrgCnhRepository<DbCnhChannelPreference> { protected table = "cnh_channel_preferences"; }
export class CnhOptInRecordRepository extends OrgCnhRepository<DbCnhOptInRecord> { protected table = "cnh_opt_in_records"; }
export class CnhOptOutRecordRepository extends OrgCnhRepository<DbCnhOptOutRecord> { protected table = "cnh_opt_out_records"; }
export class CnhAnnouncementRepository extends OrgCnhRepository<DbCnhAnnouncement> { protected table = "cnh_announcements"; }
export class CnhAnnouncementScheduleRepository extends OrgCnhRepository<DbCnhAnnouncementSchedule> { protected table = "cnh_announcement_schedules"; }
export class CnhPinnedAnnouncementRepository extends OrgCnhRepository<DbCnhPinnedAnnouncement> { protected table = "cnh_pinned_announcements"; }
export class CnhAnnouncementAcknowledgementRepository extends OrgCnhRepository<DbCnhAnnouncementAcknowledgement> { protected table = "cnh_announcement_acknowledgements"; }
export class CnhCampaignRepository extends OrgCnhRepository<DbCnhCampaign> { protected table = "cnh_campaigns"; }
export class CnhAudienceSegmentRepository extends OrgCnhRepository<DbCnhAudienceSegment> { protected table = "cnh_audience_segments"; }
export class CnhCampaignDeliveryRepository extends OrgCnhRepository<DbCnhCampaignDelivery> { protected table = "cnh_campaign_deliveries"; }
export class CnhCampaignMetricRepository extends OrgCnhRepository<DbCnhCampaignMetric> { protected table = "cnh_campaign_metrics"; }
export class CnhDeliveryAnalyticsRepository extends OrgCnhRepository<DbCnhDeliveryAnalytics> { protected table = "cnh_delivery_analytics"; }
export class CnhEngagementMetricRepository extends OrgCnhRepository<DbCnhEngagementMetric> { protected table = "cnh_engagement_metrics"; }
export class CnhBounceRecordRepository extends OrgCnhRepository<DbCnhBounceRecord> { protected table = "cnh_bounce_records"; }
export class CnhChannelPerformanceRepository extends OrgCnhRepository<DbCnhChannelPerformance> { protected table = "cnh_channel_performance"; }
export class CnhCommunicationMetricRepository extends OrgCnhRepository<DbCnhCommunicationMetric> { protected table = "cnh_communication_metrics"; }
export class CnhSystemHealthRepository extends OrgCnhRepository<DbCnhSystemHealth> { protected table = "cnh_system_health"; }
export class CnhDeliveryFailureRepository extends OrgCnhRepository<DbCnhDeliveryFailure> { protected table = "cnh_delivery_failures"; }
export class CnhAuditLogRepository extends OrgCnhRepository<DbCnhAuditLog> { protected table = "cnh_audit_logs"; }
