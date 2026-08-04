import type { DbAageGrowthHub,
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
    DbAageAuditLog } from "@/src/modules/database/types/platform";
import type { CreateGrowthHubInput,
    GrowthHubSummary,
    CreateBrandProfileInput,
    BrandProfileSummary,
    CreateBrandVoiceInput,
    BrandVoiceSummary,
    CreateCoreMessagingInput,
    CoreMessagingSummary,
    CreateBrandGuidelineInput,
    BrandGuidelineSummary,
    CreateLogoLibraryInput,
    LogoLibrarySummary,
    CreateColorSystemInput,
    ColorSystemSummary,
    CreateYoutubeTemplateInput,
    YoutubeTemplateSummary,
    CreateSocialTemplateInput,
    SocialTemplateSummary,
    CreateBlogTemplateInput,
    BlogTemplateSummary,
    CreateWebsiteArticleTemplateInput,
    WebsiteArticleTemplateSummary,
    CreateEmailCampaignTemplateInput,
    EmailCampaignTemplateSummary,
    CreateCaseStudyTemplateInput,
    CaseStudyTemplateSummary,
    CreateImageAssetInput,
    ImageAssetSummary,
    CreateVideoAssetInput,
    VideoAssetSummary,
    CreateIconAssetInput,
    IconAssetSummary,
    CreateVoiceProfileInput,
    VoiceProfileSummary,
    CreateMusicAssetInput,
    MusicAssetSummary,
    CreateThumbnailTemplateInput,
    ThumbnailTemplateSummary,
    CreateIdeaGeneratorInput,
    IdeaGeneratorSummary,
    CreateScriptGeneratorInput,
    ScriptGeneratorSummary,
    CreateCaptionGeneratorInput,
    CaptionGeneratorSummary,
    CreateBlogGeneratorInput,
    BlogGeneratorSummary,
    CreateSeoAssistantInput,
    SeoAssistantSummary,
    CreateCtaGeneratorInput,
    CtaGeneratorSummary,
    CreateGrowthMetricInput,
    GrowthMetricSummary,
    CreateGrowthHealthInput,
    GrowthHealthSummary,
    CreateContentCalendarInput,
    ContentCalendarSummary,
    CreateDraftQueueInput,
    DraftQueueSummary,
    CreateApprovalQueueInput,
    ApprovalQueueSummary,
    CreatePublishingQueueInput,
    PublishingQueueSummary,
    AageDashboardStats,
    AagePipelineInfo,
    AuditEntry } from "@/src/modules/growth-engine/types";

export function buildGrowthHubLookupMaps(hubs: DbAageGrowthHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildAagePipelineInfo(): AagePipelineInfo {
    const stages = [
        { key: "brand", label: "Brand Foundation" },
        { key: "content_foundation", label: "Content Foundation" },
        { key: "media_foundation", label: "Media Foundation" },
        { key: "content_engine", label: "Content Engine" },
        { key: "founder_dashboard", label: "Founder Dashboard" },
    ];
    return { stages, currentStage: "content_foundation", nextStage: "media_foundation", previousStage: "brand" };
}

export function buildAageAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbAageAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapGrowthHubSummary(record: DbAageGrowthHub): GrowthHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildGrowthHubPayload(organizationId: string, input: CreateGrowthHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapBrandProfileSummary(record: DbAageBrandProfile, maps?: { hubNameById: Map<string, string> }): BrandProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileStatus: record.profile_status as string,
        status: record.status,
    };
}

export function buildBrandProfilePayload(organizationId: string, input: CreateBrandProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_status: input.profileStatus ?? '',
        status: "active",
    };
}

export function mapBrandVoiceSummary(record: DbAageBrandVoice, maps?: { hubNameById: Map<string, string> }): BrandVoiceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        voiceKey: record.voice_key as string,
        voiceName: record.voice_name as string,
        voiceTone: record.voice_tone as string,
        status: record.status,
    };
}

export function buildBrandVoicePayload(organizationId: string, input: CreateBrandVoiceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        voice_key: input.voiceKey ?? '',
        voice_name: input.voiceName ?? '',
        voice_tone: input.voiceTone ?? '',
        status: "active",
    };
}

