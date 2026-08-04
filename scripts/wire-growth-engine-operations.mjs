#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("AagoOperationsHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/growth-engine-repositories";';
    const aageImportEnd = da.indexOf(anchor) + anchor.length;
    const aagoImport = `
import {
    AagoOperationsHubRepository,
    AagoBrandKnowledgeBaseRepository,
    AagoBrandRulebookRepository,
    AagoMessagingLibraryRepository,
    AagoServiceLibraryRepository,
    AagoIndustryLibraryRepository,
    AagoFaqLibraryRepository,
    AagoBrandApprovalRuleRepository,
    AagoVideoProjectRepository,
    AagoThumbnailManagerRepository,
    AagoVoiceoverManagerRepository,
    AagoCreativeAssetGeneratorRepository,
    AagoCampaignAssetBuilderRepository,
    AagoCreativeWorkflowRepository,
    AagoDistributionContentQueueRepository,
    AagoDistributionPublishingQueueRepository,
    AagoChannelManagerRepository,
    AagoApprovalCenterRepository,
    AagoPublishingHistoryRepository,
    AagoDistributionAnalyticsRepository,
    AagoCampaignDashboardRepository,
    AagoContentPerformanceRepository,
    AagoLeadAttributionRepository,
    AagoGrowthKpiRepository,
    AagoRoiDashboardRepository,
    AagoRecommendationEngineRepository,
    AagoCommandCenterMetricRepository,
    AagoCommandCenterHealthRepository,
    AagoMissionStatusRepository,
    AagoExecutiveSummaryRepository,
    AagoOperationalFailureRepository,
    AagoAuditLogRepository,
} from "@/src/modules/database/repositories/growth-engine-operations-repositories";
`;
    da = da.slice(0, aageImportEnd) + aagoImport + da.slice(aageImportEnd);

    const aageProp = "    readonly aageAuditLogs: AageAuditLogRepository;";
    const aagoProps = `    readonly aagoOperationsHubs: AagoOperationsHubRepository;
    readonly aagoBrandKnowledgeBase: AagoBrandKnowledgeBaseRepository;
    readonly aagoBrandRulebook: AagoBrandRulebookRepository;
    readonly aagoMessagingLibrary: AagoMessagingLibraryRepository;
    readonly aagoServiceLibrary: AagoServiceLibraryRepository;
    readonly aagoIndustryLibrary: AagoIndustryLibraryRepository;
    readonly aagoFaqLibrary: AagoFaqLibraryRepository;
    readonly aagoBrandApprovalRules: AagoBrandApprovalRuleRepository;
    readonly aagoVideoProjects: AagoVideoProjectRepository;
    readonly aagoThumbnailManager: AagoThumbnailManagerRepository;
    readonly aagoVoiceoverManager: AagoVoiceoverManagerRepository;
    readonly aagoCreativeAssetGenerator: AagoCreativeAssetGeneratorRepository;
    readonly aagoCampaignAssetBuilder: AagoCampaignAssetBuilderRepository;
    readonly aagoCreativeWorkflows: AagoCreativeWorkflowRepository;
    readonly aagoDistributionContentQueue: AagoDistributionContentQueueRepository;
    readonly aagoDistributionPublishingQueue: AagoDistributionPublishingQueueRepository;
    readonly aagoChannelManager: AagoChannelManagerRepository;
    readonly aagoApprovalCenter: AagoApprovalCenterRepository;
    readonly aagoPublishingHistory: AagoPublishingHistoryRepository;
    readonly aagoDistributionAnalytics: AagoDistributionAnalyticsRepository;
    readonly aagoCampaignDashboard: AagoCampaignDashboardRepository;
    readonly aagoContentPerformance: AagoContentPerformanceRepository;
    readonly aagoLeadAttribution: AagoLeadAttributionRepository;
    readonly aagoGrowthKpis: AagoGrowthKpiRepository;
    readonly aagoRoiDashboard: AagoRoiDashboardRepository;
    readonly aagoRecommendationEngine: AagoRecommendationEngineRepository;
    readonly aagoCommandCenterMetrics: AagoCommandCenterMetricRepository;
    readonly aagoCommandCenterHealth: AagoCommandCenterHealthRepository;
    readonly aagoMissionStatus: AagoMissionStatusRepository;
    readonly aagoExecutiveSummaries: AagoExecutiveSummaryRepository;
    readonly aagoOperationalFailures: AagoOperationalFailureRepository;
    readonly aagoAuditLogs: AagoAuditLogRepository;`;
    da = da.replace(aageProp, aageProp + "\n" + aagoProps);

    const aageCtor = "        this.aageAuditLogs = new AageAuditLogRepository();";
    const aagoCtor = `        this.aagoOperationsHubs = new AagoOperationsHubRepository();
        this.aagoBrandKnowledgeBase = new AagoBrandKnowledgeBaseRepository();
        this.aagoBrandRulebook = new AagoBrandRulebookRepository();
        this.aagoMessagingLibrary = new AagoMessagingLibraryRepository();
        this.aagoServiceLibrary = new AagoServiceLibraryRepository();
        this.aagoIndustryLibrary = new AagoIndustryLibraryRepository();
        this.aagoFaqLibrary = new AagoFaqLibraryRepository();
        this.aagoBrandApprovalRules = new AagoBrandApprovalRuleRepository();
        this.aagoVideoProjects = new AagoVideoProjectRepository();
        this.aagoThumbnailManager = new AagoThumbnailManagerRepository();
        this.aagoVoiceoverManager = new AagoVoiceoverManagerRepository();
        this.aagoCreativeAssetGenerator = new AagoCreativeAssetGeneratorRepository();
        this.aagoCampaignAssetBuilder = new AagoCampaignAssetBuilderRepository();
        this.aagoCreativeWorkflows = new AagoCreativeWorkflowRepository();
        this.aagoDistributionContentQueue = new AagoDistributionContentQueueRepository();
        this.aagoDistributionPublishingQueue = new AagoDistributionPublishingQueueRepository();
        this.aagoChannelManager = new AagoChannelManagerRepository();
        this.aagoApprovalCenter = new AagoApprovalCenterRepository();
        this.aagoPublishingHistory = new AagoPublishingHistoryRepository();
        this.aagoDistributionAnalytics = new AagoDistributionAnalyticsRepository();
        this.aagoCampaignDashboard = new AagoCampaignDashboardRepository();
        this.aagoContentPerformance = new AagoContentPerformanceRepository();
        this.aagoLeadAttribution = new AagoLeadAttributionRepository();
        this.aagoGrowthKpis = new AagoGrowthKpiRepository();
        this.aagoRoiDashboard = new AagoRoiDashboardRepository();
        this.aagoRecommendationEngine = new AagoRecommendationEngineRepository();
        this.aagoCommandCenterMetrics = new AagoCommandCenterMetricRepository();
        this.aagoCommandCenterHealth = new AagoCommandCenterHealthRepository();
        this.aagoMissionStatus = new AagoMissionStatusRepository();
        this.aagoExecutiveSummaries = new AagoExecutiveSummaryRepository();
        this.aagoOperationalFailures = new AagoOperationalFailureRepository();
        this.aagoAuditLogs = new AagoAuditLogRepository();`;
    da = da.replace(aageCtor, aageCtor + "\n" + aagoCtor);
    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("aagoOperationsHubs")) {
    ds = ds.replace(
        "    aageAuditLogs: databaseAccess.aageAuditLogs,",
        `    aageAuditLogs: databaseAccess.aageAuditLogs,
    aagoOperationsHubs: databaseAccess.aagoOperationsHubs,
    aagoBrandKnowledgeBase: databaseAccess.aagoBrandKnowledgeBase,
    aagoBrandRulebook: databaseAccess.aagoBrandRulebook,
    aagoMessagingLibrary: databaseAccess.aagoMessagingLibrary,
    aagoServiceLibrary: databaseAccess.aagoServiceLibrary,
    aagoIndustryLibrary: databaseAccess.aagoIndustryLibrary,
    aagoFaqLibrary: databaseAccess.aagoFaqLibrary,
    aagoBrandApprovalRules: databaseAccess.aagoBrandApprovalRules,
    aagoVideoProjects: databaseAccess.aagoVideoProjects,
    aagoThumbnailManager: databaseAccess.aagoThumbnailManager,
    aagoVoiceoverManager: databaseAccess.aagoVoiceoverManager,
    aagoCreativeAssetGenerator: databaseAccess.aagoCreativeAssetGenerator,
    aagoCampaignAssetBuilder: databaseAccess.aagoCampaignAssetBuilder,
    aagoCreativeWorkflows: databaseAccess.aagoCreativeWorkflows,
    aagoDistributionContentQueue: databaseAccess.aagoDistributionContentQueue,
    aagoDistributionPublishingQueue: databaseAccess.aagoDistributionPublishingQueue,
    aagoChannelManager: databaseAccess.aagoChannelManager,
    aagoApprovalCenter: databaseAccess.aagoApprovalCenter,
    aagoPublishingHistory: databaseAccess.aagoPublishingHistory,
    aagoDistributionAnalytics: databaseAccess.aagoDistributionAnalytics,
    aagoCampaignDashboard: databaseAccess.aagoCampaignDashboard,
    aagoContentPerformance: databaseAccess.aagoContentPerformance,
    aagoLeadAttribution: databaseAccess.aagoLeadAttribution,
    aagoGrowthKpis: databaseAccess.aagoGrowthKpis,
    aagoRoiDashboard: databaseAccess.aagoRoiDashboard,
    aagoRecommendationEngine: databaseAccess.aagoRecommendationEngine,
    aagoCommandCenterMetrics: databaseAccess.aagoCommandCenterMetrics,
    aagoCommandCenterHealth: databaseAccess.aagoCommandCenterHealth,
    aagoMissionStatus: databaseAccess.aagoMissionStatus,
    aagoExecutiveSummaries: databaseAccess.aagoExecutiveSummaries,
    aagoOperationalFailures: databaseAccess.aagoOperationalFailures,
    aagoAuditLogs: databaseAccess.aagoAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}
console.log("Wired data-access and database-service for AAGO operational layer");
