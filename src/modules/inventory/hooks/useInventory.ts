"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { inventoryService } from "@/src/modules/inventory/services/inventory.service";
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

export function useInventory() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<InventoryDashboardStats | null>(null);
    const [categories, setCategories] = useState<ProductCategorySummary[]>([]);
    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [warehouses, setWarehouses] = useState<WarehouseSummary[]>([]);
    const [movements, setMovements] = useState<StockMovementSummary[]>([]);
    const [adjustments, setAdjustments] = useState<InventoryAdjustmentSummary[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummary[]>([]);
    const [assets, setAssets] = useState<AssetSummary[]>([]);
    const [barcodes, setBarcodes] = useState<BarcodeSummary[]>([]);
    const [alerts, setAlerts] = useState<LowStockAlertSummary[]>([]);
    const [transfers, setTransfers] = useState<StockTransferSummary[]>([]);
    const [grns, setGrns] = useState<GrnSummary[]>([]);
    const [valuations, setValuations] = useState<InventoryValuationSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<InventoryAuditEntry[]>([]);
    const [report, setReport] = useState<InventoryReport | null>(null);
    const [crossModuleLinks, setCrossModuleLinks] = useState<CrossModuleLinks | null>(null);

    const fetchInventoryData = useCallback(async () => {
        if (!user) {
            return {
                dashboardStats: null,
                categoryList: [],
                productList: [],
                warehouseList: [],
                movementList: [],
                adjustmentList: [],
                supplierList: [],
                purchaseOrderList: [],
                assetList: [],
                barcodeList: [],
                alertList: [],
                transferList: [],
                grnList: [],
                valuationList: [],
                auditLogList: [],
                inventoryReport: null,
                crossLinks: null,
            };
        }

        const [
            dashboardStats,
            categoryList,
            productList,
            warehouseList,
            movementList,
            adjustmentList,
            supplierList,
            purchaseOrderList,
            assetList,
            barcodeList,
            alertList,
            transferList,
            grnList,
            valuationList,
            auditLogList,
            inventoryReport,
            crossLinks,
        ] = await Promise.all([
            inventoryService.getDashboardStats(user.id, user.email, user.fullName),
            inventoryService.getCategories(user.id, user.email, user.fullName),
            inventoryService.getProducts(user.id, user.email, user.fullName),
            inventoryService.getWarehouses(user.id, user.email, user.fullName),
            inventoryService.getMovements(user.id, user.email, user.fullName),
            inventoryService.getAdjustments(user.id, user.email, user.fullName),
            inventoryService.getSuppliers(user.id, user.email, user.fullName),
            inventoryService.getPurchaseOrders(user.id, user.email, user.fullName),
            inventoryService.getAssets(user.id, user.email, user.fullName),
            inventoryService.getBarcodes(user.id, user.email, user.fullName),
            inventoryService.getAlerts(user.id, user.email, user.fullName),
            inventoryService.getTransfers(user.id, user.email, user.fullName),
            inventoryService.getGrns(user.id, user.email, user.fullName),
            inventoryService.getValuations(user.id, user.email, user.fullName),
            inventoryService.getAuditLogs(user.id, user.email, user.fullName),
            inventoryService.getReport(user.id, user.email, user.fullName),
            inventoryService.getCrossModuleLinks(user.id, user.email, user.fullName),
        ]);

        return {
            dashboardStats,
            categoryList,
            productList,
            warehouseList,
            movementList,
            adjustmentList,
            supplierList,
            purchaseOrderList,
            assetList,
            barcodeList,
            alertList,
            transferList,
            grnList,
            valuationList,
            auditLogList,
            inventoryReport,
            crossLinks,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchInventoryData>>) => {
        setStats(data.dashboardStats);
        setCategories(data.categoryList);
        setProducts(data.productList);
        setWarehouses(data.warehouseList);
        setMovements(data.movementList);
        setAdjustments(data.adjustmentList);
        setSuppliers(data.supplierList);
        setPurchaseOrders(data.purchaseOrderList);
        setAssets(data.assetList);
        setBarcodes(data.barcodeList);
        setAlerts(data.alertList);
        setTransfers(data.transferList);
        setGrns(data.grnList);
        setValuations(data.valuationList);
        setAuditLogs(data.auditLogList);
        setReport(data.inventoryReport);
        setCrossModuleLinks(data.crossLinks);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => {
        const data = await fetchInventoryData();
        applyData(data);
    }, [fetchInventoryData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchInventoryData()
            .then((data) => {
                if (cancelled) return;
                applyData(data);
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [fetchInventoryData, applyData]);

    const createCategory = useCallback(async (input: CreateCategoryInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createCategory(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createProduct = useCallback(async (input: CreateProductInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createProduct(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createWarehouse = useCallback(async (input: CreateWarehouseInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createWarehouse(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createAdjustment = useCallback(async (input: CreateAdjustmentInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createAdjustment(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createSupplier = useCallback(async (input: CreateSupplierInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createSupplier(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createPurchaseOrder = useCallback(async (input: CreatePurchaseOrderInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createPurchaseOrder(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createAsset = useCallback(async (input: CreateAssetInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createAsset(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createBarcode = useCallback(async (input: CreateBarcodeInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.createBarcode(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateAlertStatus = useCallback(async (alertId: string, input: UpdateAlertStatusInput) => {
        if (!user) throw new Error("Authentication required");
        await inventoryService.updateAlertStatus(user.id, user.email, alertId, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    return {
        loading,
        stats,
        categories,
        products,
        warehouses,
        movements,
        adjustments,
        suppliers,
        purchaseOrders,
        assets,
        barcodes,
        alerts,
        transfers,
        grns,
        valuations,
        auditLogs,
        report,
        crossModuleLinks,
        createCategory,
        createProduct,
        createWarehouse,
        createAdjustment,
        createSupplier,
        createPurchaseOrder,
        createAsset,
        createBarcode,
        updateAlertStatus,
        refresh,
    };
}
