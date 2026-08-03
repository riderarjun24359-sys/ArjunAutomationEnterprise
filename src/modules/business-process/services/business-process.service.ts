import {
    buildProcessHubLookupMaps,
    buildBpfAuditPayload,
    buildBpfDashboardStats,
    buildBpfPipelineInfo,
    mapAuditEntry,
    buildProcessHubPayload,
    mapProcessHubSummary,
    buildBusinessProcessPayload,
    mapBusinessProcessSummary,
    buildProcessCategoryPayload,
    mapProcessCategorySummary,
    buildProcessVersionPayload,
    mapProcessVersionSummary,
    buildProcessDependencyPayload,
    mapProcessDependencySummary,
    buildProcessModelPayload,
    mapProcessModelSummary,
    buildProcessStepPayload,
    mapProcessStepSummary,
    buildDecisionPointPayload,
    mapDecisionPointSummary,
    buildReusableBlockPayload,
    mapReusableBlockSummary,
    buildApprovalRulePayload,
    mapApprovalRuleSummary,
    buildSequentialApprovalPayload,
    mapSequentialApprovalSummary,
    buildParallelApprovalPayload,
    mapParallelApprovalSummary,
    buildEscalationRulePayload,
    mapEscalationRuleSummary,
    buildTaskAssignmentPayload,
    mapTaskAssignmentSummary,
    buildTaskTemplatePayload,
    mapTaskTemplateSummary,
    buildRecurringTaskPayload,
    mapRecurringTaskSummary,
    buildTaskSlaPolicyPayload,
    mapTaskSlaPolicySummary,
    buildRuleConditionPayload,
    mapRuleConditionSummary,
    buildRuleValidationPayload,
    mapRuleValidationSummary,
    buildRuleCalculationPayload,
    mapRuleCalculationSummary,
    buildReusableRulePayload,
    mapReusableRuleSummary,
    buildProcessExecutionPayload,
    mapProcessExecutionSummary,
    buildExecutionHistoryPayload,
    mapExecutionHistorySummary,
    buildExecutionRetryPayload,
    mapExecutionRetrySummary,
    buildExecutionAnalyticsPayload,
    mapExecutionAnalyticsSummary,
    buildBottleneckReportPayload,
    mapBottleneckReportSummary,
    buildSlaPerformanceMetricPayload,
    mapSlaPerformanceMetricSummary,
    buildProcessMetricPayload,
    mapProcessMetricSummary,
    buildProcessHealthPayload,
    mapProcessHealthSummary,
    buildFailedProcessRecordPayload,
    mapFailedProcessRecordSummary,
    buildProcessFailurePayload,
    mapProcessFailureSummary,
    mapTaskTemplateForStats,
    mapApprovalRuleForStats,
    mapProcessMetricForStats,
    mapProcessExecutionForStats,
    mapFailedProcessRecordForStats,
    mapRuleValidationForStats,
    mapProcessHealthForStats,
    mapProcessFailureForStats,
} from "@/src/modules/database/lib/business-process-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ProcessHubSummary,
    CreateProcessHubInput,
    BusinessProcessSummary,
    CreateBusinessProcessInput,
    ProcessCategorySummary,
    CreateProcessCategoryInput,
    ProcessVersionSummary,
    CreateProcessVersionInput,
    ProcessDependencySummary,
    CreateProcessDependencyInput,
    ProcessModelSummary,
    CreateProcessModelInput,
    ProcessStepSummary,
    CreateProcessStepInput,
    DecisionPointSummary,
    CreateDecisionPointInput,
    ReusableBlockSummary,
    CreateReusableBlockInput,
    ApprovalRuleSummary,
    CreateApprovalRuleInput,
    SequentialApprovalSummary,
    CreateSequentialApprovalInput,
    ParallelApprovalSummary,
    CreateParallelApprovalInput,
    EscalationRuleSummary,
    CreateEscalationRuleInput,
    TaskAssignmentSummary,
    CreateTaskAssignmentInput,
    TaskTemplateSummary,
    CreateTaskTemplateInput,
    RecurringTaskSummary,
    CreateRecurringTaskInput,
    TaskSlaPolicySummary,
    CreateTaskSlaPolicyInput,
    RuleConditionSummary,
    CreateRuleConditionInput,
    RuleValidationSummary,
    CreateRuleValidationInput,
    RuleCalculationSummary,
    CreateRuleCalculationInput,
    ReusableRuleSummary,
    CreateReusableRuleInput,
    ProcessExecutionSummary,
    CreateProcessExecutionInput,
    ExecutionHistorySummary,
    CreateExecutionHistoryInput,
    ExecutionRetrySummary,
    CreateExecutionRetryInput,
    ExecutionAnalyticsSummary,
    CreateExecutionAnalyticsInput,
    BottleneckReportSummary,
    CreateBottleneckReportInput,
    SlaPerformanceMetricSummary,
    CreateSlaPerformanceMetricInput,
    ProcessMetricSummary,
    CreateProcessMetricInput,
    ProcessHealthSummary,
    CreateProcessHealthInput,
    FailedProcessRecordSummary,
    CreateFailedProcessRecordInput,
    ProcessFailureSummary,
    CreateProcessFailureInput,
    AuditEntry,
    BpfDashboardStats,
    BpfPipelineInfo,
    BpfSdkRegisterProcessInput,
    BpfSdkRegisterProcessResult,
    BpfSdkConfigureApprovalInput,
    BpfSdkConfigureApprovalResult,
    BpfSdkRunProcessExecutionInput,
    BpfSdkRunProcessExecutionResult,
} from "@/src/modules/business-process/types";

