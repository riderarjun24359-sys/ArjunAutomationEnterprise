#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("AageGrowthHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/enterprise-governance-platform-repositories";';
    const egpImportEnd = da.indexOf(anchor) + anchor.length;
    const aageImport = `
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
`;
    da = da.slice(0, egpImportEnd) + aageImport + da.slice(egpImportEnd);

    const egpProp = "    readonly egpAuditLogs: EgpAuditLogRepository;";
    const aageProps = `    readonly aageGrowthHubs: AageGrowthHubRepository;
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
    readonly aageAuditLogs: AageAuditLogRepository;`;
    da = da.replace(egpProp, egpProp + "\n" + aageProps);

    const egpCtor = "        this.egpAuditLogs = new EgpAuditLogRepository();";
    const aageCtor = `        this.aageGrowthHubs = new AageGrowthHubRepository();
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
        this.aageAuditLogs = new AageAuditLogRepository();`;
    da = da.replace(egpCtor, egpCtor + "\n" + aageCtor);
    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("aageGrowthHubs")) {
    ds = ds.replace(
        "    egpAuditLogs: databaseAccess.egpAuditLogs,",
        `    egpAuditLogs: databaseAccess.egpAuditLogs,
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
    aageAuditLogs: databaseAccess.aageAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}
console.log("Wired data-access and database-service for AAGE");
