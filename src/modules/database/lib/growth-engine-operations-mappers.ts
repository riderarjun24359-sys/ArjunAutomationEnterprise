import type { DbAagoOperationsHub,
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
    DbAagoAuditLog } from "@/src/modules/database/types/platform";
import type { CreateOperationsHubInput,
    OperationsHubSummary,
    CreateBrandKnowledgeBaseInput,
    BrandKnowledgeBaseSummary,
    CreateBrandRulebookInput,
    BrandRulebookSummary,
    CreateMessagingLibraryInput,
    MessagingLibrarySummary,
    CreateServiceLibraryInput,
    ServiceLibrarySummary,
    CreateIndustryLibraryInput,
    IndustryLibrarySummary,
    CreateFaqLibraryInput,
    FaqLibrarySummary,
    CreateBrandApprovalRuleInput,
    BrandApprovalRuleSummary,
    CreateVideoProjectInput,
    VideoProjectSummary,
    CreateThumbnailManagerInput,
    ThumbnailManagerSummary,
    CreateVoiceoverManagerInput,
    VoiceoverManagerSummary,
    CreateCreativeAssetGeneratorInput,
    CreativeAssetGeneratorSummary,
    CreateCampaignAssetBuilderInput,
    CampaignAssetBuilderSummary,
    CreateCreativeWorkflowInput,
    CreativeWorkflowSummary,
    CreateDistributionContentQueueInput,
    DistributionContentQueueSummary,
    CreateDistributionPublishingQueueInput,
    DistributionPublishingQueueSummary,
    CreateChannelManagerInput,
    ChannelManagerSummary,
    CreateApprovalCenterInput,
    ApprovalCenterSummary,
    CreatePublishingHistoryInput,
    PublishingHistorySummary,
    CreateDistributionAnalyticsInput,
    DistributionAnalyticsSummary,
    CreateCampaignDashboardInput,
    CampaignDashboardSummary,
    CreateContentPerformanceInput,
    ContentPerformanceSummary,
    CreateLeadAttributionInput,
    LeadAttributionSummary,
    CreateGrowthKpiInput,
    GrowthKpiSummary,
    CreateRoiDashboardInput,
    RoiDashboardSummary,
    CreateRecommendationEngineInput,
    RecommendationEngineSummary,
    CreateCommandCenterMetricInput,
    CommandCenterMetricSummary,
    CreateCommandCenterHealthInput,
    CommandCenterHealthSummary,
    CreateMissionStatusInput,
    MissionStatusSummary,
    CreateExecutiveSummaryInput,
    ExecutiveSummarySummary,
    CreateOperationalFailureInput,
    OperationalFailureSummary,
    AagoDashboardStats,
    AagoPipelineInfo,
    AuditEntry } from "@/src/modules/growth-engine/types";

export function buildOperationsHubLookupMaps(hubs: DbAagoOperationsHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildAagoPipelineInfo(): AagoPipelineInfo {
    const stages = [
        { key: "brand_os", label: "Brand OS" },
        { key: "creative_studio", label: "Creative Studio" },
        { key: "distribution_hub", label: "Distribution Hub" },
        { key: "growth_intelligence", label: "Growth Intelligence" },
        { key: "founder_command_center", label: "Founder Command Center" },
    ];
    return { stages, currentStage: "creative_studio", nextStage: "distribution_hub", previousStage: "brand_os" };
}

export function buildAagoAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbAagoAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapOperationsHubSummary(record: DbAagoOperationsHub): OperationsHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildOperationsHubPayload(organizationId: string, input: CreateOperationsHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapBrandKnowledgeBaseSummary(record: DbAagoBrandKnowledgeBase, maps?: { hubNameById: Map<string, string> }): BrandKnowledgeBaseSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        knowledgeKey: record.knowledge_key as string,
        knowledgeTitle: record.knowledge_title as string,
        knowledgeStatus: record.knowledge_status as string,
        status: record.status,
    };
}

