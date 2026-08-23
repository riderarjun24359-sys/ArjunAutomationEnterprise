import type { LucideIcon } from "lucide-react";

export interface ShellNavigationItem {
    label: string;
    href: string;
    description: string;
    icon: LucideIcon;
    section: "primary" | "secondary";
}

export interface EnterpriseSnapshot {
    runningAutomations: number;
    pendingApprovals: number;
    criticalRisks: number;
}

export interface NavContextInput {
    currentPath: string;
    authorizedNavigation: ShellNavigationItem[];
    explicitRelationships: Record<string, string[]>;
    snapshot: EnterpriseSnapshot;
}

export interface NavContextItem extends ShellNavigationItem {
    reason?: string;
}

export interface NavContextOutput {
    persistent: ShellNavigationItem[];
    contextual: NavContextItem[];
    library: ShellNavigationItem[];
}
