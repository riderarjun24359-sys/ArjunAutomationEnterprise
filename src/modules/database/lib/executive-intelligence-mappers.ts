import type { DbAixIntelligenceHub,
    DbAixDailyExecutiveBrief,
    DbAixWeeklyBusinessReview,
    DbAixMonthlyExecutiveSummary,
    DbAixTrialConversionScore,
    DbAixRenewalProbability,
    DbAixChurnRisk,
    DbAixExpansionOpportunity,
    DbAixMrrTrend,
    DbAixArrTrend,
    DbAixRevenueGrowthMetric,
    DbAixRevenueRisk,
    DbAixPlatformHealthIntel,
    DbAixQueueHealthIntel,
    DbAixIntegrationHealthIntel,
    DbAixPerformanceTrend,
    DbAixUnusualLoginActivity,
    DbAixPermissionRisk,
    DbAixTenantSecurityTrend,
    DbAixComplianceWarning,
    DbAixTodayPriority,
    DbAixRecommendedAction,
    DbAixBusinessRisk,
    DbAixGrowthOpportunity,
    DbAixKnowledgeReasoningSession,
    DbAixEvidenceTrace,
    DbAixOrchestrationLink,
    DbAixRecommendationOutput,
    DbAixExecutiveMetric,
    DbAixExecutiveHealth,
    DbAixExecutiveFailure,
    DbAixAuditLog } from "@/src/modules/database/types/platform";
import type { CreateIntelligenceHubInput,
    IntelligenceHubSummary,
    CreateDailyExecutiveBriefInput,
    DailyExecutiveBriefSummary,
    CreateWeeklyBusinessReviewInput,
    WeeklyBusinessReviewSummary,
    CreateMonthlyExecutiveSummaryInput,
    MonthlyExecutiveSummarySummary,
    CreateTrialConversionScoreInput,
    TrialConversionScoreSummary,
    CreateRenewalProbabilityInput,
    RenewalProbabilitySummary,
    CreateChurnRiskInput,
    ChurnRiskSummary,
    CreateExpansionOpportunityInput,
    ExpansionOpportunitySummary,
    CreateMrrTrendInput,
    MrrTrendSummary,
    CreateArrTrendInput,
    ArrTrendSummary,
    CreateRevenueGrowthMetricInput,
    RevenueGrowthMetricSummary,
    CreateRevenueRiskInput,
    RevenueRiskSummary,
    CreatePlatformHealthIntelInput,
    PlatformHealthIntelSummary,
    CreateQueueHealthIntelInput,
    QueueHealthIntelSummary,
    CreateIntegrationHealthIntelInput,
    IntegrationHealthIntelSummary,
    CreatePerformanceTrendInput,
    PerformanceTrendSummary,
    CreateUnusualLoginActivityInput,
    UnusualLoginActivitySummary,
    CreatePermissionRiskInput,
    PermissionRiskSummary,
    CreateTenantSecurityTrendInput,
    TenantSecurityTrendSummary,
    CreateComplianceWarningInput,
    ComplianceWarningSummary,
    CreateTodayPriorityInput,
    TodayPrioritySummary,
    CreateRecommendedActionInput,
    RecommendedActionSummary,
    CreateBusinessRiskInput,
    BusinessRiskSummary,
    CreateGrowthOpportunityInput,
    GrowthOpportunitySummary,
    CreateKnowledgeReasoningSessionInput,
    KnowledgeReasoningSessionSummary,
    CreateEvidenceTraceInput,
    EvidenceTraceSummary,
    CreateOrchestrationLinkInput,
    OrchestrationLinkSummary,
    CreateRecommendationOutputInput,
    RecommendationOutputSummary,
    CreateExecutiveMetricInput,
    ExecutiveMetricSummary,
    CreateExecutiveHealthInput,
    ExecutiveHealthSummary,
    CreateExecutiveFailureInput,
    ExecutiveFailureSummary,
    AixDashboardStats,
    AixPipelineInfo,
    AuditEntry } from "@/src/modules/executive-intelligence/types";

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

