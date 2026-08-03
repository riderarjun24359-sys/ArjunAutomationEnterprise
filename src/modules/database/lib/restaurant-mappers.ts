import type { DbRstRestaurantHub,
    DbRstBrand,
    DbRstBranch,
    DbRstBusinessLicense,
    DbRstDiningArea,
    DbRstRestaurantTable,
    DbRstMenuCategory,
    DbRstMenuItem,
    DbRstMenuVariant,
    DbRstAddOn,
    DbRstComboMeal,
    DbRstOrder,
    DbRstOrderItem,
    DbRstOrderQueue,
    DbRstKitchenRouting,
    DbRstOrderTimeline,
    DbRstKitchenStation,
    DbRstPreparationQueue,
    DbRstCookingStatus,
    DbRstReadyQueue,
    DbRstRushOrder,
    DbRstReservation,
    DbRstWaitingList,
    DbRstCustomerProfile,
    DbRstLoyaltyProgram,
    DbRstFeedbackReview,
    DbRstRestaurantMetric,
    DbRstRestaurantHealth,
    DbRstRevenueAnalytics,
    DbRstKitchenPerformance,
    DbRstRestaurantFailure,
    DbRstAuditLog } from "@/src/modules/database/types/platform";
import type { CreateRestaurantHubInput,
    RestaurantHubSummary,
    CreateBrandInput,
    BrandSummary,
    CreateBranchInput,
    BranchSummary,
    CreateBusinessLicenseInput,
    BusinessLicenseSummary,
    CreateDiningAreaInput,
    DiningAreaSummary,
    CreateRestaurantTableInput,
    RestaurantTableSummary,
    CreateMenuCategoryInput,
    MenuCategorySummary,
    CreateMenuItemInput,
    MenuItemSummary,
    CreateMenuVariantInput,
    MenuVariantSummary,
    CreateAddOnInput,
    AddOnSummary,
    CreateComboMealInput,
    ComboMealSummary,
    CreateOrderInput,
    OrderSummary,
    CreateOrderItemInput,
    OrderItemSummary,
    CreateOrderQueueInput,
    OrderQueueSummary,
    CreateKitchenRoutingInput,
    KitchenRoutingSummary,
    CreateOrderTimelineInput,
    OrderTimelineSummary,
    CreateKitchenStationInput,
    KitchenStationSummary,
    CreatePreparationQueueInput,
    PreparationQueueSummary,
    CreateCookingStatusInput,
    CookingStatusSummary,
    CreateReadyQueueInput,
    ReadyQueueSummary,
    CreateRushOrderInput,
    RushOrderSummary,
    CreateReservationInput,
    ReservationSummary,
    CreateWaitingListInput,
    WaitingListSummary,
    CreateCustomerProfileInput,
    CustomerProfileSummary,
    CreateLoyaltyProgramInput,
    LoyaltyProgramSummary,
    CreateFeedbackReviewInput,
    FeedbackReviewSummary,
    CreateRestaurantMetricInput,
    RestaurantMetricSummary,
    CreateRestaurantHealthInput,
    RestaurantHealthSummary,
    CreateRevenueAnalyticsInput,
    RevenueAnalyticsSummary,
    CreateKitchenPerformanceInput,
    KitchenPerformanceSummary,
    CreateRestaurantFailureInput,
    RestaurantFailureSummary,
    RstDashboardStats,
    RstPipelineInfo,
    AuditEntry } from "@/src/modules/restaurant/types";

export function buildRestaurantHubLookupMaps(hubs: DbRstRestaurantHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildRstPipelineInfo(): RstPipelineInfo {
    const stages = [
        { key: "foundation", label: "Foundation" },
        { key: "menu", label: "Menu" },
        { key: "orders", label: "Orders" },
        { key: "kitchen", label: "Kitchen" },
        { key: "customer", label: "Customer" },
    ];
    return { stages, currentStage: "orders", nextStage: "kitchen", previousStage: "menu" };
}

export function buildRstAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbRstAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapRestaurantHubSummary(record: DbRstRestaurantHub): RestaurantHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildRestaurantHubPayload(organizationId: string, input: CreateRestaurantHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapBrandSummary(record: DbRstBrand, maps?: { hubNameById: Map<string, string> }): BrandSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        brandKey: record.brand_key as string,
        brandName: record.brand_name as string,
        brandType: record.brand_type as string,
        status: record.status,
    };
}

