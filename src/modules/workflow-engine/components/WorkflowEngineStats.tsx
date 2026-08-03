import { StatCard } from "@/src/components/ui/StatCard";
import type { DweDashboardStats } from "@/src/modules/workflow-engine/types";

interface WorkflowEngineStatsProps { stats: DweDashboardStats | null; }

export function WorkflowEngineStats({ stats }: WorkflowEngineStatsProps) {
    const cards = [
        { title: "Workflow Hubs", value: String(stats?.totalWorkflowHubs ?? 0), detail: `${stats?.activeWorkflowHubs ?? 0} active • ${stats?.workflowNodeCount ?? 0} workflow nodes`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.escalationRuleCount ?? 0), detail: `${stats?.workflowExecutionCount ?? 0} workflow executions • ${stats?.openFailedExecutionCount ?? 0} open failed executions`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallWorkflowScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, failedExecutions, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-indigo-600 dark:[&_p:last-child]:text-indigo-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
