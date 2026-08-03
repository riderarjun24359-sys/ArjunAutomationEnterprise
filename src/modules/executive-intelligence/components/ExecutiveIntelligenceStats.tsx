import { StatCard } from "@/src/components/ui/StatCard";
import type { AixDashboardStats } from "@/src/modules/executive-intelligence/types";

interface ExecutiveIntelligenceStatsProps { stats: AixDashboardStats | null; }

export function ExecutiveIntelligenceStats({ stats }: ExecutiveIntelligenceStatsProps) {
    const cards = [
        { title: "Intelligence Hubs", value: String(stats?.totalIntelligenceHubs ?? 0), detail: `${stats?.activeIntelligenceHubs ?? 0} active • ${stats?.recommendationCount ?? 0} recommendations`, trend: "up" as const },
        { title: "Evidence Traces", value: String(stats?.evidenceTraceCount ?? 0), detail: `${stats?.reasoningSessionCount ?? 0} reasoning sessions • ${stats?.openRiskCount ?? 0} open risks`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.avgAiConfidenceScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, businessRisks, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-violet-600 dark:[&_p:last-child]:text-violet-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