export function buildBrandPayload(organizationId: string, input: CreateBrandInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        brand_key: input.brandKey ?? '',
        brand_name: input.brandName ?? '',
        brand_type: input.brandType ?? '',
        status: "active",
    };
}

export function mapBranchSummary(record: DbRstBranch, maps?: { hubNameById: Map<string, string> }): BranchSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        branchKey: record.branch_key as string,
        branchName: record.branch_name as string,
        branchAddress: record.branch_address as string,
        status: record.status,
    };
}

export function buildBranchPayload(organizationId: string, input: CreateBranchInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        branch_key: input.branchKey ?? '',
        branch_name: input.branchName ?? '',
        branch_address: input.branchAddress ?? '',
        status: "active",
    };
}

export function mapBusinessLicenseSummary(record: DbRstBusinessLicense, maps?: { hubNameById: Map<string, string> }): BusinessLicenseSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        licenseKey: record.license_key as string,
        licenseName: record.license_name as string,
        licenseType: record.license_type as string,
        status: record.status,
    };
}

export function buildBusinessLicensePayload(organizationId: string, input: CreateBusinessLicenseInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        license_key: input.licenseKey ?? '',
        license_name: input.licenseName ?? '',
        license_type: input.licenseType ?? '',
        status: "active",
    };
}

export function mapDiningAreaSummary(record: DbRstDiningArea, maps?: { hubNameById: Map<string, string> }): DiningAreaSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        areaKey: record.area_key as string,
        areaName: record.area_name as string,
        areaType: record.area_type as string,
        status: record.status,
    };
}

export function buildDiningAreaPayload(organizationId: string, input: CreateDiningAreaInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        area_key: input.areaKey ?? '',
        area_name: input.areaName ?? '',
        area_type: input.areaType ?? '',
        status: "active",
    };
}

export function mapRestaurantTableSummary(record: DbRstRestaurantTable, maps?: { hubNameById: Map<string, string> }): RestaurantTableSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        tableKey: record.table_key as string,
        tableName: record.table_name as string,
        tableStatus: record.table_status as string,
        status: record.status,
    };
}

export function buildRestaurantTablePayload(organizationId: string, input: CreateRestaurantTableInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        table_key: input.tableKey ?? '',
        table_name: input.tableName ?? '',
        table_status: input.tableStatus ?? '',
        status: "active",
    };
}

export function mapMenuCategorySummary(record: DbRstMenuCategory, maps?: { hubNameById: Map<string, string> }): MenuCategorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        categoryKey: record.category_key as string,
        categoryName: record.category_name as string,
        categoryType: record.category_type as string,
        status: record.status,
    };
}

export function buildMenuCategoryPayload(organizationId: string, input: CreateMenuCategoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        category_key: input.categoryKey ?? '',
        category_name: input.categoryName ?? '',
        category_type: input.categoryType ?? '',
        status: "active",
    };
}

export function mapMenuItemSummary(record: DbRstMenuItem, maps?: { hubNameById: Map<string, string> }): MenuItemSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        itemKey: record.item_key as string,
        itemName: record.item_name as string,
        itemPrice: record.item_price as number,
        status: record.status,
    };
}

export function buildMenuItemPayload(organizationId: string, input: CreateMenuItemInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        item_key: input.itemKey ?? '',
        item_name: input.itemName ?? '',
        item_price: input.itemPrice ?? 0,
        status: "active",
    };
}

export function mapMenuVariantSummary(record: DbRstMenuVariant, maps?: { hubNameById: Map<string, string> }): MenuVariantSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        variantKey: record.variant_key as string,
        variantName: record.variant_name as string,
        variantType: record.variant_type as string,
        status: record.status,
    };
}

export function buildMenuVariantPayload(organizationId: string, input: CreateMenuVariantInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        variant_key: input.variantKey ?? '',
        variant_name: input.variantName ?? '',
        variant_type: input.variantType ?? '',
        status: "active",
    };
}

export function mapAddOnSummary(record: DbRstAddOn, maps?: { hubNameById: Map<string, string> }): AddOnSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        addonKey: record.addon_key as string,
        addonName: record.addon_name as string,
        addonPrice: record.addon_price as number,
        status: record.status,
    };
}

