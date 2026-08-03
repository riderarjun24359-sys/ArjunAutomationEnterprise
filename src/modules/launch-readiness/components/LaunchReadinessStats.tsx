import { StatCard } from "@/src/components/ui/StatCard";
import type { ElrDashboardStats } from "@/src/modules/launch-readiness/types";

interface LaunchReadinessStatsProps { stats: ElrDashboardStats | null; }

export function LaunchReadinessStats({ stats }: LaunchReadinessStatsProps) {
    const cards = [
        { title: "Readiness Hubs", value: String(stats?.totalReadinessHubs ?? 0), detail: `${stats?.activeReadinessHubs ?? 0} active • ${stats?.deploymentPlanCount ?? 0} deployment plans`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.backupPolicyCount ?? 0), detail: `${stats?.recoveryDrillCount ?? 0} recovery drills • ${stats?.openBlockerCount ?? 0} open blockers`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallLaunchScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, launchBlockers, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-rose-600 dark:[&_p:last-child]:text-rose-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
