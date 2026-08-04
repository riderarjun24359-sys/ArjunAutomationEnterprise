"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { growthEngineService } from "@/src/modules/growth-engine/services/growth-engine.service";
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
} from "@/src/modules/growth-engine/types";

export function useGrowthEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AageDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AagePipelineInfo | null>(null);
    const [growthHubs, setGrowthHubs] = useState<GrowthHubSummary[]>([]);
    const [brandProfiles, setBrandProfiles] = useState<BrandProfileSummary[]>([]);
    const [brandVoice, setBrandVoices] = useState<BrandVoiceSummary[]>([]);
    const [coreMessaging, setCoreMessagings] = useState<CoreMessagingSummary[]>([]);
    const [brandGuidelines, setBrandGuidelines] = useState<BrandGuidelineSummary[]>([]);
    const [logoLibrary, setLogoLibrarys] = useState<LogoLibrarySummary[]>([]);
    const [colorSystems, setColorSystems] = useState<ColorSystemSummary[]>([]);
    const [youtubeTemplates, setYoutubeTemplates] = useState<YoutubeTemplateSummary[]>([]);
    const [socialTemplates, setSocialTemplates] = useState<SocialTemplateSummary[]>([]);
    const [blogTemplates, setBlogTemplates] = useState<BlogTemplateSummary[]>([]);
    const [websiteArticleTemplates, setWebsiteArticleTemplates] = useState<WebsiteArticleTemplateSummary[]>([]);
    const [emailCampaignTemplates, setEmailCampaignTemplates] = useState<EmailCampaignTemplateSummary[]>([]);
    const [caseStudyTemplates, setCaseStudyTemplates] = useState<CaseStudyTemplateSummary[]>([]);
    const [imageAssets, setImageAssets] = useState<ImageAssetSummary[]>([]);
    const [videoAssets, setVideoAssets] = useState<VideoAssetSummary[]>([]);
    const [iconAssets, setIconAssets] = useState<IconAssetSummary[]>([]);
    const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfileSummary[]>([]);
    const [musicAssets, setMusicAssets] = useState<MusicAssetSummary[]>([]);
    const [thumbnailTemplates, setThumbnailTemplates] = useState<ThumbnailTemplateSummary[]>([]);
    const [ideaGenerators, setIdeaGenerators] = useState<IdeaGeneratorSummary[]>([]);
    const [scriptGenerators, setScriptGenerators] = useState<ScriptGeneratorSummary[]>([]);
    const [captionGenerators, setCaptionGenerators] = useState<CaptionGeneratorSummary[]>([]);
    const [blogGenerators, setBlogGenerators] = useState<BlogGeneratorSummary[]>([]);
    const [seoAssistants, setSeoAssistants] = useState<SeoAssistantSummary[]>([]);
    const [ctaGenerators, setCtaGenerators] = useState<CtaGeneratorSummary[]>([]);
    const [growthMetrics, setGrowthMetrics] = useState<GrowthMetricSummary[]>([]);
    const [growthHealth, setGrowthHealths] = useState<GrowthHealthSummary[]>([]);
    const [contentCalendar, setContentCalendars] = useState<ContentCalendarSummary[]>([]);
    const [draftQueue, setDraftQueues] = useState<DraftQueueSummary[]>([]);
    const [approvalQueue, setApprovalQueues] = useState<ApprovalQueueSummary[]>([]);
    const [publishingQueue, setPublishingQueues] = useState<PublishingQueueSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [growthHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
growthHubsList,
            brandProfilesList,
            brandVoiceList,
            coreMessagingList,
            brandGuidelinesList,
            logoLibraryList,
            colorSystemsList,
            youtubeTemplatesList,
            socialTemplatesList,
            blogTemplatesList,
            websiteArticleTemplatesList,
            emailCampaignTemplatesList,
            caseStudyTemplatesList,
            imageAssetsList,
            videoAssetsList,
            iconAssetsList,
            voiceProfilesList,
            musicAssetsList,
            thumbnailTemplatesList,
            ideaGeneratorsList,
            scriptGeneratorsList,
            captionGeneratorsList,
            blogGeneratorsList,
            seoAssistantsList,
            ctaGeneratorsList,
            growthMetricsList,
            growthHealthList,
            contentCalendarList,
            draftQueueList,
            approvalQueueList,
            publishingQueueList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            growthEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(growthEngineService.getPipelineInfo()),
            growthEngineService.getGrowthHubs(authUserId, email, fullName),
            growthEngineService.getBrandProfiles(authUserId, email, fullName),
            growthEngineService.getBrandVoices(authUserId, email, fullName),
            growthEngineService.getCoreMessagings(authUserId, email, fullName),
            growthEngineService.getBrandGuidelines(authUserId, email, fullName),
            growthEngineService.getLogoLibrarys(authUserId, email, fullName),
            growthEngineService.getColorSystems(authUserId, email, fullName),
            growthEngineService.getYoutubeTemplates(authUserId, email, fullName),
            growthEngineService.getSocialTemplates(authUserId, email, fullName),
            growthEngineService.getBlogTemplates(authUserId, email, fullName),
            growthEngineService.getWebsiteArticleTemplates(authUserId, email, fullName),
            growthEngineService.getEmailCampaignTemplates(authUserId, email, fullName),
            growthEngineService.getCaseStudyTemplates(authUserId, email, fullName),
            growthEngineService.getImageAssets(authUserId, email, fullName),
            growthEngineService.getVideoAssets(authUserId, email, fullName),
            growthEngineService.getIconAssets(authUserId, email, fullName),
            growthEngineService.getVoiceProfiles(authUserId, email, fullName),
            growthEngineService.getMusicAssets(authUserId, email, fullName),
            growthEngineService.getThumbnailTemplates(authUserId, email, fullName),
            growthEngineService.getIdeaGenerators(authUserId, email, fullName),
            growthEngineService.getScriptGenerators(authUserId, email, fullName),
            growthEngineService.getCaptionGenerators(authUserId, email, fullName),
            growthEngineService.getBlogGenerators(authUserId, email, fullName),
            growthEngineService.getSeoAssistants(authUserId, email, fullName),
            growthEngineService.getCtaGenerators(authUserId, email, fullName),
            growthEngineService.getGrowthMetrics(authUserId, email, fullName),
            growthEngineService.getGrowthHealths(authUserId, email, fullName),
            growthEngineService.getContentCalendars(authUserId, email, fullName),
            growthEngineService.getDraftQueues(authUserId, email, fullName),
            growthEngineService.getApprovalQueues(authUserId, email, fullName),
            growthEngineService.getPublishingQueues(authUserId, email, fullName),
            growthEngineService.getAuditLogs(authUserId, email, fullName),
            growthEngineService.getGrowthHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
growthHubsList,
            brandProfilesList,
            brandVoiceList,
            coreMessagingList,
            brandGuidelinesList,
            logoLibraryList,
            colorSystemsList,
            youtubeTemplatesList,
            socialTemplatesList,
            blogTemplatesList,
            websiteArticleTemplatesList,
            emailCampaignTemplatesList,
            caseStudyTemplatesList,
            imageAssetsList,
            videoAssetsList,
            iconAssetsList,
            voiceProfilesList,
            musicAssetsList,
            thumbnailTemplatesList,
            ideaGeneratorsList,
            scriptGeneratorsList,
            captionGeneratorsList,
            blogGeneratorsList,
            seoAssistantsList,
            ctaGeneratorsList,
            growthMetricsList,
            growthHealthList,
            contentCalendarList,
            draftQueueList,
            approvalQueueList,
            publishingQueueList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setGrowthHubs(result.growthHubsList);
        setBrandProfiles(result.brandProfilesList);
        setBrandVoices(result.brandVoiceList);
        setCoreMessagings(result.coreMessagingList);
        setBrandGuidelines(result.brandGuidelinesList);
        setLogoLibrarys(result.logoLibraryList);
        setColorSystems(result.colorSystemsList);
        setYoutubeTemplates(result.youtubeTemplatesList);
        setSocialTemplates(result.socialTemplatesList);
        setBlogTemplates(result.blogTemplatesList);
        setWebsiteArticleTemplates(result.websiteArticleTemplatesList);
        setEmailCampaignTemplates(result.emailCampaignTemplatesList);
        setCaseStudyTemplates(result.caseStudyTemplatesList);
        setImageAssets(result.imageAssetsList);
        setVideoAssets(result.videoAssetsList);
        setIconAssets(result.iconAssetsList);
        setVoiceProfiles(result.voiceProfilesList);
        setMusicAssets(result.musicAssetsList);
        setThumbnailTemplates(result.thumbnailTemplatesList);
        setIdeaGenerators(result.ideaGeneratorsList);
        setScriptGenerators(result.scriptGeneratorsList);
        setCaptionGenerators(result.captionGeneratorsList);
        setBlogGenerators(result.blogGeneratorsList);
        setSeoAssistants(result.seoAssistantsList);
        setCtaGenerators(result.ctaGeneratorsList);
        setGrowthMetrics(result.growthMetricsList);
        setGrowthHealths(result.growthHealthList);
        setContentCalendars(result.contentCalendarList);
        setDraftQueues(result.draftQueueList);
        setApprovalQueues(result.approvalQueueList);
        setPublishingQueues(result.publishingQueueList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createGrowthHub = useCallback(async (input: CreateGrowthHubInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createGrowthHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandProfile = useCallback(async (input: CreateBrandProfileInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBrandProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandVoice = useCallback(async (input: CreateBrandVoiceInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBrandVoice(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCoreMessaging = useCallback(async (input: CreateCoreMessagingInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCoreMessaging(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandGuideline = useCallback(async (input: CreateBrandGuidelineInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBrandGuideline(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLogoLibrary = useCallback(async (input: CreateLogoLibraryInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createLogoLibrary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createColorSystem = useCallback(async (input: CreateColorSystemInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createColorSystem(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createYoutubeTemplate = useCallback(async (input: CreateYoutubeTemplateInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createYoutubeTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSocialTemplate = useCallback(async (input: CreateSocialTemplateInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createSocialTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBlogTemplate = useCallback(async (input: CreateBlogTemplateInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBlogTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebsiteArticleTemplate = useCallback(async (input: CreateWebsiteArticleTemplateInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createWebsiteArticleTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEmailCampaignTemplate = useCallback(async (input: CreateEmailCampaignTemplateInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createEmailCampaignTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCaseStudyTemplate = useCallback(async (input: CreateCaseStudyTemplateInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCaseStudyTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createImageAsset = useCallback(async (input: CreateImageAssetInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createImageAsset(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVideoAsset = useCallback(async (input: CreateVideoAssetInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createVideoAsset(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIconAsset = useCallback(async (input: CreateIconAssetInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createIconAsset(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVoiceProfile = useCallback(async (input: CreateVoiceProfileInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createVoiceProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMusicAsset = useCallback(async (input: CreateMusicAssetInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createMusicAsset(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createThumbnailTemplate = useCallback(async (input: CreateThumbnailTemplateInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createThumbnailTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIdeaGenerator = useCallback(async (input: CreateIdeaGeneratorInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createIdeaGenerator(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createScriptGenerator = useCallback(async (input: CreateScriptGeneratorInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createScriptGenerator(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCaptionGenerator = useCallback(async (input: CreateCaptionGeneratorInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCaptionGenerator(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBlogGenerator = useCallback(async (input: CreateBlogGeneratorInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBlogGenerator(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSeoAssistant = useCallback(async (input: CreateSeoAssistantInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createSeoAssistant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCtaGenerator = useCallback(async (input: CreateCtaGeneratorInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCtaGenerator(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGrowthMetric = useCallback(async (input: CreateGrowthMetricInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createGrowthMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGrowthHealth = useCallback(async (input: CreateGrowthHealthInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createGrowthHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createContentCalendar = useCallback(async (input: CreateContentCalendarInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createContentCalendar(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDraftQueue = useCallback(async (input: CreateDraftQueueInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createDraftQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApprovalQueue = useCallback(async (input: CreateApprovalQueueInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createApprovalQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPublishingQueue = useCallback(async (input: CreatePublishingQueueInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createPublishingQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        growthHubs,
        createGrowthHub,
        brandProfiles,
        createBrandProfile,
        brandVoice,
        createBrandVoice,
        coreMessaging,
        createCoreMessaging,
        brandGuidelines,
        createBrandGuideline,
        logoLibrary,
        createLogoLibrary,
        colorSystems,
        createColorSystem,
        youtubeTemplates,
        createYoutubeTemplate,
        socialTemplates,
        createSocialTemplate,
        blogTemplates,
        createBlogTemplate,
        websiteArticleTemplates,
        createWebsiteArticleTemplate,
        emailCampaignTemplates,
        createEmailCampaignTemplate,
        caseStudyTemplates,
        createCaseStudyTemplate,
        imageAssets,
        createImageAsset,
        videoAssets,
        createVideoAsset,
        iconAssets,
        createIconAsset,
        voiceProfiles,
        createVoiceProfile,
        musicAssets,
        createMusicAsset,
        thumbnailTemplates,
        createThumbnailTemplate,
        ideaGenerators,
        createIdeaGenerator,
        scriptGenerators,
        createScriptGenerator,
        captionGenerators,
        createCaptionGenerator,
        blogGenerators,
        createBlogGenerator,
        seoAssistants,
        createSeoAssistant,
        ctaGenerators,
        createCtaGenerator,
        growthMetrics,
        createGrowthMetric,
        growthHealth,
        createGrowthHealth,
        contentCalendar,
        createContentCalendar,
        draftQueue,
        createDraftQueue,
        approvalQueue,
        createApprovalQueue,
        publishingQueue,
        createPublishingQueue,
        auditLogs,
        growthHubOptions,
        refresh,
    };
}
