import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaBrd,
    DbBaEngagement,
    DbBaFrsDocument,
    DbClient,
    DbDfEngagement,
    DbDfWorkPackage,
    DbProject,
    DbQaAccessibilityValidation,
    DbQaApiValidation,
    DbQaAuditLog,
    DbQaBugTriage,
    DbQaCoverageAnalytics,
    DbQaDatabaseValidation,
    DbQaDefectAnalysis,
    DbQaEngagement,
    DbQaE2eTestPlan,
    DbQaIntegrationTestPlan,
    DbQaPerformanceValidation,
    DbQaQualityScore,
    DbQaRegressionAnalysis,
    DbQaReleaseReadiness,
    DbQaRiskBasedTest,
    DbQaSecurityValidation,
    DbQaTestStrategy,
    DbQaUiValidation,
    DbQaUnitTestPlan,
    DbSaEngagement,
    DbSaSolutionArchitecture,
} from "@/src/modules/database/types/platform";
import type {
    AccessibilityValidationSummary,
    ApiValidationSummary,
    AuditEntry,
    BugTriageSummary,
    CoverageAnalyticsSummary,
    CreateAccessibilityValidationInput,
    CreateApiValidationInput,
    CreateBugTriageInput,
    CreateCoverageAnalyticsInput,
    CreateDatabaseValidationInput,
    CreateDefectAnalysisInput,
    CreateE2eTestPlanInput,
    CreateEngagementInput,
    CreateIntegrationTestPlanInput,
    CreatePerformanceValidationInput,
    CreateQualityScoreInput,
    CreateRegressionAnalysisInput,
    CreateReleaseReadinessInput,
    CreateRiskBasedTestInput,
    CreateSecurityValidationInput,
    CreateTestStrategyInput,
    CreateUiValidationInput,
    CreateUnitTestPlanInput,
    DatabaseValidationSummary,
    DefectAnalysisSummary,
    E2eTestPlanSummary,
    EngagementSummary,
    IntegrationTestPlanSummary,
    PerformanceValidationSummary,
    QaDashboardStats,
    QaPipelineInfo,
    QualityScoreSummary,
    RegressionAnalysisSummary,
    ReleaseReadinessSummary,
    RiskBasedTestSummary,
    SecurityValidationSummary,
    TestStrategySummary,
    UiValidationSummary,
    UnitTestPlanSummary,
} from "@/src/modules/qa-engineer/types";

type LookupMaps = {
    engagements: Map<string, DbQaEngagement>;
    baEngagements: Map<string, DbBaEngagement>;
    saEngagements: Map<string, DbSaEngagement>;
    dfEngagements: Map<string, DbDfEngagement>;
    solutionArchitectures: Map<string, DbSaSolutionArchitecture>;
    workPackages: Map<string, DbDfWorkPackage>;
    brds: Map<string, DbBaBrd>;
    frsDocuments: Map<string, DbBaFrsDocument>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
};

export const buildLookupMaps = (
    engagements: DbQaEngagement[],
    baEngagements: DbBaEngagement[],
    saEngagements: DbSaEngagement[],
    dfEngagements: DbDfEngagement[],
    solutionArchitectures: DbSaSolutionArchitecture[],
    workPackages: DbDfWorkPackage[],
    brds: DbBaBrd[],
    frsDocuments: DbBaFrsDocument[],
    clients: DbClient[],
    projects: DbProject[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
): LookupMaps => ({
    engagements: new Map(engagements.map((item) => [item.id, item])),
    baEngagements: new Map(baEngagements.map((item) => [item.id, item])),
    saEngagements: new Map(saEngagements.map((item) => [item.id, item])),
    dfEngagements: new Map(dfEngagements.map((item) => [item.id, item])),
    solutionArchitectures: new Map(solutionArchitectures.map((item) => [item.id, item])),
    workPackages: new Map(workPackages.map((item) => [item.id, item])),
    brds: new Map(brds.map((item) => [item.id, item])),
    frsDocuments: new Map(frsDocuments.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
});

const engagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.engagements.get(id)?.title ?? null : null);
const baEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.baEngagements.get(id)?.title ?? null : null);
const saEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.saEngagements.get(id)?.title ?? null : null);
const dfEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.dfEngagements.get(id)?.title ?? null : null);
const solutionArchitectureTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.solutionArchitectures.get(id)?.title ?? null : null);
const workPackageTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.workPackages.get(id)?.title ?? null : null);
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);
const brdTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.brds.get(id)?.title ?? null : null);

