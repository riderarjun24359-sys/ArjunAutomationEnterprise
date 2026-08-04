"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function AiMemoryEnginePanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Memory Records</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : state.memories.length}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.memories.map((m) => (
                    <Card key={m.id} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{m.key}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{m.content.slice(0, 80)}</p>
                        <Badge className="mt-2" variant="info">{m.type}</Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
