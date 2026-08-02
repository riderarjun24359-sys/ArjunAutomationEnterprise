import type {
    DbAiCostRecord,
    DbAiModelRoute,
    DbAiOrchestrationAgent,
    DbAiOrchestrationAnalytics,
    DbAiOrchestrationAuditLog,
    DbAiPermissionGrant,
    DbAiPromptTemplate,
    DbAiProvider,
    DbAiProviderHealthCheck,
    DbAiRateLimit,
    DbAiRetryPolicy,
    DbAiSession,
    DbAiTaskExecution,
    DbAiUsageRecord,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAiOrchestrationRepository<T> extends BaseRepository<T> {
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
}

export class AiProviderRepository extends OrgAiOrchestrationRepository<DbAiProvider> { protected table = "ai_providers"; }
export class AiModelRouteRepository extends OrgAiOrchestrationRepository<DbAiModelRoute> { protected table = "ai_model_routes"; }
export class AiOrchestrationAgentRepository extends OrgAiOrchestrationRepository<DbAiOrchestrationAgent> { protected table = "ai_orchestration_agents"; }
export class AiPromptTemplateRepository extends OrgAiOrchestrationRepository<DbAiPromptTemplate> { protected table = "ai_prompt_templates"; }
export class AiSessionRepository extends OrgAiOrchestrationRepository<DbAiSession> { protected table = "ai_sessions"; }
export class AiTaskExecutionRepository extends OrgAiOrchestrationRepository<DbAiTaskExecution> { protected table = "ai_task_executions"; }
export class AiUsageRecordRepository extends OrgAiOrchestrationRepository<DbAiUsageRecord> { protected table = "ai_usage_records"; }
export class AiCostRecordRepository extends OrgAiOrchestrationRepository<DbAiCostRecord> { protected table = "ai_cost_records"; }
export class AiRateLimitRepository extends OrgAiOrchestrationRepository<DbAiRateLimit> { protected table = "ai_rate_limits"; }
export class AiPermissionGrantRepository extends OrgAiOrchestrationRepository<DbAiPermissionGrant> { protected table = "ai_permission_grants"; }
export class AiProviderHealthCheckRepository extends OrgAiOrchestrationRepository<DbAiProviderHealthCheck> { protected table = "ai_provider_health_checks"; }
export class AiRetryPolicyRepository extends OrgAiOrchestrationRepository<DbAiRetryPolicy> { protected table = "ai_retry_policies"; }
export class AiOrchestrationAuditLogRepository extends OrgAiOrchestrationRepository<DbAiOrchestrationAuditLog> { protected table = "ai_orchestration_audit_logs"; }
export class AiOrchestrationAnalyticsRepository extends OrgAiOrchestrationRepository<DbAiOrchestrationAnalytics> { protected table = "ai_orchestration_analytics"; }
