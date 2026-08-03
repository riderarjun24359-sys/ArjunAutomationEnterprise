"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildBaDashboardStats } from "@/src/modules/database/lib/business-analyst-mappers";
import { businessAnalystService } from "@/src/modules/business-analyst/services/business-analyst.service";
import type {
    AcceptanceCriterionSummary,
    AuditEntry,
    BaDashboardStats,
    BaPipelineInfo,
    BrdSummary,
    CostEstimateSummary,
    CreateAcceptanceCriterionInput,
    CreateBrdInput,
    CreateCostEstimateInput,
    CreateEngagementInput,
    CreateFeaturePriorityInput,
    CreateFrsInput,
    CreateGapAnalysisInput,
    CreateInterviewInput,
    CreateProcessMapInput,
    CreateProposalInput,
    CreateReviewApprovalInput,
    CreateRiskInput,
    CreateScopeItemInput,
    CreateStakeholderInput,
    CreateTimelineEstimateInput,
    CreateUserStoryInput,
    CreateVersionInput,
    EngagementSummary,
    FeaturePrioritySummary,
    FrsSummary,
    GapAnalysisSummary,
    InterviewSummary,
    ProcessMapSummary,
    ProposalSummary,
    ReviewApprovalSummary,
    RiskSummary,
    ScopeItemSummary,
    StakeholderSummary,
    TimelineEstimateSummary,
    UserStorySummary,
    VersionSummary,
} from "@/src/modules/business-analyst/types";

