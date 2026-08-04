import { StatCard } from "@/src/components/ui/StatCard";
import type { AagoDashboardStats } from "@/src/modules/growth-engine/types";

interface GrowthEngineStatsProps { stats: AagoDashboardStats | null; }

export function GrowthEngineStats({ stats }: GrowthEngineStatsProps) {
    const cards = [
        { title: "Operations Hubs", value: String(stats?.totalOperationsHubs ?? 0), detail: `${stats?.activeOperationsHubs ?? 0} active • ${stats?.brandKnowledgeBaseCount ?? 0} knowledge entries`, trend: "up" as const },
        { title: "Creative & Distribution", value: String(stats?.videoProjectCount ?? 0), detail: `${stats?.distributionContentQueueCount ?? 0} content queue • ${stats?.campaignDashboardCount ?? 0} dashboards`, trend: "up" as const, tone: "accent" as const },
        { title: "Operations Score", value: `${(stats?.overallOperationsScore ?? 0).toFixed(1)}`, detail: `${stats?.openOperationalFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Brand OS, creative studio, distribution, and command center audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-pink-600 dark:[&_p:last-child]:text-pink-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
