import { LucideIcon, Activity, AlertTriangle, Zap } from "lucide-react";

export interface EnterprisePulseItem {
    label: string;
    icon: LucideIcon;
    status: "healthy" | "active" | "warning" | "critical";
    value: string;
}

export const getEnterprisePulse = (snapshot: {
    runningAutomations: number;
    pendingApprovals: number;
    criticalRisks: number;
}): EnterprisePulseItem[] => [
    { label: "Operations", icon: Activity, status: "healthy", value: "Optimal" },
    { label: "Active Automations", icon: Zap, status: "active", value: String(snapshot.runningAutomations) },
    { label: "Pending Approvals", icon: AlertTriangle, status: "warning", value: String(snapshot.pendingApprovals) },
    { label: "Critical Risks", icon: AlertTriangle, status: "critical", value: String(snapshot.criticalRisks) },
];
