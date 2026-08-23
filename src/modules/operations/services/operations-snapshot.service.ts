import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { operationsCenterService } from "@/src/modules/operations-center/services/operations-center.service";
import type { OperationsSnapshot } from "../types/snapshot";

class OperationsSnapshotService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<OperationsSnapshot> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        
        // Fetch all required data in parallel
        const [stats, overallHealthList, auditLogs] = await Promise.all([
            operationsCenterService.getDashboardStats(authUserId, email, fullName),
            operationsCenterService.getOverallHealths(authUserId, email, fullName),
            operationsCenterService.getAuditLogs(authUserId, email, fullName),
        ]);

        // Derive health from averageHealthScore
        const overallHealthRaw = stats.avgHealthScore;
        const overallHealth: "healthy" | "degraded" | "critical" = overallHealthRaw > 90 ? "healthy" : overallHealthRaw > 70 ? "degraded" : "critical";

        // Map alerts to exceptions
        const exceptions = stats.openAlertCount > 0 
            ? [{ id: "alerts", title: `${stats.openAlertCount} open alerts`, severity: "critical" as const }]
            : [];

        // Map retry queue to workQueue
        const workQueue = stats.pendingRetryCount > 0 
            ? [{ id: "retries", title: `${stats.pendingRetryCount} jobs pending retry`, priority: "high" as const }]
            : [];

        // Map service status
        const serviceStatus = overallHealthList.map(h => ({
            id: h.id,
            name: h.healthKey,
            status: h.status
        }));

        // Map activity
        const activity = auditLogs.slice(0, 5).map(log => ({
            id: log.id,
            title: log.action,
            detail: log.summary,
            time: new Date(log.createdAt).toLocaleTimeString()
        }));

        return {
            organizationId: context?.organizationId ?? null,
            fetchedAt: new Date().toISOString(),
            pulse: {
                activeAutomations: stats.activeJobCount,
                criticalAlerts: stats.openAlertCount,
                pendingApprovals: 0,
                systemHealth: overallHealth,
            },
            workQueue,
            exceptions,
            serviceStatus,
            activity,
        };
    }
}

export const operationsSnapshotService = new OperationsSnapshotService();
