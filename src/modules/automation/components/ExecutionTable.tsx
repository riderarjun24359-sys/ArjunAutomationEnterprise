import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { WorkflowExecution } from "@/src/modules/automation/types";

interface ExecutionTableProps {
    executions: WorkflowExecution[];
}

export function ExecutionTable({ executions }: ExecutionTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Execution history" description="Workflow run outcomes and durations" />
            {executions.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No executions yet" description="Run a workflow to populate execution history." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {executions.map((execution) => (
                        <div key={execution.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{execution.workflowName}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {execution.triggerType} • {execution.startedAt}
                                    {execution.errorMessage ? ` • ${execution.errorMessage}` : ""}
                                </p>
                            </div>
                            <div className="text-right text-sm">
                                <p className="capitalize">{execution.status}</p>
                                <p>{execution.durationMs > 0 ? `${execution.durationMs}ms` : "In progress"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
