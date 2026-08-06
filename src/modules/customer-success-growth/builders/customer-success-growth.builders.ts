import { customerSuccessGrowthDeniedMessage } from "../access";
import type {
    CustomerEducation,
    CustomerSuccessGrowthRawData,
    CustomerSuccessGrowthSnapshot,
    FounderDailyBrief,
    ReferralEngine,
    SuccessMonitoring,
    TestimonialCenter,
} from "../types";

function isComplete(status: string): boolean {
    const s = status.toLowerCase();
    return (
        s.includes("complete") ||
        s.includes("done") ||
        s.includes("won") ||
        s.includes("closed") ||
        s.includes("qualified") ||
        s.includes("paid")
    );
}

function isActive(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("active") || s.includes("progress") || s.includes("running") || s.includes("open") || s.includes("pending");
}

function isFailed(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("fail") || s.includes("stuck") || s.includes("churn") || s.includes("cancel") || s.includes("risk");
}

function isReferral(source: string): boolean {
    return source.toLowerCase().includes("refer");
}

function isPendingReward(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("pending") || s.includes("owed") || s.includes("accrued") || s.includes("open");
}

function isPendingApproval(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("pending") || s.includes("review") || s.includes("await") || s.includes("draft");
}

function isOpenTicket(status: string): boolean {
    const s = status.toLowerCase();
    return !(s.includes("closed") || s.includes("resolved") || s.includes("done"));
}

function daysBetween(start: string, end: string): number | null {
    const a = Date.parse(start);
    const b = Date.parse(end);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null;
    return Math.round(((b - a) / (24 * 60 * 60 * 1000)) * 10) / 10;
}

function startOfTodayMs(): number {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function npsFromRatings(ratings: number[]): number | null {
    if (!ratings.length) return null;
    const promoters = ratings.filter((r) => r >= 4).length;
    const detractors = ratings.filter((r) => r <= 2).length;
    return Math.round(((promoters - detractors) / ratings.length) * 100);
}

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function emptyMonitoring(): SuccessMonitoring {
    return {
        onboardingToday: [],
        funnel: [],
        timeToValue: [],
        avgTimeToValueDays: null,
        featureAdoption: [],
        averageAdoptionPercent: null,
        activeOnboardingCount: 0,
        completedOnboardingCount: 0,
    };
}

function emptyReferrals(): ReferralEngine {
    return {
        workflowSteps: [],
        referrals: [],
        rewards: [],
        totalReferralLeads: 0,
        convertedReferrals: 0,
        conversionRatePercent: null,
        pendingRewards: 0,
        totalRewardValue: 0,
    };
}

function emptyTestimonials(): TestimonialCenter {
    return {
        reviewRequests: [],
        successStories: [],
        caseStudies: [],
        approvals: [],
        pendingApprovals: 0,
        averageRating: null,
        npsProxy: null,
    };
}

function emptyEducation(): CustomerEducation {
    return {
        tours: [],
        videos: [],
        knowledgeBase: [],
        checklists: [],
        trainingPortals: [],
        averageLearningProgressPercent: null,
    };
}

function emptyBrief(): FounderDailyBrief {
    return {
        summary: "",
        briefingRows: [],
        newOrganizationsToday: 0,
        newOrganizations7d: 0,
        revenueMrrUsd: 0,
        revenueNewMrrUsd: 0,
        openSupportTickets: 0,
        supportSatisfactionAvg: null,
        productUsageAdoptionPercent: null,
        risks: [],
        insights: [],
    };
}

export function createEmptyCustomerSuccessGrowthSnapshot(
    accessGranted: boolean,
    reason?: string,
): CustomerSuccessGrowthSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason ?? (accessGranted ? undefined : customerSuccessGrowthDeniedMessage()),
        fetchedAt: new Date().toISOString(),
        monitoring: emptyMonitoring(),
        referrals: emptyReferrals(),
        testimonials: emptyTestimonials(),
        education: emptyEducation(),
        brief: emptyBrief(),
    };
}

