import { StatCard } from "@/src/components/ui/StatCard";
import type { SalesDashboardStats } from "@/src/modules/sales/types";

interface SalesStatsProps { stats: SalesDashboardStats | null; }

export function SalesStats({ stats }: SalesStatsProps) {
    const cards = [
        { title: "Pipeline Value", value: stats?.pipelineValue ? `₹${stats.pipelineValue.toLocaleString()}` : "₹0", detail: `₹${(stats?.weightedPipeline ?? 0).toLocaleString()} weighted`, trend: "up" as const },
        { title: "Open Opportunities", value: String(stats?.openOpportunities ?? 0), detail: `${stats?.totalLeads ?? 0} active leads`, trend: "up" as const },
        { title: "Closed Won", value: stats?.closedWonValue ? `₹${stats.closedWonValue.toLocaleString()}` : "₹0", detail: `${stats?.winRate ?? 0}% win rate`, trend: "up" as const, tone: "accent" as const },
        { title: "Target Achievement", value: `${stats?.targetAchievement ?? 0}%`, detail: `${stats?.activeQuotes ?? 0} active quotes`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
