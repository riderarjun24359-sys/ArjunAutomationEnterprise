import { StatCard } from "@/src/components/ui/StatCard";
import type { CsdDashboardStats } from "@/src/modules/customer-success-delivery/types";

interface CustomerSuccessDeliveryStatsProps { stats: CsdDashboardStats | null; }

export function CustomerSuccessDeliveryStats({ stats }: CustomerSuccessDeliveryStatsProps) {
    const cards = [
        { title: "Delivery Hubs", value: String(stats?.totalDeliveryHubs ?? 0), detail: `${stats?.activeDeliveryHubs ?? 0} active • ${stats?.customerHealthScoreCount ?? 0} health scores`, trend: "up" as const },
        { title: "Support & Deployment", value: String(stats?.supportTicketCount ?? 0), detail: `${stats?.deploymentTrackingCount ?? 0} deployments • ${stats?.trainingPortalCount ?? 0} training portals`, trend: "up" as const, tone: "accent" as const },
        { title: "Delivery Score", value: `${(stats?.overallDeliveryScore ?? 0).toFixed(1)}`, detail: `${stats?.openDeliveryFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Customer success, support, deployment, and delivery audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-sky-600 dark:[&_p:last-child]:text-sky-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
