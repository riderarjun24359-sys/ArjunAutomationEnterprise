"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AdjustmentsPanel,
    AlertsPanel,
    AssetsPanel,
    AuditPanel,
    BarcodesPanel,
    CatalogPanel,
    CategoriesPanel,
    GrnPanel,
    InventoryOverviewPanel,
    InventoryReportsPanel,
    MovementsPanel,
    PurchaseOrdersPanel,
    SuppliersPanel,
    TransfersPanel,
    ValuationPanel,
    WarehousesPanel,
} from "@/src/modules/inventory/components/InventoryPanels";
import { InventoryStats } from "@/src/modules/inventory/components/InventoryStats";
import { INVENTORY_TABS } from "@/src/modules/inventory/constants";
import { useInventory } from "@/src/modules/inventory/hooks/useInventory";

const tabs = [
    { id: INVENTORY_TABS.overview, label: "Overview" },
    { id: INVENTORY_TABS.catalog, label: "Catalog" },
    { id: INVENTORY_TABS.categories, label: "Categories" },
    { id: INVENTORY_TABS.warehouses, label: "Warehouses" },
    { id: INVENTORY_TABS.movements, label: "Movements" },
    { id: INVENTORY_TABS.adjustments, label: "Adjustments" },
    { id: INVENTORY_TABS.purchaseOrders, label: "Purchase Orders" },
    { id: INVENTORY_TABS.suppliers, label: "Suppliers" },
    { id: INVENTORY_TABS.assets, label: "Assets" },
    { id: INVENTORY_TABS.barcodes, label: "Barcodes" },
    { id: INVENTORY_TABS.alerts, label: "Alerts" },
    { id: INVENTORY_TABS.transfers, label: "Transfers" },
    { id: INVENTORY_TABS.grn, label: "GRN" },
    { id: INVENTORY_TABS.valuation, label: "Valuation" },
    { id: INVENTORY_TABS.reports, label: "Reports" },
    { id: INVENTORY_TABS.audit, label: "Audit" },
] as const;

export function InventoryPage() {
    const inventory = useInventory();
    const [activeTab, setActiveTab] = useState<(typeof INVENTORY_TABS)[keyof typeof INVENTORY_TABS]>(INVENTORY_TABS.overview);

    if (inventory.loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading inventory and asset management data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Supply Chain</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Inventory & Asset Management</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Manage product catalog, categories, warehouses, stock movements, adjustments, purchase orders, suppliers, assets, barcodes, low-stock alerts, transfers, GRNs, valuation, reports, and audit history from one Supabase-backed workspace.
                </p>
            </motion.header>

            <InventoryStats stats={inventory.stats} />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === INVENTORY_TABS.overview ? <InventoryOverviewPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.catalog ? <CatalogPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.categories ? <CategoriesPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.warehouses ? <WarehousesPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.movements ? <MovementsPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.adjustments ? <AdjustmentsPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.purchaseOrders ? <PurchaseOrdersPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.suppliers ? <SuppliersPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.assets ? <AssetsPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.barcodes ? <BarcodesPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.alerts ? <AlertsPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.transfers ? <TransfersPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.grn ? <GrnPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.valuation ? <ValuationPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.reports ? <InventoryReportsPanel data={inventory} /> : null}
            {activeTab === INVENTORY_TABS.audit ? <AuditPanel data={inventory} /> : null}
        </div>
    );
}
