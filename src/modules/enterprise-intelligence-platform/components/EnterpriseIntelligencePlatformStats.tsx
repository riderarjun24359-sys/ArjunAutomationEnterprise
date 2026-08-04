import { StatCard } from "@/src/components/ui/StatCard";
import type { EipDashboardStats } from "@/src/modules/enterprise-intelligence-platform/types";

interface EnterpriseIntelligencePlatformStatsProps { stats: EipDashboardStats | null; }

export function EnterpriseIntelligencePlatformStats({ stats }: EnterpriseIntelligencePlatformStatsProps) {
    const cards = [
        { title: "Intelligence Hubs", value: String(stats?.totalIntelligenceHubs ?? 0), detail: `${stats?.activeIntelligenceHubs ?? 0} active • ${stats?.kpiRegistryCount ?? 0} dining areas`, trend: "up" as const },
        { title: "Executive Dashboards", value: String(stats?.executiveDashboardCount ?? 0), detail: `${stats?.revenueForecastCount ?? 0} revenue forecasts • ${stats?.crossModuleInsightCount ?? 0} cross-module insights`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallIntelligenceScore ?? 0).toFixed(1)}`, detail: `${stats?.openIntelligenceFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, crossModuleInsights, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-fuchsia-600 dark:[&_p:last-child]:text-fuchsia-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
