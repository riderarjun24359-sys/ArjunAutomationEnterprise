import type {
    DbCopOperatedHub,
    DbCopSignupFlow,
    DbCopOrgProvisioning,
    DbCopDomainOnboarding,
    DbCopEmailVerification,
    DbCopOnboardingWizard,
    DbCopProductionProfile,
    DbCopDeploymentJob,
    DbCopHealthValidation,
    DbCopRollbackAutomation,
    DbCopDeploymentAudit,
    DbCopCentralLog,
    DbCopMetricsCollector,
    DbCopDistributedTrace,
    DbCopAlertRule,
    DbCopIncidentTimeline,
    DbCopBackupScheduler,
    DbCopRestoreValidation,
    DbCopMaintenanceMode,
    DbCopFeatureFlagOp,
    DbCopPlatformDiagnostic,
    DbCopBetaOrganization,
    DbCopBetaInvitation,
    DbCopFeedbackCollection,
    DbCopFeatureRequest,
    DbCopBugReport,
    DbCopReleaseChannel,
    DbCopOperatedMetric,
    DbCopOperatedHealth,
    DbCopExecutiveBriefing,
    DbCopPlatformFailure,
    DbCopAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgCopRepository<T> extends BaseRepository<T> {
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

export class CopOperatedHubRepository extends OrgCopRepository<DbCopOperatedHub> { protected table = "cop_operated_hubs"; }
export class CopSignupFlowRepository extends OrgCopRepository<DbCopSignupFlow> { protected table = "cop_signup_flows"; }
export class CopOrgProvisioningRepository extends OrgCopRepository<DbCopOrgProvisioning> { protected table = "cop_org_provisioning"; }
export class CopDomainOnboardingRepository extends OrgCopRepository<DbCopDomainOnboarding> { protected table = "cop_domain_onboarding"; }
export class CopEmailVerificationRepository extends OrgCopRepository<DbCopEmailVerification> { protected table = "cop_email_verifications"; }
export class CopOnboardingWizardRepository extends OrgCopRepository<DbCopOnboardingWizard> { protected table = "cop_onboarding_wizards"; }
export class CopProductionProfileRepository extends OrgCopRepository<DbCopProductionProfile> { protected table = "cop_production_profiles"; }
export class CopDeploymentJobRepository extends OrgCopRepository<DbCopDeploymentJob> { protected table = "cop_deployment_jobs"; }
export class CopHealthValidationRepository extends OrgCopRepository<DbCopHealthValidation> { protected table = "cop_health_validations"; }
export class CopRollbackAutomationRepository extends OrgCopRepository<DbCopRollbackAutomation> { protected table = "cop_rollback_automations"; }
export class CopDeploymentAuditRepository extends OrgCopRepository<DbCopDeploymentAudit> { protected table = "cop_deployment_audits"; }
export class CopCentralLogRepository extends OrgCopRepository<DbCopCentralLog> { protected table = "cop_central_logs"; }
export class CopMetricsCollectorRepository extends OrgCopRepository<DbCopMetricsCollector> { protected table = "cop_metrics_collectors"; }
export class CopDistributedTraceRepository extends OrgCopRepository<DbCopDistributedTrace> { protected table = "cop_distributed_traces"; }
export class CopAlertRuleRepository extends OrgCopRepository<DbCopAlertRule> { protected table = "cop_alert_rules"; }
export class CopIncidentTimelineRepository extends OrgCopRepository<DbCopIncidentTimeline> { protected table = "cop_incident_timelines"; }
export class CopBackupSchedulerRepository extends OrgCopRepository<DbCopBackupScheduler> { protected table = "cop_backup_schedulers"; }
export class CopRestoreValidationRepository extends OrgCopRepository<DbCopRestoreValidation> { protected table = "cop_restore_validations"; }
export class CopMaintenanceModeRepository extends OrgCopRepository<DbCopMaintenanceMode> { protected table = "cop_maintenance_modes"; }
export class CopFeatureFlagOpRepository extends OrgCopRepository<DbCopFeatureFlagOp> { protected table = "cop_feature_flag_ops"; }
export class CopPlatformDiagnosticRepository extends OrgCopRepository<DbCopPlatformDiagnostic> { protected table = "cop_platform_diagnostics"; }
export class CopBetaOrganizationRepository extends OrgCopRepository<DbCopBetaOrganization> { protected table = "cop_beta_organizations"; }
export class CopBetaInvitationRepository extends OrgCopRepository<DbCopBetaInvitation> { protected table = "cop_beta_invitations"; }
export class CopFeedbackCollectionRepository extends OrgCopRepository<DbCopFeedbackCollection> { protected table = "cop_feedback_collection"; }
export class CopFeatureRequestRepository extends OrgCopRepository<DbCopFeatureRequest> { protected table = "cop_feature_requests"; }
export class CopBugReportRepository extends OrgCopRepository<DbCopBugReport> { protected table = "cop_bug_reports"; }
export class CopReleaseChannelRepository extends OrgCopRepository<DbCopReleaseChannel> { protected table = "cop_release_channels"; }
export class CopOperatedMetricRepository extends OrgCopRepository<DbCopOperatedMetric> { protected table = "cop_operated_metrics"; }
export class CopOperatedHealthRepository extends OrgCopRepository<DbCopOperatedHealth> { protected table = "cop_operated_health"; }
export class CopExecutiveBriefingRepository extends OrgCopRepository<DbCopExecutiveBriefing> { protected table = "cop_executive_briefings"; }
export class CopPlatformFailureRepository extends OrgCopRepository<DbCopPlatformFailure> { protected table = "cop_platform_failures"; }
export class CopAuditLogRepository extends OrgCopRepository<DbCopAuditLog> { protected table = "cop_audit_logs"; }
