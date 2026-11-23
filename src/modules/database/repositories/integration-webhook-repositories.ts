import { getRepositoryClient, getSelectedOrganizationId, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export interface DbIntegrationWebhook {
    id: string;
    organization_id: string;
    name: string;
    url: string;
    /** HMAC signing secret. Readable by org members under RLS (org trust boundary); never echoed to clients except through delivery. */
    secret: string;
    allowed_hosts: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbIntegrationDelivery {
    id: string;
    organization_id: string;
    webhook_id: string | null;
    event: string;
    target_host: string;
    status: "delivered" | "failed";
    attempts: number;
    response_status: number | null;
    error: string;
    idempotency_key: string;
    created_at: string;
}

abstract class OrgIntegrationRepository<T> extends BaseRepository<T> {
    protected safeColumns?: string;
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client || getSelectedOrganizationId() !== organizationId) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select(this.safeColumns ?? "*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async createForOrganization(organizationId: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client
            .from(this.table)
            .insert({ ...input, organization_id: organizationId })
            .select(this.safeColumns)
            .single();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data ?? null) as T | null;
    }

    async updateForOrganization(organizationId: string, id: string, patch: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client
            .from(this.table)
            .update({ ...patch, organization_id: organizationId, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("organization_id", organizationId)
            .select()
            .single();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data ?? null) as T | null;
    }
}

export class IntegrationWebhookRepository extends OrgIntegrationRepository<DbIntegrationWebhook> {
    protected table = "integration_webhooks";

    // The signing secret is server-only. Browser reads and mutation responses
    // must never project it, even for users who belong to the organization.
    protected readonly safeColumns =
        "id,organization_id,name,url,allowed_hosts,is_active,created_at,updated_at";
}

export class IntegrationDeliveryRepository extends OrgIntegrationRepository<DbIntegrationDelivery> {
    protected table = "integration_deliveries";
    protected readonly safeColumns =
        "id,organization_id,webhook_id,event,target_host,status,attempts,response_status,error,idempotency_key,created_at";
}
