import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaBrd,
    DbBaEngagement,
    DbBaFrsDocument,
    DbClient,
    DbEmployee,
    DbProject,
    DbSaApiContract,
    DbSaArchitectureReview,
    DbSaArchitectureVersion,
    DbSaAuditLog,
    DbSaBuildReuseRecommendation,
    DbSaDatabaseSchema,
    DbSaDependencyAnalysis,
    DbSaDeploymentArchitecture,
    DbSaDomainModel,
    DbSaEngagement,
    DbSaIntegrationPlan,
    DbSaModuleSelection,
    DbSaPerformancePlan,
    DbSaScalabilityPlan,
    DbSaSecurityArchitecture,
    DbSaSolutionArchitecture,
    DbSaSprintPlan,
    DbSaSystemDecomposition,
    DbSaTechnologyDecision,
} from "@/src/modules/database/types/platform";
import type {
    ApiContractSummary,
    ArchitectureReviewSummary,
    AuditEntry,
    BuildReuseSummary,
    CreateApiContractInput,
    CreateArchitectureReviewInput,
    CreateBuildReuseInput,
    CreateDatabaseSchemaInput,
    CreateDependencyAnalysisInput,
    CreateDeploymentArchitectureInput,
    CreateDomainModelInput,
    CreateEngagementInput,
    CreateIntegrationPlanInput,
    CreateModuleSelectionInput,
    CreatePerformancePlanInput,
    CreateScalabilityPlanInput,
    CreateSecurityArchitectureInput,
    CreateSolutionArchitectureInput,
    CreateSprintPlanInput,
    CreateSystemDecompositionInput,
    CreateTechnologyDecisionInput,
    CreateVersionInput,
    DatabaseSchemaSummary,
    DependencyAnalysisSummary,
    DeploymentArchitectureSummary,
    DomainModelSummary,
    EngagementSummary,
    IntegrationPlanSummary,
    ModuleSelectionSummary,
    PerformancePlanSummary,
    SaDashboardStats,
    SaPipelineInfo,
    ScalabilityPlanSummary,
    SecurityArchitectureSummary,
    SolutionArchitectureSummary,
    SprintPlanSummary,
    SystemDecompositionSummary,
    TechnologyDecisionSummary,
    VersionSummary,
} from "@/src/modules/solution-architect/types";

type LookupMaps = {
    engagements: Map<string, DbSaEngagement>;
    baEngagements: Map<string, DbBaEngagement>;
    brds: Map<string, DbBaBrd>;
    frsDocuments: Map<string, DbBaFrsDocument>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
    employees: Map<string, DbEmployee>;
};

export const buildLookupMaps = (
    engagements: DbSaEngagement[],
    baEngagements: DbBaEngagement[],
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
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);
const brdTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.brds.get(id)?.title ?? null : null);
const employeeName = (maps: LookupMaps, id?: string | null) => {
    if (!id) return null;
    const employee = maps.employees.get(id);
    return employee ? `${employee.first_name} ${employee.last_name}` : null;
};

export const mapEngagementSummary = (record: DbSaEngagement, maps: LookupMaps): EngagementSummary => ({
    id: record.id, title: record.title, engagementKey: record.engagement_key, baEngagementTitle: baEngagementTitle(maps, record.ba_engagement_id), brdTitle: brdTitle(maps, record.brd_id), clientName: clientName(maps, record.client_id), projectName: projectName(maps, record.project_id), agentName: agentName(maps, record.agent_id), pipelineStage: record.pipeline_stage, status: record.status, summaryPreview: record.summary.slice(0, 100), updatedAt: record.updated_at,
});

export const mapSolutionArchitectureSummary = (record: DbSaSolutionArchitecture, maps: LookupMaps): SolutionArchitectureSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", title: record.title, architectureType: record.architecture_type, componentCount: Array.isArray(record.components) ? record.components.length : 0, status: record.status, overviewPreview: record.overview.slice(0, 100),
});

export const mapSystemDecompositionSummary = (record: DbSaSystemDecomposition, maps: LookupMaps): SystemDecompositionSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, decompositionKey: record.decomposition_key, layerCount: Array.isArray(record.layers) ? record.layers.length : 0, status: record.status,
});

export const mapDomainModelSummary = (record: DbSaDomainModel, maps: LookupMaps): DomainModelSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, modelKey: record.model_key, entityCount: Array.isArray(record.entities) ? record.entities.length : 0, status: record.status,
});

export const mapDatabaseSchemaSummary = (record: DbSaDatabaseSchema, maps: LookupMaps): DatabaseSchemaSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, schemaKey: record.schema_key, tableCount: Array.isArray(record.tables) ? record.tables.length : 0, status: record.status,
});

export const mapApiContractSummary = (record: DbSaApiContract, maps: LookupMaps): ApiContractSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, contractKey: record.contract_key, endpointCount: Array.isArray(record.endpoints) ? record.endpoints.length : 0, version: record.version, status: record.status,
});

export const mapModuleSelectionSummary = (record: DbSaModuleSelection, maps: LookupMaps): ModuleSelectionSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", moduleName: record.module_name, moduleKey: record.module_key, platformModule: record.platform_module, status: record.status,
});

