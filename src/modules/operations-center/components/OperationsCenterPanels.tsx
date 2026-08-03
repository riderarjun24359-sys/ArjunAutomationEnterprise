"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EOC_THEME, HEALTH_TYPE_OPTIONS, JOB_STATUS_OPTIONS, EVENT_TYPE_OPTIONS, ALERT_SEVERITY_OPTIONS, LOG_LEVEL_OPTIONS } from "@/src/modules/operations-center/constants";
import type { useOperationsCenter } from "@/src/modules/operations-center/hooks/useOperationsCenter";
import {
    operationsCentersFormSchema,
    type operationsCentersFormValues,
    overallHealthFormSchema,
    type overallHealthFormValues,
    moduleHealthFormSchema,
    type moduleHealthFormValues,
    databaseHealthFormSchema,
    type databaseHealthFormValues,
    jobSchedulersFormSchema,
    type jobSchedulersFormValues,
    recurringJobsFormSchema,
    type recurringJobsFormValues,
    jobRetryQueueFormSchema,
    type jobRetryQueueFormValues,
    jobDeadLetterFormSchema,
    type jobDeadLetterFormValues,
    platformEventsFormSchema,
    type platformEventsFormValues,
    businessEventsFormSchema,
    type businessEventsFormValues,
    eventSubscriptionsFormSchema,
    type eventSubscriptionsFormValues,
    eventReplaysFormSchema,
    type eventReplaysFormValues,
    alertsFormSchema,
    type alertsFormValues,
    escalationRulesFormSchema,
    type escalationRulesFormValues,
    alertAcknowledgementsFormSchema,
    type alertAcknowledgementsFormValues,
    maintenanceWindowsFormSchema,
    type maintenanceWindowsFormValues,
    globalFlagsFormSchema,
    type globalFlagsFormValues,
    tenantFlagsFormSchema,
    type tenantFlagsFormValues,
    betaFeaturesFormSchema,
    type betaFeaturesFormValues,
    rolloutConfigsFormSchema,
    type rolloutConfigsFormValues,
    platformConfigsFormSchema,
    type platformConfigsFormValues,
    tenantConfigsFormSchema,
    type tenantConfigsFormValues,
    secretsMetadataFormSchema,
    type secretsMetadataFormValues,
    configVersionsFormSchema,
    type configVersionsFormValues,
    platformLogsFormSchema,
    type platformLogsFormValues,
    platformMetricsFormSchema,
    type platformMetricsFormValues,
    traceSummariesFormSchema,
    type traceSummariesFormValues,
    serviceRegistryFormSchema,
    type serviceRegistryFormValues,
    operationsMetricsFormSchema,
    type operationsMetricsFormValues,
    operationsHealthFormSchema,
    type operationsHealthFormValues,
    operationsFailuresFormSchema,
    type operationsFailuresFormValues,
} from "@/src/modules/operations-center/schemas";

