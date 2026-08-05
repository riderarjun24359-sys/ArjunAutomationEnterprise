import { platformOperationsService } from "@/src/modules/platform-operations";
import { computeReliabilityScore } from "@/src/modules/platform-operations/lib/reliability-policies";

export function fetchPlatformHealth() {
    const health = platformOperationsService.getHealthCenter();
    const stats = platformOperationsService.getOperationsDashboard();
    return { health, stats };
}

export function fetchObservabilityData() {
    return platformOperationsService.getObservabilityData();
}

export function fetchResilienceData() {
    return {
        retryPolicies: platformOperationsService.getRetryPolicies(),
        queues: platformOperationsService.getJobQueues(),
        errors: platformOperationsService.getErrors(false),
    };
}

export function fetchBackupRecoveryData() {
    return {
        backups: platformOperationsService.getBackups(),
        drPlan: platformOperationsService.getDisasterRecoveryPlans(),
    };
}

export function computePlatformReliabilityScore() {
    const health = platformOperationsService.getLiveHealthScore();
    const errors = platformOperationsService.getErrors(false);
    const backups = platformOperationsService.getBackups();
    const backupRate = backups.length ? (backups.filter((b) => b.verified).length / backups.length) * 100 : 100;
    return computeReliabilityScore({
        healthScore: health.score,
        openErrors: errors.length,
        activeIncidents: 0,
        backupSuccessRate: backupRate,
    });
}
