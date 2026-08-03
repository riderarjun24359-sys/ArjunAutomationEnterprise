import type {
    DbIntgIntegrationHub,
    DbIntgConnectedService,
    DbIntgConnectorConfig,
    DbIntgConnectorHealth,
    DbIntgPaymentConnector,
    DbIntgPaymentConnectorHealth,
    DbIntgPaymentRetryQueue,
    DbIntgPaymentTransaction,
    DbIntgAccountingConnector,
    DbIntgAccountingSyncStatus,
    DbIntgExportMapping,
    DbIntgAccountingExport,
    DbIntgApiKey,
    DbIntgApiScope,
    DbIntgRateLimit,
    DbIntgApiUsage,
    DbIntgIncomingWebhook,
    DbIntgOutgoingWebhook,
    DbIntgWebhookDeadLetter,
    DbIntgWebhookDeliveryLog,
    DbIntgMarketplaceConnector,
    DbIntgMarketplaceInstallation,
    DbIntgMarketplaceCompatibility,
    DbIntgMarketplaceVersion,
    DbIntgApiAnalytics,
    DbIntgLatencyMetric,
    DbIntgWebhookAnalytics,
    DbIntgUsageTrend,
    DbIntgIntegrationMetric,
    DbIntgIntegrationHealth,
    DbIntgIntegrationFailure,
    DbIntgAuditLog,
} from "@/src/modules/database/types/platform";
import type {
    CreateIntegrationHubInput,
    IntegrationHubSummary,
    CreateConnectedServiceInput,
    ConnectedServiceSummary,
    CreateConnectorConfigInput,
    ConnectorConfigSummary,
    CreateConnectorHealthInput,
    ConnectorHealthSummary,
    CreatePaymentConnectorInput,
    PaymentConnectorSummary,
    CreatePaymentConnectorHealthInput,
    PaymentConnectorHealthSummary,
    CreatePaymentRetryQueueInput,
    PaymentRetryQueueSummary,
    CreatePaymentTransactionInput,
    PaymentTransactionSummary,
    CreateAccountingConnectorInput,
    AccountingConnectorSummary,
    CreateAccountingSyncStatusInput,
    AccountingSyncStatusSummary,
    CreateExportMappingInput,
    ExportMappingSummary,
    CreateAccountingExportInput,
    AccountingExportSummary,
    CreateApiKeyInput,
    ApiKeySummary,
    CreateApiScopeInput,
    ApiScopeSummary,
    CreateRateLimitInput,
    RateLimitSummary,
    CreateApiUsageInput,
    ApiUsageSummary,
    CreateIncomingWebhookInput,
    IncomingWebhookSummary,
    CreateOutgoingWebhookInput,
    OutgoingWebhookSummary,
    CreateWebhookDeadLetterInput,
    WebhookDeadLetterSummary,
    CreateWebhookDeliveryLogInput,
    WebhookDeliveryLogSummary,
    CreateMarketplaceConnectorInput,
    MarketplaceConnectorSummary,
    CreateMarketplaceInstallationInput,
    MarketplaceInstallationSummary,
    CreateMarketplaceCompatibilityInput,
    MarketplaceCompatibilitySummary,
    CreateMarketplaceVersionInput,
    MarketplaceVersionSummary,
    CreateApiAnalyticsInput,
    ApiAnalyticsSummary,
    CreateLatencyMetricInput,
    LatencyMetricSummary,
    CreateWebhookAnalyticsInput,
    WebhookAnalyticsSummary,
    CreateUsageTrendInput,
    UsageTrendSummary,
    CreateIntegrationMetricInput,
    IntegrationMetricSummary,
    CreateIntegrationHealthInput,
    IntegrationHealthSummary,
    CreateIntegrationFailureInput,
    IntegrationFailureSummary,
    IntgDashboardStats,
    IntgPipelineInfo,
    AuditEntry,
} from "@/src/modules/integration-platform/types";

type LookupMaps = { integrationHubs: Map<string, DbIntgIntegrationHub> };

export const buildIntegrationHubLookupMaps = (integrationHubs: DbIntgIntegrationHub[]): LookupMaps => ({
    integrationHubs: new Map(integrationHubs.map((item) => [item.id, item])),
});

const hubName = (maps: LookupMaps, id?: string | null) => (id ? maps.integrationHubs.get(id)?.hub_name ?? null : null);

