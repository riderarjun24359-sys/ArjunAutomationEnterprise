import type { DbContact } from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class ContactRepository extends BaseRepository<DbContact> {
    protected table = "contacts";

    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<DbContact[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, "Failed to list contacts");
        return (data ?? []) as DbContact[];
    }

    async listByCompanyId(companyId: string): Promise<DbContact[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client.from(this.table).select("*").eq("company_id", companyId).order("first_name");
        mapRepositoryError(error, "Failed to list contacts");
        return (data ?? []) as DbContact[];
    }

    async getById(id: string): Promise<DbContact | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, "Failed to get contact");
        return (data as DbContact | null) ?? null;
    }
}
