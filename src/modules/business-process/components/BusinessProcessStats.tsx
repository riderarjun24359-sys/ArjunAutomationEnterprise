import { StatCard } from "@/src/components/ui/StatCard";
import type { BpfDashboardStats } from "@/src/modules/business-process/types";

interface BusinessProcessStatsProps { stats: BpfDashboardStats | null; }

export function BusinessProcessStats({ stats }: BusinessProcessStatsProps) {
    const cards = [
        { title: "Process Hubs", value: String(stats?.totalProcessHubs ?? 0), detail: `${stats?.activeProcessHubs ?? 0} active • ${stats?.taskTemplateCount ?? 0} task templates`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.approvalRuleCount ?? 0), detail: `${stats?.processExecutionCount ?? 0} process executions • ${stats?.openFailedRecordCount ?? 0} open failed process records`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallProcessScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, failedProcessRecords, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-sky-600 dark:[&_p:last-child]:text-sky-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
