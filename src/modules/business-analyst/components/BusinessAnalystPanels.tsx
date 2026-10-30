"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { PIPELINE_STAGE_OPTIONS, PRIORITY_OPTIONS, PROCESS_TYPE_OPTIONS, RISK_LEVEL_OPTIONS, SCOPE_TYPE_OPTIONS } from "@/src/modules/business-analyst/constants";
import type { useBusinessAnalyst } from "@/src/modules/business-analyst/hooks/useBusinessAnalyst";
import {
    acceptanceCriterionFormSchema,
    brdFormSchema,
    costEstimateFormSchema,
    engagementFormSchema,
    featurePriorityFormSchema,
    frsFormSchema,
    gapAnalysisFormSchema,
    interviewFormSchema,
    processMapFormSchema,
    proposalFormSchema,
    reviewApprovalFormSchema,
    riskFormSchema,
    scopeItemFormSchema,
    stakeholderFormSchema,
    timelineEstimateFormSchema,
    userStoryFormSchema,
    versionFormSchema,
    type AcceptanceCriterionFormValues,
    type BrdFormValues,
    type CostEstimateFormValues,
    type EngagementFormValues,
    type FeaturePriorityFormValues,
    type FrsFormValues,
    type GapAnalysisFormValues,
    type InterviewFormValues,
    type ProcessMapFormValues,
    type ProposalFormValues,
    type ReviewApprovalFormValues,
    type RiskFormValues,
    type ScopeItemFormValues,
    type StakeholderFormValues,
    type TimelineEstimateFormValues,
    type UserStoryFormValues,
    type VersionFormValues,
} from "@/src/modules/business-analyst/schemas";

type BusinessAnalystData = ReturnType<typeof useBusinessAnalyst>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}</div>;
}

