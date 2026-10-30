import { StatCard } from "@/src/components/ui/StatCard";
import type { InventoryDashboardStats } from "@/src/modules/inventory/types";

interface InventoryStatsProps {
    stats: InventoryDashboardStats | null;
}

export function InventoryStats({ stats }: InventoryStatsProps) {
    const cards = [
        { title: "Products", value: String(stats?.totalProducts ?? 0), detail: `${stats?.totalStockUnits ?? 0} units in stock`, trend: "up" as const },
        { title: "Warehouses", value: String(stats?.totalWarehouses ?? 0), detail: `${stats?.openTransfers ?? 0} open transfers`, trend: "up" as const },
        { title: "Inventory Value", value: stats?.inventoryValue ? `₹${stats.inventoryValue.toLocaleString()}` : "₹0", detail: `${stats?.openAlerts ?? 0} low-stock alerts`, trend: "up" as const, tone: "accent" as const },
        { title: "Assets", value: String(stats?.activeAssets ?? 0), detail: `${stats?.pendingPurchaseOrders ?? 0} pending POs`, trend: "up" as const },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
