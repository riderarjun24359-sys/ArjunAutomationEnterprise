import {
    buildApiKeyPayload,
    buildBrandingPayload,
    buildInvitationPayload,
    buildOrganizationSettingsPayload,
    buildPreferencesPayload,
    buildSecurityPayload,
    buildSettingsActivityPayload,
    buildSettingsDashboardStats,
    buildTeamPayload,
    mapApiKey,
    mapAuditConfiguration,
    mapBackupConfig,
    mapBackupRun,
    mapBrandingSettings,
    mapNotificationPreference,
    mapOrganizationInvitation,
    mapOrganizationPreferences,
    mapOrganizationSettings,
    mapRoleSummary,
    mapSecurityPolicy,
    mapTeamMemberSummary,
    mapTeamSummary,
    mapUserPreferences,
} from "@/src/modules/database/lib/settings-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    ApiKey,
    AuditConfiguration,
    BackupConfig,
    BrandingSettings,
    CreateApiKeyInput,
    CreateInvitationInput,
    CreateTeamInput,
    NotificationPreference,
    OrganizationInvitation,
    OrganizationPreferences,
    OrganizationSettings,
    RoleSummary,
    SecurityPolicy,
    SettingsDashboardStats,
    TeamMemberSummary,
    TeamSummary,
    UpdateAuditConfigInput,
    UpdateBrandingInput,
    UpdateNotificationPreferenceInput,
    UpdateOrganizationSettingsInput,
    UpdatePreferencesInput,
    UpdateSecurityPolicyInput,
    UpdateUserPreferencesInput,
    UserPreferences,
} from "@/src/modules/settings/types";

