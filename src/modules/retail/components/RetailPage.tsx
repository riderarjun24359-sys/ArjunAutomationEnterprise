"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    RetailHubsPanel,
    RetailBrandsPanel,
    StoresPanel,
    CashRegistersPanel,
    StoreDepartmentsPanel,
    ProductsPanel,
    ProductCategorysPanel,
    ProductVariantsPanel,
    PromotionsPanel,
    SalesOrdersPanel,
    PosTransactionsPanel,
    ReturnsExchangesPanel,
    ShiftClosingsPanel,
    WarehousesPanel,
    StockLevelsPanel,
    PurchaseOrdersPanel,
    SuppliersPanel,
    CustomerProfilesPanel,
    LoyaltyProgramsPanel,
    RewardPointsPanel,
    CampaignsPanel,
    DailyClosingsPanel,
    BranchPerformancesPanel,
    CommissionRecordsPanel,
    SalesAnalyticssPanel,
    InventoryAnalyticssPanel,
    ProfitabilityAnalyticssPanel,
    RetailMetricsPanel,
    RetailHealthsPanel,
    ExecutiveKpisPanel,
    RetailFailuresPanel,
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/retail/components/RetailPanels";
import { RetailStats } from "@/src/modules/retail/components/RetailStats";
import { RTL_TABS } from "@/src/modules/retail/constants";
import { useRetail } from "@/src/modules/retail/hooks/useRetail";

const tabs = [
    { id: RTL_TABS.overview, label: "Overview" },
    { id: RTL_TABS.retailHubs, label: "Retail Hubs" },
    { id: RTL_TABS.retailBrands, label: "Retail Brands" },
    { id: RTL_TABS.stores, label: "Stores" },
    { id: RTL_TABS.cashRegisters, label: "Cash Registers" },
    { id: RTL_TABS.storeDepartments, label: "Store Departments" },
    { id: RTL_TABS.products, label: "Products" },
    { id: RTL_TABS.productCategories, label: "Product Categories" },
    { id: RTL_TABS.productVariants, label: "Product Variants" },
    { id: RTL_TABS.promotions, label: "Promotions" },
    { id: RTL_TABS.salesOrders, label: "Sales Orders" },
    { id: RTL_TABS.posTransactions, label: "Pos Transactions" },
    { id: RTL_TABS.returnsExchanges, label: "Returns Exchanges" },
    { id: RTL_TABS.shiftClosings, label: "Shift Closings" },
    { id: RTL_TABS.warehouses, label: "Warehouses" },
    { id: RTL_TABS.stockLevels, label: "Stock Levels" },
    { id: RTL_TABS.purchaseOrders, label: "Purchase Orders" },
    { id: RTL_TABS.suppliers, label: "Suppliers" },
    { id: RTL_TABS.customerProfiles, label: "Customer Profiles" },
    { id: RTL_TABS.loyaltyPrograms, label: "Loyalty Programs" },
    { id: RTL_TABS.rewardPoints, label: "Reward Points" },
    { id: RTL_TABS.campaigns, label: "Campaigns" },
    { id: RTL_TABS.dailyClosings, label: "Daily Closings" },
    { id: RTL_TABS.branchPerformance, label: "Branch Performance" },
    { id: RTL_TABS.commissionRecords, label: "Commission Records" },
    { id: RTL_TABS.salesAnalytics, label: "Sales Analytics" },
    { id: RTL_TABS.inventoryAnalytics, label: "Inventory Analytics" },
    { id: RTL_TABS.profitabilityAnalytics, label: "Profitability Analytics" },
    { id: RTL_TABS.retailMetrics, label: "Retail Metrics" },
    { id: RTL_TABS.retailHealth, label: "Retail Health" },
    { id: RTL_TABS.executiveKpis, label: "Executive Kpis" },
    { id: RTL_TABS.retailFailures, label: "Retail Failures" },
    { id: RTL_TABS.auditLogs, label: "Audit Logs" },
    { id: RTL_TABS.api, label: "SDK" },
] as const;

export function RetailPage() {
    const retail = useRetail();
    const [activeTab, setActiveTab] = useState<(typeof RTL_TABS)[keyof typeof RTL_TABS]>(RTL_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Retail OS" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-lime-600">V2 Program A Program B Sprint 9</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Retail OS</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Retail OS SDK.
                </p>
            </motion.header>
            <RetailStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-lime-600 text-white" : "border border-slate-200 text-slate-600 hover:border-lime-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === RTL_TABS.overview ? <RetailOverviewPanel data={retail} /> : null}
            {activeTab === RTL_TABS.retailHubs ? <RetailHubsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.retailBrands ? <RetailBrandsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.stores ? <StoresPanel data={retail} /> : null}
            {activeTab === RTL_TABS.cashRegisters ? <CashRegistersPanel data={retail} /> : null}
            {activeTab === RTL_TABS.storeDepartments ? <StoreDepartmentsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.products ? <ProductsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.productCategories ? <ProductCategorysPanel data={retail} /> : null}
            {activeTab === RTL_TABS.productVariants ? <ProductVariantsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.promotions ? <PromotionsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.salesOrders ? <SalesOrdersPanel data={retail} /> : null}
            {activeTab === RTL_TABS.posTransactions ? <PosTransactionsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.returnsExchanges ? <ReturnsExchangesPanel data={retail} /> : null}
            {activeTab === RTL_TABS.shiftClosings ? <ShiftClosingsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.warehouses ? <WarehousesPanel data={retail} /> : null}
            {activeTab === RTL_TABS.stockLevels ? <StockLevelsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.purchaseOrders ? <PurchaseOrdersPanel data={retail} /> : null}
            {activeTab === RTL_TABS.suppliers ? <SuppliersPanel data={retail} /> : null}
            {activeTab === RTL_TABS.customerProfiles ? <CustomerProfilesPanel data={retail} /> : null}
            {activeTab === RTL_TABS.loyaltyPrograms ? <LoyaltyProgramsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.rewardPoints ? <RewardPointsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.campaigns ? <CampaignsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.dailyClosings ? <DailyClosingsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.branchPerformance ? <BranchPerformancesPanel data={retail} /> : null}
            {activeTab === RTL_TABS.commissionRecords ? <CommissionRecordsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.salesAnalytics ? <SalesAnalyticssPanel data={retail} /> : null}
            {activeTab === RTL_TABS.inventoryAnalytics ? <InventoryAnalyticssPanel data={retail} /> : null}
            {activeTab === RTL_TABS.profitabilityAnalytics ? <ProfitabilityAnalyticssPanel data={retail} /> : null}
            {activeTab === RTL_TABS.retailMetrics ? <RetailMetricsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.retailHealth ? <RetailHealthsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.executiveKpis ? <ExecutiveKpisPanel data={retail} /> : null}
            {activeTab === RTL_TABS.retailFailures ? <RetailFailuresPanel data={retail} /> : null}
            {activeTab === RTL_TABS.auditLogs ? <RetailAuditLogsPanel data={retail} /> : null}
            {activeTab === RTL_TABS.api ? <RetailSdkPanel data={retail} /> : null}
        </div>
    );
}