export function buildSuccessMonitoring(data: CustomerSuccessGrowthRawData): SuccessMonitoring {
    const todayStart = startOfTodayMs();
    const workflows = data.onboardingWorkflows.map((w) => ({
        id: w.id,
        name: w.name,
        status: w.status,
        source: "cs_onboarding",
        updatedAt: w.updated_at,
    }));
    const automations = data.onboardingAutomation.map((a) => ({
        id: a.id,
        name: a.automation_name,
        status: a.automation_status || a.status,
        source: "csd_automation",
        updatedAt: a.updated_at,
    }));
    const onboardingToday = [...workflows, ...automations].filter((r) => Date.parse(r.updatedAt) >= todayStart);

    const invited = data.onboardingAutomation.length + data.onboardingWorkflows.length;
    const started = [...data.onboardingAutomation, ...data.onboardingWorkflows].filter((r) =>
        isActive("automation_status" in r ? r.automation_status : r.status) ||
            isComplete("automation_status" in r ? r.automation_status : r.status),
    ).length;
    const activated = data.milestones.filter((m) => isComplete(m.milestone_status) || isComplete(m.status)).length;
    const valued = data.adoptionTracking.filter((a) => a.adoption_percent >= 40 || isComplete(a.status)).length;

    const funnelCounts = [
        { stage: "Invited / provisioned", count: invited },
        { stage: "Onboarding started", count: started },
        { stage: "First milestone", count: activated },
        { stage: "Value realized (≥40% adoption)", count: valued },
    ];
    const funnel = funnelCounts.map((stage, idx) => {
        const prev = idx === 0 ? null : funnelCounts[idx - 1].count;
        const conversionFromPreviousPercent =
            prev && prev > 0 ? Math.round((stage.count / prev) * 1000) / 10 : idx === 0 ? null : 0;
        return { ...stage, conversionFromPreviousPercent };
    });

    const timeToValue = data.milestones.map((m) => {
        const completedAt = m.completed_at ?? (isComplete(m.milestone_status) ? m.updated_at : null);
        return {
            id: m.id,
            name: m.milestone_name,
            daysToValue: completedAt ? daysBetween(m.created_at, completedAt) : null,
            status: m.milestone_status || m.status,
            startedAt: m.created_at,
            completedAt,
        };
    });
    const ttvValues = timeToValue.map((t) => t.daysToValue).filter((n): n is number => n != null);

    const featureAdoption = [
        ...data.adoptionAnalytics.map((a) => ({
            feature: a.feature_name,
            adoptionRate: a.adoption_rate,
            status: a.status,
            measuredAt: a.measured_at || a.metric_date,
        })),
        ...data.productAdoption.map((p) => ({
            feature: p.module_name,
            adoptionRate: p.adoption_percent,
            status: p.status,
            measuredAt: p.updated_at,
        })),
        ...data.adoptionTracking.map((a) => ({
            feature: a.name,
            adoptionRate: a.adoption_percent,
            status: a.status,
            measuredAt: a.updated_at,
        })),
    ];

    const allStatuses = [...workflows, ...automations];
    return {
        onboardingToday,
        funnel,
        timeToValue,
        avgTimeToValueDays: avg(ttvValues),
        featureAdoption,
        averageAdoptionPercent: avg(featureAdoption.map((f) => f.adoptionRate)),
        activeOnboardingCount: allStatuses.filter((r) => isActive(r.status) && !isComplete(r.status)).length,
        completedOnboardingCount: allStatuses.filter((r) => isComplete(r.status)).length,
    };
}

