"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function AiWorkflowEnginePanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>AI Workflows</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : state.workflows.length}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
                {state.workflows.map((w) => (
                    <Card key={w.id} hover>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[var(--dos-text-primary)]">{w.name}</p>
                            <Badge variant={w.status === "completed" ? "success" : w.status === "running" ? "info" : "default"}>{w.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{w.mode} · {w.steps.length} steps · {w.orchestratedBy}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
