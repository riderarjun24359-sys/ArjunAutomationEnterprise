"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import {
    COMMUNICATION_CADENCE_OPTIONS,
    LIFECYCLE_STAGE_OPTIONS,
    OPPORTUNITY_TYPE_OPTIONS,
    PIPELINE_STAGE_OPTIONS,
    PLAYBOOK_TYPE_OPTIONS,
    PRIORITY_OPTIONS,
    RISK_LEVEL_OPTIONS,
} from "@/src/modules/customer-success/constants";
import type { useCustomerSuccess } from "@/src/modules/customer-success/hooks/useCustomerSuccess";
import {
    adoptionTrackingFormSchema,
    churnPredictionFormSchema,
    communicationPlanFormSchema,
    engagementFormSchema,
    executiveSummaryFormSchema,
    expansionOpportunityFormSchema,
    feedbackAnalysisFormSchema,
    healthScoreFormSchema,
    lifecycleManagementFormSchema,
    onboardingWorkflowFormSchema,
    qbrReportFormSchema,
    renewalPlanFormSchema,
    riskAnalysisFormSchema,
    slaMonitoringFormSchema,
    successKpiDashboardFormSchema,
    successPlaybookFormSchema,
    supportTrendAnalysisFormSchema,
    trainingRecommendationFormSchema,
    type AdoptionTrackingFormValues,
    type ChurnPredictionFormValues,
    type CommunicationPlanFormValues,
    type EngagementFormValues,
    type ExecutiveSummaryFormValues,
    type ExpansionOpportunityFormValues,
    type FeedbackAnalysisFormValues,
    type HealthScoreFormValues,
    type LifecycleManagementFormValues,
    type OnboardingWorkflowFormValues,
    type QbrReportFormValues,
    type RenewalPlanFormValues,
    type RiskAnalysisFormValues,
    type SlaMonitoringFormValues,
    type SuccessKpiDashboardFormValues,
    type SuccessPlaybookFormValues,
    type SupportTrendAnalysisFormValues,
    type TrainingRecommendationFormValues,
} from "@/src/modules/customer-success/schemas";

