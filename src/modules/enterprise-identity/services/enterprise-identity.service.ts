import {
    buildAbacPolicyPayload,
    buildActiveSessionPayload,
    buildAdminMetricPayload,
    buildBackupCodePayload,
    buildBulkInviteBatchPayload,
    buildBusinessUnitPayload,
    buildCompromisedAccountPayload,
    buildConcurrentLoginPolicyPayload,
    buildDepartmentPayload,
    buildDeviceRegistryPayload,
    buildIdentityHealthPayload,
    buildInvitationAuditPayload,
    buildInvitationPayload,
    buildInvitationRolePayload,
    buildLoginHistoryPayload,
    buildMfaEnrollmentPayload,
    buildMfaPolicyPayload,
    buildOidcConfigPayload,
    buildPasswordPolicyPayload,
    buildPermissionGroupPayload,
    buildProviderPayload,
    buildRbacRolePayload,
    buildRealmPayload,
    buildReportingStructurePayload,
    buildRiskEventPayload,
    buildSamlConfigPayload,
    buildSecurityAlertPayload,
    buildSessionPolicyPayload,
    buildTeamPayload,
    buildTemporaryAccessGrantPayload,
    buildTrustedDevicePayload,
    mapAbacPolicySummary,
    mapActiveSessionSummary,
    mapAdminMetricSummary,
    mapBackupCodeSummary,
    mapBulkInviteBatchSummary,
    mapBusinessUnitSummary,
    mapCompromisedAccountSummary,
    mapConcurrentLoginPolicySummary,
    mapDepartmentSummary,
    mapDeviceRegistrySummary,
    mapIdentityHealthSummary,
    mapInvitationAuditSummary,
    mapInvitationRoleSummary,
    mapInvitationSummary,
    mapLoginHistorySummary,
    mapMfaEnrollmentSummary,
    mapMfaPolicySummary,
    mapOidcConfigSummary,
    mapPasswordPolicySummary,
    mapPermissionGroupSummary,
    mapProviderSummary,
    mapRbacRoleSummary,
    mapRealmSummary,
    mapReportingStructureSummary,
    mapRiskEventSummary,
    mapSamlConfigSummary,
    mapSecurityAlertSummary,
    mapSessionPolicySummary,
    mapTeamSummary,
    mapTemporaryAccessGrantSummary,
    mapTrustedDeviceSummary,
    buildIdpAuditPayload,
    buildIdpDashboardStats,
    buildIdpPipelineInfo,
    buildRealmLookupMaps,
    mapAuditEntry,
} from "@/src/modules/database/lib/enterprise-identity-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AbacPolicySummary,
    ActiveSessionSummary,
    AdminMetricSummary,
    BackupCodeSummary,
    BulkInviteBatchSummary,
    BusinessUnitSummary,
    CompromisedAccountSummary,
    ConcurrentLoginPolicySummary,
    CreateAbacPolicyInput,
    CreateActiveSessionInput,
    CreateAdminMetricInput,
    CreateBackupCodeInput,
    CreateBulkInviteBatchInput,
    CreateBusinessUnitInput,
    CreateCompromisedAccountInput,
    CreateConcurrentLoginPolicyInput,
    CreateDepartmentInput,
    CreateDeviceRegistryInput,
    CreateIdentityHealthInput,
    CreateInvitationAuditInput,
    CreateInvitationInput,
    CreateInvitationRoleInput,
    CreateLoginHistoryInput,
    CreateMfaEnrollmentInput,
    CreateMfaPolicyInput,
    CreateOidcConfigInput,
    CreatePasswordPolicyInput,
    CreatePermissionGroupInput,
    CreateProviderInput,
    CreateRbacRoleInput,
    CreateRealmInput,
    CreateReportingStructureInput,
    CreateRiskEventInput,
    CreateSamlConfigInput,
    CreateSecurityAlertInput,
    CreateSessionPolicyInput,
    CreateTeamInput,
    CreateTemporaryAccessGrantInput,
    CreateTrustedDeviceInput,
    DepartmentSummary,
    DeviceRegistrySummary,
    IdentityHealthSummary,
    InvitationAuditSummary,
    InvitationRoleSummary,
    InvitationSummary,
    LoginHistorySummary,
    MfaEnrollmentSummary,
    MfaPolicySummary,
    OidcConfigSummary,
    PasswordPolicySummary,
    PermissionGroupSummary,
    ProviderSummary,
    RbacRoleSummary,
    RealmSummary,
    ReportingStructureSummary,
    RiskEventSummary,
    SamlConfigSummary,
    SecurityAlertSummary,
    SessionPolicySummary,
    TeamSummary,
    TemporaryAccessGrantSummary,
    TrustedDeviceSummary,
    AuditEntry,
    IdpDashboardStats,
    IdpPipelineInfo,
    IdpSdkEnrollMfaInput,
    IdpSdkEnrollMfaResult,
    IdpSdkInviteUserInput,
    IdpSdkInviteUserResult,
    IdpSdkProvisionRealmInput,
    IdpSdkProvisionRealmResult,
} from "@/src/modules/enterprise-identity/types";

