"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import {
    ARTIFACT_TYPE_OPTIONS,
    COMPONENT_TYPE_OPTIONS,
    DOC_TYPE_OPTIONS,
    ENFORCEMENT_LEVEL_OPTIONS,
    PIPELINE_STAGE_OPTIONS,
    PLATFORM_MODULE_OPTIONS,
    REPO_TYPE_OPTIONS,
    TEST_TYPE_OPTIONS,
} from "@/src/modules/development-factory/constants";
import type { useDevelopmentFactory } from "@/src/modules/development-factory/hooks/useDevelopmentFactory";
import {
    apiScaffoldFormSchema,
    backendWorkflowFormSchema,
    buildArtifactFormSchema,
    codeReviewFormSchema,
    codingStandardFormSchema,
    componentFormSchema,
    engagementFormSchema,
    frontendWorkflowFormSchema,
    migrationPlanFormSchema,
    moduleRecommendationFormSchema,
    progressTrackingFormSchema,
    pullRequestFormSchema,
    repositoryStructureFormSchema,
    secureCodingFormSchema,
    technicalDocFormSchema,
    testScaffoldFormSchema,
    versionFormSchema,
    workPackageFormSchema,
    type ApiScaffoldFormValues,
    type BackendWorkflowFormValues,
    type BuildArtifactFormValues,
    type CodeReviewFormValues,
    type CodingStandardFormValues,
    type ComponentFormValues,
    type EngagementFormValues,
    type FrontendWorkflowFormValues,
    type MigrationPlanFormValues,
    type ModuleRecommendationFormValues,
    type ProgressTrackingFormValues,
    type PullRequestFormValues,
    type RepositoryStructureFormValues,
    type SecureCodingFormValues,
    type TechnicalDocFormValues,
    type TestScaffoldFormValues,
    type VersionFormValues,
    type WorkPackageFormValues,
} from "@/src/modules/development-factory/schemas";

type DevelopmentFactoryData = ReturnType<typeof useDevelopmentFactory>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-orange-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-orange-600">{meta}</p> : null}</div>;
}