export const mapEngagementSummary = (record: DbQaEngagement, maps: LookupMaps): EngagementSummary => ({
    id: record.id,
    title: record.title,
    engagementKey: record.engagement_key,
    baEngagementTitle: baEngagementTitle(maps, record.ba_engagement_id),
    saEngagementTitle: saEngagementTitle(maps, record.sa_engagement_id),
    dfEngagementTitle: dfEngagementTitle(maps, record.df_engagement_id),
    solutionArchitectureTitle: solutionArchitectureTitle(maps, record.solution_architecture_id),
    workPackageTitle: workPackageTitle(maps, record.work_package_id),
    brdTitle: brdTitle(maps, record.brd_id),
    clientName: clientName(maps, record.client_id),
    projectName: projectName(maps, record.project_id),
    agentName: agentName(maps, record.agent_id),
    pipelineStage: record.pipeline_stage,
    status: record.status,
    summaryPreview: record.summary.slice(0, 100),
    updatedAt: record.updated_at,
});

export const mapTestStrategySummary = (record: DbQaTestStrategy, maps: LookupMaps): TestStrategySummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    strategyKey: record.strategy_key,
    title: record.title,
    scopePreview: record.scope.slice(0, 80),
    testLevelCount: Array.isArray(record.test_levels) ? record.test_levels.length : 0,
    status: record.status,
});

export const mapUnitTestPlanSummary = (record: DbQaUnitTestPlan, maps: LookupMaps): UnitTestPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    targetModules: record.target_modules,
    testCaseCount: Array.isArray(record.test_cases) ? record.test_cases.length : 0,
    status: record.status,
});

export const mapIntegrationTestPlanSummary = (record: DbQaIntegrationTestPlan, maps: LookupMaps): IntegrationTestPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    integrationPointCount: Array.isArray(record.integration_points) ? record.integration_points.length : 0,
    scenarioCount: Array.isArray(record.test_scenarios) ? record.test_scenarios.length : 0,
    status: record.status,
});

export const mapE2eTestPlanSummary = (record: DbQaE2eTestPlan, maps: LookupMaps): E2eTestPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    journeyCount: Array.isArray(record.user_journeys) ? record.user_journeys.length : 0,
    scenarioCount: Array.isArray(record.test_scenarios) ? record.test_scenarios.length : 0,
    status: record.status,
});

export const mapRegressionAnalysisSummary = (record: DbQaRegressionAnalysis, maps: LookupMaps): RegressionAnalysisSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    analysisKey: record.analysis_key,
    name: record.name,
    affectedAreaCount: Array.isArray(record.affected_areas) ? record.affected_areas.length : 0,
    risksPreview: record.regression_risks.slice(0, 80),
    status: record.status,
});

export const mapRiskBasedTestSummary = (record: DbQaRiskBasedTest, maps: LookupMaps): RiskBasedTestSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    testKey: record.test_key,
    name: record.name,
    riskLevel: record.risk_level,
    testPriority: record.test_priority,
    status: record.status,
});

export const mapSecurityValidationSummary = (record: DbQaSecurityValidation, maps: LookupMaps): SecurityValidationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    validationKey: record.validation_key,
    name: record.name,
    checkCount: Array.isArray(record.security_checks) ? record.security_checks.length : 0,
    findingsPreview: record.findings.slice(0, 80),
    status: record.status,
});

export const mapPerformanceValidationSummary = (record: DbQaPerformanceValidation, maps: LookupMaps): PerformanceValidationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    validationKey: record.validation_key,
    name: record.name,
    targetCount: Array.isArray(record.performance_targets) ? record.performance_targets.length : 0,
    resultsPreview: record.results.slice(0, 80),
    status: record.status,
});

export const mapAccessibilityValidationSummary = (record: DbQaAccessibilityValidation, maps: LookupMaps): AccessibilityValidationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    validationKey: record.validation_key,
    name: record.name,
    wcagLevel: record.wcag_level,
    checkCount: Array.isArray(record.checks) ? record.checks.length : 0,
    status: record.status,
});

export const mapApiValidationSummary = (record: DbQaApiValidation, maps: LookupMaps): ApiValidationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    validationKey: record.validation_key,
    name: record.name,
    endpointCount: Array.isArray(record.endpoints) ? record.endpoints.length : 0,
    status: record.status,
});

export const mapDatabaseValidationSummary = (record: DbQaDatabaseValidation, maps: LookupMaps): DatabaseValidationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    validationKey: record.validation_key,
    name: record.name,
    schemaCheckCount: Array.isArray(record.schema_checks) ? record.schema_checks.length : 0,
    integrityCheckCount: Array.isArray(record.data_integrity_checks) ? record.data_integrity_checks.length : 0,
    status: record.status,
});

export const mapUiValidationSummary = (record: DbQaUiValidation, maps: LookupMaps): UiValidationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    validationKey: record.validation_key,
    name: record.name,
    componentCount: Array.isArray(record.ui_components) ? record.ui_components.length : 0,
    status: record.status,
});

export const mapBugTriageSummary = (record: DbQaBugTriage, maps: LookupMaps): BugTriageSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    bugKey: record.bug_key,
    title: record.title,
    severity: record.severity,
    priority: record.priority,
    status: record.status,
});

