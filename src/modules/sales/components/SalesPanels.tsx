"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ACTIVITY_TYPE_OPTIONS, LEAD_SOURCE_OPTIONS } from "@/src/modules/sales/constants";
import type { useSales } from "@/src/modules/sales/hooks/useSales";
import {
    activityFormSchema, callLogFormSchema, emailTrackingFormSchema, forecastFormSchema, leadFormSchema, meetingFormSchema, opportunityFormSchema, pipelineFormSchema, quoteFormSchema, stageFormSchema, targetFormSchema,
    type ActivityFormValues, type CallLogFormValues, type EmailTrackingFormValues, type ForecastFormValues, type LeadFormValues, type MeetingFormValues, type OpportunityFormValues, type PipelineFormValues, type QuoteFormValues, type StageFormValues, type TargetFormValues,
} from "@/src/modules/sales/schemas";

type SalesData = ReturnType<typeof useSales>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}</div>;
}

export function SalesOverviewPanel({ data }: { data: SalesData }) {
    const links = data.crossModuleLinks;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Revenue summary" description="Pipeline and closed revenue metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Pipeline" subtitle={`$${(data.stats?.pipelineValue ?? 0).toLocaleString()} total`} />
                <ListCard title="Weighted" subtitle={`$${(data.stats?.weightedPipeline ?? 0).toLocaleString()} forecast`} />
                <ListCard title="Closed Won" subtitle={`$${(data.stats?.closedWonValue ?? 0).toLocaleString()}`} />
                <ListCard title="Win Rate" subtitle={`${data.stats?.winRate ?? 0}%`} />
            </div></Card>
            <Card hover><SectionHeader title="Cross-module integration" description="Links to CRM, Finance, Projects, Support, HR, Automation, Analytics, Settings" /><div className="mt-6 space-y-3">
                {links ? (<>
                    <ListCard title="CRM" subtitle={`${links.crmClients} linked clients`} meta="Customer relationships" />
                    <ListCard title="Finance" subtitle={`${links.financeEstimates} revenue-linked deals`} meta="Estimates and invoicing" />
                    <ListCard title="Projects" subtitle={`${links.projectOpportunities} project-linked opportunities`} meta="Delivery pipeline" />
                    <ListCard title="HR" subtitle={`${links.hrSalesReps} sales reps with targets`} meta="Sales workforce" />
                    <ListCard title="Analytics" subtitle={`${links.analyticsMetrics} sales metrics`} meta="Performance dashboards" />
                </>) : <EmptyState title="No cross-module data" description="Integration metrics will appear once sales data is available." />}
            </div></Card>
        </div>
    );
}