export function BaOverviewPanel({ data }: { data: BusinessAnalystData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Business analyst summary" description="Engagement and requirements metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Engagements" subtitle={`${data.stats?.totalEngagements ?? 0} total`} meta={`${data.stats?.activeEngagements ?? 0} active`} />
                <ListCard title="Requirements" subtitle={`${data.stats?.brdCount ?? 0} BRDs • ${data.stats?.frsCount ?? 0} FRS docs`} meta={`${data.stats?.userStoryCount ?? 0} user stories`} />
                <ListCard title="Analysis" subtitle={`${data.stats?.gapAnalysisCount ?? 0} gap analyses`} meta={`${data.stats?.processMapCount ?? 0} process maps • ${data.stats?.openRisks ?? 0} open risks`} />
                <ListCard title="Delivery" subtitle={`${data.stats?.proposalCount ?? 0} proposals`} meta={`${data.stats?.pendingApprovals ?? 0} pending approvals`} />
            </div></Card>
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.currentWorker ?? "AI Business Analyst"} → ${pipeline?.nextWorker ?? "AI Solution Architect"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as engagements progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function EngagementsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<EngagementFormValues>({ resolver: zodResolver(engagementFormSchema), defaultValues: { title: "", engagementKey: "", clientId: "", projectId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="BA engagements" description="Customer requirement engagements managed by the AI Business Analyst" /><div className="mt-6 space-y-3">
                {data.engagements.length === 0 ? <EmptyState title="No engagements" description="Start a new engagement to capture customer requirements." /> : data.engagements.map((e) => (
                    <ListCard key={e.id} title={e.title} subtitle={`${e.engagementKey} • ${e.pipelineStage}`} meta={`${e.status}${e.clientName ? ` • ${e.clientName}` : ""}${e.projectName ? ` • ${e.projectName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create engagement" description="Start a new business analyst engagement" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEngagement(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("engagementKey")} placeholder="Engagement key" className={inputClass} />
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select {...form.register("projectId")} className={inputClass}><option value="">Project</option>{data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("agentId")} className={inputClass}><option value="">AI agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create engagement" />
            </form></Card>
        </div>
    );
}

export function InterviewsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<InterviewFormValues>({ resolver: zodResolver(interviewFormSchema), defaultValues: { engagementId: "", interviewKey: "", stakeholderName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Requirement interviews" description="Stakeholder interviews for requirement discovery" /><div className="mt-6 space-y-3">
                {data.interviews.length === 0 ? <EmptyState title="No interviews" description="Conduct stakeholder interviews to gather requirements." /> : data.interviews.map((i) => (
                    <ListCard key={i.id} title={i.stakeholderName} subtitle={`${i.interviewKey} • ${i.engagementTitle}`} meta={`${i.status} • ${i.questionCount} questions${i.conductedAt ? ` • ${new Date(i.conductedAt).toLocaleDateString()}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Schedule interview" description="Record a requirement interview" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInterview(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("interviewKey")} placeholder="Interview key" className={inputClass} />
                <input {...form.register("stakeholderName")} placeholder="Stakeholder name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create interview" />
            </form></Card>
        </div>
    );
}

export function BrdsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<BrdFormValues>({ resolver: zodResolver(brdFormSchema), defaultValues: { engagementId: "", title: "", executiveSummary: "", businessObjectives: "", scopeOverview: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business requirement documents" description="BRDs generated from customer requirements and interviews" /><div className="mt-6 space-y-3">
                {data.brds.length === 0 ? <EmptyState title="No BRDs" description="Generate business requirement documents from engagements." /> : data.brds.map((b) => (
                    <ListCard key={b.id} title={b.title} subtitle={`${b.engagementTitle} • v${b.currentVersion}`} meta={`${b.status} • ${b.summaryPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create BRD" description="Generate a business requirement document" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrd(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("executiveSummary")} placeholder="Executive summary" rows={3} className={inputClass} />
                <textarea {...form.register("businessObjectives")} placeholder="Business objectives" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create BRD" />
            </form></Card>
        </div>
    );
}

export function FrsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<FrsFormValues>({ resolver: zodResolver(frsFormSchema), defaultValues: { engagementId: "", title: "", functionalRequirements: "", nonFunctionalRequirements: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Functional requirement specifications" description="FRS documents derived from approved BRDs" /><div className="mt-6 space-y-3">
                {data.frsDocuments.length === 0 ? <EmptyState title="No FRS documents" description="Create functional requirement specifications from BRDs." /> : data.frsDocuments.map((f) => (
                    <ListCard key={f.id} title={f.title} subtitle={f.engagementTitle} meta={`${f.status} • ${f.requirementsPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create FRS" description="Generate a functional requirement specification" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFrs(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("functionalRequirements")} placeholder="Functional requirements" rows={4} className={inputClass} />
                <textarea {...form.register("nonFunctionalRequirements")} placeholder="Non-functional requirements" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create FRS" />
            </form></Card>
        </div>
    );
}

export function UserStoriesPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<UserStoryFormValues>({ resolver: zodResolver(userStoryFormSchema), defaultValues: { engagementId: "", storyKey: "", title: "", description: "", persona: "", priority: "medium" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="User stories" description="User stories decomposed from functional requirements" /><div className="mt-6 space-y-3">
                {data.userStories.length === 0 ? <EmptyState title="No user stories" description="Create user stories from FRS documents." /> : data.userStories.map((s) => (
                    <ListCard key={s.id} title={s.title} subtitle={`${s.storyKey} • ${s.engagementTitle}`} meta={`${s.priority} • ${s.persona} • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create user story" description="Add a user story to an engagement" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUserStory(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("storyKey")} placeholder="Story key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("persona")} placeholder="Persona" className={inputClass} />
                <select {...form.register("priority")} className={inputClass}>{PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create user story" />
            </form></Card>
        </div>
    );
}

export function AcceptanceCriteriaPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<AcceptanceCriterionFormValues>({ resolver: zodResolver(acceptanceCriterionFormSchema), defaultValues: { userStoryId: "", criterionKey: "", description: "", testScenario: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Acceptance criteria" description="Testable acceptance criteria for user stories" /><div className="mt-6 space-y-3">
                {data.acceptanceCriteria.length === 0 ? <EmptyState title="No acceptance criteria" description="Define acceptance criteria for user stories." /> : data.acceptanceCriteria.map((c) => (
                    <ListCard key={c.id} title={c.criterionKey} subtitle={`${c.userStoryTitle} • ${c.description}`} meta={c.status} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add criterion" description="Create acceptance criteria for a user story" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAcceptanceCriterion(v))}>
                <select {...form.register("userStoryId")} className={inputClass}><option value="">User story</option>{data.userStoryOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <input {...form.register("criterionKey")} placeholder="Criterion key" className={inputClass} />
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <textarea {...form.register("testScenario")} placeholder="Test scenario" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add criterion" />
            </form></Card>
        </div>
    );
}

export function ProcessMapsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<ProcessMapFormValues>({ resolver: zodResolver(processMapFormSchema), defaultValues: { engagementId: "", name: "", processType: "as_is", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process maps" description="As-is and to-be process documentation" /><div className="mt-6 space-y-3">
                {data.processMaps.length === 0 ? <EmptyState title="No process maps" description="Document current and future-state processes." /> : data.processMaps.map((m) => (
                    <ListCard key={m.id} title={m.name} subtitle={`${m.engagementTitle} • ${m.processType}`} meta={`${m.status} • ${m.stepCount} steps`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process map" description="Document a business process" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessMap(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Process name" className={inputClass} />
                <select {...form.register("processType")} className={inputClass}>{PROCESS_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create process map" />
            </form></Card>
        </div>
    );
}

export function GapAnalysisPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<GapAnalysisFormValues>({ resolver: zodResolver(gapAnalysisFormSchema), defaultValues: { engagementId: "", currentState: "", desiredState: "", recommendations: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Gap analysis" description="Current vs desired state analysis with recommendations" /><div className="mt-6 space-y-3">
                {data.gapAnalyses.length === 0 ? <EmptyState title="No gap analyses" description="Run gap analysis to identify improvement opportunities." /> : data.gapAnalyses.map((g) => (
                    <ListCard key={g.id} title={g.engagementTitle} subtitle={`Current: ${g.currentStatePreview}`} meta={`${g.status} • ${g.gapCount} gaps • Desired: ${g.desiredStatePreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Run gap analysis" description="Compare current and desired states" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGapAnalysis(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <textarea {...form.register("currentState")} placeholder="Current state" rows={3} className={inputClass} />
                <textarea {...form.register("desiredState")} placeholder="Desired state" rows={3} className={inputClass} />
                <textarea {...form.register("recommendations")} placeholder="Recommendations" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Run analysis" />
            </form></Card>
        </div>
    );
}

export function PrioritizationPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<FeaturePriorityFormValues>({ resolver: zodResolver(featurePriorityFormSchema), defaultValues: { engagementId: "", featureName: "", priorityScore: 50, rationale: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feature prioritization" description="Ranked feature priorities for delivery planning" /><div className="mt-6 space-y-3">
                {data.featurePriorities.length === 0 ? <EmptyState title="No priorities" description="Prioritize features for implementation planning." /> : data.featurePriorities.map((p) => (
                    <ListCard key={p.id} title={p.featureName} subtitle={p.engagementTitle} meta={`Rank #${p.priorityRank} • Score: ${p.priorityScore} • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add priority" description="Score and rank a feature" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeaturePriority(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("featureName")} placeholder="Feature name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("priorityScore", { valueAsNumber: true })} placeholder="Priority score (0–100)" className={inputClass} />
                <textarea {...form.register("rationale")} placeholder="Rationale" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add priority" />
            </form></Card>
        </div>
    );
}

export function RisksPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<RiskFormValues>({ resolver: zodResolver(riskFormSchema), defaultValues: { engagementId: "", riskKey: "", title: "", description: "", likelihood: "medium", impact: "medium", mitigation: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk register" description="Identified risks with likelihood, impact, and mitigation" /><div className="mt-6 space-y-3">
                {data.risks.length === 0 ? <EmptyState title="No risks" description="Document risks identified during analysis." /> : data.risks.map((r) => (
                    <ListCard key={r.id} title={r.title} subtitle={`${r.riskKey} • ${r.engagementTitle}`} meta={`Likelihood: ${r.likelihood} • Impact: ${r.impact} • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add risk" description="Register a project risk" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRisk(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("riskKey")} placeholder="Risk key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("likelihood")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} likelihood</option>)}</select>
                <select {...form.register("impact")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} impact</option>)}</select>
                <textarea {...form.register("mitigation")} placeholder="Mitigation strategy" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add risk" />
            </form></Card>
        </div>
    );
}

export function StakeholdersPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<StakeholderFormValues>({ resolver: zodResolver(stakeholderFormSchema), defaultValues: { engagementId: "", name: "", role: "", influence: "", interest: "", contactInfo: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Stakeholder map" description="Stakeholders with influence and interest analysis" /><div className="mt-6 space-y-3">
                {data.stakeholders.length === 0 ? <EmptyState title="No stakeholders" description="Map stakeholders for requirement engagements." /> : data.stakeholders.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.role} • ${s.engagementTitle}`} meta={`Influence: ${s.influence} • Interest: ${s.interest} • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add stakeholder" description="Register a stakeholder" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStakeholder(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("role")} placeholder="Role" className={inputClass} />
                <input {...form.register("influence")} placeholder="Influence level" className={inputClass} />
                <input {...form.register("interest")} placeholder="Interest level" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add stakeholder" />
            </form></Card>
        </div>
    );
}

export function ScopePanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<ScopeItemFormValues>({ resolver: zodResolver(scopeItemFormSchema), defaultValues: { engagementId: "", itemKey: "", title: "", scopeType: "in_scope", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Scope definition" description="In-scope, out-of-scope, and deferred items" /><div className="mt-6 space-y-3">
                {data.scopeItems.length === 0 ? <EmptyState title="No scope items" description="Define scope boundaries for engagements." /> : data.scopeItems.map((s) => (
                    <ListCard key={s.id} title={s.title} subtitle={`${s.itemKey} • ${s.engagementTitle}`} meta={`${SCOPE_TYPE_OPTIONS.find((o) => o.value === s.scopeType)?.label ?? s.scopeType} • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add scope item" description="Define a scope boundary item" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createScopeItem(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("itemKey")} placeholder="Item key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("scopeType")} className={inputClass}>{SCOPE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("description")} placeholder="Description" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add scope item" />
            </form></Card>
        </div>
    );
}

export function ProposalsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<ProposalFormValues>({ resolver: zodResolver(proposalFormSchema), defaultValues: { engagementId: "", title: "", executiveSummary: "", deliverables: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Solution proposals" description="Proposals generated from completed analysis" /><div className="mt-6 space-y-3">
                {data.proposals.length === 0 ? <EmptyState title="No proposals" description="Generate solution proposals from engagements." /> : data.proposals.map((p) => (
                    <ListCard key={p.id} title={p.title} subtitle={p.engagementTitle} meta={`${p.status} • ${p.summaryPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create proposal" description="Generate a solution proposal" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProposal(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("executiveSummary")} placeholder="Executive summary" rows={3} className={inputClass} />
                <textarea {...form.register("deliverables")} placeholder="Deliverables" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create proposal" />
            </form></Card>
        </div>
    );
}

export function CostEstimatesPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<CostEstimateFormValues>({ resolver: zodResolver(costEstimateFormSchema), defaultValues: { engagementId: "", estimateKey: "", totalAmount: 0, currency: "INR", assumptions: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cost estimates" description="Project cost estimates linked to engagements" /><div className="mt-6 space-y-3">
                {data.costEstimates.length === 0 ? <EmptyState title="No cost estimates" description="Create cost estimates for proposals." /> : data.costEstimates.map((c) => (
                    <ListCard key={c.id} title={c.estimateKey} subtitle={c.engagementTitle} meta={`${c.currency} ${c.totalAmount.toLocaleString()} • ${c.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create estimate" description="Add a cost estimate" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCostEstimate(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("estimateKey")} placeholder="Estimate key" className={inputClass} />
                <input type="number" min={0} step={0.01} {...form.register("totalAmount", { valueAsNumber: true })} placeholder="Total amount" className={inputClass} />
                <input {...form.register("currency")} placeholder="Currency" className={inputClass} />
                <textarea {...form.register("assumptions")} placeholder="Assumptions" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create estimate" />
            </form></Card>
        </div>
    );
}

export function TimelineEstimatesPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<TimelineEstimateFormValues>({ resolver: zodResolver(timelineEstimateFormSchema), defaultValues: { engagementId: "", estimateKey: "", totalDurationDays: 30, assumptions: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Timeline estimates" description="Delivery timeline estimates for engagements" /><div className="mt-6 space-y-3">
                {data.timelineEstimates.length === 0 ? <EmptyState title="No timeline estimates" description="Create timeline estimates for proposals." /> : data.timelineEstimates.map((t) => (
                    <ListCard key={t.id} title={t.estimateKey} subtitle={t.engagementTitle} meta={`${t.totalDurationDays} days • ${t.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create estimate" description="Add a timeline estimate" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTimelineEstimate(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("estimateKey")} placeholder="Estimate key" className={inputClass} />
                <input type="number" min={1} {...form.register("totalDurationDays", { valueAsNumber: true })} placeholder="Total duration (days)" className={inputClass} />
                <textarea {...form.register("assumptions")} placeholder="Assumptions" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create estimate" />
            </form></Card>
        </div>
    );
}

export function VersionsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<VersionFormValues>({ resolver: zodResolver(versionFormSchema), defaultValues: { engagementId: "", entityType: "brd", entityId: "", content: "", changeSummary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document versioning" description="Version history for BRDs, FRS, and other artifacts" /><div className="mt-6 space-y-3">
                {data.versions.length === 0 ? <EmptyState title="No versions" description="Versions are created when documents are updated." /> : data.versions.map((v) => (
                    <ListCard key={v.id} title={`${v.entityType} — v${v.versionNumber}`} subtitle={`${v.engagementTitle} • ${v.changeSummary}`} meta={new Date(v.createdAt).toLocaleString()} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create version" description="Publish a new document version" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVersion(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("entityType")} placeholder="Entity type (brd, frs, proposal)" className={inputClass} />
                <input {...form.register("entityId")} placeholder="Entity ID" className={inputClass} />
                <textarea {...form.register("content")} placeholder="Updated content" rows={4} className={inputClass} />
                <input {...form.register("changeSummary")} placeholder="Change summary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create version" />
            </form></Card>
        </div>
    );
}

export function ApprovalsPanel({ data }: { data: BusinessAnalystData }) {
    const form = useForm<ReviewApprovalFormValues>({ resolver: zodResolver(reviewApprovalFormSchema), defaultValues: { engagementId: "", entityType: "brd", entityId: "", reviewerId: "", comments: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Review approvals" description="Stakeholder review and approval workflow" /><div className="mt-6 space-y-3">
                {data.reviewApprovals.length === 0 ? <EmptyState title="No approvals" description="Submit documents for stakeholder review." /> : data.reviewApprovals.map((a) => (
                    <ListCard key={a.id} title={`${a.entityType} review`} subtitle={`${a.engagementTitle} • ${a.reviewerName ?? "Unassigned"}`} meta={`${a.approvalStatus} • ${a.comments}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Request approval" description="Submit an artifact for review" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReviewApproval(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("entityType")} placeholder="Entity type" className={inputClass} />
                <input {...form.register("entityId")} placeholder="Entity ID" className={inputClass} />
                <select {...form.register("reviewerId")} className={inputClass}><option value="">Reviewer</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <textarea {...form.register("comments")} placeholder="Comments" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Request approval" />
            </form></Card>
        </div>
    );
}

export function BaAuditPanel({ data }: { data: BusinessAnalystData }) {
    return (
        <Card hover><SectionHeader title="Business analyst audit history" description="Complete audit trail for all BA operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function BaSdkPanel({ data }: { data: BusinessAnalystData }) {
    return (
        <Card hover><SectionHeader title="Shared Business Analyst SDK" description="Import from @/src/modules/business-analyst/sdk for AI Orchestration and Knowledge integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createBusinessAnalystClient()" subtitle="Factory for module-scoped BA client with auth context" meta="Used by AI Orchestration and enterprise modules" />
            <ListCard title="client.startEngagement()" subtitle="Start a new BA engagement in the AI worker pipeline" meta={`${data.engagements.length} engagements active`} />
            <ListCard title="client.generateArtifact()" subtitle="Generate BRD, FRS, user story, or proposal artifacts" meta={`${data.brds.length + data.frsDocuments.length + data.userStories.length + data.proposals.length} artifacts generated`} />
            <ListCard title="client.runAnalysis()" subtitle="Run gap, risk, or priority analysis on an engagement" meta={`${data.gapAnalyses.length + data.risks.length + data.featurePriorities.length} analyses completed`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createBusinessAnalystClient } from "@/src/modules/business-analyst/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";

const ba = createBusinessAnalystClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);

const engagement = await ba.startEngagement({ title: "CRM Migration", engagementKey: "crm-migration", agentId });
const context = await knowledge.resolveContext({ contextKey: "ba-engagement", agentId });
const artifact = await ba.generateArtifact({ engagementId: engagement.engagementId, artifactType: "brd", title: "CRM Migration BRD", content: "..." });
const analysis = await ba.runAnalysis({ engagementId: engagement.engagementId, analysisType: "gap", inputPayload: { currentState: "...", desiredState: "..." } });`}</pre>
        </div></Card>
    );
}
