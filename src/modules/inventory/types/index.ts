export type InventoryTab =
    | "overview"
    | "catalog"
    | "categories"
    | "warehouses"
    | "movements"
    | "adjustments"
    | "purchaseOrders"
    | "suppliers"
    | "assets"
    | "barcodes"
    | "alerts"
    | "transfers"
    | "grn"
    | "valuation"
    | "reports"
    | "audit";

export interface InventoryDashboardStats {
    totalProducts: number;
    totalWarehouses: number;
    totalStockUnits: number;
    openAlerts: number;
    activeAssets: number;
    pendingPurchaseOrders: number;
    inventoryValue: number;
    openTransfers: number;
}

export interface ProductCategorySummary {
    id: string;
    name: string;
    slug: string;
    description: string;
    productCount: number;
}

export interface ProductSummary {
    id: string;
    sku: string;
    name: string;
    description: string;
    categoryName?: string | null;
    unitOfMeasure: string;
    unitCost: number;
    unitPrice: number;
    reorderLevel: number;
    totalStock: number;
    status: string;
}

export interface WarehouseSummary {
    id: string;
    name: string;
    code: string;
    location: string;
    managerName: string;
    status: string;
    productCount: number;
    totalUnits: number;
}

export interface StockMovementSummary {
    id: string;
    productName: string;
    warehouseName: string;
    movementType: string;
    quantity: number;
    referenceType: string;
    notes: string;
    movedAt: string;
}

export interface InventoryAdjustmentSummary {
    id: string;
    productName: string;
    warehouseName: string;
    adjustmentType: string;
    quantityDelta: number;
    reason: string;
    createdAt: string;
}

export interface SupplierSummary {
    id: string;
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    purchaseOrderCount: number;
}

export interface PurchaseOrderSummary {
    id: string;
    poNumber: string;
    supplierName: string;
    status: string;
    orderDate: string;
    expectedDate?: string | null;
    totalAmount: number;
    itemCount: number;
    financeLinked: boolean;
}

export interface AssetSummary {
    id: string;
    assetTag: string;
    name: string;
    category: string;
    serialNumber: string;
    purchaseCost: number;
    status: string;
    warehouseName?: string | null;
    projectName?: string | null;
    employeeName?: string | null;
}

export interface BarcodeSummary {
    id: string;
    barcodeValue: string;
    barcodeType: string;
    linkedName: string;
    linkedType: string;
}

export interface LowStockAlertSummary {
    id: string;
    productName: string;
    warehouseName: string;
    currentQuantity: number;
    reorderLevel: number;
    status: string;
    triggeredAt: string;
}

export interface StockTransferSummary {
    id: string;
    transferNumber: string;
    sourceWarehouse: string;
    destinationWarehouse: string;
    status: string;
    itemCount: number;
    transferredAt?: string | null;
}

export interface GrnSummary {
    id: string;
    grnNumber: string;
    purchaseOrderNumber?: string | null;
    warehouseName: string;
    supplierName?: string | null;
    status: string;
    receivedDate: string;
    itemCount: number;
}

export interface InventoryValuationSummary {
    id: string;
    valuationDate: string;
    method: string;
    totalValue: number;
    totalUnits: number;
    notes: string;
}

export interface InventoryAuditEntry {
    id: string;
    entityType: string;
    action: string;
    summary: string;
    createdAt: string;
}

export interface InventoryReport {
    stockByWarehouse: Array<{ warehouse: string; units: number; value: number }>;
    movementSummary: Array<{ type: string; count: number }>;
    categoryDistribution: Array<{ category: string; products: number }>;
    procurementStatus: Array<{ status: string; count: number }>;
    assetStatus: Array<{ status: string; count: number }>;
}

export interface CrossModuleLinks {
    financeExpenses: number;
    projectAssets: number;
    hrAssignedAssets: number;
    automationAlerts: number;
    analyticsMetrics: number;
}

export interface CreateCategoryInput { name: string; slug: string; description: string; }
export interface CreateProductInput { sku: string; name: string; description: string; categoryId?: string; unitOfMeasure: string; unitCost: number; unitPrice: number; reorderLevel: number; }
export interface CreateWarehouseInput { name: string; code: string; location: string; managerName: string; }
export interface CreateSupplierInput { name: string; code: string; email: string; phone: string; address: string; }
export interface CreatePurchaseOrderInput { supplierId: string; poNumber: string; notes: string; }
export interface CreateAssetInput { assetTag: string; name: string; category: string; serialNumber: string; purchaseCost: number; warehouseId?: string; }
export interface CreateBarcodeInput { barcodeValue: string; barcodeType: string; productId?: string; assetId?: string; }
export interface CreateAdjustmentInput { productId: string; warehouseId: string; quantityDelta: number; reason: string; }
export interface UpdateAlertStatusInput { status: string; }
