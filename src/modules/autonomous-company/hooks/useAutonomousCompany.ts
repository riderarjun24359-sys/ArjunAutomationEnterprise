"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildAcDashboardStats } from "@/src/modules/database/lib/autonomous-company-mappers";
import { autonomousCompanyService } from "@/src/modules/autonomous-company/services/autonomous-company.service";
import type {
    AcDashboardStats,
    AcPipelineInfo,
    ActivityFeedSummary,
    ApprovalWorkflowSummary,
    AuditEntry,
    AutomationSummary,
    BusinessKpiSummary,
    CommandPaletteSummary,
    CompanyContextSummary,
    ComplianceDashboardSummary,
    CreateActivityFeedInput,
    CreateApprovalWorkflowInput,
    CreateAutomationInput,
    CreateBusinessKpiInput,
    CreateCommandPaletteInput,
    CreateCompanyContextInput,
    CreateComplianceDashboardInput,
    CreateEmergencyWorkflowInput,
    CreateEventBusInput,
    CreateExecutiveInsightInput,
    CreateNotificationInput,
    CreateOperationalHealthInput,
    CreatePredictiveRecommendationInput,
    CreateSecurityGovernanceInput,
    CreateSystemSearchInput,
    CreateTimelineInput,
    CreateWorkerCollaborationInput,
    CreateWorkflowOrchestrationInput,
    EmergencyWorkflowSummary,
    EventBusSummary,
    ExecutiveInsightSummary,
    NotificationSummary,
    OperationalHealthSummary,
    PredictiveRecommendationSummary,
    SecurityGovernanceSummary,
    SystemSearchSummary,
    TimelineSummary,
    WorkerCollaborationSummary,
    WorkflowOrchestrationSummary,
} from "@/src/modules/autonomous-company/types";

