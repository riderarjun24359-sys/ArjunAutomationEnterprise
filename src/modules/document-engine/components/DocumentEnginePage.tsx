"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    DocumentEngineOverviewPanel,
    DocumentHubsPanel,
    DocumentTypesPanel,
    DocumentCategorysPanel,
    DocumentTemplatesPanel,
    DocumentVersionsPanel,
    TemplateHeadersPanel,
    TemplateFootersPanel,
    TemplateSectionsPanel,
    TemplateVariablesPanel,
    PdfGenerationsPanel,
    HtmlGenerationsPanel,
    ExportJobsPanel,
    BatchGenerationsPanel,
    ElectronicSignaturesPanel,
    ApprovalSignaturesPanel,
    SignatureVerificationsPanel,
    SignatureAuditEntrysPanel,
    VersionHistorysPanel,
    RetentionPolicysPanel,
    ArchiveRecordsPanel,
    SharingPolicysPanel,
    EmailDeliverysPanel,
    DownloadDeliverysPanel,
    WebhookDeliverysPanel,
    GenerationAnalyticssPanel,
    DeliveryAnalyticssPanel,
    StorageAnalyticssPanel,
    DocumentMetricsPanel,
    DocumentHealthsPanel,
    PendingSignaturesPanel,
    DocumentFailuresPanel,
    DocumentEngineAuditLogsPanel,
    DocumentEngineSdkPanel,
} from "@/src/modules/document-engine/components/DocumentEnginePanels";
import { DocumentEngineStats } from "@/src/modules/document-engine/components/DocumentEngineStats";
import { DDE_TABS } from "@/src/modules/document-engine/constants";
import { useDocumentEngine } from "@/src/modules/document-engine/hooks/useDocumentEngine";

const tabs = [
    { id: DDE_TABS.overview, label: "Overview" },
    { id: DDE_TABS.documentHubs, label: "Document Hubs" },
    { id: DDE_TABS.documentTypes, label: "Document Types" },
    { id: DDE_TABS.documentCategories, label: "Document Categories" },
    { id: DDE_TABS.documentTemplates, label: "Document Templates" },
    { id: DDE_TABS.documentVersions, label: "Document Versions" },
    { id: DDE_TABS.templateHeaders, label: "Template Headers" },
    { id: DDE_TABS.templateFooters, label: "Template Footers" },
    { id: DDE_TABS.templateSections, label: "Template Sections" },
    { id: DDE_TABS.templateVariables, label: "Template Variables" },
    { id: DDE_TABS.pdfGenerations, label: "Pdf Generations" },
    { id: DDE_TABS.htmlGenerations, label: "Html Generations" },
    { id: DDE_TABS.exportJobs, label: "Export Jobs" },
    { id: DDE_TABS.batchGenerations, label: "Batch Generations" },
    { id: DDE_TABS.electronicSignatures, label: "Electronic Signatures" },
    { id: DDE_TABS.approvalSignatures, label: "Approval Signatures" },
    { id: DDE_TABS.signatureVerifications, label: "Signature Verifications" },
    { id: DDE_TABS.signatureAuditEntries, label: "Signature Audit Entries" },
    { id: DDE_TABS.versionHistories, label: "Version Histories" },
    { id: DDE_TABS.retentionPolicies, label: "Retention Policies" },
    { id: DDE_TABS.archiveRecords, label: "Archive Records" },
    { id: DDE_TABS.sharingPolicies, label: "Sharing Policies" },
    { id: DDE_TABS.emailDeliveries, label: "Email Deliveries" },
    { id: DDE_TABS.downloadDeliveries, label: "Download Deliveries" },
    { id: DDE_TABS.webhookDeliveries, label: "Webhook Deliveries" },
    { id: DDE_TABS.generationAnalytics, label: "Generation Analytics" },
    { id: DDE_TABS.deliveryAnalytics, label: "Delivery Analytics" },
    { id: DDE_TABS.storageAnalytics, label: "Storage Analytics" },
    { id: DDE_TABS.documentMetrics, label: "Document Metrics" },
    { id: DDE_TABS.documentHealth, label: "Document Health" },
    { id: DDE_TABS.pendingSignatures, label: "Pending Signatures" },
    { id: DDE_TABS.documentFailures, label: "Document Failures" },
    { id: DDE_TABS.auditLogs, label: "Audit Logs" },
    { id: DDE_TABS.api, label: "SDK" },
] as const;

export function DocumentEnginePage() {
    const documentEngine = useDocumentEngine();
    const [activeTab, setActiveTab] = useState<(typeof DDE_TABS)[keyof typeof DDE_TABS]>(DDE_TABS.overview);

    if (documentEngine.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Document Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-fuchsia-600">V2 Program A Program B Sprint 5</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Document Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: template sections, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and document engine dashboard with security-first audit and the shared Document Engine SDK.
                </p>
            </motion.header>
            <DocumentEngineStats stats={documentEngine.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-fuchsia-600 text-white" : "border border-slate-200 text-slate-600 hover:border-fuchsia-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === DDE_TABS.overview ? <DocumentEngineOverviewPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentHubs ? <DocumentHubsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentTypes ? <DocumentTypesPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentCategories ? <DocumentCategorysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentTemplates ? <DocumentTemplatesPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentVersions ? <DocumentVersionsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.templateHeaders ? <TemplateHeadersPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.templateFooters ? <TemplateFootersPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.templateSections ? <TemplateSectionsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.templateVariables ? <TemplateVariablesPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.pdfGenerations ? <PdfGenerationsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.htmlGenerations ? <HtmlGenerationsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.exportJobs ? <ExportJobsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.batchGenerations ? <BatchGenerationsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.electronicSignatures ? <ElectronicSignaturesPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.approvalSignatures ? <ApprovalSignaturesPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.signatureVerifications ? <SignatureVerificationsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.signatureAuditEntries ? <SignatureAuditEntrysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.versionHistories ? <VersionHistorysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.retentionPolicies ? <RetentionPolicysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.archiveRecords ? <ArchiveRecordsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.sharingPolicies ? <SharingPolicysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.emailDeliveries ? <EmailDeliverysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.downloadDeliveries ? <DownloadDeliverysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.webhookDeliveries ? <WebhookDeliverysPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.generationAnalytics ? <GenerationAnalyticssPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.deliveryAnalytics ? <DeliveryAnalyticssPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.storageAnalytics ? <StorageAnalyticssPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentMetrics ? <DocumentMetricsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentHealth ? <DocumentHealthsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.pendingSignatures ? <PendingSignaturesPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.documentFailures ? <DocumentFailuresPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.auditLogs ? <DocumentEngineAuditLogsPanel data={documentEngine} /> : null}
            {activeTab === DDE_TABS.api ? <DocumentEngineSdkPanel data={documentEngine} /> : null}
        </div>
    );
}
