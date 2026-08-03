"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildCsDashboardStats } from "@/src/modules/database/lib/customer-success-mappers";
import { customerSuccessService } from "@/src/modules/customer-success/services/customer-success.service";
import type {
    AdoptionTrackingSummary,
    AuditEntry,
    ChurnPredictionSummary,
    CommunicationPlanSummary,
    CreateAdoptionTrackingInput,
    CreateChurnPredictionInput,
    CreateCommunicationPlanInput,
    CreateEngagementInput,
    CreateExecutiveSummaryInput,
    CreateExpansionOpportunityInput,
    CreateFeedbackAnalysisInput,
    CreateHealthScoreInput,
    CreateLifecycleManagementInput,
    CreateOnboardingWorkflowInput,
    CreateQbrReportInput,
    CreateRenewalPlanInput,
    CreateRiskAnalysisInput,
    CreateSlaMonitoringInput,
    CreateSuccessKpiDashboardInput,
    CreateSuccessPlaybookInput,
    CreateSupportTrendAnalysisInput,
    CreateTrainingRecommendationInput,
    CsDashboardStats,
    CsPipelineInfo,
    EngagementSummary,
    ExecutiveSummarySummary,
    ExpansionOpportunitySummary,
    FeedbackAnalysisSummary,
    HealthScoreSummary,
    LifecycleManagementSummary,
    OnboardingWorkflowSummary,
    QbrReportSummary,
    RenewalPlanSummary,
    RiskAnalysisSummary,
    SlaMonitoringSummary,
    SuccessKpiDashboardSummary,
    SuccessPlaybookSummary,
    SupportTrendAnalysisSummary,
    TrainingRecommendationSummary,
} from "@/src/modules/customer-success/types";

