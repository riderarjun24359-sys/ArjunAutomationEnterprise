"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";

export function OrgIsolationPanel() {
    const { state, loading } = useSecurityCenter();

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Organization Isolation</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Score: {loading ? "—" : `${state.dashboard.orgIsolationScore}%`}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.orgChecks.map((check) => (
                    <Card key={check.resource} hover>
                        <p className="font-medium capitalize text-[var(--dos-text-primary)]">
                            {check.resource.replace(/_/g, " ")}
                        </p>
                        <Badge variant={check.isolated ? "success" : "warning"} className="mt-2">
                            {check.isolated ? "Isolated" : "Review"}
                        </Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
