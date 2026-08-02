import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { Workflow } from "@/src/modules/automation/types";

interface WorkflowDetailPanelProps {
    workflow: Workflow | null;
    onStatusChange?: (status: Workflow["status"]) => void | Promise<void>;
}

export function WorkflowDetailPanel({ workflow, onStatusChange }: WorkflowDetailPanelProps) {
    if (!workflow) {
        return (
            <Card hover>
                <SectionHeader title="Workflow builder" description="Select a workflow to inspect triggers, actions, and conditions" />
                <div className="mt-6">
                    <EmptyState title="No workflow selected" description="Choose a workflow from the list to view the builder canvas." />
                </div>
            </Card>
        );
    }

    return (
        <Card hover>
            <SectionHeader title={workflow.name} description={workflow.description || "Enterprise automation workflow"} />
            <div className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                        <p className="mt-1 font-medium capitalize">{workflow.status}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Agent</p>
                        <p className="mt-1 font-medium">{workflow.agentName ?? "Unassigned"}</p>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium">Triggers</p>
                    <div className="space-y-2">
                        {workflow.triggers.length === 0 ? (
                            <p className="text-sm text-slate-500">No triggers configured</p>
                        ) : (
                            workflow.triggers.map((trigger) => (
                                <div key={trigger.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                    <p className="font-medium capitalize">{trigger.triggerType}</p>
                                    <p className="text-sm text-slate-500">{trigger.eventName || "No event"} • {trigger.isActive ? "Active" : "Inactive"}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium">Actions</p>
                    <div className="space-y-2">
                        {workflow.actions.map((action) => (
                            <div key={action.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <div>
                                    <p className="font-medium capitalize">{action.actionType.replace("_", " ")}</p>
                                    <p className="text-sm text-slate-500">Step {action.stepOrder}{action.agentName ? ` • ${action.agentName}` : ""}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium">Conditions</p>
                    <div className="space-y-2">
                        {workflow.conditions.length === 0 ? (
                            <p className="text-sm text-slate-500">No conditions configured</p>
                        ) : (
                            workflow.conditions.map((condition) => (
                                <div key={condition.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                    <p className="font-medium">{condition.field}</p>
                                    <p className="text-sm text-slate-500">{condition.operator.replace("_", " ")} {condition.value}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium">Schedules</p>
                    <div className="space-y-2">
                        {workflow.schedules.length === 0 ? (
                            <p className="text-sm text-slate-500">No schedules configured</p>
                        ) : (
                            workflow.schedules.map((schedule) => (
                                <div key={schedule.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                    <p className="font-medium">{schedule.cronExpression}</p>
                                    <p className="text-sm text-slate-500">{schedule.timezone} • {schedule.isActive ? "Active" : "Paused"}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {onStatusChange ? (
                    <div className="flex flex-wrap gap-2">
                        {(["active", "paused", "archived"] as const).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => void onStatusChange(status)}
                                disabled={workflow.status === status}
                                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium capitalize disabled:opacity-50 dark:border-slate-700"
                            >
                                Set {status}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
        </Card>
    );
}
