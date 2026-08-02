"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { supportService } from "@/src/modules/support/services/support.service";
import type {
    AgentAssignmentSummary,
    CannedResponseSummary,
    CreateAttachmentInput,
    CreateCannedResponseInput,
    CreateCategoryInput,
    CreateEscalationRuleInput,
    CreateKnowledgeArticleInput,
    CreateNoteInput,
    CreatePriorityInput,
    CreateQueueInput,
    CreateSlaInput,
    CreateTicketInput,
    CrossModuleLinks,
    EscalationRuleSummary,
    KnowledgeArticleSummary,
    PortalSettingsSummary,
    SatisfactionRatingSummary,
    SupportAttachmentSummary,
    SupportAuditEntry,
    SupportCategorySummary,
    SupportDashboardStats,
    SupportNoteSummary,
    SupportPrioritySummary,
    SupportQueueSummary,
    SupportReport,
    SupportSlaSummary,
    SupportTicketSummary,
    UpdatePortalSettingsInput,
    UpdateTicketStatusInput,
} from "@/src/modules/support/types";

export function useSupport() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SupportDashboardStats | null>(null);
    const [categories, setCategories] = useState<SupportCategorySummary[]>([]);
    const [priorities, setPriorities] = useState<SupportPrioritySummary[]>([]);
    const [slas, setSlas] = useState<SupportSlaSummary[]>([]);
    const [queues, setQueues] = useState<SupportQueueSummary[]>([]);
    const [tickets, setTickets] = useState<SupportTicketSummary[]>([]);
    const [notes, setNotes] = useState<SupportNoteSummary[]>([]);
    const [attachments, setAttachments] = useState<SupportAttachmentSummary[]>([]);
    const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticleSummary[]>([]);
    const [cannedResponses, setCannedResponses] = useState<CannedResponseSummary[]>([]);
    const [escalationRules, setEscalationRules] = useState<EscalationRuleSummary[]>([]);
    const [satisfactionRatings, setSatisfactionRatings] = useState<SatisfactionRatingSummary[]>([]);
    const [portalSettings, setPortalSettings] = useState<PortalSettingsSummary | null>(null);
    const [agents, setAgents] = useState<AgentAssignmentSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<SupportAuditEntry[]>([]);
    const [report, setReport] = useState<SupportReport | null>(null);
    const [crossModuleLinks, setCrossModuleLinks] = useState<CrossModuleLinks | null>(null);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [employeeOptions, setEmployeeOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchSupportData = useCallback(async () => {
        if (!user) {
            return {
                dashboardStats: null,
                categoryList: [],
                priorityList: [],
                slaList: [],
                queueList: [],
                ticketList: [],
                noteList: [],
                attachmentList: [],
                articleList: [],
                cannedList: [],
                escalationList: [],
                ratingList: [],
                portal: null,
                agentList: [],
                auditLogList: [],
                supportReport: null,
                crossLinks: null,
                clients: [],
                employees: [],
            };
        }

        const [
            dashboardStats,
            categoryList,
            priorityList,
            slaList,
            queueList,
            ticketList,
            noteList,
            attachmentList,
            articleList,
            cannedList,
            escalationList,
            ratingList,
            portal,
            agentList,
            auditLogList,
            supportReport,
            crossLinks,
            clients,
            employees,
        ] = await Promise.all([
            supportService.getDashboardStats(user.id, user.email, user.fullName),
            supportService.getCategories(user.id, user.email, user.fullName),
            supportService.getPriorities(user.id, user.email, user.fullName),
            supportService.getSlas(user.id, user.email, user.fullName),
            supportService.getQueues(user.id, user.email, user.fullName),
            supportService.getTickets(user.id, user.email, user.fullName),
            supportService.getNotes(user.id, user.email, user.fullName),
            supportService.getAttachments(user.id, user.email, user.fullName),
            supportService.getKnowledgeArticles(user.id, user.email, user.fullName),
            supportService.getCannedResponses(user.id, user.email, user.fullName),
            supportService.getEscalationRules(user.id, user.email, user.fullName),
            supportService.getSatisfactionRatings(user.id, user.email, user.fullName),
            supportService.getPortalSettings(user.id, user.email, user.fullName),
            supportService.getAgentAssignments(user.id, user.email, user.fullName),
            supportService.getAuditLogs(user.id, user.email, user.fullName),
            supportService.getReport(user.id, user.email, user.fullName),
            supportService.getCrossModuleLinks(user.id, user.email, user.fullName),
            supportService.getClientOptions(user.id, user.email, user.fullName),
            supportService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);

        return {
            dashboardStats,
            categoryList,
            priorityList,
            slaList,
            queueList,
            ticketList,
            noteList,
            attachmentList,
            articleList,
            cannedList,
            escalationList,
            ratingList,
            portal,
            agentList,
            auditLogList,
            supportReport,
            crossLinks,
            clients,
            employees,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchSupportData>>) => {
        setStats(data.dashboardStats);
        setCategories(data.categoryList);
        setPriorities(data.priorityList);
        setSlas(data.slaList);
        setQueues(data.queueList);
        setTickets(data.ticketList);
        setNotes(data.noteList);
        setAttachments(data.attachmentList);
        setKnowledgeArticles(data.articleList);
        setCannedResponses(data.cannedList);
        setEscalationRules(data.escalationList);
        setSatisfactionRatings(data.ratingList);
        setPortalSettings(data.portal);
        setAgents(data.agentList);
        setAuditLogs(data.auditLogList);
        setReport(data.supportReport);
        setCrossModuleLinks(data.crossLinks);
        setClientOptions(data.clients);
        setEmployeeOptions(data.employees);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => {
        const data = await fetchSupportData();
        applyData(data);
    }, [fetchSupportData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchSupportData()
            .then((data) => {
                if (cancelled) return;
                applyData(data);
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [fetchSupportData, applyData]);

    const createCategory = useCallback(async (input: CreateCategoryInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createCategory(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createPriority = useCallback(async (input: CreatePriorityInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createPriority(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createSla = useCallback(async (input: CreateSlaInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createSla(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createQueue = useCallback(async (input: CreateQueueInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createQueue(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createTicket = useCallback(async (input: CreateTicketInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createTicket(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateTicketStatus = useCallback(async (ticketId: string, input: UpdateTicketStatusInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.updateTicketStatus(user.id, user.email, ticketId, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createNote = useCallback(async (input: CreateNoteInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createNote(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createAttachment = useCallback(async (input: CreateAttachmentInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createAttachment(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createKnowledgeArticle = useCallback(async (input: CreateKnowledgeArticleInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createKnowledgeArticle(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createCannedResponse = useCallback(async (input: CreateCannedResponseInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createCannedResponse(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createEscalationRule = useCallback(async (input: CreateEscalationRuleInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.createEscalationRule(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updatePortalSettings = useCallback(async (input: UpdatePortalSettingsInput) => {
        if (!user) throw new Error("Authentication required");
        await supportService.updatePortalSettings(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    return {
        loading,
        stats,
        categories,
        priorities,
        slas,
        queues,
        tickets,
        notes,
        attachments,
        knowledgeArticles,
        cannedResponses,
        escalationRules,
        satisfactionRatings,
        portalSettings,
        agents,
        auditLogs,
        report,
        crossModuleLinks,
        clientOptions,
        employeeOptions,
        createCategory,
        createPriority,
        createSla,
        createQueue,
        createTicket,
        updateTicketStatus,
        createNote,
        createAttachment,
        createKnowledgeArticle,
        createCannedResponse,
        createEscalationRule,
        updatePortalSettings,
        refresh,
    };
}
