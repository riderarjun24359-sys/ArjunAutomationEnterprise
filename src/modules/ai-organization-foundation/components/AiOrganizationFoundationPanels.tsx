"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AOF_THEME, CAMPAIGN_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS, ORCHESTRATOR_STATUS_OPTIONS, DASHBOARD_STATUS_OPTIONS, PLANNER_STATUS_OPTIONS, SCHEDULER_STATUS_OPTIONS, COORDINATION_STATUS_OPTIONS, AUTOMATION_STATUS_OPTIONS, IDEA_STATUS_OPTIONS, PIPELINE_STATUS_OPTIONS, EXPERIMENT_STATUS_OPTIONS, WORKFLOW_STATUS_OPTIONS, REPOSITORY_STATUS_OPTIONS, ROUTER_STATUS_OPTIONS, APPROVAL_STATUS_OPTIONS, POLICY_STATUS_OPTIONS, GOVERNANCE_STATUS_OPTIONS } from "@/src/modules/ai-organization-foundation/constants";
import type { useAiOrganizationFoundation } from "@/src/modules/ai-organization-foundation/hooks/useAiOrganizationFoundation";
import {
    organizationHubsFormSchema,
    type organizationHubsFormValues,
    growthOrchestratorsFormSchema,
    type growthOrchestratorsFormValues,
    campaignIntelligenceFormSchema,
    type campaignIntelligenceFormValues,
    leadPrioritizationFormSchema,
    type leadPrioritizationFormValues,
    opportunityRecommendationsFormSchema,
    type opportunityRecommendationsFormValues,
    pipelineHealthFormSchema,
    type pipelineHealthFormValues,
    growthAnalyticsFormSchema,
    type growthAnalyticsFormValues,
    executiveGrowthDashboardsFormSchema,
    type executiveGrowthDashboardsFormValues,
    deliveryOrchestratorsFormSchema,
    type deliveryOrchestratorsFormValues,
    resourcePlannersFormSchema,
    type resourcePlannersFormValues,
    implementationSchedulersFormSchema,
    type implementationSchedulersFormValues,
    deploymentCoordinationFormSchema,
    type deploymentCoordinationFormValues,
    deliveryIntelligenceFormSchema,
    type deliveryIntelligenceFormValues,
    customerSuccessAutomationFormSchema,
    type customerSuccessAutomationFormValues,
    executiveDeliveryDashboardsFormSchema,
    type executiveDeliveryDashboardsFormValues,
    ideaRegistryFormSchema,
    type ideaRegistryFormValues,
    innovationPipelineFormSchema,
    type innovationPipelineFormValues,
    experimentTrackerFormSchema,
    type experimentTrackerFormValues,
    validationWorkflowFormSchema,
    type validationWorkflowFormValues,
    outcomeEvaluationFormSchema,
    type outcomeEvaluationFormValues,
    knowledgeRepositoryFormSchema,
    type knowledgeRepositoryFormValues,
    aiTaskRoutersFormSchema,
    type aiTaskRoutersFormValues,
    humanApprovalEngineFormSchema,
    type humanApprovalEngineFormValues,
    policyEngineFormSchema,
    type policyEngineFormValues,
    executionHistoryFormSchema,
    type executionHistoryFormValues,
    aiGovernanceRulesFormSchema,
    type aiGovernanceRulesFormValues,
    organizationMetricsFormSchema,
    type organizationMetricsFormValues,
    organizationHealthFormSchema,
    type organizationHealthFormValues,
    innovationDashboardsFormSchema,
    type innovationDashboardsFormValues,
    missionProgressFormSchema,
    type missionProgressFormValues,
    organizationFailuresFormSchema,
    type organizationFailuresFormValues,
} from "@/src/modules/ai-organization-foundation/schemas";

