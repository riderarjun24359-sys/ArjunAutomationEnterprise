"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";

export function AuthenticationPanel() {
    const { state, loading } = useSecurityCenter();

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Authentication Methods</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Delegates to Enterprise Identity — no duplicated auth logic.
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(loading ? [] : state.authMethods).map((method) => (
                    <Card key={method.method} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{method.method.replace(/_/g, " ")}</p>
                        <Badge variant={method.enabled ? "success" : "default"} className="mt-2">
                            {method.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
