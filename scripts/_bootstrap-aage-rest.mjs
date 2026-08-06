#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const aageUiEntities = `const entities = [
    { tab: "growthHubs", plural: "growthHubs", singular: "GrowthHub", pascal: "GrowthHub", db: "aageGrowthHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "brandProfiles", plural: "brandProfiles", singular: "BrandProfile", pascal: "BrandProfile", db: "aageBrandProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileStatus", type: "select", options: "PROFILE_STATUS_OPTIONS" }], display: { title: "profileName", sub: "profileStatus" } },
    { tab: "brandVoice", plural: "brandVoice", singular: "BrandVoice", pascal: "BrandVoice", db: "aageBrandVoice", fields: [{ name: "voiceKey", type: "string" }, { name: "voiceName", type: "string" }, { name: "voiceTone", type: "string" }], display: { title: "voiceName", sub: "voiceTone" } },
    { tab: "coreMessaging", plural: "coreMessaging", singular: "CoreMessaging", pascal: "CoreMessaging", db: "aageCoreMessaging", fields: [{ name: "messagingKey", type: "string" }, { name: "messagingTitle", type: "string" }, { name: "messagingStatus", type: "select", options: "MESSAGING_STATUS_OPTIONS" }], display: { title: "messagingTitle", sub: "messagingStatus" } },
    { tab: "brandGuidelines", plural: "brandGuidelines", singular: "BrandGuideline", pascal: "BrandGuideline", db: "aageBrandGuidelines", fields: [{ name: "guidelineKey", type: "string" }, { name: "guidelineName", type: "string" }, { name: "guidelineStatus", type: "select", options: "GUIDELINE_STATUS_OPTIONS" }], display: { title: "guidelineName", sub: "guidelineStatus" } },
    { tab: "logoLibrary", plural: "logoLibrary", singular: "LogoLibrary", pascal: "LogoLibrary", db: "aageLogoLibrary", fields: [{ name: "logoKey", type: "string" }, { name: "logoName", type: "string" }, { name: "logoFormat", type: "string" }], display: { title: "logoName", sub: "logoFormat" } },
    { tab: "colorSystems", plural: "colorSystems", singular: "ColorSystem", pascal: "ColorSystem", db: "aageColorSystems", fields: [{ name: "colorKey", type: "string" }, { name: "colorName", type: "string" }, { name: "primaryHex", type: "string" }], display: { title: "colorName", sub: "primaryHex" } },
    { tab: "youtubeTemplates", plural: "youtubeTemplates", singular: "YoutubeTemplate", pascal: "YoutubeTemplate", db: "aageYoutubeTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" } },
    { tab: "socialTemplates", plural: "socialTemplates", singular: "SocialTemplate", pascal: "SocialTemplate", db: "aageSocialTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" } },
    { tab: "blogTemplates", plural: "blogTemplates", singular: "BlogTemplate", pascal: "BlogTemplate", db: "aageBlogTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" } },
    { tab: "websiteArticleTemplates", plural: "websiteArticleTemplates", singular: "WebsiteArticleTemplate", pascal: "WebsiteArticleTemplate", db: "aageWebsiteArticleTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" } },
    { tab: "emailCampaignTemplates", plural: "emailCampaignTemplates", singular: "EmailCampaignTemplate", pascal: "EmailCampaignTemplate", db: "aageEmailCampaignTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" } },
    { tab: "caseStudyTemplates", plural: "caseStudyTemplates", singular: "CaseStudyTemplate", pascal: "CaseStudyTemplate", db: "aageCaseStudyTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" } },
    { tab: "imageAssets", plural: "imageAssets", singular: "ImageAsset", pascal: "ImageAsset", db: "aageImageAssets", fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" } },
    { tab: "videoAssets", plural: "videoAssets", singular: "VideoAsset", pascal: "VideoAsset", db: "aageVideoAssets", fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" } },
    { tab: "iconAssets", plural: "iconAssets", singular: "IconAsset", pascal: "IconAsset", db: "aageIconAssets", fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" } },
    { tab: "voiceProfiles", plural: "voiceProfiles", singular: "VoiceProfile", pascal: "VoiceProfile", db: "aageVoiceProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "voiceType", type: "string" }], display: { title: "profileName", sub: "voiceType" } },
    { tab: "musicAssets", plural: "musicAssets", singular: "MusicAsset", pascal: "MusicAsset", db: "aageMusicAssets", fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "genre", type: "string" }], display: { title: "assetName", sub: "genre" } },
    { tab: "thumbnailTemplates", plural: "thumbnailTemplates", singular: "ThumbnailTemplate", pascal: "ThumbnailTemplate", db: "aageThumbnailTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" } },
    { tab: "ideaGenerators", plural: "ideaGenerators", singular: "IdeaGenerator", pascal: "IdeaGenerator", db: "aageIdeaGenerators", fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" } },
    { tab: "scriptGenerators", plural: "scriptGenerators", singular: "ScriptGenerator", pascal: "ScriptGenerator", db: "aageScriptGenerators", fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" } },
    { tab: "captionGenerators", plural: "captionGenerators", singular: "CaptionGenerator", pascal: "CaptionGenerator", db: "aageCaptionGenerators", fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" } },
    { tab: "blogGenerators", plural: "blogGenerators", singular: "BlogGenerator", pascal: "BlogGenerator", db: "aageBlogGenerators", fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" } },
    { tab: "seoAssistants", plural: "seoAssistants", singular: "SeoAssistant", pascal: "SeoAssistant", db: "aageSeoAssistants", fields: [{ name: "assistantKey", type: "string" }, { name: "assistantName", type: "string" }, { name: "assistantStatus", type: "select", options: "ASSISTANT_STATUS_OPTIONS" }], display: { title: "assistantName", sub: "assistantStatus" } },
    { tab: "ctaGenerators", plural: "ctaGenerators", singular: "CtaGenerator", pascal: "CtaGenerator", db: "aageCtaGenerators", fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" } },
    { tab: "growthMetrics", plural: "growthMetrics", singular: "GrowthMetric", pascal: "GrowthMetric", db: "aageGrowthMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallGrowthScore", type: "number" }, { name: "brandHealthScore", type: "number" }], display: { title: "metricsKey", sub: "overallGrowthScore" } },
    { tab: "growthHealth", plural: "growthHealth", singular: "GrowthHealth", pascal: "GrowthHealth", db: "aageGrowthHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "brandStatus", type: "string" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "contentCalendar", plural: "contentCalendar", singular: "ContentCalendar", pascal: "ContentCalendar", db: "aageContentCalendar", fields: [{ name: "calendarKey", type: "string" }, { name: "calendarName", type: "string" }, { name: "calendarStatus", type: "select", options: "CALENDAR_STATUS_OPTIONS" }], display: { title: "calendarName", sub: "calendarStatus" } },
    { tab: "draftQueue", plural: "draftQueue", singular: "DraftQueue", pascal: "DraftQueue", db: "aageDraftQueue", fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" } },
    { tab: "approvalQueue", plural: "approvalQueue", singular: "ApprovalQueue", pascal: "ApprovalQueue", db: "aageApprovalQueue", fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" } },
    { tab: "publishingQueue", plural: "publishingQueue", singular: "PublishingQueue", pascal: "PublishingQueue", db: "aagePublishingQueue", fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" } },
];`;

// UI patch script
const patchUi = `#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const inPath = join(root, "scripts/generate-enterprise-governance-platform-ui.mjs");
const outPath = join(root, "scripts/generate-growth-engine-ui.mjs");
let s = readFileSync(inPath, "utf8");

s = s.replace(/src\\/modules\\/enterprise-governance-platform/g, "src/modules/growth-engine");
s = s.replace(/const entities = \\[[\\s\\S]*?\\];/, ${JSON.stringify(aageUiEntities)});

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
    [/"egp\\./g, '"aage.'],
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

const aageOptions = \`export const PROFILE_STATUS_OPTIONS = [
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

\`;

s = s.replace(
    /(writeFileSync\\(join\\(mod, "constants\\/index\\.ts"\\), \`export const AAGE_TABS = \\{[\\s\\S]*?\\} as const;\\r?\\n\\r?\\n)[\\s\\S]*?(\\r?\\nexport const AAGE_THEME)/,
    \`$1\${aageOptions}$2\`,
);

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-growth-engine-ui.mjs");
`;

writeFileSync(join(root, "scripts/patch-growth-engine-ui.mjs"), patchUi);

// Wire script
const wireScript = `#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("AageGrowthHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/enterprise-governance-platform-repositories";';
    const egpImportEnd = da.indexOf(anchor) + anchor.length;
    const aageImport = \`
import {
    AageGrowthHubRepository,
    AageBrandProfileRepository,
    AageBrandVoiceRepository,
    AageCoreMessagingRepository,
    AageBrandGuidelineRepository,
    AageLogoLibraryRepository,
    AageColorSystemRepository,
    AageYoutubeTemplateRepository,
    AageSocialTemplateRepository,
    AageBlogTemplateRepository,
    AageWebsiteArticleTemplateRepository,
    AageEmailCampaignTemplateRepository,
    AageCaseStudyTemplateRepository,
    AageImageAssetRepository,
    AageVideoAssetRepository,
    AageIconAssetRepository,
    AageVoiceProfileRepository,
    AageMusicAssetRepository,
    AageThumbnailTemplateRepository,
    AageIdeaGeneratorRepository,
    AageScriptGeneratorRepository,
    AageCaptionGeneratorRepository,
    AageBlogGeneratorRepository,
    AageSeoAssistantRepository,
    AageCtaGeneratorRepository,
    AageGrowthMetricRepository,
    AageGrowthHealthRepository,
    AageContentCalendarRepository,
    AageDraftQueueRepository,
    AageApprovalQueueRepository,
    AagePublishingQueueRepository,
    AageAuditLogRepository,
} from "@/src/modules/database/repositories/growth-engine-repositories";
\`;
    da = da.slice(0, egpImportEnd) + aageImport + da.slice(egpImportEnd);

    const egpProp = "    readonly egpAuditLogs: EgpAuditLogRepository;";
    const aageProps = \`    readonly aageGrowthHubs: AageGrowthHubRepository;
    readonly aageBrandProfiles: AageBrandProfileRepository;
    readonly aageBrandVoice: AageBrandVoiceRepository;
    readonly aageCoreMessaging: AageCoreMessagingRepository;
    readonly aageBrandGuidelines: AageBrandGuidelineRepository;
    readonly aageLogoLibrary: AageLogoLibraryRepository;
    readonly aageColorSystems: AageColorSystemRepository;
    readonly aageYoutubeTemplates: AageYoutubeTemplateRepository;
    readonly aageSocialTemplates: AageSocialTemplateRepository;
    readonly aageBlogTemplates: AageBlogTemplateRepository;
    readonly aageWebsiteArticleTemplates: AageWebsiteArticleTemplateRepository;
    readonly aageEmailCampaignTemplates: AageEmailCampaignTemplateRepository;
    readonly aageCaseStudyTemplates: AageCaseStudyTemplateRepository;
    readonly aageImageAssets: AageImageAssetRepository;
    readonly aageVideoAssets: AageVideoAssetRepository;
    readonly aageIconAssets: AageIconAssetRepository;
    readonly aageVoiceProfiles: AageVoiceProfileRepository;
    readonly aageMusicAssets: AageMusicAssetRepository;
    readonly aageThumbnailTemplates: AageThumbnailTemplateRepository;
    readonly aageIdeaGenerators: AageIdeaGeneratorRepository;
    readonly aageScriptGenerators: AageScriptGeneratorRepository;
    readonly aageCaptionGenerators: AageCaptionGeneratorRepository;
    readonly aageBlogGenerators: AageBlogGeneratorRepository;
    readonly aageSeoAssistants: AageSeoAssistantRepository;
    readonly aageCtaGenerators: AageCtaGeneratorRepository;
    readonly aageGrowthMetrics: AageGrowthMetricRepository;
    readonly aageGrowthHealth: AageGrowthHealthRepository;
    readonly aageContentCalendar: AageContentCalendarRepository;
    readonly aageDraftQueue: AageDraftQueueRepository;
    readonly aageApprovalQueue: AageApprovalQueueRepository;
    readonly aagePublishingQueue: AagePublishingQueueRepository;
    readonly aageAuditLogs: AageAuditLogRepository;\`;
    da = da.replace(egpProp, egpProp + "\\n" + aageProps);

    const egpCtor = "        this.egpAuditLogs = new EgpAuditLogRepository();";
    const aageCtor = \`        this.aageGrowthHubs = new AageGrowthHubRepository();
        this.aageBrandProfiles = new AageBrandProfileRepository();
        this.aageBrandVoice = new AageBrandVoiceRepository();
        this.aageCoreMessaging = new AageCoreMessagingRepository();
        this.aageBrandGuidelines = new AageBrandGuidelineRepository();
        this.aageLogoLibrary = new AageLogoLibraryRepository();
        this.aageColorSystems = new AageColorSystemRepository();
        this.aageYoutubeTemplates = new AageYoutubeTemplateRepository();
        this.aageSocialTemplates = new AageSocialTemplateRepository();
        this.aageBlogTemplates = new AageBlogTemplateRepository();
        this.aageWebsiteArticleTemplates = new AageWebsiteArticleTemplateRepository();
        this.aageEmailCampaignTemplates = new AageEmailCampaignTemplateRepository();
        this.aageCaseStudyTemplates = new AageCaseStudyTemplateRepository();
        this.aageImageAssets = new AageImageAssetRepository();
        this.aageVideoAssets = new AageVideoAssetRepository();
        this.aageIconAssets = new AageIconAssetRepository();
        this.aageVoiceProfiles = new AageVoiceProfileRepository();
        this.aageMusicAssets = new AageMusicAssetRepository();
        this.aageThumbnailTemplates = new AageThumbnailTemplateRepository();
        this.aageIdeaGenerators = new AageIdeaGeneratorRepository();
        this.aageScriptGenerators = new AageScriptGeneratorRepository();
        this.aageCaptionGenerators = new AageCaptionGeneratorRepository();
        this.aageBlogGenerators = new AageBlogGeneratorRepository();
        this.aageSeoAssistants = new AageSeoAssistantRepository();
        this.aageCtaGenerators = new AageCtaGeneratorRepository();
        this.aageGrowthMetrics = new AageGrowthMetricRepository();
        this.aageGrowthHealth = new AageGrowthHealthRepository();
        this.aageContentCalendar = new AageContentCalendarRepository();
        this.aageDraftQueue = new AageDraftQueueRepository();
        this.aageApprovalQueue = new AageApprovalQueueRepository();
        this.aagePublishingQueue = new AagePublishingQueueRepository();
        this.aageAuditLogs = new AageAuditLogRepository();\`;
    da = da.replace(egpCtor, egpCtor + "\\n" + aageCtor);
    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("aageGrowthHubs")) {
    ds = ds.replace(
        "    egpAuditLogs: databaseAccess.egpAuditLogs,",
        \`    egpAuditLogs: databaseAccess.egpAuditLogs,
    aageGrowthHubs: databaseAccess.aageGrowthHubs,
    aageBrandProfiles: databaseAccess.aageBrandProfiles,
    aageBrandVoice: databaseAccess.aageBrandVoice,
    aageCoreMessaging: databaseAccess.aageCoreMessaging,
    aageBrandGuidelines: databaseAccess.aageBrandGuidelines,
    aageLogoLibrary: databaseAccess.aageLogoLibrary,
    aageColorSystems: databaseAccess.aageColorSystems,
    aageYoutubeTemplates: databaseAccess.aageYoutubeTemplates,
    aageSocialTemplates: databaseAccess.aageSocialTemplates,
    aageBlogTemplates: databaseAccess.aageBlogTemplates,
    aageWebsiteArticleTemplates: databaseAccess.aageWebsiteArticleTemplates,
    aageEmailCampaignTemplates: databaseAccess.aageEmailCampaignTemplates,
    aageCaseStudyTemplates: databaseAccess.aageCaseStudyTemplates,
    aageImageAssets: databaseAccess.aageImageAssets,
    aageVideoAssets: databaseAccess.aageVideoAssets,
    aageIconAssets: databaseAccess.aageIconAssets,
    aageVoiceProfiles: databaseAccess.aageVoiceProfiles,
    aageMusicAssets: databaseAccess.aageMusicAssets,
    aageThumbnailTemplates: databaseAccess.aageThumbnailTemplates,
    aageIdeaGenerators: databaseAccess.aageIdeaGenerators,
    aageScriptGenerators: databaseAccess.aageScriptGenerators,
    aageCaptionGenerators: databaseAccess.aageCaptionGenerators,
    aageBlogGenerators: databaseAccess.aageBlogGenerators,
    aageSeoAssistants: databaseAccess.aageSeoAssistants,
    aageCtaGenerators: databaseAccess.aageCtaGenerators,
    aageGrowthMetrics: databaseAccess.aageGrowthMetrics,
    aageGrowthHealth: databaseAccess.aageGrowthHealth,
    aageContentCalendar: databaseAccess.aageContentCalendar,
    aageDraftQueue: databaseAccess.aageDraftQueue,
    aageApprovalQueue: databaseAccess.aageApprovalQueue,
    aagePublishingQueue: databaseAccess.aagePublishingQueue,
    aageAuditLogs: databaseAccess.aageAuditLogs,\`
    );
    writeFileSync(dsPath, ds, "utf8");
}
console.log("Wired data-access and database-service for AAGE");
`;

writeFileSync(join(root, "scripts/wire-growth-engine.mjs"), wireScript);

// Verify script
let verify = readFileSync(join(root, "scripts/verify-enterprise-governance.mjs"), "utf8");
const verifyReps = [
    [/Enterprise Governance Platform verification/g, "Arjun Automation Growth Engine verification"],
    [/verify-enterprise-governance/g, "verify-growth-engine"],
    [/202608020048_enterprise_governance_platform/g, "202608020049_arjun_automation_growth_engine"],
    [/048_enterprise_governance_platform_seed/g, "049_arjun_automation_growth_engine_seed"],
    [/enterprise-governance-platform-mappers/g, "growth-engine-mappers"],
    [/enterprise-governance-platform\/sdk/g, "growth-engine/sdk"],
    [/enterprise-governance-platform/g, "growth-engine"],
    [/EnterpriseGovernancePlatform/g, "GrowthEngine"],
    [/enterpriseGovernancePlatform/g, "growthEngine"],
    [/enterprise_governance_platform/g, "arjun_automation_growth_engine"],
    [/EGP_/g, "AAGE_"],
    [/Egp/g, "Aage"],
    [/"egp\./g, '"aage.'],
    [/egp_/g, "aage_"],
    [/GovernanceHub/g, "GrowthHub"],
    [/governanceHub/g, "growthHub"],
    [/GovernanceMetric/g, "GrowthMetric"],
    [/GovernanceHealth/g, "GrowthHealth"],
    [/rose-600/g, "pink-600"],
    [/ShieldCheck/g, "TrendingUp"],
    [/Enterprise Governance/g, "Growth Engine"],
    [/GovernanceService/g, "BrandService"],
    [/ComplianceService/g, "ContentFoundationService"],
    [/AuditService/g, "MediaFoundationService"],
    [/DataGovernanceService/g, "ContentEngineService"],
    [/RiskManagementService/g, "FounderDashboardService"],
    [/DashboardService/g, "FounderDashboardService"],
    [/createEnterpriseGovernancePlatformClient/g, "createGrowthEngineClient"],
    [/enterprise-governance:verify/g, "growth-engine:verify"],
    [/founder_os_phase6/g, "founder_os_phase7"],
    [/FoPhase6Stats/g, "FoPhase7Stats"],
    [/FounderOsPhase6Panel/g, "FounderOsPhase7Panel"],
    [/phase6 tab/g, "phase7 tab"],
    [/phase6Stats/g, "phase7Stats"],
    [/getPhase6Stats/g, "getPhase7Stats"],
    [/northstar-enterprise-governance/g, "northstar-growth-engine"],
    [/gov-org-0908/g, "brand-profile-0909"],
    [/schema:egp_table_count/g, "schema:aage_table_count"],
    [/buildEgpDashboardStats/g, "buildAageDashboardStats"],
    [/buildGovernanceHubLookupMaps/g, "buildGrowthHubLookupMaps"],
    [/buildEgpPipelineInfo/g, "buildAagePipelineInfo"],
    [/EGP_TABS count/g, "AAGE_TABS count"],
    [/enterpriseGovernancePlatform/g, "growthEngine"],
    [/enterprise-governance-platform/g, "growth-engine"],
];

for (const [from, to] of verifyReps) verify = verify.replace(from, to);

verify = verify.replace(
    /pass\("governance:organization_governance_table"[\s\S]*?pass\("risk_management:business_continuity_table"[^;]*;\n/,
    `pass("brand_foundation:brand_profiles_table", tables.includes("aage_brand_profiles"));
pass("brand_foundation:brand_voice_table", tables.includes("aage_brand_voice"));
pass("brand_foundation:core_messaging_table", tables.includes("aage_core_messaging"));
pass("brand_foundation:brand_guidelines_table", tables.includes("aage_brand_guidelines"));
pass("brand_foundation:logo_library_table", tables.includes("aage_logo_library"));
pass("brand_foundation:color_systems_table", tables.includes("aage_color_systems"));
pass("content_foundation:youtube_templates_table", tables.includes("aage_youtube_templates"));
pass("content_foundation:social_templates_table", tables.includes("aage_social_templates"));
pass("content_foundation:blog_templates_table", tables.includes("aage_blog_templates"));
pass("content_foundation:website_article_templates_table", tables.includes("aage_website_article_templates"));
pass("content_foundation:email_campaign_templates_table", tables.includes("aage_email_campaign_templates"));
pass("content_foundation:case_study_templates_table", tables.includes("aage_case_study_templates"));
pass("media_foundation:image_assets_table", tables.includes("aage_image_assets"));
pass("media_foundation:video_assets_table", tables.includes("aage_video_assets"));
pass("media_foundation:icon_assets_table", tables.includes("aage_icon_assets"));
pass("media_foundation:voice_profiles_table", tables.includes("aage_voice_profiles"));
pass("media_foundation:music_assets_table", tables.includes("aage_music_assets"));
pass("media_foundation:thumbnail_templates_table", tables.includes("aage_thumbnail_templates"));
pass("content_engine:idea_generators_table", tables.includes("aage_idea_generators"));
pass("content_engine:script_generators_table", tables.includes("aage_script_generators"));
pass("content_engine:caption_generators_table", tables.includes("aage_caption_generators"));
pass("content_engine:blog_generators_table", tables.includes("aage_blog_generators"));
pass("content_engine:seo_assistants_table", tables.includes("aage_seo_assistants"));
pass("content_engine:cta_generators_table", tables.includes("aage_cta_generators"));
pass("founder_dashboard:growth_metrics_table", tables.includes("aage_growth_metrics"));
pass("founder_dashboard:growth_health_table", tables.includes("aage_growth_health"));
pass("founder_dashboard:content_calendar_table", tables.includes("aage_content_calendar"));
pass("founder_dashboard:draft_queue_table", tables.includes("aage_draft_queue"));
pass("founder_dashboard:approval_queue_table", tables.includes("aage_approval_queue"));
pass("founder_dashboard:publishing_queue_table", tables.includes("aage_publishing_queue"));
`,
);

verify = verify.replace(/pass\("governance_metrics:[^"]+"[^;]*;\n/g, "");
verify = verify.replace(/pass\("governance_health:[^"]+"[^;]*;\n/g, "");
verify = verify.replace(/pass\("dashboard:[^"]+"[^;]*;\n/g, "");
verify = verify.replace(/pass\("seed:governance_health_recovery"[^;]*;\n/, 'pass("seed:growth_health_brand_status", seedSql.includes("aage_growth_health") && seedSql.includes("brand_status"));\n');
verify = verify.replace(/pass\("seed:organization_governance"[^;]*;\n/, 'pass("seed:brand_profiles", seedSql.includes("aage_brand_profiles") && seedSql.includes("brand-profile-0909"));\n');
verify = verify.replace(/pass\("seed:compliance_controls"[^;]*;\n/, 'pass("seed:youtube_templates", seedSql.includes("aage_youtube_templates") && seedSql.includes("yt-template-0909"));\n');
verify = verify.replace(/pass\("seed:audit_findings"[^;]*;\n/, 'pass("seed:image_assets", seedSql.includes("aage_image_assets") && seedSql.includes("image-0909"));\n');
verify = verify.replace(/pass\("seed:risk_register"[^;]*;\n/, 'pass("seed:idea_generators", seedSql.includes("aage_idea_generators") && seedSql.includes("idea-gen-0909"));\n');
verify = verify.replace(/pass\("seed:mission_progress"[^;]*;\n/, 'pass("seed:content_calendar", seedSql.includes("aage_content_calendar") && seedSql.includes("calendar-0909"));\n');
verify = verify.replace(/pass\("seed:governance_metrics"[^;]*;\n/, 'pass("seed:growth_metrics", seedSql.includes("aage_growth_metrics") && seedSql.includes("overall_growth_score"));\n');
verify = verify.replace(/pass\("seed:governance_hub"[^;]*;\n/, 'pass("seed:growth_hub", seedSql.includes("aage_growth_hubs") && seedSql.includes("northstar-growth-engine"));\n');

verify = verify.replace(
    /pass\("sdk:GovernanceService"/,
    `pass("sdk:BrandService", sdkSource.includes("export class BrandService"));
pass("sdk:ContentFoundationService", sdkSource.includes("export class ContentFoundationService"));
pass("sdk:MediaFoundationService", sdkSource.includes("export class MediaFoundationService"));
pass("sdk:ContentEngineService", sdkSource.includes("export class ContentEngineService"));
pass("sdk:FounderDashboardService", sdkSource.includes("export class FounderDashboardService"));
pass("sdk:createGrowthEngineClient"`,
);

verify = verify.replace(
    /pass\("framework:createAiOrganizationFoundationClient"/,
    `pass("framework:createEnterpriseGovernancePlatformClient", serviceSource.includes("createEnterpriseGovernancePlatformClient"));
pass("framework:createAiOrganizationFoundationClient"`,
);

verify = verify.replace(/All Enterprise Governance Platform verification checks passed\./, "All Arjun Automation Growth Engine verification checks passed.");
verify = verify.replace(/Enterprise Governance Platform verification:/, "Arjun Automation Growth Engine verification:");
verify = verify.replace(/EGP_TABS count:/, "AAGE_TABS count:");

writeFileSync(join(root, "scripts/verify-growth-engine.mjs"), verify);

console.log("Created patch-growth-engine-ui.mjs, wire-growth-engine.mjs, verify-growth-engine.mjs");
