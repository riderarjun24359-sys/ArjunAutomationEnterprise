export type SolutionArchitectTab =
    | "overview"
    | "engagements"
    | "architectures"
    | "decompositions"
    | "domainModels"
    | "databaseSchemas"
    | "apiContracts"
    | "moduleSelections"
    | "buildReuse"
    | "integrations"
    | "security"
    | "scalability"
    | "performance"
    | "technologyDecisions"
    | "deployment"
    | "sprintPlans"
    | "dependencies"
    | "reviews"
    | "versions"
    | "audit"
    | "api";

export interface SaDashboardStats {
    totalEngagements: number;
    activeEngagements: number;
    architectureCount: number;
    decompositionCount: number;
    domainModelCount: number;
    databaseSchemaCount: number;
    apiContractCount: number;
    moduleSelectionCount: number;
    buildReuseCount: number;
    integrationPlanCount: number;
    securityArchitectureCount: number;
    technologyDecisionCount: number;
    deploymentArchitectureCount: number;
    sprintPlanCount: number;
    pendingReviews: number;
    versionCount: number;
}

export interface SaPipelineInfo {
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
    brdTitle?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface SolutionArchitectureSummary {
    id: string;
    engagementTitle: string;
    title: string;
    architectureType: string;
    componentCount: number;
    status: string;
    overviewPreview: string;
}

export interface SystemDecompositionSummary {
    id: string;
    engagementTitle: string;
    name: string;
    decompositionKey: string;
    layerCount: number;
    status: string;
}

export interface DomainModelSummary {
    id: string;
    engagementTitle: string;
    name: string;
    modelKey: string;
    entityCount: number;
    status: string;
}

export interface DatabaseSchemaSummary {
    id: string;
    engagementTitle: string;
    name: string;
    schemaKey: string;
    tableCount: number;
    status: string;
}

export interface ApiContractSummary {
    id: string;
    engagementTitle: string;
    name: string;
    contractKey: string;
    endpointCount: number;
    version: string;
    status: string;
}

export interface ModuleSelectionSummary {
    id: string;
    engagementTitle: string;
    moduleName: string;
    moduleKey: string;
    platformModule: string;
    status: string;
}

export interface BuildReuseSummary {
    id: string;
    engagementTitle: string;
    itemKey: string;
    componentName: string;
    recommendation: string;
    status: string;
}

export interface IntegrationPlanSummary {
    id: string;
    engagementTitle: string;
    name: string;
    planKey: string;
    integrationCount: number;
    status: string;
}

export interface SecurityArchitectureSummary {
    id: string;
    engagementTitle: string;
    name: string;
    securityKey: string;
    controlCount: number;
    status: string;
}

export interface ScalabilityPlanSummary {
    id: string;
    engagementTitle: string;
    name: string;
    planKey: string;
    status: string;
}

export interface PerformancePlanSummary {
    id: string;
    engagementTitle: string;
    name: string;
    planKey: string;
    targetCount: number;
    status: string;
}

export interface TechnologyDecisionSummary {
    id: string;
    engagementTitle: string;
    decisionKey: string;
    title: string;
    status: string;
    contextPreview: string;
}

export interface DeploymentArchitectureSummary {
    id: string;
    engagementTitle: string;
    name: string;
    deploymentKey: string;
    environmentCount: number;
    status: string;
}

export interface SprintPlanSummary {
    id: string;
    engagementTitle: string;
    name: string;
    planKey: string;
    totalSprints: number;
    status: string;
}

export interface DependencyAnalysisSummary {
    id: string;
    engagementTitle: string;
    analysisKey: string;
    dependencyCount: number;
    criticalPath: string;
    status: string;
}

export interface ArchitectureReviewSummary {
    id: string;
    engagementTitle: string;
    entityType: string;
    reviewerName?: string | null;
    reviewStatus: string;
    comments: string;
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

export interface CreateEngagementInput { title: string; engagementKey: string; baEngagementId?: string; brdId?: string; frsId?: string; clientId?: string; projectId?: string; agentId?: string; sessionId?: string; knowledgeContextId?: string; pipelineStage?: string; summary?: string; }
export interface CreateSolutionArchitectureInput { engagementId: string; title: string; overview: string; architectureType?: string; components?: string[]; content?: string; }
export interface CreateSystemDecompositionInput { engagementId: string; name: string; decompositionKey: string; layers?: string[]; description?: string; }
export interface CreateDomainModelInput { engagementId: string; name: string; modelKey: string; entities?: string[]; relationships?: unknown[]; description?: string; }
export interface CreateDatabaseSchemaInput { engagementId: string; name: string; schemaKey: string; tables?: string[]; relationships?: unknown[]; migrationNotes?: string; }
export interface CreateApiContractInput { engagementId: string; name: string; contractKey: string; endpoints?: unknown[]; openapiSpec?: string; version?: string; }
export interface CreateModuleSelectionInput { engagementId: string; moduleName: string; moduleKey: string; platformModule?: string; selectionRationale?: string; }
export interface CreateBuildReuseInput { engagementId: string; itemKey: string; componentName: string; recommendation?: string; rationale?: string; }
export interface CreateIntegrationPlanInput { engagementId: string; name: string; planKey: string; integrations?: string[]; dataFlow?: string; }
export interface CreateSecurityArchitectureInput { engagementId: string; name: string; securityKey: string; authModel?: string; encryption?: string; controls?: string[]; }
export interface CreateScalabilityPlanInput { engagementId: string; name: string; planKey: string; scalingStrategy?: string; targets?: unknown[]; }
export interface CreatePerformancePlanInput { engagementId: string; name: string; planKey: string; performanceTargets?: unknown[]; optimizationNotes?: string; }
export interface CreateTechnologyDecisionInput { engagementId: string; decisionKey: string; title: string; context?: string; decision?: string; consequences?: string; }
export interface CreateDeploymentArchitectureInput { engagementId: string; name: string; deploymentKey: string; environments?: string[]; infrastructure?: string; }
export interface CreateSprintPlanInput { engagementId: string; planKey: string; name: string; sprints?: unknown[]; totalSprints?: number; }
export interface CreateDependencyAnalysisInput { engagementId: string; analysisKey: string; dependencies?: string[]; criticalPath?: string; }
export interface CreateArchitectureReviewInput { engagementId: string; entityType: string; entityId?: string; reviewerId?: string; reviewStatus?: string; comments?: string; }
export interface CreateVersionInput { engagementId: string; entityType: string; entityId: string; content: string; changeSummary: string; }

export interface SaSdkStartEngagementInput {
    title: string;
    engagementKey: string;
    baEngagementId?: string;
    brdId?: string;
    frsId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
}

export interface SaSdkStartEngagementResult {
    engagementId: string;
    engagementKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface SaSdkGenerateArtifactInput {
    engagementId: string;
    artifactType: "solution_architecture" | "api_contract" | "database_schema" | "technology_decision";
    title: string;
    content: string;
}

export interface SaSdkGenerateArtifactResult {
    artifactId: string;
    artifactType: string;
    status: string;
}

export interface SaSdkRunAnalysisInput {
    engagementId: string;
    analysisType: "dependency" | "build_reuse" | "module_selection";
    inputPayload: Record<string, unknown>;
}

export interface SaSdkRunAnalysisResult {
    analysisId: string;
    analysisType: string;
    status: string;
}
