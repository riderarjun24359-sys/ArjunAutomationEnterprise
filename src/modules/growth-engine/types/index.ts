export interface AagoDashboardStats {
    totalOperationsHubs: number;
    activeOperationsHubs: number;
    brandKnowledgeBaseCount: number;
    videoProjectCount: number;
    distributionContentQueueCount: number;
    campaignDashboardCount: number;
    missionStatusCount: number;
    overallOperationsScore: number;
    missionStatusScore: number;
    contentStatusScore: number;
    publishingStatusScore: number;
    growthMetricsScore: number;
    campaignHealthScore: number;
    executiveSummaryScore: number;
    openOperationalFailureCount: number;
    auditCount: number;
}

export interface AagoPipelineInfo {
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

export interface AagoSdkRunBrandOsServiceInput { operationsHubId: string; knowledgeKey?: string; knowledgeTitle?: string; }
export interface AagoSdkRunBrandOsServiceResult { knowledgeId: string; knowledgeKey: string; status: string; }
export interface AagoSdkRunCreativeStudioServiceInput { operationsHubId: string; projectKey?: string; projectName?: string; }
export interface AagoSdkRunCreativeStudioServiceResult { projectId: string; projectKey: string; status: string; }
export interface AagoSdkRunDistributionServiceInput { operationsHubId: string; queueKey?: string; queueTitle?: string; }
export interface AagoSdkRunDistributionServiceResult { queueId: string; queueKey: string; status: string; }
export interface AagoSdkRunGrowthIntelligenceServiceInput { operationsHubId: string; dashboardKey?: string; dashboardName?: string; }
export interface AagoSdkRunGrowthIntelligenceServiceResult { dashboardId: string; dashboardKey: string; status: string; }
export interface AagoSdkRunCommandCenterServiceInput { operationsHubId: string; missionKey?: string; missionName?: string; }
export interface AagoSdkRunCommandCenterServiceResult { missionId: string; missionKey: string; status: string; }

export interface OperationsHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateOperationsHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface BrandKnowledgeBaseSummary {
    id: string;
    hubName?: string;
        knowledgeKey: string;
    knowledgeTitle: string;
    knowledgeStatus: string;
    status: string;
}

export interface CreateBrandKnowledgeBaseInput {
        operationsHubId: string;
        knowledgeKey?: string;
    knowledgeTitle?: string;
    knowledgeStatus?: string;
}

export interface BrandRulebookSummary {
    id: string;
    hubName?: string;
        rulebookKey: string;
    rulebookName: string;
    rulebookStatus: string;
    status: string;
}

export interface CreateBrandRulebookInput {
        operationsHubId: string;
        rulebookKey?: string;
    rulebookName?: string;
    rulebookStatus?: string;
}

export interface MessagingLibrarySummary {
    id: string;
    hubName?: string;
        messageKey: string;
    messageTitle: string;
    messageStatus: string;
    status: string;
}

export interface CreateMessagingLibraryInput {
        operationsHubId: string;
        messageKey?: string;
    messageTitle?: string;
    messageStatus?: string;
}

export interface ServiceLibrarySummary {
    id: string;
    hubName?: string;
        serviceKey: string;
    serviceName: string;
    serviceStatus: string;
    status: string;
}

export interface CreateServiceLibraryInput {
        operationsHubId: string;
        serviceKey?: string;
    serviceName?: string;
    serviceStatus?: string;
}

export interface IndustryLibrarySummary {
    id: string;
    hubName?: string;
        industryKey: string;
    industryName: string;
    industryStatus: string;
    status: string;
}

export interface CreateIndustryLibraryInput {
        operationsHubId: string;
        industryKey?: string;
    industryName?: string;
    industryStatus?: string;
}

export interface FaqLibrarySummary {
    id: string;
    hubName?: string;
        faqKey: string;
    faqQuestion: string;
    faqStatus: string;
    status: string;
}

export interface CreateFaqLibraryInput {
        operationsHubId: string;
        faqKey?: string;
    faqQuestion?: string;
    faqStatus?: string;
}

export interface BrandApprovalRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    ruleStatus: string;
    status: string;
}

export interface CreateBrandApprovalRuleInput {
        operationsHubId: string;
        ruleKey?: string;
    ruleName?: string;
    ruleStatus?: string;
}

export interface VideoProjectSummary {
    id: string;
    hubName?: string;
        projectKey: string;
    projectName: string;
    projectStatus: string;
    status: string;
}

export interface CreateVideoProjectInput {
        operationsHubId: string;
        projectKey?: string;
    projectName?: string;
    projectStatus?: string;
}

export interface ThumbnailManagerSummary {
    id: string;
    hubName?: string;
        thumbnailKey: string;
    thumbnailName: string;
    thumbnailStatus: string;
    status: string;
}

export interface CreateThumbnailManagerInput {
        operationsHubId: string;
        thumbnailKey?: string;
    thumbnailName?: string;
    thumbnailStatus?: string;
}

export interface VoiceoverManagerSummary {
    id: string;
    hubName?: string;
        voiceoverKey: string;
    voiceoverName: string;
    voiceoverStatus: string;
    status: string;
}

export interface CreateVoiceoverManagerInput {
        operationsHubId: string;
        voiceoverKey?: string;
    voiceoverName?: string;
    voiceoverStatus?: string;
}

export interface CreativeAssetGeneratorSummary {
    id: string;
    hubName?: string;
        generatorKey: string;
    generatorName: string;
    generatorStatus: string;
    status: string;
}

export interface CreateCreativeAssetGeneratorInput {
        operationsHubId: string;
        generatorKey?: string;
    generatorName?: string;
    generatorStatus?: string;
}

