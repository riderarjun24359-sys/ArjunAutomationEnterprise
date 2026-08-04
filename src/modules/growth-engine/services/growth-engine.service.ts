import {
    buildGrowthHubLookupMaps,
    buildAageAuditPayload,
    buildAageDashboardStats,
    buildAagePipelineInfo,
    mapAuditEntry,
    buildGrowthHubPayload,
    mapGrowthHubSummary,
    buildBrandProfilePayload,
    mapBrandProfileSummary,
    buildBrandVoicePayload,
    mapBrandVoiceSummary,
    buildCoreMessagingPayload,
    mapCoreMessagingSummary,
    buildBrandGuidelinePayload,
    mapBrandGuidelineSummary,
    buildLogoLibraryPayload,
    mapLogoLibrarySummary,
    buildColorSystemPayload,
    mapColorSystemSummary,
    buildYoutubeTemplatePayload,
    mapYoutubeTemplateSummary,
    buildSocialTemplatePayload,
    mapSocialTemplateSummary,
    buildBlogTemplatePayload,
    mapBlogTemplateSummary,
    buildWebsiteArticleTemplatePayload,
    mapWebsiteArticleTemplateSummary,
    buildEmailCampaignTemplatePayload,
    mapEmailCampaignTemplateSummary,
    buildCaseStudyTemplatePayload,
    mapCaseStudyTemplateSummary,
    buildImageAssetPayload,
    mapImageAssetSummary,
    buildVideoAssetPayload,
    mapVideoAssetSummary,
    buildIconAssetPayload,
    mapIconAssetSummary,
    buildVoiceProfilePayload,
    mapVoiceProfileSummary,
    buildMusicAssetPayload,
    mapMusicAssetSummary,
    buildThumbnailTemplatePayload,
    mapThumbnailTemplateSummary,
    buildIdeaGeneratorPayload,
    mapIdeaGeneratorSummary,
    buildScriptGeneratorPayload,
    mapScriptGeneratorSummary,
    buildCaptionGeneratorPayload,
    mapCaptionGeneratorSummary,
    buildBlogGeneratorPayload,
    mapBlogGeneratorSummary,
    buildSeoAssistantPayload,
    mapSeoAssistantSummary,
    buildCtaGeneratorPayload,
    mapCtaGeneratorSummary,
    buildGrowthMetricPayload,
    mapGrowthMetricSummary,
    buildGrowthHealthPayload,
    mapGrowthHealthSummary,
    buildContentCalendarPayload,
    mapContentCalendarSummary,
    buildDraftQueuePayload,
    mapDraftQueueSummary,
    buildApprovalQueuePayload,
    mapApprovalQueueSummary,
    buildPublishingQueuePayload,
    mapPublishingQueueSummary,
    mapBrandProfileForStats,
    mapYoutubeTemplateForStats,
    mapImageAssetForStats,
    mapIdeaGeneratorForStats,
    mapContentCalendarForStats,
    mapGrowthMetricForStats,
    mapGrowthHealthForStats,
    mapPublishingQueueForStats,
} from "@/src/modules/database/lib/growth-engine-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { createEnterpriseGovernancePlatformClient } from "@/src/modules/enterprise-governance-platform/sdk";
import { createEnterpriseIntelligencePlatformClient } from "@/src/modules/enterprise-intelligence-platform/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    GrowthHubSummary,
    CreateGrowthHubInput,
    BrandProfileSummary,
    CreateBrandProfileInput,
    BrandVoiceSummary,
    CreateBrandVoiceInput,
    CoreMessagingSummary,
    CreateCoreMessagingInput,
    BrandGuidelineSummary,
    CreateBrandGuidelineInput,
    LogoLibrarySummary,
    CreateLogoLibraryInput,
    ColorSystemSummary,
    CreateColorSystemInput,
    YoutubeTemplateSummary,
    CreateYoutubeTemplateInput,
    SocialTemplateSummary,
    CreateSocialTemplateInput,
    BlogTemplateSummary,
    CreateBlogTemplateInput,
    WebsiteArticleTemplateSummary,
    CreateWebsiteArticleTemplateInput,
    EmailCampaignTemplateSummary,
    CreateEmailCampaignTemplateInput,
    CaseStudyTemplateSummary,
    CreateCaseStudyTemplateInput,
    ImageAssetSummary,
    CreateImageAssetInput,
    VideoAssetSummary,
    CreateVideoAssetInput,
    IconAssetSummary,
    CreateIconAssetInput,
    VoiceProfileSummary,
    CreateVoiceProfileInput,
    MusicAssetSummary,
    CreateMusicAssetInput,
    ThumbnailTemplateSummary,
    CreateThumbnailTemplateInput,
    IdeaGeneratorSummary,
    CreateIdeaGeneratorInput,
    ScriptGeneratorSummary,
    CreateScriptGeneratorInput,
    CaptionGeneratorSummary,
    CreateCaptionGeneratorInput,
    BlogGeneratorSummary,
    CreateBlogGeneratorInput,
    SeoAssistantSummary,
    CreateSeoAssistantInput,
    CtaGeneratorSummary,
    CreateCtaGeneratorInput,
    GrowthMetricSummary,
    CreateGrowthMetricInput,
    GrowthHealthSummary,
    CreateGrowthHealthInput,
    ContentCalendarSummary,
    CreateContentCalendarInput,
    DraftQueueSummary,
    CreateDraftQueueInput,
    ApprovalQueueSummary,
    CreateApprovalQueueInput,
    PublishingQueueSummary,
    CreatePublishingQueueInput,
    AuditEntry,
    AageDashboardStats,
    AagePipelineInfo,
    AageSdkRunBrandServiceInput,
    AageSdkRunBrandServiceResult,
    AageSdkRunContentFoundationServiceInput,
    AageSdkRunContentFoundationServiceResult,
    AageSdkRunMediaFoundationServiceInput,
    AageSdkRunMediaFoundationServiceResult,
    AageSdkRunContentEngineServiceInput,
    AageSdkRunContentEngineServiceResult,
    AageSdkRunFounderDashboardServiceInput,
    AageSdkRunFounderDashboardServiceResult,
} from "@/src/modules/growth-engine/types";

