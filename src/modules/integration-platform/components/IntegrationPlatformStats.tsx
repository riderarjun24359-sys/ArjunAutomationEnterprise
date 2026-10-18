import { StatCard } from "@/src/components/ui/StatCard";
import type { IntgDashboardStats } from "@/src/modules/integration-platform/types";

interface IntegrationPlatformStatsProps { stats: IntgDashboardStats | null; }

export function IntegrationPlatformStats({ stats }: IntegrationPlatformStatsProps) {
    const cards = [
        { title: "Integration Hubs", value: String(stats?.totalIntegrationHubs ?? 0), detail: `${stats?.activeIntegrationHubs ?? 0} active • ${stats?.connectedServiceCount ?? 0} connected services`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.activeConnectorCount ?? 0), detail: `${stats?.pendingRetryCount ?? 0} pending retries • ${stats?.failedTransactionCount ?? 0} failed transactions`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.avgHealthScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Connector, API, webhook, and marketplace audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-orange-600 dark:[&_p:last-child]:text-orange-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
