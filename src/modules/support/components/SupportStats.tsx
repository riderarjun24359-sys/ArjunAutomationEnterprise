import { StatCard } from "@/src/components/ui/StatCard";
import type { SupportDashboardStats } from "@/src/modules/support/types";

interface SupportStatsProps {
    stats: SupportDashboardStats | null;
}

export function SupportStats({ stats }: SupportStatsProps) {
    const cards = [
        { title: "Total Tickets", value: String(stats?.totalTickets ?? 0), detail: `${stats?.openTickets ?? 0} open`, trend: "up" as const },
        { title: "Resolved", value: String(stats?.resolvedTickets ?? 0), detail: `${stats?.slaCompliance ?? 0}% SLA compliance`, trend: "up" as const },
        { title: "Satisfaction", value: stats?.avgSatisfaction ? String(stats.avgSatisfaction) : "0", detail: `${stats?.activeAgents ?? 0} active agents`, trend: "up" as const, tone: "accent" as const },
        { title: "Knowledge Base", value: String(stats?.knowledgeArticles ?? 0), detail: `${stats?.openEscalations ?? 0} escalation rules`, trend: "up" as const },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
