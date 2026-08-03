import {
    buildApiScaffoldPayload,
    buildBackendWorkflowPayload,
    buildBuildArtifactPayload,
    buildCodeReviewPayload,
    buildCodingStandardPayload,
    buildComponentPayload,
    buildDfAuditPayload,
    buildDfDashboardStats,
    buildDfPipelineInfo,
    buildEngagementPayload,
    buildFrontendWorkflowPayload,
    buildLookupMaps,
    buildMigrationPlanPayload,
    buildModuleRecommendationPayload,
    buildProgressTrackingPayload,
    buildPullRequestPayload,
    buildRepositoryStructurePayload,
    buildSecureCodingValidationPayload,
    buildTechnicalDocPayload,
    buildTestScaffoldPayload,
    buildVersionPayload,
    buildWorkPackagePayload,
    mapApiScaffoldSummary,
    mapAuditEntry,
    mapBackendWorkflowSummary,
    mapBuildArtifactSummary,
    mapCodeReviewSummary,
    mapCodingStandardSummary,
    mapComponentSummary,
    mapEngagementSummary,
    mapFrontendWorkflowSummary,
    mapMigrationPlanSummary,
    mapModuleRecommendationSummary,
    mapProgressTrackingSummary,
    mapPullRequestSummary,
    mapRepositoryStructureSummary,
    mapSecureCodingValidationSummary,
    mapTechnicalDocSummary,
    mapTestScaffoldSummary,
    mapVersionSummary,
    mapWorkPackageSummary,
} from "@/src/modules/database/lib/development-factory-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
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
    DfSdkGenerateArtifactInput,
    DfSdkGenerateArtifactResult,
    DfSdkRunAnalysisInput,
    DfSdkRunAnalysisResult,
    DfSdkStartEngagementInput,
    DfSdkStartEngagementResult,
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

