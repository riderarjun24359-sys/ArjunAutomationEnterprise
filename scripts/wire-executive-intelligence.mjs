#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

// Wire data-access.ts
const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("AixIntelligenceHubRepository")) {
    const eocImportEnd = da.indexOf("} from \"@/src/modules/database/repositories/operations-center-repositories\";");
    const aixImport = `import {
    AixIntelligenceHubRepository,
    AixDailyExecutiveBriefRepository,
    AixWeeklyBusinessReviewRepository,
    AixMonthlyExecutiveSummaryRepository,
    AixTrialConversionScoreRepository,
    AixRenewalProbabilityRepository,
    AixChurnRiskRepository,
    AixExpansionOpportunityRepository,
    AixMrrTrendRepository,
    AixArrTrendRepository,
    AixRevenueGrowthMetricRepository,
    AixRevenueRiskRepository,
    AixPlatformHealthIntelRepository,
    AixQueueHealthIntelRepository,
    AixIntegrationHealthIntelRepository,
    AixPerformanceTrendRepository,
    AixUnusualLoginActivityRepository,
    AixPermissionRiskRepository,
    AixTenantSecurityTrendRepository,
    AixComplianceWarningRepository,
    AixTodayPriorityRepository,
    AixRecommendedActionRepository,
    AixBusinessRiskRepository,
    AixGrowthOpportunityRepository,
    AixKnowledgeReasoningSessionRepository,
    AixEvidenceTraceRepository,
    AixOrchestrationLinkRepository,
    AixRecommendationOutputRepository,
    AixExecutiveMetricRepository,
    AixExecutiveHealthRepository,
    AixExecutiveFailureRepository,
    AixAuditLogRepository,
} from "@/src/modules/database/repositories/executive-intelligence-repositories";\n`;
    da = da.slice(0, eocImportEnd) + aixImport + da.slice(eocImportEnd);

    const eocProp = "    readonly eocAuditLogs: EocAuditLogRepository;";
    const aixProps = `    readonly aixIntelligenceHubs: AixIntelligenceHubRepository;
    readonly aixDailyExecutiveBriefs: AixDailyExecutiveBriefRepository;
    readonly aixWeeklyBusinessReviews: AixWeeklyBusinessReviewRepository;
    readonly aixMonthlyExecutiveSummaries: AixMonthlyExecutiveSummaryRepository;
    readonly aixTrialConversionScores: AixTrialConversionScoreRepository;
    readonly aixRenewalProbabilities: AixRenewalProbabilityRepository;
    readonly aixChurnRisks: AixChurnRiskRepository;
    readonly aixExpansionOpportunities: AixExpansionOpportunityRepository;
    readonly aixMrrTrends: AixMrrTrendRepository;
    readonly aixArrTrends: AixArrTrendRepository;
    readonly aixRevenueGrowthMetrics: AixRevenueGrowthMetricRepository;
    readonly aixRevenueRisks: AixRevenueRiskRepository;
    readonly aixPlatformHealthIntel: AixPlatformHealthIntelRepository;
    readonly aixQueueHealthIntel: AixQueueHealthIntelRepository;
    readonly aixIntegrationHealthIntel: AixIntegrationHealthIntelRepository;
    readonly aixPerformanceTrends: AixPerformanceTrendRepository;
    readonly aixUnusualLoginActivity: AixUnusualLoginActivityRepository;
    readonly aixPermissionRisks: AixPermissionRiskRepository;
    readonly aixTenantSecurityTrends: AixTenantSecurityTrendRepository;
    readonly aixComplianceWarnings: AixComplianceWarningRepository;
    readonly aixTodayPriorities: AixTodayPriorityRepository;
    readonly aixRecommendedActions: AixRecommendedActionRepository;
    readonly aixBusinessRisks: AixBusinessRiskRepository;
    readonly aixGrowthOpportunities: AixGrowthOpportunityRepository;
    readonly aixKnowledgeReasoningSessions: AixKnowledgeReasoningSessionRepository;
    readonly aixEvidenceTraces: AixEvidenceTraceRepository;
    readonly aixOrchestrationLinks: AixOrchestrationLinkRepository;
    readonly aixRecommendationOutputs: AixRecommendationOutputRepository;
    readonly aixExecutiveMetrics: AixExecutiveMetricRepository;
    readonly aixExecutiveHealth: AixExecutiveHealthRepository;
    readonly aixExecutiveFailures: AixExecutiveFailureRepository;
    readonly aixAuditLogs: AixAuditLogRepository;`;
    da = da.replace(eocProp, eocProp + "\n" + aixProps);

    const eocCtor = "        this.eocAuditLogs = new EocAuditLogRepository();";
    const aixCtor = `        this.aixIntelligenceHubs = new AixIntelligenceHubRepository();
        this.aixDailyExecutiveBriefs = new AixDailyExecutiveBriefRepository();
        this.aixWeeklyBusinessReviews = new AixWeeklyBusinessReviewRepository();
        this.aixMonthlyExecutiveSummaries = new AixMonthlyExecutiveSummaryRepository();
        this.aixTrialConversionScores = new AixTrialConversionScoreRepository();
        this.aixRenewalProbabilities = new AixRenewalProbabilityRepository();
        this.aixChurnRisks = new AixChurnRiskRepository();
        this.aixExpansionOpportunities = new AixExpansionOpportunityRepository();
        this.aixMrrTrends = new AixMrrTrendRepository();
        this.aixArrTrends = new AixArrTrendRepository();
        this.aixRevenueGrowthMetrics = new AixRevenueGrowthMetricRepository();
        this.aixRevenueRisks = new AixRevenueRiskRepository();
        this.aixPlatformHealthIntel = new AixPlatformHealthIntelRepository();
        this.aixQueueHealthIntel = new AixQueueHealthIntelRepository();
        this.aixIntegrationHealthIntel = new AixIntegrationHealthIntelRepository();
        this.aixPerformanceTrends = new AixPerformanceTrendRepository();
        this.aixUnusualLoginActivity = new AixUnusualLoginActivityRepository();
        this.aixPermissionRisks = new AixPermissionRiskRepository();
        this.aixTenantSecurityTrends = new AixTenantSecurityTrendRepository();
        this.aixComplianceWarnings = new AixComplianceWarningRepository();
        this.aixTodayPriorities = new AixTodayPriorityRepository();
        this.aixRecommendedActions = new AixRecommendedActionRepository();
        this.aixBusinessRisks = new AixBusinessRiskRepository();
        this.aixGrowthOpportunities = new AixGrowthOpportunityRepository();
        this.aixKnowledgeReasoningSessions = new AixKnowledgeReasoningSessionRepository();
        this.aixEvidenceTraces = new AixEvidenceTraceRepository();
        this.aixOrchestrationLinks = new AixOrchestrationLinkRepository();
        this.aixRecommendationOutputs = new AixRecommendationOutputRepository();
        this.aixExecutiveMetrics = new AixExecutiveMetricRepository();
        this.aixExecutiveHealth = new AixExecutiveHealthRepository();
        this.aixExecutiveFailures = new AixExecutiveFailureRepository();
        this.aixAuditLogs = new AixAuditLogRepository();`;
    da = da.replace(eocCtor, eocCtor + "\n" + aixCtor);

    writeFileSync(daPath, da, "utf8");
}

