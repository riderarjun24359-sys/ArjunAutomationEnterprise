"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function PerformanceCenterPanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {state.performance.map((m) => (
                <Card key={m.id} hover>
                    <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>{m.name}</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                        {loading ? "—" : `${m.value}${m.unit === "%" ? "%" : m.unit}`}
                    </p>
                    <Badge className="mt-2" variant={m.status === "ok" ? "success" : m.status === "warning" ? "warning" : "error"}>
                        threshold {m.threshold}{m.unit}
                    </Badge>
                </Card>
            ))}
        </div>
    );
}
