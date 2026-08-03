#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/workflow-engine");

const entities = [
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
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const DWE_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
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


export const DWE_THEME = {
    primary: "indigo-600",
    primaryHover: "indigo-500",
    ring: "indigo-500/20",
    text: "text-indigo-600",
    textDark: "dark:text-indigo-400",
    bg: "bg-indigo-600",
    bgHover: "hover:bg-indigo-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    workflowHubId: z.string().min(1),`;
    const fieldLines = e.fields.map((f) => {
        if (f.type === "number") return `    ${f.name}: z.number().optional(),`;
        if (f.type === "boolean") return `    ${f.name}: z.boolean().optional(),`;
        return `    ${f.name}: z.string().min(1).optional(),`;
    }).join("\n");
    const schemaName = e.tab.replace(/([A-Z])/g, (m) => m.toLowerCase());
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `export const ${camel}FormSchema = z.object({${hubId}
${fieldLines}
});

export type ${camel}FormValues = z.infer<typeof ${camel}FormSchema>;`;
});
writeFileSync(join(mod, "schemas/index.ts"), `import { z } from "zod";\n\n${schemaLines.join("\n\n")}\n`);

// --- service ---
const mapperImports = [
    "buildWorkflowHubLookupMaps", "buildDweAuditPayload", "buildDweDashboardStats", "buildDwePipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapWorkflowNodeForStats", "mapEscalationRuleForStats", "mapWorkflowMetricForStats", "mapWorkflowExecutionForStats", "mapFailedExecutionForStats", "mapApprovalTaskForStats", "mapWorkflowHealthForStats", "mapWorkflowFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "DweDashboardStats", "DwePipelineInfo", "DweSdkRegisterFormInput", "DweSdkRegisterFormResult", "DweSdkConfigureValidationInput", "DweSdkConfigureValidationResult", "DweSdkRunFormSubmissionInput", "DweSdkRunFormSubmissionResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const maps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
    return `
    async get${e.pascal}s(authUserId: string, email: string, fullName?: string | null): Promise<${e.pascal}Summary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];${maps}
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});
    }

    async create${e.pascal}(authUserId: string, email: string, input: Create${e.pascal}Input, fullName?: string | null): Promise<${e.pascal}Summary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.pascal}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.dweAuditLogs.create(buildDweAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/workflow-engine.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/workflow-engine-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/workflow-engine/types";

export class WorkflowEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const workflowHubs = await databaseService.dweWorkflowHubs.listByOrganization(organizationId);
        return buildWorkflowHubLookupMaps(workflowHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DweDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildDweDashboardStats({ workflowHubs: [], workflowNodes: [], escalationRules: [], workflowMetrics: [], workflowExecutions: [], failedExecutions: [], approvalTasks: [], workflowHealth: [], workflowFailures: [], auditLogs: [] });
        const [workflowHubs, workflowNodesRaw, escalationRulesRaw, workflowMetricsRaw, workflowExecutionsRaw, failedExecutionsRaw, approvalTasksRaw, workflowHealthRaw, workflowFailures, auditLogs] = await Promise.all([
            this.getWorkflowHubs(authUserId, email, fullName),
            databaseService.dweWorkflowNodes.listByOrganization(context.organizationId),
            databaseService.dweEscalationRules.listByOrganization(context.organizationId),
            databaseService.dweWorkflowMetrics.listByOrganization(context.organizationId),
            databaseService.dweWorkflowExecutions.listByOrganization(context.organizationId),
            databaseService.dweFailedExecutions.listByOrganization(context.organizationId),
            databaseService.dweApprovalTasks.listByOrganization(context.organizationId),
            databaseService.dweWorkflowHealth.listByOrganization(context.organizationId),
            this.getWorkflowFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildDweDashboardStats({
            workflowHubs,
            workflowNodes: workflowNodesRaw.map(mapWorkflowNodeForStats),
            escalationRules: escalationRulesRaw.map(mapEscalationRuleForStats),
            workflowMetrics: workflowMetricsRaw.map(mapWorkflowMetricForStats),
            workflowExecutions: workflowExecutionsRaw.map(mapWorkflowExecutionForStats),
            failedExecutions: failedExecutionsRaw.map(mapFailedExecutionForStats),
            approvalTasks: approvalTasksRaw.map(mapApprovalTaskForStats),
            workflowHealth: workflowHealthRaw.map(mapWorkflowHealthForStats),
            workflowFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): DwePipelineInfo {
        return buildDwePipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dweAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getWorkflowHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dweWorkflowHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterWorkflow(authUserId: string, email: string, input: DweSdkRegisterFormInput, fullName?: string | null): Promise<DweSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_workflow", moduleSource: "dynamic_workflow_engine", inputPayload: { ...input } });
        const created = await this.createWorkflowDefinition(authUserId, email, { workflowHubId: input.workflowHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureAutomation(authUserId: string, email: string, input: DweSdkConfigureValidationInput, fullName?: string | null): Promise<DweSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { workflowHubId: input.workflowHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunWorkflowExecution(authUserId: string, email: string, input: DweSdkRunFormSubmissionInput, fullName?: string | null): Promise<DweSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_workflow_execution", moduleSource: "dynamic_workflow_engine", inputPayload: { ...input } });
        const created = await this.createWorkflowExecution(authUserId, email, { workflowHubId: input.workflowHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const workflowEngineService = new WorkflowEngineService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "DweDashboardStats", "DwePipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            workflowEngineService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await workflowEngineService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useWorkflowEngine.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { workflowEngineService } from "@/src/modules/workflow-engine/services/workflow-engine.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/workflow-engine/types";

export function useWorkflowEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DweDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DwePipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [workflowHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            workflowEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(workflowEngineService.getPipelineInfo()),
${hookFetchCalls}
            workflowEngineService.getAuditLogs(authUserId, email, fullName),
            workflowEngineService.getWorkflowHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
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

${hookCreates}

    return {
        loading,
        stats,
        pipeline,
${hookReturnFields}
        auditLogs,
        workflowHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const panelImports = entities.map((e) => `${e.pascal}sPanel`).join(",\n    ");
const schemaImports = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `    ${camel}FormSchema,\n    type ${camel}FormValues,`;
}).join("\n");

const panelFns = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    const panelName = `${e.pascal}sPanel`;
    const defaults = e.fields.reduce((acc, f) => {
        acc[f.name] = f.type === "number" ? 0 : f.type === "boolean" ? false : "";
        return acc;
    }, e.hubField === false ? {} : { workflowHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: WorkflowEngineData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise workflow engine ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.hubName ? item.hubName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${label(e.tab).toLowerCase()}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.create${e.pascal}(v))}>
${hubSelect}${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
}).join("\n\n");

writeFileSync(join(mod, "components/WorkflowEnginePanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { DWE_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/workflow-engine/constants";
import type { useWorkflowEngine } from "@/src/modules/workflow-engine/hooks/useWorkflowEngine";
import {
${schemaImports}
} from "@/src/modules/workflow-engine/schemas";

type WorkflowEngineData = ReturnType<typeof useWorkflowEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-indigo-600">{meta}</p> : null}</div>;
}
function WorkflowHubSelect({ data, ...props }: { data: WorkflowEngineData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select workflow engine</option>{data.workflowHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function WorkflowEngineOverviewPanel({ data }: { data: WorkflowEngineData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Workflow Engine summary" description="System health, background jobs, event bus, failedExecutions, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Workflow Hubs" subtitle={\`\${data.stats?.totalWorkflowHubs ?? 0} total\`} meta={\`\${data.stats?.activeWorkflowHubs ?? 0} active • \${data.stats?.workflowNodeCount ?? 0} workflow nodes\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.escalationRuleCount ?? 0} escalation rules\`} meta={\`\${data.stats?.workflowExecutionCount ?? 0} workflow executions • \${data.stats?.openFailedExecutionCount ?? 0} open failed executions\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallWorkflowScore ?? 0).toFixed(1)} overall workflow score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first workflow engine" />
            </div></Card>
            <Card hover><SectionHeader title="Workflow engine pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Workflow engine pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function WorkflowEngineAuditLogsPanel({ data }: { data: WorkflowEngineData }) {
    return (
        <Card hover><SectionHeader title="Workflow Engine audit history" description="Security-first audit trail for jobs, events, failedExecutions, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for workflow engine." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function WorkflowEngineSdkPanel({ data }: { data: WorkflowEngineData }) {
    return (
        <Card hover><SectionHeader title="Shared Workflow Engine SDK" description="Import from @/src/modules/workflow-engine/sdk for workflow registration, automation configuration, and workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createWorkflowEngineClient()" subtitle="Factory for module-scoped Workflow Engine client with auth context" meta="Primary SDK for enterprise workflow engine" />
            <ListCard title="sdkRegisterWorkflow()" subtitle="Register workflow engine with AI orchestration" meta="moduleSource: dynamic_workflow_engine" />
            <ListCard title="sdkConfigureAutomation()" subtitle="Configure automation rule with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunWorkflowExecution()" subtitle="Run workflow execution with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {DWE_THEME.primary} • Integration hubs loaded: {data.workflowHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";

const intg = createWorkflowEngineClient(userId, email, fullName);
await intg.registerWorkflow({ workflowHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureAutomation({ workflowHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runWorkflowExecution({ workflowHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/WorkflowEngineStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { DweDashboardStats } from "@/src/modules/workflow-engine/types";

interface WorkflowEngineStatsProps { stats: DweDashboardStats | null; }

export function WorkflowEngineStats({ stats }: WorkflowEngineStatsProps) {
    const cards = [
        { title: "Workflow Hubs", value: String(stats?.totalWorkflowHubs ?? 0), detail: \`\${stats?.activeWorkflowHubs ?? 0} active • \${stats?.workflowNodeCount ?? 0} workflow nodes\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.escalationRuleCount ?? 0), detail: \`\${stats?.workflowExecutionCount ?? 0} workflow executions • \${stats?.openFailedExecutionCount ?? 0} open failed executions\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallWorkflowScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, failedExecutions, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-indigo-600 dark:[&_p:last-child]:text-indigo-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "WorkflowEngineOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "WorkflowEngineAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "WorkflowEngineSdkPanel" },
];

writeFileSync(join(mod, "components/WorkflowEnginePage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    WorkflowEngineOverviewPanel,
    ${panelImports},
    WorkflowEngineAuditLogsPanel,
    WorkflowEngineSdkPanel,
} from "@/src/modules/workflow-engine/components/WorkflowEnginePanels";
import { WorkflowEngineStats } from "@/src/modules/workflow-engine/components/WorkflowEngineStats";
import { DWE_TABS } from "@/src/modules/workflow-engine/constants";
import { useWorkflowEngine } from "@/src/modules/workflow-engine/hooks/useWorkflowEngine";

const tabs = [
${tabDefs.map((t) => `    { id: DWE_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function WorkflowEnginePage() {
    const workflowEngine = useWorkflowEngine();
    const [activeTab, setActiveTab] = useState<(typeof DWE_TABS)[keyof typeof DWE_TABS]>(DWE_TABS.overview);

    if (workflowEngine.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Workflow Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-600">V2 Program A Program B Sprint 4</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Workflow Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: workflow nodes, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and workflow engine dashboard with security-first audit and the shared Workflow Engine SDK.
                </p>
            </motion.header>
            <WorkflowEngineStats stats={workflowEngine.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:border-indigo-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === DWE_TABS.${t.id} ? <${t.panel} data={workflowEngine} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { workflowEngineService } from "@/src/modules/workflow-engine/services/workflow-engine.service";
import type { DweSdkRegisterFormInput, DweSdkConfigureValidationInput, DweSdkRunFormSubmissionInput } from "@/src/modules/workflow-engine/types";

export class WorkflowEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerWorkflow(input: DweSdkConnectServiceInput) {
        return workflowEngineService.sdkRegisterWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async configureAutomation(input: DweSdkIssueApiKeyInput) {
        return workflowEngineService.sdkConfigureAutomation(this.authUserId, this.email, input, this.fullName);
    }

    async runWorkflowExecution(input: DweSdkRegisterWebhookInput) {
        return workflowEngineService.sdkRunWorkflowExecution(this.authUserId, this.email, input, this.fullName);
    }

    async getWorkflowHubs() {
        return workflowEngineService.getWorkflowHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return workflowEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return workflowEngineService.getPipelineInfo();
    }
}

export function createWorkflowEngineClient(authUserId: string, email: string, fullName?: string | null): WorkflowEngineClient {
    return new WorkflowEngineClient(authUserId, email, fullName);
}

export { workflowEngineService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { WorkflowEnginePage } from "@/src/modules/workflow-engine/components/WorkflowEnginePage";
export { WorkflowEngineStats } from "@/src/modules/workflow-engine/components/WorkflowEngineStats";
export { workflowEngineService } from "@/src/modules/workflow-engine/services/workflow-engine.service";
export { useWorkflowEngine } from "@/src/modules/workflow-engine/hooks/useWorkflowEngine";
export { createWorkflowEngineClient, WorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
export * from "@/src/modules/workflow-engine/types";
export * from "@/src/modules/workflow-engine/constants";
`);

console.log(`Generated workflow engine module files. DWE_TABS count: ${tabs.length}`);