export function buildBrandKnowledgeBasePayload(organizationId: string, input: CreateBrandKnowledgeBaseInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        knowledge_key: input.knowledgeKey ?? '',
        knowledge_title: input.knowledgeTitle ?? '',
        knowledge_status: input.knowledgeStatus ?? '',
        status: "active",
    };
}

export function mapBrandRulebookSummary(record: DbAagoBrandRulebook, maps?: { hubNameById: Map<string, string> }): BrandRulebookSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        rulebookKey: record.rulebook_key as string,
        rulebookName: record.rulebook_name as string,
        rulebookStatus: record.rulebook_status as string,
        status: record.status,
    };
}

export function buildBrandRulebookPayload(organizationId: string, input: CreateBrandRulebookInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        rulebook_key: input.rulebookKey ?? '',
        rulebook_name: input.rulebookName ?? '',
        rulebook_status: input.rulebookStatus ?? '',
        status: "active",
    };
}

export function mapMessagingLibrarySummary(record: DbAagoMessagingLibrary, maps?: { hubNameById: Map<string, string> }): MessagingLibrarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        messageKey: record.message_key as string,
        messageTitle: record.message_title as string,
        messageStatus: record.message_status as string,
        status: record.status,
    };
}

export function buildMessagingLibraryPayload(organizationId: string, input: CreateMessagingLibraryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        message_key: input.messageKey ?? '',
        message_title: input.messageTitle ?? '',
        message_status: input.messageStatus ?? '',
        status: "active",
    };
}

export function mapServiceLibrarySummary(record: DbAagoServiceLibrary, maps?: { hubNameById: Map<string, string> }): ServiceLibrarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        serviceKey: record.service_key as string,
        serviceName: record.service_name as string,
        serviceStatus: record.service_status as string,
        status: record.status,
    };
}

export function buildServiceLibraryPayload(organizationId: string, input: CreateServiceLibraryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        service_key: input.serviceKey ?? '',
        service_name: input.serviceName ?? '',
        service_status: input.serviceStatus ?? '',
        status: "active",
    };
}

export function mapIndustryLibrarySummary(record: DbAagoIndustryLibrary, maps?: { hubNameById: Map<string, string> }): IndustryLibrarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        industryKey: record.industry_key as string,
        industryName: record.industry_name as string,
        industryStatus: record.industry_status as string,
        status: record.status,
    };
}

export function buildIndustryLibraryPayload(organizationId: string, input: CreateIndustryLibraryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        industry_key: input.industryKey ?? '',
        industry_name: input.industryName ?? '',
        industry_status: input.industryStatus ?? '',
        status: "active",
    };
}

export function mapFaqLibrarySummary(record: DbAagoFaqLibrary, maps?: { hubNameById: Map<string, string> }): FaqLibrarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        faqKey: record.faq_key as string,
        faqQuestion: record.faq_question as string,
        faqStatus: record.faq_status as string,
        status: record.status,
    };
}

export function buildFaqLibraryPayload(organizationId: string, input: CreateFaqLibraryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        faq_key: input.faqKey ?? '',
        faq_question: input.faqQuestion ?? '',
        faq_status: input.faqStatus ?? '',
        status: "active",
    };
}

export function mapBrandApprovalRuleSummary(record: DbAagoBrandApprovalRule, maps?: { hubNameById: Map<string, string> }): BrandApprovalRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        ruleStatus: record.rule_status as string,
        status: record.status,
    };
}

export function buildBrandApprovalRulePayload(organizationId: string, input: CreateBrandApprovalRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        rule_status: input.ruleStatus ?? '',
        status: "active",
    };
}

export function mapVideoProjectSummary(record: DbAagoVideoProject, maps?: { hubNameById: Map<string, string> }): VideoProjectSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        projectKey: record.project_key as string,
        projectName: record.project_name as string,
        projectStatus: record.project_status as string,
        status: record.status,
    };
}

