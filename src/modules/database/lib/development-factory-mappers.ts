import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaBrd,
    DbBaEngagement,
    DbBaFrsDocument,
    DbClient,
    DbDfApiScaffold,
    DbDfAuditLog,
    DbDfBackendWorkflow,
    DbDfBuildArtifact,
    DbDfCodeReview,
    DbDfCodingStandard,
    DbDfComponent,
    DbDfEngagement,
    DbDfFrontendWorkflow,
    DbDfMigrationPlan,
    DbDfModuleRecommendation,
    DbDfProgressTracking,
    DbDfPullRequest,
    DbDfRepositoryStructure,
    DbDfSecureCodingValidation,
    DbDfTechnicalDoc,
    DbDfTestScaffold,
    DbDfVersion,
    DbDfWorkPackage,
    DbEmployee,
    DbProject,
    DbSaEngagement,
    DbSaSolutionArchitecture,
} from "@/src/modules/database/types/platform";
import type {
    ApiScaffoldSummary,
    AuditEntry,
    BackendWorkflowSummary,
    BuildArtifactSummary,
    CodeReviewSummary,
    CodingStandardSummary,
    ComponentSummary,
    CreateApiScaffoldInput,
    CreateBackendWorkflowInput,
    CreateBuildArtifactInput,
    CreateCodeReviewInput,
    CreateCodingStandardInput,
    CreateComponentInput,
    CreateEngagementInput,
    CreateFrontendWorkflowInput,
    CreateMigrationPlanInput,
    CreateModuleRecommendationInput,
    CreateProgressTrackingInput,
    CreatePullRequestInput,
    CreateRepositoryStructureInput,
    CreateSecureCodingValidationInput,
    CreateTechnicalDocInput,
    CreateTestScaffoldInput,
    CreateVersionInput,
    CreateWorkPackageInput,
    DfDashboardStats,
    DfPipelineInfo,
    EngagementSummary,
    FrontendWorkflowSummary,
    MigrationPlanSummary,
    ModuleRecommendationSummary,
    ProgressTrackingSummary,
    PullRequestSummary,
    RepositoryStructureSummary,
    SecureCodingValidationSummary,
    TechnicalDocSummary,
    TestScaffoldSummary,
    VersionSummary,
    WorkPackageSummary,
} from "@/src/modules/development-factory/types";

type LookupMaps = {
    engagements: Map<string, DbDfEngagement>;
    baEngagements: Map<string, DbBaEngagement>;
    saEngagements: Map<string, DbSaEngagement>;
    solutionArchitectures: Map<string, DbSaSolutionArchitecture>;
    brds: Map<string, DbBaBrd>;
    frsDocuments: Map<string, DbBaFrsDocument>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
    employees: Map<string, DbEmployee>;
};

export const buildLookupMaps = (
    engagements: DbDfEngagement[],
    baEngagements: DbBaEngagement[],
    saEngagements: DbSaEngagement[],
    solutionArchitectures: DbSaSolutionArchitecture[],
    brds: DbBaBrd[],
    frsDocuments: DbBaFrsDocument[],
    clients: DbClient[],
    projects: DbProject[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
    employees: DbEmployee[],
): LookupMaps => ({
    engagements: new Map(engagements.map((item) => [item.id, item])),
    baEngagements: new Map(baEngagements.map((item) => [item.id, item])),
    saEngagements: new Map(saEngagements.map((item) => [item.id, item])),
    solutionArchitectures: new Map(solutionArchitectures.map((item) => [item.id, item])),
    brds: new Map(brds.map((item) => [item.id, item])),
    frsDocuments: new Map(frsDocuments.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
});

const engagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.engagements.get(id)?.title ?? null : null);
const baEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.baEngagements.get(id)?.title ?? null : null);
const saEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.saEngagements.get(id)?.title ?? null : null);
const solutionArchitectureTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.solutionArchitectures.get(id)?.title ?? null : null);
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);
const brdTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.brds.get(id)?.title ?? null : null);
const employeeName = (maps: LookupMaps, id?: string | null) => {
    if (!id) return null;
    const employee = maps.employees.get(id);
    return employee ? `${employee.first_name} ${employee.last_name}` : null;
};

