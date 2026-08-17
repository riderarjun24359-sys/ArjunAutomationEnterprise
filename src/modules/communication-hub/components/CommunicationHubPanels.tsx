"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CNH_THEME, CHANNEL_TYPE_OPTIONS, PRIORITY_LEVEL_OPTIONS, DELIVERY_STATUS_OPTIONS } from "@/src/modules/communication-hub/constants";
import type { useCommunicationHub } from "@/src/modules/communication-hub/hooks/useCommunicationHub";
import {
    communicationHubFormSchema,
    notificationChannelFormSchema,
    notificationQueueFormSchema,
    retryPolicyFormSchema,
    messageTemplateFormSchema,
    templateVariableFormSchema,
    templateLocalizationFormSchema,
    templateApprovalFormSchema,
    automationRuleFormSchema,
    automationTriggerFormSchema,
    automationScheduleFormSchema,
    automationExecutionFormSchema,
    preferenceProfileFormSchema,
    channelPreferenceFormSchema,
    optInRecordFormSchema,
    optOutRecordFormSchema,
    announcementFormSchema,
    announcementScheduleFormSchema,
    pinnedAnnouncementFormSchema,
    announcementAcknowledgementFormSchema,
    campaignFormSchema,
    audienceSegmentFormSchema,
    campaignDeliveryFormSchema,
    campaignMetricFormSchema,
    deliveryAnalyticsFormSchema,
    engagementMetricFormSchema,
    bounceRecordFormSchema,
    channelPerformanceFormSchema,
    communicationMetricFormSchema,
    systemHealthFormSchema,
    deliveryFailureFormSchema,
    type communicationHubFormValues,
    type notificationChannelFormValues,
    type notificationQueueFormValues,
    type retryPolicyFormValues,
    type messageTemplateFormValues,
    type templateVariableFormValues,
    type templateLocalizationFormValues,
    type templateApprovalFormValues,
    type automationRuleFormValues,
    type automationTriggerFormValues,
    type automationScheduleFormValues,
    type automationExecutionFormValues,
    type preferenceProfileFormValues,
    type channelPreferenceFormValues,
    type optInRecordFormValues,
    type optOutRecordFormValues,
    type announcementFormValues,
    type announcementScheduleFormValues,
    type pinnedAnnouncementFormValues,
    type announcementAcknowledgementFormValues,
    type campaignFormValues,
    type audienceSegmentFormValues,
    type campaignDeliveryFormValues,
    type campaignMetricFormValues,
    type deliveryAnalyticsFormValues,
    type engagementMetricFormValues,
    type bounceRecordFormValues,
    type channelPerformanceFormValues,
    type communicationMetricFormValues,
    type systemHealthFormValues,
    type deliveryFailureFormValues,
} from "@/src/modules/communication-hub/schemas";

