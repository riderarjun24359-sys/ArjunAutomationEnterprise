import type { OrganizationMember, UserRoleName } from "@/src/modules/database/types/core";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository } from "@/src/modules/database/repositories/base-repository";

export class MembershipRepository extends BaseRepository<OrganizationMember> {
    protected table = "organization_members";

    async listByOrganization(organizationId: string): Promise<OrganizationMember[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).eq("is_active", true);
        mapRepositoryError(error, "Failed to list memberships");
        return (data ?? []) as OrganizationMember[];
    }

    async getByUser(userId: string): Promise<OrganizationMember[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client.from(this.table).select("*").eq("user_id", userId).eq("is_active", true);
        mapRepositoryError(error, "Failed to get memberships");
        return (data ?? []) as OrganizationMember[];
    }

    /**
     * Ensures a membership row exists. Never overwrites an existing role_name on conflict
     * (prevents accidental demotion of founder/admin).
     */
    async ensureMembership(organizationId: string, userId: string, roleName?: UserRoleName): Promise<OrganizationMember | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const existing = await this.getByUser(userId);
        const current = existing.find((membership) => membership.organization_id === organizationId) ?? null;
        if (current) {
            return current;
        }

        let resolvedRole: UserRoleName = roleName ?? "member";
        if (!roleName) {
            const orgMembers = await this.listByOrganization(organizationId);
            resolvedRole = orgMembers.length === 0 ? "founder" : "member";
        }

        const { data, error } = await client
            .from(this.table)
            .upsert(
                {
                    organization_id: organizationId,
                    user_id: userId,
                    role_name: resolvedRole,
                    is_active: true,
                },
                { onConflict: "organization_id,user_id", ignoreDuplicates: true },
            )
            .select("*")
            .maybeSingle();

        mapRepositoryError(error, "Failed to ensure membership");

        if (data) {
            return data as OrganizationMember;
        }

        const refreshed = await this.getByUser(userId);
        return refreshed.find((membership) => membership.organization_id === organizationId) ?? null;
    }

    async updateRole(organizationId: string, userId: string, roleName: UserRoleName): Promise<OrganizationMember | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client
            .from(this.table)
            .update({ role_name: roleName, updated_at: new Date().toISOString() })
            .eq("organization_id", organizationId)
            .eq("user_id", userId)
            .eq("is_active", true)
            .select("*")
            .maybeSingle();

        mapRepositoryError(error, "Failed to update membership role");
        return (data as OrganizationMember | null) ?? null;
    }
}
