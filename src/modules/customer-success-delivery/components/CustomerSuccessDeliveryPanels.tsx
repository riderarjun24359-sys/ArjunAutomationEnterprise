"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CSD_THEME, SESSION_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS, PLAN_STATUS_OPTIONS, RENEWAL_STATUS_OPTIONS, TICKET_STATUS_OPTIONS, AUTOMATION_STATUS_OPTIONS, DEPLOYMENT_STATUS_OPTIONS, UPGRADE_STATUS_OPTIONS, RELEASE_STATUS_OPTIONS, WORKFLOW_STATUS_OPTIONS, IMPLEMENTATION_STATUS_OPTIONS, MILESTONE_STATUS_OPTIONS } from "@/src/modules/customer-success-delivery/constants";
import type { useCustomerSuccessDelivery } from "@/src/modules/customer-success-delivery/hooks/useCustomerSuccessDelivery";
import {
    deliveryHubsFormSchema,
    type deliveryHubsFormValues,
    customerHealthScoresFormSchema,
    type customerHealthScoresFormValues,
    adoptionAnalyticsFormSchema,
    type adoptionAnalyticsFormValues,
    successPlansFormSchema,
    type successPlansFormValues,
    customerTimelinesFormSchema,
    type customerTimelinesFormValues,
    renewalForecastsFormSchema,
    type renewalForecastsFormValues,
    supportTicketsFormSchema,
    type supportTicketsFormValues,
    liveChatSessionsFormSchema,
    type liveChatSessionsFormValues,
    knowledgeBaseArticlesFormSchema,
    type knowledgeBaseArticlesFormValues,
    slaPoliciesFormSchema,
    type slaPoliciesFormValues,
    escalationRulesFormSchema,
    type escalationRulesFormValues,
    deploymentAutomationsFormSchema,
    type deploymentAutomationsFormValues,
    environmentManagementFormSchema,
    type environmentManagementFormValues,
    deploymentTrackingFormSchema,
    type deploymentTrackingFormValues,
    upgradeManagementFormSchema,
    type upgradeManagementFormValues,
    releaseTrackingFormSchema,
    type releaseTrackingFormValues,
    trainingPortalsFormSchema,
    type trainingPortalsFormValues,
    videoLibraryFormSchema,
    type videoLibraryFormValues,
    productToursFormSchema,
    type productToursFormValues,
    certificationsFormSchema,
    type certificationsFormValues,
    progressTrackingFormSchema,
    type progressTrackingFormValues,
    learningAnalyticsFormSchema,
    type learningAnalyticsFormValues,
    deliveryWorkflowsFormSchema,
    type deliveryWorkflowsFormValues,
    onboardingAutomationFormSchema,
    type onboardingAutomationFormValues,
    implementationTrackingFormSchema,
    type implementationTrackingFormValues,
    resourceAssignmentsFormSchema,
    type resourceAssignmentsFormValues,
    milestoneTrackingFormSchema,
    type milestoneTrackingFormValues,
    operationsMetricsFormSchema,
    type operationsMetricsFormValues,
    operationsHealthFormSchema,
    type operationsHealthFormValues,
    executiveKpisFormSchema,
    type executiveKpisFormValues,
    deliveryFailuresFormSchema,
    type deliveryFailuresFormValues,
} from "@/src/modules/customer-success-delivery/schemas";

type RetailData = ReturnType<typeof useCustomerSuccessDelivery>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-sky-500/20 focus:ring-4 dark:border-slate-800 dark:bg-sky-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-sky-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-sky-600">{meta}</p> : null}</div>;
}
function DeliveryHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.deliveryHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Customer Success & Delivery summary" description="System health, background jobs, event bus, trainingPortals, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Delivery Hubs" subtitle={`${data.stats?.totalDeliveryHubs ?? 0} total`} meta={`${data.stats?.activeDeliveryHubs ?? 0} active • ${data.stats?.customerHealthScoreCount ?? 0} dining areas`} />
                <ListCard title="Support Tickets" subtitle={`${data.stats?.supportTicketCount ?? 0} open tickets`} meta={`${data.stats?.deploymentTrackingCount ?? 0} deployments • ${data.stats?.trainingPortalCount ?? 0} training portals`} />
                <ListCard title="Delivery Health" subtitle={`${(data.stats?.overallDeliveryScore ?? 0).toFixed(1)} overall delivery score`} meta={`${data.stats?.openDeliveryFailureCount ?? 0} open failures`} />
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

