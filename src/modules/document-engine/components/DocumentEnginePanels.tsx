"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { DDE_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/document-engine/constants";
import type { useDocumentEngine } from "@/src/modules/document-engine/hooks/useDocumentEngine";
import {
    documentHubsFormSchema,
    type documentHubsFormValues,
    documentTypesFormSchema,
    type documentTypesFormValues,
    documentCategoriesFormSchema,
    type documentCategoriesFormValues,
    documentTemplatesFormSchema,
    type documentTemplatesFormValues,
    documentVersionsFormSchema,
    type documentVersionsFormValues,
    templateHeadersFormSchema,
    type templateHeadersFormValues,
    templateFootersFormSchema,
    type templateFootersFormValues,
    templateSectionsFormSchema,
    type templateSectionsFormValues,
    templateVariablesFormSchema,
    type templateVariablesFormValues,
    pdfGenerationsFormSchema,
    type pdfGenerationsFormValues,
    htmlGenerationsFormSchema,
    type htmlGenerationsFormValues,
    exportJobsFormSchema,
    type exportJobsFormValues,
    batchGenerationsFormSchema,
    type batchGenerationsFormValues,
    electronicSignaturesFormSchema,
    type electronicSignaturesFormValues,
    approvalSignaturesFormSchema,
    type approvalSignaturesFormValues,
    signatureVerificationsFormSchema,
    type signatureVerificationsFormValues,
    signatureAuditEntriesFormSchema,
    type signatureAuditEntriesFormValues,
    versionHistoriesFormSchema,
    type versionHistoriesFormValues,
    retentionPoliciesFormSchema,
    type retentionPoliciesFormValues,
    archiveRecordsFormSchema,
    type archiveRecordsFormValues,
    sharingPoliciesFormSchema,
    type sharingPoliciesFormValues,
    emailDeliveriesFormSchema,
    type emailDeliveriesFormValues,
    downloadDeliveriesFormSchema,
    type downloadDeliveriesFormValues,
    webhookDeliveriesFormSchema,
    type webhookDeliveriesFormValues,
    generationAnalyticsFormSchema,
    type generationAnalyticsFormValues,
    deliveryAnalyticsFormSchema,
    type deliveryAnalyticsFormValues,
    storageAnalyticsFormSchema,
    type storageAnalyticsFormValues,
    documentMetricsFormSchema,
    type documentMetricsFormValues,
    documentHealthFormSchema,
    type documentHealthFormValues,
    pendingSignaturesFormSchema,
    type pendingSignaturesFormValues,
    documentFailuresFormSchema,
    type documentFailuresFormValues,
} from "@/src/modules/document-engine/schemas";

