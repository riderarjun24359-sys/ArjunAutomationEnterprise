#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/business-process");

const entities = [
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
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const BPF_TABS = {
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


export const BPF_THEME = {
    primary: "sky-600",
    primaryHover: "sky-500",
    ring: "sky-500/20",
    text: "text-sky-600",
    textDark: "dark:text-sky-400",
    bg: "bg-sky-600",
    bgHover: "hover:bg-sky-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    processHubId: z.string().min(1),`;
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
    "buildProcessHubLookupMaps", "buildBpfAuditPayload", "buildBpfDashboardStats", "buildBpfPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapTaskTemplateForStats", "mapApprovalRuleForStats", "mapProcessMetricForStats", "mapProcessExecutionForStats", "mapFailedProcessRecordForStats", "mapRuleValidationForStats", "mapProcessHealthForStats", "mapProcessFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "BpfDashboardStats", "BpfPipelineInfo", "BpfSdkConnectServiceInput", "BpfSdkConnectServiceResult", "BpfSdkIssueApiKeyInput", "BpfSdkIssueApiKeyResult", "BpfSdkRegisterWebhookInput", "BpfSdkRegisterWebhookResult"]).join(",\n    ");

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
        await databaseService.bpfAuditLogs.create(buildBpfAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/business-process.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/business-process-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
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
        if (!context) return buildBpfDashboardStats({ processHubs: [], taskTemplates: [], processExecutions: [], failedProcessRecords: [], processFailures: [], auditLogs: [] });
        const [processHubs, taskTemplatesRaw, approvalRulesRaw, processMetricsRaw, processExecutionsRaw, failedProcessRecordsRaw, ruleValidationsRaw, processHealthRaw, processFailures, auditLogs] = await Promise.all([
            this.getProcessHubs(authUserId, email, fullName),
            databaseService.bpfTaskTemplates.listByOrganization(context.organizationId),
            databaseService.bpfApprovalRules.listByOrganization(context.organizationId),
            databaseService.bpfProcessMetrics.listByOrganization(context.organizationId),
            databaseService.bpfProcessExecutions.listByOrganization(context.organizationId),
            databaseService.bpfFailedProcessRecords.listByOrganization(context.organizationId),
            databaseService.bpfRuleValidations.listByOrganization(context.organizationId),
            databaseService.bpfProcessHealth.listByOrganization(context.organizationId),
            this.getExecutiveFailures(authUserId, email, fullName),
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
${serviceMethods}

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

    async sdkRegisterProcess(authUserId: string, email: string, input: BpfSdkConnectServiceInput, fullName?: string | null): Promise<BpfSdkConnectServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_process", moduleSource: "business_process", inputPayload: { ...input } });
        const created = await this.createBusinessProcess(authUserId, email, { processHubId: input.processHubId, serviceKey: input.serviceKey, serviceName: input.serviceName, providerType: input.providerType, connectorStatus: "connected" }, fullName);
        return { serviceId: created.id, serviceKey: created.serviceKey, connectorStatus: created.connectorStatus };
    }

    async sdkConfigureApproval(authUserId: string, email: string, input: BpfSdkIssueApiKeyInput, fullName?: string | null): Promise<BpfSdkIssueApiKeyResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.keyName, limit: 3 });
        const created = await this.createTaskTemplate(authUserId, email, { processHubId: input.processHubId, keyName: input.keyName, apiVersion: input.apiVersion }, fullName);
        return { apiKeyId: created.id, keyName: created.keyName, status: created.status };
    }

    async sdkRunProcessExecution(authUserId: string, email: string, input: BpfSdkRegisterWebhookInput, fullName?: string | null): Promise<BpfSdkRegisterWebhookResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_process_execution", moduleSource: "business_process", inputPayload: { ...input } });
        const created = await this.createProcessExecution(authUserId, email, { processHubId: input.processHubId, webhookKey: input.webhookKey, webhookName: input.webhookName, targetUrl: input.targetUrl }, fullName);
        return { webhookId: created.id, webhookKey: created.webhookKey, status: created.status };
    }
}

export const businessProcessService = new BusinessProcessService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "BpfDashboardStats", "BpfPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            businessProcessService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await businessProcessService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useBusinessProcess.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { businessProcessService } from "@/src/modules/business-process/services/business-process.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/business-process/types";

