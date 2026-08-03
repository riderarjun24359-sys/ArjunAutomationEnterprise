#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/operations-center");

const entities = [
    { tab: "operationsCenters", plural: "operationsCenters", singular: "OperationsCenter", pascal: "OperationsCenter", db: "eocOperationsCenters", hubField: false, fields: [{ name: "centerKey", type: "string" }, { name: "centerName", type: "string" }, { name: "environment", type: "string" }], display: { title: "centerName", sub: "centerKey" } },
    { tab: "overallHealth", plural: "overallHealth", singular: "OverallHealth", pascal: "OverallHealth", db: "eocOverallHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthType", type: "select", options: "HEALTH_TYPE_OPTIONS" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthType" } },
    { tab: "moduleHealth", plural: "moduleHealth", singular: "ModuleHealth", pascal: "ModuleHealth", db: "eocModuleHealth", fields: [{ name: "healthKey", type: "string" }, { name: "moduleName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "moduleName", sub: "healthKey" } },
    { tab: "databaseHealth", plural: "databaseHealth", singular: "DatabaseHealth", pascal: "DatabaseHealth", db: "eocDatabaseHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "jobSchedulers", plural: "jobSchedulers", singular: "JobScheduler", pascal: "JobScheduler", db: "eocJobSchedulers", fields: [{ name: "schedulerKey", type: "string" }, { name: "schedulerName", type: "string" }, { name: "workerPoolSize", type: "number" }], display: { title: "schedulerName", sub: "schedulerKey" } },
    { tab: "recurringJobs", plural: "recurringJobs", singular: "RecurringJob", pascal: "RecurringJob", db: "eocRecurringJobs", fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobKey" } },
    { tab: "jobRetryQueue", plural: "jobRetryQueue", singular: "JobRetryQueue", pascal: "JobRetryQueue", db: "eocJobRetryQueue", fields: [{ name: "queueKey", type: "string" }, { name: "jobRef", type: "string" }, { name: "priority", type: "number" }], display: { title: "queueKey", sub: "jobRef" } },
    { tab: "jobDeadLetter", plural: "jobDeadLetter", singular: "JobDeadLetter", pascal: "JobDeadLetter", db: "eocJobDeadLetter", fields: [{ name: "deadLetterKey", type: "string" }, { name: "jobRef", type: "string" }, { name: "deadLetterStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "deadLetterKey", sub: "jobRef" } },
    { tab: "platformEvents", plural: "platformEvents", singular: "PlatformEvent", pascal: "PlatformEvent", db: "eocPlatformEvents", fields: [{ name: "eventKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "eventStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "eventKey", sub: "eventType" } },
    { tab: "businessEvents", plural: "businessEvents", singular: "BusinessEvent", pascal: "BusinessEvent", db: "eocBusinessEvents", fields: [{ name: "eventKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "eventStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "eventKey", sub: "eventType" } },
    { tab: "eventSubscriptions", plural: "eventSubscriptions", singular: "EventSubscription", pascal: "EventSubscription", db: "eocEventSubscriptions", fields: [{ name: "subscriptionKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }], display: { title: "subscriptionKey", sub: "eventType" } },
    { tab: "eventReplays", plural: "eventReplays", singular: "EventReplay", pascal: "EventReplay", db: "eocEventReplays", fields: [{ name: "replayKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "replayStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "replayKey", sub: "eventType" } },
    { tab: "alerts", plural: "alerts", singular: "Alert", pascal: "Alert", db: "eocAlerts", fields: [{ name: "alertKey", type: "string" }, { name: "alertSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }, { name: "alertStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "alertKey", sub: "alertSeverity" } },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: "eocEscalationRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "alertSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "ruleName", sub: "ruleKey" } },
    { tab: "alertAcknowledgements", plural: "alertAcknowledgements", singular: "AlertAcknowledgement", pascal: "AlertAcknowledgement", db: "eocAlertAcknowledgements", fields: [{ name: "ackKey", type: "string" }, { name: "ackStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "ackKey", sub: "ackKey" } },
    { tab: "maintenanceWindows", plural: "maintenanceWindows", singular: "MaintenanceWindow", pascal: "MaintenanceWindow", db: "eocMaintenanceWindows", fields: [{ name: "windowKey", type: "string" }, { name: "windowName", type: "string" }], display: { title: "windowName", sub: "windowKey" } },
    { tab: "globalFlags", plural: "globalFlags", singular: "GlobalFlag", pascal: "GlobalFlag", db: "eocGlobalFlags", fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "flagName", sub: "flagKey" } },
    { tab: "tenantFlags", plural: "tenantFlags", singular: "TenantFlag", pascal: "TenantFlag", db: "eocTenantFlags", fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "flagName", sub: "flagKey" } },
    { tab: "betaFeatures", plural: "betaFeatures", singular: "BetaFeature", pascal: "BetaFeature", db: "eocBetaFeatures", fields: [{ name: "featureKey", type: "string" }, { name: "featureName", type: "string" }], display: { title: "featureName", sub: "featureKey" } },
    { tab: "rolloutConfigs", plural: "rolloutConfigs", singular: "RolloutConfig", pascal: "RolloutConfig", db: "eocRolloutConfigs", fields: [{ name: "rolloutKey", type: "string" }, { name: "flagKey", type: "string" }, { name: "rolloutPercent", type: "number" }], display: { title: "rolloutKey", sub: "flagKey" } },
    { tab: "platformConfigs", plural: "platformConfigs", singular: "PlatformConfig", pascal: "PlatformConfig", db: "eocPlatformConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }], display: { title: "configName", sub: "configKey" } },
    { tab: "tenantConfigs", plural: "tenantConfigs", singular: "TenantConfig", pascal: "TenantConfig", db: "eocTenantConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }], display: { title: "configName", sub: "configKey" } },
    { tab: "secretsMetadata", plural: "secretsMetadata", singular: "SecretsMetadata", pascal: "SecretsMetadata", db: "eocSecretsMetadata", fields: [{ name: "secretKey", type: "string" }, { name: "secretName", type: "string" }], display: { title: "secretName", sub: "secretKey" } },
    { tab: "configVersions", plural: "configVersions", singular: "ConfigVersion", pascal: "ConfigVersion", db: "eocConfigVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }], display: { title: "versionNumber", sub: "versionKey" } },
    { tab: "platformLogs", plural: "platformLogs", singular: "PlatformLog", pascal: "PlatformLog", db: "eocPlatformLogs", fields: [{ name: "logKey", type: "string" }, { name: "logLevel", type: "select", options: "LOG_LEVEL_OPTIONS" }], display: { title: "logKey", sub: "logLevel" } },
    { tab: "platformMetrics", plural: "platformMetrics", singular: "PlatformMetric", pascal: "PlatformMetric", db: "eocPlatformMetrics", fields: [{ name: "metricsKey", type: "string" }, { name: "dependencyHealth", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "traceSummaries", plural: "traceSummaries", singular: "TraceSummary", pascal: "TraceSummary", db: "eocTraceSummaries", fields: [{ name: "traceKey", type: "string" }, { name: "spanCount", type: "number" }], display: { title: "traceKey", sub: "traceKey" } },
    { tab: "serviceRegistry", plural: "serviceRegistry", singular: "ServiceRegistry", pascal: "ServiceRegistry", db: "eocServiceRegistry", fields: [{ name: "serviceKey", type: "string" }, { name: "serviceName", type: "string" }, { name: "cacheStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "serviceName", sub: "serviceKey" } },
    { tab: "operationsMetrics", plural: "operationsMetrics", singular: "OperationsMetric", pascal: "OperationsMetric", db: "eocOperationsMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "operationalScore", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "operationsHealth", plural: "operationsHealth", singular: "OperationsHealth", pascal: "OperationsHealth", db: "eocOperationsHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "operationsFailures", plural: "operationsFailures", singular: "OperationsFailure", pascal: "OperationsFailure", db: "eocOperationsFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const EOC_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const HEALTH_TYPE_OPTIONS = [
    { value: "google", label: "Google" },
    { value: "stripe", label: "Stripe" },
    { value: "microsoft", label: "Microsoft" },
    { value: "quickbooks", label: "QuickBooks" },
    { value: "xero", label: "Xero" },
    { value: "razorpay", label: "Razorpay" },
    { value: "salesforce", label: "Salesforce" },
    { value: "custom", label: "Custom" },
] as const;

export const JOB_STATUS_OPTIONS = [
    { value: "configured", label: "Configured" },
    { value: "connected", label: "Connected" },
    { value: "syncing", label: "Syncing" },
    { value: "active", label: "Active" },
    { value: "degraded", label: "Degraded" },
    { value: "disconnected", label: "Disconnected" },
    { value: "failed", label: "Failed" },
] as const;

export const JOB_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
] as const;

export const LOG_LEVEL_OPTIONS = [
    { value: "v1", label: "v1" },
    { value: "v2", label: "v2" },
    { value: "v3", label: "v3" },
] as const;

export const EOC_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "connected", label: "Connected" },
    { value: "failed", label: "Failed" },
    { value: "healthy", label: "Healthy" },
] as const;

export const EOC_PERMISSIONS = ["intg.view", "eoc.manage", "eoc.approve", "eoc.admin"] as const;

export const EOC_THEME = {
    primary: "emerald-600",
    primaryHover: "emerald-500",
    ring: "emerald-500/20",
    text: "text-emerald-600",
    textDark: "dark:text-emerald-400",
    bg: "bg-emerald-600",
    bgHover: "hover:bg-emerald-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    operationsCenterId: z.string().min(1),`;
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
    "buildOperationsCenterLookupMaps", "buildEocAuditPayload", "buildEocDashboardStats", "buildEocPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapOverallHealthForStats", "mapJobSchedulerForStats", "mapPlatformEventForStats", "mapJobRetryQueueForStats", "mapAlertForStats", "mapModuleHealthForStats", "mapOperationsHealthForStats", "mapOperationsFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "EocDashboardStats", "EocPipelineInfo", "EocSdkConnectServiceInput", "EocSdkConnectServiceResult", "EocSdkIssueApiKeyInput", "EocSdkIssueApiKeyResult", "EocSdkRegisterWebhookInput", "EocSdkRegisterWebhookResult"]).join(",\n    ");

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
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/operations-center.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/operations-center-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/operations-center/types";

export class OperationsCenterService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const integrationHubs = await databaseService.eocOperationsCenters.listByOrganization(organizationId);
        return buildOperationsCenterLookupMaps(integrationHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<EocDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildEocDashboardStats({ integrationHubs: [], overallHealth: [], jobRetryQueue: [], alerts: [], operationsFailures: [], auditLogs: [] });
        const [integrationHubs, overallHealthRaw, jobSchedulersRaw, platformEventsRaw, jobRetryQueueRaw, alertsRaw, moduleHealthRaw, operationsHealthRaw, operationsFailures, auditLogs] = await Promise.all([
            this.getOperationsCenters(authUserId, email, fullName),
            databaseService.eocConnectedServices.listByOrganization(context.organizationId),
            databaseService.eocPaymentConnectors.listByOrganization(context.organizationId),
            databaseService.eocAccountingConnectors.listByOrganization(context.organizationId),
            databaseService.eocPaymentRetryQueue.listByOrganization(context.organizationId),
            databaseService.eocPaymentTransactions.listByOrganization(context.organizationId),
            databaseService.eocConnectorHealth.listByOrganization(context.organizationId),
            databaseService.eocIntegrationHealth.listByOrganization(context.organizationId),
            this.getIntegrationFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildEocDashboardStats({
            integrationHubs,
            overallHealth: overallHealthRaw.map(mapOverallHealthForStats),
            jobSchedulers: jobSchedulersRaw.map(mapJobSchedulerForStats),
            platformEvents: platformEventsRaw.map(mapPlatformEventForStats),
            jobRetryQueue: jobRetryQueueRaw.map(mapJobRetryQueueForStats),
            alerts: alertsRaw.map(mapAlertForStats),
            moduleHealth: moduleHealthRaw.map(mapModuleHealthForStats),
            operationsHealth: operationsHealthRaw.map(mapOperationsHealthForStats),
            operationsFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): EocPipelineInfo {
        return buildEocPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eocAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getOperationsCenterOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eocOperationsCenters.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkPublishEvent(authUserId: string, email: string, input: EocSdkConnectServiceInput, fullName?: string | null): Promise<EocSdkConnectServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "connect_service", moduleSource: "operations_center", inputPayload: { ...input } });
        const created = await this.createPlatformEvent(authUserId, email, { operationsCenterId: input.operationsCenterId, serviceKey: input.serviceKey, serviceName: input.serviceName, providerType: input.providerType, connectorStatus: "connected" }, fullName);
        return { serviceId: created.id, serviceKey: created.serviceKey, connectorStatus: created.connectorStatus };
    }

    async sdkScheduleJob(authUserId: string, email: string, input: EocSdkIssueApiKeyInput, fullName?: string | null): Promise<EocSdkIssueApiKeyResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.keyName, limit: 3 });
        const created = await this.createJobScheduler(authUserId, email, { operationsCenterId: input.operationsCenterId, keyName: input.keyName, apiVersion: input.apiVersion }, fullName);
        return { apiKeyId: created.id, keyName: created.keyName, status: created.status };
    }

    async sdkTriggerAlert(authUserId: string, email: string, input: EocSdkRegisterWebhookInput, fullName?: string | null): Promise<EocSdkRegisterWebhookResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_webhook", moduleSource: "operations_center", inputPayload: { ...input } });
        const created = await this.createAlert(authUserId, email, { operationsCenterId: input.operationsCenterId, webhookKey: input.webhookKey, webhookName: input.webhookName, targetUrl: input.targetUrl }, fullName);
        return { webhookId: created.id, webhookKey: created.webhookKey, status: created.status };
    }
}

export const operationsCenterService = new OperationsCenterService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "EocDashboardStats", "EocPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            operationsCenterService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useOperationsCenter.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { operationsCenterService } from "@/src/modules/operations-center/services/operations-center.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/operations-center/types";

export function useOperationsCenter() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<EocDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<EocPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [operationsCenterOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            centerOpts,
        ] = await Promise.all([
            operationsCenterService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(operationsCenterService.getPipelineInfo()),
${hookFetchCalls}
            operationsCenterService.getAuditLogs(authUserId, email, fullName),
            operationsCenterService.getOperationsCenterOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            centerOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.centerOpts);
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
        operationsCenterOptions,
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
    }, e.hubField === false ? {} : { operationsCenterId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <OperationsCenterSelect data={data} {...form.register("operationsCenterId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: OperationsCenterData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise operations center ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.centerName ? item.centerName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
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

writeFileSync(join(mod, "components/OperationsCenterPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EOC_THEME, HEALTH_TYPE_OPTIONS, JOB_STATUS_OPTIONS, JOB_STATUS_OPTIONS, LOG_LEVEL_OPTIONS } from "@/src/modules/operations-center/constants";
import type { useOperationsCenter } from "@/src/modules/operations-center/hooks/useOperationsCenter";
import {
${schemaImports}
} from "@/src/modules/operations-center/schemas";

type OperationsCenterData = ReturnType<typeof useOperationsCenter>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}</div>;
}
function OperationsCenterSelect({ data, ...props }: { data: OperationsCenterData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select operations center</option>{data.operationsCenterOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function OperationsCenterOverviewPanel({ data }: { data: OperationsCenterData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Operations Center summary" description="System health, background jobs, event bus, alerts, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Operations Centers" subtitle={\`\${data.stats?.totalOperationsCenters ?? 0} total\`} meta={\`\${data.stats?.activeOperationsCenters ?? 0} active • \${data.stats?.overallHealthCount ?? 0} connected services\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.activeJobCount ?? 0} active jobs\`} meta={\`\${data.stats?.pendingRetryCount ?? 0} pending retries • \${data.stats?.openAlertCount ?? 0} failed transactions\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.avgHealthScore ?? 0).toFixed(1)} avg health score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first operations center" />
            </div></Card>
            <Card hover><SectionHeader title="Operations pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Operations pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function OperationsCenterAuditLogsPanel({ data }: { data: OperationsCenterData }) {
    return (
        <Card hover><SectionHeader title="Operations Center audit history" description="Security-first audit trail for jobs, events, alerts, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for operations center." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function OperationsCenterSdkPanel({ data }: { data: OperationsCenterData }) {
    return (
        <Card hover><SectionHeader title="Shared Operations Center SDK" description="Import from @/src/modules/operations-center/sdk for service connection, API key issuance, and webhook registration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createOperationsCenterClient()" subtitle="Factory for module-scoped Operations Center client with auth context" meta="Primary SDK for enterprise operations center" />
            <ListCard title="sdkPublishEvent()" subtitle="Publish platform event with AI orchestration" meta="moduleSource: operations_center" />
            <ListCard title="sdkScheduleJob()" subtitle="Schedule background job with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkTriggerAlert()" subtitle="Trigger operational alert with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {EOC_THEME.primary} • Integration hubs loaded: {data.integrationHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createOperationsCenterClient } from "@/src/modules/operations-center/sdk";

const intg = createOperationsCenterClient(userId, email, fullName);
await intg.publishEvent({ operationsCenterId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.scheduleJob({ operationsCenterId, keyName: "prod-key", apiVersion: "v1" });
await intg.triggerAlert({ operationsCenterId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/OperationsCenterStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { EocDashboardStats } from "@/src/modules/operations-center/types";

interface OperationsCenterStatsProps { stats: EocDashboardStats | null; }

export function OperationsCenterStats({ stats }: OperationsCenterStatsProps) {
    const cards = [
        { title: "Operations Centers", value: String(stats?.totalOperationsCenters ?? 0), detail: \`\${stats?.activeOperationsCenters ?? 0} active • \${stats?.overallHealthCount ?? 0} connected services\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.activeJobCount ?? 0), detail: \`\${stats?.pendingRetryCount ?? 0} pending retries • \${stats?.openAlertCount ?? 0} failed transactions\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.avgHealthScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, alerts, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-emerald-600 dark:[&_p:last-child]:text-emerald-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "OperationsCenterOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "OperationsCenterAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "OperationsCenterSdkPanel" },
];

writeFileSync(join(mod, "components/OperationsCenterPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    OperationsCenterOverviewPanel,
    ${panelImports},
    OperationsCenterAuditLogsPanel,
    OperationsCenterSdkPanel,
} from "@/src/modules/operations-center/components/OperationsCenterPanels";
import { OperationsCenterStats } from "@/src/modules/operations-center/components/OperationsCenterStats";
import { EOC_TABS } from "@/src/modules/operations-center/constants";
import { useOperationsCenter } from "@/src/modules/operations-center/hooks/useOperationsCenter";

const tabs = [
${tabDefs.map((t) => `    { id: EOC_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function OperationsCenterPage() {
    const operationsCenter = useOperationsCenter();
    const [activeTab, setActiveTab] = useState<(typeof EOC_TABS)[keyof typeof EOC_TABS]>(EOC_TABS.overview);

    if (operationsCenter.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Operations Center" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">V2 Program A Sprint 7</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Operations Center</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: connected services, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and operations center dashboard with security-first audit and the shared Operations Center SDK.
                </p>
            </motion.header>
            <OperationsCenterStats stats={operationsCenter.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === EOC_TABS.${t.id} ? <${t.panel} data={operationsCenter} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { operationsCenterService } from "@/src/modules/operations-center/services/operations-center.service";
import type { EocSdkConnectServiceInput, EocSdkIssueApiKeyInput, EocSdkRegisterWebhookInput } from "@/src/modules/operations-center/types";

export class OperationsCenterClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async publishEvent(input: EocSdkConnectServiceInput) {
        return operationsCenterService.sdkPublishEvent(this.authUserId, this.email, input, this.fullName);
    }

    async scheduleJob(input: EocSdkIssueApiKeyInput) {
        return operationsCenterService.sdkScheduleJob(this.authUserId, this.email, input, this.fullName);
    }

    async triggerAlert(input: EocSdkRegisterWebhookInput) {
        return operationsCenterService.sdkTriggerAlert(this.authUserId, this.email, input, this.fullName);
    }

    async getOperationsCenters() {
        return operationsCenterService.getOperationsCenters(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return operationsCenterService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return operationsCenterService.getPipelineInfo();
    }
}

export function createOperationsCenterClient(authUserId: string, email: string, fullName?: string | null): OperationsCenterClient {
    return new OperationsCenterClient(authUserId, email, fullName);
}

export { operationsCenterService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { OperationsCenterPage } from "@/src/modules/operations-center/components/OperationsCenterPage";
export { OperationsCenterStats } from "@/src/modules/operations-center/components/OperationsCenterStats";
export { operationsCenterService } from "@/src/modules/operations-center/services/operations-center.service";
export { useOperationsCenter } from "@/src/modules/operations-center/hooks/useOperationsCenter";
export { createOperationsCenterClient, OperationsCenterClient } from "@/src/modules/operations-center/sdk";
export * from "@/src/modules/operations-center/types";
export * from "@/src/modules/operations-center/constants";
`);

console.log(`Generated operations center module files. EOC_TABS count: ${tabs.length}`);
