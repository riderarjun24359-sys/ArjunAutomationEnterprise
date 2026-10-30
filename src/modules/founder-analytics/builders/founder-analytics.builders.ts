import { getRecentAlerts } from "@/src/lib/ops-monitoring";
import { founderAccessDeniedMessage } from "../access";
import type {
    BoardRoomSnapshot,
    FounderAdvisorBriefing,
    FounderAlert,
    FounderAnalyticsRawData,
    FounderAnalyticsSnapshot,
    FounderCustomerIntelligence,
    FounderExecutiveDashboard,
    FounderGrowthCenter,
} from "../types";

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

function pct(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 10) / 10;
}

function daysAgo(days: number): number {
    return Date.now() - days * 24 * 60 * 60 * 1000;
}

function isTrialStatus(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("trial");
}

function isActiveStatus(status: string): boolean {
    const s = status.toLowerCase();
    return s === "active" || s === "paid" || s === "current";
}

function isChurnedStatus(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("churn") || s.includes("cancel") || s === "expired" || s === "inactive";
}

function isFailedPayment(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("fail") || s.includes("declin") || s.includes("error");
}

function isPaidPayment(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("paid") || s.includes("success") || s.includes("succeeded") || s.includes("complete");
}

function classifyLeadSource(source: string): "paid" | "referral" | "organic" | "other" {
    const s = source.toLowerCase();
    if (s.includes("refer")) return "referral";
    if (s.includes("paid") || s.includes("ads") || s.includes("cpc") || s.includes("ppc") || s.includes("facebook") || s.includes("google ads")) {
        return "paid";
    }
    if (s.includes("organic") || s.includes("seo") || s.includes("website") || s.includes("landing") || s.includes("direct")) {
        return "organic";
    }
    return "other";
}

function trendFromValues(current: number, previous: number): "up" | "down" | "flat" {
    if (current > previous * 1.02) return "up";
    if (current < previous * 0.98) return "down";
    return "flat";
}

export function createEmptyFounderAnalyticsSnapshot(accessGranted: boolean, reason?: string): FounderAnalyticsSnapshot {
    const now = new Date().toISOString();
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason,
        fetchedAt: now,
        executive: {
            mrrUsd: 0,
            arrUsd: 0,
            cashFlowUsd: 0,
            newOrganizations: 0,
            activeOrganizations: 0,
            trialToPaidConversionPercent: 0,
            churnRatePercent: 0,
            retentionPercent: 0,
            npsScore: null,
            customerSatisfactionAvg: null,
            revenueForecastUsd: 0,
            mrrTrend: "flat",
            activeSubscriptions: 0,
            trialSubscriptions: 0,
            paidSubscriptions: 0,
        },
        growth: {
            acquisitionChannels: [],
            landingPageConversions: 0,
            landingConversionRatePercent: 0,
            referralLeads: 0,
            campaigns: [],
            organicLeads: 0,
            paidLeads: 0,
            cacUsd: null,
            ltvUsd: null,
            ltvToCac: null,
            growthScore: null,
        },
        customers: {
            averageHealthScore: 0,
            healthOverview: [],
            expansionOpportunities: [],
            churnWatchlist: [],
            topCustomers: [],
            inactiveCustomers: [],
            adoptionHeatmap: [],
        },
        alerts: [],
        advisor: {
            dailyBriefing: "No live organization context available.",
            businessRisks: [],
            growthOpportunities: [],
            revenueRecommendations: [],
            weeklyExecutiveSummary: "Awaiting live Supabase data.",
            generatedAt: now,
        },
        board: {
            investorKpis: [],
            saasMetrics: [],
            executiveReportLines: [],
            monthlyBusinessSnapshot: "No data.",
            generatedAt: now,
        },
    };
}

