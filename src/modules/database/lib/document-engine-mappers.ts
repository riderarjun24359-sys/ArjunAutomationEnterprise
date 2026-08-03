import type { DbDdeDocumentHub,
    DbDdeDocumentType,
    DbDdeDocumentCategory,
    DbDdeDocumentTemplate,
    DbDdeDocumentVersion,
    DbDdeTemplateHeader,
    DbDdeTemplateFooter,
    DbDdeTemplateSection,
    DbDdeTemplateVariable,
    DbDdePdfGeneration,
    DbDdeHtmlGeneration,
    DbDdeExportJob,
    DbDdeBatchGeneration,
    DbDdeElectronicSignature,
    DbDdeApprovalSignature,
    DbDdeSignatureVerification,
    DbDdeSignatureAuditEntry,
    DbDdeVersionHistory,
    DbDdeRetentionPolicy,
    DbDdeArchiveRecord,
    DbDdeSharingPolicy,
    DbDdeEmailDelivery,
    DbDdeDownloadDelivery,
    DbDdeWebhookDelivery,
    DbDdeGenerationAnalytics,
    DbDdeDeliveryAnalytics,
    DbDdeStorageAnalytics,
    DbDdeDocumentMetric,
    DbDdeDocumentHealth,
    DbDdePendingSignature,
    DbDdeDocumentFailure,
    DbDdeAuditLog } from "@/src/modules/database/types/platform";
import type { CreateDocumentHubInput,
    DocumentHubSummary,
    CreateDocumentTypeInput,
    DocumentTypeSummary,
    CreateDocumentCategoryInput,
    DocumentCategorySummary,
    CreateDocumentTemplateInput,
    DocumentTemplateSummary,
    CreateDocumentVersionInput,
    DocumentVersionSummary,
    CreateTemplateHeaderInput,
    TemplateHeaderSummary,
    CreateTemplateFooterInput,
    TemplateFooterSummary,
    CreateTemplateSectionInput,
    TemplateSectionSummary,
    CreateTemplateVariableInput,
    TemplateVariableSummary,
    CreatePdfGenerationInput,
    PdfGenerationSummary,
    CreateHtmlGenerationInput,
    HtmlGenerationSummary,
    CreateExportJobInput,
    ExportJobSummary,
    CreateBatchGenerationInput,
    BatchGenerationSummary,
    CreateElectronicSignatureInput,
    ElectronicSignatureSummary,
    CreateApprovalSignatureInput,
    ApprovalSignatureSummary,
    CreateSignatureVerificationInput,
    SignatureVerificationSummary,
    CreateSignatureAuditEntryInput,
    SignatureAuditEntrySummary,
    CreateVersionHistoryInput,
    VersionHistorySummary,
    CreateRetentionPolicyInput,
    RetentionPolicySummary,
    CreateArchiveRecordInput,
    ArchiveRecordSummary,
    CreateSharingPolicyInput,
    SharingPolicySummary,
    CreateEmailDeliveryInput,
    EmailDeliverySummary,
    CreateDownloadDeliveryInput,
    DownloadDeliverySummary,
    CreateWebhookDeliveryInput,
    WebhookDeliverySummary,
    CreateGenerationAnalyticsInput,
    GenerationAnalyticsSummary,
    CreateDeliveryAnalyticsInput,
    DeliveryAnalyticsSummary,
    CreateStorageAnalyticsInput,
    StorageAnalyticsSummary,
    CreateDocumentMetricInput,
    DocumentMetricSummary,
    CreateDocumentHealthInput,
    DocumentHealthSummary,
    CreatePendingSignatureInput,
    PendingSignatureSummary,
    CreateDocumentFailureInput,
    DocumentFailureSummary,
    DdeDashboardStats,
    DdePipelineInfo,
    AuditEntry } from "@/src/modules/document-engine/types";

export function buildDocumentHubLookupMaps(hubs: DbDdeDocumentHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildDdePipelineInfo(): DdePipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "template", label: "Template" },
        { key: "generate", label: "Generate" },
        { key: "sign", label: "Sign" },
        { key: "deliver", label: "Deliver" },
    ];
    return { stages, currentStage: "generate", nextStage: "sign", previousStage: "template" };
}

