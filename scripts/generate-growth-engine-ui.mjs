#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/growth-engine");

const entities = [
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
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const AAGE_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const PROFILE_STATUS_OPTIONS = [
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


export const AAGE_THEME = {
    primary: "pink-600",
    primaryHover: "pink-500",
    ring: "pink-500/20",
    text: "text-pink-600",
    textDark: "dark:text-pink-400",
    bg: "bg-pink-600",
    bgHover: "hover:bg-pink-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    growthHubId: z.string().min(1),`;
    const fieldLines = e.fields.map((f) => {
        if (f.type === "number") return `    ${f.name}: z.number().optional(),`;
        if (f.type === "boolean") return `    ${f.name}: z.boolean().optional(),`;
        return `    ${f.name}: z.string().min(1).optional(),`;
    }).join("\n");
    const schemaName = e.tab.replace(/([A-Z])/g, (m) => m.toLowerCase());
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `export const ${camel}FormSchema = z.object({${hubId}
${fieldLines}
});

export type ${camel}FormValues = z.infer<typeof ${camel}FormSchema>;`;
});
writeFileSync(join(mod, "schemas/index.ts"), `import { z } from "zod";\n\n${schemaLines.join("\n\n")}\n`);

// --- service ---
const mapperImports = [
    "buildGrowthHubLookupMaps", "buildAageAuditPayload", "buildAageDashboardStats", "buildAagePipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapBrandProfileForStats", "mapYoutubeTemplateForStats", "mapGrowthMetricForStats", "mapImageAssetForStats", "mapIdeaGeneratorForStats", "mapYoutubeTemplateForStats", "mapGrowthHealthForStats", "mapPublishingQueueForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AageDashboardStats", "AagePipelineInfo", "AageSdkTrackCustomerHealthInput", "AageSdkTrackCustomerHealthResult", "AageSdkOpenSupportTicketInput", "AageSdkOpenSupportTicketResult", "AageSdkRunDeliveryWorkflowInput", "AageSdkRunDeliveryWorkflowResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const maps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
    return `
    async get${e.pascal}s(authUserId: string, email: string, fullName?: string | null): Promise<${e.pascal}Summary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];${maps}
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});
    }

    async create${e.pascal}(authUserId: string, email: string, input: Create${e.pascal}Input, fullName?: string | null): Promise<${e.pascal}Summary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.pascal}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.aageAuditLogs.create(buildAageAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/growth-engine.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/growth-engine-mappers";
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
import { createEnterpriseGovernancePlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    ${typeImports},
} from "@/src/modules/growth-engine/types";

export class GrowthEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const growthHubs = await databaseService.aageGrowthHubs.listByOrganization(organizationId);
        return buildGrowthHubLookupMaps(growthHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AageDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildAageDashboardStats({ growthHubs: [], brandProfiles: [], youtubeTemplates: [], caseStudyTemplates: [], captionGenerators: [], growthMetrics: [], growthHealth: [], publishingQueues: [], auditLogs: [] });
        const [growthHubs, brandProfilesRaw, youtubeTemplatesRaw, caseStudyTemplatesRaw, captionGeneratorsRaw, growthMetricsRaw, growthHealthRaw, publishingQueues, auditLogs] = await Promise.all([
            this.getGrowthHubs(authUserId, email, fullName),
            databaseService.aageKpiRegistry.listByOrganization(context.organizationId),
            databaseService.aageExecutiveDashboards.listByOrganization(context.organizationId),
            databaseService.aageRevenueForecasts.listByOrganization(context.organizationId),
            databaseService.aageCrossModuleInsights.listByOrganization(context.organizationId),
            databaseService.aageGrowthMetrics.listByOrganization(context.organizationId),
            databaseService.aageGrowthHealth.listByOrganization(context.organizationId),
            this.getPublishingQueues(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildAageDashboardStats({
            growthHubs,
            brandProfiles: brandProfilesRaw.map(mapBrandProfileForStats),
            youtubeTemplates: youtubeTemplatesRaw.map(mapYoutubeTemplateForStats),
            caseStudyTemplates: caseStudyTemplatesRaw.map(mapImageAssetForStats),
            captionGenerators: captionGeneratorsRaw.map(mapIdeaGeneratorForStats),
            growthMetrics: growthMetricsRaw.map(mapGrowthMetricForStats),
            growthHealth: growthHealthRaw.map(mapGrowthHealthForStats),
            publishingQueues,
            auditLogs,
        });
    }

    getPipelineInfo(): AagePipelineInfo {
        return buildAagePipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aageAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getGrowthHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aageGrowthHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunBrandService(authUserId: string, email: string, input: AageSdkRunBrandServiceInput, fullName?: string | null): Promise<AageSdkRunBrandServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createBrandProfile(authUserId, email, { growthHubId: input.growthHubId, kpiKey: input.kpiKey, kpiName: input.kpiName }, fullName);
        return { kpiId: created.id, kpiKey: created.kpiKey, status: created.status };
    }

    async sdkRunContentFoundationService(authUserId: string, email: string, input: AageSdkRunContentFoundationServiceInput, fullName?: string | null): Promise<AageSdkRunContentFoundationServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createYoutubeTemplate(authUserId, email, { growthHubId: input.growthHubId, dashboardKey: input.dashboardKey, dashboardName: input.dashboardName }, fullName);
        return { dashboardId: created.id, dashboardKey: created.dashboardKey, status: created.status };
    }

    async sdkRunMediaFoundationService(authUserId: string, email: string, input: AageSdkRunMediaFoundationServiceInput, fullName?: string | null): Promise<AageSdkRunMediaFoundationServiceResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
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
        const cop = createEnterpriseGovernancePlatformClient(authUserId, email, fullName);
        await cop.getIntelligenceHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createImageAsset(authUserId, email, { growthHubId: input.growthHubId, insightKey: input.insightKey, insightTitle: input.insightTitle }, fullName);
        return { insightId: created.id, insightKey: created.insightKey, status: created.status };
    }
}

export const growthEngineService = new GrowthEngineService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AageDashboardStats", "AagePipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            growthEngineService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await growthEngineService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useGrowthEngine.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { growthEngineService } from "@/src/modules/growth-engine/services/growth-engine.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/growth-engine/types";

export function useGrowthEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AageDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AagePipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [growthHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            growthEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(growthEngineService.getPipelineInfo()),
${hookFetchCalls}
            growthEngineService.getAuditLogs(authUserId, email, fullName),
            growthEngineService.getGrowthHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
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

${hookCreates}

    return {
        loading,
        stats,
        pipeline,
${hookReturnFields}
        auditLogs,
        growthHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const panelImports = entities.map((e) => `${e.pascal}sPanel`).join(",\n    ");
const schemaImports = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `    ${camel}FormSchema,\n    type ${camel}FormValues,`;
}).join("\n");

const panelFns = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    const panelName = `${e.pascal}sPanel`;
    const defaults = e.fields.reduce((acc, f) => {
        acc[f.name] = f.type === "number" ? 0 : f.type === "boolean" ? false : "";
        return acc;
    }, e.hubField === false ? {} : { growthHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <GrowthHubSelect data={data} {...form.register("growthHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: GrowthData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise retail operating system ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.hubName ? item.hubName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${label(e.tab).toLowerCase()}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.create${e.pascal}(v))}>
${hubSelect}${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
}).join("\n\n");

writeFileSync(join(mod, "components/GrowthEnginePanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AAGE_THEME, CONTROL_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/growth-engine/constants";
import type { useGrowthEngine } from "@/src/modules/growth-engine/hooks/useGrowthEngine";
import {
${schemaImports}
} from "@/src/modules/growth-engine/schemas";

type GrowthData = ReturnType<typeof useGrowthEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-pink-500/20 focus:ring-4 dark:border-slate-800 dark:bg-pink-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-pink-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-pink-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-pink-600">{meta}</p> : null}</div>;
}
function GrowthHubSelect({ data, ...props }: { data: GrowthData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.growthHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function GrowthOverviewPanel({ data }: { data: GrowthData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Growth Engine summary" description="System health, background jobs, event bus, captionGenerators, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Growth Hubs" subtitle={\`\${data.stats?.totalGrowthHubs ?? 0} total\`} meta={\`\${data.stats?.activeGrowthHubs ?? 0} active • \${data.stats?.brandProfilesCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.youtubeTemplatesCount ?? 0} menu categories\`} meta={\`\${data.stats?.auditFindingCount ?? 0} caseStudyTemplates • \${data.stats?.captionGeneratorsCount ?? 0} open captionGenerators\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallGrowthScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first retail operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function GrowthAuditLogsPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Growth Engine audit history" description="Security-first audit trail for jobs, events, captionGenerators, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function GrowthSdkPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Shared Growth Engine SDK" description="Import from @/src/modules/growth-engine/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-pink-600 dark:text-pink-300">
            <ListCard title="createGrowthEngineClient()" subtitle="Factory for module-scoped Growth Engine client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunBrandService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: arjun_automation_growth_engine" />
            <ListCard title="sdkRunContentFoundationService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunMediaFoundationService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-pink-500">Theme: {AAGE_THEME.primary} • Integration hubs loaded: {data.growthHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-pink-950 p-4 text-xs text-pink-100">{\`import { createGrowthEngineClient } from "@/src/modules/growth-engine/sdk";

const intg = createGrowthEngineClient(userId, email, fullName);
await intg.registerCampus({ growthHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runContentFoundationService({ growthHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runMediaFoundationService({ growthHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/GrowthEngineStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { AageDashboardStats } from "@/src/modules/growth-engine/types";

interface GrowthEngineStatsProps { stats: AageDashboardStats | null; }

export function GrowthEngineStats({ stats }: GrowthEngineStatsProps) {
    const cards = [
        { title: "Growth Hubs", value: String(stats?.totalGrowthHubs ?? 0), detail: \`\${stats?.activeGrowthHubs ?? 0} active • \${stats?.brandProfilesCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.youtubeTemplatesCount ?? 0), detail: \`\${stats?.auditFindingCount ?? 0} caseStudyTemplates • \${stats?.captionGeneratorsCount ?? 0} open captionGenerators\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallGrowthScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, captionGenerators, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-pink-600 dark:[&_p:last-child]:text-pink-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "GrowthOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "GrowthAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "GrowthSdkPanel" },
];

writeFileSync(join(mod, "components/GrowthEnginePage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    GrowthOverviewPanel,
    ${panelImports},
    GrowthAuditLogsPanel,
    GrowthSdkPanel,
} from "@/src/modules/growth-engine/components/GrowthEnginePanels";
import { GrowthEngineStats } from "@/src/modules/growth-engine/components/GrowthEngineStats";
import { AAGE_TABS } from "@/src/modules/growth-engine/constants";
import { useGrowthEngine } from "@/src/modules/growth-engine/hooks/useGrowthEngine";

const tabs = [
${tabDefs.map((t) => `    { id: AAGE_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function GrowthEnginePage() {
    const retail = useGrowthEngine();
    const [activeTab, setActiveTab] = useState<(typeof AAGE_TABS)[keyof typeof AAGE_TABS]>(AAGE_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Growth Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-pink-900 dark:text-pink-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-pink-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-pink-600">V2 Program A Growth Engine</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Growth Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-pink-500 dark:text-pink-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Growth Engine SDK.
                </p>
            </motion.header>
            <GrowthEngineStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-pink-600 text-white" : "border border-slate-200 text-pink-600 hover:border-pink-300 dark:border-slate-800 dark:text-pink-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === AAGE_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { growthEngineService } from "@/src/modules/growth-engine/services/growth-engine.service";
import type { AageSdkRunBrandServiceInput, AageSdkRunContentFoundationServiceInput, AageSdkRunMediaFoundationServiceInput, AageSdkRunDataBrandServiceInput, AageSdkRunDataBrandServiceInput } from "@/src/modules/growth-engine/types";

export class BrandService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunBrandServiceInput) { return this.client.runBrandService(input); }
}

export class ContentFoundationService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunContentFoundationServiceInput) { return this.client.runContentFoundationService(input); }
}

export class MediaFoundationService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunMediaFoundationServiceInput) { return this.client.runMediaFoundationService(input); }
}

