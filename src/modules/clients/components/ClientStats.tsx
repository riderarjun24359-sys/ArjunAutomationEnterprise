import { StatCard } from "@/src/components/ui/StatCard";
import type { ClientDashboardStats } from "@/src/modules/clients/types";

interface ClientStatsProps {
    stats: ClientDashboardStats | null;
}

export function ClientStats({ stats }: ClientStatsProps) {
    const statCards = [
        {
            title: "Total Clients",
            value: stats?.totalClients.toString() ?? "0",
            detail: `${stats?.activeClients ?? 0} active`,
            trend: "up" as const,
            tone: "accent" as const,
        },
        {
            title: "At Risk",
            value: stats?.atRiskClients.toString() ?? "0",
            detail: "Needs attention",
            trend: stats?.atRiskClients ? ("down" as const) : ("up" as const),
        },
        {
            title: "Linked Projects",
            value: stats?.linkedProjects.toString() ?? "0",
            detail: "Active delivery",
            trend: "up" as const,
        },
        {
            title: "Portfolio Revenue",
            value: stats?.totalRevenue ?? "$0",
            detail: `${stats?.inactiveClients ?? 0} inactive`,
            trend: "up" as const,
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
