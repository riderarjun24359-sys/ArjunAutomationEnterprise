export interface AixDashboardStats {
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

export interface IntelligenceHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateIntelligenceHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface DailyExecutiveBriefSummary {
    id: string;
    hubName?: string;
        briefKey: string;
    briefDate: string;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateDailyExecutiveBriefInput {
        intelligenceHubId: string;
        briefKey?: string;
    briefDate?: string;
    aiConfidenceScore?: number;
}

export interface WeeklyBusinessReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    weekStart: string;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateWeeklyBusinessReviewInput {
        intelligenceHubId: string;
        reviewKey?: string;
    weekStart?: string;
    aiConfidenceScore?: number;
}

export interface MonthlyExecutiveSummarySummary {
    id: string;
    hubName?: string;
        summaryKey: string;
    monthStart: string;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateMonthlyExecutiveSummaryInput {
        intelligenceHubId: string;
        summaryKey?: string;
    monthStart?: string;
    aiConfidenceScore?: number;
}

export interface TrialConversionScoreSummary {
    id: string;
    hubName?: string;
        scoreKey: string;
    conversionRate: number;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateTrialConversionScoreInput {
        intelligenceHubId: string;
        scoreKey?: string;
    conversionRate?: number;
    aiConfidenceScore?: number;
}

export interface RenewalProbabilitySummary {
    id: string;
    hubName?: string;
        probabilityKey: string;
    renewalProbability: number;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateRenewalProbabilityInput {
        intelligenceHubId: string;
        probabilityKey?: string;
    renewalProbability?: number;
    aiConfidenceScore?: number;
}

export interface ChurnRiskSummary {
    id: string;
    hubName?: string;
        riskKey: string;
    churnScore: number;
    riskLevel: string;
    status: string;
}

export interface CreateChurnRiskInput {
        intelligenceHubId: string;
        riskKey?: string;
    churnScore?: number;
    riskLevel?: string;
}

export interface ExpansionOpportunitySummary {
    id: string;
    hubName?: string;
        opportunityKey: string;
    expansionScore: number;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateExpansionOpportunityInput {
        intelligenceHubId: string;
        opportunityKey?: string;
    expansionScore?: number;
    aiConfidenceScore?: number;
}

export interface MrrTrendSummary {
    id: string;
    hubName?: string;
        trendKey: string;
    mrrAmount: number;
    trendDirection: string;
    status: string;
}

export interface CreateMrrTrendInput {
        intelligenceHubId: string;
        trendKey?: string;
    mrrAmount?: number;
    trendDirection?: string;
}

export interface ArrTrendSummary {
    id: string;
    hubName?: string;
        trendKey: string;
    arrAmount: number;
    trendDirection: string;
    status: string;
}

export interface CreateArrTrendInput {
        intelligenceHubId: string;
        trendKey?: string;
    arrAmount?: number;
    trendDirection?: string;
}

export interface RevenueGrowthMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    growthRate: number;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateRevenueGrowthMetricInput {
        intelligenceHubId: string;
        metricsKey?: string;
    growthRate?: number;
    aiConfidenceScore?: number;
}

export interface RevenueRiskSummary {
    id: string;
    hubName?: string;
        riskKey: string;
    riskAmount: number;
    riskLevel: string;
    status: string;
}

export interface CreateRevenueRiskInput {
        intelligenceHubId: string;
        riskKey?: string;
    riskAmount?: number;
    riskLevel?: string;
}

export interface PlatformHealthIntelSummary {
    id: string;
    hubName?: string;
        intelKey: string;
    healthScore: number;
    aiConfidenceScore: number;
    status: string;
}

export interface CreatePlatformHealthIntelInput {
        intelligenceHubId: string;
        intelKey?: string;
    healthScore?: number;
    aiConfidenceScore?: number;
}

export interface QueueHealthIntelSummary {
    id: string;
    hubName?: string;
        intelKey: string;
    queueDepth: number;
    healthScore: number;
    status: string;
}

export interface CreateQueueHealthIntelInput {
        intelligenceHubId: string;
        intelKey?: string;
    queueDepth?: number;
    healthScore?: number;
}

export interface IntegrationHealthIntelSummary {
    id: string;
    hubName?: string;
        intelKey: string;
    integrationName: string;
    healthScore: number;
    status: string;
}

export interface CreateIntegrationHealthIntelInput {
        intelligenceHubId: string;
        intelKey?: string;
    integrationName?: string;
    healthScore?: number;
}

export interface PerformanceTrendSummary {
    id: string;
    hubName?: string;
        trendKey: string;
    performanceScore: number;
    trendDirection: string;
    status: string;
}

export interface CreatePerformanceTrendInput {
        intelligenceHubId: string;
        trendKey?: string;
    performanceScore?: number;
    trendDirection?: string;
}

export interface UnusualLoginActivitySummary {
    id: string;
    hubName?: string;
        activityKey: string;
    loginCount: number;
    riskLevel: string;
    status: string;
}

export interface CreateUnusualLoginActivityInput {
        intelligenceHubId: string;
        activityKey?: string;
    loginCount?: number;
    riskLevel?: string;
}

export interface PermissionRiskSummary {
    id: string;
    hubName?: string;
        riskKey: string;
    riskType: string;
    riskLevel: string;
    status: string;
}

export interface CreatePermissionRiskInput {
        intelligenceHubId: string;
        riskKey?: string;
    riskType?: string;
    riskLevel?: string;
}

export interface TenantSecurityTrendSummary {
    id: string;
    hubName?: string;
        trendKey: string;
    securityScore: number;
    trendDirection: string;
    status: string;
}

export interface CreateTenantSecurityTrendInput {
        intelligenceHubId: string;
        trendKey?: string;
    securityScore?: number;
    trendDirection?: string;
}

export interface ComplianceWarningSummary {
    id: string;
    hubName?: string;
        warningKey: string;
    complianceType: string;
    severity: string;
    status: string;
}

export interface CreateComplianceWarningInput {
        intelligenceHubId: string;
        warningKey?: string;
    complianceType?: string;
    severity?: string;
}

export interface TodayPrioritySummary {
    id: string;
    hubName?: string;
        priorityKey: string;
    priorityTitle: string;
    priorityRank: number;
    status: string;
}

export interface CreateTodayPriorityInput {
        intelligenceHubId: string;
        priorityKey?: string;
    priorityTitle?: string;
    priorityRank?: number;
}

export interface RecommendedActionSummary {
    id: string;
    hubName?: string;
        actionKey: string;
    actionTitle: string;
    actionType: string;
    status: string;
}

export interface CreateRecommendedActionInput {
        intelligenceHubId: string;
        actionKey?: string;
    actionTitle?: string;
    actionType?: string;
}

export interface BusinessRiskSummary {
    id: string;
    hubName?: string;
        riskKey: string;
    riskTitle: string;
    riskLevel: string;
    status: string;
}

export interface CreateBusinessRiskInput {
        intelligenceHubId: string;
        riskKey?: string;
    riskTitle?: string;
    riskLevel?: string;
}

export interface GrowthOpportunitySummary {
    id: string;
    hubName?: string;
        opportunityKey: string;
    opportunityTitle: string;
    growthScore: number;
    status: string;
}

export interface CreateGrowthOpportunityInput {
        intelligenceHubId: string;
        opportunityKey?: string;
    opportunityTitle?: string;
    growthScore?: number;
}

export interface KnowledgeReasoningSessionSummary {
    id: string;
    hubName?: string;
        sessionKey: string;
    reasoningType: string;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateKnowledgeReasoningSessionInput {
        intelligenceHubId: string;
        sessionKey?: string;
    reasoningType?: string;
    aiConfidenceScore?: number;
}

export interface EvidenceTraceSummary {
    id: string;
    hubName?: string;
        traceKey: string;
    sourceModule: string;
    traceSummary: string;
    status: string;
}

export interface CreateEvidenceTraceInput {
        intelligenceHubId: string;
        traceKey?: string;
    sourceModule?: string;
    traceSummary?: string;
}

export interface OrchestrationLinkSummary {
    id: string;
    hubName?: string;
        linkKey: string;
    linkType: string;
    targetRef: string;
    status: string;
}

export interface CreateOrchestrationLinkInput {
        intelligenceHubId: string;
        linkKey?: string;
    linkType?: string;
    targetRef?: string;
}

export interface RecommendationOutputSummary {
    id: string;
    hubName?: string;
        outputKey: string;
    recommendationText: string;
    aiConfidenceScore: number;
    status: string;
}

export interface CreateRecommendationOutputInput {
        intelligenceHubId: string;
        outputKey?: string;
    recommendationText?: string;
    aiConfidenceScore?: number;
}

export interface ExecutiveMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    businessScore: number;
    growthScore: number;
    status: string;
}

export interface CreateExecutiveMetricInput {
        metricsKey?: string;
    businessScore?: number;
    growthScore?: number;
}

export interface ExecutiveHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateExecutiveHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface ExecutiveFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateExecutiveFailureInput {
        intelligenceHubId: string;
        failureKey?: string;
    failureType?: string;
}