type DocumentEngineData = ReturnType<typeof useDocumentEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-fuchsia-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-fuchsia-600">{meta}</p> : null}</div>;
}
function DocumentHubSelect({ data, ...props }: { data: DocumentEngineData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select document engine</option>{data.documentHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function DocumentEngineOverviewPanel({ data }: { data: DocumentEngineData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Document Engine summary" description="System health, background jobs, event bus, pendingSignatures, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Document Hubs" subtitle={`${data.stats?.totalDocumentHubs ?? 0} total`} meta={`${data.stats?.activeDocumentHubs ?? 0} active • ${data.stats?.templateSectionCount ?? 0} template sections`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.retentionPolicyCount ?? 0} retention policies`} meta={`${data.stats?.pdfGenerationCount ?? 0} pdf generations • ${data.stats?.openPendingSignatureCount ?? 0} open pending signatures`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallDocumentScore ?? 0).toFixed(1)} overall document score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first document engine" />
            </div></Card>
            <Card hover><SectionHeader title="Document engine pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Document engine pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function DocumentHubsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentHubsFormValues>({ resolver: zodResolver(documentHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Hubs" description="Enterprise document engine document hubs" /><div className="mt-6 space-y-3">
                {data.documentHubs.length === 0 ? <EmptyState title="No document hubs" description="Create the first document hubs record." /> : data.documentHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentTypesPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentTypesFormValues>({ resolver: zodResolver(documentTypesFormSchema), defaultValues: {"documentHubId":"","typeKey":"","typeName":"","typeCategory":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Types" description="Enterprise document engine document types" /><div className="mt-6 space-y-3">
                {data.documentTypes.length === 0 ? <EmptyState title="No document types" description="Create the first document types record." /> : data.documentTypes.map((item) => (
                    <ListCard key={item.id} title={String(item.typeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.typeCategory}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document types" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentType(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("typeKey")} placeholder="typeKey" className={inputClass} />
                <input {...form.register("typeName")} placeholder="typeName" className={inputClass} />
                <input {...form.register("typeCategory")} placeholder="typeCategory" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentCategorysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentCategoriesFormValues>({ resolver: zodResolver(documentCategoriesFormSchema), defaultValues: {"documentHubId":"","categoryKey":"","categoryName":"","categoryType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Categories" description="Enterprise document engine document categories" /><div className="mt-6 space-y-3">
                {data.documentCategories.length === 0 ? <EmptyState title="No document categories" description="Create the first document categories record." /> : data.documentCategories.map((item) => (
                    <ListCard key={item.id} title={String(item.categoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.categoryType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document categories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentCategory(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("categoryKey")} placeholder="categoryKey" className={inputClass} />
                <input {...form.register("categoryName")} placeholder="categoryName" className={inputClass} />
                <input {...form.register("categoryType")} placeholder="categoryType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentTemplatesPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentTemplatesFormValues>({ resolver: zodResolver(documentTemplatesFormSchema), defaultValues: {"documentHubId":"","templateKey":"","templateName":"","templateType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Templates" description="Enterprise document engine document templates" /><div className="mt-6 space-y-3">
                {data.documentTemplates.length === 0 ? <EmptyState title="No document templates" description="Create the first document templates record." /> : data.documentTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentTemplate(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <input {...form.register("templateType")} placeholder="templateType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentVersionsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentVersionsFormValues>({ resolver: zodResolver(documentVersionsFormSchema), defaultValues: {"documentHubId":"","versionKey":"","versionNumber":"","releaseChannel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Versions" description="Enterprise document engine document versions" /><div className="mt-6 space-y-3">
                {data.documentVersions.length === 0 ? <EmptyState title="No document versions" description="Create the first document versions record." /> : data.documentVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.releaseChannel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentVersion(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <select {...form.register("releaseChannel")} className={inputClass}>{RELEASE_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemplateHeadersPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<templateHeadersFormValues>({ resolver: zodResolver(templateHeadersFormSchema), defaultValues: {"documentHubId":"","headerKey":"","headerName":"","headerContent":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Template Headers" description="Enterprise document engine template headers" /><div className="mt-6 space-y-3">
                {data.templateHeaders.length === 0 ? <EmptyState title="No template headers" description="Create the first template headers record." /> : data.templateHeaders.map((item) => (
                    <ListCard key={item.id} title={String(item.headerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.headerKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template headers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplateHeader(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("headerKey")} placeholder="headerKey" className={inputClass} />
                <input {...form.register("headerName")} placeholder="headerName" className={inputClass} />
                <input {...form.register("headerContent")} placeholder="headerContent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemplateFootersPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<templateFootersFormValues>({ resolver: zodResolver(templateFootersFormSchema), defaultValues: {"documentHubId":"","footerKey":"","footerName":"","footerContent":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Template Footers" description="Enterprise document engine template footers" /><div className="mt-6 space-y-3">
                {data.templateFooters.length === 0 ? <EmptyState title="No template footers" description="Create the first template footers record." /> : data.templateFooters.map((item) => (
                    <ListCard key={item.id} title={String(item.footerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.footerKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template footers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplateFooter(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("footerKey")} placeholder="footerKey" className={inputClass} />
                <input {...form.register("footerName")} placeholder="footerName" className={inputClass} />
                <input {...form.register("footerContent")} placeholder="footerContent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemplateSectionsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<templateSectionsFormValues>({ resolver: zodResolver(templateSectionsFormSchema), defaultValues: {"documentHubId":"","sectionKey":"","sectionName":"","sectionType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Template Sections" description="Enterprise document engine template sections" /><div className="mt-6 space-y-3">
                {data.templateSections.length === 0 ? <EmptyState title="No template sections" description="Create the first template sections record." /> : data.templateSections.map((item) => (
                    <ListCard key={item.id} title={String(item.sectionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.sectionType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template sections" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplateSection(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("sectionKey")} placeholder="sectionKey" className={inputClass} />
                <input {...form.register("sectionName")} placeholder="sectionName" className={inputClass} />
                <input {...form.register("sectionType")} placeholder="sectionType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemplateVariablesPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<templateVariablesFormValues>({ resolver: zodResolver(templateVariablesFormSchema), defaultValues: {"documentHubId":"","variableKey":"","variableName":"","variableType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Template Variables" description="Enterprise document engine template variables" /><div className="mt-6 space-y-3">
                {data.templateVariables.length === 0 ? <EmptyState title="No template variables" description="Create the first template variables record." /> : data.templateVariables.map((item) => (
                    <ListCard key={item.id} title={String(item.variableName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.variableType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template variables" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplateVariable(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("variableKey")} placeholder="variableKey" className={inputClass} />
                <input {...form.register("variableName")} placeholder="variableName" className={inputClass} />
                <input {...form.register("variableType")} placeholder="variableType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PdfGenerationsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<pdfGenerationsFormValues>({ resolver: zodResolver(pdfGenerationsFormSchema), defaultValues: {"documentHubId":"","generationKey":"","generationName":"","generationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pdf Generations" description="Enterprise document engine pdf generations" /><div className="mt-6 space-y-3">
                {data.pdfGenerations.length === 0 ? <EmptyState title="No pdf generations" description="Create the first pdf generations record." /> : data.pdfGenerations.map((item) => (
                    <ListCard key={item.id} title={String(item.generationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pdf generations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPdfGeneration(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("generationKey")} placeholder="generationKey" className={inputClass} />
                <input {...form.register("generationName")} placeholder="generationName" className={inputClass} />
                <input {...form.register("generationStatus")} placeholder="generationStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HtmlGenerationsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<htmlGenerationsFormValues>({ resolver: zodResolver(htmlGenerationsFormSchema), defaultValues: {"documentHubId":"","generationKey":"","generationName":"","generationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Html Generations" description="Enterprise document engine html generations" /><div className="mt-6 space-y-3">
                {data.htmlGenerations.length === 0 ? <EmptyState title="No html generations" description="Create the first html generations record." /> : data.htmlGenerations.map((item) => (
                    <ListCard key={item.id} title={String(item.generationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create html generations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHtmlGeneration(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("generationKey")} placeholder="generationKey" className={inputClass} />
                <input {...form.register("generationName")} placeholder="generationName" className={inputClass} />
                <input {...form.register("generationStatus")} placeholder="generationStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExportJobsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<exportJobsFormValues>({ resolver: zodResolver(exportJobsFormSchema), defaultValues: {"documentHubId":"","jobKey":"","jobName":"","jobStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Export Jobs" description="Enterprise document engine export jobs" /><div className="mt-6 space-y-3">
                {data.exportJobs.length === 0 ? <EmptyState title="No export jobs" description="Create the first export jobs record." /> : data.exportJobs.map((item) => (
                    <ListCard key={item.id} title={String(item.jobName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.jobStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create export jobs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExportJob(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("jobKey")} placeholder="jobKey" className={inputClass} />
                <input {...form.register("jobName")} placeholder="jobName" className={inputClass} />
                <input {...form.register("jobStatus")} placeholder="jobStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BatchGenerationsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<batchGenerationsFormValues>({ resolver: zodResolver(batchGenerationsFormSchema), defaultValues: {"documentHubId":"","batchKey":"","batchName":"","batchStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Batch Generations" description="Enterprise document engine batch generations" /><div className="mt-6 space-y-3">
                {data.batchGenerations.length === 0 ? <EmptyState title="No batch generations" description="Create the first batch generations record." /> : data.batchGenerations.map((item) => (
                    <ListCard key={item.id} title={String(item.batchName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.batchStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create batch generations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBatchGeneration(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("batchKey")} placeholder="batchKey" className={inputClass} />
                <input {...form.register("batchName")} placeholder="batchName" className={inputClass} />
                <input {...form.register("batchStatus")} placeholder="batchStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ElectronicSignaturesPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<electronicSignaturesFormValues>({ resolver: zodResolver(electronicSignaturesFormSchema), defaultValues: {"documentHubId":"","signatureKey":"","signatureName":"","signatureStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Electronic Signatures" description="Enterprise document engine electronic signatures" /><div className="mt-6 space-y-3">
                {data.electronicSignatures.length === 0 ? <EmptyState title="No electronic signatures" description="Create the first electronic signatures record." /> : data.electronicSignatures.map((item) => (
                    <ListCard key={item.id} title={String(item.signatureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.signatureStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create electronic signatures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createElectronicSignature(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("signatureKey")} placeholder="signatureKey" className={inputClass} />
                <input {...form.register("signatureName")} placeholder="signatureName" className={inputClass} />
                <input {...form.register("signatureStatus")} placeholder="signatureStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApprovalSignaturesPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<approvalSignaturesFormValues>({ resolver: zodResolver(approvalSignaturesFormSchema), defaultValues: {"documentHubId":"","signatureKey":"","signatureName":"","signatureStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Approval Signatures" description="Enterprise document engine approval signatures" /><div className="mt-6 space-y-3">
                {data.approvalSignatures.length === 0 ? <EmptyState title="No approval signatures" description="Create the first approval signatures record." /> : data.approvalSignatures.map((item) => (
                    <ListCard key={item.id} title={String(item.signatureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.signatureStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create approval signatures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApprovalSignature(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("signatureKey")} placeholder="signatureKey" className={inputClass} />
                <input {...form.register("signatureName")} placeholder="signatureName" className={inputClass} />
                <input {...form.register("signatureStatus")} placeholder="signatureStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SignatureVerificationsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<signatureVerificationsFormValues>({ resolver: zodResolver(signatureVerificationsFormSchema), defaultValues: {"documentHubId":"","verificationKey":"","verificationStatus":"","verificationResult":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Signature Verifications" description="Enterprise document engine signature verifications" /><div className="mt-6 space-y-3">
                {data.signatureVerifications.length === 0 ? <EmptyState title="No signature verifications" description="Create the first signature verifications record." /> : data.signatureVerifications.map((item) => (
                    <ListCard key={item.id} title={String(item.verificationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.verificationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create signature verifications" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSignatureVerification(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("verificationKey")} placeholder="verificationKey" className={inputClass} />
                <input {...form.register("verificationStatus")} placeholder="verificationStatus" className={inputClass} />
                <input {...form.register("verificationResult")} placeholder="verificationResult" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SignatureAuditEntrysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<signatureAuditEntriesFormValues>({ resolver: zodResolver(signatureAuditEntriesFormSchema), defaultValues: {"documentHubId":"","auditKey":"","auditAction":"","auditSummary":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Signature Audit Entries" description="Enterprise document engine signature audit entries" /><div className="mt-6 space-y-3">
                {data.signatureAuditEntries.length === 0 ? <EmptyState title="No signature audit entries" description="Create the first signature audit entries record." /> : data.signatureAuditEntries.map((item) => (
                    <ListCard key={item.id} title={String(item.auditKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.auditAction}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create signature audit entries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSignatureAuditEntry(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("auditKey")} placeholder="auditKey" className={inputClass} />
                <input {...form.register("auditAction")} placeholder="auditAction" className={inputClass} />
                <input {...form.register("auditSummary")} placeholder="auditSummary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VersionHistorysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<versionHistoriesFormValues>({ resolver: zodResolver(versionHistoriesFormSchema), defaultValues: {"documentHubId":"","historyKey":"","historyVersion":"","historySummary":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Version Histories" description="Enterprise document engine version histories" /><div className="mt-6 space-y-3">
                {data.versionHistories.length === 0 ? <EmptyState title="No version histories" description="Create the first version histories record." /> : data.versionHistories.map((item) => (
                    <ListCard key={item.id} title={String(item.historyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.historyVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create version histories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVersionHistory(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyVersion")} placeholder="historyVersion" className={inputClass} />
                <input {...form.register("historySummary")} placeholder="historySummary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetentionPolicysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<retentionPoliciesFormValues>({ resolver: zodResolver(retentionPoliciesFormSchema), defaultValues: {"documentHubId":"","policyKey":"","policyName":"","retentionDays":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retention Policies" description="Enterprise document engine retention policies" /><div className="mt-6 space-y-3">
                {data.retentionPolicies.length === 0 ? <EmptyState title="No retention policies" description="Create the first retention policies record." /> : data.retentionPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.retentionDays}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retention policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetentionPolicy(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <input type="number" step="any" {...form.register("retentionDays", { valueAsNumber: true })} placeholder="retentionDays" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ArchiveRecordsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<archiveRecordsFormValues>({ resolver: zodResolver(archiveRecordsFormSchema), defaultValues: {"documentHubId":"","archiveKey":"","archiveName":"","archiveStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Archive Records" description="Enterprise document engine archive records" /><div className="mt-6 space-y-3">
                {data.archiveRecords.length === 0 ? <EmptyState title="No archive records" description="Create the first archive records record." /> : data.archiveRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.archiveName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.archiveStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create archive records" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createArchiveRecord(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("archiveKey")} placeholder="archiveKey" className={inputClass} />
                <input {...form.register("archiveName")} placeholder="archiveName" className={inputClass} />
                <input {...form.register("archiveStatus")} placeholder="archiveStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SharingPolicysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<sharingPoliciesFormValues>({ resolver: zodResolver(sharingPoliciesFormSchema), defaultValues: {"documentHubId":"","policyKey":"","policyName":"","sharingScope":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sharing Policies" description="Enterprise document engine sharing policies" /><div className="mt-6 space-y-3">
                {data.sharingPolicies.length === 0 ? <EmptyState title="No sharing policies" description="Create the first sharing policies record." /> : data.sharingPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.sharingScope}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sharing policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSharingPolicy(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <input {...form.register("sharingScope")} placeholder="sharingScope" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EmailDeliverysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<emailDeliveriesFormValues>({ resolver: zodResolver(emailDeliveriesFormSchema), defaultValues: {"documentHubId":"","deliveryKey":"","deliveryName":"","deliveryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Email Deliveries" description="Enterprise document engine email deliveries" /><div className="mt-6 space-y-3">
                {data.emailDeliveries.length === 0 ? <EmptyState title="No email deliveries" description="Create the first email deliveries record." /> : data.emailDeliveries.map((item) => (
                    <ListCard key={item.id} title={String(item.deliveryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deliveryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create email deliveries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEmailDelivery(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("deliveryKey")} placeholder="deliveryKey" className={inputClass} />
                <input {...form.register("deliveryName")} placeholder="deliveryName" className={inputClass} />
                <input {...form.register("deliveryStatus")} placeholder="deliveryStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DownloadDeliverysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<downloadDeliveriesFormValues>({ resolver: zodResolver(downloadDeliveriesFormSchema), defaultValues: {"documentHubId":"","deliveryKey":"","deliveryName":"","deliveryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Download Deliveries" description="Enterprise document engine download deliveries" /><div className="mt-6 space-y-3">
                {data.downloadDeliveries.length === 0 ? <EmptyState title="No download deliveries" description="Create the first download deliveries record." /> : data.downloadDeliveries.map((item) => (
                    <ListCard key={item.id} title={String(item.deliveryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deliveryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create download deliveries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDownloadDelivery(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("deliveryKey")} placeholder="deliveryKey" className={inputClass} />
                <input {...form.register("deliveryName")} placeholder="deliveryName" className={inputClass} />
                <input {...form.register("deliveryStatus")} placeholder="deliveryStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebhookDeliverysPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<webhookDeliveriesFormValues>({ resolver: zodResolver(webhookDeliveriesFormSchema), defaultValues: {"documentHubId":"","deliveryKey":"","deliveryName":"","deliveryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Webhook Deliveries" description="Enterprise document engine webhook deliveries" /><div className="mt-6 space-y-3">
                {data.webhookDeliveries.length === 0 ? <EmptyState title="No webhook deliveries" description="Create the first webhook deliveries record." /> : data.webhookDeliveries.map((item) => (
                    <ListCard key={item.id} title={String(item.deliveryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deliveryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create webhook deliveries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebhookDelivery(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("deliveryKey")} placeholder="deliveryKey" className={inputClass} />
                <input {...form.register("deliveryName")} placeholder="deliveryName" className={inputClass} />
                <input {...form.register("deliveryStatus")} placeholder="deliveryStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GenerationAnalyticssPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<generationAnalyticsFormValues>({ resolver: zodResolver(generationAnalyticsFormSchema), defaultValues: {"documentHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Generation Analytics" description="Enterprise document engine generation analytics" /><div className="mt-6 space-y-3">
                {data.generationAnalytics.length === 0 ? <EmptyState title="No generation analytics" description="Create the first generation analytics record." /> : data.generationAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create generation analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGenerationAnalytics(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeliveryAnalyticssPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<deliveryAnalyticsFormValues>({ resolver: zodResolver(deliveryAnalyticsFormSchema), defaultValues: {"documentHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Delivery Analytics" description="Enterprise document engine delivery analytics" /><div className="mt-6 space-y-3">
                {data.deliveryAnalytics.length === 0 ? <EmptyState title="No delivery analytics" description="Create the first delivery analytics record." /> : data.deliveryAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create delivery analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeliveryAnalytics(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StorageAnalyticssPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<storageAnalyticsFormValues>({ resolver: zodResolver(storageAnalyticsFormSchema), defaultValues: {"documentHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Storage Analytics" description="Enterprise document engine storage analytics" /><div className="mt-6 space-y-3">
                {data.storageAnalytics.length === 0 ? <EmptyState title="No storage analytics" description="Create the first storage analytics record." /> : data.storageAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create storage analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStorageAnalytics(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentMetricsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentMetricsFormValues>({ resolver: zodResolver(documentMetricsFormSchema), defaultValues: {"metricsKey":"","generatedCount":0,"overallDocumentScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Metrics" description="Enterprise document engine document metrics" /><div className="mt-6 space-y-3">
                {data.documentMetrics.length === 0 ? <EmptyState title="No document metrics" description="Create the first document metrics record." /> : data.documentMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallDocumentScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("generatedCount", { valueAsNumber: true })} placeholder="generatedCount" className={inputClass} />
                <input type="number" step="any" {...form.register("overallDocumentScore", { valueAsNumber: true })} placeholder="overallDocumentScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentHealthsPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentHealthFormValues>({ resolver: zodResolver(documentHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Health" description="Enterprise document engine document health" /><div className="mt-6 space-y-3">
                {data.documentHealth.length === 0 ? <EmptyState title="No document health" description="Create the first document health record." /> : data.documentHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PendingSignaturesPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<pendingSignaturesFormValues>({ resolver: zodResolver(pendingSignaturesFormSchema), defaultValues: {"documentHubId":"","signatureKey":"","signatureName":"","signatureStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pending Signatures" description="Enterprise document engine pending signatures" /><div className="mt-6 space-y-3">
                {data.pendingSignatures.length === 0 ? <EmptyState title="No pending signatures" description="Create the first pending signatures record." /> : data.pendingSignatures.map((item) => (
                    <ListCard key={item.id} title={String(item.signatureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.signatureStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pending signatures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPendingSignature(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("signatureKey")} placeholder="signatureKey" className={inputClass} />
                <input {...form.register("signatureName")} placeholder="signatureName" className={inputClass} />
                <input {...form.register("signatureStatus")} placeholder="signatureStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentFailuresPanel({ data }: { data: DocumentEngineData }) {
    const form = useForm<documentFailuresFormValues>({ resolver: zodResolver(documentFailuresFormSchema), defaultValues: {"documentHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document Failures" description="Enterprise document engine document failures" /><div className="mt-6 space-y-3">
                {data.documentFailures.length === 0 ? <EmptyState title="No document failures" description="Create the first document failures record." /> : data.documentFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create document failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentFailure(v))}>
                <DocumentHubSelect data={data} {...form.register("documentHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocumentEngineAuditLogsPanel({ data }: { data: DocumentEngineData }) {
    return (
        <Card hover><SectionHeader title="Document Engine audit history" description="Security-first audit trail for jobs, events, pendingSignatures, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for document engine." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function DocumentEngineSdkPanel({ data }: { data: DocumentEngineData }) {
    return (
        <Card hover><SectionHeader title="Shared Document Engine SDK" description="Import from @/src/modules/document-engine/sdk for document registration, template configuration, and document generation" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createDocumentEngineClient()" subtitle="Factory for module-scoped Document Engine client with auth context" meta="Primary SDK for enterprise document engine" />
            <ListCard title="sdkRegisterDocument()" subtitle="Register document engine with AI orchestration" meta="moduleSource: dynamic_document_engine" />
            <ListCard title="sdkConfigureTemplate()" subtitle="Configure template section with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunDocumentGeneration()" subtitle="Run document generation with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {DDE_THEME.primary} • Integration hubs loaded: {data.documentHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";

const intg = createDocumentEngineClient(userId, email, fullName);
await intg.registerDocument({ documentHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureTemplate({ documentHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runDocumentGeneration({ documentHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
