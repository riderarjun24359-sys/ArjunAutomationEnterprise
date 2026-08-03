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
import type {
    IdpDashboardStats,
    IdpPipelineInfo,
    RealmSummary,
    CreateRealmInput,
    AuditEntry,
    AdminMetricSummary,
    CreateAdminMetricInput,
    IdentityHealthSummary,
    CreateIdentityHealthInput,
    ProviderSummary,
    CreateProviderInput,
    SamlConfigSummary,
    CreateSamlConfigInput,
    OidcConfigSummary,
    CreateOidcConfigInput,
    MfaPolicySummary,
    CreateMfaPolicyInput,
    MfaEnrollmentSummary,
    CreateMfaEnrollmentInput,
    BackupCodeSummary,
    CreateBackupCodeInput,
    TrustedDeviceSummary,
    CreateTrustedDeviceInput,
    SessionPolicySummary,
    CreateSessionPolicyInput,
    ActiveSessionSummary,
    CreateActiveSessionInput,
    DeviceRegistrySummary,
    CreateDeviceRegistryInput,
    ConcurrentLoginPolicySummary,
    CreateConcurrentLoginPolicyInput,
    RbacRoleSummary,
    CreateRbacRoleInput,
    PermissionGroupSummary,
    CreatePermissionGroupInput,
    AbacPolicySummary,
    CreateAbacPolicyInput,
    TemporaryAccessGrantSummary,
    CreateTemporaryAccessGrantInput,
    DepartmentSummary,
    CreateDepartmentInput,
    TeamSummary,
    CreateTeamInput,
    BusinessUnitSummary,
    CreateBusinessUnitInput,
    ReportingStructureSummary,
    CreateReportingStructureInput,
    InvitationSummary,
    CreateInvitationInput,
    BulkInviteBatchSummary,
    CreateBulkInviteBatchInput,
    InvitationRoleSummary,
    CreateInvitationRoleInput,
    InvitationAuditSummary,
    CreateInvitationAuditInput,
    LoginHistorySummary,
    CreateLoginHistoryInput,
    SecurityAlertSummary,
    CreateSecurityAlertInput,
    RiskEventSummary,
    CreateRiskEventInput,
    PasswordPolicySummary,
    CreatePasswordPolicyInput,
    CompromisedAccountSummary,
    CreateCompromisedAccountInput,
} from "@/src/modules/enterprise-identity/types";

type LookupMaps = { realms: Map<string, DbIdpRealm> };

export const buildRealmLookupMaps = (realms: DbIdpRealm[]): LookupMaps => ({
    realms: new Map(realms.map((item) => [item.id, item])),
});

const realmName = (maps: LookupMaps, id?: string | null) => (id ? maps.realms.get(id)?.realm_name ?? null : null);

export const mapRealmSummary = (record: DbIdpRealm): RealmSummary => ({
    id: record.id,
    realmName: record.realm_name,
    realmKey: record.realm_key,
    summaryPreview: record.summary.slice(0, 120),
    status: record.status,
    updatedAt: record.updated_at,
});

export const mapAuditEntry = (record: DbIdpAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    securityLevel: record.security_level,
    createdAt: record.created_at,
});

export const mapAdminMetricSummary = (record: DbIdpAdminMetric): AdminMetricSummary => ({
    id: record.id,
    metricsKey: record.metrics_key,
    metricDate: record.metric_date,
    totalUsers: record.total_users,
    mfaAdoptionPercent: Number(record.mfa_adoption_percent),
    activeSessions: record.active_sessions,
    failedLogins24h: record.failed_logins_24h,
    pendingInvitations: record.pending_invitations,
    compromisedAccounts: record.compromised_accounts,
    openSecurityAlerts: record.open_security_alerts,
    status: record.status,
});

export const mapIdentityHealthSummary = (record: DbIdpIdentityHealth): IdentityHealthSummary => ({
    id: record.id,
    healthKey: record.health_key,
    overallScore: Number(record.overall_score),
    status: record.status,
});

export const mapProviderSummary = (record: DbIdpProvider, maps: LookupMaps): ProviderSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    providerKey: String(record.provider_key),
    providerType: String(record.provider_type),
    displayName: String(record.display_name),
    status: record.status,
});

