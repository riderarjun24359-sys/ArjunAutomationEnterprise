import { StatCard } from "@/src/components/ui/StatCard";
import type { CmpDashboardStats } from "@/src/modules/company-foundation/types";

interface CompanyFoundationStatsProps { stats: CmpDashboardStats | null; }

export function CompanyFoundationStats({ stats }: CompanyFoundationStatsProps) {
    const cards = [
        { title: "Company Hubs", value: String(stats?.totalCompanyHubs ?? 0), detail: `${stats?.activeCompanyHubs ?? 0} active • ${stats?.brandProfileCount ?? 0} brand profiles`, trend: "up" as const },
        { title: "Platform Ops", value: String(stats?.portalDashboardCount ?? 0), detail: `${stats?.websitePageCount ?? 0} website pages • ${stats?.pricingPlanCount ?? 0} pricing plans`, trend: "up" as const, tone: "accent" as const },
        { title: "Company Score", value: `${(stats?.overallCompanyScore ?? 0).toFixed(1)}`, detail: `${stats?.openCompanyFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Brand, website, pricing, proposal, and portal audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-emerald-600 dark:[&_p:last-child]:text-emerald-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
