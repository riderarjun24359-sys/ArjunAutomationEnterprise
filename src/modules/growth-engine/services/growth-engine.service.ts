import {
    buildOperationsHubLookupMaps,
    buildAagoAuditPayload,
    buildAagoDashboardStats,
    buildAagoPipelineInfo,
    mapAuditEntry,
    buildOperationsHubPayload,
    mapOperationsHubSummary,
    buildBrandKnowledgeBasePayload,
    mapBrandKnowledgeBaseSummary,
    buildBrandRulebookPayload,
    mapBrandRulebookSummary,
    buildMessagingLibraryPayload,
    mapMessagingLibrarySummary,
    buildServiceLibraryPayload,
    mapServiceLibrarySummary,
    buildIndustryLibraryPayload,
    mapIndustryLibrarySummary,
    buildFaqLibraryPayload,
    mapFaqLibrarySummary,
    buildBrandApprovalRulePayload,
    mapBrandApprovalRuleSummary,
    buildVideoProjectPayload,
    mapVideoProjectSummary,
    buildThumbnailManagerPayload,
    mapThumbnailManagerSummary,
    buildVoiceoverManagerPayload,
    mapVoiceoverManagerSummary,
    buildCreativeAssetGeneratorPayload,
    mapCreativeAssetGeneratorSummary,
    buildCampaignAssetBuilderPayload,
    mapCampaignAssetBuilderSummary,
    buildCreativeWorkflowPayload,
    mapCreativeWorkflowSummary,
    buildDistributionContentQueuePayload,
    mapDistributionContentQueueSummary,
    buildDistributionPublishingQueuePayload,
    mapDistributionPublishingQueueSummary,
    buildChannelManagerPayload,
    mapChannelManagerSummary,
    buildApprovalCenterPayload,
    mapApprovalCenterSummary,
    buildPublishingHistoryPayload,
    mapPublishingHistorySummary,
    buildDistributionAnalyticsPayload,
    mapDistributionAnalyticsSummary,
    buildCampaignDashboardPayload,
    mapCampaignDashboardSummary,
    buildContentPerformancePayload,
    mapContentPerformanceSummary,
    buildLeadAttributionPayload,
    mapLeadAttributionSummary,
    buildGrowthKpiPayload,
    mapGrowthKpiSummary,
    buildRoiDashboardPayload,
    mapRoiDashboardSummary,
    buildRecommendationEnginePayload,
    mapRecommendationEngineSummary,
    buildCommandCenterMetricPayload,
    mapCommandCenterMetricSummary,
    buildCommandCenterHealthPayload,
    mapCommandCenterHealthSummary,
    buildMissionStatusPayload,
    mapMissionStatusSummary,
    buildExecutiveSummaryPayload,
    mapExecutiveSummarySummary,
    buildOperationalFailurePayload,
    mapOperationalFailureSummary,
    mapBrandKnowledgeBaseForStats,
    mapVideoProjectForStats,
    mapDistributionContentQueueForStats,
    mapCampaignDashboardForStats,
    mapMissionStatusForStats,
    mapCommandCenterMetricForStats,
    mapCommandCenterHealthForStats,
    mapOperationalFailureForStats,
} from "@/src/modules/database/lib/growth-engine-operations-mappers";
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
    AagoSdkRunBrandOsServiceInput,
    AagoSdkRunBrandOsServiceResult,
    AagoSdkRunCreativeStudioServiceInput,
    AagoSdkRunCreativeStudioServiceResult,
    AagoSdkRunDistributionServiceInput,
    AagoSdkRunDistributionServiceResult,
    AagoSdkRunGrowthIntelligenceServiceInput,
    AagoSdkRunGrowthIntelligenceServiceResult,
    AagoSdkRunCommandCenterServiceInput,
    AagoSdkRunCommandCenterServiceResult,
} from "@/src/modules/growth-engine/types";