export const mapEngagementSummary = (record: DbDfEngagement, maps: LookupMaps): EngagementSummary => ({
    id: record.id,
    title: record.title,
    engagementKey: record.engagement_key,
    baEngagementTitle: baEngagementTitle(maps, record.ba_engagement_id),
    saEngagementTitle: saEngagementTitle(maps, record.sa_engagement_id),
    solutionArchitectureTitle: solutionArchitectureTitle(maps, record.solution_architecture_id),
    brdTitle: brdTitle(maps, record.brd_id),
    clientName: clientName(maps, record.client_id),
    projectName: projectName(maps, record.project_id),
    agentName: agentName(maps, record.agent_id),
    pipelineStage: record.pipeline_stage,
    status: record.status,
    summaryPreview: record.summary.slice(0, 100),
    updatedAt: record.updated_at,
});

export const mapWorkPackageSummary = (record: DbDfWorkPackage, maps: LookupMaps): WorkPackageSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    packageKey: record.package_key,
    title: record.title,
    deliverableCount: Array.isArray(record.deliverables) ? record.deliverables.length : 0,
    status: record.status,
    descriptionPreview: record.description.slice(0, 80),
});

export const mapBackendWorkflowSummary = (record: DbDfBackendWorkflow, maps: LookupMaps): BackendWorkflowSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    workflowKey: record.workflow_key,
    name: record.name,
    stepCount: Array.isArray(record.steps) ? record.steps.length : 0,
    targetModules: record.target_modules,
    status: record.status,
});

export const mapFrontendWorkflowSummary = (record: DbDfFrontendWorkflow, maps: LookupMaps): FrontendWorkflowSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    workflowKey: record.workflow_key,
    name: record.name,
    stepCount: Array.isArray(record.steps) ? record.steps.length : 0,
    targetModules: record.target_modules,
    status: record.status,
});

export const mapApiScaffoldSummary = (record: DbDfApiScaffold, maps: LookupMaps): ApiScaffoldSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    scaffoldKey: record.scaffold_key,
    name: record.name,
    endpointCount: Array.isArray(record.endpoints) ? record.endpoints.length : 0,
    status: record.status,
});

export const mapMigrationPlanSummary = (record: DbDfMigrationPlan, maps: LookupMaps): MigrationPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    migrationCount: Array.isArray(record.migrations) ? record.migrations.length : 0,
    status: record.status,
});

export const mapRepositoryStructureSummary = (record: DbDfRepositoryStructure, maps: LookupMaps): RepositoryStructureSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    repoKey: record.repo_key,
    name: record.name,
    repoType: record.repo_type,
    structureCount: Array.isArray(record.structure) ? record.structure.length : 0,
    status: record.status,
});

export const mapComponentSummary = (record: DbDfComponent, maps: LookupMaps): ComponentSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    componentKey: record.component_key,
    name: record.name,
    componentType: record.component_type,
    status: record.status,
    specificationPreview: record.specification.slice(0, 80),
});

export const mapTestScaffoldSummary = (record: DbDfTestScaffold, maps: LookupMaps): TestScaffoldSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    scaffoldKey: record.scaffold_key,
    name: record.name,
    testType: record.test_type,
    testCaseCount: Array.isArray(record.test_cases) ? record.test_cases.length : 0,
    status: record.status,
});

export const mapCodingStandardSummary = (record: DbDfCodingStandard, maps: LookupMaps): CodingStandardSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    standardKey: record.standard_key,
    name: record.name,
    ruleCount: Array.isArray(record.rules) ? record.rules.length : 0,
    enforcementLevel: record.enforcement_level,
    status: record.status,
});

export const mapSecureCodingValidationSummary = (record: DbDfSecureCodingValidation, maps: LookupMaps): SecureCodingValidationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    validationKey: record.validation_key,
    name: record.name,
    checkCount: Array.isArray(record.checks) ? record.checks.length : 0,
    findingsPreview: record.findings.slice(0, 80),
    status: record.status,
});

export const mapModuleRecommendationSummary = (record: DbDfModuleRecommendation, maps: LookupMaps): ModuleRecommendationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    recommendationKey: record.recommendation_key,
    moduleName: record.module_name,
    platformModule: record.platform_module,
    status: record.status,
    rationalePreview: record.rationale.slice(0, 80),
});

export const mapPullRequestSummary = (record: DbDfPullRequest, maps: LookupMaps): PullRequestSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    prKey: record.pr_key,
    title: record.title,
    changedFileCount: Array.isArray(record.changed_files) ? record.changed_files.length : 0,
    status: record.status,
});

