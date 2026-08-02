import type { DbClient } from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class ClientRepository extends BaseRepository<DbClient> {
    protected table = "clients";

    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<DbClient[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, "Failed to list clients");
        return (data ?? []) as DbClient[];
    }

    async getById(id: string): Promise<DbClient | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, "Failed to get client");
        return (data as DbClient | null) ?? null;
    }

    async listLeads(organizationId: string): Promise<DbClient[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .neq("lifecycle_stage", "client")
            .order("lead_score", { ascending: false });

        mapRepositoryError(error, "Failed to list leads");
        return (data ?? []) as DbClient[];
    }
}
