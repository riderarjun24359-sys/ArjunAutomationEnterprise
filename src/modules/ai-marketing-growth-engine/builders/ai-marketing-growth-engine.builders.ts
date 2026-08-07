import { AMGE_CONTENT_CHANNELS } from "../constants";
import type {
    AiBrandVoiceManager,
    AiCampaignPlanner,
    AiContentCalendar,
    AiContentGenerator,
    AiMarketingGrowthEngineRawData,
    AiMarketingGrowthEngineSnapshot,
    AiPromptLibrary,
    CampaignPlanRow,
    ContentPieceRow,
    PromptLibraryRow,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function normalizeChannel(platformOrType: string): string {
    const p = platformOrType.toLowerCase().trim();
    if (p.includes("blog") || p.includes("article") || p.includes("seo")) return "blog";
    if (p.includes("email") || p.includes("newsletter") || p.includes("drip")) return "email";
    if (p.includes("linked")) return "linkedin";
    if (p === "twitter" || p === "x" || p.includes("x.com")) return "x";
    if (p.includes("face")) return "facebook";
    if (p.includes("insta")) return "instagram";
    return p || "other";
}

function classifyCampaignPhase(campaignType: string, name: string, status: string): CampaignPlanRow["phase"] {
    const s = `${campaignType} ${name} ${status}`.toLowerCase();
    if (s.includes("idea") || s.includes("research")) return "ideation";
    if (s.includes("plan") || s.includes("brief")) return "planning";
    if (s.includes("produc") || s.includes("creat") || s.includes("draft")) return "production";
    if (s.includes("launch") || s.includes("publish") || s.includes("live")) return "launch";
    if (s.includes("optim") || s.includes("iterate") || s.includes("test")) return "optimize";
    return "other";
}

function weekBucket(isoDate: string): string {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "unscheduled";
    const year = d.getUTCFullYear();
    const oneJan = new Date(Date.UTC(year, 0, 1));
    const day = Math.floor((d.getTime() - oneJan.getTime()) / 86_400_000);
    const week = Math.floor((day + oneJan.getUTCDay()) / 7) + 1;
    return `${year}-W${String(week).padStart(2, "0")}`;
}

function isDraftStatus(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("draft") || s.includes("pending") || s.includes("review");
}

function isReadyStatus(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("ready") || s.includes("approved") || s.includes("active") || s.includes("published");
}

export const amgePure = {
    avg,
    normalizeChannel,
    classifyCampaignPhase,
    weekBucket,
    isDraftStatus,
    isReadyStatus,
};

export function buildAiContentGenerator(data: AiMarketingGrowthEngineRawData): AiContentGenerator {
    const pieces: ContentPieceRow[] = [];

    for (const t of data.blogTemplates) {
        pieces.push({
            id: t.id,
            title: t.template_name,
            channel: "blog",
            contentType: t.content_type || "blog",
            tone: "editorial",
            status: t.template_status || t.status,
            wordCount: t.word_count_target,
        });
    }
    for (const g of data.blogGenerators) {
        pieces.push({
            id: g.id,
            title: g.generator_name,
            channel: "blog",
            contentType: g.topic_category || "blog",
            tone: "generative",
            status: g.generator_status || g.status,
            wordCount: g.word_count,
        });
    }
    for (const e of data.emailTemplates) {
        pieces.push({
            id: e.id,
            title: e.template_name || e.subject_line,
            channel: "email",
            contentType: e.campaign_type || "email",
            tone: "direct",
            status: e.template_status || e.status,
            wordCount: 0,
        });
    }
    for (const s of data.socialTemplates) {
        const channel = normalizeChannel(s.platform);
        pieces.push({
            id: s.id,
            title: s.template_name,
            channel,
            contentType: s.post_type || "social",
            tone: "social",
            status: s.template_status || s.status,
            wordCount: 0,
        });
    }
    for (const c of data.captions) {
        const channel = normalizeChannel(c.platform);
        pieces.push({
            id: c.id,
            title: c.generator_name,
            channel,
            contentType: "caption",
            tone: c.tone || "caption",
            status: c.generator_status || c.status,
            wordCount: 0,
        });
    }

    const filterChannel = (channel: string) => pieces.filter((p) => normalizeChannel(String(p.channel)) === channel);

    const byChannel = AMGE_CONTENT_CHANNELS.map((channel) => ({
        channel,
        count: filterChannel(channel).length,
    }));

    return {
        pieces,
        blogs: filterChannel("blog"),
        emails: filterChannel("email"),
        linkedin: filterChannel("linkedin"),
        x: filterChannel("x"),
        facebook: filterChannel("facebook"),
        instagram: filterChannel("instagram"),
        byChannel,
        draftCount: pieces.filter((p) => isDraftStatus(p.status)).length,
        readyCount: pieces.filter((p) => isReadyStatus(p.status)).length,
    };
}

export function buildAiCampaignPlanner(data: AiMarketingGrowthEngineRawData): AiCampaignPlanner {
    const plans: CampaignPlanRow[] = data.campaignBuilders.map((c) => ({
        id: c.id,
        name: c.builder_name,
        campaignType: c.campaign_type,
        assetCount: c.asset_count,
        status: c.builder_status || c.status,
        phase: classifyCampaignPhase(c.campaign_type, c.builder_name, c.builder_status || c.status),
    }));

    const dashboards = data.campaignDashboards.map((d) => ({
        id: d.id,
        name: d.dashboard_name,
        campaignRef: d.campaign_ref,
        refreshCadence: d.refresh_cadence,
        status: d.dashboard_status || d.status,
    }));

    const phaseOrder = ["ideation", "planning", "production", "launch", "optimize", "other"] as const;
    const byPhase = phaseOrder.map((phase) => ({
        phase,
        count: plans.filter((p) => p.phase === phase).length,
    }));

    return {
        plans,
        dashboards,
        byPhase,
        totalAssets: plans.reduce((sum, p) => sum + p.assetCount, 0),
        activeCampaigns: plans.filter((p) => isReadyStatus(p.status) || p.phase === "launch" || p.phase === "production")
            .length,
    };
}

export function buildAiBrandVoiceManager(data: AiMarketingGrowthEngineRawData): AiBrandVoiceManager {
    const voices = data.brandVoice.map((v) => ({
        id: v.id,
        name: v.voice_name,
        tone: v.voice_tone,
        style: v.voice_style,
        formality: v.formality_level,
        status: v.status,
    }));
    const guidelines = data.brandGuidelines.map((g) => ({
        id: g.id,
        name: g.guideline_name,
        category: g.guideline_category,
        version: g.version,
        status: g.guideline_status || g.status,
    }));
    const messaging = data.messaging.map((m) => ({
        id: m.id,
        title: m.messaging_title,
        type: m.messaging_type,
        audience: m.audience_segment,
        status: m.messaging_status || m.status,
    }));

    const activeVoices = voices.filter((v) => isReadyStatus(v.status) || v.status.toLowerCase() === "active").length;
    const brandScores = data.growthMetrics.map((m) => m.brand_health_score).filter((n) => Number.isFinite(n) && n > 0);
    const coverageScore =
        avg(brandScores) ??
        (voices.length || guidelines.length || messaging.length
            ? Math.min(100, Math.round(((voices.length + guidelines.length + messaging.length) / 9) * 100))
            : null);

    return { voices, guidelines, messaging, activeVoices, coverageScore };
}

export function buildAiPromptLibrary(data: AiMarketingGrowthEngineRawData): AiPromptLibrary {
    const prompts: PromptLibraryRow[] = [
        ...data.ideaGenerators.map((g) => ({
            id: g.id,
            name: g.generator_name,
            category: g.content_type || "idea",
            outputFormat: g.output_format,
            status: g.generator_status || g.status,
            kind: "idea" as const,
        })),
        ...data.scriptGenerators.map((g) => ({
            id: g.id,
            name: g.generator_name,
            category: g.script_type || "script",
            outputFormat: `length:${g.target_length}`,
            status: g.generator_status || g.status,
            kind: "script" as const,
        })),
        ...data.ctaGenerators.map((g) => ({
            id: g.id,
            name: g.generator_name,
            category: g.cta_type || "cta",
            outputFormat: g.conversion_goal,
            status: g.generator_status || g.status,
            kind: "cta" as const,
        })),
        ...data.captions.map((g) => ({
            id: g.id,
            name: g.generator_name,
            category: normalizeChannel(g.platform),
            outputFormat: g.tone,
            status: g.generator_status || g.status,
            kind: "caption" as const,
        })),
    ];

    const categoryMap = new Map<string, number>();
    for (const p of prompts) {
        categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
    }

    return {
        prompts,
        byCategory: [...categoryMap.entries()]
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count),
        ideaPrompts: prompts.filter((p) => p.kind === "idea"),
        scriptPrompts: prompts.filter((p) => p.kind === "script"),
        ctaPrompts: prompts.filter((p) => p.kind === "cta"),
        captionPrompts: prompts.filter((p) => p.kind === "caption"),
    };
}