export class BusinessProcessService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const processHubs = await databaseService.bpfProcessHubs.listByOrganization(organizationId);
        return buildProcessHubLookupMaps(processHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<BpfDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildBpfDashboardStats({ processHubs: [], taskTemplates: [], approvalRules: [], processMetrics: [], processExecutions: [], failedProcessRecords: [], ruleValidations: [], processHealth: [], processFailures: [], auditLogs: [] });
        const [processHubs, taskTemplatesRaw, approvalRulesRaw, processMetricsRaw, processExecutionsRaw, failedProcessRecordsRaw, ruleValidationsRaw, processHealthRaw, processFailures, auditLogs] = await Promise.all([
            this.getProcessHubs(authUserId, email, fullName),
            databaseService.bpfTaskTemplates.listByOrganization(context.organizationId),
            databaseService.bpfApprovalRules.listByOrganization(context.organizationId),
            databaseService.bpfProcessMetrics.listByOrganization(context.organizationId),
            databaseService.bpfProcessExecutions.listByOrganization(context.organizationId),
            databaseService.bpfFailedProcessRecords.listByOrganization(context.organizationId),
            databaseService.bpfRuleValidations.listByOrganization(context.organizationId),
            databaseService.bpfProcessHealth.listByOrganization(context.organizationId),
            this.getProcessFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildBpfDashboardStats({
            processHubs,
            taskTemplates: taskTemplatesRaw.map(mapTaskTemplateForStats),
            approvalRules: approvalRulesRaw.map(mapApprovalRuleForStats),
            processMetrics: processMetricsRaw.map(mapProcessMetricForStats),
            processExecutions: processExecutionsRaw.map(mapProcessExecutionForStats),
            failedProcessRecords: failedProcessRecordsRaw.map(mapFailedProcessRecordForStats),
            ruleValidations: ruleValidationsRaw.map(mapRuleValidationForStats),
            processHealth: processHealthRaw.map(mapProcessHealthForStats),
            processFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): BpfPipelineInfo {
        return buildBpfPipelineInfo();
    }

    async getProcessHubs(authUserId: string, email: string, fullName?: string | null): Promise<ProcessHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.bpfProcessHubs.listByOrganization(context.organizationId)).map((r) => mapProcessHubSummary(r));
    }

    async createProcessHub(authUserId: string, email: string, input: CreateProcessHubInput, fullName?: string | null): Promise<ProcessHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessHubs.create(buildProcessHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processHubs");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_hubs", "create", `ProcessHub created`, created.id));
        return mapProcessHubSummary(created);
    }

    async getBusinessProcesss(authUserId: string, email: string, fullName?: string | null): Promise<BusinessProcessSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfBusinessProcesses.listByOrganization(context.organizationId)).map((r) => mapBusinessProcessSummary(r, maps));
    }

    async createBusinessProcess(authUserId: string, email: string, input: CreateBusinessProcessInput, fullName?: string | null): Promise<BusinessProcessSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfBusinessProcesses.create(buildBusinessProcessPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessProcesses");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "business_processes", "create", `BusinessProcess created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessProcessSummary(created, maps);
    }

    async getProcessCategorys(authUserId: string, email: string, fullName?: string | null): Promise<ProcessCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfProcessCategories.listByOrganization(context.organizationId)).map((r) => mapProcessCategorySummary(r, maps));
    }

    async createProcessCategory(authUserId: string, email: string, input: CreateProcessCategoryInput, fullName?: string | null): Promise<ProcessCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessCategories.create(buildProcessCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processCategories");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_categories", "create", `ProcessCategory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProcessCategorySummary(created, maps);
    }

    async getProcessVersions(authUserId: string, email: string, fullName?: string | null): Promise<ProcessVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfProcessVersions.listByOrganization(context.organizationId)).map((r) => mapProcessVersionSummary(r, maps));
    }

    async createProcessVersion(authUserId: string, email: string, input: CreateProcessVersionInput, fullName?: string | null): Promise<ProcessVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessVersions.create(buildProcessVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processVersions");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_versions", "create", `ProcessVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProcessVersionSummary(created, maps);
    }

    async getProcessDependencys(authUserId: string, email: string, fullName?: string | null): Promise<ProcessDependencySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfProcessDependencies.listByOrganization(context.organizationId)).map((r) => mapProcessDependencySummary(r, maps));
    }

    async createProcessDependency(authUserId: string, email: string, input: CreateProcessDependencyInput, fullName?: string | null): Promise<ProcessDependencySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessDependencies.create(buildProcessDependencyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processDependencies");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_dependencies", "create", `ProcessDependency created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProcessDependencySummary(created, maps);
    }

    async getProcessModels(authUserId: string, email: string, fullName?: string | null): Promise<ProcessModelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfProcessModels.listByOrganization(context.organizationId)).map((r) => mapProcessModelSummary(r, maps));
    }

    async createProcessModel(authUserId: string, email: string, input: CreateProcessModelInput, fullName?: string | null): Promise<ProcessModelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessModels.create(buildProcessModelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processModels");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_models", "create", `ProcessModel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProcessModelSummary(created, maps);
    }

    async getProcessSteps(authUserId: string, email: string, fullName?: string | null): Promise<ProcessStepSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfProcessSteps.listByOrganization(context.organizationId)).map((r) => mapProcessStepSummary(r, maps));
    }

    async createProcessStep(authUserId: string, email: string, input: CreateProcessStepInput, fullName?: string | null): Promise<ProcessStepSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessSteps.create(buildProcessStepPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processSteps");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_steps", "create", `ProcessStep created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProcessStepSummary(created, maps);
    }

    async getDecisionPoints(authUserId: string, email: string, fullName?: string | null): Promise<DecisionPointSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfDecisionPoints.listByOrganization(context.organizationId)).map((r) => mapDecisionPointSummary(r, maps));
    }

    async createDecisionPoint(authUserId: string, email: string, input: CreateDecisionPointInput, fullName?: string | null): Promise<DecisionPointSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfDecisionPoints.create(buildDecisionPointPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create decisionPoints");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "decision_points", "create", `DecisionPoint created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDecisionPointSummary(created, maps);
    }

    async getReusableBlocks(authUserId: string, email: string, fullName?: string | null): Promise<ReusableBlockSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfReusableBlocks.listByOrganization(context.organizationId)).map((r) => mapReusableBlockSummary(r, maps));
    }

    async createReusableBlock(authUserId: string, email: string, input: CreateReusableBlockInput, fullName?: string | null): Promise<ReusableBlockSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfReusableBlocks.create(buildReusableBlockPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reusableBlocks");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "reusable_blocks", "create", `ReusableBlock created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReusableBlockSummary(created, maps);
    }

    async getApprovalRules(authUserId: string, email: string, fullName?: string | null): Promise<ApprovalRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfApprovalRules.listByOrganization(context.organizationId)).map((r) => mapApprovalRuleSummary(r, maps));
    }

    async createApprovalRule(authUserId: string, email: string, input: CreateApprovalRuleInput, fullName?: string | null): Promise<ApprovalRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfApprovalRules.create(buildApprovalRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create approvalRules");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "approval_rules", "create", `ApprovalRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalRuleSummary(created, maps);
    }

    async getSequentialApprovals(authUserId: string, email: string, fullName?: string | null): Promise<SequentialApprovalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfSequentialApprovals.listByOrganization(context.organizationId)).map((r) => mapSequentialApprovalSummary(r, maps));
    }

    async createSequentialApproval(authUserId: string, email: string, input: CreateSequentialApprovalInput, fullName?: string | null): Promise<SequentialApprovalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfSequentialApprovals.create(buildSequentialApprovalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create sequentialApprovals");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "sequential_approvals", "create", `SequentialApproval created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSequentialApprovalSummary(created, maps);
    }

    async getParallelApprovals(authUserId: string, email: string, fullName?: string | null): Promise<ParallelApprovalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfParallelApprovals.listByOrganization(context.organizationId)).map((r) => mapParallelApprovalSummary(r, maps));
    }

    async createParallelApproval(authUserId: string, email: string, input: CreateParallelApprovalInput, fullName?: string | null): Promise<ParallelApprovalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfParallelApprovals.create(buildParallelApprovalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create parallelApprovals");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "parallel_approvals", "create", `ParallelApproval created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapParallelApprovalSummary(created, maps);
    }

    async getEscalationRules(authUserId: string, email: string, fullName?: string | null): Promise<EscalationRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfEscalationRules.listByOrganization(context.organizationId)).map((r) => mapEscalationRuleSummary(r, maps));
    }

    async createEscalationRule(authUserId: string, email: string, input: CreateEscalationRuleInput, fullName?: string | null): Promise<EscalationRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfEscalationRules.create(buildEscalationRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create escalationRules");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "escalation_rules", "create", `EscalationRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEscalationRuleSummary(created, maps);
    }

    async getTaskAssignments(authUserId: string, email: string, fullName?: string | null): Promise<TaskAssignmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfTaskAssignments.listByOrganization(context.organizationId)).map((r) => mapTaskAssignmentSummary(r, maps));
    }

    async createTaskAssignment(authUserId: string, email: string, input: CreateTaskAssignmentInput, fullName?: string | null): Promise<TaskAssignmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfTaskAssignments.create(buildTaskAssignmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create taskAssignments");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "task_assignments", "create", `TaskAssignment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTaskAssignmentSummary(created, maps);
    }

    async getTaskTemplates(authUserId: string, email: string, fullName?: string | null): Promise<TaskTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfTaskTemplates.listByOrganization(context.organizationId)).map((r) => mapTaskTemplateSummary(r, maps));
    }

    async createTaskTemplate(authUserId: string, email: string, input: CreateTaskTemplateInput, fullName?: string | null): Promise<TaskTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfTaskTemplates.create(buildTaskTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create taskTemplates");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "task_templates", "create", `TaskTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTaskTemplateSummary(created, maps);
    }

    async getRecurringTasks(authUserId: string, email: string, fullName?: string | null): Promise<RecurringTaskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfRecurringTasks.listByOrganization(context.organizationId)).map((r) => mapRecurringTaskSummary(r, maps));
    }

    async createRecurringTask(authUserId: string, email: string, input: CreateRecurringTaskInput, fullName?: string | null): Promise<RecurringTaskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfRecurringTasks.create(buildRecurringTaskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recurringTasks");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "recurring_tasks", "create", `RecurringTask created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRecurringTaskSummary(created, maps);
    }

    async getTaskSlaPolicys(authUserId: string, email: string, fullName?: string | null): Promise<TaskSlaPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfTaskSlaPolicies.listByOrganization(context.organizationId)).map((r) => mapTaskSlaPolicySummary(r, maps));
    }

    async createTaskSlaPolicy(authUserId: string, email: string, input: CreateTaskSlaPolicyInput, fullName?: string | null): Promise<TaskSlaPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfTaskSlaPolicies.create(buildTaskSlaPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create taskSlaPolicies");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "task_sla_policies", "create", `TaskSlaPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTaskSlaPolicySummary(created, maps);
    }

    async getRuleConditions(authUserId: string, email: string, fullName?: string | null): Promise<RuleConditionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfRuleConditions.listByOrganization(context.organizationId)).map((r) => mapRuleConditionSummary(r, maps));
    }

    async createRuleCondition(authUserId: string, email: string, input: CreateRuleConditionInput, fullName?: string | null): Promise<RuleConditionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfRuleConditions.create(buildRuleConditionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ruleConditions");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "rule_conditions", "create", `RuleCondition created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRuleConditionSummary(created, maps);
    }

    async getRuleValidations(authUserId: string, email: string, fullName?: string | null): Promise<RuleValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfRuleValidations.listByOrganization(context.organizationId)).map((r) => mapRuleValidationSummary(r, maps));
    }

    async createRuleValidation(authUserId: string, email: string, input: CreateRuleValidationInput, fullName?: string | null): Promise<RuleValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfRuleValidations.create(buildRuleValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ruleValidations");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "rule_validations", "create", `RuleValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRuleValidationSummary(created, maps);
    }

    async getRuleCalculations(authUserId: string, email: string, fullName?: string | null): Promise<RuleCalculationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfRuleCalculations.listByOrganization(context.organizationId)).map((r) => mapRuleCalculationSummary(r, maps));
    }

    async createRuleCalculation(authUserId: string, email: string, input: CreateRuleCalculationInput, fullName?: string | null): Promise<RuleCalculationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfRuleCalculations.create(buildRuleCalculationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ruleCalculations");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "rule_calculations", "create", `RuleCalculation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRuleCalculationSummary(created, maps);
    }

    async getReusableRules(authUserId: string, email: string, fullName?: string | null): Promise<ReusableRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfReusableRules.listByOrganization(context.organizationId)).map((r) => mapReusableRuleSummary(r, maps));
    }

    async createReusableRule(authUserId: string, email: string, input: CreateReusableRuleInput, fullName?: string | null): Promise<ReusableRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfReusableRules.create(buildReusableRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reusableRules");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "reusable_rules", "create", `ReusableRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReusableRuleSummary(created, maps);
    }

    async getProcessExecutions(authUserId: string, email: string, fullName?: string | null): Promise<ProcessExecutionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfProcessExecutions.listByOrganization(context.organizationId)).map((r) => mapProcessExecutionSummary(r, maps));
    }

    async createProcessExecution(authUserId: string, email: string, input: CreateProcessExecutionInput, fullName?: string | null): Promise<ProcessExecutionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessExecutions.create(buildProcessExecutionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processExecutions");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_executions", "create", `ProcessExecution created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProcessExecutionSummary(created, maps);
    }

    async getExecutionHistorys(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfExecutionHistory.listByOrganization(context.organizationId)).map((r) => mapExecutionHistorySummary(r, maps));
    }

    async createExecutionHistory(authUserId: string, email: string, input: CreateExecutionHistoryInput, fullName?: string | null): Promise<ExecutionHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfExecutionHistory.create(buildExecutionHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionHistory");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "execution_history", "create", `ExecutionHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionHistorySummary(created, maps);
    }

    async getExecutionRetrys(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionRetrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfExecutionRetries.listByOrganization(context.organizationId)).map((r) => mapExecutionRetrySummary(r, maps));
    }

    async createExecutionRetry(authUserId: string, email: string, input: CreateExecutionRetryInput, fullName?: string | null): Promise<ExecutionRetrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfExecutionRetries.create(buildExecutionRetryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionRetries");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "execution_retries", "create", `ExecutionRetry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionRetrySummary(created, maps);
    }

    async getExecutionAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfExecutionAnalytics.listByOrganization(context.organizationId)).map((r) => mapExecutionAnalyticsSummary(r, maps));
    }

    async createExecutionAnalytics(authUserId: string, email: string, input: CreateExecutionAnalyticsInput, fullName?: string | null): Promise<ExecutionAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfExecutionAnalytics.create(buildExecutionAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionAnalytics");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "execution_analytics", "create", `ExecutionAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionAnalyticsSummary(created, maps);
    }

    async getBottleneckReports(authUserId: string, email: string, fullName?: string | null): Promise<BottleneckReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfBottleneckReports.listByOrganization(context.organizationId)).map((r) => mapBottleneckReportSummary(r, maps));
    }

    async createBottleneckReport(authUserId: string, email: string, input: CreateBottleneckReportInput, fullName?: string | null): Promise<BottleneckReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfBottleneckReports.create(buildBottleneckReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create bottleneckReports");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "bottleneck_reports", "create", `BottleneckReport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBottleneckReportSummary(created, maps);
    }

    async getSlaPerformanceMetrics(authUserId: string, email: string, fullName?: string | null): Promise<SlaPerformanceMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfSlaPerformanceMetrics.listByOrganization(context.organizationId)).map((r) => mapSlaPerformanceMetricSummary(r, maps));
    }

    async createSlaPerformanceMetric(authUserId: string, email: string, input: CreateSlaPerformanceMetricInput, fullName?: string | null): Promise<SlaPerformanceMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfSlaPerformanceMetrics.create(buildSlaPerformanceMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create slaPerformanceMetrics");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "sla_performance_metrics", "create", `SlaPerformanceMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSlaPerformanceMetricSummary(created, maps);
    }

    async getProcessMetrics(authUserId: string, email: string, fullName?: string | null): Promise<ProcessMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.bpfProcessMetrics.listByOrganization(context.organizationId)).map(mapProcessMetricSummary);
    }

    async createProcessMetric(authUserId: string, email: string, input: CreateProcessMetricInput, fullName?: string | null): Promise<ProcessMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessMetrics.create(buildProcessMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processMetrics");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_metrics", "create", `ProcessMetric created`, created.id));
        return mapProcessMetricSummary(created);
    }

    async getProcessHealths(authUserId: string, email: string, fullName?: string | null): Promise<ProcessHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.bpfProcessHealth.listByOrganization(context.organizationId)).map(mapProcessHealthSummary);
    }

    async createProcessHealth(authUserId: string, email: string, input: CreateProcessHealthInput, fullName?: string | null): Promise<ProcessHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessHealth.create(buildProcessHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processHealth");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_health", "create", `ProcessHealth created`, created.id));
        return mapProcessHealthSummary(created);
    }

    async getFailedProcessRecords(authUserId: string, email: string, fullName?: string | null): Promise<FailedProcessRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfFailedProcessRecords.listByOrganization(context.organizationId)).map((r) => mapFailedProcessRecordSummary(r, maps));
    }

    async createFailedProcessRecord(authUserId: string, email: string, input: CreateFailedProcessRecordInput, fullName?: string | null): Promise<FailedProcessRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfFailedProcessRecords.create(buildFailedProcessRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create failedProcessRecords");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "failed_process_records", "create", `FailedProcessRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFailedProcessRecordSummary(created, maps);
    }

    async getProcessFailures(authUserId: string, email: string, fullName?: string | null): Promise<ProcessFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.bpfProcessFailures.listByOrganization(context.organizationId)).map((r) => mapProcessFailureSummary(r, maps));
    }

    async createProcessFailure(authUserId: string, email: string, input: CreateProcessFailureInput, fullName?: string | null): Promise<ProcessFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.bpfProcessFailures.create(buildProcessFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create processFailures");
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "process_failures", "create", `ProcessFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProcessFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.bpfAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getProcessHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.bpfProcessHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterProcess(authUserId: string, email: string, input: BpfSdkRegisterProcessInput, fullName?: string | null): Promise<BpfSdkRegisterProcessResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_process", moduleSource: "business_process", inputPayload: { ...input } });
        const created = await this.createBusinessProcess(authUserId, email, { processHubId: input.processHubId, processKey: input.processKey, processName: input.processName }, fullName);
        return { processId: created.id, processKey: created.processKey, status: created.status };
    }

    async sdkConfigureApproval(authUserId: string, email: string, input: BpfSdkConfigureApprovalInput, fullName?: string | null): Promise<BpfSdkConfigureApprovalResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "approval", limit: 3 });
        const created = await this.createApprovalRule(authUserId, email, { processHubId: input.processHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunProcessExecution(authUserId: string, email: string, input: BpfSdkRunProcessExecutionInput, fullName?: string | null): Promise<BpfSdkRunProcessExecutionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_process_execution", moduleSource: "business_process", inputPayload: { ...input } });
        const created = await this.createProcessExecution(authUserId, email, { processHubId: input.processHubId, executionKey: input.executionKey, executionName: input.executionName }, fullName);
        return { executionId: created.id, executionKey: created.executionKey, status: created.status };
    }
}

export const businessProcessService = new BusinessProcessService();
