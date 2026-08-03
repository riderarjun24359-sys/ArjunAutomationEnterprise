import { StatCard } from "@/src/components/ui/StatCard";
import type { TloDashboardStats } from "@/src/modules/tenant-lifecycle-ops/types";

interface TenantLifecycleOpsStatsProps { stats: TloDashboardStats | null; }

export function TenantLifecycleOpsStats({ stats }: TenantLifecycleOpsStatsProps) {
    const cards = [
        { title: "Tenant Contexts", value: String(stats?.totalTenantContexts ?? 0), detail: `${stats?.activeTenantContexts ?? 0} active • ${stats?.lifecycleRecordCount ?? 0} lifecycle records`, trend: "up" as const },
        { title: "Onboarding", value: String(stats?.onboardingInProgressCount ?? 0), detail: `${stats?.openReactivationCount ?? 0} pending reactivations • ${stats?.marketplaceModuleCount ?? 0} modules`, trend: "up" as const },
        { title: "Health Score", value: `${(stats?.avgHealthScore ?? 0).toFixed(0)}`, detail: `${stats?.industryPackCount ?? 0} industry packs • ${stats?.openExpansionCount ?? 0} expansion ops`, trend: "up" as const, tone: "accent" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Lifecycle, operations, onboarding, and marketplace audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-emerald-600 dark:[&_p:last-child]:text-emerald-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