export class GrowthEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const growthHubs = await databaseService.aageGrowthHubs.listByOrganization(organizationId);
        return buildGrowthHubLookupMaps(growthHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AageDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildAageDashboardStats({ growthHubs: [], brandProfiles: [], youtubeTemplates: [], imageAssets: [], ideaGenerators: [], contentCalendars: [], growthMetrics: [], growthHealth: [], publishingQueues: [], auditLogs: [] });
        const [growthHubs, brandProfilesRaw, youtubeTemplatesRaw, imageAssetsRaw, ideaGeneratorsRaw, contentCalendarsRaw, growthMetricsRaw, growthHealthRaw, publishingQueuesRaw, auditLogs] = await Promise.all([
            this.getGrowthHubs(authUserId, email, fullName),
            databaseService.aageBrandProfiles.listByOrganization(context.organizationId),
            databaseService.aageYoutubeTemplates.listByOrganization(context.organizationId),
            databaseService.aageImageAssets.listByOrganization(context.organizationId),
            databaseService.aageIdeaGenerators.listByOrganization(context.organizationId),
            databaseService.aageContentCalendar.listByOrganization(context.organizationId),
            databaseService.aageGrowthMetrics.listByOrganization(context.organizationId),
            databaseService.aageGrowthHealth.listByOrganization(context.organizationId),
            databaseService.aagePublishingQueue.listByOrganization(context.organizationId),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildAageDashboardStats({
            growthHubs,
            brandProfiles: brandProfilesRaw.map(mapBrandProfileForStats),
            youtubeTemplates: youtubeTemplatesRaw.map(mapYoutubeTemplateForStats),
            imageAssets: imageAssetsRaw.map(mapImageAssetForStats),
            ideaGenerators: ideaGeneratorsRaw.map(mapIdeaGeneratorForStats),
            contentCalendars: contentCalendarsRaw.map(mapContentCalendarForStats),
            growthMetrics: growthMetricsRaw.map(mapGrowthMetricForStats),
            growthHealth: growthHealthRaw.map(mapGrowthHealthForStats),
            publishingQueues: publishingQueuesRaw.map(mapPublishingQueueForStats),
            auditLogs,
        });
    }

    getPipelineInfo(): AagePipelineInfo {
        return buildAagePipelineInfo();
    }

    async getGrowthHubs(authUserId: string, email: string, fullName?: string | null): Promise<GrowthHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageGrowthHubs.listByOrganization(context.organizationId)).map((r) => mapGrowthHubSummary(r));
    }

    async createGrowthHub(authUserId: string, email: string, input: CreateGrowthHubInput, fullName?: string | null): Promise<GrowthHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageGrowthHubs.create(buildGrowthHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthHubs");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "growth_hubs", "create", `GrowthHub created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGrowthHubSummary(created);
    }

    async getBrandProfiles(authUserId: string, email: string, fullName?: string | null): Promise<BrandProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageBrandProfiles.listByOrganization(context.organizationId)).map((r) => mapBrandProfileSummary(r, maps));
    }

    async createBrandProfile(authUserId: string, email: string, input: CreateBrandProfileInput, fullName?: string | null): Promise<BrandProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageBrandProfiles.create(buildBrandProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandProfiles");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "brand_profiles", "create", `BrandProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandProfileSummary(created, maps);
    }

    async getBrandVoices(authUserId: string, email: string, fullName?: string | null): Promise<BrandVoiceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageBrandVoice.listByOrganization(context.organizationId)).map((r) => mapBrandVoiceSummary(r, maps));
    }

    async createBrandVoice(authUserId: string, email: string, input: CreateBrandVoiceInput, fullName?: string | null): Promise<BrandVoiceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageBrandVoice.create(buildBrandVoicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandVoice");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "brand_voice", "create", `BrandVoice created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandVoiceSummary(created, maps);
    }

    async getCoreMessagings(authUserId: string, email: string, fullName?: string | null): Promise<CoreMessagingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageCoreMessaging.listByOrganization(context.organizationId)).map((r) => mapCoreMessagingSummary(r, maps));
    }

    async createCoreMessaging(authUserId: string, email: string, input: CreateCoreMessagingInput, fullName?: string | null): Promise<CoreMessagingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageCoreMessaging.create(buildCoreMessagingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create coreMessaging");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "core_messaging", "create", `CoreMessaging created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCoreMessagingSummary(created, maps);
    }

    async getBrandGuidelines(authUserId: string, email: string, fullName?: string | null): Promise<BrandGuidelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageBrandGuidelines.listByOrganization(context.organizationId)).map((r) => mapBrandGuidelineSummary(r, maps));
    }

    async createBrandGuideline(authUserId: string, email: string, input: CreateBrandGuidelineInput, fullName?: string | null): Promise<BrandGuidelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageBrandGuidelines.create(buildBrandGuidelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandGuidelines");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "brand_guidelines", "create", `BrandGuideline created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandGuidelineSummary(created, maps);
    }

    async getLogoLibrarys(authUserId: string, email: string, fullName?: string | null): Promise<LogoLibrarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageLogoLibrary.listByOrganization(context.organizationId)).map((r) => mapLogoLibrarySummary(r, maps));
    }

    async createLogoLibrary(authUserId: string, email: string, input: CreateLogoLibraryInput, fullName?: string | null): Promise<LogoLibrarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageLogoLibrary.create(buildLogoLibraryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create logoLibrary");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "logo_library", "create", `LogoLibrary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLogoLibrarySummary(created, maps);
    }

    async getColorSystems(authUserId: string, email: string, fullName?: string | null): Promise<ColorSystemSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageColorSystems.listByOrganization(context.organizationId)).map((r) => mapColorSystemSummary(r, maps));
    }

    async createColorSystem(authUserId: string, email: string, input: CreateColorSystemInput, fullName?: string | null): Promise<ColorSystemSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageColorSystems.create(buildColorSystemPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create colorSystems");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "color_systems", "create", `ColorSystem created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapColorSystemSummary(created, maps);
    }

    async getYoutubeTemplates(authUserId: string, email: string, fullName?: string | null): Promise<YoutubeTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageYoutubeTemplates.listByOrganization(context.organizationId)).map((r) => mapYoutubeTemplateSummary(r, maps));
    }

    async createYoutubeTemplate(authUserId: string, email: string, input: CreateYoutubeTemplateInput, fullName?: string | null): Promise<YoutubeTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageYoutubeTemplates.create(buildYoutubeTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create youtubeTemplates");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "youtube_templates", "create", `YoutubeTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapYoutubeTemplateSummary(created, maps);
    }

    async getSocialTemplates(authUserId: string, email: string, fullName?: string | null): Promise<SocialTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageSocialTemplates.listByOrganization(context.organizationId)).map((r) => mapSocialTemplateSummary(r, maps));
    }

    async createSocialTemplate(authUserId: string, email: string, input: CreateSocialTemplateInput, fullName?: string | null): Promise<SocialTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageSocialTemplates.create(buildSocialTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create socialTemplates");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "social_templates", "create", `SocialTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSocialTemplateSummary(created, maps);
    }

    async getBlogTemplates(authUserId: string, email: string, fullName?: string | null): Promise<BlogTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageBlogTemplates.listByOrganization(context.organizationId)).map((r) => mapBlogTemplateSummary(r, maps));
    }

    async createBlogTemplate(authUserId: string, email: string, input: CreateBlogTemplateInput, fullName?: string | null): Promise<BlogTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageBlogTemplates.create(buildBlogTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create blogTemplates");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "blog_templates", "create", `BlogTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBlogTemplateSummary(created, maps);
    }

    async getWebsiteArticleTemplates(authUserId: string, email: string, fullName?: string | null): Promise<WebsiteArticleTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageWebsiteArticleTemplates.listByOrganization(context.organizationId)).map((r) => mapWebsiteArticleTemplateSummary(r, maps));
    }

    async createWebsiteArticleTemplate(authUserId: string, email: string, input: CreateWebsiteArticleTemplateInput, fullName?: string | null): Promise<WebsiteArticleTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageWebsiteArticleTemplates.create(buildWebsiteArticleTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create websiteArticleTemplates");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "website_article_templates", "create", `WebsiteArticleTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebsiteArticleTemplateSummary(created, maps);
    }

    async getEmailCampaignTemplates(authUserId: string, email: string, fullName?: string | null): Promise<EmailCampaignTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageEmailCampaignTemplates.listByOrganization(context.organizationId)).map((r) => mapEmailCampaignTemplateSummary(r, maps));
    }

    async createEmailCampaignTemplate(authUserId: string, email: string, input: CreateEmailCampaignTemplateInput, fullName?: string | null): Promise<EmailCampaignTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageEmailCampaignTemplates.create(buildEmailCampaignTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create emailCampaignTemplates");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "email_campaign_templates", "create", `EmailCampaignTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEmailCampaignTemplateSummary(created, maps);
    }

    async getCaseStudyTemplates(authUserId: string, email: string, fullName?: string | null): Promise<CaseStudyTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageCaseStudyTemplates.listByOrganization(context.organizationId)).map((r) => mapCaseStudyTemplateSummary(r, maps));
    }

    async createCaseStudyTemplate(authUserId: string, email: string, input: CreateCaseStudyTemplateInput, fullName?: string | null): Promise<CaseStudyTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageCaseStudyTemplates.create(buildCaseStudyTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create caseStudyTemplates");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "case_study_templates", "create", `CaseStudyTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCaseStudyTemplateSummary(created, maps);
    }

    async getImageAssets(authUserId: string, email: string, fullName?: string | null): Promise<ImageAssetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageImageAssets.listByOrganization(context.organizationId)).map((r) => mapImageAssetSummary(r, maps));
    }

    async createImageAsset(authUserId: string, email: string, input: CreateImageAssetInput, fullName?: string | null): Promise<ImageAssetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageImageAssets.create(buildImageAssetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create imageAssets");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "image_assets", "create", `ImageAsset created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapImageAssetSummary(created, maps);
    }

    async getVideoAssets(authUserId: string, email: string, fullName?: string | null): Promise<VideoAssetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageVideoAssets.listByOrganization(context.organizationId)).map((r) => mapVideoAssetSummary(r, maps));
    }

    async createVideoAsset(authUserId: string, email: string, input: CreateVideoAssetInput, fullName?: string | null): Promise<VideoAssetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageVideoAssets.create(buildVideoAssetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create videoAssets");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "video_assets", "create", `VideoAsset created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVideoAssetSummary(created, maps);
    }

    async getIconAssets(authUserId: string, email: string, fullName?: string | null): Promise<IconAssetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageIconAssets.listByOrganization(context.organizationId)).map((r) => mapIconAssetSummary(r, maps));
    }

    async createIconAsset(authUserId: string, email: string, input: CreateIconAssetInput, fullName?: string | null): Promise<IconAssetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageIconAssets.create(buildIconAssetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create iconAssets");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "icon_assets", "create", `IconAsset created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIconAssetSummary(created, maps);
    }

    async getVoiceProfiles(authUserId: string, email: string, fullName?: string | null): Promise<VoiceProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageVoiceProfiles.listByOrganization(context.organizationId)).map((r) => mapVoiceProfileSummary(r, maps));
    }

    async createVoiceProfile(authUserId: string, email: string, input: CreateVoiceProfileInput, fullName?: string | null): Promise<VoiceProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageVoiceProfiles.create(buildVoiceProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create voiceProfiles");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "voice_profiles", "create", `VoiceProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVoiceProfileSummary(created, maps);
    }

    async getMusicAssets(authUserId: string, email: string, fullName?: string | null): Promise<MusicAssetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageMusicAssets.listByOrganization(context.organizationId)).map((r) => mapMusicAssetSummary(r, maps));
    }

    async createMusicAsset(authUserId: string, email: string, input: CreateMusicAssetInput, fullName?: string | null): Promise<MusicAssetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageMusicAssets.create(buildMusicAssetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create musicAssets");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "music_assets", "create", `MusicAsset created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMusicAssetSummary(created, maps);
    }

    async getThumbnailTemplates(authUserId: string, email: string, fullName?: string | null): Promise<ThumbnailTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageThumbnailTemplates.listByOrganization(context.organizationId)).map((r) => mapThumbnailTemplateSummary(r, maps));
    }

    async createThumbnailTemplate(authUserId: string, email: string, input: CreateThumbnailTemplateInput, fullName?: string | null): Promise<ThumbnailTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageThumbnailTemplates.create(buildThumbnailTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create thumbnailTemplates");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "thumbnail_templates", "create", `ThumbnailTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapThumbnailTemplateSummary(created, maps);
    }

    async getIdeaGenerators(authUserId: string, email: string, fullName?: string | null): Promise<IdeaGeneratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageIdeaGenerators.listByOrganization(context.organizationId)).map((r) => mapIdeaGeneratorSummary(r, maps));
    }

    async createIdeaGenerator(authUserId: string, email: string, input: CreateIdeaGeneratorInput, fullName?: string | null): Promise<IdeaGeneratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageIdeaGenerators.create(buildIdeaGeneratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ideaGenerators");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "idea_generators", "create", `IdeaGenerator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIdeaGeneratorSummary(created, maps);
    }

    async getScriptGenerators(authUserId: string, email: string, fullName?: string | null): Promise<ScriptGeneratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageScriptGenerators.listByOrganization(context.organizationId)).map((r) => mapScriptGeneratorSummary(r, maps));
    }

    async createScriptGenerator(authUserId: string, email: string, input: CreateScriptGeneratorInput, fullName?: string | null): Promise<ScriptGeneratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageScriptGenerators.create(buildScriptGeneratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create scriptGenerators");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "script_generators", "create", `ScriptGenerator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapScriptGeneratorSummary(created, maps);
    }

    async getCaptionGenerators(authUserId: string, email: string, fullName?: string | null): Promise<CaptionGeneratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageCaptionGenerators.listByOrganization(context.organizationId)).map((r) => mapCaptionGeneratorSummary(r, maps));
    }

    async createCaptionGenerator(authUserId: string, email: string, input: CreateCaptionGeneratorInput, fullName?: string | null): Promise<CaptionGeneratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageCaptionGenerators.create(buildCaptionGeneratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create captionGenerators");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "caption_generators", "create", `CaptionGenerator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCaptionGeneratorSummary(created, maps);
    }

    async getBlogGenerators(authUserId: string, email: string, fullName?: string | null): Promise<BlogGeneratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageBlogGenerators.listByOrganization(context.organizationId)).map((r) => mapBlogGeneratorSummary(r, maps));
    }

    async createBlogGenerator(authUserId: string, email: string, input: CreateBlogGeneratorInput, fullName?: string | null): Promise<BlogGeneratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageBlogGenerators.create(buildBlogGeneratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create blogGenerators");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "blog_generators", "create", `BlogGenerator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBlogGeneratorSummary(created, maps);
    }

    async getSeoAssistants(authUserId: string, email: string, fullName?: string | null): Promise<SeoAssistantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageSeoAssistants.listByOrganization(context.organizationId)).map((r) => mapSeoAssistantSummary(r, maps));
    }

    async createSeoAssistant(authUserId: string, email: string, input: CreateSeoAssistantInput, fullName?: string | null): Promise<SeoAssistantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageSeoAssistants.create(buildSeoAssistantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create seoAssistants");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "seo_assistants", "create", `SeoAssistant created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSeoAssistantSummary(created, maps);
    }

    async getCtaGenerators(authUserId: string, email: string, fullName?: string | null): Promise<CtaGeneratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageCtaGenerators.listByOrganization(context.organizationId)).map((r) => mapCtaGeneratorSummary(r, maps));
    }

    async createCtaGenerator(authUserId: string, email: string, input: CreateCtaGeneratorInput, fullName?: string | null): Promise<CtaGeneratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageCtaGenerators.create(buildCtaGeneratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ctaGenerators");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "cta_generators", "create", `CtaGenerator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCtaGeneratorSummary(created, maps);
    }

    async getGrowthMetrics(authUserId: string, email: string, fullName?: string | null): Promise<GrowthMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aageGrowthMetrics.listByOrganization(context.organizationId)).map(mapGrowthMetricSummary);
    }

    async createGrowthMetric(authUserId: string, email: string, input: CreateGrowthMetricInput, fullName?: string | null): Promise<GrowthMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageGrowthMetrics.create(buildGrowthMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthMetrics");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "growth_metrics", "create", `GrowthMetric created`, created.id));
        return mapGrowthMetricSummary(created);
    }

    async getGrowthHealths(authUserId: string, email: string, fullName?: string | null): Promise<GrowthHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aageGrowthHealth.listByOrganization(context.organizationId)).map(mapGrowthHealthSummary);
    }

    async createGrowthHealth(authUserId: string, email: string, input: CreateGrowthHealthInput, fullName?: string | null): Promise<GrowthHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageGrowthHealth.create(buildGrowthHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthHealth");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "growth_health", "create", `GrowthHealth created`, created.id));
        return mapGrowthHealthSummary(created);
    }

    async getContentCalendars(authUserId: string, email: string, fullName?: string | null): Promise<ContentCalendarSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageContentCalendar.listByOrganization(context.organizationId)).map((r) => mapContentCalendarSummary(r, maps));
    }

    async createContentCalendar(authUserId: string, email: string, input: CreateContentCalendarInput, fullName?: string | null): Promise<ContentCalendarSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageContentCalendar.create(buildContentCalendarPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create contentCalendar");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "content_calendar", "create", `ContentCalendar created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapContentCalendarSummary(created, maps);
    }

    async getDraftQueues(authUserId: string, email: string, fullName?: string | null): Promise<DraftQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageDraftQueue.listByOrganization(context.organizationId)).map((r) => mapDraftQueueSummary(r, maps));
    }

    async createDraftQueue(authUserId: string, email: string, input: CreateDraftQueueInput, fullName?: string | null): Promise<DraftQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageDraftQueue.create(buildDraftQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create draftQueue");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "draft_queue", "create", `DraftQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDraftQueueSummary(created, maps);
    }

    async getApprovalQueues(authUserId: string, email: string, fullName?: string | null): Promise<ApprovalQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aageApprovalQueue.listByOrganization(context.organizationId)).map((r) => mapApprovalQueueSummary(r, maps));
    }

    async createApprovalQueue(authUserId: string, email: string, input: CreateApprovalQueueInput, fullName?: string | null): Promise<ApprovalQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aageApprovalQueue.create(buildApprovalQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create approvalQueue");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "approval_queue", "create", `ApprovalQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalQueueSummary(created, maps);
    }

    async getPublishingQueues(authUserId: string, email: string, fullName?: string | null): Promise<PublishingQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagePublishingQueue.listByOrganization(context.organizationId)).map((r) => mapPublishingQueueSummary(r, maps));
    }

    async createPublishingQueue(authUserId: string, email: string, input: CreatePublishingQueueInput, fullName?: string | null): Promise<PublishingQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagePublishingQueue.create(buildPublishingQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create publishingQueue");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "publishing_queue", "create", `PublishingQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPublishingQueueSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aageAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getGrowthHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aageGrowthHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunBrandService(authUserId: string, email: string, input: AageSdkRunBrandServiceInput, fullName?: string | null): Promise<AageSdkRunBrandServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        const company = createCompanyFoundationClient(authUserId, email, fullName);
        await company.getCompanyHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createBrandProfile(authUserId, email, { growthHubId: input.growthHubId, profileKey: input.profileKey, profileName: input.profileName }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }

    async sdkRunContentFoundationService(authUserId: string, email: string, input: AageSdkRunContentFoundationServiceInput, fullName?: string | null): Promise<AageSdkRunContentFoundationServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createYoutubeTemplate(authUserId, email, { growthHubId: input.growthHubId, templateKey: input.templateKey, templateName: input.templateName }, fullName);
        return { templateId: created.id, templateKey: created.templateKey, status: created.status };
    }

    async sdkRunMediaFoundationService(authUserId: string, email: string, input: AageSdkRunMediaFoundationServiceInput, fullName?: string | null): Promise<AageSdkRunMediaFoundationServiceResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const launch = createLaunchFoundationClient(authUserId, email, fullName);
        await launch.getLaunchHubs();
        const csd = createCustomerSuccessDeliveryClient(authUserId, email, fullName);
        await csd.getDeliveryHubs();
        const egp = createEnterpriseGovernancePlatformClient(authUserId, email, fullName);
        await egp.getGovernanceHubs();
        const eip = createEnterpriseIntelligencePlatformClient(authUserId, email, fullName);
        await eip.getIntelligenceHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createImageAsset(authUserId, email, { growthHubId: input.growthHubId, assetKey: input.assetKey, assetName: input.assetName }, fullName);
        return { assetId: created.id, assetKey: created.assetKey, status: created.status };
    }

    async sdkRunContentEngineService(authUserId: string, email: string, input: AageSdkRunContentEngineServiceInput, fullName?: string | null): Promise<AageSdkRunContentEngineServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.getAgents();
        const created = await this.createIdeaGenerator(authUserId, email, { growthHubId: input.growthHubId, generatorKey: input.generatorKey, generatorName: input.generatorName }, fullName);
        return { generatorId: created.id, generatorKey: created.generatorKey, status: created.status };
    }

    async sdkRunFounderDashboardService(authUserId: string, email: string, input: AageSdkRunFounderDashboardServiceInput, fullName?: string | null): Promise<AageSdkRunFounderDashboardServiceResult> {
        const created = await this.createPublishingQueue(authUserId, email, { growthHubId: input.growthHubId, queueKey: input.queueKey, queueTitle: input.queueTitle }, fullName);
        return { queueId: created.id, queueKey: created.queueKey, status: created.status };
    }
}

export const growthEngineService = new GrowthEngineService();
