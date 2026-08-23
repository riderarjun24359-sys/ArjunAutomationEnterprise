export interface OperationsSnapshot {
    organizationId: string | null;
    fetchedAt: string;
    pulse: {
        activeAutomations: number;
        criticalAlerts: number;
        pendingApprovals: number;
        systemHealth: "healthy" | "degraded" | "critical";
    };
    workQueue: Array<{ id: string; title: string; priority: "high" | "medium" | "low"; dueDate?: string }>;
    exceptions: Array<{ id: string; title: string; severity: "critical" | "warning" }>;
    serviceStatus: Array<{ id: string; name: string; status: string }>;
    activity: Array<{ id: string; title: string; detail: string; time: string }>;
}
