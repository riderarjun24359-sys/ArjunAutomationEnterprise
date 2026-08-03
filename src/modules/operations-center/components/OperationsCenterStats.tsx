import { StatCard } from "@/src/components/ui/StatCard";
import type { EocDashboardStats } from "@/src/modules/operations-center/types";

interface OperationsCenterStatsProps { stats: EocDashboardStats | null; }

export function OperationsCenterStats({ stats }: OperationsCenterStatsProps) {
    const cards = [
        { title: "Operations Centers", value: String(stats?.totalOperationsCenters ?? 0), detail: `${stats?.activeOperationsCenters ?? 0} active • ${stats?.overallHealthCount ?? 0} health checks`, trend: "up" as const },
        { title: "Background Jobs", value: String(stats?.activeJobCount ?? 0), detail: `${stats?.pendingRetryCount ?? 0} pending retries • ${stats?.openAlertCount ?? 0} open alerts`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.avgHealthScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, alerts, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-emerald-600 dark:[&_p:last-child]:text-emerald-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
