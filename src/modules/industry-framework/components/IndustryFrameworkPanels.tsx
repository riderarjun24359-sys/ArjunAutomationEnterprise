"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { IFR_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/industry-framework/constants";
import type { useIndustryFramework } from "@/src/modules/industry-framework/hooks/useIndustryFramework";
import {
    frameworkHubsFormSchema,
    type frameworkHubsFormValues,
    industryRegistrationsFormSchema,
    type industryRegistrationsFormValues,
    industryMetadataFormSchema,
    type industryMetadataFormValues,
    industryVersionsFormSchema,
    type industryVersionsFormValues,
    industryDependenciesFormSchema,
    type industryDependenciesFormValues,
    businessTypesFormSchema,
    type businessTypesFormValues,
    businessSizesFormSchema,
    type businessSizesFormValues,
    operatingModelsFormSchema,
    type operatingModelsFormValues,
    industryProfilesFormSchema,
    type industryProfilesFormValues,
    dashboardTemplatesFormSchema,
    type dashboardTemplatesFormValues,
    workflowTemplatesFormSchema,
    type workflowTemplatesFormValues,
    roleTemplatesFormSchema,
    type roleTemplatesFormValues,
    reportTemplatesFormSchema,
    type reportTemplatesFormValues,
    dynamicConfigurationsFormSchema,
    type dynamicConfigurationsFormValues,
    featureConfigurationsFormSchema,
    type featureConfigurationsFormValues,
    businessRulesFormSchema,
    type businessRulesFormValues,
    validationRulesFormSchema,
    type validationRulesFormValues,
    industryContextsFormSchema,
    type industryContextsFormValues,
    aiContextsFormSchema,
    type aiContextsFormValues,
    terminologyEntriesFormSchema,
    type terminologyEntriesFormValues,
    demoProfilesFormSchema,
    type demoProfilesFormValues,
    productionProfilesFormSchema,
    type productionProfilesFormValues,
    enterpriseProfilesFormSchema,
    type enterpriseProfilesFormValues,
    sharedApisFormSchema,
    type sharedApisFormValues,
    contextApisFormSchema,
    type contextApisFormValues,
    configurationApisFormSchema,
    type configurationApisFormValues,
    extensionPointsFormSchema,
    type extensionPointsFormValues,
    frameworkMetricsFormSchema,
    type frameworkMetricsFormValues,
    frameworkHealthFormSchema,
    type frameworkHealthFormValues,
    compatibilityChecksFormSchema,
    type compatibilityChecksFormValues,
    frameworkFailuresFormSchema,
    type frameworkFailuresFormValues,
} from "@/src/modules/industry-framework/schemas";

