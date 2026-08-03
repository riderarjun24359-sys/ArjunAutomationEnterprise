#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("BpfProcessHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/industry-framework-repositories\";";
    const ifrImportEnd = da.indexOf(anchor) + anchor.length;
    const bpfImport = `
import {
    BpfProcessHubRepository,
    BpfBusinessProcessRepository,
    BpfProcessCategoryRepository,
    BpfProcessVersionRepository,
    BpfProcessDependencyRepository,
    BpfProcessModelRepository,
    BpfProcessStepRepository,
    BpfDecisionPointRepository,
    BpfReusableBlockRepository,
    BpfApprovalRuleRepository,
    BpfSequentialApprovalRepository,
    BpfParallelApprovalRepository,
    BpfEscalationRuleRepository,
    BpfTaskAssignmentRepository,
    BpfTaskTemplateRepository,
    BpfRecurringTaskRepository,
    BpfTaskSlaPolicyRepository,
    BpfRuleConditionRepository,
    BpfRuleValidationRepository,
    BpfRuleCalculationRepository,
    BpfReusableRuleRepository,
    BpfProcessExecutionRepository,
    BpfExecutionHistoryRepository,
    BpfExecutionRetryRepository,
    BpfExecutionAnalyticsRepository,
    BpfBottleneckReportRepository,
    BpfSlaPerformanceMetricRepository,
    BpfProcessMetricRepository,
    BpfProcessHealthRepository,
    BpfFailedProcessRecordRepository,
    BpfProcessFailureRepository,
    BpfAuditLogRepository,
} from "@/src/modules/database/repositories/business-process-repositories";
`;
    da = da.slice(0, ifrImportEnd) + bpfImport + da.slice(ifrImportEnd);

    const ifrProp = "    readonly ifrAuditLogs: IfrAuditLogRepository;";
    const bpfProps = `    readonly bpfProcessHubs: BpfProcessHubRepository;
    readonly bpfBusinessProcesses: BpfBusinessProcessRepository;
    readonly bpfProcessCategories: BpfProcessCategoryRepository;
    readonly bpfProcessVersions: BpfProcessVersionRepository;
    readonly bpfProcessDependencies: BpfProcessDependencyRepository;
    readonly bpfProcessModels: BpfProcessModelRepository;
    readonly bpfProcessSteps: BpfProcessStepRepository;
    readonly bpfDecisionPoints: BpfDecisionPointRepository;
    readonly bpfReusableBlocks: BpfReusableBlockRepository;
    readonly bpfApprovalRules: BpfApprovalRuleRepository;
    readonly bpfSequentialApprovals: BpfSequentialApprovalRepository;
    readonly bpfParallelApprovals: BpfParallelApprovalRepository;
    readonly bpfEscalationRules: BpfEscalationRuleRepository;
    readonly bpfTaskAssignments: BpfTaskAssignmentRepository;
    readonly bpfTaskTemplates: BpfTaskTemplateRepository;
    readonly bpfRecurringTasks: BpfRecurringTaskRepository;
    readonly bpfTaskSlaPolicies: BpfTaskSlaPolicyRepository;
    readonly bpfRuleConditions: BpfRuleConditionRepository;
    readonly bpfRuleValidations: BpfRuleValidationRepository;
    readonly bpfRuleCalculations: BpfRuleCalculationRepository;
    readonly bpfReusableRules: BpfReusableRuleRepository;
    readonly bpfProcessExecutions: BpfProcessExecutionRepository;
    readonly bpfExecutionHistory: BpfExecutionHistoryRepository;
    readonly bpfExecutionRetries: BpfExecutionRetryRepository;
    readonly bpfExecutionAnalytics: BpfExecutionAnalyticsRepository;
    readonly bpfBottleneckReports: BpfBottleneckReportRepository;
    readonly bpfSlaPerformanceMetrics: BpfSlaPerformanceMetricRepository;
    readonly bpfProcessMetrics: BpfProcessMetricRepository;
    readonly bpfProcessHealth: BpfProcessHealthRepository;
    readonly bpfFailedProcessRecords: BpfFailedProcessRecordRepository;
    readonly bpfProcessFailures: BpfProcessFailureRepository;
    readonly bpfAuditLogs: BpfAuditLogRepository;`;
    da = da.replace(ifrProp, ifrProp + "\n" + bpfProps);

    const ifrCtor = "        this.ifrAuditLogs = new IfrAuditLogRepository();";
    const bpfCtor = `        this.bpfProcessHubs = new BpfProcessHubRepository();
        this.bpfBusinessProcesses = new BpfBusinessProcessRepository();
        this.bpfProcessCategories = new BpfProcessCategoryRepository();
        this.bpfProcessVersions = new BpfProcessVersionRepository();
        this.bpfProcessDependencies = new BpfProcessDependencyRepository();
        this.bpfProcessModels = new BpfProcessModelRepository();
        this.bpfProcessSteps = new BpfProcessStepRepository();
        this.bpfDecisionPoints = new BpfDecisionPointRepository();
        this.bpfReusableBlocks = new BpfReusableBlockRepository();
        this.bpfApprovalRules = new BpfApprovalRuleRepository();
        this.bpfSequentialApprovals = new BpfSequentialApprovalRepository();
        this.bpfParallelApprovals = new BpfParallelApprovalRepository();
        this.bpfEscalationRules = new BpfEscalationRuleRepository();
        this.bpfTaskAssignments = new BpfTaskAssignmentRepository();
        this.bpfTaskTemplates = new BpfTaskTemplateRepository();
        this.bpfRecurringTasks = new BpfRecurringTaskRepository();
        this.bpfTaskSlaPolicies = new BpfTaskSlaPolicyRepository();
        this.bpfRuleConditions = new BpfRuleConditionRepository();
        this.bpfRuleValidations = new BpfRuleValidationRepository();
        this.bpfRuleCalculations = new BpfRuleCalculationRepository();
        this.bpfReusableRules = new BpfReusableRuleRepository();
        this.bpfProcessExecutions = new BpfProcessExecutionRepository();
        this.bpfExecutionHistory = new BpfExecutionHistoryRepository();
        this.bpfExecutionRetries = new BpfExecutionRetryRepository();
        this.bpfExecutionAnalytics = new BpfExecutionAnalyticsRepository();
        this.bpfBottleneckReports = new BpfBottleneckReportRepository();
        this.bpfSlaPerformanceMetrics = new BpfSlaPerformanceMetricRepository();
        this.bpfProcessMetrics = new BpfProcessMetricRepository();
        this.bpfProcessHealth = new BpfProcessHealthRepository();
        this.bpfFailedProcessRecords = new BpfFailedProcessRecordRepository();
        this.bpfProcessFailures = new BpfProcessFailureRepository();
        this.bpfAuditLogs = new BpfAuditLogRepository();`;
    da = da.replace(ifrCtor, ifrCtor + "\n" + bpfCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("bpfProcessHubs")) {
    ds = ds.replace(
        "    ifrAuditLogs: databaseAccess.ifrAuditLogs,",
        `    ifrAuditLogs: databaseAccess.ifrAuditLogs,
    bpfProcessHubs: databaseAccess.bpfProcessHubs,
    bpfBusinessProcesses: databaseAccess.bpfBusinessProcesses,
    bpfProcessCategories: databaseAccess.bpfProcessCategories,
    bpfProcessVersions: databaseAccess.bpfProcessVersions,
    bpfProcessDependencies: databaseAccess.bpfProcessDependencies,
    bpfProcessModels: databaseAccess.bpfProcessModels,
    bpfProcessSteps: databaseAccess.bpfProcessSteps,
    bpfDecisionPoints: databaseAccess.bpfDecisionPoints,
    bpfReusableBlocks: databaseAccess.bpfReusableBlocks,
    bpfApprovalRules: databaseAccess.bpfApprovalRules,
    bpfSequentialApprovals: databaseAccess.bpfSequentialApprovals,
    bpfParallelApprovals: databaseAccess.bpfParallelApprovals,
    bpfEscalationRules: databaseAccess.bpfEscalationRules,
    bpfTaskAssignments: databaseAccess.bpfTaskAssignments,
    bpfTaskTemplates: databaseAccess.bpfTaskTemplates,
    bpfRecurringTasks: databaseAccess.bpfRecurringTasks,
    bpfTaskSlaPolicies: databaseAccess.bpfTaskSlaPolicies,
    bpfRuleConditions: databaseAccess.bpfRuleConditions,
    bpfRuleValidations: databaseAccess.bpfRuleValidations,
    bpfRuleCalculations: databaseAccess.bpfRuleCalculations,
    bpfReusableRules: databaseAccess.bpfReusableRules,
    bpfProcessExecutions: databaseAccess.bpfProcessExecutions,
    bpfExecutionHistory: databaseAccess.bpfExecutionHistory,
    bpfExecutionRetries: databaseAccess.bpfExecutionRetries,
    bpfExecutionAnalytics: databaseAccess.bpfExecutionAnalytics,
    bpfBottleneckReports: databaseAccess.bpfBottleneckReports,
    bpfSlaPerformanceMetrics: databaseAccess.bpfSlaPerformanceMetrics,
    bpfProcessMetrics: databaseAccess.bpfProcessMetrics,
    bpfProcessHealth: databaseAccess.bpfProcessHealth,
    bpfFailedProcessRecords: databaseAccess.bpfFailedProcessRecords,
    bpfProcessFailures: databaseAccess.bpfProcessFailures,
    bpfAuditLogs: databaseAccess.bpfAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for BPF");