export const mapAuditEntry = (record: DbIntgAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    securityLevel: record.security_level,
    createdAt: record.created_at,
});

export const buildIntgAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string, securityLevel = "standard") => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    security_level: securityLevel,
});

export const buildIntgDashboardStats = (input: {
    integrationHubs: IntegrationHubSummary[];
    connectedServices: Array<{ connectorStatus: string; status?: string }>;
    paymentConnectors?: Array<{ connectorStatus: string; status?: string }>;
    accountingConnectors?: Array<{ connectorStatus: string; status?: string }>;
    paymentRetryQueue: Array<{ status: string }>;
    paymentTransactions: Array<{ transactionStatus: string; status?: string }>;
    connectorHealth?: Array<{ healthScore?: number }>;
    integrationHealth?: Array<{ overallScore?: number }>;
    integrationFailures: Array<{ status: string }>;
    auditLogs: unknown[];
}): IntgDashboardStats => {
    const healthScores = input.connectorHealth?.length
        ? input.connectorHealth.map((h) => h.healthScore ?? 0)
        : input.integrationHealth?.map((h) => h.overallScore ?? 0) ?? [];
    const activeConnectors = [
        ...(input.paymentConnectors ?? []),
        ...(input.accountingConnectors ?? []),
    ].filter((c) => c.connectorStatus === "connected" || c.status === "active").length;
    return {
        totalIntegrationHubs: input.integrationHubs.length,
        activeIntegrationHubs: input.integrationHubs.filter((h) => h.status === "active").length,
        connectedServiceCount: input.connectedServices.filter((s) => s.connectorStatus === "connected" || s.status === "active").length,
        activeConnectorCount: activeConnectors,
        pendingRetryCount: input.paymentRetryQueue.filter((r) => r.status === "pending").length,
        failedTransactionCount: input.paymentTransactions.filter((t) => t.transactionStatus === "failed" || t.status === "failed").length,
        openFailureCount: input.integrationFailures.filter((f) => f.status === "open").length,
        avgHealthScore: healthScores.length ? healthScores.reduce((s, r) => s + r, 0) / healthScores.length : 0,
        auditCount: input.auditLogs.length,
    };
};

export const buildIntgPipelineInfo = (): IntgPipelineInfo => ({
    stages: [
        { key: "configured", label: "Configured" },
        { key: "connected", label: "Connected" },
        { key: "syncing", label: "Syncing" },
        { key: "active", label: "Active" },
        { key: "degraded", label: "Degraded" },
        { key: "failed", label: "Failed" },
    ],
    currentStage: "active",
    nextStage: "degraded",
    previousStage: "syncing",
});

export const mapIntegrationHubSummary = (record: DbIntgIntegrationHub): IntegrationHubSummary => ({
    id: record.id,
    hubKey: record.hub_key,
    hubName: record.hub_name,
    environment: record.environment,
    status: record.status,
});

export const mapConnectedServiceSummary = (record: DbIntgConnectedService, maps: LookupMaps): ConnectedServiceSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    serviceKey: record.service_key,
    serviceName: record.service_name,
    providerType: record.provider_type,
    connectorStatus: record.connector_status,
    status: record.status,
});

export const mapConnectorConfigSummary = (record: DbIntgConnectorConfig, maps: LookupMaps): ConnectorConfigSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    configKey: record.config_key,
    configName: record.config_name,
    providerType: record.provider_type,
    apiVersion: record.api_version,
    status: record.status,
});

export const mapConnectorHealthSummary = (record: DbIntgConnectorHealth, maps: LookupMaps): ConnectorHealthSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    healthKey: record.health_key,
    healthScore: record.health_score,
    status: record.status,
});

export const mapPaymentConnectorSummary = (record: DbIntgPaymentConnector, maps: LookupMaps): PaymentConnectorSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    connectorKey: record.connector_key,
    connectorName: record.connector_name,
    providerType: record.provider_type,
    connectorStatus: record.connector_status,
    status: record.status,
});

export const mapPaymentConnectorHealthSummary = (record: DbIntgPaymentConnectorHealth, maps: LookupMaps): PaymentConnectorHealthSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    healthKey: record.health_key,
    healthScore: record.health_score,
    status: record.status,
});

