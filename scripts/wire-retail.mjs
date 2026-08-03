#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("RtlRetailHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/hospital-repositories\";";
    const hspImportEnd = da.indexOf(anchor) + anchor.length;
    const rtlImport = `
import {
    RtlRetailHubRepository,
    RtlRetailBrandRepository,
    RtlStoreRepository,
    RtlCashRegisterRepository,
    RtlStoreDepartmentRepository,
    RtlProductRepository,
    RtlProductCategoryRepository,
    RtlProductVariantRepository,
    RtlPromotionRepository,
    RtlSalesOrderRepository,
    RtlPosTransactionRepository,
    RtlReturnsExchangeRepository,
    RtlShiftClosingRepository,
    RtlWarehouseRepository,
    RtlStockLevelRepository,
    RtlPurchaseOrderRepository,
    RtlSupplierRepository,
    RtlCustomerProfileRepository,
    RtlLoyaltyProgramRepository,
    RtlRewardPointRepository,
    RtlCampaignRepository,
    RtlDailyClosingRepository,
    RtlBranchPerformanceRepository,
    RtlCommissionRecordRepository,
    RtlSalesAnalyticsRepository,
    RtlInventoryAnalyticsRepository,
    RtlProfitabilityAnalyticsRepository,
    RtlRetailMetricRepository,
    RtlRetailHealthRepository,
    RtlExecutiveKpiRepository,
    RtlRetailFailureRepository,
    RtlAuditLogRepository,
} from "@/src/modules/database/repositories/retail-repositories";
`;
    da = da.slice(0, hspImportEnd) + rtlImport + da.slice(hspImportEnd);

    const hspProp = "    readonly hspAuditLogs: HspAuditLogRepository;";
    const rtlProps = `    readonly rtlRetailHubs: RtlRetailHubRepository;
    readonly rtlRetailBrands: RtlRetailBrandRepository;
    readonly rtlStores: RtlStoreRepository;
    readonly rtlCashRegisters: RtlCashRegisterRepository;
    readonly rtlStoreDepartments: RtlStoreDepartmentRepository;
    readonly rtlProducts: RtlProductRepository;
    readonly rtlProductCategories: RtlProductCategoryRepository;
    readonly rtlProductVariants: RtlProductVariantRepository;
    readonly rtlPromotions: RtlPromotionRepository;
    readonly rtlSalesOrders: RtlSalesOrderRepository;
    readonly rtlPosTransactions: RtlPosTransactionRepository;
    readonly rtlReturnsExchanges: RtlReturnsExchangeRepository;
    readonly rtlShiftClosings: RtlShiftClosingRepository;
    readonly rtlWarehouses: RtlWarehouseRepository;
    readonly rtlStockLevels: RtlStockLevelRepository;
    readonly rtlPurchaseOrders: RtlPurchaseOrderRepository;
    readonly rtlSuppliers: RtlSupplierRepository;
    readonly rtlCustomerProfiles: RtlCustomerProfileRepository;
    readonly rtlLoyaltyPrograms: RtlLoyaltyProgramRepository;
    readonly rtlRewardPoints: RtlRewardPointRepository;
    readonly rtlCampaigns: RtlCampaignRepository;
    readonly rtlDailyClosings: RtlDailyClosingRepository;
    readonly rtlBranchPerformance: RtlBranchPerformanceRepository;
    readonly rtlCommissionRecords: RtlCommissionRecordRepository;
    readonly rtlSalesAnalytics: RtlSalesAnalyticsRepository;
    readonly rtlInventoryAnalytics: RtlInventoryAnalyticsRepository;
    readonly rtlProfitabilityAnalytics: RtlProfitabilityAnalyticsRepository;
    readonly rtlRetailMetrics: RtlRetailMetricRepository;
    readonly rtlRetailHealth: RtlRetailHealthRepository;
    readonly rtlExecutiveKpis: RtlExecutiveKpiRepository;
    readonly rtlRetailFailures: RtlRetailFailureRepository;
    readonly rtlAuditLogs: RtlAuditLogRepository;`;
    da = da.replace(hspProp, hspProp + "\n" + rtlProps);

    const hspCtor = "        this.hspAuditLogs = new HspAuditLogRepository();";
    const rtlCtor = `        this.rtlRetailHubs = new RtlRetailHubRepository();
        this.rtlRetailBrands = new RtlRetailBrandRepository();
        this.rtlStores = new RtlStoreRepository();
        this.rtlCashRegisters = new RtlCashRegisterRepository();
        this.rtlStoreDepartments = new RtlStoreDepartmentRepository();
        this.rtlProducts = new RtlProductRepository();
        this.rtlProductCategories = new RtlProductCategoryRepository();
        this.rtlProductVariants = new RtlProductVariantRepository();
        this.rtlPromotions = new RtlPromotionRepository();
        this.rtlSalesOrders = new RtlSalesOrderRepository();
        this.rtlPosTransactions = new RtlPosTransactionRepository();
        this.rtlReturnsExchanges = new RtlReturnsExchangeRepository();
        this.rtlShiftClosings = new RtlShiftClosingRepository();
        this.rtlWarehouses = new RtlWarehouseRepository();
        this.rtlStockLevels = new RtlStockLevelRepository();
        this.rtlPurchaseOrders = new RtlPurchaseOrderRepository();
        this.rtlSuppliers = new RtlSupplierRepository();
        this.rtlCustomerProfiles = new RtlCustomerProfileRepository();
        this.rtlLoyaltyPrograms = new RtlLoyaltyProgramRepository();
        this.rtlRewardPoints = new RtlRewardPointRepository();
        this.rtlCampaigns = new RtlCampaignRepository();
        this.rtlDailyClosings = new RtlDailyClosingRepository();
        this.rtlBranchPerformance = new RtlBranchPerformanceRepository();
        this.rtlCommissionRecords = new RtlCommissionRecordRepository();
        this.rtlSalesAnalytics = new RtlSalesAnalyticsRepository();
        this.rtlInventoryAnalytics = new RtlInventoryAnalyticsRepository();
        this.rtlProfitabilityAnalytics = new RtlProfitabilityAnalyticsRepository();
        this.rtlRetailMetrics = new RtlRetailMetricRepository();
        this.rtlRetailHealth = new RtlRetailHealthRepository();
        this.rtlExecutiveKpis = new RtlExecutiveKpiRepository();
        this.rtlRetailFailures = new RtlRetailFailureRepository();
        this.rtlAuditLogs = new RtlAuditLogRepository();`;
    da = da.replace(hspCtor, hspCtor + "\n" + rtlCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("rtlRetailHubs")) {
    ds = ds.replace(
        "    hspAuditLogs: databaseAccess.hspAuditLogs,",
        `    hspAuditLogs: databaseAccess.hspAuditLogs,
    rtlRetailHubs: databaseAccess.rtlRetailHubs,
    rtlRetailBrands: databaseAccess.rtlRetailBrands,
    rtlStores: databaseAccess.rtlStores,
    rtlCashRegisters: databaseAccess.rtlCashRegisters,
    rtlStoreDepartments: databaseAccess.rtlStoreDepartments,
    rtlProducts: databaseAccess.rtlProducts,
    rtlProductCategories: databaseAccess.rtlProductCategories,
    rtlProductVariants: databaseAccess.rtlProductVariants,
    rtlPromotions: databaseAccess.rtlPromotions,
    rtlSalesOrders: databaseAccess.rtlSalesOrders,
    rtlPosTransactions: databaseAccess.rtlPosTransactions,
    rtlReturnsExchanges: databaseAccess.rtlReturnsExchanges,
    rtlShiftClosings: databaseAccess.rtlShiftClosings,
    rtlWarehouses: databaseAccess.rtlWarehouses,
    rtlStockLevels: databaseAccess.rtlStockLevels,
    rtlPurchaseOrders: databaseAccess.rtlPurchaseOrders,
    rtlSuppliers: databaseAccess.rtlSuppliers,
    rtlCustomerProfiles: databaseAccess.rtlCustomerProfiles,
    rtlLoyaltyPrograms: databaseAccess.rtlLoyaltyPrograms,
    rtlRewardPoints: databaseAccess.rtlRewardPoints,
    rtlCampaigns: databaseAccess.rtlCampaigns,
    rtlDailyClosings: databaseAccess.rtlDailyClosings,
    rtlBranchPerformance: databaseAccess.rtlBranchPerformance,
    rtlCommissionRecords: databaseAccess.rtlCommissionRecords,
    rtlSalesAnalytics: databaseAccess.rtlSalesAnalytics,
    rtlInventoryAnalytics: databaseAccess.rtlInventoryAnalytics,
    rtlProfitabilityAnalytics: databaseAccess.rtlProfitabilityAnalytics,
    rtlRetailMetrics: databaseAccess.rtlRetailMetrics,
    rtlRetailHealth: databaseAccess.rtlRetailHealth,
    rtlExecutiveKpis: databaseAccess.rtlExecutiveKpis,
    rtlRetailFailures: databaseAccess.rtlRetailFailures,
    rtlAuditLogs: databaseAccess.rtlAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for RTL");
