import {
    buildRetailHubLookupMaps,
    buildRtlAuditPayload,
    buildRtlDashboardStats,
    buildRtlPipelineInfo,
    mapAuditEntry,
    buildRetailHubPayload,
    mapRetailHubSummary,
    buildRetailBrandPayload,
    mapRetailBrandSummary,
    buildStorePayload,
    mapStoreSummary,
    buildCashRegisterPayload,
    mapCashRegisterSummary,
    buildStoreDepartmentPayload,
    mapStoreDepartmentSummary,
    buildProductPayload,
    mapProductSummary,
    buildProductCategoryPayload,
    mapProductCategorySummary,
    buildProductVariantPayload,
    mapProductVariantSummary,
    buildPromotionPayload,
    mapPromotionSummary,
    buildSalesOrderPayload,
    mapSalesOrderSummary,
    buildPosTransactionPayload,
    mapPosTransactionSummary,
    buildReturnsExchangePayload,
    mapReturnsExchangeSummary,
    buildShiftClosingPayload,
    mapShiftClosingSummary,
    buildWarehousePayload,
    mapWarehouseSummary,
    buildStockLevelPayload,
    mapStockLevelSummary,
    buildPurchaseOrderPayload,
    mapPurchaseOrderSummary,
    buildSupplierPayload,
    mapSupplierSummary,
    buildCustomerProfilePayload,
    mapCustomerProfileSummary,
    buildLoyaltyProgramPayload,
    mapLoyaltyProgramSummary,
    buildRewardPointPayload,
    mapRewardPointSummary,
    buildCampaignPayload,
    mapCampaignSummary,
    buildDailyClosingPayload,
    mapDailyClosingSummary,
    buildBranchPerformancePayload,
    mapBranchPerformanceSummary,
    buildCommissionRecordPayload,
    mapCommissionRecordSummary,
    buildSalesAnalyticsPayload,
    mapSalesAnalyticsSummary,
    buildInventoryAnalyticsPayload,
    mapInventoryAnalyticsSummary,
    buildProfitabilityAnalyticsPayload,
    mapProfitabilityAnalyticsSummary,
    buildRetailMetricPayload,
    mapRetailMetricSummary,
    buildRetailHealthPayload,
    mapRetailHealthSummary,
    buildExecutiveKpiPayload,
    mapExecutiveKpiSummary,
    buildRetailFailurePayload,
    mapRetailFailureSummary,
    mapRetailBrandForStats,
    mapCustomerProfileForStats,
    mapRetailMetricForStats,
    mapSalesOrderForStats,
    mapPosTransactionForStats,
    mapWarehouseForStats,
    mapStockLevelForStats,
    mapRetailHealthForStats,
    mapRetailFailureForStats,
} from "@/src/modules/database/lib/retail-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
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
    RtlSdkRegisterRetailBrandInput,
    RtlSdkRegisterRetailBrandResult,
    RtlSdkConfigureCustomerProfileInput,
    RtlSdkConfigureCustomerProfileResult,
    RtlSdkRunSalesOrderWorkflowInput,
    RtlSdkRunSalesOrderWorkflowResult,
} from "@/src/modules/retail/types";