// Wire database-service.ts
const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("aixIntelligenceHubs")) {
    ds = ds.replace(
        "    eocAuditLogs: databaseAccess.eocAuditLogs,",
        `    eocAuditLogs: databaseAccess.eocAuditLogs,
    aixIntelligenceHubs: databaseAccess.aixIntelligenceHubs,
    aixDailyExecutiveBriefs: databaseAccess.aixDailyExecutiveBriefs,
    aixWeeklyBusinessReviews: databaseAccess.aixWeeklyBusinessReviews,
    aixMonthlyExecutiveSummaries: databaseAccess.aixMonthlyExecutiveSummaries,
    aixTrialConversionScores: databaseAccess.aixTrialConversionScores,
    aixRenewalProbabilities: databaseAccess.aixRenewalProbabilities,
    aixChurnRisks: databaseAccess.aixChurnRisks,
    aixExpansionOpportunities: databaseAccess.aixExpansionOpportunities,
    aixMrrTrends: databaseAccess.aixMrrTrends,
    aixArrTrends: databaseAccess.aixArrTrends,
    aixRevenueGrowthMetrics: databaseAccess.aixRevenueGrowthMetrics,
    aixRevenueRisks: databaseAccess.aixRevenueRisks,
    aixPlatformHealthIntel: databaseAccess.aixPlatformHealthIntel,
    aixQueueHealthIntel: databaseAccess.aixQueueHealthIntel,
    aixIntegrationHealthIntel: databaseAccess.aixIntegrationHealthIntel,
    aixPerformanceTrends: databaseAccess.aixPerformanceTrends,
    aixUnusualLoginActivity: databaseAccess.aixUnusualLoginActivity,
    aixPermissionRisks: databaseAccess.aixPermissionRisks,
    aixTenantSecurityTrends: databaseAccess.aixTenantSecurityTrends,
    aixComplianceWarnings: databaseAccess.aixComplianceWarnings,
    aixTodayPriorities: databaseAccess.aixTodayPriorities,
    aixRecommendedActions: databaseAccess.aixRecommendedActions,
    aixBusinessRisks: databaseAccess.aixBusinessRisks,
    aixGrowthOpportunities: databaseAccess.aixGrowthOpportunities,
    aixKnowledgeReasoningSessions: databaseAccess.aixKnowledgeReasoningSessions,
    aixEvidenceTraces: databaseAccess.aixEvidenceTraces,
    aixOrchestrationLinks: databaseAccess.aixOrchestrationLinks,
    aixRecommendationOutputs: databaseAccess.aixRecommendationOutputs,
    aixExecutiveMetrics: databaseAccess.aixExecutiveMetrics,
    aixExecutiveHealth: databaseAccess.aixExecutiveHealth,
    aixExecutiveFailures: databaseAccess.aixExecutiveFailures,
    aixAuditLogs: databaseAccess.aixAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for AIX");
