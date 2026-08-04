"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";

export function SecretsManagementPanel() {
    const { state } = useSecurityCenter();

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Secrets Management</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Environment-validated secrets — no hardcoded credentials.
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.secrets.map((secret) => (
                    <Card key={secret.key} hover>
                        <p className="font-mono text-sm text-[var(--dos-text-primary)]">{secret.key}</p>
                        <div className="mt-2 flex gap-2">
                            <Badge variant={secret.present ? "success" : "warning"}>
                                {secret.present ? "Present" : "Missing"}
                            </Badge>
                            <Badge variant="default">{secret.source}</Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