export const mapSamlConfigSummary = (record: DbIdpSamlConfig, maps: LookupMaps): SamlConfigSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    configKey: String(record.config_key),
    entityId: String(record.entity_id),
    ssoUrl: String(record.sso_url),
    status: record.status,
});

export const mapOidcConfigSummary = (record: DbIdpOidcConfig, maps: LookupMaps): OidcConfigSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    configKey: String(record.config_key),
    clientId: String(record.client_id),
    issuerUrl: String(record.issuer_url),
    status: record.status,
});

export const mapMfaPolicySummary = (record: DbIdpMfaPolicy, maps: LookupMaps): MfaPolicySummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    policyKey: String(record.policy_key),
    name: String(record.name),
    gracePeriodDays: record.grace_period_days,
    status: record.status,
});

export const mapMfaEnrollmentSummary = (record: DbIdpMfaEnrollment, maps: LookupMaps): MfaEnrollmentSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    enrollmentKey: String(record.enrollment_key),
    mfaType: String(record.mfa_type),
    status: record.status,
});

export const mapBackupCodeSummary = (record: DbIdpBackupCode, maps: LookupMaps): BackupCodeSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    codeKey: String(record.code_key),
    status: record.status,
});

export const mapTrustedDeviceSummary = (record: DbIdpTrustedDevice, maps: LookupMaps): TrustedDeviceSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    deviceKey: String(record.device_key),
    deviceName: String(record.device_name),
    status: record.status,
});

export const mapSessionPolicySummary = (record: DbIdpSessionPolicy, maps: LookupMaps): SessionPolicySummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    policyKey: String(record.policy_key),
    name: String(record.name),
    idleTimeoutMinutes: record.idle_timeout_minutes,
    status: record.status,
});

export const mapActiveSessionSummary = (record: DbIdpActiveSession, maps: LookupMaps): ActiveSessionSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    sessionKey: String(record.session_key),
    deviceName: String(record.device_name),
    ipAddress: String(record.ip_address),
    status: record.status,
});

export const mapDeviceRegistrySummary = (record: DbIdpDeviceRegistry, maps: LookupMaps): DeviceRegistrySummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    deviceKey: String(record.device_key),
    deviceName: String(record.device_name),
    deviceType: String(record.device_type),
    status: record.status,
});

export const mapConcurrentLoginPolicySummary = (record: DbIdpConcurrentLoginPolicy, maps: LookupMaps): ConcurrentLoginPolicySummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    policyKey: String(record.policy_key),
    maxConcurrentSessions: record.max_concurrent_sessions,
    status: record.status,
});

export const mapRbacRoleSummary = (record: DbIdpRbacRole, maps: LookupMaps): RbacRoleSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    roleKey: String(record.role_key),
    roleName: String(record.role_name),
    status: record.status,
});

export const mapPermissionGroupSummary = (record: DbIdpPermissionGroup, maps: LookupMaps): PermissionGroupSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    groupKey: String(record.group_key),
    groupName: String(record.group_name),
    status: record.status,
});

export const mapAbacPolicySummary = (record: DbIdpAbacPolicy, maps: LookupMaps): AbacPolicySummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    policyKey: String(record.policy_key),
    name: String(record.name),
    effect: String(record.effect),
    status: record.status,
});

export const mapTemporaryAccessGrantSummary = (record: DbIdpTemporaryAccessGrant, maps: LookupMaps): TemporaryAccessGrantSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    grantKey: String(record.grant_key),
    expiresAt: String(record.expires_at),
    status: record.status,
});

export const mapDepartmentSummary = (record: DbIdpDepartment, maps: LookupMaps): DepartmentSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    departmentKey: String(record.department_key),
    name: String(record.name),
    status: record.status,
});

export const mapTeamSummary = (record: DbIdpTeam, maps: LookupMaps): TeamSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    teamKey: String(record.team_key),
    name: String(record.name),
    status: record.status,
});

export const mapBusinessUnitSummary = (record: DbIdpBusinessUnit, maps: LookupMaps): BusinessUnitSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    unitKey: String(record.unit_key),
    name: String(record.name),
    code: String(record.code),
    status: record.status,
});

