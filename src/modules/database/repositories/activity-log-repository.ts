import type { DbActivityLog } from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class ActivityLogRepository extends BaseRepository<DbActivityLog> {
    protected table = "activity_logs";

    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<DbActivityLog[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const normalized = this.buildQuery(query);
        let request = client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        if (query.filters?.entity_type) {
            request = request.eq("entity_type", String(query.filters.entity_type));
        }

        const { data, error } = await request;
        mapRepositoryError(error, "Failed to list activity logs");
        return (data ?? []) as DbActivityLog[];
    }

    async listByEntity(organizationId: string, entityType: string, entityId: string): Promise<DbActivityLog[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .eq("entity_type", entityType)
            .eq("entity_id", entityId)
            .order("created_at", { ascending: false });

        mapRepositoryError(error, "Failed to list entity activity logs");
        return (data ?? []) as DbActivityLog[];
    }

    async create(input: Record<string, unknown>): Promise<DbActivityLog | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create activity log");
        return (data as DbActivityLog | null) ?? null;
    }
}
