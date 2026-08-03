import type {
    DbIdpRealm,
    DbIdpProvider,
    DbIdpSamlConfig,
    DbIdpOidcConfig,
    DbIdpMfaPolicy,
    DbIdpMfaEnrollment,
    DbIdpBackupCode,
    DbIdpTrustedDevice,
    DbIdpSessionPolicy,
    DbIdpActiveSession,
    DbIdpDeviceRegistry,
    DbIdpConcurrentLoginPolicy,
    DbIdpRbacRole,
    DbIdpPermissionGroup,
    DbIdpAbacPolicy,
    DbIdpTemporaryAccessGrant,
    DbIdpDepartment,
    DbIdpTeam,
    DbIdpBusinessUnit,
    DbIdpReportingStructure,
    DbIdpInvitation,
    DbIdpBulkInviteBatch,
    DbIdpInvitationRole,
    DbIdpInvitationAudit,
    DbIdpLoginHistory,
    DbIdpSecurityAlert,
    DbIdpRiskEvent,
    DbIdpPasswordPolicy,
    DbIdpAdminMetric,
    DbIdpIdentityHealth,
    DbIdpCompromisedAccount,
    DbIdpAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgIdpRepository<T> extends BaseRepository<T> {
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

export class IdpRealmRepository extends OrgIdpRepository<DbIdpRealm> { protected table = "idp_realms"; }
export class IdpProviderRepository extends OrgIdpRepository<DbIdpProvider> { protected table = "idp_providers"; }
export class IdpSamlConfigRepository extends OrgIdpRepository<DbIdpSamlConfig> { protected table = "idp_saml_configs"; }
export class IdpOidcConfigRepository extends OrgIdpRepository<DbIdpOidcConfig> { protected table = "idp_oidc_configs"; }
export class IdpMfaPolicyRepository extends OrgIdpRepository<DbIdpMfaPolicy> { protected table = "idp_mfa_policies"; }
export class IdpMfaEnrollmentRepository extends OrgIdpRepository<DbIdpMfaEnrollment> { protected table = "idp_mfa_enrollments"; }
export class IdpBackupCodeRepository extends OrgIdpRepository<DbIdpBackupCode> { protected table = "idp_backup_codes"; }
export class IdpTrustedDeviceRepository extends OrgIdpRepository<DbIdpTrustedDevice> { protected table = "idp_trusted_devices"; }
export class IdpSessionPolicyRepository extends OrgIdpRepository<DbIdpSessionPolicy> { protected table = "idp_session_policies"; }
export class IdpActiveSessionRepository extends OrgIdpRepository<DbIdpActiveSession> { protected table = "idp_active_sessions"; }
export class IdpDeviceRegistryRepository extends OrgIdpRepository<DbIdpDeviceRegistry> { protected table = "idp_device_registry"; }
export class IdpConcurrentLoginPolicyRepository extends OrgIdpRepository<DbIdpConcurrentLoginPolicy> { protected table = "idp_concurrent_login_policies"; }
export class IdpRbacRoleRepository extends OrgIdpRepository<DbIdpRbacRole> { protected table = "idp_rbac_roles"; }
export class IdpPermissionGroupRepository extends OrgIdpRepository<DbIdpPermissionGroup> { protected table = "idp_permission_groups"; }
export class IdpAbacPolicyRepository extends OrgIdpRepository<DbIdpAbacPolicy> { protected table = "idp_abac_policies"; }
export class IdpTemporaryAccessGrantRepository extends OrgIdpRepository<DbIdpTemporaryAccessGrant> { protected table = "idp_temporary_access_grants"; }
export class IdpDepartmentRepository extends OrgIdpRepository<DbIdpDepartment> { protected table = "idp_departments"; }
export class IdpTeamRepository extends OrgIdpRepository<DbIdpTeam> { protected table = "idp_teams"; }
export class IdpBusinessUnitRepository extends OrgIdpRepository<DbIdpBusinessUnit> { protected table = "idp_business_units"; }
export class IdpReportingStructureRepository extends OrgIdpRepository<DbIdpReportingStructure> { protected table = "idp_reporting_structures"; }
export class IdpInvitationRepository extends OrgIdpRepository<DbIdpInvitation> { protected table = "idp_invitations"; }
export class IdpBulkInviteBatchRepository extends OrgIdpRepository<DbIdpBulkInviteBatch> { protected table = "idp_bulk_invite_batches"; }
export class IdpInvitationRoleRepository extends OrgIdpRepository<DbIdpInvitationRole> { protected table = "idp_invitation_roles"; }
export class IdpInvitationAuditRepository extends OrgIdpRepository<DbIdpInvitationAudit> { protected table = "idp_invitation_audit"; }
export class IdpLoginHistoryRepository extends OrgIdpRepository<DbIdpLoginHistory> { protected table = "idp_login_history"; }
export class IdpSecurityAlertRepository extends OrgIdpRepository<DbIdpSecurityAlert> { protected table = "idp_security_alerts"; }
export class IdpRiskEventRepository extends OrgIdpRepository<DbIdpRiskEvent> { protected table = "idp_risk_events"; }
export class IdpPasswordPolicyRepository extends OrgIdpRepository<DbIdpPasswordPolicy> { protected table = "idp_password_policies"; }
export class IdpAdminMetricRepository extends OrgIdpRepository<DbIdpAdminMetric> { protected table = "idp_admin_metrics"; }
export class IdpIdentityHealthRepository extends OrgIdpRepository<DbIdpIdentityHealth> { protected table = "idp_identity_health"; }
export class IdpCompromisedAccountRepository extends OrgIdpRepository<DbIdpCompromisedAccount> { protected table = "idp_compromised_accounts"; }
export class IdpAuditLogRepository extends OrgIdpRepository<DbIdpAuditLog> { protected table = "idp_audit_logs"; }
