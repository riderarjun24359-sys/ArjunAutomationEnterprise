"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiRecommendationEngine,
    FounderExecutiveIntelligence,
    GrowthForecasting,
    MarketingIntelligence,
    RevenueIntelligence,
    UnifiedIntelligenceDashboard,
} from "../types";

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

function Table({ headers, rows, empty }: { headers: string[]; rows: string[][]; empty: string }) {
    if (!rows.length) {
        return <EmptyState title={empty} description="Live tenant data will appear when records exist in Supabase." />;
    }
    return (
        <div className="overflow-x-auto rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)]">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-tertiary)]">
                    <tr>
                        {headers.map((h) => (
                            <th key={h} className="px-3 py-2 font-medium">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-[var(--dos-border)]">
                            {row.map((cell, j) => (
                                <td key={j} className="px-3 py-2 text-[var(--dos-text-secondary)]">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function FounderExecutiveIntelligencePanel({ founder }: { founder: FounderExecutiveIntelligence }) {
    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Daily executive brief</h3>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{founder.dailyBrief || "—"}</p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Weekly growth report</h3>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{founder.weeklyReport || "—"}</p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Monthly board report</h3>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{founder.monthlyBoardReport || "—"}</p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">KPI scorecards</h3>
                <div className="mt-3">
                    <Table
                        headers={["KPI", "Value", "Target", "Attainment %", "Category", "Status"]}
                        rows={founder.scorecards.map((k) => [
                            k.name,
                            String(k.value),
                            String(k.target),
                            k.attainmentPercent == null ? "—" : String(k.attainmentPercent),
                            k.category,
                            k.status,
                        ])}
                        empty="No KPI scorecards"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive alerts</h3>
                <div className="mt-3">
                    <Table
                        headers={["Severity", "Title", "Detail"]}
                        rows={founder.alerts.map((a) => [a.severity, a.title, a.detail])}
                        empty="No alerts"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive summaries</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Period", "Status"]}
                        rows={founder.executiveSummaries.map((s) => [s.title, s.period, s.status])}
                        empty="No executive summaries"
                    />
                </div>
            </Card>
        </div>
    );
}

export function MarketingIntelligencePanel({ marketing }: { marketing: MarketingIntelligence }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="SEO rankings" value={marketing.seoRankings.length} />
                <Metric label="Content rows" value={marketing.contentPerformance.length} />
                <Metric label="Video assets" value={marketing.videoPerformance.length} />
                <Metric label="Email campaigns" value={marketing.emailPerformance.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">SEO rankings</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Keyword", "Intent", "Status"]}
                        rows={marketing.seoRankings.map((s) => [s.name, s.keyword, s.intent, s.status])}
                        empty="No SEO rankings"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Organic traffic trends</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Score", "Measured"]}
                        rows={marketing.organicTrafficTrends.map((t) => [t.name, String(t.score), t.measuredAt])}
                        empty="No traffic trends"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Content performance</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Score"]}
                        rows={marketing.contentPerformance.map((c) => [c.title, c.contentType, String(c.score)])}
                        empty="No content performance"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Social engagement</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Score"]}
                        rows={marketing.socialEngagement.map((s) => [s.name, s.type, String(s.score)])}
                        empty="No social engagement"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Video performance</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Duration (s)", "Status"]}
                        rows={marketing.videoPerformance.map((v) => [v.name, String(v.durationSeconds), v.status])}
                        empty="No video performance"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Email campaign performance</h3>
                <div className="mt-3">
                    <Table
                        headers={["Campaign", "Open %", "Click %", "Sent"]}
                        rows={marketing.emailPerformance.map((e) => [
                            e.name,
                            String(e.openRate),
                            String(e.clickRate),
                            String(e.sent),
                        ])}
                        empty="No email performance"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Channel comparison</h3>
                <div className="mt-3">
                    <Table
                        headers={["Channel", "Conversion %", "Items"]}
                        rows={marketing.channelComparison.map((c) => [
                            c.channel,
                            String(c.conversionRate),
                            String(c.items),
                        ])}
                        empty="No channel comparison"
                    />
                </div>
            </Card>
        </div>
    );
}

export function RevenueIntelligencePanel({ revenue }: { revenue: RevenueIntelligence }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="CAC" value={revenue.cacUsd ?? "—"} />
                <Metric label="LTV" value={revenue.ltvUsd ?? "—"} />
                <Metric label="MRR" value={revenue.mrrUsd} />
                <Metric label="ARR" value={revenue.arrUsd} />
                <Metric label="Trial→Paid %" value={revenue.trialToPaidPercent ?? "—"} />
                <Metric label="Retention %" value={revenue.retentionPercent ?? "—"} />
                <Metric label="Referral rate %" value={revenue.referralPerformance.referralRatePercent ?? "—"} />
                <Metric label="High churn" value={revenue.highChurnCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Churn analysis</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Probability", "Status"]}
                        rows={revenue.churnAnalysis.map((c) => [c.name, String(c.probability), c.status])}
                        empty="No churn predictions"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Referral performance</h3>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                    Leads {revenue.referralPerformance.referralLeads} · Converted{" "}
                    {revenue.referralPerformance.referralConverted} · Rate{" "}
                    {revenue.referralPerformance.referralRatePercent ?? "—"}%
                </p>
            </Card>
        </div>
    );
}

export function GrowthForecastingPanel({ forecasting }: { forecasting: GrowthForecasting }) {
    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Scenario planning</h3>
                <div className="mt-3">
                    <Table
                        headers={["Scenario", "Projected MRR", "Projected ARR", "Projected leads"]}
                        rows={forecasting.scenarios.map((s) => [
                            s.name,
                            String(s.projectedMrrUsd),
                            String(s.projectedArrUsd),
                            String(s.projectedLeads),
                        ])}
                        empty="No scenarios"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Revenue forecasting</h3>
                <div className="mt-3">
                    <Table
                        headers={["Label", "Kind", "Value", "Confidence %", "Period"]}
                        rows={forecasting.revenueForecasts.map((f) => [
                            f.label,
                            f.kind,
                            String(f.valueUsd),
                            String(f.confidencePercent),
                            f.period,
                        ])}
                        empty="No revenue forecasts"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Traffic projections</h3>
                <div className="mt-3">
                    <Table
                        headers={["Label", "Score", "Confidence %", "Period"]}
                        rows={forecasting.trafficProjections.map((f) => [
                            f.label,
                            String(f.valueUsd),
                            String(f.confidencePercent),
                            f.period,
                        ])}
                        empty="No traffic projections"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Lead forecasts</h3>
                <div className="mt-3">
                    <Table
                        headers={["Label", "Projected leads", "Confidence %"]}
                        rows={forecasting.leadForecasts.map((f) => [
                            f.label,
                            String(f.valueUsd),
                            String(f.confidencePercent),
                        ])}
                        empty="No lead forecasts"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Conversion forecasting</h3>
                <div className="mt-3">
                    <Table
                        headers={["Label", "Rate", "Channel/period"]}
                        rows={forecasting.conversionForecasts.map((f) => [
                            f.label,
                            String(f.valueUsd),
                            f.period,
                        ])}
                        empty="No conversion forecasts"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiRecommendationEnginePanel({ recommendations }: { recommendations: AiRecommendationEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="SEO opportunities" value={recommendations.seoOpportunities.length} />
                <Metric label="Content" value={recommendations.contentRecommendations.length} />
                <Metric label="Publishing time" value={recommendations.publishingTimeRecommendations.length} />
                <Metric label="Campaigns" value={recommendations.campaignOptimization.length} />
                <Metric label="Nurture" value={recommendations.nurtureSuggestions.length} />
                <Metric label="Expansion" value={recommendations.expansionOpportunities.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Recommendation Engine</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Category", "Type", "Confidence", "Status"]}
                        rows={recommendations.recommendations.map((r) => [
                            r.title,
                            r.category,
                            r.type,
                            String(r.confidence),
                            r.status,
                        ])}
                        empty="No recommendations"
                    />
                </div>
            </Card>
        </div>
    );
}

export function UnifiedIntelligenceDashboardPanel({ dashboard }: { dashboard: UnifiedIntelligenceDashboard }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">Growth health {dashboard.growthHealthScore ?? "—"}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {(
                    [
                        ["Executive dashboard", dashboard.executive],
                        ["Marketing dashboard", dashboard.marketing],
                        ["Sales dashboard", dashboard.sales],
                        ["Customer success dashboard", dashboard.customerSuccess],
                    ] as const
                ).map(([title, rows]) => (
                    <Card key={title}>
                        <h3 className="text-sm font-semibold text-[var(--dos-text-primary)]">{title}</h3>
                        <ul className="mt-3 space-y-2">
                            {rows.map((r) => (
                                <li key={r.label} className="flex justify-between gap-2 text-sm">
                                    <span className="text-[var(--dos-text-tertiary)]">{r.label}</span>
                                    <span className="font-medium text-[var(--dos-text-primary)]">{r.value}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Drill-down analytics</h3>
                <div className="mt-3">
                    <Table
                        headers={["Area", "Metric", "Value", "Detail"]}
                        rows={dashboard.drilldowns.map((d) => [d.area, d.metric, String(d.value), d.detail])}
                        empty="No drill-downs"
                    />
                </div>
            </Card>
        </div>
    );
}
