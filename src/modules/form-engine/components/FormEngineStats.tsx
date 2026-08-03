import { StatCard } from "@/src/components/ui/StatCard";
import type { DfeDashboardStats } from "@/src/modules/form-engine/types";

interface FormEngineStatsProps { stats: DfeDashboardStats | null; }

export function FormEngineStats({ stats }: FormEngineStatsProps) {
    const cards = [
        { title: "Form Hubs", value: String(stats?.totalFormHubs ?? 0), detail: `${stats?.activeFormHubs ?? 0} active • ${stats?.formSectionCount ?? 0} form sections`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.requiredRuleCount ?? 0), detail: `${stats?.formSubmissionCount ?? 0} form submissions • ${stats?.openPendingReviewCount ?? 0} open pending review items`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallFormScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, pendingReviewItems, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-amber-600 dark:[&_p:last-child]:text-amber-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
