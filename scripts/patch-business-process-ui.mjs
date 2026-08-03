#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-industry-framework-ui.mjs");
const outPath = join(root, "scripts/generate-business-process-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
    { tab: "processHubs", plural: "processHubs", singular: "ProcessHub", pascal: "ProcessHub", db: "bpfProcessHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "businessProcesses", plural: "businessProcesses", singular: "BusinessProcess", pascal: "BusinessProcess", db: "bpfBusinessProcesses", fields: [{ name: "processKey", type: "string" }, { name: "processName", type: "string" }, { name: "processType", type: "string" }], display: { title: "processName", sub: "processType" } },
    { tab: "processCategories", plural: "processCategories", singular: "ProcessCategory", pascal: "ProcessCategory", db: "bpfProcessCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "processVersions", plural: "processVersions", singular: "ProcessVersion", pascal: "ProcessVersion", db: "bpfProcessVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "processDependencies", plural: "processDependencies", singular: "ProcessDependency", pascal: "ProcessDependency", db: "bpfProcessDependencies", fields: [{ name: "dependencyKey", type: "string" }, { name: "dependencyType", type: "string" }, { name: "dependencyRef", type: "string" }], display: { title: "dependencyKey", sub: "dependencyType" } },
    { tab: "processModels", plural: "processModels", singular: "ProcessModel", pascal: "ProcessModel", db: "bpfProcessModels", fields: [{ name: "modelKey", type: "string" }, { name: "modelName", type: "string" }, { name: "modelType", type: "string" }], display: { title: "modelName", sub: "modelType" } },
    { tab: "processSteps", plural: "processSteps", singular: "ProcessStep", pascal: "ProcessStep", db: "bpfProcessSteps", fields: [{ name: "stepKey", type: "string" }, { name: "stepName", type: "string" }, { name: "stepOrder", type: "number" }], display: { title: "stepName", sub: "stepOrder" } },
    { tab: "decisionPoints", plural: "decisionPoints", singular: "DecisionPoint", pascal: "DecisionPoint", db: "bpfDecisionPoints", fields: [{ name: "decisionKey", type: "string" }, { name: "decisionName", type: "string" }, { name: "decisionType", type: "string" }], display: { title: "decisionName", sub: "decisionType" } },
    { tab: "reusableBlocks", plural: "reusableBlocks", singular: "ReusableBlock", pascal: "ReusableBlock", db: "bpfReusableBlocks", fields: [{ name: "blockKey", type: "string" }, { name: "blockName", type: "string" }, { name: "blockType", type: "string" }], display: { title: "blockName", sub: "blockType" } },
    { tab: "approvalRules", plural: "approvalRules", singular: "ApprovalRule", pascal: "ApprovalRule", db: "bpfApprovalRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" } },
    { tab: "sequentialApprovals", plural: "sequentialApprovals", singular: "SequentialApproval", pascal: "SequentialApproval", db: "bpfSequentialApprovals", fields: [{ name: "approvalKey", type: "string" }, { name: "approvalName", type: "string" }, { name: "approvalOrder", type: "number" }], display: { title: "approvalName", sub: "approvalOrder" } },
    { tab: "parallelApprovals", plural: "parallelApprovals", singular: "ParallelApproval", pascal: "ParallelApproval", db: "bpfParallelApprovals", fields: [{ name: "approvalKey", type: "string" }, { name: "approvalName", type: "string" }, { name: "approverCount", type: "number" }], display: { title: "approvalName", sub: "approverCount" } },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: "bpfEscalationRules", fields: [{ name: "escalationKey", type: "string" }, { name: "escalationName", type: "string" }, { name: "escalationLevel", type: "number" }], display: { title: "escalationName", sub: "escalationLevel" } },
    { tab: "taskAssignments", plural: "taskAssignments", singular: "TaskAssignment", pascal: "TaskAssignment", db: "bpfTaskAssignments", fields: [{ name: "assignmentKey", type: "string" }, { name: "assignmentName", type: "string" }, { name: "assigneeRef", type: "string" }], display: { title: "assignmentName", sub: "assigneeRef" } },
    { tab: "taskTemplates", plural: "taskTemplates", singular: "TaskTemplate", pascal: "TaskTemplate", db: "bpfTaskTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateType", type: "string" }], display: { title: "templateName", sub: "templateType" } },
    { tab: "recurringTasks", plural: "recurringTasks", singular: "RecurringTask", pascal: "RecurringTask", db: "bpfRecurringTasks", fields: [{ name: "taskKey", type: "string" }, { name: "taskName", type: "string" }, { name: "recurrencePattern", type: "string" }], display: { title: "taskName", sub: "recurrencePattern" } },
    { tab: "taskSlaPolicies", plural: "taskSlaPolicies", singular: "TaskSlaPolicy", pascal: "TaskSlaPolicy", db: "bpfTaskSlaPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "slaHours", type: "number" }], display: { title: "policyName", sub: "slaHours" } },
    { tab: "ruleConditions", plural: "ruleConditions", singular: "RuleCondition", pascal: "RuleCondition", db: "bpfRuleConditions", fields: [{ name: "conditionKey", type: "string" }, { name: "conditionName", type: "string" }, { name: "conditionType", type: "string" }], display: { title: "conditionName", sub: "conditionType" } },
    { tab: "ruleValidations", plural: "ruleValidations", singular: "RuleValidation", pascal: "RuleValidation", db: "bpfRuleValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationName", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationName", sub: "validationScore" } },
    { tab: "ruleCalculations", plural: "ruleCalculations", singular: "RuleCalculation", pascal: "RuleCalculation", db: "bpfRuleCalculations", fields: [{ name: "calculationKey", type: "string" }, { name: "calculationName", type: "string" }, { name: "calculationType", type: "string" }], display: { title: "calculationName", sub: "calculationType" } },
    { tab: "reusableRules", plural: "reusableRules", singular: "ReusableRule", pascal: "ReusableRule", db: "bpfReusableRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" } },
    { tab: "processExecutions", plural: "processExecutions", singular: "ProcessExecution", pascal: "ProcessExecution", db: "bpfProcessExecutions", fields: [{ name: "executionKey", type: "string" }, { name: "executionName", type: "string" }, { name: "executionStatus", type: "string" }], display: { title: "executionName", sub: "executionStatus" } },
    { tab: "executionHistory", plural: "executionHistory", singular: "ExecutionHistory", pascal: "ExecutionHistory", db: "bpfExecutionHistory", fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "historySummary", type: "string" }], display: { title: "historyKey", sub: "historyType" } },
    { tab: "executionRetries", plural: "executionRetries", singular: "ExecutionRetry", pascal: "ExecutionRetry", db: "bpfExecutionRetries", fields: [{ name: "retryKey", type: "string" }, { name: "retryCount", type: "number" }, { name: "retryReason", type: "string" }], display: { title: "retryKey", sub: "retryCount" } },
    { tab: "executionAnalytics", plural: "executionAnalytics", singular: "ExecutionAnalytics", pascal: "ExecutionAnalytics", db: "bpfExecutionAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "bottleneckReports", plural: "bottleneckReports", singular: "BottleneckReport", pascal: "BottleneckReport", db: "bpfBottleneckReports", fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "bottleneckScore", type: "number" }], display: { title: "reportName", sub: "bottleneckScore" } },
    { tab: "slaPerformanceMetrics", plural: "slaPerformanceMetrics", singular: "SlaPerformanceMetric", pascal: "SlaPerformanceMetric", db: "bpfSlaPerformanceMetrics", fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "slaScore", type: "number" }], display: { title: "metricName", sub: "slaScore" } },
    { tab: "processMetrics", plural: "processMetrics", singular: "ProcessMetric", pascal: "ProcessMetric", db: "bpfProcessMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "executionCount", type: "number" }, { name: "overallProcessScore", type: "number" }], display: { title: "metricsKey", sub: "overallProcessScore" } },
    { tab: "processHealth", plural: "processHealth", singular: "ProcessHealth", pascal: "ProcessHealth", db: "bpfProcessHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "failedProcessRecords", plural: "failedProcessRecords", singular: "FailedProcessRecord", pascal: "FailedProcessRecord", db: "bpfFailedProcessRecords", fields: [{ name: "recordKey", type: "string" }, { name: "recordName", type: "string" }, { name: "failureType", type: "string" }], display: { title: "recordName", sub: "failureType" } },
    { tab: "processFailures", plural: "processFailures", singular: "ProcessFailure", pascal: "ProcessFailure", db: "bpfProcessFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/industry-framework"\);/, 'const mod = join(root, "src/modules/business-process");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/frameworkHubs/g, "processHubs"],
    [/frameworkHubOptions/g, "processHubOptions"],
    [/getFrameworkHubs/g, "getProcessHubs"],
    [/getFrameworkHubOptions/g, "getProcessHubOptions"],
    [/FrameworkHubSelect/g, "ProcessHubSelect"],
    [/buildFrameworkHubLookupMaps/g, "buildProcessHubLookupMaps"],
    [/frameworkHubId/g, "processHubId"],
    [/Framework Hubs/g, "Process Hubs"],
    [/Framework Hub/g, "Business Process"],
    [/framework hub/g, "process hub"],
    [/industry-framework/g, "business-process"],
    [/industryFramework/g, "businessProcess"],
    [/IndustryFramework/g, "BusinessProcess"],
    [/Industry Framework/g, "Business Process"],
    [/industry framework/g, "business process"],
    [/databaseService\.ifr/g, "databaseService.bpf"],
    [/buildIfr/g, "buildBpf"],
    [/mapIfr/g, "mapBpf"],
    [/IfrDashboardStats/g, "BpfDashboardStats"],
    [/IfrPipelineInfo/g, "BpfPipelineInfo"],
    [/IfrSdk/g, "BpfSdk"],
    [/IFR_TABS/g, "BPF_TABS"],
    [/IFR_THEME/g, "BPF_THEME"],
    [/IFR_PERMISSIONS/g, "BPF_PERMISSIONS"],
    [/IFR_STATUS_OPTIONS/g, "BPF_STATUS_OPTIONS"],
    [/Program B Sprint 1/g, "Program B Sprint 2"],
    [/teal-600/g, "sky-600"],
    [/teal-500/g, "sky-500"],
    [/teal-400/g, "sky-400"],
    [/teal-300/g, "sky-300"],
    [/ring-teal/g, "ring-sky"],
    [/bg-teal/g, "bg-sky"],
    [/text-teal/g, "text-sky"],
    [/hover:bg-teal/g, "hover:bg-sky"],
    [/hover:border-teal/g, "hover:border-sky"],
    [/mapDashboardTemplateForStats/g, "mapTaskTemplateForStats"],
    [/mapWorkflowTemplateForStats/g, "mapApprovalRuleForStats"],
    [/mapFrameworkMetricForStats/g, "mapProcessMetricForStats"],
    [/mapIndustryProfileForStats/g, "mapProcessExecutionForStats"],
    [/mapCompatibilityCheckForStats/g, "mapFailedProcessRecordForStats"],
    [/mapValidationRuleForStats/g, "mapRuleValidationForStats"],
    [/mapFrameworkHealthForStats/g, "mapProcessHealthForStats"],
    [/mapFrameworkFailureForStats/g, "mapProcessFailureForStats"],
    [/dashboardTemplates/g, "taskTemplates"],
    [/workflowTemplates/g, "approvalRules"],
    [/frameworkMetrics/g, "processMetrics"],
    [/industryProfiles/g, "processExecutions"],
    [/compatibilityChecks/g, "failedProcessRecords"],
    [/validationRules/g, "ruleValidations"],
    [/frameworkHealth/g, "processHealth"],
    [/frameworkFailures/g, "processFailures"],
    [/totalFrameworkHubs/g, "totalProcessHubs"],
    [/activeFrameworkHubs/g, "activeProcessHubs"],
    [/dashboardTemplateCount/g, "taskTemplateCount"],
    [/workflowTemplateCount/g, "approvalRuleCount"],
    [/industryProfileCount/g, "processExecutionCount"],
    [/openCompatibilityCount/g, "openFailedRecordCount"],
    [/overallFrameworkScore/g, "overallProcessScore"],
    [/templateScore/g, "executionCountScore"],
    [/profileScore/g, "successRateScore"],
    [/compatibilityScore/g, "slaPerformanceScore"],
    [/sdkScore/g, "bottleneckScoreMetric"],
    [/frameworkHealthScore/g, "averageDurationScore"],
    [/sdkRegisterIndustry/g, "sdkRegisterProcess"],
    [/sdkConfigureTemplate/g, "sdkConfigureApproval"],
    [/sdkRunCompatibilityCheck/g, "sdkRunProcessExecution"],
    [/registerIndustry/g, "registerProcess"],
    [/configureTemplate/g, "configureApproval"],
    [/runCompatibilityCheck/g, "runProcessExecution"],
    [/IfrSdkRegisterIndustryInput/g, "BpfSdkRegisterProcessInput"],
    [/IfrSdkRegisterIndustryResult/g, "BpfSdkRegisterProcessResult"],
    [/IfrSdkConfigureTemplateInput/g, "BpfSdkConfigureApprovalInput"],
    [/IfrSdkConfigureTemplateResult/g, "BpfSdkConfigureApprovalResult"],
    [/IfrSdkRunCompatibilityCheckInput/g, "BpfSdkRunProcessExecutionInput"],
    [/IfrSdkRunCompatibilityCheckResult/g, "BpfSdkRunProcessExecutionResult"],
    [/createIndustryRegistration/g, "createBusinessProcess"],
    [/createDashboardTemplate/g, "createTaskTemplate"],
    [/createIndustryProfile/g, "createProcessExecution"],
    [/Register industry profile/g, "Register business process"],
    [/Configure industry template/g, "Configure approval rule"],
    [/Run compatibility check/g, "Run process execution"],
    [/registrations, templates, compatibility checks/g, "processes, approvals, task templates, and executions"],
    [/Registrations, templates, compatibility checks, and industry framework outputs/g, "Processes, approvals, task templates, executions, and business process framework outputs"],
    [/Industry framework pipeline/g, "Business process pipeline"],
    [/Generated industry framework/g, "Generated business process"],
    [/Enterprise industry framework core: industry registry, profile engine, template engine, configuration engine, context engine, deployment profiles, industry SDK, and framework dashboard with security-first audit and the shared Industry Framework SDK\./g,
        "Enterprise business process framework: process registry, process designer, approval engine, task engine, business rule engine, process execution, process analytics, and process dashboard with security-first audit and the shared Business Process SDK."],
    [/industry registration, template configuration, and compatibility check/g, "process registration, approval configuration, and process execution"],
    [/register_industry/g, "register_process"],
    [/run_compatibility_check/g, "run_process_execution"],
    [/"ifr\.view"/g, '"bpf.view"'],
    [/"ifr\.manage"/g, '"bpf.manage"'],
    [/"ifr\.approve"/g, '"bpf.approve"'],
    [/"ifr\.admin"/g, '"bpf.admin"'],
    [/industry_framework/g, "business_process"],
    [/moduleSource: industry_framework/g, "moduleSource: business_process"],
    [/dashboard templates/g, "task templates"],
    [/workflow templates/g, "approval rules"],
    [/industry profiles/g, "process executions"],
    [/open compatibility issues/g, "open failed process records"],
    [/overall framework score/g, "overall process score"],
    [/Industry Framework summary/g, "Business Process summary"],
    [/Security-first industry framework/g, "Security-first business process"],
    [/totalIndustryFrameworks/g, "totalProcessHubs"],
    [/activeIndustryFrameworks/g, "activeProcessHubs"],
    [/dashboardTemplatesCount/g, "taskTemplateCount"],
    [/ifrFrameworkHubs/g, "bpfProcessHubs"],
    [/getFrameworkFailures/g, "getProcessFailures"],
    [/industry-framework-mappers/g, "business-process-mappers"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.bpfIndustryRegistrations\.listByOrganization/g, "databaseService.bpfBusinessProcesses.listByOrganization");
s = s.replace(/databaseService\.bpfDashboardTemplates\.listByOrganization/g, "databaseService.bpfTaskTemplates.listByOrganization");
s = s.replace(/databaseService\.bpfWorkflowTemplates\.listByOrganization/g, "databaseService.bpfApprovalRules.listByOrganization");
s = s.replace(/databaseService\.bpfFrameworkMetrics\.listByOrganization/g, "databaseService.bpfProcessMetrics.listByOrganization");
s = s.replace(/databaseService\.bpfIndustryProfiles\.listByOrganization/g, "databaseService.bpfProcessExecutions.listByOrganization");
s = s.replace(/databaseService\.bpfCompatibilityChecks\.listByOrganization/g, "databaseService.bpfFailedProcessRecords.listByOrganization");
s = s.replace(/databaseService\.bpfValidationRules\.listByOrganization/g, "databaseService.bpfRuleValidations.listByOrganization");
s = s.replace(/databaseService\.bpfFrameworkHealth\.listByOrganization/g, "databaseService.bpfProcessHealth.listByOrganization");
s = s.replace(/databaseService\.bpfFrameworkHubs\.listByOrganization/g, "databaseService.bpfProcessHubs.listByOrganization");

const bpfOptionsBlock = `export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const BPF_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
] as const;

export const BPF_PERMISSIONS = ["bpf.view", "bpf.manage", "bpf.approve", "bpf.admin"] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const BPF_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const BPF_THEME)/,
    `$1${bpfOptionsBlock}$2`,
);

s = s.replace(
    /import \{ BPF_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS \}/g,
    "import { BPF_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS }",
);

s = s.replace(/Select framework hub/g, "Select process hub");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-business-process-ui.mjs");
