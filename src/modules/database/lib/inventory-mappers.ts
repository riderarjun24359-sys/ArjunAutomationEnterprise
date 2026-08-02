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
    WarehouseSummary,
} from "@/src/modules/inventory/types";

type LookupMaps = {
    categories: Map<string, DbProductCategory>;
    products: Map<string, DbProduct>;
    warehouses: Map<string, DbWarehouse>;
    suppliers: Map<string, DbSupplier>;
    purchaseOrders: Map<string, DbPurchaseOrder>;
    stockLevels: DbStockLevel[];
};

export const buildLookupMaps = (
    categories: DbProductCategory[],
    products: DbProduct[],
    warehouses: DbWarehouse[],
    suppliers: DbSupplier[],
    purchaseOrders: DbPurchaseOrder[],
    stockLevels: DbStockLevel[],
): LookupMaps => ({
    categories: new Map(categories.map((item) => [item.id, item])),
    products: new Map(products.map((item) => [item.id, item])),
    warehouses: new Map(warehouses.map((item) => [item.id, item])),
    suppliers: new Map(suppliers.map((item) => [item.id, item])),
    purchaseOrders: new Map(purchaseOrders.map((item) => [item.id, item])),
    stockLevels,
});

const productStock = (productId: string, levels: DbStockLevel[]) =>
    levels.filter((level) => level.product_id === productId).reduce((sum, level) => sum + Number(level.quantity), 0);

export const mapCategorySummary = (record: DbProductCategory, productCount: number): ProductCategorySummary => ({
    id: record.id, name: record.name, slug: record.slug, description: record.description, productCount,
});

export const mapProductSummary = (record: DbProduct, maps: LookupMaps): ProductSummary => ({
    id: record.id,
    sku: record.sku,
    name: record.name,
    description: record.description,
    categoryName: record.category_id ? maps.categories.get(record.category_id)?.name ?? null : null,
    unitOfMeasure: record.unit_of_measure,
    unitCost: Number(record.unit_cost),
    unitPrice: Number(record.unit_price),
    reorderLevel: Number(record.reorder_level),
    totalStock: productStock(record.id, maps.stockLevels),
    status: record.status,
});

export const mapWarehouseSummary = (record: DbWarehouse, levels: DbStockLevel[]): WarehouseSummary => {
    const warehouseLevels = levels.filter((level) => level.warehouse_id === record.id);
    return {
        id: record.id,
        name: record.name,
        code: record.code,
        location: record.location,
        managerName: record.manager_name,
        status: record.status,
        productCount: new Set(warehouseLevels.map((level) => level.product_id)).size,
        totalUnits: warehouseLevels.reduce((sum, level) => sum + Number(level.quantity), 0),
    };
};

export const mapStockMovement = (record: DbStockMovement, maps: LookupMaps): StockMovementSummary => ({
    id: record.id,
    productName: maps.products.get(record.product_id)?.name ?? "Unknown",
    warehouseName: maps.warehouses.get(record.warehouse_id)?.name ?? "Unknown",
    movementType: record.movement_type,
    quantity: Number(record.quantity),
    referenceType: record.reference_type,
    notes: record.notes,
    movedAt: record.moved_at,
});

export const mapAdjustment = (record: DbInventoryAdjustment, maps: LookupMaps): InventoryAdjustmentSummary => ({
    id: record.id,
    productName: maps.products.get(record.product_id)?.name ?? "Unknown",
    warehouseName: maps.warehouses.get(record.warehouse_id)?.name ?? "Unknown",
    adjustmentType: record.adjustment_type,
    quantityDelta: Number(record.quantity_delta),
    reason: record.reason,
    createdAt: record.created_at,
});

export const mapSupplierSummary = (record: DbSupplier, poCount: number): SupplierSummary => ({
    id: record.id, name: record.name, code: record.code, email: record.email, phone: record.phone, address: record.address, status: record.status, purchaseOrderCount: poCount,
});

export const mapPurchaseOrder = (record: DbPurchaseOrder, items: DbPurchaseOrderItem[], maps: LookupMaps): PurchaseOrderSummary => ({
    id: record.id,
    poNumber: record.po_number,
    supplierName: maps.suppliers.get(record.supplier_id)?.name ?? "Unknown",
    status: record.status,
    orderDate: record.order_date,
    expectedDate: record.expected_date,
    totalAmount: Number(record.total_amount),
    itemCount: items.length,
    financeLinked: Boolean(record.expense_id),
});