export function buildVideoProjectPayload(organizationId: string, input: CreateVideoProjectInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        project_key: input.projectKey ?? '',
        project_name: input.projectName ?? '',
        project_status: input.projectStatus ?? '',
        status: "active",
    };
}

export function mapThumbnailManagerSummary(record: DbAagoThumbnailManager, maps?: { hubNameById: Map<string, string> }): ThumbnailManagerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        thumbnailKey: record.thumbnail_key as string,
        thumbnailName: record.thumbnail_name as string,
        thumbnailStatus: record.thumbnail_status as string,
        status: record.status,
    };
}

export function buildThumbnailManagerPayload(organizationId: string, input: CreateThumbnailManagerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        thumbnail_key: input.thumbnailKey ?? '',
        thumbnail_name: input.thumbnailName ?? '',
        thumbnail_status: input.thumbnailStatus ?? '',
        status: "active",
    };
}

export function mapVoiceoverManagerSummary(record: DbAagoVoiceoverManager, maps?: { hubNameById: Map<string, string> }): VoiceoverManagerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        voiceoverKey: record.voiceover_key as string,
        voiceoverName: record.voiceover_name as string,
        voiceoverStatus: record.voiceover_status as string,
        status: record.status,
    };
}

export function buildVoiceoverManagerPayload(organizationId: string, input: CreateVoiceoverManagerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        voiceover_key: input.voiceoverKey ?? '',
        voiceover_name: input.voiceoverName ?? '',
        voiceover_status: input.voiceoverStatus ?? '',
        status: "active",
    };
}

export function mapCreativeAssetGeneratorSummary(record: DbAagoCreativeAssetGenerator, maps?: { hubNameById: Map<string, string> }): CreativeAssetGeneratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generatorKey: record.generator_key as string,
        generatorName: record.generator_name as string,
        generatorStatus: record.generator_status as string,
        status: record.status,
    };
}

export function buildCreativeAssetGeneratorPayload(organizationId: string, input: CreateCreativeAssetGeneratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        generator_key: input.generatorKey ?? '',
        generator_name: input.generatorName ?? '',
        generator_status: input.generatorStatus ?? '',
        status: "active",
    };
}

export function mapCampaignAssetBuilderSummary(record: DbAagoCampaignAssetBuilder, maps?: { hubNameById: Map<string, string> }): CampaignAssetBuilderSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        builderKey: record.builder_key as string,
        builderName: record.builder_name as string,
        builderStatus: record.builder_status as string,
        status: record.status,
    };
}

export function buildCampaignAssetBuilderPayload(organizationId: string, input: CreateCampaignAssetBuilderInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        builder_key: input.builderKey ?? '',
        builder_name: input.builderName ?? '',
        builder_status: input.builderStatus ?? '',
        status: "active",
    };
}

export function mapCreativeWorkflowSummary(record: DbAagoCreativeWorkflow, maps?: { hubNameById: Map<string, string> }): CreativeWorkflowSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        workflowKey: record.workflow_key as string,
        workflowName: record.workflow_name as string,
        workflowStatus: record.workflow_status as string,
        status: record.status,
    };
}

export function buildCreativeWorkflowPayload(organizationId: string, input: CreateCreativeWorkflowInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        workflow_key: input.workflowKey ?? '',
        workflow_name: input.workflowName ?? '',
        workflow_status: input.workflowStatus ?? '',
        status: "active",
    };
}

export function mapDistributionContentQueueSummary(record: DbAagoDistributionContentQueue, maps?: { hubNameById: Map<string, string> }): DistributionContentQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        queueKey: record.queue_key as string,
        queueTitle: record.queue_title as string,
        queueStatus: record.queue_status as string,
        status: record.status,
    };
}

export function buildDistributionContentQueuePayload(organizationId: string, input: CreateDistributionContentQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        queue_key: input.queueKey ?? '',
        queue_title: input.queueTitle ?? '',
        queue_status: input.queueStatus ?? '',
        status: "active",
    };
}

