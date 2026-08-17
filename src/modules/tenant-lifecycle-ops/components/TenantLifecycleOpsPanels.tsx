"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { TLO_THEME, LIFECYCLE_STAGE_OPTIONS, INDUSTRY_PACK_OPTIONS, SEVERITY_OPTIONS } from "@/src/modules/tenant-lifecycle-ops/constants";
import type { useTenantLifecycleOps } from "@/src/modules/tenant-lifecycle-ops/hooks/useTenantLifecycleOps";
import {
    tenantContextFormSchema,
    lifecycleRecordFormSchema,
    lifecycleTransitionFormSchema,
    lifecycleEventFormSchema,
    reactivationRequestFormSchema,
    workspaceFormSchema,
    environmentSettingFormSchema,
    storageManagementFormSchema,
    operationsControlFormSchema,
    onboardingFlowFormSchema,
    onboardingProgressFormSchema,
    onboardingValidationFormSchema,
    goLiveChecklistFormSchema,
    marketplaceModuleFormSchema,
    moduleInstallationFormSchema,
    moduleDependencyFormSchema,
    moduleCompatibilityFormSchema,
    industryPackFormSchema,
    packInstallationFormSchema,
    packVersionFormSchema,
    packExportFormSchema,
    healthSnapshotFormSchema,
    healthDimensionFormSchema,
    healthRiskFormSchema,
    healthScoreFormSchema,
    successPlanFormSchema,
    quarterlyReviewFormSchema,
    renewalPlanFormSchema,
    customerMilestoneFormSchema,
    commercialMetricFormSchema,
    growthSnapshotFormSchema,
    expansionOpportunityFormSchema,
    type tenantContextFormValues,
    type lifecycleRecordFormValues,
    type lifecycleTransitionFormValues,
    type lifecycleEventFormValues,
    type reactivationRequestFormValues,
    type workspaceFormValues,
    type environmentSettingFormValues,
    type storageManagementFormValues,
    type operationsControlFormValues,
    type onboardingFlowFormValues,
    type onboardingProgressFormValues,
    type onboardingValidationFormValues,
    type goLiveChecklistFormValues,
    type marketplaceModuleFormValues,
    type moduleInstallationFormValues,
    type moduleDependencyFormValues,
    type moduleCompatibilityFormValues,
    type industryPackFormValues,
    type packInstallationFormValues,
    type packVersionFormValues,
    type packExportFormValues,
    type healthSnapshotFormValues,
    type healthDimensionFormValues,
    type healthRiskFormValues,
    type healthScoreFormValues,
    type successPlanFormValues,
    type quarterlyReviewFormValues,
    type renewalPlanFormValues,
    type customerMilestoneFormValues,
    type commercialMetricFormValues,
    type growthSnapshotFormValues,
    type expansionOpportunityFormValues,
} from "@/src/modules/tenant-lifecycle-ops/schemas";

