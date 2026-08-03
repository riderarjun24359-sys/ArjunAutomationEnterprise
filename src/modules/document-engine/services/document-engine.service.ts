import {
    buildDocumentHubLookupMaps,
    buildDdeAuditPayload,
    buildDdeDashboardStats,
    buildDdePipelineInfo,
    mapAuditEntry,
    buildDocumentHubPayload,
    mapDocumentHubSummary,
    buildDocumentTypePayload,
    mapDocumentTypeSummary,
    buildDocumentCategoryPayload,
    mapDocumentCategorySummary,
    buildDocumentTemplatePayload,
    mapDocumentTemplateSummary,
    buildDocumentVersionPayload,
    mapDocumentVersionSummary,
    buildTemplateHeaderPayload,
    mapTemplateHeaderSummary,
    buildTemplateFooterPayload,
    mapTemplateFooterSummary,
    buildTemplateSectionPayload,
    mapTemplateSectionSummary,
    buildTemplateVariablePayload,
    mapTemplateVariableSummary,
    buildPdfGenerationPayload,
    mapPdfGenerationSummary,
    buildHtmlGenerationPayload,
    mapHtmlGenerationSummary,
    buildExportJobPayload,
    mapExportJobSummary,
    buildBatchGenerationPayload,
    mapBatchGenerationSummary,
    buildElectronicSignaturePayload,
    mapElectronicSignatureSummary,
    buildApprovalSignaturePayload,
    mapApprovalSignatureSummary,
    buildSignatureVerificationPayload,
    mapSignatureVerificationSummary,
    buildSignatureAuditEntryPayload,
    mapSignatureAuditEntrySummary,
    buildVersionHistoryPayload,
    mapVersionHistorySummary,
    buildRetentionPolicyPayload,
    mapRetentionPolicySummary,
    buildArchiveRecordPayload,
    mapArchiveRecordSummary,
    buildSharingPolicyPayload,
    mapSharingPolicySummary,
    buildEmailDeliveryPayload,
    mapEmailDeliverySummary,
    buildDownloadDeliveryPayload,
    mapDownloadDeliverySummary,
    buildWebhookDeliveryPayload,
    mapWebhookDeliverySummary,
    buildGenerationAnalyticsPayload,
    mapGenerationAnalyticsSummary,
    buildDeliveryAnalyticsPayload,
    mapDeliveryAnalyticsSummary,
    buildStorageAnalyticsPayload,
    mapStorageAnalyticsSummary,
    buildDocumentMetricPayload,
    mapDocumentMetricSummary,
    buildDocumentHealthPayload,
    mapDocumentHealthSummary,
    buildPendingSignaturePayload,
    mapPendingSignatureSummary,
    buildDocumentFailurePayload,
    mapDocumentFailureSummary,
    mapTemplateSectionForStats,
    mapRetentionPolicyForStats,
    mapDocumentMetricForStats,
    mapPdfGenerationForStats,
    mapPendingSignatureForStats,
    mapElectronicSignatureForStats,
    mapDocumentHealthForStats,
    mapDocumentFailureForStats,
} from "@/src/modules/database/lib/document-engine-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
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
    DdeSdkRegisterDocumentInput,
    DdeSdkRegisterDocumentResult,
    DdeSdkConfigureTemplateInput,
    DdeSdkConfigureTemplateResult,
    DdeSdkRunDocumentGenerationInput,
    DdeSdkRunDocumentGenerationResult,
} from "@/src/modules/document-engine/types";

