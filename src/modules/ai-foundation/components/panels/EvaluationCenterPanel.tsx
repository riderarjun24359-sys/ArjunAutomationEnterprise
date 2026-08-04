"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function EvaluationCenterPanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Quality Score</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : `${state.dashboard.qualityScore}%`}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.evaluations.map((e) => (
                    <Card key={e.id} hover>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[var(--dos-text-primary)]">{e.name}</p>
                            <Badge variant={e.status === "pass" ? "success" : e.status === "warning" ? "warning" : "error"}>{e.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{e.value} {e.unit}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
