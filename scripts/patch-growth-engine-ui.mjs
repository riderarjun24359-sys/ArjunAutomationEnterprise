#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const inPath = join(root, "scripts/generate-enterprise-governance-platform-ui.mjs");
const outPath = join(root, "scripts/generate-growth-engine-ui.mjs");
let s = readFileSync(inPath, "utf8");

s = s.replace(/src\/modules\/enterprise-governance-platform/g, "src/modules/growth-engine");
s = s.replace(/const entities = \[[\s\S]*?\];/, "const entities = [\n    { tab: \"growthHubs\", plural: \"growthHubs\", singular: \"GrowthHub\", pascal: \"GrowthHub\", db: \"aageGrowthHubs\", hubField: false, fields: [{ name: \"hubKey\", type: \"string\" }, { name: \"hubName\", type: \"string\" }, { name: \"environment\", type: \"string\" }], display: { title: \"hubName\", sub: \"hubKey\" } },\n    { tab: \"brandProfiles\", plural: \"brandProfiles\", singular: \"BrandProfile\", pascal: \"BrandProfile\", db: \"aageBrandProfiles\", fields: [{ name: \"profileKey\", type: \"string\" }, { name: \"profileName\", type: \"string\" }, { name: \"profileStatus\", type: \"select\", options: \"PROFILE_STATUS_OPTIONS\" }], display: { title: \"profileName\", sub: \"profileStatus\" } },\n    { tab: \"brandVoice\", plural: \"brandVoice\", singular: \"BrandVoice\", pascal: \"BrandVoice\", db: \"aageBrandVoice\", fields: [{ name: \"voiceKey\", type: \"string\" }, { name: \"voiceName\", type: \"string\" }, { name: \"voiceTone\", type: \"string\" }], display: { title: \"voiceName\", sub: \"voiceTone\" } },\n    { tab: \"coreMessaging\", plural: \"coreMessaging\", singular: \"CoreMessaging\", pascal: \"CoreMessaging\", db: \"aageCoreMessaging\", fields: [{ name: \"messagingKey\", type: \"string\" }, { name: \"messagingTitle\", type: \"string\" }, { name: \"messagingStatus\", type: \"select\", options: \"MESSAGING_STATUS_OPTIONS\" }], display: { title: \"messagingTitle\", sub: \"messagingStatus\" } },\n    { tab: \"brandGuidelines\", plural: \"brandGuidelines\", singular: \"BrandGuideline\", pascal: \"BrandGuideline\", db: \"aageBrandGuidelines\", fields: [{ name: \"guidelineKey\", type: \"string\" }, { name: \"guidelineName\", type: \"string\" }, { name: \"guidelineStatus\", type: \"select\", options: \"GUIDELINE_STATUS_OPTIONS\" }], display: { title: \"guidelineName\", sub: \"guidelineStatus\" } },\n    { tab: \"logoLibrary\", plural: \"logoLibrary\", singular: \"LogoLibrary\", pascal: \"LogoLibrary\", db: \"aageLogoLibrary\", fields: [{ name: \"logoKey\", type: \"string\" }, { name: \"logoName\", type: \"string\" }, { name: \"logoFormat\", type: \"string\" }], display: { title: \"logoName\", sub: \"logoFormat\" } },\n    { tab: \"colorSystems\", plural: \"colorSystems\", singular: \"ColorSystem\", pascal: \"ColorSystem\", db: \"aageColorSystems\", fields: [{ name: \"colorKey\", type: \"string\" }, { name: \"colorName\", type: \"string\" }, { name: \"primaryHex\", type: \"string\" }], display: { title: \"colorName\", sub: \"primaryHex\" } },\n    { tab: \"youtubeTemplates\", plural: \"youtubeTemplates\", singular: \"YoutubeTemplate\", pascal: \"YoutubeTemplate\", db: \"aageYoutubeTemplates\", fields: [{ name: \"templateKey\", type: \"string\" }, { name: \"templateName\", type: \"string\" }, { name: \"templateStatus\", type: \"select\", options: \"TEMPLATE_STATUS_OPTIONS\" }], display: { title: \"templateName\", sub: \"templateStatus\" } },\n    { tab: \"socialTemplates\", plural: \"socialTemplates\", singular: \"SocialTemplate\", pascal: \"SocialTemplate\", db: \"aageSocialTemplates\", fields: [{ name: \"templateKey\", type: \"string\" }, { name: \"templateName\", type: \"string\" }, { name: \"templateStatus\", type: \"select\", options: \"TEMPLATE_STATUS_OPTIONS\" }], display: { title: \"templateName\", sub: \"templateStatus\" } },\n    { tab: \"blogTemplates\", plural: \"blogTemplates\", singular: \"BlogTemplate\", pascal: \"BlogTemplate\", db: \"aageBlogTemplates\", fields: [{ name: \"templateKey\", type: \"string\" }, { name: \"templateName\", type: \"string\" }, { name: \"templateStatus\", type: \"select\", options: \"TEMPLATE_STATUS_OPTIONS\" }], display: { title: \"templateName\", sub: \"templateStatus\" } },\n    { tab: \"websiteArticleTemplates\", plural: \"websiteArticleTemplates\", singular: \"WebsiteArticleTemplate\", pascal: \"WebsiteArticleTemplate\", db: \"aageWebsiteArticleTemplates\", fields: [{ name: \"templateKey\", type: \"string\" }, { name: \"templateName\", type: \"string\" }, { name: \"templateStatus\", type: \"select\", options: \"TEMPLATE_STATUS_OPTIONS\" }], display: { title: \"templateName\", sub: \"templateStatus\" } },\n    { tab: \"emailCampaignTemplates\", plural: \"emailCampaignTemplates\", singular: \"EmailCampaignTemplate\", pascal: \"EmailCampaignTemplate\", db: \"aageEmailCampaignTemplates\", fields: [{ name: \"templateKey\", type: \"string\" }, { name: \"templateName\", type: \"string\" }, { name: \"templateStatus\", type: \"select\", options: \"TEMPLATE_STATUS_OPTIONS\" }], display: { title: \"templateName\", sub: \"templateStatus\" } },\n    { tab: \"caseStudyTemplates\", plural: \"caseStudyTemplates\", singular: \"CaseStudyTemplate\", pascal: \"CaseStudyTemplate\", db: \"aageCaseStudyTemplates\", fields: [{ name: \"templateKey\", type: \"string\" }, { name: \"templateName\", type: \"string\" }, { name: \"templateStatus\", type: \"select\", options: \"TEMPLATE_STATUS_OPTIONS\" }], display: { title: \"templateName\", sub: \"templateStatus\" } },\n    { tab: \"imageAssets\", plural: \"imageAssets\", singular: \"ImageAsset\", pascal: \"ImageAsset\", db: \"aageImageAssets\", fields: [{ name: \"assetKey\", type: \"string\" }, { name: \"assetName\", type: \"string\" }, { name: \"assetType\", type: \"string\" }], display: { title: \"assetName\", sub: \"assetType\" } },\n    { tab: \"videoAssets\", plural: \"videoAssets\", singular: \"VideoAsset\", pascal: \"VideoAsset\", db: \"aageVideoAssets\", fields: [{ name: \"assetKey\", type: \"string\" }, { name: \"assetName\", type: \"string\" }, { name: \"assetType\", type: \"string\" }], display: { title: \"assetName\", sub: \"assetType\" } },\n    { tab: \"iconAssets\", plural: \"iconAssets\", singular: \"IconAsset\", pascal: \"IconAsset\", db: \"aageIconAssets\", fields: [{ name: \"assetKey\", type: \"string\" }, { name: \"assetName\", type: \"string\" }, { name: \"assetType\", type: \"string\" }], display: { title: \"assetName\", sub: \"assetType\" } },\n    { tab: \"voiceProfiles\", plural: \"voiceProfiles\", singular: \"VoiceProfile\", pascal: \"VoiceProfile\", db: \"aageVoiceProfiles\", fields: [{ name: \"profileKey\", type: \"string\" }, { name: \"profileName\", type: \"string\" }, { name: \"voiceType\", type: \"string\" }], display: { title: \"profileName\", sub: \"voiceType\" } },\n    { tab: \"musicAssets\", plural: \"musicAssets\", singular: \"MusicAsset\", pascal: \"MusicAsset\", db: \"aageMusicAssets\", fields: [{ name: \"assetKey\", type: \"string\" }, { name: \"assetName\", type: \"string\" }, { name: \"genre\", type: \"string\" }], display: { title: \"assetName\", sub: \"genre\" } },\n    { tab: \"thumbnailTemplates\", plural: \"thumbnailTemplates\", singular: \"ThumbnailTemplate\", pascal: \"ThumbnailTemplate\", db: \"aageThumbnailTemplates\", fields: [{ name: \"templateKey\", type: \"string\" }, { name: \"templateName\", type: \"string\" }, { name: \"templateStatus\", type: \"select\", options: \"TEMPLATE_STATUS_OPTIONS\" }], display: { title: \"templateName\", sub: \"templateStatus\" } },\n    { tab: \"ideaGenerators\", plural: \"ideaGenerators\", singular: \"IdeaGenerator\", pascal: \"IdeaGenerator\", db: \"aageIdeaGenerators\", fields: [{ name: \"generatorKey\", type: \"string\" }, { name: \"generatorName\", type: \"string\" }, { name: \"generatorStatus\", type: \"select\", options: \"GENERATOR_STATUS_OPTIONS\" }], display: { title: \"generatorName\", sub: \"generatorStatus\" } },\n    { tab: \"scriptGenerators\", plural: \"scriptGenerators\", singular: \"ScriptGenerator\", pascal: \"ScriptGenerator\", db: \"aageScriptGenerators\", fields: [{ name: \"generatorKey\", type: \"string\" }, { name: \"generatorName\", type: \"string\" }, { name: \"generatorStatus\", type: \"select\", options: \"GENERATOR_STATUS_OPTIONS\" }], display: { title: \"generatorName\", sub: \"generatorStatus\" } },\n    { tab: \"captionGenerators\", plural: \"captionGenerators\", singular: \"CaptionGenerator\", pascal: \"CaptionGenerator\", db: \"aageCaptionGenerators\", fields: [{ name: \"generatorKey\", type: \"string\" }, { name: \"generatorName\", type: \"string\" }, { name: \"generatorStatus\", type: \"select\", options: \"GENERATOR_STATUS_OPTIONS\" }], display: { title: \"generatorName\", sub: \"generatorStatus\" } },\n    { tab: \"blogGenerators\", plural: \"blogGenerators\", singular: \"BlogGenerator\", pascal: \"BlogGenerator\", db: \"aageBlogGenerators\", fields: [{ name: \"generatorKey\", type: \"string\" }, { name: \"generatorName\", type: \"string\" }, { name: \"generatorStatus\", type: \"select\", options: \"GENERATOR_STATUS_OPTIONS\" }], display: { title: \"generatorName\", sub: \"generatorStatus\" } },\n    { tab: \"seoAssistants\", plural: \"seoAssistants\", singular: \"SeoAssistant\", pascal: \"SeoAssistant\", db: \"aageSeoAssistants\", fields: [{ name: \"assistantKey\", type: \"string\" }, { name: \"assistantName\", type: \"string\" }, { name: \"assistantStatus\", type: \"select\", options: \"ASSISTANT_STATUS_OPTIONS\" }], display: { title: \"assistantName\", sub: \"assistantStatus\" } },\n    { tab: \"ctaGenerators\", plural: \"ctaGenerators\", singular: \"CtaGenerator\", pascal: \"CtaGenerator\", db: \"aageCtaGenerators\", fields: [{ name: \"generatorKey\", type: \"string\" }, { name: \"generatorName\", type: \"string\" }, { name: \"generatorStatus\", type: \"select\", options: \"GENERATOR_STATUS_OPTIONS\" }], display: { title: \"generatorName\", sub: \"generatorStatus\" } },\n    { tab: \"growthMetrics\", plural: \"growthMetrics\", singular: \"GrowthMetric\", pascal: \"GrowthMetric\", db: \"aageGrowthMetrics\", hubField: false, orgOnly: true, fields: [{ name: \"metricsKey\", type: \"string\" }, { name: \"overallGrowthScore\", type: \"number\" }, { name: \"brandHealthScore\", type: \"number\" }], display: { title: \"metricsKey\", sub: \"overallGrowthScore\" } },\n    { tab: \"growthHealth\", plural: \"growthHealth\", singular: \"GrowthHealth\", pascal: \"GrowthHealth\", db: \"aageGrowthHealth\", hubField: false, orgOnly: true, fields: [{ name: \"healthKey\", type: \"string\" }, { name: \"overallScore\", type: \"number\" }, { name: \"brandStatus\", type: \"string\" }], display: { title: \"healthKey\", sub: \"overallScore\" } },\n    { tab: \"contentCalendar\", plural: \"contentCalendar\", singular: \"ContentCalendar\", pascal: \"ContentCalendar\", db: \"aageContentCalendar\", fields: [{ name: \"calendarKey\", type: \"string\" }, { name: \"calendarName\", type: \"string\" }, { name: \"calendarStatus\", type: \"select\", options: \"CALENDAR_STATUS_OPTIONS\" }], display: { title: \"calendarName\", sub: \"calendarStatus\" } },\n    { tab: \"draftQueue\", plural: \"draftQueue\", singular: \"DraftQueue\", pascal: \"DraftQueue\", db: \"aageDraftQueue\", fields: [{ name: \"queueKey\", type: \"string\" }, { name: \"queueTitle\", type: \"string\" }, { name: \"queueStatus\", type: \"select\", options: \"QUEUE_STATUS_OPTIONS\" }], display: { title: \"queueTitle\", sub: \"queueStatus\" } },\n    { tab: \"approvalQueue\", plural: \"approvalQueue\", singular: \"ApprovalQueue\", pascal: \"ApprovalQueue\", db: \"aageApprovalQueue\", fields: [{ name: \"queueKey\", type: \"string\" }, { name: \"queueTitle\", type: \"string\" }, { name: \"queueStatus\", type: \"select\", options: \"QUEUE_STATUS_OPTIONS\" }], display: { title: \"queueTitle\", sub: \"queueStatus\" } },\n    { tab: \"publishingQueue\", plural: \"publishingQueue\", singular: \"PublishingQueue\", pascal: \"PublishingQueue\", db: \"aagePublishingQueue\", fields: [{ name: \"queueKey\", type: \"string\" }, { name: \"queueTitle\", type: \"string\" }, { name: \"queueStatus\", type: \"select\", options: \"QUEUE_STATUS_OPTIONS\" }], display: { title: \"queueTitle\", sub: \"queueStatus\" } },\n];");