export function buildDdeAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbDdeAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapDocumentHubSummary(record: DbDdeDocumentHub): DocumentHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildDocumentHubPayload(organizationId: string, input: CreateDocumentHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapDocumentTypeSummary(record: DbDdeDocumentType, maps?: { hubNameById: Map<string, string> }): DocumentTypeSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        typeKey: record.type_key as string,
        typeName: record.type_name as string,
        typeCategory: record.type_category as string,
        status: record.status,
    };
}

export function buildDocumentTypePayload(organizationId: string, input: CreateDocumentTypeInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        type_key: input.typeKey ?? '',
        type_name: input.typeName ?? '',
        type_category: input.typeCategory ?? '',
        status: "active",
    };
}

export function mapDocumentCategorySummary(record: DbDdeDocumentCategory, maps?: { hubNameById: Map<string, string> }): DocumentCategorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        categoryKey: record.category_key as string,
        categoryName: record.category_name as string,
        categoryType: record.category_type as string,
        status: record.status,
    };
}

export function buildDocumentCategoryPayload(organizationId: string, input: CreateDocumentCategoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        category_key: input.categoryKey ?? '',
        category_name: input.categoryName ?? '',
        category_type: input.categoryType ?? '',
        status: "active",
    };
}

export function mapDocumentTemplateSummary(record: DbDdeDocumentTemplate, maps?: { hubNameById: Map<string, string> }): DocumentTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateType: record.template_type as string,
        status: record.status,
    };
}

export function buildDocumentTemplatePayload(organizationId: string, input: CreateDocumentTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_type: input.templateType ?? '',
        status: "active",
    };
}

export function mapDocumentVersionSummary(record: DbDdeDocumentVersion, maps?: { hubNameById: Map<string, string> }): DocumentVersionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionNumber: record.version_number as string,
        releaseChannel: record.release_channel as string,
        status: record.status,
    };
}

export function buildDocumentVersionPayload(organizationId: string, input: CreateDocumentVersionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        version_key: input.versionKey ?? '',
        version_number: input.versionNumber ?? '',
        release_channel: input.releaseChannel ?? '',
        status: "active",
    };
}

export function mapTemplateHeaderSummary(record: DbDdeTemplateHeader, maps?: { hubNameById: Map<string, string> }): TemplateHeaderSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        headerKey: record.header_key as string,
        headerName: record.header_name as string,
        headerContent: record.header_content as string,
        status: record.status,
    };
}

export function buildTemplateHeaderPayload(organizationId: string, input: CreateTemplateHeaderInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        header_key: input.headerKey ?? '',
        header_name: input.headerName ?? '',
        header_content: input.headerContent ?? '',
        status: "active",
    };
}

export function mapTemplateFooterSummary(record: DbDdeTemplateFooter, maps?: { hubNameById: Map<string, string> }): TemplateFooterSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        footerKey: record.footer_key as string,
        footerName: record.footer_name as string,
        footerContent: record.footer_content as string,
        status: record.status,
    };
}

export function buildTemplateFooterPayload(organizationId: string, input: CreateTemplateFooterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        footer_key: input.footerKey ?? '',
        footer_name: input.footerName ?? '',
        footer_content: input.footerContent ?? '',
        status: "active",
    };
}

export function mapTemplateSectionSummary(record: DbDdeTemplateSection, maps?: { hubNameById: Map<string, string> }): TemplateSectionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        sectionKey: record.section_key as string,
        sectionName: record.section_name as string,
        sectionType: record.section_type as string,
        status: record.status,
    };
}

export function buildTemplateSectionPayload(organizationId: string, input: CreateTemplateSectionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        section_key: input.sectionKey ?? '',
        section_name: input.sectionName ?? '',
        section_type: input.sectionType ?? '',
        status: "active",
    };
}

export function mapTemplateVariableSummary(record: DbDdeTemplateVariable, maps?: { hubNameById: Map<string, string> }): TemplateVariableSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        variableKey: record.variable_key as string,
        variableName: record.variable_name as string,
        variableType: record.variable_type as string,
        status: record.status,
    };
}

export function buildTemplateVariablePayload(organizationId: string, input: CreateTemplateVariableInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        variable_key: input.variableKey ?? '',
        variable_name: input.variableName ?? '',
        variable_type: input.variableType ?? '',
        status: "active",
    };
}

export function mapPdfGenerationSummary(record: DbDdePdfGeneration, maps?: { hubNameById: Map<string, string> }): PdfGenerationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generationKey: record.generation_key as string,
        generationName: record.generation_name as string,
        generationStatus: record.generation_status as string,
        status: record.status,
    };
}

