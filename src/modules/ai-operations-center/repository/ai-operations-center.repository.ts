import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { AiOperationsCenterRawData } from "../types";

const LIMIT = 500;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class AiOperationsCenterRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<AiOperationsCenterRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            overallHealth,
            moduleHealth,
            databaseHealth,
            jobSchedulers,
            recurringJobs,
            retryQueue,
            deadLetters,
            alerts,
            alertAcks,
            platformLogs,
            platformMetrics,
            traces,
            services,
            opsMetrics,
            opsHealth,
            opsFailures,
            eocAudit,
            activityLogs,
            auditLogs,
            backupConfigs,
            aiAgents,
            workflowExecutions,
            automationLogs,
            dweHealth,
            clients,
        ] = await Promise.all([
            databaseService.eocOverallHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocModuleHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocDatabaseHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocJobSchedulers.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocRecurringJobs.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocJobRetryQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocJobDeadLetter.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocAlerts.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocAlertAcknowledgements.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocPlatformLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocPlatformMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocTraceSummaries.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocServiceRegistry.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocOperationsMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocOperationsHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocOperationsFailures.listByOrganization(orgId, q).catch(() => []),
            databaseService.eocAuditLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.activityLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.audits.list({ ...q, filters: { organization_id: orgId } }).catch(() => []),
            databaseService.backupConfigs.listByOrganization(orgId, q).catch(() => []),
            databaseService.aiAgents.listByOrganization(orgId, q).catch(() => []),
            databaseService.workflowExecutions.listByOrganization(orgId, q).catch(() => []),
            databaseService.automationLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.clients.listByOrganization(orgId, q).catch(() => []),
        ]);

        const backupRunsNested = await Promise.all(
            backupConfigs.slice(0, 20).map((c) => databaseService.backupRuns.listByConfig(c.id).catch(() => [])),
        );
        const backupRuns = backupRunsNested.flat();

        return {
            organizationId: orgId,
            membershipRole,
            overallHealth: overallHealth.map((r) => ({
                id: r.id,
                health_type: r.health_type,
                health_score: Number(r.health_score ?? 0),
                last_check_at: r.last_check_at,
                status: r.status,
            })),
            moduleHealth: moduleHealth.map((r) => ({
                id: r.id,
                module_name: r.module_name,
                health_score: Number(r.health_score ?? 0),
                last_check_at: r.last_check_at,
                status: r.status,
            })),
            databaseHealth: databaseHealth.map((r) => ({
                id: r.id,
                connection_pool_used: Number(r.connection_pool_used ?? 0),
                health_score: Number(r.health_score ?? 0),
                last_check_at: r.last_check_at,
                status: r.status,
            })),
            jobSchedulers: jobSchedulers.map((r) => ({
                id: r.id,
                scheduler_name: r.scheduler_name,
                scheduler_status: r.scheduler_status,
                status: r.status,
            })),
            recurringJobs: recurringJobs.map((r) => ({
                id: r.id,
                job_name: r.job_name,
                job_status: r.job_status,
                last_run_at: r.last_run_at ?? null,
                next_run_at: r.next_run_at ?? null,
                status: r.status,
            })),
            retryQueue: retryQueue.map((r) => ({
                id: r.id,
                job_ref: r.job_ref,
                retry_count: Number(r.retry_count ?? 0),
                priority: Number(r.priority ?? 0),
                last_error: r.last_error,
                status: r.status,
            })),
            deadLetters: deadLetters.map((r) => ({
                id: r.id,
                job_ref: r.job_ref,
                error_message: r.error_message,
                failed_at: r.failed_at,
                status: r.status,
            })),
            alerts: alerts.map((r) => ({
                id: r.id,
                alert_title: r.alert_title,
                alert_severity: r.alert_severity,
                alert_message: r.alert_message,
                silenced: Boolean(r.silenced),
                alert_status: r.alert_status,
                triggered_at: r.triggered_at,
                status: r.status,
            })),
            alertAcks: alertAcks.map((r) => ({
                id: r.id,
                acknowledged_by: r.acknowledged_by,
                ack_note: r.ack_note,
                acknowledged_at: r.acknowledged_at,
                status: r.status,
            })),
            platformLogs: platformLogs.map((r) => ({
                id: r.id,
                log_level: r.log_level,
                service_name: r.service_name,
                message: r.message,
                logged_at: r.logged_at,
                status: r.status,
            })),
            platformMetrics: platformMetrics.map((r) => ({
                id: r.id,
                metric_date: r.metric_date,
                dependency_health: Number(r.dependency_health ?? 0),
                cpu_percent: Number(r.cpu_percent ?? 0),
                memory_percent: Number(r.memory_percent ?? 0),
                status: r.status,
            })),
            traces: traces.map((r) => ({
                id: r.id,
                trace_id: r.trace_id,
                span_count: Number(r.span_count ?? 0),
                duration_ms: Number(r.duration_ms ?? 0),
                traced_at: r.traced_at,
                status: r.status,
            })),
            services: services.map((r) => ({
                id: r.id,
                service_name: r.service_name,
                service_url: r.service_url,
                last_heartbeat_at: r.last_heartbeat_at,
                status: r.status,
                cache_status: r.cache_status,
            })),
            opsMetrics: opsMetrics.map((r) => ({
                id: r.id,
                metric_date: r.metric_date,
                operational_score: Number(r.operational_score ?? 0),
                active_jobs: Number(r.active_jobs ?? 0),
                open_alerts: Number(r.open_alerts ?? 0),
                status: r.status,
            })),
            opsHealth: opsHealth.map((r) => ({
                id: r.id,
                health_date: r.health_date,
                overall_score: Number(r.overall_score ?? 0),
                uptime_percent: Number(r.uptime_percent ?? 0),
                disaster_recovery_mode: Boolean(r.disaster_recovery_mode),
                summary: r.summary,
                status: r.status,
            })),
            opsFailures: opsFailures.map((r) => ({
                id: r.id,
                failure_type: r.failure_type,
                error_message: r.error_message,
                failed_at: r.failed_at,
                status: r.status,
            })),
            eocAudit: eocAudit.map((r) => ({
                id: r.id,
                action: r.action,
                summary: r.summary,
                security_level: r.security_level,
                created_at: r.created_at,
                entity_type: r.entity_type,
            })),
            activityLogs: activityLogs.map((r) => ({
                id: r.id,
                action: r.action,
                title: r.title,
                detail: r.detail,
                entity_type: r.entity_type,
                created_at: r.created_at,
            })),
            auditLogs: auditLogs.map((r) => ({
                id: r.id,
                action: String(r.action ?? ""),
                summary: JSON.stringify(r.metadata ?? {}),
                created_at: r.created_at,
            })),
            backupConfigs: backupConfigs.map((r) => ({
                id: r.id,
                name: r.name,
                schedule_cron: r.schedule_cron,
                destination: r.destination,
                is_enabled: Boolean(r.is_enabled),
                retention_count: Number(r.retention_count ?? 0),
            })),
            backupRuns: backupRuns.map((r) => ({
                id: r.id,
                config_id: r.config_id,
                status: r.status,
                started_at: r.started_at,
                size_bytes: Number(r.size_bytes ?? 0),
                storage_path: r.storage_path,
                error_message: r.error_message,
            })),
            aiAgents: aiAgents.map((r) => ({
                id: r.id,
                name: r.name,
                status: r.status,
                model: r.model,
                max_tokens: Number(r.max_tokens ?? 0),
                description: r.description,
            })),
            workflowExecutions: workflowExecutions.map((r) => ({
                id: r.id,
                workflow_id: r.workflow_id,
                status: r.status,
                duration_ms: Number(r.duration_ms ?? 0),
                error_message: r.error_message,
                started_at: r.started_at,
            })),
            automationLogs: automationLogs.map((r) => ({
                id: r.id,
                level: r.level,
                message: r.message,
                created_at: r.created_at,
                workflow_id: r.workflow_id ?? null,
            })),
            dweHealth: dweHealth.map((r) => ({
                id: r.id,
                overall_score: Number(r.overall_score ?? 0),
                running_workflows_count: Number(r.running_workflows_count ?? 0),
                automation_health_status: r.automation_health_status,
                summary: r.summary,
            })),
            clients: clients.map((r) => ({
                id: r.id,
                name: r.name,
                status: r.status,
            })),
        };
    }
}

export const aiOperationsCenterRepository = new AiOperationsCenterRepository();