export const mapBuildReuseSummary = (record: DbSaBuildReuseRecommendation, maps: LookupMaps): BuildReuseSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", itemKey: record.item_key, componentName: record.component_name, recommendation: record.recommendation, status: record.status,
});

export const mapIntegrationPlanSummary = (record: DbSaIntegrationPlan, maps: LookupMaps): IntegrationPlanSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, planKey: record.plan_key, integrationCount: Array.isArray(record.integrations) ? record.integrations.length : 0, status: record.status,
});

export const mapSecurityArchitectureSummary = (record: DbSaSecurityArchitecture, maps: LookupMaps): SecurityArchitectureSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, securityKey: record.security_key, controlCount: Array.isArray(record.controls) ? record.controls.length : 0, status: record.status,
});

export const mapScalabilityPlanSummary = (record: DbSaScalabilityPlan, maps: LookupMaps): ScalabilityPlanSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, planKey: record.plan_key, status: record.status,
});

export const mapPerformancePlanSummary = (record: DbSaPerformancePlan, maps: LookupMaps): PerformancePlanSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, planKey: record.plan_key, targetCount: Array.isArray(record.performance_targets) ? record.performance_targets.length : 0, status: record.status,
});

export const mapTechnologyDecisionSummary = (record: DbSaTechnologyDecision, maps: LookupMaps): TechnologyDecisionSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", decisionKey: record.decision_key, title: record.title, status: record.status, contextPreview: record.context.slice(0, 80),
});

export const mapDeploymentArchitectureSummary = (record: DbSaDeploymentArchitecture, maps: LookupMaps): DeploymentArchitectureSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, deploymentKey: record.deployment_key, environmentCount: Array.isArray(record.environments) ? record.environments.length : 0, status: record.status,
});

export const mapSprintPlanSummary = (record: DbSaSprintPlan, maps: LookupMaps): SprintPlanSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, planKey: record.plan_key, totalSprints: record.total_sprints, status: record.status,
});

export const mapDependencyAnalysisSummary = (record: DbSaDependencyAnalysis, maps: LookupMaps): DependencyAnalysisSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", analysisKey: record.analysis_key, dependencyCount: Array.isArray(record.dependencies) ? record.dependencies.length : 0, criticalPath: record.critical_path, status: record.status,
});

export const mapArchitectureReviewSummary = (record: DbSaArchitectureReview, maps: LookupMaps): ArchitectureReviewSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", entityType: record.entity_type, reviewerName: employeeName(maps, record.reviewer_id), reviewStatus: record.review_status, comments: record.comments,
});

export const mapVersionSummary = (record: DbSaArchitectureVersion, maps: LookupMaps): VersionSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", entityType: record.entity_type, versionNumber: record.version_number, changeSummary: record.change_summary, createdAt: record.created_at,
});

export const mapAuditEntry = (record: DbSaAuditLog): AuditEntry => ({
    id: record.id, entityType: record.entity_type, entityId: record.entity_id ?? null, action: record.action, summary: record.summary, createdAt: record.created_at,
});

export const buildSaDashboardStats = (input: {
    engagements: EngagementSummary[];
    solutionArchitectures: SolutionArchitectureSummary[];
    systemDecompositions: SystemDecompositionSummary[];
    domainModels: DomainModelSummary[];
    databaseSchemas: DatabaseSchemaSummary[];
    apiContracts: ApiContractSummary[];
    moduleSelections: ModuleSelectionSummary[];
    buildReuseRecommendations: BuildReuseSummary[];
    integrationPlans: IntegrationPlanSummary[];
    securityArchitectures: SecurityArchitectureSummary[];
    scalabilityPlans: ScalabilityPlanSummary[];
    performancePlans: PerformancePlanSummary[];
    technologyDecisions: TechnologyDecisionSummary[];
    deploymentArchitectures: DeploymentArchitectureSummary[];
    sprintPlans: SprintPlanSummary[];
    dependencyAnalyses: DependencyAnalysisSummary[];
    architectureReviews: ArchitectureReviewSummary[];
    versions: VersionSummary[];
}): SaDashboardStats => ({
    totalEngagements: input.engagements.length,
    activeEngagements: input.engagements.filter((e) => e.status === "active").length,
    architectureCount: input.solutionArchitectures.length,
    decompositionCount: input.systemDecompositions.length,
    domainModelCount: input.domainModels.length,
    databaseSchemaCount: input.databaseSchemas.length,
    apiContractCount: input.apiContracts.length,
    moduleSelectionCount: input.moduleSelections.length,
    buildReuseCount: input.buildReuseRecommendations.length,
    integrationPlanCount: input.integrationPlans.length,
    securityArchitectureCount: input.securityArchitectures.length,
    technologyDecisionCount: input.technologyDecisions.length,
    deploymentArchitectureCount: input.deploymentArchitectures.length,
    sprintPlanCount: input.sprintPlans.length,
    pendingReviews: input.architectureReviews.filter((r) => r.reviewStatus === "pending").length,
    versionCount: input.versions.length,
});

