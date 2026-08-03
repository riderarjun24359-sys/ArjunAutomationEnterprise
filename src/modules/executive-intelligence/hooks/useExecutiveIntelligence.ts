"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { executiveIntelligenceService } from "@/src/modules/executive-intelligence/services/executive-intelligence.service";
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
} from "@/src/modules/executive-intelligence/types";

export function useExecutiveIntelligence() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AixDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AixPipelineInfo | null>(null);
    const [intelligenceHubs, setIntelligenceHubs] = useState<IntelligenceHubSummary[]>([]);
    const [dailyExecutiveBriefs, setDailyExecutiveBriefs] = useState<DailyExecutiveBriefSummary[]>([]);
    const [weeklyBusinessReviews, setWeeklyBusinessReviews] = useState<WeeklyBusinessReviewSummary[]>([]);
    const [monthlyExecutiveSummaries, setMonthlyExecutiveSummarys] = useState<MonthlyExecutiveSummarySummary[]>([]);
    const [trialConversionScores, setTrialConversionScores] = useState<TrialConversionScoreSummary[]>([]);
    const [renewalProbabilities, setRenewalProbabilitys] = useState<RenewalProbabilitySummary[]>([]);
    const [churnRisks, setChurnRisks] = useState<ChurnRiskSummary[]>([]);
    const [expansionOpportunities, setExpansionOpportunitys] = useState<ExpansionOpportunitySummary[]>([]);
    const [mrrTrends, setMrrTrends] = useState<MrrTrendSummary[]>([]);
    const [arrTrends, setArrTrends] = useState<ArrTrendSummary[]>([]);
    const [revenueGrowthMetrics, setRevenueGrowthMetrics] = useState<RevenueGrowthMetricSummary[]>([]);
    const [revenueRisks, setRevenueRisks] = useState<RevenueRiskSummary[]>([]);
    const [platformHealthIntel, setPlatformHealthIntels] = useState<PlatformHealthIntelSummary[]>([]);
    const [queueHealthIntel, setQueueHealthIntels] = useState<QueueHealthIntelSummary[]>([]);
    const [integrationHealthIntel, setIntegrationHealthIntels] = useState<IntegrationHealthIntelSummary[]>([]);
    const [performanceTrends, setPerformanceTrends] = useState<PerformanceTrendSummary[]>([]);
    const [unusualLoginActivity, setUnusualLoginActivitys] = useState<UnusualLoginActivitySummary[]>([]);
    const [permissionRisks, setPermissionRisks] = useState<PermissionRiskSummary[]>([]);
    const [tenantSecurityTrends, setTenantSecurityTrends] = useState<TenantSecurityTrendSummary[]>([]);
    const [complianceWarnings, setComplianceWarnings] = useState<ComplianceWarningSummary[]>([]);
    const [todayPriorities, setTodayPrioritys] = useState<TodayPrioritySummary[]>([]);
    const [recommendedActions, setRecommendedActions] = useState<RecommendedActionSummary[]>([]);
    const [businessRisks, setBusinessRisks] = useState<BusinessRiskSummary[]>([]);
    const [growthOpportunities, setGrowthOpportunitys] = useState<GrowthOpportunitySummary[]>([]);
    const [knowledgeReasoningSessions, setKnowledgeReasoningSessions] = useState<KnowledgeReasoningSessionSummary[]>([]);
    const [evidenceTraces, setEvidenceTraces] = useState<EvidenceTraceSummary[]>([]);
    const [orchestrationLinks, setOrchestrationLinks] = useState<OrchestrationLinkSummary[]>([]);
    const [recommendationOutputs, setRecommendationOutputs] = useState<RecommendationOutputSummary[]>([]);
    const [executiveMetrics, setExecutiveMetrics] = useState<ExecutiveMetricSummary[]>([]);
    const [executiveHealth, setExecutiveHealths] = useState<ExecutiveHealthSummary[]>([]);
    const [executiveFailures, setExecutiveFailures] = useState<ExecutiveFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [intelligenceHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
intelligenceHubsList,
            dailyExecutiveBriefsList,
            weeklyBusinessReviewsList,
            monthlyExecutiveSummariesList,
            trialConversionScoresList,
            renewalProbabilitiesList,
            churnRisksList,
            expansionOpportunitiesList,
            mrrTrendsList,
            arrTrendsList,
            revenueGrowthMetricsList,
            revenueRisksList,
            platformHealthIntelList,
            queueHealthIntelList,
            integrationHealthIntelList,
            performanceTrendsList,
            unusualLoginActivityList,
            permissionRisksList,
            tenantSecurityTrendsList,
            complianceWarningsList,
            todayPrioritiesList,
            recommendedActionsList,
            businessRisksList,
            growthOpportunitiesList,
            knowledgeReasoningSessionsList,
            evidenceTracesList,
            orchestrationLinksList,
            recommendationOutputsList,
            executiveMetricsList,
            executiveHealthList,
            executiveFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            executiveIntelligenceService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(executiveIntelligenceService.getPipelineInfo()),
            executiveIntelligenceService.getIntelligenceHubs(authUserId, email, fullName),
            executiveIntelligenceService.getDailyExecutiveBriefs(authUserId, email, fullName),
            executiveIntelligenceService.getWeeklyBusinessReviews(authUserId, email, fullName),
            executiveIntelligenceService.getMonthlyExecutiveSummarys(authUserId, email, fullName),
            executiveIntelligenceService.getTrialConversionScores(authUserId, email, fullName),
            executiveIntelligenceService.getRenewalProbabilitys(authUserId, email, fullName),
            executiveIntelligenceService.getChurnRisks(authUserId, email, fullName),
            executiveIntelligenceService.getExpansionOpportunitys(authUserId, email, fullName),
            executiveIntelligenceService.getMrrTrends(authUserId, email, fullName),
            executiveIntelligenceService.getArrTrends(authUserId, email, fullName),
            executiveIntelligenceService.getRevenueGrowthMetrics(authUserId, email, fullName),
            executiveIntelligenceService.getRevenueRisks(authUserId, email, fullName),
            executiveIntelligenceService.getPlatformHealthIntels(authUserId, email, fullName),
            executiveIntelligenceService.getQueueHealthIntels(authUserId, email, fullName),
            executiveIntelligenceService.getIntegrationHealthIntels(authUserId, email, fullName),
            executiveIntelligenceService.getPerformanceTrends(authUserId, email, fullName),
            executiveIntelligenceService.getUnusualLoginActivitys(authUserId, email, fullName),
            executiveIntelligenceService.getPermissionRisks(authUserId, email, fullName),
            executiveIntelligenceService.getTenantSecurityTrends(authUserId, email, fullName),
            executiveIntelligenceService.getComplianceWarnings(authUserId, email, fullName),
            executiveIntelligenceService.getTodayPrioritys(authUserId, email, fullName),
            executiveIntelligenceService.getRecommendedActions(authUserId, email, fullName),
            executiveIntelligenceService.getBusinessRisks(authUserId, email, fullName),
            executiveIntelligenceService.getGrowthOpportunitys(authUserId, email, fullName),
            executiveIntelligenceService.getKnowledgeReasoningSessions(authUserId, email, fullName),
            executiveIntelligenceService.getEvidenceTraces(authUserId, email, fullName),
            executiveIntelligenceService.getOrchestrationLinks(authUserId, email, fullName),
            executiveIntelligenceService.getRecommendationOutputs(authUserId, email, fullName),
            executiveIntelligenceService.getExecutiveMetrics(authUserId, email, fullName),
            executiveIntelligenceService.getExecutiveHealths(authUserId, email, fullName),
            executiveIntelligenceService.getExecutiveFailures(authUserId, email, fullName),
            executiveIntelligenceService.getAuditLogs(authUserId, email, fullName),
            executiveIntelligenceService.getIntelligenceHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
intelligenceHubsList,
            dailyExecutiveBriefsList,
            weeklyBusinessReviewsList,
            monthlyExecutiveSummariesList,
            trialConversionScoresList,
            renewalProbabilitiesList,
            churnRisksList,
            expansionOpportunitiesList,
            mrrTrendsList,
            arrTrendsList,
            revenueGrowthMetricsList,
            revenueRisksList,
            platformHealthIntelList,
            queueHealthIntelList,
            integrationHealthIntelList,
            performanceTrendsList,
            unusualLoginActivityList,
            permissionRisksList,
            tenantSecurityTrendsList,
            complianceWarningsList,
            todayPrioritiesList,
            recommendedActionsList,
            businessRisksList,
            growthOpportunitiesList,
            knowledgeReasoningSessionsList,
            evidenceTracesList,
            orchestrationLinksList,
            recommendationOutputsList,
            executiveMetricsList,
            executiveHealthList,
            executiveFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setIntelligenceHubs(result.intelligenceHubsList);
        setDailyExecutiveBriefs(result.dailyExecutiveBriefsList);
        setWeeklyBusinessReviews(result.weeklyBusinessReviewsList);
        setMonthlyExecutiveSummarys(result.monthlyExecutiveSummariesList);
        setTrialConversionScores(result.trialConversionScoresList);
        setRenewalProbabilitys(result.renewalProbabilitiesList);
        setChurnRisks(result.churnRisksList);
        setExpansionOpportunitys(result.expansionOpportunitiesList);
        setMrrTrends(result.mrrTrendsList);
        setArrTrends(result.arrTrendsList);
        setRevenueGrowthMetrics(result.revenueGrowthMetricsList);
        setRevenueRisks(result.revenueRisksList);
        setPlatformHealthIntels(result.platformHealthIntelList);
        setQueueHealthIntels(result.queueHealthIntelList);
        setIntegrationHealthIntels(result.integrationHealthIntelList);
        setPerformanceTrends(result.performanceTrendsList);
        setUnusualLoginActivitys(result.unusualLoginActivityList);
        setPermissionRisks(result.permissionRisksList);
        setTenantSecurityTrends(result.tenantSecurityTrendsList);
        setComplianceWarnings(result.complianceWarningsList);
        setTodayPrioritys(result.todayPrioritiesList);
        setRecommendedActions(result.recommendedActionsList);
        setBusinessRisks(result.businessRisksList);
        setGrowthOpportunitys(result.growthOpportunitiesList);
        setKnowledgeReasoningSessions(result.knowledgeReasoningSessionsList);
        setEvidenceTraces(result.evidenceTracesList);
        setOrchestrationLinks(result.orchestrationLinksList);
        setRecommendationOutputs(result.recommendationOutputsList);
        setExecutiveMetrics(result.executiveMetricsList);
        setExecutiveHealths(result.executiveHealthList);
        setExecutiveFailures(result.executiveFailuresList);
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

    const createIntelligenceHub = useCallback(async (input: CreateIntelligenceHubInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createIntelligenceHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDailyExecutiveBrief = useCallback(async (input: CreateDailyExecutiveBriefInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createDailyExecutiveBrief(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWeeklyBusinessReview = useCallback(async (input: CreateWeeklyBusinessReviewInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createWeeklyBusinessReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMonthlyExecutiveSummary = useCallback(async (input: CreateMonthlyExecutiveSummaryInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createMonthlyExecutiveSummary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTrialConversionScore = useCallback(async (input: CreateTrialConversionScoreInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createTrialConversionScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalProbability = useCallback(async (input: CreateRenewalProbabilityInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createRenewalProbability(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createChurnRisk = useCallback(async (input: CreateChurnRiskInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createChurnRisk(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExpansionOpportunity = useCallback(async (input: CreateExpansionOpportunityInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createExpansionOpportunity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMrrTrend = useCallback(async (input: CreateMrrTrendInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createMrrTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createArrTrend = useCallback(async (input: CreateArrTrendInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createArrTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueGrowthMetric = useCallback(async (input: CreateRevenueGrowthMetricInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createRevenueGrowthMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueRisk = useCallback(async (input: CreateRevenueRiskInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createRevenueRisk(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformHealthIntel = useCallback(async (input: CreatePlatformHealthIntelInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createPlatformHealthIntel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createQueueHealthIntel = useCallback(async (input: CreateQueueHealthIntelInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createQueueHealthIntel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntegrationHealthIntel = useCallback(async (input: CreateIntegrationHealthIntelInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createIntegrationHealthIntel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPerformanceTrend = useCallback(async (input: CreatePerformanceTrendInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createPerformanceTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUnusualLoginActivity = useCallback(async (input: CreateUnusualLoginActivityInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createUnusualLoginActivity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPermissionRisk = useCallback(async (input: CreatePermissionRiskInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createPermissionRisk(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTenantSecurityTrend = useCallback(async (input: CreateTenantSecurityTrendInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createTenantSecurityTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceWarning = useCallback(async (input: CreateComplianceWarningInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createComplianceWarning(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTodayPriority = useCallback(async (input: CreateTodayPriorityInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createTodayPriority(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRecommendedAction = useCallback(async (input: CreateRecommendedActionInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createRecommendedAction(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessRisk = useCallback(async (input: CreateBusinessRiskInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createBusinessRisk(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGrowthOpportunity = useCallback(async (input: CreateGrowthOpportunityInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createGrowthOpportunity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKnowledgeReasoningSession = useCallback(async (input: CreateKnowledgeReasoningSessionInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createKnowledgeReasoningSession(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEvidenceTrace = useCallback(async (input: CreateEvidenceTraceInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createEvidenceTrace(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrchestrationLink = useCallback(async (input: CreateOrchestrationLinkInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createOrchestrationLink(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRecommendationOutput = useCallback(async (input: CreateRecommendationOutputInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createRecommendationOutput(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveMetric = useCallback(async (input: CreateExecutiveMetricInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createExecutiveMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveHealth = useCallback(async (input: CreateExecutiveHealthInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createExecutiveHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveFailure = useCallback(async (input: CreateExecutiveFailureInput) => { if (!user) throw new Error("Authentication required"); await executiveIntelligenceService.createExecutiveFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        intelligenceHubs,
        createIntelligenceHub,
        dailyExecutiveBriefs,
        createDailyExecutiveBrief,
        weeklyBusinessReviews,
        createWeeklyBusinessReview,
        monthlyExecutiveSummaries,
        createMonthlyExecutiveSummary,
        trialConversionScores,
        createTrialConversionScore,
        renewalProbabilities,
        createRenewalProbability,
        churnRisks,
        createChurnRisk,
        expansionOpportunities,
        createExpansionOpportunity,
        mrrTrends,
        createMrrTrend,
        arrTrends,
        createArrTrend,
        revenueGrowthMetrics,
        createRevenueGrowthMetric,
        revenueRisks,
        createRevenueRisk,
        platformHealthIntel,
        createPlatformHealthIntel,
        queueHealthIntel,
        createQueueHealthIntel,
        integrationHealthIntel,
        createIntegrationHealthIntel,
        performanceTrends,
        createPerformanceTrend,
        unusualLoginActivity,
        createUnusualLoginActivity,
        permissionRisks,
        createPermissionRisk,
        tenantSecurityTrends,
        createTenantSecurityTrend,
        complianceWarnings,
        createComplianceWarning,
        todayPriorities,
        createTodayPriority,
        recommendedActions,
        createRecommendedAction,
        businessRisks,
        createBusinessRisk,
        growthOpportunities,
        createGrowthOpportunity,
        knowledgeReasoningSessions,
        createKnowledgeReasoningSession,
        evidenceTraces,
        createEvidenceTrace,
        orchestrationLinks,
        createOrchestrationLink,
        recommendationOutputs,
        createRecommendationOutput,
        executiveMetrics,
        createExecutiveMetric,
        executiveHealth,
        createExecutiveHealth,
        executiveFailures,
        createExecutiveFailure,
        auditLogs,
        intelligenceHubOptions,
        refresh,
    };
}
