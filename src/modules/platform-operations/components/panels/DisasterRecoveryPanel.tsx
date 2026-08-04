"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";

export function DisasterRecoveryPanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="grid gap-4">
            {state.drPlans.map((plan) => (
                <Card key={plan.id} hover>
                    <div className="flex items-center justify-between">
                        <p className="font-medium text-[var(--dos-text-primary)]">{plan.name}</p>
                        <Badge variant={plan.failoverReady ? "success" : "warning"}>{plan.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                        RPO: {plan.rpoMinutes}min · RTO: {plan.rtoMinutes}min
                        {plan.lastValidatedAt && ` · Validated ${plan.lastValidatedAt.slice(0, 10)}`}
                    </p>
                    <p className="mt-1 text-sm text-[var(--dos-text-tertiary)]">
                        Failover ready: {loading ? "—" : plan.failoverReady ? "Yes" : "No"}
                    </p>
                </Card>
            ))}
        </div>
    );
}