export function buildExecutiveDashboard(data: FounderAnalyticsRawData): FounderExecutiveDashboard {
    const latestMrr = data.mrrSnapshots[0];
    const mrrFromSubs = data.subscriptions.filter((s) => isActiveStatus(s.status)).reduce((sum, s) => sum + s.mrr_usd, 0);
    const mrrUsd = money(Number(latestMrr?.mrr_usd ?? mrrFromSubs));
    const arrUsd = money(Number(data.arrSnapshots[0]?.arr_usd ?? mrrUsd * 12));

    const collected = data.payments.filter((p) => isPaidPayment(p.status)).reduce((s, p) => s + p.amount, 0);
    const outstanding = data.invoices.reduce((s, i) => s + i.amount_due, 0);
    const cashFlowUsd = money(collected - outstanding);

    const cutoff30 = daysAgo(30);
    const newOrganizations = data.organizations.filter((o) => Date.parse(o.created_at) >= cutoff30).length
        || data.billingAccounts.filter((a) => Date.parse(a.created_at) >= cutoff30).length;
    const activeOrganizations =
        data.organizations.filter((o) => isActiveStatus(o.status)).length ||
        data.billingAccounts.filter((a) => isActiveStatus(a.status)).length ||
        data.subscriptions.filter((s) => isActiveStatus(s.status)).length;

    const trialSubscriptions = data.subscriptions.filter((s) => isTrialStatus(s.status) || isTrialStatus(s.plan_name)).length;
    const paidSubscriptions = data.subscriptions.filter((s) => isActiveStatus(s.status) && !isTrialStatus(s.status) && !isTrialStatus(s.plan_name)).length;
    const activeSubscriptions = data.subscriptions.filter((s) => isActiveStatus(s.status) || isTrialStatus(s.status)).length;
    const churned = data.subscriptions.filter((s) => isChurnedStatus(s.status)).length;
    const conversionBase = trialSubscriptions + paidSubscriptions;
    const trialToPaidConversionPercent = conversionBase > 0 ? pct((paidSubscriptions / conversionBase) * 100) : 0;
    const denom = activeSubscriptions + churned;
    const churnRatePercent = denom > 0 ? pct((churned / denom) * 100) : pct(Number(latestMrr?.churn_mrr_usd ?? 0) > 0 && mrrUsd > 0 ? (Number(latestMrr?.churn_mrr_usd) / mrrUsd) * 100 : 0);
    const retentionPercent = pct(Math.max(0, 100 - churnRatePercent));

    const sat = data.satisfaction;
    const customerSatisfactionAvg = sat.length
        ? pct(sat.reduce((s, r) => s + r.rating, 0) / sat.length)
        : data.feedbackAnalyses.length
          ? pct(data.feedbackAnalyses.reduce((s, f) => s + Number(f.sentiment_score ?? 0), 0) / data.feedbackAnalyses.length)
          : null;

    // NPS proxy from CSAT (1–5 → -100..100) when explicit NPS rows are absent
    const npsScore =
        sat.length > 0
            ? Math.round(
                  ((sat.filter((r) => r.rating >= 4).length - sat.filter((r) => r.rating <= 2).length) / sat.length) * 100,
              )
            : null;

    const forecast = data.mrrForecasts[0];
    const revenueForecastUsd = money(Number(forecast?.projected_mrr_usd ?? mrrUsd) * 12);

    return {
        mrrUsd,
        arrUsd,
        cashFlowUsd,
        newOrganizations,
        activeOrganizations,
        trialToPaidConversionPercent,
        churnRatePercent,
        retentionPercent,
        npsScore,
        customerSatisfactionAvg,
        revenueForecastUsd,
        mrrTrend: trendFromValues(mrrUsd, Number(latestMrr?.previous_mrr_usd ?? mrrUsd)),
        activeSubscriptions,
        trialSubscriptions,
        paidSubscriptions,
    };
}