export function buildAddOnPayload(organizationId: string, input: CreateAddOnInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        addon_key: input.addonKey ?? '',
        addon_name: input.addonName ?? '',
        addon_price: input.addonPrice ?? 0,
        status: "active",
    };
}

export function mapComboMealSummary(record: DbRstComboMeal, maps?: { hubNameById: Map<string, string> }): ComboMealSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        comboKey: record.combo_key as string,
        comboName: record.combo_name as string,
        comboPrice: record.combo_price as number,
        status: record.status,
    };
}

export function buildComboMealPayload(organizationId: string, input: CreateComboMealInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        combo_key: input.comboKey ?? '',
        combo_name: input.comboName ?? '',
        combo_price: input.comboPrice ?? 0,
        status: "active",
    };
}

export function mapOrderSummary(record: DbRstOrder, maps?: { hubNameById: Map<string, string> }): OrderSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orderKey: record.order_key as string,
        orderNumber: record.order_number as string,
        orderType: record.order_type as string,
        status: record.status,
    };
}

export function buildOrderPayload(organizationId: string, input: CreateOrderInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        order_key: input.orderKey ?? '',
        order_number: input.orderNumber ?? '',
        order_type: input.orderType ?? '',
        status: "active",
    };
}

export function mapOrderItemSummary(record: DbRstOrderItem, maps?: { hubNameById: Map<string, string> }): OrderItemSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        itemKey: record.item_key as string,
        itemName: record.item_name as string,
        itemQuantity: record.item_quantity as number,
        status: record.status,
    };
}

export function buildOrderItemPayload(organizationId: string, input: CreateOrderItemInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        item_key: input.itemKey ?? '',
        item_name: input.itemName ?? '',
        item_quantity: input.itemQuantity ?? 0,
        status: "active",
    };
}

export function mapOrderQueueSummary(record: DbRstOrderQueue, maps?: { hubNameById: Map<string, string> }): OrderQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        queueKey: record.queue_key as string,
        queueName: record.queue_name as string,
        queueStatus: record.queue_status as string,
        status: record.status,
    };
}

export function buildOrderQueuePayload(organizationId: string, input: CreateOrderQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        queue_key: input.queueKey ?? '',
        queue_name: input.queueName ?? '',
        queue_status: input.queueStatus ?? '',
        status: "active",
    };
}

export function mapKitchenRoutingSummary(record: DbRstKitchenRouting, maps?: { hubNameById: Map<string, string> }): KitchenRoutingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        routingKey: record.routing_key as string,
        routingName: record.routing_name as string,
        routingStatus: record.routing_status as string,
        status: record.status,
    };
}

export function buildKitchenRoutingPayload(organizationId: string, input: CreateKitchenRoutingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        routing_key: input.routingKey ?? '',
        routing_name: input.routingName ?? '',
        routing_status: input.routingStatus ?? '',
        status: "active",
    };
}

export function mapOrderTimelineSummary(record: DbRstOrderTimeline, maps?: { hubNameById: Map<string, string> }): OrderTimelineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        timelineKey: record.timeline_key as string,
        timelineEvent: record.timeline_event as string,
        timelineStatus: record.timeline_status as string,
        status: record.status,
    };
}

export function buildOrderTimelinePayload(organizationId: string, input: CreateOrderTimelineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        timeline_key: input.timelineKey ?? '',
        timeline_event: input.timelineEvent ?? '',
        timeline_status: input.timelineStatus ?? '',
        status: "active",
    };
}

export function mapKitchenStationSummary(record: DbRstKitchenStation, maps?: { hubNameById: Map<string, string> }): KitchenStationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        stationKey: record.station_key as string,
        stationName: record.station_name as string,
        stationType: record.station_type as string,
        status: record.status,
    };
}

export function buildKitchenStationPayload(organizationId: string, input: CreateKitchenStationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        station_key: input.stationKey ?? '',
        station_name: input.stationName ?? '',
        station_type: input.stationType ?? '',
        status: "active",
    };
}

export function mapPreparationQueueSummary(record: DbRstPreparationQueue, maps?: { hubNameById: Map<string, string> }): PreparationQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        prepKey: record.prep_key as string,
        prepName: record.prep_name as string,
        prepStatus: record.prep_status as string,
        status: record.status,
    };
}

