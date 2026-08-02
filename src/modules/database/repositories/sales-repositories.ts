import type {
    DbSalesActivity,
    DbSalesAuditLog,
    DbSalesCallLog,
    DbSalesCommission,
    DbSalesEmailTracking,
    DbSalesForecast,
    DbSalesLead,
    DbSalesMeeting,
    DbSalesOpportunity,
    DbSalesPipeline,
    DbSalesPipelineStage,
    DbSalesQuote,
    DbSalesQuoteItem,
    DbSalesTarget,
    DbSalesWinLossRecord,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgSalesRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
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
        if (!client) return null;
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
}

export class SalesPipelineRepository extends OrgSalesRepository<DbSalesPipeline> { protected table = "sales_pipelines"; }
export class SalesPipelineStageRepository extends OrgSalesRepository<DbSalesPipelineStage> { protected table = "sales_pipeline_stages"; }
export class SalesLeadRepository extends OrgSalesRepository<DbSalesLead> { protected table = "sales_leads"; }
export class SalesOpportunityRepository extends OrgSalesRepository<DbSalesOpportunity> { protected table = "sales_opportunities"; }
export class SalesQuoteRepository extends OrgSalesRepository<DbSalesQuote> { protected table = "sales_quotes"; }
export class SalesForecastRepository extends OrgSalesRepository<DbSalesForecast> { protected table = "sales_forecasts"; }
export class SalesActivityRepository extends OrgSalesRepository<DbSalesActivity> { protected table = "sales_activities"; }
export class SalesMeetingRepository extends OrgSalesRepository<DbSalesMeeting> { protected table = "sales_meetings"; }
export class SalesCallLogRepository extends OrgSalesRepository<DbSalesCallLog> { protected table = "sales_call_logs"; }
export class SalesEmailTrackingRepository extends OrgSalesRepository<DbSalesEmailTracking> { protected table = "sales_email_tracking"; }
export class SalesTargetRepository extends OrgSalesRepository<DbSalesTarget> { protected table = "sales_targets"; }
export class SalesCommissionRepository extends OrgSalesRepository<DbSalesCommission> { protected table = "sales_commissions"; }
export class SalesWinLossRecordRepository extends OrgSalesRepository<DbSalesWinLossRecord> { protected table = "sales_win_loss_records"; }
export class SalesAuditLogRepository extends OrgSalesRepository<DbSalesAuditLog> { protected table = "sales_audit_logs"; }

export class SalesQuoteItemRepository extends BaseRepository<DbSalesQuoteItem> {
    protected table = "sales_quote_items";
    async listByQuote(quoteId: string): Promise<DbSalesQuoteItem[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from(this.table).select("*").eq("quote_id", quoteId);
        mapRepositoryError(error, "Failed to list sales_quote_items");
        return (data ?? []) as DbSalesQuoteItem[];
    }
}

export class SalesPipelineStageByPipelineRepository extends BaseRepository<DbSalesPipelineStage> {
    protected table = "sales_pipeline_stages";
    async listByPipeline(pipelineId: string): Promise<DbSalesPipelineStage[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from(this.table).select("*").eq("pipeline_id", pipelineId).order("sort_order", { ascending: true });
        mapRepositoryError(error, "Failed to list sales_pipeline_stages");
        return (data ?? []) as DbSalesPipelineStage[];
    }
}
