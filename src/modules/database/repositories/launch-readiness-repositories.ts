import type {
    DbElrReadinessHub,
    DbElrEnvironmentValidation,
    DbElrConfigurationValidation,
    DbElrSecretsValidation,
    DbElrDeploymentPlan,
    DbElrRollbackPlan,
    DbElrVersionRegistry,
    DbElrReleaseNote,
    DbElrBackupPolicy,
    DbElrBackupVerification,
    DbElrRestoreVerification,
    DbElrRecoveryDrill,
    DbElrObservabilityLog,
    DbElrObservabilityMetric,
    DbElrTraceRecord,
    DbElrSlaMonitor,
    DbElrSecurityChecklist,
    DbElrVulnerabilityReview,
    DbElrPermissionAudit,
    DbElrComplianceReview,
    DbElrAdminGuide,
    DbElrUserGuide,
    DbElrDeploymentGuide,
    DbElrLaunchScoreMetric,
    DbElrReadinessValidation,
    DbElrLaunchBlocker,
    DbElrScoreSnapshot,
    DbElrLaunchHealth,
    DbElrCriticalIssue,
    DbElrReadinessWarning,
    DbElrLaunchFailure,
    DbElrAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgElrRepository<T> extends BaseRepository<T> {
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

export class ElrReadinessHubRepository extends OrgElrRepository<DbElrReadinessHub> { protected table = "elr_readiness_hubs"; }
export class ElrEnvironmentValidationRepository extends OrgElrRepository<DbElrEnvironmentValidation> { protected table = "elr_environment_validations"; }
export class ElrConfigurationValidationRepository extends OrgElrRepository<DbElrConfigurationValidation> { protected table = "elr_configuration_validations"; }
export class ElrSecretsValidationRepository extends OrgElrRepository<DbElrSecretsValidation> { protected table = "elr_secrets_validations"; }
export class ElrDeploymentPlanRepository extends OrgElrRepository<DbElrDeploymentPlan> { protected table = "elr_deployment_plans"; }
export class ElrRollbackPlanRepository extends OrgElrRepository<DbElrRollbackPlan> { protected table = "elr_rollback_plans"; }
export class ElrVersionRegistryRepository extends OrgElrRepository<DbElrVersionRegistry> { protected table = "elr_version_registry"; }
export class ElrReleaseNoteRepository extends OrgElrRepository<DbElrReleaseNote> { protected table = "elr_release_notes"; }
export class ElrBackupPolicyRepository extends OrgElrRepository<DbElrBackupPolicy> { protected table = "elr_backup_policies"; }
export class ElrBackupVerificationRepository extends OrgElrRepository<DbElrBackupVerification> { protected table = "elr_backup_verifications"; }
export class ElrRestoreVerificationRepository extends OrgElrRepository<DbElrRestoreVerification> { protected table = "elr_restore_verifications"; }
export class ElrRecoveryDrillRepository extends OrgElrRepository<DbElrRecoveryDrill> { protected table = "elr_recovery_drills"; }
export class ElrObservabilityLogRepository extends OrgElrRepository<DbElrObservabilityLog> { protected table = "elr_observability_logs"; }
export class ElrObservabilityMetricRepository extends OrgElrRepository<DbElrObservabilityMetric> { protected table = "elr_observability_metrics"; }
export class ElrTraceRecordRepository extends OrgElrRepository<DbElrTraceRecord> { protected table = "elr_trace_records"; }
export class ElrSlaMonitorRepository extends OrgElrRepository<DbElrSlaMonitor> { protected table = "elr_sla_monitors"; }
export class ElrSecurityChecklistRepository extends OrgElrRepository<DbElrSecurityChecklist> { protected table = "elr_security_checklists"; }
export class ElrVulnerabilityReviewRepository extends OrgElrRepository<DbElrVulnerabilityReview> { protected table = "elr_vulnerability_reviews"; }
export class ElrPermissionAuditRepository extends OrgElrRepository<DbElrPermissionAudit> { protected table = "elr_permission_audits"; }
export class ElrComplianceReviewRepository extends OrgElrRepository<DbElrComplianceReview> { protected table = "elr_compliance_reviews"; }
export class ElrAdminGuideRepository extends OrgElrRepository<DbElrAdminGuide> { protected table = "elr_admin_guides"; }
export class ElrUserGuideRepository extends OrgElrRepository<DbElrUserGuide> { protected table = "elr_user_guides"; }
export class ElrDeploymentGuideRepository extends OrgElrRepository<DbElrDeploymentGuide> { protected table = "elr_deployment_guides"; }
export class ElrLaunchScoreMetricRepository extends OrgElrRepository<DbElrLaunchScoreMetric> { protected table = "elr_launch_scores"; }
export class ElrReadinessValidationRepository extends OrgElrRepository<DbElrReadinessValidation> { protected table = "elr_readiness_validations"; }
export class ElrLaunchBlockerRepository extends OrgElrRepository<DbElrLaunchBlocker> { protected table = "elr_launch_blockers"; }
export class ElrScoreSnapshotRepository extends OrgElrRepository<DbElrScoreSnapshot> { protected table = "elr_score_snapshots"; }
export class ElrLaunchHealthRepository extends OrgElrRepository<DbElrLaunchHealth> { protected table = "elr_launch_health"; }
export class ElrCriticalIssueRepository extends OrgElrRepository<DbElrCriticalIssue> { protected table = "elr_critical_issues"; }
export class ElrReadinessWarningRepository extends OrgElrRepository<DbElrReadinessWarning> { protected table = "elr_readiness_warnings"; }
export class ElrLaunchFailureRepository extends OrgElrRepository<DbElrLaunchFailure> { protected table = "elr_launch_failures"; }
export class ElrAuditLogRepository extends OrgElrRepository<DbElrAuditLog> { protected table = "elr_audit_logs"; }
