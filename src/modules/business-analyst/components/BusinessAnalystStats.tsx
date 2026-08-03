import { StatCard } from "@/src/components/ui/StatCard";
import type { BaDashboardStats } from "@/src/modules/business-analyst/types";

interface BusinessAnalystStatsProps { stats: BaDashboardStats | null; }

export function BusinessAnalystStats({ stats }: BusinessAnalystStatsProps) {
    const cards = [
        { title: "Engagements", value: String(stats?.totalEngagements ?? 0), detail: `${stats?.activeEngagements ?? 0} active`, trend: "up" as const },
        { title: "Requirements", value: String((stats?.brdCount ?? 0) + (stats?.frsCount ?? 0)), detail: `${stats?.userStoryCount ?? 0} user stories`, trend: "up" as const },
        { title: "Analysis", value: String((stats?.gapAnalysisCount ?? 0) + (stats?.openRisks ?? 0)), detail: `${stats?.processMapCount ?? 0} process maps`, trend: "up" as const, tone: "accent" as const },
        { title: "Approvals", value: String(stats?.pendingApprovals ?? 0), detail: `${stats?.proposalCount ?? 0} proposals`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
