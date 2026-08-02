"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { PERMISSION_LEVEL_OPTIONS, RETENTION_ACTION_OPTIONS, TEMPLATE_CATEGORY_OPTIONS } from "@/src/modules/documents/constants";
import type { useDocuments } from "@/src/modules/documents/hooks/useDocuments";
import {
    accessGrantFormSchema, approvalFormSchema, documentFormSchema, esignFormSchema, folderFormSchema, retentionPolicyFormSchema, shareFormSchema, tagFormSchema, templateFormSchema, versionFormSchema,
    type AccessGrantFormValues, type ApprovalFormValues, type DocumentFormValues, type EsignFormValues, type FolderFormValues, type RetentionPolicyFormValues, type ShareFormValues, type TagFormValues, type TemplateFormValues, type VersionFormValues,
} from "@/src/modules/documents/schemas";

type DocumentsData = ReturnType<typeof useDocuments>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-blue-600">{meta}</p> : null}</div>;
}
function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function DocumentsOverviewPanel({ data }: { data: DocumentsData }) {
    const links = data.crossModuleLinks;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Content summary" description="Document library metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Documents" subtitle={`${data.stats?.totalDocuments ?? 0} total`} />
                <ListCard title="Folders" subtitle={`${data.stats?.totalFolders ?? 0} organized`} />
                <ListCard title="Approvals" subtitle={`${data.stats?.pendingApprovals ?? 0} pending`} />
                <ListCard title="Storage" subtitle={formatBytes(data.stats?.totalStorageBytes ?? 0)} />
            </div></Card>
            <Card hover><SectionHeader title="Cross-module integration" description="Links to CRM, HR, Finance, Projects, Inventory, Sales, Support, Automation, Analytics, Settings" /><div className="mt-6 space-y-3">
                {links ? (<>
                    <ListCard title="CRM" subtitle={`${links.crmClients} linked clients`} meta="Client documents" />
                    <ListCard title="Projects" subtitle={`${links.projectDocuments} project documents`} meta="Delivery artifacts" />
                    <ListCard title="Finance" subtitle={`${links.financeInvoices} invoice-linked docs`} meta="Financial records" />
                    <ListCard title="HR" subtitle={`${links.hrDocuments} employee documents`} meta="People records" />
                    <ListCard title="Sales" subtitle={`${links.salesOpportunities} opportunity docs`} meta="Revenue operations" />
                    <ListCard title="Support" subtitle={`${links.supportTickets} ticket attachments`} meta="Service desk" />
                </>) : <EmptyState title="No cross-module data" description="Integration metrics will appear once document data is available." />}
            </div></Card>
        </div>
    );
}

