"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import {
    CONTROL_AREA_OPTIONS,
    FRAMEWORK_OPTIONS,
    INSIGHT_TYPE_OPTIONS,
    KPI_CATEGORY_OPTIONS,
    NOTIFICATION_CHANNEL_OPTIONS,
    PIPELINE_STAGE_OPTIONS,
    PLATFORM_MODULE_OPTIONS,
    PRIORITY_OPTIONS,
    RECOMMENDATION_TYPE_OPTIONS,
    SEVERITY_OPTIONS,
} from "@/src/modules/autonomous-company/constants";
import type { useAutonomousCompany } from "@/src/modules/autonomous-company/hooks/useAutonomousCompany";
import {
    activityFeedFormSchema,
    approvalWorkflowFormSchema,
    automationFormSchema,
    businessKpiFormSchema,
    commandPaletteFormSchema,
    companyContextFormSchema,
    complianceDashboardFormSchema,
    emergencyWorkflowFormSchema,
    eventBusFormSchema,
    executiveInsightFormSchema,
    notificationFormSchema,
    operationalHealthFormSchema,
    predictiveRecommendationFormSchema,
    securityGovernanceFormSchema,
    systemSearchFormSchema,
    timelineFormSchema,
    workerCollaborationFormSchema,
    workflowOrchestrationFormSchema,
    type ActivityFeedFormValues,
    type ApprovalWorkflowFormValues,
    type AutomationFormValues,
    type BusinessKpiFormValues,
    type CommandPaletteFormValues,
    type CompanyContextFormValues,
    type ComplianceDashboardFormValues,
    type EmergencyWorkflowFormValues,
    type EventBusFormValues,
    type ExecutiveInsightFormValues,
    type NotificationFormValues,
    type OperationalHealthFormValues,
    type PredictiveRecommendationFormValues,
    type SecurityGovernanceFormValues,
    type SystemSearchFormValues,
    type TimelineFormValues,
    type WorkerCollaborationFormValues,
    type WorkflowOrchestrationFormValues,
} from "@/src/modules/autonomous-company/schemas";

