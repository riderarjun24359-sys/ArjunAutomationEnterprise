import { GOF_WORKFLOW_STAGES, type GofWorkflowStage } from "../constants";
import type {
    AiResearchEngine,
    AnalyticsFoundation,
    BrandAssetManager,
    ContentWorkspace,
    GrowthOsFoundationRawData,
    GrowthOsFoundationSnapshot,
    WorkflowEngine,
    WorkflowItem,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    const sum = nums.reduce((a, b) => a + b, 0);
    return Math.round((sum / nums.length) * 10) / 10;
}

function isTypographyGuideline(category: string): boolean {
    const c = category.toLowerCase();
    return c.includes("type") || c.includes("font") || c.includes("typography") || c.includes("voice");
}

/** Map live queue statuses into the Growth OS lifecycle. */
export function mapWorkflowStage(status: string): GofWorkflowStage {
    const s = status.toLowerCase();
    if (s.includes("publish") && !s.includes("schedul")) return "published";
    if (s.includes("schedul") || s.includes("queued")) return "scheduled";
    if (s.includes("approv") && !s.includes("pending") && !s.includes("await")) return "approved";
    if (s.includes("review") || s.includes("pending") || s.includes("await")) return "review";
    if (s.includes("draft") || s.includes("idea") || s.includes("new")) return "draft";
    return "draft";
}

export function roleForStage(stage: GofWorkflowStage): string {
    switch (stage) {
        case "draft":
            return "creator";
        case "review":
            return "manager";
        case "approved":
            return "admin";
        case "scheduled":
            return "publisher";
        case "published":
            return "publisher";
        default:
            return "admin";
    }
}

export const gofPure = {
    avg,
    mapWorkflowStage,
    roleForStage,
    isTypographyGuideline,
};

export function buildBrandAssetManager(data: GrowthOsFoundationRawData): BrandAssetManager {
    const logos = data.logos.map((r) => ({
        id: r.id,
        name: r.logo_name,
        variant: r.logo_variant,
        format: r.logo_format,
        url: r.asset_url,
        status: r.status,
    }));
    const colors = data.colors.map((r) => ({
        id: r.id,
        name: r.color_name,
        primaryHex: r.primary_hex,
        secondaryHex: r.secondary_hex,
        accentHex: r.accent_hex,
        status: r.status,
    }));
    const fonts = data.guidelines
        .filter((g) => isTypographyGuideline(g.guideline_category) || g.guideline_category.toLowerCase() === "visual")
        .map((g) => ({
            id: g.id,
            name: g.guideline_name,
            category: g.guideline_category,
            version: g.version,
            status: g.guideline_status || g.status,
        }));
    const templates = [
        ...data.socialTemplates.map((t) => ({ id: t.id, name: t.template_name, kind: "social", status: t.template_status || t.status })),
        ...data.blogTemplates.map((t) => ({ id: t.id, name: t.template_name, kind: "blog", status: t.template_status || t.status })),
        ...data.emailTemplates.map((t) => ({ id: t.id, name: t.template_name, kind: "email", status: t.template_status || t.status })),
        ...data.youtubeTemplates.map((t) => ({ id: t.id, name: t.template_name, kind: "youtube", status: t.template_status || t.status })),
    ];
    const approvalRules = data.brandApprovalRules.map((r) => ({
        id: r.id,
        name: r.rule_name,
        approvalLevel: r.approval_level,
        entityType: r.entity_type,
        status: r.rule_status || r.status,
    }));
    const library = [
        ...data.brandKnowledge.map((k) => ({
            id: k.id,
            title: k.knowledge_title,
            category: k.knowledge_category,
            ref: k.content_ref,
            status: k.knowledge_status || k.status,
        })),
        ...data.cmpBrandAssets.map((a) => ({
            id: a.id,
            title: a.asset_name,
            category: a.asset_category,
            ref: a.asset_ref,
            status: a.status,
        })),
        ...data.brandProfiles.map((p) => ({
            id: p.id,
            title: p.profile_name,
            category: "profile",
            ref: p.brand_tagline || p.target_audience,
            status: p.status,
        })),
    ];
    const pendingApprovals = approvalRules.filter((r) => {
        const s = r.status.toLowerCase();
        return s.includes("pending") || s === "active";
    }).length;

    return {
        logos,
        colors,
        fonts,
        templates,
        approvalRules,
        library,
        pendingApprovals,
        logoCount: logos.length,
        templateCount: templates.length,
    };
}

