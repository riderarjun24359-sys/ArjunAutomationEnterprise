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
    DbRolePermissionGrant,
    DbTeam,
    DbTeamMember,
    DbUserPreferences,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgSettingsRepository<T> extends BaseRepository<T> {
    async getByOrganization(organizationId: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
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

    async upsertByOrganization(organizationId: string, input: Record<string, unknown>): Promise<T | null> {
        const existing = await this.getByOrganization(organizationId);
        if (existing && typeof existing === "object" && "id" in existing) {
            return this.update(String((existing as { id: string }).id), input);
        }
        return this.create({ organization_id: organizationId, ...input });
    }
}

export class OrganizationSettingsRepository extends OrgSettingsRepository<DbOrganizationSettings> {
    protected table = "organization_settings";
}

export class OrganizationBrandingRepository extends OrgSettingsRepository<DbOrganizationBranding> {
    protected table = "organization_branding";
}

export class OrganizationPreferencesRepository extends OrgSettingsRepository<DbOrganizationPreferences> {
    protected table = "organization_preferences";
}

export class OrganizationSecurityPolicyRepository extends OrgSettingsRepository<DbOrganizationSecurityPolicy> {
    protected table = "organization_security_policies";
}

export class AuditConfigRepository extends OrgSettingsRepository<DbAuditConfig> {
    protected table = "audit_config";
}

export class TeamRepository extends OrgSettingsRepository<DbTeam> {
    protected table = "teams";
}

export class OrganizationInvitationRepository extends OrgSettingsRepository<DbOrganizationInvitation> {
    protected table = "organization_invitations";
}

export class ApiKeyRepository extends OrgSettingsRepository<DbApiKey> {
    protected table = "api_keys";
}

export class NotificationPreferenceRepository extends OrgSettingsRepository<DbNotificationPreference> {
    protected table = "notification_preferences";
}

export class BackupConfigRepository extends OrgSettingsRepository<DbBackupConfig> {
    protected table = "backup_configs";
}

export class TeamMemberRepository extends BaseRepository<DbTeamMember> {
    protected table = "team_members";

    async listByTeam(teamId: string): Promise<DbTeamMember[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("team_id", teamId);
        mapRepositoryError(error, "Failed to list team_members");
        return (data ?? []) as DbTeamMember[];
    }

    async create(input: Record<string, unknown>): Promise<DbTeamMember | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create team_members");
        return (data as DbTeamMember | null) ?? null;
    }
}

export class UserPreferencesRepository extends BaseRepository<DbUserPreferences> {
    protected table = "user_preferences";

    async getByUser(userId: string): Promise<DbUserPreferences | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).select("*").eq("user_id", userId).maybeSingle();
        mapRepositoryError(error, "Failed to get user_preferences");
        return (data as DbUserPreferences | null) ?? null;
    }

    async upsertForUser(userId: string, input: Record<string, unknown>): Promise<DbUserPreferences | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client
            .from(this.table)
            .upsert({ user_id: userId, ...input }, { onConflict: "user_id" })
            .select("*")
            .maybeSingle();

        mapRepositoryError(error, "Failed to upsert user_preferences");
        return (data as DbUserPreferences | null) ?? null;
    }
}

export class BackupRunRepository extends BaseRepository<DbBackupRun> {
    protected table = "backup_runs";

    async listByConfig(configId: string): Promise<DbBackupRun[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("config_id", configId).order("started_at", { ascending: false });
        mapRepositoryError(error, "Failed to list backup_runs");
        return (data ?? []) as DbBackupRun[];
    }

    async create(input: Record<string, unknown>): Promise<DbBackupRun | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create backup_runs");
        return (data as DbBackupRun | null) ?? null;
    }
}

export class RoleRepository extends BaseRepository<DbRole> {
    protected table = "roles";

    async listByOrganization(organizationId: string): Promise<DbRole[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order("name");
        mapRepositoryError(error, "Failed to list roles");
        return (data ?? []) as DbRole[];
    }
}

export class PermissionRepository extends BaseRepository<DbPermission> {
    protected table = "permissions";

    async listAll(): Promise<DbPermission[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").order("key");
        mapRepositoryError(error, "Failed to list permissions");
        return (data ?? []) as DbPermission[];
    }
}

export class RolePermissionGrantRepository extends BaseRepository<DbRolePermissionGrant> {
    protected table = "role_permission_grants";

    async listByRole(roleId: string): Promise<DbRolePermissionGrant[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("role_id", roleId);
        mapRepositoryError(error, "Failed to list role_permission_grants");
        return (data ?? []) as DbRolePermissionGrant[];
    }
}
