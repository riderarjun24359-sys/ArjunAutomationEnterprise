import {
    buildAdjustmentPayload,
    buildAssetPayload,
    buildBarcodePayload,
    buildCategoryPayload,
    buildCrossModuleLinks,
    buildInventoryAuditPayload,
    buildInventoryDashboardStats,
    buildInventoryReport,
    buildLookupMaps,
    buildProductPayload,
    buildPurchaseOrderPayload,
    buildSupplierPayload,
    buildWarehousePayload,
    mapAdjustment,
    mapAssetSummary,
    mapAuditEntry,
    mapBarcode,
    mapCategorySummary,
    mapGrn,
    mapLowStockAlert,
    mapProductSummary,
    mapPurchaseOrder,
    mapStockMovement,
    mapStockTransfer,
    mapSupplierSummary,
    mapValuation,
    mapWarehouseSummary,
} from "@/src/modules/database/lib/inventory-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    AssetSummary,
    BarcodeSummary,
    CreateAdjustmentInput,
    CreateAssetInput,
    CreateBarcodeInput,
    CreateCategoryInput,
    CreateProductInput,
    CreatePurchaseOrderInput,
    CreateSupplierInput,
    CreateWarehouseInput,
    CrossModuleLinks,
    GrnSummary,
    InventoryAdjustmentSummary,
    InventoryAuditEntry,
    InventoryDashboardStats,
    InventoryReport,
    InventoryValuationSummary,
    LowStockAlertSummary,
    ProductCategorySummary,
    ProductSummary,
    PurchaseOrderSummary,
    StockMovementSummary,
    StockTransferSummary,
    SupplierSummary,
    UpdateAlertStatusInput,
    WarehouseSummary,
} from "@/src/modules/inventory/types";

