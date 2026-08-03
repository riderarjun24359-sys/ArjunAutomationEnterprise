export type DevelopmentFactoryTab =
    | "overview"
    | "engagements"
    | "workPackages"
    | "backendWorkflows"
    | "frontendWorkflows"
    | "apiScaffolds"
    | "migrationPlans"
    | "repositories"
    | "components"
    | "testScaffolds"
    | "codingStandards"
    | "secureCoding"
    | "moduleRecommendations"
    | "pullRequests"
    | "codeReviews"
    | "technicalDocs"
    | "progress"
    | "buildArtifacts"
    | "versions"
    | "audit"
    | "api";

export interface DfDashboardStats {
    totalEngagements: number;
    activeEngagements: number;
    workPackageCount: number;
    workflowCount: number;
    apiScaffoldCount: number;
    migrationPlanCount: number;
    repositoryCount: number;
    componentCount: number;
    testScaffoldCount: number;
    codingStandardCount: number;
    secureCodingCount: number;
    moduleRecommendationCount: number;
    pullRequestCount: number;
    pendingCodeReviews: number;
    technicalDocCount: number;
    buildArtifactCount: number;
    versionCount: number;
}

export interface DfPipelineInfo {
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
    solutionArchitectureTitle?: string | null;
    brdTitle?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface WorkPackageSummary {
    id: string;
    engagementTitle: string;
    packageKey: string;
    title: string;
    deliverableCount: number;
    status: string;
    descriptionPreview: string;
}

export interface BackendWorkflowSummary {
    id: string;
    engagementTitle: string;
    workflowKey: string;
    name: string;
    stepCount: number;
    targetModules: string;
    status: string;
}

export interface FrontendWorkflowSummary {
    id: string;
    engagementTitle: string;
    workflowKey: string;
    name: string;
    stepCount: number;
    targetModules: string;
    status: string;
}

export interface ApiScaffoldSummary {
    id: string;
    engagementTitle: string;
    scaffoldKey: string;
    name: string;
    endpointCount: number;
    status: string;
}

export interface MigrationPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    migrationCount: number;
    status: string;
}

export interface RepositoryStructureSummary {
    id: string;
    engagementTitle: string;
    repoKey: string;
    name: string;
    repoType: string;
    structureCount: number;
    status: string;
}

export interface ComponentSummary {
    id: string;
    engagementTitle: string;
    componentKey: string;
    name: string;
    componentType: string;
    status: string;
    specificationPreview: string;
}

export interface TestScaffoldSummary {
    id: string;
    engagementTitle: string;
    scaffoldKey: string;
    name: string;
    testType: string;
    testCaseCount: number;
    status: string;
}

export interface CodingStandardSummary {
    id: string;
    engagementTitle: string;
    standardKey: string;
    name: string;
    ruleCount: number;
    enforcementLevel: string;
    status: string;
}

export interface SecureCodingValidationSummary {
    id: string;
    engagementTitle: string;
    validationKey: string;
    name: string;
    checkCount: number;
    findingsPreview: string;
    status: string;
}

export interface ModuleRecommendationSummary {
    id: string;
    engagementTitle: string;
    recommendationKey: string;
    moduleName: string;
    platformModule: string;
    status: string;
    rationalePreview: string;
}

export interface PullRequestSummary {
    id: string;
    engagementTitle: string;
    prKey: string;
    title: string;
    changedFileCount: number;
    status: string;
}

export interface CodeReviewSummary {
    id: string;
    engagementTitle: string;
    reviewKey: string;
    title: string;
    reviewerName?: string | null;
    reviewStatus: string;
    checklistCount: number;
}

export interface TechnicalDocSummary {
    id: string;
    engagementTitle: string;
    docKey: string;
    title: string;
    docType: string;
    status: string;
    contentPreview: string;
}

export interface ProgressTrackingSummary {
    id: string;
    engagementTitle: string;
    trackingKey: string;
    milestone: string;
    progressPercent: number;
    status: string;
}