export function mapDistributionPublishingQueueSummary(record: DbAagoDistributionPublishingQueue, maps?: { hubNameById: Map<string, string> }): DistributionPublishingQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        queueKey: record.queue_key as string,
        queueTitle: record.queue_title as string,
        queueStatus: record.queue_status as string,
        status: record.status,
    };
}

export function buildDistributionPublishingQueuePayload(organizationId: string, input: CreateDistributionPublishingQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        queue_key: input.queueKey ?? '',
        queue_title: input.queueTitle ?? '',
        queue_status: input.queueStatus ?? '',
        status: "active",
    };
}

export function mapChannelManagerSummary(record: DbAagoChannelManager, maps?: { hubNameById: Map<string, string> }): ChannelManagerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        channelKey: record.channel_key as string,
        channelName: record.channel_name as string,
        channelStatus: record.channel_status as string,
        status: record.status,
    };
}

export function buildChannelManagerPayload(organizationId: string, input: CreateChannelManagerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        channel_key: input.channelKey ?? '',
        channel_name: input.channelName ?? '',
        channel_status: input.channelStatus ?? '',
        status: "active",
    };
}

export function mapApprovalCenterSummary(record: DbAagoApprovalCenter, maps?: { hubNameById: Map<string, string> }): ApprovalCenterSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        approvalKey: record.approval_key as string,
        approvalTitle: record.approval_title as string,
        approvalStatus: record.approval_status as string,
        status: record.status,
    };
}

export function buildApprovalCenterPayload(organizationId: string, input: CreateApprovalCenterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        approval_key: input.approvalKey ?? '',
        approval_title: input.approvalTitle ?? '',
        approval_status: input.approvalStatus ?? '',
        status: "active",
    };
}

export function mapPublishingHistorySummary(record: DbAagoPublishingHistory, maps?: { hubNameById: Map<string, string> }): PublishingHistorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        historyKey: record.history_key as string,
        historyTitle: record.history_title as string,
        historyStatus: record.history_status as string,
        status: record.status,
    };
}

export function buildPublishingHistoryPayload(organizationId: string, input: CreatePublishingHistoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        history_key: input.historyKey ?? '',
        history_title: input.historyTitle ?? '',
        history_status: input.historyStatus ?? '',
        status: "active",
    };
}

export function mapDistributionAnalyticsSummary(record: DbAagoDistributionAnalytics, maps?: { hubNameById: Map<string, string> }): DistributionAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsName: record.analytics_name as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildDistributionAnalyticsPayload(organizationId: string, input: CreateDistributionAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_name: input.analyticsName ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapCampaignDashboardSummary(record: DbAagoCampaignDashboard, maps?: { hubNameById: Map<string, string> }): CampaignDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardStatus: record.dashboard_status as string,
        status: record.status,
    };
}

export function buildCampaignDashboardPayload(organizationId: string, input: CreateCampaignDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_status: input.dashboardStatus ?? '',
        status: "active",
    };
}

export function mapContentPerformanceSummary(record: DbAagoContentPerformance, maps?: { hubNameById: Map<string, string> }): ContentPerformanceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        performanceKey: record.performance_key as string,
        performanceTitle: record.performance_title as string,
        performanceScore: record.performance_score as number,
        status: record.status,
    };
}

export function buildContentPerformancePayload(organizationId: string, input: CreateContentPerformanceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        performance_key: input.performanceKey ?? '',
        performance_title: input.performanceTitle ?? '',
        performance_score: input.performanceScore ?? 0,
        status: "active",
    };
}

export function mapLeadAttributionSummary(record: DbAagoLeadAttribution, maps?: { hubNameById: Map<string, string> }): LeadAttributionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        attributionKey: record.attribution_key as string,
        attributionTitle: record.attribution_title as string,
        attributionStatus: record.attribution_status as string,
        status: record.status,
    };
}

