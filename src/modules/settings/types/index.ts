export type SettingsTab =
    | "overview"
    | "organization"
    | "team"
    | "roles"
    | "branding"
    | "preferences"
    | "security"
    | "audit"
    | "integrations"
    | "notifications"
    | "backup";

export interface OrganizationSettings {
    id: string;
    timezone: string;
    currency: string;
    fiscalYearStart: string;
    contactEmail: string;
    billingAddress: string;
    supportPhone: string;
    featureFlags: Record<string, unknown>;
    updatedAt: string;
}

export interface BrandingSettings {
    id: string;
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    customDomain: string;
    emailHeaderHtml: string;
    updatedAt: string;
}

export interface OrganizationPreferences {
    id: string;
    defaultLocale: string;
    defaultTimezone: string;
    weekStartsOn: string;
    dateFormat: string;
    timeFormat: string;
    updatedAt: string;
}

export interface SecurityPolicy {
    id: string;
    mfaRequired: boolean;
    sessionTimeoutMinutes: number;
    passwordMinLength: number;
    ipAllowlist: string[];
    loginAttemptLimit: number;
    updatedAt: string;
}

export interface AuditConfiguration {
    id: string;
    retentionDays: number;
    enabledEvents: string[];
    exportFormat: string;
    alertThreshold: number;
    updatedAt: string;
}

export interface TeamSummary {
    id: string;
    name: string;
    slug: string;
    description: string;
    memberCount: number;
    updatedAt: string;
}

export interface TeamMemberSummary {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    roleName: string;
    isActive: boolean;
}

export interface OrganizationInvitation {
    id: string;
    email: string;
    roleName: string;
    status: string;
    expiresAt: string;
}

export interface RoleSummary {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
    permissions: string[];
}

export interface UserPreferences {
    id: string;
    theme: string;
    locale: string;
    timezone: string;
    dateFormat: string;
    digestFrequency: string;
    updatedAt: string;
}

export interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    scopes: string[];
    status: "active" | "revoked" | "expired";
    expiresAt: string | null;
    lastUsedAt: string | null;
    updatedAt: string;
}

export interface NotificationPreference {
    id: string;
    channel: "email" | "in_app" | "sms";
    eventType: string;
    enabled: boolean;
    isOrgWide: boolean;
}

export interface BackupRun {
    id: string;
    configId: string;
    status: "pending" | "running" | "completed" | "failed";
    startedAt: string;
    completedAt: string | null;
    sizeBytes: number;
    storagePath: string;
    errorMessage: string;
}

export interface BackupConfig {
    id: string;
    name: string;
    scheduleCron: string;
    destination: string;
    retentionCount: number;
    includeTables: string[];
    isEnabled: boolean;
    runs: BackupRun[];
    updatedAt: string;
}

export interface SettingsDashboardStats {
    teamCount: string;
    memberCount: string;
    pendingInvitations: string;
    activeApiKeys: string;
    backupConfigs: string;
    roleCount: string;
}

export interface UpdateOrganizationSettingsInput {
    timezone: string;
    currency: string;
    fiscalYearStart: string;
    contactEmail: string;
    billingAddress: string;
    supportPhone: string;
    featureFlags?: Record<string, unknown>;
}

export interface UpdateBrandingInput {
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    customDomain: string;
    emailHeaderHtml: string;
}

export interface UpdatePreferencesInput {
    defaultLocale: string;
    defaultTimezone: string;
    weekStartsOn: string;
    dateFormat: string;
    timeFormat: string;
}

export interface UpdateSecurityPolicyInput {
    mfaRequired: boolean;
    sessionTimeoutMinutes: number;
    passwordMinLength: number;
    ipAllowlist: string[];
    loginAttemptLimit: number;
}

export interface UpdateAuditConfigInput {
    retentionDays: number;
    enabledEvents: string[];
    exportFormat: string;
    alertThreshold: number;
}

export interface UpdateUserPreferencesInput {
    theme: string;
    locale: string;
    timezone: string;
    dateFormat: string;
    digestFrequency: string;
}

export interface CreateTeamInput {
    name: string;
    slug: string;
    description?: string;
}

export interface CreateInvitationInput {
    email: string;
    roleName: string;
}

export interface CreateApiKeyInput {
    name: string;
    environment: "live" | "test" | "hook";
    scopes: string[];
    expiresAt?: string | null;
}

export interface UpdateNotificationPreferenceInput {
    enabled: boolean;
}
