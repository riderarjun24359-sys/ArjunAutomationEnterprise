"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildSaDashboardStats } from "@/src/modules/database/lib/solution-architect-mappers";
import { solutionArchitectService } from "@/src/modules/solution-architect/services/solution-architect.service";
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

export function useSolutionArchitect() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SaDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<SaPipelineInfo | null>(null);
    const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
    const [solutionArchitectures, setSolutionArchitectures] = useState<SolutionArchitectureSummary[]>([]);
    const [systemDecompositions, setSystemDecompositions] = useState<SystemDecompositionSummary[]>([]);
    const [domainModels, setDomainModels] = useState<DomainModelSummary[]>([]);
    const [databaseSchemas, setDatabaseSchemas] = useState<DatabaseSchemaSummary[]>([]);
    const [apiContracts, setApiContracts] = useState<ApiContractSummary[]>([]);
    const [moduleSelections, setModuleSelections] = useState<ModuleSelectionSummary[]>([]);
    const [buildReuseRecommendations, setBuildReuseRecommendations] = useState<BuildReuseSummary[]>([]);
    const [integrationPlans, setIntegrationPlans] = useState<IntegrationPlanSummary[]>([]);
    const [securityArchitectures, setSecurityArchitectures] = useState<SecurityArchitectureSummary[]>([]);
    const [scalabilityPlans, setScalabilityPlans] = useState<ScalabilityPlanSummary[]>([]);
    const [performancePlans, setPerformancePlans] = useState<PerformancePlanSummary[]>([]);
    const [technologyDecisions, setTechnologyDecisions] = useState<TechnologyDecisionSummary[]>([]);
    const [deploymentArchitectures, setDeploymentArchitectures] = useState<DeploymentArchitectureSummary[]>([]);
    const [sprintPlans, setSprintPlans] = useState<SprintPlanSummary[]>([]);
    const [dependencyAnalyses, setDependencyAnalyses] = useState<DependencyAnalysisSummary[]>([]);
    const [architectureReviews, setArchitectureReviews] = useState<ArchitectureReviewSummary[]>([]);
    const [versions, setVersions] = useState<VersionSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [engagementOptions, setEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [baEngagementOptions, setBaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [brdOptions, setBrdOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [frsOptions, setFrsOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [projectOptions, setProjectOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [employeeOptions, setEmployeeOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [
            pipelineInfo,
            engagementList,
            architectureList,
            decompositionList,
            domainModelList,
            schemaList,
            contractList,
            moduleList,
            buildReuseList,
            integrationList,
            securityList,
            scalabilityList,
            performanceList,
            technologyList,
            deploymentList,
            sprintList,
            dependencyList,
            reviewList,
            versionList,
            auditList,
            engagements,
            baEngagements,
            brds,
            frsDocuments,
            clients,
            projects,
            agents,
            sessions,
            employees,
        ] = await Promise.all([
            solutionArchitectService.getPipelineInfo(),
            solutionArchitectService.getEngagements(user.id, user.email, user.fullName),
            solutionArchitectService.getSolutionArchitectures(user.id, user.email, user.fullName),
            solutionArchitectService.getSystemDecompositions(user.id, user.email, user.fullName),
            solutionArchitectService.getDomainModels(user.id, user.email, user.fullName),
            solutionArchitectService.getDatabaseSchemas(user.id, user.email, user.fullName),
            solutionArchitectService.getApiContracts(user.id, user.email, user.fullName),
            solutionArchitectService.getModuleSelections(user.id, user.email, user.fullName),
            solutionArchitectService.getBuildReuseRecommendations(user.id, user.email, user.fullName),
            solutionArchitectService.getIntegrationPlans(user.id, user.email, user.fullName),
            solutionArchitectService.getSecurityArchitectures(user.id, user.email, user.fullName),
            solutionArchitectService.getScalabilityPlans(user.id, user.email, user.fullName),
            solutionArchitectService.getPerformancePlans(user.id, user.email, user.fullName),
            solutionArchitectService.getTechnologyDecisions(user.id, user.email, user.fullName),
            solutionArchitectService.getDeploymentArchitectures(user.id, user.email, user.fullName),
            solutionArchitectService.getSprintPlans(user.id, user.email, user.fullName),
            solutionArchitectService.getDependencyAnalyses(user.id, user.email, user.fullName),
            solutionArchitectService.getArchitectureReviews(user.id, user.email, user.fullName),
            solutionArchitectService.getVersions(user.id, user.email, user.fullName),
            solutionArchitectService.getAuditLogs(user.id, user.email, user.fullName),
            solutionArchitectService.getEngagementOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getBaEngagementOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getBrdOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getFrsOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getClientOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getProjectOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getAgentOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getSessionOptions(user.id, user.email, user.fullName),
            solutionArchitectService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildSaDashboardStats({
            engagements: engagementList,
            solutionArchitectures: architectureList,
            systemDecompositions: decompositionList,
            domainModels: domainModelList,
            databaseSchemas: schemaList,
            apiContracts: contractList,
            moduleSelections: moduleList,
            buildReuseRecommendations: buildReuseList,
            integrationPlans: integrationList,
            securityArchitectures: securityList,
            scalabilityPlans: scalabilityList,
            performancePlans: performanceList,
            technologyDecisions: technologyList,
            deploymentArchitectures: deploymentList,
            sprintPlans: sprintList,
            dependencyAnalyses: dependencyList,
            architectureReviews: reviewList,
            versions: versionList,
        });
        return {
            empty: false as const,
            pipelineInfo,
            dashboardStats,
            engagementList,
            architectureList,
            decompositionList,
            domainModelList,
            schemaList,
            contractList,
            moduleList,
            buildReuseList,
            integrationList,
            securityList,
            scalabilityList,
            performanceList,
            technologyList,
            deploymentList,
            sprintList,
            dependencyList,
            reviewList,
            versionList,
            auditList,
            engagements,
            baEngagements,
            brds,
            frsDocuments,
            clients,
            projects,
            agents,
            sessions,
            employees,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setPipeline(data.pipelineInfo);
        setStats(data.dashboardStats);
        setEngagements(data.engagementList);
        setSolutionArchitectures(data.architectureList);
        setSystemDecompositions(data.decompositionList);
        setDomainModels(data.domainModelList);
        setDatabaseSchemas(data.schemaList);
        setApiContracts(data.contractList);
        setModuleSelections(data.moduleList);
        setBuildReuseRecommendations(data.buildReuseList);
        setIntegrationPlans(data.integrationList);
        setSecurityArchitectures(data.securityList);
        setScalabilityPlans(data.scalabilityList);
        setPerformancePlans(data.performanceList);
        setTechnologyDecisions(data.technologyList);
        setDeploymentArchitectures(data.deploymentList);
        setSprintPlans(data.sprintList);
        setDependencyAnalyses(data.dependencyList);
        setArchitectureReviews(data.reviewList);
        setVersions(data.versionList);
        setAuditLogs(data.auditList);
        setEngagementOptions(data.engagements);
        setBaEngagementOptions(data.baEngagements);
        setBrdOptions(data.brds);
        setFrsOptions(data.frsDocuments);
        setClientOptions(data.clients);
        setProjectOptions(data.projects);
        setAgentOptions(data.agents);
        setSessionOptions(data.sessions);
        setEmployeeOptions(data.employees);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createEngagement = useCallback(async (input: CreateEngagementInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createEngagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSolutionArchitecture = useCallback(async (input: CreateSolutionArchitectureInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createSolutionArchitecture(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSystemDecomposition = useCallback(async (input: CreateSystemDecompositionInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createSystemDecomposition(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDomainModel = useCallback(async (input: CreateDomainModelInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createDomainModel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDatabaseSchema = useCallback(async (input: CreateDatabaseSchemaInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createDatabaseSchema(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApiContract = useCallback(async (input: CreateApiContractInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createApiContract(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModuleSelection = useCallback(async (input: CreateModuleSelectionInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createModuleSelection(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBuildReuseRecommendation = useCallback(async (input: CreateBuildReuseInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createBuildReuseRecommendation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntegrationPlan = useCallback(async (input: CreateIntegrationPlanInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createIntegrationPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecurityArchitecture = useCallback(async (input: CreateSecurityArchitectureInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createSecurityArchitecture(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createScalabilityPlan = useCallback(async (input: CreateScalabilityPlanInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createScalabilityPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPerformancePlan = useCallback(async (input: CreatePerformancePlanInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createPerformancePlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTechnologyDecision = useCallback(async (input: CreateTechnologyDecisionInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createTechnologyDecision(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentArchitecture = useCallback(async (input: CreateDeploymentArchitectureInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createDeploymentArchitecture(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSprintPlan = useCallback(async (input: CreateSprintPlanInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createSprintPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDependencyAnalysis = useCallback(async (input: CreateDependencyAnalysisInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createDependencyAnalysis(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createArchitectureReview = useCallback(async (input: CreateArchitectureReviewInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createArchitectureReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVersion = useCallback(async (input: CreateVersionInput) => { if (!user) throw new Error("Authentication required"); await solutionArchitectService.createVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        engagements,
        solutionArchitectures,
        systemDecompositions,
        domainModels,
        databaseSchemas,
        apiContracts,
        moduleSelections,
        buildReuseRecommendations,
        integrationPlans,
        securityArchitectures,
        scalabilityPlans,
        performancePlans,
        technologyDecisions,
        deploymentArchitectures,
        sprintPlans,
        dependencyAnalyses,
        architectureReviews,
        versions,
        auditLogs,
        engagementOptions,
        baEngagementOptions,
        brdOptions,
        frsOptions,
        clientOptions,
        projectOptions,
        agentOptions,
        sessionOptions,
        employeeOptions,
        createEngagement,
        createSolutionArchitecture,
        createSystemDecomposition,
        createDomainModel,
        createDatabaseSchema,
        createApiContract,
        createModuleSelection,
        createBuildReuseRecommendation,
        createIntegrationPlan,
        createSecurityArchitecture,
        createScalabilityPlan,
        createPerformancePlan,
        createTechnologyDecision,
        createDeploymentArchitecture,
        createSprintPlan,
        createDependencyAnalysis,
        createArchitectureReview,
        createVersion,
        refresh,
    };
}
