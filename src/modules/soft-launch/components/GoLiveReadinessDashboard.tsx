"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { LoadingState } from "@/src/design-os/components/LoadingState";
import { ProgressIndicator } from "@/src/design-os/motion/components/ProgressIndicator";

type GoLiveStatus = {
    version: string;
    uptimeSeconds: number;
    readiness: {
        ready: boolean;
        score: number;
        goLiveMode: boolean;
        blockers: string[];
        warnings: string[];
        tasks: Array<{ id: string; title: string; status: string; detail: string }>;
    };
    services: {
        supabase: { configured: boolean; detail: string };
        storage: { bucket: string; detail: string };
        authentication: { ok: boolean; detail: string };
        email: { templatesPresent: boolean; providerConfigured: boolean; detail: string };
        payment: { configured: boolean; detail: string };
        monitoring: { openAlerts: number; detail: string };
        backups: { restoreProcedureOk: boolean; detail: string };
        security: { ok: boolean; detail: string };
        onboarding: { wizardPresent: boolean; plansPresent: boolean; detail: string };
    };
};

export function GoLiveReadinessDashboard() {
    const [data, setData] = useState<GoLiveStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch("/api/ops/go-live", { cache: "no-store" });
                const json = (await res.json()) as GoLiveStatus;
                if (!cancelled) {
                    setData(json);
                    setError(res.ok ? null : "Go-Live status degraded");
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load go-live status");
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

    if (loading) return <LoadingState label="Loading go-live readiness…" />;
    if (!data) return <EmptyState title="Go-Live status unavailable" description={error ?? "No status returned"} />;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant={data.readiness.ready ? "success" : "warning"}>
                    {data.readiness.ready ? "Go-Live ready" : "Not ready"}
                </Badge>
                {data.readiness.goLiveMode ? <Badge variant="info">Strict go-live mode</Badge> : null}
                <span className="text-sm text-[var(--dos-text-secondary)]">v{data.version}</span>
                <span className="text-sm text-[var(--dos-text-tertiary)]">uptime {data.uptimeSeconds}s</span>
                {error ? <span className="text-sm text-[var(--dos-warning)]">{error}</span> : null}
            </div>

            <Card>
                <h2 className="text-lg font-semibold text-[var(--dos-text-primary)]">Go-Live score</h2>
                <div className="mt-4">
                    <ProgressIndicator value={data.readiness.score} label="Customer onboarding readiness" />
                </div>
            </Card>

            <Card>
                <h2 className="text-lg font-semibold text-[var(--dos-text-primary)]">Go-Live tasks</h2>
                <ul className="mt-4 space-y-2 text-sm">
                    {data.readiness.tasks.map((task) => (
                        <li key={task.id} className="flex items-start justify-between gap-3 border-b border-[var(--dos-border-subtle)] py-2">
                            <span className="text-[var(--dos-text-secondary)]">
                                <span className="font-medium text-[var(--dos-text-primary)]">{task.title}</span> — {task.detail}
                            </span>
                            <Badge variant={task.status === "pass" ? "success" : task.status === "warn" ? "warning" : "error"}>
                                {task.status}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card>
                <h2 className="text-lg font-semibold text-[var(--dos-text-primary)]">Customer onboarding</h2>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{data.services.onboarding.detail}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant={data.services.onboarding.wizardPresent ? "success" : "warning"}>Wizard</Badge>
                    <Badge variant={data.services.onboarding.plansPresent ? "success" : "warning"}>Plans</Badge>
                    <Badge variant={data.services.security.ok ? "success" : "error"}>Security</Badge>
                    <Badge variant={data.services.backups.restoreProcedureOk ? "success" : "warning"}>DR docs</Badge>
                </div>
            </Card>
        </div>
    );
}
