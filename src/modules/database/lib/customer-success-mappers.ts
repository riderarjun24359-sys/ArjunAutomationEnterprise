import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaBrd,
    DbBaEngagement,
    DbBaFrsDocument,
    DbClient,
    DbContact,
    DbCsAdoptionTracking,
    DbCsAuditLog,
    DbCsChurnPrediction,
    DbCsCommunicationPlan,
    DbCsEngagement,
    DbCsExecutiveSummary,
    DbCsExpansionOpportunity,
    DbCsFeedbackAnalysis,
    DbCsHealthScore,
    DbCsLifecycleManagement,
    DbCsOnboardingWorkflow,
    DbCsQbrReport,
    DbCsRenewalPlan,
    DbCsRiskAnalysis,
    DbCsSlaMonitoring,
    DbCsSuccessKpiDashboard,
    DbCsSuccessPlaybook,
    DbCsSupportTrendAnalysis,
    DbCsTrainingRecommendation,
    DbDdEngagement,
    DbDdReleaseVersion,
    DbDfEngagement,
    DbDfWorkPackage,
    DbProject,
    DbQaEngagement,
    DbQaReleaseReadiness,
    DbSaEngagement,
    DbSaSolutionArchitecture,
} from "@/src/modules/database/types/platform";
import type {
    AdoptionTrackingSummary,
    AuditEntry,
    ChurnPredictionSummary,
    CommunicationPlanSummary,
    CreateAdoptionTrackingInput,
    CreateChurnPredictionInput,
    CreateCommunicationPlanInput,
    CreateEngagementInput,
    CreateExecutiveSummaryInput,
    CreateExpansionOpportunityInput,
    CreateFeedbackAnalysisInput,
    CreateHealthScoreInput,
    CreateLifecycleManagementInput,
    CreateOnboardingWorkflowInput,
    CreateQbrReportInput,
    CreateRenewalPlanInput,
    CreateRiskAnalysisInput,
    CreateSlaMonitoringInput,
    CreateSuccessKpiDashboardInput,
    CreateSuccessPlaybookInput,
    CreateSupportTrendAnalysisInput,
    CreateTrainingRecommendationInput,
    CsDashboardStats,
    CsPipelineInfo,
    EngagementSummary,
    ExecutiveSummarySummary,
    ExpansionOpportunitySummary,
    FeedbackAnalysisSummary,
    HealthScoreSummary,
    LifecycleManagementSummary,
    OnboardingWorkflowSummary,
    QbrReportSummary,
    RenewalPlanSummary,
    RiskAnalysisSummary,
    SlaMonitoringSummary,
    SuccessKpiDashboardSummary,
    SuccessPlaybookSummary,
    SupportTrendAnalysisSummary,
    TrainingRecommendationSummary,
} from "@/src/modules/customer-success/types";

type LookupMaps = {
    engagements: Map<string, DbCsEngagement>;
    baEngagements: Map<string, DbBaEngagement>;
    saEngagements: Map<string, DbSaEngagement>;
    dfEngagements: Map<string, DbDfEngagement>;
    qaEngagements: Map<string, DbQaEngagement>;
    ddEngagements: Map<string, DbDdEngagement>;
    solutionArchitectures: Map<string, DbSaSolutionArchitecture>;
    workPackages: Map<string, DbDfWorkPackage>;
    qaReleaseReadiness: Map<string, DbQaReleaseReadiness>;
    ddReleaseVersions: Map<string, DbDdReleaseVersion>;
    brds: Map<string, DbBaBrd>;
    frsDocuments: Map<string, DbBaFrsDocument>;
    clients: Map<string, DbClient>;
    contacts: Map<string, DbContact>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
};

