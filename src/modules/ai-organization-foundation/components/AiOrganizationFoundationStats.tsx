import { StatCard } from "@/src/components/ui/StatCard";
import type { AofDashboardStats } from "@/src/modules/ai-organization-foundation/types";

interface AiOrganizationFoundationStatsProps { stats: AofDashboardStats | null; }

export function AiOrganizationFoundationStats({ stats }: AiOrganizationFoundationStatsProps) {
    const cards = [
        { title: "Organization Hubs", value: String(stats?.totalOrganizationHubs ?? 0), detail: `${stats?.activeOrganizationHubs ?? 0} active • ${stats?.growthOrchestratorCount ?? 0} dining areas`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.deliveryOrchestratorCount ?? 0), detail: `${stats?.ideaRegistryCount ?? 0} ideaRegistry • ${stats?.aiTaskRouterCount ?? 0} open aiTaskRouters`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallOrganizationScore ?? 0).toFixed(1)}`, detail: `${stats?.openOrganizationFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, aiTaskRouters, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-orange-600 dark:[&_p:last-child]:text-orange-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
