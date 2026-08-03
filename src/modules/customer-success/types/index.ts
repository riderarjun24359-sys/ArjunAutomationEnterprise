export type CustomerSuccessTab =
    | "overview"
    | "engagements"
    | "onboarding"
    | "adoption"
    | "healthScores"
    | "renewalPlans"
    | "expansionOpportunities"
    | "riskAnalysis"
    | "supportTrends"
    | "successPlaybooks"
    | "qbrReports"
    | "communicationPlans"
    | "trainingRecommendations"
    | "feedbackAnalysis"
    | "slaMonitoring"
    | "kpiDashboards"
    | "churnPrediction"
    | "lifecycleManagement"
    | "executiveSummaries"
    | "audit"
    | "api";

export interface CsDashboardStats {
    totalEngagements: number;
    activeEngagements: number;
    onboardingWorkflowCount: number;
    adoptionTrackingCount: number;
    healthScoreCount: number;
    renewalPlanCount: number;
    expansionOpportunityCount: number;
    riskAnalysisCount: number;
    supportTrendAnalysisCount: number;
    successPlaybookCount: number;
    qbrReportCount: number;
    communicationPlanCount: number;
    trainingRecommendationCount: number;
    feedbackAnalysisCount: number;
    slaMonitoringCount: number;
    successKpiDashboardCount: number;
    churnPredictionCount: number;
    lifecycleManagementCount: number;
    executiveSummaryCount: number;
    avgHealthScore: number;
    avgAdoptionPercent: number;
}

export interface CsPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentWorker: string;
    nextWorker: string;
    previousWorker: string;
}

export interface EngagementSummary {
    id: string;
    title: string;
    engagementKey: string;
    baEngagementTitle?: string | null;
    saEngagementTitle?: string | null;
    dfEngagementTitle?: string | null;
    qaEngagementTitle?: string | null;
    ddEngagementTitle?: string | null;
    solutionArchitectureTitle?: string | null;
    workPackageTitle?: string | null;
    qaReleaseReadinessTitle?: string | null;
    ddReleaseVersionTitle?: string | null;
    brdTitle?: string | null;
    clientName?: string | null;
    contactName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface OnboardingWorkflowSummary {
    id: string;
    engagementTitle: string;
    workflowKey: string;
    name: string;
    phaseCount: number;
    status: string;
}

export interface AdoptionTrackingSummary {
    id: string;
    engagementTitle: string;
    trackingKey: string;
    name: string;
    adoptionPercent: number;
    status: string;
}

export interface HealthScoreSummary {
    id: string;
    engagementTitle: string;
    scoreKey: string;
    name: string;
    overallScore: number;
    status: string;
}

export interface RenewalPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    renewalValueUsd: number;
    status: string;
}

export interface ExpansionOpportunitySummary {
    id: string;
    engagementTitle: string;
    opportunityKey: string;
    name: string;
    opportunityType: string;
    estimatedValueUsd: number;
    status: string;
}

export interface RiskAnalysisSummary {
    id: string;
    engagementTitle: string;
    analysisKey: string;
    name: string;
    riskLevel: string;
    status: string;
}

export interface SupportTrendAnalysisSummary {
    id: string;
    engagementTitle: string;
    analysisKey: string;
    name: string;
    metricCount: number;
    insightsPreview: string;
    status: string;
}

export interface SuccessPlaybookSummary {
    id: string;
    engagementTitle: string;
    playbookKey: string;
    name: string;
    playbookType: string;
    stepCount: number;
    status: string;
}

export interface QbrReportSummary {
    id: string;
    engagementTitle: string;
    reportKey: string;
    title: string;
    quarter: string;
    sectionCount: number;
    status: string;
}

export interface CommunicationPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    cadence: string;
    status: string;
}

export interface TrainingRecommendationSummary {
    id: string;
    engagementTitle: string;
    recommendationKey: string;
    name: string;
    priority: string;
    status: string;
}

export interface FeedbackAnalysisSummary {
    id: string;
    engagementTitle: string;
    analysisKey: string;
    name: string;
    sentimentScore: number;
    status: string;
}

export interface SlaMonitoringSummary {
    id: string;
    engagementTitle: string;
    monitoringKey: string;
    name: string;
    compliancePercent: number;
    status: string;
}

export interface SuccessKpiDashboardSummary {
    id: string;
    engagementTitle: string;
    dashboardKey: string;
    name: string;
    kpiCount: number;
    refreshCadence: string;
    status: string;
}

export interface ChurnPredictionSummary {
    id: string;
    engagementTitle: string;
    predictionKey: string;
    name: string;
    churnProbability: number;
    status: string;
}

export interface LifecycleManagementSummary {
    id: string;
    engagementTitle: string;
    lifecycleKey: string;
    name: string;
    currentStage: string;
    status: string;
}