export function buildPdfGenerationPayload(organizationId: string, input: CreatePdfGenerationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        generation_key: input.generationKey ?? '',
        generation_name: input.generationName ?? '',
        generation_status: input.generationStatus ?? '',
        status: "active",
    };
}

export function mapHtmlGenerationSummary(record: DbDdeHtmlGeneration, maps?: { hubNameById: Map<string, string> }): HtmlGenerationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        generationKey: record.generation_key as string,
        generationName: record.generation_name as string,
        generationStatus: record.generation_status as string,
        status: record.status,
    };
}

export function buildHtmlGenerationPayload(organizationId: string, input: CreateHtmlGenerationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        generation_key: input.generationKey ?? '',
        generation_name: input.generationName ?? '',
        generation_status: input.generationStatus ?? '',
        status: "active",
    };
}

export function mapExportJobSummary(record: DbDdeExportJob, maps?: { hubNameById: Map<string, string> }): ExportJobSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        jobKey: record.job_key as string,
        jobName: record.job_name as string,
        jobStatus: record.job_status as string,
        status: record.status,
    };
}

export function buildExportJobPayload(organizationId: string, input: CreateExportJobInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        job_key: input.jobKey ?? '',
        job_name: input.jobName ?? '',
        job_status: input.jobStatus ?? '',
        status: "active",
    };
}

export function mapBatchGenerationSummary(record: DbDdeBatchGeneration, maps?: { hubNameById: Map<string, string> }): BatchGenerationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        batchKey: record.batch_key as string,
        batchName: record.batch_name as string,
        batchStatus: record.batch_status as string,
        status: record.status,
    };
}

export function buildBatchGenerationPayload(organizationId: string, input: CreateBatchGenerationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        batch_key: input.batchKey ?? '',
        batch_name: input.batchName ?? '',
        batch_status: input.batchStatus ?? '',
        status: "active",
    };
}

export function mapElectronicSignatureSummary(record: DbDdeElectronicSignature, maps?: { hubNameById: Map<string, string> }): ElectronicSignatureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        signatureKey: record.signature_key as string,
        signatureName: record.signature_name as string,
        signatureStatus: record.signature_status as string,
        status: record.status,
    };
}

export function buildElectronicSignaturePayload(organizationId: string, input: CreateElectronicSignatureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        signature_key: input.signatureKey ?? '',
        signature_name: input.signatureName ?? '',
        signature_status: input.signatureStatus ?? '',
        status: "active",
    };
}

export function mapApprovalSignatureSummary(record: DbDdeApprovalSignature, maps?: { hubNameById: Map<string, string> }): ApprovalSignatureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        signatureKey: record.signature_key as string,
        signatureName: record.signature_name as string,
        signatureStatus: record.signature_status as string,
        status: record.status,
    };
}

export function buildApprovalSignaturePayload(organizationId: string, input: CreateApprovalSignatureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        signature_key: input.signatureKey ?? '',
        signature_name: input.signatureName ?? '',
        signature_status: input.signatureStatus ?? '',
        status: "active",
    };
}

export function mapSignatureVerificationSummary(record: DbDdeSignatureVerification, maps?: { hubNameById: Map<string, string> }): SignatureVerificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        verificationKey: record.verification_key as string,
        verificationStatus: record.verification_status as string,
        verificationResult: record.verification_result as string,
        status: record.status,
    };
}

export function buildSignatureVerificationPayload(organizationId: string, input: CreateSignatureVerificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        verification_key: input.verificationKey ?? '',
        verification_status: input.verificationStatus ?? '',
        verification_result: input.verificationResult ?? '',
        status: "active",
    };
}

export function mapSignatureAuditEntrySummary(record: DbDdeSignatureAuditEntry, maps?: { hubNameById: Map<string, string> }): SignatureAuditEntrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        auditKey: record.audit_key as string,
        auditAction: record.audit_action as string,
        auditSummary: record.audit_summary as string,
        status: record.status,
    };
}

export function buildSignatureAuditEntryPayload(organizationId: string, input: CreateSignatureAuditEntryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        audit_key: input.auditKey ?? '',
        audit_action: input.auditAction ?? '',
        audit_summary: input.auditSummary ?? '',
        status: "active",
    };
}

