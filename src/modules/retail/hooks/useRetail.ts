"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { retailService } from "@/src/modules/retail/services/retail.service";
import type {
    RetailHubSummary,
    CreateRetailHubInput,
    RetailBrandSummary,
    CreateRetailBrandInput,
    StoreSummary,
    CreateStoreInput,
    CashRegisterSummary,
    CreateCashRegisterInput,
    StoreDepartmentSummary,
    CreateStoreDepartmentInput,
    ProductSummary,
    CreateProductInput,
    ProductCategorySummary,
    CreateProductCategoryInput,
    ProductVariantSummary,
    CreateProductVariantInput,
    PromotionSummary,
    CreatePromotionInput,
    SalesOrderSummary,
    CreateSalesOrderInput,
    PosTransactionSummary,
    CreatePosTransactionInput,
    ReturnsExchangeSummary,
    CreateReturnsExchangeInput,
    ShiftClosingSummary,
    CreateShiftClosingInput,
    WarehouseSummary,
    CreateWarehouseInput,
    StockLevelSummary,
    CreateStockLevelInput,
    PurchaseOrderSummary,
    CreatePurchaseOrderInput,
    SupplierSummary,
    CreateSupplierInput,
    CustomerProfileSummary,
    CreateCustomerProfileInput,
    LoyaltyProgramSummary,
    CreateLoyaltyProgramInput,
    RewardPointSummary,
    CreateRewardPointInput,
    CampaignSummary,
    CreateCampaignInput,
    DailyClosingSummary,
    CreateDailyClosingInput,
    BranchPerformanceSummary,
    CreateBranchPerformanceInput,
    CommissionRecordSummary,
    CreateCommissionRecordInput,
    SalesAnalyticsSummary,
    CreateSalesAnalyticsInput,
    InventoryAnalyticsSummary,
    CreateInventoryAnalyticsInput,
    ProfitabilityAnalyticsSummary,
    CreateProfitabilityAnalyticsInput,
    RetailMetricSummary,
    CreateRetailMetricInput,
    RetailHealthSummary,
    CreateRetailHealthInput,
    ExecutiveKpiSummary,
    CreateExecutiveKpiInput,
    RetailFailureSummary,
    CreateRetailFailureInput,
    AuditEntry,
    RtlDashboardStats,
    RtlPipelineInfo,
} from "@/src/modules/retail/types";

