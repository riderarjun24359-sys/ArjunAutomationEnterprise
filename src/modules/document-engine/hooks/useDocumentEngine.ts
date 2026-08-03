"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { documentEngineService } from "@/src/modules/document-engine/services/document-engine.service";
import type {
    DocumentHubSummary,
    CreateDocumentHubInput,
    DocumentTypeSummary,
    CreateDocumentTypeInput,
    DocumentCategorySummary,
    CreateDocumentCategoryInput,
    DocumentTemplateSummary,
    CreateDocumentTemplateInput,
    DocumentVersionSummary,
    CreateDocumentVersionInput,
    TemplateHeaderSummary,
    CreateTemplateHeaderInput,
    TemplateFooterSummary,
    CreateTemplateFooterInput,
    TemplateSectionSummary,
    CreateTemplateSectionInput,
    TemplateVariableSummary,
    CreateTemplateVariableInput,
    PdfGenerationSummary,
    CreatePdfGenerationInput,
    HtmlGenerationSummary,
    CreateHtmlGenerationInput,
    ExportJobSummary,
    CreateExportJobInput,
    BatchGenerationSummary,
    CreateBatchGenerationInput,
    ElectronicSignatureSummary,
    CreateElectronicSignatureInput,
    ApprovalSignatureSummary,
    CreateApprovalSignatureInput,
    SignatureVerificationSummary,
    CreateSignatureVerificationInput,
    SignatureAuditEntrySummary,
    CreateSignatureAuditEntryInput,
    VersionHistorySummary,
    CreateVersionHistoryInput,
    RetentionPolicySummary,
    CreateRetentionPolicyInput,
    ArchiveRecordSummary,
    CreateArchiveRecordInput,
    SharingPolicySummary,
    CreateSharingPolicyInput,
    EmailDeliverySummary,
    CreateEmailDeliveryInput,
    DownloadDeliverySummary,
    CreateDownloadDeliveryInput,
    WebhookDeliverySummary,
    CreateWebhookDeliveryInput,
    GenerationAnalyticsSummary,
    CreateGenerationAnalyticsInput,
    DeliveryAnalyticsSummary,
    CreateDeliveryAnalyticsInput,
    StorageAnalyticsSummary,
    CreateStorageAnalyticsInput,
    DocumentMetricSummary,
    CreateDocumentMetricInput,
    DocumentHealthSummary,
    CreateDocumentHealthInput,
    PendingSignatureSummary,
    CreatePendingSignatureInput,
    DocumentFailureSummary,
    CreateDocumentFailureInput,
    AuditEntry,
    DdeDashboardStats,
    DdePipelineInfo,
} from "@/src/modules/document-engine/types";

