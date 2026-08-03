import {
    buildIntelligenceHubLookupMaps,
    buildAixAuditPayload,
    buildAixDashboardStats,
    buildAixPipelineInfo,
    mapAuditEntry,
    buildIntelligenceHubPayload,
    mapIntelligenceHubSummary,
    buildDailyExecutiveBriefPayload,
    mapDailyExecutiveBriefSummary,
    buildWeeklyBusinessReviewPayload,
    mapWeeklyBusinessReviewSummary,
    buildMonthlyExecutiveSummaryPayload,
    mapMonthlyExecutiveSummarySummary,
    buildTrialConversionScorePayload,
    mapTrialConversionScoreSummary,
    buildRenewalProbabilityPayload,
    mapRenewalProbabilitySummary,
    buildChurnRiskPayload,
    mapChurnRiskSummary,
    buildExpansionOpportunityPayload,
    mapExpansionOpportunitySummary,
    buildMrrTrendPayload,
    mapMrrTrendSummary,
    buildArrTrendPayload,
    mapArrTrendSummary,
    buildRevenueGrowthMetricPayload,
    mapRevenueGrowthMetricSummary,
    buildRevenueRiskPayload,
    mapRevenueRiskSummary,
    buildPlatformHealthIntelPayload,
    mapPlatformHealthIntelSummary,
    buildQueueHealthIntelPayload,
    mapQueueHealthIntelSummary,
    buildIntegrationHealthIntelPayload,
    mapIntegrationHealthIntelSummary,
    buildPerformanceTrendPayload,
    mapPerformanceTrendSummary,
    buildUnusualLoginActivityPayload,
    mapUnusualLoginActivitySummary,
    buildPermissionRiskPayload,
    mapPermissionRiskSummary,
    buildTenantSecurityTrendPayload,
    mapTenantSecurityTrendSummary,
    buildComplianceWarningPayload,
    mapComplianceWarningSummary,
    buildTodayPriorityPayload,
    mapTodayPrioritySummary,
    buildRecommendedActionPayload,
    mapRecommendedActionSummary,
    buildBusinessRiskPayload,
    mapBusinessRiskSummary,
    buildGrowthOpportunityPayload,
    mapGrowthOpportunitySummary,
    buildKnowledgeReasoningSessionPayload,
    mapKnowledgeReasoningSessionSummary,
    buildEvidenceTracePayload,
    mapEvidenceTraceSummary,
    buildOrchestrationLinkPayload,
    mapOrchestrationLinkSummary,
    buildRecommendationOutputPayload,
    mapRecommendationOutputSummary,
    buildExecutiveMetricPayload,
    mapExecutiveMetricSummary,
    buildExecutiveHealthPayload,
    mapExecutiveHealthSummary,
    buildExecutiveFailurePayload,
    mapExecutiveFailureSummary,
    mapRecommendationOutputForStats,
    mapEvidenceTraceForStats,
    mapExecutiveMetricForStats,
    mapKnowledgeReasoningSessionForStats,
    mapBusinessRiskForStats,
    mapChurnRiskForStats,
    mapExecutiveHealthForStats,
    mapExecutiveFailureForStats,
} from "@/src/modules/database/lib/executive-intelligence-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    IntelligenceHubSummary,
    CreateIntelligenceHubInput,
    DailyExecutiveBriefSummary,
    CreateDailyExecutiveBriefInput,
    WeeklyBusinessReviewSummary,
    CreateWeeklyBusinessReviewInput,
    MonthlyExecutiveSummarySummary,
    CreateMonthlyExecutiveSummaryInput,
    TrialConversionScoreSummary,
    CreateTrialConversionScoreInput,
    RenewalProbabilitySummary,
    CreateRenewalProbabilityInput,
    ChurnRiskSummary,
    CreateChurnRiskInput,
    ExpansionOpportunitySummary,
    CreateExpansionOpportunityInput,
    MrrTrendSummary,
    CreateMrrTrendInput,
    ArrTrendSummary,
    CreateArrTrendInput,
    RevenueGrowthMetricSummary,
    CreateRevenueGrowthMetricInput,
    RevenueRiskSummary,
    CreateRevenueRiskInput,
    PlatformHealthIntelSummary,
    CreatePlatformHealthIntelInput,
    QueueHealthIntelSummary,
    CreateQueueHealthIntelInput,
    IntegrationHealthIntelSummary,
    CreateIntegrationHealthIntelInput,
    PerformanceTrendSummary,
    CreatePerformanceTrendInput,
    UnusualLoginActivitySummary,
    CreateUnusualLoginActivityInput,
    PermissionRiskSummary,
    CreatePermissionRiskInput,
    TenantSecurityTrendSummary,
    CreateTenantSecurityTrendInput,
    ComplianceWarningSummary,
    CreateComplianceWarningInput,
    TodayPrioritySummary,
    CreateTodayPriorityInput,
    RecommendedActionSummary,
    CreateRecommendedActionInput,
    BusinessRiskSummary,
    CreateBusinessRiskInput,
    GrowthOpportunitySummary,
    CreateGrowthOpportunityInput,
    KnowledgeReasoningSessionSummary,
    CreateKnowledgeReasoningSessionInput,
    EvidenceTraceSummary,
    CreateEvidenceTraceInput,
    OrchestrationLinkSummary,
    CreateOrchestrationLinkInput,
    RecommendationOutputSummary,
    CreateRecommendationOutputInput,
    ExecutiveMetricSummary,
    CreateExecutiveMetricInput,
    ExecutiveHealthSummary,
    CreateExecutiveHealthInput,
    ExecutiveFailureSummary,
    CreateExecutiveFailureInput,
    AuditEntry,
    AixDashboardStats,
    AixPipelineInfo,
    AixSdkGenerateBriefInput,
    AixSdkGenerateBriefResult,
    AixSdkGenerateRecommendationInput,
    AixSdkGenerateRecommendationResult,
    AixSdkTriggerReasoningInput,
    AixSdkTriggerReasoningResult,
} from "@/src/modules/executive-intelligence/types";