export function buildPreparationQueuePayload(organizationId: string, input: CreatePreparationQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        prep_key: input.prepKey ?? '',
        prep_name: input.prepName ?? '',
        prep_status: input.prepStatus ?? '',
        status: "active",
    };
}

export function mapCookingStatusSummary(record: DbRstCookingStatus, maps?: { hubNameById: Map<string, string> }): CookingStatusSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        cookingKey: record.cooking_key as string,
        cookingName: record.cooking_name as string,
        cookingStatus: record.cooking_status as string,
        status: record.status,
    };
}

export function buildCookingStatusPayload(organizationId: string, input: CreateCookingStatusInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        cooking_key: input.cookingKey ?? '',
        cooking_name: input.cookingName ?? '',
        cooking_status: input.cookingStatus ?? '',
        status: "active",
    };
}

export function mapReadyQueueSummary(record: DbRstReadyQueue, maps?: { hubNameById: Map<string, string> }): ReadyQueueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        readyKey: record.ready_key as string,
        readyName: record.ready_name as string,
        readyStatus: record.ready_status as string,
        status: record.status,
    };
}

export function buildReadyQueuePayload(organizationId: string, input: CreateReadyQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        ready_key: input.readyKey ?? '',
        ready_name: input.readyName ?? '',
        ready_status: input.readyStatus ?? '',
        status: "active",
    };
}

export function mapRushOrderSummary(record: DbRstRushOrder, maps?: { hubNameById: Map<string, string> }): RushOrderSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        rushKey: record.rush_key as string,
        rushName: record.rush_name as string,
        rushPriority: record.rush_priority as string,
        status: record.status,
    };
}

export function buildRushOrderPayload(organizationId: string, input: CreateRushOrderInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        rush_key: input.rushKey ?? '',
        rush_name: input.rushName ?? '',
        rush_priority: input.rushPriority ?? '',
        status: "active",
    };
}

export function mapReservationSummary(record: DbRstReservation, maps?: { hubNameById: Map<string, string> }): ReservationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reservationKey: record.reservation_key as string,
        reservationName: record.reservation_name as string,
        reservationStatus: record.reservation_status as string,
        status: record.status,
    };
}

export function buildReservationPayload(organizationId: string, input: CreateReservationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        reservation_key: input.reservationKey ?? '',
        reservation_name: input.reservationName ?? '',
        reservation_status: input.reservationStatus ?? '',
        status: "active",
    };
}

export function mapWaitingListSummary(record: DbRstWaitingList, maps?: { hubNameById: Map<string, string> }): WaitingListSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        waitKey: record.wait_key as string,
        waitName: record.wait_name as string,
        waitStatus: record.wait_status as string,
        status: record.status,
    };
}

export function buildWaitingListPayload(organizationId: string, input: CreateWaitingListInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        wait_key: input.waitKey ?? '',
        wait_name: input.waitName ?? '',
        wait_status: input.waitStatus ?? '',
        status: "active",
    };
}

export function mapCustomerProfileSummary(record: DbRstCustomerProfile, maps?: { hubNameById: Map<string, string> }): CustomerProfileSummary {
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
        hub_id: input.restaurantHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_type: input.profileType ?? '',
        status: "active",
    };
}

export function mapLoyaltyProgramSummary(record: DbRstLoyaltyProgram, maps?: { hubNameById: Map<string, string> }): LoyaltyProgramSummary {
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
        hub_id: input.restaurantHubId,
        program_key: input.programKey ?? '',
        program_name: input.programName ?? '',
        program_type: input.programType ?? '',
        status: "active",
    };
}

export function mapFeedbackReviewSummary(record: DbRstFeedbackReview, maps?: { hubNameById: Map<string, string> }): FeedbackReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        reviewTitle: record.review_title as string,
        reviewRating: record.review_rating as number,
        status: record.status,
    };
}

export function buildFeedbackReviewPayload(organizationId: string, input: CreateFeedbackReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        review_key: input.reviewKey ?? '',
        review_title: input.reviewTitle ?? '',
        review_rating: input.reviewRating ?? 0,
        status: "active",
    };
}

export function mapRestaurantMetricSummary(record: DbRstRestaurantMetric): RestaurantMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        orderCount: record.order_count as number,
        overallRestaurantScore: record.overall_restaurant_score as number,
        status: record.status,
    };
}

