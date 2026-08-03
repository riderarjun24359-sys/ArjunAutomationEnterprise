export type QaEngineerTab =
    | "overview"
    | "engagements"
    | "testStrategies"
    | "unitTests"
    | "integrationTests"
    | "e2eTests"
    | "regression"
    | "riskBasedTesting"
    | "security"
    | "performance"
    | "accessibility"
    | "apiValidation"
    | "databaseValidation"
    | "uiValidation"
    | "bugTriage"
    | "defectAnalysis"
    | "coverage"
    | "releaseReadiness"
    | "qualityScores"
    | "audit"
    | "api";

export interface QaDashboardStats {
    totalEngagements: number;
    activeEngagements: number;
    testStrategyCount: number;
    unitTestPlanCount: number;
    integrationTestPlanCount: number;
    e2eTestPlanCount: number;
    regressionAnalysisCount: number;
    riskBasedTestCount: number;
    securityValidationCount: number;
    performanceValidationCount: number;
    accessibilityValidationCount: number;
    apiValidationCount: number;
    databaseValidationCount: number;
    uiValidationCount: number;
    openBugCount: number;
    defectAnalysisCount: number;
    coverageAnalyticsCount: number;
    pendingReleaseReadiness: number;
    qualityScoreCount: number;
}

export interface QaPipelineInfo {
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
    solutionArchitectureTitle?: string | null;
    workPackageTitle?: string | null;
    brdTitle?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface TestStrategySummary {
    id: string;
    engagementTitle: string;
    strategyKey: string;
    title: string;
    scopePreview: string;
    testLevelCount: number;
    status: string;
}

export interface UnitTestPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    targetModules: string;
    testCaseCount: number;
    status: string;
}

export interface IntegrationTestPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    integrationPointCount: number;
    scenarioCount: number;
    status: string;
}

export interface E2eTestPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    journeyCount: number;
    scenarioCount: number;
    status: string;
}

export interface RegressionAnalysisSummary {
    id: string;
    engagementTitle: string;
    analysisKey: string;
    name: string;
    affectedAreaCount: number;
    risksPreview: string;
    status: string;
}

export interface RiskBasedTestSummary {
    id: string;
    engagementTitle: string;
    testKey: string;
    name: string;
    riskLevel: string;
    testPriority: string;
    status: string;
}

export interface SecurityValidationSummary {
    id: string;
    engagementTitle: string;
    validationKey: string;
    name: string;
    checkCount: number;
    findingsPreview: string;
    status: string;
}

export interface PerformanceValidationSummary {
    id: string;
    engagementTitle: string;
    validationKey: string;
    name: string;
    targetCount: number;
    resultsPreview: string;
    status: string;
}

export interface AccessibilityValidationSummary {
    id: string;
    engagementTitle: string;
    validationKey: string;
    name: string;
    wcagLevel: string;
    checkCount: number;
    status: string;
}

export interface ApiValidationSummary {
    id: string;
    engagementTitle: string;
    validationKey: string;
    name: string;
    endpointCount: number;
    status: string;
}

export interface DatabaseValidationSummary {
    id: string;
    engagementTitle: string;
    validationKey: string;
    name: string;
    schemaCheckCount: number;
    integrityCheckCount: number;
    status: string;
}

export interface UiValidationSummary {
    id: string;
    engagementTitle: string;
    validationKey: string;
    name: string;
    componentCount: number;
    status: string;
}

export interface BugTriageSummary {
    id: string;
    engagementTitle: string;
    bugKey: string;
    title: string;
    severity: string;
    priority: string;
    status: string;
}

export interface DefectAnalysisSummary {
    id: string;
    engagementTitle: string;
    analysisKey: string;
    title: string;
    rootCausePreview: string;
    status: string;
}

export interface CoverageAnalyticsSummary {
    id: string;
    engagementTitle: string;
    analyticsKey: string;
    name: string;
    coveragePercent: number;
    metricCount: number;
    gapsPreview: string;
    status: string;
}

export interface ReleaseReadinessSummary {
    id: string;
    engagementTitle: string;
    assessmentKey: string;
    title: string;
    criteriaCount: number;
    blockerCount: number;
    status: string;
}