export function mapVersionHistorySummary(record: DbDdeVersionHistory, maps?: { hubNameById: Map<string, string> }): VersionHistorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        historyKey: record.history_key as string,
        historyVersion: record.history_version as string,
        historySummary: record.history_summary as string,
        status: record.status,
    };
}

export function buildVersionHistoryPayload(organizationId: string, input: CreateVersionHistoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        history_key: input.historyKey ?? '',
        history_version: input.historyVersion ?? '',
        history_summary: input.historySummary ?? '',
        status: "active",
    };
}

export function mapRetentionPolicySummary(record: DbDdeRetentionPolicy, maps?: { hubNameById: Map<string, string> }): RetentionPolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        retentionDays: record.retention_days as number,
        status: record.status,
    };
}

export function buildRetentionPolicyPayload(organizationId: string, input: CreateRetentionPolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        retention_days: input.retentionDays ?? 0,
        status: "active",
    };
}

export function mapArchiveRecordSummary(record: DbDdeArchiveRecord, maps?: { hubNameById: Map<string, string> }): ArchiveRecordSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        archiveKey: record.archive_key as string,
        archiveName: record.archive_name as string,
        archiveStatus: record.archive_status as string,
        status: record.status,
    };
}

export function buildArchiveRecordPayload(organizationId: string, input: CreateArchiveRecordInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        archive_key: input.archiveKey ?? '',
        archive_name: input.archiveName ?? '',
        archive_status: input.archiveStatus ?? '',
        status: "active",
    };
}

export function mapSharingPolicySummary(record: DbDdeSharingPolicy, maps?: { hubNameById: Map<string, string> }): SharingPolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        sharingScope: record.sharing_scope as string,
        status: record.status,
    };
}

export function buildSharingPolicyPayload(organizationId: string, input: CreateSharingPolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        sharing_scope: input.sharingScope ?? '',
        status: "active",
    };
}

export function mapEmailDeliverySummary(record: DbDdeEmailDelivery, maps?: { hubNameById: Map<string, string> }): EmailDeliverySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        deliveryKey: record.delivery_key as string,
        deliveryName: record.delivery_name as string,
        deliveryStatus: record.delivery_status as string,
        status: record.status,
    };
}

export function buildEmailDeliveryPayload(organizationId: string, input: CreateEmailDeliveryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        delivery_key: input.deliveryKey ?? '',
        delivery_name: input.deliveryName ?? '',
        delivery_status: input.deliveryStatus ?? '',
        status: "active",
    };
}

export function mapDownloadDeliverySummary(record: DbDdeDownloadDelivery, maps?: { hubNameById: Map<string, string> }): DownloadDeliverySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        deliveryKey: record.delivery_key as string,
        deliveryName: record.delivery_name as string,
        deliveryStatus: record.delivery_status as string,
        status: record.status,
    };
}

export function buildDownloadDeliveryPayload(organizationId: string, input: CreateDownloadDeliveryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        delivery_key: input.deliveryKey ?? '',
        delivery_name: input.deliveryName ?? '',
        delivery_status: input.deliveryStatus ?? '',
        status: "active",
    };
}

export function mapWebhookDeliverySummary(record: DbDdeWebhookDelivery, maps?: { hubNameById: Map<string, string> }): WebhookDeliverySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        deliveryKey: record.delivery_key as string,
        deliveryName: record.delivery_name as string,
        deliveryStatus: record.delivery_status as string,
        status: record.status,
    };
}

export function buildWebhookDeliveryPayload(organizationId: string, input: CreateWebhookDeliveryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        delivery_key: input.deliveryKey ?? '',
        delivery_name: input.deliveryName ?? '',
        delivery_status: input.deliveryStatus ?? '',
        status: "active",
    };
}

export function mapGenerationAnalyticsSummary(record: DbDdeGenerationAnalytics, maps?: { hubNameById: Map<string, string> }): GenerationAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildGenerationAnalyticsPayload(organizationId: string, input: CreateGenerationAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapDeliveryAnalyticsSummary(record: DbDdeDeliveryAnalytics, maps?: { hubNameById: Map<string, string> }): DeliveryAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildDeliveryAnalyticsPayload(organizationId: string, input: CreateDeliveryAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapStorageAnalyticsSummary(record: DbDdeStorageAnalytics, maps?: { hubNameById: Map<string, string> }): StorageAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildStorageAnalyticsPayload(organizationId: string, input: CreateStorageAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapDocumentMetricSummary(record: DbDdeDocumentMetric): DocumentMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        generatedCount: record.generated_count as number,
        overallDocumentScore: record.overall_document_score as number,
        status: record.status,
    };
}

export function buildDocumentMetricPayload(organizationId: string, input: CreateDocumentMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        generated_count: input.generatedCount ?? 0,
        overall_document_score: input.overallDocumentScore ?? 0,
        status: "active",
    };
}

