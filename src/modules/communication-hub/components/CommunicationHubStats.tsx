import { StatCard } from "@/src/components/ui/StatCard";
import type { CnhDashboardStats } from "@/src/modules/communication-hub/types";

interface CommunicationHubStatsProps { stats: CnhDashboardStats | null; }

export function CommunicationHubStats({ stats }: CommunicationHubStatsProps) {
    const cards = [
        { title: "Communication Hubs", value: String(stats?.totalCommunicationHubs ?? 0), detail: `${stats?.activeCommunicationHubs ?? 0} active • ${stats?.pendingNotificationCount ?? 0} queued`, trend: "up" as const },
        { title: "Delivered", value: String(stats?.deliveredNotificationCount ?? 0), detail: `${stats?.failedNotificationCount ?? 0} failed • ${(stats?.avgDeliveryRate ?? 0).toFixed(1)}% delivery rate`, trend: "up" as const, tone: "accent" as const },
        { title: "Campaigns", value: String(stats?.activeCampaignCount ?? 0), detail: `${stats?.openFailureCount ?? 0} open delivery failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Notification, template, campaign, and delivery audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-rose-600 dark:[&_p:last-child]:text-rose-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