export const mapPaymentRetryQueueSummary = (record: DbIntgPaymentRetryQueue, maps: LookupMaps): PaymentRetryQueueSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    queueKey: record.queue_key,
    retryCount: record.retry_count,
    status: record.status,
});

export const mapPaymentTransactionSummary = (record: DbIntgPaymentTransaction, maps: LookupMaps): PaymentTransactionSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    transactionKey: record.transaction_key,
    amount: record.amount,
    transactionStatus: record.transaction_status,
    status: record.status,
});

export const mapAccountingConnectorSummary = (record: DbIntgAccountingConnector, maps: LookupMaps): AccountingConnectorSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    connectorKey: record.connector_key,
    connectorName: record.connector_name,
    providerType: record.provider_type,
    connectorStatus: record.connector_status,
    status: record.status,
});

export const mapAccountingSyncStatusSummary = (record: DbIntgAccountingSyncStatus, maps: LookupMaps): AccountingSyncStatusSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    syncKey: record.sync_key,
    entityType: record.entity_type,
    syncStatus: record.sync_status,
    status: record.status,
});

export const mapExportMappingSummary = (record: DbIntgExportMapping, maps: LookupMaps): ExportMappingSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    mappingKey: record.mapping_key,
    mappingName: record.mapping_name,
    status: record.status,
});

export const mapAccountingExportSummary = (record: DbIntgAccountingExport, maps: LookupMaps): AccountingExportSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    exportKey: record.export_key,
    exportType: record.export_type,
    exportStatus: record.export_status,
    status: record.status,
});

export const mapApiKeySummary = (record: DbIntgApiKey, maps: LookupMaps): ApiKeySummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    keyName: record.key_name,
    apiVersion: record.api_version,
    status: record.status,
});

export const mapApiScopeSummary = (record: DbIntgApiScope, maps: LookupMaps): ApiScopeSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    scopeKey: record.scope_key,
    scopeName: record.scope_name,
    status: record.status,
});

export const mapRateLimitSummary = (record: DbIntgRateLimit, maps: LookupMaps): RateLimitSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    limitKey: record.limit_key,
    limitName: record.limit_name,
    rateLimitRpm: record.rate_limit_rpm,
    status: record.status,
});

export const mapApiUsageSummary = (record: DbIntgApiUsage, maps: LookupMaps): ApiUsageSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    usageKey: record.usage_key,
    requestCount: record.request_count,
    status: record.status,
});

export const mapIncomingWebhookSummary = (record: DbIntgIncomingWebhook, maps: LookupMaps): IncomingWebhookSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    webhookKey: record.webhook_key,
    webhookName: record.webhook_name,
    providerType: record.provider_type,
    status: record.status,
});

export const mapOutgoingWebhookSummary = (record: DbIntgOutgoingWebhook, maps: LookupMaps): OutgoingWebhookSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    webhookKey: record.webhook_key,
    webhookName: record.webhook_name,
    status: record.status,
});

export const mapWebhookDeadLetterSummary = (record: DbIntgWebhookDeadLetter, maps: LookupMaps): WebhookDeadLetterSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    deadLetterKey: record.dead_letter_key,
    deadLetterStatus: record.dead_letter_status,
    status: record.status,
});

export const mapWebhookDeliveryLogSummary = (record: DbIntgWebhookDeliveryLog, maps: LookupMaps): WebhookDeliveryLogSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    deliveryKey: record.delivery_key,
    deliveryStatus: record.delivery_status,
    status: record.status,
});

export const mapMarketplaceConnectorSummary = (record: DbIntgMarketplaceConnector, maps: LookupMaps): MarketplaceConnectorSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    connectorSlug: record.connector_slug,
    connectorName: record.connector_name,
    providerType: record.provider_type,
    status: record.status,
});

export const mapMarketplaceInstallationSummary = (record: DbIntgMarketplaceInstallation, maps: LookupMaps): MarketplaceInstallationSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    installationKey: record.installation_key,
    connectorStatus: record.connector_status,
    status: record.status,
});

export const mapMarketplaceCompatibilitySummary = (record: DbIntgMarketplaceCompatibility, maps: LookupMaps): MarketplaceCompatibilitySummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    compatibilityKey: record.compatibility_key,
    minApiVersion: record.min_api_version,
    status: record.status,
});

export const mapMarketplaceVersionSummary = (record: DbIntgMarketplaceVersion, maps: LookupMaps): MarketplaceVersionSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    versionKey: record.version_key,
    versionNumber: record.version_number,
    status: record.status,
});