export function useBusinessAnalyst() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<BaDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<BaPipelineInfo | null>(null);
    const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
    const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
    const [brds, setBrds] = useState<BrdSummary[]>([]);
    const [frsDocuments, setFrsDocuments] = useState<FrsSummary[]>([]);
    const [userStories, setUserStories] = useState<UserStorySummary[]>([]);
    const [acceptanceCriteria, setAcceptanceCriteria] = useState<AcceptanceCriterionSummary[]>([]);
    const [processMaps, setProcessMaps] = useState<ProcessMapSummary[]>([]);
    const [gapAnalyses, setGapAnalyses] = useState<GapAnalysisSummary[]>([]);
    const [featurePriorities, setFeaturePriorities] = useState<FeaturePrioritySummary[]>([]);
    const [risks, setRisks] = useState<RiskSummary[]>([]);
    const [stakeholders, setStakeholders] = useState<StakeholderSummary[]>([]);
    const [scopeItems, setScopeItems] = useState<ScopeItemSummary[]>([]);
    const [proposals, setProposals] = useState<ProposalSummary[]>([]);
    const [costEstimates, setCostEstimates] = useState<CostEstimateSummary[]>([]);
    const [timelineEstimates, setTimelineEstimates] = useState<TimelineEstimateSummary[]>([]);
    const [versions, setVersions] = useState<VersionSummary[]>([]);
    const [reviewApprovals, setReviewApprovals] = useState<ReviewApprovalSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [engagementOptions, setEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [projectOptions, setProjectOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [userStoryOptions, setUserStoryOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [employeeOptions, setEmployeeOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [pipelineInfo, engagementList, interviewList, brdList, frsList, storyList, criteriaList, mapList, gapList, priorityList, riskList, stakeholderList, scopeList, proposalList, costList, timelineList, versionList, approvalList, auditList, engagements, clients, projects, agents, sessions, stories, employees] = await Promise.all([
            businessAnalystService.getPipelineInfo(),
            businessAnalystService.getEngagements(user.id, user.email, user.fullName),
            businessAnalystService.getInterviews(user.id, user.email, user.fullName),
            businessAnalystService.getBrds(user.id, user.email, user.fullName),
            businessAnalystService.getFrsDocuments(user.id, user.email, user.fullName),
            businessAnalystService.getUserStories(user.id, user.email, user.fullName),
            businessAnalystService.getAcceptanceCriteria(user.id, user.email, user.fullName),
            businessAnalystService.getProcessMaps(user.id, user.email, user.fullName),
            businessAnalystService.getGapAnalyses(user.id, user.email, user.fullName),
            businessAnalystService.getFeaturePriorities(user.id, user.email, user.fullName),
            businessAnalystService.getRisks(user.id, user.email, user.fullName),
            businessAnalystService.getStakeholders(user.id, user.email, user.fullName),
            businessAnalystService.getScopeItems(user.id, user.email, user.fullName),
            businessAnalystService.getProposals(user.id, user.email, user.fullName),
            businessAnalystService.getCostEstimates(user.id, user.email, user.fullName),
            businessAnalystService.getTimelineEstimates(user.id, user.email, user.fullName),
            businessAnalystService.getVersions(user.id, user.email, user.fullName),
            businessAnalystService.getReviewApprovals(user.id, user.email, user.fullName),
            businessAnalystService.getAuditLogs(user.id, user.email, user.fullName),
            businessAnalystService.getEngagementOptions(user.id, user.email, user.fullName),
            businessAnalystService.getClientOptions(user.id, user.email, user.fullName),
            businessAnalystService.getProjectOptions(user.id, user.email, user.fullName),
            businessAnalystService.getAgentOptions(user.id, user.email, user.fullName),
            businessAnalystService.getSessionOptions(user.id, user.email, user.fullName),
            businessAnalystService.getUserStoryOptions(user.id, user.email, user.fullName),
            businessAnalystService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildBaDashboardStats({ engagements: engagementList, interviews: interviewList, brds: brdList, frsDocuments: frsList, userStories: storyList, acceptanceCriteria: criteriaList, processMaps: mapList, gapAnalyses: gapList, featurePriorities: priorityList, risks: riskList, stakeholders: stakeholderList, scopeItems: scopeList, proposals: proposalList, costEstimates: costList, timelineEstimates: timelineList, versions: versionList, approvals: approvalList });
        return { empty: false as const, pipelineInfo, dashboardStats, engagementList, interviewList, brdList, frsList, storyList, criteriaList, mapList, gapList, priorityList, riskList, stakeholderList, scopeList, proposalList, costList, timelineList, versionList, approvalList, auditList, engagements, clients, projects, agents, sessions, stories, employees };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setPipeline(data.pipelineInfo);
        setStats(data.dashboardStats);
        setEngagements(data.engagementList);
        setInterviews(data.interviewList);
        setBrds(data.brdList);
        setFrsDocuments(data.frsList);
        setUserStories(data.storyList);
        setAcceptanceCriteria(data.criteriaList);
        setProcessMaps(data.mapList);
        setGapAnalyses(data.gapList);
        setFeaturePriorities(data.priorityList);
        setRisks(data.riskList);
        setStakeholders(data.stakeholderList);
        setScopeItems(data.scopeList);
        setProposals(data.proposalList);
        setCostEstimates(data.costList);
        setTimelineEstimates(data.timelineList);
        setVersions(data.versionList);
        setReviewApprovals(data.approvalList);
        setAuditLogs(data.auditList);
        setEngagementOptions(data.engagements);
        setClientOptions(data.clients);
        setProjectOptions(data.projects);
        setAgentOptions(data.agents);
        setSessionOptions(data.sessions);
        setUserStoryOptions(data.stories);
        setEmployeeOptions(data.employees);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createEngagement = useCallback(async (input: CreateEngagementInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createEngagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInterview = useCallback(async (input: CreateInterviewInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createInterview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrd = useCallback(async (input: CreateBrdInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createBrd(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFrs = useCallback(async (input: CreateFrsInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createFrs(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUserStory = useCallback(async (input: CreateUserStoryInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createUserStory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAcceptanceCriterion = useCallback(async (input: CreateAcceptanceCriterionInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createAcceptanceCriterion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProcessMap = useCallback(async (input: CreateProcessMapInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createProcessMap(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGapAnalysis = useCallback(async (input: CreateGapAnalysisInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createGapAnalysis(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeaturePriority = useCallback(async (input: CreateFeaturePriorityInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createFeaturePriority(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRisk = useCallback(async (input: CreateRiskInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createRisk(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStakeholder = useCallback(async (input: CreateStakeholderInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createStakeholder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createScopeItem = useCallback(async (input: CreateScopeItemInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createScopeItem(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProposal = useCallback(async (input: CreateProposalInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createProposal(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCostEstimate = useCallback(async (input: CreateCostEstimateInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createCostEstimate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTimelineEstimate = useCallback(async (input: CreateTimelineEstimateInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createTimelineEstimate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVersion = useCallback(async (input: CreateVersionInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReviewApproval = useCallback(async (input: CreateReviewApprovalInput) => { if (!user) throw new Error("Authentication required"); await businessAnalystService.createReviewApproval(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading, stats, pipeline, engagements, interviews, brds, frsDocuments, userStories, acceptanceCriteria, processMaps, gapAnalyses, featurePriorities, risks, stakeholders, scopeItems, proposals, costEstimates, timelineEstimates, versions, reviewApprovals, auditLogs, engagementOptions, clientOptions, projectOptions, agentOptions, sessionOptions, userStoryOptions, employeeOptions,
        createEngagement, createInterview, createBrd, createFrs, createUserStory, createAcceptanceCriterion, createProcessMap, createGapAnalysis, createFeaturePriority, createRisk, createStakeholder, createScopeItem, createProposal, createCostEstimate, createTimelineEstimate, createVersion, createReviewApproval, refresh,
    };
}