export function useDocumentEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DdeDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DdePipelineInfo | null>(null);
    const [documentHubs, setDocumentHubs] = useState<DocumentHubSummary[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentTypeSummary[]>([]);
    const [documentCategories, setDocumentCategorys] = useState<DocumentCategorySummary[]>([]);
    const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplateSummary[]>([]);
    const [documentVersions, setDocumentVersions] = useState<DocumentVersionSummary[]>([]);
    const [templateHeaders, setTemplateHeaders] = useState<TemplateHeaderSummary[]>([]);
    const [templateFooters, setTemplateFooters] = useState<TemplateFooterSummary[]>([]);
    const [templateSections, setTemplateSections] = useState<TemplateSectionSummary[]>([]);
    const [templateVariables, setTemplateVariables] = useState<TemplateVariableSummary[]>([]);
    const [pdfGenerations, setPdfGenerations] = useState<PdfGenerationSummary[]>([]);
    const [htmlGenerations, setHtmlGenerations] = useState<HtmlGenerationSummary[]>([]);
    const [exportJobs, setExportJobs] = useState<ExportJobSummary[]>([]);
    const [batchGenerations, setBatchGenerations] = useState<BatchGenerationSummary[]>([]);
    const [electronicSignatures, setElectronicSignatures] = useState<ElectronicSignatureSummary[]>([]);
    const [approvalSignatures, setApprovalSignatures] = useState<ApprovalSignatureSummary[]>([]);
    const [signatureVerifications, setSignatureVerifications] = useState<SignatureVerificationSummary[]>([]);
    const [signatureAuditEntries, setSignatureAuditEntrys] = useState<SignatureAuditEntrySummary[]>([]);
    const [versionHistories, setVersionHistorys] = useState<VersionHistorySummary[]>([]);
    const [retentionPolicies, setRetentionPolicys] = useState<RetentionPolicySummary[]>([]);
    const [archiveRecords, setArchiveRecords] = useState<ArchiveRecordSummary[]>([]);
    const [sharingPolicies, setSharingPolicys] = useState<SharingPolicySummary[]>([]);
    const [emailDeliveries, setEmailDeliverys] = useState<EmailDeliverySummary[]>([]);
    const [downloadDeliveries, setDownloadDeliverys] = useState<DownloadDeliverySummary[]>([]);
    const [webhookDeliveries, setWebhookDeliverys] = useState<WebhookDeliverySummary[]>([]);
    const [generationAnalytics, setGenerationAnalyticss] = useState<GenerationAnalyticsSummary[]>([]);
    const [deliveryAnalytics, setDeliveryAnalyticss] = useState<DeliveryAnalyticsSummary[]>([]);
    const [storageAnalytics, setStorageAnalyticss] = useState<StorageAnalyticsSummary[]>([]);
    const [documentMetrics, setDocumentMetrics] = useState<DocumentMetricSummary[]>([]);
    const [documentHealth, setDocumentHealths] = useState<DocumentHealthSummary[]>([]);
    const [pendingSignatures, setPendingSignatures] = useState<PendingSignatureSummary[]>([]);
    const [documentFailures, setDocumentFailures] = useState<DocumentFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [documentHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
documentHubsList,
            documentTypesList,
            documentCategoriesList,
            documentTemplatesList,
            documentVersionsList,
            templateHeadersList,
            templateFootersList,
            templateSectionsList,
            templateVariablesList,
            pdfGenerationsList,
            htmlGenerationsList,
            exportJobsList,
            batchGenerationsList,
            electronicSignaturesList,
            approvalSignaturesList,
            signatureVerificationsList,
            signatureAuditEntriesList,
            versionHistoriesList,
            retentionPoliciesList,
            archiveRecordsList,
            sharingPoliciesList,
            emailDeliveriesList,
            downloadDeliveriesList,
            webhookDeliveriesList,
            generationAnalyticsList,
            deliveryAnalyticsList,
            storageAnalyticsList,
            documentMetricsList,
            documentHealthList,
            pendingSignaturesList,
            documentFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            documentEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(documentEngineService.getPipelineInfo()),
            documentEngineService.getDocumentHubs(authUserId, email, fullName),
            documentEngineService.getDocumentTypes(authUserId, email, fullName),
            documentEngineService.getDocumentCategorys(authUserId, email, fullName),
            documentEngineService.getDocumentTemplates(authUserId, email, fullName),
            documentEngineService.getDocumentVersions(authUserId, email, fullName),
            documentEngineService.getTemplateHeaders(authUserId, email, fullName),
            documentEngineService.getTemplateFooters(authUserId, email, fullName),
            documentEngineService.getTemplateSections(authUserId, email, fullName),
            documentEngineService.getTemplateVariables(authUserId, email, fullName),
            documentEngineService.getPdfGenerations(authUserId, email, fullName),
            documentEngineService.getHtmlGenerations(authUserId, email, fullName),
            documentEngineService.getExportJobs(authUserId, email, fullName),
            documentEngineService.getBatchGenerations(authUserId, email, fullName),
            documentEngineService.getElectronicSignatures(authUserId, email, fullName),
            documentEngineService.getApprovalSignatures(authUserId, email, fullName),
            documentEngineService.getSignatureVerifications(authUserId, email, fullName),
            documentEngineService.getSignatureAuditEntrys(authUserId, email, fullName),
            documentEngineService.getVersionHistorys(authUserId, email, fullName),
            documentEngineService.getRetentionPolicys(authUserId, email, fullName),
            documentEngineService.getArchiveRecords(authUserId, email, fullName),
            documentEngineService.getSharingPolicys(authUserId, email, fullName),
            documentEngineService.getEmailDeliverys(authUserId, email, fullName),
            documentEngineService.getDownloadDeliverys(authUserId, email, fullName),
            documentEngineService.getWebhookDeliverys(authUserId, email, fullName),
            documentEngineService.getGenerationAnalyticss(authUserId, email, fullName),
            documentEngineService.getDeliveryAnalyticss(authUserId, email, fullName),
            documentEngineService.getStorageAnalyticss(authUserId, email, fullName),
            documentEngineService.getDocumentMetrics(authUserId, email, fullName),
            documentEngineService.getDocumentHealths(authUserId, email, fullName),
            documentEngineService.getPendingSignatures(authUserId, email, fullName),
            documentEngineService.getDocumentFailures(authUserId, email, fullName),
            documentEngineService.getAuditLogs(authUserId, email, fullName),
            documentEngineService.getDocumentHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
documentHubsList,
            documentTypesList,
            documentCategoriesList,
            documentTemplatesList,
            documentVersionsList,
            templateHeadersList,
            templateFootersList,
            templateSectionsList,
            templateVariablesList,
            pdfGenerationsList,
            htmlGenerationsList,
            exportJobsList,
            batchGenerationsList,
            electronicSignaturesList,
            approvalSignaturesList,
            signatureVerificationsList,
            signatureAuditEntriesList,
            versionHistoriesList,
            retentionPoliciesList,
            archiveRecordsList,
            sharingPoliciesList,
            emailDeliveriesList,
            downloadDeliveriesList,
            webhookDeliveriesList,
            generationAnalyticsList,
            deliveryAnalyticsList,
            storageAnalyticsList,
            documentMetricsList,
            documentHealthList,
            pendingSignaturesList,
            documentFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setDocumentHubs(result.documentHubsList);
        setDocumentTypes(result.documentTypesList);
        setDocumentCategorys(result.documentCategoriesList);
        setDocumentTemplates(result.documentTemplatesList);
        setDocumentVersions(result.documentVersionsList);
        setTemplateHeaders(result.templateHeadersList);
        setTemplateFooters(result.templateFootersList);
        setTemplateSections(result.templateSectionsList);
        setTemplateVariables(result.templateVariablesList);
        setPdfGenerations(result.pdfGenerationsList);
        setHtmlGenerations(result.htmlGenerationsList);
        setExportJobs(result.exportJobsList);
        setBatchGenerations(result.batchGenerationsList);
        setElectronicSignatures(result.electronicSignaturesList);
        setApprovalSignatures(result.approvalSignaturesList);
        setSignatureVerifications(result.signatureVerificationsList);
        setSignatureAuditEntrys(result.signatureAuditEntriesList);
        setVersionHistorys(result.versionHistoriesList);
        setRetentionPolicys(result.retentionPoliciesList);
        setArchiveRecords(result.archiveRecordsList);
        setSharingPolicys(result.sharingPoliciesList);
        setEmailDeliverys(result.emailDeliveriesList);
        setDownloadDeliverys(result.downloadDeliveriesList);
        setWebhookDeliverys(result.webhookDeliveriesList);
        setGenerationAnalyticss(result.generationAnalyticsList);
        setDeliveryAnalyticss(result.deliveryAnalyticsList);
        setStorageAnalyticss(result.storageAnalyticsList);
        setDocumentMetrics(result.documentMetricsList);
        setDocumentHealths(result.documentHealthList);
        setPendingSignatures(result.pendingSignaturesList);
        setDocumentFailures(result.documentFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createDocumentHub = useCallback(async (input: CreateDocumentHubInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentType = useCallback(async (input: CreateDocumentTypeInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentType(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentCategory = useCallback(async (input: CreateDocumentCategoryInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentCategory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentTemplate = useCallback(async (input: CreateDocumentTemplateInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentVersion = useCallback(async (input: CreateDocumentVersionInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplateHeader = useCallback(async (input: CreateTemplateHeaderInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createTemplateHeader(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplateFooter = useCallback(async (input: CreateTemplateFooterInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createTemplateFooter(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplateSection = useCallback(async (input: CreateTemplateSectionInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createTemplateSection(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplateVariable = useCallback(async (input: CreateTemplateVariableInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createTemplateVariable(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPdfGeneration = useCallback(async (input: CreatePdfGenerationInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createPdfGeneration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHtmlGeneration = useCallback(async (input: CreateHtmlGenerationInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createHtmlGeneration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExportJob = useCallback(async (input: CreateExportJobInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createExportJob(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBatchGeneration = useCallback(async (input: CreateBatchGenerationInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createBatchGeneration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createElectronicSignature = useCallback(async (input: CreateElectronicSignatureInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createElectronicSignature(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApprovalSignature = useCallback(async (input: CreateApprovalSignatureInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createApprovalSignature(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSignatureVerification = useCallback(async (input: CreateSignatureVerificationInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createSignatureVerification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSignatureAuditEntry = useCallback(async (input: CreateSignatureAuditEntryInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createSignatureAuditEntry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVersionHistory = useCallback(async (input: CreateVersionHistoryInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createVersionHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetentionPolicy = useCallback(async (input: CreateRetentionPolicyInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createRetentionPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createArchiveRecord = useCallback(async (input: CreateArchiveRecordInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createArchiveRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSharingPolicy = useCallback(async (input: CreateSharingPolicyInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createSharingPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEmailDelivery = useCallback(async (input: CreateEmailDeliveryInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createEmailDelivery(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDownloadDelivery = useCallback(async (input: CreateDownloadDeliveryInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDownloadDelivery(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebhookDelivery = useCallback(async (input: CreateWebhookDeliveryInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createWebhookDelivery(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGenerationAnalytics = useCallback(async (input: CreateGenerationAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createGenerationAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeliveryAnalytics = useCallback(async (input: CreateDeliveryAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDeliveryAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStorageAnalytics = useCallback(async (input: CreateStorageAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createStorageAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentMetric = useCallback(async (input: CreateDocumentMetricInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentHealth = useCallback(async (input: CreateDocumentHealthInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPendingSignature = useCallback(async (input: CreatePendingSignatureInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createPendingSignature(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentFailure = useCallback(async (input: CreateDocumentFailureInput) => { if (!user) throw new Error("Authentication required"); await documentEngineService.createDocumentFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        documentHubs,
        createDocumentHub,
        documentTypes,
        createDocumentType,
        documentCategories,
        createDocumentCategory,
        documentTemplates,
        createDocumentTemplate,
        documentVersions,
        createDocumentVersion,
        templateHeaders,
        createTemplateHeader,
        templateFooters,
        createTemplateFooter,
        templateSections,
        createTemplateSection,
        templateVariables,
        createTemplateVariable,
        pdfGenerations,
        createPdfGeneration,
        htmlGenerations,
        createHtmlGeneration,
        exportJobs,
        createExportJob,
        batchGenerations,
        createBatchGeneration,
        electronicSignatures,
        createElectronicSignature,
        approvalSignatures,
        createApprovalSignature,
        signatureVerifications,
        createSignatureVerification,
        signatureAuditEntries,
        createSignatureAuditEntry,
        versionHistories,
        createVersionHistory,
        retentionPolicies,
        createRetentionPolicy,
        archiveRecords,
        createArchiveRecord,
        sharingPolicies,
        createSharingPolicy,
        emailDeliveries,
        createEmailDelivery,
        downloadDeliveries,
        createDownloadDelivery,
        webhookDeliveries,
        createWebhookDelivery,
        generationAnalytics,
        createGenerationAnalytics,
        deliveryAnalytics,
        createDeliveryAnalytics,
        storageAnalytics,
        createStorageAnalytics,
        documentMetrics,
        createDocumentMetric,
        documentHealth,
        createDocumentHealth,
        pendingSignatures,
        createPendingSignature,
        documentFailures,
        createDocumentFailure,
        auditLogs,
        documentHubOptions,
        refresh,
    };
}