export function LibraryPanel({ data }: { data: DocumentsData }) {
    const form = useForm<DocumentFormValues>({ resolver: zodResolver(documentFormSchema), defaultValues: { title: "", fileName: "", fileUrl: "", mimeType: "application/pdf", fileSize: 0, folderId: "", clientId: "", projectId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document library" description="All organization documents" /><div className="mt-6 space-y-3">
                {data.documents.length === 0 ? <EmptyState title="No documents" description="Upload documents to build your library." /> : data.documents.map((doc) => (
                    <ListCard key={doc.id} title={doc.title} subtitle={`${doc.fileName} • ${doc.folderName ?? "Unfiled"} • ${formatBytes(doc.fileSize)}`} meta={`v${doc.currentVersion} • ${doc.status} • ${doc.tags.join(", ") || "No tags"}${doc.clientName ? ` • ${doc.clientName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add document" description="Register a new document" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocument(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("fileName")} placeholder="File name" className={inputClass} />
                <input {...form.register("fileUrl")} placeholder="File URL" className={inputClass} />
                <input {...form.register("mimeType")} placeholder="MIME type" className={inputClass} />
                <input type="number" {...form.register("fileSize", { valueAsNumber: true })} placeholder="File size (bytes)" className={inputClass} />
                <select {...form.register("folderId")} className={inputClass}><option value="">Folder (optional)</option>{data.folderOptions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client (optional)</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Add document" />
            </form></Card>
        </div>
    );
}

export function FoldersPanel({ data }: { data: DocumentsData }) {
    const form = useForm<FolderFormValues>({ resolver: zodResolver(folderFormSchema), defaultValues: { name: "", slug: "", description: "", parentFolderId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Folder hierarchy" description="Organize documents in folders" /><div className="mt-6 space-y-3">
                {data.folders.length === 0 ? <EmptyState title="No folders" description="Create folders to organize documents." /> : data.folders.map((folder) => (
                    <ListCard key={folder.id} title={folder.name} subtitle={folder.description} meta={`${folder.documentCount} documents • ${folder.childFolderCount} subfolders${folder.parentFolderName ? ` • Parent: ${folder.parentFolderName}` : " • Root"}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create folder" description="Add a new folder" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFolder(v))}>
                <input {...form.register("name")} placeholder="Folder name" className={inputClass} />
                <input {...form.register("slug")} placeholder="Slug" className={inputClass} />
                <input {...form.register("description")} placeholder="Description" className={inputClass} />
                <select {...form.register("parentFolderId")} className={inputClass}><option value="">Parent folder (optional)</option>{data.folderOptions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create folder" />
            </form></Card>
        </div>
    );
}

export function TagsPanel({ data }: { data: DocumentsData }) {
    const form = useForm<TagFormValues>({ resolver: zodResolver(tagFormSchema), defaultValues: { name: "", color: "#3b82f6", documentId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Document tags" description="Label and categorize documents" /><div className="mt-6 space-y-3">
                {data.tags.length === 0 ? <EmptyState title="No tags" description="Create tags to classify documents." /> : data.tags.map((tag) => (
                    <ListCard key={tag.id} title={tag.name} subtitle={`${tag.documentCount} documents`} meta={tag.color} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tag" description="Add a new tag" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTag(v))}>
                <input {...form.register("name")} placeholder="Tag name" className={inputClass} />
                <input {...form.register("color")} placeholder="Color (#hex)" className={inputClass} />
                <select {...form.register("documentId")} className={inputClass}><option value="">Link to document (optional)</option>{data.documentOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create tag" />
            </form></Card>
        </div>
    );
}

export function VersionsPanel({ data }: { data: DocumentsData }) {
    const form = useForm<VersionFormValues>({ resolver: zodResolver(versionFormSchema), defaultValues: { documentId: "", versionNumber: 1, fileUrl: "", fileSize: 0, changeSummary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Version history" description="Track document revisions" /><div className="mt-6 space-y-3">
                {data.versions.length === 0 ? <EmptyState title="No versions" description="Upload new versions to track changes." /> : data.versions.map((version) => (
                    <ListCard key={version.id} title={`${version.documentTitle} — v${version.versionNumber}`} subtitle={version.changeSummary} meta={`${formatBytes(version.fileSize)} • ${new Date(version.createdAt).toLocaleDateString()}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Upload version" description="Add a new document version" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVersion(v))}>
                <select {...form.register("documentId")} className={inputClass}><option value="">Select document</option>{data.documentOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                <input type="number" {...form.register("versionNumber", { valueAsNumber: true })} placeholder="Version number" className={inputClass} />
                <input {...form.register("fileUrl")} placeholder="File URL" className={inputClass} />
                <input type="number" {...form.register("fileSize", { valueAsNumber: true })} placeholder="File size" className={inputClass} />
                <textarea {...form.register("changeSummary")} placeholder="Change summary" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Upload version" />
            </form></Card>
        </div>
    );
}

export function ApprovalsPanel({ data }: { data: DocumentsData }) {
    const form = useForm<ApprovalFormValues>({ resolver: zodResolver(approvalFormSchema), defaultValues: { documentId: "", approverId: "", comments: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document approvals" description="Review and approve documents" /><div className="mt-6 space-y-3">
                {data.approvals.length === 0 ? <EmptyState title="No approvals" description="Submit documents for approval." /> : data.approvals.map((approval) => (
                    <div key={approval.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <div><p className="font-medium">{approval.documentTitle}</p><p className="text-sm text-slate-500">{approval.approverName ?? "Unassigned"} • {approval.comments}</p><p className="mt-1 text-xs text-blue-600">{approval.status}{approval.decidedAt ? ` • ${new Date(approval.decidedAt).toLocaleDateString()}` : ""}</p></div>
                        {approval.status === "pending" ? (
                            <button type="button" onClick={() => data.updateApprovalStatus(approval.id, { status: "approved" })} className="rounded-full border border-blue-300 px-4 py-2 text-sm text-blue-700">Approve</button>
                        ) : null}
                    </div>
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Request approval" description="Submit document for review" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApproval(v))}>
                <select {...form.register("documentId")} className={inputClass}><option value="">Select document</option>{data.documentOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                <select {...form.register("approverId")} className={inputClass}><option value="">Approver (optional)</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <textarea {...form.register("comments")} placeholder="Comments" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Request approval" />
            </form></Card>
        </div>
    );
}

export function EsignPanel({ data }: { data: DocumentsData }) {
    const form = useForm<EsignFormValues>({ resolver: zodResolver(esignFormSchema), defaultValues: { documentId: "", signerName: "", signerEmail: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="E-signature preparation" description="Prepare documents for signing" /><div className="mt-6 space-y-3">
                {data.esignPreparations.length === 0 ? <EmptyState title="No e-sign preparations" description="Prepare documents for electronic signature." /> : data.esignPreparations.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <div><p className="font-medium">{item.documentTitle}</p><p className="text-sm text-slate-500">{item.signerName} • {item.signerEmail}</p><p className="mt-1 text-xs text-blue-600">{item.status}{item.sentAt ? ` • Sent ${new Date(item.sentAt).toLocaleDateString()}` : ""}</p></div>
                        {item.status === "draft" ? (
                            <button type="button" onClick={() => data.updateEsignStatus(item.id, { status: "sent" })} className="rounded-full border border-blue-300 px-4 py-2 text-sm text-blue-700">Send</button>
                        ) : null}
                    </div>
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Prepare e-sign" description="Configure signer details" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEsignPreparation(v))}>
                <select {...form.register("documentId")} className={inputClass}><option value="">Select document</option>{data.documentOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                <input {...form.register("signerName")} placeholder="Signer name" className={inputClass} />
                <input {...form.register("signerEmail")} placeholder="Signer email" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Prepare e-sign" />
            </form></Card>
        </div>
    );
}

export function SharingPanel({ data }: { data: DocumentsData }) {
    const form = useForm<ShareFormValues>({ resolver: zodResolver(shareFormSchema), defaultValues: { documentId: "", shareToken: "", recipientEmail: "", permissionLevel: "view", expiresAt: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="File sharing" description="Share documents externally" /><div className="mt-6 space-y-3">
                {data.shares.length === 0 ? <EmptyState title="No shares" description="Create share links for documents." /> : data.shares.map((share) => (
                    <ListCard key={share.id} title={share.documentTitle} subtitle={`${share.recipientEmail} • ${share.permissionLevel}`} meta={`Token: ${share.shareToken} • ${share.isActive ? "Active" : "Inactive"}${share.expiresAt ? ` • Expires ${new Date(share.expiresAt).toLocaleDateString()}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create share" description="Share a document" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createShare(v))}>
                <select {...form.register("documentId")} className={inputClass}><option value="">Select document</option>{data.documentOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                <input {...form.register("shareToken")} placeholder="Share token" className={inputClass} />
                <input {...form.register("recipientEmail")} placeholder="Recipient email" className={inputClass} />
                <select {...form.register("permissionLevel")} className={inputClass}>{PERMISSION_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input type="date" {...form.register("expiresAt")} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create share" />
            </form></Card>
        </div>
    );
}

export function AccessPanel({ data }: { data: DocumentsData }) {
    const form = useForm<AccessGrantFormValues>({ resolver: zodResolver(accessGrantFormSchema), defaultValues: { documentId: "", folderId: "", granteeType: "employee", granteeId: "", permissionLevel: "view" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Access control" description="Manage document and folder permissions" /><div className="mt-6 space-y-3">
                {data.accessGrants.length === 0 ? <EmptyState title="No access grants" description="Grant access to documents or folders." /> : data.accessGrants.map((grant) => (
                    <ListCard key={grant.id} title={grant.documentTitle ?? grant.folderName ?? "Grant"} subtitle={`${grant.granteeType} • ${grant.granteeName ?? "Unassigned"}`} meta={grant.permissionLevel} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Grant access" description="Assign permissions" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAccessGrant(v))}>
                <select {...form.register("documentId")} className={inputClass}><option value="">Document (optional)</option>{data.documentOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                <select {...form.register("folderId")} className={inputClass}><option value="">Folder (optional)</option>{data.folderOptions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
                <select {...form.register("granteeId")} className={inputClass}><option value="">Grantee</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("permissionLevel")} className={inputClass}>{PERMISSION_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Grant access" />
            </form></Card>
        </div>
    );
}

export function TemplatesPanel({ data }: { data: DocumentsData }) {
    const form = useForm<TemplateFormValues>({ resolver: zodResolver(templateFormSchema), defaultValues: { name: "", category: "general", description: "", templateContent: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Document templates" description="Reusable document templates" /><div className="mt-6 space-y-3">
                {data.templates.length === 0 ? <EmptyState title="No templates" description="Create templates for common documents." /> : data.templates.map((template) => (
                    <ListCard key={template.id} title={template.name} subtitle={`${template.category} • ${template.description}`} meta={`${template.status} • ${template.contentPreview}...`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template" description="Add a new template" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemplate(v))}>
                <input {...form.register("name")} placeholder="Template name" className={inputClass} />
                <select {...form.register("category")} className={inputClass}>{TEMPLATE_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("description")} placeholder="Description" className={inputClass} />
                <textarea {...form.register("templateContent")} placeholder="Template content" rows={4} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create template" />
            </form></Card>
        </div>
    );
}

export function PreviewPanel({ data }: { data: DocumentsData }) {
    return (
        <Card hover><SectionHeader title="Rich document preview" description="Generated previews and thumbnails" /><div className="mt-6 space-y-3">
            {data.previews.length === 0 ? <EmptyState title="No previews" description="Document previews will appear once generated." /> : data.previews.map((preview) => (
                <ListCard key={preview.id} title={preview.documentTitle} subtitle={`${preview.previewType} • ${preview.pageCount} pages`} meta={`Generated ${new Date(preview.generatedAt).toLocaleDateString()}`} />
            ))}
        </div></Card>
    );
}

export function SearchPanel({ data }: { data: DocumentsData }) {
    return (
        <Card hover><SectionHeader title="Full-text search foundation" description="Indexed document content for search" /><div className="mt-6 space-y-3">
            {data.searchIndex.length === 0 ? <EmptyState title="No search index" description="Documents will be indexed for full-text search." /> : data.searchIndex.map((entry) => (
                <ListCard key={entry.id} title={entry.documentTitle} subtitle={entry.searchText} meta={`Indexed ${new Date(entry.indexedAt).toLocaleDateString()}`} />
            ))}
        </div></Card>
    );
}

export function RetentionPanel({ data }: { data: DocumentsData }) {
    const form = useForm<RetentionPolicyFormValues>({ resolver: zodResolver(retentionPolicyFormSchema), defaultValues: { name: "", retentionDays: 365, actionOnExpiry: "archive", appliesToCategory: "all" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Retention policies" description="Document lifecycle and compliance rules" /><div className="mt-6 space-y-3">
                {data.retentionPolicies.length === 0 ? <EmptyState title="No retention policies" description="Define retention rules for document categories." /> : data.retentionPolicies.map((policy) => (
                    <ListCard key={policy.id} title={policy.name} subtitle={`${policy.retentionDays} days • ${policy.appliesToCategory}`} meta={`${policy.actionOnExpiry} on expiry • ${policy.isActive ? "Active" : "Inactive"}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create policy" description="Add retention rule" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetentionPolicy(v))}>
                <input {...form.register("name")} placeholder="Policy name" className={inputClass} />
                <input type="number" {...form.register("retentionDays", { valueAsNumber: true })} placeholder="Retention days" className={inputClass} />
                <select {...form.register("actionOnExpiry")} className={inputClass}>{RETENTION_ACTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("appliesToCategory")} placeholder="Category (e.g. legal, finance, all)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create policy" />
            </form></Card>
        </div>
    );
}

export function ArchivePanel({ data }: { data: DocumentsData }) {
    return (
        <Card hover><SectionHeader title="Archive & restore" description="Archived documents and restore availability" /><div className="mt-6 space-y-3">
            {data.archives.length === 0 ? <EmptyState title="No archived documents" description="Archived documents will appear here." /> : data.archives.map((archive) => (
                <div key={archive.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                    <div><p className="font-medium">{archive.documentTitle}</p><p className="text-sm text-slate-500">Archived {new Date(archive.archivedAt).toLocaleDateString()}</p><p className="mt-1 text-xs text-blue-600">{archive.restoreAvailable ? "Restore available" : "Restore unavailable"}</p></div>
                    {!archive.restoreAvailable ? (
                        <button type="button" onClick={() => data.updateArchiveRestore(archive.id, { restoreAvailable: true })} className="rounded-full border border-blue-300 px-4 py-2 text-sm text-blue-700">Enable restore</button>
                    ) : null}
                </div>
            ))}
        </div></Card>
    );
}

export function ActivityPanel({ data }: { data: DocumentsData }) {
    return (
        <Card hover><SectionHeader title="Activity timeline" description="Document events and actions" /><div className="mt-6 space-y-3">
            {data.activityLogs.length === 0 ? <EmptyState title="No activity" description="Document activity will appear here." /> : data.activityLogs.map((log) => (
                <ListCard key={log.id} title={log.documentTitle ?? "System"} subtitle={log.summary} meta={`${log.activityType} • ${new Date(log.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function DocumentsReportsPanel({ data }: { data: DocumentsData }) {
    const report = data.report;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Reports & analytics" description="Document management insights" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Total documents" subtitle={String(report?.totalDocuments ?? 0)} />
                <ListCard title="Total folders" subtitle={String(report?.totalFolders ?? 0)} />
            </div></Card>
            <Card hover><SectionHeader title="Distribution" description="Documents by status and folder" /><div className="mt-6 space-y-3">
                {(report?.documentsByStatus ?? []).length === 0 ? <EmptyState title="No report data" description="Reports will populate once documents exist." /> : (report?.documentsByStatus ?? []).map((item) => (
                    <ListCard key={item.label} title={item.label} subtitle={`${item.count} documents`} />
                ))}
            </div></Card>
        </div>
    );
}

export function DocumentsAuditPanel({ data }: { data: DocumentsData }) {
    return (
        <Card hover><SectionHeader title="Audit history" description="Complete document management audit trail" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={`${entry.entityType} — ${entry.action}`} subtitle={entry.summary} meta={new Date(entry.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}