export function mapIntelligenceHubSummary(record: DbAixIntelligenceHub): IntelligenceHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildIntelligenceHubPayload(organizationId: string, input: CreateIntelligenceHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapDailyExecutiveBriefSummary(record: DbAixDailyExecutiveBrief, maps?: { hubNameById: Map<string, string> }): DailyExecutiveBriefSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        briefKey: record.brief_key as string,
        briefDate: record.brief_date as string,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildDailyExecutiveBriefPayload(organizationId: string, input: CreateDailyExecutiveBriefInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        brief_key: input.briefKey ?? '',
        brief_date: input.briefDate ?? '',
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapWeeklyBusinessReviewSummary(record: DbAixWeeklyBusinessReview, maps?: { hubNameById: Map<string, string> }): WeeklyBusinessReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        weekStart: record.week_start as string,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildWeeklyBusinessReviewPayload(organizationId: string, input: CreateWeeklyBusinessReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        review_key: input.reviewKey ?? '',
        week_start: input.weekStart ?? '',
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapMonthlyExecutiveSummarySummary(record: DbAixMonthlyExecutiveSummary, maps?: { hubNameById: Map<string, string> }): MonthlyExecutiveSummarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        summaryKey: record.summary_key as string,
        monthStart: record.month_start as string,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildMonthlyExecutiveSummaryPayload(organizationId: string, input: CreateMonthlyExecutiveSummaryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        summary_key: input.summaryKey ?? '',
        month_start: input.monthStart ?? '',
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapTrialConversionScoreSummary(record: DbAixTrialConversionScore, maps?: { hubNameById: Map<string, string> }): TrialConversionScoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scoreKey: record.score_key as string,
        conversionRate: record.conversion_rate as number,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildTrialConversionScorePayload(organizationId: string, input: CreateTrialConversionScoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        score_key: input.scoreKey ?? '',
        conversion_rate: input.conversionRate ?? 0,
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapRenewalProbabilitySummary(record: DbAixRenewalProbability, maps?: { hubNameById: Map<string, string> }): RenewalProbabilitySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        probabilityKey: record.probability_key as string,
        renewalProbability: record.renewal_probability as number,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildRenewalProbabilityPayload(organizationId: string, input: CreateRenewalProbabilityInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        probability_key: input.probabilityKey ?? '',
        renewal_probability: input.renewalProbability ?? 0,
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapChurnRiskSummary(record: DbAixChurnRisk, maps?: { hubNameById: Map<string, string> }): ChurnRiskSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        riskKey: record.risk_key as string,
        churnScore: record.churn_score as number,
        riskLevel: record.risk_level as string,
        status: record.status,
    };
}

export function buildChurnRiskPayload(organizationId: string, input: CreateChurnRiskInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        risk_key: input.riskKey ?? '',
        churn_score: input.churnScore ?? 0,
        risk_level: input.riskLevel ?? '',
        status: "active",
    };
}

export function mapExpansionOpportunitySummary(record: DbAixExpansionOpportunity, maps?: { hubNameById: Map<string, string> }): ExpansionOpportunitySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        opportunityKey: record.opportunity_key as string,
        expansionScore: record.expansion_score as number,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildExpansionOpportunityPayload(organizationId: string, input: CreateExpansionOpportunityInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        opportunity_key: input.opportunityKey ?? '',
        expansion_score: input.expansionScore ?? 0,
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapMrrTrendSummary(record: DbAixMrrTrend, maps?: { hubNameById: Map<string, string> }): MrrTrendSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trendKey: record.trend_key as string,
        mrrAmount: record.mrr_amount as number,
        trendDirection: record.trend_direction as string,
        status: record.status,
    };
}

export function buildMrrTrendPayload(organizationId: string, input: CreateMrrTrendInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        trend_key: input.trendKey ?? '',
        mrr_amount: input.mrrAmount ?? 0,
        trend_direction: input.trendDirection ?? '',
        status: "active",
    };
}

export function mapArrTrendSummary(record: DbAixArrTrend, maps?: { hubNameById: Map<string, string> }): ArrTrendSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trendKey: record.trend_key as string,
        arrAmount: record.arr_amount as number,
        trendDirection: record.trend_direction as string,
        status: record.status,
    };
}

