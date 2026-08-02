import { StatCard } from "@/src/components/ui/StatCard";
import type { KnowledgeDashboardStats } from "@/src/modules/knowledge/types";

interface KnowledgeStatsProps { stats: KnowledgeDashboardStats | null; }

export function KnowledgeStats({ stats }: KnowledgeStatsProps) {
    const cards = [
        { title: "Knowledge Entries", value: String(stats?.totalEntries ?? 0), detail: `${stats?.publishedEntries ?? 0} published`, trend: "up" as const },
        { title: "Solutions & ADRs", value: String((stats?.totalSolutions ?? 0) + (stats?.totalAdrs ?? 0)), detail: `${stats?.totalAdrs ?? 0} architecture decisions`, trend: "up" as const },
        { title: "Memory Records", value: String((stats?.projectMemories ?? 0) + (stats?.clientMemories ?? 0)), detail: `${stats?.activeAiContexts ?? 0} AI contexts`, trend: "up" as const, tone: "accent" as const },
        { title: "Cross-Module Links", value: String(stats?.crossModuleLinks ?? 0), detail: `${stats?.documentationPages ?? 0} documentation pages`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
