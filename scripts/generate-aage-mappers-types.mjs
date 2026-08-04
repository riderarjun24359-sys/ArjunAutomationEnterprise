#!/usr/bin/env node
/**
 * Generates growth-engine-mappers.ts and types/index.ts.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "GrowthHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "BrandProfile", key: "profile_key", title: "profile_name", sub: "profile_status", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileStatus"] },
    { pascal: "BrandVoice", key: "voice_key", title: "voice_name", sub: "voice_tone", hub: true, orgOnly: false, createFields: ["voiceKey", "voiceName", "voiceTone"] },
    { pascal: "CoreMessaging", key: "messaging_key", title: "messaging_title", sub: "messaging_status", hub: true, orgOnly: false, createFields: ["messagingKey", "messagingTitle", "messagingStatus"] },
    { pascal: "BrandGuideline", key: "guideline_key", title: "guideline_name", sub: "guideline_status", hub: true, orgOnly: false, createFields: ["guidelineKey", "guidelineName", "guidelineStatus"] },
    { pascal: "LogoLibrary", key: "logo_key", title: "logo_name", sub: "logo_format", hub: true, orgOnly: false, createFields: ["logoKey", "logoName", "logoFormat"] },
    { pascal: "ColorSystem", key: "color_key", title: "color_name", sub: "primary_hex", hub: true, orgOnly: false, createFields: ["colorKey", "colorName", "primaryHex"] },
    { pascal: "YoutubeTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "SocialTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "BlogTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "WebsiteArticleTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "EmailCampaignTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "CaseStudyTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "ImageAsset", key: "asset_key", title: "asset_name", sub: "asset_type", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetType"] },
    { pascal: "VideoAsset", key: "asset_key", title: "asset_name", sub: "asset_type", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetType"] },
    { pascal: "IconAsset", key: "asset_key", title: "asset_name", sub: "asset_type", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetType"] },
    { pascal: "VoiceProfile", key: "profile_key", title: "profile_name", sub: "voice_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "voiceType"] },
    { pascal: "MusicAsset", key: "asset_key", title: "asset_name", sub: "genre", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "genre"] },
    { pascal: "ThumbnailTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "IdeaGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "ScriptGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "CaptionGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "BlogGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "SeoAssistant", key: "assistant_key", title: "assistant_name", sub: "assistant_status", hub: true, orgOnly: false, createFields: ["assistantKey", "assistantName", "assistantStatus"] },
    { pascal: "CtaGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "GrowthMetric", key: "metrics_key", title: "metrics_key", sub: "overall_growth_score", hub: false, orgOnly: true, createFields: ["metricsKey", "overallGrowthScore", "brandHealthScore"] },
    { pascal: "GrowthHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "brandStatus"] },
    { pascal: "ContentCalendar", key: "calendar_key", title: "calendar_name", sub: "calendar_status", hub: true, orgOnly: false, createFields: ["calendarKey", "calendarName", "calendarStatus"] },
    { pascal: "DraftQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
    { pascal: "ApprovalQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
    { pascal: "PublishingQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
];

const numFields = new Set([
    "overallGrowthScore", "brandHealthScore", "overallScore",
]);
const boolFields = new Set([]);

function buildTypes() {
    let t = `export interface AageDashboardStats {
    totalGrowthHubs: number;
    activeGrowthHubs: number;
    brandProfileCount: number;
    youtubeTemplateCount: number;
    imageAssetCount: number;
    ideaGeneratorCount: number;
    contentCalendarCount: number;
    publishingQueueCount: number;
    overallGrowthScore: number;
    marketingOverviewScore: number;
    brandHealthScore: number;
    draftQueueCount: number;
    approvalQueueCount: number;
    auditCount: number;
}

export interface AagePipelineInfo {
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

export interface AageSdkRunBrandServiceInput { growthHubId: string; profileKey?: string; profileName?: string; }
export interface AageSdkRunBrandServiceResult { profileId: string; profileKey: string; status: string; }
export interface AageSdkRunContentFoundationServiceInput { growthHubId: string; templateKey?: string; templateName?: string; }
export interface AageSdkRunContentFoundationServiceResult { templateId: string; templateKey: string; status: string; }
export interface AageSdkRunMediaFoundationServiceInput { growthHubId: string; assetKey?: string; assetName?: string; }
export interface AageSdkRunMediaFoundationServiceResult { assetId: string; assetKey: string; status: string; }
export interface AageSdkRunContentEngineServiceInput { growthHubId: string; generatorKey?: string; generatorName?: string; }
export interface AageSdkRunContentEngineServiceResult { generatorId: string; generatorKey: string; status: string; }
export interface AageSdkRunFounderDashboardServiceInput { growthHubId: string; queueKey?: string; queueTitle?: string; }
export interface AageSdkRunFounderDashboardServiceResult { queueId: string; queueKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "GrowthHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    growthHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbAage${e.pascal}`).concat(["DbAageAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["AageDashboardStats", "AagePipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/growth-engine/types";

export function buildGrowthHubLookupMaps(hubs: DbAageGrowthHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildAagePipelineInfo(): AagePipelineInfo {
    const stages = [
        { key: "brand", label: "Brand Foundation" },
        { key: "content_foundation", label: "Content Foundation" },
        { key: "media_foundation", label: "Media Foundation" },
        { key: "content_engine", label: "Content Engine" },
        { key: "founder_dashboard", label: "Founder Dashboard" },
    ];
    return { stages, currentStage: "content_foundation", nextStage: "media_foundation", previousStage: "brand" };
}

export function buildAageAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbAageAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "GrowthHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.growthHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        const mapsParam = isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }";
        m += `export function map${e.pascal}Summary(record: DbAage${e.pascal}${mapsParam}): ${e.pascal}Summary {
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

    m += `export function mapBrandProfileForStats(r: DbAageBrandProfile) { return { profile_status: r.profile_status, status: r.status }; }
export function mapYoutubeTemplateForStats(r: DbAageYoutubeTemplate) { return { template_status: r.template_status, status: r.status }; }
export function mapImageAssetForStats(r: DbAageImageAsset) { return { asset_type: r.asset_type, status: r.status }; }
export function mapIdeaGeneratorForStats(r: DbAageIdeaGenerator) { return { generator_status: r.generator_status, status: r.status }; }
export function mapContentCalendarForStats(r: DbAageContentCalendar) { return { calendar_status: r.calendar_status, status: r.status }; }
export function mapGrowthMetricForStats(r: DbAageGrowthMetric) {
    return {
        marketing_overview_score: r.marketing_overview_score,
        brand_health_score: r.brand_health_score,
        content_calendar_count: r.content_calendar_count,
        draft_queue_count: r.draft_queue_count,
        approval_queue_count: r.approval_queue_count,
        publishing_queue_count: r.publishing_queue_count,
        overall_growth_score: r.overall_growth_score,
        status: r.status,
    };
}
export function mapGrowthHealthForStats(r: DbAageGrowthHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapPublishingQueueForStats(r: DbAagePublishingQueue) { return { queue_status: r.queue_status, status: r.status }; }

export function buildAageDashboardStats(input: {
    growthHubs: GrowthHubSummary[];
    brandProfiles: ReturnType<typeof mapBrandProfileForStats>[];
    youtubeTemplates: ReturnType<typeof mapYoutubeTemplateForStats>[];
    imageAssets: ReturnType<typeof mapImageAssetForStats>[];
    ideaGenerators: ReturnType<typeof mapIdeaGeneratorForStats>[];
    contentCalendars: ReturnType<typeof mapContentCalendarForStats>[];
    growthMetrics: ReturnType<typeof mapGrowthMetricForStats>[];
    growthHealth: ReturnType<typeof mapGrowthHealthForStats>[];
    publishingQueues: ReturnType<typeof mapPublishingQueueForStats>[];
    auditLogs: AuditEntry[];
}): AageDashboardStats {
    const activeHubs = input.growthHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.growthMetrics[0];
    const latestHealth = input.growthHealth[0];
    const pendingPublish = input.publishingQueues.filter((q) => q.queue_status === "scheduled").length;
    return {
        totalGrowthHubs: input.growthHubs.length,
        activeGrowthHubs: activeHubs,
        brandProfileCount: input.brandProfiles.length,
        youtubeTemplateCount: input.youtubeTemplates.length,
        imageAssetCount: input.imageAssets.length,
        ideaGeneratorCount: input.ideaGenerators.length,
        contentCalendarCount: latestMetrics?.content_calendar_count ?? input.contentCalendars.length,
        publishingQueueCount: latestMetrics?.publishing_queue_count ?? pendingPublish,
        overallGrowthScore: latestMetrics?.overall_growth_score ?? latestHealth?.overall_score ?? 0,
        marketingOverviewScore: latestMetrics?.marketing_overview_score ?? 0,
        brandHealthScore: latestMetrics?.brand_health_score ?? 0,
        draftQueueCount: latestMetrics?.draft_queue_count ?? 0,
        approvalQueueCount: latestMetrics?.approval_queue_count ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/growth-engine/types"), { recursive: true });
writeFileSync(join(root, "src/modules/growth-engine/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/growth-engine-mappers.ts"), buildMappers(), "utf8");
console.log("Generated AAGE types and mappers");