export class InventoryService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [categories, products, warehouses, suppliers, purchaseOrders, stockLevels] = await Promise.all([
            databaseService.productCategories.listByOrganization(organizationId),
            databaseService.products.listByOrganization(organizationId),
            databaseService.warehouses.listByOrganization(organizationId),
            databaseService.suppliers.listByOrganization(organizationId),
            databaseService.purchaseOrders.listByOrganization(organizationId),
            databaseService.stockLevels.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(categories, products, warehouses, suppliers, purchaseOrders, stockLevels);
    }

    async getCategories(authUserId: string, email: string, fullName?: string | null): Promise<ProductCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [categories, products] = await Promise.all([
            databaseService.productCategories.listByOrganization(context.organizationId),
            databaseService.products.listByOrganization(context.organizationId),
        ]);
        return categories.map((category) => mapCategorySummary(category, products.filter((product) => product.category_id === category.id).length));
    }

    async createCategory(authUserId: string, email: string, input: CreateCategoryInput, fullName?: string | null): Promise<ProductCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.productCategories.create(buildCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create category");
        await databaseService.inventoryAuditLogs.create(buildInventoryAuditPayload(context.organizationId, "category", "create", `Category ${created.name} created`, created.id));
        return mapCategorySummary(created, 0);
    }

    async getProducts(authUserId: string, email: string, fullName?: string | null): Promise<ProductSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.products.listByOrganization(context.organizationId)).map((product) => mapProductSummary(product, maps));
    }

    async createProduct(authUserId: string, email: string, input: CreateProductInput, fullName?: string | null): Promise<ProductSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.products.create(buildProductPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create product");
        const maps = await this.getMaps(context.organizationId);
        return mapProductSummary(created, maps);
    }

    async getWarehouses(authUserId: string, email: string, fullName?: string | null): Promise<WarehouseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [warehouses, stockLevels] = await Promise.all([
            databaseService.warehouses.listByOrganization(context.organizationId),
            databaseService.stockLevels.listByOrganization(context.organizationId),
        ]);
        return warehouses.map((warehouse) => mapWarehouseSummary(warehouse, stockLevels));
    }

    async createWarehouse(authUserId: string, email: string, input: CreateWarehouseInput, fullName?: string | null): Promise<WarehouseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.warehouses.create(buildWarehousePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create warehouse");
        return mapWarehouseSummary(created, []);
    }

    async getMovements(authUserId: string, email: string, fullName?: string | null): Promise<StockMovementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const records = await databaseService.stockMovements.listByOrganization(context.organizationId, { orderBy: "moved_at", orderDirection: "desc" });
        return records.map((record) => mapStockMovement(record, maps));
    }

    async getAdjustments(authUserId: string, email: string, fullName?: string | null): Promise<InventoryAdjustmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const records = await databaseService.inventoryAdjustments.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return records.map((record) => mapAdjustment(record, maps));
    }

    async createAdjustment(authUserId: string, email: string, input: CreateAdjustmentInput, fullName?: string | null): Promise<InventoryAdjustmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.inventoryAdjustments.create(buildAdjustmentPayload(context.organizationId, context.profileId, input));
        if (!created) throw new Error("Failed to create adjustment");
        const maps = await this.getMaps(context.organizationId);
        return mapAdjustment(created, maps);
    }

    async getSuppliers(authUserId: string, email: string, fullName?: string | null): Promise<SupplierSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [suppliers, purchaseOrders] = await Promise.all([
            databaseService.suppliers.listByOrganization(context.organizationId),
            databaseService.purchaseOrders.listByOrganization(context.organizationId),
        ]);
        return suppliers.map((supplier) => mapSupplierSummary(supplier, purchaseOrders.filter((po) => po.supplier_id === supplier.id).length));
    }

    async createSupplier(authUserId: string, email: string, input: CreateSupplierInput, fullName?: string | null): Promise<SupplierSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.suppliers.create(buildSupplierPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create supplier");
        return mapSupplierSummary(created, 0);
    }

    async getPurchaseOrders(authUserId: string, email: string, fullName?: string | null): Promise<PurchaseOrderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const orders = await databaseService.purchaseOrders.listByOrganization(context.organizationId, { orderBy: "order_date", orderDirection: "desc" });
        return Promise.all(orders.map(async (order) => {
            const items = await databaseService.purchaseOrderItems.listByPurchaseOrder(order.id);
            return mapPurchaseOrder(order, items, maps);
        }));
    }

    async createPurchaseOrder(authUserId: string, email: string, input: CreatePurchaseOrderInput, fullName?: string | null): Promise<PurchaseOrderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.purchaseOrders.create(buildPurchaseOrderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create purchase order");
        const maps = await this.getMaps(context.organizationId);
        return mapPurchaseOrder(created, [], maps);
    }

    async getAssets(authUserId: string, email: string, fullName?: string | null): Promise<AssetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const assets = await databaseService.assets.listByOrganization(context.organizationId);
        const [projects, employees] = await Promise.all([
            databaseService.projects.listByOrganization(context.organizationId),
            databaseService.employees.listByOrganization(context.organizationId),
        ]);
        const projectMap = new Map(projects.map((project) => [project.id, project.name]));
        const employeeMap = new Map(employees.map((employee) => [employee.id, `${employee.first_name} ${employee.last_name}`]));
        return assets.map((asset) => mapAssetSummary(
            asset,
            asset.warehouse_id ? maps.warehouses.get(asset.warehouse_id) ?? null : null,
            asset.project_id ? projectMap.get(asset.project_id) ?? null : null,
            asset.employee_id ? employeeMap.get(asset.employee_id) ?? null : null,
        ));
    }

    async createAsset(authUserId: string, email: string, input: CreateAssetInput, fullName?: string | null): Promise<AssetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.assets.create(buildAssetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create asset");
        const maps = await this.getMaps(context.organizationId);
        return mapAssetSummary(created, created.warehouse_id ? maps.warehouses.get(created.warehouse_id) ?? null : null, null, null);
    }

    async getBarcodes(authUserId: string, email: string, fullName?: string | null): Promise<BarcodeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [barcodes, products, assets] = await Promise.all([
            databaseService.productBarcodes.listByOrganization(context.organizationId),
            databaseService.products.listByOrganization(context.organizationId),
            databaseService.assets.listByOrganization(context.organizationId),
        ]);
        const productMap = new Map(products.map((product) => [product.id, product]));
        const assetMap = new Map(assets.map((asset) => [asset.id, asset]));
        return barcodes.map((barcode) => mapBarcode(barcode, barcode.product_id ? productMap.get(barcode.product_id) ?? null : null, barcode.asset_id ? assetMap.get(barcode.asset_id) ?? null : null));
    }

    async createBarcode(authUserId: string, email: string, input: CreateBarcodeInput, fullName?: string | null): Promise<BarcodeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.productBarcodes.create(buildBarcodePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create barcode");
        return mapBarcode(created, null, null);
    }

    async getAlerts(authUserId: string, email: string, fullName?: string | null): Promise<LowStockAlertSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const records = await databaseService.lowStockAlerts.listByOrganization(context.organizationId, { orderBy: "triggered_at", orderDirection: "desc" });
        return records.map((record) => mapLowStockAlert(record, maps));
    }

    async updateAlertStatus(authUserId: string, email: string, alertId: string, input: UpdateAlertStatusInput, fullName?: string | null): Promise<LowStockAlertSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.lowStockAlerts.update(alertId, {
            status: input.status,
            resolved_at: input.status === "resolved" ? new Date().toISOString() : null,
        });
        if (!updated) throw new Error("Failed to update alert");
        const maps = await this.getMaps(context.organizationId);
        return mapLowStockAlert(updated, maps);
    }

    async getTransfers(authUserId: string, email: string, fullName?: string | null): Promise<StockTransferSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const transfers = await databaseService.stockTransfers.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return Promise.all(transfers.map(async (transfer) => {
            const items = await databaseService.stockTransferItems.listByTransfer(transfer.id);
            return mapStockTransfer(transfer, items, maps);
        }));
    }

    async getGrns(authUserId: string, email: string, fullName?: string | null): Promise<GrnSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const grns = await databaseService.goodsReceivedNotes.listByOrganization(context.organizationId, { orderBy: "received_date", orderDirection: "desc" });
        return Promise.all(grns.map(async (grn) => {
            const items = await databaseService.grnItems.listByGrn(grn.id);
            return mapGrn(grn, items, maps);
        }));
    }

    async getValuations(authUserId: string, email: string, fullName?: string | null): Promise<InventoryValuationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.inventoryValuations.listByOrganization(context.organizationId, { orderBy: "valuation_date", orderDirection: "desc" });
        return records.map(mapValuation);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<InventoryAuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.inventoryAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return records.map(mapAuditEntry);
    }

    async getReport(authUserId: string, email: string, fullName?: string | null): Promise<InventoryReport> {
        const [warehouses, movements, categories, purchaseOrders, assets] = await Promise.all([
            this.getWarehouses(authUserId, email, fullName),
            this.getMovements(authUserId, email, fullName),
            this.getCategories(authUserId, email, fullName),
            this.getPurchaseOrders(authUserId, email, fullName),
            this.getAssets(authUserId, email, fullName),
        ]);
        return buildInventoryReport({ warehouses, movements, categories, purchaseOrders, assets });
    }

    async getCrossModuleLinks(authUserId: string, email: string, fullName?: string | null): Promise<CrossModuleLinks> {
        const [purchaseOrders, assets, alerts, products] = await Promise.all([
            this.getPurchaseOrders(authUserId, email, fullName),
            this.getAssets(authUserId, email, fullName),
            this.getAlerts(authUserId, email, fullName),
            this.getProducts(authUserId, email, fullName),
        ]);
        return buildCrossModuleLinks({ purchaseOrders, assets, alerts, productCount: products.length });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<InventoryDashboardStats> {
        const [products, warehouses, alerts, assets, purchaseOrders, valuations, transfers] = await Promise.all([
            this.getProducts(authUserId, email, fullName),
            this.getWarehouses(authUserId, email, fullName),
            this.getAlerts(authUserId, email, fullName),
            this.getAssets(authUserId, email, fullName),
            this.getPurchaseOrders(authUserId, email, fullName),
            this.getValuations(authUserId, email, fullName),
            this.getTransfers(authUserId, email, fullName),
        ]);
        return buildInventoryDashboardStats({ products, warehouses, alerts, assets, purchaseOrders, valuations, transfers });
    }
}

export const inventoryService = new InventoryService();
