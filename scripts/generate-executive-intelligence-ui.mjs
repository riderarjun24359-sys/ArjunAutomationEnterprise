#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/executive-intelligence");

const entities = [
    { tab: "intelligenceHubs", plural: "intelligenceHubs", singular: "IntelligenceHub", pascal: "IntelligenceHub", db: "aixIntelligenceHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "dailyExecutiveBriefs", plural: "dailyExecutiveBriefs", singular: "DailyExecutiveBrief", pascal: "DailyExecutiveBrief", db: "aixDailyExecutiveBriefs", fields: [{ name: "briefKey", type: "string" }, { name: "briefDate", type: "string" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "briefKey", sub: "briefDate" } },
    { tab: "weeklyBusinessReviews", plural: "weeklyBusinessReviews", singular: "WeeklyBusinessReview", pascal: "WeeklyBusinessReview", db: "aixWeeklyBusinessReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "weekStart", type: "string" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "reviewKey", sub: "weekStart" } },
    { tab: "monthlyExecutiveSummaries", plural: "monthlyExecutiveSummaries", singular: "MonthlyExecutiveSummary", pascal: "MonthlyExecutiveSummary", db: "aixMonthlyExecutiveSummaries", fields: [{ name: "summaryKey", type: "string" }, { name: "monthStart", type: "string" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "summaryKey", sub: "monthStart" } },
    { tab: "trialConversionScores", plural: "trialConversionScores", singular: "TrialConversionScore", pascal: "TrialConversionScore", db: "aixTrialConversionScores", fields: [{ name: "scoreKey", type: "string" }, { name: "conversionRate", type: "number" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "scoreKey", sub: "scoreKey" } },
    { tab: "renewalProbabilities", plural: "renewalProbabilities", singular: "RenewalProbability", pascal: "RenewalProbability", db: "aixRenewalProbabilities", fields: [{ name: "probabilityKey", type: "string" }, { name: "renewalProbability", type: "number" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "probabilityKey", sub: "probabilityKey" } },
    { tab: "churnRisks", plural: "churnRisks", singular: "ChurnRisk", pascal: "ChurnRisk", db: "aixChurnRisks", fields: [{ name: "riskKey", type: "string" }, { name: "churnScore", type: "number" }, { name: "riskLevel", type: "select", options: "RISK_LEVEL_OPTIONS" }], display: { title: "riskKey", sub: "riskLevel" } },
    { tab: "expansionOpportunities", plural: "expansionOpportunities", singular: "ExpansionOpportunity", pascal: "ExpansionOpportunity", db: "aixExpansionOpportunities", fields: [{ name: "opportunityKey", type: "string" }, { name: "expansionScore", type: "number" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "opportunityKey", sub: "opportunityKey" } },
    { tab: "mrrTrends", plural: "mrrTrends", singular: "MrrTrend", pascal: "MrrTrend", db: "aixMrrTrends", fields: [{ name: "trendKey", type: "string" }, { name: "mrrAmount", type: "number" }, { name: "trendDirection", type: "select", options: "TREND_DIRECTION_OPTIONS" }], display: { title: "trendKey", sub: "trendDirection" } },
    { tab: "arrTrends", plural: "arrTrends", singular: "ArrTrend", pascal: "ArrTrend", db: "aixArrTrends", fields: [{ name: "trendKey", type: "string" }, { name: "arrAmount", type: "number" }, { name: "trendDirection", type: "select", options: "TREND_DIRECTION_OPTIONS" }], display: { title: "trendKey", sub: "trendDirection" } },
    { tab: "revenueGrowthMetrics", plural: "revenueGrowthMetrics", singular: "RevenueGrowthMetric", pascal: "RevenueGrowthMetric", db: "aixRevenueGrowthMetrics", fields: [{ name: "metricsKey", type: "string" }, { name: "growthRate", type: "number" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "revenueRisks", plural: "revenueRisks", singular: "RevenueRisk", pascal: "RevenueRisk", db: "aixRevenueRisks", fields: [{ name: "riskKey", type: "string" }, { name: "riskAmount", type: "number" }, { name: "riskLevel", type: "select", options: "RISK_LEVEL_OPTIONS" }], display: { title: "riskKey", sub: "riskLevel" } },
    { tab: "platformHealthIntel", plural: "platformHealthIntel", singular: "PlatformHealthIntel", pascal: "PlatformHealthIntel", db: "aixPlatformHealthIntel", fields: [{ name: "intelKey", type: "string" }, { name: "healthScore", type: "number" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "intelKey", sub: "healthScore" } },
    { tab: "queueHealthIntel", plural: "queueHealthIntel", singular: "QueueHealthIntel", pascal: "QueueHealthIntel", db: "aixQueueHealthIntel", fields: [{ name: "intelKey", type: "string" }, { name: "queueDepth", type: "number" }, { name: "healthScore", type: "number" }], display: { title: "intelKey", sub: "queueDepth" } },
    { tab: "integrationHealthIntel", plural: "integrationHealthIntel", singular: "IntegrationHealthIntel", pascal: "IntegrationHealthIntel", db: "aixIntegrationHealthIntel", fields: [{ name: "intelKey", type: "string" }, { name: "integrationName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "integrationName", sub: "intelKey" } },
    { tab: "performanceTrends", plural: "performanceTrends", singular: "PerformanceTrend", pascal: "PerformanceTrend", db: "aixPerformanceTrends", fields: [{ name: "trendKey", type: "string" }, { name: "performanceScore", type: "number" }, { name: "trendDirection", type: "select", options: "TREND_DIRECTION_OPTIONS" }], display: { title: "trendKey", sub: "trendDirection" } },
    { tab: "unusualLoginActivity", plural: "unusualLoginActivity", singular: "UnusualLoginActivity", pascal: "UnusualLoginActivity", db: "aixUnusualLoginActivity", fields: [{ name: "activityKey", type: "string" }, { name: "loginCount", type: "number" }, { name: "riskLevel", type: "select", options: "RISK_LEVEL_OPTIONS" }], display: { title: "activityKey", sub: "riskLevel" } },
    { tab: "permissionRisks", plural: "permissionRisks", singular: "PermissionRisk", pascal: "PermissionRisk", db: "aixPermissionRisks", fields: [{ name: "riskKey", type: "string" }, { name: "riskType", type: "string" }, { name: "riskLevel", type: "select", options: "RISK_LEVEL_OPTIONS" }], display: { title: "riskKey", sub: "riskType" } },
    { tab: "tenantSecurityTrends", plural: "tenantSecurityTrends", singular: "TenantSecurityTrend", pascal: "TenantSecurityTrend", db: "aixTenantSecurityTrends", fields: [{ name: "trendKey", type: "string" }, { name: "securityScore", type: "number" }, { name: "trendDirection", type: "select", options: "TREND_DIRECTION_OPTIONS" }], display: { title: "trendKey", sub: "securityScore" } },
    { tab: "complianceWarnings", plural: "complianceWarnings", singular: "ComplianceWarning", pascal: "ComplianceWarning", db: "aixComplianceWarnings", fields: [{ name: "warningKey", type: "string" }, { name: "complianceType", type: "string" }, { name: "severity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "warningKey", sub: "complianceType" } },
    { tab: "todayPriorities", plural: "todayPriorities", singular: "TodayPriority", pascal: "TodayPriority", db: "aixTodayPriorities", fields: [{ name: "priorityKey", type: "string" }, { name: "priorityTitle", type: "string" }, { name: "priorityRank", type: "number" }], display: { title: "priorityTitle", sub: "priorityKey" } },
    { tab: "recommendedActions", plural: "recommendedActions", singular: "RecommendedAction", pascal: "RecommendedAction", db: "aixRecommendedActions", fields: [{ name: "actionKey", type: "string" }, { name: "actionTitle", type: "string" }, { name: "actionType", type: "string" }], display: { title: "actionTitle", sub: "actionType" } },
    { tab: "businessRisks", plural: "businessRisks", singular: "BusinessRisk", pascal: "BusinessRisk", db: "aixBusinessRisks", fields: [{ name: "riskKey", type: "string" }, { name: "riskTitle", type: "string" }, { name: "riskLevel", type: "select", options: "RISK_LEVEL_OPTIONS" }], display: { title: "riskTitle", sub: "riskLevel" } },
    { tab: "growthOpportunities", plural: "growthOpportunities", singular: "GrowthOpportunity", pascal: "GrowthOpportunity", db: "aixGrowthOpportunities", fields: [{ name: "opportunityKey", type: "string" }, { name: "opportunityTitle", type: "string" }, { name: "growthScore", type: "number" }], display: { title: "opportunityTitle", sub: "growthScore" } },
    { tab: "knowledgeReasoningSessions", plural: "knowledgeReasoningSessions", singular: "KnowledgeReasoningSession", pascal: "KnowledgeReasoningSession", db: "aixKnowledgeReasoningSessions", fields: [{ name: "sessionKey", type: "string" }, { name: "reasoningType", type: "string" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "sessionKey", sub: "reasoningType" } },
    { tab: "evidenceTraces", plural: "evidenceTraces", singular: "EvidenceTrace", pascal: "EvidenceTrace", db: "aixEvidenceTraces", fields: [{ name: "traceKey", type: "string" }, { name: "sourceModule", type: "string" }, { name: "traceSummary", type: "string" }], display: { title: "traceKey", sub: "sourceModule" } },
    { tab: "orchestrationLinks", plural: "orchestrationLinks", singular: "OrchestrationLink", pascal: "OrchestrationLink", db: "aixOrchestrationLinks", fields: [{ name: "linkKey", type: "string" }, { name: "linkType", type: "string" }, { name: "targetRef", type: "string" }], display: { title: "linkKey", sub: "linkType" } },
    { tab: "recommendationOutputs", plural: "recommendationOutputs", singular: "RecommendationOutput", pascal: "RecommendationOutput", db: "aixRecommendationOutputs", fields: [{ name: "outputKey", type: "string" }, { name: "recommendationText", type: "string" }, { name: "aiConfidenceScore", type: "number" }], display: { title: "outputKey", sub: "recommendationText" } },
    { tab: "executiveMetrics", plural: "executiveMetrics", singular: "ExecutiveMetric", pascal: "ExecutiveMetric", db: "aixExecutiveMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "businessScore", type: "number" }, { name: "growthScore", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "executiveHealth", plural: "executiveHealth", singular: "ExecutiveHealth", pascal: "ExecutiveHealth", db: "aixExecutiveHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "executiveFailures", plural: "executiveFailures", singular: "ExecutiveFailure", pascal: "ExecutiveFailure", db: "aixExecutiveFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const AIX_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const RISK_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const TREND_DIRECTION_OPTIONS = [
    { value: "up", label: "Up" },
    { value: "down", label: "Down" },
    { value: "flat", label: "Flat" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const AIX_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
] as const;

export const AIX_PERMISSIONS = ["aix.view", "aix.manage", "aix.approve", "aix.admin"] as const;


export const AIX_THEME = {
    primary: "violet-600",
    primaryHover: "violet-500",
    ring: "violet-500/20",
    text: "text-violet-600",
    textDark: "dark:text-violet-400",
    bg: "bg-violet-600",
    bgHover: "hover:bg-violet-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    intelligenceHubId: z.string().min(1),`;
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
    "buildIntelligenceHubLookupMaps", "buildAixAuditPayload", "buildAixDashboardStats", "buildAixPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapRecommendationOutputForStats", "mapEvidenceTraceForStats", "mapExecutiveMetricForStats", "mapKnowledgeReasoningSessionForStats", "mapBusinessRiskForStats", "mapChurnRiskForStats", "mapExecutiveHealthForStats", "mapExecutiveFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AixDashboardStats", "AixPipelineInfo", "AixSdkConnectServiceInput", "AixSdkConnectServiceResult", "AixSdkIssueApiKeyInput", "AixSdkIssueApiKeyResult", "AixSdkRegisterWebhookInput", "AixSdkRegisterWebhookResult"]).join(",\n    ");

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
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/executive-intelligence.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/executive-intelligence-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/executive-intelligence/types";

export class ExecutiveIntelligenceService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const intelligenceHubs = await databaseService.aixExecutiveIntelligences.listByOrganization(organizationId);
        return buildIntelligenceHubLookupMaps(intelligenceHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AixDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildAixDashboardStats({ intelligenceHubs: [], recommendationOutputs: [], knowledgeReasoningSessions: [], businessRisks: [], executiveFailures: [], auditLogs: [] });
        const [intelligenceHubs, recommendationOutputsRaw, evidenceTracesRaw, executiveMetricsRaw, knowledgeReasoningSessionsRaw, businessRisksRaw, churnRisksRaw, executiveHealthRaw, executiveFailures, auditLogs] = await Promise.all([
            this.getIntelligenceHubs(authUserId, email, fullName),
            databaseService.aixRecommendationOutputs.listByOrganization(context.organizationId),
            databaseService.aixEvidenceTraces.listByOrganization(context.organizationId),
            databaseService.aixExecutiveMetrics.listByOrganization(context.organizationId),
            databaseService.aixKnowledgeReasoningSessions.listByOrganization(context.organizationId),
            databaseService.aixBusinessRisks.listByOrganization(context.organizationId),
            databaseService.aixChurnRisks.listByOrganization(context.organizationId),
            databaseService.aixExecutiveHealth.listByOrganization(context.organizationId),
            this.getExecutiveFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildAixDashboardStats({
            intelligenceHubs,
            recommendationOutputs: recommendationOutputsRaw.map(mapRecommendationOutputForStats),
            evidenceTraces: evidenceTracesRaw.map(mapEvidenceTraceForStats),
            executiveMetrics: executiveMetricsRaw.map(mapExecutiveMetricForStats),
            knowledgeReasoningSessions: knowledgeReasoningSessionsRaw.map(mapKnowledgeReasoningSessionForStats),
            businessRisks: businessRisksRaw.map(mapBusinessRiskForStats),
            churnRisks: churnRisksRaw.map(mapChurnRiskForStats),
            executiveHealth: executiveHealthRaw.map(mapExecutiveHealthForStats),
            executiveFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): AixPipelineInfo {
        return buildAixPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aixAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getIntelligenceHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aixExecutiveIntelligences.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkGenerateBrief(authUserId: string, email: string, input: AixSdkConnectServiceInput, fullName?: string | null): Promise<AixSdkConnectServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "generate_brief", moduleSource: "executive_intelligence", inputPayload: { ...input } });
        const created = await this.createDailyExecutiveBrief(authUserId, email, { intelligenceHubId: input.intelligenceHubId, serviceKey: input.serviceKey, serviceName: input.serviceName, providerType: input.providerType, connectorStatus: "connected" }, fullName);
        return { serviceId: created.id, serviceKey: created.serviceKey, connectorStatus: created.connectorStatus };
    }

    async sdkGenerateRecommendation(authUserId: string, email: string, input: AixSdkIssueApiKeyInput, fullName?: string | null): Promise<AixSdkIssueApiKeyResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.keyName, limit: 3 });
        const created = await this.createRecommendationOutput(authUserId, email, { intelligenceHubId: input.intelligenceHubId, keyName: input.keyName, apiVersion: input.apiVersion }, fullName);
        return { apiKeyId: created.id, keyName: created.keyName, status: created.status };
    }

    async sdkTriggerReasoning(authUserId: string, email: string, input: AixSdkRegisterWebhookInput, fullName?: string | null): Promise<AixSdkRegisterWebhookResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "trigger_reasoning", moduleSource: "executive_intelligence", inputPayload: { ...input } });
        const created = await this.createKnowledgeReasoningSession(authUserId, email, { intelligenceHubId: input.intelligenceHubId, webhookKey: input.webhookKey, webhookName: input.webhookName, targetUrl: input.targetUrl }, fullName);
        return { webhookId: created.id, webhookKey: created.webhookKey, status: created.status };
    }
}

export const executiveIntelligenceService = new ExecutiveIntelligenceService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AixDashboardStats", "AixPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            executiveIntelligenceService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useExecutiveIntelligence.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { executiveIntelligenceService } from "@/src/modules/executive-intelligence/services/executive-intelligence.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/executive-intelligence/types";

export function useExecutiveIntelligence() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AixDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AixPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [intelligenceHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            executiveIntelligenceService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(executiveIntelligenceService.getPipelineInfo()),
${hookFetchCalls}
            executiveIntelligenceService.getAuditLogs(authUserId, email, fullName),
            executiveIntelligenceService.getIntelligenceHubOptions(authUserId, email, fullName),
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
        intelligenceHubOptions,
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
    }, e.hubField === false ? {} : { intelligenceHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <IntelligenceHubSelect data={data} {...form.register("intelligenceHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: ExecutiveIntelligenceData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise executive intelligence ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/ExecutiveIntelligencePanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AIX_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/executive-intelligence/constants";
import type { useExecutiveIntelligence } from "@/src/modules/executive-intelligence/hooks/useExecutiveIntelligence";
import {
${schemaImports}
} from "@/src/modules/executive-intelligence/schemas";

type ExecutiveIntelligenceData = ReturnType<typeof useExecutiveIntelligence>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-violet-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-violet-600">{meta}</p> : null}</div>;
}
function IntelligenceHubSelect({ data, ...props }: { data: ExecutiveIntelligenceData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select executive intelligence</option>{data.intelligenceHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function ExecutiveIntelligenceOverviewPanel({ data }: { data: ExecutiveIntelligenceData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Executive Intelligence summary" description="System health, background jobs, event bus, businessRisks, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Intelligence Hubs" subtitle={\`\${data.stats?.totalExecutiveIntelligences ?? 0} total\`} meta={\`\${data.stats?.activeExecutiveIntelligences ?? 0} active • \${data.stats?.recommendationOutputsCount ?? 0} recommendations\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.evidenceTraceCount ?? 0} evidence traces\`} meta={\`\${data.stats?.reasoningSessionCount ?? 0} reasoning sessions • \${data.stats?.openRiskCount ?? 0} open risks\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.avgAiConfidenceScore ?? 0).toFixed(1)} avg AI confidence\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first executive intelligence" />
            </div></Card>
            <Card hover><SectionHeader title="Executive intelligence pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Executive intelligence pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function ExecutiveIntelligenceAuditLogsPanel({ data }: { data: ExecutiveIntelligenceData }) {
    return (
        <Card hover><SectionHeader title="Executive Intelligence audit history" description="Security-first audit trail for jobs, events, businessRisks, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for executive intelligence." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function ExecutiveIntelligenceSdkPanel({ data }: { data: ExecutiveIntelligenceData }) {
    return (
        <Card hover><SectionHeader title="Shared Executive Intelligence SDK" description="Import from @/src/modules/executive-intelligence/sdk for brief generation, recommendation output, and knowledge reasoning" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createExecutiveIntelligenceClient()" subtitle="Factory for module-scoped Executive Intelligence client with auth context" meta="Primary SDK for enterprise executive intelligence" />
            <ListCard title="sdkGenerateBrief()" subtitle="Generate executive brief with AI orchestration" meta="moduleSource: executive_intelligence" />
            <ListCard title="sdkGenerateRecommendation()" subtitle="Generate AI recommendation with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkTriggerReasoning()" subtitle="Trigger knowledge reasoning with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {AIX_THEME.primary} • Integration hubs loaded: {data.intelligenceHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createExecutiveIntelligenceClient } from "@/src/modules/executive-intelligence/sdk";

const intg = createExecutiveIntelligenceClient(userId, email, fullName);
await intg.generateBrief({ intelligenceHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.generateRecommendation({ intelligenceHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.triggerReasoning({ intelligenceHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/ExecutiveIntelligenceStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { AixDashboardStats } from "@/src/modules/executive-intelligence/types";

interface ExecutiveIntelligenceStatsProps { stats: AixDashboardStats | null; }

export function ExecutiveIntelligenceStats({ stats }: ExecutiveIntelligenceStatsProps) {
    const cards = [
        { title: "Intelligence Hubs", value: String(stats?.totalExecutiveIntelligences ?? 0), detail: \`\${stats?.activeExecutiveIntelligences ?? 0} active • \${stats?.recommendationOutputsCount ?? 0} recommendations\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.evidenceTraceCount ?? 0), detail: \`\${stats?.reasoningSessionCount ?? 0} reasoning sessions • \${stats?.openRiskCount ?? 0} open risks\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.avgAiConfidenceScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, businessRisks, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-violet-600 dark:[&_p:last-child]:text-violet-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "ExecutiveIntelligenceOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "ExecutiveIntelligenceAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "ExecutiveIntelligenceSdkPanel" },
];

writeFileSync(join(mod, "components/ExecutiveIntelligencePage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    ExecutiveIntelligenceOverviewPanel,
    ${panelImports},
    ExecutiveIntelligenceAuditLogsPanel,
    ExecutiveIntelligenceSdkPanel,
} from "@/src/modules/executive-intelligence/components/ExecutiveIntelligencePanels";
import { ExecutiveIntelligenceStats } from "@/src/modules/executive-intelligence/components/ExecutiveIntelligenceStats";
import { AIX_TABS } from "@/src/modules/executive-intelligence/constants";
import { useExecutiveIntelligence } from "@/src/modules/executive-intelligence/hooks/useExecutiveIntelligence";

const tabs = [
${tabDefs.map((t) => `    { id: AIX_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function ExecutiveIntelligencePage() {
    const executiveIntelligence = useExecutiveIntelligence();
    const [activeTab, setActiveTab] = useState<(typeof AIX_TABS)[keyof typeof AIX_TABS]>(AIX_TABS.overview);

    if (executiveIntelligence.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Executive Intelligence" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">V2 Program A Sprint 8</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Executive Intelligence</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: recommendations, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and executive intelligence dashboard with security-first audit and the shared Executive Intelligence SDK.
                </p>
            </motion.header>
            <ExecutiveIntelligenceStats stats={executiveIntelligence.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:border-violet-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === AIX_TABS.${t.id} ? <${t.panel} data={executiveIntelligence} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { executiveIntelligenceService } from "@/src/modules/executive-intelligence/services/executive-intelligence.service";
import type { AixSdkConnectServiceInput, AixSdkIssueApiKeyInput, AixSdkRegisterWebhookInput } from "@/src/modules/executive-intelligence/types";

export class ExecutiveIntelligenceClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async generateBrief(input: AixSdkConnectServiceInput) {
        return executiveIntelligenceService.sdkGenerateBrief(this.authUserId, this.email, input, this.fullName);
    }

    async generateRecommendation(input: AixSdkIssueApiKeyInput) {
        return executiveIntelligenceService.sdkGenerateRecommendation(this.authUserId, this.email, input, this.fullName);
    }

    async triggerReasoning(input: AixSdkRegisterWebhookInput) {
        return executiveIntelligenceService.sdkTriggerReasoning(this.authUserId, this.email, input, this.fullName);
    }

    async getIntelligenceHubs() {
        return executiveIntelligenceService.getIntelligenceHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return executiveIntelligenceService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return executiveIntelligenceService.getPipelineInfo();
    }
}

export function createExecutiveIntelligenceClient(authUserId: string, email: string, fullName?: string | null): ExecutiveIntelligenceClient {
    return new ExecutiveIntelligenceClient(authUserId, email, fullName);
}

export { executiveIntelligenceService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { ExecutiveIntelligencePage } from "@/src/modules/executive-intelligence/components/ExecutiveIntelligencePage";
export { ExecutiveIntelligenceStats } from "@/src/modules/executive-intelligence/components/ExecutiveIntelligenceStats";
export { executiveIntelligenceService } from "@/src/modules/executive-intelligence/services/executive-intelligence.service";
export { useExecutiveIntelligence } from "@/src/modules/executive-intelligence/hooks/useExecutiveIntelligence";
export { createExecutiveIntelligenceClient, ExecutiveIntelligenceClient } from "@/src/modules/executive-intelligence/sdk";
export * from "@/src/modules/executive-intelligence/types";
export * from "@/src/modules/executive-intelligence/constants";
`);

console.log(`Generated executive intelligence module files. AIX_TABS count: ${tabs.length}`);
