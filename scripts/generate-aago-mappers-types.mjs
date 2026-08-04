#!/usr/bin/env node
/**
 * Generates growth-engine-operations-mappers.ts and types/index.ts for AAGO operational layer.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "OperationsHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "BrandKnowledgeBase", key: "knowledge_key", title: "knowledge_title", sub: "knowledge_status", hub: true, orgOnly: false, createFields: ["knowledgeKey", "knowledgeTitle", "knowledgeStatus"] },
    { pascal: "BrandRulebook", key: "rulebook_key", title: "rulebook_name", sub: "rulebook_status", hub: true, orgOnly: false, createFields: ["rulebookKey", "rulebookName", "rulebookStatus"] },
    { pascal: "MessagingLibrary", key: "message_key", title: "message_title", sub: "message_status", hub: true, orgOnly: false, createFields: ["messageKey", "messageTitle", "messageStatus"] },
    { pascal: "ServiceLibrary", key: "service_key", title: "service_name", sub: "service_status", hub: true, orgOnly: false, createFields: ["serviceKey", "serviceName", "serviceStatus"] },
    { pascal: "IndustryLibrary", key: "industry_key", title: "industry_name", sub: "industry_status", hub: true, orgOnly: false, createFields: ["industryKey", "industryName", "industryStatus"] },
    { pascal: "FaqLibrary", key: "faq_key", title: "faq_question", sub: "faq_status", hub: true, orgOnly: false, createFields: ["faqKey", "faqQuestion", "faqStatus"] },
    { pascal: "BrandApprovalRule", key: "rule_key", title: "rule_name", sub: "rule_status", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "ruleStatus"] },
    { pascal: "VideoProject", key: "project_key", title: "project_name", sub: "project_status", hub: true, orgOnly: false, createFields: ["projectKey", "projectName", "projectStatus"] },
    { pascal: "ThumbnailManager", key: "thumbnail_key", title: "thumbnail_name", sub: "thumbnail_status", hub: true, orgOnly: false, createFields: ["thumbnailKey", "thumbnailName", "thumbnailStatus"] },
    { pascal: "VoiceoverManager", key: "voiceover_key", title: "voiceover_name", sub: "voiceover_status", hub: true, orgOnly: false, createFields: ["voiceoverKey", "voiceoverName", "voiceoverStatus"] },
    { pascal: "CreativeAssetGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "CampaignAssetBuilder", key: "builder_key", title: "builder_name", sub: "builder_status", hub: true, orgOnly: false, createFields: ["builderKey", "builderName", "builderStatus"] },
    { pascal: "CreativeWorkflow", key: "workflow_key", title: "workflow_name", sub: "workflow_status", hub: true, orgOnly: false, createFields: ["workflowKey", "workflowName", "workflowStatus"] },
    { pascal: "DistributionContentQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
    { pascal: "DistributionPublishingQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
    { pascal: "ChannelManager", key: "channel_key", title: "channel_name", sub: "channel_status", hub: true, orgOnly: false, createFields: ["channelKey", "channelName", "channelStatus"] },
    { pascal: "ApprovalCenter", key: "approval_key", title: "approval_title", sub: "approval_status", hub: true, orgOnly: false, createFields: ["approvalKey", "approvalTitle", "approvalStatus"] },
    { pascal: "PublishingHistory", key: "history_key", title: "history_title", sub: "history_status", hub: true, orgOnly: false, createFields: ["historyKey", "historyTitle", "historyStatus"] },
    { pascal: "DistributionAnalytics", key: "analytics_key", title: "analytics_name", sub: "analytics_score", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsName", "analyticsScore"] },
    { pascal: "CampaignDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_status", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardStatus"] },
    { pascal: "ContentPerformance", key: "performance_key", title: "performance_title", sub: "performance_score", hub: true, orgOnly: false, createFields: ["performanceKey", "performanceTitle", "performanceScore"] },
    { pascal: "LeadAttribution", key: "attribution_key", title: "attribution_title", sub: "attribution_status", hub: true, orgOnly: false, createFields: ["attributionKey", "attributionTitle", "attributionStatus"] },
    { pascal: "GrowthKpi", key: "kpi_key", title: "kpi_name", sub: "kpi_value", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiValue"] },
    { pascal: "RoiDashboard", key: "roi_key", title: "roi_name", sub: "roi_score", hub: true, orgOnly: false, createFields: ["roiKey", "roiName", "roiScore"] },
    { pascal: "RecommendationEngine", key: "recommendation_key", title: "recommendation_title", sub: "recommendation_status", hub: true, orgOnly: false, createFields: ["recommendationKey", "recommendationTitle", "recommendationStatus"] },
    { pascal: "CommandCenterMetric", key: "metrics_key", title: "metrics_key", sub: "overall_operations_score", hub: false, orgOnly: true, createFields: ["metricsKey", "overallOperationsScore", "missionStatusScore"] },
    { pascal: "CommandCenterHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "brandOsStatus"] },
    { pascal: "MissionStatus", key: "mission_key", title: "mission_name", sub: "mission_status", hub: true, orgOnly: false, createFields: ["missionKey", "missionName", "missionStatus"] },
    { pascal: "ExecutiveSummary", key: "summary_key", title: "summary_title", sub: "summary_status", hub: true, orgOnly: false, createFields: ["summaryKey", "summaryTitle", "summaryStatus"] },
    { pascal: "OperationalFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "overallOperationsScore", "missionStatusScore", "overallScore", "analyticsScore",
    "performanceScore", "kpiValue", "roiScore",
]);
const boolFields = new Set([]);

function buildTypes() {
    let t = `export interface AagoDashboardStats {
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

`;
    for (const e of entities) {
        const isHub = e.pascal === "OperationsHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    operationsHubId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "hubName?: string;\n    "}${summaryFields}
    status: string;
}

export interface Create${e.pascal}Input {
    ${createExtra}${fields}
}

`;
    }
    return t;
}

function buildMappers() {
    const dbImports = entities.map((e) => `DbAago${e.pascal}`).concat(["DbAagoAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["AagoDashboardStats", "AagoPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/growth-engine/types";

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

`;

    for (const e of entities) {
        const isHub = e.pascal === "OperationsHub";
        const mapFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const cast = boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string";
            return `        ${f}: record.${snake} as ${cast},`;
        }).join("\n");
        const payloadFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const def = boolFields.has(f) ? "false" : numFields.has(f) ? "0" : "''";
            return `        ${snake}: input.${f} ?? ${def},`;
        }).join("\n");
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.operationsHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        const mapsParam = isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }";
        m += `export function map${e.pascal}Summary(record: DbAago${e.pascal}${mapsParam}): ${e.pascal}Summary {
    return {
        id: record.id,
${hubNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${hubLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapBrandKnowledgeBaseForStats(r: DbAagoBrandKnowledgeBase) { return { knowledge_status: r.knowledge_status, status: r.status }; }
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
`;

    return m;
}

mkdirSync(join(root, "src/modules/growth-engine/types"), { recursive: true });
writeFileSync(join(root, "src/modules/growth-engine/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/growth-engine-operations-mappers.ts"), buildMappers(), "utf8");
console.log("Generated AAGO operational types and mappers");
