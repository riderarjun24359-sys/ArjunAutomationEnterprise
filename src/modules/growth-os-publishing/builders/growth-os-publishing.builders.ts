import { GOP_CONNECTOR_SLOTS } from "../constants";
import type {
    CampaignOrchestrator,
    DistributionAnalytics,
    GrowthOsPublishingRawData,
    GrowthOsPublishingSnapshot,
    PublishingScheduler,
    ReleaseManager,
    ScheduleItem,
    SocialDistribution,
    WebsitePublisher,
    WebsitePublishRow,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export function mapConnectorSlot(platform: string): string {
    const p = platform.toLowerCase();
    if (p.includes("linked")) return "linkedin";
    if (p.includes("insta")) return "instagram";
    if (p.includes("face")) return "facebook";
    if (p.includes("twitter") || p === "x") return "x";
    if (p.includes("you")) return "youtube";
    if (p.includes("email") || p.includes("mail")) return "email_esp";
    if (p.includes("blog")) return "blog_cms";
    if (p.includes("web") || p.includes("site")) return "website_cms";
    if (p.includes("sitemap")) return "sitemap";
    return platform.toLowerCase() || "website_cms";
}

export function classifyWebsiteKind(title: string, pageType: string): WebsitePublishRow["kind"] {
    const s = `${title} ${pageType}`.toLowerCase();
    if (s.includes("blog") || s.includes("article") || s.includes("post")) return "blog";
    if (s.includes("case")) return "case_study";
    if (s.includes("knowledge") || s.includes("faq") || s.includes("docs") || s.includes("help")) return "knowledge";
    if (s.includes("landing") || s.includes("product") || s.includes("page")) return "landing";
    return "other";
}

export function timezoneHintFromDate(iso: string): string {
    const hour = Number(String(iso).slice(11, 13));
    if (!Number.isFinite(hour)) return "UTC · review local TZ";
    if (hour >= 13 && hour <= 17) return "UTC · peak B2B window";
    if (hour >= 8 && hour <= 11) return "UTC · morning slot";
    return "UTC · off-peak (confirm local TZ)";
}

export function bestTimeScore(iso: string): number {
    const hour = Number(String(iso).slice(11, 13));
    if (!Number.isFinite(hour)) return 50;
    if (hour >= 14 && hour <= 16) return 92;
    if (hour >= 9 && hour <= 11) return 84;
    if (hour >= 12 && hour <= 13) return 70;
    return 45;
}

export function isRetryEligible(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("fail") || s.includes("error") || s.includes("retry") || s.includes("timeout");
}

export function isFailureRecoverable(status: string): boolean {
    const s = status.toLowerCase();
    return isRetryEligible(s) || s.includes("rate") || s.includes("throttle");
}

export function slugToUtm(slug: string, name: string): { source: string; medium: string; content: string } {
    const base = (slug || name || "campaign").toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40);
    return { source: "growth_os", medium: "campaign", content: base || "release" };
}

export const gopPure = {
    avg,
    mapConnectorSlot,
    classifyWebsiteKind,
    timezoneHintFromDate,
    bestTimeScore,
    isRetryEligible,
    isFailureRecoverable,
    slugToUtm,
};

