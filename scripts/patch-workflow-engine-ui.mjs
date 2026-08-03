#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-form-engine-ui.mjs");
const outPath = join(root, "scripts/generate-workflow-engine-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
    { tab: "workflowHubs", plural: "workflowHubs", singular: "WorkflowHub", pascal: "WorkflowHub", db: "dweWorkflowHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "workflowDefinitions", plural: "workflowDefinitions", singular: "WorkflowDefinition", pascal: "WorkflowDefinition", db: "dweWorkflowDefinitions", fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowType", type: "string" }], display: { title: "workflowName", sub: "workflowType" } },
    { tab: "workflowCategories", plural: "workflowCategories", singular: "WorkflowCategory", pascal: "WorkflowCategory", db: "dweWorkflowCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "workflowTemplates", plural: "workflowTemplates", singular: "WorkflowTemplate", pascal: "WorkflowTemplate", db: "dweWorkflowTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateType", type: "string" }], display: { title: "templateName", sub: "templateType" } },
    { tab: "workflowVersions", plural: "workflowVersions", singular: "WorkflowVersion", pascal: "WorkflowVersion", db: "dweWorkflowVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "workflowNodes", plural: "workflowNodes", singular: "WorkflowNode", pascal: "WorkflowNode", db: "dweWorkflowNodes", fields: [{ name: "nodeKey", type: "string" }, { name: "nodeName", type: "string" }, { name: "nodeType", type: "string" }], display: { title: "nodeName", sub: "nodeType" } },
    { tab: "workflowTransitions", plural: "workflowTransitions", singular: "WorkflowTransition", pascal: "WorkflowTransition", db: "dweWorkflowTransitions", fields: [{ name: "transitionKey", type: "string" }, { name: "transitionName", type: "string" }, { name: "sourceNodeRef", type: "string" }], display: { title: "transitionName", sub: "sourceNodeRef" } },
    { tab: "decisionNodes", plural: "decisionNodes", singular: "DecisionNode", pascal: "DecisionNode", db: "dweDecisionNodes", fields: [{ name: "decisionKey", type: "string" }, { name: "decisionName", type: "string" }, { name: "decisionExpression", type: "string" }], display: { title: "decisionName", sub: "decisionExpression" } },
    { tab: "reusableSubflows", plural: "reusableSubflows", singular: "ReusableSubflow", pascal: "ReusableSubflow", db: "dweReusableSubflows", fields: [{ name: "subflowKey", type: "string" }, { name: "subflowName", type: "string" }, { name: "subflowType", type: "string" }], display: { title: "subflowName", sub: "subflowType" } },
    { tab: "workflowExecutions", plural: "workflowExecutions", singular: "WorkflowExecution", pascal: "WorkflowExecution", db: "dweWorkflowExecutions", fields: [{ name: "executionKey", type: "string" }, { name: "executionName", type: "string" }, { name: "executionStatus", type: "string" }], display: { title: "executionName", sub: "executionStatus" } },
    { tab: "executionHistory", plural: "executionHistory", singular: "ExecutionHistory", pascal: "ExecutionHistory", db: "dweExecutionHistory", fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "historySummary", type: "string" }], display: { title: "historyKey", sub: "historyType" } },
    { tab: "executionRetries", plural: "executionRetries", singular: "ExecutionRetry", pascal: "ExecutionRetry", db: "dweExecutionRetries", fields: [{ name: "retryKey", type: "string" }, { name: "retryCount", type: "number" }, { name: "retryStatus", type: "string" }], display: { title: "retryKey", sub: "retryStatus" } },
    { tab: "executionRollbacks", plural: "executionRollbacks", singular: "ExecutionRollback", pascal: "ExecutionRollback", db: "dweExecutionRollbacks", fields: [{ name: "rollbackKey", type: "string" }, { name: "rollbackReason", type: "string" }, { name: "rollbackStatus", type: "string" }], display: { title: "rollbackKey", sub: "rollbackStatus" } },
    { tab: "timeTriggers", plural: "timeTriggers", singular: "TimeTrigger", pascal: "TimeTrigger", db: "dweTimeTriggers", fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "cronExpression", type: "string" }], display: { title: "triggerName", sub: "cronExpression" } },
    { tab: "businessEventTriggers", plural: "businessEventTriggers", singular: "BusinessEventTrigger", pascal: "BusinessEventTrigger", db: "dweBusinessEventTriggers", fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "eventType", type: "string" }], display: { title: "triggerName", sub: "eventType" } },
    { tab: "webhookTriggers", plural: "webhookTriggers", singular: "WebhookTrigger", pascal: "WebhookTrigger", db: "dweWebhookTriggers", fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "webhookUrl", type: "string" }], display: { title: "triggerName", sub: "webhookUrl" } },
    { tab: "scheduledTriggers", plural: "scheduledTriggers", singular: "ScheduledTrigger", pascal: "ScheduledTrigger", db: "dweScheduledTriggers", fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "scheduleType", type: "string" }], display: { title: "triggerName", sub: "scheduleType" } },
    { tab: "manualReviews", plural: "manualReviews", singular: "ManualReview", pascal: "ManualReview", db: "dweManualReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "reviewName", type: "string" }, { name: "reviewStatus", type: "string" }], display: { title: "reviewName", sub: "reviewStatus" } },
    { tab: "approvalTasks", plural: "approvalTasks", singular: "ApprovalTask", pascal: "ApprovalTask", db: "dweApprovalTasks", fields: [{ name: "taskKey", type: "string" }, { name: "taskName", type: "string" }, { name: "taskStatus", type: "string" }], display: { title: "taskName", sub: "taskStatus" } },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: "dweEscalationRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "escalationLevel", type: "number" }], display: { title: "ruleName", sub: "escalationLevel" } },
    { tab: "slaTrackings", plural: "slaTrackings", singular: "SlaTracking", pascal: "SlaTracking", db: "dweSlaTrackings", fields: [{ name: "slaKey", type: "string" }, { name: "slaName", type: "string" }, { name: "targetMinutes", type: "number" }], display: { title: "slaName", sub: "targetMinutes" } },
    { tab: "automationNotifications", plural: "automationNotifications", singular: "AutomationNotification", pascal: "AutomationNotification", db: "dweAutomationNotifications", fields: [{ name: "notificationKey", type: "string" }, { name: "notificationName", type: "string" }, { name: "channel", type: "string" }], display: { title: "notificationName", sub: "channel" } },
    { tab: "automationApiCalls", plural: "automationApiCalls", singular: "AutomationApiCall", pascal: "AutomationApiCall", db: "dweAutomationApiCalls", fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "endpointUrl", type: "string" }], display: { title: "apiName", sub: "endpointUrl" } },
    { tab: "automationIntegrations", plural: "automationIntegrations", singular: "AutomationIntegration", pascal: "AutomationIntegration", db: "dweAutomationIntegrations", fields: [{ name: "integrationKey", type: "string" }, { name: "integrationName", type: "string" }, { name: "integrationType", type: "string" }], display: { title: "integrationName", sub: "integrationType" } },
    { tab: "executionAnalytics", plural: "executionAnalytics", singular: "ExecutionAnalytics", pascal: "ExecutionAnalytics", db: "dweExecutionAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "bottleneckReports", plural: "bottleneckReports", singular: "BottleneckReport", pascal: "BottleneckReport", db: "dweBottleneckReports", fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "bottleneckScore", type: "number" }], display: { title: "reportName", sub: "bottleneckScore" } },
    { tab: "slaComplianceMetrics", plural: "slaComplianceMetrics", singular: "SlaComplianceMetric", pascal: "SlaComplianceMetric", db: "dweSlaComplianceMetrics", fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "complianceRate", type: "number" }], display: { title: "metricName", sub: "complianceRate" } },
    { tab: "workflowMetrics", plural: "workflowMetrics", singular: "WorkflowMetric", pascal: "WorkflowMetric", db: "dweWorkflowMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "executionCount", type: "number" }, { name: "overallWorkflowScore", type: "number" }], display: { title: "metricsKey", sub: "overallWorkflowScore" } },
    { tab: "workflowHealth", plural: "workflowHealth", singular: "WorkflowHealth", pascal: "WorkflowHealth", db: "dweWorkflowHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "failedExecutions", plural: "failedExecutions", singular: "FailedExecution", pascal: "FailedExecution", db: "dweFailedExecutions", fields: [{ name: "failureKey", type: "string" }, { name: "executionRef", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
    { tab: "workflowFailures", plural: "workflowFailures", singular: "WorkflowFailure", pascal: "WorkflowFailure", db: "dweWorkflowFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/form-engine"\);/, 'const mod = join(root, "src/modules/workflow-engine");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/formHubs/g, "workflowHubs"],
    [/formHubOptions/g, "workflowHubOptions"],
    [/getFormHubs/g, "getWorkflowHubs"],
    [/getFormHubOptions/g, "getWorkflowHubOptions"],
    [/FormHubSelect/g, "WorkflowHubSelect"],
    [/buildFormHubLookupMaps/g, "buildWorkflowHubLookupMaps"],
    [/formHubId/g, "workflowHubId"],
    [/Form Hubs/g, "Workflow Hubs"],
    [/Form Hub/g, "Workflow Engine"],
    [/form hub/g, "workflow hub"],
    [/form-engine/g, "workflow-engine"],
    [/formEngine/g, "workflowEngine"],
    [/FormEngine/g, "WorkflowEngine"],
    [/Form Engine/g, "Workflow Engine"],
    [/form engine/g, "workflow engine"],
    [/databaseService\.dfe/g, "databaseService.dwe"],
    [/buildDfe/g, "buildDwe"],
    [/mapDfe/g, "mapDwe"],
    [/DfeDashboardStats/g, "DweDashboardStats"],
    [/DfePipelineInfo/g, "DwePipelineInfo"],
    [/DfeSdk/g, "DweSdk"],
    [/DFE_TABS/g, "DWE_TABS"],
    [/DFE_THEME/g, "DWE_THEME"],
    [/DFE_PERMISSIONS/g, "DWE_PERMISSIONS"],
    [/DFE_STATUS_OPTIONS/g, "DWE_STATUS_OPTIONS"],
    [/Program B Sprint 3/g, "Program B Sprint 4"],
    [/amber-600/g, "indigo-600"],
    [/amber-500/g, "indigo-500"],
    [/amber-400/g, "indigo-400"],
    [/amber-300/g, "indigo-300"],
    [/ring-amber/g, "ring-indigo"],
    [/bg-amber/g, "bg-indigo"],
    [/text-amber/g, "text-indigo"],
    [/hover:bg-amber/g, "hover:bg-indigo"],
    [/hover:border-amber/g, "hover:border-indigo"],
    [/mapFormSectionForStats/g, "mapWorkflowNodeForStats"],
    [/mapRequiredRuleForStats/g, "mapEscalationRuleForStats"],
    [/mapFormMetricForStats/g, "mapWorkflowMetricForStats"],
    [/mapFormSubmissionForStats/g, "mapWorkflowExecutionForStats"],
    [/mapPendingReviewItemForStats/g, "mapFailedExecutionForStats"],
    [/mapRegexRuleForStats/g, "mapApprovalTaskForStats"],
    [/mapFormHealthForStats/g, "mapWorkflowHealthForStats"],
    [/mapFormFailureForStats/g, "mapWorkflowFailureForStats"],
    [/formSections/g, "workflowNodes"],
    [/requiredRules/g, "escalationRules"],
    [/formMetrics/g, "workflowMetrics"],
    [/formSubmissions/g, "workflowExecutions"],
    [/pendingReviewItems/g, "failedExecutions"],
    [/regexRules/g, "approvalTasks"],
    [/formHealth/g, "workflowHealth"],
    [/formFailures/g, "workflowFailures"],
    [/totalFormHubs/g, "totalWorkflowHubs"],
    [/activeFormHubs/g, "activeWorkflowHubs"],
    [/formSectionCount/g, "workflowNodeCount"],
    [/requiredRuleCount/g, "escalationRuleCount"],
    [/formSubmissionCount/g, "workflowExecutionCount"],
    [/openPendingReviewCount/g, "openFailedExecutionCount"],
    [/overallFormScore/g, "overallWorkflowScore"],
    [/submissionCountScore/g, "executionCountScore"],
    [/completionRateScore/g, "successRateScore"],
    [/validationErrorScore/g, "failureRateScore"],
    [/abandonmentRateScore/g, "bottleneckScoreMetric"],
    [/averageCompletionTimeScore/g, "averageDurationScore"],
    [/sdkRegisterForm/g, "sdkRegisterWorkflow"],
    [/sdkConfigureValidation/g, "sdkConfigureAutomation"],
    [/sdkRunFormSubmission/g, "sdkRunWorkflowExecution"],
    [/registerForm/g, "registerWorkflow"],
    [/configureValidation/g, "configureAutomation"],
    [/runFormSubmission/g, "runWorkflowExecution"],
    [/createFormDefinition/g, "createWorkflowDefinition"],
    [/createFormSection/g, "createWorkflowNode"],
    [/createFormSubmission/g, "createWorkflowExecution"],
    [/Register form definition/g, "Register workflow definition"],
    [/Configure validation rule/g, "Configure automation rule"],
    [/Run form submission/g, "Run workflow execution"],
    [/forms, sections, validation rules, and submissions/g, "workflows, nodes, automation rules, and executions"],
    [/Forms, sections, validation rules, submissions, and dynamic form engine outputs/g, "Workflows, nodes, automation rules, executions, and dynamic workflow engine outputs"],
    [/Form engine pipeline/g, "Workflow engine pipeline"],
    [/Generated form engine/g, "Generated workflow engine"],
    [/Enterprise dynamic form engine: form registry, form builder, field engine, validation engine, form execution, form rendering, form analytics, and form dashboard with security-first audit and the shared Form Engine SDK\./g,
        "Enterprise dynamic workflow engine: workflow registry, visual designer, execution engine, event triggers, approval tasks, workflow automation, workflow analytics, and workflow dashboard with security-first audit and the shared Workflow Engine SDK."],
    [/form registration, validation configuration, and form submission/g, "workflow registration, automation configuration, and workflow execution"],
    [/register_form/g, "register_workflow"],
    [/run_form_submission/g, "run_workflow_execution"],
    [/"dfe\.view"/g, '"dwe.view"'],
    [/"dfe\.manage"/g, '"dwe.manage"'],
    [/"dfe\.approve"/g, '"dwe.approve"'],
    [/"dfe\.admin"/g, '"dwe.admin"'],
    [/dynamic_form_engine/g, "dynamic_workflow_engine"],
    [/moduleSource: dynamic_form_engine/g, "moduleSource: dynamic_workflow_engine"],
    [/form sections/g, "workflow nodes"],
    [/required rules/g, "escalation rules"],
    [/form submissions/g, "workflow executions"],
    [/open pending review items/g, "open failed executions"],
    [/overall form score/g, "overall workflow score"],
    [/Form Engine summary/g, "Workflow Engine summary"],
    [/Security-first form engine/g, "Security-first workflow engine"],
    [/dfeFormHubs/g, "dweWorkflowHubs"],
    [/getFormFailures/g, "getWorkflowFailures"],
    [/form-engine-mappers/g, "workflow-engine-mappers"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.dweFormDefinitions\.listByOrganization/g, "databaseService.dweWorkflowDefinitions.listByOrganization");
s = s.replace(/databaseService\.dweFormSections\.listByOrganization/g, "databaseService.dweWorkflowNodes.listByOrganization");
s = s.replace(/databaseService\.dweRequiredRules\.listByOrganization/g, "databaseService.dweEscalationRules.listByOrganization");
s = s.replace(/databaseService\.dweFormMetrics\.listByOrganization/g, "databaseService.dweWorkflowMetrics.listByOrganization");
s = s.replace(/databaseService\.dweFormSubmissions\.listByOrganization/g, "databaseService.dweWorkflowExecutions.listByOrganization");
s = s.replace(/databaseService\.dwePendingReviewItems\.listByOrganization/g, "databaseService.dweFailedExecutions.listByOrganization");
s = s.replace(/databaseService\.dweRegexRules\.listByOrganization/g, "databaseService.dweApprovalTasks.listByOrganization");
s = s.replace(/databaseService\.dweFormHealth\.listByOrganization/g, "databaseService.dweWorkflowHealth.listByOrganization");
s = s.replace(/databaseService\.dweFormHubs\.listByOrganization/g, "databaseService.dweWorkflowHubs.listByOrganization");

const dweOptionsBlock = `export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const DWE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
] as const;

export const DWE_PERMISSIONS = ["dwe.view", "dwe.manage", "dwe.approve", "dwe.admin"] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const DWE_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const DWE_THEME)/,
    `$1${dweOptionsBlock}$2`,
);

s = s.replace(/Select form hub/g, "Select workflow hub");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-workflow-engine-ui.mjs");
