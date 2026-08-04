"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { growthEngineService } from "@/src/modules/growth-engine/services/growth-engine.service";
import type {
    OperationsHubSummary,
    CreateOperationsHubInput,
    BrandKnowledgeBaseSummary,
    CreateBrandKnowledgeBaseInput,
    BrandRulebookSummary,
    CreateBrandRulebookInput,
    MessagingLibrarySummary,
    CreateMessagingLibraryInput,
    ServiceLibrarySummary,
    CreateServiceLibraryInput,
    IndustryLibrarySummary,
    CreateIndustryLibraryInput,
    FaqLibrarySummary,
    CreateFaqLibraryInput,
    BrandApprovalRuleSummary,
    CreateBrandApprovalRuleInput,
    VideoProjectSummary,
    CreateVideoProjectInput,
    ThumbnailManagerSummary,
    CreateThumbnailManagerInput,
    VoiceoverManagerSummary,
    CreateVoiceoverManagerInput,
    CreativeAssetGeneratorSummary,
    CreateCreativeAssetGeneratorInput,
    CampaignAssetBuilderSummary,
    CreateCampaignAssetBuilderInput,
    CreativeWorkflowSummary,
    CreateCreativeWorkflowInput,
    DistributionContentQueueSummary,
    CreateDistributionContentQueueInput,
    DistributionPublishingQueueSummary,
    CreateDistributionPublishingQueueInput,
    ChannelManagerSummary,
    CreateChannelManagerInput,
    ApprovalCenterSummary,
    CreateApprovalCenterInput,
    PublishingHistorySummary,
    CreatePublishingHistoryInput,
    DistributionAnalyticsSummary,
    CreateDistributionAnalyticsInput,
    CampaignDashboardSummary,
    CreateCampaignDashboardInput,
    ContentPerformanceSummary,
    CreateContentPerformanceInput,
    LeadAttributionSummary,
    CreateLeadAttributionInput,
    GrowthKpiSummary,
    CreateGrowthKpiInput,
    RoiDashboardSummary,
    CreateRoiDashboardInput,
    RecommendationEngineSummary,
    CreateRecommendationEngineInput,
    CommandCenterMetricSummary,
    CreateCommandCenterMetricInput,
    CommandCenterHealthSummary,
    CreateCommandCenterHealthInput,
    MissionStatusSummary,
    CreateMissionStatusInput,
    ExecutiveSummarySummary,
    CreateExecutiveSummaryInput,
    OperationalFailureSummary,
    CreateOperationalFailureInput,
    AuditEntry,
    AagoDashboardStats,
    AagoPipelineInfo,
} from "@/src/modules/growth-engine/types";

