import { Activity, AlertTriangle, Zap } from "lucide-react";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { useExecutiveShellStore } from "@/src/store/executive.store";

export function GlobalEnterprisePulse() {
    const snapshot = useExecutiveShellStore((s) => s.snapshot);
    if (!snapshot) return null;

    // Determine aggregate health state
    const hasCritical = snapshot.criticalRisks > 0;
    const hasPending = snapshot.pendingApprovals > 0;
    const isProcessing = snapshot.runningAutomations > 0;

    const status = hasCritical ? "critical" : hasPending ? "warning" : isProcessing ? "processing" : "success";
    const label = hasCritical ? "Critical Risks" : hasPending ? "Approvals Pending" : isProcessing ? "Operations Active" : "Enterprise Calm";
    const Icon = hasCritical ? AlertTriangle : hasPending ? AlertTriangle : isProcessing ? Zap : Activity;

    return (
        <IntelligentContainer 
            material="foundation" 
            agentType={status}
            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--dos-border-subtle)] text-xs rounded-full"
        >
            <Icon className="h-3 w-3" />
            <span className="font-medium uppercase tracking-wider">{label}</span>
        </IntelligentContainer>
    );
}
