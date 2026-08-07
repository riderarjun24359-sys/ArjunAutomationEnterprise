import { GOV_ASPECT_RATIOS, GOV_PROVIDER_SLOTS } from "../constants";
import type {
    AiScriptStudio,
    GrowthOsVideoRawData,
    GrowthOsVideoSnapshot,
    QualityAssuranceEngine,
    ScriptRow,
    StoryboardEngine,
    VideoCompositionEngine,
    VideoProjectManager,
    VideoProjectRow,
    VoiceAudioStudio,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export function classifyScriptKind(scriptType: string, name: string, targetLength: number): ScriptRow["kind"] {
    const s = `${scriptType} ${name}`.toLowerCase();
    if (s.includes("short") || s.includes("reel") || s.includes("tiktok") || targetLength <= 60) return "shorts";
    if (s.includes("demo") || s.includes("product")) return "product_demo";
    if (s.includes("explain")) return "explainer";
    if (s.includes("case")) return "case_study";
    if (s.includes("webinar") || s.includes("event")) return "webinar";
    if (s.includes("youtube") || s.includes("long") || targetLength >= 480) return "youtube_long";
    return "other";
}

export function cameraForScene(index: number): string {
    const cams = ["wide establishing", "medium two-shot", "close-up detail", "over-shoulder", "tracking push-in"];
    return cams[index % cams.length];
}

export function shotForScene(index: number): string {
    const shots = ["master", "insert", "reaction", "b-roll", "screen capture"];
    return shots[index % shots.length];
}

export function transitionForScene(index: number): string {
    const transitions = ["cut", "dissolve", "whip-pan", "match-cut", "fade"];
    return transitions[index % transitions.length];
}

export function classifyProjectStage(status: string): VideoProjectRow["stage"] {
    const s = status.toLowerCase();
    if (s.includes("publish")) return "published";
    if (s.includes("export") || s.includes("render") || s.includes("queue")) return "export";
    if (s.includes("approv") && !s.includes("pending")) return "approved";
    if (s.includes("review") || s.includes("pending") || s.includes("await")) return "review";
    if (s.includes("draft") || s.includes("idea")) return "draft";
    return "other";
}

export function normalizeAspect(format: string, aspect?: string): string {
    const s = `${format} ${aspect ?? ""}`.toLowerCase();
    if (s.includes("9:16") || s.includes("vertical") || s.includes("short") || s.includes("reel")) return "9:16";
    if (s.includes("1:1") || s.includes("square")) return "1:1";
    if (s.includes("4:5")) return "4:5";
    if (s.includes("16:9") || s.includes("landscape") || s.includes("youtube")) return "16:9";
    return GOV_ASPECT_RATIOS.includes(aspect as (typeof GOV_ASPECT_RATIOS)[number]) ? (aspect as string) : "16:9";
}

export function isSoundEffect(genre: string, mood: string, name: string): boolean {
    const s = `${genre} ${mood} ${name}`.toLowerCase();
    return s.includes("sfx") || s.includes("effect") || s.includes("whoosh") || s.includes("sting") || s.includes("click");
}

export function estimateSceneDuration(totalSeconds: number, sceneCount: number): number {
    if (sceneCount <= 0) return 0;
    return Math.max(3, Math.round(totalSeconds / sceneCount));
}

export const govPure = {
    avg,
    classifyScriptKind,
    cameraForScene,
    shotForScene,
    transitionForScene,
    classifyProjectStage,
    normalizeAspect,
    isSoundEffect,
    estimateSceneDuration,
};

export function buildAiScriptStudio(data: GrowthOsVideoRawData): AiScriptStudio {
    const hasVoice = data.brandVoice.length > 0;
    const languages = [
        ...new Set([
            ...data.voiceProfiles.map((v) => v.language).filter(Boolean),
            ...data.voiceovers.map((v) => v.language).filter(Boolean),
        ]),
    ];
    const scripts: ScriptRow[] = data.scripts.map((s) => {
        const kind = classifyScriptKind(s.script_type, s.generator_name, s.target_length);
        return {
            id: s.id,
            name: s.generator_name,
            scriptType: s.script_type,
            targetLength: s.target_length,
            status: s.generator_status || s.status,
            kind,
            languageReady: languages.length > 0,
            brandVoiceAligned: hasVoice,
        };
    });
    return {
        scripts,
        youtubeLong: scripts.filter((s) => s.kind === "youtube_long"),
        shorts: scripts.filter((s) => s.kind === "shorts"),
        productDemos: scripts.filter((s) => s.kind === "product_demo"),
        explainers: scripts.filter((s) => s.kind === "explainer"),
        caseStudies: scripts.filter((s) => s.kind === "case_study"),
        webinars: scripts.filter((s) => s.kind === "webinar"),
        brandVoiceProfiles: data.brandVoice.map((v) => ({
            id: v.id,
            name: v.voice_name,
            tone: v.voice_tone,
            style: v.voice_style,
            status: v.status,
        })),
        languagesReady: languages,
    };
}

export function buildStoryboardEngine(data: GrowthOsVideoRawData): StoryboardEngine {
    const scenes: StoryboardEngine["scenes"] = [];
    const projects = data.videoProjects.length ? data.videoProjects : data.youtubeTemplates.map((y) => ({
        id: y.id,
        project_name: y.template_name,
        project_status: y.template_status,
        video_format: y.video_format,
        duration_seconds: y.duration_seconds,
        status: y.status,
        updated_at: y.updated_at,
    }));

    for (const project of projects) {
        const workflow = data.creativeWorkflows.find((w) =>
            w.workflow_name.toLowerCase().includes(project.project_name.toLowerCase().slice(0, 8)),
        );
        const sceneCount = Math.max(3, Math.min(8, workflow?.step_count || Math.ceil(project.duration_seconds / 30) || 4));
        const perScene = estimateSceneDuration(project.duration_seconds || sceneCount * 8, sceneCount);
        for (let i = 0; i < sceneCount; i += 1) {
            scenes.push({
                id: `${project.id}-scene-${i + 1}`,
                projectId: project.id,
                projectName: project.project_name,
                sceneIndex: i + 1,
                cameraSuggestion: cameraForScene(i),
                shotType: shotForScene(i),
                transition: transitionForScene(i),
                durationSeconds: perScene,
                visualCue: `${project.video_format || "visual"} · beat ${i + 1}/${sceneCount}`,
            });
        }
    }

    const transitions = scenes.slice(0, -1).map((scene, idx) => ({
        from: `S${scene.sceneIndex}`,
        to: `S${scenes[idx + 1]?.sceneIndex ?? scene.sceneIndex + 1}`,
        type: scene.transition,
    }));

    return {
        scenes,
        projectsCovered: projects.length,
        totalEstimatedSeconds: scenes.reduce((sum, s) => sum + s.durationSeconds, 0),
        transitions,
    };
}

export function buildVoiceAudioStudio(data: GrowthOsVideoRawData): VoiceAudioStudio {
    const musicLibrary = data.music
        .filter((m) => !isSoundEffect(m.genre, m.mood, m.asset_name))
        .map((m) => ({
            id: m.id,
            name: m.asset_name,
            genre: m.genre,
            mood: m.mood,
            url: m.asset_url,
            status: m.status,
        }));
    const soundEffects = data.music
        .filter((m) => isSoundEffect(m.genre, m.mood, m.asset_name))
        .map((m) => ({
            id: m.id,
            name: m.asset_name,
            genre: m.genre,
            mood: m.mood,
            url: m.asset_url,
            status: m.status,
        }));

    const pronunciationEntries = data.messaging.map((m) => ({
        id: m.id,
        term: m.messaging_title,
        language: "multi",
        source: m.messaging_type,
    }));

    const languages = [
        ...new Set([
            ...data.voiceProfiles.map((v) => v.language).filter(Boolean),
            ...data.voiceovers.map((v) => v.language).filter(Boolean),
        ]),
    ];

    const loudnessNormalizedCount = [...data.voiceProfiles, ...data.voiceovers].filter((v) => {
        const status = "status" in v ? v.status : "";
        const s = String(status).toLowerCase();
        return s.includes("active") || s.includes("ready") || s.includes("approved");
    }).length;

    return {
        voiceProfiles: data.voiceProfiles.map((v) => ({
            id: v.id,
            name: v.profile_name,
            voiceType: v.voice_type,
            language: v.language,
            sampleUrl: v.sample_url,
            status: v.status,
        })),
        voiceovers: data.voiceovers.map((v) => ({
            id: v.id,
            name: v.voiceover_name,
            voiceType: v.voice_type,
            language: v.language,
            status: v.voiceover_status || v.status,
        })),
        musicLibrary,
        soundEffects,
        languages,
        pronunciationEntries,
        loudnessNormalizedCount,
    };
}

export function buildVideoCompositionEngine(data: GrowthOsVideoRawData): VideoCompositionEngine {
    const assets: VideoCompositionEngine["assets"] = [
        ...data.imageAssets.map((a) => ({
            id: a.id,
            name: a.asset_name,
            role: "visual" as const,
            aspectRatio: normalizeAspect(a.asset_type),
            format: a.asset_format,
            status: a.status,
        })),
        ...data.creativeGenerators.map((g) => ({
            id: g.id,
            name: g.generator_name,
            role: (g.asset_type.toLowerCase().includes("motion") ? "motion" : "visual") as
                | "visual"
                | "motion",
            aspectRatio: normalizeAspect(g.output_format, g.asset_type),
            format: g.output_format,
            status: g.generator_status || g.status,
        })),
        ...data.logos.map((l) => ({
            id: l.id,
            name: l.logo_name,
            role: (l.logo_variant.toLowerCase().includes("water") ? "watermark" : "logo") as
                | "logo"
                | "watermark",
            aspectRatio: "1:1",
            format: l.logo_format,
            status: l.status,
        })),
        ...data.captions.map((c) => ({
            id: c.id,
            name: c.generator_name,
            role: "caption" as const,
            aspectRatio: normalizeAspect(c.platform),
            format: c.platform,
            status: c.generator_status || c.status,
        })),
        ...data.youtubeTemplates.map((y) => ({
            id: y.id,
            name: y.template_name,
            role: "intro_outro" as const,
            aspectRatio: normalizeAspect(y.video_format),
            format: y.video_format,
            status: y.template_status || y.status,
        })),
        ...data.thumbnailTemplates.map((t) => ({
            id: t.id,
            name: t.template_name,
            role: "lower_third" as const,
            aspectRatio: normalizeAspect(t.style, t.aspect_ratio),
            format: t.aspect_ratio,
            status: t.template_status || t.status,
        })),
    ];

    const aspectRatios = GOV_ASPECT_RATIOS.map((ratio) => ({
        ratio,
        assetCount: assets.filter((a) => a.aspectRatio === ratio).length,
    }));

    const hasScripts = data.scripts.length > 0;
    const hasVoice = data.voiceProfiles.length + data.voiceovers.length > 0;
    const hasVisuals = data.imageAssets.length + data.creativeGenerators.length > 0;
    const hasMotion = data.creativeGenerators.some((g) => g.asset_type.toLowerCase().includes("motion"));
    const hasCaptions = data.captions.length > 0;
    const hasExport = data.publishingQueue.length + data.publishingHistory.length > 0;

    const slotReady: Record<string, boolean> = {
        script_generation: hasScripts,
        voice_synthesis: hasVoice,
        visual_assembly: hasVisuals,
        motion_graphics: hasMotion || data.creativeWorkflows.length > 0,
        captioning: hasCaptions,
        transcoding: hasExport,
    };

    return {
        assets,
        aspectRatios,
        captions: assets.filter((a) => a.role === "caption"),
        introsOutros: assets.filter((a) => a.role === "intro_outro"),
        watermarks: assets.filter((a) => a.role === "watermark" || a.role === "logo"),
        providerSlots: GOV_PROVIDER_SLOTS.map((slot) => ({
            slot,
            status: slotReady[slot] ? "ready" : "unbound",
        })),
    };
}

export function buildVideoProjectManager(data: GrowthOsVideoRawData): VideoProjectManager {
    const projects: VideoProjectRow[] = [
        ...data.videoProjects.map((p) => ({
            id: p.id,
            name: p.project_name,
            format: p.video_format,
            durationSeconds: p.duration_seconds,
            status: p.project_status || p.status,
            stage: classifyProjectStage(p.project_status || p.status),
            updatedAt: p.updated_at,
            versionLabel: "v1",
        })),
        ...data.publishingQueue
            .filter((p) => p.content_type.toLowerCase().includes("video") || p.content_type.toLowerCase().includes("youtube"))
            .map((p) => ({
                id: p.id,
                name: p.queue_title,
                format: p.content_type,
                durationSeconds: 0,
                status: p.queue_status || p.status,
                stage: "export" as const,
                updatedAt: p.updated_at,
                versionLabel: "export",
            })),
        ...data.publishingHistory
            .filter((p) => p.content_type.toLowerCase().includes("video") || p.content_type.toLowerCase().includes("youtube"))
            .map((p) => ({
                id: p.id,
                name: p.history_title,
                format: p.content_type,
                durationSeconds: 0,
                status: p.history_status || p.status,
                stage: "published" as const,
                updatedAt: p.updated_at || p.published_at,
                versionLabel: "published",
            })),
    ];

    const comments = data.approvalCenter.map((a) => ({
        id: a.id,
        projectName: a.approval_title,
        note: `${a.content_type} · ${a.approver_ref || "reviewer"}`,
        status: a.approval_status || a.status,
    }));

    const approvalPending = [...data.approvalQueue, ...data.approvalCenter].filter((a) => {
        const status = "queue_status" in a ? a.queue_status : a.approval_status;
        const s = String(status || a.status).toLowerCase();
        return s.includes("pending") || s.includes("review") || s.includes("await");
    }).length;

    return {
        projects,
        drafts: projects.filter((p) => p.stage === "draft"),
        inReview: projects.filter((p) => p.stage === "review"),
        approved: projects.filter((p) => p.stage === "approved"),
        exportQueue: projects.filter((p) => p.stage === "export"),
        versionHistory: projects
            .map((p) => ({ id: p.id, name: p.name, version: p.versionLabel, updatedAt: p.updatedAt }))
            .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
            .slice(0, 50),
        comments,
        pendingApprovals: approvalPending,
    };
}

export function buildQualityAssuranceEngine(data: GrowthOsVideoRawData): QualityAssuranceEngine {
    const brandCompliance: QualityAssuranceEngine["brandCompliance"] = [
        ...data.brandVoice.map((v) => ({
            id: v.id,
            name: v.voice_name,
            category: "brand_voice",
            passed: Boolean(v.voice_tone && v.voice_style),
            detail: v.formality_level ? `formality:${v.formality_level}` : "missing formality",
        })),
        ...data.logos.map((l) => ({
            id: l.id,
            name: l.logo_name,
            category: "watermark_logo",
            passed: Boolean(l.logo_variant && l.logo_format),
            detail: l.logo_variant || "variant missing",
        })),
    ];

    const captionValidation = data.captions.map((c) => ({
        id: c.id,
        name: c.generator_name,
        category: "caption",
        passed: Boolean(c.platform?.trim()) && Boolean(c.tone?.trim()),
        detail: `${c.platform} · ${c.tone}`,
    }));

    const audioQuality = [
        ...data.voiceProfiles.map((v) => ({
            id: v.id,
            name: v.profile_name,
            category: "voice_profile",
            passed: Boolean(v.language) && Boolean(v.sample_url || v.voice_type),
            detail: v.language || "language missing",
        })),
        ...data.music.map((m) => ({
            id: m.id,
            name: m.asset_name,
            category: "music",
            passed: Boolean(m.genre) && Boolean(m.mood),
            detail: `${m.genre}/${m.mood}`,
        })),
    ];

    const allowed = new Set(["mp4", "mov", "webm", "mkv", "svg", "png", "wav", "mp3", "aac"]);
    const resolutionChecks = [
        ...data.videoProjects.map((p) => ({
            id: p.id,
            name: p.project_name,
            category: "resolution",
            passed: Boolean(p.video_format?.trim()) && p.duration_seconds > 0,
            detail: `${p.video_format} · ${p.duration_seconds}s`,
        })),
        ...data.imageAssets.map((a) => {
            const fmt = a.asset_format.toLowerCase().replace(".", "");
            return {
                id: a.id,
                name: a.asset_name,
                category: "asset_format",
                passed: allowed.has(fmt) || fmt.length > 0,
                detail: a.asset_format || "empty format",
            };
        }),
    ];

    const durationOptimization = data.videoProjects.map((p) => {
        const kind = classifyScriptKind(p.video_format, p.project_name, p.duration_seconds);
        let passed = true;
        let detail = `${p.duration_seconds}s ok`;
        if (kind === "shorts" && p.duration_seconds > 90) {
            passed = false;
            detail = "Shorts exceed 90s — trim recommended";
        } else if (kind === "youtube_long" && p.duration_seconds > 0 && p.duration_seconds < 120) {
            passed = false;
            detail = "Long-form under 2 minutes — extend or reclassify";
        }
        return { id: p.id, name: p.project_name, category: "duration", passed, detail };
    });

    const platformReadiness = [
        ...data.youtubeTemplates.map((y) => ({
            id: y.id,
            name: y.template_name,
            category: "youtube",
            passed: y.duration_seconds > 0 && Boolean(y.video_format),
            detail: normalizeAspect(y.video_format),
        })),
        ...data.publishingQueue.map((p) => ({
            id: p.id,
            name: p.queue_title,
            category: "export_queue",
            passed: Boolean(p.publish_date),
            detail: p.queue_status || p.status,
        })),
    ];

    const approvalQueue = [
        ...data.approvalQueue.map((a) => ({
            id: a.id,
            title: a.queue_title,
            contentType: a.content_type,
            approverRef: a.approver_ref,
            status: a.queue_status || a.status,
        })),
        ...data.approvalCenter.map((a) => ({
            id: a.id,
            title: a.approval_title,
            contentType: a.content_type,
            approverRef: a.approver_ref,
            status: a.approval_status || a.status,
        })),
    ];
    const pendingApprovals = approvalQueue.filter((a) => {
        const s = a.status.toLowerCase();
        return s.includes("pending") || s.includes("review") || s.includes("await");
    }).length;

    const allChecks = [
        ...brandCompliance,
        ...captionValidation,
        ...audioQuality,
        ...resolutionChecks,
        ...durationOptimization,
        ...platformReadiness,
    ];
    const passRate =
        allChecks.length === 0 ? null : (allChecks.filter((c) => c.passed).length / allChecks.length) * 100;
    const brandHealth = data.growthMetrics[0]?.brand_health_score ?? null;
    const qualityScore = avg([passRate, brandHealth].filter((n): n is number => n != null));

    return {
        brandCompliance,
        captionValidation,
        audioQuality,
        resolutionChecks,
        durationOptimization,
        platformReadiness,
        qualityScore,
        approvalQueue,
        pendingApprovals,
    };
}

export function createEmptyGrowthOsVideoSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): GrowthOsVideoSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        scripts: {
            scripts: [],
            youtubeLong: [],
            shorts: [],
            productDemos: [],
            explainers: [],
            caseStudies: [],
            webinars: [],
            brandVoiceProfiles: [],
            languagesReady: [],
        },
        storyboard: { scenes: [], projectsCovered: 0, totalEstimatedSeconds: 0, transitions: [] },
        audio: {
            voiceProfiles: [],
            voiceovers: [],
            musicLibrary: [],
            soundEffects: [],
            languages: [],
            pronunciationEntries: [],
            loudnessNormalizedCount: 0,
        },
        composition: {
            assets: [],
            aspectRatios: GOV_ASPECT_RATIOS.map((ratio) => ({ ratio, assetCount: 0 })),
            captions: [],
            introsOutros: [],
            watermarks: [],
            providerSlots: GOV_PROVIDER_SLOTS.map((slot) => ({ slot, status: "unbound" })),
        },
        projects: {
            projects: [],
            drafts: [],
            inReview: [],
            approved: [],
            exportQueue: [],
            versionHistory: [],
            comments: [],
            pendingApprovals: 0,
        },
        qa: {
            brandCompliance: [],
            captionValidation: [],
            audioQuality: [],
            resolutionChecks: [],
            durationOptimization: [],
            platformReadiness: [],
            qualityScore: null,
            approvalQueue: [],
            pendingApprovals: 0,
        },
    };
}

export function buildGrowthOsVideoSnapshot(data: GrowthOsVideoRawData): GrowthOsVideoSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        scripts: buildAiScriptStudio(data),
        storyboard: buildStoryboardEngine(data),
        audio: buildVoiceAudioStudio(data),
        composition: buildVideoCompositionEngine(data),
        projects: buildVideoProjectManager(data),
        qa: buildQualityAssuranceEngine(data),
    };
}
