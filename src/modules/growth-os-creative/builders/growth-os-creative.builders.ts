import { GCR_SOCIAL_PLATFORMS } from "../constants";
import type {
    BrandImageStudio,
    BrandVisualRow,
    CampaignDesigner,
    CampaignCreativeRow,
    CreativeAssetLibrary,
    CreativeQualityEngine,
    GrowthOsCreativeRawData,
    GrowthOsCreativeSnapshot,
    SocialCreativeEngine,
    ThumbnailFactory,
    ThumbnailRow,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function tokenize(text: string): Set<string> {
    return new Set(
        text
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((t) => t.length > 2),
    );
}

export function titleSimilarity(a: string, b: string): number {
    const left = tokenize(a);
    const right = tokenize(b);
    if (!left.size || !right.size) return 0;
    let inter = 0;
    for (const t of left) if (right.has(t)) inter += 1;
    const union = left.size + right.size - inter;
    return union === 0 ? 0 : Math.round((inter / union) * 1000) / 1000;
}

export function isValidHex(hex: string): boolean {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim());
}

export function classifyBrandVisual(assetType: string, name: string): BrandVisualRow["kind"] {
    const s = `${assetType} ${name}`.toLowerCase();
    if (s.includes("hero")) return "hero";
    if (s.includes("banner") || s.includes("header")) return "banner";
    if (s.includes("blog") || s.includes("cover") || s.includes("article")) return "blog_cover";
    if (s.includes("landing") || s.includes("page")) return "landing";
    if (s.includes("product") || s.includes("illustrat")) return "product";
    if (s.includes("info") || s.includes("diagram") || s.includes("chart")) return "infographic";
    return "other";
}

export function normalizeSocialPlatform(platform: string, postType: string): string {
    const p = `${platform} ${postType}`.toLowerCase();
    if (p.includes("carousel") || p.includes("slide")) return "carousel";
    if (p.includes("story") || p.includes("reel")) return "story";
    if (p.includes("insta")) return "instagram";
    if (p.includes("linked")) return "linkedin";
    if (p.includes("face")) return "facebook";
    if (p.includes("twitter") || p === "x" || p.includes(" x ")) return "x";
    return platform.toLowerCase() || "other";
}

export function classifyCampaign(campaignType: string, name: string): CampaignCreativeRow["kind"] {
    const s = `${campaignType} ${name}`.toLowerCase();
    if (s.includes("launch") || s.includes("product")) return "product_launch";
    if (s.includes("event") || s.includes("webinar") || s.includes("summit")) return "event";
    if (s.includes("season") || s.includes("holiday") || s.includes("festive")) return "seasonal";
    if (s.includes("promo") || s.includes("offer") || s.includes("discount")) return "promotional";
    if (s.includes("email") || s.includes("newsletter")) return "email_banner";
    return "other";
}

export function classifyThumbnail(name: string, style: string, aspect: string): ThumbnailRow["kind"] {
    const s = `${name} ${style} ${aspect}`.toLowerCase();
    if (s.includes("youtube") || aspect.includes("16:9") || s.includes("yt")) return "youtube";
    if (s.includes("webinar") || s.includes("event")) return "webinar";
    if (s.includes("case")) return "case_study";
    if (s.includes("blog") || s.includes("article")) return "blog";
    return "other";
}

export function layoutScoreFromSteps(stepCount: number, status: string): number {
    const base = Math.min(100, Math.max(0, stepCount * 12));
    const s = status.toLowerCase();
    if (s.includes("active") || s.includes("approved") || s.includes("complete")) return Math.min(100, base + 20);
    if (s.includes("draft")) return Math.max(0, base - 10);
    return base;
}

export function extractTags(...parts: string[]): string[] {
    const tags = new Set<string>();
    for (const part of parts) {
        for (const token of tokenize(part)) {
            if (token.length >= 3) tags.add(token);
        }
    }
    return [...tags].slice(0, 8);
}

export const gcrPure = {
    avg,
    titleSimilarity,
    isValidHex,
    classifyBrandVisual,
    normalizeSocialPlatform,
    classifyCampaign,
    classifyThumbnail,
    layoutScoreFromSteps,
    extractTags,
};