export class SettingsService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    async getOrganizationSettings(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationSettings | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const record = await databaseService.organizationSettings.getByOrganization(context.organizationId);
        return record ? mapOrganizationSettings(record) : null;
    }

    async updateOrganizationSettings(authUserId: string, email: string, input: UpdateOrganizationSettingsInput, fullName?: string | null): Promise<OrganizationSettings> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const record = await databaseService.organizationSettings.upsertByOrganization(context.organizationId, buildOrganizationSettingsPayload(context.organizationId, input));
        if (!record) throw new Error("Failed to update organization settings");
        await databaseService.activityLogs.create(buildSettingsActivityPayload(context.organizationId, "settings", "update", "Organization settings", "Organization settings updated"));
        return mapOrganizationSettings(record);
    }

    async getBranding(authUserId: string, email: string, fullName?: string | null): Promise<BrandingSettings | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const record = await databaseService.organizationBranding.getByOrganization(context.organizationId);
        return record ? mapBrandingSettings(record) : null;
    }

    async updateBranding(authUserId: string, email: string, input: UpdateBrandingInput, fullName?: string | null): Promise<BrandingSettings> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const record = await databaseService.organizationBranding.upsertByOrganization(context.organizationId, buildBrandingPayload(context.organizationId, input));
        if (!record) throw new Error("Failed to update branding");
        await databaseService.activityLogs.create(buildSettingsActivityPayload(context.organizationId, "branding", "update", "Branding", "Organization branding updated"));
        return mapBrandingSettings(record);
    }

    async getPreferences(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationPreferences | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const record = await databaseService.organizationPreferences.getByOrganization(context.organizationId);
        return record ? mapOrganizationPreferences(record) : null;
    }

    async updatePreferences(authUserId: string, email: string, input: UpdatePreferencesInput, fullName?: string | null): Promise<OrganizationPreferences> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const record = await databaseService.organizationPreferences.upsertByOrganization(context.organizationId, buildPreferencesPayload(context.organizationId, input));
        if (!record) throw new Error("Failed to update preferences");
        return mapOrganizationPreferences(record);
    }

    async getUserPreferences(authUserId: string, email: string, fullName?: string | null): Promise<UserPreferences | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const record = await databaseService.userPreferences.getByUser(context.profileId);
        return record ? mapUserPreferences(record) : null;
    }

    async updateUserPreferences(authUserId: string, email: string, input: UpdateUserPreferencesInput, fullName?: string | null): Promise<UserPreferences> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const record = await databaseService.userPreferences.upsertForUser(context.profileId, {
            organization_id: context.organizationId,
            theme: input.theme,
            locale: input.locale,
            timezone: input.timezone,
            date_format: input.dateFormat,
            digest_frequency: input.digestFrequency,
        });
        if (!record) throw new Error("Failed to update user preferences");
        return mapUserPreferences(record);
    }

    async getSecurityPolicy(authUserId: string, email: string, fullName?: string | null): Promise<SecurityPolicy | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const record = await databaseService.organizationSecurityPolicies.getByOrganization(context.organizationId);
        return record ? mapSecurityPolicy(record) : null;
    }

    async updateSecurityPolicy(authUserId: string, email: string, input: UpdateSecurityPolicyInput, fullName?: string | null): Promise<SecurityPolicy> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const record = await databaseService.organizationSecurityPolicies.upsertByOrganization(context.organizationId, buildSecurityPayload(context.organizationId, input));
        if (!record) throw new Error("Failed to update security policy");
        await databaseService.activityLogs.create(buildSettingsActivityPayload(context.organizationId, "security", "update", "Security policy", "Security settings updated"));
        return mapSecurityPolicy(record);
    }

    async getAuditConfig(authUserId: string, email: string, fullName?: string | null): Promise<AuditConfiguration | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const record = await databaseService.auditConfig.getByOrganization(context.organizationId);
        return record ? mapAuditConfiguration(record) : null;
    }

    async updateAuditConfig(authUserId: string, email: string, input: UpdateAuditConfigInput, fullName?: string | null): Promise<AuditConfiguration> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const record = await databaseService.auditConfig.upsertByOrganization(context.organizationId, {
            organization_id: context.organizationId,
            retention_days: input.retentionDays,
            enabled_events: input.enabledEvents,
            export_format: input.exportFormat,
            alert_threshold: input.alertThreshold,
        });
        if (!record) throw new Error("Failed to update audit config");
        return mapAuditConfiguration(record);
    }

    async getTeams(authUserId: string, email: string, fullName?: string | null): Promise<TeamSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const teams = await databaseService.teams.listByOrganization(context.organizationId);
        return Promise.all(
            teams.map(async (team) => {
                const members = await databaseService.teamMembers.listByTeam(team.id);
                return mapTeamSummary(team, members.length);
            }),
        );
    }

    async createTeam(authUserId: string, email: string, input: CreateTeamInput, fullName?: string | null): Promise<TeamSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.teams.create(buildTeamPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create team");
        return mapTeamSummary(created, 0);
    }

    async getMembers(authUserId: string, email: string, fullName?: string | null): Promise<TeamMemberSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const memberships = await databaseService.memberships.listByOrganization(context.organizationId);
        const profile = await databaseService.profiles.getById(context.profileId);
        return memberships.map((membership) => mapTeamMemberSummary(membership, membership.user_id === context.profileId ? profile : null));
    }

    async getInvitations(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationInvitation[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.organizationInvitations.listByOrganization(context.organizationId);
        return records.map(mapOrganizationInvitation);
    }

    async createInvitation(authUserId: string, email: string, input: CreateInvitationInput, fullName?: string | null): Promise<OrganizationInvitation> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.organizationInvitations.create(buildInvitationPayload(context.organizationId, context.profileId, input));
        if (!created) throw new Error("Failed to create invitation");
        return mapOrganizationInvitation(created);
    }

    async getRoles(authUserId: string, email: string, fullName?: string | null): Promise<RoleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [roles, permissions] = await Promise.all([
            databaseService.roles.listByOrganization(context.organizationId),
            databaseService.permissions.listAll(),
        ]);
        const permissionMap = new Map(permissions.map((permission) => [permission.id, permission]));
        return Promise.all(
            roles.map(async (role) => {
                const grants = await databaseService.rolePermissionGrants.listByRole(role.id);
                const rolePermissions = grants.map((grant) => permissionMap.get(grant.permission_id)).filter(Boolean) as typeof permissions;
                return mapRoleSummary(role, rolePermissions);
            }),
        );
    }

    async getApiKeys(authUserId: string, email: string, fullName?: string | null): Promise<ApiKey[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.apiKeys.listByOrganization(context.organizationId);
        return records.map(mapApiKey);
    }

    async createApiKey(authUserId: string, email: string, input: CreateApiKeyInput, fullName?: string | null): Promise<ApiKey> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.apiKeys.create(buildApiKeyPayload(context.organizationId, context.profileId, input));
        if (!created) throw new Error("Failed to create API key");
        return mapApiKey(created);
    }

    async revokeApiKey(authUserId: string, email: string, apiKeyId: string, fullName?: string | null): Promise<ApiKey> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.apiKeys.update(apiKeyId, { status: "revoked" });
        if (!updated) throw new Error("Failed to revoke API key");
        return mapApiKey(updated);
    }

    async getNotificationPreferences(authUserId: string, email: string, fullName?: string | null): Promise<NotificationPreference[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.notificationPreferences.listByOrganization(context.organizationId);
        return records.map(mapNotificationPreference);
    }

    async updateNotificationPreference(authUserId: string, email: string, preferenceId: string, input: UpdateNotificationPreferenceInput, fullName?: string | null): Promise<NotificationPreference> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.notificationPreferences.update(preferenceId, { enabled: input.enabled });
        if (!updated) throw new Error("Failed to update notification preference");
        return mapNotificationPreference(updated);
    }

    async getBackupConfigs(authUserId: string, email: string, fullName?: string | null): Promise<BackupConfig[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const configs = await databaseService.backupConfigs.listByOrganization(context.organizationId);
        return Promise.all(
            configs.map(async (config) => {
                const runs = await databaseService.backupRuns.listByConfig(config.id);
                return mapBackupConfig(config, runs.map(mapBackupRun));
            }),
        );
    }

    async runBackup(authUserId: string, email: string, configId: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const run = await databaseService.backupRuns.create({
            config_id: configId,
            status: "completed",
            completed_at: new Date().toISOString(),
            size_bytes: 1048576,
            storage_path: `backups/manual-${Date.now()}.sql.gz`,
        });
        if (!run) throw new Error("Failed to run backup");
        return mapBackupRun(run);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<SettingsDashboardStats> {
        const [teams, members, invitations, apiKeys, backupConfigs, roles] = await Promise.all([
            this.getTeams(authUserId, email, fullName),
            this.getMembers(authUserId, email, fullName),
            this.getInvitations(authUserId, email, fullName),
            this.getApiKeys(authUserId, email, fullName),
            this.getBackupConfigs(authUserId, email, fullName),
            this.getRoles(authUserId, email, fullName),
        ]);
        return buildSettingsDashboardStats({ teams, members, invitations, apiKeys, backupConfigs, roles });
    }
}

export const settingsService = new SettingsService();
