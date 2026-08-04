"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function KnowledgeGraphPanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Knowledge Graph</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : `${state.knowledgeNodes.length} nodes · ${state.knowledgeEdges.length} edges`}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {state.knowledgeNodes.map((n) => (
                    <Card key={n.id} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{n.label}</p>
                        <Badge className="mt-2" variant="info">{n.type}</Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
