import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { AutomationDashboardStats, Workflow, WorkflowExecution } from "@/src/modules/automation/types";

interface AutomationMonitoringProps {
    stats: AutomationDashboardStats | null;
    workflows: Workflow[];
    executions: WorkflowExecution[];
}

export function AutomationMonitoring({ stats, workflows, executions }: AutomationMonitoringProps) {
    const running = executions.filter((execution) => execution.status === "running");
    const failed = executions.filter((execution) => execution.status === "failed");
    const paused = workflows.filter((workflow) => workflow.status === "paused");

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Live monitoring" description="Current automation health signals" />
                <div className="mt-6 space-y-3">
                    <div className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <span>Running executions</span>
                        <span className="font-medium">{stats?.runningExecutions ?? running.length}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <span>Failed executions</span>
                        <span className="font-medium text-rose-600">{stats?.failedExecutions ?? failed.length}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <span>Paused workflows</span>
                        <span className="font-medium">{stats?.pausedWorkflows ?? paused.length}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                        <span>Success rate</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-300">{stats?.successRate ?? "100%"}</span>
                    </div>
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Recent failures" description="Workflows requiring operator attention" />
                <div className="mt-6 space-y-3">
                    {failed.length === 0 ? (
                        <p className="text-sm text-slate-500">No recent failures detected.</p>
                    ) : (
                        failed.slice(0, 5).map((execution) => (
                            <div key={execution.id} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-900 dark:bg-rose-950/30">
                                <p className="font-medium">{execution.workflowName}</p>
                                <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">{execution.errorMessage || "Unknown error"}</p>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