export class DocumentEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const documentHubs = await databaseService.ddeDocumentHubs.listByOrganization(organizationId);
        return buildDocumentHubLookupMaps(documentHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DdeDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildDdeDashboardStats({ documentHubs: [], templateSections: [], retentionPolicies: [], documentMetrics: [], pdfGenerations: [], pendingSignatures: [], electronicSignatures: [], documentHealth: [], documentFailures: [], auditLogs: [] });
        const [documentHubs, templateSectionsRaw, retentionPoliciesRaw, documentMetricsRaw, pdfGenerationsRaw, pendingSignaturesRaw, electronicSignaturesRaw, documentHealthRaw, documentFailures, auditLogs] = await Promise.all([
            this.getDocumentHubs(authUserId, email, fullName),
            databaseService.ddeTemplateSections.listByOrganization(context.organizationId),
            databaseService.ddeRetentionPolicies.listByOrganization(context.organizationId),
            databaseService.ddeDocumentMetrics.listByOrganization(context.organizationId),
            databaseService.ddePdfGenerations.listByOrganization(context.organizationId),
            databaseService.ddePendingSignatures.listByOrganization(context.organizationId),
            databaseService.ddeElectronicSignatures.listByOrganization(context.organizationId),
            databaseService.ddeDocumentHealth.listByOrganization(context.organizationId),
            this.getDocumentFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildDdeDashboardStats({
            documentHubs,
            templateSections: templateSectionsRaw.map(mapTemplateSectionForStats),
            retentionPolicies: retentionPoliciesRaw.map(mapRetentionPolicyForStats),
            documentMetrics: documentMetricsRaw.map(mapDocumentMetricForStats),
            pdfGenerations: pdfGenerationsRaw.map(mapPdfGenerationForStats),
            pendingSignatures: pendingSignaturesRaw.map(mapPendingSignatureForStats),
            electronicSignatures: electronicSignaturesRaw.map(mapElectronicSignatureForStats),
            documentHealth: documentHealthRaw.map(mapDocumentHealthForStats),
            documentFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): DdePipelineInfo {
        return buildDdePipelineInfo();
    }

    async getDocumentHubs(authUserId: string, email: string, fullName?: string | null): Promise<DocumentHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddeDocumentHubs.listByOrganization(context.organizationId)).map((r) => mapDocumentHubSummary(r));
    }

    async createDocumentHub(authUserId: string, email: string, input: CreateDocumentHubInput, fullName?: string | null): Promise<DocumentHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentHubs.create(buildDocumentHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentHubs");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_hubs", "create", `DocumentHub created`, created.id));
        return mapDocumentHubSummary(created);
    }

    async getDocumentTypes(authUserId: string, email: string, fullName?: string | null): Promise<DocumentTypeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeDocumentTypes.listByOrganization(context.organizationId)).map((r) => mapDocumentTypeSummary(r, maps));
    }

    async createDocumentType(authUserId: string, email: string, input: CreateDocumentTypeInput, fullName?: string | null): Promise<DocumentTypeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentTypes.create(buildDocumentTypePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentTypes");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_types", "create", `DocumentType created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocumentTypeSummary(created, maps);
    }

    async getDocumentCategorys(authUserId: string, email: string, fullName?: string | null): Promise<DocumentCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeDocumentCategories.listByOrganization(context.organizationId)).map((r) => mapDocumentCategorySummary(r, maps));
    }

    async createDocumentCategory(authUserId: string, email: string, input: CreateDocumentCategoryInput, fullName?: string | null): Promise<DocumentCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentCategories.create(buildDocumentCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentCategories");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_categories", "create", `DocumentCategory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocumentCategorySummary(created, maps);
    }

    async getDocumentTemplates(authUserId: string, email: string, fullName?: string | null): Promise<DocumentTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeDocumentTemplates.listByOrganization(context.organizationId)).map((r) => mapDocumentTemplateSummary(r, maps));
    }

    async createDocumentTemplate(authUserId: string, email: string, input: CreateDocumentTemplateInput, fullName?: string | null): Promise<DocumentTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentTemplates.create(buildDocumentTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentTemplates");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_templates", "create", `DocumentTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocumentTemplateSummary(created, maps);
    }

    async getDocumentVersions(authUserId: string, email: string, fullName?: string | null): Promise<DocumentVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeDocumentVersions.listByOrganization(context.organizationId)).map((r) => mapDocumentVersionSummary(r, maps));
    }

    async createDocumentVersion(authUserId: string, email: string, input: CreateDocumentVersionInput, fullName?: string | null): Promise<DocumentVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentVersions.create(buildDocumentVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentVersions");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_versions", "create", `DocumentVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocumentVersionSummary(created, maps);
    }

    async getTemplateHeaders(authUserId: string, email: string, fullName?: string | null): Promise<TemplateHeaderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeTemplateHeaders.listByOrganization(context.organizationId)).map((r) => mapTemplateHeaderSummary(r, maps));
    }

    async createTemplateHeader(authUserId: string, email: string, input: CreateTemplateHeaderInput, fullName?: string | null): Promise<TemplateHeaderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeTemplateHeaders.create(buildTemplateHeaderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create templateHeaders");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "template_headers", "create", `TemplateHeader created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemplateHeaderSummary(created, maps);
    }

    async getTemplateFooters(authUserId: string, email: string, fullName?: string | null): Promise<TemplateFooterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeTemplateFooters.listByOrganization(context.organizationId)).map((r) => mapTemplateFooterSummary(r, maps));
    }

    async createTemplateFooter(authUserId: string, email: string, input: CreateTemplateFooterInput, fullName?: string | null): Promise<TemplateFooterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeTemplateFooters.create(buildTemplateFooterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create templateFooters");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "template_footers", "create", `TemplateFooter created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemplateFooterSummary(created, maps);
    }

    async getTemplateSections(authUserId: string, email: string, fullName?: string | null): Promise<TemplateSectionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeTemplateSections.listByOrganization(context.organizationId)).map((r) => mapTemplateSectionSummary(r, maps));
    }

    async createTemplateSection(authUserId: string, email: string, input: CreateTemplateSectionInput, fullName?: string | null): Promise<TemplateSectionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeTemplateSections.create(buildTemplateSectionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create templateSections");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "template_sections", "create", `TemplateSection created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemplateSectionSummary(created, maps);
    }

    async getTemplateVariables(authUserId: string, email: string, fullName?: string | null): Promise<TemplateVariableSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeTemplateVariables.listByOrganization(context.organizationId)).map((r) => mapTemplateVariableSummary(r, maps));
    }

    async createTemplateVariable(authUserId: string, email: string, input: CreateTemplateVariableInput, fullName?: string | null): Promise<TemplateVariableSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeTemplateVariables.create(buildTemplateVariablePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create templateVariables");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "template_variables", "create", `TemplateVariable created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemplateVariableSummary(created, maps);
    }

    async getPdfGenerations(authUserId: string, email: string, fullName?: string | null): Promise<PdfGenerationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddePdfGenerations.listByOrganization(context.organizationId)).map((r) => mapPdfGenerationSummary(r, maps));
    }

    async createPdfGeneration(authUserId: string, email: string, input: CreatePdfGenerationInput, fullName?: string | null): Promise<PdfGenerationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddePdfGenerations.create(buildPdfGenerationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pdfGenerations");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "pdf_generations", "create", `PdfGeneration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPdfGenerationSummary(created, maps);
    }

    async getHtmlGenerations(authUserId: string, email: string, fullName?: string | null): Promise<HtmlGenerationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeHtmlGenerations.listByOrganization(context.organizationId)).map((r) => mapHtmlGenerationSummary(r, maps));
    }

    async createHtmlGeneration(authUserId: string, email: string, input: CreateHtmlGenerationInput, fullName?: string | null): Promise<HtmlGenerationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeHtmlGenerations.create(buildHtmlGenerationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create htmlGenerations");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "html_generations", "create", `HtmlGeneration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHtmlGenerationSummary(created, maps);
    }

    async getExportJobs(authUserId: string, email: string, fullName?: string | null): Promise<ExportJobSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeExportJobs.listByOrganization(context.organizationId)).map((r) => mapExportJobSummary(r, maps));
    }

    async createExportJob(authUserId: string, email: string, input: CreateExportJobInput, fullName?: string | null): Promise<ExportJobSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeExportJobs.create(buildExportJobPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create exportJobs");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "export_jobs", "create", `ExportJob created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExportJobSummary(created, maps);
    }

    async getBatchGenerations(authUserId: string, email: string, fullName?: string | null): Promise<BatchGenerationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeBatchGenerations.listByOrganization(context.organizationId)).map((r) => mapBatchGenerationSummary(r, maps));
    }

    async createBatchGeneration(authUserId: string, email: string, input: CreateBatchGenerationInput, fullName?: string | null): Promise<BatchGenerationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeBatchGenerations.create(buildBatchGenerationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create batchGenerations");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "batch_generations", "create", `BatchGeneration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBatchGenerationSummary(created, maps);
    }

    async getElectronicSignatures(authUserId: string, email: string, fullName?: string | null): Promise<ElectronicSignatureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeElectronicSignatures.listByOrganization(context.organizationId)).map((r) => mapElectronicSignatureSummary(r, maps));
    }

    async createElectronicSignature(authUserId: string, email: string, input: CreateElectronicSignatureInput, fullName?: string | null): Promise<ElectronicSignatureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeElectronicSignatures.create(buildElectronicSignaturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create electronicSignatures");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "electronic_signatures", "create", `ElectronicSignature created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapElectronicSignatureSummary(created, maps);
    }

    async getApprovalSignatures(authUserId: string, email: string, fullName?: string | null): Promise<ApprovalSignatureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeApprovalSignatures.listByOrganization(context.organizationId)).map((r) => mapApprovalSignatureSummary(r, maps));
    }

    async createApprovalSignature(authUserId: string, email: string, input: CreateApprovalSignatureInput, fullName?: string | null): Promise<ApprovalSignatureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeApprovalSignatures.create(buildApprovalSignaturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create approvalSignatures");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "approval_signatures", "create", `ApprovalSignature created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalSignatureSummary(created, maps);
    }

    async getSignatureVerifications(authUserId: string, email: string, fullName?: string | null): Promise<SignatureVerificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeSignatureVerifications.listByOrganization(context.organizationId)).map((r) => mapSignatureVerificationSummary(r, maps));
    }

    async createSignatureVerification(authUserId: string, email: string, input: CreateSignatureVerificationInput, fullName?: string | null): Promise<SignatureVerificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeSignatureVerifications.create(buildSignatureVerificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create signatureVerifications");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "signature_verifications", "create", `SignatureVerification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSignatureVerificationSummary(created, maps);
    }

    async getSignatureAuditEntrys(authUserId: string, email: string, fullName?: string | null): Promise<SignatureAuditEntrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeSignatureAuditEntries.listByOrganization(context.organizationId)).map((r) => mapSignatureAuditEntrySummary(r, maps));
    }

    async createSignatureAuditEntry(authUserId: string, email: string, input: CreateSignatureAuditEntryInput, fullName?: string | null): Promise<SignatureAuditEntrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeSignatureAuditEntries.create(buildSignatureAuditEntryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create signatureAuditEntries");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "signature_audit_entries", "create", `SignatureAuditEntry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSignatureAuditEntrySummary(created, maps);
    }

    async getVersionHistorys(authUserId: string, email: string, fullName?: string | null): Promise<VersionHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeVersionHistories.listByOrganization(context.organizationId)).map((r) => mapVersionHistorySummary(r, maps));
    }

    async createVersionHistory(authUserId: string, email: string, input: CreateVersionHistoryInput, fullName?: string | null): Promise<VersionHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeVersionHistories.create(buildVersionHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create versionHistories");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "version_histories", "create", `VersionHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVersionHistorySummary(created, maps);
    }

    async getRetentionPolicys(authUserId: string, email: string, fullName?: string | null): Promise<RetentionPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeRetentionPolicies.listByOrganization(context.organizationId)).map((r) => mapRetentionPolicySummary(r, maps));
    }

    async createRetentionPolicy(authUserId: string, email: string, input: CreateRetentionPolicyInput, fullName?: string | null): Promise<RetentionPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeRetentionPolicies.create(buildRetentionPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retentionPolicies");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "retention_policies", "create", `RetentionPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRetentionPolicySummary(created, maps);
    }

    async getArchiveRecords(authUserId: string, email: string, fullName?: string | null): Promise<ArchiveRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeArchiveRecords.listByOrganization(context.organizationId)).map((r) => mapArchiveRecordSummary(r, maps));
    }

    async createArchiveRecord(authUserId: string, email: string, input: CreateArchiveRecordInput, fullName?: string | null): Promise<ArchiveRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeArchiveRecords.create(buildArchiveRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create archiveRecords");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "archive_records", "create", `ArchiveRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapArchiveRecordSummary(created, maps);
    }

    async getSharingPolicys(authUserId: string, email: string, fullName?: string | null): Promise<SharingPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeSharingPolicies.listByOrganization(context.organizationId)).map((r) => mapSharingPolicySummary(r, maps));
    }

    async createSharingPolicy(authUserId: string, email: string, input: CreateSharingPolicyInput, fullName?: string | null): Promise<SharingPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeSharingPolicies.create(buildSharingPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create sharingPolicies");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "sharing_policies", "create", `SharingPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSharingPolicySummary(created, maps);
    }

    async getEmailDeliverys(authUserId: string, email: string, fullName?: string | null): Promise<EmailDeliverySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeEmailDeliveries.listByOrganization(context.organizationId)).map((r) => mapEmailDeliverySummary(r, maps));
    }

    async createEmailDelivery(authUserId: string, email: string, input: CreateEmailDeliveryInput, fullName?: string | null): Promise<EmailDeliverySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeEmailDeliveries.create(buildEmailDeliveryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create emailDeliveries");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "email_deliveries", "create", `EmailDelivery created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEmailDeliverySummary(created, maps);
    }

    async getDownloadDeliverys(authUserId: string, email: string, fullName?: string | null): Promise<DownloadDeliverySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeDownloadDeliveries.listByOrganization(context.organizationId)).map((r) => mapDownloadDeliverySummary(r, maps));
    }

    async createDownloadDelivery(authUserId: string, email: string, input: CreateDownloadDeliveryInput, fullName?: string | null): Promise<DownloadDeliverySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDownloadDeliveries.create(buildDownloadDeliveryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create downloadDeliveries");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "download_deliveries", "create", `DownloadDelivery created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDownloadDeliverySummary(created, maps);
    }

    async getWebhookDeliverys(authUserId: string, email: string, fullName?: string | null): Promise<WebhookDeliverySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeWebhookDeliveries.listByOrganization(context.organizationId)).map((r) => mapWebhookDeliverySummary(r, maps));
    }

    async createWebhookDelivery(authUserId: string, email: string, input: CreateWebhookDeliveryInput, fullName?: string | null): Promise<WebhookDeliverySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeWebhookDeliveries.create(buildWebhookDeliveryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create webhookDeliveries");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "webhook_deliveries", "create", `WebhookDelivery created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebhookDeliverySummary(created, maps);
    }

    async getGenerationAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<GenerationAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeGenerationAnalytics.listByOrganization(context.organizationId)).map((r) => mapGenerationAnalyticsSummary(r, maps));
    }

    async createGenerationAnalytics(authUserId: string, email: string, input: CreateGenerationAnalyticsInput, fullName?: string | null): Promise<GenerationAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeGenerationAnalytics.create(buildGenerationAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create generationAnalytics");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "generation_analytics", "create", `GenerationAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGenerationAnalyticsSummary(created, maps);
    }

    async getDeliveryAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeDeliveryAnalytics.listByOrganization(context.organizationId)).map((r) => mapDeliveryAnalyticsSummary(r, maps));
    }

    async createDeliveryAnalytics(authUserId: string, email: string, input: CreateDeliveryAnalyticsInput, fullName?: string | null): Promise<DeliveryAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDeliveryAnalytics.create(buildDeliveryAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryAnalytics");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "delivery_analytics", "create", `DeliveryAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeliveryAnalyticsSummary(created, maps);
    }

    async getStorageAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<StorageAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeStorageAnalytics.listByOrganization(context.organizationId)).map((r) => mapStorageAnalyticsSummary(r, maps));
    }

    async createStorageAnalytics(authUserId: string, email: string, input: CreateStorageAnalyticsInput, fullName?: string | null): Promise<StorageAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeStorageAnalytics.create(buildStorageAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create storageAnalytics");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "storage_analytics", "create", `StorageAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStorageAnalyticsSummary(created, maps);
    }

    async getDocumentMetrics(authUserId: string, email: string, fullName?: string | null): Promise<DocumentMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddeDocumentMetrics.listByOrganization(context.organizationId)).map(mapDocumentMetricSummary);
    }

    async createDocumentMetric(authUserId: string, email: string, input: CreateDocumentMetricInput, fullName?: string | null): Promise<DocumentMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentMetrics.create(buildDocumentMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentMetrics");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_metrics", "create", `DocumentMetric created`, created.id));
        return mapDocumentMetricSummary(created);
    }

    async getDocumentHealths(authUserId: string, email: string, fullName?: string | null): Promise<DocumentHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddeDocumentHealth.listByOrganization(context.organizationId)).map(mapDocumentHealthSummary);
    }

    async createDocumentHealth(authUserId: string, email: string, input: CreateDocumentHealthInput, fullName?: string | null): Promise<DocumentHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentHealth.create(buildDocumentHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentHealth");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_health", "create", `DocumentHealth created`, created.id));
        return mapDocumentHealthSummary(created);
    }

    async getPendingSignatures(authUserId: string, email: string, fullName?: string | null): Promise<PendingSignatureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddePendingSignatures.listByOrganization(context.organizationId)).map((r) => mapPendingSignatureSummary(r, maps));
    }

    async createPendingSignature(authUserId: string, email: string, input: CreatePendingSignatureInput, fullName?: string | null): Promise<PendingSignatureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddePendingSignatures.create(buildPendingSignaturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pendingSignatures");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "pending_signatures", "create", `PendingSignature created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPendingSignatureSummary(created, maps);
    }

    async getDocumentFailures(authUserId: string, email: string, fullName?: string | null): Promise<DocumentFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddeDocumentFailures.listByOrganization(context.organizationId)).map((r) => mapDocumentFailureSummary(r, maps));
    }

    async createDocumentFailure(authUserId: string, email: string, input: CreateDocumentFailureInput, fullName?: string | null): Promise<DocumentFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddeDocumentFailures.create(buildDocumentFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentFailures");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "document_failures", "create", `DocumentFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocumentFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddeAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getDocumentHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddeDocumentHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterDocument(authUserId: string, email: string, input: DdeSdkRegisterDocumentInput, fullName?: string | null): Promise<DdeSdkRegisterDocumentResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_document", moduleSource: "dynamic_document_engine", inputPayload: { ...input } });
        const created = await this.createDocumentType(authUserId, email, { documentHubId: input.documentHubId, typeKey: input.typeKey, typeName: input.typeName }, fullName);
        return { typeId: created.id, typeKey: created.typeKey, status: created.status };
    }

    async sdkConfigureTemplate(authUserId: string, email: string, input: DdeSdkConfigureTemplateInput, fullName?: string | null): Promise<DdeSdkConfigureTemplateResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.sectionKey ?? input.sectionName ?? "template", limit: 3 });
        const created = await this.createTemplateSection(authUserId, email, { documentHubId: input.documentHubId, sectionKey: input.sectionKey, sectionName: input.sectionName }, fullName);
        return { sectionId: created.id, sectionKey: created.sectionKey, status: created.status };
    }

    async sdkRunDocumentGeneration(authUserId: string, email: string, input: DdeSdkRunDocumentGenerationInput, fullName?: string | null): Promise<DdeSdkRunDocumentGenerationResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_document_generation", moduleSource: "dynamic_document_engine", inputPayload: { ...input } });
        const created = await this.createPdfGeneration(authUserId, email, { documentHubId: input.documentHubId, generationKey: input.generationKey, generationName: input.generationName }, fullName);
        return { generationId: created.id, generationKey: created.generationKey, status: created.status };
    }
}

export const documentEngineService = new DocumentEngineService();