export class EnterpriseIdentityService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const realms = await databaseService.idpRealms.listByOrganization(organizationId);
        return buildRealmLookupMaps(realms);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<IdpDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildIdpDashboardStats({ realms: [], providers: [], mfaEnrollments: [], activeSessions: [], invitations: [], securityAlerts: [], compromisedAccounts: [], adminMetrics: [], auditLogs: [] });
        const [realms, providers, mfaEnrollments, activeSessions, invitations, securityAlerts, compromisedAccounts, adminMetrics, auditLogs] = await Promise.all([
            this.getRealms(authUserId, email, fullName),
            this.getProviders(authUserId, email, fullName),
            this.getMfaEnrollments(authUserId, email, fullName),
            this.getActiveSessions(authUserId, email, fullName),
            this.getInvitations(authUserId, email, fullName),
            this.getSecurityAlerts(authUserId, email, fullName),
            this.getCompromisedAccounts(authUserId, email, fullName),
            this.getAdminMetrics(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildIdpDashboardStats({ realms, providers, mfaEnrollments, activeSessions, invitations, securityAlerts, compromisedAccounts, adminMetrics, auditLogs });
    }

    getPipelineInfo(): IdpPipelineInfo {
        return buildIdpPipelineInfo();
    }

    async getRealms(authUserId: string, email: string, fullName?: string | null): Promise<RealmSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.idpRealms.listByOrganization(context.organizationId)).map(mapRealmSummary);
    }

    async createRealm(authUserId: string, email: string, input: CreateRealmInput, fullName?: string | null): Promise<RealmSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpRealms.create(buildRealmPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create realms");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "realm", "create", `Realm created`, created.id));
        return mapRealmSummary(created);
    }

    async getProviders(authUserId: string, email: string, fullName?: string | null): Promise<ProviderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpProviders.listByOrganization(context.organizationId)).map((r) => mapProviderSummary(r, maps));
    }

    async createProvider(authUserId: string, email: string, input: CreateProviderInput, fullName?: string | null): Promise<ProviderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpProviders.create(buildProviderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create providers");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "provider", "create", `Provider created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProviderSummary(created, maps);
    }

    async getSamlConfigs(authUserId: string, email: string, fullName?: string | null): Promise<SamlConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpSamlConfigs.listByOrganization(context.organizationId)).map((r) => mapSamlConfigSummary(r, maps));
    }

    async createSamlConfig(authUserId: string, email: string, input: CreateSamlConfigInput, fullName?: string | null): Promise<SamlConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpSamlConfigs.create(buildSamlConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create samlConfigs");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "saml_config", "create", `SamlConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSamlConfigSummary(created, maps);
    }

    async getOidcConfigs(authUserId: string, email: string, fullName?: string | null): Promise<OidcConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpOidcConfigs.listByOrganization(context.organizationId)).map((r) => mapOidcConfigSummary(r, maps));
    }

    async createOidcConfig(authUserId: string, email: string, input: CreateOidcConfigInput, fullName?: string | null): Promise<OidcConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpOidcConfigs.create(buildOidcConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create oidcConfigs");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "oidc_config", "create", `OidcConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOidcConfigSummary(created, maps);
    }

    async getMfaPolicies(authUserId: string, email: string, fullName?: string | null): Promise<MfaPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpMfaPolicies.listByOrganization(context.organizationId)).map((r) => mapMfaPolicySummary(r, maps));
    }

    async createMfaPolicy(authUserId: string, email: string, input: CreateMfaPolicyInput, fullName?: string | null): Promise<MfaPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpMfaPolicies.create(buildMfaPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create mfaPolicies");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "mfa_policy", "create", `MfaPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMfaPolicySummary(created, maps);
    }

    async getMfaEnrollments(authUserId: string, email: string, fullName?: string | null): Promise<MfaEnrollmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpMfaEnrollments.listByOrganization(context.organizationId)).map((r) => mapMfaEnrollmentSummary(r, maps));
    }

    async createMfaEnrollment(authUserId: string, email: string, input: CreateMfaEnrollmentInput, fullName?: string | null): Promise<MfaEnrollmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpMfaEnrollments.create(buildMfaEnrollmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create mfaEnrollments");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "mfa_enrollment", "create", `MfaEnrollment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMfaEnrollmentSummary(created, maps);
    }

    async getBackupCodes(authUserId: string, email: string, fullName?: string | null): Promise<BackupCodeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpBackupCodes.listByOrganization(context.organizationId)).map((r) => mapBackupCodeSummary(r, maps));
    }

    async createBackupCode(authUserId: string, email: string, input: CreateBackupCodeInput, fullName?: string | null): Promise<BackupCodeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpBackupCodes.create(buildBackupCodePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create backupCodes");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "backup_code", "create", `BackupCode created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBackupCodeSummary(created, maps);
    }

    async getTrustedDevices(authUserId: string, email: string, fullName?: string | null): Promise<TrustedDeviceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpTrustedDevices.listByOrganization(context.organizationId)).map((r) => mapTrustedDeviceSummary(r, maps));
    }

    async createTrustedDevice(authUserId: string, email: string, input: CreateTrustedDeviceInput, fullName?: string | null): Promise<TrustedDeviceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpTrustedDevices.create(buildTrustedDevicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create trustedDevices");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "trusted_device", "create", `TrustedDevice created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTrustedDeviceSummary(created, maps);
    }

    async getSessionPolicies(authUserId: string, email: string, fullName?: string | null): Promise<SessionPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpSessionPolicies.listByOrganization(context.organizationId)).map((r) => mapSessionPolicySummary(r, maps));
    }

    async createSessionPolicy(authUserId: string, email: string, input: CreateSessionPolicyInput, fullName?: string | null): Promise<SessionPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpSessionPolicies.create(buildSessionPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create sessionPolicies");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "session_policy", "create", `SessionPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSessionPolicySummary(created, maps);
    }

    async getActiveSessions(authUserId: string, email: string, fullName?: string | null): Promise<ActiveSessionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpActiveSessions.listByOrganization(context.organizationId)).map((r) => mapActiveSessionSummary(r, maps));
    }

    async createActiveSession(authUserId: string, email: string, input: CreateActiveSessionInput, fullName?: string | null): Promise<ActiveSessionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpActiveSessions.create(buildActiveSessionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create activeSessions");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "active_session", "create", `ActiveSession created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapActiveSessionSummary(created, maps);
    }

    async getDeviceRegistry(authUserId: string, email: string, fullName?: string | null): Promise<DeviceRegistrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpDeviceRegistry.listByOrganization(context.organizationId)).map((r) => mapDeviceRegistrySummary(r, maps));
    }

    async createDeviceRegistry(authUserId: string, email: string, input: CreateDeviceRegistryInput, fullName?: string | null): Promise<DeviceRegistrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpDeviceRegistry.create(buildDeviceRegistryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deviceRegistry");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "device_registry", "create", `DeviceRegistry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeviceRegistrySummary(created, maps);
    }

    async getConcurrentLoginPolicies(authUserId: string, email: string, fullName?: string | null): Promise<ConcurrentLoginPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpConcurrentLoginPolicies.listByOrganization(context.organizationId)).map((r) => mapConcurrentLoginPolicySummary(r, maps));
    }

    async createConcurrentLoginPolicy(authUserId: string, email: string, input: CreateConcurrentLoginPolicyInput, fullName?: string | null): Promise<ConcurrentLoginPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpConcurrentLoginPolicies.create(buildConcurrentLoginPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create concurrentLoginPolicies");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "concurrent_login_policy", "create", `ConcurrentLoginPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapConcurrentLoginPolicySummary(created, maps);
    }

    async getRbacRoles(authUserId: string, email: string, fullName?: string | null): Promise<RbacRoleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpRbacRoles.listByOrganization(context.organizationId)).map((r) => mapRbacRoleSummary(r, maps));
    }

    async createRbacRole(authUserId: string, email: string, input: CreateRbacRoleInput, fullName?: string | null): Promise<RbacRoleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpRbacRoles.create(buildRbacRolePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rbacRoles");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "rbac_role", "create", `RbacRole created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRbacRoleSummary(created, maps);
    }

    async getPermissionGroups(authUserId: string, email: string, fullName?: string | null): Promise<PermissionGroupSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpPermissionGroups.listByOrganization(context.organizationId)).map((r) => mapPermissionGroupSummary(r, maps));
    }

    async createPermissionGroup(authUserId: string, email: string, input: CreatePermissionGroupInput, fullName?: string | null): Promise<PermissionGroupSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpPermissionGroups.create(buildPermissionGroupPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create permissionGroups");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "permission_group", "create", `PermissionGroup created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPermissionGroupSummary(created, maps);
    }

    async getAbacPolicies(authUserId: string, email: string, fullName?: string | null): Promise<AbacPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpAbacPolicies.listByOrganization(context.organizationId)).map((r) => mapAbacPolicySummary(r, maps));
    }

    async createAbacPolicy(authUserId: string, email: string, input: CreateAbacPolicyInput, fullName?: string | null): Promise<AbacPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpAbacPolicies.create(buildAbacPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create abacPolicies");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "abac_policy", "create", `AbacPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAbacPolicySummary(created, maps);
    }

    async getTemporaryAccessGrants(authUserId: string, email: string, fullName?: string | null): Promise<TemporaryAccessGrantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpTemporaryAccessGrants.listByOrganization(context.organizationId)).map((r) => mapTemporaryAccessGrantSummary(r, maps));
    }

    async createTemporaryAccessGrant(authUserId: string, email: string, input: CreateTemporaryAccessGrantInput, fullName?: string | null): Promise<TemporaryAccessGrantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpTemporaryAccessGrants.create(buildTemporaryAccessGrantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create temporaryAccessGrants");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "temporary_access_grant", "create", `TemporaryAccessGrant created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTemporaryAccessGrantSummary(created, maps);
    }

    async getDepartments(authUserId: string, email: string, fullName?: string | null): Promise<DepartmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpDepartments.listByOrganization(context.organizationId)).map((r) => mapDepartmentSummary(r, maps));
    }

    async createDepartment(authUserId: string, email: string, input: CreateDepartmentInput, fullName?: string | null): Promise<DepartmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpDepartments.create(buildDepartmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create departments");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "department", "create", `Department created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDepartmentSummary(created, maps);
    }

    async getTeams(authUserId: string, email: string, fullName?: string | null): Promise<TeamSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpTeams.listByOrganization(context.organizationId)).map((r) => mapTeamSummary(r, maps));
    }

    async createTeam(authUserId: string, email: string, input: CreateTeamInput, fullName?: string | null): Promise<TeamSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpTeams.create(buildTeamPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create teams");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "team", "create", `Team created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTeamSummary(created, maps);
    }

    async getBusinessUnits(authUserId: string, email: string, fullName?: string | null): Promise<BusinessUnitSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpBusinessUnits.listByOrganization(context.organizationId)).map((r) => mapBusinessUnitSummary(r, maps));
    }

    async createBusinessUnit(authUserId: string, email: string, input: CreateBusinessUnitInput, fullName?: string | null): Promise<BusinessUnitSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpBusinessUnits.create(buildBusinessUnitPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessUnits");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "business_unit", "create", `BusinessUnit created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessUnitSummary(created, maps);
    }

    async getReportingStructures(authUserId: string, email: string, fullName?: string | null): Promise<ReportingStructureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpReportingStructures.listByOrganization(context.organizationId)).map((r) => mapReportingStructureSummary(r, maps));
    }

    async createReportingStructure(authUserId: string, email: string, input: CreateReportingStructureInput, fullName?: string | null): Promise<ReportingStructureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpReportingStructures.create(buildReportingStructurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reportingStructures");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "reporting_structure", "create", `ReportingStructure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReportingStructureSummary(created, maps);
    }

    async getInvitations(authUserId: string, email: string, fullName?: string | null): Promise<InvitationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpInvitations.listByOrganization(context.organizationId)).map((r) => mapInvitationSummary(r, maps));
    }

    async createInvitation(authUserId: string, email: string, input: CreateInvitationInput, fullName?: string | null): Promise<InvitationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpInvitations.create(buildInvitationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create invitations");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "invitation", "create", `Invitation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInvitationSummary(created, maps);
    }

    async getBulkInviteBatches(authUserId: string, email: string, fullName?: string | null): Promise<BulkInviteBatchSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpBulkInviteBatches.listByOrganization(context.organizationId)).map((r) => mapBulkInviteBatchSummary(r, maps));
    }

    async createBulkInviteBatch(authUserId: string, email: string, input: CreateBulkInviteBatchInput, fullName?: string | null): Promise<BulkInviteBatchSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpBulkInviteBatches.create(buildBulkInviteBatchPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create bulkInviteBatches");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "bulk_invite_batch", "create", `BulkInviteBatch created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBulkInviteBatchSummary(created, maps);
    }

    async getInvitationRoles(authUserId: string, email: string, fullName?: string | null): Promise<InvitationRoleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpInvitationRoles.listByOrganization(context.organizationId)).map((r) => mapInvitationRoleSummary(r, maps));
    }

    async createInvitationRole(authUserId: string, email: string, input: CreateInvitationRoleInput, fullName?: string | null): Promise<InvitationRoleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpInvitationRoles.create(buildInvitationRolePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create invitationRoles");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "invitation_role", "create", `InvitationRole created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInvitationRoleSummary(created, maps);
    }

    async getInvitationAudit(authUserId: string, email: string, fullName?: string | null): Promise<InvitationAuditSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpInvitationAudit.listByOrganization(context.organizationId)).map((r) => mapInvitationAuditSummary(r, maps));
    }

    async createInvitationAudit(authUserId: string, email: string, input: CreateInvitationAuditInput, fullName?: string | null): Promise<InvitationAuditSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpInvitationAudit.create(buildInvitationAuditPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create invitationAudit");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "invitation_audit", "create", `InvitationAudit created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInvitationAuditSummary(created, maps);
    }

    async getLoginHistory(authUserId: string, email: string, fullName?: string | null): Promise<LoginHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpLoginHistory.listByOrganization(context.organizationId)).map((r) => mapLoginHistorySummary(r, maps));
    }

    async createLoginHistory(authUserId: string, email: string, input: CreateLoginHistoryInput, fullName?: string | null): Promise<LoginHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpLoginHistory.create(buildLoginHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create loginHistory");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "login_history", "create", `LoginHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLoginHistorySummary(created, maps);
    }

    async getSecurityAlerts(authUserId: string, email: string, fullName?: string | null): Promise<SecurityAlertSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpSecurityAlerts.listByOrganization(context.organizationId)).map((r) => mapSecurityAlertSummary(r, maps));
    }

    async createSecurityAlert(authUserId: string, email: string, input: CreateSecurityAlertInput, fullName?: string | null): Promise<SecurityAlertSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpSecurityAlerts.create(buildSecurityAlertPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create securityAlerts");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "security_alert", "create", `SecurityAlert created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecurityAlertSummary(created, maps);
    }

    async getRiskEvents(authUserId: string, email: string, fullName?: string | null): Promise<RiskEventSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpRiskEvents.listByOrganization(context.organizationId)).map((r) => mapRiskEventSummary(r, maps));
    }

    async createRiskEvent(authUserId: string, email: string, input: CreateRiskEventInput, fullName?: string | null): Promise<RiskEventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpRiskEvents.create(buildRiskEventPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create riskEvents");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "risk_event", "create", `RiskEvent created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskEventSummary(created, maps);
    }

    async getPasswordPolicies(authUserId: string, email: string, fullName?: string | null): Promise<PasswordPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpPasswordPolicies.listByOrganization(context.organizationId)).map((r) => mapPasswordPolicySummary(r, maps));
    }

    async createPasswordPolicy(authUserId: string, email: string, input: CreatePasswordPolicyInput, fullName?: string | null): Promise<PasswordPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpPasswordPolicies.create(buildPasswordPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create passwordPolicies");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "password_policy", "create", `PasswordPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPasswordPolicySummary(created, maps);
    }

    async getAdminMetrics(authUserId: string, email: string, fullName?: string | null): Promise<AdminMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.idpAdminMetrics.listByOrganization(context.organizationId)).map(mapAdminMetricSummary);
    }

    async createAdminMetric(authUserId: string, email: string, input: CreateAdminMetricInput, fullName?: string | null): Promise<AdminMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpAdminMetrics.create(buildAdminMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create adminMetrics");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "admin_metric", "create", `AdminMetric created`, created.id));
        return mapAdminMetricSummary(created);
    }

    async getIdentityHealth(authUserId: string, email: string, fullName?: string | null): Promise<IdentityHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.idpIdentityHealth.listByOrganization(context.organizationId)).map(mapIdentityHealthSummary);
    }

    async createIdentityHealth(authUserId: string, email: string, input: CreateIdentityHealthInput, fullName?: string | null): Promise<IdentityHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpIdentityHealth.create(buildIdentityHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create identityHealth");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "identity_health", "create", `IdentityHealth created`, created.id));
        return mapIdentityHealthSummary(created);
    }

    async getCompromisedAccounts(authUserId: string, email: string, fullName?: string | null): Promise<CompromisedAccountSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.idpCompromisedAccounts.listByOrganization(context.organizationId)).map((r) => mapCompromisedAccountSummary(r, maps));
    }

    async createCompromisedAccount(authUserId: string, email: string, input: CreateCompromisedAccountInput, fullName?: string | null): Promise<CompromisedAccountSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.idpCompromisedAccounts.create(buildCompromisedAccountPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create compromisedAccounts");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "compromised_account", "create", `CompromisedAccount created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCompromisedAccountSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.idpAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getRealmOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.idpRealms.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.realm_name }));
    }

    async sdkProvisionRealm(authUserId: string, email: string, input: IdpSdkProvisionRealmInput, fullName?: string | null): Promise<IdpSdkProvisionRealmResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.realmName, limit: 5 });
        const task = await ai.executeTask({ taskType: "provision_realm", moduleSource: "enterprise_identity", inputPayload: { realmKey: input.realmKey, realmName: input.realmName } });
        const realm = await this.createRealm(authUserId, email, { realmKey: input.realmKey, realmName: input.realmName, summary: input.summary }, fullName);
        const provider = await this.createProvider(authUserId, email, { realmId: realm.id, providerKey: `${input.realmKey}-local`, providerType: input.providerType ?? "local", displayName: `${input.realmName} Local` }, fullName);
        return { realmId: realm.id, realmKey: realm.realmKey, providerId: provider.id, aiTaskId: task?.taskId ?? null };
    }

    async sdkEnrollMfa(authUserId: string, email: string, input: IdpSdkEnrollMfaInput, fullName?: string | null): Promise<IdpSdkEnrollMfaResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.mfaType, limit: 3 });
        await ai.executeTask({ taskType: "enroll_mfa", moduleSource: "enterprise_identity", inputPayload: { realmId: input.realmId, mfaType: input.mfaType } });
        const created = await this.createMfaEnrollment(authUserId, email, { realmId: input.realmId, enrollmentKey: input.enrollmentKey, mfaType: input.mfaType }, fullName);
        return { enrollmentId: created.id, enrollmentKey: created.enrollmentKey, mfaType: created.mfaType, status: created.status };
    }

    async sdkInviteUser(authUserId: string, email: string, input: IdpSdkInviteUserInput, fullName?: string | null): Promise<IdpSdkInviteUserResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.email, limit: 3 });
        await ai.executeTask({ taskType: "invite_user", moduleSource: "enterprise_identity", inputPayload: { realmId: input.realmId, email: input.email, roleName: input.roleName } });
        const created = await this.createInvitation(authUserId, email, { realmId: input.realmId, invitationKey: input.invitationKey, email: input.email, roleName: input.roleName }, fullName);
        return { invitationId: created.id, invitationKey: created.invitationKey, email: created.email, status: created.status };
    }
}

export const enterpriseIdentityService = new EnterpriseIdentityService();