export function buildRestaurantMetricPayload(organizationId: string, input: CreateRestaurantMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        order_count: input.orderCount ?? 0,
        overall_restaurant_score: input.overallRestaurantScore ?? 0,
        status: "active",
    };
}

export function mapRestaurantHealthSummary(record: DbRstRestaurantHealth): RestaurantHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildRestaurantHealthPayload(organizationId: string, input: CreateRestaurantHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapRevenueAnalyticsSummary(record: DbRstRevenueAnalytics, maps?: { hubNameById: Map<string, string> }): RevenueAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildRevenueAnalyticsPayload(organizationId: string, input: CreateRevenueAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapKitchenPerformanceSummary(record: DbRstKitchenPerformance, maps?: { hubNameById: Map<string, string> }): KitchenPerformanceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        performanceKey: record.performance_key as string,
        performanceType: record.performance_type as string,
        performanceScore: record.performance_score as number,
        status: record.status,
    };
}

export function buildKitchenPerformancePayload(organizationId: string, input: CreateKitchenPerformanceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        performance_key: input.performanceKey ?? '',
        performance_type: input.performanceType ?? '',
        performance_score: input.performanceScore ?? 0,
        status: "active",
    };
}

export function mapRestaurantFailureSummary(record: DbRstRestaurantFailure, maps?: { hubNameById: Map<string, string> }): RestaurantFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildRestaurantFailurePayload(organizationId: string, input: CreateRestaurantFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.restaurantHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapDiningAreaForStats(r: DbRstDiningArea) { return { status: r.status }; }
export function mapMenuCategoryForStats(r: DbRstMenuCategory) { return { status: r.status }; }
export function mapRestaurantMetricForStats(r: DbRstRestaurantMetric) {
    return {
        order_count: r.order_count,
        revenue_total: r.revenue_total,
        average_bill: r.average_bill,
        occupancy_rate: r.occupancy_rate,
        kitchen_performance_score: r.kitchen_performance_score,
        overall_restaurant_score: r.overall_restaurant_score,
        status: r.status,
    };
}
export function mapOrderForStats(r: DbRstOrder) { return { order_type: r.order_type, status: r.status }; }
export function mapReservationForStats(r: DbRstReservation) { return { status: r.status }; }
export function mapKitchenStationForStats(r: DbRstKitchenStation) { return { status: r.status }; }
export function mapRestaurantHealthForStats(r: DbRstRestaurantHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapRestaurantFailureForStats(r: DbRstRestaurantFailure) { return { status: r.status }; }

export function buildRstDashboardStats(input: {
    restaurantHubs: RestaurantHubSummary[];
    diningAreas: ReturnType<typeof mapDiningAreaForStats>[];
    menuCategories: ReturnType<typeof mapMenuCategoryForStats>[];
    restaurantMetrics: ReturnType<typeof mapRestaurantMetricForStats>[];
    orders: ReturnType<typeof mapOrderForStats>[];
    reservations: ReturnType<typeof mapReservationForStats>[];
    kitchenStations: ReturnType<typeof mapKitchenStationForStats>[];
    restaurantHealth: ReturnType<typeof mapRestaurantHealthForStats>[];
    restaurantFailures: RestaurantFailureSummary[];
    auditLogs: AuditEntry[];
}): RstDashboardStats {
    const activeHubs = input.restaurantHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.restaurantMetrics[0];
    const latestHealth = input.restaurantHealth[0];
    return {
        totalRestaurantHubs: input.restaurantHubs.length,
        activeRestaurantHubs: activeHubs,
        diningAreaCount: input.diningAreas.length,
        menuCategoryCount: input.menuCategories.length,
        orderCount: input.orders.length,
        openReservationCount: input.reservations.filter((r) => r.status === "open" || r.status === "pending").length,
        openFailureCount: input.restaurantFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallRestaurantScore: latestMetrics?.overall_restaurant_score ?? latestHealth?.overall_score ?? 0,
        orderCountScore: latestMetrics?.order_count ?? 0,
        revenueTotalScore: latestMetrics?.revenue_total ?? 0,
        averageBillScore: latestMetrics?.average_bill ?? 0,
        occupancyRateScore: latestMetrics?.occupancy_rate ?? 0,
        kitchenPerformanceScore: latestMetrics?.kitchen_performance_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