export function buildReferralEngine(data: CustomerSuccessGrowthRawData): ReferralEngine {
    const referrals = data.salesLeads
        .filter((l) => isReferral(l.source))
        .map((l) => ({
            id: l.id,
            name: l.lead_name,
            company: l.company_name,
            email: l.email,
            source: l.source,
            status: l.status,
            score: l.score,
            createdAt: l.created_at,
        }));

    const convertedReferrals = referrals.filter((r) => isComplete(r.status) || r.status.toLowerCase().includes("qualified")).length;
    const rewards = [
        ...data.salesCommissions.map((c) => ({
            id: c.id,
            label: "Referral commission",
            amountOrPoints: c.commission_amount,
            status: c.status,
            kind: "commission" as const,
            recordedAt: c.calculated_at || c.created_at,
        })),
        ...data.rewardPoints.map((r) => ({
            id: r.id,
            label: r.points_name,
            amountOrPoints: r.points_balance,
            status: r.status,
            kind: "points" as const,
            recordedAt: r.earned_at,
        })),
    ];

    const workflowSteps = [
        { step: "Refer a business", count: referrals.length, detail: "Sales leads tagged with referral source" },
        {
            step: "Track referral",
            count: referrals.filter((r) => isActive(r.status)).length,
            detail: "Active / in-progress referral leads",
        },
        { step: "Convert", count: convertedReferrals, detail: "Qualified or won referral outcomes" },
        {
            step: "Reward",
            count: rewards.filter((r) => isPendingReward(r.status) || isComplete(r.status)).length,
            detail: "Commissions + reward points",
        },
    ];

    return {
        workflowSteps,
        referrals,
        rewards,
        totalReferralLeads: referrals.length,
        convertedReferrals,
        conversionRatePercent: referrals.length ? Math.round((convertedReferrals / referrals.length) * 1000) / 10 : null,
        pendingRewards: rewards.filter((r) => isPendingReward(r.status)).length,
        totalRewardValue: Math.round(rewards.reduce((sum, r) => sum + r.amountOrPoints, 0) * 100) / 100,
    };
}

export function buildTestimonialCenter(data: CustomerSuccessGrowthRawData): TestimonialCenter {
    const reviewRequests = data.feedback.map((f) => ({
        id: f.id,
        title: f.feedback_title,
        type: f.feedback_type,
        rating: f.rating,
        status: f.status,
        collectedAt: f.collected_at,
    }));

    const successStories = data.satisfaction
        .filter((s) => s.rating >= 4 && (s.comment || "").trim().length > 0)
        .map((s) => ({
            id: s.id,
            title: s.comment.slice(0, 80) || `Rating ${s.rating}`,
            rating: s.rating,
            comment: s.comment,
            submittedAt: s.submitted_at,
        }));

    const caseStudies = data.caseStudies.map((c) => ({
        id: c.id,
        name: c.template_name,
        industry: c.industry,
        outcomeType: c.outcome_type,
        status: c.template_status || c.status,
        updatedAt: c.updated_at,
    }));

    const approvals = data.approvals.map((a) => ({
        id: a.id,
        title: a.queue_title,
        contentType: a.content_type,
        queueStatus: a.queue_status,
        status: a.status,
        updatedAt: a.updated_at,
    }));

    const ratings = [
        ...data.feedback.map((f) => f.rating).filter((n) => Number.isFinite(n) && n > 0),
        ...data.satisfaction.map((s) => s.rating).filter((n) => Number.isFinite(n) && n > 0),
    ];

    return {
        reviewRequests,
        successStories,
        caseStudies,
        approvals,
        pendingApprovals: approvals.filter((a) => isPendingApproval(a.queueStatus) || isPendingApproval(a.status)).length,
        averageRating: avg(ratings),
        npsProxy: npsFromRatings(ratings),
    };
}

export function buildCustomerEducation(data: CustomerSuccessGrowthRawData): CustomerEducation {
    return {
        tours: data.productTours.map((t) => ({
            id: t.id,
            name: t.tour_name,
            type: t.tour_type,
            stepCount: t.step_count,
            status: t.status,
        })),
        videos: data.videos.map((v) => ({
            id: v.id,
            title: v.video_title,
            category: v.video_category,
            durationMinutes: v.duration_minutes,
            status: v.status,
        })),
        knowledgeBase: data.knowledgeArticles.map((k) => ({
            id: k.id,
            title: k.article_title,
            category: k.article_category,
            summary: k.article_summary,
            status: k.status,
            publishedAt: k.published_at ?? null,
        })),
        checklists: data.checklists.map((c) => ({
            id: c.id,
            name: c.name,
            completionPercent: c.completion_percent,
            status: c.status,
            itemCount: Array.isArray(c.items) ? c.items.length : 0,
        })),
        trainingPortals: data.trainingPortals.map((p) => ({
            id: p.id,
            name: p.portal_name,
            courseCount: p.course_count,
            status: p.status,
        })),
        averageLearningProgressPercent: avg(data.learningProgress.map((p) => p.progress_percent)),
    };
}

