"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import {
    DECISION_TYPE_OPTIONS,
    INSIGHT_TYPE_OPTIONS,
    METRIC_TYPE_OPTIONS,
    MILESTONE_TYPE_OPTIONS,
    PIPELINE_STAGE_OPTIONS,
    PRIORITY_LEVEL_OPTIONS,
    REFRESH_CADENCE_OPTIONS,
    RISK_LEVEL_OPTIONS,
    STAKEHOLDER_TYPE_OPTIONS,
    INFLUENCE_LEVEL_OPTIONS,
} from "@/src/modules/founder-os/constants";
import type { useFounderOs } from "@/src/modules/founder-os/hooks/useFounderOs";
import {
    boardReportFormSchema,
    capitalPlanFormSchema,
    companyMilestoneFormSchema,
    decisionLogFormSchema,
    executiveDashboardFormSchema,
    founderAgendaFormSchema,
    founderInsightFormSchema,
    growthMetricFormSchema,
    investorRelationFormSchema,
    priorityFormSchema,
    productRoadmapFormSchema,
    resourceAllocationFormSchema,
    revenueRunwayFormSchema,
    riskRegisterFormSchema,
    stakeholderFormSchema,
    strategicOkrFormSchema,
    teamCapacityFormSchema,
    workspaceFormSchema,
    type BoardReportFormValues,
    type CapitalPlanFormValues,
    type CompanyMilestoneFormValues,
    type DecisionLogFormValues,
    type ExecutiveDashboardFormValues,
    type FounderAgendaFormValues,
    type FounderInsightFormValues,
    type GrowthMetricFormValues,
    type InvestorRelationFormValues,
    type PriorityFormValues,
    type ProductRoadmapFormValues,
    type ResourceAllocationFormValues,
    type RevenueRunwayFormValues,
    type RiskRegisterFormValues,
    type StakeholderFormValues,
    type StrategicOkrFormValues,
    type TeamCapacityFormValues,
    type WorkspaceFormValues,
} from "@/src/modules/founder-os/schemas";

