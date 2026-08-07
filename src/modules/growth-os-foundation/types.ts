import type { GofWorkflowStage } from "./constants";

export interface BrandLogoRow {
    id: string;
    name: string;
    variant: string;
    format: string;
    url: string;
    status: string;
}

export interface BrandColorRow {
    id: string;
    name: string;
    primaryHex: string;
    secondaryHex: string;
    accentHex: string;
    status: string;
}

export interface BrandFontRow {
    id: string;
    name: string;
    category: string;
    version: string;
    status: string;
}

export interface BrandTemplateRow {
    id: string;
    name: string;
    kind: string;
    status: string;
}

export interface BrandApprovalRuleRow {
    id: string;
    name: string;
    approvalLevel: string;
    entityType: string;
    status: string;
}

export interface BrandAssetLibraryRow {
    id: string;
    title: string;
    category: string;
    ref: string;
    status: string;
}

export interface BrandAssetManager {
    logos: BrandLogoRow[];
    colors: BrandColorRow[];
    fonts: BrandFontRow[];
    templates: BrandTemplateRow[];
    approvalRules: BrandApprovalRuleRow[];
    library: BrandAssetLibraryRow[];
    pendingApprovals: number;
    logoCount: number;
    templateCount: number;
}

export interface CalendarItem {
    id: string;
    name: string;
    contentType: string;
    scheduledDate: string;
    status: string;
}

export interface CampaignPlanRow {
    id: string;
    name: string;
    channel: string;
    status: string;
    startsAt: string | null;
    endsAt: string | null;
}

export interface DraftRow {
    id: string;
    title: string;
    contentType: string;
    priority: string;
    status: string;
}

export interface ReviewRow {
    id: string;
    title: string;
    contentType: string;
    approverRef: string;
    status: string;
}

export interface ContentAssetRow {
    id: string;
    name: string;
    assetType: string;
    url: string;
    status: string;
}

export interface ContentWorkspace {
    calendar: CalendarItem[];
    campaigns: CampaignPlanRow[];
    drafts: DraftRow[];
    reviews: ReviewRow[];
    assets: ContentAssetRow[];
    draftCount: number;
    reviewCount: number;
    scheduledCount: number;
}

export interface IndustryTrendRow {
    id: string;
    name: string;
    vertical: string;
    segment: string;
    status: string;
}

export interface CompetitorSignalRow {
    id: string;
    competitor: string;
    outcome: string;
    reason: string;
    amount: number;
    recordedAt: string;
}

export interface SeoKeywordRow {
    id: string;
    name: string;
    keywordFocus: string;
    searchIntent: string;
    status: string;
}

export interface ContentOpportunityRow {
    id: string;
    name: string;
    contentType: string;
    outputFormat: string;
    status: string;
}

export interface AudienceInsightRow {
    id: string;
    title: string;
    audienceSegment: string;
    messagingType: string;
    status: string;
}

export interface AiResearchEngine {
    trends: IndustryTrendRow[];
    competitors: CompetitorSignalRow[];
    keywords: SeoKeywordRow[];
    opportunities: ContentOpportunityRow[];
    audiences: AudienceInsightRow[];
    keywordCount: number;
    opportunityCount: number;
}

export interface WorkflowItem {
    id: string;
    title: string;
    contentType: string;
    stage: GofWorkflowStage;
    roleRequired: string;
    source: string;
    updatedAt: string;
}

export interface AuditLogRow {
    id: string;
    entityType: string;
    action: string;
    summary: string;
    performedBy: string | null;
    createdAt: string;
}

export interface WorkflowStageBucket {
    stage: GofWorkflowStage;
    count: number;
}

export interface WorkflowEngine {
    items: WorkflowItem[];
    stages: WorkflowStageBucket[];
    auditLog: AuditLogRow[];
    roleApprovals: Array<{ role: string; pending: number }>;
}

export interface CampaignMetricRow {
    id: string;
    name: string;
    openRate: number;
    clickRate: number;
    sentCount: number;
    deliveredCount: number;
}

export interface ContentPerformanceRow {
    id: string;
    title: string;
    contentType: string;
    score: number;
    measuredAt: string;
}

export interface SeoDashboardRow {
    id: string;
    name: string;
    keywordFocus: string;
    searchIntent: string;
    status: string;
}

