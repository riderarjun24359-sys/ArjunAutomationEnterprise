"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { DFE_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/form-engine/constants";
import type { useFormEngine } from "@/src/modules/form-engine/hooks/useFormEngine";
import {
    formHubsFormSchema,
    type formHubsFormValues,
    formDefinitionsFormSchema,
    type formDefinitionsFormValues,
    formCategoriesFormSchema,
    type formCategoriesFormValues,
    formVersionsFormSchema,
    type formVersionsFormValues,
    formDependenciesFormSchema,
    type formDependenciesFormValues,
    formSectionsFormSchema,
    type formSectionsFormValues,
    formTabsFormSchema,
    type formTabsFormValues,
    formGroupsFormSchema,
    type formGroupsFormValues,
    repeatableSectionsFormSchema,
    type repeatableSectionsFormValues,
    formFieldsFormSchema,
    type formFieldsFormValues,
    fieldOptionsFormSchema,
    type fieldOptionsFormValues,
    formulaFieldsFormSchema,
    type formulaFieldsFormValues,
    mediaFieldsFormSchema,
    type mediaFieldsFormValues,
    requiredRulesFormSchema,
    type requiredRulesFormValues,
    regexRulesFormSchema,
    type regexRulesFormValues,
    rangeRulesFormSchema,
    type rangeRulesFormValues,
    crossFieldRulesFormSchema,
    type crossFieldRulesFormValues,
    formDraftsFormSchema,
    type formDraftsFormValues,
    formSubmissionsFormSchema,
    type formSubmissionsFormValues,
    formReviewsFormSchema,
    type formReviewsFormValues,
    executionAuditEntriesFormSchema,
    type executionAuditEntriesFormValues,
    renderProfilesFormSchema,
    type renderProfilesFormValues,
    themeConfigsFormSchema,
    type themeConfigsFormValues,
    localizationPacksFormSchema,
    type localizationPacksFormValues,
    submissionAnalyticsFormSchema,
    type submissionAnalyticsFormValues,
    completionMetricsFormSchema,
    type completionMetricsFormValues,
    usageTrendsFormSchema,
    type usageTrendsFormValues,
    formMetricsFormSchema,
    type formMetricsFormValues,
    formHealthFormSchema,
    type formHealthFormValues,
    pendingReviewItemsFormSchema,
    type pendingReviewItemsFormValues,
    formFailuresFormSchema,
    type formFailuresFormValues,
} from "@/src/modules/form-engine/schemas";

