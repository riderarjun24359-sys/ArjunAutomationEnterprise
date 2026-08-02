import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { Workflow } from "@/src/modules/automation/types";

interface WorkflowTableProps {
    workflows: Workflow[];
    selectedWorkflowId?: string | null;
    onSelectWorkflow: (id: string) => void;
    onRunWorkflow?: (id: string) => void | Promise<void>;
}

export function WorkflowTable({ workflows, selectedWorkflowId, onSelectWorkflow, onRunWorkflow }: WorkflowTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Workflows" description="Automation pipelines with triggers, actions, and conditions" />
            {workflows.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No workflows found" description="Create a workflow or adjust your filters." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {workflows.map((workflow) => (
                        <div key={workflow.id} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${selectedWorkflowId === workflow.id ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30" : "border-slate-200 dark:border-slate-800"}`}>
                            <button type="button" onClick={() => onSelectWorkflow(workflow.id)} className="flex-1 text-left">
                                <p className="font-medium">{workflow.name}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {workflow.agentName ?? "No agent"} • {workflow.triggers.length} triggers • {workflow.actions.length} actions
                                </p>
                            </button>
                            <div className="flex items-center gap-3 text-right text-sm">
                                <div>
                                    <p className="capitalize">{workflow.status}</p>
                                    <p className="text-xs text-slate-500">v{workflow.version}</p>
                                </div>
                                {onRunWorkflow && workflow.status === "active" ? (
                                    <button type="button" onClick={() => void onRunWorkflow(workflow.id)} className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300">
                                        Run
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
