import type {
    DbClient,
    DbEmployee,
    DbProject,
    DbSupportAuditLog,
    DbSupportCannedResponse,
    DbSupportCategory,
    DbSupportEscalationRule,
    DbSupportKnowledgeArticle,
    DbSupportPortalSettings,
    DbSupportPriority,
    DbSupportQueue,
    DbSupportSatisfactionRating,
    DbSupportSla,
    DbSupportTicket,
    DbSupportTicketAttachment,
    DbSupportTicketNote,
} from "@/src/modules/database/types/platform";
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
} from "@/src/modules/support/types";

type LookupMaps = {
    categories: Map<string, DbSupportCategory>;
    priorities: Map<string, DbSupportPriority>;
    slas: Map<string, DbSupportSla>;
    queues: Map<string, DbSupportQueue>;
    tickets: Map<string, DbSupportTicket>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    employees: Map<string, DbEmployee>;
};

export const buildLookupMaps = (
    categories: DbSupportCategory[],
    priorities: DbSupportPriority[],
    slas: DbSupportSla[],
    queues: DbSupportQueue[],
    tickets: DbSupportTicket[],
    clients: DbClient[],
    projects: DbProject[],
    employees: DbEmployee[],
): LookupMaps => ({
    categories: new Map(categories.map((item) => [item.id, item])),
    priorities: new Map(priorities.map((item) => [item.id, item])),
    slas: new Map(slas.map((item) => [item.id, item])),
    queues: new Map(queues.map((item) => [item.id, item])),
    tickets: new Map(tickets.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
});

export const mapCategorySummary = (record: DbSupportCategory, ticketCount: number): SupportCategorySummary => ({
    id: record.id, name: record.name, slug: record.slug, description: record.description, ticketCount,
});

export const mapPrioritySummary = (record: DbSupportPriority, ticketCount: number): SupportPrioritySummary => ({
    id: record.id, name: record.name, level: record.level, color: record.color, responseHours: record.response_hours, ticketCount,
});

export const mapSlaSummary = (record: DbSupportSla, maps: LookupMaps): SupportSlaSummary => ({
    id: record.id,
    name: record.name,
    priorityName: record.priority_id ? maps.priorities.get(record.priority_id)?.name ?? null : null,
    firstResponseMinutes: record.first_response_minutes,
    resolutionMinutes: record.resolution_minutes,
    isActive: record.is_active,
});

export const mapQueueSummary = (record: DbSupportQueue, maps: LookupMaps, ticketCount: number): SupportQueueSummary => ({
    id: record.id,
    name: record.name,
    code: record.code,
    description: record.description,
    defaultAssigneeName: record.default_assignee_id ? (() => { const e = maps.employees.get(record.default_assignee_id!); return e ? `${e.first_name} ${e.last_name}` : null; })() : null,
    isActive: record.is_active,
    ticketCount,
});

export const mapTicketSummary = (record: DbSupportTicket, maps: LookupMaps): SupportTicketSummary => ({
    id: record.id,
    ticketNumber: record.ticket_number,
    subject: record.subject,
    description: record.description,
    status: record.status,
    categoryName: record.category_id ? maps.categories.get(record.category_id)?.name ?? null : null,
    priorityName: record.priority_id ? maps.priorities.get(record.priority_id)?.name ?? null : null,
    queueName: record.queue_id ? maps.queues.get(record.queue_id)?.name ?? null : null,
    clientName: record.client_id ? maps.clients.get(record.client_id)?.name ?? null : null,
    projectName: record.project_id ? maps.projects.get(record.project_id)?.name ?? null : null,
    agentName: record.assigned_agent_id ? (() => { const e = maps.employees.get(record.assigned_agent_id!); return e ? `${e.first_name} ${e.last_name}` : null; })() : null,
    portalVisible: record.portal_visible,
    dueAt: record.due_at ?? null,
    resolvedAt: record.resolved_at ?? null,
    createdAt: record.created_at,
});

export const mapNoteSummary = (record: DbSupportTicketNote, maps: LookupMaps): SupportNoteSummary => ({
    id: record.id,
    ticketNumber: maps.tickets.get(record.ticket_id)?.ticket_number ?? "Unknown",
    body: record.body,
    isInternal: record.is_internal,
    createdAt: record.created_at,
});

export const mapAttachmentSummary = (record: DbSupportTicketAttachment, maps: LookupMaps): SupportAttachmentSummary => ({
    id: record.id,
    ticketNumber: maps.tickets.get(record.ticket_id)?.ticket_number ?? "Unknown",
    fileName: record.file_name,
    fileUrl: record.file_url,
    fileSize: record.file_size,
    mimeType: record.mime_type,
    createdAt: record.created_at,
});

export const mapKnowledgeArticle = (record: DbSupportKnowledgeArticle, maps: LookupMaps): KnowledgeArticleSummary => ({
    id: record.id,
    title: record.title,
    slug: record.slug,
    categoryName: record.category_id ? maps.categories.get(record.category_id)?.name ?? null : null,
    status: record.status,
    viewCount: record.view_count,
});

export const mapCannedResponse = (record: DbSupportCannedResponse, maps: LookupMaps): CannedResponseSummary => ({
    id: record.id,
    title: record.title,
    shortcut: record.shortcut,
    body: record.body,
    categoryName: record.category_id ? maps.categories.get(record.category_id)?.name ?? null : null,
});

export const mapEscalationRule = (record: DbSupportEscalationRule, maps: LookupMaps): EscalationRuleSummary => ({
    id: record.id,
    name: record.name,
    triggerCondition: record.trigger_condition,
    escalationLevel: record.escalation_level,
    targetQueueName: record.target_queue_id ? maps.queues.get(record.target_queue_id)?.name ?? null : null,
    notifyAgentName: record.notify_agent_id ? (() => { const e = maps.employees.get(record.notify_agent_id!); return e ? `${e.first_name} ${e.last_name}` : null; })() : null,
    isActive: record.is_active,
});

export const mapSatisfactionRating = (record: DbSupportSatisfactionRating, maps: LookupMaps): SatisfactionRatingSummary => ({
    id: record.id,
    ticketNumber: maps.tickets.get(record.ticket_id)?.ticket_number ?? "Unknown",
    rating: record.rating,
    comment: record.comment,
    submittedAt: record.submitted_at,
});

export const mapPortalSettings = (record: DbSupportPortalSettings): PortalSettingsSummary => ({
    id: record.id,
    portalEnabled: record.portal_enabled,
    welcomeMessage: record.welcome_message,
    allowTicketCreation: record.allow_ticket_creation,
    showKnowledgeBase: record.show_knowledge_base,
    customDomain: record.custom_domain,
});

export const mapAuditEntry = (record: DbSupportAuditLog): SupportAuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildCategoryPayload = (organizationId: string, input: CreateCategoryInput) => ({
    organization_id: organizationId, name: input.name, slug: input.slug, description: input.description,
});

export const buildPriorityPayload = (organizationId: string, input: CreatePriorityInput) => ({
    organization_id: organizationId, name: input.name, level: input.level, color: input.color, response_hours: input.responseHours,
});

export const buildSlaPayload = (organizationId: string, input: CreateSlaInput) => ({
    organization_id: organizationId, name: input.name, priority_id: input.priorityId || null, first_response_minutes: input.firstResponseMinutes, resolution_minutes: input.resolutionMinutes,
});

export const buildQueuePayload = (organizationId: string, input: CreateQueueInput) => ({
    organization_id: organizationId, name: input.name, code: input.code, description: input.description, default_assignee_id: input.defaultAssigneeId || null,
});

export const buildTicketPayload = (organizationId: string, input: CreateTicketInput) => ({
    organization_id: organizationId,
    ticket_number: input.ticketNumber,
    subject: input.subject,
    description: input.description,
    category_id: input.categoryId || null,
    priority_id: input.priorityId || null,
    queue_id: input.queueId || null,
    client_id: input.clientId || null,
    assigned_agent_id: input.assignedAgentId || null,
});

export const buildNotePayload = (organizationId: string, profileId: string | null, input: CreateNoteInput) => ({
    organization_id: organizationId, ticket_id: input.ticketId, author_id: profileId, body: input.body, is_internal: input.isInternal,
});

export const buildAttachmentPayload = (organizationId: string, profileId: string | null, input: CreateAttachmentInput) => ({
    organization_id: organizationId, ticket_id: input.ticketId, file_name: input.fileName, file_url: input.fileUrl, file_size: input.fileSize, mime_type: input.mimeType, uploaded_by: profileId,
});

export const buildKnowledgeArticlePayload = (organizationId: string, input: CreateKnowledgeArticleInput) => ({
    organization_id: organizationId, title: input.title, slug: input.slug, content: input.content, category_id: input.categoryId || null, status: "draft",
});

export const buildCannedResponsePayload = (organizationId: string, input: CreateCannedResponseInput) => ({
    organization_id: organizationId, title: input.title, shortcut: input.shortcut, body: input.body,
});

export const buildEscalationRulePayload = (organizationId: string, input: CreateEscalationRuleInput) => ({
    organization_id: organizationId, name: input.name, trigger_condition: input.triggerCondition, escalation_level: input.escalationLevel, target_queue_id: input.targetQueueId || null,
});

export const buildPortalSettingsPayload = (organizationId: string, input: UpdatePortalSettingsInput) => ({
    organization_id: organizationId,
    portal_enabled: input.portalEnabled,
    welcome_message: input.welcomeMessage,
    allow_ticket_creation: input.allowTicketCreation,
    show_knowledge_base: input.showKnowledgeBase,
    custom_domain: input.customDomain,
});

export const buildSupportAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId, entity_type: entityType, entity_id: entityId ?? null, action, summary,
});