export const mapApiAnalyticsSummary = (record: DbIntgApiAnalytics, maps: LookupMaps): ApiAnalyticsSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    analyticsKey: record.analytics_key,
    errorRate: record.error_rate,
    status: record.status,
});

export const mapLatencyMetricSummary = (record: DbIntgLatencyMetric, maps: LookupMaps): LatencyMetricSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    metricsKey: record.metrics_key,
    p95Ms: record.p95_ms,
    status: record.status,
});

export const mapWebhookAnalyticsSummary = (record: DbIntgWebhookAnalytics, maps: LookupMaps): WebhookAnalyticsSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    analyticsKey: record.analytics_key,
    successRate: record.success_rate,
    status: record.status,
});

export const mapUsageTrendSummary = (record: DbIntgUsageTrend, maps: LookupMaps): UsageTrendSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    trendKey: record.trend_key,
    trendDirection: record.trend_direction,
    status: record.status,
});

export const mapIntegrationMetricSummary = (record: DbIntgIntegrationMetric): IntegrationMetricSummary => ({
    id: record.id,
    metricsKey: record.metrics_key,
    overallSuccessRate: record.overall_success_rate,
    status: record.status,
});

export const mapIntegrationHealthSummary = (record: DbIntgIntegrationHealth): IntegrationHealthSummary => ({
    id: record.id,
    healthKey: record.health_key,
    overallScore: record.overall_score,
    disasterRecoveryMode: record.disaster_recovery_mode,
    status: record.status,
});

export const mapIntegrationFailureSummary = (record: DbIntgIntegrationFailure, maps: LookupMaps): IntegrationFailureSummary => ({
    id: record.id,
    hubName: hubName(maps, record.hub_id) ?? "",
    failureKey: record.failure_key,
    providerType: record.provider_type,
    status: record.status,
});

export const buildIntegrationHubPayload = (organizationId: string, input: CreateIntegrationHubInput) => ({
    organization_id: organizationId,
    hub_key: input.hubKey ?? "",
    hub_name: input.hubName ?? "",
    environment: input.environment ?? "production",
});

export const buildConnectedServicePayload = (organizationId: string, input: CreateConnectedServiceInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    service_key: input.serviceKey ?? "",
    service_name: input.serviceName ?? "",
    provider_type: input.providerType ?? "google_workspace",
    connector_status: input.connectorStatus ?? "connected",
});

export const buildConnectorConfigPayload = (organizationId: string, input: CreateConnectorConfigInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connected_service_id: input.connectedServiceId,
    config_key: input.configKey ?? "",
    config_name: input.configName ?? "",
    provider_type: input.providerType ?? "google_workspace",
    api_version: input.apiVersion ?? "v1",
});

export const buildConnectorHealthPayload = (organizationId: string, input: CreateConnectorHealthInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connected_service_id: input.connectedServiceId,
    health_key: input.healthKey ?? "",
    health_score: input.healthScore ?? 100,
});

export const buildPaymentConnectorPayload = (organizationId: string, input: CreatePaymentConnectorInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_key: input.connectorKey ?? "",
    connector_name: input.connectorName ?? "",
    provider_type: input.providerType ?? "stripe",
    connector_status: input.connectorStatus ?? "connected",
    api_version: input.apiVersion ?? "2024-06-20",
});

export const buildPaymentConnectorHealthPayload = (organizationId: string, input: CreatePaymentConnectorHealthInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_id: input.connectorId,
    health_key: input.healthKey ?? "",
    health_score: input.healthScore ?? 100,
});

export const buildPaymentRetryQueuePayload = (organizationId: string, input: CreatePaymentRetryQueueInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_id: input.connectorId,
    queue_key: input.queueKey ?? "",
    transaction_ref: input.transactionRef ?? "",
    max_retries: input.maxRetries ?? 3,
});

export const buildPaymentTransactionPayload = (organizationId: string, input: CreatePaymentTransactionInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_id: input.connectorId,
    transaction_key: input.transactionKey ?? "",
    amount: input.amount ?? 0,
    currency: input.currency ?? "USD",
    provider_type: input.providerType ?? "stripe",
    transaction_status: input.transactionStatus ?? "pending",
});

