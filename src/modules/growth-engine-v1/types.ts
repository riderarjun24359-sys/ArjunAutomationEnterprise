export interface LeadRow {
    id: string;
    name: string;
    company: string;
    email: string;
    source: string;
    status: string;
    score: number;
    createdAt: string;
}

export interface CampaignRow {
    id: string;
    name: string;
    channel: string;
    status: string;
    startsAt: string | null;
    endsAt: string | null;
}

export interface AttributionRow {
    id: string;
    title: string;
    channel: string;
    conversionRate: number;
    status: string;
}

export interface SourceBucket {
    source: string;
    leads: number;
    converted: number;
    conversionRatePercent: number | null;
}

export interface MarketingCrm {
    leads: LeadRow[];
    campaigns: CampaignRow[];
    attributions: AttributionRow[];
    sourceBuckets: SourceBucket[];
    totalLeads: number;
    convertedLeads: number;
    conversionRatePercent: number | null;
    activeCampaigns: number;
}

export interface DealStage {
    stage: string;
    count: number;
    amountUsd: number;
}

export interface OpportunityRow {
    id: string;
    name: string;
    amount: number;
    probability: number;
    status: string;
    expectedCloseDate: string | null;
}

export interface ProposalRow {
    id: string;
    title: string;
    quoteNumber: string;
    amount: number;
    status: string;
    validUntil: string | null;
}

export interface FollowUpRow {
    id: string;
    subject: string;
    activityType: string;
    dueAt: string | null;
    completedAt: string | null;
    opportunityId: string | null;
}

export interface WinLossRow {
    id: string;
    outcome: string;
    reason: string;
    amount: number;
    competitor: string;
    recordedAt: string;
}

export interface SalesPipeline {
    stages: DealStage[];
    opportunities: OpportunityRow[];
    proposals: ProposalRow[];
    followUps: FollowUpRow[];
    overdueFollowUps: number;
    winLoss: WinLossRow[];
    winRatePercent: number | null;
    pipelineValueUsd: number;
}

export interface TrialPaidRow {
    id: string;
    planName: string;
    status: string;
    paymentStatus: string;
    mrrUsd: number;
    startsAt: string | null;
    createdAt: string;
}

export interface ChurnRow {
    id: string;
    name: string;
    probability: number;
    status: string;
}

export interface RenewalRow {
    id: string;
    name: string;
    renewalDate: string | null;
    valueUsd: number;
    status: string;
}

export interface ExpansionRow {
    id: string;
    name: string;
    type: string;
    estimatedValueUsd: number;
    status: string;
}

export interface CustomerLifecycle {
    trialSubscriptions: TrialPaidRow[];
    paidSubscriptions: TrialPaidRow[];
    trialToPaidRatePercent: number | null;
    churnPredictions: ChurnRow[];
    highChurnCount: number;
    renewals: RenewalRow[];
    expansions: ExpansionRow[];
    lifecycleStages: Array<{ stage: string; count: number }>;
}

export interface GrowthAnalytics {
    cacUsd: number | null;
    ltvUsd: number | null;
    mrrUsd: number;
    arrUsd: number;
    activationRatePercent: number | null;
    retentionRatePercent: number | null;
    referralRatePercent: number | null;
    newMrrUsd: number;
    churnMrrUsd: number;
}

export interface FunnelStep {
    step: string;
    count: number;
    conversionFromPreviousPercent: number | null;
}

export interface GrowthAlert {
    id: string;
    severity: "info" | "warning" | "critical";
    title: string;
    detail: string;
}

export interface FounderGrowthDashboard {
    dailyRevenueUsd: number;
    newOrganizationsToday: number;
    newOrganizations7d: number;
    activeUsers: number;
    funnel: FunnelStep[];
    alerts: GrowthAlert[];
    summary: string;
}

export interface GrowthEngineV1Snapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    marketing: MarketingCrm;
    sales: SalesPipeline;
    lifecycle: CustomerLifecycle;
    analytics: GrowthAnalytics;
    founder: FounderGrowthDashboard;
}

export interface GrowthEngineV1RawData {
    organizationId: string;
    membershipRole: string | null;
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
    campaigns: Array<{
        id: string;
        campaign_name: string;
        channel_type: string;
        status: string;
        starts_at?: string | null;
        ends_at?: string | null;
    }>;
    campaignMetrics: Array<{
        campaign_id: string;
        open_rate: number;
        click_rate: number;
        sent_count: number;
        delivered_count: number;
    }>;
    attributions: Array<{
        id: string;
        attribution_title: string;
        channel_ref: string;
        conversion_rate: number;
        attribution_status: string;
        status: string;
    }>;
    opportunities: Array<{
        id: string;
        name: string;
        amount: number;
        probability: number;
        status: string;
        expected_close_date?: string | null;
        stage_id?: string | null;
    }>;
    pipelineStages: Array<{ id: string; name: string; position?: number }>;
    quotes: Array<{
        id: string;
        title: string;
        quote_number: string;
        total_amount: number;
        status: string;
        valid_until?: string | null;
    }>;
    activities: Array<{
        id: string;
        subject: string;
        activity_type: string;
        due_at?: string | null;
        completed_at?: string | null;
        opportunity_id?: string | null;
    }>;
    winLoss: Array<{
        id: string;
        outcome: string;
        reason: string;
        amount: number;
        competitor: string;
        recorded_at: string;
    }>;
    subscriptions: Array<{
        id: string;
        plan_name: string;
        status: string;
        payment_status: string;
        mrr_usd: number;
        arr_usd: number;
        starts_at?: string | null;
        ends_at?: string | null;
        created_at: string;
    }>;
    churnPredictions: Array<{
        id: string;
        name: string;
        churn_probability: number;
        status: string;
    }>;
    renewals: Array<{
        id: string;
        name: string;
        renewal_date?: string | null;
        renewal_value_usd: number;
        status: string;
    }>;
    expansions: Array<{
        id: string;
        name: string;
        opportunity_type: string;
        estimated_value_usd: number;
        status: string;
    }>;
    lifecycles: Array<{ id: string; name: string; current_stage: string; status: string }>;
    mrrSnapshots: Array<{
        snapshot_date: string;
        mrr_usd: number;
        new_mrr_usd: number;
        churn_mrr_usd: number;
        previous_mrr_usd: number;
    }>;
    arrSnapshots: Array<{ snapshot_date: string; arr_usd: number }>;
    adoption: Array<{ adoption_percent: number; status: string }>;
    organizations: Array<{ id: string; name: string; status: string; created_at: string }>;
    memberships: Array<{ id: string; user_id: string; is_active: boolean; organization_id: string }>;
    growthKpis: Array<{ kpi_name: string; kpi_value: number; kpi_category: string; target_value: number }>;
    payments: Array<{ amount: number; status: string; payment_date: string; created_at: string }>;
}
