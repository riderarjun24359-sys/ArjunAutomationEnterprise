#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-workflow-engine-ui.mjs");
const outPath = join(root, "scripts/generate-document-engine-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
    { tab: "documentHubs", plural: "documentHubs", singular: "DocumentHub", pascal: "DocumentHub", db: "ddeDocumentHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "documentTypes", plural: "documentTypes", singular: "DocumentType", pascal: "DocumentType", db: "ddeDocumentTypes", fields: [{ name: "typeKey", type: "string" }, { name: "typeName", type: "string" }, { name: "typeCategory", type: "string" }], display: { title: "typeName", sub: "typeCategory" } },
    { tab: "documentCategories", plural: "documentCategories", singular: "DocumentCategory", pascal: "DocumentCategory", db: "ddeDocumentCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "documentTemplates", plural: "documentTemplates", singular: "DocumentTemplate", pascal: "DocumentTemplate", db: "ddeDocumentTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateType", type: "string" }], display: { title: "templateName", sub: "templateType" } },
    { tab: "documentVersions", plural: "documentVersions", singular: "DocumentVersion", pascal: "DocumentVersion", db: "ddeDocumentVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "templateHeaders", plural: "templateHeaders", singular: "TemplateHeader", pascal: "TemplateHeader", db: "ddeTemplateHeaders", fields: [{ name: "headerKey", type: "string" }, { name: "headerName", type: "string" }, { name: "headerContent", type: "string" }], display: { title: "headerName", sub: "headerKey" } },
    { tab: "templateFooters", plural: "templateFooters", singular: "TemplateFooter", pascal: "TemplateFooter", db: "ddeTemplateFooters", fields: [{ name: "footerKey", type: "string" }, { name: "footerName", type: "string" }, { name: "footerContent", type: "string" }], display: { title: "footerName", sub: "footerKey" } },
    { tab: "templateSections", plural: "templateSections", singular: "TemplateSection", pascal: "TemplateSection", db: "ddeTemplateSections", fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionType", type: "string" }], display: { title: "sectionName", sub: "sectionType" } },
    { tab: "templateVariables", plural: "templateVariables", singular: "TemplateVariable", pascal: "TemplateVariable", db: "ddeTemplateVariables", fields: [{ name: "variableKey", type: "string" }, { name: "variableName", type: "string" }, { name: "variableType", type: "string" }], display: { title: "variableName", sub: "variableType" } },
    { tab: "pdfGenerations", plural: "pdfGenerations", singular: "PdfGeneration", pascal: "PdfGeneration", db: "ddePdfGenerations", fields: [{ name: "generationKey", type: "string" }, { name: "generationName", type: "string" }, { name: "generationStatus", type: "string" }], display: { title: "generationName", sub: "generationStatus" } },
    { tab: "htmlGenerations", plural: "htmlGenerations", singular: "HtmlGeneration", pascal: "HtmlGeneration", db: "ddeHtmlGenerations", fields: [{ name: "generationKey", type: "string" }, { name: "generationName", type: "string" }, { name: "generationStatus", type: "string" }], display: { title: "generationName", sub: "generationStatus" } },
    { tab: "exportJobs", plural: "exportJobs", singular: "ExportJob", pascal: "ExportJob", db: "ddeExportJobs", fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "string" }], display: { title: "jobName", sub: "jobStatus" } },
    { tab: "batchGenerations", plural: "batchGenerations", singular: "BatchGeneration", pascal: "BatchGeneration", db: "ddeBatchGenerations", fields: [{ name: "batchKey", type: "string" }, { name: "batchName", type: "string" }, { name: "batchStatus", type: "string" }], display: { title: "batchName", sub: "batchStatus" } },
    { tab: "electronicSignatures", plural: "electronicSignatures", singular: "ElectronicSignature", pascal: "ElectronicSignature", db: "ddeElectronicSignatures", fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" } },
    { tab: "approvalSignatures", plural: "approvalSignatures", singular: "ApprovalSignature", pascal: "ApprovalSignature", db: "ddeApprovalSignatures", fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" } },
    { tab: "signatureVerifications", plural: "signatureVerifications", singular: "SignatureVerification", pascal: "SignatureVerification", db: "ddeSignatureVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "verificationStatus", type: "string" }, { name: "verificationResult", type: "string" }], display: { title: "verificationKey", sub: "verificationStatus" } },
    { tab: "signatureAuditEntries", plural: "signatureAuditEntries", singular: "SignatureAuditEntry", pascal: "SignatureAuditEntry", db: "ddeSignatureAuditEntries", fields: [{ name: "auditKey", type: "string" }, { name: "auditAction", type: "string" }, { name: "auditSummary", type: "string" }], display: { title: "auditKey", sub: "auditAction" } },
    { tab: "versionHistories", plural: "versionHistories", singular: "VersionHistory", pascal: "VersionHistory", db: "ddeVersionHistories", fields: [{ name: "historyKey", type: "string" }, { name: "historyVersion", type: "string" }, { name: "historySummary", type: "string" }], display: { title: "historyKey", sub: "historyVersion" } },
    { tab: "retentionPolicies", plural: "retentionPolicies", singular: "RetentionPolicy", pascal: "RetentionPolicy", db: "ddeRetentionPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "retentionDays", type: "number" }], display: { title: "policyName", sub: "retentionDays" } },
    { tab: "archiveRecords", plural: "archiveRecords", singular: "ArchiveRecord", pascal: "ArchiveRecord", db: "ddeArchiveRecords", fields: [{ name: "archiveKey", type: "string" }, { name: "archiveName", type: "string" }, { name: "archiveStatus", type: "string" }], display: { title: "archiveName", sub: "archiveStatus" } },
    { tab: "sharingPolicies", plural: "sharingPolicies", singular: "SharingPolicy", pascal: "SharingPolicy", db: "ddeSharingPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "sharingScope", type: "string" }], display: { title: "policyName", sub: "sharingScope" } },
    { tab: "emailDeliveries", plural: "emailDeliveries", singular: "EmailDelivery", pascal: "EmailDelivery", db: "ddeEmailDeliveries", fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" } },
    { tab: "downloadDeliveries", plural: "downloadDeliveries", singular: "DownloadDelivery", pascal: "DownloadDelivery", db: "ddeDownloadDeliveries", fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" } },
    { tab: "webhookDeliveries", plural: "webhookDeliveries", singular: "WebhookDelivery", pascal: "WebhookDelivery", db: "ddeWebhookDeliveries", fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" } },
    { tab: "generationAnalytics", plural: "generationAnalytics", singular: "GenerationAnalytics", pascal: "GenerationAnalytics", db: "ddeGenerationAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "deliveryAnalytics", plural: "deliveryAnalytics", singular: "DeliveryAnalytics", pascal: "DeliveryAnalytics", db: "ddeDeliveryAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "storageAnalytics", plural: "storageAnalytics", singular: "StorageAnalytics", pascal: "StorageAnalytics", db: "ddeStorageAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "documentMetrics", plural: "documentMetrics", singular: "DocumentMetric", pascal: "DocumentMetric", db: "ddeDocumentMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "generatedCount", type: "number" }, { name: "overallDocumentScore", type: "number" }], display: { title: "metricsKey", sub: "overallDocumentScore" } },
    { tab: "documentHealth", plural: "documentHealth", singular: "DocumentHealth", pascal: "DocumentHealth", db: "ddeDocumentHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "pendingSignatures", plural: "pendingSignatures", singular: "PendingSignature", pascal: "PendingSignature", db: "ddePendingSignatures", fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" } },
    { tab: "documentFailures", plural: "documentFailures", singular: "DocumentFailure", pascal: "DocumentFailure", db: "ddeDocumentFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/workflow-engine"\);/, 'const mod = join(root, "src/modules/document-engine");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/workflowHubs/g, "documentHubs"],
    [/workflowHubOptions/g, "documentHubOptions"],
    [/getWorkflowHubs/g, "getDocumentHubs"],
    [/getWorkflowHubOptions/g, "getDocumentHubOptions"],
    [/WorkflowHubSelect/g, "DocumentHubSelect"],
    [/buildWorkflowHubLookupMaps/g, "buildDocumentHubLookupMaps"],
    [/workflowHubId/g, "documentHubId"],
    [/Workflow Hubs/g, "Document Hubs"],
    [/Workflow Hub/g, "Document Engine"],
    [/workflow hub/g, "document hub"],
    [/workflow-engine/g, "document-engine"],
    [/workflowEngine/g, "documentEngine"],
    [/WorkflowEngine/g, "DocumentEngine"],
    [/Workflow Engine/g, "Document Engine"],
    [/workflow engine/g, "document engine"],
    [/databaseService\.dwe/g, "databaseService.dde"],
    [/buildDwe/g, "buildDde"],
    [/mapDwe/g, "mapDde"],
    [/DweDashboardStats/g, "DdeDashboardStats"],
    [/DwePipelineInfo/g, "DdePipelineInfo"],
    [/DweSdk/g, "DdeSdk"],
    [/DWE_TABS/g, "DDE_TABS"],
    [/DWE_THEME/g, "DDE_THEME"],
    [/DWE_PERMISSIONS/g, "DDE_PERMISSIONS"],
    [/DWE_STATUS_OPTIONS/g, "DDE_STATUS_OPTIONS"],
    [/Program B Sprint 4/g, "Program B Sprint 5"],
    [/indigo-600/g, "fuchsia-600"],
    [/indigo-500/g, "fuchsia-500"],
    [/indigo-400/g, "fuchsia-400"],
    [/indigo-300/g, "fuchsia-300"],
    [/ring-indigo/g, "ring-fuchsia"],
    [/bg-indigo/g, "bg-fuchsia"],
    [/text-indigo/g, "text-fuchsia"],
    [/hover:bg-indigo/g, "hover:bg-fuchsia"],
    [/hover:border-indigo/g, "hover:border-fuchsia"],
    [/mapWorkflowNodeForStats/g, "mapTemplateSectionForStats"],
    [/mapEscalationRuleForStats/g, "mapRetentionPolicyForStats"],
    [/mapWorkflowMetricForStats/g, "mapDocumentMetricForStats"],
    [/mapWorkflowExecutionForStats/g, "mapPdfGenerationForStats"],
    [/mapFailedExecutionForStats/g, "mapPendingSignatureForStats"],
    [/mapApprovalTaskForStats/g, "mapElectronicSignatureForStats"],
    [/mapWorkflowHealthForStats/g, "mapDocumentHealthForStats"],
    [/mapWorkflowFailureForStats/g, "mapDocumentFailureForStats"],
    [/workflowNodes/g, "templateSections"],
    [/escalationRules/g, "retentionPolicies"],
    [/workflowMetrics/g, "documentMetrics"],
    [/workflowExecutions/g, "pdfGenerations"],
    [/failedExecutions/g, "pendingSignatures"],
    [/approvalTasks/g, "electronicSignatures"],
    [/workflowHealth/g, "documentHealth"],
    [/workflowFailures/g, "documentFailures"],
    [/totalWorkflowHubs/g, "totalDocumentHubs"],
    [/activeWorkflowHubs/g, "activeDocumentHubs"],
    [/workflowNodeCount/g, "templateSectionCount"],
    [/escalationRuleCount/g, "retentionPolicyCount"],
    [/workflowExecutionCount/g, "pdfGenerationCount"],
    [/openFailedExecutionCount/g, "openPendingSignatureCount"],
    [/overallWorkflowScore/g, "overallDocumentScore"],
    [/executionCountScore/g, "generatedCountScore"],
    [/successRateScore/g, "deliverySuccessRateScore"],
    [/failureRateScore/g, "failureCountScore"],
    [/bottleneckScoreMetric/g, "downloadCountScore"],
    [/averageDurationScore/g, "storageUsageScore"],
    [/sdkRegisterWorkflow/g, "sdkRegisterDocument"],
    [/sdkConfigureAutomation/g, "sdkConfigureTemplate"],
    [/sdkRunWorkflowExecution/g, "sdkRunDocumentGeneration"],
    [/registerWorkflow/g, "registerDocument"],
    [/configureAutomation/g, "configureTemplate"],
    [/runWorkflowExecution/g, "runDocumentGeneration"],
    [/createWorkflowDefinition/g, "createDocumentType"],
    [/createWorkflowNode/g, "createTemplateSection"],
    [/createWorkflowExecution/g, "createPdfGeneration"],
    [/Register workflow definition/g, "Register document type"],
    [/Configure automation rule/g, "Configure template section"],
    [/Run workflow execution/g, "Run document generation"],
    [/workflows, nodes, automation rules, and executions/g, "documents, templates, generation jobs, signatures, and deliveries"],
    [/Workflows, nodes, automation rules, executions, and dynamic workflow engine outputs/g, "Documents, templates, generation jobs, signatures, deliveries, and dynamic document engine outputs"],
    [/Workflow engine pipeline/g, "Document engine pipeline"],
    [/Generated workflow engine/g, "Generated document engine"],
    [/Enterprise dynamic workflow engine: workflow registry, visual designer, execution engine, event triggers, approval tasks, workflow automation, workflow analytics, and workflow dashboard with security-first audit and the shared Workflow Engine SDK\./g,
        "Enterprise dynamic document engine: document registry, template engine, generation engine, digital signature, storage engine, delivery engine, document analytics, and document dashboard with security-first audit and the shared Document Engine SDK."],
    [/workflow registration, automation configuration, and workflow execution/g, "document registration, template configuration, and document generation"],
    [/register_workflow/g, "register_document"],
    [/run_workflow_execution/g, "run_document_generation"],
    [/"dwe\.view"/g, '"dde.view"'],
    [/"dwe\.manage"/g, '"dde.manage"'],
    [/"dwe\.approve"/g, '"dde.approve"'],
    [/"dwe\.admin"/g, '"dde.admin"'],
    [/dynamic_workflow_engine/g, "dynamic_document_engine"],
    [/moduleSource: dynamic_workflow_engine/g, "moduleSource: dynamic_document_engine"],
    [/workflow nodes/g, "template sections"],
    [/escalation rules/g, "retention policies"],
    [/workflow executions/g, "pdf generations"],
    [/open failed executions/g, "open pending signatures"],
    [/overall workflow score/g, "overall document score"],
    [/Workflow Engine summary/g, "Document Engine summary"],
    [/Security-first workflow engine/g, "Security-first document engine"],
    [/dweWorkflowHubs/g, "ddeDocumentHubs"],
    [/getWorkflowFailures/g, "getDocumentFailures"],
    [/workflow-engine-mappers/g, "document-engine-mappers"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.ddeWorkflowDefinitions\.listByOrganization/g, "databaseService.ddeDocumentTypes.listByOrganization");
s = s.replace(/databaseService\.ddeWorkflowNodes\.listByOrganization/g, "databaseService.ddeTemplateSections.listByOrganization");
s = s.replace(/databaseService\.ddeEscalationRules\.listByOrganization/g, "databaseService.ddeRetentionPolicies.listByOrganization");
s = s.replace(/databaseService\.ddeWorkflowMetrics\.listByOrganization/g, "databaseService.ddeDocumentMetrics.listByOrganization");
s = s.replace(/databaseService\.ddeWorkflowExecutions\.listByOrganization/g, "databaseService.ddePdfGenerations.listByOrganization");
s = s.replace(/databaseService\.ddeFailedExecutions\.listByOrganization/g, "databaseService.ddePendingSignatures.listByOrganization");
s = s.replace(/databaseService\.ddeApprovalTasks\.listByOrganization/g, "databaseService.ddeElectronicSignatures.listByOrganization");
s = s.replace(/databaseService\.ddeWorkflowHealth\.listByOrganization/g, "databaseService.ddeDocumentHealth.listByOrganization");
s = s.replace(/databaseService\.ddeWorkflowHubs\.listByOrganization/g, "databaseService.ddeDocumentHubs.listByOrganization");

const ddeOptionsBlock = `export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const DDE_STATUS_OPTIONS = [
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
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
] as const;

export const DDE_PERMISSIONS = ["dde.view", "dde.manage", "dde.approve", "dde.admin"] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const DDE_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const DDE_THEME)/,
    `$1${ddeOptionsBlock}$2`,
);

s = s.replace(/Select workflow hub/g, "Select document hub");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-document-engine-ui.mjs");
