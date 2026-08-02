import { StatCard } from "@/src/components/ui/StatCard";
import type { TaskStatistics } from "@/src/modules/tasks/types";

interface TaskStatsProps {
    statistics: TaskStatistics | null;
}

export function TaskStats({ statistics }: TaskStatsProps) {
    const statCards = [
        {
            title: "Total Tasks",
            value: statistics?.total.toString() ?? "0",
            detail: `${statistics?.todo ?? 0} to do`,
            trend: "up" as const,
            tone: "accent" as const,
        },
        {
            title: "In Progress",
            value: statistics?.inProgress.toString() ?? "0",
            detail: `${statistics?.review ?? 0} in review`,
            trend: "up" as const,
        },
        {
            title: "Completed",
            value: statistics?.done.toString() ?? "0",
            detail: `${statistics?.completionRate ?? "0%"} completion rate`,
            trend: "up" as const,
        },
        {
            title: "Overdue",
            value: statistics?.overdue.toString() ?? "0",
            detail: `${statistics?.dueThisWeek ?? 0} due this week`,
            trend: statistics?.overdue ? ("down" as const) : ("up" as const),
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
