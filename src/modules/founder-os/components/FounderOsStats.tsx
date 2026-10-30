import { StatCard } from "@/src/components/ui/StatCard";
import type { FoDashboardStats, FoPhase3Stats } from "@/src/modules/founder-os/types";

interface FounderOsStatsProps { stats: FoDashboardStats | null; phase3Stats?: FoPhase3Stats | null; }

export function FounderOsStats({ stats, phase3Stats }: FounderOsStatsProps) {
    const cards = [
        { title: "Workspaces", value: String(stats?.totalWorkspaces ?? 0), detail: `${stats?.activeWorkspaces ?? 0} active`, trend: "up" as const },
        { title: "OKRs & Runway", value: String((stats?.strategicOkrCount ?? 0) + (stats?.revenueRunwayCount ?? 0)), detail: `Avg runway ${(stats?.avgRunwayMonths ?? 0).toFixed(1)} months • ${stats?.executiveDashboardCount ?? 0} dashboards`, trend: "up" as const },
        { title: "Production & Revenue", value: phase3Stats?.liveProductionStatus ?? "—", detail: `₹${(phase3Stats?.revenueToday ?? 0).toLocaleString()} today • ${phase3Stats?.activeIncidents ?? 0} incidents`, trend: "up" as const, tone: "accent" as const },
        { title: "Platform Health", value: `${(phase3Stats?.platformAvailability ?? 0).toFixed(0)}%`, detail: `${phase3Stats?.pendingApprovals ?? 0} pending approvals • ${(phase3Stats?.customerSatisfactionOverview ?? 0).toFixed(0)}% CSAT`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-amber-600 dark:[&_p:last-child]:text-amber-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