export interface CampaignAssetBuilderSummary {
    id: string;
    hubName?: string;
        builderKey: string;
    builderName: string;
    builderStatus: string;
    status: string;
}

export interface CreateCampaignAssetBuilderInput {
        operationsHubId: string;
        builderKey?: string;
    builderName?: string;
    builderStatus?: string;
}

export interface CreativeWorkflowSummary {
    id: string;
    hubName?: string;
        workflowKey: string;
    workflowName: string;
    workflowStatus: string;
    status: string;
}

export interface CreateCreativeWorkflowInput {
        operationsHubId: string;
        workflowKey?: string;
    workflowName?: string;
    workflowStatus?: string;
}

export interface DistributionContentQueueSummary {
    id: string;
    hubName?: string;
        queueKey: string;
    queueTitle: string;
    queueStatus: string;
    status: string;
}

export interface CreateDistributionContentQueueInput {
        operationsHubId: string;
        queueKey?: string;
    queueTitle?: string;
    queueStatus?: string;
}

export interface DistributionPublishingQueueSummary {
    id: string;
    hubName?: string;
        queueKey: string;
    queueTitle: string;
    queueStatus: string;
    status: string;
}

export interface CreateDistributionPublishingQueueInput {
        operationsHubId: string;
        queueKey?: string;
    queueTitle?: string;
    queueStatus?: string;
}

export interface ChannelManagerSummary {
    id: string;
    hubName?: string;
        channelKey: string;
    channelName: string;
    channelStatus: string;
    status: string;
}

export interface CreateChannelManagerInput {
        operationsHubId: string;
        channelKey?: string;
    channelName?: string;
    channelStatus?: string;
}

export interface ApprovalCenterSummary {
    id: string;
    hubName?: string;
        approvalKey: string;
    approvalTitle: string;
    approvalStatus: string;
    status: string;
}

export interface CreateApprovalCenterInput {
        operationsHubId: string;
        approvalKey?: string;
    approvalTitle?: string;
    approvalStatus?: string;
}

export interface PublishingHistorySummary {
    id: string;
    hubName?: string;
        historyKey: string;
    historyTitle: string;
    historyStatus: string;
    status: string;
}

export interface CreatePublishingHistoryInput {
        operationsHubId: string;
        historyKey?: string;
    historyTitle?: string;
    historyStatus?: string;
}

export interface DistributionAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsName: string;
    analyticsScore: number;
    status: string;
}

export interface CreateDistributionAnalyticsInput {
        operationsHubId: string;
        analyticsKey?: string;
    analyticsName?: string;
    analyticsScore?: number;
}

export interface CampaignDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardStatus: string;
    status: string;
}

export interface CreateCampaignDashboardInput {
        operationsHubId: string;
        dashboardKey?: string;
    dashboardName?: string;
    dashboardStatus?: string;
}

export interface ContentPerformanceSummary {
    id: string;
    hubName?: string;
        performanceKey: string;
    performanceTitle: string;
    performanceScore: number;
    status: string;
}

export interface CreateContentPerformanceInput {
        operationsHubId: string;
        performanceKey?: string;
    performanceTitle?: string;
    performanceScore?: number;
}

export interface LeadAttributionSummary {
    id: string;
    hubName?: string;
        attributionKey: string;
    attributionTitle: string;
    attributionStatus: string;
    status: string;
}

export interface CreateLeadAttributionInput {
        operationsHubId: string;
        attributionKey?: string;
    attributionTitle?: string;
    attributionStatus?: string;
}

export interface GrowthKpiSummary {
    id: string;
    hubName?: string;
        kpiKey: string;
    kpiName: string;
    kpiValue: number;
    status: string;
}

export interface CreateGrowthKpiInput {
        operationsHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiValue?: number;
}

export interface RoiDashboardSummary {
    id: string;
    hubName?: string;
        roiKey: string;
    roiName: string;
    roiScore: number;
    status: string;
}

export interface CreateRoiDashboardInput {
        operationsHubId: string;
        roiKey?: string;
    roiName?: string;
    roiScore?: number;
}

export interface RecommendationEngineSummary {
    id: string;
    hubName?: string;
        recommendationKey: string;
    recommendationTitle: string;
    recommendationStatus: string;
    status: string;
}

export interface CreateRecommendationEngineInput {
        operationsHubId: string;
        recommendationKey?: string;
    recommendationTitle?: string;
    recommendationStatus?: string;
}

export interface CommandCenterMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    overallOperationsScore: number;
    missionStatusScore: number;
    status: string;
}

export interface CreateCommandCenterMetricInput {
        metricsKey?: string;
    overallOperationsScore?: number;
    missionStatusScore?: number;
}

export interface CommandCenterHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    brandOsStatus: string;
    status: string;
}

export interface CreateCommandCenterHealthInput {
        healthKey?: string;
    overallScore?: number;
    brandOsStatus?: string;
}

export interface MissionStatusSummary {
    id: string;
    hubName?: string;
        missionKey: string;
    missionName: string;
    missionStatus: string;
    status: string;
}

export interface CreateMissionStatusInput {
        operationsHubId: string;
        missionKey?: string;
    missionName?: string;
    missionStatus?: string;
}

export interface ExecutiveSummarySummary {
    id: string;
    hubName?: string;
        summaryKey: string;
    summaryTitle: string;
    summaryStatus: string;
    status: string;
}

export interface CreateExecutiveSummaryInput {
        operationsHubId: string;
        summaryKey?: string;
    summaryTitle?: string;
    summaryStatus?: string;
}

export interface OperationalFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateOperationalFailureInput {
        operationsHubId: string;
        failureKey?: string;
    failureType?: string;
}