export function DfOverviewPanel({ data }: { data: DevelopmentFactoryData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Development factory summary" description="Engagement and code generation metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Engagements" subtitle={`${data.stats?.totalEngagements ?? 0} total`} meta={`${data.stats?.activeEngagements ?? 0} active`} />
                <ListCard title="Work Packages" subtitle={`${data.stats?.workPackageCount ?? 0} packages`} meta={`${data.stats?.workflowCount ?? 0} workflows • ${data.stats?.componentCount ?? 0} components`} />
                <ListCard title="Scaffolds & Repos" subtitle={`${data.stats?.apiScaffoldCount ?? 0} API scaffolds`} meta={`${data.stats?.repositoryCount ?? 0} repositories • ${data.stats?.migrationPlanCount ?? 0} migration plans`} />
                <ListCard title="Quality & Delivery" subtitle={`${data.stats?.pendingCodeReviews ?? 0} pending reviews`} meta={`${data.stats?.buildArtifactCount ?? 0} build artifacts • ${data.stats?.versionCount ?? 0} versions`} />
            </div></Card>
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.previousWorker ?? "AI Solution Architect"} → ${pipeline?.currentWorker ?? "AI Development Factory"} → ${pipeline?.nextWorker ?? "AI QA"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as engagements progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function EngagementsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<EngagementFormValues>({ resolver: zodResolver(engagementFormSchema), defaultValues: { title: "", engagementKey: "", baEngagementId: "", saEngagementId: "", solutionArchitectureId: "", brdId: "", frsId: "", clientId: "", projectId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="DF engagements" description="Development factory engagements linked to BA and SA deliverables" /><div className="mt-6 space-y-3">
                {data.engagements.length === 0 ? <EmptyState title="No engagements" description="Start a new development factory engagement from approved architecture artifacts." /> : data.engagements.map((e) => (
                    <ListCard key={e.id} title={e.title} subtitle={`${e.engagementKey} • ${e.pipelineStage}`} meta={`${e.status}${e.baEngagementTitle ? ` • BA: ${e.baEngagementTitle}` : ""}${e.saEngagementTitle ? ` • SA: ${e.saEngagementTitle}` : ""}${e.solutionArchitectureTitle ? ` • Arch: ${e.solutionArchitectureTitle}` : ""}${e.clientName ? ` • ${e.clientName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create engagement" description="Start a new development factory engagement" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEngagement(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("engagementKey")} placeholder="Engagement key" className={inputClass} />
                <select {...form.register("baEngagementId")} className={inputClass}><option value="">BA engagement</option>{data.baEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("saEngagementId")} className={inputClass}><option value="">SA engagement</option>{data.saEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("solutionArchitectureId")} className={inputClass}><option value="">Solution architecture</option>{data.solutionArchitectureOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
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

export function WorkPackagesPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<WorkPackageFormValues>({ resolver: zodResolver(workPackageFormSchema), defaultValues: { engagementId: "", packageKey: "", title: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Work packages" description="Development work packages with deliverables" /><div className="mt-6 space-y-3">
                {data.workPackages.length === 0 ? <EmptyState title="No work packages" description="Create work packages from DF engagements." /> : data.workPackages.map((w) => (
                    <ListCard key={w.id} title={w.title} subtitle={`${w.packageKey} • ${w.engagementTitle}`} meta={`${w.status} • ${w.deliverableCount} deliverables • ${w.descriptionPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create work package" description="Define a development work package" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkPackage(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("packageKey")} placeholder="Package key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create work package" />
            </form></Card>
        </div>
    );
}

export function BackendWorkflowsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<BackendWorkflowFormValues>({ resolver: zodResolver(backendWorkflowFormSchema), defaultValues: { engagementId: "", workflowKey: "", name: "", targetModules: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Backend workflows" description="Backend development workflow definitions" /><div className="mt-6 space-y-3">
                {data.backendWorkflows.length === 0 ? <EmptyState title="No backend workflows" description="Define backend development workflows." /> : data.backendWorkflows.map((w) => (
                    <ListCard key={w.id} title={w.name} subtitle={`${w.workflowKey} • ${w.engagementTitle}`} meta={`${w.status} • ${w.stepCount} steps • ${w.targetModules}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create backend workflow" description="Define a backend workflow" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBackendWorkflow(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("workflowKey")} placeholder="Workflow key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("targetModules")} placeholder="Target modules" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create workflow" />
            </form></Card>
        </div>
    );
}

export function FrontendWorkflowsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<FrontendWorkflowFormValues>({ resolver: zodResolver(frontendWorkflowFormSchema), defaultValues: { engagementId: "", workflowKey: "", name: "", targetModules: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Frontend workflows" description="Frontend development workflow definitions" /><div className="mt-6 space-y-3">
                {data.frontendWorkflows.length === 0 ? <EmptyState title="No frontend workflows" description="Define frontend development workflows." /> : data.frontendWorkflows.map((w) => (
                    <ListCard key={w.id} title={w.name} subtitle={`${w.workflowKey} • ${w.engagementTitle}`} meta={`${w.status} • ${w.stepCount} steps • ${w.targetModules}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create frontend workflow" description="Define a frontend workflow" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFrontendWorkflow(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("workflowKey")} placeholder="Workflow key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("targetModules")} placeholder="Target modules" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create workflow" />
            </form></Card>
        </div>
    );
}

export function ApiScaffoldsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<ApiScaffoldFormValues>({ resolver: zodResolver(apiScaffoldFormSchema), defaultValues: { engagementId: "", scaffoldKey: "", name: "", scaffoldSpec: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="API scaffolds" description="Generated API endpoint scaffolds" /><div className="mt-6 space-y-3">
                {data.apiScaffolds.length === 0 ? <EmptyState title="No API scaffolds" description="Generate API scaffolds from architecture contracts." /> : data.apiScaffolds.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.scaffoldKey} • ${s.engagementTitle}`} meta={`${s.endpointCount} endpoints • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create API scaffold" description="Define an API scaffold" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApiScaffold(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("scaffoldKey")} placeholder="Scaffold key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("scaffoldSpec")} placeholder="Scaffold specification" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create scaffold" />
            </form></Card>
        </div>
    );
}

export function MigrationPlansPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<MigrationPlanFormValues>({ resolver: zodResolver(migrationPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", rollbackNotes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Migration plans" description="Database migration plans and rollback notes" /><div className="mt-6 space-y-3">
                {data.migrationPlans.length === 0 ? <EmptyState title="No migration plans" description="Create migration plans from architecture schemas." /> : data.migrationPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.migrationCount} migrations • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create migration plan" description="Define a migration plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMigrationPlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("rollbackNotes")} placeholder="Rollback notes" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function RepositoriesPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<RepositoryStructureFormValues>({ resolver: zodResolver(repositoryStructureFormSchema), defaultValues: { engagementId: "", repoKey: "", name: "", repoType: "service" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Repositories" description="Repository structure blueprints" /><div className="mt-6 space-y-3">
                {data.repositoryStructures.length === 0 ? <EmptyState title="No repositories" description="Define repository structures for generated code." /> : data.repositoryStructures.map((r) => (
                    <ListCard key={r.id} title={r.name} subtitle={`${r.repoKey} • ${r.engagementTitle}`} meta={`${REPO_TYPE_OPTIONS.find((o) => o.value === r.repoType)?.label ?? r.repoType} • ${r.structureCount} items • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create repository" description="Define a repository structure" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRepositoryStructure(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("repoKey")} placeholder="Repo key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("repoType")} className={inputClass}>{REPO_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create repository" />
            </form></Card>
        </div>
    );
}

export function ComponentsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<ComponentFormValues>({ resolver: zodResolver(componentFormSchema), defaultValues: { engagementId: "", componentKey: "", name: "", componentType: "ui", specification: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Components" description="Generated UI and service components" /><div className="mt-6 space-y-3">
                {data.components.length === 0 ? <EmptyState title="No components" description="Generate components from architecture designs." /> : data.components.map((c) => (
                    <ListCard key={c.id} title={c.name} subtitle={`${c.componentKey} • ${c.engagementTitle}`} meta={`${COMPONENT_TYPE_OPTIONS.find((o) => o.value === c.componentType)?.label ?? c.componentType} • ${c.status} • ${c.specificationPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create component" description="Define a component specification" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComponent(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("componentKey")} placeholder="Component key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("componentType")} className={inputClass}>{COMPONENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("specification")} placeholder="Specification" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create component" />
            </form></Card>
        </div>
    );
}

export function TestScaffoldsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<TestScaffoldFormValues>({ resolver: zodResolver(testScaffoldFormSchema), defaultValues: { engagementId: "", scaffoldKey: "", name: "", testType: "unit" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Test scaffolds" description="Generated test case scaffolds" /><div className="mt-6 space-y-3">
                {data.testScaffolds.length === 0 ? <EmptyState title="No test scaffolds" description="Generate test scaffolds for components and services." /> : data.testScaffolds.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.scaffoldKey} • ${s.engagementTitle}`} meta={`${TEST_TYPE_OPTIONS.find((o) => o.value === s.testType)?.label ?? s.testType} • ${s.testCaseCount} cases • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create test scaffold" description="Define a test scaffold" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTestScaffold(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("scaffoldKey")} placeholder="Scaffold key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("testType")} className={inputClass}>{TEST_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create test scaffold" />
            </form></Card>
        </div>
    );
}

export function CodingStandardsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<CodingStandardFormValues>({ resolver: zodResolver(codingStandardFormSchema), defaultValues: { engagementId: "", standardKey: "", name: "", enforcementLevel: "required" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Coding standards" description="Enforced coding standards and rules" /><div className="mt-6 space-y-3">
                {data.codingStandards.length === 0 ? <EmptyState title="No coding standards" description="Define coding standards for generated code." /> : data.codingStandards.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.standardKey} • ${s.engagementTitle}`} meta={`${ENFORCEMENT_LEVEL_OPTIONS.find((o) => o.value === s.enforcementLevel)?.label ?? s.enforcementLevel} • ${s.ruleCount} rules • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create coding standard" description="Define a coding standard" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCodingStandard(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("standardKey")} placeholder="Standard key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("enforcementLevel")} className={inputClass}>{ENFORCEMENT_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create standard" />
            </form></Card>
        </div>
    );
}

export function SecureCodingPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<SecureCodingFormValues>({ resolver: zodResolver(secureCodingFormSchema), defaultValues: { engagementId: "", validationKey: "", name: "", findings: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Secure coding validations" description="Security validation checks and findings" /><div className="mt-6 space-y-3">
                {data.secureCodingValidations.length === 0 ? <EmptyState title="No secure coding validations" description="Run secure coding analysis on generated code." /> : data.secureCodingValidations.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.validationKey} • ${v.engagementTitle}`} meta={`${v.checkCount} checks • ${v.status} • ${v.findingsPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create validation" description="Record a secure coding validation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecureCodingValidation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("findings")} placeholder="Findings" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create validation" />
            </form></Card>
        </div>
    );
}

export function ModuleRecommendationsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<ModuleRecommendationFormValues>({ resolver: zodResolver(moduleRecommendationFormSchema), defaultValues: { engagementId: "", recommendationKey: "", moduleName: "", platformModule: "", rationale: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module recommendations" description="Platform module reuse recommendations" /><div className="mt-6 space-y-3">
                {data.moduleRecommendations.length === 0 ? <EmptyState title="No module recommendations" description="Analyze architecture for module reuse opportunities." /> : data.moduleRecommendations.map((m) => (
                    <ListCard key={m.id} title={m.moduleName} subtitle={`${m.recommendationKey} • ${m.engagementTitle}`} meta={`${PLATFORM_MODULE_OPTIONS.find((o) => o.value === m.platformModule)?.label ?? m.platformModule} • ${m.status} • ${m.rationalePreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add recommendation" description="Recommend a platform module" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModuleRecommendation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("recommendationKey")} placeholder="Recommendation key" className={inputClass} />
                <input {...form.register("moduleName")} placeholder="Module name" className={inputClass} />
                <select {...form.register("platformModule")} className={inputClass}><option value="">Platform module</option>{PLATFORM_MODULE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("rationale")} placeholder="Rationale" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add recommendation" />
            </form></Card>
        </div>
    );
}

export function PullRequestsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<PullRequestFormValues>({ resolver: zodResolver(pullRequestFormSchema), defaultValues: { engagementId: "", prKey: "", title: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pull requests" description="Generated pull requests with changed files" /><div className="mt-6 space-y-3">
                {data.pullRequests.length === 0 ? <EmptyState title="No pull requests" description="Pull requests will appear as code is generated." /> : data.pullRequests.map((p) => (
                    <ListCard key={p.id} title={p.title} subtitle={`${p.prKey} • ${p.engagementTitle}`} meta={`${p.changedFileCount} files • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pull request" description="Record a generated pull request" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPullRequest(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("prKey")} placeholder="PR key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create pull request" />
            </form></Card>
        </div>
    );
}

export function CodeReviewsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<CodeReviewFormValues>({ resolver: zodResolver(codeReviewFormSchema), defaultValues: { engagementId: "", reviewKey: "", title: "", reviewerId: "", comments: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Code reviews" description="Code review checklists and reviewer feedback" /><div className="mt-6 space-y-3">
                {data.codeReviews.length === 0 ? <EmptyState title="No code reviews" description="Submit generated code for review." /> : data.codeReviews.map((r) => (
                    <ListCard key={r.id} title={r.title} subtitle={`${r.reviewKey} • ${r.engagementTitle} • ${r.reviewerName ?? "Unassigned"}`} meta={`${r.reviewStatus} • ${r.checklistCount} checklist items`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Request code review" description="Submit code for review" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCodeReview(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("reviewKey")} placeholder="Review key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("reviewerId")} className={inputClass}><option value="">Reviewer</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <textarea {...form.register("comments")} placeholder="Comments" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Request review" />
            </form></Card>
        </div>
    );
}

export function TechnicalDocsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<TechnicalDocFormValues>({ resolver: zodResolver(technicalDocFormSchema), defaultValues: { engagementId: "", docKey: "", title: "", docType: "technical", content: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Technical docs" description="Generated technical documentation" /><div className="mt-6 space-y-3">
                {data.technicalDocs.length === 0 ? <EmptyState title="No technical docs" description="Generate technical documentation from code artifacts." /> : data.technicalDocs.map((d) => (
                    <ListCard key={d.id} title={d.title} subtitle={`${d.docKey} • ${d.engagementTitle}`} meta={`${DOC_TYPE_OPTIONS.find((o) => o.value === d.docType)?.label ?? d.docType} • ${d.status} • ${d.contentPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create technical doc" description="Define a technical document" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTechnicalDoc(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("docKey")} placeholder="Doc key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("docType")} className={inputClass}>{DOC_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("content")} placeholder="Content" rows={4} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create doc" />
            </form></Card>
        </div>
    );
}

export function ProgressPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<ProgressTrackingFormValues>({ resolver: zodResolver(progressTrackingFormSchema), defaultValues: { engagementId: "", trackingKey: "", milestone: "", progressPercent: 0, notes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Progress tracking" description="Development milestone progress" /><div className="mt-6 space-y-3">
                {data.progressTracking.length === 0 ? <EmptyState title="No progress entries" description="Track development milestones and progress." /> : data.progressTracking.map((p) => (
                    <ListCard key={p.id} title={p.milestone} subtitle={`${p.trackingKey} • ${p.engagementTitle}`} meta={`${p.progressPercent}% • ${p.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add progress milestone" description="Track a development milestone" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProgressTracking(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("trackingKey")} placeholder="Tracking key" className={inputClass} />
                <input {...form.register("milestone")} placeholder="Milestone" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("progressPercent", { valueAsNumber: true })} placeholder="Progress %" className={inputClass} />
                <textarea {...form.register("notes")} placeholder="Notes" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add milestone" />
            </form></Card>
        </div>
    );
}

export function BuildArtifactsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<BuildArtifactFormValues>({ resolver: zodResolver(buildArtifactFormSchema), defaultValues: { engagementId: "", artifactKey: "", name: "", artifactType: "build", artifactPath: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Build artifacts" description="Generated build outputs and bundles" /><div className="mt-6 space-y-3">
                {data.buildArtifacts.length === 0 ? <EmptyState title="No build artifacts" description="Build artifacts will appear after code generation runs." /> : data.buildArtifacts.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.artifactKey} • ${a.engagementTitle}`} meta={`${ARTIFACT_TYPE_OPTIONS.find((o) => o.value === a.artifactType)?.label ?? a.artifactType} • ${a.artifactPath} • ${a.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Record build artifact" description="Record a generated build artifact" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBuildArtifact(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("artifactKey")} placeholder="Artifact key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("artifactType")} className={inputClass}>{ARTIFACT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("artifactPath")} placeholder="Artifact path" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Record artifact" />
            </form></Card>
        </div>
    );
}

export function VersionsPanel({ data }: { data: DevelopmentFactoryData }) {
    const form = useForm<VersionFormValues>({ resolver: zodResolver(versionFormSchema), defaultValues: { engagementId: "", entityType: "work_package", entityId: "", content: "", changeSummary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Development versioning" description="Version history for development artifacts" /><div className="mt-6 space-y-3">
                {data.versions.length === 0 ? <EmptyState title="No versions" description="Versions are created when development artifacts are updated." /> : data.versions.map((v) => (
                    <ListCard key={v.id} title={`${v.entityType} — v${v.versionNumber}`} subtitle={`${v.engagementTitle} • ${v.changeSummary}`} meta={new Date(v.createdAt).toLocaleString()} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create version" description="Publish a new artifact version" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVersion(v))}>
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

export function DfAuditPanel({ data }: { data: DevelopmentFactoryData }) {
    return (
        <Card hover><SectionHeader title="Development factory audit history" description="Complete audit trail for all DF operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function DfSdkPanel({ data }: { data: DevelopmentFactoryData }) {
    return (
        <Card hover><SectionHeader title="Shared Development Factory SDK" description="Import from @/src/modules/development-factory/sdk for AI Orchestration, Knowledge, Business Analyst, and Solution Architect integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createDevelopmentFactoryClient()" subtitle="Factory for module-scoped DF client with auth context" meta="Used by AI Orchestration, Knowledge, Business Analyst, and Solution Architect modules" />
            <ListCard title="client.startEngagement()" subtitle="Start a new DF engagement linked to BA and SA deliverables" meta={`${data.engagements.length} engagements active`} />
            <ListCard title="client.generateArtifact()" subtitle="Generate work package, API scaffold, component, or technical doc" meta={`${data.workPackages.length + data.apiScaffolds.length + data.components.length + data.technicalDocs.length} artifacts generated`} />
            <ListCard title="client.runAnalysis()" subtitle="Run secure coding, coding standards, or module recommendation analysis" meta={`${data.secureCodingValidations.length + data.codingStandards.length + data.moduleRecommendations.length} analyses completed`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createDevelopmentFactoryClient } from "@/src/modules/development-factory/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import { createBusinessAnalystClient } from "@/src/modules/business-analyst/sdk";
import { createSolutionArchitectClient } from "@/src/modules/solution-architect/sdk";

const df = createDevelopmentFactoryClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);
const ba = createBusinessAnalystClient(userId, email, fullName);
const sa = createSolutionArchitectClient(userId, email, fullName);

const baEngagement = await ba.startEngagement({ title: "CRM Migration", engagementKey: "crm-migration", agentId });
const saEngagement = await sa.startEngagement({ title: "CRM Architecture", engagementKey: "crm-arch", baEngagementId: baEngagement.engagementId, agentId });
const architectures = await sa.getSolutionArchitectures();
const dfEngagement = await df.startEngagement({ title: "CRM Development", engagementKey: "crm-dev", baEngagementId: baEngagement.engagementId, saEngagementId: saEngagement.engagementId, solutionArchitectureId: architectures[0]?.id, agentId });
const context = await knowledge.resolveContext({ contextKey: "df-crm-dev", agentId });
const artifact = await df.generateArtifact({ engagementId: dfEngagement.engagementId, artifactType: "work_package", title: "CRM Backend Module", content: "..." });
const analysis = await df.runAnalysis({ engagementId: dfEngagement.engagementId, analysisType: "secure_coding", inputPayload: { validationKey: "SEC-001", name: "Auth Module Scan" } });`}</pre>
        </div></Card>
    );
}