type IndustryFrameworkData = ReturnType<typeof useIndustryFramework>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-teal-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-teal-600">{meta}</p> : null}</div>;
}
function FrameworkHubSelect({ data, ...props }: { data: IndustryFrameworkData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select industry framework</option>{data.frameworkHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function IndustryFrameworkOverviewPanel({ data }: { data: IndustryFrameworkData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Industry Framework summary" description="System health, background jobs, event bus, compatibilityChecks, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Framework Hubs" subtitle={`${data.stats?.totalFrameworkHubs ?? 0} total`} meta={`${data.stats?.activeFrameworkHubs ?? 0} active • ${data.stats?.dashboardTemplateCount ?? 0} dashboard templates`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.workflowTemplateCount ?? 0} workflow templates`} meta={`${data.stats?.industryProfileCount ?? 0} industry profiles • ${data.stats?.openCompatibilityCount ?? 0} open compatibility issues`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallFrameworkScore ?? 0).toFixed(1)} overall framework score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first industry framework" />
            </div></Card>
            <Card hover><SectionHeader title="Industry framework pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Industry framework pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function FrameworkHubsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<frameworkHubsFormValues>({ resolver: zodResolver(frameworkHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Framework Hubs" description="Enterprise industry framework framework hubs" /><div className="mt-6 space-y-3">
                {data.frameworkHubs.length === 0 ? <EmptyState title="No framework hubs" description="Create the first framework hubs record." /> : data.frameworkHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create framework hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFrameworkHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryRegistrationsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<industryRegistrationsFormValues>({ resolver: zodResolver(industryRegistrationsFormSchema), defaultValues: {"frameworkHubId":"","registrationKey":"","industryCode":"","industryName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Registrations" description="Enterprise industry framework industry registrations" /><div className="mt-6 space-y-3">
                {data.industryRegistrations.length === 0 ? <EmptyState title="No industry registrations" description="Create the first industry registrations record." /> : data.industryRegistrations.map((item) => (
                    <ListCard key={item.id} title={String(item.industryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.industryCode}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry registrations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryRegistration(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("registrationKey")} placeholder="registrationKey" className={inputClass} />
                <input {...form.register("industryCode")} placeholder="industryCode" className={inputClass} />
                <input {...form.register("industryName")} placeholder="industryName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryMetadatasPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<industryMetadataFormValues>({ resolver: zodResolver(industryMetadataFormSchema), defaultValues: {"frameworkHubId":"","metadataKey":"","metadataType":"","metadataValue":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Metadata" description="Enterprise industry framework industry metadata" /><div className="mt-6 space-y-3">
                {data.industryMetadata.length === 0 ? <EmptyState title="No industry metadata" description="Create the first industry metadata record." /> : data.industryMetadata.map((item) => (
                    <ListCard key={item.id} title={String(item.metadataKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.metadataType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry metadata" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryMetadata(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("metadataKey")} placeholder="metadataKey" className={inputClass} />
                <input {...form.register("metadataType")} placeholder="metadataType" className={inputClass} />
                <input {...form.register("metadataValue")} placeholder="metadataValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryVersionsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<industryVersionsFormValues>({ resolver: zodResolver(industryVersionsFormSchema), defaultValues: {"frameworkHubId":"","versionKey":"","versionNumber":"","releaseChannel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Versions" description="Enterprise industry framework industry versions" /><div className="mt-6 space-y-3">
                {data.industryVersions.length === 0 ? <EmptyState title="No industry versions" description="Create the first industry versions record." /> : data.industryVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.releaseChannel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryVersion(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <select {...form.register("releaseChannel")} className={inputClass}>{RELEASE_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryDependencysPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<industryDependenciesFormValues>({ resolver: zodResolver(industryDependenciesFormSchema), defaultValues: {"frameworkHubId":"","dependencyKey":"","dependencyType":"","dependencyRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Dependencies" description="Enterprise industry framework industry dependencies" /><div className="mt-6 space-y-3">
                {data.industryDependencies.length === 0 ? <EmptyState title="No industry dependencies" description="Create the first industry dependencies record." /> : data.industryDependencies.map((item) => (
                    <ListCard key={item.id} title={String(item.dependencyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dependencyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry dependencies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryDependency(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("dependencyKey")} placeholder="dependencyKey" className={inputClass} />
                <input {...form.register("dependencyType")} placeholder="dependencyType" className={inputClass} />
                <input {...form.register("dependencyRef")} placeholder="dependencyRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessTypesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<businessTypesFormValues>({ resolver: zodResolver(businessTypesFormSchema), defaultValues: {"frameworkHubId":"","typeKey":"","typeName":"","typeCategory":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Types" description="Enterprise industry framework business types" /><div className="mt-6 space-y-3">
                {data.businessTypes.length === 0 ? <EmptyState title="No business types" description="Create the first business types record." /> : data.businessTypes.map((item) => (
                    <ListCard key={item.id} title={String(item.typeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.typeCategory}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business types" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessType(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("typeKey")} placeholder="typeKey" className={inputClass} />
                <input {...form.register("typeName")} placeholder="typeName" className={inputClass} />
                <input {...form.register("typeCategory")} placeholder="typeCategory" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessSizesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<businessSizesFormValues>({ resolver: zodResolver(businessSizesFormSchema), defaultValues: {"frameworkHubId":"","sizeKey":"","sizeLabel":"","employeeRange":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Sizes" description="Enterprise industry framework business sizes" /><div className="mt-6 space-y-3">
                {data.businessSizes.length === 0 ? <EmptyState title="No business sizes" description="Create the first business sizes record." /> : data.businessSizes.map((item) => (
                    <ListCard key={item.id} title={String(item.sizeLabel)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.employeeRange}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business sizes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessSize(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("sizeKey")} placeholder="sizeKey" className={inputClass} />
                <input {...form.register("sizeLabel")} placeholder="sizeLabel" className={inputClass} />
                <input {...form.register("employeeRange")} placeholder="employeeRange" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperatingModelsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<operatingModelsFormValues>({ resolver: zodResolver(operatingModelsFormSchema), defaultValues: {"frameworkHubId":"","modelKey":"","modelName":"","modelType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operating Models" description="Enterprise industry framework operating models" /><div className="mt-6 space-y-3">
                {data.operatingModels.length === 0 ? <EmptyState title="No operating models" description="Create the first operating models record." /> : data.operatingModels.map((item) => (
                    <ListCard key={item.id} title={String(item.modelName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.modelType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operating models" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperatingModel(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("modelKey")} placeholder="modelKey" className={inputClass} />
                <input {...form.register("modelName")} placeholder="modelName" className={inputClass} />
                <input {...form.register("modelType")} placeholder="modelType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryProfilesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<industryProfilesFormValues>({ resolver: zodResolver(industryProfilesFormSchema), defaultValues: {"frameworkHubId":"","profileKey":"","profileName":"","profileScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Profiles" description="Enterprise industry framework industry profiles" /><div className="mt-6 space-y-3">
                {data.industryProfiles.length === 0 ? <EmptyState title="No industry profiles" description="Create the first industry profiles record." /> : data.industryProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryProfile(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input type="number" step="any" {...form.register("profileScore", { valueAsNumber: true })} placeholder="profileScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DashboardTemplatesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<dashboardTemplatesFormValues>({ resolver: zodResolver(dashboardTemplatesFormSchema), defaultValues: {"frameworkHubId":"","templateKey":"","templateName":"","templateVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Dashboard Templates" description="Enterprise industry framework dashboard templates" /><div className="mt-6 space-y-3">
                {data.dashboardTemplates.length === 0 ? <EmptyState title="No dashboard templates" description="Create the first dashboard templates record." /> : data.dashboardTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create dashboard templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDashboardTemplate(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <input {...form.register("templateVersion")} placeholder="templateVersion" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowTemplatesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<workflowTemplatesFormValues>({ resolver: zodResolver(workflowTemplatesFormSchema), defaultValues: {"frameworkHubId":"","templateKey":"","templateName":"","workflowType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Templates" description="Enterprise industry framework workflow templates" /><div className="mt-6 space-y-3">
                {data.workflowTemplates.length === 0 ? <EmptyState title="No workflow templates" description="Create the first workflow templates record." /> : data.workflowTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.workflowType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowTemplate(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <input {...form.register("workflowType")} placeholder="workflowType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RoleTemplatesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<roleTemplatesFormValues>({ resolver: zodResolver(roleTemplatesFormSchema), defaultValues: {"frameworkHubId":"","templateKey":"","roleName":"","permissionsCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Role Templates" description="Enterprise industry framework role templates" /><div className="mt-6 space-y-3">
                {data.roleTemplates.length === 0 ? <EmptyState title="No role templates" description="Create the first role templates record." /> : data.roleTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.roleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.permissionsCount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create role templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRoleTemplate(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("roleName")} placeholder="roleName" className={inputClass} />
                <input type="number" step="any" {...form.register("permissionsCount", { valueAsNumber: true })} placeholder="permissionsCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReportTemplatesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<reportTemplatesFormValues>({ resolver: zodResolver(reportTemplatesFormSchema), defaultValues: {"frameworkHubId":"","templateKey":"","reportName":"","reportFormat":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Report Templates" description="Enterprise industry framework report templates" /><div className="mt-6 space-y-3">
                {data.reportTemplates.length === 0 ? <EmptyState title="No report templates" description="Create the first report templates record." /> : data.reportTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.reportName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reportFormat}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create report templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReportTemplate(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("reportName")} placeholder="reportName" className={inputClass} />
                <input {...form.register("reportFormat")} placeholder="reportFormat" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DynamicConfigurationsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<dynamicConfigurationsFormValues>({ resolver: zodResolver(dynamicConfigurationsFormSchema), defaultValues: {"frameworkHubId":"","configKey":"","configType":"","configValue":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Dynamic Configurations" description="Enterprise industry framework dynamic configurations" /><div className="mt-6 space-y-3">
                {data.dynamicConfigurations.length === 0 ? <EmptyState title="No dynamic configurations" description="Create the first dynamic configurations record." /> : data.dynamicConfigurations.map((item) => (
                    <ListCard key={item.id} title={String(item.configKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.configType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create dynamic configurations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDynamicConfiguration(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configType")} placeholder="configType" className={inputClass} />
                <input {...form.register("configValue")} placeholder="configValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeatureConfigurationsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<featureConfigurationsFormValues>({ resolver: zodResolver(featureConfigurationsFormSchema), defaultValues: {"frameworkHubId":"","featureKey":"","featureName":"","enabled":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feature Configurations" description="Enterprise industry framework feature configurations" /><div className="mt-6 space-y-3">
                {data.featureConfigurations.length === 0 ? <EmptyState title="No feature configurations" description="Create the first feature configurations record." /> : data.featureConfigurations.map((item) => (
                    <ListCard key={item.id} title={String(item.featureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.featureKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feature configurations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeatureConfiguration(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("featureKey")} placeholder="featureKey" className={inputClass} />
                <input {...form.register("featureName")} placeholder="featureName" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("enabled")} /> enabled</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessRulesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<businessRulesFormValues>({ resolver: zodResolver(businessRulesFormSchema), defaultValues: {"frameworkHubId":"","ruleKey":"","ruleName":"","ruleType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Rules" description="Enterprise industry framework business rules" /><div className="mt-6 space-y-3">
                {data.businessRules.length === 0 ? <EmptyState title="No business rules" description="Create the first business rules record." /> : data.businessRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ruleType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessRule(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input {...form.register("ruleType")} placeholder="ruleType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ValidationRulesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<validationRulesFormValues>({ resolver: zodResolver(validationRulesFormSchema), defaultValues: {"frameworkHubId":"","ruleKey":"","ruleName":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Validation Rules" description="Enterprise industry framework validation rules" /><div className="mt-6 space-y-3">
                {data.validationRules.length === 0 ? <EmptyState title="No validation rules" description="Create the first validation rules record." /> : data.validationRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.validationScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create validation rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createValidationRule(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryContextsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<industryContextsFormValues>({ resolver: zodResolver(industryContextsFormSchema), defaultValues: {"frameworkHubId":"","contextKey":"","contextType":"","contextPayload":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Contexts" description="Enterprise industry framework industry contexts" /><div className="mt-6 space-y-3">
                {data.industryContexts.length === 0 ? <EmptyState title="No industry contexts" description="Create the first industry contexts record." /> : data.industryContexts.map((item) => (
                    <ListCard key={item.id} title={String(item.contextKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.contextType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry contexts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryContext(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("contextKey")} placeholder="contextKey" className={inputClass} />
                <input {...form.register("contextType")} placeholder="contextType" className={inputClass} />
                <input {...form.register("contextPayload")} placeholder="contextPayload" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AiContextsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<aiContextsFormValues>({ resolver: zodResolver(aiContextsFormSchema), defaultValues: {"frameworkHubId":"","contextKey":"","contextType":"","tokenCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Ai Contexts" description="Enterprise industry framework ai contexts" /><div className="mt-6 space-y-3">
                {data.aiContexts.length === 0 ? <EmptyState title="No ai contexts" description="Create the first ai contexts record." /> : data.aiContexts.map((item) => (
                    <ListCard key={item.id} title={String(item.contextKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.contextType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ai contexts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAiContext(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("contextKey")} placeholder="contextKey" className={inputClass} />
                <input {...form.register("contextType")} placeholder="contextType" className={inputClass} />
                <input type="number" step="any" {...form.register("tokenCount", { valueAsNumber: true })} placeholder="tokenCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TerminologyEntrysPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<terminologyEntriesFormValues>({ resolver: zodResolver(terminologyEntriesFormSchema), defaultValues: {"frameworkHubId":"","termKey":"","termLabel":"","termDefinition":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Terminology Entries" description="Enterprise industry framework terminology entries" /><div className="mt-6 space-y-3">
                {data.terminologyEntries.length === 0 ? <EmptyState title="No terminology entries" description="Create the first terminology entries record." /> : data.terminologyEntries.map((item) => (
                    <ListCard key={item.id} title={String(item.termLabel)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.termKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create terminology entries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTerminologyEntry(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("termKey")} placeholder="termKey" className={inputClass} />
                <input {...form.register("termLabel")} placeholder="termLabel" className={inputClass} />
                <input {...form.register("termDefinition")} placeholder="termDefinition" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DemoProfilesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<demoProfilesFormValues>({ resolver: zodResolver(demoProfilesFormSchema), defaultValues: {"frameworkHubId":"","profileKey":"","profileName":"","demoDurationDays":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Demo Profiles" description="Enterprise industry framework demo profiles" /><div className="mt-6 space-y-3">
                {data.demoProfiles.length === 0 ? <EmptyState title="No demo profiles" description="Create the first demo profiles record." /> : data.demoProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.demoDurationDays}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create demo profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDemoProfile(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input type="number" step="any" {...form.register("demoDurationDays", { valueAsNumber: true })} placeholder="demoDurationDays" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProductionProfilesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<productionProfilesFormValues>({ resolver: zodResolver(productionProfilesFormSchema), defaultValues: {"frameworkHubId":"","profileKey":"","profileName":"","deploymentTarget":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Production Profiles" description="Enterprise industry framework production profiles" /><div className="mt-6 space-y-3">
                {data.productionProfiles.length === 0 ? <EmptyState title="No production profiles" description="Create the first production profiles record." /> : data.productionProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deploymentTarget}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create production profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProductionProfile(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("deploymentTarget")} placeholder="deploymentTarget" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EnterpriseProfilesPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<enterpriseProfilesFormValues>({ resolver: zodResolver(enterpriseProfilesFormSchema), defaultValues: {"frameworkHubId":"","profileKey":"","profileName":"","complianceTier":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Enterprise Profiles" description="Enterprise industry framework enterprise profiles" /><div className="mt-6 space-y-3">
                {data.enterpriseProfiles.length === 0 ? <EmptyState title="No enterprise profiles" description="Create the first enterprise profiles record." /> : data.enterpriseProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.complianceTier}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create enterprise profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEnterpriseProfile(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("complianceTier")} placeholder="complianceTier" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SharedApisPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<sharedApisFormValues>({ resolver: zodResolver(sharedApisFormSchema), defaultValues: {"frameworkHubId":"","apiKey":"","apiName":"","apiVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Shared Apis" description="Enterprise industry framework shared apis" /><div className="mt-6 space-y-3">
                {data.sharedApis.length === 0 ? <EmptyState title="No shared apis" description="Create the first shared apis record." /> : data.sharedApis.map((item) => (
                    <ListCard key={item.id} title={String(item.apiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.apiVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create shared apis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSharedApi(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("apiKey")} placeholder="apiKey" className={inputClass} />
                <input {...form.register("apiName")} placeholder="apiName" className={inputClass} />
                <input {...form.register("apiVersion")} placeholder="apiVersion" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ContextApisPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<contextApisFormValues>({ resolver: zodResolver(contextApisFormSchema), defaultValues: {"frameworkHubId":"","apiKey":"","apiName":"","contextType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Context Apis" description="Enterprise industry framework context apis" /><div className="mt-6 space-y-3">
                {data.contextApis.length === 0 ? <EmptyState title="No context apis" description="Create the first context apis record." /> : data.contextApis.map((item) => (
                    <ListCard key={item.id} title={String(item.apiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.contextType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create context apis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createContextApi(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("apiKey")} placeholder="apiKey" className={inputClass} />
                <input {...form.register("apiName")} placeholder="apiName" className={inputClass} />
                <input {...form.register("contextType")} placeholder="contextType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ConfigurationApisPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<configurationApisFormValues>({ resolver: zodResolver(configurationApisFormSchema), defaultValues: {"frameworkHubId":"","apiKey":"","apiName":"","configScope":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Configuration Apis" description="Enterprise industry framework configuration apis" /><div className="mt-6 space-y-3">
                {data.configurationApis.length === 0 ? <EmptyState title="No configuration apis" description="Create the first configuration apis record." /> : data.configurationApis.map((item) => (
                    <ListCard key={item.id} title={String(item.apiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.configScope}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create configuration apis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createConfigurationApi(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("apiKey")} placeholder="apiKey" className={inputClass} />
                <input {...form.register("apiName")} placeholder="apiName" className={inputClass} />
                <input {...form.register("configScope")} placeholder="configScope" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExtensionPointsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<extensionPointsFormValues>({ resolver: zodResolver(extensionPointsFormSchema), defaultValues: {"frameworkHubId":"","extensionKey":"","extensionName":"","hookType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Extension Points" description="Enterprise industry framework extension points" /><div className="mt-6 space-y-3">
                {data.extensionPoints.length === 0 ? <EmptyState title="No extension points" description="Create the first extension points record." /> : data.extensionPoints.map((item) => (
                    <ListCard key={item.id} title={String(item.extensionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hookType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create extension points" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExtensionPoint(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("extensionKey")} placeholder="extensionKey" className={inputClass} />
                <input {...form.register("extensionName")} placeholder="extensionName" className={inputClass} />
                <input {...form.register("hookType")} placeholder="hookType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FrameworkMetricsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<frameworkMetricsFormValues>({ resolver: zodResolver(frameworkMetricsFormSchema), defaultValues: {"metricsKey":"","templateScore":0,"overallFrameworkScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Framework Metrics" description="Enterprise industry framework framework metrics" /><div className="mt-6 space-y-3">
                {data.frameworkMetrics.length === 0 ? <EmptyState title="No framework metrics" description="Create the first framework metrics record." /> : data.frameworkMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallFrameworkScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create framework metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFrameworkMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("templateScore", { valueAsNumber: true })} placeholder="templateScore" className={inputClass} />
                <input type="number" step="any" {...form.register("overallFrameworkScore", { valueAsNumber: true })} placeholder="overallFrameworkScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FrameworkHealthsPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<frameworkHealthFormValues>({ resolver: zodResolver(frameworkHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Framework Health" description="Enterprise industry framework framework health" /><div className="mt-6 space-y-3">
                {data.frameworkHealth.length === 0 ? <EmptyState title="No framework health" description="Create the first framework health record." /> : data.frameworkHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create framework health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFrameworkHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CompatibilityChecksPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<compatibilityChecksFormValues>({ resolver: zodResolver(compatibilityChecksFormSchema), defaultValues: {"frameworkHubId":"","checkKey":"","checkType":"","checkScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compatibility Checks" description="Enterprise industry framework compatibility checks" /><div className="mt-6 space-y-3">
                {data.compatibilityChecks.length === 0 ? <EmptyState title="No compatibility checks" description="Create the first compatibility checks record." /> : data.compatibilityChecks.map((item) => (
                    <ListCard key={item.id} title={String(item.checkKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.checkType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compatibility checks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompatibilityCheck(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("checkKey")} placeholder="checkKey" className={inputClass} />
                <input {...form.register("checkType")} placeholder="checkType" className={inputClass} />
                <input type="number" step="any" {...form.register("checkScore", { valueAsNumber: true })} placeholder="checkScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FrameworkFailuresPanel({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<frameworkFailuresFormValues>({ resolver: zodResolver(frameworkFailuresFormSchema), defaultValues: {"frameworkHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Framework Failures" description="Enterprise industry framework framework failures" /><div className="mt-6 space-y-3">
                {data.frameworkFailures.length === 0 ? <EmptyState title="No framework failures" description="Create the first framework failures record." /> : data.frameworkFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create framework failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFrameworkFailure(v))}>
                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryFrameworkAuditLogsPanel({ data }: { data: IndustryFrameworkData }) {
    return (
        <Card hover><SectionHeader title="Industry Framework audit history" description="Security-first audit trail for jobs, events, compatibilityChecks, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for industry framework." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function IndustryFrameworkSdkPanel({ data }: { data: IndustryFrameworkData }) {
    return (
        <Card hover><SectionHeader title="Shared Industry Framework SDK" description="Import from @/src/modules/industry-framework/sdk for industry registration, template configuration, and compatibility check" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createIndustryFrameworkClient()" subtitle="Factory for module-scoped Industry Framework client with auth context" meta="Primary SDK for enterprise industry framework" />
            <ListCard title="sdkRegisterIndustry()" subtitle="Register industry profile with AI orchestration" meta="moduleSource: industry_framework" />
            <ListCard title="sdkConfigureTemplate()" subtitle="Configure industry template with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunCompatibilityCheck()" subtitle="Run compatibility check with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {IFR_THEME.primary} • Integration hubs loaded: {data.frameworkHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";

const intg = createIndustryFrameworkClient(userId, email, fullName);
await intg.registerIndustry({ frameworkHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureTemplate({ frameworkHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runCompatibilityCheck({ frameworkHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
