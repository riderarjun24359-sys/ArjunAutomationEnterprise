"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import {
    APPROVER_ROLE_OPTIONS,
    CICD_PLATFORM_OPTIONS,
    CLOUD_PROVIDER_OPTIONS,
    ENVIRONMENT_TYPE_OPTIONS,
    LOGGING_PROVIDER_OPTIONS,
    MONITORING_PROVIDER_OPTIONS,
    PIPELINE_STAGE_OPTIONS,
    TEMPLATE_TYPE_OPTIONS,
} from "@/src/modules/devops-deployment/constants";
import type { useDevopsDeployment } from "@/src/modules/devops-deployment/hooks/useDevopsDeployment";
import {
    backupVerificationFormSchema,
    blueGreenPlanFormSchema,
    canaryPlanFormSchema,
    cicdPipelineFormSchema,
    costEstimateFormSchema,
    deploymentApprovalFormSchema,
    disasterRecoveryPlanFormSchema,
    dockerConfigFormSchema,
    engagementFormSchema,
    environmentFormSchema,
    healthCheckFormSchema,
    infrastructureTemplateFormSchema,
    kubernetesPlanFormSchema,
    loggingIntegrationFormSchema,
    monitoringIntegrationFormSchema,
    releaseOrchestrationFormSchema,
    releaseVersionFormSchema,
    rollbackPlanFormSchema,
    type BackupVerificationFormValues,
    type BlueGreenPlanFormValues,
    type CanaryPlanFormValues,
    type CicdPipelineFormValues,
    type CostEstimateFormValues,
    type DeploymentApprovalFormValues,
    type DisasterRecoveryPlanFormValues,
    type DockerConfigFormValues,
    type EngagementFormValues,
    type EnvironmentFormValues,
    type HealthCheckFormValues,
    type InfrastructureTemplateFormValues,
    type KubernetesPlanFormValues,
    type LoggingIntegrationFormValues,
    type MonitoringIntegrationFormValues,
    type ReleaseOrchestrationFormValues,
    type ReleaseVersionFormValues,
    type RollbackPlanFormValues,
} from "@/src/modules/devops-deployment/schemas";

