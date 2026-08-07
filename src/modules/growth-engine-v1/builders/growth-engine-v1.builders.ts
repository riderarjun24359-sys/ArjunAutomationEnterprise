import { growthEngineV1DeniedMessage } from "../access";
import type {
    CustomerLifecycle,
    FounderGrowthDashboard,
    GrowthAnalytics,
    GrowthEngineV1RawData,
    GrowthEngineV1Snapshot,
    MarketingCrm,
    SalesPipeline,
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

function isActiveCampaign(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("active") || s.includes("running") || s.includes("live");
}

function isTrial(status: string, paymentStatus: string): boolean {
    return status.toLowerCase().includes("trial") || paymentStatus.toLowerCase().includes("trial");
}

function isPaid(status: string, paymentStatus: string): boolean {
    const s = `${status} ${paymentStatus}`.toLowerCase();
    return s.includes("paid") || s.includes("active") || s.includes("current");
}

function isWon(outcome: string): boolean {
    return outcome.toLowerCase().includes("win") || outcome.toLowerCase() === "won";
}

function isLost(outcome: string): boolean {
    return outcome.toLowerCase().includes("loss") || outcome.toLowerCase() === "lost";
}

function isReferral(source: string): boolean {
    return source.toLowerCase().includes("refer");
}

function isPaidPayment(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("paid") || s.includes("success") || s.includes("complete");
}

function startOfTodayMs(): number {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function emptyMarketing(): MarketingCrm {
    return {
        leads: [],
        campaigns: [],
        attributions: [],
        sourceBuckets: [],
        totalLeads: 0,
        convertedLeads: 0,
        conversionRatePercent: null,
        activeCampaigns: 0,
    };
}

function emptySales(): SalesPipeline {
    return {
        stages: [],
        opportunities: [],
        proposals: [],
        followUps: [],
        overdueFollowUps: 0,
        winLoss: [],
        winRatePercent: null,
        pipelineValueUsd: 0,
    };
}

function emptyLifecycle(): CustomerLifecycle {
    return {
        trialSubscriptions: [],
        paidSubscriptions: [],
        trialToPaidRatePercent: null,
        churnPredictions: [],
        highChurnCount: 0,
        renewals: [],
        expansions: [],
        lifecycleStages: [],
    };
}

function emptyAnalytics(): GrowthAnalytics {
    return {
        cacUsd: null,
        ltvUsd: null,
        mrrUsd: 0,
        arrUsd: 0,
        activationRatePercent: null,
        retentionRatePercent: null,
        referralRatePercent: null,
        newMrrUsd: 0,
        churnMrrUsd: 0,
    };
}

function emptyFounder(): FounderGrowthDashboard {
    return {
        dailyRevenueUsd: 0,
        newOrganizationsToday: 0,
        newOrganizations7d: 0,
        activeUsers: 0,
        funnel: [],
        alerts: [],
        summary: "",
    };
}

export function createEmptyGrowthEngineV1Snapshot(
    accessGranted: boolean,
    reason?: string,
): GrowthEngineV1Snapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason ?? (accessGranted ? undefined : growthEngineV1DeniedMessage()),
        fetchedAt: new Date().toISOString(),
        marketing: emptyMarketing(),
        sales: emptySales(),
        lifecycle: emptyLifecycle(),
        analytics: emptyAnalytics(),
        founder: emptyFounder(),
    };
}