export function buildContentWorkspace(data: GrowthOsFoundationRawData): ContentWorkspace {
    const calendar = data.contentCalendar.map((c) => ({
        id: c.id,
        name: c.calendar_name,
        contentType: c.content_type,
        scheduledDate: c.scheduled_date,
        status: c.calendar_status || c.status,
    }));
    const campaigns = data.campaigns.map((c) => ({
        id: c.id,
        name: c.campaign_name,
        channel: c.channel_type,
        status: c.status,
        startsAt: c.starts_at ?? null,
        endsAt: c.ends_at ?? null,
    }));
    const drafts = [
        ...data.drafts.map((d) => ({
            id: d.id,
            title: d.queue_title,
            contentType: d.content_type,
            priority: d.priority,
            status: d.queue_status || d.status,
        })),
        ...data.distributionContent.map((d) => ({
            id: d.id,
            title: d.queue_title,
            contentType: d.content_type,
            priority: d.priority,
            status: d.queue_status || d.status,
        })),
    ];
    const reviews = [
        ...data.approvals.map((a) => ({
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
    const assets = data.imageAssets.map((a) => ({
        id: a.id,
        name: a.asset_name,
        assetType: a.asset_type,
        url: a.asset_url,
        status: a.status,
    }));
    const scheduledCount =
        data.publishing.length +
        data.distributionPublishing.length +
        calendar.filter((c) => mapWorkflowStage(c.status) === "scheduled").length;

    return {
        calendar,
        campaigns,
        drafts,
        reviews,
        assets,
        draftCount: drafts.length,
        reviewCount: reviews.length,
        scheduledCount,
    };
}

export function buildAiResearchEngine(data: GrowthOsFoundationRawData): AiResearchEngine {
    return {
        trends: data.industries.map((i) => ({
            id: i.id,
            name: i.industry_name,
            vertical: i.vertical,
            segment: i.segment,
            status: i.status,
        })),
        competitors: data.winLoss
            .filter((w) => Boolean(w.competitor?.trim()))
            .map((w) => ({
                id: w.id,
                competitor: w.competitor,
                outcome: w.outcome,
                reason: w.reason,
                amount: w.amount,
                recordedAt: w.recorded_at,
            })),
        keywords: data.seoAssistants.map((s) => ({
            id: s.id,
            name: s.assistant_name,
            keywordFocus: s.keyword_focus,
            searchIntent: s.search_intent,
            status: s.assistant_status || s.status,
        })),
        opportunities: data.ideaGenerators.map((g) => ({
            id: g.id,
            name: g.generator_name,
            contentType: g.content_type,
            outputFormat: g.output_format,
            status: g.generator_status || g.status,
        })),
        audiences: data.messaging.map((m) => ({
            id: m.id,
            title: m.messaging_title,
            audienceSegment: m.audience_segment,
            messagingType: m.messaging_type,
            status: m.status,
        })),
        keywordCount: data.seoAssistants.length,
        opportunityCount: data.ideaGenerators.length,
    };
}

export function buildWorkflowEngine(data: GrowthOsFoundationRawData): WorkflowEngine {
    const items: WorkflowItem[] = [];

    for (const d of data.drafts) {
        const stage = mapWorkflowStage(d.queue_status || "draft");
        items.push({
            id: d.id,
            title: d.queue_title,
            contentType: d.content_type,
            stage,
            roleRequired: roleForStage(stage),
            source: "aage_draft_queue",
            updatedAt: d.updated_at,
        });
    }
    for (const a of data.approvals) {
        const stage = mapWorkflowStage(a.queue_status || "review");
        items.push({
            id: a.id,
            title: a.queue_title,
            contentType: a.content_type,
            stage: stage === "draft" ? "review" : stage,
            roleRequired: roleForStage(stage === "draft" ? "review" : stage),
            source: "aage_approval_queue",
            updatedAt: a.updated_at,
        });
    }
    for (const a of data.approvalCenter) {
        const stage = mapWorkflowStage(a.approval_status || "review");
        items.push({
            id: a.id,
            title: a.approval_title,
            contentType: a.content_type,
            stage,
            roleRequired: roleForStage(stage),
            source: "aago_approval_center",
            updatedAt: a.updated_at,
        });
    }
    for (const p of [...data.publishing, ...data.distributionPublishing]) {
        const stage = mapWorkflowStage(p.queue_status || "scheduled");
        items.push({
            id: p.id,
            title: p.queue_title,
            contentType: p.content_type,
            stage: stage === "draft" ? "scheduled" : stage,
            roleRequired: roleForStage(stage === "draft" ? "scheduled" : stage),
            source: "publishing_queue",
            updatedAt: p.updated_at,
        });
    }
    for (const h of data.publishingHistory) {
        items.push({
            id: h.id,
            title: h.history_title,
            contentType: h.content_type,
            stage: "published",
            roleRequired: roleForStage("published"),
            source: "aago_publishing_history",
            updatedAt: h.updated_at || h.published_at,
        });
    }

    const stages = GOF_WORKFLOW_STAGES.map((stage) => ({
        stage,
        count: items.filter((i) => i.stage === stage).length,
    }));

    const roleMap = new Map<string, number>();
    for (const item of items) {
        if (item.stage === "review" || item.stage === "approved") {
            roleMap.set(item.roleRequired, (roleMap.get(item.roleRequired) ?? 0) + 1);
        }
    }

    return {
        items,
        stages,
        auditLog: data.auditLogs.map((a) => ({
            id: a.id,
            entityType: a.entity_type,
            action: a.action,
            summary: a.summary,
            performedBy: a.performed_by ?? null,
            createdAt: a.created_at,
        })),
        roleApprovals: Array.from(roleMap.entries()).map(([role, pending]) => ({ role, pending })),
    };
}

export function buildAnalyticsFoundation(
    data: GrowthOsFoundationRawData,
    campaigns: Array<{ id: string; name: string }>,
): AnalyticsFoundation {
    const campaignName = new Map(campaigns.map((c) => [c.id, c.name]));
    const campaignMetrics = data.campaignMetrics.map((m) => ({
        id: m.id,
        name: campaignName.get(m.campaign_id) ?? m.campaign_id,
        openRate: m.open_rate,
        clickRate: m.click_rate,
        sentCount: m.sent_count,
        deliveredCount: m.delivered_count,
    }));
    const contentPerformance = data.contentPerformance.map((p) => ({
        id: p.id,
        title: p.performance_title,
        contentType: p.content_type,
        score: p.performance_score,
        measuredAt: p.measured_at,
    }));
    const seoDashboard = data.seoAssistants.map((s) => ({
        id: s.id,
        name: s.assistant_name,
        keywordFocus: s.keyword_focus,
        searchIntent: s.search_intent,
        status: s.assistant_status || s.status,
    }));
    const latestGrowth = data.growthMetrics[0];

    return {
        campaignMetrics,
        contentPerformance,
        seoDashboard,
        avgOpenRatePercent: avg(campaignMetrics.map((m) => m.openRate)),
        avgClickRatePercent: avg(campaignMetrics.map((m) => m.clickRate)),
        avgContentScore: avg(contentPerformance.map((p) => p.score)),
        growthScore: latestGrowth ? latestGrowth.overall_growth_score : null,
        brandHealthScore: latestGrowth ? latestGrowth.brand_health_score : null,
    };
}

export function createEmptyGrowthOsFoundationSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): GrowthOsFoundationSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        brand: {
            logos: [],
            colors: [],
            fonts: [],
            templates: [],
            approvalRules: [],
            library: [],
            pendingApprovals: 0,
            logoCount: 0,
            templateCount: 0,
        },
        content: {
            calendar: [],
            campaigns: [],
            drafts: [],
            reviews: [],
            assets: [],
            draftCount: 0,
            reviewCount: 0,
            scheduledCount: 0,
        },
        research: {
            trends: [],
            competitors: [],
            keywords: [],
            opportunities: [],
            audiences: [],
            keywordCount: 0,
            opportunityCount: 0,
        },
        workflow: { items: [], stages: GOF_WORKFLOW_STAGES.map((stage) => ({ stage, count: 0 })), auditLog: [], roleApprovals: [] },
        analytics: {
            campaignMetrics: [],
            contentPerformance: [],
            seoDashboard: [],
            avgOpenRatePercent: null,
            avgClickRatePercent: null,
            avgContentScore: null,
            growthScore: null,
            brandHealthScore: null,
        },
    };
}

export function buildGrowthOsFoundationSnapshot(data: GrowthOsFoundationRawData): GrowthOsFoundationSnapshot {
    const brand = buildBrandAssetManager(data);
    const content = buildContentWorkspace(data);
    const research = buildAiResearchEngine(data);
    const workflow = buildWorkflowEngine(data);
    const analytics = buildAnalyticsFoundation(
        data,
        data.campaigns.map((c) => ({ id: c.id, name: c.campaign_name })),
    );

    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        brand,
        content,
        research,
        workflow,
        analytics,
    };
}