type CustomerSuccessData = ReturnType<typeof useCustomerSuccess>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-teal-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-teal-600">{meta}</p> : null}</div>;
}
function EngagementSelect({ data, ...props }: { data: CustomerSuccessData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>;
}

export function CustomerSuccessOverviewPanel({ data }: { data: CustomerSuccessData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Customer success summary" description="Engagement and success orchestration metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Engagements" subtitle={`${data.stats?.totalEngagements ?? 0} total`} meta={`${data.stats?.activeEngagements ?? 0} active`} />
                <ListCard title="Onboarding & Adoption" subtitle={`${data.stats?.onboardingWorkflowCount ?? 0} workflows • ${data.stats?.adoptionTrackingCount ?? 0} tracking`} meta={`Avg adoption ${(data.stats?.avgAdoptionPercent ?? 0).toFixed(0)}%`} />
                <ListCard title="Health & Renewal" subtitle={`${data.stats?.healthScoreCount ?? 0} health scores • ${data.stats?.renewalPlanCount ?? 0} renewal plans`} meta={`Avg health ${(data.stats?.avgHealthScore ?? 0).toFixed(0)} • ${data.stats?.expansionOpportunityCount ?? 0} expansion opportunities`} />
                <ListCard title="Insights & Reporting" subtitle={`${data.stats?.qbrReportCount ?? 0} QBR reports • ${data.stats?.executiveSummaryCount ?? 0} exec summaries`} meta={`${data.stats?.supportTrendAnalysisCount ?? 0} support trends • ${data.stats?.churnPredictionCount ?? 0} churn predictions`} />
            </div></Card>
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.previousWorker ?? "Production Deployment"} → ${pipeline?.currentWorker ?? "AI Customer Success Manager"} → ${pipeline?.nextWorker ?? "Continuous Customer Success"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as engagements progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function CsEngagementsPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<EngagementFormValues>({ resolver: zodResolver(engagementFormSchema), defaultValues: { title: "", engagementKey: "", baEngagementId: "", saEngagementId: "", dfEngagementId: "", qaEngagementId: "", ddEngagementId: "", solutionArchitectureId: "", workPackageId: "", qaReleaseReadinessId: "", ddReleaseVersionId: "", brdId: "", frsId: "", clientId: "", projectId: "", contactId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer success engagements" description="Engagements linked to DevOps deployment, QA, and CRM contacts" /><div className="mt-6 space-y-3">
                {data.engagements.length === 0 ? <EmptyState title="No engagements" description="Start a new customer success engagement from DevOps release outputs." /> : data.engagements.map((e) => (
                    <ListCard key={e.id} title={e.title} subtitle={`${e.engagementKey} • ${e.pipelineStage}`} meta={`${e.status}${e.ddEngagementTitle ? ` • DD: ${e.ddEngagementTitle}` : ""}${e.qaEngagementTitle ? ` • QA: ${e.qaEngagementTitle}` : ""}${e.ddReleaseVersionTitle ? ` • Release: ${e.ddReleaseVersionTitle}` : ""}${e.contactName ? ` • Contact: ${e.contactName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create engagement" description="Start a new customer success engagement" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEngagement(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("engagementKey")} placeholder="Engagement key" className={inputClass} />
                <select {...form.register("ddEngagementId")} className={inputClass}><option value="">DevOps engagement</option>{data.ddEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("qaEngagementId")} className={inputClass}><option value="">QA engagement</option>{data.qaEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("baEngagementId")} className={inputClass}><option value="">BA engagement</option>{data.baEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("saEngagementId")} className={inputClass}><option value="">SA engagement</option>{data.saEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("dfEngagementId")} className={inputClass}><option value="">DF engagement</option>{data.dfEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("qaReleaseReadinessId")} className={inputClass}><option value="">QA release readiness</option>{data.qaReleaseReadinessOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                <select {...form.register("ddReleaseVersionId")} className={inputClass}><option value="">DevOps release version</option>{data.ddReleaseVersionOptions.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
                <select {...form.register("workPackageId")} className={inputClass}><option value="">Work package</option>{data.workPackageOptions.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
                <select {...form.register("solutionArchitectureId")} className={inputClass}><option value="">Solution architecture</option>{data.solutionArchitectureOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select {...form.register("contactId")} className={inputClass}><option value="">CRM contact</option>{data.contactOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select {...form.register("projectId")} className={inputClass}><option value="">Project</option>{data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("agentId")} className={inputClass}><option value="">AI agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create engagement" />
            </form></Card>
        </div>
    );
}

export function OnboardingWorkflowsPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<OnboardingWorkflowFormValues>({ resolver: zodResolver(onboardingWorkflowFormSchema), defaultValues: { engagementId: "", workflowKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Onboarding workflows" description="Customer onboarding phases and milestones" /><div className="mt-6 space-y-3">
                {data.onboardingWorkflows.length === 0 ? <EmptyState title="No onboarding workflows" description="Define onboarding workflows for customer success engagements." /> : data.onboardingWorkflows.map((w) => (
                    <ListCard key={w.id} title={w.name} subtitle={`${w.workflowKey} • ${w.engagementTitle}`} meta={`${w.phaseCount} phases • ${w.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create onboarding workflow" description="Define an onboarding workflow" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOnboardingWorkflow(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("workflowKey")} placeholder="Workflow key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create workflow" />
            </form></Card>
        </div>
    );
}

export function AdoptionTrackingPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<AdoptionTrackingFormValues>({ resolver: zodResolver(adoptionTrackingFormSchema), defaultValues: { engagementId: "", trackingKey: "", name: "", adoptionPercent: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Adoption tracking" description="Feature adoption and usage metrics" /><div className="mt-6 space-y-3">
                {data.adoptionTracking.length === 0 ? <EmptyState title="No adoption tracking" description="Track feature adoption for customer engagements." /> : data.adoptionTracking.map((t) => (
                    <ListCard key={t.id} title={t.name} subtitle={`${t.trackingKey} • ${t.engagementTitle}`} meta={`${t.adoptionPercent}% adoption • ${t.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create adoption tracking" description="Record adoption tracking metrics" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdoptionTracking(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("trackingKey")} placeholder="Tracking key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("adoptionPercent", { valueAsNumber: true })} placeholder="Adoption %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create tracking" />
            </form></Card>
        </div>
    );
}

export function HealthScoresPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<HealthScoreFormValues>({ resolver: zodResolver(healthScoreFormSchema), defaultValues: { engagementId: "", scoreKey: "", name: "", overallScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health scores" description="Customer health score dimensions and overall score" /><div className="mt-6 space-y-3">
                {data.healthScores.length === 0 ? <EmptyState title="No health scores" description="Define health scores for customer engagements." /> : data.healthScores.map((h) => (
                    <ListCard key={h.id} title={h.name} subtitle={`${h.scoreKey} • ${h.engagementTitle}`} meta={`Score ${h.overallScore} • ${h.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health score" description="Record a customer health score" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHealthScore(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("scoreKey")} placeholder="Score key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("overallScore", { valueAsNumber: true })} placeholder="Overall score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create health score" />
            </form></Card>
        </div>
    );
}

export function RenewalPlansPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<RenewalPlanFormValues>({ resolver: zodResolver(renewalPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", renewalValueUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal plans" description="Contract renewal planning and actions" /><div className="mt-6 space-y-3">
                {data.renewalPlans.length === 0 ? <EmptyState title="No renewal plans" description="Define renewal plans for customer engagements." /> : data.renewalPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`$${p.renewalValueUsd} • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal plan" description="Record a renewal plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalPlan(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} step={0.01} {...form.register("renewalValueUsd", { valueAsNumber: true })} placeholder="Renewal value (USD)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create renewal plan" />
            </form></Card>
        </div>
    );
}

export function ExpansionOpportunitiesPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<ExpansionOpportunityFormValues>({ resolver: zodResolver(expansionOpportunityFormSchema), defaultValues: { engagementId: "", opportunityKey: "", name: "", opportunityType: "upsell", estimatedValueUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Expansion opportunities" description="Upsell, cross-sell, and expansion signals" /><div className="mt-6 space-y-3">
                {data.expansionOpportunities.length === 0 ? <EmptyState title="No expansion opportunities" description="Identify expansion opportunities for customers." /> : data.expansionOpportunities.map((o) => (
                    <ListCard key={o.id} title={o.name} subtitle={`${o.opportunityKey} • ${o.engagementTitle}`} meta={`${OPPORTUNITY_TYPE_OPTIONS.find((opt) => opt.value === o.opportunityType)?.label ?? o.opportunityType} • $${o.estimatedValueUsd} • ${o.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create expansion opportunity" description="Record an expansion opportunity" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExpansionOpportunity(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("opportunityKey")} placeholder="Opportunity key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("opportunityType")} className={inputClass}>{OPPORTUNITY_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" min={0} step={0.01} {...form.register("estimatedValueUsd", { valueAsNumber: true })} placeholder="Estimated value (USD)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create opportunity" />
            </form></Card>
        </div>
    );
}

export function RiskAnalysisPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<RiskAnalysisFormValues>({ resolver: zodResolver(riskAnalysisFormSchema), defaultValues: { engagementId: "", analysisKey: "", name: "", riskLevel: "medium", mitigationPlan: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk analysis" description="Customer risk factors and mitigation plans" /><div className="mt-6 space-y-3">
                {data.riskAnalyses.length === 0 ? <EmptyState title="No risk analyses" description="Analyze customer risk factors and mitigation." /> : data.riskAnalyses.map((r) => (
                    <ListCard key={r.id} title={r.name} subtitle={`${r.analysisKey} • ${r.engagementTitle}`} meta={`${RISK_LEVEL_OPTIONS.find((o) => o.value === r.riskLevel)?.label ?? r.riskLevel} • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk analysis" description="Record a risk analysis" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskAnalysis(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("analysisKey")} placeholder="Analysis key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("mitigationPlan")} placeholder="Mitigation plan" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create analysis" />
            </form></Card>
        </div>
    );
}

export function SupportTrendsPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<SupportTrendAnalysisFormValues>({ resolver: zodResolver(supportTrendAnalysisFormSchema), defaultValues: { engagementId: "", analysisKey: "", name: "", insights: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Support trend analysis" description="Support ticket trends and insights" /><div className="mt-6 space-y-3">
                {data.supportTrendAnalyses.length === 0 ? <EmptyState title="No support trend analyses" description="Analyze support trends for customer engagements." /> : data.supportTrendAnalyses.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.analysisKey} • ${a.engagementTitle}`} meta={`${a.metricCount} metrics • ${a.status} • ${a.insightsPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create support trend analysis" description="Record support trend insights" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSupportTrendAnalysis(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("analysisKey")} placeholder="Analysis key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("insights")} placeholder="Insights" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create analysis" />
            </form></Card>
        </div>
    );
}

export function SuccessPlaybooksPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<SuccessPlaybookFormValues>({ resolver: zodResolver(successPlaybookFormSchema), defaultValues: { engagementId: "", playbookKey: "", name: "", playbookType: "onboarding" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Success playbooks" description="Repeatable success playbooks and steps" /><div className="mt-6 space-y-3">
                {data.successPlaybooks.length === 0 ? <EmptyState title="No success playbooks" description="Define success playbooks for customer engagements." /> : data.successPlaybooks.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.playbookKey} • ${p.engagementTitle}`} meta={`${PLAYBOOK_TYPE_OPTIONS.find((o) => o.value === p.playbookType)?.label ?? p.playbookType} • ${p.stepCount} steps • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create success playbook" description="Define a success playbook" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSuccessPlaybook(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("playbookKey")} placeholder="Playbook key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("playbookType")} className={inputClass}>{PLAYBOOK_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create playbook" />
            </form></Card>
        </div>
    );
}

export function QbrReportsPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<QbrReportFormValues>({ resolver: zodResolver(qbrReportFormSchema), defaultValues: { engagementId: "", reportKey: "", title: "", quarter: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="QBR reports" description="Quarterly business review reports" /><div className="mt-6 space-y-3">
                {data.qbrReports.length === 0 ? <EmptyState title="No QBR reports" description="Generate QBR reports for customer engagements." /> : data.qbrReports.map((r) => (
                    <ListCard key={r.id} title={r.title} subtitle={`${r.reportKey} • ${r.engagementTitle}`} meta={`${r.quarter} • ${r.sectionCount} sections • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create QBR report" description="Record a QBR report" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createQbrReport(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("reportKey")} placeholder="Report key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("quarter")} placeholder="Quarter (e.g. Q1 2026)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create report" />
            </form></Card>
        </div>
    );
}

export function CommunicationPlansPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<CommunicationPlanFormValues>({ resolver: zodResolver(communicationPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", cadence: "monthly" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Communication plans" description="Customer communication cadence and channels" /><div className="mt-6 space-y-3">
                {data.communicationPlans.length === 0 ? <EmptyState title="No communication plans" description="Define communication plans for customer engagements." /> : data.communicationPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${COMMUNICATION_CADENCE_OPTIONS.find((o) => o.value === p.cadence)?.label ?? p.cadence} • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create communication plan" description="Define a communication plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommunicationPlan(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("cadence")} className={inputClass}>{COMMUNICATION_CADENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function TrainingRecommendationsPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<TrainingRecommendationFormValues>({ resolver: zodResolver(trainingRecommendationFormSchema), defaultValues: { engagementId: "", recommendationKey: "", name: "", priority: "medium" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Training recommendations" description="Customer training modules and priorities" /><div className="mt-6 space-y-3">
                {data.trainingRecommendations.length === 0 ? <EmptyState title="No training recommendations" description="Recommend training for customer engagements." /> : data.trainingRecommendations.map((r) => (
                    <ListCard key={r.id} title={r.name} subtitle={`${r.recommendationKey} • ${r.engagementTitle}`} meta={`${PRIORITY_OPTIONS.find((o) => o.value === r.priority)?.label ?? r.priority} • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create training recommendation" description="Record a training recommendation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTrainingRecommendation(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("recommendationKey")} placeholder="Recommendation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("priority")} className={inputClass}>{PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create recommendation" />
            </form></Card>
        </div>
    );
}

export function FeedbackAnalysisPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<FeedbackAnalysisFormValues>({ resolver: zodResolver(feedbackAnalysisFormSchema), defaultValues: { engagementId: "", analysisKey: "", name: "", sentimentScore: 0, recommendations: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feedback analysis" description="Customer feedback sentiment and themes" /><div className="mt-6 space-y-3">
                {data.feedbackAnalyses.length === 0 ? <EmptyState title="No feedback analyses" description="Analyze customer feedback for engagements." /> : data.feedbackAnalyses.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.analysisKey} • ${a.engagementTitle}`} meta={`Sentiment ${a.sentimentScore} • ${a.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feedback analysis" description="Record a feedback analysis" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeedbackAnalysis(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("analysisKey")} placeholder="Analysis key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("sentimentScore", { valueAsNumber: true })} placeholder="Sentiment score" className={inputClass} />
                <textarea {...form.register("recommendations")} placeholder="Recommendations" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create analysis" />
            </form></Card>
        </div>
    );
}

export function SlaMonitoringPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<SlaMonitoringFormValues>({ resolver: zodResolver(slaMonitoringFormSchema), defaultValues: { engagementId: "", monitoringKey: "", name: "", compliancePercent: 100 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="SLA monitoring" description="Service level agreement compliance tracking" /><div className="mt-6 space-y-3">
                {data.slaMonitoring.length === 0 ? <EmptyState title="No SLA monitoring" description="Monitor SLA compliance for customer engagements." /> : data.slaMonitoring.map((m) => (
                    <ListCard key={m.id} title={m.name} subtitle={`${m.monitoringKey} • ${m.engagementTitle}`} meta={`${m.compliancePercent}% compliance • ${m.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create SLA monitoring" description="Record SLA monitoring metrics" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSlaMonitoring(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("monitoringKey")} placeholder="Monitoring key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("compliancePercent", { valueAsNumber: true })} placeholder="Compliance %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create monitoring" />
            </form></Card>
        </div>
    );
}

export function KpiDashboardsPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<SuccessKpiDashboardFormValues>({ resolver: zodResolver(successKpiDashboardFormSchema), defaultValues: { engagementId: "", dashboardKey: "", name: "", refreshCadence: "weekly" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="KPI dashboards" description="Customer success KPI dashboards and metrics" /><div className="mt-6 space-y-3">
                {data.successKpiDashboards.length === 0 ? <EmptyState title="No KPI dashboards" description="Define KPI dashboards for customer engagements." /> : data.successKpiDashboards.map((d) => (
                    <ListCard key={d.id} title={d.name} subtitle={`${d.dashboardKey} • ${d.engagementTitle}`} meta={`${d.kpiCount} KPIs • ${d.refreshCadence} refresh • ${d.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create KPI dashboard" description="Define a success KPI dashboard" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSuccessKpiDashboard(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("dashboardKey")} placeholder="Dashboard key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("refreshCadence")} placeholder="Refresh cadence" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create dashboard" />
            </form></Card>
        </div>
    );
}

export function ChurnPredictionPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<ChurnPredictionFormValues>({ resolver: zodResolver(churnPredictionFormSchema), defaultValues: { engagementId: "", predictionKey: "", name: "", churnProbability: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Churn prediction" description="Churn probability and retention actions" /><div className="mt-6 space-y-3">
                {data.churnPredictions.length === 0 ? <EmptyState title="No churn predictions" description="Predict churn risk for customer engagements." /> : data.churnPredictions.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.predictionKey} • ${p.engagementTitle}`} meta={`${p.churnProbability}% churn probability • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create churn prediction" description="Record a churn prediction" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createChurnPrediction(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("predictionKey")} placeholder="Prediction key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("churnProbability", { valueAsNumber: true })} placeholder="Churn probability %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create prediction" />
            </form></Card>
        </div>
    );
}

export function LifecycleManagementPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<LifecycleManagementFormValues>({ resolver: zodResolver(lifecycleManagementFormSchema), defaultValues: { engagementId: "", lifecycleKey: "", name: "", currentStage: "onboarding" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lifecycle management" description="Customer lifecycle stages and transitions" /><div className="mt-6 space-y-3">
                {data.lifecycleManagement.length === 0 ? <EmptyState title="No lifecycle management" description="Track customer lifecycle stages." /> : data.lifecycleManagement.map((l) => (
                    <ListCard key={l.id} title={l.name} subtitle={`${l.lifecycleKey} • ${l.engagementTitle}`} meta={`${LIFECYCLE_STAGE_OPTIONS.find((o) => o.value === l.currentStage)?.label ?? l.currentStage} • ${l.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lifecycle management" description="Record lifecycle stage tracking" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLifecycleManagement(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("lifecycleKey")} placeholder="Lifecycle key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("currentStage")} className={inputClass}>{LIFECYCLE_STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create lifecycle" />
            </form></Card>
        </div>
    );
}

export function ExecutiveSummariesPanel({ data }: { data: CustomerSuccessData }) {
    const form = useForm<ExecutiveSummaryFormValues>({ resolver: zodResolver(executiveSummaryFormSchema), defaultValues: { engagementId: "", summaryKey: "", title: "", summaryContent: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive summaries" description="Executive-level customer success summaries" /><div className="mt-6 space-y-3">
                {data.executiveSummaries.length === 0 ? <EmptyState title="No executive summaries" description="Generate executive summaries for customer engagements." /> : data.executiveSummaries.map((s) => (
                    <ListCard key={s.id} title={s.title} subtitle={`${s.summaryKey} • ${s.engagementTitle}`} meta={`${s.status} • ${s.contentPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive summary" description="Record an executive summary" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveSummary(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("summaryKey")} placeholder="Summary key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("summaryContent")} placeholder="Summary content" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create summary" />
            </form></Card>
        </div>
    );
}

export function CsAuditPanel({ data }: { data: CustomerSuccessData }) {
    return (
        <Card hover><SectionHeader title="Customer success audit history" description="Complete audit trail for all customer success operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function CustomerSuccessSdkPanel({ data }: { data: CustomerSuccessData }) {
    return (
        <Card hover><SectionHeader title="Shared Customer Success SDK" description="Import from @/src/modules/customer-success/sdk for AI Orchestration, Knowledge, DevOps handoff, and support trend integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createCustomerSuccessClient()" subtitle="Factory for module-scoped Customer Success client with auth context" meta="Used by AI Orchestration, Knowledge, DevOps & Deployment handoff, and Support modules" />
            <ListCard title="client.startEngagement()" subtitle="Start a new CS engagement linked to DevOps release version" meta={`${data.engagements.length} engagements active`} />
            <ListCard title="client.generateArtifact()" subtitle="Generate onboarding workflow, health score, QBR report, or executive summary" meta={`${data.onboardingWorkflows.length + data.healthScores.length + data.qbrReports.length + data.executiveSummaries.length} artifacts generated`} />
            <ListCard title="client.runAnalysis()" subtitle="Run churn, support trends, or feedback analysis" meta={`${data.churnPredictions.length + data.supportTrendAnalyses.length + data.feedbackAnalyses.length} analyses completed`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createCustomerSuccessClient } from "@/src/modules/customer-success/sdk";
import { createDevopsDeploymentClient } from "@/src/modules/devops-deployment/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";

const cs = createCustomerSuccessClient(userId, email, fullName);
const dd = createDevopsDeploymentClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);

const ddEngagement = await dd.startEngagement({ title: "CRM DevOps", engagementKey: "crm-dd", agentId });
const releaseVersions = await dd.getReleaseVersions();
const csEngagement = await cs.startEngagement({ title: "CRM Customer Success", engagementKey: "crm-cs", ddEngagementId: ddEngagement.engagementId, ddReleaseVersionId: releaseVersions[0]?.id, clientId, contactId, agentId });
const context = await knowledge.resolveContext({ contextKey: "cs-crm-cs", agentId });
const onboarding = await cs.generateArtifact({ engagementId: csEngagement.engagementId, artifactType: "onboarding_workflow", title: "CRM Onboarding", content: "phases" });
const supportTrends = await cs.runAnalysis({ engagementId: csEngagement.engagementId, analysisType: "support_trends", inputPayload: { analysisKey: "SUPPORT-001", name: "CRM Support Trends", insights: "Ticket volume declining" } });`}</pre>
        </div></Card>
    );
}
