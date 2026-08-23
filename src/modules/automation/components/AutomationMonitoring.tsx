import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
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

    // Determine aggregate state for IntelligentContainer
    const hasFailures = failed.length > 0;
    const isProcessing = running.length > 0;
    const agentType = hasFailures ? "critical" : isProcessing ? "processing" : "success";

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <IntelligentContainer 
                agentType={agentType}
                material="base"
            >
                <SectionHeader title="Live monitoring" description="Current automation health signals" />
                <div className="mt-6 space-y-3">
                    <div className="flex justify-between rounded-2xl border border-[var(--dos-border)] px-4 py-3">
                        <span>Running executions</span>
                        <span className="font-medium">{stats?.runningExecutions ?? running.length}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-[var(--dos-border)] px-4 py-3">
                        <span>Failed executions</span>
                        <span className="font-medium text-[var(--dos-text-critical)]">{stats?.failedExecutions ?? failed.length}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-[var(--dos-border)] px-4 py-3">
                        <span>Paused workflows</span>
                        <span className="font-medium">{stats?.pausedWorkflows ?? paused.length}</span>
                    </div>
                    <div className="flex justify-between rounded-2xl border border-[var(--dos-border)] px-4 py-3">
                        <span>Success rate</span>
                        <span className="font-semibold text-[var(--dos-text-success)]">{stats?.successRate ?? "100%"}</span>
                    </div>
                </div>
            </IntelligentContainer>

            {/* Note: Keeping this as original Card for now until validated */}
            <div className="rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] p-6 bg-[var(--dos-surface-base)]">
                <SectionHeader title="Recent failures" description="Workflows requiring operator attention" />
                <div className="mt-6 space-y-3">
                    {failed.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-tertiary)]">No recent failures detected.</p>
                    ) : (
                        failed.slice(0, 5).map((execution) => (
                            <div key={execution.id} className="rounded-2xl border border-[var(--dos-border)] bg-[var(--dos-surface-active)] px-4 py-3">
                                <p className="font-medium">{execution.workflowName}</p>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{execution.errorMessage || "Unknown error"}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