export function buildMarketingCrm(data: GrowthEngineV1RawData): MarketingCrm {
    const leads = data.salesLeads.map((l) => ({
        id: l.id,
        name: l.lead_name,
        company: l.company_name,
        email: l.email,
        source: l.source,
        status: l.status,
        score: l.score,
        createdAt: l.created_at,
    }));
    const convertedLeads = leads.filter((l) => isConvertedLead(l.status)).length;
    const sourceMap = new Map<string, { leads: number; converted: number }>();
    for (const lead of leads) {
        const key = lead.source?.trim() || "unknown";
        const bucket = sourceMap.get(key) ?? { leads: 0, converted: 0 };
        bucket.leads += 1;
        if (isConvertedLead(lead.status)) bucket.converted += 1;
        sourceMap.set(key, bucket);
    }

    return {
        leads,
        campaigns: data.campaigns.map((c) => ({
            id: c.id,
            name: c.campaign_name,
            channel: c.channel_type,
            status: c.status,
            startsAt: c.starts_at ?? null,
            endsAt: c.ends_at ?? null,
        })),
        attributions: data.attributions.map((a) => ({
            id: a.id,
            title: a.attribution_title,
            channel: a.channel_ref,
            conversionRate: a.conversion_rate,
            status: a.attribution_status || a.status,
        })),
        sourceBuckets: [...sourceMap.entries()].map(([source, v]) => ({
            source,
            leads: v.leads,
            converted: v.converted,
            conversionRatePercent: v.leads ? pct((v.converted / v.leads) * 100) : null,
        })),
        totalLeads: leads.length,
        convertedLeads,
        conversionRatePercent: leads.length ? pct((convertedLeads / leads.length) * 100) : null,
        activeCampaigns: data.campaigns.filter((c) => isActiveCampaign(c.status)).length,
    };
}

export function buildSalesPipeline(data: GrowthEngineV1RawData): SalesPipeline {
    const stageNameById = new Map(data.pipelineStages.map((s) => [s.id, s.name]));
    const opportunities = data.opportunities.map((o) => ({
        id: o.id,
        name: o.name,
        amount: o.amount,
        probability: o.probability,
        status: o.status,
        expectedCloseDate: o.expected_close_date ?? null,
    }));

    const stageBuckets = new Map<string, { count: number; amountUsd: number }>();
    for (const opp of data.opportunities) {
        const stage =
            (opp.stage_id && stageNameById.get(opp.stage_id)) ||
            opp.status ||
            "Unstaged";
        const bucket = stageBuckets.get(stage) ?? { count: 0, amountUsd: 0 };
        bucket.count += 1;
        bucket.amountUsd += opp.amount;
        stageBuckets.set(stage, bucket);
    }

    const now = Date.now();
    const followUps = data.activities.map((a) => ({
        id: a.id,
        subject: a.subject,
        activityType: a.activity_type,
        dueAt: a.due_at ?? null,
        completedAt: a.completed_at ?? null,
        opportunityId: a.opportunity_id ?? null,
    }));
    const overdueFollowUps = followUps.filter(
        (f) => !f.completedAt && f.dueAt && Date.parse(f.dueAt) < now,
    ).length;

    const wins = data.winLoss.filter((w) => isWon(w.outcome)).length;
    const losses = data.winLoss.filter((w) => isLost(w.outcome)).length;
    const decided = wins + losses;

    return {
        stages: [...stageBuckets.entries()].map(([stage, v]) => ({
            stage,
            count: v.count,
            amountUsd: money(v.amountUsd),
        })),
        opportunities,
        proposals: data.quotes.map((q) => ({
            id: q.id,
            title: q.title,
            quoteNumber: q.quote_number,
            amount: q.total_amount,
            status: q.status,
            validUntil: q.valid_until ?? null,
        })),
        followUps,
        overdueFollowUps,
        winLoss: data.winLoss.map((w) => ({
            id: w.id,
            outcome: w.outcome,
            reason: w.reason,
            amount: w.amount,
            competitor: w.competitor,
            recordedAt: w.recorded_at,
        })),
        winRatePercent: decided ? pct((wins / decided) * 100) : null,
        pipelineValueUsd: money(opportunities.reduce((sum, o) => sum + o.amount, 0)),
    };
}

