import { z } from "zod";

export const integrationHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type integrationHubsFormValues = z.infer<typeof integrationHubsFormSchema>;

export const connectedServicesFormSchema = z.object({
    integrationHubId: z.string().min(1),
    serviceKey: z.string().min(1).optional(),
    serviceName: z.string().min(1).optional(),
    providerType: z.string().min(1).optional(),
    connectorStatus: z.string().min(1).optional(),
});

export type connectedServicesFormValues = z.infer<typeof connectedServicesFormSchema>;

export const connectorConfigsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configName: z.string().min(1).optional(),
    providerType: z.string().min(1).optional(),
    apiVersion: z.string().min(1).optional(),
});

export type connectorConfigsFormValues = z.infer<typeof connectorConfigsFormSchema>;

export const connectorHealthFormSchema = z.object({
    integrationHubId: z.string().min(1),
    healthKey: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type connectorHealthFormValues = z.infer<typeof connectorHealthFormSchema>;

export const paymentConnectorsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    connectorKey: z.string().min(1).optional(),
    connectorName: z.string().min(1).optional(),
    providerType: z.string().min(1).optional(),
    connectorStatus: z.string().min(1).optional(),
});

export type paymentConnectorsFormValues = z.infer<typeof paymentConnectorsFormSchema>;

export const paymentConnectorHealthFormSchema = z.object({
    integrationHubId: z.string().min(1),
    healthKey: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type paymentConnectorHealthFormValues = z.infer<typeof paymentConnectorHealthFormSchema>;

export const paymentRetryQueueFormSchema = z.object({
    integrationHubId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    transactionRef: z.string().min(1).optional(),
});

export type paymentRetryQueueFormValues = z.infer<typeof paymentRetryQueueFormSchema>;

export const paymentTransactionsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    transactionKey: z.string().min(1).optional(),
    amount: z.number().optional(),
    transactionStatus: z.string().min(1).optional(),
});

export type paymentTransactionsFormValues = z.infer<typeof paymentTransactionsFormSchema>;

export const accountingConnectorsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    connectorKey: z.string().min(1).optional(),
    connectorName: z.string().min(1).optional(),
    providerType: z.string().min(1).optional(),
});

export type accountingConnectorsFormValues = z.infer<typeof accountingConnectorsFormSchema>;

export const accountingSyncStatusFormSchema = z.object({
    integrationHubId: z.string().min(1),
    syncKey: z.string().min(1).optional(),
    entityType: z.string().min(1).optional(),
    syncStatus: z.string().min(1).optional(),
});

export type accountingSyncStatusFormValues = z.infer<typeof accountingSyncStatusFormSchema>;

export const exportMappingsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    mappingKey: z.string().min(1).optional(),
    mappingName: z.string().min(1).optional(),
});

export type exportMappingsFormValues = z.infer<typeof exportMappingsFormSchema>;

export const accountingExportsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    exportKey: z.string().min(1).optional(),
    exportType: z.string().min(1).optional(),
    exportStatus: z.string().min(1).optional(),
});

export type accountingExportsFormValues = z.infer<typeof accountingExportsFormSchema>;

export const apiKeysFormSchema = z.object({
    integrationHubId: z.string().uuid(),
    keyName: z.string().trim().min(1).max(80),
    apiVersion: z.enum(["v1", "v2", "v3"]),
});

export type apiKeysFormValues = z.infer<typeof apiKeysFormSchema>;

export const apiScopesFormSchema = z.object({
    integrationHubId: z.string().min(1),
    apiKeyId: z.string().uuid(),
    scopeKey: z.string().min(1).optional(),
    scopeName: z.string().min(1).optional(),
});

export type apiScopesFormValues = z.infer<typeof apiScopesFormSchema>;

export const rateLimitsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    limitKey: z.string().min(1).optional(),
    limitName: z.string().min(1).optional(),
    rateLimitRpm: z.number().optional(),
});