export const buildLookupMaps = (
    engagements: DbCsEngagement[],
    baEngagements: DbBaEngagement[],
    saEngagements: DbSaEngagement[],
    dfEngagements: DbDfEngagement[],
    qaEngagements: DbQaEngagement[],
    ddEngagements: DbDdEngagement[],
    solutionArchitectures: DbSaSolutionArchitecture[],
    workPackages: DbDfWorkPackage[],
    qaReleaseReadinessRecords: DbQaReleaseReadiness[],
    ddReleaseVersions: DbDdReleaseVersion[],
    brds: DbBaBrd[],
    frsDocuments: DbBaFrsDocument[],
    clients: DbClient[],
    contacts: DbContact[],
    projects: DbProject[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
): LookupMaps => ({
    engagements: new Map(engagements.map((item) => [item.id, item])),
    baEngagements: new Map(baEngagements.map((item) => [item.id, item])),
    saEngagements: new Map(saEngagements.map((item) => [item.id, item])),
    dfEngagements: new Map(dfEngagements.map((item) => [item.id, item])),
    qaEngagements: new Map(qaEngagements.map((item) => [item.id, item])),
    ddEngagements: new Map(ddEngagements.map((item) => [item.id, item])),
    solutionArchitectures: new Map(solutionArchitectures.map((item) => [item.id, item])),
    workPackages: new Map(workPackages.map((item) => [item.id, item])),
    qaReleaseReadiness: new Map(qaReleaseReadinessRecords.map((item) => [item.id, item])),
    ddReleaseVersions: new Map(ddReleaseVersions.map((item) => [item.id, item])),
    brds: new Map(brds.map((item) => [item.id, item])),
    frsDocuments: new Map(frsDocuments.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    contacts: new Map(contacts.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
});

const engagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.engagements.get(id)?.title ?? null : null);
const baEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.baEngagements.get(id)?.title ?? null : null);
const saEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.saEngagements.get(id)?.title ?? null : null);
const dfEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.dfEngagements.get(id)?.title ?? null : null);
const qaEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.qaEngagements.get(id)?.title ?? null : null);
const ddEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.ddEngagements.get(id)?.title ?? null : null);
const solutionArchitectureTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.solutionArchitectures.get(id)?.title ?? null : null);
const workPackageTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.workPackages.get(id)?.title ?? null : null);
const qaReleaseReadinessTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.qaReleaseReadiness.get(id)?.title ?? null : null);
const ddReleaseVersionTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.ddReleaseVersions.get(id)?.version_number ?? null : null);
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const contactName = (maps: LookupMaps, id?: string | null) => {
    if (!id) return null;
    const c = maps.contacts.get(id);
    return c ? `${c.first_name} ${c.last_name}`.trim() : null;
};
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);
const brdTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.brds.get(id)?.title ?? null : null);

export const mapEngagementSummary = (record: DbCsEngagement, maps: LookupMaps): EngagementSummary => ({
    id: record.id,
    title: record.title,
    engagementKey: record.engagement_key,
    baEngagementTitle: baEngagementTitle(maps, record.ba_engagement_id),
    saEngagementTitle: saEngagementTitle(maps, record.sa_engagement_id),
    dfEngagementTitle: dfEngagementTitle(maps, record.df_engagement_id),
    qaEngagementTitle: qaEngagementTitle(maps, record.qa_engagement_id),
    ddEngagementTitle: ddEngagementTitle(maps, record.dd_engagement_id),
    solutionArchitectureTitle: solutionArchitectureTitle(maps, record.solution_architecture_id),
    workPackageTitle: workPackageTitle(maps, record.work_package_id),
    qaReleaseReadinessTitle: qaReleaseReadinessTitle(maps, record.qa_release_readiness_id),
    ddReleaseVersionTitle: ddReleaseVersionTitle(maps, record.dd_release_version_id),
    brdTitle: brdTitle(maps, record.brd_id),
    clientName: clientName(maps, record.client_id),
    contactName: contactName(maps, record.contact_id),
    projectName: projectName(maps, record.project_id),
    agentName: agentName(maps, record.agent_id),
    pipelineStage: record.pipeline_stage,
    status: record.status,
    summaryPreview: record.summary.slice(0, 120),
    updatedAt: record.updated_at,
});

export const mapOnboardingWorkflowSummary = (record: DbCsOnboardingWorkflow, maps: LookupMaps): OnboardingWorkflowSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    workflowKey: record.workflow_key,
    name: record.name,
    phaseCount: Array.isArray(record.phases) ? record.phases.length : 0,
    status: record.status,
});

export const mapAdoptionTrackingSummary = (record: DbCsAdoptionTracking, maps: LookupMaps): AdoptionTrackingSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    trackingKey: record.tracking_key,
    name: record.name,
    adoptionPercent: record.adoption_percent,
    status: record.status,
});

export const mapHealthScoreSummary = (record: DbCsHealthScore, maps: LookupMaps): HealthScoreSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    scoreKey: record.score_key,
    name: record.name,
    overallScore: record.overall_score,
    status: record.status,
});