export function buildGrowthCenter(data: FounderAnalyticsRawData): FounderGrowthCenter {
    const channelMap = new Map<string, number>();
    let organic = 0;
    let paid = 0;
    let referral = 0;
    let landing = 0;

    for (const lead of data.salesLeads) {
        const channel = lead.source?.trim() || "unknown";
        channelMap.set(channel, (channelMap.get(channel) ?? 0) + 1);
        const kind = classifyLeadSource(channel);
        if (kind === "organic") organic += 1;
        if (kind === "paid") paid += 1;
        if (kind === "referral") referral += 1;
        if (kind === "organic" || channel.toLowerCase().includes("landing") || channel.toLowerCase().includes("website")) {
            landing += 1;
        }
    }

    const totalLeads = data.salesLeads.length;
    const acquisitionChannels = [...channelMap.entries()]
        .map(([channel, leads]) => ({
            channel,
            leads,
            sharePercent: totalLeads > 0 ? pct((leads / totalLeads) * 100) : 0,
        }))
        .sort((a, b) => b.leads - a.leads)
        .slice(0, 12);

    const converted = data.salesLeads.filter((l) => {
        const s = l.status.toLowerCase();
        return s.includes("won") || s.includes("converted") || s.includes("qualified") || s.includes("customer");
    }).length;
    const landingConversionRatePercent = landing > 0 ? pct((converted / Math.max(landing, 1)) * 100) : totalLeads > 0 ? pct((converted / totalLeads) * 100) : 0;

    const campaigns = data.campaigns.slice(0, 20).map((c) => {
        const deliveries = data.campaignDeliveries.filter((d) => d.campaign_id === c.id);
        const metrics = data.campaignMetrics.filter((m) => m.campaign_id === c.id);
        const sent = metrics.reduce((s, m) => s + Number(m.sent_count ?? 0), 0) || deliveries.length;
        const delivered =
            metrics.reduce((s, m) => s + Number(m.delivered_count ?? 0), 0) ||
            deliveries.filter((d) => d.delivery_status.toLowerCase().includes("deliver") || d.delivery_status.toLowerCase().includes("sent")).length;
        return {
            id: c.id,
            name: c.campaign_name,
            channel: c.channel_type,
            status: c.status,
            deliveries: sent,
            successRatePercent: sent > 0 ? pct((delivered / sent) * 100) : 0,
        };
    });

    const mrr = data.subscriptions.filter((s) => isActiveStatus(s.status)).reduce((s, x) => s + x.mrr_usd, 0);
    const paidSubs = data.subscriptions.filter((s) => isActiveStatus(s.status) && !isTrialStatus(s.status)).length;
    const arpu = paidSubs > 0 ? mrr / paidSubs : mrr;
    const latestMrr = data.mrrSnapshots[0];
    const churnRate =
        mrr > 0 && latestMrr ? Number(latestMrr.churn_mrr_usd ?? 0) / mrr : 0;
    const ltvUsd = churnRate > 0 ? money(arpu / churnRate) : arpu > 0 ? money(arpu * 12) : null;

    // CAC requires spend data — only compute when campaign metrics imply cost proxies are unavailable → null (no invented spend)
    const cacUsd: number | null = null;
    const ltvToCac = cacUsd && ltvUsd ? money(ltvUsd / cacUsd) : null;

    return {
        acquisitionChannels,
        landingPageConversions: converted,
        landingConversionRatePercent,
        referralLeads: referral,
        campaigns,
        organicLeads: organic,
        paidLeads: paid,
        cacUsd,
        ltvUsd,
        ltvToCac,
        growthScore: data.growthMetrics[0] ? Number(data.growthMetrics[0].overall_growth_score) : null,
    };
}