export class RetailService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const retailHubs = await databaseService.rtlRetailHubs.listByOrganization(organizationId);
        return buildRetailHubLookupMaps(retailHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<RtlDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildRtlDashboardStats({ retailHubs: [], retailBrands: [], customerProfiles: [], retailMetrics: [], salesOrders: [], posTransactions: [], warehouses: [], stockLevels: [], retailHealth: [], retailFailures: [], auditLogs: [] });
        const [retailHubs, retailBrandsRaw, customerProfilesRaw, retailMetricsRaw, salesOrdersRaw, posTransactionsRaw, warehousesRaw, stockLevelsRaw, retailHealthRaw, retailFailures, auditLogs] = await Promise.all([
            this.getRetailHubs(authUserId, email, fullName),
            databaseService.rtlRetailBrands.listByOrganization(context.organizationId),
            databaseService.rtlCustomerProfiles.listByOrganization(context.organizationId),
            databaseService.rtlRetailMetrics.listByOrganization(context.organizationId),
            databaseService.rtlSalesOrders.listByOrganization(context.organizationId),
            databaseService.rtlPosTransactions.listByOrganization(context.organizationId),
            databaseService.rtlWarehouses.listByOrganization(context.organizationId),
            databaseService.rtlStockLevels.listByOrganization(context.organizationId),
            databaseService.rtlRetailHealth.listByOrganization(context.organizationId),
            this.getRetailFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildRtlDashboardStats({
            retailHubs,
            retailBrands: retailBrandsRaw.map(mapRetailBrandForStats),
            customerProfiles: customerProfilesRaw.map(mapCustomerProfileForStats),
            retailMetrics: retailMetricsRaw.map(mapRetailMetricForStats),
            salesOrders: salesOrdersRaw.map(mapSalesOrderForStats),
            posTransactions: posTransactionsRaw.map(mapPosTransactionForStats),
            warehouses: warehousesRaw.map(mapWarehouseForStats),
            stockLevels: stockLevelsRaw.map(mapStockLevelForStats),
            retailHealth: retailHealthRaw.map(mapRetailHealthForStats),
            retailFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): RtlPipelineInfo {
        return buildRtlPipelineInfo();
    }

    async getRetailHubs(authUserId: string, email: string, fullName?: string | null): Promise<RetailHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rtlRetailHubs.listByOrganization(context.organizationId)).map((r) => mapRetailHubSummary(r));
    }

    async createRetailHub(authUserId: string, email: string, input: CreateRetailHubInput, fullName?: string | null): Promise<RetailHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlRetailHubs.create(buildRetailHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retailHubs");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "retail_hubs", "create", `RetailHub created`, created.id));
        return mapRetailHubSummary(created);
    }

    async getRetailBrands(authUserId: string, email: string, fullName?: string | null): Promise<RetailBrandSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlRetailBrands.listByOrganization(context.organizationId)).map((r) => mapRetailBrandSummary(r, maps));
    }

    async createRetailBrand(authUserId: string, email: string, input: CreateRetailBrandInput, fullName?: string | null): Promise<RetailBrandSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlRetailBrands.create(buildRetailBrandPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retailBrands");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "retail_brands", "create", `RetailBrand created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRetailBrandSummary(created, maps);
    }

    async getStores(authUserId: string, email: string, fullName?: string | null): Promise<StoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlStores.listByOrganization(context.organizationId)).map((r) => mapStoreSummary(r, maps));
    }

    async createStore(authUserId: string, email: string, input: CreateStoreInput, fullName?: string | null): Promise<StoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlStores.create(buildStorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create stores");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "stores", "create", `Store created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStoreSummary(created, maps);
    }

    async getCashRegisters(authUserId: string, email: string, fullName?: string | null): Promise<CashRegisterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlCashRegisters.listByOrganization(context.organizationId)).map((r) => mapCashRegisterSummary(r, maps));
    }

    async createCashRegister(authUserId: string, email: string, input: CreateCashRegisterInput, fullName?: string | null): Promise<CashRegisterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlCashRegisters.create(buildCashRegisterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create cashRegisters");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "cash_registers", "create", `CashRegister created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCashRegisterSummary(created, maps);
    }

    async getStoreDepartments(authUserId: string, email: string, fullName?: string | null): Promise<StoreDepartmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlStoreDepartments.listByOrganization(context.organizationId)).map((r) => mapStoreDepartmentSummary(r, maps));
    }

    async createStoreDepartment(authUserId: string, email: string, input: CreateStoreDepartmentInput, fullName?: string | null): Promise<StoreDepartmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlStoreDepartments.create(buildStoreDepartmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create storeDepartments");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "store_departments", "create", `StoreDepartment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStoreDepartmentSummary(created, maps);
    }

    async getProducts(authUserId: string, email: string, fullName?: string | null): Promise<ProductSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlProducts.listByOrganization(context.organizationId)).map((r) => mapProductSummary(r, maps));
    }

    async createProduct(authUserId: string, email: string, input: CreateProductInput, fullName?: string | null): Promise<ProductSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlProducts.create(buildProductPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create products");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "products", "create", `Product created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductSummary(created, maps);
    }

    async getProductCategorys(authUserId: string, email: string, fullName?: string | null): Promise<ProductCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlProductCategories.listByOrganization(context.organizationId)).map((r) => mapProductCategorySummary(r, maps));
    }

    async createProductCategory(authUserId: string, email: string, input: CreateProductCategoryInput, fullName?: string | null): Promise<ProductCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlProductCategories.create(buildProductCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create productCategories");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "product_categories", "create", `ProductCategory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductCategorySummary(created, maps);
    }

    async getProductVariants(authUserId: string, email: string, fullName?: string | null): Promise<ProductVariantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlProductVariants.listByOrganization(context.organizationId)).map((r) => mapProductVariantSummary(r, maps));
    }

    async createProductVariant(authUserId: string, email: string, input: CreateProductVariantInput, fullName?: string | null): Promise<ProductVariantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlProductVariants.create(buildProductVariantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create productVariants");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "product_variants", "create", `ProductVariant created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductVariantSummary(created, maps);
    }

    async getPromotions(authUserId: string, email: string, fullName?: string | null): Promise<PromotionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlPromotions.listByOrganization(context.organizationId)).map((r) => mapPromotionSummary(r, maps));
    }

    async createPromotion(authUserId: string, email: string, input: CreatePromotionInput, fullName?: string | null): Promise<PromotionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlPromotions.create(buildPromotionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create promotions");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "promotions", "create", `Promotion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPromotionSummary(created, maps);
    }

    async getSalesOrders(authUserId: string, email: string, fullName?: string | null): Promise<SalesOrderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlSalesOrders.listByOrganization(context.organizationId)).map((r) => mapSalesOrderSummary(r, maps));
    }

    async createSalesOrder(authUserId: string, email: string, input: CreateSalesOrderInput, fullName?: string | null): Promise<SalesOrderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlSalesOrders.create(buildSalesOrderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create salesOrders");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "sales_orders", "create", `SalesOrder created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSalesOrderSummary(created, maps);
    }

    async getPosTransactions(authUserId: string, email: string, fullName?: string | null): Promise<PosTransactionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlPosTransactions.listByOrganization(context.organizationId)).map((r) => mapPosTransactionSummary(r, maps));
    }

    async createPosTransaction(authUserId: string, email: string, input: CreatePosTransactionInput, fullName?: string | null): Promise<PosTransactionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlPosTransactions.create(buildPosTransactionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create posTransactions");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "pos_transactions", "create", `PosTransaction created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPosTransactionSummary(created, maps);
    }

    async getReturnsExchanges(authUserId: string, email: string, fullName?: string | null): Promise<ReturnsExchangeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlReturnsExchanges.listByOrganization(context.organizationId)).map((r) => mapReturnsExchangeSummary(r, maps));
    }

    async createReturnsExchange(authUserId: string, email: string, input: CreateReturnsExchangeInput, fullName?: string | null): Promise<ReturnsExchangeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlReturnsExchanges.create(buildReturnsExchangePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create returnsExchanges");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "returns_exchanges", "create", `ReturnsExchange created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReturnsExchangeSummary(created, maps);
    }

    async getShiftClosings(authUserId: string, email: string, fullName?: string | null): Promise<ShiftClosingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlShiftClosings.listByOrganization(context.organizationId)).map((r) => mapShiftClosingSummary(r, maps));
    }

    async createShiftClosing(authUserId: string, email: string, input: CreateShiftClosingInput, fullName?: string | null): Promise<ShiftClosingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlShiftClosings.create(buildShiftClosingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create shiftClosings");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "shift_closings", "create", `ShiftClosing created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapShiftClosingSummary(created, maps);
    }

    async getWarehouses(authUserId: string, email: string, fullName?: string | null): Promise<WarehouseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlWarehouses.listByOrganization(context.organizationId)).map((r) => mapWarehouseSummary(r, maps));
    }

    async createWarehouse(authUserId: string, email: string, input: CreateWarehouseInput, fullName?: string | null): Promise<WarehouseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlWarehouses.create(buildWarehousePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create warehouses");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "warehouses", "create", `Warehouse created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWarehouseSummary(created, maps);
    }

    async getStockLevels(authUserId: string, email: string, fullName?: string | null): Promise<StockLevelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlStockLevels.listByOrganization(context.organizationId)).map((r) => mapStockLevelSummary(r, maps));
    }

    async createStockLevel(authUserId: string, email: string, input: CreateStockLevelInput, fullName?: string | null): Promise<StockLevelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlStockLevels.create(buildStockLevelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create stockLevels");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "stock_levels", "create", `StockLevel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStockLevelSummary(created, maps);
    }

    async getPurchaseOrders(authUserId: string, email: string, fullName?: string | null): Promise<PurchaseOrderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlPurchaseOrders.listByOrganization(context.organizationId)).map((r) => mapPurchaseOrderSummary(r, maps));
    }

    async createPurchaseOrder(authUserId: string, email: string, input: CreatePurchaseOrderInput, fullName?: string | null): Promise<PurchaseOrderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlPurchaseOrders.create(buildPurchaseOrderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create purchaseOrders");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "purchase_orders", "create", `PurchaseOrder created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPurchaseOrderSummary(created, maps);
    }

    async getSuppliers(authUserId: string, email: string, fullName?: string | null): Promise<SupplierSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlSuppliers.listByOrganization(context.organizationId)).map((r) => mapSupplierSummary(r, maps));
    }

    async createSupplier(authUserId: string, email: string, input: CreateSupplierInput, fullName?: string | null): Promise<SupplierSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlSuppliers.create(buildSupplierPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create suppliers");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "suppliers", "create", `Supplier created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSupplierSummary(created, maps);
    }

    async getCustomerProfiles(authUserId: string, email: string, fullName?: string | null): Promise<CustomerProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlCustomerProfiles.listByOrganization(context.organizationId)).map((r) => mapCustomerProfileSummary(r, maps));
    }

    async createCustomerProfile(authUserId: string, email: string, input: CreateCustomerProfileInput, fullName?: string | null): Promise<CustomerProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlCustomerProfiles.create(buildCustomerProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerProfiles");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "customer_profiles", "create", `CustomerProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerProfileSummary(created, maps);
    }

    async getLoyaltyPrograms(authUserId: string, email: string, fullName?: string | null): Promise<LoyaltyProgramSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlLoyaltyPrograms.listByOrganization(context.organizationId)).map((r) => mapLoyaltyProgramSummary(r, maps));
    }

    async createLoyaltyProgram(authUserId: string, email: string, input: CreateLoyaltyProgramInput, fullName?: string | null): Promise<LoyaltyProgramSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlLoyaltyPrograms.create(buildLoyaltyProgramPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create loyaltyPrograms");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "loyalty_programs", "create", `LoyaltyProgram created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLoyaltyProgramSummary(created, maps);
    }

    async getRewardPoints(authUserId: string, email: string, fullName?: string | null): Promise<RewardPointSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlRewardPoints.listByOrganization(context.organizationId)).map((r) => mapRewardPointSummary(r, maps));
    }

    async createRewardPoint(authUserId: string, email: string, input: CreateRewardPointInput, fullName?: string | null): Promise<RewardPointSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlRewardPoints.create(buildRewardPointPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rewardPoints");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "reward_points", "create", `RewardPoint created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRewardPointSummary(created, maps);
    }

    async getCampaigns(authUserId: string, email: string, fullName?: string | null): Promise<CampaignSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlCampaigns.listByOrganization(context.organizationId)).map((r) => mapCampaignSummary(r, maps));
    }

    async createCampaign(authUserId: string, email: string, input: CreateCampaignInput, fullName?: string | null): Promise<CampaignSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlCampaigns.create(buildCampaignPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campaigns");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "campaigns", "create", `Campaign created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampaignSummary(created, maps);
    }

    async getDailyClosings(authUserId: string, email: string, fullName?: string | null): Promise<DailyClosingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlDailyClosings.listByOrganization(context.organizationId)).map((r) => mapDailyClosingSummary(r, maps));
    }

    async createDailyClosing(authUserId: string, email: string, input: CreateDailyClosingInput, fullName?: string | null): Promise<DailyClosingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlDailyClosings.create(buildDailyClosingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dailyClosings");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "daily_closings", "create", `DailyClosing created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDailyClosingSummary(created, maps);
    }

    async getBranchPerformances(authUserId: string, email: string, fullName?: string | null): Promise<BranchPerformanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlBranchPerformance.listByOrganization(context.organizationId)).map((r) => mapBranchPerformanceSummary(r, maps));
    }

    async createBranchPerformance(authUserId: string, email: string, input: CreateBranchPerformanceInput, fullName?: string | null): Promise<BranchPerformanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlBranchPerformance.create(buildBranchPerformancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create branchPerformance");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "branch_performance", "create", `BranchPerformance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBranchPerformanceSummary(created, maps);
    }

    async getCommissionRecords(authUserId: string, email: string, fullName?: string | null): Promise<CommissionRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlCommissionRecords.listByOrganization(context.organizationId)).map((r) => mapCommissionRecordSummary(r, maps));
    }

    async createCommissionRecord(authUserId: string, email: string, input: CreateCommissionRecordInput, fullName?: string | null): Promise<CommissionRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlCommissionRecords.create(buildCommissionRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create commissionRecords");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "commission_records", "create", `CommissionRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCommissionRecordSummary(created, maps);
    }

    async getSalesAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<SalesAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlSalesAnalytics.listByOrganization(context.organizationId)).map((r) => mapSalesAnalyticsSummary(r, maps));
    }

    async createSalesAnalytics(authUserId: string, email: string, input: CreateSalesAnalyticsInput, fullName?: string | null): Promise<SalesAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlSalesAnalytics.create(buildSalesAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create salesAnalytics");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "sales_analytics", "create", `SalesAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSalesAnalyticsSummary(created, maps);
    }

    async getInventoryAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<InventoryAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlInventoryAnalytics.listByOrganization(context.organizationId)).map((r) => mapInventoryAnalyticsSummary(r, maps));
    }

    async createInventoryAnalytics(authUserId: string, email: string, input: CreateInventoryAnalyticsInput, fullName?: string | null): Promise<InventoryAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlInventoryAnalytics.create(buildInventoryAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create inventoryAnalytics");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "inventory_analytics", "create", `InventoryAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInventoryAnalyticsSummary(created, maps);
    }

    async getProfitabilityAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<ProfitabilityAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlProfitabilityAnalytics.listByOrganization(context.organizationId)).map((r) => mapProfitabilityAnalyticsSummary(r, maps));
    }

    async createProfitabilityAnalytics(authUserId: string, email: string, input: CreateProfitabilityAnalyticsInput, fullName?: string | null): Promise<ProfitabilityAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlProfitabilityAnalytics.create(buildProfitabilityAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create profitabilityAnalytics");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "profitability_analytics", "create", `ProfitabilityAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProfitabilityAnalyticsSummary(created, maps);
    }

    async getRetailMetrics(authUserId: string, email: string, fullName?: string | null): Promise<RetailMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rtlRetailMetrics.listByOrganization(context.organizationId)).map(mapRetailMetricSummary);
    }

    async createRetailMetric(authUserId: string, email: string, input: CreateRetailMetricInput, fullName?: string | null): Promise<RetailMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlRetailMetrics.create(buildRetailMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retailMetrics");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "retail_metrics", "create", `RetailMetric created`, created.id));
        return mapRetailMetricSummary(created);
    }

    async getRetailHealths(authUserId: string, email: string, fullName?: string | null): Promise<RetailHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rtlRetailHealth.listByOrganization(context.organizationId)).map(mapRetailHealthSummary);
    }

    async createRetailHealth(authUserId: string, email: string, input: CreateRetailHealthInput, fullName?: string | null): Promise<RetailHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlRetailHealth.create(buildRetailHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retailHealth");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "retail_health", "create", `RetailHealth created`, created.id));
        return mapRetailHealthSummary(created);
    }

    async getExecutiveKpis(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlExecutiveKpis.listByOrganization(context.organizationId)).map((r) => mapExecutiveKpiSummary(r, maps));
    }

    async createExecutiveKpi(authUserId: string, email: string, input: CreateExecutiveKpiInput, fullName?: string | null): Promise<ExecutiveKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlExecutiveKpis.create(buildExecutiveKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveKpis");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "executive_kpis", "create", `ExecutiveKpi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveKpiSummary(created, maps);
    }

    async getRetailFailures(authUserId: string, email: string, fullName?: string | null): Promise<RetailFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rtlRetailFailures.listByOrganization(context.organizationId)).map((r) => mapRetailFailureSummary(r, maps));
    }

    async createRetailFailure(authUserId: string, email: string, input: CreateRetailFailureInput, fullName?: string | null): Promise<RetailFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rtlRetailFailures.create(buildRetailFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retailFailures");
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "retail_failures", "create", `RetailFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRetailFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rtlAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getRetailHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rtlRetailHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterRetailBrand(authUserId: string, email: string, input: RtlSdkRegisterRetailBrandInput, fullName?: string | null): Promise<RtlSdkRegisterRetailBrandResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const created = await this.createRetailBrand(authUserId, email, { retailHubId: input.retailHubId, brandKey: input.brandKey, brandName: input.brandName }, fullName);
        return { brandId: created.id, brandKey: created.brandKey, status: created.status };
    }

    async sdkConfigureCustomerProfile(authUserId: string, email: string, input: RtlSdkConfigureCustomerProfileInput, fullName?: string | null): Promise<RtlSdkConfigureCustomerProfileResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        const created = await this.createCustomerProfile(authUserId, email, { retailHubId: input.retailHubId, profileKey: input.profileKey, profileName: input.profileName }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }

    async sdkRunSalesOrderWorkflow(authUserId: string, email: string, input: RtlSdkRunSalesOrderWorkflowInput, fullName?: string | null): Promise<RtlSdkRunSalesOrderWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createSalesOrder(authUserId, email, { retailHubId: input.retailHubId, orderKey: input.orderKey, orderName: input.orderName }, fullName);
        return { orderId: created.id, orderKey: created.orderKey, status: created.status };
    }
}

export const retailService = new RetailService();