export class ExecutiveIntelligenceService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const intelligenceHubs = await databaseService.aixIntelligenceHubs.listByOrganization(organizationId);
        return buildIntelligenceHubLookupMaps(intelligenceHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AixDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildAixDashboardStats({ intelligenceHubs: [], recommendationOutputs: [], evidenceTraces: [], executiveMetrics: [], knowledgeReasoningSessions: [], businessRisks: [], churnRisks: [], executiveHealth: [], executiveFailures: [], auditLogs: [] });
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

    async getIntelligenceHubs(authUserId: string, email: string, fullName?: string | null): Promise<IntelligenceHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixIntelligenceHubs.listByOrganization(context.organizationId)).map((r) => mapIntelligenceHubSummary(r));
    }

    async createIntelligenceHub(authUserId: string, email: string, input: CreateIntelligenceHubInput, fullName?: string | null): Promise<IntelligenceHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixIntelligenceHubs.create(buildIntelligenceHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create intelligenceHubs");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "intelligence_hubs", "create", `IntelligenceHub created`, created.id));
        return mapIntelligenceHubSummary(created);
    }

    async getDailyExecutiveBriefs(authUserId: string, email: string, fullName?: string | null): Promise<DailyExecutiveBriefSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixDailyExecutiveBriefs.listByOrganization(context.organizationId)).map((r) => mapDailyExecutiveBriefSummary(r, maps));
    }

    async createDailyExecutiveBrief(authUserId: string, email: string, input: CreateDailyExecutiveBriefInput, fullName?: string | null): Promise<DailyExecutiveBriefSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixDailyExecutiveBriefs.create(buildDailyExecutiveBriefPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dailyExecutiveBriefs");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "daily_executive_briefs", "create", `DailyExecutiveBrief created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDailyExecutiveBriefSummary(created, maps);
    }

    async getWeeklyBusinessReviews(authUserId: string, email: string, fullName?: string | null): Promise<WeeklyBusinessReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixWeeklyBusinessReviews.listByOrganization(context.organizationId)).map((r) => mapWeeklyBusinessReviewSummary(r, maps));
    }

    async createWeeklyBusinessReview(authUserId: string, email: string, input: CreateWeeklyBusinessReviewInput, fullName?: string | null): Promise<WeeklyBusinessReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixWeeklyBusinessReviews.create(buildWeeklyBusinessReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create weeklyBusinessReviews");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "weekly_business_reviews", "create", `WeeklyBusinessReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWeeklyBusinessReviewSummary(created, maps);
    }

    async getMonthlyExecutiveSummarys(authUserId: string, email: string, fullName?: string | null): Promise<MonthlyExecutiveSummarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixMonthlyExecutiveSummaries.listByOrganization(context.organizationId)).map((r) => mapMonthlyExecutiveSummarySummary(r, maps));
    }

    async createMonthlyExecutiveSummary(authUserId: string, email: string, input: CreateMonthlyExecutiveSummaryInput, fullName?: string | null): Promise<MonthlyExecutiveSummarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixMonthlyExecutiveSummaries.create(buildMonthlyExecutiveSummaryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create monthlyExecutiveSummaries");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "monthly_executive_summaries", "create", `MonthlyExecutiveSummary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMonthlyExecutiveSummarySummary(created, maps);
    }

    async getTrialConversionScores(authUserId: string, email: string, fullName?: string | null): Promise<TrialConversionScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixTrialConversionScores.listByOrganization(context.organizationId)).map((r) => mapTrialConversionScoreSummary(r, maps));
    }

    async createTrialConversionScore(authUserId: string, email: string, input: CreateTrialConversionScoreInput, fullName?: string | null): Promise<TrialConversionScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixTrialConversionScores.create(buildTrialConversionScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create trialConversionScores");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "trial_conversion_scores", "create", `TrialConversionScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTrialConversionScoreSummary(created, maps);
    }

    async getRenewalProbabilitys(authUserId: string, email: string, fullName?: string | null): Promise<RenewalProbabilitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixRenewalProbabilities.listByOrganization(context.organizationId)).map((r) => mapRenewalProbabilitySummary(r, maps));
    }

    async createRenewalProbability(authUserId: string, email: string, input: CreateRenewalProbabilityInput, fullName?: string | null): Promise<RenewalProbabilitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixRenewalProbabilities.create(buildRenewalProbabilityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewalProbabilities");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "renewal_probabilities", "create", `RenewalProbability created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalProbabilitySummary(created, maps);
    }

    async getChurnRisks(authUserId: string, email: string, fullName?: string | null): Promise<ChurnRiskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixChurnRisks.listByOrganization(context.organizationId)).map((r) => mapChurnRiskSummary(r, maps));
    }

    async createChurnRisk(authUserId: string, email: string, input: CreateChurnRiskInput, fullName?: string | null): Promise<ChurnRiskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixChurnRisks.create(buildChurnRiskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create churnRisks");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "churn_risks", "create", `ChurnRisk created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapChurnRiskSummary(created, maps);
    }

    async getExpansionOpportunitys(authUserId: string, email: string, fullName?: string | null): Promise<ExpansionOpportunitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixExpansionOpportunities.listByOrganization(context.organizationId)).map((r) => mapExpansionOpportunitySummary(r, maps));
    }

    async createExpansionOpportunity(authUserId: string, email: string, input: CreateExpansionOpportunityInput, fullName?: string | null): Promise<ExpansionOpportunitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixExpansionOpportunities.create(buildExpansionOpportunityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create expansionOpportunities");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "expansion_opportunities", "create", `ExpansionOpportunity created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExpansionOpportunitySummary(created, maps);
    }

    async getMrrTrends(authUserId: string, email: string, fullName?: string | null): Promise<MrrTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixMrrTrends.listByOrganization(context.organizationId)).map((r) => mapMrrTrendSummary(r, maps));
    }

    async createMrrTrend(authUserId: string, email: string, input: CreateMrrTrendInput, fullName?: string | null): Promise<MrrTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixMrrTrends.create(buildMrrTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create mrrTrends");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "mrr_trends", "create", `MrrTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMrrTrendSummary(created, maps);
    }

    async getArrTrends(authUserId: string, email: string, fullName?: string | null): Promise<ArrTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixArrTrends.listByOrganization(context.organizationId)).map((r) => mapArrTrendSummary(r, maps));
    }

    async createArrTrend(authUserId: string, email: string, input: CreateArrTrendInput, fullName?: string | null): Promise<ArrTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixArrTrends.create(buildArrTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create arrTrends");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "arr_trends", "create", `ArrTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapArrTrendSummary(created, maps);
    }

    async getRevenueGrowthMetrics(authUserId: string, email: string, fullName?: string | null): Promise<RevenueGrowthMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixRevenueGrowthMetrics.listByOrganization(context.organizationId)).map((r) => mapRevenueGrowthMetricSummary(r, maps));
    }

    async createRevenueGrowthMetric(authUserId: string, email: string, input: CreateRevenueGrowthMetricInput, fullName?: string | null): Promise<RevenueGrowthMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixRevenueGrowthMetrics.create(buildRevenueGrowthMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueGrowthMetrics");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "revenue_growth_metrics", "create", `RevenueGrowthMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueGrowthMetricSummary(created, maps);
    }

    async getRevenueRisks(authUserId: string, email: string, fullName?: string | null): Promise<RevenueRiskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixRevenueRisks.listByOrganization(context.organizationId)).map((r) => mapRevenueRiskSummary(r, maps));
    }

    async createRevenueRisk(authUserId: string, email: string, input: CreateRevenueRiskInput, fullName?: string | null): Promise<RevenueRiskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixRevenueRisks.create(buildRevenueRiskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueRisks");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "revenue_risks", "create", `RevenueRisk created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueRiskSummary(created, maps);
    }

    async getPlatformHealthIntels(authUserId: string, email: string, fullName?: string | null): Promise<PlatformHealthIntelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixPlatformHealthIntel.listByOrganization(context.organizationId)).map((r) => mapPlatformHealthIntelSummary(r, maps));
    }

    async createPlatformHealthIntel(authUserId: string, email: string, input: CreatePlatformHealthIntelInput, fullName?: string | null): Promise<PlatformHealthIntelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixPlatformHealthIntel.create(buildPlatformHealthIntelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformHealthIntel");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "platform_health_intel", "create", `PlatformHealthIntel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformHealthIntelSummary(created, maps);
    }

    async getQueueHealthIntels(authUserId: string, email: string, fullName?: string | null): Promise<QueueHealthIntelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixQueueHealthIntel.listByOrganization(context.organizationId)).map((r) => mapQueueHealthIntelSummary(r, maps));
    }

    async createQueueHealthIntel(authUserId: string, email: string, input: CreateQueueHealthIntelInput, fullName?: string | null): Promise<QueueHealthIntelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixQueueHealthIntel.create(buildQueueHealthIntelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create queueHealthIntel");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "queue_health_intel", "create", `QueueHealthIntel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapQueueHealthIntelSummary(created, maps);
    }

    async getIntegrationHealthIntels(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationHealthIntelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixIntegrationHealthIntel.listByOrganization(context.organizationId)).map((r) => mapIntegrationHealthIntelSummary(r, maps));
    }

    async createIntegrationHealthIntel(authUserId: string, email: string, input: CreateIntegrationHealthIntelInput, fullName?: string | null): Promise<IntegrationHealthIntelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixIntegrationHealthIntel.create(buildIntegrationHealthIntelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create integrationHealthIntel");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "integration_health_intel", "create", `IntegrationHealthIntel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIntegrationHealthIntelSummary(created, maps);
    }

    async getPerformanceTrends(authUserId: string, email: string, fullName?: string | null): Promise<PerformanceTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixPerformanceTrends.listByOrganization(context.organizationId)).map((r) => mapPerformanceTrendSummary(r, maps));
    }

    async createPerformanceTrend(authUserId: string, email: string, input: CreatePerformanceTrendInput, fullName?: string | null): Promise<PerformanceTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixPerformanceTrends.create(buildPerformanceTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create performanceTrends");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "performance_trends", "create", `PerformanceTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPerformanceTrendSummary(created, maps);
    }

    async getUnusualLoginActivitys(authUserId: string, email: string, fullName?: string | null): Promise<UnusualLoginActivitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixUnusualLoginActivity.listByOrganization(context.organizationId)).map((r) => mapUnusualLoginActivitySummary(r, maps));
    }

    async createUnusualLoginActivity(authUserId: string, email: string, input: CreateUnusualLoginActivityInput, fullName?: string | null): Promise<UnusualLoginActivitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixUnusualLoginActivity.create(buildUnusualLoginActivityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create unusualLoginActivity");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "unusual_login_activity", "create", `UnusualLoginActivity created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUnusualLoginActivitySummary(created, maps);
    }

    async getPermissionRisks(authUserId: string, email: string, fullName?: string | null): Promise<PermissionRiskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixPermissionRisks.listByOrganization(context.organizationId)).map((r) => mapPermissionRiskSummary(r, maps));
    }

    async createPermissionRisk(authUserId: string, email: string, input: CreatePermissionRiskInput, fullName?: string | null): Promise<PermissionRiskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixPermissionRisks.create(buildPermissionRiskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create permissionRisks");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "permission_risks", "create", `PermissionRisk created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPermissionRiskSummary(created, maps);
    }

    async getTenantSecurityTrends(authUserId: string, email: string, fullName?: string | null): Promise<TenantSecurityTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixTenantSecurityTrends.listByOrganization(context.organizationId)).map((r) => mapTenantSecurityTrendSummary(r, maps));
    }

    async createTenantSecurityTrend(authUserId: string, email: string, input: CreateTenantSecurityTrendInput, fullName?: string | null): Promise<TenantSecurityTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixTenantSecurityTrends.create(buildTenantSecurityTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tenantSecurityTrends");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "tenant_security_trends", "create", `TenantSecurityTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantSecurityTrendSummary(created, maps);
    }

    async getComplianceWarnings(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceWarningSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixComplianceWarnings.listByOrganization(context.organizationId)).map((r) => mapComplianceWarningSummary(r, maps));
    }

    async createComplianceWarning(authUserId: string, email: string, input: CreateComplianceWarningInput, fullName?: string | null): Promise<ComplianceWarningSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixComplianceWarnings.create(buildComplianceWarningPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceWarnings");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "compliance_warnings", "create", `ComplianceWarning created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceWarningSummary(created, maps);
    }

    async getTodayPrioritys(authUserId: string, email: string, fullName?: string | null): Promise<TodayPrioritySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixTodayPriorities.listByOrganization(context.organizationId)).map((r) => mapTodayPrioritySummary(r, maps));
    }

    async createTodayPriority(authUserId: string, email: string, input: CreateTodayPriorityInput, fullName?: string | null): Promise<TodayPrioritySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixTodayPriorities.create(buildTodayPriorityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create todayPriorities");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "today_priorities", "create", `TodayPriority created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTodayPrioritySummary(created, maps);
    }

    async getRecommendedActions(authUserId: string, email: string, fullName?: string | null): Promise<RecommendedActionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixRecommendedActions.listByOrganization(context.organizationId)).map((r) => mapRecommendedActionSummary(r, maps));
    }

    async createRecommendedAction(authUserId: string, email: string, input: CreateRecommendedActionInput, fullName?: string | null): Promise<RecommendedActionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixRecommendedActions.create(buildRecommendedActionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recommendedActions");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "recommended_actions", "create", `RecommendedAction created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRecommendedActionSummary(created, maps);
    }

    async getBusinessRisks(authUserId: string, email: string, fullName?: string | null): Promise<BusinessRiskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixBusinessRisks.listByOrganization(context.organizationId)).map((r) => mapBusinessRiskSummary(r, maps));
    }

    async createBusinessRisk(authUserId: string, email: string, input: CreateBusinessRiskInput, fullName?: string | null): Promise<BusinessRiskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixBusinessRisks.create(buildBusinessRiskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessRisks");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "business_risks", "create", `BusinessRisk created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessRiskSummary(created, maps);
    }

    async getGrowthOpportunitys(authUserId: string, email: string, fullName?: string | null): Promise<GrowthOpportunitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixGrowthOpportunities.listByOrganization(context.organizationId)).map((r) => mapGrowthOpportunitySummary(r, maps));
    }

    async createGrowthOpportunity(authUserId: string, email: string, input: CreateGrowthOpportunityInput, fullName?: string | null): Promise<GrowthOpportunitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixGrowthOpportunities.create(buildGrowthOpportunityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthOpportunities");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "growth_opportunities", "create", `GrowthOpportunity created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGrowthOpportunitySummary(created, maps);
    }

    async getKnowledgeReasoningSessions(authUserId: string, email: string, fullName?: string | null): Promise<KnowledgeReasoningSessionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixKnowledgeReasoningSessions.listByOrganization(context.organizationId)).map((r) => mapKnowledgeReasoningSessionSummary(r, maps));
    }

    async createKnowledgeReasoningSession(authUserId: string, email: string, input: CreateKnowledgeReasoningSessionInput, fullName?: string | null): Promise<KnowledgeReasoningSessionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixKnowledgeReasoningSessions.create(buildKnowledgeReasoningSessionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create knowledgeReasoningSessions");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "knowledge_reasoning_sessions", "create", `KnowledgeReasoningSession created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKnowledgeReasoningSessionSummary(created, maps);
    }

    async getEvidenceTraces(authUserId: string, email: string, fullName?: string | null): Promise<EvidenceTraceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixEvidenceTraces.listByOrganization(context.organizationId)).map((r) => mapEvidenceTraceSummary(r, maps));
    }

    async createEvidenceTrace(authUserId: string, email: string, input: CreateEvidenceTraceInput, fullName?: string | null): Promise<EvidenceTraceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixEvidenceTraces.create(buildEvidenceTracePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create evidenceTraces");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "evidence_traces", "create", `EvidenceTrace created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEvidenceTraceSummary(created, maps);
    }

    async getOrchestrationLinks(authUserId: string, email: string, fullName?: string | null): Promise<OrchestrationLinkSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixOrchestrationLinks.listByOrganization(context.organizationId)).map((r) => mapOrchestrationLinkSummary(r, maps));
    }

    async createOrchestrationLink(authUserId: string, email: string, input: CreateOrchestrationLinkInput, fullName?: string | null): Promise<OrchestrationLinkSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixOrchestrationLinks.create(buildOrchestrationLinkPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create orchestrationLinks");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "orchestration_links", "create", `OrchestrationLink created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrchestrationLinkSummary(created, maps);
    }

    async getRecommendationOutputs(authUserId: string, email: string, fullName?: string | null): Promise<RecommendationOutputSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixRecommendationOutputs.listByOrganization(context.organizationId)).map((r) => mapRecommendationOutputSummary(r, maps));
    }

    async createRecommendationOutput(authUserId: string, email: string, input: CreateRecommendationOutputInput, fullName?: string | null): Promise<RecommendationOutputSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixRecommendationOutputs.create(buildRecommendationOutputPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recommendationOutputs");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "recommendation_outputs", "create", `RecommendationOutput created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRecommendationOutputSummary(created, maps);
    }

    async getExecutiveMetrics(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aixExecutiveMetrics.listByOrganization(context.organizationId)).map(mapExecutiveMetricSummary);
    }

    async createExecutiveMetric(authUserId: string, email: string, input: CreateExecutiveMetricInput, fullName?: string | null): Promise<ExecutiveMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixExecutiveMetrics.create(buildExecutiveMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveMetrics");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "executive_metrics", "create", `ExecutiveMetric created`, created.id));
        return mapExecutiveMetricSummary(created);
    }

    async getExecutiveHealths(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aixExecutiveHealth.listByOrganization(context.organizationId)).map(mapExecutiveHealthSummary);
    }

    async createExecutiveHealth(authUserId: string, email: string, input: CreateExecutiveHealthInput, fullName?: string | null): Promise<ExecutiveHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixExecutiveHealth.create(buildExecutiveHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveHealth");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "executive_health", "create", `ExecutiveHealth created`, created.id));
        return mapExecutiveHealthSummary(created);
    }

    async getExecutiveFailures(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aixExecutiveFailures.listByOrganization(context.organizationId)).map((r) => mapExecutiveFailureSummary(r, maps));
    }

    async createExecutiveFailure(authUserId: string, email: string, input: CreateExecutiveFailureInput, fullName?: string | null): Promise<ExecutiveFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aixExecutiveFailures.create(buildExecutiveFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveFailures");
        await databaseService.aixAuditLogs.create(buildAixAuditPayload(context.organizationId, "executive_failures", "create", `ExecutiveFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aixAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getIntelligenceHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aixIntelligenceHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkGenerateBrief(authUserId: string, email: string, input: AixSdkGenerateBriefInput, fullName?: string | null): Promise<AixSdkGenerateBriefResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "generate_brief", moduleSource: "executive_intelligence", inputPayload: { ...input } });
        const created = await this.createDailyExecutiveBrief(authUserId, email, { intelligenceHubId: input.intelligenceHubId, briefKey: input.briefKey, briefDate: input.briefDate }, fullName);
        return { briefId: created.id, briefKey: created.briefKey, status: created.status };
    }

    async sdkGenerateRecommendation(authUserId: string, email: string, input: AixSdkGenerateRecommendationInput, fullName?: string | null): Promise<AixSdkGenerateRecommendationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.recommendationText ?? "executive recommendation", limit: 3 });
        const created = await this.createRecommendationOutput(authUserId, email, { intelligenceHubId: input.intelligenceHubId, outputKey: input.outputKey, recommendationText: input.recommendationText }, fullName);
        return { outputId: created.id, outputKey: created.outputKey, status: created.status };
    }

    async sdkTriggerReasoning(authUserId: string, email: string, input: AixSdkTriggerReasoningInput, fullName?: string | null): Promise<AixSdkTriggerReasoningResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "trigger_reasoning", moduleSource: "executive_intelligence", inputPayload: { ...input } });
        const created = await this.createKnowledgeReasoningSession(authUserId, email, { intelligenceHubId: input.intelligenceHubId, sessionKey: input.sessionKey, reasoningType: input.reasoningType }, fullName);
        return { sessionId: created.id, sessionKey: created.sessionKey, status: created.status };
    }
}

export const executiveIntelligenceService = new ExecutiveIntelligenceService();
