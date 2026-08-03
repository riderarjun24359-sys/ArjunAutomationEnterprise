import type {
    DbEocOperationsCenter,
    DbEocOverallHealth,
    DbEocModuleHealth,
    DbEocDatabaseHealth,
    DbEocJobScheduler,
    DbEocRecurringJob,
    DbEocJobRetryQueue,
    DbEocJobDeadLetter,
    DbEocPlatformEvent,
    DbEocBusinessEvent,
    DbEocEventSubscription,
    DbEocEventReplay,
    DbEocAlert,
    DbEocEscalationRule,
    DbEocAlertAcknowledgement,
    DbEocMaintenanceWindow,
    DbEocGlobalFlag,
    DbEocTenantFlag,
    DbEocBetaFeature,
    DbEocRolloutConfig,
    DbEocPlatformConfig,
    DbEocTenantConfig,
    DbEocSecretsMetadata,
    DbEocConfigVersion,
    DbEocPlatformLog,
    DbEocPlatformMetric,
    DbEocTraceSummary,
    DbEocServiceRegistry,
    DbEocOperationsMetric,
    DbEocOperationsHealth,
    DbEocOperationsFailure,
    DbEocAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgEocRepository<T> extends BaseRepository<T> {
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

export class EocOperationsCenterRepository extends OrgEocRepository<DbEocOperationsCenter> { protected table = "eoc_operations_centers"; }
export class EocOverallHealthRepository extends OrgEocRepository<DbEocOverallHealth> { protected table = "eoc_overall_health"; }
export class EocModuleHealthRepository extends OrgEocRepository<DbEocModuleHealth> { protected table = "eoc_module_health"; }
export class EocDatabaseHealthRepository extends OrgEocRepository<DbEocDatabaseHealth> { protected table = "eoc_database_health"; }
export class EocJobSchedulerRepository extends OrgEocRepository<DbEocJobScheduler> { protected table = "eoc_job_schedulers"; }
export class EocRecurringJobRepository extends OrgEocRepository<DbEocRecurringJob> { protected table = "eoc_recurring_jobs"; }
export class EocJobRetryQueueRepository extends OrgEocRepository<DbEocJobRetryQueue> { protected table = "eoc_job_retry_queue"; }
export class EocJobDeadLetterRepository extends OrgEocRepository<DbEocJobDeadLetter> { protected table = "eoc_job_dead_letter"; }
export class EocPlatformEventRepository extends OrgEocRepository<DbEocPlatformEvent> { protected table = "eoc_platform_events"; }
export class EocBusinessEventRepository extends OrgEocRepository<DbEocBusinessEvent> { protected table = "eoc_business_events"; }
export class EocEventSubscriptionRepository extends OrgEocRepository<DbEocEventSubscription> { protected table = "eoc_event_subscriptions"; }
export class EocEventReplayRepository extends OrgEocRepository<DbEocEventReplay> { protected table = "eoc_event_replays"; }
export class EocAlertRepository extends OrgEocRepository<DbEocAlert> { protected table = "eoc_alerts"; }
export class EocEscalationRuleRepository extends OrgEocRepository<DbEocEscalationRule> { protected table = "eoc_escalation_rules"; }
export class EocAlertAcknowledgementRepository extends OrgEocRepository<DbEocAlertAcknowledgement> { protected table = "eoc_alert_acknowledgements"; }
export class EocMaintenanceWindowRepository extends OrgEocRepository<DbEocMaintenanceWindow> { protected table = "eoc_maintenance_windows"; }
export class EocGlobalFlagRepository extends OrgEocRepository<DbEocGlobalFlag> { protected table = "eoc_global_flags"; }
export class EocTenantFlagRepository extends OrgEocRepository<DbEocTenantFlag> { protected table = "eoc_tenant_flags"; }
export class EocBetaFeatureRepository extends OrgEocRepository<DbEocBetaFeature> { protected table = "eoc_beta_features"; }
export class EocRolloutConfigRepository extends OrgEocRepository<DbEocRolloutConfig> { protected table = "eoc_rollout_configs"; }
export class EocPlatformConfigRepository extends OrgEocRepository<DbEocPlatformConfig> { protected table = "eoc_platform_configs"; }
export class EocTenantConfigRepository extends OrgEocRepository<DbEocTenantConfig> { protected table = "eoc_tenant_configs"; }
export class EocSecretsMetadataRepository extends OrgEocRepository<DbEocSecretsMetadata> { protected table = "eoc_secrets_metadata"; }
export class EocConfigVersionRepository extends OrgEocRepository<DbEocConfigVersion> { protected table = "eoc_config_versions"; }
export class EocPlatformLogRepository extends OrgEocRepository<DbEocPlatformLog> { protected table = "eoc_platform_logs"; }
export class EocPlatformMetricRepository extends OrgEocRepository<DbEocPlatformMetric> { protected table = "eoc_platform_metrics"; }
export class EocTraceSummaryRepository extends OrgEocRepository<DbEocTraceSummary> { protected table = "eoc_trace_summaries"; }
export class EocServiceRegistryRepository extends OrgEocRepository<DbEocServiceRegistry> { protected table = "eoc_service_registry"; }
export class EocOperationsMetricRepository extends OrgEocRepository<DbEocOperationsMetric> { protected table = "eoc_operations_metrics"; }
export class EocOperationsHealthRepository extends OrgEocRepository<DbEocOperationsHealth> { protected table = "eoc_operations_health"; }
export class EocOperationsFailureRepository extends OrgEocRepository<DbEocOperationsFailure> { protected table = "eoc_operations_failures"; }
export class EocAuditLogRepository extends OrgEocRepository<DbEocAuditLog> { protected table = "eoc_audit_logs"; }
