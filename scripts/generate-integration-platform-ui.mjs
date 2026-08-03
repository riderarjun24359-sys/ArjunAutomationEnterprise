#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/integration-platform");

const entities = [
    { tab: "integrationHubs", plural: "integrationHubs", singular: "IntegrationHub", pascal: "IntegrationHub", db: "intgIntegrationHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "connectedServices", plural: "connectedServices", singular: "ConnectedService", pascal: "ConnectedService", db: "intgConnectedServices", fields: [{ name: "serviceKey", type: "string" }, { name: "serviceName", type: "string" }, { name: "providerType", type: "select", options: "PROVIDER_TYPE_OPTIONS" }, { name: "connectorStatus", type: "select", options: "CONNECTOR_STATUS_OPTIONS" }], display: { title: "serviceName", sub: "serviceKey" } },
    { tab: "connectorConfigs", plural: "connectorConfigs", singular: "ConnectorConfig", pascal: "ConnectorConfig", db: "intgConnectorConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "providerType", type: "select", options: "PROVIDER_TYPE_OPTIONS" }, { name: "apiVersion", type: "select", options: "API_VERSION_OPTIONS" }], display: { title: "configName", sub: "configKey" } },
    { tab: "connectorHealth", plural: "connectorHealth", singular: "ConnectorHealth", pascal: "ConnectorHealth", db: "intgConnectorHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "paymentConnectors", plural: "paymentConnectors", singular: "PaymentConnector", pascal: "PaymentConnector", db: "intgPaymentConnectors", fields: [{ name: "connectorKey", type: "string" }, { name: "connectorName", type: "string" }, { name: "providerType", type: "select", options: "PROVIDER_TYPE_OPTIONS" }, { name: "connectorStatus", type: "select", options: "CONNECTOR_STATUS_OPTIONS" }], display: { title: "connectorName", sub: "connectorKey" } },
    { tab: "paymentConnectorHealth", plural: "paymentConnectorHealth", singular: "PaymentConnectorHealth", pascal: "PaymentConnectorHealth", db: "intgPaymentConnectorHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "paymentRetryQueue", plural: "paymentRetryQueue", singular: "PaymentRetryQueue", pascal: "PaymentRetryQueue", db: "intgPaymentRetryQueue", fields: [{ name: "queueKey", type: "string" }, { name: "transactionRef", type: "string" }], display: { title: "queueKey", sub: "queueKey" } },
    { tab: "paymentTransactions", plural: "paymentTransactions", singular: "PaymentTransaction", pascal: "PaymentTransaction", db: "intgPaymentTransactions", fields: [{ name: "transactionKey", type: "string" }, { name: "amount", type: "number" }, { name: "transactionStatus", type: "select", options: "API_STATUS_OPTIONS" }], display: { title: "transactionKey", sub: "transactionKey" } },
    { tab: "accountingConnectors", plural: "accountingConnectors", singular: "AccountingConnector", pascal: "AccountingConnector", db: "intgAccountingConnectors", fields: [{ name: "connectorKey", type: "string" }, { name: "connectorName", type: "string" }, { name: "providerType", type: "select", options: "PROVIDER_TYPE_OPTIONS" }], display: { title: "connectorName", sub: "connectorKey" } },
    { tab: "accountingSyncStatus", plural: "accountingSyncStatus", singular: "AccountingSyncStatus", pascal: "AccountingSyncStatus", db: "intgAccountingSyncStatus", fields: [{ name: "syncKey", type: "string" }, { name: "entityType", type: "string" }, { name: "syncStatus", type: "select", options: "CONNECTOR_STATUS_OPTIONS" }], display: { title: "syncKey", sub: "entityType" } },
    { tab: "exportMappings", plural: "exportMappings", singular: "ExportMapping", pascal: "ExportMapping", db: "intgExportMappings", fields: [{ name: "mappingKey", type: "string" }, { name: "mappingName", type: "string" }], display: { title: "mappingName", sub: "mappingKey" } },
    { tab: "accountingExports", plural: "accountingExports", singular: "AccountingExport", pascal: "AccountingExport", db: "intgAccountingExports", fields: [{ name: "exportKey", type: "string" }, { name: "exportType", type: "string" }, { name: "exportStatus", type: "select", options: "API_STATUS_OPTIONS" }], display: { title: "exportKey", sub: "exportType" } },
    { tab: "apiKeys", plural: "apiKeys", singular: "ApiKey", pascal: "ApiKey", db: "intgApiKeys", fields: [{ name: "keyName", type: "string" }, { name: "keyPrefix", type: "string" }, { name: "apiVersion", type: "select", options: "API_VERSION_OPTIONS" }], display: { title: "keyName", sub: "apiVersion" } },
    { tab: "apiScopes", plural: "apiScopes", singular: "ApiScope", pascal: "ApiScope", db: "intgApiScopes", fields: [{ name: "scopeKey", type: "string" }, { name: "scopeName", type: "string" }], display: { title: "scopeName", sub: "scopeKey" } },
    { tab: "rateLimits", plural: "rateLimits", singular: "RateLimit", pascal: "RateLimit", db: "intgRateLimits", fields: [{ name: "limitKey", type: "string" }, { name: "limitName", type: "string" }, { name: "rateLimitRpm", type: "number" }], display: { title: "limitName", sub: "limitKey" } },
    { tab: "apiUsage", plural: "apiUsage", singular: "ApiUsage", pascal: "ApiUsage", db: "intgApiUsage", fields: [{ name: "usageKey", type: "string" }, { name: "endpoint", type: "string" }, { name: "requestCount", type: "number" }], display: { title: "usageKey", sub: "endpoint" } },
    { tab: "incomingWebhooks", plural: "incomingWebhooks", singular: "IncomingWebhook", pascal: "IncomingWebhook", db: "intgIncomingWebhooks", fields: [{ name: "webhookKey", type: "string" }, { name: "webhookName", type: "string" }, { name: "providerType", type: "select", options: "PROVIDER_TYPE_OPTIONS" }], display: { title: "webhookName", sub: "webhookKey" } },
    { tab: "outgoingWebhooks", plural: "outgoingWebhooks", singular: "OutgoingWebhook", pascal: "OutgoingWebhook", db: "intgOutgoingWebhooks", fields: [{ name: "webhookKey", type: "string" }, { name: "webhookName", type: "string" }, { name: "targetUrl", type: "string" }], display: { title: "webhookName", sub: "webhookKey" } },
    { tab: "webhookDeadLetter", plural: "webhookDeadLetter", singular: "WebhookDeadLetter", pascal: "WebhookDeadLetter", db: "intgWebhookDeadLetter", fields: [{ name: "deadLetterKey", type: "string" }, { name: "eventType", type: "string" }, { name: "deadLetterStatus", type: "select", options: "API_STATUS_OPTIONS" }], display: { title: "deadLetterKey", sub: "eventType" } },
    { tab: "webhookDeliveryLogs", plural: "webhookDeliveryLogs", singular: "WebhookDeliveryLog", pascal: "WebhookDeliveryLog", db: "intgWebhookDeliveryLogs", fields: [{ name: "deliveryKey", type: "string" }, { name: "eventType", type: "string" }, { name: "deliveryStatus", type: "select", options: "API_STATUS_OPTIONS" }], display: { title: "deliveryKey", sub: "eventType" } },
    { tab: "marketplaceConnectors", plural: "marketplaceConnectors", singular: "MarketplaceConnector", pascal: "MarketplaceConnector", db: "intgMarketplaceConnectors", fields: [{ name: "connectorSlug", type: "string" }, { name: "connectorName", type: "string" }, { name: "providerType", type: "select", options: "PROVIDER_TYPE_OPTIONS" }], display: { title: "connectorName", sub: "connectorSlug" } },
    { tab: "marketplaceInstallations", plural: "marketplaceInstallations", singular: "MarketplaceInstallation", pascal: "MarketplaceInstallation", db: "intgMarketplaceInstallations", fields: [{ name: "installationKey", type: "string" }, { name: "connectorStatus", type: "select", options: "CONNECTOR_STATUS_OPTIONS" }], display: { title: "installationKey", sub: "installationKey" } },
    { tab: "marketplaceCompatibility", plural: "marketplaceCompatibility", singular: "MarketplaceCompatibility", pascal: "MarketplaceCompatibility", db: "intgMarketplaceCompatibility", fields: [{ name: "compatibilityKey", type: "string" }, { name: "minApiVersion", type: "select", options: "API_VERSION_OPTIONS" }], display: { title: "compatibilityKey", sub: "minApiVersion" } },
    { tab: "marketplaceVersions", plural: "marketplaceVersions", singular: "MarketplaceVersion", pascal: "MarketplaceVersion", db: "intgMarketplaceVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }], display: { title: "versionNumber", sub: "versionKey" } },
    { tab: "apiAnalytics", plural: "apiAnalytics", singular: "ApiAnalytics", pascal: "ApiAnalytics", db: "intgApiAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "errorRate", type: "number" }], display: { title: "analyticsKey", sub: "analyticsKey" } },
    { tab: "latencyMetrics", plural: "latencyMetrics", singular: "LatencyMetric", pascal: "LatencyMetric", db: "intgLatencyMetrics", fields: [{ name: "metricsKey", type: "string" }, { name: "p95Ms", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "webhookAnalytics", plural: "webhookAnalytics", singular: "WebhookAnalytics", pascal: "WebhookAnalytics", db: "intgWebhookAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "successRate", type: "number" }], display: { title: "analyticsKey", sub: "analyticsKey" } },
    { tab: "usageTrends", plural: "usageTrends", singular: "UsageTrend", pascal: "UsageTrend", db: "intgUsageTrends", fields: [{ name: "trendKey", type: "string" }, { name: "trendDirection", type: "string" }], display: { title: "trendKey", sub: "trendDirection" } },
    { tab: "integrationMetrics", plural: "integrationMetrics", singular: "IntegrationMetric", pascal: "IntegrationMetric", db: "intgIntegrationMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallSuccessRate", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "integrationHealth", plural: "integrationHealth", singular: "IntegrationHealth", pascal: "IntegrationHealth", db: "intgIntegrationHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "integrationFailures", plural: "integrationFailures", singular: "IntegrationFailure", pascal: "IntegrationFailure", db: "intgIntegrationFailures", fields: [{ name: "failureKey", type: "string" }, { name: "providerType", type: "select", options: "PROVIDER_TYPE_OPTIONS" }], display: { title: "failureKey", sub: "providerType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const INTG_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const PROVIDER_TYPE_OPTIONS = [
    { value: "google", label: "Google" },
    { value: "stripe", label: "Stripe" },
    { value: "microsoft", label: "Microsoft" },
    { value: "quickbooks", label: "QuickBooks" },
    { value: "xero", label: "Xero" },
    { value: "razorpay", label: "Razorpay" },
    { value: "salesforce", label: "Salesforce" },
    { value: "custom", label: "Custom" },
] as const;

export const CONNECTOR_STATUS_OPTIONS = [
    { value: "configured", label: "Configured" },
    { value: "connected", label: "Connected" },
    { value: "syncing", label: "Syncing" },
    { value: "active", label: "Active" },
    { value: "degraded", label: "Degraded" },
    { value: "disconnected", label: "Disconnected" },
    { value: "failed", label: "Failed" },
] as const;

export const API_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
] as const;

export const API_VERSION_OPTIONS = [
    { value: "v1", label: "v1" },
    { value: "v2", label: "v2" },
    { value: "v3", label: "v3" },
] as const;

export const INTG_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "connected", label: "Connected" },
    { value: "failed", label: "Failed" },
    { value: "healthy", label: "Healthy" },
] as const;

export const INTG_PERMISSIONS = ["intg.view", "intg.manage", "intg.approve", "intg.admin"] as const;

export const INTG_THEME = {
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
    const hubId = e.hubField === false ? "" : `\n    integrationHubId: z.string().min(1),`;
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
    "buildIntegrationHubLookupMaps", "buildIntgAuditPayload", "buildIntgDashboardStats", "buildIntgPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapConnectedServiceForStats", "mapPaymentConnectorForStats", "mapAccountingConnectorForStats", "mapPaymentRetryQueueForStats", "mapPaymentTransactionForStats", "mapConnectorHealthForStats", "mapIntegrationHealthForStats", "mapIntegrationFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "IntgDashboardStats", "IntgPipelineInfo", "IntgSdkConnectServiceInput", "IntgSdkConnectServiceResult", "IntgSdkIssueApiKeyInput", "IntgSdkIssueApiKeyResult", "IntgSdkRegisterWebhookInput", "IntgSdkRegisterWebhookResult"]).join(",\n    ");

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
        await databaseService.intgAuditLogs.create(buildIntgAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/integration-platform.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/integration-platform-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/integration-platform/types";

export class IntegrationPlatformService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const integrationHubs = await databaseService.intgIntegrationHubs.listByOrganization(organizationId);
        return buildIntegrationHubLookupMaps(integrationHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<IntgDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildIntgDashboardStats({ integrationHubs: [], connectedServices: [], paymentRetryQueue: [], paymentTransactions: [], integrationFailures: [], auditLogs: [] });
        const [integrationHubs, connectedServicesRaw, paymentConnectorsRaw, accountingConnectorsRaw, paymentRetryQueueRaw, paymentTransactionsRaw, connectorHealthRaw, integrationHealthRaw, integrationFailures, auditLogs] = await Promise.all([
            this.getIntegrationHubs(authUserId, email, fullName),
            databaseService.intgConnectedServices.listByOrganization(context.organizationId),
            databaseService.intgPaymentConnectors.listByOrganization(context.organizationId),
            databaseService.intgAccountingConnectors.listByOrganization(context.organizationId),
            databaseService.intgPaymentRetryQueue.listByOrganization(context.organizationId),
            databaseService.intgPaymentTransactions.listByOrganization(context.organizationId),
            databaseService.intgConnectorHealth.listByOrganization(context.organizationId),
            databaseService.intgIntegrationHealth.listByOrganization(context.organizationId),
            this.getIntegrationFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildIntgDashboardStats({
            integrationHubs,
            connectedServices: connectedServicesRaw.map(mapConnectedServiceForStats),
            paymentConnectors: paymentConnectorsRaw.map(mapPaymentConnectorForStats),
            accountingConnectors: accountingConnectorsRaw.map(mapAccountingConnectorForStats),
            paymentRetryQueue: paymentRetryQueueRaw.map(mapPaymentRetryQueueForStats),
            paymentTransactions: paymentTransactionsRaw.map(mapPaymentTransactionForStats),
            connectorHealth: connectorHealthRaw.map(mapConnectorHealthForStats),
            integrationHealth: integrationHealthRaw.map(mapIntegrationHealthForStats),
            integrationFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): IntgPipelineInfo {
        return buildIntgPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.intgAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getIntegrationHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.intgIntegrationHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkConnectService(authUserId: string, email: string, input: IntgSdkConnectServiceInput, fullName?: string | null): Promise<IntgSdkConnectServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "connect_service", moduleSource: "integration_platform", inputPayload: { ...input } });
        const created = await this.createConnectedService(authUserId, email, { integrationHubId: input.integrationHubId, serviceKey: input.serviceKey, serviceName: input.serviceName, providerType: input.providerType, connectorStatus: "connected" }, fullName);
        return { serviceId: created.id, serviceKey: created.serviceKey, connectorStatus: created.connectorStatus };
    }

    async sdkIssueApiKey(authUserId: string, email: string, input: IntgSdkIssueApiKeyInput, fullName?: string | null): Promise<IntgSdkIssueApiKeyResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.keyName, limit: 3 });
        const created = await this.createApiKey(authUserId, email, { integrationHubId: input.integrationHubId, keyName: input.keyName, apiVersion: input.apiVersion }, fullName);
        return { apiKeyId: created.id, keyName: created.keyName, status: created.status };
    }

    async sdkRegisterWebhook(authUserId: string, email: string, input: IntgSdkRegisterWebhookInput, fullName?: string | null): Promise<IntgSdkRegisterWebhookResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_webhook", moduleSource: "integration_platform", inputPayload: { ...input } });
        const created = await this.createOutgoingWebhook(authUserId, email, { integrationHubId: input.integrationHubId, webhookKey: input.webhookKey, webhookName: input.webhookName, targetUrl: input.targetUrl }, fullName);
        return { webhookId: created.id, webhookKey: created.webhookKey, status: created.status };
    }
}

export const integrationPlatformService = new IntegrationPlatformService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "IntgDashboardStats", "IntgPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            integrationPlatformService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useIntegrationPlatform.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { integrationPlatformService } from "@/src/modules/integration-platform/services/integration-platform.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/integration-platform/types";

export function useIntegrationPlatform() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IntgDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<IntgPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [integrationHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            integrationPlatformService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(integrationPlatformService.getPipelineInfo()),
${hookFetchCalls}
            integrationPlatformService.getAuditLogs(authUserId, email, fullName),
            integrationPlatformService.getIntegrationHubOptions(authUserId, email, fullName),
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
        integrationHubOptions,
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
    }, e.hubField === false ? {} : { integrationHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise integration platform ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/IntegrationPlatformPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { INTG_THEME, PROVIDER_TYPE_OPTIONS, CONNECTOR_STATUS_OPTIONS, API_STATUS_OPTIONS, API_VERSION_OPTIONS } from "@/src/modules/integration-platform/constants";
import type { useIntegrationPlatform } from "@/src/modules/integration-platform/hooks/useIntegrationPlatform";
import {
${schemaImports}
} from "@/src/modules/integration-platform/schemas";

type IntegrationPlatformData = ReturnType<typeof useIntegrationPlatform>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-indigo-600">{meta}</p> : null}</div>;
}
function IntegrationHubSelect({ data, ...props }: { data: IntegrationPlatformData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select integration hub</option>{data.integrationHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function IntegrationPlatformOverviewPanel({ data }: { data: IntegrationPlatformData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Integration Platform summary" description="Connected services, payment & accounting connectors, public API, webhooks, marketplace, analytics, and ops dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Integration Hubs" subtitle={\`\${data.stats?.totalIntegrationHubs ?? 0} total\`} meta={\`\${data.stats?.activeIntegrationHubs ?? 0} active • \${data.stats?.connectedServiceCount ?? 0} connected services\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.activeConnectorCount ?? 0} active connectors\`} meta={\`\${data.stats?.pendingRetryCount ?? 0} pending retries • \${data.stats?.failedTransactionCount ?? 0} failed transactions\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.avgHealthScore ?? 0).toFixed(1)} avg health score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first integration operations" />
            </div></Card>
            <Card hover><SectionHeader title="Integration pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Integration pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function IntegrationPlatformAuditLogsPanel({ data }: { data: IntegrationPlatformData }) {
    return (
        <Card hover><SectionHeader title="Integration Platform audit history" description="Security-first audit trail for connectors, API keys, webhooks, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for integration operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function IntegrationPlatformSdkPanel({ data }: { data: IntegrationPlatformData }) {
    return (
        <Card hover><SectionHeader title="Shared Integration Platform SDK" description="Import from @/src/modules/integration-platform/sdk for service connection, API key issuance, and webhook registration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createIntegrationPlatformClient()" subtitle="Factory for module-scoped Integration Platform client with auth context" meta="Primary SDK for enterprise integration operations" />
            <ListCard title="sdkConnectService()" subtitle="Connect external service with AI orchestration" meta="moduleSource: integration_platform" />
            <ListCard title="sdkIssueApiKey()" subtitle="Issue API key with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRegisterWebhook()" subtitle="Register outgoing webhook with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {INTG_THEME.primary} • Integration hubs loaded: {data.integrationHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";

const intg = createIntegrationPlatformClient(userId, email, fullName);
await intg.connectService({ integrationHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.issueApiKey({ integrationHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.registerWebhook({ integrationHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/IntegrationPlatformStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { IntgDashboardStats } from "@/src/modules/integration-platform/types";

interface IntegrationPlatformStatsProps { stats: IntgDashboardStats | null; }

export function IntegrationPlatformStats({ stats }: IntegrationPlatformStatsProps) {
    const cards = [
        { title: "Integration Hubs", value: String(stats?.totalIntegrationHubs ?? 0), detail: \`\${stats?.activeIntegrationHubs ?? 0} active • \${stats?.connectedServiceCount ?? 0} connected services\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.activeConnectorCount ?? 0), detail: \`\${stats?.pendingRetryCount ?? 0} pending retries • \${stats?.failedTransactionCount ?? 0} failed transactions\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.avgHealthScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Connector, API, webhook, and marketplace audit entries", trend: "up" as const },
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
    { id: "overview", label: "Overview", panel: "IntegrationPlatformOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "IntegrationPlatformAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "IntegrationPlatformSdkPanel" },
];

writeFileSync(join(mod, "components/IntegrationPlatformPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    IntegrationPlatformOverviewPanel,
    ${panelImports},
    IntegrationPlatformAuditLogsPanel,
    IntegrationPlatformSdkPanel,
} from "@/src/modules/integration-platform/components/IntegrationPlatformPanels";
import { IntegrationPlatformStats } from "@/src/modules/integration-platform/components/IntegrationPlatformStats";
import { INTG_TABS } from "@/src/modules/integration-platform/constants";
import { useIntegrationPlatform } from "@/src/modules/integration-platform/hooks/useIntegrationPlatform";

const tabs = [
${tabDefs.map((t) => `    { id: INTG_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function IntegrationPlatformPage() {
    const integrationPlatform = useIntegrationPlatform();
    const [activeTab, setActiveTab] = useState<(typeof INTG_TABS)[keyof typeof INTG_TABS]>(INTG_TABS.overview);

    if (integrationPlatform.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Integration Platform" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-600">V2 Program A Sprint 6</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Integration Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: connected services, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and integration operations dashboard with security-first audit and the shared Integration Platform SDK.
                </p>
            </motion.header>
            <IntegrationPlatformStats stats={integrationPlatform.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:border-indigo-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === INTG_TABS.${t.id} ? <${t.panel} data={integrationPlatform} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { integrationPlatformService } from "@/src/modules/integration-platform/services/integration-platform.service";
import type { IntgSdkConnectServiceInput, IntgSdkIssueApiKeyInput, IntgSdkRegisterWebhookInput } from "@/src/modules/integration-platform/types";

export class IntegrationPlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async connectService(input: IntgSdkConnectServiceInput) {
        return integrationPlatformService.sdkConnectService(this.authUserId, this.email, input, this.fullName);
    }

    async issueApiKey(input: IntgSdkIssueApiKeyInput) {
        return integrationPlatformService.sdkIssueApiKey(this.authUserId, this.email, input, this.fullName);
    }

    async registerWebhook(input: IntgSdkRegisterWebhookInput) {
        return integrationPlatformService.sdkRegisterWebhook(this.authUserId, this.email, input, this.fullName);
    }

    async getIntegrationHubs() {
        return integrationPlatformService.getIntegrationHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return integrationPlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return integrationPlatformService.getPipelineInfo();
    }
}

export function createIntegrationPlatformClient(authUserId: string, email: string, fullName?: string | null): IntegrationPlatformClient {
    return new IntegrationPlatformClient(authUserId, email, fullName);
}

export { integrationPlatformService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { IntegrationPlatformPage } from "@/src/modules/integration-platform/components/IntegrationPlatformPage";
export { IntegrationPlatformStats } from "@/src/modules/integration-platform/components/IntegrationPlatformStats";
export { integrationPlatformService } from "@/src/modules/integration-platform/services/integration-platform.service";
export { useIntegrationPlatform } from "@/src/modules/integration-platform/hooks/useIntegrationPlatform";
export { createIntegrationPlatformClient, IntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
export * from "@/src/modules/integration-platform/types";
export * from "@/src/modules/integration-platform/constants";
`);

console.log(`Generated integration platform module files. INTG_TABS count: ${tabs.length}`);
