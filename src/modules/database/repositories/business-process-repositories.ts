import type {
    DbBpfProcessHub,
    DbBpfBusinessProcess,
    DbBpfProcessCategory,
    DbBpfProcessVersion,
    DbBpfProcessDependency,
    DbBpfProcessModel,
    DbBpfProcessStep,
    DbBpfDecisionPoint,
    DbBpfReusableBlock,
    DbBpfApprovalRule,
    DbBpfSequentialApproval,
    DbBpfParallelApproval,
    DbBpfEscalationRule,
    DbBpfTaskAssignment,
    DbBpfTaskTemplate,
    DbBpfRecurringTask,
    DbBpfTaskSlaPolicy,
    DbBpfRuleCondition,
    DbBpfRuleValidation,
    DbBpfRuleCalculation,
    DbBpfReusableRule,
    DbBpfProcessExecution,
    DbBpfExecutionHistory,
    DbBpfExecutionRetry,
    DbBpfExecutionAnalytics,
    DbBpfBottleneckReport,
    DbBpfSlaPerformanceMetric,
    DbBpfProcessMetric,
    DbBpfProcessHealth,
    DbBpfFailedProcessRecord,
    DbBpfProcessFailure,
    DbBpfAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgBpfRepository<T> extends BaseRepository<T> {
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

export class BpfProcessHubRepository extends OrgBpfRepository<DbBpfProcessHub> { protected table = "bpf_process_hubs"; }
export class BpfBusinessProcessRepository extends OrgBpfRepository<DbBpfBusinessProcess> { protected table = "bpf_business_processes"; }
export class BpfProcessCategoryRepository extends OrgBpfRepository<DbBpfProcessCategory> { protected table = "bpf_process_categories"; }
export class BpfProcessVersionRepository extends OrgBpfRepository<DbBpfProcessVersion> { protected table = "bpf_process_versions"; }
export class BpfProcessDependencyRepository extends OrgBpfRepository<DbBpfProcessDependency> { protected table = "bpf_process_dependencies"; }
export class BpfProcessModelRepository extends OrgBpfRepository<DbBpfProcessModel> { protected table = "bpf_process_models"; }
export class BpfProcessStepRepository extends OrgBpfRepository<DbBpfProcessStep> { protected table = "bpf_process_steps"; }
export class BpfDecisionPointRepository extends OrgBpfRepository<DbBpfDecisionPoint> { protected table = "bpf_decision_points"; }
export class BpfReusableBlockRepository extends OrgBpfRepository<DbBpfReusableBlock> { protected table = "bpf_reusable_blocks"; }
export class BpfApprovalRuleRepository extends OrgBpfRepository<DbBpfApprovalRule> { protected table = "bpf_approval_rules"; }
export class BpfSequentialApprovalRepository extends OrgBpfRepository<DbBpfSequentialApproval> { protected table = "bpf_sequential_approvals"; }
export class BpfParallelApprovalRepository extends OrgBpfRepository<DbBpfParallelApproval> { protected table = "bpf_parallel_approvals"; }
export class BpfEscalationRuleRepository extends OrgBpfRepository<DbBpfEscalationRule> { protected table = "bpf_escalation_rules"; }
export class BpfTaskAssignmentRepository extends OrgBpfRepository<DbBpfTaskAssignment> { protected table = "bpf_task_assignments"; }
export class BpfTaskTemplateRepository extends OrgBpfRepository<DbBpfTaskTemplate> { protected table = "bpf_task_templates"; }
export class BpfRecurringTaskRepository extends OrgBpfRepository<DbBpfRecurringTask> { protected table = "bpf_recurring_tasks"; }
export class BpfTaskSlaPolicyRepository extends OrgBpfRepository<DbBpfTaskSlaPolicy> { protected table = "bpf_task_sla_policies"; }
export class BpfRuleConditionRepository extends OrgBpfRepository<DbBpfRuleCondition> { protected table = "bpf_rule_conditions"; }
export class BpfRuleValidationRepository extends OrgBpfRepository<DbBpfRuleValidation> { protected table = "bpf_rule_validations"; }
export class BpfRuleCalculationRepository extends OrgBpfRepository<DbBpfRuleCalculation> { protected table = "bpf_rule_calculations"; }
export class BpfReusableRuleRepository extends OrgBpfRepository<DbBpfReusableRule> { protected table = "bpf_reusable_rules"; }
export class BpfProcessExecutionRepository extends OrgBpfRepository<DbBpfProcessExecution> { protected table = "bpf_process_executions"; }
export class BpfExecutionHistoryRepository extends OrgBpfRepository<DbBpfExecutionHistory> { protected table = "bpf_execution_history"; }
export class BpfExecutionRetryRepository extends OrgBpfRepository<DbBpfExecutionRetry> { protected table = "bpf_execution_retries"; }
export class BpfExecutionAnalyticsRepository extends OrgBpfRepository<DbBpfExecutionAnalytics> { protected table = "bpf_execution_analytics"; }
export class BpfBottleneckReportRepository extends OrgBpfRepository<DbBpfBottleneckReport> { protected table = "bpf_bottleneck_reports"; }
export class BpfSlaPerformanceMetricRepository extends OrgBpfRepository<DbBpfSlaPerformanceMetric> { protected table = "bpf_sla_performance_metrics"; }
export class BpfProcessMetricRepository extends OrgBpfRepository<DbBpfProcessMetric> { protected table = "bpf_process_metrics"; }
export class BpfProcessHealthRepository extends OrgBpfRepository<DbBpfProcessHealth> { protected table = "bpf_process_health"; }
export class BpfFailedProcessRecordRepository extends OrgBpfRepository<DbBpfFailedProcessRecord> { protected table = "bpf_failed_process_records"; }
export class BpfProcessFailureRepository extends OrgBpfRepository<DbBpfProcessFailure> { protected table = "bpf_process_failures"; }
export class BpfAuditLogRepository extends OrgBpfRepository<DbBpfAuditLog> { protected table = "bpf_audit_logs"; }
