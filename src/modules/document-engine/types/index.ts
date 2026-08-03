export interface DdeDashboardStats {
    totalDocumentHubs: number;
    activeDocumentHubs: number;
    templateSectionCount: number;
    retentionPolicyCount: number;
    pdfGenerationCount: number;
    openPendingSignatureCount: number;
    openFailureCount: number;
    overallDocumentScore: number;
    generatedCountScore: number;
    deliverySuccessRateScore: number;
    failureCountScore: number;
    downloadCountScore: number;
    storageUsageScore: number;
    auditCount: number;
}

export interface DdePipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface DdeSdkRegisterDocumentInput { documentHubId: string; typeKey?: string; typeName?: string; }
export interface DdeSdkRegisterDocumentResult { typeId: string; typeKey: string; status: string; }
export interface DdeSdkConfigureTemplateInput { documentHubId: string; sectionKey?: string; sectionName?: string; }
export interface DdeSdkConfigureTemplateResult { sectionId: string; sectionKey: string; status: string; }
export interface DdeSdkRunDocumentGenerationInput { documentHubId: string; generationKey?: string; generationName?: string; }
export interface DdeSdkRunDocumentGenerationResult { generationId: string; generationKey: string; status: string; }

export interface DocumentHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateDocumentHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface DocumentTypeSummary {
    id: string;
    hubName?: string;
        typeKey: string;
    typeName: string;
    typeCategory: string;
    status: string;
}

export interface CreateDocumentTypeInput {
        documentHubId: string;
        typeKey?: string;
    typeName?: string;
    typeCategory?: string;
}

export interface DocumentCategorySummary {
    id: string;
    hubName?: string;
        categoryKey: string;
    categoryName: string;
    categoryType: string;
    status: string;
}

export interface CreateDocumentCategoryInput {
        documentHubId: string;
        categoryKey?: string;
    categoryName?: string;
    categoryType?: string;
}

export interface DocumentTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateType: string;
    status: string;
}

export interface CreateDocumentTemplateInput {
        documentHubId: string;
        templateKey?: string;
    templateName?: string;
    templateType?: string;
}

export interface DocumentVersionSummary {
    id: string;
    hubName?: string;
        versionKey: string;
    versionNumber: string;
    releaseChannel: string;
    status: string;
}

export interface CreateDocumentVersionInput {
        documentHubId: string;
        versionKey?: string;
    versionNumber?: string;
    releaseChannel?: string;
}

export interface TemplateHeaderSummary {
    id: string;
    hubName?: string;
        headerKey: string;
    headerName: string;
    headerContent: string;
    status: string;
}

export interface CreateTemplateHeaderInput {
        documentHubId: string;
        headerKey?: string;
    headerName?: string;
    headerContent?: string;
}

export interface TemplateFooterSummary {
    id: string;
    hubName?: string;
        footerKey: string;
    footerName: string;
    footerContent: string;
    status: string;
}

export interface CreateTemplateFooterInput {
        documentHubId: string;
        footerKey?: string;
    footerName?: string;
    footerContent?: string;
}

export interface TemplateSectionSummary {
    id: string;
    hubName?: string;
        sectionKey: string;
    sectionName: string;
    sectionType: string;
    status: string;
}

export interface CreateTemplateSectionInput {
        documentHubId: string;
        sectionKey?: string;
    sectionName?: string;
    sectionType?: string;
}

export interface TemplateVariableSummary {
    id: string;
    hubName?: string;
        variableKey: string;
    variableName: string;
    variableType: string;
    status: string;
}

export interface CreateTemplateVariableInput {
        documentHubId: string;
        variableKey?: string;
    variableName?: string;
    variableType?: string;
}

export interface PdfGenerationSummary {
    id: string;
    hubName?: string;
        generationKey: string;
    generationName: string;
    generationStatus: string;
    status: string;
}

export interface CreatePdfGenerationInput {
        documentHubId: string;
        generationKey?: string;
    generationName?: string;
    generationStatus?: string;
}

export interface HtmlGenerationSummary {
    id: string;
    hubName?: string;
        generationKey: string;
    generationName: string;
    generationStatus: string;
    status: string;
}

export interface CreateHtmlGenerationInput {
        documentHubId: string;
        generationKey?: string;
    generationName?: string;
    generationStatus?: string;
}

export interface ExportJobSummary {
    id: string;
    hubName?: string;
        jobKey: string;
    jobName: string;
    jobStatus: string;
    status: string;
}

export interface CreateExportJobInput {
        documentHubId: string;
        jobKey?: string;
    jobName?: string;
    jobStatus?: string;
}

