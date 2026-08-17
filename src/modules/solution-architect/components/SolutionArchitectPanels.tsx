"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ARCHITECTURE_TYPE_OPTIONS, BUILD_REUSE_OPTIONS, PIPELINE_STAGE_OPTIONS, PLATFORM_MODULE_OPTIONS } from "@/src/modules/solution-architect/constants";
import type { useSolutionArchitect } from "@/src/modules/solution-architect/hooks/useSolutionArchitect";
import {
    apiContractFormSchema,
    architectureReviewFormSchema,
    buildReuseFormSchema,
    databaseSchemaFormSchema,
    dependencyAnalysisFormSchema,
    deploymentArchitectureFormSchema,
    domainModelFormSchema,
    engagementFormSchema,
    integrationPlanFormSchema,
    moduleSelectionFormSchema,
    performancePlanFormSchema,
    scalabilityPlanFormSchema,
    securityArchitectureFormSchema,
    solutionArchitectureFormSchema,
    sprintPlanFormSchema,
    systemDecompositionFormSchema,
    technologyDecisionFormSchema,
    versionFormSchema,
    type ApiContractFormValues,
    type ArchitectureReviewFormValues,
    type BuildReuseFormValues,
    type DatabaseSchemaFormValues,
    type DependencyAnalysisFormValues,
    type DeploymentArchitectureFormValues,
    type DomainModelFormValues,
    type EngagementFormValues,
    type IntegrationPlanFormValues,
    type ModuleSelectionFormValues,
    type PerformancePlanFormValues,
    type ScalabilityPlanFormValues,
    type SecurityArchitectureFormValues,
    type SolutionArchitectureFormValues,
    type SprintPlanFormValues,
    type SystemDecompositionFormValues,
    type TechnologyDecisionFormValues,
    type VersionFormValues,
} from "@/src/modules/solution-architect/schemas";

type SolutionArchitectData = ReturnType<typeof useSolutionArchitect>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-cyan-600">{meta}</p> : null}</div>;
}

