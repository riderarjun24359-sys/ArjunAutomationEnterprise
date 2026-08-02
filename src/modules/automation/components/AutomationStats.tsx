import { StatCard } from "@/src/components/ui/StatCard";
import type { AutomationDashboardStats } from "@/src/modules/automation/types";

interface AutomationStatsProps {
    stats: AutomationDashboardStats | null;
}

export function AutomationStats({ stats }: AutomationStatsProps) {
    const cards = [
        { title: "Active Workflows", value: stats?.activeWorkflows ?? "0", detail: `${stats?.pausedWorkflows ?? 0} paused`, trend: "up" as const, tone: "accent" as const },
        { title: "Success Rate", value: stats?.successRate ?? "0%", detail: `${stats?.completedExecutions ?? 0} completed`, trend: "up" as const },
        { title: "Active Agents", value: stats?.activeAgents ?? "0", detail: `${stats?.runningExecutions ?? 0} running`, trend: "up" as const },
        { title: "Error Logs", value: stats?.errorLogs ?? "0", detail: `${stats?.failedExecutions ?? 0} failed runs`, trend: Number(stats?.errorLogs ?? 0) > 0 ? ("down" as const) : ("up" as const) },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