export const mapRenewalPlanSummary = (record: DbCsRenewalPlan, maps: LookupMaps): RenewalPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    planKey: record.plan_key,
    name: record.name,
    renewalValueUsd: record.renewal_value_usd,
    status: record.status,
});

export const mapExpansionOpportunitySummary = (record: DbCsExpansionOpportunity, maps: LookupMaps): ExpansionOpportunitySummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    opportunityKey: record.opportunity_key,
    name: record.name,
    opportunityType: record.opportunity_type,
    estimatedValueUsd: record.estimated_value_usd,
    status: record.status,
});

export const mapRiskAnalysisSummary = (record: DbCsRiskAnalysis, maps: LookupMaps): RiskAnalysisSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    analysisKey: record.analysis_key,
    name: record.name,
    riskLevel: record.risk_level,
    status: record.status,
});

export const mapSupportTrendAnalysisSummary = (record: DbCsSupportTrendAnalysis, maps: LookupMaps): SupportTrendAnalysisSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    analysisKey: record.analysis_key,
    name: record.name,
    metricCount: Array.isArray(record.trend_metrics) ? record.trend_metrics.length : 0,
    insightsPreview: record.insights.slice(0, 80),
    status: record.status,
});

export const mapSuccessPlaybookSummary = (record: DbCsSuccessPlaybook, maps: LookupMaps): SuccessPlaybookSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    playbookKey: record.playbook_key,
    name: record.name,
    playbookType: record.playbook_type,
    stepCount: Array.isArray(record.steps) ? record.steps.length : 0,
    status: record.status,
});

export const mapQbrReportSummary = (record: DbCsQbrReport, maps: LookupMaps): QbrReportSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    reportKey: record.report_key,
    title: record.title,
    quarter: record.quarter,
    sectionCount: Array.isArray(record.report_sections) ? record.report_sections.length : 0,
    status: record.status,
});

export const mapCommunicationPlanSummary = (record: DbCsCommunicationPlan, maps: LookupMaps): CommunicationPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    planKey: record.plan_key,
    name: record.name,
    cadence: record.cadence,
    status: record.status,
});

export const mapTrainingRecommendationSummary = (record: DbCsTrainingRecommendation, maps: LookupMaps): TrainingRecommendationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    recommendationKey: record.recommendation_key,
    name: record.name,
    priority: record.priority,
    status: record.status,
});

export const mapFeedbackAnalysisSummary = (record: DbCsFeedbackAnalysis, maps: LookupMaps): FeedbackAnalysisSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    analysisKey: record.analysis_key,
    name: record.name,
    sentimentScore: record.sentiment_score,
    status: record.status,
});

export const mapSlaMonitoringSummary = (record: DbCsSlaMonitoring, maps: LookupMaps): SlaMonitoringSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    monitoringKey: record.monitoring_key,
    name: record.name,
    compliancePercent: record.compliance_percent,
    status: record.status,
});

export const mapSuccessKpiDashboardSummary = (record: DbCsSuccessKpiDashboard, maps: LookupMaps): SuccessKpiDashboardSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    dashboardKey: record.dashboard_key,
    name: record.name,
    kpiCount: Array.isArray(record.kpis) ? record.kpis.length : 0,
    refreshCadence: record.refresh_cadence,
    status: record.status,
});

export const mapChurnPredictionSummary = (record: DbCsChurnPrediction, maps: LookupMaps): ChurnPredictionSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    predictionKey: record.prediction_key,
    name: record.name,
    churnProbability: record.churn_probability,
    status: record.status,
});

export const mapLifecycleManagementSummary = (record: DbCsLifecycleManagement, maps: LookupMaps): LifecycleManagementSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    lifecycleKey: record.lifecycle_key,
    name: record.name,
    currentStage: record.current_stage,
    status: record.status,
});

export const mapExecutiveSummarySummary = (record: DbCsExecutiveSummary, maps: LookupMaps): ExecutiveSummarySummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "",
    summaryKey: record.summary_key,
    title: record.title,
    contentPreview: record.summary_content.slice(0, 80),
    status: record.status,
});

