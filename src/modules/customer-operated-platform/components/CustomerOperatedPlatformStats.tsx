import { StatCard } from "@/src/components/ui/StatCard";
import type { CopDashboardStats } from "@/src/modules/customer-operated-platform/types";

interface CustomerOperatedPlatformStatsProps { stats: CopDashboardStats | null; }

export function CustomerOperatedPlatformStats({ stats }: CustomerOperatedPlatformStatsProps) {
    const cards = [
        { title: "Operated Hubs", value: String(stats?.totalOperatedHubs ?? 0), detail: `${stats?.activeOperatedHubs ?? 0} active • ${stats?.signupFlowCount ?? 0} signup flows`, trend: "up" as const },
        { title: "Production", value: String(stats?.deploymentJobCount ?? 0), detail: `${stats?.productionProfileCount ?? 0} profiles • ${stats?.centralLogCount ?? 0} central logs`, trend: "up" as const, tone: "accent" as const },
        { title: "Operated Score", value: `${(stats?.overallOperatedScore ?? 0).toFixed(1)}`, detail: `${stats?.openPlatformFailureCount ?? 0} open failures • ${stats?.activeIncidentCount ?? 0} incidents`, trend: "up" as const },
        { title: "Revenue & CSAT", value: `₹${(stats?.revenueToday ?? 0).toLocaleString()}`, detail: `${(stats?.platformAvailabilityScore ?? 0).toFixed(0)}% availability • ${(stats?.customerSatisfactionScore ?? 0).toFixed(0)}% CSAT`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-violet-600 dark:[&_p:last-child]:text-violet-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