export function buildCustomerIntelligence(data: FounderAnalyticsRawData, executive: FounderExecutiveDashboard): FounderCustomerIntelligence {
    const healthOverview = data.healthScores
        .map((h) => ({
            id: h.id,
            name: h.name,
            healthScore: Number(h.overall_score ?? 0),
            status: h.status,
        }))
        .sort((a, b) => b.healthScore - a.healthScore)
        .slice(0, 20);

    const averageHealthScore = healthOverview.length
        ? pct(healthOverview.reduce((s, h) => s + h.healthScore, 0) / healthOverview.length)
        : 0;

    const expansionOpportunities = data.expansions
        .filter((e) => !["closed", "lost", "rejected"].includes(e.status.toLowerCase()))
        .map((e) => ({
            id: e.id,
            name: e.name,
            estimatedValueUsd: money(e.estimated_value_usd),
            type: e.opportunity_type,
            status: e.status,
        }))
        .sort((a, b) => b.estimatedValueUsd - a.estimatedValueUsd)
        .slice(0, 15);

    const fromChurn = data.churnPredictions
        .map((c) => {
            const prob = c.churn_probability <= 1 ? c.churn_probability * 100 : c.churn_probability;
            return {
                id: c.id,
                name: c.name,
                healthScore: pct(100 - prob),
                status: `churn ${pct(prob)}%`,
            };
        })
        .filter((c) => c.healthScore < 60);

    const fromHealth = healthOverview.filter((h) => h.healthScore < 50);
    const churnWatchlist = [...fromChurn, ...fromHealth].slice(0, 15);

    const mrrByAccount = new Map<string, number>();
    for (const sub of data.subscriptions) {
        const account = data.billingAccounts.find((a) => a.id === sub.billing_account_id);
        const name = account?.account_name || sub.plan_name || "Subscription";
        mrrByAccount.set(name, money((mrrByAccount.get(name) ?? 0) + sub.mrr_usd));
    }
    const topFromBilling = [...mrrByAccount.entries()]
        .map(([name, mrrUsd]) => ({ name, mrrUsd, outstandingUsd: 0 }))
        .sort((a, b) => b.mrrUsd - a.mrrUsd)
        .slice(0, 8);

    const topFromClients = data.clients
        .map((c) => ({
            name: c.name,
            mrrUsd: 0,
            outstandingUsd: 0,
        }))
        .slice(0, 0);

    const topCustomers = topFromBilling.length ? topFromBilling : topFromClients;

    const inactiveCutoff = daysAgo(60);
    const inactiveCustomers = data.clients
        .filter((c) => {
            const inactive = c.status.toLowerCase().includes("inactive") || c.status.toLowerCase().includes("churn");
            const stale = Date.parse(c.updated_at) < inactiveCutoff;
            return inactive || stale;
        })
        .map((c) => ({
            id: c.id,
            name: c.name,
            healthScore: 0,
            status: c.status,
        }))
        .slice(0, 15);

    const adoptionHeatmap = data.adoption
        .map((a) => ({
            label: a.name,
            value: Number(a.adoption_score ?? 0),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 16);

    void executive;
    return {
        averageHealthScore,
        healthOverview: healthOverview.slice(0, 12),
        expansionOpportunities,
        churnWatchlist,
        topCustomers,
        inactiveCustomers,
        adoptionHeatmap,
    };
}

export function buildFounderAlerts(data: FounderAnalyticsRawData, executive: FounderExecutiveDashboard): FounderAlert[] {
    const alerts: FounderAlert[] = [];
    const now = new Date().toISOString();

    if (executive.mrrTrend === "down") {
        alerts.push({
            id: "revenue-drop",
            category: "revenue",
            severity: "high",
            title: "Revenue drop detected",
            detail: `MRR trend is down at ₹${executive.mrrUsd.toLocaleString()} vs prior snapshot.`,
            detectedAt: now,
        });
    }

    const failed = data.paymentAttempts.filter((p) => isFailedPayment(p.payment_status) || isFailedPayment(p.status));
    for (const p of failed.slice(0, 5)) {
        alerts.push({
            id: `pay-fail-${p.attempted_at}-${p.amount_usd}`,
            category: "payment",
            severity: "critical",
            title: "Failed payment",
            detail: `₹${money(p.amount_usd).toLocaleString()} — ${p.failure_reason || p.payment_status}`,
            detectedAt: p.attempted_at || now,
        });
    }

    for (const alert of getRecentAlerts(20).filter((a) => a.severity === "critical" || a.severity === "warning")) {
        alerts.push({
            id: `ops-${alert.id}`,
            category: "incident",
            severity: alert.severity === "critical" ? "critical" : "high",
            title: alert.title,
            detail: alert.detail,
            detectedAt: alert.createdAt,
        });
    }

    const cutoff7 = daysAgo(7);
    for (const lead of data.salesLeads.filter((l) => l.score >= 70 && Date.parse(l.created_at) >= cutoff7).slice(0, 5)) {
        alerts.push({
            id: `signup-${lead.id}`,
            category: "signup",
            severity: "info",
            title: "High-value signup / lead",
            detail: `${lead.lead_name} · score ${lead.score} · ${lead.source || "unknown source"}`,
            detectedAt: lead.created_at,
        });
    }

    for (const sub of data.subscriptions.filter((s) => isTrialStatus(s.status) || isTrialStatus(s.plan_name)).slice(0, 5)) {
        const ends = sub.ends_at ? Date.parse(sub.ends_at) : NaN;
        if (Number.isFinite(ends) && ends - Date.now() < 14 * 24 * 60 * 60 * 1000) {
            alerts.push({
                id: `trial-${sub.id}`,
                category: "trial",
                severity: "medium",
                title: "Trial expiration approaching",
                detail: `${sub.plan_name} ends ${sub.ends_at}`,
                detectedAt: now,
            });
        }
    }

    for (const threat of data.securityThreats.filter((t) => !String(t.status).toLowerCase().includes("resolv")).slice(0, 8)) {
        const sev = String(threat.severity ?? "medium").toLowerCase();
        alerts.push({
            id: `sec-${threat.id}`,
            category: "security",
            severity: sev.includes("crit") ? "critical" : sev.includes("high") ? "high" : "medium",
            title: String(threat.title ?? "Security alert"),
            detail: `Status: ${threat.status ?? "open"}`,
            detectedAt: String(threat.created_at ?? now),
        });
    }

    return alerts.sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt)).slice(0, 40);
}

