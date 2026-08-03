"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ELF_THEME, IMPORT_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS, PROVISION_STATUS_OPTIONS, LICENSE_STATUS_OPTIONS, DEPLOYMENT_STATUS_OPTIONS, RENEWAL_STATUS_OPTIONS, TICKET_STATUS_OPTIONS, SUBSCRIPTION_STATUS_OPTIONS } from "@/src/modules/launch-foundation/constants";
import type { useLaunchFoundation } from "@/src/modules/launch-foundation/hooks/useLaunchFoundation";
import {
    launchHubsFormSchema,
    type launchHubsFormValues,
    organizationProvisionsFormSchema,
    type organizationProvisionsFormValues,
    tenantProvisionsFormSchema,
    type tenantProvisionsFormValues,
    industryPackAssignmentsFormSchema,
    type industryPackAssignmentsFormValues,
    moduleLicensesFormSchema,
    type moduleLicensesFormValues,
    wizardProfilesFormSchema,
    type wizardProfilesFormValues,
    wizardBrandingFormSchema,
    type wizardBrandingFormValues,
    wizardDepartmentsFormSchema,
    type wizardDepartmentsFormValues,
    wizardSettingsFormSchema,
    type wizardSettingsFormValues,
    importJobsFormSchema,
    type importJobsFormValues,
    importValidationsFormSchema,
    type importValidationsFormValues,
    importPreviewsFormSchema,
    type importPreviewsFormValues,
    importHistoryFormSchema,
    type importHistoryFormValues,
    goLiveChecklistsFormSchema,
    type goLiveChecklistsFormValues,
    goLiveScoresFormSchema,
    type goLiveScoresFormValues,
    deploymentStatusesFormSchema,
    type deploymentStatusesFormValues,
    readinessValidationsFormSchema,
    type readinessValidationsFormValues,
    customerHealthScoresFormSchema,
    type customerHealthScoresFormValues,
    platformAdoptionFormSchema,
    type platformAdoptionFormValues,
    featureUsageFormSchema,
    type featureUsageFormValues,
    renewalTrackingFormSchema,
    type renewalTrackingFormValues,
    supportTicketsFormSchema,
    type supportTicketsFormValues,
    knowledgeBaseArticlesFormSchema,
    type knowledgeBaseArticlesFormValues,
    incidentTrackingFormSchema,
    type incidentTrackingFormValues,
    customerRegistryFormSchema,
    type customerRegistryFormValues,
    subscriptionRecordsFormSchema,
    type subscriptionRecordsFormValues,
    licenseManagementFormSchema,
    type licenseManagementFormValues,
    launchMetricsFormSchema,
    type launchMetricsFormValues,
    launchHealthFormSchema,
    type launchHealthFormValues,
    missionControlKpisFormSchema,
    type missionControlKpisFormValues,
    launchFailuresFormSchema,
    type launchFailuresFormValues,
} from "@/src/modules/launch-foundation/schemas";

