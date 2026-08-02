import type { OrganizationMember, UserProfile } from "@/src/modules/database/types/core";
import type {
    DbApiKey,
    DbAuditConfig,
    DbBackupConfig,
    DbBackupRun,
    DbNotificationPreference,
    DbOrganizationBranding,
    DbOrganizationInvitation,
    DbOrganizationPreferences,
    DbOrganizationSecurityPolicy,
    DbOrganizationSettings,
    DbPermission,
    DbRole,
    DbTeam,
    DbUserPreferences,
} from "@/src/modules/database/types/platform";
import type {
    ApiKey,
    AuditConfiguration,
    BackupConfig,
    BackupRun,
    BrandingSettings,
    CreateApiKeyInput,
    CreateInvitationInput,
    CreateTeamInput,
    NotificationPreference,
    OrganizationPreferences,
    OrganizationSettings,
    RoleSummary,
    SecurityPolicy,
    SettingsDashboardStats,
    TeamMemberSummary,
    TeamSummary,
    UpdateBrandingInput,
    UpdateOrganizationSettingsInput,
    UpdatePreferencesInput,
    UpdateSecurityPolicyInput,
    UserPreferences,
} from "@/src/modules/settings/types";

export const mapOrganizationSettings = (record: DbOrganizationSettings): OrganizationSettings => ({
    id: record.id,
    timezone: record.timezone,
    currency: record.currency,
    fiscalYearStart: record.fiscal_year_start,
    contactEmail: record.contact_email,
    billingAddress: record.billing_address,
    supportPhone: record.support_phone,
    featureFlags: record.feature_flags,
    updatedAt: record.updated_at,
});

export const mapBrandingSettings = (record: DbOrganizationBranding): BrandingSettings => ({
    id: record.id,
    logoUrl: record.logo_url,
    faviconUrl: record.favicon_url,
    primaryColor: record.primary_color,
    secondaryColor: record.secondary_color,
    accentColor: record.accent_color,
    customDomain: record.custom_domain,
    emailHeaderHtml: record.email_header_html,
    updatedAt: record.updated_at,
});

export const mapOrganizationPreferences = (record: DbOrganizationPreferences): OrganizationPreferences => ({
    id: record.id,
    defaultLocale: record.default_locale,
    defaultTimezone: record.default_timezone,
    weekStartsOn: record.week_starts_on,
    dateFormat: record.date_format,
    timeFormat: record.time_format,
    updatedAt: record.updated_at,
});

export const mapSecurityPolicy = (record: DbOrganizationSecurityPolicy): SecurityPolicy => ({
    id: record.id,
    mfaRequired: record.mfa_required,
    sessionTimeoutMinutes: record.session_timeout_minutes,
    passwordMinLength: record.password_min_length,
    ipAllowlist: Array.isArray(record.ip_allowlist) ? record.ip_allowlist.map(String) : [],
    loginAttemptLimit: record.login_attempt_limit,
    updatedAt: record.updated_at,
});

export const mapAuditConfiguration = (record: DbAuditConfig): AuditConfiguration => ({
    id: record.id,
    retentionDays: record.retention_days,
    enabledEvents: record.enabled_events,
    exportFormat: record.export_format,
    alertThreshold: record.alert_threshold,
    updatedAt: record.updated_at,
});

export const mapTeamSummary = (record: DbTeam, memberCount: number): TeamSummary => ({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    memberCount,
    updatedAt: record.updated_at,
});

export const mapTeamMemberSummary = (membership: OrganizationMember, profile: UserProfile | null): TeamMemberSummary => ({
    id: membership.id,
    userId: membership.user_id,
    email: profile?.email ?? "Unknown",
    fullName: profile?.full_name ?? "Unknown user",
    roleName: membership.role_name,
    isActive: membership.is_active,
});

export const mapOrganizationInvitation = (record: DbOrganizationInvitation): import("@/src/modules/settings/types").OrganizationInvitation => ({
    id: record.id,
    email: record.email,
    roleName: record.role_name,
    status: record.status,
    expiresAt: record.expires_at,
});

export const mapRoleSummary = (role: DbRole, permissions: DbPermission[]): RoleSummary => ({
    id: role.id,
    name: role.name,
    description: role.description ?? "",
    isSystem: role.is_system,
    permissions: permissions.map((permission) => permission.key),
});

export const mapUserPreferences = (record: DbUserPreferences): UserPreferences => ({
    id: record.id,
    theme: record.theme,
    locale: record.locale,
    timezone: record.timezone,
    dateFormat: record.date_format,
    digestFrequency: record.digest_frequency,
    updatedAt: record.updated_at,
});

