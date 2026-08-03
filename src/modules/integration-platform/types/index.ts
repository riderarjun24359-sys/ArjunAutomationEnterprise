export interface IntgDashboardStats {
    totalIntegrationHubs: number;
    activeIntegrationHubs: number;
    connectedServiceCount: number;
    activeConnectorCount: number;
    pendingRetryCount: number;
    failedTransactionCount: number;
    openFailureCount: number;
    avgHealthScore: number;
    auditCount: number;
}

export interface IntgPipelineInfo {
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

export interface IntegrationHubSummary {
    id: string;
    hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateIntegrationHubInput {
    hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface ConnectedServiceSummary {
    id: string;
    hubName: string;
    serviceKey: string;
    serviceName: string;
    providerType: string;
    connectorStatus: string;
    status: string;
}

export interface CreateConnectedServiceInput {
    integrationHubId: string;
    serviceKey?: string;
    serviceName?: string;
    providerType?: string;
    connectorStatus?: string;
}

export interface ConnectorConfigSummary {
    id: string;
    hubName: string;
    configKey: string;
    configName: string;
    providerType: string;
    apiVersion: string;
    status: string;
}

export interface CreateConnectorConfigInput {
    integrationHubId: string;
    connectedServiceId?: string;
    configKey?: string;
    configName?: string;
    providerType?: string;
    apiVersion?: string;
}

export interface ConnectorHealthSummary {
    id: string;
    hubName: string;
    healthKey: string;
    healthScore: number;
    status: string;
}

export interface CreateConnectorHealthInput {
    integrationHubId: string;
    connectedServiceId?: string;
    healthKey?: string;
    healthScore?: number;
}

export interface PaymentConnectorSummary {
    id: string;
    hubName: string;
    connectorKey: string;
    connectorName: string;
    providerType: string;
    connectorStatus: string;
    status: string;
}

export interface CreatePaymentConnectorInput {
    integrationHubId: string;
    connectorKey?: string;
    connectorName?: string;
    providerType?: string;
    connectorStatus?: string;
    apiVersion?: string;
}

export interface PaymentConnectorHealthSummary {
    id: string;
    hubName: string;
    healthKey: string;
    healthScore: number;
    status: string;
}

export interface CreatePaymentConnectorHealthInput {
    integrationHubId: string;
    connectorId?: string;
    healthKey?: string;
    healthScore?: number;
}

export interface PaymentRetryQueueSummary {
    id: string;
    hubName: string;
    queueKey: string;
    retryCount: number;
    status: string;
}

export interface CreatePaymentRetryQueueInput {
    integrationHubId: string;
    connectorId?: string;
    queueKey?: string;
    transactionRef?: string;
    maxRetries?: number;
}

export interface PaymentTransactionSummary {
    id: string;
    hubName: string;
    transactionKey: string;
    amount: number;
    transactionStatus: string;
    status: string;
}

export interface CreatePaymentTransactionInput {
    integrationHubId: string;
    connectorId?: string;
    transactionKey?: string;
    amount?: number;
    currency?: string;
    providerType?: string;
    transactionStatus?: string;
}

export interface AccountingConnectorSummary {
    id: string;
    hubName: string;
    connectorKey: string;
    connectorName: string;
    providerType: string;
    connectorStatus: string;
    status: string;
}

export interface CreateAccountingConnectorInput {
    integrationHubId: string;
    connectorKey?: string;
    connectorName?: string;
    providerType?: string;
    connectorStatus?: string;
    apiVersion?: string;
}

export interface AccountingSyncStatusSummary {
    id: string;
    hubName: string;
    syncKey: string;
    entityType: string;
    syncStatus: string;
    status: string;
}

export interface CreateAccountingSyncStatusInput {
    integrationHubId: string;
    connectorId?: string;
    syncKey?: string;
    entityType?: string;
    syncStatus?: string;
}

export interface ExportMappingSummary {
    id: string;
    hubName: string;
    mappingKey: string;
    mappingName: string;
    status: string;
}

export interface CreateExportMappingInput {
    integrationHubId: string;
    connectorId?: string;
    mappingKey?: string;
    mappingName?: string;
    sourceEntity?: string;
    targetEntity?: string;
}

export interface AccountingExportSummary {
    id: string;
    hubName: string;
    exportKey: string;
    exportType: string;
    exportStatus: string;
    status: string;
}

export interface CreateAccountingExportInput {
    integrationHubId: string;
    connectorId?: string;
    exportKey?: string;
    exportType?: string;
    exportStatus?: string;
}

export interface ApiKeySummary {
    id: string;
    hubName: string;
    keyName: string;
    apiVersion: string;
    status: string;
}

export interface CreateApiKeyInput {
    integrationHubId: string;
    keyName?: string;
    keyPrefix?: string;
    apiVersion?: string;
}

export interface ApiScopeSummary {
    id: string;
    hubName: string;
    scopeKey: string;
    scopeName: string;
    status: string;
}

export interface CreateApiScopeInput {
    integrationHubId: string;
    apiKeyId?: string;
    scopeKey?: string;
    scopeName?: string;
    permissions?: unknown[];
}

export interface RateLimitSummary {
    id: string;
    hubName: string;
    limitKey: string;
    limitName: string;
    rateLimitRpm: number;
    status: string;
}

export interface CreateRateLimitInput {
    integrationHubId: string;
    apiKeyId?: string;
    limitKey?: string;
    limitName?: string;
    rateLimitRpm?: number;
    burstLimit?: number;
}

export interface ApiUsageSummary {
    id: string;
    hubName: string;
    usageKey: string;
    requestCount: number;
    status: string;
}

export interface CreateApiUsageInput {
    integrationHubId: string;
    apiKeyId?: string;
    usageKey?: string;
    endpoint?: string;
    requestCount?: number;
}

export interface IncomingWebhookSummary {
    id: string;
    hubName: string;
    webhookKey: string;
    webhookName: string;
    providerType: string;
    status: string;
}

export interface CreateIncomingWebhookInput {
    integrationHubId: string;
    webhookKey?: string;
    webhookName?: string;
    endpointPath?: string;
    providerType?: string;
}

export interface OutgoingWebhookSummary {
    id: string;
    hubName: string;
    webhookKey: string;
    webhookName: string;
    status: string;
}

export interface CreateOutgoingWebhookInput {
    integrationHubId: string;
    webhookKey?: string;
    webhookName?: string;
    targetUrl?: string;
    eventTypes?: unknown[];
}

export interface WebhookDeadLetterSummary {
    id: string;
    hubName: string;
    deadLetterKey: string;
    deadLetterStatus: string;
    status: string;
}

export interface CreateWebhookDeadLetterInput {
    integrationHubId: string;
    outgoingWebhookId?: string;
    deadLetterKey?: string;
    eventType?: string;
    deadLetterStatus?: string;
}

export interface WebhookDeliveryLogSummary {
    id: string;
    hubName: string;
    deliveryKey: string;
    deliveryStatus: string;
    status: string;
}

export interface CreateWebhookDeliveryLogInput {
    integrationHubId: string;
    outgoingWebhookId?: string;
    deliveryKey?: string;
    eventType?: string;
    deliveryStatus?: string;
    httpStatus?: number;
}

export interface MarketplaceConnectorSummary {
    id: string;
    hubName: string;
    connectorSlug: string;
    connectorName: string;
    providerType: string;
    status: string;
}

export interface CreateMarketplaceConnectorInput {
    integrationHubId: string;
    connectorSlug?: string;
    connectorName?: string;
    providerType?: string;
    category?: string;
}

export interface MarketplaceInstallationSummary {
    id: string;
    hubName: string;
    installationKey: string;
    connectorStatus: string;
    status: string;
}

export interface CreateMarketplaceInstallationInput {
    integrationHubId: string;
    marketplaceConnectorId?: string;
    installationKey?: string;
    connectorStatus?: string;
}

export interface MarketplaceCompatibilitySummary {
    id: string;
    hubName: string;
    compatibilityKey: string;
    minApiVersion: string;
    status: string;
}

export interface CreateMarketplaceCompatibilityInput {
    integrationHubId: string;
    marketplaceConnectorId?: string;
    compatibilityKey?: string;
    minApiVersion?: string;
    maxApiVersion?: string;
}

export interface MarketplaceVersionSummary {
    id: string;
    hubName: string;
    versionKey: string;
    versionNumber: string;
    status: string;
}

export interface CreateMarketplaceVersionInput {
    integrationHubId: string;
    marketplaceConnectorId?: string;
    versionKey?: string;
    versionNumber?: string;
    apiVersion?: string;
}

export interface ApiAnalyticsSummary {
    id: string;
    hubName: string;
    analyticsKey: string;
    errorRate: number;
    status: string;
}

export interface CreateApiAnalyticsInput {
    integrationHubId: string;
    analyticsKey?: string;
    totalRequests?: number;
    totalErrors?: number;
    errorRate?: number;
}

export interface LatencyMetricSummary {
    id: string;
    hubName: string;
    metricsKey: string;
    p95Ms: number;
    status: string;
}

export interface CreateLatencyMetricInput {
    integrationHubId: string;
    metricsKey?: string;
    endpoint?: string;
    p50Ms?: number;
    p95Ms?: number;
    p99Ms?: number;
}

export interface WebhookAnalyticsSummary {
    id: string;
    hubName: string;
    analyticsKey: string;
    successRate: number;
    status: string;
}

export interface CreateWebhookAnalyticsInput {
    integrationHubId: string;
    analyticsKey?: string;
    totalDeliveries?: number;
    successfulDeliveries?: number;
    failedDeliveries?: number;
    successRate?: number;
}

export interface UsageTrendSummary {
    id: string;
    hubName: string;
    trendKey: string;
    trendDirection: string;
    status: string;
}

export interface CreateUsageTrendInput {
    integrationHubId: string;
    trendKey?: string;
    trendDirection?: string;
    usageDelta?: number;
    baselineValue?: number;
    currentValue?: number;
}

export interface IntegrationMetricSummary {
    id: string;
    metricsKey: string;
    overallSuccessRate: number;
    status: string;
}

export interface CreateIntegrationMetricInput {
    metricsKey?: string;
    activeConnectors?: number;
    totalApiCalls?: number;
    totalWebhookDeliveries?: number;
    overallSuccessRate?: number;
}

export interface IntegrationHealthSummary {
    id: string;
    healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateIntegrationHealthInput {
    healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
    summary?: string;
}

export interface IntegrationFailureSummary {
    id: string;
    hubName: string;
    failureKey: string;
    providerType: string;
    status: string;
}

export interface CreateIntegrationFailureInput {
    integrationHubId: string;
    failureKey?: string;
    providerType?: string;
    errorCode?: string;
    errorMessage?: string;
}

export interface IntgSdkConnectServiceInput { integrationHubId: string; serviceKey: string; serviceName: string; providerType?: string; }
export interface IntgSdkConnectServiceResult { serviceId: string; serviceKey: string; connectorStatus: string; }
export interface IntgSdkIssueApiKeyInput { integrationHubId: string; keyName: string; apiVersion?: string; }
export interface IntgSdkIssueApiKeyResult { apiKeyId: string; keyName: string; status: string; }
export interface IntgSdkRegisterWebhookInput { integrationHubId: string; webhookKey: string; webhookName: string; targetUrl?: string; }
export interface IntgSdkRegisterWebhookResult { webhookId: string; webhookKey: string; status: string; }