export const buildAgentAssignments = (tickets: DbSupportTicket[], employees: DbEmployee[]): AgentAssignmentSummary[] => {
    const agentMap = new Map<string, AgentAssignmentSummary>();
    for (const employee of employees) {
        agentMap.set(employee.id, {
            agentId: employee.id,
            agentName: `${employee.first_name} ${employee.last_name}`,
            assignedTickets: 0,
            openTickets: 0,
            resolvedTickets: 0,
        });
    }
    for (const ticket of tickets) {
        if (!ticket.assigned_agent_id) continue;
        const entry = agentMap.get(ticket.assigned_agent_id);
        if (!entry) continue;
        entry.assignedTickets += 1;
        if (ticket.status === "resolved" || ticket.status === "closed") {
            entry.resolvedTickets += 1;
        } else {
            entry.openTickets += 1;
        }
    }
    return Array.from(agentMap.values()).filter((entry) => entry.assignedTickets > 0);
};

export const buildSupportDashboardStats = (input: {
    tickets: SupportTicketSummary[];
    ratings: SatisfactionRatingSummary[];
    agents: AgentAssignmentSummary[];
    articles: KnowledgeArticleSummary[];
    escalationRules: EscalationRuleSummary[];
}): SupportDashboardStats => {
    const openTickets = input.tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length;
    const resolvedTickets = input.tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
    const avgRating = input.ratings.length > 0 ? Math.round((input.ratings.reduce((sum, r) => sum + r.rating, 0) / input.ratings.length) * 10) / 10 : 0;
    const slaMet = input.tickets.filter((t) => t.dueAt && t.resolvedAt && new Date(t.resolvedAt) <= new Date(t.dueAt)).length;
    const slaTotal = input.tickets.filter((t) => t.dueAt).length;
    return {
        totalTickets: input.tickets.length,
        openTickets,
        resolvedTickets,
        avgSatisfaction: avgRating,
        activeAgents: input.agents.length,
        slaCompliance: slaTotal > 0 ? Math.round((slaMet / slaTotal) * 100) : 100,
        knowledgeArticles: input.articles.filter((a) => a.status === "published").length,
        openEscalations: input.escalationRules.filter((r) => r.isActive).length,
    };
};

