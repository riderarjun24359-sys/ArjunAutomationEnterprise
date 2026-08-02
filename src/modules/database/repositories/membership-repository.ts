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

    async ensureMembership(organizationId: string, userId: string, roleName: UserRoleName = "member"): Promise<OrganizationMember | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client
            .from(this.table)
            .upsert(
                {
                    organization_id: organizationId,
                    user_id: userId,
                    role_name: roleName,
                    is_active: true,
                },
                { onConflict: "organization_id,user_id" },
            )
            .select("*")
            .maybeSingle();

        mapRepositoryError(error, "Failed to ensure membership");
        return (data as OrganizationMember | null) ?? null;
    }
}
