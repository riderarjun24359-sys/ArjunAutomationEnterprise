import { StatCard } from "@/src/components/ui/StatCard";
import type { HrDashboardStats } from "@/src/modules/hr/types";

interface HrStatsProps {
    stats: HrDashboardStats | null;
}

export function HrStats({ stats }: HrStatsProps) {
    const cards = [
        { title: "Total Employees", value: String(stats?.totalEmployees ?? 0), detail: `${stats?.activeEmployees ?? 0} active`, trend: "up" as const },
        { title: "Departments", value: String(stats?.departments ?? 0), detail: "Organizational units", trend: "up" as const },
        { title: "Open Positions", value: String(stats?.openPositions ?? 0), detail: `${stats?.pendingLeaveRequests ?? 0} pending leave`, trend: "up" as const, tone: "accent" as const },
        { title: "Avg Performance", value: stats?.avgPerformanceRating ? String(stats.avgPerformanceRating) : "0", detail: `${stats?.activeOnboarding ?? 0} onboarding active`, trend: "up" as const },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
