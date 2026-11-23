import type {
    DbAnalyticsDashboard,
    DbAnalyticsMetric,
    DbAnalyticsReport,
    DbAnalyticsWidget,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, getSelectedOrganizationId, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAnalyticsRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client || getSelectedOrganizationId() !== organizationId) return [];

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        const dashboardId = typeof input.dashboard_id === "string" ? input.dashboard_id : null;
        if (!client || !organizationId || !dashboardId) return null;
        const parent = await client.from("analytics_dashboards").select("id").eq("id", dashboardId).eq("organization_id", organizationId).maybeSingle();
        if (parent.error || !parent.data) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;

        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class AnalyticsDashboardRepository extends OrgAnalyticsRepository<DbAnalyticsDashboard> {
    protected table = "analytics_dashboards";
}

export class AnalyticsWidgetRepository extends BaseRepository<DbAnalyticsWidget> {
    protected table = "analytics_widgets";

    async listByDashboard(dashboardId: string): Promise<DbAnalyticsWidget[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("dashboard_id", dashboardId).order("sort_order");
        mapRepositoryError(error, "Failed to list analytics_widgets");
        return (data ?? []) as DbAnalyticsWidget[];
    }

    async create(input: Record<string, unknown>): Promise<DbAnalyticsWidget | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create analytics_widgets");
        return (data as DbAnalyticsWidget | null) ?? null;
    }
}

export class AnalyticsMetricRepository extends OrgAnalyticsRepository<DbAnalyticsMetric> {
    protected table = "analytics_metrics";
}

export class AnalyticsReportRepository extends OrgAnalyticsRepository<DbAnalyticsReport> {
    protected table = "analytics_reports";
}