export function useCustomerSuccess() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CsDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CsPipelineInfo | null>(null);
    const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
    const [onboardingWorkflows, setOnboardingWorkflows] = useState<OnboardingWorkflowSummary[]>([]);
    const [adoptionTracking, setAdoptionTracking] = useState<AdoptionTrackingSummary[]>([]);
    const [healthScores, setHealthScores] = useState<HealthScoreSummary[]>([]);
    const [renewalPlans, setRenewalPlans] = useState<RenewalPlanSummary[]>([]);
    const [expansionOpportunities, setExpansionOpportunities] = useState<ExpansionOpportunitySummary[]>([]);
    const [riskAnalyses, setRiskAnalyses] = useState<RiskAnalysisSummary[]>([]);
    const [supportTrendAnalyses, setSupportTrendAnalyses] = useState<SupportTrendAnalysisSummary[]>([]);
    const [successPlaybooks, setSuccessPlaybooks] = useState<SuccessPlaybookSummary[]>([]);
    const [qbrReports, setQbrReports] = useState<QbrReportSummary[]>([]);
    const [communicationPlans, setCommunicationPlans] = useState<CommunicationPlanSummary[]>([]);
    const [trainingRecommendations, setTrainingRecommendations] = useState<TrainingRecommendationSummary[]>([]);
    const [feedbackAnalyses, setFeedbackAnalyses] = useState<FeedbackAnalysisSummary[]>([]);
    const [slaMonitoring, setSlaMonitoring] = useState<SlaMonitoringSummary[]>([]);
    const [successKpiDashboards, setSuccessKpiDashboards] = useState<SuccessKpiDashboardSummary[]>([]);
    const [churnPredictions, setChurnPredictions] = useState<ChurnPredictionSummary[]>([]);
    const [lifecycleManagement, setLifecycleManagement] = useState<LifecycleManagementSummary[]>([]);
    const [executiveSummaries, setExecutiveSummaries] = useState<ExecutiveSummarySummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [engagementOptions, setEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [ddEngagementOptions, setDdEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [qaEngagementOptions, setQaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [baEngagementOptions, setBaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [saEngagementOptions, setSaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [dfEngagementOptions, setDfEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [qaReleaseReadinessOptions, setQaReleaseReadinessOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [ddReleaseVersionOptions, setDdReleaseVersionOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [solutionArchitectureOptions, setSolutionArchitectureOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [workPackageOptions, setWorkPackageOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [brdOptions, setBrdOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [frsOptions, setFrsOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [contactOptions, setContactOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [projectOptions, setProjectOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [
            pipelineInfo,
            engagementList,
            onboardingWorkflowList,
            adoptionTrackingList,
            healthScoreList,
            renewalPlanList,
            expansionOpportunityList,
            riskAnalysisList,
            supportTrendAnalysisList,
            successPlaybookList,
            qbrReportList,
            communicationPlanList,
            trainingRecommendationList,
            feedbackAnalysisList,
            slaMonitoringList,
            successKpiDashboardList,
            churnPredictionList,
            lifecycleManagementList,
            executiveSummaryList,
            auditList,
            engagements,
            ddEngagements,
            qaEngagements,
            baEngagements,
            saEngagements,
            dfEngagements,
            qaReleaseReadiness,
            ddReleaseVersions,
            solutionArchitectures,
            workPackages,
            brds,
            frsDocuments,
            clients,
            contacts,
            projects,
            agents,
            sessions,
        ] = await Promise.all([
            customerSuccessService.getPipelineInfo(),
            customerSuccessService.getEngagements(user.id, user.email, user.fullName),
            customerSuccessService.getOnboardingWorkflows(user.id, user.email, user.fullName),
            customerSuccessService.getAdoptionTracking(user.id, user.email, user.fullName),
            customerSuccessService.getHealthScores(user.id, user.email, user.fullName),
            customerSuccessService.getRenewalPlans(user.id, user.email, user.fullName),
            customerSuccessService.getExpansionOpportunities(user.id, user.email, user.fullName),
            customerSuccessService.getRiskAnalyses(user.id, user.email, user.fullName),
            customerSuccessService.getSupportTrendAnalyses(user.id, user.email, user.fullName),
            customerSuccessService.getSuccessPlaybooks(user.id, user.email, user.fullName),
            customerSuccessService.getQbrReports(user.id, user.email, user.fullName),
            customerSuccessService.getCommunicationPlans(user.id, user.email, user.fullName),
            customerSuccessService.getTrainingRecommendations(user.id, user.email, user.fullName),
            customerSuccessService.getFeedbackAnalyses(user.id, user.email, user.fullName),
            customerSuccessService.getSlaMonitoring(user.id, user.email, user.fullName),
            customerSuccessService.getSuccessKpiDashboards(user.id, user.email, user.fullName),
            customerSuccessService.getChurnPredictions(user.id, user.email, user.fullName),
            customerSuccessService.getLifecycleManagement(user.id, user.email, user.fullName),
            customerSuccessService.getExecutiveSummaries(user.id, user.email, user.fullName),
            customerSuccessService.getAuditLogs(user.id, user.email, user.fullName),
            customerSuccessService.getEngagementOptions(user.id, user.email, user.fullName),
            customerSuccessService.getDdEngagementOptions(user.id, user.email, user.fullName),
            customerSuccessService.getQaEngagementOptions(user.id, user.email, user.fullName),
            customerSuccessService.getBaEngagementOptions(user.id, user.email, user.fullName),
            customerSuccessService.getSaEngagementOptions(user.id, user.email, user.fullName),
            customerSuccessService.getDfEngagementOptions(user.id, user.email, user.fullName),
            customerSuccessService.getQaReleaseReadinessOptions(user.id, user.email, user.fullName),
            customerSuccessService.getDdReleaseVersionOptions(user.id, user.email, user.fullName),
            customerSuccessService.getSolutionArchitectureOptions(user.id, user.email, user.fullName),
            customerSuccessService.getWorkPackageOptions(user.id, user.email, user.fullName),
            customerSuccessService.getBrdOptions(user.id, user.email, user.fullName),
            customerSuccessService.getFrsOptions(user.id, user.email, user.fullName),
            customerSuccessService.getClientOptions(user.id, user.email, user.fullName),
            customerSuccessService.getContactOptions(user.id, user.email, user.fullName),
            customerSuccessService.getProjectOptions(user.id, user.email, user.fullName),
            customerSuccessService.getAgentOptions(user.id, user.email, user.fullName),
            customerSuccessService.getSessionOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildCsDashboardStats({
            engagements: engagementList,
            onboardingWorkflows: onboardingWorkflowList,
            adoptionTracking: adoptionTrackingList,
            healthScores: healthScoreList,
            renewalPlans: renewalPlanList,
            expansionOpportunities: expansionOpportunityList,
            riskAnalyses: riskAnalysisList,
            supportTrendAnalyses: supportTrendAnalysisList,
            successPlaybooks: successPlaybookList,
            qbrReports: qbrReportList,
            communicationPlans: communicationPlanList,
            trainingRecommendations: trainingRecommendationList,
            feedbackAnalyses: feedbackAnalysisList,
            slaMonitoring: slaMonitoringList,
            successKpiDashboards: successKpiDashboardList,
            churnPredictions: churnPredictionList,
            lifecycleManagement: lifecycleManagementList,
            executiveSummaries: executiveSummaryList,
        });
        return {
            empty: false as const,
            pipelineInfo,
            dashboardStats,
            engagementList,
            onboardingWorkflowList,
            adoptionTrackingList,
            healthScoreList,
            renewalPlanList,
            expansionOpportunityList,
            riskAnalysisList,
            supportTrendAnalysisList,
            successPlaybookList,
            qbrReportList,
            communicationPlanList,
            trainingRecommendationList,
            feedbackAnalysisList,
            slaMonitoringList,
            successKpiDashboardList,
            churnPredictionList,
            lifecycleManagementList,
            executiveSummaryList,
            auditList,
            engagements,
            ddEngagements,
            qaEngagements,
            baEngagements,
            saEngagements,
            dfEngagements,
            qaReleaseReadiness,
            ddReleaseVersions,
            solutionArchitectures,
            workPackages,
            brds,
            frsDocuments,
            clients,
            contacts,
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
        setOnboardingWorkflows(data.onboardingWorkflowList);
        setAdoptionTracking(data.adoptionTrackingList);
        setHealthScores(data.healthScoreList);
        setRenewalPlans(data.renewalPlanList);
        setExpansionOpportunities(data.expansionOpportunityList);
        setRiskAnalyses(data.riskAnalysisList);
        setSupportTrendAnalyses(data.supportTrendAnalysisList);
        setSuccessPlaybooks(data.successPlaybookList);
        setQbrReports(data.qbrReportList);
        setCommunicationPlans(data.communicationPlanList);
        setTrainingRecommendations(data.trainingRecommendationList);
        setFeedbackAnalyses(data.feedbackAnalysisList);
        setSlaMonitoring(data.slaMonitoringList);
        setSuccessKpiDashboards(data.successKpiDashboardList);
        setChurnPredictions(data.churnPredictionList);
        setLifecycleManagement(data.lifecycleManagementList);
        setExecutiveSummaries(data.executiveSummaryList);
        setAuditLogs(data.auditList);
        setEngagementOptions(data.engagements);
        setDdEngagementOptions(data.ddEngagements);
        setQaEngagementOptions(data.qaEngagements);
        setBaEngagementOptions(data.baEngagements);
        setSaEngagementOptions(data.saEngagements);
        setDfEngagementOptions(data.dfEngagements);
        setQaReleaseReadinessOptions(data.qaReleaseReadiness);
        setDdReleaseVersionOptions(data.ddReleaseVersions);
        setSolutionArchitectureOptions(data.solutionArchitectures);
        setWorkPackageOptions(data.workPackages);
        setBrdOptions(data.brds);
        setFrsOptions(data.frsDocuments);
        setClientOptions(data.clients);
        setContactOptions(data.contacts);
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

    const createEngagement = useCallback(async (input: CreateEngagementInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createEngagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOnboardingWorkflow = useCallback(async (input: CreateOnboardingWorkflowInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createOnboardingWorkflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdoptionTracking = useCallback(async (input: CreateAdoptionTrackingInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createAdoptionTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHealthScore = useCallback(async (input: CreateHealthScoreInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createHealthScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalPlan = useCallback(async (input: CreateRenewalPlanInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createRenewalPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExpansionOpportunity = useCallback(async (input: CreateExpansionOpportunityInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createExpansionOpportunity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskAnalysis = useCallback(async (input: CreateRiskAnalysisInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createRiskAnalysis(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSupportTrendAnalysis = useCallback(async (input: CreateSupportTrendAnalysisInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createSupportTrendAnalysis(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSuccessPlaybook = useCallback(async (input: CreateSuccessPlaybookInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createSuccessPlaybook(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createQbrReport = useCallback(async (input: CreateQbrReportInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createQbrReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommunicationPlan = useCallback(async (input: CreateCommunicationPlanInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createCommunicationPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTrainingRecommendation = useCallback(async (input: CreateTrainingRecommendationInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createTrainingRecommendation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeedbackAnalysis = useCallback(async (input: CreateFeedbackAnalysisInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createFeedbackAnalysis(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSlaMonitoring = useCallback(async (input: CreateSlaMonitoringInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createSlaMonitoring(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSuccessKpiDashboard = useCallback(async (input: CreateSuccessKpiDashboardInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createSuccessKpiDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createChurnPrediction = useCallback(async (input: CreateChurnPredictionInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createChurnPrediction(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLifecycleManagement = useCallback(async (input: CreateLifecycleManagementInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createLifecycleManagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveSummary = useCallback(async (input: CreateExecutiveSummaryInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessService.createExecutiveSummary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        engagements,
        onboardingWorkflows,
        adoptionTracking,
        healthScores,
        renewalPlans,
        expansionOpportunities,
        riskAnalyses,
        supportTrendAnalyses,
        successPlaybooks,
        qbrReports,
        communicationPlans,
        trainingRecommendations,
        feedbackAnalyses,
        slaMonitoring,
        successKpiDashboards,
        churnPredictions,
        lifecycleManagement,
        executiveSummaries,
        auditLogs,
        engagementOptions,
        ddEngagementOptions,
        qaEngagementOptions,
        baEngagementOptions,
        saEngagementOptions,
        dfEngagementOptions,
        qaReleaseReadinessOptions,
        ddReleaseVersionOptions,
        solutionArchitectureOptions,
        workPackageOptions,
        brdOptions,
        frsOptions,
        clientOptions,
        contactOptions,
        projectOptions,
        agentOptions,
        sessionOptions,
        createEngagement,
        createOnboardingWorkflow,
        createAdoptionTracking,
        createHealthScore,
        createRenewalPlan,
        createExpansionOpportunity,
        createRiskAnalysis,
        createSupportTrendAnalysis,
        createSuccessPlaybook,
        createQbrReport,
        createCommunicationPlan,
        createTrainingRecommendation,
        createFeedbackAnalysis,
        createSlaMonitoring,
        createSuccessKpiDashboard,
        createChurnPrediction,
        createLifecycleManagement,
        createExecutiveSummary,
        refresh,
    };
}
