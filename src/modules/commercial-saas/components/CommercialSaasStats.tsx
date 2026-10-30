import { StatCard } from "@/src/components/ui/StatCard";
import type { SaasDashboardStats } from "@/src/modules/commercial-saas/types";

interface CommercialSaasStatsProps { stats: SaasDashboardStats | null; }

export function CommercialSaasStats({ stats }: CommercialSaasStatsProps) {
    const cards = [
        { title: "Tenants", value: String(stats?.totalTenants ?? 0), detail: `${stats?.activeTenants ?? 0} active • ${stats?.trialTenants ?? 0} trial`, trend: "up" as const },
        { title: "Subscriptions & Licenses", value: String((stats?.subscriptionCount ?? 0) + (stats?.licenseCount ?? 0)), detail: `${stats?.featureFlagCount ?? 0} flags • ${stats?.portalApiKeyCount ?? 0} API keys`, trend: "up" as const },
        { title: "Revenue", value: `₹${(stats?.mrrUsd ?? 0).toFixed(0)}`, detail: `MRR • ARR ₹${(stats?.arrUsd ?? 0).toFixed(0)}`, trend: "up" as const, tone: "accent" as const },
        { title: "Usage & Health", value: String((stats?.usageMeterCount ?? 0) + (stats?.registrationCount ?? 0)), detail: `${(stats?.avgHealthScore ?? 0).toFixed(0)}% avg health • ${stats?.auditCount ?? 0} audit entries`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-sky-600 dark:[&_p:last-child]:text-sky-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
