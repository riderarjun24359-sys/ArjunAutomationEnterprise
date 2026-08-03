import { StatCard } from "@/src/components/ui/StatCard";
import type { SaDashboardStats } from "@/src/modules/solution-architect/types";

interface SolutionArchitectStatsProps { stats: SaDashboardStats | null; }

export function SolutionArchitectStats({ stats }: SolutionArchitectStatsProps) {
    const cards = [
        { title: "Engagements", value: String(stats?.totalEngagements ?? 0), detail: `${stats?.activeEngagements ?? 0} active`, trend: "up" as const },
        { title: "Architectures", value: String((stats?.architectureCount ?? 0) + (stats?.decompositionCount ?? 0)), detail: `${stats?.domainModelCount ?? 0} domain models`, trend: "up" as const },
        { title: "Contracts & Modules", value: String((stats?.apiContractCount ?? 0) + (stats?.moduleSelectionCount ?? 0)), detail: `${stats?.databaseSchemaCount ?? 0} database schemas`, trend: "up" as const, tone: "accent" as const },
        { title: "Reviews", value: String(stats?.pendingReviews ?? 0), detail: `${stats?.versionCount ?? 0} versions`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-cyan-600 dark:[&_p:last-child]:text-cyan-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
