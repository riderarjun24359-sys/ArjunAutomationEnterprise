"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AccessPanel,
    ActivityPanel,
    ApprovalsPanel,
    ArchivePanel,
    DocumentsAuditPanel,
    DocumentsOverviewPanel,
    DocumentsReportsPanel,
    EsignPanel,
    FoldersPanel,
    LibraryPanel,
    PreviewPanel,
    RetentionPanel,
    SearchPanel,
    SharingPanel,
    TagsPanel,
    TemplatesPanel,
    VersionsPanel,
} from "@/src/modules/documents/components/DocumentsPanels";
import { DocumentsStats } from "@/src/modules/documents/components/DocumentsStats";
import { DOCUMENTS_TABS } from "@/src/modules/documents/constants";
import { useDocuments } from "@/src/modules/documents/hooks/useDocuments";

const tabs = [
    { id: DOCUMENTS_TABS.overview, label: "Overview" },
    { id: DOCUMENTS_TABS.library, label: "Library" },
    { id: DOCUMENTS_TABS.folders, label: "Folders" },
    { id: DOCUMENTS_TABS.tags, label: "Tags" },
    { id: DOCUMENTS_TABS.versions, label: "Versions" },
    { id: DOCUMENTS_TABS.approvals, label: "Approvals" },
    { id: DOCUMENTS_TABS.esign, label: "E-Sign" },
    { id: DOCUMENTS_TABS.sharing, label: "Sharing" },
    { id: DOCUMENTS_TABS.access, label: "Access" },
    { id: DOCUMENTS_TABS.templates, label: "Templates" },
    { id: DOCUMENTS_TABS.preview, label: "Preview" },
    { id: DOCUMENTS_TABS.search, label: "Search" },
    { id: DOCUMENTS_TABS.retention, label: "Retention" },
    { id: DOCUMENTS_TABS.archive, label: "Archive" },
    { id: DOCUMENTS_TABS.activity, label: "Activity" },
    { id: DOCUMENTS_TABS.reports, label: "Reports" },
    { id: DOCUMENTS_TABS.audit, label: "Audit" },
] as const;

export function DocumentsPage() {
    const documents = useDocuments();
    const [activeTab, setActiveTab] = useState<(typeof DOCUMENTS_TABS)[keyof typeof DOCUMENTS_TABS]>(DOCUMENTS_TABS.overview);

    if (documents.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading document and content management data" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-600">Content Management</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Document & Content Management</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Manage document library, folder hierarchy, tags, version history, approvals, e-signature preparation, file sharing, access control, templates, rich previews, full-text search, retention policies, archive and restore, activity timeline, reports, and audit history from one Supabase-backed workspace.
                </p>
            </motion.header>
            <DocumentsStats stats={documents.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:border-blue-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === DOCUMENTS_TABS.overview ? <DocumentsOverviewPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.library ? <LibraryPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.folders ? <FoldersPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.tags ? <TagsPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.versions ? <VersionsPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.approvals ? <ApprovalsPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.esign ? <EsignPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.sharing ? <SharingPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.access ? <AccessPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.templates ? <TemplatesPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.preview ? <PreviewPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.search ? <SearchPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.retention ? <RetentionPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.archive ? <ArchivePanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.activity ? <ActivityPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.reports ? <DocumentsReportsPanel data={documents} /> : null}
            {activeTab === DOCUMENTS_TABS.audit ? <DocumentsAuditPanel data={documents} /> : null}
        </div>
    );
}