export function buildCustomerLifecycle(data: GrowthEngineV1RawData): CustomerLifecycle {
    const mapped = data.subscriptions.map((s) => ({
        id: s.id,
        planName: s.plan_name,
        status: s.status,
        paymentStatus: s.payment_status,
        mrrUsd: s.mrr_usd,
        startsAt: s.starts_at ?? null,
        createdAt: s.created_at,
    }));
    const trialSubscriptions = mapped.filter((s) => isTrial(s.status, s.paymentStatus));
    const paidSubscriptions = mapped.filter((s) => isPaid(s.status, s.paymentStatus) && !isTrial(s.status, s.paymentStatus));
    const lifecycleDenom = trialSubscriptions.length + paidSubscriptions.length;

    const stageMap = new Map<string, number>();
    for (const row of data.lifecycles) {
        const key = row.current_stage || "unknown";
        stageMap.set(key, (stageMap.get(key) ?? 0) + 1);
    }

    const churnPredictions = data.churnPredictions.map((c) => ({
        id: c.id,
        name: c.name,
        probability: c.churn_probability,
        status: c.status,
    }));

    return {
        trialSubscriptions,
        paidSubscriptions,
        trialToPaidRatePercent: lifecycleDenom ? pct((paidSubscriptions.length / lifecycleDenom) * 100) : null,
        churnPredictions,
        highChurnCount: churnPredictions.filter((c) => c.probability >= 0.5).length,
        renewals: data.renewals.map((r) => ({
            id: r.id,
            name: r.name,
            renewalDate: r.renewal_date ?? null,
            valueUsd: r.renewal_value_usd,
            status: r.status,
        })),
        expansions: data.expansions.map((e) => ({
            id: e.id,
            name: e.name,
            type: e.opportunity_type,
            estimatedValueUsd: e.estimated_value_usd,
            status: e.status,
        })),
        lifecycleStages: [...stageMap.entries()].map(([stage, count]) => ({ stage, count })),
    };
}

export function buildGrowthAnalytics(data: GrowthEngineV1RawData): GrowthAnalytics {
    const latestMrr = [...data.mrrSnapshots].sort((a, b) => Date.parse(b.snapshot_date) - Date.parse(a.snapshot_date))[0];
    const latestArr = [...data.arrSnapshots].sort((a, b) => Date.parse(b.snapshot_date) - Date.parse(a.snapshot_date))[0];
    const mrrUsd = latestMrr?.mrr_usd ?? money(data.subscriptions.reduce((s, x) => s + x.mrr_usd, 0));
    const arrUsd = latestArr?.arr_usd ?? money(data.subscriptions.reduce((s, x) => s + x.arr_usd, 0) || mrrUsd * 12);

    const converted = data.salesLeads.filter((l) => isConvertedLead(l.status)).length;
    const spendProxy = data.campaignMetrics.reduce((s, m) => s + m.sent_count, 0);
    const cacUsd =
        converted > 0 && spendProxy > 0
            ? money(spendProxy / converted)
            : data.growthKpis.find((k) => k.kpi_name.toLowerCase().includes("cac"))?.kpi_value ?? null;

    const avgAdoption = avg(data.adoption.map((a) => a.adoption_percent));
    const paidCount = data.subscriptions.filter((s) => isPaid(s.status, s.payment_status)).length;
    const churned = data.subscriptions.filter((s) => s.status.toLowerCase().includes("churn") || s.status.toLowerCase().includes("cancel")).length;
    const retentionRatePercent =
        paidCount + churned > 0 ? pct((paidCount / (paidCount + churned)) * 100) : avgAdoption;

    const referralLeads = data.salesLeads.filter((l) => isReferral(l.source)).length;
    const referralRatePercent = data.salesLeads.length
        ? pct((referralLeads / data.salesLeads.length) * 100)
        : null;

    const ltvFromKpi = data.growthKpis.find((k) => k.kpi_name.toLowerCase().includes("ltv"))?.kpi_value;
    const ltvUsd =
        ltvFromKpi != null
            ? money(ltvFromKpi)
            : retentionRatePercent != null && mrrUsd > 0
              ? money(mrrUsd * Math.max(retentionRatePercent / 10, 1))
              : mrrUsd > 0
                ? money(mrrUsd * 12)
                : null;

    return {
        cacUsd: cacUsd != null ? money(Number(cacUsd)) : null,
        ltvUsd,
        mrrUsd: money(mrrUsd),
        arrUsd: money(arrUsd),
        activationRatePercent: avgAdoption,
        retentionRatePercent,
        referralRatePercent,
        newMrrUsd: money(latestMrr?.new_mrr_usd ?? 0),
        churnMrrUsd: money(latestMrr?.churn_mrr_usd ?? 0),
    };
}