export const mapDefectAnalysisSummary = (record: DbQaDefectAnalysis, maps: LookupMaps): DefectAnalysisSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    analysisKey: record.analysis_key,
    title: record.title,
    rootCausePreview: record.root_cause.slice(0, 80),
    status: record.status,
});

export const mapCoverageAnalyticsSummary = (record: DbQaCoverageAnalytics, maps: LookupMaps): CoverageAnalyticsSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    analyticsKey: record.analytics_key,
    name: record.name,
    coveragePercent: Number(record.coverage_percent),
    metricCount: Array.isArray(record.coverage_metrics) ? record.coverage_metrics.length : 0,
    gapsPreview: record.gaps.slice(0, 80),
    status: record.status,
});

export const mapReleaseReadinessSummary = (record: DbQaReleaseReadiness, maps: LookupMaps): ReleaseReadinessSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    assessmentKey: record.assessment_key,
    title: record.title,
    criteriaCount: Array.isArray(record.readiness_criteria) ? record.readiness_criteria.length : 0,
    blockerCount: Array.isArray(record.blockers) ? record.blockers.length : 0,
    status: record.status,
});

export const mapQualityScoreSummary = (record: DbQaQualityScore, maps: LookupMaps): QualityScoreSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    scoreKey: record.score_key,
    name: record.name,
    overallScore: Number(record.overall_score),
    dimensionCount: Array.isArray(record.dimension_scores) ? record.dimension_scores.length : 0,
    status: record.status,
});

export const mapAuditEntry = (record: DbQaAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id ?? null,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildQaDashboardStats = (input: {
    engagements: EngagementSummary[];
    testStrategies: TestStrategySummary[];
    unitTestPlans: UnitTestPlanSummary[];
    integrationTestPlans: IntegrationTestPlanSummary[];
    e2eTestPlans: E2eTestPlanSummary[];
    regressionAnalyses: RegressionAnalysisSummary[];
    riskBasedTests: RiskBasedTestSummary[];
    securityValidations: SecurityValidationSummary[];
    performanceValidations: PerformanceValidationSummary[];
    accessibilityValidations: AccessibilityValidationSummary[];
    apiValidations: ApiValidationSummary[];
    databaseValidations: DatabaseValidationSummary[];
    uiValidations: UiValidationSummary[];
    bugTriages: BugTriageSummary[];
    defectAnalyses: DefectAnalysisSummary[];
    coverageAnalytics: CoverageAnalyticsSummary[];
    releaseReadiness: ReleaseReadinessSummary[];
    qualityScores: QualityScoreSummary[];
}): QaDashboardStats => ({
    totalEngagements: input.engagements.length,
    activeEngagements: input.engagements.filter((e) => e.status === "active").length,
    testStrategyCount: input.testStrategies.length,
    unitTestPlanCount: input.unitTestPlans.length,
    integrationTestPlanCount: input.integrationTestPlans.length,
    e2eTestPlanCount: input.e2eTestPlans.length,
    regressionAnalysisCount: input.regressionAnalyses.length,
    riskBasedTestCount: input.riskBasedTests.length,
    securityValidationCount: input.securityValidations.length,
    performanceValidationCount: input.performanceValidations.length,
    accessibilityValidationCount: input.accessibilityValidations.length,
    apiValidationCount: input.apiValidations.length,
    databaseValidationCount: input.databaseValidations.length,
    uiValidationCount: input.uiValidations.length,
    openBugCount: input.bugTriages.filter((b) => b.status === "open").length,
    defectAnalysisCount: input.defectAnalyses.length,
    coverageAnalyticsCount: input.coverageAnalytics.length,
    pendingReleaseReadiness: input.releaseReadiness.filter((r) => r.status === "pending").length,
    qualityScoreCount: input.qualityScores.length,
});

export const buildQaPipelineInfo = (): QaPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "business_analyst", label: "AI Business Analyst" },
        { key: "architecture_design", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa_engineering", label: "AI QA Engineering" },
        { key: "deployment", label: "Deployment" },
    ],
    currentWorker: "AI QA Engineer",
    nextWorker: "Deployment",
    previousWorker: "AI Development Factory",
});

export const buildEngagementPayload = (organizationId: string, input: CreateEngagementInput) => ({
    organization_id: organizationId,
    title: input.title,
    engagement_key: input.engagementKey,
    ba_engagement_id: input.baEngagementId || null,
    sa_engagement_id: input.saEngagementId || null,
    df_engagement_id: input.dfEngagementId || null,
    brd_id: input.brdId || null,
    frs_id: input.frsId || null,
    solution_architecture_id: input.solutionArchitectureId || null,
    work_package_id: input.workPackageId || null,
    client_id: input.clientId || null,
    project_id: input.projectId || null,
    agent_id: input.agentId || null,
    session_id: input.sessionId || null,
    knowledge_context_id: input.knowledgeContextId || null,
    pipeline_stage: input.pipelineStage ?? "qa_engineering",
    summary: input.summary ?? "",
});

