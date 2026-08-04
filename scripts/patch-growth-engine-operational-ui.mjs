#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const inPath = join(root, "scripts/generate-enterprise-governance-platform-ui.mjs");
const outPath = join(root, "scripts/generate-growth-engine-ui.mjs");
let s = readFileSync(inPath, "utf8");

s = s.replace(/src\/modules\/enterprise-governance-platform/g, "src/modules/growth-engine");
s = s.replace(/const entities = \[[\s\S]*?\];/, `const entities = [
    { tab: "operationsHubs", plural: "operationsHubs", singular: "OperationsHub", pascal: "OperationsHub", db: "aagoOperationsHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "brandKnowledgeBase", plural: "brandKnowledgeBase", singular: "BrandKnowledgeBase", pascal: "BrandKnowledgeBase", db: "aagoBrandKnowledgeBase", fields: [{ name: "knowledgeKey", type: "string" }, { name: "knowledgeTitle", type: "string" }, { name: "knowledgeStatus", type: "select", options: "KNOWLEDGE_STATUS_OPTIONS" }], display: { title: "knowledgeTitle", sub: "knowledgeStatus" } },
    { tab: "brandRulebook", plural: "brandRulebook", singular: "BrandRulebook", pascal: "BrandRulebook", db: "aagoBrandRulebook", fields: [{ name: "rulebookKey", type: "string" }, { name: "rulebookName", type: "string" }, { name: "rulebookStatus", type: "select", options: "RULEBOOK_STATUS_OPTIONS" }], display: { title: "rulebookName", sub: "rulebookStatus" } },
    { tab: "messagingLibrary", plural: "messagingLibrary", singular: "MessagingLibrary", pascal: "MessagingLibrary", db: "aagoMessagingLibrary", fields: [{ name: "messageKey", type: "string" }, { name: "messageTitle", type: "string" }, { name: "messageStatus", type: "select", options: "MESSAGE_STATUS_OPTIONS" }], display: { title: "messageTitle", sub: "messageStatus" } },
    { tab: "serviceLibrary", plural: "serviceLibrary", singular: "ServiceLibrary", pascal: "ServiceLibrary", db: "aagoServiceLibrary", fields: [{ name: "serviceKey", type: "string" }, { name: "serviceName", type: "string" }, { name: "serviceStatus", type: "select", options: "SERVICE_STATUS_OPTIONS" }], display: { title: "serviceName", sub: "serviceStatus" } },
    { tab: "industryLibrary", plural: "industryLibrary", singular: "IndustryLibrary", pascal: "IndustryLibrary", db: "aagoIndustryLibrary", fields: [{ name: "industryKey", type: "string" }, { name: "industryName", type: "string" }, { name: "industryStatus", type: "select", options: "INDUSTRY_STATUS_OPTIONS" }], display: { title: "industryName", sub: "industryStatus" } },
    { tab: "faqLibrary", plural: "faqLibrary", singular: "FaqLibrary", pascal: "FaqLibrary", db: "aagoFaqLibrary", fields: [{ name: "faqKey", type: "string" }, { name: "faqQuestion", type: "string" }, { name: "faqStatus", type: "select", options: "FAQ_STATUS_OPTIONS" }], display: { title: "faqQuestion", sub: "faqStatus" } },
    { tab: "brandApprovalRules", plural: "brandApprovalRules", singular: "BrandApprovalRule", pascal: "BrandApprovalRule", db: "aagoBrandApprovalRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleStatus", type: "select", options: "RULE_STATUS_OPTIONS" }], display: { title: "ruleName", sub: "ruleStatus" } },
    { tab: "videoProjects", plural: "videoProjects", singular: "VideoProject", pascal: "VideoProject", db: "aagoVideoProjects", fields: [{ name: "projectKey", type: "string" }, { name: "projectName", type: "string" }, { name: "projectStatus", type: "select", options: "PROJECT_STATUS_OPTIONS" }], display: { title: "projectName", sub: "projectStatus" } },
    { tab: "thumbnailManager", plural: "thumbnailManager", singular: "ThumbnailManager", pascal: "ThumbnailManager", db: "aagoThumbnailManager", fields: [{ name: "thumbnailKey", type: "string" }, { name: "thumbnailName", type: "string" }, { name: "thumbnailStatus", type: "select", options: "THUMBNAIL_STATUS_OPTIONS" }], display: { title: "thumbnailName", sub: "thumbnailStatus" } },
    { tab: "voiceoverManager", plural: "voiceoverManager", singular: "VoiceoverManager", pascal: "VoiceoverManager", db: "aagoVoiceoverManager", fields: [{ name: "voiceoverKey", type: "string" }, { name: "voiceoverName", type: "string" }, { name: "voiceoverStatus", type: "select", options: "VOICEOVER_STATUS_OPTIONS" }], display: { title: "voiceoverName", sub: "voiceoverStatus" } },
    { tab: "creativeAssetGenerator", plural: "creativeAssetGenerator", singular: "CreativeAssetGenerator", pascal: "CreativeAssetGenerator", db: "aagoCreativeAssetGenerator", fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" } },
    { tab: "campaignAssetBuilder", plural: "campaignAssetBuilder", singular: "CampaignAssetBuilder", pascal: "CampaignAssetBuilder", db: "aagoCampaignAssetBuilder", fields: [{ name: "builderKey", type: "string" }, { name: "builderName", type: "string" }, { name: "builderStatus", type: "select", options: "BUILDER_STATUS_OPTIONS" }], display: { title: "builderName", sub: "builderStatus" } },
    { tab: "creativeWorkflows", plural: "creativeWorkflows", singular: "CreativeWorkflow", pascal: "CreativeWorkflow", db: "aagoCreativeWorkflows", fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" } },
    { tab: "distributionContentQueue", plural: "distributionContentQueue", singular: "DistributionContentQueue", pascal: "DistributionContentQueue", db: "aagoDistributionContentQueue", fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" } },
    { tab: "distributionPublishingQueue", plural: "distributionPublishingQueue", singular: "DistributionPublishingQueue", pascal: "DistributionPublishingQueue", db: "aagoDistributionPublishingQueue", fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" } },
    { tab: "channelManager", plural: "channelManager", singular: "ChannelManager", pascal: "ChannelManager", db: "aagoChannelManager", fields: [{ name: "channelKey", type: "string" }, { name: "channelName", type: "string" }, { name: "channelStatus", type: "select", options: "CHANNEL_STATUS_OPTIONS" }], display: { title: "channelName", sub: "channelStatus" } },
    { tab: "approvalCenter", plural: "approvalCenter", singular: "ApprovalCenter", pascal: "ApprovalCenter", db: "aagoApprovalCenter", fields: [{ name: "approvalKey", type: "string" }, { name: "approvalTitle", type: "string" }, { name: "approvalStatus", type: "select", options: "APPROVAL_STATUS_OPTIONS" }], display: { title: "approvalTitle", sub: "approvalStatus" } },
    { tab: "publishingHistory", plural: "publishingHistory", singular: "PublishingHistory", pascal: "PublishingHistory", db: "aagoPublishingHistory", fields: [{ name: "historyKey", type: "string" }, { name: "historyTitle", type: "string" }, { name: "historyStatus", type: "select", options: "HISTORY_STATUS_OPTIONS" }], display: { title: "historyTitle", sub: "historyStatus" } },
    { tab: "distributionAnalytics", plural: "distributionAnalytics", singular: "DistributionAnalytics", pascal: "DistributionAnalytics", db: "aagoDistributionAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsName", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsName", sub: "analyticsScore" } },
    { tab: "campaignDashboard", plural: "campaignDashboard", singular: "CampaignDashboard", pascal: "CampaignDashboard", db: "aagoCampaignDashboard", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "contentPerformance", plural: "contentPerformance", singular: "ContentPerformance", pascal: "ContentPerformance", db: "aagoContentPerformance", fields: [{ name: "performanceKey", type: "string" }, { name: "performanceTitle", type: "string" }, { name: "performanceScore", type: "number" }], display: { title: "performanceTitle", sub: "performanceScore" } },
    { tab: "leadAttribution", plural: "leadAttribution", singular: "LeadAttribution", pascal: "LeadAttribution", db: "aagoLeadAttribution", fields: [{ name: "attributionKey", type: "string" }, { name: "attributionTitle", type: "string" }, { name: "attributionStatus", type: "select", options: "ATTRIBUTION_STATUS_OPTIONS" }], display: { title: "attributionTitle", sub: "attributionStatus" } },
    { tab: "growthKpis", plural: "growthKpis", singular: "GrowthKpi", pascal: "GrowthKpi", db: "aagoGrowthKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiValue", type: "number" }], display: { title: "kpiName", sub: "kpiValue" } },
    { tab: "roiDashboard", plural: "roiDashboard", singular: "RoiDashboard", pascal: "RoiDashboard", db: "aagoRoiDashboard", fields: [{ name: "roiKey", type: "string" }, { name: "roiName", type: "string" }, { name: "roiScore", type: "number" }], display: { title: "roiName", sub: "roiScore" } },
    { tab: "recommendationEngine", plural: "recommendationEngine", singular: "RecommendationEngine", pascal: "RecommendationEngine", db: "aagoRecommendationEngine", fields: [{ name: "recommendationKey", type: "string" }, { name: "recommendationTitle", type: "string" }, { name: "recommendationStatus", type: "select", options: "RECOMMENDATION_STATUS_OPTIONS" }], display: { title: "recommendationTitle", sub: "recommendationStatus" } },
    { tab: "commandCenterMetrics", plural: "commandCenterMetrics", singular: "CommandCenterMetric", pascal: "CommandCenterMetric", db: "aagoCommandCenterMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallOperationsScore", type: "number" }, { name: "missionStatusScore", type: "number" }], display: { title: "metricsKey", sub: "overallOperationsScore" } },
    { tab: "commandCenterHealth", plural: "commandCenterHealth", singular: "CommandCenterHealth", pascal: "CommandCenterHealth", db: "aagoCommandCenterHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "brandOsStatus", type: "string" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "missionStatus", plural: "missionStatus", singular: "MissionStatus", pascal: "MissionStatus", db: "aagoMissionStatus", fields: [{ name: "missionKey", type: "string" }, { name: "missionName", type: "string" }, { name: "missionStatus", type: "select", options: "MISSION_STATUS_OPTIONS" }], display: { title: "missionName", sub: "missionStatus" } },
    { tab: "executiveSummaries", plural: "executiveSummaries", singular: "ExecutiveSummary", pascal: "ExecutiveSummary", db: "aagoExecutiveSummaries", fields: [{ name: "summaryKey", type: "string" }, { name: "summaryTitle", type: "string" }, { name: "summaryStatus", type: "select", options: "SUMMARY_STATUS_OPTIONS" }], display: { title: "summaryTitle", sub: "summaryStatus" } },
    { tab: "operationalFailures", plural: "operationalFailures", singular: "OperationalFailure", pascal: "OperationalFailure", db: "aagoOperationalFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`);

