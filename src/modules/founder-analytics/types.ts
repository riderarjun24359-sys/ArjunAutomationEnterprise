export type FounderAlertSeverity = "critical" | "high" | "medium" | "info";

export interface FounderExecutiveDashboard {
    mrrUsd: number;
    arrUsd: number;
    cashFlowUsd: number;
    newOrganizations: number;
    activeOrganizations: number;
    trialToPaidConversionPercent: number;
    churnRatePercent: number;
    retentionPercent: number;
    npsScore: number | null;
    customerSatisfactionAvg: number | null;
    revenueForecastUsd: number;
    mrrTrend: "up" | "down" | "flat";
    activeSubscriptions: number;
    trialSubscriptions: number;
    paidSubscriptions: number;
}

export interface GrowthChannelRow {
    channel: string;
    leads: number;
    sharePercent: number;
}

export interface CampaignPerformanceRow {
    id: string;
    name: string;
    channel: string;
    status: string;
    deliveries: number;
    successRatePercent: number;
}

export interface FounderGrowthCenter {
    acquisitionChannels: GrowthChannelRow[];
    landingPageConversions: number;
    landingConversionRatePercent: number;
    referralLeads: number;
    campaigns: CampaignPerformanceRow[];
    organicLeads: number;
    paidLeads: number;
    cacUsd: number | null;
    ltvUsd: number | null;
    ltvToCac: number | null;
    growthScore: number | null;
}

export interface CustomerHealthRow {
    id: string;
    name: string;
    healthScore: number;
    status: string;
}

export interface ExpansionRow {
    id: string;
    name: string;
    estimatedValueUsd: number;
    type: string;
    status: string;
}

export interface AdoptionHeatCell {
    label: string;
    value: number;
}

export interface FounderCustomerIntelligence {
    averageHealthScore: number;
    healthOverview: CustomerHealthRow[];
    expansionOpportunities: ExpansionRow[];
    churnWatchlist: CustomerHealthRow[];
    topCustomers: Array<{ name: string; mrrUsd: number; outstandingUsd: number }>;
    inactiveCustomers: CustomerHealthRow[];
    adoptionHeatmap: AdoptionHeatCell[];
}

export interface FounderAlert {
    id: string;
    category: "revenue" | "payment" | "incident" | "signup" | "trial" | "security";
    severity: FounderAlertSeverity;
    title: string;
    detail: string;
    detectedAt: string;
}

export interface FounderAdvisorBriefing {
    dailyBriefing: string;
    businessRisks: string[];
    growthOpportunities: string[];
    revenueRecommendations: string[];
    weeklyExecutiveSummary: string;
    generatedAt: string;
}

export interface BoardRoomSnapshot {
    investorKpis: Array<{ label: string; value: string; note?: string }>;
    saasMetrics: Array<{ label: string; value: string }>;
    executiveReportLines: string[];
    monthlyBusinessSnapshot: string;
    generatedAt: string;
}

export interface FounderAnalyticsSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    executive: FounderExecutiveDashboard;
    growth: FounderGrowthCenter;
    customers: FounderCustomerIntelligence;
    alerts: FounderAlert[];
    advisor: FounderAdvisorBriefing;
    board: BoardRoomSnapshot;
}

export interface FounderAnalyticsRawData {
    organizationId: string;
    membershipRole: string | null;
    organizations: Array<{ id: string; name: string; status: string; created_at: string }>;
    billingAccounts: Array<{ id: string; account_name?: string; status: string; created_at: string; [key: string]: unknown }>;
    subscriptions: Array<{
        id: string;
        plan_name: string;
        mrr_usd: number;
        arr_usd: number;
        status: string;
        payment_status: string;
        starts_at: string;
        ends_at?: string | null;
        created_at: string;
        billing_account_id?: string;
    }>;
    mrrSnapshots: Array<{
        mrr_usd: number;
        previous_mrr_usd: number;
        churn_mrr_usd: number;
        new_mrr_usd: number;
        expansion_mrr_usd: number;
        contraction_mrr_usd: number;
        snapshot_date: string;
    }>;
    arrSnapshots: Array<{ arr_usd: number; previous_arr_usd: number; snapshot_date: string }>;
    mrrForecasts: Array<{ projected_mrr_usd: number; forecast_date: string; confidence_percent: number }>;
    paymentAttempts: Array<{ amount_usd: number; payment_status: string; status: string; attempted_at: string; failure_reason: string }>;
    invoices: Array<{ total: number; amount_paid: number; amount_due: number; status: string; issue_date?: string; created_at: string }>;
    payments: Array<{ amount: number; status: string; paid_at?: string | null; created_at: string }>;
    clients: Array<{ id: string; name: string; status: string; lifecycle_stage?: string; created_at: string; updated_at: string }>;
    healthScores: Array<{ id: string; name: string; overall_score: number; status: string; engagement_id: string }>;
    expansions: Array<{ id: string; name: string; estimated_value_usd: number; opportunity_type: string; status: string }>;
    churnPredictions: Array<{ id: string; name: string; churn_probability: number; status: string }>;
    adoption: Array<{ id: string; name: string; adoption_score?: number; feature_adoption?: unknown; status: string }>;
    salesLeads: Array<{ id: string; lead_name: string; source: string; status: string; score: number; created_at: string }>;
    campaigns: Array<{ id: string; campaign_name: string; channel_type: string; status: string }>;
    campaignDeliveries: Array<{ campaign_id: string; delivery_status: string }>;
    campaignMetrics: Array<{ campaign_id: string; metric_name?: string; metric_value?: number; [key: string]: unknown }>;
    satisfaction: Array<{ rating: number; submitted_at: string }>;
    feedbackAnalyses: Array<{ name?: string; sentiment_score?: number; nps_score?: number; status: string; [key: string]: unknown }>;
    growthMetrics: Array<{ overall_growth_score: number; marketing_overview_score: number; metric_date: string }>;
    securityThreats: Array<{ id: string; title?: string; severity?: string; status?: string; created_at?: string; [key: string]: unknown }>;
    auditEvents: Array<{ id: string; action: string; summary?: string; created_at: string; [key: string]: unknown }>;
    fetchedAt: string;
}
