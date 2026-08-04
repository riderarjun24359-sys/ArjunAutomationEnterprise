"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";
import { SECURITY_PERMISSIONS } from "../../constants";

export function RbacPanel() {
    const { state } = useSecurityCenter();

    return (
        <div className="space-y-4">
            {state.roles.map((role) => (
                <Card key={role} hover>
                    <div className="flex items-center justify-between">
                        <p className="font-semibold capitalize text-[var(--dos-text-primary)]">{role}</p>
                        <Badge variant="info">{SECURITY_PERMISSIONS[role]?.length ?? 0} permissions</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                        {(SECURITY_PERMISSIONS[role] ?? []).slice(0, 6).map((perm) => (
                            <Badge key={perm} variant="default">{perm}</Badge>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
}