type AutonomousCompanyData = ReturnType<typeof useAutonomousCompany>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-violet-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-violet-600">{meta}</p> : null}</div>;
}
function ContextSelect({ data, ...props }: { data: AutonomousCompanyData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Company context</option>{data.contextOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>;
}

export function AutonomousCompanyOverviewPanel({ data }: { data: AutonomousCompanyData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Autonomous Company summary" description="Cross-module orchestration and continuous operations metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Company Contexts" subtitle={`${data.stats?.totalContexts ?? 0} total`} meta={`${data.stats?.activeContexts ?? 0} active`} />
                <ListCard title="Orchestration & Events" subtitle={`${data.stats?.workflowOrchestrationCount ?? 0} workflows • ${data.stats?.eventBusCount ?? 0} events`} meta={`${data.stats?.workerCollaborationCount ?? 0} collaborations • ${data.stats?.automationCount ?? 0} automations`} />
                <ListCard title="Governance & KPIs" subtitle={`${data.stats?.kpiCount ?? 0} KPIs • ${data.stats?.securityGovernanceCount ?? 0} security controls`} meta={`${data.stats?.complianceDashboardCount ?? 0} compliance dashboards • ${(data.stats?.avgCompliancePercent ?? 0).toFixed(0)}% avg compliance`} />
                <ListCard title="Operations & Health" subtitle={`${data.stats?.operationalHealthCount ?? 0} health records • ${data.stats?.emergencyWorkflowCount ?? 0} emergency workflows`} meta={`${(data.stats?.avgOperationalScore ?? 0).toFixed(0)}% avg health • ${data.stats?.predictionCount ?? 0} predictions`} />
            </div></Card>
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.previousWorker ?? "Founder Operating System"} → ${pipeline?.currentWorker ?? "Autonomous Company v1"} → ${pipeline?.nextWorker ?? "Continuous Operations"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as company contexts progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function CompanyContextsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<CompanyContextFormValues>({ resolver: zodResolver(companyContextFormSchema), defaultValues: { title: "", contextKey: "", baEngagementId: "", saEngagementId: "", dfEngagementId: "", qaEngagementId: "", ddEngagementId: "", csEngagementId: "", foWorkspaceId: "", clientId: "", projectId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Company contexts" description="Contexts linked to Founder OS, AI workers, and enterprise modules" /><div className="mt-6 space-y-3">
                {data.companyContexts.length === 0 ? <EmptyState title="No company contexts" description="Start a new autonomous company context from Founder OS outputs." /> : data.companyContexts.map((c) => (
                    <ListCard key={c.id} title={c.title} subtitle={`${c.contextKey} • ${c.pipelineStage}`} meta={`${c.status}${c.foWorkspaceTitle ? ` • FO: ${c.foWorkspaceTitle}` : ""}${c.csEngagementTitle ? ` • CS: ${c.csEngagementTitle}` : ""}${c.clientName ? ` • Client: ${c.clientName}` : ""}${c.projectName ? ` • Project: ${c.projectName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create company context" description="Start a new autonomous company context" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompanyContext(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("contextKey")} placeholder="Context key" className={inputClass} />
                <select {...form.register("foWorkspaceId")} className={inputClass}><option value="">Founder OS workspace</option>{data.foWorkspaceOptions.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
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
                <SaveButton loading={form.formState.isSubmitting} label="Create context" />
            </form></Card>
        </div>
    );
}

export function WorkflowOrchestrationPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<WorkflowOrchestrationFormValues>({ resolver: zodResolver(workflowOrchestrationFormSchema), defaultValues: { contextId: "", orchestrationKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow orchestration" description="Cross-module workflow definitions and orchestration steps" /><div className="mt-6 space-y-3">
                {data.workflowOrchestrations.length === 0 ? <EmptyState title="No workflow orchestrations" description="Define workflow orchestrations for company contexts." /> : data.workflowOrchestrations.map((w) => (
                    <ListCard key={w.id} title={w.name} subtitle={`${w.orchestrationKey} • ${w.contextTitle}`} meta={`${w.moduleCount} modules • ${w.stepCount} steps • ${w.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow orchestration" description="Define a cross-module workflow orchestration" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowOrchestration(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("orchestrationKey")} placeholder="Orchestration key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create orchestration" />
            </form></Card>
        </div>
    );
}

export function EventBusPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<EventBusFormValues>({ resolver: zodResolver(eventBusFormSchema), defaultValues: { contextId: "", eventKey: "", name: "", sourceModule: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Event bus" description="Cross-module event routing and pub/sub definitions" /><div className="mt-6 space-y-3">
                {data.eventBusEvents.length === 0 ? <EmptyState title="No event bus events" description="Define event bus events for company contexts." /> : data.eventBusEvents.map((e) => (
                    <ListCard key={e.id} title={e.name} subtitle={`${e.eventKey} • ${e.contextTitle}`} meta={`${PLATFORM_MODULE_OPTIONS.find((o) => o.value === e.sourceModule)?.label ?? e.sourceModule} • ${e.targetCount} targets • ${e.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create event bus event" description="Define an event bus event" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEventBusEvent(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("eventKey")} placeholder="Event key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("sourceModule")} className={inputClass}><option value="">Source module</option>{PLATFORM_MODULE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create event" />
            </form></Card>
        </div>
    );
}

export function WorkerCollaborationPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<WorkerCollaborationFormValues>({ resolver: zodResolver(workerCollaborationFormSchema), defaultValues: { contextId: "", collaborationKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Worker collaboration" description="AI worker handoffs and collaboration rules" /><div className="mt-6 space-y-3">
                {data.workerCollaborations.length === 0 ? <EmptyState title="No worker collaborations" description="Define worker collaborations for company contexts." /> : data.workerCollaborations.map((w) => (
                    <ListCard key={w.id} title={w.name} subtitle={`${w.collaborationKey} • ${w.contextTitle}`} meta={`${w.workerCount} workers • ${w.handoffCount} handoffs • ${w.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create worker collaboration" description="Define a worker collaboration" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkerCollaboration(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("collaborationKey")} placeholder="Collaboration key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create collaboration" />
            </form></Card>
        </div>
    );
}

export function ApprovalWorkflowsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<ApprovalWorkflowFormValues>({ resolver: zodResolver(approvalWorkflowFormSchema), defaultValues: { contextId: "", workflowKey: "", title: "", requiredRole: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Approval workflows" description="Multi-step approval chains and governance gates" /><div className="mt-6 space-y-3">
                {data.approvalWorkflows.length === 0 ? <EmptyState title="No approval workflows" description="Define approval workflows for company contexts." /> : data.approvalWorkflows.map((w) => (
                    <ListCard key={w.id} title={w.title} subtitle={`${w.workflowKey} • ${w.contextTitle}`} meta={`${w.requiredRole} • ${w.stepCount} steps • ${w.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create approval workflow" description="Define an approval workflow" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApprovalWorkflow(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("workflowKey")} placeholder="Workflow key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("requiredRole")} placeholder="Required role" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create workflow" />
            </form></Card>
        </div>
    );
}

export function NotificationsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<NotificationFormValues>({ resolver: zodResolver(notificationFormSchema), defaultValues: { contextId: "", notificationKey: "", title: "", channel: "in_app", priority: "normal", message: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Notifications" description="Cross-module notification center and alerts" /><div className="mt-6 space-y-3">
                {data.notifications.length === 0 ? <EmptyState title="No notifications" description="Notifications will appear as events occur across modules." /> : data.notifications.map((n) => (
                    <ListCard key={n.id} title={n.title} subtitle={`${n.notificationKey} • ${n.contextTitle}`} meta={`${NOTIFICATION_CHANNEL_OPTIONS.find((o) => o.value === n.channel)?.label ?? n.channel} • ${PRIORITY_OPTIONS.find((o) => o.value === n.priority)?.label ?? n.priority} • ${n.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create notification" description="Send a notification" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createNotification(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("notificationKey")} placeholder="Notification key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("channel")} className={inputClass}>{NOTIFICATION_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("priority")} className={inputClass}>{PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("message")} placeholder="Message" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create notification" />
            </form></Card>
        </div>
    );
}

export function TimelinePanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<TimelineFormValues>({ resolver: zodResolver(timelineFormSchema), defaultValues: { contextId: "", timelineKey: "", title: "", eventType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Company timeline" description="Chronological event timeline across all modules" /><div className="mt-6 space-y-3">
                {data.timelines.length === 0 ? <EmptyState title="No timeline entries" description="Timeline entries will appear as company events occur." /> : data.timelines.map((t) => (
                    <ListCard key={t.id} title={t.title} subtitle={`${t.timelineKey} • ${t.contextTitle}`} meta={`${t.eventType} • ${t.eventAt} • ${t.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create timeline entry" description="Record a timeline event" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTimeline(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("timelineKey")} placeholder="Timeline key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("eventType")} placeholder="Event type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create entry" />
            </form></Card>
        </div>
    );
}

export function ActivityFeedPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<ActivityFeedFormValues>({ resolver: zodResolver(activityFeedFormSchema), defaultValues: { contextId: "", feedKey: "", actorName: "", action: "", resourceType: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Activity feed" description="Real-time activity stream across all modules" /><div className="mt-6 space-y-3">
                {data.activityFeeds.length === 0 ? <EmptyState title="No activity feed entries" description="Activity will appear as users and AI workers perform actions." /> : data.activityFeeds.map((a) => (
                    <ListCard key={a.id} title={a.summary} subtitle={`${a.feedKey} • ${a.contextTitle}`} meta={`${a.actorName} • ${a.action} • ${a.resourceType} • ${new Date(a.createdAt).toLocaleString()}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create activity feed entry" description="Record an activity" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createActivityFeed(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("feedKey")} placeholder="Feed key" className={inputClass} />
                <input {...form.register("actorName")} placeholder="Actor name" className={inputClass} />
                <input {...form.register("action")} placeholder="Action" className={inputClass} />
                <input {...form.register("resourceType")} placeholder="Resource type" className={inputClass} />
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create entry" />
            </form></Card>
        </div>
    );
}

export function AutomationsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<AutomationFormValues>({ resolver: zodResolver(automationFormSchema), defaultValues: { contextId: "", automationKey: "", name: "", triggerModule: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cross-module automations" description="Automated triggers and actions across platform modules" /><div className="mt-6 space-y-3">
                {data.automations.length === 0 ? <EmptyState title="No automations" description="Define cross-module automations for company contexts." /> : data.automations.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.automationKey} • ${a.contextTitle}`} meta={`${PLATFORM_MODULE_OPTIONS.find((o) => o.value === a.triggerModule)?.label ?? a.triggerModule} • ${a.actionCount} actions • ${a.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation" description="Define a cross-module automation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomation(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("automationKey")} placeholder="Automation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("triggerModule")} className={inputClass}><option value="">Trigger module</option>{PLATFORM_MODULE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create automation" />
            </form></Card>
        </div>
    );
}

export function ExecutiveInsightsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<ExecutiveInsightFormValues>({ resolver: zodResolver(executiveInsightFormSchema), defaultValues: { contextId: "", insightKey: "", title: "", insightType: "summary", content: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive insights" description="AI-generated executive summaries and strategic insights" /><div className="mt-6 space-y-3">
                {data.executiveInsights.length === 0 ? <EmptyState title="No executive insights" description="Generate executive insights for company contexts." /> : data.executiveInsights.map((i) => (
                    <ListCard key={i.id} title={i.title} subtitle={`${i.insightKey} • ${i.contextTitle}`} meta={`${INSIGHT_TYPE_OPTIONS.find((o) => o.value === i.insightType)?.label ?? i.insightType} • ${i.metricCount} metrics • ${i.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive insight" description="Record an executive insight" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveInsight(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("insightKey")} placeholder="Insight key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("insightType")} className={inputClass}>{INSIGHT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("content")} placeholder="Content" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create insight" />
            </form></Card>
        </div>
    );
}

export function PredictiveRecommendationsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<PredictiveRecommendationFormValues>({ resolver: zodResolver(predictiveRecommendationFormSchema), defaultValues: { contextId: "", recommendationKey: "", title: "", recommendationType: "operational", confidenceScore: 0, recommendation: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Predictive recommendations" description="AI-powered operational and strategic recommendations" /><div className="mt-6 space-y-3">
                {data.predictiveRecommendations.length === 0 ? <EmptyState title="No predictive recommendations" description="Generate predictive recommendations for company contexts." /> : data.predictiveRecommendations.map((r) => (
                    <ListCard key={r.id} title={r.title} subtitle={`${r.recommendationKey} • ${r.contextTitle}`} meta={`${RECOMMENDATION_TYPE_OPTIONS.find((o) => o.value === r.recommendationType)?.label ?? r.recommendationType} • ${r.confidenceScore}% confidence • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create predictive recommendation" description="Record a predictive recommendation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPredictiveRecommendation(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("recommendationKey")} placeholder="Recommendation key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("recommendationType")} className={inputClass}>{RECOMMENDATION_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" min={0} max={100} {...form.register("confidenceScore", { valueAsNumber: true })} placeholder="Confidence score" className={inputClass} />
                <textarea {...form.register("recommendation")} placeholder="Recommendation" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create recommendation" />
            </form></Card>
        </div>
    );
}

export function SystemSearchPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<SystemSearchFormValues>({ resolver: zodResolver(systemSearchFormSchema), defaultValues: { contextId: "", searchKey: "", resourceType: "", title: "", keywords: "", moduleSource: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="System search" description="Cross-module search index and resource discovery" /><div className="mt-6 space-y-3">
                {data.systemSearches.length === 0 ? <EmptyState title="No search index entries" description="Search index entries will appear as resources are indexed." /> : data.systemSearches.map((s) => (
                    <ListCard key={s.id} title={s.title} subtitle={`${s.searchKey} • ${s.contextTitle}`} meta={`${s.resourceType} • ${PLATFORM_MODULE_OPTIONS.find((o) => o.value === s.moduleSource)?.label ?? s.moduleSource} • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create search index entry" description="Index a searchable resource" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSystemSearch(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("searchKey")} placeholder="Search key" className={inputClass} />
                <input {...form.register("resourceType")} placeholder="Resource type" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("keywords")} placeholder="Keywords" className={inputClass} />
                <select {...form.register("moduleSource")} className={inputClass}><option value="">Module source</option>{PLATFORM_MODULE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create entry" />
            </form></Card>
        </div>
    );
}

export function CommandPalettePanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<CommandPaletteFormValues>({ resolver: zodResolver(commandPaletteFormSchema), defaultValues: { contextId: "", commandKey: "", label: "", actionType: "", targetPath: "", shortcut: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Command palette" description="Global command registry and keyboard shortcuts" /><div className="mt-6 space-y-3">
                {data.commandPalette.length === 0 ? <EmptyState title="No commands" description="Register commands for the global command palette." /> : data.commandPalette.map((c) => (
                    <ListCard key={c.id} title={c.label} subtitle={`${c.commandKey} • ${c.contextTitle}`} meta={`${c.actionType} • ${c.targetPath}${c.shortcut ? ` • ${c.shortcut}` : ""} • ${c.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create command" description="Register a command palette entry" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommandPaletteEntry(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("commandKey")} placeholder="Command key" className={inputClass} />
                <input {...form.register("label")} placeholder="Label" className={inputClass} />
                <input {...form.register("actionType")} placeholder="Action type" className={inputClass} />
                <input {...form.register("targetPath")} placeholder="Target path" className={inputClass} />
                <input {...form.register("shortcut")} placeholder="Keyboard shortcut" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create command" />
            </form></Card>
        </div>
    );
}

export function EmergencyWorkflowsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<EmergencyWorkflowFormValues>({ resolver: zodResolver(emergencyWorkflowFormSchema), defaultValues: { contextId: "", workflowKey: "", name: "", severity: "high" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Emergency workflows" description="Incident response and emergency escalation procedures" /><div className="mt-6 space-y-3">
                {data.emergencyWorkflows.length === 0 ? <EmptyState title="No emergency workflows" description="Define emergency workflows for company contexts." /> : data.emergencyWorkflows.map((w) => (
                    <ListCard key={w.id} title={w.name} subtitle={`${w.workflowKey} • ${w.contextTitle}`} meta={`${SEVERITY_OPTIONS.find((o) => o.value === w.severity)?.label ?? w.severity} • ${w.stepCount} steps • ${w.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create emergency workflow" description="Define an emergency response workflow" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEmergencyWorkflow(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("workflowKey")} placeholder="Workflow key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("severity")} className={inputClass}>{SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create workflow" />
            </form></Card>
        </div>
    );
}

export function BusinessKpisPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<BusinessKpiFormValues>({ resolver: zodResolver(businessKpiFormSchema), defaultValues: { contextId: "", kpiKey: "", name: "", kpiCategory: "operational", currentValue: 0, targetValue: 0, unit: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business KPIs" description="Operational, financial, security, and compliance KPIs" /><div className="mt-6 space-y-3">
                {data.businessKpis.length === 0 ? <EmptyState title="No business KPIs" description="Define business KPIs for company contexts." /> : data.businessKpis.map((k) => (
                    <ListCard key={k.id} title={k.name} subtitle={`${k.kpiKey} • ${k.contextTitle}`} meta={`${KPI_CATEGORY_OPTIONS.find((o) => o.value === k.kpiCategory)?.label ?? k.kpiCategory} • ${k.currentValue}${k.unit ? ` ${k.unit}` : ""} / ${k.targetValue}${k.unit ? ` ${k.unit}` : ""} • ${k.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business KPI" description="Record a business KPI" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessKpi(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("kpiKey")} placeholder="KPI key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("kpiCategory")} className={inputClass}>{KPI_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" {...form.register("currentValue", { valueAsNumber: true })} placeholder="Current value" className={inputClass} />
                <input type="number" {...form.register("targetValue", { valueAsNumber: true })} placeholder="Target value" className={inputClass} />
                <input {...form.register("unit")} placeholder="Unit" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create KPI" />
            </form></Card>
        </div>
    );
}

export function SecurityGovernancePanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<SecurityGovernanceFormValues>({ resolver: zodResolver(securityGovernanceFormSchema), defaultValues: { contextId: "", governanceKey: "", name: "", controlArea: "access", complianceStatus: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Security governance" description="Access control, data protection, audit, and incident response" /><div className="mt-6 space-y-3">
                {data.securityGovernance.length === 0 ? <EmptyState title="No security governance entries" description="Define security governance controls for company contexts." /> : data.securityGovernance.map((g) => (
                    <ListCard key={g.id} title={g.name} subtitle={`${g.governanceKey} • ${g.contextTitle}`} meta={`${CONTROL_AREA_OPTIONS.find((o) => o.value === g.controlArea)?.label ?? g.controlArea} • ${g.controlCount} controls • ${g.complianceStatus} • ${g.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create security governance entry" description="Record a security governance control" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecurityGovernance(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("governanceKey")} placeholder="Governance key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("controlArea")} className={inputClass}>{CONTROL_AREA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("complianceStatus")} placeholder="Compliance status" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create entry" />
            </form></Card>
        </div>
    );
}

export function ComplianceDashboardsPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<ComplianceDashboardFormValues>({ resolver: zodResolver(complianceDashboardFormSchema), defaultValues: { contextId: "", dashboardKey: "", name: "", framework: "soc2", compliancePercent: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance dashboards" description="SOC 2, ISO 27001, GDPR, and HIPAA compliance tracking" /><div className="mt-6 space-y-3">
                {data.complianceDashboards.length === 0 ? <EmptyState title="No compliance dashboards" description="Define compliance dashboards for company contexts." /> : data.complianceDashboards.map((d) => (
                    <ListCard key={d.id} title={d.name} subtitle={`${d.dashboardKey} • ${d.contextTitle}`} meta={`${FRAMEWORK_OPTIONS.find((o) => o.value === d.framework)?.label ?? d.framework} • ${d.compliancePercent}% • ${d.requirementCount} requirements • ${d.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance dashboard" description="Record a compliance dashboard" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceDashboard(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("dashboardKey")} placeholder="Dashboard key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("framework")} className={inputClass}>{FRAMEWORK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" min={0} max={100} {...form.register("compliancePercent", { valueAsNumber: true })} placeholder="Compliance percent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create dashboard" />
            </form></Card>
        </div>
    );
}

export function OperationalHealthPanel({ data }: { data: AutonomousCompanyData }) {
    const form = useForm<OperationalHealthFormValues>({ resolver: zodResolver(operationalHealthFormSchema), defaultValues: { contextId: "", healthKey: "", name: "", overallScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operational health" description="System health scores and operational dimension tracking" /><div className="mt-6 space-y-3">
                {data.operationalHealth.length === 0 ? <EmptyState title="No operational health records" description="Track operational health for company contexts." /> : data.operationalHealth.map((h) => (
                    <ListCard key={h.id} title={h.name} subtitle={`${h.healthKey} • ${h.contextTitle}`} meta={`${h.overallScore}% overall • ${h.dimensionCount} dimensions • ${h.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operational health entry" description="Record operational health metrics" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationalHealth(v))}>
                <ContextSelect data={data} {...form.register("contextId")} />
                <input {...form.register("healthKey")} placeholder="Health key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("overallScore", { valueAsNumber: true })} placeholder="Overall score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create entry" />
            </form></Card>
        </div>
    );
}

export function AcAuditPanel({ data }: { data: AutonomousCompanyData }) {
    return (
        <Card hover><SectionHeader title="Autonomous Company audit history" description="Complete audit trail for all autonomous company operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function AutonomousCompanySdkPanel({ data }: { data: AutonomousCompanyData }) {
    return (
        <Card hover><SectionHeader title="Shared Autonomous Company SDK" description="Import from @/src/modules/autonomous-company/sdk for cross-module orchestration, AI worker collaboration, and continuous operations integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createAutonomousCompanyClient()" subtitle="Factory for module-scoped Autonomous Company client with auth context" meta="Primary SDK for continuous operations orchestration" />
            <ListCard title="client.startContext()" subtitle="Start a new company context linked to Founder OS workspace" meta={`${data.companyContexts.length} contexts active`} />
            <ListCard title="client.orchestrateWorkflow()" subtitle="Orchestrate cross-module workflow with participating modules" meta={`${data.workflowOrchestrations.length} orchestrations defined`} />
            <ListCard title="client.runCollaboration()" subtitle="Run AI worker collaboration with handoff rules" meta={`${data.workerCollaborations.length} collaborations active`} />
            <ListCard title="createFounderOsClient()" subtitle="Founder Operating System SDK for strategic execution handoff" meta="Upstream module: Founder OS → Autonomous Company" />
            <ListCard title="createBusinessAnalystClient()" subtitle="AI Business Analyst SDK for requirements and discovery" meta="Pipeline worker: Business Analyst" />
            <ListCard title="createSolutionArchitectClient()" subtitle="AI Solution Architect SDK for architecture design" meta="Pipeline worker: Solution Architect" />
            <ListCard title="createDevelopmentFactoryClient()" subtitle="AI Development Factory SDK for code generation" meta="Pipeline worker: Development Factory" />
            <ListCard title="createQaEngineerClient()" subtitle="AI QA Engineer SDK for quality assurance" meta="Pipeline worker: QA Engineering" />
            <ListCard title="createDevopsDeploymentClient()" subtitle="AI DevOps & Deployment SDK for CI/CD and releases" meta="Pipeline worker: DevOps & Deployment" />
            <ListCard title="createCustomerSuccessClient()" subtitle="AI Customer Success Manager SDK for customer engagement" meta="Pipeline worker: Customer Success" />
            <ListCard title="createAiOrchestrationClient()" subtitle="AI Orchestration SDK for task execution and agent coordination" meta="Core AI orchestration layer" />
            <ListCard title="createKnowledgeClient()" subtitle="Knowledge SDK for context resolution and memory storage" meta="Shared knowledge and context layer" />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createAutonomousCompanyClient } from "@/src/modules/autonomous-company/sdk";
import { createFounderOsClient } from "@/src/modules/founder-os/sdk";
import { createBusinessAnalystClient } from "@/src/modules/business-analyst/sdk";
import { createSolutionArchitectClient } from "@/src/modules/solution-architect/sdk";
import { createDevelopmentFactoryClient } from "@/src/modules/development-factory/sdk";
import { createQaEngineerClient } from "@/src/modules/qa-engineer/sdk";
import { createDevopsDeploymentClient } from "@/src/modules/devops-deployment/sdk";
import { createCustomerSuccessClient } from "@/src/modules/customer-success/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";

const ac = createAutonomousCompanyClient(userId, email, fullName);
const fo = createFounderOsClient(userId, email, fullName);
const ba = createBusinessAnalystClient(userId, email, fullName);
const sa = createSolutionArchitectClient(userId, email, fullName);
const df = createDevelopmentFactoryClient(userId, email, fullName);
const qa = createQaEngineerClient(userId, email, fullName);
const dd = createDevopsDeploymentClient(userId, email, fullName);
const cs = createCustomerSuccessClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);

const foWorkspaces = await fo.getWorkspaces();
const context = await ac.startContext({ title: "Q1 Autonomous Ops", contextKey: "q1-ops", foWorkspaceId: foWorkspaces[0]?.id, clientId, agentId, sessionId });
const resolved = await knowledge.resolveContext({ contextKey: "ac-q1-ops", agentId });
const orchestration = await ac.orchestrateWorkflow({ contextId: context.contextId, orchestrationKey: "ORCH-001", name: "Cross-Module Pipeline", participatingModules: ["founder-os", "business-analyst", "customer-success"] });
const collaboration = await ac.runCollaboration({ contextId: context.contextId, collaborationKey: "COLLAB-001", name: "All Workers Handoff", participatingWorkers: ["ba", "sa", "df", "qa", "dd", "cs", "fo"] });
const pipeline = await ac.getPipelineInfo();`}</pre>
        </div></Card>
    );
}