export function mapDocumentHealthSummary(record: DbDdeDocumentHealth): DocumentHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildDocumentHealthPayload(organizationId: string, input: CreateDocumentHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapPendingSignatureSummary(record: DbDdePendingSignature, maps?: { hubNameById: Map<string, string> }): PendingSignatureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        signatureKey: record.signature_key as string,
        signatureName: record.signature_name as string,
        signatureStatus: record.signature_status as string,
        status: record.status,
    };
}

export function buildPendingSignaturePayload(organizationId: string, input: CreatePendingSignatureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        signature_key: input.signatureKey ?? '',
        signature_name: input.signatureName ?? '',
        signature_status: input.signatureStatus ?? '',
        status: "active",
    };
}

export function mapDocumentFailureSummary(record: DbDdeDocumentFailure, maps?: { hubNameById: Map<string, string> }): DocumentFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildDocumentFailurePayload(organizationId: string, input: CreateDocumentFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.documentHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapTemplateSectionForStats(r: DbDdeTemplateSection) { return { status: r.status }; }
export function mapRetentionPolicyForStats(r: DbDdeRetentionPolicy) { return { status: r.status }; }
export function mapDocumentMetricForStats(r: DbDdeDocumentMetric) {
    return {
        generated_count: r.generated_count,
        download_count: r.download_count,
        delivery_success_rate: r.delivery_success_rate,
        failure_count: r.failure_count,
        signature_pending_count: r.signature_pending_count,
        storage_usage_mb: r.storage_usage_mb,
        overall_document_score: r.overall_document_score,
        status: r.status,
    };
}
export function mapPdfGenerationForStats(r: DbDdePdfGeneration) { return { generation_status: r.generation_status, status: r.status }; }
export function mapPendingSignatureForStats(r: DbDdePendingSignature) { return { status: r.status }; }
export function mapElectronicSignatureForStats(r: DbDdeElectronicSignature) { return { status: r.status }; }
export function mapDocumentHealthForStats(r: DbDdeDocumentHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapDocumentFailureForStats(r: DbDdeDocumentFailure) { return { status: r.status }; }

export function buildDdeDashboardStats(input: {
    documentHubs: DocumentHubSummary[];
    templateSections: ReturnType<typeof mapTemplateSectionForStats>[];
    retentionPolicies: ReturnType<typeof mapRetentionPolicyForStats>[];
    documentMetrics: ReturnType<typeof mapDocumentMetricForStats>[];
    pdfGenerations: ReturnType<typeof mapPdfGenerationForStats>[];
    pendingSignatures: ReturnType<typeof mapPendingSignatureForStats>[];
    electronicSignatures: ReturnType<typeof mapElectronicSignatureForStats>[];
    documentHealth: ReturnType<typeof mapDocumentHealthForStats>[];
    documentFailures: DocumentFailureSummary[];
    auditLogs: AuditEntry[];
}): DdeDashboardStats {
    const activeHubs = input.documentHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.documentMetrics[0];
    const latestHealth = input.documentHealth[0];
    return {
        totalDocumentHubs: input.documentHubs.length,
        activeDocumentHubs: activeHubs,
        templateSectionCount: input.templateSections.length,
        retentionPolicyCount: input.retentionPolicies.length,
        pdfGenerationCount: input.pdfGenerations.length,
        openPendingSignatureCount: input.pendingSignatures.filter((r) => r.status === "open" || r.status === "pending").length,
        openFailureCount: input.documentFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallDocumentScore: latestMetrics?.overall_document_score ?? latestHealth?.overall_score ?? 0,
        generatedCountScore: latestMetrics?.generated_count ?? 0,
        deliverySuccessRateScore: latestMetrics?.delivery_success_rate ?? 0,
        failureCountScore: latestMetrics?.failure_count ?? 0,
        downloadCountScore: latestMetrics?.download_count ?? 0,
        storageUsageScore: latestMetrics?.storage_usage_mb ?? 0,
        auditCount: input.auditLogs.length,
    };
}
