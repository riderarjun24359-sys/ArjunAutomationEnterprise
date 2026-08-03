import type {
    DbDdeDocumentHub,
    DbDdeDocumentType,
    DbDdeDocumentCategory,
    DbDdeDocumentTemplate,
    DbDdeDocumentVersion,
    DbDdeTemplateHeader,
    DbDdeTemplateFooter,
    DbDdeTemplateSection,
    DbDdeTemplateVariable,
    DbDdePdfGeneration,
    DbDdeHtmlGeneration,
    DbDdeExportJob,
    DbDdeBatchGeneration,
    DbDdeElectronicSignature,
    DbDdeApprovalSignature,
    DbDdeSignatureVerification,
    DbDdeSignatureAuditEntry,
    DbDdeVersionHistory,
    DbDdeRetentionPolicy,
    DbDdeArchiveRecord,
    DbDdeSharingPolicy,
    DbDdeEmailDelivery,
    DbDdeDownloadDelivery,
    DbDdeWebhookDelivery,
    DbDdeGenerationAnalytics,
    DbDdeDeliveryAnalytics,
    DbDdeStorageAnalytics,
    DbDdeDocumentMetric,
    DbDdeDocumentHealth,
    DbDdePendingSignature,
    DbDdeDocumentFailure,
    DbDdeAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgDdeRepository<T> extends BaseRepository<T> {
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

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class DdeDocumentHubRepository extends OrgDdeRepository<DbDdeDocumentHub> { protected table = "dde_document_hubs"; }
export class DdeDocumentTypeRepository extends OrgDdeRepository<DbDdeDocumentType> { protected table = "dde_document_types"; }
export class DdeDocumentCategoryRepository extends OrgDdeRepository<DbDdeDocumentCategory> { protected table = "dde_document_categories"; }
export class DdeDocumentTemplateRepository extends OrgDdeRepository<DbDdeDocumentTemplate> { protected table = "dde_document_templates"; }
export class DdeDocumentVersionRepository extends OrgDdeRepository<DbDdeDocumentVersion> { protected table = "dde_document_versions"; }
export class DdeTemplateHeaderRepository extends OrgDdeRepository<DbDdeTemplateHeader> { protected table = "dde_template_headers"; }
export class DdeTemplateFooterRepository extends OrgDdeRepository<DbDdeTemplateFooter> { protected table = "dde_template_footers"; }
export class DdeTemplateSectionRepository extends OrgDdeRepository<DbDdeTemplateSection> { protected table = "dde_template_sections"; }
export class DdeTemplateVariableRepository extends OrgDdeRepository<DbDdeTemplateVariable> { protected table = "dde_template_variables"; }
export class DdePdfGenerationRepository extends OrgDdeRepository<DbDdePdfGeneration> { protected table = "dde_pdf_generations"; }
export class DdeHtmlGenerationRepository extends OrgDdeRepository<DbDdeHtmlGeneration> { protected table = "dde_html_generations"; }
export class DdeExportJobRepository extends OrgDdeRepository<DbDdeExportJob> { protected table = "dde_export_jobs"; }
export class DdeBatchGenerationRepository extends OrgDdeRepository<DbDdeBatchGeneration> { protected table = "dde_batch_generations"; }
export class DdeElectronicSignatureRepository extends OrgDdeRepository<DbDdeElectronicSignature> { protected table = "dde_electronic_signatures"; }
export class DdeApprovalSignatureRepository extends OrgDdeRepository<DbDdeApprovalSignature> { protected table = "dde_approval_signatures"; }
export class DdeSignatureVerificationRepository extends OrgDdeRepository<DbDdeSignatureVerification> { protected table = "dde_signature_verifications"; }
export class DdeSignatureAuditEntryRepository extends OrgDdeRepository<DbDdeSignatureAuditEntry> { protected table = "dde_signature_audit_entries"; }
export class DdeVersionHistoryRepository extends OrgDdeRepository<DbDdeVersionHistory> { protected table = "dde_version_histories"; }
export class DdeRetentionPolicyRepository extends OrgDdeRepository<DbDdeRetentionPolicy> { protected table = "dde_retention_policies"; }
export class DdeArchiveRecordRepository extends OrgDdeRepository<DbDdeArchiveRecord> { protected table = "dde_archive_records"; }
export class DdeSharingPolicyRepository extends OrgDdeRepository<DbDdeSharingPolicy> { protected table = "dde_sharing_policies"; }
export class DdeEmailDeliveryRepository extends OrgDdeRepository<DbDdeEmailDelivery> { protected table = "dde_email_deliveries"; }
export class DdeDownloadDeliveryRepository extends OrgDdeRepository<DbDdeDownloadDelivery> { protected table = "dde_download_deliveries"; }
export class DdeWebhookDeliveryRepository extends OrgDdeRepository<DbDdeWebhookDelivery> { protected table = "dde_webhook_deliveries"; }
export class DdeGenerationAnalyticsRepository extends OrgDdeRepository<DbDdeGenerationAnalytics> { protected table = "dde_generation_analytics"; }
export class DdeDeliveryAnalyticsRepository extends OrgDdeRepository<DbDdeDeliveryAnalytics> { protected table = "dde_delivery_analytics"; }
export class DdeStorageAnalyticsRepository extends OrgDdeRepository<DbDdeStorageAnalytics> { protected table = "dde_storage_analytics"; }
export class DdeDocumentMetricRepository extends OrgDdeRepository<DbDdeDocumentMetric> { protected table = "dde_document_metrics"; }
export class DdeDocumentHealthRepository extends OrgDdeRepository<DbDdeDocumentHealth> { protected table = "dde_document_health"; }
export class DdePendingSignatureRepository extends OrgDdeRepository<DbDdePendingSignature> { protected table = "dde_pending_signatures"; }
export class DdeDocumentFailureRepository extends OrgDdeRepository<DbDdeDocumentFailure> { protected table = "dde_document_failures"; }
export class DdeAuditLogRepository extends OrgDdeRepository<DbDdeAuditLog> { protected table = "dde_audit_logs"; }
