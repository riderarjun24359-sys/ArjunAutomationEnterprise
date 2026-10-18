import { StatCard } from "@/src/components/ui/StatCard";
import type { DdDashboardStats } from "@/src/modules/devops-deployment/types";

interface DevopsDeploymentStatsProps { stats: DdDashboardStats | null; }

export function DevopsDeploymentStats({ stats }: DevopsDeploymentStatsProps) {
    const cards = [
        { title: "Engagements", value: String(stats?.totalEngagements ?? 0), detail: `${stats?.activeEngagements ?? 0} active`, trend: "up" as const },
        { title: "CI/CD & Infra", value: String((stats?.cicdPipelineCount ?? 0) + (stats?.infrastructureTemplateCount ?? 0) + (stats?.environmentCount ?? 0)), detail: `${stats?.dockerConfigCount ?? 0} Docker • ${stats?.kubernetesPlanCount ?? 0} K8s`, trend: "up" as const },
        { title: "Release Strategy", value: String((stats?.releaseOrchestrationCount ?? 0) + (stats?.blueGreenPlanCount ?? 0) + (stats?.canaryPlanCount ?? 0)), detail: `${stats?.rollbackPlanCount ?? 0} rollback plans`, trend: "up" as const, tone: "accent" as const },
        { title: "Deployment Approvals", value: String(stats?.pendingDeploymentApprovals ?? 0), detail: `${stats?.releaseVersionCount ?? 0} versions • ${stats?.healthCheckCount ?? 0} health checks`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-orange-600 dark:[&_p:last-child]:text-orange-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