export function buildAiContentCalendar(data: AiMarketingGrowthEngineRawData): AiContentCalendar {
    const now = Date.now();
    const entries = data.contentCalendar.map((c) => ({
        id: c.id,
        name: c.calendar_name,
        contentType: c.content_type,
        scheduledDate: c.scheduled_date,
        status: c.calendar_status || c.status,
        weekBucket: weekBucket(c.scheduled_date),
    }));

    const upcoming = entries
        .filter((e) => {
            const t = new Date(e.scheduledDate).getTime();
            return Number.isFinite(t) && t >= now;
        })
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

    const overdueCount = entries.filter((e) => {
        const t = new Date(e.scheduledDate).getTime();
        return Number.isFinite(t) && t < now && !isReadyStatus(e.status);
    }).length;

    const typeMap = new Map<string, number>();
    for (const e of entries) {
        typeMap.set(e.contentType || "other", (typeMap.get(e.contentType || "other") ?? 0) + 1);
    }

    const metricsCalendarCount = data.growthMetrics[0]?.content_calendar_count;
    const scheduledCount =
        typeof metricsCalendarCount === "number" && metricsCalendarCount > 0
            ? metricsCalendarCount
            : entries.length;

    return {
        entries,
        upcoming,
        byContentType: [...typeMap.entries()].map(([contentType, count]) => ({ contentType, count })),
        scheduledCount,
        overdueCount,
    };
}

export function createEmptyAiMarketingGrowthEngineSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): AiMarketingGrowthEngineSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        content: {
            pieces: [],
            blogs: [],
            emails: [],
            linkedin: [],
            x: [],
            facebook: [],
            instagram: [],
            byChannel: AMGE_CONTENT_CHANNELS.map((channel) => ({ channel, count: 0 })),
            draftCount: 0,
            readyCount: 0,
        },
        campaigns: {
            plans: [],
            dashboards: [],
            byPhase: [],
            totalAssets: 0,
            activeCampaigns: 0,
        },
        brandVoice: {
            voices: [],
            guidelines: [],
            messaging: [],
            activeVoices: 0,
            coverageScore: null,
        },
        prompts: {
            prompts: [],
            byCategory: [],
            ideaPrompts: [],
            scriptPrompts: [],
            ctaPrompts: [],
            captionPrompts: [],
        },
        calendar: {
            entries: [],
            upcoming: [],
            byContentType: [],
            scheduledCount: 0,
            overdueCount: 0,
        },
    };
}

export function buildAiMarketingGrowthEngineSnapshot(
    data: AiMarketingGrowthEngineRawData,
): AiMarketingGrowthEngineSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        content: buildAiContentGenerator(data),
        campaigns: buildAiCampaignPlanner(data),
        brandVoice: buildAiBrandVoiceManager(data),
        prompts: buildAiPromptLibrary(data),
        calendar: buildAiContentCalendar(data),
    };
}