export interface ExecutiveSummarySummary {
    id: string;
    engagementTitle: string;
    summaryKey: string;
    title: string;
    contentPreview: string;
    status: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    createdAt: string;
}

export interface CreateEngagementInput {
    title: string;
    engagementKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    qaEngagementId?: string;
    ddEngagementId?: string;
    brdId?: string;
    frsId?: string;
    solutionArchitectureId?: string;
    workPackageId?: string;
    qaReleaseReadinessId?: string;
    ddReleaseVersionId?: string;
    clientId?: string;
    projectId?: string;
    contactId?: string;
    agentId?: string;
    sessionId?: string;
    knowledgeContextId?: string;
    pipelineStage?: string;
    summary?: string;
}

export interface CreateOnboardingWorkflowInput {
    engagementId: string;
    workflowKey: string;
    name: string;
    phases?: unknown[];
    milestones?: unknown[];
}

export interface CreateAdoptionTrackingInput {
    engagementId: string;
    trackingKey: string;
    name: string;
    featureAdoptions?: unknown[];
    adoptionPercent?: number;
}

export interface CreateHealthScoreInput {
    engagementId: string;
    scoreKey: string;
    name: string;
    overallScore?: number;
    dimensionScores?: unknown[];
}

export interface CreateRenewalPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    renewalDate?: string;
    renewalValueUsd?: number;
    renewalActions?: unknown[];
}

export interface CreateExpansionOpportunityInput {
    engagementId: string;
    opportunityKey: string;
    name: string;
    opportunityType?: string;
    estimatedValueUsd?: number;
    signals?: unknown[];
}

export interface CreateRiskAnalysisInput {
    engagementId: string;
    analysisKey: string;
    name: string;
    riskLevel?: string;
    riskFactors?: unknown[];
    mitigationPlan?: string;
}

export interface CreateSupportTrendAnalysisInput {
    engagementId: string;
    analysisKey: string;
    name: string;
    trendMetrics?: unknown[];
    insights?: string;
}

export interface CreateSuccessPlaybookInput {
    engagementId: string;
    playbookKey: string;
    name: string;
    playbookType?: string;
    steps?: unknown[];
}

export interface CreateQbrReportInput {
    engagementId: string;
    reportKey: string;
    title: string;
    quarter?: string;
    reportSections?: unknown[];
}

export interface CreateCommunicationPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    channels?: unknown[];
    cadence?: string;
}

export interface CreateTrainingRecommendationInput {
    engagementId: string;
    recommendationKey: string;
    name: string;
    trainingModules?: unknown[];
    priority?: string;
}

export interface CreateFeedbackAnalysisInput {
    engagementId: string;
    analysisKey: string;
    name: string;
    sentimentScore?: number;
    themes?: unknown[];
    recommendations?: string;
}

export interface CreateSlaMonitoringInput {
    engagementId: string;
    monitoringKey: string;
    name: string;
    slaTargets?: unknown[];
    compliancePercent?: number;
}

export interface CreateSuccessKpiDashboardInput {
    engagementId: string;
    dashboardKey: string;
    name: string;
    kpis?: unknown[];
    refreshCadence?: string;
}

export interface CreateChurnPredictionInput {
    engagementId: string;
    predictionKey: string;
    name: string;
    churnProbability?: number;
    riskSignals?: unknown[];
    retentionActions?: unknown[];
}

export interface CreateLifecycleManagementInput {
    engagementId: string;
    lifecycleKey: string;
    name: string;
    currentStage?: string;
    stageHistory?: unknown[];
    nextActions?: unknown[];
}

export interface CreateExecutiveSummaryInput {
    engagementId: string;
    summaryKey: string;
    title: string;
    summaryContent?: string;
    keyMetrics?: unknown[];
}

export interface CsSdkStartEngagementInput {
    title: string;
    engagementKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    qaEngagementId?: string;
    ddEngagementId?: string;
    ddReleaseVersionId?: string;
    solutionArchitectureId?: string;
    workPackageId?: string;
    qaReleaseReadinessId?: string;
    brdId?: string;
    frsId?: string;
    clientId?: string;
    projectId?: string;
    contactId?: string;
    agentId?: string;
    sessionId?: string;
}

export interface CsSdkStartEngagementResult {
    engagementId: string;
    engagementKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface CsSdkGenerateArtifactInput {
    engagementId: string;
    artifactType: "onboarding_workflow" | "health_score" | "qbr_report" | "executive_summary";
    title: string;
    content: string;
}

export interface CsSdkGenerateArtifactResult {
    artifactId: string;
    artifactType: string;
    status: string;
}

export interface CsSdkRunAnalysisInput {
    engagementId: string;
    analysisType: "churn" | "support_trends" | "feedback";
    inputPayload: Record<string, unknown>;
}

export interface CsSdkRunAnalysisResult {
    analysisId: string;
    analysisType: string;
    status: string;
}
