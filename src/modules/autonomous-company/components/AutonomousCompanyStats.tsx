import { StatCard } from "@/src/components/ui/StatCard";
import type { AcDashboardStats } from "@/src/modules/autonomous-company/types";

interface AutonomousCompanyStatsProps { stats: AcDashboardStats | null; }

export function AutonomousCompanyStats({ stats }: AutonomousCompanyStatsProps) {
    const cards = [
        { title: "Company Contexts", value: String(stats?.totalContexts ?? 0), detail: `${stats?.activeContexts ?? 0} active`, trend: "up" as const },
        { title: "Orchestration & Events", value: String((stats?.workflowOrchestrationCount ?? 0) + (stats?.eventBusCount ?? 0)), detail: `${stats?.workerCollaborationCount ?? 0} collaborations • ${stats?.automationCount ?? 0} automations`, trend: "up" as const },
        { title: "Governance & KPIs", value: String((stats?.kpiCount ?? 0) + (stats?.securityGovernanceCount ?? 0)), detail: `${stats?.complianceDashboardCount ?? 0} compliance dashboards • ${(stats?.avgCompliancePercent ?? 0).toFixed(0)}% avg compliance`, trend: "up" as const, tone: "accent" as const },
        { title: "Operations & Health", value: String((stats?.operationalHealthCount ?? 0) + (stats?.emergencyWorkflowCount ?? 0)), detail: `${(stats?.avgOperationalScore ?? 0).toFixed(0)}% avg health • ${stats?.predictionCount ?? 0} predictions`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-violet-600 dark:[&_p:last-child]:text-violet-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