export const mapAuditEntry = (record: DbCsAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildCsDashboardStats = (input: {
    engagements: EngagementSummary[];
    onboardingWorkflows: OnboardingWorkflowSummary[];
    adoptionTracking: AdoptionTrackingSummary[];
    healthScores: HealthScoreSummary[];
    renewalPlans: RenewalPlanSummary[];
    expansionOpportunities: ExpansionOpportunitySummary[];
    riskAnalyses: RiskAnalysisSummary[];
    supportTrendAnalyses: SupportTrendAnalysisSummary[];
    successPlaybooks: SuccessPlaybookSummary[];
    qbrReports: QbrReportSummary[];
    communicationPlans: CommunicationPlanSummary[];
    trainingRecommendations: TrainingRecommendationSummary[];
    feedbackAnalyses: FeedbackAnalysisSummary[];
    slaMonitoring: SlaMonitoringSummary[];
    successKpiDashboards: SuccessKpiDashboardSummary[];
    churnPredictions: ChurnPredictionSummary[];
    lifecycleManagement: LifecycleManagementSummary[];
    executiveSummaries: ExecutiveSummarySummary[];
}): CsDashboardStats => ({
    totalEngagements: input.engagements.length,
    activeEngagements: input.engagements.filter((e) => e.status === "active").length,
    onboardingWorkflowCount: input.onboardingWorkflows.length,
    adoptionTrackingCount: input.adoptionTracking.length,
    healthScoreCount: input.healthScores.length,
    renewalPlanCount: input.renewalPlans.length,
    expansionOpportunityCount: input.expansionOpportunities.length,
    riskAnalysisCount: input.riskAnalyses.length,
    supportTrendAnalysisCount: input.supportTrendAnalyses.length,
    successPlaybookCount: input.successPlaybooks.length,
    qbrReportCount: input.qbrReports.length,
    communicationPlanCount: input.communicationPlans.length,
    trainingRecommendationCount: input.trainingRecommendations.length,
    feedbackAnalysisCount: input.feedbackAnalyses.length,
    slaMonitoringCount: input.slaMonitoring.length,
    successKpiDashboardCount: input.successKpiDashboards.length,
    churnPredictionCount: input.churnPredictions.length,
    lifecycleManagementCount: input.lifecycleManagement.length,
    executiveSummaryCount: input.executiveSummaries.length,
    avgHealthScore: input.healthScores.length ? input.healthScores.reduce((s, h) => s + h.overallScore, 0) / input.healthScores.length : 0,
    avgAdoptionPercent: input.adoptionTracking.length ? input.adoptionTracking.reduce((s, a) => s + a.adoptionPercent, 0) / input.adoptionTracking.length : 0,
});

export const buildCsPipelineInfo = (): CsPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "business_analyst", label: "AI Business Analyst" },
        { key: "architecture_design", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa_engineering", label: "AI QA Engineering" },
        { key: "devops_deployment", label: "AI DevOps & Deployment" },
        { key: "customer_success", label: "AI Customer Success Manager" },
        { key: "continuous_success", label: "Continuous Customer Success" },
    ],
    currentWorker: "AI Customer Success Manager",
    nextWorker: "Continuous Customer Success",
    previousWorker: "AI DevOps & Deployment Engineer",
});

export const buildEngagementPayload = (organizationId: string, input: CreateEngagementInput) => ({
    organization_id: organizationId,
    title: input.title,
    engagement_key: input.engagementKey,
    ba_engagement_id: input.baEngagementId || null,
    sa_engagement_id: input.saEngagementId || null,
    df_engagement_id: input.dfEngagementId || null,
    qa_engagement_id: input.qaEngagementId || null,
    dd_engagement_id: input.ddEngagementId || null,
    brd_id: input.brdId || null,
    frs_id: input.frsId || null,
    solution_architecture_id: input.solutionArchitectureId || null,
    work_package_id: input.workPackageId || null,
    qa_release_readiness_id: input.qaReleaseReadinessId || null,
    dd_release_version_id: input.ddReleaseVersionId || null,
    client_id: input.clientId || null,
    project_id: input.projectId || null,
    contact_id: input.contactId || null,
    agent_id: input.agentId || null,
    session_id: input.sessionId || null,
    knowledge_context_id: input.knowledgeContextId || null,
    pipeline_stage: input.pipelineStage ?? "customer_success",
    summary: input.summary ?? "",
});

export const buildOnboardingWorkflowPayload = (organizationId: string, input: CreateOnboardingWorkflowInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    workflow_key: input.workflowKey,
    name: input.name,
    phases: input.phases ?? [],
    milestones: input.milestones ?? [],
});

