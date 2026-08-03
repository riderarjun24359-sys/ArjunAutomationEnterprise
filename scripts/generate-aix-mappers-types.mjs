#!/usr/bin/env node
/**
 * Generates executive-intelligence-mappers.ts and types/index.ts for Sprint 8.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "IntelligenceHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "DailyExecutiveBrief", key: "brief_key", title: "brief_key", sub: "brief_date", hub: true, orgOnly: false, createFields: ["briefKey", "briefDate", "aiConfidenceScore"] },
    { pascal: "WeeklyBusinessReview", key: "review_key", title: "review_key", sub: "week_start", hub: true, orgOnly: false, createFields: ["reviewKey", "weekStart", "aiConfidenceScore"] },
    { pascal: "MonthlyExecutiveSummary", key: "summary_key", title: "summary_key", sub: "month_start", hub: true, orgOnly: false, createFields: ["summaryKey", "monthStart", "aiConfidenceScore"] },
    { pascal: "TrialConversionScore", key: "score_key", title: "score_key", sub: "score_key", hub: true, orgOnly: false, createFields: ["scoreKey", "conversionRate", "aiConfidenceScore"] },
    { pascal: "RenewalProbability", key: "probability_key", title: "probability_key", sub: "probability_key", hub: true, orgOnly: false, createFields: ["probabilityKey", "renewalProbability", "aiConfidenceScore"] },
    { pascal: "ChurnRisk", key: "risk_key", title: "risk_key", sub: "risk_level", hub: true, orgOnly: false, createFields: ["riskKey", "churnScore", "riskLevel"] },
    { pascal: "ExpansionOpportunity", key: "opportunity_key", title: "opportunity_key", sub: "opportunity_key", hub: true, orgOnly: false, createFields: ["opportunityKey", "expansionScore", "aiConfidenceScore"] },
    { pascal: "MrrTrend", key: "trend_key", title: "trend_key", sub: "trend_direction", hub: true, orgOnly: false, createFields: ["trendKey", "mrrAmount", "trendDirection"] },
    { pascal: "ArrTrend", key: "trend_key", title: "trend_key", sub: "trend_direction", hub: true, orgOnly: false, createFields: ["trendKey", "arrAmount", "trendDirection"] },
    { pascal: "RevenueGrowthMetric", key: "metrics_key", title: "metrics_key", sub: "metrics_key", hub: true, orgOnly: false, createFields: ["metricsKey", "growthRate", "aiConfidenceScore"] },
    { pascal: "RevenueRisk", key: "risk_key", title: "risk_key", sub: "risk_level", hub: true, orgOnly: false, createFields: ["riskKey", "riskAmount", "riskLevel"] },
    { pascal: "PlatformHealthIntel", key: "intel_key", title: "intel_key", sub: "health_score", hub: true, orgOnly: false, createFields: ["intelKey", "healthScore", "aiConfidenceScore"] },
    { pascal: "QueueHealthIntel", key: "intel_key", title: "intel_key", sub: "queue_depth", hub: true, orgOnly: false, createFields: ["intelKey", "queueDepth", "healthScore"] },
    { pascal: "IntegrationHealthIntel", key: "intel_key", title: "integration_name", sub: "intel_key", hub: true, orgOnly: false, createFields: ["intelKey", "integrationName", "healthScore"] },
    { pascal: "PerformanceTrend", key: "trend_key", title: "trend_key", sub: "trend_direction", hub: true, orgOnly: false, createFields: ["trendKey", "performanceScore", "trendDirection"] },
    { pascal: "UnusualLoginActivity", key: "activity_key", title: "activity_key", sub: "risk_level", hub: true, orgOnly: false, createFields: ["activityKey", "loginCount", "riskLevel"] },
    { pascal: "PermissionRisk", key: "risk_key", title: "risk_key", sub: "risk_type", hub: true, orgOnly: false, createFields: ["riskKey", "riskType", "riskLevel"] },
    { pascal: "TenantSecurityTrend", key: "trend_key", title: "trend_key", sub: "security_score", hub: true, orgOnly: false, createFields: ["trendKey", "securityScore", "trendDirection"] },
    { pascal: "ComplianceWarning", key: "warning_key", title: "warning_key", sub: "compliance_type", hub: true, orgOnly: false, createFields: ["warningKey", "complianceType", "severity"] },
    { pascal: "TodayPriority", key: "priority_key", title: "priority_title", sub: "priority_key", hub: true, orgOnly: false, createFields: ["priorityKey", "priorityTitle", "priorityRank"] },
    { pascal: "RecommendedAction", key: "action_key", title: "action_title", sub: "action_type", hub: true, orgOnly: false, createFields: ["actionKey", "actionTitle", "actionType"] },
    { pascal: "BusinessRisk", key: "risk_key", title: "risk_title", sub: "risk_level", hub: true, orgOnly: false, createFields: ["riskKey", "riskTitle", "riskLevel"] },
    { pascal: "GrowthOpportunity", key: "opportunity_key", title: "opportunity_title", sub: "growth_score", hub: true, orgOnly: false, createFields: ["opportunityKey", "opportunityTitle", "growthScore"] },
    { pascal: "KnowledgeReasoningSession", key: "session_key", title: "session_key", sub: "reasoning_type", hub: true, orgOnly: false, createFields: ["sessionKey", "reasoningType", "aiConfidenceScore"] },
    { pascal: "EvidenceTrace", key: "trace_key", title: "trace_key", sub: "source_module", hub: true, orgOnly: false, createFields: ["traceKey", "sourceModule", "traceSummary"] },
    { pascal: "OrchestrationLink", key: "link_key", title: "link_key", sub: "link_type", hub: true, orgOnly: false, createFields: ["linkKey", "linkType", "targetRef"] },
    { pascal: "RecommendationOutput", key: "output_key", title: "output_key", sub: "recommendation_text", hub: true, orgOnly: false, createFields: ["outputKey", "recommendationText", "aiConfidenceScore"] },
    { pascal: "ExecutiveMetric", key: "metrics_key", title: "metrics_key", sub: "metrics_key", hub: false, orgOnly: true, createFields: ["metricsKey", "businessScore", "growthScore"] },
    { pascal: "ExecutiveHealth", key: "health_key", title: "health_key", sub: "health_key", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ExecutiveFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "aiConfidenceScore", "conversionRate", "renewalProbability", "churnScore", "expansionScore",
    "mrrAmount", "arrAmount", "growthRate", "riskAmount", "healthScore", "queueDepth",
    "performanceScore", "loginCount", "securityScore", "priorityRank", "growthScore",
    "businessScore", "growthScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface AixDashboardStats {
    totalIntelligenceHubs: number;
    activeIntelligenceHubs: number;
    recommendationCount: number;
    evidenceTraceCount: number;
    reasoningSessionCount: number;
    openRiskCount: number;
    openFailureCount: number;
    avgAiConfidenceScore: number;
    businessScore: number;
    growthScore: number;
    operationalScore: number;
    securityScore: number;
    customerScore: number;
    auditCount: number;
}

export interface AixPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface AixSdkGenerateBriefInput { intelligenceHubId: string; briefKey?: string; briefDate?: string; summary?: string; }
export interface AixSdkGenerateBriefResult { briefId: string; briefKey: string; status: string; }
export interface AixSdkGenerateRecommendationInput { intelligenceHubId: string; outputKey?: string; recommendationText?: string; }
export interface AixSdkGenerateRecommendationResult { outputId: string; outputKey: string; status: string; }
export interface AixSdkTriggerReasoningInput { intelligenceHubId: string; sessionKey?: string; reasoningType?: string; }
export interface AixSdkTriggerReasoningResult { sessionId: string; sessionKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "IntelligenceHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    intelligenceHubId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "hubName?: string;\n    "}${summaryFields}
    status: string;
}

export interface Create${e.pascal}Input {
    ${createExtra}${fields}
}

`;
    }
    return t;
}

function buildMappers() {
    const dbImports = entities.map((e) => `DbAix${e.pascal}`).concat(["DbAixAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["AixDashboardStats", "AixPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/executive-intelligence/types";

export function buildIntelligenceHubLookupMaps(hubs: DbAixIntelligenceHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildAixPipelineInfo(): AixPipelineInfo {
    const stages = [
        { key: "gather", label: "Gather" },
        { key: "reason", label: "Reason" },
        { key: "recommend", label: "Recommend" },
        { key: "review", label: "Review" },
    ];
    return { stages, currentStage: "reason", nextStage: "recommend", previousStage: "gather" };
}

export function buildAixAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbAixAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "IntelligenceHub";
        const mapFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const cast = boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string";
            return `        ${f}: record.${snake} as ${cast},`;
        }).join("\n");
        const payloadFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const def = boolFields.has(f) ? "false" : numFields.has(f) ? "0" : "''";
            return `        ${snake}: input.${f} ?? ${def},`;
        }).join("\n");
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.intelligenceHubId,\n";
        const hubNameLine = isHub ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbAix${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
    return {
        id: record.id,
${hubNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${hubLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapRecommendationOutputForStats(r: DbAixRecommendationOutput) { return { ai_confidence_score: r.ai_confidence_score, status: r.status }; }
export function mapEvidenceTraceForStats(r: DbAixEvidenceTrace) { return { status: r.status }; }
export function mapExecutiveMetricForStats(r: DbAixExecutiveMetric) {
    return {
        business_score: r.business_score,
        growth_score: r.growth_score,
        operational_score: r.operational_score,
        security_score: r.security_score,
        customer_score: r.customer_score,
        status: r.status,
    };
}
export function mapKnowledgeReasoningSessionForStats(r: DbAixKnowledgeReasoningSession) { return { ai_confidence_score: r.ai_confidence_score, status: r.status }; }
export function mapBusinessRiskForStats(r: DbAixBusinessRisk) { return { risk_level: r.risk_level, status: r.status }; }
export function mapChurnRiskForStats(r: DbAixChurnRisk) { return { ai_confidence_score: r.ai_confidence_score, status: r.status }; }
export function mapExecutiveHealthForStats(r: DbAixExecutiveHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapExecutiveFailureForStats(r: DbAixExecutiveFailure) { return { status: r.status }; }

export function buildAixDashboardStats(input: {
    intelligenceHubs: IntelligenceHubSummary[];
    recommendationOutputs: ReturnType<typeof mapRecommendationOutputForStats>[];
    evidenceTraces: ReturnType<typeof mapEvidenceTraceForStats>[];
    executiveMetrics: ReturnType<typeof mapExecutiveMetricForStats>[];
    knowledgeReasoningSessions: ReturnType<typeof mapKnowledgeReasoningSessionForStats>[];
    businessRisks: ReturnType<typeof mapBusinessRiskForStats>[];
    churnRisks: ReturnType<typeof mapChurnRiskForStats>[];
    executiveHealth: ReturnType<typeof mapExecutiveHealthForStats>[];
    executiveFailures: ExecutiveFailureSummary[];
    auditLogs: AuditEntry[];
}): AixDashboardStats {
    const activeHubs = input.intelligenceHubs.filter((h) => h.status === "active").length;
    const confidenceScores = [
        ...input.recommendationOutputs.map((r) => r.ai_confidence_score),
        ...input.churnRisks.map((r) => r.ai_confidence_score),
        ...input.knowledgeReasoningSessions.map((r) => r.ai_confidence_score),
    ];
    const avgAiConfidenceScore = confidenceScores.length ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length : 0;
    const latestMetrics = input.executiveMetrics[0];
    return {
        totalIntelligenceHubs: input.intelligenceHubs.length,
        activeIntelligenceHubs: activeHubs,
        recommendationCount: input.recommendationOutputs.length,
        evidenceTraceCount: input.evidenceTraces.length,
        reasoningSessionCount: input.knowledgeReasoningSessions.length,
        openRiskCount: input.businessRisks.filter((r) => r.risk_level === "high" || r.risk_level === "critical").length,
        openFailureCount: input.executiveFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        avgAiConfidenceScore,
        businessScore: latestMetrics?.business_score ?? 0,
        growthScore: latestMetrics?.growth_score ?? 0,
        operationalScore: latestMetrics?.operational_score ?? 0,
        securityScore: latestMetrics?.security_score ?? 0,
        customerScore: latestMetrics?.customer_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

writeFileSync(join(root, "src/modules/executive-intelligence/types/index.ts"), buildTypes(), "utf8");
writeFileSync(join(root, "src/modules/database/lib/executive-intelligence-mappers.ts"), buildMappers(), "utf8");
console.log("Generated AIX types and mappers");
