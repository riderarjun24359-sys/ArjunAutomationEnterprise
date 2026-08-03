import { z } from "zod";

export const realmFormSchema = z.object({
    realmKey: z.string().min(2),
    realmName: z.string().min(2),
    summary: z.string().optional(),
});

export const providerFormSchema = z.object({
    realmId: z.string().min(1),
    providerKey: z.string().min(2),
    providerType: z.string().min(2).optional(),
    displayName: z.string().min(2).optional(),
});

export const samlConfigFormSchema = z.object({
    realmId: z.string().min(1),
    configKey: z.string().min(2),
    entityId: z.string().min(2).optional(),
    ssoUrl: z.string().min(2).optional(),
});

export const oidcConfigFormSchema = z.object({
    realmId: z.string().min(1),
    configKey: z.string().min(2),
    clientId: z.string().min(2).optional(),
    issuerUrl: z.string().min(2).optional(),
});

export const mfaPolicyFormSchema = z.object({
    realmId: z.string().min(1),
    policyKey: z.string().min(2),
    name: z.string().min(2).optional(),
    gracePeriodDays: z.number().optional(),
});

export const mfaEnrollmentFormSchema = z.object({
    realmId: z.string().min(1),
    enrollmentKey: z.string().min(2),
    mfaType: z.string().min(2).optional(),
});

export const backupCodeFormSchema = z.object({
    realmId: z.string().min(1),
    codeKey: z.string().min(2),
});

export const trustedDeviceFormSchema = z.object({
    realmId: z.string().min(1),
    deviceKey: z.string().min(2),
    deviceName: z.string().min(2).optional(),
});

export const sessionPolicyFormSchema = z.object({
    realmId: z.string().min(1),
    policyKey: z.string().min(2),
    name: z.string().min(2).optional(),
    idleTimeoutMinutes: z.number().optional(),
});

export const activeSessionFormSchema = z.object({
    realmId: z.string().min(1),
    sessionKey: z.string().min(2),
    deviceName: z.string().min(2).optional(),
});

export const deviceRegistryFormSchema = z.object({
    realmId: z.string().min(1),
    deviceKey: z.string().min(2),
    deviceName: z.string().min(2).optional(),
    deviceType: z.string().min(2).optional(),
});

export const concurrentLoginPolicyFormSchema = z.object({
    realmId: z.string().min(1),
    policyKey: z.string().min(2),
    maxConcurrentSessions: z.number().optional(),
});

export const rbacRoleFormSchema = z.object({
    realmId: z.string().min(1),
    roleKey: z.string().min(2),
    roleName: z.string().min(2).optional(),
});

export const permissionGroupFormSchema = z.object({
    realmId: z.string().min(1),
    groupKey: z.string().min(2),
    groupName: z.string().min(2).optional(),
});

export const abacPolicyFormSchema = z.object({
    realmId: z.string().min(1),
    policyKey: z.string().min(2),
    name: z.string().min(2).optional(),
    effect: z.string().min(2).optional(),
});

export const temporaryAccessGrantFormSchema = z.object({
    realmId: z.string().min(1),
    grantKey: z.string().min(2),
    expiresAt: z.string().min(2).optional(),
});

export const departmentFormSchema = z.object({
    realmId: z.string().min(1),
    departmentKey: z.string().min(2),
    name: z.string().min(2).optional(),
});

export const teamFormSchema = z.object({
    realmId: z.string().min(1),
    teamKey: z.string().min(2),
    name: z.string().min(2).optional(),
});

export const businessUnitFormSchema = z.object({
    realmId: z.string().min(1),
    unitKey: z.string().min(2),
    name: z.string().min(2).optional(),
    code: z.string().min(2).optional(),
});

export const reportingStructureFormSchema = z.object({
    realmId: z.string().min(1),
    structureKey: z.string().min(2),
});

export const invitationFormSchema = z.object({
    realmId: z.string().min(1),
    invitationKey: z.string().min(2),
    email: z.string().min(2),
    roleName: z.string().min(2).optional(),
});

export const bulkInviteBatchFormSchema = z.object({
    realmId: z.string().min(1),
    batchKey: z.string().min(2),
    name: z.string().min(2).optional(),
    totalCount: z.number().optional(),
});

