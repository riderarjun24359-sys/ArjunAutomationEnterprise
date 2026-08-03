import type { DbRtlRetailHub,
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
    DbRtlAuditLog } from "@/src/modules/database/types/platform";
import type { CreateRetailHubInput,
    RetailHubSummary,
    CreateRetailBrandInput,
    RetailBrandSummary,
    CreateStoreInput,
    StoreSummary,
    CreateCashRegisterInput,
    CashRegisterSummary,
    CreateStoreDepartmentInput,
    StoreDepartmentSummary,
    CreateProductInput,
    ProductSummary,
    CreateProductCategoryInput,
    ProductCategorySummary,
    CreateProductVariantInput,
    ProductVariantSummary,
    CreatePromotionInput,
    PromotionSummary,
    CreateSalesOrderInput,
    SalesOrderSummary,
    CreatePosTransactionInput,
    PosTransactionSummary,
    CreateReturnsExchangeInput,
    ReturnsExchangeSummary,
    CreateShiftClosingInput,
    ShiftClosingSummary,
    CreateWarehouseInput,
    WarehouseSummary,
    CreateStockLevelInput,
    StockLevelSummary,
    CreatePurchaseOrderInput,
    PurchaseOrderSummary,
    CreateSupplierInput,
    SupplierSummary,
    CreateCustomerProfileInput,
    CustomerProfileSummary,
    CreateLoyaltyProgramInput,
    LoyaltyProgramSummary,
    CreateRewardPointInput,
    RewardPointSummary,
    CreateCampaignInput,
    CampaignSummary,
    CreateDailyClosingInput,
    DailyClosingSummary,
    CreateBranchPerformanceInput,
    BranchPerformanceSummary,
    CreateCommissionRecordInput,
    CommissionRecordSummary,
    CreateSalesAnalyticsInput,
    SalesAnalyticsSummary,
    CreateInventoryAnalyticsInput,
    InventoryAnalyticsSummary,
    CreateProfitabilityAnalyticsInput,
    ProfitabilityAnalyticsSummary,
    CreateRetailMetricInput,
    RetailMetricSummary,
    CreateRetailHealthInput,
    RetailHealthSummary,
    CreateExecutiveKpiInput,
    ExecutiveKpiSummary,
    CreateRetailFailureInput,
    RetailFailureSummary,
    RtlDashboardStats,
    RtlPipelineInfo,
    AuditEntry } from "@/src/modules/retail/types";

export function buildRetailHubLookupMaps(hubs: DbRtlRetailHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildRtlPipelineInfo(): RtlPipelineInfo {
    const stages = [
        { key: "foundation", label: "Foundation" },
        { key: "product", label: "Product" },
        { key: "sales_pos", label: "Sales & POS" },
        { key: "inventory", label: "Inventory" },
        { key: "customer", label: "Customer" },
    ];
    return { stages, currentStage: "sales_pos", nextStage: "inventory", previousStage: "product" };
}

export function buildRtlAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbRtlAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapRetailHubSummary(record: DbRtlRetailHub): RetailHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildRetailHubPayload(organizationId: string, input: CreateRetailHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapRetailBrandSummary(record: DbRtlRetailBrand, maps?: { hubNameById: Map<string, string> }): RetailBrandSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        brandKey: record.brand_key as string,
        brandName: record.brand_name as string,
        brandType: record.brand_type as string,
        status: record.status,
    };
}

export function buildRetailBrandPayload(organizationId: string, input: CreateRetailBrandInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        brand_key: input.brandKey ?? '',
        brand_name: input.brandName ?? '',
        brand_type: input.brandType ?? '',
        status: "active",
    };
}

export function mapStoreSummary(record: DbRtlStore, maps?: { hubNameById: Map<string, string> }): StoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        storeKey: record.store_key as string,
        storeName: record.store_name as string,
        storeType: record.store_type as string,
        status: record.status,
    };
}

export function buildStorePayload(organizationId: string, input: CreateStoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        store_key: input.storeKey ?? '',
        store_name: input.storeName ?? '',
        store_type: input.storeType ?? '',
        status: "active",
    };
}