export const mapReportingStructureSummary = (record: DbIdpReportingStructure, maps: LookupMaps): ReportingStructureSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    structureKey: String(record.structure_key),
    effectiveFrom: String(record.effective_from),
    status: record.status,
});

export const mapInvitationSummary = (record: DbIdpInvitation, maps: LookupMaps): InvitationSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    invitationKey: String(record.invitation_key),
    email: String(record.email),
    roleName: String(record.role_name),
    status: record.status,
});

export const mapBulkInviteBatchSummary = (record: DbIdpBulkInviteBatch, maps: LookupMaps): BulkInviteBatchSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    batchKey: String(record.batch_key),
    name: String(record.name),
    totalCount: record.total_count,
    sentCount: record.sent_count,
    status: record.status,
});

export const mapInvitationRoleSummary = (record: DbIdpInvitationRole, maps: LookupMaps): InvitationRoleSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    roleAssignmentKey: String(record.role_assignment_key),
    status: record.status,
});

export const mapInvitationAuditSummary = (record: DbIdpInvitationAudit, maps: LookupMaps): InvitationAuditSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    auditKey: String(record.audit_key),
    action: String(record.action),
    status: record.status,
});

export const mapLoginHistorySummary = (record: DbIdpLoginHistory, maps: LookupMaps): LoginHistorySummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    loginKey: String(record.login_key),
    loginMethod: String(record.login_method),
    success: record.success,
    loggedAt: String(record.logged_at),
});

export const mapSecurityAlertSummary = (record: DbIdpSecurityAlert, maps: LookupMaps): SecurityAlertSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    alertKey: String(record.alert_key),
    alertType: String(record.alert_type),
    severity: String(record.severity),
    title: String(record.title),
    status: record.status,
});

export const mapRiskEventSummary = (record: DbIdpRiskEvent, maps: LookupMaps): RiskEventSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    eventKey: String(record.event_key),
    riskScore: Number(record.risk_score),
    actionTaken: String(record.action_taken),
    status: record.status,
});

export const mapPasswordPolicySummary = (record: DbIdpPasswordPolicy, maps: LookupMaps): PasswordPolicySummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    policyKey: String(record.policy_key),
    name: String(record.name),
    minLength: record.min_length,
    status: record.status,
});

export const mapCompromisedAccountSummary = (record: DbIdpCompromisedAccount, maps: LookupMaps): CompromisedAccountSummary => ({
    id: record.id,
    realmName: realmName(maps, record.realm_id) ?? "",
    accountKey: String(record.account_key),
    remediationStatus: String(record.remediation_status),
    status: record.status,
});

export const buildIdpDashboardStats = (input: {
    realms: RealmSummary[];
    providers: unknown[];
    mfaEnrollments: unknown[];
    activeSessions: unknown[];
    invitations: { status: string }[];
    securityAlerts: { status: string }[];
    compromisedAccounts: unknown[];
    adminMetrics: AdminMetricSummary[];
    auditLogs: unknown[];
}): IdpDashboardStats => {
    const mfaAdoption = input.adminMetrics.length
        ? input.adminMetrics.reduce((s, m) => s + m.mfaAdoptionPercent, 0) / input.adminMetrics.length
        : 0;
    const failedLogins = input.adminMetrics.length
        ? input.adminMetrics.reduce((s, m) => s + m.failedLogins24h, 0) / input.adminMetrics.length
        : 0;
    return {
        totalRealms: input.realms.length,
        activeRealms: input.realms.filter((r) => r.status === "active").length,
        providerCount: input.providers.length,
        mfaEnrollmentCount: input.mfaEnrollments.length,
        activeSessionCount: input.activeSessions.length,
        pendingInvitationCount: input.invitations.filter((i) => i.status === "pending").length,
        openSecurityAlertCount: input.securityAlerts.filter((a) => a.status === "open").length,
        compromisedAccountCount: input.compromisedAccounts.length,
        mfaAdoptionPercent: mfaAdoption,
        failedLogins24h: failedLogins,
        auditCount: input.auditLogs.length,
    };
};

