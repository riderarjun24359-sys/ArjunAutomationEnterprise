import { StatCard } from "@/src/components/ui/StatCard";
import type { AageDashboardStats } from "@/src/modules/growth-engine/types";

interface GrowthEngineStatsProps { stats: AageDashboardStats | null; }

export function GrowthEngineStats({ stats }: GrowthEngineStatsProps) {
    const cards = [
        { title: "Growth Hubs", value: String(stats?.totalGrowthHubs ?? 0), detail: `${stats?.activeGrowthHubs ?? 0} active • ${stats?.brandProfileCount ?? 0} brand profiles`, trend: "up" as const },
        { title: "Content Pipeline", value: String(stats?.youtubeTemplateCount ?? 0), detail: `${stats?.imageAssetCount ?? 0} media assets • ${stats?.ideaGeneratorCount ?? 0} generators`, trend: "up" as const, tone: "accent" as const },
        { title: "Growth Score", value: `${(stats?.overallGrowthScore ?? 0).toFixed(1)}`, detail: `${stats?.publishingQueueCount ?? 0} in publishing queue`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Brand, content, media, engine, and dashboard audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-pink-600 dark:[&_p:last-child]:text-pink-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