type TenantLifecycleOpsData = ReturnType<typeof useTenantLifecycleOps>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}</div>;
}
function TenantContextSelect({ data, ...props }: { data: TenantLifecycleOpsData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select tenant context</option>{data.tenantContextOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function TenantLifecycleOpsOverviewPanel({ data }: { data: TenantLifecycleOpsData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Tenant Lifecycle summary" description="Customer lifecycle, operations, onboarding, marketplace, health, and commercial growth" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Tenant Contexts" subtitle={`${data.stats?.totalTenantContexts ?? 0} total`} meta={`${data.stats?.activeTenantContexts ?? 0} active • ${data.stats?.lifecycleRecordCount ?? 0} lifecycle records`} />
                <ListCard title="Onboarding & Reactivation" subtitle={`${data.stats?.onboardingInProgressCount ?? 0} in progress`} meta={`${data.stats?.openReactivationCount ?? 0} pending reactivations`} />
                <ListCard title="Marketplace & Packs" subtitle={`${data.stats?.marketplaceModuleCount ?? 0} modules`} meta={`${data.stats?.industryPackCount ?? 0} industry packs`} />
                <ListCard title="Health & Growth" subtitle={`${(data.stats?.avgHealthScore ?? 0).toFixed(0)} avg health`} meta={`${data.stats?.openExpansionCount ?? 0} expansion opportunities • ${data.stats?.auditCount ?? 0} audit entries`} />
            </div></Card>
            <Card hover><SectionHeader title="Lifecycle pipeline" description={`${pipeline?.previousStage ?? "trial"} → ${pipeline?.currentStage ?? "onboarding"} → ${pipeline?.nextStage ?? "active"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Lifecycle pipeline stages will appear as tenant contexts progress." />}
            </div></Card>
        </div>
    );
}

export function TenantContextsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<tenantContextFormValues>({ resolver: zodResolver(tenantContextFormSchema), defaultValues: { contextKey: "", companyName: "", lifecycleStage: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tenant Contexts" description="Tenant lifecycle tenant contexts" /><div className="mt-6 space-y-3">
                {data.tenantContexts.length === 0 ? <EmptyState title="No tenant contexts" description="Create the first tenant contexts record." /> : data.tenantContexts.map((item) => (
                    <ListCard key={item.id} title={String(item.companyName)} subtitle={`${item.contextKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tenant context" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantContext(v))}>
                <input {...form.register("contextKey")} placeholder="Context key" className={inputClass} />
                <input {...form.register("companyName")} placeholder="Company name" className={inputClass} />
                <select {...form.register("lifecycleStage")} className={inputClass}>{LIFECYCLE_STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LifecycleRecordsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<lifecycleRecordFormValues>({ resolver: zodResolver(lifecycleRecordFormSchema), defaultValues: { tenantContextId: "", recordKey: "", currentStage: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lifecycle Records" description="Tenant lifecycle lifecycle records" /><div className="mt-6 space-y-3">
                {data.lifecycleRecords.length === 0 ? <EmptyState title="No lifecycle records" description="Create the first lifecycle records record." /> : data.lifecycleRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.recordKey)} subtitle={`${item.tenantContextName} • ${item.recordKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lifecycle record" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLifecycleRecord(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("recordKey")} placeholder="Record key" className={inputClass} />
                <select {...form.register("currentStage")} className={inputClass}>{LIFECYCLE_STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LifecycleTransitionsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<lifecycleTransitionFormValues>({ resolver: zodResolver(lifecycleTransitionFormSchema), defaultValues: { tenantContextId: "", transitionKey: "", fromStage: "", toStage: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lifecycle Transitions" description="Tenant lifecycle lifecycle transitions" /><div className="mt-6 space-y-3">
                {data.lifecycleTransitions.length === 0 ? <EmptyState title="No lifecycle transitions" description="Create the first lifecycle transitions record." /> : data.lifecycleTransitions.map((item) => (
                    <ListCard key={item.id} title={String(item.transitionKey)} subtitle={`${item.tenantContextName} • ${item.transitionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lifecycle transition" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLifecycleTransition(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("transitionKey")} placeholder="Transition key" className={inputClass} />
                <select {...form.register("fromStage")} className={inputClass}>{LIFECYCLE_STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("toStage")} className={inputClass}>{LIFECYCLE_STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LifecycleEventsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<lifecycleEventFormValues>({ resolver: zodResolver(lifecycleEventFormSchema), defaultValues: { tenantContextId: "", eventKey: "", eventType: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lifecycle Events" description="Tenant lifecycle lifecycle events" /><div className="mt-6 space-y-3">
                {data.lifecycleEvents.length === 0 ? <EmptyState title="No lifecycle events" description="Create the first lifecycle events record." /> : data.lifecycleEvents.map((item) => (
                    <ListCard key={item.id} title={String(item.eventKey)} subtitle={`${item.tenantContextName} • ${item.eventKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lifecycle event" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLifecycleEvent(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("eventKey")} placeholder="Event key" className={inputClass} />
                <input {...form.register("eventType")} placeholder="Event type" className={inputClass} />
                <input {...form.register("summary")} placeholder="Summary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReactivationRequestsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<reactivationRequestFormValues>({ resolver: zodResolver(reactivationRequestFormSchema), defaultValues: { tenantContextId: "", requestKey: "", targetStage: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reactivation Requests" description="Tenant lifecycle reactivation requests" /><div className="mt-6 space-y-3">
                {data.reactivationRequests.length === 0 ? <EmptyState title="No reactivation requests" description="Create the first reactivation requests record." /> : data.reactivationRequests.map((item) => (
                    <ListCard key={item.id} title={String(item.requestKey)} subtitle={`${item.tenantContextName} • ${item.requestKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create reactivation request" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReactivationRequest(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("requestKey")} placeholder="Request key" className={inputClass} />
                <select {...form.register("targetStage")} className={inputClass}>{LIFECYCLE_STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkspacesPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<workspaceFormValues>({ resolver: zodResolver(workspaceFormSchema), defaultValues: { tenantContextId: "", workspaceKey: "", workspaceName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workspaces" description="Tenant lifecycle workspaces" /><div className="mt-6 space-y-3">
                {data.workspaces.length === 0 ? <EmptyState title="No workspaces" description="Create the first workspaces record." /> : data.workspaces.map((item) => (
                    <ListCard key={item.id} title={String(item.workspaceName)} subtitle={`${item.tenantContextName} • ${item.workspaceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workspace" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkspace(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("workspaceKey")} placeholder="Workspace key" className={inputClass} />
                <input {...form.register("workspaceName")} placeholder="Workspace name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EnvironmentSettingsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<environmentSettingFormValues>({ resolver: zodResolver(environmentSettingFormSchema), defaultValues: { tenantContextId: "", settingKey: "", environmentName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Environment Settings" description="Tenant lifecycle environment settings" /><div className="mt-6 space-y-3">
                {data.environmentSettings.length === 0 ? <EmptyState title="No environment settings" description="Create the first environment settings record." /> : data.environmentSettings.map((item) => (
                    <ListCard key={item.id} title={String(item.settingKey)} subtitle={`${item.tenantContextName} • ${item.settingKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create environment setting" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEnvironmentSetting(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("settingKey")} placeholder="Setting key" className={inputClass} />
                <input {...form.register("environmentName")} placeholder="Environment name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StorageManagementsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<storageManagementFormValues>({ resolver: zodResolver(storageManagementFormSchema), defaultValues: { tenantContextId: "", storageKey: "", storageType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Storage Management" description="Tenant lifecycle storage management" /><div className="mt-6 space-y-3">
                {data.storageManagement.length === 0 ? <EmptyState title="No storage management" description="Create the first storage management record." /> : data.storageManagement.map((item) => (
                    <ListCard key={item.id} title={String(item.storageKey)} subtitle={`${item.tenantContextName} • ${item.storageKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create storage management" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStorageManagement(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("storageKey")} placeholder="Storage key" className={inputClass} />
                <input {...form.register("storageType")} placeholder="Storage type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationsControlsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<operationsControlFormValues>({ resolver: zodResolver(operationsControlFormSchema), defaultValues: { tenantContextId: "", controlKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Controls" description="Tenant lifecycle operations controls" /><div className="mt-6 space-y-3">
                {data.operationsControls.length === 0 ? <EmptyState title="No operations controls" description="Create the first operations controls record." /> : data.operationsControls.map((item) => (
                    <ListCard key={item.id} title={String(item.controlKey)} subtitle={`${item.tenantContextName} • ${item.controlKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operations control" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationsControl(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("controlKey")} placeholder="Control key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OnboardingFlowsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<onboardingFlowFormValues>({ resolver: zodResolver(onboardingFlowFormSchema), defaultValues: { tenantContextId: "", flowKey: "", flowName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Onboarding Flows" description="Tenant lifecycle onboarding flows" /><div className="mt-6 space-y-3">
                {data.onboardingFlows.length === 0 ? <EmptyState title="No onboarding flows" description="Create the first onboarding flows record." /> : data.onboardingFlows.map((item) => (
                    <ListCard key={item.id} title={String(item.flowName)} subtitle={`${item.tenantContextName} • ${item.flowKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create onboarding flow" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOnboardingFlow(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("flowKey")} placeholder="Flow key" className={inputClass} />
                <input {...form.register("flowName")} placeholder="Flow name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OnboardingProgressPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<onboardingProgressFormValues>({ resolver: zodResolver(onboardingProgressFormSchema), defaultValues: { tenantContextId: "", progressKey: "", currentStep: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Onboarding Progress" description="Tenant lifecycle onboarding progress" /><div className="mt-6 space-y-3">
                {data.onboardingProgress.length === 0 ? <EmptyState title="No onboarding progress" description="Create the first onboarding progress record." /> : data.onboardingProgress.map((item) => (
                    <ListCard key={item.id} title={String(item.progressKey)} subtitle={`${item.tenantContextName} • ${item.progressKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create onboarding progres" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOnboardingProgress(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("progressKey")} placeholder="Progress key" className={inputClass} />
                <input {...form.register("currentStep")} placeholder="Current step" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OnboardingValidationsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<onboardingValidationFormValues>({ resolver: zodResolver(onboardingValidationFormSchema), defaultValues: { tenantContextId: "", validationKey: "", ruleName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Onboarding Validations" description="Tenant lifecycle onboarding validations" /><div className="mt-6 space-y-3">
                {data.onboardingValidations.length === 0 ? <EmptyState title="No onboarding validations" description="Create the first onboarding validations record." /> : data.onboardingValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.tenantContextName} • ${item.validationKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create onboarding validation" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOnboardingValidation(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="Rule name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GoLiveChecklistsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<goLiveChecklistFormValues>({ resolver: zodResolver(goLiveChecklistFormSchema), defaultValues: { tenantContextId: "", checklistKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Go-Live Checklists" description="Tenant lifecycle go-live checklists" /><div className="mt-6 space-y-3">
                {data.goLiveChecklists.length === 0 ? <EmptyState title="No go-live checklists" description="Create the first go-live checklists record." /> : data.goLiveChecklists.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.tenantContextName} • ${item.checklistKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create go-live checklist" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGoLiveChecklist(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("checklistKey")} placeholder="Checklist key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MarketplaceModulesPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<marketplaceModuleFormValues>({ resolver: zodResolver(marketplaceModuleFormSchema), defaultValues: { tenantContextId: "", moduleKey: "", moduleName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Marketplace Modules" description="Tenant lifecycle marketplace modules" /><div className="mt-6 space-y-3">
                {data.marketplaceModules.length === 0 ? <EmptyState title="No marketplace modules" description="Create the first marketplace modules record." /> : data.marketplaceModules.map((item) => (
                    <ListCard key={item.id} title={String(item.moduleName)} subtitle={`${item.tenantContextName} • ${item.moduleKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create marketplace module" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMarketplaceModule(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("moduleKey")} placeholder="Module key" className={inputClass} />
                <input {...form.register("moduleName")} placeholder="Module name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ModuleInstallationsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<moduleInstallationFormValues>({ resolver: zodResolver(moduleInstallationFormSchema), defaultValues: { tenantContextId: "", installationKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module Installations" description="Tenant lifecycle module installations" /><div className="mt-6 space-y-3">
                {data.moduleInstallations.length === 0 ? <EmptyState title="No module installations" description="Create the first module installations record." /> : data.moduleInstallations.map((item) => (
                    <ListCard key={item.id} title={String(item.installationKey)} subtitle={`${item.tenantContextName} • ${item.installationKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create module installation" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModuleInstallation(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("installationKey")} placeholder="Installation key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ModuleDependencysPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<moduleDependencyFormValues>({ resolver: zodResolver(moduleDependencyFormSchema), defaultValues: { tenantContextId: "", dependencyKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module Dependencies" description="Tenant lifecycle module dependencies" /><div className="mt-6 space-y-3">
                {data.moduleDependencies.length === 0 ? <EmptyState title="No module dependencies" description="Create the first module dependencies record." /> : data.moduleDependencies.map((item) => (
                    <ListCard key={item.id} title={String(item.dependencyKey)} subtitle={`${item.tenantContextName} • ${item.dependencyKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create module dependencie" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModuleDependency(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("dependencyKey")} placeholder="Dependency key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ModuleCompatibilitysPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<moduleCompatibilityFormValues>({ resolver: zodResolver(moduleCompatibilityFormSchema), defaultValues: { tenantContextId: "", compatibilityKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module Compatibility" description="Tenant lifecycle module compatibility" /><div className="mt-6 space-y-3">
                {data.moduleCompatibility.length === 0 ? <EmptyState title="No module compatibility" description="Create the first module compatibility record." /> : data.moduleCompatibility.map((item) => (
                    <ListCard key={item.id} title={String(item.compatibilityKey)} subtitle={`${item.tenantContextName} • ${item.compatibilityKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create module compatibility" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModuleCompatibility(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("compatibilityKey")} placeholder="Compatibility key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryPacksPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<industryPackFormValues>({ resolver: zodResolver(industryPackFormSchema), defaultValues: { tenantContextId: "", packKey: "", packName: "", industry: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Packs" description="Tenant lifecycle industry packs" /><div className="mt-6 space-y-3">
                {data.industryPacks.length === 0 ? <EmptyState title="No industry packs" description="Create the first industry packs record." /> : data.industryPacks.map((item) => (
                    <ListCard key={item.id} title={String(item.packName)} subtitle={`${item.tenantContextName} • ${item.packKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry pack" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryPack(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("packKey")} placeholder="Pack key" className={inputClass} />
                <input {...form.register("packName")} placeholder="Pack name" className={inputClass} />
                <select {...form.register("industry")} className={inputClass}>{INDUSTRY_PACK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PackInstallationsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<packInstallationFormValues>({ resolver: zodResolver(packInstallationFormSchema), defaultValues: { tenantContextId: "", installationKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pack Installations" description="Tenant lifecycle pack installations" /><div className="mt-6 space-y-3">
                {data.packInstallations.length === 0 ? <EmptyState title="No pack installations" description="Create the first pack installations record." /> : data.packInstallations.map((item) => (
                    <ListCard key={item.id} title={String(item.installationKey)} subtitle={`${item.tenantContextName} • ${item.installationKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pack installation" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPackInstallation(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("installationKey")} placeholder="Installation key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PackVersionsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<packVersionFormValues>({ resolver: zodResolver(packVersionFormSchema), defaultValues: { tenantContextId: "", versionKey: "", versionNumber: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pack Versions" description="Tenant lifecycle pack versions" /><div className="mt-6 space-y-3">
                {data.packVersions.length === 0 ? <EmptyState title="No pack versions" description="Create the first pack versions record." /> : data.packVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.tenantContextName} • ${item.versionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pack version" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPackVersion(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("versionKey")} placeholder="Version key" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="Version number" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PackExportsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<packExportFormValues>({ resolver: zodResolver(packExportFormSchema), defaultValues: { tenantContextId: "", exportKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pack Exports" description="Tenant lifecycle pack exports" /><div className="mt-6 space-y-3">
                {data.packExports.length === 0 ? <EmptyState title="No pack exports" description="Create the first pack exports record." /> : data.packExports.map((item) => (
                    <ListCard key={item.id} title={String(item.exportKey)} subtitle={`${item.tenantContextName} • ${item.exportKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pack export" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPackExport(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("exportKey")} placeholder="Export key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HealthSnapshotsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<healthSnapshotFormValues>({ resolver: zodResolver(healthSnapshotFormSchema), defaultValues: { tenantContextId: "", snapshotKey: "", overallScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health Snapshots" description="Tenant lifecycle health snapshots" /><div className="mt-6 space-y-3">
                {data.healthSnapshots.length === 0 ? <EmptyState title="No health snapshots" description="Create the first health snapshots record." /> : data.healthSnapshots.map((item) => (
                    <ListCard key={item.id} title={String(item.snapshotKey)} subtitle={`${item.tenantContextName} • ${item.snapshotKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health snapshot" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHealthSnapshot(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("snapshotKey")} placeholder="Snapshot key" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="Overall score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HealthDimensionsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<healthDimensionFormValues>({ resolver: zodResolver(healthDimensionFormSchema), defaultValues: { tenantContextId: "", dimensionKey: "", dimensionName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health Dimensions" description="Tenant lifecycle health dimensions" /><div className="mt-6 space-y-3">
                {data.healthDimensions.length === 0 ? <EmptyState title="No health dimensions" description="Create the first health dimensions record." /> : data.healthDimensions.map((item) => (
                    <ListCard key={item.id} title={String(item.dimensionName)} subtitle={`${item.tenantContextName} • ${item.dimensionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health dimension" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHealthDimension(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("dimensionKey")} placeholder="Dimension key" className={inputClass} />
                <input {...form.register("dimensionName")} placeholder="Dimension name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HealthRisksPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<healthRiskFormValues>({ resolver: zodResolver(healthRiskFormSchema), defaultValues: { tenantContextId: "", riskKey: "", title: "", severity: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health Risks" description="Tenant lifecycle health risks" /><div className="mt-6 space-y-3">
                {data.healthRisks.length === 0 ? <EmptyState title="No health risks" description="Create the first health risks record." /> : data.healthRisks.map((item) => (
                    <ListCard key={item.id} title={String(item.title)} subtitle={`${item.tenantContextName} • ${item.riskKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health risk" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHealthRisk(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("riskKey")} placeholder="Risk key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("severity")} className={inputClass}>{SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HealthScoresPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<healthScoreFormValues>({ resolver: zodResolver(healthScoreFormSchema), defaultValues: { tenantContextId: "", scoreKey: "", scoreValue: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health Scores" description="Tenant lifecycle health scores" /><div className="mt-6 space-y-3">
                {data.healthScores.length === 0 ? <EmptyState title="No health scores" description="Create the first health scores record." /> : data.healthScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreKey)} subtitle={`${item.tenantContextName} • ${item.scoreKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health score" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHealthScore(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("scoreKey")} placeholder="Score key" className={inputClass} />
                <input type="number" step="any" {...form.register("scoreValue", { valueAsNumber: true })} placeholder="Score value" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SuccessPlansPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<successPlanFormValues>({ resolver: zodResolver(successPlanFormSchema), defaultValues: { tenantContextId: "", planKey: "", planName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Success Plans" description="Tenant lifecycle success plans" /><div className="mt-6 space-y-3">
                {data.successPlans.length === 0 ? <EmptyState title="No success plans" description="Create the first success plans record." /> : data.successPlans.map((item) => (
                    <ListCard key={item.id} title={String(item.planName)} subtitle={`${item.tenantContextName} • ${item.planKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create success plan" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSuccessPlan(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("planName")} placeholder="Plan name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function QuarterlyReviewsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<quarterlyReviewFormValues>({ resolver: zodResolver(quarterlyReviewFormSchema), defaultValues: { tenantContextId: "", reviewKey: "", quarter: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Quarterly Reviews" description="Tenant lifecycle quarterly reviews" /><div className="mt-6 space-y-3">
                {data.quarterlyReviews.length === 0 ? <EmptyState title="No quarterly reviews" description="Create the first quarterly reviews record." /> : data.quarterlyReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewKey)} subtitle={`${item.tenantContextName} • ${item.reviewKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create quarterly review" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createQuarterlyReview(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("reviewKey")} placeholder="Review key" className={inputClass} />
                <input {...form.register("quarter")} placeholder="Quarter" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenewalPlansPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<renewalPlanFormValues>({ resolver: zodResolver(renewalPlanFormSchema), defaultValues: { tenantContextId: "", renewalKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal Plans" description="Tenant lifecycle renewal plans" /><div className="mt-6 space-y-3">
                {data.renewalPlans.length === 0 ? <EmptyState title="No renewal plans" description="Create the first renewal plans record." /> : data.renewalPlans.map((item) => (
                    <ListCard key={item.id} title={String(item.renewalKey)} subtitle={`${item.tenantContextName} • ${item.renewalKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal plan" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalPlan(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("renewalKey")} placeholder="Renewal key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerMilestonesPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<customerMilestoneFormValues>({ resolver: zodResolver(customerMilestoneFormSchema), defaultValues: { tenantContextId: "", milestoneKey: "", milestoneName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Milestones" description="Tenant lifecycle customer milestones" /><div className="mt-6 space-y-3">
                {data.customerMilestones.length === 0 ? <EmptyState title="No customer milestones" description="Create the first customer milestones record." /> : data.customerMilestones.map((item) => (
                    <ListCard key={item.id} title={String(item.milestoneName)} subtitle={`${item.tenantContextName} • ${item.milestoneKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer milestone" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerMilestone(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("milestoneKey")} placeholder="Milestone key" className={inputClass} />
                <input {...form.register("milestoneName")} placeholder="Milestone name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CommercialMetricsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<commercialMetricFormValues>({ resolver: zodResolver(commercialMetricFormSchema), defaultValues: { metricsKey: "", totalTenants: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Commercial Metrics" description="Tenant lifecycle commercial metrics" /><div className="mt-6 space-y-3">
                {data.commercialMetrics.length === 0 ? <EmptyState title="No commercial metrics" description="Create the first commercial metrics record." /> : data.commercialMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.metricsKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create commercial metric" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommercialMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <input type="number" step="any" {...form.register("totalTenants", { valueAsNumber: true })} placeholder="Total tenants" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthSnapshotsPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<growthSnapshotFormValues>({ resolver: zodResolver(growthSnapshotFormSchema), defaultValues: { snapshotKey: "", growthRatePercent: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Snapshots" description="Tenant lifecycle growth snapshots" /><div className="mt-6 space-y-3">
                {data.growthSnapshots.length === 0 ? <EmptyState title="No growth snapshots" description="Create the first growth snapshots record." /> : data.growthSnapshots.map((item) => (
                    <ListCard key={item.id} title={String(item.snapshotKey)} subtitle={`${item.snapshotKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth snapshot" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthSnapshot(v))}>
                <input {...form.register("snapshotKey")} placeholder="Snapshot key" className={inputClass} />
                <input type="number" step="any" {...form.register("growthRatePercent", { valueAsNumber: true })} placeholder="Growth rate %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExpansionOpportunitiesPanel({ data }: { data: TenantLifecycleOpsData }) {
    const form = useForm<expansionOpportunityFormValues>({ resolver: zodResolver(expansionOpportunityFormSchema), defaultValues: { tenantContextId: "", opportunityKey: "", title: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Expansion Opportunities" description="Tenant lifecycle expansion opportunities" /><div className="mt-6 space-y-3">
                {data.expansionOpportunities.length === 0 ? <EmptyState title="No expansion opportunities" description="Create the first expansion opportunities record." /> : data.expansionOpportunities.map((item) => (
                    <ListCard key={item.id} title={String(item.title)} subtitle={`${item.tenantContextName} • ${item.opportunityKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create expansion opportunitie" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExpansionOpportunity(v))}>
                <TenantContextSelect data={data} {...form.register("tenantContextId")} />
                <input {...form.register("opportunityKey")} placeholder="Opportunity key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TloAuditPanel({ data }: { data: TenantLifecycleOpsData }) {
    return (
        <Card hover><SectionHeader title="Tenant Lifecycle audit history" description="Security-first audit trail for lifecycle, operations, onboarding, and marketplace actions" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for tenant lifecycle operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function TenantLifecycleOpsSdkPanel({ data }: { data: TenantLifecycleOpsData }) {
    return (
        <Card hover><SectionHeader title="Shared Tenant Lifecycle Ops SDK" description="Import from @/src/modules/tenant-lifecycle-ops/sdk for tenant provisioning, lifecycle transitions, and industry pack installation" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createTenantLifecycleOpsClient()" subtitle="Factory for module-scoped Tenant Lifecycle Ops client with auth context" meta="Primary SDK for tenant lifecycle operations" />
            <ListCard title="sdkProvisionTenant()" subtitle="Provision tenant context with lifecycle record and AI orchestration" meta="moduleSource: tenant_lifecycle_ops" />
            <ListCard title="sdkTransitionLifecycle()" subtitle="Transition lifecycle stage with audit trail" meta="Lead → Trial → Onboarding → Active → Expansion → Renewal" />
            <ListCard title="sdkInstallIndustryPack()" subtitle="Install industry pack with knowledge context" meta="Healthcare, financial services, retail, and more" />
            <p className="text-xs text-slate-500">Theme: {TLO_THEME.primary} • Tenant contexts loaded: {data.tenantContexts.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createTenantLifecycleOpsClient } from "@/src/modules/tenant-lifecycle-ops/sdk";

const tlo = createTenantLifecycleOpsClient(userId, email, fullName);
await tlo.provisionTenant({ contextKey: "acme", companyName: "Acme Corp" });
await tlo.transitionLifecycle({ tenantContextId, transitionKey: "t-001", fromStage: "trial", toStage: "onboarding" });
await tlo.installIndustryPack({ tenantContextId, packKey: "healthcare-v1", packName: "Healthcare Pack" });`}</pre>
        </div></Card>
    );
}