export const buildAdoptionTrackingPayload = (organizationId: string, input: CreateAdoptionTrackingInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    tracking_key: input.trackingKey,
    name: input.name,
    feature_adoptions: input.featureAdoptions ?? [],
    adoption_percent: input.adoptionPercent ?? 0,
});

export const buildHealthScorePayload = (organizationId: string, input: CreateHealthScoreInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    score_key: input.scoreKey,
    name: input.name,
    overall_score: input.overallScore ?? 0,
    dimension_scores: input.dimensionScores ?? [],
});

export const buildRenewalPlanPayload = (organizationId: string, input: CreateRenewalPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    renewal_date: input.renewalDate ?? null,
    renewal_value_usd: input.renewalValueUsd ?? 0,
    renewal_actions: input.renewalActions ?? [],
});

export const buildExpansionOpportunityPayload = (organizationId: string, input: CreateExpansionOpportunityInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    opportunity_key: input.opportunityKey,
    name: input.name,
    opportunity_type: input.opportunityType ?? "upsell",
    estimated_value_usd: input.estimatedValueUsd ?? 0,
    signals: input.signals ?? [],
});

export const buildRiskAnalysisPayload = (organizationId: string, input: CreateRiskAnalysisInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    analysis_key: input.analysisKey,
    name: input.name,
    risk_level: input.riskLevel ?? "medium",
    risk_factors: input.riskFactors ?? [],
    mitigation_plan: input.mitigationPlan ?? "",
});

export const buildSupportTrendAnalysisPayload = (organizationId: string, input: CreateSupportTrendAnalysisInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    analysis_key: input.analysisKey,
    name: input.name,
    trend_metrics: input.trendMetrics ?? [],
    insights: input.insights ?? "",
});

export const buildSuccessPlaybookPayload = (organizationId: string, input: CreateSuccessPlaybookInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    playbook_key: input.playbookKey,
    name: input.name,
    playbook_type: input.playbookType ?? "onboarding",
    steps: input.steps ?? [],
});

export const buildQbrReportPayload = (organizationId: string, input: CreateQbrReportInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    report_key: input.reportKey,
    title: input.title,
    quarter: input.quarter ?? "",
    report_sections: input.reportSections ?? [],
});

export const buildCommunicationPlanPayload = (organizationId: string, input: CreateCommunicationPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    channels: input.channels ?? [],
    cadence: input.cadence ?? "monthly",
});

export const buildTrainingRecommendationPayload = (organizationId: string, input: CreateTrainingRecommendationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    recommendation_key: input.recommendationKey,
    name: input.name,
    training_modules: input.trainingModules ?? [],
    priority: input.priority ?? "medium",
});

export const buildFeedbackAnalysisPayload = (organizationId: string, input: CreateFeedbackAnalysisInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    analysis_key: input.analysisKey,
    name: input.name,
    sentiment_score: input.sentimentScore ?? 0,
    themes: input.themes ?? [],
    recommendations: input.recommendations ?? "",
});

export const buildSlaMonitoringPayload = (organizationId: string, input: CreateSlaMonitoringInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    monitoring_key: input.monitoringKey,
    name: input.name,
    sla_targets: input.slaTargets ?? [],
    compliance_percent: input.compliancePercent ?? 100,
});

export const buildSuccessKpiDashboardPayload = (organizationId: string, input: CreateSuccessKpiDashboardInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    dashboard_key: input.dashboardKey,
    name: input.name,
    kpis: input.kpis ?? [],
    refresh_cadence: input.refreshCadence ?? "weekly",
});

export const buildChurnPredictionPayload = (organizationId: string, input: CreateChurnPredictionInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    prediction_key: input.predictionKey,
    name: input.name,
    churn_probability: input.churnProbability ?? 0,
    risk_signals: input.riskSignals ?? [],
    retention_actions: input.retentionActions ?? [],
});

export const buildLifecycleManagementPayload = (organizationId: string, input: CreateLifecycleManagementInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    lifecycle_key: input.lifecycleKey,
    name: input.name,
    current_stage: input.currentStage ?? "onboarding",
    stage_history: input.stageHistory ?? [],
    next_actions: input.nextActions ?? [],
});

export const buildExecutiveSummaryPayload = (organizationId: string, input: CreateExecutiveSummaryInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    summary_key: input.summaryKey,
    title: input.title,
    summary_content: input.summaryContent ?? "",
    key_metrics: input.keyMetrics ?? [],
});

export const buildCsAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});
