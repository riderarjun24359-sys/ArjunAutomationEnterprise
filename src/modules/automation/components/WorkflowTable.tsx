import { cn } from "@/src/lib/cn";
import type { Workflow } from "@/src/modules/automation/types";

interface WorkflowTableProps {
    workflows: Workflow[];
    selectedWorkflowId?: string | null;
    onSelectWorkflow: (id: string) => void;
    onRunWorkflow?: (id: string) => void | Promise<void>;
}

export function WorkflowTable({ workflows, selectedWorkflowId, onSelectWorkflow, onRunWorkflow }: WorkflowTableProps) {
    return (
        <section className="os-panel p-6">
            <header className="mb-6">
                <h2 className="dos-text-h2">Workflows</h2>
                <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Automation pipelines with triggers, actions, and conditions</p>
            </header>
            
            {workflows.length === 0 ? (
                <div className="rounded-[var(--dos-radius-lg)] border border-dashed border-[var(--dos-border)] p-8 text-center">
                    <p className="dos-text-secondary">No workflows found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {workflows.map((workflow) => (
                        <div 
                            key={workflow.id} 
                            className={cn(
                                "flex w-full items-center justify-between rounded-[var(--dos-radius-lg)] border p-4 transition",
                                selectedWorkflowId === workflow.id 
                                    ? "border-[var(--dos-border-focus)] bg-[var(--dos-surface-secondary)]" 
                                    : "border-[var(--dos-border)] bg-[var(--dos-surface-elevated)]"
                            )}
                        >
                            <button type="button" onClick={() => onSelectWorkflow(workflow.id)} className="flex-1 text-left">
                                <p className="font-semibold text-[var(--dos-text-primary)]">{workflow.name}</p>
                                <p className="mt-1 dos-text-body-sm text-[var(--dos-text-secondary)]">
                                    {workflow.agentName ?? "No agent"} • {workflow.triggers.length} triggers • {workflow.actions.length} actions
                                </p>
                            </button>
                            <div className="flex items-center gap-4 text-right">
                                <div className="text-right">
                                    <p className="dos-text-caption">{workflow.status}</p>
                                    <p className="dos-text-body-sm text-[var(--dos-text-tertiary)]">v{workflow.version}</p>
                                </div>
                                {onRunWorkflow && workflow.status === "active" ? (
                                    <button 
                                        type="button" 
                                        onClick={() => void onRunWorkflow(workflow.id)} 
                                        className="rounded-full border border-[var(--dos-border)] px-4 py-1.5 text-xs font-semibold hover:border-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary)] transition"
                                    >
                                        Run
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