export interface BuildArtifactSummary {
    id: string;
    engagementTitle: string;
    artifactKey: string;
    name: string;
    artifactType: string;
    artifactPath: string;
    status: string;
}

export interface VersionSummary {
    id: string;
    engagementTitle: string;
    entityType: string;
    versionNumber: number;
    changeSummary: string;
    createdAt: string;
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
    brdId?: string;
    frsId?: string;
    solutionArchitectureId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
    knowledgeContextId?: string;
    pipelineStage?: string;
    summary?: string;
}

export interface CreateWorkPackageInput {
    engagementId: string;
    packageKey: string;
    title: string;
    description?: string;
    deliverables?: unknown[];
}

export interface CreateBackendWorkflowInput {
    engagementId: string;
    workflowKey: string;
    name: string;
    steps?: unknown[];
    targetModules?: string;
}

export interface CreateFrontendWorkflowInput {
    engagementId: string;
    workflowKey: string;
    name: string;
    steps?: unknown[];
    targetModules?: string;
}

export interface CreateApiScaffoldInput {
    engagementId: string;
    scaffoldKey: string;
    name: string;
    endpoints?: unknown[];
    scaffoldSpec?: string;
}

export interface CreateMigrationPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    migrations?: unknown[];
    rollbackNotes?: string;
}

export interface CreateRepositoryStructureInput {
    engagementId: string;
    repoKey: string;
    name: string;
    repoType?: string;
    structure?: unknown[];
}

export interface CreateComponentInput {
    engagementId: string;
    componentKey: string;
    name: string;
    componentType?: string;
    specification?: string;
}

export interface CreateTestScaffoldInput {
    engagementId: string;
    scaffoldKey: string;
    name: string;
    testType?: string;
    testCases?: unknown[];
}

export interface CreateCodingStandardInput {
    engagementId: string;
    standardKey: string;
    name: string;
    rules?: unknown[];
    enforcementLevel?: string;
}

export interface CreateSecureCodingValidationInput {
    engagementId: string;
    validationKey: string;
    name: string;
    checks?: unknown[];
    findings?: string;
}

export interface CreateModuleRecommendationInput {
    engagementId: string;
    recommendationKey: string;
    moduleName: string;
    platformModule?: string;
    rationale?: string;
}

export interface CreatePullRequestInput {
    engagementId: string;
    prKey: string;
    title: string;
    description?: string;
    changedFiles?: unknown[];
}

export interface CreateCodeReviewInput {
    engagementId: string;
    reviewKey: string;
    title: string;
    checklist?: unknown[];
    reviewerId?: string;
    reviewStatus?: string;
    comments?: string;
}

export interface CreateTechnicalDocInput {
    engagementId: string;
    docKey: string;
    title: string;
    docType?: string;
    content?: string;
}

export interface CreateProgressTrackingInput {
    engagementId: string;
    trackingKey: string;
    milestone: string;
    progressPercent?: number;
    notes?: string;
}

export interface CreateBuildArtifactInput {
    engagementId: string;
    artifactKey: string;
    name: string;
    artifactType?: string;
    artifactPath?: string;
    metadata?: Record<string, unknown>;
}

export interface CreateVersionInput {
    engagementId: string;
    entityType: string;
    entityId: string;
    content: string;
    changeSummary: string;
}

export interface DfSdkStartEngagementInput {
    title: string;
    engagementKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    solutionArchitectureId?: string;
    brdId?: string;
    frsId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
}

export interface DfSdkStartEngagementResult {
    engagementId: string;
    engagementKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface DfSdkGenerateArtifactInput {
    engagementId: string;
    artifactType: "work_package" | "api_scaffold" | "component" | "technical_doc";
    title: string;
    content: string;
}

export interface DfSdkGenerateArtifactResult {
    artifactId: string;
    artifactType: string;
    status: string;
}

export interface DfSdkRunAnalysisInput {
    engagementId: string;
    analysisType: "secure_coding" | "coding_standards" | "module_recommendation";
    inputPayload: Record<string, unknown>;
}

export interface DfSdkRunAnalysisResult {
    analysisId: string;
    analysisType: string;
    status: string;
}
