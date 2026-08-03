"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildDfDashboardStats } from "@/src/modules/database/lib/development-factory-mappers";
import { developmentFactoryService } from "@/src/modules/development-factory/services/development-factory.service";
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

export function useDevelopmentFactory() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DfDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DfPipelineInfo | null>(null);
    const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
    const [workPackages, setWorkPackages] = useState<WorkPackageSummary[]>([]);
    const [backendWorkflows, setBackendWorkflows] = useState<BackendWorkflowSummary[]>([]);
    const [frontendWorkflows, setFrontendWorkflows] = useState<FrontendWorkflowSummary[]>([]);
    const [apiScaffolds, setApiScaffolds] = useState<ApiScaffoldSummary[]>([]);
    const [migrationPlans, setMigrationPlans] = useState<MigrationPlanSummary[]>([]);
    const [repositoryStructures, setRepositoryStructures] = useState<RepositoryStructureSummary[]>([]);
    const [components, setComponents] = useState<ComponentSummary[]>([]);
    const [testScaffolds, setTestScaffolds] = useState<TestScaffoldSummary[]>([]);
    const [codingStandards, setCodingStandards] = useState<CodingStandardSummary[]>([]);
    const [secureCodingValidations, setSecureCodingValidations] = useState<SecureCodingValidationSummary[]>([]);
    const [moduleRecommendations, setModuleRecommendations] = useState<ModuleRecommendationSummary[]>([]);
    const [pullRequests, setPullRequests] = useState<PullRequestSummary[]>([]);
    const [codeReviews, setCodeReviews] = useState<CodeReviewSummary[]>([]);
    const [technicalDocs, setTechnicalDocs] = useState<TechnicalDocSummary[]>([]);
    const [progressTracking, setProgressTracking] = useState<ProgressTrackingSummary[]>([]);
    const [buildArtifacts, setBuildArtifacts] = useState<BuildArtifactSummary[]>([]);
    const [versions, setVersions] = useState<VersionSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [engagementOptions, setEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [baEngagementOptions, setBaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [saEngagementOptions, setSaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [solutionArchitectureOptions, setSolutionArchitectureOptions] = useState<Array<{ id: string; name: string }>>([]);
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
            workPackageList,
            backendWorkflowList,
            frontendWorkflowList,
            apiScaffoldList,
            migrationPlanList,
            repositoryList,
            componentList,
            testScaffoldList,
            codingStandardList,
            secureCodingList,
            moduleRecommendationList,
            pullRequestList,
            codeReviewList,
            technicalDocList,
            progressList,
            buildArtifactList,
            versionList,
            auditList,
            engagements,
            baEngagements,
            saEngagements,
            solutionArchitectures,
            brds,
            frsDocuments,
            clients,
            projects,
            agents,
            sessions,
            employees,
        ] = await Promise.all([
            developmentFactoryService.getPipelineInfo(),
            developmentFactoryService.getEngagements(user.id, user.email, user.fullName),
            developmentFactoryService.getWorkPackages(user.id, user.email, user.fullName),
            developmentFactoryService.getBackendWorkflows(user.id, user.email, user.fullName),
            developmentFactoryService.getFrontendWorkflows(user.id, user.email, user.fullName),
            developmentFactoryService.getApiScaffolds(user.id, user.email, user.fullName),
            developmentFactoryService.getMigrationPlans(user.id, user.email, user.fullName),
            developmentFactoryService.getRepositoryStructures(user.id, user.email, user.fullName),
            developmentFactoryService.getComponents(user.id, user.email, user.fullName),
            developmentFactoryService.getTestScaffolds(user.id, user.email, user.fullName),
            developmentFactoryService.getCodingStandards(user.id, user.email, user.fullName),
            developmentFactoryService.getSecureCodingValidations(user.id, user.email, user.fullName),
            developmentFactoryService.getModuleRecommendations(user.id, user.email, user.fullName),
            developmentFactoryService.getPullRequests(user.id, user.email, user.fullName),
            developmentFactoryService.getCodeReviews(user.id, user.email, user.fullName),
            developmentFactoryService.getTechnicalDocs(user.id, user.email, user.fullName),
            developmentFactoryService.getProgressTracking(user.id, user.email, user.fullName),
            developmentFactoryService.getBuildArtifacts(user.id, user.email, user.fullName),
            developmentFactoryService.getVersions(user.id, user.email, user.fullName),
            developmentFactoryService.getAuditLogs(user.id, user.email, user.fullName),
            developmentFactoryService.getEngagementOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getBaEngagementOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getSaEngagementOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getSolutionArchitectureOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getBrdOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getFrsOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getClientOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getProjectOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getAgentOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getSessionOptions(user.id, user.email, user.fullName),
            developmentFactoryService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildDfDashboardStats({
            engagements: engagementList,
            workPackages: workPackageList,
            backendWorkflows: backendWorkflowList,
            frontendWorkflows: frontendWorkflowList,
            apiScaffolds: apiScaffoldList,
            migrationPlans: migrationPlanList,
            repositoryStructures: repositoryList,
            components: componentList,
            testScaffolds: testScaffoldList,
            codingStandards: codingStandardList,
            secureCodingValidations: secureCodingList,
            moduleRecommendations: moduleRecommendationList,
            pullRequests: pullRequestList,
            codeReviews: codeReviewList,
            technicalDocs: technicalDocList,
            progressTracking: progressList,
            buildArtifacts: buildArtifactList,
            versions: versionList,
        });
        return {
            empty: false as const,
            pipelineInfo,
            dashboardStats,
            engagementList,
            workPackageList,
            backendWorkflowList,
            frontendWorkflowList,
            apiScaffoldList,
            migrationPlanList,
            repositoryList,
            componentList,
            testScaffoldList,
            codingStandardList,
            secureCodingList,
            moduleRecommendationList,
            pullRequestList,
            codeReviewList,
            technicalDocList,
            progressList,
            buildArtifactList,
            versionList,
            auditList,
            engagements,
            baEngagements,
            saEngagements,
            solutionArchitectures,
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
        setWorkPackages(data.workPackageList);
        setBackendWorkflows(data.backendWorkflowList);
        setFrontendWorkflows(data.frontendWorkflowList);
        setApiScaffolds(data.apiScaffoldList);
        setMigrationPlans(data.migrationPlanList);
        setRepositoryStructures(data.repositoryList);
        setComponents(data.componentList);
        setTestScaffolds(data.testScaffoldList);
        setCodingStandards(data.codingStandardList);
        setSecureCodingValidations(data.secureCodingList);
        setModuleRecommendations(data.moduleRecommendationList);
        setPullRequests(data.pullRequestList);
        setCodeReviews(data.codeReviewList);
        setTechnicalDocs(data.technicalDocList);
        setProgressTracking(data.progressList);
        setBuildArtifacts(data.buildArtifactList);
        setVersions(data.versionList);
        setAuditLogs(data.auditList);
        setEngagementOptions(data.engagements);
        setBaEngagementOptions(data.baEngagements);
        setSaEngagementOptions(data.saEngagements);
        setSolutionArchitectureOptions(data.solutionArchitectures);
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

    const createEngagement = useCallback(async (input: CreateEngagementInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createEngagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkPackage = useCallback(async (input: CreateWorkPackageInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createWorkPackage(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBackendWorkflow = useCallback(async (input: CreateBackendWorkflowInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createBackendWorkflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFrontendWorkflow = useCallback(async (input: CreateFrontendWorkflowInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createFrontendWorkflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApiScaffold = useCallback(async (input: CreateApiScaffoldInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createApiScaffold(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMigrationPlan = useCallback(async (input: CreateMigrationPlanInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createMigrationPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRepositoryStructure = useCallback(async (input: CreateRepositoryStructureInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createRepositoryStructure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComponent = useCallback(async (input: CreateComponentInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createComponent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTestScaffold = useCallback(async (input: CreateTestScaffoldInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createTestScaffold(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCodingStandard = useCallback(async (input: CreateCodingStandardInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createCodingStandard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecureCodingValidation = useCallback(async (input: CreateSecureCodingValidationInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createSecureCodingValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModuleRecommendation = useCallback(async (input: CreateModuleRecommendationInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createModuleRecommendation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPullRequest = useCallback(async (input: CreatePullRequestInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createPullRequest(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCodeReview = useCallback(async (input: CreateCodeReviewInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createCodeReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTechnicalDoc = useCallback(async (input: CreateTechnicalDocInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createTechnicalDoc(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProgressTracking = useCallback(async (input: CreateProgressTrackingInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createProgressTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBuildArtifact = useCallback(async (input: CreateBuildArtifactInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createBuildArtifact(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVersion = useCallback(async (input: CreateVersionInput) => { if (!user) throw new Error("Authentication required"); await developmentFactoryService.createVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        engagements,
        workPackages,
        backendWorkflows,
        frontendWorkflows,
        apiScaffolds,
        migrationPlans,
        repositoryStructures,
        components,
        testScaffolds,
        codingStandards,
        secureCodingValidations,
        moduleRecommendations,
        pullRequests,
        codeReviews,
        technicalDocs,
        progressTracking,
        buildArtifacts,
        versions,
        auditLogs,
        engagementOptions,
        baEngagementOptions,
        saEngagementOptions,
        solutionArchitectureOptions,
        brdOptions,
        frsOptions,
        clientOptions,
        projectOptions,
        agentOptions,
        sessionOptions,
        employeeOptions,
        createEngagement,
        createWorkPackage,
        createBackendWorkflow,
        createFrontendWorkflow,
        createApiScaffold,
        createMigrationPlan,
        createRepositoryStructure,
        createComponent,
        createTestScaffold,
        createCodingStandard,
        createSecureCodingValidation,
        createModuleRecommendation,
        createPullRequest,
        createCodeReview,
        createTechnicalDoc,
        createProgressTracking,
        createBuildArtifact,
        createVersion,
        refresh,
    };
}
