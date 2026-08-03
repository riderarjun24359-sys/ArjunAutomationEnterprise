import { StatCard } from "@/src/components/ui/StatCard";
import type { RstDashboardStats } from "@/src/modules/restaurant/types";

interface RestaurantStatsProps { stats: RstDashboardStats | null; }

export function RestaurantStats({ stats }: RestaurantStatsProps) {
    const cards = [
        { title: "Restaurant Hubs", value: String(stats?.totalRestaurantHubs ?? 0), detail: `${stats?.activeRestaurantHubs ?? 0} active • ${stats?.diningAreaCount ?? 0} dining areas`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.menuCategoryCount ?? 0), detail: `${stats?.orderCount ?? 0} orders • ${stats?.openReservationCount ?? 0} open reservations`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallRestaurantScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, reservations, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-orange-600 dark:[&_p:last-child]:text-orange-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
