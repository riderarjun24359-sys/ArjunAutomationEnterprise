export interface AageDashboardStats {
    totalGrowthHubs: number;
    activeGrowthHubs: number;
    brandProfileCount: number;
    youtubeTemplateCount: number;
    imageAssetCount: number;
    ideaGeneratorCount: number;
    contentCalendarCount: number;
    publishingQueueCount: number;
    overallGrowthScore: number;
    marketingOverviewScore: number;
    brandHealthScore: number;
    draftQueueCount: number;
    approvalQueueCount: number;
    auditCount: number;
}

export interface AagePipelineInfo {
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

export interface AageSdkRunBrandServiceInput { growthHubId: string; profileKey?: string; profileName?: string; }
export interface AageSdkRunBrandServiceResult { profileId: string; profileKey: string; status: string; }
export interface AageSdkRunContentFoundationServiceInput { growthHubId: string; templateKey?: string; templateName?: string; }
export interface AageSdkRunContentFoundationServiceResult { templateId: string; templateKey: string; status: string; }
export interface AageSdkRunMediaFoundationServiceInput { growthHubId: string; assetKey?: string; assetName?: string; }
export interface AageSdkRunMediaFoundationServiceResult { assetId: string; assetKey: string; status: string; }
export interface AageSdkRunContentEngineServiceInput { growthHubId: string; generatorKey?: string; generatorName?: string; }
export interface AageSdkRunContentEngineServiceResult { generatorId: string; generatorKey: string; status: string; }
export interface AageSdkRunFounderDashboardServiceInput { growthHubId: string; queueKey?: string; queueTitle?: string; }
export interface AageSdkRunFounderDashboardServiceResult { queueId: string; queueKey: string; status: string; }

export interface GrowthHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateGrowthHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface BrandProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileStatus: string;
    status: string;
}

export interface CreateBrandProfileInput {
        growthHubId: string;
        profileKey?: string;
    profileName?: string;
    profileStatus?: string;
}

export interface BrandVoiceSummary {
    id: string;
    hubName?: string;
        voiceKey: string;
    voiceName: string;
    voiceTone: string;
    status: string;
}

export interface CreateBrandVoiceInput {
        growthHubId: string;
        voiceKey?: string;
    voiceName?: string;
    voiceTone?: string;
}

export interface CoreMessagingSummary {
    id: string;
    hubName?: string;
        messagingKey: string;
    messagingTitle: string;
    messagingStatus: string;
    status: string;
}

export interface CreateCoreMessagingInput {
        growthHubId: string;
        messagingKey?: string;
    messagingTitle?: string;
    messagingStatus?: string;
}

export interface BrandGuidelineSummary {
    id: string;
    hubName?: string;
        guidelineKey: string;
    guidelineName: string;
    guidelineStatus: string;
    status: string;
}

export interface CreateBrandGuidelineInput {
        growthHubId: string;
        guidelineKey?: string;
    guidelineName?: string;
    guidelineStatus?: string;
}

export interface LogoLibrarySummary {
    id: string;
    hubName?: string;
        logoKey: string;
    logoName: string;
    logoFormat: string;
    status: string;
}

export interface CreateLogoLibraryInput {
        growthHubId: string;
        logoKey?: string;
    logoName?: string;
    logoFormat?: string;
}

export interface ColorSystemSummary {
    id: string;
    hubName?: string;
        colorKey: string;
    colorName: string;
    primaryHex: string;
    status: string;
}

export interface CreateColorSystemInput {
        growthHubId: string;
        colorKey?: string;
    colorName?: string;
    primaryHex?: string;
}

export interface YoutubeTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateStatus: string;
    status: string;
}

export interface CreateYoutubeTemplateInput {
        growthHubId: string;
        templateKey?: string;
    templateName?: string;
    templateStatus?: string;
}

export interface SocialTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateStatus: string;
    status: string;
}

export interface CreateSocialTemplateInput {
        growthHubId: string;
        templateKey?: string;
    templateName?: string;
    templateStatus?: string;
}

export interface BlogTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateStatus: string;
    status: string;
}

export interface CreateBlogTemplateInput {
        growthHubId: string;
        templateKey?: string;
    templateName?: string;
    templateStatus?: string;
}

export interface WebsiteArticleTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateStatus: string;
    status: string;
}

export interface CreateWebsiteArticleTemplateInput {
        growthHubId: string;
        templateKey?: string;
    templateName?: string;
    templateStatus?: string;
}

export interface EmailCampaignTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateStatus: string;
    status: string;
}

export interface CreateEmailCampaignTemplateInput {
        growthHubId: string;
        templateKey?: string;
    templateName?: string;
    templateStatus?: string;
}

export interface CaseStudyTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateStatus: string;
    status: string;
}

export interface CreateCaseStudyTemplateInput {
        growthHubId: string;
        templateKey?: string;
    templateName?: string;
    templateStatus?: string;
}

export interface ImageAssetSummary {
    id: string;
    hubName?: string;
        assetKey: string;
    assetName: string;
    assetType: string;
    status: string;
}