export interface BatchGenerationSummary {
    id: string;
    hubName?: string;
        batchKey: string;
    batchName: string;
    batchStatus: string;
    status: string;
}

export interface CreateBatchGenerationInput {
        documentHubId: string;
        batchKey?: string;
    batchName?: string;
    batchStatus?: string;
}

export interface ElectronicSignatureSummary {
    id: string;
    hubName?: string;
        signatureKey: string;
    signatureName: string;
    signatureStatus: string;
    status: string;
}

export interface CreateElectronicSignatureInput {
        documentHubId: string;
        signatureKey?: string;
    signatureName?: string;
    signatureStatus?: string;
}

export interface ApprovalSignatureSummary {
    id: string;
    hubName?: string;
        signatureKey: string;
    signatureName: string;
    signatureStatus: string;
    status: string;
}

export interface CreateApprovalSignatureInput {
        documentHubId: string;
        signatureKey?: string;
    signatureName?: string;
    signatureStatus?: string;
}

export interface SignatureVerificationSummary {
    id: string;
    hubName?: string;
        verificationKey: string;
    verificationStatus: string;
    verificationResult: string;
    status: string;
}

export interface CreateSignatureVerificationInput {
        documentHubId: string;
        verificationKey?: string;
    verificationStatus?: string;
    verificationResult?: string;
}

export interface SignatureAuditEntrySummary {
    id: string;
    hubName?: string;
        auditKey: string;
    auditAction: string;
    auditSummary: string;
    status: string;
}

export interface CreateSignatureAuditEntryInput {
        documentHubId: string;
        auditKey?: string;
    auditAction?: string;
    auditSummary?: string;
}

export interface VersionHistorySummary {
    id: string;
    hubName?: string;
        historyKey: string;
    historyVersion: string;
    historySummary: string;
    status: string;
}

export interface CreateVersionHistoryInput {
        documentHubId: string;
        historyKey?: string;
    historyVersion?: string;
    historySummary?: string;
}

export interface RetentionPolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    retentionDays: number;
    status: string;
}

export interface CreateRetentionPolicyInput {
        documentHubId: string;
        policyKey?: string;
    policyName?: string;
    retentionDays?: number;
}

export interface ArchiveRecordSummary {
    id: string;
    hubName?: string;
        archiveKey: string;
    archiveName: string;
    archiveStatus: string;
    status: string;
}

export interface CreateArchiveRecordInput {
        documentHubId: string;
        archiveKey?: string;
    archiveName?: string;
    archiveStatus?: string;
}

export interface SharingPolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    sharingScope: string;
    status: string;
}

export interface CreateSharingPolicyInput {
        documentHubId: string;
        policyKey?: string;
    policyName?: string;
    sharingScope?: string;
}

export interface EmailDeliverySummary {
    id: string;
    hubName?: string;
        deliveryKey: string;
    deliveryName: string;
    deliveryStatus: string;
    status: string;
}

export interface CreateEmailDeliveryInput {
        documentHubId: string;
        deliveryKey?: string;
    deliveryName?: string;
    deliveryStatus?: string;
}

export interface DownloadDeliverySummary {
    id: string;
    hubName?: string;
        deliveryKey: string;
    deliveryName: string;
    deliveryStatus: string;
    status: string;
}

export interface CreateDownloadDeliveryInput {
        documentHubId: string;
        deliveryKey?: string;
    deliveryName?: string;
    deliveryStatus?: string;
}

export interface WebhookDeliverySummary {
    id: string;
    hubName?: string;
        deliveryKey: string;
    deliveryName: string;
    deliveryStatus: string;
    status: string;
}

export interface CreateWebhookDeliveryInput {
        documentHubId: string;
        deliveryKey?: string;
    deliveryName?: string;
    deliveryStatus?: string;
}

export interface GenerationAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateGenerationAnalyticsInput {
        documentHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface DeliveryAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateDeliveryAnalyticsInput {
        documentHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface StorageAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateStorageAnalyticsInput {
        documentHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface DocumentMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    generatedCount: number;
    overallDocumentScore: number;
    status: string;
}

export interface CreateDocumentMetricInput {
        metricsKey?: string;
    generatedCount?: number;
    overallDocumentScore?: number;
}

export interface DocumentHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateDocumentHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface PendingSignatureSummary {
    id: string;
    hubName?: string;
        signatureKey: string;
    signatureName: string;
    signatureStatus: string;
    status: string;
}

export interface CreatePendingSignatureInput {
        documentHubId: string;
        signatureKey?: string;
    signatureName?: string;
    signatureStatus?: string;
}

export interface DocumentFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateDocumentFailureInput {
        documentHubId: string;
        failureKey?: string;
    failureType?: string;
}