export function DeliveryHubsPanel({ data }: { data: RetailData }) {
    const form = useForm<deliveryHubsFormValues>({ resolver: zodResolver(deliveryHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Hubs" description="Enterprise retail operating system delivery hubs" /><div className="mt-6 space-y-3">
                {data.deliveryHubs.length === 0 ? <EmptyState title="No delivery hubs" description="Create the first delivery hubs record." /> : data.deliveryHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerHealthScoresPanel({ data }: { data: RetailData }) {
    const form = useForm<customerHealthScoresFormValues>({ resolver: zodResolver(customerHealthScoresFormSchema), defaultValues: {"deliveryHubId":"","scoreKey":"","customerRef":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Health Scores" description="Enterprise retail operating system customer health scores" /><div className="mt-6 space-y-3">
                {data.customerHealthScores.length === 0 ? <EmptyState title="No customer health scores" description="Create the first customer health scores record." /> : data.customerHealthScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.customerRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer health scores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerHealthScore(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("scoreKey")} placeholder="scoreKey" className={inputClass} />
                <input {...form.register("customerRef")} placeholder="customerRef" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AdoptionAnalyticsPanel({ data }: { data: RetailData }) {
    const form = useForm<adoptionAnalyticsFormValues>({ resolver: zodResolver(adoptionAnalyticsFormSchema), defaultValues: {"deliveryHubId":"","analyticsKey":"","featureName":"","adoptionRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Adoption Analytics" description="Enterprise retail operating system adoption analytics" /><div className="mt-6 space-y-3">
                {data.adoptionAnalytics.length === 0 ? <EmptyState title="No adoption analytics" description="Create the first adoption analytics record." /> : data.adoptionAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.featureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.adoptionRate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create adoption analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdoptionAnalytic(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("featureName")} placeholder="featureName" className={inputClass} />
                <input type="number" step="any" {...form.register("adoptionRate", { valueAsNumber: true })} placeholder="adoptionRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SuccessPlansPanel({ data }: { data: RetailData }) {
    const form = useForm<successPlansFormValues>({ resolver: zodResolver(successPlansFormSchema), defaultValues: {"deliveryHubId":"","planKey":"","planName":"","planStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Success Plans" description="Enterprise retail operating system success plans" /><div className="mt-6 space-y-3">
                {data.successPlans.length === 0 ? <EmptyState title="No success plans" description="Create the first success plans record." /> : data.successPlans.map((item) => (
                    <ListCard key={item.id} title={String(item.planName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.planStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create success plans" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSuccessPlan(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("planKey")} placeholder="planKey" className={inputClass} />
                <input {...form.register("planName")} placeholder="planName" className={inputClass} />
                <select {...form.register("planStatus")} className={inputClass}>{PLAN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerTimelinesPanel({ data }: { data: RetailData }) {
    const form = useForm<customerTimelinesFormValues>({ resolver: zodResolver(customerTimelinesFormSchema), defaultValues: {"deliveryHubId":"","timelineKey":"","timelineName":"","timelineType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Timelines" description="Enterprise retail operating system customer timelines" /><div className="mt-6 space-y-3">
                {data.customerTimelines.length === 0 ? <EmptyState title="No customer timelines" description="Create the first customer timelines record." /> : data.customerTimelines.map((item) => (
                    <ListCard key={item.id} title={String(item.timelineName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.timelineType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer timelines" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerTimeline(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("timelineKey")} placeholder="timelineKey" className={inputClass} />
                <input {...form.register("timelineName")} placeholder="timelineName" className={inputClass} />
                <input {...form.register("timelineType")} placeholder="timelineType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenewalForecastsPanel({ data }: { data: RetailData }) {
    const form = useForm<renewalForecastsFormValues>({ resolver: zodResolver(renewalForecastsFormSchema), defaultValues: {"deliveryHubId":"","forecastKey":"","customerRef":"","forecastStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal Forecasts" description="Enterprise retail operating system renewal forecasts" /><div className="mt-6 space-y-3">
                {data.renewalForecasts.length === 0 ? <EmptyState title="No renewal forecasts" description="Create the first renewal forecasts record." /> : data.renewalForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.customerRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal forecasts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalForecast(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("forecastKey")} placeholder="forecastKey" className={inputClass} />
                <input {...form.register("customerRef")} placeholder="customerRef" className={inputClass} />
                <select {...form.register("forecastStatus")} className={inputClass}>{RENEWAL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SupportTicketsPanel({ data }: { data: RetailData }) {
    const form = useForm<supportTicketsFormValues>({ resolver: zodResolver(supportTicketsFormSchema), defaultValues: {"deliveryHubId":"","ticketKey":"","ticketTitle":"","ticketStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Support Tickets" description="Enterprise retail operating system support tickets" /><div className="mt-6 space-y-3">
                {data.supportTickets.length === 0 ? <EmptyState title="No support tickets" description="Create the first support tickets record." /> : data.supportTickets.map((item) => (
                    <ListCard key={item.id} title={String(item.ticketTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ticketStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create support tickets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSupportTicket(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("ticketKey")} placeholder="ticketKey" className={inputClass} />
                <input {...form.register("ticketTitle")} placeholder="ticketTitle" className={inputClass} />
                <select {...form.register("ticketStatus")} className={inputClass}>{TICKET_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LiveChatSessionsPanel({ data }: { data: RetailData }) {
    const form = useForm<liveChatSessionsFormValues>({ resolver: zodResolver(liveChatSessionsFormSchema), defaultValues: {"deliveryHubId":"","sessionKey":"","sessionTitle":"","sessionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Live Chat Sessions" description="Enterprise retail operating system live chat sessions" /><div className="mt-6 space-y-3">
                {data.liveChatSessions.length === 0 ? <EmptyState title="No live chat sessions" description="Create the first live chat sessions record." /> : data.liveChatSessions.map((item) => (
                    <ListCard key={item.id} title={String(item.sessionTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.sessionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create live chat sessions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLiveChatSession(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("sessionKey")} placeholder="sessionKey" className={inputClass} />
                <input {...form.register("sessionTitle")} placeholder="sessionTitle" className={inputClass} />
                <select {...form.register("sessionStatus")} className={inputClass}>{SESSION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KnowledgeBaseArticlesPanel({ data }: { data: RetailData }) {
    const form = useForm<knowledgeBaseArticlesFormValues>({ resolver: zodResolver(knowledgeBaseArticlesFormSchema), defaultValues: {"deliveryHubId":"","articleKey":"","articleTitle":"","articleCategory":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Knowledge Base Articles" description="Enterprise retail operating system knowledge base articles" /><div className="mt-6 space-y-3">
                {data.knowledgeBaseArticles.length === 0 ? <EmptyState title="No knowledge base articles" description="Create the first knowledge base articles record." /> : data.knowledgeBaseArticles.map((item) => (
                    <ListCard key={item.id} title={String(item.articleTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.articleCategory}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create knowledge base articles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKnowledgeBaseArticle(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("articleKey")} placeholder="articleKey" className={inputClass} />
                <input {...form.register("articleTitle")} placeholder="articleTitle" className={inputClass} />
                <input {...form.register("articleCategory")} placeholder="articleCategory" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SlaPolicysPanel({ data }: { data: RetailData }) {
    const form = useForm<slaPoliciesFormValues>({ resolver: zodResolver(slaPoliciesFormSchema), defaultValues: {"deliveryHubId":"","policyKey":"","policyName":"","policyType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sla Policies" description="Enterprise retail operating system sla policies" /><div className="mt-6 space-y-3">
                {data.slaPolicies.length === 0 ? <EmptyState title="No sla policies" description="Create the first sla policies record." /> : data.slaPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.policyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sla policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSlaPolicy(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <input {...form.register("policyType")} placeholder="policyType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EscalationRulesPanel({ data }: { data: RetailData }) {
    const form = useForm<escalationRulesFormValues>({ resolver: zodResolver(escalationRulesFormSchema), defaultValues: {"deliveryHubId":"","ruleKey":"","ruleName":"","ruleType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Escalation Rules" description="Enterprise retail operating system escalation rules" /><div className="mt-6 space-y-3">
                {data.escalationRules.length === 0 ? <EmptyState title="No escalation rules" description="Create the first escalation rules record." /> : data.escalationRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ruleType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create escalation rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEscalationRule(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input {...form.register("ruleType")} placeholder="ruleType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentAutomationsPanel({ data }: { data: RetailData }) {
    const form = useForm<deploymentAutomationsFormValues>({ resolver: zodResolver(deploymentAutomationsFormSchema), defaultValues: {"deliveryHubId":"","automationKey":"","automationName":"","automationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Automations" description="Enterprise retail operating system deployment automations" /><div className="mt-6 space-y-3">
                {data.deploymentAutomations.length === 0 ? <EmptyState title="No deployment automations" description="Create the first deployment automations record." /> : data.deploymentAutomations.map((item) => (
                    <ListCard key={item.id} title={String(item.automationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.automationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment automations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentAutomation(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("automationKey")} placeholder="automationKey" className={inputClass} />
                <input {...form.register("automationName")} placeholder="automationName" className={inputClass} />
                <select {...form.register("automationStatus")} className={inputClass}>{AUTOMATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EnvironmentManagementsPanel({ data }: { data: RetailData }) {
    const form = useForm<environmentManagementFormValues>({ resolver: zodResolver(environmentManagementFormSchema), defaultValues: {"deliveryHubId":"","environmentKey":"","environmentName":"","environmentType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Environment Management" description="Enterprise retail operating system environment management" /><div className="mt-6 space-y-3">
                {data.environmentManagement.length === 0 ? <EmptyState title="No environment management" description="Create the first environment management record." /> : data.environmentManagement.map((item) => (
                    <ListCard key={item.id} title={String(item.environmentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.environmentType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create environment management" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEnvironmentManagement(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("environmentKey")} placeholder="environmentKey" className={inputClass} />
                <input {...form.register("environmentName")} placeholder="environmentName" className={inputClass} />
                <input {...form.register("environmentType")} placeholder="environmentType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentTrackingsPanel({ data }: { data: RetailData }) {
    const form = useForm<deploymentTrackingFormValues>({ resolver: zodResolver(deploymentTrackingFormSchema), defaultValues: {"deliveryHubId":"","trackingKey":"","deploymentName":"","deploymentStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Tracking" description="Enterprise retail operating system deployment tracking" /><div className="mt-6 space-y-3">
                {data.deploymentTracking.length === 0 ? <EmptyState title="No deployment tracking" description="Create the first deployment tracking record." /> : data.deploymentTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.deploymentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deploymentStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment tracking" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentTracking(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("trackingKey")} placeholder="trackingKey" className={inputClass} />
                <input {...form.register("deploymentName")} placeholder="deploymentName" className={inputClass} />
                <select {...form.register("deploymentStatus")} className={inputClass}>{DEPLOYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function UpgradeManagementsPanel({ data }: { data: RetailData }) {
    const form = useForm<upgradeManagementFormValues>({ resolver: zodResolver(upgradeManagementFormSchema), defaultValues: {"deliveryHubId":"","upgradeKey":"","upgradeName":"","upgradeStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Upgrade Management" description="Enterprise retail operating system upgrade management" /><div className="mt-6 space-y-3">
                {data.upgradeManagement.length === 0 ? <EmptyState title="No upgrade management" description="Create the first upgrade management record." /> : data.upgradeManagement.map((item) => (
                    <ListCard key={item.id} title={String(item.upgradeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.upgradeStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create upgrade management" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUpgradeManagement(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("upgradeKey")} placeholder="upgradeKey" className={inputClass} />
                <input {...form.register("upgradeName")} placeholder="upgradeName" className={inputClass} />
                <select {...form.register("upgradeStatus")} className={inputClass}>{UPGRADE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReleaseTrackingsPanel({ data }: { data: RetailData }) {
    const form = useForm<releaseTrackingFormValues>({ resolver: zodResolver(releaseTrackingFormSchema), defaultValues: {"deliveryHubId":"","releaseKey":"","releaseName":"","releaseStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Release Tracking" description="Enterprise retail operating system release tracking" /><div className="mt-6 space-y-3">
                {data.releaseTracking.length === 0 ? <EmptyState title="No release tracking" description="Create the first release tracking record." /> : data.releaseTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.releaseName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.releaseStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create release tracking" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReleaseTracking(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("releaseKey")} placeholder="releaseKey" className={inputClass} />
                <input {...form.register("releaseName")} placeholder="releaseName" className={inputClass} />
                <select {...form.register("releaseStatus")} className={inputClass}>{RELEASE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TrainingPortalsPanel({ data }: { data: RetailData }) {
    const form = useForm<trainingPortalsFormValues>({ resolver: zodResolver(trainingPortalsFormSchema), defaultValues: {"deliveryHubId":"","portalKey":"","portalName":"","portalType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Training Portals" description="Enterprise retail operating system training portals" /><div className="mt-6 space-y-3">
                {data.trainingPortals.length === 0 ? <EmptyState title="No training portals" description="Create the first training portals record." /> : data.trainingPortals.map((item) => (
                    <ListCard key={item.id} title={String(item.portalName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.portalType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create training portals" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTrainingPortal(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("portalKey")} placeholder="portalKey" className={inputClass} />
                <input {...form.register("portalName")} placeholder="portalName" className={inputClass} />
                <input {...form.register("portalType")} placeholder="portalType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VideoLibrarysPanel({ data }: { data: RetailData }) {
    const form = useForm<videoLibraryFormValues>({ resolver: zodResolver(videoLibraryFormSchema), defaultValues: {"deliveryHubId":"","videoKey":"","videoTitle":"","videoCategory":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Video Library" description="Enterprise retail operating system video library" /><div className="mt-6 space-y-3">
                {data.videoLibrary.length === 0 ? <EmptyState title="No video library" description="Create the first video library record." /> : data.videoLibrary.map((item) => (
                    <ListCard key={item.id} title={String(item.videoTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.videoCategory}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create video library" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVideoLibrary(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("videoKey")} placeholder="videoKey" className={inputClass} />
                <input {...form.register("videoTitle")} placeholder="videoTitle" className={inputClass} />
                <input {...form.register("videoCategory")} placeholder="videoCategory" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProductToursPanel({ data }: { data: RetailData }) {
    const form = useForm<productToursFormValues>({ resolver: zodResolver(productToursFormSchema), defaultValues: {"deliveryHubId":"","tourKey":"","tourName":"","tourType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Product Tours" description="Enterprise retail operating system product tours" /><div className="mt-6 space-y-3">
                {data.productTours.length === 0 ? <EmptyState title="No product tours" description="Create the first product tours record." /> : data.productTours.map((item) => (
                    <ListCard key={item.id} title={String(item.tourName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.tourType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create product tours" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProductTour(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("tourKey")} placeholder="tourKey" className={inputClass} />
                <input {...form.register("tourName")} placeholder="tourName" className={inputClass} />
                <input {...form.register("tourType")} placeholder="tourType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CertificationsPanel({ data }: { data: RetailData }) {
    const form = useForm<certificationsFormValues>({ resolver: zodResolver(certificationsFormSchema), defaultValues: {"deliveryHubId":"","certificationKey":"","certificationName":"","certificationType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Certifications" description="Enterprise retail operating system certifications" /><div className="mt-6 space-y-3">
                {data.certifications.length === 0 ? <EmptyState title="No certifications" description="Create the first certifications record." /> : data.certifications.map((item) => (
                    <ListCard key={item.id} title={String(item.certificationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.certificationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create certifications" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCertification(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("certificationKey")} placeholder="certificationKey" className={inputClass} />
                <input {...form.register("certificationName")} placeholder="certificationName" className={inputClass} />
                <input {...form.register("certificationType")} placeholder="certificationType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProgressTrackingsPanel({ data }: { data: RetailData }) {
    const form = useForm<progressTrackingFormValues>({ resolver: zodResolver(progressTrackingFormSchema), defaultValues: {"deliveryHubId":"","progressKey":"","learnerRef":"","progressPercent":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Progress Tracking" description="Enterprise retail operating system progress tracking" /><div className="mt-6 space-y-3">
                {data.progressTracking.length === 0 ? <EmptyState title="No progress tracking" description="Create the first progress tracking record." /> : data.progressTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.progressKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.learnerRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create progress tracking" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProgressTracking(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("progressKey")} placeholder="progressKey" className={inputClass} />
                <input {...form.register("learnerRef")} placeholder="learnerRef" className={inputClass} />
                <input type="number" step="any" {...form.register("progressPercent", { valueAsNumber: true })} placeholder="progressPercent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LearningAnalyticsPanel({ data }: { data: RetailData }) {
    const form = useForm<learningAnalyticsFormValues>({ resolver: zodResolver(learningAnalyticsFormSchema), defaultValues: {"deliveryHubId":"","analyticsKey":"","metricName":"","completionRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Learning Analytics" description="Enterprise retail operating system learning analytics" /><div className="mt-6 space-y-3">
                {data.learningAnalytics.length === 0 ? <EmptyState title="No learning analytics" description="Create the first learning analytics record." /> : data.learningAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.completionRate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create learning analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLearningAnalytic(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("metricName")} placeholder="metricName" className={inputClass} />
                <input type="number" step="any" {...form.register("completionRate", { valueAsNumber: true })} placeholder="completionRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeliveryWorkflowsPanel({ data }: { data: RetailData }) {
    const form = useForm<deliveryWorkflowsFormValues>({ resolver: zodResolver(deliveryWorkflowsFormSchema), defaultValues: {"deliveryHubId":"","workflowKey":"","workflowName":"","workflowStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Workflows" description="Enterprise retail operating system delivery workflows" /><div className="mt-6 space-y-3">
                {data.deliveryWorkflows.length === 0 ? <EmptyState title="No delivery workflows" description="Create the first delivery workflows record." /> : data.deliveryWorkflows.map((item) => (
                    <ListCard key={item.id} title={String(item.workflowName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.workflowStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery workflows" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryWorkflow(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("workflowKey")} placeholder="workflowKey" className={inputClass} />
                <input {...form.register("workflowName")} placeholder="workflowName" className={inputClass} />
                <select {...form.register("workflowStatus")} className={inputClass}>{WORKFLOW_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OnboardingAutomationsPanel({ data }: { data: RetailData }) {
    const form = useForm<onboardingAutomationFormValues>({ resolver: zodResolver(onboardingAutomationFormSchema), defaultValues: {"deliveryHubId":"","automationKey":"","automationName":"","automationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Onboarding Automation" description="Enterprise retail operating system onboarding automation" /><div className="mt-6 space-y-3">
                {data.onboardingAutomation.length === 0 ? <EmptyState title="No onboarding automation" description="Create the first onboarding automation record." /> : data.onboardingAutomation.map((item) => (
                    <ListCard key={item.id} title={String(item.automationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.automationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create onboarding automation" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOnboardingAutomation(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("automationKey")} placeholder="automationKey" className={inputClass} />
                <input {...form.register("automationName")} placeholder="automationName" className={inputClass} />
                <select {...form.register("automationStatus")} className={inputClass}>{AUTOMATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ImplementationTrackingsPanel({ data }: { data: RetailData }) {
    const form = useForm<implementationTrackingFormValues>({ resolver: zodResolver(implementationTrackingFormSchema), defaultValues: {"deliveryHubId":"","trackingKey":"","implementationName":"","implementationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Implementation Tracking" description="Enterprise retail operating system implementation tracking" /><div className="mt-6 space-y-3">
                {data.implementationTracking.length === 0 ? <EmptyState title="No implementation tracking" description="Create the first implementation tracking record." /> : data.implementationTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.implementationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.implementationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create implementation tracking" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createImplementationTracking(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("trackingKey")} placeholder="trackingKey" className={inputClass} />
                <input {...form.register("implementationName")} placeholder="implementationName" className={inputClass} />
                <select {...form.register("implementationStatus")} className={inputClass}>{IMPLEMENTATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ResourceAssignmentsPanel({ data }: { data: RetailData }) {
    const form = useForm<resourceAssignmentsFormValues>({ resolver: zodResolver(resourceAssignmentsFormSchema), defaultValues: {"deliveryHubId":"","assignmentKey":"","resourceName":"","resourceType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Resource Assignments" description="Enterprise retail operating system resource assignments" /><div className="mt-6 space-y-3">
                {data.resourceAssignments.length === 0 ? <EmptyState title="No resource assignments" description="Create the first resource assignments record." /> : data.resourceAssignments.map((item) => (
                    <ListCard key={item.id} title={String(item.resourceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.resourceType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create resource assignments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createResourceAssignment(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("assignmentKey")} placeholder="assignmentKey" className={inputClass} />
                <input {...form.register("resourceName")} placeholder="resourceName" className={inputClass} />
                <input {...form.register("resourceType")} placeholder="resourceType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MilestoneTrackingsPanel({ data }: { data: RetailData }) {
    const form = useForm<milestoneTrackingFormValues>({ resolver: zodResolver(milestoneTrackingFormSchema), defaultValues: {"deliveryHubId":"","milestoneKey":"","milestoneName":"","milestoneStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Milestone Tracking" description="Enterprise retail operating system milestone tracking" /><div className="mt-6 space-y-3">
                {data.milestoneTracking.length === 0 ? <EmptyState title="No milestone tracking" description="Create the first milestone tracking record." /> : data.milestoneTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.milestoneName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.milestoneStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create milestone tracking" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMilestoneTracking(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("milestoneKey")} placeholder="milestoneKey" className={inputClass} />
                <input {...form.register("milestoneName")} placeholder="milestoneName" className={inputClass} />
                <select {...form.register("milestoneStatus")} className={inputClass}>{MILESTONE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationsMetricsPanel({ data }: { data: RetailData }) {
    const form = useForm<operationsMetricsFormValues>({ resolver: zodResolver(operationsMetricsFormSchema), defaultValues: {"metricsKey":"","customerHealthScore":0,"overallDeliveryScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Metrics" description="Enterprise retail operating system operations metrics" /><div className="mt-6 space-y-3">
                {data.operationsMetrics.length === 0 ? <EmptyState title="No operations metrics" description="Create the first operations metrics record." /> : data.operationsMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallDeliveryScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operations metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationsMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("customerHealthScore", { valueAsNumber: true })} placeholder="customerHealthScore" className={inputClass} />
                <input type="number" step="any" {...form.register("overallDeliveryScore", { valueAsNumber: true })} placeholder="overallDeliveryScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationsHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<operationsHealthFormValues>({ resolver: zodResolver(operationsHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Health" description="Enterprise retail operating system operations health" /><div className="mt-6 space-y-3">
                {data.operationsHealth.length === 0 ? <EmptyState title="No operations health" description="Create the first operations health record." /> : data.operationsHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
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

export function ExecutiveKpisPanel({ data }: { data: RetailData }) {
    const form = useForm<executiveKpisFormValues>({ resolver: zodResolver(executiveKpisFormSchema), defaultValues: {"deliveryHubId":"","kpiKey":"","kpiName":"","kpiScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Kpis" description="Enterprise retail operating system executive kpis" /><div className="mt-6 space-y-3">
                {data.executiveKpis.length === 0 ? <EmptyState title="No executive kpis" description="Create the first executive kpis record." /> : data.executiveKpis.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive kpis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveKpi(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <input type="number" step="any" {...form.register("kpiScore", { valueAsNumber: true })} placeholder="kpiScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeliveryFailuresPanel({ data }: { data: RetailData }) {
    const form = useForm<deliveryFailuresFormValues>({ resolver: zodResolver(deliveryFailuresFormSchema), defaultValues: {"deliveryHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Failures" description="Enterprise retail operating system delivery failures" /><div className="mt-6 space-y-3">
                {data.deliveryFailures.length === 0 ? <EmptyState title="No delivery failures" description="Create the first delivery failures record." /> : data.deliveryFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryFailure(v))}>
                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Customer Success & Delivery audit history" description="Security-first audit trail for jobs, events, trainingPortals, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Customer Success & Delivery SDK" description="Import from @/src/modules/customer-success-delivery/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-sky-600 dark:text-sky-300">
            <ListCard title="createCustomerSuccessDeliveryClient()" subtitle="Factory for module-scoped Customer Success & Delivery client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkTrackCustomerHealth()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: customer_success_delivery" />
            <ListCard title="sdkOpenSupportTicket()" subtitle="Open support ticket with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunDeliveryWorkflow()" subtitle="Run delivery workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-sky-500">Theme: {CSD_THEME.primary} • Integration hubs loaded: {data.deliveryHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-sky-950 p-4 text-xs text-sky-100">{`import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";

const intg = createCustomerSuccessDeliveryClient(userId, email, fullName);
await intg.registerCampus({ deliveryHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.openSupportTicket({ deliveryHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runDeliveryWorkflow({ deliveryHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
