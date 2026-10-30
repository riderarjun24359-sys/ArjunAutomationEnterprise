import { StatCard } from "@/src/components/ui/StatCard";
import type { AnalyticsDashboardStats } from "@/src/modules/analytics/types";

interface AnalyticsStatsProps {
    stats: AnalyticsDashboardStats | null;
}

export function AnalyticsStats({ stats }: AnalyticsStatsProps) {
    const cards = [
        { title: "Total Revenue", value: stats?.totalRevenue ?? "₹0", detail: `${stats?.outstandingInvoices ?? "₹0"} outstanding`, trend: "up" as const, tone: "accent" as const },
        { title: "Active Clients", value: stats?.activeClients ?? "0", detail: `${stats?.activeProjects ?? 0} active projects`, trend: "up" as const },
        { title: "Open Tasks", value: stats?.openTasks ?? "0", detail: `${stats?.storedMetrics ?? 0} tracked metrics`, trend: "up" as const },
        { title: "Workflow Success", value: stats?.workflowSuccessRate ?? "0%", detail: "Automation health", trend: "up" as const },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