export const mapCodeReviewSummary = (record: DbDfCodeReview, maps: LookupMaps): CodeReviewSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    reviewKey: record.review_key,
    title: record.title,
    reviewerName: employeeName(maps, record.reviewer_id),
    reviewStatus: record.review_status,
    checklistCount: Array.isArray(record.checklist) ? record.checklist.length : 0,
});

export const mapTechnicalDocSummary = (record: DbDfTechnicalDoc, maps: LookupMaps): TechnicalDocSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    docKey: record.doc_key,
    title: record.title,
    docType: record.doc_type,
    status: record.status,
    contentPreview: record.content.slice(0, 80),
});

export const mapProgressTrackingSummary = (record: DbDfProgressTracking, maps: LookupMaps): ProgressTrackingSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    trackingKey: record.tracking_key,
    milestone: record.milestone,
    progressPercent: record.progress_percent,
    status: record.status,
});

export const mapBuildArtifactSummary = (record: DbDfBuildArtifact, maps: LookupMaps): BuildArtifactSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    artifactKey: record.artifact_key,
    name: record.name,
    artifactType: record.artifact_type,
    artifactPath: record.artifact_path,
    status: record.status,
});

export const mapVersionSummary = (record: DbDfVersion, maps: LookupMaps): VersionSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    entityType: record.entity_type,
    versionNumber: record.version_number,
    changeSummary: record.change_summary,
    createdAt: record.created_at,
});

export const mapAuditEntry = (record: DbDfAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id ?? null,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildDfDashboardStats = (input: {
    engagements: EngagementSummary[];
    workPackages: WorkPackageSummary[];
    backendWorkflows: BackendWorkflowSummary[];
    frontendWorkflows: FrontendWorkflowSummary[];
    apiScaffolds: ApiScaffoldSummary[];
    migrationPlans: MigrationPlanSummary[];
    repositoryStructures: RepositoryStructureSummary[];
    components: ComponentSummary[];
    testScaffolds: TestScaffoldSummary[];
    codingStandards: CodingStandardSummary[];
    secureCodingValidations: SecureCodingValidationSummary[];
    moduleRecommendations: ModuleRecommendationSummary[];
    pullRequests: PullRequestSummary[];
    codeReviews: CodeReviewSummary[];
    technicalDocs: TechnicalDocSummary[];
    progressTracking: ProgressTrackingSummary[];
    buildArtifacts: BuildArtifactSummary[];
    versions: VersionSummary[];
}): DfDashboardStats => ({
    totalEngagements: input.engagements.length,
    activeEngagements: input.engagements.filter((e) => e.status === "active").length,
    workPackageCount: input.workPackages.length,
    workflowCount: input.backendWorkflows.length + input.frontendWorkflows.length,
    apiScaffoldCount: input.apiScaffolds.length,
    migrationPlanCount: input.migrationPlans.length,
    repositoryCount: input.repositoryStructures.length,
    componentCount: input.components.length,
    testScaffoldCount: input.testScaffolds.length,
    codingStandardCount: input.codingStandards.length,
    secureCodingCount: input.secureCodingValidations.length,
    moduleRecommendationCount: input.moduleRecommendations.length,
    pullRequestCount: input.pullRequests.length,
    pendingCodeReviews: input.codeReviews.filter((r) => r.reviewStatus === "pending").length,
    technicalDocCount: input.technicalDocs.length,
    buildArtifactCount: input.buildArtifacts.length,
    versionCount: input.versions.length,
});

export const buildDfPipelineInfo = (): DfPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "business_analyst", label: "AI Business Analyst" },
        { key: "architecture_design", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa", label: "AI QA" },
        { key: "deployment", label: "Deployment" },
    ],
    currentWorker: "AI Development Factory",
    nextWorker: "AI QA",
    previousWorker: "AI Solution Architect",
});

export const buildEngagementPayload = (organizationId: string, input: CreateEngagementInput) => ({
    organization_id: organizationId,
    title: input.title,
    engagement_key: input.engagementKey,
    ba_engagement_id: input.baEngagementId || null,
    sa_engagement_id: input.saEngagementId || null,
    brd_id: input.brdId || null,
    frs_id: input.frsId || null,
    solution_architecture_id: input.solutionArchitectureId || null,
    client_id: input.clientId || null,
    project_id: input.projectId || null,
    agent_id: input.agentId || null,
    session_id: input.sessionId || null,
    knowledge_context_id: input.knowledgeContextId || null,
    pipeline_stage: input.pipelineStage ?? "development_factory",
    summary: input.summary ?? "",
});