export function useBusinessProcess() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<BpfDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<BpfPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [processHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            businessProcessService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(businessProcessService.getPipelineInfo()),
${hookFetchCalls}
            businessProcessService.getAuditLogs(authUserId, email, fullName),
            businessProcessService.getProcessHubOptions(authUserId, email, fullName),
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
        processHubOptions,
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
    }, e.hubField === false ? {} : { processHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <ProcessHubSelect data={data} {...form.register("processHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: BusinessProcessData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise business process ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/BusinessProcessPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { BPF_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/business-process/constants";
import type { useBusinessProcess } from "@/src/modules/business-process/hooks/useBusinessProcess";
import {
${schemaImports}
} from "@/src/modules/business-process/schemas";

type BusinessProcessData = ReturnType<typeof useBusinessProcess>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-sky-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-sky-600">{meta}</p> : null}</div>;
}
function ProcessHubSelect({ data, ...props }: { data: BusinessProcessData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select business process</option>{data.processHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function BusinessProcessOverviewPanel({ data }: { data: BusinessProcessData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Business Process summary" description="System health, background jobs, event bus, failedProcessRecords, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Process Hubs" subtitle={\`\${data.stats?.totalProcessHubs ?? 0} total\`} meta={\`\${data.stats?.activeProcessHubs ?? 0} active • \${data.stats?.taskTemplateCount ?? 0} task templates\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.approvalRuleCount ?? 0} approval rules\`} meta={\`\${data.stats?.processExecutionCount ?? 0} process executions • \${data.stats?.openFailedRecordCount ?? 0} open failed process records\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallProcessScore ?? 0).toFixed(1)} overall process score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first business process" />
            </div></Card>
            <Card hover><SectionHeader title="Business process pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Business process pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function BusinessProcessAuditLogsPanel({ data }: { data: BusinessProcessData }) {
    return (
        <Card hover><SectionHeader title="Business Process audit history" description="Security-first audit trail for jobs, events, failedProcessRecords, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for business process." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function BusinessProcessSdkPanel({ data }: { data: BusinessProcessData }) {
    return (
        <Card hover><SectionHeader title="Shared Business Process SDK" description="Import from @/src/modules/business-process/sdk for process registration, approval configuration, and process execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createBusinessProcessClient()" subtitle="Factory for module-scoped Business Process client with auth context" meta="Primary SDK for enterprise business process" />
            <ListCard title="sdkRegisterProcess()" subtitle="Register business process with AI orchestration" meta="moduleSource: business_process" />
            <ListCard title="sdkConfigureApproval()" subtitle="Configure approval rule with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunProcessExecution()" subtitle="Run process execution with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {BPF_THEME.primary} • Integration hubs loaded: {data.processHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";

const intg = createBusinessProcessClient(userId, email, fullName);
await intg.registerProcess({ processHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureApproval({ processHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runProcessExecution({ processHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/BusinessProcessStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { BpfDashboardStats } from "@/src/modules/business-process/types";

interface BusinessProcessStatsProps { stats: BpfDashboardStats | null; }

export function BusinessProcessStats({ stats }: BusinessProcessStatsProps) {
    const cards = [
        { title: "Process Hubs", value: String(stats?.totalProcessHubs ?? 0), detail: \`\${stats?.activeProcessHubs ?? 0} active • \${stats?.taskTemplateCount ?? 0} task templates\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.approvalRuleCount ?? 0), detail: \`\${stats?.processExecutionCount ?? 0} process executions • \${stats?.openFailedRecordCount ?? 0} open failed process records\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallProcessScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, failedProcessRecords, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-sky-600 dark:[&_p:last-child]:text-sky-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "BusinessProcessOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "BusinessProcessAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "BusinessProcessSdkPanel" },
];

writeFileSync(join(mod, "components/BusinessProcessPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    BusinessProcessOverviewPanel,
    ${panelImports},
    BusinessProcessAuditLogsPanel,
    BusinessProcessSdkPanel,
} from "@/src/modules/business-process/components/BusinessProcessPanels";
import { BusinessProcessStats } from "@/src/modules/business-process/components/BusinessProcessStats";
import { BPF_TABS } from "@/src/modules/business-process/constants";
import { useBusinessProcess } from "@/src/modules/business-process/hooks/useBusinessProcess";

const tabs = [
${tabDefs.map((t) => `    { id: BPF_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function BusinessProcessPage() {
    const businessProcess = useBusinessProcess();
    const [activeTab, setActiveTab] = useState<(typeof BPF_TABS)[keyof typeof BPF_TABS]>(BPF_TABS.overview);

    if (businessProcess.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Business Process" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">V2 Program A Program B Sprint 2</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Business Process</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: task templates, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and business process dashboard with security-first audit and the shared Business Process SDK.
                </p>
            </motion.header>
            <BusinessProcessStats stats={businessProcess.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-sky-600 text-white" : "border border-slate-200 text-slate-600 hover:border-sky-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === BPF_TABS.${t.id} ? <${t.panel} data={businessProcess} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { businessProcessService } from "@/src/modules/business-process/services/business-process.service";
import type { BpfSdkConnectServiceInput, BpfSdkIssueApiKeyInput, BpfSdkRegisterWebhookInput } from "@/src/modules/business-process/types";

export class BusinessProcessClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerProcess(input: BpfSdkConnectServiceInput) {
        return businessProcessService.sdkRegisterProcess(this.authUserId, this.email, input, this.fullName);
    }

    async configureApproval(input: BpfSdkIssueApiKeyInput) {
        return businessProcessService.sdkConfigureApproval(this.authUserId, this.email, input, this.fullName);
    }

    async runProcessExecution(input: BpfSdkRegisterWebhookInput) {
        return businessProcessService.sdkRunProcessExecution(this.authUserId, this.email, input, this.fullName);
    }

    async getProcessHubs() {
        return businessProcessService.getProcessHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return businessProcessService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return businessProcessService.getPipelineInfo();
    }
}

export function createBusinessProcessClient(authUserId: string, email: string, fullName?: string | null): BusinessProcessClient {
    return new BusinessProcessClient(authUserId, email, fullName);
}

export { businessProcessService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { BusinessProcessPage } from "@/src/modules/business-process/components/BusinessProcessPage";
export { BusinessProcessStats } from "@/src/modules/business-process/components/BusinessProcessStats";
export { businessProcessService } from "@/src/modules/business-process/services/business-process.service";
export { useBusinessProcess } from "@/src/modules/business-process/hooks/useBusinessProcess";
export { createBusinessProcessClient, BusinessProcessClient } from "@/src/modules/business-process/sdk";
export * from "@/src/modules/business-process/types";
export * from "@/src/modules/business-process/constants";
`);

console.log(`Generated business process module files. BPF_TABS count: ${tabs.length}`);
