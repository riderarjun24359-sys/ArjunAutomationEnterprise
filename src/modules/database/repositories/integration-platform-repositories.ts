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
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgIntgRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class IntgIntegrationHubRepository extends OrgIntgRepository<DbIntgIntegrationHub> { protected table = "intg_integration_hubs"; }
export class IntgConnectedServiceRepository extends OrgIntgRepository<DbIntgConnectedService> { protected table = "intg_connected_services"; }
export class IntgConnectorConfigRepository extends OrgIntgRepository<DbIntgConnectorConfig> { protected table = "intg_connector_configs"; }
export class IntgConnectorHealthRepository extends OrgIntgRepository<DbIntgConnectorHealth> { protected table = "intg_connector_health"; }
export class IntgPaymentConnectorRepository extends OrgIntgRepository<DbIntgPaymentConnector> { protected table = "intg_payment_connectors"; }
export class IntgPaymentConnectorHealthRepository extends OrgIntgRepository<DbIntgPaymentConnectorHealth> { protected table = "intg_payment_connector_health"; }
export class IntgPaymentRetryQueueRepository extends OrgIntgRepository<DbIntgPaymentRetryQueue> { protected table = "intg_payment_retry_queue"; }
export class IntgPaymentTransactionRepository extends OrgIntgRepository<DbIntgPaymentTransaction> { protected table = "intg_payment_transactions"; }
export class IntgAccountingConnectorRepository extends OrgIntgRepository<DbIntgAccountingConnector> { protected table = "intg_accounting_connectors"; }
export class IntgAccountingSyncStatusRepository extends OrgIntgRepository<DbIntgAccountingSyncStatus> { protected table = "intg_accounting_sync_status"; }
export class IntgExportMappingRepository extends OrgIntgRepository<DbIntgExportMapping> { protected table = "intg_export_mappings"; }
export class IntgAccountingExportRepository extends OrgIntgRepository<DbIntgAccountingExport> { protected table = "intg_accounting_exports"; }
export class IntgApiKeyRepository extends OrgIntgRepository<DbIntgApiKey> {
    protected table = "intg_api_keys";

    async findByPrefix(organizationId: string, keyPrefix: string): Promise<DbIntgApiKey | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*")
            .eq("organization_id", organizationId)
            .eq("key_prefix", keyPrefix)
            .maybeSingle();
        mapRepositoryError(error, "Failed to find API key");
        return (data as DbIntgApiKey | null) ?? null;
    }

    async touchLastUsedByOrganization(organizationId: string, id: string): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from(this.table)
            .update({ last_used_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq("organization_id", organizationId)
            .eq("id", id);
        mapRepositoryError(error, "Failed to update API key usage");
    }

    async updateStatusByOrganization(organizationId: string, id: string, status: "active" | "revoked"): Promise<DbIntgApiKey | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update({ status, updated_at: new Date().toISOString() })
            .eq("organization_id", organizationId)
            .eq("id", id)
            .select("*")
            .maybeSingle();
        mapRepositoryError(error, "Failed to update API key status");
        return (data as DbIntgApiKey | null) ?? null;
    }
}
export class IntgApiScopeRepository extends OrgIntgRepository<DbIntgApiScope> { protected table = "intg_api_scopes"; }
export class IntgRateLimitRepository extends OrgIntgRepository<DbIntgRateLimit> { protected table = "intg_rate_limits"; }
export class IntgApiUsageRepository extends OrgIntgRepository<DbIntgApiUsage> { protected table = "intg_api_usage"; }
export class IntgIncomingWebhookRepository extends OrgIntgRepository<DbIntgIncomingWebhook> { protected table = "intg_incoming_webhooks"; }
export class IntgOutgoingWebhookRepository extends OrgIntgRepository<DbIntgOutgoingWebhook> { protected table = "intg_outgoing_webhooks"; }
export class IntgWebhookDeadLetterRepository extends OrgIntgRepository<DbIntgWebhookDeadLetter> { protected table = "intg_webhook_dead_letter"; }
export class IntgWebhookDeliveryLogRepository extends OrgIntgRepository<DbIntgWebhookDeliveryLog> { protected table = "intg_webhook_delivery_logs"; }
export class IntgMarketplaceConnectorRepository extends OrgIntgRepository<DbIntgMarketplaceConnector> { protected table = "intg_marketplace_connectors"; }
export class IntgMarketplaceInstallationRepository extends OrgIntgRepository<DbIntgMarketplaceInstallation> { protected table = "intg_marketplace_installations"; }
export class IntgMarketplaceCompatibilityRepository extends OrgIntgRepository<DbIntgMarketplaceCompatibility> { protected table = "intg_marketplace_compatibility"; }
export class IntgMarketplaceVersionRepository extends OrgIntgRepository<DbIntgMarketplaceVersion> { protected table = "intg_marketplace_versions"; }
export class IntgApiAnalyticsRepository extends OrgIntgRepository<DbIntgApiAnalytics> { protected table = "intg_api_analytics"; }
export class IntgLatencyMetricRepository extends OrgIntgRepository<DbIntgLatencyMetric> { protected table = "intg_latency_metrics"; }
export class IntgWebhookAnalyticsRepository extends OrgIntgRepository<DbIntgWebhookAnalytics> { protected table = "intg_webhook_analytics"; }
export class IntgUsageTrendRepository extends OrgIntgRepository<DbIntgUsageTrend> { protected table = "intg_usage_trends"; }
export class IntgIntegrationMetricRepository extends OrgIntgRepository<DbIntgIntegrationMetric> { protected table = "intg_integration_metrics"; }
export class IntgIntegrationHealthRepository extends OrgIntgRepository<DbIntgIntegrationHealth> { protected table = "intg_integration_health"; }
export class IntgIntegrationFailureRepository extends OrgIntgRepository<DbIntgIntegrationFailure> { protected table = "intg_integration_failures"; }
export class IntgAuditLogRepository extends OrgIntgRepository<DbIntgAuditLog> { protected table = "intg_audit_logs"; }
