#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-operations-center-ui.mjs");
const outPath = join(root, "scripts/generate-executive-intelligence-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
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
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/operations-center"\);/, 'const mod = join(root, "src/modules/executive-intelligence");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/operationsCenters/g, "intelligenceHubs"],
    [/operationsCenterOptions/g, "intelligenceHubOptions"],
    [/getOperationsCenters/g, "getIntelligenceHubs"],
    [/getOperationsCenterOptions/g, "getIntelligenceHubOptions"],
    [/OperationsCenterSelect/g, "IntelligenceHubSelect"],
    [/buildOperationsCenterLookupMaps/g, "buildIntelligenceHubLookupMaps"],
    [/operationsCenterId/g, "intelligenceHubId"],
    [/centerName/g, "hubName"],
    [/centerOpts/g, "hubOpts"],
    [/centerKey/g, "hubKey"],
    [/Operations Centers/g, "Intelligence Hubs"],
    [/Operations Center/g, "Executive Intelligence"],
    [/operations center/g, "executive intelligence"],
    [/operations-center/g, "executive-intelligence"],
    [/operationsCenter/g, "executiveIntelligence"],
    [/OperationsCenter/g, "ExecutiveIntelligence"],
    [/databaseService\.eoc/g, "databaseService.aix"],
    [/buildEoc/g, "buildAix"],
    [/mapEoc/g, "mapAix"],
    [/EocDashboardStats/g, "AixDashboardStats"],
    [/EocPipelineInfo/g, "AixPipelineInfo"],
    [/EocSdk/g, "AixSdk"],
    [/EOC_TABS/g, "AIX_TABS"],
    [/EOC_THEME/g, "AIX_THEME"],
    [/EOC_PERMISSIONS/g, "AIX_PERMISSIONS"],
    [/EOC_STATUS_OPTIONS/g, "AIX_STATUS_OPTIONS"],
    [/Sprint 7/g, "Sprint 8"],
    [/emerald-600/g, "violet-600"],
    [/emerald-500/g, "violet-500"],
    [/emerald-400/g, "violet-400"],
    [/emerald-300/g, "violet-300"],
    [/ring-emerald/g, "ring-violet"],
    [/bg-emerald/g, "bg-violet"],
    [/text-emerald/g, "text-violet"],
    [/hover:bg-emerald/g, "hover:bg-violet"],
    [/hover:border-emerald/g, "hover:border-violet"],
    [/HEALTH_TYPE_OPTIONS/g, "RISK_LEVEL_OPTIONS"],
    [/JOB_STATUS_OPTIONS/g, "TREND_DIRECTION_OPTIONS"],
    [/EVENT_TYPE_OPTIONS/g, "ALERT_SEVERITY_OPTIONS"],
    [/LOG_LEVEL_OPTIONS/g, "RISK_LEVEL_OPTIONS"],
    [/mapOverallHealthForStats/g, "mapRecommendationOutputForStats"],
    [/mapJobSchedulerForStats/g, "mapEvidenceTraceForStats"],
    [/mapPlatformEventForStats/g, "mapExecutiveMetricForStats"],
    [/mapJobRetryQueueForStats/g, "mapKnowledgeReasoningSessionForStats"],
    [/mapAlertForStats/g, "mapBusinessRiskForStats"],
    [/mapModuleHealthForStats/g, "mapChurnRiskForStats"],
    [/mapOperationsHealthForStats/g, "mapExecutiveHealthForStats"],
    [/mapOperationsFailureForStats/g, "mapExecutiveFailureForStats"],
    [/overallHealth/g, "recommendationOutputs"],
    [/jobSchedulers/g, "evidenceTraces"],
    [/platformEvents/g, "executiveMetrics"],
    [/jobRetryQueue/g, "knowledgeReasoningSessions"],
    [/alerts/g, "businessRisks"],
    [/moduleHealth/g, "churnRisks"],
    [/operationsHealth/g, "executiveHealth"],
    [/operationsFailures/g, "executiveFailures"],
    [/operationsMetrics/g, "executiveMetrics"],
    [/totalOperationsCenters/g, "totalIntelligenceHubs"],
    [/activeOperationsCenters/g, "activeIntelligenceHubs"],
    [/overallHealthCount/g, "recommendationCount"],
    [/activeJobCount/g, "evidenceTraceCount"],
    [/pendingRetryCount/g, "reasoningSessionCount"],
    [/openAlertCount/g, "openRiskCount"],
    [/avgHealthScore/g, "avgAiConfidenceScore"],
    [/sdkPublishEvent/g, "sdkGenerateBrief"],
    [/sdkScheduleJob/g, "sdkGenerateRecommendation"],
    [/sdkTriggerAlert/g, "sdkTriggerReasoning"],
    [/publishEvent/g, "generateBrief"],
    [/scheduleJob/g, "generateRecommendation"],
    [/triggerAlert/g, "triggerReasoning"],
    [/EocSdkConnectServiceInput/g, "AixSdkGenerateBriefInput"],
    [/EocSdkConnectServiceResult/g, "AixSdkGenerateBriefResult"],
    [/EocSdkIssueApiKeyInput/g, "AixSdkGenerateRecommendationInput"],
    [/EocSdkIssueApiKeyResult/g, "AixSdkGenerateRecommendationResult"],
    [/EocSdkRegisterWebhookInput/g, "AixSdkTriggerReasoningInput"],
    [/EocSdkRegisterWebhookResult/g, "AixSdkTriggerReasoningResult"],
    [/createPlatformEvent/g, "createDailyExecutiveBrief"],
    [/createJobScheduler/g, "createRecommendationOutput"],
    [/createAlert/g, "createKnowledgeReasoningSession"],
    [/Publish platform event/g, "Generate executive brief"],
    [/Schedule background job/g, "Generate AI recommendation"],
    [/Trigger operational alert/g, "Trigger knowledge reasoning"],
    [/jobs, events, alerts/g, "briefs, recommendations, reasoning"],
    [/Jobs, events, alerts, and configuration/g, "Briefs, recommendations, reasoning, and intelligence outputs"],
    [/Operations pipeline/g, "Executive intelligence pipeline"],
    [/EOC_TABS count/g, "AIX_TABS count"],
    [/Generated operations center/g, "Generated executive intelligence"],
    [/integrationHubs/g, "intelligenceHubs"],
    [/getIntegrationFailures/g, "getExecutiveFailures"],
    [/Connected services, payment & accounting connectors, public API, webhooks, marketplace, analytics, and ops dashboard/g,
        "Executive briefs, revenue intelligence, platform health, security signals, priorities, recommendations, and AI dashboard"],
    [/connected services/g, "recommendations"],
    [/active jobs/g, "evidence traces"],
    [/pending retries/g, "reasoning sessions"],
    [/failed transactions/g, "open risks"],
    [/avg health score/g, "avg AI confidence"],
    [/Enterprise Operations Center summary/g, "Executive Intelligence summary"],
    [/Security-first operations center/g, "Security-first executive intelligence"],
    [/operations_center/g, "executive_intelligence"],
    [/moduleSource: operations_center/g, "moduleSource: executive_intelligence"],
    [/Integration layer for the entire SaaS platform: connected services, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and operations center dashboard with security-first audit and the shared Operations Center SDK\./g,
        "AI executive intelligence platform: daily briefs, revenue analytics, platform health intel, security & compliance signals, priority recommendations, knowledge reasoning, evidence traces, and executive dashboard with security-first audit and the shared Executive Intelligence SDK."],
    [/service connection, API key issuance, and webhook registration/g, "brief generation, recommendation output, and knowledge reasoning"],
    [/connect_service/g, "generate_brief"],
    [/register_webhook/g, "trigger_reasoning"],
    [/issueApiKey/g, "generateRecommendation"],
    [/connectService/g, "generateBrief"],
    [/registerWebhook/g, "triggerReasoning"],
    [/"eoc\.view"/g, '"aix.view"'],
    [/"eoc\.manage"/g, '"aix.manage"'],
    [/"eoc\.approve"/g, '"aix.approve"'],
    [/"eoc\.admin"/g, '"aix.admin"'],
];