export function mapCashRegisterSummary(record: DbRtlCashRegister, maps?: { hubNameById: Map<string, string> }): CashRegisterSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        registerKey: record.register_key as string,
        registerName: record.register_name as string,
        registerStatus: record.register_status as string,
        status: record.status,
    };
}

export function buildCashRegisterPayload(organizationId: string, input: CreateCashRegisterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        register_key: input.registerKey ?? '',
        register_name: input.registerName ?? '',
        register_status: input.registerStatus ?? '',
        status: "active",
    };
}

export function mapStoreDepartmentSummary(record: DbRtlStoreDepartment, maps?: { hubNameById: Map<string, string> }): StoreDepartmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        departmentKey: record.department_key as string,
        departmentName: record.department_name as string,
        departmentType: record.department_type as string,
        status: record.status,
    };
}

export function buildStoreDepartmentPayload(organizationId: string, input: CreateStoreDepartmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        department_key: input.departmentKey ?? '',
        department_name: input.departmentName ?? '',
        department_type: input.departmentType ?? '',
        status: "active",
    };
}

export function mapProductSummary(record: DbRtlProduct, maps?: { hubNameById: Map<string, string> }): ProductSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        productKey: record.product_key as string,
        productName: record.product_name as string,
        productType: record.product_type as string,
        status: record.status,
    };
}

export function buildProductPayload(organizationId: string, input: CreateProductInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        product_key: input.productKey ?? '',
        product_name: input.productName ?? '',
        product_type: input.productType ?? '',
        status: "active",
    };
}

export function mapProductCategorySummary(record: DbRtlProductCategory, maps?: { hubNameById: Map<string, string> }): ProductCategorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        categoryKey: record.category_key as string,
        categoryName: record.category_name as string,
        categoryType: record.category_type as string,
        status: record.status,
    };
}

export function buildProductCategoryPayload(organizationId: string, input: CreateProductCategoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        category_key: input.categoryKey ?? '',
        category_name: input.categoryName ?? '',
        category_type: input.categoryType ?? '',
        status: "active",
    };
}

export function mapProductVariantSummary(record: DbRtlProductVariant, maps?: { hubNameById: Map<string, string> }): ProductVariantSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        variantKey: record.variant_key as string,
        variantName: record.variant_name as string,
        variantType: record.variant_type as string,
        status: record.status,
    };
}

export function buildProductVariantPayload(organizationId: string, input: CreateProductVariantInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        variant_key: input.variantKey ?? '',
        variant_name: input.variantName ?? '',
        variant_type: input.variantType ?? '',
        status: "active",
    };
}

export function mapPromotionSummary(record: DbRtlPromotion, maps?: { hubNameById: Map<string, string> }): PromotionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        promotionKey: record.promotion_key as string,
        promotionName: record.promotion_name as string,
        promotionStatus: record.promotion_status as string,
        status: record.status,
    };
}

export function buildPromotionPayload(organizationId: string, input: CreatePromotionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        promotion_key: input.promotionKey ?? '',
        promotion_name: input.promotionName ?? '',
        promotion_status: input.promotionStatus ?? '',
        status: "active",
    };
}

export function mapSalesOrderSummary(record: DbRtlSalesOrder, maps?: { hubNameById: Map<string, string> }): SalesOrderSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orderKey: record.order_key as string,
        orderName: record.order_name as string,
        orderStatus: record.order_status as string,
        status: record.status,
    };
}

export function buildSalesOrderPayload(organizationId: string, input: CreateSalesOrderInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        order_key: input.orderKey ?? '',
        order_name: input.orderName ?? '',
        order_status: input.orderStatus ?? '',
        status: "active",
    };
}

export function mapPosTransactionSummary(record: DbRtlPosTransaction, maps?: { hubNameById: Map<string, string> }): PosTransactionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        transactionKey: record.transaction_key as string,
        transactionName: record.transaction_name as string,
        transactionStatus: record.transaction_status as string,
        status: record.status,
    };
}

export function buildPosTransactionPayload(organizationId: string, input: CreatePosTransactionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        transaction_key: input.transactionKey ?? '',
        transaction_name: input.transactionName ?? '',
        transaction_status: input.transactionStatus ?? '',
        status: "active",
    };
}