export const buildAccountingConnectorPayload = (organizationId: string, input: CreateAccountingConnectorInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_key: input.connectorKey ?? "",
    connector_name: input.connectorName ?? "",
    provider_type: input.providerType ?? "quickbooks",
    connector_status: input.connectorStatus ?? "connected",
    api_version: input.apiVersion ?? "v3",
});

export const buildAccountingSyncStatusPayload = (organizationId: string, input: CreateAccountingSyncStatusInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_id: input.connectorId,
    sync_key: input.syncKey ?? "",
    entity_type: input.entityType ?? "invoice",
    sync_status: input.syncStatus ?? "idle",
});

export const buildExportMappingPayload = (organizationId: string, input: CreateExportMappingInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_id: input.connectorId,
    mapping_key: input.mappingKey ?? "",
    mapping_name: input.mappingName ?? "",
    source_entity: input.sourceEntity ?? "order",
    target_entity: input.targetEntity ?? "invoice",
});

export const buildAccountingExportPayload = (organizationId: string, input: CreateAccountingExportInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_id: input.connectorId,
    export_key: input.exportKey ?? "",
    export_type: input.exportType ?? "invoice",
    export_status: input.exportStatus ?? "pending",
});

export const buildApiKeyPayload = (organizationId: string, input: CreateApiKeyInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    key_name: input.keyName ?? "",
    key_prefix: input.keyPrefix ?? "",
    api_version: input.apiVersion ?? "v1",
});

export const buildApiScopePayload = (organizationId: string, input: CreateApiScopeInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    api_key_id: input.apiKeyId,
    scope_key: input.scopeKey ?? "",
    scope_name: input.scopeName ?? "",
    permissions: input.permissions ?? [],
});

export const buildRateLimitPayload = (organizationId: string, input: CreateRateLimitInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    api_key_id: input.apiKeyId ?? null,
    limit_key: input.limitKey ?? "",
    limit_name: input.limitName ?? "",
    rate_limit_rpm: input.rateLimitRpm ?? 60,
    burst_limit: input.burstLimit ?? 10,
});

export const buildApiUsagePayload = (organizationId: string, input: CreateApiUsageInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    api_key_id: input.apiKeyId ?? null,
    usage_key: input.usageKey ?? "",
    endpoint: input.endpoint ?? "",
    request_count: input.requestCount ?? 0,
});

export const buildIncomingWebhookPayload = (organizationId: string, input: CreateIncomingWebhookInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    webhook_key: input.webhookKey ?? "",
    webhook_name: input.webhookName ?? "",
    endpoint_path: input.endpointPath ?? "",
    provider_type: input.providerType ?? "stripe",
});

export const buildOutgoingWebhookPayload = (organizationId: string, input: CreateOutgoingWebhookInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    webhook_key: input.webhookKey ?? "",
    webhook_name: input.webhookName ?? "",
    target_url: input.targetUrl ?? "",
    event_types: input.eventTypes ?? [],
});

export const buildWebhookDeadLetterPayload = (organizationId: string, input: CreateWebhookDeadLetterInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    outgoing_webhook_id: input.outgoingWebhookId ?? null,
    dead_letter_key: input.deadLetterKey ?? "",
    event_type: input.eventType ?? "",
    dead_letter_status: input.deadLetterStatus ?? "pending",
});

export const buildWebhookDeliveryLogPayload = (organizationId: string, input: CreateWebhookDeliveryLogInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    outgoing_webhook_id: input.outgoingWebhookId,
    delivery_key: input.deliveryKey ?? "",
    event_type: input.eventType ?? "",
    delivery_status: input.deliveryStatus ?? "pending",
    http_status: input.httpStatus ?? 0,
});

export const buildMarketplaceConnectorPayload = (organizationId: string, input: CreateMarketplaceConnectorInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    connector_slug: input.connectorSlug ?? "",
    connector_name: input.connectorName ?? "",
    provider_type: input.providerType ?? "google_workspace",
    category: input.category ?? "productivity",
});

export const buildMarketplaceInstallationPayload = (organizationId: string, input: CreateMarketplaceInstallationInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    marketplace_connector_id: input.marketplaceConnectorId,
    installation_key: input.installationKey ?? "",
    connector_status: input.connectorStatus ?? "installed",
});