export const invitationRoleFormSchema = z.object({
    realmId: z.string().min(1),
    roleAssignmentKey: z.string().min(2),
});

export const invitationAuditFormSchema = z.object({
    realmId: z.string().min(1),
    auditKey: z.string().min(2),
    action: z.string().min(2).optional(),
});

export const loginHistoryFormSchema = z.object({
    realmId: z.string().min(1),
    loginKey: z.string().min(2),
    loginMethod: z.string().min(2).optional(),
});

export const securityAlertFormSchema = z.object({
    realmId: z.string().min(1),
    alertKey: z.string().min(2),
    alertType: z.string().min(2).optional(),
    severity: z.string().min(2).optional(),
    title: z.string().min(2).optional(),
});

export const riskEventFormSchema = z.object({
    realmId: z.string().min(1),
    eventKey: z.string().min(2),
    riskScore: z.number().optional(),
});

export const passwordPolicyFormSchema = z.object({
    realmId: z.string().min(1),
    policyKey: z.string().min(2),
    name: z.string().min(2).optional(),
    minLength: z.number().optional(),
});

export const adminMetricFormSchema = z.object({
    metricsKey: z.string().min(2),
    totalUsers: z.number().optional(),
    mfaAdoptionPercent: z.number().optional(),
});

export const identityHealthFormSchema = z.object({
    healthKey: z.string().min(2),
    overallScore: z.number().optional(),
});

export const compromisedAccountFormSchema = z.object({
    realmId: z.string().min(1),
    accountKey: z.string().min(2),
});

export type RealmFormValues = z.infer<typeof realmFormSchema>;
export type ProviderFormValues = z.infer<typeof providerFormSchema>;
export type SamlConfigFormValues = z.infer<typeof samlConfigFormSchema>;
export type OidcConfigFormValues = z.infer<typeof oidcConfigFormSchema>;
export type MfaPolicyFormValues = z.infer<typeof mfaPolicyFormSchema>;
export type MfaEnrollmentFormValues = z.infer<typeof mfaEnrollmentFormSchema>;
export type BackupCodeFormValues = z.infer<typeof backupCodeFormSchema>;
export type TrustedDeviceFormValues = z.infer<typeof trustedDeviceFormSchema>;
export type SessionPolicyFormValues = z.infer<typeof sessionPolicyFormSchema>;
export type ActiveSessionFormValues = z.infer<typeof activeSessionFormSchema>;
export type DeviceRegistryFormValues = z.infer<typeof deviceRegistryFormSchema>;
export type ConcurrentLoginPolicyFormValues = z.infer<typeof concurrentLoginPolicyFormSchema>;
export type RbacRoleFormValues = z.infer<typeof rbacRoleFormSchema>;
export type PermissionGroupFormValues = z.infer<typeof permissionGroupFormSchema>;
export type AbacPolicyFormValues = z.infer<typeof abacPolicyFormSchema>;
export type TemporaryAccessGrantFormValues = z.infer<typeof temporaryAccessGrantFormSchema>;
export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
export type TeamFormValues = z.infer<typeof teamFormSchema>;
export type BusinessUnitFormValues = z.infer<typeof businessUnitFormSchema>;
export type ReportingStructureFormValues = z.infer<typeof reportingStructureFormSchema>;
export type InvitationFormValues = z.infer<typeof invitationFormSchema>;
export type BulkInviteBatchFormValues = z.infer<typeof bulkInviteBatchFormSchema>;
export type InvitationRoleFormValues = z.infer<typeof invitationRoleFormSchema>;
export type InvitationAuditFormValues = z.infer<typeof invitationAuditFormSchema>;
export type LoginHistoryFormValues = z.infer<typeof loginHistoryFormSchema>;
export type SecurityAlertFormValues = z.infer<typeof securityAlertFormSchema>;
export type RiskEventFormValues = z.infer<typeof riskEventFormSchema>;
export type PasswordPolicyFormValues = z.infer<typeof passwordPolicyFormSchema>;
export type AdminMetricFormValues = z.infer<typeof adminMetricFormSchema>;
export type IdentityHealthFormValues = z.infer<typeof identityHealthFormSchema>;
export type CompromisedAccountFormValues = z.infer<typeof compromisedAccountFormSchema>;
