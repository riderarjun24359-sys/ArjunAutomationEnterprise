export interface RtlDashboardStats {
    totalRetailHubs: number;
    activeRetailHubs: number;
    retailBrandCount: number;
    customerProfileCount: number;
    salesOrderCount: number;
    openPosTransactionCount: number;
    openRetailFailureCount: number;
    overallRetailScore: number;
    revenueTotalScore: number;
    profitTotalScore: number;
    salesCountScore: number;
    inventoryValueScore: number;
    customerRetentionRateScore: number;
    auditCount: number;
}

export interface RtlPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface RtlSdkRegisterRetailBrandInput { retailHubId: string; brandKey?: string; brandName?: string; }
export interface RtlSdkRegisterRetailBrandResult { brandId: string; brandKey: string; status: string; }
export interface RtlSdkConfigureCustomerProfileInput { retailHubId: string; profileKey?: string; profileName?: string; }
export interface RtlSdkConfigureCustomerProfileResult { profileId: string; profileKey: string; status: string; }
export interface RtlSdkRunSalesOrderWorkflowInput { retailHubId: string; orderKey?: string; orderName?: string; }
export interface RtlSdkRunSalesOrderWorkflowResult { orderId: string; orderKey: string; status: string; }

export interface RetailHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateRetailHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface RetailBrandSummary {
    id: string;
    hubName?: string;
        brandKey: string;
    brandName: string;
    brandType: string;
    status: string;
}

export interface CreateRetailBrandInput {
        retailHubId: string;
        brandKey?: string;
    brandName?: string;
    brandType?: string;
}

export interface StoreSummary {
    id: string;
    hubName?: string;
        storeKey: string;
    storeName: string;
    storeType: string;
    status: string;
}

export interface CreateStoreInput {
        retailHubId: string;
        storeKey?: string;
    storeName?: string;
    storeType?: string;
}

export interface CashRegisterSummary {
    id: string;
    hubName?: string;
        registerKey: string;
    registerName: string;
    registerStatus: string;
    status: string;
}

export interface CreateCashRegisterInput {
        retailHubId: string;
        registerKey?: string;
    registerName?: string;
    registerStatus?: string;
}

export interface StoreDepartmentSummary {
    id: string;
    hubName?: string;
        departmentKey: string;
    departmentName: string;
    departmentType: string;
    status: string;
}

export interface CreateStoreDepartmentInput {
        retailHubId: string;
        departmentKey?: string;
    departmentName?: string;
    departmentType?: string;
}

export interface ProductSummary {
    id: string;
    hubName?: string;
        productKey: string;
    productName: string;
    productType: string;
    status: string;
}

export interface CreateProductInput {
        retailHubId: string;
        productKey?: string;
    productName?: string;
    productType?: string;
}

export interface ProductCategorySummary {
    id: string;
    hubName?: string;
        categoryKey: string;
    categoryName: string;
    categoryType: string;
    status: string;
}

export interface CreateProductCategoryInput {
        retailHubId: string;
        categoryKey?: string;
    categoryName?: string;
    categoryType?: string;
}

export interface ProductVariantSummary {
    id: string;
    hubName?: string;
        variantKey: string;
    variantName: string;
    variantType: string;
    status: string;
}

export interface CreateProductVariantInput {
        retailHubId: string;
        variantKey?: string;
    variantName?: string;
    variantType?: string;
}

export interface PromotionSummary {
    id: string;
    hubName?: string;
        promotionKey: string;
    promotionName: string;
    promotionStatus: string;
    status: string;
}

export interface CreatePromotionInput {
        retailHubId: string;
        promotionKey?: string;
    promotionName?: string;
    promotionStatus?: string;
}

export interface SalesOrderSummary {
    id: string;
    hubName?: string;
        orderKey: string;
    orderName: string;
    orderStatus: string;
    status: string;
}

export interface CreateSalesOrderInput {
        retailHubId: string;
        orderKey?: string;
    orderName?: string;
    orderStatus?: string;
}

export interface PosTransactionSummary {
    id: string;
    hubName?: string;
        transactionKey: string;
    transactionName: string;
    transactionStatus: string;
    status: string;
}

export interface CreatePosTransactionInput {
        retailHubId: string;
        transactionKey?: string;
    transactionName?: string;
    transactionStatus?: string;
}

export interface ReturnsExchangeSummary {
    id: string;
    hubName?: string;
        returnKey: string;
    returnName: string;
    returnStatus: string;
    status: string;
}

export interface CreateReturnsExchangeInput {
        retailHubId: string;
        returnKey?: string;
    returnName?: string;
    returnStatus?: string;
}