type DevopsDeploymentData = ReturnType<typeof useDevopsDeployment>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-orange-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-orange-600">{meta}</p> : null}</div>;
}
function EngagementSelect({ data, ...props }: { data: DevopsDeploymentData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>;
}

export function DevopsDeploymentOverviewPanel({ data }: { data: DevopsDeploymentData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="DevOps deployment summary" description="Engagement and deployment orchestration metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Engagements" subtitle={`${data.stats?.totalEngagements ?? 0} total`} meta={`${data.stats?.activeEngagements ?? 0} active`} />
                <ListCard title="CI/CD & Infrastructure" subtitle={`${data.stats?.cicdPipelineCount ?? 0} pipelines • ${data.stats?.environmentCount ?? 0} environments`} meta={`${data.stats?.infrastructureTemplateCount ?? 0} templates • ${data.stats?.dockerConfigCount ?? 0} Docker configs`} />
                <ListCard title="Release Strategy" subtitle={`${data.stats?.releaseOrchestrationCount ?? 0} orchestrations`} meta={`${data.stats?.blueGreenPlanCount ?? 0} blue-green • ${data.stats?.canaryPlanCount ?? 0} canary • ${data.stats?.rollbackPlanCount ?? 0} rollback`} />
                <ListCard title="Operations & Release" subtitle={`${data.stats?.monitoringIntegrationCount ?? 0} monitoring • ${data.stats?.loggingIntegrationCount ?? 0} logging`} meta={`${data.stats?.pendingDeploymentApprovals ?? 0} pending approvals • ${data.stats?.releaseVersionCount ?? 0} versions`} />
            </div></Card>
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.previousWorker ?? "AI QA Engineer"} → ${pipeline?.currentWorker ?? "AI DevOps & Deployment Engineer"} → ${pipeline?.nextWorker ?? "Production Deployment"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as engagements progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function DdEngagementsPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<EngagementFormValues>({ resolver: zodResolver(engagementFormSchema), defaultValues: { title: "", engagementKey: "", baEngagementId: "", saEngagementId: "", dfEngagementId: "", qaEngagementId: "", solutionArchitectureId: "", workPackageId: "", qaReleaseReadinessId: "", brdId: "", frsId: "", clientId: "", projectId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="DevOps engagements" description="Engagements linked to BA, SA, DF, and QA deliverables" /><div className="mt-6 space-y-3">
                {data.engagements.length === 0 ? <EmptyState title="No engagements" description="Start a new DevOps engagement from QA release readiness outputs." /> : data.engagements.map((e) => (
                    <ListCard key={e.id} title={e.title} subtitle={`${e.engagementKey} • ${e.pipelineStage}`} meta={`${e.status}${e.qaEngagementTitle ? ` • QA: ${e.qaEngagementTitle}` : ""}${e.dfEngagementTitle ? ` • DF: ${e.dfEngagementTitle}` : ""}${e.qaReleaseReadinessTitle ? ` • Readiness: ${e.qaReleaseReadinessTitle}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create engagement" description="Start a new DevOps deployment engagement" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEngagement(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("engagementKey")} placeholder="Engagement key" className={inputClass} />
                <select {...form.register("qaEngagementId")} className={inputClass}><option value="">QA engagement</option>{data.qaEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("baEngagementId")} className={inputClass}><option value="">BA engagement</option>{data.baEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("saEngagementId")} className={inputClass}><option value="">SA engagement</option>{data.saEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("dfEngagementId")} className={inputClass}><option value="">DF engagement</option>{data.dfEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("qaReleaseReadinessId")} className={inputClass}><option value="">QA release readiness</option>{data.qaReleaseReadinessOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                <select {...form.register("workPackageId")} className={inputClass}><option value="">Work package</option>{data.workPackageOptions.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
                <select {...form.register("solutionArchitectureId")} className={inputClass}><option value="">Solution architecture</option>{data.solutionArchitectureOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select {...form.register("projectId")} className={inputClass}><option value="">Project</option>{data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("agentId")} className={inputClass}><option value="">AI agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create engagement" />
            </form></Card>
        </div>
    );
}

export function CicdPipelinesPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<CicdPipelineFormValues>({ resolver: zodResolver(cicdPipelineFormSchema), defaultValues: { engagementId: "", pipelineKey: "", name: "", platform: "github_actions" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="CI/CD pipelines" description="Continuous integration and deployment pipelines" /><div className="mt-6 space-y-3">
                {data.cicdPipelines.length === 0 ? <EmptyState title="No CI/CD pipelines" description="Define CI/CD pipelines for DevOps engagements." /> : data.cicdPipelines.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.pipelineKey} • ${p.engagementTitle}`} meta={`${p.platform} • ${p.stageCount} stages • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create CI/CD pipeline" description="Define a CI/CD pipeline" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCicdPipeline(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("pipelineKey")} placeholder="Pipeline key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("platform")} className={inputClass}>{CICD_PLATFORM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create pipeline" />
            </form></Card>
        </div>
    );
}

export function EnvironmentsPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<EnvironmentFormValues>({ resolver: zodResolver(environmentFormSchema), defaultValues: { engagementId: "", environmentKey: "", name: "", environmentType: "staging" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Environments" description="Deployment environment configurations" /><div className="mt-6 space-y-3">
                {data.environments.length === 0 ? <EmptyState title="No environments" description="Define deployment environments." /> : data.environments.map((e) => (
                    <ListCard key={e.id} title={e.name} subtitle={`${e.environmentKey} • ${e.engagementTitle}`} meta={`${ENVIRONMENT_TYPE_OPTIONS.find((o) => o.value === e.environmentType)?.label ?? e.environmentType} • ${e.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create environment" description="Define a deployment environment" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEnvironment(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("environmentKey")} placeholder="Environment key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("environmentType")} className={inputClass}>{ENVIRONMENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create environment" />
            </form></Card>
        </div>
    );
}

export function InfrastructureTemplatesPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<InfrastructureTemplateFormValues>({ resolver: zodResolver(infrastructureTemplateFormSchema), defaultValues: { engagementId: "", templateKey: "", name: "", provider: "aws", templateType: "terraform" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Infrastructure templates" description="IaC templates for cloud infrastructure" /><div className="mt-6 space-y-3">
                {data.infrastructureTemplates.length === 0 ? <EmptyState title="No infrastructure templates" description="Define infrastructure as code templates." /> : data.infrastructureTemplates.map((t) => (
                    <ListCard key={t.id} title={t.name} subtitle={`${t.templateKey} • ${t.engagementTitle}`} meta={`${t.provider} • ${t.templateType} • ${t.resourceCount} resources • ${t.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create infrastructure template" description="Define an IaC template" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInfrastructureTemplate(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("templateKey")} placeholder="Template key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("provider")} className={inputClass}>{CLOUD_PROVIDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("templateType")} className={inputClass}>{TEMPLATE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create template" />
            </form></Card>
        </div>
    );
}

export function DockerConfigsPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<DockerConfigFormValues>({ resolver: zodResolver(dockerConfigFormSchema), defaultValues: { engagementId: "", configKey: "", name: "", baseImage: "", dockerfileContent: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Docker configs" description="Container and Dockerfile configurations" /><div className="mt-6 space-y-3">
                {data.dockerConfigs.length === 0 ? <EmptyState title="No Docker configs" description="Define Docker container configurations." /> : data.dockerConfigs.map((c) => (
                    <ListCard key={c.id} title={c.name} subtitle={`${c.configKey} • ${c.engagementTitle}`} meta={`${c.baseImage} • ${c.serviceCount} services • ${c.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create Docker config" description="Define a Docker configuration" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDockerConfig(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("configKey")} placeholder="Config key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("baseImage")} placeholder="Base image" className={inputClass} />
                <textarea {...form.register("dockerfileContent")} placeholder="Dockerfile content" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create config" />
            </form></Card>
        </div>
    );
}

export function KubernetesPlansPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<KubernetesPlanFormValues>({ resolver: zodResolver(kubernetesPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", namespace: "default" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kubernetes plans" description="Kubernetes deployment manifests and plans" /><div className="mt-6 space-y-3">
                {data.kubernetesPlans.length === 0 ? <EmptyState title="No Kubernetes plans" description="Define Kubernetes deployment plans." /> : data.kubernetesPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.namespace} • ${p.manifestCount} manifests • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create Kubernetes plan" description="Define a Kubernetes plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKubernetesPlan(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("namespace")} placeholder="Namespace" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function ReleaseOrchestrationPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<ReleaseOrchestrationFormValues>({ resolver: zodResolver(releaseOrchestrationFormSchema), defaultValues: { engagementId: "", orchestrationKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Release orchestration" description="Release step orchestration and dependencies" /><div className="mt-6 space-y-3">
                {data.releaseOrchestrations.length === 0 ? <EmptyState title="No release orchestrations" description="Define release orchestration plans." /> : data.releaseOrchestrations.map((o) => (
                    <ListCard key={o.id} title={o.name} subtitle={`${o.orchestrationKey} • ${o.engagementTitle}`} meta={`${o.stepCount} steps • ${o.dependencyCount} dependencies • ${o.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create release orchestration" description="Define a release orchestration" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReleaseOrchestration(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("orchestrationKey")} placeholder="Orchestration key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create orchestration" />
            </form></Card>
        </div>
    );
}

export function RollbackPlansPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<RollbackPlanFormValues>({ resolver: zodResolver(rollbackPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", recoveryTimeMinutes: 15 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rollback plans" description="Deployment rollback triggers and steps" /><div className="mt-6 space-y-3">
                {data.rollbackPlans.length === 0 ? <EmptyState title="No rollback plans" description="Define rollback plans for deployments." /> : data.rollbackPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.recoveryTimeMinutes} min recovery • ${p.triggerCount} triggers • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rollback plan" description="Define a rollback plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRollbackPlan(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={1} {...form.register("recoveryTimeMinutes", { valueAsNumber: true })} placeholder="Recovery time (minutes)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function BlueGreenPlansPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<BlueGreenPlanFormValues>({ resolver: zodResolver(blueGreenPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", blueEnvironment: "", greenEnvironment: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Blue-green plans" description="Blue-green deployment switch strategies" /><div className="mt-6 space-y-3">
                {data.blueGreenPlans.length === 0 ? <EmptyState title="No blue-green plans" description="Define blue-green deployment plans." /> : data.blueGreenPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.blueEnvironment} → ${p.greenEnvironment} • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create blue-green plan" description="Define a blue-green plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBlueGreenPlan(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("blueEnvironment")} placeholder="Blue environment" className={inputClass} />
                <input {...form.register("greenEnvironment")} placeholder="Green environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function CanaryPlansPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<CanaryPlanFormValues>({ resolver: zodResolver(canaryPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", canaryPercentage: 10 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Canary plans" description="Canary deployment percentage and promotion criteria" /><div className="mt-6 space-y-3">
                {data.canaryPlans.length === 0 ? <EmptyState title="No canary plans" description="Define canary deployment plans." /> : data.canaryPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.canaryPercentage}% canary • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create canary plan" description="Define a canary plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCanaryPlan(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("canaryPercentage", { valueAsNumber: true })} placeholder="Canary %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function MonitoringIntegrationsPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<MonitoringIntegrationFormValues>({ resolver: zodResolver(monitoringIntegrationFormSchema), defaultValues: { engagementId: "", integrationKey: "", name: "", provider: "datadog" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Monitoring integrations" description="Metrics and alerting integrations" /><div className="mt-6 space-y-3">
                {data.monitoringIntegrations.length === 0 ? <EmptyState title="No monitoring integrations" description="Configure monitoring integrations." /> : data.monitoringIntegrations.map((i) => (
                    <ListCard key={i.id} title={i.name} subtitle={`${i.integrationKey} • ${i.engagementTitle}`} meta={`${i.provider} • ${i.metricCount} metrics • ${i.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create monitoring integration" description="Configure a monitoring integration" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMonitoringIntegration(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("integrationKey")} placeholder="Integration key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("provider")} className={inputClass}>{MONITORING_PROVIDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create integration" />
            </form></Card>
        </div>
    );
}

export function LoggingIntegrationsPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<LoggingIntegrationFormValues>({ resolver: zodResolver(loggingIntegrationFormSchema), defaultValues: { engagementId: "", integrationKey: "", name: "", provider: "cloudwatch", retentionDays: 30 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Logging integrations" description="Log aggregation and retention configurations" /><div className="mt-6 space-y-3">
                {data.loggingIntegrations.length === 0 ? <EmptyState title="No logging integrations" description="Configure logging integrations." /> : data.loggingIntegrations.map((i) => (
                    <ListCard key={i.id} title={i.name} subtitle={`${i.integrationKey} • ${i.engagementTitle}`} meta={`${i.provider} • ${i.retentionDays} days retention • ${i.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create logging integration" description="Configure a logging integration" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLoggingIntegration(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("integrationKey")} placeholder="Integration key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("provider")} className={inputClass}>{LOGGING_PROVIDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="number" min={1} {...form.register("retentionDays", { valueAsNumber: true })} placeholder="Retention days" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create integration" />
            </form></Card>
        </div>
    );
}

export function HealthChecksPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<HealthCheckFormValues>({ resolver: zodResolver(healthCheckFormSchema), defaultValues: { engagementId: "", checkKey: "", name: "", endpoint: "", checkIntervalSeconds: 60 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health checks" description="Service health check endpoints and intervals" /><div className="mt-6 space-y-3">
                {data.healthChecks.length === 0 ? <EmptyState title="No health checks" description="Define service health checks." /> : data.healthChecks.map((h) => (
                    <ListCard key={h.id} title={h.name} subtitle={`${h.checkKey} • ${h.engagementTitle}`} meta={`${h.endpoint} • every ${h.checkIntervalSeconds}s • ${h.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health check" description="Define a health check" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHealthCheck(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("checkKey")} placeholder="Check key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("endpoint")} placeholder="Endpoint" className={inputClass} />
                <input type="number" min={1} {...form.register("checkIntervalSeconds", { valueAsNumber: true })} placeholder="Interval (seconds)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create health check" />
            </form></Card>
        </div>
    );
}

export function BackupVerificationPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<BackupVerificationFormValues>({ resolver: zodResolver(backupVerificationFormSchema), defaultValues: { engagementId: "", verificationKey: "", name: "", verificationResults: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Backup verification" description="Backup target verification results" /><div className="mt-6 space-y-3">
                {data.backupVerifications.length === 0 ? <EmptyState title="No backup verifications" description="Verify backup targets and restore procedures." /> : data.backupVerifications.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.verificationKey} • ${v.engagementTitle}`} meta={`${v.targetCount} targets • ${v.status} • ${v.resultsPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create backup verification" description="Record a backup verification" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBackupVerification(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("verificationKey")} placeholder="Verification key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("verificationResults")} placeholder="Verification results" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create verification" />
            </form></Card>
        </div>
    );
}

export function DisasterRecoveryPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<DisasterRecoveryPlanFormValues>({ resolver: zodResolver(disasterRecoveryPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", rtoMinutes: 60, rpoMinutes: 15 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Disaster recovery plans" description="RTO/RPO targets and recovery steps" /><div className="mt-6 space-y-3">
                {data.disasterRecoveryPlans.length === 0 ? <EmptyState title="No disaster recovery plans" description="Define disaster recovery plans." /> : data.disasterRecoveryPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`RTO ${p.rtoMinutes}m • RPO ${p.rpoMinutes}m • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create disaster recovery plan" description="Define a disaster recovery plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDisasterRecoveryPlan(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={1} {...form.register("rtoMinutes", { valueAsNumber: true })} placeholder="RTO (minutes)" className={inputClass} />
                <input type="number" min={1} {...form.register("rpoMinutes", { valueAsNumber: true })} placeholder="RPO (minutes)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function CostEstimatesPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<CostEstimateFormValues>({ resolver: zodResolver(costEstimateFormSchema), defaultValues: { engagementId: "", estimateKey: "", name: "", monthlyCostUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cost estimates" description="Infrastructure cost estimates and breakdowns" /><div className="mt-6 space-y-3">
                {data.costEstimates.length === 0 ? <EmptyState title="No cost estimates" description="Estimate infrastructure deployment costs." /> : data.costEstimates.map((e) => (
                    <ListCard key={e.id} title={e.name} subtitle={`${e.estimateKey} • ${e.engagementTitle}`} meta={`$${e.monthlyCostUsd}/mo • ${e.breakdownCount} line items • ${e.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create cost estimate" description="Record a cost estimate" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCostEstimate(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("estimateKey")} placeholder="Estimate key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} step={0.01} {...form.register("monthlyCostUsd", { valueAsNumber: true })} placeholder="Monthly cost (USD)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create estimate" />
            </form></Card>
        </div>
    );
}

export function DeploymentApprovalsPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<DeploymentApprovalFormValues>({ resolver: zodResolver(deploymentApprovalFormSchema), defaultValues: { engagementId: "", approvalKey: "", title: "", approverRole: "release_manager" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment approvals" description="Release approval gates and criteria" /><div className="mt-6 space-y-3">
                {data.deploymentApprovals.length === 0 ? <EmptyState title="No deployment approvals" description="Define deployment approval gates." /> : data.deploymentApprovals.map((a) => (
                    <ListCard key={a.id} title={a.title} subtitle={`${a.approvalKey} • ${a.engagementTitle}`} meta={`${APPROVER_ROLE_OPTIONS.find((o) => o.value === a.approverRole)?.label ?? a.approverRole} • ${a.criteriaCount} criteria • ${a.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment approval" description="Record a deployment approval gate" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentApproval(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("approvalKey")} placeholder="Approval key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("approverRole")} className={inputClass}>{APPROVER_ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create approval" />
            </form></Card>
        </div>
    );
}

export function ReleaseVersionsPanel({ data }: { data: DevopsDeploymentData }) {
    const form = useForm<ReleaseVersionFormValues>({ resolver: zodResolver(releaseVersionFormSchema), defaultValues: { engagementId: "", versionKey: "", versionNumber: "", releaseNotes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Release versions" description="Version numbers, release notes, and changelogs" /><div className="mt-6 space-y-3">
                {data.releaseVersions.length === 0 ? <EmptyState title="No release versions" description="Track release versions and changelogs." /> : data.releaseVersions.map((v) => (
                    <ListCard key={v.id} title={v.versionNumber} subtitle={`${v.versionKey} • ${v.engagementTitle}`} meta={`${v.status} • ${v.releaseNotesPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create release version" description="Record a release version" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReleaseVersion(v))}>
                <EngagementSelect data={data} {...form.register("engagementId")} />
                <input {...form.register("versionKey")} placeholder="Version key" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="Version number" className={inputClass} />
                <textarea {...form.register("releaseNotes")} placeholder="Release notes" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create version" />
            </form></Card>
        </div>
    );
}

export function DdAuditPanel({ data }: { data: DevopsDeploymentData }) {
    return (
        <Card hover><SectionHeader title="DevOps deployment audit history" description="Complete audit trail for all DevOps operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function DevopsDeploymentSdkPanel({ data }: { data: DevopsDeploymentData }) {
    return (
        <Card hover><SectionHeader title="Shared DevOps & Deployment SDK" description="Import from @/src/modules/devops-deployment/sdk for AI Orchestration, Knowledge, and upstream worker integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createDevopsDeploymentClient()" subtitle="Factory for module-scoped DevOps client with auth context" meta="Used by AI Orchestration, Knowledge, QA Engineer, and Production Deployment modules" />
            <ListCard title="client.startEngagement()" subtitle="Start a new DevOps engagement linked to QA release readiness" meta={`${data.engagements.length} engagements active`} />
            <ListCard title="client.generateArtifact()" subtitle="Generate CI/CD pipeline, environment, release orchestration, or release version" meta={`${data.cicdPipelines.length + data.environments.length + data.releaseOrchestrations.length + data.releaseVersions.length} artifacts generated`} />
            <ListCard title="client.runAnalysis()" subtitle="Run rollback, cost, or disaster recovery analysis" meta={`${data.rollbackPlans.length + data.costEstimates.length + data.disasterRecoveryPlans.length} analyses completed`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createDevopsDeploymentClient } from "@/src/modules/devops-deployment/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import { createQaEngineerClient } from "@/src/modules/qa-engineer/sdk";

const dd = createDevopsDeploymentClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);
const qa = createQaEngineerClient(userId, email, fullName);

const qaEngagement = await qa.startEngagement({ title: "CRM QA", engagementKey: "crm-qa", agentId });
const readiness = await qa.getReleaseReadiness();
const ddEngagement = await dd.startEngagement({ title: "CRM DevOps", engagementKey: "crm-dd", qaEngagementId: qaEngagement.engagementId, qaReleaseReadinessId: readiness[0]?.id, agentId });
const context = await knowledge.resolveContext({ contextKey: "dd-crm-dd", agentId });
const pipeline = await dd.generateArtifact({ engagementId: ddEngagement.engagementId, artifactType: "cicd_pipeline", title: "CRM CI/CD Pipeline", content: "github_actions" });
const analysis = await dd.runAnalysis({ engagementId: ddEngagement.engagementId, analysisType: "rollback", inputPayload: { planKey: "RB-001", name: "CRM Rollback Plan" } });`}</pre>
        </div></Card>
    );
}