export const mapAssetSummary = (
    record: DbAsset,
    warehouse?: DbWarehouse | null,
    projectName?: string | null,
    employeeName?: string | null,
): AssetSummary => ({
    id: record.id,
    assetTag: record.asset_tag,
    name: record.name,
    category: record.category,
    serialNumber: record.serial_number,
    purchaseCost: Number(record.purchase_cost),
    status: record.status,
    warehouseName: warehouse?.name ?? null,
    projectName: projectName ?? null,
    employeeName: employeeName ?? null,
});

export const mapBarcode = (record: DbProductBarcode, product?: DbProduct | null, asset?: DbAsset | null): BarcodeSummary => ({
    id: record.id,
    barcodeValue: record.barcode_value,
    barcodeType: record.barcode_type,
    linkedName: product?.name ?? asset?.name ?? "Unlinked",
    linkedType: product ? "product" : asset ? "asset" : "unknown",
});

export const mapLowStockAlert = (record: DbLowStockAlert, maps: LookupMaps): LowStockAlertSummary => ({
    id: record.id,
    productName: maps.products.get(record.product_id)?.name ?? "Unknown",
    warehouseName: maps.warehouses.get(record.warehouse_id)?.name ?? "Unknown",
    currentQuantity: Number(record.current_quantity),
    reorderLevel: Number(record.reorder_level),
    status: record.status,
    triggeredAt: record.triggered_at,
});

export const mapStockTransfer = (record: DbStockTransfer, items: DbStockTransferItem[], maps: LookupMaps): StockTransferSummary => ({
    id: record.id,
    transferNumber: record.transfer_number,
    sourceWarehouse: maps.warehouses.get(record.source_warehouse_id)?.name ?? "Unknown",
    destinationWarehouse: maps.warehouses.get(record.destination_warehouse_id)?.name ?? "Unknown",
    status: record.status,
    itemCount: items.length,
    transferredAt: record.transferred_at,
});

export const mapGrn = (
    record: DbGoodsReceivedNote,
    items: DbGrnItem[],
    maps: LookupMaps,
): GrnSummary => ({
    id: record.id,
    grnNumber: record.grn_number,
    purchaseOrderNumber: record.purchase_order_id ? maps.purchaseOrders.get(record.purchase_order_id)?.po_number ?? null : null,
    warehouseName: maps.warehouses.get(record.warehouse_id)?.name ?? "Unknown",
    supplierName: record.supplier_id ? maps.suppliers.get(record.supplier_id)?.name ?? null : null,
    status: record.status,
    receivedDate: record.received_date,
    itemCount: items.length,
});

export const mapValuation = (record: DbInventoryValuation): InventoryValuationSummary => ({
    id: record.id,
    valuationDate: record.valuation_date,
    method: record.method,
    totalValue: Number(record.total_value),
    totalUnits: Number(record.total_units),
    notes: record.notes,
});

export const mapAuditEntry = (record: DbInventoryAuditLog): InventoryAuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildInventoryDashboardStats = (input: {
    products: ProductSummary[];
    warehouses: WarehouseSummary[];
    alerts: LowStockAlertSummary[];
    assets: AssetSummary[];
    purchaseOrders: PurchaseOrderSummary[];
    valuations: InventoryValuationSummary[];
    transfers: StockTransferSummary[];
}): InventoryDashboardStats => ({
    totalProducts: input.products.length,
    totalWarehouses: input.warehouses.length,
    totalStockUnits: input.products.reduce((sum, product) => sum + product.totalStock, 0),
    openAlerts: input.alerts.filter((alert) => alert.status === "open").length,
    activeAssets: input.assets.filter((asset) => asset.status !== "retired").length,
    pendingPurchaseOrders: input.purchaseOrders.filter((po) => po.status === "draft" || po.status === "approved").length,
    inventoryValue: input.valuations[0]?.totalValue ?? input.products.reduce((sum, product) => sum + product.unitCost * product.totalStock, 0),
    openTransfers: input.transfers.filter((transfer) => transfer.status === "pending").length,
});

