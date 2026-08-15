import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    BackupRecord,
    DisasterRecoveryPlan,
    ErrorType,
    HealthScore,
    Incident,
    JobQueue,
    LogEntry,
    MetricPoint,
    OperationsDashboardStats,
    PerformanceMetric,
    PlatformError,
    PlatformOperationsState,
    QueueType,
    RetryPolicy,
    ServiceStatus,
    TraceSpan,
} from "../types";
import * as healthCenterEngine from "../engine/health-center-engine";
import * as observabilityEngine from "../engine/observability-engine";
import * as errorManagementEngine from "../engine/error-management-engine";
import * as queueJobEngine from "../engine/queue-job-engine";
import * as retryEngine from "../engine/retry-engine";
import * as backupCenterEngine from "../engine/backup-center-engine";
import * as disasterRecoveryEngine from "../engine/disaster-recovery-engine";
import * as performanceCenterEngine from "../engine/performance-center-engine";
import * as serviceStatusEngine from "../engine/service-status-engine";
import * as operationsDashboardEngine from "../engine/operations-dashboard-engine";
import {
    publishFailureEvent,
    publishHealthEvent,
    publishPerformanceMetric,
    publishRecoveryEvent,
    publishWorkflowEvent,
} from "../integrations/mission-core-bridge";
import { logPlatformOpsAudit } from "../integrations/audit-bridge";

export class PlatformOperationsService {
    getHealthCenter(): HealthScore {
        const score = healthCenterEngine.computeHealthScore();
        publishHealthEvent({ score: score.score, overall: score.overall });
        return score;
    }

    getLiveHealthScore(): HealthScore {
        return healthCenterEngine.getLiveHealthScore();
    }

    searchLogs(query: string, level?: string): LogEntry[] {
        return observabilityEngine.searchLogs(query, level);
    }

    getObservabilityData(): { logs: LogEntry[]; metrics: MetricPoint[]; traces: TraceSpan[] } {
        return observabilityEngine.getTimeline();
    }

    captureError(input: { type: ErrorType; message: string; source: string; stack?: string | null }): PlatformError {
        const error = errorManagementEngine.captureError(input);
        publishFailureEvent({ errorId: error.id, type: error.type, message: error.message });
        void logPlatformOpsAudit({ action: "error_captured", metadata: { errorId: error.id, type: error.type } });
        return error;
    }

    getErrors(resolved?: boolean): PlatformError[] {
        return errorManagementEngine.getErrors(resolved);
    }

    getAiRetryRecommendations(): PlatformError[] {
        return errorManagementEngine.getAiRetryRecommendations();
    }

    resolveError(id: string): PlatformError | null {
        const error = errorManagementEngine.resolveError(id);
        if (error) publishRecoveryEvent({ errorId: id, action: "resolved" });
        return error;
    }

    getJobQueues(): JobQueue[] {
        return queueJobEngine.getJobQueues();
    }

    enqueueJob(queueType: QueueType, jobName: string) {
        const result = queueJobEngine.enqueueJob(queueType, jobName);
        publishWorkflowEvent({ action: "enqueue", queueType, jobName });
        return result;
    }

    getRetryPolicies(): RetryPolicy[] {
        return retryEngine.getRetryPolicies();
    }

    executeRetry(policyId: string, attempt: number) {
        return retryEngine.executeRetry(policyId, attempt);
    }

    getBackups(): BackupRecord[] {
        return backupCenterEngine.getBackups();
    }

    runBackupVerification(id: string): BackupRecord | null {
        return backupCenterEngine.verifyBackup(id);
    }

    simulateRestore(id: string) {
        const result = backupCenterEngine.simulateRestore(id);
        if (result.success) publishRecoveryEvent({ backupId: id, action: "restore_simulated" });
        return result;
    }

    getDisasterRecoveryPlans(): DisasterRecoveryPlan[] {
        return disasterRecoveryEngine.getDisasterRecoveryPlans();
    }

    validateFailover(planId: string) {
        return disasterRecoveryEngine.validateFailover(planId);
    }

    getPerformanceMetrics(): PerformanceMetric[] {
        const metrics = performanceCenterEngine.getPerformanceMetrics();
        metrics.forEach((m) => publishPerformanceMetric({ name: m.name, value: m.value, category: m.category }));
        return metrics;
    }

    getServiceStatuses(): ServiceStatus[] {
        return serviceStatusEngine.getServiceStatuses();
    }

    getIncidents(): Incident[] {
        return serviceStatusEngine.getIncidents();
    }

    setMaintenanceMode(enabled: boolean) {
        return serviceStatusEngine.setMaintenanceMode(enabled);
    }

    getOperationsDashboard(): OperationsDashboardStats {
        return operationsDashboardEngine.getOperationsDashboard();
    }

    getFullState(): PlatformOperationsState {
        return {
            healthScore: this.getHealthCenter(),
            logs: observabilityEngine.getRecentLogs(),
            metrics: observabilityEngine.getMetrics(),
            traces: observabilityEngine.getTraces(),
            errors: this.getErrors(),
            queues: this.getJobQueues(),
            retryPolicies: this.getRetryPolicies(),
            backups: this.getBackups(),
            drPlans: this.getDisasterRecoveryPlans(),
            performance: performanceCenterEngine.getPerformanceMetrics(),
            incidents: this.getIncidents(),
            serviceStatuses: this.getServiceStatuses(),
            dashboard: this.getOperationsDashboard(),
        };
    }

    async createBackupConfig(orgId: string, name: string) {
        return await databaseService.backupConfigs.create({
            organization_id: orgId,
            name: name,
            schedule_cron: "0 2 * * 0",
            destination: "supabase",
            is_enabled: true,
            retention_count: 30,
            include_tables: []
        });
    }

    async getBackupConfigs(orgId: string) {
        return await databaseService.backupConfigs.listByOrganization(orgId);
    }

    async getBackupRuns(configId: string) {
        return await databaseService.backupRuns.listByConfig(configId);
    }

    async triggerBackup(orgId: string, configId: string) {
        return await databaseService.backupRuns.create({
            config_id: configId,
            status: "pending",
            started_at: new Date().toISOString()
        });
    }
}

export const platformOperationsService = new PlatformOperationsService();