export function buildArrTrendPayload(organizationId: string, input: CreateArrTrendInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        trend_key: input.trendKey ?? '',
        arr_amount: input.arrAmount ?? 0,
        trend_direction: input.trendDirection ?? '',
        status: "active",
    };
}

export function mapRevenueGrowthMetricSummary(record: DbAixRevenueGrowthMetric, maps?: { hubNameById: Map<string, string> }): RevenueGrowthMetricSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        metricsKey: record.metrics_key as string,
        growthRate: record.growth_rate as number,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildRevenueGrowthMetricPayload(organizationId: string, input: CreateRevenueGrowthMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        metrics_key: input.metricsKey ?? '',
        growth_rate: input.growthRate ?? 0,
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapRevenueRiskSummary(record: DbAixRevenueRisk, maps?: { hubNameById: Map<string, string> }): RevenueRiskSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        riskKey: record.risk_key as string,
        riskAmount: record.risk_amount as number,
        riskLevel: record.risk_level as string,
        status: record.status,
    };
}

export function buildRevenueRiskPayload(organizationId: string, input: CreateRevenueRiskInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        risk_key: input.riskKey ?? '',
        risk_amount: input.riskAmount ?? 0,
        risk_level: input.riskLevel ?? '',
        status: "active",
    };
}

export function mapPlatformHealthIntelSummary(record: DbAixPlatformHealthIntel, maps?: { hubNameById: Map<string, string> }): PlatformHealthIntelSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        intelKey: record.intel_key as string,
        healthScore: record.health_score as number,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildPlatformHealthIntelPayload(organizationId: string, input: CreatePlatformHealthIntelInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        intel_key: input.intelKey ?? '',
        health_score: input.healthScore ?? 0,
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapQueueHealthIntelSummary(record: DbAixQueueHealthIntel, maps?: { hubNameById: Map<string, string> }): QueueHealthIntelSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        intelKey: record.intel_key as string,
        queueDepth: record.queue_depth as number,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildQueueHealthIntelPayload(organizationId: string, input: CreateQueueHealthIntelInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        intel_key: input.intelKey ?? '',
        queue_depth: input.queueDepth ?? 0,
        health_score: input.healthScore ?? 0,
        status: "active",
    };
}

export function mapIntegrationHealthIntelSummary(record: DbAixIntegrationHealthIntel, maps?: { hubNameById: Map<string, string> }): IntegrationHealthIntelSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        intelKey: record.intel_key as string,
        integrationName: record.integration_name as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildIntegrationHealthIntelPayload(organizationId: string, input: CreateIntegrationHealthIntelInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        intel_key: input.intelKey ?? '',
        integration_name: input.integrationName ?? '',
        health_score: input.healthScore ?? 0,
        status: "active",
    };
}

export function mapPerformanceTrendSummary(record: DbAixPerformanceTrend, maps?: { hubNameById: Map<string, string> }): PerformanceTrendSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trendKey: record.trend_key as string,
        performanceScore: record.performance_score as number,
        trendDirection: record.trend_direction as string,
        status: record.status,
    };
}

export function buildPerformanceTrendPayload(organizationId: string, input: CreatePerformanceTrendInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        trend_key: input.trendKey ?? '',
        performance_score: input.performanceScore ?? 0,
        trend_direction: input.trendDirection ?? '',
        status: "active",
    };
}

