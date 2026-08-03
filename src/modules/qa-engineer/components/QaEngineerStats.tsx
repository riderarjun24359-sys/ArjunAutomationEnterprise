import { StatCard } from "@/src/components/ui/StatCard";
import type { QaDashboardStats } from "@/src/modules/qa-engineer/types";

interface QaEngineerStatsProps { stats: QaDashboardStats | null; }

export function QaEngineerStats({ stats }: QaEngineerStatsProps) {
    const cards = [
        { title: "Engagements", value: String(stats?.totalEngagements ?? 0), detail: `${stats?.activeEngagements ?? 0} active`, trend: "up" as const },
        { title: "Test Plans", value: String((stats?.unitTestPlanCount ?? 0) + (stats?.integrationTestPlanCount ?? 0) + (stats?.e2eTestPlanCount ?? 0)), detail: `${stats?.testStrategyCount ?? 0} strategies`, trend: "up" as const },
        { title: "Validations", value: String((stats?.securityValidationCount ?? 0) + (stats?.performanceValidationCount ?? 0) + (stats?.accessibilityValidationCount ?? 0)), detail: `${stats?.apiValidationCount ?? 0} API • ${stats?.uiValidationCount ?? 0} UI`, trend: "up" as const, tone: "accent" as const },
        { title: "Release Readiness", value: String(stats?.pendingReleaseReadiness ?? 0), detail: `${stats?.openBugCount ?? 0} open bugs • ${stats?.qualityScoreCount ?? 0} scores`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-rose-600 dark:[&_p:last-child]:text-rose-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
