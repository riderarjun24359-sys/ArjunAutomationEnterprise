import { StatCard } from "@/src/components/ui/StatCard";
import type { AiOrchestrationDashboardStats } from "@/src/modules/ai-orchestration/types";

interface AiOrchestrationStatsProps { stats: AiOrchestrationDashboardStats | null; }

export function AiOrchestrationStats({ stats }: AiOrchestrationStatsProps) {
    const cards = [
        { title: "AI Providers", value: String(stats?.totalProviders ?? 0), detail: `${stats?.healthyProviders ?? 0} healthy`, trend: "up" as const },
        { title: "Active Agents", value: String(stats?.activeAgents ?? 0), detail: `${stats?.activeSessions ?? 0} sessions`, trend: "up" as const },
        { title: "Task Executions", value: String((stats?.completedTasks ?? 0) + (stats?.pendingTasks ?? 0)), detail: `${stats?.completedTasks ?? 0} completed`, trend: "up" as const, tone: "accent" as const },
        { title: "Total Cost", value: `$${(stats?.totalCostUsd ?? 0).toFixed(4)}`, detail: `${(stats?.totalTokens ?? 0).toLocaleString()} tokens`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
