import type { AuditLog } from "@/src/modules/database/types/core";
import { getRepositoryClient, getSelectedOrganizationId, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class AuditRepository extends BaseRepository<AuditLog> {
    protected table = "audit_logs";

    async list(query: RepositoryQuery = {}): Promise<AuditLog[]> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId) {
            return [];
        }

        const normalized = this.buildQuery(query);
        const request = client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        if (query.filters?.organization_id && query.filters.organization_id !== organizationId) {
            return [];
        }

        const { data, error } = await request;
        mapRepositoryError(error, "Failed to list audit logs");
        return (data ?? []) as AuditLog[];
    }

    async create(input: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog | null> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId || input.organization_id !== organizationId) {
            return null;
        }

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create audit log");
        return (data as AuditLog | null) ?? null;
    }
}