const reps = [
    [/enterprise-governance-platform/g, "growth-engine"],
    [/EnterpriseGovernancePlatform/g, "GrowthEngine"],
    [/enterpriseGovernancePlatform/g, "growthEngine"],
    [/EGP_/g, "AAGE_"],
    [/Egp/g, "Aago"],
    [/egp/g, "aago"],
    [/GovernanceHub/g, "OperationsHub"],
    [/governanceHub/g, "operationsHub"],
    [/governanceHubId/g, "operationsHubId"],
    [/GovernanceHubSelect/g, "OperationsHubSelect"],
    [/buildGovernanceHubLookupMaps/g, "buildOperationsHubLookupMaps"],
    [/GovernanceMetric/g, "CommandCenterMetric"],
    [/GovernanceHealth/g, "CommandCenterHealth"],
    [/GovernanceFailure/g, "OperationalFailure"],
    [/governanceMetrics/g, "commandCenterMetrics"],
    [/governanceHealth/g, "commandCenterHealth"],
    [/governanceFailures/g, "operationalFailures"],
    [/totalGovernanceHubs/g, "totalOperationsHubs"],
    [/activeGovernanceHubs/g, "activeOperationsHubs"],
    [/overallGovernanceScore/g, "overallOperationsScore"],
    [/governanceHealthScore/g, "missionStatusScore"],
    [/complianceScore/g, "contentStatusScore"],
    [/enterpriseRiskScore/g, "publishingStatusScore"],
    [/pipelineHealthScore/g, "growthMetricsScore"],
    [/missionProgressScore/g, "campaignHealthScore"],
    [/pendingAiApprovalCount/g, "executiveSummaryScore"],
    [/openGovernanceFailureCount/g, "openOperationalFailureCount"],
    [/growthOrchestratorCount/g, "brandKnowledgeBaseCount"],
    [/deliveryOrchestratorCount/g, "videoProjectCount"],
    [/ideaRegistryCount/g, "distributionContentQueueCount"],
    [/aiTaskRouterCount/g, "campaignDashboardCount"],
    [/humanApprovalCount/g, "missionStatusCount"],
    [/organizationGovernance/g, "brandKnowledgeBase"],
    [/governancePolicies/g, "brandRulebook"],
    [/governanceFramework/g, "messagingLibrary"],
    [/governanceReviews/g, "serviceLibrary"],
    [/governanceDashboards/g, "industryLibrary"],
    [/complianceFramework/g, "faqLibrary"],
    [/complianceControls/g, "brandApprovalRules"],
    [/complianceEvidence/g, "videoProjects"],
    [/complianceReports/g, "thumbnailManager"],
    [/complianceCalendar/g, "voiceoverManager"],
    [/auditCenter/g, "creativeAssetGenerator"],
    [/auditFindings/g, "campaignAssetBuilder"],
    [/correctiveActions/g, "creativeWorkflows"],
    [/auditEvidence/g, "distributionContentQueue"],
    [/auditAnalytics/g, "distributionPublishingQueue"],
    [/dataClassification/g, "channelManager"],
    [/retentionPolicies/g, "approvalCenter"],
    [/dataLifecycle/g, "publishingHistory"],
    [/dataOwnership/g, "distributionAnalytics"],
    [/dataQuality/g, "campaignDashboard"],
    [/riskRegister/g, "contentPerformance"],
    [/riskAssessment/g, "leadAttribution"],
    [/riskMitigation/g, "growthKpis"],
    [/riskMonitoring/g, "roiDashboard"],
    [/businessContinuity/g, "recommendationEngine"],
    [/complianceDashboards/g, "missionStatus"],
    [/missionProgress/g, "executiveSummaries"],
    [/mapOrganizationGovernanceForStats/g, "mapBrandKnowledgeBaseForStats"],
    [/mapComplianceControlForStats/g, "mapVideoProjectForStats"],
    [/mapAuditFindingForStats/g, "mapDistributionContentQueueForStats"],
    [/mapRiskRegisterForStats/g, "mapCampaignDashboardForStats"],
    [/mapDataClassificationForStats/g, "mapMissionStatusForStats"],
    [/mapGovernanceMetricForStats/g, "mapCommandCenterMetricForStats"],
    [/mapGovernanceHealthForStats/g, "mapCommandCenterHealthForStats"],
    [/mapGovernanceFailureForStats/g, "mapOperationalFailureForStats"],
    [/createOrganizationGovernance/g, "createBrandKnowledgeBase"],
    [/createComplianceControl/g, "createVideoProject"],
    [/createAuditFinding/g, "createDistributionContentQueue"],
    [/GovernanceService/g, "BrandOsService"],
    [/ComplianceService/g, "CreativeStudioService"],
    [/AuditService/g, "DistributionService"],
    [/DataGovernanceService/g, "GrowthIntelligenceService"],
    [/RiskManagementService/g, "CommandCenterService"],
    [/DashboardService/g, "CommandCenterService"],
    [/runGovernanceService/g, "runBrandOsService"],
    [/runComplianceService/g, "runCreativeStudioService"],
    [/runAuditService/g, "runDistributionService"],
    [/runDataGovernanceService/g, "runGrowthIntelligenceService"],
    [/runRiskManagementService/g, "runCommandCenterService"],
    [/runDashboardService/g, "runCommandCenterService"],
    [/sdkRunGovernanceService/g, "sdkRunBrandOsService"],
    [/sdkRunComplianceService/g, "sdkRunCreativeStudioService"],
    [/sdkRunAuditService/g, "sdkRunDistributionService"],
    [/sdkRunDataGovernanceService/g, "sdkRunGrowthIntelligenceService"],
    [/sdkRunRiskManagementService/g, "sdkRunCommandCenterService"],
    [/sdkRunDashboardService/g, "sdkRunCommandCenterService"],
    [/EgpSdkRunGovernanceService/g, "AagoSdkRunBrandOsService"],
    [/EgpSdkRunComplianceService/g, "AagoSdkRunCreativeStudioService"],
    [/EgpSdkRunAuditService/g, "AagoSdkRunDistributionService"],
    [/EgpSdkRunDataGovernanceService/g, "AagoSdkRunGrowthIntelligenceService"],
    [/EgpSdkRunRiskManagementService/g, "AagoSdkRunCommandCenterService"],
    [/EgpSdkRunDashboardService/g, "AagoSdkRunCommandCenterService"],
    [/enterprise_governance_platform/g, "arjun_automation_growth_engine"],
    [/rose/g, "pink"],
    [/ShieldCheck/g, "TrendingUp"],
    [/Enterprise Governance Platform/g, "Operational Growth Engine"],
    [/Enterprise Governance/g, "Operational Growth Engine"],
    [/Governance Hubs/g, "Operations Hubs"],
    [/governance hub/g, "operations hub"],
    [/Select governance hub/g, "Select operations hub"],
    [/"egp\./g, '"aage.'],
    [/GovernanceOverviewPanel/g, "GrowthOverviewPanel"],
    [/GovernanceAuditLogsPanel/g, "GrowthAuditLogsPanel"],
    [/GovernanceSdkPanel/g, "GrowthSdkPanel"],
    [/GovernanceData/g, "GrowthData"],
    [/createEnterpriseGovernancePlatformClient/g, "createGrowthEngineClient"],
    [/getGovernanceHubs/g, "getOperationsHubs"],
    [/buildEgpDashboardStats/g, "buildAagoDashboardStats"],
    [/buildEgpPipelineInfo/g, "buildAagoPipelineInfo"],
    [/buildEgpAuditPayload/g, "buildAagoAuditPayload"],
    [/growth-engine-mappers/g, "growth-engine-operations-mappers"],
    [/aageAuditLogs/g, "aagoAuditLogs"],
    [/aageGrowthHubs/g, "aagoOperationsHubs"],
    [/getGrowthHubs/g, "getOperationsHubs"],
    [/getGrowthHubOptions/g, "getOperationsHubOptions"],
    [/growthHubOptions/g, "operationsHubOptions"],
    [/growthHubs/g, "operationsHubs"],
    [/Growth Hubs/g, "Operations Hubs"],
    [/Growth Hub/g, "Operations Hub"],
    [/growth hub/g, "operations hub"],
];

for (const [from, to] of reps) s = s.replace(from, to);

const aagoOptions = `export const KNOWLEDGE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
] as const;

export const RULEBOOK_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const MESSAGE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const SERVICE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const INDUSTRY_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const FAQ_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const RULE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const PROJECT_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
] as const;

export const THUMBNAIL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const VOICEOVER_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const GENERATOR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const BUILDER_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const WORKFLOW_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const QUEUE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
] as const;

export const CHANNEL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const APPROVAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const HISTORY_STATUS_OPTIONS = [
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const ATTRIBUTION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const RECOMMENDATION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const MISSION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "paused", label: "Paused" },
] as const;

export const SUMMARY_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
] as const;

export const AAGE_PERMISSIONS = ["aage.view", "aage.manage", "aage.approve", "aage.admin"] as const;

export const AAGE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const AAGE_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const AAGE_THEME)/,
    `$1${aagoOptions}$2`,
);

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-growth-engine-ui.mjs for AAGO operational entities");
