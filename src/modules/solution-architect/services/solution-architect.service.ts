import {
    buildApiContractPayload,
    buildArchitectureReviewPayload,
    buildBuildReusePayload,
    buildDatabaseSchemaPayload,
    buildDependencyAnalysisPayload,
    buildDeploymentArchitecturePayload,
    buildDomainModelPayload,
    buildEngagementPayload,
    buildIntegrationPlanPayload,
    buildLookupMaps,
    buildModuleSelectionPayload,
    buildPerformancePlanPayload,
    buildSaAuditPayload,
    buildSaDashboardStats,
    buildSaPipelineInfo,
    buildScalabilityPlanPayload,
    buildSecurityArchitecturePayload,
    buildSolutionArchitecturePayload,
    buildSprintPlanPayload,
    buildSystemDecompositionPayload,
    buildTechnologyDecisionPayload,
    buildVersionPayload,
    mapApiContractSummary,
    mapArchitectureReviewSummary,
    mapAuditEntry,
    mapBuildReuseSummary,
    mapDatabaseSchemaSummary,
    mapDependencyAnalysisSummary,
    mapDeploymentArchitectureSummary,
    mapDomainModelSummary,
    mapEngagementSummary,
    mapIntegrationPlanSummary,
    mapModuleSelectionSummary,
    mapPerformancePlanSummary,
    mapScalabilityPlanSummary,
    mapSecurityArchitectureSummary,
    mapSolutionArchitectureSummary,
    mapSprintPlanSummary,
    mapSystemDecompositionSummary,
    mapTechnologyDecisionSummary,
    mapVersionSummary,
} from "@/src/modules/database/lib/solution-architect-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
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
    SaSdkGenerateArtifactInput,
    SaSdkGenerateArtifactResult,
    SaSdkRunAnalysisInput,
    SaSdkRunAnalysisResult,
    SaSdkStartEngagementInput,
    SaSdkStartEngagementResult,
    ScalabilityPlanSummary,
    SecurityArchitectureSummary,
    SolutionArchitectureSummary,
    SprintPlanSummary,
    SystemDecompositionSummary,
    TechnologyDecisionSummary,
    VersionSummary,
} from "@/src/modules/solution-architect/types";

