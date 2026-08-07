export interface KpiScorecardRow {
    id: string;
    name: string;
    value: number;
    target: number;
    category: string;
    attainmentPercent: number | null;
    status: string;
}

export interface ExecutiveAlert {
    id: string;
    severity: "info" | "warning" | "critical";
    title: string;
    detail: string;
}

export interface FounderExecutiveIntelligence {
    dailyBrief: string;
    weeklyReport: string;
    monthlyBoardReport: string;
    scorecards: KpiScorecardRow[];
    alerts: ExecutiveAlert[];
    executiveSummaries: Array<{ id: string; title: string; period: string; status: string }>;
}

export interface MarketingIntelligence {
    seoRankings: Array<{ id: string; name: string; keyword: string; intent: string; status: string }>;
    organicTrafficTrends: Array<{ id: string; name: string; score: number; measuredAt: string }>;
    contentPerformance: Array<{ id: string; title: string; score: number; contentType: string }>;
    socialEngagement: Array<{ id: string; name: string; score: number; type: string }>;
    videoPerformance: Array<{ id: string; name: string; durationSeconds: number; status: string }>;
    emailPerformance: Array<{ id: string; name: string; openRate: number; clickRate: number; sent: number }>;
    channelComparison: Array<{ channel: string; conversionRate: number; items: number }>;
}

export interface RevenueIntelligence {
    cacUsd: number | null;
    ltvUsd: number | null;
    mrrUsd: number;
    arrUsd: number;
    trialToPaidPercent: number | null;
    retentionPercent: number | null;
    churnAnalysis: Array<{ id: string; name: string; probability: number; status: string }>;
    referralPerformance: { referralLeads: number; referralConverted: number; referralRatePercent: number | null };
    highChurnCount: number;
    expansionCount: number;
}

export interface ForecastPoint {
    id: string;
    label: string;
    period: string;
    valueUsd: number;
    confidencePercent: number;
    kind: "mrr" | "arr" | "traffic" | "leads" | "conversion";
}

export interface ScenarioRow {
    name: "base" | "optimistic" | "conservative";
    projectedMrrUsd: number;
    projectedArrUsd: number;
    projectedLeads: number;
}

export interface GrowthForecasting {
    trafficProjections: ForecastPoint[];
    leadForecasts: ForecastPoint[];
    revenueForecasts: ForecastPoint[];
    conversionForecasts: ForecastPoint[];
    scenarios: ScenarioRow[];
}

export interface RecommendationRow {
    id: string;
    title: string;
    type: string;
    confidence: number;
    status: string;
    category:
        | "seo"
        | "content"
        | "publishing_time"
        | "campaign"
        | "nurture"
        | "expansion"
        | "other";
}

export interface AiRecommendationEngine {
    recommendations: RecommendationRow[];
    seoOpportunities: RecommendationRow[];
    contentRecommendations: RecommendationRow[];
    publishingTimeRecommendations: RecommendationRow[];
    campaignOptimization: RecommendationRow[];
    nurtureSuggestions: RecommendationRow[];
    expansionOpportunities: RecommendationRow[];
}

export interface UnifiedIntelligenceDashboard {
    growthHealthScore: number | null;
    executive: Array<{ label: string; value: string | number }>;
    marketing: Array<{ label: string; value: string | number }>;
    sales: Array<{ label: string; value: string | number }>;
    customerSuccess: Array<{ label: string; value: string | number }>;
    drilldowns: Array<{ id: string; area: string; metric: string; value: number; detail: string }>;
}

export interface GrowthOsIntelligenceSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    founder: FounderExecutiveIntelligence;
    marketing: MarketingIntelligence;
    revenue: RevenueIntelligence;
    forecasting: GrowthForecasting;
    recommendations: AiRecommendationEngine;
    dashboard: UnifiedIntelligenceDashboard;
}

