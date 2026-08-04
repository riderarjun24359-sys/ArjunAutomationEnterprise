"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";
import { MFA_METHODS } from "../../constants";

export function MfaPanel() {
    const { state, loading } = useSecurityCenter();

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Multi-Factor Authentication</h3>
                <div className="mt-2 flex gap-2">
                    <Badge variant={state.mfaStatus.enrolled ? "success" : "warning"}>
                        {loading ? "Loading…" : state.mfaStatus.enrolled ? "Enrolled" : "Not enrolled"}
                    </Badge>
                    {state.mfaStatus.policyEnforced && <Badge variant="info">Policy enforced</Badge>}
                </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
                {MFA_METHODS.map((method) => (
                    <Card key={method} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{method.replace(/_/g, " ")}</p>
                        <Badge
                            variant={state.mfaStatus.methods.includes(method) ? "success" : "default"}
                            className="mt-2"
                        >
                            {state.mfaStatus.methods.includes(method) ? "Active" : "Available"}
                        </Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