export class DevelopmentFactoryService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [dfEngagements, baEngagements, saEngagements, solutionArchitectures, baBrds, baFrsDocuments, clients, projects, agents, sessions, employees] = await Promise.all([
            databaseService.dfEngagements.listByOrganization(organizationId),
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.saEngagements.listByOrganization(organizationId),
            databaseService.saSolutionArchitectures.listByOrganization(organizationId),
            databaseService.baBrds.listByOrganization(organizationId),
            databaseService.baFrsDocuments.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(dfEngagements, baEngagements, saEngagements, solutionArchitectures, baBrds, baFrsDocuments, clients, projects, agents, sessions, employees);
    }

    async getEngagements(authUserId: string, email: string, fullName?: string | null): Promise<EngagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfEngagements.listByOrganization(context.organizationId)).map((e) => mapEngagementSummary(e, maps));
    }

    async createEngagement(authUserId: string, email: string, input: CreateEngagementInput, fullName?: string | null): Promise<EngagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfEngagements.create(buildEngagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create engagement");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "engagement", "create", `Engagement ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEngagementSummary(created, maps);
    }

    async getWorkPackages(authUserId: string, email: string, fullName?: string | null): Promise<WorkPackageSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfWorkPackages.listByOrganization(context.organizationId)).map((r) => mapWorkPackageSummary(r, maps));
    }

    async createWorkPackage(authUserId: string, email: string, input: CreateWorkPackageInput, fullName?: string | null): Promise<WorkPackageSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfWorkPackages.create(buildWorkPackagePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create work package");
        await databaseService.dfVersions.create(buildVersionPayload(context.organizationId, { engagementId: input.engagementId, entityType: "work_package", entityId: created.id, content: created.description, changeSummary: "Initial work package version" }, 1));
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "work_package", "create", `Work package ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkPackageSummary(created, maps);
    }

    async getBackendWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<BackendWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfBackendWorkflows.listByOrganization(context.organizationId)).map((r) => mapBackendWorkflowSummary(r, maps));
    }

    async createBackendWorkflow(authUserId: string, email: string, input: CreateBackendWorkflowInput, fullName?: string | null): Promise<BackendWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfBackendWorkflows.create(buildBackendWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create backend workflow");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "backend_workflow", "create", `Backend workflow ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBackendWorkflowSummary(created, maps);
    }

    async getFrontendWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<FrontendWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfFrontendWorkflows.listByOrganization(context.organizationId)).map((r) => mapFrontendWorkflowSummary(r, maps));
    }

    async createFrontendWorkflow(authUserId: string, email: string, input: CreateFrontendWorkflowInput, fullName?: string | null): Promise<FrontendWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfFrontendWorkflows.create(buildFrontendWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create frontend workflow");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "frontend_workflow", "create", `Frontend workflow ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFrontendWorkflowSummary(created, maps);
    }

    async getApiScaffolds(authUserId: string, email: string, fullName?: string | null): Promise<ApiScaffoldSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfApiScaffolds.listByOrganization(context.organizationId)).map((r) => mapApiScaffoldSummary(r, maps));
    }

    async createApiScaffold(authUserId: string, email: string, input: CreateApiScaffoldInput, fullName?: string | null): Promise<ApiScaffoldSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfApiScaffolds.create(buildApiScaffoldPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create API scaffold");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "api_scaffold", "create", `API scaffold ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApiScaffoldSummary(created, maps);
    }

    async getMigrationPlans(authUserId: string, email: string, fullName?: string | null): Promise<MigrationPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfMigrationPlans.listByOrganization(context.organizationId)).map((r) => mapMigrationPlanSummary(r, maps));
    }

    async createMigrationPlan(authUserId: string, email: string, input: CreateMigrationPlanInput, fullName?: string | null): Promise<MigrationPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfMigrationPlans.create(buildMigrationPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create migration plan");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "migration_plan", "create", `Migration plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMigrationPlanSummary(created, maps);
    }

    async getRepositoryStructures(authUserId: string, email: string, fullName?: string | null): Promise<RepositoryStructureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfRepositoryStructures.listByOrganization(context.organizationId)).map((r) => mapRepositoryStructureSummary(r, maps));
    }

    async createRepositoryStructure(authUserId: string, email: string, input: CreateRepositoryStructureInput, fullName?: string | null): Promise<RepositoryStructureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfRepositoryStructures.create(buildRepositoryStructurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create repository structure");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "repository", "create", `Repository ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRepositoryStructureSummary(created, maps);
    }

    async getComponents(authUserId: string, email: string, fullName?: string | null): Promise<ComponentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfComponents.listByOrganization(context.organizationId)).map((r) => mapComponentSummary(r, maps));
    }

    async createComponent(authUserId: string, email: string, input: CreateComponentInput, fullName?: string | null): Promise<ComponentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfComponents.create(buildComponentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create component");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "component", "create", `Component ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComponentSummary(created, maps);
    }

    async getTestScaffolds(authUserId: string, email: string, fullName?: string | null): Promise<TestScaffoldSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfTestScaffolds.listByOrganization(context.organizationId)).map((r) => mapTestScaffoldSummary(r, maps));
    }

    async createTestScaffold(authUserId: string, email: string, input: CreateTestScaffoldInput, fullName?: string | null): Promise<TestScaffoldSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfTestScaffolds.create(buildTestScaffoldPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create test scaffold");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "test_scaffold", "create", `Test scaffold ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTestScaffoldSummary(created, maps);
    }

    async getCodingStandards(authUserId: string, email: string, fullName?: string | null): Promise<CodingStandardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfCodingStandards.listByOrganization(context.organizationId)).map((r) => mapCodingStandardSummary(r, maps));
    }

    async createCodingStandard(authUserId: string, email: string, input: CreateCodingStandardInput, fullName?: string | null): Promise<CodingStandardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfCodingStandards.create(buildCodingStandardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create coding standard");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "coding_standard", "create", `Coding standard ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCodingStandardSummary(created, maps);
    }

    async getSecureCodingValidations(authUserId: string, email: string, fullName?: string | null): Promise<SecureCodingValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfSecureCodingValidations.listByOrganization(context.organizationId)).map((r) => mapSecureCodingValidationSummary(r, maps));
    }

    async createSecureCodingValidation(authUserId: string, email: string, input: CreateSecureCodingValidationInput, fullName?: string | null): Promise<SecureCodingValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfSecureCodingValidations.create(buildSecureCodingValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create secure coding validation");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "secure_coding_validation", "create", `Secure coding validation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecureCodingValidationSummary(created, maps);
    }

    async getModuleRecommendations(authUserId: string, email: string, fullName?: string | null): Promise<ModuleRecommendationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfModuleRecommendations.listByOrganization(context.organizationId)).map((r) => mapModuleRecommendationSummary(r, maps));
    }

    async createModuleRecommendation(authUserId: string, email: string, input: CreateModuleRecommendationInput, fullName?: string | null): Promise<ModuleRecommendationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfModuleRecommendations.create(buildModuleRecommendationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create module recommendation");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "module_recommendation", "create", `Module recommendation ${created.module_name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleRecommendationSummary(created, maps);
    }

    async getPullRequests(authUserId: string, email: string, fullName?: string | null): Promise<PullRequestSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfPullRequests.listByOrganization(context.organizationId)).map((r) => mapPullRequestSummary(r, maps));
    }

    async createPullRequest(authUserId: string, email: string, input: CreatePullRequestInput, fullName?: string | null): Promise<PullRequestSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfPullRequests.create(buildPullRequestPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pull request");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "pull_request", "create", `Pull request ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPullRequestSummary(created, maps);
    }

    async getCodeReviews(authUserId: string, email: string, fullName?: string | null): Promise<CodeReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfCodeReviews.listByOrganization(context.organizationId)).map((r) => mapCodeReviewSummary(r, maps));
    }

    async createCodeReview(authUserId: string, email: string, input: CreateCodeReviewInput, fullName?: string | null): Promise<CodeReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfCodeReviews.create(buildCodeReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create code review");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "code_review", "create", `Code review ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCodeReviewSummary(created, maps);
    }

    async getTechnicalDocs(authUserId: string, email: string, fullName?: string | null): Promise<TechnicalDocSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfTechnicalDocs.listByOrganization(context.organizationId)).map((r) => mapTechnicalDocSummary(r, maps));
    }

    async createTechnicalDoc(authUserId: string, email: string, input: CreateTechnicalDocInput, fullName?: string | null): Promise<TechnicalDocSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfTechnicalDocs.create(buildTechnicalDocPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create technical doc");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "technical_doc", "create", `Technical doc ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTechnicalDocSummary(created, maps);
    }

    async getProgressTracking(authUserId: string, email: string, fullName?: string | null): Promise<ProgressTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfProgressTracking.listByOrganization(context.organizationId)).map((r) => mapProgressTrackingSummary(r, maps));
    }

    async createProgressTracking(authUserId: string, email: string, input: CreateProgressTrackingInput, fullName?: string | null): Promise<ProgressTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfProgressTracking.create(buildProgressTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create progress tracking");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "progress_tracking", "create", `Progress milestone ${created.milestone} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProgressTrackingSummary(created, maps);
    }

    async getBuildArtifacts(authUserId: string, email: string, fullName?: string | null): Promise<BuildArtifactSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfBuildArtifacts.listByOrganization(context.organizationId)).map((r) => mapBuildArtifactSummary(r, maps));
    }

    async createBuildArtifact(authUserId: string, email: string, input: CreateBuildArtifactInput, fullName?: string | null): Promise<BuildArtifactSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfBuildArtifacts.create(buildBuildArtifactPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create build artifact");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "build_artifact", "create", `Build artifact ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBuildArtifactSummary(created, maps);
    }

    async getVersions(authUserId: string, email: string, fullName?: string | null): Promise<VersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfVersions.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((r) => mapVersionSummary(r, maps));
    }

    async createVersion(authUserId: string, email: string, input: CreateVersionInput, fullName?: string | null): Promise<VersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const existing = (await databaseService.dfVersions.listByOrganization(context.organizationId)).filter((v) => v.entity_id === input.entityId);
        const versionNumber = existing.length > 0 ? Math.max(...existing.map((v) => v.version_number)) + 1 : 1;
        const created = await databaseService.dfVersions.create(buildVersionPayload(context.organizationId, input, versionNumber));
        if (!created) throw new Error("Failed to create version");
        await databaseService.dfAuditLogs.create(buildDfAuditPayload(context.organizationId, "version", "create", `Version ${versionNumber} created for ${input.entityType}`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVersionSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getPipelineInfo(): Promise<DfPipelineInfo> {
        return buildDfPipelineInfo();
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DfDashboardStats> {
        const [engagements, workPackages, backendWorkflows, frontendWorkflows, apiScaffolds, migrationPlans, repositoryStructures, components, testScaffolds, codingStandards, secureCodingValidations, moduleRecommendations, pullRequests, codeReviews, technicalDocs, progressTracking, buildArtifacts, versions] = await Promise.all([
            this.getEngagements(authUserId, email, fullName),
            this.getWorkPackages(authUserId, email, fullName),
            this.getBackendWorkflows(authUserId, email, fullName),
            this.getFrontendWorkflows(authUserId, email, fullName),
            this.getApiScaffolds(authUserId, email, fullName),
            this.getMigrationPlans(authUserId, email, fullName),
            this.getRepositoryStructures(authUserId, email, fullName),
            this.getComponents(authUserId, email, fullName),
            this.getTestScaffolds(authUserId, email, fullName),
            this.getCodingStandards(authUserId, email, fullName),
            this.getSecureCodingValidations(authUserId, email, fullName),
            this.getModuleRecommendations(authUserId, email, fullName),
            this.getPullRequests(authUserId, email, fullName),
            this.getCodeReviews(authUserId, email, fullName),
            this.getTechnicalDocs(authUserId, email, fullName),
            this.getProgressTracking(authUserId, email, fullName),
            this.getBuildArtifacts(authUserId, email, fullName),
            this.getVersions(authUserId, email, fullName),
        ]);
        return buildDfDashboardStats({ engagements, workPackages, backendWorkflows, frontendWorkflows, apiScaffolds, migrationPlans, repositoryStructures, components, testScaffolds, codingStandards, secureCodingValidations, moduleRecommendations, pullRequests, codeReviews, technicalDocs, progressTracking, buildArtifacts, versions });
    }

    async sdkStartEngagement(authUserId: string, email: string, input: DfSdkStartEngagementInput, fullName?: string | null): Promise<DfSdkStartEngagementResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const context = await knowledge.resolveContext({ contextKey: `df-${input.engagementKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const engagement = await this.createEngagement(authUserId, email, { ...input, knowledgeContextId: context.contextId, pipelineStage: "development_factory" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "development_factory", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "development_factory", inputPayload: { engagementKey: input.engagementKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `df-${input.engagementKey}`, summary: input.title });
        }
        return { engagementId: engagement.id, engagementKey: engagement.engagementKey, pipelineStage: engagement.pipelineStage, aiTaskId };
    }

    async sdkGenerateArtifact(authUserId: string, email: string, input: DfSdkGenerateArtifactInput, fullName?: string | null): Promise<DfSdkGenerateArtifactResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: `generate_${input.artifactType}`, moduleSource: "development_factory", inputPayload: { engagementId: input.engagementId, title: input.title, content: input.content } });
        if (input.artifactType === "work_package") {
            const created = await this.createWorkPackage(authUserId, email, { engagementId: input.engagementId, packageKey: input.title.replace(/\s+/g, "-").toLowerCase(), title: input.title, description: input.content }, fullName);
            return { artifactId: created.id, artifactType: "work_package", status: created.status };
        }
        if (input.artifactType === "api_scaffold") {
            const created = await this.createApiScaffold(authUserId, email, { engagementId: input.engagementId, scaffoldKey: input.title.replace(/\s+/g, "-").toLowerCase(), name: input.title, scaffoldSpec: input.content }, fullName);
            return { artifactId: created.id, artifactType: "api_scaffold", status: created.status };
        }
        if (input.artifactType === "component") {
            const created = await this.createComponent(authUserId, email, { engagementId: input.engagementId, componentKey: input.title.replace(/\s+/g, "-").toLowerCase(), name: input.title, specification: input.content }, fullName);
            return { artifactId: created.id, artifactType: "component", status: created.status };
        }
        const created = await this.createTechnicalDoc(authUserId, email, { engagementId: input.engagementId, docKey: input.title.replace(/\s+/g, "-").toLowerCase(), title: input.title, content: input.content }, fullName);
        return { artifactId: created.id, artifactType: "technical_doc", status: created.status };
    }

    async sdkRunAnalysis(authUserId: string, email: string, input: DfSdkRunAnalysisInput, fullName?: string | null): Promise<DfSdkRunAnalysisResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.analysisType, limit: 5 });
        await ai.executeTask({ taskType: `df_${input.analysisType}_analysis`, moduleSource: "development_factory", inputPayload: { engagementId: input.engagementId, ...input.inputPayload } });
        if (input.analysisType === "secure_coding") {
            const created = await this.createSecureCodingValidation(authUserId, email, { engagementId: input.engagementId, validationKey: String(input.inputPayload.validationKey ?? "SEC-AUTO"), name: String(input.inputPayload.name ?? "Secure Coding Validation"), checks: (input.inputPayload.checks as unknown[]) ?? [], findings: String(input.inputPayload.findings ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "secure_coding", status: created.status };
        }
        if (input.analysisType === "coding_standards") {
            const created = await this.createCodingStandard(authUserId, email, { engagementId: input.engagementId, standardKey: String(input.inputPayload.standardKey ?? "STD-AUTO"), name: String(input.inputPayload.name ?? "Coding Standard"), rules: (input.inputPayload.rules as unknown[]) ?? [] }, fullName);
            return { analysisId: created.id, analysisType: "coding_standards", status: created.status };
        }
        const created = await this.createModuleRecommendation(authUserId, email, { engagementId: input.engagementId, recommendationKey: String(input.inputPayload.recommendationKey ?? "MOD-AUTO"), moduleName: String(input.inputPayload.moduleName ?? "Module"), platformModule: String(input.inputPayload.platformModule ?? ""), rationale: String(input.inputPayload.rationale ?? "") }, fullName);
        return { analysisId: created.id, analysisType: "module_recommendation", status: created.status };
    }

    async getEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getBaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getSaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getSolutionArchitectureOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saSolutionArchitectures.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.title }));
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

export const developmentFactoryService = new DevelopmentFactoryService();
