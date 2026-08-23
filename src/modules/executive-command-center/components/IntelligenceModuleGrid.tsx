"use client";

import { useState } from "react";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
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

// Map status to agentType for IntelligentContainer tints
const statusAgentType: Record<string, "success" | "warning" | "critical" | "neutral"> = {
    healthy: "success",
    watch: "warning",
    critical: "critical",
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
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {modules.map((mod) => {
                    const isActive = active === mod.key;
                    return (
                        <button
                            key={mod.key}
                            type="button"
                            onClick={() => setActive(mod.key)}
                            className="text-left w-full"
                        >
                            <IntelligentContainer 
                                material={isActive ? "active" : "base"}
                                agentType={statusAgentType[mod.status] || "neutral"}
                                className={cn(
                                    "p-4 transition-all hover:border-[var(--dos-border)]",
                                    isActive ? "ring-2 ring-[var(--dos-brand-primary)]/20" : ""
                                )}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-[var(--dos-text-primary)] truncate">{mod.label}</p>
                                    <Badge variant={statusVariant[mod.status]}>{mod.status}</Badge>
                                </div>
                                <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--dos-text-primary)]">{mod.score}%</p>
                            </IntelligentContainer>
                        </button>
                    );
                })}
            </div>
            
            {current && Panel ? (
                <div className="pt-2">
                    <Panel module={current} />
                </div>
            ) : (
                <IntelligentContainer material="base">
                    <p className="text-sm text-[var(--dos-text-secondary)]">Select an intelligence module.</p>
                </IntelligentContainer>
            )}
        </div>
    );
}
// Helper for cn (imported from src/lib/cn, adding locally since read_file showed it missing in component file, but it should be available via alias)
import { cn } from "@/src/lib/cn";