export function mapUnusualLoginActivitySummary(record: DbAixUnusualLoginActivity, maps?: { hubNameById: Map<string, string> }): UnusualLoginActivitySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        activityKey: record.activity_key as string,
        loginCount: record.login_count as number,
        riskLevel: record.risk_level as string,
        status: record.status,
    };
}

export function buildUnusualLoginActivityPayload(organizationId: string, input: CreateUnusualLoginActivityInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        activity_key: input.activityKey ?? '',
        login_count: input.loginCount ?? 0,
        risk_level: input.riskLevel ?? '',
        status: "active",
    };
}

export function mapPermissionRiskSummary(record: DbAixPermissionRisk, maps?: { hubNameById: Map<string, string> }): PermissionRiskSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        riskKey: record.risk_key as string,
        riskType: record.risk_type as string,
        riskLevel: record.risk_level as string,
        status: record.status,
    };
}

export function buildPermissionRiskPayload(organizationId: string, input: CreatePermissionRiskInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        risk_key: input.riskKey ?? '',
        risk_type: input.riskType ?? '',
        risk_level: input.riskLevel ?? '',
        status: "active",
    };
}

export function mapTenantSecurityTrendSummary(record: DbAixTenantSecurityTrend, maps?: { hubNameById: Map<string, string> }): TenantSecurityTrendSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trendKey: record.trend_key as string,
        securityScore: record.security_score as number,
        trendDirection: record.trend_direction as string,
        status: record.status,
    };
}

export function buildTenantSecurityTrendPayload(organizationId: string, input: CreateTenantSecurityTrendInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        trend_key: input.trendKey ?? '',
        security_score: input.securityScore ?? 0,
        trend_direction: input.trendDirection ?? '',
        status: "active",
    };
}

export function mapComplianceWarningSummary(record: DbAixComplianceWarning, maps?: { hubNameById: Map<string, string> }): ComplianceWarningSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        warningKey: record.warning_key as string,
        complianceType: record.compliance_type as string,
        severity: record.severity as string,
        status: record.status,
    };
}

export function buildComplianceWarningPayload(organizationId: string, input: CreateComplianceWarningInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        warning_key: input.warningKey ?? '',
        compliance_type: input.complianceType ?? '',
        severity: input.severity ?? '',
        status: "active",
    };
}

export function mapTodayPrioritySummary(record: DbAixTodayPriority, maps?: { hubNameById: Map<string, string> }): TodayPrioritySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        priorityKey: record.priority_key as string,
        priorityTitle: record.priority_title as string,
        priorityRank: record.priority_rank as number,
        status: record.status,
    };
}

export function buildTodayPriorityPayload(organizationId: string, input: CreateTodayPriorityInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        priority_key: input.priorityKey ?? '',
        priority_title: input.priorityTitle ?? '',
        priority_rank: input.priorityRank ?? 0,
        status: "active",
    };
}

export function mapRecommendedActionSummary(record: DbAixRecommendedAction, maps?: { hubNameById: Map<string, string> }): RecommendedActionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        actionKey: record.action_key as string,
        actionTitle: record.action_title as string,
        actionType: record.action_type as string,
        status: record.status,
    };
}

export function buildRecommendedActionPayload(organizationId: string, input: CreateRecommendedActionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        action_key: input.actionKey ?? '',
        action_title: input.actionTitle ?? '',
        action_type: input.actionType ?? '',
        status: "active",
    };
}

export function mapBusinessRiskSummary(record: DbAixBusinessRisk, maps?: { hubNameById: Map<string, string> }): BusinessRiskSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        riskKey: record.risk_key as string,
        riskTitle: record.risk_title as string,
        riskLevel: record.risk_level as string,
        status: record.status,
    };
}

export function buildBusinessRiskPayload(organizationId: string, input: CreateBusinessRiskInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        risk_key: input.riskKey ?? '',
        risk_title: input.riskTitle ?? '',
        risk_level: input.riskLevel ?? '',
        status: "active",
    };
}

