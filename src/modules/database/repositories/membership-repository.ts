import type { OrganizationMember } from "@/src/modules/database/types/core";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class MembershipRepository extends BaseRepository<OrganizationMember> {
    protected table = "organization_members";

    async list(query: RepositoryQuery = {}): Promise<OrganizationMember[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const normalized = this.buildQuery(query);
        let request = client
            .from(this.table)
            .select("*")
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        if (query.filters?.organization_id) {
            request = request.eq("organization_id", String(query.filters.organization_id));
        }

        const { data, error } = await request;
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
}
