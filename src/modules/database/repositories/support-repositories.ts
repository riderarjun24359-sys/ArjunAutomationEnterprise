import type {
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
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgSupportRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }
}

export class SupportCategoryRepository extends OrgSupportRepository<DbSupportCategory> { protected table = "support_categories"; }
export class SupportPriorityRepository extends OrgSupportRepository<DbSupportPriority> { protected table = "support_priorities"; }
export class SupportSlaRepository extends OrgSupportRepository<DbSupportSla> { protected table = "support_slas"; }
export class SupportQueueRepository extends OrgSupportRepository<DbSupportQueue> { protected table = "support_queues"; }
export class SupportTicketRepository extends OrgSupportRepository<DbSupportTicket> { protected table = "support_tickets"; }
export class SupportTicketNoteRepository extends OrgSupportRepository<DbSupportTicketNote> { protected table = "support_ticket_notes"; }
export class SupportTicketAttachmentRepository extends OrgSupportRepository<DbSupportTicketAttachment> { protected table = "support_ticket_attachments"; }
export class SupportKnowledgeArticleRepository extends OrgSupportRepository<DbSupportKnowledgeArticle> { protected table = "support_knowledge_articles"; }
export class SupportCannedResponseRepository extends OrgSupportRepository<DbSupportCannedResponse> { protected table = "support_canned_responses"; }
export class SupportEscalationRuleRepository extends OrgSupportRepository<DbSupportEscalationRule> { protected table = "support_escalation_rules"; }
export class SupportSatisfactionRatingRepository extends OrgSupportRepository<DbSupportSatisfactionRating> { protected table = "support_satisfaction_ratings"; }
export class SupportPortalSettingsRepository extends OrgSupportRepository<DbSupportPortalSettings> {
    protected table = "support_portal_settings";
    async getByOrganization(organizationId: string): Promise<DbSupportPortalSettings | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).maybeSingle();
        mapRepositoryError(error, "Failed to get support_portal_settings");
        return (data as DbSupportPortalSettings | null) ?? null;
    }
}

export class SupportAuditLogRepository extends OrgSupportRepository<DbSupportAuditLog> { protected table = "support_audit_logs"; }