export const buildTestStrategyPayload = (organizationId: string, input: CreateTestStrategyInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    strategy_key: input.strategyKey,
    title: input.title,
    scope: input.scope ?? "",
    approach: input.approach ?? "",
    test_levels: input.testLevels ?? [],
});

export const buildUnitTestPlanPayload = (organizationId: string, input: CreateUnitTestPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    target_modules: input.targetModules ?? "",
    test_cases: input.testCases ?? [],
});

export const buildIntegrationTestPlanPayload = (organizationId: string, input: CreateIntegrationTestPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    integration_points: input.integrationPoints ?? [],
    test_scenarios: input.testScenarios ?? [],
});

export const buildE2eTestPlanPayload = (organizationId: string, input: CreateE2eTestPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    user_journeys: input.userJourneys ?? [],
    test_scenarios: input.testScenarios ?? [],
});

export const buildRegressionAnalysisPayload = (organizationId: string, input: CreateRegressionAnalysisInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    analysis_key: input.analysisKey,
    name: input.name,
    affected_areas: input.affectedAreas ?? [],
    regression_risks: input.regressionRisks ?? "",
    recommendations: input.recommendations ?? "",
});

export const buildRiskBasedTestPayload = (organizationId: string, input: CreateRiskBasedTestInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    test_key: input.testKey,
    name: input.name,
    risk_level: input.riskLevel ?? "medium",
    risk_factors: input.riskFactors ?? [],
    test_priority: input.testPriority ?? "medium",
});

export const buildSecurityValidationPayload = (organizationId: string, input: CreateSecurityValidationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    validation_key: input.validationKey,
    name: input.name,
    security_checks: input.securityChecks ?? [],
    findings: input.findings ?? "",
});

export const buildPerformanceValidationPayload = (organizationId: string, input: CreatePerformanceValidationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    validation_key: input.validationKey,
    name: input.name,
    performance_targets: input.performanceTargets ?? [],
    results: input.results ?? "",
});

export const buildAccessibilityValidationPayload = (organizationId: string, input: CreateAccessibilityValidationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    validation_key: input.validationKey,
    name: input.name,
    wcag_level: input.wcagLevel ?? "AA",
    checks: input.checks ?? [],
    findings: input.findings ?? "",
});

export const buildApiValidationPayload = (organizationId: string, input: CreateApiValidationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    validation_key: input.validationKey,
    name: input.name,
    endpoints: input.endpoints ?? [],
    validation_results: input.validationResults ?? "",
});

export const buildDatabaseValidationPayload = (organizationId: string, input: CreateDatabaseValidationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    validation_key: input.validationKey,
    name: input.name,
    schema_checks: input.schemaChecks ?? [],
    data_integrity_checks: input.dataIntegrityChecks ?? [],
});

export const buildUiValidationPayload = (organizationId: string, input: CreateUiValidationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    validation_key: input.validationKey,
    name: input.name,
    ui_components: input.uiComponents ?? [],
    validation_results: input.validationResults ?? "",
});

export const buildBugTriagePayload = (organizationId: string, input: CreateBugTriageInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    bug_key: input.bugKey,
    title: input.title,
    severity: input.severity ?? "medium",
    priority: input.priority ?? "medium",
    triage_notes: input.triageNotes ?? "",
});

export const buildDefectAnalysisPayload = (organizationId: string, input: CreateDefectAnalysisInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    analysis_key: input.analysisKey,
    title: input.title,
    root_cause: input.rootCause ?? "",
    impact_analysis: input.impactAnalysis ?? "",
    remediation: input.remediation ?? "",
});

export const buildCoverageAnalyticsPayload = (organizationId: string, input: CreateCoverageAnalyticsInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    analytics_key: input.analyticsKey,
    name: input.name,
    coverage_metrics: input.coverageMetrics ?? [],
    coverage_percent: input.coveragePercent ?? 0,
    gaps: input.gaps ?? "",
});

export const buildReleaseReadinessPayload = (organizationId: string, input: CreateReleaseReadinessInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    assessment_key: input.assessmentKey,
    title: input.title,
    readiness_criteria: input.readinessCriteria ?? [],
    blockers: input.blockers ?? [],
    recommendation: input.recommendation ?? "",
});

export const buildQualityScorePayload = (organizationId: string, input: CreateQualityScoreInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    score_key: input.scoreKey,
    name: input.name,
    overall_score: input.overallScore ?? 0,
    dimension_scores: input.dimensionScores ?? [],
});

export const buildQaAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});
