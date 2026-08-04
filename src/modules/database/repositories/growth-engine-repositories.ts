import type {
    DbAageGrowthHub,
    DbAageBrandProfile,
    DbAageBrandVoice,
    DbAageCoreMessaging,
    DbAageBrandGuideline,
    DbAageLogoLibrary,
    DbAageColorSystem,
    DbAageYoutubeTemplate,
    DbAageSocialTemplate,
    DbAageBlogTemplate,
    DbAageWebsiteArticleTemplate,
    DbAageEmailCampaignTemplate,
    DbAageCaseStudyTemplate,
    DbAageImageAsset,
    DbAageVideoAsset,
    DbAageIconAsset,
    DbAageVoiceProfile,
    DbAageMusicAsset,
    DbAageThumbnailTemplate,
    DbAageIdeaGenerator,
    DbAageScriptGenerator,
    DbAageCaptionGenerator,
    DbAageBlogGenerator,
    DbAageSeoAssistant,
    DbAageCtaGenerator,
    DbAageGrowthMetric,
    DbAageGrowthHealth,
    DbAageContentCalendar,
    DbAageDraftQueue,
    DbAageApprovalQueue,
    DbAagePublishingQueue,
    DbAageAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAageRepository<T> extends BaseRepository<T> {
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

export class AageGrowthHubRepository extends OrgAageRepository<DbAageGrowthHub> { protected table = "aage_growth_hubs"; }
export class AageBrandProfileRepository extends OrgAageRepository<DbAageBrandProfile> { protected table = "aage_brand_profiles"; }
export class AageBrandVoiceRepository extends OrgAageRepository<DbAageBrandVoice> { protected table = "aage_brand_voice"; }
export class AageCoreMessagingRepository extends OrgAageRepository<DbAageCoreMessaging> { protected table = "aage_core_messaging"; }
export class AageBrandGuidelineRepository extends OrgAageRepository<DbAageBrandGuideline> { protected table = "aage_brand_guidelines"; }
export class AageLogoLibraryRepository extends OrgAageRepository<DbAageLogoLibrary> { protected table = "aage_logo_library"; }
export class AageColorSystemRepository extends OrgAageRepository<DbAageColorSystem> { protected table = "aage_color_systems"; }
export class AageYoutubeTemplateRepository extends OrgAageRepository<DbAageYoutubeTemplate> { protected table = "aage_youtube_templates"; }
export class AageSocialTemplateRepository extends OrgAageRepository<DbAageSocialTemplate> { protected table = "aage_social_templates"; }
export class AageBlogTemplateRepository extends OrgAageRepository<DbAageBlogTemplate> { protected table = "aage_blog_templates"; }
export class AageWebsiteArticleTemplateRepository extends OrgAageRepository<DbAageWebsiteArticleTemplate> { protected table = "aage_website_article_templates"; }
export class AageEmailCampaignTemplateRepository extends OrgAageRepository<DbAageEmailCampaignTemplate> { protected table = "aage_email_campaign_templates"; }
export class AageCaseStudyTemplateRepository extends OrgAageRepository<DbAageCaseStudyTemplate> { protected table = "aage_case_study_templates"; }
export class AageImageAssetRepository extends OrgAageRepository<DbAageImageAsset> { protected table = "aage_image_assets"; }
export class AageVideoAssetRepository extends OrgAageRepository<DbAageVideoAsset> { protected table = "aage_video_assets"; }
export class AageIconAssetRepository extends OrgAageRepository<DbAageIconAsset> { protected table = "aage_icon_assets"; }
export class AageVoiceProfileRepository extends OrgAageRepository<DbAageVoiceProfile> { protected table = "aage_voice_profiles"; }
export class AageMusicAssetRepository extends OrgAageRepository<DbAageMusicAsset> { protected table = "aage_music_assets"; }
export class AageThumbnailTemplateRepository extends OrgAageRepository<DbAageThumbnailTemplate> { protected table = "aage_thumbnail_templates"; }
export class AageIdeaGeneratorRepository extends OrgAageRepository<DbAageIdeaGenerator> { protected table = "aage_idea_generators"; }
export class AageScriptGeneratorRepository extends OrgAageRepository<DbAageScriptGenerator> { protected table = "aage_script_generators"; }
export class AageCaptionGeneratorRepository extends OrgAageRepository<DbAageCaptionGenerator> { protected table = "aage_caption_generators"; }
export class AageBlogGeneratorRepository extends OrgAageRepository<DbAageBlogGenerator> { protected table = "aage_blog_generators"; }
export class AageSeoAssistantRepository extends OrgAageRepository<DbAageSeoAssistant> { protected table = "aage_seo_assistants"; }
export class AageCtaGeneratorRepository extends OrgAageRepository<DbAageCtaGenerator> { protected table = "aage_cta_generators"; }
export class AageGrowthMetricRepository extends OrgAageRepository<DbAageGrowthMetric> { protected table = "aage_growth_metrics"; }
export class AageGrowthHealthRepository extends OrgAageRepository<DbAageGrowthHealth> { protected table = "aage_growth_health"; }
export class AageContentCalendarRepository extends OrgAageRepository<DbAageContentCalendar> { protected table = "aage_content_calendar"; }
export class AageDraftQueueRepository extends OrgAageRepository<DbAageDraftQueue> { protected table = "aage_draft_queue"; }
export class AageApprovalQueueRepository extends OrgAageRepository<DbAageApprovalQueue> { protected table = "aage_approval_queue"; }
export class AagePublishingQueueRepository extends OrgAageRepository<DbAagePublishingQueue> { protected table = "aage_publishing_queue"; }
export class AageAuditLogRepository extends OrgAageRepository<DbAageAuditLog> { protected table = "aage_audit_logs"; }
