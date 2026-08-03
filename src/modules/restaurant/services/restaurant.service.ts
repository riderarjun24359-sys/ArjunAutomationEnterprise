import {
    buildRestaurantHubLookupMaps,
    buildRstAuditPayload,
    buildRstDashboardStats,
    buildRstPipelineInfo,
    mapAuditEntry,
    buildRestaurantHubPayload,
    mapRestaurantHubSummary,
    buildBrandPayload,
    mapBrandSummary,
    buildBranchPayload,
    mapBranchSummary,
    buildBusinessLicensePayload,
    mapBusinessLicenseSummary,
    buildDiningAreaPayload,
    mapDiningAreaSummary,
    buildRestaurantTablePayload,
    mapRestaurantTableSummary,
    buildMenuCategoryPayload,
    mapMenuCategorySummary,
    buildMenuItemPayload,
    mapMenuItemSummary,
    buildMenuVariantPayload,
    mapMenuVariantSummary,
    buildAddOnPayload,
    mapAddOnSummary,
    buildComboMealPayload,
    mapComboMealSummary,
    buildOrderPayload,
    mapOrderSummary,
    buildOrderItemPayload,
    mapOrderItemSummary,
    buildOrderQueuePayload,
    mapOrderQueueSummary,
    buildKitchenRoutingPayload,
    mapKitchenRoutingSummary,
    buildOrderTimelinePayload,
    mapOrderTimelineSummary,
    buildKitchenStationPayload,
    mapKitchenStationSummary,
    buildPreparationQueuePayload,
    mapPreparationQueueSummary,
    buildCookingStatusPayload,
    mapCookingStatusSummary,
    buildReadyQueuePayload,
    mapReadyQueueSummary,
    buildRushOrderPayload,
    mapRushOrderSummary,
    buildReservationPayload,
    mapReservationSummary,
    buildWaitingListPayload,
    mapWaitingListSummary,
    buildCustomerProfilePayload,
    mapCustomerProfileSummary,
    buildLoyaltyProgramPayload,
    mapLoyaltyProgramSummary,
    buildFeedbackReviewPayload,
    mapFeedbackReviewSummary,
    buildRestaurantMetricPayload,
    mapRestaurantMetricSummary,
    buildRestaurantHealthPayload,
    mapRestaurantHealthSummary,
    buildRevenueAnalyticsPayload,
    mapRevenueAnalyticsSummary,
    buildKitchenPerformancePayload,
    mapKitchenPerformanceSummary,
    buildRestaurantFailurePayload,
    mapRestaurantFailureSummary,
    mapDiningAreaForStats,
    mapMenuCategoryForStats,
    mapRestaurantMetricForStats,
    mapOrderForStats,
    mapReservationForStats,
    mapKitchenStationForStats,
    mapRestaurantHealthForStats,
    mapRestaurantFailureForStats,
} from "@/src/modules/database/lib/restaurant-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import type {
    RestaurantHubSummary,
    CreateRestaurantHubInput,
    BrandSummary,
    CreateBrandInput,
    BranchSummary,
    CreateBranchInput,
    BusinessLicenseSummary,
    CreateBusinessLicenseInput,
    DiningAreaSummary,
    CreateDiningAreaInput,
    RestaurantTableSummary,
    CreateRestaurantTableInput,
    MenuCategorySummary,
    CreateMenuCategoryInput,
    MenuItemSummary,
    CreateMenuItemInput,
    MenuVariantSummary,
    CreateMenuVariantInput,
    AddOnSummary,
    CreateAddOnInput,
    ComboMealSummary,
    CreateComboMealInput,
    OrderSummary,
    CreateOrderInput,
    OrderItemSummary,
    CreateOrderItemInput,
    OrderQueueSummary,
    CreateOrderQueueInput,
    KitchenRoutingSummary,
    CreateKitchenRoutingInput,
    OrderTimelineSummary,
    CreateOrderTimelineInput,
    KitchenStationSummary,
    CreateKitchenStationInput,
    PreparationQueueSummary,
    CreatePreparationQueueInput,
    CookingStatusSummary,
    CreateCookingStatusInput,
    ReadyQueueSummary,
    CreateReadyQueueInput,
    RushOrderSummary,
    CreateRushOrderInput,
    ReservationSummary,
    CreateReservationInput,
    WaitingListSummary,
    CreateWaitingListInput,
    CustomerProfileSummary,
    CreateCustomerProfileInput,
    LoyaltyProgramSummary,
    CreateLoyaltyProgramInput,
    FeedbackReviewSummary,
    CreateFeedbackReviewInput,
    RestaurantMetricSummary,
    CreateRestaurantMetricInput,
    RestaurantHealthSummary,
    CreateRestaurantHealthInput,
    RevenueAnalyticsSummary,
    CreateRevenueAnalyticsInput,
    KitchenPerformanceSummary,
    CreateKitchenPerformanceInput,
    RestaurantFailureSummary,
    CreateRestaurantFailureInput,
    AuditEntry,
    RstDashboardStats,
    RstPipelineInfo,
    RstSdkRegisterBrandInput,
    RstSdkRegisterBrandResult,
    RstSdkConfigureMenuInput,
    RstSdkConfigureMenuResult,
    RstSdkRunOrderWorkflowInput,
    RstSdkRunOrderWorkflowResult,
} from "@/src/modules/restaurant/types";

