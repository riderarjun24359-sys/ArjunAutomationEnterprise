"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RestaurantOverviewPanel,
    RestaurantHubsPanel,
    BrandsPanel,
    BranchsPanel,
    BusinessLicensesPanel,
    DiningAreasPanel,
    RestaurantTablesPanel,
    MenuCategorysPanel,
    MenuItemsPanel,
    MenuVariantsPanel,
    AddOnsPanel,
    ComboMealsPanel,
    OrdersPanel,
    OrderItemsPanel,
    OrderQueuesPanel,
    KitchenRoutingsPanel,
    OrderTimelinesPanel,
    KitchenStationsPanel,
    PreparationQueuesPanel,
    CookingStatussPanel,
    ReadyQueuesPanel,
    RushOrdersPanel,
    ReservationsPanel,
    WaitingListsPanel,
    CustomerProfilesPanel,
    LoyaltyProgramsPanel,
    FeedbackReviewsPanel,
    RestaurantMetricsPanel,
    RestaurantHealthsPanel,
    RevenueAnalyticssPanel,
    KitchenPerformancesPanel,
    RestaurantFailuresPanel,
    RestaurantAuditLogsPanel,
    RestaurantSdkPanel,
} from "@/src/modules/restaurant/components/RestaurantPanels";
import { RestaurantStats } from "@/src/modules/restaurant/components/RestaurantStats";
import { RST_TABS } from "@/src/modules/restaurant/constants";
import { useRestaurant } from "@/src/modules/restaurant/hooks/useRestaurant";

const tabs = [
    { id: RST_TABS.overview, label: "Overview" },
    { id: RST_TABS.restaurantHubs, label: "Restaurant Hubs" },
    { id: RST_TABS.brands, label: "Brands" },
    { id: RST_TABS.branches, label: "Branches" },
    { id: RST_TABS.businessLicenses, label: "Business Licenses" },
    { id: RST_TABS.diningAreas, label: "Dining Areas" },
    { id: RST_TABS.restaurantTables, label: "Restaurant Tables" },
    { id: RST_TABS.menuCategories, label: "Menu Categories" },
    { id: RST_TABS.menuItems, label: "Menu Items" },
    { id: RST_TABS.menuVariants, label: "Menu Variants" },
    { id: RST_TABS.addOns, label: "Add Ons" },
    { id: RST_TABS.comboMeals, label: "Combo Meals" },
    { id: RST_TABS.orders, label: "Orders" },
    { id: RST_TABS.orderItems, label: "Order Items" },
    { id: RST_TABS.orderQueue, label: "Order Queue" },
    { id: RST_TABS.kitchenRouting, label: "Kitchen Routing" },
    { id: RST_TABS.orderTimeline, label: "Order Timeline" },
    { id: RST_TABS.kitchenStations, label: "Kitchen Stations" },
    { id: RST_TABS.preparationQueue, label: "Preparation Queue" },
    { id: RST_TABS.cookingStatus, label: "Cooking Status" },
    { id: RST_TABS.readyQueue, label: "Ready Queue" },
    { id: RST_TABS.rushOrders, label: "Rush Orders" },
    { id: RST_TABS.reservations, label: "Reservations" },
    { id: RST_TABS.waitingList, label: "Waiting List" },
    { id: RST_TABS.customerProfiles, label: "Customer Profiles" },
    { id: RST_TABS.loyaltyPrograms, label: "Loyalty Programs" },
    { id: RST_TABS.feedbackReviews, label: "Feedback Reviews" },
    { id: RST_TABS.restaurantMetrics, label: "Restaurant Metrics" },
    { id: RST_TABS.restaurantHealth, label: "Restaurant Health" },
    { id: RST_TABS.revenueAnalytics, label: "Revenue Analytics" },
    { id: RST_TABS.kitchenPerformance, label: "Kitchen Performance" },
    { id: RST_TABS.restaurantFailures, label: "Restaurant Failures" },
    { id: RST_TABS.auditLogs, label: "Audit Logs" },
    { id: RST_TABS.api, label: "SDK" },
] as const;

export function RestaurantPage() {
    const restaurant = useRestaurant();
    const [activeTab, setActiveTab] = useState<(typeof RST_TABS)[keyof typeof RST_TABS]>(RST_TABS.overview);

    if (restaurant.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Restaurant OS" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">V2 Program A Program B Sprint 6</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Restaurant OS</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and restaurant operating system dashboard with security-first audit and the shared Restaurant OS SDK.
                </p>
            </motion.header>
            <RestaurantStats stats={restaurant.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-slate-600 hover:border-orange-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === RST_TABS.overview ? <RestaurantOverviewPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.restaurantHubs ? <RestaurantHubsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.brands ? <BrandsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.branches ? <BranchsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.businessLicenses ? <BusinessLicensesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.diningAreas ? <DiningAreasPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.restaurantTables ? <RestaurantTablesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.menuCategories ? <MenuCategorysPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.menuItems ? <MenuItemsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.menuVariants ? <MenuVariantsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.addOns ? <AddOnsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.comboMeals ? <ComboMealsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.orders ? <OrdersPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.orderItems ? <OrderItemsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.orderQueue ? <OrderQueuesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.kitchenRouting ? <KitchenRoutingsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.orderTimeline ? <OrderTimelinesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.kitchenStations ? <KitchenStationsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.preparationQueue ? <PreparationQueuesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.cookingStatus ? <CookingStatussPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.readyQueue ? <ReadyQueuesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.rushOrders ? <RushOrdersPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.reservations ? <ReservationsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.waitingList ? <WaitingListsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.customerProfiles ? <CustomerProfilesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.loyaltyPrograms ? <LoyaltyProgramsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.feedbackReviews ? <FeedbackReviewsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.restaurantMetrics ? <RestaurantMetricsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.restaurantHealth ? <RestaurantHealthsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.revenueAnalytics ? <RevenueAnalyticssPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.kitchenPerformance ? <KitchenPerformancesPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.restaurantFailures ? <RestaurantFailuresPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.auditLogs ? <RestaurantAuditLogsPanel data={restaurant} /> : null}
            {activeTab === RST_TABS.api ? <RestaurantSdkPanel data={restaurant} /> : null}
        </div>
    );
}
