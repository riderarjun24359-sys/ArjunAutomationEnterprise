import { z } from "zod";

export const documentHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type documentHubsFormValues = z.infer<typeof documentHubsFormSchema>;

export const documentTypesFormSchema = z.object({
    documentHubId: z.string().min(1),
    typeKey: z.string().min(1).optional(),
    typeName: z.string().min(1).optional(),
    typeCategory: z.string().min(1).optional(),
});

export type documentTypesFormValues = z.infer<typeof documentTypesFormSchema>;

export const documentCategoriesFormSchema = z.object({
    documentHubId: z.string().min(1),
    categoryKey: z.string().min(1).optional(),
    categoryName: z.string().min(1).optional(),
    categoryType: z.string().min(1).optional(),
});

export type documentCategoriesFormValues = z.infer<typeof documentCategoriesFormSchema>;

export const documentTemplatesFormSchema = z.object({
    documentHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateType: z.string().min(1).optional(),
});

export type documentTemplatesFormValues = z.infer<typeof documentTemplatesFormSchema>;

export const documentVersionsFormSchema = z.object({
    documentHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
    releaseChannel: z.string().min(1).optional(),
});

export type documentVersionsFormValues = z.infer<typeof documentVersionsFormSchema>;

export const templateHeadersFormSchema = z.object({
    documentHubId: z.string().min(1),
    headerKey: z.string().min(1).optional(),
    headerName: z.string().min(1).optional(),
    headerContent: z.string().min(1).optional(),
});

export type templateHeadersFormValues = z.infer<typeof templateHeadersFormSchema>;

export const templateFootersFormSchema = z.object({
    documentHubId: z.string().min(1),
    footerKey: z.string().min(1).optional(),
    footerName: z.string().min(1).optional(),
    footerContent: z.string().min(1).optional(),
});

export type templateFootersFormValues = z.infer<typeof templateFootersFormSchema>;

export const templateSectionsFormSchema = z.object({
    documentHubId: z.string().min(1),
    sectionKey: z.string().min(1).optional(),
    sectionName: z.string().min(1).optional(),
    sectionType: z.string().min(1).optional(),
});

export type templateSectionsFormValues = z.infer<typeof templateSectionsFormSchema>;

export const templateVariablesFormSchema = z.object({
    documentHubId: z.string().min(1),
    variableKey: z.string().min(1).optional(),
    variableName: z.string().min(1).optional(),
    variableType: z.string().min(1).optional(),
});

export type templateVariablesFormValues = z.infer<typeof templateVariablesFormSchema>;

export const pdfGenerationsFormSchema = z.object({
    documentHubId: z.string().min(1),
    generationKey: z.string().min(1).optional(),
    generationName: z.string().min(1).optional(),
    generationStatus: z.string().min(1).optional(),
});

export type pdfGenerationsFormValues = z.infer<typeof pdfGenerationsFormSchema>;

export const htmlGenerationsFormSchema = z.object({
    documentHubId: z.string().min(1),
    generationKey: z.string().min(1).optional(),
    generationName: z.string().min(1).optional(),
    generationStatus: z.string().min(1).optional(),
});

export type htmlGenerationsFormValues = z.infer<typeof htmlGenerationsFormSchema>;

export const exportJobsFormSchema = z.object({
    documentHubId: z.string().min(1),
    jobKey: z.string().min(1).optional(),
    jobName: z.string().min(1).optional(),
    jobStatus: z.string().min(1).optional(),
});

export type exportJobsFormValues = z.infer<typeof exportJobsFormSchema>;

export const batchGenerationsFormSchema = z.object({
    documentHubId: z.string().min(1),
    batchKey: z.string().min(1).optional(),
    batchName: z.string().min(1).optional(),
    batchStatus: z.string().min(1).optional(),
});

export type batchGenerationsFormValues = z.infer<typeof batchGenerationsFormSchema>;

export const electronicSignaturesFormSchema = z.object({
    documentHubId: z.string().min(1),
    signatureKey: z.string().min(1).optional(),
    signatureName: z.string().min(1).optional(),
    signatureStatus: z.string().min(1).optional(),
});

export type electronicSignaturesFormValues = z.infer<typeof electronicSignaturesFormSchema>;

