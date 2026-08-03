import { StatCard } from "@/src/components/ui/StatCard";
import type { CsDashboardStats } from "@/src/modules/customer-success/types";

interface CustomerSuccessStatsProps { stats: CsDashboardStats | null; }

export function CustomerSuccessStats({ stats }: CustomerSuccessStatsProps) {
    const cards = [
        { title: "Engagements", value: String(stats?.totalEngagements ?? 0), detail: `${stats?.activeEngagements ?? 0} active`, trend: "up" as const },
        { title: "Health & Adoption", value: String((stats?.healthScoreCount ?? 0) + (stats?.adoptionTrackingCount ?? 0)), detail: `Avg health ${(stats?.avgHealthScore ?? 0).toFixed(0)} • ${(stats?.avgAdoptionPercent ?? 0).toFixed(0)}% adoption`, trend: "up" as const },
        { title: "Renewal & Expansion", value: String((stats?.renewalPlanCount ?? 0) + (stats?.expansionOpportunityCount ?? 0)), detail: `${stats?.qbrReportCount ?? 0} QBR reports • ${stats?.executiveSummaryCount ?? 0} exec summaries`, trend: "up" as const, tone: "accent" as const },
        { title: "Risk & Churn", value: String((stats?.riskAnalysisCount ?? 0) + (stats?.churnPredictionCount ?? 0)), detail: `${stats?.supportTrendAnalysisCount ?? 0} support trends • ${stats?.slaMonitoringCount ?? 0} SLA monitors`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-teal-600 dark:[&_p:last-child]:text-teal-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
