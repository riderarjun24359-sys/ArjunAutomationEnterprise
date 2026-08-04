"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function LearningPipelinePanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Human Review Queue</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : state.feedback.filter((f) => f.status === "pending").length}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
                {state.feedback.map((f) => (
                    <Card key={f.id} hover>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[var(--dos-text-primary)]">{f.source}</p>
                            <Badge variant={f.status === "applied" ? "success" : f.status === "reviewed" ? "info" : "warning"}>{f.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{f.feedback}</p>
                        <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">Rating: {f.rating}/5</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