type FounderOsData = ReturnType<typeof useFounderOs>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-amber-600">{meta}</p> : null}</div>;
}
function WorkspaceSelect({ data, ...props }: { data: FounderOsData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Workspace</option>{data.workspaceOptions.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select>;
}

export function FounderOsOverviewPanel({ data }: { data: FounderOsData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Founder OS summary" description="Strategic execution and founder orchestration metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Workspaces" subtitle={`${data.stats?.totalWorkspaces ?? 0} total`} meta={`${data.stats?.activeWorkspaces ?? 0} active`} />
                <ListCard title="OKRs & Runway" subtitle={`${data.stats?.strategicOkrCount ?? 0} OKRs • ${data.stats?.revenueRunwayCount ?? 0} runway models`} meta={`Avg runway ${(data.stats?.avgRunwayMonths ?? 0).toFixed(1)} months`} />
                <ListCard title="Board & Investor" subtitle={`${data.stats?.boardReportCount ?? 0} board reports • ${data.stats?.investorRelationCount ?? 0} investor relations`} meta={`${data.stats?.capitalPlanCount ?? 0} capital plans • ${data.stats?.stakeholderCount ?? 0} stakeholders`} />
                <ListCard title="Execution & Risk" subtitle={`${data.stats?.priorityCount ?? 0} priorities • ${data.stats?.decisionLogCount ?? 0} decisions`} meta={`${data.stats?.riskRegisterCount ?? 0} risks • ${data.stats?.founderInsightCount ?? 0} insights`} />
            </div></Card>
            {data.phase3Stats ? <Card hover><SectionHeader title="Phase 3 executive dashboard" description="Live customer operated platform metrics from COP SDK" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Live production status" subtitle={data.phase3Stats.liveProductionStatus} meta={`Overall score ${data.phase3Stats.overallOperatedScore.toFixed(1)}`} />
                <ListCard title="Customer onboarding" subtitle={data.phase3Stats.customerOnboardingStatus} meta={`${data.phase3Stats.pendingApprovals} pending approvals`} />
                <ListCard title="Revenue today" subtitle={`$${data.phase3Stats.revenueToday.toLocaleString()}`} meta={`${data.phase3Stats.activeIncidents} active incidents`} />
                <ListCard title="Daily executive briefing" subtitle={data.phase3Stats.dailyExecutiveBriefing} meta={`Platform ${data.phase3Stats.platformAvailability.toFixed(0)}% • CSAT ${data.phase3Stats.customerSatisfactionOverview.toFixed(0)}%`} />
            </div></Card> : null}
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.previousWorker ?? "AI Customer Success Manager"} → ${pipeline?.currentWorker ?? "Founder Operating System"} → ${pipeline?.nextWorker ?? "Strategic Execution"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as workspaces progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function FoWorkspacesPanel({ data }: { data: FounderOsData }) {
    const form = useForm<WorkspaceFormValues>({ resolver: zodResolver(workspaceFormSchema), defaultValues: { title: "", workspaceKey: "", baEngagementId: "", saEngagementId: "", dfEngagementId: "", qaEngagementId: "", ddEngagementId: "", csEngagementId: "", clientId: "", projectId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Founder OS workspaces" description="Workspaces linked to AI workers, customer success, and enterprise modules" /><div className="mt-6 space-y-3">
                {data.workspaces.length === 0 ? <EmptyState title="No workspaces" description="Start a new founder operating system workspace from customer success outputs." /> : data.workspaces.map((w) => (
                    <ListCard key={w.id} title={w.title} subtitle={`${w.workspaceKey} • ${w.pipelineStage}`} meta={`${w.status}${w.csEngagementTitle ? ` • CS: ${w.csEngagementTitle}` : ""}${w.ddEngagementTitle ? ` • DD: ${w.ddEngagementTitle}` : ""}${w.clientName ? ` • Client: ${w.clientName}` : ""}${w.projectName ? ` • Project: ${w.projectName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workspace" description="Start a new founder operating system workspace" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkspace(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("workspaceKey")} placeholder="Workspace key" className={inputClass} />
                <select {...form.register("baEngagementId")} className={inputClass}><option value="">BA engagement</option>{data.baEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("saEngagementId")} className={inputClass}><option value="">SA engagement</option>{data.saEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("dfEngagementId")} className={inputClass}><option value="">DF engagement</option>{data.dfEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("qaEngagementId")} className={inputClass}><option value="">QA engagement</option>{data.qaEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("ddEngagementId")} className={inputClass}><option value="">DevOps engagement</option>{data.ddEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("csEngagementId")} className={inputClass}><option value="">CS engagement</option>{data.csEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select {...form.register("projectId")} className={inputClass}><option value="">Project</option>{data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("agentId")} className={inputClass}><option value="">AI agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <select {...form.register("sessionId")} className={inputClass}><option value="">AI session</option>{data.sessionOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create workspace" />
            </form></Card>
        </div>
    );
}

export function StrategicOkrsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<StrategicOkrFormValues>({ resolver: zodResolver(strategicOkrFormSchema), defaultValues: { workspaceId: "", okrKey: "", title: "", objective: "", quarter: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Strategic OKRs" description="Quarterly objectives and key results" /><div className="mt-6 space-y-3">
                {data.strategicOkrs.length === 0 ? <EmptyState title="No strategic OKRs" description="Define strategic OKRs for founder workspaces." /> : data.strategicOkrs.map((o) => (
                    <ListCard key={o.id} title={o.title} subtitle={`${o.okrKey} • ${o.workspaceTitle}`} meta={`${o.quarter} • ${o.keyResultCount} key results • ${o.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create strategic OKR" description="Define a strategic OKR" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStrategicOkr(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("okrKey")} placeholder="OKR key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("quarter")} placeholder="Quarter (e.g. Q1 2026)" className={inputClass} />
                <textarea {...form.register("objective")} placeholder="Objective" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create OKR" />
            </form></Card>
        </div>
    );
}

export function ExecutiveDashboardsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<ExecutiveDashboardFormValues>({ resolver: zodResolver(executiveDashboardFormSchema), defaultValues: { workspaceId: "", dashboardKey: "", name: "", refreshCadence: "weekly" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive dashboards" description="Founder-level KPI dashboards and widgets" /><div className="mt-6 space-y-3">
                {data.executiveDashboards.length === 0 ? <EmptyState title="No executive dashboards" description="Define executive dashboards for founder workspaces." /> : data.executiveDashboards.map((d) => (
                    <ListCard key={d.id} title={d.name} subtitle={`${d.dashboardKey} • ${d.workspaceTitle}`} meta={`${d.widgetCount} widgets • ${REFRESH_CADENCE_OPTIONS.find((o) => o.value === d.refreshCadence)?.label ?? d.refreshCadence} • ${d.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive dashboard" description="Define an executive dashboard" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveDashboard(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("dashboardKey")} placeholder="Dashboard key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("refreshCadence")} className={inputClass}>{REFRESH_CADENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create dashboard" />
            </form></Card>
        </div>
    );
}

export function RevenueRunwayPanel({ data }: { data: FounderOsData }) {
    const form = useForm<RevenueRunwayFormValues>({ resolver: zodResolver(revenueRunwayFormSchema), defaultValues: { workspaceId: "", runwayKey: "", name: "", monthlyBurnUsd: 0, cashBalanceUsd: 0, runwayMonths: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue runway" description="Cash balance, burn rate, and runway projections" /><div className="mt-6 space-y-3">
                {data.revenueRunway.length === 0 ? <EmptyState title="No revenue runway models" description="Model revenue runway for founder workspaces." /> : data.revenueRunway.map((r) => (
                    <ListCard key={r.id} title={r.name} subtitle={`${r.runwayKey} • ${r.workspaceTitle}`} meta={`$${r.cashBalanceUsd.toLocaleString()} cash • ${r.runwayMonths} months runway • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue runway" description="Record a revenue runway model" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueRunway(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("runwayKey")} placeholder="Runway key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} step={0.01} {...form.register("monthlyBurnUsd", { valueAsNumber: true })} placeholder="Monthly burn (USD)" className={inputClass} />
                <input type="number" min={0} step={0.01} {...form.register("cashBalanceUsd", { valueAsNumber: true })} placeholder="Cash balance (USD)" className={inputClass} />
                <input type="number" min={0} step={0.1} {...form.register("runwayMonths", { valueAsNumber: true })} placeholder="Runway months" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create runway" />
            </form></Card>
        </div>
    );
}

export function TeamCapacityPanel({ data }: { data: FounderOsData }) {
    const form = useForm<TeamCapacityFormValues>({ resolver: zodResolver(teamCapacityFormSchema), defaultValues: { workspaceId: "", capacityKey: "", name: "", utilizationPercent: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Team capacity" description="Team utilization and allocation tracking" /><div className="mt-6 space-y-3">
                {data.teamCapacity.length === 0 ? <EmptyState title="No team capacity records" description="Track team capacity for founder workspaces." /> : data.teamCapacity.map((t) => (
                    <ListCard key={t.id} title={t.name} subtitle={`${t.capacityKey} • ${t.workspaceTitle}`} meta={`${t.utilizationPercent}% utilization • ${t.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create team capacity" description="Record team capacity metrics" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTeamCapacity(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("capacityKey")} placeholder="Capacity key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("utilizationPercent", { valueAsNumber: true })} placeholder="Utilization %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create capacity" />
            </form></Card>
        </div>
    );
}

export function ProductRoadmapsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<ProductRoadmapFormValues>({ resolver: zodResolver(productRoadmapFormSchema), defaultValues: { workspaceId: "", roadmapKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Product roadmaps" description="Product initiatives and timeline planning" /><div className="mt-6 space-y-3">
                {data.productRoadmaps.length === 0 ? <EmptyState title="No product roadmaps" description="Define product roadmaps for founder workspaces." /> : data.productRoadmaps.map((r) => (
                    <ListCard key={r.id} title={r.name} subtitle={`${r.roadmapKey} • ${r.workspaceTitle}`} meta={`${r.initiativeCount} initiatives • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create product roadmap" description="Define a product roadmap" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProductRoadmap(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("roadmapKey")} placeholder="Roadmap key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create roadmap" />
            </form></Card>
        </div>
    );
}

export function InvestorRelationsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<InvestorRelationFormValues>({ resolver: zodResolver(investorRelationFormSchema), defaultValues: { workspaceId: "", relationKey: "", investorName: "", round: "", engagementNotes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Investor relations" description="Investor engagement and fundraising tracking" /><div className="mt-6 space-y-3">
                {data.investorRelations.length === 0 ? <EmptyState title="No investor relations" description="Track investor relations for founder workspaces." /> : data.investorRelations.map((r) => (
                    <ListCard key={r.id} title={r.investorName} subtitle={`${r.relationKey} • ${r.workspaceTitle}`} meta={`${r.round} • ${r.status}${r.nextTouchpoint ? ` • Next: ${r.nextTouchpoint}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create investor relation" description="Record an investor relation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInvestorRelation(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("relationKey")} placeholder="Relation key" className={inputClass} />
                <input {...form.register("investorName")} placeholder="Investor name" className={inputClass} />
                <input {...form.register("round")} placeholder="Round (e.g. Series A)" className={inputClass} />
                <textarea {...form.register("engagementNotes")} placeholder="Engagement notes" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create relation" />
            </form></Card>
        </div>
    );
}

export function BoardReportsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<BoardReportFormValues>({ resolver: zodResolver(boardReportFormSchema), defaultValues: { workspaceId: "", reportKey: "", title: "", reportingPeriod: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Board reports" description="Board meeting reports and sections" /><div className="mt-6 space-y-3">
                {data.boardReports.length === 0 ? <EmptyState title="No board reports" description="Generate board reports for founder workspaces." /> : data.boardReports.map((r) => (
                    <ListCard key={r.id} title={r.title} subtitle={`${r.reportKey} • ${r.workspaceTitle}`} meta={`${r.reportingPeriod} • ${r.sectionCount} sections • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create board report" description="Record a board report" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBoardReport(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("reportKey")} placeholder="Report key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("reportingPeriod")} placeholder="Reporting period" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create report" />
            </form></Card>
        </div>
    );
}

export function DecisionLogPanel({ data }: { data: FounderOsData }) {
    const form = useForm<DecisionLogFormValues>({ resolver: zodResolver(decisionLogFormSchema), defaultValues: { workspaceId: "", decisionKey: "", title: "", decisionType: "strategic", rationale: "", outcome: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Decision log" description="Strategic and operational decision records" /><div className="mt-6 space-y-3">
                {data.decisionLog.length === 0 ? <EmptyState title="No decision log entries" description="Record decisions for founder workspaces." /> : data.decisionLog.map((d) => (
                    <ListCard key={d.id} title={d.title} subtitle={`${d.decisionKey} • ${d.workspaceTitle}`} meta={`${DECISION_TYPE_OPTIONS.find((o) => o.value === d.decisionType)?.label ?? d.decisionType} • ${d.status} • ${d.outcomePreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create decision log entry" description="Record a decision" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDecisionLog(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("decisionKey")} placeholder="Decision key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("decisionType")} className={inputClass}>{DECISION_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("rationale")} placeholder="Rationale" rows={2} className={inputClass} />
                <textarea {...form.register("outcome")} placeholder="Outcome" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create decision" />
            </form></Card>
        </div>
    );
}

export function PrioritiesPanel({ data }: { data: FounderOsData }) {
    const form = useForm<PriorityFormValues>({ resolver: zodResolver(priorityFormSchema), defaultValues: { workspaceId: "", priorityKey: "", title: "", priorityLevel: "medium", owner: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Priorities" description="Founder-level priority tracking" /><div className="mt-6 space-y-3">
                {data.priorities.length === 0 ? <EmptyState title="No priorities" description="Define priorities for founder workspaces." /> : data.priorities.map((p) => (
                    <ListCard key={p.id} title={p.title} subtitle={`${p.priorityKey} • ${p.workspaceTitle}`} meta={`${PRIORITY_LEVEL_OPTIONS.find((o) => o.value === p.priorityLevel)?.label ?? p.priorityLevel} • ${p.owner} • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create priority" description="Record a priority" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPriority(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("priorityKey")} placeholder="Priority key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("priorityLevel")} className={inputClass}>{PRIORITY_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("owner")} placeholder="Owner" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create priority" />
            </form></Card>
        </div>
    );
}

export function ResourceAllocationsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<ResourceAllocationFormValues>({ resolver: zodResolver(resourceAllocationFormSchema), defaultValues: { workspaceId: "", allocationKey: "", name: "", budgetUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Resource allocations" description="Budget and resource allocation tracking" /><div className="mt-6 space-y-3">
                {data.resourceAllocations.length === 0 ? <EmptyState title="No resource allocations" description="Define resource allocations for founder workspaces." /> : data.resourceAllocations.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.allocationKey} • ${a.workspaceTitle}`} meta={`$${a.budgetUsd.toLocaleString()} budget • ${a.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create resource allocation" description="Record a resource allocation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createResourceAllocation(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("allocationKey")} placeholder="Allocation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} step={0.01} {...form.register("budgetUsd", { valueAsNumber: true })} placeholder="Budget (USD)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create allocation" />
            </form></Card>
        </div>
    );
}

export function RiskRegisterPanel({ data }: { data: FounderOsData }) {
    const form = useForm<RiskRegisterFormValues>({ resolver: zodResolver(riskRegisterFormSchema), defaultValues: { workspaceId: "", riskKey: "", title: "", riskLevel: "medium", mitigationPlan: "", owner: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk register" description="Company risk factors and mitigation plans" /><div className="mt-6 space-y-3">
                {data.riskRegister.length === 0 ? <EmptyState title="No risk register entries" description="Track risks for founder workspaces." /> : data.riskRegister.map((r) => (
                    <ListCard key={r.id} title={r.title} subtitle={`${r.riskKey} • ${r.workspaceTitle}`} meta={`${RISK_LEVEL_OPTIONS.find((o) => o.value === r.riskLevel)?.label ?? r.riskLevel} • ${r.owner} • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk register entry" description="Record a risk" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskRegister(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("riskKey")} placeholder="Risk key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("owner")} placeholder="Owner" className={inputClass} />
                <textarea {...form.register("mitigationPlan")} placeholder="Mitigation plan" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create risk" />
            </form></Card>
        </div>
    );
}

export function GrowthMetricsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<GrowthMetricFormValues>({ resolver: zodResolver(growthMetricFormSchema), defaultValues: { workspaceId: "", metricKey: "", name: "", metricType: "revenue", currentValue: 0, targetValue: 0, growthRatePercent: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth metrics" description="Revenue, user, and retention growth tracking" /><div className="mt-6 space-y-3">
                {data.growthMetrics.length === 0 ? <EmptyState title="No growth metrics" description="Track growth metrics for founder workspaces." /> : data.growthMetrics.map((m) => (
                    <ListCard key={m.id} title={m.name} subtitle={`${m.metricKey} • ${m.workspaceTitle}`} meta={`${METRIC_TYPE_OPTIONS.find((o) => o.value === m.metricType)?.label ?? m.metricType} • ${m.growthRatePercent}% growth • ${m.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth metric" description="Record a growth metric" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthMetric(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("metricKey")} placeholder="Metric key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("metricType")} className={inputClass}>{METRIC_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" {...form.register("currentValue", { valueAsNumber: true })} placeholder="Current value" className={inputClass} />
                <input type="number" {...form.register("targetValue", { valueAsNumber: true })} placeholder="Target value" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("growthRatePercent", { valueAsNumber: true })} placeholder="Growth rate %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create metric" />
            </form></Card>
        </div>
    );
}

export function FounderAgendaPanel({ data }: { data: FounderOsData }) {
    const form = useForm<FounderAgendaFormValues>({ resolver: zodResolver(founderAgendaFormSchema), defaultValues: { workspaceId: "", agendaKey: "", title: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Founder agenda" description="Founder calendar and agenda items" /><div className="mt-6 space-y-3">
                {data.founderAgenda.length === 0 ? <EmptyState title="No founder agenda items" description="Define founder agenda for workspaces." /> : data.founderAgenda.map((a) => (
                    <ListCard key={a.id} title={a.title} subtitle={`${a.agendaKey} • ${a.workspaceTitle}`} meta={`${a.itemCount} items • ${a.status}${a.scheduledAt ? ` • ${a.scheduledAt}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create founder agenda" description="Record a founder agenda" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFounderAgenda(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("agendaKey")} placeholder="Agenda key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create agenda" />
            </form></Card>
        </div>
    );
}

export function StakeholdersPanel({ data }: { data: FounderOsData }) {
    const form = useForm<StakeholderFormValues>({ resolver: zodResolver(stakeholderFormSchema), defaultValues: { workspaceId: "", stakeholderKey: "", name: "", stakeholderType: "internal", influenceLevel: "medium" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Stakeholders" description="Internal, board, investor, and partner stakeholders" /><div className="mt-6 space-y-3">
                {data.stakeholders.length === 0 ? <EmptyState title="No stakeholders" description="Track stakeholders for founder workspaces." /> : data.stakeholders.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.stakeholderKey} • ${s.workspaceTitle}`} meta={`${STAKEHOLDER_TYPE_OPTIONS.find((o) => o.value === s.stakeholderType)?.label ?? s.stakeholderType} • ${INFLUENCE_LEVEL_OPTIONS.find((o) => o.value === s.influenceLevel)?.label ?? s.influenceLevel} • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create stakeholder" description="Record a stakeholder" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStakeholder(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("stakeholderKey")} placeholder="Stakeholder key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("stakeholderType")} className={inputClass}>{STAKEHOLDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("influenceLevel")} className={inputClass}>{INFLUENCE_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create stakeholder" />
            </form></Card>
        </div>
    );
}

export function CapitalPlansPanel({ data }: { data: FounderOsData }) {
    const form = useForm<CapitalPlanFormValues>({ resolver: zodResolver(capitalPlanFormSchema), defaultValues: { workspaceId: "", planKey: "", name: "", fundingTargetUsd: 0, timeline: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Capital plans" description="Fundraising targets and use of funds" /><div className="mt-6 space-y-3">
                {data.capitalPlans.length === 0 ? <EmptyState title="No capital plans" description="Define capital plans for founder workspaces." /> : data.capitalPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.workspaceTitle}`} meta={`$${p.fundingTargetUsd.toLocaleString()} target • ${p.timeline} • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create capital plan" description="Record a capital plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCapitalPlan(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} step={0.01} {...form.register("fundingTargetUsd", { valueAsNumber: true })} placeholder="Funding target (USD)" className={inputClass} />
                <input {...form.register("timeline")} placeholder="Timeline" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function CompanyMilestonesPanel({ data }: { data: FounderOsData }) {
    const form = useForm<CompanyMilestoneFormValues>({ resolver: zodResolver(companyMilestoneFormSchema), defaultValues: { workspaceId: "", milestoneKey: "", title: "", milestoneType: "product", successCriteria: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Company milestones" description="Product, fundraising, team, and revenue milestones" /><div className="mt-6 space-y-3">
                {data.companyMilestones.length === 0 ? <EmptyState title="No company milestones" description="Define milestones for founder workspaces." /> : data.companyMilestones.map((m) => (
                    <ListCard key={m.id} title={m.title} subtitle={`${m.milestoneKey} • ${m.workspaceTitle}`} meta={`${MILESTONE_TYPE_OPTIONS.find((o) => o.value === m.milestoneType)?.label ?? m.milestoneType} • ${m.status}${m.targetDate ? ` • ${m.targetDate}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create company milestone" description="Record a company milestone" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompanyMilestone(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("milestoneKey")} placeholder="Milestone key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("milestoneType")} className={inputClass}>{MILESTONE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("successCriteria")} placeholder="Success criteria" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create milestone" />
            </form></Card>
        </div>
    );
}

export function FounderInsightsPanel({ data }: { data: FounderOsData }) {
    const form = useForm<FounderInsightFormValues>({ resolver: zodResolver(founderInsightFormSchema), defaultValues: { workspaceId: "", insightKey: "", title: "", insightType: "strategic", content: "", confidenceScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Founder insights" description="Strategic, financial, operational, and market insights" /><div className="mt-6 space-y-3">
                {data.founderInsights.length === 0 ? <EmptyState title="No founder insights" description="Generate insights for founder workspaces." /> : data.founderInsights.map((i) => (
                    <ListCard key={i.id} title={i.title} subtitle={`${i.insightKey} • ${i.workspaceTitle}`} meta={`${INSIGHT_TYPE_OPTIONS.find((o) => o.value === i.insightType)?.label ?? i.insightType} • ${i.confidenceScore}% confidence • ${i.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create founder insight" description="Record a founder insight" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFounderInsight(v))}>
                <WorkspaceSelect data={data} {...form.register("workspaceId")} />
                <input {...form.register("insightKey")} placeholder="Insight key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("insightType")} className={inputClass}>{INSIGHT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" min={0} max={100} {...form.register("confidenceScore", { valueAsNumber: true })} placeholder="Confidence score" className={inputClass} />
                <textarea {...form.register("content")} placeholder="Content" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create insight" />
            </form></Card>
        </div>
    );
}

export function FoAuditPanel({ data }: { data: FounderOsData }) {
    return (
        <Card hover><SectionHeader title="Founder OS audit history" description="Complete audit trail for all founder operating system operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function FounderOsSdkPanel({ data }: { data: FounderOsData }) {
    return (
        <Card hover><SectionHeader title="Shared Founder OS SDK" description="Import from @/src/modules/founder-os/sdk for AI Orchestration, Knowledge, Customer Success handoff, and strategic execution integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createFounderOsClient()" subtitle="Factory for module-scoped Founder OS client with auth context" meta="Used by AI Orchestration, Knowledge, Customer Success handoff, and Enterprise modules" />
            <ListCard title="client.startWorkspace()" subtitle="Start a new Founder OS workspace linked to CS engagement" meta={`${data.workspaces.length} workspaces active`} />
            <ListCard title="client.generateArtifact()" subtitle="Generate strategic OKR, board report, founder insight, or executive dashboard" meta={`${data.strategicOkrs.length + data.boardReports.length + data.founderInsights.length + data.executiveDashboards.length} artifacts generated`} />
            <ListCard title="client.runAnalysis()" subtitle="Run runway, growth, or risk analysis" meta={`${data.revenueRunway.length + data.growthMetrics.length + data.riskRegister.length} analyses completed`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createFounderOsClient } from "@/src/modules/founder-os/sdk";
import { createCustomerSuccessClient } from "@/src/modules/customer-success/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";

const fo = createFounderOsClient(userId, email, fullName);
const cs = createCustomerSuccessClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);

const csEngagements = await cs.getEngagements();
const workspace = await fo.startWorkspace({ title: "Q1 Strategic Plan", workspaceKey: "q1-strategic", csEngagementId: csEngagements[0]?.id, clientId, agentId, sessionId });
const context = await knowledge.resolveContext({ contextKey: "fo-q1-strategic", agentId });
const okr = await fo.generateArtifact({ workspaceId: workspace.workspaceId, artifactType: "strategic_okr", title: "Q1 Revenue OKR", content: "Achieve $1M ARR" });
const runway = await fo.runAnalysis({ workspaceId: workspace.workspaceId, analysisType: "runway", inputPayload: { runwayKey: "RUNWAY-001", name: "Q1 Runway", monthlyBurnUsd: 50000, cashBalanceUsd: 500000, runwayMonths: 10 } });`}</pre>
        </div></Card>
    );
}

export function FounderOsPhase3Panel({ data }: { data: FounderOsData }) {
    const p3 = data.phase3Stats;
    if (!p3) return <EmptyState title="Phase 3 data unavailable" description="Customer operated platform metrics will appear once COP is configured." />;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Live production status" description="Real-time production health from customer operated platform" /><div className="mt-6 space-y-3">
                <ListCard title="Production status" subtitle={p3.liveProductionStatus} meta={`Score ${p3.overallOperatedScore.toFixed(1)}`} />
                <ListCard title="Platform availability" subtitle={`${p3.platformAvailability.toFixed(1)}%`} meta={`${p3.activeIncidents} active incidents`} />
            </div></Card>
            <Card hover><SectionHeader title="Customer & revenue" description="Onboarding progress and daily revenue" /><div className="mt-6 space-y-3">
                <ListCard title="Customer onboarding" subtitle={p3.customerOnboardingStatus} meta={`${p3.pendingApprovals} pending approvals`} />
                <ListCard title="Revenue today" subtitle={`$${p3.revenueToday.toLocaleString()}`} meta={`CSAT ${p3.customerSatisfactionOverview.toFixed(0)}%`} />
            </div></Card>
            <Card hover className="xl:col-span-2"><SectionHeader title="Daily executive briefing" description="Executive summary from customer operated platform" /><div className="mt-6">
                <ListCard title={p3.dailyExecutiveBriefing} subtitle="Customer operated platform executive briefing" meta="Powered by createCustomerOperatedPlatformClient" />
            </div></Card>
        </div>
    );
}

export function FounderOsPhase4Panel({ data }: { data: FounderOsData }) {
    const p4 = data.phase4Stats;
    if (!p4) return <EmptyState title="Phase 4 data unavailable" description="Enterprise intelligence platform metrics will appear once EIP is configured." />;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Unified enterprise dashboard" description="Cross-platform intelligence score from EIP SDK" /><div className="mt-6 space-y-3">
                <ListCard title="Overall intelligence score" subtitle={`${p4.unifiedEnterpriseDashboard.toFixed(1)}`} meta={`Cross-platform KPIs ${p4.crossPlatformKpis.toFixed(1)}`} />
                <ListCard title="Executive intelligence" subtitle={`${p4.executiveIntelligence.toFixed(1)}`} meta={`${p4.predictiveInsights} predictive insights`} />
            </div></Card>
            <Card hover><SectionHeader title="Forecasts & risk" description="Predictive analytics from enterprise intelligence platform" /><div className="mt-6 space-y-3">
                <ListCard title="Revenue forecast" subtitle={`$${p4.revenueForecast.toLocaleString()}`} meta={`Customer forecast ${p4.customerForecast.toLocaleString()}`} />
                <ListCard title="Risk overview" subtitle={`${p4.riskOverview.toFixed(1)}`} meta={`Mission progress ${p4.missionProgress.toFixed(1)}%`} />
            </div></Card>
            <Card hover className="xl:col-span-2"><SectionHeader title="Enterprise intelligence summary" description="Unified KPI, executive, predictive, and mission metrics" /><div className="mt-6">
                <ListCard title="Enterprise Intelligence Platform" subtitle="Unified enterprise dashboard with cross-platform KPIs and executive intelligence" meta="Powered by createEnterpriseIntelligencePlatformClient" />
            </div></Card>
        </div>
    );
}
