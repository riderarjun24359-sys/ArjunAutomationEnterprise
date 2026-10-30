import type {
    AiRecommendationEngine,
    FounderExecutiveIntelligence,
    GrowthForecasting,
    GrowthOsIntelligenceRawData,
    GrowthOsIntelligenceSnapshot,
    MarketingIntelligence,
    RecommendationRow,
    RevenueIntelligence,
    UnifiedIntelligenceDashboard,
} from "../types";

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

function pct(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 10) / 10;
}

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return pct(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function isConvertedLead(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("qualified") || s.includes("won") || s.includes("converted") || s.includes("customer");
}

function isTrial(status: string, paymentStatus: string): boolean {
    return status.toLowerCase().includes("trial") || paymentStatus.toLowerCase().includes("trial");
}

function isPaid(status: string, paymentStatus: string): boolean {
    const s = `${status} ${paymentStatus}`.toLowerCase();
    return s.includes("paid") || s.includes("active") || s.includes("current");
}

function isReferral(source: string): boolean {
    return source.toLowerCase().includes("refer");
}

function isPaidPayment(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("paid") || s.includes("success") || s.includes("complete");
}

export function classifyRecommendation(
    type: string,
    title: string,
): RecommendationRow["category"] {
    const s = `${type} ${title}`.toLowerCase();
    if (s.includes("seo") || s.includes("keyword") || s.includes("rank")) return "seo";
    if (s.includes("content") || s.includes("blog") || s.includes("article")) return "content";
    if (s.includes("publish") || s.includes("schedule") || s.includes("timing") || s.includes("time")) {
        return "publishing_time";
    }
    if (s.includes("campaign") || s.includes("ads") || s.includes("roi")) return "campaign";
    if (s.includes("nurtur") || s.includes("drip") || s.includes("lead")) return "nurture";
    if (s.includes("expand") || s.includes("upsell") || s.includes("cross")) return "expansion";
    return "other";
}

export function attainmentPercent(value: number, target: number): number | null {
    if (!target) return null;
    return pct((value / target) * 100);
}

export function scenarioMultiply(base: number, factor: number): number {
    return money(base * factor);
}

export const goiPure = {
    money,
    pct,
    avg,
    isConvertedLead,
    isTrial,
    isPaid,
    isReferral,
    isPaidPayment,
    classifyRecommendation,
    attainmentPercent,
    scenarioMultiply,
};

export function buildFounderExecutiveIntelligence(data: GrowthOsIntelligenceRawData): FounderExecutiveIntelligence {
    const latestCmd = data.commandMetrics[0];
    const latestHealth = data.growthHealth[0] ?? data.commandHealth[0];
    const mrr = data.mrrSnapshots[0]?.mrr_usd ?? data.subscriptions.reduce((s, x) => s + x.mrr_usd, 0);
    const arr = data.arrSnapshots[0]?.arr_usd ?? data.subscriptions.reduce((s, x) => s + x.arr_usd, 0);
    const leads = data.salesLeads.length;
    const converted = data.salesLeads.filter((l) => isConvertedLead(l.status)).length;

    const scorecards = data.growthKpis.map((k) => ({
        id: k.id,
        name: k.kpi_name,
        value: k.kpi_value,
        target: k.target_value,
        category: k.kpi_category,
        attainmentPercent: attainmentPercent(k.kpi_value, k.target_value),
        status: k.status,
    }));

    const alerts: FounderExecutiveIntelligence["alerts"] = [];
    for (const c of data.churnPredictions) {
        if (c.churn_probability >= 70) {
            alerts.push({
                id: c.id,
                severity: "critical",
                title: `High churn risk · ${c.name}`,
                detail: `Probability ${pct(c.churn_probability)}%`,
            });
        } else if (c.churn_probability >= 40) {
            alerts.push({
                id: c.id,
                severity: "warning",
                title: `Elevated churn · ${c.name}`,
                detail: `Probability ${pct(c.churn_probability)}%`,
            });
        }
    }
    if (latestCmd && latestCmd.campaign_health_score < 50) {
        alerts.push({
            id: `${latestCmd.id}-campaign`,
            severity: "warning",
            title: "Campaign health below threshold",
            detail: `Score ${pct(latestCmd.campaign_health_score)}`,
        });
    }
    if (latestHealth && "overall_score" in latestHealth && latestHealth.overall_score < 60) {
        alerts.push({
            id: `${latestHealth.id}-health`,
            severity: "critical",
            title: "Growth health degraded",
            detail: `Overall ${pct(latestHealth.overall_score)}`,
        });
    }
    if (!alerts.length) {
        alerts.push({
            id: "info-stable",
            severity: "info",
            title: "No critical growth alerts",
            detail: "Live KPI and churn signals within monitored bands.",
        });
    }

    const healthScore =
        ("overall_score" in (latestHealth ?? {}) ? (latestHealth as { overall_score: number }).overall_score : null) ??
        latestCmd?.overall_operations_score ??
        data.growthMetrics[0]?.overall_growth_score ??
        null;

    const dailyBrief = [
        `Daily brief · MRR ₹${money(mrr)} · ARR ₹${money(arr)}`,
        `Leads ${leads} (${converted} converted)`,
        healthScore != null ? `Growth health ${pct(healthScore)}` : "Growth health pending",
        `${alerts.filter((a) => a.severity !== "info").length} active alerts`,
    ].join(" · ");

    const weeklyReport = [
        `Weekly growth report`,
        `Content score avg ${avg(data.contentPerformance.map((c) => c.performance_score)) ?? "—"}`,
        `Publishing events ${data.publishingHistory.length}`,
        `Campaign ROI rows ${data.roiDashboards.length}`,
        `SEO assistants ${data.seoAssistants.length}`,
    ].join(" · ");

    const monthlyBoardReport = [
        `Monthly board report`,
        `MRR ₹${money(mrr)} / ARR ₹${money(arr)}`,
        `KPI scorecards ${scorecards.length}`,
        `Executive summaries ${data.executiveSummaries.length}`,
        `Expansions ${data.expansions.length} · Renewals ${data.renewals.length}`,
        `Churn watchlist ${data.churnPredictions.filter((c) => c.churn_probability >= 40).length}`,
    ].join(" · ");

    return {
        dailyBrief,
        weeklyReport,
        monthlyBoardReport,
        scorecards,
        alerts,
        executiveSummaries: data.executiveSummaries.map((s) => ({
            id: s.id,
            title: s.summary_title,
            period: s.summary_period,
            status: s.summary_status || s.status,
        })),
    };
}

export function buildMarketingIntelligence(data: GrowthOsIntelligenceRawData): MarketingIntelligence {
    const campaignName = new Map(data.campaigns.map((c) => [c.id, c.campaign_name]));
    const emailPerformance = data.campaignMetrics.map((m) => ({
        id: m.id,
        name: campaignName.get(m.campaign_id) ?? m.campaign_id,
        openRate: m.open_rate,
        clickRate: m.click_rate,
        sent: m.sent_count,
    }));

    const channelMap = new Map<string, { sum: number; n: number }>();
    for (const a of data.attributions) {
        const prev = channelMap.get(a.channel_ref) ?? { sum: 0, n: 0 };
        channelMap.set(a.channel_ref, { sum: prev.sum + a.conversion_rate, n: prev.n + 1 });
    }

    return {
        seoRankings: data.seoAssistants.map((s) => ({
            id: s.id,
            name: s.assistant_name,
            keyword: s.keyword_focus,
            intent: s.search_intent,
            status: s.assistant_status || s.status,
        })),
        organicTrafficTrends: data.distributionAnalytics.map((a) => ({
            id: a.id,
            name: a.analytics_name,
            score: a.analytics_score,
            measuredAt: a.measured_at,
        })),
        contentPerformance: data.contentPerformance.map((c) => ({
            id: c.id,
            title: c.performance_title,
            score: c.performance_score,
            contentType: c.content_type,
        })),
        socialEngagement: data.distributionAnalytics
            .filter(
                (a) =>
                    a.analytics_type.toLowerCase().includes("engag") ||
                    a.analytics_type.toLowerCase().includes("social") ||
                    a.analytics_type.toLowerCase().includes("reach"),
            )
            .map((a) => ({
                id: a.id,
                name: a.analytics_name,
                score: a.analytics_score,
                type: a.analytics_type,
            })),
        videoPerformance: [
            ...data.videoProjects.map((v) => ({
                id: v.id,
                name: v.project_name,
                durationSeconds: v.duration_seconds,
                status: v.project_status || v.status,
            })),
            ...data.youtubeTemplates.map((y) => ({
                id: y.id,
                name: y.template_name,
                durationSeconds: y.duration_seconds,
                status: y.template_status || y.status,
            })),
        ],
        emailPerformance,
        channelComparison: Array.from(channelMap.entries()).map(([channel, v]) => ({
            channel,
            conversionRate: v.n ? pct(v.sum / v.n) : 0,
            items: v.n,
        })),
    };
}

export function buildRevenueIntelligence(data: GrowthOsIntelligenceRawData): RevenueIntelligence {
    const trials = data.subscriptions.filter((s) => isTrial(s.status, s.payment_status));
    const paid = data.subscriptions.filter((s) => isPaid(s.status, s.payment_status));
    const denom = trials.length + paid.length;
    const trialToPaidPercent = denom ? pct((paid.length / denom) * 100) : null;

    const mrrUsd = data.mrrSnapshots[0]?.mrr_usd ?? paid.reduce((s, x) => s + x.mrr_usd, 0);
    const arrUsd = data.arrSnapshots[0]?.arr_usd ?? paid.reduce((s, x) => s + x.arr_usd, 0);

    const paidPayments = data.payments.filter((p) => isPaidPayment(p.status));
    const marketingSpendProxy = data.roiDashboards.reduce((s, r) => s + r.roi_score, 0);
    const newCustomers = paid.length || data.salesLeads.filter((l) => isConvertedLead(l.status)).length;
    const cacUsd =
        newCustomers > 0 && (marketingSpendProxy > 0 || paidPayments.length > 0)
            ? money((marketingSpendProxy || paidPayments.reduce((s, p) => s + p.amount, 0) * 0.15) / newCustomers)
            : null;

    const adoptionAvg = avg(data.adoption.map((a) => a.adoption_percent));
    const retentionPercent =
        adoptionAvg != null
            ? adoptionAvg
            : data.churnPredictions.length
              ? pct(100 - (avg(data.churnPredictions.map((c) => c.churn_probability)) ?? 0))
              : null;

    const ltvUsd =
        retentionPercent != null && mrrUsd > 0
            ? money(mrrUsd * Math.max(1, (retentionPercent / 100) * 24))
            : paid.length
              ? money(arrUsd / paid.length)
              : null;

    const referralLeads = data.salesLeads.filter((l) => isReferral(l.source));
    const referralConverted = referralLeads.filter((l) => isConvertedLead(l.status));

    return {
        cacUsd,
        ltvUsd,
        mrrUsd: money(mrrUsd),
        arrUsd: money(arrUsd),
        trialToPaidPercent,
        retentionPercent,
        churnAnalysis: data.churnPredictions.map((c) => ({
            id: c.id,
            name: c.name,
            probability: c.churn_probability,
            status: c.status,
        })),
        referralPerformance: {
            referralLeads: referralLeads.length,
            referralConverted: referralConverted.length,
            referralRatePercent: referralLeads.length
                ? pct((referralConverted.length / referralLeads.length) * 100)
                : null,
        },
        highChurnCount: data.churnPredictions.filter((c) => c.churn_probability >= 70).length,
        expansionCount: data.expansions.length,
    };
}

export function buildGrowthForecasting(data: GrowthOsIntelligenceRawData): GrowthForecasting {
    const revenueForecasts = [
        ...data.mrrForecasts.map((f) => ({
            id: f.id,
            label: f.forecast_period || f.forecast_date,
            period: f.forecast_period,
            valueUsd: f.projected_mrr_usd,
            confidencePercent: f.confidence_percent,
            kind: "mrr" as const,
        })),
        ...data.arrForecasts.map((f) => ({
            id: f.id,
            label: f.forecast_period || f.forecast_date,
            period: f.forecast_period,
            valueUsd: f.projected_arr_usd,
            confidencePercent: f.confidence_percent,
            kind: "arr" as const,
        })),
    ];

    const trafficProjections = data.distributionAnalytics.slice(0, 12).map((a) => ({
        id: a.id,
        label: a.analytics_name,
        period: a.measured_at,
        valueUsd: a.analytics_score,
        confidencePercent: Math.min(95, Math.max(40, a.analytics_score)),
        kind: "traffic" as const,
    }));

    const leadBase = data.salesLeads.length;
    const leadForecasts = data.mrrForecasts.slice(0, 6).map((f, idx) => ({
        id: `lead-${f.id}`,
        label: f.forecast_period || f.forecast_date,
        period: f.forecast_period,
        valueUsd: money(leadBase * (1 + (idx + 1) * 0.05) * (f.confidence_percent / 100 || 0.7)),
        confidencePercent: f.confidence_percent,
        kind: "leads" as const,
    }));

    const conversionForecasts = data.attributions.slice(0, 8).map((a) => ({
        id: a.id,
        label: a.attribution_title,
        period: a.channel_ref,
        valueUsd: a.conversion_rate,
        confidencePercent: Math.min(95, Math.max(30, a.conversion_rate)),
        kind: "conversion" as const,
    }));

    const baseMrr =
        data.mrrForecasts[0]?.projected_mrr_usd ??
        data.mrrSnapshots[0]?.mrr_usd ??
        data.subscriptions.reduce((s, x) => s + x.mrr_usd, 0);
    const baseArr =
        data.arrForecasts[0]?.projected_arr_usd ??
        data.arrSnapshots[0]?.arr_usd ??
        data.subscriptions.reduce((s, x) => s + x.arr_usd, 0);

    const scenarios = [
        {
            name: "conservative" as const,
            projectedMrrUsd: scenarioMultiply(baseMrr, 0.9),
            projectedArrUsd: scenarioMultiply(baseArr, 0.9),
            projectedLeads: Math.round(leadBase * 0.9),
        },
        {
            name: "base" as const,
            projectedMrrUsd: money(baseMrr),
            projectedArrUsd: money(baseArr),
            projectedLeads: leadBase,
        },
        {
            name: "optimistic" as const,
            projectedMrrUsd: scenarioMultiply(baseMrr, 1.15),
            projectedArrUsd: scenarioMultiply(baseArr, 1.15),
            projectedLeads: Math.round(leadBase * 1.2),
        },
    ];

    return {
        trafficProjections,
        leadForecasts,
        revenueForecasts,
        conversionForecasts,
        scenarios,
    };
}

export function buildAiRecommendationEngine(data: GrowthOsIntelligenceRawData): AiRecommendationEngine {
    const fromEngine: RecommendationRow[] = data.recommendations.map((r) => ({
        id: r.id,
        title: r.recommendation_title,
        type: r.recommendation_type,
        confidence: r.confidence_score,
        status: r.recommendation_status || r.status,
        category: classifyRecommendation(r.recommendation_type, r.recommendation_title),
    }));

    // Deterministic opportunity signals from live SEO / content / publishing / expansion data
    const derived: RecommendationRow[] = [
        ...data.seoAssistants
            .filter((s) => !s.keyword_focus.trim())
            .map((s) => ({
                id: `seo-${s.id}`,
                title: `Add keyword focus · ${s.assistant_name}`,
                type: "seo_opportunity",
                confidence: 75,
                status: s.status,
                category: "seo" as const,
            })),
        ...data.contentPerformance
            .filter((c) => c.performance_score < 50)
            .map((c) => ({
                id: `content-${c.id}`,
                title: `Optimize underperforming content · ${c.performance_title}`,
                type: "content_recommendation",
                confidence: 70,
                status: "active",
                category: "content" as const,
            })),
        ...data.publishingHistory.slice(0, 5).map((p) => ({
            id: `pub-${p.id}`,
            title: `Review publishing window · ${p.history_title}`,
            type: "publishing_time",
            confidence: 65,
            status: p.status,
            category: "publishing_time" as const,
        })),
        ...data.roiDashboards
            .filter((r) => r.roi_score < 40)
            .map((r) => ({
                id: `camp-${r.id}`,
                title: `Optimize campaign ROI · ${r.roi_name}`,
                type: "campaign_optimization",
                confidence: 72,
                status: "active",
                category: "campaign" as const,
            })),
        ...data.salesLeads
            .filter((l) => !isConvertedLead(l.status) && l.score >= 60)
            .slice(0, 8)
            .map((l) => ({
                id: `nurture-${l.id}`,
                title: `Nurture high-score lead · ${l.lead_name}`,
                type: "lead_nurture",
                confidence: Math.min(95, l.score),
                status: l.status,
                category: "nurture" as const,
            })),
        ...data.expansions.map((e) => ({
            id: `exp-${e.id}`,
            title: `Expansion opportunity · ${e.name}`,
            type: e.opportunity_type || "expansion",
            confidence: 68,
            status: e.status,
            category: "expansion" as const,
        })),
    ];

    const recommendations = [...fromEngine, ...derived];
    return {
        recommendations,
        seoOpportunities: recommendations.filter((r) => r.category === "seo"),
        contentRecommendations: recommendations.filter((r) => r.category === "content"),
        publishingTimeRecommendations: recommendations.filter((r) => r.category === "publishing_time"),
        campaignOptimization: recommendations.filter((r) => r.category === "campaign"),
        nurtureSuggestions: recommendations.filter((r) => r.category === "nurture"),
        expansionOpportunities: recommendations.filter((r) => r.category === "expansion"),
    };
}

export function buildUnifiedIntelligenceDashboard(
    data: GrowthOsIntelligenceRawData,
    revenue: RevenueIntelligence,
    marketing: MarketingIntelligence,
): UnifiedIntelligenceDashboard {
    const growthHealthScore =
        data.growthHealth[0]?.overall_score ??
        data.commandHealth[0]?.overall_score ??
        data.growthMetrics[0]?.overall_growth_score ??
        data.commandMetrics[0]?.overall_operations_score ??
        null;

    const latestCmd = data.commandMetrics[0];

    return {
        growthHealthScore: growthHealthScore != null ? pct(growthHealthScore) : null,
        executive: [
            { label: "MRR", value: revenue.mrrUsd },
            { label: "ARR", value: revenue.arrUsd },
            { label: "Health", value: growthHealthScore != null ? pct(growthHealthScore) : "—" },
            { label: "Alerts (churn≥70)", value: revenue.highChurnCount },
        ],
        marketing: [
            { label: "SEO keywords", value: marketing.seoRankings.length },
            { label: "Content assets", value: marketing.contentPerformance.length },
            { label: "Email campaigns", value: marketing.emailPerformance.length },
            { label: "Channels", value: marketing.channelComparison.length },
        ],
        sales: [
            { label: "Leads", value: data.salesLeads.length },
            { label: "CAC", value: revenue.cacUsd ?? "—" },
            { label: "LTV", value: revenue.ltvUsd ?? "—" },
            { label: "Trial→Paid %", value: revenue.trialToPaidPercent ?? "—" },
        ],
        customerSuccess: [
            { label: "Retention %", value: revenue.retentionPercent ?? "—" },
            { label: "Churn watch", value: revenue.churnAnalysis.length },
            { label: "Expansions", value: revenue.expansionCount },
            { label: "Referrals converted", value: revenue.referralPerformance.referralConverted },
        ],
        drilldowns: [
            ...(latestCmd
                ? [
                      {
                          id: `${latestCmd.id}-content`,
                          area: "marketing",
                          metric: "content_status_score",
                          value: latestCmd.content_status_score,
                          detail: latestCmd.metric_date,
                      },
                      {
                          id: `${latestCmd.id}-publishing`,
                          area: "marketing",
                          metric: "publishing_status_score",
                          value: latestCmd.publishing_status_score,
                          detail: latestCmd.metric_date,
                      },
                      {
                          id: `${latestCmd.id}-growth`,
                          area: "executive",
                          metric: "growth_metrics_score",
                          value: latestCmd.growth_metrics_score,
                          detail: latestCmd.metric_date,
                      },
                      {
                          id: `${latestCmd.id}-campaign`,
                          area: "sales",
                          metric: "campaign_health_score",
                          value: latestCmd.campaign_health_score,
                          detail: latestCmd.metric_date,
                      },
                  ]
                : []),
            ...data.contentPerformance.slice(0, 6).map((c) => ({
                id: c.id,
                area: "marketing",
                metric: "content_performance",
                value: c.performance_score,
                detail: c.performance_title,
            })),
            ...data.churnPredictions.slice(0, 6).map((c) => ({
                id: c.id,
                area: "customer_success",
                metric: "churn_probability",
                value: c.churn_probability,
                detail: c.name,
            })),
        ],
    };
}

export function createEmptyGrowthOsIntelligenceSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): GrowthOsIntelligenceSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        founder: {
            dailyBrief: "",
            weeklyReport: "",
            monthlyBoardReport: "",
            scorecards: [],
            alerts: [],
            executiveSummaries: [],
        },
        marketing: {
            seoRankings: [],
            organicTrafficTrends: [],
            contentPerformance: [],
            socialEngagement: [],
            videoPerformance: [],
            emailPerformance: [],
            channelComparison: [],
        },
        revenue: {
            cacUsd: null,
            ltvUsd: null,
            mrrUsd: 0,
            arrUsd: 0,
            trialToPaidPercent: null,
            retentionPercent: null,
            churnAnalysis: [],
            referralPerformance: { referralLeads: 0, referralConverted: 0, referralRatePercent: null },
            highChurnCount: 0,
            expansionCount: 0,
        },
        forecasting: {
            trafficProjections: [],
            leadForecasts: [],
            revenueForecasts: [],
            conversionForecasts: [],
            scenarios: [],
        },
        recommendations: {
            recommendations: [],
            seoOpportunities: [],
            contentRecommendations: [],
            publishingTimeRecommendations: [],
            campaignOptimization: [],
            nurtureSuggestions: [],
            expansionOpportunities: [],
        },
        dashboard: {
            growthHealthScore: null,
            executive: [],
            marketing: [],
            sales: [],
            customerSuccess: [],
            drilldowns: [],
        },
    };
}

export function buildGrowthOsIntelligenceSnapshot(data: GrowthOsIntelligenceRawData): GrowthOsIntelligenceSnapshot {
    const founder = buildFounderExecutiveIntelligence(data);
    const marketing = buildMarketingIntelligence(data);
    const revenue = buildRevenueIntelligence(data);
    const forecasting = buildGrowthForecasting(data);
    const recommendations = buildAiRecommendationEngine(data);
    const dashboard = buildUnifiedIntelligenceDashboard(data, revenue, marketing);

    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        founder,
        marketing,
        revenue,
        forecasting,
        recommendations,
        dashboard,
    };
}
