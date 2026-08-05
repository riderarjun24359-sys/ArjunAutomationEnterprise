"use client";

import { Card } from "@/src/design-os/components/Card";
import type { IntelligenceModuleSnapshot } from "../../types";

function ModulePanelShell({ module: mod, children }: { module: IntelligenceModuleSnapshot; children?: React.ReactNode }) {
    return (
        <Card>
            <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">{mod.label}</h3>
            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{mod.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {mod.metrics.map((m) => (
                    <div key={m.label} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                        <p className="text-xs text-[var(--dos-text-tertiary)]">{m.label}</p>
                        <p className="mt-1 text-lg font-semibold">{m.value}</p>
                    </div>
                ))}
            </div>
            <ul className="mt-4 space-y-2">
                {mod.highlights.map((h) => (
                    <li key={h} className="text-sm text-[var(--dos-text-secondary)]">• {h}</li>
                ))}
            </ul>
            {children}
        </Card>
    );
}

export function CtoIntelligencePanel({ module: mod }: { module: IntelligenceModuleSnapshot }) {
    return (
        <ModulePanelShell module={mod}>
            <p className="mt-4 text-xs text-[var(--dos-text-tertiary)]">
                Domains: Engineering Health · Performance Health · Security Health · Technical Debt · Architecture Review
            </p>
        </ModulePanelShell>
    );
}

export function OperationsIntelligencePanel({ module: mod }: { module: IntelligenceModuleSnapshot }) {
    return (
        <ModulePanelShell module={mod}>
            <p className="mt-4 text-xs text-[var(--dos-text-tertiary)]">
                Domains: Platform Monitoring · Automation Health · Workflow Status · Failure Detection · Recovery Suggestions
            </p>
        </ModulePanelShell>
    );
}

export function BusinessIntelligencePanel({ module: mod }: { module: IntelligenceModuleSnapshot }) {
    return (
        <ModulePanelShell module={mod}>
            <p className="mt-4 text-xs text-[var(--dos-text-tertiary)]">
                Domains: Revenue · Sales · Pipeline · Conversion · Forecast · Growth
            </p>
        </ModulePanelShell>
    );
}

export function CustomerIntelligencePanel({ module: mod }: { module: IntelligenceModuleSnapshot }) {
    return (
        <ModulePanelShell module={mod}>
            <p className="mt-4 text-xs text-[var(--dos-text-tertiary)]">
                Domains: Client Health · Project Health · Support Health · Renewal Prediction · Risk Detection
            </p>
        </ModulePanelShell>
    );
}

export function ProjectIntelligencePanel({ module: mod }: { module: IntelligenceModuleSnapshot }) {
    return (
        <ModulePanelShell module={mod}>
            <p className="mt-4 text-xs text-[var(--dos-text-tertiary)]">
                Domains: Schedule Risk · Resource Usage · Milestone Prediction · Delivery Confidence
            </p>
        </ModulePanelShell>
    );
}
