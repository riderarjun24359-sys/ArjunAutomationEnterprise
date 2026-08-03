import type {
    DbDweWorkflowHub,
    DbDweWorkflowDefinition,
    DbDweWorkflowCategory,
    DbDweWorkflowTemplate,
    DbDweWorkflowVersion,
    DbDweWorkflowNode,
    DbDweWorkflowTransition,
    DbDweDecisionNode,
    DbDweReusableSubflow,
    DbDweWorkflowExecution,
    DbDweExecutionHistory,
    DbDweExecutionRetry,
    DbDweExecutionRollback,
    DbDweTimeTrigger,
    DbDweBusinessEventTrigger,
    DbDweWebhookTrigger,
    DbDweScheduledTrigger,
    DbDweManualReview,
    DbDweApprovalTask,
    DbDweEscalationRule,
    DbDweSlaTracking,
    DbDweAutomationNotification,
    DbDweAutomationApiCall,
    DbDweAutomationIntegration,
    DbDweExecutionAnalytics,
    DbDweBottleneckReport,
    DbDweSlaComplianceMetric,
    DbDweWorkflowMetric,
    DbDweWorkflowHealth,
    DbDweFailedExecution,
    DbDweWorkflowFailure,
    DbDweAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgDweRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class DweWorkflowHubRepository extends OrgDweRepository<DbDweWorkflowHub> { protected table = "dwe_workflow_hubs"; }
export class DweWorkflowDefinitionRepository extends OrgDweRepository<DbDweWorkflowDefinition> { protected table = "dwe_workflow_definitions"; }
export class DweWorkflowCategoryRepository extends OrgDweRepository<DbDweWorkflowCategory> { protected table = "dwe_workflow_categories"; }
export class DweWorkflowTemplateRepository extends OrgDweRepository<DbDweWorkflowTemplate> { protected table = "dwe_workflow_templates"; }
export class DweWorkflowVersionRepository extends OrgDweRepository<DbDweWorkflowVersion> { protected table = "dwe_workflow_versions"; }
export class DweWorkflowNodeRepository extends OrgDweRepository<DbDweWorkflowNode> { protected table = "dwe_workflow_nodes"; }
export class DweWorkflowTransitionRepository extends OrgDweRepository<DbDweWorkflowTransition> { protected table = "dwe_workflow_transitions"; }
export class DweDecisionNodeRepository extends OrgDweRepository<DbDweDecisionNode> { protected table = "dwe_decision_nodes"; }
export class DweReusableSubflowRepository extends OrgDweRepository<DbDweReusableSubflow> { protected table = "dwe_reusable_subflows"; }
export class DweWorkflowExecutionRepository extends OrgDweRepository<DbDweWorkflowExecution> { protected table = "dwe_workflow_executions"; }
export class DweExecutionHistoryRepository extends OrgDweRepository<DbDweExecutionHistory> { protected table = "dwe_execution_history"; }
export class DweExecutionRetryRepository extends OrgDweRepository<DbDweExecutionRetry> { protected table = "dwe_execution_retries"; }
export class DweExecutionRollbackRepository extends OrgDweRepository<DbDweExecutionRollback> { protected table = "dwe_execution_rollbacks"; }
export class DweTimeTriggerRepository extends OrgDweRepository<DbDweTimeTrigger> { protected table = "dwe_time_triggers"; }
export class DweBusinessEventTriggerRepository extends OrgDweRepository<DbDweBusinessEventTrigger> { protected table = "dwe_business_event_triggers"; }
export class DweWebhookTriggerRepository extends OrgDweRepository<DbDweWebhookTrigger> { protected table = "dwe_webhook_triggers"; }
export class DweScheduledTriggerRepository extends OrgDweRepository<DbDweScheduledTrigger> { protected table = "dwe_scheduled_triggers"; }
export class DweManualReviewRepository extends OrgDweRepository<DbDweManualReview> { protected table = "dwe_manual_reviews"; }
export class DweApprovalTaskRepository extends OrgDweRepository<DbDweApprovalTask> { protected table = "dwe_approval_tasks"; }
export class DweEscalationRuleRepository extends OrgDweRepository<DbDweEscalationRule> { protected table = "dwe_escalation_rules"; }
export class DweSlaTrackingRepository extends OrgDweRepository<DbDweSlaTracking> { protected table = "dwe_sla_trackings"; }
export class DweAutomationNotificationRepository extends OrgDweRepository<DbDweAutomationNotification> { protected table = "dwe_automation_notifications"; }
export class DweAutomationApiCallRepository extends OrgDweRepository<DbDweAutomationApiCall> { protected table = "dwe_automation_api_calls"; }
export class DweAutomationIntegrationRepository extends OrgDweRepository<DbDweAutomationIntegration> { protected table = "dwe_automation_integrations"; }
export class DweExecutionAnalyticsRepository extends OrgDweRepository<DbDweExecutionAnalytics> { protected table = "dwe_execution_analytics"; }
export class DweBottleneckReportRepository extends OrgDweRepository<DbDweBottleneckReport> { protected table = "dwe_bottleneck_reports"; }
export class DweSlaComplianceMetricRepository extends OrgDweRepository<DbDweSlaComplianceMetric> { protected table = "dwe_sla_compliance_metrics"; }
export class DweWorkflowMetricRepository extends OrgDweRepository<DbDweWorkflowMetric> { protected table = "dwe_workflow_metrics"; }
export class DweWorkflowHealthRepository extends OrgDweRepository<DbDweWorkflowHealth> { protected table = "dwe_workflow_health"; }
export class DweFailedExecutionRepository extends OrgDweRepository<DbDweFailedExecution> { protected table = "dwe_failed_executions"; }
export class DweWorkflowFailureRepository extends OrgDweRepository<DbDweWorkflowFailure> { protected table = "dwe_workflow_failures"; }
export class DweAuditLogRepository extends OrgDweRepository<DbDweAuditLog> { protected table = "dwe_audit_logs"; }