export function useAutonomousCompany() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AcDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AcPipelineInfo | null>(null);
    const [companyContexts, setCompanyContexts] = useState<CompanyContextSummary[]>([]);
    const [workflowOrchestrations, setWorkflowOrchestrations] = useState<WorkflowOrchestrationSummary[]>([]);
    const [eventBusEvents, setEventBusEvents] = useState<EventBusSummary[]>([]);
    const [workerCollaborations, setWorkerCollaborations] = useState<WorkerCollaborationSummary[]>([]);
    const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflowSummary[]>([]);
    const [notifications, setNotifications] = useState<NotificationSummary[]>([]);
    const [timelines, setTimelines] = useState<TimelineSummary[]>([]);
    const [activityFeeds, setActivityFeeds] = useState<ActivityFeedSummary[]>([]);
    const [automations, setAutomations] = useState<AutomationSummary[]>([]);
    const [executiveInsights, setExecutiveInsights] = useState<ExecutiveInsightSummary[]>([]);
    const [predictiveRecommendations, setPredictiveRecommendations] = useState<PredictiveRecommendationSummary[]>([]);
    const [systemSearches, setSystemSearches] = useState<SystemSearchSummary[]>([]);
    const [commandPalette, setCommandPalette] = useState<CommandPaletteSummary[]>([]);
    const [emergencyWorkflows, setEmergencyWorkflows] = useState<EmergencyWorkflowSummary[]>([]);
    const [businessKpis, setBusinessKpis] = useState<BusinessKpiSummary[]>([]);
    const [securityGovernance, setSecurityGovernance] = useState<SecurityGovernanceSummary[]>([]);
    const [complianceDashboards, setComplianceDashboards] = useState<ComplianceDashboardSummary[]>([]);
    const [operationalHealth, setOperationalHealth] = useState<OperationalHealthSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [contextOptions, setContextOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [foWorkspaceOptions, setFoWorkspaceOptions] = useState<Array<{ id: string; name: string }>>([]);
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
            contextList,
            workflowOrchestrationList,
            eventBusList,
            workerCollaborationList,
            approvalWorkflowList,
            notificationList,
            timelineList,
            activityFeedList,
            automationList,
            executiveInsightList,
            predictiveRecommendationList,
            systemSearchList,
            commandPaletteList,
            emergencyWorkflowList,
            businessKpiList,
            securityGovernanceList,
            complianceDashboardList,
            operationalHealthList,
            auditList,
            contextOpts,
            foWorkspaceOpts,
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
        ] = await Promise.all([
            autonomousCompanyService.getPipelineInfo(),
            autonomousCompanyService.getCompanyContexts(user.id, user.email, user.fullName),
            autonomousCompanyService.getWorkflowOrchestrations(user.id, user.email, user.fullName),
            autonomousCompanyService.getEventBusEvents(user.id, user.email, user.fullName),
            autonomousCompanyService.getWorkerCollaborations(user.id, user.email, user.fullName),
            autonomousCompanyService.getApprovalWorkflows(user.id, user.email, user.fullName),
            autonomousCompanyService.getNotifications(user.id, user.email, user.fullName),
            autonomousCompanyService.getTimelines(user.id, user.email, user.fullName),
            autonomousCompanyService.getActivityFeeds(user.id, user.email, user.fullName),
            autonomousCompanyService.getAutomations(user.id, user.email, user.fullName),
            autonomousCompanyService.getExecutiveInsights(user.id, user.email, user.fullName),
            autonomousCompanyService.getPredictiveRecommendations(user.id, user.email, user.fullName),
            autonomousCompanyService.getSystemSearches(user.id, user.email, user.fullName),
            autonomousCompanyService.getCommandPalette(user.id, user.email, user.fullName),
            autonomousCompanyService.getEmergencyWorkflows(user.id, user.email, user.fullName),
            autonomousCompanyService.getBusinessKpis(user.id, user.email, user.fullName),
            autonomousCompanyService.getSecurityGovernance(user.id, user.email, user.fullName),
            autonomousCompanyService.getComplianceDashboards(user.id, user.email, user.fullName),
            autonomousCompanyService.getOperationalHealth(user.id, user.email, user.fullName),
            autonomousCompanyService.getAuditLogs(user.id, user.email, user.fullName),
            autonomousCompanyService.getContextOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getFoWorkspaceOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getBaEngagementOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getSaEngagementOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getDfEngagementOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getQaEngagementOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getDdEngagementOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getCsEngagementOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getClientOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getProjectOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getAgentOptions(user.id, user.email, user.fullName),
            autonomousCompanyService.getSessionOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildAcDashboardStats({
            contexts: contextList,
            workflowOrchestrations: workflowOrchestrationList,
            eventBusEvents: eventBusList,
            workerCollaborations: workerCollaborationList,
            approvalWorkflows: approvalWorkflowList,
            notifications: notificationList,
            timelines: timelineList,
            activityFeeds: activityFeedList,
            automations: automationList,
            executiveInsights: executiveInsightList,
            predictiveRecommendations: predictiveRecommendationList,
            systemSearches: systemSearchList,
            commandPalette: commandPaletteList,
            emergencyWorkflows: emergencyWorkflowList,
            businessKpis: businessKpiList,
            securityGovernance: securityGovernanceList,
            complianceDashboards: complianceDashboardList,
            operationalHealth: operationalHealthList,
        });
        return {
            empty: false as const,
            pipelineInfo,
            dashboardStats,
            contextList,
            workflowOrchestrationList,
            eventBusList,
            workerCollaborationList,
            approvalWorkflowList,
            notificationList,
            timelineList,
            activityFeedList,
            automationList,
            executiveInsightList,
            predictiveRecommendationList,
            systemSearchList,
            commandPaletteList,
            emergencyWorkflowList,
            businessKpiList,
            securityGovernanceList,
            complianceDashboardList,
            operationalHealthList,
            auditList,
            contextOpts,
            foWorkspaceOpts,
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
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setPipeline(data.pipelineInfo);
        setStats(data.dashboardStats);
        setCompanyContexts(data.contextList);
        setWorkflowOrchestrations(data.workflowOrchestrationList);
        setEventBusEvents(data.eventBusList);
        setWorkerCollaborations(data.workerCollaborationList);
        setApprovalWorkflows(data.approvalWorkflowList);
        setNotifications(data.notificationList);
        setTimelines(data.timelineList);
        setActivityFeeds(data.activityFeedList);
        setAutomations(data.automationList);
        setExecutiveInsights(data.executiveInsightList);
        setPredictiveRecommendations(data.predictiveRecommendationList);
        setSystemSearches(data.systemSearchList);
        setCommandPalette(data.commandPaletteList);
        setEmergencyWorkflows(data.emergencyWorkflowList);
        setBusinessKpis(data.businessKpiList);
        setSecurityGovernance(data.securityGovernanceList);
        setComplianceDashboards(data.complianceDashboardList);
        setOperationalHealth(data.operationalHealthList);
        setAuditLogs(data.auditList);
        setContextOptions(data.contextOpts);
        setFoWorkspaceOptions(data.foWorkspaceOpts);
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

    const createCompanyContext = useCallback(async (input: CreateCompanyContextInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createCompanyContext(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowOrchestration = useCallback(async (input: CreateWorkflowOrchestrationInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createWorkflowOrchestration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEventBusEvent = useCallback(async (input: CreateEventBusInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createEventBusEvent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkerCollaboration = useCallback(async (input: CreateWorkerCollaborationInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createWorkerCollaboration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApprovalWorkflow = useCallback(async (input: CreateApprovalWorkflowInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createApprovalWorkflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createNotification = useCallback(async (input: CreateNotificationInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createNotification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTimeline = useCallback(async (input: CreateTimelineInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createTimeline(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createActivityFeed = useCallback(async (input: CreateActivityFeedInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createActivityFeed(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAutomation = useCallback(async (input: CreateAutomationInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createAutomation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveInsight = useCallback(async (input: CreateExecutiveInsightInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createExecutiveInsight(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPredictiveRecommendation = useCallback(async (input: CreatePredictiveRecommendationInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createPredictiveRecommendation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSystemSearch = useCallback(async (input: CreateSystemSearchInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createSystemSearch(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommandPaletteEntry = useCallback(async (input: CreateCommandPaletteInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createCommandPaletteEntry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEmergencyWorkflow = useCallback(async (input: CreateEmergencyWorkflowInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createEmergencyWorkflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessKpi = useCallback(async (input: CreateBusinessKpiInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createBusinessKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecurityGovernance = useCallback(async (input: CreateSecurityGovernanceInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createSecurityGovernance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceDashboard = useCallback(async (input: CreateComplianceDashboardInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createComplianceDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationalHealth = useCallback(async (input: CreateOperationalHealthInput) => { if (!user) throw new Error("Authentication required"); await autonomousCompanyService.createOperationalHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        companyContexts,
        workflowOrchestrations,
        eventBusEvents,
        workerCollaborations,
        approvalWorkflows,
        notifications,
        timelines,
        activityFeeds,
        automations,
        executiveInsights,
        predictiveRecommendations,
        systemSearches,
        commandPalette,
        emergencyWorkflows,
        businessKpis,
        securityGovernance,
        complianceDashboards,
        operationalHealth,
        auditLogs,
        contextOptions,
        foWorkspaceOptions,
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
        createCompanyContext,
        createWorkflowOrchestration,
        createEventBusEvent,
        createWorkerCollaboration,
        createApprovalWorkflow,
        createNotification,
        createTimeline,
        createActivityFeed,
        createAutomation,
        createExecutiveInsight,
        createPredictiveRecommendation,
        createSystemSearch,
        createCommandPaletteEntry,
        createEmergencyWorkflow,
        createBusinessKpi,
        createSecurityGovernance,
        createComplianceDashboard,
        createOperationalHealth,
        refresh,
    };
}