type RetailData = ReturnType<typeof useAiOrganizationFoundation>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-orange-500/20 focus:ring-4 dark:border-slate-800 dark:bg-orange-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-orange-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-orange-600">{meta}</p> : null}</div>;
}
function OrganizationHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.organizationHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="AI Organization Foundation summary" description="System health, background jobs, event bus, aiTaskRouters, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Organization Hubs" subtitle={`${data.stats?.totalOrganizationHubs ?? 0} total`} meta={`${data.stats?.activeOrganizationHubs ?? 0} active • ${data.stats?.growthOrchestratorCount ?? 0} dining areas`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.deliveryOrchestratorCount ?? 0} menu categories`} meta={`${data.stats?.ideaRegistryCount ?? 0} ideaRegistry • ${data.stats?.aiTaskRouterCount ?? 0} open aiTaskRouters`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallOrganizationScore ?? 0).toFixed(1)} overall retail score`} meta={`${data.stats?.openOrganizationFailureCount ?? 0} open failures`} />
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

export function OrganizationHubsPanel({ data }: { data: RetailData }) {
    const form = useForm<organizationHubsFormValues>({ resolver: zodResolver(organizationHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Organization Hubs" description="Enterprise retail operating system organization hubs" /><div className="mt-6 space-y-3">
                {data.organizationHubs.length === 0 ? <EmptyState title="No organization hubs" description="Create the first organization hubs record." /> : data.organizationHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create organization hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrganizationHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthOrchestratorsPanel({ data }: { data: RetailData }) {
    const form = useForm<growthOrchestratorsFormValues>({ resolver: zodResolver(growthOrchestratorsFormSchema), defaultValues: {"organizationHubId":"","orchestratorKey":"","orchestratorName":"","orchestratorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Orchestrators" description="Enterprise retail operating system growth orchestrators" /><div className="mt-6 space-y-3">
                {data.growthOrchestrators.length === 0 ? <EmptyState title="No growth orchestrators" description="Create the first growth orchestrators record." /> : data.growthOrchestrators.map((item) => (
                    <ListCard key={item.id} title={String(item.orchestratorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.orchestratorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth orchestrators" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthOrchestrator(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("orchestratorKey")} placeholder="orchestratorKey" className={inputClass} />
                <input {...form.register("orchestratorName")} placeholder="orchestratorName" className={inputClass} />
                <select {...form.register("orchestratorStatus")} className={inputClass}>{ORCHESTRATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampaignIntelligencesPanel({ data }: { data: RetailData }) {
    const form = useForm<campaignIntelligenceFormValues>({ resolver: zodResolver(campaignIntelligenceFormSchema), defaultValues: {"organizationHubId":"","campaignKey":"","campaignName":"","campaignStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campaign Intelligence" description="Enterprise retail operating system campaign intelligence" /><div className="mt-6 space-y-3">
                {data.campaignIntelligence.length === 0 ? <EmptyState title="No campaign intelligence" description="Create the first campaign intelligence record." /> : data.campaignIntelligence.map((item) => (
                    <ListCard key={item.id} title={String(item.campaignName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.campaignStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campaign intelligence" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampaignIntelligence(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("campaignKey")} placeholder="campaignKey" className={inputClass} />
                <input {...form.register("campaignName")} placeholder="campaignName" className={inputClass} />
                <select {...form.register("campaignStatus")} className={inputClass}>{CAMPAIGN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LeadPrioritizationsPanel({ data }: { data: RetailData }) {
    const form = useForm<leadPrioritizationFormValues>({ resolver: zodResolver(leadPrioritizationFormSchema), defaultValues: {"organizationHubId":"","leadKey":"","leadName":"","priorityScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lead Prioritization" description="Enterprise retail operating system lead prioritization" /><div className="mt-6 space-y-3">
                {data.leadPrioritization.length === 0 ? <EmptyState title="No lead prioritization" description="Create the first lead prioritization record." /> : data.leadPrioritization.map((item) => (
                    <ListCard key={item.id} title={String(item.leadName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.priorityScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lead prioritization" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLeadPrioritization(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("leadKey")} placeholder="leadKey" className={inputClass} />
                <input {...form.register("leadName")} placeholder="leadName" className={inputClass} />
                <input type="number" step="any" {...form.register("priorityScore", { valueAsNumber: true })} placeholder="priorityScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OpportunityRecommendationsPanel({ data }: { data: RetailData }) {
    const form = useForm<opportunityRecommendationsFormValues>({ resolver: zodResolver(opportunityRecommendationsFormSchema), defaultValues: {"organizationHubId":"","recommendationKey":"","recommendationTitle":"","recommendationType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Opportunity Recommendations" description="Enterprise retail operating system opportunity recommendations" /><div className="mt-6 space-y-3">
                {data.opportunityRecommendations.length === 0 ? <EmptyState title="No opportunity recommendations" description="Create the first opportunity recommendations record." /> : data.opportunityRecommendations.map((item) => (
                    <ListCard key={item.id} title={String(item.recommendationTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.recommendationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create opportunity recommendations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOpportunityRecommendation(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("recommendationKey")} placeholder="recommendationKey" className={inputClass} />
                <input {...form.register("recommendationTitle")} placeholder="recommendationTitle" className={inputClass} />
                <input {...form.register("recommendationType")} placeholder="recommendationType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PipelineHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<pipelineHealthFormValues>({ resolver: zodResolver(pipelineHealthFormSchema), defaultValues: {"organizationHubId":"","healthKey":"","healthName":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pipeline Health" description="Enterprise retail operating system pipeline health" /><div className="mt-6 space-y-3">
                {data.pipelineHealth.length === 0 ? <EmptyState title="No pipeline health" description="Create the first pipeline health record." /> : data.pipelineHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.healthScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pipeline health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPipelineHealth(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input {...form.register("healthName")} placeholder="healthName" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthAnalyticssPanel({ data }: { data: RetailData }) {
    const form = useForm<growthAnalyticsFormValues>({ resolver: zodResolver(growthAnalyticsFormSchema), defaultValues: {"organizationHubId":"","analyticsKey":"","analyticsName":"","analyticsType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Analytics" description="Enterprise retail operating system growth analytics" /><div className="mt-6 space-y-3">
                {data.growthAnalytics.length === 0 ? <EmptyState title="No growth analytics" description="Create the first growth analytics record." /> : data.growthAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthAnalytics(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsName")} placeholder="analyticsName" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveGrowthDashboardsPanel({ data }: { data: RetailData }) {
    const form = useForm<executiveGrowthDashboardsFormValues>({ resolver: zodResolver(executiveGrowthDashboardsFormSchema), defaultValues: {"organizationHubId":"","dashboardKey":"","dashboardName":"","dashboardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Growth Dashboards" description="Enterprise retail operating system executive growth dashboards" /><div className="mt-6 space-y-3">
                {data.executiveGrowthDashboards.length === 0 ? <EmptyState title="No executive growth dashboards" description="Create the first executive growth dashboards record." /> : data.executiveGrowthDashboards.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive growth dashboards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveGrowthDashboard(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <select {...form.register("dashboardStatus")} className={inputClass}>{DASHBOARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeliveryOrchestratorsPanel({ data }: { data: RetailData }) {
    const form = useForm<deliveryOrchestratorsFormValues>({ resolver: zodResolver(deliveryOrchestratorsFormSchema), defaultValues: {"organizationHubId":"","orchestratorKey":"","orchestratorName":"","orchestratorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Orchestrators" description="Enterprise retail operating system delivery orchestrators" /><div className="mt-6 space-y-3">
                {data.deliveryOrchestrators.length === 0 ? <EmptyState title="No delivery orchestrators" description="Create the first delivery orchestrators record." /> : data.deliveryOrchestrators.map((item) => (
                    <ListCard key={item.id} title={String(item.orchestratorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.orchestratorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery orchestrators" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryOrchestrator(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("orchestratorKey")} placeholder="orchestratorKey" className={inputClass} />
                <input {...form.register("orchestratorName")} placeholder="orchestratorName" className={inputClass} />
                <select {...form.register("orchestratorStatus")} className={inputClass}>{ORCHESTRATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ResourcePlannersPanel({ data }: { data: RetailData }) {
    const form = useForm<resourcePlannersFormValues>({ resolver: zodResolver(resourcePlannersFormSchema), defaultValues: {"organizationHubId":"","plannerKey":"","plannerName":"","plannerStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Resource Planners" description="Enterprise retail operating system resource planners" /><div className="mt-6 space-y-3">
                {data.resourcePlanners.length === 0 ? <EmptyState title="No resource planners" description="Create the first resource planners record." /> : data.resourcePlanners.map((item) => (
                    <ListCard key={item.id} title={String(item.plannerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.plannerStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create resource planners" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createResourcePlanner(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("plannerKey")} placeholder="plannerKey" className={inputClass} />
                <input {...form.register("plannerName")} placeholder="plannerName" className={inputClass} />
                <select {...form.register("plannerStatus")} className={inputClass}>{PLANNER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ImplementationSchedulersPanel({ data }: { data: RetailData }) {
    const form = useForm<implementationSchedulersFormValues>({ resolver: zodResolver(implementationSchedulersFormSchema), defaultValues: {"organizationHubId":"","schedulerKey":"","schedulerName":"","schedulerStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Implementation Schedulers" description="Enterprise retail operating system implementation schedulers" /><div className="mt-6 space-y-3">
                {data.implementationSchedulers.length === 0 ? <EmptyState title="No implementation schedulers" description="Create the first implementation schedulers record." /> : data.implementationSchedulers.map((item) => (
                    <ListCard key={item.id} title={String(item.schedulerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.schedulerStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create implementation schedulers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createImplementationScheduler(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("schedulerKey")} placeholder="schedulerKey" className={inputClass} />
                <input {...form.register("schedulerName")} placeholder="schedulerName" className={inputClass} />
                <select {...form.register("schedulerStatus")} className={inputClass}>{SCHEDULER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentCoordinationsPanel({ data }: { data: RetailData }) {
    const form = useForm<deploymentCoordinationFormValues>({ resolver: zodResolver(deploymentCoordinationFormSchema), defaultValues: {"organizationHubId":"","coordinationKey":"","coordinationName":"","coordinationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Coordination" description="Enterprise retail operating system deployment coordination" /><div className="mt-6 space-y-3">
                {data.deploymentCoordination.length === 0 ? <EmptyState title="No deployment coordination" description="Create the first deployment coordination record." /> : data.deploymentCoordination.map((item) => (
                    <ListCard key={item.id} title={String(item.coordinationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.coordinationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment coordination" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentCoordination(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("coordinationKey")} placeholder="coordinationKey" className={inputClass} />
                <input {...form.register("coordinationName")} placeholder="coordinationName" className={inputClass} />
                <select {...form.register("coordinationStatus")} className={inputClass}>{COORDINATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeliveryIntelligencesPanel({ data }: { data: RetailData }) {
    const form = useForm<deliveryIntelligenceFormValues>({ resolver: zodResolver(deliveryIntelligenceFormSchema), defaultValues: {"organizationHubId":"","intelligenceKey":"","intelligenceTitle":"","intelligenceType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Intelligence" description="Enterprise retail operating system delivery intelligence" /><div className="mt-6 space-y-3">
                {data.deliveryIntelligence.length === 0 ? <EmptyState title="No delivery intelligence" description="Create the first delivery intelligence record." /> : data.deliveryIntelligence.map((item) => (
                    <ListCard key={item.id} title={String(item.intelligenceTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.intelligenceType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery intelligence" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryIntelligence(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("intelligenceKey")} placeholder="intelligenceKey" className={inputClass} />
                <input {...form.register("intelligenceTitle")} placeholder="intelligenceTitle" className={inputClass} />
                <input {...form.register("intelligenceType")} placeholder="intelligenceType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerSuccessAutomationsPanel({ data }: { data: RetailData }) {
    const form = useForm<customerSuccessAutomationFormValues>({ resolver: zodResolver(customerSuccessAutomationFormSchema), defaultValues: {"organizationHubId":"","automationKey":"","automationName":"","automationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Success Automation" description="Enterprise retail operating system customer success automation" /><div className="mt-6 space-y-3">
                {data.customerSuccessAutomation.length === 0 ? <EmptyState title="No customer success automation" description="Create the first customer success automation record." /> : data.customerSuccessAutomation.map((item) => (
                    <ListCard key={item.id} title={String(item.automationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.automationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer success automation" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerSuccessAutomation(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("automationKey")} placeholder="automationKey" className={inputClass} />
                <input {...form.register("automationName")} placeholder="automationName" className={inputClass} />
                <select {...form.register("automationStatus")} className={inputClass}>{AUTOMATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveDeliveryDashboardsPanel({ data }: { data: RetailData }) {
    const form = useForm<executiveDeliveryDashboardsFormValues>({ resolver: zodResolver(executiveDeliveryDashboardsFormSchema), defaultValues: {"organizationHubId":"","dashboardKey":"","dashboardName":"","dashboardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Delivery Dashboards" description="Enterprise retail operating system executive delivery dashboards" /><div className="mt-6 space-y-3">
                {data.executiveDeliveryDashboards.length === 0 ? <EmptyState title="No executive delivery dashboards" description="Create the first executive delivery dashboards record." /> : data.executiveDeliveryDashboards.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive delivery dashboards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveDeliveryDashboard(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <select {...form.register("dashboardStatus")} className={inputClass}>{DASHBOARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IdeaRegistrysPanel({ data }: { data: RetailData }) {
    const form = useForm<ideaRegistryFormValues>({ resolver: zodResolver(ideaRegistryFormSchema), defaultValues: {"organizationHubId":"","ideaKey":"","ideaTitle":"","ideaStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Idea Registry" description="Enterprise retail operating system idea registry" /><div className="mt-6 space-y-3">
                {data.ideaRegistry.length === 0 ? <EmptyState title="No idea registry" description="Create the first idea registry record." /> : data.ideaRegistry.map((item) => (
                    <ListCard key={item.id} title={String(item.ideaTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ideaStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create idea registry" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIdeaRegistry(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("ideaKey")} placeholder="ideaKey" className={inputClass} />
                <input {...form.register("ideaTitle")} placeholder="ideaTitle" className={inputClass} />
                <select {...form.register("ideaStatus")} className={inputClass}>{IDEA_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InnovationPipelinesPanel({ data }: { data: RetailData }) {
    const form = useForm<innovationPipelineFormValues>({ resolver: zodResolver(innovationPipelineFormSchema), defaultValues: {"organizationHubId":"","pipelineKey":"","pipelineName":"","pipelineStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Innovation Pipeline" description="Enterprise retail operating system innovation pipeline" /><div className="mt-6 space-y-3">
                {data.innovationPipeline.length === 0 ? <EmptyState title="No innovation pipeline" description="Create the first innovation pipeline record." /> : data.innovationPipeline.map((item) => (
                    <ListCard key={item.id} title={String(item.pipelineName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.pipelineStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create innovation pipeline" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInnovationPipeline(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("pipelineKey")} placeholder="pipelineKey" className={inputClass} />
                <input {...form.register("pipelineName")} placeholder="pipelineName" className={inputClass} />
                <select {...form.register("pipelineStatus")} className={inputClass}>{PIPELINE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExperimentTrackersPanel({ data }: { data: RetailData }) {
    const form = useForm<experimentTrackerFormValues>({ resolver: zodResolver(experimentTrackerFormSchema), defaultValues: {"organizationHubId":"","experimentKey":"","experimentName":"","experimentStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Experiment Tracker" description="Enterprise retail operating system experiment tracker" /><div className="mt-6 space-y-3">
                {data.experimentTracker.length === 0 ? <EmptyState title="No experiment tracker" description="Create the first experiment tracker record." /> : data.experimentTracker.map((item) => (
                    <ListCard key={item.id} title={String(item.experimentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.experimentStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create experiment tracker" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExperimentTracker(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("experimentKey")} placeholder="experimentKey" className={inputClass} />
                <input {...form.register("experimentName")} placeholder="experimentName" className={inputClass} />
                <select {...form.register("experimentStatus")} className={inputClass}>{EXPERIMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ValidationWorkflowsPanel({ data }: { data: RetailData }) {
    const form = useForm<validationWorkflowFormValues>({ resolver: zodResolver(validationWorkflowFormSchema), defaultValues: {"organizationHubId":"","workflowKey":"","workflowName":"","workflowStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Validation Workflow" description="Enterprise retail operating system validation workflow" /><div className="mt-6 space-y-3">
                {data.validationWorkflow.length === 0 ? <EmptyState title="No validation workflow" description="Create the first validation workflow record." /> : data.validationWorkflow.map((item) => (
                    <ListCard key={item.id} title={String(item.workflowName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.workflowStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create validation workflow" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createValidationWorkflow(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("workflowKey")} placeholder="workflowKey" className={inputClass} />
                <input {...form.register("workflowName")} placeholder="workflowName" className={inputClass} />
                <select {...form.register("workflowStatus")} className={inputClass}>{WORKFLOW_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OutcomeEvaluationsPanel({ data }: { data: RetailData }) {
    const form = useForm<outcomeEvaluationFormValues>({ resolver: zodResolver(outcomeEvaluationFormSchema), defaultValues: {"organizationHubId":"","evaluationKey":"","evaluationTitle":"","evaluationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Outcome Evaluation" description="Enterprise retail operating system outcome evaluation" /><div className="mt-6 space-y-3">
                {data.outcomeEvaluation.length === 0 ? <EmptyState title="No outcome evaluation" description="Create the first outcome evaluation record." /> : data.outcomeEvaluation.map((item) => (
                    <ListCard key={item.id} title={String(item.evaluationTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.evaluationScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create outcome evaluation" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOutcomeEvaluation(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("evaluationKey")} placeholder="evaluationKey" className={inputClass} />
                <input {...form.register("evaluationTitle")} placeholder="evaluationTitle" className={inputClass} />
                <input type="number" step="any" {...form.register("evaluationScore", { valueAsNumber: true })} placeholder="evaluationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KnowledgeRepositorysPanel({ data }: { data: RetailData }) {
    const form = useForm<knowledgeRepositoryFormValues>({ resolver: zodResolver(knowledgeRepositoryFormSchema), defaultValues: {"organizationHubId":"","repositoryKey":"","repositoryName":"","repositoryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Knowledge Repository" description="Enterprise retail operating system knowledge repository" /><div className="mt-6 space-y-3">
                {data.knowledgeRepository.length === 0 ? <EmptyState title="No knowledge repository" description="Create the first knowledge repository record." /> : data.knowledgeRepository.map((item) => (
                    <ListCard key={item.id} title={String(item.repositoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.repositoryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create knowledge repository" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKnowledgeRepository(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("repositoryKey")} placeholder="repositoryKey" className={inputClass} />
                <input {...form.register("repositoryName")} placeholder="repositoryName" className={inputClass} />
                <select {...form.register("repositoryStatus")} className={inputClass}>{REPOSITORY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AiTaskRoutersPanel({ data }: { data: RetailData }) {
    const form = useForm<aiTaskRoutersFormValues>({ resolver: zodResolver(aiTaskRoutersFormSchema), defaultValues: {"organizationHubId":"","routerKey":"","routerName":"","routerStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Ai Task Routers" description="Enterprise retail operating system ai task routers" /><div className="mt-6 space-y-3">
                {data.aiTaskRouters.length === 0 ? <EmptyState title="No ai task routers" description="Create the first ai task routers record." /> : data.aiTaskRouters.map((item) => (
                    <ListCard key={item.id} title={String(item.routerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.routerStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ai task routers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAiTaskRouter(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("routerKey")} placeholder="routerKey" className={inputClass} />
                <input {...form.register("routerName")} placeholder="routerName" className={inputClass} />
                <select {...form.register("routerStatus")} className={inputClass}>{ROUTER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HumanApprovalEnginesPanel({ data }: { data: RetailData }) {
    const form = useForm<humanApprovalEngineFormValues>({ resolver: zodResolver(humanApprovalEngineFormSchema), defaultValues: {"organizationHubId":"","approvalKey":"","approvalName":"","approvalStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Human Approval Engine" description="Enterprise retail operating system human approval engine" /><div className="mt-6 space-y-3">
                {data.humanApprovalEngine.length === 0 ? <EmptyState title="No human approval engine" description="Create the first human approval engine record." /> : data.humanApprovalEngine.map((item) => (
                    <ListCard key={item.id} title={String(item.approvalName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.approvalStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create human approval engine" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHumanApprovalEngine(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("approvalKey")} placeholder="approvalKey" className={inputClass} />
                <input {...form.register("approvalName")} placeholder="approvalName" className={inputClass} />
                <select {...form.register("approvalStatus")} className={inputClass}>{APPROVAL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PolicyEnginesPanel({ data }: { data: RetailData }) {
    const form = useForm<policyEngineFormValues>({ resolver: zodResolver(policyEngineFormSchema), defaultValues: {"organizationHubId":"","policyKey":"","policyName":"","policyStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Policy Engine" description="Enterprise retail operating system policy engine" /><div className="mt-6 space-y-3">
                {data.policyEngine.length === 0 ? <EmptyState title="No policy engine" description="Create the first policy engine record." /> : data.policyEngine.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.policyStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create policy engine" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPolicyEngine(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <select {...form.register("policyStatus")} className={inputClass}>{POLICY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionHistorysPanel({ data }: { data: RetailData }) {
    const form = useForm<executionHistoryFormValues>({ resolver: zodResolver(executionHistoryFormSchema), defaultValues: {"organizationHubId":"","historyKey":"","historyTitle":"","executionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution History" description="Enterprise retail operating system execution history" /><div className="mt-6 space-y-3">
                {data.executionHistory.length === 0 ? <EmptyState title="No execution history" description="Create the first execution history record." /> : data.executionHistory.map((item) => (
                    <ListCard key={item.id} title={String(item.historyTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.executionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution history" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionHistory(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyTitle")} placeholder="historyTitle" className={inputClass} />
                <input {...form.register("executionStatus")} placeholder="executionStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AiGovernanceRulesPanel({ data }: { data: RetailData }) {
    const form = useForm<aiGovernanceRulesFormValues>({ resolver: zodResolver(aiGovernanceRulesFormSchema), defaultValues: {"organizationHubId":"","ruleKey":"","ruleName":"","ruleStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Ai Governance Rules" description="Enterprise retail operating system ai governance rules" /><div className="mt-6 space-y-3">
                {data.aiGovernanceRules.length === 0 ? <EmptyState title="No ai governance rules" description="Create the first ai governance rules record." /> : data.aiGovernanceRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ruleStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ai governance rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAiGovernanceRule(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <select {...form.register("ruleStatus")} className={inputClass}>{GOVERNANCE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrganizationMetricsPanel({ data }: { data: RetailData }) {
    const form = useForm<organizationMetricsFormValues>({ resolver: zodResolver(organizationMetricsFormSchema), defaultValues: {"metricsKey":"","growthScore":0,"overallOrganizationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Organization Metrics" description="Enterprise retail operating system organization metrics" /><div className="mt-6 space-y-3">
                {data.organizationMetrics.length === 0 ? <EmptyState title="No organization metrics" description="Create the first organization metrics record." /> : data.organizationMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallOrganizationScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create organization metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrganizationMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("growthScore", { valueAsNumber: true })} placeholder="growthScore" className={inputClass} />
                <input type="number" step="any" {...form.register("overallOrganizationScore", { valueAsNumber: true })} placeholder="overallOrganizationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrganizationHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<organizationHealthFormValues>({ resolver: zodResolver(organizationHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Organization Health" description="Enterprise retail operating system organization health" /><div className="mt-6 space-y-3">
                {data.organizationHealth.length === 0 ? <EmptyState title="No organization health" description="Create the first organization health record." /> : data.organizationHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create organization health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrganizationHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InnovationDashboardsPanel({ data }: { data: RetailData }) {
    const form = useForm<innovationDashboardsFormValues>({ resolver: zodResolver(innovationDashboardsFormSchema), defaultValues: {"organizationHubId":"","dashboardKey":"","dashboardName":"","dashboardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Innovation Dashboards" description="Enterprise retail operating system innovation dashboards" /><div className="mt-6 space-y-3">
                {data.innovationDashboards.length === 0 ? <EmptyState title="No innovation dashboards" description="Create the first innovation dashboards record." /> : data.innovationDashboards.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create innovation dashboards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInnovationDashboard(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <select {...form.register("dashboardStatus")} className={inputClass}>{DASHBOARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MissionProgresssPanel({ data }: { data: RetailData }) {
    const form = useForm<missionProgressFormValues>({ resolver: zodResolver(missionProgressFormSchema), defaultValues: {"organizationHubId":"","progressKey":"","progressName":"","progressPercent":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Mission Progress" description="Enterprise retail operating system mission progress" /><div className="mt-6 space-y-3">
                {data.missionProgress.length === 0 ? <EmptyState title="No mission progress" description="Create the first mission progress record." /> : data.missionProgress.map((item) => (
                    <ListCard key={item.id} title={String(item.progressName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.progressPercent}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mission progress" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMissionProgress(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("progressKey")} placeholder="progressKey" className={inputClass} />
                <input {...form.register("progressName")} placeholder="progressName" className={inputClass} />
                <input type="number" step="any" {...form.register("progressPercent", { valueAsNumber: true })} placeholder="progressPercent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrganizationFailuresPanel({ data }: { data: RetailData }) {
    const form = useForm<organizationFailuresFormValues>({ resolver: zodResolver(organizationFailuresFormSchema), defaultValues: {"organizationHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Organization Failures" description="Enterprise retail operating system organization failures" /><div className="mt-6 space-y-3">
                {data.organizationFailures.length === 0 ? <EmptyState title="No organization failures" description="Create the first organization failures record." /> : data.organizationFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create organization failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrganizationFailure(v))}>
                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="AI Organization Foundation audit history" description="Security-first audit trail for jobs, events, aiTaskRouters, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared AI Organization Foundation SDK" description="Import from @/src/modules/ai-organization-foundation/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-orange-600 dark:text-orange-300">
            <ListCard title="createAiOrganizationFoundationClient()" subtitle="Factory for module-scoped AI Organization Foundation client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunAgoService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: ai_organization_foundation" />
            <ListCard title="sdkRunAdoService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunAioService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-orange-500">Theme: {AOF_THEME.primary} • Integration hubs loaded: {data.organizationHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-orange-950 p-4 text-xs text-orange-100">{`import { createAiOrganizationFoundationClient } from "@/src/modules/ai-organization-foundation/sdk";

const intg = createAiOrganizationFoundationClient(userId, email, fullName);
await intg.registerCampus({ organizationHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runAdoService({ organizationHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runAioService({ organizationHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