export function SaOverviewPanel({ data }: { data: SolutionArchitectData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Solution architect summary" description="Engagement and architecture design metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Engagements" subtitle={`${data.stats?.totalEngagements ?? 0} total`} meta={`${data.stats?.activeEngagements ?? 0} active`} />
                <ListCard title="Architectures" subtitle={`${data.stats?.architectureCount ?? 0} solution architectures`} meta={`${data.stats?.decompositionCount ?? 0} decompositions • ${data.stats?.domainModelCount ?? 0} domain models`} />
                <ListCard title="Contracts & Schemas" subtitle={`${data.stats?.apiContractCount ?? 0} API contracts`} meta={`${data.stats?.databaseSchemaCount ?? 0} database schemas • ${data.stats?.moduleSelectionCount ?? 0} module selections`} />
                <ListCard title="Delivery Planning" subtitle={`${data.stats?.sprintPlanCount ?? 0} sprint plans`} meta={`${data.stats?.pendingReviews ?? 0} pending reviews • ${data.stats?.versionCount ?? 0} versions`} />
            </div></Card>
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.previousWorker ?? "AI Business Analyst"} → ${pipeline?.currentWorker ?? "AI Solution Architect"} → ${pipeline?.nextWorker ?? "AI Development Factory"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as engagements progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function EngagementsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<EngagementFormValues>({ resolver: zodResolver(engagementFormSchema), defaultValues: { title: "", engagementKey: "", baEngagementId: "", brdId: "", frsId: "", clientId: "", projectId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="SA engagements" description="Architecture design engagements linked to BA deliverables" /><div className="mt-6 space-y-3">
                {data.engagements.length === 0 ? <EmptyState title="No engagements" description="Start a new solution architect engagement from approved BA artifacts." /> : data.engagements.map((e) => (
                    <ListCard key={e.id} title={e.title} subtitle={`${e.engagementKey} • ${e.pipelineStage}`} meta={`${e.status}${e.baEngagementTitle ? ` • BA: ${e.baEngagementTitle}` : ""}${e.brdTitle ? ` • BRD: ${e.brdTitle}` : ""}${e.clientName ? ` • ${e.clientName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create engagement" description="Start a new solution architect engagement" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEngagement(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("engagementKey")} placeholder="Engagement key" className={inputClass} />
                <select {...form.register("baEngagementId")} className={inputClass}><option value="">BA engagement</option>{data.baEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("brdId")} className={inputClass}><option value="">BRD</option>{data.brdOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                <select {...form.register("frsId")} className={inputClass}><option value="">FRS</option>{data.frsOptions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select {...form.register("projectId")} className={inputClass}><option value="">Project</option>{data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("agentId")} className={inputClass}><option value="">AI agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create engagement" />
            </form></Card>
        </div>
    );
}

export function ArchitecturesPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<SolutionArchitectureFormValues>({ resolver: zodResolver(solutionArchitectureFormSchema), defaultValues: { engagementId: "", title: "", overview: "", architectureType: "enterprise" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Solution architectures" description="High-level solution architecture documents" /><div className="mt-6 space-y-3">
                {data.solutionArchitectures.length === 0 ? <EmptyState title="No architectures" description="Create solution architecture documents from SA engagements." /> : data.solutionArchitectures.map((a) => (
                    <ListCard key={a.id} title={a.title} subtitle={`${a.engagementTitle} • ${a.architectureType}`} meta={`${a.status} • ${a.componentCount} components • ${a.overviewPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create architecture" description="Define a solution architecture" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSolutionArchitecture(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("architectureType")} className={inputClass}>{ARCHITECTURE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("overview")} placeholder="Architecture overview" rows={4} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create architecture" />
            </form></Card>
        </div>
    );
}

export function DecompositionsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<SystemDecompositionFormValues>({ resolver: zodResolver(systemDecompositionFormSchema), defaultValues: { engagementId: "", name: "", decompositionKey: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="System decompositions" description="Layered system decomposition models" /><div className="mt-6 space-y-3">
                {data.systemDecompositions.length === 0 ? <EmptyState title="No decompositions" description="Decompose systems into logical layers and components." /> : data.systemDecompositions.map((d) => (
                    <ListCard key={d.id} title={d.name} subtitle={`${d.decompositionKey} • ${d.engagementTitle}`} meta={`${d.status} • ${d.layerCount} layers`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create decomposition" description="Define a system decomposition" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSystemDecomposition(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("decompositionKey")} placeholder="Decomposition key" className={inputClass} />
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create decomposition" />
            </form></Card>
        </div>
    );
}

export function DomainModelsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<DomainModelFormValues>({ resolver: zodResolver(domainModelFormSchema), defaultValues: { engagementId: "", name: "", modelKey: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Domain models" description="Domain-driven design entity and relationship models" /><div className="mt-6 space-y-3">
                {data.domainModels.length === 0 ? <EmptyState title="No domain models" description="Model domain entities and relationships." /> : data.domainModels.map((m) => (
                    <ListCard key={m.id} title={m.name} subtitle={`${m.modelKey} • ${m.engagementTitle}`} meta={`${m.status} • ${m.entityCount} entities`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create domain model" description="Define a domain model" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDomainModel(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("modelKey")} placeholder="Model key" className={inputClass} />
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create domain model" />
            </form></Card>
        </div>
    );
}

export function DatabaseSchemasPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<DatabaseSchemaFormValues>({ resolver: zodResolver(databaseSchemaFormSchema), defaultValues: { engagementId: "", name: "", schemaKey: "", migrationNotes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Database schemas" description="Database schema designs and migration notes" /><div className="mt-6 space-y-3">
                {data.databaseSchemas.length === 0 ? <EmptyState title="No database schemas" description="Design database schemas for the solution." /> : data.databaseSchemas.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.schemaKey} • ${s.engagementTitle}`} meta={`${s.status} • ${s.tableCount} tables`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create database schema" description="Define a database schema" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDatabaseSchema(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("schemaKey")} placeholder="Schema key" className={inputClass} />
                <textarea {...form.register("migrationNotes")} placeholder="Migration notes" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create schema" />
            </form></Card>
        </div>
    );
}

export function ApiContractsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<ApiContractFormValues>({ resolver: zodResolver(apiContractFormSchema), defaultValues: { engagementId: "", name: "", contractKey: "", version: "1.0.0" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="API contracts" description="OpenAPI contracts and endpoint definitions" /><div className="mt-6 space-y-3">
                {data.apiContracts.length === 0 ? <EmptyState title="No API contracts" description="Define API contracts for service boundaries." /> : data.apiContracts.map((c) => (
                    <ListCard key={c.id} title={c.name} subtitle={`${c.contractKey} • ${c.engagementTitle}`} meta={`v${c.version} • ${c.endpointCount} endpoints • ${c.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create API contract" description="Define an API contract" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApiContract(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("contractKey")} placeholder="Contract key" className={inputClass} />
                <input {...form.register("version")} placeholder="Version" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create contract" />
            </form></Card>
        </div>
    );
}

export function ModuleSelectionsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<ModuleSelectionFormValues>({ resolver: zodResolver(moduleSelectionFormSchema), defaultValues: { engagementId: "", moduleName: "", moduleKey: "", platformModule: "", selectionRationale: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module selections" description="Platform module selection and rationale" /><div className="mt-6 space-y-3">
                {data.moduleSelections.length === 0 ? <EmptyState title="No module selections" description="Select platform modules for the solution." /> : data.moduleSelections.map((m) => (
                    <ListCard key={m.id} title={m.moduleName} subtitle={`${m.moduleKey} • ${m.engagementTitle}`} meta={`${PLATFORM_MODULE_OPTIONS.find((o) => o.value === m.platformModule)?.label ?? m.platformModule} • ${m.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add module selection" description="Select a platform module" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModuleSelection(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("moduleName")} placeholder="Module name" className={inputClass} />
                <input {...form.register("moduleKey")} placeholder="Module key" className={inputClass} />
                <select {...form.register("platformModule")} className={inputClass}><option value="">Platform module</option>{PLATFORM_MODULE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("selectionRationale")} placeholder="Selection rationale" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add selection" />
            </form></Card>
        </div>
    );
}

export function BuildReusePanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<BuildReuseFormValues>({ resolver: zodResolver(buildReuseFormSchema), defaultValues: { engagementId: "", itemKey: "", componentName: "", recommendation: "reuse", rationale: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Build vs reuse" description="Build, reuse, or hybrid recommendations for components" /><div className="mt-6 space-y-3">
                {data.buildReuseRecommendations.length === 0 ? <EmptyState title="No recommendations" description="Analyze components for build vs reuse decisions." /> : data.buildReuseRecommendations.map((b) => (
                    <ListCard key={b.id} title={b.componentName} subtitle={`${b.itemKey} • ${b.engagementTitle}`} meta={`${BUILD_REUSE_OPTIONS.find((o) => o.value === b.recommendation)?.label ?? b.recommendation} • ${b.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add recommendation" description="Recommend build, reuse, or hybrid" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBuildReuseRecommendation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("itemKey")} placeholder="Item key" className={inputClass} />
                <input {...form.register("componentName")} placeholder="Component name" className={inputClass} />
                <select {...form.register("recommendation")} className={inputClass}>{BUILD_REUSE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("rationale")} placeholder="Rationale" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add recommendation" />
            </form></Card>
        </div>
    );
}

export function IntegrationsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<IntegrationPlanFormValues>({ resolver: zodResolver(integrationPlanFormSchema), defaultValues: { engagementId: "", name: "", planKey: "", dataFlow: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Integration plans" description="System integration plans and data flow definitions" /><div className="mt-6 space-y-3">
                {data.integrationPlans.length === 0 ? <EmptyState title="No integration plans" description="Plan integrations between system components." /> : data.integrationPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.integrationCount} integrations • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create integration plan" description="Define an integration plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntegrationPlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <textarea {...form.register("dataFlow")} placeholder="Data flow description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function SecurityPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<SecurityArchitectureFormValues>({ resolver: zodResolver(securityArchitectureFormSchema), defaultValues: { engagementId: "", name: "", securityKey: "", authModel: "", encryption: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Security architecture" description="Authentication, encryption, and security controls" /><div className="mt-6 space-y-3">
                {data.securityArchitectures.length === 0 ? <EmptyState title="No security architectures" description="Define security architecture for the solution." /> : data.securityArchitectures.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.securityKey} • ${s.engagementTitle}`} meta={`${s.controlCount} controls • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create security architecture" description="Define security controls and models" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecurityArchitecture(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("securityKey")} placeholder="Security key" className={inputClass} />
                <input {...form.register("authModel")} placeholder="Authentication model" className={inputClass} />
                <input {...form.register("encryption")} placeholder="Encryption approach" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create security architecture" />
            </form></Card>
        </div>
    );
}

export function ScalabilityPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<ScalabilityPlanFormValues>({ resolver: zodResolver(scalabilityPlanFormSchema), defaultValues: { engagementId: "", name: "", planKey: "", scalingStrategy: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Scalability plans" description="Horizontal and vertical scaling strategies" /><div className="mt-6 space-y-3">
                {data.scalabilityPlans.length === 0 ? <EmptyState title="No scalability plans" description="Plan scalability strategies for the solution." /> : data.scalabilityPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={p.status} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create scalability plan" description="Define scaling strategy" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createScalabilityPlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <textarea {...form.register("scalingStrategy")} placeholder="Scaling strategy" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function PerformancePanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<PerformancePlanFormValues>({ resolver: zodResolver(performancePlanFormSchema), defaultValues: { engagementId: "", name: "", planKey: "", optimizationNotes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Performance plans" description="Performance targets and optimization strategies" /><div className="mt-6 space-y-3">
                {data.performancePlans.length === 0 ? <EmptyState title="No performance plans" description="Define performance targets and optimizations." /> : data.performancePlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.targetCount} targets • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create performance plan" description="Define performance targets" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPerformancePlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <textarea {...form.register("optimizationNotes")} placeholder="Optimization notes" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function TechnologyDecisionsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<TechnologyDecisionFormValues>({ resolver: zodResolver(technologyDecisionFormSchema), defaultValues: { engagementId: "", decisionKey: "", title: "", context: "", decision: "", consequences: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Technology decisions" description="Architecture decision records for technology choices" /><div className="mt-6 space-y-3">
                {data.technologyDecisions.length === 0 ? <EmptyState title="No technology decisions" description="Document technology choices and trade-offs." /> : data.technologyDecisions.map((d) => (
                    <ListCard key={d.id} title={d.title} subtitle={`${d.decisionKey} • ${d.engagementTitle}`} meta={`${d.status} • ${d.contextPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Record decision" description="Document a technology decision" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTechnologyDecision(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("decisionKey")} placeholder="Decision key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("context")} placeholder="Context" rows={2} className={inputClass} />
                <textarea {...form.register("decision")} placeholder="Decision" rows={2} className={inputClass} />
                <textarea {...form.register("consequences")} placeholder="Consequences" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Record decision" />
            </form></Card>
        </div>
    );
}

export function DeploymentPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<DeploymentArchitectureFormValues>({ resolver: zodResolver(deploymentArchitectureFormSchema), defaultValues: { engagementId: "", name: "", deploymentKey: "", infrastructure: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment architecture" description="Infrastructure and environment deployment models" /><div className="mt-6 space-y-3">
                {data.deploymentArchitectures.length === 0 ? <EmptyState title="No deployment architectures" description="Define deployment infrastructure and environments." /> : data.deploymentArchitectures.map((d) => (
                    <ListCard key={d.id} title={d.name} subtitle={`${d.deploymentKey} • ${d.engagementTitle}`} meta={`${d.environmentCount} environments • ${d.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment architecture" description="Define deployment model" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentArchitecture(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("deploymentKey")} placeholder="Deployment key" className={inputClass} />
                <textarea {...form.register("infrastructure")} placeholder="Infrastructure description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create deployment" />
            </form></Card>
        </div>
    );
}

export function SprintPlansPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<SprintPlanFormValues>({ resolver: zodResolver(sprintPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", totalSprints: 4 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sprint plans" description="Development sprint planning from architecture deliverables" /><div className="mt-6 space-y-3">
                {data.sprintPlans.length === 0 ? <EmptyState title="No sprint plans" description="Create sprint plans for development handoff." /> : data.sprintPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.totalSprints} sprints • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sprint plan" description="Plan development sprints" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSprintPlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={1} {...form.register("totalSprints", { valueAsNumber: true })} placeholder="Total sprints" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create sprint plan" />
            </form></Card>
        </div>
    );
}

export function DependenciesPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<DependencyAnalysisFormValues>({ resolver: zodResolver(dependencyAnalysisFormSchema), defaultValues: { engagementId: "", analysisKey: "", criticalPath: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Dependency analysis" description="Component dependencies and critical path analysis" /><div className="mt-6 space-y-3">
                {data.dependencyAnalyses.length === 0 ? <EmptyState title="No dependency analyses" description="Analyze component dependencies and critical paths." /> : data.dependencyAnalyses.map((d) => (
                    <ListCard key={d.id} title={d.analysisKey} subtitle={d.engagementTitle} meta={`${d.dependencyCount} dependencies • Critical: ${d.criticalPath} • ${d.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Run dependency analysis" description="Analyze component dependencies" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDependencyAnalysis(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("analysisKey")} placeholder="Analysis key" className={inputClass} />
                <textarea {...form.register("criticalPath")} placeholder="Critical path" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Run analysis" />
            </form></Card>
        </div>
    );
}

export function ReviewsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<ArchitectureReviewFormValues>({ resolver: zodResolver(architectureReviewFormSchema), defaultValues: { engagementId: "", entityType: "solution_architecture", entityId: "", reviewerId: "", comments: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Architecture reviews" description="Stakeholder review and approval for architecture artifacts" /><div className="mt-6 space-y-3">
                {data.architectureReviews.length === 0 ? <EmptyState title="No reviews" description="Submit architecture artifacts for stakeholder review." /> : data.architectureReviews.map((r) => (
                    <ListCard key={r.id} title={`${r.entityType} review`} subtitle={`${r.engagementTitle} • ${r.reviewerName ?? "Unassigned"}`} meta={`${r.reviewStatus} • ${r.comments}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Request review" description="Submit an artifact for review" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createArchitectureReview(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("entityType")} placeholder="Entity type" className={inputClass} />
                <input {...form.register("entityId")} placeholder="Entity ID" className={inputClass} />
                <select {...form.register("reviewerId")} className={inputClass}><option value="">Reviewer</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <textarea {...form.register("comments")} placeholder="Comments" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Request review" />
            </form></Card>
        </div>
    );
}

export function VersionsPanel({ data }: { data: SolutionArchitectData }) {
    const form = useForm<VersionFormValues>({ resolver: zodResolver(versionFormSchema), defaultValues: { engagementId: "", entityType: "solution_architecture", entityId: "", content: "", changeSummary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Architecture versioning" description="Version history for architecture artifacts" /><div className="mt-6 space-y-3">
                {data.versions.length === 0 ? <EmptyState title="No versions" description="Versions are created when architecture documents are updated." /> : data.versions.map((v) => (
                    <ListCard key={v.id} title={`${v.entityType} — v${v.versionNumber}`} subtitle={`${v.engagementTitle} • ${v.changeSummary}`} meta={new Date(v.createdAt).toLocaleString()} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create version" description="Publish a new architecture version" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVersion(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("entityType")} placeholder="Entity type" className={inputClass} />
                <input {...form.register("entityId")} placeholder="Entity ID" className={inputClass} />
                <textarea {...form.register("content")} placeholder="Updated content" rows={4} className={inputClass} />
                <input {...form.register("changeSummary")} placeholder="Change summary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create version" />
            </form></Card>
        </div>
    );
}

export function SaAuditPanel({ data }: { data: SolutionArchitectData }) {
    return (
        <Card hover><SectionHeader title="Solution architect audit history" description="Complete audit trail for all SA operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function SaSdkPanel({ data }: { data: SolutionArchitectData }) {
    return (
        <Card hover><SectionHeader title="Shared Solution Architect SDK" description="Import from @/src/modules/solution-architect/sdk for AI Orchestration, Knowledge, and BA integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createSolutionArchitectClient()" subtitle="Factory for module-scoped SA client with auth context" meta="Used by AI Orchestration, Knowledge, and Business Analyst modules" />
            <ListCard title="client.startEngagement()" subtitle="Start a new SA engagement linked to BA deliverables" meta={`${data.engagements.length} engagements active`} />
            <ListCard title="client.generateArtifact()" subtitle="Generate solution architecture, API contract, database schema, or technology decision" meta={`${data.solutionArchitectures.length + data.apiContracts.length + data.databaseSchemas.length + data.technologyDecisions.length} artifacts generated`} />
            <ListCard title="client.runAnalysis()" subtitle="Run dependency, build/reuse, or module selection analysis" meta={`${data.dependencyAnalyses.length + data.buildReuseRecommendations.length + data.moduleSelections.length} analyses completed`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createSolutionArchitectClient } from "@/src/modules/solution-architect/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import { createBusinessAnalystClient } from "@/src/modules/business-analyst/sdk";

const sa = createSolutionArchitectClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);
const ba = createBusinessAnalystClient(userId, email, fullName);

const baEngagement = await ba.startEngagement({ title: "CRM Migration", engagementKey: "crm-migration", agentId });
const brds = await ba.getBrds();
const saEngagement = await sa.startEngagement({ title: "CRM Architecture", engagementKey: "crm-arch", baEngagementId: baEngagement.engagementId, brdId: brds[0]?.id, agentId });
const context = await knowledge.resolveContext({ contextKey: "sa-engagement", agentId });
const artifact = await sa.generateArtifact({ engagementId: saEngagement.engagementId, artifactType: "solution_architecture", title: "CRM Solution Architecture", content: "..." });
const analysis = await sa.runAnalysis({ engagementId: saEngagement.engagementId, analysisType: "dependency", inputPayload: { components: ["api", "database", "frontend"] } });`}</pre>
        </div></Card>
    );
}
