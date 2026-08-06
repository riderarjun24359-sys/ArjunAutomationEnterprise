import type {
    DbIntgApiAnalytics,
    DbIntgApiKey,
    DbIntgApiScope,
    DbIntgApiUsage,
    DbIntgAuditLog,
    DbIntgConnectedService,
    DbIntgConnectorConfig,
    DbIntgConnectorHealth,
    DbIntgIncomingWebhook,
    DbIntgIntegrationFailure,
    DbIntgIntegrationHealth,
    DbIntgIntegrationHub,
    DbIntgLatencyMetric,
    DbIntgMarketplaceConnector,
    DbIntgMarketplaceInstallation,
    DbIntgOutgoingWebhook,
    DbIntgPaymentConnector,
    DbIntgRateLimit,
    DbIntgWebhookDeliveryLog,
    DbWorkflow,
    DbWorkflowTrigger,
    DbDweWebhookTrigger,
    DbDweBusinessEventTrigger,
    DbDweTimeTrigger,
} from "@/src/modules/database/types/platform";

export interface IntegrationHubRawData {
    organizationId: string;
    hubs: DbIntgIntegrationHub[];
    connectedServices: DbIntgConnectedService[];
    connectorConfigs: DbIntgConnectorConfig[];
    connectorHealth: DbIntgConnectorHealth[];
    paymentConnectors: DbIntgPaymentConnector[];
    apiKeys: DbIntgApiKey[];
    apiScopes: DbIntgApiScope[];
    rateLimits: DbIntgRateLimit[];
    apiUsage: DbIntgApiUsage[];
    incomingWebhooks: DbIntgIncomingWebhook[];
    outgoingWebhooks: DbIntgOutgoingWebhook[];
    webhookDeliveries: DbIntgWebhookDeliveryLog[];
    marketplaceConnectors: DbIntgMarketplaceConnector[];
    marketplaceInstallations: DbIntgMarketplaceInstallation[];
    apiAnalytics: DbIntgApiAnalytics[];
    latencyMetrics: DbIntgLatencyMetric[];
    integrationHealth: DbIntgIntegrationHealth[];
    integrationFailures: DbIntgIntegrationFailure[];
    auditLogs: DbIntgAuditLog[];
    workflows: DbWorkflow[];
    workflowTriggers: DbWorkflowTrigger[];
    dweWebhookTriggers: DbDweWebhookTrigger[];
    dweEventTriggers: DbDweBusinessEventTrigger[];
    dweTimeTriggers: DbDweTimeTrigger[];
    fetchedAt: string;
}
