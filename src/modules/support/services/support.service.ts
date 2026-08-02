import {
    buildAgentAssignments,
    buildAttachmentPayload,
    buildCannedResponsePayload,
    buildCategoryPayload,
    buildCrossModuleLinks,
    buildEscalationRulePayload,
    buildKnowledgeArticlePayload,
    buildLookupMaps,
    buildNotePayload,
    buildPortalSettingsPayload,
    buildPriorityPayload,
    buildQueuePayload,
    buildSlaPayload,
    buildSupportAuditPayload,
    buildSupportDashboardStats,
    buildSupportReport,
    buildTicketPayload,
    mapAttachmentSummary,
    mapAuditEntry,
    mapCannedResponse,
    mapCategorySummary,
    mapEscalationRule,
    mapKnowledgeArticle,
    mapNoteSummary,
    mapPortalSettings,
    mapPrioritySummary,
    mapQueueSummary,
    mapSatisfactionRating,
    mapSlaSummary,
    mapTicketSummary,
} from "@/src/modules/database/lib/support-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
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

export class SupportService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [categories, priorities, slas, queues, tickets, clients, projects, employees] = await Promise.all([
            databaseService.supportCategories.listByOrganization(organizationId),
            databaseService.supportPriorities.listByOrganization(organizationId),
            databaseService.supportSlas.listByOrganization(organizationId),
            databaseService.supportQueues.listByOrganization(organizationId),
            databaseService.supportTickets.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(categories, priorities, slas, queues, tickets, clients, projects, employees);
    }

    async getCategories(authUserId: string, email: string, fullName?: string | null): Promise<SupportCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [categories, tickets] = await Promise.all([
            databaseService.supportCategories.listByOrganization(context.organizationId),
            databaseService.supportTickets.listByOrganization(context.organizationId),
        ]);
        return categories.map((category) => mapCategorySummary(category, tickets.filter((t) => t.category_id === category.id).length));
    }

    async createCategory(authUserId: string, email: string, input: CreateCategoryInput, fullName?: string | null): Promise<SupportCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportCategories.create(buildCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create category");
        await databaseService.supportAuditLogs.create(buildSupportAuditPayload(context.organizationId, "category", "create", `Category ${created.name} created`, created.id));
        return mapCategorySummary(created, 0);
    }

    async getPriorities(authUserId: string, email: string, fullName?: string | null): Promise<SupportPrioritySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [priorities, tickets] = await Promise.all([
            databaseService.supportPriorities.listByOrganization(context.organizationId),
            databaseService.supportTickets.listByOrganization(context.organizationId),
        ]);
        return priorities.map((priority) => mapPrioritySummary(priority, tickets.filter((t) => t.priority_id === priority.id).length));
    }

    async createPriority(authUserId: string, email: string, input: CreatePriorityInput, fullName?: string | null): Promise<SupportPrioritySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportPriorities.create(buildPriorityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create priority");
        return mapPrioritySummary(created, 0);
    }

    async getSlas(authUserId: string, email: string, fullName?: string | null): Promise<SupportSlaSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.supportSlas.listByOrganization(context.organizationId)).map((sla) => mapSlaSummary(sla, maps));
    }

    async createSla(authUserId: string, email: string, input: CreateSlaInput, fullName?: string | null): Promise<SupportSlaSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportSlas.create(buildSlaPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create SLA");
        const maps = await this.getMaps(context.organizationId);
        return mapSlaSummary(created, maps);
    }

    async getQueues(authUserId: string, email: string, fullName?: string | null): Promise<SupportQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const [queues, tickets] = await Promise.all([
            databaseService.supportQueues.listByOrganization(context.organizationId),
            databaseService.supportTickets.listByOrganization(context.organizationId),
        ]);
        return queues.map((queue) => mapQueueSummary(queue, maps, tickets.filter((t) => t.queue_id === queue.id).length));
    }

    async createQueue(authUserId: string, email: string, input: CreateQueueInput, fullName?: string | null): Promise<SupportQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportQueues.create(buildQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create queue");
        const maps = await this.getMaps(context.organizationId);
        return mapQueueSummary(created, maps, 0);
    }

    async getTickets(authUserId: string, email: string, fullName?: string | null): Promise<SupportTicketSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const tickets = await databaseService.supportTickets.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return tickets.map((ticket) => mapTicketSummary(ticket, maps));
    }

    async createTicket(authUserId: string, email: string, input: CreateTicketInput, fullName?: string | null): Promise<SupportTicketSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportTickets.create(buildTicketPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ticket");
        await databaseService.supportAuditLogs.create(buildSupportAuditPayload(context.organizationId, "ticket", "create", `Ticket ${created.ticket_number} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTicketSummary(created, maps);
    }

    async updateTicketStatus(authUserId: string, email: string, ticketId: string, input: UpdateTicketStatusInput, fullName?: string | null): Promise<SupportTicketSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.supportTickets.update(ticketId, {
            status: input.status,
            resolved_at: input.status === "resolved" || input.status === "closed" ? new Date().toISOString() : null,
        });
        if (!updated) throw new Error("Failed to update ticket");
        const maps = await this.getMaps(context.organizationId);
        return mapTicketSummary(updated, maps);
    }

    async getNotes(authUserId: string, email: string, fullName?: string | null): Promise<SupportNoteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const notes = await databaseService.supportTicketNotes.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return notes.map((note) => mapNoteSummary(note, maps));
    }

    async createNote(authUserId: string, email: string, input: CreateNoteInput, fullName?: string | null): Promise<SupportNoteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportTicketNotes.create(buildNotePayload(context.organizationId, context.profileId, input));
        if (!created) throw new Error("Failed to create note");
        const maps = await this.getMaps(context.organizationId);
        return mapNoteSummary(created, maps);
    }

    async getAttachments(authUserId: string, email: string, fullName?: string | null): Promise<SupportAttachmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const attachments = await databaseService.supportTicketAttachments.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return attachments.map((attachment) => mapAttachmentSummary(attachment, maps));
    }

    async createAttachment(authUserId: string, email: string, input: CreateAttachmentInput, fullName?: string | null): Promise<SupportAttachmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportTicketAttachments.create(buildAttachmentPayload(context.organizationId, context.profileId, input));
        if (!created) throw new Error("Failed to create attachment");
        const maps = await this.getMaps(context.organizationId);
        return mapAttachmentSummary(created, maps);
    }

    async getKnowledgeArticles(authUserId: string, email: string, fullName?: string | null): Promise<KnowledgeArticleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.supportKnowledgeArticles.listByOrganization(context.organizationId)).map((article) => mapKnowledgeArticle(article, maps));
    }

    async createKnowledgeArticle(authUserId: string, email: string, input: CreateKnowledgeArticleInput, fullName?: string | null): Promise<KnowledgeArticleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportKnowledgeArticles.create(buildKnowledgeArticlePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create knowledge article");
        const maps = await this.getMaps(context.organizationId);
        return mapKnowledgeArticle(created, maps);
    }

    async getCannedResponses(authUserId: string, email: string, fullName?: string | null): Promise<CannedResponseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.supportCannedResponses.listByOrganization(context.organizationId)).map((response) => mapCannedResponse(response, maps));
    }

    async createCannedResponse(authUserId: string, email: string, input: CreateCannedResponseInput, fullName?: string | null): Promise<CannedResponseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportCannedResponses.create(buildCannedResponsePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create canned response");
        const maps = await this.getMaps(context.organizationId);
        return mapCannedResponse(created, maps);
    }

    async getEscalationRules(authUserId: string, email: string, fullName?: string | null): Promise<EscalationRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.supportEscalationRules.listByOrganization(context.organizationId)).map((rule) => mapEscalationRule(rule, maps));
    }

    async createEscalationRule(authUserId: string, email: string, input: CreateEscalationRuleInput, fullName?: string | null): Promise<EscalationRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.supportEscalationRules.create(buildEscalationRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create escalation rule");
        const maps = await this.getMaps(context.organizationId);
        return mapEscalationRule(created, maps);
    }

    async getSatisfactionRatings(authUserId: string, email: string, fullName?: string | null): Promise<SatisfactionRatingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.supportSatisfactionRatings.listByOrganization(context.organizationId, { orderBy: "submitted_at", orderDirection: "desc" })).map((rating) => mapSatisfactionRating(rating, maps));
    }

    async getPortalSettings(authUserId: string, email: string, fullName?: string | null): Promise<PortalSettingsSummary | null> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return null;
        const settings = await databaseService.supportPortalSettings.getByOrganization(context.organizationId);
        return settings ? mapPortalSettings(settings) : null;
    }

    async updatePortalSettings(authUserId: string, email: string, input: UpdatePortalSettingsInput, fullName?: string | null): Promise<PortalSettingsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const existing = await databaseService.supportPortalSettings.getByOrganization(context.organizationId);
        const payload = buildPortalSettingsPayload(context.organizationId, input);
        const result = existing
            ? await databaseService.supportPortalSettings.update(existing.id, payload)
            : await databaseService.supportPortalSettings.create(payload);
        if (!result) throw new Error("Failed to update portal settings");
        return mapPortalSettings(result);
    }

    async getAgentAssignments(authUserId: string, email: string, fullName?: string | null): Promise<AgentAssignmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [tickets, employees] = await Promise.all([
            databaseService.supportTickets.listByOrganization(context.organizationId),
            databaseService.employees.listByOrganization(context.organizationId),
        ]);
        return buildAgentAssignments(tickets, employees);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<SupportAuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.supportAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getReport(authUserId: string, email: string, fullName?: string | null): Promise<SupportReport> {
        const [tickets, categories, priorities, ratings, queues] = await Promise.all([
            this.getTickets(authUserId, email, fullName),
            this.getCategories(authUserId, email, fullName),
            this.getPriorities(authUserId, email, fullName),
            this.getSatisfactionRatings(authUserId, email, fullName),
            this.getQueues(authUserId, email, fullName),
        ]);
        return buildSupportReport({ tickets, categories, priorities, ratings, queues });
    }

    async getCrossModuleLinks(authUserId: string, email: string, fullName?: string | null): Promise<CrossModuleLinks> {
        const [tickets, agents, escalationRules, portalSettings] = await Promise.all([
            this.getTickets(authUserId, email, fullName),
            this.getAgentAssignments(authUserId, email, fullName),
            this.getEscalationRules(authUserId, email, fullName),
            this.getPortalSettings(authUserId, email, fullName),
        ]);
        return buildCrossModuleLinks({ tickets, agents, escalationRules, portalSettings });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<SupportDashboardStats> {
        const [tickets, ratings, agents, articles, escalationRules] = await Promise.all([
            this.getTickets(authUserId, email, fullName),
            this.getSatisfactionRatings(authUserId, email, fullName),
            this.getAgentAssignments(authUserId, email, fullName),
            this.getKnowledgeArticles(authUserId, email, fullName),
            this.getEscalationRules(authUserId, email, fullName),
        ]);
        return buildSupportDashboardStats({ tickets, ratings, agents, articles, escalationRules });
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const clients = await databaseService.clients.listByOrganization(context.organizationId);
        return clients.map((client) => ({ id: client.id, name: client.name }));
    }

    async getEmployeeOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const employees = await databaseService.employees.listByOrganization(context.organizationId);
        return employees.map((employee) => ({ id: employee.id, name: `${employee.first_name} ${employee.last_name}` }));
    }
}

export const supportService = new SupportService();