export function buildLeadAttributionPayload(organizationId: string, input: CreateLeadAttributionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        attribution_key: input.attributionKey ?? '',
        attribution_title: input.attributionTitle ?? '',
        attribution_status: input.attributionStatus ?? '',
        status: "active",
    };
}

export function mapGrowthKpiSummary(record: DbAagoGrowthKpi, maps?: { hubNameById: Map<string, string> }): GrowthKpiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        kpiKey: record.kpi_key as string,
        kpiName: record.kpi_name as string,
        kpiValue: record.kpi_value as number,
        status: record.status,
    };
}

export function buildGrowthKpiPayload(organizationId: string, input: CreateGrowthKpiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_value: input.kpiValue ?? 0,
        status: "active",
    };
}

export function mapRoiDashboardSummary(record: DbAagoRoiDashboard, maps?: { hubNameById: Map<string, string> }): RoiDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        roiKey: record.roi_key as string,
        roiName: record.roi_name as string,
        roiScore: record.roi_score as number,
        status: record.status,
    };
}

export function buildRoiDashboardPayload(organizationId: string, input: CreateRoiDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        roi_key: input.roiKey ?? '',
        roi_name: input.roiName ?? '',
        roi_score: input.roiScore ?? 0,
        status: "active",
    };
}

export function mapRecommendationEngineSummary(record: DbAagoRecommendationEngine, maps?: { hubNameById: Map<string, string> }): RecommendationEngineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        recommendationKey: record.recommendation_key as string,
        recommendationTitle: record.recommendation_title as string,
        recommendationStatus: record.recommendation_status as string,
        status: record.status,
    };
}

export function buildRecommendationEnginePayload(organizationId: string, input: CreateRecommendationEngineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        recommendation_key: input.recommendationKey ?? '',
        recommendation_title: input.recommendationTitle ?? '',
        recommendation_status: input.recommendationStatus ?? '',
        status: "active",
    };
}

export function mapCommandCenterMetricSummary(record: DbAagoCommandCenterMetric): CommandCenterMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        overallOperationsScore: record.overall_operations_score as number,
        missionStatusScore: record.mission_status_score as number,
        status: record.status,
    };
}

export function buildCommandCenterMetricPayload(organizationId: string, input: CreateCommandCenterMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        overall_operations_score: input.overallOperationsScore ?? 0,
        mission_status_score: input.missionStatusScore ?? 0,
        status: "active",
    };
}

export function mapCommandCenterHealthSummary(record: DbAagoCommandCenterHealth): CommandCenterHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        brandOsStatus: record.brand_os_status as string,
        status: record.status,
    };
}

export function buildCommandCenterHealthPayload(organizationId: string, input: CreateCommandCenterHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        brand_os_status: input.brandOsStatus ?? '',
        status: "active",
    };
}

export function mapMissionStatusSummary(record: DbAagoMissionStatus, maps?: { hubNameById: Map<string, string> }): MissionStatusSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        missionKey: record.mission_key as string,
        missionName: record.mission_name as string,
        missionStatus: record.mission_status as string,
        status: record.status,
    };
}

export function buildMissionStatusPayload(organizationId: string, input: CreateMissionStatusInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        mission_key: input.missionKey ?? '',
        mission_name: input.missionName ?? '',
        mission_status: input.missionStatus ?? '',
        status: "active",
    };
}

export function mapExecutiveSummarySummary(record: DbAagoExecutiveSummary, maps?: { hubNameById: Map<string, string> }): ExecutiveSummarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        summaryKey: record.summary_key as string,
        summaryTitle: record.summary_title as string,
        summaryStatus: record.summary_status as string,
        status: record.status,
    };
}

export function buildExecutiveSummaryPayload(organizationId: string, input: CreateExecutiveSummaryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        summary_key: input.summaryKey ?? '',
        summary_title: input.summaryTitle ?? '',
        summary_status: input.summaryStatus ?? '',
        status: "active",
    };
}

