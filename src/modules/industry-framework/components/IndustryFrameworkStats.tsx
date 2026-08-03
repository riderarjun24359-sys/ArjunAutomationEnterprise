import { StatCard } from "@/src/components/ui/StatCard";
import type { IfrDashboardStats } from "@/src/modules/industry-framework/types";

interface IndustryFrameworkStatsProps { stats: IfrDashboardStats | null; }

export function IndustryFrameworkStats({ stats }: IndustryFrameworkStatsProps) {
    const cards = [
        { title: "Framework Hubs", value: String(stats?.totalFrameworkHubs ?? 0), detail: `${stats?.activeFrameworkHubs ?? 0} active • ${stats?.dashboardTemplateCount ?? 0} dashboard templates`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.workflowTemplateCount ?? 0), detail: `${stats?.industryProfileCount ?? 0} industry profiles • ${stats?.openCompatibilityCount ?? 0} open compatibility issues`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallFrameworkScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, compatibilityChecks, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-teal-600 dark:[&_p:last-child]:text-teal-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
