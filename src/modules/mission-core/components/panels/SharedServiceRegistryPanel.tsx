"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { Select } from "@/src/design-os/components/Select";
import { useMissionCore } from "../../hooks/useMissionCore";

const SERVICE_METHODS: Record<string, string[]> = {
    auth: ["validateSession", "getPermissions"],
    notifications: ["send", "listPending"],
    documentEngine: ["generate", "listTemplates"],
    gci: ["translate", "resolveLocale"],
    search: ["query"],
    audit: ["log", "listRecent"],
    ai: ["prompt", "routeAgent"],
    analytics: ["track", "getMetrics"],
    integrations: ["invoke", "listConnectors"],
};

export function SharedServiceRegistryPanel() {
    const { services, invokeSharedService, actionLoading } = useMissionCore();
    const [selectedService, setSelectedService] = useState("auth");
    const [selectedMethod, setSelectedMethod] = useState("validateSession");
    const [lastResult, setLastResult] = useState<unknown>(null);

    const methods = SERVICE_METHODS[selectedService] ?? [];

    const handleInvoke = async () => {
        const result = await invokeSharedService(selectedService, selectedMethod, []);
        setLastResult(result);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((svc) => (
                    <Card key={svc.id} hover>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-[var(--dos-text-primary)]">{svc.name}</h3>
                            <Badge variant={svc.status === "available" ? "success" : "warning"}>{svc.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{svc.module}</p>
                    </Card>
                ))}
            </div>

            <Card>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Invoke Service</h3>
                <div className="flex flex-wrap items-end gap-3">
                    <Select
                        value={selectedService}
                        onChange={(e) => {
                            setSelectedService(e.target.value);
                            setSelectedMethod(SERVICE_METHODS[e.target.value]?.[0] ?? "");
                        }}
                        aria-label="Service"
                    >
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </Select>
                    <Select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} aria-label="Method">
                        {methods.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </Select>
                    <Button onClick={() => void handleInvoke()} disabled={actionLoading}>Invoke</Button>
                </div>
                {lastResult != null && (
                    <pre className="mt-4 overflow-x-auto rounded-lg bg-[var(--dos-surface-secondary)] p-3 text-xs">
                        {JSON.stringify(lastResult, null, 2)}
                    </pre>
                )}
            </Card>
        </div>
    );
}
