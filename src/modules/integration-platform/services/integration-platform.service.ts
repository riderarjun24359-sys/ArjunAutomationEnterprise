import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import {
    buildIntegrationHubLookupMaps,
    buildIntgAuditPayload,
    buildIntgDashboardStats,
    buildIntgPipelineInfo,
    mapAuditEntry,
    buildIntegrationHubPayload,
    mapIntegrationHubSummary,
    buildConnectedServicePayload,
    mapConnectedServiceSummary,
    buildConnectorConfigPayload,
    mapConnectorConfigSummary,
    buildConnectorHealthPayload,
    mapConnectorHealthSummary,
    buildPaymentConnectorPayload,
    mapPaymentConnectorSummary,
    buildPaymentConnectorHealthPayload,
    mapPaymentConnectorHealthSummary,
    buildPaymentRetryQueuePayload,
    mapPaymentRetryQueueSummary,
    buildPaymentTransactionPayload,
    mapPaymentTransactionSummary,
    buildAccountingConnectorPayload,
    mapAccountingConnectorSummary,
    buildAccountingSyncStatusPayload,
    mapAccountingSyncStatusSummary,
    buildExportMappingPayload,
    mapExportMappingSummary,
    buildAccountingExportPayload,
    mapAccountingExportSummary,
    buildApiKeyPayload,
    mapApiKeySummary,
    buildApiScopePayload,
    mapApiScopeSummary,
    buildRateLimitPayload,
    mapRateLimitSummary,
    buildApiUsagePayload,
    mapApiUsageSummary,
    buildIncomingWebhookPayload,
    mapIncomingWebhookSummary,
    buildOutgoingWebhookPayload,
    mapOutgoingWebhookSummary,
    buildWebhookDeadLetterPayload,
    mapWebhookDeadLetterSummary,
    buildWebhookDeliveryLogPayload,
    mapWebhookDeliveryLogSummary,
    buildMarketplaceConnectorPayload,
    mapMarketplaceConnectorSummary,
    buildMarketplaceInstallationPayload,
    mapMarketplaceInstallationSummary,
    buildMarketplaceCompatibilityPayload,
    mapMarketplaceCompatibilitySummary,
    buildMarketplaceVersionPayload,
    mapMarketplaceVersionSummary,
    buildApiAnalyticsPayload,
    mapApiAnalyticsSummary,
    buildLatencyMetricPayload,
    mapLatencyMetricSummary,
    buildWebhookAnalyticsPayload,
    mapWebhookAnalyticsSummary,
    buildUsageTrendPayload,
    mapUsageTrendSummary,
    buildIntegrationMetricPayload,
    mapIntegrationMetricSummary,
    buildIntegrationHealthPayload,
    mapIntegrationHealthSummary,
    buildIntegrationFailurePayload,
    mapIntegrationFailureSummary,
    mapConnectedServiceForStats,
    mapPaymentConnectorForStats,
    mapAccountingConnectorForStats,
    mapPaymentRetryQueueForStats,
    mapPaymentTransactionForStats,
    mapConnectorHealthForStats,
    mapIntegrationHealthForStats,
    mapIntegrationFailureForStats,
} from "@/src/modules/database/lib/integration-platform-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    IntegrationHubSummary,
    CreateIntegrationHubInput,
    ConnectedServiceSummary,
    CreateConnectedServiceInput,
    ConnectorConfigSummary,
    CreateConnectorConfigInput,
    ConnectorHealthSummary,
    CreateConnectorHealthInput,
    PaymentConnectorSummary,
    CreatePaymentConnectorInput,
    PaymentConnectorHealthSummary,
    CreatePaymentConnectorHealthInput,
    PaymentRetryQueueSummary,
    CreatePaymentRetryQueueInput,
    PaymentTransactionSummary,
    CreatePaymentTransactionInput,
    AccountingConnectorSummary,
    CreateAccountingConnectorInput,
    AccountingSyncStatusSummary,
    CreateAccountingSyncStatusInput,
    ExportMappingSummary,
    CreateExportMappingInput,
    AccountingExportSummary,
    CreateAccountingExportInput,
    ApiKeySummary,
    CreateApiKeyInput,
    ApiScopeSummary,
    CreateApiScopeInput,
    RateLimitSummary,
    CreateRateLimitInput,
    ApiUsageSummary,
    CreateApiUsageInput,
    IncomingWebhookSummary,
    CreateIncomingWebhookInput,
    OutgoingWebhookSummary,
    CreateOutgoingWebhookInput,
    WebhookDeadLetterSummary,
    CreateWebhookDeadLetterInput,
    WebhookDeliveryLogSummary,
    CreateWebhookDeliveryLogInput,
    MarketplaceConnectorSummary,
    CreateMarketplaceConnectorInput,
    MarketplaceInstallationSummary,
    CreateMarketplaceInstallationInput,
    MarketplaceCompatibilitySummary,
    CreateMarketplaceCompatibilityInput,
    MarketplaceVersionSummary,
    CreateMarketplaceVersionInput,
    ApiAnalyticsSummary,
    CreateApiAnalyticsInput,
    LatencyMetricSummary,
    CreateLatencyMetricInput,
    WebhookAnalyticsSummary,
    CreateWebhookAnalyticsInput,
    UsageTrendSummary,
    CreateUsageTrendInput,
    IntegrationMetricSummary,
    CreateIntegrationMetricInput,
    IntegrationHealthSummary,
    CreateIntegrationHealthInput,
    IntegrationFailureSummary,
    CreateIntegrationFailureInput,
    AuditEntry,
    IntgDashboardStats,
    IntgPipelineInfo,
    IntgSdkConnectServiceInput,
    IntgSdkConnectServiceResult,
    IntgSdkIssueApiKeyInput,
    IntgSdkIssueApiKeyResult,
    IntgSdkRegisterWebhookInput,
    IntgSdkRegisterWebhookResult,
} from "@/src/modules/integration-platform/types";

