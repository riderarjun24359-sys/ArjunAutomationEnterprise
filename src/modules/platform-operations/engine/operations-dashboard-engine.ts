import type { OperationsDashboardStats } from "../types";
import { computeReliabilityScore } from "../lib/reliability-policies";
import * as healthCenterEngine from "./health-center-engine";
import * as errorManagementEngine from "./error-management-engine";
import * as queueJobEngine from "./queue-job-engine";
import * as backupCenterEngine from "./backup-center-engine";
import * as performanceCenterEngine from "./performance-center-engine";
import * as serviceStatusEngine from "./service-status-engine";

export function getOperationsDashboard(): OperationsDashboardStats {
    const healthScore = healthCenterEngine.computeHealthScore();
    const openErrors = errorManagementEngine.getErrors(false).length;
    const activeIncidents = serviceStatusEngine.getActiveIncidents().length;
    const queueBacklog = queueJobEngine.getQueueBacklog();
    const backupSuccessRate = backupCenterEngine.getBackupSuccessRate();
    const avgResponseTimeMs = performanceCenterEngine.getAverageResponseTime();

    const reliabilityScore = computeReliabilityScore({
        healthScore: healthScore.score,
        openErrors,
        activeIncidents,
        backupSuccessRate,
    });

    return {
        reliabilityScore,
        healthScore: healthScore.score,
        activeIncidents,
        openErrors,
        queueBacklog,
        backupSuccessRate,
        avgResponseTimeMs,
        lastCheckedAt: new Date().toISOString(),
    };
}

export function getExecutiveOverview(): {
    dashboard: OperationsDashboardStats;
    health: ReturnType<typeof healthCenterEngine.computeHealthScore>;
} {
    return {
        dashboard: getOperationsDashboard(),
        health: healthCenterEngine.computeHealthScore(),
    };
}