export interface CreateImageAssetInput {
        growthHubId: string;
        assetKey?: string;
    assetName?: string;
    assetType?: string;
}

export interface VideoAssetSummary {
    id: string;
    hubName?: string;
        assetKey: string;
    assetName: string;
    assetType: string;
    status: string;
}

export interface CreateVideoAssetInput {
        growthHubId: string;
        assetKey?: string;
    assetName?: string;
    assetType?: string;
}

export interface IconAssetSummary {
    id: string;
    hubName?: string;
        assetKey: string;
    assetName: string;
    assetType: string;
    status: string;
}

export interface CreateIconAssetInput {
        growthHubId: string;
        assetKey?: string;
    assetName?: string;
    assetType?: string;
}

export interface VoiceProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    voiceType: string;
    status: string;
}

export interface CreateVoiceProfileInput {
        growthHubId: string;
        profileKey?: string;
    profileName?: string;
    voiceType?: string;
}

export interface MusicAssetSummary {
    id: string;
    hubName?: string;
        assetKey: string;
    assetName: string;
    genre: string;
    status: string;
}

export interface CreateMusicAssetInput {
        growthHubId: string;
        assetKey?: string;
    assetName?: string;
    genre?: string;
}

export interface ThumbnailTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateStatus: string;
    status: string;
}

export interface CreateThumbnailTemplateInput {
        growthHubId: string;
        templateKey?: string;
    templateName?: string;
    templateStatus?: string;
}

export interface IdeaGeneratorSummary {
    id: string;
    hubName?: string;
        generatorKey: string;
    generatorName: string;
    generatorStatus: string;
    status: string;
}

export interface CreateIdeaGeneratorInput {
        growthHubId: string;
        generatorKey?: string;
    generatorName?: string;
    generatorStatus?: string;
}

export interface ScriptGeneratorSummary {
    id: string;
    hubName?: string;
        generatorKey: string;
    generatorName: string;
    generatorStatus: string;
    status: string;
}

export interface CreateScriptGeneratorInput {
        growthHubId: string;
        generatorKey?: string;
    generatorName?: string;
    generatorStatus?: string;
}

export interface CaptionGeneratorSummary {
    id: string;
    hubName?: string;
        generatorKey: string;
    generatorName: string;
    generatorStatus: string;
    status: string;
}

export interface CreateCaptionGeneratorInput {
        growthHubId: string;
        generatorKey?: string;
    generatorName?: string;
    generatorStatus?: string;
}

export interface BlogGeneratorSummary {
    id: string;
    hubName?: string;
        generatorKey: string;
    generatorName: string;
    generatorStatus: string;
    status: string;
}

export interface CreateBlogGeneratorInput {
        growthHubId: string;
        generatorKey?: string;
    generatorName?: string;
    generatorStatus?: string;
}

export interface SeoAssistantSummary {
    id: string;
    hubName?: string;
        assistantKey: string;
    assistantName: string;
    assistantStatus: string;
    status: string;
}

export interface CreateSeoAssistantInput {
        growthHubId: string;
        assistantKey?: string;
    assistantName?: string;
    assistantStatus?: string;
}

export interface CtaGeneratorSummary {
    id: string;
    hubName?: string;
        generatorKey: string;
    generatorName: string;
    generatorStatus: string;
    status: string;
}

export interface CreateCtaGeneratorInput {
        growthHubId: string;
        generatorKey?: string;
    generatorName?: string;
    generatorStatus?: string;
}

export interface GrowthMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    overallGrowthScore: number;
    brandHealthScore: number;
    status: string;
}

export interface CreateGrowthMetricInput {
        metricsKey?: string;
    overallGrowthScore?: number;
    brandHealthScore?: number;
}

export interface GrowthHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    brandStatus: string;
    status: string;
}

export interface CreateGrowthHealthInput {
        healthKey?: string;
    overallScore?: number;
    brandStatus?: string;
}

export interface ContentCalendarSummary {
    id: string;
    hubName?: string;
        calendarKey: string;
    calendarName: string;
    calendarStatus: string;
    status: string;
}

export interface CreateContentCalendarInput {
        growthHubId: string;
        calendarKey?: string;
    calendarName?: string;
    calendarStatus?: string;
}

export interface DraftQueueSummary {
    id: string;
    hubName?: string;
        queueKey: string;
    queueTitle: string;
    queueStatus: string;
    status: string;
}

export interface CreateDraftQueueInput {
        growthHubId: string;
        queueKey?: string;
    queueTitle?: string;
    queueStatus?: string;
}

export interface ApprovalQueueSummary {
    id: string;
    hubName?: string;
        queueKey: string;
    queueTitle: string;
    queueStatus: string;
    status: string;
}

export interface CreateApprovalQueueInput {
        growthHubId: string;
        queueKey?: string;
    queueTitle?: string;
    queueStatus?: string;
}

export interface PublishingQueueSummary {
    id: string;
    hubName?: string;
        queueKey: string;
    queueTitle: string;
    queueStatus: string;
    status: string;
}

export interface CreatePublishingQueueInput {
        growthHubId: string;
        queueKey?: string;
    queueTitle?: string;
    queueStatus?: string;
}

