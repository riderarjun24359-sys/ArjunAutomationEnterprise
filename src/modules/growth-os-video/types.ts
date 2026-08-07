export interface ScriptRow {
    id: string;
    name: string;
    scriptType: string;
    targetLength: number;
    status: string;
    kind: "youtube_long" | "shorts" | "product_demo" | "explainer" | "case_study" | "webinar" | "other";
    languageReady: boolean;
    brandVoiceAligned: boolean;
}

export interface AiScriptStudio {
    scripts: ScriptRow[];
    youtubeLong: ScriptRow[];
    shorts: ScriptRow[];
    productDemos: ScriptRow[];
    explainers: ScriptRow[];
    caseStudies: ScriptRow[];
    webinars: ScriptRow[];
    brandVoiceProfiles: Array<{ id: string; name: string; tone: string; style: string; status: string }>;
    languagesReady: string[];
}

export interface StoryboardScene {
    id: string;
    projectId: string;
    projectName: string;
    sceneIndex: number;
    cameraSuggestion: string;
    shotType: string;
    transition: string;
    durationSeconds: number;
    visualCue: string;
}

export interface StoryboardEngine {
    scenes: StoryboardScene[];
    projectsCovered: number;
    totalEstimatedSeconds: number;
    transitions: Array<{ from: string; to: string; type: string }>;
}

export interface VoiceProfileRow {
    id: string;
    name: string;
    voiceType: string;
    language: string;
    sampleUrl: string;
    status: string;
}

export interface VoiceoverRow {
    id: string;
    name: string;
    voiceType: string;
    language: string;
    status: string;
}

export interface MusicRow {
    id: string;
    name: string;
    genre: string;
    mood: string;
    url: string;
    status: string;
}

export interface VoiceAudioStudio {
    voiceProfiles: VoiceProfileRow[];
    voiceovers: VoiceoverRow[];
    musicLibrary: MusicRow[];
    soundEffects: MusicRow[];
    languages: string[];
    pronunciationEntries: Array<{ id: string; term: string; language: string; source: string }>;
    loudnessNormalizedCount: number;
}

export interface CompositionAssetRow {
    id: string;
    name: string;
    role: "visual" | "motion" | "logo" | "lower_third" | "intro_outro" | "caption" | "watermark";
    aspectRatio: string;
    format: string;
    status: string;
}

export interface VideoCompositionEngine {
    assets: CompositionAssetRow[];
    aspectRatios: Array<{ ratio: string; assetCount: number }>;
    captions: CompositionAssetRow[];
    introsOutros: CompositionAssetRow[];
    watermarks: CompositionAssetRow[];
    providerSlots: Array<{ slot: string; status: "ready" | "unbound" }>;
}

export interface VideoProjectRow {
    id: string;
    name: string;
    format: string;
    durationSeconds: number;
    status: string;
    stage: "draft" | "review" | "approved" | "export" | "published" | "other";
    updatedAt: string;
    versionLabel: string;
}

export interface VideoProjectManager {
    projects: VideoProjectRow[];
    drafts: VideoProjectRow[];
    inReview: VideoProjectRow[];
    approved: VideoProjectRow[];
    exportQueue: VideoProjectRow[];
    versionHistory: Array<{ id: string; name: string; version: string; updatedAt: string }>;
    comments: Array<{ id: string; projectName: string; note: string; status: string }>;
    pendingApprovals: number;
}

export interface QaCheckRow {
    id: string;
    name: string;
    category: string;
    passed: boolean;
    detail: string;
}

export interface QualityAssuranceEngine {
    brandCompliance: QaCheckRow[];
    captionValidation: QaCheckRow[];
    audioQuality: QaCheckRow[];
    resolutionChecks: QaCheckRow[];
    durationOptimization: QaCheckRow[];
    platformReadiness: QaCheckRow[];
    qualityScore: number | null;
    approvalQueue: Array<{ id: string; title: string; contentType: string; approverRef: string; status: string }>;
    pendingApprovals: number;
}

export interface GrowthOsVideoSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    scripts: AiScriptStudio;
    storyboard: StoryboardEngine;
    audio: VoiceAudioStudio;
    composition: VideoCompositionEngine;
    projects: VideoProjectManager;
    qa: QualityAssuranceEngine;
}

export interface GrowthOsVideoRawData {
    organizationId: string;
    membershipRole: string | null;
    scripts: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        script_type: string;
        target_length: number;
        status: string;
        updated_at: string;
    }>;
    captions: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        platform: string;
        tone: string;
        status: string;
        updated_at: string;
    }>;
    brandVoice: Array<{
        id: string;
        voice_name: string;
        voice_tone: string;
        voice_style: string;
        formality_level: string;
        status: string;
    }>;
    voiceProfiles: Array<{
        id: string;
        profile_name: string;
        voice_type: string;
        language: string;
        sample_url: string;
        status: string;
        updated_at: string;
    }>;
    voiceovers: Array<{
        id: string;
        voiceover_name: string;
        voiceover_status: string;
        voice_type: string;
        language: string;
        status: string;
        updated_at: string;
    }>;
    music: Array<{
        id: string;
        asset_name: string;
        genre: string;
        mood: string;
        asset_url: string;
        status: string;
        updated_at: string;
    }>;
    videoProjects: Array<{
        id: string;
        project_name: string;
        project_status: string;
        video_format: string;
        duration_seconds: number;
        status: string;
        updated_at: string;
    }>;
    youtubeTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        video_format: string;
        duration_seconds: number;
        status: string;
        updated_at: string;
    }>;
    creativeWorkflows: Array<{
        id: string;
        workflow_name: string;
        workflow_status: string;
        workflow_type: string;
        step_count: number;
        status: string;
        updated_at: string;
    }>;
    creativeGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        asset_type: string;
        output_format: string;
        status: string;
        updated_at: string;
    }>;
    logos: Array<{
        id: string;
        logo_name: string;
        logo_format: string;
        logo_variant: string;
        asset_url: string;
        status: string;
        updated_at: string;
    }>;
    imageAssets: Array<{
        id: string;
        asset_name: string;
        asset_type: string;
        asset_format: string;
        asset_url: string;
        status: string;
        updated_at: string;
    }>;
    thumbnailTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        aspect_ratio: string;
        style: string;
        status: string;
        updated_at: string;
    }>;
    publishingQueue: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        publish_date: string;
        queue_status: string;
        status: string;
        updated_at: string;
    }>;
    publishingHistory: Array<{
        id: string;
        history_title: string;
        content_type: string;
        history_status: string;
        published_at: string;
        status: string;
        updated_at: string;
    }>;
    approvalQueue: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        approver_ref: string;
        queue_status: string;
        status: string;
    }>;
    approvalCenter: Array<{
        id: string;
        approval_title: string;
        content_type: string;
        approver_ref: string;
        approval_status: string;
        status: string;
    }>;
    messaging: Array<{
        id: string;
        messaging_title: string;
        messaging_type: string;
        audience_segment: string;
        status: string;
    }>;
    growthMetrics: Array<{
        brand_health_score: number;
        overall_growth_score: number;
        marketing_overview_score: number;
    }>;
}