export const buildInventoryReport = (input: {
    warehouses: WarehouseSummary[];
    movements: StockMovementSummary[];
    categories: ProductCategorySummary[];
    purchaseOrders: PurchaseOrderSummary[];
    assets: AssetSummary[];
}): InventoryReport => ({
    stockByWarehouse: input.warehouses.map((warehouse) => ({ warehouse: warehouse.name, units: warehouse.totalUnits, value: warehouse.totalUnits * 100 })),
    movementSummary: Array.from(input.movements.reduce((map, movement) => {
        map.set(movement.movementType, (map.get(movement.movementType) ?? 0) + 1);
        return map;
    }, new Map<string, number>())).map(([type, count]) => ({ type, count })),
    categoryDistribution: input.categories.map((category) => ({ category: category.name, products: category.productCount })),
    procurementStatus: Array.from(input.purchaseOrders.reduce((map, po) => {
        map.set(po.status, (map.get(po.status) ?? 0) + 1);
        return map;
    }, new Map<string, number>())).map(([status, count]) => ({ status, count })),
    assetStatus: Array.from(input.assets.reduce((map, asset) => {
        map.set(asset.status, (map.get(asset.status) ?? 0) + 1);
        return map;
    }, new Map<string, number>())).map(([status, count]) => ({ status, count })),
});

export const buildCrossModuleLinks = (input: {
    purchaseOrders: PurchaseOrderSummary[];
    assets: AssetSummary[];
    alerts: LowStockAlertSummary[];
    productCount: number;
}): CrossModuleLinks => ({
    financeExpenses: input.purchaseOrders.filter((po) => po.financeLinked).length,
    projectAssets: input.assets.filter((asset) => asset.projectName).length,
    hrAssignedAssets: input.assets.filter((asset) => asset.employeeName).length,
    automationAlerts: input.alerts.filter((alert) => alert.status === "open").length,
    analyticsMetrics: input.productCount,
});

export const buildCategoryPayload = (organizationId: string, input: CreateCategoryInput) => ({
    organization_id: organizationId, name: input.name, slug: input.slug, description: input.description,
});

export const buildProductPayload = (organizationId: string, input: CreateProductInput) => ({
    organization_id: organizationId,
    category_id: input.categoryId ?? null,
    sku: input.sku,
    name: input.name,
    description: input.description,
    unit_of_measure: input.unitOfMeasure,
    unit_cost: input.unitCost,
    unit_price: input.unitPrice,
    reorder_level: input.reorderLevel,
    status: "active",
});

export const buildWarehousePayload = (organizationId: string, input: CreateWarehouseInput) => ({
    organization_id: organizationId, name: input.name, code: input.code, location: input.location, manager_name: input.managerName, status: "active",
});

export const buildSupplierPayload = (organizationId: string, input: CreateSupplierInput) => ({
    organization_id: organizationId, name: input.name, code: input.code, email: input.email, phone: input.phone, address: input.address, status: "active",
});

export const buildPurchaseOrderPayload = (organizationId: string, input: CreatePurchaseOrderInput) => ({
    organization_id: organizationId, supplier_id: input.supplierId, po_number: input.poNumber, notes: input.notes, status: "draft", total_amount: 0,
});

export const buildAssetPayload = (organizationId: string, input: CreateAssetInput) => ({
    organization_id: organizationId,
    asset_tag: input.assetTag,
    name: input.name,
    category: input.category,
    serial_number: input.serialNumber,
    purchase_cost: input.purchaseCost,
    warehouse_id: input.warehouseId ?? null,
    status: "available",
});

export const buildBarcodePayload = (organizationId: string, input: CreateBarcodeInput) => ({
    organization_id: organizationId,
    product_id: input.productId ?? null,
    asset_id: input.assetId ?? null,
    barcode_value: input.barcodeValue,
    barcode_type: input.barcodeType,
});

export const buildAdjustmentPayload = (organizationId: string, profileId: string | null, input: CreateAdjustmentInput) => ({
    organization_id: organizationId,
    product_id: input.productId,
    warehouse_id: input.warehouseId,
    quantity_delta: input.quantityDelta,
    reason: input.reason,
    adjustment_type: "correction",
    adjusted_by: profileId,
});

export const buildInventoryAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});
