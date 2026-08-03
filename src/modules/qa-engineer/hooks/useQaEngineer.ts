"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildQaDashboardStats } from "@/src/modules/database/lib/qa-engineer-mappers";
import { qaEngineerService } from "@/src/modules/qa-engineer/services/qa-engineer.service";
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

export function useQaEngineer() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<QaDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<QaPipelineInfo | null>(null);
    const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
    const [testStrategies, setTestStrategies] = useState<TestStrategySummary[]>([]);
    const [unitTestPlans, setUnitTestPlans] = useState<UnitTestPlanSummary[]>([]);
    const [integrationTestPlans, setIntegrationTestPlans] = useState<IntegrationTestPlanSummary[]>([]);
    const [e2eTestPlans, setE2eTestPlans] = useState<E2eTestPlanSummary[]>([]);
    const [regressionAnalyses, setRegressionAnalyses] = useState<RegressionAnalysisSummary[]>([]);
    const [riskBasedTests, setRiskBasedTests] = useState<RiskBasedTestSummary[]>([]);
    const [securityValidations, setSecurityValidations] = useState<SecurityValidationSummary[]>([]);
    const [performanceValidations, setPerformanceValidations] = useState<PerformanceValidationSummary[]>([]);
    const [accessibilityValidations, setAccessibilityValidations] = useState<AccessibilityValidationSummary[]>([]);
    const [apiValidations, setApiValidations] = useState<ApiValidationSummary[]>([]);
    const [databaseValidations, setDatabaseValidations] = useState<DatabaseValidationSummary[]>([]);
    const [uiValidations, setUiValidations] = useState<UiValidationSummary[]>([]);
    const [bugTriages, setBugTriages] = useState<BugTriageSummary[]>([]);
    const [defectAnalyses, setDefectAnalyses] = useState<DefectAnalysisSummary[]>([]);
    const [coverageAnalytics, setCoverageAnalytics] = useState<CoverageAnalyticsSummary[]>([]);
    const [releaseReadiness, setReleaseReadiness] = useState<ReleaseReadinessSummary[]>([]);
    const [qualityScores, setQualityScores] = useState<QualityScoreSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [engagementOptions, setEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [baEngagementOptions, setBaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [saEngagementOptions, setSaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [dfEngagementOptions, setDfEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [solutionArchitectureOptions, setSolutionArchitectureOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [workPackageOptions, setWorkPackageOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [brdOptions, setBrdOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [frsOptions, setFrsOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [projectOptions, setProjectOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [
            pipelineInfo,
            engagementList,
            testStrategyList,
            unitTestPlanList,
            integrationTestPlanList,
            e2eTestPlanList,
            regressionList,
            riskBasedList,
            securityList,
            performanceList,
            accessibilityList,
            apiList,
            databaseList,
            uiList,
            bugList,
            defectList,
            coverageList,
            releaseList,
            qualityList,
            auditList,
            engagements,
            baEngagements,
            saEngagements,
            dfEngagements,
            solutionArchitectures,
            workPackages,
            brds,
            frsDocuments,
            clients,
            projects,
            agents,
            sessions,
        ] = await Promise.all([
            qaEngineerService.getPipelineInfo(),
            qaEngineerService.getEngagements(user.id, user.email, user.fullName),
            qaEngineerService.getTestStrategies(user.id, user.email, user.fullName),
            qaEngineerService.getUnitTestPlans(user.id, user.email, user.fullName),
            qaEngineerService.getIntegrationTestPlans(user.id, user.email, user.fullName),
            qaEngineerService.getE2eTestPlans(user.id, user.email, user.fullName),
            qaEngineerService.getRegressionAnalyses(user.id, user.email, user.fullName),
            qaEngineerService.getRiskBasedTests(user.id, user.email, user.fullName),
            qaEngineerService.getSecurityValidations(user.id, user.email, user.fullName),
            qaEngineerService.getPerformanceValidations(user.id, user.email, user.fullName),
            qaEngineerService.getAccessibilityValidations(user.id, user.email, user.fullName),
            qaEngineerService.getApiValidations(user.id, user.email, user.fullName),
            qaEngineerService.getDatabaseValidations(user.id, user.email, user.fullName),
            qaEngineerService.getUiValidations(user.id, user.email, user.fullName),
            qaEngineerService.getBugTriages(user.id, user.email, user.fullName),
            qaEngineerService.getDefectAnalyses(user.id, user.email, user.fullName),
            qaEngineerService.getCoverageAnalytics(user.id, user.email, user.fullName),
            qaEngineerService.getReleaseReadiness(user.id, user.email, user.fullName),
            qaEngineerService.getQualityScores(user.id, user.email, user.fullName),
            qaEngineerService.getAuditLogs(user.id, user.email, user.fullName),
            qaEngineerService.getEngagementOptions(user.id, user.email, user.fullName),
            qaEngineerService.getBaEngagementOptions(user.id, user.email, user.fullName),
            qaEngineerService.getSaEngagementOptions(user.id, user.email, user.fullName),
            qaEngineerService.getDfEngagementOptions(user.id, user.email, user.fullName),
            qaEngineerService.getSolutionArchitectureOptions(user.id, user.email, user.fullName),
            qaEngineerService.getWorkPackageOptions(user.id, user.email, user.fullName),
            qaEngineerService.getBrdOptions(user.id, user.email, user.fullName),
            qaEngineerService.getFrsOptions(user.id, user.email, user.fullName),
            qaEngineerService.getClientOptions(user.id, user.email, user.fullName),
            qaEngineerService.getProjectOptions(user.id, user.email, user.fullName),
            qaEngineerService.getAgentOptions(user.id, user.email, user.fullName),
            qaEngineerService.getSessionOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildQaDashboardStats({
            engagements: engagementList,
            testStrategies: testStrategyList,
            unitTestPlans: unitTestPlanList,
            integrationTestPlans: integrationTestPlanList,
            e2eTestPlans: e2eTestPlanList,
            regressionAnalyses: regressionList,
            riskBasedTests: riskBasedList,
            securityValidations: securityList,
            performanceValidations: performanceList,
            accessibilityValidations: accessibilityList,
            apiValidations: apiList,
            databaseValidations: databaseList,
            uiValidations: uiList,
            bugTriages: bugList,
            defectAnalyses: defectList,
            coverageAnalytics: coverageList,
            releaseReadiness: releaseList,
            qualityScores: qualityList,
        });
        return {
            empty: false as const,
            pipelineInfo,
            dashboardStats,
            engagementList,
            testStrategyList,
            unitTestPlanList,
            integrationTestPlanList,
            e2eTestPlanList,
            regressionList,
            riskBasedList,
            securityList,
            performanceList,
            accessibilityList,
            apiList,
            databaseList,
            uiList,
            bugList,
            defectList,
            coverageList,
            releaseList,
            qualityList,
            auditList,
            engagements,
            baEngagements,
            saEngagements,
            dfEngagements,
            solutionArchitectures,
            workPackages,
            brds,
            frsDocuments,
            clients,
            projects,
            agents,
            sessions,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setPipeline(data.pipelineInfo);
        setStats(data.dashboardStats);
        setEngagements(data.engagementList);
        setTestStrategies(data.testStrategyList);
        setUnitTestPlans(data.unitTestPlanList);
        setIntegrationTestPlans(data.integrationTestPlanList);
        setE2eTestPlans(data.e2eTestPlanList);
        setRegressionAnalyses(data.regressionList);
        setRiskBasedTests(data.riskBasedList);
        setSecurityValidations(data.securityList);
        setPerformanceValidations(data.performanceList);
        setAccessibilityValidations(data.accessibilityList);
        setApiValidations(data.apiList);
        setDatabaseValidations(data.databaseList);
        setUiValidations(data.uiList);
        setBugTriages(data.bugList);
        setDefectAnalyses(data.defectList);
        setCoverageAnalytics(data.coverageList);
        setReleaseReadiness(data.releaseList);
        setQualityScores(data.qualityList);
        setAuditLogs(data.auditList);
        setEngagementOptions(data.engagements);
        setBaEngagementOptions(data.baEngagements);
        setSaEngagementOptions(data.saEngagements);
        setDfEngagementOptions(data.dfEngagements);
        setSolutionArchitectureOptions(data.solutionArchitectures);
        setWorkPackageOptions(data.workPackages);
        setBrdOptions(data.brds);
        setFrsOptions(data.frsDocuments);
        setClientOptions(data.clients);
        setProjectOptions(data.projects);
        setAgentOptions(data.agents);
        setSessionOptions(data.sessions);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createEngagement = useCallback(async (input: CreateEngagementInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createEngagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTestStrategy = useCallback(async (input: CreateTestStrategyInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createTestStrategy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUnitTestPlan = useCallback(async (input: CreateUnitTestPlanInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createUnitTestPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntegrationTestPlan = useCallback(async (input: CreateIntegrationTestPlanInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createIntegrationTestPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createE2eTestPlan = useCallback(async (input: CreateE2eTestPlanInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createE2eTestPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRegressionAnalysis = useCallback(async (input: CreateRegressionAnalysisInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createRegressionAnalysis(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskBasedTest = useCallback(async (input: CreateRiskBasedTestInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createRiskBasedTest(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecurityValidation = useCallback(async (input: CreateSecurityValidationInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createSecurityValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPerformanceValidation = useCallback(async (input: CreatePerformanceValidationInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createPerformanceValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAccessibilityValidation = useCallback(async (input: CreateAccessibilityValidationInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createAccessibilityValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApiValidation = useCallback(async (input: CreateApiValidationInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createApiValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDatabaseValidation = useCallback(async (input: CreateDatabaseValidationInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createDatabaseValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUiValidation = useCallback(async (input: CreateUiValidationInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createUiValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBugTriage = useCallback(async (input: CreateBugTriageInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createBugTriage(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDefectAnalysis = useCallback(async (input: CreateDefectAnalysisInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createDefectAnalysis(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCoverageAnalytics = useCallback(async (input: CreateCoverageAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createCoverageAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReleaseReadiness = useCallback(async (input: CreateReleaseReadinessInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createReleaseReadiness(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createQualityScore = useCallback(async (input: CreateQualityScoreInput) => { if (!user) throw new Error("Authentication required"); await qaEngineerService.createQualityScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        engagements,
        testStrategies,
        unitTestPlans,
        integrationTestPlans,
        e2eTestPlans,
        regressionAnalyses,
        riskBasedTests,
        securityValidations,
        performanceValidations,
        accessibilityValidations,
        apiValidations,
        databaseValidations,
        uiValidations,
        bugTriages,
        defectAnalyses,
        coverageAnalytics,
        releaseReadiness,
        qualityScores,
        auditLogs,
        engagementOptions,
        baEngagementOptions,
        saEngagementOptions,
        dfEngagementOptions,
        solutionArchitectureOptions,
        workPackageOptions,
        brdOptions,
        frsOptions,
        clientOptions,
        projectOptions,
        agentOptions,
        sessionOptions,
        createEngagement,
        createTestStrategy,
        createUnitTestPlan,
        createIntegrationTestPlan,
        createE2eTestPlan,
        createRegressionAnalysis,
        createRiskBasedTest,
        createSecurityValidation,
        createPerformanceValidation,
        createAccessibilityValidation,
        createApiValidation,
        createDatabaseValidation,
        createUiValidation,
        createBugTriage,
        createDefectAnalysis,
        createCoverageAnalytics,
        createReleaseReadiness,
        createQualityScore,
        refresh,
    };
}