export function buildAdvisorBriefing(
    executive: FounderExecutiveDashboard,
    growth: FounderGrowthCenter,
    customers: FounderCustomerIntelligence,
    alerts: FounderAlert[],
): FounderAdvisorBriefing {
    const now = new Date().toISOString();
    const critical = alerts.filter((a) => a.severity === "critical" || a.severity === "high").length;

    const businessRisks: string[] = [];
    if (executive.churnRatePercent >= 5) businessRisks.push(`Churn at ${executive.churnRatePercent}% — prioritize retention plays.`);
    if (customers.churnWatchlist.length) businessRisks.push(`${customers.churnWatchlist.length} accounts on churn watchlist.`);
    if (critical) businessRisks.push(`${critical} high/critical founder alerts require attention.`);
    if (executive.mrrTrend === "down") businessRisks.push("MRR trend is declining versus prior snapshot.");

    const growthOpportunities: string[] = [];
    if (customers.expansionOpportunities.length) {
        const value = customers.expansionOpportunities.reduce((s, e) => s + e.estimatedValueUsd, 0);
        growthOpportunities.push(`₹${value.toLocaleString()} expansion pipeline across ${customers.expansionOpportunities.length} opportunities.`);
    }
    if (growth.referralLeads > 0) growthOpportunities.push(`Referral channel delivering ${growth.referralLeads} leads — amplify referral program.`);
    if (growth.organicLeads > growth.paidLeads) growthOpportunities.push("Organic acquisition outpaces paid — double down on SEO/content.");
    if (executive.trialSubscriptions > 0) {
        growthOpportunities.push(`${executive.trialSubscriptions} trials in flight — conversion focus can lift paid MRR.`);
    }

    const revenueRecommendations: string[] = [];
    if (executive.trialToPaidConversionPercent < 25 && executive.trialSubscriptions > 0) {
        revenueRecommendations.push("Improve trial→paid conversion with onboarding nudges and upgrade CTAs.");
    }
    if (executive.cashFlowUsd < 0) revenueRecommendations.push("Cash flow negative vs outstanding — accelerate collections.");
    if (growth.ltvUsd) revenueRecommendations.push(`Blended LTV ≈ ₹${growth.ltvUsd.toLocaleString()} — protect retention to compound ARR.`);
    if (!revenueRecommendations.length) revenueRecommendations.push("Maintain current pricing discipline and expand top healthy accounts.");

    const dailyBriefing = [
        `MRR ₹${executive.mrrUsd.toLocaleString()} (${executive.mrrTrend}) · ARR ₹${executive.arrUsd.toLocaleString()}.`,
        `Active orgs ${executive.activeOrganizations} · new (30d) ${executive.newOrganizations}.`,
        `Retention ${executive.retentionPercent}% · churn ${executive.churnRatePercent}%.`,
        critical ? `${critical} priority alerts open.` : "No critical founder alerts.",
    ].join(" ");

    const weeklyExecutiveSummary = [
        `Weekly snapshot: forecast ARR ₹${executive.revenueForecastUsd.toLocaleString()}.`,
        `Growth score ${growth.growthScore ?? "n/a"} · landing conversion ${growth.landingConversionRatePercent}%.`,
        `Avg customer health ${customers.averageHealthScore}.`,
        `NPS ${executive.npsScore ?? "n/a"} · CSAT ${executive.customerSatisfactionAvg ?? "n/a"}.`,
        businessRisks[0] ?? "Risks contained.",
        growthOpportunities[0] ?? "Pipeline steady.",
    ].join(" ");

    return {
        dailyBriefing,
        businessRisks: businessRisks.length ? businessRisks : ["No elevated business risks from live signals."],
        growthOpportunities: growthOpportunities.length ? growthOpportunities : ["Continue measuring acquisition channels as lead volume grows."],
        revenueRecommendations,
        weeklyExecutiveSummary,
        generatedAt: now,
    };
}