export interface GrowthOsIntelligenceRawData {
    organizationId: string;
    membershipRole: string | null;
    growthKpis: Array<{
        id: string;
        kpi_name: string;
        kpi_value: number;
        kpi_category: string;
        target_value: number;
        status: string;
    }>;
    executiveSummaries: Array<{
        id: string;
        summary_title: string;
        summary_period: string;
        summary_status: string;
        status: string;
    }>;
    commandMetrics: Array<{
        id: string;
        metric_date: string;
        mission_status_score: number;
        content_status_score: number;
        publishing_status_score: number;
        growth_metrics_score: number;
        campaign_health_score: number;
        executive_summary_score: number;
        overall_operations_score: number;
    }>;
    commandHealth: Array<{ id: string; overall_score: number; health_date: string; summary?: string }>;
    growthMetrics: Array<{
        overall_growth_score: number;
        brand_health_score: number;
        marketing_overview_score: number;
        content_calendar_count: number;
        draft_queue_count: number;
        approval_queue_count: number;
        publishing_queue_count: number;
    }>;
    growthHealth: Array<{
        id: string;
        overall_score: number;
        brand_status: string;
        content_status: string;
        media_status: string;
        engine_status: string;
        summary: string;
    }>;
    seoAssistants: Array<{
        id: string;
        assistant_name: string;
        keyword_focus: string;
        search_intent: string;
        assistant_status: string;
        status: string;
    }>;
    contentPerformance: Array<{
        id: string;
        performance_title: string;
        performance_score: number;
        content_type: string;
        measured_at: string;
    }>;
    distributionAnalytics: Array<{
        id: string;
        analytics_name: string;
        analytics_score: number;
        analytics_type: string;
        measured_at: string;
    }>;
    attributions: Array<{
        id: string;
        attribution_title: string;
        channel_ref: string;
        conversion_rate: number;
        attribution_status: string;
        status: string;
    }>;
    videoProjects: Array<{
        id: string;
        project_name: string;
        project_status: string;
        duration_seconds: number;
        status: string;
    }>;
    youtubeTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        duration_seconds: number;
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
    campaigns: Array<{ id: string; campaign_name: string; channel_type: string; status: string }>;
    salesLeads: Array<{
        id: string;
        lead_name: string;
        source: string;
        status: string;
        score: number;
        created_at: string;
    }>;
    subscriptions: Array<{
        id: string;
        plan_name: string;
        status: string;
        payment_status: string;
        mrr_usd: number;
        arr_usd: number;
        created_at: string;
    }>;
    mrrSnapshots: Array<{
        snapshot_date: string;
        mrr_usd: number;
        new_mrr_usd: number;
        churn_mrr_usd: number;
    }>;
    arrSnapshots: Array<{ snapshot_date: string; arr_usd: number }>;
    mrrForecasts: Array<{
        id: string;
        forecast_date: string;
        forecast_period: string;
        projected_mrr_usd: number;
        confidence_percent: number;
        status: string;
    }>;
    arrForecasts: Array<{
        id: string;
        forecast_date: string;
        forecast_period: string;
        projected_arr_usd: number;
        confidence_percent: number;
        status: string;
    }>;
    churnPredictions: Array<{
        id: string;
        name: string;
        churn_probability: number;
        status: string;
    }>;
    renewals: Array<{ id: string; name: string; renewal_value_usd: number; status: string }>;
    expansions: Array<{
        id: string;
        name: string;
        opportunity_type: string;
        estimated_value_usd: number;
        status: string;
    }>;
    adoption: Array<{ adoption_percent: number; status: string }>;
    recommendations: Array<{
        id: string;
        recommendation_title: string;
        recommendation_type: string;
        confidence_score: number;
        recommendation_status: string;
        status: string;
    }>;
    roiDashboards: Array<{
        id: string;
        roi_name: string;
        roi_score: number;
        campaign_ref: string;
        measured_at: string;
    }>;
    payments: Array<{ amount: number; status: string; payment_date: string; created_at: string }>;
    publishingHistory: Array<{
        id: string;
        history_title: string;
        content_type: string;
        published_at: string;
        status: string;
    }>;
}