type FormEngineData = ReturnType<typeof useFormEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-amber-600">{meta}</p> : null}</div>;
}
function FormHubSelect({ data, ...props }: { data: FormEngineData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select form engine</option>{data.formHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function FormEngineOverviewPanel({ data }: { data: FormEngineData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Form Engine summary" description="System health, background jobs, event bus, pendingReviewItems, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Form Hubs" subtitle={`${data.stats?.totalFormHubs ?? 0} total`} meta={`${data.stats?.activeFormHubs ?? 0} active • ${data.stats?.formSectionCount ?? 0} form sections`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.requiredRuleCount ?? 0} required rules`} meta={`${data.stats?.formSubmissionCount ?? 0} form submissions • ${data.stats?.openPendingReviewCount ?? 0} open pending review items`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallFormScore ?? 0).toFixed(1)} overall form score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first form engine" />
            </div></Card>
            <Card hover><SectionHeader title="Form engine pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Form engine pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function FormHubsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formHubsFormValues>({ resolver: zodResolver(formHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Hubs" description="Enterprise form engine form hubs" /><div className="mt-6 space-y-3">
                {data.formHubs.length === 0 ? <EmptyState title="No form hubs" description="Create the first form hubs record." /> : data.formHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormDefinitionsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formDefinitionsFormValues>({ resolver: zodResolver(formDefinitionsFormSchema), defaultValues: {"formHubId":"","formKey":"","formName":"","formType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Definitions" description="Enterprise form engine form definitions" /><div className="mt-6 space-y-3">
                {data.formDefinitions.length === 0 ? <EmptyState title="No form definitions" description="Create the first form definitions record." /> : data.formDefinitions.map((item) => (
                    <ListCard key={item.id} title={String(item.formName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.formType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form definitions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormDefinition(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("formKey")} placeholder="formKey" className={inputClass} />
                <input {...form.register("formName")} placeholder="formName" className={inputClass} />
                <input {...form.register("formType")} placeholder="formType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormCategorysPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formCategoriesFormValues>({ resolver: zodResolver(formCategoriesFormSchema), defaultValues: {"formHubId":"","categoryKey":"","categoryName":"","categoryType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Categories" description="Enterprise form engine form categories" /><div className="mt-6 space-y-3">
                {data.formCategories.length === 0 ? <EmptyState title="No form categories" description="Create the first form categories record." /> : data.formCategories.map((item) => (
                    <ListCard key={item.id} title={String(item.categoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.categoryType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form categories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormCategory(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("categoryKey")} placeholder="categoryKey" className={inputClass} />
                <input {...form.register("categoryName")} placeholder="categoryName" className={inputClass} />
                <input {...form.register("categoryType")} placeholder="categoryType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormVersionsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formVersionsFormValues>({ resolver: zodResolver(formVersionsFormSchema), defaultValues: {"formHubId":"","versionKey":"","versionNumber":"","releaseChannel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Versions" description="Enterprise form engine form versions" /><div className="mt-6 space-y-3">
                {data.formVersions.length === 0 ? <EmptyState title="No form versions" description="Create the first form versions record." /> : data.formVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.releaseChannel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormVersion(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <select {...form.register("releaseChannel")} className={inputClass}>{RELEASE_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormDependencysPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formDependenciesFormValues>({ resolver: zodResolver(formDependenciesFormSchema), defaultValues: {"formHubId":"","dependencyKey":"","dependencyType":"","dependencyRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Dependencies" description="Enterprise form engine form dependencies" /><div className="mt-6 space-y-3">
                {data.formDependencies.length === 0 ? <EmptyState title="No form dependencies" description="Create the first form dependencies record." /> : data.formDependencies.map((item) => (
                    <ListCard key={item.id} title={String(item.dependencyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dependencyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form dependencies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormDependency(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("dependencyKey")} placeholder="dependencyKey" className={inputClass} />
                <input {...form.register("dependencyType")} placeholder="dependencyType" className={inputClass} />
                <input {...form.register("dependencyRef")} placeholder="dependencyRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormSectionsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formSectionsFormValues>({ resolver: zodResolver(formSectionsFormSchema), defaultValues: {"formHubId":"","sectionKey":"","sectionName":"","sectionOrder":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Sections" description="Enterprise form engine form sections" /><div className="mt-6 space-y-3">
                {data.formSections.length === 0 ? <EmptyState title="No form sections" description="Create the first form sections record." /> : data.formSections.map((item) => (
                    <ListCard key={item.id} title={String(item.sectionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.sectionOrder}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form sections" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormSection(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("sectionKey")} placeholder="sectionKey" className={inputClass} />
                <input {...form.register("sectionName")} placeholder="sectionName" className={inputClass} />
                <input type="number" step="any" {...form.register("sectionOrder", { valueAsNumber: true })} placeholder="sectionOrder" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormTabsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formTabsFormValues>({ resolver: zodResolver(formTabsFormSchema), defaultValues: {"formHubId":"","tabKey":"","tabName":"","tabOrder":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Tabs" description="Enterprise form engine form tabs" /><div className="mt-6 space-y-3">
                {data.formTabs.length === 0 ? <EmptyState title="No form tabs" description="Create the first form tabs record." /> : data.formTabs.map((item) => (
                    <ListCard key={item.id} title={String(item.tabName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.tabOrder}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form tabs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormTab(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("tabKey")} placeholder="tabKey" className={inputClass} />
                <input {...form.register("tabName")} placeholder="tabName" className={inputClass} />
                <input type="number" step="any" {...form.register("tabOrder", { valueAsNumber: true })} placeholder="tabOrder" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormGroupsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formGroupsFormValues>({ resolver: zodResolver(formGroupsFormSchema), defaultValues: {"formHubId":"","groupKey":"","groupName":"","groupOrder":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Groups" description="Enterprise form engine form groups" /><div className="mt-6 space-y-3">
                {data.formGroups.length === 0 ? <EmptyState title="No form groups" description="Create the first form groups record." /> : data.formGroups.map((item) => (
                    <ListCard key={item.id} title={String(item.groupName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.groupOrder}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form groups" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormGroup(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("groupKey")} placeholder="groupKey" className={inputClass} />
                <input {...form.register("groupName")} placeholder="groupName" className={inputClass} />
                <input type="number" step="any" {...form.register("groupOrder", { valueAsNumber: true })} placeholder="groupOrder" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RepeatableSectionsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<repeatableSectionsFormValues>({ resolver: zodResolver(repeatableSectionsFormSchema), defaultValues: {"formHubId":"","sectionKey":"","sectionName":"","minInstances":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Repeatable Sections" description="Enterprise form engine repeatable sections" /><div className="mt-6 space-y-3">
                {data.repeatableSections.length === 0 ? <EmptyState title="No repeatable sections" description="Create the first repeatable sections record." /> : data.repeatableSections.map((item) => (
                    <ListCard key={item.id} title={String(item.sectionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.minInstances}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create repeatable sections" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRepeatableSection(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("sectionKey")} placeholder="sectionKey" className={inputClass} />
                <input {...form.register("sectionName")} placeholder="sectionName" className={inputClass} />
                <input type="number" step="any" {...form.register("minInstances", { valueAsNumber: true })} placeholder="minInstances" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormFieldsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formFieldsFormValues>({ resolver: zodResolver(formFieldsFormSchema), defaultValues: {"formHubId":"","fieldKey":"","fieldName":"","fieldType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Fields" description="Enterprise form engine form fields" /><div className="mt-6 space-y-3">
                {data.formFields.length === 0 ? <EmptyState title="No form fields" description="Create the first form fields record." /> : data.formFields.map((item) => (
                    <ListCard key={item.id} title={String(item.fieldName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.fieldType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form fields" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormField(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("fieldKey")} placeholder="fieldKey" className={inputClass} />
                <input {...form.register("fieldName")} placeholder="fieldName" className={inputClass} />
                <input {...form.register("fieldType")} placeholder="fieldType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FieldOptionsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<fieldOptionsFormValues>({ resolver: zodResolver(fieldOptionsFormSchema), defaultValues: {"formHubId":"","optionKey":"","optionLabel":"","optionValue":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Field Options" description="Enterprise form engine field options" /><div className="mt-6 space-y-3">
                {data.fieldOptions.length === 0 ? <EmptyState title="No field options" description="Create the first field options record." /> : data.fieldOptions.map((item) => (
                    <ListCard key={item.id} title={String(item.optionLabel)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.optionValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create field options" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFieldOption(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("optionKey")} placeholder="optionKey" className={inputClass} />
                <input {...form.register("optionLabel")} placeholder="optionLabel" className={inputClass} />
                <input {...form.register("optionValue")} placeholder="optionValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormulaFieldsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formulaFieldsFormValues>({ resolver: zodResolver(formulaFieldsFormSchema), defaultValues: {"formHubId":"","formulaKey":"","formulaName":"","formulaExpression":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Formula Fields" description="Enterprise form engine formula fields" /><div className="mt-6 space-y-3">
                {data.formulaFields.length === 0 ? <EmptyState title="No formula fields" description="Create the first formula fields record." /> : data.formulaFields.map((item) => (
                    <ListCard key={item.id} title={String(item.formulaName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.formulaExpression}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create formula fields" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormulaField(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("formulaKey")} placeholder="formulaKey" className={inputClass} />
                <input {...form.register("formulaName")} placeholder="formulaName" className={inputClass} />
                <input {...form.register("formulaExpression")} placeholder="formulaExpression" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MediaFieldsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<mediaFieldsFormValues>({ resolver: zodResolver(mediaFieldsFormSchema), defaultValues: {"formHubId":"","mediaKey":"","mediaName":"","mediaType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Media Fields" description="Enterprise form engine media fields" /><div className="mt-6 space-y-3">
                {data.mediaFields.length === 0 ? <EmptyState title="No media fields" description="Create the first media fields record." /> : data.mediaFields.map((item) => (
                    <ListCard key={item.id} title={String(item.mediaName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.mediaType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create media fields" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMediaField(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("mediaKey")} placeholder="mediaKey" className={inputClass} />
                <input {...form.register("mediaName")} placeholder="mediaName" className={inputClass} />
                <input {...form.register("mediaType")} placeholder="mediaType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RequiredRulesPanel({ data }: { data: FormEngineData }) {
    const form = useForm<requiredRulesFormValues>({ resolver: zodResolver(requiredRulesFormSchema), defaultValues: {"formHubId":"","ruleKey":"","ruleName":"","fieldRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Required Rules" description="Enterprise form engine required rules" /><div className="mt-6 space-y-3">
                {data.requiredRules.length === 0 ? <EmptyState title="No required rules" description="Create the first required rules record." /> : data.requiredRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.fieldRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create required rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRequiredRule(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input {...form.register("fieldRef")} placeholder="fieldRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RegexRulesPanel({ data }: { data: FormEngineData }) {
    const form = useForm<regexRulesFormValues>({ resolver: zodResolver(regexRulesFormSchema), defaultValues: {"formHubId":"","ruleKey":"","ruleName":"","pattern":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Regex Rules" description="Enterprise form engine regex rules" /><div className="mt-6 space-y-3">
                {data.regexRules.length === 0 ? <EmptyState title="No regex rules" description="Create the first regex rules record." /> : data.regexRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.pattern}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create regex rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRegexRule(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input {...form.register("pattern")} placeholder="pattern" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RangeRulesPanel({ data }: { data: FormEngineData }) {
    const form = useForm<rangeRulesFormValues>({ resolver: zodResolver(rangeRulesFormSchema), defaultValues: {"formHubId":"","ruleKey":"","ruleName":"","minValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Range Rules" description="Enterprise form engine range rules" /><div className="mt-6 space-y-3">
                {data.rangeRules.length === 0 ? <EmptyState title="No range rules" description="Create the first range rules record." /> : data.rangeRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.minValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create range rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRangeRule(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input type="number" step="any" {...form.register("minValue", { valueAsNumber: true })} placeholder="minValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CrossFieldRulesPanel({ data }: { data: FormEngineData }) {
    const form = useForm<crossFieldRulesFormValues>({ resolver: zodResolver(crossFieldRulesFormSchema), defaultValues: {"formHubId":"","ruleKey":"","ruleName":"","ruleExpression":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cross Field Rules" description="Enterprise form engine cross field rules" /><div className="mt-6 space-y-3">
                {data.crossFieldRules.length === 0 ? <EmptyState title="No cross field rules" description="Create the first cross field rules record." /> : data.crossFieldRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ruleExpression}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create cross field rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCrossFieldRule(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input {...form.register("ruleExpression")} placeholder="ruleExpression" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormDraftsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formDraftsFormValues>({ resolver: zodResolver(formDraftsFormSchema), defaultValues: {"formHubId":"","draftKey":"","draftName":"","draftStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Drafts" description="Enterprise form engine form drafts" /><div className="mt-6 space-y-3">
                {data.formDrafts.length === 0 ? <EmptyState title="No form drafts" description="Create the first form drafts record." /> : data.formDrafts.map((item) => (
                    <ListCard key={item.id} title={String(item.draftName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.draftStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form drafts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormDraft(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("draftKey")} placeholder="draftKey" className={inputClass} />
                <input {...form.register("draftName")} placeholder="draftName" className={inputClass} />
                <input {...form.register("draftStatus")} placeholder="draftStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormSubmissionsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formSubmissionsFormValues>({ resolver: zodResolver(formSubmissionsFormSchema), defaultValues: {"formHubId":"","submissionKey":"","submissionName":"","submissionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Submissions" description="Enterprise form engine form submissions" /><div className="mt-6 space-y-3">
                {data.formSubmissions.length === 0 ? <EmptyState title="No form submissions" description="Create the first form submissions record." /> : data.formSubmissions.map((item) => (
                    <ListCard key={item.id} title={String(item.submissionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.submissionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form submissions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormSubmission(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("submissionKey")} placeholder="submissionKey" className={inputClass} />
                <input {...form.register("submissionName")} placeholder="submissionName" className={inputClass} />
                <input {...form.register("submissionStatus")} placeholder="submissionStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormReviewsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formReviewsFormValues>({ resolver: zodResolver(formReviewsFormSchema), defaultValues: {"formHubId":"","reviewKey":"","reviewName":"","reviewStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Reviews" description="Enterprise form engine form reviews" /><div className="mt-6 space-y-3">
                {data.formReviews.length === 0 ? <EmptyState title="No form reviews" description="Create the first form reviews record." /> : data.formReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reviewStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormReview(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("reviewName")} placeholder="reviewName" className={inputClass} />
                <input {...form.register("reviewStatus")} placeholder="reviewStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionAuditEntrysPanel({ data }: { data: FormEngineData }) {
    const form = useForm<executionAuditEntriesFormValues>({ resolver: zodResolver(executionAuditEntriesFormSchema), defaultValues: {"formHubId":"","auditKey":"","auditType":"","auditSummary":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution Audit Entries" description="Enterprise form engine execution audit entries" /><div className="mt-6 space-y-3">
                {data.executionAuditEntries.length === 0 ? <EmptyState title="No execution audit entries" description="Create the first execution audit entries record." /> : data.executionAuditEntries.map((item) => (
                    <ListCard key={item.id} title={String(item.auditKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.auditType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution audit entries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionAuditEntry(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("auditKey")} placeholder="auditKey" className={inputClass} />
                <input {...form.register("auditType")} placeholder="auditType" className={inputClass} />
                <input {...form.register("auditSummary")} placeholder="auditSummary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenderProfilesPanel({ data }: { data: FormEngineData }) {
    const form = useForm<renderProfilesFormValues>({ resolver: zodResolver(renderProfilesFormSchema), defaultValues: {"formHubId":"","profileKey":"","profileName":"","profileType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Render Profiles" description="Enterprise form engine render profiles" /><div className="mt-6 space-y-3">
                {data.renderProfiles.length === 0 ? <EmptyState title="No render profiles" description="Create the first render profiles record." /> : data.renderProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create render profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenderProfile(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("profileType")} placeholder="profileType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ThemeConfigsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<themeConfigsFormValues>({ resolver: zodResolver(themeConfigsFormSchema), defaultValues: {"formHubId":"","themeKey":"","themeName":"","primaryColor":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Theme Configs" description="Enterprise form engine theme configs" /><div className="mt-6 space-y-3">
                {data.themeConfigs.length === 0 ? <EmptyState title="No theme configs" description="Create the first theme configs record." /> : data.themeConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.themeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.primaryColor}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create theme configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createThemeConfig(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("themeKey")} placeholder="themeKey" className={inputClass} />
                <input {...form.register("themeName")} placeholder="themeName" className={inputClass} />
                <input {...form.register("primaryColor")} placeholder="primaryColor" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LocalizationPacksPanel({ data }: { data: FormEngineData }) {
    const form = useForm<localizationPacksFormValues>({ resolver: zodResolver(localizationPacksFormSchema), defaultValues: {"formHubId":"","localeKey":"","localeCode":"","localeName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Localization Packs" description="Enterprise form engine localization packs" /><div className="mt-6 space-y-3">
                {data.localizationPacks.length === 0 ? <EmptyState title="No localization packs" description="Create the first localization packs record." /> : data.localizationPacks.map((item) => (
                    <ListCard key={item.id} title={String(item.localeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.localeCode}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create localization packs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLocalizationPack(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("localeKey")} placeholder="localeKey" className={inputClass} />
                <input {...form.register("localeCode")} placeholder="localeCode" className={inputClass} />
                <input {...form.register("localeName")} placeholder="localeName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubmissionAnalyticssPanel({ data }: { data: FormEngineData }) {
    const form = useForm<submissionAnalyticsFormValues>({ resolver: zodResolver(submissionAnalyticsFormSchema), defaultValues: {"formHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Submission Analytics" description="Enterprise form engine submission analytics" /><div className="mt-6 space-y-3">
                {data.submissionAnalytics.length === 0 ? <EmptyState title="No submission analytics" description="Create the first submission analytics record." /> : data.submissionAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create submission analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubmissionAnalytics(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CompletionMetricsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<completionMetricsFormValues>({ resolver: zodResolver(completionMetricsFormSchema), defaultValues: {"formHubId":"","metricKey":"","metricName":"","completionRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Completion Metrics" description="Enterprise form engine completion metrics" /><div className="mt-6 space-y-3">
                {data.completionMetrics.length === 0 ? <EmptyState title="No completion metrics" description="Create the first completion metrics record." /> : data.completionMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.completionRate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create completion metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompletionMetric(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("metricKey")} placeholder="metricKey" className={inputClass} />
                <input {...form.register("metricName")} placeholder="metricName" className={inputClass} />
                <input type="number" step="any" {...form.register("completionRate", { valueAsNumber: true })} placeholder="completionRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function UsageTrendsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<usageTrendsFormValues>({ resolver: zodResolver(usageTrendsFormSchema), defaultValues: {"formHubId":"","trendKey":"","trendName":"","trendValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Usage Trends" description="Enterprise form engine usage trends" /><div className="mt-6 space-y-3">
                {data.usageTrends.length === 0 ? <EmptyState title="No usage trends" description="Create the first usage trends record." /> : data.usageTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.trendValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create usage trends" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUsageTrend(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("trendKey")} placeholder="trendKey" className={inputClass} />
                <input {...form.register("trendName")} placeholder="trendName" className={inputClass} />
                <input type="number" step="any" {...form.register("trendValue", { valueAsNumber: true })} placeholder="trendValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormMetricsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formMetricsFormValues>({ resolver: zodResolver(formMetricsFormSchema), defaultValues: {"metricsKey":"","submissionCount":0,"overallFormScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Metrics" description="Enterprise form engine form metrics" /><div className="mt-6 space-y-3">
                {data.formMetrics.length === 0 ? <EmptyState title="No form metrics" description="Create the first form metrics record." /> : data.formMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallFormScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("submissionCount", { valueAsNumber: true })} placeholder="submissionCount" className={inputClass} />
                <input type="number" step="any" {...form.register("overallFormScore", { valueAsNumber: true })} placeholder="overallFormScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormHealthsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formHealthFormValues>({ resolver: zodResolver(formHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Health" description="Enterprise form engine form health" /><div className="mt-6 space-y-3">
                {data.formHealth.length === 0 ? <EmptyState title="No form health" description="Create the first form health record." /> : data.formHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PendingReviewItemsPanel({ data }: { data: FormEngineData }) {
    const form = useForm<pendingReviewItemsFormValues>({ resolver: zodResolver(pendingReviewItemsFormSchema), defaultValues: {"formHubId":"","itemKey":"","itemName":"","reviewType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pending Review Items" description="Enterprise form engine pending review items" /><div className="mt-6 space-y-3">
                {data.pendingReviewItems.length === 0 ? <EmptyState title="No pending review items" description="Create the first pending review items record." /> : data.pendingReviewItems.map((item) => (
                    <ListCard key={item.id} title={String(item.itemName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reviewType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pending review items" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPendingReviewItem(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("itemKey")} placeholder="itemKey" className={inputClass} />
                <input {...form.register("itemName")} placeholder="itemName" className={inputClass} />
                <input {...form.register("reviewType")} placeholder="reviewType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormFailuresPanel({ data }: { data: FormEngineData }) {
    const form = useForm<formFailuresFormValues>({ resolver: zodResolver(formFailuresFormSchema), defaultValues: {"formHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Form Failures" description="Enterprise form engine form failures" /><div className="mt-6 space-y-3">
                {data.formFailures.length === 0 ? <EmptyState title="No form failures" description="Create the first form failures record." /> : data.formFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create form failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFormFailure(v))}>
                <FormHubSelect data={data} {...form.register("formHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FormEngineAuditLogsPanel({ data }: { data: FormEngineData }) {
    return (
        <Card hover><SectionHeader title="Form Engine audit history" description="Security-first audit trail for jobs, events, pendingReviewItems, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for form engine." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function FormEngineSdkPanel({ data }: { data: FormEngineData }) {
    return (
        <Card hover><SectionHeader title="Shared Form Engine SDK" description="Import from @/src/modules/form-engine/sdk for form registration, validation configuration, and form submission" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createFormEngineClient()" subtitle="Factory for module-scoped Form Engine client with auth context" meta="Primary SDK for enterprise form engine" />
            <ListCard title="sdkRegisterForm()" subtitle="Register form engine with AI orchestration" meta="moduleSource: dynamic_form_engine" />
            <ListCard title="sdkConfigureValidation()" subtitle="Configure validation rule with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunFormSubmission()" subtitle="Run form submission with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {DFE_THEME.primary} • Integration hubs loaded: {data.formHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createFormEngineClient } from "@/src/modules/form-engine/sdk";

const intg = createFormEngineClient(userId, email, fullName);
await intg.registerForm({ formHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureValidation({ formHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runFormSubmission({ formHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
