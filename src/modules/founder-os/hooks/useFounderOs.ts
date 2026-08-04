"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildFoDashboardStats } from "@/src/modules/database/lib/founder-os-mappers";
import { founderOsService } from "@/src/modules/founder-os/services/founder-os.service";
import type {
    AuditEntry,
    BoardReportSummary,
    CapitalPlanSummary,
    CompanyMilestoneSummary,
    CreateBoardReportInput,
    CreateCapitalPlanInput,
    CreateCompanyMilestoneInput,
    CreateDecisionLogInput,
    CreateExecutiveDashboardInput,
    CreateFounderAgendaInput,
    CreateFounderInsightInput,
    CreateGrowthMetricInput,
    CreateInvestorRelationInput,
    CreatePriorityInput,
    CreateProductRoadmapInput,
    CreateResourceAllocationInput,
    CreateRevenueRunwayInput,
    CreateRiskRegisterInput,
    CreateStakeholderInput,
    CreateStrategicOkrInput,
    CreateTeamCapacityInput,
    CreateWorkspaceInput,
    DecisionLogSummary,
    ExecutiveDashboardSummary,
    FoDashboardStats,
    FoPhase3Stats,
    FoPipelineInfo,
    FounderAgendaSummary,
    FounderInsightSummary,
    GrowthMetricSummary,
    InvestorRelationSummary,
    PrioritySummary,
    ProductRoadmapSummary,
    ResourceAllocationSummary,
    RevenueRunwaySummary,
    RiskRegisterSummary,
    StakeholderSummary,
    StrategicOkrSummary,
    TeamCapacitySummary,
    WorkspaceSummary,
} from "@/src/modules/founder-os/types";