export interface ShiftClosingSummary {
    id: string;
    hubName?: string;
        closingKey: string;
    closingName: string;
    closingStatus: string;
    status: string;
}

export interface CreateShiftClosingInput {
        retailHubId: string;
        closingKey?: string;
    closingName?: string;
    closingStatus?: string;
}

export interface WarehouseSummary {
    id: string;
    hubName?: string;
        warehouseKey: string;
    warehouseName: string;
    warehouseType: string;
    status: string;
}

export interface CreateWarehouseInput {
        retailHubId: string;
        warehouseKey?: string;
    warehouseName?: string;
    warehouseType?: string;
}

export interface StockLevelSummary {
    id: string;
    hubName?: string;
        stockKey: string;
    stockName: string;
    stockQuantity: number;
    status: string;
}

export interface CreateStockLevelInput {
        retailHubId: string;
        stockKey?: string;
    stockName?: string;
    stockQuantity?: number;
}

export interface PurchaseOrderSummary {
    id: string;
    hubName?: string;
        orderKey: string;
    orderName: string;
    orderStatus: string;
    status: string;
}

export interface CreatePurchaseOrderInput {
        retailHubId: string;
        orderKey?: string;
    orderName?: string;
    orderStatus?: string;
}

export interface SupplierSummary {
    id: string;
    hubName?: string;
        supplierKey: string;
    supplierName: string;
    supplierType: string;
    status: string;
}

export interface CreateSupplierInput {
        retailHubId: string;
        supplierKey?: string;
    supplierName?: string;
    supplierType?: string;
}

export interface CustomerProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileType: string;
    status: string;
}

export interface CreateCustomerProfileInput {
        retailHubId: string;
        profileKey?: string;
    profileName?: string;
    profileType?: string;
}

export interface LoyaltyProgramSummary {
    id: string;
    hubName?: string;
        programKey: string;
    programName: string;
    programType: string;
    status: string;
}

export interface CreateLoyaltyProgramInput {
        retailHubId: string;
        programKey?: string;
    programName?: string;
    programType?: string;
}

export interface RewardPointSummary {
    id: string;
    hubName?: string;
        pointsKey: string;
    pointsName: string;
    pointsBalance: number;
    status: string;
}

export interface CreateRewardPointInput {
        retailHubId: string;
        pointsKey?: string;
    pointsName?: string;
    pointsBalance?: number;
}

export interface CampaignSummary {
    id: string;
    hubName?: string;
        campaignKey: string;
    campaignName: string;
    campaignStatus: string;
    status: string;
}

export interface CreateCampaignInput {
        retailHubId: string;
        campaignKey?: string;
    campaignName?: string;
    campaignStatus?: string;
}

export interface DailyClosingSummary {
    id: string;
    hubName?: string;
        closingKey: string;
    closingName: string;
    closingAmount: number;
    status: string;
}

export interface CreateDailyClosingInput {
        retailHubId: string;
        closingKey?: string;
    closingName?: string;
    closingAmount?: number;
}

export interface BranchPerformanceSummary {
    id: string;
    hubName?: string;
        performanceKey: string;
    performanceName: string;
    performanceScore: number;
    status: string;
}

export interface CreateBranchPerformanceInput {
        retailHubId: string;
        performanceKey?: string;
    performanceName?: string;
    performanceScore?: number;
}

export interface CommissionRecordSummary {
    id: string;
    hubName?: string;
        commissionKey: string;
    commissionName: string;
    commissionAmount: number;
    status: string;
}

export interface CreateCommissionRecordInput {
        retailHubId: string;
        commissionKey?: string;
    commissionName?: string;
    commissionAmount?: number;
}

export interface SalesAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateSalesAnalyticsInput {
        retailHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface InventoryAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateInventoryAnalyticsInput {
        retailHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface ProfitabilityAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateProfitabilityAnalyticsInput {
        retailHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface RetailMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    revenueTotal: number;
    overallRetailScore: number;
    status: string;
}

export interface CreateRetailMetricInput {
        metricsKey?: string;
    revenueTotal?: number;
    overallRetailScore?: number;
}

export interface RetailHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateRetailHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface ExecutiveKpiSummary {
    id: string;
    hubName?: string;
        kpiKey: string;
    kpiName: string;
    kpiScore: number;
    status: string;
}

export interface CreateExecutiveKpiInput {
        retailHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiScore?: number;
}

export interface RetailFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateRetailFailureInput {
        retailHubId: string;
        failureKey?: string;
    failureType?: string;
}

