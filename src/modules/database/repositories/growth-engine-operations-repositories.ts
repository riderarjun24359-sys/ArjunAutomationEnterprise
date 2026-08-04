import type {
    DbAagoOperationsHub,
    DbAagoBrandKnowledgeBase,
    DbAagoBrandRulebook,
    DbAagoMessagingLibrary,
    DbAagoServiceLibrary,
    DbAagoIndustryLibrary,
    DbAagoFaqLibrary,
    DbAagoBrandApprovalRule,
    DbAagoVideoProject,
    DbAagoThumbnailManager,
    DbAagoVoiceoverManager,
    DbAagoCreativeAssetGenerator,
    DbAagoCampaignAssetBuilder,
    DbAagoCreativeWorkflow,
    DbAagoDistributionContentQueue,
    DbAagoDistributionPublishingQueue,
    DbAagoChannelManager,
    DbAagoApprovalCenter,
    DbAagoPublishingHistory,
    DbAagoDistributionAnalytics,
    DbAagoCampaignDashboard,
    DbAagoContentPerformance,
    DbAagoLeadAttribution,
    DbAagoGrowthKpi,
    DbAagoRoiDashboard,
    DbAagoRecommendationEngine,
    DbAagoCommandCenterMetric,
    DbAagoCommandCenterHealth,
    DbAagoMissionStatus,
    DbAagoExecutiveSummary,
    DbAagoOperationalFailure,
    DbAagoAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAagoRepository<T> extends BaseRepository<T> {
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

export class AagoOperationsHubRepository extends OrgAagoRepository<DbAagoOperationsHub> { protected table = "aago_operations_hubs"; }
export class AagoBrandKnowledgeBaseRepository extends OrgAagoRepository<DbAagoBrandKnowledgeBase> { protected table = "aago_brand_knowledge_base"; }
export class AagoBrandRulebookRepository extends OrgAagoRepository<DbAagoBrandRulebook> { protected table = "aago_brand_rulebook"; }
export class AagoMessagingLibraryRepository extends OrgAagoRepository<DbAagoMessagingLibrary> { protected table = "aago_messaging_library"; }
export class AagoServiceLibraryRepository extends OrgAagoRepository<DbAagoServiceLibrary> { protected table = "aago_service_library"; }
export class AagoIndustryLibraryRepository extends OrgAagoRepository<DbAagoIndustryLibrary> { protected table = "aago_industry_library"; }
export class AagoFaqLibraryRepository extends OrgAagoRepository<DbAagoFaqLibrary> { protected table = "aago_faq_library"; }
export class AagoBrandApprovalRuleRepository extends OrgAagoRepository<DbAagoBrandApprovalRule> { protected table = "aago_brand_approval_rules"; }
export class AagoVideoProjectRepository extends OrgAagoRepository<DbAagoVideoProject> { protected table = "aago_video_projects"; }
export class AagoThumbnailManagerRepository extends OrgAagoRepository<DbAagoThumbnailManager> { protected table = "aago_thumbnail_manager"; }
export class AagoVoiceoverManagerRepository extends OrgAagoRepository<DbAagoVoiceoverManager> { protected table = "aago_voiceover_manager"; }
export class AagoCreativeAssetGeneratorRepository extends OrgAagoRepository<DbAagoCreativeAssetGenerator> { protected table = "aago_creative_asset_generator"; }
export class AagoCampaignAssetBuilderRepository extends OrgAagoRepository<DbAagoCampaignAssetBuilder> { protected table = "aago_campaign_asset_builder"; }
export class AagoCreativeWorkflowRepository extends OrgAagoRepository<DbAagoCreativeWorkflow> { protected table = "aago_creative_workflows"; }
export class AagoDistributionContentQueueRepository extends OrgAagoRepository<DbAagoDistributionContentQueue> { protected table = "aago_distribution_content_queue"; }
export class AagoDistributionPublishingQueueRepository extends OrgAagoRepository<DbAagoDistributionPublishingQueue> { protected table = "aago_distribution_publishing_queue"; }
export class AagoChannelManagerRepository extends OrgAagoRepository<DbAagoChannelManager> { protected table = "aago_channel_manager"; }
export class AagoApprovalCenterRepository extends OrgAagoRepository<DbAagoApprovalCenter> { protected table = "aago_approval_center"; }
export class AagoPublishingHistoryRepository extends OrgAagoRepository<DbAagoPublishingHistory> { protected table = "aago_publishing_history"; }
export class AagoDistributionAnalyticsRepository extends OrgAagoRepository<DbAagoDistributionAnalytics> { protected table = "aago_distribution_analytics"; }
export class AagoCampaignDashboardRepository extends OrgAagoRepository<DbAagoCampaignDashboard> { protected table = "aago_campaign_dashboard"; }
export class AagoContentPerformanceRepository extends OrgAagoRepository<DbAagoContentPerformance> { protected table = "aago_content_performance"; }
export class AagoLeadAttributionRepository extends OrgAagoRepository<DbAagoLeadAttribution> { protected table = "aago_lead_attribution"; }
export class AagoGrowthKpiRepository extends OrgAagoRepository<DbAagoGrowthKpi> { protected table = "aago_growth_kpis"; }
export class AagoRoiDashboardRepository extends OrgAagoRepository<DbAagoRoiDashboard> { protected table = "aago_roi_dashboard"; }
export class AagoRecommendationEngineRepository extends OrgAagoRepository<DbAagoRecommendationEngine> { protected table = "aago_recommendation_engine"; }
export class AagoCommandCenterMetricRepository extends OrgAagoRepository<DbAagoCommandCenterMetric> { protected table = "aago_command_center_metrics"; }
export class AagoCommandCenterHealthRepository extends OrgAagoRepository<DbAagoCommandCenterHealth> { protected table = "aago_command_center_health"; }
export class AagoMissionStatusRepository extends OrgAagoRepository<DbAagoMissionStatus> { protected table = "aago_mission_status"; }
export class AagoExecutiveSummaryRepository extends OrgAagoRepository<DbAagoExecutiveSummary> { protected table = "aago_executive_summaries"; }
export class AagoOperationalFailureRepository extends OrgAagoRepository<DbAagoOperationalFailure> { protected table = "aago_operational_failures"; }
export class AagoAuditLogRepository extends OrgAagoRepository<DbAagoAuditLog> { protected table = "aago_audit_logs"; }