export const buildSaPipelineInfo = (): SaPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "business_analyst", label: "AI Business Analyst" },
        { key: "architecture_design", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa", label: "AI QA" },
        { key: "deployment", label: "Deployment" },
    ],
    currentWorker: "AI Solution Architect",
    nextWorker: "AI Development Factory",
    previousWorker: "AI Business Analyst",
});

export const buildEngagementPayload = (organizationId: string, input: CreateEngagementInput) => ({
    organization_id: organizationId, title: input.title, engagement_key: input.engagementKey, ba_engagement_id: input.baEngagementId || null, brd_id: input.brdId || null, frs_id: input.frsId || null, client_id: input.clientId || null, project_id: input.projectId || null, agent_id: input.agentId || null, session_id: input.sessionId || null, knowledge_context_id: input.knowledgeContextId || null, pipeline_stage: input.pipelineStage ?? "architecture_design", summary: input.summary ?? "",
});

export const buildSolutionArchitecturePayload = (organizationId: string, input: CreateSolutionArchitectureInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, title: input.title, architecture_type: input.architectureType ?? "enterprise", overview: input.overview, components: input.components ?? [], content: input.content ?? "",
});

export const buildSystemDecompositionPayload = (organizationId: string, input: CreateSystemDecompositionInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, decomposition_key: input.decompositionKey, layers: input.layers ?? [], description: input.description ?? "",
});

export const buildDomainModelPayload = (organizationId: string, input: CreateDomainModelInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, model_key: input.modelKey, entities: input.entities ?? [], relationships: input.relationships ?? [], description: input.description ?? "",
});

export const buildDatabaseSchemaPayload = (organizationId: string, input: CreateDatabaseSchemaInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, schema_key: input.schemaKey, tables: input.tables ?? [], relationships: input.relationships ?? [], migration_notes: input.migrationNotes ?? "",
});

export const buildApiContractPayload = (organizationId: string, input: CreateApiContractInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, contract_key: input.contractKey, endpoints: input.endpoints ?? [], openapi_spec: input.openapiSpec ?? "", version: input.version ?? "1.0.0",
});

export const buildModuleSelectionPayload = (organizationId: string, input: CreateModuleSelectionInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, module_name: input.moduleName, module_key: input.moduleKey, platform_module: input.platformModule ?? "", selection_rationale: input.selectionRationale ?? "",
});

export const buildBuildReusePayload = (organizationId: string, input: CreateBuildReuseInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, item_key: input.itemKey, component_name: input.componentName, recommendation: input.recommendation ?? "reuse", rationale: input.rationale ?? "",
});

export const buildIntegrationPlanPayload = (organizationId: string, input: CreateIntegrationPlanInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, plan_key: input.planKey, integrations: input.integrations ?? [], data_flow: input.dataFlow ?? "",
});

export const buildSecurityArchitecturePayload = (organizationId: string, input: CreateSecurityArchitectureInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, security_key: input.securityKey, auth_model: input.authModel ?? "", encryption: input.encryption ?? "", controls: input.controls ?? [],
});

export const buildScalabilityPlanPayload = (organizationId: string, input: CreateScalabilityPlanInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, plan_key: input.planKey, scaling_strategy: input.scalingStrategy ?? "", targets: input.targets ?? [],
});

export const buildPerformancePlanPayload = (organizationId: string, input: CreatePerformancePlanInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, plan_key: input.planKey, performance_targets: input.performanceTargets ?? [], optimization_notes: input.optimizationNotes ?? "",
});

export const buildTechnologyDecisionPayload = (organizationId: string, input: CreateTechnologyDecisionInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, decision_key: input.decisionKey, title: input.title, context: input.context ?? "", decision: input.decision ?? "", consequences: input.consequences ?? "",
});

export const buildDeploymentArchitecturePayload = (organizationId: string, input: CreateDeploymentArchitectureInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, deployment_key: input.deploymentKey, environments: input.environments ?? [], infrastructure: input.infrastructure ?? "",
});

export const buildSprintPlanPayload = (organizationId: string, input: CreateSprintPlanInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, plan_key: input.planKey, name: input.name, sprints: input.sprints ?? [], total_sprints: input.totalSprints ?? 0,
});

export const buildDependencyAnalysisPayload = (organizationId: string, input: CreateDependencyAnalysisInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, analysis_key: input.analysisKey, dependencies: input.dependencies ?? [], critical_path: input.criticalPath ?? "",
});

export const buildArchitectureReviewPayload = (organizationId: string, input: CreateArchitectureReviewInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, entity_type: input.entityType, entity_id: input.entityId || null, reviewer_id: input.reviewerId || null, review_status: input.reviewStatus ?? "pending", comments: input.comments ?? "",
});

export const buildVersionPayload = (organizationId: string, input: CreateVersionInput, versionNumber: number) => ({
    organization_id: organizationId, engagement_id: input.engagementId, entity_type: input.entityType, entity_id: input.entityId, version_number: versionNumber, content: input.content, change_summary: input.changeSummary,
});

export const buildSaAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId, entity_type: entityType, entity_id: entityId ?? null, action, summary, metadata: {},
});
