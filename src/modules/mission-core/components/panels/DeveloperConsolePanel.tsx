"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { ORCHESTRATION_RULES } from "../../lib/orchestration-rules";
import { useMissionCore } from "../../hooks/useMissionCore";

export function DeveloperConsolePanel() {
    const { developerConsole, capabilities, events, workflows, services } = useMissionCore();

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Platform Snapshot</h3>
                <div className="grid gap-3 sm:grid-cols-4 text-sm">
                    <div><span className="text-[var(--dos-text-secondary)]">Capabilities</span><p className="text-xl font-bold">{capabilities.length}</p></div>
                    <div><span className="text-[var(--dos-text-secondary)]">Events</span><p className="text-xl font-bold">{events.length}</p></div>
                    <div><span className="text-[var(--dos-text-secondary)]">Workflows</span><p className="text-xl font-bold">{workflows.length}</p></div>
                    <div><span className="text-[var(--dos-text-secondary)]">Services</span><p className="text-xl font-bold">{services.length}</p></div>
                </div>
            </Card>

            <Card>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Orchestration Rules</h3>
                <div className="space-y-2">
                    {ORCHESTRATION_RULES.map((rule) => (
                        <div key={rule.id} className="flex items-start justify-between gap-2 rounded-lg border border-[var(--dos-border-subtle)] p-3">
                            <div>
                                <p className="font-medium text-[var(--dos-text-primary)]">{rule.name}</p>
                                <p className="text-xs text-[var(--dos-text-secondary)]">{rule.description}</p>
                            </div>
                            <Badge variant={rule.enforced ? "success" : "warning"}>{rule.enforced ? "Enforced" : "Advisory"}</Badge>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Raw Console Data</h3>
                <pre className="max-h-64 overflow-auto rounded-lg bg-[var(--dos-surface-secondary)] p-3 text-xs">
                    {JSON.stringify(developerConsole, null, 2)}
                </pre>
            </Card>
        </div>
    );
}
