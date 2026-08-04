"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { useMissionCore } from "../../hooks/useMissionCore";

export function WorkflowMonitorPanel() {
    const { workflows, loading } = useMissionCore();

    if (loading) return <p className="text-sm text-[var(--dos-text-secondary)]">Loading workflows…</p>;

    const active = workflows.filter((w) => w.status === "running" || w.status === "pending");
    const completed = workflows.filter((w) => w.status === "completed");
    const failed = workflows.filter((w) => w.status === "failed");

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Active</p><p className="text-2xl font-bold text-[var(--dos-text-primary)]">{active.length}</p></Card>
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Completed</p><p className="text-2xl font-bold text-[var(--dos-text-primary)]">{completed.length}</p></Card>
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Failed</p><p className="text-2xl font-bold text-[var(--dos-text-primary)]">{failed.length}</p></Card>
            </div>

            <div className="space-y-3">
                {workflows.length === 0 ? (
                    <p className="text-sm text-[var(--dos-text-secondary)]">No workflows to monitor.</p>
                ) : (
                    workflows.slice().reverse().map((wf) => (
                        <Card key={wf.id}>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-[var(--dos-text-primary)]">{wf.name}</span>
                                <Badge variant={wf.status === "completed" ? "success" : wf.status === "failed" ? "error" : "info"}>
                                    {wf.status}
                                </Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {wf.steps.map((step, i) => (
                                    <span
                                        key={step.id}
                                        className={`rounded px-2 py-0.5 text-xs ${i < wf.currentStepIndex ? "bg-emerald-100 text-emerald-800" : i === wf.currentStepIndex && wf.status === "running" ? "bg-blue-100 text-blue-800" : "bg-[var(--dos-surface-secondary)] text-[var(--dos-text-secondary)]"}`}
                                    >
                                        {step.name}
                                    </span>
                                ))}
                            </div>
                            {wf.error && <p className="mt-2 text-xs text-red-600">{wf.error}</p>}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