type RetailData = ReturnType<typeof useLaunchFoundation>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-slate-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-slate-600">{meta}</p> : null}</div>;
}
function LaunchHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.launchHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Launch Foundation summary" description="Provisioning, config wizard, data import, go-live, customer success, support ops, platform admin, and mission control dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Launch Hubs" subtitle={`${data.stats?.totalLaunchHubs ?? 0} total`} meta={`${data.stats?.activeLaunchHubs ?? 0} active • ${data.stats?.organizationProvisionCount ?? 0} provisions`} />
                <ListCard title="Platform Ops" subtitle={`${data.stats?.customerRegistryCount ?? 0} customers`} meta={`${data.stats?.importJobCount ?? 0} import jobs • ${data.stats?.goLiveChecklistCount ?? 0} go-live checklists`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallLaunchScore ?? 0).toFixed(1)} overall launch score`} meta={`${data.stats?.openLaunchFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first launch foundation" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function LaunchHubsPanel({ data }: { data: RetailData }) {
    const form = useForm<launchHubsFormValues>({ resolver: zodResolver(launchHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Hubs" description="Enterprise retail operating system launch hubs" /><div className="mt-6 space-y-3">
                {data.launchHubs.length === 0 ? <EmptyState title="No launch hubs" description="Create the first launch hubs record." /> : data.launchHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrganizationProvisionsPanel({ data }: { data: RetailData }) {
    const form = useForm<organizationProvisionsFormValues>({ resolver: zodResolver(organizationProvisionsFormSchema), defaultValues: {"launchHubId":"","provisionKey":"","provisionName":"","provisionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Organization Provisions" description="Enterprise retail operating system organization provisions" /><div className="mt-6 space-y-3">
                {data.organizationProvisions.length === 0 ? <EmptyState title="No organization provisions" description="Create the first organization provisions record." /> : data.organizationProvisions.map((item) => (
                    <ListCard key={item.id} title={String(item.provisionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.provisionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create organization provisions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrganizationProvision(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("provisionKey")} placeholder="provisionKey" className={inputClass} />
                <input {...form.register("provisionName")} placeholder="provisionName" className={inputClass} />
                <select {...form.register("provisionStatus")} className={inputClass}>{PROVISION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TenantProvisionsPanel({ data }: { data: RetailData }) {
    const form = useForm<tenantProvisionsFormValues>({ resolver: zodResolver(tenantProvisionsFormSchema), defaultValues: {"launchHubId":"","provisionKey":"","tenantRef":"","provisionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tenant Provisions" description="Enterprise retail operating system tenant provisions" /><div className="mt-6 space-y-3">
                {data.tenantProvisions.length === 0 ? <EmptyState title="No tenant provisions" description="Create the first tenant provisions record." /> : data.tenantProvisions.map((item) => (
                    <ListCard key={item.id} title={String(item.provisionKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.tenantRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tenant provisions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantProvision(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("provisionKey")} placeholder="provisionKey" className={inputClass} />
                <input {...form.register("tenantRef")} placeholder="tenantRef" className={inputClass} />
                <select {...form.register("provisionStatus")} className={inputClass}>{PROVISION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryPackAssignmentsPanel({ data }: { data: RetailData }) {
    const form = useForm<industryPackAssignmentsFormValues>({ resolver: zodResolver(industryPackAssignmentsFormSchema), defaultValues: {"launchHubId":"","assignmentKey":"","packName":"","packType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Pack Assignments" description="Enterprise retail operating system industry pack assignments" /><div className="mt-6 space-y-3">
                {data.industryPackAssignments.length === 0 ? <EmptyState title="No industry pack assignments" description="Create the first industry pack assignments record." /> : data.industryPackAssignments.map((item) => (
                    <ListCard key={item.id} title={String(item.packName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.packType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry pack assignments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryPackAssignment(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("assignmentKey")} placeholder="assignmentKey" className={inputClass} />
                <input {...form.register("packName")} placeholder="packName" className={inputClass} />
                <input {...form.register("packType")} placeholder="packType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ModuleLicensesPanel({ data }: { data: RetailData }) {
    const form = useForm<moduleLicensesFormValues>({ resolver: zodResolver(moduleLicensesFormSchema), defaultValues: {"launchHubId":"","licenseKey":"","moduleName":"","licenseStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module Licenses" description="Enterprise retail operating system module licenses" /><div className="mt-6 space-y-3">
                {data.moduleLicenses.length === 0 ? <EmptyState title="No module licenses" description="Create the first module licenses record." /> : data.moduleLicenses.map((item) => (
                    <ListCard key={item.id} title={String(item.moduleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.licenseStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create module licenses" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModuleLicense(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("licenseKey")} placeholder="licenseKey" className={inputClass} />
                <input {...form.register("moduleName")} placeholder="moduleName" className={inputClass} />
                <select {...form.register("licenseStatus")} className={inputClass}>{LICENSE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WizardProfilesPanel({ data }: { data: RetailData }) {
    const form = useForm<wizardProfilesFormValues>({ resolver: zodResolver(wizardProfilesFormSchema), defaultValues: {"launchHubId":"","profileKey":"","profileName":"","profileType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Wizard Profiles" description="Enterprise retail operating system wizard profiles" /><div className="mt-6 space-y-3">
                {data.wizardProfiles.length === 0 ? <EmptyState title="No wizard profiles" description="Create the first wizard profiles record." /> : data.wizardProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create wizard profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWizardProfile(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("profileType")} placeholder="profileType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WizardBrandingsPanel({ data }: { data: RetailData }) {
    const form = useForm<wizardBrandingFormValues>({ resolver: zodResolver(wizardBrandingFormSchema), defaultValues: {"launchHubId":"","brandingKey":"","brandingName":"","brandColor":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Wizard Branding" description="Enterprise retail operating system wizard branding" /><div className="mt-6 space-y-3">
                {data.wizardBranding.length === 0 ? <EmptyState title="No wizard branding" description="Create the first wizard branding record." /> : data.wizardBranding.map((item) => (
                    <ListCard key={item.id} title={String(item.brandingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.brandColor}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create wizard branding" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWizardBranding(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("brandingKey")} placeholder="brandingKey" className={inputClass} />
                <input {...form.register("brandingName")} placeholder="brandingName" className={inputClass} />
                <input {...form.register("brandColor")} placeholder="brandColor" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WizardDepartmentsPanel({ data }: { data: RetailData }) {
    const form = useForm<wizardDepartmentsFormValues>({ resolver: zodResolver(wizardDepartmentsFormSchema), defaultValues: {"launchHubId":"","departmentKey":"","departmentName":"","departmentType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Wizard Departments" description="Enterprise retail operating system wizard departments" /><div className="mt-6 space-y-3">
                {data.wizardDepartments.length === 0 ? <EmptyState title="No wizard departments" description="Create the first wizard departments record." /> : data.wizardDepartments.map((item) => (
                    <ListCard key={item.id} title={String(item.departmentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.departmentType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create wizard departments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWizardDepartment(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("departmentKey")} placeholder="departmentKey" className={inputClass} />
                <input {...form.register("departmentName")} placeholder="departmentName" className={inputClass} />
                <input {...form.register("departmentType")} placeholder="departmentType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WizardSettingsPanel({ data }: { data: RetailData }) {
    const form = useForm<wizardSettingsFormValues>({ resolver: zodResolver(wizardSettingsFormSchema), defaultValues: {"launchHubId":"","settingKey":"","settingName":"","settingValue":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Wizard Settings" description="Enterprise retail operating system wizard settings" /><div className="mt-6 space-y-3">
                {data.wizardSettings.length === 0 ? <EmptyState title="No wizard settings" description="Create the first wizard settings record." /> : data.wizardSettings.map((item) => (
                    <ListCard key={item.id} title={String(item.settingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.settingValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create wizard settings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWizardSetting(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("settingKey")} placeholder="settingKey" className={inputClass} />
                <input {...form.register("settingName")} placeholder="settingName" className={inputClass} />
                <input {...form.register("settingValue")} placeholder="settingValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ImportJobsPanel({ data }: { data: RetailData }) {
    const form = useForm<importJobsFormValues>({ resolver: zodResolver(importJobsFormSchema), defaultValues: {"launchHubId":"","jobKey":"","jobName":"","jobStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Import Jobs" description="Enterprise retail operating system import jobs" /><div className="mt-6 space-y-3">
                {data.importJobs.length === 0 ? <EmptyState title="No import jobs" description="Create the first import jobs record." /> : data.importJobs.map((item) => (
                    <ListCard key={item.id} title={String(item.jobName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.jobStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create import jobs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createImportJob(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("jobKey")} placeholder="jobKey" className={inputClass} />
                <input {...form.register("jobName")} placeholder="jobName" className={inputClass} />
                <select {...form.register("jobStatus")} className={inputClass}>{IMPORT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ImportValidationsPanel({ data }: { data: RetailData }) {
    const form = useForm<importValidationsFormValues>({ resolver: zodResolver(importValidationsFormSchema), defaultValues: {"launchHubId":"","validationKey":"","validationType":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Import Validations" description="Enterprise retail operating system import validations" /><div className="mt-6 space-y-3">
                {data.importValidations.length === 0 ? <EmptyState title="No import validations" description="Create the first import validations record." /> : data.importValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.validationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create import validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createImportValidation(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("validationType")} placeholder="validationType" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ImportPreviewsPanel({ data }: { data: RetailData }) {
    const form = useForm<importPreviewsFormValues>({ resolver: zodResolver(importPreviewsFormSchema), defaultValues: {"launchHubId":"","previewKey":"","previewName":"","recordCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Import Previews" description="Enterprise retail operating system import previews" /><div className="mt-6 space-y-3">
                {data.importPreviews.length === 0 ? <EmptyState title="No import previews" description="Create the first import previews record." /> : data.importPreviews.map((item) => (
                    <ListCard key={item.id} title={String(item.previewName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.recordCount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create import previews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createImportPreview(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("previewKey")} placeholder="previewKey" className={inputClass} />
                <input {...form.register("previewName")} placeholder="previewName" className={inputClass} />
                <input type="number" step="any" {...form.register("recordCount", { valueAsNumber: true })} placeholder="recordCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ImportHistorysPanel({ data }: { data: RetailData }) {
    const form = useForm<importHistoryFormValues>({ resolver: zodResolver(importHistoryFormSchema), defaultValues: {"launchHubId":"","historyKey":"","historyType":"","importedAt":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Import History" description="Enterprise retail operating system import history" /><div className="mt-6 space-y-3">
                {data.importHistory.length === 0 ? <EmptyState title="No import history" description="Create the first import history record." /> : data.importHistory.map((item) => (
                    <ListCard key={item.id} title={String(item.historyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.historyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create import history" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createImportHistory(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyType")} placeholder="historyType" className={inputClass} />
                <input {...form.register("importedAt")} placeholder="importedAt" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GoLiveChecklistsPanel({ data }: { data: RetailData }) {
    const form = useForm<goLiveChecklistsFormValues>({ resolver: zodResolver(goLiveChecklistsFormSchema), defaultValues: {"launchHubId":"","checklistKey":"","checklistName":"","completionScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Go Live Checklists" description="Enterprise retail operating system go live checklists" /><div className="mt-6 space-y-3">
                {data.goLiveChecklists.length === 0 ? <EmptyState title="No go live checklists" description="Create the first go live checklists record." /> : data.goLiveChecklists.map((item) => (
                    <ListCard key={item.id} title={String(item.checklistName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.completionScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create go live checklists" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGoLiveChecklist(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("checklistKey")} placeholder="checklistKey" className={inputClass} />
                <input {...form.register("checklistName")} placeholder="checklistName" className={inputClass} />
                <input type="number" step="any" {...form.register("completionScore", { valueAsNumber: true })} placeholder="completionScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GoLiveScoresPanel({ data }: { data: RetailData }) {
    const form = useForm<goLiveScoresFormValues>({ resolver: zodResolver(goLiveScoresFormSchema), defaultValues: {"launchHubId":"","scoreKey":"","scoreType":"","goLiveScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Go Live Scores" description="Enterprise retail operating system go live scores" /><div className="mt-6 space-y-3">
                {data.goLiveScores.length === 0 ? <EmptyState title="No go live scores" description="Create the first go live scores record." /> : data.goLiveScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.scoreType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create go live scores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGoLiveScore(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("scoreKey")} placeholder="scoreKey" className={inputClass} />
                <input {...form.register("scoreType")} placeholder="scoreType" className={inputClass} />
                <input type="number" step="any" {...form.register("goLiveScore", { valueAsNumber: true })} placeholder="goLiveScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentStatussPanel({ data }: { data: RetailData }) {
    const form = useForm<deploymentStatusesFormValues>({ resolver: zodResolver(deploymentStatusesFormSchema), defaultValues: {"launchHubId":"","statusKey":"","deploymentName":"","deploymentStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Statuses" description="Enterprise retail operating system deployment statuses" /><div className="mt-6 space-y-3">
                {data.deploymentStatuses.length === 0 ? <EmptyState title="No deployment statuses" description="Create the first deployment statuses record." /> : data.deploymentStatuses.map((item) => (
                    <ListCard key={item.id} title={String(item.deploymentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deploymentStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment statuses" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentStatus(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("statusKey")} placeholder="statusKey" className={inputClass} />
                <input {...form.register("deploymentName")} placeholder="deploymentName" className={inputClass} />
                <select {...form.register("deploymentStatus")} className={inputClass}>{DEPLOYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReadinessValidationsPanel({ data }: { data: RetailData }) {
    const form = useForm<readinessValidationsFormValues>({ resolver: zodResolver(readinessValidationsFormSchema), defaultValues: {"launchHubId":"","validationKey":"","validationType":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Readiness Validations" description="Enterprise retail operating system readiness validations" /><div className="mt-6 space-y-3">
                {data.readinessValidations.length === 0 ? <EmptyState title="No readiness validations" description="Create the first readiness validations record." /> : data.readinessValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.validationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create readiness validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReadinessValidation(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("validationType")} placeholder="validationType" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerHealthScoresPanel({ data }: { data: RetailData }) {
    const form = useForm<customerHealthScoresFormValues>({ resolver: zodResolver(customerHealthScoresFormSchema), defaultValues: {"launchHubId":"","scoreKey":"","customerRef":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Health Scores" description="Enterprise retail operating system customer health scores" /><div className="mt-6 space-y-3">
                {data.customerHealthScores.length === 0 ? <EmptyState title="No customer health scores" description="Create the first customer health scores record." /> : data.customerHealthScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.customerRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer health scores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerHealthScore(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("scoreKey")} placeholder="scoreKey" className={inputClass} />
                <input {...form.register("customerRef")} placeholder="customerRef" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformAdoptionsPanel({ data }: { data: RetailData }) {
    const form = useForm<platformAdoptionFormValues>({ resolver: zodResolver(platformAdoptionFormSchema), defaultValues: {"launchHubId":"","adoptionKey":"","featureName":"","adoptionRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Adoption" description="Enterprise retail operating system platform adoption" /><div className="mt-6 space-y-3">
                {data.platformAdoption.length === 0 ? <EmptyState title="No platform adoption" description="Create the first platform adoption record." /> : data.platformAdoption.map((item) => (
                    <ListCard key={item.id} title={String(item.featureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.adoptionRate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform adoption" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformAdoption(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("adoptionKey")} placeholder="adoptionKey" className={inputClass} />
                <input {...form.register("featureName")} placeholder="featureName" className={inputClass} />
                <input type="number" step="any" {...form.register("adoptionRate", { valueAsNumber: true })} placeholder="adoptionRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeatureUsagesPanel({ data }: { data: RetailData }) {
    const form = useForm<featureUsageFormValues>({ resolver: zodResolver(featureUsageFormSchema), defaultValues: {"launchHubId":"","usageKey":"","featureName":"","usageCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feature Usage" description="Enterprise retail operating system feature usage" /><div className="mt-6 space-y-3">
                {data.featureUsage.length === 0 ? <EmptyState title="No feature usage" description="Create the first feature usage record." /> : data.featureUsage.map((item) => (
                    <ListCard key={item.id} title={String(item.featureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.usageCount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feature usage" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeatureUsage(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("usageKey")} placeholder="usageKey" className={inputClass} />
                <input {...form.register("featureName")} placeholder="featureName" className={inputClass} />
                <input type="number" step="any" {...form.register("usageCount", { valueAsNumber: true })} placeholder="usageCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenewalTrackingsPanel({ data }: { data: RetailData }) {
    const form = useForm<renewalTrackingFormValues>({ resolver: zodResolver(renewalTrackingFormSchema), defaultValues: {"launchHubId":"","renewalKey":"","customerRef":"","renewalStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal Tracking" description="Enterprise retail operating system renewal tracking" /><div className="mt-6 space-y-3">
                {data.renewalTracking.length === 0 ? <EmptyState title="No renewal tracking" description="Create the first renewal tracking record." /> : data.renewalTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.renewalKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.customerRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal tracking" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalTracking(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("renewalKey")} placeholder="renewalKey" className={inputClass} />
                <input {...form.register("customerRef")} placeholder="customerRef" className={inputClass} />
                <select {...form.register("renewalStatus")} className={inputClass}>{RENEWAL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SupportTicketsPanel({ data }: { data: RetailData }) {
    const form = useForm<supportTicketsFormValues>({ resolver: zodResolver(supportTicketsFormSchema), defaultValues: {"launchHubId":"","ticketKey":"","ticketTitle":"","ticketStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Support Tickets" description="Enterprise retail operating system support tickets" /><div className="mt-6 space-y-3">
                {data.supportTickets.length === 0 ? <EmptyState title="No support tickets" description="Create the first support tickets record." /> : data.supportTickets.map((item) => (
                    <ListCard key={item.id} title={String(item.ticketTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ticketStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create support tickets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSupportTicket(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("ticketKey")} placeholder="ticketKey" className={inputClass} />
                <input {...form.register("ticketTitle")} placeholder="ticketTitle" className={inputClass} />
                <select {...form.register("ticketStatus")} className={inputClass}>{TICKET_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KnowledgeBaseArticlesPanel({ data }: { data: RetailData }) {
    const form = useForm<knowledgeBaseArticlesFormValues>({ resolver: zodResolver(knowledgeBaseArticlesFormSchema), defaultValues: {"launchHubId":"","articleKey":"","articleTitle":"","articleCategory":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Knowledge Base Articles" description="Enterprise retail operating system knowledge base articles" /><div className="mt-6 space-y-3">
                {data.knowledgeBaseArticles.length === 0 ? <EmptyState title="No knowledge base articles" description="Create the first knowledge base articles record." /> : data.knowledgeBaseArticles.map((item) => (
                    <ListCard key={item.id} title={String(item.articleTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.articleCategory}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create knowledge base articles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKnowledgeBaseArticle(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("articleKey")} placeholder="articleKey" className={inputClass} />
                <input {...form.register("articleTitle")} placeholder="articleTitle" className={inputClass} />
                <input {...form.register("articleCategory")} placeholder="articleCategory" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IncidentTrackingsPanel({ data }: { data: RetailData }) {
    const form = useForm<incidentTrackingFormValues>({ resolver: zodResolver(incidentTrackingFormSchema), defaultValues: {"launchHubId":"","incidentKey":"","incidentTitle":"","incidentSeverity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Incident Tracking" description="Enterprise retail operating system incident tracking" /><div className="mt-6 space-y-3">
                {data.incidentTracking.length === 0 ? <EmptyState title="No incident tracking" description="Create the first incident tracking record." /> : data.incidentTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.incidentTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.incidentSeverity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create incident tracking" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIncidentTracking(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("incidentKey")} placeholder="incidentKey" className={inputClass} />
                <input {...form.register("incidentTitle")} placeholder="incidentTitle" className={inputClass} />
                <select {...form.register("incidentSeverity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerRegistrysPanel({ data }: { data: RetailData }) {
    const form = useForm<customerRegistryFormValues>({ resolver: zodResolver(customerRegistryFormSchema), defaultValues: {"launchHubId":"","customerKey":"","customerName":"","customerTier":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Registry" description="Enterprise retail operating system customer registry" /><div className="mt-6 space-y-3">
                {data.customerRegistry.length === 0 ? <EmptyState title="No customer registry" description="Create the first customer registry record." /> : data.customerRegistry.map((item) => (
                    <ListCard key={item.id} title={String(item.customerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.customerTier}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer registry" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerRegistry(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("customerKey")} placeholder="customerKey" className={inputClass} />
                <input {...form.register("customerName")} placeholder="customerName" className={inputClass} />
                <input {...form.register("customerTier")} placeholder="customerTier" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubscriptionRecordsPanel({ data }: { data: RetailData }) {
    const form = useForm<subscriptionRecordsFormValues>({ resolver: zodResolver(subscriptionRecordsFormSchema), defaultValues: {"launchHubId":"","subscriptionKey":"","planName":"","subscriptionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Subscription Records" description="Enterprise retail operating system subscription records" /><div className="mt-6 space-y-3">
                {data.subscriptionRecords.length === 0 ? <EmptyState title="No subscription records" description="Create the first subscription records record." /> : data.subscriptionRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.planName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.subscriptionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create subscription records" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubscriptionRecord(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("subscriptionKey")} placeholder="subscriptionKey" className={inputClass} />
                <input {...form.register("planName")} placeholder="planName" className={inputClass} />
                <select {...form.register("subscriptionStatus")} className={inputClass}>{SUBSCRIPTION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LicenseManagementsPanel({ data }: { data: RetailData }) {
    const form = useForm<licenseManagementFormValues>({ resolver: zodResolver(licenseManagementFormSchema), defaultValues: {"launchHubId":"","licenseKey":"","licenseType":"","licenseStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="License Management" description="Enterprise retail operating system license management" /><div className="mt-6 space-y-3">
                {data.licenseManagement.length === 0 ? <EmptyState title="No license management" description="Create the first license management record." /> : data.licenseManagement.map((item) => (
                    <ListCard key={item.id} title={String(item.licenseKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.licenseType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create license management" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLicenseManagement(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("licenseKey")} placeholder="licenseKey" className={inputClass} />
                <input {...form.register("licenseType")} placeholder="licenseType" className={inputClass} />
                <select {...form.register("licenseStatus")} className={inputClass}>{LICENSE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchMetricsPanel({ data }: { data: RetailData }) {
    const form = useForm<launchMetricsFormValues>({ resolver: zodResolver(launchMetricsFormSchema), defaultValues: {"metricsKey":"","platformHealthScore":0,"overallLaunchScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Metrics" description="Enterprise retail operating system launch metrics" /><div className="mt-6 space-y-3">
                {data.launchMetrics.length === 0 ? <EmptyState title="No launch metrics" description="Create the first launch metrics record." /> : data.launchMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallLaunchScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("platformHealthScore", { valueAsNumber: true })} placeholder="platformHealthScore" className={inputClass} />
                <input type="number" step="any" {...form.register("overallLaunchScore", { valueAsNumber: true })} placeholder="overallLaunchScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<launchHealthFormValues>({ resolver: zodResolver(launchHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Health" description="Enterprise retail operating system launch health" /><div className="mt-6 space-y-3">
                {data.launchHealth.length === 0 ? <EmptyState title="No launch health" description="Create the first launch health record." /> : data.launchHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MissionControlKpisPanel({ data }: { data: RetailData }) {
    const form = useForm<missionControlKpisFormValues>({ resolver: zodResolver(missionControlKpisFormSchema), defaultValues: {"launchHubId":"","kpiKey":"","kpiName":"","kpiScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Mission Control Kpis" description="Enterprise retail operating system mission control kpis" /><div className="mt-6 space-y-3">
                {data.missionControlKpis.length === 0 ? <EmptyState title="No mission control kpis" description="Create the first mission control kpis record." /> : data.missionControlKpis.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mission control kpis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMissionControlKpi(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <input type="number" step="any" {...form.register("kpiScore", { valueAsNumber: true })} placeholder="kpiScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchFailuresPanel({ data }: { data: RetailData }) {
    const form = useForm<launchFailuresFormValues>({ resolver: zodResolver(launchFailuresFormSchema), defaultValues: {"launchHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Failures" description="Enterprise retail operating system launch failures" /><div className="mt-6 space-y-3">
                {data.launchFailures.length === 0 ? <EmptyState title="No launch failures" description="Create the first launch failures record." /> : data.launchFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchFailure(v))}>
                <LaunchHubSelect data={data} {...form.register("launchHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Launch Foundation audit history" description="Security-first audit trail for provisioning, imports, go-live, and mission control operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Launch Foundation SDK" description="Import from @/src/modules/launch-foundation/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createLaunchFoundationClient()" subtitle="Factory for module-scoped Launch Foundation client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkProvisionOrganization()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: enterprise_launch_foundation" />
            <ListCard title="sdkConfigureWizardProfile()" subtitle="Configure wizard profile with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunGoLiveWorkflow()" subtitle="Run go-live workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {ELF_THEME.primary} • Integration hubs loaded: {data.launchHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";

const intg = createLaunchFoundationClient(userId, email, fullName);
await intg.registerCampus({ launchHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureWizardProfile({ launchHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runGoLiveWorkflow({ launchHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
