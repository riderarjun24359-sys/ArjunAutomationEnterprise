import { StatCard } from "@/src/components/ui/StatCard";
import type { FoDashboardStats } from "@/src/modules/founder-os/types";

interface FounderOsStatsProps { stats: FoDashboardStats | null; }

export function FounderOsStats({ stats }: FounderOsStatsProps) {
    const cards = [
        { title: "Workspaces", value: String(stats?.totalWorkspaces ?? 0), detail: `${stats?.activeWorkspaces ?? 0} active`, trend: "up" as const },
        { title: "OKRs & Runway", value: String((stats?.strategicOkrCount ?? 0) + (stats?.revenueRunwayCount ?? 0)), detail: `Avg runway ${(stats?.avgRunwayMonths ?? 0).toFixed(1)} months • ${stats?.executiveDashboardCount ?? 0} dashboards`, trend: "up" as const },
        { title: "Board & Investor", value: String((stats?.boardReportCount ?? 0) + (stats?.investorRelationCount ?? 0)), detail: `${stats?.capitalPlanCount ?? 0} capital plans • ${stats?.stakeholderCount ?? 0} stakeholders`, trend: "up" as const, tone: "accent" as const },
        { title: "Risks & Insights", value: String((stats?.riskRegisterCount ?? 0) + (stats?.founderInsightCount ?? 0)), detail: `${stats?.growthMetricCount ?? 0} growth metrics • ${(stats?.avgGrowthRatePercent ?? 0).toFixed(0)}% avg growth`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-amber-600 dark:[&_p:last-child]:text-amber-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
