import type {
    DbAsset,
    DbGoodsReceivedNote,
    DbGrnItem,
    DbInventoryAdjustment,
    DbInventoryAuditLog,
    DbInventoryValuation,
    DbLowStockAlert,
    DbProduct,
    DbProductBarcode,
    DbProductCategory,
    DbPurchaseOrder,
    DbPurchaseOrderItem,
    DbStockLevel,
    DbStockMovement,
    DbStockTransfer,
    DbStockTransferItem,
    DbSupplier,
    DbWarehouse,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgInventoryRepository<T> extends BaseRepository<T> {
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

export class ProductCategoryRepository extends OrgInventoryRepository<DbProductCategory> { protected table = "product_categories"; }
export class ProductRepository extends OrgInventoryRepository<DbProduct> { protected table = "products"; }
export class WarehouseRepository extends OrgInventoryRepository<DbWarehouse> { protected table = "warehouses"; }
export class StockLevelRepository extends OrgInventoryRepository<DbStockLevel> { protected table = "stock_levels"; }
export class SupplierRepository extends OrgInventoryRepository<DbSupplier> { protected table = "suppliers"; }
export class StockMovementRepository extends OrgInventoryRepository<DbStockMovement> { protected table = "stock_movements"; }
export class InventoryAdjustmentRepository extends OrgInventoryRepository<DbInventoryAdjustment> { protected table = "inventory_adjustments"; }
export class PurchaseOrderRepository extends OrgInventoryRepository<DbPurchaseOrder> { protected table = "purchase_orders"; }
export class AssetRepository extends OrgInventoryRepository<DbAsset> { protected table = "assets"; }
export class ProductBarcodeRepository extends OrgInventoryRepository<DbProductBarcode> { protected table = "product_barcodes"; }
export class LowStockAlertRepository extends OrgInventoryRepository<DbLowStockAlert> { protected table = "low_stock_alerts"; }
export class StockTransferRepository extends OrgInventoryRepository<DbStockTransfer> { protected table = "stock_transfers"; }
export class GoodsReceivedNoteRepository extends OrgInventoryRepository<DbGoodsReceivedNote> { protected table = "goods_received_notes"; }
export class InventoryValuationRepository extends OrgInventoryRepository<DbInventoryValuation> { protected table = "inventory_valuations"; }
export class InventoryAuditLogRepository extends OrgInventoryRepository<DbInventoryAuditLog> { protected table = "inventory_audit_logs"; }

export class PurchaseOrderItemRepository extends BaseRepository<DbPurchaseOrderItem> {
    protected table = "purchase_order_items";
    async listByPurchaseOrder(purchaseOrderId: string): Promise<DbPurchaseOrderItem[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from(this.table).select("*").eq("purchase_order_id", purchaseOrderId);
        mapRepositoryError(error, "Failed to list purchase_order_items");
        return (data ?? []) as DbPurchaseOrderItem[];
    }
    async create(input: Record<string, unknown>): Promise<DbPurchaseOrderItem | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create purchase_order_items");
        return (data as DbPurchaseOrderItem | null) ?? null;
    }
}

export class StockTransferItemRepository extends BaseRepository<DbStockTransferItem> {
    protected table = "stock_transfer_items";
    async listByTransfer(transferId: string): Promise<DbStockTransferItem[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from(this.table).select("*").eq("transfer_id", transferId);
        mapRepositoryError(error, "Failed to list stock_transfer_items");
        return (data ?? []) as DbStockTransferItem[];
    }
}

export class GrnItemRepository extends BaseRepository<DbGrnItem> {
    protected table = "grn_items";
    async listByGrn(grnId: string): Promise<DbGrnItem[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from(this.table).select("*").eq("grn_id", grnId);
        mapRepositoryError(error, "Failed to list grn_items");
        return (data ?? []) as DbGrnItem[];
    }
}