export const buildMarketplaceCompatibilityPayload = (organizationId: string, input: CreateMarketplaceCompatibilityInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    marketplace_connector_id: input.marketplaceConnectorId,
    compatibility_key: input.compatibilityKey ?? "",
    min_api_version: input.minApiVersion ?? "v1",
    max_api_version: input.maxApiVersion ?? "v2",
});

export const buildMarketplaceVersionPayload = (organizationId: string, input: CreateMarketplaceVersionInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    marketplace_connector_id: input.marketplaceConnectorId,
    version_key: input.versionKey ?? "",
    version_number: input.versionNumber ?? "1.0.0",
    api_version: input.apiVersion ?? "v1",
});

export const buildApiAnalyticsPayload = (organizationId: string, input: CreateApiAnalyticsInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    analytics_key: input.analyticsKey ?? "",
    total_requests: input.totalRequests ?? 0,
    total_errors: input.totalErrors ?? 0,
    error_rate: input.errorRate ?? 0,
});

export const buildLatencyMetricPayload = (organizationId: string, input: CreateLatencyMetricInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    metrics_key: input.metricsKey ?? "",
    endpoint: input.endpoint ?? "",
    p50_ms: input.p50Ms ?? 0,
    p95_ms: input.p95Ms ?? 0,
    p99_ms: input.p99Ms ?? 0,
});

export const buildWebhookAnalyticsPayload = (organizationId: string, input: CreateWebhookAnalyticsInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    analytics_key: input.analyticsKey ?? "",
    total_deliveries: input.totalDeliveries ?? 0,
    successful_deliveries: input.successfulDeliveries ?? 0,
    failed_deliveries: input.failedDeliveries ?? 0,
    success_rate: input.successRate ?? 0,
});

export const buildUsageTrendPayload = (organizationId: string, input: CreateUsageTrendInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    trend_key: input.trendKey ?? "",
    trend_direction: input.trendDirection ?? "stable",
    usage_delta: input.usageDelta ?? 0,
    baseline_value: input.baselineValue ?? 0,
    current_value: input.currentValue ?? 0,
});

export const buildIntegrationMetricPayload = (organizationId: string, input: CreateIntegrationMetricInput) => ({
    organization_id: organizationId,
    metrics_key: input.metricsKey ?? "",
    active_connectors: input.activeConnectors ?? 0,
    total_api_calls: input.totalApiCalls ?? 0,
    total_webhook_deliveries: input.totalWebhookDeliveries ?? 0,
    overall_success_rate: input.overallSuccessRate ?? 0,
});

export const buildIntegrationHealthPayload = (organizationId: string, input: CreateIntegrationHealthInput) => ({
    organization_id: organizationId,
    health_key: input.healthKey ?? "",
    overall_score: input.overallScore ?? 0,
    disaster_recovery_mode: input.disasterRecoveryMode ?? false,
    summary: input.summary ?? "",
});

export const buildIntegrationFailurePayload = (organizationId: string, input: CreateIntegrationFailureInput) => ({
    organization_id: organizationId,
    hub_id: input.integrationHubId,
    failure_key: input.failureKey ?? "",
    provider_type: input.providerType ?? "stripe",
    error_code: input.errorCode ?? "",
    error_message: input.errorMessage ?? "",
});

export const mapConnectedServiceForStats = (record: DbIntgConnectedService) => ({
    connectorStatus: record.connector_status,
    status: record.status,
});

export const mapPaymentConnectorForStats = (record: DbIntgPaymentConnector) => ({
    connectorStatus: record.connector_status,
    status: record.status,
});

export const mapAccountingConnectorForStats = (record: DbIntgAccountingConnector) => ({
    connectorStatus: record.connector_status,
    status: record.status,
});

export const mapPaymentRetryQueueForStats = (record: DbIntgPaymentRetryQueue) => ({
    status: record.status,
});

export const mapPaymentTransactionForStats = (record: DbIntgPaymentTransaction) => ({
    transactionStatus: record.transaction_status,
    status: record.status,
});

export const mapConnectorHealthForStats = (record: DbIntgConnectorHealth) => ({
    healthScore: record.health_score,
});

export const mapIntegrationHealthForStats = (record: DbIntgIntegrationHealth) => ({
    overallScore: record.overall_score,
});

export const mapIntegrationFailureForStats = (record: DbIntgIntegrationFailure) => ({
    status: record.status,
});
