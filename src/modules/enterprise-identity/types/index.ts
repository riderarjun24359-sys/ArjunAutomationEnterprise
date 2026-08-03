export interface IdpDashboardStats {
    totalRealms: number;
    activeRealms: number;
    providerCount: number;
    mfaEnrollmentCount: number;
    activeSessionCount: number;
    pendingInvitationCount: number;
    openSecurityAlertCount: number;
    compromisedAccountCount: number;
    mfaAdoptionPercent: number;
    failedLogins24h: number;
    auditCount: number;
}

export interface IdpPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface RealmSummary {
    id: string;
    realmName: string;
    realmKey: string;
    summaryPreview: string;
    status: string;
    updatedAt: string;
}

export interface CreateRealmInput {
    realmKey: string;
    realmName: string;
    summary?: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface AdminMetricSummary {
    id: string;
    metricsKey: string;
    metricDate: string;
    totalUsers: number;
    mfaAdoptionPercent: number;
    activeSessions: number;
    failedLogins24h: number;
    pendingInvitations: number;
    compromisedAccounts: number;
    openSecurityAlerts: number;
    status: string;
}

export interface CreateAdminMetricInput {
    metricsKey: string;
    metricDate?: string;
    totalUsers?: number;
    mfaAdoptionPercent?: number;
    activeSessions?: number;
    failedLogins24h?: number;
    pendingInvitations?: number;
    compromisedAccounts?: number;
    openSecurityAlerts?: number;
}

export interface IdentityHealthSummary {
    id: string;
    healthKey: string;
    overallScore: number;
    status: string;
}

export interface CreateIdentityHealthInput {
    healthKey: string;
    overallScore?: number;
}

export interface ProviderSummary {
    id: string;
    realmName: string;
    providerKey: string;
    providerType: string;
    displayName: string;
    status: string;
}

export interface CreateProviderInput {
    realmId: string;
    providerKey?: string;
    providerType?: string;
    displayName?: string;
}

export interface SamlConfigSummary {
    id: string;
    realmName: string;
    configKey: string;
    entityId: string;
    ssoUrl: string;
    status: string;
}

export interface CreateSamlConfigInput {
    realmId: string;
    configKey?: string;
    entityId?: string;
    ssoUrl?: string;
}

export interface OidcConfigSummary {
    id: string;
    realmName: string;
    configKey: string;
    clientId: string;
    issuerUrl: string;
    status: string;
}

export interface CreateOidcConfigInput {
    realmId: string;
    configKey?: string;
    clientId?: string;
    issuerUrl?: string;
}

export interface MfaPolicySummary {
    id: string;
    realmName: string;
    policyKey: string;
    name: string;
    gracePeriodDays: number;
    status: string;
}

export interface CreateMfaPolicyInput {
    realmId: string;
    policyKey?: string;
    name?: string;
    gracePeriodDays?: number;
}

export interface MfaEnrollmentSummary {
    id: string;
    realmName: string;
    enrollmentKey: string;
    mfaType: string;
    status: string;
}

export interface CreateMfaEnrollmentInput {
    realmId: string;
    enrollmentKey?: string;
    userId?: string;
    mfaType?: string;
}

export interface BackupCodeSummary {
    id: string;
    realmName: string;
    codeKey: string;
    status: string;
}

export interface CreateBackupCodeInput {
    realmId: string;
    codeKey?: string;
    userId?: string;
}

export interface TrustedDeviceSummary {
    id: string;
    realmName: string;
    deviceKey: string;
    deviceName: string;
    status: string;
}

export interface CreateTrustedDeviceInput {
    realmId: string;
    deviceKey?: string;
    userId?: string;
    deviceName?: string;
}

export interface SessionPolicySummary {
    id: string;
    realmName: string;
    policyKey: string;
    name: string;
    idleTimeoutMinutes: number;
    status: string;
}

export interface CreateSessionPolicyInput {
    realmId: string;
    policyKey?: string;
    name?: string;
    idleTimeoutMinutes?: number;
}

export interface ActiveSessionSummary {
    id: string;
    realmName: string;
    sessionKey: string;
    deviceName: string;
    ipAddress: string;
    status: string;
}

export interface CreateActiveSessionInput {
    realmId: string;
    sessionKey?: string;
    userId?: string;
    deviceName?: string;
}

export interface DeviceRegistrySummary {
    id: string;
    realmName: string;
    deviceKey: string;
    deviceName: string;
    deviceType: string;
    status: string;
}

export interface CreateDeviceRegistryInput {
    realmId: string;
    deviceKey?: string;
    deviceName?: string;
    deviceType?: string;
}

export interface ConcurrentLoginPolicySummary {
    id: string;
    realmName: string;
    policyKey: string;
    maxConcurrentSessions: number;
    status: string;
}

export interface CreateConcurrentLoginPolicyInput {
    realmId: string;
    policyKey?: string;
    maxConcurrentSessions?: number;
}

export interface RbacRoleSummary {
    id: string;
    realmName: string;
    roleKey: string;
    roleName: string;
    status: string;
}

export interface CreateRbacRoleInput {
    realmId: string;
    roleKey?: string;
    roleName?: string;
}

export interface PermissionGroupSummary {
    id: string;
    realmName: string;
    groupKey: string;
    groupName: string;
    status: string;
}

export interface CreatePermissionGroupInput {
    realmId: string;
    groupKey?: string;
    groupName?: string;
}

export interface AbacPolicySummary {
    id: string;
    realmName: string;
    policyKey: string;
    name: string;
    effect: string;
    status: string;
}

export interface CreateAbacPolicyInput {
    realmId: string;
    policyKey?: string;
    name?: string;
    effect?: string;
}

export interface TemporaryAccessGrantSummary {
    id: string;
    realmName: string;
    grantKey: string;
    expiresAt: string;
    status: string;
}

export interface CreateTemporaryAccessGrantInput {
    realmId: string;
    grantKey?: string;
    userId?: string;
    expiresAt?: string;
}

export interface DepartmentSummary {
    id: string;
    realmName: string;
    departmentKey: string;
    name: string;
    status: string;
}

export interface CreateDepartmentInput {
    realmId: string;
    departmentKey?: string;
    name?: string;
}

export interface TeamSummary {
    id: string;
    realmName: string;
    teamKey: string;
    name: string;
    status: string;
}

export interface CreateTeamInput {
    realmId: string;
    teamKey?: string;
    name?: string;
}

export interface BusinessUnitSummary {
    id: string;
    realmName: string;
    unitKey: string;
    name: string;
    code: string;
    status: string;
}

export interface CreateBusinessUnitInput {
    realmId: string;
    unitKey?: string;
    name?: string;
    code?: string;
}

export interface ReportingStructureSummary {
    id: string;
    realmName: string;
    structureKey: string;
    effectiveFrom: string;
    status: string;
}

export interface CreateReportingStructureInput {
    realmId: string;
    structureKey?: string;
    employeeUserId?: string;
    managerUserId?: string;
}

export interface InvitationSummary {
    id: string;
    realmName: string;
    invitationKey: string;
    email: string;
    roleName: string;
    status: string;
}

export interface CreateInvitationInput {
    realmId: string;
    invitationKey?: string;
    email?: string;
    roleName?: string;
    expiresAt?: string;
}

export interface BulkInviteBatchSummary {
    id: string;
    realmName: string;
    batchKey: string;
    name: string;
    totalCount: number;
    sentCount: number;
    status: string;
}

export interface CreateBulkInviteBatchInput {
    realmId: string;
    batchKey?: string;
    name?: string;
    totalCount?: number;
}

export interface InvitationRoleSummary {
    id: string;
    realmName: string;
    roleAssignmentKey: string;
    status: string;
}

export interface CreateInvitationRoleInput {
    realmId: string;
    roleAssignmentKey?: string;
    invitationId?: string;
    roleId?: string;
}

export interface InvitationAuditSummary {
    id: string;
    realmName: string;
    auditKey: string;
    action: string;
    status: string;
}

export interface CreateInvitationAuditInput {
    realmId: string;
    auditKey?: string;
    invitationId?: string;
    action?: string;
}

export interface LoginHistorySummary {
    id: string;
    realmName: string;
    loginKey: string;
    loginMethod: string;
    success: boolean;
    loggedAt: string;
}

export interface CreateLoginHistoryInput {
    realmId: string;
    loginKey?: string;
    userId?: string;
    loginMethod?: string;
    success?: boolean;
}

export interface SecurityAlertSummary {
    id: string;
    realmName: string;
    alertKey: string;
    alertType: string;
    severity: string;
    title: string;
    status: string;
}

export interface CreateSecurityAlertInput {
    realmId: string;
    alertKey?: string;
    alertType?: string;
    severity?: string;
    title?: string;
}

export interface RiskEventSummary {
    id: string;
    realmName: string;
    eventKey: string;
    riskScore: number;
    actionTaken: string;
    status: string;
}

export interface CreateRiskEventInput {
    realmId: string;
    eventKey?: string;
    userId?: string;
    riskScore?: number;
}

export interface PasswordPolicySummary {
    id: string;
    realmName: string;
    policyKey: string;
    name: string;
    minLength: number;
    status: string;
}

export interface CreatePasswordPolicyInput {
    realmId: string;
    policyKey?: string;
    name?: string;
    minLength?: number;
}

export interface CompromisedAccountSummary {
    id: string;
    realmName: string;
    accountKey: string;
    remediationStatus: string;
    status: string;
}

export interface CreateCompromisedAccountInput {
    realmId: string;
    accountKey?: string;
    userId?: string;
}

export interface IdpSdkProvisionRealmInput {
    realmKey: string;
    realmName: string;
    summary?: string;
    providerType?: string;
}

export interface IdpSdkProvisionRealmResult {
    realmId: string;
    realmKey: string;
    providerId: string;
    aiTaskId?: string | null;
}

export interface IdpSdkEnrollMfaInput {
    realmId: string;
    enrollmentKey: string;
    mfaType: string;
}

export interface IdpSdkEnrollMfaResult {
    enrollmentId: string;
    enrollmentKey: string;
    mfaType: string;
    status: string;
}

export interface IdpSdkInviteUserInput {
    realmId: string;
    invitationKey: string;
    email: string;
    roleName?: string;
}

export interface IdpSdkInviteUserResult {
    invitationId: string;
    invitationKey: string;
    email: string;
    status: string;
}