export const buildSupportReport = (input: {
    tickets: SupportTicketSummary[];
    categories: SupportCategorySummary[];
    priorities: SupportPrioritySummary[];
    ratings: SatisfactionRatingSummary[];
    queues: SupportQueueSummary[];
}): SupportReport => {
    const statusMap = new Map<string, number>();
    for (const ticket of input.tickets) {
        statusMap.set(ticket.status, (statusMap.get(ticket.status) ?? 0) + 1);
    }

    const categoryMap = new Map<string, number>();
    for (const ticket of input.tickets) {
        const cat = ticket.categoryName ?? "Uncategorized";
        categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
    }

    const priorityMap = new Map<string, number>();
    for (const ticket of input.tickets) {
        const pri = ticket.priorityName ?? "Unassigned";
        priorityMap.set(pri, (priorityMap.get(pri) ?? 0) + 1);
    }

    const ratingMap = new Map<string, number>();
    for (const rating of input.ratings) {
        const key = `${rating.rating} stars`;
        ratingMap.set(key, (ratingMap.get(key) ?? 0) + 1);
    }

    const queueMap = new Map<string, number>();
    for (const ticket of input.tickets) {
        const queue = ticket.queueName ?? "Unassigned";
        queueMap.set(queue, (queueMap.get(queue) ?? 0) + 1);
    }

    return {
        ticketsByStatus: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
        ticketsByCategory: Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count })),
        ticketsByPriority: Array.from(priorityMap.entries()).map(([priority, count]) => ({ priority, count })),
        satisfactionDistribution: Array.from(ratingMap.entries()).map(([rating, count]) => ({ rating, count })),
        queueWorkload: Array.from(queueMap.entries()).map(([queue, count]) => ({ queue, count })),
    };
};

export const buildCrossModuleLinks = (input: {
    tickets: SupportTicketSummary[];
    agents: AgentAssignmentSummary[];
    escalationRules: EscalationRuleSummary[];
    portalSettings: PortalSettingsSummary | null;
}): CrossModuleLinks => ({
    crmClients: new Set(input.tickets.filter((t) => t.clientName).map((t) => t.clientName)).size,
    projectTickets: input.tickets.filter((t) => t.projectName).length,
    hrAgents: input.agents.length,
    financeInvoices: 0,
    automationTriggers: input.escalationRules.filter((r) => r.isActive).length,
    analyticsMetrics: input.tickets.length,
    settingsConfigured: input.portalSettings?.portalEnabled ?? false,
});