type CommunicationHubData = ReturnType<typeof useCommunicationHub>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-rose-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-rose-600">{meta}</p> : null}</div>;
}
function CommunicationHubSelect({ data, ...props }: { data: CommunicationHubData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select communication hub</option>{data.communicationHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function CommunicationHubOverviewPanel({ data }: { data: CommunicationHubData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Communication Hub summary" description="Notification engine, templates, automation, preferences, announcements, campaigns, delivery analytics, and ops dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Communication Hubs" subtitle={`${data.stats?.totalCommunicationHubs ?? 0} total`} meta={`${data.stats?.activeCommunicationHubs ?? 0} active • ${data.stats?.pendingNotificationCount ?? 0} queued`} />
                <ListCard title="Delivery" subtitle={`${data.stats?.deliveredNotificationCount ?? 0} delivered`} meta={`${data.stats?.failedNotificationCount ?? 0} failed • ${(data.stats?.avgDeliveryRate ?? 0).toFixed(1)}% delivery rate`} />
                <ListCard title="Campaigns" subtitle={`${data.stats?.activeCampaignCount ?? 0} active campaigns`} meta={`${data.stats?.openFailureCount ?? 0} open delivery failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first communication operations" />
            </div></Card>
            <Card hover><SectionHeader title="Communication pipeline" description={`${pipeline?.previousStage ?? "in_app"} → ${pipeline?.currentStage ?? "email"} → ${pipeline?.nextStage ?? "push"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Communication pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function CommunicationHubsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<communicationHubFormValues>({ resolver: zodResolver(communicationHubFormSchema), defaultValues: { hubKey: "", hubName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Communication Hubs" description="Enterprise communication hub communication hubs" /><div className="mt-6 space-y-3">
                {data.communicationHubs.length === 0 ? <EmptyState title="No communication hubs" description="Create the first communication hubs record." /> : data.communicationHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create communication hub" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommunicationHub(v))}>
                <input {...form.register("hubKey")} placeholder="Hub key" className={inputClass} />
                <input {...form.register("hubName")} placeholder="Hub name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function NotificationChannelsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<notificationChannelFormValues>({ resolver: zodResolver(notificationChannelFormSchema), defaultValues: { communicationHubId: "", channelKey: "", channelName: "", channelType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Notification Channels" description="Enterprise communication hub notification channels" /><div className="mt-6 space-y-3">
                {data.notificationChannels.length === 0 ? <EmptyState title="No notification channels" description="Create the first notification channels record." /> : data.notificationChannels.map((item) => (
                    <ListCard key={item.id} title={String(item.channelName)} subtitle={`${item.hubName} • ${item.channelKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create notification channel" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createNotificationChannel(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("channelKey")} placeholder="Channel key" className={inputClass} />
                <input {...form.register("channelName")} placeholder="Channel name" className={inputClass} />
                <select {...form.register("channelType")} className={inputClass}>{CHANNEL_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function NotificationQueuePanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<notificationQueueFormValues>({ resolver: zodResolver(notificationQueueFormSchema), defaultValues: { communicationHubId: "", queueKey: "", recipient: "", deliveryStatus: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Notification Queue" description="Enterprise communication hub notification queue" /><div className="mt-6 space-y-3">
                {data.notificationQueue.length === 0 ? <EmptyState title="No notification queue" description="Create the first notification queue record." /> : data.notificationQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueKey)} subtitle={`${item.hubName} • ${item.queueKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create notification queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createNotificationQueue(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("queueKey")} placeholder="Queue key" className={inputClass} />
                <input {...form.register("recipient")} placeholder="Recipient" className={inputClass} />
                <select {...form.register("deliveryStatus")} className={inputClass}>{DELIVERY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetryPoliciesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<retryPolicyFormValues>({ resolver: zodResolver(retryPolicyFormSchema), defaultValues: { communicationHubId: "", policyKey: "", policyName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retry Policies" description="Enterprise communication hub retry policies" /><div className="mt-6 space-y-3">
                {data.retryPolicies.length === 0 ? <EmptyState title="No retry policies" description="Create the first retry policies record." /> : data.retryPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName} • ${item.policyKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retry policie" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetryPolicy(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("policyKey")} placeholder="Policy key" className={inputClass} />
                <input {...form.register("policyName")} placeholder="Policy name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MessageTemplatesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<messageTemplateFormValues>({ resolver: zodResolver(messageTemplateFormSchema), defaultValues: { communicationHubId: "", templateKey: "", templateName: "", channelType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Message Templates" description="Enterprise communication hub message templates" /><div className="mt-6 space-y-3">
                {data.messageTemplates.length === 0 ? <EmptyState title="No message templates" description="Create the first message templates record." /> : data.messageTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName} • ${item.templateKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create message template" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMessageTemplate(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("templateKey")} placeholder="Template key" className={inputClass} />
                <input {...form.register("templateName")} placeholder="Template name" className={inputClass} />
                <select {...form.register("channelType")} className={inputClass}>{CHANNEL_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemplateVariablesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<templateVariableFormValues>({ resolver: zodResolver(templateVariableFormSchema), defaultValues: { communicationHubId: "", variableKey: "", variableName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Template Variables" description="Enterprise communication hub template variables" /><div className="mt-6 space-y-3">
                {data.templateVariables.length === 0 ? <EmptyState title="No template variables" description="Create the first template variables record." /> : data.templateVariables.map((item) => (
                    <ListCard key={item.id} title={String(item.variableName)} subtitle={`${item.hubName} • ${item.variableKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template variable" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplateVariable(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("variableKey")} placeholder="Variable key" className={inputClass} />
                <input {...form.register("variableName")} placeholder="Variable name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemplateLocalizationsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<templateLocalizationFormValues>({ resolver: zodResolver(templateLocalizationFormSchema), defaultValues: { communicationHubId: "", locale: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Template Localizations" description="Enterprise communication hub template localizations" /><div className="mt-6 space-y-3">
                {data.templateLocalizations.length === 0 ? <EmptyState title="No template localizations" description="Create the first template localizations record." /> : data.templateLocalizations.map((item) => (
                    <ListCard key={item.id} title={String(item.locale)} subtitle={`${item.hubName} • ${item.locale}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template localization" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplateLocalization(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("locale")} placeholder="Locale" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemplateApprovalsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<templateApprovalFormValues>({ resolver: zodResolver(templateApprovalFormSchema), defaultValues: { communicationHubId: "", approvalKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Template Approvals" description="Enterprise communication hub template approvals" /><div className="mt-6 space-y-3">
                {data.templateApprovals.length === 0 ? <EmptyState title="No template approvals" description="Create the first template approvals record." /> : data.templateApprovals.map((item) => (
                    <ListCard key={item.id} title={String(item.approvalKey)} subtitle={`${item.hubName} • ${item.approvalKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template approval" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplateApproval(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("approvalKey")} placeholder="Approval key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AutomationRulesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<automationRuleFormValues>({ resolver: zodResolver(automationRuleFormSchema), defaultValues: { communicationHubId: "", ruleKey: "", ruleName: "", priorityLevel: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Automation Rules" description="Enterprise communication hub automation rules" /><div className="mt-6 space-y-3">
                {data.automationRules.length === 0 ? <EmptyState title="No automation rules" description="Create the first automation rules record." /> : data.automationRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName} • ${item.ruleKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation rule" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomationRule(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("ruleKey")} placeholder="Rule key" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="Rule name" className={inputClass} />
                <select {...form.register("priorityLevel")} className={inputClass}>{PRIORITY_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AutomationTriggersPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<automationTriggerFormValues>({ resolver: zodResolver(automationTriggerFormSchema), defaultValues: { communicationHubId: "", triggerKey: "", triggerEvent: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Automation Triggers" description="Enterprise communication hub automation triggers" /><div className="mt-6 space-y-3">
                {data.automationTriggers.length === 0 ? <EmptyState title="No automation triggers" description="Create the first automation triggers record." /> : data.automationTriggers.map((item) => (
                    <ListCard key={item.id} title={String(item.triggerKey)} subtitle={`${item.hubName} • ${item.triggerKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation trigger" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomationTrigger(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("triggerKey")} placeholder="Trigger key" className={inputClass} />
                <input {...form.register("triggerEvent")} placeholder="Trigger event" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AutomationSchedulesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<automationScheduleFormValues>({ resolver: zodResolver(automationScheduleFormSchema), defaultValues: { communicationHubId: "", scheduleKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Automation Schedules" description="Enterprise communication hub automation schedules" /><div className="mt-6 space-y-3">
                {data.automationSchedules.length === 0 ? <EmptyState title="No automation schedules" description="Create the first automation schedules record." /> : data.automationSchedules.map((item) => (
                    <ListCard key={item.id} title={String(item.scheduleKey)} subtitle={`${item.hubName} • ${item.scheduleKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation schedule" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomationSchedule(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("scheduleKey")} placeholder="Schedule key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AutomationExecutionsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<automationExecutionFormValues>({ resolver: zodResolver(automationExecutionFormSchema), defaultValues: { communicationHubId: "", executionKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Automation Executions" description="Enterprise communication hub automation executions" /><div className="mt-6 space-y-3">
                {data.automationExecutions.length === 0 ? <EmptyState title="No automation executions" description="Create the first automation executions record." /> : data.automationExecutions.map((item) => (
                    <ListCard key={item.id} title={String(item.executionKey)} subtitle={`${item.hubName} • ${item.executionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation execution" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomationExecution(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("executionKey")} placeholder="Execution key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PreferenceProfilesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<preferenceProfileFormValues>({ resolver: zodResolver(preferenceProfileFormSchema), defaultValues: { communicationHubId: "", profileKey: "", customerEmail: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Preference Profiles" description="Enterprise communication hub preference profiles" /><div className="mt-6 space-y-3">
                {data.preferenceProfiles.length === 0 ? <EmptyState title="No preference profiles" description="Create the first preference profiles record." /> : data.preferenceProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileKey)} subtitle={`${item.hubName} • ${item.profileKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create preference profile" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPreferenceProfile(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("profileKey")} placeholder="Profile key" className={inputClass} />
                <input {...form.register("customerEmail")} placeholder="Customer email" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ChannelPreferencesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<channelPreferenceFormValues>({ resolver: zodResolver(channelPreferenceFormSchema), defaultValues: { communicationHubId: "", channelType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Channel Preferences" description="Enterprise communication hub channel preferences" /><div className="mt-6 space-y-3">
                {data.channelPreferences.length === 0 ? <EmptyState title="No channel preferences" description="Create the first channel preferences record." /> : data.channelPreferences.map((item) => (
                    <ListCard key={item.id} title={String(item.channelType)} subtitle={`${item.hubName} • ${item.channelType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create channel preference" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createChannelPreference(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <select {...form.register("channelType")} className={inputClass}>{CHANNEL_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OptInRecordsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<optInRecordFormValues>({ resolver: zodResolver(optInRecordFormSchema), defaultValues: { communicationHubId: "", optInKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Opt-In Records" description="Enterprise communication hub opt-in records" /><div className="mt-6 space-y-3">
                {data.optInRecords.length === 0 ? <EmptyState title="No opt-in records" description="Create the first opt-in records record." /> : data.optInRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.optInKey)} subtitle={`${item.hubName} • ${item.optInKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create opt-in record" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOptInRecord(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("optInKey")} placeholder="Opt-in key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OptOutRecordsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<optOutRecordFormValues>({ resolver: zodResolver(optOutRecordFormSchema), defaultValues: { communicationHubId: "", optOutKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Opt-Out Records" description="Enterprise communication hub opt-out records" /><div className="mt-6 space-y-3">
                {data.optOutRecords.length === 0 ? <EmptyState title="No opt-out records" description="Create the first opt-out records record." /> : data.optOutRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.optOutKey)} subtitle={`${item.hubName} • ${item.optOutKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create opt-out record" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOptOutRecord(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("optOutKey")} placeholder="Opt-out key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AnnouncementsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<announcementFormValues>({ resolver: zodResolver(announcementFormSchema), defaultValues: { communicationHubId: "", announcementKey: "", title: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Announcements" description="Enterprise communication hub announcements" /><div className="mt-6 space-y-3">
                {data.announcements.length === 0 ? <EmptyState title="No announcements" description="Create the first announcements record." /> : data.announcements.map((item) => (
                    <ListCard key={item.id} title={String(item.title)} subtitle={`${item.hubName} • ${item.announcementKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create announcement" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAnnouncement(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("announcementKey")} placeholder="Announcement key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AnnouncementSchedulesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<announcementScheduleFormValues>({ resolver: zodResolver(announcementScheduleFormSchema), defaultValues: { communicationHubId: "", scheduleKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Announcement Schedules" description="Enterprise communication hub announcement schedules" /><div className="mt-6 space-y-3">
                {data.announcementSchedules.length === 0 ? <EmptyState title="No announcement schedules" description="Create the first announcement schedules record." /> : data.announcementSchedules.map((item) => (
                    <ListCard key={item.id} title={String(item.scheduleKey)} subtitle={`${item.hubName} • ${item.scheduleKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create announcement schedule" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAnnouncementSchedule(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("scheduleKey")} placeholder="Schedule key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PinnedAnnouncementsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<pinnedAnnouncementFormValues>({ resolver: zodResolver(pinnedAnnouncementFormSchema), defaultValues: { communicationHubId: "", pinKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pinned Announcements" description="Enterprise communication hub pinned announcements" /><div className="mt-6 space-y-3">
                {data.pinnedAnnouncements.length === 0 ? <EmptyState title="No pinned announcements" description="Create the first pinned announcements record." /> : data.pinnedAnnouncements.map((item) => (
                    <ListCard key={item.id} title={String(item.pinKey)} subtitle={`${item.hubName} • ${item.pinKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pinned announcement" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPinnedAnnouncement(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("pinKey")} placeholder="Pin key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AnnouncementAcknowledgementsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<announcementAcknowledgementFormValues>({ resolver: zodResolver(announcementAcknowledgementFormSchema), defaultValues: { communicationHubId: "", acknowledgementKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Announcement Acknowledgements" description="Enterprise communication hub announcement acknowledgements" /><div className="mt-6 space-y-3">
                {data.announcementAcknowledgements.length === 0 ? <EmptyState title="No announcement acknowledgements" description="Create the first announcement acknowledgements record." /> : data.announcementAcknowledgements.map((item) => (
                    <ListCard key={item.id} title={String(item.acknowledgementKey)} subtitle={`${item.hubName} • ${item.acknowledgementKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create announcement acknowledgement" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAnnouncementAcknowledgement(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("acknowledgementKey")} placeholder="Acknowledgement key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampaignsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<campaignFormValues>({ resolver: zodResolver(campaignFormSchema), defaultValues: { communicationHubId: "", campaignKey: "", campaignName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campaigns" description="Enterprise communication hub campaigns" /><div className="mt-6 space-y-3">
                {data.campaigns.length === 0 ? <EmptyState title="No campaigns" description="Create the first campaigns record." /> : data.campaigns.map((item) => (
                    <ListCard key={item.id} title={String(item.campaignName)} subtitle={`${item.hubName} • ${item.campaignKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campaign" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampaign(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("campaignKey")} placeholder="Campaign key" className={inputClass} />
                <input {...form.register("campaignName")} placeholder="Campaign name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AudienceSegmentsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<audienceSegmentFormValues>({ resolver: zodResolver(audienceSegmentFormSchema), defaultValues: { communicationHubId: "", segmentKey: "", segmentName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Audience Segments" description="Enterprise communication hub audience segments" /><div className="mt-6 space-y-3">
                {data.audienceSegments.length === 0 ? <EmptyState title="No audience segments" description="Create the first audience segments record." /> : data.audienceSegments.map((item) => (
                    <ListCard key={item.id} title={String(item.segmentName)} subtitle={`${item.hubName} • ${item.segmentKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create audience segment" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAudienceSegment(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("segmentKey")} placeholder="Segment key" className={inputClass} />
                <input {...form.register("segmentName")} placeholder="Segment name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampaignDeliveriesPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<campaignDeliveryFormValues>({ resolver: zodResolver(campaignDeliveryFormSchema), defaultValues: { communicationHubId: "", deliveryKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campaign Deliveries" description="Enterprise communication hub campaign deliveries" /><div className="mt-6 space-y-3">
                {data.campaignDeliveries.length === 0 ? <EmptyState title="No campaign deliveries" description="Create the first campaign deliveries record." /> : data.campaignDeliveries.map((item) => (
                    <ListCard key={item.id} title={String(item.deliveryKey)} subtitle={`${item.hubName} • ${item.deliveryKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campaign deliverie" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampaignDelivery(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("deliveryKey")} placeholder="Delivery key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampaignMetricsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<campaignMetricFormValues>({ resolver: zodResolver(campaignMetricFormSchema), defaultValues: { communicationHubId: "", metricsKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campaign Metrics" description="Enterprise communication hub campaign metrics" /><div className="mt-6 space-y-3">
                {data.campaignMetrics.length === 0 ? <EmptyState title="No campaign metrics" description="Create the first campaign metrics record." /> : data.campaignMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName} • ${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campaign metric" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampaignMetric(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeliveryAnalyticsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<deliveryAnalyticsFormValues>({ resolver: zodResolver(deliveryAnalyticsFormSchema), defaultValues: { communicationHubId: "", analyticsKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Analytics" description="Enterprise communication hub delivery analytics" /><div className="mt-6 space-y-3">
                {data.deliveryAnalytics.length === 0 ? <EmptyState title="No delivery analytics" description="Create the first delivery analytics record." /> : data.deliveryAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName} • ${item.analyticsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery analytic" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryAnalytics(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("analyticsKey")} placeholder="Analytics key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EngagementMetricsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<engagementMetricFormValues>({ resolver: zodResolver(engagementMetricFormSchema), defaultValues: { communicationHubId: "", metricsKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Engagement Metrics" description="Enterprise communication hub engagement metrics" /><div className="mt-6 space-y-3">
                {data.engagementMetrics.length === 0 ? <EmptyState title="No engagement metrics" description="Create the first engagement metrics record." /> : data.engagementMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName} • ${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create engagement metric" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEngagementMetric(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BounceRecordsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<bounceRecordFormValues>({ resolver: zodResolver(bounceRecordFormSchema), defaultValues: { communicationHubId: "", bounceKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Bounce Records" description="Enterprise communication hub bounce records" /><div className="mt-6 space-y-3">
                {data.bounceRecords.length === 0 ? <EmptyState title="No bounce records" description="Create the first bounce records record." /> : data.bounceRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.bounceKey)} subtitle={`${item.hubName} • ${item.bounceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create bounce record" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBounceRecord(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("bounceKey")} placeholder="Bounce key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ChannelPerformancePanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<channelPerformanceFormValues>({ resolver: zodResolver(channelPerformanceFormSchema), defaultValues: { communicationHubId: "", performanceKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Channel Performance" description="Enterprise communication hub channel performance" /><div className="mt-6 space-y-3">
                {data.channelPerformance.length === 0 ? <EmptyState title="No channel performance" description="Create the first channel performance record." /> : data.channelPerformance.map((item) => (
                    <ListCard key={item.id} title={String(item.performanceKey)} subtitle={`${item.hubName} • ${item.performanceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create channel performance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createChannelPerformance(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("performanceKey")} placeholder="Performance key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CommunicationMetricsPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<communicationMetricFormValues>({ resolver: zodResolver(communicationMetricFormSchema), defaultValues: { metricsKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Communication Metrics" description="Enterprise communication hub communication metrics" /><div className="mt-6 space-y-3">
                {data.communicationMetrics.length === 0 ? <EmptyState title="No communication metrics" description="Create the first communication metrics record." /> : data.communicationMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create communication metric" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommunicationMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SystemHealthPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<systemHealthFormValues>({ resolver: zodResolver(systemHealthFormSchema), defaultValues: { healthKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="System Health" description="Enterprise communication hub system health" /><div className="mt-6 space-y-3">
                {data.systemHealth.length === 0 ? <EmptyState title="No system health" description="Create the first system health record." /> : data.systemHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.healthKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create system health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSystemHealth(v))}>
                <input {...form.register("healthKey")} placeholder="Health key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeliveryFailuresPanel({ data }: { data: CommunicationHubData }) {
    const form = useForm<deliveryFailureFormValues>({ resolver: zodResolver(deliveryFailureFormSchema), defaultValues: { communicationHubId: "", failureKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Failures" description="Enterprise communication hub delivery failures" /><div className="mt-6 space-y-3">
                {data.deliveryFailures.length === 0 ? <EmptyState title="No delivery failures" description="Create the first delivery failures record." /> : data.deliveryFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName} • ${item.failureKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery failure" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryFailure(v))}>
                <CommunicationHubSelect data={data} {...form.register("communicationHubId")} />
                <input {...form.register("failureKey")} placeholder="Failure key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AuditLogsPanel({ data }: { data: CommunicationHubData }) {
    return (
        <Card hover><SectionHeader title="Audit Logs" description="Communication hub audit logs" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit logs" description="Audit entries will appear as communication operations occur." /> : data.auditLogs.map((item) => (
                <ListCard key={item.id} title={String(item.summary)} subtitle={`${item.entityType} • ${item.action}`} meta={`${item.securityLevel}`} />
            ))}
        </div></Card>
    );
}

export function CommunicationHubSdkPanel({ data }: { data: CommunicationHubData }) {
    return (
        <Card hover><SectionHeader title="Communication Hub SDK" description="Reusable enterprise communication services with AI orchestration and knowledge integration" /><div className="mt-6 space-y-3">
            <ListCard title="sdkSendNotification()" subtitle="Queue notification with AI orchestration" meta="moduleSource: communication_hub" />
            <ListCard title="sdkLaunchCampaign()" subtitle="Launch campaign with knowledge search" meta="moduleSource: communication_hub" />
            <ListCard title="sdkUpdatePreferences()" subtitle="Update customer preference profile" meta="moduleSource: communication_hub" />
            <ListCard title="getCommunicationHubs()" subtitle={`${data.communicationHubs.length} hubs loaded`} meta="Enterprise Communication Hub SDK" />
        </div></Card>
    );
}
