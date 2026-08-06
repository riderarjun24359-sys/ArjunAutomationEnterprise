export interface FunnelStage {
    stage: string;
    count: number;
    conversionFromPreviousPercent: number | null;
}

export interface FeatureAdoptionRow {
    feature: string;
    adoptionRate: number;
    status: string;
    measuredAt: string;
}

export interface OnboardingDayRow {
    id: string;
    name: string;
    status: string;
    source: string;
    updatedAt: string;
}

export interface TimeToValueRow {
    id: string;
    name: string;
    daysToValue: number | null;
    status: string;
    startedAt: string;
    completedAt: string | null;
}

export interface SuccessMonitoring {
    onboardingToday: OnboardingDayRow[];
    funnel: FunnelStage[];
    timeToValue: TimeToValueRow[];
    avgTimeToValueDays: number | null;
    featureAdoption: FeatureAdoptionRow[];
    averageAdoptionPercent: number | null;
    activeOnboardingCount: number;
    completedOnboardingCount: number;
}

export interface ReferralRow {
    id: string;
    name: string;
    company: string;
    email: string;
    source: string;
    status: string;
    score: number;
    createdAt: string;
}

export interface RewardRow {
    id: string;
    label: string;
    amountOrPoints: number;
    status: string;
    kind: "commission" | "points";
    recordedAt: string;
}

export interface ReferralEngine {
    workflowSteps: Array<{ step: string; count: number; detail: string }>;
    referrals: ReferralRow[];
    rewards: RewardRow[];
    totalReferralLeads: number;
    convertedReferrals: number;
    conversionRatePercent: number | null;
    pendingRewards: number;
    totalRewardValue: number;
}

export interface ReviewRequestRow {
    id: string;
    title: string;
    type: string;
    rating: number | null;
    status: string;
    collectedAt: string;
}

export interface SuccessStoryRow {
    id: string;
    title: string;
    rating: number;
    comment: string;
    submittedAt: string;
}

export interface CaseStudyRow {
    id: string;
    name: string;
    industry: string;
    outcomeType: string;
    status: string;
    updatedAt: string;
}

export interface ApprovalRow {
    id: string;
    title: string;
    contentType: string;
    queueStatus: string;
    status: string;
    updatedAt: string;
}

export interface TestimonialCenter {
    reviewRequests: ReviewRequestRow[];
    successStories: SuccessStoryRow[];
    caseStudies: CaseStudyRow[];
    approvals: ApprovalRow[];
    pendingApprovals: number;
    averageRating: number | null;
    npsProxy: number | null;
}

export interface TourRow {
    id: string;
    name: string;
    type: string;
    stepCount: number;
    status: string;
}

export interface VideoRow {
    id: string;
    title: string;
    category: string;
    durationMinutes: number;
    status: string;
}

export interface KnowledgeRow {
    id: string;
    title: string;
    category: string;
    summary: string;
    status: string;
    publishedAt: string | null;
}

export interface ChecklistRow {
    id: string;
    name: string;
    completionPercent: number;
    status: string;
    itemCount: number;
}

export interface CustomerEducation {
    tours: TourRow[];
    videos: VideoRow[];
    knowledgeBase: KnowledgeRow[];
    checklists: ChecklistRow[];
    trainingPortals: Array<{ id: string; name: string; courseCount: number; status: string }>;
    averageLearningProgressPercent: number | null;
}

export interface BriefRisk {
    id: string;
    title: string;
    level: string;
    status: string;
    source: string;
}

export interface FounderDailyBrief {
    summary: string;
    briefingRows: Array<{ id: string; title: string; type: string; date: string; summary: string }>;
    newOrganizationsToday: number;
    newOrganizations7d: number;
    revenueMrrUsd: number;
    revenueNewMrrUsd: number;
    openSupportTickets: number;
    supportSatisfactionAvg: number | null;
    productUsageAdoptionPercent: number | null;
    risks: BriefRisk[];
    insights: Array<{ id: string; title: string; type: string; content: string }>;
}

export interface CustomerSuccessGrowthSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    monitoring: SuccessMonitoring;
    referrals: ReferralEngine;
    testimonials: TestimonialCenter;
    education: CustomerEducation;
    brief: FounderDailyBrief;
}

export interface CustomerSuccessGrowthRawData {
    organizationId: string;
    membershipRole: string | null;
    onboardingWorkflows: Array<{ id: string; name: string; status: string; created_at: string; updated_at: string }>;
    onboardingAutomation: Array<{
        id: string;
        automation_name: string;
        automation_status: string;
        started_at: string;
        status: string;
        created_at: string;
        updated_at: string;
    }>;
    milestones: Array<{
        id: string;
        milestone_name: string;
        milestone_status: string;
        target_date: string;
        completed_at?: string;
        status: string;
        created_at: string;
        updated_at: string;
    }>;
    adoptionTracking: Array<{
        id: string;
        name: string;
        adoption_percent: number;
        status: string;
        updated_at: string;
        created_at: string;
    }>;
    adoptionAnalytics: Array<{
        id: string;
        feature_name: string;
        adoption_rate: number;
        metric_date: string;
        measured_at: string;
        status: string;
    }>;
    productAdoption: Array<{
        id: string;
        module_name: string;
        adoption_percent: number;
        active_users: number;
        status: string;
        updated_at: string;
    }>;
    salesLeads: Array<{
        id: string;
        lead_name: string;
        company_name: string;
        email: string;
        source: string;
        status: string;
        score: number;
        created_at: string;
    }>;
    salesCommissions: Array<{
        id: string;
        commission_amount: number;
        status: string;
        calculated_at: string;
        created_at: string;
    }>;
    rewardPoints: Array<{
        id: string;
        points_name: string;
        points_balance: number;
        earned_at: string;
        status: string;
    }>;
    feedback: Array<{
        id: string;
        feedback_title: string;
        feedback_type: string;
        rating: number;
        collected_at: string;
        status: string;
    }>;
    satisfaction: Array<{ id: string; rating: number; comment: string; submitted_at: string }>;
    caseStudies: Array<{
        id: string;
        template_name: string;
        industry: string;
        outcome_type: string;
        template_status: string;
        status: string;
        updated_at: string;
    }>;
    approvals: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        queue_status: string;
        status: string;
        updated_at: string;
    }>;
    productTours: Array<{
        id: string;
        tour_name: string;
        tour_type: string;
        step_count: number;
        status: string;
    }>;
    videos: Array<{
        id: string;
        video_title: string;
        video_category: string;
        duration_minutes: number;
        status: string;
    }>;
    knowledgeArticles: Array<{
        id: string;
        article_title: string;
        article_category: string;
        article_summary: string;
        published_at?: string;
        status: string;
    }>;
    trainingPortals: Array<{ id: string; portal_name: string; course_count: number; status: string }>;
    checklists: Array<{
        id: string;
        name: string;
        items: unknown[];
        completion_percent: number;
        status: string;
    }>;
    learningProgress: Array<{ id: string; progress_percent: number; status: string; last_activity_at: string }>;
    briefings: Array<{
        id: string;
        briefing_title: string;
        briefing_type: string;
        briefing_date: string;
        summary: string;
        status: string;
    }>;
    founderInsights: Array<{
        id: string;
        title: string;
        insight_type: string;
        content: string;
        status: string;
        created_at: string;
    }>;
    organizations: Array<{ id: string; name?: string; created_at: string; status?: string }>;
    mrrSnapshots: Array<{
        id: string;
        snapshot_date: string;
        mrr_usd: number;
        new_mrr_usd: number;
        status: string;
    }>;
    supportTickets: Array<{ id: string; ticket_title: string; ticket_status: string; priority: string; status: string }>;
    csRisks: Array<{ id: string; name: string; risk_level: string; status: string; mitigation_plan: string }>;
    founderRisks: Array<{ id: string; title: string; risk_level: string; status: string; mitigation_plan: string }>;
    operationsMetrics: Array<{
        metric_date: string;
        open_ticket_count: number;
        adoption_rate: number;
        customer_health_score: number;
    }>;
}