export function mapOperationalFailureSummary(record: DbAagoOperationalFailure, maps?: { hubNameById: Map<string, string> }): OperationalFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildOperationalFailurePayload(organizationId: string, input: CreateOperationalFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operationsHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapBrandKnowledgeBaseForStats(r: DbAagoBrandKnowledgeBase) { return { knowledge_status: r.knowledge_status, status: r.status }; }
export function mapVideoProjectForStats(r: DbAagoVideoProject) { return { project_status: r.project_status, status: r.status }; }
export function mapDistributionContentQueueForStats(r: DbAagoDistributionContentQueue) { return { queue_status: r.queue_status, status: r.status }; }
export function mapCampaignDashboardForStats(r: DbAagoCampaignDashboard) { return { dashboard_status: r.dashboard_status, status: r.status }; }
export function mapMissionStatusForStats(r: DbAagoMissionStatus) { return { mission_status: r.mission_status, status: r.status }; }
export function mapCommandCenterMetricForStats(r: DbAagoCommandCenterMetric) {
    return {
        mission_status_score: r.mission_status_score,
        content_status_score: r.content_status_score,
        publishing_status_score: r.publishing_status_score,
        growth_metrics_score: r.growth_metrics_score,
        campaign_health_score: r.campaign_health_score,
        executive_summary_score: r.executive_summary_score,
        overall_operations_score: r.overall_operations_score,
        status: r.status,
    };
}
export function mapCommandCenterHealthForStats(r: DbAagoCommandCenterHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapOperationalFailureForStats(r: DbAagoOperationalFailure) { return { failure_type: r.failure_type, status: r.status }; }

export function buildAagoDashboardStats(input: {
    operationsHubs: OperationsHubSummary[];
    brandKnowledgeBase: ReturnType<typeof mapBrandKnowledgeBaseForStats>[];
    videoProjects: ReturnType<typeof mapVideoProjectForStats>[];
    distributionContentQueue: ReturnType<typeof mapDistributionContentQueueForStats>[];
    campaignDashboard: ReturnType<typeof mapCampaignDashboardForStats>[];
    missionStatus: ReturnType<typeof mapMissionStatusForStats>[];
    commandCenterMetrics: ReturnType<typeof mapCommandCenterMetricForStats>[];
    commandCenterHealth: ReturnType<typeof mapCommandCenterHealthForStats>[];
    operationalFailures: ReturnType<typeof mapOperationalFailureForStats>[];
    auditLogs: AuditEntry[];
}): AagoDashboardStats {
    const activeHubs = input.operationsHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.commandCenterMetrics[0];
    const latestHealth = input.commandCenterHealth[0];
    const openFailures = input.operationalFailures.filter((f) => f.status === "open").length;
    return {
        totalOperationsHubs: input.operationsHubs.length,
        activeOperationsHubs: activeHubs,
        brandKnowledgeBaseCount: input.brandKnowledgeBase.length,
        videoProjectCount: input.videoProjects.length,
        distributionContentQueueCount: input.distributionContentQueue.length,
        campaignDashboardCount: input.campaignDashboard.length,
        missionStatusCount: input.missionStatus.length,
        overallOperationsScore: latestMetrics?.overall_operations_score ?? latestHealth?.overall_score ?? 0,
        missionStatusScore: latestMetrics?.mission_status_score ?? 0,
        contentStatusScore: latestMetrics?.content_status_score ?? 0,
        publishingStatusScore: latestMetrics?.publishing_status_score ?? 0,
        growthMetricsScore: latestMetrics?.growth_metrics_score ?? 0,
        campaignHealthScore: latestMetrics?.campaign_health_score ?? 0,
        executiveSummaryScore: latestMetrics?.executive_summary_score ?? 0,
        openOperationalFailureCount: openFailures,
        auditCount: input.auditLogs.length,
    };
}
