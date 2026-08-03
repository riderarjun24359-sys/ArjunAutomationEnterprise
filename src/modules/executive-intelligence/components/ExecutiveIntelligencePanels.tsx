"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AIX_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/executive-intelligence/constants";
import type { useExecutiveIntelligence } from "@/src/modules/executive-intelligence/hooks/useExecutiveIntelligence";
import {
    intelligenceHubsFormSchema,
    type intelligenceHubsFormValues,
    dailyExecutiveBriefsFormSchema,
    type dailyExecutiveBriefsFormValues,
    weeklyBusinessReviewsFormSchema,
    type weeklyBusinessReviewsFormValues,
    monthlyExecutiveSummariesFormSchema,
    type monthlyExecutiveSummariesFormValues,
    trialConversionScoresFormSchema,
    type trialConversionScoresFormValues,
    renewalProbabilitiesFormSchema,
    type renewalProbabilitiesFormValues,
    churnRisksFormSchema,
    type churnRisksFormValues,
    expansionOpportunitiesFormSchema,
    type expansionOpportunitiesFormValues,
    mrrTrendsFormSchema,
    type mrrTrendsFormValues,
    arrTrendsFormSchema,
    type arrTrendsFormValues,
    revenueGrowthMetricsFormSchema,
    type revenueGrowthMetricsFormValues,
    revenueRisksFormSchema,
    type revenueRisksFormValues,
    platformHealthIntelFormSchema,
    type platformHealthIntelFormValues,
    queueHealthIntelFormSchema,
    type queueHealthIntelFormValues,
    integrationHealthIntelFormSchema,
    type integrationHealthIntelFormValues,
    performanceTrendsFormSchema,
    type performanceTrendsFormValues,
    unusualLoginActivityFormSchema,
    type unusualLoginActivityFormValues,
    permissionRisksFormSchema,
    type permissionRisksFormValues,
    tenantSecurityTrendsFormSchema,
    type tenantSecurityTrendsFormValues,
    complianceWarningsFormSchema,
    type complianceWarningsFormValues,
    todayPrioritiesFormSchema,
    type todayPrioritiesFormValues,
    recommendedActionsFormSchema,
    type recommendedActionsFormValues,
    businessRisksFormSchema,
    type businessRisksFormValues,
    growthOpportunitiesFormSchema,
    type growthOpportunitiesFormValues,
    knowledgeReasoningSessionsFormSchema,
    type knowledgeReasoningSessionsFormValues,
    evidenceTracesFormSchema,
    type evidenceTracesFormValues,
    orchestrationLinksFormSchema,
    type orchestrationLinksFormValues,
    recommendationOutputsFormSchema,
    type recommendationOutputsFormValues,
    executiveMetricsFormSchema,
    type executiveMetricsFormValues,
    executiveHealthFormSchema,
    type executiveHealthFormValues,
    executiveFailuresFormSchema,
    type executiveFailuresFormValues,
} from "@/src/modules/executive-intelligence/schemas";