export function mapReturnsExchangeSummary(record: DbRtlReturnsExchange, maps?: { hubNameById: Map<string, string> }): ReturnsExchangeSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        returnKey: record.return_key as string,
        returnName: record.return_name as string,
        returnStatus: record.return_status as string,
        status: record.status,
    };
}

export function buildReturnsExchangePayload(organizationId: string, input: CreateReturnsExchangeInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        return_key: input.returnKey ?? '',
        return_name: input.returnName ?? '',
        return_status: input.returnStatus ?? '',
        status: "active",
    };
}

export function mapShiftClosingSummary(record: DbRtlShiftClosing, maps?: { hubNameById: Map<string, string> }): ShiftClosingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        closingKey: record.closing_key as string,
        closingName: record.closing_name as string,
        closingStatus: record.closing_status as string,
        status: record.status,
    };
}

export function buildShiftClosingPayload(organizationId: string, input: CreateShiftClosingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        closing_key: input.closingKey ?? '',
        closing_name: input.closingName ?? '',
        closing_status: input.closingStatus ?? '',
        status: "active",
    };
}

export function mapWarehouseSummary(record: DbRtlWarehouse, maps?: { hubNameById: Map<string, string> }): WarehouseSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        warehouseKey: record.warehouse_key as string,
        warehouseName: record.warehouse_name as string,
        warehouseType: record.warehouse_type as string,
        status: record.status,
    };
}

export function buildWarehousePayload(organizationId: string, input: CreateWarehouseInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        warehouse_key: input.warehouseKey ?? '',
        warehouse_name: input.warehouseName ?? '',
        warehouse_type: input.warehouseType ?? '',
        status: "active",
    };
}

export function mapStockLevelSummary(record: DbRtlStockLevel, maps?: { hubNameById: Map<string, string> }): StockLevelSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        stockKey: record.stock_key as string,
        stockName: record.stock_name as string,
        stockQuantity: record.stock_quantity as number,
        status: record.status,
    };
}

export function buildStockLevelPayload(organizationId: string, input: CreateStockLevelInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        stock_key: input.stockKey ?? '',
        stock_name: input.stockName ?? '',
        stock_quantity: input.stockQuantity ?? 0,
        status: "active",
    };
}

export function mapPurchaseOrderSummary(record: DbRtlPurchaseOrder, maps?: { hubNameById: Map<string, string> }): PurchaseOrderSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orderKey: record.order_key as string,
        orderName: record.order_name as string,
        orderStatus: record.order_status as string,
        status: record.status,
    };
}

export function buildPurchaseOrderPayload(organizationId: string, input: CreatePurchaseOrderInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        order_key: input.orderKey ?? '',
        order_name: input.orderName ?? '',
        order_status: input.orderStatus ?? '',
        status: "active",
    };
}

export function mapSupplierSummary(record: DbRtlSupplier, maps?: { hubNameById: Map<string, string> }): SupplierSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        supplierKey: record.supplier_key as string,
        supplierName: record.supplier_name as string,
        supplierType: record.supplier_type as string,
        status: record.status,
    };
}

export function buildSupplierPayload(organizationId: string, input: CreateSupplierInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        supplier_key: input.supplierKey ?? '',
        supplier_name: input.supplierName ?? '',
        supplier_type: input.supplierType ?? '',
        status: "active",
    };
}

export function mapCustomerProfileSummary(record: DbRtlCustomerProfile, maps?: { hubNameById: Map<string, string> }): CustomerProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileType: record.profile_type as string,
        status: record.status,
    };
}

export function buildCustomerProfilePayload(organizationId: string, input: CreateCustomerProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_type: input.profileType ?? '',
        status: "active",
    };
}

export function mapLoyaltyProgramSummary(record: DbRtlLoyaltyProgram, maps?: { hubNameById: Map<string, string> }): LoyaltyProgramSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        programKey: record.program_key as string,
        programName: record.program_name as string,
        programType: record.program_type as string,
        status: record.status,
    };
}