export interface QualityScoreSummary {
    id: string;
    engagementTitle: string;
    scoreKey: string;
    name: string;
    overallScore: number;
    dimensionCount: number;
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
    brdId?: string;
    frsId?: string;
    solutionArchitectureId?: string;
    workPackageId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
    knowledgeContextId?: string;
    pipelineStage?: string;
    summary?: string;
}

export interface CreateTestStrategyInput {
    engagementId: string;
    strategyKey: string;
    title: string;
    scope?: string;
    approach?: string;
    testLevels?: unknown[];
}

export interface CreateUnitTestPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    targetModules?: string;
    testCases?: unknown[];
}

export interface CreateIntegrationTestPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    integrationPoints?: unknown[];
    testScenarios?: unknown[];
}

export interface CreateE2eTestPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    userJourneys?: unknown[];
    testScenarios?: unknown[];
}

export interface CreateRegressionAnalysisInput {
    engagementId: string;
    analysisKey: string;
    name: string;
    affectedAreas?: unknown[];
    regressionRisks?: string;
    recommendations?: string;
}

export interface CreateRiskBasedTestInput {
    engagementId: string;
    testKey: string;
    name: string;
    riskLevel?: string;
    riskFactors?: unknown[];
    testPriority?: string;
}

export interface CreateSecurityValidationInput {
    engagementId: string;
    validationKey: string;
    name: string;
    securityChecks?: unknown[];
    findings?: string;
}

export interface CreatePerformanceValidationInput {
    engagementId: string;
    validationKey: string;
    name: string;
    performanceTargets?: unknown[];
    results?: string;
}

export interface CreateAccessibilityValidationInput {
    engagementId: string;
    validationKey: string;
    name: string;
    wcagLevel?: string;
    checks?: unknown[];
    findings?: string;
}

export interface CreateApiValidationInput {
    engagementId: string;
    validationKey: string;
    name: string;
    endpoints?: unknown[];
    validationResults?: string;
}

export interface CreateDatabaseValidationInput {
    engagementId: string;
    validationKey: string;
    name: string;
    schemaChecks?: unknown[];
    dataIntegrityChecks?: unknown[];
}

export interface CreateUiValidationInput {
    engagementId: string;
    validationKey: string;
    name: string;
    uiComponents?: unknown[];
    validationResults?: string;
}

export interface CreateBugTriageInput {
    engagementId: string;
    bugKey: string;
    title: string;
    severity?: string;
    priority?: string;
    triageNotes?: string;
}

export interface CreateDefectAnalysisInput {
    engagementId: string;
    analysisKey: string;
    title: string;
    rootCause?: string;
    impactAnalysis?: string;
    remediation?: string;
}

export interface CreateCoverageAnalyticsInput {
    engagementId: string;
    analyticsKey: string;
    name: string;
    coverageMetrics?: unknown[];
    coveragePercent?: number;
    gaps?: string;
}

export interface CreateReleaseReadinessInput {
    engagementId: string;
    assessmentKey: string;
    title: string;
    readinessCriteria?: unknown[];
    blockers?: unknown[];
    recommendation?: string;
}

export interface CreateQualityScoreInput {
    engagementId: string;
    scoreKey: string;
    name: string;
    overallScore?: number;
    dimensionScores?: unknown[];
}

export interface QaSdkStartEngagementInput {
    title: string;
    engagementKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    solutionArchitectureId?: string;
    workPackageId?: string;
    brdId?: string;
    frsId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
}

export interface QaSdkStartEngagementResult {
    engagementId: string;
    engagementKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface QaSdkGenerateArtifactInput {
    engagementId: string;
    artifactType: "test_strategy" | "unit_test_plan" | "e2e_test_plan" | "release_readiness";
    title: string;
    content: string;
}

export interface QaSdkGenerateArtifactResult {
    artifactId: string;
    artifactType: string;
    status: string;
}

export interface QaSdkRunAnalysisInput {
    engagementId: string;
    analysisType: "regression" | "defect" | "coverage";
    inputPayload: Record<string, unknown>;
}

export interface QaSdkRunAnalysisResult {
    analysisId: string;
    analysisType: string;
    status: string;
}
