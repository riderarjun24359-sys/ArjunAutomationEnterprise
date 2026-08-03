#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("RstRestaurantHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/document-engine-repositories\";";
    const ddeImportEnd = da.indexOf(anchor) + anchor.length;
    const rstImport = `
import {
    RstRestaurantHubRepository,
    RstBrandRepository,
    RstBranchRepository,
    RstBusinessLicenseRepository,
    RstDiningAreaRepository,
    RstRestaurantTableRepository,
    RstMenuCategoryRepository,
    RstMenuItemRepository,
    RstMenuVariantRepository,
    RstAddOnRepository,
    RstComboMealRepository,
    RstOrderRepository,
    RstOrderItemRepository,
    RstOrderQueueRepository,
    RstKitchenRoutingRepository,
    RstOrderTimelineRepository,
    RstKitchenStationRepository,
    RstPreparationQueueRepository,
    RstCookingStatusRepository,
    RstReadyQueueRepository,
    RstRushOrderRepository,
    RstReservationRepository,
    RstWaitingListRepository,
    RstCustomerProfileRepository,
    RstLoyaltyProgramRepository,
    RstFeedbackReviewRepository,
    RstRestaurantMetricRepository,
    RstRestaurantHealthRepository,
    RstRevenueAnalyticsRepository,
    RstKitchenPerformanceRepository,
    RstRestaurantFailureRepository,
    RstAuditLogRepository,
} from "@/src/modules/database/repositories/restaurant-repositories";
`;
    da = da.slice(0, ddeImportEnd) + rstImport + da.slice(ddeImportEnd);

    const ddeProp = "    readonly ddeAuditLogs: DdeAuditLogRepository;";
    const rstProps = `    readonly rstRestaurantHubs: RstRestaurantHubRepository;
    readonly rstBrands: RstBrandRepository;
    readonly rstBranches: RstBranchRepository;
    readonly rstBusinessLicenses: RstBusinessLicenseRepository;
    readonly rstDiningAreas: RstDiningAreaRepository;
    readonly rstRestaurantTables: RstRestaurantTableRepository;
    readonly rstMenuCategories: RstMenuCategoryRepository;
    readonly rstMenuItems: RstMenuItemRepository;
    readonly rstMenuVariants: RstMenuVariantRepository;
    readonly rstAddOns: RstAddOnRepository;
    readonly rstComboMeals: RstComboMealRepository;
    readonly rstOrders: RstOrderRepository;
    readonly rstOrderItems: RstOrderItemRepository;
    readonly rstOrderQueue: RstOrderQueueRepository;
    readonly rstKitchenRouting: RstKitchenRoutingRepository;
    readonly rstOrderTimeline: RstOrderTimelineRepository;
    readonly rstKitchenStations: RstKitchenStationRepository;
    readonly rstPreparationQueue: RstPreparationQueueRepository;
    readonly rstCookingStatus: RstCookingStatusRepository;
    readonly rstReadyQueue: RstReadyQueueRepository;
    readonly rstRushOrders: RstRushOrderRepository;
    readonly rstReservations: RstReservationRepository;
    readonly rstWaitingList: RstWaitingListRepository;
    readonly rstCustomerProfiles: RstCustomerProfileRepository;
    readonly rstLoyaltyPrograms: RstLoyaltyProgramRepository;
    readonly rstFeedbackReviews: RstFeedbackReviewRepository;
    readonly rstRestaurantMetrics: RstRestaurantMetricRepository;
    readonly rstRestaurantHealth: RstRestaurantHealthRepository;
    readonly rstRevenueAnalytics: RstRevenueAnalyticsRepository;
    readonly rstKitchenPerformance: RstKitchenPerformanceRepository;
    readonly rstRestaurantFailures: RstRestaurantFailureRepository;
    readonly rstAuditLogs: RstAuditLogRepository;`;
    da = da.replace(ddeProp, ddeProp + "\n" + rstProps);

    const ddeCtor = "        this.ddeAuditLogs = new DdeAuditLogRepository();";
    const rstCtor = `        this.rstRestaurantHubs = new RstRestaurantHubRepository();
        this.rstBrands = new RstBrandRepository();
        this.rstBranches = new RstBranchRepository();
        this.rstBusinessLicenses = new RstBusinessLicenseRepository();
        this.rstDiningAreas = new RstDiningAreaRepository();
        this.rstRestaurantTables = new RstRestaurantTableRepository();
        this.rstMenuCategories = new RstMenuCategoryRepository();
        this.rstMenuItems = new RstMenuItemRepository();
        this.rstMenuVariants = new RstMenuVariantRepository();
        this.rstAddOns = new RstAddOnRepository();
        this.rstComboMeals = new RstComboMealRepository();
        this.rstOrders = new RstOrderRepository();
        this.rstOrderItems = new RstOrderItemRepository();
        this.rstOrderQueue = new RstOrderQueueRepository();
        this.rstKitchenRouting = new RstKitchenRoutingRepository();
        this.rstOrderTimeline = new RstOrderTimelineRepository();
        this.rstKitchenStations = new RstKitchenStationRepository();
        this.rstPreparationQueue = new RstPreparationQueueRepository();
        this.rstCookingStatus = new RstCookingStatusRepository();
        this.rstReadyQueue = new RstReadyQueueRepository();
        this.rstRushOrders = new RstRushOrderRepository();
        this.rstReservations = new RstReservationRepository();
        this.rstWaitingList = new RstWaitingListRepository();
        this.rstCustomerProfiles = new RstCustomerProfileRepository();
        this.rstLoyaltyPrograms = new RstLoyaltyProgramRepository();
        this.rstFeedbackReviews = new RstFeedbackReviewRepository();
        this.rstRestaurantMetrics = new RstRestaurantMetricRepository();
        this.rstRestaurantHealth = new RstRestaurantHealthRepository();
        this.rstRevenueAnalytics = new RstRevenueAnalyticsRepository();
        this.rstKitchenPerformance = new RstKitchenPerformanceRepository();
        this.rstRestaurantFailures = new RstRestaurantFailureRepository();
        this.rstAuditLogs = new RstAuditLogRepository();`;
    da = da.replace(ddeCtor, ddeCtor + "\n" + rstCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("rstRestaurantHubs")) {
    ds = ds.replace(
        "    ddeAuditLogs: databaseAccess.ddeAuditLogs,",
        `    ddeAuditLogs: databaseAccess.ddeAuditLogs,
    rstRestaurantHubs: databaseAccess.rstRestaurantHubs,
    rstBrands: databaseAccess.rstBrands,
    rstBranches: databaseAccess.rstBranches,
    rstBusinessLicenses: databaseAccess.rstBusinessLicenses,
    rstDiningAreas: databaseAccess.rstDiningAreas,
    rstRestaurantTables: databaseAccess.rstRestaurantTables,
    rstMenuCategories: databaseAccess.rstMenuCategories,
    rstMenuItems: databaseAccess.rstMenuItems,
    rstMenuVariants: databaseAccess.rstMenuVariants,
    rstAddOns: databaseAccess.rstAddOns,
    rstComboMeals: databaseAccess.rstComboMeals,
    rstOrders: databaseAccess.rstOrders,
    rstOrderItems: databaseAccess.rstOrderItems,
    rstOrderQueue: databaseAccess.rstOrderQueue,
    rstKitchenRouting: databaseAccess.rstKitchenRouting,
    rstOrderTimeline: databaseAccess.rstOrderTimeline,
    rstKitchenStations: databaseAccess.rstKitchenStations,
    rstPreparationQueue: databaseAccess.rstPreparationQueue,
    rstCookingStatus: databaseAccess.rstCookingStatus,
    rstReadyQueue: databaseAccess.rstReadyQueue,
    rstRushOrders: databaseAccess.rstRushOrders,
    rstReservations: databaseAccess.rstReservations,
    rstWaitingList: databaseAccess.rstWaitingList,
    rstCustomerProfiles: databaseAccess.rstCustomerProfiles,
    rstLoyaltyPrograms: databaseAccess.rstLoyaltyPrograms,
    rstFeedbackReviews: databaseAccess.rstFeedbackReviews,
    rstRestaurantMetrics: databaseAccess.rstRestaurantMetrics,
    rstRestaurantHealth: databaseAccess.rstRestaurantHealth,
    rstRevenueAnalytics: databaseAccess.rstRevenueAnalytics,
    rstKitchenPerformance: databaseAccess.rstKitchenPerformance,
    rstRestaurantFailures: databaseAccess.rstRestaurantFailures,
    rstAuditLogs: databaseAccess.rstAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for RST");