export class GrowthEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const operationsHubs = await databaseService.aagoOperationsHubs.listByOrganization(organizationId);
        return buildOperationsHubLookupMaps(operationsHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AagoDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildAagoDashboardStats({ operationsHubs: [], brandKnowledgeBase: [], videoProjects: [], distributionContentQueue: [], campaignDashboard: [], missionStatus: [], commandCenterMetrics: [], commandCenterHealth: [], operationalFailures: [], auditLogs: [] });
        const [operationsHubs, brandKnowledgeBaseRaw, videoProjectsRaw, distributionContentQueueRaw, campaignDashboardRaw, missionStatusRaw, commandCenterMetricsRaw, commandCenterHealthRaw, operationalFailuresRaw, auditLogs] = await Promise.all([
            this.getOperationsHubs(authUserId, email, fullName),
            databaseService.aagoBrandKnowledgeBase.listByOrganization(context.organizationId),
            databaseService.aagoVideoProjects.listByOrganization(context.organizationId),
            databaseService.aagoDistributionContentQueue.listByOrganization(context.organizationId),
            databaseService.aagoCampaignDashboard.listByOrganization(context.organizationId),
            databaseService.aagoMissionStatus.listByOrganization(context.organizationId),
            databaseService.aagoCommandCenterMetrics.listByOrganization(context.organizationId),
            databaseService.aagoCommandCenterHealth.listByOrganization(context.organizationId),
            databaseService.aagoOperationalFailures.listByOrganization(context.organizationId),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildAagoDashboardStats({
            operationsHubs,
            brandKnowledgeBase: brandKnowledgeBaseRaw.map(mapBrandKnowledgeBaseForStats),
            videoProjects: videoProjectsRaw.map(mapVideoProjectForStats),
            distributionContentQueue: distributionContentQueueRaw.map(mapDistributionContentQueueForStats),
            campaignDashboard: campaignDashboardRaw.map(mapCampaignDashboardForStats),
            missionStatus: missionStatusRaw.map(mapMissionStatusForStats),
            commandCenterMetrics: commandCenterMetricsRaw.map(mapCommandCenterMetricForStats),
            commandCenterHealth: commandCenterHealthRaw.map(mapCommandCenterHealthForStats),
            operationalFailures: operationalFailuresRaw.map(mapOperationalFailureForStats),
            auditLogs,
        });
    }

    getPipelineInfo(): AagoPipelineInfo {
        return buildAagoPipelineInfo();
    }

    async getOperationsHubs(authUserId: string, email: string, fullName?: string | null): Promise<OperationsHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aagoOperationsHubs.listByOrganization(context.organizationId)).map(mapOperationsHubSummary);
    }

    async createOperationsHub(authUserId: string, email: string, input: CreateOperationsHubInput, fullName?: string | null): Promise<OperationsHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoOperationsHubs.create(buildOperationsHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsHubs");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "operations_hubs", "create", `OperationsHub created`, created.id));
        return mapOperationsHubSummary(created);
    }

    async getBrandKnowledgeBases(authUserId: string, email: string, fullName?: string | null): Promise<BrandKnowledgeBaseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoBrandKnowledgeBase.listByOrganization(context.organizationId)).map((r) => mapBrandKnowledgeBaseSummary(r, maps));
    }

    async createBrandKnowledgeBase(authUserId: string, email: string, input: CreateBrandKnowledgeBaseInput, fullName?: string | null): Promise<BrandKnowledgeBaseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoBrandKnowledgeBase.create(buildBrandKnowledgeBasePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandKnowledgeBase");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "brand_knowledge_base", "create", `BrandKnowledgeBase created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandKnowledgeBaseSummary(created, maps);
    }

    async getBrandRulebooks(authUserId: string, email: string, fullName?: string | null): Promise<BrandRulebookSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoBrandRulebook.listByOrganization(context.organizationId)).map((r) => mapBrandRulebookSummary(r, maps));
    }

    async createBrandRulebook(authUserId: string, email: string, input: CreateBrandRulebookInput, fullName?: string | null): Promise<BrandRulebookSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoBrandRulebook.create(buildBrandRulebookPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandRulebook");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "brand_rulebook", "create", `BrandRulebook created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandRulebookSummary(created, maps);
    }

    async getMessagingLibrarys(authUserId: string, email: string, fullName?: string | null): Promise<MessagingLibrarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoMessagingLibrary.listByOrganization(context.organizationId)).map((r) => mapMessagingLibrarySummary(r, maps));
    }

    async createMessagingLibrary(authUserId: string, email: string, input: CreateMessagingLibraryInput, fullName?: string | null): Promise<MessagingLibrarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoMessagingLibrary.create(buildMessagingLibraryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create messagingLibrary");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "messaging_library", "create", `MessagingLibrary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMessagingLibrarySummary(created, maps);
    }

    async getServiceLibrarys(authUserId: string, email: string, fullName?: string | null): Promise<ServiceLibrarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoServiceLibrary.listByOrganization(context.organizationId)).map((r) => mapServiceLibrarySummary(r, maps));
    }

    async createServiceLibrary(authUserId: string, email: string, input: CreateServiceLibraryInput, fullName?: string | null): Promise<ServiceLibrarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoServiceLibrary.create(buildServiceLibraryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create serviceLibrary");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "service_library", "create", `ServiceLibrary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapServiceLibrarySummary(created, maps);
    }

    async getIndustryLibrarys(authUserId: string, email: string, fullName?: string | null): Promise<IndustryLibrarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoIndustryLibrary.listByOrganization(context.organizationId)).map((r) => mapIndustryLibrarySummary(r, maps));
    }

    async createIndustryLibrary(authUserId: string, email: string, input: CreateIndustryLibraryInput, fullName?: string | null): Promise<IndustryLibrarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoIndustryLibrary.create(buildIndustryLibraryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryLibrary");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "industry_library", "create", `IndustryLibrary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryLibrarySummary(created, maps);
    }

    async getFaqLibrarys(authUserId: string, email: string, fullName?: string | null): Promise<FaqLibrarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoFaqLibrary.listByOrganization(context.organizationId)).map((r) => mapFaqLibrarySummary(r, maps));
    }

    async createFaqLibrary(authUserId: string, email: string, input: CreateFaqLibraryInput, fullName?: string | null): Promise<FaqLibrarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoFaqLibrary.create(buildFaqLibraryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create faqLibrary");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "faq_library", "create", `FaqLibrary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFaqLibrarySummary(created, maps);
    }

    async getBrandApprovalRules(authUserId: string, email: string, fullName?: string | null): Promise<BrandApprovalRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoBrandApprovalRules.listByOrganization(context.organizationId)).map((r) => mapBrandApprovalRuleSummary(r, maps));
    }

    async createBrandApprovalRule(authUserId: string, email: string, input: CreateBrandApprovalRuleInput, fullName?: string | null): Promise<BrandApprovalRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoBrandApprovalRules.create(buildBrandApprovalRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandApprovalRules");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "brand_approval_rules", "create", `BrandApprovalRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandApprovalRuleSummary(created, maps);
    }

    async getVideoProjects(authUserId: string, email: string, fullName?: string | null): Promise<VideoProjectSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoVideoProjects.listByOrganization(context.organizationId)).map((r) => mapVideoProjectSummary(r, maps));
    }

    async createVideoProject(authUserId: string, email: string, input: CreateVideoProjectInput, fullName?: string | null): Promise<VideoProjectSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoVideoProjects.create(buildVideoProjectPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create videoProjects");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "video_projects", "create", `VideoProject created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVideoProjectSummary(created, maps);
    }

    async getThumbnailManagers(authUserId: string, email: string, fullName?: string | null): Promise<ThumbnailManagerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoThumbnailManager.listByOrganization(context.organizationId)).map((r) => mapThumbnailManagerSummary(r, maps));
    }

    async createThumbnailManager(authUserId: string, email: string, input: CreateThumbnailManagerInput, fullName?: string | null): Promise<ThumbnailManagerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoThumbnailManager.create(buildThumbnailManagerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create thumbnailManager");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "thumbnail_manager", "create", `ThumbnailManager created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapThumbnailManagerSummary(created, maps);
    }

    async getVoiceoverManagers(authUserId: string, email: string, fullName?: string | null): Promise<VoiceoverManagerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoVoiceoverManager.listByOrganization(context.organizationId)).map((r) => mapVoiceoverManagerSummary(r, maps));
    }

    async createVoiceoverManager(authUserId: string, email: string, input: CreateVoiceoverManagerInput, fullName?: string | null): Promise<VoiceoverManagerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoVoiceoverManager.create(buildVoiceoverManagerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create voiceoverManager");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "voiceover_manager", "create", `VoiceoverManager created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVoiceoverManagerSummary(created, maps);
    }

    async getCreativeAssetGenerators(authUserId: string, email: string, fullName?: string | null): Promise<CreativeAssetGeneratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoCreativeAssetGenerator.listByOrganization(context.organizationId)).map((r) => mapCreativeAssetGeneratorSummary(r, maps));
    }

    async createCreativeAssetGenerator(authUserId: string, email: string, input: CreateCreativeAssetGeneratorInput, fullName?: string | null): Promise<CreativeAssetGeneratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoCreativeAssetGenerator.create(buildCreativeAssetGeneratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create creativeAssetGenerator");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "creative_asset_generator", "create", `CreativeAssetGenerator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCreativeAssetGeneratorSummary(created, maps);
    }

    async getCampaignAssetBuilders(authUserId: string, email: string, fullName?: string | null): Promise<CampaignAssetBuilderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoCampaignAssetBuilder.listByOrganization(context.organizationId)).map((r) => mapCampaignAssetBuilderSummary(r, maps));
    }

    async createCampaignAssetBuilder(authUserId: string, email: string, input: CreateCampaignAssetBuilderInput, fullName?: string | null): Promise<CampaignAssetBuilderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoCampaignAssetBuilder.create(buildCampaignAssetBuilderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campaignAssetBuilder");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "campaign_asset_builder", "create", `CampaignAssetBuilder created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampaignAssetBuilderSummary(created, maps);
    }

    async getCreativeWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<CreativeWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoCreativeWorkflows.listByOrganization(context.organizationId)).map((r) => mapCreativeWorkflowSummary(r, maps));
    }

    async createCreativeWorkflow(authUserId: string, email: string, input: CreateCreativeWorkflowInput, fullName?: string | null): Promise<CreativeWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoCreativeWorkflows.create(buildCreativeWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create creativeWorkflows");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "creative_workflows", "create", `CreativeWorkflow created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCreativeWorkflowSummary(created, maps);
    }

    async getDistributionContentQueues(authUserId: string, email: string, fullName?: string | null): Promise<DistributionContentQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoDistributionContentQueue.listByOrganization(context.organizationId)).map((r) => mapDistributionContentQueueSummary(r, maps));
    }

    async createDistributionContentQueue(authUserId: string, email: string, input: CreateDistributionContentQueueInput, fullName?: string | null): Promise<DistributionContentQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoDistributionContentQueue.create(buildDistributionContentQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create distributionContentQueue");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "distribution_content_queue", "create", `DistributionContentQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDistributionContentQueueSummary(created, maps);
    }

    async getDistributionPublishingQueues(authUserId: string, email: string, fullName?: string | null): Promise<DistributionPublishingQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoDistributionPublishingQueue.listByOrganization(context.organizationId)).map((r) => mapDistributionPublishingQueueSummary(r, maps));
    }

    async createDistributionPublishingQueue(authUserId: string, email: string, input: CreateDistributionPublishingQueueInput, fullName?: string | null): Promise<DistributionPublishingQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoDistributionPublishingQueue.create(buildDistributionPublishingQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create distributionPublishingQueue");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "distribution_publishing_queue", "create", `DistributionPublishingQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDistributionPublishingQueueSummary(created, maps);
    }

    async getChannelManagers(authUserId: string, email: string, fullName?: string | null): Promise<ChannelManagerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoChannelManager.listByOrganization(context.organizationId)).map((r) => mapChannelManagerSummary(r, maps));
    }

    async createChannelManager(authUserId: string, email: string, input: CreateChannelManagerInput, fullName?: string | null): Promise<ChannelManagerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoChannelManager.create(buildChannelManagerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create channelManager");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "channel_manager", "create", `ChannelManager created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapChannelManagerSummary(created, maps);
    }

    async getApprovalCenters(authUserId: string, email: string, fullName?: string | null): Promise<ApprovalCenterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoApprovalCenter.listByOrganization(context.organizationId)).map((r) => mapApprovalCenterSummary(r, maps));
    }

    async createApprovalCenter(authUserId: string, email: string, input: CreateApprovalCenterInput, fullName?: string | null): Promise<ApprovalCenterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoApprovalCenter.create(buildApprovalCenterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create approvalCenter");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "approval_center", "create", `ApprovalCenter created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalCenterSummary(created, maps);
    }

    async getPublishingHistorys(authUserId: string, email: string, fullName?: string | null): Promise<PublishingHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoPublishingHistory.listByOrganization(context.organizationId)).map((r) => mapPublishingHistorySummary(r, maps));
    }

    async createPublishingHistory(authUserId: string, email: string, input: CreatePublishingHistoryInput, fullName?: string | null): Promise<PublishingHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoPublishingHistory.create(buildPublishingHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create publishingHistory");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "publishing_history", "create", `PublishingHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPublishingHistorySummary(created, maps);
    }

    async getDistributionAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<DistributionAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoDistributionAnalytics.listByOrganization(context.organizationId)).map((r) => mapDistributionAnalyticsSummary(r, maps));
    }

    async createDistributionAnalytics(authUserId: string, email: string, input: CreateDistributionAnalyticsInput, fullName?: string | null): Promise<DistributionAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoDistributionAnalytics.create(buildDistributionAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create distributionAnalytics");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "distribution_analytics", "create", `DistributionAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDistributionAnalyticsSummary(created, maps);
    }

    async getCampaignDashboards(authUserId: string, email: string, fullName?: string | null): Promise<CampaignDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoCampaignDashboard.listByOrganization(context.organizationId)).map((r) => mapCampaignDashboardSummary(r, maps));
    }

    async createCampaignDashboard(authUserId: string, email: string, input: CreateCampaignDashboardInput, fullName?: string | null): Promise<CampaignDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoCampaignDashboard.create(buildCampaignDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campaignDashboard");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "campaign_dashboard", "create", `CampaignDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampaignDashboardSummary(created, maps);
    }

    async getContentPerformances(authUserId: string, email: string, fullName?: string | null): Promise<ContentPerformanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoContentPerformance.listByOrganization(context.organizationId)).map((r) => mapContentPerformanceSummary(r, maps));
    }

    async createContentPerformance(authUserId: string, email: string, input: CreateContentPerformanceInput, fullName?: string | null): Promise<ContentPerformanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoContentPerformance.create(buildContentPerformancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create contentPerformance");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "content_performance", "create", `ContentPerformance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapContentPerformanceSummary(created, maps);
    }

    async getLeadAttributions(authUserId: string, email: string, fullName?: string | null): Promise<LeadAttributionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoLeadAttribution.listByOrganization(context.organizationId)).map((r) => mapLeadAttributionSummary(r, maps));
    }

    async createLeadAttribution(authUserId: string, email: string, input: CreateLeadAttributionInput, fullName?: string | null): Promise<LeadAttributionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoLeadAttribution.create(buildLeadAttributionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create leadAttribution");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "lead_attribution", "create", `LeadAttribution created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLeadAttributionSummary(created, maps);
    }

    async getGrowthKpis(authUserId: string, email: string, fullName?: string | null): Promise<GrowthKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoGrowthKpis.listByOrganization(context.organizationId)).map((r) => mapGrowthKpiSummary(r, maps));
    }

    async createGrowthKpi(authUserId: string, email: string, input: CreateGrowthKpiInput, fullName?: string | null): Promise<GrowthKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoGrowthKpis.create(buildGrowthKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthKpis");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "growth_kpis", "create", `GrowthKpi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGrowthKpiSummary(created, maps);
    }

    async getRoiDashboards(authUserId: string, email: string, fullName?: string | null): Promise<RoiDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoRoiDashboard.listByOrganization(context.organizationId)).map((r) => mapRoiDashboardSummary(r, maps));
    }

    async createRoiDashboard(authUserId: string, email: string, input: CreateRoiDashboardInput, fullName?: string | null): Promise<RoiDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoRoiDashboard.create(buildRoiDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create roiDashboard");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "roi_dashboard", "create", `RoiDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRoiDashboardSummary(created, maps);
    }

    async getRecommendationEngines(authUserId: string, email: string, fullName?: string | null): Promise<RecommendationEngineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoRecommendationEngine.listByOrganization(context.organizationId)).map((r) => mapRecommendationEngineSummary(r, maps));
    }

    async createRecommendationEngine(authUserId: string, email: string, input: CreateRecommendationEngineInput, fullName?: string | null): Promise<RecommendationEngineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoRecommendationEngine.create(buildRecommendationEnginePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recommendationEngine");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "recommendation_engine", "create", `RecommendationEngine created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRecommendationEngineSummary(created, maps);
    }

    async getCommandCenterMetrics(authUserId: string, email: string, fullName?: string | null): Promise<CommandCenterMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aagoCommandCenterMetrics.listByOrganization(context.organizationId)).map(mapCommandCenterMetricSummary);
    }

    async createCommandCenterMetric(authUserId: string, email: string, input: CreateCommandCenterMetricInput, fullName?: string | null): Promise<CommandCenterMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoCommandCenterMetrics.create(buildCommandCenterMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create commandCenterMetrics");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "command_center_metrics", "create", `CommandCenterMetric created`, created.id));
        return mapCommandCenterMetricSummary(created);
    }

    async getCommandCenterHealths(authUserId: string, email: string, fullName?: string | null): Promise<CommandCenterHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aagoCommandCenterHealth.listByOrganization(context.organizationId)).map(mapCommandCenterHealthSummary);
    }

    async createCommandCenterHealth(authUserId: string, email: string, input: CreateCommandCenterHealthInput, fullName?: string | null): Promise<CommandCenterHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoCommandCenterHealth.create(buildCommandCenterHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create commandCenterHealth");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "command_center_health", "create", `CommandCenterHealth created`, created.id));
        return mapCommandCenterHealthSummary(created);
    }

    async getMissionStatuss(authUserId: string, email: string, fullName?: string | null): Promise<MissionStatusSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoMissionStatus.listByOrganization(context.organizationId)).map((r) => mapMissionStatusSummary(r, maps));
    }

    async createMissionStatus(authUserId: string, email: string, input: CreateMissionStatusInput, fullName?: string | null): Promise<MissionStatusSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoMissionStatus.create(buildMissionStatusPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create missionStatus");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "mission_status", "create", `MissionStatus created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMissionStatusSummary(created, maps);
    }

    async getExecutiveSummarys(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveSummarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoExecutiveSummaries.listByOrganization(context.organizationId)).map((r) => mapExecutiveSummarySummary(r, maps));
    }

    async createExecutiveSummary(authUserId: string, email: string, input: CreateExecutiveSummaryInput, fullName?: string | null): Promise<ExecutiveSummarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoExecutiveSummaries.create(buildExecutiveSummaryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveSummaries");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "executive_summaries", "create", `ExecutiveSummary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveSummarySummary(created, maps);
    }

    async getOperationalFailures(authUserId: string, email: string, fullName?: string | null): Promise<OperationalFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aagoOperationalFailures.listByOrganization(context.organizationId)).map((r) => mapOperationalFailureSummary(r, maps));
    }

    async createOperationalFailure(authUserId: string, email: string, input: CreateOperationalFailureInput, fullName?: string | null): Promise<OperationalFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aagoOperationalFailures.create(buildOperationalFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationalFailures");
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "operational_failures", "create", `OperationalFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperationalFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aagoAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getOperationsHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aagoOperationsHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunBrandOsService(authUserId: string, email: string, input: AagoSdkRunBrandOsServiceInput, fullName?: string | null): Promise<AagoSdkRunBrandOsServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createBrandKnowledgeBase(authUserId, email, { operationsHubId: input.operationsHubId, knowledgeKey: input.knowledgeKey, knowledgeTitle: input.knowledgeTitle }, fullName);
        return { knowledgeId: created.id, knowledgeKey: created.knowledgeKey, status: created.status };
    }

    async sdkRunCreativeStudioService(authUserId: string, email: string, input: AagoSdkRunCreativeStudioServiceInput, fullName?: string | null): Promise<AagoSdkRunCreativeStudioServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createVideoProject(authUserId, email, { operationsHubId: input.operationsHubId, projectKey: input.projectKey, projectName: input.projectName }, fullName);
        return { projectId: created.id, projectKey: created.projectKey, status: created.status };
    }

    async sdkRunDistributionService(authUserId: string, email: string, input: AagoSdkRunDistributionServiceInput, fullName?: string | null): Promise<AagoSdkRunDistributionServiceResult> {
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
        const company = createCompanyFoundationClient(authUserId, email, fullName);
        await company.getCompanyHubs();
        const csd = createCustomerSuccessDeliveryClient(authUserId, email, fullName);
        await csd.getDeliveryHubs();
        const egp = createEnterpriseGovernancePlatformClient(authUserId, email, fullName);
        await egp.getGovernanceHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createDistributionContentQueue(authUserId, email, { operationsHubId: input.operationsHubId, queueKey: input.queueKey, queueTitle: input.queueTitle }, fullName);
        return { queueId: created.id, queueKey: created.queueKey, status: created.status };
    }

    async sdkRunGrowthIntelligenceService(authUserId: string, email: string, input: AagoSdkRunGrowthIntelligenceServiceInput, fullName?: string | null): Promise<AagoSdkRunGrowthIntelligenceServiceResult> {
        const eip = createEnterpriseIntelligencePlatformClient(authUserId, email, fullName);
        await eip.getIntelligenceHubs();
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.getAgents();
        const created = await this.createCampaignDashboard(authUserId, email, { operationsHubId: input.operationsHubId, dashboardKey: input.dashboardKey, dashboardName: input.dashboardName }, fullName);
        return { dashboardId: created.id, dashboardKey: created.dashboardKey, status: created.status };
    }

    async sdkRunCommandCenterService(authUserId: string, email: string, input: AagoSdkRunCommandCenterServiceInput, fullName?: string | null): Promise<AagoSdkRunCommandCenterServiceResult> {
        const created = await this.createMissionStatus(authUserId, email, { operationsHubId: input.operationsHubId, missionKey: input.missionKey, missionName: input.missionName }, fullName);
        return { missionId: created.id, missionKey: created.missionKey, status: created.status };
    }
}

export const growthEngineService = new GrowthEngineService();