export function buildLoyaltyProgramPayload(organizationId: string, input: CreateLoyaltyProgramInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        program_key: input.programKey ?? '',
        program_name: input.programName ?? '',
        program_type: input.programType ?? '',
        status: "active",
    };
}

export function mapRewardPointSummary(record: DbRtlRewardPoint, maps?: { hubNameById: Map<string, string> }): RewardPointSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        pointsKey: record.points_key as string,
        pointsName: record.points_name as string,
        pointsBalance: record.points_balance as number,
        status: record.status,
    };
}

export function buildRewardPointPayload(organizationId: string, input: CreateRewardPointInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        points_key: input.pointsKey ?? '',
        points_name: input.pointsName ?? '',
        points_balance: input.pointsBalance ?? 0,
        status: "active",
    };
}

export function mapCampaignSummary(record: DbRtlCampaign, maps?: { hubNameById: Map<string, string> }): CampaignSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        campaignKey: record.campaign_key as string,
        campaignName: record.campaign_name as string,
        campaignStatus: record.campaign_status as string,
        status: record.status,
    };
}

export function buildCampaignPayload(organizationId: string, input: CreateCampaignInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        campaign_key: input.campaignKey ?? '',
        campaign_name: input.campaignName ?? '',
        campaign_status: input.campaignStatus ?? '',
        status: "active",
    };
}

export function mapDailyClosingSummary(record: DbRtlDailyClosing, maps?: { hubNameById: Map<string, string> }): DailyClosingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        closingKey: record.closing_key as string,
        closingName: record.closing_name as string,
        closingAmount: record.closing_amount as number,
        status: record.status,
    };
}

export function buildDailyClosingPayload(organizationId: string, input: CreateDailyClosingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        closing_key: input.closingKey ?? '',
        closing_name: input.closingName ?? '',
        closing_amount: input.closingAmount ?? 0,
        status: "active",
    };
}

export function mapBranchPerformanceSummary(record: DbRtlBranchPerformance, maps?: { hubNameById: Map<string, string> }): BranchPerformanceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        performanceKey: record.performance_key as string,
        performanceName: record.performance_name as string,
        performanceScore: record.performance_score as number,
        status: record.status,
    };
}

export function buildBranchPerformancePayload(organizationId: string, input: CreateBranchPerformanceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        performance_key: input.performanceKey ?? '',
        performance_name: input.performanceName ?? '',
        performance_score: input.performanceScore ?? 0,
        status: "active",
    };
}

export function mapCommissionRecordSummary(record: DbRtlCommissionRecord, maps?: { hubNameById: Map<string, string> }): CommissionRecordSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        commissionKey: record.commission_key as string,
        commissionName: record.commission_name as string,
        commissionAmount: record.commission_amount as number,
        status: record.status,
    };
}

export function buildCommissionRecordPayload(organizationId: string, input: CreateCommissionRecordInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        commission_key: input.commissionKey ?? '',
        commission_name: input.commissionName ?? '',
        commission_amount: input.commissionAmount ?? 0,
        status: "active",
    };
}

export function mapSalesAnalyticsSummary(record: DbRtlSalesAnalytics, maps?: { hubNameById: Map<string, string> }): SalesAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildSalesAnalyticsPayload(organizationId: string, input: CreateSalesAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapInventoryAnalyticsSummary(record: DbRtlInventoryAnalytics, maps?: { hubNameById: Map<string, string> }): InventoryAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildInventoryAnalyticsPayload(organizationId: string, input: CreateInventoryAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapProfitabilityAnalyticsSummary(record: DbRtlProfitabilityAnalytics, maps?: { hubNameById: Map<string, string> }): ProfitabilityAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildProfitabilityAnalyticsPayload(organizationId: string, input: CreateProfitabilityAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapRetailMetricSummary(record: DbRtlRetailMetric): RetailMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        revenueTotal: record.revenue_total as number,
        overallRetailScore: record.overall_retail_score as number,
        status: record.status,
    };
}

export function buildRetailMetricPayload(organizationId: string, input: CreateRetailMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        revenue_total: input.revenueTotal ?? 0,
        overall_retail_score: input.overallRetailScore ?? 0,
        status: "active",
    };
}

