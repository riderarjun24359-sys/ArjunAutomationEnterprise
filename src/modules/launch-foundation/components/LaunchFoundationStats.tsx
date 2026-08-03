import { StatCard } from "@/src/components/ui/StatCard";
import type { ElfDashboardStats } from "@/src/modules/launch-foundation/types";

interface LaunchFoundationStatsProps { stats: ElfDashboardStats | null; }

export function LaunchFoundationStats({ stats }: LaunchFoundationStatsProps) {
    const cards = [
        { title: "Launch Hubs", value: String(stats?.totalLaunchHubs ?? 0), detail: `${stats?.activeLaunchHubs ?? 0} active • ${stats?.organizationProvisionCount ?? 0} provisions`, trend: "up" as const },
        { title: "Platform Ops", value: String(stats?.customerRegistryCount ?? 0), detail: `${stats?.importJobCount ?? 0} import jobs • ${stats?.goLiveChecklistCount ?? 0} go-live checklists`, trend: "up" as const, tone: "accent" as const },
        { title: "Launch Score", value: `${(stats?.overallLaunchScore ?? 0).toFixed(1)}`, detail: `${stats?.openLaunchFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Provisioning, imports, go-live, and mission control audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-slate-600 dark:[&_p:last-child]:text-slate-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
