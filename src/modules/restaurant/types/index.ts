export interface RstDashboardStats {
    totalRestaurantHubs: number;
    activeRestaurantHubs: number;
    diningAreaCount: number;
    menuCategoryCount: number;
    orderCount: number;
    openReservationCount: number;
    openFailureCount: number;
    overallRestaurantScore: number;
    orderCountScore: number;
    revenueTotalScore: number;
    averageBillScore: number;
    occupancyRateScore: number;
    kitchenPerformanceScore: number;
    auditCount: number;
}

export interface RstPipelineInfo {
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

export interface RstSdkRegisterBrandInput { restaurantHubId: string; brandKey?: string; brandName?: string; }
export interface RstSdkRegisterBrandResult { brandId: string; brandKey: string; status: string; }
export interface RstSdkConfigureMenuInput { restaurantHubId: string; categoryKey?: string; categoryName?: string; }
export interface RstSdkConfigureMenuResult { categoryId: string; categoryKey: string; status: string; }
export interface RstSdkRunOrderWorkflowInput { restaurantHubId: string; orderKey?: string; orderNumber?: string; }
export interface RstSdkRunOrderWorkflowResult { orderId: string; orderKey: string; status: string; }

export interface RestaurantHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateRestaurantHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface BrandSummary {
    id: string;
    hubName?: string;
        brandKey: string;
    brandName: string;
    brandType: string;
    status: string;
}

export interface CreateBrandInput {
        restaurantHubId: string;
        brandKey?: string;
    brandName?: string;
    brandType?: string;
}

export interface BranchSummary {
    id: string;
    hubName?: string;
        branchKey: string;
    branchName: string;
    branchAddress: string;
    status: string;
}

export interface CreateBranchInput {
        restaurantHubId: string;
        branchKey?: string;
    branchName?: string;
    branchAddress?: string;
}

export interface BusinessLicenseSummary {
    id: string;
    hubName?: string;
        licenseKey: string;
    licenseName: string;
    licenseType: string;
    status: string;
}

export interface CreateBusinessLicenseInput {
        restaurantHubId: string;
        licenseKey?: string;
    licenseName?: string;
    licenseType?: string;
}

export interface DiningAreaSummary {
    id: string;
    hubName?: string;
        areaKey: string;
    areaName: string;
    areaType: string;
    status: string;
}

export interface CreateDiningAreaInput {
        restaurantHubId: string;
        areaKey?: string;
    areaName?: string;
    areaType?: string;
}

export interface RestaurantTableSummary {
    id: string;
    hubName?: string;
        tableKey: string;
    tableName: string;
    tableStatus: string;
    status: string;
}

export interface CreateRestaurantTableInput {
        restaurantHubId: string;
        tableKey?: string;
    tableName?: string;
    tableStatus?: string;
}

export interface MenuCategorySummary {
    id: string;
    hubName?: string;
        categoryKey: string;
    categoryName: string;
    categoryType: string;
    status: string;
}

export interface CreateMenuCategoryInput {
        restaurantHubId: string;
        categoryKey?: string;
    categoryName?: string;
    categoryType?: string;
}

export interface MenuItemSummary {
    id: string;
    hubName?: string;
        itemKey: string;
    itemName: string;
    itemPrice: number;
    status: string;
}

export interface CreateMenuItemInput {
        restaurantHubId: string;
        itemKey?: string;
    itemName?: string;
    itemPrice?: number;
}

export interface MenuVariantSummary {
    id: string;
    hubName?: string;
        variantKey: string;
    variantName: string;
    variantType: string;
    status: string;
}

export interface CreateMenuVariantInput {
        restaurantHubId: string;
        variantKey?: string;
    variantName?: string;
    variantType?: string;
}

export interface AddOnSummary {
    id: string;
    hubName?: string;
        addonKey: string;
    addonName: string;
    addonPrice: number;
    status: string;
}

export interface CreateAddOnInput {
        restaurantHubId: string;
        addonKey?: string;
    addonName?: string;
    addonPrice?: number;
}

export interface ComboMealSummary {
    id: string;
    hubName?: string;
        comboKey: string;
    comboName: string;
    comboPrice: number;
    status: string;
}

export interface CreateComboMealInput {
        restaurantHubId: string;
        comboKey?: string;
    comboName?: string;
    comboPrice?: number;
}

export interface OrderSummary {
    id: string;
    hubName?: string;
        orderKey: string;
    orderNumber: string;
    orderType: string;
    status: string;
}

export interface CreateOrderInput {
        restaurantHubId: string;
        orderKey?: string;
    orderNumber?: string;
    orderType?: string;
}

export interface OrderItemSummary {
    id: string;
    hubName?: string;
        itemKey: string;
    itemName: string;
    itemQuantity: number;
    status: string;
}

export interface CreateOrderItemInput {
        restaurantHubId: string;
        itemKey?: string;
    itemName?: string;
    itemQuantity?: number;
}

export interface OrderQueueSummary {
    id: string;
    hubName?: string;
        queueKey: string;
    queueName: string;
    queueStatus: string;
    status: string;
}

export interface CreateOrderQueueInput {
        restaurantHubId: string;
        queueKey?: string;
    queueName?: string;
    queueStatus?: string;
}

export interface KitchenRoutingSummary {
    id: string;
    hubName?: string;
        routingKey: string;
    routingName: string;
    routingStatus: string;
    status: string;
}

export interface CreateKitchenRoutingInput {
        restaurantHubId: string;
        routingKey?: string;
    routingName?: string;
    routingStatus?: string;
}

export interface OrderTimelineSummary {
    id: string;
    hubName?: string;
        timelineKey: string;
    timelineEvent: string;
    timelineStatus: string;
    status: string;
}

export interface CreateOrderTimelineInput {
        restaurantHubId: string;
        timelineKey?: string;
    timelineEvent?: string;
    timelineStatus?: string;
}

export interface KitchenStationSummary {
    id: string;
    hubName?: string;
        stationKey: string;
    stationName: string;
    stationType: string;
    status: string;
}

export interface CreateKitchenStationInput {
        restaurantHubId: string;
        stationKey?: string;
    stationName?: string;
    stationType?: string;
}

export interface PreparationQueueSummary {
    id: string;
    hubName?: string;
        prepKey: string;
    prepName: string;
    prepStatus: string;
    status: string;
}

export interface CreatePreparationQueueInput {
        restaurantHubId: string;
        prepKey?: string;
    prepName?: string;
    prepStatus?: string;
}

export interface CookingStatusSummary {
    id: string;
    hubName?: string;
        cookingKey: string;
    cookingName: string;
    cookingStatus: string;
    status: string;
}

export interface CreateCookingStatusInput {
        restaurantHubId: string;
        cookingKey?: string;
    cookingName?: string;
    cookingStatus?: string;
}

export interface ReadyQueueSummary {
    id: string;
    hubName?: string;
        readyKey: string;
    readyName: string;
    readyStatus: string;
    status: string;
}

export interface CreateReadyQueueInput {
        restaurantHubId: string;
        readyKey?: string;
    readyName?: string;
    readyStatus?: string;
}

export interface RushOrderSummary {
    id: string;
    hubName?: string;
        rushKey: string;
    rushName: string;
    rushPriority: string;
    status: string;
}

export interface CreateRushOrderInput {
        restaurantHubId: string;
        rushKey?: string;
    rushName?: string;
    rushPriority?: string;
}

export interface ReservationSummary {
    id: string;
    hubName?: string;
        reservationKey: string;
    reservationName: string;
    reservationStatus: string;
    status: string;
}

export interface CreateReservationInput {
        restaurantHubId: string;
        reservationKey?: string;
    reservationName?: string;
    reservationStatus?: string;
}

export interface WaitingListSummary {
    id: string;
    hubName?: string;
        waitKey: string;
    waitName: string;
    waitStatus: string;
    status: string;
}

export interface CreateWaitingListInput {
        restaurantHubId: string;
        waitKey?: string;
    waitName?: string;
    waitStatus?: string;
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
        restaurantHubId: string;
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
        restaurantHubId: string;
        programKey?: string;
    programName?: string;
    programType?: string;
}

export interface FeedbackReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    reviewTitle: string;
    reviewRating: number;
    status: string;
}

export interface CreateFeedbackReviewInput {
        restaurantHubId: string;
        reviewKey?: string;
    reviewTitle?: string;
    reviewRating?: number;
}

export interface RestaurantMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    orderCount: number;
    overallRestaurantScore: number;
    status: string;
}

export interface CreateRestaurantMetricInput {
        metricsKey?: string;
    orderCount?: number;
    overallRestaurantScore?: number;
}

export interface RestaurantHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateRestaurantHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface RevenueAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateRevenueAnalyticsInput {
        restaurantHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface KitchenPerformanceSummary {
    id: string;
    hubName?: string;
        performanceKey: string;
    performanceType: string;
    performanceScore: number;
    status: string;
}

export interface CreateKitchenPerformanceInput {
        restaurantHubId: string;
        performanceKey?: string;
    performanceType?: string;
    performanceScore?: number;
}

export interface RestaurantFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateRestaurantFailureInput {
        restaurantHubId: string;
        failureKey?: string;
    failureType?: string;
}