export const buildIdpPipelineInfo = (): IdpPipelineInfo => ({
    stages: [
        { key: "realm_setup", label: "Realm Setup" },
        { key: "provider_config", label: "Provider Configuration" },
        { key: "mfa_policy", label: "MFA Policy" },
        { key: "rbac_setup", label: "RBAC Setup" },
        { key: "invitation", label: "User Invitation" },
        { key: "active", label: "Active Identity" },
    ],
    currentStage: "provider_config",
    nextStage: "mfa_policy",
    previousStage: "realm_setup",
});

export const buildRealmPayload = (organizationId: string, input: CreateRealmInput) => ({
    organization_id: organizationId,
    realm_key: input.realmKey,
    realm_name: input.realmName,
    summary: input.summary ?? "",
});

export const buildAdminMetricPayload = (organizationId: string, input: CreateAdminMetricInput) => ({
    organization_id: organizationId,
    metrics_key: input.metricsKey,
    metric_date: input.metricDate ?? new Date().toISOString().slice(0, 10),
    total_users: input.totalUsers ?? 0,
    mfa_adoption_percent: input.mfaAdoptionPercent ?? 0,
    active_sessions: input.activeSessions ?? 0,
    failed_logins_24h: input.failedLogins24h ?? 0,
    pending_invitations: input.pendingInvitations ?? 0,
    compromised_accounts: input.compromisedAccounts ?? 0,
    open_security_alerts: input.openSecurityAlerts ?? 0,
});

export const buildIdentityHealthPayload = (organizationId: string, input: CreateIdentityHealthInput) => ({
    organization_id: organizationId,
    health_key: input.healthKey,
    overall_score: input.overallScore ?? 0,
});

export const buildIdpAuditPayload = (
    organizationId: string,
    entityType: string,
    action: string,
    summary: string,
    entityId?: string,
    securityLevel: string = "standard",
) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    security_level: securityLevel,
});

export const buildProviderPayload = (organizationId: string, input: CreateProviderInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    provider_key: input.providerKey ?? "",
    provider_type: input.providerType ?? "local",
    display_name: input.displayName ?? "",
});

export const buildSamlConfigPayload = (organizationId: string, input: CreateSamlConfigInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    config_key: input.configKey ?? "",
    entity_id: input.entityId ?? "",
    sso_url: input.ssoUrl ?? "",
});

export const buildOidcConfigPayload = (organizationId: string, input: CreateOidcConfigInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    config_key: input.configKey ?? "",
    client_id: input.clientId ?? "",
    issuer_url: input.issuerUrl ?? "",
});

export const buildMfaPolicyPayload = (organizationId: string, input: CreateMfaPolicyInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    policy_key: input.policyKey ?? "",
    name: input.name ?? "",
    grace_period_days: input.gracePeriodDays ?? 7,
});

export const buildMfaEnrollmentPayload = (organizationId: string, input: CreateMfaEnrollmentInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    enrollment_key: input.enrollmentKey ?? "",
    user_id: input.userId ?? null,
    mfa_type: input.mfaType ?? "authenticator",
});

export const buildBackupCodePayload = (organizationId: string, input: CreateBackupCodeInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    code_key: input.codeKey ?? "",
    user_id: input.userId ?? null,
});

export const buildTrustedDevicePayload = (organizationId: string, input: CreateTrustedDeviceInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    device_key: input.deviceKey ?? "",
    user_id: input.userId ?? null,
    device_name: input.deviceName ?? "",
});

export const buildSessionPolicyPayload = (organizationId: string, input: CreateSessionPolicyInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    policy_key: input.policyKey ?? "",
    name: input.name ?? "",
    idle_timeout_minutes: input.idleTimeoutMinutes ?? 30,
});

export const buildActiveSessionPayload = (organizationId: string, input: CreateActiveSessionInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    session_key: input.sessionKey ?? "",
    user_id: input.userId ?? null,
    device_name: input.deviceName ?? "",
});

export const buildDeviceRegistryPayload = (organizationId: string, input: CreateDeviceRegistryInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    device_key: input.deviceKey ?? "",
    device_name: input.deviceName ?? "",
    device_type: input.deviceType ?? "desktop",
});