export function useFounderOs() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<FoDashboardStats | null>(null);
    const [phase3Stats, setPhase3Stats] = useState<FoPhase3Stats | null>(null);
    const [pipeline, setPipeline] = useState<FoPipelineInfo | null>(null);
    const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
    const [strategicOkrs, setStrategicOkrs] = useState<StrategicOkrSummary[]>([]);
    const [executiveDashboards, setExecutiveDashboards] = useState<ExecutiveDashboardSummary[]>([]);
    const [revenueRunway, setRevenueRunway] = useState<RevenueRunwaySummary[]>([]);
    const [teamCapacity, setTeamCapacity] = useState<TeamCapacitySummary[]>([]);
    const [productRoadmaps, setProductRoadmaps] = useState<ProductRoadmapSummary[]>([]);
    const [investorRelations, setInvestorRelations] = useState<InvestorRelationSummary[]>([]);
    const [boardReports, setBoardReports] = useState<BoardReportSummary[]>([]);
    const [decisionLog, setDecisionLog] = useState<DecisionLogSummary[]>([]);
    const [priorities, setPriorities] = useState<PrioritySummary[]>([]);
    const [resourceAllocations, setResourceAllocations] = useState<ResourceAllocationSummary[]>([]);
    const [riskRegister, setRiskRegister] = useState<RiskRegisterSummary[]>([]);
    const [growthMetrics, setGrowthMetrics] = useState<GrowthMetricSummary[]>([]);
    const [founderAgenda, setFounderAgenda] = useState<FounderAgendaSummary[]>([]);
    const [stakeholders, setStakeholders] = useState<StakeholderSummary[]>([]);
    const [capitalPlans, setCapitalPlans] = useState<CapitalPlanSummary[]>([]);
    const [companyMilestones, setCompanyMilestones] = useState<CompanyMilestoneSummary[]>([]);
    const [founderInsights, setFounderInsights] = useState<FounderInsightSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [workspaceOptions, setWorkspaceOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [baEngagementOptions, setBaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [saEngagementOptions, setSaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [dfEngagementOptions, setDfEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [qaEngagementOptions, setQaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [ddEngagementOptions, setDdEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [csEngagementOptions, setCsEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [projectOptions, setProjectOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [
            pipelineInfo,
            workspaceList,
            strategicOkrList,
            executiveDashboardList,
            revenueRunwayList,
            teamCapacityList,
            productRoadmapList,
            investorRelationList,
            boardReportList,
            decisionLogList,
            priorityList,
            resourceAllocationList,
            riskRegisterList,
            growthMetricList,
            founderAgendaList,
            stakeholderList,
            capitalPlanList,
            companyMilestoneList,
            founderInsightList,
            auditList,
            workspaceOpts,
            baEngagements,
            saEngagements,
            dfEngagements,
            qaEngagements,
            ddEngagements,
            csEngagements,
            clients,
            projects,
            agents,
            sessions,
            phase3Stats,
        ] = await Promise.all([
            founderOsService.getPipelineInfo(),
            founderOsService.getWorkspaces(user.id, user.email, user.fullName),
            founderOsService.getStrategicOkrs(user.id, user.email, user.fullName),
            founderOsService.getExecutiveDashboards(user.id, user.email, user.fullName),
            founderOsService.getRevenueRunway(user.id, user.email, user.fullName),
            founderOsService.getTeamCapacity(user.id, user.email, user.fullName),
            founderOsService.getProductRoadmaps(user.id, user.email, user.fullName),
            founderOsService.getInvestorRelations(user.id, user.email, user.fullName),
            founderOsService.getBoardReports(user.id, user.email, user.fullName),
            founderOsService.getDecisionLog(user.id, user.email, user.fullName),
            founderOsService.getPriorities(user.id, user.email, user.fullName),
            founderOsService.getResourceAllocations(user.id, user.email, user.fullName),
            founderOsService.getRiskRegister(user.id, user.email, user.fullName),
            founderOsService.getGrowthMetrics(user.id, user.email, user.fullName),
            founderOsService.getFounderAgenda(user.id, user.email, user.fullName),
            founderOsService.getStakeholders(user.id, user.email, user.fullName),
            founderOsService.getCapitalPlans(user.id, user.email, user.fullName),
            founderOsService.getCompanyMilestones(user.id, user.email, user.fullName),
            founderOsService.getFounderInsights(user.id, user.email, user.fullName),
            founderOsService.getAuditLogs(user.id, user.email, user.fullName),
            founderOsService.getWorkspaceOptions(user.id, user.email, user.fullName),
            founderOsService.getBaEngagementOptions(user.id, user.email, user.fullName),
            founderOsService.getSaEngagementOptions(user.id, user.email, user.fullName),
            founderOsService.getDfEngagementOptions(user.id, user.email, user.fullName),
            founderOsService.getQaEngagementOptions(user.id, user.email, user.fullName),
            founderOsService.getDdEngagementOptions(user.id, user.email, user.fullName),
            founderOsService.getCsEngagementOptions(user.id, user.email, user.fullName),
            founderOsService.getClientOptions(user.id, user.email, user.fullName),
            founderOsService.getProjectOptions(user.id, user.email, user.fullName),
            founderOsService.getAgentOptions(user.id, user.email, user.fullName),
            founderOsService.getSessionOptions(user.id, user.email, user.fullName),
            founderOsService.getPhase3Stats(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildFoDashboardStats({
            workspaces: workspaceList,
            strategicOkrs: strategicOkrList,
            executiveDashboards: executiveDashboardList,
            revenueRunway: revenueRunwayList,
            teamCapacity: teamCapacityList,
            productRoadmaps: productRoadmapList,
            investorRelations: investorRelationList,
            boardReports: boardReportList,
            decisionLog: decisionLogList,
            priorities: priorityList,
            resourceAllocations: resourceAllocationList,
            riskRegister: riskRegisterList,
            growthMetrics: growthMetricList,
            founderAgenda: founderAgendaList,
            stakeholders: stakeholderList,
            capitalPlans: capitalPlanList,
            companyMilestones: companyMilestoneList,
            founderInsights: founderInsightList,
        });
        return {
            empty: false as const,
            pipelineInfo,
            dashboardStats,
            workspaceList,
            strategicOkrList,
            executiveDashboardList,
            revenueRunwayList,
            teamCapacityList,
            productRoadmapList,
            investorRelationList,
            boardReportList,
            decisionLogList,
            priorityList,
            resourceAllocationList,
            riskRegisterList,
            growthMetricList,
            founderAgendaList,
            stakeholderList,
            capitalPlanList,
            companyMilestoneList,
            founderInsightList,
            auditList,
            workspaceOpts,
            baEngagements,
            saEngagements,
            dfEngagements,
            qaEngagements,
            ddEngagements,
            csEngagements,
            clients,
            projects,
            agents,
            sessions,
            phase3Stats,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setPipeline(data.pipelineInfo);
        setStats(data.dashboardStats);
        setPhase3Stats(data.phase3Stats);
        setWorkspaces(data.workspaceList);
        setStrategicOkrs(data.strategicOkrList);
        setExecutiveDashboards(data.executiveDashboardList);
        setRevenueRunway(data.revenueRunwayList);
        setTeamCapacity(data.teamCapacityList);
        setProductRoadmaps(data.productRoadmapList);
        setInvestorRelations(data.investorRelationList);
        setBoardReports(data.boardReportList);
        setDecisionLog(data.decisionLogList);
        setPriorities(data.priorityList);
        setResourceAllocations(data.resourceAllocationList);
        setRiskRegister(data.riskRegisterList);
        setGrowthMetrics(data.growthMetricList);
        setFounderAgenda(data.founderAgendaList);
        setStakeholders(data.stakeholderList);
        setCapitalPlans(data.capitalPlanList);
        setCompanyMilestones(data.companyMilestoneList);
        setFounderInsights(data.founderInsightList);
        setAuditLogs(data.auditList);
        setWorkspaceOptions(data.workspaceOpts);
        setBaEngagementOptions(data.baEngagements);
        setSaEngagementOptions(data.saEngagements);
        setDfEngagementOptions(data.dfEngagements);
        setQaEngagementOptions(data.qaEngagements);
        setDdEngagementOptions(data.ddEngagements);
        setCsEngagementOptions(data.csEngagements);
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

    const createWorkspace = useCallback(async (input: CreateWorkspaceInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createWorkspace(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStrategicOkr = useCallback(async (input: CreateStrategicOkrInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createStrategicOkr(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveDashboard = useCallback(async (input: CreateExecutiveDashboardInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createExecutiveDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueRunway = useCallback(async (input: CreateRevenueRunwayInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createRevenueRunway(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTeamCapacity = useCallback(async (input: CreateTeamCapacityInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createTeamCapacity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProductRoadmap = useCallback(async (input: CreateProductRoadmapInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createProductRoadmap(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInvestorRelation = useCallback(async (input: CreateInvestorRelationInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createInvestorRelation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBoardReport = useCallback(async (input: CreateBoardReportInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createBoardReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDecisionLog = useCallback(async (input: CreateDecisionLogInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createDecisionLog(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPriority = useCallback(async (input: CreatePriorityInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createPriority(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createResourceAllocation = useCallback(async (input: CreateResourceAllocationInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createResourceAllocation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskRegister = useCallback(async (input: CreateRiskRegisterInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createRiskRegister(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGrowthMetric = useCallback(async (input: CreateGrowthMetricInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createGrowthMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFounderAgenda = useCallback(async (input: CreateFounderAgendaInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createFounderAgenda(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStakeholder = useCallback(async (input: CreateStakeholderInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createStakeholder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCapitalPlan = useCallback(async (input: CreateCapitalPlanInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createCapitalPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCompanyMilestone = useCallback(async (input: CreateCompanyMilestoneInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createCompanyMilestone(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFounderInsight = useCallback(async (input: CreateFounderInsightInput) => { if (!user) throw new Error("Authentication required"); await founderOsService.createFounderInsight(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        phase3Stats,
        pipeline,
        workspaces,
        strategicOkrs,
        executiveDashboards,
        revenueRunway,
        teamCapacity,
        productRoadmaps,
        investorRelations,
        boardReports,
        decisionLog,
        priorities,
        resourceAllocations,
        riskRegister,
        growthMetrics,
        founderAgenda,
        stakeholders,
        capitalPlans,
        companyMilestones,
        founderInsights,
        auditLogs,
        workspaceOptions,
        baEngagementOptions,
        saEngagementOptions,
        dfEngagementOptions,
        qaEngagementOptions,
        ddEngagementOptions,
        csEngagementOptions,
        clientOptions,
        projectOptions,
        agentOptions,
        sessionOptions,
        createWorkspace,
        createStrategicOkr,
        createExecutiveDashboard,
        createRevenueRunway,
        createTeamCapacity,
        createProductRoadmap,
        createInvestorRelation,
        createBoardReport,
        createDecisionLog,
        createPriority,
        createResourceAllocation,
        createRiskRegister,
        createGrowthMetric,
        createFounderAgenda,
        createStakeholder,
        createCapitalPlan,
        createCompanyMilestone,
        createFounderInsight,
        refresh,
    };
}