export class DataBrandService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunDataBrandServiceInput) { return this.client.runDataBrandService(input); }
}

export class DataBrandService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunDataBrandServiceInput) { return this.client.runDataBrandService(input); }
}

export class GrowthEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly kpiService = new BrandService(this);
    readonly intelligenceService = new ContentFoundationService(this);
    readonly forecastService = new MediaFoundationService(this);
    readonly reportingService = new DataBrandService(this);
    readonly executiveInsightService = new DataBrandService(this);

    async runBrandService(input: AageSdkRunBrandServiceInput) {
        return growthEngineService.sdkRunBrandService(this.authUserId, this.email, input, this.fullName);
    }

    async runContentFoundationService(input: AageSdkRunContentFoundationServiceInput) {
        return growthEngineService.sdkRunContentFoundationService(this.authUserId, this.email, input, this.fullName);
    }

    async runMediaFoundationService(input: AageSdkRunMediaFoundationServiceInput) {
        return growthEngineService.sdkRunMediaFoundationService(this.authUserId, this.email, input, this.fullName);
    }

    async runDataBrandService(input: AageSdkRunDataBrandServiceInput) {
        return growthEngineService.sdkRunDataBrandService(this.authUserId, this.email, input, this.fullName);
    }

    async runDataBrandService(input: AageSdkRunDataBrandServiceInput) {
        return growthEngineService.sdkRunDataBrandService(this.authUserId, this.email, input, this.fullName);
    }

    async getGrowthHubs() {
        return growthEngineService.getGrowthHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return growthEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return growthEngineService.getPipelineInfo();
    }
}

export function createGrowthEngineClient(authUserId: string, email: string, fullName?: string | null): GrowthEngineClient {
    return new GrowthEngineClient(authUserId, email, fullName);
}

export { growthEngineService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { GrowthEnginePage } from "@/src/modules/growth-engine/components/GrowthEnginePage";
export { GrowthEngineStats } from "@/src/modules/growth-engine/components/GrowthEngineStats";
export { growthEngineService } from "@/src/modules/growth-engine/services/growth-engine.service";
export { useGrowthEngine } from "@/src/modules/growth-engine/hooks/useGrowthEngine";
export { createGrowthEngineClient, GrowthEngineClient } from "@/src/modules/growth-engine/sdk";
export * from "@/src/modules/growth-engine/types";
export * from "@/src/modules/growth-engine/constants";
`);

console.log(`Generated retail operating system module files. AAGE_TABS count: ${tabs.length}`);
