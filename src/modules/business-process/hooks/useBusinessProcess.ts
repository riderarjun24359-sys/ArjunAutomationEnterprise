"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { businessProcessService } from "@/src/modules/business-process/services/business-process.service";
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
} from "@/src/modules/business-process/types";

export function useBusinessProcess() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<BpfDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<BpfPipelineInfo | null>(null);
    const [processHubs, setProcessHubs] = useState<ProcessHubSummary[]>([]);
    const [businessProcesses, setBusinessProcesss] = useState<BusinessProcessSummary[]>([]);
    const [processCategories, setProcessCategorys] = useState<ProcessCategorySummary[]>([]);
    const [processVersions, setProcessVersions] = useState<ProcessVersionSummary[]>([]);
    const [processDependencies, setProcessDependencys] = useState<ProcessDependencySummary[]>([]);
    const [processModels, setProcessModels] = useState<ProcessModelSummary[]>([]);
    const [processSteps, setProcessSteps] = useState<ProcessStepSummary[]>([]);
    const [decisionPoints, setDecisionPoints] = useState<DecisionPointSummary[]>([]);
    const [reusableBlocks, setReusableBlocks] = useState<ReusableBlockSummary[]>([]);
    const [approvalRules, setApprovalRules] = useState<ApprovalRuleSummary[]>([]);
    const [sequentialApprovals, setSequentialApprovals] = useState<SequentialApprovalSummary[]>([]);
    const [parallelApprovals, setParallelApprovals] = useState<ParallelApprovalSummary[]>([]);
    const [escalationRules, setEscalationRules] = useState<EscalationRuleSummary[]>([]);
    const [taskAssignments, setTaskAssignments] = useState<TaskAssignmentSummary[]>([]);
    const [taskTemplates, setTaskTemplates] = useState<TaskTemplateSummary[]>([]);
    const [recurringTasks, setRecurringTasks] = useState<RecurringTaskSummary[]>([]);
    const [taskSlaPolicies, setTaskSlaPolicys] = useState<TaskSlaPolicySummary[]>([]);
    const [ruleConditions, setRuleConditions] = useState<RuleConditionSummary[]>([]);
    const [ruleValidations, setRuleValidations] = useState<RuleValidationSummary[]>([]);
    const [ruleCalculations, setRuleCalculations] = useState<RuleCalculationSummary[]>([]);
    const [reusableRules, setReusableRules] = useState<ReusableRuleSummary[]>([]);
    const [processExecutions, setProcessExecutions] = useState<ProcessExecutionSummary[]>([]);
    const [executionHistory, setExecutionHistorys] = useState<ExecutionHistorySummary[]>([]);
    const [executionRetries, setExecutionRetrys] = useState<ExecutionRetrySummary[]>([]);
    const [executionAnalytics, setExecutionAnalyticss] = useState<ExecutionAnalyticsSummary[]>([]);
    const [bottleneckReports, setBottleneckReports] = useState<BottleneckReportSummary[]>([]);
    const [slaPerformanceMetrics, setSlaPerformanceMetrics] = useState<SlaPerformanceMetricSummary[]>([]);
    const [processMetrics, setProcessMetrics] = useState<ProcessMetricSummary[]>([]);
    const [processHealth, setProcessHealths] = useState<ProcessHealthSummary[]>([]);
    const [failedProcessRecords, setFailedProcessRecords] = useState<FailedProcessRecordSummary[]>([]);
    const [processFailures, setProcessFailures] = useState<ProcessFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [processHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
processHubsList,
            businessProcessesList,
            processCategoriesList,
            processVersionsList,
            processDependenciesList,
            processModelsList,
            processStepsList,
            decisionPointsList,
            reusableBlocksList,
            approvalRulesList,
            sequentialApprovalsList,
            parallelApprovalsList,
            escalationRulesList,
            taskAssignmentsList,
            taskTemplatesList,
            recurringTasksList,
            taskSlaPoliciesList,
            ruleConditionsList,
            ruleValidationsList,
            ruleCalculationsList,
            reusableRulesList,
            processExecutionsList,
            executionHistoryList,
            executionRetriesList,
            executionAnalyticsList,
            bottleneckReportsList,
            slaPerformanceMetricsList,
            processMetricsList,
            processHealthList,
            failedProcessRecordsList,
            processFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            businessProcessService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(businessProcessService.getPipelineInfo()),
            businessProcessService.getProcessHubs(authUserId, email, fullName),
            businessProcessService.getBusinessProcesss(authUserId, email, fullName),
            businessProcessService.getProcessCategorys(authUserId, email, fullName),
            businessProcessService.getProcessVersions(authUserId, email, fullName),
            businessProcessService.getProcessDependencys(authUserId, email, fullName),
            businessProcessService.getProcessModels(authUserId, email, fullName),
            businessProcessService.getProcessSteps(authUserId, email, fullName),
            businessProcessService.getDecisionPoints(authUserId, email, fullName),
            businessProcessService.getReusableBlocks(authUserId, email, fullName),
            businessProcessService.getApprovalRules(authUserId, email, fullName),
            businessProcessService.getSequentialApprovals(authUserId, email, fullName),
            businessProcessService.getParallelApprovals(authUserId, email, fullName),
            businessProcessService.getEscalationRules(authUserId, email, fullName),
            businessProcessService.getTaskAssignments(authUserId, email, fullName),
            businessProcessService.getTaskTemplates(authUserId, email, fullName),
            businessProcessService.getRecurringTasks(authUserId, email, fullName),
            businessProcessService.getTaskSlaPolicys(authUserId, email, fullName),
            businessProcessService.getRuleConditions(authUserId, email, fullName),
            businessProcessService.getRuleValidations(authUserId, email, fullName),
            businessProcessService.getRuleCalculations(authUserId, email, fullName),
            businessProcessService.getReusableRules(authUserId, email, fullName),
            businessProcessService.getProcessExecutions(authUserId, email, fullName),
            businessProcessService.getExecutionHistorys(authUserId, email, fullName),
            businessProcessService.getExecutionRetrys(authUserId, email, fullName),
            businessProcessService.getExecutionAnalyticss(authUserId, email, fullName),
            businessProcessService.getBottleneckReports(authUserId, email, fullName),
            businessProcessService.getSlaPerformanceMetrics(authUserId, email, fullName),
            businessProcessService.getProcessMetrics(authUserId, email, fullName),
            businessProcessService.getProcessHealths(authUserId, email, fullName),
            businessProcessService.getFailedProcessRecords(authUserId, email, fullName),
            businessProcessService.getProcessFailures(authUserId, email, fullName),
            businessProcessService.getAuditLogs(authUserId, email, fullName),
            businessProcessService.getProcessHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
processHubsList,
            businessProcessesList,
            processCategoriesList,
            processVersionsList,
            processDependenciesList,
            processModelsList,
            processStepsList,
            decisionPointsList,
            reusableBlocksList,
            approvalRulesList,
            sequentialApprovalsList,
            parallelApprovalsList,
            escalationRulesList,
            taskAssignmentsList,
            taskTemplatesList,
            recurringTasksList,
            taskSlaPoliciesList,
            ruleConditionsList,
            ruleValidationsList,
            ruleCalculationsList,
            reusableRulesList,
            processExecutionsList,
            executionHistoryList,
            executionRetriesList,
            executionAnalyticsList,
            bottleneckReportsList,
            slaPerformanceMetricsList,
            processMetricsList,
            processHealthList,
            failedProcessRecordsList,
            processFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setProcessHubs(result.processHubsList);
        setBusinessProcesss(result.businessProcessesList);
        setProcessCategorys(result.processCategoriesList);
        setProcessVersions(result.processVersionsList);
        setProcessDependencys(result.processDependenciesList);
        setProcessModels(result.processModelsList);
        setProcessSteps(result.processStepsList);
        setDecisionPoints(result.decisionPointsList);
        setReusableBlocks(result.reusableBlocksList);
        setApprovalRules(result.approvalRulesList);
        setSequentialApprovals(result.sequentialApprovalsList);
        setParallelApprovals(result.parallelApprovalsList);
        setEscalationRules(result.escalationRulesList);
        setTaskAssignments(result.taskAssignmentsList);
        setTaskTemplates(result.taskTemplatesList);
        setRecurringTasks(result.recurringTasksList);
        setTaskSlaPolicys(result.taskSlaPoliciesList);
        setRuleConditions(result.ruleConditionsList);
        setRuleValidations(result.ruleValidationsList);
        setRuleCalculations(result.ruleCalculationsList);
        setReusableRules(result.reusableRulesList);
        setProcessExecutions(result.processExecutionsList);
        setExecutionHistorys(result.executionHistoryList);
        setExecutionRetrys(result.executionRetriesList);
        setExecutionAnalyticss(result.executionAnalyticsList);
        setBottleneckReports(result.bottleneckReportsList);
        setSlaPerformanceMetrics(result.slaPerformanceMetricsList);
        setProcessMetrics(result.processMetricsList);
        setProcessHealths(result.processHealthList);
        setFailedProcessRecords(result.failedProcessRecordsList);
        setProcessFailures(result.processFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createProcessHub = useCallback(async (input: CreateProcessHubInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessProcess = useCallback(async (input: CreateBusinessProcessInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createBusinessProcess(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessCategory = useCallback(async (input: CreateProcessCategoryInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessCategory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessVersion = useCallback(async (input: CreateProcessVersionInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessDependency = useCallback(async (input: CreateProcessDependencyInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessDependency(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessModel = useCallback(async (input: CreateProcessModelInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessModel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessStep = useCallback(async (input: CreateProcessStepInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessStep(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDecisionPoint = useCallback(async (input: CreateDecisionPointInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createDecisionPoint(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReusableBlock = useCallback(async (input: CreateReusableBlockInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createReusableBlock(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApprovalRule = useCallback(async (input: CreateApprovalRuleInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createApprovalRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSequentialApproval = useCallback(async (input: CreateSequentialApprovalInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createSequentialApproval(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createParallelApproval = useCallback(async (input: CreateParallelApprovalInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createParallelApproval(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEscalationRule = useCallback(async (input: CreateEscalationRuleInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createEscalationRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTaskAssignment = useCallback(async (input: CreateTaskAssignmentInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createTaskAssignment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTaskTemplate = useCallback(async (input: CreateTaskTemplateInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createTaskTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRecurringTask = useCallback(async (input: CreateRecurringTaskInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createRecurringTask(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTaskSlaPolicy = useCallback(async (input: CreateTaskSlaPolicyInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createTaskSlaPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRuleCondition = useCallback(async (input: CreateRuleConditionInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createRuleCondition(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRuleValidation = useCallback(async (input: CreateRuleValidationInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createRuleValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRuleCalculation = useCallback(async (input: CreateRuleCalculationInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createRuleCalculation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReusableRule = useCallback(async (input: CreateReusableRuleInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createReusableRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessExecution = useCallback(async (input: CreateProcessExecutionInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessExecution(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionHistory = useCallback(async (input: CreateExecutionHistoryInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createExecutionHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionRetry = useCallback(async (input: CreateExecutionRetryInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createExecutionRetry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionAnalytics = useCallback(async (input: CreateExecutionAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createExecutionAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBottleneckReport = useCallback(async (input: CreateBottleneckReportInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createBottleneckReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSlaPerformanceMetric = useCallback(async (input: CreateSlaPerformanceMetricInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createSlaPerformanceMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessMetric = useCallback(async (input: CreateProcessMetricInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessHealth = useCallback(async (input: CreateProcessHealthInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFailedProcessRecord = useCallback(async (input: CreateFailedProcessRecordInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createFailedProcessRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessFailure = useCallback(async (input: CreateProcessFailureInput) => { if (!user) throw new Error("Authentication required"); await businessProcessService.createProcessFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        processHubs,
        createProcessHub,
        businessProcesses,
        createBusinessProcess,
        processCategories,
        createProcessCategory,
        processVersions,
        createProcessVersion,
        processDependencies,
        createProcessDependency,
        processModels,
        createProcessModel,
        processSteps,
        createProcessStep,
        decisionPoints,
        createDecisionPoint,
        reusableBlocks,
        createReusableBlock,
        approvalRules,
        createApprovalRule,
        sequentialApprovals,
        createSequentialApproval,
        parallelApprovals,
        createParallelApproval,
        escalationRules,
        createEscalationRule,
        taskAssignments,
        createTaskAssignment,
        taskTemplates,
        createTaskTemplate,
        recurringTasks,
        createRecurringTask,
        taskSlaPolicies,
        createTaskSlaPolicy,
        ruleConditions,
        createRuleCondition,
        ruleValidations,
        createRuleValidation,
        ruleCalculations,
        createRuleCalculation,
        reusableRules,
        createReusableRule,
        processExecutions,
        createProcessExecution,
        executionHistory,
        createExecutionHistory,
        executionRetries,
        createExecutionRetry,
        executionAnalytics,
        createExecutionAnalytics,
        bottleneckReports,
        createBottleneckReport,
        slaPerformanceMetrics,
        createSlaPerformanceMetric,
        processMetrics,
        createProcessMetric,
        processHealth,
        createProcessHealth,
        failedProcessRecords,
        createFailedProcessRecord,
        processFailures,
        createProcessFailure,
        auditLogs,
        processHubOptions,
        refresh,
    };
}
