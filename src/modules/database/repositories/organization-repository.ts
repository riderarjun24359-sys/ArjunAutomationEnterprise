import type { Organization } from "@/src/modules/database/types/core";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class OrganizationRepository extends BaseRepository<Organization> {
    protected table = "organizations";

    async list(query: RepositoryQuery = {}): Promise<Organization[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, "Failed to list organizations");
        return (data ?? []) as Organization[];
    }

    async getBySlug(slug: string): Promise<Organization | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("slug", slug).maybeSingle();
        mapRepositoryError(error, "Failed to get organization");
        return (data as Organization | null) ?? null;
    }

    async getById(id: string): Promise<Organization | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, "Failed to get organization");
        return (data as Organization | null) ?? null;
    }
}
