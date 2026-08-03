"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { restaurantService } from "@/src/modules/restaurant/services/restaurant.service";
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
} from "@/src/modules/restaurant/types";

export function useRestaurant() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<RstDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<RstPipelineInfo | null>(null);
    const [restaurantHubs, setRestaurantHubs] = useState<RestaurantHubSummary[]>([]);
    const [brands, setBrands] = useState<BrandSummary[]>([]);
    const [branches, setBranchs] = useState<BranchSummary[]>([]);
    const [businessLicenses, setBusinessLicenses] = useState<BusinessLicenseSummary[]>([]);
    const [diningAreas, setDiningAreas] = useState<DiningAreaSummary[]>([]);
    const [restaurantTables, setRestaurantTables] = useState<RestaurantTableSummary[]>([]);
    const [menuCategories, setMenuCategorys] = useState<MenuCategorySummary[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItemSummary[]>([]);
    const [menuVariants, setMenuVariants] = useState<MenuVariantSummary[]>([]);
    const [addOns, setAddOns] = useState<AddOnSummary[]>([]);
    const [comboMeals, setComboMeals] = useState<ComboMealSummary[]>([]);
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItemSummary[]>([]);
    const [orderQueue, setOrderQueues] = useState<OrderQueueSummary[]>([]);
    const [kitchenRouting, setKitchenRoutings] = useState<KitchenRoutingSummary[]>([]);
    const [orderTimeline, setOrderTimelines] = useState<OrderTimelineSummary[]>([]);
    const [kitchenStations, setKitchenStations] = useState<KitchenStationSummary[]>([]);
    const [preparationQueue, setPreparationQueues] = useState<PreparationQueueSummary[]>([]);
    const [cookingStatus, setCookingStatuss] = useState<CookingStatusSummary[]>([]);
    const [readyQueue, setReadyQueues] = useState<ReadyQueueSummary[]>([]);
    const [rushOrders, setRushOrders] = useState<RushOrderSummary[]>([]);
    const [reservations, setReservations] = useState<ReservationSummary[]>([]);
    const [waitingList, setWaitingLists] = useState<WaitingListSummary[]>([]);
    const [customerProfiles, setCustomerProfiles] = useState<CustomerProfileSummary[]>([]);
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramSummary[]>([]);
    const [feedbackReviews, setFeedbackReviews] = useState<FeedbackReviewSummary[]>([]);
    const [restaurantMetrics, setRestaurantMetrics] = useState<RestaurantMetricSummary[]>([]);
    const [restaurantHealth, setRestaurantHealths] = useState<RestaurantHealthSummary[]>([]);
    const [revenueAnalytics, setRevenueAnalyticss] = useState<RevenueAnalyticsSummary[]>([]);
    const [kitchenPerformance, setKitchenPerformances] = useState<KitchenPerformanceSummary[]>([]);
    const [restaurantFailures, setRestaurantFailures] = useState<RestaurantFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [restaurantHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
restaurantHubsList,
            brandsList,
            branchesList,
            businessLicensesList,
            diningAreasList,
            restaurantTablesList,
            menuCategoriesList,
            menuItemsList,
            menuVariantsList,
            addOnsList,
            comboMealsList,
            ordersList,
            orderItemsList,
            orderQueueList,
            kitchenRoutingList,
            orderTimelineList,
            kitchenStationsList,
            preparationQueueList,
            cookingStatusList,
            readyQueueList,
            rushOrdersList,
            reservationsList,
            waitingListList,
            customerProfilesList,
            loyaltyProgramsList,
            feedbackReviewsList,
            restaurantMetricsList,
            restaurantHealthList,
            revenueAnalyticsList,
            kitchenPerformanceList,
            restaurantFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            restaurantService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(restaurantService.getPipelineInfo()),
            restaurantService.getRestaurantHubs(authUserId, email, fullName),
            restaurantService.getBrands(authUserId, email, fullName),
            restaurantService.getBranchs(authUserId, email, fullName),
            restaurantService.getBusinessLicenses(authUserId, email, fullName),
            restaurantService.getDiningAreas(authUserId, email, fullName),
            restaurantService.getRestaurantTables(authUserId, email, fullName),
            restaurantService.getMenuCategorys(authUserId, email, fullName),
            restaurantService.getMenuItems(authUserId, email, fullName),
            restaurantService.getMenuVariants(authUserId, email, fullName),
            restaurantService.getAddOns(authUserId, email, fullName),
            restaurantService.getComboMeals(authUserId, email, fullName),
            restaurantService.getOrders(authUserId, email, fullName),
            restaurantService.getOrderItems(authUserId, email, fullName),
            restaurantService.getOrderQueues(authUserId, email, fullName),
            restaurantService.getKitchenRoutings(authUserId, email, fullName),
            restaurantService.getOrderTimelines(authUserId, email, fullName),
            restaurantService.getKitchenStations(authUserId, email, fullName),
            restaurantService.getPreparationQueues(authUserId, email, fullName),
            restaurantService.getCookingStatuss(authUserId, email, fullName),
            restaurantService.getReadyQueues(authUserId, email, fullName),
            restaurantService.getRushOrders(authUserId, email, fullName),
            restaurantService.getReservations(authUserId, email, fullName),
            restaurantService.getWaitingLists(authUserId, email, fullName),
            restaurantService.getCustomerProfiles(authUserId, email, fullName),
            restaurantService.getLoyaltyPrograms(authUserId, email, fullName),
            restaurantService.getFeedbackReviews(authUserId, email, fullName),
            restaurantService.getRestaurantMetrics(authUserId, email, fullName),
            restaurantService.getRestaurantHealths(authUserId, email, fullName),
            restaurantService.getRevenueAnalyticss(authUserId, email, fullName),
            restaurantService.getKitchenPerformances(authUserId, email, fullName),
            restaurantService.getRestaurantFailures(authUserId, email, fullName),
            restaurantService.getAuditLogs(authUserId, email, fullName),
            restaurantService.getRestaurantHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
restaurantHubsList,
            brandsList,
            branchesList,
            businessLicensesList,
            diningAreasList,
            restaurantTablesList,
            menuCategoriesList,
            menuItemsList,
            menuVariantsList,
            addOnsList,
            comboMealsList,
            ordersList,
            orderItemsList,
            orderQueueList,
            kitchenRoutingList,
            orderTimelineList,
            kitchenStationsList,
            preparationQueueList,
            cookingStatusList,
            readyQueueList,
            rushOrdersList,
            reservationsList,
            waitingListList,
            customerProfilesList,
            loyaltyProgramsList,
            feedbackReviewsList,
            restaurantMetricsList,
            restaurantHealthList,
            revenueAnalyticsList,
            kitchenPerformanceList,
            restaurantFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setRestaurantHubs(result.restaurantHubsList);
        setBrands(result.brandsList);
        setBranchs(result.branchesList);
        setBusinessLicenses(result.businessLicensesList);
        setDiningAreas(result.diningAreasList);
        setRestaurantTables(result.restaurantTablesList);
        setMenuCategorys(result.menuCategoriesList);
        setMenuItems(result.menuItemsList);
        setMenuVariants(result.menuVariantsList);
        setAddOns(result.addOnsList);
        setComboMeals(result.comboMealsList);
        setOrders(result.ordersList);
        setOrderItems(result.orderItemsList);
        setOrderQueues(result.orderQueueList);
        setKitchenRoutings(result.kitchenRoutingList);
        setOrderTimelines(result.orderTimelineList);
        setKitchenStations(result.kitchenStationsList);
        setPreparationQueues(result.preparationQueueList);
        setCookingStatuss(result.cookingStatusList);
        setReadyQueues(result.readyQueueList);
        setRushOrders(result.rushOrdersList);
        setReservations(result.reservationsList);
        setWaitingLists(result.waitingListList);
        setCustomerProfiles(result.customerProfilesList);
        setLoyaltyPrograms(result.loyaltyProgramsList);
        setFeedbackReviews(result.feedbackReviewsList);
        setRestaurantMetrics(result.restaurantMetricsList);
        setRestaurantHealths(result.restaurantHealthList);
        setRevenueAnalyticss(result.revenueAnalyticsList);
        setKitchenPerformances(result.kitchenPerformanceList);
        setRestaurantFailures(result.restaurantFailuresList);
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

    const createRestaurantHub = useCallback(async (input: CreateRestaurantHubInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createRestaurantHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrand = useCallback(async (input: CreateBrandInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createBrand(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBranch = useCallback(async (input: CreateBranchInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createBranch(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessLicense = useCallback(async (input: CreateBusinessLicenseInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createBusinessLicense(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDiningArea = useCallback(async (input: CreateDiningAreaInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createDiningArea(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRestaurantTable = useCallback(async (input: CreateRestaurantTableInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createRestaurantTable(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMenuCategory = useCallback(async (input: CreateMenuCategoryInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createMenuCategory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMenuItem = useCallback(async (input: CreateMenuItemInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createMenuItem(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMenuVariant = useCallback(async (input: CreateMenuVariantInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createMenuVariant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAddOn = useCallback(async (input: CreateAddOnInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createAddOn(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComboMeal = useCallback(async (input: CreateComboMealInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createComboMeal(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrder = useCallback(async (input: CreateOrderInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createOrder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrderItem = useCallback(async (input: CreateOrderItemInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createOrderItem(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrderQueue = useCallback(async (input: CreateOrderQueueInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createOrderQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKitchenRouting = useCallback(async (input: CreateKitchenRoutingInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createKitchenRouting(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrderTimeline = useCallback(async (input: CreateOrderTimelineInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createOrderTimeline(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKitchenStation = useCallback(async (input: CreateKitchenStationInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createKitchenStation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPreparationQueue = useCallback(async (input: CreatePreparationQueueInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createPreparationQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCookingStatus = useCallback(async (input: CreateCookingStatusInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createCookingStatus(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReadyQueue = useCallback(async (input: CreateReadyQueueInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createReadyQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRushOrder = useCallback(async (input: CreateRushOrderInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createRushOrder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReservation = useCallback(async (input: CreateReservationInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createReservation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWaitingList = useCallback(async (input: CreateWaitingListInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createWaitingList(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerProfile = useCallback(async (input: CreateCustomerProfileInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createCustomerProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLoyaltyProgram = useCallback(async (input: CreateLoyaltyProgramInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createLoyaltyProgram(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeedbackReview = useCallback(async (input: CreateFeedbackReviewInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createFeedbackReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRestaurantMetric = useCallback(async (input: CreateRestaurantMetricInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createRestaurantMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRestaurantHealth = useCallback(async (input: CreateRestaurantHealthInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createRestaurantHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueAnalytics = useCallback(async (input: CreateRevenueAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createRevenueAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKitchenPerformance = useCallback(async (input: CreateKitchenPerformanceInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createKitchenPerformance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRestaurantFailure = useCallback(async (input: CreateRestaurantFailureInput) => { if (!user) throw new Error("Authentication required"); await restaurantService.createRestaurantFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        restaurantHubs,
        createRestaurantHub,
        brands,
        createBrand,
        branches,
        createBranch,
        businessLicenses,
        createBusinessLicense,
        diningAreas,
        createDiningArea,
        restaurantTables,
        createRestaurantTable,
        menuCategories,
        createMenuCategory,
        menuItems,
        createMenuItem,
        menuVariants,
        createMenuVariant,
        addOns,
        createAddOn,
        comboMeals,
        createComboMeal,
        orders,
        createOrder,
        orderItems,
        createOrderItem,
        orderQueue,
        createOrderQueue,
        kitchenRouting,
        createKitchenRouting,
        orderTimeline,
        createOrderTimeline,
        kitchenStations,
        createKitchenStation,
        preparationQueue,
        createPreparationQueue,
        cookingStatus,
        createCookingStatus,
        readyQueue,
        createReadyQueue,
        rushOrders,
        createRushOrder,
        reservations,
        createReservation,
        waitingList,
        createWaitingList,
        customerProfiles,
        createCustomerProfile,
        loyaltyPrograms,
        createLoyaltyProgram,
        feedbackReviews,
        createFeedbackReview,
        restaurantMetrics,
        createRestaurantMetric,
        restaurantHealth,
        createRestaurantHealth,
        revenueAnalytics,
        createRevenueAnalytics,
        kitchenPerformance,
        createKitchenPerformance,
        restaurantFailures,
        createRestaurantFailure,
        auditLogs,
        restaurantHubOptions,
        refresh,
    };
}
