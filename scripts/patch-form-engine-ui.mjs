#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-business-process-ui.mjs");
const outPath = join(root, "scripts/generate-form-engine-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
    { tab: "formHubs", plural: "formHubs", singular: "FormHub", pascal: "FormHub", db: "dfeFormHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "formDefinitions", plural: "formDefinitions", singular: "FormDefinition", pascal: "FormDefinition", db: "dfeFormDefinitions", fields: [{ name: "formKey", type: "string" }, { name: "formName", type: "string" }, { name: "formType", type: "string" }], display: { title: "formName", sub: "formType" } },
    { tab: "formCategories", plural: "formCategories", singular: "FormCategory", pascal: "FormCategory", db: "dfeFormCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "formVersions", plural: "formVersions", singular: "FormVersion", pascal: "FormVersion", db: "dfeFormVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "formDependencies", plural: "formDependencies", singular: "FormDependency", pascal: "FormDependency", db: "dfeFormDependencies", fields: [{ name: "dependencyKey", type: "string" }, { name: "dependencyType", type: "string" }, { name: "dependencyRef", type: "string" }], display: { title: "dependencyKey", sub: "dependencyType" } },
    { tab: "formSections", plural: "formSections", singular: "FormSection", pascal: "FormSection", db: "dfeFormSections", fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionOrder", type: "number" }], display: { title: "sectionName", sub: "sectionOrder" } },
    { tab: "formTabs", plural: "formTabs", singular: "FormTab", pascal: "FormTab", db: "dfeFormTabs", fields: [{ name: "tabKey", type: "string" }, { name: "tabName", type: "string" }, { name: "tabOrder", type: "number" }], display: { title: "tabName", sub: "tabOrder" } },
    { tab: "formGroups", plural: "formGroups", singular: "FormGroup", pascal: "FormGroup", db: "dfeFormGroups", fields: [{ name: "groupKey", type: "string" }, { name: "groupName", type: "string" }, { name: "groupOrder", type: "number" }], display: { title: "groupName", sub: "groupOrder" } },
    { tab: "repeatableSections", plural: "repeatableSections", singular: "RepeatableSection", pascal: "RepeatableSection", db: "dfeRepeatableSections", fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "minInstances", type: "number" }], display: { title: "sectionName", sub: "minInstances" } },
    { tab: "formFields", plural: "formFields", singular: "FormField", pascal: "FormField", db: "dfeFormFields", fields: [{ name: "fieldKey", type: "string" }, { name: "fieldName", type: "string" }, { name: "fieldType", type: "string" }], display: { title: "fieldName", sub: "fieldType" } },
    { tab: "fieldOptions", plural: "fieldOptions", singular: "FieldOption", pascal: "FieldOption", db: "dfeFieldOptions", fields: [{ name: "optionKey", type: "string" }, { name: "optionLabel", type: "string" }, { name: "optionValue", type: "string" }], display: { title: "optionLabel", sub: "optionValue" } },
    { tab: "formulaFields", plural: "formulaFields", singular: "FormulaField", pascal: "FormulaField", db: "dfeFormulaFields", fields: [{ name: "formulaKey", type: "string" }, { name: "formulaName", type: "string" }, { name: "formulaExpression", type: "string" }], display: { title: "formulaName", sub: "formulaExpression" } },
    { tab: "mediaFields", plural: "mediaFields", singular: "MediaField", pascal: "MediaField", db: "dfeMediaFields", fields: [{ name: "mediaKey", type: "string" }, { name: "mediaName", type: "string" }, { name: "mediaType", type: "string" }], display: { title: "mediaName", sub: "mediaType" } },
    { tab: "requiredRules", plural: "requiredRules", singular: "RequiredRule", pascal: "RequiredRule", db: "dfeRequiredRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "fieldRef", type: "string" }], display: { title: "ruleName", sub: "fieldRef" } },
    { tab: "regexRules", plural: "regexRules", singular: "RegexRule", pascal: "RegexRule", db: "dfeRegexRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "pattern", type: "string" }], display: { title: "ruleName", sub: "pattern" } },
    { tab: "rangeRules", plural: "rangeRules", singular: "RangeRule", pascal: "RangeRule", db: "dfeRangeRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "minValue", type: "number" }], display: { title: "ruleName", sub: "minValue" } },
    { tab: "crossFieldRules", plural: "crossFieldRules", singular: "CrossFieldRule", pascal: "CrossFieldRule", db: "dfeCrossFieldRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleExpression", type: "string" }], display: { title: "ruleName", sub: "ruleExpression" } },
    { tab: "formDrafts", plural: "formDrafts", singular: "FormDraft", pascal: "FormDraft", db: "dfeFormDrafts", fields: [{ name: "draftKey", type: "string" }, { name: "draftName", type: "string" }, { name: "draftStatus", type: "string" }], display: { title: "draftName", sub: "draftStatus" } },
    { tab: "formSubmissions", plural: "formSubmissions", singular: "FormSubmission", pascal: "FormSubmission", db: "dfeFormSubmissions", fields: [{ name: "submissionKey", type: "string" }, { name: "submissionName", type: "string" }, { name: "submissionStatus", type: "string" }], display: { title: "submissionName", sub: "submissionStatus" } },
    { tab: "formReviews", plural: "formReviews", singular: "FormReview", pascal: "FormReview", db: "dfeFormReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "reviewName", type: "string" }, { name: "reviewStatus", type: "string" }], display: { title: "reviewName", sub: "reviewStatus" } },
    { tab: "executionAuditEntries", plural: "executionAuditEntries", singular: "ExecutionAuditEntry", pascal: "ExecutionAuditEntry", db: "dfeExecutionAuditEntries", fields: [{ name: "auditKey", type: "string" }, { name: "auditType", type: "string" }, { name: "auditSummary", type: "string" }], display: { title: "auditKey", sub: "auditType" } },
    { tab: "renderProfiles", plural: "renderProfiles", singular: "RenderProfile", pascal: "RenderProfile", db: "dfeRenderProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" } },
    { tab: "themeConfigs", plural: "themeConfigs", singular: "ThemeConfig", pascal: "ThemeConfig", db: "dfeThemeConfigs", fields: [{ name: "themeKey", type: "string" }, { name: "themeName", type: "string" }, { name: "primaryColor", type: "string" }], display: { title: "themeName", sub: "primaryColor" } },
    { tab: "localizationPacks", plural: "localizationPacks", singular: "LocalizationPack", pascal: "LocalizationPack", db: "dfeLocalizationPacks", fields: [{ name: "localeKey", type: "string" }, { name: "localeCode", type: "string" }, { name: "localeName", type: "string" }], display: { title: "localeName", sub: "localeCode" } },
    { tab: "submissionAnalytics", plural: "submissionAnalytics", singular: "SubmissionAnalytics", pascal: "SubmissionAnalytics", db: "dfeSubmissionAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "completionMetrics", plural: "completionMetrics", singular: "CompletionMetric", pascal: "CompletionMetric", db: "dfeCompletionMetrics", fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "completionRate", type: "number" }], display: { title: "metricName", sub: "completionRate" } },
    { tab: "usageTrends", plural: "usageTrends", singular: "UsageTrend", pascal: "UsageTrend", db: "dfeUsageTrends", fields: [{ name: "trendKey", type: "string" }, { name: "trendName", type: "string" }, { name: "trendValue", type: "number" }], display: { title: "trendName", sub: "trendValue" } },
    { tab: "formMetrics", plural: "formMetrics", singular: "FormMetric", pascal: "FormMetric", db: "dfeFormMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "submissionCount", type: "number" }, { name: "overallFormScore", type: "number" }], display: { title: "metricsKey", sub: "overallFormScore" } },
    { tab: "formHealth", plural: "formHealth", singular: "FormHealth", pascal: "FormHealth", db: "dfeFormHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "pendingReviewItems", plural: "pendingReviewItems", singular: "PendingReviewItem", pascal: "PendingReviewItem", db: "dfePendingReviewItems", fields: [{ name: "itemKey", type: "string" }, { name: "itemName", type: "string" }, { name: "reviewType", type: "string" }], display: { title: "itemName", sub: "reviewType" } },
    { tab: "formFailures", plural: "formFailures", singular: "FormFailure", pascal: "FormFailure", db: "dfeFormFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/business-process"\);/, 'const mod = join(root, "src/modules/form-engine");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/processHubs/g, "formHubs"],
    [/processHubOptions/g, "formHubOptions"],
    [/getProcessHubs/g, "getFormHubs"],
    [/getProcessHubOptions/g, "getFormHubOptions"],
    [/ProcessHubSelect/g, "FormHubSelect"],
    [/buildProcessHubLookupMaps/g, "buildFormHubLookupMaps"],
    [/processHubId/g, "formHubId"],
    [/Process Hubs/g, "Form Hubs"],
    [/Process Hub/g, "Form Engine"],
    [/process hub/g, "form hub"],
    [/business-process/g, "form-engine"],
    [/businessProcess/g, "formEngine"],
    [/BusinessProcess/g, "FormEngine"],
    [/Business Process/g, "Form Engine"],
    [/business process/g, "form engine"],
    [/databaseService\.bpf/g, "databaseService.dfe"],
    [/buildBpf/g, "buildDfe"],
    [/mapBpf/g, "mapDfe"],
    [/BpfDashboardStats/g, "DfeDashboardStats"],
    [/BpfPipelineInfo/g, "DfePipelineInfo"],
    [/BpfSdk/g, "DfeSdk"],
    [/BPF_TABS/g, "DFE_TABS"],
    [/BPF_THEME/g, "DFE_THEME"],
    [/BPF_PERMISSIONS/g, "DFE_PERMISSIONS"],
    [/BPF_STATUS_OPTIONS/g, "DFE_STATUS_OPTIONS"],
    [/Program B Sprint 2/g, "Program B Sprint 3"],
    [/sky-600/g, "amber-600"],
    [/sky-500/g, "amber-500"],
    [/sky-400/g, "amber-400"],
    [/sky-300/g, "amber-300"],
    [/ring-sky/g, "ring-amber"],
    [/bg-sky/g, "bg-amber"],
    [/text-sky/g, "text-amber"],
    [/hover:bg-sky/g, "hover:bg-amber"],
    [/hover:border-sky/g, "hover:border-amber"],
    [/mapTaskTemplateForStats/g, "mapFormSectionForStats"],
    [/mapApprovalRuleForStats/g, "mapRequiredRuleForStats"],
    [/mapProcessMetricForStats/g, "mapFormMetricForStats"],
    [/mapProcessExecutionForStats/g, "mapFormSubmissionForStats"],
    [/mapFailedProcessRecordForStats/g, "mapPendingReviewItemForStats"],
    [/mapRuleValidationForStats/g, "mapRegexRuleForStats"],
    [/mapProcessHealthForStats/g, "mapFormHealthForStats"],
    [/mapProcessFailureForStats/g, "mapFormFailureForStats"],
    [/taskTemplates/g, "formSections"],
    [/approvalRules/g, "requiredRules"],
    [/processMetrics/g, "formMetrics"],
    [/processExecutions/g, "formSubmissions"],
    [/failedProcessRecords/g, "pendingReviewItems"],
    [/ruleValidations/g, "regexRules"],
    [/processHealth/g, "formHealth"],
    [/processFailures/g, "formFailures"],
    [/totalProcessHubs/g, "totalFormHubs"],
    [/activeProcessHubs/g, "activeFormHubs"],
    [/taskTemplateCount/g, "formSectionCount"],
    [/approvalRuleCount/g, "requiredRuleCount"],
    [/processExecutionCount/g, "formSubmissionCount"],
    [/openFailedRecordCount/g, "openPendingReviewCount"],
    [/overallProcessScore/g, "overallFormScore"],
    [/executionCountScore/g, "submissionCountScore"],
    [/successRateScore/g, "completionRateScore"],
    [/slaPerformanceScore/g, "validationErrorScore"],
    [/bottleneckScoreMetric/g, "abandonmentRateScore"],
    [/averageDurationScore/g, "averageCompletionTimeScore"],
    [/sdkRegisterProcess/g, "sdkRegisterForm"],
    [/sdkConfigureApproval/g, "sdkConfigureValidation"],
    [/sdkRunProcessExecution/g, "sdkRunFormSubmission"],
    [/registerProcess/g, "registerForm"],
    [/configureApproval/g, "configureValidation"],
    [/runProcessExecution/g, "runFormSubmission"],
    [/createBusinessProcess/g, "createFormDefinition"],
    [/createTaskTemplate/g, "createFormSection"],
    [/createProcessExecution/g, "createFormSubmission"],
    [/Register business process/g, "Register form definition"],
    [/Configure approval rule/g, "Configure validation rule"],
    [/Run process execution/g, "Run form submission"],
    [/processes, approvals, task templates, and executions/g, "forms, sections, validation rules, and submissions"],
    [/Processes, approvals, task templates, executions, and business process framework outputs/g, "Forms, sections, validation rules, submissions, and dynamic form engine outputs"],
    [/Business process pipeline/g, "Form engine pipeline"],
    [/Generated business process/g, "Generated form engine"],
    [/Enterprise business process framework: process registry, process designer, approval engine, task engine, business rule engine, process execution, process analytics, and process dashboard with security-first audit and the shared Business Process SDK\./g,
        "Enterprise dynamic form engine: form registry, form builder, field engine, validation engine, form execution, form rendering, form analytics, and form dashboard with security-first audit and the shared Form Engine SDK."],
    [/process registration, approval configuration, and process execution/g, "form registration, validation configuration, and form submission"],
    [/register_process/g, "register_form"],
    [/run_process_execution/g, "run_form_submission"],
    [/"bpf\.view"/g, '"dfe.view"'],
    [/"bpf\.manage"/g, '"dfe.manage"'],
    [/"bpf\.approve"/g, '"dfe.approve"'],
    [/"bpf\.admin"/g, '"dfe.admin"'],
    [/business_process/g, "dynamic_form_engine"],
    [/moduleSource: business_process/g, "moduleSource: dynamic_form_engine"],
    [/task templates/g, "form sections"],
    [/approval rules/g, "required rules"],
    [/process executions/g, "form submissions"],
    [/open failed process records/g, "open pending review items"],
    [/overall process score/g, "overall form score"],
    [/Business Process summary/g, "Form Engine summary"],
    [/Security-first business process/g, "Security-first form engine"],
    [/bpfProcessHubs/g, "dfeFormHubs"],
    [/getExecutiveFailures/g, "getFormFailures"],
    [/business-process-mappers/g, "form-engine-mappers"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.dfeBusinessProcesses\.listByOrganization/g, "databaseService.dfeFormDefinitions.listByOrganization");
s = s.replace(/databaseService\.dfeTaskTemplates\.listByOrganization/g, "databaseService.dfeFormSections.listByOrganization");
s = s.replace(/databaseService\.dfeApprovalRules\.listByOrganization/g, "databaseService.dfeRequiredRules.listByOrganization");
s = s.replace(/databaseService\.dfeProcessMetrics\.listByOrganization/g, "databaseService.dfeFormMetrics.listByOrganization");
s = s.replace(/databaseService\.dfeProcessExecutions\.listByOrganization/g, "databaseService.dfeFormSubmissions.listByOrganization");
s = s.replace(/databaseService\.dfeFailedProcessRecords\.listByOrganization/g, "databaseService.dfePendingReviewItems.listByOrganization");
s = s.replace(/databaseService\.dfeRuleValidations\.listByOrganization/g, "databaseService.dfeRegexRules.listByOrganization");
s = s.replace(/databaseService\.dfeProcessHealth\.listByOrganization/g, "databaseService.dfeFormHealth.listByOrganization");
s = s.replace(/databaseService\.dfeProcessHubs\.listByOrganization/g, "databaseService.dfeFormHubs.listByOrganization");

const dfeOptionsBlock = `export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const DFE_STATUS_OPTIONS = [
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

export const DFE_PERMISSIONS = ["dfe.view", "dfe.manage", "dfe.approve", "dfe.admin"] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const DFE_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const DFE_THEME)/,
    `$1${dfeOptionsBlock}$2`,
);

s = s.replace(/Select process hub/g, "Select form hub");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-form-engine-ui.mjs");