const reps = [
    [/enterprise-governance-platform/g, "growth-engine"],
    [/EnterpriseGovernancePlatform/g, "GrowthEngine"],
    [/enterpriseGovernancePlatform/g, "growthEngine"],
    [/EGP_/g, "AAGE_"],
    [/Egp/g, "Aage"],
    [/egp/g, "aage"],
    [/GovernanceHub/g, "GrowthHub"],
    [/governanceHub/g, "growthHub"],
    [/governanceHubId/g, "growthHubId"],
    [/GovernanceHubSelect/g, "GrowthHubSelect"],
    [/buildGovernanceHubLookupMaps/g, "buildGrowthHubLookupMaps"],
    [/GovernanceMetric/g, "GrowthMetric"],
    [/GovernanceHealth/g, "GrowthHealth"],
    [/GovernanceFailure/g, "PublishingQueue"],
    [/governanceMetrics/g, "growthMetrics"],
    [/governanceHealth/g, "growthHealth"],
    [/governanceFailures/g, "publishingQueues"],
    [/totalGovernanceHubs/g, "totalGrowthHubs"],
    [/activeGovernanceHubs/g, "activeGrowthHubs"],
    [/overallGovernanceScore/g, "overallGrowthScore"],
    [/governanceHealthScore/g, "marketingOverviewScore"],
    [/complianceScore/g, "brandHealthScore"],
    [/enterpriseRiskScore/g, "contentCalendarCount"],
    [/pipelineHealthScore/g, "draftQueueCount"],
    [/missionProgressScore/g, "approvalQueueCount"],
    [/pendingAiApprovalCount/g, "publishingQueueCount"],
    [/openGovernanceFailureCount/g, "publishingQueueCount"],
    [/growthOrchestratorCount/g, "brandProfileCount"],
    [/deliveryOrchestratorCount/g, "youtubeTemplateCount"],
    [/ideaRegistryCount/g, "imageAssetCount"],
    [/aiTaskRouterCount/g, "ideaGeneratorCount"],
    [/humanApprovalCount/g, "contentCalendarCount"],
    [/organizationGovernance/g, "brandProfiles"],
    [/governancePolicies/g, "brandVoice"],
    [/governanceFramework/g, "coreMessaging"],
    [/governanceReviews/g, "brandGuidelines"],
    [/governanceDashboards/g, "logoLibrary"],
    [/complianceFramework/g, "colorSystems"],
    [/complianceControls/g, "youtubeTemplates"],
    [/complianceEvidence/g, "socialTemplates"],
    [/complianceReports/g, "blogTemplates"],
    [/complianceCalendar/g, "websiteArticleTemplates"],
    [/auditCenter/g, "emailCampaignTemplates"],
    [/auditFindings/g, "caseStudyTemplates"],
    [/correctiveActions/g, "imageAssets"],
    [/auditEvidence/g, "videoAssets"],
    [/auditAnalytics/g, "iconAssets"],
    [/dataClassification/g, "voiceProfiles"],
    [/retentionPolicies/g, "musicAssets"],
    [/dataLifecycle/g, "thumbnailTemplates"],
    [/dataOwnership/g, "ideaGenerators"],
    [/dataQuality/g, "scriptGenerators"],
    [/riskRegister/g, "captionGenerators"],
    [/riskAssessment/g, "blogGenerators"],
    [/riskMitigation/g, "seoAssistants"],
    [/riskMonitoring/g, "ctaGenerators"],
    [/businessContinuity/g, "contentCalendar"],
    [/complianceDashboards/g, "draftQueue"],
    [/missionProgress/g, "approvalQueue"],
    [/mapOrganizationGovernanceForStats/g, "mapBrandProfileForStats"],
    [/mapComplianceControlForStats/g, "mapYoutubeTemplateForStats"],
    [/mapAuditFindingForStats/g, "mapImageAssetForStats"],
    [/mapRiskRegisterForStats/g, "mapIdeaGeneratorForStats"],
    [/mapDataClassificationForStats/g, "mapContentCalendarForStats"],
    [/mapGovernanceMetricForStats/g, "mapGrowthMetricForStats"],
    [/mapGovernanceHealthForStats/g, "mapGrowthHealthForStats"],
    [/mapGovernanceFailureForStats/g, "mapPublishingQueueForStats"],
    [/createOrganizationGovernance/g, "createBrandProfile"],
    [/createComplianceControl/g, "createYoutubeTemplate"],
    [/createAuditFinding/g, "createImageAsset"],
    [/GovernanceService/g, "BrandService"],
    [/ComplianceService/g, "ContentFoundationService"],
    [/AuditService/g, "MediaFoundationService"],
    [/DataGovernanceService/g, "ContentEngineService"],
    [/RiskManagementService/g, "FounderDashboardService"],
    [/DashboardService/g, "FounderDashboardService"],
    [/runGovernanceService/g, "runBrandService"],
    [/runComplianceService/g, "runContentFoundationService"],
    [/runAuditService/g, "runMediaFoundationService"],
    [/runDataGovernanceService/g, "runContentEngineService"],
    [/runRiskManagementService/g, "runFounderDashboardService"],
    [/runDashboardService/g, "runFounderDashboardService"],
    [/sdkRunGovernanceService/g, "sdkRunBrandService"],
    [/sdkRunComplianceService/g, "sdkRunContentFoundationService"],
    [/sdkRunAuditService/g, "sdkRunMediaFoundationService"],
    [/sdkRunDataGovernanceService/g, "sdkRunContentEngineService"],
    [/sdkRunRiskManagementService/g, "sdkRunFounderDashboardService"],
    [/sdkRunDashboardService/g, "sdkRunFounderDashboardService"],
    [/EgpSdkRunGovernanceService/g, "AageSdkRunBrandService"],
    [/EgpSdkRunComplianceService/g, "AageSdkRunContentFoundationService"],
    [/EgpSdkRunAuditService/g, "AageSdkRunMediaFoundationService"],
    [/EgpSdkRunDataGovernanceService/g, "AageSdkRunContentEngineService"],
    [/EgpSdkRunRiskManagementService/g, "AageSdkRunFounderDashboardService"],
    [/EgpSdkRunDashboardService/g, "AageSdkRunFounderDashboardService"],
    [/enterprise_governance_platform/g, "arjun_automation_growth_engine"],
    [/rose/g, "pink"],
    [/ShieldCheck/g, "TrendingUp"],
    [/Enterprise Governance Platform/g, "Growth Engine"],
    [/Enterprise Governance/g, "Growth Engine"],
    [/Governance Hubs/g, "Growth Hubs"],
    [/governance hub/g, "growth hub"],
    [/Select governance hub/g, "Select growth hub"],
    [/"egp\./g, '"aage.'],
    [/GovernanceOverviewPanel/g, "GrowthOverviewPanel"],
    [/GovernanceAuditLogsPanel/g, "GrowthAuditLogsPanel"],
    [/GovernanceSdkPanel/g, "GrowthSdkPanel"],
    [/GovernanceData/g, "GrowthData"],
    [/createEnterpriseGovernancePlatformClient/g, "createGrowthEngineClient"],
    [/createEnterpriseGovernancePlatformClient/g, "createGrowthEngineClient"],
    [/getGovernanceHubs/g, "getGrowthHubs"],
    [/buildEgpDashboardStats/g, "buildAageDashboardStats"],
    [/buildEgpPipelineInfo/g, "buildAagePipelineInfo"],
    [/buildEgpAuditPayload/g, "buildAageAuditPayload"],
    [/createAiOrganizationFoundationClient/g, "createEnterpriseGovernancePlatformClient"],
];

for (const [from, to] of reps) s = s.replace(from, to);

const aageOptions = `export const PROFILE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
] as const;

export const MESSAGING_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const GUIDELINE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const TEMPLATE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const GENERATOR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const ASSISTANT_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const QUEUE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
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
    `$1${aageOptions}$2`,
);

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-growth-engine-ui.mjs");