export function buildFounderDailyBrief(data: CustomerSuccessGrowthRawData): FounderDailyBrief {
    const todayStart = startOfTodayMs();
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
    const newOrganizationsToday = data.organizations.filter((o) => Date.parse(o.created_at) >= todayStart).length;
    const newOrganizations7d = data.organizations.filter((o) => Date.parse(o.created_at) >= weekStart).length;

    const latestMrr = [...data.mrrSnapshots].sort((a, b) => Date.parse(b.snapshot_date) - Date.parse(a.snapshot_date))[0];
    const openSupportTickets =
        data.supportTickets.filter((t) => isOpenTicket(t.ticket_status) || isOpenTicket(t.status)).length ||
        data.operationsMetrics[0]?.open_ticket_count ||
        0;

    const productUsageAdoptionPercent =
        avg([
            ...data.adoptionTracking.map((a) => a.adoption_percent),
            ...data.productAdoption.map((p) => p.adoption_percent),
            ...data.operationsMetrics.map((m) => m.adoption_rate),
        ]) ?? null;

    const risks = [
        ...data.csRisks
            .filter((r) => isFailed(r.risk_level) || isActive(r.status) || r.risk_level.toLowerCase().includes("high"))
            .map((r) => ({
                id: r.id,
                title: r.name,
                level: r.risk_level,
                status: r.status,
                source: "cs_risk",
            })),
        ...data.founderRisks
            .filter((r) => isFailed(r.risk_level) || isActive(r.status) || r.risk_level.toLowerCase().includes("high"))
            .map((r) => ({
                id: r.id,
                title: r.title,
                level: r.risk_level,
                status: r.status,
                source: "founder_risk",
            })),
    ];

    const briefingRows = data.briefings.map((b) => ({
        id: b.id,
        title: b.briefing_title,
        type: b.briefing_type,
        date: b.briefing_date,
        summary: b.summary,
    }));

    const insights = data.founderInsights.map((i) => ({
        id: i.id,
        title: i.title,
        type: i.insight_type,
        content: i.content,
    }));

    const summaryParts = [
        `New orgs today ${newOrganizationsToday} (7d ${newOrganizations7d}).`,
        `MRR $${latestMrr?.mrr_usd ?? 0} (new $${latestMrr?.new_mrr_usd ?? 0}).`,
        `Open support ${openSupportTickets}.`,
        `Adoption ${productUsageAdoptionPercent ?? "n/a"}%.`,
        `Risks needing attention ${risks.length}.`,
    ];

    return {
        summary: summaryParts.join(" "),
        briefingRows,
        newOrganizationsToday,
        newOrganizations7d,
        revenueMrrUsd: latestMrr?.mrr_usd ?? 0,
        revenueNewMrrUsd: latestMrr?.new_mrr_usd ?? 0,
        openSupportTickets,
        supportSatisfactionAvg: avg(data.satisfaction.map((s) => s.rating)),
        productUsageAdoptionPercent,
        risks,
        insights,
    };
}

export function buildCustomerSuccessGrowthSnapshot(data: CustomerSuccessGrowthRawData): CustomerSuccessGrowthSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        monitoring: buildSuccessMonitoring(data),
        referrals: buildReferralEngine(data),
        testimonials: buildTestimonialCenter(data),
        education: buildCustomerEducation(data),
        brief: buildFounderDailyBrief(data),
    };
}

/** Pure helpers exported for unit verification (deterministic; no mocks). */
export const csgPure = {
    isComplete,
    isReferral,
    isPendingApproval,
    npsFromRatings,
    daysBetween,
    avg,
};
