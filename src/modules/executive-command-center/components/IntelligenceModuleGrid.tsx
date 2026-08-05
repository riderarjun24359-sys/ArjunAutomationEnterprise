"use client";

import { useState } from "react";
import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import type { IntelligenceModuleSnapshot } from "../types";
import {
    CtoIntelligencePanel,
    OperationsIntelligencePanel,
    BusinessIntelligencePanel,
    CustomerIntelligencePanel,
    ProjectIntelligencePanel,
} from "./panels/IntelligencePanels";

const statusVariant: Record<string, "success" | "warning" | "error"> = {
    healthy: "success",
    watch: "warning",
    critical: "error",
};

const panels: Record<string, React.ComponentType<{ module: IntelligenceModuleSnapshot }>> = {
    cto: CtoIntelligencePanel,
    operations: OperationsIntelligencePanel,
    business: BusinessIntelligencePanel,
    customer: CustomerIntelligencePanel,
    project: ProjectIntelligencePanel,
};

export function IntelligenceModuleGrid({ modules }: { modules: IntelligenceModuleSnapshot[] }) {
    const [active, setActive] = useState(modules[0]?.key ?? "cto");
    const current = modules.find((m) => m.key === active) ?? modules[0];
    const Panel = current ? panels[current.key] : null;

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {modules.map((mod) => (
                    <button
                        key={mod.key}
                        type="button"
                        onClick={() => setActive(mod.key)}
                        className={`rounded-[var(--dos-radius-xl)] border p-4 text-left transition ${active === mod.key ? "border-[var(--dos-brand-primary)] bg-[var(--dos-surface-elevated)] shadow-sm" : "border-[var(--dos-border)] hover:bg-[var(--dos-surface-tertiary)]"}`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-[var(--dos-text-primary)]">{mod.label}</p>
                            <Badge variant={statusVariant[mod.status]}>{mod.status}</Badge>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{mod.score}%</p>
                    </button>
                ))}
            </div>
            {current && Panel ? (
                <Panel module={current} />
            ) : (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Select an intelligence module.</p></Card>
            )}
        </div>
    );
}