export function useRetail() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<RtlDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<RtlPipelineInfo | null>(null);
    const [retailHubs, setRetailHubs] = useState<RetailHubSummary[]>([]);
    const [retailBrands, setRetailBrands] = useState<RetailBrandSummary[]>([]);
    const [stores, setStores] = useState<StoreSummary[]>([]);
    const [cashRegisters, setCashRegisters] = useState<CashRegisterSummary[]>([]);
    const [storeDepartments, setStoreDepartments] = useState<StoreDepartmentSummary[]>([]);
    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [productCategories, setProductCategorys] = useState<ProductCategorySummary[]>([]);
    const [productVariants, setProductVariants] = useState<ProductVariantSummary[]>([]);
    const [promotions, setPromotions] = useState<PromotionSummary[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrderSummary[]>([]);
    const [posTransactions, setPosTransactions] = useState<PosTransactionSummary[]>([]);
    const [returnsExchanges, setReturnsExchanges] = useState<ReturnsExchangeSummary[]>([]);
    const [shiftClosings, setShiftClosings] = useState<ShiftClosingSummary[]>([]);
    const [warehouses, setWarehouses] = useState<WarehouseSummary[]>([]);
    const [stockLevels, setStockLevels] = useState<StockLevelSummary[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummary[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
    const [customerProfiles, setCustomerProfiles] = useState<CustomerProfileSummary[]>([]);
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramSummary[]>([]);
    const [rewardPoints, setRewardPoints] = useState<RewardPointSummary[]>([]);
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
    const [dailyClosings, setDailyClosings] = useState<DailyClosingSummary[]>([]);
    const [branchPerformance, setBranchPerformances] = useState<BranchPerformanceSummary[]>([]);
    const [commissionRecords, setCommissionRecords] = useState<CommissionRecordSummary[]>([]);
    const [salesAnalytics, setSalesAnalyticss] = useState<SalesAnalyticsSummary[]>([]);
    const [inventoryAnalytics, setInventoryAnalyticss] = useState<InventoryAnalyticsSummary[]>([]);
    const [profitabilityAnalytics, setProfitabilityAnalyticss] = useState<ProfitabilityAnalyticsSummary[]>([]);
    const [retailMetrics, setRetailMetrics] = useState<RetailMetricSummary[]>([]);
    const [retailHealth, setRetailHealths] = useState<RetailHealthSummary[]>([]);
    const [executiveKpis, setExecutiveKpis] = useState<ExecutiveKpiSummary[]>([]);
    const [retailFailures, setRetailFailures] = useState<RetailFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [retailHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
retailHubsList,
            retailBrandsList,
            storesList,
            cashRegistersList,
            storeDepartmentsList,
            productsList,
            productCategoriesList,
            productVariantsList,
            promotionsList,
            salesOrdersList,
            posTransactionsList,
            returnsExchangesList,
            shiftClosingsList,
            warehousesList,
            stockLevelsList,
            purchaseOrdersList,
            suppliersList,
            customerProfilesList,
            loyaltyProgramsList,
            rewardPointsList,
            campaignsList,
            dailyClosingsList,
            branchPerformanceList,
            commissionRecordsList,
            salesAnalyticsList,
            inventoryAnalyticsList,
            profitabilityAnalyticsList,
            retailMetricsList,
            retailHealthList,
            executiveKpisList,
            retailFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            retailService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(retailService.getPipelineInfo()),
            retailService.getRetailHubs(authUserId, email, fullName),
            retailService.getRetailBrands(authUserId, email, fullName),
            retailService.getStores(authUserId, email, fullName),
            retailService.getCashRegisters(authUserId, email, fullName),
            retailService.getStoreDepartments(authUserId, email, fullName),
            retailService.getProducts(authUserId, email, fullName),
            retailService.getProductCategorys(authUserId, email, fullName),
            retailService.getProductVariants(authUserId, email, fullName),
            retailService.getPromotions(authUserId, email, fullName),
            retailService.getSalesOrders(authUserId, email, fullName),
            retailService.getPosTransactions(authUserId, email, fullName),
            retailService.getReturnsExchanges(authUserId, email, fullName),
            retailService.getShiftClosings(authUserId, email, fullName),
            retailService.getWarehouses(authUserId, email, fullName),
            retailService.getStockLevels(authUserId, email, fullName),
            retailService.getPurchaseOrders(authUserId, email, fullName),
            retailService.getSuppliers(authUserId, email, fullName),
            retailService.getCustomerProfiles(authUserId, email, fullName),
            retailService.getLoyaltyPrograms(authUserId, email, fullName),
            retailService.getRewardPoints(authUserId, email, fullName),
            retailService.getCampaigns(authUserId, email, fullName),
            retailService.getDailyClosings(authUserId, email, fullName),
            retailService.getBranchPerformances(authUserId, email, fullName),
            retailService.getCommissionRecords(authUserId, email, fullName),
            retailService.getSalesAnalyticss(authUserId, email, fullName),
            retailService.getInventoryAnalyticss(authUserId, email, fullName),
            retailService.getProfitabilityAnalyticss(authUserId, email, fullName),
            retailService.getRetailMetrics(authUserId, email, fullName),
            retailService.getRetailHealths(authUserId, email, fullName),
            retailService.getExecutiveKpis(authUserId, email, fullName),
            retailService.getRetailFailures(authUserId, email, fullName),
            retailService.getAuditLogs(authUserId, email, fullName),
            retailService.getRetailHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
retailHubsList,
            retailBrandsList,
            storesList,
            cashRegistersList,
            storeDepartmentsList,
            productsList,
            productCategoriesList,
            productVariantsList,
            promotionsList,
            salesOrdersList,
            posTransactionsList,
            returnsExchangesList,
            shiftClosingsList,
            warehousesList,
            stockLevelsList,
            purchaseOrdersList,
            suppliersList,
            customerProfilesList,
            loyaltyProgramsList,
            rewardPointsList,
            campaignsList,
            dailyClosingsList,
            branchPerformanceList,
            commissionRecordsList,
            salesAnalyticsList,
            inventoryAnalyticsList,
            profitabilityAnalyticsList,
            retailMetricsList,
            retailHealthList,
            executiveKpisList,
            retailFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setRetailHubs(result.retailHubsList);
        setRetailBrands(result.retailBrandsList);
        setStores(result.storesList);
        setCashRegisters(result.cashRegistersList);
        setStoreDepartments(result.storeDepartmentsList);
        setProducts(result.productsList);
        setProductCategorys(result.productCategoriesList);
        setProductVariants(result.productVariantsList);
        setPromotions(result.promotionsList);
        setSalesOrders(result.salesOrdersList);
        setPosTransactions(result.posTransactionsList);
        setReturnsExchanges(result.returnsExchangesList);
        setShiftClosings(result.shiftClosingsList);
        setWarehouses(result.warehousesList);
        setStockLevels(result.stockLevelsList);
        setPurchaseOrders(result.purchaseOrdersList);
        setSuppliers(result.suppliersList);
        setCustomerProfiles(result.customerProfilesList);
        setLoyaltyPrograms(result.loyaltyProgramsList);
        setRewardPoints(result.rewardPointsList);
        setCampaigns(result.campaignsList);
        setDailyClosings(result.dailyClosingsList);
        setBranchPerformances(result.branchPerformanceList);
        setCommissionRecords(result.commissionRecordsList);
        setSalesAnalyticss(result.salesAnalyticsList);
        setInventoryAnalyticss(result.inventoryAnalyticsList);
        setProfitabilityAnalyticss(result.profitabilityAnalyticsList);
        setRetailMetrics(result.retailMetricsList);
        setRetailHealths(result.retailHealthList);
        setExecutiveKpis(result.executiveKpisList);
        setRetailFailures(result.retailFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createRetailHub = useCallback(async (input: CreateRetailHubInput) => { if (!user) throw new Error("Authentication required"); await retailService.createRetailHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetailBrand = useCallback(async (input: CreateRetailBrandInput) => { if (!user) throw new Error("Authentication required"); await retailService.createRetailBrand(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStore = useCallback(async (input: CreateStoreInput) => { if (!user) throw new Error("Authentication required"); await retailService.createStore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCashRegister = useCallback(async (input: CreateCashRegisterInput) => { if (!user) throw new Error("Authentication required"); await retailService.createCashRegister(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStoreDepartment = useCallback(async (input: CreateStoreDepartmentInput) => { if (!user) throw new Error("Authentication required"); await retailService.createStoreDepartment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProduct = useCallback(async (input: CreateProductInput) => { if (!user) throw new Error("Authentication required"); await retailService.createProduct(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProductCategory = useCallback(async (input: CreateProductCategoryInput) => { if (!user) throw new Error("Authentication required"); await retailService.createProductCategory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProductVariant = useCallback(async (input: CreateProductVariantInput) => { if (!user) throw new Error("Authentication required"); await retailService.createProductVariant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPromotion = useCallback(async (input: CreatePromotionInput) => { if (!user) throw new Error("Authentication required"); await retailService.createPromotion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSalesOrder = useCallback(async (input: CreateSalesOrderInput) => { if (!user) throw new Error("Authentication required"); await retailService.createSalesOrder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPosTransaction = useCallback(async (input: CreatePosTransactionInput) => { if (!user) throw new Error("Authentication required"); await retailService.createPosTransaction(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReturnsExchange = useCallback(async (input: CreateReturnsExchangeInput) => { if (!user) throw new Error("Authentication required"); await retailService.createReturnsExchange(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createShiftClosing = useCallback(async (input: CreateShiftClosingInput) => { if (!user) throw new Error("Authentication required"); await retailService.createShiftClosing(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWarehouse = useCallback(async (input: CreateWarehouseInput) => { if (!user) throw new Error("Authentication required"); await retailService.createWarehouse(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStockLevel = useCallback(async (input: CreateStockLevelInput) => { if (!user) throw new Error("Authentication required"); await retailService.createStockLevel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPurchaseOrder = useCallback(async (input: CreatePurchaseOrderInput) => { if (!user) throw new Error("Authentication required"); await retailService.createPurchaseOrder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSupplier = useCallback(async (input: CreateSupplierInput) => { if (!user) throw new Error("Authentication required"); await retailService.createSupplier(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerProfile = useCallback(async (input: CreateCustomerProfileInput) => { if (!user) throw new Error("Authentication required"); await retailService.createCustomerProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLoyaltyProgram = useCallback(async (input: CreateLoyaltyProgramInput) => { if (!user) throw new Error("Authentication required"); await retailService.createLoyaltyProgram(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRewardPoint = useCallback(async (input: CreateRewardPointInput) => { if (!user) throw new Error("Authentication required"); await retailService.createRewardPoint(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampaign = useCallback(async (input: CreateCampaignInput) => { if (!user) throw new Error("Authentication required"); await retailService.createCampaign(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDailyClosing = useCallback(async (input: CreateDailyClosingInput) => { if (!user) throw new Error("Authentication required"); await retailService.createDailyClosing(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBranchPerformance = useCallback(async (input: CreateBranchPerformanceInput) => { if (!user) throw new Error("Authentication required"); await retailService.createBranchPerformance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommissionRecord = useCallback(async (input: CreateCommissionRecordInput) => { if (!user) throw new Error("Authentication required"); await retailService.createCommissionRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSalesAnalytics = useCallback(async (input: CreateSalesAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await retailService.createSalesAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInventoryAnalytics = useCallback(async (input: CreateInventoryAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await retailService.createInventoryAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProfitabilityAnalytics = useCallback(async (input: CreateProfitabilityAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await retailService.createProfitabilityAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetailMetric = useCallback(async (input: CreateRetailMetricInput) => { if (!user) throw new Error("Authentication required"); await retailService.createRetailMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetailHealth = useCallback(async (input: CreateRetailHealthInput) => { if (!user) throw new Error("Authentication required"); await retailService.createRetailHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveKpi = useCallback(async (input: CreateExecutiveKpiInput) => { if (!user) throw new Error("Authentication required"); await retailService.createExecutiveKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetailFailure = useCallback(async (input: CreateRetailFailureInput) => { if (!user) throw new Error("Authentication required"); await retailService.createRetailFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        retailHubs,
        createRetailHub,
        retailBrands,
        createRetailBrand,
        stores,
        createStore,
        cashRegisters,
        createCashRegister,
        storeDepartments,
        createStoreDepartment,
        products,
        createProduct,
        productCategories,
        createProductCategory,
        productVariants,
        createProductVariant,
        promotions,
        createPromotion,
        salesOrders,
        createSalesOrder,
        posTransactions,
        createPosTransaction,
        returnsExchanges,
        createReturnsExchange,
        shiftClosings,
        createShiftClosing,
        warehouses,
        createWarehouse,
        stockLevels,
        createStockLevel,
        purchaseOrders,
        createPurchaseOrder,
        suppliers,
        createSupplier,
        customerProfiles,
        createCustomerProfile,
        loyaltyPrograms,
        createLoyaltyProgram,
        rewardPoints,
        createRewardPoint,
        campaigns,
        createCampaign,
        dailyClosings,
        createDailyClosing,
        branchPerformance,
        createBranchPerformance,
        commissionRecords,
        createCommissionRecord,
        salesAnalytics,
        createSalesAnalytics,
        inventoryAnalytics,
        createInventoryAnalytics,
        profitabilityAnalytics,
        createProfitabilityAnalytics,
        retailMetrics,
        createRetailMetric,
        retailHealth,
        createRetailHealth,
        executiveKpis,
        createExecutiveKpi,
        retailFailures,
        createRetailFailure,
        auditLogs,
        retailHubOptions,
        refresh,
    };
}
