import { platformOperationsService } from "../services/platform-operations.service";

export function createPlatformOperationsClient() {
    return {
        getHealthCenter: platformOperationsService.getHealthCenter.bind(platformOperationsService),
        getLiveHealthScore: platformOperationsService.getLiveHealthScore.bind(platformOperationsService),
        searchLogs: platformOperationsService.searchLogs.bind(platformOperationsService),
        getObservabilityData: platformOperationsService.getObservabilityData.bind(platformOperationsService),
        captureError: platformOperationsService.captureError.bind(platformOperationsService),
        getErrors: platformOperationsService.getErrors.bind(platformOperationsService),
        getAiRetryRecommendations: platformOperationsService.getAiRetryRecommendations.bind(platformOperationsService),
        resolveError: platformOperationsService.resolveError.bind(platformOperationsService),
        getJobQueues: platformOperationsService.getJobQueues.bind(platformOperationsService),
        enqueueJob: platformOperationsService.enqueueJob.bind(platformOperationsService),
        getRetryPolicies: platformOperationsService.getRetryPolicies.bind(platformOperationsService),
        executeRetry: platformOperationsService.executeRetry.bind(platformOperationsService),
        getBackups: platformOperationsService.getBackups.bind(platformOperationsService),
        runBackupVerification: platformOperationsService.runBackupVerification.bind(platformOperationsService),
        simulateRestore: platformOperationsService.simulateRestore.bind(platformOperationsService),
        getDisasterRecoveryPlans: platformOperationsService.getDisasterRecoveryPlans.bind(platformOperationsService),
        validateFailover: platformOperationsService.validateFailover.bind(platformOperationsService),
        getPerformanceMetrics: platformOperationsService.getPerformanceMetrics.bind(platformOperationsService),
        getServiceStatuses: platformOperationsService.getServiceStatuses.bind(platformOperationsService),
        getIncidents: platformOperationsService.getIncidents.bind(platformOperationsService),
        setMaintenanceMode: platformOperationsService.setMaintenanceMode.bind(platformOperationsService),
        getOperationsDashboard: platformOperationsService.getOperationsDashboard.bind(platformOperationsService),
        getFullState: platformOperationsService.getFullState.bind(platformOperationsService),
    };
}

export type PlatformOperationsClient = ReturnType<typeof createPlatformOperationsClient>;