export class RestaurantService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const restaurantHubs = await databaseService.rstRestaurantHubs.listByOrganization(organizationId);
        return buildRestaurantHubLookupMaps(restaurantHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<RstDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildRstDashboardStats({ restaurantHubs: [], diningAreas: [], menuCategories: [], restaurantMetrics: [], orders: [], reservations: [], kitchenStations: [], restaurantHealth: [], restaurantFailures: [], auditLogs: [] });
        const [restaurantHubs, diningAreasRaw, menuCategoriesRaw, restaurantMetricsRaw, ordersRaw, reservationsRaw, kitchenStationsRaw, restaurantHealthRaw, restaurantFailures, auditLogs] = await Promise.all([
            this.getRestaurantHubs(authUserId, email, fullName),
            databaseService.rstDiningAreas.listByOrganization(context.organizationId),
            databaseService.rstMenuCategories.listByOrganization(context.organizationId),
            databaseService.rstRestaurantMetrics.listByOrganization(context.organizationId),
            databaseService.rstOrders.listByOrganization(context.organizationId),
            databaseService.rstReservations.listByOrganization(context.organizationId),
            databaseService.rstKitchenStations.listByOrganization(context.organizationId),
            databaseService.rstRestaurantHealth.listByOrganization(context.organizationId),
            this.getRestaurantFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildRstDashboardStats({
            restaurantHubs,
            diningAreas: diningAreasRaw.map(mapDiningAreaForStats),
            menuCategories: menuCategoriesRaw.map(mapMenuCategoryForStats),
            restaurantMetrics: restaurantMetricsRaw.map(mapRestaurantMetricForStats),
            orders: ordersRaw.map(mapOrderForStats),
            reservations: reservationsRaw.map(mapReservationForStats),
            kitchenStations: kitchenStationsRaw.map(mapKitchenStationForStats),
            restaurantHealth: restaurantHealthRaw.map(mapRestaurantHealthForStats),
            restaurantFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): RstPipelineInfo {
        return buildRstPipelineInfo();
    }

    async getRestaurantHubs(authUserId: string, email: string, fullName?: string | null): Promise<RestaurantHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rstRestaurantHubs.listByOrganization(context.organizationId)).map((r) => mapRestaurantHubSummary(r));
    }

    async createRestaurantHub(authUserId: string, email: string, input: CreateRestaurantHubInput, fullName?: string | null): Promise<RestaurantHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstRestaurantHubs.create(buildRestaurantHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create restaurantHubs");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "restaurant_hubs", "create", `RestaurantHub created`, created.id));
        return mapRestaurantHubSummary(created);
    }

    async getBrands(authUserId: string, email: string, fullName?: string | null): Promise<BrandSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstBrands.listByOrganization(context.organizationId)).map((r) => mapBrandSummary(r, maps));
    }

    async createBrand(authUserId: string, email: string, input: CreateBrandInput, fullName?: string | null): Promise<BrandSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstBrands.create(buildBrandPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brands");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "brands", "create", `Brand created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandSummary(created, maps);
    }

    async getBranchs(authUserId: string, email: string, fullName?: string | null): Promise<BranchSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstBranches.listByOrganization(context.organizationId)).map((r) => mapBranchSummary(r, maps));
    }

    async createBranch(authUserId: string, email: string, input: CreateBranchInput, fullName?: string | null): Promise<BranchSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstBranches.create(buildBranchPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create branches");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "branches", "create", `Branch created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBranchSummary(created, maps);
    }

    async getBusinessLicenses(authUserId: string, email: string, fullName?: string | null): Promise<BusinessLicenseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstBusinessLicenses.listByOrganization(context.organizationId)).map((r) => mapBusinessLicenseSummary(r, maps));
    }

    async createBusinessLicense(authUserId: string, email: string, input: CreateBusinessLicenseInput, fullName?: string | null): Promise<BusinessLicenseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstBusinessLicenses.create(buildBusinessLicensePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessLicenses");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "business_licenses", "create", `BusinessLicense created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessLicenseSummary(created, maps);
    }

    async getDiningAreas(authUserId: string, email: string, fullName?: string | null): Promise<DiningAreaSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstDiningAreas.listByOrganization(context.organizationId)).map((r) => mapDiningAreaSummary(r, maps));
    }

    async createDiningArea(authUserId: string, email: string, input: CreateDiningAreaInput, fullName?: string | null): Promise<DiningAreaSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstDiningAreas.create(buildDiningAreaPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create diningAreas");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "dining_areas", "create", `DiningArea created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDiningAreaSummary(created, maps);
    }

    async getRestaurantTables(authUserId: string, email: string, fullName?: string | null): Promise<RestaurantTableSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstRestaurantTables.listByOrganization(context.organizationId)).map((r) => mapRestaurantTableSummary(r, maps));
    }

    async createRestaurantTable(authUserId: string, email: string, input: CreateRestaurantTableInput, fullName?: string | null): Promise<RestaurantTableSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstRestaurantTables.create(buildRestaurantTablePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create restaurantTables");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "restaurant_tables", "create", `RestaurantTable created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRestaurantTableSummary(created, maps);
    }

    async getMenuCategorys(authUserId: string, email: string, fullName?: string | null): Promise<MenuCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstMenuCategories.listByOrganization(context.organizationId)).map((r) => mapMenuCategorySummary(r, maps));
    }

    async createMenuCategory(authUserId: string, email: string, input: CreateMenuCategoryInput, fullName?: string | null): Promise<MenuCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstMenuCategories.create(buildMenuCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create menuCategories");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "menu_categories", "create", `MenuCategory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMenuCategorySummary(created, maps);
    }

    async getMenuItems(authUserId: string, email: string, fullName?: string | null): Promise<MenuItemSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstMenuItems.listByOrganization(context.organizationId)).map((r) => mapMenuItemSummary(r, maps));
    }

    async createMenuItem(authUserId: string, email: string, input: CreateMenuItemInput, fullName?: string | null): Promise<MenuItemSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstMenuItems.create(buildMenuItemPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create menuItems");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "menu_items", "create", `MenuItem created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMenuItemSummary(created, maps);
    }

    async getMenuVariants(authUserId: string, email: string, fullName?: string | null): Promise<MenuVariantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstMenuVariants.listByOrganization(context.organizationId)).map((r) => mapMenuVariantSummary(r, maps));
    }

    async createMenuVariant(authUserId: string, email: string, input: CreateMenuVariantInput, fullName?: string | null): Promise<MenuVariantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstMenuVariants.create(buildMenuVariantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create menuVariants");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "menu_variants", "create", `MenuVariant created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMenuVariantSummary(created, maps);
    }

    async getAddOns(authUserId: string, email: string, fullName?: string | null): Promise<AddOnSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstAddOns.listByOrganization(context.organizationId)).map((r) => mapAddOnSummary(r, maps));
    }

    async createAddOn(authUserId: string, email: string, input: CreateAddOnInput, fullName?: string | null): Promise<AddOnSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstAddOns.create(buildAddOnPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create addOns");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "add_ons", "create", `AddOn created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAddOnSummary(created, maps);
    }

    async getComboMeals(authUserId: string, email: string, fullName?: string | null): Promise<ComboMealSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstComboMeals.listByOrganization(context.organizationId)).map((r) => mapComboMealSummary(r, maps));
    }

    async createComboMeal(authUserId: string, email: string, input: CreateComboMealInput, fullName?: string | null): Promise<ComboMealSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstComboMeals.create(buildComboMealPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create comboMeals");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "combo_meals", "create", `ComboMeal created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComboMealSummary(created, maps);
    }

    async getOrders(authUserId: string, email: string, fullName?: string | null): Promise<OrderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstOrders.listByOrganization(context.organizationId)).map((r) => mapOrderSummary(r, maps));
    }

    async createOrder(authUserId: string, email: string, input: CreateOrderInput, fullName?: string | null): Promise<OrderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstOrders.create(buildOrderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create orders");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "orders", "create", `Order created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrderSummary(created, maps);
    }

    async getOrderItems(authUserId: string, email: string, fullName?: string | null): Promise<OrderItemSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstOrderItems.listByOrganization(context.organizationId)).map((r) => mapOrderItemSummary(r, maps));
    }

    async createOrderItem(authUserId: string, email: string, input: CreateOrderItemInput, fullName?: string | null): Promise<OrderItemSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstOrderItems.create(buildOrderItemPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create orderItems");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "order_items", "create", `OrderItem created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrderItemSummary(created, maps);
    }

    async getOrderQueues(authUserId: string, email: string, fullName?: string | null): Promise<OrderQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstOrderQueue.listByOrganization(context.organizationId)).map((r) => mapOrderQueueSummary(r, maps));
    }

    async createOrderQueue(authUserId: string, email: string, input: CreateOrderQueueInput, fullName?: string | null): Promise<OrderQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstOrderQueue.create(buildOrderQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create orderQueue");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "order_queue", "create", `OrderQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrderQueueSummary(created, maps);
    }

    async getKitchenRoutings(authUserId: string, email: string, fullName?: string | null): Promise<KitchenRoutingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstKitchenRouting.listByOrganization(context.organizationId)).map((r) => mapKitchenRoutingSummary(r, maps));
    }

    async createKitchenRouting(authUserId: string, email: string, input: CreateKitchenRoutingInput, fullName?: string | null): Promise<KitchenRoutingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstKitchenRouting.create(buildKitchenRoutingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kitchenRouting");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "kitchen_routing", "create", `KitchenRouting created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKitchenRoutingSummary(created, maps);
    }

    async getOrderTimelines(authUserId: string, email: string, fullName?: string | null): Promise<OrderTimelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstOrderTimeline.listByOrganization(context.organizationId)).map((r) => mapOrderTimelineSummary(r, maps));
    }

    async createOrderTimeline(authUserId: string, email: string, input: CreateOrderTimelineInput, fullName?: string | null): Promise<OrderTimelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstOrderTimeline.create(buildOrderTimelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create orderTimeline");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "order_timeline", "create", `OrderTimeline created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrderTimelineSummary(created, maps);
    }

    async getKitchenStations(authUserId: string, email: string, fullName?: string | null): Promise<KitchenStationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstKitchenStations.listByOrganization(context.organizationId)).map((r) => mapKitchenStationSummary(r, maps));
    }

    async createKitchenStation(authUserId: string, email: string, input: CreateKitchenStationInput, fullName?: string | null): Promise<KitchenStationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstKitchenStations.create(buildKitchenStationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kitchenStations");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "kitchen_stations", "create", `KitchenStation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKitchenStationSummary(created, maps);
    }

    async getPreparationQueues(authUserId: string, email: string, fullName?: string | null): Promise<PreparationQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstPreparationQueue.listByOrganization(context.organizationId)).map((r) => mapPreparationQueueSummary(r, maps));
    }

    async createPreparationQueue(authUserId: string, email: string, input: CreatePreparationQueueInput, fullName?: string | null): Promise<PreparationQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstPreparationQueue.create(buildPreparationQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create preparationQueue");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "preparation_queue", "create", `PreparationQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPreparationQueueSummary(created, maps);
    }

    async getCookingStatuss(authUserId: string, email: string, fullName?: string | null): Promise<CookingStatusSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstCookingStatus.listByOrganization(context.organizationId)).map((r) => mapCookingStatusSummary(r, maps));
    }

    async createCookingStatus(authUserId: string, email: string, input: CreateCookingStatusInput, fullName?: string | null): Promise<CookingStatusSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstCookingStatus.create(buildCookingStatusPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create cookingStatus");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "cooking_status", "create", `CookingStatus created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCookingStatusSummary(created, maps);
    }

    async getReadyQueues(authUserId: string, email: string, fullName?: string | null): Promise<ReadyQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstReadyQueue.listByOrganization(context.organizationId)).map((r) => mapReadyQueueSummary(r, maps));
    }

    async createReadyQueue(authUserId: string, email: string, input: CreateReadyQueueInput, fullName?: string | null): Promise<ReadyQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstReadyQueue.create(buildReadyQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create readyQueue");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "ready_queue", "create", `ReadyQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReadyQueueSummary(created, maps);
    }

    async getRushOrders(authUserId: string, email: string, fullName?: string | null): Promise<RushOrderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstRushOrders.listByOrganization(context.organizationId)).map((r) => mapRushOrderSummary(r, maps));
    }

    async createRushOrder(authUserId: string, email: string, input: CreateRushOrderInput, fullName?: string | null): Promise<RushOrderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstRushOrders.create(buildRushOrderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rushOrders");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "rush_orders", "create", `RushOrder created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRushOrderSummary(created, maps);
    }

    async getReservations(authUserId: string, email: string, fullName?: string | null): Promise<ReservationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstReservations.listByOrganization(context.organizationId)).map((r) => mapReservationSummary(r, maps));
    }

    async createReservation(authUserId: string, email: string, input: CreateReservationInput, fullName?: string | null): Promise<ReservationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstReservations.create(buildReservationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reservations");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "reservations", "create", `Reservation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReservationSummary(created, maps);
    }

    async getWaitingLists(authUserId: string, email: string, fullName?: string | null): Promise<WaitingListSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstWaitingList.listByOrganization(context.organizationId)).map((r) => mapWaitingListSummary(r, maps));
    }

    async createWaitingList(authUserId: string, email: string, input: CreateWaitingListInput, fullName?: string | null): Promise<WaitingListSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstWaitingList.create(buildWaitingListPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create waitingList");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "waiting_list", "create", `WaitingList created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWaitingListSummary(created, maps);
    }

    async getCustomerProfiles(authUserId: string, email: string, fullName?: string | null): Promise<CustomerProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstCustomerProfiles.listByOrganization(context.organizationId)).map((r) => mapCustomerProfileSummary(r, maps));
    }

    async createCustomerProfile(authUserId: string, email: string, input: CreateCustomerProfileInput, fullName?: string | null): Promise<CustomerProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstCustomerProfiles.create(buildCustomerProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerProfiles");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "customer_profiles", "create", `CustomerProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerProfileSummary(created, maps);
    }

    async getLoyaltyPrograms(authUserId: string, email: string, fullName?: string | null): Promise<LoyaltyProgramSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstLoyaltyPrograms.listByOrganization(context.organizationId)).map((r) => mapLoyaltyProgramSummary(r, maps));
    }

    async createLoyaltyProgram(authUserId: string, email: string, input: CreateLoyaltyProgramInput, fullName?: string | null): Promise<LoyaltyProgramSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstLoyaltyPrograms.create(buildLoyaltyProgramPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create loyaltyPrograms");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "loyalty_programs", "create", `LoyaltyProgram created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLoyaltyProgramSummary(created, maps);
    }

    async getFeedbackReviews(authUserId: string, email: string, fullName?: string | null): Promise<FeedbackReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstFeedbackReviews.listByOrganization(context.organizationId)).map((r) => mapFeedbackReviewSummary(r, maps));
    }

    async createFeedbackReview(authUserId: string, email: string, input: CreateFeedbackReviewInput, fullName?: string | null): Promise<FeedbackReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstFeedbackReviews.create(buildFeedbackReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create feedbackReviews");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "feedback_reviews", "create", `FeedbackReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeedbackReviewSummary(created, maps);
    }

    async getRestaurantMetrics(authUserId: string, email: string, fullName?: string | null): Promise<RestaurantMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rstRestaurantMetrics.listByOrganization(context.organizationId)).map(mapRestaurantMetricSummary);
    }

    async createRestaurantMetric(authUserId: string, email: string, input: CreateRestaurantMetricInput, fullName?: string | null): Promise<RestaurantMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstRestaurantMetrics.create(buildRestaurantMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create restaurantMetrics");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "restaurant_metrics", "create", `RestaurantMetric created`, created.id));
        return mapRestaurantMetricSummary(created);
    }

    async getRestaurantHealths(authUserId: string, email: string, fullName?: string | null): Promise<RestaurantHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rstRestaurantHealth.listByOrganization(context.organizationId)).map(mapRestaurantHealthSummary);
    }

    async createRestaurantHealth(authUserId: string, email: string, input: CreateRestaurantHealthInput, fullName?: string | null): Promise<RestaurantHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstRestaurantHealth.create(buildRestaurantHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create restaurantHealth");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "restaurant_health", "create", `RestaurantHealth created`, created.id));
        return mapRestaurantHealthSummary(created);
    }

    async getRevenueAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<RevenueAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstRevenueAnalytics.listByOrganization(context.organizationId)).map((r) => mapRevenueAnalyticsSummary(r, maps));
    }

    async createRevenueAnalytics(authUserId: string, email: string, input: CreateRevenueAnalyticsInput, fullName?: string | null): Promise<RevenueAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstRevenueAnalytics.create(buildRevenueAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueAnalytics");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "revenue_analytics", "create", `RevenueAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueAnalyticsSummary(created, maps);
    }

    async getKitchenPerformances(authUserId: string, email: string, fullName?: string | null): Promise<KitchenPerformanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstKitchenPerformance.listByOrganization(context.organizationId)).map((r) => mapKitchenPerformanceSummary(r, maps));
    }

    async createKitchenPerformance(authUserId: string, email: string, input: CreateKitchenPerformanceInput, fullName?: string | null): Promise<KitchenPerformanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstKitchenPerformance.create(buildKitchenPerformancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create kitchenPerformance");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "kitchen_performance", "create", `KitchenPerformance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKitchenPerformanceSummary(created, maps);
    }

    async getRestaurantFailures(authUserId: string, email: string, fullName?: string | null): Promise<RestaurantFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.rstRestaurantFailures.listByOrganization(context.organizationId)).map((r) => mapRestaurantFailureSummary(r, maps));
    }

    async createRestaurantFailure(authUserId: string, email: string, input: CreateRestaurantFailureInput, fullName?: string | null): Promise<RestaurantFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.rstRestaurantFailures.create(buildRestaurantFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create restaurantFailures");
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "restaurant_failures", "create", `RestaurantFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRestaurantFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rstAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getRestaurantHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rstRestaurantHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterBrand(authUserId: string, email: string, input: RstSdkRegisterBrandInput, fullName?: string | null): Promise<RstSdkRegisterBrandResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const created = await this.createBrand(authUserId, email, { restaurantHubId: input.restaurantHubId, brandKey: input.brandKey, brandName: input.brandName }, fullName);
        return { brandId: created.id, brandKey: created.brandKey, status: created.status };
    }

    async sdkConfigureMenu(authUserId: string, email: string, input: RstSdkConfigureMenuInput, fullName?: string | null): Promise<RstSdkConfigureMenuResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        const created = await this.createMenuCategory(authUserId, email, { restaurantHubId: input.restaurantHubId, categoryKey: input.categoryKey, categoryName: input.categoryName }, fullName);
        return { categoryId: created.id, categoryKey: created.categoryKey, status: created.status };
    }

    async sdkRunOrderWorkflow(authUserId: string, email: string, input: RstSdkRunOrderWorkflowInput, fullName?: string | null): Promise<RstSdkRunOrderWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createOrder(authUserId, email, { restaurantHubId: input.restaurantHubId, orderKey: input.orderKey, orderNumber: input.orderNumber }, fullName);
        return { orderId: created.id, orderKey: created.orderKey, status: created.status };
    }
}

export const restaurantService = new RestaurantService();
