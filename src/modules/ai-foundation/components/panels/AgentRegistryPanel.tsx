"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function AgentRegistryPanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Registered Agents</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : state.agents.length}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
                {state.agents.map((a) => (
                    <Card key={a.id} hover>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[var(--dos-text-primary)]">{a.name}</p>
                            <Badge variant={a.health === "healthy" ? "success" : "warning"}>{a.health}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">v{a.version} · {a.owner}</p>
                        <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{a.capabilities.join(", ")}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
