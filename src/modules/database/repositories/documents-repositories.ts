import type {
    DbDocument,
    DbDocumentAccessGrant,
    DbDocumentActivityLog,
    DbDocumentApproval,
    DbDocumentArchive,
    DbDocumentAuditLog,
    DbDocumentEsignPreparation,
    DbDocumentFolder,
    DbDocumentPreview,
    DbDocumentRetentionPolicy,
    DbDocumentSearchIndex,
    DbDocumentShare,
    DbDocumentTag,
    DbDocumentTagLink,
    DbDocumentTemplate,
    DbDocumentVersion,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgDocumentsRepository<T> extends BaseRepository<T> {
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

export class DocumentFolderRepository extends OrgDocumentsRepository<DbDocumentFolder> { protected table = "document_folders"; }
export class DocumentRepository extends OrgDocumentsRepository<DbDocument> { protected table = "documents"; }
export class DocumentTagRepository extends OrgDocumentsRepository<DbDocumentTag> { protected table = "document_tags"; }
export class DocumentVersionRepository extends OrgDocumentsRepository<DbDocumentVersion> { protected table = "document_versions"; }
export class DocumentApprovalRepository extends OrgDocumentsRepository<DbDocumentApproval> { protected table = "document_approvals"; }
export class DocumentEsignPreparationRepository extends OrgDocumentsRepository<DbDocumentEsignPreparation> { protected table = "document_esign_preparations"; }
export class DocumentShareRepository extends OrgDocumentsRepository<DbDocumentShare> { protected table = "document_shares"; }
export class DocumentAccessGrantRepository extends OrgDocumentsRepository<DbDocumentAccessGrant> { protected table = "document_access_grants"; }
export class DocumentTemplateRepository extends OrgDocumentsRepository<DbDocumentTemplate> { protected table = "document_templates"; }
export class DocumentPreviewRepository extends OrgDocumentsRepository<DbDocumentPreview> { protected table = "document_previews"; }
export class DocumentSearchIndexRepository extends OrgDocumentsRepository<DbDocumentSearchIndex> { protected table = "document_search_index"; }
export class DocumentRetentionPolicyRepository extends OrgDocumentsRepository<DbDocumentRetentionPolicy> { protected table = "document_retention_policies"; }
export class DocumentArchiveRepository extends OrgDocumentsRepository<DbDocumentArchive> { protected table = "document_archives"; }
export class DocumentActivityLogRepository extends OrgDocumentsRepository<DbDocumentActivityLog> { protected table = "document_activity_logs"; }
export class DocumentAuditLogRepository extends OrgDocumentsRepository<DbDocumentAuditLog> { protected table = "document_audit_logs"; }

export class DocumentTagLinkRepository extends BaseRepository<DbDocumentTagLink> {
    protected table = "document_tag_links";

    async listByDocumentIds(documentIds: string[]): Promise<DbDocumentTagLink[]> {
        const client = getRepositoryClient();
        if (!client || documentIds.length === 0) return [];
        const { data, error } = await client.from(this.table).select("*").in("document_id", documentIds);
        mapRepositoryError(error, "Failed to list document_tag_links");
        return (data ?? []) as DbDocumentTagLink[];
    }

    async create(input: Record<string, unknown>): Promise<DbDocumentTagLink | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create document_tag_links");
        return (data as DbDocumentTagLink | null) ?? null;
    }
}