export type rateLimitsFormValues = z.infer<typeof rateLimitsFormSchema>;

export const apiUsageFormSchema = z.object({
    integrationHubId: z.string().min(1),
    usageKey: z.string().min(1).optional(),
    endpoint: z.string().min(1).optional(),
    requestCount: z.number().optional(),
});

export type apiUsageFormValues = z.infer<typeof apiUsageFormSchema>;

export const incomingWebhooksFormSchema = z.object({
    integrationHubId: z.string().min(1),
    webhookKey: z.string().min(1).optional(),
    webhookName: z.string().min(1).optional(),
    providerType: z.string().min(1).optional(),
});

export type incomingWebhooksFormValues = z.infer<typeof incomingWebhooksFormSchema>;

export const outgoingWebhooksFormSchema = z.object({
    integrationHubId: z.string().min(1),
    webhookKey: z.string().min(1).optional(),
    webhookName: z.string().min(1).optional(),
    targetUrl: z.string().min(1).optional(),
});

export type outgoingWebhooksFormValues = z.infer<typeof outgoingWebhooksFormSchema>;

export const webhookDeadLetterFormSchema = z.object({
    integrationHubId: z.string().min(1),
    deadLetterKey: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
    deadLetterStatus: z.string().min(1).optional(),
});

export type webhookDeadLetterFormValues = z.infer<typeof webhookDeadLetterFormSchema>;

export const webhookDeliveryLogsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    deliveryKey: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
    deliveryStatus: z.string().min(1).optional(),
});

export type webhookDeliveryLogsFormValues = z.infer<typeof webhookDeliveryLogsFormSchema>;

export const marketplaceConnectorsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    connectorSlug: z.string().min(1).optional(),
    connectorName: z.string().min(1).optional(),
    providerType: z.string().min(1).optional(),
});

export type marketplaceConnectorsFormValues = z.infer<typeof marketplaceConnectorsFormSchema>;

export const marketplaceInstallationsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    installationKey: z.string().min(1).optional(),
    connectorStatus: z.string().min(1).optional(),
});

export type marketplaceInstallationsFormValues = z.infer<typeof marketplaceInstallationsFormSchema>;

export const marketplaceCompatibilityFormSchema = z.object({
    integrationHubId: z.string().min(1),
    compatibilityKey: z.string().min(1).optional(),
    minApiVersion: z.string().min(1).optional(),
});

export type marketplaceCompatibilityFormValues = z.infer<typeof marketplaceCompatibilityFormSchema>;

export const marketplaceVersionsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
});

export type marketplaceVersionsFormValues = z.infer<typeof marketplaceVersionsFormSchema>;

export const apiAnalyticsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    errorRate: z.number().optional(),
});

export type apiAnalyticsFormValues = z.infer<typeof apiAnalyticsFormSchema>;

export const latencyMetricsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    metricsKey: z.string().min(1).optional(),
    p95Ms: z.number().optional(),
});

export type latencyMetricsFormValues = z.infer<typeof latencyMetricsFormSchema>;

export const webhookAnalyticsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    successRate: z.number().optional(),
});

export type webhookAnalyticsFormValues = z.infer<typeof webhookAnalyticsFormSchema>;

export const usageTrendsFormSchema = z.object({
    integrationHubId: z.string().min(1),
    trendKey: z.string().min(1).optional(),
    trendDirection: z.string().min(1).optional(),
});

export type usageTrendsFormValues = z.infer<typeof usageTrendsFormSchema>;

export const integrationMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    overallSuccessRate: z.number().optional(),
});

export type integrationMetricsFormValues = z.infer<typeof integrationMetricsFormSchema>;

export const integrationHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type integrationHealthFormValues = z.infer<typeof integrationHealthFormSchema>;

export const integrationFailuresFormSchema = z.object({
    integrationHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    providerType: z.string().min(1).optional(),
});

export type integrationFailuresFormValues = z.infer<typeof integrationFailuresFormSchema>;
