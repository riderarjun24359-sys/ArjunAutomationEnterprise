"use client";

import { Card } from "@/src/design-os/components/Card";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function QueueJobEnginePanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.queues.map((q) => (
                <Card key={q.id} hover>
                    <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>{q.name}</p>
                    <p className="mt-1 text-xl font-bold text-[var(--dos-text-primary)]">{loading ? "—" : q.pending} pending</p>
                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                        {q.processing} processing · {q.failed} failed · {q.avgLatencyMs}ms avg
                    </p>
                </Card>
            ))}
        </div>
    );
}
