import { StatCard } from "@/src/components/ui/StatCard";
import type { IdpDashboardStats } from "@/src/modules/enterprise-identity/types";

interface EnterpriseIdentityStatsProps { stats: IdpDashboardStats | null; }

export function EnterpriseIdentityStats({ stats }: EnterpriseIdentityStatsProps) {
    const cards = [
        { title: "Realms", value: String(stats?.totalRealms ?? 0), detail: `${stats?.activeRealms ?? 0} active • ${stats?.providerCount ?? 0} providers`, trend: "up" as const },
        { title: "Users & Sessions", value: String(stats?.activeSessionCount ?? 0), detail: `${stats?.mfaEnrollmentCount ?? 0} MFA enrollments • ${stats?.pendingInvitationCount ?? 0} pending invites`, trend: "up" as const },
        { title: "MFA Adoption", value: `${(stats?.mfaAdoptionPercent ?? 0).toFixed(0)}%`, detail: `${stats?.compromisedAccountCount ?? 0} compromised • ${stats?.openSecurityAlertCount ?? 0} open alerts`, trend: "up" as const, tone: "accent" as const },
        { title: "Security & Audit", value: String(stats?.failedLogins24h ?? 0), detail: `Failed logins/24h • ${stats?.auditCount ?? 0} audit entries`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-violet-600 dark:[&_p:last-child]:text-violet-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
