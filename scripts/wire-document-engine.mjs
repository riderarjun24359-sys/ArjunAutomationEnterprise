#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("DdeDocumentHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/workflow-engine-repositories\";";
    const dweImportEnd = da.indexOf(anchor) + anchor.length;
    const ddeImport = `
import {
    DdeDocumentHubRepository,
    DdeDocumentTypeRepository,
    DdeDocumentCategoryRepository,
    DdeDocumentTemplateRepository,
    DdeDocumentVersionRepository,
    DdeTemplateHeaderRepository,
    DdeTemplateFooterRepository,
    DdeTemplateSectionRepository,
    DdeTemplateVariableRepository,
    DdePdfGenerationRepository,
    DdeHtmlGenerationRepository,
    DdeExportJobRepository,
    DdeBatchGenerationRepository,
    DdeElectronicSignatureRepository,
    DdeApprovalSignatureRepository,
    DdeSignatureVerificationRepository,
    DdeSignatureAuditEntryRepository,
    DdeVersionHistoryRepository,
    DdeRetentionPolicyRepository,
    DdeArchiveRecordRepository,
    DdeSharingPolicyRepository,
    DdeEmailDeliveryRepository,
    DdeDownloadDeliveryRepository,
    DdeWebhookDeliveryRepository,
    DdeGenerationAnalyticsRepository,
    DdeDeliveryAnalyticsRepository,
    DdeStorageAnalyticsRepository,
    DdeDocumentMetricRepository,
    DdeDocumentHealthRepository,
    DdePendingSignatureRepository,
    DdeDocumentFailureRepository,
    DdeAuditLogRepository,
} from "@/src/modules/database/repositories/document-engine-repositories";
`;
    da = da.slice(0, dweImportEnd) + ddeImport + da.slice(dweImportEnd);

    const dweProp = "    readonly dweAuditLogs: DweAuditLogRepository;";
    const ddeProps = `    readonly ddeDocumentHubs: DdeDocumentHubRepository;
    readonly ddeDocumentTypes: DdeDocumentTypeRepository;
    readonly ddeDocumentCategories: DdeDocumentCategoryRepository;
    readonly ddeDocumentTemplates: DdeDocumentTemplateRepository;
    readonly ddeDocumentVersions: DdeDocumentVersionRepository;
    readonly ddeTemplateHeaders: DdeTemplateHeaderRepository;
    readonly ddeTemplateFooters: DdeTemplateFooterRepository;
    readonly ddeTemplateSections: DdeTemplateSectionRepository;
    readonly ddeTemplateVariables: DdeTemplateVariableRepository;
    readonly ddePdfGenerations: DdePdfGenerationRepository;
    readonly ddeHtmlGenerations: DdeHtmlGenerationRepository;
    readonly ddeExportJobs: DdeExportJobRepository;
    readonly ddeBatchGenerations: DdeBatchGenerationRepository;
    readonly ddeElectronicSignatures: DdeElectronicSignatureRepository;
    readonly ddeApprovalSignatures: DdeApprovalSignatureRepository;
    readonly ddeSignatureVerifications: DdeSignatureVerificationRepository;
    readonly ddeSignatureAuditEntries: DdeSignatureAuditEntryRepository;
    readonly ddeVersionHistories: DdeVersionHistoryRepository;
    readonly ddeRetentionPolicies: DdeRetentionPolicyRepository;
    readonly ddeArchiveRecords: DdeArchiveRecordRepository;
    readonly ddeSharingPolicies: DdeSharingPolicyRepository;
    readonly ddeEmailDeliveries: DdeEmailDeliveryRepository;
    readonly ddeDownloadDeliveries: DdeDownloadDeliveryRepository;
    readonly ddeWebhookDeliveries: DdeWebhookDeliveryRepository;
    readonly ddeGenerationAnalytics: DdeGenerationAnalyticsRepository;
    readonly ddeDeliveryAnalytics: DdeDeliveryAnalyticsRepository;
    readonly ddeStorageAnalytics: DdeStorageAnalyticsRepository;
    readonly ddeDocumentMetrics: DdeDocumentMetricRepository;
    readonly ddeDocumentHealth: DdeDocumentHealthRepository;
    readonly ddePendingSignatures: DdePendingSignatureRepository;
    readonly ddeDocumentFailures: DdeDocumentFailureRepository;
    readonly ddeAuditLogs: DdeAuditLogRepository;`;
    da = da.replace(dweProp, dweProp + "\n" + ddeProps);

    const dweCtor = "        this.dweAuditLogs = new DweAuditLogRepository();";
    const ddeCtor = `        this.ddeDocumentHubs = new DdeDocumentHubRepository();
        this.ddeDocumentTypes = new DdeDocumentTypeRepository();
        this.ddeDocumentCategories = new DdeDocumentCategoryRepository();
        this.ddeDocumentTemplates = new DdeDocumentTemplateRepository();
        this.ddeDocumentVersions = new DdeDocumentVersionRepository();
        this.ddeTemplateHeaders = new DdeTemplateHeaderRepository();
        this.ddeTemplateFooters = new DdeTemplateFooterRepository();
        this.ddeTemplateSections = new DdeTemplateSectionRepository();
        this.ddeTemplateVariables = new DdeTemplateVariableRepository();
        this.ddePdfGenerations = new DdePdfGenerationRepository();
        this.ddeHtmlGenerations = new DdeHtmlGenerationRepository();
        this.ddeExportJobs = new DdeExportJobRepository();
        this.ddeBatchGenerations = new DdeBatchGenerationRepository();
        this.ddeElectronicSignatures = new DdeElectronicSignatureRepository();
        this.ddeApprovalSignatures = new DdeApprovalSignatureRepository();
        this.ddeSignatureVerifications = new DdeSignatureVerificationRepository();
        this.ddeSignatureAuditEntries = new DdeSignatureAuditEntryRepository();
        this.ddeVersionHistories = new DdeVersionHistoryRepository();
        this.ddeRetentionPolicies = new DdeRetentionPolicyRepository();
        this.ddeArchiveRecords = new DdeArchiveRecordRepository();
        this.ddeSharingPolicies = new DdeSharingPolicyRepository();
        this.ddeEmailDeliveries = new DdeEmailDeliveryRepository();
        this.ddeDownloadDeliveries = new DdeDownloadDeliveryRepository();
        this.ddeWebhookDeliveries = new DdeWebhookDeliveryRepository();
        this.ddeGenerationAnalytics = new DdeGenerationAnalyticsRepository();
        this.ddeDeliveryAnalytics = new DdeDeliveryAnalyticsRepository();
        this.ddeStorageAnalytics = new DdeStorageAnalyticsRepository();
        this.ddeDocumentMetrics = new DdeDocumentMetricRepository();
        this.ddeDocumentHealth = new DdeDocumentHealthRepository();
        this.ddePendingSignatures = new DdePendingSignatureRepository();
        this.ddeDocumentFailures = new DdeDocumentFailureRepository();
        this.ddeAuditLogs = new DdeAuditLogRepository();`;
    da = da.replace(dweCtor, dweCtor + "\n" + ddeCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("ddeDocumentHubs")) {
    ds = ds.replace(
        "    dweAuditLogs: databaseAccess.dweAuditLogs,",
        `    dweAuditLogs: databaseAccess.dweAuditLogs,
    ddeDocumentHubs: databaseAccess.ddeDocumentHubs,
    ddeDocumentTypes: databaseAccess.ddeDocumentTypes,
    ddeDocumentCategories: databaseAccess.ddeDocumentCategories,
    ddeDocumentTemplates: databaseAccess.ddeDocumentTemplates,
    ddeDocumentVersions: databaseAccess.ddeDocumentVersions,
    ddeTemplateHeaders: databaseAccess.ddeTemplateHeaders,
    ddeTemplateFooters: databaseAccess.ddeTemplateFooters,
    ddeTemplateSections: databaseAccess.ddeTemplateSections,
    ddeTemplateVariables: databaseAccess.ddeTemplateVariables,
    ddePdfGenerations: databaseAccess.ddePdfGenerations,
    ddeHtmlGenerations: databaseAccess.ddeHtmlGenerations,
    ddeExportJobs: databaseAccess.ddeExportJobs,
    ddeBatchGenerations: databaseAccess.ddeBatchGenerations,
    ddeElectronicSignatures: databaseAccess.ddeElectronicSignatures,
    ddeApprovalSignatures: databaseAccess.ddeApprovalSignatures,
    ddeSignatureVerifications: databaseAccess.ddeSignatureVerifications,
    ddeSignatureAuditEntries: databaseAccess.ddeSignatureAuditEntries,
    ddeVersionHistories: databaseAccess.ddeVersionHistories,
    ddeRetentionPolicies: databaseAccess.ddeRetentionPolicies,
    ddeArchiveRecords: databaseAccess.ddeArchiveRecords,
    ddeSharingPolicies: databaseAccess.ddeSharingPolicies,
    ddeEmailDeliveries: databaseAccess.ddeEmailDeliveries,
    ddeDownloadDeliveries: databaseAccess.ddeDownloadDeliveries,
    ddeWebhookDeliveries: databaseAccess.ddeWebhookDeliveries,
    ddeGenerationAnalytics: databaseAccess.ddeGenerationAnalytics,
    ddeDeliveryAnalytics: databaseAccess.ddeDeliveryAnalytics,
    ddeStorageAnalytics: databaseAccess.ddeStorageAnalytics,
    ddeDocumentMetrics: databaseAccess.ddeDocumentMetrics,
    ddeDocumentHealth: databaseAccess.ddeDocumentHealth,
    ddePendingSignatures: databaseAccess.ddePendingSignatures,
    ddeDocumentFailures: databaseAccess.ddeDocumentFailures,
    ddeAuditLogs: databaseAccess.ddeAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for DDE");