export function mapRetailHealthSummary(record: DbRtlRetailHealth): RetailHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildRetailHealthPayload(organizationId: string, input: CreateRetailHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapExecutiveKpiSummary(record: DbRtlExecutiveKpi, maps?: { hubNameById: Map<string, string> }): ExecutiveKpiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        kpiKey: record.kpi_key as string,
        kpiName: record.kpi_name as string,
        kpiScore: record.kpi_score as number,
        status: record.status,
    };
}

export function buildExecutiveKpiPayload(organizationId: string, input: CreateExecutiveKpiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_score: input.kpiScore ?? 0,
        status: "active",
    };
}

export function mapRetailFailureSummary(record: DbRtlRetailFailure, maps?: { hubNameById: Map<string, string> }): RetailFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildRetailFailurePayload(organizationId: string, input: CreateRetailFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.retailHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapRetailBrandForStats(r: DbRtlRetailBrand) { return { status: r.status }; }
export function mapCustomerProfileForStats(r: DbRtlCustomerProfile) { return { status: r.status }; }
export function mapRetailMetricForStats(r: DbRtlRetailMetric) {
    return {
        revenue_total: r.revenue_total,
        profit_total: r.profit_total,
        sales_count: r.sales_count,
        inventory_value: r.inventory_value,
        customer_retention_rate: r.customer_retention_rate,
        store_performance_score: r.store_performance_score,
        top_product_score: r.top_product_score,
        overall_retail_score: r.overall_retail_score,
        status: r.status,
    };
}
export function mapSalesOrderForStats(r: DbRtlSalesOrder) { return { order_status: r.order_status, status: r.status }; }
export function mapPosTransactionForStats(r: DbRtlPosTransaction) { return { transaction_status: r.transaction_status, status: r.status }; }
export function mapWarehouseForStats(r: DbRtlWarehouse) { return { status: r.status }; }
export function mapStockLevelForStats(r: DbRtlStockLevel) { return { status: r.status }; }
export function mapRetailHealthForStats(r: DbRtlRetailHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapRetailFailureForStats(r: DbRtlRetailFailure) { return { status: r.status }; }

export function buildRtlDashboardStats(input: {
    retailHubs: RetailHubSummary[];
    retailBrands: ReturnType<typeof mapRetailBrandForStats>[];
    customerProfiles: ReturnType<typeof mapCustomerProfileForStats>[];
    retailMetrics: ReturnType<typeof mapRetailMetricForStats>[];
    salesOrders: ReturnType<typeof mapSalesOrderForStats>[];
    posTransactions: ReturnType<typeof mapPosTransactionForStats>[];
    warehouses: ReturnType<typeof mapWarehouseForStats>[];
    stockLevels: ReturnType<typeof mapStockLevelForStats>[];
    retailHealth: ReturnType<typeof mapRetailHealthForStats>[];
    retailFailures: RetailFailureSummary[];
    auditLogs: AuditEntry[];
}): RtlDashboardStats {
    const activeHubs = input.retailHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.retailMetrics[0];
    const latestHealth = input.retailHealth[0];
    return {
        totalRetailHubs: input.retailHubs.length,
        activeRetailHubs: activeHubs,
        retailBrandCount: input.retailBrands.length,
        customerProfileCount: input.customerProfiles.length,
        salesOrderCount: input.salesOrders.length,
        openPosTransactionCount: input.posTransactions.filter((r) => r.transaction_status === "pending" || r.status === "open").length,
        openRetailFailureCount: input.retailFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallRetailScore: latestMetrics?.overall_retail_score ?? latestHealth?.overall_score ?? 0,
        revenueTotalScore: latestMetrics?.revenue_total ?? 0,
        profitTotalScore: latestMetrics?.profit_total ?? 0,
        salesCountScore: latestMetrics?.sales_count ?? 0,
        inventoryValueScore: latestMetrics?.inventory_value ?? 0,
        customerRetentionRateScore: latestMetrics?.customer_retention_rate ?? 0,
        auditCount: input.auditLogs.length,
    };
}