export function mapCoreMessagingSummary(record: DbAageCoreMessaging, maps?: { hubNameById: Map<string, string> }): CoreMessagingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        messagingKey: record.messaging_key as string,
        messagingTitle: record.messaging_title as string,
        messagingStatus: record.messaging_status as string,
        status: record.status,
    };
}

export function buildCoreMessagingPayload(organizationId: string, input: CreateCoreMessagingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        messaging_key: input.messagingKey ?? '',
        messaging_title: input.messagingTitle ?? '',
        messaging_status: input.messagingStatus ?? '',
        status: "active",
    };
}

export function mapBrandGuidelineSummary(record: DbAageBrandGuideline, maps?: { hubNameById: Map<string, string> }): BrandGuidelineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        guidelineKey: record.guideline_key as string,
        guidelineName: record.guideline_name as string,
        guidelineStatus: record.guideline_status as string,
        status: record.status,
    };
}

export function buildBrandGuidelinePayload(organizationId: string, input: CreateBrandGuidelineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        guideline_key: input.guidelineKey ?? '',
        guideline_name: input.guidelineName ?? '',
        guideline_status: input.guidelineStatus ?? '',
        status: "active",
    };
}

export function mapLogoLibrarySummary(record: DbAageLogoLibrary, maps?: { hubNameById: Map<string, string> }): LogoLibrarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        logoKey: record.logo_key as string,
        logoName: record.logo_name as string,
        logoFormat: record.logo_format as string,
        status: record.status,
    };
}

export function buildLogoLibraryPayload(organizationId: string, input: CreateLogoLibraryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        logo_key: input.logoKey ?? '',
        logo_name: input.logoName ?? '',
        logo_format: input.logoFormat ?? '',
        status: "active",
    };
}

export function mapColorSystemSummary(record: DbAageColorSystem, maps?: { hubNameById: Map<string, string> }): ColorSystemSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        colorKey: record.color_key as string,
        colorName: record.color_name as string,
        primaryHex: record.primary_hex as string,
        status: record.status,
    };
}

export function buildColorSystemPayload(organizationId: string, input: CreateColorSystemInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        color_key: input.colorKey ?? '',
        color_name: input.colorName ?? '',
        primary_hex: input.primaryHex ?? '',
        status: "active",
    };
}

export function mapYoutubeTemplateSummary(record: DbAageYoutubeTemplate, maps?: { hubNameById: Map<string, string> }): YoutubeTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateStatus: record.template_status as string,
        status: record.status,
    };
}

export function buildYoutubeTemplatePayload(organizationId: string, input: CreateYoutubeTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_status: input.templateStatus ?? '',
        status: "active",
    };
}

export function mapSocialTemplateSummary(record: DbAageSocialTemplate, maps?: { hubNameById: Map<string, string> }): SocialTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateStatus: record.template_status as string,
        status: record.status,
    };
}

export function buildSocialTemplatePayload(organizationId: string, input: CreateSocialTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_status: input.templateStatus ?? '',
        status: "active",
    };
}

export function mapBlogTemplateSummary(record: DbAageBlogTemplate, maps?: { hubNameById: Map<string, string> }): BlogTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateStatus: record.template_status as string,
        status: record.status,
    };
}

export function buildBlogTemplatePayload(organizationId: string, input: CreateBlogTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_status: input.templateStatus ?? '',
        status: "active",
    };
}

export function mapWebsiteArticleTemplateSummary(record: DbAageWebsiteArticleTemplate, maps?: { hubNameById: Map<string, string> }): WebsiteArticleTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateStatus: record.template_status as string,
        status: record.status,
    };
}

export function buildWebsiteArticleTemplatePayload(organizationId: string, input: CreateWebsiteArticleTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_status: input.templateStatus ?? '',
        status: "active",
    };
}

export function mapEmailCampaignTemplateSummary(record: DbAageEmailCampaignTemplate, maps?: { hubNameById: Map<string, string> }): EmailCampaignTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateStatus: record.template_status as string,
        status: record.status,
    };
}

export function buildEmailCampaignTemplatePayload(organizationId: string, input: CreateEmailCampaignTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_status: input.templateStatus ?? '',
        status: "active",
    };
}

export function mapCaseStudyTemplateSummary(record: DbAageCaseStudyTemplate, maps?: { hubNameById: Map<string, string> }): CaseStudyTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateStatus: record.template_status as string,
        status: record.status,
    };
}

