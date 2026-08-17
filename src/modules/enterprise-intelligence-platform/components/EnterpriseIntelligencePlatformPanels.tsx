"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EIP_THEME, KPI_STATUS_OPTIONS, CATEGORY_STATUS_OPTIONS, DASHBOARD_STATUS_OPTIONS, CONFIG_STATUS_OPTIONS } from "@/src/modules/enterprise-intelligence-platform/constants";
import type { useEnterpriseIntelligencePlatform } from "@/src/modules/enterprise-intelligence-platform/hooks/useEnterpriseIntelligencePlatform";
import {
    intelligenceHubsFormSchema,
    type intelligenceHubsFormValues,
    kpiRegistryFormSchema,
    type kpiRegistryFormValues,
    kpiAggregationsFormSchema,
    type kpiAggregationsFormValues,
    kpiCategoriesFormSchema,
    type kpiCategoriesFormValues,
    kpiTargetsFormSchema,
    type kpiTargetsFormValues,
    kpiThresholdsFormSchema,
    type kpiThresholdsFormValues,
    kpiSnapshotsFormSchema,
    type kpiSnapshotsFormValues,
    executiveDashboardsFormSchema,
    type executiveDashboardsFormValues,
    crossModuleInsightsFormSchema,
    type crossModuleInsightsFormValues,
    businessHealthScoresFormSchema,
    type businessHealthScoresFormValues,
    operationalEfficiencyScoresFormSchema,
    type operationalEfficiencyScoresFormValues,
    growthScoresFormSchema,
    type growthScoresFormValues,
    strategicInsightsFormSchema,
    type strategicInsightsFormValues,
    revenueForecastsFormSchema,
    type revenueForecastsFormValues,
    customerGrowthForecastsFormSchema,
    type customerGrowthForecastsFormValues,
    renewalForecastsFormSchema,
    type renewalForecastsFormValues,
    capacityPlanningFormSchema,
    type capacityPlanningFormValues,
    operationalTrendsFormSchema,
    type operationalTrendsFormValues,
    riskForecastsFormSchema,
    type riskForecastsFormValues,
    dailyExecutiveBriefsFormSchema,
    type dailyExecutiveBriefsFormValues,
    weeklyBusinessSummariesFormSchema,
    type weeklyBusinessSummariesFormValues,
    monthlyPerformanceReportsFormSchema,
    type monthlyPerformanceReportsFormValues,
    quarterlyExecutiveReviewsFormSchema,
    type quarterlyExecutiveReviewsFormValues,
    annualBusinessReportsFormSchema,
    type annualBusinessReportsFormValues,
    kpiServiceConfigsFormSchema,
    type kpiServiceConfigsFormValues,
    intelligenceServiceConfigsFormSchema,
    type intelligenceServiceConfigsFormValues,
    forecastServiceConfigsFormSchema,
    type forecastServiceConfigsFormValues,
    intelligenceMetricsFormSchema,
    type intelligenceMetricsFormValues,
    intelligenceHealthFormSchema,
    type intelligenceHealthFormValues,
    missionProgressFormSchema,
    type missionProgressFormValues,
    intelligenceFailuresFormSchema,
    type intelligenceFailuresFormValues,
} from "@/src/modules/enterprise-intelligence-platform/schemas";

