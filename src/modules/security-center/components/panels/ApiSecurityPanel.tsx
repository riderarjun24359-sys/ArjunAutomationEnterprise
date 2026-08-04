"use client";

import { useState } from "react";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";
import type { ApiKey } from "../../types";

export function ApiSecurityPanel() {
    const { service } = useSecurityCenter();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [created, setCreated] = useState<ApiKey | null>(null);

    const handleCreate = () => {
        const key = service.createApiKey(`Key ${Date.now()}`, "admin");
        setCreated(key);
        setKeys((prev) => [...prev, key]);
    };

    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">API Security</h3>
                    <Button size="sm" onClick={handleCreate}>Create API Key</Button>
                </div>
                {created && (
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                        Created key prefix: <code>{created.prefix}</code>
                    </p>
                )}
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
                {keys.map((key) => (
                    <Card key={key.id} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{key.name}</p>
                        <Badge variant="success" className="mt-2">{key.status}</Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