export function buildFounderGrowthDashboard(
    data: GrowthEngineV1RawData,
    marketing: MarketingCrm,
    analytics: GrowthAnalytics,
    lifecycle: CustomerLifecycle,
): FounderGrowthDashboard {
    const todayStart = startOfTodayMs();
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
    const dailyRevenueUsd = money(
        data.payments
            .filter((p) => isPaidPayment(p.status) && Date.parse(p.payment_date || p.created_at) >= todayStart)
            .reduce((s, p) => s + p.amount, 0),
    );
    const newOrganizationsToday = data.organizations.filter((o) => Date.parse(o.created_at) >= todayStart).length;
    const newOrganizations7d = data.organizations.filter((o) => Date.parse(o.created_at) >= weekStart).length;
    const activeUsers = data.memberships.filter((m) => m.is_active).length;

    const funnelCounts = [
        { step: "Leads captured", count: marketing.totalLeads },
        { step: "Qualified / converted", count: marketing.convertedLeads },
        { step: "Opportunities", count: data.opportunities.length },
        { step: "Paid subscriptions", count: lifecycle.paidSubscriptions.length },
    ];
    const funnel = funnelCounts.map((step, idx) => {
        const prev = idx === 0 ? null : funnelCounts[idx - 1].count;
        return {
            ...step,
            conversionFromPreviousPercent: prev && prev > 0 ? pct((step.count / prev) * 100) : idx === 0 ? null : 0,
        };
    });

    const alerts = [];
    if (lifecycle.highChurnCount > 0) {
        alerts.push({
            id: "churn-risk",
            severity: "critical" as const,
            title: "Churn risk elevated",
            detail: `${lifecycle.highChurnCount} customers with ≥50% churn probability.`,
        });
    }
    if (analytics.churnMrrUsd > 0 && analytics.churnMrrUsd >= analytics.newMrrUsd) {
        alerts.push({
            id: "mrr-churn",
            severity: "warning" as const,
            title: "Churn MRR exceeds new MRR",
            detail: `Churn $${analytics.churnMrrUsd} vs new $${analytics.newMrrUsd}.`,
        });
    }
    if (marketing.conversionRatePercent != null && marketing.conversionRatePercent < 10 && marketing.totalLeads >= 5) {
        alerts.push({
            id: "lead-conversion",
            severity: "warning" as const,
            title: "Lead conversion soft",
            detail: `Conversion at ${marketing.conversionRatePercent}% across ${marketing.totalLeads} leads.`,
        });
    }
    if (alerts.length === 0) {
        alerts.push({
            id: "growth-stable",
            severity: "info" as const,
            title: "Growth signals stable",
            detail: "No critical acquisition or revenue alerts from live data.",
        });
    }

    const summary = [
        `Daily revenue $${dailyRevenueUsd}.`,
        `New orgs today ${newOrganizationsToday} (7d ${newOrganizations7d}).`,
        `Active users ${activeUsers}.`,
        `MRR $${analytics.mrrUsd} · ARR $${analytics.arrUsd}.`,
        `Lead conversion ${marketing.conversionRatePercent ?? "n/a"}%.`,
    ].join(" ");

    return {
        dailyRevenueUsd,
        newOrganizationsToday,
        newOrganizations7d,
        activeUsers,
        funnel,
        alerts,
        summary,
    };
}

export function buildGrowthEngineV1Snapshot(data: GrowthEngineV1RawData): GrowthEngineV1Snapshot {
    const marketing = buildMarketingCrm(data);
    const sales = buildSalesPipeline(data);
    const lifecycle = buildCustomerLifecycle(data);
    const analytics = buildGrowthAnalytics(data);
    const founder = buildFounderGrowthDashboard(data, marketing, analytics, lifecycle);
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        marketing,
        sales,
        lifecycle,
        analytics,
        founder,
    };
}

export const gev1Pure = {
    isConvertedLead,
    isReferral,
    isWon,
    isLost,
    isTrial,
    isPaid,
    money,
    pct,
};
