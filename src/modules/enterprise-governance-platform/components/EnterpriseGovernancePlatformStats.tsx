import { StatCard } from "@/src/components/ui/StatCard";
import type { EgpDashboardStats } from "@/src/modules/enterprise-governance-platform/types";

interface EnterpriseGovernancePlatformStatsProps { stats: EgpDashboardStats | null; }

export function EnterpriseGovernancePlatformStats({ stats }: EnterpriseGovernancePlatformStatsProps) {
    const cards = [
        { title: "Governance Hubs", value: String(stats?.totalGovernanceHubs ?? 0), detail: `${stats?.activeGovernanceHubs ?? 0} active • ${stats?.organizationGovernanceCount ?? 0} dining areas`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.complianceControlCount ?? 0), detail: `${stats?.auditFindingCount ?? 0} auditFindings • ${stats?.riskRegisterCount ?? 0} open riskRegister`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallGovernanceScore ?? 0).toFixed(1)}`, detail: `${stats?.openGovernanceFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, riskRegister, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-rose-600 dark:[&_p:last-child]:text-rose-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