type ExecutiveIntelligenceData = ReturnType<typeof useExecutiveIntelligence>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-violet-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-violet-600">{meta}</p> : null}</div>;
}
function IntelligenceHubSelect({ data, ...props }: { data: ExecutiveIntelligenceData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select executive intelligence</option>{data.intelligenceHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function ExecutiveIntelligenceOverviewPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Executive Intelligence summary" description="System health, background jobs, event bus, businessRisks, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Intelligence Hubs" subtitle={`${data.stats?.totalIntelligenceHubs ?? 0} total`} meta={`${data.stats?.activeIntelligenceHubs ?? 0} active • ${data.stats?.recommendationCount ?? 0} recommendations`} />
                <ListCard title="Evidence Traces" subtitle={`${data.stats?.evidenceTraceCount ?? 0} evidence traces`} meta={`${data.stats?.reasoningSessionCount ?? 0} reasoning sessions • ${data.stats?.openRiskCount ?? 0} open risks`} />
                <ListCard title="Health" subtitle={`${(data.stats?.avgAiConfidenceScore ?? 0).toFixed(1)} avg AI confidence`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first executive intelligence" />
            </div></Card>
            <Card hover><SectionHeader title="Executive intelligence pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Executive intelligence pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function IntelligenceHubsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<intelligenceHubsFormValues>({ resolver: zodResolver(intelligenceHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Intelligence Hubs" description="Enterprise executive intelligence intelligence hubs" /><div className="mt-6 space-y-3">
                {data.intelligenceHubs.length === 0 ? <EmptyState title="No intelligence hubs" description="Create the first intelligence hubs record." /> : data.intelligenceHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create intelligence hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntelligenceHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DailyExecutiveBriefsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<dailyExecutiveBriefsFormValues>({ resolver: zodResolver(dailyExecutiveBriefsFormSchema), defaultValues: {"intelligenceHubId":"","briefKey":"","briefDate":"","aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Daily Executive Briefs" description="Enterprise executive intelligence daily executive briefs" /><div className="mt-6 space-y-3">
                {data.dailyExecutiveBriefs.length === 0 ? <EmptyState title="No daily executive briefs" description="Create the first daily executive briefs record." /> : data.dailyExecutiveBriefs.map((item) => (
                    <ListCard key={item.id} title={String(item.briefKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.briefDate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create daily executive briefs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDailyExecutiveBrief(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("briefKey")} placeholder="briefKey" className={inputClass} />
                <input {...form.register("briefDate")} placeholder="briefDate" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WeeklyBusinessReviewsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<weeklyBusinessReviewsFormValues>({ resolver: zodResolver(weeklyBusinessReviewsFormSchema), defaultValues: {"intelligenceHubId":"","reviewKey":"","weekStart":"","aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Weekly Business Reviews" description="Enterprise executive intelligence weekly business reviews" /><div className="mt-6 space-y-3">
                {data.weeklyBusinessReviews.length === 0 ? <EmptyState title="No weekly business reviews" description="Create the first weekly business reviews record." /> : data.weeklyBusinessReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.weekStart}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create weekly business reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWeeklyBusinessReview(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("weekStart")} placeholder="weekStart" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MonthlyExecutiveSummarysPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<monthlyExecutiveSummariesFormValues>({ resolver: zodResolver(monthlyExecutiveSummariesFormSchema), defaultValues: {"intelligenceHubId":"","summaryKey":"","monthStart":"","aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Monthly Executive Summaries" description="Enterprise executive intelligence monthly executive summaries" /><div className="mt-6 space-y-3">
                {data.monthlyExecutiveSummaries.length === 0 ? <EmptyState title="No monthly executive summaries" description="Create the first monthly executive summaries record." /> : data.monthlyExecutiveSummaries.map((item) => (
                    <ListCard key={item.id} title={String(item.summaryKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.monthStart}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create monthly executive summaries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMonthlyExecutiveSummary(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("summaryKey")} placeholder="summaryKey" className={inputClass} />
                <input {...form.register("monthStart")} placeholder="monthStart" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TrialConversionScoresPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<trialConversionScoresFormValues>({ resolver: zodResolver(trialConversionScoresFormSchema), defaultValues: {"intelligenceHubId":"","scoreKey":"","conversionRate":0,"aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Trial Conversion Scores" description="Enterprise executive intelligence trial conversion scores" /><div className="mt-6 space-y-3">
                {data.trialConversionScores.length === 0 ? <EmptyState title="No trial conversion scores" description="Create the first trial conversion scores record." /> : data.trialConversionScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.scoreKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create trial conversion scores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTrialConversionScore(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("scoreKey")} placeholder="scoreKey" className={inputClass} />
                <input type="number" step="any" {...form.register("conversionRate", { valueAsNumber: true })} placeholder="conversionRate" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenewalProbabilitysPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<renewalProbabilitiesFormValues>({ resolver: zodResolver(renewalProbabilitiesFormSchema), defaultValues: {"intelligenceHubId":"","probabilityKey":"","renewalProbability":0,"aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal Probabilities" description="Enterprise executive intelligence renewal probabilities" /><div className="mt-6 space-y-3">
                {data.renewalProbabilities.length === 0 ? <EmptyState title="No renewal probabilities" description="Create the first renewal probabilities record." /> : data.renewalProbabilities.map((item) => (
                    <ListCard key={item.id} title={String(item.probabilityKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.probabilityKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal probabilities" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalProbability(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("probabilityKey")} placeholder="probabilityKey" className={inputClass} />
                <input type="number" step="any" {...form.register("renewalProbability", { valueAsNumber: true })} placeholder="renewalProbability" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ChurnRisksPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<churnRisksFormValues>({ resolver: zodResolver(churnRisksFormSchema), defaultValues: {"intelligenceHubId":"","riskKey":"","churnScore":0,"riskLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Churn Risks" description="Enterprise executive intelligence churn risks" /><div className="mt-6 space-y-3">
                {data.churnRisks.length === 0 ? <EmptyState title="No churn risks" description="Create the first churn risks record." /> : data.churnRisks.map((item) => (
                    <ListCard key={item.id} title={String(item.riskKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.riskLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create churn risks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createChurnRisk(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("riskKey")} placeholder="riskKey" className={inputClass} />
                <input type="number" step="any" {...form.register("churnScore", { valueAsNumber: true })} placeholder="churnScore" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExpansionOpportunitysPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<expansionOpportunitiesFormValues>({ resolver: zodResolver(expansionOpportunitiesFormSchema), defaultValues: {"intelligenceHubId":"","opportunityKey":"","expansionScore":0,"aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Expansion Opportunities" description="Enterprise executive intelligence expansion opportunities" /><div className="mt-6 space-y-3">
                {data.expansionOpportunities.length === 0 ? <EmptyState title="No expansion opportunities" description="Create the first expansion opportunities record." /> : data.expansionOpportunities.map((item) => (
                    <ListCard key={item.id} title={String(item.opportunityKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.opportunityKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create expansion opportunities" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExpansionOpportunity(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("opportunityKey")} placeholder="opportunityKey" className={inputClass} />
                <input type="number" step="any" {...form.register("expansionScore", { valueAsNumber: true })} placeholder="expansionScore" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MrrTrendsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<mrrTrendsFormValues>({ resolver: zodResolver(mrrTrendsFormSchema), defaultValues: {"intelligenceHubId":"","trendKey":"","mrrAmount":0,"trendDirection":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Mrr Trends" description="Enterprise executive intelligence mrr trends" /><div className="mt-6 space-y-3">
                {data.mrrTrends.length === 0 ? <EmptyState title="No mrr trends" description="Create the first mrr trends record." /> : data.mrrTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.trendDirection}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mrr trends" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMrrTrend(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("trendKey")} placeholder="trendKey" className={inputClass} />
                <input type="number" step="any" {...form.register("mrrAmount", { valueAsNumber: true })} placeholder="mrrAmount" className={inputClass} />
                <select {...form.register("trendDirection")} className={inputClass}>{TREND_DIRECTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ArrTrendsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<arrTrendsFormValues>({ resolver: zodResolver(arrTrendsFormSchema), defaultValues: {"intelligenceHubId":"","trendKey":"","arrAmount":0,"trendDirection":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Arr Trends" description="Enterprise executive intelligence arr trends" /><div className="mt-6 space-y-3">
                {data.arrTrends.length === 0 ? <EmptyState title="No arr trends" description="Create the first arr trends record." /> : data.arrTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.trendDirection}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create arr trends" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createArrTrend(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("trendKey")} placeholder="trendKey" className={inputClass} />
                <input type="number" step="any" {...form.register("arrAmount", { valueAsNumber: true })} placeholder="arrAmount" className={inputClass} />
                <select {...form.register("trendDirection")} className={inputClass}>{TREND_DIRECTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueGrowthMetricsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<revenueGrowthMetricsFormValues>({ resolver: zodResolver(revenueGrowthMetricsFormSchema), defaultValues: {"intelligenceHubId":"","metricsKey":"","growthRate":0,"aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Growth Metrics" description="Enterprise executive intelligence revenue growth metrics" /><div className="mt-6 space-y-3">
                {data.revenueGrowthMetrics.length === 0 ? <EmptyState title="No revenue growth metrics" description="Create the first revenue growth metrics record." /> : data.revenueGrowthMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue growth metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueGrowthMetric(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("growthRate", { valueAsNumber: true })} placeholder="growthRate" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueRisksPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<revenueRisksFormValues>({ resolver: zodResolver(revenueRisksFormSchema), defaultValues: {"intelligenceHubId":"","riskKey":"","riskAmount":0,"riskLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Risks" description="Enterprise executive intelligence revenue risks" /><div className="mt-6 space-y-3">
                {data.revenueRisks.length === 0 ? <EmptyState title="No revenue risks" description="Create the first revenue risks record." /> : data.revenueRisks.map((item) => (
                    <ListCard key={item.id} title={String(item.riskKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.riskLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue risks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueRisk(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("riskKey")} placeholder="riskKey" className={inputClass} />
                <input type="number" step="any" {...form.register("riskAmount", { valueAsNumber: true })} placeholder="riskAmount" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformHealthIntelsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<platformHealthIntelFormValues>({ resolver: zodResolver(platformHealthIntelFormSchema), defaultValues: {"intelligenceHubId":"","intelKey":"","healthScore":0,"aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Health Intel" description="Enterprise executive intelligence platform health intel" /><div className="mt-6 space-y-3">
                {data.platformHealthIntel.length === 0 ? <EmptyState title="No platform health intel" description="Create the first platform health intel record." /> : data.platformHealthIntel.map((item) => (
                    <ListCard key={item.id} title={String(item.intelKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.healthScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform health intel" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformHealthIntel(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("intelKey")} placeholder="intelKey" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function QueueHealthIntelsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<queueHealthIntelFormValues>({ resolver: zodResolver(queueHealthIntelFormSchema), defaultValues: {"intelligenceHubId":"","intelKey":"","queueDepth":0,"healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Queue Health Intel" description="Enterprise executive intelligence queue health intel" /><div className="mt-6 space-y-3">
                {data.queueHealthIntel.length === 0 ? <EmptyState title="No queue health intel" description="Create the first queue health intel record." /> : data.queueHealthIntel.map((item) => (
                    <ListCard key={item.id} title={String(item.intelKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueDepth}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create queue health intel" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createQueueHealthIntel(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("intelKey")} placeholder="intelKey" className={inputClass} />
                <input type="number" step="any" {...form.register("queueDepth", { valueAsNumber: true })} placeholder="queueDepth" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntegrationHealthIntelsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<integrationHealthIntelFormValues>({ resolver: zodResolver(integrationHealthIntelFormSchema), defaultValues: {"intelligenceHubId":"","intelKey":"","integrationName":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Integration Health Intel" description="Enterprise executive intelligence integration health intel" /><div className="mt-6 space-y-3">
                {data.integrationHealthIntel.length === 0 ? <EmptyState title="No integration health intel" description="Create the first integration health intel record." /> : data.integrationHealthIntel.map((item) => (
                    <ListCard key={item.id} title={String(item.integrationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.intelKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create integration health intel" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntegrationHealthIntel(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("intelKey")} placeholder="intelKey" className={inputClass} />
                <input {...form.register("integrationName")} placeholder="integrationName" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PerformanceTrendsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<performanceTrendsFormValues>({ resolver: zodResolver(performanceTrendsFormSchema), defaultValues: {"intelligenceHubId":"","trendKey":"","performanceScore":0,"trendDirection":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Performance Trends" description="Enterprise executive intelligence performance trends" /><div className="mt-6 space-y-3">
                {data.performanceTrends.length === 0 ? <EmptyState title="No performance trends" description="Create the first performance trends record." /> : data.performanceTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.trendDirection}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create performance trends" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPerformanceTrend(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("trendKey")} placeholder="trendKey" className={inputClass} />
                <input type="number" step="any" {...form.register("performanceScore", { valueAsNumber: true })} placeholder="performanceScore" className={inputClass} />
                <select {...form.register("trendDirection")} className={inputClass}>{TREND_DIRECTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function UnusualLoginActivitysPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<unusualLoginActivityFormValues>({ resolver: zodResolver(unusualLoginActivityFormSchema), defaultValues: {"intelligenceHubId":"","activityKey":"","loginCount":0,"riskLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Unusual Login Activity" description="Enterprise executive intelligence unusual login activity" /><div className="mt-6 space-y-3">
                {data.unusualLoginActivity.length === 0 ? <EmptyState title="No unusual login activity" description="Create the first unusual login activity record." /> : data.unusualLoginActivity.map((item) => (
                    <ListCard key={item.id} title={String(item.activityKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.riskLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create unusual login activity" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUnusualLoginActivity(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("activityKey")} placeholder="activityKey" className={inputClass} />
                <input type="number" step="any" {...form.register("loginCount", { valueAsNumber: true })} placeholder="loginCount" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PermissionRisksPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<permissionRisksFormValues>({ resolver: zodResolver(permissionRisksFormSchema), defaultValues: {"intelligenceHubId":"","riskKey":"","riskType":"","riskLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Permission Risks" description="Enterprise executive intelligence permission risks" /><div className="mt-6 space-y-3">
                {data.permissionRisks.length === 0 ? <EmptyState title="No permission risks" description="Create the first permission risks record." /> : data.permissionRisks.map((item) => (
                    <ListCard key={item.id} title={String(item.riskKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.riskType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create permission risks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPermissionRisk(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("riskKey")} placeholder="riskKey" className={inputClass} />
                <input {...form.register("riskType")} placeholder="riskType" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TenantSecurityTrendsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<tenantSecurityTrendsFormValues>({ resolver: zodResolver(tenantSecurityTrendsFormSchema), defaultValues: {"intelligenceHubId":"","trendKey":"","securityScore":0,"trendDirection":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tenant Security Trends" description="Enterprise executive intelligence tenant security trends" /><div className="mt-6 space-y-3">
                {data.tenantSecurityTrends.length === 0 ? <EmptyState title="No tenant security trends" description="Create the first tenant security trends record." /> : data.tenantSecurityTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.securityScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tenant security trends" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantSecurityTrend(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("trendKey")} placeholder="trendKey" className={inputClass} />
                <input type="number" step="any" {...form.register("securityScore", { valueAsNumber: true })} placeholder="securityScore" className={inputClass} />
                <select {...form.register("trendDirection")} className={inputClass}>{TREND_DIRECTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceWarningsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<complianceWarningsFormValues>({ resolver: zodResolver(complianceWarningsFormSchema), defaultValues: {"intelligenceHubId":"","warningKey":"","complianceType":"","severity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Warnings" description="Enterprise executive intelligence compliance warnings" /><div className="mt-6 space-y-3">
                {data.complianceWarnings.length === 0 ? <EmptyState title="No compliance warnings" description="Create the first compliance warnings record." /> : data.complianceWarnings.map((item) => (
                    <ListCard key={item.id} title={String(item.warningKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.complianceType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance warnings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceWarning(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("warningKey")} placeholder="warningKey" className={inputClass} />
                <input {...form.register("complianceType")} placeholder="complianceType" className={inputClass} />
                <select {...form.register("severity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TodayPrioritysPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<todayPrioritiesFormValues>({ resolver: zodResolver(todayPrioritiesFormSchema), defaultValues: {"intelligenceHubId":"","priorityKey":"","priorityTitle":"","priorityRank":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Today Priorities" description="Enterprise executive intelligence today priorities" /><div className="mt-6 space-y-3">
                {data.todayPriorities.length === 0 ? <EmptyState title="No today priorities" description="Create the first today priorities record." /> : data.todayPriorities.map((item) => (
                    <ListCard key={item.id} title={String(item.priorityTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.priorityKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create today priorities" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTodayPriority(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("priorityKey")} placeholder="priorityKey" className={inputClass} />
                <input {...form.register("priorityTitle")} placeholder="priorityTitle" className={inputClass} />
                <input type="number" step="any" {...form.register("priorityRank", { valueAsNumber: true })} placeholder="priorityRank" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RecommendedActionsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<recommendedActionsFormValues>({ resolver: zodResolver(recommendedActionsFormSchema), defaultValues: {"intelligenceHubId":"","actionKey":"","actionTitle":"","actionType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Recommended Actions" description="Enterprise executive intelligence recommended actions" /><div className="mt-6 space-y-3">
                {data.recommendedActions.length === 0 ? <EmptyState title="No recommended actions" description="Create the first recommended actions record." /> : data.recommendedActions.map((item) => (
                    <ListCard key={item.id} title={String(item.actionTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.actionType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create recommended actions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRecommendedAction(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("actionKey")} placeholder="actionKey" className={inputClass} />
                <input {...form.register("actionTitle")} placeholder="actionTitle" className={inputClass} />
                <input {...form.register("actionType")} placeholder="actionType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessRisksPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<businessRisksFormValues>({ resolver: zodResolver(businessRisksFormSchema), defaultValues: {"intelligenceHubId":"","riskKey":"","riskTitle":"","riskLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Risks" description="Enterprise executive intelligence business risks" /><div className="mt-6 space-y-3">
                {data.businessRisks.length === 0 ? <EmptyState title="No business risks" description="Create the first business risks record." /> : data.businessRisks.map((item) => (
                    <ListCard key={item.id} title={String(item.riskTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.riskLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business risks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessRisk(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("riskKey")} placeholder="riskKey" className={inputClass} />
                <input {...form.register("riskTitle")} placeholder="riskTitle" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthOpportunitysPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<growthOpportunitiesFormValues>({ resolver: zodResolver(growthOpportunitiesFormSchema), defaultValues: {"intelligenceHubId":"","opportunityKey":"","opportunityTitle":"","growthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Opportunities" description="Enterprise executive intelligence growth opportunities" /><div className="mt-6 space-y-3">
                {data.growthOpportunities.length === 0 ? <EmptyState title="No growth opportunities" description="Create the first growth opportunities record." /> : data.growthOpportunities.map((item) => (
                    <ListCard key={item.id} title={String(item.opportunityTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.growthScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth opportunities" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthOpportunity(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("opportunityKey")} placeholder="opportunityKey" className={inputClass} />
                <input {...form.register("opportunityTitle")} placeholder="opportunityTitle" className={inputClass} />
                <input type="number" step="any" {...form.register("growthScore", { valueAsNumber: true })} placeholder="growthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KnowledgeReasoningSessionsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<knowledgeReasoningSessionsFormValues>({ resolver: zodResolver(knowledgeReasoningSessionsFormSchema), defaultValues: {"intelligenceHubId":"","sessionKey":"","reasoningType":"","aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Knowledge Reasoning Sessions" description="Enterprise executive intelligence knowledge reasoning sessions" /><div className="mt-6 space-y-3">
                {data.knowledgeReasoningSessions.length === 0 ? <EmptyState title="No knowledge reasoning sessions" description="Create the first knowledge reasoning sessions record." /> : data.knowledgeReasoningSessions.map((item) => (
                    <ListCard key={item.id} title={String(item.sessionKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reasoningType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create knowledge reasoning sessions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKnowledgeReasoningSession(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("sessionKey")} placeholder="sessionKey" className={inputClass} />
                <input {...form.register("reasoningType")} placeholder="reasoningType" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EvidenceTracesPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<evidenceTracesFormValues>({ resolver: zodResolver(evidenceTracesFormSchema), defaultValues: {"intelligenceHubId":"","traceKey":"","sourceModule":"","traceSummary":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Evidence Traces" description="Enterprise executive intelligence evidence traces" /><div className="mt-6 space-y-3">
                {data.evidenceTraces.length === 0 ? <EmptyState title="No evidence traces" description="Create the first evidence traces record." /> : data.evidenceTraces.map((item) => (
                    <ListCard key={item.id} title={String(item.traceKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.sourceModule}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create evidence traces" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEvidenceTrace(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("traceKey")} placeholder="traceKey" className={inputClass} />
                <input {...form.register("sourceModule")} placeholder="sourceModule" className={inputClass} />
                <input {...form.register("traceSummary")} placeholder="traceSummary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrchestrationLinksPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<orchestrationLinksFormValues>({ resolver: zodResolver(orchestrationLinksFormSchema), defaultValues: {"intelligenceHubId":"","linkKey":"","linkType":"","targetRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Orchestration Links" description="Enterprise executive intelligence orchestration links" /><div className="mt-6 space-y-3">
                {data.orchestrationLinks.length === 0 ? <EmptyState title="No orchestration links" description="Create the first orchestration links record." /> : data.orchestrationLinks.map((item) => (
                    <ListCard key={item.id} title={String(item.linkKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.linkType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create orchestration links" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrchestrationLink(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("linkKey")} placeholder="linkKey" className={inputClass} />
                <input {...form.register("linkType")} placeholder="linkType" className={inputClass} />
                <input {...form.register("targetRef")} placeholder="targetRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RecommendationOutputsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<recommendationOutputsFormValues>({ resolver: zodResolver(recommendationOutputsFormSchema), defaultValues: {"intelligenceHubId":"","outputKey":"","recommendationText":"","aiConfidenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Recommendation Outputs" description="Enterprise executive intelligence recommendation outputs" /><div className="mt-6 space-y-3">
                {data.recommendationOutputs.length === 0 ? <EmptyState title="No recommendation outputs" description="Create the first recommendation outputs record." /> : data.recommendationOutputs.map((item) => (
                    <ListCard key={item.id} title={String(item.outputKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.recommendationText}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create recommendation outputs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRecommendationOutput(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("outputKey")} placeholder="outputKey" className={inputClass} />
                <input {...form.register("recommendationText")} placeholder="recommendationText" className={inputClass} />
                <input type="number" step="any" {...form.register("aiConfidenceScore", { valueAsNumber: true })} placeholder="aiConfidenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveMetricsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<executiveMetricsFormValues>({ resolver: zodResolver(executiveMetricsFormSchema), defaultValues: {"metricsKey":"","businessScore":0,"growthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Metrics" description="Enterprise executive intelligence executive metrics" /><div className="mt-6 space-y-3">
                {data.executiveMetrics.length === 0 ? <EmptyState title="No executive metrics" description="Create the first executive metrics record." /> : data.executiveMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("businessScore", { valueAsNumber: true })} placeholder="businessScore" className={inputClass} />
                <input type="number" step="any" {...form.register("growthScore", { valueAsNumber: true })} placeholder="growthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveHealthsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<executiveHealthFormValues>({ resolver: zodResolver(executiveHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Health" description="Enterprise executive intelligence executive health" /><div className="mt-6 space-y-3">
                {data.executiveHealth.length === 0 ? <EmptyState title="No executive health" description="Create the first executive health record." /> : data.executiveHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.healthKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveFailuresPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<executiveFailuresFormValues>({ resolver: zodResolver(executiveFailuresFormSchema), defaultValues: {"intelligenceHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Failures" description="Enterprise executive intelligence executive failures" /><div className="mt-6 space-y-3">
                {data.executiveFailures.length === 0 ? <EmptyState title="No executive failures" description="Create the first executive failures record." /> : data.executiveFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveFailure(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveIntelligenceAuditLogsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    return (
        <Card hover><SectionHeader title="Executive Intelligence audit history" description="Security-first audit trail for jobs, events, businessRisks, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for executive intelligence." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function ExecutiveIntelligenceSdkPanel({ data }: { data: ExecutiveIntelligenceData }) {
    return (
        <Card hover><SectionHeader title="Shared Executive Intelligence SDK" description="Import from @/src/modules/executive-intelligence/sdk for brief generation, recommendation output, and knowledge reasoning" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createExecutiveIntelligenceClient()" subtitle="Factory for module-scoped Executive Intelligence client with auth context" meta="Primary SDK for enterprise executive intelligence" />
            <ListCard title="sdkGenerateBrief()" subtitle="Generate executive brief with AI orchestration" meta="moduleSource: executive_intelligence" />
            <ListCard title="sdkGenerateRecommendation()" subtitle="Generate AI recommendation with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkTriggerReasoning()" subtitle="Trigger knowledge reasoning with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {AIX_THEME.primary} • Integration hubs loaded: {data.intelligenceHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createExecutiveIntelligenceClient } from "@/src/modules/executive-intelligence/sdk";

const intg = createExecutiveIntelligenceClient(userId, email, fullName);
await intg.generateBrief({ intelligenceHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.generateRecommendation({ intelligenceHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.triggerReasoning({ intelligenceHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
