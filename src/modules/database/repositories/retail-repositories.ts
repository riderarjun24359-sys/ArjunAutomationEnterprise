import type {
    DbRtlRetailHub,
    DbRtlRetailBrand,
    DbRtlStore,
    DbRtlCashRegister,
    DbRtlStoreDepartment,
    DbRtlProduct,
    DbRtlProductCategory,
    DbRtlProductVariant,
    DbRtlPromotion,
    DbRtlSalesOrder,
    DbRtlPosTransaction,
    DbRtlReturnsExchange,
    DbRtlShiftClosing,
    DbRtlWarehouse,
    DbRtlStockLevel,
    DbRtlPurchaseOrder,
    DbRtlSupplier,
    DbRtlCustomerProfile,
    DbRtlLoyaltyProgram,
    DbRtlRewardPoint,
    DbRtlCampaign,
    DbRtlDailyClosing,
    DbRtlBranchPerformance,
    DbRtlCommissionRecord,
    DbRtlSalesAnalytics,
    DbRtlInventoryAnalytics,
    DbRtlProfitabilityAnalytics,
    DbRtlRetailMetric,
    DbRtlRetailHealth,
    DbRtlExecutiveKpi,
    DbRtlRetailFailure,
    DbRtlAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgRtlRepository<T> extends BaseRepository<T> {
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

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class RtlRetailHubRepository extends OrgRtlRepository<DbRtlRetailHub> { protected table = "rtl_retail_hubs"; }
export class RtlRetailBrandRepository extends OrgRtlRepository<DbRtlRetailBrand> { protected table = "rtl_retail_brands"; }
export class RtlStoreRepository extends OrgRtlRepository<DbRtlStore> { protected table = "rtl_stores"; }
export class RtlCashRegisterRepository extends OrgRtlRepository<DbRtlCashRegister> { protected table = "rtl_cash_registers"; }
export class RtlStoreDepartmentRepository extends OrgRtlRepository<DbRtlStoreDepartment> { protected table = "rtl_store_departments"; }
export class RtlProductRepository extends OrgRtlRepository<DbRtlProduct> { protected table = "rtl_products"; }
export class RtlProductCategoryRepository extends OrgRtlRepository<DbRtlProductCategory> { protected table = "rtl_product_categories"; }
export class RtlProductVariantRepository extends OrgRtlRepository<DbRtlProductVariant> { protected table = "rtl_product_variants"; }
export class RtlPromotionRepository extends OrgRtlRepository<DbRtlPromotion> { protected table = "rtl_promotions"; }
export class RtlSalesOrderRepository extends OrgRtlRepository<DbRtlSalesOrder> { protected table = "rtl_sales_orders"; }
export class RtlPosTransactionRepository extends OrgRtlRepository<DbRtlPosTransaction> { protected table = "rtl_pos_transactions"; }
export class RtlReturnsExchangeRepository extends OrgRtlRepository<DbRtlReturnsExchange> { protected table = "rtl_returns_exchanges"; }
export class RtlShiftClosingRepository extends OrgRtlRepository<DbRtlShiftClosing> { protected table = "rtl_shift_closings"; }
export class RtlWarehouseRepository extends OrgRtlRepository<DbRtlWarehouse> { protected table = "rtl_warehouses"; }
export class RtlStockLevelRepository extends OrgRtlRepository<DbRtlStockLevel> { protected table = "rtl_stock_levels"; }
export class RtlPurchaseOrderRepository extends OrgRtlRepository<DbRtlPurchaseOrder> { protected table = "rtl_purchase_orders"; }
export class RtlSupplierRepository extends OrgRtlRepository<DbRtlSupplier> { protected table = "rtl_suppliers"; }
export class RtlCustomerProfileRepository extends OrgRtlRepository<DbRtlCustomerProfile> { protected table = "rtl_customer_profiles"; }
export class RtlLoyaltyProgramRepository extends OrgRtlRepository<DbRtlLoyaltyProgram> { protected table = "rtl_loyalty_programs"; }
export class RtlRewardPointRepository extends OrgRtlRepository<DbRtlRewardPoint> { protected table = "rtl_reward_points"; }
export class RtlCampaignRepository extends OrgRtlRepository<DbRtlCampaign> { protected table = "rtl_campaigns"; }
export class RtlDailyClosingRepository extends OrgRtlRepository<DbRtlDailyClosing> { protected table = "rtl_daily_closings"; }
export class RtlBranchPerformanceRepository extends OrgRtlRepository<DbRtlBranchPerformance> { protected table = "rtl_branch_performance"; }
export class RtlCommissionRecordRepository extends OrgRtlRepository<DbRtlCommissionRecord> { protected table = "rtl_commission_records"; }
export class RtlSalesAnalyticsRepository extends OrgRtlRepository<DbRtlSalesAnalytics> { protected table = "rtl_sales_analytics"; }
export class RtlInventoryAnalyticsRepository extends OrgRtlRepository<DbRtlInventoryAnalytics> { protected table = "rtl_inventory_analytics"; }
export class RtlProfitabilityAnalyticsRepository extends OrgRtlRepository<DbRtlProfitabilityAnalytics> { protected table = "rtl_profitability_analytics"; }
export class RtlRetailMetricRepository extends OrgRtlRepository<DbRtlRetailMetric> { protected table = "rtl_retail_metrics"; }
export class RtlRetailHealthRepository extends OrgRtlRepository<DbRtlRetailHealth> { protected table = "rtl_retail_health"; }
export class RtlExecutiveKpiRepository extends OrgRtlRepository<DbRtlExecutiveKpi> { protected table = "rtl_executive_kpis"; }
export class RtlRetailFailureRepository extends OrgRtlRepository<DbRtlRetailFailure> { protected table = "rtl_retail_failures"; }
export class RtlAuditLogRepository extends OrgRtlRepository<DbRtlAuditLog> { protected table = "rtl_audit_logs"; }
