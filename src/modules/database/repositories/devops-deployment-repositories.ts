import type {
    DbDdAuditLog,
    DbDdBackupVerification,
    DbDdBlueGreenPlan,
    DbDdCanaryPlan,
    DbDdCicdPipeline,
    DbDdCostEstimate,
    DbDdDeploymentApproval,
    DbDdDisasterRecoveryPlan,
    DbDdDockerConfig,
    DbDdEngagement,
    DbDdEnvironment,
    DbDdHealthCheck,
    DbDdInfrastructureTemplate,
    DbDdKubernetesPlan,
    DbDdLoggingIntegration,
    DbDdMonitoringIntegration,
    DbDdReleaseOrchestration,
    DbDdReleaseVersion,
    DbDdRollbackPlan,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgDdRepository<T> extends BaseRepository<T> {
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

export class DdEngagementRepository extends OrgDdRepository<DbDdEngagement> { protected table = "dd_engagements"; }
export class DdCicdPipelineRepository extends OrgDdRepository<DbDdCicdPipeline> { protected table = "dd_cicd_pipelines"; }
export class DdEnvironmentRepository extends OrgDdRepository<DbDdEnvironment> { protected table = "dd_environments"; }
export class DdInfrastructureTemplateRepository extends OrgDdRepository<DbDdInfrastructureTemplate> { protected table = "dd_infrastructure_templates"; }
export class DdDockerConfigRepository extends OrgDdRepository<DbDdDockerConfig> { protected table = "dd_docker_configs"; }
export class DdKubernetesPlanRepository extends OrgDdRepository<DbDdKubernetesPlan> { protected table = "dd_kubernetes_plans"; }
export class DdReleaseOrchestrationRepository extends OrgDdRepository<DbDdReleaseOrchestration> { protected table = "dd_release_orchestrations"; }
export class DdRollbackPlanRepository extends OrgDdRepository<DbDdRollbackPlan> { protected table = "dd_rollback_plans"; }
export class DdBlueGreenPlanRepository extends OrgDdRepository<DbDdBlueGreenPlan> { protected table = "dd_blue_green_plans"; }
export class DdCanaryPlanRepository extends OrgDdRepository<DbDdCanaryPlan> { protected table = "dd_canary_plans"; }
export class DdMonitoringIntegrationRepository extends OrgDdRepository<DbDdMonitoringIntegration> { protected table = "dd_monitoring_integrations"; }
export class DdLoggingIntegrationRepository extends OrgDdRepository<DbDdLoggingIntegration> { protected table = "dd_logging_integrations"; }
export class DdHealthCheckRepository extends OrgDdRepository<DbDdHealthCheck> { protected table = "dd_health_checks"; }
export class DdBackupVerificationRepository extends OrgDdRepository<DbDdBackupVerification> { protected table = "dd_backup_verifications"; }
export class DdDisasterRecoveryPlanRepository extends OrgDdRepository<DbDdDisasterRecoveryPlan> { protected table = "dd_disaster_recovery_plans"; }
export class DdCostEstimateRepository extends OrgDdRepository<DbDdCostEstimate> { protected table = "dd_cost_estimates"; }
export class DdDeploymentApprovalRepository extends OrgDdRepository<DbDdDeploymentApproval> { protected table = "dd_deployment_approvals"; }
export class DdReleaseVersionRepository extends OrgDdRepository<DbDdReleaseVersion> { protected table = "dd_release_versions"; }
export class DdAuditLogRepository extends OrgDdRepository<DbDdAuditLog> { protected table = "dd_audit_logs"; }