export class IntegrationPlatformService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const integrationHubs = await databaseService.intgIntegrationHubs.listByOrganization(organizationId);
        return buildIntegrationHubLookupMaps(integrationHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<IntgDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildIntgDashboardStats({ integrationHubs: [], connectedServices: [], paymentRetryQueue: [], paymentTransactions: [], integrationFailures: [], auditLogs: [] });
        const [integrationHubs, connectedServicesRaw, paymentConnectorsRaw, accountingConnectorsRaw, paymentRetryQueueRaw, paymentTransactionsRaw, connectorHealthRaw, integrationHealthRaw, integrationFailures, auditLogs] = await Promise.all([
            this.getIntegrationHubs(authUserId, email, fullName),
            databaseService.intgConnectedServices.listByOrganization(context.organizationId),
            databaseService.intgPaymentConnectors.listByOrganization(context.organizationId),
            databaseService.intgAccountingConnectors.listByOrganization(context.organizationId),
            databaseService.intgPaymentRetryQueue.listByOrganization(context.organizationId),
            databaseService.intgPaymentTransactions.listByOrganization(context.organizationId),
            databaseService.intgConnectorHealth.listByOrganization(context.organizationId),
            databaseService.intgIntegrationHealth.listByOrganization(context.organizationId),
            this.getIntegrationFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildIntgDashboardStats({
            integrationHubs,
            connectedServices: connectedServicesRaw.map(mapConnectedServiceForStats),
            paymentConnectors: paymentConnectorsRaw.map(mapPaymentConnectorForStats),
            accountingConnectors: accountingConnectorsRaw.map(mapAccountingConnectorForStats),
            paymentRetryQueue: paymentRetryQueueRaw.map(mapPaymentRetryQueueForStats),
            paymentTransactions: paymentTransactionsRaw.map(mapPaymentTransactionForStats),
            connectorHealth: connectorHealthRaw.map(mapConnectorHealthForStats),
            integrationHealth: integrationHealthRaw.map(mapIntegrationHealthForStats),
            integrationFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): IntgPipelineInfo {
        return buildIntgPipelineInfo();
    }

    async getIntegrationHubs(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.intgIntegrationHubs.listByOrganization(context.organizationId)).map(mapIntegrationHubSummary);
    }

    async createIntegrationHub(authUserId: string, email: string, input: CreateIntegrationHubInput, fullName?: string | null): Promise<IntegrationHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgIntegrationHubs.create(buildIntegrationHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create integrationHubs");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "integration_hubs", "create", `IntegrationHub created`, created.id));
        return mapIntegrationHubSummary(created);
    }

    async getConnectedServices(authUserId: string, email: string, fullName?: string | null): Promise<ConnectedServiceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgConnectedServices.listByOrganization(context.organizationId)).map((r) => mapConnectedServiceSummary(r, maps));
    }

    async createConnectedService(authUserId: string, email: string, input: CreateConnectedServiceInput, fullName?: string | null): Promise<ConnectedServiceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgConnectedServices.create(buildConnectedServicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create connectedServices");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "connected_services", "create", `ConnectedService created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapConnectedServiceSummary(created, maps);
    }

    async getConnectorConfigs(authUserId: string, email: string, fullName?: string | null): Promise<ConnectorConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgConnectorConfigs.listByOrganization(context.organizationId)).map((r) => mapConnectorConfigSummary(r, maps));
    }

    async createConnectorConfig(authUserId: string, email: string, input: CreateConnectorConfigInput, fullName?: string | null): Promise<ConnectorConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgConnectorConfigs.create(buildConnectorConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create connectorConfigs");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "connector_configs", "create", `ConnectorConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapConnectorConfigSummary(created, maps);
    }

    async getConnectorHealths(authUserId: string, email: string, fullName?: string | null): Promise<ConnectorHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgConnectorHealth.listByOrganization(context.organizationId)).map((r) => mapConnectorHealthSummary(r, maps));
    }

    async createConnectorHealth(authUserId: string, email: string, input: CreateConnectorHealthInput, fullName?: string | null): Promise<ConnectorHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgConnectorHealth.create(buildConnectorHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create connectorHealth");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "connector_health", "create", `ConnectorHealth created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapConnectorHealthSummary(created, maps);
    }

    async getPaymentConnectors(authUserId: string, email: string, fullName?: string | null): Promise<PaymentConnectorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgPaymentConnectors.listByOrganization(context.organizationId)).map((r) => mapPaymentConnectorSummary(r, maps));
    }

    async createPaymentConnector(authUserId: string, email: string, input: CreatePaymentConnectorInput, fullName?: string | null): Promise<PaymentConnectorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgPaymentConnectors.create(buildPaymentConnectorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create paymentConnectors");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "payment_connectors", "create", `PaymentConnector created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPaymentConnectorSummary(created, maps);
    }

    async getPaymentConnectorHealths(authUserId: string, email: string, fullName?: string | null): Promise<PaymentConnectorHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgPaymentConnectorHealth.listByOrganization(context.organizationId)).map((r) => mapPaymentConnectorHealthSummary(r, maps));
    }

    async createPaymentConnectorHealth(authUserId: string, email: string, input: CreatePaymentConnectorHealthInput, fullName?: string | null): Promise<PaymentConnectorHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgPaymentConnectorHealth.create(buildPaymentConnectorHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create paymentConnectorHealth");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "payment_connector_health", "create", `PaymentConnectorHealth created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPaymentConnectorHealthSummary(created, maps);
    }

    async getPaymentRetryQueues(authUserId: string, email: string, fullName?: string | null): Promise<PaymentRetryQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgPaymentRetryQueue.listByOrganization(context.organizationId)).map((r) => mapPaymentRetryQueueSummary(r, maps));
    }

    async createPaymentRetryQueue(authUserId: string, email: string, input: CreatePaymentRetryQueueInput, fullName?: string | null): Promise<PaymentRetryQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgPaymentRetryQueue.create(buildPaymentRetryQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create paymentRetryQueue");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "payment_retry_queue", "create", `PaymentRetryQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPaymentRetryQueueSummary(created, maps);
    }

    async getPaymentTransactions(authUserId: string, email: string, fullName?: string | null): Promise<PaymentTransactionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgPaymentTransactions.listByOrganization(context.organizationId)).map((r) => mapPaymentTransactionSummary(r, maps));
    }

    async createPaymentTransaction(authUserId: string, email: string, input: CreatePaymentTransactionInput, fullName?: string | null): Promise<PaymentTransactionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgPaymentTransactions.create(buildPaymentTransactionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create paymentTransactions");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "payment_transactions", "create", `PaymentTransaction created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPaymentTransactionSummary(created, maps);
    }

    async getAccountingConnectors(authUserId: string, email: string, fullName?: string | null): Promise<AccountingConnectorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgAccountingConnectors.listByOrganization(context.organizationId)).map((r) => mapAccountingConnectorSummary(r, maps));
    }

    async createAccountingConnector(authUserId: string, email: string, input: CreateAccountingConnectorInput, fullName?: string | null): Promise<AccountingConnectorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgAccountingConnectors.create(buildAccountingConnectorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create accountingConnectors");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "accounting_connectors", "create", `AccountingConnector created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAccountingConnectorSummary(created, maps);
    }

    async getAccountingSyncStatuss(authUserId: string, email: string, fullName?: string | null): Promise<AccountingSyncStatusSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgAccountingSyncStatus.listByOrganization(context.organizationId)).map((r) => mapAccountingSyncStatusSummary(r, maps));
    }

    async createAccountingSyncStatus(authUserId: string, email: string, input: CreateAccountingSyncStatusInput, fullName?: string | null): Promise<AccountingSyncStatusSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgAccountingSyncStatus.create(buildAccountingSyncStatusPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create accountingSyncStatus");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "accounting_sync_status", "create", `AccountingSyncStatus created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAccountingSyncStatusSummary(created, maps);
    }

    async getExportMappings(authUserId: string, email: string, fullName?: string | null): Promise<ExportMappingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgExportMappings.listByOrganization(context.organizationId)).map((r) => mapExportMappingSummary(r, maps));
    }

    async createExportMapping(authUserId: string, email: string, input: CreateExportMappingInput, fullName?: string | null): Promise<ExportMappingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgExportMappings.create(buildExportMappingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create exportMappings");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "export_mappings", "create", `ExportMapping created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExportMappingSummary(created, maps);
    }

    async getAccountingExports(authUserId: string, email: string, fullName?: string | null): Promise<AccountingExportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgAccountingExports.listByOrganization(context.organizationId)).map((r) => mapAccountingExportSummary(r, maps));
    }

    async createAccountingExport(authUserId: string, email: string, input: CreateAccountingExportInput, fullName?: string | null): Promise<AccountingExportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgAccountingExports.create(buildAccountingExportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create accountingExports");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "accounting_exports", "create", `AccountingExport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAccountingExportSummary(created, maps);
    }

    async getApiKeys(authUserId: string, email: string, fullName?: string | null): Promise<ApiKeySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgApiKeys.listByOrganization(context.organizationId)).map((r) => mapApiKeySummary(r, maps));
    }

    async createApiKey(authUserId: string, email: string, input: CreateApiKeyInput, fullName?: string | null): Promise<ApiKeySummary & { secret: string }> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const prefix = `aae_live_${randomBytes(12).toString("hex")}`;
        const secret = `${prefix}.${randomBytes(32).toString("base64url")}`;
        const keyHash = createHash("sha256").update(secret, "utf8").digest("hex");
        const created = await databaseService.intgApiKeys.create({
            ...buildApiKeyPayload(context.organizationId, input),
            key_prefix: prefix,
            key_hash: keyHash,
            status: "active",
        });
        if (!created) throw new Error("Failed to create API key");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "api_keys", "create", "API key issued", created.id));
        const maps = await this.getMaps(context.organizationId);
        return { ...mapApiKeySummary(created, maps), secret };
    }

    /**
     * Verify a presented API key within the caller-selected organization.
     * The caller must derive organizationId from trusted tenant context, never
     * from an untrusted request parameter.
     */
    async verifyApiKey(organizationId: string, presentedKey: string): Promise<{ id: string; organizationId: string; hubId: string; apiVersion: string } | null> {
        if (!/^aae_live_[a-f0-9]{24}\.[A-Za-z0-9_-]{43}$/.test(presentedKey)) return null;
        const separator = presentedKey.indexOf(".");
        const prefix = presentedKey.slice(0, separator);
        const record = await databaseService.intgApiKeys.findByPrefix(organizationId, prefix);
        if (!record || record.status !== "active") return null;
        if (record.expires_at && Date.parse(record.expires_at) <= Date.now()) return null;
        const expected = Buffer.from(record.key_hash, "hex");
        const actual = Buffer.from(createHash("sha256").update(presentedKey, "utf8").digest("hex"), "hex");
        if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
        await databaseService.intgApiKeys.touchLastUsedByOrganization(organizationId, record.id);
        return { id: record.id, organizationId: record.organization_id, hubId: record.hub_id, apiVersion: record.api_version };
    }

    async revokeApiKey(authUserId: string, email: string, apiKeyId: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const revoked = await databaseService.intgApiKeys.updateStatusByOrganization(context.organizationId, apiKeyId, "revoked");
        if (!revoked) return false;
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "api_keys", "revoke", "API key revoked", revoked.id));
        return true;
    }

    async getApiScopes(authUserId: string, email: string, fullName?: string | null): Promise<ApiScopeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgApiScopes.listByOrganization(context.organizationId)).map((r) => mapApiScopeSummary(r, maps));
    }

    async createApiScope(authUserId: string, email: string, input: CreateApiScopeInput, fullName?: string | null): Promise<ApiScopeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgApiScopes.create(buildApiScopePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create apiScopes");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "api_scopes", "create", `ApiScope created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApiScopeSummary(created, maps);
    }

    async getRateLimits(authUserId: string, email: string, fullName?: string | null): Promise<RateLimitSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgRateLimits.listByOrganization(context.organizationId)).map((r) => mapRateLimitSummary(r, maps));
    }

    async createRateLimit(authUserId: string, email: string, input: CreateRateLimitInput, fullName?: string | null): Promise<RateLimitSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgRateLimits.create(buildRateLimitPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rateLimits");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "rate_limits", "create", `RateLimit created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRateLimitSummary(created, maps);
    }

    async getApiUsages(authUserId: string, email: string, fullName?: string | null): Promise<ApiUsageSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgApiUsage.listByOrganization(context.organizationId)).map((r) => mapApiUsageSummary(r, maps));
    }

    async createApiUsage(authUserId: string, email: string, input: CreateApiUsageInput, fullName?: string | null): Promise<ApiUsageSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgApiUsage.create(buildApiUsagePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create apiUsage");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "api_usage", "create", `ApiUsage created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApiUsageSummary(created, maps);
    }

    async getIncomingWebhooks(authUserId: string, email: string, fullName?: string | null): Promise<IncomingWebhookSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgIncomingWebhooks.listByOrganization(context.organizationId)).map((r) => mapIncomingWebhookSummary(r, maps));
    }

    async createIncomingWebhook(authUserId: string, email: string, input: CreateIncomingWebhookInput, fullName?: string | null): Promise<IncomingWebhookSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgIncomingWebhooks.create(buildIncomingWebhookPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create incomingWebhooks");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "incoming_webhooks", "create", `IncomingWebhook created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIncomingWebhookSummary(created, maps);
    }

    async getOutgoingWebhooks(authUserId: string, email: string, fullName?: string | null): Promise<OutgoingWebhookSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgOutgoingWebhooks.listByOrganization(context.organizationId)).map((r) => mapOutgoingWebhookSummary(r, maps));
    }

    async createOutgoingWebhook(authUserId: string, email: string, input: CreateOutgoingWebhookInput, fullName?: string | null): Promise<OutgoingWebhookSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgOutgoingWebhooks.create(buildOutgoingWebhookPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create outgoingWebhooks");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "outgoing_webhooks", "create", `OutgoingWebhook created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOutgoingWebhookSummary(created, maps);
    }

    async getWebhookDeadLetters(authUserId: string, email: string, fullName?: string | null): Promise<WebhookDeadLetterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgWebhookDeadLetter.listByOrganization(context.organizationId)).map((r) => mapWebhookDeadLetterSummary(r, maps));
    }

    async createWebhookDeadLetter(authUserId: string, email: string, input: CreateWebhookDeadLetterInput, fullName?: string | null): Promise<WebhookDeadLetterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgWebhookDeadLetter.create(buildWebhookDeadLetterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create webhookDeadLetter");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "webhook_dead_letter", "create", `WebhookDeadLetter created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebhookDeadLetterSummary(created, maps);
    }

    async getWebhookDeliveryLogs(authUserId: string, email: string, fullName?: string | null): Promise<WebhookDeliveryLogSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgWebhookDeliveryLogs.listByOrganization(context.organizationId)).map((r) => mapWebhookDeliveryLogSummary(r, maps));
    }

    async createWebhookDeliveryLog(authUserId: string, email: string, input: CreateWebhookDeliveryLogInput, fullName?: string | null): Promise<WebhookDeliveryLogSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgWebhookDeliveryLogs.create(buildWebhookDeliveryLogPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create webhookDeliveryLogs");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "webhook_delivery_logs", "create", `WebhookDeliveryLog created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebhookDeliveryLogSummary(created, maps);
    }

    async getMarketplaceConnectors(authUserId: string, email: string, fullName?: string | null): Promise<MarketplaceConnectorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgMarketplaceConnectors.listByOrganization(context.organizationId)).map((r) => mapMarketplaceConnectorSummary(r, maps));
    }

    async createMarketplaceConnector(authUserId: string, email: string, input: CreateMarketplaceConnectorInput, fullName?: string | null): Promise<MarketplaceConnectorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgMarketplaceConnectors.create(buildMarketplaceConnectorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create marketplaceConnectors");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "marketplace_connectors", "create", `MarketplaceConnector created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMarketplaceConnectorSummary(created, maps);
    }

    async getMarketplaceInstallations(authUserId: string, email: string, fullName?: string | null): Promise<MarketplaceInstallationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgMarketplaceInstallations.listByOrganization(context.organizationId)).map((r) => mapMarketplaceInstallationSummary(r, maps));
    }

    async createMarketplaceInstallation(authUserId: string, email: string, input: CreateMarketplaceInstallationInput, fullName?: string | null): Promise<MarketplaceInstallationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgMarketplaceInstallations.create(buildMarketplaceInstallationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create marketplaceInstallations");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "marketplace_installations", "create", `MarketplaceInstallation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMarketplaceInstallationSummary(created, maps);
    }

    async getMarketplaceCompatibilitys(authUserId: string, email: string, fullName?: string | null): Promise<MarketplaceCompatibilitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgMarketplaceCompatibility.listByOrganization(context.organizationId)).map((r) => mapMarketplaceCompatibilitySummary(r, maps));
    }

    async createMarketplaceCompatibility(authUserId: string, email: string, input: CreateMarketplaceCompatibilityInput, fullName?: string | null): Promise<MarketplaceCompatibilitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgMarketplaceCompatibility.create(buildMarketplaceCompatibilityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create marketplaceCompatibility");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "marketplace_compatibility", "create", `MarketplaceCompatibility created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMarketplaceCompatibilitySummary(created, maps);
    }

    async getMarketplaceVersions(authUserId: string, email: string, fullName?: string | null): Promise<MarketplaceVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgMarketplaceVersions.listByOrganization(context.organizationId)).map((r) => mapMarketplaceVersionSummary(r, maps));
    }

    async createMarketplaceVersion(authUserId: string, email: string, input: CreateMarketplaceVersionInput, fullName?: string | null): Promise<MarketplaceVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgMarketplaceVersions.create(buildMarketplaceVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create marketplaceVersions");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "marketplace_versions", "create", `MarketplaceVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMarketplaceVersionSummary(created, maps);
    }

    async getApiAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<ApiAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgApiAnalytics.listByOrganization(context.organizationId)).map((r) => mapApiAnalyticsSummary(r, maps));
    }

    async createApiAnalytics(authUserId: string, email: string, input: CreateApiAnalyticsInput, fullName?: string | null): Promise<ApiAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgApiAnalytics.create(buildApiAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create apiAnalytics");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "api_analytics", "create", `ApiAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApiAnalyticsSummary(created, maps);
    }

    async getLatencyMetrics(authUserId: string, email: string, fullName?: string | null): Promise<LatencyMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgLatencyMetrics.listByOrganization(context.organizationId)).map((r) => mapLatencyMetricSummary(r, maps));
    }

    async createLatencyMetric(authUserId: string, email: string, input: CreateLatencyMetricInput, fullName?: string | null): Promise<LatencyMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgLatencyMetrics.create(buildLatencyMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create latencyMetrics");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "latency_metrics", "create", `LatencyMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLatencyMetricSummary(created, maps);
    }

    async getWebhookAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<WebhookAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgWebhookAnalytics.listByOrganization(context.organizationId)).map((r) => mapWebhookAnalyticsSummary(r, maps));
    }

    async createWebhookAnalytics(authUserId: string, email: string, input: CreateWebhookAnalyticsInput, fullName?: string | null): Promise<WebhookAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgWebhookAnalytics.create(buildWebhookAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create webhookAnalytics");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "webhook_analytics", "create", `WebhookAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebhookAnalyticsSummary(created, maps);
    }

    async getUsageTrends(authUserId: string, email: string, fullName?: string | null): Promise<UsageTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgUsageTrends.listByOrganization(context.organizationId)).map((r) => mapUsageTrendSummary(r, maps));
    }

    async createUsageTrend(authUserId: string, email: string, input: CreateUsageTrendInput, fullName?: string | null): Promise<UsageTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgUsageTrends.create(buildUsageTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create usageTrends");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "usage_trends", "create", `UsageTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUsageTrendSummary(created, maps);
    }

    async getIntegrationMetrics(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.intgIntegrationMetrics.listByOrganization(context.organizationId)).map(mapIntegrationMetricSummary);
    }

    async createIntegrationMetric(authUserId: string, email: string, input: CreateIntegrationMetricInput, fullName?: string | null): Promise<IntegrationMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgIntegrationMetrics.create(buildIntegrationMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create integrationMetrics");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "integration_metrics", "create", `IntegrationMetric created`, created.id));
        return mapIntegrationMetricSummary(created);
    }

    async getIntegrationHealths(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.intgIntegrationHealth.listByOrganization(context.organizationId)).map(mapIntegrationHealthSummary);
    }

    async createIntegrationHealth(authUserId: string, email: string, input: CreateIntegrationHealthInput, fullName?: string | null): Promise<IntegrationHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgIntegrationHealth.create(buildIntegrationHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create integrationHealth");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "integration_health", "create", `IntegrationHealth created`, created.id));
        return mapIntegrationHealthSummary(created);
    }

    async getIntegrationFailures(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.intgIntegrationFailures.listByOrganization(context.organizationId)).map((r) => mapIntegrationFailureSummary(r, maps));
    }

    async createIntegrationFailure(authUserId: string, email: string, input: CreateIntegrationFailureInput, fullName?: string | null): Promise<IntegrationFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.intgIntegrationFailures.create(buildIntegrationFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create integrationFailures");
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "integration_failures", "create", `IntegrationFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIntegrationFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.intgAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getIntegrationHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.intgIntegrationHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkConnectService(authUserId: string, email: string, input: IntgSdkConnectServiceInput, fullName?: string | null): Promise<IntgSdkConnectServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "connect_service", moduleSource: "integration_platform", inputPayload: { ...input } });
        const created = await this.createConnectedService(authUserId, email, { integrationHubId: input.integrationHubId, serviceKey: input.serviceKey, serviceName: input.serviceName, providerType: input.providerType, connectorStatus: "connected" }, fullName);
        return { serviceId: created.id, serviceKey: created.serviceKey, connectorStatus: created.connectorStatus };
    }

    async sdkIssueApiKey(authUserId: string, email: string, input: IntgSdkIssueApiKeyInput, fullName?: string | null): Promise<IntgSdkIssueApiKeyResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.keyName, limit: 3 });
        const created = await this.createApiKey(authUserId, email, { integrationHubId: input.integrationHubId, keyName: input.keyName, apiVersion: input.apiVersion }, fullName);
        return { apiKeyId: created.id, keyName: created.keyName, status: created.status, secret: created.secret };
    }

    async sdkRegisterWebhook(authUserId: string, email: string, input: IntgSdkRegisterWebhookInput, fullName?: string | null): Promise<IntgSdkRegisterWebhookResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_webhook", moduleSource: "integration_platform", inputPayload: { ...input } });
        const created = await this.createOutgoingWebhook(authUserId, email, { integrationHubId: input.integrationHubId, webhookKey: input.webhookKey, webhookName: input.webhookName, targetUrl: input.targetUrl }, fullName);
        return { webhookId: created.id, webhookKey: created.webhookKey, status: created.status };
    }
}

export const integrationPlatformService = new IntegrationPlatformService();
