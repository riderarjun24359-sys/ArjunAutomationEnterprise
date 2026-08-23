"use client";

import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";

export function ServiceStatusPanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="space-y-6">
            {state.incidents.length > 0 && (
                <IntelligentContainer material="active" agentType="critical">
                    <p className={`text-sm font-medium text-[var(--dos-text-critical)]`}>Active Incidents</p>
                    {state.incidents.map((inc) => (
                        <div key={inc.id} className="mt-2 flex items-center justify-between">
                            <span className="text-[var(--dos-text-primary)]">{inc.title}</span>
                            <Badge variant={inc.severity === "critical" ? "error" : "warning"}>{inc.status}</Badge>
                        </div>
                    ))}
                </IntelligentContainer>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.serviceStatuses.map((s) => {
                    // Map real state to AgentType
                    const agentType = s.status === "healthy" ? "success" : s.status === "degraded" ? "warning" : "critical";
                    
                    return (
                        <IntelligentContainer 
                            key={s.id} 
                            material="base"
                            agentType={agentType}
                        >
                            <p className="font-medium text-[var(--dos-text-primary)]">{s.name}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                                {loading ? "—" : `${s.uptime.toFixed(1)}% uptime`}
                            </p>
                            <Badge className="mt-2" variant={s.status === "healthy" ? "success" : s.status === "degraded" ? "warning" : "error"}>{s.status}</Badge>
                        </IntelligentContainer>
                    );
                })}
            </div>
        </div>
    );
}