export const buildConcurrentLoginPolicyPayload = (organizationId: string, input: CreateConcurrentLoginPolicyInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    policy_key: input.policyKey ?? "",
    max_concurrent_sessions: input.maxConcurrentSessions ?? 3,
});

export const buildRbacRolePayload = (organizationId: string, input: CreateRbacRoleInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    role_key: input.roleKey ?? "",
    role_name: input.roleName ?? "",
});

export const buildPermissionGroupPayload = (organizationId: string, input: CreatePermissionGroupInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    group_key: input.groupKey ?? "",
    group_name: input.groupName ?? "",
});

export const buildAbacPolicyPayload = (organizationId: string, input: CreateAbacPolicyInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    policy_key: input.policyKey ?? "",
    name: input.name ?? "",
    effect: input.effect ?? "allow",
});

export const buildTemporaryAccessGrantPayload = (organizationId: string, input: CreateTemporaryAccessGrantInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    grant_key: input.grantKey ?? "",
    user_id: input.userId ?? null,
    expires_at: input.expiresAt ?? new Date(Date.now() + 86400000).toISOString(),
});

export const buildDepartmentPayload = (organizationId: string, input: CreateDepartmentInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    department_key: input.departmentKey ?? "",
    name: input.name ?? "",
});

export const buildTeamPayload = (organizationId: string, input: CreateTeamInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    team_key: input.teamKey ?? "",
    name: input.name ?? "",
});

export const buildBusinessUnitPayload = (organizationId: string, input: CreateBusinessUnitInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    unit_key: input.unitKey ?? "",
    name: input.name ?? "",
    code: input.code ?? "",
});

export const buildReportingStructurePayload = (organizationId: string, input: CreateReportingStructureInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    structure_key: input.structureKey ?? "",
    employee_user_id: input.employeeUserId ?? null,
    manager_user_id: input.managerUserId ?? null,
});

export const buildInvitationPayload = (organizationId: string, input: CreateInvitationInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    invitation_key: input.invitationKey ?? "",
    email: input.email ?? "",
    role_name: input.roleName ?? "",
    expires_at: input.expiresAt ?? new Date(Date.now() + 604800000).toISOString(),
});

export const buildBulkInviteBatchPayload = (organizationId: string, input: CreateBulkInviteBatchInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    batch_key: input.batchKey ?? "",
    name: input.name ?? "",
    total_count: input.totalCount ?? 0,
});

export const buildInvitationRolePayload = (organizationId: string, input: CreateInvitationRoleInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    role_assignment_key: input.roleAssignmentKey ?? "",
    invitation_id: input.invitationId ?? null,
    role_id: input.roleId ?? null,
});

export const buildInvitationAuditPayload = (organizationId: string, input: CreateInvitationAuditInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    audit_key: input.auditKey ?? "",
    invitation_id: input.invitationId ?? null,
    action: input.action ?? "",
});

export const buildLoginHistoryPayload = (organizationId: string, input: CreateLoginHistoryInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    login_key: input.loginKey ?? "",
    user_id: input.userId ?? null,
    login_method: input.loginMethod ?? "password",
    success: input.success ?? true,
});

export const buildSecurityAlertPayload = (organizationId: string, input: CreateSecurityAlertInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    alert_key: input.alertKey ?? "",
    alert_type: input.alertType ?? "",
    severity: input.severity ?? "medium",
    title: input.title ?? "",
});

export const buildRiskEventPayload = (organizationId: string, input: CreateRiskEventInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    event_key: input.eventKey ?? "",
    user_id: input.userId ?? null,
    risk_score: input.riskScore ?? 0,
});

export const buildPasswordPolicyPayload = (organizationId: string, input: CreatePasswordPolicyInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    policy_key: input.policyKey ?? "",
    name: input.name ?? "",
    min_length: input.minLength ?? 12,
});

export const buildCompromisedAccountPayload = (organizationId: string, input: CreateCompromisedAccountInput) => ({
    organization_id: organizationId,
    realm_id: input.realmId,
    account_key: input.accountKey ?? "",
    user_id: input.userId ?? null,
});