export function buildBrandImageStudio(data: GrowthOsCreativeRawData): BrandImageStudio {
    const visuals: BrandVisualRow[] = [
        ...data.imageAssets.map((a) => ({
            id: a.id,
            name: a.asset_name,
            assetType: a.asset_type,
            format: a.asset_format,
            url: a.asset_url,
            status: a.status,
            kind: classifyBrandVisual(a.asset_type, a.asset_name),
        })),
        ...data.creativeGenerators.map((g) => ({
            id: g.id,
            name: g.generator_name,
            assetType: g.asset_type,
            format: g.output_format,
            url: "",
            status: g.generator_status || g.status,
            kind: classifyBrandVisual(g.asset_type, g.generator_name),
        })),
        ...data.iconAssets.map((i) => ({
            id: i.id,
            name: i.asset_name,
            assetType: i.asset_type,
            format: i.icon_style,
            url: i.asset_url,
            status: i.status,
            kind: classifyBrandVisual(i.asset_type, i.asset_name),
        })),
    ];
    return {
        visuals,
        heroes: visuals.filter((v) => v.kind === "hero"),
        banners: visuals.filter((v) => v.kind === "banner"),
        blogCovers: visuals.filter((v) => v.kind === "blog_cover"),
        landingVisuals: visuals.filter((v) => v.kind === "landing"),
        productIllustrations: visuals.filter((v) => v.kind === "product"),
        infographics: visuals.filter((v) => v.kind === "infographic"),
    };
}

export function buildSocialCreativeEngine(data: GrowthOsCreativeRawData): SocialCreativeEngine {
    const creatives = data.socialTemplates.map((s) => ({
        id: s.id,
        name: s.template_name,
        platform: normalizeSocialPlatform(s.platform, s.post_type),
        postType: s.post_type,
        aspectRatio: s.post_type.toLowerCase().includes("story") ? "9:16" : "1:1",
        status: s.template_status || s.status,
    }));
    const byPlatform = GCR_SOCIAL_PLATFORMS.map((platform) => ({
        platform,
        count: creatives.filter((c) => c.platform === platform).length,
    }));
    return {
        creatives,
        byPlatform,
        carousels: creatives.filter((c) => c.platform === "carousel" || c.postType.toLowerCase().includes("carousel")),
        stories: creatives.filter((c) => c.platform === "story" || c.postType.toLowerCase().includes("story")),
    };
}

export function buildCampaignDesigner(data: GrowthOsCreativeRawData): CampaignDesigner {
    const fromBuilders = data.campaignBuilders.map((c) => ({
        id: c.id,
        name: c.builder_name,
        campaignType: c.campaign_type,
        assetCount: c.asset_count,
        status: c.builder_status || c.status,
        kind: classifyCampaign(c.campaign_type, c.builder_name),
    }));
    const fromEmail = data.emailTemplates.map((e) => ({
        id: e.id,
        name: e.template_name,
        campaignType: e.campaign_type,
        assetCount: 1,
        status: e.template_status || e.status,
        kind: "email_banner" as const,
    }));
    const fromVideo = data.videoProjects.map((v) => ({
        id: v.id,
        name: v.project_name,
        campaignType: v.video_format,
        assetCount: 1,
        status: v.project_status || v.status,
        kind: classifyCampaign(v.video_format, v.project_name),
    }));
    const campaigns = [...fromBuilders, ...fromEmail, ...fromVideo];
    return {
        campaigns,
        productLaunches: campaigns.filter((c) => c.kind === "product_launch"),
        events: campaigns.filter((c) => c.kind === "event"),
        seasonal: campaigns.filter((c) => c.kind === "seasonal"),
        promotional: campaigns.filter((c) => c.kind === "promotional"),
        emailBanners: campaigns.filter((c) => c.kind === "email_banner"),
    };
}

export function buildThumbnailFactory(data: GrowthOsCreativeRawData): ThumbnailFactory {
    const fromTemplates = data.thumbnailTemplates.map((t) => ({
        id: t.id,
        name: t.template_name,
        aspectRatio: t.aspect_ratio,
        style: t.style,
        status: t.template_status || t.status,
        kind: classifyThumbnail(t.template_name, t.style, t.aspect_ratio),
    }));
    const fromManager = data.thumbnailManager.map((t) => ({
        id: t.id,
        name: t.thumbnail_name,
        aspectRatio: t.aspect_ratio,
        style: t.style,
        status: t.thumbnail_status || t.status,
        kind: classifyThumbnail(t.thumbnail_name, t.style, t.aspect_ratio),
    }));
    const fromYoutube = data.youtubeTemplates.map((y) => ({
        id: y.id,
        name: y.template_name,
        aspectRatio: "16:9",
        style: y.video_format,
        status: y.template_status || y.status,
        kind: "youtube" as const,
    }));
    const fromBlog = data.blogTemplates.map((b) => ({
        id: b.id,
        name: b.template_name,
        aspectRatio: "16:9",
        style: b.content_type,
        status: b.template_status || b.status,
        kind: "blog" as const,
    }));
    const fromCase = data.caseStudyTemplates.map((c) => ({
        id: c.id,
        name: c.template_name,
        aspectRatio: "16:9",
        style: c.industry,
        status: c.template_status || c.status,
        kind: "case_study" as const,
    }));
    const thumbnails = [...fromTemplates, ...fromManager, ...fromYoutube, ...fromBlog, ...fromCase];
    return {
        thumbnails,
        youtube: thumbnails.filter((t) => t.kind === "youtube"),
        blog: thumbnails.filter((t) => t.kind === "blog"),
        webinar: thumbnails.filter((t) => t.kind === "webinar"),
        caseStudy: thumbnails.filter((t) => t.kind === "case_study"),
    };
}

