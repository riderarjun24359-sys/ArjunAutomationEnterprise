"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function AiGovernancePanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Risk Score</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : state.dashboard.riskScore}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.policies.map((p) => (
                    <Card key={p.id} hover>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[var(--dos-text-primary)]">{p.name}</p>
                            <Badge variant={p.enforced ? "success" : "warning"}>{p.enforced ? "enforced" : "optional"}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Risk: {p.riskScore} · {p.approvedModels.length} models</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