function approvalItems(data: GrowthOsPublishingRawData) {
    return [
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
}

function pendingCount(items: Array<{ status: string }>): number {
    return items.filter((a) => {
        const s = a.status.toLowerCase();
        return s.includes("pending") || s.includes("review") || s.includes("await");
    }).length;
}

export function buildCampaignOrchestrator(data: GrowthOsPublishingRawData): CampaignOrchestrator {
    const campaigns = data.campaigns.map((c) => ({
        id: c.id,
        name: c.campaign_name,
        channel: c.channel_type,
        status: c.status,
        startsAt: c.starts_at ?? null,
        endsAt: c.ends_at ?? null,
        source: "cnh_campaigns",
    }));
    const templates = [
        ...data.emailTemplates.map((e) => ({
            id: e.id,
            name: e.template_name,
            campaignType: e.campaign_type,
            status: e.template_status || e.status,
        })),
        ...data.campaignBuilders.map((b) => ({
            id: b.id,
            name: b.builder_name,
            campaignType: b.campaign_type,
            status: b.builder_status || b.status,
        })),
    ];

    const timeline = [
        ...campaigns.flatMap((c) => {
            const events = [];
            if (c.startsAt) {
                events.push({
                    id: `${c.id}-start`,
                    campaignId: c.id,
                    campaignName: c.name,
                    at: c.startsAt,
                    label: "Campaign start",
                    kind: "start" as const,
                });
            }
            if (c.endsAt) {
                events.push({
                    id: `${c.id}-end`,
                    campaignId: c.id,
                    campaignName: c.name,
                    at: c.endsAt,
                    label: "Campaign end",
                    kind: "end" as const,
                });
            }
            return events;
        }),
        ...data.distPublishing.map((p) => ({
            id: `${p.id}-publish`,
            campaignId: p.id,
            campaignName: p.queue_title,
            at: p.publish_date,
            label: "Scheduled publish",
            kind: "publish" as const,
        })),
        ...approvalItems(data).map((a) => ({
            id: `${a.id}-approval`,
            campaignId: a.id,
            campaignName: a.title,
            at: "",
            label: `Approval · ${a.status}`,
            kind: "approval" as const,
        })),
    ];

    const multiChannelPlans = campaigns.map((c) => {
        const related = data.channels
            .filter((ch) => ch.platform.toLowerCase().includes(c.channel.toLowerCase().slice(0, 4)) || c.channel)
            .map((ch) => ch.platform);
        const channels = [...new Set([c.channel, ...related])].filter(Boolean);
        return { campaignId: c.id, name: c.name, channels };
    });

    const approvalQueue = approvalItems(data);
    return {
        campaigns,
        templates,
        timeline,
        multiChannelPlans,
        pendingApprovals: pendingCount(approvalQueue),
        approvalQueue,
    };
}

export function buildPublishingScheduler(data: GrowthOsPublishingRawData): PublishingScheduler {
    const fromQueues = [
        ...data.aagePublishing.map((p) => ({
            id: p.id,
            title: p.queue_title,
            contentType: p.content_type,
            publishAt: p.publish_date,
            status: p.queue_status || p.status,
            source: "aage_publishing_queue",
        })),
        ...data.distPublishing.map((p) => ({
            id: p.id,
            title: p.queue_title,
            contentType: p.content_type,
            publishAt: p.publish_date,
            status: p.queue_status || p.status,
            source: "aago_distribution_publishing_queue",
        })),
        ...data.contentCalendar.map((c) => ({
            id: c.id,
            title: c.calendar_name,
            contentType: c.content_type,
            publishAt: c.scheduled_date,
            status: c.calendar_status || c.status,
            source: "aage_content_calendar",
        })),
    ];

    const queue: ScheduleItem[] = fromQueues.map((p) => ({
        ...p,
        timezoneHint: timezoneHintFromDate(p.publishAt),
        bestTimeScore: bestTimeScore(p.publishAt),
        retryEligible: isRetryEligible(p.status),
    }));

    const history = data.publishingHistory.map((h) => ({
        id: h.id,
        title: h.history_title,
        contentType: h.content_type,
        publishedAt: h.published_at,
        status: h.history_status || h.status,
    }));

    const liveRecs = [...queue]
        .sort((a, b) => (b.bestTimeScore ?? 0) - (a.bestTimeScore ?? 0))
        .slice(0, 5)
        .map((q) => ({
            slot: q.publishAt || "unscheduled",
            reason: `${q.title} · ${q.timezoneHint}`,
            score: q.bestTimeScore ?? 50,
        }));

    return {
        queue,
        calendar: [...queue].sort((a, b) => String(a.publishAt).localeCompare(String(b.publishAt))),
        history,
        bestTimeRecommendations: liveRecs,
        retryQueue: queue.filter((q) => q.retryEligible),
    };
}

export function buildWebsitePublisher(data: GrowthOsPublishingRawData): WebsitePublisher {
    const pages: WebsitePublishRow[] = [
        ...data.blogTemplates.map((b) => ({
            id: b.id,
            title: b.template_name,
            kind: "blog" as const,
            seoFocus: b.content_type,
            status: b.template_status || b.status,
            metaSynced: data.seoAssistants.length > 0,
            sitemapTrigger: (b.template_status || b.status).toLowerCase().includes("publish"),
        })),
        ...data.websiteTemplates.map((w) => ({
            id: w.id,
            title: w.template_name,
            kind: classifyWebsiteKind(w.template_name, w.page_type),
            seoFocus: w.seo_focus,
            status: w.template_status || w.status,
            metaSynced: Boolean(w.seo_focus?.trim()),
            sitemapTrigger: (w.template_status || w.status).toLowerCase().includes("publish"),
        })),
        ...data.caseStudyTemplates.map((c) => ({
            id: c.id,
            title: c.template_name,
            kind: "case_study" as const,
            seoFocus: c.industry,
            status: c.template_status || c.status,
            metaSynced: Boolean(c.industry?.trim()),
            sitemapTrigger: (c.template_status || c.status).toLowerCase().includes("publish"),
        })),
        ...data.websitePages.map((p) => ({
            id: p.id,
            title: p.page_title,
            kind: classifyWebsiteKind(p.page_title, p.page_slug),
            seoFocus: p.page_slug,
            status: p.page_status || p.status,
            metaSynced: Boolean(p.page_slug?.trim()),
            sitemapTrigger: (p.page_status || p.status).toLowerCase().includes("publish"),
        })),
    ];

    // Knowledge: website pages classified as knowledge + seo assistants as KB sync targets
    const knowledgeFromSeo = data.seoAssistants.map((s) => ({
        id: s.id,
        title: s.assistant_name,
        kind: "knowledge" as const,
        seoFocus: s.keyword_focus,
        status: s.assistant_status || s.status,
        metaSynced: Boolean(s.keyword_focus?.trim()),
        sitemapTrigger: false,
    }));

    const all = [...pages, ...knowledgeFromSeo];
    return {
        pages: all,
        blogs: all.filter((p) => p.kind === "blog"),
        landings: all.filter((p) => p.kind === "landing"),
        caseStudies: all.filter((p) => p.kind === "case_study"),
        knowledge: all.filter((p) => p.kind === "knowledge"),
        seoSyncCount: all.filter((p) => p.metaSynced).length,
        sitemapTriggers: all.filter((p) => p.sitemapTrigger).length,
    };
}

export function buildSocialDistribution(data: GrowthOsPublishingRawData): SocialDistribution {
    const channels = data.channels.map((c) => {
        const slot = mapConnectorSlot(c.platform);
        return {
            id: c.id,
            name: c.channel_name,
            platform: c.platform,
            postType: c.post_type,
            status: c.channel_status || c.status,
            connectorSlot: slot,
            rateLimitAware: true,
        };
    });

    const bound = new Set(channels.map((c) => c.connectorSlot));
    const connectorSlots = GOP_CONNECTOR_SLOTS.map((slot) => ({
        slot,
        status: (bound.has(slot) ||
        (slot === "website_cms" && data.websitePages.length > 0) ||
        (slot === "blog_cms" && data.blogTemplates.length > 0) ||
        (slot === "email_esp" && data.emailTemplates.length > 0) ||
        (slot === "sitemap" && data.seoAssistants.length > 0)
            ? "bound"
            : "unbound") as "bound" | "unbound",
    }));

    const queue = [
        ...data.distContent.map((d) => ({
            id: d.id,
            title: d.queue_title,
            contentType: d.content_type,
            status: d.queue_status || d.status,
            mediaAttached: d.priority.toLowerCase() !== "low",
            failureRecoverable: isFailureRecoverable(d.queue_status || d.status),
        })),
        ...data.distPublishing.map((d) => ({
            id: d.id,
            title: d.queue_title,
            contentType: d.content_type,
            status: d.queue_status || d.status,
            mediaAttached: true,
            failureRecoverable: isFailureRecoverable(d.queue_status || d.status),
        })),
    ];

    const statusMap = new Map<string, number>();
    for (const item of queue) {
        statusMap.set(item.status, (statusMap.get(item.status) ?? 0) + 1);
    }

    return {
        channels,
        queue,
        connectorSlots,
        statusBreakdown: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
    };
}

export function buildReleaseManager(data: GrowthOsPublishingRawData): ReleaseManager {
    const releases = data.campaignDashboards.map((d, idx) => {
        const relatedChannels = data.channels.map((c) => c.platform).slice(0, 4);
        const status = d.dashboard_status || d.status;
        return {
            id: d.id,
            name: d.dashboard_name || d.campaign_ref || `Release ${idx + 1}`,
            version: `r${idx + 1}.0`,
            channels: relatedChannels.length ? relatedChannels : ["website", "email", "social"],
            status,
            rollbackAvailable: status.toLowerCase().includes("active") || status.toLowerCase().includes("publish"),
            updatedAt: "",
        };
    });

    // Supplement with publishing history as versioned releases
    const historyReleases = data.publishingHistory.slice(0, 20).map((h, idx) => ({
        id: h.id,
        name: h.history_title,
        version: `h${idx + 1}`,
        channels: [h.content_type],
        status: h.history_status || h.status,
        rollbackAvailable: true,
        updatedAt: h.updated_at || h.published_at,
    }));

    const approvalQueue = approvalItems(data);
    return {
        releases: [...releases, ...historyReleases],
        auditTrail: data.auditLogs.map((a) => ({
            id: a.id,
            entityType: a.entity_type,
            action: a.action,
            summary: a.summary,
            at: a.created_at,
        })),
        pendingApprovals: pendingCount(approvalQueue),
    };
}

export function buildDistributionAnalytics(data: GrowthOsPublishingRawData): DistributionAnalytics {
    const campaignName = new Map(data.campaigns.map((c) => [c.id, c.campaign_name]));

    const delivered = data.campaignDeliveries.filter((d) => {
        const s = d.status.toLowerCase();
        return s.includes("deliver") || s.includes("success") || s.includes("sent");
    }).length;
    const successRatePercent =
        data.campaignDeliveries.length === 0
            ? avg(data.distributionAnalytics.map((a) => a.analytics_score))
            : Math.round((delivered / data.campaignDeliveries.length) * 1000) / 10;

    const channelMap = new Map<string, { deliveries: number; openRate: number; clickRate: number; n: number }>();
    for (const c of data.campaigns) {
        const metrics = data.campaignMetrics.filter((m) => m.campaign_id === c.id);
        const deliveries = data.campaignDeliveries.filter((d) => d.campaign_id === c.id).length;
        const openRate = avg(metrics.map((m) => m.open_rate)) ?? 0;
        const clickRate = avg(metrics.map((m) => m.click_rate)) ?? 0;
        const prev = channelMap.get(c.channel_type) ?? { deliveries: 0, openRate: 0, clickRate: 0, n: 0 };
        channelMap.set(c.channel_type, {
            deliveries: prev.deliveries + deliveries,
            openRate: prev.openRate + openRate,
            clickRate: prev.clickRate + clickRate,
            n: prev.n + 1,
        });
    }

    const clickTracking = data.campaignMetrics.map((m) => ({
        id: m.id,
        name: campaignName.get(m.campaign_id) ?? m.campaign_id,
        clicks: Math.round((m.click_rate / 100) * Math.max(m.delivered_count, m.sent_count, 0)),
    }));

    const utmCatalog = data.campaigns.map((c) => {
        const utm = slugToUtm(c.channel_type, c.campaign_name);
        return {
            id: c.id,
            campaign: c.campaign_name,
            source: utm.source,
            medium: utm.medium,
            content: utm.content,
        };
    });

    return {
        deliveryStatus: data.distributionAnalytics.map((a) => ({
            id: a.id,
            name: a.analytics_name,
            score: a.analytics_score,
            type: a.analytics_type,
            measuredAt: a.measured_at,
        })),
        successRatePercent,
        channelPerformance: Array.from(channelMap.entries()).map(([channel, v]) => ({
            channel,
            deliveries: v.deliveries,
            openRate: v.n ? Math.round((v.openRate / v.n) * 10) / 10 : 0,
            clickRate: v.n ? Math.round((v.clickRate / v.n) * 10) / 10 : 0,
        })),
        clickTracking,
        utmCatalog,
        attribution: data.attributions.map((a) => ({
            id: a.id,
            title: a.attribution_title,
            channel: a.channel_ref,
            conversionRate: a.conversion_rate,
            status: a.attribution_status || a.status,
        })),
    };
}

export function createEmptyGrowthOsPublishingSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): GrowthOsPublishingSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        campaigns: {
            campaigns: [],
            templates: [],
            timeline: [],
            multiChannelPlans: [],
            pendingApprovals: 0,
            approvalQueue: [],
        },
        scheduler: {
            queue: [],
            calendar: [],
            history: [],
            bestTimeRecommendations: [],
            retryQueue: [],
        },
        website: {
            pages: [],
            blogs: [],
            landings: [],
            caseStudies: [],
            knowledge: [],
            seoSyncCount: 0,
            sitemapTriggers: 0,
        },
        social: {
            channels: [],
            queue: [],
            connectorSlots: GOP_CONNECTOR_SLOTS.map((slot) => ({ slot, status: "unbound" })),
            statusBreakdown: [],
        },
        releases: { releases: [], auditTrail: [], pendingApprovals: 0 },
        analytics: {
            deliveryStatus: [],
            successRatePercent: null,
            channelPerformance: [],
            clickTracking: [],
            utmCatalog: [],
            attribution: [],
        },
    };
}

export function buildGrowthOsPublishingSnapshot(data: GrowthOsPublishingRawData): GrowthOsPublishingSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        campaigns: buildCampaignOrchestrator(data),
        scheduler: buildPublishingScheduler(data),
        website: buildWebsitePublisher(data),
        social: buildSocialDistribution(data),
        releases: buildReleaseManager(data),
        analytics: buildDistributionAnalytics(data),
    };
}
