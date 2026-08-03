import { StatCard } from "@/src/components/ui/StatCard";
import type { RtlDashboardStats } from "@/src/modules/retail/types";

interface RetailStatsProps { stats: RtlDashboardStats | null; }

export function RetailStats({ stats }: RetailStatsProps) {
    const cards = [
        { title: "Retail Hubs", value: String(stats?.totalRetailHubs ?? 0), detail: `${stats?.activeRetailHubs ?? 0} active • ${stats?.retailBrandCount ?? 0} dining areas`, trend: "up" as const },
        { title: "Sales & POS", value: String(stats?.customerProfileCount ?? 0), detail: `${stats?.salesOrderCount ?? 0} sales orders • ${stats?.openPosTransactionCount ?? 0} open POS transactions`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallRetailScore ?? 0).toFixed(1)}`, detail: `${stats?.openRetailFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, retailInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-lime-600 dark:[&_p:last-child]:text-lime-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