export const approvalSignaturesFormSchema = z.object({
    documentHubId: z.string().min(1),
    signatureKey: z.string().min(1).optional(),
    signatureName: z.string().min(1).optional(),
    signatureStatus: z.string().min(1).optional(),
});

export type approvalSignaturesFormValues = z.infer<typeof approvalSignaturesFormSchema>;

export const signatureVerificationsFormSchema = z.object({
    documentHubId: z.string().min(1),
    verificationKey: z.string().min(1).optional(),
    verificationStatus: z.string().min(1).optional(),
    verificationResult: z.string().min(1).optional(),
});

export type signatureVerificationsFormValues = z.infer<typeof signatureVerificationsFormSchema>;

export const signatureAuditEntriesFormSchema = z.object({
    documentHubId: z.string().min(1),
    auditKey: z.string().min(1).optional(),
    auditAction: z.string().min(1).optional(),
    auditSummary: z.string().min(1).optional(),
});

export type signatureAuditEntriesFormValues = z.infer<typeof signatureAuditEntriesFormSchema>;

export const versionHistoriesFormSchema = z.object({
    documentHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyVersion: z.string().min(1).optional(),
    historySummary: z.string().min(1).optional(),
});

export type versionHistoriesFormValues = z.infer<typeof versionHistoriesFormSchema>;

export const retentionPoliciesFormSchema = z.object({
    documentHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    retentionDays: z.number().optional(),
});

export type retentionPoliciesFormValues = z.infer<typeof retentionPoliciesFormSchema>;

export const archiveRecordsFormSchema = z.object({
    documentHubId: z.string().min(1),
    archiveKey: z.string().min(1).optional(),
    archiveName: z.string().min(1).optional(),
    archiveStatus: z.string().min(1).optional(),
});

export type archiveRecordsFormValues = z.infer<typeof archiveRecordsFormSchema>;

export const sharingPoliciesFormSchema = z.object({
    documentHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    sharingScope: z.string().min(1).optional(),
});

export type sharingPoliciesFormValues = z.infer<typeof sharingPoliciesFormSchema>;

export const emailDeliveriesFormSchema = z.object({
    documentHubId: z.string().min(1),
    deliveryKey: z.string().min(1).optional(),
    deliveryName: z.string().min(1).optional(),
    deliveryStatus: z.string().min(1).optional(),
});

export type emailDeliveriesFormValues = z.infer<typeof emailDeliveriesFormSchema>;

export const downloadDeliveriesFormSchema = z.object({
    documentHubId: z.string().min(1),
    deliveryKey: z.string().min(1).optional(),
    deliveryName: z.string().min(1).optional(),
    deliveryStatus: z.string().min(1).optional(),
});

export type downloadDeliveriesFormValues = z.infer<typeof downloadDeliveriesFormSchema>;

export const webhookDeliveriesFormSchema = z.object({
    documentHubId: z.string().min(1),
    deliveryKey: z.string().min(1).optional(),
    deliveryName: z.string().min(1).optional(),
    deliveryStatus: z.string().min(1).optional(),
});

export type webhookDeliveriesFormValues = z.infer<typeof webhookDeliveriesFormSchema>;

export const generationAnalyticsFormSchema = z.object({
    documentHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type generationAnalyticsFormValues = z.infer<typeof generationAnalyticsFormSchema>;

export const deliveryAnalyticsFormSchema = z.object({
    documentHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type deliveryAnalyticsFormValues = z.infer<typeof deliveryAnalyticsFormSchema>;

export const storageAnalyticsFormSchema = z.object({
    documentHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type storageAnalyticsFormValues = z.infer<typeof storageAnalyticsFormSchema>;

export const documentMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    generatedCount: z.number().optional(),
    overallDocumentScore: z.number().optional(),
});

export type documentMetricsFormValues = z.infer<typeof documentMetricsFormSchema>;

export const documentHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type documentHealthFormValues = z.infer<typeof documentHealthFormSchema>;

export const pendingSignaturesFormSchema = z.object({
    documentHubId: z.string().min(1),
    signatureKey: z.string().min(1).optional(),
    signatureName: z.string().min(1).optional(),
    signatureStatus: z.string().min(1).optional(),
});

export type pendingSignaturesFormValues = z.infer<typeof pendingSignaturesFormSchema>;

export const documentFailuresFormSchema = z.object({
    documentHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type documentFailuresFormValues = z.infer<typeof documentFailuresFormSchema>;
