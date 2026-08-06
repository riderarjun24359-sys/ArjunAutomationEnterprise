"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { LoadingState } from "@/src/design-os/components/LoadingState";
import { ProgressIndicator } from "@/src/design-os/motion/components/ProgressIndicator";

type ProductionStatus = {
    version: string;
    uptimeSeconds: number;
    environment: {
        ready: boolean;
        score: number;
        name: string;
        blockers: string[];
        warnings: string[];
        checks: Array<{ id: string; category: string; status: string; detail: string }>;
    };
    services: {
        supabase: { configured: boolean; detail: string };
        storage: { bucket: string; detail: string };
        authentication: { validateSessionAvailable: boolean; detail: string };
        email: { templatesPresent: boolean; providerConfigured: boolean; detail: string };
        payment: { gatewayConfigured: boolean; detail: string };
        monitoring: { healthScore: number; openAlerts: number; performanceSamples: number };
    };
};

export function ProductionHealthDashboard() {
    const [data, setData] = useState<ProductionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch("/api/ops/production", { cache: "no-store" });
                const json = (await res.json()) as ProductionStatus;
                if (!cancelled) {
                    setData(json);
                    setError(res.ok ? null : "Production status degraded");
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load production status");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        const timer = window.setTimeout(() => {
            void load();
        }, 0);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, []);

    if (loading) return <LoadingState label="Loading production health…" />;
    if (!data) return <EmptyState title="Production status unavailable" description={error ?? "No status returned"} />;

    const services = [
        { label: "Supabase", ok: data.services.supabase.configured, detail: data.services.supabase.detail },
        { label: "Storage", ok: true, detail: data.services.storage.detail },
        { label: "Authentication", ok: data.services.authentication.validateSessionAvailable, detail: data.services.authentication.detail },
        { label: "Email", ok: data.services.email.templatesPresent, detail: data.services.email.detail },
        { label: "Payment", ok: data.services.payment.gatewayConfigured, detail: data.services.payment.detail },
        {
            label: "Monitoring",
            ok: data.services.monitoring.healthScore >= 70,
            detail: `Health ${data.services.monitoring.healthScore} · alerts ${data.services.monitoring.openAlerts}`,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant={data.environment.ready ? "success" : "warning"}>{data.environment.ready ? "Ready" : "Attention"}</Badge>
                <span className="text-sm text-[var(--dos-text-secondary)]">v{data.version}</span>
                <span className="text-sm text-[var(--dos-text-tertiary)]">uptime {data.uptimeSeconds}s</span>
                {error ? <span className="text-sm text-[var(--dos-warning)]">{error}</span> : null}
            </div>

            <Card>
                <h2 className="text-lg font-semibold text-[var(--dos-text-primary)]">Environment score</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{data.environment.name}</p>
                <div className="mt-4">
                    <ProgressIndicator value={data.environment.score} label="Production readiness" />
                </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                    <Card key={service.label}>
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-[var(--dos-text-primary)]">{service.label}</h3>
                            <Badge variant={service.ok ? "success" : "warning"}>{service.ok ? "OK" : "Pending"}</Badge>
                        </div>
                        <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{service.detail}</p>
                    </Card>
                ))}
            </div>

            <Card>
                <h2 className="text-lg font-semibold text-[var(--dos-text-primary)]">Validation checks</h2>
                <ul className="mt-4 space-y-2 text-sm">
                    {data.environment.checks.map((check) => (
                        <li key={check.id} className="flex items-start justify-between gap-3 border-b border-[var(--dos-border-subtle)] py-2">
                            <span className="text-[var(--dos-text-secondary)]">
                                <span className="font-medium text-[var(--dos-text-primary)]">{check.id}</span> — {check.detail}
                            </span>
                            <Badge variant={check.status === "pass" ? "success" : check.status === "warn" ? "warning" : "error"}>
                                {check.status}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
