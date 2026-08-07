import type { AmgeContentChannel } from "./constants";

export interface ContentPieceRow {
    id: string;
    title: string;
    channel: AmgeContentChannel | string;
    contentType: string;
    tone: string;
    status: string;
    wordCount: number;
}

export interface ChannelBreakdown {
    channel: string;
    count: number;
}

export interface AiContentGenerator {
    pieces: ContentPieceRow[];
    blogs: ContentPieceRow[];
    emails: ContentPieceRow[];
    linkedin: ContentPieceRow[];
    x: ContentPieceRow[];
    facebook: ContentPieceRow[];
    instagram: ContentPieceRow[];
    byChannel: ChannelBreakdown[];
    draftCount: number;
    readyCount: number;
}

export interface CampaignPlanRow {
    id: string;
    name: string;
    campaignType: string;
    assetCount: number;
    status: string;
    phase: "ideation" | "planning" | "production" | "launch" | "optimize" | "other";
}

export interface CampaignDashboardRow {
    id: string;
    name: string;
    campaignRef: string;
    refreshCadence: string;
    status: string;
}

export interface AiCampaignPlanner {
    plans: CampaignPlanRow[];
    dashboards: CampaignDashboardRow[];
    byPhase: Array<{ phase: string; count: number }>;
    totalAssets: number;
    activeCampaigns: number;
}

export interface BrandVoiceProfileRow {
    id: string;
    name: string;
    tone: string;
    style: string;
    formality: string;
    status: string;
}

export interface BrandGuidelineRow {
    id: string;
    name: string;
    category: string;
    version: string;
    status: string;
}

export interface MessagingPillarRow {
    id: string;
    title: string;
    type: string;
    audience: string;
    status: string;
}

export interface AiBrandVoiceManager {
    voices: BrandVoiceProfileRow[];
    guidelines: BrandGuidelineRow[];
    messaging: MessagingPillarRow[];
    activeVoices: number;
    coverageScore: number | null;
}

export interface PromptLibraryRow {
    id: string;
    name: string;
    category: string;
    outputFormat: string;
    status: string;
    kind: "idea" | "script" | "cta" | "caption" | "other";
}

export interface AiPromptLibrary {
    prompts: PromptLibraryRow[];
    byCategory: Array<{ category: string; count: number }>;
    ideaPrompts: PromptLibraryRow[];
    scriptPrompts: PromptLibraryRow[];
    ctaPrompts: PromptLibraryRow[];
    captionPrompts: PromptLibraryRow[];
}

export interface CalendarEntryRow {
    id: string;
    name: string;
    contentType: string;
    scheduledDate: string;
    status: string;
    weekBucket: string;
}

export interface AiContentCalendar {
    entries: CalendarEntryRow[];
    upcoming: CalendarEntryRow[];
    byContentType: Array<{ contentType: string; count: number }>;
    scheduledCount: number;
    overdueCount: number;
}

export interface AiMarketingGrowthEngineSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    content: AiContentGenerator;
    campaigns: AiCampaignPlanner;
    brandVoice: AiBrandVoiceManager;
    prompts: AiPromptLibrary;
    calendar: AiContentCalendar;
}

export interface AiMarketingGrowthEngineRawData {
    organizationId: string;
    membershipRole: string | null;
    blogTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        word_count_target: number;
        content_type: string;
        status: string;
    }>;
    blogGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        topic_category: string;
        word_count: number;
        status: string;
    }>;
    emailTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        campaign_type: string;
        subject_line: string;
        status: string;
    }>;
    socialTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        platform: string;
        post_type: string;
        status: string;
    }>;
    captions: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        platform: string;
        tone: string;
        status: string;
    }>;
    campaignBuilders: Array<{
        id: string;
        builder_name: string;
        builder_status: string;
        campaign_type: string;
        asset_count: number;
        status: string;
    }>;
    campaignDashboards: Array<{
        id: string;
        dashboard_name: string;
        dashboard_status: string;
        campaign_ref: string;
        refresh_cadence: string;
        status: string;
    }>;
    brandVoice: Array<{
        id: string;
        voice_name: string;
        voice_tone: string;
        voice_style: string;
        formality_level: string;
        status: string;
    }>;
    brandGuidelines: Array<{
        id: string;
        guideline_name: string;
        guideline_category: string;
        version: string;
        guideline_status: string;
        status: string;
    }>;
    messaging: Array<{
        id: string;
        messaging_title: string;
        messaging_type: string;
        audience_segment: string;
        messaging_status: string;
        status: string;
    }>;
    ideaGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        content_type: string;
        output_format: string;
        status: string;
    }>;
    scriptGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        script_type: string;
        target_length: number;
        status: string;
    }>;
    ctaGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        cta_type: string;
        conversion_goal: string;
        status: string;
    }>;
    contentCalendar: Array<{
        id: string;
        calendar_name: string;
        calendar_status: string;
        scheduled_date: string;
        content_type: string;
        status: string;
    }>;
    drafts: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        queue_status: string;
        status: string;
    }>;
    growthMetrics: Array<{
        overall_growth_score: number;
        brand_health_score: number;
        marketing_overview_score: number;
        content_calendar_count: number;
    }>;
}
