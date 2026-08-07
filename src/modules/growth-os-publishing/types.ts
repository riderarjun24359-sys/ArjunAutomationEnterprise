export interface CampaignRow {
    id: string;
    name: string;
    channel: string;
    status: string;
    startsAt: string | null;
    endsAt: string | null;
    source: string;
}

export interface CampaignTemplateRow {
    id: string;
    name: string;
    campaignType: string;
    status: string;
}

export interface TimelineEvent {
    id: string;
    campaignId: string;
    campaignName: string;
    at: string;
    label: string;
    kind: "start" | "end" | "publish" | "approval";
}

export interface CampaignOrchestrator {
    campaigns: CampaignRow[];
    templates: CampaignTemplateRow[];
    timeline: TimelineEvent[];
    multiChannelPlans: Array<{ campaignId: string; name: string; channels: string[] }>;
    pendingApprovals: number;
    approvalQueue: Array<{ id: string; title: string; contentType: string; approverRef: string; status: string }>;
}

export interface ScheduleItem {
    id: string;
    title: string;
    contentType: string;
    publishAt: string;
    status: string;
    timezoneHint: string;
    bestTimeScore: number | null;
    retryEligible: boolean;
    source: string;
}

export interface PublishingScheduler {
    queue: ScheduleItem[];
    calendar: ScheduleItem[];
    history: Array<{ id: string; title: string; contentType: string; publishedAt: string; status: string }>;
    bestTimeRecommendations: Array<{ slot: string; reason: string; score: number }>;
    retryQueue: ScheduleItem[];
}

export interface WebsitePublishRow {
    id: string;
    title: string;
    kind: "blog" | "landing" | "case_study" | "knowledge" | "other";
    seoFocus: string;
    status: string;
    metaSynced: boolean;
    sitemapTrigger: boolean;
}

export interface WebsitePublisher {
    pages: WebsitePublishRow[];
    blogs: WebsitePublishRow[];
    landings: WebsitePublishRow[];
    caseStudies: WebsitePublishRow[];
    knowledge: WebsitePublishRow[];
    seoSyncCount: number;
    sitemapTriggers: number;
}

export interface SocialChannelRow {
    id: string;
    name: string;
    platform: string;
    postType: string;
    status: string;
    connectorSlot: string;
    rateLimitAware: boolean;
}

export interface SocialQueueRow {
    id: string;
    title: string;
    contentType: string;
    status: string;
    mediaAttached: boolean;
    failureRecoverable: boolean;
}

export interface SocialDistribution {
    channels: SocialChannelRow[];
    queue: SocialQueueRow[];
    connectorSlots: Array<{ slot: string; status: "bound" | "unbound" }>;
    statusBreakdown: Array<{ status: string; count: number }>;
}

export interface ReleaseRow {
    id: string;
    name: string;
    version: string;
    channels: string[];
    status: string;
    rollbackAvailable: boolean;
    updatedAt: string;
}

export interface ReleaseManager {
    releases: ReleaseRow[];
    auditTrail: Array<{ id: string; entityType: string; action: string; summary: string; at: string }>;
    pendingApprovals: number;
}

export interface DistributionAnalytics {
    deliveryStatus: Array<{ id: string; name: string; score: number; type: string; measuredAt: string }>;
    successRatePercent: number | null;
    channelPerformance: Array<{ channel: string; deliveries: number; openRate: number; clickRate: number }>;
    clickTracking: Array<{ id: string; name: string; clicks: number }>;
    utmCatalog: Array<{ id: string; campaign: string; source: string; medium: string; content: string }>;
    attribution: Array<{ id: string; title: string; channel: string; conversionRate: number; status: string }>;
}

export interface GrowthOsPublishingSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    campaigns: CampaignOrchestrator;
    scheduler: PublishingScheduler;
    website: WebsitePublisher;
    social: SocialDistribution;
    releases: ReleaseManager;
    analytics: DistributionAnalytics;
}

export interface GrowthOsPublishingRawData {
    organizationId: string;
    membershipRole: string | null;
    campaigns: Array<{
        id: string;
        campaign_name: string;
        channel_type: string;
        status: string;
        starts_at?: string | null;
        ends_at?: string | null;
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
    campaignDashboards: Array<{
        id: string;
        dashboard_name: string;
        dashboard_status: string;
        campaign_ref: string;
        refresh_cadence: string;
        status: string;
    }>;
    emailTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        campaign_type: string;
        status: string;
    }>;
    contentCalendar: Array<{
        id: string;
        calendar_name: string;
        calendar_status: string;
        scheduled_date: string;
        content_type: string;
        status: string;
        updated_at: string;
    }>;
    aagePublishing: Array<{
        id: string;
        queue_title: string;
        queue_status: string;
        content_type: string;
        publish_date: string;
        status: string;
        updated_at: string;
    }>;
    distPublishing: Array<{
        id: string;
        queue_title: string;
        queue_status: string;
        content_type: string;
        publish_date: string;
        status: string;
        updated_at: string;
    }>;
    distContent: Array<{
        id: string;
        queue_title: string;
        queue_status: string;
        content_type: string;
        priority: string;
        status: string;
        updated_at: string;
    }>;
    publishingHistory: Array<{
        id: string;
        history_title: string;
        history_status: string;
        content_type: string;
        published_at: string;
        status: string;
        updated_at: string;
    }>;
    channels: Array<{
        id: string;
        channel_name: string;
        channel_status: string;
        platform: string;
        post_type: string;
        status: string;
    }>;
    blogTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        content_type: string;
        status: string;
    }>;
    websiteTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        page_type: string;
        seo_focus: string;
        status: string;
    }>;
    caseStudyTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        industry: string;
        status: string;
    }>;
    websitePages: Array<{
        id: string;
        page_title: string;
        page_slug: string;
        page_status: string;
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
    campaignMetrics: Array<{
        id: string;
        campaign_id: string;
        open_rate: number;
        click_rate: number;
        sent_count: number;
        delivered_count: number;
    }>;
    campaignDeliveries: Array<{
        id: string;
        campaign_id: string;
        status: string;
        delivered_at?: string | null;
    }>;
    distributionAnalytics: Array<{
        id: string;
        analytics_name: string;
        analytics_score: number;
        analytics_type: string;
        measured_at: string;
        status: string;
    }>;
    attributions: Array<{
        id: string;
        attribution_title: string;
        channel_ref: string;
        conversion_rate: number;
        attribution_status: string;
        status: string;
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
    auditLogs: Array<{
        id: string;
        entity_type: string;
        action: string;
        summary: string;
        created_at: string;
    }>;
}
