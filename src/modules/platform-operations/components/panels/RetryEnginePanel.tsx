"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function RetryEnginePanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.retryPolicies.map((p) => (
                <Card key={p.id} hover>
                    <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>{p.name}</p>
                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                        Max {p.maxAttempts} attempts · {p.baseDelayMs}ms base delay
                    </p>
                    <div className="mt-2 flex gap-2">
                        <Badge variant={p.circuitOpen ? "error" : "success"}>
                            {loading ? "—" : p.circuitOpen ? "circuit open" : "circuit closed"}
                        </Badge>
                        <Badge variant="default">escalation L{p.escalationLevel}</Badge>
                    </div>
                </Card>
            ))}
        </div>
    );
}
