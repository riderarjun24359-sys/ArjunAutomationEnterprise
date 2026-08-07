export interface BrandVisualRow {
    id: string;
    name: string;
    assetType: string;
    format: string;
    url: string;
    status: string;
    kind: "hero" | "banner" | "blog_cover" | "landing" | "product" | "infographic" | "other";
}

export interface BrandImageStudio {
    visuals: BrandVisualRow[];
    heroes: BrandVisualRow[];
    banners: BrandVisualRow[];
    blogCovers: BrandVisualRow[];
    landingVisuals: BrandVisualRow[];
    productIllustrations: BrandVisualRow[];
    infographics: BrandVisualRow[];
}

export interface SocialCreativeRow {
    id: string;
    name: string;
    platform: string;
    postType: string;
    aspectRatio: string;
    status: string;
}

export interface SocialCreativeEngine {
    creatives: SocialCreativeRow[];
    byPlatform: Array<{ platform: string; count: number }>;
    carousels: SocialCreativeRow[];
    stories: SocialCreativeRow[];
}

export interface CampaignCreativeRow {
    id: string;
    name: string;
    campaignType: string;
    assetCount: number;
    status: string;
    kind: "product_launch" | "event" | "seasonal" | "promotional" | "email_banner" | "other";
}

export interface CampaignDesigner {
    campaigns: CampaignCreativeRow[];
    productLaunches: CampaignCreativeRow[];
    events: CampaignCreativeRow[];
    seasonal: CampaignCreativeRow[];
    promotional: CampaignCreativeRow[];
    emailBanners: CampaignCreativeRow[];
}

export interface ThumbnailRow {
    id: string;
    name: string;
    aspectRatio: string;
    style: string;
    status: string;
    kind: "youtube" | "blog" | "webinar" | "case_study" | "other";
}

export interface ThumbnailFactory {
    thumbnails: ThumbnailRow[];
    youtube: ThumbnailRow[];
    blog: ThumbnailRow[];
    webinar: ThumbnailRow[];
    caseStudy: ThumbnailRow[];
}

export interface ColorValidationRow {
    id: string;
    name: string;
    primaryHex: string;
    secondaryHex: string;
    accentHex: string;
    valid: boolean;
    detail: string;
}

export interface LayoutScoreRow {
    id: string;
    name: string;
    score: number;
    status: string;
}

export interface AccessibilityCheckRow {
    id: string;
    name: string;
    check: string;
    passed: boolean;
}

export interface DuplicateCreativeSignal {
    id: string;
    leftName: string;
    rightName: string;
    similarity: number;
}

export interface ResolutionCheckRow {
    id: string;
    name: string;
    format: string;
    valid: boolean;
    detail: string;
}

export interface ApprovalQueueRow {
    id: string;
    title: string;
    contentType: string;
    approverRef: string;
    status: string;
}

export interface CreativeQualityEngine {
    colorValidations: ColorValidationRow[];
    typographyChecks: Array<{ id: string; name: string; category: string; status: string; consistent: boolean }>;
    layoutScores: LayoutScoreRow[];
    accessibility: AccessibilityCheckRow[];
    duplicates: DuplicateCreativeSignal[];
    resolutionChecks: ResolutionCheckRow[];
    qualityScore: number | null;
    approvalQueue: ApprovalQueueRow[];
    pendingApprovals: number;
}

export interface LibraryAssetRow {
    id: string;
    name: string;
    category: string;
    tags: string[];
    version: string;
    url: string;
    status: string;
    updatedAt: string;
}

export interface DesignComponentRow {
    id: string;
    name: string;
    componentType: string;
    status: string;
}

export interface CreativeAssetLibrary {
    assets: LibraryAssetRow[];
    templates: LibraryAssetRow[];
    components: DesignComponentRow[];
    versionHistory: Array<{ id: string; name: string; version: string; updatedAt: string }>;
    tagIndex: Array<{ tag: string; count: number }>;
}

export interface GrowthOsCreativeSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    brandImages: BrandImageStudio;
    social: SocialCreativeEngine;
    campaign: CampaignDesigner;
    thumbnails: ThumbnailFactory;
    quality: CreativeQualityEngine;
    library: CreativeAssetLibrary;
}

export interface GrowthOsCreativeRawData {
    organizationId: string;
    membershipRole: string | null;
    imageAssets: Array<{
        id: string;
        asset_name: string;
        asset_type: string;
        asset_format: string;
        asset_url: string;
        status: string;
        updated_at: string;
    }>;
    iconAssets: Array<{
        id: string;
        asset_name: string;
        asset_type: string;
        icon_style: string;
        asset_url: string;
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
    colors: Array<{
        id: string;
        color_name: string;
        primary_hex: string;
        secondary_hex: string;
        accent_hex: string;
        status: string;
    }>;
    guidelines: Array<{
        id: string;
        guideline_name: string;
        guideline_category: string;
        version: string;
        guideline_status: string;
        status: string;
        updated_at: string;
    }>;
    socialTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        platform: string;
        post_type: string;
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
    thumbnailManager: Array<{
        id: string;
        thumbnail_name: string;
        thumbnail_status: string;
        aspect_ratio: string;
        style: string;
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
    creativeGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        asset_type: string;
        output_format: string;
        status: string;
        updated_at: string;
    }>;
    campaignBuilders: Array<{
        id: string;
        builder_name: string;
        builder_status: string;
        campaign_type: string;
        asset_count: number;
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
    videoProjects: Array<{
        id: string;
        project_name: string;
        project_status: string;
        video_format: string;
        duration_seconds: number;
        status: string;
        updated_at: string;
    }>;
    emailTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        campaign_type: string;
        status: string;
        updated_at: string;
    }>;
    caseStudyTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        industry: string;
        status: string;
        updated_at: string;
    }>;
    blogTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        content_type: string;
        status: string;
        updated_at: string;
    }>;
    cmpBrandAssets: Array<{
        id: string;
        asset_name: string;
        asset_category: string;
        asset_ref: string;
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
    growthMetrics: Array<{
        brand_health_score: number;
        overall_growth_score: number;
        marketing_overview_score: number;
    }>;
}