type RetailData = ReturnType<typeof useEnterpriseIntelligencePlatform>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-fuchsia-500/20 focus:ring-4 dark:border-slate-800 dark:bg-fuchsia-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-fuchsia-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-fuchsia-600">{meta}</p> : null}</div>;
}
function IntelligenceHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.intelligenceHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Enterprise Intelligence Platform summary" description="System health, background jobs, event bus, crossModuleInsights, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Intelligence Hubs" subtitle={`${data.stats?.totalIntelligenceHubs ?? 0} total`} meta={`${data.stats?.activeIntelligenceHubs ?? 0} active • ${data.stats?.kpiRegistryCount ?? 0} dining areas`} />
                <ListCard title="Executive Dashboards" subtitle={`${data.stats?.executiveDashboardCount ?? 0} dashboards`} meta={`${data.stats?.revenueForecastCount ?? 0} revenue forecasts • ${data.stats?.crossModuleInsightCount ?? 0} cross-module insights`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallIntelligenceScore ?? 0).toFixed(1)} overall intelligence score`} meta={`${data.stats?.openIntelligenceFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first retail operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function IntelligenceHubsPanel({ data }: { data: RetailData }) {
    const form = useForm<intelligenceHubsFormValues>({ resolver: zodResolver(intelligenceHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Intelligence Hubs" description="Enterprise retail operating system intelligence hubs" /><div className="mt-6 space-y-3">
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

export function KpiRegistrysPanel({ data }: { data: RetailData }) {
    const form = useForm<kpiRegistryFormValues>({ resolver: zodResolver(kpiRegistryFormSchema), defaultValues: {"intelligenceHubId":"","kpiKey":"","kpiName":"","kpiStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kpi Registry" description="Enterprise retail operating system kpi registry" /><div className="mt-6 space-y-3">
                {data.kpiRegistry.length === 0 ? <EmptyState title="No kpi registry" description="Create the first kpi registry record." /> : data.kpiRegistry.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kpi registry" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKpiRegistry(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <select {...form.register("kpiStatus")} className={inputClass}>{KPI_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KpiAggregationsPanel({ data }: { data: RetailData }) {
    const form = useForm<kpiAggregationsFormValues>({ resolver: zodResolver(kpiAggregationsFormSchema), defaultValues: {"intelligenceHubId":"","aggregationKey":"","aggregationName":"","aggregationType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kpi Aggregations" description="Enterprise retail operating system kpi aggregations" /><div className="mt-6 space-y-3">
                {data.kpiAggregations.length === 0 ? <EmptyState title="No kpi aggregations" description="Create the first kpi aggregations record." /> : data.kpiAggregations.map((item) => (
                    <ListCard key={item.id} title={String(item.aggregationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.aggregationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kpi aggregations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKpiAggregation(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("aggregationKey")} placeholder="aggregationKey" className={inputClass} />
                <input {...form.register("aggregationName")} placeholder="aggregationName" className={inputClass} />
                <input {...form.register("aggregationType")} placeholder="aggregationType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KpiCategorysPanel({ data }: { data: RetailData }) {
    const form = useForm<kpiCategoriesFormValues>({ resolver: zodResolver(kpiCategoriesFormSchema), defaultValues: {"intelligenceHubId":"","categoryKey":"","categoryName":"","categoryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kpi Categories" description="Enterprise retail operating system kpi categories" /><div className="mt-6 space-y-3">
                {data.kpiCategories.length === 0 ? <EmptyState title="No kpi categories" description="Create the first kpi categories record." /> : data.kpiCategories.map((item) => (
                    <ListCard key={item.id} title={String(item.categoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.categoryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kpi categories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKpiCategory(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("categoryKey")} placeholder="categoryKey" className={inputClass} />
                <input {...form.register("categoryName")} placeholder="categoryName" className={inputClass} />
                <select {...form.register("categoryStatus")} className={inputClass}>{CATEGORY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KpiTargetsPanel({ data }: { data: RetailData }) {
    const form = useForm<kpiTargetsFormValues>({ resolver: zodResolver(kpiTargetsFormSchema), defaultValues: {"intelligenceHubId":"","targetKey":"","targetName":"","targetValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kpi Targets" description="Enterprise retail operating system kpi targets" /><div className="mt-6 space-y-3">
                {data.kpiTargets.length === 0 ? <EmptyState title="No kpi targets" description="Create the first kpi targets record." /> : data.kpiTargets.map((item) => (
                    <ListCard key={item.id} title={String(item.targetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.targetValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kpi targets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKpiTarget(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("targetKey")} placeholder="targetKey" className={inputClass} />
                <input {...form.register("targetName")} placeholder="targetName" className={inputClass} />
                <input type="number" step="any" {...form.register("targetValue", { valueAsNumber: true })} placeholder="targetValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KpiThresholdsPanel({ data }: { data: RetailData }) {
    const form = useForm<kpiThresholdsFormValues>({ resolver: zodResolver(kpiThresholdsFormSchema), defaultValues: {"intelligenceHubId":"","thresholdKey":"","thresholdName":"","thresholdValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kpi Thresholds" description="Enterprise retail operating system kpi thresholds" /><div className="mt-6 space-y-3">
                {data.kpiThresholds.length === 0 ? <EmptyState title="No kpi thresholds" description="Create the first kpi thresholds record." /> : data.kpiThresholds.map((item) => (
                    <ListCard key={item.id} title={String(item.thresholdName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.thresholdValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kpi thresholds" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKpiThreshold(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("thresholdKey")} placeholder="thresholdKey" className={inputClass} />
                <input {...form.register("thresholdName")} placeholder="thresholdName" className={inputClass} />
                <input type="number" step="any" {...form.register("thresholdValue", { valueAsNumber: true })} placeholder="thresholdValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KpiSnapshotsPanel({ data }: { data: RetailData }) {
    const form = useForm<kpiSnapshotsFormValues>({ resolver: zodResolver(kpiSnapshotsFormSchema), defaultValues: {"intelligenceHubId":"","snapshotKey":"","snapshotName":"","snapshotValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kpi Snapshots" description="Enterprise retail operating system kpi snapshots" /><div className="mt-6 space-y-3">
                {data.kpiSnapshots.length === 0 ? <EmptyState title="No kpi snapshots" description="Create the first kpi snapshots record." /> : data.kpiSnapshots.map((item) => (
                    <ListCard key={item.id} title={String(item.snapshotName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.snapshotValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kpi snapshots" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKpiSnapshot(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("snapshotKey")} placeholder="snapshotKey" className={inputClass} />
                <input {...form.register("snapshotName")} placeholder="snapshotName" className={inputClass} />
                <input type="number" step="any" {...form.register("snapshotValue", { valueAsNumber: true })} placeholder="snapshotValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveDashboardsPanel({ data }: { data: RetailData }) {
    const form = useForm<executiveDashboardsFormValues>({ resolver: zodResolver(executiveDashboardsFormSchema), defaultValues: {"intelligenceHubId":"","dashboardKey":"","dashboardName":"","dashboardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Dashboards" description="Enterprise retail operating system executive dashboards" /><div className="mt-6 space-y-3">
                {data.executiveDashboards.length === 0 ? <EmptyState title="No executive dashboards" description="Create the first executive dashboards record." /> : data.executiveDashboards.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive dashboards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveDashboard(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <select {...form.register("dashboardStatus")} className={inputClass}>{DASHBOARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CrossModuleInsightsPanel({ data }: { data: RetailData }) {
    const form = useForm<crossModuleInsightsFormValues>({ resolver: zodResolver(crossModuleInsightsFormSchema), defaultValues: {"intelligenceHubId":"","insightKey":"","insightTitle":"","insightType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cross Module Insights" description="Enterprise retail operating system cross module insights" /><div className="mt-6 space-y-3">
                {data.crossModuleInsights.length === 0 ? <EmptyState title="No cross module insights" description="Create the first cross module insights record." /> : data.crossModuleInsights.map((item) => (
                    <ListCard key={item.id} title={String(item.insightTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.insightType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create cross module insights" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCrossModuleInsight(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("insightKey")} placeholder="insightKey" className={inputClass} />
                <input {...form.register("insightTitle")} placeholder="insightTitle" className={inputClass} />
                <input {...form.register("insightType")} placeholder="insightType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessHealthScoresPanel({ data }: { data: RetailData }) {
    const form = useForm<businessHealthScoresFormValues>({ resolver: zodResolver(businessHealthScoresFormSchema), defaultValues: {"intelligenceHubId":"","scoreKey":"","scoreName":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Health Scores" description="Enterprise retail operating system business health scores" /><div className="mt-6 space-y-3">
                {data.businessHealthScores.length === 0 ? <EmptyState title="No business health scores" description="Create the first business health scores record." /> : data.businessHealthScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.healthScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business health scores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessHealthScore(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("scoreKey")} placeholder="scoreKey" className={inputClass} />
                <input {...form.register("scoreName")} placeholder="scoreName" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationalEfficiencyScoresPanel({ data }: { data: RetailData }) {
    const form = useForm<operationalEfficiencyScoresFormValues>({ resolver: zodResolver(operationalEfficiencyScoresFormSchema), defaultValues: {"intelligenceHubId":"","scoreKey":"","scoreName":"","efficiencyScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operational Efficiency Scores" description="Enterprise retail operating system operational efficiency scores" /><div className="mt-6 space-y-3">
                {data.operationalEfficiencyScores.length === 0 ? <EmptyState title="No operational efficiency scores" description="Create the first operational efficiency scores record." /> : data.operationalEfficiencyScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.efficiencyScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operational efficiency scores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationalEfficiencyScore(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("scoreKey")} placeholder="scoreKey" className={inputClass} />
                <input {...form.register("scoreName")} placeholder="scoreName" className={inputClass} />
                <input type="number" step="any" {...form.register("efficiencyScore", { valueAsNumber: true })} placeholder="efficiencyScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthScoresPanel({ data }: { data: RetailData }) {
    const form = useForm<growthScoresFormValues>({ resolver: zodResolver(growthScoresFormSchema), defaultValues: {"intelligenceHubId":"","scoreKey":"","scoreName":"","growthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Scores" description="Enterprise retail operating system growth scores" /><div className="mt-6 space-y-3">
                {data.growthScores.length === 0 ? <EmptyState title="No growth scores" description="Create the first growth scores record." /> : data.growthScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.growthScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth scores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthScore(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("scoreKey")} placeholder="scoreKey" className={inputClass} />
                <input {...form.register("scoreName")} placeholder="scoreName" className={inputClass} />
                <input type="number" step="any" {...form.register("growthScore", { valueAsNumber: true })} placeholder="growthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StrategicInsightsPanel({ data }: { data: RetailData }) {
    const form = useForm<strategicInsightsFormValues>({ resolver: zodResolver(strategicInsightsFormSchema), defaultValues: {"intelligenceHubId":"","insightKey":"","insightTitle":"","insightPriority":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Strategic Insights" description="Enterprise retail operating system strategic insights" /><div className="mt-6 space-y-3">
                {data.strategicInsights.length === 0 ? <EmptyState title="No strategic insights" description="Create the first strategic insights record." /> : data.strategicInsights.map((item) => (
                    <ListCard key={item.id} title={String(item.insightTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.insightPriority}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create strategic insights" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStrategicInsight(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("insightKey")} placeholder="insightKey" className={inputClass} />
                <input {...form.register("insightTitle")} placeholder="insightTitle" className={inputClass} />
                <input {...form.register("insightPriority")} placeholder="insightPriority" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueForecastsPanel({ data }: { data: RetailData }) {
    const form = useForm<revenueForecastsFormValues>({ resolver: zodResolver(revenueForecastsFormSchema), defaultValues: {"intelligenceHubId":"","forecastKey":"","forecastName":"","forecastTotal":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Forecasts" description="Enterprise retail operating system revenue forecasts" /><div className="mt-6 space-y-3">
                {data.revenueForecasts.length === 0 ? <EmptyState title="No revenue forecasts" description="Create the first revenue forecasts record." /> : data.revenueForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.forecastTotal}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue forecasts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueForecast(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("forecastKey")} placeholder="forecastKey" className={inputClass} />
                <input {...form.register("forecastName")} placeholder="forecastName" className={inputClass} />
                <input type="number" step="any" {...form.register("forecastTotal", { valueAsNumber: true })} placeholder="forecastTotal" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerGrowthForecastsPanel({ data }: { data: RetailData }) {
    const form = useForm<customerGrowthForecastsFormValues>({ resolver: zodResolver(customerGrowthForecastsFormSchema), defaultValues: {"intelligenceHubId":"","forecastKey":"","forecastName":"","growthTotal":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Growth Forecasts" description="Enterprise retail operating system customer growth forecasts" /><div className="mt-6 space-y-3">
                {data.customerGrowthForecasts.length === 0 ? <EmptyState title="No customer growth forecasts" description="Create the first customer growth forecasts record." /> : data.customerGrowthForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.growthTotal}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer growth forecasts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerGrowthForecast(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("forecastKey")} placeholder="forecastKey" className={inputClass} />
                <input {...form.register("forecastName")} placeholder="forecastName" className={inputClass} />
                <input type="number" step="any" {...form.register("growthTotal", { valueAsNumber: true })} placeholder="growthTotal" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenewalForecastsPanel({ data }: { data: RetailData }) {
    const form = useForm<renewalForecastsFormValues>({ resolver: zodResolver(renewalForecastsFormSchema), defaultValues: {"intelligenceHubId":"","forecastKey":"","forecastName":"","renewalRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal Forecasts" description="Enterprise retail operating system renewal forecasts" /><div className="mt-6 space-y-3">
                {data.renewalForecasts.length === 0 ? <EmptyState title="No renewal forecasts" description="Create the first renewal forecasts record." /> : data.renewalForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.renewalRate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal forecasts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalForecast(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("forecastKey")} placeholder="forecastKey" className={inputClass} />
                <input {...form.register("forecastName")} placeholder="forecastName" className={inputClass} />
                <input type="number" step="any" {...form.register("renewalRate", { valueAsNumber: true })} placeholder="renewalRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CapacityPlanningsPanel({ data }: { data: RetailData }) {
    const form = useForm<capacityPlanningFormValues>({ resolver: zodResolver(capacityPlanningFormSchema), defaultValues: {"intelligenceHubId":"","planKey":"","planName":"","capacityUnits":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Capacity Planning" description="Enterprise retail operating system capacity planning" /><div className="mt-6 space-y-3">
                {data.capacityPlanning.length === 0 ? <EmptyState title="No capacity planning" description="Create the first capacity planning record." /> : data.capacityPlanning.map((item) => (
                    <ListCard key={item.id} title={String(item.planName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.capacityUnits}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create capacity planning" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCapacityPlanning(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("planKey")} placeholder="planKey" className={inputClass} />
                <input {...form.register("planName")} placeholder="planName" className={inputClass} />
                <input type="number" step="any" {...form.register("capacityUnits", { valueAsNumber: true })} placeholder="capacityUnits" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationalTrendsPanel({ data }: { data: RetailData }) {
    const form = useForm<operationalTrendsFormValues>({ resolver: zodResolver(operationalTrendsFormSchema), defaultValues: {"intelligenceHubId":"","trendKey":"","trendName":"","trendDirection":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operational Trends" description="Enterprise retail operating system operational trends" /><div className="mt-6 space-y-3">
                {data.operationalTrends.length === 0 ? <EmptyState title="No operational trends" description="Create the first operational trends record." /> : data.operationalTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.trendDirection}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operational trends" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationalTrend(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("trendKey")} placeholder="trendKey" className={inputClass} />
                <input {...form.register("trendName")} placeholder="trendName" className={inputClass} />
                <input {...form.register("trendDirection")} placeholder="trendDirection" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RiskForecastsPanel({ data }: { data: RetailData }) {
    const form = useForm<riskForecastsFormValues>({ resolver: zodResolver(riskForecastsFormSchema), defaultValues: {"intelligenceHubId":"","forecastKey":"","forecastName":"","riskScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk Forecasts" description="Enterprise retail operating system risk forecasts" /><div className="mt-6 space-y-3">
                {data.riskForecasts.length === 0 ? <EmptyState title="No risk forecasts" description="Create the first risk forecasts record." /> : data.riskForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.riskScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk forecasts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskForecast(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("forecastKey")} placeholder="forecastKey" className={inputClass} />
                <input {...form.register("forecastName")} placeholder="forecastName" className={inputClass} />
                <input type="number" step="any" {...form.register("riskScore", { valueAsNumber: true })} placeholder="riskScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DailyExecutiveBriefsPanel({ data }: { data: RetailData }) {
    const form = useForm<dailyExecutiveBriefsFormValues>({ resolver: zodResolver(dailyExecutiveBriefsFormSchema), defaultValues: {"intelligenceHubId":"","briefKey":"","briefTitle":"","briefDate":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Daily Executive Briefs" description="Enterprise retail operating system daily executive briefs" /><div className="mt-6 space-y-3">
                {data.dailyExecutiveBriefs.length === 0 ? <EmptyState title="No daily executive briefs" description="Create the first daily executive briefs record." /> : data.dailyExecutiveBriefs.map((item) => (
                    <ListCard key={item.id} title={String(item.briefTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.briefDate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create daily executive briefs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDailyExecutiveBrief(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("briefKey")} placeholder="briefKey" className={inputClass} />
                <input {...form.register("briefTitle")} placeholder="briefTitle" className={inputClass} />
                <input {...form.register("briefDate")} placeholder="briefDate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WeeklyBusinessSummarysPanel({ data }: { data: RetailData }) {
    const form = useForm<weeklyBusinessSummariesFormValues>({ resolver: zodResolver(weeklyBusinessSummariesFormSchema), defaultValues: {"intelligenceHubId":"","summaryKey":"","summaryTitle":"","summaryWeek":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Weekly Business Summaries" description="Enterprise retail operating system weekly business summaries" /><div className="mt-6 space-y-3">
                {data.weeklyBusinessSummaries.length === 0 ? <EmptyState title="No weekly business summaries" description="Create the first weekly business summaries record." /> : data.weeklyBusinessSummaries.map((item) => (
                    <ListCard key={item.id} title={String(item.summaryTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.summaryWeek}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create weekly business summaries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWeeklyBusinessSummary(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("summaryKey")} placeholder="summaryKey" className={inputClass} />
                <input {...form.register("summaryTitle")} placeholder="summaryTitle" className={inputClass} />
                <input {...form.register("summaryWeek")} placeholder="summaryWeek" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MonthlyPerformanceReportsPanel({ data }: { data: RetailData }) {
    const form = useForm<monthlyPerformanceReportsFormValues>({ resolver: zodResolver(monthlyPerformanceReportsFormSchema), defaultValues: {"intelligenceHubId":"","reportKey":"","reportTitle":"","reportMonth":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Monthly Performance Reports" description="Enterprise retail operating system monthly performance reports" /><div className="mt-6 space-y-3">
                {data.monthlyPerformanceReports.length === 0 ? <EmptyState title="No monthly performance reports" description="Create the first monthly performance reports record." /> : data.monthlyPerformanceReports.map((item) => (
                    <ListCard key={item.id} title={String(item.reportTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reportMonth}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create monthly performance reports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMonthlyPerformanceReport(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("reportKey")} placeholder="reportKey" className={inputClass} />
                <input {...form.register("reportTitle")} placeholder="reportTitle" className={inputClass} />
                <input {...form.register("reportMonth")} placeholder="reportMonth" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function QuarterlyExecutiveReviewsPanel({ data }: { data: RetailData }) {
    const form = useForm<quarterlyExecutiveReviewsFormValues>({ resolver: zodResolver(quarterlyExecutiveReviewsFormSchema), defaultValues: {"intelligenceHubId":"","reviewKey":"","reviewTitle":"","reviewQuarter":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Quarterly Executive Reviews" description="Enterprise retail operating system quarterly executive reviews" /><div className="mt-6 space-y-3">
                {data.quarterlyExecutiveReviews.length === 0 ? <EmptyState title="No quarterly executive reviews" description="Create the first quarterly executive reviews record." /> : data.quarterlyExecutiveReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reviewQuarter}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create quarterly executive reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createQuarterlyExecutiveReview(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("reviewTitle")} placeholder="reviewTitle" className={inputClass} />
                <input {...form.register("reviewQuarter")} placeholder="reviewQuarter" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AnnualBusinessReportsPanel({ data }: { data: RetailData }) {
    const form = useForm<annualBusinessReportsFormValues>({ resolver: zodResolver(annualBusinessReportsFormSchema), defaultValues: {"intelligenceHubId":"","reportKey":"","reportTitle":"","reportYear":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Annual Business Reports" description="Enterprise retail operating system annual business reports" /><div className="mt-6 space-y-3">
                {data.annualBusinessReports.length === 0 ? <EmptyState title="No annual business reports" description="Create the first annual business reports record." /> : data.annualBusinessReports.map((item) => (
                    <ListCard key={item.id} title={String(item.reportTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reportYear}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create annual business reports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAnnualBusinessReport(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("reportKey")} placeholder="reportKey" className={inputClass} />
                <input {...form.register("reportTitle")} placeholder="reportTitle" className={inputClass} />
                <input {...form.register("reportYear")} placeholder="reportYear" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KpiServiceConfigsPanel({ data }: { data: RetailData }) {
    const form = useForm<kpiServiceConfigsFormValues>({ resolver: zodResolver(kpiServiceConfigsFormSchema), defaultValues: {"intelligenceHubId":"","configKey":"","configName":"","configStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kpi Service Configs" description="Enterprise retail operating system kpi service configs" /><div className="mt-6 space-y-3">
                {data.kpiServiceConfigs.length === 0 ? <EmptyState title="No kpi service configs" description="Create the first kpi service configs record." /> : data.kpiServiceConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.configStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kpi service configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKpiServiceConfig(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configName")} placeholder="configName" className={inputClass} />
                <select {...form.register("configStatus")} className={inputClass}>{CONFIG_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntelligenceServiceConfigsPanel({ data }: { data: RetailData }) {
    const form = useForm<intelligenceServiceConfigsFormValues>({ resolver: zodResolver(intelligenceServiceConfigsFormSchema), defaultValues: {"intelligenceHubId":"","configKey":"","configName":"","configStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Intelligence Service Configs" description="Enterprise retail operating system intelligence service configs" /><div className="mt-6 space-y-3">
                {data.intelligenceServiceConfigs.length === 0 ? <EmptyState title="No intelligence service configs" description="Create the first intelligence service configs record." /> : data.intelligenceServiceConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.configStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create intelligence service configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntelligenceServiceConfig(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configName")} placeholder="configName" className={inputClass} />
                <select {...form.register("configStatus")} className={inputClass}>{CONFIG_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ForecastServiceConfigsPanel({ data }: { data: RetailData }) {
    const form = useForm<forecastServiceConfigsFormValues>({ resolver: zodResolver(forecastServiceConfigsFormSchema), defaultValues: {"intelligenceHubId":"","configKey":"","configName":"","configStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Forecast Service Configs" description="Enterprise retail operating system forecast service configs" /><div className="mt-6 space-y-3">
                {data.forecastServiceConfigs.length === 0 ? <EmptyState title="No forecast service configs" description="Create the first forecast service configs record." /> : data.forecastServiceConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.configStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create forecast service configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createForecastServiceConfig(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configName")} placeholder="configName" className={inputClass} />
                <select {...form.register("configStatus")} className={inputClass}>{CONFIG_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntelligenceMetricsPanel({ data }: { data: RetailData }) {
    const form = useForm<intelligenceMetricsFormValues>({ resolver: zodResolver(intelligenceMetricsFormSchema), defaultValues: {"metricsKey":"","unifiedKpiScore":0,"overallIntelligenceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Intelligence Metrics" description="Enterprise retail operating system intelligence metrics" /><div className="mt-6 space-y-3">
                {data.intelligenceMetrics.length === 0 ? <EmptyState title="No intelligence metrics" description="Create the first intelligence metrics record." /> : data.intelligenceMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallIntelligenceScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create intelligence metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntelligenceMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("unifiedKpiScore", { valueAsNumber: true })} placeholder="unifiedKpiScore" className={inputClass} />
                <input type="number" step="any" {...form.register("overallIntelligenceScore", { valueAsNumber: true })} placeholder="overallIntelligenceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntelligenceHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<intelligenceHealthFormValues>({ resolver: zodResolver(intelligenceHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Intelligence Health" description="Enterprise retail operating system intelligence health" /><div className="mt-6 space-y-3">
                {data.intelligenceHealth.length === 0 ? <EmptyState title="No intelligence health" description="Create the first intelligence health record." /> : data.intelligenceHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create intelligence health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntelligenceHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MissionProgresssPanel({ data }: { data: RetailData }) {
    const form = useForm<missionProgressFormValues>({ resolver: zodResolver(missionProgressFormSchema), defaultValues: {"intelligenceHubId":"","progressKey":"","progressName":"","progressPercent":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Mission Progress" description="Enterprise retail operating system mission progress" /><div className="mt-6 space-y-3">
                {data.missionProgress.length === 0 ? <EmptyState title="No mission progress" description="Create the first mission progress record." /> : data.missionProgress.map((item) => (
                    <ListCard key={item.id} title={String(item.progressName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.progressPercent}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mission progress" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMissionProgress(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("progressKey")} placeholder="progressKey" className={inputClass} />
                <input {...form.register("progressName")} placeholder="progressName" className={inputClass} />
                <input type="number" step="any" {...form.register("progressPercent", { valueAsNumber: true })} placeholder="progressPercent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntelligenceFailuresPanel({ data }: { data: RetailData }) {
    const form = useForm<intelligenceFailuresFormValues>({ resolver: zodResolver(intelligenceFailuresFormSchema), defaultValues: {"intelligenceHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Intelligence Failures" description="Enterprise retail operating system intelligence failures" /><div className="mt-6 space-y-3">
                {data.intelligenceFailures.length === 0 ? <EmptyState title="No intelligence failures" description="Create the first intelligence failures record." /> : data.intelligenceFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create intelligence failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntelligenceFailure(v))}>
                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Enterprise Intelligence Platform audit history" description="Security-first audit trail for jobs, events, crossModuleInsights, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Enterprise Intelligence Platform SDK" description="Import from @/src/modules/enterprise-intelligence-platform/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-fuchsia-600 dark:text-fuchsia-300">
            <ListCard title="createEnterpriseIntelligencePlatformClient()" subtitle="Factory for module-scoped Enterprise Intelligence Platform client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunKpiService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: enterprise_intelligence_platform" />
            <ListCard title="sdkRunIntelligenceService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunForecastService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-fuchsia-500">Theme: {EIP_THEME.primary} • Integration hubs loaded: {data.intelligenceHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-fuchsia-950 p-4 text-xs text-fuchsia-100">{`import { createEnterpriseIntelligencePlatformClient } from "@/src/modules/enterprise-intelligence-platform/sdk";

const intg = createEnterpriseIntelligencePlatformClient(userId, email, fullName);
await intg.registerCampus({ intelligenceHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runIntelligenceService({ intelligenceHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runForecastService({ intelligenceHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