export function buildBoardRoom(
    executive: FounderExecutiveDashboard,
    growth: FounderGrowthCenter,
    customers: FounderCustomerIntelligence,
    advisor: FounderAdvisorBriefing,
): BoardRoomSnapshot {
    const generatedAt = new Date().toISOString();
    const investorKpis = [
        { label: "MRR", value: `₹${executive.mrrUsd.toLocaleString()}`, note: `Trend ${executive.mrrTrend}` },
        { label: "ARR", value: `₹${executive.arrUsd.toLocaleString()}` },
        { label: "ARR Forecast", value: `₹${executive.revenueForecastUsd.toLocaleString()}` },
        { label: "Net cash position signal", value: `₹${executive.cashFlowUsd.toLocaleString()}`, note: "Collected − outstanding" },
        { label: "Active organizations", value: String(executive.activeOrganizations) },
        { label: "Logo retention", value: `${executive.retentionPercent}%` },
    ];

    const saasMetrics = [
        { label: "Trial → Paid", value: `${executive.trialToPaidConversionPercent}%` },
        { label: "Churn", value: `${executive.churnRatePercent}%` },
        { label: "LTV", value: growth.ltvUsd != null ? `₹${growth.ltvUsd.toLocaleString()}` : "n/a" },
        { label: "CAC", value: growth.cacUsd != null ? `₹${growth.cacUsd.toLocaleString()}` : "n/a (no spend rows)" },
        { label: "LTV:CAC", value: growth.ltvToCac != null ? String(growth.ltvToCac) : "n/a" },
        { label: "NPS", value: executive.npsScore != null ? String(executive.npsScore) : "n/a" },
        { label: "CSAT", value: executive.customerSatisfactionAvg != null ? String(executive.customerSatisfactionAvg) : "n/a" },
        { label: "Avg health", value: String(customers.averageHealthScore) },
    ];

    const executiveReportLines = [
        advisor.dailyBriefing,
        ...advisor.businessRisks.slice(0, 3).map((r) => `Risk: ${r}`),
        ...advisor.growthOpportunities.slice(0, 3).map((o) => `Opportunity: ${o}`),
        ...advisor.revenueRecommendations.slice(0, 3).map((r) => `Revenue: ${r}`),
    ];

    const monthlyBusinessSnapshot = [
        `Arjun Automation monthly snapshot @ ${generatedAt.slice(0, 10)}.`,
        `ARR ₹${executive.arrUsd.toLocaleString()} · MRR ₹${executive.mrrUsd.toLocaleString()} · Forecast ₹${executive.revenueForecastUsd.toLocaleString()}.`,
        `Customers: active orgs ${executive.activeOrganizations}, new ${executive.newOrganizations}, health ${customers.averageHealthScore}.`,
        `Growth: organic ${growth.organicLeads} / paid ${growth.paidLeads} / referral ${growth.referralLeads}.`,
        advisor.weeklyExecutiveSummary,
    ].join("\n");

    return { investorKpis, saasMetrics, executiveReportLines, monthlyBusinessSnapshot, generatedAt };
}

export function buildFounderAnalyticsSnapshot(data: FounderAnalyticsRawData): FounderAnalyticsSnapshot {
    const executive = buildExecutiveDashboard(data);
    const growth = buildGrowthCenter(data);
    const customers = buildCustomerIntelligence(data, executive);
    const alerts = buildFounderAlerts(data, executive);
    const advisor = buildAdvisorBriefing(executive, growth, customers, alerts);
    const board = buildBoardRoom(executive, growth, customers, advisor);

    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: data.fetchedAt,
        executive,
        growth,
        customers,
        alerts,
        advisor,
        board,
    };
}

export { founderAccessDeniedMessage };