export function useGrowthEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AagoDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AagoPipelineInfo | null>(null);
    const [operationsHubs, setOperationsHubs] = useState<OperationsHubSummary[]>([]);
    const [brandKnowledgeBase, setBrandKnowledgeBases] = useState<BrandKnowledgeBaseSummary[]>([]);
    const [brandRulebook, setBrandRulebooks] = useState<BrandRulebookSummary[]>([]);
    const [messagingLibrary, setMessagingLibrarys] = useState<MessagingLibrarySummary[]>([]);
    const [serviceLibrary, setServiceLibrarys] = useState<ServiceLibrarySummary[]>([]);
    const [industryLibrary, setIndustryLibrarys] = useState<IndustryLibrarySummary[]>([]);
    const [faqLibrary, setFaqLibrarys] = useState<FaqLibrarySummary[]>([]);
    const [brandApprovalRules, setBrandApprovalRules] = useState<BrandApprovalRuleSummary[]>([]);
    const [videoProjects, setVideoProjects] = useState<VideoProjectSummary[]>([]);
    const [thumbnailManager, setThumbnailManagers] = useState<ThumbnailManagerSummary[]>([]);
    const [voiceoverManager, setVoiceoverManagers] = useState<VoiceoverManagerSummary[]>([]);
    const [creativeAssetGenerator, setCreativeAssetGenerators] = useState<CreativeAssetGeneratorSummary[]>([]);
    const [campaignAssetBuilder, setCampaignAssetBuilders] = useState<CampaignAssetBuilderSummary[]>([]);
    const [creativeWorkflows, setCreativeWorkflows] = useState<CreativeWorkflowSummary[]>([]);
    const [distributionContentQueue, setDistributionContentQueues] = useState<DistributionContentQueueSummary[]>([]);
    const [distributionPublishingQueue, setDistributionPublishingQueues] = useState<DistributionPublishingQueueSummary[]>([]);
    const [channelManager, setChannelManagers] = useState<ChannelManagerSummary[]>([]);
    const [approvalCenter, setApprovalCenters] = useState<ApprovalCenterSummary[]>([]);
    const [publishingHistory, setPublishingHistorys] = useState<PublishingHistorySummary[]>([]);
    const [distributionAnalytics, setDistributionAnalyticss] = useState<DistributionAnalyticsSummary[]>([]);
    const [campaignDashboard, setCampaignDashboards] = useState<CampaignDashboardSummary[]>([]);
    const [contentPerformance, setContentPerformances] = useState<ContentPerformanceSummary[]>([]);
    const [leadAttribution, setLeadAttributions] = useState<LeadAttributionSummary[]>([]);
    const [growthKpis, setGrowthKpis] = useState<GrowthKpiSummary[]>([]);
    const [roiDashboard, setRoiDashboards] = useState<RoiDashboardSummary[]>([]);
    const [recommendationEngine, setRecommendationEngines] = useState<RecommendationEngineSummary[]>([]);
    const [commandCenterMetrics, setCommandCenterMetrics] = useState<CommandCenterMetricSummary[]>([]);
    const [commandCenterHealth, setCommandCenterHealths] = useState<CommandCenterHealthSummary[]>([]);
    const [missionStatus, setMissionStatuss] = useState<MissionStatusSummary[]>([]);
    const [executiveSummaries, setExecutiveSummarys] = useState<ExecutiveSummarySummary[]>([]);
    const [operationalFailures, setOperationalFailures] = useState<OperationalFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [operationsHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
operationsHubsList,
            brandKnowledgeBaseList,
            brandRulebookList,
            messagingLibraryList,
            serviceLibraryList,
            industryLibraryList,
            faqLibraryList,
            brandApprovalRulesList,
            videoProjectsList,
            thumbnailManagerList,
            voiceoverManagerList,
            creativeAssetGeneratorList,
            campaignAssetBuilderList,
            creativeWorkflowsList,
            distributionContentQueueList,
            distributionPublishingQueueList,
            channelManagerList,
            approvalCenterList,
            publishingHistoryList,
            distributionAnalyticsList,
            campaignDashboardList,
            contentPerformanceList,
            leadAttributionList,
            growthKpisList,
            roiDashboardList,
            recommendationEngineList,
            commandCenterMetricsList,
            commandCenterHealthList,
            missionStatusList,
            executiveSummariesList,
            operationalFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            growthEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(growthEngineService.getPipelineInfo()),
            growthEngineService.getOperationsHubs(authUserId, email, fullName),
            growthEngineService.getBrandKnowledgeBases(authUserId, email, fullName),
            growthEngineService.getBrandRulebooks(authUserId, email, fullName),
            growthEngineService.getMessagingLibrarys(authUserId, email, fullName),
            growthEngineService.getServiceLibrarys(authUserId, email, fullName),
            growthEngineService.getIndustryLibrarys(authUserId, email, fullName),
            growthEngineService.getFaqLibrarys(authUserId, email, fullName),
            growthEngineService.getBrandApprovalRules(authUserId, email, fullName),
            growthEngineService.getVideoProjects(authUserId, email, fullName),
            growthEngineService.getThumbnailManagers(authUserId, email, fullName),
            growthEngineService.getVoiceoverManagers(authUserId, email, fullName),
            growthEngineService.getCreativeAssetGenerators(authUserId, email, fullName),
            growthEngineService.getCampaignAssetBuilders(authUserId, email, fullName),
            growthEngineService.getCreativeWorkflows(authUserId, email, fullName),
            growthEngineService.getDistributionContentQueues(authUserId, email, fullName),
            growthEngineService.getDistributionPublishingQueues(authUserId, email, fullName),
            growthEngineService.getChannelManagers(authUserId, email, fullName),
            growthEngineService.getApprovalCenters(authUserId, email, fullName),
            growthEngineService.getPublishingHistorys(authUserId, email, fullName),
            growthEngineService.getDistributionAnalyticss(authUserId, email, fullName),
            growthEngineService.getCampaignDashboards(authUserId, email, fullName),
            growthEngineService.getContentPerformances(authUserId, email, fullName),
            growthEngineService.getLeadAttributions(authUserId, email, fullName),
            growthEngineService.getGrowthKpis(authUserId, email, fullName),
            growthEngineService.getRoiDashboards(authUserId, email, fullName),
            growthEngineService.getRecommendationEngines(authUserId, email, fullName),
            growthEngineService.getCommandCenterMetrics(authUserId, email, fullName),
            growthEngineService.getCommandCenterHealths(authUserId, email, fullName),
            growthEngineService.getMissionStatuss(authUserId, email, fullName),
            growthEngineService.getExecutiveSummarys(authUserId, email, fullName),
            growthEngineService.getOperationalFailures(authUserId, email, fullName),
            growthEngineService.getAuditLogs(authUserId, email, fullName),
            growthEngineService.getOperationsHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
operationsHubsList,
            brandKnowledgeBaseList,
            brandRulebookList,
            messagingLibraryList,
            serviceLibraryList,
            industryLibraryList,
            faqLibraryList,
            brandApprovalRulesList,
            videoProjectsList,
            thumbnailManagerList,
            voiceoverManagerList,
            creativeAssetGeneratorList,
            campaignAssetBuilderList,
            creativeWorkflowsList,
            distributionContentQueueList,
            distributionPublishingQueueList,
            channelManagerList,
            approvalCenterList,
            publishingHistoryList,
            distributionAnalyticsList,
            campaignDashboardList,
            contentPerformanceList,
            leadAttributionList,
            growthKpisList,
            roiDashboardList,
            recommendationEngineList,
            commandCenterMetricsList,
            commandCenterHealthList,
            missionStatusList,
            executiveSummariesList,
            operationalFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setOperationsHubs(result.operationsHubsList);
        setBrandKnowledgeBases(result.brandKnowledgeBaseList);
        setBrandRulebooks(result.brandRulebookList);
        setMessagingLibrarys(result.messagingLibraryList);
        setServiceLibrarys(result.serviceLibraryList);
        setIndustryLibrarys(result.industryLibraryList);
        setFaqLibrarys(result.faqLibraryList);
        setBrandApprovalRules(result.brandApprovalRulesList);
        setVideoProjects(result.videoProjectsList);
        setThumbnailManagers(result.thumbnailManagerList);
        setVoiceoverManagers(result.voiceoverManagerList);
        setCreativeAssetGenerators(result.creativeAssetGeneratorList);
        setCampaignAssetBuilders(result.campaignAssetBuilderList);
        setCreativeWorkflows(result.creativeWorkflowsList);
        setDistributionContentQueues(result.distributionContentQueueList);
        setDistributionPublishingQueues(result.distributionPublishingQueueList);
        setChannelManagers(result.channelManagerList);
        setApprovalCenters(result.approvalCenterList);
        setPublishingHistorys(result.publishingHistoryList);
        setDistributionAnalyticss(result.distributionAnalyticsList);
        setCampaignDashboards(result.campaignDashboardList);
        setContentPerformances(result.contentPerformanceList);
        setLeadAttributions(result.leadAttributionList);
        setGrowthKpis(result.growthKpisList);
        setRoiDashboards(result.roiDashboardList);
        setRecommendationEngines(result.recommendationEngineList);
        setCommandCenterMetrics(result.commandCenterMetricsList);
        setCommandCenterHealths(result.commandCenterHealthList);
        setMissionStatuss(result.missionStatusList);
        setExecutiveSummarys(result.executiveSummariesList);
        setOperationalFailures(result.operationalFailuresList);
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

    const createOperationsHub = useCallback(async (input: CreateOperationsHubInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createOperationsHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandKnowledgeBase = useCallback(async (input: CreateBrandKnowledgeBaseInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBrandKnowledgeBase(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandRulebook = useCallback(async (input: CreateBrandRulebookInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBrandRulebook(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMessagingLibrary = useCallback(async (input: CreateMessagingLibraryInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createMessagingLibrary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createServiceLibrary = useCallback(async (input: CreateServiceLibraryInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createServiceLibrary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryLibrary = useCallback(async (input: CreateIndustryLibraryInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createIndustryLibrary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFaqLibrary = useCallback(async (input: CreateFaqLibraryInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createFaqLibrary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandApprovalRule = useCallback(async (input: CreateBrandApprovalRuleInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createBrandApprovalRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVideoProject = useCallback(async (input: CreateVideoProjectInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createVideoProject(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createThumbnailManager = useCallback(async (input: CreateThumbnailManagerInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createThumbnailManager(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVoiceoverManager = useCallback(async (input: CreateVoiceoverManagerInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createVoiceoverManager(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCreativeAssetGenerator = useCallback(async (input: CreateCreativeAssetGeneratorInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCreativeAssetGenerator(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampaignAssetBuilder = useCallback(async (input: CreateCampaignAssetBuilderInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCampaignAssetBuilder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCreativeWorkflow = useCallback(async (input: CreateCreativeWorkflowInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCreativeWorkflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDistributionContentQueue = useCallback(async (input: CreateDistributionContentQueueInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createDistributionContentQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDistributionPublishingQueue = useCallback(async (input: CreateDistributionPublishingQueueInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createDistributionPublishingQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createChannelManager = useCallback(async (input: CreateChannelManagerInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createChannelManager(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApprovalCenter = useCallback(async (input: CreateApprovalCenterInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createApprovalCenter(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPublishingHistory = useCallback(async (input: CreatePublishingHistoryInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createPublishingHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDistributionAnalytics = useCallback(async (input: CreateDistributionAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createDistributionAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampaignDashboard = useCallback(async (input: CreateCampaignDashboardInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCampaignDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createContentPerformance = useCallback(async (input: CreateContentPerformanceInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createContentPerformance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLeadAttribution = useCallback(async (input: CreateLeadAttributionInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createLeadAttribution(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGrowthKpi = useCallback(async (input: CreateGrowthKpiInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createGrowthKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRoiDashboard = useCallback(async (input: CreateRoiDashboardInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createRoiDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRecommendationEngine = useCallback(async (input: CreateRecommendationEngineInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createRecommendationEngine(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommandCenterMetric = useCallback(async (input: CreateCommandCenterMetricInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCommandCenterMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommandCenterHealth = useCallback(async (input: CreateCommandCenterHealthInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createCommandCenterHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMissionStatus = useCallback(async (input: CreateMissionStatusInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createMissionStatus(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveSummary = useCallback(async (input: CreateExecutiveSummaryInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createExecutiveSummary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationalFailure = useCallback(async (input: CreateOperationalFailureInput) => { if (!user) throw new Error("Authentication required"); await growthEngineService.createOperationalFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        operationsHubs,
        createOperationsHub,
        brandKnowledgeBase,
        createBrandKnowledgeBase,
        brandRulebook,
        createBrandRulebook,
        messagingLibrary,
        createMessagingLibrary,
        serviceLibrary,
        createServiceLibrary,
        industryLibrary,
        createIndustryLibrary,
        faqLibrary,
        createFaqLibrary,
        brandApprovalRules,
        createBrandApprovalRule,
        videoProjects,
        createVideoProject,
        thumbnailManager,
        createThumbnailManager,
        voiceoverManager,
        createVoiceoverManager,
        creativeAssetGenerator,
        createCreativeAssetGenerator,
        campaignAssetBuilder,
        createCampaignAssetBuilder,
        creativeWorkflows,
        createCreativeWorkflow,
        distributionContentQueue,
        createDistributionContentQueue,
        distributionPublishingQueue,
        createDistributionPublishingQueue,
        channelManager,
        createChannelManager,
        approvalCenter,
        createApprovalCenter,
        publishingHistory,
        createPublishingHistory,
        distributionAnalytics,
        createDistributionAnalytics,
        campaignDashboard,
        createCampaignDashboard,
        contentPerformance,
        createContentPerformance,
        leadAttribution,
        createLeadAttribution,
        growthKpis,
        createGrowthKpi,
        roiDashboard,
        createRoiDashboard,
        recommendationEngine,
        createRecommendationEngine,
        commandCenterMetrics,
        createCommandCenterMetric,
        commandCenterHealth,
        createCommandCenterHealth,
        missionStatus,
        createMissionStatus,
        executiveSummaries,
        createExecutiveSummary,
        operationalFailures,
        createOperationalFailure,
        auditLogs,
        operationsHubOptions,
        refresh,
    };
}