export function buildCaseStudyTemplatePayload(organizationId: string, input: CreateCaseStudyTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_status: input.templateStatus ?? '',
        status: "active",
    };
}

export function mapImageAssetSummary(record: DbAageImageAsset, maps?: { hubNameById: Map<string, string> }): ImageAssetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assetKey: record.asset_key as string,
        assetName: record.asset_name as string,
        assetType: record.asset_type as string,
        status: record.status,
    };
}

export function buildImageAssetPayload(organizationId: string, input: CreateImageAssetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        asset_key: input.assetKey ?? '',
        asset_name: input.assetName ?? '',
        asset_type: input.assetType ?? '',
        status: "active",
    };
}

export function mapVideoAssetSummary(record: DbAageVideoAsset, maps?: { hubNameById: Map<string, string> }): VideoAssetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assetKey: record.asset_key as string,
        assetName: record.asset_name as string,
        assetType: record.asset_type as string,
        status: record.status,
    };
}

export function buildVideoAssetPayload(organizationId: string, input: CreateVideoAssetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        asset_key: input.assetKey ?? '',
        asset_name: input.assetName ?? '',
        asset_type: input.assetType ?? '',
        status: "active",
    };
}

export function mapIconAssetSummary(record: DbAageIconAsset, maps?: { hubNameById: Map<string, string> }): IconAssetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assetKey: record.asset_key as string,
        assetName: record.asset_name as string,
        assetType: record.asset_type as string,
        status: record.status,
    };
}

export function buildIconAssetPayload(organizationId: string, input: CreateIconAssetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        asset_key: input.assetKey ?? '',
        asset_name: input.assetName ?? '',
        asset_type: input.assetType ?? '',
        status: "active",
    };
}

export function mapVoiceProfileSummary(record: DbAageVoiceProfile, maps?: { hubNameById: Map<string, string> }): VoiceProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        voiceType: record.voice_type as string,
        status: record.status,
    };
}

export function buildVoiceProfilePayload(organizationId: string, input: CreateVoiceProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        voice_type: input.voiceType ?? '',
        status: "active",
    };
}

export function mapMusicAssetSummary(record: DbAageMusicAsset, maps?: { hubNameById: Map<string, string> }): MusicAssetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assetKey: record.asset_key as string,
        assetName: record.asset_name as string,
        genre: record.genre as string,
        status: record.status,
    };
}

export function buildMusicAssetPayload(organizationId: string, input: CreateMusicAssetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        asset_key: input.assetKey ?? '',
        asset_name: input.assetName ?? '',
        genre: input.genre ?? '',
        status: "active",
    };
}

export function mapThumbnailTemplateSummary(record: DbAageThumbnailTemplate, maps?: { hubNameById: Map<string, string> }): ThumbnailTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateStatus: record.template_status as string,
        status: record.status,
    };
}

export function buildThumbnailTemplatePayload(organizationId: string, input: CreateThumbnailTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_status: input.templateStatus ?? '',
        status: "active",
    };
}

export function mapIdeaGeneratorSummary(record: DbAageIdeaGenerator, maps?: { hubNameById: Map<string, string> }): IdeaGeneratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generatorKey: record.generator_key as string,
        generatorName: record.generator_name as string,
        generatorStatus: record.generator_status as string,
        status: record.status,
    };
}

export function buildIdeaGeneratorPayload(organizationId: string, input: CreateIdeaGeneratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        generator_key: input.generatorKey ?? '',
        generator_name: input.generatorName ?? '',
        generator_status: input.generatorStatus ?? '',
        status: "active",
    };
}

export function mapScriptGeneratorSummary(record: DbAageScriptGenerator, maps?: { hubNameById: Map<string, string> }): ScriptGeneratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generatorKey: record.generator_key as string,
        generatorName: record.generator_name as string,
        generatorStatus: record.generator_status as string,
        status: record.status,
    };
}

export function buildScriptGeneratorPayload(organizationId: string, input: CreateScriptGeneratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        generator_key: input.generatorKey ?? '',
        generator_name: input.generatorName ?? '',
        generator_status: input.generatorStatus ?? '',
        status: "active",
    };
}

export function mapCaptionGeneratorSummary(record: DbAageCaptionGenerator, maps?: { hubNameById: Map<string, string> }): CaptionGeneratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generatorKey: record.generator_key as string,
        generatorName: record.generator_name as string,
        generatorStatus: record.generator_status as string,
        status: record.status,
    };
}