export function mapGrowthOpportunitySummary(record: DbAixGrowthOpportunity, maps?: { hubNameById: Map<string, string> }): GrowthOpportunitySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        opportunityKey: record.opportunity_key as string,
        opportunityTitle: record.opportunity_title as string,
        growthScore: record.growth_score as number,
        status: record.status,
    };
}

export function buildGrowthOpportunityPayload(organizationId: string, input: CreateGrowthOpportunityInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        opportunity_key: input.opportunityKey ?? '',
        opportunity_title: input.opportunityTitle ?? '',
        growth_score: input.growthScore ?? 0,
        status: "active",
    };
}

export function mapKnowledgeReasoningSessionSummary(record: DbAixKnowledgeReasoningSession, maps?: { hubNameById: Map<string, string> }): KnowledgeReasoningSessionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        sessionKey: record.session_key as string,
        reasoningType: record.reasoning_type as string,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildKnowledgeReasoningSessionPayload(organizationId: string, input: CreateKnowledgeReasoningSessionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        session_key: input.sessionKey ?? '',
        reasoning_type: input.reasoningType ?? '',
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapEvidenceTraceSummary(record: DbAixEvidenceTrace, maps?: { hubNameById: Map<string, string> }): EvidenceTraceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        traceKey: record.trace_key as string,
        sourceModule: record.source_module as string,
        traceSummary: record.trace_summary as string,
        status: record.status,
    };
}

export function buildEvidenceTracePayload(organizationId: string, input: CreateEvidenceTraceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        trace_key: input.traceKey ?? '',
        source_module: input.sourceModule ?? '',
        trace_summary: input.traceSummary ?? '',
        status: "active",
    };
}

export function mapOrchestrationLinkSummary(record: DbAixOrchestrationLink, maps?: { hubNameById: Map<string, string> }): OrchestrationLinkSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        linkKey: record.link_key as string,
        linkType: record.link_type as string,
        targetRef: record.target_ref as string,
        status: record.status,
    };
}

export function buildOrchestrationLinkPayload(organizationId: string, input: CreateOrchestrationLinkInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        link_key: input.linkKey ?? '',
        link_type: input.linkType ?? '',
        target_ref: input.targetRef ?? '',
        status: "active",
    };
}

export function mapRecommendationOutputSummary(record: DbAixRecommendationOutput, maps?: { hubNameById: Map<string, string> }): RecommendationOutputSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        outputKey: record.output_key as string,
        recommendationText: record.recommendation_text as string,
        aiConfidenceScore: record.ai_confidence_score as number,
        status: record.status,
    };
}

export function buildRecommendationOutputPayload(organizationId: string, input: CreateRecommendationOutputInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        output_key: input.outputKey ?? '',
        recommendation_text: input.recommendationText ?? '',
        ai_confidence_score: input.aiConfidenceScore ?? 0,
        status: "active",
    };
}

export function mapExecutiveMetricSummary(record: DbAixExecutiveMetric): ExecutiveMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        businessScore: record.business_score as number,
        growthScore: record.growth_score as number,
        status: record.status,
    };
}

export function buildExecutiveMetricPayload(organizationId: string, input: CreateExecutiveMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        business_score: input.businessScore ?? 0,
        growth_score: input.growthScore ?? 0,
        status: "active",
    };
}

export function mapExecutiveHealthSummary(record: DbAixExecutiveHealth): ExecutiveHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildExecutiveHealthPayload(organizationId: string, input: CreateExecutiveHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapExecutiveFailureSummary(record: DbAixExecutiveFailure, maps?: { hubNameById: Map<string, string> }): ExecutiveFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildExecutiveFailurePayload(organizationId: string, input: CreateExecutiveFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.intelligenceHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapRecommendationOutputForStats(r: DbAixRecommendationOutput) { return { ai_confidence_score: r.ai_confidence_score, status: r.status }; }
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
