#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/growth-engine");

const entities = [
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

export const KNOWLEDGE_STATUS_OPTIONS = [
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
    const hubId = e.hubField === false ? "" : `\n    operationsHubId: z.string().min(1),`;
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
    "buildOperationsHubLookupMaps", "buildAagoAuditPayload", "buildAagoDashboardStats", "buildAagoPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapBrandKnowledgeBaseForStats", "mapVideoProjectForStats", "mapDistributionContentQueueForStats", "mapCampaignDashboardForStats", "mapMissionStatusForStats", "mapCommandCenterMetricForStats", "mapCommandCenterHealthForStats", "mapOperationalFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AagoDashboardStats", "AagoPipelineInfo", "AagoSdkRunBrandOsServiceInput", "AagoSdkRunBrandOsServiceResult", "AagoSdkRunCreativeStudioServiceInput", "AagoSdkRunCreativeStudioServiceResult", "AagoSdkRunDistributionServiceInput", "AagoSdkRunDistributionServiceResult", "AagoSdkRunGrowthIntelligenceServiceInput", "AagoSdkRunGrowthIntelligenceServiceResult", "AagoSdkRunCommandCenterServiceInput", "AagoSdkRunCommandCenterServiceResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const isHubEntity = e.hubField === false && e.pascal.endsWith("Hub");
    const maps = e.orgOnly || isHubEntity ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly || isHubEntity ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly || isHubEntity ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly || isHubEntity ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
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
        await databaseService.aagoAuditLogs.create(buildAagoAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/growth-engine.service.ts"), `import {
    ${mapperImports},
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
    ${typeImports},
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
${serviceMethods}

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
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AagoDashboardStats", "AagoPipelineInfo"]).join(",\n    ");
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
    const [stats, setStats] = useState<AagoDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AagoPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [operationsHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

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
            growthEngineService.getOperationsHubOptions(authUserId, email, fullName),
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
        operationsHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const optionImports = [...new Set(entities.flatMap((e) => e.fields.filter((f) => f.type === "select").map((f) => f.options)))].join(", ");
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
    }, e.hubField === false ? {} : { operationsHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />\n`;
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
import { AAGE_THEME, ${optionImports} } from "@/src/modules/growth-engine/constants";
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
function OperationsHubSelect({ data, ...props }: { data: GrowthData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.operationsHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function GrowthOverviewPanel({ data }: { data: GrowthData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Operational Growth Engine summary" description="Brand OS, Creative Studio, Distribution Hub, Growth Intelligence, and Founder Command Center" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Operations Hubs" subtitle={\`\${data.stats?.totalOperationsHubs ?? 0} total\`} meta={\`\${data.stats?.activeOperationsHubs ?? 0} active • \${data.stats?.brandKnowledgeBaseCount ?? 0} knowledge entries\`} />
                <ListCard title="Creative & Distribution" subtitle={\`\${data.stats?.videoProjectCount ?? 0} video projects\`} meta={\`\${data.stats?.distributionContentQueueCount ?? 0} content queue • \${data.stats?.campaignDashboardCount ?? 0} dashboards\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallOperationsScore ?? 0).toFixed(1)} overall operations score\`} meta={\`\${data.stats?.openOperationalFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first operational growth engine" />
            </div></Card>
            <Card hover><SectionHeader title="Operational pipeline" description={\`\${pipeline?.previousStage ?? "brand_os"} → \${pipeline?.currentStage ?? "creative_studio"} → \${pipeline?.nextStage ?? "distribution_hub"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Operational pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function GrowthAuditLogsPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Operational Growth Engine audit history" description="Security-first audit trail for jobs, events, contentPerformance, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function GrowthSdkPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Shared Operational Growth Engine SDK" description="Import from @/src/modules/growth-engine/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-pink-600 dark:text-pink-300">
            <ListCard title="createGrowthEngineClient()" subtitle="Factory for module-scoped Operational Growth Engine client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunBrandOsService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: arjun_automation_growth_engine" />
            <ListCard title="sdkRunCreativeStudioService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunDistributionService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-pink-500">Theme: {AAGE_THEME.primary} • Integration hubs loaded: {data.operationsHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-pink-950 p-4 text-xs text-pink-100">{\`import { createGrowthEngineClient } from "@/src/modules/growth-engine/sdk";

const intg = createGrowthEngineClient(userId, email, fullName);
await intg.registerCampus({ operationsHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runCreativeStudioService({ operationsHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runDistributionService({ operationsHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/GrowthEngineStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { AagoDashboardStats } from "@/src/modules/growth-engine/types";

interface GrowthEngineStatsProps { stats: AagoDashboardStats | null; }

export function GrowthEngineStats({ stats }: GrowthEngineStatsProps) {
    const cards = [
        { title: "Operations Hubs", value: String(stats?.totalOperationsHubs ?? 0), detail: \`\${stats?.activeOperationsHubs ?? 0} active • \${stats?.brandKnowledgeBaseCount ?? 0} knowledge entries\`, trend: "up" as const },
        { title: "Creative & Distribution", value: String(stats?.videoProjectCount ?? 0), detail: \`\${stats?.distributionContentQueueCount ?? 0} content queue • \${stats?.campaignDashboardCount ?? 0} dashboards\`, trend: "up" as const, tone: "accent" as const },
        { title: "Operations Score", value: \`\${(stats?.overallOperationsScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openOperationalFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Brand OS, creative studio, distribution, and command center audit entries", trend: "up" as const },
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
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Operational Growth Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-pink-900 dark:text-pink-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-pink-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-pink-600">V2 Program A Operational Growth Engine</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Operational Growth Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-pink-500 dark:text-pink-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Operational Growth Engine SDK.
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
import type {
    AagoSdkRunBrandOsServiceInput,
    AagoSdkRunCreativeStudioServiceInput,
    AagoSdkRunDistributionServiceInput,
    AagoSdkRunGrowthIntelligenceServiceInput,
    AagoSdkRunCommandCenterServiceInput,
} from "@/src/modules/growth-engine/types";

export class BrandOsService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunBrandOsServiceInput) { return this.client.runBrandOsService(input); }
}

export class CreativeStudioService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunCreativeStudioServiceInput) { return this.client.runCreativeStudioService(input); }
}

export class DistributionService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunDistributionServiceInput) { return this.client.runDistributionService(input); }
}

export class GrowthIntelligenceService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunGrowthIntelligenceServiceInput) { return this.client.runGrowthIntelligenceService(input); }
}

export class CommandCenterService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunCommandCenterServiceInput) { return this.client.runCommandCenterService(input); }
}

export class GrowthEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly brandOsService = new BrandOsService(this);
    readonly creativeStudioService = new CreativeStudioService(this);
    readonly distributionService = new DistributionService(this);
    readonly growthIntelligenceService = new GrowthIntelligenceService(this);
    readonly commandCenterService = new CommandCenterService(this);

    async runBrandOsService(input: AagoSdkRunBrandOsServiceInput) {
        return growthEngineService.sdkRunBrandOsService(this.authUserId, this.email, input, this.fullName);
    }

    async runCreativeStudioService(input: AagoSdkRunCreativeStudioServiceInput) {
        return growthEngineService.sdkRunCreativeStudioService(this.authUserId, this.email, input, this.fullName);
    }

    async runDistributionService(input: AagoSdkRunDistributionServiceInput) {
        return growthEngineService.sdkRunDistributionService(this.authUserId, this.email, input, this.fullName);
    }

    async runGrowthIntelligenceService(input: AagoSdkRunGrowthIntelligenceServiceInput) {
        return growthEngineService.sdkRunGrowthIntelligenceService(this.authUserId, this.email, input, this.fullName);
    }

    async runCommandCenterService(input: AagoSdkRunCommandCenterServiceInput) {
        return growthEngineService.sdkRunCommandCenterService(this.authUserId, this.email, input, this.fullName);
    }

    async getOperationsHubs() {
        return growthEngineService.getOperationsHubs(this.authUserId, this.email, this.fullName);
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