for (const [from, to] of reps) s = s.replace(from, to);

// Fix dashboard databaseService calls left from EOC/intg template
s = s.replace(/databaseService\.aixConnectedServices\.listByOrganization/g, "databaseService.aixRecommendationOutputs.listByOrganization");
s = s.replace(/databaseService\.aixPaymentConnectors\.listByOrganization/g, "databaseService.aixEvidenceTraces.listByOrganization");
s = s.replace(/databaseService\.aixAccountingConnectors\.listByOrganization/g, "databaseService.aixExecutiveMetrics.listByOrganization");
s = s.replace(/databaseService\.aixPaymentRetryQueue\.listByOrganization/g, "databaseService.aixKnowledgeReasoningSessions.listByOrganization");
s = s.replace(/databaseService\.aixPaymentTransactions\.listByOrganization/g, "databaseService.aixBusinessRisks.listByOrganization");
s = s.replace(/databaseService\.aixConnectorHealth\.listByOrganization/g, "databaseService.aixChurnRisks.listByOrganization");
s = s.replace(/databaseService\.aixIntegrationHealth\.listByOrganization/g, "databaseService.aixExecutiveHealth.listByOrganization");

// Fix constants block options (replace legacy EOC option values inside template literal)
const aixOptionsBlock = `export const RISK_LEVEL_OPTIONS = [
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

`;
s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const AIX_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const AIX_THEME)/,
    `$1${aixOptionsBlock}$2`,
);

s = s.replace(
    /import \{ AIX_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, TREND_DIRECTION_OPTIONS, RISK_LEVEL_OPTIONS \}/,
    "import { AIX_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, ALERT_SEVERITY_OPTIONS }",
);

s = s.replace(
    /Select operations center/g,
    "Select intelligence hub"
);

s = s.replace(/export const AIX_PERMISSIONS = \["intg\.view"/g, 'export const AIX_PERMISSIONS = ["aix.view"');

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-executive-intelligence-ui.mjs");