export function LeadsPanel({ data }: { data: SalesData }) {
    const form = useForm<LeadFormValues>({ resolver: zodResolver(leadFormSchema), defaultValues: { leadName: "", companyName: "", email: "", phone: "", source: "inbound", assignedTo: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lead management" description="Prospects and inbound leads" /><div className="mt-6 space-y-3">
                {data.leads.length === 0 ? <EmptyState title="No leads" description="Add leads to build your pipeline." /> : data.leads.map((lead) => (
                    <ListCard key={lead.id} title={lead.leadName} subtitle={`${lead.companyName} • ${lead.email}`} meta={`Score: ${lead.score} • ${lead.source} • ${lead.status} • ${lead.assigneeName ?? "Unassigned"}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add lead" description="Create a new sales lead" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLead(v))}>
                <input {...form.register("leadName")} placeholder="Lead name" className={inputClass} />
                <input {...form.register("companyName")} placeholder="Company" className={inputClass} />
                <input {...form.register("email")} placeholder="Email" className={inputClass} />
                <input {...form.register("phone")} placeholder="Phone" className={inputClass} />
                <select {...form.register("source")} className={inputClass}>{LEAD_SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("assignedTo")} className={inputClass}><option value="">Assign to (optional)</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Add lead" />
            </form></Card>
        </div>
    );
}

export function OpportunitiesPanel({ data }: { data: SalesData }) {
    const form = useForm<OpportunityFormValues>({ resolver: zodResolver(opportunityFormSchema), defaultValues: { opportunityNumber: "", name: "", description: "", pipelineId: "", stageId: "", clientId: "", assignedTo: "", amount: 0, expectedCloseDate: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Opportunities" description="Active deals in the sales pipeline" /><div className="mt-6 space-y-3">
                {data.opportunities.length === 0 ? <EmptyState title="No opportunities" description="Create opportunities to track deals." /> : data.opportunities.map((opp) => (
                    <div key={opp.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <div><p className="font-medium">{opp.opportunityNumber} — {opp.name}</p><p className="text-sm text-slate-500">{opp.clientName ?? "No client"} • {opp.stageName ?? "No stage"} • ${opp.amount.toLocaleString()}</p><p className="mt-1 text-xs text-emerald-600">{opp.assigneeName ?? "Unassigned"} • Weighted: ${opp.weightedAmount.toLocaleString()}</p></div>
                        <button type="button" onClick={() => data.updateOpportunityStatus(opp.id, { status: opp.status === "open" ? "won" : "open" })} className="rounded-full border border-emerald-300 px-4 py-2 text-sm text-emerald-700">{opp.status}</button>
                    </div>
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create opportunity" description="Add a new deal" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOpportunity(v))}>
                <input {...form.register("opportunityNumber")} placeholder="Opportunity number" className={inputClass} />
                <input {...form.register("name")} placeholder="Deal name" className={inputClass} />
                <textarea {...form.register("description")} placeholder="Description" rows={2} className={inputClass} />
                <select {...form.register("pipelineId")} className={inputClass}><option value="">Pipeline</option>{data.pipelines.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("stageId")} className={inputClass}><option value="">Stage</option>{data.stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input type="number" {...form.register("amount", { valueAsNumber: true })} placeholder="Amount" className={inputClass} />
                <input type="date" {...form.register("expectedCloseDate")} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create opportunity" />
            </form></Card>
        </div>
    );
}

export function PipelinePanel({ data }: { data: SalesData }) {
    const form = useForm<PipelineFormValues>({ resolver: zodResolver(pipelineFormSchema), defaultValues: { name: "", code: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Sales pipelines" description="Pipeline definitions and deal flow" /><div className="mt-6 space-y-3">
                {data.pipelines.length === 0 ? <EmptyState title="No pipelines" description="Create pipelines to organize deals." /> : data.pipelines.map((p) => (
                    <ListCard key={p.id} title={`${p.code} — ${p.name}`} subtitle={p.description} meta={`${p.stageCount} stages • ${p.opportunityCount} opportunities${p.isDefault ? " • Default" : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add pipeline" description="Create a new sales pipeline" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPipeline(v))}>
                <input {...form.register("name")} placeholder="Pipeline name" className={inputClass} />
                <input {...form.register("code")} placeholder="Code" className={inputClass} />
                <input {...form.register("description")} placeholder="Description" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add pipeline" />
            </form></Card>
        </div>
    );
}

export function StagesPanel({ data }: { data: SalesData }) {
    const form = useForm<StageFormValues>({ resolver: zodResolver(stageFormSchema), defaultValues: { pipelineId: "", name: "", sortOrder: 0, probability: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Pipeline stages" description="Deal progression stages" /><div className="mt-6 space-y-3">
                {data.stages.length === 0 ? <EmptyState title="No stages" description="Define stages for your pipelines." /> : data.stages.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.pipelineName} • Order: ${s.sortOrder}`} meta={`${s.probability}% probability • ${s.opportunityCount} deals${s.isClosedWon ? " • Won" : ""}${s.isClosedLost ? " • Lost" : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add stage" description="Create a pipeline stage" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStage(v))}>
                <select {...form.register("pipelineId")} className={inputClass}><option value="">Select pipeline</option>{data.pipelines.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Stage name" className={inputClass} />
                <input type="number" {...form.register("sortOrder", { valueAsNumber: true })} placeholder="Sort order" className={inputClass} />
                <input type="number" {...form.register("probability", { valueAsNumber: true })} placeholder="Probability (0-100)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add stage" />
            </form></Card>
        </div>
    );
}

export function QuotesPanel({ data }: { data: SalesData }) {
    const form = useForm<QuoteFormValues>({ resolver: zodResolver(quoteFormSchema), defaultValues: { quoteNumber: "", opportunityId: "", clientId: "", title: "", totalAmount: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Quotes & proposals" description="Formal pricing proposals" /><div className="mt-6 space-y-3">
                {data.quotes.length === 0 ? <EmptyState title="No quotes" description="Create quotes for opportunities." /> : data.quotes.map((q) => (
                    <ListCard key={q.id} title={`${q.quoteNumber} — ${q.title}`} subtitle={`${q.clientName ?? "No client"} • ${q.opportunityNumber ?? "No opp"}`} meta={`$${q.totalAmount.toLocaleString()} • ${q.itemCount} items • ${q.status}${q.validUntil ? ` • Valid until ${new Date(q.validUntil).toLocaleDateString()}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create quote" description="Generate a new proposal" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createQuote(v))}>
                <input {...form.register("quoteNumber")} placeholder="Quote number" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("opportunityId")} className={inputClass}><option value="">Opportunity (optional)</option>{data.opportunities.map((o) => <option key={o.id} value={o.id}>{o.opportunityNumber}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client (optional)</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input type="number" {...form.register("totalAmount", { valueAsNumber: true })} placeholder="Total amount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create quote" />
            </form></Card>
        </div>
    );
}

export function ForecastingPanel({ data }: { data: SalesData }) {
    const form = useForm<ForecastFormValues>({ resolver: zodResolver(forecastFormSchema), defaultValues: { forecastPeriod: "", pipelineValue: 0, weightedValue: 0, closedValue: 0, notes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Revenue forecasting" description="Pipeline and revenue projections" /><div className="mt-6 space-y-3">
                {data.forecasts.length === 0 ? <EmptyState title="No forecasts" description="Create revenue forecasts." /> : data.forecasts.map((f) => (
                    <ListCard key={f.id} title={f.forecastPeriod} subtitle={`Pipeline: $${f.pipelineValue.toLocaleString()} • Weighted: $${f.weightedValue.toLocaleString()}`} meta={`Closed: $${f.closedValue.toLocaleString()} • ${new Date(f.forecastDate).toLocaleDateString()}${f.notes ? ` • ${f.notes}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add forecast" description="Record a revenue forecast" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createForecast(v))}>
                <input {...form.register("forecastPeriod")} placeholder="Period (e.g. Q3 2026)" className={inputClass} />
                <input type="number" {...form.register("pipelineValue", { valueAsNumber: true })} placeholder="Pipeline value" className={inputClass} />
                <input type="number" {...form.register("weightedValue", { valueAsNumber: true })} placeholder="Weighted value" className={inputClass} />
                <input type="number" {...form.register("closedValue", { valueAsNumber: true })} placeholder="Closed value" className={inputClass} />
                <input {...form.register("notes")} placeholder="Notes" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add forecast" />
            </form></Card>
        </div>
    );
}

export function ActivitiesPanel({ data }: { data: SalesData }) {
    const form = useForm<ActivityFormValues>({ resolver: zodResolver(activityFormSchema), defaultValues: { opportunityId: "", leadId: "", activityType: "task", subject: "", description: "", dueAt: "", assignedTo: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sales activities" description="Tasks, follow-ups, and actions" /><div className="mt-6 space-y-3">
                {data.activities.length === 0 ? <EmptyState title="No activities" description="Log sales activities." /> : data.activities.map((a) => (
                    <ListCard key={a.id} title={a.subject} subtitle={`${a.activityType} • ${a.linkedName}`} meta={`${a.assigneeName ?? "Unassigned"}${a.dueAt ? ` • Due ${new Date(a.dueAt).toLocaleDateString()}` : ""}${a.completedAt ? " • Completed" : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Log activity" description="Create a sales activity" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createActivity(v))}>
                <select {...form.register("activityType")} className={inputClass}>{ACTIVITY_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("subject")} placeholder="Subject" className={inputClass} />
                <textarea {...form.register("description")} placeholder="Description" rows={2} className={inputClass} />
                <select {...form.register("opportunityId")} className={inputClass}><option value="">Link to opportunity</option>{data.opportunities.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
                <select {...form.register("leadId")} className={inputClass}><option value="">Link to lead</option>{data.leads.map((l) => <option key={l.id} value={l.id}>{l.leadName}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Log activity" />
            </form></Card>
        </div>
    );
}

export function MeetingsPanel({ data }: { data: SalesData }) {
    const form = useForm<MeetingFormValues>({ resolver: zodResolver(meetingFormSchema), defaultValues: { opportunityId: "", leadId: "", title: "", scheduledAt: "", durationMinutes: 30, attendeeNames: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Meetings" description="Scheduled sales meetings" /><div className="mt-6 space-y-3">
                {data.meetings.length === 0 ? <EmptyState title="No meetings" description="Schedule sales meetings." /> : data.meetings.map((m) => (
                    <ListCard key={m.id} title={m.title} subtitle={`${m.linkedName} • ${m.location || "No location"}`} meta={`${new Date(m.scheduledAt).toLocaleString()} • ${m.durationMinutes}min • ${m.status} • ${m.attendeeNames}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Schedule meeting" description="Create a new meeting" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMeeting(v))}>
                <input {...form.register("title")} placeholder="Meeting title" className={inputClass} />
                <input type="datetime-local" {...form.register("scheduledAt")} className={inputClass} />
                <input type="number" {...form.register("durationMinutes", { valueAsNumber: true })} placeholder="Duration (minutes)" className={inputClass} />
                <input {...form.register("attendeeNames")} placeholder="Attendees" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Schedule meeting" />
            </form></Card>
        </div>
    );
}

export function CallsPanel({ data }: { data: SalesData }) {
    const form = useForm<CallLogFormValues>({ resolver: zodResolver(callLogFormSchema), defaultValues: { opportunityId: "", leadId: "", direction: "outbound", phoneNumber: "", durationSeconds: 0, outcome: "", notes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Call logs" description="Phone call history" /><div className="mt-6 space-y-3">
                {data.callLogs.length === 0 ? <EmptyState title="No call logs" description="Log sales calls." /> : data.callLogs.map((c) => (
                    <ListCard key={c.id} title={`${c.direction} — ${c.phoneNumber}`} subtitle={`${c.linkedName} • ${c.outcome}`} meta={`${Math.floor(c.durationSeconds / 60)}m ${c.durationSeconds % 60}s • ${new Date(c.calledAt).toLocaleString()}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Log call" description="Record a phone call" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCallLog(v))}>
                <select {...form.register("direction")} className={inputClass}><option value="outbound">Outbound</option><option value="inbound">Inbound</option></select>
                <input {...form.register("phoneNumber")} placeholder="Phone number" className={inputClass} />
                <input type="number" {...form.register("durationSeconds", { valueAsNumber: true })} placeholder="Duration (seconds)" className={inputClass} />
                <input {...form.register("outcome")} placeholder="Outcome" className={inputClass} />
                <input {...form.register("notes")} placeholder="Notes" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Log call" />
            </form></Card>
        </div>
    );
}

export function EmailsPanel({ data }: { data: SalesData }) {
    const form = useForm<EmailTrackingFormValues>({ resolver: zodResolver(emailTrackingFormSchema), defaultValues: { opportunityId: "", leadId: "", subject: "", recipientEmail: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Email tracking" description="Outbound email engagement" /><div className="mt-6 space-y-3">
                {data.emailTracking.length === 0 ? <EmptyState title="No emails tracked" description="Track sales emails." /> : data.emailTracking.map((e) => (
                    <ListCard key={e.id} title={e.subject} subtitle={`To: ${e.recipientEmail} • ${e.linkedName}`} meta={`${e.status} • Sent ${new Date(e.sentAt).toLocaleString()}${e.openedAt ? ` • Opened ${new Date(e.openedAt).toLocaleString()}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Track email" description="Log an outbound email" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEmailTracking(v))}>
                <input {...form.register("subject")} placeholder="Subject" className={inputClass} />
                <input {...form.register("recipientEmail")} placeholder="Recipient email" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Track email" />
            </form></Card>
        </div>
    );
}

export function TargetsPanel({ data }: { data: SalesData }) {
    const form = useForm<TargetFormValues>({ resolver: zodResolver(targetFormSchema), defaultValues: { employeeId: "", periodLabel: "", targetAmount: 0, periodStart: "", periodEnd: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Sales targets" description="Rep quotas and achievement" /><div className="mt-6 space-y-3">
                {data.targets.length === 0 ? <EmptyState title="No targets" description="Set sales targets for reps." /> : data.targets.map((t) => (
                    <ListCard key={t.id} title={t.employeeName} subtitle={`${t.periodLabel}: $${t.achievedAmount.toLocaleString()} / $${t.targetAmount.toLocaleString()}`} meta={`${t.achievementPercent}% achieved • ${t.periodStart} to ${t.periodEnd}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Set target" description="Create a sales target" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTarget(v))}>
                <select {...form.register("employeeId")} className={inputClass}><option value="">Select rep</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("periodLabel")} placeholder="Period label" className={inputClass} />
                <input type="number" {...form.register("targetAmount", { valueAsNumber: true })} placeholder="Target amount" className={inputClass} />
                <input type="date" {...form.register("periodStart")} className={inputClass} />
                <input type="date" {...form.register("periodEnd")} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Set target" />
            </form></Card>
        </div>
    );
}

export function CommissionsPanel({ data }: { data: SalesData }) {
    return (
        <Card hover><SectionHeader title="Commissions" description="Sales commission foundation" /><div className="mt-6 space-y-3">
            {data.commissions.length === 0 ? <EmptyState title="No commissions" description="Commissions will appear when deals close." /> : data.commissions.map((c) => (
                <ListCard key={c.id} title={c.employeeName} subtitle={`${c.opportunityNumber ?? "No opp"} • ${c.commissionRate}% rate`} meta={`$${c.commissionAmount.toLocaleString()} • ${c.status} • ${new Date(c.calculatedAt).toLocaleDateString()}`} />
            ))}
        </div></Card>
    );
}

export function WinLossPanel({ data }: { data: SalesData }) {
    return (
        <Card hover><SectionHeader title="Win/Loss analysis" description="Deal outcome analysis" /><div className="mt-6 space-y-3">
            {data.winLossRecords.length === 0 ? <EmptyState title="No win/loss records" description="Records appear when deals close." /> : data.winLossRecords.map((r) => (
                <ListCard key={r.id} title={`${r.outcome.toUpperCase()} — ${r.opportunityNumber}`} subtitle={r.opportunityName} meta={`$${r.amount.toLocaleString()} • ${r.reason}${r.competitor ? ` • vs ${r.competitor}` : ""} • ${new Date(r.recordedAt).toLocaleDateString()}`} />
            ))}
        </div></Card>
    );
}

export function SalesReportsPanel({ data }: { data: SalesData }) {
    const report = data.report;
    if (!report) return <EmptyState title="No reports" description="Sales reports will appear once data is available." />;
    const sections = [
        { title: "Opportunities by stage", rows: report.opportunitiesByStage.map((r) => `${r.stage}: ${r.count} ($${r.value.toLocaleString()})`) },
        { title: "Leads by source", rows: report.leadsBySource.map((r) => `${r.source}: ${r.count}`) },
        { title: "Leads by status", rows: report.leadsByStatus.map((r) => `${r.status}: ${r.count}`) },
        { title: "Win/Loss breakdown", rows: report.winLossBreakdown.map((r) => `${r.outcome}: ${r.count} ($${r.amount.toLocaleString()})`) },
        { title: "Forecast trend", rows: report.forecastTrend.map((r) => `${r.period}: $${r.pipeline.toLocaleString()} pipeline, $${r.closed.toLocaleString()} closed`) },
    ];
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
                <Card key={section.title} hover><SectionHeader title={section.title} description="Sales analytics snapshot" /><div className="mt-6 space-y-2">
                    {section.rows.length === 0 ? <p className="text-sm text-slate-500">No data</p> : section.rows.map((row) => <p key={row} className="text-sm">{row}</p>)}
                </div></Card>
            ))}
        </div>
    );
}

export function SalesAuditPanel({ data }: { data: SalesData }) {
    return (
        <Card hover><SectionHeader title="Audit history" description="Sales change log and compliance trail" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as sales changes are recorded." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={new Date(entry.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}