export function buildCaptionGeneratorPayload(organizationId: string, input: CreateCaptionGeneratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        generator_key: input.generatorKey ?? '',
        generator_name: input.generatorName ?? '',
        generator_status: input.generatorStatus ?? '',
        status: "active",
    };
}

export function mapBlogGeneratorSummary(record: DbAageBlogGenerator, maps?: { hubNameById: Map<string, string> }): BlogGeneratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generatorKey: record.generator_key as string,
        generatorName: record.generator_name as string,
        generatorStatus: record.generator_status as string,
        status: record.status,
    };
}

export function buildBlogGeneratorPayload(organizationId: string, input: CreateBlogGeneratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        generator_key: input.generatorKey ?? '',
        generator_name: input.generatorName ?? '',
        generator_status: input.generatorStatus ?? '',
        status: "active",
    };
}

export function mapSeoAssistantSummary(record: DbAageSeoAssistant, maps?: { hubNameById: Map<string, string> }): SeoAssistantSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assistantKey: record.assistant_key as string,
        assistantName: record.assistant_name as string,
        assistantStatus: record.assistant_status as string,
        status: record.status,
    };
}

export function buildSeoAssistantPayload(organizationId: string, input: CreateSeoAssistantInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        assistant_key: input.assistantKey ?? '',
        assistant_name: input.assistantName ?? '',
        assistant_status: input.assistantStatus ?? '',
        status: "active",
    };
}

export function mapCtaGeneratorSummary(record: DbAageCtaGenerator, maps?: { hubNameById: Map<string, string> }): CtaGeneratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generatorKey: record.generator_key as string,
        generatorName: record.generator_name as string,
        generatorStatus: record.generator_status as string,
        status: record.status,
    };
}

export function buildCtaGeneratorPayload(organizationId: string, input: CreateCtaGeneratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        generator_key: input.generatorKey ?? '',
        generator_name: input.generatorName ?? '',
        generator_status: input.generatorStatus ?? '',
        status: "active",
    };
}

export function mapGrowthMetricSummary(record: DbAageGrowthMetric): GrowthMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        overallGrowthScore: record.overall_growth_score as number,
        brandHealthScore: record.brand_health_score as number,
        status: record.status,
    };
}

export function buildGrowthMetricPayload(organizationId: string, input: CreateGrowthMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        overall_growth_score: input.overallGrowthScore ?? 0,
        brand_health_score: input.brandHealthScore ?? 0,
        status: "active",
    };
}

export function mapGrowthHealthSummary(record: DbAageGrowthHealth): GrowthHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        brandStatus: record.brand_status as string,
        status: record.status,
    };
}

export function buildGrowthHealthPayload(organizationId: string, input: CreateGrowthHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        brand_status: input.brandStatus ?? '',
        status: "active",
    };
}

export function mapContentCalendarSummary(record: DbAageContentCalendar, maps?: { hubNameById: Map<string, string> }): ContentCalendarSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        calendarKey: record.calendar_key as string,
        calendarName: record.calendar_name as string,
        calendarStatus: record.calendar_status as string,
        status: record.status,
    };
}

export function buildContentCalendarPayload(organizationId: string, input: CreateContentCalendarInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        calendar_key: input.calendarKey ?? '',
        calendar_name: input.calendarName ?? '',
        calendar_status: input.calendarStatus ?? '',
        status: "active",
    };
}

export function mapDraftQueueSummary(record: DbAageDraftQueue, maps?: { hubNameById: Map<string, string> }): DraftQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        queueKey: record.queue_key as string,
        queueTitle: record.queue_title as string,
        queueStatus: record.queue_status as string,
        status: record.status,
    };
}

export function buildDraftQueuePayload(organizationId: string, input: CreateDraftQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        queue_key: input.queueKey ?? '',
        queue_title: input.queueTitle ?? '',
        queue_status: input.queueStatus ?? '',
        status: "active",
    };
}

export function mapApprovalQueueSummary(record: DbAageApprovalQueue, maps?: { hubNameById: Map<string, string> }): ApprovalQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        queueKey: record.queue_key as string,
        queueTitle: record.queue_title as string,
        queueStatus: record.queue_status as string,
        status: record.status,
    };
}

