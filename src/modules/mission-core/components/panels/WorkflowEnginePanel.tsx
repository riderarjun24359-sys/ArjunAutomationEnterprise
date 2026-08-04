"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { Input } from "@/src/design-os/components/Input";
import { DEFAULT_WORKFLOW_TEMPLATE } from "../../constants";
import { useMissionCore } from "../../hooks/useMissionCore";

export function WorkflowEnginePanel() {
    const { workflows, createAndRunWorkflow, actionLoading } = useMissionCore();
    const [workflowName, setWorkflowName] = useState("Customer Lifecycle");

    const handleRun = () => {
        void createAndRunWorkflow(workflowName);
    };

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Create & Run Workflow</h3>
                <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[240px] flex-1">
                        <label htmlFor="workflow-name" className="mb-1 block text-sm text-[var(--dos-text-secondary)]">
                            Workflow name
                        </label>
                        <Input
                            id="workflow-name"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            placeholder="Customer Lifecycle"
                        />
                    </div>
                    <Button onClick={handleRun} disabled={actionLoading || !workflowName.trim()}>
                        {actionLoading ? "Running…" : "Run Workflow"}
                    </Button>
                </div>
                <p className="mt-3 text-xs text-[var(--dos-text-tertiary)]">
                    Default template: {DEFAULT_WORKFLOW_TEMPLATE.map((s) => s.name).join(" → ")}
                </p>
            </Card>

            <div className="space-y-3">
                <h3 className="font-semibold text-[var(--dos-text-primary)]">Workflow Instances</h3>
                {workflows.length === 0 ? (
                    <p className="text-sm text-[var(--dos-text-secondary)]">No workflow instances yet.</p>
                ) : (
                    workflows.map((wf) => (
                        <Card key={wf.id}>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-[var(--dos-text-primary)]">{wf.name}</span>
                                <Badge variant={wf.status === "completed" ? "success" : wf.status === "failed" ? "error" : "info"}>
                                    {wf.status}
                                </Badge>
                            </div>
                            <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">
                                Step {wf.currentStepIndex}/{wf.steps.length} · {wf.id}
                            </p>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