export class SolutionArchitectService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [saEngagements, baEngagements, baBrds, baFrsDocuments, clients, projects, agents, sessions, employees] = await Promise.all([
            databaseService.saEngagements.listByOrganization(organizationId),
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.baBrds.listByOrganization(organizationId),
            databaseService.baFrsDocuments.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(saEngagements, baEngagements, baBrds, baFrsDocuments, clients, projects, agents, sessions, employees);
    }

    async getEngagements(authUserId: string, email: string, fullName?: string | null): Promise<EngagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saEngagements.listByOrganization(context.organizationId)).map((e) => mapEngagementSummary(e, maps));
    }

    async createEngagement(authUserId: string, email: string, input: CreateEngagementInput, fullName?: string | null): Promise<EngagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saEngagements.create(buildEngagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create engagement");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "engagement", "create", `Engagement ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEngagementSummary(created, maps);
    }

    async getSolutionArchitectures(authUserId: string, email: string, fullName?: string | null): Promise<SolutionArchitectureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saSolutionArchitectures.listByOrganization(context.organizationId)).map((r) => mapSolutionArchitectureSummary(r, maps));
    }

    async createSolutionArchitecture(authUserId: string, email: string, input: CreateSolutionArchitectureInput, fullName?: string | null): Promise<SolutionArchitectureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saSolutionArchitectures.create(buildSolutionArchitecturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create solution architecture");
        await databaseService.saArchitectureVersions.create(buildVersionPayload(context.organizationId, { engagementId: input.engagementId, entityType: "solution_architecture", entityId: created.id, content: created.content, changeSummary: "Initial architecture version" }, 1));
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "solution_architecture", "create", `Solution architecture ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSolutionArchitectureSummary(created, maps);
    }

    async getSystemDecompositions(authUserId: string, email: string, fullName?: string | null): Promise<SystemDecompositionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saSystemDecompositions.listByOrganization(context.organizationId)).map((r) => mapSystemDecompositionSummary(r, maps));
    }

    async createSystemDecomposition(authUserId: string, email: string, input: CreateSystemDecompositionInput, fullName?: string | null): Promise<SystemDecompositionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saSystemDecompositions.create(buildSystemDecompositionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create system decomposition");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "system_decomposition", "create", `System decomposition ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSystemDecompositionSummary(created, maps);
    }

    async getDomainModels(authUserId: string, email: string, fullName?: string | null): Promise<DomainModelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saDomainModels.listByOrganization(context.organizationId)).map((r) => mapDomainModelSummary(r, maps));
    }

    async createDomainModel(authUserId: string, email: string, input: CreateDomainModelInput, fullName?: string | null): Promise<DomainModelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saDomainModels.create(buildDomainModelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create domain model");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "domain_model", "create", `Domain model ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDomainModelSummary(created, maps);
    }

    async getDatabaseSchemas(authUserId: string, email: string, fullName?: string | null): Promise<DatabaseSchemaSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saDatabaseSchemas.listByOrganization(context.organizationId)).map((r) => mapDatabaseSchemaSummary(r, maps));
    }

    async createDatabaseSchema(authUserId: string, email: string, input: CreateDatabaseSchemaInput, fullName?: string | null): Promise<DatabaseSchemaSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saDatabaseSchemas.create(buildDatabaseSchemaPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create database schema");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "database_schema", "create", `Database schema ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDatabaseSchemaSummary(created, maps);
    }

    async getApiContracts(authUserId: string, email: string, fullName?: string | null): Promise<ApiContractSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saApiContracts.listByOrganization(context.organizationId)).map((r) => mapApiContractSummary(r, maps));
    }

    async createApiContract(authUserId: string, email: string, input: CreateApiContractInput, fullName?: string | null): Promise<ApiContractSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saApiContracts.create(buildApiContractPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create API contract");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "api_contract", "create", `API contract ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApiContractSummary(created, maps);
    }

    async getModuleSelections(authUserId: string, email: string, fullName?: string | null): Promise<ModuleSelectionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saModuleSelections.listByOrganization(context.organizationId)).map((r) => mapModuleSelectionSummary(r, maps));
    }

    async createModuleSelection(authUserId: string, email: string, input: CreateModuleSelectionInput, fullName?: string | null): Promise<ModuleSelectionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saModuleSelections.create(buildModuleSelectionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create module selection");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "module_selection", "create", `Module selection ${created.module_name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleSelectionSummary(created, maps);
    }

    async getBuildReuseRecommendations(authUserId: string, email: string, fullName?: string | null): Promise<BuildReuseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saBuildReuseRecommendations.listByOrganization(context.organizationId)).map((r) => mapBuildReuseSummary(r, maps));
    }

    async createBuildReuseRecommendation(authUserId: string, email: string, input: CreateBuildReuseInput, fullName?: string | null): Promise<BuildReuseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saBuildReuseRecommendations.create(buildBuildReusePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create build/reuse recommendation");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "build_reuse_recommendation", "create", `Build/reuse recommendation ${created.component_name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBuildReuseSummary(created, maps);
    }

    async getIntegrationPlans(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saIntegrationPlans.listByOrganization(context.organizationId)).map((r) => mapIntegrationPlanSummary(r, maps));
    }

    async createIntegrationPlan(authUserId: string, email: string, input: CreateIntegrationPlanInput, fullName?: string | null): Promise<IntegrationPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saIntegrationPlans.create(buildIntegrationPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create integration plan");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "integration_plan", "create", `Integration plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIntegrationPlanSummary(created, maps);
    }

    async getSecurityArchitectures(authUserId: string, email: string, fullName?: string | null): Promise<SecurityArchitectureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saSecurityArchitectures.listByOrganization(context.organizationId)).map((r) => mapSecurityArchitectureSummary(r, maps));
    }

    async createSecurityArchitecture(authUserId: string, email: string, input: CreateSecurityArchitectureInput, fullName?: string | null): Promise<SecurityArchitectureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saSecurityArchitectures.create(buildSecurityArchitecturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create security architecture");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "security_architecture", "create", `Security architecture ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecurityArchitectureSummary(created, maps);
    }

    async getScalabilityPlans(authUserId: string, email: string, fullName?: string | null): Promise<ScalabilityPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saScalabilityPlans.listByOrganization(context.organizationId)).map((r) => mapScalabilityPlanSummary(r, maps));
    }

    async createScalabilityPlan(authUserId: string, email: string, input: CreateScalabilityPlanInput, fullName?: string | null): Promise<ScalabilityPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saScalabilityPlans.create(buildScalabilityPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create scalability plan");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "scalability_plan", "create", `Scalability plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapScalabilityPlanSummary(created, maps);
    }

    async getPerformancePlans(authUserId: string, email: string, fullName?: string | null): Promise<PerformancePlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saPerformancePlans.listByOrganization(context.organizationId)).map((r) => mapPerformancePlanSummary(r, maps));
    }

    async createPerformancePlan(authUserId: string, email: string, input: CreatePerformancePlanInput, fullName?: string | null): Promise<PerformancePlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saPerformancePlans.create(buildPerformancePlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create performance plan");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "performance_plan", "create", `Performance plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPerformancePlanSummary(created, maps);
    }

    async getTechnologyDecisions(authUserId: string, email: string, fullName?: string | null): Promise<TechnologyDecisionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saTechnologyDecisions.listByOrganization(context.organizationId)).map((r) => mapTechnologyDecisionSummary(r, maps));
    }

    async createTechnologyDecision(authUserId: string, email: string, input: CreateTechnologyDecisionInput, fullName?: string | null): Promise<TechnologyDecisionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saTechnologyDecisions.create(buildTechnologyDecisionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create technology decision");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "technology_decision", "create", `Technology decision ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTechnologyDecisionSummary(created, maps);
    }

    async getDeploymentArchitectures(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentArchitectureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saDeploymentArchitectures.listByOrganization(context.organizationId)).map((r) => mapDeploymentArchitectureSummary(r, maps));
    }

    async createDeploymentArchitecture(authUserId: string, email: string, input: CreateDeploymentArchitectureInput, fullName?: string | null): Promise<DeploymentArchitectureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saDeploymentArchitectures.create(buildDeploymentArchitecturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deployment architecture");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "deployment_architecture", "create", `Deployment architecture ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentArchitectureSummary(created, maps);
    }

    async getSprintPlans(authUserId: string, email: string, fullName?: string | null): Promise<SprintPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saSprintPlans.listByOrganization(context.organizationId)).map((r) => mapSprintPlanSummary(r, maps));
    }

    async createSprintPlan(authUserId: string, email: string, input: CreateSprintPlanInput, fullName?: string | null): Promise<SprintPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saSprintPlans.create(buildSprintPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create sprint plan");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "sprint_plan", "create", `Sprint plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSprintPlanSummary(created, maps);
    }

    async getDependencyAnalyses(authUserId: string, email: string, fullName?: string | null): Promise<DependencyAnalysisSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saDependencyAnalyses.listByOrganization(context.organizationId)).map((r) => mapDependencyAnalysisSummary(r, maps));
    }

    async createDependencyAnalysis(authUserId: string, email: string, input: CreateDependencyAnalysisInput, fullName?: string | null): Promise<DependencyAnalysisSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saDependencyAnalyses.create(buildDependencyAnalysisPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dependency analysis");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "dependency_analysis", "create", `Dependency analysis ${created.analysis_key} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDependencyAnalysisSummary(created, maps);
    }

    async getArchitectureReviews(authUserId: string, email: string, fullName?: string | null): Promise<ArchitectureReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saArchitectureReviews.listByOrganization(context.organizationId)).map((r) => mapArchitectureReviewSummary(r, maps));
    }

    async createArchitectureReview(authUserId: string, email: string, input: CreateArchitectureReviewInput, fullName?: string | null): Promise<ArchitectureReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saArchitectureReviews.create(buildArchitectureReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create architecture review");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "architecture_review", "create", `Architecture review for ${input.entityType} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapArchitectureReviewSummary(created, maps);
    }

    async getVersions(authUserId: string, email: string, fullName?: string | null): Promise<VersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saArchitectureVersions.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((r) => mapVersionSummary(r, maps));
    }

    async createVersion(authUserId: string, email: string, input: CreateVersionInput, fullName?: string | null): Promise<VersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const existing = (await databaseService.saArchitectureVersions.listByOrganization(context.organizationId)).filter((v) => v.entity_id === input.entityId);
        const versionNumber = existing.length > 0 ? Math.max(...existing.map((v) => v.version_number)) + 1 : 1;
        const created = await databaseService.saArchitectureVersions.create(buildVersionPayload(context.organizationId, input, versionNumber));
        if (!created) throw new Error("Failed to create version");
        await databaseService.saAuditLogs.create(buildSaAuditPayload(context.organizationId, "version", "create", `Version ${versionNumber} created for ${input.entityType}`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVersionSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getPipelineInfo(): Promise<SaPipelineInfo> {
        return buildSaPipelineInfo();
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<SaDashboardStats> {
        const [engagements, solutionArchitectures, systemDecompositions, domainModels, databaseSchemas, apiContracts, moduleSelections, buildReuseRecommendations, integrationPlans, securityArchitectures, scalabilityPlans, performancePlans, technologyDecisions, deploymentArchitectures, sprintPlans, dependencyAnalyses, architectureReviews, versions] = await Promise.all([
            this.getEngagements(authUserId, email, fullName),
            this.getSolutionArchitectures(authUserId, email, fullName),
            this.getSystemDecompositions(authUserId, email, fullName),
            this.getDomainModels(authUserId, email, fullName),
            this.getDatabaseSchemas(authUserId, email, fullName),
            this.getApiContracts(authUserId, email, fullName),
            this.getModuleSelections(authUserId, email, fullName),
            this.getBuildReuseRecommendations(authUserId, email, fullName),
            this.getIntegrationPlans(authUserId, email, fullName),
            this.getSecurityArchitectures(authUserId, email, fullName),
            this.getScalabilityPlans(authUserId, email, fullName),
            this.getPerformancePlans(authUserId, email, fullName),
            this.getTechnologyDecisions(authUserId, email, fullName),
            this.getDeploymentArchitectures(authUserId, email, fullName),
            this.getSprintPlans(authUserId, email, fullName),
            this.getDependencyAnalyses(authUserId, email, fullName),
            this.getArchitectureReviews(authUserId, email, fullName),
            this.getVersions(authUserId, email, fullName),
        ]);
        return buildSaDashboardStats({ engagements, solutionArchitectures, systemDecompositions, domainModels, databaseSchemas, apiContracts, moduleSelections, buildReuseRecommendations, integrationPlans, securityArchitectures, scalabilityPlans, performancePlans, technologyDecisions, deploymentArchitectures, sprintPlans, dependencyAnalyses, architectureReviews, versions });
    }

    async sdkStartEngagement(authUserId: string, email: string, input: SaSdkStartEngagementInput, fullName?: string | null): Promise<SaSdkStartEngagementResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const context = await knowledge.resolveContext({ contextKey: `sa-${input.engagementKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const engagement = await this.createEngagement(authUserId, email, { ...input, knowledgeContextId: context.contextId, pipelineStage: "architecture_design" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "architecture_design", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "solution_architect", inputPayload: { engagementKey: input.engagementKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `sa-${input.engagementKey}`, summary: input.title });
        }
        return { engagementId: engagement.id, engagementKey: engagement.engagementKey, pipelineStage: engagement.pipelineStage, aiTaskId };
    }

    async sdkGenerateArtifact(authUserId: string, email: string, input: SaSdkGenerateArtifactInput, fullName?: string | null): Promise<SaSdkGenerateArtifactResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: `generate_${input.artifactType}`, moduleSource: "solution_architect", inputPayload: { engagementId: input.engagementId, title: input.title, content: input.content } });
        if (input.artifactType === "solution_architecture") {
            const created = await this.createSolutionArchitecture(authUserId, email, { engagementId: input.engagementId, title: input.title, overview: input.content.slice(0, 200), content: input.content }, fullName);
            return { artifactId: created.id, artifactType: "solution_architecture", status: created.status };
        }
        if (input.artifactType === "api_contract") {
            const created = await this.createApiContract(authUserId, email, { engagementId: input.engagementId, name: input.title, contractKey: input.title.replace(/\s+/g, "-").toLowerCase(), openapiSpec: input.content }, fullName);
            return { artifactId: created.id, artifactType: "api_contract", status: created.status };
        }
        if (input.artifactType === "database_schema") {
            const created = await this.createDatabaseSchema(authUserId, email, { engagementId: input.engagementId, name: input.title, schemaKey: input.title.replace(/\s+/g, "-").toLowerCase(), migrationNotes: input.content }, fullName);
            return { artifactId: created.id, artifactType: "database_schema", status: created.status };
        }
        const created = await this.createTechnologyDecision(authUserId, email, { engagementId: input.engagementId, decisionKey: input.title.replace(/\s+/g, "-").toLowerCase(), title: input.title, decision: input.content }, fullName);
        return { artifactId: created.id, artifactType: "technology_decision", status: created.status };
    }

    async sdkRunAnalysis(authUserId: string, email: string, input: SaSdkRunAnalysisInput, fullName?: string | null): Promise<SaSdkRunAnalysisResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.analysisType, limit: 5 });
        await ai.executeTask({ taskType: `sa_${input.analysisType}_analysis`, moduleSource: "solution_architect", inputPayload: { engagementId: input.engagementId, ...input.inputPayload } });
        if (input.analysisType === "dependency") {
            const created = await this.createDependencyAnalysis(authUserId, email, { engagementId: input.engagementId, analysisKey: String(input.inputPayload.analysisKey ?? "DEP-AUTO"), dependencies: (input.inputPayload.dependencies as string[]) ?? [], criticalPath: String(input.inputPayload.criticalPath ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "dependency", status: created.status };
        }
        if (input.analysisType === "build_reuse") {
            const created = await this.createBuildReuseRecommendation(authUserId, email, { engagementId: input.engagementId, itemKey: String(input.inputPayload.itemKey ?? "REUSE-AUTO"), componentName: String(input.inputPayload.componentName ?? "Component"), recommendation: String(input.inputPayload.recommendation ?? "reuse"), rationale: String(input.inputPayload.rationale ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "build_reuse", status: created.status };
        }
        const created = await this.createModuleSelection(authUserId, email, { engagementId: input.engagementId, moduleName: String(input.inputPayload.moduleName ?? "Module"), moduleKey: String(input.inputPayload.moduleKey ?? "module-auto"), platformModule: String(input.inputPayload.platformModule ?? ""), selectionRationale: String(input.inputPayload.selectionRationale ?? "") }, fullName);
        return { analysisId: created.id, analysisType: "module_selection", status: created.status };
    }

    async getEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getBaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getBrdOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baBrds.listByOrganization(context.organizationId)).map((b) => ({ id: b.id, name: b.title }));
    }

    async getFrsOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baFrsDocuments.listByOrganization(context.organizationId)).map((f) => ({ id: f.id, name: f.title }));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.name }));
    }

    async getProjectOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.projects.listByOrganization(context.organizationId)).map((p) => ({ id: p.id, name: p.name }));
    }

    async getAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getSessionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiSessions.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: s.session_key }));
    }

    async getEmployeeOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.employees.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}` }));
    }
}

export const solutionArchitectService = new SolutionArchitectService();
