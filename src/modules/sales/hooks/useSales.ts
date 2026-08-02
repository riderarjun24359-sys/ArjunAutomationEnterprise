"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { salesService } from "@/src/modules/sales/services/sales.service";
import type {
    ActivitySummary,
    CallLogSummary,
    CommissionSummary,
    CreateActivityInput,
    CreateCallLogInput,
    CreateEmailTrackingInput,
    CreateForecastInput,
    CreateLeadInput,
    CreateMeetingInput,
    CreateOpportunityInput,
    CreatePipelineInput,
    CreateQuoteInput,
    CreateStageInput,
    CreateTargetInput,
    CrossModuleLinks,
    EmailTrackingSummary,
    ForecastSummary,
    LeadSummary,
    MeetingSummary,
    OpportunitySummary,
    PipelineStageSummary,
    PipelineSummary,
    QuoteSummary,
    SalesAuditEntry,
    SalesDashboardStats,
    SalesReport,
    SalesTargetSummary,
    UpdateOpportunityStatusInput,
    WinLossSummary,
} from "@/src/modules/sales/types";

export function useSales() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SalesDashboardStats | null>(null);
    const [pipelines, setPipelines] = useState<PipelineSummary[]>([]);
    const [stages, setStages] = useState<PipelineStageSummary[]>([]);
    const [leads, setLeads] = useState<LeadSummary[]>([]);
    const [opportunities, setOpportunities] = useState<OpportunitySummary[]>([]);
    const [quotes, setQuotes] = useState<QuoteSummary[]>([]);
    const [forecasts, setForecasts] = useState<ForecastSummary[]>([]);
    const [activities, setActivities] = useState<ActivitySummary[]>([]);
    const [meetings, setMeetings] = useState<MeetingSummary[]>([]);
    const [callLogs, setCallLogs] = useState<CallLogSummary[]>([]);
    const [emailTracking, setEmailTracking] = useState<EmailTrackingSummary[]>([]);
    const [targets, setTargets] = useState<SalesTargetSummary[]>([]);
    const [commissions, setCommissions] = useState<CommissionSummary[]>([]);
    const [winLossRecords, setWinLossRecords] = useState<WinLossSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<SalesAuditEntry[]>([]);
    const [report, setReport] = useState<SalesReport | null>(null);
    const [crossModuleLinks, setCrossModuleLinks] = useState<CrossModuleLinks | null>(null);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [employeeOptions, setEmployeeOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchSalesData = useCallback(async () => {
        if (!user) {
            return { dashboardStats: null, pipelineList: [], stageList: [], leadList: [], opportunityList: [], quoteList: [], forecastList: [], activityList: [], meetingList: [], callLogList: [], emailList: [], targetList: [], commissionList: [], winLossList: [], auditLogList: [], salesReport: null, crossLinks: null, clients: [], employees: [] };
        }
        const [dashboardStats, pipelineList, stageList, leadList, opportunityList, quoteList, forecastList, activityList, meetingList, callLogList, emailList, targetList, commissionList, winLossList, auditLogList, salesReport, crossLinks, clients, employees] = await Promise.all([
            salesService.getDashboardStats(user.id, user.email, user.fullName),
            salesService.getPipelines(user.id, user.email, user.fullName),
            salesService.getStages(user.id, user.email, user.fullName),
            salesService.getLeads(user.id, user.email, user.fullName),
            salesService.getOpportunities(user.id, user.email, user.fullName),
            salesService.getQuotes(user.id, user.email, user.fullName),
            salesService.getForecasts(user.id, user.email, user.fullName),
            salesService.getActivities(user.id, user.email, user.fullName),
            salesService.getMeetings(user.id, user.email, user.fullName),
            salesService.getCallLogs(user.id, user.email, user.fullName),
            salesService.getEmailTracking(user.id, user.email, user.fullName),
            salesService.getTargets(user.id, user.email, user.fullName),
            salesService.getCommissions(user.id, user.email, user.fullName),
            salesService.getWinLossRecords(user.id, user.email, user.fullName),
            salesService.getAuditLogs(user.id, user.email, user.fullName),
            salesService.getReport(user.id, user.email, user.fullName),
            salesService.getCrossModuleLinks(user.id, user.email, user.fullName),
            salesService.getClientOptions(user.id, user.email, user.fullName),
            salesService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);
        return { dashboardStats, pipelineList, stageList, leadList, opportunityList, quoteList, forecastList, activityList, meetingList, callLogList, emailList, targetList, commissionList, winLossList, auditLogList, salesReport, crossLinks, clients, employees };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchSalesData>>) => {
        setStats(data.dashboardStats);
        setPipelines(data.pipelineList);
        setStages(data.stageList);
        setLeads(data.leadList);
        setOpportunities(data.opportunityList);
        setQuotes(data.quoteList);
        setForecasts(data.forecastList);
        setActivities(data.activityList);
        setMeetings(data.meetingList);
        setCallLogs(data.callLogList);
        setEmailTracking(data.emailList);
        setTargets(data.targetList);
        setCommissions(data.commissionList);
        setWinLossRecords(data.winLossList);
        setAuditLogs(data.auditLogList);
        setReport(data.salesReport);
        setCrossModuleLinks(data.crossLinks);
        setClientOptions(data.clients);
        setEmployeeOptions(data.employees);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchSalesData()); }, [fetchSalesData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchSalesData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchSalesData, applyData]);

    const createPipeline = useCallback(async (input: CreatePipelineInput) => { if (!user) throw new Error("Authentication required"); await salesService.createPipeline(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStage = useCallback(async (input: CreateStageInput) => { if (!user) throw new Error("Authentication required"); await salesService.createStage(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLead = useCallback(async (input: CreateLeadInput) => { if (!user) throw new Error("Authentication required"); await salesService.createLead(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOpportunity = useCallback(async (input: CreateOpportunityInput) => { if (!user) throw new Error("Authentication required"); await salesService.createOpportunity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const updateOpportunityStatus = useCallback(async (id: string, input: UpdateOpportunityStatusInput) => { if (!user) throw new Error("Authentication required"); await salesService.updateOpportunityStatus(user.id, user.email, id, input, user.fullName); await refresh(); }, [user, refresh]);
    const createQuote = useCallback(async (input: CreateQuoteInput) => { if (!user) throw new Error("Authentication required"); await salesService.createQuote(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createForecast = useCallback(async (input: CreateForecastInput) => { if (!user) throw new Error("Authentication required"); await salesService.createForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createActivity = useCallback(async (input: CreateActivityInput) => { if (!user) throw new Error("Authentication required"); await salesService.createActivity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMeeting = useCallback(async (input: CreateMeetingInput) => { if (!user) throw new Error("Authentication required"); await salesService.createMeeting(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCallLog = useCallback(async (input: CreateCallLogInput) => { if (!user) throw new Error("Authentication required"); await salesService.createCallLog(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEmailTracking = useCallback(async (input: CreateEmailTrackingInput) => { if (!user) throw new Error("Authentication required"); await salesService.createEmailTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTarget = useCallback(async (input: CreateTargetInput) => { if (!user) throw new Error("Authentication required"); await salesService.createTarget(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return { loading, stats, pipelines, stages, leads, opportunities, quotes, forecasts, activities, meetings, callLogs, emailTracking, targets, commissions, winLossRecords, auditLogs, report, crossModuleLinks, clientOptions, employeeOptions, createPipeline, createStage, createLead, createOpportunity, updateOpportunityStatus, createQuote, createForecast, createActivity, createMeeting, createCallLog, createEmailTracking, createTarget, refresh };
}