export function buildCreativeQualityEngine(data: GrowthOsCreativeRawData): CreativeQualityEngine {
    const colorValidations = data.colors.map((c) => {
        const valid =
            isValidHex(c.primary_hex) && isValidHex(c.secondary_hex) && isValidHex(c.accent_hex);
        return {
            id: c.id,
            name: c.color_name,
            primaryHex: c.primary_hex,
            secondaryHex: c.secondary_hex,
            accentHex: c.accent_hex,
            valid,
            detail: valid ? "Brand palette hex values valid" : "One or more hex values invalid",
        };
    });

    const typographyChecks = data.guidelines.map((g) => {
        const cat = g.guideline_category.toLowerCase();
        const consistent =
            cat.includes("type") ||
            cat.includes("font") ||
            cat.includes("typography") ||
            cat.includes("visual") ||
            Boolean(g.version);
        return {
            id: g.id,
            name: g.guideline_name,
            category: g.guideline_category,
            status: g.guideline_status || g.status,
            consistent,
        };
    });

    const layoutScores = data.creativeWorkflows.map((w) => ({
        id: w.id,
        name: w.workflow_name,
        score: layoutScoreFromSteps(w.step_count, w.workflow_status || w.status),
        status: w.workflow_status || w.status,
    }));

    const accessibility: CreativeQualityEngine["accessibility"] = [
        ...data.imageAssets.map((a) => ({
            id: a.id,
            name: a.asset_name,
            check: "Has named asset + format for alt/text labeling",
            passed: Boolean(a.asset_name?.trim()) && Boolean(a.asset_format?.trim()),
        })),
        ...data.logos.map((l) => ({
            id: l.id,
            name: l.logo_name,
            check: "Logo variant present for contrast contexts",
            passed: Boolean(l.logo_variant?.trim()),
        })),
    ];

    const names = [
        ...data.imageAssets.map((a) => ({ id: a.id, name: a.asset_name })),
        ...data.thumbnailTemplates.map((t) => ({ id: t.id, name: t.template_name })),
        ...data.socialTemplates.map((s) => ({ id: s.id, name: s.template_name })),
    ];
    const duplicates: CreativeQualityEngine["duplicates"] = [];
    for (let i = 0; i < Math.min(names.length, 20); i += 1) {
        for (let j = i + 1; j < Math.min(names.length, 20); j += 1) {
            const similarity = titleSimilarity(names[i].name, names[j].name);
            if (similarity >= 0.55) {
                duplicates.push({
                    id: `${names[i].id}:${names[j].id}`,
                    leftName: names[i].name,
                    rightName: names[j].name,
                    similarity,
                });
            }
        }
    }

    const allowedFormats = new Set(["svg", "png", "jpg", "jpeg", "webp", "gif", "pdf"]);
    const resolutionChecks = [
        ...data.imageAssets.map((a) => {
            const fmt = a.asset_format.toLowerCase().replace(".", "");
            const valid = allowedFormats.has(fmt) || fmt.length > 0;
            return {
                id: a.id,
                name: a.asset_name,
                format: a.asset_format,
                valid,
                detail: valid ? "Format accepted for production export" : "Unknown or empty format",
            };
        }),
        ...data.logos.map((l) => {
            const fmt = l.logo_format.toLowerCase().replace(".", "");
            const valid = allowedFormats.has(fmt);
            return {
                id: l.id,
                name: l.logo_name,
                format: l.logo_format,
                valid,
                detail: valid ? "Logo format production-ready" : "Logo format needs review",
            };
        }),
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

    const colorPassRate =
        colorValidations.length === 0
            ? null
            : (colorValidations.filter((c) => c.valid).length / colorValidations.length) * 100;
    const a11yPassRate =
        accessibility.length === 0
            ? null
            : (accessibility.filter((a) => a.passed).length / accessibility.length) * 100;
    const layoutAvg = avg(layoutScores.map((l) => l.score));
    const brandHealth = data.growthMetrics[0]?.brand_health_score ?? null;
    const qualityScore = avg(
        [colorPassRate, a11yPassRate, layoutAvg, brandHealth].filter((n): n is number => n != null),
    );

    return {
        colorValidations,
        typographyChecks,
        layoutScores,
        accessibility,
        duplicates,
        resolutionChecks,
        qualityScore,
        approvalQueue,
        pendingApprovals,
    };
}

export function buildCreativeAssetLibrary(data: GrowthOsCreativeRawData): CreativeAssetLibrary {
    const assets = [
        ...data.imageAssets.map((a) => ({
            id: a.id,
            name: a.asset_name,
            category: a.asset_type || "image",
            tags: extractTags(a.asset_name, a.asset_type, a.asset_format),
            version: "1.0",
            url: a.asset_url,
            status: a.status,
            updatedAt: a.updated_at,
        })),
        ...data.logos.map((l) => ({
            id: l.id,
            name: l.logo_name,
            category: `logo:${l.logo_variant}`,
            tags: extractTags(l.logo_name, l.logo_variant, l.logo_format),
            version: "1.0",
            url: l.asset_url,
            status: l.status,
            updatedAt: l.updated_at,
        })),
        ...data.cmpBrandAssets.map((c) => ({
            id: c.id,
            name: c.asset_name,
            category: c.asset_category,
            tags: extractTags(c.asset_name, c.asset_category),
            version: "1.0",
            url: c.asset_ref,
            status: c.status,
            updatedAt: c.updated_at,
        })),
    ];

    const templates = [
        ...data.socialTemplates.map((s) => ({
            id: s.id,
            name: s.template_name,
            category: `social:${s.platform}`,
            tags: extractTags(s.template_name, s.platform, s.post_type),
            version: "1.0",
            url: "",
            status: s.template_status || s.status,
            updatedAt: s.updated_at,
        })),
        ...data.thumbnailTemplates.map((t) => ({
            id: t.id,
            name: t.template_name,
            category: "thumbnail",
            tags: extractTags(t.template_name, t.style, t.aspect_ratio),
            version: "1.0",
            url: "",
            status: t.template_status || t.status,
            updatedAt: t.updated_at,
        })),
        ...data.guidelines.map((g) => ({
            id: g.id,
            name: g.guideline_name,
            category: g.guideline_category,
            tags: extractTags(g.guideline_name, g.guideline_category),
            version: g.version || "1.0",
            url: "",
            status: g.guideline_status || g.status,
            updatedAt: g.updated_at,
        })),
    ];

    const components = [
        ...data.iconAssets.map((i) => ({
            id: i.id,
            name: i.asset_name,
            componentType: i.icon_style || i.asset_type,
            status: i.status,
        })),
        ...data.creativeWorkflows.map((w) => ({
            id: w.id,
            name: w.workflow_name,
            componentType: w.workflow_type,
            status: w.workflow_status || w.status,
        })),
    ];

    const versionHistory = [...assets, ...templates]
        .map((a) => ({ id: a.id, name: a.name, version: a.version, updatedAt: a.updatedAt }))
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
        .slice(0, 50);

    const tagMap = new Map<string, number>();
    for (const item of [...assets, ...templates]) {
        for (const tag of item.tags) tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }

    return {
        assets,
        templates,
        components,
        versionHistory,
        tagIndex: Array.from(tagMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 40),
    };
}

export function createEmptyGrowthOsCreativeSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): GrowthOsCreativeSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        brandImages: {
            visuals: [],
            heroes: [],
            banners: [],
            blogCovers: [],
            landingVisuals: [],
            productIllustrations: [],
            infographics: [],
        },
        social: {
            creatives: [],
            byPlatform: GCR_SOCIAL_PLATFORMS.map((platform) => ({ platform, count: 0 })),
            carousels: [],
            stories: [],
        },
        campaign: {
            campaigns: [],
            productLaunches: [],
            events: [],
            seasonal: [],
            promotional: [],
            emailBanners: [],
        },
        thumbnails: { thumbnails: [], youtube: [], blog: [], webinar: [], caseStudy: [] },
        quality: {
            colorValidations: [],
            typographyChecks: [],
            layoutScores: [],
            accessibility: [],
            duplicates: [],
            resolutionChecks: [],
            qualityScore: null,
            approvalQueue: [],
            pendingApprovals: 0,
        },
        library: { assets: [], templates: [], components: [], versionHistory: [], tagIndex: [] },
    };
}

export function buildGrowthOsCreativeSnapshot(data: GrowthOsCreativeRawData): GrowthOsCreativeSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        brandImages: buildBrandImageStudio(data),
        social: buildSocialCreativeEngine(data),
        campaign: buildCampaignDesigner(data),
        thumbnails: buildThumbnailFactory(data),
        quality: buildCreativeQualityEngine(data),
        library: buildCreativeAssetLibrary(data),
    };
}