export function buildApprovalQueuePayload(organizationId: string, input: CreateApprovalQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        queue_key: input.queueKey ?? '',
        queue_title: input.queueTitle ?? '',
        queue_status: input.queueStatus ?? '',
        status: "active",
    };
}

export function mapPublishingQueueSummary(record: DbAagePublishingQueue, maps?: { hubNameById: Map<string, string> }): PublishingQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        queueKey: record.queue_key as string,
        queueTitle: record.queue_title as string,
        queueStatus: record.queue_status as string,
        status: record.status,
    };
}

export function buildPublishingQueuePayload(organizationId: string, input: CreatePublishingQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.growthHubId,
        queue_key: input.queueKey ?? '',
        queue_title: input.queueTitle ?? '',
        queue_status: input.queueStatus ?? '',
        status: "active",
    };
}

export function mapBrandProfileForStats(r: DbAageBrandProfile) { return { profile_status: r.profile_status, status: r.status }; }
export function mapYoutubeTemplateForStats(r: DbAageYoutubeTemplate) { return { template_status: r.template_status, status: r.status }; }
export function mapImageAssetForStats(r: DbAageImageAsset) { return { asset_type: r.asset_type, status: r.status }; }
export function mapIdeaGeneratorForStats(r: DbAageIdeaGenerator) { return { generator_status: r.generator_status, status: r.status }; }
export function mapContentCalendarForStats(r: DbAageContentCalendar) { return { calendar_status: r.calendar_status, status: r.status }; }
export function mapGrowthMetricForStats(r: DbAageGrowthMetric) {
    return {
        marketing_overview_score: r.marketing_overview_score,
        brand_health_score: r.brand_health_score,
        content_calendar_count: r.content_calendar_count,
        draft_queue_count: r.draft_queue_count,
        approval_queue_count: r.approval_queue_count,
        publishing_queue_count: r.publishing_queue_count,
        overall_growth_score: r.overall_growth_score,
        status: r.status,
    };
}
export function mapGrowthHealthForStats(r: DbAageGrowthHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapPublishingQueueForStats(r: DbAagePublishingQueue) { return { queue_status: r.queue_status, status: r.status }; }

export function buildAageDashboardStats(input: {
    growthHubs: GrowthHubSummary[];
    brandProfiles: ReturnType<typeof mapBrandProfileForStats>[];
    youtubeTemplates: ReturnType<typeof mapYoutubeTemplateForStats>[];
    imageAssets: ReturnType<typeof mapImageAssetForStats>[];
    ideaGenerators: ReturnType<typeof mapIdeaGeneratorForStats>[];
    contentCalendars: ReturnType<typeof mapContentCalendarForStats>[];
    growthMetrics: ReturnType<typeof mapGrowthMetricForStats>[];
    growthHealth: ReturnType<typeof mapGrowthHealthForStats>[];
    publishingQueues: ReturnType<typeof mapPublishingQueueForStats>[];
    auditLogs: AuditEntry[];
}): AageDashboardStats {
    const activeHubs = input.growthHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.growthMetrics[0];
    const latestHealth = input.growthHealth[0];
    const pendingPublish = input.publishingQueues.filter((q) => q.queue_status === "scheduled").length;
    return {
        totalGrowthHubs: input.growthHubs.length,
        activeGrowthHubs: activeHubs,
        brandProfileCount: input.brandProfiles.length,
        youtubeTemplateCount: input.youtubeTemplates.length,
        imageAssetCount: input.imageAssets.length,
        ideaGeneratorCount: input.ideaGenerators.length,
        contentCalendarCount: latestMetrics?.content_calendar_count ?? input.contentCalendars.length,
        publishingQueueCount: latestMetrics?.publishing_queue_count ?? pendingPublish,
        overallGrowthScore: latestMetrics?.overall_growth_score ?? latestHealth?.overall_score ?? 0,
        marketingOverviewScore: latestMetrics?.marketing_overview_score ?? 0,
        brandHealthScore: latestMetrics?.brand_health_score ?? 0,
        draftQueueCount: latestMetrics?.draft_queue_count ?? 0,
        approvalQueueCount: latestMetrics?.approval_queue_count ?? 0,
        auditCount: input.auditLogs.length,
    };
}