export const buildWorkPackagePayload = (organizationId: string, input: CreateWorkPackageInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    package_key: input.packageKey,
    title: input.title,
    description: input.description ?? "",
    deliverables: input.deliverables ?? [],
});

export const buildBackendWorkflowPayload = (organizationId: string, input: CreateBackendWorkflowInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    workflow_key: input.workflowKey,
    name: input.name,
    steps: input.steps ?? [],
    target_modules: input.targetModules ?? "",
});

export const buildFrontendWorkflowPayload = (organizationId: string, input: CreateFrontendWorkflowInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    workflow_key: input.workflowKey,
    name: input.name,
    steps: input.steps ?? [],
    target_modules: input.targetModules ?? "",
});

export const buildApiScaffoldPayload = (organizationId: string, input: CreateApiScaffoldInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    scaffold_key: input.scaffoldKey,
    name: input.name,
    endpoints: input.endpoints ?? [],
    scaffold_spec: input.scaffoldSpec ?? "",
});

export const buildMigrationPlanPayload = (organizationId: string, input: CreateMigrationPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    migrations: input.migrations ?? [],
    rollback_notes: input.rollbackNotes ?? "",
});

export const buildRepositoryStructurePayload = (organizationId: string, input: CreateRepositoryStructureInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    repo_key: input.repoKey,
    name: input.name,
    repo_type: input.repoType ?? "service",
    structure: input.structure ?? [],
});

export const buildComponentPayload = (organizationId: string, input: CreateComponentInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    component_key: input.componentKey,
    name: input.name,
    component_type: input.componentType ?? "ui",
    specification: input.specification ?? "",
});

export const buildTestScaffoldPayload = (organizationId: string, input: CreateTestScaffoldInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    scaffold_key: input.scaffoldKey,
    name: input.name,
    test_type: input.testType ?? "unit",
    test_cases: input.testCases ?? [],
});

export const buildCodingStandardPayload = (organizationId: string, input: CreateCodingStandardInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    standard_key: input.standardKey,
    name: input.name,
    rules: input.rules ?? [],
    enforcement_level: input.enforcementLevel ?? "required",
});

export const buildSecureCodingValidationPayload = (organizationId: string, input: CreateSecureCodingValidationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    validation_key: input.validationKey,
    name: input.name,
    checks: input.checks ?? [],
    findings: input.findings ?? "",
});

export const buildModuleRecommendationPayload = (organizationId: string, input: CreateModuleRecommendationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    recommendation_key: input.recommendationKey,
    module_name: input.moduleName,
    platform_module: input.platformModule ?? "",
    rationale: input.rationale ?? "",
});

export const buildPullRequestPayload = (organizationId: string, input: CreatePullRequestInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    pr_key: input.prKey,
    title: input.title,
    description: input.description ?? "",
    changed_files: input.changedFiles ?? [],
});

export const buildCodeReviewPayload = (organizationId: string, input: CreateCodeReviewInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    review_key: input.reviewKey,
    title: input.title,
    checklist: input.checklist ?? [],
    reviewer_id: input.reviewerId || null,
    review_status: input.reviewStatus ?? "pending",
    comments: input.comments ?? "",
});

export const buildTechnicalDocPayload = (organizationId: string, input: CreateTechnicalDocInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    doc_key: input.docKey,
    title: input.title,
    doc_type: input.docType ?? "technical",
    content: input.content ?? "",
});

export const buildProgressTrackingPayload = (organizationId: string, input: CreateProgressTrackingInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    tracking_key: input.trackingKey,
    milestone: input.milestone,
    progress_percent: input.progressPercent ?? 0,
    notes: input.notes ?? "",
});

export const buildBuildArtifactPayload = (organizationId: string, input: CreateBuildArtifactInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    artifact_key: input.artifactKey,
    name: input.name,
    artifact_type: input.artifactType ?? "build",
    artifact_path: input.artifactPath ?? "",
    metadata: input.metadata ?? {},
});

export const buildVersionPayload = (organizationId: string, input: CreateVersionInput, versionNumber: number) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    entity_type: input.entityType,
    entity_id: input.entityId,
    version_number: versionNumber,
    content: input.content,
    change_summary: input.changeSummary,
});

export const buildDfAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});