export const mapApiKey = (record: DbApiKey): ApiKey => ({
    id: record.id,
    name: record.name,
    keyPrefix: record.key_prefix,
    scopes: Array.isArray(record.scopes) ? record.scopes.map(String) : [],
    status: record.status as ApiKey["status"],
    expiresAt: record.expires_at ?? null,
    lastUsedAt: record.last_used_at ?? null,
    updatedAt: record.updated_at,
});

export const mapNotificationPreference = (record: DbNotificationPreference): NotificationPreference => ({
    id: record.id,
    channel: record.channel as NotificationPreference["channel"],
    eventType: record.event_type,
    enabled: record.enabled,
    isOrgWide: record.user_id == null,
});

export const mapBackupConfig = (record: DbBackupConfig, runs: BackupRun[]): BackupConfig => ({
    id: record.id,
    name: record.name,
    scheduleCron: record.schedule_cron,
    destination: record.destination,
    retentionCount: record.retention_count,
    includeTables: Array.isArray(record.include_tables) ? record.include_tables.map(String) : [],
    isEnabled: record.is_enabled,
    runs,
    updatedAt: record.updated_at,
});

export const mapBackupRun = (record: DbBackupRun): BackupRun => ({
    id: record.id,
    configId: record.config_id,
    status: record.status as BackupRun["status"],
    startedAt: record.started_at,
    completedAt: record.completed_at ?? null,
    sizeBytes: Number(record.size_bytes),
    storagePath: record.storage_path,
    errorMessage: record.error_message,
});

export const buildOrganizationSettingsPayload = (organizationId: string, input: UpdateOrganizationSettingsInput) => ({
    organization_id: organizationId,
    timezone: input.timezone,
    currency: input.currency,
    fiscal_year_start: input.fiscalYearStart,
    contact_email: input.contactEmail,
    billing_address: input.billingAddress,
    support_phone: input.supportPhone,
    feature_flags: input.featureFlags ?? {},
});

export const buildBrandingPayload = (organizationId: string, input: UpdateBrandingInput) => ({
    organization_id: organizationId,
    logo_url: input.logoUrl,
    favicon_url: input.faviconUrl,
    primary_color: input.primaryColor,
    secondary_color: input.secondaryColor,
    accent_color: input.accentColor,
    custom_domain: input.customDomain,
    email_header_html: input.emailHeaderHtml,
});

export const buildPreferencesPayload = (organizationId: string, input: UpdatePreferencesInput) => ({
    organization_id: organizationId,
    default_locale: input.defaultLocale,
    default_timezone: input.defaultTimezone,
    week_starts_on: input.weekStartsOn,
    date_format: input.dateFormat,
    time_format: input.timeFormat,
});

export const buildSecurityPayload = (organizationId: string, input: UpdateSecurityPolicyInput) => ({
    organization_id: organizationId,
    mfa_required: input.mfaRequired,
    session_timeout_minutes: input.sessionTimeoutMinutes,
    password_min_length: input.passwordMinLength,
    ip_allowlist: input.ipAllowlist,
    login_attempt_limit: input.loginAttemptLimit,
});

export const buildTeamPayload = (organizationId: string, input: CreateTeamInput) => ({
    organization_id: organizationId,
    name: input.name,
    slug: input.slug,
    description: input.description ?? "",
});

export const buildInvitationPayload = (organizationId: string, profileId: string, input: CreateInvitationInput) => ({
    organization_id: organizationId,
    email: input.email,
    role_name: input.roleName,
    status: "pending",
    invited_by: profileId,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
});

export const buildApiKeyPayload = (organizationId: string, profileId: string, input: CreateApiKeyInput) => ({
    organization_id: organizationId,
    name: input.name,
    key_prefix: `aao_${input.environment}_`,
    key_hash: `sha256:${crypto.randomUUID().replaceAll("-", "")}`,
    scopes: input.scopes,
    status: "active",
    created_by: profileId,
    expires_at: input.expiresAt ?? null,
});

export const buildSettingsActivityPayload = (organizationId: string, entityType: string, action: string, title: string, detail: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    action,
    title,
    detail,
    metadata: {},
});

export const buildSettingsDashboardStats = (input: {
    teams: TeamSummary[];
    members: TeamMemberSummary[];
    invitations: Array<{ status: string }>;
    apiKeys: ApiKey[];
    backupConfigs: BackupConfig[];
    roles: RoleSummary[];
}): SettingsDashboardStats => ({
    teamCount: String(input.teams.length),
    memberCount: String(input.members.length),
    pendingInvitations: String(input.invitations.filter((item) => item.status === "pending").length),
    activeApiKeys: String(input.apiKeys.filter((item) => item.status === "active").length),
    backupConfigs: String(input.backupConfigs.length),
    roleCount: String(input.roles.length),
});
