import { StatCard } from "@/src/components/ui/StatCard";
import type { DfDashboardStats } from "@/src/modules/development-factory/types";

interface DevelopmentFactoryStatsProps { stats: DfDashboardStats | null; }

export function DevelopmentFactoryStats({ stats }: DevelopmentFactoryStatsProps) {
    const cards = [
        { title: "Engagements", value: String(stats?.totalEngagements ?? 0), detail: `${stats?.activeEngagements ?? 0} active`, trend: "up" as const },
        { title: "Work Packages", value: String(stats?.workPackageCount ?? 0), detail: `${stats?.workflowCount ?? 0} workflows`, trend: "up" as const },
        { title: "Scaffolds & Components", value: String((stats?.apiScaffoldCount ?? 0) + (stats?.componentCount ?? 0)), detail: `${stats?.testScaffoldCount ?? 0} test scaffolds`, trend: "up" as const, tone: "accent" as const },
        { title: "Code Reviews", value: String(stats?.pendingCodeReviews ?? 0), detail: `${stats?.versionCount ?? 0} versions`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-orange-600 dark:[&_p:last-child]:text-orange-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