export interface AnalyticsFoundation {
    campaignMetrics: CampaignMetricRow[];
    contentPerformance: ContentPerformanceRow[];
    seoDashboard: SeoDashboardRow[];
    avgOpenRatePercent: number | null;
    avgClickRatePercent: number | null;
    avgContentScore: number | null;
    growthScore: number | null;
    brandHealthScore: number | null;
}

export interface GrowthOsFoundationSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    brand: BrandAssetManager;
    content: ContentWorkspace;
    research: AiResearchEngine;
    workflow: WorkflowEngine;
    analytics: AnalyticsFoundation;
}

export interface GrowthOsFoundationRawData {
    organizationId: string;
    membershipRole: string | null;
    logos: Array<{
        id: string;
        logo_name: string;
        logo_variant: string;
        logo_format: string;
        asset_url: string;
        status: string;
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
    }>;
    brandProfiles: Array<{
        id: string;
        profile_name: string;
        brand_tagline: string;
        target_audience: string;
        status: string;
    }>;
    brandKnowledge: Array<{
        id: string;
        knowledge_title: string;
        knowledge_category: string;
        content_ref: string;
        knowledge_status: string;
        status: string;
    }>;
    brandApprovalRules: Array<{
        id: string;
        rule_name: string;
        approval_level: string;
        entity_type: string;
        rule_status: string;
        status: string;
    }>;
    cmpBrandAssets: Array<{
        id: string;
        asset_name: string;
        asset_category: string;
        asset_ref: string;
        status: string;
    }>;
    socialTemplates: Array<{ id: string; template_name: string; template_status: string; status: string }>;
    blogTemplates: Array<{ id: string; template_name: string; template_status: string; status: string }>;
    emailTemplates: Array<{ id: string; template_name: string; template_status: string; status: string }>;
    youtubeTemplates: Array<{ id: string; template_name: string; template_status: string; status: string }>;
    contentCalendar: Array<{
        id: string;
        calendar_name: string;
        content_type: string;
        scheduled_date: string;
        calendar_status: string;
        status: string;
    }>;
    campaigns: Array<{
        id: string;
        campaign_name: string;
        channel_type: string;
        status: string;
        starts_at?: string | null;
        ends_at?: string | null;
    }>;
    drafts: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        priority: string;
        queue_status: string;
        status: string;
        updated_at: string;
    }>;
    approvals: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        approver_ref: string;
        queue_status: string;
        status: string;
        updated_at: string;
    }>;
    publishing: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        publish_date: string;
        queue_status: string;
        status: string;
        updated_at: string;
    }>;
    distributionContent: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        priority: string;
        queue_status: string;
        status: string;
        updated_at: string;
    }>;
    distributionPublishing: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        publish_date: string;
        queue_status: string;
        status: string;
        updated_at: string;
    }>;
    approvalCenter: Array<{
        id: string;
        approval_title: string;
        content_type: string;
        approver_ref: string;
        approval_status: string;
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
    imageAssets: Array<{
        id: string;
        asset_name: string;
        asset_type: string;
        asset_url: string;
        status: string;
    }>;
    industries: Array<{
        id: string;
        industry_name: string;
        vertical: string;
        segment: string;
        status: string;
    }>;
    seoAssistants: Array<{
        id: string;
        assistant_name: string;
        keyword_focus: string;
        search_intent: string;
        assistant_status: string;
        status: string;
    }>;
    ideaGenerators: Array<{
        id: string;
        generator_name: string;
        content_type: string;
        output_format: string;
        generator_status: string;
        status: string;
    }>;
    messaging: Array<{
        id: string;
        messaging_title: string;
        audience_segment: string;
        messaging_type: string;
        status: string;
    }>;
    winLoss: Array<{
        id: string;
        competitor: string;
        outcome: string;
        reason: string;
        amount: number;
        recorded_at: string;
    }>;
    campaignMetrics: Array<{
        id: string;
        campaign_id: string;
        open_rate: number;
        click_rate: number;
        sent_count: number;
        delivered_count: number;
    }>;
    contentPerformance: Array<{
        id: string;
        performance_title: string;
        content_type: string;
        performance_score: number;
        measured_at: string;
    }>;
    growthMetrics: Array<{
        overall_growth_score: number;
        brand_health_score: number;
        marketing_overview_score: number;
    }>;
    auditLogs: Array<{
        id: string;
        entity_type: string;
        action: string;
        summary: string;
        performed_by?: string | null;
        created_at: string;
    }>;
}
