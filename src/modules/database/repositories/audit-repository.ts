import type { AuditLog } from "@/src/modules/database/types/core";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class AuditRepository extends BaseRepository<AuditLog> {
    protected table = "audit_logs";

    async list(query: RepositoryQuery = {}): Promise<AuditLog[]> {
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
        mapRepositoryError(error, "Failed to list audit logs");
        return (data ?? []) as AuditLog[];
    }

    async create(input: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create audit log");
        return (data as AuditLog | null) ?? null;
    }
}