type OperationsCenterData = ReturnType<typeof useOperationsCenter>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}</div>;
}
function OperationsCenterSelect({ data, ...props }: { data: OperationsCenterData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select operations center</option>{data.operationsCenterOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function OperationsCenterOverviewPanel({ data }: { data: OperationsCenterData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Operations Center summary" description="System health, background jobs, event bus, alerts, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Operations Centers" subtitle={`${data.stats?.totalOperationsCenters ?? 0} total`} meta={`${data.stats?.activeOperationsCenters ?? 0} active • ${data.stats?.overallHealthCount ?? 0} connected services`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.activeJobCount ?? 0} active jobs`} meta={`${data.stats?.pendingRetryCount ?? 0} pending retries • ${data.stats?.openAlertCount ?? 0} failed transactions`} />
                <ListCard title="Health" subtitle={`${(data.stats?.avgHealthScore ?? 0).toFixed(1)} avg health score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first operations center" />
            </div></Card>
            <Card hover><SectionHeader title="Operations pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Operations pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function OperationsCentersPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<operationsCentersFormValues>({ resolver: zodResolver(operationsCentersFormSchema), defaultValues: {"centerKey":"","centerName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Centers" description="Enterprise operations center operations centers" /><div className="mt-6 space-y-3">
                {data.operationsCenters.length === 0 ? <EmptyState title="No operations centers" description="Create the first operations centers record." /> : data.operationsCenters.map((item) => (
                    <ListCard key={item.id} title={String(item.centerName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.centerKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operations centers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationsCenter(v))}>
                <input {...form.register("centerKey")} placeholder="centerKey" className={inputClass} />
                <input {...form.register("centerName")} placeholder="centerName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OverallHealthsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<overallHealthFormValues>({ resolver: zodResolver(overallHealthFormSchema), defaultValues: {"operationsCenterId":"","healthKey":"","healthType":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Overall Health" description="Enterprise operations center overall health" /><div className="mt-6 space-y-3">
                {data.overallHealth.length === 0 ? <EmptyState title="No overall health" description="Create the first overall health record." /> : data.overallHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.healthType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create overall health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOverallHealth(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <select {...form.register("healthType")} className={inputClass}>{HEALTH_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ModuleHealthsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<moduleHealthFormValues>({ resolver: zodResolver(moduleHealthFormSchema), defaultValues: {"operationsCenterId":"","healthKey":"","moduleName":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module Health" description="Enterprise operations center module health" /><div className="mt-6 space-y-3">
                {data.moduleHealth.length === 0 ? <EmptyState title="No module health" description="Create the first module health record." /> : data.moduleHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.moduleName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.healthKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create module health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModuleHealth(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input {...form.register("moduleName")} placeholder="moduleName" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DatabaseHealthsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<databaseHealthFormValues>({ resolver: zodResolver(databaseHealthFormSchema), defaultValues: {"operationsCenterId":"","healthKey":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Database Health" description="Enterprise operations center database health" /><div className="mt-6 space-y-3">
                {data.databaseHealth.length === 0 ? <EmptyState title="No database health" description="Create the first database health record." /> : data.databaseHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.healthKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create database health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDatabaseHealth(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function JobSchedulersPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<jobSchedulersFormValues>({ resolver: zodResolver(jobSchedulersFormSchema), defaultValues: {"operationsCenterId":"","schedulerKey":"","schedulerName":"","workerPoolSize":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Job Schedulers" description="Enterprise operations center job schedulers" /><div className="mt-6 space-y-3">
                {data.jobSchedulers.length === 0 ? <EmptyState title="No job schedulers" description="Create the first job schedulers record." /> : data.jobSchedulers.map((item) => (
                    <ListCard key={item.id} title={String(item.schedulerName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.schedulerKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create job schedulers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createJobScheduler(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("schedulerKey")} placeholder="schedulerKey" className={inputClass} />
                <input {...form.register("schedulerName")} placeholder="schedulerName" className={inputClass} />
                <input type="number" step="any" {...form.register("workerPoolSize", { valueAsNumber: true })} placeholder="workerPoolSize" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RecurringJobsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<recurringJobsFormValues>({ resolver: zodResolver(recurringJobsFormSchema), defaultValues: {"operationsCenterId":"","jobKey":"","jobName":"","jobStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Recurring Jobs" description="Enterprise operations center recurring jobs" /><div className="mt-6 space-y-3">
                {data.recurringJobs.length === 0 ? <EmptyState title="No recurring jobs" description="Create the first recurring jobs record." /> : data.recurringJobs.map((item) => (
                    <ListCard key={item.id} title={String(item.jobName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.jobKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create recurring jobs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRecurringJob(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("jobKey")} placeholder="jobKey" className={inputClass} />
                <input {...form.register("jobName")} placeholder="jobName" className={inputClass} />
                <select {...form.register("jobStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function JobRetryQueuesPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<jobRetryQueueFormValues>({ resolver: zodResolver(jobRetryQueueFormSchema), defaultValues: {"operationsCenterId":"","queueKey":"","jobRef":"","priority":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Job Retry Queue" description="Enterprise operations center job retry queue" /><div className="mt-6 space-y-3">
                {data.jobRetryQueue.length === 0 ? <EmptyState title="No job retry queue" description="Create the first job retry queue record." /> : data.jobRetryQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.jobRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create job retry queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createJobRetryQueue(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("jobRef")} placeholder="jobRef" className={inputClass} />
                <input type="number" step="any" {...form.register("priority", { valueAsNumber: true })} placeholder="priority" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function JobDeadLettersPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<jobDeadLetterFormValues>({ resolver: zodResolver(jobDeadLetterFormSchema), defaultValues: {"operationsCenterId":"","deadLetterKey":"","jobRef":"","deadLetterStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Job Dead Letter" description="Enterprise operations center job dead letter" /><div className="mt-6 space-y-3">
                {data.jobDeadLetter.length === 0 ? <EmptyState title="No job dead letter" description="Create the first job dead letter record." /> : data.jobDeadLetter.map((item) => (
                    <ListCard key={item.id} title={String(item.deadLetterKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.jobRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create job dead letter" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createJobDeadLetter(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("deadLetterKey")} placeholder="deadLetterKey" className={inputClass} />
                <input {...form.register("jobRef")} placeholder="jobRef" className={inputClass} />
                <select {...form.register("deadLetterStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformEventsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<platformEventsFormValues>({ resolver: zodResolver(platformEventsFormSchema), defaultValues: {"operationsCenterId":"","eventKey":"","eventType":"","eventStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Events" description="Enterprise operations center platform events" /><div className="mt-6 space-y-3">
                {data.platformEvents.length === 0 ? <EmptyState title="No platform events" description="Create the first platform events record." /> : data.platformEvents.map((item) => (
                    <ListCard key={item.id} title={String(item.eventKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.eventType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform events" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformEvent(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("eventKey")} placeholder="eventKey" className={inputClass} />
                <select {...form.register("eventType")} className={inputClass}>{EVENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("eventStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessEventsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<businessEventsFormValues>({ resolver: zodResolver(businessEventsFormSchema), defaultValues: {"operationsCenterId":"","eventKey":"","eventType":"","eventStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Events" description="Enterprise operations center business events" /><div className="mt-6 space-y-3">
                {data.businessEvents.length === 0 ? <EmptyState title="No business events" description="Create the first business events record." /> : data.businessEvents.map((item) => (
                    <ListCard key={item.id} title={String(item.eventKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.eventType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business events" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessEvent(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("eventKey")} placeholder="eventKey" className={inputClass} />
                <select {...form.register("eventType")} className={inputClass}>{EVENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("eventStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EventSubscriptionsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<eventSubscriptionsFormValues>({ resolver: zodResolver(eventSubscriptionsFormSchema), defaultValues: {"operationsCenterId":"","subscriptionKey":"","eventType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Event Subscriptions" description="Enterprise operations center event subscriptions" /><div className="mt-6 space-y-3">
                {data.eventSubscriptions.length === 0 ? <EmptyState title="No event subscriptions" description="Create the first event subscriptions record." /> : data.eventSubscriptions.map((item) => (
                    <ListCard key={item.id} title={String(item.subscriptionKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.eventType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create event subscriptions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEventSubscription(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("subscriptionKey")} placeholder="subscriptionKey" className={inputClass} />
                <select {...form.register("eventType")} className={inputClass}>{EVENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EventReplaysPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<eventReplaysFormValues>({ resolver: zodResolver(eventReplaysFormSchema), defaultValues: {"operationsCenterId":"","replayKey":"","eventType":"","replayStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Event Replays" description="Enterprise operations center event replays" /><div className="mt-6 space-y-3">
                {data.eventReplays.length === 0 ? <EmptyState title="No event replays" description="Create the first event replays record." /> : data.eventReplays.map((item) => (
                    <ListCard key={item.id} title={String(item.replayKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.eventType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create event replays" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEventReplay(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("replayKey")} placeholder="replayKey" className={inputClass} />
                <select {...form.register("eventType")} className={inputClass}>{EVENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("replayStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AlertsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<alertsFormValues>({ resolver: zodResolver(alertsFormSchema), defaultValues: {"operationsCenterId":"","alertKey":"","alertSeverity":"","alertStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Alerts" description="Enterprise operations center alerts" /><div className="mt-6 space-y-3">
                {data.alerts.length === 0 ? <EmptyState title="No alerts" description="Create the first alerts record." /> : data.alerts.map((item) => (
                    <ListCard key={item.id} title={String(item.alertKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.alertSeverity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create alerts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAlert(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("alertKey")} placeholder="alertKey" className={inputClass} />
                <select {...form.register("alertSeverity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("alertStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EscalationRulesPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<escalationRulesFormValues>({ resolver: zodResolver(escalationRulesFormSchema), defaultValues: {"operationsCenterId":"","ruleKey":"","ruleName":"","alertSeverity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Escalation Rules" description="Enterprise operations center escalation rules" /><div className="mt-6 space-y-3">
                {data.escalationRules.length === 0 ? <EmptyState title="No escalation rules" description="Create the first escalation rules record." /> : data.escalationRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.ruleKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create escalation rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEscalationRule(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <select {...form.register("alertSeverity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AlertAcknowledgementsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<alertAcknowledgementsFormValues>({ resolver: zodResolver(alertAcknowledgementsFormSchema), defaultValues: {"operationsCenterId":"","ackKey":"","ackStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Alert Acknowledgements" description="Enterprise operations center alert acknowledgements" /><div className="mt-6 space-y-3">
                {data.alertAcknowledgements.length === 0 ? <EmptyState title="No alert acknowledgements" description="Create the first alert acknowledgements record." /> : data.alertAcknowledgements.map((item) => (
                    <ListCard key={item.id} title={String(item.ackKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.ackKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create alert acknowledgements" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAlertAcknowledgement(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("ackKey")} placeholder="ackKey" className={inputClass} />
                <select {...form.register("ackStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MaintenanceWindowsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<maintenanceWindowsFormValues>({ resolver: zodResolver(maintenanceWindowsFormSchema), defaultValues: {"operationsCenterId":"","windowKey":"","windowName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Maintenance Windows" description="Enterprise operations center maintenance windows" /><div className="mt-6 space-y-3">
                {data.maintenanceWindows.length === 0 ? <EmptyState title="No maintenance windows" description="Create the first maintenance windows record." /> : data.maintenanceWindows.map((item) => (
                    <ListCard key={item.id} title={String(item.windowName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.windowKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create maintenance windows" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMaintenanceWindow(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("windowKey")} placeholder="windowKey" className={inputClass} />
                <input {...form.register("windowName")} placeholder="windowName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GlobalFlagsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<globalFlagsFormValues>({ resolver: zodResolver(globalFlagsFormSchema), defaultValues: {"operationsCenterId":"","flagKey":"","flagName":"","enabled":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Global Flags" description="Enterprise operations center global flags" /><div className="mt-6 space-y-3">
                {data.globalFlags.length === 0 ? <EmptyState title="No global flags" description="Create the first global flags record." /> : data.globalFlags.map((item) => (
                    <ListCard key={item.id} title={String(item.flagName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.flagKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create global flags" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGlobalFlag(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("flagKey")} placeholder="flagKey" className={inputClass} />
                <input {...form.register("flagName")} placeholder="flagName" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("enabled")} /> enabled</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TenantFlagsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<tenantFlagsFormValues>({ resolver: zodResolver(tenantFlagsFormSchema), defaultValues: {"operationsCenterId":"","flagKey":"","flagName":"","enabled":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tenant Flags" description="Enterprise operations center tenant flags" /><div className="mt-6 space-y-3">
                {data.tenantFlags.length === 0 ? <EmptyState title="No tenant flags" description="Create the first tenant flags record." /> : data.tenantFlags.map((item) => (
                    <ListCard key={item.id} title={String(item.flagName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.flagKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tenant flags" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantFlag(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("flagKey")} placeholder="flagKey" className={inputClass} />
                <input {...form.register("flagName")} placeholder="flagName" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("enabled")} /> enabled</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BetaFeaturesPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<betaFeaturesFormValues>({ resolver: zodResolver(betaFeaturesFormSchema), defaultValues: {"operationsCenterId":"","featureKey":"","featureName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Beta Features" description="Enterprise operations center beta features" /><div className="mt-6 space-y-3">
                {data.betaFeatures.length === 0 ? <EmptyState title="No beta features" description="Create the first beta features record." /> : data.betaFeatures.map((item) => (
                    <ListCard key={item.id} title={String(item.featureName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.featureKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create beta features" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBetaFeature(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("featureKey")} placeholder="featureKey" className={inputClass} />
                <input {...form.register("featureName")} placeholder="featureName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RolloutConfigsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<rolloutConfigsFormValues>({ resolver: zodResolver(rolloutConfigsFormSchema), defaultValues: {"operationsCenterId":"","rolloutKey":"","flagKey":"","rolloutPercent":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rollout Configs" description="Enterprise operations center rollout configs" /><div className="mt-6 space-y-3">
                {data.rolloutConfigs.length === 0 ? <EmptyState title="No rollout configs" description="Create the first rollout configs record." /> : data.rolloutConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.rolloutKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.flagKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rollout configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRolloutConfig(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("rolloutKey")} placeholder="rolloutKey" className={inputClass} />
                <input {...form.register("flagKey")} placeholder="flagKey" className={inputClass} />
                <input type="number" step="any" {...form.register("rolloutPercent", { valueAsNumber: true })} placeholder="rolloutPercent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformConfigsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<platformConfigsFormValues>({ resolver: zodResolver(platformConfigsFormSchema), defaultValues: {"operationsCenterId":"","configKey":"","configName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Configs" description="Enterprise operations center platform configs" /><div className="mt-6 space-y-3">
                {data.platformConfigs.length === 0 ? <EmptyState title="No platform configs" description="Create the first platform configs record." /> : data.platformConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.configKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformConfig(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configName")} placeholder="configName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TenantConfigsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<tenantConfigsFormValues>({ resolver: zodResolver(tenantConfigsFormSchema), defaultValues: {"operationsCenterId":"","configKey":"","configName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tenant Configs" description="Enterprise operations center tenant configs" /><div className="mt-6 space-y-3">
                {data.tenantConfigs.length === 0 ? <EmptyState title="No tenant configs" description="Create the first tenant configs record." /> : data.tenantConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.configKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tenant configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantConfig(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configName")} placeholder="configName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SecretsMetadatasPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<secretsMetadataFormValues>({ resolver: zodResolver(secretsMetadataFormSchema), defaultValues: {"operationsCenterId":"","secretKey":"","secretName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Secrets Metadata" description="Enterprise operations center secrets metadata" /><div className="mt-6 space-y-3">
                {data.secretsMetadata.length === 0 ? <EmptyState title="No secrets metadata" description="Create the first secrets metadata record." /> : data.secretsMetadata.map((item) => (
                    <ListCard key={item.id} title={String(item.secretName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.secretKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create secrets metadata" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecretsMetadata(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("secretKey")} placeholder="secretKey" className={inputClass} />
                <input {...form.register("secretName")} placeholder="secretName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ConfigVersionsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<configVersionsFormValues>({ resolver: zodResolver(configVersionsFormSchema), defaultValues: {"operationsCenterId":"","versionKey":"","versionNumber":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Config Versions" description="Enterprise operations center config versions" /><div className="mt-6 space-y-3">
                {data.configVersions.length === 0 ? <EmptyState title="No config versions" description="Create the first config versions record." /> : data.configVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.versionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create config versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createConfigVersion(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformLogsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<platformLogsFormValues>({ resolver: zodResolver(platformLogsFormSchema), defaultValues: {"operationsCenterId":"","logKey":"","logLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Logs" description="Enterprise operations center platform logs" /><div className="mt-6 space-y-3">
                {data.platformLogs.length === 0 ? <EmptyState title="No platform logs" description="Create the first platform logs record." /> : data.platformLogs.map((item) => (
                    <ListCard key={item.id} title={String(item.logKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.logLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform logs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformLog(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("logKey")} placeholder="logKey" className={inputClass} />
                <select {...form.register("logLevel")} className={inputClass}>{LOG_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformMetricsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<platformMetricsFormValues>({ resolver: zodResolver(platformMetricsFormSchema), defaultValues: {"operationsCenterId":"","metricsKey":"","dependencyHealth":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Metrics" description="Enterprise operations center platform metrics" /><div className="mt-6 space-y-3">
                {data.platformMetrics.length === 0 ? <EmptyState title="No platform metrics" description="Create the first platform metrics record." /> : data.platformMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformMetric(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("dependencyHealth", { valueAsNumber: true })} placeholder="dependencyHealth" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TraceSummarysPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<traceSummariesFormValues>({ resolver: zodResolver(traceSummariesFormSchema), defaultValues: {"operationsCenterId":"","traceKey":"","spanCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Trace Summaries" description="Enterprise operations center trace summaries" /><div className="mt-6 space-y-3">
                {data.traceSummaries.length === 0 ? <EmptyState title="No trace summaries" description="Create the first trace summaries record." /> : data.traceSummaries.map((item) => (
                    <ListCard key={item.id} title={String(item.traceKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.traceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create trace summaries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTraceSummary(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("traceKey")} placeholder="traceKey" className={inputClass} />
                <input type="number" step="any" {...form.register("spanCount", { valueAsNumber: true })} placeholder="spanCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ServiceRegistrysPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<serviceRegistryFormValues>({ resolver: zodResolver(serviceRegistryFormSchema), defaultValues: {"operationsCenterId":"","serviceKey":"","serviceName":"","cacheStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Service Registry" description="Enterprise operations center service registry" /><div className="mt-6 space-y-3">
                {data.serviceRegistry.length === 0 ? <EmptyState title="No service registry" description="Create the first service registry record." /> : data.serviceRegistry.map((item) => (
                    <ListCard key={item.id} title={String(item.serviceName)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.serviceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create service registry" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createServiceRegistry(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("serviceKey")} placeholder="serviceKey" className={inputClass} />
                <input {...form.register("serviceName")} placeholder="serviceName" className={inputClass} />
                <select {...form.register("cacheStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationsMetricsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<operationsMetricsFormValues>({ resolver: zodResolver(operationsMetricsFormSchema), defaultValues: {"metricsKey":"","operationalScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Metrics" description="Enterprise operations center operations metrics" /><div className="mt-6 space-y-3">
                {data.operationsMetrics.length === 0 ? <EmptyState title="No operations metrics" description="Create the first operations metrics record." /> : data.operationsMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operations metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationsMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("operationalScore", { valueAsNumber: true })} placeholder="operationalScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationsHealthsPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<operationsHealthFormValues>({ resolver: zodResolver(operationsHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Health" description="Enterprise operations center operations health" /><div className="mt-6 space-y-3">
                {data.operationsHealth.length === 0 ? <EmptyState title="No operations health" description="Create the first operations health record." /> : data.operationsHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.healthKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operations health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationsHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationsFailuresPanel({ data }: { data: OperationsCenterData }) {
    const form = useForm<operationsFailuresFormValues>({ resolver: zodResolver(operationsFailuresFormSchema), defaultValues: {"operationsCenterId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Failures" description="Enterprise operations center operations failures" /><div className="mt-6 space-y-3">
                {data.operationsFailures.length === 0 ? <EmptyState title="No operations failures" description="Create the first operations failures record." /> : data.operationsFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.centerName ? item.centerName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operations failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationsFailure(v))}>
                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationsCenterAuditLogsPanel({ data }: { data: OperationsCenterData }) {
    return (
        <Card hover><SectionHeader title="Operations Center audit history" description="Security-first audit trail for jobs, events, alerts, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for operations center." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function OperationsCenterSdkPanel({ data }: { data: OperationsCenterData }) {
    return (
        <Card hover><SectionHeader title="Shared Operations Center SDK" description="Import from @/src/modules/operations-center/sdk for service connection, API key issuance, and webhook registration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createOperationsCenterClient()" subtitle="Factory for module-scoped Operations Center client with auth context" meta="Primary SDK for enterprise operations center" />
            <ListCard title="sdkPublishEvent()" subtitle="Publish platform event with AI orchestration" meta="moduleSource: operations_center" />
            <ListCard title="sdkScheduleJob()" subtitle="Schedule background job with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkTriggerAlert()" subtitle="Trigger operational alert with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {EOC_THEME.primary} • Operations centers loaded: {data.operationsCenters.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createOperationsCenterClient } from "@/src/modules/operations-center/sdk";

const intg = createOperationsCenterClient(userId, email, fullName);
await intg.publishEvent({ operationsCenterId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.scheduleJob({ operationsCenterId, keyName: "prod-key", apiVersion: "v1" });
await intg.triggerAlert({ operationsCenterId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
