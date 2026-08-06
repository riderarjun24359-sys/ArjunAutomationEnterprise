import type {
    DbActivityLog,
    DbAixComplianceWarning,
    DbBackupConfig,
    DbBackupRun,
    DbDdDisasterRecoveryPlan,
    DbElrComplianceReview,
    DbIdpActiveSession,
    DbIdpAuditLog,
    DbIdpIdentityHealth,
    DbIdpMfaEnrollment,
    DbIdpMfaPolicy,
    DbIdpPermissionGroup,
    DbIdpRbacRole,
    DbIdpRiskEvent,
    DbIdpSecurityAlert,
    DbIdpSessionPolicy,
    DbIntgApiKey,
    DbIntgRateLimit,
    DbPermission,
    DbRole,
    DbRolePermissionGrant,
} from "@/src/modules/database/types/platform";

export interface SecurityCenterRawData {
    organizationId: string;
    roles: DbRole[];
    permissions: DbPermission[];
    roleGrants: DbRolePermissionGrant[];
    idpRbacRoles: DbIdpRbacRole[];
    idpPermissionGroups: DbIdpPermissionGroup[];
    mfaPolicies: DbIdpMfaPolicy[];
    mfaEnrollments: DbIdpMfaEnrollment[];
    sessionPolicies: DbIdpSessionPolicy[];
    activeSessions: DbIdpActiveSession[];
    securityAlerts: DbIdpSecurityAlert[];
    riskEvents: DbIdpRiskEvent[];
    identityHealth: DbIdpIdentityHealth[];
    idpAuditLogs: DbIdpAuditLog[];
    activityLogs: DbActivityLog[];
    apiKeys: DbIntgApiKey[];
    rateLimits: DbIntgRateLimit[];
    backupConfigs: DbBackupConfig[];
    backupRuns: DbBackupRun[];
    disasterPlans: DbDdDisasterRecoveryPlan[];
    complianceReviews: DbElrComplianceReview[];
    complianceWarnings: DbAixComplianceWarning[];
    fetchedAt: string;
}
